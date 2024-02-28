import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-skills-portal',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css']
})
export class SkillsPortalComponent implements OnInit {

  
  skill_1:any;
  skill_2:any;
  skill_3:any;
  
  @Input() skills: {};

  constructor() { }

  ngOnInit() {

    
  }

}
