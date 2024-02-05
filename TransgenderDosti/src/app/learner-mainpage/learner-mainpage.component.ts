import { Component } from '@angular/core';

@Component({
  selector: 'app-learner-mainpage',
  templateUrl: './learner-mainpage.component.html',
  styleUrls: ['./learner-mainpage.component.css']
})
export class LearnerMainpageComponent {

  learnerEmail: any
  activeTab: string = 'ex1-tabs-1';


  changeTab(tabId: string) {
    this.activeTab = tabId;
  }

  ngOnInit() {

  if (localStorage.getItem('learner')) {
    const learnerStore = localStorage.getItem('learner');

    try {
      const learnerData = JSON.parse(learnerStore!);

      if (learnerData && learnerData.name) {
        console.log(learnerData.name);
        this.learnerEmail = learnerData.name;
      } else {
        console.error('Invalid learner data format or missing email property');
      }
    } catch (error) {
      console.error('Error learner teacher data:', error);
    }
  }
   }

}
