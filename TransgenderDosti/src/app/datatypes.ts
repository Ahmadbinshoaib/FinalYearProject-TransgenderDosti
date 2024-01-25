export interface userTeacher {
    name: string;
    password: string;
    email: string;
    role: string;
}

export interface signIn {
 
    password: string;
    email: string;

}

export interface SignInResponse {
    success: boolean;
    user_type: 'teacher' | 'learner';
}

export interface TeacherProfileData {
    user_id: string;
    phone_number: number;
    bio: string;
    city_town: string;
    gender: string;
    cnic_picture: string;
    profile_picture: string;
    country: string;
    teacher_id: string;
  }

export interface educationData{
    educational_background_id: string;
    institution_name: string;
    degree_name:string;
    field_of_study:string;
    start_date: string;
    end_date: string;
    is_current: string;

}
export interface workData{
    work_experience_id: string;
    job_title: string;
    company_workplace_name:string;
    city_town:string;
    country: string;
    description: string;
    start_date: string;
    end_date: string;
    is_current: string;
    relevant_document: string;

}

export interface certificateData{
    additional_certificate_id : string;
    certificate_name: string;
    description:string;
    issuing_organization:string;
    issue_date: string;
    credential_id: string;
    credential_url: string;
    relevant_document: string;

}
export interface languageData{
    language_proficiency_id: string;
    language: string;

}


export interface courseData{
    course_id: string;
    title: string;
    course_code: string;
    details: string;
    course_for: string;
    course_fee: string;
    course_duration: string;
    course_video_url: string;
    course_picture:string;

}
  
export interface websiteData{
    website_id: string;
    website_name: string;
    website_url:string;
    

}

export interface socialData{
    social_media_profile_id: string;
    platform_name:string;
    profile_url:string;
}