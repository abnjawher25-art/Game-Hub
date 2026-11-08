// تحميل صفحة الويب كاملة
document.addEventListener('DOMContentLoaded', () => {
    // تحديد جميع الكروت التي تحتوي على خاصية data-url (الألعاب المتاحة فقط)
    const gameCards = document.querySelectorAll('.Game-Cards > div[data-url]');

    gameCards.forEach(card => {
        const playButton = card.querySelector('button');

        if (playButton) {
            // تغيير مؤشر الماوس لشكل اليد عند المرور فوق زر "ألعب"
            playButton.style.cursor = 'pointer';

            // إضافة حدث النقر على زر "ألعب" حصراً للانتقال إلى صفحة اللعبة
            playButton.addEventListener('click', (e) => {
                e.stopPropagation(); // منع انتشار الحدث للعنصر الأب
                const targetUrl = card.getAttribute('data-url');
                if (targetUrl) {
                    window.location.href = targetUrl;
                }
            });
        }
    });
});