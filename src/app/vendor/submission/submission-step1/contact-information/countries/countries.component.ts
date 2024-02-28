import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {

@Input() submission:{
  relocate_country: null,
  country: null
};

  constructor() { }

  ngOnInit() {
  }

}
