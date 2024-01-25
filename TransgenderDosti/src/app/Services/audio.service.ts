// audio.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private apiUrl = 'http://localhost:5000';  // Update with your Flask API URL

  constructor(private http: HttpClient) {}

  uploadAudio(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('audio', file, 'recorded.wav'); // 'recorded.wav' is the file name

    return this.http.post(`${this.apiUrl}/transcribe`, formData);
  }
}
