import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DiscoverCandidateService } from 'src/Services/client/discover-candidate.service';
import { CandidateService } from 'src/Services/client/candidate.service';
//import { Observable } from 'rxjs/Observable';
//import { mergeMap, catchError } from 'rxjs/operators';
import { ErrorService } from 'src/Services/shared/error.service';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

export const fadeAnimation = trigger('fadeAnimation', [
  transition(':enter', [
    style({ opacity: 0 }), animate('300ms', style({ opacity: 1 }))]
  ),
  transition(':leave',
    [style({ opacity: 1 }), animate('300ms', style({ opacity: 0 }))]
  )
]);

export const listAnimation = trigger("listAnimation", [
  transition("* => *", [
    // each time the binding value changes
    query(":leave", [stagger(500, [animate("0.5s", style({ opacity: 0 }))])], {
      optional: true
    }),
    query(
      ":enter",
      [
        style({ opacity: 0 }),
        stagger(500, [animate("0.5s", style({ opacity: 1 }))])
      ],
      { optional: true }
    )
  ])
]);

@Component({
  selector: 'app-discover-candidates',
  templateUrl: './discover-candidates.component.html',
  styleUrls: ['./discover-candidates.component.css'],
  animations: [fadeAnimation, listAnimation]
})
export class DiscoverCandidatesComponent implements OnInit {

  constructor( 
    private _discoverCandidates: DiscoverCandidateService,
    private _candidateService: CandidateService,
    private router: Router,
    private route: ActivatedRoute,
    private _ErrorService: ErrorService) { }

  candidates = [];
  job_id: Number;
  pageObj ={
    page : 1,
    pageSize: 10,
    totalElements : 0
  };
  isLoading = false;
  isLoadingMore = false;
  private Parameters: any;
  view = "by_job_id";

  ngOnInit() {

    this.isLoading = true;
    this.Parameters = this.route.params.subscribe(params => {
      
      var findSimilar = +params['similar']; // (+) converts string 'id' to a number
      if(findSimilar)
      {
        this.job_id =  +params['similar']; //similar here is job_id
        this.view = "by_talent_id_similar";
        this.getSimilarCandidates( +params['job_id']);  // job_id here is candidate_id
      }
      else 
      {
        this.job_id = +params['job_id']; // (+) converts string 'id' to a number
        this.view = "by_job_id";
        this.getCandidates(this.job_id);
      }
    });

    
  }

  getCandidates(job_id){
    this.isLoading = true;
    this._discoverCandidates.getCandidates(job_id)
    .subscribe(
      data  => this.handleSuccess(data),
      error => this.handleError(error)
    );
  }

  getSimilarCandidates(candidate_id){
    
    this.isLoading = true;
    this._candidateService.getSimilarCandidates(candidate_id)
    .subscribe(
      data  => this.handleSuccess2(data),
      error => this.handleError(error)
    );
  }

  inviteToJob(talent){
    this.isLoading = true;
    this._discoverCandidates.inviteToJob(this.job_id, talent.talent.id)
    .subscribe(
      data  => this.handleInviteToJobSuccess(data, talent),
      error => this.handleError(error)
    );
  }

  dismiss(talent){
    this.isLoading = true;
    this._discoverCandidates.dismiss(this.job_id, talent.talent_id, this.view, talent.matched_talent_id)
    .subscribe(
      data  => this.handleInviteToJobSuccess(data, talent),
      error => this.handleError(error)
    );
  }

  handleInviteToJobSuccess(data, talent) {
    talent.invited = true;
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
    this.isLoading = false;
  }

  moreUrl;
  handleSuccess(data) {
    this.candidates = data.data.talents;
    //this.pageObj.pageSize = data.data.talents.per_page;
    //this.pageObj.totalElements = data.data.talents.total;
    //this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
    this.moreUrl = data.data.more;
    this.isLoading = false;
  }

  loadMore(){
    this.isLoading = true;
    this.isLoadingMore = true;
    this._discoverCandidates.loadMore(this.moreUrl)
    .subscribe(
      data  => this.handleSuccessLoadMore(data),
      error => this.handleError(error)
    );
  }

  handleSuccessLoadMore(data) {
    
    if(this.view == 'by_job_id'){
    for (var key in data.data.talents) {
      var obj = data.data.talents[key];
      this.candidates.push(obj);
    }
  }

  if(this.view=='by_talent_id_similar'){
    for (var key in data.data.similar) {
      var obj = data.data.similar[key];
      this.candidates.push(obj);
    }
  }
    
    this.moreUrl = data.data.more;
    this.isLoading = false;
    this.isLoadingMore = false;
  }

  handleSuccess2(data) {
    this.candidates = data.data.similar;
    //this.pageObj.pageSize = data.data.similar.per_page;
    this.moreUrl = data.data.more;
    this.isLoading = false;
  }

  handleError(error) {
    this._ErrorService.flashMessage( {'type': 'error', 'messages': error.error } );
    this.isLoading = false;
    this.isLoadingMore = false;
  }

  pageChange(selectedPage){
    this.pageObj.page = selectedPage;
    this.getCandidates(this.job_id);
  }

  goToView(candidate_id) {
    this.router.navigateByUrl('/client/candidates/'+candidate_id+'/'+this.job_id);
  }

}
