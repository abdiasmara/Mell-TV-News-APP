import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer, collection, addDoc, onSnapshot, query, orderBy, limit, setDoc } from 'firebase/firestore';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

// Test Firestore Connection on boot
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();

// Push Notification Service (FCM & Realtime Breaking News Alerts)
export class PushNotificationService {
  private static messaging: any = null;
  private static isInitialized = false;

  static async init(): Promise<string | null> {
    if (this.isInitialized) return null;
    try {
      if (typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window) {
        // Request Notification permission
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          console.log('Notification permission granted.');
          // Initialize messaging if supported
          try {
            this.messaging = getMessaging(app);
            // Request FCM Token
            const token = await getToken(this.messaging, {
              vapidKey: 'BEl42iUIgACvXK9J4j6W5N2Z3J1V7X5K8L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6A7B8C9D0E1F2G3H4I5J6K7L8M9N0'
            }).catch(() => null);

            if (token) {
              // Save token to Firestore
              await setDoc(doc(db, 'fcm_tokens', token), {
                token,
                createdAt: new Date().toISOString()
              }, { merge: true });
              console.log('FCM Token registered successfully:', token);
            }

            // Listen to foreground messages
            onMessage(this.messaging, (payload) => {
              console.log('Message received in foreground: ', payload);
              const notificationTitle = payload.notification?.title || 'Breaking News Mello TV News';
              const notificationOptions = {
                body: payload.notification?.body || 'Ada berita breaking news terbaru!',
                icon: '/favicon.ico'
              };
              if (Notification.permission === 'granted') {
                new Notification(notificationTitle, notificationOptions);
              }
            });
          } catch (e) {
            console.log('FCM messaging initialization info:', e);
          }
        }
      }
      this.isInitialized = true;
    } catch (e) {
      console.log('Push notification service init note:', e);
    }
    return null;
  }

  // Subscribe to Firestore breaking news for instant notification alerts
  static subscribeToBreakingNews(onBreakingNews: (article: any) => void) {
    try {
      const q = query(collection(db, 'articles'), orderBy('date', 'desc'), limit(10));
      return onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const article = change.doc.data();
            if (article.isBreaking) {
              onBreakingNews(article);
              // Trigger browser notification if permitted
              if (typeof window !== 'undefined' && Notification.permission === 'granted') {
                try {
                  new Notification('🚨 BREAKING NEWS - Mello TV News', {
                    body: article.title,
                    icon: article.imageUrl || '/favicon.ico'
                  });
                } catch {
                  // ignore
                }
              }
            }
          }
        });
      }, (error) => {
        console.error('Firestore Error on breaking news snapshot:', error);
      });
    } catch (e) {
      console.log('Breaking news listener note:', e);
      return () => {};
    }
  }
}
