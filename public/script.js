document.addEventListener("DOMContentLoaded", () => {
    fetch("/nav.html")
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch nav.html");
        return res.text();
      })
      .then(data => {
        document.getElementById("navbar").innerHTML = data;
      })
      .catch(err => console.error("Navbar load error:", err));
  });
  