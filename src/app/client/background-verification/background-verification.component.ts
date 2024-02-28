import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ErrorService } from 'src/Services/shared/error.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {BackgroundVerificationService } from 'src/Services/client/background-verification.service';

@Component({
  selector: 'app-background-verification',
  templateUrl: './background-verification.component.html',
  styleUrls: ['./background-verification.component.css']
})
export class BackgroundVerificationComponent implements OnInit {

  offer = {
    submission_id:'',
    background_verification : {
      social_security_trace:'',
      fel:'',
      state_criminal:'',
      reference_check: '',
      edu_varifaction:''
    }
  }

  bg_check = {
    social_security_trace:'',
    fel:'',
    state_criminal:'',
    reference_check: '',
    edu_varifaction:''
  };

  sub;
  offer_id;
  submission_id;
  isLoading = false;
  offerUrl = environment.baseApiUrlClient + "/client/offers/";

  private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
  private httpOptions = {
    headers: this.headers_object
  };

  constructor(private route: ActivatedRoute,
              private router: Router,
              private _ErrorService: ErrorService,
              private http: HttpClient,
              private _bg_check: BackgroundVerificationService) { }

  ngOnInit() {
    this.isLoading = true;
    this.sub = this.route.params.subscribe(params => {
      this.offer_id = +params['offer_id']; // (+) converts string 'id' to a number

      return this.http.get(this.offerUrl + this.offer_id, this.httpOptions).subscribe(
        data => this.handleSuccess(data),
        error => this.handleError(error)
      );


    });
  }

  onSubmit() {
    this.isLoading = true;
    let formData = new FormData();

    for (var key in this.bg_check) {
      formData.append(key, this.bg_check[key]);
    }
    formData.append('offer_id', this.offer_id);
    formData.append('submission_id', this.offer.submission_id);

    return this._bg_check.store(formData).subscribe(
      data => this.handleSuccessPost(data),
      error => this.handleErrorPost(error)
    );


  }

  handleSuccessPost(data) {
    console.log(data);
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
    this.isLoading = false;
    this.router.navigateByUrl('/client/background-verifications', data.msg.msg);
  }

  handleErrorPost(error) {
    console.log(error);
    this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
    this.isLoading = false;
  }


  handleSuccess(data) {
    console.log(data);
    this.offer = data.data.offer;
    if(this.offer.background_verification!=null)
      this.bg_check = this.offer.background_verification;
    this.isLoading = false;
  }

  handleError(error) {
    console.log(error);
    this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
    this.isLoading = false;
  }


}
