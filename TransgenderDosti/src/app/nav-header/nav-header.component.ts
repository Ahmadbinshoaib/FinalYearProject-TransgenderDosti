import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-nav-header',
  templateUrl: './nav-header.component.html',
  styleUrls: ['./nav-header.component.css']
})
export class NavHeaderComponent {
  menuType: String = 'default'

  constructor(private router: Router) {

  }

  ngOnInit() {

    this.router.events.subscribe((val: any) => {
      if (val.url) {
        if (localStorage.getItem('teacher') && val.url.includes('teacher')) {
          console.warn('in tecaher area')
          this.menuType = 'teacher'
        }
        else if (localStorage.getItem('learner') && val.url.includes('learner')) {
          console.warn('in learner area')
          this.menuType = 'learner'
        }
        else {
          console.warn('outside teacher')
          this.menuType = 'default'

        }
      }

    })

  }

  teacherLogout() {
    localStorage.removeItem('teacher');
    this.router.navigate(['/'])
  }

  learnerLogout() {
    localStorage.removeItem('learner');
    this.router.navigate(['/'])
  }

}
