import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ErrorService } from 'src/Services/shared/error.service';
import { Location } from "@angular/common";
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-offer',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.css']
})
export class OfferComponent implements OnInit {

  isLoading = false;
  offer_id;
  sub;
  full_name = "";
  profile_picture = "";
  filters = {
    what : '',
    where : '',
    categories : 'AllCategories'
  };
  offer = {
    id:'',
    title: '',
    type: '',
    salary: '',
    vendor_markup: '',
    bill_rate: '',
    bill_rate_overtime: '',
    notes: '',
    reason: '',
    current_status: 'New',
    start_date:'',
    created_at: '',
    updated_at: '',
    submission: {
      id: null,
      email: '',

    },
    job:{
      title:'',
      job_type:'',
      salary:'',
      salary_type:'',
      min_rate:null,
      max_rate:null,
      experience:'',
      description:'',
      api_job_id:'',
      category:{ name : ''},
      openings:'',
      posted:'',
      job_location:'',
      start_date:'',
      skills:  [],
      updated_at: ''
    },
    client_organization:{
      name:'',
      location:'',
      description:'',
      businessLogoFullUrl:''
    },
    actions: []
  };

   show_more_description = false;
   offer_link = origin+"/candidate"+"/offers/";
  offerUrl = environment.baseApiUrlClient + "/candidate/offers/";

  private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
  private httpOptions = {
    headers: this.headers_object
  };

  constructor(private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private location:Location,
    private _ErrorService: ErrorService,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.full_name = localStorage.getItem("full_name");
    this.profile_picture = localStorage.getItem("profile_picture"); 
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
    return this.http.post(this.offerUrl + this.offer_id + "/status", { status: 'Accept', reason: this.offer.reason }, this.httpOptions).subscribe(
      data => this.handleAcceptSuccess(data),
      error => this.handleAcceptError(error)
    );
  }

  handleAcceptSuccess(data) {
    this.offer.current_status = 'Candidate Accepted';
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
    return this.http.post(this.offerUrl + this.offer_id + "/status", { status: 'Reject', reason: this.offer.reason }, this.httpOptions).subscribe(
      data => this.handleRejectSuccess(data),
      error => this.handleRejectError(error)
    );
  }

  handleRejectSuccess(data) {
    this.offer.current_status = 'Candidate Rejected';
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
    this.isLoading = false;
  }

  handleRejectError(error) {
    this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
    this.isLoading = false;
  }

  handleSuccess(data) {
    console.log(data);
    this.offer = data.data.offer;
    this.offer_link = this.offer_link+this.offer.id;
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
   copyMessage(){
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.offer_link;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);

    //show alert data copied
    this.toastr.info('Offer Link Copied.', '', {
      timeOut: 3000,
      positionClass: 'toast-bottom-right'
    });
  }
    searchClientJobs(org_name){
    this.filters.what = org_name;
    this.filters.where =  '';
    this.filters.categories = 'AllCategories';
    this.router.navigate(['/jobs'],{queryParams:this.filters });
  }

}
