document.addEventListener("DOMContentLoaded", function () {

    const records = BP.getRecords();

    const verifiedCount = records.reduce(
        (sum, r) => sum + r.achievements.filter(a => a.status === "verified").length,
        0
    );

    const matchedCount = records.filter(r => r.districtMatch === "matched").length;
    const approvedCount = records.filter(r => r.districtApproved).length;

    document.getElementById("statLearners").textContent = records.length;
    document.getElementById("statVerified").textContent = verifiedCount;
    document.getElementById("statMatched").textContent = matchedCount;
    document.getElementById("statApproved").textContent = approvedCount;

});
