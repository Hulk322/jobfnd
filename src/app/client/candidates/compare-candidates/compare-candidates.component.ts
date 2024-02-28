import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-compare-candidates',
  templateUrl: './compare-candidates.component.html',
  styleUrls: ['./compare-candidates.component.css']
})
export class CompareCandidatesComponent implements OnInit {

  @Input() comparison_data: any[];
  @Input() compare_ids:[];

  constructor() { }

  ngOnInit() {
  }

}
