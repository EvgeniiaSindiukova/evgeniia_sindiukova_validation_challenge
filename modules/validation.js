import { isEmptyValue, errorMessage } from "./helpers.js";

// Validation functions

// 1. Card number validation using Luhn Algorithm
// - Converting card input (a string) into an array of numbers
// - Creating new array with each digit backwards (rightmost digit)
// - If the even number double it, if odd return as it is
// - If the double digit > 9, substruct 9
// - Calculate total array sum
// - If sum divisible by 0, credit card number is valid

const validatingCardNumber = function (input, number) {
  if (isEmptyValue(number)) {
    errorMessage(input, "Card number cannot be empty!");
    return false;
  }

  const numbers = [...number].map(Number);

  const transformedArray = numbers.reverse().map((num, i) => {
    if ((i + 1) % 2 === 0) {
      const doubledDigits = num * 2;
      return doubledDigits > 9 ? doubledDigits - 9 : doubledDigits;
    } else {
      return num;
    }
  });

  const totalSum = transformedArray.reduce((acc, curr) => acc + curr, 0);

  if (totalSum % 10 !== 0) {
    errorMessage(input, "Card number is not valid!");
    return false;
  }

  errorMessage(input, "");
  return true;
};

// 2.Validating cardholder name
// - Trim extra space
// - Use regex to allow only alphabetic characters, spaces, hyphens and apostrophes
// - Check name's length

const validatingCardHolder = function (input, name) {
  if (isEmptyValue(name)) {
    errorMessage(input, "Card holder name cannot be empty!");
    return false;
  }

  const trimName = name.trim();
  const isValidatedCharacters = /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/.test(trimName);
  const isValidatedLength = trimName.length >= 2 && trimName.length <= 40;

  if (!isValidatedCharacters || !isValidatedLength) {
    errorMessage(input, "Card holder name is not valid!");
    return false;
  }

  errorMessage(input, "");
  return true;
};

// 3. Validating expiration date
// - Combine year and month for better (dry) logic
// - Get current year and month, if a month is one digit add 0 in front for correct comparison
// - If selected date >= current date, date is valid. Otherwise, return error.

const validatingExpirationDate = function (input, month, year) {
  if (isEmptyValue(month) || isEmptyValue(year)) {
    errorMessage(input, "Expiration date cannot be empty!");
    return false;
  }

  const combinedYearMonth = `${year}${month}`;
  const currentYear = new Date().getFullYear();
  const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, "0");

  const combinedCurrYearMonth = `${currentYear}${currentMonth}`;

  if (combinedYearMonth < combinedCurrYearMonth) {
    errorMessage(input, "Expiration date is not valid!");
    return false;
  }
  errorMessage(input, "");
  return true;
};

// 4. Validating CVV
// - Trim extra space
// - Apply regex validation logic

const validatingCVV = function (input, cvv) {
  if (isEmptyValue(cvv)) {
    errorMessage(input, "CVV cannot be empty!");
    return false;
  }
  const trimCVV = cvv.trim();

  if (!/^\d{3}$/.test(trimCVV)) {
    errorMessage(input, "CVV is not valid!");
    return false;
  }
  errorMessage(input, "");
  return true;
};

export {
  validatingCardNumber,
  validatingCardHolder,
  validatingExpirationDate,
  validatingCVV,
};
