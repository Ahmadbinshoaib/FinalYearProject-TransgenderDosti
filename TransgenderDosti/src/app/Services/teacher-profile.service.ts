import { HttpClient } from '@angular/common/http';
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
export class TeacherProfileService {
  private serverUrl = 'http://127.0.0.1:5000';

  constructor(private http: HttpClient) {

  }


  createTeacherPersonalProfile(data: any): Observable<any> {
    console.warn(data)
    return this.http.post(`${this.serverUrl}/teacher_profile_personalinfo`, data);
  }



  getTeacherPersonalProfile(userId: string): Observable<any> {
    const endpoint = `/get_teacherprofile_personalinfo?user_id=${userId}`;
    const url = this.serverUrl + endpoint;
    const params = { userId };
    return this.http.get(url);
  }

  saveTeacherEducationalInfo(data: any): Observable<any> {
    const endpoint = `${this.serverUrl}/save_educational_info`;
    // Adjust the headers based on your API requirements
    const headers = {
      'Content-Type': 'application/json',
      // Add any other headers if needed
    };
    return this.http.post(endpoint, data, { headers });
  }

  saveTeacherWorkInfo(data: any): Observable<any> {
    const endpoint = `${this.serverUrl}/save_work_info`;
    // Adjust the headers based on your API requirements
    const headers = {
      'Content-Type': 'application/json',
      // Add any other headers if needed
    };
    return this.http.post(endpoint, data, { headers });
  }


  getTeacherEducationalInfo(userId: string): Observable<any> {
    const endpoint = `/get_educational_info?user_id=${userId}`;
    const url = this.serverUrl + endpoint;

    // Assume you need to send the userId as a query parameter
    const params = { userId };

    return this.http.get(url);
  }

  getTeacherWorkInfo(userId: string): Observable<any> {
    const endpoint = `/get_work_info?user_id=${userId}`;
    const url = this.serverUrl + endpoint;

    // Assume you need to send the userId as a query parameter
    const params = { userId };

    return this.http.get(url);
  }

  getTeacherEducationalInfoById(educationId: string): Observable<any> {
    const endpoint = `/get_educational_info_by_id?educational_id=${educationId}`;
    const url = this.serverUrl + endpoint;

    // Assume you need to send the userId as a query parameter
    const params = { educationId };

    return this.http.get(url);
  }

  getTeacherWorkInfoById(workId: string): Observable<any> {
    const endpoint = `/get_work_info_by_id?work_id=${workId}`;
    const url = this.serverUrl + endpoint;

    // Assume you need to send the userId as a query parameter
    const params = { workId };

    return this.http.get(url);
  }

  updateTeacherEducationalInfo(data: any): Observable<any> {
    const endpoint = `${this.serverUrl}/update_educational_info`;
    const headers = {
      'Content-Type': 'application/json',
    };
    return this.http.put(endpoint, data, { headers });
  }
  updateTeacherWorkInfo(data: any): Observable<any> {
    const endpoint = `${this.serverUrl}/update_work_info`;
    const headers = {
      'Content-Type': 'application/json',
    };
    return this.http.put(endpoint, data, { headers });
  }
  


}
