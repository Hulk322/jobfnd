import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PublicJobService } from 'src/Services/public_portal/public-job.service';
import { JobsService } from 'src/Services/candidate/jobs.service';
import { ErrorService } from 'src/Services/shared/error.service';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-applied-job-details',
  templateUrl: './applied-job-details.component.html',
  styleUrls: ['./applied-job-details.component.css']
})
export class AppliedJobDetailsComponent implements OnInit {

  private sub: any;
  organizationOpenJobs = 0;
  placeholder = "Choose Place...";
  filters = {
    what : '',
    where : '',
    categories : 'AllCategories'
  };

  current_tab = 'job_status';

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
    applied:null,
    category: null,
    currency: null,
    description: '',
    openings: 0,
    experience: '',
    job_location: '',
    posted:'',
    submissionsCount:'',
    slug: '',
    category_id: null,
    additional_detail: '',
    reason_for_hire: '',
    hasApplied: false,
    submission: {
      created_at: null,
      updated_at: null,
      status: null,
      answers: []
    },
    client_organization: {
      business_logo: null,
      businessLogoFullUrl: null,
      name: null,
      description: null,
      location: null,
      created_at: null
    },
    skills: [],
    other_skills: [],
    descriptions: [],
    submissions: [],
    interviews: [],
    user_interviews: [],
    user_offers: [],
    user_contracts: [],
    offers: [],
    questions: []
  };

  offer = {
    id:'',
    title: '',
    type: '',
    salary: '',
    candidate_status: '',
    vendor_markup: '',
    bill_rate: '',
    bill_rate_overtime: '',
    notes: '',
    reason: '',
    current_status: 'New',
    start_date:'',
    created_at: '',
    updated_at: '',
    submission: {
      id: null,
      email: '',

    },
    job:{
      title:'',
      job_type:'',
      salary:'',
      salary_type:'',
      min_rate:null,
      max_rate:null,
      experience:'',
      description:'',
      api_job_id:'',
      category:{ name : ''},
      openings:'',
      posted:'',
      job_location:'',
      start_date:'',
      skills:  [],
      updated_at: ''
    },
    client_organization:{
      name:'',
      location:'',
      description:'',
      businessLogoFullUrl:''
    },
    actions: []
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

  id: number;
  isLoading = true;
  job_link = location.origin+"/jobs/";
  show_more_description = false;

  offerUrl = environment.baseApiUrlClient + "/candidate/offers/";
  interviewsUrl = environment.baseApiUrlClient + "/candidate/interviews/";

  private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
  private httpOptions = {
    headers: this.headers_object
  };

  constructor(
              private route: ActivatedRoute, 
              private publicJobService:PublicJobService,
              private _JobService: JobsService,
              private titleService:Title,
              private _ErrorService: ErrorService,
              private router: Router,
              private toastr: ToastrService,
              private http: HttpClient
              ) { }

    href:any = "";
    show_company_sidebar = true;
    
  ngOnInit() {
    this.href = window.location.host;
    if(this.href === "talentzhire.com" || this.href === 'talentzhire.com')
      this.show_company_sidebar = false;

    this.sub = this.route.params.subscribe(params => {
      let id = params['id']; // (+) converts string 'id' to a number
      this.job.id = id;
      
      this._JobService.getAppliedJobDetails(id)
      .subscribe( 
        data => this.handleSuccess(data),
       err => this.handleError(err)
       //() => console.log('ok')
    );
      // In a real app: dispatch action to load the details here.
   });
  }

  getAddress(place: object, question) { 
    var question = this.job.questions.find(x => x.id === question.id);
    question.answer = place['formatted_address'];
  }

  custom_fields = [];
  active_jobs = 0;
  handleSuccess(data){
    
    this.job = data.data.job;
    this.active_jobs = data.data.org_jobs;
    this.organizationOpenJobs = data.data.organizationOpenJobs;
    this.id = this.job.id;
    this.job_link = this.job_link+this.job.slug;
    this.titleService.setTitle('Talentzhire | Jobs - '+this.job.title);

    if ( this.job.user_interviews.length>0 )
      this.current_tab = 'interviews';

    if ( this.job.user_offers.length>0 )
      this.current_tab = 'offers';

    /* if ( this.job.user_contracts.length>0 )
      this.current_tab = 'contracts'; */

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
    //this.job.skills = this.job.skills.slice(0,2);
    //this.jobSuggestions();
    //this.job.skills = data.data.skills;
		//this.job.other_skills = data.data.other_skills;
    //this.job.descriptions = data.data.descriptions;
    if(data.data.job.hasApplied!=1)
      this.router.navigateByUrl('/candidate/applied-jobs');
    this.isLoading = false;
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

  handleError(err){
    console.log(err);
    //this.router.navigateByUrl('/login');
  }

  oneClickApplyToJob(job_id){

    var answers = [];
    for ( var key in this.job.questions ) {
      var obj = this.job.questions[key];
      console.log(obj);
      answers[obj.id]=obj.answer;
    }

    this._JobService.applyToJob(job_id, answers)
        .subscribe( 
          data => this.handleJobApplySuccess(data),
         err => this.handleJobApplyError(err)
         //() => console.log('ok')
      );
  }

  handleJobApplySuccess(data)
  {
    //var job = this.jobs.find(x => x.id === data.data.job.id);
    //console.log(job);
    this.job.hasApplied = true;
    this._ErrorService.flashMessage({'type': 'success', 'messages': data.msg } );
    this.router.navigateByUrl("/candidate/job-apply-success/"+this.job.slug+"/"+this.job.id);
  }

  handleJobApplyError(error){
     console.log(error);
     this._ErrorService.flashMessage( {'type': 'error', 'messages': error.error } );
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

  searchClientJobs(org_name){
    this.filters.what = org_name;
    this.filters.where =  '';
    this.filters.categories = 'AllCategories';
    this.router.navigate(['/jobs'],{queryParams:this.filters });
  }

  changeTabToOffers(){
    if(this.job.user_offers.length>0)
      this.current_tab='offers';
  }

  changeTabToContracts(){
    if(this.job.user_contracts.length>0)
      this.current_tab='contracts';
  }

  acceptOffer() {
    this.isLoading = true;
    return this.http.post(this.offerUrl + this.offer.id + "/status", { status: 'Accept', reason: this.offer.reason }, this.httpOptions).subscribe(
      data => this.handleAcceptSuccess(data),
      error => this.handleAcceptError(error)
    );
  }

  handleAcceptSuccess(data) {
    this.offer.candidate_status = 'Contract';

    var offer = this.job.user_offers.find(x => x.id === this.offer.id);
    offer.candidate_status = 'Contract';

    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
    this.isLoading = false;
  }

  handleAcceptError(error) {
    this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
    this.isLoading = false;
  }

  rejectOffer() {
    this.isLoading = true;
    return this.http.post(this.offerUrl + this.offer.id + "/status", { status: 'Reject', reason: this.offer.reason }, this.httpOptions).subscribe(
      data => this.handleRejectSuccess(data),
      error => this.handleRejectError(error)
    );
  }

  handleRejectSuccess(data) {
    this.offer.candidate_status = 'Reject';

    var offer = this.job.user_offers.find(x => x.id === this.offer.id);
    offer.candidate_status = 'Reject';

    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
    this.isLoading = false;
  }

  handleRejectError(error) {
    this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
    this.isLoading = false;
  }

  initInterviewDates(interview){
    this.current_interview = interview;
    //this.current_interview.current_status = status;
    //interview.status = status;
    this.current_interview.interview_datetime = interview.dates[0].id;
  }

  acceptInterview() {
    this.isLoading = true;
    return this.http.post(this.interviewsUrl + this.current_interview.id + "/status", { status: 'Accept', interview_datetime: this.current_interview.interview_datetime, reason: this.current_interview.reason }, this.httpOptions).subscribe(
      data => this.handleAcceptInterviewSuccess(data),
      error => this.handleAcceptError(error)
    );
  }

  handleAcceptInterviewSuccess(data) {
    var interview = this.job.user_interviews.find(x => x.id === this.current_interview.id);
    interview.candidate_status = 'Accept';

    var find_date = interview.dates.find(x => x.id === this.current_interview.interview_datetime);
    find_date.is_selected = 1;

    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
    this.isLoading = false;
  }

  

  rejectInterview() {
    this.isLoading = true;
    return this.http.post(this.interviewsUrl + this.current_interview.id + "/status", { status: 'Reject', interview_datetime: this.current_interview.interview_datetime, reason: this.current_interview.reason }, this.httpOptions).subscribe(
      data => this.handleRejectInterviewSuccess(data),
      error => this.handleAcceptError(error)
    );
  }

  handleRejectInterviewSuccess(data) {
    var interview = this.job.user_interviews.find(x => x.id === this.current_interview.id);
    interview.current_status = 'Reject';
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
    this.isLoading = false;
  }

  current_date_id;
  handleChange(evt, date_id) {
    console.log("date_id => "+date_id);
    //if (evt.target.value == 1)
      this.current_interview.interview_datetime = evt.target.value;
      this.current_date_id = date_id;
    //else
      //this.interview.interview_datetime = this.interview.other_datetime_in;
  }

}
