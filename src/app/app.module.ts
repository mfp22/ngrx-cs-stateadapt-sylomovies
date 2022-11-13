import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { MoviesListComponent } from './components/movies-list/movies-list.component';
import { CardComponent } from './components/card/card.component';
import { SingleMovieComponent } from './components/single-movie/single-movie.component';
import { InfoMovieComponent } from './components/info-movie/info-movie.component';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SearchComponent } from './components/search/search.component';
import { ResultsComponent } from './components/results/results.component';
import { FooterComponent } from './components/footer/footer.component';
import { NavigateComponent } from './components/navigate.component';
import { SwalComponent } from './components/swal.component';
import { defaultStoreProvider } from '@state-adapt/angular';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    CarouselComponent,
    MoviesListComponent,
    CardComponent,
    SingleMovieComponent,
    InfoMovieComponent,
    HomeComponent,
    SearchComponent,
    ResultsComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    NgbModule,
    FormsModule,
    NavigateComponent,
    SwalComponent,
  ],
  providers: [defaultStoreProvider],
  bootstrap: [AppComponent],
})
export class AppModule {}
