const static_cache_name = 'shell-cache-v3.3';
const dynamic_cache_name = 'dynamic-cache-v2.3';

const assets =[
    '/',
    '/index.html',

];

// install service worker
self.addEventListener('install', evt => {
    evt.waitUntil(
        caches.open(static_cache_name).then(cache => {
            console.log('[Caching all shell assets]');
            cache.addAll(assets);
        })
    );
    self.skipWaiting();
});

// activate service worker
self.addEventListener('activate', evt => {
    console.log('[Service worker has been activated]');
    evt.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys
                .filter(key => key !== static_cache_name && key !== dynamic_cache_name)
                .map(key => caches.delete(key))
            )
        })
    );
});

// fetch event
self.addEventListener('fetch', evt => {
    console.log('[Fetch event]');
    evt.respondWith(
        caches.match(evt.request).then(cacheRes => {
            return cacheRes || fetch(evt.request).then(fetchRes => {
                return caches.open(dynamic_cache_name).then(cache => {
                    cache.put(evt.request.url, fetchRes.clone());
                    return fetchRes;
                })
            });
        }).catch(() => caches.match('pages/offline.html'))
    );
});