import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OfferService {

   constructor(private http: HttpClient) { }

  private offersListUrl = environment.baseApiUrlClient + "/vendor/offers";
 
  private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
  private httpOptions = {
    headers: this.headers_object
  };

  getAll() {
    return this.http.get(this.offersListUrl, this.httpOptions)
  }
}
