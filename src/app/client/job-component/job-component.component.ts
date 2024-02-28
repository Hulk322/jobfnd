import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ClientJobService } from 'src/Services/client/job.service';
import { InterviewService } from 'src/Services/client/interview.service';
import { OfferService } from 'src/Services/client/offer.service';
import { ErrorService } from 'src/Services/shared/error.service';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Location} from '@angular/common';
declare var jQuery:any;


@Component({
  selector: 'app-job-component',
  templateUrl: './job-component.component.html',
  styleUrls: ['./job-component.component.css']
})
export class JobComponentComponent implements OnInit {

  title = "";
  current_tab = "job_details";
  refer = {
    type: 'email',
    emails: [ {email: ''} ],
    mobiles: [ { mobile:'' } ],
    email_description: `Hello,
I think you’d be a great fit for this job. Check it out and apply to this, if you’re interested.
[APPLY_BUTTON]
[JOB_TITLE]
[JOB_LOCATION]
[JOB_DESC]
[APPLY_BUTTON]

Thank you,
TalentzHire Team`,
    sms_description: "Hey, there! Check out this job titled [JOB_TITLE] - if you’re interested, apply here: [LINK]"
  };

  integrate_pool = {
    emails: [ {email: ''} ],
    description: `Hello,
I could use your help in connecting our candidates with Talentzhire and lean on their engagement, AI & matching technology. They’ve created an easy tool and documentation to integrate. Check it out here.

[API_DOCUMENTATION]

Thank you,
TalentzHire Team`
  };
preview_text = '';

  public job = {
    id: null,
    title: null,
    job_type: null,
    created_at: null,
    deleted: false,
    salary_type:null,
    start_date:null,
    min_rate:null,
    max_rate:null,
    tentative_end_date:null,
    posted: null,
    category: null,
    currency: null,
    description: '',
    openings: 0,
    experience: '',
    address: '',
    category_id: null,
    additional_detail: '',
    reason_for_hire: '',
    submissionsCount:'',
    client_organization: {
      business_logo: null,
      businessLogoFullUrl: null
    },
    skills: [],
    other_skills: [],
    descriptions: [],
    submissions: [],
    interviews: [],
    offers: [],
    is_published: 1,
  };
  interviews = [];
  offers = [];
  isLoading = true;
  id: number;
  private sub: any;
  exampleData2 = [];
	options = {
		multiple: true
	}
  job_delete = {
    reason : null,
    notes : null,
  }
  defaultSkillsCount = 10;
  showMoreText = "more";
  public isList : boolean = true;
  public isGrid : boolean = false;
  referisLoading = false;
  jobUrl = environment.baseApiUrlClient+"/client/jobs/";
  private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
  private httpOptions = {
    headers: this.headers_object
  };

  constructor(private route: ActivatedRoute,
    private _JobService: ClientJobService,
    private router: Router,
    private _interview: InterviewService,
    private _offer: OfferService,
    private _ErrorService: ErrorService,
    private _location: Location,
    private http: HttpClient) { }

    deleteSubmission(id, submission){
      var answer = confirm('Are you sure you want to delete this submission?');
      if(answer){
        submission.deleted = true;
        for(let i = 0; i < this.job.submissions.length; ++i){
          if (this.job.submissions[i].id === id) {
            this._JobService.deleteSubmission(id)
          .subscribe(
            data => this.job.submissions.splice(i, 1),
            err => console.log(err)
          );

          }
        }
      }
    }

    deleteInterview(id, interview) {
      var answer = confirm('Are you sure you want to delete this interview?');
      if (answer) {
        this.isLoading = true;
        interview.deleted = true;
        for (let i = 0; i < this.job.interviews.length; ++i) {
          if (this.job.interviews[i].id === id) {
            this._interview.delete(id)
              .subscribe(
                data => this.handleDeleteSuccess(data, i),
                err => console.log(err)
              );

          }
        }
      }
    }

