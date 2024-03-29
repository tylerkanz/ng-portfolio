import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { SkillsRoutingModule } from './skills-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgIconsModule } from '@ng-icons/core';
import { typSocialGithub, typSocialLinkedin } from '@ng-icons/typicons'
import { SkillsComponent } from './skills.component';
import { MobileAppsComponent } from './mobile-apps/mobile-apps.component';
import { WebAppsComponent } from './web-apps/web-apps.component';
import { CloudArchComponent } from './cloud-arch/cloud-arch.component';
import { BackEndComponent } from './back-end/back-end.component';

@NgModule({
  declarations: [
    SkillsComponent,
    MobileAppsComponent,
    WebAppsComponent,
    CloudArchComponent,
    BackEndComponent
  ],
  imports: [
    CommonModule,
    SkillsRoutingModule,
    NgbModule,
    NgIconsModule.withIcons({ typSocialGithub,typSocialLinkedin }),
  ],
  providers: [],
  bootstrap: [],
  exports: [
    MobileAppsComponent,
    WebAppsComponent,
    CloudArchComponent,
    BackEndComponent
  ]
})
export class SkillsModule { }
