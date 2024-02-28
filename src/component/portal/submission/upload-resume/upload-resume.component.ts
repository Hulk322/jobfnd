import { Component, OnInit } from '@angular/core';
import { FileUploadService } from 'src/app/file-upload.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ErrorService } from 'src/Services/shared/error.service';

@Component({
  selector: 'app-upload-resume',
  templateUrl: './upload-resume.component.html',
  styleUrls: ['./upload-resume.component.css']
})
export class UploadResumePortalComponent implements OnInit {

  fileToUpload: File = null;
  isLoading = false;
  fileName = 'Browse file';
  errors = [];
  job_id;
  job_slug;
  uploaded_file_name: string;

  constructor(private fileUploadService: FileUploadService,
    private router: Router,
    private route: ActivatedRoute,
    private _ErrorService: ErrorService) { }

  ngOnInit() {
    this.inItDragDrop(this);
    this.route.params.subscribe(params => {
      this.job_slug = params['job_slug']; // (+) converts string 'id' to a number
    });
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    this.fileName = this.fileToUpload.name;
    this.uploaded_file_name = files.item(0).name;
  }

  uploadFileToActivity() {
    this.isLoading = true;
    this.errors = [];
    this.fileUploadService.postResumeToJob(this.fileToUpload, this.job_slug).subscribe(
      data => this.handleSuccess(data),
      error => this.handleError(error)
    );
  }

  handleSuccess(data) {
    this._ErrorService.flashMessage({ 'type': 'success', 'messages': data.msg });
    this.isLoading = false;
    this.router.navigateByUrl('/applyStep/' + this.job_slug + '/' + data.data.resume.id);
  }

  handleError(error) {

    this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
    this.isLoading = false;


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
