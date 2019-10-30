import { Injectable } from '@angular/core';
import { FCM } from '@ionic-native/fcm/ngx'; // Push

@Injectable({
  providedIn: 'root'
})
export class FcmService {

  fcmNotificationTitle: string = null;
  fcmNotificationBody: string = null;

  constructor(
    private fcm: FCM
  ) {
    this.setupFCM();
  }

  setupFCM() {

    this.fcm.subscribeToTopic('washingMachine');

    // Get FCM token for this app
    this.fcm.getToken().then(token => {
      console.log(token);
    });

    // Listen for the FCM token refresh event
    this.fcm.onTokenRefresh().subscribe(token => {
      console.log(token);
    });

    this.fcm.onNotification().subscribe(data => {
      console.log(data);
      if (data.wasTapped) {
        console.log('Received in background', data);
      } else {
        console.log('Received in foreground', data);
      }
      this.fcmNotificationTitle = data.title;
      this.fcmNotificationBody = data.body;
    });
  }
}
