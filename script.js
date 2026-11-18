// 1. Sample patient and appointment data for this frontend demo.
// A real hospital application would load and save this information in a secure database.
const patients = [
  { id: 101, name: "Aarav Mehta", age: 28, gender: "Male", initials: "AM" },
  { id: 102, name: "Ananya Sharma", age: 34, gender: "Female", initials: "AS" },
  { id: 103, name: "Rohan Verma", age: 45, gender: "Male", initials: "RV" },
  { id: 104, name: "Priya Singh", age: 22, gender: "Female", initials: "PS" },
  { id: 105, name: "Kabir Joshi", age: 51, gender: "Male", initials: "KJ" },
  { id: 106, name: "Meera Gupta", age: 39, gender: "Female", initials: "MG" }
];

let appointments = [
  { id: 1, patient: "Aarav Mehta", initials: "AM", doctor: "Dr. Riya Sharma", department: "Cardiology", date: "2026-11-18", time: "09:30", status: "Confirmed" },
  { id: 2, patient: "Ananya Sharma", initials: "AS", doctor: "Dr. Arjun Mehta", department: "Neurology", date: "2026-11-18", time: "10:00", status: "Waiting" },
  { id: 3, patient: "Rohan Verma", initials: "RV", doctor: "Dr. Priya Kapoor", department: "Orthopedics", date: "2026-11-18", time: "10:30", status: "Completed" },
  { id: 4, patient: "Priya Singh", initials: "PS", doctor: "Dr. Kabir Singh", department: "General", date: "2026-11-18", time: "11:00", status: "Confirmed" }
];

// 2. Get references to HTML elements that JavaScript will update.
const appointmentRows = document.getElementById("appointmentRows");
const statusFilter = document.getElementById("statusFilter");
const patientGrid = document.getElementById("patientGrid");
const patientSearch = document.getElementById("patientSearch");
const modal = document.getElementById("appointmentModal");
const appointmentForm = document.getElementById("appointmentForm");

// 3. Convert a date string into a more readable date.
function formatDate(dateString) {
  return new Date(dateString + "T00:00:00").toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric"
  });
}

// 4. Display appointments and apply the selected status filter.
function displayAppointments() {
  const selectedStatus = statusFilter.value;

  const filtered = appointments.filter(appointment =>
    selectedStatus === "All" || appointment.status === selectedStatus
  );

  // Create one table row for each appointment that matches the filter.
  appointmentRows.innerHTML = filtered.map(appointment => `
    <tr>
      <td><div class="patient-cell"><span class="mini-avatar">${appointment.initials}</span>${appointment.patient}</div></td>
      <td>${appointment.doctor}</td>
      <td>${appointment.department}</td>
      <td>${formatDate(appointment.date)} · ${appointment.time}</td>
      <td><span class="status ${appointment.status.toLowerCase()}">${appointment.status}</span></td>
    </tr>
  `).join("");

  document.getElementById("appointmentCount").textContent =
    `Showing ${filtered.length} of ${appointments.length} appointments`;
}

// 5. Search patients by name or patient ID and refresh the directory.
function displayPatients() {
  const term = patientSearch.value.trim().toLowerCase();

  const filtered = patients.filter(patient =>
    patient.name.toLowerCase().includes(term) || String(patient.id).includes(term)
  );

  patientGrid.innerHTML = filtered.length
    ? filtered.map(patient => `
      <div class="patient-item">
        <span class="mini-avatar">${patient.initials}</span>
        <div><strong>${patient.name}</strong><small>ID: ${patient.id} · ${patient.age} years · ${patient.gender}</small></div>
      </div>
    `).join("")
    : "<p>No matching patients found.</p>";
}

// 6. Update the number counters shown in the summary cards.
function updateStatistics() {
  document.getElementById("totalPatients").textContent = patients.length;
  document.getElementById("totalAppointments").textContent = appointments.length;

  const waiting = appointments.filter(item => item.status === "Waiting").length;
  document.getElementById("waitingPatients").textContent = waiting;
}

// 7. Open and close the appointment pop-up form.
document.getElementById("openModal").addEventListener("click", () => {
  modal.classList.remove("hidden");
});

document.getElementById("closeModal").addEventListener("click", () => {
  modal.classList.add("hidden");
});

// Also close the pop-up if the user clicks outside the form card.
modal.addEventListener("click", event => {
  if (event.target === modal) modal.classList.add("hidden");
});

// 8. Read form data and add a new appointment to the list.
appointmentForm.addEventListener("submit", event => {
  event.preventDefault(); // Stop the browser from refreshing the page.

  const data = new FormData(appointmentForm);
  const patientName = data.get("patient").trim();
  const initials = patientName.split(/\s+/).map(word => word[0]).join("").slice(0, 2).toUpperCase();

  const newAppointment = {
    id: Date.now(),
    patient: patientName,
    initials: initials,
    doctor: data.get("doctor"),
    department: data.get("department"),
    date: data.get("date"),
    time: data.get("time"),
    status: "Confirmed"
  };

  // Add the new appointment at the beginning so it appears at the top.
  appointments.unshift(newAppointment);

  // Add the patient to the directory if they are not already registered.
  const exists = patients.some(patient => patient.name.toLowerCase() === patientName.toLowerCase());
  if (!exists) {
    patients.push({
      id: 100 + patients.length + 1,
      name: patientName,
      age: "—",
      gender: "Not specified",
      initials: initials
    });
  }

  // Refresh the page sections after saving the appointment.
  statusFilter.value = "All";
  displayAppointments();
  displayPatients();
  updateStatistics();
  appointmentForm.reset();
  modal.classList.add("hidden");
});

// 9. Listen for user input in the filter and patient search controls.
statusFilter.addEventListener("change", displayAppointments);
patientSearch.addEventListener("input", displayPatients);

// 10. Show today's date and prevent selecting a past appointment date.
const today = new Date();
document.getElementById("todayDate").textContent = today.toLocaleDateString("en-IN", {
  weekday: "short", day: "2-digit", month: "short", year: "numeric"
});

const localDate = [
  today.getFullYear(),
  String(today.getMonth() + 1).padStart(2, "0"),
  String(today.getDate()).padStart(2, "0")
].join("-");
document.getElementById("appointmentDate").min = localDate;

// 11. Run these functions once when the dashboard first loads.
displayAppointments();
displayPatients();
updateStatistics();
