// Add Train
document
  .getElementById("addTrainForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const response = await fetch("/admin/add-train", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        trainNumber: document.getElementById("trainNumber").value,
        name: document.getElementById("name").value,
        startStation: document.getElementById("startStation").value,
        endStation: document.getElementById("endStation").value,
        stoppages: document.getElementById("stoppages").value.split(","),
      }),
    });
    const result = await response.json();
    alert(result.message);
  });
