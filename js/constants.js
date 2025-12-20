export class Constants {

  static PIECE_COLOR = {
    BLACK: "black",
    WHITE: "white"
  };

  static PLAYER_TYPE = {
    SELF: "self",
    OPPONENT: "opponent"
  };

  static PLAYER_TYPE_JAPANESE = {
    [this.PLAYER_TYPE.SELF]: "あなた",
    [this.PLAYER_TYPE.OPPONENT]: "相手"
  }

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

}