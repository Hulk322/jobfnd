import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubmissionService {

  constructor(
    private http: HttpClient
  ) { }

  private toggleFavoriteUrl = environment.baseApiUrlClient + "/client/submissions/favourites";
  private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
  private httpOptions = {
    headers: this.headers_object
  };


  toggleFavorite(id, is_client_fav) {
    if (is_client_fav)
      return this.http.delete(this.toggleFavoriteUrl + "/" + id, this.httpOptions);
    else
      return this.http.post(this.toggleFavoriteUrl + "/" + id, this.httpOptions);
  }

}
