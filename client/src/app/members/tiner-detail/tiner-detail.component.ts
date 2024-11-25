import { Component, inject, OnInit } from '@angular/core';
import { TinerService } from '../../_services/tiner.service';
import { ActivatedRoute } from '@angular/router';
import { Tiner } from '../../_models/tiner';
import { TabsModule } from 'ngx-bootstrap/tabs';

@Component({
  selector: 'app-tiner-detail',
  standalone: true,
  imports: [TabsModule],
  templateUrl: './tiner-detail.component.html',
  styleUrl: './tiner-detail.component.css'
})
export class TinerDetailComponent implements OnInit {
  private tinerService = inject(TinerService);
  private route = inject(ActivatedRoute);
  tiner?: Tiner;

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
      }
    })
  }
}
