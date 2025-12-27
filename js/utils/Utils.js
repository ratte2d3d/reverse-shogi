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


    /**
     * 中央に表示する確認ダイアログを生成し、選択結果を Promise で返す
     * @param {string} message ダイアログ本文
     * @returns {Promise<boolean>} 選択結果
     */
    static showConfirmDialog(message) {
        return new Promise((resolve) => {
        const overlay = document.createElement("div");
        overlay.className = "modal-overlay";

        const modal = document.createElement("div");
        modal.className = "modal";

        const msg = document.createElement("div");
        msg.className = "modal-message";
        msg.textContent = message;

        const btnWrap = document.createElement("div");
        btnWrap.className = "modal-buttons";

        const yes = document.createElement("button");
        yes.className = "confirm";
        yes.textContent = "はい";
        yes.onclick = () => {
            document.body.removeChild(overlay);
            resolve(true);
        };

        const no = document.createElement("button");
        no.className = "cancel";
        no.textContent = "いいえ";
        no.onclick = () => {
            document.body.removeChild(overlay);
            resolve(false);
        };

        btnWrap.appendChild(yes);
        btnWrap.appendChild(no);
        modal.appendChild(msg);
        modal.appendChild(btnWrap);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        });
    }
}