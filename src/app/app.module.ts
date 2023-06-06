import { HttpService } from './services/http.service';
import { MaterialModule } from './../material.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SignInComponent } from './sign-in/sign-in.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { SignUpComponent } from './sign-up/sign-up.component';
import { TasksComponent } from './tasks/tasks.component';
import { AuthService } from './services/auth.service';
import { TaskService } from './services/task.service';
import { AuthInterceptorService } from './services/auth.interceptor';
import { TodoTaskComponent } from './tasks/todo-task/todo-task.component';
import { DoneTaskComponent } from './tasks/done-task/done-task.component';
import { AddTaskComponent } from './tasks/add-task/add-task.component';
import { TransformTaskPipe } from './shared/transform-task.pipe';
import { SortNamePipe } from './shared/sort-name.pipe';
import { DateDirective } from './shared/date.directive';
import { CheckedDirective } from './shared/checked.directive';

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    SignUpComponent,
    TasksComponent,
    TodoTaskComponent,
    DoneTaskComponent,
    AddTaskComponent,
    TransformTaskPipe,
    SortNamePipe,
    DateDirective,
    CheckedDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule,
    ToastrModule.forRoot({
      maxOpened: 1,
      preventDuplicates: true,
      autoDismiss: true,
    }),
    FormsModule,
  ],
  providers: [
    HttpService,
    AuthService,
    TaskService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
