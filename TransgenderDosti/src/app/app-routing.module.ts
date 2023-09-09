import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { EducationHomepageComponent } from './education-homepage/education-homepage.component';
import { BusinessHomepageComponent } from './business-homepage/business-homepage.component';

const routes: Routes = [

  {
    path: 'educationhomepage', component: EducationHomepageComponent
  },
  {
    path: 'businesshomepage', component: BusinessHomepageComponent
  },

  { path: '', redirectTo: '/educationhomepage', pathMatch: 'full' },




];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
