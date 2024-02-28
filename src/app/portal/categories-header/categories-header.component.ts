import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PublicJobService } from 'src/Services/public_portal/public-job.service';
import { TokenService } from 'src/Services/token.service';


@Component({
  selector: 'app-categories-header',
  templateUrl: './categories-header.component.html',
  styleUrls: ['./categories-header.component.css']
})
export class CategoriesHeaderComponent implements OnInit {

  categories: any[] = [];
  candidate_logged = false;

  constructor(private router:Router,private jobService:PublicJobService, private Token: TokenService) { }

  ngOnInit() {
    if (localStorage.getItem("token") && localStorage.getItem("is_candidate"))
      this.candidate_logged = true;
    else
      this.candidate_logged = false;

    let filters = sessionStorage.getItem('filters');
    if (!filters) {
      this.getFilters();
    } else {
      let data = JSON.parse(filters);
      this.categories = data.categories.slice(0, 7);
    }
  }

  getFilters() {
    this.jobService.getFilters().then((response: any) => {
      let data = response.data;
      sessionStorage.setItem('filters', JSON.stringify(data));
      this.categories = data.categories.slice(0, 7);
    }, error => {
      console.log(error);
    });
  }

  searchJob(categoryName) {
    this.router.navigate(['/jobs'], { queryParams: { categories: categoryName } });
  }

}
