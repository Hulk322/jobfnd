import { Component, OnInit } from '@angular/core';
import { InterviewService } from 'src/Services/candidate/interview.service';
import { ErrorService } from 'src/Services/shared/error.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-list-interviews',
  templateUrl: './list-interviews.component.html',
  styleUrls: ['./list-interviews.component.css']
})
export class ListInterviewsComponent implements OnInit {

  interviews = [];
  isLoading = false;
  search_keyword = "";
  limit = "";
  sort_by = "";
  status = "";
  pageObj ={
    page : 1,
    pageSize: 10,
    totalElements : 0
  };

  current_interview = {
    id: null,
    title: '',
    type: '',
    dates: [],
    date:null, 
    interview_datetime: null,
    recommended_datetime_in: null,
    reason: '',
    current_status:'New'
  };
    profileStats = {
    accepted : 0,
    applied : 0,
    contracts : 0,
    interviews : 0,
    invites : 0,
    offers : 0,
    saved : 0
  };

  view_type = 'list';

  interviewsUrl = environment.baseApiUrlClient + "/candidate/interviews/";
  statsUrl = environment.baseApiUrl + "/candidate/profile/stats";

  private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
  private httpOptions = {
    headers: this.headers_object
  };


  constructor(private _interview: InterviewService,
    private http: HttpClient,
    private _ErrorService: ErrorService) { }

    ngOnInit() {
      
      this.getAllInterviews();

      return this.http.get(this.statsUrl).subscribe(
      data => this.handleSuccessStats(data),
      error => this.handleError(error)
    );
    }

    getAllInterviews(){
      this.isLoading = true;
      this._interview.getAllInterviews(this.pageObj.page).subscribe(
        data => this.handleSuccess(data),
        error => this.handleError(error)
      );
    }

    handleSuccess(data) {
      this.interviews = data.data.interviews.data;
      this.pageObj.pageSize = data.data.interviews.per_page;
      this.pageObj.totalElements = data.data.interviews.total;
      this.isLoading = false;
    }

    pageChange(selectedPage){
      this.pageObj.page = selectedPage;
      this.getAllInterviews();
    }
  
  
    handleError(error) {
      this._ErrorService.flashMessage({ 'type': 'success', 'messages': error.msg });
      this.isLoading = false;
    }

    acceptInterview() {
      this.isLoading = true;
      return this.http.post(this.interviewsUrl + this.current_interview.id + "/status", { status: 'Accept', interview_datetime: this.current_interview.interview_datetime, reason: this.current_interview.reason }, this.httpOptions).subscribe(
        data => this.handleAcceptSuccess(data),
        error => this.handleAcceptError(error)
      );
    }
  
    handleAcceptSuccess(data) {
      var interview = this.interviews.find(x => x.id === this.current_interview.id);
      //console.log(interview);
      interview.current_status = 'Accept';
      this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
      this.isLoading = false;
    }
  
    handleAcceptError(error) {
      this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
      this.isLoading = false;
    }
  
    rejectInterview() {
      this.isLoading = true;
      return this.http.post(this.interviewsUrl + this.current_interview.id + "/status", { status: 'Reject', interview_datetime: this.current_interview.interview_datetime, reason: this.current_interview.reason }, this.httpOptions).subscribe(
        data => this.handleRejectSuccess(data),
        error => this.handleRejectError(error)
      );
    }
  
    handleRejectSuccess(data) {
      var interview = this.interviews.find(x => x.id === this.current_interview.id);
      interview.current_status = 'Reject';
      this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
      this.isLoading = false;
    }
  
    handleRejectError(error) {
      console.log(error);
      this.isLoading = false;
    }

    handleChange(evt) {
      console.log(evt.target);
      //if (evt.target.value == 1)
        this.current_interview.interview_datetime = evt.target.value;
      //else
        //this.interview.interview_datetime = this.interview.other_datetime_in;
    }

    initInterviewDates(interview){
      this.current_interview = interview;
      //this.current_interview.current_status = status;
      //interview.status = status;
      this.current_interview.interview_datetime = interview.dates[0].id;
    }
    handleSuccessStats(data) {
    this.profileStats = data.data.profileStats; 
    sessionStorage.setItem('profileStats', JSON.stringify(this.profileStats));
    //console.log(this.profileStats);
  }

}
