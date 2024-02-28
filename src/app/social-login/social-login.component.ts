import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TokenService } from 'src/Services/token.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-social-login',
  templateUrl: './social-login.component.html',
  styleUrls: ['./social-login.component.css']
})
export class SocialLoginComponent implements OnInit {

  //capture get paramters
  //local_token  // for sign up,
  //id //
  //redirect_url
  //token
  private socialLoginCompleteUrl = environment.baseApiUrl + "/complete-social-login";
  private headers_object;
  private httpOptions;

  token: string;
  redirect_url: string;
  constructor(private route: ActivatedRoute,
    private Token: TokenService,
    private http: HttpClient,
    private router: Router) {
    console.log('Called Constructor');
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      this.redirect_url = params['redirect_url'];
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
      )
    });
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

  handleError(error) {
    console.log(error)
  }

  ngOnInit() {
  }

}
