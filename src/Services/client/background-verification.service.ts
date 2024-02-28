import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BackgroundVerificationService {

  constructor(private http: HttpClient) { }

  private listUrl = environment.baseApiUrlClient + "/client/backgroud_varifaction";
  private storeUrl = environment.baseApiUrlClient + "/client/backgroud_varifaction";
  private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
  private httpOptions = {
    headers: this.headers_object
  };

  getList() {
    return this.http.get(this.listUrl, this.httpOptions)
  }

  getCreateData(submission_id){
    return this.http.get(this.storeUrl+"/create/"+submission_id, this.httpOptions);
  }

  store(bg_check){
    return this.http.post(this.storeUrl, bg_check, this.httpOptions)
  }

  delete(id) {
    return this.http.delete(this.listUrl + "/" + id, this.httpOptions);
  }
}