document.addEventListener("DOMContentLoaded", () => {
  const playBtn = document.getElementById("playBtn");
  const easyBtn = document.querySelector(".level-btn-easy");
  const mediumBtn = document.querySelector(".level-btn-medium");
  const hardBtn = document.querySelector(".level-btn-hard");

  // المستوى الافتراضي هو سهل
  let selectedDifficulty = localStorage.getItem("gameDifficulty") || "easy";

  // تحديث الشكل البصري للأزرار بناءً على المستوى المحفوظ
  updateActiveButton(selectedDifficulty);

  // اختيار المستوى "سهل"
  if (easyBtn) {
    easyBtn.addEventListener("click", () => {
      selectedDifficulty = "easy";
      localStorage.setItem("gameDifficulty", selectedDifficulty);
      updateActiveButton(selectedDifficulty);
    });
  }

  // اختيار المستوى "متوسط"
  if (mediumBtn) {
    mediumBtn.addEventListener("click", () => {
      selectedDifficulty = "medium";
      localStorage.setItem("gameDifficulty", selectedDifficulty);
      updateActiveButton(selectedDifficulty);
    });
  }

  // اختيار المستوى "صعب"
  if (hardBtn) {
    hardBtn.addEventListener("click", () => {
      selectedDifficulty = "hard";
      localStorage.setItem("gameDifficulty", selectedDifficulty);
      updateActiveButton(selectedDifficulty);
    });
  }

  // عند الضغط على زر "العب الآن"
  if (playBtn) {
    playBtn.addEventListener("click", () => {
      // الانتقال إلى صفحة اللعبة
      window.location.href = "Card-Match-Game.html";
    });
  }

  // دالة لتعديل تصميم الأزرار عند اختيارها
  function updateActiveButton(level) {
    [easyBtn, mediumBtn, hardBtn].forEach((btn) => {
      if (btn) btn.classList.remove("active");
    });

    if (level === "easy" && easyBtn) easyBtn.classList.add("active");
    if (level === "medium" && mediumBtn) mediumBtn.classList.add("active");
    if (level === "hard" && hardBtn) hardBtn.classList.add("active");
  }
});
