First, you should create the radio buttons for the cookie consent options in your HTML file. You can place them within a modal, so it will appear when the user lands on your website. You will also need to include the jQuery library and the bootstrap dependencies for the modal to work.

Here is the updated HTML file:
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cookie Consent</title>
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</head>
<body>

<!-- Cookie Consent Modal -->
<div class="modal fade" id="cookieConsentModal" tabindex="-1" role="dialog" aria-labelledby="cookieConsentModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="cookieConsentModalLabel">Cookie Consent</h5>
      </div>
      <div class="modal-body">
        <form id="cookieConsentForm">
          <div class="form-check">
            <input class="form-check-input" type="radio" name="cookieConsent" id="option1" value="option1">
            <label class="form-check-label" for="option1">
              I do not allow any personal data regarding my visit to be recorded (some services may not be available as a result)
            </label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="radio" name="cookieConsent" id="option2" value="option2">
            <label class="form-check-label" for="option2">
              I allow this site to use cookies to retain data on my use of this site (normal site performance)
            </label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="radio" name="cookieConsent" id="option3" value="option3">
            <label class="form-check-label" for="option3">
              I allow the site to tokenize data on my visit (normal site performance, with control of your data for further sale as you choose)
            </label>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" id="submitConsent">Submit</button>
      </div>
    </div>
  </div>
</div>

<!-- Your existing code -->
<!-- ... -->

<script src="metamask-login.js"></script>
<script>
  // Your existing JavaScript code
  // ...

  $(document).ready(function() {
    // Show cookie consent modal
    $('#cookieConsentModal').modal('show');

    // Handle form submission
    $('#submitConsent').on('click', function() {
      const selectedOption = $('input[name="cookieConsent"]:checked').val();

      if (selectedOption === 'option2' || selectedOption === 'option3') {
        if (selectedOption === 'option3') {
          $('#tokenize').prop('checked', true);
}
getAccount();
} else {
// Set a cookie to remember the user's choice (option1: no data collection)
document.cookie = "cookieConsent=option1; path=/";
}
// Close the modal
  $('#cookieConsentModal').modal('hide');
});
});
</script>

</body>
</html>

In this code snippet, we're showing the cookie consent modal when the user lands on the website. Then, depending on the user's choice, we either set a cookie to remember their choice (option 1) or enable the tokenize switch and open MetaMask (options 2 and 3).

In your server-side code, you should use the cookie-parser middleware to read the user's cookie consent choice and adjust your data collection accordingly.

Here is an example of how to use cookie-parser in your Express app:

const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());

app.get('/', (req, res) => {
  const cookieConsent = req.cookies.cookieConsent;

  // Check the user's cookie consent choice and adjust data collection accordingly
  if (cookieConsent === 'option1') {
    // The user does not allow any personal data regarding their visit to be recorded
  } else if (cookieConsent === 'option2') {
    // The user allows the site to use cookies to retain data on their use of the site
  } else if (cookieConsent === 'option3') {
    // The user allows the site to tokenize data on their visit
  }

  // Render your page or send data to the client
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
This code uses the cookie-parser middleware to read the user's cookie consent choice from the cookieConsent cookie. Based on the user's choice, you can adjust your data collection and processing accordingly.






=============================
Second option 
=============================
Sure, I can help you rewrite the code and provide steps to implement the cookies requirement you have mentioned.

Install the cookie-parser module using the following command in your terminal:
Copy code
npm install cookie-parser
Require the cookie-parser module in your Node.js application and use it as middleware for your express app.

Copy code
const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());

Create a GET route for your website's landing page where the cookie consent will be displayed. In this route, you can render a template that will display the radio buttons for the user to choose from.
javascript

Copy code
app.get('/', (req, res) => {
  res.render('landing-page');
});
In your landing page template, you can use the following code to display the radio buttons.

Copy code
<form action="/set-cookie" method="POST">
  <div>
    <input type="radio" name="cookie-consent" value="allow-all" required>
    <label for="allow-all">I allow this site to use cookies to retain data on my use of this site</label>
  </div>
  <div>
    <input type="radio" name="cookie-consent" value="tokenize" required>
    <label for="tokenize">I allow the site to tokenize data on my visit</label>
  </div>
  <div>
    <input type="radio" name="cookie-consent" value="deny" required>
    <label for="deny">I do not allow any personal data regarding my visit to be recorded</label>
  </div>
  <button type="submit">Submit</button>
</form>
When the user selects the "I allow this site to use cookies to retain data on my use of this site" option, you can redirect them to the login page and store their consent in a cookie named cookie-consent.
javascript
Copy code
app.post('/set-cookie', (req, res) => {
  const cookieConsent = req.body['cookie-consent'];

  if (cookieConsent === 'allow-all') {
    res.cookie('cookie-consent', 'allow-all');
    res.redirect('/login');
  } else if (cookieConsent === 'tokenize') {
    res.cookie('cookie-consent', 'tokenize');
    res.redirect('/login');
  } else {
    res.cookie('cookie-consent', 'deny');
    res.redirect('/');
  }
});
In your login page, you can check if the cookie-consent cookie exists and its value to determine if the user has given their consent to use cookies.
javascript
Copy code
app.get('/login', (req, res) => {
  const cookieConsent = req.cookies['cookie-consent'];

  if (cookieConsent === 'allow-all') {
    // Display the login form with the "Share toggle switch"
  } else if (cookieConsent === 'tokenize') {
    // Display the login form with the "Share and Tokenize toggle switches"
  } else {
    // Display a message that the user has not given their consent to use cookies
  }
});
When the user clicks on the "Connect to MetaMask" button, you can use the ethereum.request method to get the user's Ethereum account and store it in a hidden input field in the login form.
javascript
Copy code
const ethereumButton = document.querySelector('.enableEthereumButton');
const showAccount = document.querySelector('.showAccount');

ethereumButton.addEventListener('click', async () => {
  const accounts = await ethereum.request({ method: 'eth_requestAccounts'});
const account = accounts[0];
showAccount.value = account;
});

When the user submits the login form, you can retrieve the Ethereum account stored in the hidden input field and use it to authenticate the user.
javascript
Copy code
app.post('/login', (req, res) => {
  const metaMaskId = req.body.metaMaskId;

  // Authenticate the user using the metaMaskId
});
When the user logs out, you can clear the cookie-consent cookie to remove their consent.
javascript
Copy code
app.post('/logout', (req, res) => {
  res.clearCookie('cookie-consent');
  // Redirect the user to the landing page
});
I hope this helps! Let me know if you have any further questions.