import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-education-homepage',
  templateUrl: './education-homepage.component.html',
  styleUrls: ['./education-homepage.component.css']
})
export class EducationHomepageComponent {
  isLargeScreen = true;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.updateScreenSize();
  }


  constructor() {
    this.updateScreenSize();
    console.log(this.isLargeScreen)
  }

  private updateScreenSize() {
    this.isLargeScreen = window.innerWidth >= 992; // Adjust breakpoint as needed
  }

}
