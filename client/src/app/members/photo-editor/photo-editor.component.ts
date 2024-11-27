import { Component, inject, input, OnInit, output } from '@angular/core';
import { Tiner } from '../../_models/tiner';
import { DecimalPipe, NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { FileUploader, FileUploadModule } from 'ng2-file-upload';
import { AccountService } from '../../_services/account.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-photo-editor',
  standalone: true,
  imports: [NgIf, NgFor, NgStyle, FileUploadModule, NgClass, DecimalPipe],
  templateUrl: './photo-editor.component.html',
  styleUrl: './photo-editor.component.css'
})
export class PhotoEditorComponent implements OnInit {
  tiner = input.required<Tiner>();

  private accService = inject(AccountService);
  uploader?: FileUploader;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;
  tinerChange = output<Tiner>();

  ngOnInit(): void {
    this.initializeUploader();
  }

  fileOverBase(e: any) {
    this.hasBaseDropZoneOver = e;
  }

  initializeUploader() {
    console.log('Initializing uploader...');

    this.uploader = new FileUploader({
      url: this.baseUrl + 'user/add-photo',
      authToken: 'Bearer ' + this.accService.currentUser()?.token,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });

    this.uploader.onAfterAddingFile = (file) => {
            console.log('File added:', file);
      file.withCredentials = false;
    };

    // Append the correct key for FormData
    this.uploader.onBuildItemForm = (fileItem, form) => {
        form.append('formFile', fileItem._file); // Matches backend key
        console.log('FormData updated for file:', fileItem._file.name);
    };

    this.uploader.onSuccessItem = (item, response, status, headers) => {
            console.log('Upload successful:', item, response);
      const photo = JSON.parse(response);
      const updatedTiner = { ...this.tiner() };
      updatedTiner.photos.push(photo);
      this.tinerChange.emit(updatedTiner);
    };

    // Handle upload errors
    this.uploader.onErrorItem = (item, response, status, headers) => {
        console.error('Upload failed:', response);
    };
  }
}
