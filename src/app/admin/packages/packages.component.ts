import { Component, OnInit } from '@angular/core';
import { PackagesService } from 'src/Services/admin/packages.service';
import { ErrorService } from 'src/Services/shared/error.service';
import {environment} from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-packages',
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.css']
})
export class PackagesComponent implements OnInit {

isLoading = false;
  packages = [];
  pageObj ={
    page : 1,
    pageSize: 15,
    totalElements : 0
  };
  _package = {
    id: null,
    name: null,
    type: null,
    description: null,
    price: null,
    job_limit: null,
  };
  
 editPackageUrl =  environment.baseApiUrl+"/admin/packages/";

 	private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
 	private httpOptions = {
   	 headers: this.headers_object
  };
  constructor(
              private _PackagesService: PackagesService,
  		        private _ErrorService: ErrorService,
  		        private http:HttpClient
              ) { }

  	ngOnInit() {
 	 	this.getPackages(); 
  	}

   getPackages(){
    this.isLoading = true;
    this._PackagesService.get(this.pageObj.page)
      .subscribe(
        data => this.handleSuccess(data),
        error => this.handleError(error)
      );
  }

   handleSuccess(data) {
    this.packages = data.data.packages;
    this.pageObj.pageSize = data.data.packages.per_page;
    this.pageObj.totalElements = data.data.packages.total;
    this.isLoading = false;
  	}

   handleError(error) {
    this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
    this.isLoading = false;
  }

  pageChange(selectedPage){
    this.pageObj.page = selectedPage;
    this.getPackages();
  }

   viewPackage(_package){
    this._package = Object.assign({}, _package);
  }
  
  editPackage(_package){
  	this._package = Object.assign({}, _package);
  }

   updatePackage(){
   	let formData = new FormData();
    
    for ( var key in this._package ) {
          formData.append(key, this._package[key]);
    }
   	return this.http.post(this.editPackageUrl+this._package.id+"/edit", formData, this.httpOptions).subscribe(
      data =>this.handleSuccessPost(data),
      error => this.handleError(error)
    	); 
	 }

	handleSuccessPost(data){
	    var package_form = this.packages.find(x => x.id === this._package.id);
	    package_form.name = data.data.package.name;
	    package_form.type = data.data.package.type;
	    package_form.job_limit = data.data.package.job_limit;
	    package_form.description = data.data.package.description;
	    this._ErrorService.flashMessage({'type': 'success', 'messages': data.msg } );
		  this.isLoading = false;
	  }

	deletePackage(id, _package) {
	  var answer = confirm('Are you sure you want to delete this package?');
	  if (answer) {
	    this.isLoading = true;
	    _package.deleted = true;
	    for (let i = 0; i < this.packages.length; ++i) {
	      if (this.packages[i].id === id) {
	        this._PackagesService.delete(id)
	          .subscribe(
	            data => this.handleDeleteSuccess(data, i),
	            err => this.handleError(err)
	          );
	      }
	    }
	  }
	}

	handleDeleteSuccess(data, i){
	  this.packages.splice(i, 1);
	  this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
	}
}
