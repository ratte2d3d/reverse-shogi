import { Constants as C } from "./Constants.js";

export class Pieces {
    constructor(owner, type) {
        this.owner = owner
        this.type = type
        this.directions = C.PIECE_DIRECTION[type]
        this.isRanged = C.PIECE_RANGE[type]
    }
}