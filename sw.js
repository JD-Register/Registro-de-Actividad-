self.addEventListener("install", event => {
  console.log("Service Worker instalado");
  event.waitUntil(
    caches.open("v2").then(cache => {
      return cache.addAll([
        "/My-Actividad-/index.html"
      ]);
    })
  );
});

// Estrategia: network first con fallback offline
self.addEventListener("fetch", event => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).then(response => {
        // Guardar la nueva versión en caché
        const clone = response.clone();
        caches.open("v2").then(cache => cache.put("/My-Actividad-/index.html", clone));
        return response;
      }).catch(() => {
        // Si no hay internet, usar la versión cacheada
        return caches.match("/My-Actividad-/index.html");
      })
    );
    return;
  }

  // Para otros recursos: cache first
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});