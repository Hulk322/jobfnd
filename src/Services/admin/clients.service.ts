import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {

  constructor(private http: HttpClient) { }

  private clientsUrl = environment.baseApiUrlClient+"/admin/users/clients";

  private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
   private httpOptions = {
    headers: this.headers_object
   };

  get(page, search=''){
    return this.http.get(`${this.clientsUrl}?page=${page}&search=${search}`, this.httpOptions);
  }

  delete(id) {
    return this.http.delete(this.clientsUrl + "/" + id, this.httpOptions);
  }

}
