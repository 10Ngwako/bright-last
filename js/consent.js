document.addEventListener("DOMContentLoaded", function () {

    const tabButtons = document.querySelectorAll(".tab-button");
    const panels = document.querySelectorAll(".tab-panel");

    function showRole(role) {
        tabButtons.forEach(btn => btn.classList.toggle("active", btn.dataset.role === role));
        panels.forEach(panel => panel.classList.toggle("active", panel.dataset.role === role));
    }

    tabButtons.forEach(btn => {
        btn.addEventListener("click", () => showRole(btn.dataset.role));
    });

    const requestedRole = new URLSearchParams(window.location.search).get("role");
    const validRoles = ["learner", "teacher", "district", "bursary"];
    showRole(validRoles.includes(requestedRole) ? requestedRole : "learner");

    validRoles.forEach(role => {
        const checkbox = document.getElementById(`agree-${role}`);
        const button = document.querySelector(`.continue-btn[data-role="${role}"]`);

        checkbox.addEventListener("change", () => {
            button.disabled = !checkbox.checked;
        });

        button.addEventListener("click", () => {
            BP.setConsent(role);
            window.location.href = `register.html?role=${role}`;
        });
    });

});
