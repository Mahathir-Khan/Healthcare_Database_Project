document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const role = document.getElementById("role").value;

      if (role === "patient") {
        window.location.href = "patient.html?role=patient";
      } else if (role === "provider") {
        window.location.href = "provider.html?role=provider";
      }
    });
  }

  const params = new URLSearchParams(window.location.search);
  const role = params.get("role") || "patient";

  const dashboardLink = document.getElementById("dashboard-link");
  if (dashboardLink) {
    dashboardLink.href =
      role === "provider"
        ? "provider.html?role=provider"
        : "patient.html?role=patient";
  }

  const appointmentsLink = document.getElementById("appointments-link");
  if (appointmentsLink) {
    appointmentsLink.href = `appointments.html?role=${role}`;
  }

  const profileLink = document.getElementById("profile-link");
  if (profileLink) {
    profileLink.href = `profile.html?role=${role}`;
  }

  const flowsheetsLink = document.getElementById("flowsheets-link");
  if (flowsheetsLink) {
    flowsheetsLink.href = `flowsheets.html?role=${role}`;
  }

  const messagesLink = document.getElementById("messages-link");
  if (messagesLink) {
    messagesLink.href = `messages.html?role=${role}`;
  }

  const settingsLink = document.getElementById("settings-link");
  if (settingsLink) {
    settingsLink.href = `settings.html?role=${role}`;
  }

  document.querySelectorAll("form[data-message]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const message = form.dataset.message || "Form submitted.";
      alert(message);
    });
  });
});
