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
export interface languageData{
    language_proficiency_id: string;
    language: string;

}
  
