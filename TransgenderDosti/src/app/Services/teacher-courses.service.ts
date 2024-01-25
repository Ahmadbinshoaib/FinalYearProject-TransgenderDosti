import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { SignInResponse, signIn, userTeacher } from '../datatypes';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { NavigationEnd } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TeacherCoursesService {
  private serverUrl = 'http://127.0.0.1:5000';

  constructor(private http: HttpClient) {

  }

  getCourses(userId: string): Observable<any> {
    const endpoint = `/get_courses?user_id=${userId}`;
    const url = this.serverUrl + endpoint;

    // Assume you need to send the userId as a query parameter
    const params = { userId };

    return this.http.get(url);
  }

  getCourseInfoById(course_id: string): Observable<any> {
    const endpoint = `/get_course_info_byid/${course_id}`;
    const url = this.serverUrl + endpoint;

    // Assume you need to sed the userId as a query parameter
    const params = { course_id };

    return this.http.get(url);
  }

  createCourse(data: any): Observable<any> {
    console.warn(data)
    return this.http.post(`${this.serverUrl}/create_course`, data);
  }

  updateCourse(data: any): Observable<any> {
    const endpoint = `${this.serverUrl}/update_course`;
    const headers = {
      'Content-Type': 'application/json',
    };
    return this.http.put(endpoint, data, { headers });
  }

  deleteCourse(userId: string, courseId: string): Observable<any> {
    const endpoint = `${this.serverUrl}/delete_course`;
    const headers = {
      'Content-Type': 'application/json',
    };
    const params = new HttpParams().set('user_id', userId).set('course_id', courseId.toString());
    return this.http.delete(endpoint, { headers, params });
  }

}
