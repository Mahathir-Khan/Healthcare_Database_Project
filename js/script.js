const smartChartData = {
  patients: [
    {
      id: "P1002457",
      name: "John Doe",
      dob: "2002-01-12",
      email: "john.doe@example.com",
      phone: "(555) 123-4567",
      address: "123 Elm Street",
      mrn: "1002457",
    },
    {
      id: "P1003188",
      name: "Sarah Khan",
      dob: "1998-09-22",
      email: "sarah.khan@example.com",
      phone: "(555) 222-9011",
      address: "44 Cedar Avenue",
      mrn: "1003188",
    },
    {
      id: "P1004092",
      name: "Michael Lee",
      dob: "1987-04-03",
      email: "michael.lee@example.com",
      phone: "(555) 811-3300",
      address: "9 Lake Road",
      mrn: "1004092",
    },
  ],
  providers: [
    { id: "D01", name: "Dr. Smith", specialty: "Primary Care" },
    { id: "D02", name: "Dr. Patel", specialty: "Oncology" },
    { id: "D03", name: "Dr. Kim", specialty: "Hematology" },
  ],
  appointments: [
    { patientId: "P1002457", date: "Apr 25, 2026", time: "9:00 AM", provider: "Dr. Smith", type: "Follow-up" },
    { patientId: "P1003188", date: "Apr 25, 2026", time: "11:30 AM", provider: "Dr. Patel", type: "New Visit" },
    { patientId: "P1004092", date: "Apr 26, 2026", time: "2:00 PM", provider: "Dr. Smith", type: "Consultation" },
  ],
  observations: [
    { patientId: "P1002457", encounter: "ENC-301", date: "Apr 25, 2026", code: "Blood Pressure", value: "118/76", unit: "mmHg" },
    { patientId: "P1002457", encounter: "ENC-301", date: "Apr 25, 2026", code: "Heart Rate", value: "76", unit: "bpm" },
    { patientId: "P1002457", encounter: "ENC-288", date: "Mar 18, 2026", code: "SpO2", value: "98", unit: "%" },
    { patientId: "P1003188", encounter: "ENC-312", date: "Apr 25, 2026", code: "Temperature", value: "99.1", unit: "F" },
    { patientId: "P1004092", encounter: "ENC-326", date: "Apr 26, 2026", code: "Pain", value: "3", unit: "0-10" },
  ],
  medications: {
    P1002457: [
      {
        name: "Warfarin",
        dosage: "5 mg",
        frequency: "Once daily",
        provider: "Dr. Smith",
        status: "Active",
        startDate: "2026-03-14",
      },
      {
        name: "Ondansetron",
        dosage: "4 mg",
        frequency: "As needed",
        provider: "Dr. Patel",
        status: "Completed",
        startDate: "2026-02-18",
      },
    ],
    P1003188: [
      {
        name: "Imatinib",
        dosage: "400 mg",
        frequency: "Once daily",
        provider: "Dr. Patel",
        status: "Active",
        startDate: "2026-01-20",
      },
    ],
    P1004092: [
      {
        name: "Prednisone",
        dosage: "10 mg",
        frequency: "Twice daily",
        provider: "Dr. Kim",
        status: "Active",
        startDate: "2026-04-01",
      },
    ],
  },
  interactions: {
    "Aspirin|Warfarin": "Aspirin may increase bleeding risk for patients currently taking Warfarin.",
    "Imatinib|Ondansetron": "Imatinib and Ondansetron may increase QT prolongation risk.",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const role = params.get("role") || "patient";
  const patientId = params.get("patientId") || smartChartData.patients[0].id;

  wireLogin();
  updateNavigation(role, patientId);
  fillPatientSelects(patientId);
  applyRoleVisibility(role);
  renderDashboardPatient(patientId);
  renderAppointments(role, patientId);
  renderObservations(role, patientId);
  renderMedicationList(patientId);
  renderProfile(role, patientId);
  wireAppointmentRequest();
  wireObservationForm();
  wirePrescriptionSafetyCheck(patientId);
  wirePatientContext(role, patientId);
  wireGenericForms();
});

function wireLogin() {
  const loginForm = document.getElementById("login-form");

  if (!loginForm) return;

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const role = document.getElementById("role").value;

    if (role === "patient") {
      window.location.href = "pages/patient.html?role=patient";
    } else if (role === "provider") {
      window.location.href = "pages/provider.html?role=provider";
    } else {
      window.location.href = "pages/provider.html?role=admin";
    }
  });
}

function updateNavigation(role, patientId) {
  const dashboardLink = document.getElementById("dashboard-link");
  const roleQuery = `role=${role}&patientId=${patientId}`;

  if (dashboardLink) {
    dashboardLink.href =
      role === "patient"
        ? `patient.html?${roleQuery}`
        : `provider.html?${roleQuery}`;
  }

  setHref("appointments-link", `appointments.html?${roleQuery}`);
  setHref("profile-link", `profile.html?${roleQuery}`);
  setHref("flowsheets-link", `flowsheets.html?${roleQuery}`);
  setHref("messages-link", `messages.html?${roleQuery}`);
}

