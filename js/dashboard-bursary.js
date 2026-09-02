document.addEventListener("DOMContentLoaded", function () {

    const user = BP.requireRole("bursary");
    if (!user) return;

    const logKey = "brightPathAccessLog";

    function getLog() {
        return JSON.parse(localStorage.getItem(logKey)) || [];
    }

    function hasRequested(learnerUserId) {
        return getLog().some(l => l.bursaryUserId === user.id && l.learnerUserId === learnerUserId);
    }

    function logRequest(learnerUserId) {
        const log = getLog();
        log.push({ bursaryUserId: user.id, learnerUserId, timestamp: new Date().toISOString() });
        localStorage.setItem(logKey, JSON.stringify(log));
    }

    function maskName(name) {
        return name.split(" ").map(part => part[0] + ".").join(" ");
    }

    function render() {
        const approved = BP.getRecords().filter(r => r.districtApproved);
        const container = document.getElementById("learnerCards");
        const emptyNotice = document.getElementById("emptyNotice");

        container.innerHTML = "";

        if (approved.length === 0) {
            emptyNotice.style.display = "block";
            return;
        }

        emptyNotice.style.display = "none";

        approved.forEach(record => {
            const verified = record.achievements.filter(a => a.status === "verified");
            const revealed = hasRequested(record.userId);

            const card = document.createElement("div");
            card.className = "info-card";
            card.innerHTML = `
                <span class="tag">GRADE ${record.grade || "-"}</span>
                <span class="status-badge status-approved" style="margin-left:6px;">District approved</span>
                <h3>${revealed ? record.name : maskName(record.name)}</h3>
                <p>${record.school} · ${record.district}</p>
                <p>${verified.length} verified achievement${verified.length === 1 ? "" : "s"} · Interest: ${record.interest || "-"}</p>
                ${revealed ? `
                    <div style="margin-top:10px;">
                        ${verified.length ? verified.map(a => `
                            <p style="font-size:13px; margin:8px 0;">
                                <strong>${a.title}</strong> - ${a.organisation} (${a.year})<br>
                                <span style="color:var(--text);">${a.description}</span>
                            </p>
                        `).join("") : "<p style='font-size:13px; color:var(--text);'>No verified achievements yet.</p>"}
                    </div>
                ` : `
                    <button class="secondary-button request-btn" data-user="${record.userId}" style="margin-top:12px; cursor:pointer;">
                        Request Access
                    </button>
                `}
            `;
            container.appendChild(card);
        });

        container.querySelectorAll(".request-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                logRequest(btn.dataset.user);
                render();
            });
        });
    }

    render();

});
