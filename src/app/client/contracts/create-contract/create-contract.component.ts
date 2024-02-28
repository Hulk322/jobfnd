import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ContractService } from 'src/Services/client/contract.service';
import { ErrorService } from 'src/Services/shared/error.service';

@Component({
  selector: 'app-create-contract',
  templateUrl: './create-contract.component.html',
  styleUrls: ['./create-contract.component.css']
})
export class CreateContractComponent implements OnInit {

  isLoading = true;
  current_step = 1;
  jobs = [];
  submissions = [];
  managers = [];
  salary_types = [];
  contract = {
    job_id: null,
    submission_id: null,
    start_date: null,
    end_date: null,
    timesheet_manager: null,
    location: null,
    type: 'Full Time',
    vendor_markup: null,
    notes: null,
    //force_new: null,
    client_overtimerate: null,
    salary:null,
    salary_type:null,
    bill_rate: null,
    client_overtime_rate: null,
    client_doubltime_rate: null,
    contractor_overtime_rate: null,
    contractor_doubltime_rate: null,
    force_new:0
  };

  placeholder = "Type Location...";

  constructor(private _contract: ContractService,
    private _ErrorService: ErrorService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.isLoading = true;
    this.getCreateContractStep1Data();
  }

  getCreateContractStep1Data() {
    this._contract.getCreateStep_1_Data()
      .subscribe(
        data => this.handleGetCreateDataSuccess(data),
        error => this.handleError(error)

      );
  }

  handleGetCreateDataSuccess(data) {
    this.jobs = data.data.jobs;
    this.current_step = 2;
    this.isLoading = false;
  }

  handleError(error) {
    this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
    this.isLoading = false;
  }

  jobChange() {
    this.current_step = 2;
    this.getCreateContractStep2Data();
  }

  submissionChange() {
    this.current_step = 3;
  }


  getCreateContractStep2Data() {
    this._contract.getCreateStep_2_Data(this.contract.job_id)
      .subscribe(
        data => this.handleGetCreateDataStep2Success(data),
        error => this.handleError(error)

      );
  }

  handleGetCreateDataStep2Success(data) {
    this.submissions = data.data.job.light_submissions;
    this.managers = data.data.managers;
    this.salary_types = data.data.salary_types;
    if (this.submissions.length == 1) {
      //this.contract.submission_id = this.submissions[0].id;
      //this.current_step = 3;
    }
    this.isLoading = false;
  }

  getAddress(place: object) {
    this.contract.location = place['formatted_address'];
  }

  onValueChange(newValue) {
    this.contract.location = newValue;
  }

  onSubmit() {
    this.isLoading = true;
    let formData = new FormData();

    for (var key in this.contract) {
      formData.append(key, this.contract[key]);
    }

    formData.set('start_date', this.formatDate(this.contract.start_date));
    formData.set('end_date', this.formatDate(this.contract.end_date));
    
    if(this.contract.type=='Full Time'){
      formData.delete('bill_rate');
      formData.delete('client_overtime_rate');
      formData.delete('contractor_overtime_rate');
      formData.delete('contractor_doubltime_rate');
    }

    if(this.contract.type=='Temp Hire'){
      formData.delete('salary');
      formData.delete('salary_type');
    }

    return this._contract.store(this.contract.submission_id, formData).subscribe(
      data => this.handleSuccessPost(data),
      error => this.handleErrorPost(error)
    );


  }

  handleSuccessPost(data) {
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
    this.isLoading = false;
    //this.router.navigateByUrl('/client/contracts/'+data.data.contract.id, data.msg.msg);
    this.router.navigateByUrl('/client/contracts');
  }

  handleErrorPost(error) {
    this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
    this.isLoading = false;
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

			return [year, month, day].join('-');
		} else {
			return null;
		}
	}

}
