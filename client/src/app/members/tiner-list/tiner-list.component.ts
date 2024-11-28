import { Component, inject, OnInit } from '@angular/core';
import { TinerService } from '../../_services/tiner.service';
import { Tiner } from '../../_models/tiner';
import { MemberCardComponent } from "../member-card/member-card.component";
import { PaginationModule } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-tiner-list',
  standalone: true,
  imports: [MemberCardComponent, PaginationModule],
  templateUrl: './tiner-list.component.html',
  styleUrl: './tiner-list.component.css'
})
export class TinerListComponent implements OnInit {
  tinerService = inject(TinerService);
  pageNumber = 1;
  pageSize = 5;

  ngOnInit() : void {
    if (!this.tinerService.paginatedResult()) {
      this.loadTiners();
    };
  }

  loadTiners() {
    this.tinerService.getTiners(this.pageNumber, this.pageSize);
  }

  pagedChanged(event: any) {
    if (this.pageNumber !== event.page) {
      this.pageNumber = event.page;
      this.loadTiners();
    }
  }
}
