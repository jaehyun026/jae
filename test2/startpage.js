export default function main() {
            const optionBtn = document.getElementById("optionBtn");
        const popup = document.getElementById("optionPopup");
        const select = document.getElementById("modeSelect");
        const startBtn = document.getElementById("startBtn");

        // 옵션 클릭 → 팝업 표시
        optionBtn.addEventListener("click", () => {
            popup.style.display = "flex";
        });

        // select 바꾸면 자동 저장 + 팝업 닫기
        select.addEventListener("change", () => {
            localStorage.setItem("gameMode", select.value);
            popup.style.display = "none";
        });

        // Start 버튼 → chess.html 이동
        startBtn.addEventListener("click", () => {
            // 기본값이 없으면 pvp로 저장
            if (!localStorage.getItem("gameMode")) {
                localStorage.setItem("gameMode", "pvp");
            }
            window.location.href = "chess.html";
        });
}