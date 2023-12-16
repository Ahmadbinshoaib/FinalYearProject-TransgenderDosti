import { Component, ElementRef, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { NgbDateStruct, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { TeacherProfileService } from '../Services/teacher-profile.service';
import { Observable } from 'rxjs/internal/Observable';
import { TeacherProfileData, educationData } from '../datatypes';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-teacher-profile',
  templateUrl: './teacher-profile.component.html',
  styleUrls: ['./teacher-profile.component.css']
})
export class TeacherProfileComponent implements OnInit {

  userIdParam = this.activeRoute.snapshot.paramMap.get('userId')
  endDate!: Date | null;
  isCurrentChecked: boolean = false;
  isCurrentChecked2: boolean = false;
  editEducationinfo: any 
  educationalInfo: any[] = [];
  educationForm: any = {};
  partEducationId: any
  educationInfoById: educationData ={
    educational_background_id: '',
    institution_name: '',
    degree_name:'',
    field_of_study:'',
    start_date: '',
    end_date: '',
    is_current: ''
  }
  countries: any[] = [];
  selectedCountry: any = '';
  selectedCity2: string = '' // Initialize cities to null
  cities: string[] = [];
  profile: string = '';
  cnic: any
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

  model!: NgbDateStruct;

  constructor(private http: HttpClient, private sanitizer: DomSanitizer, private activeRoute: ActivatedRoute, private teacherProfileService: TeacherProfileService, private modalService: NgbModal, private el: ElementRef, private renderer: Renderer2) { }
  public imagePath: string = 'assets/Group.png';
  public cnicimagePath: string = '';
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('fileInput2') fileInput2!: ElementRef;
  @ViewChild('education') edModal!: ElementRef;

  openFileInput2(): void {
    // Trigger click on the file input
    this.fileInput2.nativeElement.click();
  }

  onFileSelected2(event: any): void {
    const file = event.target.files[0];

    if (file) {
      this.convertImageToBase64CNIC(file);
    } else {
      console.warn('No file selected');
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];

    if (file) {

      this.convertImageToBase64Profile(file);

    } else {
      this.imagePath = 'assets/Group.png';
    }
  }

