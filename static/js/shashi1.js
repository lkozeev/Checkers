class Pos {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    add(other) {
        return new Pos(this.x + other.x, this.y + other.y);
    }

    subtract(other) {
        return new Pos(this.x - other.x, this.y - other.y);
    }
}

class Move {
    constructor(pos0 = new Pos(), pos1 = new Pos(), take = []) {
        this.pos0 = pos0;
        this.pos1 = pos1;
        this.take = take;
    }
}

class Board {
    constructor(board, move) {
        this.board = [];
        this.move = move;

        for (let i = 0; i < 8; i++) {
            this.board[i] = board[i].slice();
        }
    }

    setMove(m) {
        this.move = m;
    }

    moved(m, c = true) {
        let k = false;
        for (let i = 0; i < m.take.length; i++) {
            this.board[m.take[i].y][m.take[i].x] = 0;
            if (m.take[i].y == (this.move ? 1 : 6)) {
                k = true;
            }
        }
        this.board[m.pos1.y][m.pos1.x] = (k || m.pos1.y == (this.move ? 0 : 7) ? (this.move ? 3 : 4) : this.board[m.pos0.y][m.pos0.x]);
        this.board[m.pos0.y][m.pos0.x] = 0;
        if (c) {
            this.move = !this.move;
        }
    }

    unmoved(m, tk, ps, c = true) {
        this.board[m.pos1.y][m.pos1.x] = 0;
        this.board[m.pos0.y][m.pos0.x] = ps;
        for (let i = 0; i < m.take.length; i++) {
            this.board[m.take[i].y][m.take[i].x] = tk[i];
        }
        if (c) {
            this.move = !this.move;
        }
    }

    get(pos) {
        return this.board[pos.y][pos.x];
    }

    set(pos, value) {
        this.board[pos.y][pos.x] = value;
    }

    toString() {
        let result = "";
        for (let i = 0; i < 8; i++) {
            result += i + ' ';
        }
        result += '\n\n';

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                result += this.board[j][i] + ' ';
            }
            result += ' ' + i + '\n';
        }

        return result;
    }
}

function inBounds(p, mn, mx) {
    return p.x >= mn && p.x <= mx && p.y >= mn && p.y <= mx;
}

