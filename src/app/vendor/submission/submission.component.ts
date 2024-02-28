import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { JobService } from 'src/Services/vendor/job.service';
import { ErrorService } from 'src/Services/shared/error.service';

@Component({
  selector: 'app-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.css']
})
export class SubmissionComponent implements OnInit {

  
isLoading = false;
current_tab = "pdf";
submission_id;
sub;
submission = {
  status:null,
  created_at:null,
  estimated_joning_date:null,
  resume: null,
  first_name: '',
  last_name: '',
  gender: '',
  dob: '',
  address: '',
  location: null,
  bill_rate_min: null,
  bill_rate_max:null,
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
  resumeFullUrl: '',
  type: null,
  answers: [],
  documents: [],
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
      title: null
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

defaultSkillsCount = 10;
showMoreText = "more";

fullUrl : any;

submissionUrl =  environment.baseApiUrlClient+"/vendor/submissions/show/";


private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
private httpOptions = {
    headers: this.headers_object.set("Content-Type","application/pdf")
};

  constructor(private _JobService:JobService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private _ErrorService: ErrorService) { }

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

createPdfUrl(url){
  let splitUrl = url.split("/");
  let newURL = splitUrl.splice(3,splitUrl.length).join("/");
  let requestURL = environment.baseApiUrlClient.replace('/v1','')+"/public-file/"+newURL;
  this.fullUrl = requestURL;
}

withdrawSubmission(){
  var answer = confirm('Are you sure you want to withdraw from this submission?');
  if(answer){
    this._JobService.deleteSubmission(this.submission_id).subscribe(
      data => this.handleWithdrawSuccess(data),
      error => this.handleWithdrawError(error)
    );
  }
}

handleWithdrawSuccess(data){
  this.submission.status = 'Accepted';
  this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
  this.router.navigateByUrl('vendor/submissions');
}

handleWithdrawError(error){
  this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
}

handleSuccess(data){
  console.log(data);
  this.submission = data.data.submission;
  if(this.submission.resumeFullUrl.length){
    let url = this.submission.resumeFullUrl;
    this.createPdfUrl(url);
  }
}

handleError(error){
  console.log(error);
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

}
