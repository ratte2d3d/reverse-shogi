import { Constants as C } from "./constants/Constants.js";
import { Utils as U } from "./utils/Utils.js";

export class Pieces {
    constructor(owner, type) {
        this.owner = owner;
        this.type = type;
        this.directions = C.PIECE_DIRECTION[type];
        this.isLongRange = C.PIECE_RANGE[type];
        this.promotion = false;
    }

    /**
     * 持ち主を変更
     */
    changeOwner() {
        this.owner = U.playerTypeChange(this.owner);
    }

    /**
     * 成駒
     */
    promote() {
        this.promotion = true;
    }

    /**
     * 成駒を元に戻す
     */
    demote() {
        this.promotion = false;
    }
}