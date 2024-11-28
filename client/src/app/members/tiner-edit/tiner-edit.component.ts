import { Component, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { AccountService } from '../../_services/account.service';
import { TinerService } from '../../_services/tiner.service';
import { Tiner } from '../../_models/tiner';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PhotoEditorComponent } from "../photo-editor/photo-editor.component";
import { TimeagoModule } from 'ngx-timeago';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-tiner-edit',
  standalone: true,
  imports: [TabsModule, FormsModule, PhotoEditorComponent, TimeagoModule, DatePipe],
  templateUrl: './tiner-edit.component.html',
  styleUrl: './tiner-edit.component.css'
})
export class TinerEditComponent implements OnInit {
  tiner?: Tiner;
  @ViewChild('editForm') editForm?: NgForm;
  @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
    if (this.editForm?.dirty) {
      $event.returnValue = true;
    }
  }
  
  private accService = inject(AccountService);
  private tinerService = inject(TinerService);
  private toastr = inject(ToastrService);

  ngOnInit(): void {
    this.loadTiner();
  }

  loadTiner() {
    const userName = this.accService.currentUser()?.username;

    if (userName) {
      this.tinerService.getTiner(userName).subscribe({
        next: (tiner: Tiner) => {
          this.tiner = tiner;
        }
      });
    } else return;
  }

  update() {
    this.tinerService.updateTiner(this.editForm?.value).subscribe({
      next: () => {
        this.toastr.success('Profile updated successfully');
        this.editForm?.reset(this.tiner);
      }
    });
  }

  onTinerChange(event: Tiner) {
    this.tiner = event;
  }
}
