//Далбоёб, используй это!!!

#include <iostream>
#include <vector>
#include <limits>
#include <cmath>
#include <thread>

#define N = 0


struct pos {
    int x;
    int y;

    pos(int xv = 0, int yv = 0) : x(xv), y(yv) {}

    pos operator + (const pos& other) const {
        return pos(x + other.x, y + other.y);
    }

    pos operator - (const pos& other) const {
        return pos(x - other.x, y - other.y);
    }
};



struct Move {
    pos pos0;
    pos pos1;
    std::vector<pos> take;

    Move() : pos0(), pos1(), take() {}
    Move(const pos& p0, const pos& p1, const std::vector<pos>& t): pos0(p0), pos1(p1), take(t) {}
};

class Board {
    private:
        int board[8][8];
        bool move;
    public:
        Board(const int (&b)[8][8], bool m): move(m) {
            for (int i = 0; i < 8; i++)
                for (int j = 0; j < 8; j++)
                    board[i][j] = b[i][j];
        }

        bool get_move() {
            return move;
        }

        void set_move(bool m) {
            move = m;
        }

        void moved(const Move& m, bool c=true) {
            bool k = false;
            for (int i = 0; i < m.take.size(); i++) {
                board[m.take[i].y][m.take[i].x] = 0;
                if (m.take[i].y == (move ? 0 : 7))
                    k = true;
            }
            board[m.pos1.y][m.pos1.x] = (k || m.pos1.y == (move ? 0 : 7) ? (move ? 3 : 4) : board[m.pos0.y][m.pos0.x]);
            board[m.pos0.y][m.pos0.x] = 0;
            if (c)
                move = !move;
        }

        void unmoved(const Move& m, const std::vector<int>& tk, const int& ps, bool c=true) {
            board[m.pos1.y][m.pos1.x] = 0;
            board[m.pos0.y][m.pos0.x] = ps;
            for (int i = 0; i < m.take.size(); i++)
                board[m.take[i].y][m.take[i].x] = tk[i];
            if (c)
                move = !move;
        }

    int& operator [] (pos p) {
        return board[p.y][p.x];
    }

    const int& operator [] (pos p) const {
        return board[p.y][p.x];
    }

    friend std::ostream& operator << (std::ostream& os, const Board& s) {
        for (int i = 0; i < 8; i++)
            os << i << ' ';
        os << std::endl << std::endl;
        for(int i = 0; i < 8; i++) {
            for (int j = 0; j < 8; j++)
                os << s[{j, i}] << ' ';
            os << ' ' << i << std::endl;
        }
        return os;
    }
};

bool in(const pos& p, const int& mn, const int& mx) {
    return p.x >= mn && p.x <= mx && p.y >= mn && p.y <= mx;
}

class Shashi {
    private:
        int t[8][8] = {{0, 2, 0, 2, 0, 2, 0, 2},
                       {2, 0, 2, 0, 2, 0, 2, 0},
                       {0, 2, 0, 2, 0, 2, 0, 2},
                       {0, 0, 0, 0, 0, 0, 0, 0},
                       {0, 0, 0, 0, 0, 0, 0, 0},
                       {1, 0, 1, 0, 1, 0, 1, 0},
                       {0, 1, 0, 1, 0, 1, 0, 1},
                       {1, 0, 1, 0, 1, 0, 1, 0}};
        Board board{t, true};

