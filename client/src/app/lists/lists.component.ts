import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatchService } from '../_services/match.service';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { FormsModule } from '@angular/forms';
import { MemberCardComponent } from "../members/member-card/member-card.component";
import { PaginationModule } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-lists',
  standalone: true,
  imports: [ButtonsModule, FormsModule, MemberCardComponent, PaginationModule],
  templateUrl: './lists.component.html',
  styleUrl: './lists.component.css'
})
export class ListsComponent implements OnInit, OnDestroy {
  matchService = inject(MatchService);
  predicate = 'match';  
  pageNumber = 1;
  pageSize = 5;

  ngOnInit(): void {
    this.loadMatches();
  }

  getTitle() {
    switch (this.predicate) {
      case 'match':
        return 'Tiners you matched with';
      case 'matchedBy':
        return 'Tiners who matched you';
      default:
        return 'Mutual';
    }
  }

  loadMatches() {
    this.matchService.getMatches(this.predicate, this.pageNumber, this.pageSize);
  }

  pagedChanged(event: any) {  
    if (this.pageNumber !== event.page) {
      this.pageNumber = event.page;
      this.loadMatches();
    }
  }

  ngOnDestroy(): void {
    this.matchService.paginatedResult.set(null);
  }
}
