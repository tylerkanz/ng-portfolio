import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApisComponent } from './apis/apis.component';
import { MobileAppsComponent } from './mobile-apps/mobile-apps.component';
import { SkillsComponent } from './skills.component';
import { SystemArchComponent } from './system-arch/system-arch.component';
import { WebAppsComponent } from './web-apps/web-apps.component';

const routes: Routes = [
  {
    path: '',
    component: SkillsComponent,
    pathMatch: 'full',
    data: { animation: 'Right'}
  },
  {
    path: 'web-apps',
    component: WebAppsComponent,
    pathMatch: 'full',
    data: { animation: 'Right'}
  },
  {
    path: 'mobile-apps',
    component: MobileAppsComponent,
    pathMatch: 'full',
    data: { animation: 'Right'}
  },
  {
    path: 'system-architecture',
    component: SystemArchComponent,
    pathMatch: 'full',
    data: { animation: 'Right'}
  },
  {
    path: 'apis',
    component: ApisComponent,
    pathMatch: 'full',
    data: { animation: 'Right'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SkillsRoutingModule { }
