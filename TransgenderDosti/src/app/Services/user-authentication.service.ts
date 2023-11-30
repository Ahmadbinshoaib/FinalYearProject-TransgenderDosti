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
    var userId = ''

    return this.http.post(url, data, { observe: 'response' }).pipe(
      tap((result) => {
        this.isTeacherLoggedIn.next(true);
        console.warn('linenexttolocal')
        localStorage.setItem('teacher', JSON.stringify(result.body))

        if (localStorage.getItem('teacher')) {
          const teacherStore = localStorage.getItem('teacher');

          try {
            const teacherData = JSON.parse(teacherStore!);

            if (teacherData && teacherData.user_id) {

              userId = teacherData.user_id
              console.log(userId)
            } else {
              console.error('Invalid teacher data format or missing email property');
            }
          } catch (error) {
            console.error('Error parsing teacher data:', error);
          }
        }

        this.router.navigate(['teacher-mainpage', userId]);
      })
    );
  }

  reloadTeacher() {
    var userId = ''
    if (localStorage.getItem('teacher')) {

      const teacherStore = localStorage.getItem('teacher');

      try {
        const teacherData = JSON.parse(teacherStore!);

        if (teacherData && teacherData.user_id) {

          userId = teacherData.user_id
          console.log(userId)
        } else {
          console.error('Invalid teacher data format or missing email property');
        }
      } catch (error) {
        console.error('Error parsing teacher data:', error);
      }

      console.warn('reload')
      this.isTeacherLoggedIn.next(true);
      this.router.navigate(['teacher-mainpage', userId]);

    }
  }

  reloadLearner() {
    var userId = ''
    if (localStorage.getItem('learner')) {

      const learnerStore = localStorage.getItem('learner');

      try {
        const learnerData = JSON.parse(learnerStore!);

        if (learnerData && learnerData.user_id) {

          userId = learnerData.user_id
          console.log(userId)
        } else {
          console.error('Invalid learner data format or missing email property');
        }
      } catch (error) {
        console.error('Error parsing learner data:', error);
      }

      console.warn('reload')
      this.isLearnerLoggedIn.next(true);
      this.router.navigate(['learner-mainpage', userId]);

    }
  }

  signUpLearner(data: userTeacher) {
    var userId = ''
    const endpoint = '/signup';
    const url = this.serverUrl + endpoint;

    return this.http.post(url, data, { observe: 'response' }).pipe(
      tap((result) => {
        this.isLearnerLoggedIn.next(true);
        console.warn('linenexttolocal')
        localStorage.setItem('learner', JSON.stringify(result.body))

        if (localStorage.getItem('learner')) {
          const learnerStore = localStorage.getItem('learner');

          try {
            const learnerData = JSON.parse(learnerStore!);

            if (learnerData && learnerData.user_id) {

              userId = learnerData.user_id
              console.log(userId)
            } else {
              console.error('Invalid learner data format or missing email property');
            }
          } catch (error) {
            console.error('Error parsing learner data:', error);
          }
        }

        this.router.navigate(['learner-mainpage', userId]);
      })
    );
  }


  signInUser(data: signIn) {
    const endpoint = '/signin';
    const url = this.serverUrl + endpoint;
    var userId = ''
    return this.http.post<SignInResponse>(url, data, { observe: 'response' }).pipe(
      tap((result) => {
        const userType = result.body?.user_type;

        if (userType === 'teacher') {
          // User is a teacher, navigate to teacher-mainpage
          console.warn('linenexttolocal');
          localStorage.setItem('teacher', JSON.stringify(result.body));
          this.isTeacherLoggedIn.next(true);

          if (localStorage.getItem('teacher')) {
            const teacherStore = localStorage.getItem('teacher');

            try {
              const teacherData = JSON.parse(teacherStore!);

              if (teacherData && teacherData.user_id) {

                userId = teacherData.user_id
                console.log('userID' + userId)
              } else {
                console.error('Invalid teacher data format or missing email property');
              }
            } catch (error) {
              console.error('Error parsing teacher data:', error);
            }
          }

          this.router.navigate(['teacher-mainpage/', userId]);

        } else if (userType === 'learner') {
          // User is a learner, navigate to learner-mainpage
          localStorage.setItem('learner', JSON.stringify(result.body));

          if (localStorage.getItem('learner')) {
            const learnerStore = localStorage.getItem('learner');

            try {
              const learnerData = JSON.parse(learnerStore!);

              if (learnerData && learnerData.user_id) {

                userId = learnerData.user_id
                console.log(userId)
              } else {
                console.error('Invalid learner data format or missing email property');
              }
            } catch (error) {
              console.error('Error parsing learner data:', error);
            }
          }


          this.router.navigate(['learner-mainpage', userId]);
          this.isLearnerLoggedIn.next(true);
        } else {
          // Handle other cases or errors
          console.error('Unknown user type');
        }
      })
    );
  }

}
