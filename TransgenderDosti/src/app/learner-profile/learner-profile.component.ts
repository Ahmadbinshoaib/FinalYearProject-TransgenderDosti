import { Component, ElementRef, OnInit, ViewChild, Renderer2 } from '@angular/core';
//imports in teacher profile 

import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { NgbDateStruct, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { LearnerProfileService } from '../Services/learner-profile.service';

import { Observable } from 'rxjs/internal/Observable';
import { LearnerProfileData, LearnerwebsiteData, LearnersocialData } from '../datatypes';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-learner-profile',
  templateUrl: './learner-profile.component.html',
  styleUrls: ['./learner-profile.component.css']
})
export class LearnerProfileComponent implements OnInit{

  public imagePath: string = 'assets/Group.png';
  userIdParam = this.activeRoute.snapshot.paramMap.get('userId')
  endDate!: Date | null;
  isCurrentChecked: boolean = false;
  isCurrentChecked2: boolean = false;
  socialInfo: any[] = [];
  websiteInfo: any[] = [];
  
  partSocialId: any
  partWebsiteId: any
 

  

  

  socialInfoById: LearnersocialData ={
    social_media_profile_id: '',
    platform_name:'',
    profile_url:'',

  }
  websiteInfoById: LearnerwebsiteData ={
    website_id: '',
    website_name:'',
    website_url:'',
  }

  countries: any[] = [];
  selectedCountry: any = '';
  selectedCity2: string = '' // Initialize cities to null
  cities: string[] = [];
  profile: string = '';
  cnic: any
  learnerData: LearnerProfileData = {
    user_id: '',
    phone_number: 0,
    bio: '',
    city_town: '',
    gender: '',
    cnic_picture: '',
    profile_picture: '',
    country: '',
    learner_id: ''
  }

  model!: NgbDateStruct;

  constructor(private http: HttpClient, private sanitizer: DomSanitizer, private activeRoute: ActivatedRoute, private learnerProfileService: LearnerProfileService, private modalService: NgbModal, private el: ElementRef, private renderer: Renderer2) { }
  // public imagePath: string = 'assets/Group.png';
  public cnicimagePath: string = '';
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('fileInput2') fileInput2!: ElementRef;
  @ViewChild('education') edModal!: ElementRef;
  @ViewChild('work') workModal!: ElementRef;


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
    this.userIdParam = this.activeRoute.snapshot.paramMap.get('userId')
    this.imagePath = 'assets/Group.png';
    console.log("current user id is "+this.userIdParam)

    this.fetchCountries();
    if (this.userIdParam) {
      this.loadLearnerSocialInfo(this.userIdParam)
      this.loadLearnerWebsiteInfo(this.userIdParam)
    }


    const userId = this.activeRoute.snapshot.paramMap.get('userId')
    console.log("current user id is "+userId)

