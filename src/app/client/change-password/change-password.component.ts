import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {environment} from 'src/environments/environment';
import { ErrorService } from 'src/Services/shared/error.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ClientChangePasswordComponent implements OnInit {

  @ViewChild('showpassword', { static: true }) password: ElementRef;
  @ViewChild('eye_show_password', { static: true }) eyeShowPassword: ElementRef;
  @ViewChild('shownewpassword', { static: true }) new_password: ElementRef;
  @ViewChild('eye_show_new_password', { static: true }) eyeShowNewPassword: ElementRef;

  user = {
    old_password:null,
    password:null,
    password_confirmation:null
  };
  errors:any;
  success:any;
  isLoading = false;
  changePasswordUrl = environment.baseApiUrlClient+"/client/change-password";

  constructor(
    private http:HttpClient,
    private _ErrorService: ErrorService
    ) { }

    showPassword(obj) {
      //console.log(obj);
      var x = this.password.nativeElement;
      if (x.type === "password") {
        this.eyeShowPassword.nativeElement.classList.remove("fa-eye");
        this.eyeShowPassword.nativeElement.classList.add("fa-eye-slash");
        x.type = "text";
      } else {
        this.eyeShowPassword.nativeElement.classList.remove("fa-eye-slash");
        this.eyeShowPassword.nativeElement.classList.add("fa-eye");
        x.type = "password";
      }
    }
  
    showNewPassword(obj) {
      //console.log(obj);
      var x = this.new_password.nativeElement;
      if (x.type === "password") {
        this.eyeShowNewPassword.nativeElement.classList.remove("fa-eye");
        this.eyeShowNewPassword.nativeElement.classList.add("fa-eye-slash");
        x.type = "text";
      } else {
        this.eyeShowNewPassword.nativeElement.classList.remove("fa-eye-slash");
        this.eyeShowNewPassword.nativeElement.classList.add("fa-eye");
        x.type = "password";
      }
    }
  

  private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
  private httpOptions = {
    headers: this.headers_object
  };

  ngOnInit() {
  }

  onSubmit(){
    this.isLoading = true;
    return this.http.post(this.changePasswordUrl, this.user, this.httpOptions).subscribe(
      data =>this.handleSuccess(data),
      error => this.handleError(error)
    );
  }

  handleSuccess(data){
    this._ErrorService.flashMessage({'type': 'success', 'messages': data.msg } );
		this.isLoading = false;
    
  }

  handleError(error){
    console.log(error.error);
	  this._ErrorService.flashMessage( {'type': 'error', 'messages': error.error } );
	  this.isLoading = false;
  }


}
