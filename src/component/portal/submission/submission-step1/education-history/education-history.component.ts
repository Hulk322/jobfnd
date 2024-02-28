import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-education-history-portal',
  templateUrl: './education-history.component.html',
  styleUrls: ['./education-history.component.css']
})
export class EducationHistoryPortalComponent implements OnInit {

  @Input() educations: {};

  constructor() { }

  ngOnInit() {
  }

}
