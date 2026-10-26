
const workoutForm = document.getElementById("workoutForm");
const workoutList = document.getElementById("workoutList");

let workouts = JSON.parse(
    localStorage.getItem("workouts") || "[]"
);

let dailyProgress = JSON.parse(
    localStorage.getItem("dailyProgress") || "{}"
);

// Add a new workout
workoutForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const exercise = document.getElementById("exercise").value;
    const duration = Number(
        document.getElementById("duration").value
    );
    const calories = Number(
        document.getElementById("calories").value
    );

    if (!Number.isFinite(duration) || duration <= 0 ||
        !Number.isFinite(calories) || calories < 0) {
        return;
    }

    const workout = {
        id: crypto.randomUUID(),
        exercise: exercise,
        duration: duration,
        calories: calories,
        date: new Date().toLocaleDateString()
    };

    workouts.push(workout);
    saveWorkouts();
    displayWorkouts();
    updateStats();

    workoutForm.reset();
});

// Save workouts to browser storage
function saveWorkouts() {
    localStorage.setItem("workouts", JSON.stringify(workouts));
}

// Display all workouts
function displayWorkouts() {
    workoutList.innerHTML = "";

    workouts.forEach(function(workout) {
        const li = document.createElement("li");
        const details = document.createElement("span");

        details.textContent =
            `${workout.exercise} - ${workout.duration} min - ` +
            `${workout.calories} calories (${workout.date})`;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "deleteBtn";

        deleteButton.addEventListener("click", function() {
            deleteWorkout(workout.id);
        });

        li.appendChild(details);
        li.appendChild(deleteButton);
        workoutList.appendChild(li);
    });
}

// Delete a workout
function deleteWorkout(id) {
    workouts = workouts.filter(function(workout) {
        return workout.id !== id;
    });

    saveWorkouts();
    displayWorkouts();
    updateStats();
}

// Calculate dashboard statistics
function updateStats() {
    const totalWorkouts = workouts.length;

    const totalMinutes = workouts.reduce(
        (total, workout) => total + workout.duration, 0
    );

    const totalCalories = workouts.reduce(
        (total, workout) => total + workout.calories, 0
    );

    document.getElementById("totalWorkouts").textContent =
        totalWorkouts;

    document.getElementById("totalMinutes").textContent =
        totalMinutes;

    document.getElementById("totalCalories").textContent =
        totalCalories;
}

// Save daily health information
document.getElementById("saveHealth").addEventListener(
    "click", function() {
        const steps = document.getElementById("steps").value;
        const water = document.getElementById("water").value;
        const weight = document.getElementById("weight").value;

        if ([steps, water, weight].some(
            value => value !== "" &&
            (!Number.isFinite(Number(value)) || Number(value) < 0)
        )) {
            document.getElementById("saveMessage").textContent =
                "Please enter valid nonnegative numbers.";
            return;
        }

        const today = new Date().toLocaleDateString("en-CA");

        dailyProgress[today] = {
            steps: steps,
            water: water,
            weight: weight
        };

        localStorage.setItem(
            "dailyProgress",
            JSON.stringify(dailyProgress)
        );

        document.getElementById("saveMessage").textContent =
            "Daily progress saved!";
    }
);

// Load today's saved progress
function loadDailyProgress() {
    const today = new Date().toLocaleDateString("en-CA");
    const progress = dailyProgress[today];

    if (progress) {
        document.getElementById("steps").value = progress.steps;
        document.getElementById("water").value = progress.water;
        document.getElementById("weight").value = progress.weight;
    }
}

// Load saved data when website opens
displayWorkouts();
updateStats();
loadDailyProgress();
