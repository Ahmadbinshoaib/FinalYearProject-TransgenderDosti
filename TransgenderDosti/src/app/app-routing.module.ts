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






];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
