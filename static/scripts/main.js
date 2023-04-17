// This is the main javascript from the page. The reason for code duplication in sw.js is because sw.js is saved separately in a "service worker" that 
// stays persistent after the user leaves the site. 

const applicationServerPublicKey = 'BB0asxSO-QxcyTYK6hTHfj3FEvQwoH_LPmv7HjY3cwUTlnSWe9eLpWDb75SEfaB9TOk75xS89U42Dj4qMmIXBGo';

const pushButton = document.querySelector('.js-push-btn');

// keep track of service worker and if we are subscribed
let isSubscribed = false;
let swRegistration = null;

// function needed to convert application key
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

// check permissions and change button text
function updateBtn() {
  if (Notification.permission === 'denied') {
    pushButton.textContent = 'Push Messaging Blocked.';
    pushButton.disabled = true;
    updateSubscriptionOnServer(null);
    return;
  }

  if (isSubscribed) {
    pushButton.textContent = 'Disable Push Messaging';
  } else {
    pushButton.textContent = 'Enable Push Messaging';
  }

  pushButton.disabled = false;
}

// update subscription with server
function updateSubscriptionOnServer(subscription) {

  // GUI stuff
  const subscriptionJson = document.querySelector('.js-subscription-json');
  const subscriptionDetails =
    document.querySelector('.js-subscription-details');

  if (subscription) {
    const subscriptionData = JSON.stringify(subscription);

    // updating text box in GUI
    subscriptionJson.textContent = subscriptionData;
    subscriptionDetails.classList.remove('is-invisible');

    // send subscription to server
    fetch("subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      // we send subscription JSON object in the body
      body: subscriptionData
    })
    .then((data) => {
      console.log("Result:", data);
    });

  } else {
    subscriptionDetails.classList.add('is-invisible');
  }
}

// 4.
// subscribe the user. uses the created service worker swRegistration
function subscribeUser() {
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
  // register service 
  swRegistration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: applicationServerKey
  })
  .then(function(subscription) {
    console.log('User is subscribed.');

    // if registration is good, send subscription to server
    updateSubscriptionOnServer(subscription);

    isSubscribed = true;

    updateBtn();
  })
  .catch(function(err) {
    console.log('Failed to subscribe the user: ', err);
    updateBtn();
  });
}

// get the subscription from the service worker, unsubscribe it (locally on browser)
// TODO for a production version: fetch() to server and remove subscription from database/array
function unsubscribeUser() {
  swRegistration.pushManager.getSubscription()
  .then(function(subscription) {
    if (subscription) {
      return subscription.unsubscribe();
    }
  })
  .catch(function(error) {
    console.log('Error unsubscribing', error);
  })
  .then(function() {
    updateSubscriptionOnServer(null);

    console.log('User is unsubscribed.');
    isSubscribed = false;

    updateBtn();
  });
}

// 2. UI stuff
function initializeUI() {
  pushButton.addEventListener('click', function() {
    pushButton.disabled = true;
    if (isSubscribed) {
      unsubscribeUser();
    } else {
      // 3.
      subscribeUser();
    }
  });

  // Set the initial subscription value
  swRegistration.pushManager.getSubscription()
  .then(function(subscription) {
    // check if subscription exists in swRegistration
    isSubscribed = !(subscription === null);

    updateSubscriptionOnServer(subscription);

    if (isSubscribed) {
      console.log('User IS subscribed.');
    } else {
      console.log('User is NOT subscribed.');
    }

    updateBtn();
  });
}

// 1. check if we can use serviceWorker and PushMagager
if ('serviceWorker' in navigator && 'PushManager' in window) {
  console.log('Service Worker and Push is supported');

  navigator.serviceWorker.register('sw.js')
  .then(function(swReg) {
    console.log('Service Worker is registered', swReg);

    swRegistration = swReg;
    initializeUI();
  })
  .catch(function(error) {
    console.error('Service Worker Error', error);
  });
} else {
  console.warn('Push messaging is not supported');
  pushButton.textContent = 'Push Not Supported';
}



