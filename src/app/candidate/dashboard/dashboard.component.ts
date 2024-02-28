import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { JobsService } from 'src/Services/candidate/jobs.service';
import { PublicJobService } from 'src/Services/public_portal/public-job.service';
import { ErrorService } from 'src/Services/shared/error.service';
import {environment} from 'src/environments/environment';

@Component({
  selector: 'app-candidate-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(
    private _JobService: JobsService,
    private publicJobService: PublicJobService,
    private router: Router,
    private route: ActivatedRoute,
    private http:HttpClient,
    private _ErrorService: ErrorService
  ) { }

  jobs: any;
  total_jobs = 0;
  error: any = false;
  what = '';
  where = '';
  categories: any;
  job_type_0 = true;
  job_type_1 = true;
  company_size = "0-10";
  
  all_categories;
  stats;
  score:any = 0;
  exampleData = [];
  options = {
    multiple: true
  }
  placeholder = "Choose Location";
  full_name = "";
  profile_picture = "";
  isCandidateLoggedIn = false;
  isLoading = false;
  view_type = "grid";
  new_saved_count=localStorage.getItem('saved_jobs_count');

  profileUrl =  environment.baseApiUrl+"/candidate/profile";
  searchJobsUrl =  environment.baseApiUrl+"/candidate/jobs/search";

  private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
  private httpOptions = {
    headers: this.headers_object
  };
  searched = false;
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

  pageObj ={
    page : 1,
    pageSize: 10,
    totalElements : 0
  }

  routeSub : any;

  ngOnInit() {
    this.isLoading = true;
    if(localStorage.getItem('is_candidate'))
      this.isCandidateLoggedIn = true;
    else
      this.isCandidateLoggedIn = false;

    this.full_name = localStorage.getItem("full_name");
    this.profile_picture = localStorage.getItem("profile_picture");

    /*this._JobService.getStats()
      .subscribe(
        data => this.handleGetStatsSuccess(data),
        err => this.handleError(err)
        //() => console.log('ok')
      );*/

      

      

      this.routeSub = this.route
      .queryParams
      .subscribe(params => {
        if(Object.keys(params).length != 0 && params.constructor === Object) {
          this.current_action = 'search';
          // this.isFiltersCleared = true;
          this.filters.what = '';
          this.filters.where = '';
          this.filters.categories = '';
          this.filters.company_size = '';
          for (let key in params) {
            this.filters[key] = params[key];
          }
          //this.isAllJobRoute = false;
          let profileStats = sessionStorage.getItem('profileStats');
          if(profileStats) 
          {
            console.log('main sub---2');
            this.stats = JSON.parse(profileStats);
            //console.log(this.stats['applied']);
          }
          if(localStorage.getItem('score'))
            this.score = localStorage.getItem('score');
          this.search('all');
          
        }else{
          //this.isAllJobRoute = true;
          this.current_action = 'search';
          console.log('in clear filters');
          //this.clearFilters();
          this.getProfileData();
        }
      });

      /*return this.http.get(this.profileUrl, this.httpOptions).subscribe(
        data => this.handleSuccess(data),
        error => this.handleError(error)
      );*/


  }

  search(isAny){
    this.isLoading = true;
    if(isAny!='all') {
      this.filters.experience = "";
    }
     let params = '?page='+this.pageObj.page+'&';
     params += (this.filters.what!="" && this.filters.what!=null) ? 'what='+this.filters.what+'&' : '';
     params += (this.filters.where!="" && this.filters.where!=null) ? 'where='+this.filters.where+'&' : '';
     
     //params = this.appendJobTypeParam(params,isAny);
     //params = this.appendExpTypeParam(params,isAny);

     params += (this.filters.company_size!="" && this.filters.company_size!=null) ? 'company_size='+this.filters.company_size+'&' : '';
     
     if(this.filters.categories!='AllCategories') {
       params += (this.filters.categories!="" && this.filters.categories!=null) ? 'categories[0]='+this.filters.categories+'&' : '';
       params += (this.filters.category_ids!="" && this.filters.category_ids!=null) ? 'category_ids='+this.filters.category_ids+'&' : '';
     }

     //params = this.appendSkillsParam(params,isAny);
     //params = this.appendSalaryParam(params,isAny);
     //params = this.appendSortParam(params);
     
     params = params[params.length-1]=="&" ? params.slice(0,params.length-1) : params;
     this.searched = true;

     return this.http.get(this.searchJobsUrl+"?page="+this.pageObj.page+"&what="+this.filters.what+"&where="+this.filters.where, this.httpOptions).subscribe(
      data => this.handleJobsSearchSuccess(data),
      error => this.handleError(error)
    );

     /*this.publicJobService.searchJobsByFilters(params).then(
       data => this.handleSuccess(data),
       err => this.handleError(err));*/
  }

  clearFilters(){
    this.filters.what = '';
    this.filters.where = '';
    this.filters.categories = '';
    this.filters.experience = '';
    this.filters.company_size = '';
    this.search("all");
  }

  getProfileData(){
    return this.http.get(this.profileUrl, this.httpOptions).subscribe(
      data => this.handleSuccess(data),
      error => this.handleError(error)
    );
  }

  oneClickApplyToJob(job_id){
    this.router.navigate(['/candidate/job-questions/'+job_id]);
  }

  handleSuccess(data) {
    this.score = data.data.profileCompleteness.score;
    localStorage.setItem('score', this.score);
    this.stats = data.data.profileStats;
    this.jobs = data.data.recommendedJobs.data;
    this.pageObj.pageSize = data.data.recommendedJobs.per_page;
    this.pageObj.totalElements = data.data.recommendedJobs.total;
    this.isLoading = false;
  }

  handleJobsSearchSuccess(data) {
    this.jobs = data.data.jobs.data;
    this.pageObj.pageSize = data.data.jobs.per_page;
    this.pageObj.totalElements = data.data.jobs.total;
    this.isLoading = false;
  }

  current_action="normal";

  pageChange(selectedPage){
    this.pageObj.page = selectedPage;
    if(this.current_action=="normal")
      this.getProfileData();
    else
      this.search('any');
  }

  handleGetStatsSuccess(data) {
    this.stats = data.data.profileStats;
    console.log(this.stats);
  }

  handleError(err) {
    console.log(err);
  }

  toggleSavedJob(job_id){
    this._JobService.toggleSavedJob(job_id)
    .subscribe(
      data => this.handleToggleSavedJobSuccess(data, job_id),
      err => this.handleJobApplyError(err)
      //() => console.log('ok')
    );
  }

  handleToggleSavedJobSuccess(data, job_id){
    //var job = this.jobs.find(x => x.id === job_id);
    
    //if(job.saved == 1)
      //job.saved = 0;
    //else
      //job.saved = 1;
    this.new_saved_count = data.data.saved_jobs;
    localStorage.setItem('saved_jobs_count', this.new_saved_count);
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
  }

  /*search() {
    console.log(this.job_type_0);
    this.jobs = [];
    var direct_hire = '';
    var temp_hire = '';
    if (this.job_type_0 == true)
      direct_hire = 'Direct Hire';
    if (this.job_type_1 == true)
      temp_hire = 'Temp Hire';
    this._JobService.searchJobs(this.what, this.where, direct_hire, temp_hire, this.company_size, this.categories)
      .subscribe(
        data => this.handleSuccess(data),
        err => this.handleError(err)
        //() => console.log('ok')
      );
  }*/

  applyToJob(job_id) {
    this._JobService.applyToJob(job_id)
      .subscribe(
        data => this.handleJobApplySuccess(data),
        err => this.handleJobApplyError(err)
        //() => console.log('ok')
      );
  }

  handleJobApplySuccess(data) {
    var job = this.jobs.find(x => x.id === data.data.job.id);
    console.log(job);
    job.hasApplied = true;
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
  }

  handleJobApplyError(error) {
    console.log(error);
    this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
  }

  getAddress(place: object) {
    this.where = place['formatted_address'];
  }

  goToJob(id) {
    this.router.navigate(['/candidate/job-questions/' + id]);
  }

}
