from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
from google.oauth2 import id_token
from google.auth.transport import requests
from flask_cors import CORS  # Import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes in your app

app.secret_key = "your_secret_key_here"

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'transgenderdosti'

mysql = MySQL(app)

# Specify your Google API client ID
CLIENT_ID = '874616982007-pvupdujpjic356kk9cmteqjicfvf47f4.apps.googleusercontent.com'

# @app.route('/authenticate', methods=['POST'])
# def authenticate_user():
#     token = request.json.get('idToken', None)
#     print(token)
#
#     if token is None:
#         return jsonify({'error': 'Invalid token'}), 400
#
#     try:
#         idinfo = id_token.verify_oauth2_token(token, requests.Request(), CLIENT_ID)
#         userid = idinfo['sub']
#         name = idinfo.get('name', '')
#         print(userid)
#         print(name)
#
#         # Check if the user is already in your database and establish a session
#
#         # Example: Check if the user is in the database by querying the MySQL database
#         # cursor = mysql.connection.cursor()
#         # cursor.execute("SELECT * FROM users WHERE google_id = %s", (userid,))
#         # user = cursor.fetchone()
#
#         # If the user is not in the database, create a new user record
#
#         # Return a success response
#         return jsonify({'success': True}), 200
#
#     except ValueError as e:
#         # Invalid token
#         return jsonify({'error': 'Invalid token'}), 400

@app.route('/authenticate', methods=['POST'])
def authenticate_user():
    try:
        data = request.json
        token = data.get('idToken', None)
        role = data.get('role', None)

        if token is None:
            return jsonify({'error': 'Invalid token'}), 400

        idinfo = id_token.verify_oauth2_token(token, requests.Request(), CLIENT_ID)
        userid = idinfo['sub']
        email = idinfo['email']
        name = idinfo.get('name', '')
        picture = idinfo.get('picture', '')

        # Check if the user is already in your database based on Google ID or email
        cursor = mysql.connection.cursor()
        cursor.execute("SELECT * FROM user WHERE google_id = %s OR email = %s", (userid, email))
        user = cursor.fetchone()

        if user:
            # If the user is already in the database, determine user type
            user_id = user[0]

            # Check if the user is a teacher
            cursor.execute("SELECT * FROM teacher WHERE user_id = %s", (user_id,))
            teacher = cursor.fetchone()

            if teacher:
                # User is a teacher
                return jsonify({'success': True, 'user_id': user_id, 'name': name, 'email': email, 'user_type': 'teacher', 'profile_picture': picture}), 200

            # Check if the user is a learner
            cursor.execute("SELECT * FROM learner WHERE user_id = %s", (user_id,))
            learner = cursor.fetchone()

            if learner:
                # User is a learner
                return jsonify({'success': True, 'user_id': user_id, 'name': name, 'email': email, 'user_type': 'learner', 'profile_picture': picture}), 200

            # If the user is not in the teacher or learner table, return an error
            return jsonify({'error': 'User type not found'}), 500

        # If the user is not in the database, create a new user record
        cursor.execute("INSERT INTO user (full_name, email, google_id, profile_picture) VALUES (%s, %s, %s, %s)", (name, email, userid, picture))
        user_id = cursor.lastrowid

        if role == 'teacher':
            # If the role is a teacher, insert into the teacher table
            cursor.execute("INSERT INTO teacher (user_id) VALUES (%s)", (user_id,))
            user_type = 'teacher'
        elif role == 'learner':
            # If the role is a learner, insert into the learner table
            cursor.execute("INSERT INTO learner (user_id) VALUES (%s)", (user_id,))
            user_type = 'learner'

        mysql.connection.commit()
        cursor.close()

        # Return user information with user type
        return jsonify({'success': True, 'user_id': user_id, 'name': name, 'email': email, 'user_type': user_type, 'profile_picture': picture}), 200

    except ValueError as e:
        # Invalid token
        return jsonify({'error': 'Invalid token'}), 400





@app.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.json
        full_name = data.get('fullname')
        email = data.get('email')
        password = data.get('password')
        role = data.get('role')

        # Check if the email already exists
        cursor = mysql.connection.cursor()
        cursor.execute("SELECT * FROM user WHERE email = %s", (email,))
        existing_user = cursor.fetchone()

        if existing_user:
            return jsonify({'error': 'Email already exists'}), 400

        # Insert user into the main users table
        cursor.execute("INSERT INTO user (full_name, email, password) VALUES (%s, %s, %s)", (full_name, email, password))
        user_id = cursor.lastrowid

        if role == 'teacher':
            # If the role is a teacher, insert into the teacher table
            cursor.execute("INSERT INTO teacher (user_id) VALUES (%s)", (user_id,))

        elif role == 'learner':
            # If the role is a learner, insert into the learner table
            cursor.execute("INSERT INTO learner (user_id) VALUES (%s)", (user_id,))

        mysql.connection.commit()
        cursor.close()

        return jsonify({'success': True, 'user_id': user_id}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/signin', methods=['POST'])
def signin():
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')

        cursor = mysql.connection.cursor()

        # Check if the user exists in the 'user' table
        cursor.execute("SELECT * FROM user WHERE email = %s AND password = %s", (email, password))
        user = cursor.fetchone()

        if not user:
            return jsonify({'error': 'Invalid credentials'}), 401

        # Get the user_id from the tuple
        user_id = user[0]

        # Check if the user is a teacher
        cursor.execute("SELECT * FROM teacher WHERE user_id = %s", (user_id,))
        teacher = cursor.fetchone()

        if teacher:
            # User is a teacher
            return jsonify({'success': True, 'user_type': 'teacher'}), 200

        # Check if the user is a learner
        cursor.execute("SELECT * FROM learner WHERE user_id = %s", (user_id,))
        learner = cursor.fetchone()

        if learner:
            # User is a learner
            return jsonify({'success': True, 'user_type': 'learner'}), 200

        # If the user is not a teacher or learner, return an error
        return jsonify({'error': 'User type not found'}), 500

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
