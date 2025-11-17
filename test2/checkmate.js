// 체크/체크메이트 검사: getValidMoves, simulateMove 필요
import { getValidMoves, simulateMove } from './chessrule.js';
import { cloneBoard } from './firstdata.js';

function findKing(board, turn) {
    const target = turn === 'white' ? 'wking' : 'bking';
    for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) if (board[r][c] === target) return [r, c];
    return null;
}

// 해당 턴이 체크인지 (상대가 king을 공격할 수 있는지)
export function isCheck(board, turn) {
    const kingPos = findKing(board, turn);
    if (!kingPos) return false; // 이상상태
    const [kr, kc] = kingPos;
    const opponent = turn === 'white' ? 'black' : 'white';

    // 모든 상대 말의 (pseudo)moves를 구해 king 위치 포함하는지 확인
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const p = board[r][c];
            if (!p) continue;
            const pColor = p[0] === 'w' ? 'white' : 'black';
            if (pColor !== opponent) continue;
            const moves = getValidMoves(board, r, c, opponent);
            for (const [mr, mc] of moves) {
                if (mr === kr && mc === kc) return true;
            }
        }
    }
    return false;
}

// 체크메이트인지: 현재 턴(턴 소유자)이 체크인 상태이고 탈출 가능한 모든 수가 없는 경우
export function isCheckmate(board, turn) {
    if (!isCheck(board, turn)) return false;
    const myColorPrefix = turn === 'white' ? 'w' : 'b';
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const p = board[r][c];
            if (!p || p[0] !== myColorPrefix) continue;
            const moves = getValidMoves(board, r, c, turn);
            for (const [nr, nc] of moves) {
                const newBoard = simulateMove(board, r, c, nr, nc);
                if (!isCheck(newBoard, turn)) return false; // 탈출 가능
            }
        }
    }
    return true;
}
export const statusMessage = typeof document !== 'undefined' ? document.getElementById("status-message") : null;

export function updateStatus(board, turn) {
    if (!statusMessage) return;
    statusMessage.innerText = "";

    // 게임 끝 감지: 어느 쪽 킹이라도 보드에서 사라지면 종료 상태로 표시
    const whiteKing = findKing(board, 'white');
    const blackKing = findKing(board, 'black');
    if (!whiteKing || !blackKing) {
        statusMessage.innerText = 'end';
        return;
    }

    if (isCheckmate(board, turn)) {
        statusMessage.innerText = `${turn} 체크메이트!`;
    } else if (isCheck(board, turn)) {
        statusMessage.innerText = `${turn} 체크!`;
    }
}
