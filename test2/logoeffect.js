export function logoeffect() {
    // ===== 스플래시 → 본 화면 전환 =====
    window.onload = () => {
        const splash = document.getElementById("splash");
        const targets = document.querySelectorAll(".fade-target");

        // 페이지는 처음에 투명
        targets.forEach(t => t.style.opacity = 0);

        // 1. 스플래시 1.5초 유지
        setTimeout(() => {
            splash.style.opacity = 0;

            // 2. 스플래시 완전 제거 → 본 화면 등장
            setTimeout(() => {
                splash.style.display = "none";

                targets.forEach(t => {
                    t.style.transition = "opacity 1.5s ease";
                    t.style.opacity = 1;
                });
            }, 800);

        }, 1500);
    };
}