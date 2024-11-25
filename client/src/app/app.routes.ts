import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TinerListComponent } from './members/tiner-list/tiner-list.component';
import { TinerDetailComponent } from './members/tiner-detail/tiner-detail.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'members', component: TinerListComponent},
    {path: 'members/:id', component: TinerDetailComponent},
    {path: 'lists', component: ListsComponent},
    {path: 'messages', component: MessagesComponent},
    {path: '**', component: HomeComponent, pathMatch: 'full'}
];
