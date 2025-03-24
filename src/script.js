document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM and Habit Tracker loaded!");

  // selecting relevant elements
  const habitInput = document.getElementById("habit-input");
  const addHabitButton = document.getElementById("add-habit-btn");
  const habitList = document.getElementById("habit-list");
  const themeToggle = document.getElementById("theme-toggle");

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

      // habit name and action buttons
      const topRow = document.createElement("div");
      topRow.className = "flex justify-between items-center";

      // strikethrough if habit completed
      const habitTitle = document.createElement("span");
      habitTitle.textContent = habit.name;
      if (todayCompleted) {
        habitTitle.classList.add("line-through", "text-gray-100");
      }

      const buttonContainer = document.createElement("div");
      buttonContainer.className = "flex items-center space-x-2";

      // toggle button for habit completion
      const toggleButton = document.createElement("button");
      toggleButton.className =
        "px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 flex items-center";
      toggleButton.innerHTML = todayCompleted
        ? `<i data-lucide="x-circle" class="w-4 h-4 mr-1"></i> Undo`
        : `<i data-lucide="check-circle" class="w-4 h-4 mr-1"></i> Done`;

      toggleButton.addEventListener("click", () => {
        if (!habit.history) habit.history = {};
        habit.history[todayString] = !todayCompleted;
        saveHabits();
        renderHabits();
      });

      // delete button for habit deletion
      const deleteButton = document.createElement("button");
      deleteButton.className =
        "px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 flex items-center";
      deleteButton.innerHTML = `<i data-lucide="trash-2" class="w-4 h-4 mr-1"></i> Delete`;

      deleteButton.addEventListener("click", () => {
        habits.splice(index, 1);
        saveHabits();
        renderHabits();
      });

      buttonContainer.appendChild(toggleButton);
      buttonContainer.appendChild(deleteButton);

      topRow.appendChild(habitTitle);
      topRow.appendChild(buttonContainer);

      // weekly progress display
      const weeklyProgress = getWeeklyProgress(habit);
      const progressText = document.createElement("div");
      progressText.className = "text-sm text-gray-600 dark:text-gray-300";
      progressText.textContent = `Weekly Progress: ${weeklyProgress} / 7 days`;

      // final assembly
      habitCard.appendChild(topRow);
      habitCard.appendChild(progressText);

      habitList.appendChild(habitCard);

      // initialize lucide icons for dynamically added elements
      if (window.lucide) {
        lucide.createIcons();
      }
    });
  }

  function updateThemeIcon() {
    if (document.body.classList.contains("dark")) {
      themeToggle.innerHTML = `<i data-lucide="sun" class="w-5 h-5"></i>`;
    } else {
      themeToggle.innerHTML = `<i data-lucide="moon" class="w-5 h-5"></i>`;
    }
    if (window.lucide) {
      lucide.createIcons();
    }
  }

  function loadTheme() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme == "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
    updateThemeIcon();
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

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem(
      "theme",
      document.body.classList.contains("dark") ? "dark" : "light"
    );
    updateThemeIcon();
  });

  // initial => load and display
  loadTheme();
  loadhabits();
  renderHabits();
  // initialize lucide icons for static elements
  if (window.lucide) {
    lucide.createIcons();
  }
});
