import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EducationPageServicesService } from '../Services/education-page-services.service';

declare var window : any
@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.css']
})
export class CourseDetailComponent {
  course: any
  videoData: any
  tcherModal: any
  noneModal: any
  learnerid:any

  constructor(private http: HttpClient, private activeRoute: ActivatedRoute, private courseService: EducationPageServicesService,
    private router: Router) { }

  userIdParam = this.activeRoute.snapshot.paramMap.get('courseId')

  ngOnInit(): void {
    this.tcherModal= new window.bootstrap.Modal(
      document.getElementById("teacher")
    )

    this.noneModal= new window.bootstrap.Modal(
      document.getElementById("none")
    )
    if (this.userIdParam) {
      this.getCourseDetails(this.userIdParam);

    }


  }


  getCourseDetails(courseId: string): void {
    this.courseService.getCourseDetails(courseId)
      .subscribe(response => {
        this.course = response.course;
        this.videoData=this.course.course_video_url
        console.warn(this.videoData)
         // Handle the response here
      },
        error => {
          console.error(error); // Handle errors here
        });
  }

  routeLogin(){
    this.router.navigate(['/user-authentication']);
  }

  enrollInCourse(learnerId: number, courseId: number): void {
    this.courseService.addCourseRequest(learnerId, courseId)
      .subscribe(
        response => {
          console.log(response);
          // Handle success
        },
        error => {
          console.error(error);
          // Handle error
        }
      );
  }


  enrollmentRequest(){
    

    if (localStorage.getItem('teacher') ) {
     
      this.tcherModal.show()
    } else if (localStorage.getItem('learner')) {

      if (localStorage.getItem('learner')) {
        const learnerStore = localStorage.getItem('learner');
    
        try {
          const learnerData = JSON.parse(learnerStore!);
    
          if (learnerData && learnerData.user_id) {
            console.log(learnerData.user_id);
            this.learnerid = learnerData.user_id;
          } else {
            console.error('Invalid learner data format or missing email property');
          }
        } catch (error) {
          console.error('Error learner teacher data:', error);
        }
      }

      this.enrollInCourse(this.learnerid,Number(this.userIdParam))
      
      
    } else {
      this.noneModal.show()
      
    }
  
    
  }

}


