import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private http: HttpClient
  ) { }

  private unReadListUrl = environment.baseApiUrlClient + "/vendor/notifications/unread";
  private markReadUrl = environment.baseApiUrlClient + "/vendor/notifications/mark-read";

  private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
  private httpOptions = {
    headers: this.headers_object
  }

  getUnread() {
    return this.http.get(this.unReadListUrl, this.httpOptions);
  }

  markRead(id) {

    return this.http.post(this.markReadUrl, { 'ids[0]': id }, this.httpOptions);

  }
}
