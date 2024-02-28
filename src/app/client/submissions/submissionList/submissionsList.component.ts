import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { InterviewModalComponent }  from 'src/app/client/interviews/interview-modal/interview-modal.component';
import { SubmissionService } from 'src/Services/client/submission.service';
import { ErrorService } from 'src/Services/shared/error.service';

@Component({
  selector: 'app-submissions-list',
  templateUrl: './submissionsList.component.html',
  styleUrls: ['./submissionsList.component.css']
})
export class SubmissionsListComponent {
@Input() submissionsData: any[];
  
  defaultSkillsLength : number = 2;
  showAllSkills : boolean = false;
  submissionAcceptUrl = environment.baseApiUrlClient+"/client/submissions/";
  submissionRejectUrl = environment.baseApiUrlClient+"/client/submissions/";
  private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
  private httpOptions = {
    headers: this.headers_object
  };

  pageObj ={
    page : 1,
    pageSize: 10,
    totalElements : 0
  }

  sidebar_open = false; 
  show_modal = false;
  current_submission;
  @Input() locations: [];
  isLoading = false;

  @ViewChild(InterviewModalComponent, { static: true })
  private interviewModalComponent: InterviewModalComponent;

  togglesidebar(submission, event) {
    this.current_submission = submission; 
    this.interviewModalComponent.togglesidebar(submission, event);
  }
 

  constructor(  private router: Router,
    private _submission: SubmissionService,
    private http: HttpClient,
    private _ErrorService: ErrorService ) { }

  pageChange(selectedPage){
    this.pageObj.page = selectedPage;
  }

   goToView(submission_id) {
     this.router.navigateByUrl('/client/submissions/'+submission_id);
   }

   toggleFavorite(id, submission){
    this.isLoading = true;
    this._submission.toggleFavorite(id, submission.is_client_fav)
    .subscribe(
      data => this.handleToggleSubmissionSuccess(data, submission),
      err => this.handleError(err)
      //() => console.log('ok')
    );
  }

  handleToggleSubmissionSuccess(data, submission){
    this.isLoading = false;
    submission.is_client_fav = !submission.is_client_fav;
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
  }

  handleError(error){
    this.isLoading = false;
    this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
  }

  acceptSubmission(submission_id){
    this.isLoading = true;
    return this.http.post(this.submissionAcceptUrl+submission_id+"/status", {status:'Accepted'}, this.httpOptions).subscribe(
      data => this.handleAcceptSuccess(data, submission_id),
      error => this.handleAcceptError(error)
    );
  }
  
  handleAcceptSuccess(data, submission_id){
    var submission = this.submissionsData.find(x => x.id === submission_id);
    submission.status = 'Accepted';
    this.isLoading = false;
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
  }
  
  handleAcceptError(error){
    this.isLoading = false;
    this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
  }

  rejectSubmission(submission_id){
    this.isLoading = true;
    return this.http.post(this.submissionRejectUrl+submission_id+"/status", {status:'Rejected'}, this.httpOptions).subscribe(
      data => this.handleRejectSuccess(data, submission_id),
      error => this.handleRejectError(error)
    );
  }
  
  handleRejectSuccess(data, submission_id){
    var submission = this.submissionsData.find(x => x.id === submission_id);
    submission.status = 'Rejected';
    this.isLoading = false;
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
  }
  
  handleRejectError(error){
    this.isLoading = false;
    this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
  }

  withdrawSubmission(submission_id){
    this.isLoading = true;
    return this.http.get(this.submissionRejectUrl+submission_id+"/withdraw", this.httpOptions).subscribe(
      data => this.handleWithdrawSuccess(data, submission_id),
      error => this.handleRejectError(error)
    );
  }

  handleWithdrawSuccess(data, submission_id){
    var submission = this.submissionsData.find(x => x.id === submission_id);
    submission.status = 'Withdrawn';

    for (let i = 0; i < this.submissionsData.length; ++i) {
      if (this.submissionsData[i].id === submission_id) 
        this.submissionsData.splice(i, 1);
  }

    this.isLoading = false;
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
  }

}
