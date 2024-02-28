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

  private unReadListUrl = environment.baseApiUrlClient + "/candidate/notifications/unread";
  private savedJobsCountUrl = environment.baseApiUrlClient + "/candidate/stats/saved-jobs";
  private markReadUrl = environment.baseApiUrlClient + "/candidate/notifications/mark-read";

  private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
  private httpOptions = {
    headers: this.headers_object
  }

  getUnread() {
    return this.http.get(this.unReadListUrl, this.httpOptions);
  }

  getSavedJobsCount() {
    return this.http.get(this.savedJobsCountUrl, this.httpOptions);
  }

  markRead(id) {
    var ids = [];
    ids.push(id);
    return this.http.post(this.markReadUrl, { ids: ids }, this.httpOptions);

  }




}
