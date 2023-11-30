// Import necessary modules and services
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { AfterViewInit } from '@angular/core';




@Component({
  selector: 'app-teacher-profile',
  templateUrl: './teacher-profile.component.html',
  styleUrls: ['./teacher-profile.component.css']
})
export class TeacherProfileComponent implements OnInit {

  countries: any[] = [];
  selectedCountry: any;

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.fetchCountries();
  }
 

  fetchCountries() {
    this.http.get<any[]>('https://restcountries.com/v3.1/all')
      .subscribe(
        response => {
          console.warn('API Response:', response.slice(0, 5));
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
        console.log('Flag URL:', flagUrl);
        return {
          name: country.name.common,
          code: `${country.idd?.root?.toString() || ''}${country.idd?.suffixes?.[0]?.toString() || ''}`,
          flag: flagUrl, // Directly use the flag URL without SafeStyle
        };
      });
    console.warn('Processed Countries:', this.countries);
  }
  
  


  // getSafeImageUrl(url: string): SafeStyle {
  //   return this.sanitizer.bypassSecurityTrustUrl(url);
  // }
  

  setPhoneCode() {
    if (this.selectedCountry && this.selectedCountry.code) {
      console.log('Selected Country Phone Code:', `+${this.selectedCountry.code.replace(/\+/g, '')}`);
    }
  }

  onSubmit() {
    console.log('Form Data:', this.selectedCountry);
  }
}
