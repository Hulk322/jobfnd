import { Component, OnInit, Input } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-submissions-grid',
  templateUrl: './submissionsGrid.component.html',
  styleUrls: ['./submissionsGrid.component.css']
})
export class SubmissionsGridComponent {
@Input() submissionsData: any[];
  
  defaultSkillsLength : number = 2;
  showAllSkills : boolean = false;

  constructor(private router: Router) { }

  goToView(submission_id) {
    this.router.navigateByUrl('/vendor/submissions/'+submission_id);
  }

}
