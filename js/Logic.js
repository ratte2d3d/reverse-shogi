import { Constants as C } from "./constants/Constants.js";


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

        // 通常時の移動方向をスキャン
        // 飛車角は成駒でも通常時の移動をするためスキャン
        if (
            !movingPiece.promotion ||
            movingPiece.type === C.PIECE_TYPE.ROOK ||
            movingPiece.type === C.PIECE_TYPE.BISHOP
        ) {
            movableCells = this.scanMovableCells(
                fromX,
                fromY,
                movingPiece,
                movingPiece.directions,
                movingPiece.isLongRange,
                movableCells
            );
        }

        // 成駒時の移動方向
        if (movingPiece.promotion) {
            // 飛車角で追加される移動方向
            if (movingPiece.type === C.PIECE_TYPE.ROOK || movingPiece.type === C.PIECE_TYPE.BISHOP) {
                movableCells = this.scanMovableCells(
                    fromX,
                    fromY,
                    movingPiece,
                    C.PIECE_DIRECTION[C.PIECE_TYPE.KING],
                    false,
                    movableCells
                );
            } else {
                // 飛車角以外の移動方向（金）
                movableCells = this.scanMovableCells(
                    fromX,
                    fromY,
                    movingPiece,
                    C.PIECE_DIRECTION[C.PIECE_TYPE.GOLD],
                    false,
                    movableCells
                );
            }
        }

        return movableCells;
    }

    /**
     * 指定した方向へ移動可能か判定
     * @param fromX 動かす駒の場所
     * @param fromY 動かす駒の場所
     * @param {Piece} movingPiece 動かす駒
     * @param direction スキャンする方向
     * @param {boolean} isLongRange 長距離をスキャンするかどうか
     * @param movableCells 移動可能なセル
     */
    scanMovableCells(fromX, fromY, movingPiece, direction, isLongRange, movableCells) {
        // プレイヤーによって「前」の方向を反転させる
        const frontMultiplier = (movingPiece.owner === C.PLAYER_TYPE.SELF) ? 1 : -1;

        for (let [directionX, directionY] of direction) {
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
                // 重複処理
                if (!movableCells.some(([cx, cy]) => cx === toX && cy === toY)) movableCells.push([toX, toY]);

                // 探索終了
                if (mv.stop) break;
                if (!isLongRange) break;

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
     * 成駒
     * @param fromX 動かす前の場所
     * @param fromY 動かす前の場所
     * @param toX 動かした後の場所
     * @param toY 動かした後の場所
     */
    getPromotionStatus(fromX, fromY, toX, toY) {
        const piece = this.board.getPiece(toX, toY);
        if (!piece) return C.PromotionStatus.CANNOT_PROMOTE;
        if (piece.promotion) return C.PromotionStatus.CANNOT_PROMOTE;

        // 王、金は成らない
        if (piece.type === C.PIECE_TYPE.KING || piece.type === C.PIECE_TYPE.GOLD) {
            return C.PromotionStatus.CANNOT_PROMOTE;
        }
        // 成る範囲
        const mustPromotionArea = this.board.getMustPromotionArea(piece.owner, piece.type);
        const promotionArea = this.board.getPromotionArea(piece.owner);
        // 必須成り判定
        if (mustPromotionArea.includes(toY)) {
            return C.PromotionStatus.MUST_PROMOTE;
        }
        // 成れるか判定
        if (promotionArea.includes(fromY) || promotionArea.includes(toY)) {
            return C.PromotionStatus.OPTIONAL;
        }
        return C.PromotionStatus.CANNOT_PROMOTE;
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
                        cellsToFlip.push({ x: tx, y: ty, piece: piece });
                    }
                } else {
                    // 自分の駒で挟めた場合、リストにある駒を反転
                    cellsToFlip.forEach(item => {
                        // ここに、二歩チェックを後から実装
                        item.piece.changeOwner();
                        item.piece.demote();
                    });
                    break;
                }
                tx += dx;
                ty += dy;
            }
        });
    }
}