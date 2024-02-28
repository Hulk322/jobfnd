import { Component, OnInit, Input } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-submissions-list',
  templateUrl: './submissionsList.component.html',
  styleUrls: ['./submissionsList.component.css']
})
export class SubmissionsListComponent {
@Input() submissionsData: any[];
  
  defaultSkillsLength : number = 2;
  showAllSkills : boolean = false;
  pageObj ={
    page : 1,
    pageSize: 10,
    totalElements : 0
  }

  constructor(  private router: Router ) { }

  pageChange(selectedPage){
    this.pageObj.page = selectedPage;
  }

   goToView(submission_id) {
     this.router.navigateByUrl('/client/submissions/'+submission_id);
   }

}
