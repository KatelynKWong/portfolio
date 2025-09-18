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
  
        // Select logo inside the navbar
        const logo = navbar.querySelector('.logo');
        if (logo) {
          const path = window.location.pathname.replace(/\/$/, '');
          if (path === '' || path === '/index.html') {
            logo.classList.remove('show-logo'); // hide on home page
          } else {
            logo.classList.add('show-logo');    // show on other pages
          }
        }
      })
      .catch(err => console.error("Navbar load error:", err));
  
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
  