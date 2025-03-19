document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM and Habit Tracker loaded!");

  // selecting relevant elements
  const habitInput = document.getElementById("habit-input");
  const addHabitButton = document.getElementById("add-habit-btn");
  const habitList = document.getElementById("habit-list");

  const habits = [];

  // render habits list
  function renderHabits() {
    habitList.innerHTML = ""; // clear current list
    habits.forEach((habit) => {
      const habitCard = document.createElement("div");
      habitCard.className =
        "bg-white dark:bg-gray-800 p-4 rounded shadow flex justify-between items-center";
      habitCard.innerHTML = `<span>${habit}</span>`;
      habitList.appendChild(habitCard);
    });
  }

  // handle add habit button
  addHabitButton.addEventListener("click", () => {
    const habitName = habitInput.value.trim();
    if (habitName !== "") {
      habits.push(habitName);
      habitInput.value = "";
      renderHabits();
    }
  });
});
