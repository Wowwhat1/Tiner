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
  private accService = inject(AccountService);
  userParams = new UserParams(this.accService.currentUser());
  genderList = [{ value: 'male', display: 'Males' }, { value: 'female', display: 'Females' }];

  ngOnInit() : void {
    if (!this.tinerService.paginatedResult()) {
      this.loadTiners();
    };
  }

  loadTiners() {
    this.tinerService.getTiners(this.userParams);
    console.log('User Params:', this.tinerService.getTiners(this.userParams));
  }

  resetFilters() {
    this.userParams = new UserParams(this.accService.currentUser());
    this.loadTiners();
  }

  pagedChanged(event: any) {
    if (this.userParams.pageNumber !== event.page) {
      this.userParams.pageNumber = event.page; // Update the page number
      this.loadTiners(); // Reload data for the new page
    }
  }
}
