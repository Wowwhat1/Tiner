import { Component, inject, input, OnInit, output } from '@angular/core';
import { Tiner } from '../../_models/tiner';
import { DecimalPipe, NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { FileUploader, FileUploadModule } from 'ng2-file-upload';
import { AccountService } from '../../_services/account.service';
import { environment } from '../../../environments/environment';
import { TinerService } from '../../_services/tiner.service';
import { Photo } from '../../_models/photo';

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
  private tinerService = inject(TinerService);
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

  deletePhoto(photo: Photo) {  
    this.tinerService.deletePhoto(photo).subscribe({
      next: () => {
        const updatedTiner = { ...this.tiner() };
        updatedTiner.photos = updatedTiner.photos.filter(p => p.id !== photo.id);
        this.tinerChange.emit(updatedTiner);
      }
    });
  }

  setMainPhoto(photo: any) {
    this.tinerService.setMainPhoto(photo.id).subscribe({
      next: () => {
        const user = this.accService.currentUser();
        if (user) {
          user.photoUrl = photo.url;
          this.accService.setCurrentUser(user);
        }

        const updatedTiner = { ...this.tiner() };
        updatedTiner.photoUrl = photo.url;
        updatedTiner.photos.forEach((p) => {
          if (p.isMain) p.isMain = false;
          if (p.id === photo.id) p.isMain = true;
        });

        this.tinerChange.emit(updatedTiner);
      }
    });
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
      file.withCredentials = false;
    };

    // Append the correct key for FormData
    this.uploader.onBuildItemForm = (fileItem, form) => {
        form.append('formFile', fileItem._file); // Matches backend key
    };

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      const photo = JSON.parse(response);
      const updatedTiner = { ...this.tiner() };
      updatedTiner.photos.push(photo);
      this.tinerChange.emit(updatedTiner);

      if (photo.isMain) {
        const user = this.accService.currentUser();
        if (user) {
          user.photoUrl = photo.url;
          this.accService.setCurrentUser(user);
        }

        updatedTiner.photoUrl = photo.url;
        updatedTiner.photos.forEach((p) => {
          if (p.isMain) p.isMain = false;
          if (p.id === photo.id) p.isMain = true;
        });

        this.tinerChange.emit(updatedTiner);
      }
    };

    // Handle upload errors
    this.uploader.onErrorItem = (item, response, status, headers) => {
        console.error('Upload failed:', response);
    };
  }
}
