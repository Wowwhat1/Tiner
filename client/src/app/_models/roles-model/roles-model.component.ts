import { Component, inject } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-roles-model',
  standalone: true,
  imports: [],
  templateUrl: './roles-model.component.html',
  styleUrl: './roles-model.component.css'
})
export class RolesModelComponent {
  bsModelRef = inject(BsModalRef);
  title = '';
  avalRoles: string[] = [];
  selectRoles: string[] = [];
  username = '';
  rolesUpdated = false;

  updateChecked(checkedVal: string) {
    if (this.selectRoles.includes(checkedVal)) {
      this.selectRoles = this.selectRoles.filter(role => role !== checkedVal);
      console.log(checkedVal);
    } else {
      this.selectRoles.push(checkedVal);
      console.log(this.selectRoles);
    }
  }

  onSelRoles() {
    this.rolesUpdated = true;
    this.bsModelRef.hide();
  }
}
