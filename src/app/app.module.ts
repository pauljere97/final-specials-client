import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material';
import { LoginComponent } from './externals/login/login.component';
// import { MatchInputComponent } from './internals/match-input/match-input.component';
import { HttpClientModule } from '@angular/common/http';
import { ShowMatchComponent } from './dialogs/show-match/show-match.component';
import { NavbarComponent } from './internals/components/navbar/navbar.component';
import { SidebarComponent } from './internals/components/sidebar/sidebar.component';
import { InternalsComponent } from './internals/internals.component';

@NgModule({
  imports: [
    MaterialModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule
  ],
  
  declarations: [
    LoginComponent,
    AppComponent,
    // MatchInputComponent,
    ShowMatchComponent,
    NavbarComponent,
    SidebarComponent,
    InternalsComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
