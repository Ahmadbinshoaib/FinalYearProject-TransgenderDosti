
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { EducationPageServicesService } from '../Services/education-page-services.service';
import { LearnerProfileService } from '../Services/learner-profile.service';

@Component({
  selector: 'app-learner-mainpage',
  templateUrl: './learner-mainpage.component.html',
  styleUrls: ['./learner-mainpage.component.css']
})
export class LearnerMainpageComponent {
  userId = this.activeRoute.snapshot.paramMap.get('userId')

  learnerEmail: any
  activeTab: string = 'ex1-tabs-1';
  isSmallScreen: boolean = false;
  pageSize = 5; // Number of courses to show per page
  currentPage = 1; // Current page number
  totalPages!: number;
  requestCourses: any[] = [];
  userAndCoursesData: any []=[]
  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private courseService: EducationPageServicesService,
    private acceptedCourses: LearnerProfileService) { }


  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isSmallScreen = window.innerWidth < 576;
  }


  changeTab(tabId: string) {
    this.activeTab = tabId;
  }

  navigateToPayment() {
    this.router.navigate(['/course-payment']);
  }

  ngOnInit() {
    if(this.userId)

    this.acceptedCourses.getUserAcceptedCourses(this.userId).subscribe(
      (data) => {
        this.userAndCoursesData = data.course_info;
        
        console.log(data); // Check the console for the API response
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  

    if (localStorage.getItem('learner')) {
      const learnerStore = localStorage.getItem('learner');

      try {
        const learnerData = JSON.parse(learnerStore!);

        if (learnerData && learnerData.name) {
          console.log(learnerData.name);
          this.learnerEmail = learnerData.name;
        } else {
          console.error('Invalid learner data format or missing email property');
        }
      } catch (error) {
        console.error('Error learner teacher data:', error);
      }
    }

    this.loadRequestCourses()
  }


  loadRequestCourses() {
    // Replace with the actual user id
    if (this.userId)
      this.courseService.getLearnerRequestCourses(this.userId).subscribe(
        (response) => {
          this.requestCourses = response.courses
          this.calculateTotalPages();
        },
        (error) => {
          console.error('Error fetching courses:', error);
        }
      );
  }

  calculateTotalPages() {
    this.totalPages = Math.ceil(this.requestCourses.length / this.pageSize);
  }

  getPageNumbers(): number[] {
    return Array(this.totalPages).fill(0).map((x, i) => i + 1);
  }

  getDisplayedCourses(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.requestCourses.slice(startIndex, endIndex);
  }

  setPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getDisplayedCoursesaccepted(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.requestCourses.slice(startIndex, endIndex);
  }



  navigateToCourseDetails() {

    this.router.navigate(['/learner-course-details/learner-course-dashboard']);

  }


}
