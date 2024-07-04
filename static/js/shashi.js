var socket = io.connect()

function inr(lst, rang) {
  for (let i of lst)
    if (i < rang[0] || i >= rang[1])
      return false
  return true
}

function div(val, by){
  return (val - val % by) / by;
}

function take(x, y, x_start, y_start, a, take_list, del_s) {
  if (a[y][x] == 1)
    for (let k of [[2, 2], [2, -2], [-2, 2], [-2, -2]]) {
      let x1 = x + k[0]
      let y1 = y + k[1]
      if (inr([x1, y1], [0, 8])) {
        if (a[y1][x1] == 0 && [2, 4].includes(a[div(y + y1, 2)][div(x + x1, 2)])) {
          let copy_del_s = del_s.map((a) => {return a.slice()})
          copy_del_s.push([div(x + x1, 2), div(y + y1, 2)])
          take_list.push([[x_start, y_start], [x1, y1], copy_del_s])
          copy_a = a.map((a) => {return a.slice()})
          copy_a[y][x] = 0
          copy_a[div(y + y1, 2)][div(x + x1, 2)] = 0
          copy_a[y1][x1] = y1 == 0 ? 3 : 1;
          take(x1, y1, x_start, y_start, copy_a, take_list, copy_del_s)
        }
      }
    }
  else if (a[y][x] == 3) {
    for (let i = 1; i <= Math.min(7 - x, y); i++) {
      if ([1, 3].includes(a[y - i][x + i]))
        break
      else if ([2, 4].includes(a[y - i][x + i]) && inr([x + i, y - i], [1, 7]) && a[y - i - 1][x + i + 1] != 0)
        break
      else if ([2, 4].includes(a[y - i][x + i]) && inr([x + i, y - i], [1, 7]) && a[y - i - 1][x + i + 1] == 0) {
        let copy_a = a.map((a) => {return a.slice()})
        for (let j = 1; j <= Math.min(7 - (x + i), (y - i)); j++) {
          let x1 = x + i + j
          let y1 = y - i - j
          if (copy_a[y1][x1] != 0)
            break
          let copy_del_s = del_s.map((a) => {return a.slice()})
          copy_del_s.push([x + i, y - i])
          take_list.push([[x_start, y_start], [x1, y1], copy_del_s])
          copy_a[y][x] = 0
          copy_a[y - i][x + i] = 0
          copy_a[y1][x1] = 3
          take(x1, y1, x_start, y_start, copy_a, take_list, copy_del_s)
        }
        break
      }
    }
    for (let i = 1; i <= Math.min(x, 7 - y); i++) {
      if ([1, 3].includes(a[y + i][x - i]))
        break
      else if ([2, 4].includes(a[y + i][x - i]) && inr([x - i, y + i], [1, 7]) && a[y + i + 1][x - i - 1] != 0)
        break
      else if ([2, 4].includes(a[y + i][x - i]) && inr([x - i, y + i], [1, 7]) && a[y + i + 1][x - i - 1] == 0) {
        let copy_a = a.map((a) => {return a.slice()})
        for (let j = 1; j <= Math.min((x - i), 7 - (y + i)) + 1; j++) {
          let x1 = x - i - j
          let y1 = y + i + j
          if (copy_a[y1][x1] != 0)
            break
          let copy_del_s = del_s.map((a) => {return a.slice()})
          copy_del_s.push([x - i, y + i])
          take_list.push([[x_start, y_start], [x1, y1], copy_del_s])
          copy_a[y][x] = 0
          copy_a[y + i][x - i] = 0
          copy_a[y1][x1] = 3
          take(x1, y1, x_start, y_start, copy_a, take_list, copy_del_s)
        }
        break
      }
    }
    for (let i = 1; i <= Math.min(x, y); i++) {
      if ([1, 3].includes(a[y - i][x - i]))
        break
      else if ([2, 4].includes(a[y - i][x - i]) && inr([x - i, y - i], [1, 7]) && a[y - i - 1][x - i - 1] != 0)
        break
      else if ([2, 4].includes(a[y - i][x - i]) && inr([x - i, y - i], [1, 7]) && a[y - i - 1][x - i - 1] == 0) {
        let copy_a = a.map((a) => {return a.slice()})
        for (let j = 1; j <= Math.min((x - i), (y - i)); j++) {
          let x1 = x - i - j
          let y1 = y - i - j
          if (copy_a[y1][x1] != 0)
            break
          let copy_del_s = del_s.map((a) => {return a.slice()})
          copy_del_s.push([x - i, y - i])
          take_list.push([[x_start, y_start], [x1, y1], copy_del_s])
          copy_a[y][x] = 0
          copy_a[y - i][x - i] = 0
          copy_a[y1][x1] = 3
          take(x1, y1, x_start, y_start, copy_a, take_list, copy_del_s)
        }
        break
      }
    }
    for (let i = 1; i <= Math.min(7 - x, 7 - y); i++) {
      if ([1, 3].includes(a[y + i][x + i]))
        break
      else if ([2, 4].includes(a[y + i][x + i]) && inr([x + i, y + i], [1, 7]) && a[y + i + 1][x + i + 1] != 0)
        break
      else if ([2, 4].includes(a[y + i][x + i]) && inr([x + i, y + i], [1, 7]) && a[y + i + 1][x + i + 1] == 0) {
        let copy_a = a.map((a) => {return a.slice()})
        for (let j = 1; j <= Math.min(7 - (x + i), 7 - (y + i)); j++) {
          let x1 = x + i + j
          let y1 = y + i + j
          if (copy_a[y1][x1] != 0)
            break
          let copy_del_s = del_s.map((a) => {return a.slice()})
          copy_del_s.push([x + i, y + i])
          take_list.push([[x_start, y_start], [x1, y1], copy_del_s])
          copy_a[y][x] = 0
          copy_a[y + i][x + i] = 0
          copy_a[y1][x1] = 3
          take(x1, y1, x_start, y_start, copy_a, take_list, copy_del_s)
        }
        break
      }
    }
  }
  return take_list
}

