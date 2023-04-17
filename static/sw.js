// This is the service worker script, when you reload the page this script is loaded into your tab assuming your browser support it 
// see main.js line 158

// Our public VAPID key
const applicationServerPublicKey = 'BH8-hIchXKMI6AKSee8gD0hhPThRqaEhIEtMJwcTjEQhiOKdG-_2tTIO-6hOAK4kwg5M9Saedjxp4hVE-khhWxY';

// function to convert VAPID key
function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// event listener for a push event, push event data is passed in text form from the server
self.addEventListener('push', function(event) {
  // parse our data since it was sent as JSON
  const data = JSON.parse(event.data.text());
  console.log('[Service Worker] Push Received.');

  // configure push notification options
  const title = `${data.notificationTitle}`;
  const options = {
    body: `${data.notificationMessage}`,
    icon: 'images/icon.png',
    badge: 'images/badge.png',
    // pass our data to notification click event
    data: event.data.text()
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// we can customize what happens upon clicking the notification and even use our event data!
self.addEventListener('notificationclick', function(event) {
  // parse data again
  const data = JSON.parse(event.notification.data);
  console.log('[Service Worker] Notification click Received.');
  console.log("Notification Link: ", data.notificationLink);
  event.notification.close();

  event.waitUntil(
    // open notification link
    clients.openWindow(`${data.notificationLink}`)
  );

});

// deal with subscription changes
self.addEventListener('pushsubscriptionchange', function(event) {
  console.log('[Service Worker]: \'pushsubscriptionchange\' event fired.');
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
  event.waitUntil(
    self.registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey
    })
    .then(function(newSubscription) {
      console.log('[Service Worker] New subscription: ', newSubscription);
    })
  );
});
