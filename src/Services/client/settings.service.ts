import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(
  	private http: HttpClient
  	) { }
  private clientSettingUrl = environment.baseApiUrlClient+"/client/settings/default";

  show() {
  	return this.http.get(this.clientSettingUrl);
  }

  updateSetting(form) {
  	return this.http.post(this.clientSettingUrl, form);
  }
}
