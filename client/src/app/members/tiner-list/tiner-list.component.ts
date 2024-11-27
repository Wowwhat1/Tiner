import { Component, inject, OnInit } from '@angular/core';
import { TinerService } from '../../_services/tiner.service';
import { Tiner } from '../../_models/tiner';
import { MemberCardComponent } from "../member-card/member-card.component";

@Component({
  selector: 'app-tiner-list',
  standalone: true,
  imports: [MemberCardComponent],
  templateUrl: './tiner-list.component.html',
  styleUrl: './tiner-list.component.css'
})
export class TinerListComponent implements OnInit {
  tinerService = inject(TinerService);

  ngOnInit() : void {
    if (this.tinerService.tiners().length === 0) this.loadTiners();
  }

  loadTiners() {
    this.tinerService.getTiners();
  }
}
