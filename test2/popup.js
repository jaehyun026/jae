// ==============================
//   효과음 로드 (원하는 MP3 넣으면 됨)
// ==============================
export const sfx = {
    move: new Audio("./move.mp3"),
    capture: new Audio("./capture.mp3"),
    check: new Audio("./checkmate.mp3")
};

// ==============================
//   효과음 재생 함수
// ==============================
export function playSFX(type) {
    if (!sfx[type]) return;

    sfx[type].currentTime = 0; 
    sfx[type].play();
}

// ==============================
//   설정 팝업 함수
// ==============================
export function popup() {
    // === 요소 선택 ===
    const backBtn = document.getElementById("back-btn");
    const settingBtn = document.getElementById("setting-btn");
    const popup = document.getElementById("setting-popup");
    const closePopup = document.getElementById("close-popup");

    const soundBtn = document.getElementById("sound-btn");
    const volumeSlider = document.getElementById("volume-slider");

    // ==============================
    //     뒤로가기 (스타트 페이지)
    // ==============================
    backBtn.addEventListener("click", () => {
        location.href = "startpage.html";
    });

    // ==============================
    //     설정창 열기 / 닫기
    // ==============================
    settingBtn.addEventListener("click", () => {
        popup.classList.remove("hidden");
    });

    closePopup.addEventListener("click", () => {
        popup.classList.add("hidden");
    });

    // ==============================
    //     사운드 ON/OFF
    // ==============================
    let soundEnabled = true;

    soundBtn.addEventListener("click", () => {
        soundEnabled = !soundEnabled;
        soundBtn.textContent = soundEnabled ? "Sound: ON" : "Sound: OFF";

        localStorage.setItem("chess-sound-enabled", soundEnabled);

        // 음소거 반영
        for (let key in sfx) {
            sfx[key].muted = !soundEnabled;
        }
    });

    // ==============================
    //     볼륨 슬라이더
    // ==============================
    volumeSlider.addEventListener("input", () => {
        const vol = Number(volumeSlider.value);
        localStorage.setItem("chess-volume", vol);

        for (let key in sfx) {
            sfx[key].volume = vol;
        }
    });

    // ==============================
    //     저장된 설정 불러오기
    // ==============================
    window.addEventListener("DOMContentLoaded", () => {
        // 사운드 ON/OFF
        const savedSound = localStorage.getItem("chess-sound-enabled");
        soundEnabled = savedSound !== "false";
        soundBtn.textContent = soundEnabled ? "Sound: ON" : "Sound: OFF";

        for (let key in sfx) {
            sfx[key].muted = !soundEnabled;
        }

        // 볼륨
        const savedVolume = localStorage.getItem("chess-volume");
        const vol = savedVolume ? Number(savedVolume) : 1;

        volumeSlider.value = vol;

        for (let key in sfx) {
            sfx[key].volume = vol;
        }
    });
}
