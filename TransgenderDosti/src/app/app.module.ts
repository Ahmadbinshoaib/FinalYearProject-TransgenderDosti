import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NavHeaderComponent } from './nav-header/nav-header.component';
import { EducationHomepageComponent } from './education-homepage/education-homepage.component';
import { BusinessHomepageComponent } from './business-homepage/business-homepage.component';
import { FooterComponent } from './footer/footer.component';
import { UserAuthenticationComponent } from './user-authentication/user-authentication.component';

@NgModule({
  declarations: [
    AppComponent,
    NavHeaderComponent,
    EducationHomepageComponent,
    BusinessHomepageComponent,
    FooterComponent,
    UserAuthenticationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
