import {Component} from "@angular/core";
import {BackendService} from "../../services/backend.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'join-dialog',
  template: `
    <h1 mat-dialog-title>Create/Join Apartment</h1>
    <div mat-dialog-content>
      <div class="column mt-2">
        <mat-form-field appearance="outline">
          <mat-label>Create Apartment</mat-label>
          <input #create matInput placeholder="Apartment Name">
        </mat-form-field>
        <button mat-raised-button color="primary" (click)="createApt(create.value)">Create</button>
      </div>
      <!--        Or with ruler-->
      <div class="text-center mt-4 mb-4">
        Or
      </div>
      <div class="column">
        <mat-form-field appearance="outline">
          <mat-label>Join Apartment</mat-label>
          <input #code matInput placeholder="Apartment Code">
        </mat-form-field>
        <button mat-flat-button (click)="joinApartment(code.value)">Join Apartment</button>
      </div>
    </div>
  `
})
export class JoinDialogComponent {
  apartmentName: string = ''

  constructor(
    private backendService: BackendService,
    private snack: MatSnackBar,
    public dialogRef: MatDialogRef<JoinDialogComponent>
  ) {
  }

  createApt(value: string) {
    if (value === '') {
      this.snack.open('Apartment name cannot be empty', 'Close', {duration: 3000})
      return
    }
    this.backendService
      .createApartment(value)
      .subscribe(res => {
        console.log(res)
        this.snack.open('Apartment created', 'Close', {duration: 3000})
        this.dialogRef.close()
      })
  }

  joinApartment(value: string) {
    if (value === '') {
      this.snack.open('Apartment code cannot be empty', 'Close', {duration: 3000})
      return
    }
    this.backendService
      .joinApartment(value)
      .subscribe(res => {
        console.log(res)
        this.snack.open('Apartment joined', 'Close', {duration: 3000})
        this.dialogRef.close()
      })
  }
}
