import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ErrorService } from 'src/Services/shared/error.service';

@Component({
  selector: 'app-show-interview',
  templateUrl: './show-interview.component.html',
  styleUrls: ['./show-interview.component.css']
})
export class ShowInterviewComponent implements OnInit {

  isLoading = false;
  defaultSkillsCount = 10;
  interview_id;
  sub;
  interview = {
    title: '',
    type: '',
    dates: [],
    date: { date:'', time_in: '', time_out: '' },
    notes: '',
    reason: '',
    location: '',
    current_status: 'New',
    candidate: {
      meta: {
        profilePictureFullUrl: null
      }
    },
    submission: {
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
    },
    job : {
      title: ''
    },
    actions : []
  };
  showMoreText = "more";
  

  

  interviewUrl = environment.baseApiUrlClient + "/client/interviews/";

  private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
  private httpOptions = {
    headers: this.headers_object
  };

  constructor(private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private _ErrorService: ErrorService) { }

  ngOnInit() {
    this.isLoading = true;
    this.sub = this.route.params.subscribe(params => {
      this.interview_id = +params['id']; // (+) converts string 'id' to a number

      return this.http.get(this.interviewUrl + this.interview_id, this.httpOptions).subscribe(
        data => this.handleSuccess(data),
        error => this.handleError(error)
      );


    });
  }

  

  

  handleSuccess(data) {
    console.log(data);
    this.interview = data.data.interview;
  }

  handleError(error) {
    console.log(error);
    this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
  }

  toggleSkillsCount(){
    if(this.defaultSkillsCount==10) {
      this.defaultSkillsCount = this.interview.submission.skills.length;
      this.showMoreText = "less";
    }else{
      this.showMoreText = "more";
      this.defaultSkillsCount = 10;
    }
  }

}
