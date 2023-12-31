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
import { TeacherSidebarComponent } from './teacher-sidebar/teacher-sidebar.component';
import { TeacherCourseDashboardComponent } from './teacher-course-dashboard/teacher-course-dashboard.component';
import { TeacherCourseMaterialComponent } from './teacher-course-material/teacher-course-material.component';
import { TeacherCourseAssignmentComponent } from './teacher-course-assignment/teacher-course-assignment.component';
import { TeacherCourseAssignmentViewresponsesComponent } from './teacher-course-assignment-viewresponses/teacher-course-assignment-viewresponses.component';

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
    path: 'teacher-course-details', component: TeacherSidebarComponent,
    
    canActivate: [AuthGuard],
    children: [
      {path: 'teacher-course-dashboard', component: TeacherCourseDashboardComponent },
      {path: 'teacher-course-assignment', component: TeacherCourseAssignmentComponent},
      {path: 'teacher-course-material', component: TeacherCourseMaterialComponent },
      {path:'teacher-course-assignment-viewresponses', component: TeacherCourseAssignmentViewresponsesComponent}
    ]
  },
 








];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
