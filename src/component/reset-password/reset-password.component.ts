import { Component, OnInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ErrorService } from 'src/Services/shared/error.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { TokenService } from 'src/Services/token.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  @ViewChild('showpassword', { static: true }) password: ElementRef;
  @ViewChild('eye_show_password', { static: true }) eyeShowPassword: ElementRef;

  public form = {
    password: null,
    password_confirmation: null,
    email: null,
    code: null,

  };

  resetPasswordUrl = environment.baseApiUrlClient + "/setup-password";
  validEmailAndResetCode = false;
  isLoading = false;
  sub;
  private loginUrl = environment.baseApiUrl+"/login";

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


  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private Token: TokenService,
    private _ErrorService: ErrorService,
    @Inject(DOCUMENT) document: any) { 
      let head  = document.getElementsByTagName('head')[0];
      let link  = document.createElement('link');
      link.rel  = 'stylesheet';
      link.type = 'text/css';
      link.href = 'assets/css/style.css'; 
      head.appendChild(link);
     }

  ngOnInit() {

    localStorage.clear();

    this.sub = this.route.params.subscribe(params => {
      this.form.email = params['email']; // (+) converts string 'id' to a number
      this.form.code = params['code']; // (+) converts string 'id' to a number

    });

  }

  onSubmit() {
    this.isLoading = true;
    return this.http.post(this.resetPasswordUrl, this.form).subscribe(
      data => this.handleSuccessPost(data),
      error => this.handleErrorPost(error)
    );
  }

  handleSuccessPost(data) {
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
    //this.form.email = '';
    //this.form.code = '';
    //this.form.password_confirmation = '';
    //this.form.password = '';
    localStorage.setItem('setup_password', 'true');
    this.doLogin();
    //this.isLoading = false;
    /*setTimeout(() => {
      this.router.navigateByUrl('login');
    }, 2000);  //2s*/
  }

  doLogin(){
    return this.http.post(this.loginUrl, this.form).subscribe(
      data =>this.handleSuccessLogin(data),
      error => this.handleError(error)
    );
  }

  handleSuccessLogin(data) {
    //console.log(data);
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
    
    this.Token.handle(data.data.token);
    
    localStorage.removeItem('is_client');
    localStorage.removeItem('is_vendor');
    localStorage.removeItem('is_candidate');
    localStorage.removeItem('is_admin');
    
    localStorage.setItem('is_vendor', data.data.user.type == 'vendor' ? 'true' : '' );
    localStorage.setItem('is_client', data.data.user.type == 'client' ? 'true'  : ''  );
    localStorage.setItem('is_candidate', data.data.user.type == 'candidate' ? 'true'  : '' );
    localStorage.setItem('is_admin', data.data.user.type == 'admin' ? 'true'  : '' );
    localStorage.setItem('full_name', data.data.user.first_name + " " + data.data.user.last_name);
    localStorage.setItem('id', data.data.user.id);
    localStorage.setItem('user', data.data.user);
    localStorage.setItem('profile_picture', data.data.user.meta.profilePictureFullUrl);
    //this._ErrorService.flashMessage({'type': 'success', 'messages': data.msg } );
    
    //this.isLoading = false;
    //console.log(data);
    if (data.data.redirect_url == 'your-organizations') {
      this.router.navigateByUrl('your-organizations');
    }else{
      if(data.data.user.type == 'candidate')
      {

        localStorage.setItem('saved_jobs_count', data.data.stats.saved);
    localStorage.setItem('notifications_count', data.data.stats.unredNotifications);

        if(data.data.user.first_time!=1)
          this.router.navigateByUrl('candidate/profile');
        else
           this.router.navigateByUrl('candidate/dashboard');
          //window.open( data.data.redirect_url, '_self');  
      }
      else
        window.open( data.data.redirect_url, '_self');  
    }
  }

  handleErrorPost(error) {
    this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
    this.isLoading = false;
  }

  handleError(error) {
    this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
    this.isLoading = false;
  }


}