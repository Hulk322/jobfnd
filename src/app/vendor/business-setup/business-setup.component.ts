import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ErrorService } from 'src/Services/shared/error.service';

@Component({
  selector: 'app-business-setup',
  templateUrl: './business-setup.component.html',
  styleUrls: ['./business-setup.component.css']
})
export class BusinessSetupComponent implements OnInit {

  businessSetupUrl = environment.baseApiUrl + "/vendor/business-setup";
  fileToUpload: File = null;
  business = {
      name: null,
      description: null,
      subdomain: null,
      website_url: null,
      default_currency: null,
      business_category: null,
      business_logo: null
  };
  currencies = [];
  categories = [];
  
  isLoading = false;
  uploaded_file_name: string; 
  business_logo_picture = "";

  private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
  private httpOptions = {
      headers: this.headers_object
  };

  constructor(
      private http: HttpClient, 
      private _ErrorService: ErrorService
      ) 
  {}

  ngOnInit() {
      return this.http.get(this.businessSetupUrl, this.httpOptions).subscribe(
          data => this.handleSuccess(data),
          error => this.handleError(error)
      );
  }

  handleSuccess(data) {
      this.business = data.data.business_information;
      this.currencies = data.data.currencies;
      this.categories = data.data.categories;
      this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
  }

  handleError(error) {
      console.log(error);
      this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
  }

  handleFileUpload(files: FileList) {
      this.fileToUpload = files.item(0);
      this.uploaded_file_name = files.item(0).name; 
  }

  onSubmit() {
      this.isLoading = true;
      let formData = new FormData();

      for (var key in this.business) {
          formData.append(key, this.business[key]);
      }

      formData.append('business_logo', this.fileToUpload);
      
      return this.http.post(this.businessSetupUrl, formData, this.httpOptions).subscribe(
          data => this.handleSuccessPost(data),
          error => this.handleErrorPost(error)
      );
  }

  handleSuccessPost(data) {
      this._ErrorService.flashMessage({'type': 'success', 'messages': data.msg } );
      this.isLoading = false;
  }

  handleErrorPost(error) {
      console.log(error);
      this._ErrorService.flashMessage( {'type': 'error', 'messages': error.error } );
    this.isLoading = false;
  }


}
