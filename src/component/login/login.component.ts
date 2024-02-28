import { Component, OnInit, ElementRef, Inject} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenService } from 'src/Services/token.service';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ErrorService } from 'src/Services/shared/error.service';
import { ViewChild } from '@angular/core';
import { NotificationService as CandidateNS } from 'src/Services/candidate/notification.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChild('showpassword', { static: true }) password: ElementRef;
  @ViewChild('eye_show_password', { static: true }) eyeShowPassword: ElementRef;

  public form = {
    email: null,
    password: null
  };
  business = {
    display_score: [],
  };
  chatbot = 'false';
  fromchatbot = 'fromchatbot';
  email : String = '';
  otp: String = '';
  token: string;
  redirect_url: string;
  private headers_object;
  private httpOptions;

  isLoading = false;
  public error = null;
  public success = null;
  public messages = null;

  private loginUrl = environment.baseApiUrl + "/login";
  private chatbotLogin = environment.baseApiUrlClient + "/chatbot/otp-login";
  private socialLoginCompleteUrl = environment.baseApiUrl + "/complete-social-login";

  constructor(
    private http: HttpClient,
    private Token: TokenService,
    private router: Router,
    private route: ActivatedRoute,
    private _CandidateNotificationService: CandidateNS,
    private _ErrorService: ErrorService,
    @Inject(DOCUMENT) document: any
  ) {


    this.route.queryParams.subscribe(params => {

       if(params['fromchatbot'] != ''){
        this.fromchatbot = params['fromchatbot'];
      }

      if( params['email'] != '' ){
        this.email = params['email'];
      }
      /*
      if( params['otp'] != '' ){
        this.otp = params['otp'];
      } */

      this.token = params['token'];
      this.redirect_url = params['redirect_url'];

      if(this.token != '' && this.token != null){
      this.Token.handle(this.token);
      //localStorage.setItem('is_client', 'true' );
      //window.open( this.redirect_url, '_self');
      //complete-social-login
      this.headers_object = new HttpHeaders().set("Authorization", "Bearer " + this.token);
      this.httpOptions = {
        headers: this.headers_object
      };


        this.http.get(this.socialLoginCompleteUrl, this.httpOptions).subscribe(
            data => this.handleSocialCompleteSuccess(data),
            error => this.handleError(error)
        );
      }

    });

    let chatbot =  document.getElementById('svms-chat-widget');
    chatbot.style.display = "block";
  }

  onSubmit() {
    this.isLoading = true;
    this.error = null;
    return this.http.post(this.loginUrl, this.form).subscribe(
      data => this.handleSuccess(data),
      error => this.handleError(error)
    );
  }

  handleSocialCompleteSuccess(data) {
    console.log(data);
    this.Token.handle(data.data.token);

    localStorage.removeItem('is_client');
    localStorage.removeItem('is_vendor');
    localStorage.removeItem('is_candidate');
    localStorage.removeItem('is_admin');

    localStorage.setItem('is_vendor', data.data.user.type == 'vendor' ? 'true' : '');
    localStorage.setItem('is_client', data.data.user.type == 'client' ? 'true' : '');
    localStorage.setItem('is_candidate', data.data.user.type == 'candidate' ? 'true' : '');
    localStorage.setItem('is_admin', data.data.user.type == 'admin' ? 'true' : '');
    localStorage.setItem('full_name', data.data.user.first_name + " " + data.data.user.last_name);
    localStorage.setItem('user', data.data.user);
    localStorage.setItem('profile_picture', data.data.user.meta.profilePictureFullUrl);
    //this._ErrorService.flashMessage({'type': 'success', 'messages': data.msg } );

    //this.isLoading = false;
    //console.log(data);
    if (data.data.redirect_url == 'your-organizations') {
      this.router.navigateByUrl('your-organizations');
    } else {
      if (data.data.user.type == 'candidate') {

        localStorage.setItem('saved_jobs_count', data.data.stats.saved);
        localStorage.setItem('notifications_count', data.data.stats.unredNotifications);

        if (data.data.user.first_time != 1)
          this.router.navigateByUrl('candidate/profile');
        else
          this.router.navigateByUrl('candidate/dashboard');
        //window.open( data.data.redirect_url, '_self');
      }
      else
        window.open(data.data.redirect_url, '_self');
    }
  }

  handleSuccess(data) {
    this.Token.handle(data.data.token);
    this.business = data.data.business_information;
    localStorage.removeItem('is_client');
    localStorage.removeItem('is_vendor');
    localStorage.removeItem('is_candidate');
    localStorage.removeItem('is_admin');

    localStorage.setItem('is_vendor', data.data.user.type == 'vendor' ? 'true' : '');
    localStorage.setItem('is_client', data.data.user.type == 'client' ? 'true' : '');
    localStorage.setItem('is_candidate', data.data.user.type == 'candidate' ? 'true' : '');
    localStorage.setItem('is_admin', data.data.user.type == 'admin' ? 'true' : '');
    localStorage.setItem('full_name', data.data.user.first_name + " " + data.data.user.last_name);
    localStorage.setItem('id', data.data.user.id);
    localStorage.setItem('user', data.data.user);
    localStorage.setItem('is_active', data.data.user.is_active);
    localStorage.setItem('profile_picture', data.data.user.meta.profilePictureFullUrl);
    localStorage.setItem('resume_uploaded', data.data.user.resume_uploaded);

    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });

    this.isLoading = false;
    //console.log(data);
    if (data.data.redirect_url == 'your-organizations') {
      this.router.navigateByUrl('your-organizations');
    } else {
      if (data.data.user.type == 'candidate') {
        localStorage.setItem('saved_jobs_count', data.data.stats.saved);
        localStorage.setItem('notifications_count', data.data.stats.unredNotifications);
        localStorage.setItem('setup_password', data.data.user.setup_password);

        localStorage.setItem('email', data.data.user.email);

        if(localStorage.getItem('job_slug_landed') != '' && localStorage.getItem('job_slug_landed') != null){
          var job_slug_landed = localStorage.getItem('job_slug_landed');
          localStorage.removeItem('job_slug_landed');
          this.router.navigateByUrl('candidate/job-questions/' + job_slug_landed);
        }

        else{
          if (data.data.user.first_time == 1)
            this.router.navigateByUrl('candidate/profile');
          else
            this.router.navigateByUrl('candidate/dashboard');
          //window.open( data.data.redirect_url, '_self');
        }
      }
      else if (data.data.user.type == 'client') {
        //localStorage.setItem('saved_jobs_count', data.data.stats.saved);
        localStorage.setItem('notifications_count', data.data.stats.unredNotifications);
        //localStorage.setItem('setup_password', data.data.user.setup_password);

        localStorage.setItem('email', data.data.user.email);

        if (data.data.user.first_time == 1)
          this.router.navigateByUrl('client/business-setup');
        else
          this.router.navigateByUrl('client/dashboard');
      }
      else
        window.open(data.data.redirect_url, '_self');
    }
    if (this.business.display_score[1] == "simplifyai") {
      localStorage.setItem("display_simplifyai_score", "true");
    } else {
      localStorage.setItem("display_simplifyai_score", "false");
    }
    if (this.business.display_score[0] == "sovren") {
      localStorage.setItem("display_sovren_score", "true");
    } else {
      localStorage.setItem("display_simplifyai_score", "false");
    }

  }

  signup() {
    this.router.navigateByUrl('signup');
  }

  handleSavedJobsCountSuccess(data) {
    localStorage.setItem('saved_jobs_count', data.data.saved_jobs);

  }

  social_login(network) {
    this.http.get(this.loginUrl + "/" + network).subscribe(
      data => this.handleSocialSuccess(data),
      error => console.log(error)
    )
  }

  handleSocialSuccess(data) {
    console.log(data.data.redirect_url);
    window.location = data.data.redirect_url;
  }

  handleError(error) {
    this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
    this.isLoading = false;
  }

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

  msg_array = [];
  ngOnInit() {
    /*let body = document.getElementsByTagName('body')[0];
    body.classList.remove("menu-position-top");
    body.classList.remove("full-screen");
    body.classList.remove("with-content-panel");   //remove the class
    body.classList.add("auth-wrapper");   //add the class*/

    //document.getElementById("show-password").addEventListener("click", this.showPassword);

    //this.eyeShowPassword.nativeElement.dispatchEvent(this.showPassword);

    this.messages = this.route.snapshot.paramMap.get("messages");
    if (this.messages) {
      this._ErrorService.flashMessage({ 'type': 'success', 'messages': { "success": [this.messages] } });
    }

    //alert(this.chatbot);
    if(this.fromchatbot == 'true'){
      this.msg_array = [];
      this.msg_array.push('Processing request. Please wait ... ');
      var msg = {
        data: [],
        msg: this.msg_array,
        messages: []
        };
      this._ErrorService.flashMessage({ 'type': 'success', 'messages': { "success": [this.msg_array] } });
      //send request to api end point
      return this.http.post(this.chatbotLogin, { email: this.email, otp: this.otp }).subscribe(
        data => this.handleSuccess(data),
        error => this.handleError(error)
      );
      //show message
    }

  }

}
