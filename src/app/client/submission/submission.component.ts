import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { CreateInterviewComponent } from 'src/app/client/interviews/create-interview/create-interview.component';
import { InterviewService } from 'src/Services/client/interview.service';
import { SubmissionService } from 'src/Services/client/submission.service';
import { ErrorService } from 'src/Services/shared/error.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { InterviewModalComponent }  from 'src/app/client/interviews/interview-modal/interview-modal.component';
import {Location} from '@angular/common';

@Component({
  selector: 'app-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.css']
})
export class SubmissionComponent implements OnInit {

  interview = {
    title: '',
    type: '',
    recommended_dates : [],
    recommended_datetime_in: null,
    
    other_datetime_in: null,
    
    notes: '',
    reason: '',
    location: '',
    current_status: 'New'
  };
  urlSafe: SafeResourceUrl;
  graphFrameUrl = environment.GRAPHICAL_URL;
  id: any;
  sidebar_open = false; 
  types = [];
  interview_recommended_date = {
    date: null,
    time_in: null,
    time_out: null
  }

isLoading = false;

@ViewChild(InterviewModalComponent, { static: true })
  private interviewModalComponent: InterviewModalComponent;

current_interview_type;
submission_id;
sub;
locations: [];
submission = {
  id: null,
  status:null,
  bill_rate_min: null,
  bill_rate_max:null,
  pay_rate: null,
  created_at:null,
  estimated_joning_date:null,
  is_client_fav: false,
  first_name: '',
  last_name: '',
  candidate: {
    first_name: '',
    last_name: ''
  },
  gender: '',
  dob: '',
  location: '',
  address: '',
  full_address: '',
  willing_to_relocated: '',
  home_phone: '',
  mobile: '',
  city: '',
  country: '',
  state: '',
  zip: null,
  salary_amount: null,
  salary_type: null,
  skills: [],
  additional_information: null,
  quick_summary: null,
  facebook: null,
  liknedin: '',
  twitter: '',
  authorized_in_us: null,
  resume: null,
  is_local_file: false,
  resumeFullUrl: '',
  type: null,
  from_discover_similar: null,
  answers: [],
  documents: [],
  interviews: [],
  job: {
    id: null,
    title:null,
    job_type: null,
    description: null,
    posted: null,
    address: null,
    category: {
      name: null
    }
  },
  talent: {
    first_name: null,
    last_name: null,
    resume : {
      title: null,
      documents:[]
    },
    talentMeta: {
      mobile:null,
      location:null
    },
    meta : {
      profilePictureFullUrl: null
    }
  }
};

talentMeta ={
  mobile: null,
  location: null
};

fullUrl = "";
closeResult: string;
opened_class = '';
defaultSkillsCount = 10;
showMoreText = "more";
current_tab = "pdf";

submissionUrl =  environment.baseApiUrlClient+"/client/submissions/show/";
submissionAcceptUrl = environment.baseApiUrlClient+"/client/submissions/";
submissionRejectUrl = environment.baseApiUrlClient+"/client/submissions/";

private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
  private httpOptions = {
    headers: this.headers_object
  };

