export interface NotificationRepresentation {
  id?: number | string;
  recipientId?: number;
  recipientType?: string;
  message?: string;
  type?: string;
  sentDate?: string;
  readStatus?: boolean | null;
}
