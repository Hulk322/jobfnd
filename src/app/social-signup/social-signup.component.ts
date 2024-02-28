import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TokenService } from 'src/Services/token.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ErrorService } from 'src/Services/shared/error.service';

@Component({
  selector: 'app-social-signup',
  templateUrl: './social-signup.component.html',
  styleUrls: ['./social-signup.component.css']
})
export class SocialSignupComponent implements OnInit {

  public form = {
    company_name: null,
    email: null,
    first_name: null,
    last_name: null,
    type:null
  };

  public tab = 'candidate';

  tabclick(option) {
    this.tab  =  option; 
    if (option  == 'company') {
      this.form.type = 'client'; 
    }else {
      this.form.type = option; 
    }
    
  }

  private socialSignupCompleteUrl = environment.baseApiUrl + "/complete-social-signup";
  private headers_object;
  private httpOptions;

  token: string;
  redirect_url: string;
  id: number;
  local_token: string;
  constructor(private route: ActivatedRoute,
    private Token: TokenService,
    private http: HttpClient,
    private router: Router,
    private _ErrorService: ErrorService) {
    console.log('Called Constructor');
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      this.redirect_url = params['redirect_url'];
      this.id = params['id'];
      this.local_token = params['local_token'];
      this.Token.handle(this.token);
      //localStorage.setItem('is_client', 'true' );
      //window.open( this.redirect_url, '_self');  
      //complete-social-login
      this.headers_object = new HttpHeaders().set("Authorization", "Bearer " + this.token);
      this.httpOptions = {
        headers: this.headers_object
      };

      this.http.get(this.socialSignupCompleteUrl+"/"+this.id+"/"+this.local_token, this.httpOptions).subscribe(
        data => this.handleSocialCompleteSuccess(data),
        error => this.handleError(error)
      )
    });
  }

  isLoading = false;
  registerUrl;

  onSubmit(){
    this.isLoading = true;
    
    console.log(this.form.company_name); 
    return this.http.post(this.socialSignupCompleteUrl+"/"+this.id+"/"+this.local_token, { type: this.form.type, company_name: this.form.company_name }).subscribe(
      data =>this.handleSuccess(data),
      error => this.handleError(error)
    );
  }

  handleSuccess(data){
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

  handleSocialCompleteSuccess(data) {
    //console.log(data);
    // this.form.first_name = data.data.user.first_name;
    // this.form.last_name = data.data.user.last_name;
    // this.form.email = data.data.user.email;
    // this.onSubmit();
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

        localStorage.setItem('saved_jobs_count', '0');
        localStorage.setItem('notifications_count', '0');

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

  handleError(error) {
    console.log(error);
    this._ErrorService.flashMessage( {'type': 'error', 'messages': error.error } );
    this.isLoading = false;
  }

  ngOnInit() {
    this.isLoading = true;
    this.form.type = 'candidate'; 
  }

}
