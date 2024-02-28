import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ErrorService } from 'src/Services/shared/error.service';
import { DataService } from "src/app/data.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  profileUrl = environment.baseApiUrl + "/vendor/profile";
  fileToUpload: File = null;
  user = {
    first_name: null,
    last_name: null,
    email: null,
    meta: {
      phone: null,
      profile_picture: null,
    }
  };
  userOrganization = {
    id: null,
    name: null,
    description: null,
    businessLogoFullUrl: null
  };
  errors: any;
  success: any;
  isLoading = false;
  uploaded_file_name: string;
  full_name = "";
  profile_picture = "";

  private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
  private httpOptions = {
    headers: this.headers_object
  };

  constructor(
    private http: HttpClient,
    private _ErrorService: ErrorService,
    private data: DataService) { }

  ngOnInit() {
    this.data.currentMessage.subscribe(message => this.full_name = message);
    this.data.currentPicturePath.subscribe(path => this.profile_picture = path);
    return this.http.get(this.profileUrl, this.httpOptions).subscribe(
      data => this.handleSuccess(data),
      error => this.handleError(error)
    );
  }

  handleSuccess(data) {
    //console.log(data);
    this.user = data.data.profile;
    this.userOrganization = data.data.userOrganization;
    //this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
  }

  handleError(error) {
    //console.log(error);
    this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
  }

  handleFileUpload(files: FileList) {
    this.fileToUpload = files.item(0);
    this.uploaded_file_name = files.item(0).name;
  }

  onSubmit() {
    this.isLoading = true;
    let formData = new FormData();

    for (var key in this.user) {
      formData.append(key, this.user[key]);
    }

    for (var key in this.user.meta) {
      formData.append(key, this.user.meta[key]);
    }

    for (var key in this.userOrganization) {
      formData.append(key, this.userOrganization[key]);
    }

    formData.append('profile_picture', this.fileToUpload);

    //console.log(formData);

    return this.http.post(this.profileUrl, formData, this.httpOptions).subscribe(
      data => this.handleSuccessPost(data),
      error => this.handleErrorPost(error)
    );
  }

  handleSuccessPost(data) {
    localStorage.setItem('full_name', data.data.user.first_name + " " + data.data.user.last_name);
    localStorage.setItem('profile_picture', data.data.user.meta.profilePictureFullUrl);
    this.data.changeMessage(data.data.user.first_name + " " + data.data.user.last_name);
    this.data.changeProfilePicture(data.data.user.meta.profilePictureFullUrl);
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
    this.isLoading = false;
  }

  handleErrorPost(error) {
    console.log(error.error);
    this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
    this.isLoading = false;
  }

}
