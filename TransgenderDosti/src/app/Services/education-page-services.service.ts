import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class EducationPageServicesService {
  private serverUrl = 'http://127.0.0.1:5000';

  constructor(private http: HttpClient) {

  }

    // Example method to get all courses
    getAllCourses(): Observable<any> {
      const url = `${this.serverUrl}/courses`;
      return this.http.get(url);
    }

    getCourseDetails(courseId: string): Observable<any> {
      const url = `${this.serverUrl}/get_speccourses_detail_byId?course_id=${courseId}`;
      return this.http.get(url);
    }
}
