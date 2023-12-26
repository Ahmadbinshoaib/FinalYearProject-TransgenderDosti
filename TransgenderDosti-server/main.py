import os

from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
from google.oauth2 import id_token
from google.auth.transport import requests
from flask_cors import CORS  # Import CORS
import base64
from io import BytesIO
from PIL import Image

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
            user_type = 'teacher'
        elif role == 'learner':
            # If the role is a learner, insert into the learner table
            cursor.execute("INSERT INTO learner (user_id) VALUES (%s)", (user_id,))
            user_type = 'learner'

        mysql.connection.commit()
        cursor.close()

        # Return user information
        return jsonify({'success': True, 'user_id': user_id, 'name': full_name, 'email': email, 'user_type': user_type}), 200

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

        # Get user information
        user_id, user_name, user_email = user[0], user[1], user[2]

        # Check if the user is a teacher
        cursor.execute("SELECT * FROM teacher WHERE user_id = %s", (user_id,))
        teacher = cursor.fetchone()

        if teacher:
            # User is a teacher
            return jsonify({'success': True, 'user_type': 'teacher', 'user_id': user_id, 'name': user_name, 'email': user_email}), 200

        # Check if the user is a learner
        cursor.execute("SELECT * FROM learner WHERE user_id = %s", (user_id,))
        learner = cursor.fetchone()

        if learner:
            # User is a learner
            return jsonify({'success': True, 'user_type': 'learner', 'user_id': user_id, 'name': user_name, 'email': user_email}), 200

        # If the user is not a teacher or learner, return an error
        return jsonify({'error': 'User type not found'}), 500

    except Exception as e:
        return jsonify({'error': str(e)}), 500




    # Courses

