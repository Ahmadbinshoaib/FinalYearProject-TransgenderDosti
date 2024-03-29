import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class EducationPageServicesService {
  private serverUrl = 'http://127.0.0.1:5000';

  constructor(private http: HttpClient) {

  }

  // Example method to get all courses
  getAllCourses(): Observable<any> {
    const url = `${this.serverUrl}/courses`;
    return this.http.get(url);
  }

  getCourseDetails(courseId: string): Observable<any> {
    const url = `${this.serverUrl}/get_speccourses_detail_byId?course_id=${courseId}`;
    return this.http.get(url);
  }

  addCourseRequest(userid: number, courseId: number, teacherid: any): Observable<any> {
    const url = `${this.serverUrl}/add_course_request`;
    const body = { user_id: userid, course_id: courseId, teacher_id: teacherid };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(url, body, { headers });
  }

  getLearnerRequestCourses(userId: string): Observable<any> {
    const url = `${this.serverUrl}/get_learner_requestcourses?user_id=${userId}`;
    return this.http.get(url);
  }

  getTeacherRequestCourses(userId: string): Observable<any> {
    const url = `${this.serverUrl}/get_teacher_requestcourses`;
    const body = { user_id: userId };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(url, body, { headers });
  }
}
