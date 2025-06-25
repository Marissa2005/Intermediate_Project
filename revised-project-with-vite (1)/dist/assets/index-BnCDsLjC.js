var B=n=>{throw TypeError(n)};var E=(n,e,t)=>e.has(n)||B("Cannot "+t);var c=(n,e,t)=>(E(n,e,"read from private field"),t?t.call(n):e.get(n)),p=(n,e,t)=>e.has(n)?B("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(n):e.set(n,t),g=(n,e,t,o)=>(E(n,e,"write to private field"),o?o.call(n,t):e.set(n,t),t),I=(n,e,t)=>(E(n,e,"access private method"),t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))o(i);new MutationObserver(i=>{for(const a of i)if(a.type==="childList")for(const r of a.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&o(r)}).observe(document,{childList:!0,subtree:!0});function t(i){const a={};return i.integrity&&(a.integrity=i.integrity),i.referrerPolicy&&(a.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?a.credentials="include":i.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function o(i){if(i.ep)return;i.ep=!0;const a=t(i);fetch(i.href,a)}})();async function $(n){return await(await fetch("https://story-api.dicoding.dev/v1/stories",{headers:{Authorization:`Bearer ${n}`}})).json()}const M={getToken(){return localStorage.getItem("authToken")},async getStories(){const n=this.getToken();return await $(n)}},N=(n,e)=>({async init(){const t=n.getStoriesContainer();try{const i=(await e.getStories()).listStory||[];n.showStories(i,t)}catch{n.showError(t,"Gagal memuat cerita. Coba lagi nanti.")}}});class T{async render(){return`
      <section class="container">
        <h1>All Stories</h1>
        <div id="stories-list" class="stories-grid"></div>
      </section>
    `}async afterRender(){N(this,M).init()}getStoriesContainer(){return document.getElementById("stories-list")}showStories(e,t){t.innerHTML=e.map(o=>`
      <div class="story-card" data-id="${o.id}">
        <img src="${o.photoUrl}" alt="${o.name}" class="story-image" />
        <div class="story-info">
          <h3>${o.name}</h3>
          <p>${o.description}</p>
          <a href="#/detail/${o.id}" class="view-detail-link">View Detail</a>
          <button class="like-button" aria-label="Like story">🤍</button>
        </div>
      </div>
    `).join(""),t.querySelectorAll(".like-button").forEach(o=>{o.addEventListener("click",()=>{o.classList.toggle("liked"),o.textContent=o.classList.contains("liked")?"❤️":"🤍"})})}showError(e,t){e.innerHTML=`<p>${t}</p>`}}const x={async getContent(){return{title:"About Page",description:"This is a website to display the stories of Dicoding participants."}}};class O{constructor(e,t){this.view=e,this.model=t}async loadContent(){try{const e=await this.model.getContent();this.view.showContent(e)}catch{this.view.showError("Gagal memuat konten.")}}}class R{constructor(){this.presenter=new O(this,x)}async render(){return`
    <div id="page-wrapper">
      <section class="container" id="about-section">
        <p>Loading...</p>
      </section>
    </div>
  `}async afterRender(){this.presenter.loadContent()}showContent({title:e,description:t}){const o=document.getElementById("about-section");o.innerHTML=`
      <h1>${e}</h1>
      <p>${t}</p>
    `}showError(e){const t=document.getElementById("about-section");t.innerHTML=`<p style="color:red">${e}</p>`}}const j={async registerUser(n){const e=await fetch("https://story-api.dicoding.dev/v1/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)}),t=await e.json();if(!e.ok)throw new Error(t.message);return t}},q=(n,e)=>({init(){n.bindSubmit(this.handleSubmit.bind(this))},async handleSubmit(t){try{await e.registerUser(t),n.showSuccess("Registrasi berhasil! Silakan login.")}catch(o){n.showError(`Gagal register: ${o.message}`)}}});class H{async render(){return`
      <section class="auth-container">
        <h1>Register</h1>
        <form id="register-form">
          <label for="name">Name</label>
          <input type="text" id="name" name="name" required />

          <label for="email">Email</label>
          <input type="email" id="email" name="email" required />

          <label for="password">Password</label>
          <input type="password" id="password" name="password" required />

          <button type="submit">Register</button>
        </form>
      </section>
    `}async afterRender(){this.presenter=q(this,j),this.presenter.init()}bindSubmit(e){document.getElementById("register-form").addEventListener("submit",t=>{t.preventDefault();const o={name:document.getElementById("name").value.trim(),email:document.getElementById("email").value.trim(),password:document.getElementById("password").value.trim()};e(o)})}showSuccess(e){alert(e),this.navigateToLogin()}showError(e){alert(e)}navigateToLogin(){window.location.hash="#/login"}}const U={getToken(){return localStorage.getItem("authToken")},async submitStory(n){const e=this.getToken();if(!e)throw new Error("Anda perlu login terlebih dahulu.");const t=await fetch("https://story-api.dicoding.dev/v1/stories",{method:"POST",headers:{Authorization:`Bearer ${e}`},body:n}),o=await t.json();if(!t.ok)throw new Error(o.message);return o}};class G{constructor(e,t){this.view=e,this.model=t,this.cameraBlob=null}setCameraBlob(e){this.cameraBlob=e}async submitForm({content:e,file:t,latitude:o,longitude:i}){if(!o||!i)return this.view.showError("Silakan pilih lokasi di peta terlebih dahulu.");if(!t&&!this.cameraBlob)return this.view.showError("Silakan pilih file atau ambil foto dari kamera.");const a=new FormData;if(a.append("description",e),a.append("lat",o),a.append("lon",i),t)a.append("photo",t);else{const r=new File([this.cameraBlob],"camera-photo.jpg",{type:"image/jpeg"});a.append("photo",r)}try{await this.model.submitStory(a),this.view.showSuccess()}catch(r){this.view.showError(r.message)}}}function z(n){const e="=".repeat((4-n.length%4)%4),t=(n+e).replace(/\-/g,"+").replace(/_/g,"/"),o=window.atob(t);return new Uint8Array([...o].map(i=>i.charCodeAt(0)))}const V="BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk";async function F(){if(await Notification.requestPermission()!=="granted")throw alert("Izin notifikasi ditolak."),new Error("Notifikasi ditolak user.");await P()}async function P(){await navigator.serviceWorker.register("/service-worker.js");const e=await(await navigator.serviceWorker.ready).pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:z(V)}),t={endpoint:e.endpoint,keys:{p256dh:e.toJSON().keys.p256dh,auth:e.toJSON().keys.auth}};await J(t)}async function J(n){const e=localStorage.getItem("authToken");if(!e){console.warn("⚠️ Token tidak ditemukan di localStorage");return}try{const o=await(await fetch("https://story-api.dicoding.dev/v1/notifications/subscribe",{method:"POST",headers:{Authorization:`Bearer ${e}`,"Content-Type":"application/json"},body:JSON.stringify(n)})).json();console.log("✅ Subscription berhasil dikirim:",o.message)}catch(t){console.error("❌ Gagal mengirim subscription:",t)}}class W{constructor(){this.presenter=new G(this,U)}async render(){return`
    <section class="story-form-container">
      <h1>Add New Story</h1>
      <form id="add-story-form">
        <label for="content">Description</label>
        <textarea id="content" name="content" rows="3" required></textarea>

        <label for="image">Photo</label>
        <input type="file" id="image" name="image" accept="image/*" />

        <label for="capture">Capture with Camera:</label>
        <div class="camera-wrapper">
          <video id="video" width="100%" height="240" autoplay></video>
          <div class="camera-buttons">
            <button type="button" id="start-camera" aria-label="Start Camera">Start Camera</button>
            <button type="button" id="take-photo" aria-label="Take Photo">Take Photo</button>
            <button type="button" id="stop-camera" aria-label="Stop Camera">Stop Camera</button>
          </div>
          <canvas id="canvas" width="320" height="240" style="display: none;"></canvas>
          <img id="photo-preview" alt="Preview" style="margin-top: 10px; max-width: 100%; display: none;" />
        </div>

        <label for="location">Pick Location:</label>
        <div id="map" style="width: 100%; height: 300px; border-radius: 12px; margin-bottom: 20px;"></div>
        <input type="hidden" id="latitude" name="latitude">
        <input type="hidden" id="longitude" name="longitude">

        <button type="submit">Add Story</button>
      </form>
    </section>
    `}async afterRender(){this.setupCamera(),this.setupMap(),document.getElementById("add-story-form").addEventListener("submit",e=>{e.preventDefault(),this.presenter.submitForm({content:document.getElementById("content").value,file:document.getElementById("image").files[0],latitude:document.getElementById("latitude").value,longitude:document.getElementById("longitude").value})})}setupCamera(){const e=document.getElementById("video"),t=document.getElementById("canvas"),o=document.getElementById("photo-preview");let i;document.getElementById("start-camera").addEventListener("click",async()=>{i=await navigator.mediaDevices.getUserMedia({video:!0}),e.srcObject=i}),document.getElementById("stop-camera").addEventListener("click",()=>{i&&(i.getTracks().forEach(a=>a.stop()),e.srcObject=null)}),document.getElementById("take-photo").addEventListener("click",()=>{t.getContext("2d").drawImage(e,0,0,t.width,t.height);const a=t.toDataURL("image/jpeg");o.src=a,o.style.display="block",fetch(a).then(r=>r.blob()).then(r=>this.presenter.setCameraBlob(r))})}setupMap(){const e=L.map("map").setView([0,0],2);L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"&copy; OpenStreetMap contributors"}).addTo(e);let t=null;e.on("click",o=>{const i=o.latlng.lat,a=o.latlng.lng;document.getElementById("latitude").value=i,document.getElementById("longitude").value=a,t&&e.removeLayer(t),t=L.marker([i,a]).addTo(e).bindPopup("Picked Location").openPopup()})}showSuccess(){document.getElementById("content").value,alert("Story successfully added!"),window.location.hash="#/"}showError(e){alert(e)}destroy(){const e=document.getElementById("video"),t=e==null?void 0:e.srcObject;t&&(t.getTracks().forEach(o=>o.stop()),e.srcObject=null)}}class _{constructor(e="#app"){this.container=document.querySelector(e)}render(e){return`
      <section class="container" tabindex="-1">
        <h1>Daftar Cerita</h1>
        <ul>
          ${e.map(t=>`
            <li>
              <h2>${t.title}</h2>
              <p>${t.content}</p>
              <img src="${t.image}" alt="${t.title}" />
            </li>
          `).join("")}
        </ul>
      </section>
    `}showStories(e){this.container.innerHTML=this.render(e),this.afterRender()}afterRender(){}}window.AuthModel={async login(n,e){const t=await fetch("https://story-api.dicoding.dev/v1/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:n,password:e})}),o=await t.json();return t.ok?(localStorage.setItem("authToken",o.loginResult.token),o):{error:!0,message:o.message||"Login gagal"}}};class K{constructor(e,t){this.view=e,this.model=t}async login(e,t){try{const o=await this.model.login(e,t);o.error?this.view.showError(o.message):this.view.showSuccess("Login berhasil!")}catch(o){this.view.showError(o.message)}}}class Q{constructor(){this.presenter=new K(this,window.AuthModel)}async render(){return`
      <section class="auth-container">
        <h1>Login</h1>
        <form id="login-form">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" required />

          <label for="password">Password</label>
          <input type="password" id="password" name="password" required />

          <button type="submit">Login</button>
          <p style="margin-top: 16px;">Belum punya akun? <a href="#/register">Daftar di sini</a></p>
        </form>
      </section>
    `}async afterRender(){document.getElementById("login-form").addEventListener("submit",t=>{t.preventDefault();const o=document.getElementById("email").value.trim(),i=document.getElementById("password").value.trim();this.presenter.login(o,i)})}showSuccess(e){alert(e),window.location.hash="#/home"}showError(e){alert(`Gagal login: ${e}`)}}function A(n){const e=n.split("/");return{resource:e[1]||null,id:e[2]||null}}function Y(n){let e="";return n.resource&&(e=e.concat(`/${n.resource}`)),n.id&&(e=e.concat("/:id")),e||"/"}function C(){return location.hash.replace("#","")||"/"}function X(){const n=C(),e=A(n);return Y(e)}function Z(){const n=C();return A(n)}const ee={getStoryId(){const{id:n}=Z();return n},getToken(){return localStorage.getItem("authToken")},async fetchStoryDetail(n,e){const t=await fetch(`https://story-api.dicoding.dev/v1/stories/${n}`,{headers:{Authorization:`Bearer ${e}`}}),o=await t.json();if(!t.ok)throw new Error(o.message);return o.story}},te=(n,e)=>({async init(){const t=e.getStoryId();if(!t){n.showError("ID cerita tidak ditemukan di URL.");return}try{const o=e.getToken(),i=await e.fetchStoryDetail(t,o);n.showStoryDetail(i)}catch(o){n.showError(o.message)}}});class ne{async render(){return'<section id="story-detail" tabindex="-1" class="container story-detail-container">Loading...</section>'}async afterRender(){this.presenter=te(this,ee),await this.presenter.init()}showStoryDetail(e){const t=document.getElementById("story-detail");if(t.innerHTML=`
      <h1>Story Detail</h1>
      <h2>${e.name}</h2>
      <img src="${e.photoUrl}" alt="${e.name}" width="300" />
      <p>${e.description}</p>
      <p><strong>Dibuat pada:</strong> ${new Date(e.createdAt).toLocaleString()}</p>
      <div id="map" style="width: 100%; height: 400px;"></div>
    `,e.lat!==void 0&&e.lon!==void 0&&e.lat!==null&&e.lon!==null&&!isNaN(e.lat)&&!isNaN(e.lon)){const o=L.map("map").setView([e.lat,e.lon],13);L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"&copy; OpenStreetMap contributors"}).addTo(o),L.marker([e.lat,e.lon]).addTo(o).bindPopup(`Cerita: ${e.name}`).openPopup(),navigator.geolocation&&navigator.geolocation.getCurrentPosition(i=>{const a=i.coords.latitude,r=i.coords.longitude;L.marker([a,r],{icon:L.icon({iconUrl:"https://cdn-icons-png.flaticon.com/512/64/64113.png",iconSize:[25,41],iconAnchor:[12,41],popupAnchor:[1,-34]})}).addTo(o).bindPopup("Lokasi Anda").openPopup();const m=L.latLngBounds([[e.lat,e.lon],[a,r]]);o.fitBounds(m,{padding:[50,50]})},i=>{console.warn("Geolocation error:",i.message)})}else document.getElementById("map").innerHTML="<p>Lokasi tidak tersedia untuk cerita ini.</p>"}showError(e){document.getElementById("story-detail").innerHTML=`<p>${e}</p>`}}const oe={"/":new T,"/login":new Q,"/register":new H,"/home":new T,"/about":new R,"/add-new-story":new W,"/list-story":new _,"/detail/:id":new ne};var d,h,l,u,v,D;class ie{constructor({navigationDrawer:e,drawerButton:t,content:o}){p(this,v);p(this,d,null);p(this,h,null);p(this,l,null);p(this,u,null);g(this,d,o),g(this,h,t),g(this,l,e),I(this,v,D).call(this)}async renderPage(){const e=X(),t=!!localStorage.getItem("authToken");if(["/home","/add-new-story","/list-story","/detail/:id"].some(r=>r.includes(":")?e.startsWith(r.split("/:")[0]):e===r)&&!t){window.location.hash="#/login";return}const a=oe[e];if(!a){c(this,d).innerHTML="<p>Halaman tidak ditemukan.</p>";return}c(this,u)&&typeof c(this,u).destroy=="function"&&c(this,u).destroy(),g(this,u,a),document.startViewTransition?await document.startViewTransition(async()=>{c(this,d).innerHTML=await a.render(),await a.afterRender()}):(c(this,d).innerHTML=await a.render(),await a.afterRender())}}d=new WeakMap,h=new WeakMap,l=new WeakMap,u=new WeakMap,v=new WeakSet,D=function(){c(this,h).addEventListener("click",()=>{c(this,l).classList.toggle("open")}),document.body.addEventListener("click",e=>{!c(this,l).contains(e.target)&&!c(this,h).contains(e.target)&&c(this,l).classList.remove("open"),c(this,l).querySelectorAll("a").forEach(t=>{t.contains(e.target)&&c(this,l).classList.remove("open")})})};document.addEventListener("DOMContentLoaded",async()=>{const n=new ie({content:document.querySelector("#main-content"),drawerButton:document.querySelector("#drawer-button"),navigationDrawer:document.querySelector("#navigation-drawer")});await n.renderPage();function e(){const s=localStorage.getItem("authToken"),f=document.getElementById("login-link"),w=document.getElementById("register-link"),b=document.getElementById("logout-button");s?(b&&(b.style.display="inline-block"),f&&(f.style.display="none"),w&&(w.style.display="none")):(b&&(b.style.display="none"),f&&(f.style.display="inline-block"),w&&(w.style.display="inline-block"))}const t=document.getElementById("logout-button");t&&t.addEventListener("click",()=>{localStorage.removeItem("authToken"),alert("Logout berhasil!"),window.location.hash="#/login",e()}),e(),window.addEventListener("hashchange",async()=>{await n.renderPage(),e()});const o=document.querySelector("#main-content"),i=document.querySelector(".skip-link");i&&o&&(o.hasAttribute("tabindex")||o.setAttribute("tabindex","-1"),i.addEventListener("click",function(s){s.preventDefault(),i.blur(),o.focus(),o.scrollIntoView()}));const a=document.getElementById("enable-notif-button"),r=document.getElementById("disable-notif-button"),m=document.getElementById("notification");let y=!1;function k(s){m&&(m.textContent=s,m.classList.remove("hidden"),setTimeout(()=>{m.classList.add("hidden")},3e3))}function S(){a&&r&&(a.classList.toggle("hidden",y),r.classList.toggle("hidden",!y))}a&&a.addEventListener("click",async()=>{try{await F(),await P(),y=!0,S(),k("Notifikasi diaktifkan!")}catch(s){console.error("Gagal mengaktifkan notifikasi",s),k("Gagal mengaktifkan notifikasi.")}}),r&&r.addEventListener("click",()=>{y=!1,S(),k("Notifikasi dimatikan!"),navigator.serviceWorker.ready.then(s=>s.pushManager.getSubscription()).then(s=>{if(s)return s.unsubscribe()}).then(()=>{console.log("❎ Berhasil unsubscribe push")}).catch(s=>{console.error("Gagal unsubscribe:",s)})}),S()});
