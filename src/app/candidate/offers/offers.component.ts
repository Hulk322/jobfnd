import { Component, OnInit } from '@angular/core';
import { OfferService } from 'src/Services/candidate/offer.service';
import { ErrorService } from 'src/Services/shared/error.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.css']
})
export class OffersComponent implements OnInit {

  isLoading = false;
  offers = [];
  search_keyword = "";
  pageObj ={
    page : 1,
    pageSize: 10,
    totalElements : 0
  };

  view_type = 'list';

  constructor(private _offer: OfferService,
              private _ErrorService: ErrorService) { }

  ngOnInit() {
    this.getOffers();
  }

  getOffers(){
    this.isLoading = true;
    this._offer.getAllOffers(this.pageObj.page).subscribe(
      data => this.handleSuccess(data),
      error => this.handleError(error)
    );
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

  deleteOffer(id, offer) {
    var answer = confirm('Are you sure you want to delete this offer?');
    if (answer) {
      this.isLoading = true;
      offer.deleted = true;
      for (let i = 0; i < this.offers.length; ++i) {
        if (this.offers[i].id === id) {
          this._offer.delete(id)
            .subscribe(
              data => this.handleDeleteSuccess(data, i),
              err => console.log(err)
            );

        }
      }
    }
  }

  handleDeleteSuccess(data, i){
    this.offers.splice(i, 1);
    console.log(data);
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
    this.isLoading = false;
  }

  getOffersByKeyword(){
    this._offer.getOffersByKeyword(this.search_keyword).subscribe(
      data => this.handleSuccess(data),
      error => this.handleError(error)
    );
  }

  getByStatus(status){
    this._offer.getOffersByStatus(status).subscribe(
      data => this.handleSuccess(data),
      error => this.handleError(error)
    );
  }

  todayOffers(){
    this._offer.getTodayOffers().subscribe(
      data => this.handleSuccess(data),
      error => this.handleError(error)
    );
  }

  weekOffers(){
    this._offer.getTodayOffers().subscribe(
      data => this.handleSuccess(data),
      error => this.handleError(error)
    );
  }

  sortAscOffers(){
    this._offer.getSortAscOffers().subscribe(
      data => this.handleSuccess(data),
      error => this.handleError(error)
    );
  }

  sortDescOffers(){
    this._offer.getSortDescOffers().subscribe(
      data => this.handleSuccess(data),
      error => this.handleError(error)
    );
  }

  pageChange(selectedPage){
    this.pageObj.page = selectedPage;
    this.getOffers();
  }


}
