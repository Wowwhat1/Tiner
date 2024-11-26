import { Component, inject, OnInit } from '@angular/core';
import { AccountService } from '../../_services/account.service';
import { TinerService } from '../../_services/tiner.service';
import { Tiner } from '../../_models/tiner';

@Component({
  selector: 'app-tiner-edit',
  standalone: true,
  imports: [],
  templateUrl: './tiner-edit.component.html',
  styleUrl: './tiner-edit.component.css'
})
export class TinerEditComponent implements OnInit {
  tiner?: Tiner;
  private accService = inject(AccountService);
  private tinerService = inject(TinerService);

  ngOnInit(): void {
    this.loadTiner();
  }

  loadTiner() {
    const userName = this.accService.currentUser()?.username;

    if (userName) {
      this.tinerService.getTiner(userName).subscribe({
        next: (tiner: Tiner) => {
          this.tiner = tiner;
        }
      });
    } else return;
  }
}
