import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OfferService {

   constructor(private http: HttpClient) { }

  private allOffersUrl = environment.baseApiUrlClient + "/client/offers";
  private storeUrl = environment.baseApiUrlClient + "/client/submissions";
  private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
  private httpOptions = {
    headers: this.headers_object
  };

  getAllOffers(page) {
    return this.http.get(this.allOffersUrl+'/recent'+"?page="+page, this.httpOptions)
  }

  getTodayOffers(page) {
    return this.http.get(this.allOffersUrl+"?limit=today&page="+page, this.httpOptions)
  }

  getWeekOffers(page) {
    return this.http.get(this.allOffersUrl+"?limit=week&page="+page, this.httpOptions)
  }

  getSortAscOffers(page) {
    return this.http.get(this.allOffersUrl+"?sort=asc&page="+page, this.httpOptions)
  }

  getSortDescOffers(page) {
    return this.http.get(this.allOffersUrl+"?sort=desc&page="+page, this.httpOptions)
  }

  getOffersByKeyword(keywrod, page) {
    return this.http.get(this.allOffersUrl+"?what="+keywrod+"&page="+page, this.httpOptions)
  }

  getOffersByStatus(status, page) {
    return this.http.get(this.allOffersUrl+"?status[0]="+status+"&page="+page, this.httpOptions)
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
