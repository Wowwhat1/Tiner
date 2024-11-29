import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { TinerService } from '../../_services/tiner.service';
import { ActivatedRoute } from '@angular/router';
import { Tiner } from '../../_models/tiner';
import { TabDirective, TabsetComponent, TabsModule } from 'ngx-bootstrap/tabs';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { TimeagoModule } from 'ngx-timeago';
import { DatePipe } from '@angular/common';
import { TinerMessagesComponent } from "../tiner-messages/tiner-messages.component";
import { Message } from '../../_models/message';
import { MessageService } from '../../_services/message.service';

@Component({
  selector: 'app-tiner-detail',
  standalone: true,
  imports: [TabsModule, GalleryModule, TimeagoModule, DatePipe, TinerMessagesComponent],
  templateUrl: './tiner-detail.component.html',
  styleUrl: './tiner-detail.component.css'
})
export class TinerDetailComponent implements OnInit {
  private tinerService = inject(TinerService);
  private mesService = inject(MessageService);
  @ViewChild('tinerTabs', {static: true}) tinerTab?: TabsetComponent;
  private route = inject(ActivatedRoute);
  tiner: Tiner = {} as Tiner;
  images: GalleryItem[] = [];
  activeTab?: TabDirective;
  messes: Message[] = [];

  ngOnInit() : void {
    this.route.data.subscribe({
      next: data => {
        this.tiner = data['tiner'];
        this.tiner && this.tiner.photos.map(photo => {
          this.images.push(new ImageItem({ src: photo.url, thumb: photo.url }));
        })
      }
    });
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

  onActivatedTab(data: TabDirective) {
    this.activeTab = data;
    if (this.activeTab.heading === 'Messages' && this.messes.length === 0 && this.tiner) {
      this.mesService.getMessThread(this.tiner.userName).subscribe({
        next: messages => {
          this.messes = messages;
        }
      })
    }
  }

  onUpdateMess(event: Message) {
    this.messes.push(event);
  }
  
  selectTab(heading: string) {
    if (this.tinerTab) {
      const tabMessage = this.tinerTab.tabs.find(t => t.heading === heading);

      if (tabMessage) {
        tabMessage.active = true;
      }
    }
  }
}
