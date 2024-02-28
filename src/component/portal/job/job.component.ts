import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JobService } from 'src/Services/vendor/job.service';
import { PublicJobService } from 'src/Services/public_portal/public-job.service';
import { JobsService } from 'src/Services/candidate/jobs.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { FileUploadService } from 'src/app/file-upload.service';
import { TokenService } from 'src/Services/token.service';
import { ErrorService } from 'src/Services/shared/error.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {environment} from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import {HostListener} from "@angular/core";
import { GoogleAnalyticsService } from 'src/Services/google-analytics.service';
declare var ga: Function;

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.css']
})
export class PortalJobComponent implements OnInit {

  @ViewChild('applyCloseBtn') applyCloseBtn: ElementRef;

  organizationOpenJobs = 0;

  public job = {
    id: null,
    title: null,
    api_job_id: null,
    job_type: null,
    created_at: null,
    deleted: false,
    salary: null,
    min_rate: null,
    max_rate: null,
    salary_type:null,
    start_date:null,
    tentative_end_date:null,
    category: {
      name: null
    },
    currency: null,
    description: '',
    openings: 0,
    experience: '',
    job_location:'',
    posted:'',
    submissionsCount:'',
    slug: '',
    category_id: null,
    organization_id: null,
    additional_detail: '',
    reason_for_hire: '',
    hasApplied: false,
    client_organization: {
      business_logo: null,
      businessLogoFullUrl: null,
      name: null,
      description: null,
      location: null,
      created_at: null
    },
    source_company_name: String,
    business_logo: String,
    skills: [],
    other_skills: [],
    descriptions: [],
    submissions: [],
    interviews: [],
    offers: [],
    questions: []
  };
  isFormError = false;
  submitted=false;
  placeholder="Choose Location";
  isLoading = true;
  id: number;
  private sub: any;
  isApplied = false;
  ApplySuccessMsg = "You have successfully applied for this job please check your email for detail.";
  errorMsg = '';
  job_link = location.origin+"/jobs/";
  show_more_description = true;

  applyJobForm: FormGroup;
  resumeToUpload: File = null;
  suggestedJobs : any[] = [];
  categories : any[] = [];
  isCandidateLoggedIn = false;
  fileName = "Choose your resume here";

  filters = {
    what : '',
    where : '',
    categories : 'AllCategories'
  };

  all_categories = [];
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  email: string;
  categoriesData = [];
  options = {
    multiple: false
  };
  clientId = "";

  constructor(private titleService:Title,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private publicJobService:PublicJobService,
    private _JobService: JobService,
    private _CandidateJobService: JobsService,
    private router: Router,
    private fileUploadService: FileUploadService,
    private _ErrorService: ErrorService,
    private Token: TokenService,
    private http: HttpClient,
    private googleAnalyticsService: GoogleAnalyticsService,
    private toastr: ToastrService) {
      this.route.queryParams.subscribe(params => {

        if(params['utm_source'] != ''){
          this.utm_source = params['utm_source'];
          sessionStorage.setItem('utm_source', this.utm_source);
        }

        if( params['utm_medium'] != '' ){
          this.utm_medium = params['utm_medium'];
          sessionStorage.setItem('utm_medium', this.utm_medium);
        }

        if( params['utm_campaign'] != '' ){
          this.utm_campaign = params['utm_campaign'];
          sessionStorage.setItem('utm_campaign', this.utm_campaign);
        }

        if( params['email'] != '' ){
                   this.email = params['email'];
                    sessionStorage.setItem('email', this.email);
                  }




      });

      this.sub = this.route.params.subscribe(params => {
        let slug = params['id']; // (+) converts string 'id' to a number
        //this.job.slug = slug;

        // In a real app: dispatch action to load the details here.
     });
      ga(function(tracker) {

        // Logs the client ID for the current user.
        localStorage.setItem('clientId',tracker.get('clientId'));
      });


     }

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

    href:any = "";
    show_company_sidebar = true;

