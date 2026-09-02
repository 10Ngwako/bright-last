document.addEventListener("DOMContentLoaded", function () {

    const user = BP.requireRole("teacher");
    if (!user) return;

    document.getElementById("teacherIntro").textContent =
        `Review and verify achievements submitted by learners at ${user.org}.`;

    function render() {
        const records = BP.getRecords();
        const mySchool = (user.org || "").trim().toLowerCase();
        const myRecords = records.filter(r => (r.school || "").trim().toLowerCase() === mySchool);

        const emptyNotice = document.getElementById("emptyNotice");
        const tableWrap = document.getElementById("tableWrap");

        if (myRecords.length === 0) {
            const demoSchools = [...new Set(records.map(r => r.school).filter(Boolean))];
            emptyNotice.style.display = "block";
            emptyNotice.innerHTML = `No learner records found for "<strong>${user.org}</strong>" yet.
                Achievements can only be verified for learners registered under your exact school name.
                Sample schools currently in the system: ${demoSchools.join(", ")}.`;
            tableWrap.style.display = "none";
            return;
        }

        emptyNotice.style.display = "none";
        tableWrap.style.display = "block";

        const rows = document.getElementById("achievementRows");
        rows.innerHTML = "";

        myRecords.forEach(record => {
            record.achievements.forEach(achievement => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${record.name}</td>
                    <td>${record.school}</td>
                    <td>${achievement.title}</td>
                    <td>${achievement.category}</td>
                    <td>${achievement.year}</td>
                    <td><span class="status-badge status-${achievement.status}">${achievement.status}</span></td>
                    <td>
                        <div class="table-actions">
                            <button class="small-button success" data-action="verify" data-user="${record.userId}" data-id="${achievement.id}" ${achievement.status === "verified" ? "disabled" : ""}>Verify</button>
                            <button class="small-button danger" data-action="reject" data-user="${record.userId}" data-id="${achievement.id}" ${achievement.status === "rejected" ? "disabled" : ""}>Reject</button>
                        </div>
                    </td>
                `;
                rows.appendChild(tr);
            });
        });

        rows.querySelectorAll("button[data-action]").forEach(btn => {
            btn.addEventListener("click", () => {
                const action = btn.dataset.action;
                const status = action === "verify" ? "verified" : "rejected";
                let note = "";

                if (action === "reject") {
                    note = prompt("Add a note explaining why this achievement needs attention (optional):") || "";
                } else {
                    note = "Verified by teacher.";
                }

                updateAchievementStatus(btn.dataset.user, Number(btn.dataset.id) || btn.dataset.id, status, note);
            });
        });
    }

    function updateAchievementStatus(userId, achievementId, status, note) {
        const records = BP.getRecords();
        const record = records.find(r => r.userId === userId);
        if (!record) return;

        const achievement = record.achievements.find(a => String(a.id) === String(achievementId));
        if (!achievement) return;

        achievement.status = status;
        achievement.verifierNote = note;

        BP.saveRecords(records);
        render();
    }

    render();

});
