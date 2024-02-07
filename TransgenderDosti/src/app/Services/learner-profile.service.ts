import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { SignInResponse, signIn, userTeacher } from '../datatypes';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { NavigationEnd } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LearnerProfileService {

  private serverUrl = 'http://127.0.0.1:5000';

  constructor(private http: HttpClient) {

  }


  createLearnerPersonalProfile(data: any): Observable<any> {
    console.warn(data)
    return this.http.post(`${this.serverUrl}/learner_profile_personalinfo`, data);
  }



  getLearnerPersonalProfile(userId: string): Observable<any> {
    const endpoint = `/get_learnerprofile_personalinfo?user_id=${userId}`;
    const url = this.serverUrl + endpoint;
    const params = { userId };
    return this.http.get(url);
  }

  saveLearnerSocialInfo(data: any): Observable<any> {
    const endpoint = `${this.serverUrl}/save_socialLearner_info`;
    // Adjust the headers based on your API requirements
    const headers = {
      'Content-Type': 'application/json',
      // Add any other headers if needed
    };
    return this.http.post(endpoint, data, { headers });
  }
  saveLearnerWebsiteInfo(data: any): Observable<any> {
    const endpoint = `${this.serverUrl}/save_websiteLearner_info`;
    // Adjust the headers based on your API requirements
    const headers = {
      'Content-Type': 'application/json',
      // Add any other headers if needed
    };
    return this.http.post(endpoint, data, { headers });
  }

  getLearnerSocialInfo(userId: string): Observable<any> {
    const endpoint = `/get_socialLearner_info?user_id=${userId}`;
    const url = this.serverUrl + endpoint;

    // Assume you need to send the userId as a query parameter
    const params = { userId };

    return this.http.get(url);
  }
  getLearnerWebsiteInfo(userId: string): Observable<any> {
    const endpoint = `/get_websiteLearner_info?user_id=${userId}`;
    const url = this.serverUrl + endpoint;

    // Assume you need to send the userId as a query parameter
    const params = { userId };

    return this.http.get(url);
  }

  getLearnerSocialInfoById(socialId: string): Observable<any> {
    const endpoint = `/get_socialLearner_info_by_id?social_id=${socialId}`;
    const url = this.serverUrl + endpoint;

    // Assume you need to send the userId as a query parameter
    const params = { socialId };

    return this.http.get(url);
  }

  getLearnerWebsiteInfoById(websiteId: string): Observable<any> {
    const endpoint = `/get_websiteLearner_info_by_id?website_id=${websiteId}`;
    const url = this.serverUrl + endpoint;

    // Assume you need to send the userId as a query parameter
    const params = { websiteId };

    return this.http.get(url);
  }

  deleteLearnerSocialInfo(userId: string, socialId: string): Observable<any> {
    const endpoint = `${this.serverUrl}/delete_socialLearner_info`;
    const headers = {
      'Content-Type': 'application/json',
    };
    const params = new HttpParams().set('userId', userId).set('socialId', socialId.toString());
    return this.http.delete(endpoint, { headers, params });
  }

  deleteLearnerWebsiteInfo(userId: string, websiteId: string): Observable<any> {
    const endpoint = `${this.serverUrl}/delete_websiteLearner_info`;
    const headers = {
      'Content-Type': 'application/json',
    };
    const params = new HttpParams().set('userId', userId).set('websiteId', websiteId.toString());
    return this.http.delete(endpoint, { headers, params });
  }
}
