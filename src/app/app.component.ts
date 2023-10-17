import {AfterViewInit, Component} from '@angular/core';
import {BackendService} from "./services/backend.service";
import {MatDialog} from "@angular/material/dialog";
import {JoinDialogComponent} from "./components/dialogs/join-dialog.component";

@Component({
  selector: 'app-root', templateUrl: './app.component.html', styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  title = 'HomeManagement';

  constructor(
    public backendService: BackendService,
    private dialog: MatDialog
  ) {
    // @ts-ignore
    window.app = this
  }

  logout() {
    this.backendService.logout()
  }

  openJoinDialog() {
    this.dialog.open(JoinDialogComponent, {
      width: '500px',
    }).afterClosed().subscribe(res => {
      console.log(res)
    })
  }

  ngAfterViewInit(): void {
    if (this.backendService.isLoggedIn && !this.backendService.isConnected) {
      this.backendService.connect()
    }
  }
}

