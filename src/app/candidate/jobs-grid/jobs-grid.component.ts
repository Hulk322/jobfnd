import { Component, OnInit, Input } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-jobs-grid',
  templateUrl: './jobs-grid.component.html',
  styleUrls: ['./jobs-grid.component.css']
})
export class JobsGridComponent implements OnInit {
@Input() jobs: any[];
  constructor( private router: Router) { }

  ngOnInit() {
  }

   goToJob(job){
    this.router.navigate(['/candidate/applied-jobs/'+job.id]);
  }

  toggleSavedJob(id){
    console.log(id);
  }

}
