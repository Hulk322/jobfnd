import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-work-history-portal',
  templateUrl: './work-history.component.html',
  styleUrls: ['./work-history.component.css']
})
export class WorkHistoryPortalComponent implements OnInit {

  @Input() employments: {};

  constructor() { }

  ngOnInit() {
  }

}
