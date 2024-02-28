import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ClientJobService } from 'src/Services/client/job.service';

@Component({
  selector: 'app-submissions',
  templateUrl: './submissions.component.html',
  styleUrls: ['./submissions.component.css']
})
export class SubmissionsComponent implements OnInit {

  public isList : boolean = false;
  public isGrid : boolean = true;
  showType : String = 'recent';
  search_keyword = '';
  isLoading = false;
  view_type = "grid";
  pageObj ={
    page : 1,
    pageSize: 10,
    totalElements : 0
  };

  constructor(
    private http: HttpClient, 
    private router: Router,
    private _JobService: ClientJobService,
  ) { }

  private submissionsUrl = environment.baseApiUrl+"/client/submissions";
  public submissions = [];


  private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
  private httpOptions = {
    headers: this.headers_object
  };

  deleteSubmission(id, submission){
    var answer = confirm('Are you sure you want to delete this submission?');
    if(answer){
      submission.deleted = true;
      for(let i = 0; i < this.submissions.length; ++i){
        if (this.submissions[i].id === id) {
          this._JobService.deleteSubmission(id)
        .subscribe( 
          data => this.submissions.splice(i, 1),
          err => console.log(err)
        );
            
        }
      }
    }
  }

  ngOnInit() {
    
    this.recent();
  }

  pageChange(selectedPage){
    window.scroll(0,0);
    this.pageObj.page = selectedPage;
    if(this.showType=='recent') {
      if(this.search_keyword!='')
        this.searchSubmissions('recent');
      else
        this.recent();
    }else if(this.showType=='all'){
      if(this.search_keyword!='')
        this.searchSubmissions('all');
      else
        this.all();
    }else if(this.showType=='rejected'){
      if(this.search_keyword!='')
        this.searchSubmissions('rejected');
      else
        this.rejected();
    }
  }

  recent(){
    this.isLoading = true;
    this.showType = 'recent';
    return this.http.get(this.submissionsUrl+"/recent"+"?search="+
                          this.search_keyword+"&page="
                          +this.pageObj.page, this.httpOptions).subscribe(
      data => this.handleSuccess(data),
      error => this.handleError(error)
    );
  }

  favorite(){
    this.isLoading = true;
    this.showType = 'favorite';
    return this.http.get(this.submissionsUrl+"/favourites"+"?search="+
                          this.search_keyword+"&page="
                          +this.pageObj.page, this.httpOptions).subscribe(
      data => this.handleSuccess(data),
      error => this.handleError(error)
    );
  }

  all(){
    this.isLoading = true;
    this.showType = 'all';
    return this.http.get(this.submissionsUrl+"?search="+
                          this.search_keyword+"&page="+this.search_keyword, this.httpOptions).subscribe(
      data => this.handleSuccess(data),
      error => this.handleError(error)
    );
  }

  rejected(){
    this.isLoading = true;
    this.showType = 'rejected';
    return this.http.get(this.submissionsUrl+"/rejected"+"?search="+
                        this.search_keyword+"&page="+this.search_keyword, this.httpOptions).subscribe(
      data => this.handleSuccess(data),
      error => this.handleError(error)
    );
  }

  searchSubmissions(event: any){
    this.isLoading = true;
    var url = this.submissionsUrl+"?search="+this.search_keyword;
    if(this.showType == 'all')
      url = this.submissionsUrl+"?search="+this.search_keyword;
    else if(this.showType=="recent")
      url = this.submissionsUrl+"/recent?search="+this.search_keyword;
    else if(this.showType=='rejected')
      url = this.submissionsUrl+"/rejected?search="+this.search_keyword;

    return this.http.get(url, this.httpOptions).subscribe(
      data => this.handleSuccess(data),
      error => this.handleError(error)
    );
  }

  locations: [];
  handleSuccess(data){
    this.submissions = data.data.submissions.data;
    this.pageObj.pageSize = data.data.submissions.per_page;
    this.pageObj.totalElements = data.data.submissions.total;

    if(this.showType == 'recent')
      this.locations = data.data.locations;

    this.isLoading = false;
  }

  handleError(error){
    console.log(error);
    //this.router.navigateByUrl('/login');
  }

  showInList(){
    this.isList = true;
    this.isGrid = false;
  }

  showInGrid(){
    this.isList = false;
    this.isGrid = true;
  }

}
