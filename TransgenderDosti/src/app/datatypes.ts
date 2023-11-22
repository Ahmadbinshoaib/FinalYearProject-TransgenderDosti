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
  
