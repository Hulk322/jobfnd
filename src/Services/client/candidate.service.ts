import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {

   constructor(private http: HttpClient) { }

  getCandidateUrl =  environment.baseApiUrlClient+"/client/talents/";

  private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
  private httpOptions = {
    headers: this.headers_object
  };

  getCandidate(candidate_id) {
    return this.http.get(this.getCandidateUrl +candidate_id, this.httpOptions)
  }

  getSimilarCandidates(candidate_id) {
    return this.http.get(this.getCandidateUrl +candidate_id, this.httpOptions)
  }

}
