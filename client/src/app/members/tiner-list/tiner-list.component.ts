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
  private tinerService = inject(TinerService);
  tiners: Tiner[] = [];

  ngOnInit() : void {
    this.loadTiners();
  }

  loadTiners() {
    this.tinerService.getTiners().subscribe({
      next: tiners => this.tiners = tiners
    })
  }
}
