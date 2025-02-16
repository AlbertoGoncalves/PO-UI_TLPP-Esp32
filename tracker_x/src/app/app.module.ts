import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PoModule } from '@po-ui/ng-components';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { PoTemplatesModule } from '@po-ui/ng-templates';
import { SharedModule } from './shared/shared.module';
import { HomeComponent } from './features/home/home.component';
import { ProtheusLibCoreModule } from '@totvs/protheus-lib-core';
import { ToolbarModule } from './core/toolbar/toolbar.module';
import { IMqttServiceOptions, MqttModule } from 'ngx-mqtt';

export const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
  hostname: 'f193048eab194d13bf1411202bf76067.s1.eu.hivemq.cloud', // ou outro broker MQTT público ou privado
  port: 8884,
  path: '/mqtt',
  protocol:'wss',
  username: 'hivemq.webclient.1730667276011', // Substitua por suas credenciais
  password: '6kO!#tENF5aJg4*3n%Lx'
};

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,

    // PoModule, esta sendo chamado dentro do sharedMolude
    SharedModule,

    ToolbarModule,
    HttpClientModule,
    RouterModule.forRoot([]),
    PoTemplatesModule,
    ProtheusLibCoreModule,
    MqttModule.forRoot(MQTT_SERVICE_OPTIONS)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