        void take_r(const pos& p, Board& b, std::vector<pos>& del_list, const pos& p_start, std::vector<Move>& take_list, const std::vector<int>& pis) {
            if (b[p] == pis[0])
                for (const pos& i: {pos{1, 1}, pos{1, -1}, pos{-1, 1}, pos{-1, -1}}) {
                    pos ps = p + i;
                    pos ps_t = ps + i;
                    if (in(ps, 1, 6))
                        if (b[ps] == pis[2] || b[ps] == pis[3])
                            if (b[ps_t] == 0) {
                                del_list.push_back(ps);
                                take_list.push_back({p_start, ps_t, del_list});
                                const std::vector<int> pps{b[ps]};
                                const Move temp_move{p, ps_t, {ps}};
                                b.moved(temp_move, false);
                                take_r(ps_t, b, del_list, p_start, take_list, pis);
                                b.unmoved(temp_move, pps, pis[0], false);
                                del_list.pop_back();
                            }
                }
            if (b[p] == pis[1]) {
                for (const pos& i: {pos{1, 1}, pos{1, -1}, pos{-1, 1}, pos{-1, -1}}) {
                    pos ps = p + i;
                    while (in(ps, 1, 6)) {
                        pos ps_t = ps + i;
                        if (b[ps] == pis[0] || b[ps] == pis[1])
                            break;
                        if (b[ps] != 0 && b[ps_t] != 0)
                            break;
                        if (b[ps] != 0) {
                            del_list.push_back(ps);
                            const std::vector<int> pps{b[ps]};
                            const Move temp_move{p, ps_t, {ps}};
                            bool flag_temp = true;
                            b.moved(temp_move, false);
                            while (flag_temp || (in(ps_t, 0, 7) && b[ps_t] == 0)) {
                                if (flag_temp)
                                    flag_temp = false;
                                take_list.push_back({p_start, ps_t, del_list});
                                take_r(ps_t, b, del_list, p_start, take_list, pis);
                                ps_t = ps_t + i;
                            }
                            b.unmoved(temp_move, pps, pis[1], false);
                            del_list.pop_back();
                            break;
                        }
                        ps = ps + i;
                    }
                }
            }
        }

        std::vector<Move> get_l_move(Board& b) {
            std::vector<int> pis;
            if (b.get_move())
                pis = {1, 3, 2, 4};
            else
                pis = {2, 4, 1, 3};
            std::vector<Move> move_list;
            std::vector<pos> temp_vector = {};
            for (int k = 0; k < 2; k++)
                for (int i = k; i < 8; i += 2)
                    for(int j = 1 - k; j < 8; j += 2) {
                        pos temp_pos{j, i};
                        take_r(temp_pos, b, temp_vector, temp_pos, move_list, pis);
                    }
            if (move_list.empty())
                for (int k = 0; k < 2; k++)
                    for (int i = k; i < 8; i += 2)
                        for(int j = 1 - k; j < 8; j += 2) {
                            pos ps = {j, i};
                            if (b[ps] == pis[0])
                                for (const pos& i: (b.get_move() ? (std::initializer_list<pos>{pos{1, -1}, pos{-1, -1}}) : (std::initializer_list<pos>{pos{1, 1}, pos{-1, 1}}))) {
                                    pos ps_t = ps + i;
                                        if (in(ps_t, 0, 7) && b[ps_t] == 0)
                                            move_list.push_back({ps, ps_t, {}});
                                }
                            if (b[ps] == pis[1])
                                for(const pos& i: {pos{1, 1}, pos{1, -1}, pos{-1, 1}, pos{-1, -1}}) {
                                    pos ps_t = ps + i;
                                    while (in(ps_t, 0, 7) && b[ps_t] == 0) {
                                        move_list.push_back({ps, ps_t, {}});
                                        ps_t = ps_t + i;
                                    }
                                }
                        }
            return move_list;
        }

        double eval(const Board& b) {
            std::vector<int> pis = {1, 3, 2, 4};
            double e = 0.0;
            for (int k = 0; k < 2; k++)
                for (int i = k; i < 8; i += 2)
                    for(int j = 1 - k; j < 8; j += 2)
                        if (b[{j, i}] != 0) {
                            if (b[{j, i}] == pis[0])
                                e += 1.0;
                            if (b[{j, i}] == pis[1])
                                e += 8.0;
                            if (b[{j, i}] == pis[2])
                                e -= 1.0;
                            if (b[{j, i}] == pis[3])
                                e -= 8.0;
                        }
            return e;
        }

