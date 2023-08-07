const fs = require('fs');
const path = require('path');

const debug = true;
const input = fs.readFileSync(path.resolve(__dirname, "./input.txt"), 'utf-8');

const lines = input.split('\r\n');
const moves = lines.pop();
lines.pop();
const num_cols = Math.max(...lines.map((line) => {
  return line.length;
}));
const map = lines.map((line) => {
  const row = line.split('');
  for(let i = row.length; i < num_cols; i++) {
    row.push(' ');
  }
  return row;
});
const num_rows = map.length;
const edge_size = num_rows / 3;
let x = map[0].findIndex((v) => {
  return v === '.';
});
let y = 0;
let dir = '>';
for(let i = 0; i < moves.length; i++) {
  switch(moves[i]) {
    case 'L':
      if(debug) console.log('turning left');
      switch(dir) {
        case '^':
          dir = '<';
          break;
        case 'v':
          dir = '>';
          break;
        case '<':
          dir = 'v';
          break;
        case '>':
          dir = '^';
          break;
      }
      break;
    case 'R':
      if(debug) console.log('turning right');
      switch(dir) {
        case '^':
          dir = '>';
          break;
        case 'v':
          dir = '<';
          break;
        case '<':
          dir = '^';
          break;
        case '>':
          dir = 'v';
          break;
      }
      break;
    default:
      let j;
      for(j = i; j < moves.length; j++) {
        if(moves[j] === 'L' || moves[j] === 'R') break;
      }
      const n = parseInt(moves.substring(i, j));
      if(debug) console.log(`moving ${dir} ${n}`);
      i = j - 1;
      let dx = 0, dy = 0;
      switch(dir) {
        case '^':
          dy = -1;
          break;
        case 'v':
          dy = 1;
          break;
        case '<':
          dx = -1;
          break;
        case '>':
          dx = +1;
          break;
      }
      for(j = 0; j < n; j++) {
        let nx = x + dx;
        let ny = y + dy;
        let ndir = dir;
        if(nx < 0 || nx >= num_cols || ny < 0 || ny >= num_rows || map[ny][nx] === ' ') {
          if(debug) console.log(nx, num_cols, ny, num_rows);
          if(dir === '^') {
            if(y === 0) {
              ndir = 'v';
              dx = 0;
              dy = -1;
              ny = edge_size;
              nx = (3 * edge_size) - x;
              if(debug) console.log('a0', x, y, nx, ny, dir, ndir);
            } else if(y === edge_size) {
              if(x < edge_size) {
                ndir = 'v';
                dx = 0;
                dy = -1;
                ny = 0;
                nx = (3 * edge_size) - x;
                if(debug) console.log('a', x, y, nx, ny, dir, ndir);
              } else if(x < 2 * edge_size) {
                ndir = '>';
                dx = 1;
                dy = 0;
                ny = x - edge_size;
                nx = 2 * edge_size;
                if(debug) console.log('b', x, y, nx, ny, dir, ndir);
              }
            } else if(y === 2 * edge_size) {
              ndir = '<';
              dx = -1;
              dy = 0;
              ny = nx - edge_size;
              nx = (2 * edge_size) - 1;
              if(debug) console.log('c', x, y, nx, ny, dir, ndir);
            }
          } else if(dir === 'v') {
            if(y === (2 * edge_size) - 1) {
              if(x < edge_size) {
                ndir = '^';
                dx = 0;
                dy = 1;
                ny = (3 * edge_size) - 1;
                nx = (3 * edge_size) - x;
                if(debug) console.log('d', x, y, nx, ny, dir, ndir);
              } else {
                ndir = '>';
                dx = 1;
                dy = 0;
                ny = (2 * edge_size) + nx;
                nx = 2 * edge_size;
                if(debug) console.log('e', x, y, nx, ny, dir, ndir);
              }
            } else if(y === (3 * edge_size) - 1) {
              if(x < 3 * edge_size) {
                ndir = '^';
                dx = 0;
                dy = -1;
                nx = (3 * edge_size) - x - 1;
                ny = (2 * edge_size) - 1;
                if(debug) console.log('f0', x, y, nx, ny, dir, ndir);
              } else {
                ndir = '>';
                dx = 1;
                dy = 0;
                ny = edge_size + (x - (3 * edge_size));
                nx = 0;
                if(debug) console.log('f', x, y, nx, ny, dir, ndir);
              }
            }
          } else if (dir === '<') {
            if(x === 0) {
              ndir = '^';
              dx = 0;
              dy = 1;
              nx = (3 * edge_size) + ((2 * edge_size) - y);
              ny = (3 * edge_size) -1;
              if(debug) console.log('g', x, y, nx, ny, dir, ndir);
            } else if(x === 2 * edge_size) {
              if(y < edge_size) {
                ndir = 'v';
                dx = 0;
                dy = -1;
                nx = edge_size + y;
                ny = edge_size;
                if(debug) console.log('h', x, y, nx, ny, dir, ndir);
              } else {
                ndir = '^';
                dx = 0;
                dy = -1;
                nx = (3 * edge_size) - y;
                ny = (2 * edge_size) - 1;
                if(debug) console.log('i', x, y, nx, ny, dir, ndir);
              }
            }
          } else if (dir === '>') {
            if(x === (3 * edge_size) - 1) {
              if(y < edge_size) {
                ndir = '<';
                dx = -1;
                dy = 0;
                nx = (3 * edge_size) - 1;
                ny = (3 * edge_size) - y;
                if(debug) console.log('j', x, y, nx, ny, dir, ndir);
              } else {
                ndir = 'v';
                dx = 0;
                dy = 1;
                nx = ((3 * edge_size) - 1) + ((2 * edge_size) - y);
                ny = 2 * edge_size;
                if(debug) console.log('k', x, y, nx, ny, dir, ndir);
              }
            } else {
              ndir = '<';
              dx = -1;
              dy = 0;
              nx = (3 * edge_size) - 1;
              ny = (4 * edge_size) - y;
              if(debug) console.log('l', x, y, nx, ny, dir, ndir);
            }
          }
        }
        map[y][x] = dir;
        if(debug) console.log('moving to', ny, nx, map[ny][nx]);
        if(map[ny][nx] === '#') {
          break;
        }
        x = nx;
        y = ny;
        dir = ndir;
      }
      if(debug) {
        map.forEach((row) => {
          console.log(row.join(''));
        });
        console.log('');
      }
  }
}
const dir_score = {
  '^': 3,
  'v': 1,
  '<': 2,
  '>': 0,
}[dir];
if(debug) console.log(y, x, dir);
const code = ((y + 1) * 1000) + ((x + 1) * 4) + dir_score;
console.log(code);