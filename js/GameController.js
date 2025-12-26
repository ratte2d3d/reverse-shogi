import { Constants as C } from "./Constants.js";
import { Board } from "./Board.js";
import { Logic } from "./Logic.js";


export class GameController {
  constructor() {
    this.board = new Board(9);
    this.logic = new Logic(this.board);
    this.myColor = C.PIECE_COLOR.BLACK;
    this.turn = this.myColor === C.PIECE_COLOR.BLACK ? C.PLAYER_TYPE.SELF : C.PLAYER_TYPE.OPPONENT;

    this.selected = null;        // { x, y }
    this.selectedHand = null;    // { owner: , type: }
    this.placeableCells = null;

    this.turnDiv = document.getElementById("turn");
    this.boardDiv = document.getElementById("board");
    this.opponentHandDiv = document.getElementById("opponent-hand");
    this.selfHandDiv = document.getElementById("self-hand");
  }

  
  /**
   * プレイヤーの色取得
   * @param {string} player プレイヤー
   */
  getPlayerColor(player) {
    return player === C.PLAYER_TYPE.SELF ? this.myColor : this.colorChange(this.myColor);
  }

  /**
   * 色変更
   * @param {string} color 色
   */
  colorChange(color) {
    return color === C.PIECE_COLOR.BLACK ? C.PIECE_COLOR.WHITE : C.PIECE_COLOR.BLACK;
  }

  /**
   * プレイヤー変更
   * @param {string} player プレイヤー
   */
  playerTypeChange(player) {
    return player === C.PLAYER_TYPE.SELF ? C.PLAYER_TYPE.OPPONENT : C.PLAYER_TYPE.SELF;
  }

  /**
   * 駒選択状態
   */
  isSelected() {
    return this.selected || this.selectedHand;
  }


  // // サイド切替トグル
  // const sideToggle = document.getElementById("sideToggle");
  // const sideLabel = document.getElementById("sideLabel");
  // if (sideToggle) {
  //   sideToggle.addEventListener("change", () => {
  //     isReverseBoard = !isReverseBoard
  //     // let turn_japanese = null
  //     // if (sideLabel && isReverseBoard){
  //     //   turn_japanese = C.PLAYER_TYPE_JAPANESE[C.PLAYER_TYPE.OPPONENT]
  //     //   sideLabel.textContent = `${turn_japanese}の盤面`
  //     // } else {
  //     //   sideLabel.textContent = ""
  //     // }
  //   });
  // }


  /**
   * ゲーム開始
   */
  start() {
    this.render();
  }


  /**
   * 盤面描画
   */
  render() {

    // 相手の持ち駒を描画
    this.renderHand(C.PLAYER_TYPE.OPPONENT);

    this.boardDiv.innerHTML = "";

    for (let y = 0; y < this.board.BOARD_SIZE; y++) {
      for (let x = 0; x < this.board.BOARD_SIZE; x++) {
        // セル作成
        const cell = document.createElement("div");
        cell.className = "cell";
        // セルクリック時の処理
        cell.onclick = () => this.onCellClick(x, y);
        if (this.selected && this.selected.x === x && this.selected.y === y) {
          cell.classList.add("selected");
        }
        // 移動可能なセル
        const placeable = this.placeableCells && this.placeableCells.some(([mx, my]) => mx === x && my === y);
        // 駒を選択中に、移動できない場所を暗くする
        if (this.isSelected() && !placeable) {
          cell.classList.add("unplaceable");
        }

        // 駒表示
        const piece = this.board.getPiece(x, y);
        if (piece) {
          const p = document.createElement("div");
          p.className = `piece ${piece.owner}`;
          // 画像追加
          const img = document.createElement("img");
          const promotion = piece.promotion ? "_promotion" : "";
          img.src = `img/${piece.type}_${this.getPlayerColor(piece.owner)}${promotion}.png`;
          img.className = "piece-img";
          p.appendChild(img);
          cell.appendChild(p);
        }
        this.boardDiv.appendChild(cell);
      }
    }
    this.turnDiv.textContent = this.turn === C.PLAYER_TYPE.SELF ? `${C.PLAYER_TYPE_JAPANESE[this.turn]}のターンです` : `${C.PLAYER_TYPE_JAPANESE[this.turn]}のターン`;

    // 自分の持ち駒を描画
    this.renderHand(C.PLAYER_TYPE.SELF);
  }


