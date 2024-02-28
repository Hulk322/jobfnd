import { Component, OnInit, Input } from '@angular/core';
import { PublicJobService } from 'src/Services/public_portal/public-job.service';
import { ErrorService } from 'src/Services/shared/error.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-subscribe-to-job',
  templateUrl: './subscribe-to-job.component.html',
  styleUrls: ['./subscribe-to-job.component.css']
})
export class SubscribeToJobComponent implements OnInit {

  @Input() job_slug;
  isLoading = false;
  name: String;
  email: String;

  constructor(
    private publicJobService: PublicJobService,
    private _ErrorService: ErrorService,
    private router: Router
    ) { }

  ngOnInit() {
  }

  subscribe(){
    this.isLoading = true;
    this.publicJobService.subscribeToJob(this.job_slug, this.name, this.email)
        .subscribe( 
          data => this.handleSuccess(data),
         err => this.handleError(err)
      );
  }

  handleSuccess(data)
  {
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
    this.name = '';
    this.email = '';
    this.isLoading = false;
  }

  handleError(error){
    this._ErrorService.flashMessage( {'type': 'error', 'messages': error.error } );
    this.isLoading = false;
  }

}
