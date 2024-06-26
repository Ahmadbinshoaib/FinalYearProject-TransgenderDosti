import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EducationHomepageComponent } from './education-homepage/education-homepage.component';
import { BusinessHomepageComponent } from './business-homepage/business-homepage.component';
import { UserAuthenticationComponent } from './user-authentication/user-authentication.component';
import { TeacherMainpageTabsComponent } from './teacher-mainpage-tabs/teacher-mainpage-tabs.component';
import { LearnerMainpageComponent } from './learner-mainpage/learner-mainpage.component';
import { AuthGuard } from './teacherauth-guard.guard';
import { AuthGuard1 } from './learnerauth-guard.guard';
import { TeacherProfileComponent } from './teacher-profile/teacher-profile.component';
import { LearnerProfileComponent } from './learner-profile/learner-profile.component';
import { TeacherSidebarComponent } from './teacher-sidebar/teacher-sidebar.component';
import { TeacherCourseDashboardComponent } from './teacher-course-dashboard/teacher-course-dashboard.component';
import { TeacherCourseMaterialComponent } from './teacher-course-material/teacher-course-material.component';
import { TeacherCourseAssignmentComponent } from './teacher-course-assignment/teacher-course-assignment.component';
import { TeacherCourseAssignmentViewresponsesComponent } from './teacher-course-assignment-viewresponses/teacher-course-assignment-viewresponses.component';
import { CourseDetailComponent } from './course-detail/course-detail.component';
import { LearnerPaymentScreenComponent } from './learner-payment-screen/learner-payment-screen.component';
import { LearnerSidebarComponent } from './learner-sidebar/learner-sidebar.component';
import { LearnerCourseDashboardComponent } from './learner-course-dashboard/learner-course-dashboard.component';
import { LearnerCourseAssignmentComponent } from './learner-course-assignment/learner-course-assignment.component';

const routes: Routes = [

  {
    path: 'educationhomepage', component: EducationHomepageComponent
  },
  {
    path: 'businesshomepage', component: BusinessHomepageComponent
  },

  { path: '', redirectTo: '/educationhomepage', pathMatch: 'full' },
  {
    path: 'user-authentication', component: UserAuthenticationComponent
  },
  {
    path: 'teacher-mainpage/:userId', component: TeacherMainpageTabsComponent,
    canActivate: [AuthGuard]

  },
  {
    path: 'learner-mainpage/:userId', component: LearnerMainpageComponent,
    canActivate: [AuthGuard1]
  },
  {
    path: 'teacher-profile/:userId', component: TeacherProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'course-detail/:courseId', component: CourseDetailComponent,

  },
  {
    path: 'course-payment', component: LearnerPaymentScreenComponent,

  },
  {
    path: 'learner-profile/:userId', component: LearnerProfileComponent,
    canActivate: [AuthGuard1]
  },

  {
    path: 'teacher-course-details', component: TeacherSidebarComponent,

    canActivate: [AuthGuard],
    children: [
      { path: 'teacher-course-dashboard/:courseId', component: TeacherCourseDashboardComponent },
      { path: 'teacher-course-assignment/:courseId', component: TeacherCourseAssignmentComponent },
      { path: 'teacher-course-material/:courseId', component: TeacherCourseMaterialComponent },
      { path: 'teacher-course-assignment-viewresponses/:courseId', component: TeacherCourseAssignmentViewresponsesComponent }
    ]
  },
  {
    path: 'learner-course-details', component: LearnerSidebarComponent,

    canActivate: [AuthGuard1],
    children: [
      { path: 'learner-course-dashboard', component: LearnerCourseDashboardComponent },
      {path: 'learner-course-assignment', component: LearnerCourseAssignmentComponent}

    ]
  },









];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
