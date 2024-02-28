import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IndustriesService {

  constructor(private http: HttpClient) { }

  private industriesUrl = environment.baseApiUrlClient+"/admin/industries";

  private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
   private httpOptions = {
    headers: this.headers_object
   };

   get(page, search= '') {
   	return this.http.get(`${this.industriesUrl}?page=${page}&search=${search}`, this.httpOptions);
   }

   add(indsutry){
     return this.http.post(this.industriesUrl, indsutry, this.httpOptions);
   }

   update(indsutry){
     return this.http.put(this.industriesUrl+"/" + indsutry.id, indsutry, this.httpOptions);
   }

   delete(id) {
     return this.http.delete(this.industriesUrl + "/" + id, this.httpOptions);
   }
}
