rate = 0.07

king = 100
rook = king / ( 1.14 - rate )
gold = rook / (1.09 - rate)
knight = gold / (1.10 - rate)
lance = knight / 1.0
pawn = lance / (1.13 - rate)


print(king)
print(rook)
print(gold)
print(knight)
print(lance)
print(pawn)

white_color = [
    "000000",   # 文字
    "ffffff",   # 面
    "444444"    # 縁
]
black_color = [
    "ffffff",   # 文字
    "000000",   # 面
    "eeeeee"    # 縁
]
white_pro = [
    "cc0000",   # 文字
    "ffffff",   # 面
    "444444"    # 縁
]
black_color = [
    "cc0000",   # 文字
    "000000",   # 面
    "eeeeee"    # 縁
]