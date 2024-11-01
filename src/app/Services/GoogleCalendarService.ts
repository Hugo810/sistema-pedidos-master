import { Injectable } from '@angular/core';

interface Google {
  accounts: {
    oauth2: {
      initTokenClient: (options: {
        client_id: string;
        scope: string;
        callback: (tokenResponse: any) => void;
      }) => {
        requestAccessToken: (options?: { prompt?: string }) => void; // Método para solicitar o token
      };
    };
  };
}

// Declaração global para o tipo Google
declare global {
  interface Window {
    google: Google;
  }
}

@Injectable({
  providedIn: 'root',
})
export class GoogleCalendarService {
  private CLIENT_ID = '238976793976-1i6s81cr66nvluae8c4h4a4s9nlu9247.apps.googleusercontent.com'; // Substitua pelo seu Client ID
  private API_KEY = 'AIzaSyDhJuAvXUx7u7NV_I8vrZqqZICAJ1uf_jE'; // Substitua pela sua API Key
  private SCOPES = ['https://www.googleapis.com/auth/calendar'];
  private accessToken: string | null = null; // Armazena o token de acesso

  constructor() {
    // Carregar a biblioteca Google Identity Services
    this.loadGsiLibrary();
  }

  loadGsiLibrary(): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log('Google Identity Services carregada.');
        resolve(); // Resolve a promise quando o script é carregado
      };
      script.onerror = () => {
        reject(new Error('Falha ao carregar a biblioteca Google Identity Services.')); // Rejeita a promise se houver erro no carregamento
      };
      document.body.appendChild(script);
    });
  }

  public authenticate(): Promise<void> {
    return new Promise((resolve, reject) => {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: this.CLIENT_ID,
        scope: this.SCOPES.join(' '),
        callback: (response: any) => {
          if (response.error) {
            console.error('Erro ao autenticar:', response.error);
            reject(response.error);
          } else {
            this.accessToken = response.access_token; // Armazena o token de acesso
            console.log('Token de acesso recebido:', this.accessToken);
            resolve();
          }
        },
      });

      // Solicitar o token de acesso
      client.requestAccessToken({ prompt: 'consent' });
    });
  }

  public addEvent(event: any): Promise<void> {
    return new Promise((resolve, reject) => {
      fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Erro ao criar evento: ' + response.statusText);
          }
          return response.json();
        })
        .then(data => {
          console.log('Evento criado com sucesso:', data);
          resolve();
        })
        .catch(error => {
          console.error('Erro ao criar evento:', error);
          reject(error);
        });
    });
  }

  public getAccessToken(): string | null {
    return this.accessToken; // Retorna o token de acesso
  }
}
