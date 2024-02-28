import { Component, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { ErrorService } from "src/Services/shared/error.service";
import { Router } from "@angular/router";
import { HelperUtilityService } from "src/app/helper-utility.service";

@Component({
  selector: "app-business-setup",
  templateUrl: "./business-setup.component.html",
  styleUrls: ["./business-setup.component.css"],
})
export class BusinessSetupComponent implements OnInit {
  businessSetupUrl = environment.baseApiUrlClient + "/client/business-setup";
  fileToUpload: File = null;
  business = {
    name: null,
    description: null,
    subdomain: null,
    website_url: null,
    default_currency: null,
    business_category: null,
    business_logo: null,
    businessLogoFullUrlPublic: null,
    client_id: null,
    location: "",
    score: [],
    display_score: [],
    parse_with: null,
    Sovern: "",
    TalentzHire: "",
  };
  currencies = [];
  categories = [];

  isLoading = false;
  uploaded_file_name: string;
  business_logo_picture = "";
  placeholder = "Choose Place...";

  private headers_object = new HttpHeaders().set(
    "Authorization",
    "Bearer " + localStorage.getItem("token")
  );
  private httpOptions = {
    headers: this.headers_object,
  };

  constructor(
    private http: HttpClient,
    private _ErrorService: ErrorService,
    private _helper: HelperUtilityService,
    private _router: Router
  ) {}

  ngOnInit() {
    return this.http.get(this.businessSetupUrl, this.httpOptions).subscribe(
      (data) => this.handleSuccess(data),
      (error) => this.handleError(error)
    );
  }

  handleSuccess(data) {
    this.business = data.data.business_information;
    console.log( this.business,'businesssssssssssssss')
    if (this.business.score == null) this.business.score = [];
    if (this.business.display_score == null) this.business.display_score = [];

    if (this.business.display_score[1] == "talentzhire") {
      localStorage.setItem("display_talentzhire_score", "true");
    } else {
      localStorage.setItem("display_talentzhire_score", "false");
    }
    if (this.business.display_score[0] == "sovren") {
      localStorage.setItem("display_sovren_score", "true");
    } else {
      localStorage.setItem("display_talentzhire_score", "false");
    }
    this.currencies = data.data.currencies;
    this.categories = this._helper.toSelect2(data.data.categories);
    //this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
  }

  handleError(error) {
    console.log(error);
    this._ErrorService.flashMessage({ type: "error", messages: error.error });
  }

  handleFileUpload(files: FileList) {
    this.fileToUpload = files.item(0);
    this.uploaded_file_name = files.item(0).name;

    var reader = new FileReader();
    //this.imagePath = files; /test
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.business.businessLogoFullUrlPublic = reader.result;
    };
  }
  selectedRadioButtonValue(event) {
    this.business.parse_with = event.target.value;
  }
  onSubmit() {
    this.isLoading = true;
    let formData = new FormData();

    for (var key in this.business) {
      formData.append(key, this.business[key]);
    }

    if (
      this.business.score[1] == true ||
      this.business.score[1] == "talentzhire"
    )
      formData.append("score[1]", "talentzhire");
    if (this.business.score[0] == true || this.business.score[0] == "sovren")
      formData.append("score[0]", "sovren");
    if (
      this.business.display_score[1] == true ||
      this.business.display_score[1] == "talentzhire"
    )
      formData.append("display_score[1]", "talentzhire");
    if (
      this.business.display_score[0] == true ||
      this.business.display_score[0] == "sovren"
    )
      formData.append("display_score[0]", "sovren");
    if (this.business.display_score[1] == "talentzhire") {
      localStorage.setItem("display_talentzhire_score", "true");
    } else {
      localStorage.setItem(
        "display_talentzhire_score",
        this.business.display_score[1]
      );
    }
    if (this.business.display_score[0] == "sovren") {
      localStorage.setItem("display_sovren_score", "true");
    } else {
      localStorage.setItem(
        "display_sovren_score",
        this.business.display_score[0]
      );
    }

    formData.set("score", "");
    formData.set("display_score", "");
    formData.append("business_logo", this.fileToUpload);

    return this.http
      .post(this.businessSetupUrl, formData, this.httpOptions)
      .subscribe(
        (data) => this.handleSuccessPost(data),
        (error) => this.handleErrorPost(error)
      );
  }

  handleSuccessPost(data) {
    this._ErrorService.flashMessage({ type: "success", messages: data.msg });
    this._router.navigateByUrl("/client/dashboard");
    this.isLoading = false;
  }

  handleErrorPost(error) {
    this._ErrorService.flashMessage({ type: "error", messages: error.error });
    this.isLoading = false;
  }

  getAddress(place: object) {
    this.business.location = place["formatted_address"];
  }
}
