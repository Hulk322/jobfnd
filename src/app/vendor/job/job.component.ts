import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JobService } from 'src/Services/vendor/job.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.css']
})
export class JobComponent implements OnInit {
  
  title = "";
  current_tab = "job_details";
  public job = {
    id: null,
    title: null,
    job_type: null,
    created_at: null,
    salary_type:null,
    start_date:null,
    tentative_end_date:null,
    category: null,
    currency: null,
    min_rate: null,
    max_rate: null,
    posted: null,
    description: '',
    openings: 0,
    experience: '',
    address: '',
    category_id: null,
    additional_detail: '',
    reason_for_hire: '',
    client_organization: {
      business_logo: null,
      businessLogoFullUrl: null
    },
    skills: [],
    other_skills: [],
    descriptions: [],
    user_submissions: [],
    user_interviews: [],
    user_offers: []
  };
  isLoading = true;
  id: number;
  private sub: any;
  defaultSkillsCount = 10;
  showMoreText = "more";
  public isList : boolean = true;
  public isGrid : boolean = false;

  constructor(private route: ActivatedRoute,
    private _JobService: JobService,
    private router: Router) { }

    deleteSubmission(id, submission){
      var answer = confirm('Are you sure you want to delete this submission?');
      if(answer){
        submission.deleted = true;
        for(let i = 0; i < this.job.user_submissions.length; ++i){
          if (this.job.user_submissions[i].id === id) {
            this._JobService.deleteSubmission(id)
          .subscribe( 
            data => this.job.user_submissions.splice(i, 1),
            err => console.log(err)
          );
              
          }
        }
      }
    }

  ngOnInit() {
  
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id']; // (+) converts string 'id' to a number
      //alert(this.id);
      this._JobService.getJob(this.id)
      .subscribe( 
        data => this.handleSuccess(data),
       err => this.handleError(err)
       //() => console.log('ok')
    );
      // In a real app: dispatch action to load the details here.
   });
  }

  showDescription = true;
  showDetail = true;
  toggleDescription(){
    this.showDescription = !this.showDescription;
  }
  toggleDetail(){
    this.showDetail = !this.showDetail;
  }

  handleSuccess(data){
    console.log(data.data.job.submissions); 
    this.job = data.data.job;
    this.title = this.job.title + ' - ' +this.job.job_type;
    this.isLoading = false;
  }

  handleError(err){
    console.log(err);
    this.router.navigateByUrl('/login');
  }

  showInList(){
    this.isList = true;
    this.isGrid = false;
  }

  showInGrid(){
    this.isList = false;
    this.isGrid = true;
  }
  
  toggleSkillsCount(){
    if(this.defaultSkillsCount==10) {
      this.defaultSkillsCount = this.job.skills.length;
      this.showMoreText = "less";
    }else{
      this.showMoreText = "more";
      this.defaultSkillsCount = 10;
    }
  }
}


