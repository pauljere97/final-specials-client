
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatRippleModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatSelectModule } from "@angular/material/select";
import { MatChipsModule } from "@angular/material/chips";
import { MatchInputComponent } from "./match-input/match-input.component";
import { InternalsRoutingModule } from "./internals-routing.module";
import { MaterialModule } from "../material";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "../app-routing.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule } from "@angular/common/http";
import { MatchSummaryComponent } from './match-summary/match-summary.component';
import { OddsInputComponent } from './odds-input/odds-input.component';
import { DashboardComponent } from './dashboard/dashboard.component';
// import { LoadingScreenComponent } from './components/loading-screen/loading-screen.component';
// import { AdminAdministratorLocationsComponent } from './role-components/admin-administrator-locations/admin-administrator-locations.component';
@NgModule({
    imports: [
        CommonModule,
        // DialogsModule,
        // StudentRoutingModule,
        // MaterialModule,
        // ComponentsModule,
        FormsModule,
        InternalsRoutingModule,
        MaterialModule,
        // BrowserModule,
        // AppRoutingModule,
        // BrowserAnimationsModule,
        // HttpClientModule,
    ],
    declarations: [
        MatchInputComponent,
        MatchSummaryComponent,
        OddsInputComponent,
        DashboardComponent,
        // LoadingScreenComponent
        // StudentMessagesComponent,
        // StudentSettingsComponent,
        // StudentComponent,
        // StudentDashboardComponent,
        // StudentReadMessageComponent,
        // StudentJobsComponent
    ],
    providers: [
    ]
})
export class InternalsModule { }