  /**
   * セルクリック時
   * @param x セルの場所
   * @param y セルの場所
   */
  onCellClick(x, y) {
    const piece = this.board.getPiece(x, y);

    // 非選択時
    if (!this.isSelected()) {
      if (piece && piece.owner === this.turn) {
        this.selected = { x, y };
        this.placeableCells = this.logic.getMovableCells(x, y, piece);
      }
    } else {
      // 配置可能時
      if (this.placeableCells && this.placeableCells.some(([mx, my]) => mx === x && my === y)) {
        if (this.selected) {
          this.board.movePiece(this.selected.x, this.selected.y, x, y);
        } else {
          this.board.dropPiece(this.selectedHand.owner, this.selectedHand.type, x, y);
        }
        this.logic.flipPieces(x, y);
        this.turn = this.playerTypeChange(this.turn);
      }
      this.selected = null;
      this.selectedHand = null;
      this.placeableCells = null;
    }

    this.render();
  }


  /**
   * 持ち駒を描画
   * @param {string} owner 駒の持ち主
   */
  renderHand(owner) {
    const container = owner === C.PLAYER_TYPE.SELF ? this.selfHandDiv : this.opponentHandDiv;
    container.innerHTML = "";

    const color = this.getPlayerColor(owner);
    // タイトルを作成
    const handTitle = document.createElement("h1");
    handTitle.className = "hand-title";
    handTitle.textContent = color === C.PIECE_COLOR.BLACK ? "先手" : "後手";
    container.appendChild(handTitle);

    // 持ち駒エリアを作成
    const counts = this.board.getHandCounts(owner);
    const order = Object.keys(counts);
    const handWrap = document.createElement("div");
    handWrap.className = "hand-wrap";

    for (const type of order) {
      // 持ち駒の種類ごとに要素を作成
      const cnt = counts[type];
      const item = document.createElement("div");
      item.className = `hand-item ${owner}`;
      // 持ち駒の画像
      const img = document.createElement("img");
      img.src = `img/${type}_${color}.png`;
      img.className = "piece-img";
      item.appendChild(img);

      // 持ち駒クリック処理
      item.onclick = (e) => this.onHandItemClick(e, owner, type);
      if (this.selectedHand && this.selectedHand.owner === owner && this.selectedHand.type === type) {
        item.classList.add("selected");
      }

      // 持ち駒の数
      if (cnt > 1) {
        const badge = document.createElement("div");
        badge.className = "hand-count";
        badge.textContent = `${cnt}`;
        item.appendChild(badge);
      }
      handWrap.appendChild(item);
    }
    container.appendChild(handWrap);
  }


  /**
   * 持ち駒をクリックしたとき
   * @param {MouseEvent} event イベントオブジェクト
   * @param {string} owner 駒の持ち主
   * @param {string} type 駒の種類
   */
  onHandItemClick(event, owner, type) {
    // イベント伝播を止める
    event.stopPropagation();

    const handOwner = owner;
    const handType = type;

    // 既に選択していたら解除
    if (this.selectedHand && this.selectedHand.owner === handOwner && this.selectedHand.type === handType) {
      this.selectedHand = null;
      this.placeableCells = null;
    } else {
      if (handOwner === this.turn) {
        this.selected = null;
        this.selectedHand = { owner: handOwner, type: handType };
        this.placeableCells = this.logic.getPlaceableCells();
      }
    }

    this.render();
  }
}