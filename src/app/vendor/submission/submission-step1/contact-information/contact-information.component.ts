import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'submission-step1-contact-information',
  templateUrl: './contact-information.component.html',
  styleUrls: ['./contact-information.component.css']
})
export class ContactInformationComponent implements OnInit {

  @Input() submission: {
    email: null,
    home_phone: null,
    mobile: null,
    address: null,
    full_address: null,
    city:null,
    state:null,
    zip: null,
    facebook: null,
    linkedin: null,
    twitter: null,
    
  };

  constructor() { }

  ngOnInit() {
  }

}
