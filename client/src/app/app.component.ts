import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from "./nav/nav.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'client';
  http = inject(HttpClient);
  users: any;

  ngOnInit(): void { 
    this.http.get('https://localhost:5001/api/user').subscribe({
      next: reponse => this.users = reponse,
      error: error => console.error('There was an error!', error),
      complete: () => console.log('Completed!')
    });
  }
}
