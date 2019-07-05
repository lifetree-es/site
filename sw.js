const static_cache_name = 'shell-cache-v3.3';
const dynamic_cache_name = 'dynamic-cache-v2.3';

const assets =[
    '/',
    '/site/index.html',
    '/site/pages/coleta.html',
    '/site/pages/curiosidades.html',
    '/site/pages/dicas.html',
    '/site/pages/flora.html',
    '/site/pages/ong.html',
    '/site/pages/quemsomos.html',
    '/site/src/js/app.js',
    '/site/src/js/main_script.js',
    '/site/src/css/main_style.css',
    '/site/src/css/main_style2.css',
    '/site/src/css/muda.png',
    '/site/src/css/tree.jpg',
    'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css',
    'https://code.jquery.com/jquery-3.3.1.slim.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js',
    'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js'
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