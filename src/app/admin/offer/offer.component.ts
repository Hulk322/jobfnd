import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ErrorService } from 'src/Services/shared/error.service';
import { OffersService } from 'src/Services/admin/offers.service';

@Component({
  selector: 'app-offer',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.css']
})
export class OfferComponent implements OnInit {

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

	constructor(
			private route: ActivatedRoute,
	  		private _offersService: OffersService,
	  		private _ErrorService: ErrorService
	  ) { }

	ngOnInit() {
		this.getOffer();
	}

	getOffer() {
		this.isLoading = true;
		    this.sub = this.route.params.subscribe(params => {
		    this.offer_id = +params['id']; // (+) converts string 'id' to a number
		   
		    return this._offersService.show(this.offer_id).subscribe(
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


}
