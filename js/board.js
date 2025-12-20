import { Constants as C } from "./constants.js";

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
            this.board[first_y][0] = this.createPiece(owner, C.PIECE_TYPE.LANCE);
            this.board[first_y][1] = this.createPiece(owner, C.PIECE_TYPE.KNIGHT);
            this.board[first_y][2] = this.createPiece(owner, C.PIECE_TYPE.SILVER);
            this.board[first_y][3] = this.createPiece(owner, C.PIECE_TYPE.GOLD);
            this.board[first_y][4] = this.createPiece(owner, C.PIECE_TYPE.KING);
            this.board[first_y][5] = this.createPiece(owner, C.PIECE_TYPE.GOLD);
            this.board[first_y][6] = this.createPiece(owner, C.PIECE_TYPE.SILVER);
            this.board[first_y][7] = this.createPiece(owner, C.PIECE_TYPE.KNIGHT);
            this.board[first_y][8] = this.createPiece(owner, C.PIECE_TYPE.LANCE);
            this.board[second_y][rook_x] = this.createPiece(owner, C.PIECE_TYPE.ROOK);
            this.board[second_y][bishop_x] = this.createPiece(owner, C.PIECE_TYPE.BISHOP);
            for (let x = 0; x < this.BOARD_SIZE; x++) {
                this.board[third_y][x] = this.createPiece(owner, C.PIECE_TYPE.PAWN);
            }
        }
    }

    // 駒作成
    createPiece(owner, type) {
        return {
            owner,
            type
        };
    }


    // 駒移動
    movePiece(fromX, fromY, toX, toY) {
        const movingPiece = this.board[fromY][fromX];
        const targetPiece = this.board[toY][toX];
        if (!movingPiece) return;

        // 取る処理
        if (targetPiece && targetPiece.owner !== movingPiece.owner) {
            targetPiece.owner = movingPiece.owner;
            this.hands[movingPiece.owner].push(targetPiece);
            console.log(this.hands);
        }

        // 駒の移動
        this.board[toY][toX] = movingPiece;
        this.board[fromY][fromX] = null;

        // 挟み反転
        // handleFlip(toX, toY, piece);
    }

    // 駒取得
    getPiece(x, y) {
        return this.board[y] && this.board[y][x];
    }
}