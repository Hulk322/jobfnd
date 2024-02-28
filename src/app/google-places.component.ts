/// <reference types="@types/googlemaps" />
import { Component, ViewChild, EventEmitter, Output, OnInit, AfterViewInit, Input } from '@angular/core';
//import {} from "googlemaps";
@Component({
    selector: 'AutocompleteComponent',
    template: `
    <input class="input form-control"
        id="google_autocomplete_input"
        type="text"
        [(ngModel)]="autocompleteInput"
        (blur)="onBlur()"
        [placeholder]="placeholder"
        #addresstext 
        >

        
    `,
})
export class AutocompleteComponent implements OnInit, AfterViewInit {
    @Input() adressType: string;
    @Output() setAddress: EventEmitter<any> = new EventEmitter();
    @Output() valueChange = new EventEmitter();
    @ViewChild('addresstext', { static: true }) addresstext: any;

    @Input() autocompleteInput: string;
    @Input() placeholder: string = "Choose Location";
    @Input() height: string = "40px";
    queryWait: boolean;

    constructor() {
    }

    ngOnInit() {
    }

    
    onBlur() {
        //alert(this.autocompleteInput);
        this.valueChange.emit(this.autocompleteInput);
    }

    ngAfterViewInit() {
        this.getPlaceAutocomplete();
    }

    private getPlaceAutocomplete() {
        const autocomplete = new google.maps.places.Autocomplete(this.addresstext.nativeElement,
            {
                //componentRestrictions: { country: 'US' },
                types: [this.adressType]  // 'establishment' / 'address' / 'geocode'
            });
        google.maps.event.addListener(autocomplete, 'place_changed', () => {
            const place = autocomplete.getPlace();
            //console.log(place);
            //this.autocompleteInput = place['formatted_address'];
            //this.job.address = place['formatted_address'];
            this.invokeEvent(place);
        });

        google.maps.event.addDomListener(this.addresstext.nativeElement, 'keydown', function(event:KeyboardEvent) { 
            if (event.keyCode === 13) { 
                event.preventDefault(); 
            }
          }); 
    }

    invokeEvent(place: Object) {
        this.setAddress.emit(place);
    }

}