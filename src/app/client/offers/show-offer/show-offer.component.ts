import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ErrorService } from 'src/Services/shared/error.service';

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
    id: null,
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
    job: {
      title: '',
    },
    submission: {
      id: null,
      email: '',
      first_name: '',
      last_name: '',
      location: '',
      created_at: '',
      job: {
        id: null,
        title: ''
      }
    },
    actions: []
  };
  statuses = [];

  offerUrl = environment.baseApiUrlClient + "/client/offers/";

  private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
  private httpOptions = {
    headers: this.headers_object
  };

  constructor(private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
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

  handleSuccess(data) {
    console.log(data);
    this.offer = data.data.offer;
    this.statuses = data.data.statuses;
    this.isLoading = false;
  }

  handleError(error) {
    console.log(error);
    this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
    this.isLoading = false;
  }

  updateStatus(){
    this.isLoading = true;
    return this.http.post(this.offerUrl + this.offer_id+"/status", {status: this.offer.current_status}, this.httpOptions).subscribe(
      data => this.handlePostSuccess(data),
      error => this.handleError(error)
    );
  }

  handlePostSuccess(data) {
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
    this.isLoading = false;
  }


}
