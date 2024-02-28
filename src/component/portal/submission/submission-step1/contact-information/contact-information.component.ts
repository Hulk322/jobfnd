import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'submission-step1-contact-information-portal',
  templateUrl: './contact-information.component.html',
  styleUrls: ['./contact-information.component.css']
})
export class ContactInformationPortalComponent implements OnInit {

  @Input() submission: {
    email: null,
    home_phone: null,
    mobile: null,
    full_address: null,
    city:null,
    state:null,
    country_code: null,
    facebook: null,
    linkedin: null,
    twitter: null,
    
  };

  constructor() { }

  ngOnInit() {
  }

}
