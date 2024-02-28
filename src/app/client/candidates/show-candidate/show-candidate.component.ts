import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ErrorService } from 'src/Services/shared/error.service';
import { CandidateService } from 'src/Services/client/candidate.service';
import { DiscoverCandidateService } from 'src/Services/client/discover-candidate.service';

@Component({
  selector: 'app-show-candidate',
  templateUrl: './show-candidate.component.html',
  styleUrls: ['./show-candidate.component.css']
})
export class ShowCandidateComponent implements OnInit {

  constructor(private router: Router,
    private route: ActivatedRoute,
    private _ErrorService: ErrorService,
    private _candidate: CandidateService,
    private _discoverCandidates: DiscoverCandidateService,
    private http: HttpClient) { }

    isLoading = false;
    candidate_id;
    job_id;
    sub;
    fullUrl = "";
    current_tab = "pdf";

    submission = {
      invited: null,
      Address: null,
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

  ngOnInit() {
    this.isLoading = true;
      this.sub = this.route.params.subscribe(params => {
      this.candidate_id = +params['id']; // (+) converts string 'id' to a number
      this.job_id = +params['job_id']; // (+) converts string 'id' to a number

      this._candidate.getCandidate(this.candidate_id).subscribe(
        data => this.handleSuccess(data),
        error => this.handleError(error)
      );
      
      
       
    });
  }

  handleSuccess(data){
    this.submission = data.data.talent;
    if(this.submission.user.resume.resumeFullUrl !='' && this.submission.user.resume.resumeFullUrl != null){
      let url = this.submission.user.resume.resumeFullUrl;
      this.createPdfUrl(url);
    }
    this.isLoading = false;
  }

  createPdfUrl(url){
    this.fullUrl = url;
}

  handleError(error){
    this.isLoading = false;
    this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
  }

  goToFindResumes() {
    this.router.navigateByUrl('/client/discover-candidates/'+this.candidate_id+'/'+this.job_id);
  }

  inviteToJob(){
    this.isLoading = true;
    this._discoverCandidates.inviteToJob(this.job_id, this.candidate_id)
    .subscribe(
      data  => this.handleInviteToJobSuccess(data),
      error => this.handleError(error)
    );
  }

  handleInviteToJobSuccess(data) {
    this.submission.invited = true;
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
    this.goToFindResumes();
    this.isLoading = false;
  }

}
