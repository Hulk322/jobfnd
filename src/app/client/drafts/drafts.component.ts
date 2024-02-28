import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClientJobService } from 'src/Services/client/job.service';
import { ErrorService } from 'src/Services/shared/error.service';

@Component({
  selector: 'app-drafts',
  templateUrl: './drafts.component.html',
  styleUrls: ['./drafts.component.css']
})
export class DraftsComponent implements OnInit {

  constructor(
    private _JobService: ClientJobService,
    private router: Router,
    private _ErrorService: ErrorService
  ) { }

  jobs: any;
  search_keyword = '';
  pageObj ={
    page : 1,
    pageSize: 10,
    totalElements : 0
  }
  isLoading = false;
  job = {
    id: null,
  };
  job_delete = {
    reason : null,
    notes : null,
  }

  ngOnInit() {

    this.isLoading = true;
    this.getDrafts();


  }

  getDrafts(){
    this._JobService.getDrafts(this.pageObj.page)
      .subscribe(
        data  => this.handleSuccess(data),
        error => this.handleError(error)
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
              data  => this.handleDeleteSuccess(data, i),
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
    this.pageObj.pageSize = data.data.jobs.per_page;
    this.pageObj.totalElements = data.data.jobs.total;
    this.isLoading = false;
  }

   handleError(error) {
    this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
    this.isLoading = false;
  }


  searchDrafts(event: any){
    this._JobService.searchInDrafts(this.search_keyword)
      .subscribe(
        data => this.handleSuccess(data),
        error => this.handleError(error)
        //() => console.log('ok')
      );
  }

  pageChange(selectedPage){
    window.scroll(0,0);
    this.pageObj.page = selectedPage;
    if(this.search_keyword!='') {
      this.searchDrafts(this.search_keyword);
    }else{
      this.getDrafts();
    }
  }

}
