import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {AccountSettingComponent} from 'src/app/candidate/account-setting/account-setting.component'
import {getUserData} from '../account-setting/account-setting.service'
import { from } from 'rxjs';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  // @Input() title: string;
  // @Input() emoji: string;
  //@Output() setAvailbility: EventEmitter<any> = new EventEmitter();
  cardOptions: any = [{name:'Available Now',emoji:'emoji_people',index:"0"},{name:'Available Soon',emoji:'directions_walk',index:"1"},{name:'Open to Offers',emoji:'transfer_within_a_station',index:"2"},{name:'Not Looking',emoji:'airline_seat_flat',index:"3"}]
  availablenow:any = "Available Now";
  availableSoon:any = "Available Soon";
  otOffers:any = "Open to Offers";
  notLooking:any = "Not Looking";
  index:any = [];
  availabilty:any;
  isActive:any;
  constructor(private accountSettings: AccountSettingComponent,
    private getUserData: getUserData) { }

  ngOnInit() {
    
    this.isActive = false;
    this.getDetails();
  }

  getDetails(){
     this.getUserData.getIndustries().subscribe(data => this.handleSuccess(data));
  }

  handleSuccess(data){
    this.isActive = data.data.user.meta.availability;
    if(this.isActive=='null' || this.isActive==null)
      this.isActive = 'Available Now';
  }


  updateAcccountSettings(event:any){
     console.log(this.availabilty)
    let target = event.target || event.srcElement || event.currentTarget;
    let name = (target.textContent === "Available Now" || target.value === "Available Now"|| target.innerText.split(/\n/)[1] === "Available Now" || target.outerText.split(/\n/)[1] === "Available Now") ? this.availablenow :((target.textContent === 'Available Soon'|| target.value === "Available Soon"||target.innerText.split(/\n/)[1] === "Available Soon" || target.outerText.split(/\n/)[1] === "Available Soon")?this.availableSoon:((target.textContent==='Open to Offers'|| target.value==='Open to Offers'||target.innerText.split(/\n/)[1] === "Open to Offers" || target.outerText.split(/\n/)[1] === "Open to Offers")?this.otOffers:((target.textContent==='Not Looking'||target.value==='Not Looking'||target.innerText.split(/\n/)[1] === "Not Looking" || target.outerText.split(/\n/)[1] === "Not Looking")?this.notLooking:'')));
     this.isActive = name;
    this.accountSettings.saveExpectedSalary(name)
  }
}
