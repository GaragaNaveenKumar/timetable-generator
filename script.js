// Function to capture form inputs and generate timetable
document.getElementById("input-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const days = parseInt(document.getElementById("days").value);
    const hoursPerDay = parseInt(document.getElementById("hoursPerDay").value);
    const subjects = [];

    document.querySelectorAll(".subject-input").forEach((subjectRow) => {
        const name = subjectRow.querySelector(".subject-name").value;
        const weeklyHours = parseInt(subjectRow.querySelector(".subject-hours").value);
        const isLab = subjectRow.querySelector(".subject-lab").checked;
        subjects.push({ name, weeklyHours, isLab });
    });

    const timetable = generateTimetable(days, hoursPerDay, subjects);
    displayTimetable(timetable, days, hoursPerDay);
});

// Add new subject input fields dynamically
document.getElementById("add-subject").addEventListener("click", () => {
    const container = document.getElementById("subjects-container");
    const newSubject = document.createElement("div");
    newSubject.className = "subject-input";
    newSubject.innerHTML = `
        <input type="text" placeholder="Subject Name" class="subject-name" required>
        <input type="number" placeholder="Weekly Hours" class="subject-hours" min="1" required>
        <label>
            Lab?
            <input type="checkbox" class="subject-lab">
        </label>
    `;
    container.appendChild(newSubject);
});

// Generate timetable logic
function generateTimetable(days, hoursPerDay, subjects) {
    const totalHours = days * hoursPerDay;
    const timetable = Array.from({ length: days }, () => Array(hoursPerDay).fill(null));
    const subjectQueue = [];

    subjects.forEach((subject) => {
        for (let i = 0; i < subject.weeklyHours; i++) {
            subjectQueue.push(subject);
        }
    });

    for (let day = 0; day < days; day++) {
        for (let hour = 0; hour < hoursPerDay; hour++) {
            if (!subjectQueue.length) break;
            let subject;
            do {
                subject = subjectQueue.splice(Math.floor(Math.random() * subjectQueue.length), 1)[0];
            } while (
                timetable[day][hour - 1] === subject?.name || // Avoid consecutive subjects
                subject?.isLab && hour + 1 >= hoursPerDay // Avoid splitting labs
            );

            timetable[day][hour] = subject.name;
            if (subject.isLab) {
                hour++; // Skip the next hour for labs
            }
        }
    }
    return timetable;
}

// Display timetable
function displayTimetable(timetable, days, hoursPerDay) {
    const container = document.getElementById("timetable-container");
    container.innerHTML = "";

    const table = document.createElement("table");
    for (let day = 0; day < days; day++) {
        const row = document.createElement("tr");
        row.innerHTML = `<th>Day ${day + 1}</th>`;
        timetable[day].forEach((subject) => {
            const cell = document.createElement("td");
            cell.textContent = subject || "-";
            row.appendChild(cell);
        });
        table.appendChild(row);
    }
    container.appendChild(table);
}
