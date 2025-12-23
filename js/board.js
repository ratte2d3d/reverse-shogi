import { Constants as C } from "./constants.js";
import { Pieces } from "./pieces.js";


export class Board {
    constructor(boardSize) {
        this.BOARD_SIZE = boardSize;
        this.board = [];
        this.hands = {
            [C.PLAYER_TYPE.SELF]: [],
            [C.PLAYER_TYPE.OPPONENT]: []
        };
        this.initBoard();
    }

    // 盤面初期化
    initBoard() {
        for (let y = 0; y < this.BOARD_SIZE; y++) {
            this.board[y] = [];
            for (let x = 0; x < this.BOARD_SIZE; x++) {
                this.board[y][x] = null;
            }
        }
        this.setInitPieces();
    }

    // 駒の初期配置
    setInitPieces() {
        for (let i = 0; i <= 1; i++) {
            let first_y, second_y, third_y, rook_x, bishop_x, owner;
            if (i === 0) {
                first_y = 0;
                second_y = 1;
                third_y = 2;
                rook_x = 1;
                bishop_x = this.BOARD_SIZE - 2;
                owner = C.PLAYER_TYPE.OPPONENT;
            } else {
                first_y = this.BOARD_SIZE - 1;
                second_y = this.BOARD_SIZE - 2;
                third_y = this.BOARD_SIZE - 3;
                rook_x = this.BOARD_SIZE - 2;
                bishop_x = 1;
                owner = C.PLAYER_TYPE.SELF;
            }
            this.board[first_y][0] = new Pieces(owner, C.PIECE_TYPE.LANCE);
            this.board[first_y][1] = new Pieces(owner, C.PIECE_TYPE.KNIGHT);
            this.board[first_y][2] = new Pieces(owner, C.PIECE_TYPE.SILVER);
            this.board[first_y][3] = new Pieces(owner, C.PIECE_TYPE.GOLD);
            this.board[first_y][4] = new Pieces(owner, C.PIECE_TYPE.KING);
            this.board[first_y][5] = new Pieces(owner, C.PIECE_TYPE.GOLD);
            this.board[first_y][6] = new Pieces(owner, C.PIECE_TYPE.SILVER);
            this.board[first_y][7] = new Pieces(owner, C.PIECE_TYPE.KNIGHT);
            this.board[first_y][8] = new Pieces(owner, C.PIECE_TYPE.LANCE);
            this.board[second_y][rook_x] = new Pieces(owner, C.PIECE_TYPE.ROOK);
            this.board[second_y][bishop_x] = new Pieces(owner, C.PIECE_TYPE.BISHOP);
            for (let x = 0; x < this.BOARD_SIZE; x++) {
                this.board[third_y][x] = new Pieces(owner, C.PIECE_TYPE.PAWN);
            }
        }
    }


    // 移動可能なセル取得
    // getMovableCells(from, to, board) {

    //     // プレイヤーによって「前」の方向を反転させる
    //     const fromMultiplier = (this.owner === C.PLAYER_TYPE.SELF) ? 1 : -1;
    //     const dx = to.x - from.x;
    //     const dy = (to.y - from.y) * fromMultiplier;

    //     for (let [rx, ry] of this.directions) {
    //         if (this.isRanged) {
    //             if (isSameDirection(dx, dy, rx, ry)) {
    //                 // 移動経路に他の駒がないかチェック（障害物判定）
    //                 return isPathClear(from, to, grid);
    //             }
    //         } else {
    //             // 歩・金・王などの1マス移動（または桂馬）
    //             if (dx === rx && dy === ry) return true;
    //         }
    //     }
    //     return false;
    // }


    // 駒取得
    getPiece(x, y) {
        return this.board[y] && this.board[y][x];
    }


    // 移動可能なセルの取得
    getMovableCells(fromX, fromY, movingPiece) {
        let movableCells = []

        // プレイヤーによって「前」の方向を反転させる
        const frontMultiplier = (movingPiece.owner === C.PLAYER_TYPE.SELF) ? 1 : -1;
        for (let [directionX, directionY] of movingPiece.directions) {
            // 移動距離が長い場合繰り返し
            do {
                // 移動先候補
                const toX = fromX + directionX;
                const toY = fromY + directionY * frontMultiplier;
                console.log(toX, toY);
                const targetPiece = this.getPiece(toX, toY);
                // 移動可能か判定
                if (this.canMove(toX, toY, movingPiece, targetPiece)) {
                    movableCells.push([toX, toY]);
                } else {
                    break;
                }
            } while (movingPiece.isRanged);
        }
        return movableCells;
    }

    // 移動可能か判定
    canMove(toX, toY, movingPiece, targetPiece) {
        // 盤面内外の判定
        if (!this.inBoard(toX, toY)) return false;
        // 自分の駒があるか判定
        if (targetPiece && targetPiece.owner === movingPiece.owner) return false;

        return true;
    }

    // 盤面内外の判定
    inBoard(x, y) {
        return x >= 0 && y >= 0 && x < this.BOARD_SIZE && y < this.BOARD_SIZE;
    }


    // 駒移動
    movePiece(fromX, fromY, toX, toY) {
        const movingPiece = this.getPiece(fromX, fromY);
        const targetPiece = this.getPiece(toX, toY);
        if (!movingPiece) return;

        // 取る処理
        if (targetPiece && targetPiece.owner !== movingPiece.owner) {
            targetPiece.owner = movingPiece.owner;
            this.hands[movingPiece.owner].push(targetPiece);
        }

        // 駒の移動
        this.board[toY][toX] = movingPiece;
        this.board[fromY][fromX] = null;

        // 挟み反転
        // handleFlip(toX, toY, piece);
    }
}