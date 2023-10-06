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

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'expenses', component: ExpensesComponent},
  {path: 'assignments', component: AssigmentsComponent},
  {path: 'calendar', component: CalendarComponent},
  {path: 'notes', component: NotesComponent},
  {path: 'events', component: EventsComponent},
  {path: 'settings', component: SettingsComponent},
  {path: '', component: HomeComponent, pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
