import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-talent-pool',
  templateUrl: './talent-pool.component.html',
  styleUrls: ['./talent-pool.component.css']
})
export class TalentPoolComponent implements OnInit {


  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  private talentPoolUrl = environment.baseApiUrl + "/vendor/talent/pool";
  public submissions : any[] = [];

  filters = {
    search:null,
    titles: null,
    sort : null
  };
  titles = ["Web Developer","Software Engineer","Graphic Designer"];
  selectedTitle = null;

  private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
  private httpOptions = {
    headers: this.headers_object
  };

  ngOnInit() {
    this.getCandidates();
  }

  getCandidates(){
    this.http.get(this.talentPoolUrl, this.httpOptions).subscribe(
      data => this.handleSuccess(data),
      error => this.handleError(error)
    );
  }
  handleSuccess(data) {
    this.submissions = data.data.candidatePool;
    this.submissions.map((obj)=>{
      obj.defaultResume = {};
      if(obj.resumes.length>0) {
        obj.defaultResume = obj.resumes[0];
        for (let i = 0; i < obj.resumes.length; i++) {
          if(obj.resumes[i].is_default==1) {
            obj.defaultResume = obj.resumes[i];
            break;
          }
        }
      }
    });
    console.log(data);
  }

  createDownloadResumeUrl(url){
    let requestURL = environment.baseApiUrlClient.replace('/v1','')+"/public-file/"+url;
    return requestURL;
  }
  handleError(error) {
    console.log(error);
  }

  search(){
    let searchedFields = this.filters.search ? "search="+this.filters.search : "";
    
    if(searchedFields=="") {
      searchedFields += this.filters.sort ? "sort="+this.filters.sort : "";
    }else{
      searchedFields += this.filters.sort ? "&sort="+this.filters.sort : "";
    }
    if(searchedFields=="") {
      searchedFields += this.selectedTitle ? "title[0]="+this.selectedTitle : "";
    }else{
      searchedFields += this.selectedTitle ? "&title[0]="+this.selectedTitle : "";
    }

    if(searchedFields!="") {
      this.http.get(`${this.talentPoolUrl}?${searchedFields}`, this.httpOptions).subscribe(
        data => this.handleSuccess(data),
        error => this.handleError(error)
      );
    }else{
      this.getCandidates();
    }
  }
}
