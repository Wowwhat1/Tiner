import { Component, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private accountService = inject(AccountService);
  usersFromHomeComponent = input.required<any>();
  cancelRegister = output<boolean>();
  model: any = {};
  private toastr = inject(ToastrService);

  register() {
    this.accountService.register(this.model).subscribe(user => {
      console.log(user);
      this.cancel();
    }, error => {
      this.toastr.error(error.error);
    });
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
