import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-work-history',
  templateUrl: './work-history.component.html',
  styleUrls: ['./work-history.component.css']
})
export class WorkHistoryComponent implements OnInit {

  @Input() employments: {};

  constructor() { }

  ngOnInit() {
  }

}
