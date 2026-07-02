import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-button',
  standalone: true,
  templateUrl: './button.component.html',
  imports: [CommonModule, RouterModule]
})
export class ButtonComponent {

  @Input() type: 'button' | 'submit' = 'button';
  @Input() disabled = false;
  @Input() routerLink: any;
  @Input() variant: 'primary' | 'secondary' = 'primary';

  constructor(private router: Router) { }

  handleClick() {
    if (this.routerLink) {
      this.router.navigateByUrl(this.routerLink);
    }
  }
}