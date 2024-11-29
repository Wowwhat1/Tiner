import { Component, inject, OnInit } from '@angular/core';
import { MessageService } from '../_services/message.service';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { FormsModule } from '@angular/forms';
import { TimeagoModule } from 'ngx-timeago';
import { Message } from '../_models/message';
import { RouterLink } from '@angular/router';
import { PaginationModule } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [ButtonsModule, FormsModule, TimeagoModule, RouterLink, PaginationModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent implements OnInit {
  messService = inject(MessageService);
  container = 'Inbox';
  pageNumber = 1;
  pageSize = 5;
  isOutbox = this.container === 'Outbox';

  ngOnInit(): void {
    this.loadMessage();
  }

  loadMessage() {
    this.messService.getMessages(this.pageNumber, this.pageSize, this.container);
  }

  deleteMessage(id: number) {
    this.messService.deleteMessage(id).subscribe({
      next: () => {
        this.messService.paginatedResult.update(pre => {
          if (pre && pre.items) {
            pre.items.splice(pre.items.findIndex(m => m.id === id), 1);
            return pre;
          }
          return pre;
        });
      }
    })
  }

  pageChanged(event: any) {
    if (this.pageNumber !== event.page) {
      this.pageNumber = event.page;
      this.loadMessage();
    }
  }

  getRoute(message: Message) {
    if (this.container === 'Outbox') {
      return `/members/${message.receiverUsername}`;
    } else {
      return `/members/${message.senderUsername}`;
    }
  }
}
