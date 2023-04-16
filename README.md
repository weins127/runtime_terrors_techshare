# Push Notifications 

The Runtime Terrors

Demo Page: https://runtime-terrors-techshare.onrender.com/


## Introduction 

Diagram 1
![Diagram 1](diagrams/diagram1.png)

Diagram 2
![Diagram 2](diagrams/diagram2.png)


## Setting Up Push Notifications:

### main.js
- client side

### index.js
- server side

```js const webpush = require('web-push');```
- using web-push library for node.js

```let subscriptions = [];```
- creating an array to store subscriptions
- normally, would connect this to a database

```app.post('/subscribe', (req, res) => {```
- subscribe route is used to add a new subscriber on the server side
- initially, get a fetch request sent from client (main.js)
    - request body contains a subscription object
- if subscriber doesn't already exist, add it to the array
- payload ???


```app.post('/push', (req, res, next) => {```
- push route is used to send a new push notification on the server side
- initially, get a fetch request sent from client (main.js)
    - request body contains notification information
        - notification message, title, and link ???
- loop through subscriptions array
    - use sendNotification() method from web-push library to send 
      the notification to every subscriber

### sw.js
- service workers


## Running code locally:
- node index.js

## References:
- https://codelabs.developers.google.com/codelabs/push-notifications#0
- https://clarkio.com/2017/08/22/pwa-web-push-3/
- https://www.npmjs.com/package/web-push