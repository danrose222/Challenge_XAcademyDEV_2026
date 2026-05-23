import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PlayerService } from '../../services/player/player.service';

@Component({
  selector: 'app-player-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './player-form.html'
})
export class PlayerFormComponent implements OnInit {
  playerForm!: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private playerService: PlayerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.playerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      club: ['', Validators.required],
      nationality: ['', Validators.required],
      position: ['', Validators.required],
      overall: [50, [Validators.required, Validators.min(1), Validators.max(99)]],
      age: [18, [Validators.required, Validators.min(15)]]
    });
  }

  onSubmit(): void {
    if (this.playerForm.valid) {
      const formValues = this.playerForm.value;
      const payload = {
        longName: formValues.name,
        clubName: formValues.club,
        nationalityName: formValues.nationality,
        playerPositions: formValues.position,
        overall: Number(formValues.overall),
        age: Number(formValues.age),   
        fifaVersion: 23, 
        fifaUpdate: 9,
        playerFaceUrl: 'https://cdn.sofifa.net/players/notfound_0_120.png',
        potential: Number(formValues.overall)
      };

      this.playerService.createPlayer(payload).subscribe({
        next: () => {
          this.errorMessage = '';
          this.successMessage = '¡Fichaje exitoso! Jugadora creada correctamente.';
         
          setTimeout(() => this.router.navigate(['/']), 2000); 
        },
        error: (err) => {
          console.error('Error al crear:', err);
          this.successMessage = '';
          
          if (err.error && err.error.message) {
            console.error('🚨 MOTIVOS DEL RECHAZO:', err.error.message);
            this.errorMessage = 'Error del servidor: Revisa la consola para más detalles.';
          } else {
            this.errorMessage = 'Error de conexión. ¿Está levantado el backend?';
          }
        }
      });
    } else {
      this.playerForm.markAllAsTouched();
    }
  }
}