import { Component, HostListener } from '@angular/core';
import { EducationPageServicesService } from '../Services/education-page-services.service';

@Component({
  selector: 'app-education-homepage',
  templateUrl: './education-homepage.component.html',
  styleUrls: ['./education-homepage.component.css']
})
export class EducationHomepageComponent {
  courses: any[] = [];
  pageSize = 9; // Number of courses to show per page
  currentPage = 1; // Current page number
  totalPages!: number;
  isLargeScreen = true;
  pagesToShow = 4;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.updateScreenSize();
  }

  constructor(private educationService: EducationPageServicesService) {
    this.updateScreenSize();
    console.log(this.isLargeScreen);
  }

  private updateScreenSize() {
    this.isLargeScreen = window.innerWidth >= 992; // Adjust breakpoint as needed
  }

  ngOnInit(): void {
    this.educationService.getAllCourses().subscribe(
      (response) => {
        console.log(response);

        this.courses = response.courses; // Assuming the API response has a 'courses' property
        this.calculateTotalPages();
      },
      (error) => {
        console.error(error);
        // Handle error here
      }
    );
  }

  calculateTotalPages() {
    this.totalPages = Math.ceil(this.courses.length / this.pageSize);
  }

  setPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getPageNumbers(): number[] {
    const totalPages = this.totalPages;
    const currentPage = this.currentPage;
    const pagesToShow = this.pagesToShow;
    const pages: number[] = [];

    if (totalPages <= pagesToShow) {
      // If total pages are less than or equal to the specified pagesToShow, show all pages.
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // If total pages are more than the specified pagesToShow, show ellipsis and selected pages.
      const halfToShow = Math.floor(pagesToShow / 2);
      const startPage = Math.max(1, currentPage - halfToShow);
      const endPage = Math.min(totalPages, currentPage + halfToShow);

      if (startPage > 1) {
        pages.push(1, -1); // Display ellipsis before the first page if not already shown.
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages) {
        pages.push(-1, totalPages); // Display ellipsis after the last page if not already shown.
      }
    }

    return pages;
  }

  getDisplayedCourses(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.courses.slice(startIndex, endIndex);
  }
}
