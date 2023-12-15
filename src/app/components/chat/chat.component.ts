import {Component, ElementRef, ViewChild} from '@angular/core';
import {BackendService} from "../../services/backend.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  formGroup = new FormGroup({
    chat: new FormControl('', [Validators.required])
  })
  @ViewChild('span', {static: true}) private span!: ElementRef;

  constructor(
    public backendService: BackendService,
  ) {
    this.backendService.onChanges.subscribe(() => {
      this.span?.nativeElement.scrollIntoView({behavior: 'smooth'})
      console.log('Change in chat')
    })
  }

  sendMessage() {
    if (!this.formGroup.valid) {
      return
    }
    if (!this.formGroup.value.chat) return;
    this.backendService.sendMessageToApartment(this.formGroup.value.chat)
    this.formGroup.reset()
    this.formGroup.markAsUntouched()
  }

  getPic(sender: { firstName: string; lastName: string; email: string }) {
    return `https://picsum.photos/seed/${sender.email}/100/100`
  }

}
