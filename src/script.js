document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM and Habit Tracker loaded!");

  // selecting relevant elements
  const habitInput = document.getElementById("habit-input");
  const addHabitButton = document.getElementById("add-habit-btn");
  const habitList = document.getElementById("habit-list");

  // {name: string, completed: boolean}
  const habits = [];

  // render habits list
  function renderHabits() {
    habitList.innerHTML = ""; // clear current list
    habits.forEach((habit, index) => {
      const habitCard = document.createElement("div");

      // conditional styling based on completion
      const habitCardClass = habit.completed
        ? "bg-green-100 dark:bg-green-800 p-4 rounded shadow flex justify-between items-center"
        : "bg-white dark:bg-gray-800 p-4 rounded shadow flex justify-between items-center";
      habitCard.className = habitCardClass;

      // strikethrough if habit completed
      const habitTitle = document.createElement("span");
      habitTitle.textContent = habit.name;
      if (habit.completed) {
        habitTitle.classList.add("line-through", "text-gray-100");
      }

      // toggle button for habit completion
      const toggleButton = document.createElement("button");
      toggleButton.className =
        "px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600";
      toggleButton.textContent = habit.completed ? "Undo" : "Done";
      toggleButton.addEventListener("click", () => {
        habits[index].completed = !habits[index].completed;
        renderHabits();
      });

      habitCard.appendChild(habitTitle);
      habitCard.appendChild(toggleButton);

      habitList.appendChild(habitCard);
    });
  }

  // handle add habit button
  addHabitButton.addEventListener("click", () => {
    const habitName = habitInput.value.trim();
    if (habitName !== "") {
      habits.push({ name: habitName, completed: false });
      habitInput.value = "";
      renderHabits();
    }
  });
});