function move(a) {
  let move_list = []
  for (let i = 0; i < 8; i++)
    for (let j = 0; j < 8; j++) {
      if ([1, 3].includes(a[i][j])) {
        let take_list = take(j, i, j, i, a, [], [])
        if (take_list)
          move_list.push(...take_list)
      }
    }
  if (move_list.length == 0)
    for (let i = 0; i < 8; i++)
      for (let j = 0; j < 8; j++) {
        if (a[i][j] == 1)
          for (let k of [[1, -1], [-1, -1]]) {
            let x1 = j + k[0]
            let y1 = i + k[1]
            if (inr([x1, y1], [0, 8]))
              if (a[y1][x1] == 0)
                move_list.push([[j, i], [x1, y1], []])
          }
        else if (a[i][j] == 3) {
          for (let k = 1; k <= Math.min(7 - j, i); k++) {
            if (a[i - k][j + k] == 0)
              move_list.push([[j, i], [j + k, i - k], []])
            else
              break
          }
          for (let k = 1; k <= Math.min(j, 7 - i); k++) {
            if (a[i + k][j - k] == 0)
              move_list.push([[j, i], [j - k, i + k], []])
            else
              break
          }
          for (let k = 1; k <= Math.min(j, i); k++) {
            if (a[i - k][j - k] == 0)
              move_list.push([[j, i], [j - k, i - k], []])
            else
              break
          } 
          for (let k = 1; k <= Math.min(7 - j, 7 - i); k++) {
            if (a[i + k][j + k] == 0)
              move_list.push([[j, i], [j + k, i + k], []])
            else
              break
          }
        }
      }
  return move_list
}

