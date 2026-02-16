fetch("http://localhost:5000/leads")
  .then(res => res.json())
  .then(data => {
    const table = document.getElementById("leadTable");

    data.forEach(lead => {
      table.innerHTML += `
        <tr>
          <td>${lead.name}</td>
          <td>${lead.email}</td>
          <td>
            <select onchange="updateStatus(${lead.id}, this.value)">
              <option value="new" ${lead.status === 'new' ? 'selected' : ''}>New</option>
              <option value="contacted" ${lead.status === 'contacted' ? 'selected' : ''}>Contacted</option>
              <option value="converted" ${lead.status === 'converted' ? 'selected' : ''}>Converted</option>
            </select>
          </td>
          <td>
            <input type="text" id="note-${lead.id}" value="${lead.notes || ''}">
            <button onclick="addNotes(${lead.id})">Save</button>
          </td>
        </tr>
      `;
    });
  });

function updateStatus(id, status) {
  fetch(`http://localhost:5000/update-status/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  });
}

function addNotes(id) {
  const note = document.getElementById(`note-${id}`).value;
  fetch(`http://localhost:5000/add-notes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ notes: note })
  });
  }