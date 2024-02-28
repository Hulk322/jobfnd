import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { LocationService } from 'src/Services/client/location.service';
import { ErrorService } from 'src/Services/shared/error.service';
declare var jQuery:any;

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.css']
})
export class LocationsComponent implements OnInit {

  isLoading = false;
  locations = [];
  location = {
    id: null,
    name: null,
    location: null,
    country: null,
    state: null,
    city: null,
    zip: null,
    deleted: false
  };

  placeholder = "Choose Place...";
  @ViewChild('completeModal', { static: true }) completeModal: ElementRef;

  constructor(
    private _locationService: LocationService,
    private _ErrorService: ErrorService
  ) 
  { }

  ngOnInit() {
    this.isLoading = true;
    this._locationService.getLocations()
        .subscribe( 
          data => this.handleSuccess(data),
         err => this.handleError(err)
      );
  }

  handleSuccess(data){
    this.locations = data.data.locations;
    this.isLoading = false;
  }

  onSubmit(){    // handle both add/update
    this.isLoading = true;
    if(this.location.id) {
      this._locationService.update(this.location).subscribe( 
        data => this.handleUpdateSuccess(data),
        err => this.handleAddError(err)
      );
    }
    else{
      this._locationService.add(this.location).subscribe( 
        data => this.handleAddSuccess(data),
        err => this.handleAddError(err)
      );
    }
  }

  addOrupdate(){
    this.isLoading = true;
    if(this.location.id) {
      this._locationService.update(this.location).subscribe( 
        data => this.handleUpdateSuccess(data),
        err => this.handleAddError(err)
      );
    }
    else{
      this._locationService.add(this.location).subscribe( 
        data => this.handleAddSuccess(data),
        err => this.handleAddError(err)
      );
    }
  }

  edit(location){
    this.location = location;
  }

  delete(id, department){
    
    var answer = confirm('Are you sure you want to delete this location?');
    if(answer){
      this.isLoading = true;
      department.deleted = true;
      for(let i = 0; i < this.locations.length; ++i){
        if (this.locations[i].id === id) {
          this._locationService.delete(department)
        .subscribe( 
          data => this.handleDeleteSuccess(i, data),
          err => this.isLoading = false
        );
            
        }
      }
    }
  }

  handleDeleteSuccess(index, data){
    this.locations.splice(index, 1);
    this.location = { id:null, name:null, location: null, country:null, state: null, city: null, zip:null, deleted:false };
    this._ErrorService.flashMessage({'type': 'success', 'messages': data.msg } );
    this.isLoading = false;
  }

  handleAddSuccess(data){
    jQuery(this.completeModal.nativeElement).modal('hide'); 
    this.location.id = data.data.location.id;
    this.locations.unshift(this.location);
    this.location = { id:null, name:null, location: null, country:null, state: null, city: null, zip:null, deleted:false };
    this._ErrorService.flashMessage({'type': 'success', 'messages': data.msg } );
    this.isLoading = false;
  }

  handleUpdateSuccess(data){
    jQuery(this.completeModal.nativeElement).modal('hide'); 
    this.location = { id:null, name:null, location: null, country:null, state: null, city: null, zip:null, deleted:false };
    this._ErrorService.flashMessage({'type': 'success', 'messages': data.msg } );
    this.isLoading = false;
  }

  handleAddError(error){
    this._ErrorService.flashMessage( {'type': 'error', 'messages': error.error } );
    this.isLoading = false;
  }

  handleError(error){
     this._ErrorService.flashMessage( {'type': 'error', 'messages': error.error } );
     this.isLoading = false;
   }

   getAddress(place: object) {
    this.location.location = place['formatted_address'];
    this.location.country = this.getCountry(place);
    this.location.state = this.getState(place);
    this.location.city = this.getCity(place);
    this.location.zip = this.getPostCode(place);
    console.log(this.location);
  }
  
  onValueChange(newValue) {
    this.location.location = newValue;
    /* this.location.country = this.getCountry(place);
    this.location.state = this.getState(place);
    this.location.city = this.getCity(place); */
  }

  dataDismiss() {
    this.location = { id:null, name:null, location: null, country:null, state: null, city: null, zip:null, deleted:false };
  }

  getDistrict(place) {
    const COMPONENT_TEMPLATE = { administrative_area_level_2: 'short_name' },
      state = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return state;
  }

  getCountryShort(place) {
    const COMPONENT_TEMPLATE = { country: 'short_name' },
      countryShort = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return countryShort;
  }

  getCountry(place) {
    const COMPONENT_TEMPLATE = { country: 'long_name' },
      country = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return country;
  }

  getStreet(place) {
    const COMPONENT_TEMPLATE = { route: 'long_name' },
      street = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return street;
  }

  getCity(place) {
    const COMPONENT_TEMPLATE = { locality: 'long_name' },
      city = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return city;
  }

  getState(place) {
    const COMPONENT_TEMPLATE = { administrative_area_level_1: 'short_name' },
      state = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return state;
  }

  getAddrComponent(place, componentTemplate) {
    let result;

    for (let i = 0; i < place.address_components.length; i++) {
      const addressType = place.address_components[i].types[0];
      if (componentTemplate[addressType]) {
        result = place.address_components[i][componentTemplate[addressType]];
        return result;
      }
    }
    return;
  }

  getStreetNumber(place) {
    const COMPONENT_TEMPLATE = { street_number: 'short_name' },
      streetNumber = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return streetNumber;
  }

  getPostCode(place) {
    const COMPONENT_TEMPLATE = { postal_code: 'long_name' },
      postCode = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return postCode;
  }

}