        double minimax(Board& b, const int& depth, bool maximizing_player, double alpha, double beta, const int& depth_mate) {
            std::vector<Move> legal_moves = get_l_move(b);

            if (depth == 0 || legal_moves.empty() || depth <= depth_mate) {
                if (legal_moves.empty())
                    return (maximizing_player ? -1e6 - depth : +1e6 + depth);
                if (depth <= depth_mate)
                    return 0;
                return (board.get_move() ? eval(b) : -eval(b));
            }

            if (maximizing_player) {
                double max_eval = -std::numeric_limits<double>::infinity();
                for (const Move& move: legal_moves) {
                    std::vector<int> take;
                    for(const pos& i: move.take)
                        take.push_back(b[i]);
                    int tps = b[move.pos0];
                    b.moved(move);
                    double eval = minimax(b, depth - 1, false, alpha, beta, depth_mate);
                    b.unmoved(move, take, tps);
                    if (max_eval < eval)
                        max_eval = eval;
                    if (alpha < eval)
                        alpha = eval;
                    if (beta <= alpha)
                        break;
                }
                return max_eval;
            } else {
                double min_eval = std::numeric_limits<double>::infinity();
                for (const Move& move: legal_moves) {
                    std::vector<int> take;
                    for(const pos& i: move.take)
                        take.push_back(b[i]);
                    int tps = b[move.pos0];
                    b.moved(move);
                    double eval = minimax(b, depth - 1, true, alpha, beta, depth_mate);
                    b.unmoved(move, take, tps);
                    if (min_eval > eval)
                        min_eval = eval;
                    if (beta > eval)
                        beta = eval;
                    if (beta <= alpha)
                        break;
                }
                return min_eval;
            }
        }
    public:
        void set_board(const Board& b) {
            board = b;
        }

        void move(const Move& m) {
            board.moved(m);
        }

        std::vector<Move> get_legal_move() {
            return get_l_move(board);
        }

        std::pair<double, Move> not_multy_stock(int depth = 3, bool out=false) {
            std::vector<Move> legal_moves = get_legal_move();
            double best_score = -std::numeric_limits<double>::infinity();
            int depth_mate = -1;
            Move best_move;

            for (const Move& mv: legal_moves) {
                Board temp_board = board;
                temp_board.moved(mv);
                double score = minimax(temp_board, depth, false, -std::numeric_limits<double>::infinity(), std::numeric_limits<double>::infinity(), depth_mate);
                if (out)
                    if (abs(score) >= 1e6)
                        std::cout << "~ " << (score > 0 ? "#" : "-#") << depth - abs(score) + 1e6 << "\t" << mv.pos0.x << ' ' << mv.pos0.y << "  " << mv.pos1.x << ' ' << mv.pos1.y << std::endl;
                    else
                        std::cout << "~ " << score << "\t" << mv.pos0.x << ' ' << mv.pos0.y << "  " << mv.pos1.x << ' ' << mv.pos1.y << std::endl;
                if (score >= best_score) {
                    best_score = score;
                    best_move = mv;
                }
            }
            return std::make_pair(best_score, best_move);
        }
        void process_moves(const std::vector<Move>& moves, Board& board, const int& depth, int& depth_mate, double& best_score, Move& best_move, const bool& out, const bool& analysis) {
            for (const Move& mv : moves) {
                Board temp_board = board;
                temp_board.moved(mv);
                double score = minimax(temp_board, depth, false, -std::numeric_limits<double>::infinity(), std::numeric_limits<double>::infinity(), depth_mate);
                if (out)
                    if (abs(score) >= 1e6)
                        std::cout << "~ " << (score > 0 ? "#" : "-#") << depth - abs(score) + 1e6 << "\t" << mv.pos0.x << ' ' << mv.pos0.y << "  " << mv.pos1.x << ' ' << mv.pos1.y << std::endl;
                    else
                        std::cout << "~ " << score << "\t" << mv.pos0.x << ' ' << mv.pos0.y << "  " << mv.pos1.x << ' ' << mv.pos1.y << std::endl;
                if (score >= best_score) {
                    best_score = score;
                    best_move = mv;
                    if (!analysis && score > 1e6 && score - 1e6 > depth_mate)
                        depth_mate = score - 1e6;

                }
            }
        }