function setBoard(pos0, pos1) {
  for (let i = 0; i < 8; i++)
    for (let j = 0; j < 8; j++) {
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
}

socket.on('cout', (data) => {console.log(data)})

var a = []
var pr = []
var isLegal
var b = [[], []]
var col = []
var pos = start_pos.map((a) => {return a.slice()})
var legal_move = move(pos)

setBoard([[0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0]], pos)

socket.on('move', (data, color) => {
  for (let i of col)
    document.getElementById(i[0]).classList.remove(i[1])
  col = []
  setBoard(pos, data)
  pos = data
  legal_move = move(pos)
  if (legal_move.length == 0)
    socket.emit('game_over')
  if (pr.length > 0) {
    for (let i of pr)
        document.getElementById(i).classList.remove("pr")
  }
  if (pr.length == 2) {
    a = pr
    pr = []
    b = [[], []]
    isLegal = false

    for (let i of legal_move)
      if (String(i[0][0]) + String(i[0][1]) == a[0] && String(i[1][0]) + String(i[1][1]) == a[1]) {
        isLegal = true
        b[1].push(i)
      }

    if (isLegal) {
      for (let i of col)
        document.getElementById(i[0]).classList.remove(i[1])
      col = []
      document.getElementById(a[0]).classList.remove("blur")

      if (b[1].length > 1) {
        let str = 'Есть несколько вариантов попасть в это клетку\n'
        let n = 0
        for (let i of b[1]) {
          str += n + ': ' + i[2].join(' ') + '\n'
          n++
        }
        b[1].push(b[1][prompt(str)])
      }

      let old_pos = pos.map((a) => {return a.slice()})

      let temp = pos[a[0][1]][a[0][0]]
      pos[a[0][1]][a[0][0]] = 0
      pos[a[1][1]][a[1][0]] = a[1][1] == 0 ? 3 : temp
      for (let i of b[1][0][2]) {
        pos[i[1]][i[0]] = 0
      }
      setBoard(old_pos, pos)

      document.getElementById(a[0]).classList.add("mblur")
      document.getElementById(a[1]).classList.add("mblur")
      col = [[a[0], 'mblur'], [a[1], 'mblur']]

      socket.emit('move', pos, [a[0], a[1]])
    }
    else
      a = []
  }
  else {
    for (let i of color) {
      let t = String(7-parseInt(i[0])+String(7-parseInt(i[1])))
      document.getElementById(t).classList.add('mblur')
      col.push([t, 'mblur'])
    }
    a = []
  }
})

document.querySelector('table').onclick = (event) => {
  if (event.target.tagName != 'TD')
    return
  else if (a.length == 0) {
    if (event.target.classList.length > 1)
        if (event.target.classList[1][0] == 'w') {
            a = [event.target.id]
            b = [[], []]

            document.getElementById(a[0]).classList.add("blur")

            for (let i of legal_move)
              if (a[0] == String(i[0][0]) + String(i[0][1])) {
                b[0].push(i)
                document.getElementById(String(i[1][0]) + String(i[1][1])).classList.add('pblur')
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

      let old_pos = pos.map((a) => {return a.slice()})

      let temp = pos[a[0][1]][a[0][0]]
      pos[a[0][1]][a[0][0]] = 0
      pos[a[1][1]][a[1][0]] = a[1][1] == 0 ? 3 : temp
      for (let i of b[1][0][2]) {
        pos[i[1]][i[0]] = 0
      }
      setBoard(old_pos, pos)

      document.getElementById(a[0]).classList.add("mblur")
      document.getElementById(a[1]).classList.add("mblur")
      col = [[a[0], 'mblur'], [a[1], 'mblur']]

      socket.emit('move', pos, [a[0], a[1]])
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
        legal_move = move(pos)

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
  else if (a.length == 2) {
    if (pr.length == 0 && event.target.classList.length > 1 && event.target.classList[1][0] == 'w') {
      pr.push(event.target.id)
      document.getElementById(pr[0]).classList.add("pr")
    }
    else if (pr.length == 1 && event.target.classList[0] == 'black') {
      pr.push(event.target.id)
      document.getElementById(pr[1]).classList.add("pr")
      if (pr[0] == pr[1]) {
        document.getElementById(a[0]).classList.remove("pr")
        for (let i of pr)
          document.getElementById(i).classList.remove('pr')
        pr = []
      }
    }
    else if (pr.length == 2) {
      for (let i of pr)
        document.getElementById(i).classList.remove("pr")
      if (event.target.classList.length > 1 && event.target.classList[1][0] == 'w') {
        pr = [event.target.id]
        document.getElementById(pr[0]).classList.add("pr")
      }
      else
        pr = []
    }
  }
}