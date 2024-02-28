import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BillingCodeService {
  constructor(private http: HttpClient) { }

  private billingCodesUrl = environment.baseApiUrlClient+"/client/billingcodes";

  private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
   private httpOptions = {
    headers: this.headers_object
   };

  getBillingCodes(){
    return this.http.get(this.billingCodesUrl, this.httpOptions);
  }

  add(billing_code){
    return this.http.post(this.billingCodesUrl, billing_code, this.httpOptions);
  }

  update(billing_code){
    return this.http.put(this.billingCodesUrl+"/" + billing_code.id, billing_code, this.httpOptions);
  }

  delete(billing_code){
    return this.http.delete(this.billingCodesUrl+"/"+billing_code.id, this.httpOptions);
  }
}