        std::pair<double, Move> stock(int depth = 3, bool out = false, bool analysis = false) {
            std::vector<Move> legal_moves = get_legal_move();
            double best_score = -std::numeric_limits<double>::infinity();
            int depth_mate = -1;
            Move best_move;

            const int num_threads = std::thread::hardware_concurrency() < legal_moves.size() ? std::thread::hardware_concurrency() : legal_moves.size();
            const size_t chunk_size = legal_moves.size() / num_threads;
            const size_t extra_lines = legal_moves.size() % num_threads;

            std::vector<std::thread> threads;

            size_t start_index = 0;
            for (int i = 0; i < num_threads; i++) {
                size_t extra_lines_for_thread = (i < extra_lines) ? 1 : 0;
                size_t end_index = start_index + chunk_size + extra_lines_for_thread;

                auto process_thread = [&, start_index, end_index]() {
                    std::vector<Move> moves_chunk(legal_moves.begin() + start_index, legal_moves.begin() + end_index);
                    process_moves(moves_chunk, board, depth, depth_mate, best_score, best_move, out, analysis);
                };

                threads.emplace_back(process_thread);

                start_index = end_index;
            }

            for (auto& thread : threads) {
                thread.join();
            }

            return std::make_pair(best_score, best_move);
        }

    friend std::ostream& operator << (std::ostream& os, const Shashi& s) {
        for (int i = 0; i < 8; i++)
            os << i << ' ';
        os << std::endl << std::endl;
        for(int i = 0; i < 8; i++) {
            for (int j = 0; j < 8; j++)
                os << s.board[{j, i}] << ' ';
            os << ' ' << i << std::endl;
        }
        return os;
    }
};

int main() {
    /*
    int t[8][8] = {{0, 0, 0, 0, 0, 0, 0, 0}, // 0
                   {0, 0, 0, 0, 0, 0, 0, 0}, // 1
                   {0, 0, 0, 0, 0, 0, 0, 0}, // 2
                   {0, 0, 0, 0, 0, 0, 0, 0}, // 3
                   {0, 0, 0, 0, 0, 0, 0, 0}, // 4
                   {0, 0, 0, 0, 0, 0, 0, 0}, // 5
                   {0, 0, 0, 0, 0, 0, 0, 0}, // 6
                   {0, 0, 0, 0, 0, 0, 0, 0}};// 7
    */

                 // 0  1  2  3  4  5  6  7
    int t[8][8] = {{0, 2, 0, 0, 0, 0, 0, 0}, // 0
                   {0, 0, 0, 0, 0, 0, 0, 0}, // 1
                   {0, 2, 0, 2, 0, 1, 0, 1}, // 2
                   {2, 0, 2, 0, 0, 0, 0, 0}, // 3
                   {0, 0, 0, 0, 0, 0, 0, 0}, // 4
                   {1, 0, 1, 0, 1, 0, 2, 0}, // 5
                   {0, 1, 0, 0, 0, 0, 0, 0}, // 6
                   {1, 0, 0, 0, 0, 0, 0, 0}};// 7
    Board b(t, true);
    Shashi s;
    s.set_board(b);
    std::vector<Move> lmove = {{}};
    while (!lmove.empty()) {
        std::cout << s;
        std::cout << std::endl;
        int k = 0;
        lmove = s.get_legal_move();
        for (const Move& i: lmove) {
            std::cout << k << '\t' << i.pos0.x << ' ' << i.pos0.y << "  " << i.pos1.x << ' ' << i.pos1.y << "  ";
            k++;
            for (const pos& j: i.take) {
                std::cout << j.x <<  ' ' << j.y << ' ';
            }
            std::cout << std::endl;
        }
        std::cout << std::endl;
        int m = -1;
        //std::cin >> m;
        if (m != -1)
            s.move(lmove[m]);
        std::pair<double, Move> em = s.stock(12, true);
        s.move(em.second);
        break;
    }
}
