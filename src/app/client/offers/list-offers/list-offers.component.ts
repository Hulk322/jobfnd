import { Component, OnInit } from '@angular/core';
import { OfferService } from 'src/Services/client/offer.service';
import { ErrorService } from 'src/Services/shared/error.service';

@Component({
  selector: 'app-list-offers',
  templateUrl: './list-offers.component.html',
  styleUrls: ['./list-offers.component.css']
})
export class ListOffersComponent implements OnInit {

  isLoading = false;
  offers = [];
  showType : String = 'all';
  status = '';
  search_keyword = "";
  pageObj ={
    page : 1,
    pageSize: 10,
    totalElements : 0
  };

  constructor(private _offer: OfferService,
              private _ErrorService: ErrorService) { }

  ngOnInit() {
    this.allOffers();
    
  }

  allOffers(){
    this.isLoading = true;
    this.showType = 'all';
    this._offer.getAllOffers(this.pageObj.page).subscribe(
      data => this.handleSuccess(data),
      error => this.handleError(error)
    );
  }

  handleSuccess(data) {
    this.offers = data.data.offers.data;
    //if(data.msg.success != 'Request completed successfully')
      //this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
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
    this.isLoading = true;
    this.showType = 'search';
    this._offer.getOffersByKeyword(this.search_keyword, this.pageObj.page).subscribe(
      data => this.handleSuccess(data),
      error => this.handleError(error)
    );
  }

  getByStatus(status){
    this.isLoading = true;
    this.showType = 'status';
    this.status = status;
    this._offer.getOffersByStatus(status, this.pageObj.page).subscribe(
      data => this.handleSuccess(data),
      error => this.handleError(error)
    );
  }

  todayOffers(){
    this.isLoading = true;
    this.showType = 'today';
    this._offer.getTodayOffers(this.pageObj.page).subscribe(
      data => this.handleSuccess(data),
      error => this.handleError(error)
    );
  }

  weekOffers(){
    this.isLoading = true;
    this.showType = 'week';
    this._offer.getTodayOffers(this.pageObj.page).subscribe(
      data => this.handleSuccess(data),
      error => this.handleError(error)
    );
  }

  sortAscOffers(){
    this.isLoading = true;
    this.showType = 'asc';
    this._offer.getSortAscOffers(this.pageObj.page).subscribe(
      data => this.handleSuccess(data),
      error => this.handleError(error)
    );
  }

  sortDescOffers(){
    this.isLoading = true;
    this.showType = 'desc';
    this._offer.getSortDescOffers(this.pageObj.page).subscribe(
      data => this.handleSuccess(data),
      error => this.handleError(error)
    );
  }

  pageChange(selectedPage){
    this.pageObj.page = selectedPage;

    if(this.showType == 'all') 
      this.allOffers();
    else if(this.showType=='today')
      this.todayOffers();
    else if(this.showType=='week')
      this.weekOffers();
    else if(this.showType=='asc')
      this.sortAscOffers();
    else if(this.showType=='desc')
      this.sortDescOffers();
    else if(this.showType=='status')
      this.getByStatus(this.status);
    else if( this.showType == 'search' )
      this.getOffersByKeyword();
  }


}
