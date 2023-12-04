import { HttpClient } from '@angular/common/http';
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

  // createTeacherPersonalProfile(profileData: any): Observable<any> {
  //   const apiUrl = `${this.serverUrl}/teacher_profile_personalinfo`;

  //   // Assuming profileData contains the necessary information for the API
  //   // Adjust this according to your data structure
  //   const requestBody = {
  //     userid: profileData.user_id,
  //     phone_number: profileData.phonenumber,
  //     bio: profileData.bio,
  //     city_town: profileData.city,
  //     gender: profileData.gender,
  //     cnic_picture: profileData.cnic_picture,
  //     country: profileData.country,
  //     profile_picture: profileData.profile_picture,
  //   };
  //   for (let pair of (profileData as any).entries()) {
  //     console.log(pair[0] + ': ' + pair[1]);
  //   }

  //   return this.http.post(apiUrl, requestBody);
  // }

  createTeacherPersonalProfile(data: any): Observable<any> {
    console.warn(data)
    return this.http.post(`${this.serverUrl}/teacher_profile_personalinfo`, data);
  }

   getBlobFromImagePath(imagePath: string): Blob {
    const [contentType, base64Data] = imagePath.split(',');

    const binaryData = atob(base64Data);

    const arrayBuffer = new ArrayBuffer(binaryData.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < binaryData.length; i++) {
      uint8Array[i] = binaryData.charCodeAt(i);
    }

    return new Blob([arrayBuffer], { type: contentType });
  }


}
