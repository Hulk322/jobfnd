import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CostCenterService {

  constructor(private http: HttpClient) { }

  private costCentersUrl = environment.baseApiUrlClient+"/client/costcenters";
  

  private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
   private httpOptions = {
    headers: this.headers_object
   };

  getCostCenters(){
    return this.http.get(this.costCentersUrl, this.httpOptions);
  }

  add(cost_center){
    return this.http.post(this.costCentersUrl, cost_center, this.httpOptions);
  }

  update(cost_center){
    return this.http.post(this.costCentersUrl+"/"+cost_center.id, cost_center, this.httpOptions);
  }

  delete(cost_center){
    return this.http.delete(this.costCentersUrl+"/"+cost_center.id, this.httpOptions);
  }
}