  constructor(private modalService: NgbModal,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private _interview: InterviewService,
    private _submission: SubmissionService,
    private _ErrorService: ErrorService,
    private _location: Location) {
      //this.id = this.featureBarService.resumeId();
    //console.log(this.id);
    
     }

ngOnInit() {
  this.isLoading = true;
      this.sub = this.route.params.subscribe(params => {
      this.submission_id = +params['id']; // (+) converts string 'id' to a number
     
      return this.http.get(this.submissionUrl+this.submission_id, this.httpOptions).subscribe(
        data => this.handleSuccess(data),
        error => this.handleError(error)
      );
      
      
       
    });

    
}

togglesidebar(event) {
  this.interviewModalComponent.togglesidebar(this.submission, event);
}

addDate(){
  if(this.interview_recommended_date.date!=null && this.interview_recommended_date.time_in != null && this.interview_recommended_date.time_out != null){
    this.interview.recommended_dates.push({ date: this.interview_recommended_date.date, time_in: this.interview_recommended_date.time_in, time_out: this.interview_recommended_date.time_out });
    this.interview_recommended_date = { date: null, time_in: null, time_out: null };
  }
}

deleteDate(index){
  this.interview.recommended_dates.splice(index, 1);
}




handleSuccessPost(data) {
  this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
  this.isLoading = false;
  this.router.navigateByUrl('/client/interviews', data.msg.msg);
  // this.activeModal.close();
}

handleErrorPost(error) {
  this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
  this.isLoading = false;
}

formatDate(date) {
  var d;
  if (typeof (date) === "string") {
    d = new Date(date);
  } else {
    d = date;
  }

  if (d instanceof Date) {
    var month = '' + (d.getMonth() + 1);
    var day = '' + d.getDate();
    var year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    //return [year, month, day].join('-');
    return [day, month, year].join('-');
  } else {
    return null;
  }
}

acceptSubmission(){
  return this.http.post(this.submissionAcceptUrl+this.submission_id+"/status", {status:'Accepted'}, this.httpOptions).subscribe(
    data => this.handleAcceptSuccess(data),
    error => this.handleAcceptError(error)
  );
}

handleAcceptSuccess(data){
  this.submission.status = 'Accepted';
  this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
}

handleAcceptError(error){
  this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
}

rejectSubmission(){
  return this.http.post(this.submissionRejectUrl+this.submission_id+"/status", {status:'Rejected'}, this.httpOptions).subscribe(
    data => this.handleRejectSuccess(data),
    error => this.handleRejectError(error)
  );
}

handleRejectSuccess(data){
  this.submission.status = 'Rejected';
  this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
}

handleRejectError(error){
  this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
}

interviews = [];
handleSuccess(data){
  this.submission = data.data.submission;
  this.interviews = data.data.interviews;
  this.id = this.submission['cv']['api_id'];
  this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.graphFrameUrl.toLowerCase() + this.id +"&source=sovren");

  if(this.submission.resumeFullUrl !='' && this.submission.resumeFullUrl != null){
    let url = this.submission.resumeFullUrl;
    this.createPdfUrl(url);
  }
  this.getCreateData();
}

getCreateData() {
  // this.sub = this.route.params.subscribe(params => {
     //this.submission_id = +params['submission_id']; // (+) converts string 'id' to a number
     //alert(this.id);
     this._interview.getCreateData(this.submission_id)
       .subscribe(
         data => this.handleGetCreateDataSuccess(data),
         error => this.handleError(error)

       );

   //});
 }

 handleGetCreateDataSuccess(data){
  this.types = data.data.types;
  this.locations = data.data.locations;
  this.interview.title = this.submission.first_name + " " + this.submission.last_name + " - " + this.submission.job.title;
  this.interview.type = this.types[0];
  this.current_interview_type = this.interview.type;
  this.isLoading = false;
}

handleError(error){
  //console.log(error);
  this.isLoading = false;
  this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
}

placeholder='Choose Place...';

getAddress(place: object) {
  this.interview.location = place['formatted_address'];
}

toggleFavorite(id){
  this._submission.toggleFavorite(id, this.submission.is_client_fav)
  .subscribe(
    data => this.handleToggleSubmissionSuccess(data),
    err => this.handleError(err)
    //() => console.log('ok')
  );
}

handleToggleSubmissionSuccess(data){
  this.submission.is_client_fav = !this.submission.is_client_fav;
  this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
}

onValueChange(newValue) {
  this.interview.location = newValue;
}

openInterviewModal() {
  let modalRef = this.modalService.open(CreateInterviewComponent);
   modalRef.componentInstance.submission_id = this.submission_id;
}

createPdfUrl(url){
    this.fullUrl = url;
}

toggleSkillsCount(){
  if(this.defaultSkillsCount==10) {
    this.defaultSkillsCount = this.submission.skills.length;
    this.showMoreText = "less";
  }else{
    this.showMoreText = "more";
    this.defaultSkillsCount = 10;
  }
}

withdrawSubmission(){
  this.isLoading = true;
  return this.http.get(this.submissionRejectUrl+this.submission_id+"/withdraw", this.httpOptions).subscribe(
    data => this.handleWithdrawSuccess(data),
    error => this.handleRejectError(error)
  );
}

handleWithdrawSuccess(data){
  this.submission.status = 'Withdrawn';
  this.isLoading = false;
  this.router.navigateByUrl('client/submissions');
  this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
}

backClicked() { 
  this._location.back();
}

}
