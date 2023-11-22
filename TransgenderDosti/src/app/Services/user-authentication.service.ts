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
export class UserAuthenticationService {

  private serverUrl = 'http://127.0.0.1:5000'; // replace with your actual server URL
  isTeacherLoggedIn = new BehaviorSubject<boolean>(false);
  isTeacherLoggedIn$ = this.isTeacherLoggedIn.asObservable();
  isLearnerLoggedIn = new BehaviorSubject<boolean>(false);
  isLearnerLoggedIn$ = this.isLearnerLoggedIn.asObservable();
  previousUrl: string = '/educationhomepage';
  constructor(private http: HttpClient, private router: Router) {

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Update the previousUrl when a navigation ends
        this.previousUrl = event.url;
      }
    });
  }

  authenticateUser(idToken: string, role: string): Observable<any> {
    const endpoint = '/authenticate'; // replace with your actual authentication endpoint
    const url = this.serverUrl + endpoint;
  
    const requestBody = {
      idToken,
      role, // Add the role parameter
    };
  
    return this.http.post(url, requestBody);
  }
  

  signUpTeacher(data: userTeacher): Observable<any> {
    const endpoint = '/signup';
    const url = this.serverUrl + endpoint;

    return this.http.post(url, data, { observe: 'response' }).pipe(
      tap((result) => {
        this.isTeacherLoggedIn.next(true);
        console.warn('linenexttolocal')
        localStorage.setItem('teacher', JSON.stringify(result.body))
        this.router.navigate(['teacher-mainpage']);
      })
    );
  }

  reloadTeacher() {
    if (localStorage.getItem('teacher')) {
      console.warn('reload')
      this.isTeacherLoggedIn.next(true);
      this.router.navigate(['teacher-mainpage']);

    }
  }

  reloadLearner() {
    if (localStorage.getItem('learner')) {
      console.warn('reload')
      this.isLearnerLoggedIn.next(true);
      this.router.navigate(['learner-mainpage']);

    }
  }

  signUpLearner(data: userTeacher) {
    const endpoint = '/signup';
    const url = this.serverUrl + endpoint;

    return this.http.post(url, data, { observe: 'response' }).pipe(
      tap((result) => {
        this.isLearnerLoggedIn.next(true);
        console.warn('linenexttolocal')
        localStorage.setItem('learner', JSON.stringify(result.body))
        this.router.navigate(['learner-mainpage']);
      })
    );
  }


  signInUser(data: signIn) {
    const endpoint = '/signin';
    const url = this.serverUrl + endpoint;

    return this.http.post<SignInResponse>(url, data, { observe: 'response' }).pipe(
      tap((result) => {
        const userType = result.body?.user_type;

        if (userType === 'teacher') {
          // User is a teacher, navigate to teacher-mainpage
          console.warn('linenexttolocal');
          localStorage.setItem('teacher', JSON.stringify(result.body));
          this.isTeacherLoggedIn.next(true);
          this.router.navigate(['teacher-mainpage']);

        } else if (userType === 'learner') {
          // User is a learner, navigate to learner-mainpage
          localStorage.setItem('learner', JSON.stringify(result.body));
          this.router.navigate(['learner-mainpage']);
          this.isLearnerLoggedIn.next(true);
        } else {
          // Handle other cases or errors
          console.error('Unknown user type');
        }
      })
    );
  }

}
