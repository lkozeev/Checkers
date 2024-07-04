'''
Массив доски
1 - белая шашка
2 - черная шашка
3 - белая дамка
4 - черная дамка
'''

'''
Функция провеки пренадлежности некоторому range[)
'''


def inr(lst: list, rang: list[int, int]) -> bool:
    for i in lst:
        if i < rang[0] or i >= rang[1]:
            return False
    return True


'''
Рекурсивная функция поиска всех возможных взятий
Пример: [[[7, 1], [0, 5], [[0, 6]]], [[5, 0], [1, 3], [[0, 6], [0, 4]]]]
[[[x0, y0], [x1, y1], [Убраные шашки]]]
'''


def take(x: int, y: int, x_start: int, y_start: int, a: list, take_list: list, del_s: list) -> list:
    # for i in a:
    #     print(i)
    # Для шашки
    if a[y][x] == 1:
        for k in [[2, 2], [2, -2], [-2, 2], [-2, -2]]:
            x1 = x + k[0]
            y1 = y + k[1]
            if inr([x1, y1], [0, 8]):
                if a[y1][x1] == 0 and a[(y + y1) // 2][(x + x1) // 2] in [2, 4]:
                    copy_del_s = [i.copy() for i in del_s]
                    copy_del_s.append([(x + x1) // 2, (y + y1) // 2])
                    take_list.append([[x_start, y_start], [x1, y1], copy_del_s])
                    copy_a = [i.copy() for i in a]
                    copy_a[y][x] = 0
                    copy_a[(y + y1) // 2][(x + x1) // 2] = 0
                    copy_a[y1][x1] = 3 if y1 == 0 else 1
                    take(x1, y1, x_start, y_start, copy_a, take_list, copy_del_s)
    # Для дамки
    elif a[y][x] == 3:
        # Диогональ Прово-вверх
        for i in range(1, min(7 - x, y) + 1):
            if a[y - i][x + i] in [1, 3]:
                break
            elif a[y - i][x + i] in [2, 4] and inr([x + i, y - i], [1, 7]) and a[y - i - 1][x + i + 1] != 0:
                break
            elif a[y - i][x + i] in [2, 4] and inr([x + i, y - i], [1, 7]) and a[y - i - 1][x + i + 1] == 0:
                copy_a = [i.copy() for i in a]
                for j in range(1, min(7 - (x + i), (y - i)) + 1):
                    x1 = x + i + j
                    y1 = y - i - j
                    if copy_a[y1][x1] != 0:
                        break
                    copy_del_s = [i.copy() for i in del_s]
                    copy_del_s.append([x + i, y - i])
                    take_list.append([[x_start, y_start], [x1, y1], copy_del_s])
                    copy_a[y][x] = 0
                    copy_a[y - i][x + i] = 0
                    copy_a[y1][x1] = 3
                    take(x1, y1, x_start, y_start, copy_a, take_list, copy_del_s)
                break
        # Диогональ Лево-вниз
        for i in range(1, min(x, 7 - y) + 1):
            if a[y + i][x - i] in [1, 3]:
                break
            elif a[y + i][x - i] in [2, 4] and inr([x - i, y + i], [1, 7]) and a[y + i + 1][x - i - 1] != 0:
                break
            elif a[y + i][x - i] in [2, 4] and inr([x - i, y + i], [1, 7]) and a[y + i + 1][x - i - 1] == 0:
                copy_a = [i.copy() for i in a]
                for j in range(1, min((x - i), 7 - (y + i)) + 1):
                    x1 = x - i - j
                    y1 = y + i + j
                    if copy_a[y1][x1] != 0:
                        break
                    copy_del_s = [i.copy() for i in del_s]
                    copy_del_s.append([x - i, y + i])
                    take_list.append([[x_start, y_start], [x1, y1], copy_del_s])
                    copy_a[y][x] = 0
                    copy_a[y + i][x - i] = 0
                    copy_a[y1][x1] = 3
                    take(x1, y1, x_start, y_start, copy_a, take_list, copy_del_s)
                break
        # Диогональ Лево-вверх
        for i in range(1, min(x, y) + 1):
            if a[y - i][x - i] in [1, 3]:
                break
            elif a[y - i][x - i] in [2, 4] and inr([x - i, y - i], [1, 7]) and a[y - i - 1][x - i - 1] != 0:
                break
            elif a[y - i][x - i] in [2, 4] and inr([x - i, y - i], [1, 7]) and a[y - i - 1][x - i - 1] == 0:
                for j in range(1, min((x - i), (y - i)) + 1):
                    x1 = x - i - j
                    y1 = y - i - j
                    if a[y1][x1] != 0:
                        break
                    copy_a = [i.copy() for i in a]
                    copy_del_s = [i.copy() for i in del_s]
                    copy_del_s.append([x - i, y - i])
                    take_list.append([[x_start, y_start], [x1, y1], copy_del_s])
                    copy_a[y][x] = 0
                    copy_a[y - i][x - i] = 0
                    copy_a[y1][x1] = 3
                    take(x1, y1, x_start, y_start, copy_a, take_list, copy_del_s)
                break
        # Диогональ Право-вниз
        for i in range(1, min(7 - x, 7 - y) + 1):
            if a[y + i][x + i] in [1, 3]:
                break
            elif a[y + i][x + i] in [2, 4] and inr([x + i, y + i], [1, 7]) and a[y + i + 1][x + i + 1] != 0:
                break
            elif a[y + i][x + i] in [2, 4] and inr([x + i, y + i], [1, 7]) and a[y + i + 1][x + i + 1] == 0:
                copy_a = [i.copy() for i in a]
                for j in range(1, min(7 - (x + i), 7 - (y + i)) + 1):
                    x1 = x + i + j
                    y1 = y + i + j
                    if copy_a[y1][x1] != 0:
                        break
                    copy_del_s = [i.copy() for i in del_s]
                    copy_del_s.append([x + i, y + i])
                    take_list.append([[x_start, y_start], [x1, y1], copy_del_s])
                    copy_a[y][x] = 0
                    copy_a[y + i][x + i] = 0
                    copy_a[y1][x1] = 3
                    take(x1, y1, x_start, y_start, copy_a, take_list, copy_del_s)
                break
    return take_list


'''
Получение массива легальных ходов
Пример: [[[x0, y0], [x1, y1]], [[x0, y0], [x1, y1]]]
'''


def move(a: list) -> list:
    move_list = []
    for i in range(8):
        for j in range(8):
            if a[i][j] in [1, 3]:
                take_list = take(j, i, j, i, a, [], [])
                if take_list:
                    move_list += take_list
    if not move_list:
        for i in range(8):
            for j in range(8):
                if a[i][j] == 1:
                    for k in [[1, -1], [-1, -1]]:
                        x1 = j + k[0]
                        y1 = i + k[1]
                        if inr([x1, y1], [0, 8]):
                            if a[y1][x1] == 0:
                                move_list.append([[j, i], [x1, y1], []])
                elif a[i][j] == 3:
                    # Диогональ Право-вверх
                    for k in range(1, min(7 - j, i) + 1):
                        if a[i - k][j + k] == 0:
                            move_list.append([[j, i], [j + k, i - k], []])
                        else:
                            break
                    # Диогональ Лево-вниз
                    for k in range(1, min(j, 7 - i) + 1):
                        if a[i + k][j - k] == 0:
                            move_list.append([[j, i], [j - k, i + k], []])
                        else:
                            break
                    # Диогональ Лево-вверх
                    for k in range(1, min(j, i) + 1):
                        if a[i - k][j - k] == 0:
                            move_list.append([[j, i], [j - k, i - k], []])
                        else:
                            break
                    # Диогональ Право-вниз
                    for k in range(1, min(7 - j, 7 - i) + 1):
                        if a[i + k][j + k] == 0:
                            move_list.append([[j, i], [j + k, i + k], []])
                        else:
                            break

    return move_list


start_position = [[0, 0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0, 0]]
player_w = [i.copy() for i in start_position]

player_b = []
for i in reversed(start_position):
    temp = []
    for j in reversed(i):
        if j == 1:
            temp.append(2)
        elif j == 2:
            temp.append(1)
        elif j == 3:
            temp.append(4)
        elif j == 4:
            temp.append(3)
        else:
            temp.append(j)
    player_b.append(temp)


def do_move(a: list[list], b: list[list], pos0: list[int, int], pos1: list[int, int], del_s: list[list]) -> (list, list):
    a[pos1[1]][pos1[0]] = 3 if pos1[1] == 0 else a[pos0[1]][pos0[0]]
    a[pos0[1]][pos0[0]] = 0
    b[7 - pos1[1]][7 - pos1[0]] = 4 if pos1[1] == 0 else b[7 - pos0[1]][7 - pos0[0]]
    b[7 - pos0[1]][7 - pos0[0]] = 0
    for i in del_s:
        a[i[1]][i[0]] = 0
        b[7 - i[1]][7 - i[0]] = 0
    return a, b


while True:
    print('w board')
    for i in range(len(player_w)):
        print('  '.join(list(map(str, player_w[i]))), '|', i)
    print('-' * 24)
    print('  '.join(list(map(str, range(0, 8)))), '\n')
    legal_move = move(player_w)
    if not legal_move:
        print('b win!')
        break
    for i in range(len(legal_move)):
        print(*legal_move[i], i)
    m = int(input('move_w: '))
    # m = 0
    player_w, player_b = do_move(player_w, player_b, *legal_move[m])
    print(player_w)
    print('b board')
    for i in range(len(player_b)):
        print('  '.join(list(map(str, player_b[i]))), '|', i)
    print('-' * 24)
    print('  '.join(list(map(str, range(0, 8)))), '\n')
    legal_move = move(player_b)
    if not legal_move:
        print('w win!')
        break
    for i in range(len(legal_move)):
        print(*legal_move[i], i)
    m = int(input('move_b: '))
    # m = 0
    player_b, player_w = do_move(player_b, player_w, *legal_move[m])
