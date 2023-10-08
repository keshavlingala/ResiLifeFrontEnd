import {Component} from '@angular/core';
import {BackendService} from "../../services/backend.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Note} from "../../misc/types";

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent {
  noteGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    content: new FormControl('', [Validators.required])
  })

  constructor(
    public backendService: BackendService,
  ) {
  }

  saveNote() {

    let note: Note = {
      title: this.noteGroup.value.title!!,
      content: this.noteGroup.value.content!!,
      author: this.backendService.userData?.email!!,
    }
    this.backendService.saveNoteToApartment(note)
  }
}
