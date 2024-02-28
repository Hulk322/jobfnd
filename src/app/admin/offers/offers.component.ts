import { Component, OnInit } from '@angular/core';
import { OffersService } from 'src/Services/admin/offers.service';
import { ErrorService } from 'src/Services/shared/error.service';
import { Router , ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.css']
})
export class OffersComponent implements OnInit {

	isLoading = false;
	offers= [];

  pageObj ={
    page : 1,
    pageSize: 15,
    totalElements : 0
  };

  search_keyword = '';
  id;
  sub;
  type;

	constructor(
				private _offersService: OffersService,
				private _ErrorService: ErrorService,
        private route: ActivatedRoute,
        private router: Router,
				) { }

  ngOnInit() {
     this.isLoading = true;
     this.sub    = this.route.params.subscribe(params => {
     this.id = params['id']; // (+) converts string 'id' to a number
     this.sub    = this.route.queryParams.subscribe(params => {
     this.type   = params['type'];

     if(this.type === 'job_offer') {
       return this._offersService.offersByJobId(this.id).subscribe(
         data  => this.handleSuccess(data),
         error => this.handleError(error)
       );
     }else if(this.type === 'client_offers'){
       return this._offersService.offersByClientId(this.id).subscribe(
         data  => this.handleSuccess(data),
         error => this.handleError(error)
       );
     }else if(this.type === 'submission_offers'){
      return this._offersService.offersBySubmissionId(this.id).subscribe(
        data  => this.handleSuccess(data),
        error => this.handleError(error)
      ); 
     }else{
       return '';
     }
      });
    });

  	this.getOffers();
  }

  getOffers() {
    this.isLoading = true;
    if((this.type !== 'job_offer' && this.type !== 'client_offers') && this.type !== 'submission_offers') {
  	this._offersService.get(this.pageObj.page, this.search_keyword).subscribe(
  		data 	=> this.handleSuccess(data),
  		error 	=> this.handleError(error),
  		)
  }
  }

  handleSuccess(data) {
  	this.offers = data.data.offers.data;
    this.pageObj.pageSize = data.data.offers.per_page;
    this.pageObj.totalElements = data.data.offers.total;
  	this.isLoading = false;
  }

  handleError(error) {
    this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
    this.isLoading = false;
  }

  pageChange(selectedPage){
    window.scroll(0, 0);
    this.pageObj.page = selectedPage;
    this.getOffers();
  }

  viewOffer(id) {
    this.router.navigate(['admin/offers/'+id]);
  }
}
