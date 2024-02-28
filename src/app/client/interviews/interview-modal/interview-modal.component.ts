import { Component, OnInit, Input } from '@angular/core';
import { InterviewService } from 'src/Services/client/interview.service';
import { ErrorService } from 'src/Services/shared/error.service';
import { Router } from '@angular/router';
import { Location6 } from './location.model';
import moment from 'moment-timezone';

@Component({
  selector: 'app-interview-modal',
  templateUrl: './interview-modal.component.html',
  styleUrls: ['./interview-modal.component.css']
})
export class InterviewModalComponent implements OnInit {

  @Input() current_submission = {
    id: null,
    job: {
      title: ''
    },
    candidate: {
      first_name: '',
      last_name: ''
    }
  };

  public tzNames: string[];

  @Input() locations: Location6[];

  placeholder='Choose Place...';

  types = ['Face to face', 'Phone', 'Skype'];
  interview_recommended_date = {
    date: null,
    time_in: null,
    time_out: null
  }

  @Input() sidebar_open = false; 

  interview = {
    title: '',
    type: '',
    recommended_dates : [],
    recommended_datetime_in: null,
    
    other_datetime_in: null,
    
    notes: '',
    reason: '',
    location: '',
    current_status: 'New',
    skype_id: '',
    phone: '',
  };

  exampleData = [];
  options = {
		multiple: false
  };
  

  current_interview_type;
  togglesidebar(submission, event) {
    if(submission.candidate)
      this.interview.title = submission.candidate.first_name + " " + submission.candidate.last_name + " - " + submission.job.title;
    this.interview.type = this.types[0];
    this.current_interview_type = this.interview.type;
    this.sidebar_open = !this.sidebar_open; 
  }

  constructor(private _interview: InterviewService, 
    private router: Router,
    private _ErrorService: ErrorService) { 
      this.tzNames = moment.tz.names();
     }

    

  ngOnInit() {
    this.interview.recommended_dates.unshift({ date: null, time_in: null, time_out: null });


    for (var key in this.locations) {
			var obj = this.locations[key];
			this.exampleData.push({
				id: obj.location,
				text: obj.location
			});
    } 
    
    //this.locations = this.exampleData;

  }

  isLoading = false;

  msg_array = [];
  onSubmit() {

    this.msg_array = [];
    if(this.interview.location=='' && this.interview.type=='Face to face')
    {
      this.msg_array.push('Location is required.');
    }

     if( this.interview.type == 'Phone' && this.interview.phone == '')
    {
      this.msg_array.push('Phone is required.');
    }

    if( this.interview.type == 'Skype' && this.interview.skype_id == '')
    {
      this.msg_array.push('Skype Id is required.');
    } 

    console.log(this.interview.recommended_dates[0]['date']);

    if( this.interview.recommended_dates[0]['date']==null || 
        this.interview.recommended_dates[0]['date']== 'Invalid Date' || 
        this.interview.recommended_dates[0]['time_in']==null || 
        this.interview.recommended_dates[0]['time_out']==null )
    {
      console.log(this.interview.recommended_dates[0]['date']);
      this.msg_array.push('Select at least one date with time in & out.');
    }

    if(this.msg_array.length>0)
    {
      
      var msg = {
      data: [],
      msg: this.msg_array,
      messages: []
      };

      this._ErrorService.flashMessage({ 'type': 'error', 'messages': msg });
      return true;
    }

    this.isLoading = true;
    let formData = new FormData();
  
    for (var key in this.interview) {
      formData.append(key, this.interview[key]);
    }
  
    for(var key in this.interview.recommended_dates){
      console.log(this.interview.recommended_dates[key]);
      if(this.interview.recommended_dates[key].date!='' && this.interview.recommended_dates[key].date!=null && this.interview.recommended_dates[key].date!='null'){
        formData.set('recommended_dates['+key+"][date]", this.formatDate(this.interview.recommended_dates[key].date));
      formData.set('recommended_dates['+key+"][time_in]", this.interview.recommended_dates[key].time_in);
      formData.set('recommended_dates['+key+"][time_out]", this.interview.recommended_dates[key].time_out);
      }
      //formData.set('recommended_dates['+key+"][date]", '25-05-2019');
    }
    //formData.set('start_date', this.formatDate(this.job.start_date));
  
    formData.set('force_new', '1');
  
    return this._interview.store(this.current_submission.id, formData).subscribe(
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
    //this.activeModal.close();
  }
  
  handleErrorPost(error) {
    console.log(error.error);
    this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
    this.isLoading = false;
  }

  /* addDate(){
    if(this.interview_recommended_date.date!=null && this.interview_recommended_date.time_in != null && this.interview_recommended_date.time_out != null){
      this.interview.recommended_dates.push({ date: this.interview_recommended_date.date, time_in: this.interview_recommended_date.time_in, time_out: this.interview_recommended_date.time_out });
      this.interview_recommended_date = { date: null, time_in: null, time_out: null };
    }
  } */

  addDate(){
      this.interview.recommended_dates.push({ date: null, time_in: null, time_out: null });
  }
  
  deleteDate(index){
    this.interview.recommended_dates.splice(index, 1);
  }

  getAddress(place: object) {
    this.interview.location = place['formatted_address'];
  }
  
  onValueChange(newValue) {
    this.interview.location = newValue;
  }

}
