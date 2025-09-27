const CACHE_NAME = "todo-pwa-v1";
const FILES_TO_CACHE = [
  "/",
  "/laDog.html",
  "/offline.html",
  "/assets/css/style.css",
  "/assets/images/laDog-logo.png",
  "/assets/images/download (1).jpeg",
  "/assets/images/rsw_730h_730cg_truem.webp",
  "/assets/images/images.jpeg",
  "/assests/images/iconsPwa/icon-192.png",
  "/assests/images/iconsPwa/icon-512.png",
  "/manifest.json",
  "/sw.js"
];

// Instala e faz cache dos arquivos definidos
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting(); // Garante que o SW seja ativado imediatamente
});

// Ativa o service worker e limpa caches antigos
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim(); // Assume o controle das páginas
});

// Intercepta requisições e usa cache como fallback
self.addEventListener("fetch", e => {
  e.respondWith(
    fetch(e.request)
      .then(response => {
        return response;
      })
      .catch(() => {
        return caches.match(e.request).then(res => {
          // Se não encontrado, retorna a offline.html
          return res || caches.match("/offline.html");
        });
      })
  );
});
