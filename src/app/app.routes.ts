import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'ui', pathMatch: 'full' },

  {
    path: 'ui',
    loadChildren: () =>
      import('src/app/features/landing/ui-landing/ui.routes')
        .then(m => m.UI_ROUTES)
  },

  {
    path: 'contacts',
    loadChildren: () =>
      import('src/app/features/contacts/contacts.routes')
        .then(m => m.CONTACTS_ROUTES)
  },

  { path: '**', redirectTo: 'ui' }
];