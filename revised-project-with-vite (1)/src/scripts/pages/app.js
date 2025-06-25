import routes from "../routes/routes";
import { getActiveRoute } from "../routes/url-parser";

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;

  
  #currentPage = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this.#setupDrawer();
  }

  #setupDrawer() {
    this.#drawerButton.addEventListener("click", () => {
      this.#navigationDrawer.classList.toggle("open");
    });

    document.body.addEventListener("click", (event) => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove("open");
      }

      this.#navigationDrawer.querySelectorAll("a").forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove("open");
        }
      });
    });
  }

  async renderPage() {
    const url = getActiveRoute();
    const isLoggedIn = !!localStorage.getItem("authToken");

    const protectedRoutes = [
      "/home",
      "/add-new-story",
      "/list-story",
      "/detail/:id",
    ];

    const needsAuth = protectedRoutes.some((route) =>
      route.includes(":")
        ? url.startsWith(route.split("/:")[0])
        : url === route
    );

    if (needsAuth && !isLoggedIn) {
      window.location.hash = "#/login";
      return;
    }

    const page = routes[url];
    if (!page) {
      this.#content.innerHTML = "<p>Halaman tidak ditemukan.</p>";
      return;
    }

    
    if (this.#currentPage && typeof this.#currentPage.destroy === "function") {
      this.#currentPage.destroy();
    }

    this.#currentPage = page;

    if (document.startViewTransition) {
      await document.startViewTransition(async () => {
        this.#content.innerHTML = await page.render();
        await page.afterRender();
      });
    } else {
      this.#content.innerHTML = await page.render();
      await page.afterRender();
    }
  }
}

export default App;
