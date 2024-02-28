import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JobService } from 'src/Services/vendor/job.service';
import { Observable } from 'rxjs/Observable';
import { mergeMap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class JobsComponent implements OnInit {

  constructor(
    private _JobService: JobService,
    private router: Router
  ) { }

  jobs: any;
  error: any= false;
  search_keyword = '';
  isLoading = false;
  pageObj ={
    page : 1,
    pageSize: 10,
    totalElements : 0
  }
  ngOnInit() {
    this.getJobs();   
  }

  getJobs(){
    this.isLoading = true;
    this._JobService.getJobs()
      .subscribe( 
        data => this.handleSuccess(data),
       err => this.handleError(err)
    );
  }

  searchJobs(event: any){
    this.isLoading = true;
    this._JobService.searchJobs(this.search_keyword)
      .subscribe(
        data => this.handleSuccess(data),
        err => this.handleError(err)
      );
  }

  handleSuccess(data)
  {
    this.jobs = data.data.jobs.data;
    this.pageObj.pageSize = data.data.jobs.per_page;
    this.pageObj.totalElements = data.data.jobs.total;
    this.isLoading = false;
  }

  handleError(err){
     console.log(err);
   }

  goToView(job_id) {
    this.router.navigateByUrl('/vendor/job/'+job_id);
  }

  pageChange(selectedPage){
    this.pageObj.page = selectedPage;
    if(this.search_keyword!='') {
      this.searchJobs(this.search_keyword);
    }else{
      this.getJobs();
    }
  }
}
