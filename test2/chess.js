import { aiMove } from './ai.js';
import { initialBoard, cloneBoard, pieces } from './firstdata.js';
import { getValidMoves, simulateMove } from './chessrule.js';
import { isCheck, isCheckmate, updateStatus } from './checkmate.js';
import { popup, playSFX } from './popup.js';
import { logoeffect } from './logoeffect.js';

/*debounce 헬퍼 추가*/
function debounce(fn, wait = 80) {
    let t;
    return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn(...args), wait);
    };
}

export default function main() {
    popup();
    logoeffect();
    const gameMode = localStorage.getItem("gameMode");

    const boardEl = document.getElementById("chessboard");
    let board = cloneBoard(initialBoard);
    let turn = "white"; // white 먼저
    let selected = null; // {r,c}
    let legalMoves = []; // [[r,c],...]

    // AI가 흑부터 두는 모드라면 초기 보드에서 AI 한 수 두기
    /* if (gameMode === "pve" && turn === "black") {
         board = aiMove(board);
         turn = "white";
     }*/
    // 초기 렌더
    renderBoard();

    // 클릭 이벤트 (모든 상호작용 처리)
    boardEl.addEventListener("click", (e) => {
        const sq = e.target.closest(".square");
        if (!sq) return;
        const r = Number(sq.dataset.row), c = Number(sq.dataset.col);
        const cell = board[r][c];

        // 1) 내가 선택한 말이 없을 때: 내 말 선택
        if (!selected) {
            if (!cell) return; // 빈 칸 클릭 무시
            if ((cell[0] === 'w' ? 'white' : 'black') !== turn) return; // 상대 말 클릭 무시

            // compute moves: 항상 체크를 해소하는 수만 허용 (체크 상태여도 동일)
            const pseudo = getValidMoves(board, r, c, turn);
            const legal = [];
            for (const [mr, mc] of pseudo) {
                const nb = simulateMove(board, r, c, mr, mc);
                if (!isCheck(nb, turn)) legal.push([mr, mc]);
            }
            if (legal.length === 0) return; // 움직일 곳 없음

            selected = { r, c };
            legalMoves = legal;
            highlightSelection();
            highlightMoves();
            return;
        }

        // 2) 이미 선택된 상태: 
        //    - 같은 색 말 다시 클릭하면 선택 교체
        //    - 유효 이동 칸을 클릭하면 이동
        const selCell = board[selected.r][selected.c];
        const clickedIsMy = cell && (cell[0] === selCell[0]);
        if (clickedIsMy) {
            // 다른 내 말로 선택 바꾸기
            clearHighlights();
            selected = null;
            legalMoves = [];
            // 재선택 시 위와 동일 로직
            if ((cell[0] === 'w' ? 'white' : 'black') === turn) {
                const pseudo = getValidMoves(board, r, c, turn);
                const legal = [];
                for (const [mr, mc] of pseudo) {
                    const nb = simulateMove(board, r, c, mr, mc);
                    if (!isCheck(nb, turn)) legal.push([mr, mc]);
                }
                if (legal.length === 0) return;
                selected = { r, c };
                legalMoves = legal;
                highlightSelection();
                highlightMoves();
            }
            return;
        }

        // check if clicked square is one of legalMoves
        const match = legalMoves.some(([mr, mc]) => mr === r && mc === c);
        if (!match) {
            // 클릭한 영역이 합법적 이동이 아닌 경우 선택 해제
            clearHighlights();
            selected = null;
            legalMoves = [];
            return;
        }

        // 실제 이동 수행
        const targetCell = board[r][c];
        board = simulateMove(board, selected.r, selected.c, r, c);

        // 효과음: 잡기/이동
        if (targetCell) playSFX('capture');
        else playSFX('move');

        clearHighlights();
        selected = null;
        legalMoves = [];

        // 턴 변경 및 체크/체크메이트 검사
        const opponent = turn === "white" ? "black" : "white";
        if (isCheckmate(board, opponent)) {
            turn = opponent;  // 턴을 미리 바꿈 (상대 턴이 체크메이트 상태임을 renderBoard에서 표시)
            renderBoard();
            setTimeout(() => alert(`${turn.toUpperCase()} 승리! 체크메이트입니다.`), 10);
            return;
        }

        // 알림: 체크 상태이면 효과음
        if (isCheck(board, opponent)) {
            playSFX('check');
            // 간단히 alert 혹은 시각표시(킹 테두리) 표시 -> 렌더에서 처리
            // 계속 게임 진행
        }

        turn = opponent;
        renderBoard();

        // PVE 모드: AI(black)가 다음이라면 자동으로 한 수 두도록 처리
        if (gameMode === 'pve' && turn === 'black') {
            setTimeout(() => {
                board = aiMove(board, 'black', 3); // depth 3 중간 난이도

                // 체크메이트 검사
                if (isCheckmate(board, 'white')) {
                    turn = 'white';
                    renderBoard();
                    setTimeout(() => alert(`BLACK 승리! 체크메이트입니다.`), 10);
                    return;
                }

                // 체크 여부
                if (isCheck(board, 'white')) {
                    playSFX('check');
                }

                turn = 'white';
                renderBoard();
            }, 1500);
        }

    });

    // 렌더 함수
    function renderBoard() {
        boardEl.innerHTML = "";
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const sq = document.createElement("div");
                sq.classList.add("square");
                if ((r + c) % 2 === 0) sq.classList.add("light");
                else sq.classList.add("dark");
                sq.dataset.row = r;
                sq.dataset.col = c;

                const cell = board[r][c];
                if (cell) {
                    const color = cell[0] === 'w' ? 'white' : 'black';
                    const kind = cell.slice(1);
                    const p = document.createElement("div");
                    p.classList.add("piece", color);
                    p.textContent = pieces[color][kind];
                    sq.appendChild(p);
                }

                // 체크 표시: 상대 턴일 때 king이 체크당하면 렌더 시킹 표시
                const kingPos = findKing(board, turn === 'white' ? 'white' : 'black');
                // (kingPos는 해당 턴의 킹; isCheck 이미 알려줌) — 대신 isCheck 전체에서 사용
                boardEl.appendChild(sq);
            }
            // renderBoard() 맨 마지막 (updateStatus 호출 직후)에 추가
            try { updateStatus(board, turn); } catch (e) { }
            resizeBoard(); // render 후 항상 크기 보정

        }

        // 표시: 만약 현재 턴 상대가 체크 상태라면 체크당한 킹 위치에 클래스 추가
        const opponent = turn === "white" ? "black" : "white";
        if (isCheck(board, opponent)) {
            const kp = findKing(board, opponent);
            if (kp) {
                const [kr, kc] = kp;
                const kingSquare = document.querySelector(`.square[data-row="${kr}"][data-col="${kc}"]`);
                if (kingSquare) kingSquare.classList.add("check-king");
            }
        }
        // 상태 메시지 갱신
        try { updateStatus(board, turn); } catch (e) { }
    }

    // 유틸: selected highlight
    function highlightSelection() {
        clearHighlights();
        const sel = document.querySelector(`.square[data-row="${selected.r}"][data-col="${selected.c}"]`);
        if (sel) sel.classList.add("selected");
    }

    function highlightMoves() {
        for (const [r, c] of legalMoves) {
            const sq = document.querySelector(`.square[data-row="${r}"][data-col="${c}"]`);
            if (sq) sq.classList.add("move-spot");
        }
    }

    function clearHighlights() {
        document.querySelectorAll(".square.selected").forEach(s => s.classList.remove("selected"));
        document.querySelectorAll(".square.move-spot").forEach(s => s.classList.remove("move-spot"));
        document.querySelectorAll(".square.check-king").forEach(s => s.classList.remove("check-king"));
    }

    // 킹 위치 찾는 헬퍼 (렌더 및 체크 표시용)
    function findKing(boardState, color) {
        const prefix = color === 'white' ? 'w' : 'b';
        for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) if (boardState[r][c] === (prefix + "king")) return [r, c];
        return null;
    }

    // iOS Safari 대응: 화면 크기 변화 시 정확한 정사각형 유지
    function resizeBoard() {
        const container = document.querySelector(".chessboard-container");
        const board = document.getElementById("chessboard");
        if (!container || !board) return;

        // 컨테이너 너비 기준 정사각형 유지
        const size = container.clientWidth;
        container.style.height = size + "px";
        board.style.height = size + "px";

        // 각 칸의 크기 강제로 재계산
        document.querySelectorAll(".square").forEach(sq => {
            sq.style.height = (size / 8) + "px";
            sq.style.width = (size / 8) + "px";
        });

    }

    // 초기 실행 + 리사이즈 감지
    const debouncedResize = debounce(resizeBoard, 80);
    window.addEventListener("resize", debouncedResize);
    window.addEventListener("orientationchange", debouncedResize);

}
