import { Component, OnInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ErrorService } from 'src/Services/shared/error.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TokenService } from 'src/Services/token.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-activate',
  templateUrl: './activate.component.html',
  styleUrls: ['./activate.component.css']
})
export class ActivateComponent implements OnInit {

  @ViewChild('showpassword', { static: true }) password: ElementRef;
  @ViewChild('eye_show_password', { static: true }) eyeShowPassword: ElementRef;

  activateUrl = environment.baseApiUrlClient + "/activate/";
  setUpPasswordUrl = environment.baseApiUrlClient + "/setup-password";
  private loginUrl = environment.baseApiUrl+"/login";

  validEmailAndResetCode = false;
  isLoading = false;
  sub;
  email;
  code;
  activated = false;
  min8 = false;
  oneCapital = false;
  oneLower = false;
  oneNumeric = false;
  oneSpecial = false;
  spaceNotAllowed = false;
  ConfirmPasswordMatch = false;
  disableButton = true;
  public form = {
    email: null,
    code: null,
    password: null,
    password_confirmation: null,
  }

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private _ErrorService: ErrorService,
    private Token: TokenService,
    @Inject(DOCUMENT) document: any) { 
      let head  = document.getElementsByTagName('head')[0];
      let link  = document.createElement('link');
      link.rel  = 'stylesheet';
      link.type = 'text/css';
      link.href = 'assets/css/style.css'; 
      head.appendChild(link);
}

  ngOnInit() {
    this.isLoading = true;
    var slug = localStorage.getItem('job_slug_landed');
    localStorage.clear();

    if(slug!='' && slug!=null)
      localStorage.setItem('job_slug_landed', slug);

    this.sub = this.route.params.subscribe(params => {
      this.email = params['email']; // (+) converts string 'id' to a number
      this.code = params['code']; // (+) converts string 'id' to a number
      return this.http.get(this.activateUrl + this.email + "/" + this.code).subscribe(
        data => this.handleSuccess(data),
        error => this.handleError(error)
      );
    });
  }

  onSubmit() {
    this.isLoading = true;
    return this.http.post(this.setUpPasswordUrl, this.form).subscribe(
      data => this.handleSetupPasswordSuccess(data),
      error => this.handleError(error)
    );
  }

  handleSetupPasswordSuccess(data) {
    console.log(data);
    //this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
    localStorage.setItem('setup_password', 'true');
    //this.isLoading = false;
    this.doLogin();
    //this.router.navigate(['/login', { messages: 'Successfully setup your password please login.' }]);
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
    localStorage.setItem('resume_uploaded', data.data.user.resume_uploaded);
    
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

    //alert(localStorage.getItem('job_slug_landed'));

    if(localStorage.getItem('job_slug_landed') != '' && localStorage.getItem('job_slug_landed') != null){
      var job_slug_landed = localStorage.getItem('job_slug_landed');
      localStorage.removeItem('job_slug_landed');
      this.router.navigateByUrl('candidate/job-questions/' + job_slug_landed);
    }

    else{
        if(data.data.user.first_time == 1)
          this.router.navigateByUrl('candidate/profile');
        else
           this.router.navigateByUrl('candidate/dashboard');
          
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
        window.open( data.data.redirect_url, '_self');  
    }
  }

  already_active=false;
  first_time_loading = true;
  handleSuccess(data) {
    
    console.log(data);
    localStorage.setItem("is_active", "1"); 

    this.validEmailAndResetCode = true;
    this.form.email = data.data.email;
    this.form.code = data.data.code;
    this._ErrorService.flashMessage({'type': 'success', 'messages': data.msg } );
    this.activated = true;
    if(data.data.already_active)
    {
      this.already_active = true;
      this.router.navigateByUrl('login');
    }
    else
    {
      this.first_time_loading = false;
      this.isLoading = false;
    }
  }

  handleError(error) {
    console.log(error);
    this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
    this.isLoading = false;
  }

  showPassword(obj, event) {
    //console.log(obj);
    var x = this.password.nativeElement;
    if (x.type === "password") {
      event.currentTarget.innerHTML = "visibility_off";
      //this.eyeShowPassword.nativeElement.classList.remove("fa-eye");
      //this.eyeShowPassword.nativeElement.classList.add("fa-eye-slash");
      x.type = "text";
    } else {
      event.currentTarget.innerHTML = "visibility";
      // this.eyeShowPassword.nativeElement.classList.remove("fa-eye-slash");
      // this.eyeShowPassword.nativeElement.classList.add("fa-eye");
      x.type = "password";
    }
  }

  validateRegex(password) {
    if (/^\S*$/.test(password)) {
      this.spaceNotAllowed = true;
    } else {
      this.spaceNotAllowed = false;
    }

    if (/\S{8}/.test(password)) {
      this.min8 = true;
    } else {
      this.min8 = false;
    }

    if (/[A-Z]{1}/.test(password)) {
      this.oneCapital = true;
    } else {
      this.oneCapital = false;
    }

    if (/[a-z]{1}/.test(password)) {
      this.oneLower = true;
    } else {
      this.oneLower = false;
    }
    if (/[0-9]{1}/.test(password)) {
      this.oneNumeric = true;
    } else {
      this.oneNumeric = false;
    }
    var Specialpattern = /(?=.*?[#?!@$%^&*-])/;
    if (Specialpattern.test(password)) {
      this.oneSpecial = true;
    } else {
      this.oneSpecial = false;
    }


    if (!this.min8 || !this.oneCapital || !this.oneLower  
        || !this.oneNumeric || !this.oneSpecial || !this.ConfirmPasswordMatch) {
      this.disableButton = true;
    } else {
      this.disableButton = false;
    }

  }

  matchPassword(password) {

    if (this.form.password != this.form.password_confirmation) {
      this.ConfirmPasswordMatch = false;
      this.disableButton = true;
    } else {
      this.ConfirmPasswordMatch = true;
      this.disableButton = false;

    }

    if(this.form.password=="" || this.form.password_confirmation=="") {
        this.ConfirmPasswordMatch=false;
        this.disableButton = true;
    }
      

  }

}
