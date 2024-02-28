import { Component, OnInit } from '@angular/core';
import { UploadResumeService } from 'src/Services/candidate/upload-resume.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ErrorService } from 'src/Services/shared/error.service';


@Component({
  selector: 'app-first-time-profile',
  templateUrl: './first-time-profile.component.html',
  styleUrls: ['./first-time-profile.component.css']
})
export class FirstTimeProfileComponent implements OnInit {

  fileToUpload: File = null;
  fileName = 'Browse file'; 
  isLoading = false;
  user;
   
  

  constructor(private fileUploadService:UploadResumeService,
    private router: Router,
    private route: ActivatedRoute,
    private _ErrorService: ErrorService  ) { }

  ngOnInit() {
      this.user = localStorage.getItem("user");
      this.inItDragDrop(this); 
      //if parced resume let to to next setup 
      // if (this.user.first_time == 1 ) {
      //    this.router.navigateByUrl('/candidate/resume');  
      // }
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    this.fileName = this.fileToUpload.name; 
  }

    uploadFileToActivity() {
      this.isLoading = true;
      this.fileUploadService.postFile(this.fileToUpload).subscribe(
        data => this.handleSuccess(data),
        error => this.handleError(error)
      );;
    }

    handleSuccess(data)
    {
      console.log(data);
      this.router.navigateByUrl('/candidate/profile');
    }

    handleError(error){
      console.log(error);
      this._ErrorService.flashMessage( {'type': 'error', 'messages': error.error } );
      this.isLoading = false;
    }

    isAdvancedUpload = function()
    {
      var div = document.querySelector( '.dropzone-container' );
      return ( ( 'draggable' in div ) || ( 'ondragstart' in div && 'ondrop' in div ) ) && 'FormData' in window && 'FileReader' in window;
    };

     showFiles( files )
      {  
        alert('showFiles'); 
        console.log(files[ 0 ].name); 
        console.log(files.length); 
        this.fileName = files.length >= 1 ? files[0].name : '' ;
        
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
          console.log(DragEvent); 
          droppedFiles = DragEvent.dataTransfer.files; // the files that were dropped
          if (droppedFiles) {
            that.fileToUpload = droppedFiles[0];
             var filename = document.querySelector( '.filename' );
             filename.textContent = droppedFiles[0].name  ;
          }

        });

      }
    }



}
