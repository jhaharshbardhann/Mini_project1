/* ==========================================================================
   Accurate Group of Institutions - Organizer & Admin Dashboard Logic
   ========================================================================== */

// Sample Demo Data Seed if completely empty
function seedDemoDataIfEmpty() {
    const existing = getAllRegistrations();
    if (existing.length === 0) {
        const demo = [
            {
                id: "AGI-2026-10492",
                name: "Aarav Sharma",
                roll: "220101032",
                email: "aarav.sharma@accurate.in",
                mobile: "9876543210",
                branch: "Computer Science & Engg (CSE)",
                year: "3rd Year",
                event: "💻 Coding Competition",
                participationType: "Solo",
                teamDetails: "",
                registeredAt: "23 Sep 2026, 11:30 AM"
            },
            {
                id: "AGI-2026-38419",
                name: "Rohan Varma",
                roll: "230104015",
                email: "rohan.v@gmail.com",
                mobile: "9812345678",
                branch: "Information Technology (IT)",
                year: "2nd Year",
                event: "🎮 Free Fire Esports Championship",
                participationType: "Team",
                teamDetails: "Team Phoenix (Aman, Vicky, Rahul, Rohan)",
                registeredAt: "23 Sep 2026, 01:15 PM"
            },
            {
                id: "AGI-2026-59124",
                name: "Priya Mukherjee",
                roll: "210102088",
                email: "priya.m@accurate.in",
                mobile: "9712398765",
                branch: "Electronics & Comm (ECE)",
                year: "4th Year",
                event: "🎤 Utkarsh Cultural Fest (Dance & Music)",
                participationType: "Solo",
                teamDetails: "Solo Classical Vocal",
                registeredAt: "23 Sep 2026, 03:45 PM"
            }
        ];
        saveAllRegistrations(demo);
        return demo;
    }
    return existing;
}

// Update Admin Stats Counters
function updateDashboardStats() {
    const registrations = getAllRegistrations();
    const events = getAllEvents();

    const totalRegsEl = document.getElementById('statTotalRegs');
    const totalEventsEl = document.getElementById('statTotalEvents');
    const popularEventEl = document.getElementById('statPopularEvent');

    if (totalRegsEl) totalRegsEl.textContent = registrations.length;
    if (totalEventsEl) totalEventsEl.textContent = events.length;

    if (popularEventEl) {
        if (registrations.length === 0) {
            popularEventEl.textContent = "None yet";
        } else {
            // Count frequencies
            const counts = {};
            registrations.forEach(r => {
                counts[r.event] = (counts[r.event] || 0) + 1;
            });
            let maxCount = 0;
            let topEvent = "Coding Competition";
            for (const [evt, count] of Object.entries(counts)) {
                if (count > maxCount) {
                    maxCount = count;
                    topEvent = evt;
                }
            }
            popularEventEl.textContent = `${topEvent} (${maxCount})`;
        }
    }
}

// Populate Admin Event Filter Dropdown
function populateAdminFilter() {
    const filterSelect = document.getElementById('adminEventFilter');
    if (!filterSelect) return;

    const events = getAllEvents();
    filterSelect.innerHTML = '<option value="all">All Registered Events</option>';
    events.forEach(e => {
        const opt = document.createElement('option');
        opt.value = e.title;
        opt.textContent = e.title;
        filterSelect.appendChild(opt);
    });
}

// Render Participants Table
function renderParticipantsTable() {
    const tableBody = document.getElementById('participantsTableBody');
    if (!tableBody) return;

    const registrations = getAllRegistrations();
    const searchVal = (document.getElementById('adminSearchInput')?.value || '').trim().toLowerCase();
    const filterEvent = document.getElementById('adminEventFilter')?.value || 'all';

    let filtered = registrations;

    if (filterEvent !== 'all') {
        filtered = filtered.filter(r => r.event === filterEvent);
    }

    if (searchVal) {
        filtered = filtered.filter(r => 
            r.name.toLowerCase().includes(searchVal) ||
            r.roll.toLowerCase().includes(searchVal) ||
            r.id.toLowerCase().includes(searchVal) ||
            r.mobile.includes(searchVal) ||
            r.event.toLowerCase().includes(searchVal)
        );
    }

    const countDisplay = document.getElementById('tableCountDisplay');
    if (countDisplay) {
        countDisplay.textContent = `Showing ${filtered.length} of ${registrations.length} registrations`;
    }

    if (filtered.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 30px; color: var(--text-muted);">
                    No participant registrations found.
                </td>
            </tr>
        `;
        return;
    }

    tableBody.innerHTML = filtered.map(r => `
        <tr>
            <td><strong style="color: var(--primary);">${r.id}</strong></td>
            <td>
                <strong>${r.name}</strong><br>
                <small style="color: var(--text-muted);">${r.email}</small>
            </td>
            <td><code>${r.roll}</code></td>
            <td>${r.branch || '-'}<br><small style="color: var(--text-muted);">${r.year || ''}</small></td>
            <td><span class="badge badge-tech" style="font-size: 0.8rem;">${r.event}</span></td>
            <td>${r.participationType || 'Solo'}</td>
            <td>${r.mobile}</td>
            <td>
                <button class="btn-icon btn-delete" title="Delete Registration" onclick="deleteRegistration('${r.id}')">
                    🗑️ Delete
                </button>
            </td>
        </tr>
    `).join('');
}

// Delete registration by ID
function deleteRegistration(regId) {
    if (!confirm(`Are you sure you want to delete registration ${regId}?`)) return;

    let regs = getAllRegistrations();
    regs = regs.filter(r => r.id !== regId);
    saveAllRegistrations(regs);
    localStorage.removeItem(regId);

    showToast(`Registration ${regId} deleted.`, 'info');
    updateDashboardStats();
    renderParticipantsTable();
}

// Export participants to CSV
function exportToCSV() {
    const registrations = getAllRegistrations();
    if (registrations.length === 0) {
        showToast("No registrations available to export!", "error");
        return;
    }

    const headers = [
        "Registration ID",
        "Student Name",
        "Roll Number",
        "Department / Branch",
        "Year of Study",
        "Event Name",
        "Format (Solo/Team)",
        "Team Details",
        "Mobile Number",
        "Email Address",
        "Registration Date"
    ];

    const rows = registrations.map(r => [
        `"${r.id}"`,
        `"${r.name.replace(/"/g, '""')}"`,
        `"${r.roll}"`,
        `"${(r.branch || '').replace(/"/g, '""')}"`,
        `"${(r.year || '').replace(/"/g, '""')}"`,
        `"${r.event.replace(/"/g, '""')}"`,
        `"${(r.participationType || 'Solo')}"`,
        `"${(r.teamDetails || '').replace(/"/g, '""')}"`,
        `"${r.mobile}"`,
        `"${r.email}"`,
        `"${r.registeredAt || ''}"`
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Accurate_College_Event_Registrations_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("Participant data exported to CSV successfully!", "success");
}

