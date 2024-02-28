import { Component, OnInit } from '@angular/core';
import { SubmissionsService } from 'src/Services/admin/submissions.service';
import { ErrorService } from 'src/Services/shared/error.service';
import { Router , ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-submissions',
  templateUrl: './submissions.component.html',
  styleUrls: ['./submissions.component.css']
})
export class SubmissionsComponent implements OnInit {

	isLoading = false;
	submissions= [];

  pageObj ={
    page : 1,
    pageSize: 15,
    totalElements : 0
  };
  search_keyword = '';
  id;
  sub;
  type;

	constructor(
				private _submissionsService: SubmissionsService,
				private _ErrorService: ErrorService,
        private route: ActivatedRoute,
        private router: Router,
				) { }

  ngOnInit() {
    this.isLoading = true;


    this.sub    = this.route.params.subscribe(params => {
    this.id = params['id']; // (+) converts string 'id' to a number
    this.sub    = this.route.queryParams.subscribe(params => {
    this.type   = params['type'];

    if(this.type === 'job_submissions') {
      return this._submissionsService.submissionsByJobId(this.id).subscribe(
        data  => this.handleSubmissionsSuccess(data),
        error => this.handleError(error)
      );
    }else if(this.type === 'client_submissions'){
      return this._submissionsService.submissionsByClientId(this.id).subscribe(
        data  => this.handleSuccess(data),
        error => this.handleError(error)
      );
    }else{
      return '';
    }
     });
   });
  	this.getSubmissions();
  }

  handleSubmissionsSuccess(data) {
    this.submissions = data.data.submissions;
  }

  getSubmissions() {
    this.isLoading = true;
    if(this.type !== 'job_submissions' && this.type !== 'client_submissions') {
      this._submissionsService.get(this.pageObj.page, this.search_keyword).subscribe(
        data   => this.handleSuccess(data),
        error   => this.handleError(error),
        );
    }

  }

  handleSuccess(data) {
    this.submissions = data.data.submissions.data;
    this.pageObj.pageSize = data.data.submissions.per_page;
    this.pageObj.totalElements = data.data.submissions.total;
    this.isLoading  = false;
  }

  handleError(error) {
    this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
    this.isLoading = false;
  }

  delete(id, submission) {
    let answer = confirm('Are you sure you want to delete this submission?');
    if(answer) {
      this.isLoading = true;
      submission.deleted = true;
      for (let i = 0; i < this.submissions.length; ++i) {
        if (this.submissions[i].id === id) {
          this._submissionsService.delete(id)
            .subscribe(
              data => this.handleDeleteSuccess(data, i),
              error => this.handleError(error)
            );
        }
      }
    }
  }

  handleDeleteSuccess(data, i){
    this.submissions.splice(i, 1);
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
  }


  pageChange(selectedPage){
    window.scroll(0, 0);
    this.pageObj.page = selectedPage;
    this.getSubmissions();
  }
  viewSubmissionDetail(id) {
    this.router.navigate(['admin/submissions/'+id]);
  }
  selectSubmission(id) {
    this.router.navigate(['admin/interviews/submissions'+"/"+id], {queryParams:{'type':'submission_interviews'}});
  }
  selectoffer(id) {
    this.router.navigate(['admin/offers/submissions'+"/"+id], {queryParams:{'type':'submission_offers'}});
  }
}
