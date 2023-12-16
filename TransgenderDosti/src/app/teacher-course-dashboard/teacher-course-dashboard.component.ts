import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-teacher-course-dashboard',
  templateUrl: './teacher-course-dashboard.component.html',
  styleUrls: ['./teacher-course-dashboard.component.css']
})
export class TeacherCourseDashboardComponent {
  constructor(private route: ActivatedRoute) {
    this.route.url.subscribe(segments => {
      console.log('Current URL Segments:', segments);
    });
  }

}
