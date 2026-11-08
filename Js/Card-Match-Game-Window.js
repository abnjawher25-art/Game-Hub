document.addEventListener("DOMContentLoaded", () => {
  // جلب مستوى الصعوبة المخزن
  const difficulty = localStorage.getItem("gameDifficulty") || "easy";

  // إعدادات المستويات (الوقت بالثواني، وعدد المحاولات الفاشلة المسموحة)
  const settings = {
    easy: {
      time: 50,
      maxWrong: 10,
    },
    medium: {
      time: 35,
      maxWrong: 8,
    },
    hard: {
      time: 25,
      maxWrong: 6,
    },
  };

  const currentSettings = settings[difficulty] || settings.easy;

  // متغيرات اللعبة
  let timeLeft = currentSettings.time;
  let wrongAttempts = 0;
  let maxWrongAttempts = currentSettings.maxWrong;
  let timerInterval = null;
  let isGamePlaying = true;
  let hasFlippedCard = false;
  let lockBoard = false;
  let firstCard, secondCard;
  let matchedPairs = 0;
  const totalPairs = 7; // 14 كرتًا تعني 7 أزواج

  // عناصر الواجهة في صفحة اللعبة
  const memoryGameContainer = document.getElementById("memory-game");
  const timerDisplay = document.getElementById("timer");
  const wrongAttemptsDisplay = document.getElementById("wrong-attempts");
  const restartBtn = document.getElementById("restart-btn");
  const endBtn = document.getElementById("end-btn");
  const overlay = document.getElementById("overlay");
  const modalRestartBtn = document.getElementById("modal-restart-btn");
  const modalTitle = document.getElementById("modal-title");
  const modalMessage = document.getElementById("modal-message");

  // رموز الكروت (7 أزواج تتكرر لتصبح 14 كرتًا)
  const cardSymbols = ["🍎", "🍌", "🍇", "🍊", "🍓", "🍉", "🍒"];

  // تهيئة اللعبة وبدء تشغيلها
  initGame();

  function initGame() {
    // إعادة تعيين المتغيرات
    timeLeft = currentSettings.time;
    wrongAttempts = 0;
    matchedPairs = 0;
    isGamePlaying = true;
    hasFlippedCard = false;
    lockBoard = false;
    firstCard = null;
    secondCard = null;

    updateUI();
    createBoard();
    startTimer();
  }

  // إنشاء وتوليد الكروت عشوائياً في لوحة اللعبة
  function createBoard() {
    memoryGameContainer.innerHTML = "";

    // مضاعفة الرموز لتصبح 14 كرتًا (7 أزواج)
    const gameCards = [...cardSymbols, ...cardSymbols];

    // خلط الكروت عشوائياً
    gameCards.sort(() => Math.random() - 0.5);

    gameCards.forEach((symbol) => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.dataset.symbol = symbol;

      card.innerHTML = `
                <div class="card-face card-front"></div>
                <div class="card-face card-back">${symbol}</div>
            `;

      card.addEventListener("click", flipCard);
      memoryGameContainer.appendChild(card);
    });
  }

  // دالة قلب الكارت عند الضغط عليه
  function flipCard() {
    if (!isGamePlaying) return;
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add("flip");

    if (!hasFlippedCard) {
      hasFlippedCard = true;
      firstCard = this;
      return;
    }

    secondCard = this;
    checkForMatch();
  }

  // التحقق من تطابق الكرتين
  function checkForMatch() {
    const isMatch = firstCard.dataset.symbol === secondCard.dataset.symbol;

    if (isMatch) {
      disableCards();
    } else {
      unflipCards();
    }
  }

  // في حال التطابق الناجح
  function disableCards() {
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);

    matchedPairs++;
    resetBoard();

    // التحقق من حالة الفوز (اكتمال الـ 7 أزواج)
    if (matchedPairs === totalPairs) {
      endGame(true);
    }
  }

  // في حال عدم التطابق (خطأ)
  function unflipCards() {
    lockBoard = true;
    wrongAttempts++;
    wrongAttemptsDisplay.textContent = wrongAttempts;

    // التحقق مما إذا تجاوز اللاعب الحد الأقصى للمحاولات الخاطئة
    if (wrongAttempts >= maxWrongAttempts) {
      setTimeout(() => {
        endGame(false);
      }, 500);
      return;
    }

    setTimeout(() => {
      firstCard.classList.remove("flip");
      secondCard.classList.remove("flip");
      resetBoard();
    }, 800);
  }

  // إعادة تعيين حالة الاختيار المؤقتة
  function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
  }

  // إدارة مؤقت الوقت التنازلي
  function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      if (!isGamePlaying) return;

      timeLeft--;
      updateUI();

      // انتهاء الوقت = خسارة
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        endGame(false);
      }
    }, 1000);
  }

  // تحديث الواجهة وعرض الوقت بتنسيق دقيقة:ثانية
  function updateUI() {
    wrongAttemptsDisplay.textContent = wrongAttempts;

    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  // إنهاء اللعبة (فوز أو خسارة)
  function endGame(isWin) {
    isGamePlaying = false;
    clearInterval(timerInterval);

    if (isWin) {
      modalTitle.textContent = "تهانينا! 🎉";
      modalMessage.textContent = "لقد فزت وأتممت مطابقة جميع الكروت بنجاح.";
      overlay.classList.add("active");

      // الانتقال تلقائياً للواجهة الأساسية بعد ثانيتين كما طلبتم
      setTimeout(() => {
        window.location.href = "Card-Match-Main.html";
      }, 2500);
    } else {
      modalTitle.textContent = "انتهت اللعبة ❌";
      modalMessage.textContent =
        "للأسف نفد الوقت أو تجاوزت عدد المحاولات الفاشلة المسموحة.";
      overlay.classList.add("active");
    }
  }

  // زر إعادة اللعب داخل صفحة اللعبة
  if (restartBtn) {
    restartBtn.addEventListener("click", () => {
      overlay.classList.remove("active");
      initGame();
    });
  }

  // زر إعادة اللعب من داخل نافذة الـ Modal
  if (modalRestartBtn) {
    modalRestartBtn.addEventListener("click", () => {
      overlay.classList.remove("active");
      initGame();
    });
  }

  // زر إنهاء اللعبة (الرجوع المباشر للواجهة الرئيسية)
  if (endBtn) {
    endBtn.addEventListener("click", () => {
      window.location.href = "Card-Match-Main.html";
    });
  }
});
