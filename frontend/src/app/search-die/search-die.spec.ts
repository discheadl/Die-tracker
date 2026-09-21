import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchDie } from './search-die';

describe('SearchDie', () => {
  let component: SearchDie;
  let fixture: ComponentFixture<SearchDie>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchDie],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchDie);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
