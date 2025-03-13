async function claimReward(voucherCode) {
  if (!voucherCode) {
    Swal.fire({
      icon: "warning",
      title: "No Voucher Selected! ⚠️",
      text: "Please enter a valid voucher code before claiming.",
      confirmButtonColor: "#3085d6",
    });
    return;
  }

  Swal.fire({
    icon: "info",
    title: "Processing...",
    text: "Please wait while we claim your reward.",
    allowOutsideClick: false,
    showConfirmButton: false,
    willOpen: () => {
      Swal.showLoading();
    },
  });

  try {
    let response = await fetch(
      "https://script.google.com/macros/s/AKfycbz7ZcHLBxw7W0z9dVlgLEy1DysOpG66j1ISWuZPwEcPpaCX3gjEPNWs7L-gGTYEOLba/exec",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voucherCode: voucherCode }),
      }
    );

    let result = await response.json();

    if (result.success) {
      Swal.fire({
        icon: "success",
        title: "🎉 Reward Claimed!",
        text: result.message,
        confirmButtonColor: "#28a745",
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops! Claim Failed 😢",
        text: result.message,
        confirmButtonColor: "#d33",
      });
    }
  } catch (error) {
    console.error("Error claiming reward:", error);
    Swal.fire({
      icon: "error",
      title: "Network Error! 🚨",
      text: "Failed to claim the reward. Please check your connection and try again.",
      confirmButtonColor: "#d33",
    });
  }
}

async function fetchData(sheetKey, inputId) {
  const voucherCode = document.getElementById(inputId).value.trim();
  if (!voucherCode) {
    Swal.fire({
      icon: "warning",
      title: "⚠ Empty Field!",
      text: "Please enter a voucher code.",
      confirmButtonColor: "#3085d6",
    });
    return;
  }

  console.log(`Fetching data from ${sheetKey} for voucher: ${voucherCode}`);

  // Fetch the voucher details from Google Sheets (Simulated API Call)
  try {
    let response = await fetch(
      `https://script.google.com/macros/s/AKfycbz7ZcHLBxw7W0z9dVlgLEy1DysOpG66j1ISWuZPwEcPpaCX3gjEPNWs7L-gGTYEOLba/exec?voucherCode=${voucherCode}`
    );

    let result = await response.json();

    if (result.success) {
      document.getElementById("name").innerText = result.name || "N/A";
      document.getElementById("email").innerText = result.email || "N/A";
      document.getElementById("reward").innerText = result.reward || "N/A";
      document.getElementById("screenshot").innerText = result.screenshot || "N/A";
      document.getElementById("expiry").innerText = result.expiry || "N/A";
      document.getElementById("status").innerText = result.status || "N/A";

      Swal.fire({
        icon: "success",
        title: "🎉 Voucher Found!",
        text: `Voucher ${voucherCode} is valid.`,
        confirmButtonColor: "#28a745",
      });

      // Enable the claim button
      document.getElementById("claim-btn").disabled = false;
      document.getElementById("claim-btn").onclick = () => claimReward(voucherCode);
    } else {
      Swal.fire({
        icon: "error",
        title: "Invalid Voucher! ❌",
        text: "The voucher code you entered is not valid.",
        confirmButtonColor: "#d33",
      });
    }
  } catch (error) {
    console.error("Error fetching voucher:", error);
    Swal.fire({
      icon: "error",
      title: "Network Error! 🚨",
      text: "Failed to retrieve voucher details. Please check your connection.",
      confirmButtonColor: "#d33",
    });
  }
}
