import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TinerListComponent } from './members/tiner-list/tiner-list.component';
import { TinerDetailComponent } from './members/tiner-detail/tiner-detail.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import { authGuard } from './_guards/auth.guard';
import { TestErrorsComponent } from './errors/test-errors/test-errors.component';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { TinerEditComponent } from './members/tiner-edit/tiner-edit.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [authGuard],
        children: [
            {path: 'members', component: TinerListComponent},
            {path: 'members/:username', component: TinerDetailComponent},
            {path: 'member/edit', component: TinerEditComponent, canDeactivate: ['preventUnsavedChangesGuard']},
            {path: 'lists', component: ListsComponent},
            {path: 'messages', component: MessagesComponent}
        ]
    },
    {path: 'errors', component: TestErrorsComponent},
    {path: 'not-found', component: NotFoundComponent},
    {path: 'server-error', component: ServerErrorComponent},
    {path: '**', component: HomeComponent, pathMatch: 'full'}
];
