import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TinerService } from '../../_services/tiner.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Tiner } from '../../_models/tiner';
import { TabDirective, TabsetComponent, TabsModule } from 'ngx-bootstrap/tabs';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { TimeagoModule } from 'ngx-timeago';
import { DatePipe } from '@angular/common';
import { TinerMessagesComponent } from "../tiner-messages/tiner-messages.component";
import { Message } from '../../_models/message';
import { MessageService } from '../../_services/message.service';
import { PresenceService } from '../../_services/presence.service';
import { AccountService } from '../../_services/account.service';
import { HubConnectionState } from '@microsoft/signalr';

@Component({
  selector: 'app-tiner-detail',
  standalone: true,
  imports: [TabsModule, GalleryModule, TimeagoModule, DatePipe, TinerMessagesComponent],
  templateUrl: './tiner-detail.component.html',
  styleUrl: './tiner-detail.component.css'
})
export class TinerDetailComponent implements OnInit, OnDestroy {
  preService = inject(PresenceService);
  private mesService = inject(MessageService);
  @ViewChild('tinerTabs', {static: true}) tinerTab?: TabsetComponent;
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  tiner: Tiner = {} as Tiner;
  images: GalleryItem[] = [];
  activeTab?: TabDirective;
  private accService = inject(AccountService);

  ngOnInit() : void {
    this.route.data.subscribe({
      next: data => {
        this.tiner = data['tiner'];
        this.tiner && this.tiner.photos.map(photo => {
          this.images.push(new ImageItem({ src: photo.url, thumb: photo.url }));
        })
      }
    });

    this.route.paramMap.subscribe({
      next: () => this.onRouteParamsChange()
    })

    this.route.queryParams.subscribe({
      next: queryParams => {
        console.log('Query Parameters:', queryParams); // Log all query parameters
        if (queryParams['tab']) {
          console.log('Tab Parameter:', queryParams['tab']); // Log the tab parameter
          this.selectTab(queryParams['tab']); // Call the method
        } else {
          console.log('No Tab Parameter'); // Log that there is no tab parameter
        }
      }
    });
  }

  onRouteParamsChange() {
    const user = this.accService.currentUser();
    if (!user) {
      console.log('No current user found');
      return;
    }
    if (this.mesService.hubConnection?.state === HubConnectionState.Connected && this.activeTab?.heading !== 'Messages') {
      this.mesService.hubConnection.stop().then(() => {
        this.mesService.createHubConnection(user, this.tiner.userName);
      });
    }
  }

  onActivatedTab(data: TabDirective) {
    console.log('Activated Tab:', data.heading); // Log the active tab

    this.activeTab = data;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: this.activeTab.heading },
      queryParamsHandling: 'merge'
    });

    if (this.activeTab.heading === 'Messages' && this.tiner) {
      console.log('Messages Tab Activated:', this.tiner.userName); // Log the username for debugging

      const user = this.accService.currentUser();
      if (!user) {
        console.log('No current user found');
        return;
      }

      console.log('Current User:', user); // Log the current user

      // Create the hub connection
      this.mesService.createHubConnection(user, this.tiner.userName);

      // Refresh the messages using the MessageService
      this.mesService.getMessThread(this.tiner.userName).subscribe({
        next: (messages) => {
          console.log('Messages fetched:', messages);
          this.mesService.messThread.set(messages); // Update the thread
        },
        error: (error) => console.error('Error fetching messages:', error),
      });
    } else {
      console.log('Stopping Hub Connection');
      this.mesService.stopHubConnection();
    }
  }

  
  selectTab(heading: string) {
    if (this.tinerTab) {
      const tabMessage = this.tinerTab.tabs.find(t => t.heading === heading);
      console.log('Tab Message:', tabMessage); // Log the tab message 

      if (tabMessage) {
        tabMessage.active = true;
        console.log('Tab Message Active:', tabMessage.active); // Log the active tab message
      }
    }
  }

  ngOnDestroy(): void {
    this.mesService.stopHubConnection();
  }
}
