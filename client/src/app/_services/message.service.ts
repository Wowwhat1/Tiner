import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { PaginatedResult } from '../_models/pagination';
import { Message } from '../_models/message';
import { setPaginatedResponse, setPaginationHeader } from './_helper/paginationHelper';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { User } from '../_models/user';
import { ToastrService } from 'ngx-toastr';
import { Group } from '../_models/group';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  baseUrl = environment.apiUrl;
  hubUrl = environment.hubsUrl;
  private http = inject(HttpClient);
  paginatedResult = signal<PaginatedResult<Message[]> | null>(null);
  hubConnection?: HubConnection;
  private toastr = inject(ToastrService);
  messThread = signal<Message[]>([]);

  createHubConnection(user: User, otherUsername: string) {
    console.log('Creating Hub Connection');
    console.log('Connecting to user:', otherUsername);

    // Always clear previous messages when switching users
    if (this.hubConnection) {
      console.log('Stopping previous hub connection');
      this.hubConnection.stop().catch((error) => console.log('Error stopping hub connection:', error));
      this.messThread.set([]); // Clear the previous messages
    }

    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'message?user=' + otherUsername, {
        accessTokenFactory: () => user.token,
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('Hub Connection Started'))
      .catch((error) => console.error('Error Starting Hub Connection:', error));

    this.hubConnection.on('ReceiveMessageThread', (messages) => {
      console.log('Messages Received:', messages);
      this.messThread.set(messages); // Store messages persistently
    });

    this.hubConnection.on('NewMessage', (message) => {
      this.messThread.update((messages) => [...messages, message]);
    });

    this.hubConnection.on('UpdatedGroup', (group: Group) => {
      if (group.connections.some((x) => x.username === otherUsername)) {
        this.messThread.update(mess => {
          mess.forEach(message => {
            if (!message.readAt) {
              message.readAt = new Date(Date.now());
            }
          });
          return mess;
        });
      }
    });
  }



  stopHubConnection() {
      if (this.hubConnection?.state === HubConnectionState.Connected) {
        this.hubConnection.stop().catch(error => console.log(error));
      };
  }

  getMessages(pageNumber: number, pageSize: number, container: string) {
    let params = setPaginationHeader(pageNumber, pageSize);

    params = params.append('Container', container);

    return this.http.get<Message[]>(this.baseUrl + 'messages', { observe: 'response', params }).subscribe({
      next: response => {
        setPaginatedResponse(response, this.paginatedResult);
      }
    })
  }

  getMessThread(username: string) {
    return this.http.get<Message[]>(this.baseUrl + 'messages/thread/' + username);
  }

  async sendMessage(username: string, content: string) {
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      console.log('Sending message:', content);
      try {
        await this.hubConnection.invoke('SendMessage', { receiverUsername: username, content });
      } catch (error) {
        console.error('Error sending message:', error);
        this.toastr.error('Failed to send message.');
      }
    } else {
      console.error('SignalR hub is not connected.');
      this.toastr.error('Connection lost. Please try again.');
    }
  }

  deleteMessage(id: number) {
    return this.http.delete(this.baseUrl + 'messages/' + id);
  }
}