    if (userId) {

      this.learnerProfileService.getLearnerPersonalProfile(userId).subscribe(
        (response) => {
          this.learnerData = response.learner_data;
          this.learnerData.gender = ''
          this.learnerData.city_town = ''
          // console.warn(this.teacherData.bio)
          if (this.learnerData.bio) {
            // console.warn("here")
            this.loadLearnerData(userId);
          }

        },
        (error) => {
          console.error('Error loading learnetrData', error);
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


  createLearnerProfilePersonal(data: any) {


    const userId = this.userIdParam
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
    this.learnerProfileService.createLearnerPersonalProfile(requestData).subscribe(
      response => {
        this.loadLearnerData(userId);

        console.log('API response:', response);
        // Handle the response as needed
      },
      error => {
        console.error('API error:', error);
        // Handle errors
      }
    );
  }



  saveLearnerSocialInfo(data: any) {
    // console.log(data)

    const userId = this.activeRoute.snapshot.paramMap.get('userId');

    if (!userId) {
      console.error('UserId is null or undefined');
      return;
    }
    const requestData = {
      user_id: userId,
      platform_name	: data.platform_name,
      profile_url: data.profile_url,
      
    };
    // Make API call using the service
    this.learnerProfileService.saveLearnerSocialInfo(requestData).subscribe(
      response => {
        console.log(this.userIdParam)
        if (this.userIdParam) {
          console.warn(this.userIdParam)
          this.loadLearnerSocialInfo(this.userIdParam)

        }


        // console.error('Sucessfully');
      },
      error => {
        console.error('API error:', error);
        // Handle errors
      }
    );
  }

  saveLearnerWebsiteInfo(data: any) {
    // console.log(data)

    const userId = this.activeRoute.snapshot.paramMap.get('userId');

    if (!userId) {
      console.error('UserId is null or undefined');
      return;
    }
    const requestData = {
      user_id: userId,
      website_name	: data.website_name,
      website_url: data.website_url,
      
    };
    // Make API call using the service
    this.learnerProfileService.saveLearnerWebsiteInfo(requestData).subscribe(
      response => {
        console.log(this.userIdParam)
        if (this.userIdParam) {
          console.warn(this.userIdParam)
          this.loadLearnerWebsiteInfo(this.userIdParam)

        }


        // console.error('Sucessfully');
      },
      error => {
        console.error('API error:', error);
        // Handle errors
      }
    );
  }




  



  loadLearnerData(userId: string): void {
    
    this.learnerProfileService.getLearnerPersonalProfile(userId).subscribe(
      (response) => {
        this.learnerData = response.learner_data;

        if (this.learnerData.bio) {

          // console.warn(this.teacherData.profile_picture)
          if (this.learnerData.profile_picture) {
            this.imagePath = this.learnerData.profile_picture;

          }

          this.selectedCountry = this.countries.find(country => country.name === this.learnerData.country);
          this.onCountryChange();
          // console.log(this.teacherData.city_town)
          this.selectedCity2 = this.learnerData.city_town;
          // console.log('Selected Country:', this.selectedCountry);
          // console.log('Selected City:', this.selectedCity2);
        }

      },
      (error) => {
        console.error('Error loading learnerData', error);
      }
    );
  }

  


 

  

  loadLearnerSocialInfo(userId: string) {
    console.warn('load')
    if (userId) {
      this.learnerProfileService.getLearnerSocialInfo(userId).subscribe(
        (response) => {
          // Assuming the response structure has a 'courses' property
          this.socialInfo = response.social_info;
          console.log(this.socialInfo)
        },
        (error) => {
          console.error('Error loading social info', error);
        }
      );
    } else {
      console.error('UserId is null or undefined');
    }

  }

  loadLearnerWebsiteInfo(userId: string) {
    console.warn('load')
    if (userId) {
      this.learnerProfileService.getLearnerWebsiteInfo(userId).subscribe(
        (response) => {
          // Assuming the response structure has a 'courses' property
          this.websiteInfo = response.website_info;
          console.log(this.websiteInfo)
        },
        (error) => {
          console.error('Error loading website info', error);
        }
      );
    } else {
      console.error('UserId is null or undefined');
    }

  }

  


  closeModal() {
    // Check if yourModal is defined before attempting to access its nativeElement
    if (this.edModal && this.edModal.nativeElement) {
      this.edModal.nativeElement.style.display = 'none';
    } else {
      console.error('Modal reference is not available.');
    }
  }

  

  


  

  
  fetchSocialInfo(socialId: string) {
    // Use your data service to fetch educational information based on teacher ID
    this.learnerProfileService.getLearnerSocialInfoById(socialId).subscribe(
      (data) => {
        
        this.socialInfoById = data.social_info;
        
        
      },
      (error) => {
        console.error('Error fetching educational information', error);
      }
    );
  }
  fetchWebsiteInfo(websiteId: string) {
    // Use your data service to fetch educational information based on teacher ID
    this.learnerProfileService.getLearnerWebsiteInfoById(websiteId).subscribe(
      (data) => {
        
        this.websiteInfoById = data.website_info;
        
        
      },
      (error) => {
        console.error('Error fetching educational information', error);
      }
    );
  }

  
  openDeleteModal4(socialId: string) {
   
    this.partSocialId = socialId;
    this.fetchSocialInfo(this.partSocialId);
  }
  openDeleteModal5(websiteId: string) {
    
    this.partWebsiteId = websiteId;
    this.fetchWebsiteInfo(this.partWebsiteId);
  }

 


deleteLearnerSocialInfo(socialId: string) {
  const userId = this.activeRoute.snapshot.paramMap.get('userId');

  if (!userId) {
    console.error('UserId is null or undefined');
    return;
  }

  this.learnerProfileService.deleteLearnerSocialInfo(userId, socialId).subscribe(
    (response) => {
      console.log('Successfully deleted social information');
      // You can add any additional logic or reload data if needed
      if (this.userIdParam) {
        console.warn(this.userIdParam)
        this.loadLearnerSocialInfo(this.userIdParam)
  
      }
    },
    (error) => {
      console.error('API error:', error);
      // Handle errors
      console.log(error+"")
    }
  );
}
deleteLearnerWebsiteInfo(websiteId: string) {
  const userId = this.activeRoute.snapshot.paramMap.get('userId');

  if (!userId) {
    console.error('UserId is null or undefined');
    return;
  }

  this.learnerProfileService.deleteLearnerWebsiteInfo(userId, websiteId).subscribe(
    (response) => {
      console.log('Successfully deleted website information');
      // You can add any additional logic or reload data if needed
      if (this.userIdParam) {
        console.warn(this.userIdParam)
        this.loadLearnerWebsiteInfo(this.userIdParam)
  
      }
    },
    (error) => {
      console.error('API error:', error);
      // Handle errors
      console.log(error+"")
    }
  );
}




}
