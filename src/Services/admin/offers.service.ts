import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OffersService {

  constructor(private http: HttpClient) { }

  private offersUrl = environment.baseApiUrlClient+"/admin/offers";
  private _offersByJobId = environment.baseApiUrlClient+"/admin/offers/jobs";
  private _offersByClientId = environment.baseApiUrlClient+"/admin/offers/clients";
  private _offersBySubmissionId = environment.baseApiUrlClient+"/admin/offers/submissions";

  private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
   private httpOptions = {
    headers: this.headers_object
   };
   
   show(id) {
     return this.http.get(this.offersUrl + "/" +id, this.httpOptions);
   }

   get(page, search='') {
   	return this.http.get(`${this.offersUrl}?page=${page}&search=${search}`, this.httpOptions);
   }

   offersByJobId(id) {
     return this.http.get(this._offersByJobId + "/" + id, this.httpOptions);
   }

   offersByClientId(id) {
     return this.http.get(this._offersByClientId + "/" + id, this.httpOptions);
   }

   offersBySubmissionId(id) {
     return this.http.get(this._offersBySubmissionId + "/" + id, this.httpOptions);
   }

}
