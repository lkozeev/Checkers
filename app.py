from flask import Flask, render_template, request, url_for
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.debug = True
app.config['SECRET_KEY'] = 'not_secret_key'
socketio = SocketIO(app)

users = []
ipl = {}
whait = []
online_play = []

st_pos = [[0, 2, 0, 2, 0, 2, 0, 2],
          [2, 0, 2, 0, 2, 0, 2, 0],
          [0, 2, 0, 2, 0, 2, 0, 2],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [1, 0, 1, 0, 1, 0, 1, 0],
          [0, 1, 0, 1, 0, 1, 0, 1],
          [1, 0, 1, 0, 1, 0, 1, 0]]

pos = {}


def rev(a):
    b = []
    for i in reversed(a):
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
        b.append(temp)
    return b


def ix(ip: int) -> (int, int):
    for i in range(len(users)):
        for j in range(len(users[i])):
            if ip == users[i][j]:
                return i, j
    for i in range(len(whait)):
        if ip == whait[i]:
            return i, -1
    return -1, -1

@app.route('/')
def index():
    return render_template('index_.html')

@app.route('/2')
def index1():
    return render_template('index1.html')

@app.route('/1')
def index0():
    n, k = ix(request.remote_addr)
    if n > -1:
        if k > -1:
            return render_template('index.html', start_pos=pos[n] if k == 0 else rev(pos[n]))
        else:
            return render_template('index.html', start_pos=st_pos)
    else:
        if whait:
            return render_template('index.html', start_pos=rev(st_pos))
        else:
            return render_template('index.html', start_pos=st_pos)


@socketio.on('connect', namespace='/1')
def connect():
    if request.remote_addr in ipl:
        ipl[request.remote_addr].append(request.sid)
    else:
        ipl[request.remote_addr] = [request.sid]
    n, k = ix(request.remote_addr)
    if n < 0:
        if whait:
            users.append([whait.pop(), request.remote_addr])
            pos[len(users) - 1] = [i.copy() for i in st_pos]
        else:
            whait.append(request.remote_addr)


@socketio.on('disconnect', namespace='/1')
def disconnect():
    ipl[request.remote_addr].remove(request.sid)
    if not ipl[request.remote_addr]:
        ipl.pop(request.remote_addr)
        n, k = ix(request.remote_addr)
        if n > -1:
            if k > -1:
                users[n].pop(k)
                pos.pop(n)
                if whait:
                    users.append([whait.pop(), request.remote_addr])
                    pos[len(users) - 1] = [i.copy() for i in st_pos]
                else:
                    whait.append(*users.pop(n))
            else:
                whait.remove(request.remote_addr)


@socketio.on('users')
def get_users():
    emit('cout', [users, whait, ipl, pos])


@socketio.on('reboot')
def reboop():
    global pos
    n, k = ix(request.remote_addr)
    if n > -1 and k > -1:
        pos[n] = [i.copy() for i in st_pos]
        send_to = []
        for i in users[n]:
            for j in ipl[i]:
                send_to.append(j)
        emit('move', (st_pos, []), to=send_to)


@socketio.on('game_over')
def game_over():
    n, k = ix(request.remote_addr)
    if n > -1 and k > -1:
        send_to = []
        for i in users[n]:
            for j in ipl[i]:
                send_to.append(j)
        emit('move', (st_pos, []), to=send_to)


@socketio.on('move')
def move(data, color):
    global pos
    n, k = ix(request.remote_addr)
    if n > -1 and k > -1:
        rev_data = rev(data)
        pos[n] = data if k == 0 else rev_data
        send_to = []
        for i in users[n]:
            if i != request.remote_addr:
                for j in ipl[i]:
                    send_to.append(j)
        emit('move', (rev_data, color), to=send_to)


if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, allow_unsafe_werkzeug=True)
