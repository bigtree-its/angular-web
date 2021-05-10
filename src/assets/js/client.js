// A reference to Stripe.js initialized with your real test publishable API key.
var stripe = Stripe("pk_test_51IL6YhCYSHJV743tS2a6P13bf69XrPbb7w63YCLHmtoILKQ0COnV4wZgNpflbHZXzOyppKC1sM3KTfWx1g0x5YLC00BgSLCZMr");
var confirmCardPaymentResponse;
var elements = stripe.elements();
var style = {
  base: {
    color: '#303238',
    fontSize: '16px',
    fontFamily: '"Open Sans", sans-serif',
    fontSmoothing: 'antialiased',
    '::placeholder': {
      color: '#CFD7DF',
    },
  },
  invalid: {
    color: '#e5424d',
    ':focus': {
      color: '#303238',
    },
  },
};
var card = elements.create("card", { style: style, hidePostalCode: false });
var loadStripeElements = function () {
  card.mount("#card-element");
}


// Returns Stripe Elements
var getStripeElements = function () {
  return {
    stripe: stripe,
    card: card,
  };
};

/*
 * Calls stripe.confirmCardPayment which creates a pop-up modal to
 * prompt the user to enter extra authentication details without leaving your page
 */
async function payAsync(stripe, card, clientSecret) {
  changeLoadingState(true);
  return await stripe.confirmCardPayment(clientSecret, {
    payment_method: {
      card: card
    }
  });
}

var pay = function (stripe, card, clientSecret, callback) {
  changeLoadingState(true);

  // Initiate the payment.
  // If authentication is required, confirmCardPayment will automatically display a modal
  stripe.confirmCardPayment(clientSecret, {
    payment_method: {
      card: card
    }
  })
    .then(function (result) {
      console.log('ConfirmCardPayment Response: ' + JSON.stringify(result));
      if (result.error) {
        // Show error to your customer
        showError(result, callback);
      } else {
        // The payment has been processed!
        orderComplete(result, clientSecret, callback);
      }
    });
};

/* ------- Post-payment helpers ------- */

/* Shows a success / error message when the payment is complete */
var orderComplete = function (result, clientSecret, callback) {
  // Just for the purpose of the sample, show the PaymentIntent response object
  stripe.retrievePaymentIntent(clientSecret).then(function (result) {
    var paymentIntent = result.paymentIntent;
    var paymentIntentJson = JSON.stringify(paymentIntent, null, 2);
    console.log('Payment successfull: '+ paymentIntentJson);
    document.querySelector("#payment-form").classList.add("hidden");
    document.querySelector("#payment-result").classList.remove("hidden");
    document.querySelector("#payment-result").classList.add("bg-success");
    document.querySelector("#card-success").textContent = "Payment Sucessfull";
    setTimeout(function () {
    }, 4000);
    changeLoadingState(false);
    // callback(result);
    callback.handleStripConfirmation(result);
  });
};

var showError = function (result, callback) {
  changeLoadingState(false);
  console.log('Payment Error: '+ result.error.message);
  document.querySelector("#payment-result").classList.remove("hidden");
  document.querySelector("#payment-result").classList.add("bg-warning");
  document.querySelector("#card-error").textContent = result.error.message;
  setTimeout(function () {
    document.querySelector("#card-error").textContent = "";
    document.querySelector("#payment-result").classList.add("hidden");
  }, 4000);
  callback.handleStripConfirmation(result);
};

// Show a spinner on payment submission
var changeLoadingState = function (isLoading) {
  if (isLoading) {
    document.querySelector("#paywithCardButton").disabled = true;
    document.querySelector("#spinner").classList.remove("hidden");
    document.querySelector("#button-text").classList.add("hidden");
  } else {
    document.querySelector("#paywithCardButton").disabled = false;
    document.querySelector("#spinner").classList.add("hidden");
    document.querySelector("#button-text").classList.remove("hidden");
  }
};

