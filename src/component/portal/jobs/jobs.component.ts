import { Component, OnInit,ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PublicJobService } from 'src/Services/public_portal/public-job.service';
import { ErrorService } from 'src/Services/shared/error.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { JobsService } from 'src/Services/candidate/jobs.service';
import { FileUploadService } from 'src/app/file-upload.service';
import { TokenService } from 'src/Services/token.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {environment} from 'src/environments/environment';
import {HostListener} from "@angular/core";
import { GoogleAnalyticsService } from 'src/Services/google-analytics.service';
declare var ga: Function;

@Component({
  selector: 'app-jobs-portal',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class PortalJobsComponent implements OnInit {
@ViewChild('applyCloseBtn') applyCloseBtn: ElementRef;
@ViewChild('applymodalBtn') applymodalBtn:ElementRef;

  applyJobForm: FormGroup;
  resumeToUpload: File = null;
  placeholder="Choose Location";
  isCandidateLoggedIn = false;
  categories : any[] = [];

  isFormError = false;
  submitted = false;
  isApplied = false;
  isLoading = false;
  searched = false;
  view_type = "list";
  isFiltersCleared = false;
  isSkillSelected = false;
  isSalarySelected = false;
  isJobTypeSelected = false;
  isExperienceTypeSelected = false;
  fileName = "Choose your resume here";

  jobs: any[];
  selectedJob = {
    id : null,
    title: '',
    slug: '',
    client_organization : {
      name: ''
    },
    organization_id: null,
    address:''
  };
  pageObj ={
    page : 1,
    pageSize: 10,
    totalElements : 0
  }
  filters = {
    what : '',
    where : '',
    experience: '',
    categories : '',
    category_ids: '',
    job_type_0 : true,
    job_type_1 : true,
    company_size : ''
  }

  selectedSortBy = null;

  anyFilters = {
    jobType        : {type:'Any', checked:true},
    skillType      : {type:'Any', checked:true},
    salaryType     : {type:'Any', checked:true},
    experienceType : {type:'Any', checked:true}
  }

  skills = [];
  salaries = [];
  jobTypes = [];
  experienceTypes = [];
  all_categories =[];
  sortByOptions = [];

  moreSkills  = 15;
  routeSub : any;
  ApplySuccessMsg = "You have successfully applied for this job please check your email for detail.";
  errorMsg = '';

  isAllJobRoute = false;
  href = '';
  clientId = "";
  constructor(
    private titleService:Title,
    private formBuilder: FormBuilder,
    private publicJobService: PublicJobService,
    private router: Router,
    private _JobService: JobsService,
    private route: ActivatedRoute,
    private _ErrorService: ErrorService,
    private fileUploadService: FileUploadService,
    private Token: TokenService,
    private http:HttpClient,
    private googleAnalyticsService: GoogleAnalyticsService,

  ) {

    ga(function(tracker) {

      // Logs the client ID for the current user.
      localStorage.setItem('clientId',tracker.get('clientId'));
    });
    this.titleService.setTitle('Recruit-AI | Jobs');
  }

  getFilters(){
  	this.publicJobService.getFilters().then((response : any)=>{
  		let data = response.data;
  		sessionStorage.setItem('filters',JSON.stringify(data));
      this.categories = data.popularCategories.slice(0,7);
      this.updateSkillsFilter(data.skills.data);

    this.updateSalariesFilter(data.salaries);

    this.updateJobTypeFilter(data.jobTypes);

    this.updateExpTypeFilter(data.experienceTypes);

    this.updateSortByFilter(data.sort);



    this.exampleData = [];
 this.exampleData.push({
      id: 'AllCategories',
      text: 'All Categories'
    });

    for (var key in data.usedCategories) {
			var obj = data.usedCategories[key];
			this.exampleData.push({
				id: obj.name,
				text: obj.name
			});
    }

    this.all_categories = this.exampleData;
    this.all_categories = this.all_categories.sort((a,b)=> b.count - a.count);
  	},error=>{
  		console.log(error);
  	});
  }

  ngOnInit() {
    this.clientId = localStorage.getItem('clientId');
    this.href = window.location.host;
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
      this.updateSkillsFilter(data.skills.data);

    this.updateSalariesFilter(data.salaries);

    this.updateJobTypeFilter(data.jobTypes);

    this.updateExpTypeFilter(data.experienceTypes);

    this.updateSortByFilter(data.sort);

    for (var key in data.usedCategories) {
			var obj = data.usedCategories[key];
			this.exampleData.push({
				id: obj.name,
				text: obj.name
			});
    }

    this.all_categories = this.exampleData;

    //this.all_categories = data.usedCategories;
    this.all_categories = this.all_categories.sort((a,b)=> b.count - a.count);
  	}
    this.routeSub = this.route
      .queryParams
      .subscribe(params => {
        if(Object.keys(params).length != 0 && params.constructor === Object) {
          // this.isFiltersCleared = true;
          this.filters.what = '';
          this.filters.where = '';
          this.filters.categories = '';
          this.filters.company_size = '';
          for (let key in params) {
            this.filters[key] = params[key];
          }
          this.isAllJobRoute = false;
          this.search('all');
        }else{
          this.isAllJobRoute = true;
          this.clearFilters();
        }
      });
      this.applyJobForm = this.formBuilder.group({
        first_name: ['', Validators.required],
        last_name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        file:['',Validators.required]
      });

     // GoogleAnalytics
     
     this.googleAnalyticsService.emitEvent(this.clientId,0,"job_page", "job_search", this.href, 10);

  }

  oneClickApplyToJob(job){
    if(job.questions.length>0)
      this.router.navigate(['/candidate/job-questions/'+job.id]);
    else{
      this.isLoading = true;
      this._JobService.applyToJob(job.id)
      .subscribe(
        data => this.handleJobApplySuccess(data),
       err => this.handleJobApplyError(err)
       //() => console.log('ok')
    );
    }
  }

  handleJobApplySuccess(data)
  {
    var job = this.jobs.find(x => x.id === data.data.job.id);

    this.googleAnalyticsService.emitEvent(this.clientId,0,"click", "apply_start", this.href, this.selectedJob.id);
    job.hasApplied=true;
    this._ErrorService.flashMessage({'type': 'success', 'messages': data.msg } );
  }

  handleJobApplyError(error){
     //console.log(error);
     this.isLoading = false;
     this._ErrorService.flashMessage( {'type': 'error', 'messages': error.error } );
   }

  getJobs(){
    this.searched = false;
    this.publicJobService.getJobsPublic(this.pageObj.page)
        .subscribe(
          data => this.handleSuccess(data),
         err => this.handleError(err)
      );
  }

  appendJobTypeParam(params,isNotAny) : string{
    if(!this.anyFilters.jobType.checked || (isNotAny=='jobType' && this.anyFilters.jobType.checked)) {
        this.anyFilters.jobType.checked = false;
        let index = 0;
        this.jobTypes.map((jobtype,i)=>{
           if(jobtype.checked) {
             params += 'job_types['+index+']='+jobtype.job_type+'&';
             index++;
           }
         });
     }else{
      this.jobTypes = this.jobTypes.map((jobtype,i)=>{
        jobtype.checked = false;
        return jobtype;
      });
     }
    return params;
  }

  appendExpTypeParam(params,isNotAny) : string{
    if(this.filters.experience!="" && this.filters.experience!=null) {
      this.anyFilters.experienceType.checked = false;
      this.experienceTypes.push({type:this.filters.experience,checked:true});
      params += `experiences[0]=${this.filters.experience}`;
      return params;
    }
    if(!this.anyFilters.experienceType.checked || (isNotAny=='expType' && this.anyFilters.experienceType.checked)) {
      this.anyFilters.experienceType.checked = false;
      let index = 0;
      this.experienceTypes.map((exptype,i)=>{
        if(exptype.checked) {
          params += `experiences[${index}]=${exptype.type}&`;
          index++;
          this.isExperienceTypeSelected  = true;
        }
      });
     }else{
      this.experienceTypes = this.experienceTypes.map((exptype,i)=>{
        exptype.checked = false;
        return exptype;
      });
     }
     return params;
  }

  appendSkillsParam(params,isNotAny) : string{
    if(!this.anyFilters.skillType.checked || (isNotAny=='skillType' && this.anyFilters.skillType.checked)) {
       this.anyFilters.skillType.checked = false;
       let index = 0;
       this.skills.map((skill,i)=>{
         if(skill.checked) {
           params += `skills[${index}]=${skill.skills[0].name}&`;
           index++;
           this.isSkillSelected = true;
         }
       });
     }else{
      this.skills = this.skills.map((skill,i)=>{
        skill.checked = false;
        return skill;
      });
     }
     return params;
  }

  appendSalaryParam(params,isNotAny) : string{
    if(!this.anyFilters.salaryType.checked || (isNotAny=='salaryType' && this.anyFilters.salaryType.checked)){
       this.anyFilters.salaryType.checked = false;
        let salaryParam = '';
        let paramIndex = 0;
        for(let i = 0; i < this.salaries.length; i++){
          if(this.salaries[i].checked) {
            salaryParam += this.salaries[i].end!=0 ?
            `salaries[${paramIndex}]=${this.salaries[i].start}-${this.salaries[i].end}&` :
            `salaries[${paramIndex}]=${this.salaries[i].start}-&`;
            paramIndex++;
          }
        }
        params +=salaryParam;
     }else{
       this.salaries = this.salaries.map((salary,i)=>{
         salary.checked = false;
         return salary;
       });
     }
     return params;
  }

  appendSortParam(params) : string {
    if(this.selectedSortBy) {
      let sortObj = this.sortByOptions.find((item)=>item.orderType==this.selectedSortBy);
      params += `OrderBy=${sortObj.orderBy}&orderType=${this.selectedSortBy}&`;
    }
    return  params;
  }

  search(isAny){
    this.isLoading = true;
    if(isAny!='all') {
      this.filters.experience = "";
    }
     let params = '?page='+this.pageObj.page+'&';
     params += (this.filters.what!="" && this.filters.what!=null) ? 'what='+this.filters.what+'&' : '';
     params += (this.filters.where!="" && this.filters.where!=null) ? 'where='+this.filters.where+'&' : '';

     params = this.appendJobTypeParam(params,isAny);
     params = this.appendExpTypeParam(params,isAny);

     params += (this.filters.company_size!="" && this.filters.company_size!=null) ? 'company_size='+this.filters.company_size+'&' : '';

     if(this.filters.categories!='AllCategories') {
       params += (this.filters.categories!="" && this.filters.categories!=null) ? 'categories[0]='+this.filters.categories+'&' : '';
       params += (this.filters.category_ids!="" && this.filters.category_ids!=null) ? 'category_ids='+this.filters.category_ids+'&' : '';
     }

     params = this.appendSkillsParam(params,isAny);
     params = this.appendSalaryParam(params,isAny);
     params = this.appendSortParam(params);

     params = params[params.length-1]=="&" ? params.slice(0,params.length-1) : params;
     this.searched = true;

     this.publicJobService.searchJobsByFilters(params).then(
       data => this.handleSuccess(data),
       err => this.handleError(err));
  }

  exampleData = [];
  options = {
		multiple: false
  };

  handleSuccess(data)
  {
    this.jobs = data.data.jobs.data;
    this.pageObj.pageSize = data.data.jobs.per_page;
    this.pageObj.totalElements = data.data.jobs.total;

    //this.updateSkillsFilter(data.data.skills.data);

    //this.updateSalariesFilter(data.data.salaries);

    //this.updateJobTypeFilter(data.data.jobTypes);

    //this.updateExpTypeFilter(data.data.experienceTypes);

    //this.updateSortByFilter(data.data.sort);





		this.isFiltersCleared  = false;
    this.isSalarySelected  = false;
    this.isSkillSelected   = false;
    this.isJobTypeSelected = false;


    this.isLoading = false;
  }

  handleError(error){
     console.log(error);
     this._ErrorService.flashMessage( {'type': 'error', 'messages': error.error } );
     this.isLoading = false;
   }

  searchJob(categoryName){
  	this.router.navigate(['/jobs'],{queryParams: {categories: categoryName } });
  }

  handleFileInput(files: FileList) {
    this.fileName = files.item(0).name;
    this.resumeToUpload = files.item(0);
  }

  pageChange(selectedPage){
    window.scroll(0,0);
    this.pageObj.page = selectedPage;
    if(this.searched) {
      this.search('all');
    }else{
      this.getJobs();
    }
  }

  updateSkillsFilter(updatedSkills){
    let newSkills = [];
    updatedSkills.map((item1,i)=>{
      let obj = this.skills.filter((item2)=>
        (item2.skills[0].name==item1.skills[0].name && item2.checked));
      item1.checked = obj.length!=0 ? true : false;
       newSkills.push(item1);
     });
    this.skills = newSkills;
  }

  updateSalariesFilter(updatedSalaries){
    let newSalaries = [];
     updatedSalaries.map((item1,i)=>{
      let obj = this.salaries.filter((item2)=>
        (item2.start==item1.start && item2.end==item1.end && item2.checked));
      item1.checked = obj.length!=0 ? true : false;
       newSalaries.push(item1);
     });
    this.salaries = newSalaries;
  }

  updateJobTypeFilter(updatedJobTypes){
    let newjobTypes = [];
     updatedJobTypes.map((item1,i)=>{
      let obj = this.jobTypes.filter((item2)=>(item2.job_type==item1.job_type && item2.checked));
      item1.checked = obj.length!=0 ? true : false;
       newjobTypes.push(item1);
     });
    this.jobTypes = newjobTypes;
  }

  updateExpTypeFilter(updatedExp){
    let newExp = [];
    updatedExp.map((item1,i)=>{
      let obj = this.experienceTypes.filter((item2)=>(item2.type==item1.type && item2.checked));
      item1.checked = obj.length!=0 ? true : false;
      newExp.push(item1);
    });
    this.experienceTypes = newExp;
  }

  updateSortByFilter(newVal){
    this.sortByOptions = newVal;
    this.selectedSortBy = !this.selectedSortBy ? newVal[0].orderType : this.selectedSortBy;
  }

  clearFilters(){
    this.isFiltersCleared = true;
    this.filters.what = '';
    this.filters.where = '';
    this.filters.categories = '';
    this.filters.experience = '';
    this.filters.company_size = '';
    this.anyFilters.jobType.checked = true;
    this.anyFilters.experienceType.checked = true;
    this.anyFilters.salaryType.checked = true;
    this.anyFilters.skillType.checked = true;
    if(!this.isAllJobRoute) {
      this.router.navigateByUrl("/jobs");
    }else{
      this.search("all");
    }

    // this.getJobs();
  }

  goToJob(jobSlug){
    this.router.navigate(['/jobs/'+jobSlug]);
  }

  toggleSavedJob(id){

  }

  openApplyForm(job){
  
    localStorage.setItem("job_id", job.id);
    localStorage.setItem("job_title", job.title);
    localStorage.setItem("job_description", job.description);
    localStorage.setItem("job_slug", job.slug);
    //this.router.navigate(['upload-resume/'+job.slug]);
    this.googleAnalyticsService.emitEvent(this.clientId,job.organization_id,"click", "apply_start", this.href, job.id);
     this.isApplied = false;
     let index = this.jobs.findIndex(j=>j.id==job.id);
     this.selectedJob = this.jobs[index];
    
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

    this.fileUploadService.postResumeToJobNew(requestedBody.resume, this.selectedJob.slug, requestedBody.first_name, requestedBody.last_name, requestedBody.email).subscribe(
      data => this.handleSuccessUploadResume(data),
      error => this.handleErrorUploadResume(error)
    );

    /*this.publicJobService.applyForJob(this.selectedJob.id,requestedBody).then((response:any)=>{
      this.isLoading = false;
      this.isApplied = true;
      this.applyJobForm.reset();
      this.resumeToUpload = null;
    },error=>{
      this.isLoading = false;
      this.isApplied = false;
      this.isFormError = true;
      this.applyJobForm.reset();
      this.resumeToUpload = null;
      this.errorMsg = error.error.msg[0];
    });*/

  }

  verifyUrl = environment.baseApiUrlClient+"/jobs/";
  code = '';
  verifyCode(){
    this.isLoading = true;
    return this.http.post(this.verifyUrl+this.selectedJob.slug+"/verify",
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

          window.open( 'candidate/job-questions/' + this.selectedJob.id, '_self');
      }
      else
        window.open( data.data.redirect_url, '_self');
    }

  }

  handleVerifyError(error){
    this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
    this.isLoading = false;
    console.log(error);
  }

  step2 = false;
  handleSuccessUploadResume(data) {
    //console.log(data);

    this.googleAnalyticsService.emitEvent(this.clientId,this.selectedJob.organization_id,"click", "submit", this.href, this.selectedJob.id);
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
    //this.step2 = true;
    this.isLoading = false;

    //console.log(data);
		//this.Token.handle(data.data.token);

    /*localStorage.removeItem('is_client');
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
    localStorage.setItem('profile_picture', data.data.user.meta.profilePictureFullUrl);*/
    //this._ErrorService.flashMessage({'type': 'success', 'messages': data.msg } );

    //this.isLoading = false;
    //console.log(data);
    if (data.data.redirect_url == 'your-organizations') {
      this.router.navigateByUrl('your-organizations');
    }/*else{
      if(data.data.user.type == 'candidate')
      {
        localStorage.setItem('saved_jobs_count', '0');
        localStorage.setItem('notifications_count', '0');
        localStorage.setItem('setup_password', 'false');

           localStorage.setItem('email', data.data.user.email);
          window.open( 'candidate/job-questions/' + this.selectedJob.id, '_self');
      }
      else
        window.open( data.data.redirect_url, '_self');
    }*/

    if(data.data.questions==true){
      localStorage.setItem('uuid', data.data.uuid);
      window.open( 'job-questions/'+localStorage.getItem('job_slug'), '_self');
      //this.router.navigateByUrl('job-questions/'+localStorage.getItem('job_slug'));
    }
    else
      window.open('/submission-success?job_slug='+localStorage.getItem('job_slug'));
    //this.router.navigateByUrl('/applyStep/' + this.job_slug + '/' + data.data.resume.id);
  }

  handleErrorUploadResume(error) {
    this.errorMsg = error.error.msg[0];
    this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
    this.isLoading = false;
  }

  getAddress(place: object) {
		this.filters.where = place['formatted_address'];
  }

  onValueChange(newValue) {
    //alert(newValue);
    this.filters.where = newValue;
}

@HostListener('window:beforeunload', ['$event'])
    unloadNotification($event: any) {
        if (this.isLoading) {
            $event.returnValue =true;
        }
    }

}
