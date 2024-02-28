import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ErrorService } from 'src/Services/shared/error.service';

@Component({
  selector: 'app-upload-talent',
  templateUrl: './upload-talent.component.html',
  styleUrls: ['./upload-talent.component.css']
})
export class UploadTalentComponent implements OnInit {

  fileName = 'Browse file'; 
  isLoading = false;
  selectedFiles: File[] = [];
  current_file = 0;
  private bulkUploadUrl = environment.baseApiUrl+"/vendor/talent/upload-resume";
  parsed_resumes = [];
  parcing_done = false;

  private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
  private httpOptions = {
    headers: this.headers_object
  };

  // when files are selected, save them in array selectedFiles
  fileAdded(event) {
    if(event.target.files.length){
      this.selectedFiles = [];
      this.current_file = 0;
      for(let i=0 ; i < event.target.files.length ;i++){ 
        this.selectedFiles.push(<File>event.target.files[i]);
        console.log(<File>event.target.files[i]);
      }
    }
  }

  uploadFileToActivity() {
    this.isLoading = true;
    if(this.current_file>=this.selectedFiles.length)
      this.parcing_done = true;
      //this.router.navigateByUrl('/vendor/talent-pool');
    else
      this.proccessFile();
    
  }

  proccessFile(){
    
    var form_data = new FormData();
    form_data.append('resume[]', this.selectedFiles[this.current_file], this.selectedFiles[this.current_file].name);

    return this.http.post(this.bulkUploadUrl, form_data, this.httpOptions).subscribe(
      data =>this.handleSuccessPost(data),
      error => this.handleErrorPost(error)
    );
  }

  handleSuccessPost(data)
  {
    console.log(data);
    this._ErrorService.flashMessage({'type': 'success', 'messages': data.msg } );
    data.data.newCandidates.forEach(function(entry) {
      console.log(entry);
      this.parsed_resumes.unshift(entry);
    }.bind(this));
    
    //console.log(this.parced_resumes);
    this.current_file++;
    this.uploadFileToActivity()
    //this.isLoading = false;
    //this.router.navigateByUrl('/vendor/talent-pool');
  }

    handleErrorPost(error){
      console.log(error);
      this._ErrorService.flashMessage( {'type': 'error', 'messages': error.error } );
      this.isLoading = false;
    }

  constructor( 
        private http: HttpClient, 
        private router: Router,
        private _ErrorService: ErrorService) { }

  ngOnInit() {
    this.inItDragDrop(this);
  }

  isAdvancedUpload = function()
    {
      var div = document.querySelector( '.dropzone-container' );
      return ( ( 'draggable' in div ) || ( 'ondragstart' in div && 'ondrop' in div ) ) && 'FormData' in window && 'FileReader' in window;
    };

  inItDragDrop(that) {

    // drag&drop files if the feature is available
    var form = document.querySelector( '.dropzone-container' );
    var filename = document.querySelector( '.filename' );
    var droppedFiles;
    var input     = document.querySelector( 'input[type="file"]' );
   

    if( this.isAdvancedUpload )
    {  
      
      form.classList.add( 'has-advanced-upload' ); // letting the CSS part to know drag&drop is supported by the browser

      [ 'drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop' ].forEach( function( event )
      {
        form.addEventListener( event, function( e )
        {
          // preventing the unwanted behaviours
          e.preventDefault();
          e.stopPropagation();
        });
      });

      [ 'dragover', 'dragenter' ].forEach( function( event )
      {
        form.addEventListener( event, function()
        {
          form.classList.add( 'is-dragover' );
        });
      });

      [ 'dragleave', 'dragend', 'drop' ].forEach( function( event )
      {
        form.addEventListener( event, function()
        {
          form.classList.remove( 'is-dragover' );
        });
      });

      form.addEventListener( 'drop', function( DragEvent: DragEvent  )
      {  
        //console.log(DragEvent); 
        droppedFiles = DragEvent.dataTransfer.files; // the files that were dropped
        console.log(droppedFiles);
        if (droppedFiles) {
          that.selectedFiles = [];
          this.current_file = 0;
          for(let i=0 ; i < droppedFiles.length ;i++){ 
            that.selectedFiles.push(droppedFiles[i]);
            console.log(droppedFiles[i]);
          }
          //that.fileToUpload = droppedFiles[0];
           //var filename = document.querySelector( '.filename' );
           //filename.textContent = droppedFiles[0].name  ;
        }

      });

    }
  }

}