  dataURItoBlob(dataURI: string): Blob {
    const splitDataURI = dataURI.split(',');
    const byteString = atob(splitDataURI[1]);
    const mimeString = splitDataURI[0].split(':')[1].split(';')[0];

    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mimeString });
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
  convertImageToBase64CNIC(file: File): void {
    const reader = new FileReader();

    reader.onload = () => {
      this.cnic = reader.result as string;
      // this.imagePath = this.profile

    };

    reader.readAsDataURL(file);
  }
  onEndDateChange() {
    if (this.endDate) {
      // If a date is selected, disable the "Current" checkbox
      // console.warn(this.endDate)
      this.isCurrentChecked2 = true;
    }
  }

  onCurrentChange() {
    if (this.isCurrentChecked) {
      // If "Current" is selected, disable the end date
      this.endDate = null;
    }
  }
  showFileInput(): void {
    // Trigger click on the file input
    this.fileInput.nativeElement.click();
  }

  // Image
  // Image
  // Image

  ngOnInit() {
    this.imagePath = 'assets/Group.png';

    this.fetchCountries();
    if (this.userIdParam) {

      this.loadTeacherEducationInfo(this.userIdParam)
    }


    const userId = this.activeRoute.snapshot.paramMap.get('userId');

    if (userId) {

      this.teacherProfileService.getTeacherPersonalProfile(userId).subscribe(
        (response) => {
          this.teacherData = response.teacher_data;
          this.teacherData.gender = ''
          this.teacherData.city_town = ''
          // console.warn(this.teacherData.bio)
          if (this.teacherData.bio) {
            // console.warn("here")
            this.loadTeacherData(userId);
          }

        },
        (error) => {
          console.error('Error loading teacherData', error);
        }
      );
    }

  }

  fetchCountries() {
    this.http.get<any[]>('https://restcountries.com/v3.1/all')
      .subscribe(
        response => {
          this.processCountries(response);
        },
        error => {
          console.error('Error fetching countries:', error);
        }
      );
  }

  processCountries(data: any[]) {

    this.countries = data
      .filter(country => country.idd?.root)
      .map((country: any) => {
        const flagUrl = country.flags?.png || '';

        return {
          name: country.name.common,
          code: `${country.idd?.root?.toString() || ''}${country.idd?.suffixes?.[0]?.toString() || ''}`,
          flag: flagUrl,
          cities: [] // Cities will be fetched on country selection using the new API
        };
      });
  }

  onCountryChange() {
    // Update the list of cities when a country is selected
    if (this.selectedCountry) {
      const requestBody = { country: this.selectedCountry.name };

      this.http.post<any[]>('https://countriesnow.space/api/v0.1/countries/cities', requestBody)
        .subscribe(
          (response: any) => {
            // Check if the response has the expected property
            if (response && response.data) {
              this.selectedCountry.cities = response.data || [];


              // console.log('Cities:', this.selectedCountry.cities);
            } else {
              console.error('Unexpected API response structure:', response);
            }
          },
          error => {
            console.error('Error fetching cities:', error);
          }
        );
    } else {
      // Reset selectedCity if no country is selected
    }

    this.setPhoneCode();
  }

  setPhoneCode() {
    if (this.selectedCountry && this.selectedCountry.code) {
      this.selectedCountry.code.replace(/\+/g, '');
    }
  }

  onSubmit() {
    // console.log('Form Data:', this.selectedCountry);
  }


  createTeacherProfilePersonal(data: any) {


    const userId = this.activeRoute.snapshot.paramMap.get('userId');

    if (!userId) {
      console.error('UserId is null or undefined');
      return;
    }
    const requestData = {
      user_id: userId,
      phonenumber: data.phonenumber,
      bio: data.bio,
      city: data.city,
      gender: data.gender,
      profile_picture: this.profile,
      cnic_picture: this.cnic,
      country: data.country.name,
    };


    // Make API call using the service
    this.teacherProfileService.createTeacherPersonalProfile(requestData).subscribe(
      response => {
        // this.loadTeacherData(userId);

        // console.log('API response:', response);
        // Handle the response as needed
      },
      error => {
        console.error('API error:', error);
        // Handle errors
      }
    );
  }

  saveTeacherEducationalInfo(data: any) {
    // console.log(data)

    const userId = this.activeRoute.snapshot.paramMap.get('userId');

    if (!userId) {
      console.error('UserId is null or undefined');
      return;
    }
    const requestData = {
      user_id: userId,
      institution_name: data.institution_name,
      degree_name: data.degree_name,
      field_of_study: data.field_of_study,
      start_date: data.start_date,
      end_date: data.end_date,
      is_current: data.is_current ? 1 : 0
    };
    // Make API call using the service
    this.teacherProfileService.saveTeacherEducationalInfo(requestData).subscribe(
      response => {
        console.log(this.userIdParam)
        if (this.userIdParam) {
          console.warn(this.userIdParam)
          this.loadTeacherEducationInfo(this.userIdParam)


        }


        // console.error('Sucessfully');
      },
      error => {
        console.error('API error:', error);
        // Handle errors
      }
    );
  }


  loadTeacherData(userId: string): void {
    this.teacherProfileService.getTeacherPersonalProfile(userId).subscribe(
      (response) => {
        this.teacherData = response.teacher_data;

        if (this.teacherData.bio) {

          // console.warn(this.teacherData.profile_picture)
          if (this.teacherData.profile_picture) {
            this.imagePath = this.teacherData.profile_picture;

          }

          this.selectedCountry = this.countries.find(country => country.name === this.teacherData.country);
          this.onCountryChange();
          // console.log(this.teacherData.city_town)
          this.selectedCity2 = this.teacherData.city_town;
          // console.log('Selected Country:', this.selectedCountry);
          // console.log('Selected City:', this.selectedCity2);
        }

      },
      (error) => {
        console.error('Error loading teacherData', error);
      }
    );
  }

  loadTeacherEducationInfo(userId: string) {
    console.warn('load')
    if (userId) {
      this.teacherProfileService.getTeacherEducationalInfo(userId).subscribe(
        (response) => {
          // Assuming the response structure has a 'courses' property
          this.educationalInfo = response.educational_info;
          console.log(this.educationalInfo)
        },
        (error) => {
          console.error('Error loading educational info', error);
        }
      );
    } else {
      console.error('UserId is null or undefined');
    }

  }

  private closeModal() {
    // Check if yourModal is defined before attempting to access its nativeElement
    if (this.edModal && this.edModal.nativeElement) {
      this.edModal.nativeElement.style.display = 'none';
    } else {
      console.error('Modal reference is not available.');
    }
  }

  formatDate(date: any): string {
    return new Date(date).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  fetchEducationalInfo(educationId: string) {
    // Use your data service to fetch educational information based on teacher ID
    this.teacherProfileService.getTeacherEducationalInfoById(educationId).subscribe(
      (data) => {
        this.educationInfoById = data.educational_info;
        
        console.warn(this.educationInfoById)
      },
      (error) => {
        console.error('Error fetching educational information', error);
      }
    );
  }

  openEditModal(educationId: string) {
    this.partEducationId = educationId;
    this.fetchEducationalInfo(this.partEducationId);
  }

  editTeacherEducationalInfo(data: any){

  }




}