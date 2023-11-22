import { CanActivateFn } from '@angular/router';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserAuthenticationService } from './Services/user-authentication.service';

@Injectable({
    providedIn: 'root'
})

export class AuthGuard1 implements CanActivate {
    constructor(private router: Router, private service: UserAuthenticationService) { }
    // canActivate() {
    //     // Log the current values for debugging
    //     console.log('localStorage.getItem("learner"): ', localStorage.getItem('learner'));
    //     console.log('this.service.isLearnerLoggedIn: ', this.service.isLearnerLoggedIn.getValue());

    //     // Check conditions for allowing navigation
    //     if (localStorage.getItem('learner') || this.service.isLearnerLoggedIn.getValue()) {
    //         console.log('Condition is true');
    //         return true;
    //     } else {
    //         // Redirect to the login page
    //         this.router.navigate(['/user-authentication']);
    //         console.log('Condition is false');
    //         return false;
    //     }
    // }

    canActivate(): boolean {
        console.log('localStorage.getItem("learner"): ', localStorage.getItem('learner'));
        console.log('this.service.isLearnerLoggedIn: ', this.service.isLearnerLoggedIn.getValue());
        // Your authentication logic for learners
        const isLearnerAuthenticated = this.service.isLearnerLoggedIn.getValue();

        if (isLearnerAuthenticated || localStorage.getItem('learner')) {
            console.log('condition is true')
            return true;
        } else {
            // Check if the user is a teacher
            if (this.service.isTeacherLoggedIn.getValue()) {
                // Redirect to the teacher main page
                this.router.navigate(['/teacher-mainpage']);
            } else {
                // Redirect to the login page for unauthorized users
                this.router.navigate(['/user-authentication']);
            }
            return false;
        }
    }

};
