import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EducationPageServicesService } from '../Services/education-page-services.service';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.css']
})
export class CourseDetailComponent {
  course: any
  videoData: any

  constructor(private http: HttpClient, private activeRoute: ActivatedRoute, private courseService: EducationPageServicesService) { }

  userIdParam = this.activeRoute.snapshot.paramMap.get('courseId')

  ngOnInit(): void {

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

}


