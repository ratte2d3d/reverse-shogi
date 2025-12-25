import { Constants as C } from "./constants.js";
import { Board } from "./board.js";


const board = new Board(9);
let myColor = C.PIECE_COLOR.BLACK;
let turn = myColor === C.PIECE_COLOR.BLACK ? C.PLAYER_TYPE.SELF : C.PLAYER_TYPE.OPPONENT;

let selected = null;
let movableCells = null;

let selectedHand = null;   // 例: { owner: 'self'|'opponent', type: 'pawn', ... }
let droppableCells = null; // 配置可能セルの配列 [[x,y], ...]

const turnDiv = document.getElementById("turn");
const boardDiv = document.getElementById("board");
const opponentHandDiv = document.getElementById("opponent-hand");
const selfHandDiv = document.getElementById("self-hand");


// プレイヤーの色取得
function getPlayerColor(player) {
  return player === C.PLAYER_TYPE.SELF ? myColor : colorChange(myColor);
}

// 色変更
function colorChange(color) {
  return color === C.PIECE_COLOR.BLACK ? C.PIECE_COLOR.WHITE : C.PIECE_COLOR.BLACK;
}

// プレイヤー変更
function playerTypeChange(player) {
  return player === C.PLAYER_TYPE.SELF ? C.PLAYER_TYPE.OPPONENT : C.PLAYER_TYPE.SELF;
}


// サイド切替トグル
const sideToggle = document.getElementById('sideToggle');
const sideLabel = document.getElementById('sideLabel');
if (sideToggle) {
  sideToggle.addEventListener('change', () => {
    isReverseBoard = !isReverseBoard
    // let turn_japanese = null
    // if (sideLabel && isReverseBoard){
    //   turn_japanese = C.PLAYER_TYPE_JAPANESE[C.PLAYER_TYPE.OPPONENT]
    //   sideLabel.textContent = `${turn_japanese}の盤面`
    // } else {
    //   sideLabel.textContent = ""
    // }
  });
}


// ゲーム初期化
function initGame() {
  render();
}


// 盤面描画
function render() {

  // // ドロップ可能チェック
  // const droppable = droppableCells && droppableCells.some(([dx, dy]) => dx === x && dy === y);
  // if (droppable) cell.classList.add('droppable');
  // // 駒を選択中に、移動できない場所を暗くする（既存）
  // if (selected && !movable) {
  //   cell.classList.add("immovable");
  // }

  // 相手の持ち駒を描画
  renderHand(C.PLAYER_TYPE.OPPONENT);

  boardDiv.innerHTML = "";

  for (let y = 0; y < board.BOARD_SIZE; y++) {
    for (let x = 0; x < board.BOARD_SIZE; x++) {
      // セル作成
      const cell = document.createElement("div");
      cell.className = "cell";
      // セルクリック時の処理
      cell.onclick = () => onCellClick(x, y);
      if (selected && selected.x === x && selected.y === y) {
        cell.classList.add("selected");
      }
      // 移動可能なセル
      const movable = movableCells && movableCells.some(([mx, my]) => mx === x && my === y);
      // 駒を選択中に、移動できない場所を暗くする
      if (selected && !movable) {
        cell.classList.add("immovable");
      }

      // 駒表示
      const piece = board.getPiece(x, y);
      if (piece) {
        const p = document.createElement("div");
        p.className = `piece ${piece.owner}`;
        // テキスト表示の代わりに画像を作成して追加
        const img = document.createElement("img");
        img.src = `img/${piece.type}_${getPlayerColor(piece.owner)}.png`;
        img.className = "piece-img";
        p.appendChild(img);
        cell.appendChild(p);
      }
      boardDiv.appendChild(cell);
    }
  }
  turnDiv.textContent = turn === C.PLAYER_TYPE.SELF ? `${C.PLAYER_TYPE_JAPANESE[turn]}のターンです` : `${C.PLAYER_TYPE_JAPANESE[turn]}のターン`;

  // 自分の持ち駒を描画
  renderHand(C.PLAYER_TYPE.SELF);
}


