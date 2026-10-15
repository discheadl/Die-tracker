import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { SearchDie } from './search-die';

describe('SearchDie', () => {
  let component: SearchDie;
  let fixture: ComponentFixture<SearchDie>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchDie],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchDie);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
