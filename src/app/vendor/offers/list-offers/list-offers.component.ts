import { Component, OnInit } from '@angular/core';
import { OfferService } from 'src/Services/vendor/offer.service';

@Component({
  selector: 'app-list-offers',
  templateUrl: './list-offers.component.html',
  styleUrls: ['./list-offers.component.css']
})
export class ListOffersComponent implements OnInit {

  offers = [];
  isLoading = false;
  search_keyword = "";

  constructor(private _offer: OfferService) { }

  ngOnInit() {
    this.isLoading = true;
    this._offer.getAll().subscribe(
      data => this.handleSuccess(data),
      error => this.handleError(error)
    );
  }

  handleSuccess(data) {
    this.offers = data.data.offers.data;
    this.isLoading = false;
  }

  handleError(error) {
    console.log(error);
  }

  getOffersByKeyword(){
    /*this._offer.getOffersByKeyword(this.search_keyword).subscribe(
      data => this.handleSuccess(data),
      error => this.handleError(error)
    );*/
  }

  deleteOffer(id, offer){
    console.log(id+offer);
  }

}
