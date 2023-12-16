import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-teacher-sidebar',
  templateUrl: './teacher-sidebar.component.html',
  styleUrls: ['./teacher-sidebar.component.css']
})
export class TeacherSidebarComponent {
  isMenuOpen = true;
  opened = true;
  contentMargin = 195

  constructor(private route: ActivatedRoute) {
    this.route.url.subscribe(segments => {
      console.log('Current URL Segments:', segments);
    });
  }

  onToolbarMenuToggle() {
    this.isMenuOpen = !this.isMenuOpen;
    console.warn(this.isMenuOpen)

    if (!this.isMenuOpen) {
      this.contentMargin = 70
    }
    else {
      this.contentMargin = 195
    }

  }

}
