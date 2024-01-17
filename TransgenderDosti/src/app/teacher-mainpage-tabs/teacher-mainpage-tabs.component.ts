import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { UserAuthenticationService } from '../Services/user-authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TeacherCoursesService } from '../Services/teacher-courses.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TeacherProfileService } from '../Services/teacher-profile.service';
import { TeacherProfileData } from '../datatypes';

@Component({
  selector: 'app-teacher-mainpage-tabs',
  templateUrl: './teacher-mainpage-tabs.component.html',
  styleUrls: ['./teacher-mainpage-tabs.component.css']
})
export class TeacherMainpageTabsComponent {
  public imagePath: string = 'assets/Group.png';
  userIdParam = this.activeRoute.snapshot.paramMap.get('userId')
  activeTab: string = 'ex1-tabs-1';
  teacherEmail: string = ''
  courses: any[] = [];
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

  profile: string = '';

  changeTab(tabId: string) {
    this.activeTab = tabId;
  }

  constructor(private userAuthService: UserAuthenticationService, private activeRoute: ActivatedRoute, private courseService: TeacherCoursesService, private router: Router, private http: HttpClient, private teacherProfileService: TeacherProfileService) {
    

  }
  @ViewChild('fileInput') fileInput!: ElementRef;
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

  saveCourseInfo(data: any) {

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

      this.convertImageToBase64Profile(file);

    } else {
      this.imagePath = 'assets/Group.png';
    }
  }

  showFileInput(): void {
    // Trigger click on the file input
    this.fileInput.nativeElement.click();
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






}
