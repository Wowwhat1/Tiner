import { Component, Input, input, ViewEncapsulation } from '@angular/core';
import { Tiner } from '../../_models/tiner';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-member-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './member-card.component.html',
  styleUrl: './member-card.component.css'
})
export class MemberCardComponent {
  @Input() tiner!: Tiner;
}
