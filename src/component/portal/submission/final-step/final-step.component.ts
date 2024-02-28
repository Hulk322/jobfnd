import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ErrorService } from 'src/Services/shared/error.service';
import { TokenService } from 'src/Services/token.service';

@Component({
  selector: 'app-final-step',
  templateUrl: './final-step.component.html',
  styleUrls: ['./final-step.component.css']
})
export class FinalStepComponent implements OnInit {
  
  	isLoading = false;
	sub;
	job_slug;
	cv_id;

	submission = {
	  	first_name: null,
	  	middle_name: null,
	  	last_name: null,
	  	email: null,
	  	dob: null,
	  	gender: null,
	  	mobile:null,
	  	willing_to_relocated: null,
	 	job_id: null,
	  	cv_id: null,
	  	country_code:null,
	  	employments: null,
	  	educations: null,
	  	skills : null,
	  	veteran_status:null,
	  	profile_type:null,
	  	compensation_type:null,
	  	compensation_amount:null,
	  	title_summary:null,
	  	quick_summary:null
	};
    
	cvURL = `${environment.baseApiUrl}/jobs/`;
	
	constructor(private route: ActivatedRoute,
	    private http: HttpClient,
		private router: Router,
		private Token: TokenService,
    	private _ErrorService: ErrorService) { }

    ngOnInit() {
      this.isLoading = true;
      this.sub = this.route.params.subscribe(params => {
	    this.job_slug = params['job_slug'];
	    this.cv_id = +params['cv_id']; // (+) converts string 'id' to a number
	    this.http.get(`${this.cvURL}${this.job_slug}/resume/${this.cv_id}`).subscribe(
	        data => this.handleSuccess(data),
	        error => this.handleError(error)
	    );
	  });
  	}

  	handleSuccess(data){
		console.log(data);
	    this.submission = data.data.resume;
	    this.isLoading = false;
	}

	handleError(error){
		console.log(error);
		this.isLoading = false;
	}

	onSubmit(){
		if(!this.hasRequiredFields()) {
			alert("Please confirm/enter email.");
			return ;
		}
		this.isLoading = true;
        let formData = new FormData();
        //this.submission.dob = this.submission.dob.toISOString().replace('T',' ');
		for ( var key in this.submission ) {
            formData.append(key, this.submission[key]);
        }

        formData.append('resume_id', this.cv_id);
        this.http.post(`${this.cvURL}${this.job_slug}/apply`,formData)
        .toPromise()
        .then(result=>this.handlePostSuccess(result),
        	error=>this.handlePostError(error));
	}

	hasRequiredFields(){
		if((!this.submission.email))
			return false;
		else
			return true;
		if((!this.submission.first_name || this.submission.first_name=="") || 
			(!this.submission.last_name || this.submission.last_name=="") ||
			(!this.submission.email || this.submission.email=="") || 
			(!this.submission.country_code || this.submission.country_code=="") ||
			(!this.submission.mobile || this.submission.mobile=="") ||
			(!this.cv_id || this.cv_id=="")) {
			return false;
		}
		return true;
	}

	handlePostSuccess(data){
		//this.isLoading = false;
		console.log(data);
		this.Token.handle(data.data.token);
    
    localStorage.removeItem('is_client');
    localStorage.removeItem('is_vendor');
    localStorage.removeItem('is_candidate');
    localStorage.removeItem('is_admin');
    
    localStorage.setItem('is_vendor', data.data.user.type == 'vendor' ? 'true' : '' );
    localStorage.setItem('is_client', data.data.user.type == 'client' ? 'true'  : ''  );
    localStorage.setItem('is_candidate', data.data.user.type == 'candidate' ? 'true'  : '' );
    localStorage.setItem('is_admin', data.data.user.type == 'admin' ? 'true'  : '' );
    localStorage.setItem('full_name', data.data.user.first_name + " " + data.data.user.last_name);
    localStorage.setItem('id', data.data.user.id);
    localStorage.setItem('user', data.data.user);
    localStorage.setItem('profile_picture', data.data.user.meta.profilePictureFullUrl);
    //this._ErrorService.flashMessage({'type': 'success', 'messages': data.msg } );
    
    //this.isLoading = false;
    //console.log(data);
    if (data.data.redirect_url == 'your-organizations') {
      this.router.navigateByUrl('your-organizations');
    }else{
      if(data.data.user.type == 'candidate')
      {
        
          window.open( 'candidate/profile', '_self');  
      }
      else
        window.open( data.data.redirect_url, '_self');  
    }
	    //this.router.navigateByUrl('submission-success');
	}
	handlePostError(error){
		this._ErrorService.flashMessage( {'type': 'error', 'messages': error.error } );
    	this.isLoading = false;
	}
}