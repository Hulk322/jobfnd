import { Component, OnInit, Input } from '@angular/core';
import { PublicJobService } from 'src/Services/public_portal/public-job.service';
import { ErrorService } from 'src/Services/shared/error.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-similar-jobs',
  templateUrl: './similar-jobs.component.html',
  styleUrls: ['./similar-jobs.component.css']
})
export class SimilarJobsComponent implements OnInit {

  pageObj ={
    page : 1,
    pageSize: 10,
    totalElements : 0
  }

  @Input() job_slug;
  jobs: any[];
  isLoading = false;
  path;
  
  constructor(
    private publicJobService: PublicJobService,
    private _ErrorService: ErrorService,
    private router: Router
    ) { }

  ngOnInit() {
    this.path = this.router.url.split("?")[0];
    this.getJobs();
  }

  getJobs(){
    
    this.publicJobService.getSimilarJobs(this.pageObj.page, this.job_slug)
        .subscribe( 
          data => this.handleSuccess(data),
         err => this.handleError(err)
      );
  }

  handleSuccess(data)
  {
    this.jobs = data.data.similarJobs;
    //this.pageObj.pageSize = data.data.similarJobs.per_page;
    //this.pageObj.totalElements = data.data.similarJobs.total;
  }

  handleError(error){
    this._ErrorService.flashMessage( {'type': 'error', 'messages': error.error } );
    this.isLoading = false;
  }

  goToJob(jobSlug){
    window.scroll(0,0);
    this.router.navigate(['/jobs/'+jobSlug]);
  }


}
