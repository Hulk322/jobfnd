import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ErrorService } from 'src/Services/shared/error.service';

@Component({
  selector: 'app-show-interview',
  templateUrl: './show-interview.component.html',
  styleUrls: ['./show-interview.component.css']
})
export class ShowInterviewComponent implements OnInit {

  isLoading = false;
  interview_id;
  sub;
  interview = {
    title: '',
    type: '',
    dates: [],
    date:null, 
    interview_datetime: null,
    recommended_datetime_in: null,
    notes: '',
    reason: '',
    location: '',
    current_status: 'New',
    submission: {
      id: null,
      email: '',
      first_name: null,
      last_name: null,
      created_at : null
    },
    job: {
      title: ''
    },
    actions: []
  };





  interviewUrl = environment.baseApiUrlClient + "/vendor/interviews/";
  interviewAcceptUrl = environment.baseApiUrlClient + "/vendor/interviews/";
  interviewRejectUrl = environment.baseApiUrlClient + "/vendor/interviews/";

  private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
  private httpOptions = {
    headers: this.headers_object
  };

  constructor(private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private _ErrorService: ErrorService) { }

  ngOnInit() {
    this.isLoading = true;
    this.sub = this.route.params.subscribe(params => {
      this.interview_id = +params['id']; // (+) converts string 'id' to a number

      return this.http.get(this.interviewUrl + this.interview_id, this.httpOptions).subscribe(
        data => this.handleSuccess(data),
        error => this.handleError(error)
      );


    });
  }

  acceptInterview() {
    this.isLoading = true;
    return this.http.post(this.interviewAcceptUrl + this.interview_id + "/status", { status: 'Accept', interview_datetime: this.interview.interview_datetime, reason: this.interview.reason }, this.httpOptions).subscribe(
      data => this.handleAcceptSuccess(data),
      error => this.handleAcceptError(error)
    );
  }

  handleAcceptSuccess(data) {
    this.interview.current_status = 'Vendor Accepted';
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
    this.isLoading = false;
  }

  handleAcceptError(error) {
    console.log(error);
    this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
    this.isLoading = false;
  }

  rejectInterview() {
    this.isLoading = true;
    return this.http.post(this.interviewRejectUrl + this.interview_id + "/status", { status: 'Reject', reason: this.interview.reason }, this.httpOptions).subscribe(
      data => this.handleRejectSuccess(data),
      error => this.handleRejectError(error)
    );
  }

  handleRejectSuccess(data) {
    this.interview.current_status = 'Vendor Rejected';
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
    this.isLoading = false;
  }

  handleRejectError(error) {
    console.log(error);
    this.isLoading = false;
  }

  handleSuccess(data) {
    console.log(data);
    this.interview = data.data.interview;
    this.interview.interview_datetime = this.interview.dates[0].id;
    this.isLoading = false;
  }

  handleChange(evt) {
    console.log(evt.target);
    //if (evt.target.value == 1)
      this.interview.interview_datetime = evt.target.value;
    //else
      //this.interview.interview_datetime = this.interview.other_datetime_in;
  }

  

  handleError(error) {
    console.log(error);
    this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
    this.isLoading = false;
  }
}
