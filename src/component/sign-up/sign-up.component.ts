import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TokenService } from 'src/Services/token.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ErrorService } from 'src/Services/shared/error.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  
  private registerUrl = environment.baseApiUrlClient+"/signup";

  isLoading = false;
  public error = null;
  public success = null; 
  public tab = 'candidate';

  public form = {
    company_name: null,
    email: null,
    first_name: null,
    last_name: null,
    type:null
  };

  constructor(
    private http: HttpClient,
    private Token: TokenService,
    private router: Router,
    private _ErrorService: ErrorService,
    @Inject(DOCUMENT) document: any 
  ) { 
    let chatbot =  document.getElementById('svms-chat-widget');
    chatbot.style.display = "block";
    }

  onSubmit(){
    this.isLoading = true;
    this.error = null;
    console.log(this.form); 
    return this.http.post(this.registerUrl  , this.form).subscribe(
      data =>this.handleSuccess(data),
      error => this.handleError(error)
    );
  }

  

  social_signup(network){
    this.http.get(this.registerUrl+"/"+network).subscribe(
      data => this.handleSocialSuccess(data),
      error => console.log(error)
    )
  }

  handleSocialSuccess(data){
    console.log(data.data.redirect_url);
    window.location = data.data.redirect_url;
  }

  handleSuccess(data){
    this._ErrorService.flashMessage( {'type': 'success', 'messages': data.msg } );
    
    this.form.company_name='';
    this.form.email='';
    this.form.first_name='';
    this.form.last_name='';

    console.log(data);
    this.router.navigate(['/confirmation', { messages: 'Please click on the activation link sent on your email to complete the signup.' }]);
    
    this.isLoading = false;
  }

  handleError(error){
    this._ErrorService.flashMessage( {'type': 'error', 'messages': error.error } );
    this.isLoading = false;
  }
  
  ngOnInit() {
    this.form.type = 'candidate'; 
    let body = document.getElementsByTagName('body')[0];
    body.classList.remove("menu-position-top");
    body.classList.remove("full-screen");
    body.classList.remove("with-content-panel");   //remove the class
    body.classList.add("auth-wrapper");   //add the class
  }

  tabclick(option) {
    this.tab  =  option; 
    if (option  == 'company') {
      this.form.type = 'client'; 
    }else {
      this.form.type = option; 
    }
    
  }
}
