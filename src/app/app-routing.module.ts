import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './externals/login/login.component';
// import { MatchInputComponent } from './internals/match-input/match-input.component';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { InternalsComponent } from './internals/internals.component';
import { InternalsModule } from './internals/internals.module';
import { MatchInputComponent } from './internals/match-input/match-input.component';
import { MatchSummaryComponent } from './internals/match-summary/match-summary.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
    },
    {
        path: 'login',
        component: LoginComponent,
    },
    { path: 'inputs', component: MatchInputComponent },
    { path: 'inputs/:date', component: MatchInputComponent },
    {
        path: 'summary',
        component: MatchSummaryComponent,
    },
    // {
    //   path: "page/:page",
    //   component: InternalsComponent,
    // },
    {
        path: 'pagssse/:page',
        component: InternalsComponent,
        // canActivate: [AuthGuardService],
        // children: [
        //   {
        //     path: "",
        //     // loadChildren: "./internals/internals.module#InternalsModule",
        //     loadChildren: InternalsModule,
        //   },
        // ],
    },
    {
        path: 'page',
        loadChildren: () => import('./internals/internals.module').then((m) => m.InternalsModule),
    },
];

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        RouterModule.forRoot(routes, {
            useHash: true,
        }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
