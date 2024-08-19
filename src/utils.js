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
    
    // Clear any previous QR code and message
    document.getElementById('qrcode').innerHTML = '';
    // Hide the message initially
    messageElement.classList.add('hidden'); 
  
    if (qrLink && isValidUrl(qrLink)) {
      try {
        // Generate the QR code
        const qrCode = new QRCode(document.getElementById('qrcode'), {
          text: qrLink,
          width: 256,
          height: 256,
          colorDark : "#000000",
          colorLight : "#ffffff",
          correctLevel : QRCode.CorrectLevel.H
        });

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

// Global variable to store the QR code data URL
let qrCodeDataUrl = null;

// Function to convert QR code into an image and update global variable
function convertQRToImage() {
  const qrCodeCanvas = document.querySelector('#qrcode canvas');

  if (qrCodeCanvas) {
    qrCodeDataUrl = qrCodeCanvas.toDataURL('image/png');
    const qrImg = document.createElement('img');
    qrImg.src = qrCodeDataUrl;
    qrImg.alt = 'QR Code';

    const qrContainer = document.getElementById("qrcode");
    qrContainer.innerHTML = '';
    qrContainer.appendChild(qrImg);

    return qrCodeDataUrl;
  } else {
    qrCodeDataUrl = null;
    return null;
  }
}

// Function to handle download, share, and copy actions
async function handleQRCodeAction(event, action) {
  event.preventDefault();

  // If dataUrl is not set, attempt to generate it
  if (!qrCodeDataUrl) {
    const dataUrl = convertQRToImage();
    if (!dataUrl) {
      console.error("Failed to generate QR code image.");
      return;
    }
  }

  // Use the shared qrCodeDataUrl
  const dataUrl = qrCodeDataUrl;

  if (action === 'download') {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = "qrcode.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  if (action === 'share') {
    let blob;
    try {
      const response = await fetch(dataUrl);
      blob = await response.blob();
    } catch (error) {
      console.error("Error converting dataUrl to Blob:", error);
      return;
    }

    const fileToShare = new File([blob], "qrcode.png", { type: "image/png" });

    if (navigator.canShare && navigator.canShare({ files: [fileToShare] })) {
      try {
        await navigator.share({
          files: [fileToShare],
          title: "Generated QR Code",
          text: "I'm happy to share this QR Code",
        });
        console.log("Shared successfully");
      } catch (error) {
        console.log("Failed to share", error);
      }
    } else {
      alert("Your system doesn't support sharing these files.");
    }
  }

  if (action === 'copy') {
    try {
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], "qrcode.png", { type: "image/png" });

      if (navigator.clipboard && navigator.clipboard.write) {
        await navigator.clipboard.write([
          new ClipboardItem({
            [file.type]: file
          })
        ]);
        console.log("QR Code copied to clipboard!");
      } else {
        alert("Clipboard API is not supported on your browser.");
      }
    } catch (error) {
      console.error("Failed to copy QR code image to clipboard:", error);
    }
  }
}

// Attach event listeners to the buttons
document.getElementById("btn-download").addEventListener("click", function(event) {
  handleQRCodeAction(event, 'download');
});

document.getElementById("btn-share").addEventListener("click", function(event) {
  handleQRCodeAction(event, 'share');
});

document.getElementById("btn-copy").addEventListener("click", function(event) {
  handleQRCodeAction(event, 'copy');
});

