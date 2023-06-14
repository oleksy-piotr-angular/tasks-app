import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from './../material.module';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptorService } from './services/auth.interceptor';
import { AuthService } from './services/auth.service';
import { TaskService } from './services/task.service';
import { HttpService } from './services/http.service';
import { TodoTaskComponent } from './tasks/todo-task/todo-task.component';
import { DoneTaskComponent } from './tasks/done-task/done-task.component';
import { AddTaskComponent } from './tasks/add-task/add-task.component';
import { TasksComponent } from './tasks/tasks.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { AppComponent } from './app.component';
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
      maxOpened: 3,
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
