import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-countries-portal',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesPortalComponent implements OnInit {

@Input() submission:{
  relocate_country: null
};

  constructor() { }

  ngOnInit() {
  }

}