function setHref(id, href) {
  const link = document.getElementById(id);
  if (link) link.href = href;
}

function applyRoleVisibility(role) {
  document.querySelectorAll(".patient-only").forEach((item) => {
    item.hidden = role !== "patient";
  });

  document.querySelectorAll(".provider-only").forEach((item) => {
    item.hidden = role === "patient";
  });
}

function fillPatientSelects(selectedPatientId) {
  document.querySelectorAll("[data-patient-select]").forEach((select) => {
    select.innerHTML = smartChartData.patients
      .map((patient) => `<option value="${patient.id}">${patient.name} (${patient.mrn})</option>`)
      .join("");
    select.value = selectedPatientId;
  });
}

function wirePatientContext(role, patientId) {
  const activePatient = document.getElementById("active-patient");
  const prescriptionPatient = document.getElementById("prescription-patient");

  if (activePatient) {
    activePatient.value = patientId;
    activePatient.addEventListener("change", () => {
      window.location.href = `provider.html?role=${role}&patientId=${activePatient.value}`;
    });
  }

  if (prescriptionPatient) {
    prescriptionPatient.value = patientId;
    prescriptionPatient.addEventListener("change", () => {
      renderMedicationList(prescriptionPatient.value);
    });
  }
}

function renderDashboardPatient(patientId) {
  const patient = getPatient(patientId);
  if (!patient) return;

  setText("dashboard-patient-name", patient.name);
  setText("dashboard-email", patient.email);
  setText("dashboard-phone", patient.phone);
  setText("dashboard-dob", patient.dob);
  setText("dashboard-mrn", patient.mrn);
  setText("dashboard-address", patient.address);
}

function renderAppointments(role, patientId) {
  const table = document.getElementById("appointments-table");
  if (!table) return;

  const patientFilter = document.getElementById("appointment-patient-filter");
  const visiblePatientId =
    role === "patient" ? patientId : patientFilter?.value || patientId;
  const rows = smartChartData.appointments.filter(
    (appointment) => appointment.patientId === visiblePatientId
  );

  setText(
    "appointments-heading",
    role === "patient" ? "My Appointments" : "Patient Appointments"
  );

  table.innerHTML = rows
    .map((appointment) => {
      const patient = getPatient(appointment.patientId);
      return `<tr>
        <td>${appointment.date}</td>
        <td>${appointment.time}</td>
        <td>${patient.name}</td>
        <td>${appointment.provider}</td>
        <td>${appointment.type}</td>
      </tr>`;
    })
    .join("");

  if (patientFilter) {
    patientFilter.addEventListener("change", () => renderAppointments(role, patientId));
  }
}

function renderObservations(role, patientId) {
  const table = document.getElementById("observations-table");
  if (!table) return;

  const patientFilter = document.getElementById("flowsheet-patient-filter");
  const visiblePatientId =
    role === "patient" ? patientId : patientFilter?.value || patientId;
  const rows = smartChartData.observations.filter(
    (observation) => observation.patientId === visiblePatientId
  );

  setText(
    "flowsheets-heading",
    role === "patient" ? "My Flowsheet Values" : "Patient Flowsheet Values"
  );

  table.innerHTML = rows
    .map(
      (observation) => `<tr>
        <td>${observation.encounter}</td>
        <td>${observation.date}</td>
        <td>${observation.code}</td>
        <td>${observation.value}</td>
        <td>${observation.unit}</td>
      </tr>`
    )
    .join("");

  if (patientFilter) {
    patientFilter.addEventListener("change", () => renderObservations(role, patientId));
  }
}

function renderMedicationList(patientId) {
  const table = document.getElementById("medication-list");
  if (!table) return;

  const prescriptionPatient = document.getElementById("prescription-patient");
  const visiblePatientId = prescriptionPatient?.value || patientId;
  const meds = smartChartData.medications[visiblePatientId] || [];

  if (meds.length === 0) {
    table.innerHTML = `<tr><td colspan="5">No medications on file.</td></tr>`;
    return;
  }

  table.innerHTML = meds
    .map(
      (med) => `<tr>
        <td>${med.name}</td>
        <td>${med.dosage}</td>
        <td>${med.frequency}</td>
        <td>${med.provider}</td>
        <td>${med.status}</td>
      </tr>`
    )
    .join("");
}

