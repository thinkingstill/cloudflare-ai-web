self.addEventListener('install', (event) => {
    event.waitUntil(caches.open('v1').then((cache) => {
        return cache.addAll(['/'])
    }))
})

self.addEventListener('fetch', (event) => {
    event.respondWith(caches.match(event.request).then((response) => {
        if (response) {
            return response
        }
        return fetch(event.request)
    }))
})