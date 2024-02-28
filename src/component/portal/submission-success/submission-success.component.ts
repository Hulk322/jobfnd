import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-submission-success',
  templateUrl: './submission-success.component.html',
  styleUrls: ['./submission-success.component.css']
})
export class SubmissionSuccessComponent implements OnInit {

  job_slug;

  constructor(private _activatedRoute: ActivatedRoute, private _router:Router) { 
    _activatedRoute.queryParams.subscribe(
      params => this.job_slug = params['job_slug'] );
   }

  ngOnInit() {
  }

}