@app.route('/get_courses', methods=['GET'])
def get_courses():
    try:
        user_id = request.args.get('user_id')

        cursor = mysql.connection.cursor()

        # Get teacher_id based on user_id
        cursor.execute("SELECT teacher_id FROM teacher WHERE user_id = %s", (user_id,))
        teacher_result = cursor.fetchone()

        if not teacher_result:
            return jsonify({'error': 'Teacher not found for the given user ID'}), 404

        teacher_id = teacher_result[0]

        # Get courses based on teacher_id
        cursor.execute("SELECT * FROM course WHERE teacher_id = %s", (teacher_id,))
        courses = cursor.fetchall()

        course_list = []
        for course in courses:
            course_data = {
                'course_id': course[0],
                'title': course[2],
                'course_code': course[3],
                'details': course[4],
                'course_for': course[5],
                'course_fee': course[6],
                'course_duration': course[7],
                'course_video_url': course[8],
            }
            course_list.append(course_data)

        cursor.close()

        return jsonify({'success': True, 'courses': course_list}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/teacher_profile_personalinfo', methods=['POST'])
def teacher_profile_personalinfo():
    try:
        data = request.json
        userid = data.get('user_id')
        print(userid)
        phone_number = data.get('phonenumber')
        bio = data.get('bio')
        print(bio)
        city_town = data.get('city')
        gender = data.get('gender')
        cnic_picture = data.get('cnic_picture')  # Assuming this is a file path or base64 encoded image
        country = data.get('country')
        profile_picture = data.get('profile_picture')  # Assuming this is a file path or base64 encoded image
        print(profile_picture)

        cursor = mysql.connection.cursor()

        # Check if the teacher exists based on the provided user ID
        cursor.execute("SELECT * FROM teacher WHERE user_id = %s", (userid,))
        teacher = cursor.fetchone()

        if not teacher:
            return jsonify({'error': 'Teacher not found for the given user ID'}), 404

        # Update the teacher's profile personal information
        cursor.execute("""
            UPDATE teacher
            SET phone_number = %s, bio = %s, city_town = %s, gender = %s,
                cnic_picture = %s, country = %s, profile_picture = %s
            WHERE user_id = %s
        """, (phone_number, bio, city_town, gender, cnic_picture, country, profile_picture, userid))

        mysql.connection.commit()
        cursor.close()

        return jsonify({'success': True, 'message': 'Teacher profile personal information updated successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/get_teacherprofile_personalinfo', methods=['GET'])
def get_teacher_data():
    try:
        user_id = request.args.get('user_id')

        cursor = mysql.connection.cursor()

        # Check if the teacher exists based on the provided user ID
        cursor.execute("SELECT * FROM teacher WHERE user_id = %s", (user_id,))
        teacher = cursor.fetchone()

        if not teacher:
            return jsonify({'error': 'Teacher not found for the given user ID'}), 404

        # Extract teacher data
        teacher_data = {
            'teacher_id': teacher[0],
            'user_id': teacher[1],
            'phone_number': teacher[2],
            'bio': teacher[3],
            'city_town': teacher[4],
            'gender': teacher[5],
            'cnic_picture': teacher[6],
            'country': teacher[7],
            'profile_picture': teacher[8],
        }

        cursor.close()

        return jsonify({'success': True, 'teacher_data': teacher_data}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/save_educational_info', methods=['POST'])
def save_educational_info():
    try:
        data = request.json
        user_id = data.get('user_id')

        cursor = mysql.connection.cursor()

        # Get teacher_id based on user_id
        cursor.execute("SELECT teacher_id FROM teacher WHERE user_id = %s", (user_id,))
        teacher_result = cursor.fetchone()

        if not teacher_result:
            return jsonify({'error': 'Teacher not found for the given user ID'}), 404

        teacher_id = teacher_result[0]

        # Extract educational information from the request data
        institution_name = data.get('institution_name')
        degree_name = data.get('degree_name')
        field_of_study = data.get('field_of_study')
        start_date = data.get('start_date')
        end_date = data.get('end_date')
        is_current = data.get('is_current')

        # Save educational information in the education table
        cursor.execute("""
            INSERT INTO educationalbackground
            (teacher_id, institution_name, degree_name, field_of_study, start_date, end_date, is_current)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (teacher_id, institution_name, degree_name, field_of_study, start_date, end_date, is_current))

        mysql.connection.commit()
        cursor.close()

        return jsonify({'success': True, 'message': 'Educational information saved successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/save_work_info', methods=['POST'])
def save_work_info():
    try:
        data = request.json
        user_id = data.get('user_id')

        cursor = mysql.connection.cursor()

        # Get teacher_id based on user_id
        cursor.execute("SELECT teacher_id FROM teacher WHERE user_id = %s", (user_id,))
        teacher_result = cursor.fetchone()

        if not teacher_result:
            return jsonify({'error': 'Teacher not found for the given user ID'}), 404

        teacher_id = teacher_result[0]

        # Extract educational information from the request data
        job_title = data.get('job_title')
        company_workplace_name = data.get('company_workplace_name')
        city_town = data.get('city_town')
        country= data.get('country')
        description = data.get('description')
        start_date = data.get('start_date')
        end_date = data.get('end_date')
        is_current = data.get('is_current')

        #print (teacher_id,job_title,company_workplace_name,city_town,country,description,start_date,end_date,is_current )

   




        # Save educational information in the education table
        cursor.execute("""
            INSERT INTO workexperience
            (teacher_id, job_title, company_workplace_name, city_town, country,description, start_date, end_date, is_current)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (teacher_id, job_title, company_workplace_name, city_town,country,description, start_date, end_date, is_current))

        mysql.connection.commit()
        cursor.close()

        return jsonify({'success': True, 'message': 'Work information saved successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    




@app.route('/save_language_info', methods=['POST'])
def save_language_info():
    try:
        data = request.json
        user_id = data.get('user_id')

        cursor = mysql.connection.cursor()

        # Get teacher_id based on user_id
        cursor.execute("SELECT teacher_id FROM teacher WHERE user_id = %s", (user_id,))
        teacher_result = cursor.fetchone()

        if not teacher_result:
            return jsonify({'error': 'Teacher not found for the given user ID'}), 404

        teacher_id = teacher_result[0]

        # Extract educational information from the request data
        language = data.get('language')

        #print (teacher_id,job_title,company_workplace_name,city_town,country,description,start_date,end_date,is_current )

   




        # Save educational information in the education table
        cursor.execute("""
            INSERT INTO languageproficiency
            (teacher_id, language)
            VALUES (%s, %s)
        """, (teacher_id, language))

        mysql.connection.commit()
        cursor.close()

        return jsonify({'success': True, 'message': 'language information saved successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500




@app.route('/get_educational_info', methods=['GET'])
def get_educational_info():
    try:
        user_id = request.args.get('user_id')

        cursor = mysql.connection.cursor()

        # Get teacher_id based on user_id
        cursor.execute("SELECT teacher_id FROM teacher WHERE user_id = %s", (user_id,))
        teacher_result = cursor.fetchone()

        if not teacher_result:
            return jsonify({'error': 'Teacher not found for the given user ID'}), 404

        teacher_id = teacher_result[0]

        # Get educational information based on teacher_id
        cursor.execute("""
            SELECT *
            FROM educationalbackground
            WHERE teacher_id = %s
        """, (teacher_id,))
        educational_info = cursor.fetchall()

        educational_list = []
        for edu_row in educational_info:
            edu_data = {
                'educational_background_id': edu_row[0],
                'institution_name': edu_row[2],
                'degree_name': edu_row[3],
                'field_of_study': edu_row[4],
                'start_date': edu_row[5],
                'end_date': edu_row[6],
                'is_current': edu_row[7],
            }
            educational_list.append(edu_data)

        cursor.close()

        return jsonify({'success': True, 'educational_info': educational_list}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    


@app.route('/get_work_info', methods=['GET'])
def get_work_info():
    try:
        user_id = request.args.get('user_id')

        cursor = mysql.connection.cursor()

        # Get teacher_id based on user_id
        cursor.execute("SELECT teacher_id FROM teacher WHERE user_id = %s", (user_id,))
        teacher_result = cursor.fetchone()

        if not teacher_result:
            return jsonify({'error': 'Teacher not found for the given user ID'}), 404

        teacher_id = teacher_result[0]

        # Get educational information based on teacher_id
        cursor.execute("""
            SELECT *
            FROM workexperience
            WHERE teacher_id = %s
        """, (teacher_id,))
        work_info = cursor.fetchall()

        work_list = []
        for work_row in work_info:
            work_data = {
                'work_experience_id': work_row[0],
                'job_title': work_row[2],
                'company_workplace_name': work_row[3],
                'city_town': work_row[4],
                'country': work_row[5],
                'description': work_row[6],
                'start_date': work_row[7],
                'end_date': work_row[8],
                'is_current': work_row[9],
            }
            work_list.append(work_data)

        cursor.close()

        return jsonify({'success': True, 'work_info': work_list}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    


@app.route('/get_language_info', methods=['GET'])
def get_language_info():
    try:
        user_id = request.args.get('user_id')

        cursor = mysql.connection.cursor()

        # Get teacher_id based on user_id
        cursor.execute("SELECT teacher_id FROM teacher WHERE user_id = %s", (user_id,))
        teacher_result = cursor.fetchone()

        if not teacher_result:
            return jsonify({'error': 'Teacher not found for the given user ID'}), 404

        teacher_id = teacher_result[0]

        # Get educational information based on teacher_id
        cursor.execute("""
            SELECT *
            FROM languageproficiency
            WHERE teacher_id = %s
        """, (teacher_id,))
        language_info = cursor.fetchall()

        language_list = []
        for language_row in language_info:
            language_data = {
                'language_proficiency_id': language_row[0],
                'language': language_row[2],
            }
            language_list.append(language_data)

        cursor.close()

        return jsonify({'success': True, 'language_info': language_list}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/get_educational_info_by_id', methods=['GET'])
def get_educational_info_by_id():
    try:
        educational_id = request.args.get('educational_id')

        cursor = mysql.connection.cursor()

        # Get educational information based on educational_id
        cursor.execute("""
            SELECT *
            FROM educationalbackground
            WHERE educational_background_id = %s
        """, (educational_id,))
        educational_info = cursor.fetchone()

        if not educational_info:
            return jsonify({'error': 'Educational information not found for the given ID'}), 404

        educational_data = {
            'educational_background_id': educational_info[0],
            'institution_name': educational_info[2],
            'degree_name': educational_info[3],
            'field_of_study': educational_info[4],
            'start_date': educational_info[5],
            'end_date': educational_info[6],
            'is_current': educational_info[7],
        }

        cursor.close()

        return jsonify({'success': True, 'educational_info': educational_data}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    



@app.route('/get_work_info_by_id', methods=['GET'])
def get_work_info_by_id():
    try:
        work_id = request.args.get('work_id')

        cursor = mysql.connection.cursor()

        # Get educational information based on educational_id
        cursor.execute("""
            SELECT *
            FROM workexperience
            WHERE work_experience_id = %s
        """, (work_id,))
        work_info = cursor.fetchone()

        if not work_info:
            return jsonify({'error': 'Educational information not found for the given ID'}), 404

        work_data = {
            'work_experience_id': work_info[0],
            'job_title': work_info[2],
            'company_workplace_name': work_info[3],
            'city_town': work_info[4],
            'country': work_info[5],
            'description': work_info[6],
            'start_date': work_info[7],
            'end_date': work_info[8],
            'is_current': work_info[9],

        }

        cursor.close()

        return jsonify({'success': True, 'work_info': work_data}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/update_educational_info', methods=['PUT'])
def update_educational_info():
    try:
        data = request.json
        user_id = data.get('user_id')
        educational_background_id = data.get('educational_background_id')

        cursor = mysql.connection.cursor()

        # Get teacher_id based on user_id
        cursor.execute("SELECT teacher_id FROM teacher WHERE user_id = %s", (user_id,))
        teacher_result = cursor.fetchone()

        if not teacher_result:
            return jsonify({'error': 'Teacher not found for the given user ID'}), 404

        teacher_id = teacher_result[0]

        # Extract educational information from the request data
        institution_name = data.get('institution_name')
        degree_name = data.get('degree_name')
        field_of_study = data.get('field_of_study')
        start_date = data.get('start_date')
        end_date = data.get('end_date')
        is_current = data.get('is_current')

        # Update educational information in the education table
        cursor.execute("""
            UPDATE educationalbackground
            SET institution_name = %s, degree_name = %s, field_of_study = %s,
                start_date = %s, end_date = %s, is_current = %s
            WHERE teacher_id = %s AND educational_background_id = %s
        """, (institution_name, degree_name, field_of_study, start_date, end_date, is_current, teacher_id, educational_background_id))

        mysql.connection.commit()
        cursor.close()

        return jsonify({'success': True, 'message': 'Educational information updated successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/update_work_info', methods=['PUT'])
def update_work_info():
    try:
        data = request.json
        user_id = data.get('user_id')
        work_experience_id = data.get('work_experience_id')

        cursor = mysql.connection.cursor()

        # Get teacher_id based on user_id
        cursor.execute("SELECT teacher_id FROM teacher WHERE user_id = %s", (user_id,))
        teacher_result = cursor.fetchone()

        if not teacher_result:
            return jsonify({'error': 'Teacher not found for the given user ID'}), 404

        teacher_id = teacher_result[0]

        # Extract work information from the request data
        job_title = data.get('job_title')
        company_workplace_name = data.get('company_workplace_name')
        city_town = data.get('city_town')
        country = data.get('country')
        description = data.get('description')
        start_date = data.get('start_date')
        end_date = data.get('end_date')
        is_current = data.get('is_current')

        # Update work information in the workexperience table
        cursor.execute("""
            UPDATE workexperience
            SET job_title = %s, company_workplace_name = %s, city_town = %s, country = %s,
                description = %s, start_date = %s, end_date = %s, is_current = %s
            WHERE teacher_id = %s AND work_experience_id = %s
        """, (job_title, company_workplace_name, city_town, country, description, start_date, end_date, is_current, teacher_id, work_experience_id))

        mysql.connection.commit()
        cursor.close()

        return jsonify({'success': True, 'message': 'Work information updated successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

@app.route('/delete_educational_info', methods=['DELETE'])
def delete_educational_info():
    try:
        user_id = request.args.get('userId')
        educational_background_id = request.args.get('educationalBackgroundId')

        cursor = mysql.connection.cursor()

        # Get teacher_id based on user_id
        cursor.execute("SELECT teacher_id FROM teacher WHERE user_id = %s", (user_id,))
        teacher_result = cursor.fetchone()

        if not teacher_result:
            return jsonify({'error': 'Teacher not found for the given user ID'}), 404

        teacher_id = teacher_result[0]

        # Delete educational information from the education table
        cursor.execute("""
            DELETE FROM educationalbackground
            WHERE teacher_id = %s AND educational_background_id = %s
        """, (teacher_id, educational_background_id))

        mysql.connection.commit()
        cursor.close()

        return jsonify({'success': True, 'message': 'Educational information deleted successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/delete_work_info', methods=['DELETE'])
def delete_work_info():
    try:
        user_id = request.args.get('userId')
        work_experience_id = request.args.get('workExperienceId')

        cursor = mysql.connection.cursor()

        # Get teacher_id based on user_id
        cursor.execute("SELECT teacher_id FROM teacher WHERE user_id = %s", (user_id,))
        teacher_result = cursor.fetchone()

        if not teacher_result:
            return jsonify({'error': 'Teacher not found for the given user ID'}), 404

        teacher_id = teacher_result[0]

        # Delete work information from the workexperience table
        cursor.execute("""
            DELETE FROM workexperience
            WHERE teacher_id = %s AND work_experience_id = %s
        """, (teacher_id, work_experience_id))

        mysql.connection.commit()
        cursor.close()

        return jsonify({'success': True, 'message': 'Work information deleted successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500



if __name__ == '__main__':
    app.run(debug=True)
