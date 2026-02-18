const form = document.getElementById("leadForm");
const responseText = document.getElementById("response");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    message: document.getElementById("message").value
  };

  try {
    const res = await fetch("https://client-lead-management-system-mini-crm-tseq.onrender.com/add-lead", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await res.json();
    responseText.innerText = result.message;
    form.reset();

  } catch (error) {
    responseText.innerText = "Error submitting form";
  }

});



