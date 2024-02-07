import os

# import speech as speech
from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS

from google.oauth2 import service_account
# from pydub import AudioSegment
from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
from google.oauth2 import id_token
from google.auth.transport import requests
from flask_cors import CORS  # Import CORS
import base64
from io import BytesIO
#voice libraries 
from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
# from google.cloud import speech_v1p1beta1 as speech
from google.oauth2 import service_account
from pydub import AudioSegment

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
                'course_picture':course[9]
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
    

@app.route('/learner_profile_personalinfo', methods=['POST'])
def learner_profile_personalinfo():
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
        cursor.execute("SELECT * FROM learner WHERE user_id = %s", (userid,))
        learner = cursor.fetchone()

        if not learner:
            return jsonify({'error': 'Teacher not found for the given user ID'}), 404

        # Update the teacher's profile personal information
        cursor.execute("""
            UPDATE learner
            SET phone_number = %s, bio = %s, city_town = %s, gender = %s,
                cnic_picture = %s, country = %s, profile_picture = %s
            WHERE user_id = %s
        """, (phone_number, bio, city_town, gender, cnic_picture, country, profile_picture, userid))

        mysql.connection.commit()
        cursor.close()

        return jsonify({'success': True, 'message': 'learner profile personal information updated successfully'}), 200

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
    
@app.route('/get_learnerprofile_personalinfo', methods=['GET'])
def get_learner_data():
    try:
        user_id = request.args.get('user_id')
        cursor = mysql.connection.cursor()

        # Check if the teacher exists based on the provided user ID
        cursor.execute("SELECT * FROM learner WHERE user_id = %s", (user_id,))
        learner = cursor.fetchone()

        if not learner:
            return jsonify({'error': 'Learner not found for the given user ID'}), 404

        # Extract teacher data
        learner_data = {
            'learner_id': learner[0],
            'user_id': learner[1],
            'phone_number': learner[2],
            'cnic_picture': learner[3],
            'bio': learner[4],
            'city_town': learner[5],
            'country': learner[6],
            'gender': learner[7],
            'profile_picture': learner[8],
        }

        cursor.close()

        return jsonify({'success': True, 'learner_data': learner_data}), 200

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




