import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TokenService } from 'src/Services/token.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ErrorService } from 'src/Services/shared/error.service';

@Component({
  selector: 'app-chatbot-profile-save',
  templateUrl: './chatbot-profile-save.component.html',
  styleUrls: ['./chatbot-profile-save.component.css']
})
export class ChatbotProfileSaveComponent implements OnInit {

  isLoading = false;
  //capture get paramters
  //local_token  // for sign up,
  //id //
  //redirect_url
  //token
  private chatbotProfileSaveUrl = environment.baseApiUrl + "/chatbot/profile/save";
  private headers_object;
  private httpOptions;

  token: string;
  redirect_url: string;
  skills : string;
  email: string;
  titles: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  location: string;

  constructor(private route: ActivatedRoute,
    private Token: TokenService,
    private _ErrorService: ErrorService,
    private http: HttpClient,
    private router: Router) {
    console.log('Called Constructor');
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      this.redirect_url = params['redirect_url'];
      this.Token.handle(this.token);
      this.email = btoa(params['email']);
      this.skills = params['skills'];
      this.titles = params['titles'];
      this.utm_source = params['utm_source'];
      this.utm_medium = params['utm_medium'];
      this.utm_campaign = params['utm_campaign'];
      this.location = params['location'];
      
      this.headers_object = new HttpHeaders().set("Authorization", "Bearer " + this.token);
      this.httpOptions = {
        headers: this.headers_object
      };
      this.http.post(this.chatbotProfileSaveUrl, { 
            email: this.email,
            skills: this.skills,
            titles: this.titles,
            token: this.token,
            location: this.location,
            utm_campaign: this.utm_campaign,
            utm_medium: this.utm_medium,
            utm_source: this.utm_source
          }, this.httpOptions
           ).subscribe(
        data => this.handleChatbotProfileSaveSuccess(data),
        error => this.handleError(error)
      )
    });
  }

  handleChatbotProfileSaveSuccess(data) {
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
    this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
    this.router.navigateByUrl('/login');
    this.isLoading = false;
  }

  ngOnInit() {
  }

}