// Add New Event Form Logic
function initAddEventForm() {
    const form = document.getElementById('addEventForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const title = document.getElementById('newEventTitle').value.trim();
        const category = document.getElementById('newEventCategory').value;
        const date = document.getElementById('newEventDate').value.trim();
        const time = document.getElementById('newEventTime').value.trim();
        const venue = document.getElementById('newEventVenue').value.trim();
        const prize = document.getElementById('newEventPrize').value.trim();
        const teamSize = document.getElementById('newEventTeamSize').value.trim();
        const coordinator = document.getElementById('newEventCoordinator').value.trim();
        const description = document.getElementById('newEventDesc').value.trim();
        const rulesRaw = document.getElementById('newEventRules').value.trim();

        if (!title || !date || !venue) {
            showToast("Please fill in the required event fields.", "error");
            return;
        }

        const events = getAllEvents();
        const newEvent = {
            id: `evt-${Date.now()}`,
            title: title,
            category: category,
            categoryName: category.charAt(0).toUpperCase() + category.slice(1),
            date: date,
            time: time || "10:00 AM",
            venue: venue,
            prize: prize || "Trophies & Certificates",
            teamSize: teamSize || "Open Format",
            coordinator: coordinator || "College Event Committee",
            description: description || "Join this exciting campus competition.",
            rules: rulesRaw ? rulesRaw.split('\n').filter(r => r.trim() !== '') : ["Valid college ID required."]
        };

        events.push(newEvent);
        saveEvents(events);

        form.reset();
        showToast(`Event "${title}" created successfully!`, "success");
        updateDashboardStats();
        populateAdminFilter();
    });
}

// Simple Admin Authentication Check
function checkAdminAuth() {
    const authOverlay = document.getElementById('adminAuthSection');
    const dashboardSection = document.getElementById('adminDashboardSection');
    const passInput = document.getElementById('adminPasswordInput');
    const loginBtn = document.getElementById('adminLoginBtn');

    if (!authOverlay || !dashboardSection) return;

    // Check if already authenticated in session
    if (sessionStorage.getItem('agi_admin_logged_in') === 'true') {
        authOverlay.style.display = 'none';
        dashboardSection.style.display = 'block';
        return;
    }

    loginBtn.addEventListener('click', () => {
        const pass = passInput.value.trim();
        // Demo password: admin123 or blank for easy access
        if (pass === 'admin123' || pass === 'admin' || pass === '') {
            sessionStorage.setItem('agi_admin_logged_in', 'true');
            authOverlay.style.display = 'none';
            dashboardSection.style.display = 'block';
            showToast("Welcome Organizer / Admin!", "success");
            updateDashboardStats();
            populateAdminFilter();
            renderParticipantsTable();
        } else {
            showToast("Invalid password! (Tip: use default 'admin123')", "error");
        }
    });

    passInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') loginBtn.click();
    });
}

// Reset data to defaults
function resetAllData() {
    if (confirm("Reset all registrations to initial demo data?")) {
        localStorage.removeItem('agi_all_registrations');
        localStorage.removeItem('agi_events_catalog');
        seedDemoDataIfEmpty();
        location.reload();
    }
}

// Document ready for Admin
document.addEventListener('DOMContentLoaded', () => {
    seedDemoDataIfEmpty();
    checkAdminAuth();
    updateDashboardStats();
    populateAdminFilter();
    renderParticipantsTable();
    initAddEventForm();

    const searchInput = document.getElementById('adminSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', renderParticipantsTable);
    }

    const filterSelect = document.getElementById('adminEventFilter');
    if (filterSelect) {
        filterSelect.addEventListener('change', renderParticipantsTable);
    }
});
