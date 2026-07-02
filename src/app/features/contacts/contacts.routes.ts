import { Routes } from '@angular/router';
import { ContactListComponent } from './pages/contact-list/contact-list.component';
import { ContactFormComponent } from './pages/contact-form/contact-form.component';


export const CONTACTS_ROUTES: Routes = [
  { path: '', component: ContactListComponent },
  { path: 'create', component: ContactFormComponent },
  { path: 'edit/:id', component: ContactFormComponent }
];