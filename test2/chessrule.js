// 역할: 주어진 보드에서 선택된 말의 **(pseudo-legal)** 가능한 이동 좌표 반환,
//        그리고 simulateMove 기능 제공.
// 주의: getValidMoves는 '턴' 검사를 포함해서 해당 턴의 말만 반환함.
// 체크 여부(자기 체크로 인한 불법 이동 제거)는 checkmate.js에서 simulateMove로 필터링.

// 유틸
function inBounds(r,c){ return r>=0 && r<8 && c>=0 && c<8; }
function colorOf(cell){ return cell ? (cell[0]==='w'? 'white':'black') : null; }

export function simulateMove(board, fromR, fromC, toR, toC) {
    const nb = board.map(r => r.slice());
    nb[toR][toC] = nb[fromR][fromC];
    nb[fromR][fromC] = null;

    // 자동 프로모션: 폰이 끝까지 가면 퀸으로 승격
    const moved = nb[toR][toC];
    if (moved && moved.endsWith("pawn")) {
        if (moved[0] === 'w' && toR === 0) nb[toR][toC] = 'wqueen';
        if (moved[0] === 'b' && toR === 7) nb[toR][toC] = 'bqueen';
    }

    return nb;
}

export function getValidMoves(board, row, col, turn) {
    const piece = board[row][col];
    if (!piece) return [];
    const myColor = piece[0] === 'w' ? 'white' : 'black';
    if (myColor !== turn) return [];

    const kind = piece.slice(1); // pawn, rook, ...
    switch(kind) {
        case "pawn": return pawnMoves(board, row, col, myColor);
        case "rook": return slidingMoves(board, row, col, myColor, [[1,0],[-1,0],[0,1],[0,-1]]);
        case "bishop": return slidingMoves(board, row, col, myColor, [[1,1],[1,-1],[-1,1],[-1,-1]]);
        case "queen": return slidingMoves(board, row, col, myColor, [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]);
        case "knight": return knightMoves(board, row, col, myColor);
        case "king": return kingMoves(board, row, col, myColor);
        default: return [];
    }
}

/* 슬라이딩 말 (룩/비숍/퀸) */
function slidingMoves(board, r, c, myColor, directions) {
    const moves = [];
    for (const [dr,dc] of directions) {
        let nr = r + dr, nc = c + dc;
        while(inBounds(nr,nc)) {
            if (board[nr][nc] === null) {
                moves.push([nr,nc]);
            } else {
                if (colorOf(board[nr][nc]) !== myColor) moves.push([nr,nc]);
                break;
            }
            nr += dr; nc += dc;
        }
    }
    return moves;
}

/* 나이트 */
function knightMoves(board, r, c, myColor) {
    const moves = [];
    const deltas = [[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]];
    for (const [dr,dc] of deltas) {
        const nr = r+dr, nc = c+dc;
        if (!inBounds(nr,nc)) continue;
        if (board[nr][nc] === null || colorOf(board[nr][nc]) !== myColor) moves.push([nr,nc]);
    }
    return moves;
}

/* 킹 (한 칸) — 캐슬링 미포함 */
function kingMoves(board, r, c, myColor) {
    const moves = [];
    for (let dr=-1; dr<=1; dr++) {
        for (let dc=-1; dc<=1; dc++) {
            if (dr===0 && dc===0) continue;
            const nr = r+dr, nc = c+dc;
            if (!inBounds(nr,nc)) continue;
            if (board[nr][nc] === null || colorOf(board[nr][nc]) !== myColor) moves.push([nr,nc]);
        }
    }
    return moves;
}

/* 폰 (앞으로 한칸, 처음이면 두칸, 캡처는 대각선) */
function pawnMoves(board, r, c, myColor) {
    const moves = [];
    const forward = myColor === 'white' ? -1 : 1;
    const startRow = myColor === 'white' ? 6 : 1;
    const opponent = myColor === 'white' ? 'b' : 'w';

    // 한칸 전진
    const nr = r + forward;
    if (inBounds(nr,c) && board[nr][c] === null) {
        moves.push([nr,c]);
        // 두칸 전진 (처음 위치)
        const nr2 = r + (2 * forward);
        if (r === startRow && inBounds(nr2,c) && board[nr2][c] === null) {
            moves.push([nr2,c]);
        }
    }

    // 대각선 캡처
    for (const dc of [-1,1]) {
        const cr = r + forward, cc = c + dc;
        if (inBounds(cr,cc) && board[cr][cc] !== null && board[cr][cc][0] === opponent) {
            moves.push([cr,cc]);
        }
    }

    // (간단화) 엔팽 미지원

    return moves;
}
