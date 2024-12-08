import { AfterViewChecked, Component, inject, input, ViewChild } from '@angular/core';
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
export class TinerMessagesComponent implements AfterViewChecked {
  @ViewChild('messForm') messForm?: NgForm;
  @ViewChild('scrollMe') private myScrollContainer?: any;
  username = input.required<string>();
  mesService = inject(MessageService);
  messContent = '';
  loading = false;

  sendMessage() {
    this.loading = true;
    this.mesService.sendMessage(this.username(), this.messContent).then(() => {
      this.messForm?.reset();
      this.scrollToBottom();
    }).finally(() => this.loading = false)
  }

  ngAfterViewChecked() : void {
    this.scrollToBottom();
  }

  private scrollToBottom() {
    if (this.myScrollContainer) {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
      console.log('Scrolled to bottom');
    }
  }

  refreshMessages(username: string) {
    console.log(`Refreshing messages for: ${username}`);
    this.mesService.getMessThread(username).subscribe({
      next: (messages) => {
        console.log('Messages fetched:', messages);
        this.mesService.messThread.set(messages); // Set the fetched messages
      },
      error: (error) => console.error('Error fetching messages:', error),
    });
  }
}
