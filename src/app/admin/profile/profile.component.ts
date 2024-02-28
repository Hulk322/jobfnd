import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {environment} from 'src/environments/environment';
import { ErrorService } from 'src/Services/shared/error.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  profileUrl =  environment.baseApiUrl+"/admin/profile";
  fileToUpload: File = null;
  user = {
    first_name:null,
    last_name:null,
    email:null,
    meta: {
      phone: null,
      profile_picture:null,
    }
  };
  errors:any;
  success:any;
  isLoading = false;

  private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
  private httpOptions = {
    headers: this.headers_object
  };

  constructor(
          private http:HttpClient,
          private _ErrorService: ErrorService) 
          { }

  ngOnInit() {
    return this.http.get(this.profileUrl, this.httpOptions).subscribe(
      data => this.handleSuccess(data),
      error => this.handleError(error)
    );
  }

  handleSuccess(data){
    //console.log(data);
    this.user = data.data.profile;
  }

  handleError(error){
    console.log(error);
  }

  handleFileUpload(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  onSubmit()
  {
    let formData = new FormData();
    
    for ( var key in this.user ) {
          formData.append(key, this.user[key]);
    }

    for ( var key in this.user.meta ) {
      formData.append(key, this.user.meta[key]);
    }
    
    formData.append('profile_picture', this.fileToUpload);

    //console.log(formData);

    return this.http.post(this.profileUrl, formData, this.httpOptions).subscribe(
      data =>this.handleSuccessPost(data),
      error => this.handleErrorPost(error)
    );
  }

  handleSuccessPost(data){
    this._ErrorService.flashMessage({'type': 'success', 'messages': data.msg } );
		this.isLoading = false;
  }

  handleErrorPost(error){
    console.log(error.error);
	  this._ErrorService.flashMessage( {'type': 'error', 'messages': error.error } );
	  this.isLoading = false;
  }


}
