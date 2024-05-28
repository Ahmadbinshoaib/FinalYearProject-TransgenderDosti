import { Component, ElementRef, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { TeacherCoursesService } from '../Services/teacher-courses.service';
import { ActivatedRoute } from '@angular/router';
import { announcementData, courseData } from '../datatypes';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-teacher-course-dashboard',
  templateUrl: './teacher-course-dashboard.component.html',
  styleUrls: ['./teacher-course-dashboard.component.css']
})
export class TeacherCourseDashboardComponent implements OnInit {
  courseIdParam: string | null = null; // Provide a default value or mark it as potentially undefined
  courseInfo: any; // You can define a model for the course information

  courseInfoById: courseData = {
    'course_id': '',
    'title': '',
    'course_code': '',
    'details': '',
    'course_for': '',
    'course_fee': '',
    'course_duration': '',
    'course_video_url': '',
    'course_picture': ''
  }
  announcementInfo: any[] = [];
  partAnnouncementId: any
  announcementInfoById: announcementData = {
    'announcement_id': '',
    'for_students': '',
    'description': '',
    'material': '',
    'link': '',
  }
  material: any
  public materialPath: string = '';
  selectedStudent: string = 'All Students';
  announcementDescription: string = '';
  public link: string = '';
  

  constructor(
    private activeRoute: ActivatedRoute,
    private courseService: TeacherCoursesService,
    private toastr: ToastrService,
  ) {
    this.activeRoute.params.subscribe(params => {
      this.courseIdParam = params['courseId'];
      if (this.courseIdParam) {
        this.fetchIndCourseInfo(this.courseIdParam);
      }
    });
  }
 
  @ViewChild('fileInput') fileInput!: ElementRef;

  

  ngOnInit() {
    // Optionally, you can call loadCourseInfo() in ngOnInit if needed.
    
  }


  showFileInput(): void {
    // Trigger click on the file input
    this.fileInput.nativeElement.click();
  }
  onFileSelected(event: any): void {
    const file = event.target.files[0];

    if (file) {
      console.warn(file)

      this.convertImageToBase64Profile(file);

    } 
  }
  convertImageToBase64Profile(file: File): void {
    const reader = new FileReader();

    reader.onload = () => {
      this.material = reader.result as string;
      this.materialPath = this.material
      // console.log(this.profile)
    };

    reader.readAsDataURL(file);
  }


  submitAnnouncement() {
    // Use the values stored in the properties for further processing or logging
    console.log('Selected Student:', this.selectedStudent);
    console.log('Announcement Description:', this.announcementDescription);

    // Here you can perform additional logic, send data to a server, etc.

    // Clear the input fields after submission if needed
    this.selectedStudent = 'All Students';
    this.announcementDescription = '';
  }


  fetchIndCourseInfo(courseId: string) {

    // Use your data service to fetch educational information based on teacher ID
    this.courseService.getCourseInfoById(courseId).subscribe(
      (data) => {
        this.courseInfoById = data.course_data;
        console.warn(this.courseInfoById)

      },
      (error) => {
        console.error('Error fetching educational information', error);
      }
    );
  }
}
