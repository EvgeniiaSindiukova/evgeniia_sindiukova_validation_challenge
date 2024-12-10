// Helper functions

// Empty string validation
const isEmptyValue = function (value) {
  return value === "";
};

// Custom error message
const errorMessage = function (input, message) {
  const errMessage = input.parentElement.querySelector(".error-msg");
  if (errMessage) {
    errMessage.remove();
    input.classList.remove("error-input");
  }

  if (message) {
    const msg = document.createElement("span");
    msg.className = "error-msg";
    msg.textContent = message;
    input.classList.add("error-input");
    input.parentElement.appendChild(msg);
  }
};

export { isEmptyValue, errorMessage };
