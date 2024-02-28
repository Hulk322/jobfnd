import { Component, OnInit } from '@angular/core';
import { JobsService } from 'src/Services/admin/jobs.service';
import { ErrorService } from 'src/Services/shared/error.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class JobsComponent implements OnInit {

	isLoading = false;
  	jobs = [];
    search_keyword = "";

  pageObj ={
    page : 1,
    pageSize: 15,
    totalElements : 0
  };

   job = {
    id: null,
    title: null,
    description: null,
  };

  job_delete = {
    reason : null,
    notes : null,
  }

  constructor(	
  		private _JobsService: JobsService,
  		private _ErrorService: ErrorService,
      private router: Router,
  		) { }

  	ngOnInit() {
 	 	this.getJobs(); 
  	}

   getJobs(){

    this.isLoading = true;
    this._JobsService.get(this.pageObj.page, this.search_keyword)
      .subscribe(
        data => this.handleSuccess(data),
        err => this.handleError(err)
      );
  }

   handleSuccess(data) {
    this.jobs = data.data.jobs.data;
    this.pageObj.pageSize = data.data.jobs.per_page;
    this.pageObj.totalElements = data.data.jobs.total;
    this.isLoading = false;
  	}

   handleError(error) {
    this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
    this.isLoading = false;
  }

  pageChange(selectedPage){
    window.scroll(0, 0);
    this.pageObj.page = selectedPage;
    this.getJobs();
  }
  // Job view
  selectJob(job){
  	// alert('hi');
    this.job  = Object.assign({}, job);
  }

  // delete job
  deleteJob(id, job){
   
      this.isLoading = true;
      job.deleted = true;
      for (let i = 0; i < this.jobs.length; ++i) {
        if (this.jobs[i].id === id) {
          this._JobsService.delete(id, this.job_delete)
            .subscribe(
              data => this.handleDeleteSuccess(data, i),
              err => this.handleError(err)
            );
        }
      
    }
  }

   handleDeleteSuccess(data, i){
    this.jobs.splice(i, 1);
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
  }


  jobInterveiw(id) {
    this.router.navigate(['admin/interviews/jobs' + "/" +id], {queryParams:{'type':'job_interviews'}});
  }

  jobSubmission(id) {
    this.router.navigate(['admin/submissions/jobs' + "/" + id], {queryParams:{type:'job_submissions'}});
  }

  jobOffer(id) {
    this.router.navigate(['admin/offers/jobs'+"/"+id], {queryParams:{type:'job_offer'}});
  }

}
