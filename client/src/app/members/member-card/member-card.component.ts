import { Component, computed, inject, Input, input, ViewEncapsulation } from '@angular/core';
import { Tiner } from '../../_models/tiner';
import { RouterLink } from '@angular/router';
import { MatchService } from '../../_services/match.service';

@Component({
  selector: 'app-member-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './member-card.component.html',
  styleUrl: './member-card.component.css'
})
export class MemberCardComponent {
  @Input() tiner!: Tiner;
  private matchService = inject(MatchService);
  hasMatched = computed(() => this.matchService.matchIds().includes(this.tiner.id));

  toggleMatch() {
    this.matchService.toggleMatch(this.tiner.id).subscribe({
      next: () => {
        if (this.hasMatched()) {
          this.matchService.matchIds.update(ids => ids.filter(id => id !== this.tiner.id));
        } else {
          this.matchService.matchIds.update(ids => [...ids, this.tiner.id]);
        }
      }
    });
  }
}
