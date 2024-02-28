import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import {environment} from 'src/environments/environment';
import { ErrorService } from 'src/Services/shared/error.service';


@Component({
  selector: 'app-your-organizations',
  templateUrl: './your-organizations.component.html',
  styleUrls: ['./your-organizations.component.css']
})
export class YourOrganizationsComponent implements OnInit {
	
  Url =  environment.baseApiUrl+"/your-organizations";
  UrlSelect =  environment.baseApiUrl+"/select-organization";
  organizations = '';
   
  isLoading = false;
  public form = {
  	organization_id: null
  }

  private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
  private httpOptions = {
    headers: this.headers_object
  };
  

    constructor(
  	  private http:HttpClient,
  	  private _ErrorService: ErrorService
  	) { }

  	

    ngOnInit() {
    	console.log(localStorage.getItem('token')); 
	  	return this.http.get(this.Url, this.httpOptions).subscribe(
	  		data => this.setOrganziations(data)
	  	);

	 }
	setOrganziations(data) {
		this.organizations = data.data.organizations 
	}

	onSubmit() {
	 	this.isLoading = true;
	 	console.log(this.form);
	 	return this.http.post(this.UrlSelect, this.form , this.httpOptions).subscribe(
	 	  data =>this.handleSuccess(data),
	 	  error => this.handleError(error)
	 	);
	}

    handleSuccess(data){
    	console.log(data);

    	localStorage.removeItem('is_client');
    	localStorage.removeItem('is_vendor');
    	localStorage.removeItem('is_candidate');
    	localStorage.removeItem('is_admin');

    	localStorage.setItem('is_vendor', data.data.user.type == 'vendor' ? 'true' : '' );
    	localStorage.setItem('is_client', data.data.user.type == 'client' ? 'true'  : ''  );
    	localStorage.setItem('is_candidate', data.data.user.type == 'candidate' ? 'true'  : '' );
    	localStorage.setItem('is_admin', data.data.user.type == 'admin' ? 'true'  : '' );

  	    window.open( data.data.redirect_url, '_self'); 
  	    this.isLoading = false;
  	}

    handleError(error){
    	  console.log(error);
    	  this._ErrorService.flashMessage( {'type': 'error', 'messages': error.error } );
    	  this.isLoading = false;
    }

    


}