class Shashi {
    constructor() {
        let t = [
            [0, 2, 0, 2, 0, 2, 0, 2],
            [2, 0, 2, 0, 2, 0, 2, 0],
            [0, 2, 0, 2, 0, 2, 0, 2],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0]
        ];
        this.board = new Board(t, true);
    }

    setBoard(b) {
        this.board = b;
    }

    move(m) {
        this.board.moved(m);
    }

    getLegalMoves() {
        return this.getLegalMovesInternal(this.board);
    }

    getLegalMovesInternal(b) {
        const pis = b.move ? [1, 3, 2, 4] : [2, 4, 1, 3];
        const moveList = [];
        const tempVector = [];

        for (let k = 0; k < 2; k++) {
            for (let i = k; i < 8; i += 2) {
                for (let j = 1 - k; j < 8; j += 2) {
                    const tempPos = new Pos(j, i);
                    this.takeRecursive(tempPos, b, tempVector, tempPos, moveList, pis);
                }
            }
        }

        if (moveList.length == 0) {
            for (let k = 0; k < 2; k++) {
                for (let i = k; i < 8; i += 2) {
                    for (let j = 1 - k; j < 8; j += 2) {
                        const ps = new Pos(j, i);
                        if (b.get(ps) == pis[0]) {
                            for (const i of (b.move ? [new Pos(1, -1), new Pos(-1, -1)] : [new Pos(1, 1), new Pos(-1, 1)])) {
                                const ps_t = ps.add(i);
                                if (inBounds(ps_t, 0, 7) && b.get(ps_t) == 0) {
                                    moveList.push(new Move(ps, ps_t, []));
                                }
                            }
                        }

                        if (b.get(ps) == pis[1]) {
                            for (const i of [new Pos(1, 1), new Pos(1, -1), new Pos(-1, 1), new Pos(-1, -1)]) {
                                let ps_t = ps.add(i);
                                while (inBounds(ps_t, 0, 7) && b.get(ps_t) == 0) {
                                    moveList.push(new Move(ps, ps_t, []));
                                    ps_t = ps_t.add(i);
                                }
                            }
                        }
                    }
                }
            }
        }

        return moveList;
    }

    takeRecursive(p, b, delList, pStart, takeList, pis) {
        if (b.get(p) == pis[0]) {
            for (const i of [new Pos(1, 1), new Pos(1, -1), new Pos(-1, 1), new Pos(-1, -1)]) {
                const ps = p.add(i);
                const ps_t = ps.add(i);
                if (inBounds(ps, 1, 6) && (b.get(ps) == pis[2] || b.get(ps) == pis[3]) && b.get(ps_t) == 0) {
                    delList.push(ps);
                    takeList.push(new Move(pStart, ps_t, delList.slice()));
                    const pps = [b.get(ps)];
                    const tempMove = new Move(p, ps_t, [ps]);
                    b.moved(tempMove, false);
                    this.takeRecursive(ps_t, b, delList, pStart, takeList, pis);
                    b.unmoved(tempMove, pps, pis[0], false);
                    delList.pop();
                }
            }
        }

        if (b.get(p) == pis[1]) {
            for (const i of [new Pos(1, 1), new Pos(1, -1), new Pos(-1, 1), new Pos(-1, -1)]) {
                let ps = p.add(i);
                while (inBounds(ps, 1, 6)) {
                    let ps_t = ps.add(i);
                    if (b.get(ps) == pis[0] || b.get(ps) == pis[1]) {
                        break;
                    }
                    if (b.get(ps) !== 0 && b.get(ps_t) !== 0) {
                        break;
                    }
                    if (b.get(ps) !== 0) {
                        delList.push(ps);
                        const pps = [b.get(ps)];
                        const tempMove = new Move(p, ps_t, [ps]);
                        let flagTemp = true;
                        b.moved(tempMove, false);
                        while (flagTemp || (inBounds(ps_t, 0, 7) && b.get(ps_t) == 0)) {
                            if (flagTemp) {
                                flagTemp = false;
                            }
                            takeList.push(new Move(pStart, ps_t, delList.slice()));
                            this.takeRecursive(ps_t, b, delList, pStart, takeList, pis);
                            ps_t = ps_t.add(i);
                        }
                        b.unmoved(tempMove, pps, pis[1], false);
                        delList.pop();
                        break;
                    }
                    ps = ps.add(i);
                }
            }
        }
    }

    eval(b) {
        const pis = [1, 3, 2, 4];
        let e = 0.0;

        for (let k = 0; k < 2; k++) {
            for (let i = k; i < 8; i += 2) {
                for (let j = 1 - k; j < 8; j += 2) {
                    const piece = b.get(new Pos(j, i));
                    if (piece !== 0) {
                        if (piece == pis[0]) {
                            e += 1.0;
                        }
                        if (piece == pis[1]) {
                            e += 8.0;
                        }
                        if (piece == pis[2]) {
                            e -= 1.0;
                        }
                        if (piece == pis[3]) {
                            e -= 8.0;
                        }
                    }
                }
            }
        }

        return e;
    }

    notMultyStock(depth = 3, out = false) {
        const legalMoves = this.getLegalMoves();
        let bestScore = -1e9;
        let depthMate = -1;
        let bestMove;

        for (const mv of legalMoves) {
            const tempBoard = new Board(this.board.board, this.board.move);
            tempBoard.moved(mv);
            const score = this.minimax(tempBoard, depth, false, -1e9, 1e9, depthMate);
            if (out) {
                if (Math.abs(score) >= 1e6) {
                    console.log(`~ ${score > 0 ? '#' : '-#'}${depth - Math.abs(score) + 1e6}\t${mv.pos0.x} ${mv.pos0.y}  ${mv.pos1.x} ${mv.pos1.y}`);
                } else {
                    console.log(`~ ${score}\t${mv.pos0.x} ${mv.pos0.y}  ${mv.pos1.x} ${mv.pos1.y}`);
                }
            }
            if (score >= bestScore) {
                bestScore = score;
                bestMove = mv;
            }
        }

        return [bestScore, bestMove];
    }

    minimax(b, depth, maximizingPlayer, alpha, beta, depthMate) {
        const legalMoves = this.getLegalMovesInternal(b);

        if (depth == 0 || legalMoves.length == 0 || depth <= depthMate) {
            if (legalMoves.length == 0) {
                return maximizingPlayer ? -1e6 - depth : +1e6 + depth;
            }
            if (depth <= depthMate) {
                return 0;
            }
            return b.move ? -this.eval(b) : +this.eval(b);
        }

        if (maximizingPlayer) {
            let maxEval = -1e9;
            for (const move of legalMoves) {
                let take = [];
                for (const i of move.take) {
                    take.push(b.get(i));
                }
                const tps = b.get(move.pos0);
                b.moved(move);
                const ev = this.minimax(b, depth - 1, false, alpha, beta, depthMate);
                b.unmoved(move, take, tps);
                if (maxEval < ev) {
                    maxEval = ev;
                }
                if (alpha < ev) {
                    alpha = ev;
                }
                if (beta <= alpha) {
                    break;
                }
            }
            return maxEval;
        } else {
            let minEval = 1e9;
            for (const move of legalMoves) {
                let take = [];
                for (const i of move.take) {
                    take.push(b.get(i));
                }
                const tps = b.get(move.pos0);
                b.moved(move);
                const ev = this.minimax(b, depth - 1, true, alpha, beta, depthMate);
                b.unmoved(move, take, tps);
                if (minEval > ev) {
                    minEval = ev;
                }
                if (beta > ev) {
                    beta = ev;
                }
                if (beta <= alpha) {
                    break;
                }
            }
            return minEval;
        }
    }

    toString() {
        let result = "";
        for (let i = 0; i < 8; i++) {
            result += i + ' ';
        }
        result += '\n\n';

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                result += this.board.get(new Pos(j, i)) + ' ';
            }
            result += ' ' + i + '\n';
        }

        return result;
    }
}
/////////////////////////
s = new Shashi();
var a = [];
var isLegal;
var b = [[], []];
var col = [];
var legal_move = [];
for (let i of s.getLegalMoves())
    legal_move.push([[i.pos0.x, i.pos0.y], [i.pos1.x, i.pos1.y], i.take])

