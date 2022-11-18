import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { SkillsRoutingModule } from './skills-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgIconsModule } from '@ng-icons/core';
import { typSocialGithub, typSocialLinkedin } from '@ng-icons/typicons'
import { SkillsComponent } from './skills.component';

@NgModule({
  declarations: [
    SkillsComponent,
  ],
  imports: [
    CommonModule,
    SkillsRoutingModule,
    NgbModule,
    NgIconsModule.withIcons({ typSocialGithub,typSocialLinkedin }),
  ],
  providers: [],
  bootstrap: []
})
export class SkillsModule { }
