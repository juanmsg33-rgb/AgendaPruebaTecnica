/**
 * ─────────────────────────────────────────────────────────────
 *  Servicio de Contactos - Lógica de Negocio
 * ─────────────────────────────────────────────────────────────
 *
 * Este servicio es el puente entre el frontend Angular y el backend Express.
 * Centraliza todas las operaciones HTTP relacionadas con contactos.
 *
 * Funcionalidades:
 * - Gestionar el estado de los contactos con Angular Signals
 * - Crear nuevos contactos (POST)
 * - Listar contactos existentes (GET)
 *
 * Por qué un servicio?
 * - Separación de responsabilidades: lógica de negocio fuera de componentes
 * - Reutilización: múltiples componentes pueden usar el mismo servicio
 * - Testing: más fácil de testear lógica aislada
 * - Signals: estado reactivo que actualiza automáticamente la UI
 * ─────────────────────────────────────────────────────────────
 */
import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Contact } from '../models/contact.model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root' // Servicio singleton disponible en toda la app
})
export class ContactService {
  // Inyectar HttpClient para hacer requests HTTP
  private http = inject(HttpClient);

  // URL del backend Express + SQLite
  private apiUrl = 'http://localhost:3000/api/contacts';

  // ─────────────────────────────────────────────────────────
  //  Manejo de Estado con Angular Signals
  // ─────────────────────────────────────────────────────────
  //
  // Signals es la forma moderna de Angular de manejar estado reactivo.
  // - signal(): valor que puede cambiar y notifica a sus suscriptores
  // - computed(): valor derivado que se recalcula automáticamente
  //
  // contactsSignal es nuestra "Fuente de la Verdad" reactiva:
  // - Todos los componentes leen de este signal
  // - Cuando cambia, la UI se actualiza automáticamente
  // ─────────────────────────────────────────────────────────

  private contactsSignal = signal<Contact[]>([]);
  public contacts = computed(() => this.contactsSignal());

  // Al inicializar, cargar los contactos desde el backend
  constructor() {
    this.refreshContacts();
  }

  // ─────────────────────────────────────────────────────────
  //  refreshContacts() - Listar contactos
  // ─────────────────────────────────────────────────────────
  //
  // Hace un GET al backend para obtener todos los contactos.
  // Actualiza el signal con los datos recibidos.
  //
  // El interceptor auth.interceptor.ts inyecta Basic Auth automáticamente.
  // ─────────────────────────────────────────────────────────

  public refreshContacts(): void {
    this.http.get<Contact[]>(this.apiUrl).subscribe(data => {
      this.contactsSignal.set(data);
    });
  }

  // ─────────────────────────────────────────────────────────
  //  create() - Crear nuevo contacto
  // ─────────────────────────────────────────────────────────
  //
  // Hace un POST al backend para crear un nuevo contacto.
  // Usa tap() para actualizar la lista automáticamente después de crear.
  //
  // Por qué tap() y no subscribe en el componente?
  // - Permite que el servicio gestione el refresco de datos
  // - El componente solo se preocupa de manejar éxito/error
  // ─────────────────────────────────────────────────────────

  public create(contact: Contact): Observable<Contact> {
    return this.http.post<Contact>(this.apiUrl, contact).pipe(
      tap(() => this.refreshContacts()) // Actualizamos la lista automáticamente
    );
  }
}
