import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-nav-header',
  templateUrl: './nav-header.component.html',
  styleUrls: ['./nav-header.component.css']
})
export class NavHeaderComponent {
  menuType: String = 'default';
  teacherEmail: String = '';
  learnerEmail: String = '';
  profilePictureUrl: string = ''

  constructor(private router: Router) {

  }

  ngOnInit() {

    this.router.events.subscribe((val: any) => {
      if (val.url) {
        if (localStorage.getItem('teacher') && val.url.includes('teacher')) {
          console.warn('in tecaher area')
          this.menuType = 'teacher'

          if (localStorage.getItem('teacher')) {
            const teacherStore = localStorage.getItem('teacher');

            try {
              const teacherData = JSON.parse(teacherStore!);

              if (teacherData && teacherData.email) {
                console.log(teacherData.email);
                this.teacherEmail = teacherData.email.split('@')[0];
                if (teacherData.profile_picture) {


                  this.profilePictureUrl = teacherData.profile_picture
                }

              } else {
                console.error('Invalid teacher data format or missing email property');
              }
            } catch (error) {
              console.error('Error parsing teacher data:', error);
            }
          }



        }
        else if (localStorage.getItem('learner') && val.url.includes('learner')) {
          console.warn('in learner area')
          this.menuType = 'learner'

          if (localStorage.getItem('learner')) {
            const learnerStore = localStorage.getItem('learner');

            try {
              const learnerData = JSON.parse(learnerStore!);

              if (learnerData && learnerData.email) {
                console.log(learnerData.email);
                this.learnerEmail = learnerData.email.split('@')[0];
                if (learnerData.profile_picture) {


                  this.profilePictureUrl = learnerData.profile_picture
                }
              } else {
                console.error('Invalid learner data format or missing email property');
              }
            } catch (error) {
              console.error('Error parsing teacher data:', error);
            }
          }
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
