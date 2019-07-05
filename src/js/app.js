// Check if browser supports service worker
if('serviceWorker' in navigator){
    // If does
    navigator.serviceWorker.register('/lifetree/sw.js')
        .then((reg) => console.log('[Service worker] registered', reg))
        .catch((err) => console.log('[Service worker] not registered', err))
}