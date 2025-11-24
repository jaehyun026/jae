export default function main() {

    const popup = document.getElementById("optionPopup");
    const optionBtn = document.getElementById("optionBtn");
    const closePopupBtn = document.getElementById("close-popup");
    const startBtn = document.getElementById("startBtn");
    const modeSelect = document.getElementById("modeSelect");

    /* 🔥 항상 페이지 열리면 기본 모드는 PVP 로 강제 설정 */
    localStorage.setItem("gameMode", "pvp");

    /* ===== 팝업 열기 ===== */
    optionBtn.addEventListener("click", () => {
        popup.style.display = "flex";
    });

    /* ===== 팝업 닫기 ===== */
    closePopupBtn.addEventListener("click", () => {
        popup.style.display = "none";
    });

    /* ===== 모드 선택 저장 ===== */
    modeSelect.addEventListener("change", () => {
        localStorage.setItem("gameMode", modeSelect.value);
    });

    /* ===== 게임 시작 ===== */
    startBtn.addEventListener("click", () => {
        window.location.href = "chess.html";
    });
}
