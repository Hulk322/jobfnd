import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OnBoardService } from 'src/Services/client/on-board.service';
import { ErrorService } from 'src/Services/shared/error.service';

@Component({
  selector: 'app-create-on-boarding',
  templateUrl: './create-on-boarding.component.html',
  styleUrls: ['./create-on-boarding.component.css']
})
export class CreateOnBoardingComponent implements OnInit {

  constructor(
    private _onboard: OnBoardService,
    private _ErrorService: ErrorService,
    private router: Router,
    private route: ActivatedRoute) { }

  submission_id: Number;
  private sub: any;
  onboard = {
    type: null,
    official_email: null,
    start_date: null,
    end_date: null,
    work_locations: [],
    login_email: '',
    password: '',
    site: '',
    system_access: '',
    badge_access: '',
    gender: '',
    building_floor: '',
    comments: '',
    submission: {
      id: null,
      email: '',
      job: {
        title: ''
      }
    },
    actions: []
  };

  types = [];
  submission;
  isLoading = false;

  ngOnInit() {
    this.getCreateData();
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  

  


  getCreateData() {
    this.sub = this.route.params.subscribe(params => {
      this.submission_id = +params['offer_id']; // (+) converts string 'id' to a number
      //alert(this.id);
      this._onboard.getCreateData(this.submission_id)
        .subscribe(
          data => this.handleGetCreateDataSuccess(data),
          error => this.handleError(error)

        );

    });
  }

  handleGetCreateDataSuccess(data){
    this.types = data.data.types;
    this.submission = data.data.submission;
    //this.offer.title = this.submission.first_name + " " + this.submission.last_name + " - " + this.submission.job.title;
    //this.offer.type = this.submission.job.job_type;
  }

  handleError(error) {
    console.log(error);
    this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
  }

  onSubmit() {
    this.isLoading = true;
    let formData = new FormData();

    for (var key in this.onboard) {
      formData.append(key, this.onboard[key]);
    }

    formData.set('start_date', this.formatDate(this.onboard.start_date));
		formData.set('end_date', this.formatDate(this.onboard.end_date));

   /* if(this.offer.type == "Direct Hire"){
      formData.delete("bill_rate");
      formData.delete("bill_rate_overtime")
    }
    else{
      formData.delete("salary");
      formData.delete("vendor_markup");
    }*/

    return this._onboard.store(this.submission_id, formData).subscribe(
      data => this.handleSuccessPost(data),
      error => this.handleErrorPost(error)
    );


  }

  formatDate(date) {
		var d;
		if (typeof (date) === "string") {
			d = new Date(date);
		} else {
			d = date;
		}

		if (d instanceof Date) {
			var month = '' + (d.getMonth() + 1);
			var day = '' + d.getDate();
			var year = d.getFullYear();

			if (month.length < 2) month = '0' + month;
			if (day.length < 2) day = '0' + day;

      //return [year, month, day].join('-');
      return [day, month, year].join('-');
		} else {
			return null;
		}
	}

  handleSuccessPost(data) {
    console.log(data);
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
    this.isLoading = false;
    this.router.navigateByUrl('/client/on-boarding', data.msg.msg);
  }

  handleErrorPost(error) {
    console.log(error);
    this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
    this.isLoading = false;
  }

}