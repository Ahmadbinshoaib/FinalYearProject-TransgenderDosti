import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserAuthenticationService } from './Services/user-authentication.service';
import { EducationHomepageComponent } from './education-homepage/education-homepage.component';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  constructor(private router: Router, private service: UserAuthenticationService) {
    this.service.isTeacherLoggedIn.next(false);
  }

  // canActivate() {
  //   // Add any additional conditions or logic here if needed
  //   // Always allow navigation
  //   if (localStorage.getItem('teacher')) {
  //     return true
  //   }

  //   return this.service.isTeacherLoggedIn;
  // }
  canActivate() {
    // Log the current values for debugging
    console.log('localStorage.getItem("teacher"): ', localStorage.getItem('teacher'));
    console.log('this.service.isTeacherLoggedIn: ', this.service.isTeacherLoggedIn.getValue());

    // Check conditions for allowing navigation
    if (localStorage.getItem('teacher') || this.service.isTeacherLoggedIn.getValue()) {
      console.log('Condition is true');
      return true;
    } else {
      // Redirect to the login page
      this.router.navigate(['/user-authentication']);
      console.log('Condition is false');
      return false;
    }
  }


  // canActivate(): boolean {
  //   // Your authentication logic for learners
  //   const isTeacherAuthenticated = this.service.isTeacherLoggedIn.getValue();

  //   if (isTeacherAuthenticated) {
  //     return true;
  //   } else {
  //     // Check if the user is a teacher
  //     if (this.service.isLearnerLoggedIn.getValue()) {
  //       // Redirect to the teacher main page
  //       this.router.navigate(['/learner-mainpage']);
  //     } else {
  //       // Redirect to the login page for unauthorized users
  //       this.router.navigate(['/user-authentication']);
  //     }
  //     return false;
  //   }
  // }






};
