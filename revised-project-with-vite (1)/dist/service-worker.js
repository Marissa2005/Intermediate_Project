self.addEventListener('push', function (event) {
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'Notifikasi Baru!';
    const options = {
        body: data.options?.body || 'Kamu mendapat pesan baru.',
        icon: '/favicon.png',        // pastikan file ini ada
        badge: '/logo.png',   // pastikan file ini juga ada
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

self.addEventListener('message', (event) => {
    const { title, body } = event.data;

    console.log('✅ Menerima pesan dari halaman:', event.data);

    self.registration.showNotification(title || 'Notifikasi', {
        body: body || 'Tidak ada deskripsi',
        icon: '/favicon.png',
        badge: '/favicon.png',
    });
});




