document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM and Habit Tracker loaded!");

  // selecting relevant elements
  const habitInput = document.getElementById("habit-input");
  const addHabitButton = document.getElementById("add-habit-btn");
  const habitList = document.getElementById("habit-list");

  // {name: string, history: {'YYYY-MM-DD': boolean}}
  let habits = [];

  // get date in proper format
  function getTodayDate() {
    return new Date().toISOString().split("T")[0];
  }

  console.log(getTodayDate());

  // save habits to localStorage
  function saveHabits() {
    localStorage.setItem("habits", JSON.stringify(habits));
  }

  // load existing habits from localStorage
  function loadhabits() {
    const storedHabits = localStorage.getItem("habits");
    if (storedHabits) {
      habits = JSON.parse(storedHabits);
    }
  }

  // count days in last x (7) days for which habit is completed
  function getWeeklyProgress(habit, period = 7) {
    const today = new Date();
    let count = 0;
    for (let i = 0; i < period; ++i) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split("T")[0];
      if (habit.history && habit.history[dateString]) {
        count++;
      }
    }
    return count;
  }

  // render habits list
  function renderHabits() {
    habitList.innerHTML = ""; // clear current list
    habits.forEach((habit, index) => {
      const todayString = getTodayDate();
      const todayCompleted = habit.history && habit.history[todayString];

      const habitCard = document.createElement("div");

      // conditional styling based on completion
      const habitCardClass = todayCompleted
        ? "bg-green-100 dark:bg-green-800 p-4 rounded shadow "
        : "bg-white dark:bg-gray-800 p-4 rounded shadow";
      habitCard.className = habitCardClass + " flex flex-col space-y-2";

      // habit name and toggle
      const topRow = document.createElement("div");
      topRow.className = "flex justify-between items-center";

      // strikethrough if habit completed
      const habitTitle = document.createElement("span");
      habitTitle.textContent = habit.name;
      if (todayCompleted) {
        habitTitle.classList.add("line-through", "text-gray-100");
      }

      // toggle button for habit completion
      const toggleButton = document.createElement("button");
      toggleButton.className =
        "px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600";
      toggleButton.textContent = todayCompleted ? "Undo" : "Done";

      toggleButton.addEventListener("click", () => {
        if (!habit.history) habit.history = {};
        habit.history[todayString] = !todayCompleted;
        saveHabits();
        renderHabits();
      });

      topRow.appendChild(habitTitle);
      topRow.appendChild(toggleButton);

      // weekly progress display
      const weeklyProgress = getWeeklyProgress(habit);
      const progressText = document.createElement("div");
      progressText.className = "text-sm text-gray-600 dark:text-gray-300";
      progressText.textContent = `Weekly Progress: ${weeklyProgress} / 7 days`;

      // final assembly
      habitCard.appendChild(topRow);
      habitCard.appendChild(progressText);

      habitList.appendChild(habitCard);
    });
  }

  // handle add habit button
  addHabitButton.addEventListener("click", () => {
    const habitName = habitInput.value.trim();
    if (habitName !== "") {
      habits.push({ name: habitName, completed: false });
      habitInput.value = "";
      saveHabits();
      renderHabits();
    }
  });

  // initial => load and display
  loadhabits();
  renderHabits();
});