@app.route('/save_social_info', methods=['POST'])
def save_social_info():
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
        platform_name = data.get('platform_name')
        profile_url = data.get('profile_url')
        

        #print (teacher_id,job_title,company_workplace_name,city_town,country,description,start_date,end_date,is_current )

   




        # Save educational information in the education table
        cursor.execute("""
            INSERT INTO teachersocialmediaprofile
            (teacher_id, platform_name, profile_url)
            VALUES (%s, %s, %s)
        """, (teacher_id, platform_name, profile_url))

        mysql.connection.commit()
        cursor.close()

        return jsonify({'success': True, 'message': 'Social information saved successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/save_socialLearner_info', methods=['POST'])
def save_socialLearner_info():
    try:
        data = request.json
        user_id = data.get('user_id')

        cursor = mysql.connection.cursor()

        # Get learner_id based on user_id
        cursor.execute("SELECT learner_id FROM learner WHERE user_id = %s", (user_id,))
        learner_result = cursor.fetchone()

        if not learner_result:
            return jsonify({'error': 'Teacher not found for the given user ID'}), 404

        learner_id = learner_result[0]

        # Extract educational information from the request data
        platform_name = data.get('platform_name')
        profile_url = data.get('profile_url')
        

        #print (teacher_id,job_title,company_workplace_name,city_town,country,description,start_date,end_date,is_current )

   




        # Save educational information in the education table
        cursor.execute("""
            INSERT INTO learnersocialmediaprofile
            (learner_id, platform_name, profile_url)
            VALUES (%s, %s, %s)
        """, (learner_id, platform_name, profile_url))

        mysql.connection.commit()
        cursor.close()

        return jsonify({'success': True, 'message': 'Social information saved successfully for learner'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    



@app.route('/save_website_info', methods=['POST'])
def save_website_info():
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
        website_name = data.get('website_name')
        website_url = data.get('website_url')
        

        #print (teacher_id,job_title,company_workplace_name,city_town,country,description,start_date,end_date,is_current )

   




        # Save educational information in the education table
        cursor.execute("""
            INSERT INTO teacherwebsite
            (teacher_id, website_name, website_url)
            VALUES (%s, %s, %s)
        """, (teacher_id, website_name, website_url))

        mysql.connection.commit()
        cursor.close()

        return jsonify({'success': True, 'message': 'Website information saved successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

@app.route('/save_websiteLearner_info', methods=['POST'])
def save_websiteLearner_info():
    try:
        data = request.json
        user_id = data.get('user_id')

        cursor = mysql.connection.cursor()

        # Get learner_id based on user_id
        cursor.execute("SELECT learner_id FROM learner WHERE user_id = %s", (user_id,))
        learner_result = cursor.fetchone()


        if not learner_result:
            return jsonify({'error': 'Teacher not found for the given user ID'}), 404

        learner_id = learner_result[0]

        # Extract educational information from the request data
        website_name = data.get('website_name')
        website_url = data.get('website_url')
        

        #print (teacher_id,job_title,company_workplace_name,city_town,country,description,start_date,end_date,is_current )

   




        # Save educational information in the education table
        cursor.execute("""
            INSERT INTO learnerwebsite
            (learner_id, website_name, website_url)
            VALUES (%s, %s, %s)
        """, (learner_id, website_name, website_url))

        mysql.connection.commit()
        cursor.close()

        return jsonify({'success': True, 'message': 'Website information saved successfully for teacher'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    




@app.route('/save_certificate_info', methods=['POST'])
def save_certificate_info():
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
        certificate_name = data.get('certificate_name')
        description = data.get('description')
        issuing_organization = data.get('issuing_organization')
        issue_date= data.get('issue_date')
        credential_id = data.get('credential_id')
        credential_url = data.get('credential_url')
        

        #print (teacher_id,job_title,company_workplace_name,city_town,country,description,start_date,end_date,is_current )

   




        # Save educational information in the education table
        cursor.execute("""
            INSERT INTO additionalcertificate
            (teacher_id, certificate_name, description, issuing_organization, issue_date,credential_id, credential_url)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (teacher_id, certificate_name, description, issuing_organization,issue_date,credential_id, credential_url))

        mysql.connection.commit()
        cursor.close()

        return jsonify({'success': True, 'message': 'certificate information saved successfully'}), 200

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
    

@app.route('/get_social_info', methods=['GET'])
def get_social_info():
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
            FROM teachersocialmediaprofile
            WHERE teacher_id = %s
        """, (teacher_id,))
        social_info = cursor.fetchall()

        social_list = []
        for social_row in social_info:
            social_data = {
                'social_media_profile_id': social_row[0],
                'platform_name': social_row[2],
                'profile_url': social_row[3],
               
            }
            social_list.append(social_data)

        cursor.close()

        return jsonify({'success': True, 'social_info': social_list}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

@app.route('/get_socialLearner_info', methods=['GET'])
def get_socialLearner_info():
    try:
        user_id = request.args.get('user_id')

        cursor = mysql.connection.cursor()

        # Get teacher_id based on user_id
        cursor.execute("SELECT learner_id FROM learner WHERE user_id = %s", (user_id,))
        learner_result = cursor.fetchone()

        if not learner_result:
            return jsonify({'error': 'Teacher not found for the given user ID'}), 404

        learner_id = learner_result[0]

        # Get educational information based on teacher_id
        cursor.execute("""
            SELECT *
            FROM learnersocialmediaprofile
            WHERE learner_id = %s
        """, (learner_id,))
        social_info = cursor.fetchall()

        social_list = []
        for social_row in social_info:
            social_data = {
                'social_media_profile_id': social_row[0],
                'platform_name': social_row[2],
                'profile_url': social_row[3],
               
            }
            social_list.append(social_data)

        cursor.close()

        return jsonify({'success': True, 'social_info': social_list}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    


@app.route('/get_website_info', methods=['GET'])
def get_website_info():
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
            FROM teacherwebsite
            WHERE teacher_id = %s
        """, (teacher_id,))
        website_info = cursor.fetchall()

        website_list = []
        for website_row in website_info:
            website_data = {
                'website_id': website_row[0],
                'website_name': website_row[2],
                'website_url': website_row[3],
               
            }
            website_list.append(website_data)

        cursor.close()

        return jsonify({'success': True, 'website_info': website_list}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    


@app.route('/get_websiteLearner_info', methods=['GET'])
def get_websiteLearner_info():
    try:
        user_id = request.args.get('user_id')

        cursor = mysql.connection.cursor()

        # Get teacher_id based on user_id
        cursor.execute("SELECT learner_id FROM learner WHERE user_id = %s", (user_id,))
        learner_result = cursor.fetchone()

        if not learner_result:
            return jsonify({'error': 'Teacher not found for the given user ID'}), 404

        learner_id = learner_result[0]

        # Get educational information based on teacher_id
        cursor.execute("""
            SELECT *
            FROM learnerwebsite
            WHERE learner_id = %s
        """, (learner_id,))
        website_info = cursor.fetchall()

        website_list = []
        for website_row in website_info:
            website_data = {
                'website_id': website_row[0],
                'website_name': website_row[2],
                'website_url': website_row[3],
               
            }
            website_list.append(website_data)

        cursor.close()

        return jsonify({'success': True, 'website_info': website_list}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/get_certificate_info', methods=['GET'])
def get_certificate_info():
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
            FROM additionalcertificate
            WHERE teacher_id = %s
        """, (teacher_id,))
        certificate_info = cursor.fetchall()

        certificate_list = []
        for certificate_row in certificate_info:
            certificate_data = {
                'additional_certificate_id': certificate_row[0],
                'certificate_name': certificate_row[2],
                'description': certificate_row[3],
                'issuing_organization': certificate_row[4],
                'issue_date': certificate_row[5],
                'credential_id': certificate_row[6],
                'credential_url': certificate_row[7],
                
            }
            certificate_list.append(certificate_data)

        cursor.close()

        return jsonify({'success': True, 'certificate_info': certificate_list}), 200

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


@app.route('/get_social_info_by_id', methods=['GET'])
def get_social_info_by_id():
    try:
        social_id = request.args.get('social_id')

        cursor = mysql.connection.cursor()

        # Get educational information based on educational_id
        cursor.execute("""
            SELECT *
            FROM teachersocialmediaprofile
            WHERE social_media_profile_id = %s
        """, (social_id,))
        social_info = cursor.fetchone()

        if not social_info:
            return jsonify({'error': 'Educational information not found for the given ID'}), 404

        social_data = {
            'social_media_profile_id': social_info[0],
            'platform_name': social_info[2],
            'profile_url': social_info[3],
            

        }

        cursor.close()

        return jsonify({'success': True, 'social_info': social_data}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    



@app.route('/get_website_info_by_id', methods=['GET'])
def get_website_info_by_id():
    try:
        website_id = request.args.get('website_id')

        cursor = mysql.connection.cursor()

        # Get educational information based on educational_id
        cursor.execute("""
            SELECT *
            FROM teacherwebsite
            WHERE website_id = %s
        """, (website_id,))
        website_info = cursor.fetchone()

        if not website_info:
            return jsonify({'error': 'Educational information not found for the given ID'}), 404

        website_data = {
            'website_id': website_info[0],
            'website_name': website_info[2],
            'website_url': website_info[3],
            

        }

        cursor.close()

        return jsonify({'success': True, 'website_info': website_data}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    



@app.route('/get_certificate_info_by_id', methods=['GET'])
def get_certificate_info_by_id():
    try:
        certificate_id = request.args.get('certificate_id')

        cursor = mysql.connection.cursor()

        # Get educational information based on educational_id
        cursor.execute("""
            SELECT *
            FROM additionalcertificate
            WHERE additional_certificate_id = %s
        """, (certificate_id,))
        certificate_info = cursor.fetchone()

        if not certificate_info:
            return jsonify({'error': 'Certificate information not found for the given ID'}), 404

        certificate_data = {
            'additional_certificate_id': certificate_info[0],
            'certificate_name': certificate_info[2],
            'description': certificate_info[3],
            'issuing_organization': certificate_info[4],
            'issue_date': certificate_info[5],
            'credential_id': certificate_info[6],
            'credential_url': certificate_info[7],

        }

        cursor.close()

        return jsonify({'success': True, 'certificate_info': certificate_data}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/get_language_info_by_id', methods=['GET'])
def get_language_info_by_id():
    try:
        language_proficiency_id = request.args.get('language_id')

        cursor = mysql.connection.cursor()

        # Get educational information based on educational_id
        cursor.execute("""
            SELECT *
            FROM languageproficiency
            WHERE language_proficiency_id = %s
        """, (language_proficiency_id,))
        language_info = cursor.fetchone()

        if not language_info:
            return jsonify({'error': 'Educational information not found for the given ID'}), 404

        language_data = {
            'language_proficiency_id': language_info[0],
            'language': language_info[2],

        }

        cursor.close()


        return jsonify({'success': True, 'language_info': language_data}), 200

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


@app.route('/update_certificate_info', methods=['PUT'])
def update_certificate_info():
    try:
        data = request.json
        user_id = data.get('user_id')
        additional_certificate_id  = data.get('additional_certificate_id')

        cursor = mysql.connection.cursor()

        # Get teacher_id based on user_id
        cursor.execute("SELECT teacher_id FROM teacher WHERE user_id = %s", (user_id,))
        teacher_result = cursor.fetchone()

        if not teacher_result:
            return jsonify({'error': 'Teacher not found for the given user ID'}), 404

        teacher_id = teacher_result[0]

        # Extract work information from the request data
        certificate_name = data.get('certificate_name')
        description = data.get('description')
        issuing_organization = data.get('issuing_organization')
        issue_date = data.get('issue_date')
        credential_id = data.get('credential_id')
        credential_url = data.get('credential_url')
        

        # Update work information in the workexperience table
        cursor.execute("""
            UPDATE additionalcertificate
            SET certificate_name = %s, description = %s, issuing_organization = %s, issue_date = %s,
                credential_id = %s, credential_url = %s
            WHERE teacher_id = %s AND additional_certificate_id = %s
        """, (certificate_name, description, issuing_organization, issue_date, credential_id, credential_url, teacher_id, additional_certificate_id))

        mysql.connection.commit()
        cursor.close()

        return jsonify({'success': True, 'message': 'Certificate information updated successfully'}), 200

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



@app.route('/delete_social_info', methods=['DELETE'])
def delete_social_info():
    try:
        user_id = request.args.get('userId')
        social_media_profile_id = request.args.get('socialId')

        cursor = mysql.connection.cursor()

        # Get teacher_id based on user_id
        cursor.execute("SELECT teacher_id FROM teacher WHERE user_id = %s", (user_id,))
        teacher_result = cursor.fetchone()

        if not teacher_result:
            return jsonify({'error': 'Teacher not found for the given user ID'}), 404

        teacher_id = teacher_result[0]

        # Delete work information from the workexperience table
        cursor.execute("""
            DELETE FROM teachersocialmediaprofile
            WHERE teacher_id = %s AND social_media_profile_id = %s
        """, (teacher_id, social_media_profile_id))

        mysql.connection.commit()
        cursor.close()

        return jsonify({'success': True, 'message': 'social information deleted successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    


@app.route('/delete_website_info', methods=['DELETE'])
def delete_website_info():
    try:
        user_id = request.args.get('userId')
        website_id = request.args.get('websiteId')

        cursor = mysql.connection.cursor()

        # Get teacher_id based on user_id
        cursor.execute("SELECT teacher_id FROM teacher WHERE user_id = %s", (user_id,))
        teacher_result = cursor.fetchone()

        if not teacher_result:
            return jsonify({'error': 'Teacher not found for the given user ID'}), 404

        teacher_id = teacher_result[0]

        # Delete work information from the workexperience table
        cursor.execute("""
            DELETE FROM teacherwebsite
            WHERE teacher_id = %s AND website_id = %s
        """, (teacher_id, website_id))

        mysql.connection.commit()
        cursor.close()

        return jsonify({'success': True, 'message': 'Website information deleted successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/delete_certificate_info', methods=['DELETE'])
def delete_certificate_info():
    try:
        user_id = request.args.get('userId')
        additional_certificate_id = request.args.get('certificateId')

        cursor = mysql.connection.cursor()

        # Get teacher_id based on user_id
        cursor.execute("SELECT teacher_id FROM teacher WHERE user_id = %s", (user_id,))
        teacher_result = cursor.fetchone()

        if not teacher_result:
            return jsonify({'error': 'Teacher not found for the given user ID'}), 404

        teacher_id = teacher_result[0]

        # Delete work information from the workexperience table
        cursor.execute("""
            DELETE FROM additionalcertificate
            WHERE teacher_id = %s AND additional_certificate_id = %s
        """, (teacher_id, additional_certificate_id))

        mysql.connection.commit()
        cursor.close()

        return jsonify({'success': True, 'message': 'ertificate information deleted successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/delete_language_info', methods=['DELETE'])
def delete_language_info():
    try:
        user_id = request.args.get('userId')
        language_proficiency_id = request.args.get('languageId')

        cursor = mysql.connection.cursor()

        # Get teacher_id based on user_id
        cursor.execute("SELECT teacher_id FROM teacher WHERE user_id = %s", (user_id,))
        teacher_result = cursor.fetchone()

        if not teacher_result:
            return jsonify({'error': 'Teacher not found for the given user ID'}), 404

        teacher_id = teacher_result[0]

        # Delete work information from the workexperience table
        cursor.execute("""
            DELETE FROM languageproficiency
            WHERE teacher_id = %s AND language_proficiency_id  = %s
        """, (teacher_id, language_proficiency_id))

        mysql.connection.commit()
        cursor.close()

        return jsonify({'success': True, 'message': 'Work information deleted successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/create_course', methods=['POST'])
def create_course():
    try:
        data = request.json
        user_id = data.get('user_id')
        title = data.get('title')
        details = data.get('details')
        course_for = data.get('course_for')
        course_fee = data.get('course_fee')
        course_duration = data.get('course_duration')
        course_video_url = data.get('course_video_url')
        course_picture = data.get('course_picture')

        cursor = mysql.connection.cursor()

        # Get teacher_id based on user_id
        cursor.execute("SELECT teacher_id FROM teacher WHERE user_id = %s", (user_id,))
        teacher_result = cursor.fetchone()

        if not teacher_result:
            return jsonify({'error': 'Teacher not found for the given user ID'}), 404

        teacher_id = teacher_result[0]

        # Save course information in the course table
        cursor.execute("""
            INSERT INTO course
            (teacher_id, title, details, course_for, course_fee, course_duration, course_video_url, course_picture)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, (teacher_id, title, details, course_for, course_fee, course_duration, course_video_url, course_picture))

        mysql.connection.commit()
        cursor.close()

        return jsonify({'success': True, 'message': 'Course created successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

import random

# @app.route('/create_courses', methods=['POST'])
# def create_courses():
#     try:
#         teacher_ids = [13, 27, 28]
#         user_ids = [18, 40, 41]
#         course_titles = ['Programming', 'English Language', 'CS Courses', 'OOP', 'Opearting System', 'Chinese Langauge', 'Graphic Designing']

#         cursor = mysql.connection.cursor()

#         for _ in range(50):
#             # Randomly choose teacher and user IDs
#             teacher_id = random.choice(teacher_ids)
#             user_id = random.choice(user_ids)

#             # Get course title and details randomly
#             title = random.choice(course_titles)
#             details = "\n".join([f"Line {i + 1} of details for {title}" for i in range(5)])

#             # Generate random course_fee (e.g., PKR 10000 to PKR 50000)
#             course_fee = f"PKR {random.randint(10000, 50000)}"

#             # Generate other random data or use default values
#             course_for = 'Some Course For'
#             course_duration = '4 Months'


#             # Save course information in the course table
#             cursor.execute("""
#                 INSERT INTO course
#                 (teacher_id, title, details, course_for, course_fee, course_duration)
#                 VALUES (%s, %s, %s, %s, %s, %s)
#             """, (teacher_id, title, details, course_for, course_fee, course_duration))

#         mysql.connection.commit()
#         cursor.close()

#         return jsonify({'success': True, 'message': 'Courses created successfully'}), 200

#     except Exception as e:
#         return jsonify({'error': str(e)}), 500


@app.route('/get_course_info_byid/<int:course_id>', methods=['GET'])
def get_course_info(course_id):
    try:
        cursor = mysql.connection.cursor()

        # Get course information based on course_id
        cursor.execute("SELECT * FROM course WHERE course_id = %s", (course_id,))
        course_info = cursor.fetchone()

        if not course_info:
            return jsonify({'error': 'Course not found for the given course ID'}), 404

        course_data = {
            'course_id': course_info[0],
            'teacher_id': course_info[1],
            'title': course_info[2],
            'course_code': course_info[3],
            'details': course_info[4],
            'course_for': course_info[5],
            'course_fee': course_info[6],
            'course_duration': course_info[7],
            'course_video_url': course_info[8],
            'course_picture': course_info[9],
        }

        cursor.close()

        return jsonify({'success': True, 'course_data': course_data}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/update_course', methods=['PUT'])
def update_course():
    try:
        data = request.json
        user_id = data.get('user_id')
        course_id = data.get('course_id')

        cursor = mysql.connection.cursor()

        # Get teacher_id based on user_id
        cursor.execute("SELECT teacher_id FROM teacher WHERE user_id = %s", (user_id,))
        teacher_result = cursor.fetchone()

        if not teacher_result:
            return jsonify({'error': 'Teacher not found for the given user ID'}), 404

        teacher_id = teacher_result[0]

        # Check if the course exists and belongs to the given teacher
        cursor.execute("SELECT * FROM course WHERE course_id = %s AND teacher_id = %s", (course_id, teacher_id))
        course_result = cursor.fetchone()

        if not course_result:
            return jsonify({'error': 'Course not found for the given course ID and teacher ID'}), 404

        # Update course information based on the provided data
        cursor.execute("""
            UPDATE course
            SET title = %s, details = %s, course_for = %s, course_fee = %s,
                course_duration = %s, course_video_url = %s, course_picture = %s
            WHERE course_id = %s AND teacher_id = %s
        """, (
            data.get('title'), data.get('details'), data.get('course_for'),
            data.get('course_fee'), data.get('course_duration'), data.get('course_video_url'),
            data.get('course_picture'), course_id, teacher_id
        ))

        mysql.connection.commit()
        cursor.close()

        return jsonify({'success': True, 'message': 'Course updated successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/delete_course', methods=['DELETE'])
def delete_course():
    try:
        user_id = request.args.get('user_id')
        course_id = request.args.get('course_id')

        cursor = mysql.connection.cursor()

        # Get teacher_id based on user_id
        cursor.execute("SELECT teacher_id FROM teacher WHERE user_id = %s", (user_id,))
        teacher_result = cursor.fetchone()

        if not teacher_result:
            return jsonify({'error': 'Teacher not found for the given user ID'}), 404

        teacher_id = teacher_result[0]

        # Check if the course exists and belongs to the given teacher
        cursor.execute("SELECT * FROM course WHERE course_id = %s AND teacher_id = %s", (course_id, teacher_id))
        course_result = cursor.fetchone()

        if not course_result:
            return jsonify({'error': 'Course not found for the given course ID and teacher ID'}), 404

        # Delete the course
        cursor.execute("""
            DELETE FROM course
            WHERE course_id = %s AND teacher_id = %s
        """, (course_id, teacher_id))

        mysql.connection.commit()
        cursor.close()

        return jsonify({'success': True, 'message': 'Course deleted successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/courses', methods=['GET'])
def get_all_courses():
    try:
        # Establish a database connection
        cursor = mysql.connection.cursor()

        # Fetch all courses with teacher and user information
        query = """
            SELECT 
                c.course_id, c.title, c.course_code, c.details, c.course_for, c.course_fee,
                c.course_duration, c.course_video_url, c.course_picture,
                t.teacher_id, t.user_id AS teacher_user_id, t.phone_number, t.bio,
                t.city_town, t.gender, t.cnic_picture, t.country, t.profile_picture AS teacher_profile_picture,
                u.full_name AS teacher_full_name
            FROM course c
            JOIN teacher t ON c.teacher_id = t.teacher_id
            JOIN user u ON t.user_id = u.id
        """
        cursor.execute(query)
        courses = cursor.fetchall()

        # Close the database connection
        cursor.close()

        # Prepare the response
        result = []
        for course in courses:
            course_data = {
                "course_id": course[0],
                "title": course[1],
                "course_code": course[2],
                "details": course[3],
                "course_for": course[4],
                "course_fee": course[5],
                "course_duration": course[6],
                "course_video_url": course[7],
                "course_picture": course[8],
                "teacher": {
                    "teacher_id": course[9],
                    "user_id": course[10],
                    "profile_picture": course[17],
                    "full_name": course[18],
                }
            }
            result.append(course_data)

        return jsonify({'success': True, 'courses': result}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

from flask import request

@app.route('/get_speccourses_detail_byId', methods=['GET'])
def get_course_details():
    try:
        # Get course_id from the request parameters
        course_id = request.args.get('course_id')

        if not course_id:
            return jsonify({'error': 'Course ID parameter is missing.'}), 400

        # Establish a database connection
        cursor = mysql.connection.cursor()

        # Fetch the details for the specified course
        query = """
            SELECT 
                c.course_id, c.title, c.course_code, c.details, c.course_for, c.course_fee,
                c.course_duration, c.course_video_url, c.course_picture,
                t.teacher_id, t.user_id AS teacher_user_id, t.phone_number, t.bio,
                t.city_town, t.gender, t.cnic_picture, t.country, t.profile_picture AS teacher_profile_picture,
                u.full_name AS teacher_full_name
            FROM course c
            JOIN teacher t ON c.teacher_id = t.teacher_id
            JOIN user u ON t.user_id = u.id
            WHERE c.course_id = %s
        """
        cursor.execute(query, (course_id,))
        course = cursor.fetchone()

        # Close the database connection
        cursor.close()

        if not course:
            return jsonify({'error': 'Course not found.'}), 404

        # Prepare the response
        course_data = {
            "course_id": course[0],
            "title": course[1],
            "course_code": course[2],
            "details": course[3],
            "course_for": course[4],
            "course_fee": course[5],
            "course_duration": course[6],
            "course_video_url": course[7],
            "course_picture": course[8],
            "teacher": {
                "teacher_id": course[9],
                "user_id": course[10],
                "profile_picture": course[17],
                "full_name": course[18],
            }
        }

        return jsonify({'success': True, 'course': course_data}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500



@app.route('/add_course_request', methods=['POST'])
def add_course_request():
    try:
        data = request.get_json()

        user_id = data.get('user_id')
        course_id = data.get('course_id')
        teacher_id = data.get('teacher_id')  # Add teacher_id

        if not user_id or not course_id or not teacher_id:
            return jsonify({'error': 'user_id, course_id, and teacher_id are required'}), 400

        cursor = mysql.connection.cursor()

        # Extract learner_id from user_id
        cursor.execute("SELECT learner_id FROM learner WHERE user_id = %s", (user_id,))
        learner_id_result = cursor.fetchone()

        if not learner_id_result:
            return jsonify({'error': 'Learner not found for the given user_id'}), 404

        learner_id = learner_id_result[0]

        # Check if course exists
        cursor.execute("SELECT * FROM course WHERE course_id = %s", (course_id,))
        course = cursor.fetchone()

        if not course:
            return jsonify({'error': 'Course not found for the given course ID'}), 404

        # Check if the learner has already enrolled in the course
        cursor.execute("SELECT * FROM courserequest WHERE learner_id = %s AND course_id = %s", (learner_id, course_id))
        existing_request = cursor.fetchone()

        if existing_request:
            return jsonify({'error': 'Learner has already enrolled in this course'}), 400

        # Add to courserequest table with status as 'pending' and teacher_id
        cursor.execute("INSERT INTO courserequest (course_id, learner_id, status, teacher_id) VALUES (%s, %s, %s, %s)",
                       (course_id, learner_id, 'Pending', teacher_id))

        mysql.connection.commit()
        cursor.close()

        return jsonify({'success': True, 'message': 'Course request added successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/get_learner_requestcourses', methods=['GET'])
def get_learner_requestcourses():
    try:
        user_id = request.args.get('user_id')

        if not user_id:
            return jsonify({'error': 'user_id is required'}), 400

        cursor = mysql.connection.cursor()

        # Extract learner_id from user_id
        cursor.execute("SELECT learner_id FROM learner WHERE user_id = %s", (user_id,))
        learner_id_result = cursor.fetchone()

        if not learner_id_result:
            return jsonify({'error': 'Learner not found for the given user_id'}), 404

        learner_id = learner_id_result[0]

        # Retrieve all courses for the learner with request status
        cursor.execute("""
            SELECT c.course_id, c.title, c.details, c.course_for, c.course_fee,
                   c.course_duration, c.teacher_id, cr.status, c.course_picture
            FROM course c
            JOIN courserequest cr ON c.course_id = cr.course_id
            WHERE cr.learner_id = %s
            """, (learner_id,))

        courses = cursor.fetchall()

        formatted_courses = []
        for course in courses:
            course_data = {
                "course_id": course[0],
                "title": course[1],
                "details": course[2],
                "course_for": course[3],
                "course_fee": course[4],
                "course_duration": course[5],
                "teacher_id": course[6],
                "status": course[7],
                "course_picture": course[8]
            }
            formatted_courses.append(course_data)

        cursor.close()

        return jsonify({'success': True, 'courses': formatted_courses}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


####################################################################################################################################
#voice                                                                                                                             #
####################################################################################################################################
#
# credentials = service_account.Credentials.from_service_account_file('C:/voice/voice_navigation server/credentials.json')
# client = speech.SpeechClient(credentials=credentials)
#
#
# def convert_wav_file(input_path, output_path, target_sample_rate=16000, target_sample_width=2):
#     sound = AudioSegment.from_file(input_path)
#
#     if sound.channels > 1:
#         sound = sound.set_channels(1)
#
#     if sound.frame_rate != target_sample_rate:
#         sound = sound.set_frame_rate(target_sample_rate)
#
#     sound = sound.set_sample_width(target_sample_width)
#
#     sound.export(output_path, format="wav")
#
# @app.route('/transcribe', methods=['POST'])
# def transcribe_audio():
#     try:
#         uploaded_file = request.files.get('audio')
#
#         if not uploaded_file:
#             return jsonify({'error': 'No audio file provided'})
#
#         # Save the uploaded file to a temporary location
#         input_path = 'temp_input.wav'
#         uploaded_file.save(input_path)
#
#         # Convert the audio file to the target format
#         output_path = 'temp_output.wav'
#         convert_wav_file(input_path, output_path)
#
#         # Read the converted audio content
#         audio_content = AudioSegment.from_file(output_path).raw_data
#
#         audio = speech.RecognitionAudio(content=audio_content)
#
#         config = speech.RecognitionConfig(
#             encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
#             sample_rate_hertz=16000,
#             language_code='ur-PK',
#         )
#
#         response = client.recognize(config=config, audio=audio)
#
#         transcription = ""
#         for result in response.results:
#             transcription += result.alternatives[0].transcript + "\n"
#         print(transcription+"hahahah")
#         return jsonify({'transcription': transcription})
#
#     except Exception as e:
#         return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)
