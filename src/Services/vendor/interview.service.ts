import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InterviewService {

  constructor(private http: HttpClient) { }

  private allInterviewsUrl = environment.baseApiUrlClient + "/vendor/interviews";
 
  private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
  private httpOptions = {
    headers: this.headers_object
  };

  getAllInterviews() {
    return this.http.get(this.allInterviewsUrl, this.httpOptions)
  }

  getTodayInterviews() {
    return this.http.get(this.allInterviewsUrl+"?limit=today", this.httpOptions)
  }

  getWeekInterviews() {
    return this.http.get(this.allInterviewsUrl+"?limit=week", this.httpOptions)
  }

  getSortAscInterviews() {
    return this.http.get(this.allInterviewsUrl+"?sort=asc", this.httpOptions)
  }

  getSortDescInterviews() {
    return this.http.get(this.allInterviewsUrl+"?sort=desc", this.httpOptions)
  }

  getInterviewsByStatus(status) {
    return this.http.get(this.allInterviewsUrl+"?status[0]="+status, this.httpOptions)
  }

  getInterviewsByKeyword(keywrod) {
    return this.http.get(this.allInterviewsUrl+"?what="+keywrod, this.httpOptions)
  }

}