import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-search-bar',
  templateUrl: './top-search-bar.component.html',
  styleUrls: ['./top-search-bar.component.css']
})
export class TopSearchBarComponent implements OnInit {

  constructor(private router: Router) { }

  filters = {
    what : '',
    where : '',
    categories : 'AllCategories'
  };

  all_categories = [];
  placeholder="Choose Location"; 

  ngOnInit() {
    let categories = sessionStorage.getItem('categories');
    this.all_categories = categories ? JSON.parse(sessionStorage.getItem('categories')) : [];
  }

  search(){
    this.router.navigate(['/jobs'],{queryParams:this.filters });
  }

  getAddress(place: object) {
		this.filters.where = place['formatted_address'];		
  }

}
