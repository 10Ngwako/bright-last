document.addEventListener("DOMContentLoaded", function () {

    const user = BP.requireRole("learner");
    if (!user) return;

    const form = document.getElementById("achievementForm");
    const achievementList = document.getElementById("achievementList");


    let achievements =
        JSON.parse(
            localStorage.getItem("brightPathAchievements")
        ) || [];


    function displayAchievements() {

        achievementList.innerHTML = "";


        if (achievements.length === 0) {

            achievementList.innerHTML = `
                <div class="info-card">
                    <h3>No achievements yet</h3>

                    <p>
                        Add your first achievement above to start
                        building your BrightPath portfolio.
                    </p>
                </div>
            `;

            return;
        }


        achievements.forEach((achievement, index) => {

            const card = document.createElement("div");

            card.className = "info-card";


            card.innerHTML = `

                <span class="tag">
                    ${achievement.category}
                </span>

                <h3>
                    ${achievement.title}
                </h3>

                <p>
                    <strong>${achievement.organisation}</strong>
                    · ${achievement.year}
                </p>

                <p>
                    ${achievement.description}
                </p>

                ${
                    achievement.evidence
                    ?
                    `<a
                        href="${achievement.evidence}"
                        target="_blank"
                        class="card-button"
                    >
                        View Evidence →
                    </a>`
                    :
                    ""
                }

                <br>

                <button
                    onclick="deleteAchievement(${index})"
                    style="
                        margin-top:15px;
                        border:none;
                        background:none;
                        color:#d64545;
                        cursor:pointer;
                        font-weight:bold;
                    "
                >
                    Remove
                </button>

            `;


            achievementList.appendChild(card);

        });

    }


    form.addEventListener("submit", function (event) {

        event.preventDefault();


        const achievement = {

            id: Date.now(),

            title:
                document.getElementById("title").value,

            category:
                document.getElementById("category").value,

            organisation:
                document.getElementById("organisation").value,

            year:
                document.getElementById("year").value,

            description:
                document.getElementById("description").value,

            evidence:
                document.getElementById("evidence").value

        };


        achievements.push(achievement);


        localStorage.setItem(
            "brightPathAchievements",
            JSON.stringify(achievements)
        );

        BP.syncLearnerRecord(user);

        form.reset();

        document.getElementById("year").value = 2026;

        displayAchievements();

    });


    window.deleteAchievement = function (index) {

        if (!confirm("Remove this achievement?")) {
            return;
        }


        achievements.splice(index, 1);


        localStorage.setItem(
            "brightPathAchievements",
            JSON.stringify(achievements)
        );

        BP.syncLearnerRecord(user);

        displayAchievements();

    };


    displayAchievements();

});