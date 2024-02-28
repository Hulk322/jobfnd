import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PublicJobService } from 'src/Services/public_portal/public-job.service';
import { JobsService } from 'src/Services/candidate/jobs.service';
import { ErrorService } from 'src/Services/shared/error.service';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
declare var jQuery:any;

@Component({
  selector: 'app-job-questions',
  templateUrl: './job-questions.component.html',
  styleUrls: ['./job-questions.component.css']
})
export class JobQuestionsComponent implements OnInit {

  @ViewChild('resumeUploadModel', { static: true }) resumeUploadModel: ElementRef;
  uploadResumeUrl = environment.baseApiUrl+"/candidate/profile/resume/upload";
    private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
    private httpOptions = {
      headers: this.headers_object
    };

  private sub: any;
  organizationOpenJobs = 0;
  placeholder = "Choose Place...";
  filters = {
    what : '',
    where : '',
    categories : 'AllCategories'
  };
  public job = {
    id: null,
    title: null,
    api_job_id: null,
    job_type: null,
    created_at: null,
    deleted: false,
    salary: null,
    min_rate: null,
    max_rate: null,
    salary_type:null,
    start_date:null,
    tentative_end_date:null,
    category: null,
    currency: null,
    excerpt: '',
    description: '',
    openings: 0,
    experience: '',
    job_location: '',
    posted:'',
    submissionsCount:'',
    slug: '',
    category_id: null,
    additional_detail: '',
    reason_for_hire: '',
    hasApplied: false,
    saved: true,
    client_organization: {
      business_logo: null,
      businessLogoFullUrl: null,
      name: null,
      description: null,
      location: null,
      created_at: null
    },
    skills: [],
    other_skills: [],
    descriptions: [],
    submissions: [],
    interviews: [],
    offers: [],
    questions: []
  };
   
  minDate: Date;
  id: number;
  isLoading = true;
  job_link = location.origin+"/jobs/";
  show_more_description = false;

  fileName = 'Drop the file here or browse';
  uploaded_file_name: string;
  fileToUpload: File = null;
  resumeFileToUpload: File = null;

  constructor(
              private route: ActivatedRoute, 
              private publicJobService:PublicJobService,
              private _JobService: JobsService,
              private titleService:Title,
              private _ErrorService: ErrorService,
              private router: Router,
              private toastr: ToastrService,
              private http: HttpClient
              ) { this.minDate = new Date(); }

    href:any = "";
    show_company_sidebar = true;
    answers_saved_data;
  ngOnInit() {
    this.answers_saved_data = JSON.parse(localStorage.getItem('answers'));
    this.href = window.location.host;
    if(this.href === "talentzhire.com" || this.href === 'talentzhire.com')
      this.show_company_sidebar = false;
      
    this.sub = this.route.params.subscribe(params => {
      let id = params['id']; // (+) converts string 'id' to a number
      this.job.id = id;
      //alert(this.id);
      this._JobService.getJob(id)
      .subscribe( 
        data => this.handleSuccess(data),
       err => this.handleError(err)
       //() => console.log('ok')
    );
      // In a real app: dispatch action to load the details here.
   });
  }

  getAddress(place: object, question) { 
    var question = this.job.questions.find(x => x.id === question.id);
    question.answer = place['formatted_address'];
  }

  onValueChange(newValue, question) {
    var question = this.job.questions.find(x => x.id === question.id);
    question.answer = newValue;
}

  handleSuccess(data){
    console.log(data.data)
    this.job = data.data.job;
    this.organizationOpenJobs = data.data.organizationOpenJobs;
    this.id = this.job.id;
    this.job_link = this.job_link+this.job.slug;

    if(this.answers_saved_data){
      for ( var key in this.job.questions ){
        var obj = this.job.questions[key];
        var saved_answer = this.answers_saved_data.find(x => x.name === obj.name && x.type != 'date' && x.type != 'location');
        if(saved_answer){
          this.job.questions[key].answer = saved_answer.answer;
        }
      }
    }

    this.titleService.setTitle('Talentzhire | Jobs - '+this.job.title);

    /*if((localStorage.getItem("resume_uploaded") == 'false')){
      jQuery(this.resumeUploadModel.nativeElement).modal('show'); 
    }else {
      jQuery(this.resumeUploadModel.nativeElement).modal('hide'); 
    }*/

    //this.job.skills = this.job.skills.slice(0,2);
    //this.jobSuggestions();
    //this.job.skills = data.data.skills;
		//this.job.other_skills = data.data.other_skills;
		//this.job.descriptions = data.data.descriptions;
    this.isLoading = false;
  }

