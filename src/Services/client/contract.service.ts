import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContractService {

   constructor(private http: HttpClient) { }

  private allContractsUrl = environment.baseApiUrlClient + "/client/contracts";
  private step1Url = environment.baseApiUrlClient + "/client/contracts/step-1";
  private step2Url = environment.baseApiUrlClient + "/client/contracts/step-2";
  private storeUrl = environment.baseApiUrlClient + "/client/contracts/create";
  private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
  private httpOptions = {
    headers: this.headers_object
  };

  getAllContracts() {
    return this.http.get(this.allContractsUrl, this.httpOptions)
  }

  getCreateStep_1_Data(){
    return this.http.get(this.step1Url, this.httpOptions);
  }

  getCreateStep_2_Data(job_id){
    return this.http.get(this.step2Url+"/"+job_id, this.httpOptions);
  }

  store(submission_id, contract){
    return this.http.post(this.storeUrl+"/"+submission_id, contract, this.httpOptions)
  }

  delete(id) {
    return this.http.delete(this.allContractsUrl + "/" + id, this.httpOptions);
  }
}
