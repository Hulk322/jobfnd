import { Component, OnInit } from '@angular/core';
import {BackgroundVerificationService } from 'src/Services/client/background-verification.service';
import { ErrorService } from 'src/Services/shared/error.service';

@Component({
  selector: 'app-background-verification-list',
  templateUrl: './background-verification-list.component.html',
  styleUrls: ['./background-verification-list.component.css']
})
export class BackgroundVerificationListComponent implements OnInit {

  isLoading = false;
  background_verifications = [];
  search_keyword = "";

  constructor(private _bg_check: BackgroundVerificationService,
              private _ErrorService: ErrorService) { }

  ngOnInit() {
    this.isLoading = true;
    this._bg_check.getList().subscribe(
      data => this.handleSuccess(data),
      error => this.handleError(error)
    );
  }

  handleSuccess(data) {
    console.log(data);
    this.background_verifications = data.data.backgroundVarifacations;
    //if(data.msg.success != 'Request completed successfully')
      //this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
    this.isLoading = false;
  }

  handleError(error) {
    console.log(error);
    this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
    this.isLoading = false;
  }
  
}