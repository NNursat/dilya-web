import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Чтобы работал *ngIf
import { RouterOutlet, RouterLink, Router } from '@angular/router'; // Для навигации
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink], // Подключаем модули здесь
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App { // Убедись, что класс называется именно App, как в твоей ошибке
  constructor(
    public apiService: ApiService, 
    private router: Router
  ) {}

  // Тот самый метод logout, которого не хватало
  logout(): void {
    this.apiService.logout();
    this.router.navigate(['/login']);
  }
}