import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { UserAuthenticationService } from '../Services/user-authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TeacherCoursesService } from '../Services/teacher-courses.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TeacherProfileService } from '../Services/teacher-profile.service';
import { TeacherProfileData, courseData, educationData } from '../datatypes';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-teacher-mainpage-tabs',
  templateUrl: './teacher-mainpage-tabs.component.html',
  styleUrls: ['./teacher-mainpage-tabs.component.css']
})
export class TeacherMainpageTabsComponent {
  userId = this.activeRoute.snapshot.paramMap.get('userId')
  // console.warn(userId);
  courses: any[] = []; // Assuming your course array has a certain structure
  pageSize = 5; // Number of courses to show per page
  currentPage = 1; // Current page number
  totalPages!: number;


  public imagePath: string = '';
  public videoData: string = ''
  // selectedDuration2: string=''
  selectedDuration: string = 'Select your duration'; // or 'Weeks', or 'Hours' based on your requirement
  userIdParam = this.activeRoute.snapshot.paramMap.get('userId')
  activeTab: string = 'ex1-tabs-1';
  teacherEmail: string = ''

  currencies: any[] = [];
  selectedCurrency: any = '';
  teacherData: TeacherProfileData = {
    user_id: '',
    phone_number: 0,
    bio: '',
    city_town: '',
    gender: '',
    cnic_picture: '',
    profile_picture: '',
    country: '',
    teacher_id: ''
  }

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

  profile: string = '';
  video: string = ''

  partCourseId: any;

  changeTab(tabId: string) {
    this.activeTab = tabId;
  }

  constructor(
    private userAuthService: UserAuthenticationService,
    private activeRoute: ActivatedRoute,
    private courseService: TeacherCoursesService,
    private router: Router, private http: HttpClient,
    private teacherProfileService: TeacherProfileService,
    private toastr: ToastrService) {


  }
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('fileInput2') fileInput2!: ElementRef;
  isSmallScreen: boolean = false;


  ngOnInit() {
    if (this.userIdParam) {
      this.loadTeacherData(this.userIdParam);
    }


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

    this.loadCourses();



  }
  loadCourses() {
    this.imagePath = ''
    this.videoData = ''
    if (this.userId) {
      this.courseService.getCourses(this.userId).subscribe(
        (response) => {
          // Assuming the response structure has a 'courses' property
          this.courses = response.courses;
          this.calculateTotalPages();
          console.log(this.courses);
        },
        (error) => {
          console.error('Error loading courses', error);
        }
      );
    } else {
      console.error('UserId is null or undefined');
    }
  }

  calculateTotalPages() {
    this.totalPages = Math.ceil(this.courses.length / this.pageSize);
  }

  setPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getPageNumbers(): number[] {
    return Array(this.totalPages).fill(0).map((x, i) => i + 1);
  }

