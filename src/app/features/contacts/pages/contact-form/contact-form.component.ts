import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactService } from 'src/app/core/services/contact.service';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';
import { InputComponent } from 'src/app/shared/components/input/input.component';
import { SelectComponent } from 'src/app/shared/components/select/select.component';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-contact-form',
  imports: [FormsModule, ReactiveFormsModule, CommonModule, ButtonComponent, InputComponent, SelectComponent],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.scss'
})
export class ContactFormComponent {
  fb = inject(FormBuilder);
  api = inject(ContactService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  loader = inject(LoaderService);
  toast = inject(ToastService);
  editId: string | null = null;
  form = this.fb.group({
    createdAt: [''],

    first_name: ['', [Validators.required, Validators.minLength(2)]],

    last_name: ['', [Validators.required, Validators.minLength(2)]],

    emailId: ['', [Validators.required, Validators.email]],

    age: [null, [Validators.min(1), Validators.max(120)]],

    gender: ['', Validators.required],

    mobilenumber: ['', [
      Validators.required,
      Validators.pattern(/^[6-9][0-9]{9}$/)
    ]],

    pan_no: ['', [
      Validators.required,
      Validators.pattern(/[A-Z]{5}[0-9]{4}[A-Z]{1}/)
    ]],

    adhaar_no: ['', [
      Validators.required,
      Validators.pattern(/^[0-9]{12}$/)
    ]],

    status: [true]
  });
  genderOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' }
  ];

  ngOnInit() {
    this.editId = this.route.snapshot.paramMap.get('id');

    if (this.editId) {
      this.api.getById(this.editId).subscribe((data: any) => {
        this.form.patchValue(data);
      });
    }
  }

  submit() {
    if (this.form.invalid) {
      this.toast.error('Please fill all required fields correctly');
      return;
    }

    this.loader.show();

    const payload = this.form.value;

    if (this.editId) {

      this.api.update(this.editId, payload).subscribe({
        next: () => {
          this.loader.hide();
          this.toast.success('Contact updated successfully');
          this.router.navigate(['/contacts']);
        },

        error: () => {
          this.loader.hide();
          this.toast.error('Failed to update contact');
        }
      });

    } else {

      console.log('create mode...');

      this.api.create(payload).subscribe({
        next: () => {
          this.loader.hide();
          this.toast.success('Contact created successfully');
          this.router.navigate(['/contacts']);
        },

        error: () => {
          this.loader.hide();
          this.toast.error('Failed to create contact');
        }
      });

    }
  }

  get f() {
    return this.form.controls;
  }
}
