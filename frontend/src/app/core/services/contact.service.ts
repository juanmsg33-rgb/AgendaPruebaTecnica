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
import { Observable, tap, catchError, map, of, switchMap } from 'rxjs';

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

  // Al inicializar no hacemos la carga aquí: refreshContacts() devuelve un
  // Observable "frío" que NO se ejecuta si nadie se suscribe. La carga inicial
  // la dispara ContactListComponent (que además maneja los errores de red).
  constructor() {}

  // ─────────────────────────────────────────────────────────
  //  refreshContacts() - Listar contactos
  // ─────────────────────────────────────────────────────────
  //
  // Hace un GET al backend para obtener todos los contactos.
  // Actualiza el signal con los datos recibidos.
  //
  // El interceptor auth.interceptor.ts inyecta Basic Auth automáticamente.
  // ─────────────────────────────────────────────────────────

  public refreshContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.apiUrl).pipe(
      tap({
        next: (data) => {
          this.contactsSignal.set(data);
        },
        error: (err) => {
          console.error('Error al cargar contactos:', err);
        }
      })
    );
  }

  // ─────────────────────────────────────────────────────────
  //  create() - Crear nuevo contacto
  // ─────────────────────────────────────────────────────────
  //
  // Hace un POST al backend para crear un nuevo contacto.
  // Usa switchMap() para refrescar la lista automáticamente después de crear.
  //
  // Por qué tap() y no subscribe en el componente?
  // - Permite que el servicio gestione el refresco de datos
  // - El componente solo se preocupa de manejar éxito/error
  // ─────────────────────────────────────────────────────────

  //  ⚠ Nota importante: this.refreshContacts() devuelve un Observable "frío".
  //  Si solo lo llamamos sin suscribirnos, el GET **nunca se dispara** y la
  //  lista no se actualiza (hay que recargar la página a mano). Por eso lo
  //  encadenamos con switchMap: primero el POST y, en cuanto responde, el GET
  //  que actualiza el signal. El componente recibe 'next' con la lista ya
  //  refrescada, así que al cerrar el diálogo el contacto ya aparece.
  // ─────────────────────────────────────────────────────────

  public create(contact: Contact): Observable<Contact> {
    return this.http.post<Contact>(this.apiUrl, contact).pipe(
      switchMap((created) =>
        this.refreshContacts().pipe(
          // Devolvemos el contacto creado para no cambiar la firma del método
          map(() => created),
          // El contacto SÍ se creó: si falla solo el refresco no debemos
          // reportar un error de creación al componente
          catchError((err) => {
            console.error('Error al refrescar la lista:', err);
            return of(created);
          })
        )
      ),
      tap({
        error: (err) => {
          console.error('Error al crear contacto:', err);
          // El error se propaga al componente para manejo específico
        }
      })
    );
  }
}
