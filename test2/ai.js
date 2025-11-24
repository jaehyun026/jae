// ai.js
// 중간 난이도 AI: minimax + alpha-beta + move ordering + rule-respecting
// 의존: getValidMoves(board,r,c,color), simulateMove(board,fr,fc,tr,tc), cloneBoard(board), isCheck(board,color)
// (위 함수들이 chessrule.js에 있으니 ai.js에서 import 해서 사용)
import { getValidMoves, simulateMove } from './chessrule.js';
import { cloneBoard } from './firstdata.js';
import { isCheck } from './checkmate.js';

// 기본 기물값 (가중치는 자유롭게 조정)
const PIECE_VALUE = {
  pawn: 100,
  knight: 320,
  bishop: 330,
  rook: 500,
  queen: 900,
  king: 20000
};

// 간단한 위치 보너스 (중앙 선호)
const POSITION_BONUS = [
  [-5,-4,-3,-3,-3,-3,-4,-5],
  [-4,-2, 0, 0, 0, 0,-2,-4],
  [-3, 0, 1, 2, 2, 1, 0,-3],
  [-3, 0, 2, 3, 3, 2, 0,-3],
  [-3, 0, 2, 3, 3, 2, 0,-3],
  [-3, 0, 1, 2, 2, 1, 0,-3],
  [-4,-2, 0, 0, 0, 0,-2,-4],
  [-5,-4,-3,-3,-3,-3,-4,-5]
];

// 간단 평가 함수 (BLACK 관점: 양수 -> 블랙 유리)
function evaluateBoard(board) {
  let score = 0;

  // material + position
  for (let r=0; r<8; r++){
    for (let c=0; c<8; c++){
      const cell = board[r][c];
      if (!cell) continue;
      const color = cell[0]; // 'w'/'b'
      const kind = cell.slice(1);
      const base = PIECE_VALUE[kind] || 0;
      const pos = POSITION_BONUS[r][c] || 0;
      const val = base + pos;
      score += (color === 'b' ? val : -val);
    }
  }

  // mobility (간단): 합법 수(룰 준수) 갯수 차이 (작은 가중치)
  const mobilityWeight = 2;
  let bMoves = 0, wMoves = 0;
  for (let r=0; r<8; r++){
    for (let c=0; c<8; c++){
      const cell = board[r][c];
      if (!cell) continue;
      if (cell[0] === 'b') bMoves += filteredMovesCount(board, r, c, 'black');
      else wMoves += filteredMovesCount(board, r, c, 'white');
    }
  }
  score += mobilityWeight * (bMoves - wMoves);

  return score;
}

// filtered: getValidMoves 후보 중에서 '자기 왕이 체크되지 않는' 합법수만 센다
function filteredMovesCount(board, r, c, color) {
  const pseudo = getValidMoves(board, r, c, color);
  if (!pseudo) return 0;
  let cnt = 0;
  for (const [tr,tc] of pseudo) {
    const nb = simulateMove(cloneBoard(board), r, c, tr, tc);
    if (!isCheck(nb, color)) cnt++;
  }
  return cnt;
}

// 모든 합법 수 모으기 (룰을 지켜 자기왕이 체크되는 수는 제거)
function getAllLegalMoves(board, color) {
  const moves = [];
  const prefix = color === 'black' ? 'b' : 'w';
  for (let r=0; r<8; r++){
    for (let c=0; c<8; c++){
      const cell = board[r][c];
      if (!cell || cell[0] !== prefix) continue;
      const pseudo = getValidMoves(board, r, c, color);
      if (!pseudo) continue;
      for (const [tr,tc] of pseudo) {
        const nb = simulateMove(cloneBoard(board), r, c, tr, tc);
        if (!isCheck(nb, color)) {
          moves.push({ from:{r,c}, to:{r:tr,c:tc} });
        }
      }
    }
  }
  return moves;
}

// 간단한 이동 정렬: 캡처 우선, 중앙 우선
function moveOrderScore(board, move) {
  const target = board[move.to.r][move.to.c];
  let s = 0;
  if (target) {
    const kind = target.slice(1);
    s += (PIECE_VALUE[kind] || 0) * 10; // capture preference
  }
  // 중앙으로 갈수록 + (작은 값)
  const centerDist = Math.abs(3.5 - move.to.r) + Math.abs(3.5 - move.to.c);
  s -= centerDist * 2;
  return s;
}

// minimax with alpha-beta (maximizing = BLACK)
function minimax(board, depth, alpha, beta, maximizing) {
  if (depth === 0) return evaluateBoard(board);

  if (maximizing) {
    let maxEval = -Infinity;
    let moves = getAllLegalMoves(board, 'black');
    if (moves.length === 0) {
      return isCheck(board, 'black') ? -999999 : 0;
    }
    // order and optional top-N trimming
    moves.sort((a,b) => moveOrderScore(board,b) - moveOrderScore(board,a));
    const limit = Math.min(moves.length, 30); // performance cap
    for (let i=0;i<limit;i++){
      const m = moves[i];
      const nb = simulateMove(cloneBoard(board), m.from.r, m.from.c, m.to.r, m.to.c);
      const val = minimax(nb, depth-1, alpha, beta, false);
      maxEval = Math.max(maxEval, val);
      alpha = Math.max(alpha, val);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    let moves = getAllLegalMoves(board, 'white');
    if (moves.length === 0) {
      return isCheck(board, 'white') ? 999999 : 0;
    }
    moves.sort((a,b) => moveOrderScore(board,a) - moveOrderScore(board,b));
    const limit = Math.min(moves.length, 30);
    for (let i=0;i<limit;i++){
      const m = moves[i];
      const nb = simulateMove(cloneBoard(board), m.from.r, m.from.c, m.to.r, m.to.c);
      const val = minimax(nb, depth-1, alpha, beta, true);
      minEval = Math.min(minEval, val);
      beta = Math.min(beta, val);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

// top-level aiMove: aiColor 기본 'black', depth 기본 3
export function aiMove(board, aiColor='black', depth=3) {
  const moves = getAllLegalMoves(board, aiColor);
  if (moves.length === 0) return board;

  // move ordering
  moves.sort((a,b) => moveOrderScore(board,b) - moveOrderScore(board,a));

  // consider only top-N to limit time (브라우저 친화적)
  const consider = moves.slice(0, 40);

  let bestScore = -Infinity;
  let bestMove = null;

  for (const m of consider) {
    const nb = simulateMove(cloneBoard(board), m.from.r, m.from.c, m.to.r, m.to.c);
    const score = (aiColor === 'black')
      ? minimax(nb, depth-1, -Infinity, Infinity, false)
      : minimax(nb, depth-1, -Infinity, Infinity, true); // if white AI
    if (score > bestScore) {
      bestScore = score;
      bestMove = m;
    }
  }

  if (!bestMove) return board;
  return simulateMove(board, bestMove.from.r, bestMove.from.c, bestMove.to.r, bestMove.to.c);
}
