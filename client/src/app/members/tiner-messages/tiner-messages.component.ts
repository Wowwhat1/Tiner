import { Component, inject, input, OnInit, output, ViewChild } from '@angular/core';
import { Message } from '../../_models/message';
import { MessageService } from '../../_services/message.service';
import { TimeagoModule } from 'ngx-timeago';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-tiner-messages',
  standalone: true,
  imports: [TimeagoModule, FormsModule],
  templateUrl: './tiner-messages.component.html',
  styleUrl: './tiner-messages.component.css'
})
export class TinerMessagesComponent {
  @ViewChild('messForm') messForm?: NgForm;
  username = input.required<string>();
  messes = input.required<Message[]>();
  private mesService = inject(MessageService);
  messContent = '';
  outComingMess = output<Message>();

  sendMessage() {
    this.mesService.sendMessage(this.username(), this.messContent).subscribe({
      next: message => {
        this.outComingMess.emit(message);
        this.messForm?.reset();
      }
    })
  }
}