    handleUserStatusSuccess(data){

      // first of save job_slug into localStorage = already done in constructor
      localStorage.setItem('job_slug_landed', this.job.id);

      if(data.data.is_active == true && data.data.setup_password==1)
        this.router.navigateByUrl('/login');

      if(data.data.is_active == false)
        window.location = data.data.redirect_url;

      this.isLoading = false;

    }

    handleUserStatusError(error){
      this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
      this.isLoading = false;
      this.router.navigateByUrl('/login');
    }

  ngOnInit() {

    this.isLoading = true;
    this.clientId = localStorage.getItem('clientId');






    this.href = window.location.host;
    if(this.href === "talentzhire.com" || this.href === 'talentzhire.com')
      this.show_company_sidebar = false;


  if(localStorage.getItem('is_candidate'))
    this.isCandidateLoggedIn = true;
  else
    this.isCandidateLoggedIn = false;

    let filters = sessionStorage.getItem('filters');
  	if(!filters) {
  		this.getFilters();
  	}else{
      let data = JSON.parse(filters);
      this.categories = data.popularCategories.slice(0,7);


    for (var key in data.usedCategories) {
      var obj = data.usedCategories[key];
      this.categoriesData.push({
        id: obj.name,
        text: obj.name
      });
    }

    this.all_categories = this.categoriesData;

    this.all_categories = this.all_categories.sort((a,b)=> b.count - a.count);
    }

    this.sub = this.route.params.subscribe(params => {
      let slug = params['id']; // (+) converts string 'id' to a number
      this.job.slug = slug;
      //alert(this.id);
      this.publicJobService.getJob(slug)
      .subscribe(
        data => this.handleSuccess(data),
       err => this.handleError(err)
       //() => console.log('ok')
    );
      // In a real app: dispatch action to load the details here.
   });

   this.applyJobForm = this.formBuilder.group({
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    email: ['', Validators.required],
    file: ['',Validators.required]
  });

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

			return [year, month, day].join('-');
		} else {
			return null;
		}
	}

  custom_fields = [];
  handleSuccess(data){
    console.log(data.data)
    this.job = data.data.job;
    this.organizationOpenJobs = data.data.organizationOpenJobs;
    this.job_link = this.job_link+this.job.slug;
    this.id = this.job.id;
    this.titleService.setTitle('Recruit-AI | Jobs - '+this.job.title);
    //this.job.skills = this.job.skills.slice(0,2);
    this.custom_fields = data.data.job.custom_fields;
		for ( var key in this.custom_fields ) {
			var obj = this.custom_fields[key];
			//console.log(obj);
			if(obj.pivot)
				obj.answer = obj.pivot.value;
			else
        obj.answer = obj.default_value;

      if(obj.type=='date')
        obj.answer = this.inputFormatDate(obj.answer);

		  }
    this.jobSuggestions();
    //this.job.skills = data.data.skills;
		//this.job.other_skills = data.data.other_skills;
    //this.job.descriptions = data.data.descriptions;


      // then check if email is provided in query parameter or not?, and if yes, check if email
    // is activated or not?
    //  if email is activated / password is set take him to login page
    // if email is not activated take to password setup page

    // call endpoint POST: /api/v1/chatbot/user-status  --email required
    if(this.email !='' && this.email !=null){
      this.http.post(this.userStatusUrl,
     { email: this.email }).subscribe(
      data =>this.handleUserStatusSuccess(data),
      error => this.handleUserStatusError(error)
    );
    }

     // GoogleAnalytics

    this.googleAnalyticsService.emitEvent(this.clientId,this.job.organization_id,"job_page", "job_detail", this.href, this.job.id);
    this.isLoading = false;
  }

  searchJob(categoryName){
  	this.router.navigate(['/jobs'],{queryParams: {categories: categoryName } });
  }

  inputFormatDate(date) {
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

      return [month, day, year].join('/');
    } else {
      return null;
    }
  }

  getFilters(){
  	this.publicJobService.getFilters().then((response : any)=>{
  		let data = response.data;
  		sessionStorage.setItem('filters',JSON.stringify(data));
  		this.categories = data.categories.slice(0,7);
  	},error=>{
  		console.log(error);
  	});
  }


  handleError(err){
    console.log(err);
    this.router.navigateByUrl('/login');
  }

  showDescription = true;
  showDetail = true;
  toggleDescription(){
    this.showDescription = !this.showDescription;
  }
  toggleDetail(){
    this.showDetail = !this.showDetail;
  }

  handleFileInput(files: FileList) {
    this.fileName = files.item(0).name;
    this.resumeToUpload = files.item(0);
  }

  getAddress(place: object) {
		this.filters.where = place['formatted_address'];
  }


  get f() { return this.applyJobForm.controls; }
  applyToJob(){
  this.submitted = true;
    if (this.applyJobForm.invalid) {
      return;
  }
    this.errorMsg = '';
    for(let key in this.applyJobForm.controls){
      this.errorMsg += this.applyJobForm.controls[key].status=='INVALID' ? key+' is required <br/>' : '';
    }
    if(this.resumeToUpload==null){
      this.isFormError = true;
      this.errorMsg += "resume is required";
      return ;
    }
    if(this.errorMsg!='') {
      this.isFormError = true;
      return ;
    }else if(!this.applyJobForm.valid) {
      this.isFormError = true;
      return ;
    }
    let requestedBody = Object.assign({},this.applyJobForm.value);
    if(!this.applyJobForm.value.first_name) {
      this.isFormError = true;
      return ;
    }
    if(!this.applyJobForm.value.last_name) {
      this.isFormError = true;
      return ;
    }
    //let fullName = this.applyJobForm.value.name.split(' ');
    //requestedBody.first_name = fullName[0];
    //requestedBody.last_name = fullName.length>1 ? fullName[1] : fullName[0];
    requestedBody.country_code = "US1";
    //delete requestedBody.name;
    requestedBody.resume = this.resumeToUpload;

    this.isFormError = false;
    this.isLoading = true;

    this.fileUploadService.postResumeToJobNew(requestedBody.resume, this.job.slug, requestedBody.first_name, requestedBody.last_name, requestedBody.email).subscribe(
      data => this.handleSuccessUploadResume(data),
      error => this.handleErrorUploadResume(error)
    );

   


  }

  verifyUrl = environment.baseApiUrlClient+"/jobs/";
  userStatusUrl = environment.baseApiUrlClient+"/chatbot/user-status";

  code = '';
  verifyCode(){
    this.isLoading = true;
    return this.http.post(this.verifyUrl+this.job.slug+"/verify",
     { 'email': this.applyJobForm.value.email, 'code': this.code }).subscribe(
      data =>this.handleVerifySuccess(data),
      error => this.handleVerifyError(error)
    );
  }

  handleVerifySuccess(data){
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
    console.log(data);

    this.Token.handle(data.data.token);

    localStorage.removeItem('is_client');
    localStorage.removeItem('is_vendor');
    localStorage.removeItem('is_candidate');
    localStorage.removeItem('is_admin');
    localStorage.removeItem('is_active');

    localStorage.setItem('is_vendor', data.data.user.type == 'vendor' ? 'true' : '' );
    localStorage.setItem('is_client', data.data.user.type == 'client' ? 'true'  : ''  );
    localStorage.setItem('is_candidate', data.data.user.type == 'candidate' ? 'true'  : '' );
    localStorage.setItem('is_admin', data.data.user.type == 'admin' ? 'true'  : '' );
    localStorage.setItem('full_name', data.data.user.first_name + " " + data.data.user.last_name);
    localStorage.setItem('id', data.data.user.id);
    localStorage.setItem('user', data.data.user);
    localStorage.setItem('profile_picture', data.data.user.meta.profilePictureFullUrl);
    //this._ErrorService.flashMessage({'type': 'success', 'messages': data.msg } );

    //this.isLoading = false;
    //console.log(data);
    if (data.data.redirect_url == 'your-organizations') {
      this.router.navigateByUrl('your-organizations');
    }else{
      if(data.data.user.type == 'candidate')
      {

          window.open( 'candidate/job-questions/' + this.job.id, '_self');
      }
      else
        window.open( data.data.redirect_url, '_self');
    }

  }

  handleVerifyError(error){
    this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
    this.isLoading = false;
  }

  step2 = false;

  handleSuccessUploadResume(data) {

    sessionStorage.removeItem('utm_source');
    sessionStorage.removeItem('utm_medium');
    sessionStorage.removeItem('utm_campaign');
    // GoogleAnalytics

    this.googleAnalyticsService.emitEvent(this.clientId,this.job.organization_id,"click", "submit", this.href, this.job.id);
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
    this.isLoading = false;
    if (data.data.redirect_url == 'your-organizations') {
      this.router.navigateByUrl('your-organizations');
    }

    if(data.data.questions==true){
      localStorage.setItem('uuid', data.data.uuid);
      window.open( 'job-questions/'+localStorage.getItem('job_slug'), '_self');
      //this.router.navigateByUrl('job-questions/'+localStorage.getItem('job_slug'));
    }
    else
      window.open('/submission-success?job_slug='+this.job.slug);
  }

  handleErrorUploadResume(error) {
    this.errorMsg = error.error.msg[0];
    this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
    this.isLoading = false;
  }

  search(){
    this.router.navigate(['/jobs'],{queryParams:this.filters });
  }

  searchClientJobs(org_name){
    this.filters.what = org_name;
    this.filters.where =  '';
    this.filters.categories = 'AllCategories';
    this.router.navigate(['/jobs'],{queryParams:this.filters });
  }

  goToJob(jobSlug){
    this.router.navigate(['/jobs/'+jobSlug]);
  }

  jobSuggestions(){
     let params = "?what="+this.job.title+"&where="+this.job.job_location;
     this.publicJobService.searchJobsByFilters(params).then(
     (response : any)=>{
       this.suggestedJobs = response.data.jobs.data;
     },
     err=>{

     });
  }

  getDays(createdDate){
    let result = this.daysBetween(createdDate, new Date());
    return result;
  }

  treatAsUTC(date) : any {
    var result = new Date(date);
    result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
    return result;
  }

  daysBetween(startDate, endDate) {
    var millisecondsPerDay = 24 * 60 * 60 * 1000;
    return (this.treatAsUTC(endDate) - this.treatAsUTC(startDate)) / millisecondsPerDay;
  }

  ApplyForJob(jobSlug){
    this.router.navigate(['/candidate/job-questions/'+jobSlug]);
  }

  oneClickApplyToJob(job_id){
    //console.log(this.job.questions);
    if(this.job.questions.length>0)
      this.router.navigate(['/candidate/job-questions/'+job_id]);
    else{
      this.isLoading = true;
      this._CandidateJobService.applyToJob(this.job.id)
      .subscribe(
        data => this.handleJobApplySuccess(data),
       err => this.handleJobApplyError(err)
       //() => console.log('ok')
    );
    }
  }

  handleJobApplySuccess(data)
  {
    this.job.hasApplied = true;
    this._ErrorService.flashMessage({'type': 'success', 'messages': data.msg } );
  }

  handleJobApplyError(error){
    this.isLoading = false;
     this._ErrorService.flashMessage( {'type': 'error', 'messages': error.error } );
   }

  openApplyForm(job){
    localStorage.setItem("job_id", job.id);
    localStorage.setItem("job_title", job.title);
    localStorage.setItem("job_description", job.description);
    localStorage.setItem("job_slug", job.slug);
    //this.router.navigate(['upload-resume/'+job.slug]);

    this.googleAnalyticsService.emitEvent(this.clientId,this.job.organization_id,"click", "apply_start", this.href, this.job.id);

     this.isApplied = false;
     //let index = this.jobs.findIndex(j=>j.id==job.id);
     //this.selectedJob = this.jobs[index];
  }

  copyMessage(){
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.job_link;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);

    //show alert data copied
    this.toastr.info('Job Link Copied.', '', {
      timeOut: 3000,
      positionClass: 'toast-bottom-right'
    });
  }

  @HostListener('window:beforeunload', ['$event'])
    unloadNotification($event: any) {
        if (this.isLoading) {
            $event.returnValue =true;
        }
    }

}
