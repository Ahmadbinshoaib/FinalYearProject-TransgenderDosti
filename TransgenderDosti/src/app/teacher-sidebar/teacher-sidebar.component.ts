import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, Event as NavigationEvent } from '@angular/router';
import { filter, take } from 'rxjs/operators';

@Component({
  selector: 'app-teacher-sidebar',
  templateUrl: './teacher-sidebar.component.html',
  styleUrls: ['./teacher-sidebar.component.css']
})
export class TeacherSidebarComponent implements OnInit {
  isMenuOpen = true;
  opened = true;
  contentMargin = 195;
  selectedRoute = '';
  isChevronDown = false;
  urll: any
  finalUrl: any
  courseId: any

  toggleChevron() {
    this.isChevronDown = !this.isChevronDown;
  }

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.urll = this.route.snapshot
    this.finalUrl = this.urll._routerState.url
    const parts = this.finalUrl.split('/');
    this.courseId = parts[parts.length - 1];
    console.warn(this.courseId)
    // Navigate to teacher-course-dashboard initially
    // this.router.navigate(['/teacher-course-details/teacher-course-dashboard']);

    // Subscribe to route changes
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEvent) => {
      const navigationEnd = event as NavigationEnd;
      this.selectedRoute = navigationEnd.urlAfterRedirects;
      console.log('Updated Route:', this.selectedRoute);
    });
  }

  onToolbarMenuToggle() {
    this.isMenuOpen = !this.isMenuOpen;

    if (!this.isMenuOpen) {
      this.contentMargin = 26;
    } else {
      this.contentMargin = 195;
    }
  }

  teacherLogout() {
    localStorage.removeItem('teacher');
    this.router.navigate(['/'])
  }
}
