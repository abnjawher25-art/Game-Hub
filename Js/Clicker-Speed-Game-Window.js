(() => {
  const MAX_LEVEL = 10;
  const START_SECONDS = 60; // 2 دقائق
  const TIME_DECREASE = 32; // ينقص 32 ثانية في كل مستوى
  const BASE_CLICKS = 250; // نقرات المستوى الأول
  const CLICKS_INCREASE = 20;

  let clicks = 0;
  let level = 1;
  let secondsLeft = START_SECONDS;
  let started = false;
  let interval = null;
  let finished = false;
  let waitingNext = false;

  const timer = document.getElementById("timer");
  const count = document.getElementById("count");
  const levelEl = document.getElementById("level");
  const requiredEl = document.getElementById("required");
  const bar = document.getElementById("bar");
  const progress = document.querySelector(".progress");
  const message = document.getElementById("message");
  const button = document.getElementById("click-btn");

  const restartBtn = document.getElementById("restart-btn");
  const exitBtn = document.getElementById("exit-btn");

  // التحقق من وجود عناصر اللعبة الأساسية
  if (
    !timer ||
    !count ||
    !levelEl ||
    !requiredEl ||
    !bar ||
    !progress ||
    !message ||
    !button ||
    !restartBtn ||
    !exitBtn
  ) {
    console.error("تأكد من وجود جميع عناصر اللعبة في ملف HTML.");
    return;
  }

  // حساب عدد النقرات المطلوبة لكل مستوى
  const target = () => BASE_CLICKS + (level - 1) * CLICKS_INCREASE;

  // حساب الوقت المتاح لكل مستوى
  const levelTime = () => START_SECONDS - (level - 1) * TIME_DECREASE;

  // تحويل الثواني إلى صيغة دقائق:ثوانٍ
  function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return (
      String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0")
    );
  }

  // تحديث المؤقت على الشاشة
  function updateTimer() {
    timer.textContent = formatTime(secondsLeft);
  }

  // إيقاف المؤقت
  function stopTimer() {
    if (interval !== null) {
      clearInterval(interval);
      interval = null;
    }
  }

  // إنهاء اللعبة بالفوز أو الخسارة
  function endGame(won) {
    finished = true;
    started = false;
    waitingNext = false;

    stopTimer();

    button.disabled = true;
    button.style.opacity = "0.55";

    message.textContent = won
      ? "مبروك! أكملت المستويات الخمسة 🎉"
      : "انتهى الوقت! اضغط إعادة اللعبة للمحاولة مجددًا.";
  }

  // تشغيل المؤقت عند أول نقرة
  function startTimer() {
    if (started || finished) return;

    started = true;

    interval = setInterval(() => {
      secondsLeft--;
      updateTimer();

      if (secondsLeft <= 0) {
        secondsLeft = 0;
        updateTimer();
        endGame(false);
      }
    }, 1000);
  }

  // تجهيز المستوى الحالي
  function renderLevel() {
    stopTimer();

    clicks = 0;
    count.textContent = "0";

    levelEl.textContent = `${level} / ${MAX_LEVEL}`;
    requiredEl.textContent = target();

    secondsLeft = levelTime();
    updateTimer();

    bar.style.width = "0%";
    progress.setAttribute("aria-valuenow", "0");

    button.disabled = false;
    button.style.opacity = "1";
    button.textContent = "اضغط";

    message.textContent = "ابدأ النقر قبل انتهاء الوقت!";

    started = false;
    waitingNext = false;
  }

  // التعامل مع زر النقر وزر الانتقال للمستوى التالي
  button.addEventListener("click", () => {
    if (finished) return;

    // الانتقال إلى المستوى التالي
    if (waitingNext) {
      level++;
      renderLevel();
      return;
    }

    if (secondsLeft <= 0) return;

    startTimer();

    clicks++;
    count.textContent = clicks;

    const percent = Math.min(100, (clicks / target()) * 100);

    bar.style.width = `${percent}%`;

    progress.setAttribute("aria-valuenow", String(Math.round(percent)));

    // التحقق من إكمال المستوى
    if (clicks >= target()) {
      stopTimer();
      started = false;

      if (level === MAX_LEVEL) {
        endGame(true);
      } else {
        message.textContent = "أكملت المستوى! اضغط «التالي» للمتابعة.";

        button.textContent = "التالي";
        waitingNext = true;
      }
    }
  });

  // إعادة اللعبة بالكامل من المستوى الأول
  restartBtn.addEventListener("click", () => {
    stopTimer();

    clicks = 0;
    level = 1;
    secondsLeft = START_SECONDS;

    started = false;
    finished = false;
    waitingNext = false;

    renderLevel();
  });

  // الخروج إلى الصفحة الرئيسية
  exitBtn.addEventListener("click", () => {
    stopTimer();
    window.location.href = "index.html";
  });

  // بدء اللعبة وتجهيز المستوى الأول
  renderLevel();
})();
