import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { JobsService } from 'src/Services/candidate/jobs.service';
import { ErrorService } from 'src/Services/shared/error.service';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.css']
})
export class JobComponent implements OnInit {

  public job = {
    id: null,
    title: null,
    job_type: null,
    created_at: null,
    deleted: false,
    salary_type:null,
    start_date:null,
    tentative_end_date:null,
    category: null,
    currency: null,
    min_rate: null,
    max_rate: null,
    salary: null,
    description: '',
    openings: 0,
    experience: '',
    address: '',
    category_id: null,
    additional_detail: '',
    hasApplied: false,
    reason_for_hire: '',
    client_organization: {
      business_logo: null,
      businessLogoFullUrl: null
    },
    skills: [],
    other_skills: [],
    descriptions: [],
    submissions: [],
    interviews: [],
    offers: []
  };
  isLoading = true;
  id: number;
  private sub: any;
  defaultSkillsCount = 10;

  constructor(private route: ActivatedRoute,
    private _JobService: JobsService,
    private router: Router,
    private _ErrorService: ErrorService) { }

    

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

  handleSuccess(data){
    console.log(data.data.job);
    this.job = data.data.job;
    this.isLoading = false;
  }

  handleError(err){
    console.log(err);
    //this.router.navigateByUrl('/login');
  }

  
  showDescription = true;
  showDetail = true;
  toggleDescription(){
    this.showDescription = !this.showDescription;
  }
  toggleDetail(){
    this.showDetail = !this.showDetail;
  }

  applyToJob(job_id){
    this._JobService.applyToJob(job_id)
        .subscribe( 
          data => this.handleJobApplySuccess(data),
         err => this.handleJobApplyError(err)
         //() => console.log('ok')
      );
  }

  handleJobApplySuccess(data)
  {
   
    this.job.hasApplied=true;
    this._ErrorService.flashMessage({'type': 'success', 'messages': data.msg } );
  }

  handleJobApplyError(error){
     console.log(error);
     this._ErrorService.flashMessage( {'type': 'error', 'messages': error.error } );
   }

   toggleSkillsCount(){
     //something here
   }

   showMoreText(){
     
   }

}
