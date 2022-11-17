import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from './home/home.component';
import { NgIconsModule } from '@ng-icons/core';
import { typSocialGithub, typSocialLinkedin } from '@ng-icons/typicons'

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    NgIconsModule.withIcons({ typSocialGithub,typSocialLinkedin }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
