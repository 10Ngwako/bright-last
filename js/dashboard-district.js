document.addEventListener("DOMContentLoaded", function () {

    const user = BP.requireRole("district");
    if (!user) return;

    document.getElementById("districtIntro").textContent =
        `Match learner portfolios against official records for ${user.district}, and approve verified portfolios for bursary/university access.`;

    function render() {
        const records = BP.getRecords();
        const myDistrict = (user.district || "").trim().toLowerCase();
        const myRecords = records.filter(r => (r.district || "").trim().toLowerCase() === myDistrict);

        const emptyNotice = document.getElementById("emptyNotice");
        const tableWrap = document.getElementById("tableWrap");

        if (myRecords.length === 0) {
            const demoDistricts = [...new Set(records.map(r => r.district).filter(Boolean))];
            emptyNotice.style.display = "block";
            emptyNotice.innerHTML = `No learner records found for "<strong>${user.district}</strong>" yet.
                Sample districts currently in the system: ${demoDistricts.join(", ")}.`;
            tableWrap.style.display = "none";
            return;
        }

        emptyNotice.style.display = "none";
        tableWrap.style.display = "block";

        const rows = document.getElementById("recordRows");
        rows.innerHTML = "";

        myRecords.forEach(record => {
            const verifiedCount = record.achievements.filter(a => a.status === "verified").length;
            const canApprove = record.districtMatch === "matched" && verifiedCount > 0 && !record.districtApproved;

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${record.name}</td>
                <td>${record.school}</td>
                <td>${record.grade || "-"}</td>
                <td>${record.idLast4 || "-"}</td>
                <td>${verifiedCount} / ${record.achievements.length}</td>
                <td><span class="status-badge status-${record.districtMatch}">${record.districtMatch}</span></td>
                <td><span class="status-badge status-${record.districtApproved ? "approved" : "pending"}">${record.districtApproved ? "approved" : "not approved"}</span></td>
                <td>
                    <div class="table-actions">
                        <button class="small-button" data-action="match" data-user="${record.userId}" ${record.districtMatch === "matched" ? "disabled" : ""}>Run Match Check</button>
                        <button class="small-button success" data-action="approve" data-user="${record.userId}" ${canApprove ? "" : "disabled"}>Approve</button>
                        <button class="small-button danger" data-action="revoke" data-user="${record.userId}" ${record.districtApproved ? "" : "disabled"}>Revoke</button>
                    </div>
                </td>
            `;
            rows.appendChild(tr);
        });

        rows.querySelectorAll("button[data-action]").forEach(btn => {
            btn.addEventListener("click", () => handleAction(btn.dataset.action, btn.dataset.user));
        });
    }

    function handleAction(action, userId) {
        const records = BP.getRecords();
        const record = records.find(r => r.userId === userId);
        if (!record) return;

        if (action === "match") {
            record.districtMatch = record.idLast4 ? "matched" : "unmatched";
        } else if (action === "approve") {
            record.districtApproved = true;
        } else if (action === "revoke") {
            record.districtApproved = false;
        }

        BP.saveRecords(records);
        render();
    }

    render();

});
