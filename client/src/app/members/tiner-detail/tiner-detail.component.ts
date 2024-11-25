import { Component, inject, OnInit } from '@angular/core';
import { TinerService } from '../../_services/tiner.service';
import { ActivatedRoute } from '@angular/router';
import { Tiner } from '../../_models/tiner';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';

@Component({
  selector: 'app-tiner-detail',
  standalone: true,
  imports: [TabsModule, GalleryModule],
  templateUrl: './tiner-detail.component.html',
  styleUrl: './tiner-detail.component.css'
})
export class TinerDetailComponent implements OnInit {
  private tinerService = inject(TinerService);
  private route = inject(ActivatedRoute);
  tiner?: Tiner;
  images: GalleryItem[] = [];

  ngOnInit() : void {
    this.loadTiner();
  }

  loadTiner() {
    const userName = this.route.snapshot.paramMap.get('username');

    if (!userName) {
      return;
    }

    this.tinerService.getTiner(userName).subscribe({
      next: (tiner: Tiner) => {
        this.tiner = tiner;
        tiner.photos.map(photo => {
          this.images.push(new ImageItem({ src: photo.url, thumb: photo.url }));
        })
      }
    })
  }
}
