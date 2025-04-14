let startTime = 0;
let timerInterval;
let elapsed = 0;
let isRunning = false;

function timeToSeconds(timeStr) {
  const [minutes, seconds] = timeStr.split(':').map(Number);
  return minutes * 60 + seconds + (seconds % 1);  // 確保處理小數部分
}

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  const milliseconds = String(ms % 1000).padStart(3, '0');
  return `${minutes}:${seconds}.${milliseconds}`;
}

function startTimer(displayCallback) {
  if (isRunning) return;
  isRunning = true;
  startTime = Date.now() - elapsed;

  timerInterval = setInterval(() => {
    elapsed = Date.now() - startTime;
    displayCallback(formatTime(elapsed));
  }, 10); // 每 10 毫秒更新一次
}

function pauseTimer() {
  if (!isRunning) return;
  isRunning = false;
  clearInterval(timerInterval);
}

function resetTimer(displayCallback) {
  pauseTimer();
  elapsed = 0;
  displayCallback(formatTime(0));
}

function updateDisplay(str) {
  const timerEl = document.getElementById("timer"); // 移進來這裡
  if (timerEl) {
    timerEl.textContent = str;
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let arr = [];
let blank = [0,0];
let k;
let l;

function scramble(n, m) {
  arr = [];
  let numbers = [];
  let idx = 0;

  for (let i = 1; i < n * m; i++) {
    numbers.push(i);
  }

  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]]; // 交換
  }

  idx = 0;
  for (let i = 0; i < n; i++) {
    arr[i] = [];
    for (let j = 0; j < m; j++) {
      if (i == n - 1 && j == m - 1) {
        arr[i][j] = -1;
      } else {
        arr[i][j] = numbers[idx];
        idx++;
      }
    }
  }
  blank = [n-1,m-1];
}

function loadPage(page) {
  let n = document.getElementById("ln").value;
  let m = document.getElementById("wd").value;
  k = m;
  l = n;
  if(n > 17 || m > 17 || n < 3 || m < 3){
    document.getElementById('wrong').innerHTML = 'Please Enter Range Between 3~17';
  } else {
    scramble(n, m);

    let input = '<div id="try"><p id="timer"></p><div id="gamePage" style="grid-template-columns: repeat(' + m + ', 1fr);">';

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < m; j++) {
        let value = arr[i][j];
        let isEmpty = value === -1;
        let className = isEmpty ? "empty" : "";
        let displayText = isEmpty ? "" : value;
        if(arr[i][j] == k*i+j+1){
          className+='gold';
        }
        input += `<button class="${className}" id="m${i}m${j}" onclick="move(${i},${j})">${displayText}</button>`;
      }
    }

    input += "</div></div>";
    document.getElementById('content').innerHTML = input;
  }
  resetTimer(updateDisplay); 
  startTimer(updateDisplay);
}

function move(x, y) {
  if((blank[0] == x || blank[1] == y) && !(blank[0] == x && blank[1] == y)){
    let n = blank[0];
    let m = blank[1];
    
    blank = [x, y];
    document.getElementById(`m${x}m${y}`).classList.add("empty");
    document.getElementById(`m${n}m${m}`).classList.remove("empty");
    let lt = [];
    if(n == x) { //橫
      if(m < y) { //左
        for(let i = m + 1 ; i <= y ; i++){
          lt.push(arr[x][i]);
        }
        for(let i = m ; i < y ; i++){
          arr[x][i] = lt[i - m];
          document.getElementById(`m${x}m${i}`).innerText = lt[i - m];
          if(arr[x][i] == k * x + i + 1){
            document.getElementById(`m${x}m${i}`).classList.add("gold");
          } else {
            document.getElementById(`m${x}m${i}`).classList.remove("gold");
          }
        }
      } else if(m > y) { //右
        for(let i = y ; i <= m - 1 ; i++){
          lt.push(arr[x][i]);
        }
        for(let i = y + 1 ; i <= m ; i++){
          arr[x][i] = lt[i - y - 1];
          document.getElementById(`m${x}m${i}`).innerText = lt[i - y - 1];
          if(arr[x][i] == k * x + i + 1){
            document.getElementById(`m${x}m${i}`).classList.add("gold");
          } else {
            document.getElementById(`m${x}m${i}`).classList.remove("gold");
          }
        }
      }
    } else if(m == y) { //直
      if (n < x) { // 向下移
        for (let i = n + 1; i <= x; i++) {
          lt.push(arr[i][y]);
        }
        for (let i = n; i < x; i++) {
          arr[i][y] = lt[i - n];
          document.getElementById(`m${i}m${y}`).innerText = lt[i - n];
          if(arr[i][y] == k * i + y + 1){
            document.getElementById(`m${i}m${y}`).classList.add("gold");
          } else {
            document.getElementById(`m${i}m${y}`).classList.remove("gold");
          }
        }
      } else if (n > x) { // 向上移
        for (let i = x; i <= n - 1; i++) {
          lt.push(arr[i][y]);
        }
        for (let i = x + 1; i <= n; i++) {
          arr[i][y] = lt[i - x - 1];
          document.getElementById(`m${i}m${y}`).innerText = lt[i - x - 1];
          if(arr[i][y] == k * i + y + 1){
            document.getElementById(`m${i}m${y}`).classList.add("gold");
          } else {
            document.getElementById(`m${i}m${y}`).classList.remove("gold");
          }
        }
      }
    } 
    lt = [];
    arr[x][y] = -1;
    document.getElementById(`m${x}m${y}`).innerText = "";
    document.getElementById(`m${x}m${y}`).classList.remove("gold");
    document.getElementById(`m${x}m${y}`).classList.add("empty");
  }
  check();
}

function burstConfetti() {
  const duration = 2 * 1000;
  const animationEnd = Date.now() + duration;

  (function frame() {
    // 左右兩側各噴灑一次
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
    });

    if (Date.now() < animationEnd) {
      requestAnimationFrame(frame);
    }
  })();
}

function check() {
  let n = l;
  let m = k;
  let win = true;
  let idx = 0;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      idx++;
      if (i === n - 1 && j === m - 1) {
        if (arr[i][j] !== -1) {
          win = false;
          break;
        }
      } else {
        if (arr[i][j] !== idx) {
          win = false;
          break;
        }
      }
    }
  }

  if (win) {
    pauseTimer();
    const finalTime = document.getElementById("timer").textContent; // 儲存計時器時間
    burstConfetti(); // 彩帶來了！
    setTimeout(() => {
      document.body.innerHTML = `
        <div id="winScreen" style="
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          font-family: 'Arial', sans-serif;
          text-align: center;
        ">
          <h1 style="font-size: 3em; color: #e69b00;">🎉 Congratulation 🎉</h1>
          <p id="timer">${finalTime}</p>
          <button onclick="location.reload()" style="
            margin-top: 20px;
            padding: 10px 20px;
            font-size: 1.2em;
            border: none;
            border-radius: 10px;
            background-color: rgb(115, 115, 239);
            cursor: pointer;
            transition: transform 0.2s;
          " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
            Play Again
          </button>
        </div>
      `;
    }, 2500);
  }
}

console.log("Best score feature removed.");
