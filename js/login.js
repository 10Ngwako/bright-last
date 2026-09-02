document.addEventListener("DOMContentLoaded", function () {

    const tabButtons = document.querySelectorAll(".tab-button");
    const roleInput = document.getElementById("loginRole");
    const registerLink = document.getElementById("registerLink");
    const errorBox = document.getElementById("loginError");

    function selectRole(role) {
        tabButtons.forEach(btn => btn.classList.toggle("active", btn.dataset.role === role));
        roleInput.value = role;
        registerLink.href = `consent.html?role=${role}`;
        errorBox.style.display = "none";
    }

    tabButtons.forEach(btn => {
        btn.addEventListener("click", () => selectRole(btn.dataset.role));
    });

    const validRoles = ["learner", "teacher", "district", "bursary"];
    const requestedRole = new URLSearchParams(window.location.search).get("role");
    selectRole(validRoles.includes(requestedRole) ? requestedRole : "learner");

    document.getElementById("loginForm").addEventListener("submit", function (event) {
        event.preventDefault();

        const role = roleInput.value;
        const email = document.getElementById("email").value.trim().toLowerCase();
        const password = document.getElementById("password").value;

        const user = BP.getUsers().find(
            u => u.email === email && u.role === role
        );

        if (!user || user.password !== password) {
            errorBox.textContent = "No matching account found for this role. Check your details, or register below.";
            errorBox.style.display = "block";
            return;
        }

        BP.setSession(user.id);

        if (role === "learner") {
            BP.syncLearnerRecord(user);
        }

        window.location.href = BP.dashboardFor(role);
    });

});
