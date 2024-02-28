import { Component, OnInit } from '@angular/core';
import { SettingsService } from 'src/Services/client/settings.service';
import { ErrorService } from 'src/Services/shared/error.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  constructor(private _sttingService: SettingsService,
  				private _ErrorService: ErrorService
  			) { }

  isLoading = false;
  form = {
   	name:'settings',
   	settings: {
     		 client_overtime_rate : null,
     		 client_doubletime_rate : null,
     		 candidate_overtime_rate: null,
     		 candidate_doubletime_rate: null
       }
  };

  ngOnInit() {
  	this.getSetting();
  }

  getSetting() {
  	 this._sttingService.show().subscribe(
  		data => this.handleSuccess(data),
  		error => this.handleError(error)
  		);
  }
  handleSuccess(data){
  	this.form.settings = JSON.parse(data.data.setting.settings);
    this.form.name = data.data.setting.name;
  	this.isLoading = false;
  	
  }

  handleError(error){
     this._ErrorService.flashMessage( {'type': 'error', 'messages': error.error } );
     this.isLoading = false;
   }

  UpdateSetting(){
  	this.isLoading = true;
    let abc = {name: "", settings: ""}; 
  	abc.name = this.form.name;
    abc.settings = JSON.stringify(this.form.settings);
  	this._sttingService.updateSetting(abc).subscribe(
  		data 	=> this.handleUpdateSuccess(data),
  		error 	=> this.handleError(error),
  		);
  }
  handleUpdateSuccess(data) {
  	this._ErrorService.flashMessage({'type': 'success', 'messages': data.msg } );
    this.isLoading = false;
  }

}
