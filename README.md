To run  project please follow this steps: 

1. Install json-server: npm i -g json-server
2. Start the server: json-server --watch db.json --static ./ --port 3000

Task 1: Network Debugging:

When testing my credit card form, I encountered an issue with form submission. After validating the inputs, I wanted to store the data locally for testing purposes and send a cross-window message to confirm successful submission. However, when submitting the form, the user data would briefly appear in the network traffic and console but then disappear. 

It took me some time to identify the issue in my code, but here is my solution:

1. I opened the browser Developer Tools. When testing in a browser or debugging, I prefer Firefox over Chrome. I checked the Console tab for any errors but found none, which made the issue more challenging to debug. I navigated to the Network tab to see HTTP requests. 

2. I submitted the form and looked into my requests. I was specifically looking at the request related to the /cards endpoint, so I filtered the logs to only show me this endpoint. The request returned a 201 status code, which made sense because my API was configured to handle POST requests. My fetch call was working, but I still didn't get my data, and my iframe didn't appear.

3. I selected a specific POST request and reviewed its details. I saw that the promise was fulfilled, and I got a response from the server. The request originated from http://127.0.0.1:5500, which was set up for my front-end.

4. Next, I opened the Sources tab and located the files handling submission logic (main.js) and API (api.js). I set a few breakpoints on the fetch function to pause execution during the submission. I placed breakpoints on a submission function as well. Breakpoints also showed that my promise was fullfilled and the data was sent.

5. I switched to the Console and saw a brief message: Error sending data: Network error when attempting to fetch resource.

6. I tried to make sure that my logic worked properly by investigating potential conflicts. At first, I thought, that e.prevenDafault() might conflict with async/await calls, I tried to use a different method than/catch for handling promises, but the issue persisted. 

7. I revisited my networking tab and checked headers more carefully. I looked at my request more carefully and realized that it was coming from http://127.0.0.1:5500/, but my server was hosted at http://localhost:3000/. So the error was related to CORS, preventing the browser from allowing the request to succeed. 

I updated the service configurations and ensured that front-end and back-end origins matched. I made a JSON server to serve the front-end on http://localhost:3000/. I restarted my server and resubmitted my form and it worked.


Task 2: Form Validation (JavaScript):

To ensure data integrity and security when handling payment details, I used the following steps: 

1. I implemented custom validation for form fields: card number, cardholder name, expiration date, and CVV. Validation function file (modules/validation.js). 

Credit Card Validation: 

- Used the Luhn algorithm to validate the credit card number format. It checks whether the entered number is structurally valid by performing mathematical calculations.

- Allowed only digits to be typed.

Cardholder Name Validation: 

- Allowed only alphabetic characters, spaces, hyphens, and apostrophes using regex.

- Set up a length restriction (no less than 2 characters && no more than 40 characters).

Expiration Date Validation: 

- Validated the expiration date to ensure it is equal to a current month and year or greater than the current month and year. Combined month and year together for better logic and functional implementation. 

CVV Validation: 

- Ensured the CVV is exactly 3 digits long using regex.

2. Used real-time validation triggered on input blur and submit events to improve user experience. 

3. Created Custom Error Message function which fires when validation functions fail. File route: modules/helpers.js

4. Empty String Error validation. Implemented the logic that if any input value is empty, the validation will fail and the form is not gonna be submitted. 

5. Submitted data on a local server using fetch and async/await. Implemented appropriate headers and error handling. File route: modules/api.js

6. By using Iframe send cross-window messaging, which activates an alert window with an acknowledgment message. Can be found: modules/main.js, modules/confirmation.js. 


Thought Process: 

When I was implementing my logic, I was thinking about the validation I would expect to see when filling out card information. For example, inputs cannot be empty, so I needed to create an error handler to prevent empty inputs and notify the user. I also wanted to implement custom validation and include the best coding practices. For every input, I created a validation function and wrapped my input value with it. During my research, I found that for credit card validation, I could use the Luhn Algorithm to determine if the credit card number was valid. In my functions, I tried to use the best ES6 practices, such as map, reduce, and destructuring, to make my code DRY, easy to read, and follow standards.

When it came to typing the card number, I didn’t want to allow users to type alphabetical values, only digits. To achieve this, I implemented an event handler on the input to restrict such entries. Then, I moved on to the cardholder name. I wanted to trim all the spaces the user might accidentally type, as I think it’s the best practice to do so. I also implemented validation to allow only alphabetic characters, spaces, hyphens, and apostrophes using regex. The length of the cardholder's name could not be less than two characters or more than 40 characters. Additionally, I implemented an event handler on the input to restrict users from typing any digits in the cardholder name field.

Then I moved on to expiration date validation. I decided to combine the month and year values and compare them with the current year and month. I thought this approach was much easier and required less implementation logic than first comparing the year and then checking the month if the years matched. If the selected date is greater than or equal to the current date, the expiration date is considered valid.

For CVV validation, I trimmed all spaces and used regex to ensure the user entered only three digits. Additionally, I implemented an input handler to prevent users from typing any alphabetic characters, ensuring the field accepted only numeric values.

When I finished implementing validation for each input, I noticed that my code was becoming larger and harder to navigate. To address this, I transformed my script into modules by using type="module" in my HTML file. This allowed me to separate my validation functions into a dedicated file, making the main script more organized and easier to manage.

Additionally, I created helper functions, such as one to check if a string is empty. I also implemented a custom error message handler that would insert specific error messages when an input failed validation. These changes improved the overall structure and maintainability of my code. 

