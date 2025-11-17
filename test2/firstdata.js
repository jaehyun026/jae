// 말 유니코드 맵과 초기 보드 상태, 보드 복사 도우미
export const pieces = {
    white: {
        rook: "♖", knight: "♘", bishop: "♗", queen: "♕", king: "♔", pawn: "♙"
    },
    black: {
        rook: "♜", knight: "♞", bishop: "♝", queen: "♛", king: "♚", pawn: "♟"
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
