import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InterviewsService {

  constructor(private http: HttpClient) { }

  private interviewsUrl = environment.baseApiUrlClient+"/admin/interviews";
  private _interviewsByJobId = environment.baseApiUrlClient+"/admin/interviews/jobs";
  private _interviewsByClientId = environment.baseApiUrlClient+"/admin/interviews/clients";
  private _interviewsBySubmissionId = environment.baseApiUrlClient+"/admin/interviews/submissions";


  private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
   private httpOptions = {
    headers: this.headers_object
   };

   get(page, search='') {
   	return this.http.get(`${this.interviewsUrl}?page=${page}&search=${search}`, this.httpOptions);
   }

   show(id) {
     return this.http.get(this.interviewsUrl + "/" +id, this.httpOptions);
   }

   delete(id) {
     return this.http.delete(this.interviewsUrl + "/" + id, this.httpOptions);
   }

   interviewsByJobId(id) {
     return this.http.get(this._interviewsByJobId + "/" + id, this.httpOptions);
   }
   interviewsByClientId(id) {
     return this.http.get(this._interviewsByClientId + "/" + id, this.httpOptions);
   }
   interviewsBySubmissionId(id) {
     return this.http.get(this._interviewsBySubmissionId + "/" + id, this.httpOptions);
   }


}
