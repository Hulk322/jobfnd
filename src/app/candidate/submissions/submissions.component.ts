import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ErrorService } from 'src/Services/shared/error.service';

@Component({
  selector: 'app-submissions',
  templateUrl: './submissions.component.html',
  styleUrls: ['./submissions.component.css']
})
export class SubmissionsComponent implements OnInit {

  public isList : boolean = true;
  public isGrid : boolean = false;
  showType : String = 'recent';
  search_keyword = '';
  isLoading = false;

  pageObj ={
    page : 1,
    pageSize: 10,
    totalElements : 0
  };

  constructor(
    private http: HttpClient,
    private _ErrorService: ErrorService
  ) { }

  private submissionsUrl = environment.baseApiUrl+"/candidate/submissions";
  public submissions = [];


  private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
  private httpOptions = {
    headers: this.headers_object
  };

  

  ngOnInit() {
    this.all();
  }

  pageChange(selectedPage){
    this.pageObj.page = selectedPage;
    this.all();
  }

  recent(){
    this.showType = 'recent';
    return this.http.get(this.submissionsUrl+"/recent"+"?search="+this.search_keyword, this.httpOptions).subscribe(
      data => this.handleSuccess(data),
      error => this.handleError(error)
    );
  }

  all(){
    this.isLoading = true;
    this.showType = 'all';
    return this.http.get(this.submissionsUrl+"?page="+this.pageObj.page+"&search="+this.search_keyword, this.httpOptions).subscribe(
      data => this.handleSuccess(data),
      error => this.handleError(error)
    );
  }

  rejected(){
    this.showType = 'rejected';
    return this.http.get(this.submissionsUrl+"/rejected"+"?search="+this.search_keyword, this.httpOptions).subscribe(
      data => this.handleSuccess(data),
      error => this.handleError(error)
    );
  }

  searchSubmissions(event: any){
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

  handleSuccess(data){
    this.submissions = data.data.submissions.data;
    this.pageObj.pageSize = data.data.submissions.per_page;
    this.pageObj.totalElements = data.data.submissions.total;
    this.isLoading = false;
  }

  handleError(error){
    this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
    this.isLoading = false;
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
