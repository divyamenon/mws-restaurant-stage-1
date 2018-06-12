self.addEventListener('install', function(event) {
  var urlsToCache = [
    '/',
    '/js/',
    '/img/',
    '/restaurant.html',
    '/index.html',
    'js/main.js',
    'js/index.js',
    'js/dbhelper.js',
    'js/restaurant_info.js',
    'css/styles.css',
  ];

  event.waitUntil(
    caches.open('restaurant-cache-v1').then(function(cache) {
      return cache.addAll(urlsToCache);
    }).catch(function(error){
      console.log("Failed to open Cache" + error);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      var fetchRequest = event.request.clone();
      return response || fetch(fetchRequest).then(function(fetchResponse) {
        var cloneResponse = fetchResponse.clone();
        // Check if we received a valid response
        if(!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
          return fetchResponse;
        }
        caches.open("restaurant-cache-v1").then(function(cache) {
            cache.put(event.request, cloneResponse);
        });

        return fetchResponse;
      });
    })
  );
});