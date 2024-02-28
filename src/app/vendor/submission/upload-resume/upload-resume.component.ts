import { Component, OnInit } from '@angular/core';
import { FileUploadService } from 'src/app/file-upload.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { ErrorService } from 'src/Services/shared/error.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-upload-resume',
  templateUrl: './upload-resume.component.html',
  styleUrls: ['./upload-resume.component.css']
})
export class UploadResumeComponent implements OnInit {

  fileToUpload: File = null;
  isLoading = false;
  //errorMessages:any;
  errors= [];
  job_id;
  candidates = [];
  candidatesPoolUrl = environment.baseApiUrl+'/vendor/jobs';
  submission_type = "existing";
  candidate_id=0;
  uploaded_file_name: string;

  private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
  private httpOptions = {
    headers: this.headers_object
  };

  constructor(private fileUploadService:FileUploadService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private _ErrorService: ErrorService ) { }

  ngOnInit() {
     this.route.params.subscribe(params => {
      this.job_id = +params['job_id']; // (+) converts string 'id' to a number

      return this.http.get(this.candidatesPoolUrl+"/"+this.job_id+"/submission/new", this.httpOptions).subscribe(
        data => this.handleGetSuccess(data),
        error => this.handleError(error)
      );

    });
  }

  handleGetSuccess(data){
    this.candidates = data.data.candidatesPool;
    //this.cv_id = this.candidates[0].resumes[0].id;
  }

  handleChange(evt) {
    var target = evt.target;
    console.log(target.value);
    this.submission_type = target.value;
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    this.uploaded_file_name = files.item(0).name; 
  }

  uploadFileToActivity() {
    this.isLoading = true;
    if(this.submission_type=="existing")
    {
      //this.router.navigateByUrl('/vendor/submission-step-1/'+this.job_id+'/'+this.cv_id);
      return this.http.get(this.candidatesPoolUrl+"/"+this.job_id+"/submission/candidate/"+this.candidate_id, this.httpOptions).subscribe(
        data => this.handleSuccess(data),
        error => this.handleError(error)
      );
    }
      else{
      this.errors = [];
      this.fileUploadService.postFile(this.fileToUpload, this.job_id).subscribe(
        data => this.handleSuccess(data),
        error => this.handleError(error)
      );
    }
  }

  handleSuccess(data)
{
  console.log(data);
  if(this.submission_type=="existing")
    this.router.navigateByUrl('/vendor/submission-step-1/'+this.job_id+'/'+this.candidate_id+'/existing');
  else
    this.router.navigateByUrl('/vendor/submission-step-1/'+this.job_id+'/'+data.data.cv_id+'/new');    
}

handleError(error){
  console.log(error);
  this._ErrorService.flashMessage( {'type': 'error', 'messages': error.error } );
	this.isLoading = false;
}

}
