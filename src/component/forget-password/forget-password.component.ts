import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ErrorService } from 'src/Services/shared/error.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {

  public form = {
    email: null
  };
  isLoading = false;
  private forgotPasswordUrl = environment.baseApiUrlClient+"/forgot-password";

  constructor(private http: HttpClient,
    private _ErrorService: ErrorService,
    private router: Router ) { }

  ngOnInit() {
  }

  onSubmit(){
    this.isLoading = true;
    return this.http.post(this.forgotPasswordUrl, this.form).subscribe(
      data =>this.handleSuccess(data),
      error => this.handleError(error)
    );
  }

  handleSuccess(data){
    this.form.email = '';
    this._ErrorService.flashMessage({'type': 'success', 'messages': data.msg } );
    this.router.navigateByUrl('login');
    this.isLoading = false;
  }

  handleError(error){
    this._ErrorService.flashMessage( {'type': 'error', 'messages': error.error } );
    this.isLoading = false;
  }
}