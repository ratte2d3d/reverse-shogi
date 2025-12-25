export class Constants {

  static PLAYER_TYPE = {
    SELF: "self",
    OPPONENT: "opponent"
  };

  static PLAYER_TYPE_JAPANESE = {
    [this.PLAYER_TYPE.SELF]: "あなた",
    [this.PLAYER_TYPE.OPPONENT]: "相手"
  }

  static PIECE_COLOR = {
    BLACK: "black",
    WHITE: "white"
  };

  static PIECE_TYPE = {
    KING: "king",
    ROOK: "rook",
    BISHOP: "bishop",
    GOLD: "gold",
    SILVER: "silver",
    KNIGHT: "knight",
    LANCE: "lance",
    PAWN: "pawn"
  };

  static PIECE_DIRECTION = {
    [this.PIECE_TYPE.KING]: [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]],
    [this.PIECE_TYPE.ROOK]: [[0, 1], [0, -1], [1, 0], [-1, 0]],
    [this.PIECE_TYPE.BISHOP]: [[1, 1], [1, -1], [-1, 1], [-1, -1]],
    [this.PIECE_TYPE.GOLD]: [[0, -1], [1, -1], [-1, -1], [1, 0], [-1, 0], [0, 1]],
    [this.PIECE_TYPE.SILVER]: [[0, -1], [1, -1], [-1, -1], [1, 1], [-1, 1]],
    [this.PIECE_TYPE.KNIGHT]: [[1, -2], [-1, -2]],
    [this.PIECE_TYPE.LANCE]: [[0, -1]],
    [this.PIECE_TYPE.PAWN]: [[0, -1]],
  };

  static PIECE_RANGE = {
    [this.PIECE_TYPE.KING]: false,
    [this.PIECE_TYPE.ROOK]: true,
    [this.PIECE_TYPE.BISHOP]: true,
    [this.PIECE_TYPE.GOLD]: false,
    [this.PIECE_TYPE.SILVER]: false,
    [this.PIECE_TYPE.KNIGHT]: false,
    [this.PIECE_TYPE.LANCE]: true,
    [this.PIECE_TYPE.PAWN]: false,
  };
}