import { Constants as C } from "./constants.js";


export class Logic {
    constructor(board) {
        this.board = board;
    }


    // 移動可能なセルの取得
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

    // 移動可能か判定
    canMove(toX, toY, movingPiece, targetPiece) {
        // 盤面内外の判定
        if (!this.inBoard(toX, toY)) return { movable: false, stop: true };
        // 自分の駒があるか判定
        if (targetPiece && targetPiece.owner === movingPiece.owner) return { movable: false, stop: true };
        // 相手の駒があるか判定
        if (targetPiece && targetPiece.owner !== movingPiece.owner) return { movable: true, stop: true };
        
        return { movable: true, stop: false };
    }

    // 盤面内外の判定
    inBoard(x, y) {
        return x >= 0 && y >= 0 && x < this.board.BOARD_SIZE && y < this.board.BOARD_SIZE;
    }
}