// Track if there is an input.
const generateBtn = document.getElementById("btn-generate");
const inputField = document.getElementById("qrlink");
const qrForm = document.getElementById("qrform");

inputField.addEventListener('input', function () {
    const inputValue = inputField.value.trim(); 

    if (inputValue === "") {
        // These are default values.
        generateBtn.classList.add('opacity-50', 'cursor-not-allowed');
        generateBtn.disabled = true;
    } else {
        // These will remove default if the condition is met.
        generateBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        generateBtn.disabled = false;
    }
});

// Custom alert messages
let message = "";

function messageShit(message) {
  const alertTitle = document.getElementById("alert-title");

  alertTitle.textContent = message;
}

// Toggle alert
function showAlert() {
  const alertDialog = document.getElementById("alert-dialog");
  alertDialog.classList.remove("hidden");

  // Clear input & disable button
  document.getElementById('qrlink').value = '';
  generateBtn.disabled = true;
  generateBtn.classList.add('opacity-50', 'cursor-not-allowed');
  
  // Disable input field
  inputField.disabled = true;
  inputField.classList.add('opacity-50', 'cursor-not-allowed');
}

// Close alert message & enable input
document.getElementById('btn-dismiss').addEventListener('click', function () {
  document.getElementById('alert-dialog').classList.add('hidden');

  // Enable input field
  inputField.disabled = false;
  inputField.classList.remove('opacity-50', 'cursor-not-allowed');
});

// URL checker.
function isValidUrl(value) {
    try {
      new URL(value);
      return true;
    } catch (_) {
      return false;
    }
};

// QR Code process begins here.
document.getElementById('btn-generate').addEventListener('click', function (event) {
    // Handle auto reload.
    event.preventDefault();

    const qrLink = document.getElementById('qrlink').value.trim();
    const wrapperElement = document.getElementById('wrapper');
    const messageElement = document.getElementById('message');
    const downloadBtn= document.getElementById("btn-download");
    const shareBtn = document.getElementById("btn-share");
    const copyBtn = document.getElementById("btn-copy");
    const groupBtn = document.getElementById("btn-group");
    
    // Clear any previous QR code and message
    document.getElementById('qrcode').innerHTML = '';

    // Hide the message and action buttons initially
    messageElement.classList.add('hidden'); 
    groupBtn.classList.add('hidden'); 
  
    if (qrLink && isValidUrl(qrLink)) {
      try {
        // Generate the QR code
        const qrCode = new QRCode(document.getElementById('qrcode'), {
          text: qrLink,
          width: 256,
          height: 256,
        });

        // Show action buttons
        groupBtn.classList.remove('hidden'); 

        setTimeout( () => {
          const qrImage = document.querySelector("#qrcode img");

          if (qrImage) {
            const qrSource = qrImage.src;
            downloadBtn.href = qrSource;
          }
        }, 500);

        // Show the wrapper & success message
        wrapperElement.classList.add('grid');
        wrapperElement.classList.remove('hidden');
        messageElement.classList.remove('hidden');
      } catch (error) {
        // Handle any errors that may occur
        console.error('Error generating QR code:', error);
        alert('Failed to generate QR code.');
      }
    } else {
      showAlert();
    }
});
