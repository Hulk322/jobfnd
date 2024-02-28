import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClientJobService } from 'src/Services/client/job.service';
import { ErrorService } from 'src/Services/shared/error.service';

@Component({
  selector: 'app-jobs-archives',
  templateUrl: './jobs-archives.component.html',
  styleUrls: ['./jobs-archives.component.css']
})
export class JobsArchivesComponent implements OnInit {

  constructor(
    private _JobService: ClientJobService,
    private router: Router,
    private _ErrorService: ErrorService
  ) { }

  jobs: any;
  error: any = false;
  isLoading = false;
  pageObj ={
    page : 1,
    pageSize: 10,
    totalElements : 0
  };

  job = {
    id: null,
  };
  job_delete = {
    reason : null,
    notes : null,
  }
  search_keyword = "";

  ngOnInit() {

    this.isLoading = true;
    this._JobService.getArchives(this.pageObj.page)
      .subscribe(
        data  => this.handleSuccess(data),
        error => this.handleError(error)
        //() => console.log('ok')
      );


  }
  selectJob(job){
    this.job  = Object.assign({}, job);
  }

  deleteJob(id, job) {
      job.deleted = true;
      for (let i = 0; i < this.jobs.length; ++i) {
        if (this.jobs[i].id === id) {
          this._JobService.deleteJob(id, this.job_delete)
            .subscribe(
              data => this.handleDeleteSuccess(data, i),
              error => this.handleError(error)
            );

        }
      }
  }
  handleDeleteSuccess(data, i){
    this.jobs.splice(i, 1);
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
  }

  handleSuccess(data) {
    this.jobs = data.data.jobs.data;
    this.isLoading = false;
  }

   handleError(error) {
    this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
    this.isLoading = false;
  }

    searchJobs(event: any){
    this.isLoading = true;
    this._JobService.searchInArchives(this.search_keyword)
      .subscribe(
        data => this.handleSuccess(data),
        error => this.handleError(error)
      );
  }

}
