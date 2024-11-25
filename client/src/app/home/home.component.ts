import { Component, inject, OnInit } from '@angular/core';
import { RegisterComponent } from "../register/register.component";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RegisterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  registerMode = false;
  users: any;
  http = inject(HttpClient);

  ngOnInit() {
    this.getUser();
  }

  registerToggle() {
    this.registerMode = !this.registerMode;
  }

  cancelRegisterMode(event: boolean) {
    this.registerMode = event;
  }

  getUser() {
    this.http.get('https://localhost:5001/api/user').subscribe({
      next: reponse => this.users = reponse,
      error: error => console.error('There was an error!', error),
      complete: () => console.log('Completed!')
    });
  }
}
