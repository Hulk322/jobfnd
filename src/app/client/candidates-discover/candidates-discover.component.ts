import { Component, OnInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DiscoverCandidateService } from 'src/Services/client/discover-candidate.service';
import { CandidateService } from 'src/Services/client/candidate.service';
import { ErrorService } from 'src/Services/shared/error.service';
import { ClientJobService } from 'src/Services/client/job.service';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

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
  selector: 'app-candidates-discover',
  templateUrl: './candidates-discover.component.html',
  styleUrls: ['./candidates-discover.component.css'],
  animations: [fadeAnimation, listAnimation]
})
export class CandidatesDiscoverComponent implements OnInit {
  item = 0;

  toggleList(index) {
    // if list already open
    if (index == this.item) {
      this.item = 1000;
    }else{
      this.item = index;
    }

  }
  constructor(private _discoverCandidates: DiscoverCandidateService,
    private sanitizer: DomSanitizer,
    private _candidateService: CandidateService,
    private router: Router,
    private route: ActivatedRoute,
    private _ErrorService: ErrorService,
    private _JobService: ClientJobService) { }

  @HostListener('scroll', ['$event'])
  onScroll(event: any) {
      // visible height + pixel scrolled >= total height
      if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight) {
        console.log("End");
        if(this.loadmoreUrl != null && this.loadmoreUrl != '')
          this.loadMore();
      }
  }
  candidates = [];
  job_id: Number;
  candidate_id;
  talent_id;
  similar_profile_candidate;
  current_invited_id: Number;
  graph = false;
  current_tab = 'discover';

  urlSafe: SafeResourceUrl;
  graphFrameUrl = environment.GRAPHICAL_URL;
  id: any;

  isLoading = false;
  private Parameters: any;
   view = "by_job_id";
  fullUrl = "";
  //current_tab = "pdf";
  loadmoreUrl;
  isLoadingMore = false;
  filters = {
    skills: '',
    titles: ''
  };

  submission = {
    invited: null,
    Address: null,
    pool_category: null,
    user: {
      first_name: null,
      last_name: null,
      Address: null,
      resume: {
        resumeFullUrl: null
      }
    },
    id: null,
    status:null,
    bill_rate_min: null,
    bill_rate_max:null,
    pay_rate: null,
    created_at:null,
    estimated_joning_date:null,
    is_client_fav: false,
    first_name: '',
    last_name: '',
    candidate: {
      first_name: '',
      last_name: ''
    },
    gender: '',
    dob: '',
    location: '',
    address: '',
    full_address: '',
    willing_to_relocated: '',
    home_phone: '',
    mobile: '',
    city: '',
    country: '',
    state: '',
    zip: null,
    salary_amount: null,
    salary_type: null,
    skills: [],
    additional_information: null,
    quick_summary: null,
    facebook: null,
    liknedin: '',
    twitter: '',
    authorized_in_us: null,
    resume: null,
    is_local_file: false,
    resumeFullUrl: '',
    type: null,
    answers: [],
    documents: [],
    interviews: [],
    job: {
      id: null,
      title:null,
      job_type: null,
      description: null,
      posted: null,
      address: null,
      category: {
        name: null
      }
    },
    talent: {
      first_name: null,
      last_name: null,
      resume : {
        title: null,
        documents:[]
      },
      talentMeta: {
        mobile:null,
        location:null
      },
      meta : {
        profilePictureFullUrl: null
      }
    }
  };

  job : any;

  ngOnInit() {

    this.isLoading = true;
    this.Parameters = this.route.params.subscribe(params => {
        this.job_id = +params['job_id']; // (+) converts string 'id' to a number
        this.getCandidates(this.job_id);

        this._JobService.getJob(this.job_id)
        .subscribe(
          data => this.handleSuccessJobDetail(data),
         err => this.handleError(err)
         //() => console.log('ok')
      );
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

  handleSuccess(data, mode='default') {
    let on_load  = data.data.talents[0];

    this.candidateView(on_load.talent_id);
    this.mode = mode;
    this.candidates = data.data.talents;
    this.loadmoreUrl = data.data.more;
    this.isLoading = false;
    this.id = on_load.api_talent_id;
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.graphFrameUrl.toLowerCase() + this.id +"&source=sovren");
  }

  handleError(error) {
    this._ErrorService.flashMessage( {'type': 'error', 'messages': error.error } );
    this.isLoading = false;
  }

  handleCompareSuccess(data) {
    this.compare_data = data.data.comparison;
    this.isLoading = false;
    this.comparing = false;
    this.current_tab = 'compare'; 
  }


  candidateView(candidate_id) {
    if(this.candidate_id != candidate_id || this.current_tab=='compare' ) {
      this.candidate_id = candidate_id;
      this.current_tab = 'discover';
      this._candidateService.getCandidate(candidate_id).subscribe(
        data => this.handleSuccessResume(data),
        error => this.handleError(error)
      );
    }
  }

    handleSuccessResume(data){
      this.submission = data.data.talent;
      if(this.submission.resumeFullUrl !='' && this.submission.resumeFullUrl != null){
        let url = this.submission.resumeFullUrl;
        this.createPdfUrl(url);
      }
      this.id = this.submission['api_talent_id'];
      this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.graphFrameUrl.toLowerCase() + this.id +"&source=sovren");
      this.isLoading = false;
    }

    createPdfUrl(url){
      this.fullUrl = url;
  }

  getSimilarCandidates() {
      this.isLoading = true;
      window.scroll(0, 0);
      this.candidates = [];
  		this._candidateService.getSimilarCandidates(this.candidate_id + '/similar/'+this.job_id)
  		.subscribe(
  		  data  => this.handleSuccess2(data),
  		  error => this.handleError(error)
  		);
  }

  handleSuccess2(data) {
    this.similar_profile_candidate = data.data.talent.Name;
    this.submission = {
    invited: null,
    Address: null,
    pool_category: null,
    user: {
      first_name: null,
      last_name: null,
      Address: null,
      resume: {
        resumeFullUrl: null
      }
    },
    id: null,
    status:null,
    bill_rate_min: null,
    bill_rate_max:null,
    pay_rate: null,
    created_at:null,
    estimated_joning_date:null,
    is_client_fav: false,
    first_name: '',
    last_name: '',
    candidate: {
      first_name: '',
      last_name: ''
    },
    gender: '',
    dob: '',
    location: '',
    address: '',
    full_address: '',
    willing_to_relocated: '',
    home_phone: '',
    mobile: '',
    city: '',
    country: '',
    state: '',
    zip: null,
    salary_amount: null,
    salary_type: null,
    skills: [],
    additional_information: null,
    quick_summary: null,
    facebook: null,
    liknedin: '',
    twitter: '',
    authorized_in_us: null,
    resume: null,
    is_local_file: false,
    resumeFullUrl: '',
    type: null,
    answers: [],
    documents: [],
    interviews: [],
    job: {
      id: null,
      title:null,
      job_type: null,
      description: null,
      posted: null,
      address: null,
      category: {
        name: null
      }
    },
    talent: {
      first_name: null,
      last_name: null,
      resume : {
        title: null,
        documents:[]
      },
      talentMeta: {
        mobile:null,
        location:null
      },
      meta : {
        profilePictureFullUrl: null
      }
    }
  };
    this.candidates = data.data.similar;
    this.talent_id = data.data.similar[0].talent_id;
    this.candidates.shift();
    let on_load  = data.data.similar[0];

    this.candidateView(on_load.talent.id);
    this.isLoading = false;
  }

  inviteToJob(talent) {
  	this.isLoading = true;
  	this._discoverCandidates.inviteToJob(this.job_id, talent.talent.id)
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

  dismiss(talent){
    
    var answer = confirm('Are you sure you want to dismiss this talent?');
    if(answer){
      this.isLoading = true;
      for(let i = 0; i < this.candidates.length; ++i){
        if (this.candidates[i].id === talent.id) {
      this._discoverCandidates.dismiss(this.job_id, talent.talent_id, this.view, talent.matched_talent_id)
      .subscribe(
        data  => this.handleDismissSuccess(data, talent, i),
        error => this.handleError(error)
        );
        }
      }
    }
  }

  handleDismissSuccess(data, talent, i) {
    talent.invited = true;
    this.candidates.splice(i, 1);
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
    this.isLoading = false;
  }

  loadMore(){
    this.isLoading = true;
    this.isLoadingMore = true;
    this._discoverCandidates.loadMore(this.loadmoreUrl)
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

  // if(this.view=='by_talent_id_similar'){
  //   for (var key in data.data.similar) {
  //     var obj = data.data.similar[key];
  //     this.candidates.push(obj);
  //   }
  // }

    this.loadmoreUrl = data.data.more;
    this.isLoadingMore = false;
  }

  handleSuccessJobDetail(data) {

    this.job = data.data.job;

  }

  mode='default';
  comparing = false;
  searching = false;

  filterCandidates(){
    this.isLoading = true;
    this.searching = true;

    this._discoverCandidates.filterCandidates(this.job_id, this.filters.skills, this.filters.titles)
    .subscribe(
      data  => this.handleSuccess(data, 'search'),
      error => this.handleError(error)
    );
  }

  compare_ids = [];
  compare_data;
  compareCandidates(){
    this.isLoading = true;
    this.comparing = true;
    
    this._discoverCandidates.compareCandidates(this.job_id, this.compare_ids[0], this.compare_ids[1], this.compare_ids[2])
    .subscribe(
      data  => this.handleCompareSuccess(data),
      error => this.handleError(error)
    );

    
    

  }

  FieldsChange(values:any){
    if (values.currentTarget.checked==true)
      this.compare_ids.push(values.currentTarget.value);
    else
      this.compare_ids.splice(values.currentTarget.value.index, 1);

      console.log(this.compare_ids);
    }

    foo(event) {
      console.log(event.target.checked==true);
      if(this.compare_ids.length==3 && event.target.checked==true)
        event.preventDefault();
    }

}