  handleError(err){
    console.log(err);
    //this.router.navigateByUrl('/login');
  }

  oneClickApplyToJob(job_id){
    this.isLoading = true;
    var answers = [];
    for ( var key in this.job.questions ) {
      var obj = this.job.questions[key];
      //console.log(obj);
      //answers[obj.id]=obj.answer;
      answers.push( {
                      'question_id' : obj.id, 
                      'answer' : obj.answer,
                      'name': obj.name,
                      'type' : obj.type,
                      'question': obj.question
                    } );
    }

    localStorage.setItem('answers', JSON.stringify(answers));
    this._JobService.applyToJob(job_id, answers)
        .subscribe( 
          data => this.handleJobApplySuccess(data),
         err => this.handleJobApplyError(err)
         //() => console.log('ok')
      );
  }

  handleJobApplySuccess(data)
  {
    //var job = this.jobs.find(x => x.id === data.data.job.id);
    //console.log(job);
    this.job.hasApplied = true;
    this._ErrorService.flashMessage({'type': 'success', 'messages': data.msg } );
    localStorage.setItem('notifications_count', (Number(localStorage.getItem('notifications_count'))+1).toString());

    if(this.job.saved)
    {
      localStorage.setItem('saved_jobs_count', (Number(localStorage.getItem('saved_jobs_count'))-1).toString());
    }

    this.router.navigateByUrl("/candidate/job-apply-success/"+this.job.slug+"/"+this.job.id);
  }

  handleJobApplyError(error){
     console.log(error);
     this._ErrorService.flashMessage( {'type': 'error', 'messages': error.error } );
   }

   copyMessage(){
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.job_link;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);

    //show alert data copied
    this.toastr.info('Job Link Copied.', '', {
      timeOut: 3000,
      positionClass: 'toast-bottom-right'
    });
  }

  searchClientJobs(org_name){
    this.filters.what = org_name;
    this.filters.where =  '';
    this.filters.categories = 'AllCategories';
    this.router.navigate(['/jobs'],{queryParams:this.filters });
  }

  toggleSavedJob(job_id){
    this._JobService.toggleSavedJob(job_id)
    .subscribe(
      data => this.handleToggleSavedJobSuccess(data, job_id),
      err => this.handleJobApplyError(err)
      //() => console.log('ok')
    );
  }

  new_saved_count=localStorage.getItem('saved_jobs_count');
  handleToggleSavedJobSuccess(data, job_id){
    //var job = this.jobs.find(x => x.id === job_id);
    
    //if(job.saved == 1)
      //job.saved = 0;
    //else
      //job.saved = 1;
    this.new_saved_count = data.data.saved_jobs;
    localStorage.setItem('saved_jobs_count', this.new_saved_count);
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
  }



  handleFileInput(files: FileList) {
    this.resumeFileToUpload = files.item(0);
    this.fileToUpload = files.item(0);
    this.fileName = this.fileToUpload.name;
    this.uploaded_file_name = files.item(0).name;

    if(this.uploaded_file_name) {
      this.isLoading = true;
      const formData: FormData = new FormData();
      formData.append('resume', this.resumeFileToUpload);
      return this.http.post(this.uploadResumeUrl, formData, this.httpOptions).subscribe(
        data => this.handleSuccessUploadResume(data),
        error => this.handleError(error)
      );
    }
  }

  handleSuccessUploadResume(data) {
    jQuery(this.resumeUploadModel.nativeElement).modal('hide'); 
    localStorage.setItem('resume_uploaded', 'true');
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
    this.isLoading = false;
  }


}
