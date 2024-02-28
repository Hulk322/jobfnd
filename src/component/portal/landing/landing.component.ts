import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PublicJobService } from 'src/Services/public_portal/public-job.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  filters : any = {
    what : '',
    where : '',
    experience : 'Experienced'
  };

  stats : any = {
    campanies : 0,
    candidates_hired : 0,
    job_seekers : 0,
    jobs_posted: 0
  };

  placeholder="Choose Location"; 

  experiences :any[] = [
  	"Experiencedi",
  	"Entry",
  	"Fresh",
  	"Intermediate"
  ];

  constructor(private router:Router, private publicJobService:PublicJobService) { }

    ngOnInit() {
     this.curserAnimation();
    let filters = sessionStorage.getItem('filters');
    if(!filters) {
      this.getFilters();
    }else{
      let data = JSON.parse(filters);
      this.stats = data.stats;
      this.experiences = data.experiences;
    }
  }

  getFilters(){
    this.publicJobService.getFilters().then((response : any)=>{
      let data = response.data;
      this.stats = data.stats;
      this.experiences = data.experiences;
      sessionStorage.setItem('filters',JSON.stringify(data));
    },error=>{
      console.log(error);
    });
  }

  search(){
    this.router.navigate(['/jobs'],{queryParams:this.filters });
  }

  getAddress(place: object) {
		this.filters.where = place['formatted_address'];		
  }
  
  curserAnimation () {

      // values to keep track of the number of letters typed, which quote to use. etc. Don't change these values.
      var i = 0,
          a = 0,
          isBackspacing = false,
          isParagraph = false;

      // Typerwrite text content. Use a pipe to indicate the start of the second line "|".  
      var textArray = [
        "Career",
        "Employee",
        "Passion",
        "Geek",
      ];

      // Speed (in milliseconds) of typing.
      var speedForward = 100, //Typing Speed
          speedWait = 1000, // Wait between typing and backspacing
          speedBetweenLines = 1000, //Wait between first and second lines
          speedBackspace = 25; //Backspace Speed

      //Run the loop
      typeWriter("output", textArray);

      function typeWriter(id, ar) {

        var element = $("#" + id),
            aString = ar[a],
            eHeader = element.children("h4"), //Header element
            eParagraph = element.children("p"); //Subheader element
        
        // Determine if animation should be typing or backspacing
        if (!isBackspacing) {
          
          // If full string hasn't yet been typed out, continue typing
          if (i < aString.length) {
            
            // If character about to be typed is a pipe, switch to second line and continue.
            if (aString.charAt(i) == "|") {
              isParagraph = true;
              eHeader.removeClass("cursor");
              eParagraph.addClass("cursor");
              i++;
              setTimeout(function(){ typeWriter(id, ar); }, speedBetweenLines);
              
            // If character isn't a pipe, continue typing.
            } else {
              // Type header or subheader depending on whether pipe has been detected
              if (!isParagraph) {
                eHeader.text(eHeader.text() + aString.charAt(i));
              } else {
                eParagraph.text(eParagraph.text() + aString.charAt(i));
              }
              i++;
              setTimeout(function(){ typeWriter(id, ar); }, speedForward);
            }
            
          // If full string has been typed, switch to backspace mode.
          } else if (i == aString.length) {
            
            isBackspacing = true;
            setTimeout(function(){ typeWriter(id, ar); }, speedWait);
            
          }
          
        // If backspacing is enabled
        } else {
          
          // If either the header or the paragraph still has text, continue backspacing
          if (eHeader.text().length > 0 || eParagraph.text().length > 0) {
            
            // If paragraph still has text, continue erasing, otherwise switch to the header.
            if (eParagraph.text().length > 0) {
              eParagraph.text(eParagraph.text().substring(0, eParagraph.text().length - 1));
            } else if (eHeader.text().length > 0) {
              eParagraph.removeClass("cursor");
              eHeader.addClass("cursor");
              eHeader.text(eHeader.text().substring(0, eHeader.text().length - 1));
            }
            setTimeout(function(){ typeWriter(id, ar); }, speedBackspace);
          
          // If neither head or paragraph still has text, switch to next quote in array and start typing.
          } else { 
            
            isBackspacing = false;
            i = 0;
            isParagraph = false;
            a = (a + 1) % ar.length; //Moves to next position in array, always looping back to 0
            setTimeout(function(){ typeWriter(id, ar); }, 50);
            
          }
        }
      }
  }

}
