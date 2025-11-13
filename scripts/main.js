const yearElement = document.getElementById("current-year");

if (yearElement) {
  const currentYear = new Date().getFullYear();
  yearElement.textContent = currentYear;
}

const form = document.querySelector(".contact-form");

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const emailInput = form.querySelector("input[type='email']");

    if (!emailInput) {
      return;
    }

    const email = emailInput.value.trim();

    if (email.length === 0) {
      alert("Please enter a valid email address before submitting.");
      emailInput.focus();
      return;
    }

    alert(`Thanks! We'll keep you posted at ${email}.`);
    form.reset();
  });
}
