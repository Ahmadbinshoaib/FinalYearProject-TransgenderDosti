import { Component, HostListener } from '@angular/core';
import { UserAuthenticationService } from '../Services/user-authentication.service';

@Component({
  selector: 'app-teacher-mainpage-tabs',
  templateUrl: './teacher-mainpage-tabs.component.html',
  styleUrls: ['./teacher-mainpage-tabs.component.css']
})
export class TeacherMainpageTabsComponent {
  activeTab: string = 'ex1-tabs-1';
  teacherEmail: string = ''

  changeTab(tabId: string) {
    this.activeTab = tabId;
  }

  constructor(private userAuthService: UserAuthenticationService) {

  }

  isSmallScreen: boolean = false;

  ngOnInit() {
    this.checkScreenSize();
    this.userAuthService.reloadTeacher();

    if (localStorage.getItem('teacher')) {
      const teacherStore = localStorage.getItem('teacher');

      try {
        const teacherData = JSON.parse(teacherStore!);

        if (teacherData && teacherData.name) {
          console.log(teacherData.name);
          this.teacherEmail = teacherData.name;
        } else {
          console.error('Invalid teacher data format or missing email property');
        }
      } catch (error) {
        console.error('Error parsing teacher data:', error);
      }
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isSmallScreen = window.innerWidth < 576;
  }



}
