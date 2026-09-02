/*
    BrightPath shared auth + data layer.

    This is a frontend-only prototype: there is no server, so
    "accounts" and "records" live in localStorage in this browser.
    Passwords are stored in plain text here only because there is
    no backend to hash them against - this must never ship as-is.
*/

const BP = {

    keys: {
        users: "brightPathUsers",
        session: "brightPathSession",
        consent: "brightPathConsent",
        records: "brightPathRecords",
        seeded: "brightPathSeeded",
        profile: "brightPathProfile",
        achievements: "brightPathAchievements"
    },

    roles: {
        learner: { label: "Learner", icon: "🎓" },
        teacher: { label: "Teacher", icon: "🧑‍🏫" },
        district: { label: "District", icon: "🏛️" },
        bursary: { label: "Bursary / University", icon: "🏢" }
    },

    dashboardFor(role) {
        return {
            learner: "portfolio.html",
            teacher: "dashboard-teacher.html",
            district: "dashboard-district.html",
            bursary: "dashboard-bursary.html"
        }[role];
    },

    id() {
        return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    },

    getUsers() {
        return JSON.parse(localStorage.getItem(this.keys.users)) || [];
    },

    saveUsers(users) {
        localStorage.setItem(this.keys.users, JSON.stringify(users));
    },

    getRecords() {
        return JSON.parse(localStorage.getItem(this.keys.records)) || [];
    },

    saveRecords(records) {
        localStorage.setItem(this.keys.records, JSON.stringify(records));
    },

    getSession() {
        return JSON.parse(localStorage.getItem(this.keys.session));
    },

    setSession(userId) {
        localStorage.setItem(this.keys.session, JSON.stringify({ userId }));
    },

    clearSession() {
        localStorage.removeItem(this.keys.session);
    },

    currentUser() {
        const session = this.getSession();
        if (!session) return null;
        return this.getUsers().find(u => u.id === session.userId) || null;
    },

    hasConsented(role) {
        const consent = JSON.parse(localStorage.getItem(this.keys.consent)) || {};
        return !!consent[role];
    },

    setConsent(role) {
        const consent = JSON.parse(localStorage.getItem(this.keys.consent)) || {};
        consent[role] = { accepted: true, date: new Date().toISOString() };
        localStorage.setItem(this.keys.consent, JSON.stringify(consent));
    },

    /*
        Every logged-in role guard: redirects to login if there is
        no session, or if the session role does not match.
    */
    requireRole(role) {
        const user = this.currentUser();
        if (!user || user.role !== role) {
            window.location.href = `login.html?role=${role}`;
            return null;
        }
        return user;
    },

    logout() {
        this.clearSession();
        window.location.href = "index.html";
    },

    /*
        Keeps the single learner-profile/achievements keys (used by
        profile.html, potential.html, achievements.html) in sync with
        that learner's shared record, so teachers/districts/bursaries
        see the same data the learner is building. Achievement
        verification status is preserved across re-syncs by matching
        on achievement id.
    */
    syncLearnerRecord(user) {
        const profile = JSON.parse(localStorage.getItem(this.keys.profile));
        const achievements = JSON.parse(localStorage.getItem(this.keys.achievements)) || [];

        const records = this.getRecords();
        let record = records.find(r => r.userId === user.id);

        if (!record) {
            record = {
                userId: user.id,
                name: user.fullName,
                grade: user.grade || "",
                school: user.org || "",
                district: user.district || "",
                idLast4: user.idLast4 || "",
                interest: "",
                academicAverage: null,
                achievements: [],
                districtMatch: "pending",
                districtApproved: false
            };
            records.push(record);
        }

        record.name = user.fullName;
        record.grade = user.grade || record.grade;
        record.school = user.org || record.school;
        record.idLast4 = user.idLast4 || record.idLast4;

        if (profile) {
            record.interest = profile.interest;
            const marks = Object.values(profile.marks || {}).filter(m => m > 0);
            record.academicAverage = marks.length
                ? Math.round(marks.reduce((a, b) => a + b, 0) / marks.length)
                : null;
            record.grade = profile.grade || record.grade;
        }

        record.achievements = achievements.map(a => {
            const existing = record.achievements.find(e => e.id === a.id);
            return {
                ...a,
                status: existing ? existing.status : "pending",
                verifierNote: existing ? existing.verifierNote : ""
            };
        });

        this.saveRecords(records);
        return record;
    },

    /*
        Seeds a handful of illustrative Limpopo learner records so
        teacher / district / bursary dashboards are demonstrable
        before any real learner has registered. Runs once per browser.
    */
    seedDemoData() {
        if (localStorage.getItem(this.keys.seeded)) return;

        const demoRecords = [
            {
                userId: "demo-1",
                name: "Rendani Mulaudzi",
                grade: "12",
                school: "Mbilwi Secondary School",
                district: "Vhembe East",
                idLast4: "0421",
                interest: "technology",
                academicAverage: 78,
                achievements: [
                    { id: 1, title: "Provincial Coding Olympiad Finalist", category: "Technology", organisation: "Limpopo DBE", year: "2025", description: "Reached the provincial final building a mobile app for local farmers.", evidence: "", status: "verified", verifierNote: "Certificate confirmed with school." },
                    { id: 2, title: "Class Representative", category: "Leadership", organisation: "Mbilwi Secondary School", year: "2025", description: "Elected class representative for two consecutive years.", evidence: "", status: "pending", verifierNote: "" }
                ],
                districtMatch: "matched",
                districtApproved: true
            },
            {
                userId: "demo-2",
                name: "Lesedi Manamela",
                grade: "11",
                school: "Mokopane High School",
                district: "Mogalakwena",
                idLast4: "1187",
                interest: "business",
                academicAverage: 71,
                achievements: [
                    { id: 3, title: "Young Entrepreneur Bootcamp", category: "Entrepreneurship", organisation: "Limpopo Economic Development Agency", year: "2025", description: "Completed a 3-week bootcamp and pitched a small poultry business plan.", evidence: "", status: "verified", verifierNote: "Attendance certificate sighted." }
                ],
                districtMatch: "matched",
                districtApproved: false
            },
            {
                userId: "demo-3",
                name: "Kagiso Baloyi",
                grade: "12",
                school: "Nkowankowa Secondary School",
                district: "Mopani East",
                idLast4: "0965",
                interest: "health",
                academicAverage: 68,
                achievements: [
                    { id: 4, title: "First Aid Certification", category: "Certification", organisation: "St John Ambulance", year: "2024", description: "Completed accredited first aid and basic life support training.", evidence: "", status: "pending", verifierNote: "" },
                    { id: 5, title: "School Debate Team Captain", category: "Leadership", organisation: "Nkowankowa Secondary School", year: "2025", description: "Captained the debate team to the district semi-final.", evidence: "", status: "rejected", verifierNote: "No supporting evidence provided yet - resubmit with certificate." }
                ],
                districtMatch: "pending",
                districtApproved: false
            }
        ];

        this.saveRecords(demoRecords);
        localStorage.setItem(this.keys.seeded, "true");
    },

    /*
        Renders the login/register or dashboard/logout controls into
        the #navAuth element present on every page that includes
        this script.
    */
    renderNavAuth() {
        const target = document.getElementById("navAuth");
        if (!target) return;

        const user = this.currentUser();

        if (!user) {
            target.innerHTML = `
                <a href="login.html" class="nav-ghost">Log in</a>
                <a href="register.html" class="nav-button">Register</a>
            `;
            return;
        }

        const role = this.roles[user.role];

        target.innerHTML = `
            <span class="nav-user">${role.icon} ${user.fullName.split(" ")[0]} · ${role.label}</span>
            <a href="${this.dashboardFor(user.role)}" class="nav-button">Dashboard</a>
            <a href="#" id="logoutLink" class="nav-ghost">Log out</a>
        `;

        document.getElementById("logoutLink").addEventListener("click", (e) => {
            e.preventDefault();
            this.logout();
        });
    }
};

document.addEventListener("DOMContentLoaded", function () {
    BP.seedDemoData();
    BP.renderNavAuth();
});
