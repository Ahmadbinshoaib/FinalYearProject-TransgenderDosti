import { Component, ElementRef, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { NgbDateStruct, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { TeacherProfileService } from '../Services/teacher-profile.service';
import { Observable } from 'rxjs/internal/Observable';
import { TeacherProfileData, educationData,workData,languageData,certificateData } from '../datatypes';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-teacher-profile',
  templateUrl: './teacher-profile.component.html',
  styleUrls: ['./teacher-profile.component.css']
})
export class TeacherProfileComponent implements OnInit {
  public imagePath: string = 'assets/Group.png';
  userIdParam = this.activeRoute.snapshot.paramMap.get('userId')
  endDate!: Date | null;
  isCurrentChecked: boolean = false;
  isCurrentChecked2: boolean = false;
  editEducationinfo: any 
  educationalInfo: any[] = [];
  languageInfo: any[] = [];
  certificateInfo: any[] = [];
  languages: any[] = [];
  workInfo: any[] = [];
  educationForm: any = {};
  partEducationId: any
  partWorkId: any
  partLanguageId: any
  partCertificateId: any
  educationInfoById: educationData ={
    educational_background_id: '',
    institution_name: '',
    degree_name:'',
    field_of_study:'',
    start_date: '',
    end_date: '',
    is_current: ''
  }

  workInfoById: workData ={
    work_experience_id: '',
    job_title:'',
    company_workplace_name:'',
    city_town:'',
    country: '',
    description:'',
    start_date: '',
    end_date: '',
    is_current: '',
    relevant_document: ''
  }


  certificateInfoById: certificateData ={
    additional_certificate_id : '',
    certificate_name:'',
    description:'',
    issuing_organization:'',
    issue_date:'',
    credential_id: '',
    credential_url: '',
    relevant_document: ''
  }

