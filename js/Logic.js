import { Constants as C } from "./Constants.js";


export class Logic {
    constructor(board) {
        this.board = board;
    }

    /**
     * 盤面の中にあるか判定
     * @param x 駒の場所
     * @param y 駒の場所
     */
    inBoard(x, y) {
        return x >= 0 && y >= 0 && x < this.board.BOARD_SIZE && y < this.board.BOARD_SIZE;
    }

    
    /**
     * 打つことができるセルの取得
     */
    getPlaceableCells() {
      let placeableCells = [];
      for (let y = 0; y < this.board.BOARD_SIZE; y++) {
        for (let x = 0; x < this.board.BOARD_SIZE; x++) {
          if (!this.board.getPiece(x, y)) placeableCells.push([x, y]);
        }
      }
      return placeableCells;
    }


    /**
     * 移動可能なセルの取得
     * @param fromX 動かす駒の場所
     * @param fromY 動かす駒の場所
     * @param {Piece} movingPiece 動かす駒
     */
    getMovableCells(fromX, fromY, movingPiece) {
        let movableCells = []

        // プレイヤーによって「前」の方向を反転させる
        const frontMultiplier = (movingPiece.owner === C.PLAYER_TYPE.SELF) ? 1 : -1;
        for (let [directionX, directionY] of movingPiece.directions) {
            // 移動方向
            const dx = directionX;
            const dy = directionY * frontMultiplier;
            // 移動距離が長い場合繰り返し
            let distance = 1;
            while (true) {
                // 移動先候補
                const toX = fromX + dx * distance;
                const toY = fromY + dy * distance;
                const targetPiece = this.board.getPiece(toX, toY);
                
                // 移動可能か判定
                const mv = this.canMove(toX, toY, movingPiece, targetPiece);
                if (!mv.movable) break;
                movableCells.push([toX, toY]);
                
                // 探索終了
                if (mv.stop) break;
                if (!movingPiece.isRanged) break;

                distance++;
            }
        }
        return movableCells;
    }

    /**
     * 移動可能か判定
     * @param toX 移動先の場所
     * @param toY 移動先の場所
     * @param {Piece} movingPiece 動かす駒
     * @param {Piece} targetPiece 移動先にある駒
     */
    canMove(toX, toY, movingPiece, targetPiece) {
        // 盤面内外の判定
        if (!this.inBoard(toX, toY)) return { movable: false, stop: true };
        // 自分の駒があるか判定
        if (targetPiece && targetPiece.owner === movingPiece.owner) return { movable: false, stop: true };
        // 相手の駒があるか判定
        if (targetPiece && targetPiece.owner !== movingPiece.owner) return { movable: true, stop: true };
        
        return { movable: true, stop: false };
    }


    /**
     * 相手の駒を挟む処理
     * @param x 駒の場所
     * @param y 駒の場所
     */
    flipPieces(x, y) {
        const basePiece = this.board.getPiece(x, y);
        const directions = [
            [0, 1], [0, -1], [1, 0], [-1, 0],
            [1, 1], [1, -1], [-1, 1], [-1, -1]
        ];

        // 周囲8方向をスキャン
        directions.forEach(([dx, dy]) => {
            let tx = x + dx;
            let ty = y + dy;
            let cellsToFlip = [];
            // ある1方向をスキャン
            while (this.inBoard(tx, ty)) {
                const piece = this.board.getPiece(tx, ty);
                if (!piece) break;
                if (piece.owner !== basePiece.owner) {
                    // 王は反転しない仕様
                    if (piece.type !== C.PIECE_TYPE.KING) {
                        cellsToFlip.push({x: tx, y: ty, piece: piece});
                    }
                } else {
                    // 自分の駒で挟めた場合、リストにある駒を反転
                    cellsToFlip.forEach(item => {
                        // ここに、二歩チェックを後から実装
                        item.piece.owner = basePiece.owner;
                    });
                    break;
                }
                tx += dx;
                ty += dy;
            }
        });
    }
}