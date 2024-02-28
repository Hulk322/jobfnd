import { Component, OnInit } from '@angular/core';
import { JobsService } from 'src/Services/candidate/jobs.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ErrorService } from 'src/Services/shared/error.service';
import {environment} from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {HostListener} from "@angular/core";

@Component({
  selector: 'app-job-apply-success',
  templateUrl: './job-apply-success.component.html',
  styleUrls: ['./job-apply-success.component.css']
})
export class JobApplySuccessComponent implements OnInit {

  jobs: any[];
  isCandidateLoggedIn = false;
  isActive = "1";

  constructor(private _JobService: JobsService,
              private _ErrorService: ErrorService,
              private router: Router,
              private route: ActivatedRoute,
              private http: HttpClient) { }


  sub;
  jobSlug;
  job_id;

  ngOnInit() {

    this.isActive = localStorage.getItem("is_active");

    if(localStorage.getItem('is_candidate'))
      this.isCandidateLoggedIn = true;
    else
      this.isCandidateLoggedIn = false;

      this.sub = this.route.params.subscribe(params => {
        let job_id = params['job_id']; // (+) converts string 'id' to a number
        let job_slug = params['job_slug']; // (+) converts string 'id' to a number
        this.jobSlug = job_slug;
        this.job_id = job_id;
        this._JobService.getSimilarJobs(job_id)
        .subscribe( 
          data => this.handleSuccess(data),
         err => this.handleError(err)
      );
        // In a real app: dispatch action to load the details here.
     });

    
  }

  handleSuccess(data)
  {
    this.jobs = data.data.jobs;
    //this._ErrorService.flashMessage({'type': 'success', 'messages': data.msg } );
  }

  testAlert(){
    console.log('in toaster');
    //this.toastr.success('Success!', 'Good');
  }

  handleError(error){
    this._ErrorService.flashMessage( {'type': 'error', 'messages': error.error } );
   }

   oneClickApplyToJob(job){

    //if(job.questions.length>0)
      this.router.navigate(['/candidate/job-questions/'+job.id]);
    /*else{
      this.isLoading = true;
      this._JobService.applyToJob(job.id)
      .subscribe( 
        data => this.handleJobApplySuccess(data),
       err => this.handleJobApplyError(err)
       //() => console.log('ok')
    );
    }*/
  }

  goToJob(job_id){
    //this.router.navigate(['/jobs/'+job_id]);
    this.router.navigate(['/candidate/job-questions/'+job_id]);
  }

  verifyUrl = environment.baseApiUrlClient+"/jobs/";
  resendLinkUrl = environment.baseApiUrlClient+"/jobs/";

  code = '';
  isLoading = false;
  step2 = true;
  verifyCode(){
    this.isLoading = true;
    return this.http.post(this.verifyUrl+this.jobSlug+"/verify", 
     { 'email': localStorage.getItem('email'), 'code': this.code }).subscribe(
      data =>this.handleVerifySuccess(data),
      error => this.handleVerifyError(error)
    );
  }

  isResending = false;
  resendLink(){
    this.isLoading = true;
    this.isResending = true;
    return this.http.get(this.verifyUrl+this.jobSlug+"/resend-code/"+localStorage.getItem("email")).subscribe(
      data =>this.handleResendLinkSuccess(data),
      error => this.handleVerifyError(error)
    );
  }

  handleVerifySuccess(data){
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
    this.isActive = '1';
    localStorage.setItem("is_active", "1");
    this.step2 = false;
    this.isLoading = false;
  }

  handleVerifyError(error){
    this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
    this.isLoading = false;
  }

  handleResendLinkSuccess(data){
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
    this.isLoading = false;
    this.isResending = false;
  }

  @HostListener('window:beforeunload', ['$event'])
    unloadNotification($event: any) {
        if (!this.isActive) {
            $event.returnValue =true;
        }
    }


}
