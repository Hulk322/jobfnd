import { Component, OnInit } from '@angular/core';
import { InterviewsService } from 'src/Services/admin/interviews.service';
import { ErrorService } from 'src/Services/shared/error.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-interviews',
  templateUrl: './interviews.component.html',
  styleUrls: ['./interviews.component.css']
})
export class InterviewsComponent implements OnInit {

  isLoading = false;
  interviews= [];

  pageObj ={
    page : 1,
    pageSize: 15,
    totalElements : 0
  };
  search_keyword = '';
  id;
  sub;
  type;

  interviewUrl =  environment.baseApiUrlClient+"/admin/interviews/clients";

  private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
    private httpOptions = {
      headers: this.headers_object
    };
  constructor(
  			private _interviewService: InterviewsService,
  			private _ErrorService: ErrorService,
        private route: ActivatedRoute,
        private http: HttpClient,
        private router: Router,

  			) { }

  ngOnInit() {
      this.isLoading = true;


      this.sub    = this.route.params.subscribe(params => {
      this.id = params['id']; // (+) converts string 'id' to a number
      this.sub    = this.route.queryParams.subscribe(params => {
      this.type   = params['type'];

      if(this.type === 'job_interviews') {
        return this._interviewService.interviewsByJobId(this.id).subscribe(
          data  => this.handleSuccess(data),
          error => this.handleError(error)
        );
      }else if(this.type === 'client_interviews'){
        return this._interviewService.interviewsByClientId(this.id).subscribe(
          data  => this.handleSuccess(data),
          error => this.handleError(error)
        );
      }else if(this.type === 'submission_interviews'){
        return this._interviewService.interviewsBySubmissionId(this.id).subscribe(
          data  => this.handleSuccess(data),
          error => this.handleError(error)
          );
      }else{
        return '';
      }
    });
  });
  	this.getInterviews();
  }

  getInterviews() {
  	this.isLoading = true;
      if((this.type !== 'job_interviews' && this.type !== 'client_interviews') && this.type !== 'submission_interviews'){
          this._interviewService.get(this.pageObj.page, this.search_keyword).subscribe(
            data    => this.handleSuccess(data),
            error   => this.handleError(error),
          );
      }
	}

	handleSuccess(data) {
	  this.interviews            = data.data.interviews.data;
    this.pageObj.pageSize      = data.data.interviews.per_page;
    this.pageObj.totalElements = data.data.interviews.total;
	  this.isLoading  = false;
	}

	handleError(error) {
	  this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
	  this.isLoading = false;
	}

  pageChange(selectedPage){
    this.pageObj.page = selectedPage;
    this.getInterviews();
  }

  deleteInterview(id, interview) {
      var answer = confirm('Are you sure you want to delete this Interview?');
        if (answer) {
        this.isLoading = true;
        interview.deleted = true;
        for (let i = 0; i < this.interviews.length; ++i) {
          if (this.interviews[i].id === id) {
            this._interviewService.delete(id)
              .subscribe(
                data => this.handleDeleteSuccess(data, i),
                error => this.handleError(error)
              );
          }
        }
      }
  }
   handleDeleteSuccess(data, i) {
    this.interviews.splice(i, 1);
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
    this.isLoading = false;
  }
  viewInterviewDetail(id) {
    this.router.navigate(['admin/interviews/'+id]);
  }
}
