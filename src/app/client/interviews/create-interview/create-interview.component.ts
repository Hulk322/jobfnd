import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { InterviewService } from 'src/Services/client/interview.service';
import { ErrorService } from 'src/Services/shared/error.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-create-interview',
  templateUrl: './create-interview.component.html',
  styleUrls: ['./create-interview.component.css']
})
export class CreateInterviewComponent implements OnInit {
@Input() submission_id: Number;

  constructor(public activeModal: NgbActiveModal,
    private router:Router,
    private _interview: InterviewService,
    private _ErrorService: ErrorService) { }

  // submission_id: Number;
  private sub: any;
  interview = {
    title: '',
    type: '',
    recommended_dates : [{
      date: '',
      time_in: '',
      time_out: ''
    }
    ],
    recommended_datetime_in: null,
    
    other_datetime_in: null,
    
    notes: '',
    reason: '',
    location: '',
    current_status: 'New'
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

  addDate(){
    
    this.interview.recommended_dates.push({ date: '', time_in: '', time_out: '' });
    
  }

  deleteDate(index){
    this.interview.recommended_dates.splice(index, 1);
  }


  getCreateData() {
   // this.sub = this.route.params.subscribe(params => {
      //this.submission_id = +params['submission_id']; // (+) converts string 'id' to a number
      //alert(this.id);
      this._interview.getCreateData(this.submission_id)
        .subscribe(
          data => this.handleGetCreateDataSuccess(data),
          error => this.handleError(error)

        );

    //});
  }

  handleGetCreateDataSuccess(data){
    this.types = data.data.types;
    this.submission = data.data.submission;
    this.interview.title = this.submission.first_name + " " + this.submission.last_name + " - " + this.submission.job.title;
  }

  handleError(error) {
    console.log(error);
    this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
  }

  onSubmit() {
    this.isLoading = true;
    let formData = new FormData();

    for (var key in this.interview) {
      formData.append(key, this.interview[key]);
    }

    for(var key in this.interview.recommended_dates){
      console.log(this.interview.recommended_dates[key]);
      if(this.interview.recommended_dates[key].date!='')
        formData.set('recommended_dates['+key+"][date]", this.formatDate(this.interview.recommended_dates[key].date));
      formData.set('recommended_dates['+key+"][time_in]", this.interview.recommended_dates[key].time_in);
      formData.set('recommended_dates['+key+"][time_out]", this.interview.recommended_dates[key].time_out);
      //formData.set('recommended_dates['+key+"][date]", '25-05-2019');
    }
    //formData.set('start_date', this.formatDate(this.job.start_date));

    console.log(formData.get('recommended_dates[0][date]'));

    return this._interview.store(this.submission_id, formData).subscribe(
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
    this.router.navigateByUrl('/client/interviews', data.msg.msg);
    this.activeModal.close();
  }

  handleErrorPost(error) {
    console.log(error);
    this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
    this.isLoading = false;
  }

}
