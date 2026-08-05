import { Component } from '@angular/core';
import { NgbPopoverModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { SKILL_AREAS } from '../../data/skills.data';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [NgbTooltipModule, NgbPopoverModule, FaIconComponent],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss',
})
export class SkillsComponent {
  skillAreas = SKILL_AREAS;
}
