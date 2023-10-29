
import { RouterModule, Routes } from "@angular/router";
import { MatchInputComponent } from "./match-input/match-input.component";
import { NgModule } from "@angular/core";
import { InternalsComponent } from "./internals.component";

const routes:Routes = [
    {
        path: 'page',
        component: InternalsComponent,
        children: [
            { path: '', redirectTo: 'inputs', pathMatch: 'full' },
            { path: '', component: MatchInputComponent },
            { path: 'inputs', component: MatchInputComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class InternalsRoutingModule { }