import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OfferService } from 'src/Services/client/offer.service';
import { ErrorService } from 'src/Services/shared/error.service';
import { HelperUtilityService } from 'src/app/helper-utility.service';

@Component({
  selector: 'app-create-offer',
  templateUrl: './create-offer.component.html',
  styleUrls: ['./create-offer.component.css']
})
export class CreateOfferComponent implements OnInit {

  constructor(
    private _offer: OfferService,
    private _ErrorService: ErrorService,
    private router: Router,
    private _helper: HelperUtilityService,
    private route: ActivatedRoute) { }

  submission_id: Number;
  private sub: any;
  placeholder="";
  offer = {
    title: '',
    rate_negotiable: 0,
    type: '',
    payment_type: '',
    is_exempted: 0,
    salary: 345,
    vendor_markup: 444,
    bill_rate: 253,
    bill_rate_overtime: null,
    notes: '',
    reason: '',
    current_status: 'New',
    created_at: '',
    start_date: null,
    end_date: null,
    budget: null,
    client_budget: null,
    candidate_budget: null,
    currency: null,
    submission: {
      id: null,
      email: '',
      estimated_joning_date: '',
      home_phone: '',
      mobile: '',
      location: '',
      type: '',
      salary_type: '',
      skills : [],
      candidate_name: '',
      candidate_email: '',
      job: {
        title: '',
        job_type: '',
      },
      candidate: {
        first_name: '',
        last_name: ''
      },
    },
    actions: [],
    
    client_regular_rate : null,
    client_overtime_rate : 0,
    client_doubletime_rate : 0,

    candidate_regular_rate : null,
    candidate_overtime_rate : 0,
    candidate_doubletime_rate : 0,

    market_rate : 0,
    negotiate_rate : 0,
    manager_id : '',
    
    location: "",
  };

  types = [];
  submission;
  teamMembers = [];
  benefits    = [];
  currencies    = [];
  locations = [];
  isLoading = false;
  settings= {
    "client_overtime_rate": 0, 
    "client_doubletime_rate": 0,
    "candidate_overtime_rate": 0,
    "candidate_doubletime_rate": 0, 
  };
  defaultSkillsCount = 10;
  showMoreText = "more";
  current_tab = "pdf";

  

