import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { JobService } from 'src/Services/vendor/job.service';

@Component({
  selector: 'app-submissions',
  templateUrl: './submissions.component.html',
  styleUrls: ['./submissions.component.css']
})
export class SubmissionsComponent implements OnInit {

  constructor(
    private http: HttpClient, 
    private router: Router,
    private _JobService: JobService,
  ) { }

  private submissionsUrl = environment.baseApiUrl+"/vendor/submissions";
  public submissions = [];
  public isList : boolean = false;
  public isGrid : boolean = true;
  showType : String = 'recent';
  isLoading = false;
  search_keyword = '';

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

  recent(){
    this.isLoading = true;
    this.showType = 'recent';
    return this.http.get(this.submissionsUrl+"/recent", this.httpOptions).subscribe(
      data => this.handleSuccess(data),
      error => this.handleError(error)
    );
  }

  all(){
    this.isLoading = true;
    this.showType = 'all';
    return this.http.get(this.submissionsUrl, this.httpOptions).subscribe(
      data => this.handleSuccess(data),
      error => this.handleError(error)
    );
  }

  rejected(){
    this.isLoading = true;
    this.showType = 'rejected';
    return this.http.get(this.submissionsUrl+"/rejected", this.httpOptions).subscribe(
      data => this.handleSuccess(data),
      error => this.handleError(error)
    );
  }

  handleSuccess(data){
    this.submissions = data.data.submissions.data;
    //console.log(this.submissions); 
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

  searchSubmissions(event: any){
    
  }

}
