import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
    data: { animation: 'Left'}
  },
  {
    path: 'skills',
    loadChildren: () => import('./skills/skills.module').then(m => m.SkillsModule),
    data: { animation: 'Right'}
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
