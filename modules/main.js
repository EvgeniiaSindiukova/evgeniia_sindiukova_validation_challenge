import {
  validatingCardNumber,
  validatingCardHolder,
  validatingExpirationDate,
  validatingCVV,
} from "./validation.js";
import { sendCardData } from "./api.js";

// Get form values
const form = document.querySelector(".card-form");
const cardNumber = document.querySelector("#card-number");
const cardHolder = document.querySelector("#card-holder");
const cardHolderDisplay = document.querySelector(".card-holder-display");
const cardMonth = document.querySelector("#expiration-month");
const cardYear = document.querySelector("#expiration-year");
const dateContainer = document.querySelector(".dropdown-container");
const cardCVV = document.querySelector("#cvv");
const iframeContainer = document.querySelector(".iframe-container");
const iframe = document.querySelector("#iframe");

// Don't allow alphabetic characters when users type in a card number input
cardNumber.addEventListener("input", function (e) {
  e.target.value = e.target.value.replace(/[^0-9]/g, "");
});

// Display name on a card
// Don't allow digits when users type in a cardholder input
cardHolder.addEventListener("input", function (e) {
  e.target.value = e.target.value.replace(/[0-9]/, "");
  cardHolderDisplay.textContent = cardHolder.value || "";
});

// Don't allow alphabetic characters when users type in a CVV input
cardCVV.addEventListener("input", function (e) {
  e.target.value = e.target.value.replace(/[^0-9]/g, "");
});

// Load month and year options
window.addEventListener("load", function () {
  const monthsName = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const months = monthsName.map((month, i) => ({
    value: (i + 1).toString().padStart(2, "0"),
    month,
  }));

  months.forEach((month) => {
    const option = document.createElement("option");
    option.value = month.value;
    option.textContent = month.month;
    cardMonth.appendChild(option);
  });

  const currentYear = new Date().getFullYear();

  for (let i = 0; i < 7; i++) {
    const year = currentYear + i;
    const option = document.createElement("option");
    option.value = year;
    option.textContent = year;
    cardYear.appendChild(option);
  }

  iframeContainer.style.display = "none";
});

// Form validation on blur to improve user experience
const inputs = [cardNumber, cardHolder, cardMonth, cardYear, cardCVV];

inputs.forEach((input) => {
  input.addEventListener("blur", function () {
    if (input.id === "card-number")
      validatingCardNumber(cardNumber, cardNumber.value);
    if (input.id === "card-holder")
      validatingCardHolder(cardHolder, cardHolder.value);
    if (input.id === "expiration-month" || input.id === "expiration-year")
      validatingExpirationDate(dateContainer, cardMonth.value, cardYear.value);
    if (input.id === "cvv") validatingCVV(cardCVV, cardCVV.value);
  });
});

// Form validation on submit
form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const cardData = {
    cardNumber: cardNumber.value,
    cardHolder: cardHolder.value,
    expirationMonth: cardMonth.value,
    expirationYear: cardYear.value
  };

  const cardNumberValid = validatingCardNumber(cardNumber, cardNumber.value);
  const cardHolderValid = validatingCardHolder(cardHolder, cardHolder.value);
  const cardDateValid = validatingExpirationDate(
    dateContainer,
    cardMonth.value,
    cardYear.value
  );
  const cardCVVValid = validatingCVV(cardCVV, cardCVV.value);
  const isValid =
    cardNumberValid && cardHolderValid && cardDateValid && cardCVVValid;

  if (isValid) {
    const data = await sendCardData(cardData);
    iframeContainer.style.display = "block";
    iframe.contentWindow.postMessage(data, "*");
  } else {
    console.log("Form is not correct");
  }
});

// Close Iframe
window.addEventListener("message", function (e) {
  if (e.origin !== "http://localhost:3000") {
    console.error("Untrusted origin:", e.origin);
    return;
  }

  if (e.data.action === "closeIframe") {
    iframeContainer.style.display = "none";
    iframe.contentWindow.document.querySelector(".thank-you-msg").textContent =
      "";
  }
});
