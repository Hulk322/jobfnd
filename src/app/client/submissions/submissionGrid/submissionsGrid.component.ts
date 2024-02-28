import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ErrorService } from 'src/Services/shared/error.service';
import { InterviewModalComponent }  from 'src/app/client/interviews/interview-modal/interview-modal.component';
import { SubmissionService } from 'src/Services/client/submission.service';
import { DiscoverCandidateService } from 'src/Services/client/discover-candidate.service';
declare var jQuery:any;

@Component({
  selector: 'app-submissions-grid',
  templateUrl: './submissionsGrid.component.html',
  styleUrls: ['./submissionsGrid.component.css']
})
export class SubmissionsGridComponent implements OnInit {
@Input() submissionsData: any[];

@Input() single_job_title: string;

@Input() single_job_id: number;

  defaultSkillsLength : number = 2;
  showAllSkills : boolean = false;
  isLoading = false;
  submissionAcceptUrl = environment.baseApiUrlClient+"/client/submissions/";
  submissionRejectUrl = environment.baseApiUrlClient+"/client/submissions/";
  jobSubmissionsUrl = environment.baseApiUrlClient+"/client/jobs/submissions";
  private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
  private httpOptions = {
    headers: this.headers_object
  };





  @ViewChild(InterviewModalComponent, { static: true })
  private interviewModalComponent: InterviewModalComponent;



  sidebar_open = false;
  show_modal = false;
  current_submission;
  current_tab = 'applied';
  sovrenData = [];
  simplifyaiData = [];
  display_sovren_score : any;
  display_simplifyai_score : any;
  @Input() locations: [];
  public isCollapsed = false;

  constructor(private router: Router,
    private _discoverCandidates: DiscoverCandidateService,
    private _ErrorService: ErrorService,
    private _submission: SubmissionService,
    private http: HttpClient) { }

  ngOnInit() {
    this.getJobSubmissions();
    this.display_simplifyai_score = localStorage.getItem('display_simplifyai_score');
    this.display_sovren_score = localStorage.getItem('display_sovren_score');
  }

  goToView(submission_id) {
    this.router.navigateByUrl('/client/submissions/'+submission_id);
  }

  togglesidebar(submission, event) {
    this.current_submission = submission;

    this.interviewModalComponent.togglesidebar(submission, event);
  }

  toggleFavorite(id, submission){
    this._submission.toggleFavorite(id, submission.is_client_fav)
    .subscribe(
      data => this.handleToggleSubmissionSuccess(data, submission),
      err => this.handleError(err)
    );
  }

  handleToggleSubmissionSuccess(data, submission){
    submission.is_client_fav = !submission.is_client_fav;
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
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

  handleError(error){
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

  withdrawSubmission(submission_id){
    this.isLoading = true;
    return this.http.get(this.submissionRejectUrl+submission_id+"/withdraw", this.httpOptions).subscribe(
      data => this.handleWithdrawSuccess(data, submission_id),
      error => this.handleRejectError(error)
    );
  }

  handleRejectSuccess(data, submission_id){
    var submission = this.submissionsData.find(x => x.id === submission_id);
    submission.status = 'Rejected';
    this.isLoading = false;
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
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

  handleRejectError(error){
    this.isLoading = false;
    this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
  }


  show_modal_window(submission) {
    var need_model = true;
    this.sovrenData = [];
    this.simplifyaiData = [];
    this.current_submission=submission;

    if (need_model) {
      this.show_modal = true;
      for (let unweighted_category_score of submission.unweighted_category_scores) {
        if(unweighted_category_score.parser_type == 'sovren') {
          this.sovrenData.push(unweighted_category_score);
        }else if(unweighted_category_score.parser_type == 'simplifyai') {
          this.simplifyaiData.push(unweighted_category_score);
        }
    }

    }

  }


getJobSubmissions() {

  if(this.single_job_id){
    this.isLoading = true;
    return this.http.get(this.jobSubmissionsUrl+ '/' +this.single_job_id, this.httpOptions).subscribe(
      data => this.handleJobSubmissionsSuccess(data),
      error => this.handleError(error),
      );
  }
}

applied = [];
engaged = [];
referred = [];
integrated_pool = [];

handleJobSubmissionsSuccess(data) {
  console.log(data);
  this.applied = data.data.applied;
  this.engaged = data.data.engaged;
  this.referred = data.data.referred;
  this.integrated_pool = data.data.pool;

  this.changeTab();

  this.isLoading = false;
  }

  changeTab(){
    if(this.current_tab == 'applied')
      this.submissionsData = this.applied;
    if(this.current_tab == 'engaged')
      this.submissionsData = this.engaged;
    if(this.current_tab == 'referred')
      this.submissionsData = this.referred;
    if(this.current_tab == 'integrated_pool')
      this.submissionsData = this.integrated_pool
  }

  compare_ids = [];
  compare_data = [];
  comparing = false;

  FieldsChange(values:any){
    if (values.currentTarget.checked==true)
      this.compare_ids.push(values.currentTarget.value);
    else
      this.compare_ids.splice(values.currentTarget.value.index, 1);

    }

    foo(event) {
      console.log(event.target.checked==true);
      if(this.compare_ids.length==2 && event.target.checked==true)
        event.preventDefault();
    }

    compareCandidates(){
      this.isLoading = true;
      this.comparing = true;

      this._discoverCandidates.compareCandidates(this.single_job_id, this.compare_ids[0], this.compare_ids[1], this.compare_ids[2])
      .subscribe(
        data  => this.handleCompareSuccess(data),
        error => this.handleError(error)
      );

    }

    @ViewChild('completeModal', { static: true }) completeModal: ElementRef;
    handleCompareSuccess(data) {
      console.log('success',data);
      this.compare_data = data.data.comparison[0];
      this.isLoading = false;
      this.comparing = false;
      this.current_tab = 'compare';
      //jQuert show modal with data here
      jQuery(this.completeModal.nativeElement).modal('show');

      this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
    }

}
