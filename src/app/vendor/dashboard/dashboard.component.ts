import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {environment} from 'src/environments/environment';
import { ErrorService } from 'src/Services/shared/error.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class VendorDashboardComponent implements OnInit {

  Url =  environment.baseApiUrl+"/vendor/dashboard";
  message = '';
  
  private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
  private httpOptions = {
    headers: this.headers_object
  }

  constructor(
  	  private http:HttpClient,
  	  private _ErrorService: ErrorService
  	) { }

  ngOnInit() {
  	
  	return this.http.get(this.Url, this.httpOptions).subscribe(
  	  data => this.handleSuccess(data),
  	  error => this.handleError(error)
  	);

  }

  	handleSuccess(data){
	     console.log(data);
	     this.message = data;
	      this._ErrorService.flashMessage({'type': 'success', 'messages': data.msg } );
	  }


  	handleError(error){
  	  console.log(error);
  	  this._ErrorService.flashMessage( {'type': 'error', 'messages': error.error } );
  	}


}
