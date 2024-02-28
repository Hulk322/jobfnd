import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OnBoardService } from 'src/Services/client/on-board.service';
import { ErrorService } from 'src/Services/shared/error.service';

@Component({
  selector: 'app-list-on-boarding',
  templateUrl: './list-on-boarding.component.html',
  styleUrls: ['./list-on-boarding.component.css']
})
export class ListOnBoardingComponent implements OnInit {

  isLoading = false;
  on_boardings = [];
  search_keyword = "";

  constructor(private _onboard: OnBoardService,
              private _ErrorService: ErrorService) { }

  ngOnInit() {
    this.isLoading = true;
    this._onboard.getList().subscribe(
      data => this.handleSuccess(data),
      error => this.handleError(error)
    );
  }

  handleSuccess(data) {
    console.log(data);
    this.on_boardings = data.data.on_boards.data;
    //if(data.msg.success != 'Request completed successfully')
      //this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
    this.isLoading = false;
  }

  handleError(error) {
    console.log(error);
    this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
    this.isLoading = false;
  }

  deleteOnBoard(id, on_board) {
    var answer = confirm('Are you sure you want to delete this OnBoarding?');
    if (answer) {
      this.isLoading = true;
      on_board.deleted = true;
      for (let i = 0; i < this.on_boardings.length; ++i) {
        if (this.on_boardings[i].id === id) {
          this._onboard.delete(id)
            .subscribe(
              data => this.handleDeleteSuccess(data, i),
              err => console.log(err)
            );

        }
      }
    }
  }

  handleDeleteSuccess(data, i){
    this.on_boardings.splice(i, 1);
    console.log(data);
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
    this.isLoading = false;
  }

  getOnBoardingsByKeyword(){
    console.log('ok');
  }


}
