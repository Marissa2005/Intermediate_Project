import '@/styles/styles.css';
import App from './pages/app';
import { 
  requestNotificationPermission, 
  subscribeUserToPush, 
  unsubscribeUserFromPush,
  isNotificationEnabled,
  setNotificationEnabled
} from './push-notification';

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
  });
  await app.renderPage();

  // Register Service Worker for PWA
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('✅ Service Worker registered successfully:', registration);
      
      // Listen for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('🔄 New content available, reload to update');
            // Optionally show update notification
          }
        });
      });
    } catch (error) {
      console.error('❌ Service Worker registration failed:', error);
    }
  }

  function updateNavVisibility() {
    const token = localStorage.getItem("authToken");

    const loginLink = document.getElementById("login-link");
    const registerLink = document.getElementById("register-link");
    const logoutButton = document.getElementById("logout-button");

    if (token) {
      if (logoutButton) logoutButton.style.display = "inline-block";
      if (loginLink) loginLink.style.display = "none";
      if (registerLink) registerLink.style.display = "none";
    } else {
      if (logoutButton) logoutButton.style.display = "none";
      if (loginLink) loginLink.style.display = "inline-block";
      if (registerLink) registerLink.style.display = "inline-block";
    }
  }

  const logoutButton = document.getElementById("logout-button");
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      localStorage.removeItem("authToken");
      alert("Logout berhasil!");
      window.location.hash = "#/login";
      updateNavVisibility();
    });
  }

  updateNavVisibility();

  window.addEventListener('hashchange', async () => {
    await app.renderPage();
    updateNavVisibility();
  });

  const mainContent = document.querySelector("#main-content");
  const skipLink = document.querySelector(".skip-link");

  if (skipLink && mainContent) {

    if (!mainContent.hasAttribute('tabindex')) {
      mainContent.setAttribute('tabindex', '-1');
    }

    skipLink.addEventListener("click", function (event) {
      event.preventDefault();
      skipLink.blur();
      mainContent.focus();
      mainContent.scrollIntoView();
    });
  }

  const enableNotifBtn = document.getElementById("enable-notif-button");
  const disableNotifBtn = document.getElementById("disable-notif-button");
  const notificationBox = document.getElementById("notification");

  function showNotification(message) {
    if (!notificationBox) return;
    notificationBox.textContent = message;
    notificationBox.classList.remove("hidden");

    setTimeout(() => {
      notificationBox.classList.add("hidden");
    }, 3000);
  }

  function updateNotificationButtons() {
    if (enableNotifBtn && disableNotifBtn) {
      enableNotifBtn.classList.toggle("hidden", isNotificationEnabled);
      disableNotifBtn.classList.toggle("hidden", !isNotificationEnabled);
    }
  }

  if (enableNotifBtn) {
    enableNotifBtn.addEventListener("click", async () => {
      try {
        await requestNotificationPermission();
        setNotificationEnabled(true);
        updateNotificationButtons();
        showNotification("Notifikasi diaktifkan!");
      } catch (error) {
        console.error("Gagal mengaktifkan notifikasi", error);
        showNotification("Gagal mengaktifkan notifikasi.");
      }
    });
  }

  if (disableNotifBtn) {
    disableNotifBtn.addEventListener("click", async () => {
      try {
        await unsubscribeUserFromPush();
        setNotificationEnabled(false);
        updateNotificationButtons();
        showNotification("Notifikasi dimatikan!");
      } catch (error) {
        console.error('Gagal unsubscribe:', error);
        showNotification("Gagal mematikan notifikasi.");
      }
    });
  }

  updateNotificationButtons();

  // Handle offline/online status
  function updateOnlineStatus() {
    const statusElement = document.querySelector('.online-status');
    if (statusElement) {
      statusElement.textContent = navigator.onLine ? 'Online' : 'Offline';
      statusElement.className = `online-status ${navigator.onLine ? 'online' : 'offline'}`;
    }
  }

  window.addEventListener('online', () => {
    updateOnlineStatus();
    showNotification('Anda kembali online!');
  });

  window.addEventListener('offline', () => {
    updateOnlineStatus();
    showNotification('Anda sedang offline');
  });

  updateOnlineStatus();
});



