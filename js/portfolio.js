document.addEventListener("DOMContentLoaded", function () {

    const user = BP.requireRole("learner");
    if (!user) return;

    const record = BP.syncLearnerRecord(user);

    const profileData = localStorage.getItem(BP.keys.profile);

    if (!profileData) {
        document.getElementById("portfolioName").textContent = "Profile not created";
        document.getElementById("portfolioDetails").textContent = "Complete your profile first.";
        document.getElementById("downloadBtn").disabled = true;
        return;
    }

    const profile = JSON.parse(profileData);

    document.getElementById("studentName").textContent = `${profile.name}'s Portfolio`;
    document.getElementById("portfolioName").textContent = `${profile.name} ${profile.surname}`;
    document.getElementById("portfolioDetails").textContent =
        `Grade ${profile.grade} · ${record.school || "School not set"} · ${record.district || "District not set"}`;
    document.getElementById("interest").textContent = profile.interest;

    const verifiedCount = record.achievements.filter(a => a.status === "verified").length;
    document.getElementById("achievementCount").textContent =
        `${verifiedCount} / ${record.achievements.length}`;

    if (record.academicAverage !== null) {
        document.getElementById("academicScore").textContent = `${record.academicAverage}%`;
    }

    const matchBadge = document.getElementById("matchBadge");
    const matchLabels = { matched: "District match: confirmed", unmatched: "District match: not found", pending: "District match: pending" };
    matchBadge.textContent = matchLabels[record.districtMatch] || matchLabels.pending;
    matchBadge.classList.add(record.districtMatch === "matched" ? "status-matched" : record.districtMatch === "unmatched" ? "status-unmatched" : "status-pending");

    const approvalBadge = document.getElementById("approvalBadge");
    approvalBadge.textContent = record.districtApproved
        ? "Bursary/University access: approved"
        : "Bursary/University access: not approved";
    approvalBadge.classList.add(record.districtApproved ? "status-approved" : "status-pending");

    const container = document.getElementById("portfolioAchievements");

    const statusLabel = { pending: "Pending", verified: "Verified", rejected: "Needs attention" };

    if (record.achievements.length === 0) {
        container.innerHTML = `
            <div class="info-card">
                <h3>Start building your portfolio</h3>
                <p>Your achievements will appear here.</p>
            </div>
        `;
    } else {
        record.achievements.forEach(achievement => {
            const card = document.createElement("div");
            card.className = "info-card";
            card.innerHTML = `
                <span class="status-badge status-${achievement.status}">${statusLabel[achievement.status]}</span>
                <h3>${achievement.title}</h3>
                <p>${achievement.organisation} · ${achievement.year}</p>
                <p>${achievement.description}</p>
                ${achievement.verifierNote ? `<p style="font-size:12px; color:var(--text);"><strong>Teacher note:</strong> ${achievement.verifierNote}</p>` : ""}
            `;
            container.appendChild(card);
        });
    }

    const downloadBtn = document.getElementById("downloadBtn");
    const downloadNote = document.getElementById("downloadNote");
    const isGrade12 = profile.grade === "12";

    if (!isGrade12) {
        downloadBtn.disabled = true;
        downloadNote.textContent = "Downloading your portfolio as a referral letter becomes available once you reach Grade 12.";
    } else {
        downloadNote.textContent = "Available now that you are in Grade 12. This will open your browser's print dialog - choose \"Save as PDF\" to download.";
    }

    downloadBtn.addEventListener("click", function () {
        if (!isGrade12) return;

        document.getElementById("letterName").textContent = `${profile.name} ${profile.surname}`;
        document.getElementById("letterGrade").textContent = profile.grade;
        document.getElementById("letterSchool").textContent = record.school || "-";
        document.getElementById("letterDistrict").textContent = record.district || "-";
        document.getElementById("letterMatch").textContent = matchLabels[record.districtMatch] || matchLabels.pending;
        document.getElementById("letterAcademic").textContent =
            record.academicAverage !== null ? `${record.academicAverage}%` : "-";
        document.getElementById("letterDate").textContent = new Date().toLocaleDateString("en-ZA", { year: "numeric", month: "long", day: "numeric" });

        const verified = record.achievements.filter(a => a.status === "verified");
        const letterAchievements = document.getElementById("letterAchievements");

        letterAchievements.innerHTML = verified.length
            ? verified.map(a => `
                <p style="margin:10px 0;">
                    <strong>${a.title}</strong> - ${a.organisation} (${a.year})<br>
                    <span style="font-size:13px; color:#56556a;">${a.description}</span>
                </p>
            `).join("")
            : "<p>No achievements have been verified yet.</p>";

        window.print();
    });

});
