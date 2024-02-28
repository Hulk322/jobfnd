import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JobsService } from 'src/Services/candidate/jobs.service';
import { ErrorService } from 'src/Services/shared/error.service';

@Component({
  selector: 'app-my-jobs',
  templateUrl: './my-jobs.component.html',
  styleUrls: ['./my-jobs.component.css']
})
export class MyJobsComponent implements OnInit {

  constructor(
    private _JobService: JobsService,
    private router: Router,
    private _ErrorService: ErrorService
  ) { }

  jobs: any;
  selectedSortBy = 'desc';
  total_jobs = 0;
  error: any= false; 
  what = '';
  where = '';
  categories : any;
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
  new_saved_count=localStorage.getItem('saved_jobs_count');

  ngOnInit() {

    this.isLoading = true;

    if(localStorage.getItem('is_candidate'))
      this.isCandidateLoggedIn = true;
    else
      this.isCandidateLoggedIn = false;

    this.full_name = localStorage.getItem("full_name"); 
    this.profile_picture = localStorage.getItem("profile_picture");
    
    /*this._JobService.getJobs()
        .subscribe( 
          data => this.handleSuccess(data),
         err => this.handleError(err)
         //() => console.log('ok')
      );*/

      this.showSavedJobs();
     
  }

  current_tab = "saved_jobs";
  saved_jobs = [];
  view_type = "grid";
  pageObj ={
    page : 1,
    pageSize: 10,
    totalElements : 0
  };

  showSavedJobs(){
    this.current_tab = "saved_jobs";
    this.isLoading = true;
    this._JobService.getSavedJobs(this.pageObj.page)
        .subscribe( 
          data => this.handleSavedJobsSuccess(data),
         err => this.handleError(err)
         //() => console.log('ok')
      );
  }

  handleSavedJobsSuccess(data)
  {
      this.saved_jobs = data.data.savedJobs.data;
      this.pageObj.pageSize = data.data.savedJobs.per_page;
      this.pageObj.totalElements = data.data.savedJobs.total;
      this.isLoading = false;
  }

  handleSuccess(data)
  {
    console.log(data.data.jobs.data);
    this.jobs = data.data.jobs.data;
    this.total_jobs = data.data.jobs.total;

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

  pageChange(selectedPage){
    this.pageObj.page = selectedPage;
    this.showSavedJobs();
  }

  handleError(error){
    this.isLoading = false;
   }

   goToJob(job_id){
    this.router.navigate(['/candidate/job-questions/'+job_id]);
  }

  oneClickApplyToJob(job_id){
    this.router.navigate(['/candidate/job-questions/'+job_id]);
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

  search(){
    console.log(this.job_type_0);
    this.jobs = [];
    var direct_hire = '';
    var temp_hire = '';
    if(this.job_type_0 == true)
      direct_hire = 'Full Time';
    if(this.job_type_1 == true)
      temp_hire = 'Temp Hire';
    this._JobService.searchJobs(this.what, this.where, direct_hire, temp_hire, 
                                this.company_size, this.categories, this.selectedSortBy)
        .subscribe( 
          data => this.handleSuccess(data),
         err => this.handleError(err)
         //() => console.log('ok')
      );
  }

  applyToJob(job_id){
    this._JobService.applyToJob(job_id)
        .subscribe( 
          data => this.handleJobApplySuccess(data),
         err => this.handleJobApplyError(err)
         //() => console.log('ok')
      );
  }

  handleJobApplySuccess(data)
  {
    var job = this.jobs.find(x => x.id === data.data.job.id);
    console.log(job);
    job.hasApplied=true;
    this._ErrorService.flashMessage({'type': 'success', 'messages': data.msg } );
  }

  handleJobApplyError(error){
     console.log(error);
     this._ErrorService.flashMessage( {'type': 'error', 'messages': error.error } );
   }

   getAddress(place: object) {
    this.where = place['formatted_address'];
}

}
