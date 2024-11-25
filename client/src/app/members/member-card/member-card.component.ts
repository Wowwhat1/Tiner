import { Component, input, ViewEncapsulation } from '@angular/core';
import { Tiner } from '../../_models/tiner';

@Component({
  selector: 'app-member-card',
  standalone: true,
  imports: [],
  templateUrl: './member-card.component.html',
  styleUrl: './member-card.component.css'
})
export class MemberCardComponent {
  tiner = input.required<Tiner>();
}
