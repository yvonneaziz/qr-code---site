const form = document.getElementById("form");
const staffIdInput = document.getElementById("staffId");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const staffId = staffIdInput.value.trim();
  if (!staffId) return;

  fetch("https://script.google.com/macros/s/AKfycbzWZYOOmytoTUPj8gJaVFJuMU7VSwVhAGiqLk6Z_5yVmL0lQ20ruVEA0S3SpeM1ccJ6rA/exec", {
    method: "POST",
    body: JSON.stringify({ staffId: staffId })
  })
  .then(() => {
    window.location.href = "result.html?id=" + encodeURIComponent(staffId);
  })
  .catch(() => {
    alert("Error saving Staff ID");
  });
});
