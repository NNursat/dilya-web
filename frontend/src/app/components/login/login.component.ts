// frontend/src/app/components/login/login.component.ts
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';   
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule], // Добавь их сюда
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;
  returnUrl: string = '/';

  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    
    // Redirect to home if already logged in
    if (this.apiService.isAuthenticated()) {
      this.router.navigate([this.returnUrl]);
    }
  }

  onSubmit(): void {
    if (!this.username || !this.password) {
      this.errorMessage = 'Please enter both username and password';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

  this.apiService.login({ username: this.username, password: this.password })
    .subscribe({
      next: (response) => {
        this.apiService.saveTokens(response);
        this.router.navigate(['/home']); // Перекидываем пользователя на главную
      },
          error: (error) => {
            console.error('Login error:', error);
            
            if (error.status === 401) {
              this.errorMessage = 'Invalid username or password';
            } else if (error.status === 0) {
              this.errorMessage = 'Cannot connect to server. Please check if backend is running.';
            } else {
              this.errorMessage = 'An error occurred. Please try again.';
            }
            
            this.isLoading = false;
          },
          complete: () => {
            this.isLoading = false;
          }
        });
    }

onRegister(): void {
  if (!this.username || !this.password) {
    this.errorMessage = 'Please enter username and password to register';
    return;
  }

  this.isLoading = true;
  this.errorMessage = '';

  this.apiService.register({ username: this.username, password: this.password })
    .subscribe({
      next: () => {
        this.isLoading = false;
        alert('Registration successful! Now you can login.');
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Registration error:', error);
        this.errorMessage = error.error?.detail || 'Registration failed. User might already exist.';
      }
    });
}

  onLogout(): void {
    this.apiService.logout();
    this.router.navigate(['/login']);
  }
}
