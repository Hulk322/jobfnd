import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private http: HttpClient) { }

  private locationsUrl = environment.baseApiUrlClient+"/client/locations";

  private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
   private httpOptions = {
    headers: this.headers_object
   };

  getLocations(){
    return this.http.get(this.locationsUrl, this.httpOptions);
  }

  add(location){
    return this.http.post(this.locationsUrl, location, this.httpOptions);
  }

  update(location){
    return this.http.put(this.locationsUrl+"/" + location.id, location, this.httpOptions);
  }

  delete(location){
    return this.http.delete(this.locationsUrl+"/" + location.id, this.httpOptions);
  }

}
