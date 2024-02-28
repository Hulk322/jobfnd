import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubmissionsService {

  constructor(private http: HttpClient) { }
  private submissionsUrl = environment.baseApiUrlClient+"/admin/submissions";
  private _submissionsByJobId = environment.baseApiUrlClient+"/admin/submissions/jobs";
  private _submissionsByClientId = environment.baseApiUrlClient+"/admin/submissions/clients";

  private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
   private httpOptions = {
    headers: this.headers_object
   };

   show(id) {
     return this.http.get(this.submissionsUrl + "/" +id, this.httpOptions);
   }
   
   get(page, search='') {
   	return this.http.get(`${this.submissionsUrl}?page=${page}&search=${search}`, this.httpOptions);
   }

   submissionsByJobId(id) {
     return this.http.get(this._submissionsByJobId + "/" + id, this.httpOptions);
   }

   submissionsByClientId(id) {
     return this.http.get(this._submissionsByClientId + "/" + id, this.httpOptions);
   }

   delete(id) {
     return this.http.post(this.submissionsUrl +"/" + id +"/delete", this.httpOptions);
   }
}
