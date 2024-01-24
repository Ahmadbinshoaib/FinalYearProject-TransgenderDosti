import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { SignInResponse, signIn, userTeacher } from '../datatypes';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { NavigationEnd } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TeacherProfileService {
  private serverUrl = 'http://127.0.0.1:5000';

  constructor(private http: HttpClient) {

  }


  createTeacherPersonalProfile(data: any): Observable<any> {
    console.warn(data)
    return this.http.post(`${this.serverUrl}/teacher_profile_personalinfo`, data);
  }



  getTeacherPersonalProfile(userId: string): Observable<any> {
    const endpoint = `/get_teacherprofile_personalinfo?user_id=${userId}`;
    const url = this.serverUrl + endpoint;
    const params = { userId };
    return this.http.get(url);
  }

  saveTeacherEducationalInfo(data: any): Observable<any> {
    const endpoint = `${this.serverUrl}/save_educational_info`;
    // Adjust the headers based on your API requirements
    const headers = {
      'Content-Type': 'application/json',
      // Add any other headers if needed
    };
    return this.http.post(endpoint, data, { headers });
  }

  saveTeacherWorkInfo(data: any): Observable<any> {
    const endpoint = `${this.serverUrl}/save_work_info`;
    // Adjust the headers based on your API requirements
    const headers = {
      'Content-Type': 'application/json',
      // Add any other headers if needed
    };
    return this.http.post(endpoint, data, { headers });
  }
  saveTeacherSocialInfo(data: any): Observable<any> {
    const endpoint = `${this.serverUrl}/save_social_info`;
    // Adjust the headers based on your API requirements
    const headers = {
      'Content-Type': 'application/json',
      // Add any other headers if needed
    };
    return this.http.post(endpoint, data, { headers });
  }
  saveTeacherWebsiteInfo(data: any): Observable<any> {
    const endpoint = `${this.serverUrl}/save_website_info`;
    // Adjust the headers based on your API requirements
    const headers = {
      'Content-Type': 'application/json',
      // Add any other headers if needed
    };
    return this.http.post(endpoint, data, { headers });
  }

  saveTeacherCertificateInfo(data: any): Observable<any> {
    const endpoint = `${this.serverUrl}/save_certificate_info`;
    // Adjust the headers based on your API requirements
    const headers = {
      'Content-Type': 'application/json',
      // Add any other headers if needed
    };
    return this.http.post(endpoint, data, { headers });
  }

  saveTeacherLanguageInfo(data: any): Observable<any> {
    const endpoint = `${this.serverUrl}/save_language_info`;
    // Adjust the headers based on your API requirements
    const headers = {
      'Content-Type': 'application/json',
      // Add any other headers if needed
    };
    return this.http.post(endpoint, data, { headers });
  }


  getTeacherEducationalInfo(userId: string): Observable<any> {
    const endpoint = `/get_educational_info?user_id=${userId}`;
    const url = this.serverUrl + endpoint;

    // Assume you need to send the userId as a query parameter
    const params = { userId };

    return this.http.get(url);
  }

  getTeacherWorkInfo(userId: string): Observable<any> {
    const endpoint = `/get_work_info?user_id=${userId}`;
    const url = this.serverUrl + endpoint;

    // Assume you need to send the userId as a query parameter
    const params = { userId };

    return this.http.get(url);
  }
  getTeacherSocialInfo(userId: string): Observable<any> {
    const endpoint = `/get_social_info?user_id=${userId}`;
    const url = this.serverUrl + endpoint;

    // Assume you need to send the userId as a query parameter
    const params = { userId };

    return this.http.get(url);
  }
  getTeacherWebsiteInfo(userId: string): Observable<any> {
    const endpoint = `/get_website_info?user_id=${userId}`;
    const url = this.serverUrl + endpoint;

    // Assume you need to send the userId as a query parameter
    const params = { userId };

    return this.http.get(url);
  }


  getTeacherCertificateInfo(userId: string): Observable<any> {
    const endpoint = `/get_certificate_info?user_id=${userId}`;
    const url = this.serverUrl + endpoint;

    // Assume you need to send the userId as a query parameter
    const params = { userId };

    return this.http.get(url);
  }

  getTeacherLanguageInfo(userId: string): Observable<any> {
    const endpoint = `/get_language_info?user_id=${userId}`;
    const url = this.serverUrl + endpoint;

    // Assume you need to send the userId as a query parameter
    const params = { userId };

    return this.http.get(url);
  }

  getTeacherEducationalInfoById(educationId: string): Observable<any> {
    const endpoint = `/get_educational_info_by_id?educational_id=${educationId}`;
    const url = this.serverUrl + endpoint;

    // Assume you need to send the userId as a query parameter
    const params = { educationId };

    return this.http.get(url);
  }

  getTeacherWorkInfoById(workId: string): Observable<any> {
    const endpoint = `/get_work_info_by_id?work_id=${workId}`;
    const url = this.serverUrl + endpoint;

    // Assume you need to send the userId as a query parameter
    const params = { workId };

    return this.http.get(url);
  }

  getTeacherSocialInfoById(socialId: string): Observable<any> {
    const endpoint = `/get_social_info_by_id?social_id=${socialId}`;
    const url = this.serverUrl + endpoint;

    // Assume you need to send the userId as a query parameter
    const params = { socialId };

    return this.http.get(url);
  }

  getTeacherWebsiteInfoById(websiteId: string): Observable<any> {
    const endpoint = `/get_website_info_by_id?website_id=${websiteId}`;
    const url = this.serverUrl + endpoint;

    // Assume you need to send the userId as a query parameter
    const params = { websiteId };

    return this.http.get(url);
  }

  getTeacherCertificateInfoById(certificateId: string): Observable<any> {
    console.log("yes commes in api call  3");
    const endpoint = `/get_certificate_info_by_id?certificate_id=${certificateId}`;
    const url = this.serverUrl + endpoint;

    // Assume you need to send the userId as a query parameter
    const params = { certificateId };

    return this.http.get(url);
  }

  getTeacherLanguageInfoById(languageId: string): Observable<any> {
    const endpoint = `/get_language_info_by_id?language_id=${languageId}`;
    const url = this.serverUrl + endpoint;

    // Assume you need to send the userId as a query parameter
    const params = { languageId };

    return this.http.get(url);
  }
  
  updateTeacherEducationalInfo(data: any): Observable<any> {
    const endpoint = `${this.serverUrl}/update_educational_info`;
    const headers = {
      'Content-Type': 'application/json',
    };
    return this.http.put(endpoint, data, { headers });
  }
  updateTeacherWorkInfo(data: any): Observable<any> {
    const endpoint = `${this.serverUrl}/update_work_info`;
    const headers = {
      'Content-Type': 'application/json',
    };
    return this.http.put(endpoint, data, { headers });
  }
  updateTeacherCertificateInfo(data: any): Observable<any> {
    const endpoint = `${this.serverUrl}/update_certificate_info`;
    const headers = {
      'Content-Type': 'application/json',
    };
    return this.http.put(endpoint, data, { headers });
  }

  
  deleteTeacherEducationInfo(userId: string, educationalBackgroundId: string): Observable<any> {
    const endpoint = `${this.serverUrl}/delete_educational_info`;
    const headers = {
      'Content-Type': 'application/json',
    };
    const params = new HttpParams().set('userId', userId).set('educationalBackgroundId', educationalBackgroundId.toString());
    return this.http.delete(endpoint, { headers, params });
  }

  deleteTeacherWorkInfo(userId: string, workExperienceId: string): Observable<any> {
    const endpoint = `${this.serverUrl}/delete_work_info`;
    const headers = {
      'Content-Type': 'application/json',
    };
    const params = new HttpParams().set('userId', userId).set('workExperienceId', workExperienceId.toString());
    return this.http.delete(endpoint, { headers, params });
  }
  deleteTeacherCertificateInfo(userId: string, certificateId: string): Observable<any> {
    const endpoint = `${this.serverUrl}/delete_certificate_info`;
    const headers = {
      'Content-Type': 'application/json',
    };
    const params = new HttpParams().set('userId', userId).set('certificateId', certificateId.toString());
    return this.http.delete(endpoint, { headers, params });
  }

  deleteTeacherLanguageInfo(userId: string, languageId: string): Observable<any> {
    const endpoint = `${this.serverUrl}/delete_language_info`;
    const headers = {
      'Content-Type': 'application/json',
    };
    const params = new HttpParams().set('userId', userId).set('languageId', languageId.toString());
    return this.http.delete(endpoint, { headers, params });
  }

  deleteTeacherSocialInfo(userId: string, socialId: string): Observable<any> {
    const endpoint = `${this.serverUrl}/delete_social_info`;
    const headers = {
      'Content-Type': 'application/json',
    };
    const params = new HttpParams().set('userId', userId).set('socialId', socialId.toString());
    return this.http.delete(endpoint, { headers, params });
  }

  deleteTeacherWebsiteInfo(userId: string, websiteId: string): Observable<any> {
    const endpoint = `${this.serverUrl}/delete_website_info`;
    const headers = {
      'Content-Type': 'application/json',
    };
    const params = new HttpParams().set('userId', userId).set('websiteId', websiteId.toString());
    return this.http.delete(endpoint, { headers, params });
  }
  


}
