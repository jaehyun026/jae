// popup.js (교체용 전체 파일)

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
    const volumeValue = document.getElementById("volume-value"); // span 보여주는 요소

    // 안전 체크: 요소 없으면 함수 멈춤(예외 방지)
    if (!backBtn || !settingBtn || !popup || !closePopup || !soundBtn || !volumeSlider || !volumeValue) {
        console.warn("popup(): required DOM elements missing");
        return;
    }

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

        localStorage.setItem("chess-sound-enabled", soundEnabled ? "true" : "false");

        // 음소거 반영
        for (let key in sfx) {
            sfx[key].muted = !soundEnabled;
        }
    });

    // ==============================
    //     볼륨 슬라이더 (0~100) - input 이벤트
    // ==============================
    volumeSlider.addEventListener("input", () => {
        const volPercent = Number(volumeSlider.value); // 0 ~ 100
        const vol = Math.max(0, Math.min(1, volPercent / 100)); // 0.0 ~ 1.0

        // 저장: 항상 0~100 기준으로 저장(정규화)
        localStorage.setItem("chess-volume", String(volPercent));

        // 숫자 표시 갱신
        volumeValue.textContent = String(volPercent);

        // 실제 오디오 볼륨 반영 (0.0 ~ 1.0)
        for (let key in sfx) {
            try {
                sfx[key].volume = vol;
            } catch (e) {
                // 안전: 드물게 브라우저가 아직 로드 안된 경우를 대비
                console.warn("Failed to set volume for", key, e);
            }
        }
    });

    // ==============================
    //     저장된 설정 불러오기 (초기화)
    // ==============================
    // 즉시 실행해서 UI를 초기화 (DOMContentLoaded 밖에서도 호출 가능)
    (function initFromStorage() {
        // 사운드 ON/OFF 불러오기
        const savedSound = localStorage.getItem("chess-sound-enabled");
        if (savedSound !== null) {
            soundEnabled = savedSound === "true";
        } else {
            soundEnabled = true; // 기본 ON
        }
        soundBtn.textContent = soundEnabled ? "Sound: ON" : "Sound: OFF";

        for (let key in sfx) {
            sfx[key].muted = !soundEnabled;
        }

        // 1) 새로고침할 때 자동으로 50으로 저장
        localStorage.setItem("chess-volume", "50");

        // 2) 내부 값 처리
        let volPercent = 50;
        const vol = 0.5; // 50%

        // UI 업데이트
        volumeSlider.value = "50";
        volumeValue.textContent = "50";

        // 실제 오디오 볼륨 적용
        for (let key in sfx) {
            try {
                sfx[key].volume = vol;
            } catch (e) {
                console.warn("Failed to set volume for", key, e);
            }
        }
    });
}
