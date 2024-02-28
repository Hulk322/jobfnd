import { Component, OnInit } from '@angular/core';

export interface AutoCompleteModel {
   value: any;
   display: string;
}

@Component({
  selector: 'app-tag-input',
  templateUrl: './tag-input.component.html',
  styleUrls: ['./tag-input.component.css']
})
export class TagInputComponent implements OnInit {

  public items = [
    {display: 'Pizza', value: 1},
    {display: 'Pasta', value: 2},
    {display: 'Parmesan', value: 3},
  ];

  constructor() { }

  ngOnInit() {

    

  }

}