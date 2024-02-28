import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientJobService {

  constructor(
    private http: HttpClient
  ) { }

  public jobs = [];
  private jobsUrl = environment.baseApiUrlClient + "/client/jobs";
  private activeJobsUrl = environment.baseApiUrlClient + "/client/jobs/actives";
  private draftsUrl = environment.baseApiUrlClient + "/client/jobs/drafts";
  private archivesUrl = environment.baseApiUrlClient + "/client/jobs/archived";
  private jobsUrlPublic = environment.baseApiUrlClient + "/jobs";
  private jobUrl: any;
  private deleteSubmissionUrl = environment.baseApiUrlClient + "/client/submissions/delete/";
  private deleteJobUrl = environment.baseApiUrlClient + "/client/jobs/";
  private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
  private httpOptions = {
    headers: this.headers_object
  };

  getJobs() {

    return this.http.get(this.jobsUrl, this.httpOptions);

  }

  searchInActiveJobs(search_keyword) {

    return this.http.get(this.activeJobsUrl+"?search="+search_keyword, this.httpOptions);

  }

  searchInDrafts(search_keyword) {
    return this.http.get(this.draftsUrl+"?search="+search_keyword, this.httpOptions);
  }

  getActiveJobs(page) {

    return this.http.get(this.activeJobsUrl+'?page='+page, this.httpOptions);

  }

  searchInArchives(search_keyword) {
    return this.http.get(this.archivesUrl+"?search="+search_keyword, this.httpOptions);
  }

  getDrafts(page) {

    return this.http.get(this.draftsUrl+'?page='+page, this.httpOptions);

  }

  getArchives(page) {

    return this.http.get(this.archivesUrl+'?page='+page, this.httpOptions);

  }

  getJobsPublic() {

    return this.http.get(this.jobsUrlPublic, this.httpOptions);

  }

  getJob(id) {
    return this.http.get(this.jobsUrl + "/" + id, this.httpOptions);
  }

  getTemplate(id) {
    return this.http.get(this.jobsUrl + "/template/" + id, this.httpOptions);
  }

  deleteSubmission(id) {
    return this.http.get(this.deleteSubmissionUrl + id, this.httpOptions);
  }

  deleteJob(id, job_delete) {
    return this.http.post(this.deleteJobUrl+id+"/delete", job_delete, this.httpOptions);
  }

}
