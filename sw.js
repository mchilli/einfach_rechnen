self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open('v1').then((cache) => {
      return cache.addAll(['./', './css/style.min.css', './js/main.js', './js/utils.min.js']);
    })
  );
});
