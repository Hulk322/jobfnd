import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ErrorService } from 'src/Services/shared/error.service';

@Component({
  selector: 'app-submission-step1',
  templateUrl: './submission-step1.component.html',
  styleUrls: ['./submission-step1.component.css']
})
export class SubmissionStep1Component implements OnInit {

isLoading = false;

public submission = {
  id: null,
  first_name: null,
  middle_name: null,
  last_name: null,
  dob: null,
  gender: null,
  address: null,
  full_address: null,
  location: null,
  require_visa_sponsorship: null,
  authorized_in_us: null,
  salary_amount: null,
  salary_type: null,
  bill_rate_min: null,
  bill_rate_max: null,
  current_job: '',
  willing_to_relocated: null,
  job_id: null,
  cv_id: null,
  skills : null,
  estimated_joning_date: null,
  quick_summary: null
};
sub;
job_id;
candidate_or_cv_id;
submission_type;
job = {
  job_type: null,
  salary: null,
  salary_type: null,
  start_date: null,
  min_rate: null,
  max_rate: null
};

pay_types = ['Hourly', 'Weekly', 'Monthly', 'Annually'];

step1Url= environment.baseApiUrl+'/vendor/jobs/';
cvUrl= environment.baseApiUrl+'/vendor/jobs/';

  constructor(private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private _ErrorService: ErrorService) { }

    private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
    private httpOptions = {
      headers: this.headers_object
    };

  ngOnInit() {

      this.isLoading = true;
      this.sub = this.route.params.subscribe(params => {
      this.job_id = +params['job_id']; // (+) converts string 'id' to a number
      this.candidate_or_cv_id = +params['candidate_or_cv_id']; // (+) converts string 'id' to a number
      this.submission_type = +params['submission_type']; // (+) converts string 'id' to a number
      if(this.submission_type=='existing'){
      return this.http.get(this.cvUrl+this.job_id+"/submission/candidate/"+this.candidate_or_cv_id, this.httpOptions).subscribe(
        data => this.handleSuccess(data),
        error => this.handleError(error)
      );
      }else{
        return this.http.get(this.cvUrl+this.job_id+"/submission/resume/"+this.candidate_or_cv_id, this.httpOptions).subscribe(
          data => this.handleSuccess(data),
          error => this.handleError(error)
        );
      }
      
       
    });

  }

  onSubmit(){
    console.log(this.submission);
    this.isLoading = true;

    this.submission.job_id = this.job_id;
    this.submission.cv_id = this.submission.id; //submission is cv object actually

    var form_data = new FormData();

    for ( var key in this.submission ) {
        form_data.append(key, this.submission[key]);
    }
                
    if(form_data.get("user_id")==null || form_data.get("user_id")=="" || form_data.get("user_id")=="null")
      form_data.delete("user_id");
    else
      form_data.set("candidate_id", form_data.get("user_id"));

                //skills data
                if(this.submission.skills.length==0)
                {
                   // this.submission.skills.push(this.skill_1);
                   // this.submission.skills.push(this.skill_2);
                   // this.submission.skills.push(this.skill_3);
                }
                console.log(this.submission.skills);
                for ( var key in this.submission.skills ) {
                    var obj = this.submission.skills[key];
                    console.log(obj);
                    if(obj.display)
                    {
                      //console.log(obj);
                        form_data.append('skills['+key+'][name]', obj.display);
                        //form_data.append('skills['+key+'][level]', obj.level);
                    
                        //console.log('skill['+key+'][title]'+'-->'+'skill['+key+'][level]');
                    }
                }

                
                form_data.set('dob', this.formatDate(this.submission.dob));
                form_data.set('estimated_joning_date', this.formatDate(this.submission.estimated_joning_date));

                

                return this.http.post(this.step1Url+this.job_id+'/submission/post-submission', form_data, this.httpOptions).subscribe(
                  data =>this.handleSuccessPost(data),
                  error => this.handleErrorPost(error)
                );

  }

  handleSuccess(data){
    this.submission = data.data.cv;
    this.job = data.data.job;
    this.submission.salary_amount = this.job.salary;
    this.submission.salary_type = this.job.salary_type;
    this.submission.estimated_joning_date = this.job.start_date;
    this.submission.bill_rate_min = this.job.min_rate;
    this.submission.bill_rate_max = this.job.max_rate;

    this.submission.dob = this.inputFormatDate(this.submission.dob);
    this.submission.estimated_joning_date = this.inputFormatDate(this.submission.estimated_joning_date);

    for ( var key in this.submission.skills ) {
      var obj = this.submission.skills[key];
      obj.display = obj.name;
      obj.value = obj.id;
    }

    this.isLoading = false;
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

  inputFormatDate(date) {
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

			return [month, day, year].join('/');
		} else {
			return null;
		}
	}

  handleSuccessPost(data){
    this._ErrorService.flashMessage({'type': 'success', 'messages': data.msg } );
    this.isLoading = false;
    this.router.navigateByUrl('/vendor/submissions');
    //this.router.navigateByUrl('/vendor/submission-step-2/'+this.job_id+'/'+data.data.submission_id+"/"+this.cv_id);
  }

  getAddress(place: object) {
		this.submission.location = place['formatted_address'];
	}

  handleErrorPost(error){
    console.log(error.error);
	  this._ErrorService.flashMessage( {'type': 'error', 'messages': error.error } );
	  this.isLoading = false;
  }

  handleError(error){
    console.log(error.error);
	  this._ErrorService.flashMessage( {'type': 'error', 'messages': error.error } );
	  this.isLoading = false;
  }

}