function renderProfile(role, patientId) {
  const name = document.getElementById("profile-name");
  if (!name) return;

  if (role === "patient") {
    const patient = getPatient(patientId);
    setText("profile-name", patient.name);
    setText("profile-role", "Patient");
    setText("profile-access", "Self-service, own record only");
    setText("profile-summary", "Personal details for the signed-in patient.");
    setText("profile-avatar", "▣");
    setInput("profile-member-id", patient.mrn);
    setInput("profile-email", patient.email);
    setInput("profile-phone", patient.phone);
  } else {
    setText("profile-name", role === "admin" ? "Admin Staff" : "Dr. James Smith");
    setText("profile-role", role === "admin" ? "Administrative User" : "Primary Care Provider");
    setText("profile-access", role === "admin" ? "Tier 3, account management" : "Tier 2, assigned patient care");
    setText("profile-summary", "Healthcare staff profile and account details.");
    setText("profile-avatar", role === "admin" ? "▤" : "◌");
    setInput("profile-member-id", role === "admin" ? "STAFF-9001" : "MD-10452");
    setInput("profile-email", role === "admin" ? "admin@smartchart.org" : "jsmith@smartchart.org");
    setInput("profile-phone", "(555) 700-1100");
  }
}

function wireAppointmentRequest() {
  const specialty = document.getElementById("appointment-specialty");
  const provider = document.getElementById("appointment-provider");
  const form = document.getElementById("appointment-request-form");
  const status = document.getElementById("appointment-request-status");

  if (!specialty || !provider || !form) return;

  const fillProviders = () => {
    provider.innerHTML = smartChartData.providers
      .filter((item) => item.specialty === specialty.value)
      .map((item) => `<option value="${item.id}">${item.name}</option>`)
      .join("");
  };

  specialty.addEventListener("change", fillProviders);
  fillProviders();

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const selectedProvider = smartChartData.providers.find(
      (item) => item.id === provider.value
    );
    status.textContent = `Appointment request sent to ${selectedProvider.name}.`;
  });
}

function wireObservationForm() {
  const form = document.getElementById("observation-form");
  const status = document.getElementById("observation-status");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    status.textContent = "Observation captured locally for Task B prototype.";
  });
}

function wirePrescriptionSafetyCheck(defaultPatientId) {
  const submit = document.getElementById("prescription-submit");
  const warning = document.getElementById("interaction-warning");
  if (!submit || !warning) return;

  const form = document.getElementById("prescription-form");
  const prescriptionPatient = document.getElementById("prescription-patient");
  const medication = document.getElementById("medication");
  const dosage = document.getElementById("dosage");
  const frequency = document.getElementById("frequency");
  const status = document.getElementById("status");
  const startDate = document.getElementById("start-date");
  const prescriptionStatus = document.getElementById("prescription-status");
  const message = document.getElementById("interaction-message");
  const revise = document.getElementById("revise-prescription");
  const override = document.getElementById("override-prescription");

  const savePrescription = (overrideWarning = false) => {
    const targetPatientId = prescriptionPatient?.value || defaultPatientId;
    const patient = getPatient(targetPatientId);
    const newMedication = {
      name: medication.value,
      dosage: dosage.value || "Not specified",
      frequency: frequency.value || "Not specified",
      provider: "Dr. James Smith",
      status: status.value,
      startDate: startDate.value || "Pending",
    };

    smartChartData.medications[targetPatientId] =
      smartChartData.medications[targetPatientId] || [];
    smartChartData.medications[targetPatientId].push(newMedication);
    warning.classList.add("hidden");
    renderMedicationList(targetPatientId);
    prescriptionStatus.textContent = overrideWarning
      ? `Prescription added for ${patient.name} with provider override recorded.`
      : `Prescription added for ${patient.name}.`;
    form.reset();
    if (prescriptionPatient) prescriptionPatient.value = targetPatientId;
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const targetPatientId = prescriptionPatient?.value || defaultPatientId;
    const interaction = findInteraction(targetPatientId, medication.value);

    if (interaction) {
      message.textContent = interaction;
      warning.classList.remove("hidden");
    } else {
      savePrescription(false);
    }
  });

  revise.addEventListener("click", () => {
    warning.classList.add("hidden");
    medication.focus();
  });

  override.addEventListener("click", () => {
    savePrescription(true);
  });
}

function findInteraction(patientId, newMedication) {
  const active = (smartChartData.medications[patientId] || [])
    .filter((med) => med.status === "Active")
    .map((med) => med.name);

  for (const current of active) {
    const keys = [`${current}|${newMedication}`, `${newMedication}|${current}`];
    const found = keys.find((key) => smartChartData.interactions[key]);
    if (found) return smartChartData.interactions[found];
  }

  return "";
}

function wireGenericForms() {
  document.querySelectorAll("form[data-message]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const message = form.dataset.message || "Form submitted.";
      alert(message);
    });
  });
}

function getPatient(patientId) {
  return smartChartData.patients.find((patient) => patient.id === patientId) || smartChartData.patients[0];
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function setInput(id, value) {
  const element = document.getElementById(id);
  if (element) element.value = value;
}