// セルクリック時
function onCellClick(x, y) {

  // // もし手駒が選択されていればドロップを試みる
  // if (selectedHand) {
  //   // ドロップ可能な場所かチェック（簡易: 空マス）
  //   if (!board.getPiece(x, y)) {
  //     const ok = board.dropPiece(selectedHand.owner, selectedHand.type, x, y);
  //     if (ok) {
  //       // ターン切替（ルールに応じて変更）
  //       turn = playerTypeChange(turn);
  //     } else {
  //       // 失敗時の挙動は必要なら追加
  //     }
  //   }
  //   selectedHand = null;
  //   droppableCells = null;
  //   // 再描画して終了
  //   render();
  //   return;
  // }

  const piece = board.getPiece(x, y);

  // 駒選択
  if (!selected) {
    if (piece && piece.owner === turn) {
      selected = { x, y };
      movableCells = board.getMovableCells(x, y, piece);
    }
  } else {
    // 移動
    if (movableCells && movableCells.some(([mx, my]) => mx === x && my === y)) {
      board.movePiece(selected.x, selected.y, x, y);
      turn = playerTypeChange(turn);
    }
    selected = null;
    movableCells = null
  }

  render();
}


// 持ち駒を描画
function renderHand(owner) {
  const container = owner === C.PLAYER_TYPE.SELF ? selfHandDiv : opponentHandDiv;
  container.innerHTML = "";

  const color = getPlayerColor(owner);
  // タイトルを作成
  const handTitle = document.createElement("h1");
  handTitle.className = "hand-title";
  handTitle.textContent = color === C.PIECE_COLOR.BLACK ? "先手" : "後手";
  container.appendChild(handTitle);

  // 持ち駒エリアを作成
  const counts = getHandCounts(owner);
  const order = Object.keys(counts);
  const handWrap = document.createElement("div");
  handWrap.className = 'hand-wrap';

  for (const type of order) {
    // 持ち駒の種類ごとに要素を作成
    const cnt = counts[type];
    const item = document.createElement('div');
    item.className = `hand-item ${owner}`;
    // 持ち駒の画像
    const img = document.createElement('img');
    img.src = `img/${type}_${color}.png`;
    img.className = 'piece-img';
    item.appendChild(img);

    // ハンドアイテムをクリックで選択／解除
    // item.onclick = (e) => onHandItemClick(e, owner, type);

    // // 選択中の手駒は見た目で示す
    // if (selectedHand && selectedHand.owner === owner && selectedHand.type === type) {
    //   item.classList.add('selected');
    // }

    // 持ち駒の数
    if (cnt > 1) {
      const badge = document.createElement('div');
      badge.className = 'hand-count';
      badge.textContent = `${cnt}`;
      item.appendChild(badge);
    }
    handWrap.appendChild(item);
  }
  container.appendChild(handWrap);
}

// 持ち駒の種類ごとのカウントを返す
function getHandCounts(owner) {
  const counts = {};
  const hand = board.hands[owner]
  for (const p of hand) {
    counts[p.type] = (counts[p.type] || 0) + 1;
  }
  return counts;
}

// 持ち駒をクリックしたとき
function onHandItemClick(event) {
  // イベント伝播を止める
  event.stopPropagation();
  const handOwner = owner;
  const handType = type;

  // 既に同じ手駒が選択されていれば解除
  if (selectedHand && selectedHand.owner === handOwner && selectedHand.type === handType) {
    selectedHand = null;
    droppableCells = null;
  } else {
    // 選択状態にする
    selectedHand = { owner: handOwner, type: handType };
    // 簡易ルール: 空きマスすべてをドロップ候補にする
    droppableCells = [];
    for (let yy = 0; yy < board.BOARD_SIZE; yy++) {
      for (let xx = 0; xx < board.BOARD_SIZE; xx++) {
        if (!board.getPiece(xx, yy)) droppableCells.push([xx, yy]);
      }
    }
    // 盤上の選択を解除
    selected = null;
  }
  render();
};



function handleFlip(x, y, piece) {
  for (const [dx, dy] of directions) {
    let nx = x + dx;
    let ny = y + dy;
    const targets = [];

    while (inBoard(nx, ny)) {
      const t = board.getPiece(nx, ny);
      if (!t) break;

      if (t.owner !== piece.owner) {
        targets.push(t);
      } else {
        // 挟めた
        targets.forEach(p => {
          p.owner = piece.owner;
          p.direction = piece.direction;
        });
        break;
      }

      nx += dx;
      ny += dy;
    }
  }
}

initGame();