  languageInfoById: languageData ={
    language_proficiency_id: '',
    language:'',
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
    this.imagePath = 'assets/Group.png';

    this.fetchCountries();
    if (this.userIdParam) {

      this.loadTeacherEducationInfo(this.userIdParam)
      this.loadTeacherWorkInfo(this.userIdParam)
      this.fetchLanguages()
      this.loadTeacherLanguageInfo(this.userIdParam)
      this.loadTeacherCertificateInfo(this.userIdParam)
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


  fetchLanguages() {
    this.http.get<{ name: string, code: string }[]>('https://list-of-all-countries-and-languages-with-their-codes.p.rapidapi.com/languages', {
      headers: {
        'X-RapidAPI-Key': 'c9fdb6a5e9msh20f52f968979b56p12cd15jsn61047f692718',
        'X-RapidAPI-Host': 'list-of-all-countries-and-languages-with-their-codes.p.rapidapi.com'
      }
    }).subscribe(
      response => {
        this.languages = response;

        // You can now use the 'languages' array in your template to populate the combo box
        const languageNames = this.languages.map(language => language.name);
        
      },
      error => {
        console.error('Error fetching languages:', error);
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


  saveTeacherWorkInfo(data: any) {
    // console.log(data)

    const userId = this.activeRoute.snapshot.paramMap.get('userId');

    if (!userId) {
      console.error('UserId is null or undefined');
      return;
    }
    const requestData = {
      user_id: userId,
      job_title	: data.job_title,
      company_workplace_name: data.companey_name,
      city_town: data.city_name,
      country: data.country,
      description: data.description,
      start_date: data.start_date,
      end_date: data.end_date,
      is_current: data.is_current ? 1 : 0

    };
    // Make API call using the service
    this.teacherProfileService.saveTeacherWorkInfo(requestData).subscribe(
      response => {
        console.log(this.userIdParam)
        if (this.userIdParam) {
          console.warn(this.userIdParam)
          this.loadTeacherWorkInfo(this.userIdParam)

        }


        // console.error('Sucessfully');
      },
      error => {
        console.error('API error:', error);
        // Handle errors
      }
    );
  }




  saveTeacherCertificateInfo(data: any) {
    // console.log(data)

    const userId = this.activeRoute.snapshot.paramMap.get('userId');

    if (!userId) {
      console.error('UserId is null or undefined');
      return;
    }
    const requestData = {
      user_id: userId,
      certificate_name	: data.certificate_name,
      description: data.description,
      issuing_organization: data.issuing_organization,
      issue_date: data.issue_date,
      credential_id: data.credential_id,
      credential_url: data.credential_url,
      
     

    };
    // Make API call using the service
    this.teacherProfileService.saveTeacherCertificateInfo(requestData).subscribe(
      response => {
        console.log(this.userIdParam)
        if (this.userIdParam) {
          console.warn(this.userIdParam)
          this.loadTeacherCertificateInfo(this.userIdParam)

        }


        // console.error('Sucessfully');
      },
      error => {
        console.error('API error:', error);
        // Handle errors
      }
    );
  }



  saveTeacherLanguageInfo(data: any) {
    // console.log(data)

    const userId = this.activeRoute.snapshot.paramMap.get('userId');

    if (!userId) {
      console.error('UserId is null or undefined');
      return;
    }
    const requestData = {
      user_id: userId,
      language	: data.selectedLanguage,

    };
    // Make API call using the service
    this.teacherProfileService.saveTeacherLanguageInfo(requestData).subscribe(
      response => {
        console.log(this.userIdParam)
        if (this.userIdParam) {
          console.warn(this.userIdParam)
          this.loadTeacherLanguageInfo(this.userIdParam)

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


  loadTeacherLanguageInfo(userId: string) {
    console.warn('load')
    if (userId) {
      this.teacherProfileService.getTeacherLanguageInfo(userId).subscribe(
        (response) => {
          // Assuming the response structure has a 'courses' property
          this.languageInfo = response.language_info;
          console.log(this.languageInfo)
        },
        (error) => {
          console.error('Error loading educational info', error);
        }
      );
    } else {
      console.error('UserId is null or undefined');
    }

  }

  loadTeacherWorkInfo(userId: string) {
    console.warn('load')
    if (userId) {
      this.teacherProfileService.getTeacherWorkInfo(userId).subscribe(
        (response) => {
          // Assuming the response structure has a 'courses' property
          this.workInfo = response.work_info;
          console.log(this.workInfo)
        },
        (error) => {
          console.error('Error loading educational info', error);
        }
      );
    } else {
      console.error('UserId is null or undefined');
    }

  }

  loadTeacherCertificateInfo(userId: string) {
    console.warn('load')
    if (userId) {
      this.teacherProfileService.getTeacherCertificateInfo(userId).subscribe(
        (response) => {
          // Assuming the response structure has a 'courses' property
          this.certificateInfo = response.certificate_info;
          console.log(this.workInfo)
        },
        (error) => {
          console.error('Error loading educational info', error);
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

        // Set start_date
        if (this.educationInfoById.start_date) {
          this.educationInfoById.start_date = new Date(this.educationInfoById.start_date).toISOString().split('T')[0];
        }
        // Set end_date
        if (this.educationInfoById.end_date) {
          this.educationInfoById.end_date = new Date(this.educationInfoById.end_date).toISOString().split('T')[0];
        }
        
        console.warn(this.educationInfoById)
      },
      (error) => {
        console.error('Error fetching educational information', error);
      }
    );
  }


  fetchWorkInfo(workId: string) {
    // Use your data service to fetch educational information based on teacher ID
    this.teacherProfileService.getTeacherWorkInfoById(workId).subscribe(
      (data) => {
        this.workInfoById = data.work_info;

        // Set start_date
        if (this.workInfoById.start_date) {
          this.workInfoById.start_date = new Date(this.workInfoById.start_date).toISOString().split('T')[0];
        }
        // Set end_date
        if (this.workInfoById.end_date) {
          this.workInfoById.end_date = new Date(this.workInfoById.end_date).toISOString().split('T')[0];
        }
        
        
        console.warn(this.workInfoById)
      },
      (error) => {
        console.error('Error fetching educational information', error);
      }
    );
  }

  fetchCertificateInfo(certificateId: string) {
    console.log("yes commes in fetch function 3");
    // Use your data service to fetch educational information based on teacher ID
    this.teacherProfileService.getTeacherCertificateInfoById(certificateId).subscribe(
      (data) => {
        this.certificateInfoById = data.certificate_info;

        // Set start_date
        if (this.certificateInfoById.issue_date) {
          this.certificateInfoById.issue_date = new Date(this.certificateInfoById.issue_date).toISOString().split('T')[0];
        }
        
        
        
        console.warn(this.certificateInfoById)
      },
      (error) => {
        console.error('Error fetching educational information', error);
      }
    );
  }

  fetcLanguageInfo(languageId: string) {
    // Use your data service to fetch educational information based on teacher ID
    this.teacherProfileService.getTeacherLanguageInfoById(languageId).subscribe(
      (data) => {
        
        this.languageInfoById = data.language_info;
        
        
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
  openEditModal1(workId: string) {
    this.partWorkId = workId;
    this.fetchWorkInfo(this.partWorkId);
  }
  openDeleteModal(educationId: string) {
    this.partEducationId = educationId;
    this.fetchEducationalInfo(this.partEducationId);
  }
  openDeleteModal1(workId: string) {
    this.partWorkId = workId;
    this.fetchWorkInfo(this.partWorkId);
  }
  openDeleteModal2(languageId: string) {
    this.partLanguageId = languageId;
    this.fetcLanguageInfo(this.partLanguageId);
  }

  openDeleteModal3(certificateId: string) {
    console.log("yes commes in modal 3");
    this.partCertificateId = certificateId;
    this.fetchCertificateInfo(this.partCertificateId);
  }

  updateTeacherEducationalInfo(formData: any, educationalBackgroundId: string) {
    const userId = this.activeRoute.snapshot.paramMap.get('userId');
  
    if (!userId) {
      console.error('UserId is null or undefined');
      return;
    }
  
    const requestData = {
      user_id: userId,
      educational_background_id: educationalBackgroundId,
      institution_name: formData.institution_name,
      degree_name: formData.degree_name,
      field_of_study: formData.field_of_study,
      start_date: formData.start_date,
      end_date: formData.end_date,
      is_current: formData.is_current ? 1 : 0,
    };
  
    this.teacherProfileService.updateTeacherEducationalInfo(requestData).subscribe(
      (response) => {
        console.log('Successfully updated educational information');
        if (this.userIdParam) {
          console.warn(this.userIdParam)
          this.loadTeacherEducationInfo(this.userIdParam)
    
        }
        // You can add any additional logic or reload data if needed
      },
      (error) => {
        console.error('API error:', error);
        // Handle errors
        console.log(error+"")
      }
    );
  }
  
  
  updateTeacherWorkInfo(formData: any, workExperienceId: string) {
    const userId = this.activeRoute.snapshot.paramMap.get('userId');
  
    if (!userId) {
      console.error('UserId is null or undefined');
      return;
    }
  
    const requestData = {
      user_id: userId,
      work_experience_id: workExperienceId,
      job_title: formData.job_title,
      company_workplace_name: formData.company_workplace_name,
      city_town: formData.city_name,
      country: formData.country,
      description: formData.description,
      start_date: formData.start_date,
      end_date: formData.end_date,
      is_current: formData.is_current ? 1 : 0,
    };
     console.log("holllll"+requestData.company_workplace_name)
    this.teacherProfileService.updateTeacherWorkInfo(requestData).subscribe(
      (response) => {
        console.log('Successfully updated work information');
        // You can add any additional logic or reload data if needed
        if (this.userIdParam) {
          console.warn(this.userIdParam)
          this.loadTeacherWorkInfo(this.userIdParam)
    
        }
        
      },
      (error) => {
        console.error('API error:', error);
        // Handle errors
        console.log(error+"")
      }
    );
  }

// Assuming your imports are correctly set up

deleteTeacherEducationInfo(educationalBackgroundId: string) {
  const userId = this.activeRoute.snapshot.paramMap.get('userId');

  if (!userId) {
    console.error('UserId is null or undefined');
    return;
  }
  

  this.teacherProfileService.deleteTeacherEducationInfo(userId, educationalBackgroundId).subscribe(
    (response) => {
      console.log('Successfully deleted education information');
      // You can add any additional logic or reload data if needed
      if (this.userIdParam) {
        console.warn(this.userIdParam)
        this.loadTeacherEducationInfo(this.userIdParam)
  
      }
    },
    (error) => {
      console.error('API error:', error);
      // Handle errors
      console.log(error+"")
    }
  );
}

deleteTeacherWorkInfo(workExperienceId: string) {
  const userId = this.activeRoute.snapshot.paramMap.get('userId');

  if (!userId) {
    console.error('UserId is null or undefined');
    return;
  }

  this.teacherProfileService.deleteTeacherWorkInfo(userId, workExperienceId).subscribe(
    (response) => {
      console.log('Successfully deleted work information');
      // You can add any additional logic or reload data if needed
      if (this.userIdParam) {
        console.warn(this.userIdParam)
        this.loadTeacherWorkInfo(this.userIdParam)
  
      }
    },
    (error) => {
      console.error('API error:', error);
      // Handle errors
      console.log(error+"")
    }
  );
}


deleteTeacherCertificateInfo(certificateId: string) {
  const userId = this.activeRoute.snapshot.paramMap.get('userId');

  if (!userId) {
    console.error('UserId is null or undefined');
    return;
  }

  this.teacherProfileService.deleteTeacherCertificateInfo(userId, certificateId).subscribe(
    (response) => {
      console.log('Successfully deleted work information');
      // You can add any additional logic or reload data if needed
      if (this.userIdParam) {
        console.warn(this.userIdParam)
        this.loadTeacherCertificateInfo(this.userIdParam)
  
      }
    },
    (error) => {
      console.error('API error:', error);
      // Handle errors
      console.log(error+"")
    }
  );
}


deleteLanguageInfo(languageId: string) {
  
  const userId = this.activeRoute.snapshot.paramMap.get('userId');

  if (!userId) {
    console.error('UserId is null or undefined');
    return;
  }
  
  this.teacherProfileService.deleteTeacherLanguageInfo(userId, languageId).subscribe(
    (response) => {
      console.log('Successfully deleted language information');
      // You can add any additional logic or reload data if needed
      if (this.userIdParam) {
        console.warn(this.userIdParam)
        this.loadTeacherLanguageInfo(this.userIdParam)
  
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


