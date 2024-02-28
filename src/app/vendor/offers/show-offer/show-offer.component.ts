import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ErrorService } from 'src/Services/shared/error.service';
import { Location } from "@angular/common";

@Component({
  selector: 'app-show-offer',
  templateUrl: './show-offer.component.html',
  styleUrls: ['./show-offer.component.css']
})
export class ShowOfferComponent implements OnInit {

  isLoading = false;
  offer_id;
  sub;
  offer = {
    title: '',
    type: '',
    salary: '',
    vendor_markup: '',
    bill_rate: '',
    bill_rate_overtime: '',
    notes: '',
    reason: '',
    current_status: 'New',
    created_at: '',
    submission: {
      id: null,
      email: '',
      job: {
        title: ''
      }
    },
    actions: []
  };

  offerUrl = environment.baseApiUrlClient + "/vendor/offers/";

  private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
  private httpOptions = {
    headers: this.headers_object
  };

  constructor(private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private location:Location,
    private _ErrorService: ErrorService) { }

  ngOnInit() {
    this.isLoading = true;
    this.sub = this.route.params.subscribe(params => {
      this.offer_id = +params['id']; // (+) converts string 'id' to a number

      return this.http.get(this.offerUrl + this.offer_id, this.httpOptions).subscribe(
        data => this.handleSuccess(data),
        error => this.handleError(error)
      );


    });
  }

  acceptOffer() {
    this.isLoading = true;
    return this.http.post(this.offerUrl + this.offer_id + "/status", { status: 'Vendor Accepted', reason: this.offer.reason }, this.httpOptions).subscribe(
      data => this.handleAcceptSuccess(data),
      error => this.handleAcceptError(error)
    );
  }

  handleAcceptSuccess(data) {
    this.offer.current_status = 'Vendor Accepted';
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
    this.isLoading = false;
  }

  handleAcceptError(error) {
    console.log(error);
    this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
    this.isLoading = false;
  }

  rejectOffer() {
    this.isLoading = true;
    return this.http.post(this.offerUrl + this.offer_id + "/status", { status: 'Vendor Rejected', reason: this.offer.reason }, this.httpOptions).subscribe(
      data => this.handleRejectSuccess(data),
      error => this.handleRejectError(error)
    );
  }

  handleRejectSuccess(data) {
    this.offer.current_status = 'Vendor Rejected';
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
    this.isLoading = false;
  }

  handleRejectError(error) {
    console.log(error);
    this.isLoading = false;
  }

  handleSuccess(data) {
    console.log(data);
    this.offer = data.data.offer;
    this.isLoading = false;
  }

  handleError(error) {
    console.log(error);
    this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
    this.isLoading = false;
  }

  back(){
    this.location.back();
  }
}
