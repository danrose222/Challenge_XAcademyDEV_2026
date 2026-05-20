import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/player/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html'
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    
    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: () => {
        
        this.router.navigate(['/']);
      },
      error: (err: any) => {
        this.errorMessage = 'Credenciales incorrectas. El patovica no te dejó pasar.';
        console.error('Error de login:', err);
      }
    });
  }
}
