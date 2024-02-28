import { Component, OnInit, Input } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-jobs-list',
  templateUrl: './jobs-list.component.html',
  styleUrls: ['./jobs-list.component.css']
})
export class JobsListComponent implements OnInit {
@Input() jobs: any[];
  constructor( private router: Router) { }

  ngOnInit() {
  }

  goToJob(job){
    this.router.navigate(['/candidate/applied-jobs/'+job.id]);
  }

}
