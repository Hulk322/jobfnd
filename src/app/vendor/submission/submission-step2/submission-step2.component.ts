import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ErrorService } from 'src/Services/shared/error.service';

@Component({
  selector: 'app-submission-step2',
  templateUrl: './submission-step2.component.html',
  styleUrls: ['./submission-step2.component.css']
})
export class SubmissionStep2Component implements OnInit {

public submission = {
  willing_to_relocated:null,
  experience: 1,
  industry: null,
  highest_degree:null,
  veteran_status:null,
  profile_type:null,
  reference_1_name:null,
  reference_1_contact: null,
  reference_1_email:null,

  reference_2_name:null,
  reference_2_contact: null,
  reference_2_email:null,

  reference_3_name:null,
  reference_3_contact:null,
  reference_3_email:null,

  compensation_type: null,
  compensation_amount: 0,
  title_summary: null,
  quick_summary:null,
  email:null,
  password:null,
  password_confirmation:null,
};

isLoading = false;
sub;
job_id:any;
cv_id;
submission_id;
fileToUpload: File = null;
errors = [];

step2Url= environment.baseApiUrl+'/vendor/jobs/';


  constructor(
    private route: ActivatedRoute,
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
      this.cv_id = +params['cv_id']; // (+) converts string 'id' to a number
      this.submission_id = +params['submission_id'];
      this.isLoading = false;
       
    });

  }

  handleFileUpload(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  onSubmit(){
    this.isLoading = true;
    this.errors = [];

                let formData = new FormData();



                for ( var key in this.submission ) {
                    formData.append(key, this.submission[key]);
                }
                
                //formData.append('email', this.submission.email);
                //formData.append('password', this.submission.password);
                //formData.append('password_confirmation', this.submission.password_confirmation);

                formData.append('right', this.fileToUpload);
                //formData.append('experience', this.submission.experience);
                //formData.append('title_summary', this.submission.title_summary);
                //formData.append('quick_summary', this.submission.quick_summary);
                

                formData.append('submission_id', this.submission_id);
                formData.append('cv_id', this.cv_id);

                console.log(formData);

                return this.http.post(this.step2Url+this.job_id+'/submission/step-2', formData, this.httpOptions).subscribe(
                  data =>this.handleSuccessPost(data),
                  error => this.handleErrorPost(error)
                );

  }

  

  handleSuccessPost(data){
    console.log(data);
    this.isLoading = false;
    this.router.navigateByUrl('/vendor/submissions');
  }

  handleErrorPost(error){
    //console.log(error);
    this._ErrorService.flashMessage( {'type': 'error', 'messages': error.error } );
    this.isLoading = false;
    //var output = "";
    /*this.errors = [];
    for ( var key in error.error.errors ) {
        var obj = error.error.errors[key];
        this.errors.push(obj+"<br>");
    }*/

    //console.log(this.errors);
    //alert(error.error.errors)
    //this.router.navigateByUrl('/login');
  }

  
}
