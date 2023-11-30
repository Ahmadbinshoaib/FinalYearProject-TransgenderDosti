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

}
