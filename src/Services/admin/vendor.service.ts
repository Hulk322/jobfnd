import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VendorService {

  constructor(private http: HttpClient) { }

  private vendorsUrl = environment.baseApiUrlClient+"/admin/users/vendors";

  private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
   private httpOptions = {
    headers: this.headers_object
   };

  get(page, search=''){
    return this.http.get(`${this.vendorsUrl}?page=${page}&search=${search}`, this.httpOptions);
  }

  delete(id) {
    return this.http.delete(this.vendorsUrl + "/" + id, this.httpOptions);
  }

}
