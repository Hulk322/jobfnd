import { Component, OnInit, Input } from '@angular/core';
import { PublicJobService } from 'src/Services/public_portal/public-job.service';
import { ErrorService } from 'src/Services/shared/error.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-send-job-in-email',
  templateUrl: './send-job-in-email.component.html',
  styleUrls: ['./send-job-in-email.component.css']
})
export class SendJobInEmailComponent implements OnInit {

  @Input() job_slug;
  isLoading = false;
  name: String;
  email: String;
  job_link = location.origin+"/jobs/";

  constructor(
    private publicJobService: PublicJobService,
    private _ErrorService: ErrorService,
    private router: Router,
    private toastr: ToastrService
    ) { }

  ngOnInit() {
    //this.name = localStorage.getItem('full_name');
    //this.email = localStorage.getItem('email');
    this.job_link = this.job_link+this.job_slug;
  }

  sendEmail(){
    this.isLoading = true;
    this.publicJobService.sendEmail(this.job_slug, this.name, this.email)
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

}