  ngOnInit() {
    this.isLoading = true;
    this.getCreateData();
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  getAddress(place: object) {
      this.offer.location = place['formatted_address'];
  }


  getCreateData() {
    this.sub = this.route.params.subscribe(params => {
      this.submission_id = +params['submission_id']; // (+) converts string 'id' to a number
      //alert(this.id);
      this._offer.getCreateData(this.submission_id)
        .subscribe(
          data => this.handleGetCreateDataSuccess(data),
          error => this.handleError(error)

        );

    });
  }

  
  
  pay_types = this._helper.convertToSelect2(["Hourly", "Weekly", "Monthly", "Yearly"]);
  ExemptionTypes = this._helper.convertToSelect2([
    {id:1, name:"Exempt"},
    {id:0, name:"Non-Exempt"}
  ]);

  handleGetCreateDataSuccess(data){
    this.types = this._helper.convertToSelect2(data.data.types);
    this.submission = data.data.submission;

    if(this.submission.job.currency =='' || this.submission.job.currency==null)
			this.offer.currency = 'USD';
		else
			this.offer.currency = this.submission.job.currency;

    this.teamMembers = this._helper.convertToSelect2(data.data.teamMembers, 'id', ':first_name :last_name');
    this.offer.manager_id = this.submission.job.hiring_manager;
    this.offer.title = this.submission.first_name + " " + this.submission.last_name + " - " + this.submission.job.title;
    this.offer.type = this.submission.job.job_type;
    this.offer.payment_type = this.submission.job.salary_type;
    // this.offer.start_date = this.submission.job.start_date;
    this.offer.start_date = this._helper.inputFormatDate(this.submission.job.start_date);
    this.offer.end_date = this._helper.inputFormatDate(this.submission.job.tentative_end_date);
    this.settings = data.data.settings.length > 0 ? JSON.parse(data.data.settings[0].settings): []
    this.offer.submission.estimated_joning_date = this.submission.estimated_joning_date;
    this.offer.submission.home_phone = this.submission.home_phone;
    this.offer.submission.mobile = this.submission.mobile;
    this.offer.submission.location = this.submission.location;
    this.offer.submission.type = this.submission.type;
    this.offer.submission.salary_type = this.submission.salary_type;
    this.offer.submission.skills = this.submission.skills;
    this.offer.submission.candidate_name = this.submission.candidate.first_name + " " + this.submission.candidate.last_name;
    this.offer.submission.candidate_email = this.submission.candidate.email;
    this.locations = this._helper.convertToSelect2(data.data.locations, 'location', ':name - :location');
    this.benefits = data.data.benefits;
    this.offer.client_regular_rate = this.submission.job.min_rate;
    this.offer.location = this.submission.job.address;

    this.currencies = this._helper.convertToSelect2(data.data.currencies);

    this.isLoading = false;
  }

  handleError(error) {
    // console.log(error);
    this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
    this.isLoading = false;
  }

  msg_array = [];
  onSubmit() {
    this.isLoading = true;

    this.msg_array = [];
    if(this.offer.location=='')
    {
      this.msg_array.push('Location is required.');
    }

     if( this.offer.title == '')
    {
      this.msg_array.push('Title is required.');
    }

    if( this.offer.manager_id == '')
    {
      this.msg_array.push('Manager is required.');
    } 

    

    if( this.offer.type=='' )
    {
      
      this.msg_array.push('Employee Type is required.');
    }

    if(this.offer.client_regular_rate=='')
      this.msg_array.push('Client Regular Rate is required.');

    if(this.offer.candidate_regular_rate=='' || this.offer.candidate_regular_rate==0 || this.offer.candidate_regular_rate==null)
      this.msg_array.push('Candidate Regular Rate is required.');

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


    this.offer.start_date = this.formatDate(this.offer.start_date);
    this.offer.end_date = this.formatDate(this.offer.end_date);
    let formData = new FormData();


    for (var key in this.offer) {
      formData.append(key, this.offer[key]);
    }
    console.log(formData);
    if(this.offer.type == "Full Time"){
      formData.delete("bill_rate");
      formData.delete("bill_rate_overtime")
    }
    else{
      formData.delete("salary");
      formData.delete("vendor_markup");
    }

    if(formData.get('rate_negotiable')==null)
      formData.delete("rate_negotiable")
    
    formData.set('force_new', '1');

    //Add benefits
    for (var key in this.benefits) {
      var obj = this.benefits[key];
      if(obj.checked==true)
        formData.append("benefits[]", obj.id);
    }

    return this._offer.store(this.submission_id, formData).subscribe(
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

        return [month, day, year].join('/');
      } else {
        return null;
      }
	}

  handleSuccessPost(data) {
    
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
    this.isLoading = false;
    this.router.navigateByUrl('/client/offers', data.msg.msg);
  }

  handleErrorPost(error) {
    
    this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
    this.isLoading = false;
  }

  calculateRate () {

    this.offer.client_overtime_rate = this.offer.client_regular_rate *  this.settings.client_overtime_rate;
    this.offer.client_doubletime_rate = this.offer.client_regular_rate *  this.settings.client_doubletime_rate;
    this.offer.candidate_overtime_rate = this.offer.candidate_regular_rate *  this.settings.candidate_overtime_rate;
    this.offer.candidate_doubletime_rate = this.offer.candidate_regular_rate *  this.settings.candidate_doubletime_rate;
    if(this.offer.type == 'Full Time') {
    this.yearlySalaryWhenPaymentTypeIsFullTime();
    }else if(this.offer.type == 'Temp Hire') {
    this.hourlySalaryWhenPaymentTypeIsHourly();  
    }
  }

  yearlySalaryWhenPaymentTypeIsFullTime() {
    let hoursADay   = 8;
    let daysAMonth  = 26; 
    let weeksAMonth = 4;
    let year        = 12;
    if(this.offer.payment_type == 'Hourly') {
      this.offer.client_budget = this.offer.client_regular_rate * (( hoursADay * daysAMonth ) * year);
      this.offer.candidate_budget = this.offer.candidate_regular_rate * ((hoursADay * daysAMonth) * year);
    } else if(this.offer.payment_type == 'Weekly') {
      this.offer.client_budget = this.offer.client_regular_rate * (weeksAMonth * year);
      this.offer.candidate_budget = this.offer.candidate_regular_rate * ( weeksAMonth * year);
    } else if(this.offer.payment_type == 'Monthly') {
      this.offer.client_budget = this.offer.client_regular_rate * year;
      this.offer.candidate_budget = this.offer.candidate_regular_rate * year;
    } else if( this.offer.payment_type = 'Yearly') {   
     this.offer.client_budget = this.offer.client_regular_rate;
     this.offer.candidate_budget = this.offer.candidate_regular_rate;
    }

    this.offer.client_budget = this.offer.client_budget*1.10;

  }

  hourlySalaryWhenPaymentTypeIsHourly() {
    let hoursADay   = 8;
    let daysAMonth  = 26; 
    let weeksAMonth = 4;
    let year        = 12;
    let totalHoursAYear = (daysAMonth * hoursADay);
    let oneWeekAdays = 6.5;
    if(this.offer.payment_type == 'Hourly') {
      this.offer.client_budget = this.offer.client_regular_rate;
      this.offer.candidate_budget = this.offer.candidate_regular_rate;
    }else if(this.offer.payment_type == 'Weekly') {
      this.offer.client_budget = this.offer.client_regular_rate * (oneWeekAdays * hoursADay);
      this.offer.candidate_budget = this.offer.candidate_regular_rate * (oneWeekAdays * hoursADay);
    }else if(this.offer.payment_type == 'Monthly') {
      this.offer.client_budget = this.offer.client_regular_rate * (daysAMonth * hoursADay);
      this.offer.candidate_budget = this.offer.candidate_regular_rate * (daysAMonth * hoursADay);
    }else if(this.offer.payment_type == 'Yearly') {
      this.offer.client_budget = this.offer.client_regular_rate *  (totalHoursAYear * year);
      this.offer.candidate_budget = this.offer.candidate_regular_rate * (totalHoursAYear * year);
    }

    this.offer.client_budget = this.offer.client_budget*1.10;
  }

  toggleSkillsCount(){
    if(this.defaultSkillsCount==10) {
      this.defaultSkillsCount = this.offer.submission.skills.length;
      this.showMoreText = "less";
    }else{
      this.showMoreText = "more";
      this.defaultSkillsCount = 10;
    }
  }

  changeSalaryType(){
    if(this.offer.type == 'Full Time'){
      this.offer.payment_type = 'Yearly';
    }
    else if(this.offer.type == 'Temp Hire'){
      this.offer.payment_type = 'Hourly';
    }else{
      this.offer.payment_type = '';
    }
  }

}
