const API_BASE = "http://localhost:18080/api";

// --- LOGIN ---
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    
    if(user === 'MOFASA' && pass === 'MOFASA123') {
        document.getElementById('loginPage').classList.add('hidden');
        document.getElementById('app').classList.remove('hidden');
        fetchStats();
        fetchRecords();
    } else {
        document.getElementById('loginMessage').innerText = "Invalid credentials!";
    }
});

// --- NAVIGATION ---
document.querySelectorAll('.nav-btn, .quick-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const section = e.currentTarget.getAttribute('data-section');
        if(!section) return;

        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active-section'));

        const navBtn = document.querySelector(`.nav-btn[data-section="${section}"]`);
        if(navBtn) navBtn.classList.add('active');

        const secElement = document.getElementById(section);
        if(secElement) secElement.classList.add('active-section');
        
        if (e.currentTarget.classList.contains('nav-btn')) {
            document.getElementById('pageTitle').innerText = e.currentTarget.innerText.replace(/[^a-zA-Z ]/g, "").trim();
        }
    });
});

document.getElementById('logoutBtn').addEventListener('click', () => {
    document.getElementById('app').classList.add('hidden');
    document.getElementById('loginPage').classList.remove('hidden');
    document.getElementById('loginForm').reset();
});

document.getElementById('showAddForm').addEventListener('click', () => {
    document.getElementById('addFormContainer').classList.remove('hidden');
});
document.getElementById('cancelAdd').addEventListener('click', () => {
    document.getElementById('addFormContainer').classList.add('hidden');
});

// --- DEVELOPER INFO POPUP ---
const devBtn = document.getElementById('devBtn');
const devPopup = document.getElementById('devPopup');

devBtn.addEventListener('click', () => {
    devPopup.style.display = 'block';
});

devBtn.addEventListener('mouseleave', () => {
    // Adding a small delay to allow moving mouse to the popup if needed
    setTimeout(() => {
        if(!devPopup.matches(':hover')) {
             devPopup.style.display = 'none';
        }
    }, 100);
});

devPopup.addEventListener('mouseleave', () => {
    devPopup.style.display = 'none';
});

// Hide popup if clicking outside
document.addEventListener('click', (e) => {
    if (!devBtn.contains(e.target) && !devPopup.contains(e.target)) {
        devPopup.style.display = 'none';
    }
});


// --- API CALLS ---
function fetchStats() {
    fetch(`${API_BASE}/stats`)
        .then(res => res.json())
        .then(data => {
            document.getElementById('totalRecords').innerText = data.total_records;
            document.getElementById('totalPaid').innerText = '৳' + data.total_paid.toFixed(2);
            document.getElementById('totalDue').innerText = '৳' + data.total_due.toFixed(2);
            document.getElementById('deletedRecords').innerText = data.deleted_records;
        }).catch(err => console.log("Backend not connected. Check if server.cpp is running."));
}

function fetchRecords() {
    fetch(`${API_BASE}/records`)
        .then(res => res.json())
        .then(data => {
            const tbody = document.getElementById('landTableBody');
            tbody.innerHTML = '';
            data.forEach(record => {
                tbody.innerHTML += `
                    <tr>
                        <td>${record.id}</td>
                        <td>${record.name}</td>
                        <td>${record.place}</td>
                        <td>${record.land_type}</td>
                        <td>${record.area}</td>
                        <td class="paid">৳${record.paid.toFixed(2)}</td>
                        <td class="due">৳${record.due.toFixed(2)}</td>
                        <td><button class="delete-btn" onclick="deleteRecord(${record.id})">Delete</button></td>
                    </tr>
                `;
            });
        }).catch(console.error);
}

document.getElementById('landForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const data = {
        id: parseInt(document.getElementById('landId').value),
        name: document.getElementById('refName').value,
        place: document.getElementById('placeName').value,
        area: parseFloat(document.getElementById('area').value),
        location: document.getElementById('location').value
    };

    fetch(`${API_BASE}/records`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    }).then(res => res.json()).then(res => {
        alert(res.message || "Added successfully");
        document.getElementById('addFormContainer').classList.add('hidden');
        document.getElementById('landForm').reset();
        fetchRecords();
        fetchStats();
    }).catch(console.error);
});

window.deleteRecord = function(id) {
    if(confirm("Are you sure you want to delete this record?")) {
        fetch(`${API_BASE}/records/${id}`, { method: 'DELETE' })
            .then(res => res.json())
            .then(res => {
                fetchRecords();
                fetchStats();
            }).catch(console.error);
    }
}

document.getElementById('searchBtn').addEventListener('click', () => {
    const id = document.getElementById('searchId').value;
    fetch(`${API_BASE}/search/${id}`)
        .then(res => {
            if(!res.ok) throw new Error("Not found");
            return res.json();
        })
        .then(data => {
            document.getElementById('searchResult').innerHTML = `
                <div class="record-details">
                    <h3>Record Found</h3>
                    <div class="detail-grid">
                        <div class="detail-item"><span>ID</span><strong>${data.id}</strong></div>
                        <div class="detail-item"><span>Name</span><strong>${data.name}</strong></div>
                        <div class="detail-item"><span>Area</span><strong>${data.area} Decimals</strong></div>
                        <div class="detail-item"><span>Type</span><strong>${data.land_type}</strong></div>
                        <div class="detail-item"><span>Tax</span><strong>৳${(data.paid + data.due).toFixed(2)}</strong></div>
                        <div class="detail-item"><span>Due</span><strong class="due">৳${data.due.toFixed(2)}</strong></div>
                    </div>
                </div>
            `;
        }).catch(err => {
            document.getElementById('searchResult').innerHTML = '<p style="color:red;">Record not found!</p>';
        });
});
