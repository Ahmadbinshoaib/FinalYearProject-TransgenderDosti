import { Component, HostListener } from '@angular/core';
import { UserAuthenticationService } from '../Services/user-authentication.service';

@Component({
  selector: 'app-teacher-mainpage-tabs',
  templateUrl: './teacher-mainpage-tabs.component.html',
  styleUrls: ['./teacher-mainpage-tabs.component.css']
})
export class TeacherMainpageTabsComponent {
  activeTab: string = 'ex1-tabs-1';

  changeTab(tabId: string) {
    this.activeTab = tabId;
  }

  constructor(private userAuthService: UserAuthenticationService){

  }

  isSmallScreen: boolean = false;

  ngOnInit() {
    this.checkScreenSize();
    this.userAuthService.reloadTeacher();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isSmallScreen = window.innerWidth < 576;
  }



}
