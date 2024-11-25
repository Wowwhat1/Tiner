import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from "./nav/nav.component";
import { AccountService } from './_services/account.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'client';
  private accountService = inject(AccountService);
  http = inject(HttpClient);
  users: any;

  ngOnInit(): void { 
    this.getUser();
    this.setCurrentUser();
  }

  setCurrentUser() {
    const userString = localStorage.getItem('user');
    if (userString) {
      const user: any = JSON.parse(userString);
      this.accountService.currentUser.set(user);
    } else {
      return;
    }
  }

  getUser() {
    this.http.get('https://localhost:5001/api/user').subscribe({
      next: reponse => this.users = reponse,
      error: error => console.error('There was an error!', error),
      complete: () => console.log('Completed!')
    });
  }
}
