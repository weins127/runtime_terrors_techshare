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

## Conclusion
- Is it worth doing all the work “in-house”? 
    - Pros:
        - Customization: Building a push notification system in-house allows for customization.

        - Integration: An in-house system can be easily integrated with other internal systems, making it easier to manage.

        - Control: When building an in-house system, you have complete control over the system and can make changes as needed.

        - Cost savings: Depending on the size of the operation, building an in-house system can be more cost-effective than paying for a third-party solution.

        - Security: With an in-house system, there is more control over data security and sensitive data can be properly protected.

    - Cons:
        - Time-consuming: Developing a push notification system from scratch can be a time-consuming process, taking time away from other important tasks.

        - Maintenance: An in-house system requires ongoing maintenance, including updates and bug fixes.

        - Scalability: An in-house system may not be as scalable as a third-party solution, which can handle a large number of users and notifications.

        - Support: With an in-house system, support is entirely reliant on the internal team, which may not have the resources to provide comprehensive support.

- Alternatives:
    - Third Parties: OneSignal, Firebase Cloud Messaging
    - Frameworks and Libraries: React Native Push Notification, Push.js, and WebPush
    - APIs: Amazon SNS, Twilio can be used to leverage pre-built infrastructure




## Running code locally:
- node index.js

## References:
- https://codelabs.developers.google.com/codelabs/push-notifications#0
- https://clarkio.com/2017/08/22/pwa-web-push-3/
- https://www.npmjs.com/package/web-push