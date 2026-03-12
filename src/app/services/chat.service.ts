import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  product_id: number;
  content: string;
  created_at: string;
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  private apiUrl = '/api/messages';

  constructor(private http: HttpClient) {}

  getMessages(productId: number) {
    return this.http.get<Message[]>(`${this.apiUrl}/${productId}`);
  }

  sendMessage(data: { receiver_id: number, product_id: number, content: string }) {
    return this.http.post<Message>(this.apiUrl, data);
  }
}
