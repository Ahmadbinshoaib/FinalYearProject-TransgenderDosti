import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SocialLoginModule, SocialAuthServiceConfig, GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import {
  GoogleLoginProvider,
  FacebookLoginProvider
} from '@abacritt/angularx-social-login';
import { NavHeaderComponent } from './nav-header/nav-header.component';
import { EducationHomepageComponent } from './education-homepage/education-homepage.component';
import { BusinessHomepageComponent } from './business-homepage/business-homepage.component';
import { FooterComponent } from './footer/footer.component';
import { UserAuthenticationComponent } from './user-authentication/user-authentication.component';
import { TeacherMainpageTabsComponent } from './teacher-mainpage-tabs/teacher-mainpage-tabs.component';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';
import { LearnerMainpageComponent } from './learner-mainpage/learner-mainpage.component';
import { TeacherProfileComponent } from './teacher-profile/teacher-profile.component';
import { TeacherSidebarComponent } from './teacher-sidebar/teacher-sidebar.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { TeacherCourseDashboardComponent } from './teacher-course-dashboard/teacher-course-dashboard.component';
import { TeacherCourseMaterialComponent } from './teacher-course-material/teacher-course-material.component';
import { ComponentNameComponent } from './component-name/component-name.component';
import { TeacherCourseAssignmentComponent } from './teacher-course-assignment/teacher-course-assignment.component';
import { TeacherCourseAssignmentViewresponsesComponent } from './teacher-course-assignment-viewresponses/teacher-course-assignment-viewresponses.component';
import { TeacherCourseDetailComponent } from './teacher-course-detail/teacher-course-detail.component';
import { CourseDetailComponent } from './course-detail/course-detail.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LearnerPaymentScreenComponent } from './learner-payment-screen/learner-payment-screen.component';
import { LearnerProfileComponent } from './learner-profile/learner-profile.component';
import { DataTablesModule } from 'angular-datatables';
import { NotificationComponent } from './notification/notification.component';
import { LearnerSidebarComponent } from './learner-sidebar/learner-sidebar.component';
import { LearnerCourseDashboardComponent } from './learner-course-dashboard/learner-course-dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    NavHeaderComponent,
    EducationHomepageComponent,
    BusinessHomepageComponent,
    FooterComponent,
    UserAuthenticationComponent,
    TeacherMainpageTabsComponent,
    LearnerMainpageComponent,
    TeacherProfileComponent,
    TeacherSidebarComponent,
    TeacherCourseDashboardComponent,
    TeacherCourseMaterialComponent,
    ComponentNameComponent,
    TeacherCourseAssignmentComponent,
    TeacherCourseAssignmentViewresponsesComponent,
    TeacherCourseDetailComponent,
    CourseDetailComponent,
    LearnerPaymentScreenComponent,
    LearnerProfileComponent,
    NotificationComponent,
    LearnerSidebarComponent,
    LearnerCourseDashboardComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SocialLoginModule,
    HttpClientModule,
    GoogleSigninButtonModule,
    FormsModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      closeButton: true,
      progressBar: true
    }),
    BrowserAnimationsModule,
    NgSelectModule,
    MatSidenavModule,
    MatListModule,
    NgbModule,
    DataTablesModule,


  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '874616982007-pvupdujpjic356kk9cmteqjicfvf47f4.apps.googleusercontent.com'
            )
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('210176608699622')
          }
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
