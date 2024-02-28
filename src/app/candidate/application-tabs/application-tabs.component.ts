import { Component, OnInit, Input } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ErrorService } from 'src/Services/shared/error.service';

@Component({
  selector: 'application-tabs',
  templateUrl: './application-tabs.component.html',
  styleUrls: ['./application-tabs.component.css']
})
export class ApplicationTabsComponent implements OnInit {

  @Input() application_tabs: string = "";
	
profileStats = {
    accepted : 0,
    applied : 0,
    contracts : 0,
    interviews : 0,
    invites : 0,
    offers : 0,
    saved : 0
  };

  statsUrl = environment.baseApiUrl + "/candidate/profile/stats";

  constructor( private http: HttpClient,private _ErrorService: ErrorService) { }

  ngOnInit() {

  	  return this.http.get(this.statsUrl).subscribe(
      data => this.handleSuccessStats(data),
      error => this.handleError(error)
    );
  }

   handleSuccessStats(data) {
    this.profileStats = data.data.profileStats; 
    sessionStorage.setItem('profileStats', JSON.stringify(this.profileStats));
    //console.log(this.profileStats);
  }
    handleError(error) {
    this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
    // this.isLoading = false;
  }

}
