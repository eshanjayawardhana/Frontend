import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private baseUrl: string = 'http://localhost:8010/api/v1';

      constructor(private http: HttpClient) {}

      createNotification(notification: any, type: any): Observable<any> {
        if (type == 'Add') {
          return this.http.post(this.baseUrl + '/notification-add', notification);
        } else {
          return this.http.put(
            this.baseUrl + '/notification/' + notification.id,
            notification,
          );
        }
      }

      GetAllNotifications(): Observable<any> {
        return this.http.get(this.baseUrl + '/notifications');
      }

      GetNotificationById(ID: any): Observable<any> {
        return this.http.get(this.baseUrl + '/notification/' + ID);
      }

      DeleteNotificationById(ID: any): Observable<any> {
        return this.http.delete(this.baseUrl + '/notification/' + ID);
      }
}
