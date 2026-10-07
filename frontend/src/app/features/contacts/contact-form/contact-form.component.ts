/**
 * ─────────────────────────────────────────────────────────────
 *  Componente de Formulario de Contacto
 * ─────────────────────────────────────────────────────────────
 *
 * Este componente es un "Dumb Component" (componente de presentación).
 * Su única responsabilidad es mostrar y validar el formulario.
 *
 * Características:
 * - Usa Reactive Forms de Angular
 * - Usa FormBuilder para inicializar el formulario
 * - Valida en cliente (Validators.required, email, minLength)
 * - Emite eventos al padre (save, cancel) via @Output
 *
 * Por qué separar el formulario en su propio componente?
 * - Reutilización: puede usarse en múltiples lugares
 * - Testing: más fácil de testear validaciones aisladas
 * - Separación de responsabilidades: UI vs lógica de negocio
 * ─────────────────────────────────────────────────────────────
 */
import { Component, inject, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Contact } from '../../../core/models/contact.model';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" class="contact-form">
      <h2>Nuevo Contacto</h2>

      <mat-form-field appearance="outline">
        <mat-label>Nombre</mat-label>
        <input matInput formControlName="name" placeholder="Ej. Juan">
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Email</mat-label>
        <input matInput formControlName="email" placeholder="juan.perez@example.com">
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Mensaje</mat-label>
        <textarea matInput formControlName="message" placeholder="Escribe tu mensaje aquí..."></textarea>
      </mat-form-field>

      <div class="actions">
        <button mat-button type="button" (click)="onCancel()">Cancelar</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="contactForm.invalid">
          Guardar
        </button>
      </div>
    </form>
  `,
  styles: [`
    .contact-form { display: flex; flex-direction: column; padding: 20px; min-width: 300px; }
    .actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
    mat-form-field { width: 100%; }
  `]
})
export class ContactFormComponent implements OnInit {
  // Inyectar FormBuilder para crear el formulario
  private fb = inject(FormBuilder);

  // ─────────────────────────────────────────────────────────
  //  @Output - Comunicación con el componente padre
  // ─────────────────────────────────────────────────────────
  //
  // Estos eventos permiten al componente padre reaccionar:
  // - save: cuando el usuario envía el formulario
  // - cancel: cuando el usuario cancela
  // ─────────────────────────────────────────────────────────

  @Output() save = new EventEmitter<Contact>();
  @Output() cancel = new EventEmitter<void>();

  // ─────────────────────────────────────────────────────────
  //  FormGroup - Estructura del formulario
  // ─────────────────────────────────────────────────────────
  //
  // Define los campos del formulario y sus validadores:
  // - name: requerido, mínimo 2 caracteres
  // - email: requerido, formato válido de email
  // - message: requerido, mínimo 10 caracteres
  //
  // Estos validators cumplen con "validación en cliente" del README.
  // ─────────────────────────────────────────────────────────

  public contactForm: FormGroup;

  constructor() {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    // No hay edición en este backend, así que no implementamos patchValue
  }

  // ─────────────────────────────────────────────────────────
  //  onSubmit() - Manejar envío del formulario
  // ─────────────────────────────────────────────────────────
  //
  // 1. Verifica que el formulario sea válido
  // 2. Extrae los valores de cada campo via .get()
  // 3. Crea objeto Contact con los datos
  // 4. Emite evento 'save' al componente padre
  //
  // El componente padre (ContactListComponent) recibirá este evento
  // y llamará al servicio para crear el contacto en el backend.
  // ─────────────────────────────────────────────────────────

  onSubmit(): void {
    if (this.contactForm.valid) {
      const formData: Contact = {
        name: this.contactForm.get('name')?.value,
        email: this.contactForm.get('email')?.value,
        message: this.contactForm.get('message')?.value
      };

      this.save.emit(formData);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
