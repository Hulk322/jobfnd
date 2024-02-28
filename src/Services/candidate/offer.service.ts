import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OfferService {

  constructor(private http: HttpClient) { }

  private allOffersUrl = environment.baseApiUrlClient + "/candidate/offers";
  private storeUrl = environment.baseApiUrlClient + "/client/submissions";
  private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
  private httpOptions = {
    headers: this.headers_object
  };

  getAllOffers(page) {
    return this.http.get(`${this.allOffersUrl}?page=${page}`, this.httpOptions)
  }

  getTodayOffers() {
    return this.http.get(this.allOffersUrl+"?limit=today", this.httpOptions)
  }

  getWeekOffers() {
    return this.http.get(this.allOffersUrl+"?limit=week", this.httpOptions)
  }

  getSortAscOffers() {
    return this.http.get(this.allOffersUrl+"?sort=asc", this.httpOptions)
  }

  getSortDescOffers() {
    return this.http.get(this.allOffersUrl+"?sort=desc", this.httpOptions)
  }

  getOffersByKeyword(keywrod) {
    return this.http.get(this.allOffersUrl+"?what="+keywrod, this.httpOptions)
  }

  getOffersByStatus(status) {
    return this.http.get(this.allOffersUrl+"?status[0]="+status, this.httpOptions)
  }

  getCreateData(submission_id){
    return this.http.get(this.storeUrl+"/"+submission_id+"/offers"+"/create", this.httpOptions);
  }

  store(submission_id, offer){
    return this.http.post(this.storeUrl+"/"+submission_id+"/offers", offer, this.httpOptions)
  }

  delete(id) {
    return this.http.delete(this.allOffersUrl + "/" + id, this.httpOptions);
  }
}
