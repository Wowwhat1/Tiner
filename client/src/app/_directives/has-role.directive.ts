import { Directive, inject, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { AccountService } from '../_services/account.service';

@Directive({
  selector: '[appHasRole]',
  standalone: true
})
export class HasRoleDirective implements OnInit {
  @Input() appHasRole: string[] = [];

  private accService = inject(AccountService);
  private viewContainer = inject(ViewContainerRef)
  private templateRef = inject(TemplateRef)

  ngOnInit(): void {
      if (this.accService.roles()?.some(r => this.appHasRole.includes(r))) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainer.clear();
      }
  }
}
