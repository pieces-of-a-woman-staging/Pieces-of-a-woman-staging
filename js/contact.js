/* Prepare an email draft; sending remains an explicit action in the visitor's email app. */
(() => {
  "use strict";
  const form = document.querySelector("[data-contact-form]");
  const status = document.querySelector("[data-contact-status]");
  if (!form || !status) return;
  form.hidden = false;
  form.addEventListener("submit", event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();
    if (!name || !email || !message) {
      status.textContent = "Please complete your name, email, and message.";
      return;
    }
    const subject = encodeURIComponent("Pieces Of A Woman Inquiry");
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    const destination = `mailto:info@piecesofawoman.org?subject=${subject}&body=${body}`;
    const fallback = document.querySelector("[data-contact-fallback]");
    if (fallback) fallback.href = destination;
    status.textContent = "Your email draft is ready. Complete sending in your email app. If it did not open, use the email link below.";
    window.location.href = destination;
  });
})();
