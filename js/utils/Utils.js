import { Constants as C } from "../constants/Constants.js";

export class Utils {
    /**
     * 色変更
     * @param {string} color 色
     */
    static colorChange(color) {
        return color === C.PIECE_COLOR.BLACK ? C.PIECE_COLOR.WHITE : C.PIECE_COLOR.BLACK;
    }

    /**
     * プレイヤー変更
     * @param {string} player プレイヤー
     */
    static playerTypeChange(player) {
        return player === C.PLAYER_TYPE.SELF ? C.PLAYER_TYPE.OPPONENT : C.PLAYER_TYPE.SELF;
    }
}