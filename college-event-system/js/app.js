/* ==========================================================================
   Accurate Group of Institutions - Core Application Logic
   ========================================================================== */

// Toast notification helper
function showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>🔔</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// Global Event Registration Trigger
function registerEvent(eventName) {
    if (!eventName) return;
    localStorage.setItem("selectedEvent", eventName);
    window.location.href = `registration.html?event=${encodeURIComponent(eventName)}`;
}

// Render Event Cards on Homepage
function renderHomeEvents(filterCategory = 'all', searchQuery = '') {
    const grid = document.getElementById('eventsGrid');
    if (!grid) return;

    const events = getAllEvents();
    let filtered = events;

    if (filterCategory !== 'all') {
        filtered = filtered.filter(e => e.category.toLowerCase() === filterCategory.toLowerCase());
    }

    if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(e => 
            e.title.toLowerCase().includes(q) || 
            e.description.toLowerCase().includes(q) ||
            e.venue.toLowerCase().includes(q) ||
            e.categoryName.toLowerCase().includes(q)
        );
    }

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px; background: white; border-radius: 12px; box-shadow: var(--shadow-sm);">
                <h3>🔍 No events found</h3>
                <p style="color: var(--text-muted); margin-top: 8px;">Try adjusting your search query or selecting a different category filter.</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = filtered.map(evt => {
        const badgeClass = `badge-${evt.category || 'tech'}`;
        return `
            <div class="card" data-id="${evt.id}">
                <div class="card-header-bar">
                    <span class="badge ${badgeClass}">${evt.categoryName || 'Event'}</span>
                    <span class="prize-tag">🏆 Prize: ${evt.prize}</span>
                </div>
                <div class="card-body">
                    <h3>${evt.title}</h3>
                    <p class="card-desc">${evt.description}</p>
                    <div class="event-meta">
                        <div class="meta-row">
                            <span>📅</span> <strong>Date:</strong> ${evt.date}
                        </div>
                        <div class="meta-row">
                            <span>⏰</span> <strong>Time:</strong> ${evt.time}
                        </div>
                        <div class="meta-row">
                            <span>📍</span> <strong>Venue:</strong> ${evt.venue}
                        </div>
                        <div class="meta-row">
                            <span>👥</span> <strong>Format:</strong> ${evt.teamSize}
                        </div>
                    </div>
                    <div class="card-footer">
                        <button class="btn btn-outline-dark btn-sm" onclick="openEventDetails('${evt.id}')">
                            ℹ️ Details
                        </button>
                        <button class="btn btn-primary btn-sm" onclick="registerEvent('${evt.title.replace(/'/g, "\\'")}')">
                            ✍️ Register
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Modal handling
function openEventDetails(eventId) {
    const events = getAllEvents();
    const evt = events.find(e => e.id === eventId);
    if (!evt) return;

    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const modalRegisterBtn = document.getElementById('modalRegisterBtn');
    const modalOverlay = document.getElementById('eventModal');

    if (modalTitle) modalTitle.textContent = evt.title;
    if (modalBody) {
        modalBody.innerHTML = `
            <p style="font-size: 1.05rem; margin-bottom: 15px;">${evt.description}</p>
            
            <div class="modal-info-grid">
                <div><strong>📅 Date:</strong> ${evt.date}</div>
                <div><strong>⏰ Time:</strong> ${evt.time}</div>
                <div><strong>📍 Venue:</strong> ${evt.venue}</div>
                <div><strong>🏆 Cash Prize:</strong> ${evt.prize}</div>
                <div><strong>👥 Team Format:</strong> ${evt.teamSize}</div>
                <div><strong>👤 Coordinator:</strong> ${evt.coordinator}</div>
            </div>

            <div class="modal-rules">
                <h4>📜 Rules & Guidelines:</h4>
                <ul>
                    ${(evt.rules || ["Follow faculty coordinator instructions.", "Bring valid college student ID card."]).map(r => `<li>${r}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    if (modalRegisterBtn) {
        modalRegisterBtn.onclick = function() {
            registerEvent(evt.title);
        };
    }

    if (modalOverlay) {
        modalOverlay.classList.add('active');
    }
}

function closeEventDetails() {
    const modalOverlay = document.getElementById('eventModal');
    if (modalOverlay) {
        modalOverlay.classList.remove('active');
    }
}

// Populate Event Select dropdown in registration form
function populateEventDropdown(selectedEventName = '') {
    const select = document.getElementById('event');
    if (!select) return;

    const events = getAllEvents();
    select.innerHTML = '<option value="">-- Choose an Event to Register --</option>';

    events.forEach(evt => {
        const option = document.createElement('option');
        option.value = evt.title;
        option.textContent = `${evt.title} (${evt.date})`;
        if (selectedEventName && (evt.title.toLowerCase().includes(selectedEventName.toLowerCase()) || selectedEventName.toLowerCase().includes(evt.title.toLowerCase()))) {
            option.selected = true;
        }
        select.appendChild(option);
    });
}

// Generate stylized SVG QR Code mockup
function generateQRCodeSVG(text) {
    return `
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" fill="#ffffff" />
            <!-- Corner 1 -->
            <rect x="10" y="10" width="25" height="25" fill="#0f172a" />
            <rect x="15" y="15" width="15" height="15" fill="#ffffff" />
            <rect x="18" y="18" width="9" height="9" fill="#0f172a" />
            <!-- Corner 2 -->
            <rect x="65" y="10" width="25" height="25" fill="#0f172a" />
            <rect x="70" y="15" width="15" height="15" fill="#ffffff" />
            <rect x="73" y="18" width="9" height="9" fill="#0f172a" />
            <!-- Corner 3 -->
            <rect x="10" y="65" width="25" height="25" fill="#0f172a" />
            <rect x="15" y="70" width="15" height="15" fill="#ffffff" />
            <rect x="18" y="73" width="9" height="9" fill="#0f172a" />
            <!-- Data dots -->
            <rect x="42" y="12" width="6" height="6" fill="#0f172a" />
            <rect x="52" y="18" width="6" height="6" fill="#0f172a" />
            <rect x="42" y="28" width="6" height="6" fill="#0f172a" />
            <rect x="48" y="38" width="8" height="8" fill="#0f172a" />
            <rect x="15" y="44" width="8" height="6" fill="#0f172a" />
            <rect x="28" y="48" width="6" height="8" fill="#0f172a" />
            <rect x="68" y="45" width="8" height="6" fill="#0f172a" />
            <rect x="80" y="55" width="8" height="8" fill="#0f172a" />
            <rect x="42" y="52" width="14" height="6" fill="#0f172a" />
            <rect x="44" y="68" width="10" height="8" fill="#0f172a" />
            <rect x="62" y="70" width="12" height="6" fill="#0f172a" />
            <rect x="78" y="72" width="10" height="16" fill="#0f172a" />
            <rect x="42" y="82" width="16" height="6" fill="#0f172a" />
        </svg>
    `;
}

// Render Digital Pass / Ticket
function renderTicketHTML(reg) {
    const qrSvg = generateQRCodeSVG(reg.id);
    return `
        <div class="ticket-wrapper">
            <div class="ticket" id="studentTicket">
                <div class="ticket-header">
                    <div style="font-size: 0.8rem; letter-spacing: 1px; text-transform: uppercase;">Accurate Group of Institutions, Greater Noida</div>
                    <h3>🎓 OFFICIAL EVENT ENTRY PASS</h3>
                    <div class="ticket-reg-id">${reg.id}</div>
                </div>
                <div class="ticket-body">
                    <div class="ticket-details">
                        <div class="ticket-field">
                            <span>Participant Name</span>
                            <strong>${reg.name}</strong>
                        </div>
                        <div class="ticket-field">
                            <span>Roll Number</span>
                            <strong>${reg.roll}</strong>
                        </div>
                        <div class="ticket-field" style="grid-column: 1/-1;">
                            <span>Registered Event</span>
                            <strong style="color: var(--primary);">${reg.event}</strong>
                        </div>
                        <div class="ticket-field">
                            <span>Branch / Dept</span>
                            <strong>${reg.branch || 'General'} (${reg.year || '2026'})</strong>
                        </div>
                        <div class="ticket-field">
                            <span>Participation Type</span>
                            <strong>${reg.participationType || 'Solo'}</strong>
                        </div>
                        <div class="ticket-field">
                            <span>Contact</span>
                            <strong>${reg.mobile}</strong>
                        </div>
                        <div class="ticket-field">
                            <span>Registered On</span>
                            <strong>${reg.registeredAt || 'Today'}</strong>
                        </div>
                    </div>
                    <div class="ticket-qr">
                        <div class="qr-box">
                            ${qrSvg}
                        </div>
                        <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: 700;">SCAN FOR ENTRY</span>
                    </div>
                </div>
                <div class="ticket-footer">
                    ⚠️ Please carry your valid College ID Card along with this entry pass. Gate entry closes 15 mins before event start.
                </div>
            </div>

            <div class="ticket-actions">
                <button class="btn btn-primary" onclick="window.print()">
                    🖨️ Print / Save Pass (PDF)
                </button>
                <a href="index.html" class="btn btn-outline-dark">
                    🏠 Return to Home
                </a>
                <a href="status.html" class="btn btn-outline-dark">
                    🔍 Lookup Passes
                </a>
            </div>
        </div>
    `;
}

// Registration Form Initialization & Submission
function initRegistrationPage() {
    const form = document.getElementById("registrationForm");
    if (!form) return;

    // Check URL param or localStorage for pre-selected event
    const urlParams = new URLSearchParams(window.location.search);
    const eventParam = urlParams.get('event');
    const storedEvent = localStorage.getItem("selectedEvent");
    const prefillEvent = eventParam || storedEvent || '';

    populateEventDropdown(prefillEvent);

    // Dynamic Team Members display toggle
    const teamTypeSelect = document.getElementById('participationType');
    const teamGroup = document.getElementById('teamMembersGroup');
    if (teamTypeSelect && teamGroup) {
        teamTypeSelect.addEventListener('change', function() {
            if (this.value === 'Team') {
                teamGroup.style.display = 'block';
            } else {
                teamGroup.style.display = 'none';
            }
        });
    }

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const roll = document.getElementById("roll").value.trim().toUpperCase();
        const email = document.getElementById("email").value.trim();
        const mobile = document.getElementById("mobile").value.trim();
        const branch = document.getElementById("branch").value;
        const year = document.getElementById("year").value;
        const eventName = document.getElementById("event").value;
        const participationType = teamTypeSelect ? teamTypeSelect.value : 'Solo';
        const teamDetails = document.getElementById("teamDetails") ? document.getElementById("teamDetails").value.trim() : '';

        // Validation
        if (!name || !roll || !email || !mobile || !eventName || !branch || !year) {
            showToast("Please fill in all required fields marked with *", "error");
            return;
        }

        // Phone validation (10 digits)
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(mobile)) {
            showToast("Please enter a valid 10-digit Indian mobile number.", "error");
            document.getElementById("mobile").focus();
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showToast("Please enter a valid email address.", "error");
            document.getElementById("email").focus();
            return;
        }

        // Check for duplicate registration for same roll + event
        const allRegistrations = getAllRegistrations();
        const duplicate = allRegistrations.find(r => r.roll.toLowerCase() === roll.toLowerCase() && r.event.toLowerCase() === eventName.toLowerCase());
        if (duplicate) {
            showToast(`Roll Number ${roll} is already registered for "${eventName}" with ID: ${duplicate.id}`, "error");
            return;
        }

        // Generate unique Registration ID
        const randomNum = Math.floor(10000 + Math.random() * 90000);
        const registrationID = `AGI-2026-${randomNum}`;
        const timestamp = new Date().toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const registration = {
            id: registrationID,
            name: name,
            roll: roll,
            email: email,
            mobile: mobile,
            branch: branch,
            year: year,
            event: eventName,
            participationType: participationType,
            teamDetails: teamDetails,
            registeredAt: timestamp
        };

        // Save individually and to global array
        localStorage.setItem(registrationID, JSON.stringify(registration));
        allRegistrations.unshift(registration);
        saveAllRegistrations(allRegistrations);

        // Clear stored selectedEvent
        localStorage.removeItem("selectedEvent");

        // Hide form and display digital pass
        form.style.display = "none";
        const formHeader = document.querySelector('.form-header');
        if (formHeader) {
            formHeader.innerHTML = `
                <div style="font-size: 3rem;">🎉</div>
                <h2 style="color: var(--success);">Registration Confirmed!</h2>
                <p>Your entry pass for Accurate Group of Institutions Event has been generated successfully.</p>
            `;
        }

        const resultContainer = document.getElementById("result");
        if (resultContainer) {
            resultContainer.innerHTML = renderTicketHTML(registration);
        }

        showToast("Registration successful! Download your pass below.", "success");
    });
}

// Student Status Lookup Logic (status.html)
function initStatusLookup() {
    const searchBtn = document.getElementById('searchStatusBtn');
    const input = document.getElementById('statusQueryInput');
    const resultDiv = document.getElementById('statusResult');

    if (!searchBtn || !input || !resultDiv) return;

    function doSearch() {
        const query = input.value.trim().toUpperCase();
        if (!query) {
            showToast("Please enter your Registration ID or Roll Number", "error");
            return;
        }

        const all = getAllRegistrations();
        const matches = all.filter(r => 
            r.id.toUpperCase() === query || 
            r.roll.toUpperCase() === query ||
            r.mobile === query
        );

        if (matches.length === 0) {
            resultDiv.innerHTML = `
                <div class="alert alert-error" style="margin-top: 20px;">
                    ❌ No registration found matching "${query}". Please check your Registration ID / Roll Number or register afresh.
                </div>
            `;
            return;
        }

        resultDiv.innerHTML = `
            <div style="margin: 25px 0;">
                <h3 style="color: var(--primary); margin-bottom: 15px;">Found ${matches.length} Registration(s):</h3>
                ${matches.map(reg => renderTicketHTML(reg)).join('<hr style="margin: 40px 0; border: none; border-top: 1px dashed #cbd5e1;">')}
            </div>
        `;
    }

    searchBtn.addEventListener('click', doSearch);
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') doSearch();
    });
}

// Initialize on DOM load
document.addEventListener("DOMContentLoaded", () => {
    // Check if on Home Page
    if (document.getElementById('eventsGrid')) {
        renderHomeEvents();

        // Setup Category Filter Buttons
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const category = btn.getAttribute('data-category');
                const searchVal = document.getElementById('eventSearchInput')?.value || '';
                renderHomeEvents(category, searchVal);
            });
        });

        // Setup Live Search Input
        const searchInput = document.getElementById('eventSearchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const activeBtn = document.querySelector('.filter-btn.active');
                const cat = activeBtn ? activeBtn.getAttribute('data-category') : 'all';
                renderHomeEvents(cat, e.target.value);
            });
        }
    }

    // Check if on Registration Page
    if (document.getElementById('registrationForm')) {
        initRegistrationPage();
    }

    // Check if on Status Page
    if (document.getElementById('statusQueryInput')) {
        initStatusLookup();
    }
});
