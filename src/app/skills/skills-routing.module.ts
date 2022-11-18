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
  },
  {
    path: 'web-apps',
    component: WebAppsComponent,
    pathMatch: 'full',
  },
  {
    path: 'mobile-apps',
    component: MobileAppsComponent,
    pathMatch: 'full',
  },
  {
    path: 'system-architecture',
    component: SystemArchComponent,
    pathMatch: 'full',
  },
  {
    path: 'apis',
    component: ApisComponent,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SkillsRoutingModule { }
