import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { TeacherPersonal } from '../datatypes';
import { TeacherProfileService } from '../Services/teacher-profile.service';

@Component({
  selector: 'app-teacher-profile',
  templateUrl: './teacher-profile.component.html',
  styleUrls: ['./teacher-profile.component.css']
})
export class TeacherProfileComponent implements OnInit {

  countries: any[] = [];
  selectedCountry: any = ''; // Initialize cities to null
  cities: string[] = [];
  profile: any;
  cnic: any

  constructor(private http: HttpClient, private sanitizer: DomSanitizer, private activeRoute: ActivatedRoute, private teacherProfileService: TeacherProfileService) { }
  public imagePath: string = 'assets/Group.png';
  public cnicimagePath: string = '';
  @ViewChild('fileInput') fileInput!: ElementRef; 
  @ViewChild('fileInput2') fileInput2!: ElementRef;

  openFileInput2(): void {
    // Trigger click on the file input
    this.fileInput2.nativeElement.click();
  }

  onFileSelected2(event: any): void {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.cnicimagePath = e.target.result;

        // Convert base64 to Blob
        this.cnic = this.dataURItoBlob(this.cnicimagePath);
  
        // Now you can use 'blob' as needed, for example, upload it to a server
        console.log(this.cnic);
      };
      reader.readAsDataURL(file);
    } else {
      console.warn('No file selected');
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
  
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePath = e.target.result;
  
        // Convert base64 to Blob
         this.profile = this.dataURItoBlob(this.imagePath);
  
        // Now you can use 'blob' as needed, for example, upload it to a server
        console.log(this.profile);
      };
  
      reader.readAsDataURL(file);
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
  
  showFileInput(): void {
    // Trigger click on the file input
    this.fileInput.nativeElement.click();
  }

  // Image
  // Image
  // Image

  ngOnInit() {

    this.fetchCountries();



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
              this.cities = this.selectedCountry.cities;
              console.log('Cities:', this.cities);
            } else {
              console.error('Unexpected API response structure:', response);
            }
          },
          error => {
            console.error('Error fetching cities:', error);
          }
        );
    } else {
      this.cities = [];
    }

    this.setPhoneCode();
  }





  setPhoneCode() {
    if (this.selectedCountry && this.selectedCountry.code) {
      this.selectedCountry.code.replace(/\+/g, '');
    }
  }

  onSubmit() {
    console.log('Form Data:', this.selectedCountry);
  }



  // createTeacherProfilePersonal(data: any) {
  //   const userId = this.activeRoute.snapshot.paramMap.get('userId');

  //   if (!userId) {
  //     console.error('UserId is null or undefined');
  //     return;
  //   }

  //   // Create FormData and append necessary data
  //   console.log(data.bio)
  //   const formData = new FormData();
  //   formData.append('user_id', userId);
  //   formData.append('phonenumber', data.phonenumber);
  //   formData.append('bio', data.bio);
  //   formData.append('city', data.city);
  //   formData.append('gender', data.gender);
  
  
    

  //   // Ensure imagePath is a string before attempting to create a Blob
  //   if (typeof this.imagePath === 'string') {
  //     const profilePictureFile = this.teacherProfileService.getBlobFromImagePath(this.imagePath);
  //     if (profilePictureFile) {
  //       formData.append('profile_picture', profilePictureFile, 'profile_picture.jpg');
  //     }

     
  //   }

  //   // Assuming data.cnic_picture is a File object
  //   if (typeof this.imagePath === 'string') {
  //     const cnicPictureFile = this.teacherProfileService.getBlobFromImagePath(this.cnicimagePath);
  //     if (cnicPictureFile) {
  //       formData.append('cnic_picture', cnicPictureFile, 'cnic_picture.jpg');
  //     }

     
  //   }

  //   // Extract the name property from the country object
  //   formData.append('country', data.country.name);
  //   for (let pair of (formData as any).entries()) {
  //     console.log(pair[0] + ': ' + pair[1]);
  //   }

  //   // Make API call using the service
  //   this.teacherProfileService.createTeacherPersonalProfile(formData).subscribe(
  //     response => {
  //       console.log('API response:', response);
  //       // Handle the response as needed
  //     },
  //     error => {
  //       console.error('API error:', error);
  //       // Handle errors
  //     }
  //   );
  // }

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
        console.log('API response:', response);
        // Handle the response as needed
      },
      error => {
        console.error('API error:', error);
        // Handle errors
      }
    );
  }
  

}