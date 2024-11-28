import { Component, inject, OnInit } from '@angular/core';
import { TinerService } from '../../_services/tiner.service';
import { Tiner } from '../../_models/tiner';
import { MemberCardComponent } from "../member-card/member-card.component";
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { AccountService } from '../../_services/account.service';
import { UserParams } from '../../_models/userParams';
import { FormsModule } from '@angular/forms';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

@Component({
  selector: 'app-tiner-list',
  standalone: true,
  imports: [MemberCardComponent, PaginationModule, FormsModule, ButtonsModule],
  templateUrl: './tiner-list.component.html',
  styleUrl: './tiner-list.component.css'
})
export class TinerListComponent implements OnInit {
  tinerService = inject(TinerService);
  genderList = [{ value: 'male', display: 'Males' }, { value: 'female', display: 'Females' }];

  ngOnInit() : void {
    if (!this.tinerService.paginatedResult()) {
      this.loadTiners();
    };
  }

  loadTiners() {
    this.tinerService.getTiners();
    console.log('User Params:', this.tinerService.getTiners());
  }

  resetFilters() {
    this.tinerService.resetUserParams();
    this.loadTiners();
  }

  pagedChanged(event: any) {
    if (this.tinerService.userParams().pageNumber !== event.page) {
      this.tinerService.userParams().pageNumber = event.page; // Update the page number
      this.loadTiners(); // Reload data for the new page
    }
  }
}
