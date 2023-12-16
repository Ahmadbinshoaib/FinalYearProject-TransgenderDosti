import { Component, HostListener } from '@angular/core';
import { UserAuthenticationService } from '../Services/user-authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TeacherCoursesService } from '../Services/teacher-courses.service';

@Component({
  selector: 'app-teacher-mainpage-tabs',
  templateUrl: './teacher-mainpage-tabs.component.html',
  styleUrls: ['./teacher-mainpage-tabs.component.css']
})
export class TeacherMainpageTabsComponent {
  activeTab: string = 'ex1-tabs-1';
  teacherEmail: string = ''
  courses: any[] = [];

  changeTab(tabId: string) {
    this.activeTab = tabId;
  }

  constructor(private userAuthService: UserAuthenticationService, private activeRoute: ActivatedRoute, private courseService: TeacherCoursesService, private router: Router) {

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

    let userId = this.activeRoute.snapshot.paramMap.get('userId')
    console.warn(userId);

    if (userId) {
      this.courseService.getCourses(userId).subscribe(
        (response) => {
          // Assuming the response structure has a 'courses' property
          this.courses = response.courses;
          console.log(this.courses)
        },
        (error) => {
          console.error('Error loading courses', error);
        }
      );
    } else {
      console.error('UserId is null or undefined');
    }









  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isSmallScreen = window.innerWidth < 576;
  }

  navigateToCourseDetails() {
    this.router.navigate(['/teacher-course-details']);
  }



}