Then I moved on to the full implementation of my CSS. Initially, I had implemented HTML with a simple form to write and test my validation, but now I wanted to create something beautiful and user-friendly. I started thinking about my bank, CIBC, and how I got my first CIBC card when I came to Canada. It was a credit card with a limit of $500. Inspired by this, I decided to create something distinctly Canadian and aimed to replicate my bank's style.

I visited the CIBC website to analyze their main colors and design elements. I listed the key colors in a palette at the top of my CSS file and used them throughout my design. My goal was to replicate the clean and professional design of their forms while keeping it user-friendly. Once I was satisfied with the design, I started considering how the inputs should behave during validation—what messages users would receive when validation failed, what colors would convey errors effectively, and how the inputs would highlight to guide the user. 

I decided that for validation failures, I would use a bright red color, #c41f3e, which would effectively draw attention to errors. To test if my validation was working, I used the submit event. All my validation functions returned boolean values, and I passed the corresponding input values as parameters. I ensured that every input needed to pass validation before the form could be submitted. If any input failed validation, my custom error handler would display appropriate error messages.

However, I found it frustrating that I always had to click the submit button to see if I had made any errors. To address this, I decided to implement an onblur event. This allowed the form to validate an input when the user focused on it and then exited the field. If the input was empty, contained invalid characters, or didn’t pass validation, it would immediately display an error. This significantly improved the user experience by providing real-time feedback and reducing frustration.

Then I encountered another issue. I had a select dropdown for months and years, but manually writing down all the months and years felt like a waste of time and not the best practice. To address this, I decided to use the onload event to programmatically generate the options for both months and years. When the page loads, the script dynamically creates and appends the month and year options to the select dropdowns. This approach saved time, reduced redundancy, and ensured my code remained efficient and maintainable.

The final step I wanted to implement was saving my data and sending an acknowledgment message indicating that the submission was successful. I decided to save all the information on a test server using the POST method. However, I want to clarify that this is not a best practice for handling sensitive information. CVV codes and card numbers should not be stored or transmitted as plain data; they are better handled securely on the server side to ensure compliance with security standards.

For testing purposes, I decided to save everything in a local file using json-server. To run the server you need install it: npm i -g json-server, then go to a project directory and run: json-server --watch db.json --static ./ --port 3000. This allowed me to store validated form information in a db.json file, I didn't include CVV in my POST request. I created a new API function using async/await and fetch to handle the data submission. I used the POST method, declared my headers with the appropriate content type, and passed the cardData as a parameter. Finally, I called this function within the submit event, ensuring the data was saved after passing all validations. This setup allowed me to simulate server interactions and test the process effectively.

After that, I encountered an error I described in task 1 :). Once everything was fixed, I decided to implement an iframe to send a message where I would pass the cardholder's name and say, "Thank you for your submission. We received your info." To be honest, I had never implemented iframes in JavaScript before, so I did some research before implementing it. I referred to a few resources: https://developer.mozilla.org/en-US/docs/Web/API/Channel_Messaging_API and https://javascriptbit.com/transfer-data-between-parent-window-and-iframe-postmessage-api/. These are the resources I used for reference.

I created the iframe in the main HTML file and designed a new confirmation.html file to display the thank-you message. Using the postMessage API, I passed the message and cardholder's name from the parent window to the child iframe. This research and implementation were a valuable learning experience and added a functional and interactive confirmation step to my project. 

That was my thought process!


Task 3: Payment Form Creation:

File route: index.html, pages/confirmation.html

1. For the card form I used the <form> tag. Inside a form, I added a novalidate attribute, which allows us to implement custom validation and error handling. 

2. Each input I wrapped in a <div> with a <form-group> class. 

3. I used labels for accessibility for each input. I also used for attribute in a label which matches the ID of the particular input.

4. For credit card expiration dates I used <select> elements which made the interface more user-friendly and also helped when developing validation, making the validation date function less complex. 

5. For the button I used type="submit", which triggers my submit event in the JavaScript file. 

6. For CVV input I used type="password" which provided security for the pin.

7. I add an Iframe to show a confirmation alert window to the user after successfully submitting a form.



Task 4: CSS Styling:

File route: styles/main.css

I am a CIBC client, so I used the main colours of the company I trust. 

1. I defined reusable variables for colors (--main-color, --second-color, etc). If I need to update the theme, I will only adjust these variables.

2. I used media queries for responsive design, using the mobile-first approach in mind.

3. I styled my buttons and inputs on focus, hover and action, and implemented transitions and animations for a more interactive experience. 

4. Utilized Flexbox for layout management.

5. I separated my components with comments and didn't mix them for better navigation across my file.

6. I applied styles for error messages to indicate validation errors.




Task 5: Linux:

To change permission on a file, I will use the chmod command - chmod permissions filename. 

Comman that allows only the owner to read and write in a file: chmod 600 filename. 

1. First digit related to the owner. 6 is the sum of read(4), write(2), execution(0). If I need to allow the owner to execute the file I will use 1 instead of 0, so in a sum it's going be 7. The command is going to be chmod 700 filename.

2. Second digit represents a group. If I don't want the group to have access to a file, so sum is going to be 0 (read(0), write(0), execution(0)).

3. The third digit represents the others and it follows the same logic. 

This is why the final result is going to be chmod 600 filename or chmod 700 filename. 

To navigate through my files I will use cd, to list files in a folder - ls, check my current directory - pwd. # evgeniia_sindiukova_validation_challenge