setBoard([[0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0]], s.board.board)

function setBoard(pos0, pos1) {
    for (let i = 0; i < 8; i++)
        for (let j = 0; j < 8; j++)
            if (pos1[i][j] != pos0[i][j]) {
                let p = document.getElementById(String(j) + String(i))
                if (p.classList.length > 1)
                    p.classList.remove(p.classList[1])
                if (pos1[i][j] == 1)
                    p.classList.add('w')
                else if (pos1[i][j] == 2)
                    p.classList.add('b')
                else if (pos1[i][j] == 3)
                    p.classList.add('wd')
                else if (pos1[i][j] == 4)
                    p.classList.add('bd')
            }
}

document.querySelector('table').onclick = (event) => {
    if (event.target.tagName != 'TD')
        return
    else if (a.length == 0) {
        if (event.target.classList.length > 1)
            if (event.target.classList[1][0] == 'w') {
                a = [event.target.id]
                b = [[], []]

                document.getElementById(a[0]).classList.add("blur")

                for (let i of legal_move) {
                    if (a[0] == String(i[0][0]) + String(i[0][1])) {
                        b[0].push(i)
                        document.getElementById(String(i[1][0]) + String(i[1][1])).classList.add('pblur')
                    }
                }
            }
    }
    else if (a.length == 1) {
        a.push(event.target.id)
        isLegal = false

        for (let i of b[0])
            if (String(i[0][0]) + String(i[0][1]) == a[0] && String(i[1][0]) + String(i[1][1]) == a[1]) {
                isLegal = true
                break
            }

        if (isLegal) {
        for (let i of col)
            document.getElementById(i[0]).classList.remove(i[1])
        col = []
        document.getElementById(a[0]).classList.remove("blur")

        for (let i of b[0]) {
            document.getElementById(String(i[1][0]) + String(i[1][1])).classList.remove('pblur')
            if (a[1] == String(i[1][0]) + String(i[1][1]))
                b[1].push(i)
        }

        if (b[1].length > 1) {
            let str = 'Есть несколько вариантов попасть в это клетку\n'
            let n = 0
            for (let i of b[1]) {
                str += n + ': ' + i[2].join(' ') + '\n'
                n++
            }
            b[1].push(b[1][prompt(str)])
        }

        let old_pos = s.board.board.map((a) => {return a.slice()})
        s.move(new Move(new Pos(a[0][0], a[0][1]), new Pos(a[1][0], a[1][1]), b[1][0][2]));
        setBoard(old_pos, s.board.board)

        document.getElementById(a[0]).classList.add("mblur")
        document.getElementById(a[1]).classList.add("mblur")
        col = [[a[0], 'mblur'], [a[1], 'mblur']]
        
        //socket.emit('move', pos, [a[0], a[1]])
        let best_s_move = s.notMultyStock(8, true)[1];
        old_pos = s.board.board.map((a) => {return a.slice()})
        s.move(best_s_move);
        setBoard(old_pos, s.board.board)
        for (let i of col)
            document.getElementById(i[0]).classList.remove(i[1])
        col = []
        a = []
        legal_move = []
        for (let i of s.getLegalMoves())
            legal_move.push([[i.pos0.x, i.pos0.y], [i.pos1.x, i.pos1.y], i.take])
        }
        else {
        if (a[0] == a[1]) {
            document.getElementById(a[0]).classList.remove("blur")
            for (let i of b[0])
                document.getElementById(String(i[1][0]) + String(i[1][1])).classList.remove('pblur')
            a = []
        }
        else if (document.getElementById(a[1]).classList.length > 1 && document.getElementById(a[1]).classList[1][0] == 'w') {
            document.getElementById(a[0]).classList.remove("blur")
            for (let i of b[0]) { 
                document.getElementById(String(i[1][0]) + String(i[1][1])).classList.remove('pblur')
                if (a[1] == String(i[1][0]) + String(i[1][1]))
                    b[1].push(i)
            }

            a = [event.target.id]
            b = [[], []]
            legal_move = []
            for (let i of s.getLegalMoves())
                legal_move.push([[i.pos0.x, i.pos0.y], [i.pos1.x, i.pos1.y], i.take])

            document.getElementById(a[0]).classList.add("blur")

            for (let i of legal_move)
            if (a[0] == String(i[0][0]) + String(i[0][1])) {
                b[0].push(i)
                document.getElementById(String(i[1][0]) + String(i[1][1])).classList.add('pblur')
            }
        }
        else
            a.pop()
        }
    }
}