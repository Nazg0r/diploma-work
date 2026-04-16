import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { take } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SpriteService {
  private http = inject(HttpClient);
  private loaded = false;

  public load(): void {
    if (this.loaded) return;

    this.http
      .get('assets/sprite.svg', { responseType: 'text' })
      .pipe(take(1))
      .subscribe((svg) => {
        const div = document.createElement('div');
        div.style.display = 'none';
        div.style.position = 'absolute';
        div.setAttribute('aria-hidden', 'true');
        div.innerHTML = svg;
        document.body.insertBefore(div, document.body.firstChild);
        this.loaded = true;
      });
  }
}
