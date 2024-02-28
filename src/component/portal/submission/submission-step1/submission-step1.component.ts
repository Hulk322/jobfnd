import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-submission-step1',
  templateUrl: './submission-step1.component.html',
  styleUrls: ['./submission-step1.component.css']
})
export class PortalSubmissionStep1Component implements OnInit {

isLoading = false;

public submission = {
  first_name: null,
  middle_name: null,
  last_name: null,
  dob: null,
  gender: null,
  willing_to_relocated: null,
  job_id: null,
  cv_id: null,
  employments: null,
  educations: null,
  skills : null
};
sub;
job_id;
cv_id;

step1Url= environment.baseApiUrl+'/v1/';
cvUrl= environment.baseApiUrl+'/v1/cvs-public/';

  constructor(private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router) { }

    private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
    private httpOptions = {
      headers: this.headers_object
    };

  ngOnInit() {

      this.isLoading = true;
      this.sub = this.route.params.subscribe(params => {
      this.job_id = +params['job_slug']; // (+) converts string 'id' to a number
      this.cv_id = +params['cv_id']; // (+) converts string 'id' to a number
      return this.http.get(this.cvUrl+this.cv_id, this.httpOptions).subscribe(
        data => this.handleSuccess(data),
        error => this.handleError(error)
      );
      
       
    });

  }

  onSubmit(){
    console.log("submission: "+this.submission);
    this.isLoading = true;

    this.submission.job_id = this.job_id;
    this.submission.cv_id = this.cv_id;

    var form_data = new FormData();

    for ( var key in this.submission ) {
        form_data.append(key, this.submission[key]);
    }
                
    //education data
    //this.submission.educations.push(this.education);
    for ( var key in this.submission.educations ) {
        var obj = this.submission.educations[key];
        form_data.append('edu['+key+'][degree_type]', obj.degree_type);
        form_data.append('edu['+key+'][institute]', obj.institute);
        form_data.append('edu['+key+'][end_date]', obj.end_date);
        
        console.log('edu['+key+'][degree_type]'+'-->'+'edu['+key+'][institute]');
    }

                //skills data
                if(this.submission.skills.length==0)
                {
                   // this.submission.skills.push(this.skill_1);
                   // this.submission.skills.push(this.skill_2);
                   // this.submission.skills.push(this.skill_3);
                }
                for ( var key in this.submission.skills ) {
                    var obj = this.submission.skills[key];
                    if(obj.title)
                    {
                        form_data.append('skill['+key+'][title]', obj.title);
                        form_data.append('skill['+key+'][level]', obj.level);
                    
                        //console.log('skill['+key+'][title]'+'-->'+'skill['+key+'][level]');
                    }
                }

                console.log("form_data: "+form_data);

                return this.http.post(this.step1Url+this.job_id+'/submission/step-1', form_data, this.httpOptions).subscribe(
                  data =>this.handleSuccessPost(data),
                  error => this.handleErrorPost(error)
                );

  }

  handleSuccess(data){
    this.submission = data.data.cv;
    
    for ( var key in this.submission.skills ) {
      var obj = this.submission.skills[key];
      obj.display = obj.title;
      obj.value = obj.id;
    }

    /*this.submission.skills =  [
      {display: 'Pizza', value: 1},
      {display: 'Pasta', value: 2},
      {display: 'Parmesan', value: 3},
    ];*/

    this.isLoading = false;
  }

  handleSuccessPost(data){
    console.log(data);
    this.isLoading = false;
    this.router.navigateByUrl('/submission-step-2/'+this.job_id+'/'+data.data.submission_id+"/"+this.cv_id);
  }

  handleErrorPost(error){
    console.log(error);
    this.isLoading = false;
    //this.router.navigateByUrl('/login');
  }

  handleError(error){
    console.log(error);
    this.isLoading = false;
    //this.router.navigateByUrl('/login');
  }

}
