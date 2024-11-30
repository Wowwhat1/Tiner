import { Component, inject, OnInit } from '@angular/core';
import { AdminService } from '../../_services/admin.service';
import { User } from '../../_models/user';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { RolesModelComponent } from '../../_models/roles-model/roles-model.component';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit {
  private adminService = inject(AdminService);
  users: User[] = [];
  private modelService = inject(BsModalService);
  bsModelRef: BsModalRef<RolesModelComponent> = new BsModalRef<RolesModelComponent>();

  ngOnInit(): void {
    this.getUsersWithRoles();
  }
  
  openRolesModel(user: User) {
    const initialState: ModalOptions = {
      class: 'modal-lg',
      initialState: {
        title: 'User roles',
        username: user.username,
        selectedRoles: [...user.roles],
        avalRoles: ['Admin', 'Moderator', 'Member'],
        user: this.users,
        roleUpdated: false
      }
    };

    this.bsModelRef = this.modelService.show(RolesModelComponent, initialState);
    this.bsModelRef.onHide?.subscribe({
      next: () => {
        if (this.bsModelRef.content && this.bsModelRef.content.rolesUpdated) {
          const selectedRoles = this.bsModelRef.content.selectRoles;

          this.adminService.updateUserRoles(user.username, selectedRoles).subscribe({
            next: roles => user.roles = roles
          });
        }
      }
    })
  }

  getUsersWithRoles() {
    this.adminService.getUserWithRoles().subscribe(users => {
      this.users = users;
    });
  }
}
