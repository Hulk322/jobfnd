import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {

  constructor(private http: HttpClient) { }

  private candidatesUrl = environment.baseApiUrlClient+"/admin/users/candidates";

  private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
   private httpOptions = {
    headers: this.headers_object
   };

  get(page, search=''){
    return this.http.get(`${this.candidatesUrl}?page=${page}&search=${search}`, this.httpOptions);
  }

  delete(id) {
    return this.http.delete(this.candidatesUrl + "/" + id, this.httpOptions);
  }

}
