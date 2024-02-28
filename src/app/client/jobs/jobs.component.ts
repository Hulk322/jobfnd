import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClientJobService } from 'src/Services/client/job.service';
//import { Observable } from 'rxjs/Observable';
//import { mergeMap, catchError } from 'rxjs/operators';
import { ErrorService } from 'src/Services/shared/error.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class ClientJobsComponent implements OnInit {

  private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
	private httpOptions = {
		headers: this.headers_object
	};

  constructor(
    private _JobService: ClientJobService,
    private router: Router,
    private _ErrorService: ErrorService,
    private http: HttpClient
  ) { }

  jobs: any;
  template_post_url = environment.baseApiUrlClient + '/client/jobs/template';
  error: any = false;
  isLoading = false;
  isSaveTemplate = false;
  view_type = "grid";
  search_keyword = '';
  pageObj ={
    page : 1,
    pageSize: 10,
    totalElements : 0
  }


  job = {
    id: null,
  };

  job_delete = {
    reason : null,
    notes : null,
  }

  ngOnInit() {
    this.isLoading = true;
    this.getJobs();
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
    this.job_delete.reason = '';
    this.job_delete.notes = '';
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
    this.isLoading = false;
  }

  getJobs(){
    this._JobService.getActiveJobs(this.pageObj.page)
    .subscribe(
      data => this.handleSuccess(data),
      error => this.handleError(error)
    );
  }

  searchJobs(event: any){
    this.isLoading = true;
    this._JobService.searchInActiveJobs(this.search_keyword)
      .subscribe(
        data => this.handleSuccess(data),
        error => this.handleError(error)
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

  goToView(job_id) {
    this.router.navigateByUrl('/client/job/'+job_id);
  }

  goToSubmissions() {
		this.router.navigateByUrl('/client/submissions');
	}

  pageChange(selectedPage){
    window.scroll(0,0);
    this.pageObj.page = selectedPage;
    if(this.search_keyword!='') {
      this.searchJobs(this.search_keyword);
    }else{
      this.getJobs();
    }
  }

  saveAsTemplate(job){
    this.isSaveTemplate = true;

		let formData = new FormData();



		for (var key in job) {
			formData.append(key, job[key]);
		}

		formData.set('start_date', this.formatDate(job.start_date));
		formData.set('tentative_end_date', this.formatDate(job.tentative_end_date));

		//formData.append('description_document', this.fileToUpload);


		/* for (var key in job.skills) {
			var obj = job.skills[key];

			if (obj) {
				formData.append('skills[]', obj);
			}
		} */

		//benefits
		for (var key in job.benefits) {
			var obj = job.benefits[key];
			if(obj.checked==true)
				formData.append("benefits[]", obj.id);
		}





		return this.http.post(this.template_post_url, formData, this.httpOptions).subscribe(
			data => this.handleSuccessTemplateCreate(data),
			error => this.handleError(error)
		);
  }

  handleSuccessTemplateCreate(data) {
		this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
		//this.resetFormJobData();
		this.isSaveTemplate = false;
		//this.router.navigateByUrl('/client/templates', data.msg.msg);
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




}
