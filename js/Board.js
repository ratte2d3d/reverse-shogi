import { Constants as C } from "./Constants.js";
import { Pieces } from "./Pieces.js";


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


    /**
     * 盤面初期化
     */
    initBoard() {
        for (let y = 0; y < this.BOARD_SIZE; y++) {
            this.board[y] = [];
            for (let x = 0; x < this.BOARD_SIZE; x++) {
                this.board[y][x] = null;
            }
        }
        this.setInitPieces();
    }

    /**
     * 駒の初期配置
     */
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


    /**
     * 駒移動
     * @param fromX 動かす駒の場所
     * @param fromY 動かす駒の場所
     * @param toX 移動先の場所
     * @param toY 移動先の場所
     */
    movePiece(fromX, fromY, toX, toY) {
        const movingPiece = this.getPiece(fromX, fromY);
        const targetPiece = this.getPiece(toX, toY);
        // 相手の駒を取る処理
        if (targetPiece && targetPiece.owner !== movingPiece.owner) {
            targetPiece.owner = movingPiece.owner;
            this.hands[movingPiece.owner].push(targetPiece);
        }
        // 駒の移動
        this.board[toY][toX] = movingPiece;
        this.board[fromY][fromX] = null;
    }

    /**
     * 駒打ち
     * @param {string} owner 駒の持ち主
     * @param {string} type 駒の種類
     * @param toX 移動先の場所
     * @param toY 移動先の場所
     */
    dropPiece(owner, type, toX, toY) {
        const hand = this.hands[owner];
        const idx = hand.findIndex(p => p.type === type);
        // 手駒から取り出す
        const pieceFromHand = hand.splice(idx, 1)[0];
        // 駒を打つ
        this.board[toY][toX] = pieceFromHand;
    }


    /**
     * 駒取得
     * @param x 駒の場所
     * @param y 駒の場所
     */
    getPiece(x, y) {
        return this.board[y] && this.board[y][x];
    }

    /**
     * 持ち駒の種類ごとのカウントを返す
     * @param {string} owner 駒の持ち主
     */
    getHandCounts(owner) {
        const counts = {};
        const hand = this.hands[owner]
        for (const p of hand) {
            counts[p.type] = (counts[p.type] || 0) + 1;
        }
        return counts;
    }
}