import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JobsService } from 'src/Services/candidate/jobs.service';
import { ErrorService } from 'src/Services/shared/error.service';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-accepted-jobs',
  templateUrl: './accepted-jobs.component.html',
  styleUrls: ['./accepted-jobs.component.css']
})
export class AcceptedJobsComponent implements OnInit {

  constructor(
    private _JobService: JobsService,
    private router: Router,
    private _ErrorService: ErrorService,
    private http: HttpClient,
  ) { }

  jobs: any;
  selectedSortBy = 'desc';
  total_jobs = 0;
  error: any = false;
  what = '';
  where = '';
  categories: any;
  job_type_0 = true;
  job_type_1 = true;
  company_size = "0-10";
  isLoading = false;
  all_categories;
  exampleData = [];
  options = {
    multiple: true
  }
  placeholder = "Choose Location";
  full_name = "";
  profile_picture = "";
  isCandidateLoggedIn = false;
  view_type = "grid";

  pageObj ={
    page : 1,
    pageSize: 15,
    totalElements : 0
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

  statsUrl = environment.baseApiUrl + "/candidate/profile/stats";
  submission_status  = environment.array;
  ngOnInit() {

    this.submission_status; 
    

    if (localStorage.getItem('is_candidate'))
      this.isCandidateLoggedIn = true;
    else
      this.isCandidateLoggedIn = false;

    this.full_name = localStorage.getItem("full_name");
    this.profile_picture = localStorage.getItem("profile_picture");

    this.getAppliedJobs();

    return this.http.get(this.statsUrl).subscribe(
      data => this.handleSuccessStats(data),
      error => this.handleError(error)
    );

  }

  getAppliedJobs(){
    this.isLoading = true;
    this._JobService.getAcceptedJobs(this.pageObj.page)
      .subscribe(
        data => this.handleSuccess(data),
        err => this.handleError(err)
      );
  }


  saved_jobs = [];


  handleSuccess(data) {
    
    this.jobs = data.data.jobs.data;
    this.total_jobs = data.data.jobs.total;
    this.pageObj.pageSize = data.data.jobs.per_page;
    this.pageObj.totalElements = data.data.jobs.total;

    for (var key in data.data.categories) {
      var obj = data.data.categories[key];
      this.exampleData.push({
        id: obj.id,
        text: obj.name
      });
    }
    this.all_categories = this.exampleData;
    this.isLoading = false;
  }

  handleError(error) {
    this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
    this.isLoading = false;
  }

  goToJob(jobSlug) {
    this.router.navigate(['/jobs/' + jobSlug]);
  }

  oneClickApplyToJob(jobSlug) {
    this.router.navigate(['/candidate/job-questions/' + jobSlug]);
  }



  search() {
    console.log(this.job_type_0);
    this.jobs = [];
    var direct_hire = '';
    var temp_hire = '';
    if (this.job_type_0 == true)
      direct_hire = 'Full Time';
    if (this.job_type_1 == true)
      temp_hire = 'Temp Hire';
    this._JobService.searchJobs(this.what, this.where, direct_hire, temp_hire,
      this.company_size, this.categories, this.selectedSortBy)
      .subscribe(
        data => this.handleSuccess(data),
        err => this.handleError(err)
        //() => console.log('ok')
      );
  }

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
    this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
    this.isLoading = false;
  }

  getAddress(place: object) {
    this.where = place['formatted_address'];
  }

  pageChange(selectedPage){
    this.pageObj.page = selectedPage;
    this.getAppliedJobs();
  }
    handleSuccessStats(data) {
    this.profileStats = data.data.profileStats; 
    sessionStorage.setItem('profileStats', JSON.stringify(this.profileStats));
    //console.log(this.profileStats);
  }

}
