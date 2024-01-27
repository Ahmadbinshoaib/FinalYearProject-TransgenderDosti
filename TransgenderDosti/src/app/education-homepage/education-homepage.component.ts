import { Component, HostListener } from '@angular/core';
import { EducationPageServicesService } from '../Services/education-page-services.service';
import { FormsModule } from '@angular/forms';

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

  sortOptions = [
    { value: '1', label: 'Newest' },
    { value: '2', label: 'Price: Low to High' },
    { value: '3', label: 'Price: High to Low' }
  ];

  selectedSortOption: { value: string, label: string } = { value: '1', label: 'Newest' };

  filteredCourses: any[] = []; // Array to store filtered courses
  selectedCourseFor: string | null = null;
  // Inside your component class
  searchTerm: string = '';





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
        this.sortCourses();
        this.selectedSortOption = this.sortOptions.find(option => option.value === '1')!;
      },
      (error) => {
        console.error(error);
        // Handle error here
      }
    );


  }

  // calculateTotalPages() {
  //   this.totalPages = Math.ceil(this.courses.length / this.pageSize);
  // }

  calculateTotalPages() {
    const filteredCourses = this.selectedCourseFor
      ? this.courses.filter(course => course.course_for === this.selectedCourseFor)
      : this.courses;

    this.totalPages = Math.ceil(filteredCourses.length / this.pageSize);
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

  // getDisplayedCourses(): any[] {
  //   const startIndex = (this.currentPage - 1) * this.pageSize;
  //   const endIndex = startIndex + this.pageSize;
  //   return this.courses.slice(startIndex, endIndex);
  // }

  // getDisplayedCourses(): any[] {
  //   const filteredCourses = this.selectedCourseFor
  //     ? this.courses.filter(course => course.course_for === this.selectedCourseFor)
  //     : this.courses;

  //   const startIndex = (this.currentPage - 1) * this.pageSize;
  //   const endIndex = startIndex + this.pageSize;
  //   return filteredCourses.slice(startIndex, endIndex);
  // }
  getDisplayedCourses(): any[] {
    const isDefaultDisplay = !this.selectedCourseFor && !this.searchTerm;
  
    if (isDefaultDisplay) {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return this.courses.slice(startIndex, endIndex);
    }
  
    const courseForFilter = this.selectedCourseFor;
    const filteredCourses = courseForFilter
      ? this.courses.filter(course => course.course_for === courseForFilter)
      : this.courses;
  
    const searchTerm = this.searchTerm.toLowerCase();
    const searchedCourses = searchTerm
      ? filteredCourses.filter(course =>
          course.title.toLowerCase().includes(searchTerm) ||
          course.teacher.full_name.toLowerCase().includes(searchTerm) ||
          course.details.toLowerCase().includes(searchTerm)
        )
      : filteredCourses;
  
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return searchedCourses.slice(startIndex, endIndex);
  }
  
  
  

  // getDisplayedCourses(): any[] {
  //   const startIndex = (this.currentPage - 1) * this.pageSize;
  //   const endIndex = startIndex + this.pageSize;
  //   return this.filteredCourses.slice(startIndex, endIndex);
  // }
  



  sortCourses() {
    switch (this.selectedSortOption.value) {
      case '1':
        // Newest (default order)
        break;
      case '2':
        // Price: Low to High
        this.courses.sort((a, b) => a.course_fee.split(' ')[1] - b.course_fee.split(' ')[1]);
        break;
      case '3':
        // Price: High to Low
        this.courses.sort((a, b) => b.course_fee.split(' ')[1] - a.course_fee.split(' ')[1]);
        break;
      default:
        // Default case (Newest)
        break;
    }
  }

  setSortOption(event: any) {
    const optionValue: string = event.target.value;
    const option = this.sortOptions.find(opt => opt.value === optionValue);
    if (option) {
      this.selectedSortOption = option;
      this.sortCourses();
      this.setPage(1); // Reset to the first page after sorting
    }
  }
  filterByCourseFor(courseFor: string) {
    this.selectedCourseFor = courseFor;
    this.calculateTotalPages();
    this.setPage(1); // Reset to the first page after filtering
  }



  // Inside your component class
  getUniqueCourseForValues(): string[] {
    const uniqueCourseForValues: string[] = [];

    this.courses.forEach(course => {
      if (!uniqueCourseForValues.includes(course.course_for)) {
        uniqueCourseForValues.push(course.course_for);
      }
    });

    return uniqueCourseForValues;
  }

  // Inside your component class
  updateSearchResults() {
    // You can use this.searchTerm to filter your courses
    this.filterCourses();
  }

  // Inside your component class
filterCourses() {
  const searchTerm = this.searchTerm.toLowerCase();
  console.warn(searchTerm)

  // Filter courses based on the search term
  this.filteredCourses = this.courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm) ||
    course.teacher.full_name.toLowerCase().includes(searchTerm) ||
    course.details.toLowerCase().includes(searchTerm)
    // Add more fields as needed
  );

  // Recalculate total pages and update displayed courses
  this.calculateTotalPages();
  this.setPage(1); // Reset to the first page after filtering
}







}
