import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PublicJobService } from 'src/Services/public_portal/public-job.service';
import { ErrorService } from 'src/Services/shared/error.service';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-application-job-questions',
  templateUrl: './application-job-questions.component.html',
  styleUrls: ['./application-job-questions.component.css']
})
export class ApplicationJobQuestionsComponent implements OnInit {

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

  id: number;
  submission_id: Number;
  isLoading = true;
  job_link = location.origin+"/jobs/";
  show_more_description = false;

  constructor(
              private route: ActivatedRoute, 
              private _publicJobService:PublicJobService,
              private titleService:Title,
              private _ErrorService: ErrorService,
              private router: Router,
              private toastr: ToastrService
              ) { }

    href:any = "";
    show_company_sidebar = true;
  ngOnInit() {
    this.href = window.location.host;
    if(this.href === "talentzhire.com" || this.href === 'talentzhire.com')
      this.show_company_sidebar = false;

    this.sub = this.route.params.subscribe(params => {
      let id = params['job_slug']; // (+) converts string 'id' to a number
      this.job.id = id;
      this.submission_id = params['submission_id'];
      this._publicJobService.getJob(id)
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
    this.titleService.setTitle('Talentzhire | Jobs - '+this.job.title);
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
                      'answer' : obj.answer
                    } );
    }

    this._publicJobService.applyWithApplicationJobQuestions(job_id, this.submission_id, answers)
        .subscribe( 
          data => this.handleJobApplySuccess(data),
         err => this.handleJobApplyError(err)
         //() => console.log('ok')
      );
  }

  handleJobApplySuccess(data)
  {
    this.job.hasApplied = true;
    this._ErrorService.flashMessage({'type': 'success', 'messages': data.msg } );
    this.router.navigateByUrl('/submission-success?job_slug='+this.job.slug);
  }

  handleJobApplyError(error){
     this._ErrorService.flashMessage( {'type': 'error', 'messages': error.error } );
     this.isLoading = false;
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

}