  getDisplayedCourses(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.courses.slice(startIndex, endIndex);
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

  saveCourseInfo(data: any) {
    console.log(data)

  }

  loadTeacherData(userId: string): void {
    this.teacherProfileService.getTeacherPersonalProfile(userId).subscribe(
      (response) => {
        this.teacherData = response.teacher_data;
        const country = this.teacherData.country;

        // Update the selectedCurrency based on the country
        this.fetchCurrencyCodeByCountry(country);

        // ... rest of your code
      },
      (error) => {
        console.error('Error loading teacherData', error);
      }
    );
  }

  fetchCurrencyCodeByCountry(country: string): void {
    const apiUrl = 'https://v6.exchangerate-api.com/v6/a3bc2b8228f6183c581168da/codes';
    this.http.get(apiUrl).subscribe((response: any) => {
      if (response.result === 'success') {
        this.currencies = response.supported_codes.map((code: string[]) => ({ code: code[0], name: code[1] }));
        const normalizedCountry = country.toLowerCase();
        console.log('Normalized Country:', normalizedCountry);
        console.log('Supported Codes:', response.supported_codes);

        const matchedCurrency = response.supported_codes.find(
          (code: string[]) => code[1].toLowerCase().includes(normalizedCountry)
        );

        if (matchedCurrency) {
          this.selectedCurrency = matchedCurrency[0];
        } else {
          console.warn(`Currency code not found for country: ${country}`);
          // Set a default currency code if the country is not found
          this.selectedCurrency = 'USD';
        }
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];

    if (file) {
      console.warn(file)

      this.convertImageToBase64Profile(file);

    } else {
      this.imagePath = 'assets/Group.png';
    }
  }



  // onVideoSelected(event: any): void {
  //   const file = event.target.files[0];

  //   if (file) {
  //     console.log(file)

  //     this.convertVideoToBase64Profile(file);

  //   } else {
  //     this.videoData = '';
  //   }
  // }

  showFileInput(): void {
    // Trigger click on the file input
    this.fileInput.nativeElement.click();
  }

  showFileInputV(): void {
    // Trigger click on the file input

    this.fileInput2.nativeElement.click();
    console.warn('hey')
  }

  convertImageToBase64Profile(file: File): void {
    const reader = new FileReader();

    reader.onload = () => {
      this.profile = reader.result as string;
      this.imagePath = this.profile
      // console.log(this.profile)
    };

    reader.readAsDataURL(file);
  }

  // convertVideoToBase64Profile(file: File): void {
  //   const reader = new FileReader();

  //   reader.onload = () => {
  //     this.video = reader.result as string;
  //     this.videoData = this.video
  //     console.log(this.videoData)
  //   };

  //   reader.readAsDataURL(file);
  // }

  onVideoSelected(event: any): void {
    const file = event.target.files[0];

    if (file) {
      console.log(file);

      // Clear existing videoData
      this.videoData = '';

      this.convertVideoToBase64Profile(file);
    } else {
      this.videoData = '';
    }
  }

  convertVideoToBase64Profile(file: File): void {
    const reader = new FileReader();

    reader.onload = () => {
      this.video = reader.result as string;
      this.videoData = this.video;
      console.log(this.videoData);
    };

    reader.readAsDataURL(file);
  }


  createCourse(formData: any): void {
    this.imagePath = ''
    this.videoData = ''

    const userId = this.activeRoute.snapshot.paramMap.get('userId');

    if (!userId) {
      console.error('UserId is null or undefined');
      return;
    }

    const courseFeeString = `${formData.selectedCurrency} ${formData.course_fee}`;
    const courseDurationString = `${formData.course_duration} ${formData.selectedCourseDuration}`;

    // Update the formData with the concatenated values
    formData.course_fee = courseFeeString;
    formData.course_duration = courseDurationString;

    const requestData = {
      user_id: userId,
      title: formData.course_title,
      details: formData.course_details,
      course_for: formData.course_for,
      course_fee: formData.course_fee,
      course_duration: formData.course_duration,
      course_video_url: this.video,
      course_picture: this.profile,

    };

    // Now you can use the modified formData as needed
    console.log(requestData);
    if (this.userId) {
      this.courseService.createCourse(requestData).subscribe(
        (response) => {

          this.toastr.success('Course created successfully!', 'Success');
          this.loadCourses()


        },
        (error) => {
          this.toastr.error('Course creation failed. Try again! ' + error.error.error, 'Error');
          console.error('Error loading courses', error);
        }
      );
    } else {

      console.error('UserId is null or undefined');
    }


    // Call your saveCourseInfo method or any other logic you need
    // this.saveCourseInfo(formData);
  }

  resetFields() {
    this.imagePath = ''
    this.videoData = ''

  }

  openCourseEditModal(courseId: string) {
    console.log('course' + courseId)
    this.partCourseId = courseId;
    this.fetchIndCourseInfo(this.partCourseId);


  }
  openDeleteModal(courseId: string) {
    console.log('course' + courseId)
    this.partCourseId = courseId;
    this.fetchIndCourseInfo(this.partCourseId);
  }

  fetchIndCourseInfo(courseId: string) {

    // Use your data service to fetch educational information based on teacher ID
    this.courseService.getCourseInfoById(courseId).subscribe(
      (data) => {
        this.courseInfoById = data.course_data;
        console.warn(this.courseInfoById)
        const ar = this.courseInfoById.course_fee.split(' ')
        const dur = this.courseInfoById.course_duration.split(' ')

        this.selectedCurrency = ar[0]
        this.selectedDuration = dur[1]

        this.imagePath = this.courseInfoById.course_picture
        this.videoData = this.courseInfoById.course_video_url
        console.log(this.videoData)

      },
      (error) => {
        console.error('Error fetching educational information', error);
      }
    );
  }

  editCourseById(formData: any, courseId: string) {
    const userId = this.activeRoute.snapshot.paramMap.get('userId');

    if (!userId) {
      console.error('UserId is null or undefined');
      return;
    }

    const courseFeeString = `${formData.selectedCurrency} ${formData.course_fee}`;
    const courseDurationString = `${formData.course_duration} ${formData.selectedCourseDuration}`;

    // Update the formData with the concatenated values
    formData.course_fee = courseFeeString;
    formData.course_duration = courseDurationString;

    const requestData = {
      user_id: userId,
      course_id: courseId,
      title: formData.course_title,
      details: formData.course_details,
      course_for: formData.course_for,
      course_fee: formData.course_fee,
      course_duration: formData.course_duration,
      course_video_url: this.videoData,
      course_picture: this.imagePath,

    };

    // Now you can use the modified formData as needed
    console.log(requestData);
    if (this.userId) {
      this.courseService.updateCourse(requestData).subscribe(
        (response) => {

          this.toastr.success('Course updated successfully!', 'Success');
          this.loadCourses()


        },
        (error) => {
          this.toastr.error('Course updation failed. Try again! ' + error.error.error, 'Error');
          console.error('Error loading courses', error);
        }
      );
    } else {

      console.error('UserId is null or undefined');
    }

  }

  deleteCourseById(courseId: string) {
    console.warn('delcourseid' + courseId)
    const userId = this.activeRoute.snapshot.paramMap.get('userId');

    if (!userId) {
      console.error('UserId is null or undefined');
      return;
    }


    this.courseService.deleteCourse(userId, courseId).subscribe(
      (response) => {
        console.log('Successfully deleted education information');
        // You can add any additional logic or reload data if needed
        if (this.userIdParam) {
          console.warn(this.userIdParam)
          this.loadCourses()

        }
      },
      (error) => {
        console.error('API error:', error);
        // Handle errors
        console.log(error + "")
      }
    );
  }







}
