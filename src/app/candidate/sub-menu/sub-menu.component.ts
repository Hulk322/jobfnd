import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sub-menu',
  templateUrl: './sub-menu.component.html',
  styleUrls: ['./sub-menu.component.css']
})
export class SubMenuComponent implements OnInit {

  @Input() current_menu_item: string = "";
  filters = {
    what : '',
    where : '',
    categories : 'AllCategories'
  };
  setup_password=localStorage.getItem('setup_password');
  email=localStorage.getItem('email');

  routeSub : any;
  profileStats = {
    accepted : 0,
    applied : 0,
    contracts : 0,
    interviews : 0,
    invites : 0,
    offers : 0,
    saved : 0
  };; 

  private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
  private httpOptions = {
     headers: this.headers_object
  };

  statsUrl = environment.baseApiUrl + "/candidate/profile/stats";

  constructor(private router: Router,private route: ActivatedRoute ,  private http: HttpClient,) { }

  ngOnInit() {
    this.routeSub = this.route
      .queryParams
      .subscribe(params => {
        if(Object.keys(params).length != 0 && params.constructor === Object) {
          // this.isFiltersCleared = true;
          this.filters.what = '';
          this.filters.where = '';
          this.filters.categories = '';
          
          for (let key in params) {
            this.filters[key] = params[key];
          }
         
        }
     });

    return this.http.get(this.statsUrl, this.httpOptions).subscribe(
      data => this.handleSuccess(data),
      error => this.handleError(error)
    );

  }

  search(){
    this.router.navigate(['/candidate/dashboard'],{queryParams:this.filters });
    console.log(this.router.url);
  }

  handleSuccess(data) {
    this.profileStats = data.data.profileStats; 
    sessionStorage.setItem('profileStats', JSON.stringify(this.profileStats));
    //console.log(this.profileStats);
  }

  handleError(error) {
    console.log(error);
  }

}
