import { Component, OnInit } from '@angular/core';
import { InterviewService } from  'src/Services/vendor/interview.service';

@Component({
  selector: 'app-list-interviews',
  templateUrl: './list-interviews.component.html',
  styleUrls: ['./list-interviews.component.css']
})
export class ListInterviewsComponent implements OnInit {

  interviews = [];
  search_keyword = '';
  isLoading = false;

  constructor(private _interview:InterviewService) { }

  ngOnInit() {
    this.isLoading = true;
    this._interview.getAllInterviews().subscribe(
      data => this.handleSuccess(data),
      error => this.handleError(error)
    );
  }

  todayInterviews(){
    this.isLoading = true;
    this._interview.getTodayInterviews().subscribe(
      data => this.handleSuccess(data),
      error => this.handleError(error)
    );
  }

  weekInterviews(){
    this.isLoading = true;
    this._interview.getTodayInterviews().subscribe(
      data => this.handleSuccess(data),
      error => this.handleError(error)
    );
  }

  sortAscInterviews(){
    this.isLoading = true;
    this._interview.getSortAscInterviews().subscribe(
      data => this.handleSuccess(data),
      error => this.handleError(error)
    );
  }

  sortDescInterviews(){
    this.isLoading = true;
    this._interview.getSortDescInterviews().subscribe(
      data => this.handleSuccess(data),
      error => this.handleError(error)
    );
  }

  getInterviewsByStatus(status){
    this.isLoading = true;
    this._interview.getInterviewsByStatus(status).subscribe(
      data => this.handleSuccess(data),
      error => this.handleError(error)
    );
  }

  getInterviewsByKeyword(){
    this.isLoading = true;
    this._interview.getInterviewsByKeyword(this.search_keyword).subscribe(
      data => this.handleSuccess(data),
      error => this.handleError(error)
    );
  }

  handleSuccess(data) {
    this.interviews = data.data.interviews.data;
    this.isLoading = false;
  }

  handleError(error) {
    console.log(error);
  }

  deleteInterview(id, interview){
    console.log(id+interview);
  }


}
