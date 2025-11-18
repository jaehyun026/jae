// 말 유니코드 맵과 초기 보드 상태, 보드 복사 도우미
export const pieces = {
    white: {
        rook: "♖", knight: "♘", bishop: "♗", queen: "♔", king: "♕", pawn: "♙"
    },
    black: {
        rook: "♜", knight: "♞", bishop: "♝", queen: "♚", king: "♛", pawn: "♟"
    }
};

/*
Board format: 8x8 array, 각 칸은 null 또는 문자열:
예: "wking", "bpawn", "wrook"
첫 글자: 'w' 또는 'b'
이후: pawn, king, queen, rook, bishop, knight
*/
export const initialBoard = [
    ["brook", "bknight", "bbishop", "bqueen", "bking", "bbishop", "bknight", "brook"],
    ["bpawn", "bpawn", "bpawn", "bpawn", "bpawn", "bpawn", "bpawn", "bpawn"],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ["wpawn", "wpawn", "wpawn", "wpawn", "wpawn", "wpawn", "wpawn", "wpawn"],
    ["wrook", "wknight", "wbishop", "wqueen", "wking", "wbishop", "wknight", "wrook"]
];
/* 체스보드 만드는 복사배열 */
export function cloneBoard(board) {
    return board.map(row => row.map(cell => cell));
}
export default function main() {
    const boardEl = document.getElementById("chessboard");
    let board = cloneBoard(initialBoard);
    let turn = "white"; // white 먼저
    let selected = null; // {r,c}
    let legalMoves = []; // [[r,c],...]

    // 초기 렌더
    renderBoard();

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
                boardEl.appendChild(sq);
            }
        }
    }
}
