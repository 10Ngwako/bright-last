document.addEventListener("DOMContentLoaded", function () {


    const achievements =
        JSON.parse(
            localStorage.getItem(
                "brightPathAchievements"
            )
        ) || [];


    const profile =
        JSON.parse(
            localStorage.getItem(
                "brightPathProfile"
            )
        );


    /*
        For the frontend prototype we treat
        the current profile as one student.
    */

    document.getElementById("studentCount")
        .textContent =
        profile ? "1" : "0";


    document.getElementById("achievementCount")
        .textContent =
        achievements.length;


    document.getElementById("careerCount")
        .textContent =
        profile ? "1" : "0";


    const currentYear = new Date()
        .getFullYear()
        .toString();


    const thisYear =
        achievements.filter(
            achievement =>
                achievement.year === currentYear
        );


    document.getElementById("yearCount")
        .textContent =
        thisYear.length;


    /*
        Recent achievements
    */

    const recent =
        document.getElementById(
            "recentAchievements"
        );


    if (achievements.length === 0) {

        recent.innerHTML = `
            <p style="color:#777;">
                No achievements have been submitted yet.
            </p>
        `;

    } else {

        achievements
            .slice()
            .reverse()
            .slice(0, 5)
            .forEach(achievement => {

                const item =
                    document.createElement("div");


                item.className =
                    "admin-achievement";


                item.innerHTML = `

                    <span class="tag">
                        ${achievement.category}
                    </span>

                    <h3>
                        ${achievement.title}
                    </h3>

                    <p>
                        ${achievement.organisation}
                        · ${achievement.year}
                    </p>

                `;


                recent.appendChild(item);

            });

    }


    /*
        Category statistics
    */

    const categories = {};


    achievements.forEach(achievement => {

        if (!categories[achievement.category]) {
            categories[achievement.category] = 0;
        }

        categories[achievement.category]++;

    });


    const categoryStats =
        document.getElementById(
            "categoryStats"
        );


    if (Object.keys(categories).length === 0) {

        categoryStats.innerHTML = `
            <p style="color:#777;">
                No category data available.
            </p>
        `;

        return;

    }


    const maximum =
        Math.max(...Object.values(categories));


    Object.entries(categories).forEach(
        ([category, count]) => {

            const percentage =
                (count / maximum) * 100;


            const row =
                document.createElement("div");


            row.className =
                "category-row";


            row.innerHTML = `

                <div class="category-label">

                    <span>
                        ${category}
                    </span>

                    <strong>
                        ${count}
                    </strong>

                </div>

                <div class="category-bar">

                    <div
                        style="width:${percentage}%"
                    ></div>

                </div>

            `;


            categoryStats.appendChild(row);

        }
    );

});