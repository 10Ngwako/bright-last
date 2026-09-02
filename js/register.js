document.addEventListener("DOMContentLoaded", function () {

    const validRoles = ["learner", "teacher", "district", "bursary"];
    const role = validRoles.includes(new URLSearchParams(window.location.search).get("role"))
        ? new URLSearchParams(window.location.search).get("role")
        : "learner";

    document.getElementById("registerTitle").textContent =
        `Register as a ${BP.roles[role].label}`;

    if (!BP.hasConsented(role)) {
        document.getElementById("consentNotice").style.display = "block";
        document.getElementById("consentNotice").querySelector("a").href = `consent.html?role=${role}`;
        document.getElementById("registerFormWrap").style.display = "none";
        return;
    }

    const fieldConfig = {
        learner: { grade: true, idLast4: true, school: true, district: true, orgType: false, orgLabel: "School", nameLabel: "Full Name" },
        teacher: { grade: false, idLast4: false, school: true, district: true, orgType: false, orgLabel: "School", nameLabel: "Full Name" },
        district: { grade: false, idLast4: false, school: true, district: false, orgType: false, orgLabel: "District Office Name", nameLabel: "Full Name" },
        bursary: { grade: false, idLast4: false, school: true, district: false, orgType: true, orgLabel: "Organisation Name", nameLabel: "Contact Person Full Name" }
    };

    const config = fieldConfig[role];

    document.querySelector('[data-field="grade"]').hidden = !config.grade;
    document.querySelector('[data-field="idLast4"]').hidden = !config.idLast4;
    document.querySelector('[data-field="district"]').hidden = !config.district;
    document.querySelector('[data-field="orgType"]').hidden = !config.orgType;

    document.getElementById("district").required = config.district;
    document.getElementById("idLast4").required = config.idLast4;

    document.getElementById("orgLabel").textContent = config.orgLabel;
    document.getElementById("fullNameLabel").textContent = config.nameLabel;

    document.getElementById("registerForm").addEventListener("submit", function (event) {
        event.preventDefault();

        const users = BP.getUsers();
        const email = document.getElementById("email").value.trim().toLowerCase();

        if (users.some(u => u.email === email)) {
            alert("An account with this email already exists. Please log in instead.");
            window.location.href = `login.html?role=${role}`;
            return;
        }

        const user = {
            id: BP.id(),
            role,
            fullName: document.getElementById("fullName").value.trim(),
            email,
            password: document.getElementById("password").value,
            org: document.getElementById("org").value.trim(),
            district: config.district ? document.getElementById("district").value.trim() : "",
            grade: config.grade ? document.getElementById("grade").value : "",
            idLast4: config.idLast4 ? document.getElementById("idLast4").value.trim() : "",
            orgType: config.orgType ? document.getElementById("orgType").value : "",
            consentAccepted: true,
            consentDate: new Date().toISOString(),
            createdAt: new Date().toISOString()
        };

        if (role === "district") {
            user.district = user.org;
        }

        users.push(user);
        BP.saveUsers(users);
        BP.setSession(user.id);

        if (role === "learner") {
            BP.syncLearnerRecord(user);
            window.location.href = "profile.html";
            return;
        }

        window.location.href = BP.dashboardFor(role);
    });

});
