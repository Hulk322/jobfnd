import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';  
import { FileUploadService } from './file-upload.service';

describe('FileUploadService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [FileUploadService]
  }));

   it('should be created', () => {
    const service: FileUploadService = TestBed.get(FileUploadService);
    expect(service).toBeTruthy();
  });  
});
