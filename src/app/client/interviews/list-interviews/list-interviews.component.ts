import { Component, OnInit } from '@angular/core';
import { InterviewService } from 'src/Services/client/interview.service';
import { ErrorService } from 'src/Services/shared/error.service';

@Component({
  selector: 'app-list-interviews',
  templateUrl: './list-interviews.component.html',
  styleUrls: ['./list-interviews.component.css']
})
export class ListInterviewsComponent implements OnInit {

  interviews = [];
  isLoading  = false;
  showType : String = 'all';
  search_keyword = "";
  limit = "";
  sort_by = "";
  status = "";
  view_type = "grid";
  pageObj ={
    page : 1,
    pageSize: 10,
    totalElements : 0
  };

  constructor(private _interview: InterviewService, 
    private _ErrorService: ErrorService) { }

  ngOnInit() {
    this.allInterviews();
  }

  allInterviews(){
    this.isLoading = true;
    this.showType = 'all';
    this._interview.getAllInterviews(this.pageObj.page).subscribe(
      data => this.handleSuccess(data),
      error => this.handleError(error)
    );
  }

  todayInterviews(){
    this.isLoading = true;
    this.showType = 'today';
    this._interview.getTodayInterviews(this.pageObj.page).subscribe(
      data => this.handleSuccess(data),
      error => this.handleError(error)
    );
  }

  weekInterviews(){
    this.isLoading = true;
    this.showType = 'week';
    this._interview.getTodayInterviews(this.pageObj.page).subscribe(
      data => this.handleSuccess(data),
      error => this.handleError(error)
    );
  }

  sortAscInterviews(){
    this.isLoading = true;
    this.showType = 'asc';
    this._interview.getSortAscInterviews(this.pageObj.page).subscribe(
      data => this.handleSuccess(data),
      error => this.handleError(error)
    );
  }

  sortDescInterviews(){
    this.isLoading = true;
    this.showType = 'desc';
    this._interview.getSortDescInterviews(this.pageObj.page).subscribe(
      data => this.handleSuccess(data),
      error => this.handleError(error)
    );
  }

  getInterviewsByStatus(status){
    this.isLoading = true;
    this.showType = 'status';
    this.status = status;
    this._interview.getInterviewsByStatus(status, this.pageObj.page).subscribe(
      data => this.handleSuccess(data),
      error => this.handleError(error)
    );
  }

  getInterviewsByKeyword(){
    this.isLoading = true;
    this.showType = 'search';
    this._interview.getInterviewsByKeyword(this.search_keyword, this.pageObj.page).subscribe(
      data => this.handleSuccess(data),
      error => this.handleError(error)
    );
  }

  handleSuccess(data) {
    this.interviews = data.data.interviews.data;
    this.pageObj.pageSize = data.data.interviews.per_page;
    this.pageObj.totalElements = data.data.interviews.total;
    this.isLoading = false;
  }

  pageChange(selectedPage){
    this.pageObj.page = selectedPage;

    if(this.showType == 'all') 
      this.allInterviews();
    else if(this.showType=='today')
      this.todayInterviews();
    else if(this.showType=='week')
      this.weekInterviews();
    else if(this.showType=='asc')
      this.sortAscInterviews();
    else if(this.showType=='desc')
      this.sortDescInterviews();
    else if(this.showType=='status')
      this.getInterviewsByStatus(this.status);
    else if( this.showType == 'search' )
      this.getInterviewsByKeyword();
  }

  handleError(error) {
    console.log(error);
  }

  deleteInterview(id, interview) {
    var answer = confirm('Are you sure you want to delete this interview?');
    if (answer) {
      this.isLoading = true;
      interview.deleted = true;
      for (let i = 0; i < this.interviews.length; ++i) {
        if (this.interviews[i].id === id) {
          this._interview.delete(id)
            .subscribe(
              data => this.handleDeleteSuccess(data, i),
              err => console.log(err)
            );

        }
      }
    }
  }

  handleDeleteSuccess(data, i){
    this.interviews.splice(i, 1);
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
    this.isLoading = false;
  }

}
