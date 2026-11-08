document.addEventListener("DOMContentLoaded", () => {
  // تحديد العناصر الأساسية من الصفحة
  const modeOptions = document.querySelectorAll(".mode-option");
  const startBtn = document.querySelector(".btn-start");
  const backBtn = document.querySelector(".btn-back");

  // دالة لإعادة تعيين الاختيار إلى الوضع الافتراضي الموجود في الـ HTML
  function resetToDefaultMode() {
    const defaultCheckedRadio =
      document.querySelector('input[name="play_mode"][checked]') ||
      document.querySelector('input[name="play_mode"]');
    if (defaultCheckedRadio) {
      defaultCheckedRadio.checked = true;
      modeOptions.forEach((opt) => opt.classList.remove("selected"));
      const parentOption = defaultCheckedRadio.closest(".mode-option");
      if (parentOption) {
        parentOption.classList.add("selected");
      }
    }
  }

  // 0. تطبيق القيمة الافتراضية عند تحميل الصفحة لأول مرة
  resetToDefaultMode();

  // التعامل مع العودة إلى هذه الصفحة عبر زر الرجوع في المتصفح (BFCache) بدون الحاجة لتحديث
  window.addEventListener("pageshow", (event) => {
    if (
      event.persisted ||
      performance.getEntriesByType("navigation")[0]?.type === "back_forward"
    ) {
      resetToDefaultMode();
    }
  });

  // 1. تحديث شكل الاختيار بصرياً عند النقر على أي بطاقة وضع لعب
  modeOptions.forEach((option) => {
    const radio = option.querySelector('input[type="radio"]');

    // عند النقر على العنصر بالكامل
    option.addEventListener("click", (e) => {
      // منع تداخل الحدث إذا تم النقر مباشرة على الـ input
      if (e.target !== radio) {
        radio.checked = true;
      }
      modeOptions.forEach((opt) => opt.classList.remove("selected"));
      option.classList.add("selected");
    });

    // متابعة التغيير المباشر في الـ radio buttons
    radio.addEventListener("change", () => {
      if (radio.checked) {
        modeOptions.forEach((opt) => opt.classList.remove("selected"));
        option.classList.add("selected");
      }
    });
  });

  // 2. التعامل مع زر "ابدأ اللعب"
  startBtn.addEventListener("click", () => {
    const selectedRadio = document.querySelector(
      'input[name="play_mode"]:checked',
    );

    if (!selectedRadio) {
      alert("الرجاء اختيار وضع اللعب أولاً!");
      return;
    }

    const gameMode = selectedRadio.value; // "computer" أو "friend"

    // حفظ وضع اللعب في المتصفح لاستخدامه في صفحة اللعب التالية
    localStorage.setItem("rps_game_mode", gameMode);

    // الانتقال لصفحة اللعب الفعلية
    if (gameMode === "computer") {
      window.location.href = "Rock-Paper-Scissors-Game-PC.html";
    } else {
      window.location.href = "Rock-Paper-Scissors-Game-Fr.html";
    }
  });

  // 3. التعامل مع زر "الرجوع للقائمة الرئيسية"
  backBtn.addEventListener("click", () => {
    window.location.href = "index.html";
  });
});
