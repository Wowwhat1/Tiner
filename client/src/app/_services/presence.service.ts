import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { User } from '../_models/user';
import { take } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { TabDirective } from 'ngx-bootstrap/tabs';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {
  hubUrl = environment.hubsUrl;
  private hubConnection?: HubConnection;
  private toastr = inject(ToastrService);
  onlineUsers = signal<string[]>([]);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  createHubConnection(user: User) {
    this.hubConnection = new HubConnectionBuilder().withUrl(this.hubUrl + 'presence', {
      accessTokenFactory: () => user.token
    }).withAutomaticReconnect().build();

    this.hubConnection
      .start()
      .then(() => console.log('Hub Connection Started'))
      .catch((error) => {
        console.error('Error Starting Hub Connection:', error);
        this.toastr.error('Failed to connect. Please refresh the page.');
      });

    this.hubConnection.on('UserIsOnline', username => {
      this.onlineUsers.update(users => [...users, username]);
    });

    this.hubConnection.on('UserIsOffline', username => {
      this.onlineUsers.update(users => users.filter(x => x !== username));
    });

    this.hubConnection.on('GetOnlineUsers', usernames => {
      this.onlineUsers.set(usernames);
    });

    this.hubConnection.on('NewMessageReceived', ({username, knownAs}) => {
      this.toastr.info(knownAs + ' has sent you a new message!').onTap.pipe(take(1)).subscribe(() => {
        this.router.navigateByUrl('/members/' + username + '?tab=Messages').then(() => {
          const tab = this.route.snapshot.queryParamMap.get('tab');
          if (tab === 'Messages') {
          }
        })
      });
    });
  }

  stopHubConnection() {
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      this.hubConnection.stop().catch(error => console.log(error));
    }
  }
}