    deleteJob(id, job) {
         job.deleted = true;

            this._JobService.deleteJob(id, this.job_delete)
              .subscribe(
                data => this.handleJobDeleteSuccess(data),
                error => this.handleError(error)
              );
    }

    showDescription = true;
  showDetail = true;
  toggleDescription(){
    this.showDescription = !this.showDescription;
  }
  toggleDetail(){
    this.showDetail = !this.showDetail;
  }

    handleJobDeleteSuccess(data){
      this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
      this.isLoading = false;
      this.router.navigateByUrl("/client/jobs");
    }

    handleDeleteSuccess(data, i){
      this.job.interviews.splice(i, 1);
      console.log(data);
      this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
      this.isLoading = false;
    }

  ngOnInit() {

    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id']; // (+) converts string 'id' to a number
      // alert(this.id);
      this._JobService.getJob(this.id)
      .subscribe(
        data => this.handleSuccess(data),
       err => this.handleError(err)
       //() => console.log('ok')
    );
      // In a real app: dispatch action to load the details here.
   });
  }

  handleSuccess(data){

    this.job = data.data.job;
    this.title = this.job.title.toUpperCase()+' - '+this.job.job_type;
    //this.skills = data.data.skills; test
		// for ( var key in this.job.skills ) {
		// 	var obj = this.job.skills[key];
		// 	this.exampleData2.push(
		// 			''+obj.id+''

		// 	);
		// }
		// this.job.skills = this.exampleData2;

    this.isLoading = false;
  }

  handleError(error){
    this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
    this.isLoading = false;
  }

  createFullUrl(url){
    let splitUrl = url.split("/");
    let newURL = splitUrl.splice(3,splitUrl.length).join("/");
    let requestURL = environment.baseApiUrlClient.replace('/v1','')+"/public-file/"+newURL;
    return requestURL;
  }

  deleteOffer(id, offer) {
    var answer = confirm('Are you sure you want to delete this offer?');
    if (answer) {
      this.isLoading = true;
      offer.deleted = true;
      for (let i = 0; i < this.job.offers.length; ++i) {
        if (this.job.offers[i].id === id) {
          this._offer.delete(id)
            .subscribe(
              data => this.handleDeleteOfferSuccess(data, i),
              err => console.log(err)
            );

        }
      }
    }
  }

  handleDeleteOfferSuccess(data, i){
    this.job.offers.splice(i, 1);
    console.log(data);
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
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


  toggleSkillsCount(){
    if(this.defaultSkillsCount==10) {
      this.defaultSkillsCount = this.job.skills.length;
      this.showMoreText = "less";
    }else{
      this.showMoreText = "more";
      this.defaultSkillsCount = 10;
    }
  }

  getJobInterviews() {
    this.isLoading = true;
    this.http.get(this.jobUrl + this.id + "/interviews", this.httpOptions).subscribe(
      data => this.handleJobInterviewsSuccess(data),
      error => console.log(error),
      );
  }

  handleJobInterviewsSuccess(data) {
    this.interviews = data.data.interviews.data;
    this.isLoading = false;
  }

  getJobOffers() {
    this.isLoading = true;
    this.http.get(this.jobUrl + this.id + "/offers", this.httpOptions).subscribe(
      data => this.handleJobOfferSuccess(data),
      error => console.log(error),
      );
  }

  handleJobOfferSuccess(data) {
    this.offers = data.data.offers.data;
    this.isLoading = false;
  }

  backClicked() {
    this._location.back();
  }


  @ViewChild('completeModal', { static: true }) completeModal: ElementRef;
  @ViewChild('completeModal2', { static: true }) completeModal2: ElementRef;
  @ViewChild('completeModal3', { static: true }) completeModal3: ElementRef;
  @ViewChild('completeModal4', { static: true }) completeModal4: ElementRef;

  referViaEmailOrSms(){
    this.isLoading = true;

    if (this.refer.type=='email')
      this.referViaEmail();
    if (this.refer.type == 'sms')
      this.referViaSMS();
  }

  referViaEmail(){
    var emails = [];
    for(var key in this.refer.emails){
      if(this.refer.emails[key].email != '' && this.refer.emails[key].email != null)
        emails.push(this.refer.emails[key].email);
    }

    this.http.post(this.jobUrl+this.job.id+"/send-via-email",
                     { emails: emails, description: this.refer.email_description },
                      this.httpOptions).subscribe(
                        data => this.handleReferEmailSuccess(data),
                        err => this.handleError(err)
                      );
  }

  referViaSMS(){
    var mobiles = [];
    for(var key in this.refer.mobiles){
      if(this.refer.mobiles[key].mobile != '' && this.refer.mobiles[key].mobile != null)
        mobiles.push(this.refer.mobiles[key].mobile);
    }

    this.http.post(this.jobUrl+this.job.id+"/send-via-sms",
                     { phones: mobiles, description: this.refer.sms_description },
                      this.httpOptions).subscribe(
                        data => this.handleReferSmsSuccess(data),
                        err => this.handleError(err)
                      );
  }

  handleReferEmailSuccess(data){
    jQuery(this.completeModal.nativeElement).modal('hide');
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
    this.refer.emails =  [ {email: ''} ];
    this.isLoading = false;
  }

  handleReferSmsSuccess(data){
    jQuery(this.completeModal.nativeElement).modal('hide');
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
    this.refer.mobiles = [ { mobile:'' } ];
    this.isLoading = false;
  }

  deleteReferEmail(index){
    this.refer.emails.splice(index, 1);
  }

  deleteReferMobile(index){
    this.refer.mobiles.splice(index, 1);
  }

  integratePool(){

    this.isLoading = true;
    var emails = [];
    for(var key in this.integrate_pool.emails){
      if(this.integrate_pool.emails[key].email != '' && this.integrate_pool.emails[key].email != null)
        emails.push(this.integrate_pool.emails[key].email);
    }

    this.http.post(this.jobUrl+this.job.id+"/integrate-pool",
    { emails: emails, description: this.integrate_pool.description },
     this.httpOptions).subscribe(
       data => this.handleIntegrateSuccess(data),
       err => this.handleError(err)
     );
  }

  handleIntegrateSuccess(data){
    jQuery(this.completeModal2.nativeElement).modal('hide');
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
    this.integrate_pool.emails = [ {email: ''} ];
    this.isLoading = false;
  }

  addEmailField(){
    this.refer.emails.push({ email: null });
}

addPhoneField(){
  this.refer.mobiles.push({ mobile: null });
}

addIntegratePool(){
  this.integrate_pool.emails.push({ email: null });
}

 deleteIntegratePoolEmail(index){
   this.integrate_pool.emails.splice(index, 1);
 }


 referViaEmailPreviewOrSms(){

   if (this.refer.type=='email')
     this.referViaEmailPreview();
   if (this.refer.type == 'sms')
     this.referViaSmsPreview();
 }

 referViaEmailPreview() {
   this.referisLoading = true;
   var emails = [];
   for(var key in this.refer.emails){
     if(this.refer.emails[key].email != '' && this.refer.emails[key].email != null)
       emails.push(this.refer.emails[key].email);
   }

   this.http.post(this.jobUrl+this.job.id+"/email/preview",
                    { emails: emails, description: this.refer.email_description },
                     {headers:this.headers_object, responseType: 'text'}).subscribe(
                       data => this.handlePreviewSuccess(data),
                       error => console.log(error)
                     );

 }

 handlePreviewSuccess(data) {
  this.preview_text = data;
  jQuery(this.completeModal3.nativeElement).modal('show');
  this.referisLoading = false;
 }

 referViaSmsPreview() {
   this.referisLoading = true;
   var mobiles = [];
    for(var key in this.refer.mobiles){
      if(this.refer.mobiles[key].mobile != '' && this.refer.mobiles[key].mobile != null)
        mobiles.push(this.refer.mobiles[key].mobile);
    }

    this.http.post(this.jobUrl+this.job.id+"/sms/preview",
                     { phones: mobiles, description: this.refer.sms_description },
                      {headers:this.headers_object, responseType: 'text'}).subscribe(
                        data => this.handlePreviewSuccess(data),
                        err => console.log(err)
                      );
 }

 integratePoolPreview() {
   this.referisLoading = true;
   var emails = [];
   for(var key in this.integrate_pool.emails){
     if(this.integrate_pool.emails[key].email != '' && this.integrate_pool.emails[key].email != null)
       emails.push(this.integrate_pool.emails[key].email);
   }

   this.http.post(this.jobUrl+this.job.id+"/integrate-pool/preview",
       { emails: emails, description: this.integrate_pool.description },
        {headers:this.headers_object, responseType: 'text'}).subscribe(
      data => this.handleIntegratePreviewSuccess(data),
      err => console.log(err)
    );
 }

 handleIntegratePreviewSuccess(data) {
    this.preview_text = data;
    jQuery(this.completeModal3.nativeElement).modal('show');

    this.referisLoading = false;
 }


 referViaEmailOrSmsOrIntegratePool() {

  if (this.refer.type=='email'){
       this.sendPreviewReferByEmail();

     }else if(this.refer.type == 'sms') {
       this.sendPreviewReferBySms();

     } else {
       this.sendPreviewIntegratePool();
     }
   }

 sendPreviewReferByEmail() {
     var emails = [];
     for(var key in this.refer.emails){
       if(this.refer.emails[key].email != '' && this.refer.emails[key].email != null)
         emails.push(this.refer.emails[key].email);
     }

     this.http.post(this.jobUrl+this.job.id+"/send-via-email",
                      { emails: emails, description: this.refer.email_description },
                       this.httpOptions).subscribe(
                         data => this.SendByReferEmailSuccess(data),
                         err => this.handleError(err)
                       );

 }

 sendPreviewReferBySms() {
     var mobiles = [];
     for(var key in this.refer.mobiles){
       if(this.refer.mobiles[key].mobile != '' && this.refer.mobiles[key].mobile != null)
         mobiles.push(this.refer.mobiles[key].mobile);
     }

     this.http.post(this.jobUrl+this.job.id+"/send-via-sms",
                      { phones: mobiles, description: this.refer.sms_description },
                       this.httpOptions).subscribe(
                         data => this.SendReferSmsSuccess(data),
                         err => this.handleError(err)
                       );
 }


 SendByReferEmailSuccess(data){
  jQuery(this.completeModal3.nativeElement).modal('hide');

   this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
   this.refer.emails =  [ {email: ''} ];
   jQuery(this.completeModal.nativeElement).modal('hide');

   this.isLoading = false;
 }

  SendReferSmsSuccess(data) {
  jQuery(this.completeModal3.nativeElement).modal('hide');

   this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
   this.refer.mobiles = [ { mobile:'' } ];
   jQuery(this.completeModal.nativeElement).modal('hide');

   this.isLoading = false;

 }

 sendPreviewIntegratePool() {
   this.isLoading = true;
   var emails = [];
   for(var key in this.integrate_pool.emails){
     if(this.integrate_pool.emails[key].email != '' && this.integrate_pool.emails[key].email != null)
       emails.push(this.integrate_pool.emails[key].email);
   }

   this.http.post(this.jobUrl+this.job.id+"/integrate-pool",
   { emails: emails, description: this.integrate_pool.description },
    this.httpOptions).subscribe(
      data => this.SendIntegrateSuccess(data),
      err => this.handleError(err)
    );
 }


   SendIntegrateSuccess(data) {
     jQuery(this.completeModal3.nativeElement).modal('hide');

     this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
     this.integrate_pool.emails = [ {email: ''} ];

     jQuery(this.completeModal2.nativeElement).modal('hide');
     this.isLoading = false;
   }

}
