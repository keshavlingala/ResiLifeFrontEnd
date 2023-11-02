import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ExpensesComponent} from "./components/expenses/expenses.component";
import {HomeComponent} from "./components/home/home.component";
import {AssigmentsComponent} from "./components/assigments/assigments.component";
import {CalendarComponent} from "./components/calendar/calendar.component";
import {NotesComponent} from "./components/notes/notes.component";
import {EventsComponent} from "./components/events/events.component";
import {LoginComponent} from "./components/login/login.component";
import {SettingsComponent} from "./components/settings/settings.component";
import {authGuard} from "./services/auth.guard";

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'expenses', component: ExpensesComponent, canActivate: [authGuard]},
  {path: 'assignments', component: AssigmentsComponent, canActivate: [authGuard]},
  {path: 'calendar', component: CalendarComponent, canActivate: [authGuard]},
  {path: 'notes', component: NotesComponent, canActivate: [authGuard]},
  {path: 'events', component: EventsComponent, canActivate: [authGuard]},
  {path: 'settings', component: SettingsComponent, canActivate: [authGuard]},
  {path: '', component: HomeComponent, pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
