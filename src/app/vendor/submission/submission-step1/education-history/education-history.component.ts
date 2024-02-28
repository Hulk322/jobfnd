import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-education-history',
  templateUrl: './education-history.component.html',
  styleUrls: ['./education-history.component.css']
})
export class EducationHistoryComponent implements OnInit {

  @Input() educations: {};

  constructor() { }

  ngOnInit() {
  }

}
