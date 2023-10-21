import { render, screen, waitFor } from '@testing-library/angular';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { HeroSearchComponent } from './hero-search.component';
import { HeroService } from '../services/hero.service';
import { of } from 'rxjs';

describe('HeroSearchComponent', () => {
  it('should search for heroes on input change', async () => {
    //given
    const { searchBox, heroServiceSpy } = await setup();
    
    //when
    searchBox.value = 'test'
    searchBox.dispatchEvent(new Event('input'));
    
    //then
    await waitFor(() => {
      expect(heroServiceSpy.searchHeroes).toHaveBeenCalledWith('test');
    });
  });

  it('should display heroes from the observable', async () => {
    // given
    const { searchBox, detectChanges } = await setup();
    
    // when
    searchBox.value = 'test';
    searchBox.dispatchEvent(new Event('input'));
    
    detectChanges();
    
    // then
    const resultElements = await screen.findAllByTestId('search-result');
    expect(resultElements.length).toBe(2);
    expect(resultElements[0].textContent).toContain('Hero1');
    expect(resultElements[1].textContent).toContain('Hero2');
  });
});

async function setup() {
  // dependencies
  const heroServiceSpy = {
    searchHeroes: jest.fn()
  };

  const heroes = [{ id: 1, name: 'Hero1' }, { id: 2, name: 'Hero2' }];
  
  heroServiceSpy.searchHeroes.mockReturnValueOnce(of(heroes));

  // render
  const { detectChanges } = await render(HeroSearchComponent, {
      imports: [FormsModule, HttpClientModule, RouterTestingModule],
      providers: [{ provide: HeroService, useValue: heroServiceSpy }],
    });
  
  // elements
  const searchBox = await screen.getByTestId('search-box') as HTMLInputElement;
  
  return { searchBox, heroServiceSpy, detectChanges };
}