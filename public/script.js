document.addEventListener("DOMContentLoaded", () => {
    // Load navbar
    fetch("/nav.html")
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch nav.html");
        return res.text();
      })
      .then(data => {
        const navbar = document.getElementById("navbar");
        navbar.innerHTML = data;
  
        // Show/hide logo
        const logo = navbar.querySelector('.logo');
        if (logo) {
          const path = window.location.pathname.replace(/\/$/, '');
          if (path === '' || path === '/index.html') {
            logo.classList.remove('show-logo');
          } else {
            logo.classList.add('show-logo');
          }
        }
  
        // ---- ADD HAMBURGER LOGIC HERE ----
        const hamburger = navbar.querySelector("#hamburger");
        const navLinks = navbar.querySelector("#nav-links");
  
        if (hamburger && navLinks) {
            hamburger.addEventListener("click", () => {
                navLinks.classList.toggle("active"); // toggles open/close
              });
        }
      });
  
    // Load footer
    fetch("/footer.html")
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch footer.html");
        return res.text();
      })
      .then(data => {
        document.getElementById("footer").innerHTML = data;
      })
      .catch(err => console.error("Footer load error:", err));
  });
  