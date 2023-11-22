import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService } from '@abacritt/angularx-social-login';
import { UserAuthenticationService } from '../Services/user-authentication.service';
import { Router } from '@angular/router';
import { signIn, userTeacher } from '../datatypes';
import { ToastrService } from 'ngx-toastr';
import { NgZone } from '@angular/core';

declare var FB: any;
@Component({
  selector: 'app-user-authentication',
  templateUrl: './user-authentication.component.html',
  styleUrls: ['./user-authentication.component.css']
})
export class UserAuthenticationComponent {

  activeTab: string = 'ex1-tabs-1';

  changeTab(tabId: string) {
    this.activeTab = tabId;
  }


  user: any
  loggedIn: any

  signIn: boolean = true;
  signUp: boolean = false

  isSmallScreen = false;

  constructor(
    private zone: NgZone,
    private toastr: ToastrService,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private authService: SocialAuthService,
    private userAuthService: UserAuthenticationService
  ) {
    this.breakpointObserver
      .observe([Breakpoints.XSmall])
      .subscribe((result) => {
        this.isSmallScreen = result.matches;
      });

    // // Wait for the authentication providers to be ready
    // this.authService.authState.subscribe((user) => {
    //   if (user) {
    //     this.user = user;
    //     this.loggedIn = true;

    //     // Once the providers are ready, you can initiate the sign-in process
    //     this.signInWithGoogle();
    //   }
    // });
  }


  openLogin() {
    this.signIn = true
    this.signUp = false
  }

  openSignUp() {
    this.signIn = false
    this.signUp = true
  }

  // signInWithGoogle(): void {
  //   console.log('signinfunc');
  //   this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then((user) => {
  //     this.user = user;
  //     this.loggedIn = user !== null;
  //     console.log(user);

  //     if (user && user.idToken) {
  //       this.userAuthService.authenticateUser(user.idToken).subscribe(
  //         (response) => {
  //           console.log('Authentication successful', response);
  //           // Handle successful authentication, e.g., redirect to a different page
  //         },
  //         (error) => {
  //           console.error('Authentication failed', error);
  //           // Handle authentication failure, e.g., show an error message to the user
  //         }
  //       );
  //     }
  //   });
  // }


  // ngOnInit() {
  //   this.authService.authState.subscribe((user) => {
  //     this.user = user;
  //     this.loggedIn = (user != null);
  //     console.log(this.user.idToken)

  //     if (user && user.idToken) {
  //       console.log("hey")
  //       this.userAuthService.authenticateUser(user.idToken).subscribe(
  //         (response) => {
  //           console.log('Authentication successful', response);
  //           // Handle successful authentication, e.g., redirect to a different page
  //         },
  //         (error) => {
  //           console.error('Authentication failed', error);
  //           // Handle authentication failure, e.g., show an error message to the user
  //         }
  //       );
  //     }

  //   });

  //   this.userAuthService.reloadTeacher();
  //   this.userAuthService.reloadLearner();






  // }

  ngOnInit() {
    const role1 = (this.activeTab === 'ex1-tabs-1') ? 'teacher' : 'learner';
    console.warn('role' + role1)
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = user !== null;

      if (user && user.idToken) {
        console.log("hey");

        // Determine the role based on the active tab
        const role = (this.activeTab === 'ex1-tabs-1') ? 'teacher' : 'learner';
        console.log('inside role' + role)


        this.userAuthService.authenticateUser(user.idToken, role).subscribe(
          (response) => {
            console.log('Authentication successful', response);
            console.log('Uerstye' + response.user_type)



            // Check user type and navigate accordingly
            if (response.user_type === 'teacher') {
              this.router.navigate(['/teacher-mainpage']);
              console.warn(response.user_type)
              localStorage.setItem('teacher', JSON.stringify(response))

            } else if (response.user_type === 'learner') {
              console.warn(response.user_type)
              this.router.navigate(['/learner-mainpage']);
              localStorage.setItem('learner', JSON.stringify(response))
            }

            // Display a success toast
            this.toastr.success('User successfully logged in!', 'Success');
          },
          (error) => {
            console.error('Authentication failed', error);

            // Display an error toast with the specific error message
            this.toastr.error('Authentication failed: ' + error.error.error, 'Error');
          }
        );
      }
    });

    this.userAuthService.reloadTeacher();
    this.userAuthService.reloadLearner();
  }
  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }


  // TeacherSignUp
  // TeacherSignUp
  // TeacherSignUp
  // TeacherSignUp

  teacherSignUp(data: userTeacher) {
    data.role = 'teacher';
    console.warn(data);
    this.userAuthService.signUpTeacher(data).subscribe(
      (result) => {
        if (result) {
          this.toastr.success('User successfully logged in!', 'Success');

        }
      },
      (error) => {
        if (error.status === 400 && error.error && error.error.error === 'Email already exists') {
          this.toastr.error('Email already exists. Please use another email.', 'Error');


        } else {
          this.toastr.error('Consider entering again', 'Error');
        }
      }
    );
  }

  learnerSignUp(data: userTeacher) {
    data.role = 'learner';
    console.warn(data);
    this.userAuthService.signUpLearner(data).subscribe(
      (result) => {
        if (result) {
          this.toastr.success('User successfully logged in!', 'Success');
          this.router.navigate(['learner-mainpage']);
        }
      },
      (error) => {
        if (error.status === 400 && error.error && error.error.error === 'Email already exists') {
          this.toastr.error('Email already exists. Please use another email.', 'Error');


        } else {
          this.toastr.error('Consider entering again', 'Error');
        }
      }
    );

  }

  SignIn(data: signIn) {
    this.userAuthService.signInUser(data).subscribe(
      (result) => {
        if (result) {
          this.toastr.success('User successfully logged in!', 'Success');
        }
      },
      (error) => {
        if (error.status === 400 && error.error && error.error.error === 'Email already exists') {
          this.toastr.error('Consider entering again', 'Error');


        } else {
          this.toastr.error('Consider entering again', 'Error');
        }
      }
    );

  }


  password: string = '';
  passwordl: string = '';
  passwordsi: string = '';
  showPassword: boolean = false;
  showPasswordl: boolean = false;
  showPasswordsi: boolean = false;

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  togglePasswordVisibilityl(): void {
    this.showPasswordl = !this.showPasswordl;
  }


  togglePasswordVisibilitysi(): void {
    this.showPasswordsi = !this.showPasswordsi;
  }








}
