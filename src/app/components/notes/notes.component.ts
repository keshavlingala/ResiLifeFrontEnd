import {Component} from '@angular/core';
import {BackendService} from "../../services/backend.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Note} from "../../misc/types";
import {v4 as uuidv4} from 'uuid';
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmDialogComponent} from "../dialogs/confirm.dialog.component";

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent {
  noteGroup = new FormGroup({
    id: new FormControl(''),
    title: new FormControl('', [Validators.required]),
    content: new FormControl('', [Validators.required])
  })

  constructor(
    public backendService: BackendService,
    public snack: MatSnackBar,
    public dialog: MatDialog
  ) {
  }

  saveNote() {
    let note: Note = {
      id: this.noteGroup.value.id || uuidv4(),
      title: this.noteGroup.value.title!!,
      content: this.noteGroup.value.content!!,
      author: this.backendService.userData?.email!!,
    }
    console.log("Saving note", note)
    this.backendService.saveNoteToApartment(note)
    this.noteGroup.reset()
    this.snack.open('Note saved', 'Close', {duration: 2000})
  }

  deleteNote(note: Note) {
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete note',
        message: 'Are you sure you want to delete this note?'
      }
    }).afterClosed().subscribe((res) => {
      if (res) {
        this.backendService.deleteNoteFromApartment(note)
      }
    })
  }

  editNote(note: Note) {
    this.noteGroup.setValue({
      id: note.id,
      title: note.title,
      content: note.content
    })
  }
}
