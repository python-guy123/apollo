// Clock
function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    document.getElementById('clock').innerText = `${hours}:${minutes} ${ampm}`;
}
setInterval(updateClock, 1000);
updateClock();

// Start menu
const startBtn = document.getElementById('start-btn');
const startMenu = document.getElementById('start-menu');

startBtn.onclick = function(e) {
    e.stopPropagation();
    if (startMenu.style.display === "none" || startMenu.style.display === "") {
        startMenu.style.display = "block";
    } else {
        startMenu.style.display = "none";
    }
};

document.onclick = function(event) {
    if (!startMenu.contains(event.target)) {
        startMenu.style.display = "none";
    }
};

// Power Management
function powerOff() {
    document.getElementById('start-menu').style.display = 'none';
    const screen = document.getElementById('shutdown-screen');
    screen.style.display = 'flex';
    // Allow display: flex to apply before transitioning opacity
    setTimeout(() => { screen.style.opacity = 1; }, 50);
}

function powerOn() {
    const screen = document.getElementById('shutdown-screen');
    screen.style.opacity = 0;
    // Wait for fade out to complete before hiding
    setTimeout(() => { screen.style.display = 'none'; }, 1000);
}

// Window management
function closeWindow(windowId) {
    const win = document.getElementById(windowId);
    if (win) {
        win.style.display = 'none';
    }
}

function openWindow(windowId) {
    const win = document.getElementById(windowId);
    if (win) {
        win.style.display = 'flex';
        // Bring to front
        win.style.zIndex = getHighestZIndex() + 1;
    }
}

function toggleMaximize(windowId) {
    const win = document.getElementById(windowId);
    if (!win) return;
    
    if (!win.dataset.maximized) {
        // Save old state
        win.dataset.oldTop = win.style.top || '';
        win.dataset.oldLeft = win.style.left || '';
        win.dataset.oldWidth = win.style.width || '';
        win.dataset.oldHeight = win.style.height || '';
        win.dataset.oldTransform = win.style.transform || '';
        
        // Maximize
        win.style.top = '35px'; // Below top bar
        win.style.left = '0';
        win.style.width = '100vw';
        win.style.height = 'calc(100vh - 35px)';
        win.style.transform = 'none';
        win.dataset.maximized = 'true';
        win.style.zIndex = getHighestZIndex() + 1;
    } else {
        // Restore
        win.style.top = win.dataset.oldTop;
        win.style.left = win.dataset.oldLeft;
        win.style.width = win.dataset.oldWidth;
        win.style.height = win.dataset.oldHeight;
        win.style.transform = win.dataset.oldTransform;
        delete win.dataset.maximized;
    }
}

// Auto-attach toggleMaximize to all max buttons
setTimeout(() => {
    document.querySelectorAll('.window').forEach(win => {
        const maxBtn = win.querySelector('.win-btn.max');
        if (maxBtn) {
            maxBtn.onclick = () => toggleMaximize(win.id);
        }
    });
}, 100);

// Draggable Window Logic (Classic Vanilla JS)
makeDraggable(document.getElementById("welcome-card"));
makeDraggable(document.getElementById("terminal-window"));
makeDraggable(document.getElementById("notes-window"));
makeDraggable(document.getElementById("icon-welcome"));
makeDraggable(document.getElementById("icon-terminal"));
makeDraggable(document.getElementById("icon-notes"));
makeDraggable(document.getElementById("icon-browser"));
makeDraggable(document.getElementById("icon-paint"));
makeDraggable(document.getElementById("icon-pong"));
makeDraggable(document.getElementById("browser-window"));
makeDraggable(document.getElementById("paint-window"));
makeDraggable(document.getElementById("pong-window"));
makeDraggable(document.getElementById("icon-settings"));
makeDraggable(document.getElementById("settings-window"));

function makeDraggable(elmnt) {
    if (!elmnt) return;
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    // use the header to drag
    var header = document.getElementById(elmnt.id + "-header");
    if (header) {
        header.onmousedown = dragMouseDown;
    } else {
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        // Don't drag if clicking a button
        if (e.target.tagName.toLowerCase() === 'button') return;
        
        e.preventDefault();
        // Bring to front on click
        elmnt.style.zIndex = getHighestZIndex() + 1;
        // get the mouse cursor position at startup
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        // Remove transform if it was centered previously via css
        elmnt.style.transform = "none";
    }

    function closeDragElement() {
        // stop moving when mouse button is released
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// Helper to keep clicked windows on top
let currentZIndex = 10;
function getHighestZIndex() {
    return currentZIndex++;
}

// Bring to front on click anywhere on the window
document.getElementById("welcome-card").addEventListener("mousedown", function() {
    this.style.zIndex = getHighestZIndex() + 1;
});

document.getElementById("terminal-window").addEventListener("mousedown", function() {
    this.style.zIndex = getHighestZIndex() + 1;
});

document.getElementById("notes-window").addEventListener("mousedown", function() {
    this.style.zIndex = getHighestZIndex() + 1;
});

document.getElementById("browser-window").addEventListener("mousedown", function() {
    this.style.zIndex = getHighestZIndex() + 1;
});

document.getElementById("paint-window").addEventListener("mousedown", function() {
    this.style.zIndex = getHighestZIndex() + 1;
});

document.getElementById("pong-window").addEventListener("mousedown", function() {
    this.style.zIndex = getHighestZIndex() + 1;
});

// Terminal Logic
const terminalInput = document.getElementById('terminal-input');
const terminalOutput = document.getElementById('terminal-output');

if (terminalInput && terminalOutput) {
    terminalInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const cmd = this.value.trim();
            this.value = '';
            
            // Append what user typed
            const line = document.createElement('div');
            line.innerHTML = `<span class="prompt">user@apollo:~$</span> <span class="command-input">${cmd}</span>`;
            terminalOutput.appendChild(line);
            
            // Process command
            const command = cmd.toLowerCase().trim();
            if (command === 'secret') {
                const response = document.createElement('div');
                response.className = 'terminal-output-line';
                response.innerHTML = `
<div class="ascii-art">
   _____                .__  .__           
  /  _  \\ ______   ____ |  | |  |   ____   
 /  /_\\  \\\\____ \\ /  _ \\|  | |  |  /  _ \\  
/    |    \\  |_> >  <_> )  |_|  |_(  <_> ) 
\\____|__  /   __/ \\____/|____/____/\\____/  
        \\/|__|                             
</div>
<br>
<div class="secret-message">
>> SECURE CONNECTION ESTABLISHED. <<
Congratulations, Initiate. You have found the gateway.
Welcome to the Apollo Inner Circle. The truth is out there, and now, so are you.
Awaiting further directives...
</div><br>`;
                terminalOutput.appendChild(response);
            } else if (command === 'apollo') {
                const response = document.createElement('div');
                response.className = 'terminal-output-line';
                response.innerHTML = `
<div class="ascii-art" style="font-family: 'JetBrains Mono', monospace; font-weight: bold; line-height: 1.1;">
<span style="color: #45a29e;">               \`.-://////:-.\`               </span>
<span style="color: #45a29e;">           \`:/oooooooooooooooo/:\`           </span>
<span style="color: #45a29e;">        \`:+oooooooooooooooooooooo+:\`        </span>
<span style="color: #50b8b3;">      -+ooooooooooooo<span style="color: #1f2833;">/:--:++</span>oooooooo+-      </span>
<span style="color: #50b8b3;">    .+oooooooooooo<span style="color: #1f2833;">/\`</span>   <span style="color: #66fcf1; text-shadow: 0 0 8px #66fcf1;">/\\</span>   <span style="color: #1f2833;">\`-+</span>ooooooo+.    </span>
<span style="color: #5bccd8;">   :oooooooooooo<span style="color: #1f2833;">/\`</span>    <span style="color: #66fcf1; text-shadow: 0 0 8px #66fcf1;">/  \\</span>    <span style="color: #1f2833;">\`-+</span>ooooooo:   </span>
<span style="color: #5bccd8;">  /oooooooooooo<span style="color: #1f2833;">/\`</span>    <span style="color: #66fcf1; text-shadow: 0 0 8px #66fcf1;">/____\\</span>    <span style="color: #1f2833;">\`-+</span>ooooooo/  </span>
<span style="color: #66fcf1;"> +oooooooooooo<span style="color: #1f2833;">/\`</span>    <span style="color: #66fcf1; text-shadow: 0 0 8px #66fcf1;">/      \\</span>    <span style="color: #1f2833;">\`-+</span>ooooooo+ </span>
<span style="color: #66fcf1;"> oooooooooooo<span style="color: #1f2833;">/\`</span>    <span style="color: #66fcf1; text-shadow: 0 0 8px #66fcf1;">/        \\</span>   <span style="color: #1f2833;">\`-+</span>ooooooo </span>
<span style="color: #66fcf1;"> oooooooooooo<span style="color: #1f2833;">/\`</span>   <span style="color: #66fcf1; text-shadow: 0 0 8px #66fcf1;">/__________\\</span>  <span style="color: #1f2833;">\`-+</span>ooooooo </span>
<span style="color: #66fcf1;"> +oooooooooooo<span style="color: #1f2833;">/\`</span>                <span style="color: #1f2833;">\`-+</span>ooooooo+ </span>
<span style="color: #5bccd8;">  /oooooooooooo<span style="color: #1f2833;">/\`</span>              <span style="color: #1f2833;">\`-+</span>ooooooo/  </span>
<span style="color: #5bccd8;">   :oooooooooooo<span style="color: #1f2833;">/\`</span>            <span style="color: #1f2833;">\`-+</span>ooooooo:   </span>
<span style="color: #50b8b3;">    .+oooooooooooo<span style="color: #1f2833;">/\`</span>        <span style="color: #1f2833;">\`-+</span>ooooooo+.    </span>
<span style="color: #50b8b3;">      -+oooooooooooo<span style="color: #1f2833;">/----:/+</span>oooooooo+-      </span>
<span style="color: #45a29e;">        \`:+oooooooooooooooooooooo+:\`        </span>
<span style="color: #45a29e;">           \`:/oooooooooooooooo/:\`           </span>
<span style="color: #45a29e;">               \`.-://////:-.\`               </span>

<span style="color: #fff; font-size: 1.2em; letter-spacing: 5px; text-shadow: 0 0 5px #fff;">A P O L L O   O S</span>
</div><br>`;
                terminalOutput.appendChild(response);
            } else if (command === 'ls') {
                const response = document.createElement('div');
                response.className = 'terminal-output-line';
                response.style.color = '#fff';
                // Using non-breaking spaces for alignment
                response.innerHTML = 'main.html&nbsp;&nbsp;&nbsp;script.js&nbsp;&nbsp;&nbsp;style.css&nbsp;&nbsp;&nbsp;image.png&nbsp;&nbsp;&nbsp;terminal.png';
                terminalOutput.appendChild(response);
            } else if (command === 'ubuntu') {
                const response = document.createElement('div');
                response.className = 'terminal-output-line';
                response.innerHTML = `
<div class="ascii-art" style="color: #e95420; text-shadow: 0 0 5px #e95420;">
            .-/+oossssoo+/-.
        \`:+ssssssssssssssssss+:\`
      -+ssssssssssssssssssyyssss+-
    .ossssssssssssssssssdMMMNysssso.
   /ssssssssssshdmmNNmmyNMMMMhssssss/
  +ssssssssshmydMMMMMMMNddddyssssssss+
 /sssssssshNMMMyhhyyyyhmNMMMNhssssssss/
.ssssssssdMMMNhsssssssssshNMMMdssssssss.
+sssshhhyNMMNyssssssssssssyNMMMysssssss+
ossyNMMMNyMMhsssssssssssssshmmmhssssssso
ossyNMMMNyMMhsssssssssssssshmmmhssssssso
+sssshhhyNMMNyssssssssssssyNMMMysssssss+
.ssssssssdMMMNhsssssssssshNMMMdssssssss.
 /sssssssshNMMMyhhyyyyhdNMMMNhssssssss/
  +sssssssssdmydMMMMMMMMddddyssssssss+
   /ssssssssssshdmNNNNmyNMMMMhssssss/
    .ossssssssssssssssssdMMMNysssso.
      -+sssssssssssssssssyyyssss+-
        \`:+ssssssssssssssssss+:\`
            .-/+oossssoo+/-.
</div><br>`;
                terminalOutput.appendChild(response);
            } else if (command === 'arch') {
                const response = document.createElement('div');
                response.className = 'terminal-output-line';
                response.innerHTML = `
<div class="ascii-art" style="color: #1793d1; text-shadow: 0 0 5px #1793d1;">
                   -\`
                  .o+\`
                 \`ooo/
                \`+oooo:
               \`+oooooo:
               -+oooooo+:
             \`/:-:++oooo+:
            \`/++++/+++++++:
           \`/++++++++++++++:
          \`/+++ooooooooooooo/\`
         ./ooosssso++osssssso+\`
        .oossssso-\`\`\`\`/ossssss+\`
       -osssssso.      :ssssssso.
      :osssssss/        osssso+++.
     /ossssssss/        +ssssooo/-
   \`/ossssso+/:-        -:/+osssso+-
  \`+sso+:-\`                 \`.-/+oso:
 \`++:.                           \`-/+/
 .\`                                 \`/
</div><br>`;
                terminalOutput.appendChild(response);
            } else if (command === 'now') {
                const response = document.createElement('div');
                response.className = 'terminal-output-line';
                response.style.color = '#fff';
                const d = new Date();
                response.innerText = d.toString();
                terminalOutput.appendChild(response);
            } else if (command !== '') {
                const response = document.createElement('div');
                response.className = 'terminal-output-line';
                response.innerText = `Command not recognized: ${command}`;
                terminalOutput.appendChild(response);
            }
            
            // Scroll to bottom
            const terminalContent = document.querySelector('.terminal-content');
            terminalContent.scrollTop = terminalContent.scrollHeight;
        }
    });

    // Always focus terminal input when clicking inside the terminal
    document.querySelector('.terminal-content').addEventListener('click', function() {
        terminalInput.focus();
    });
}

// Notes Pro Max Logic
let notesData = [
    { title: "Things to try", content: "Things to try in the Terminal:\n\n1. ls - Lists all the files in the system.\n2. ubuntu - Displays the Ubuntu Linux logo.\n3. arch - Displays the Arch Linux logo.\n4. now - Shows the current date and time." },
    { title: "Secret Club Password", content: "It's a secret to everyone." },
    { title: "Groceries", content: "1. Milk\n2. Eggs\n3. Bread\n4. Hacking juice" },
    { title: "My HTML Journey", content: "Day 1: I learned what a <div> is.\nDay 2: I built an entire OS." }
];
let activeNoteIndex = 0;

function renderNotesList() {
    const list = document.getElementById('notes-list');
    if (!list) return;
    list.innerHTML = '';
    notesData.forEach((note, index) => {
        const li = document.createElement('li');
        li.innerText = note.title || 'Untitled Note';
        if (index === activeNoteIndex) {
            li.className = 'active-note';
        }
        li.onclick = () => selectNote(index);
        list.appendChild(li);
    });
}

function selectNote(index) {
    activeNoteIndex = index;
    renderNotesList();
    const editor = document.getElementById('notes-editor');
    if (editor && notesData[index]) {
        editor.value = notesData[index].content;
    }
}

function saveCurrentNote() {
    const editor = document.getElementById('notes-editor');
    if (editor && notesData[activeNoteIndex]) {
        notesData[activeNoteIndex].content = editor.value;
        // Auto-update title based on first line
        const firstLine = editor.value.split('\\n')[0].trim();
        notesData[activeNoteIndex].title = firstLine ? firstLine.substring(0, 25) : "New Note";
        renderNotesList();
    }
}

function newNote() {
    notesData.push({ title: "New Note", content: "" });
    selectNote(notesData.length - 1);
    document.getElementById('notes-editor').focus();
}

function deleteNote() {
    if (notesData.length > 1) {
        notesData.splice(activeNoteIndex, 1);
        selectNote(Math.max(0, activeNoteIndex - 1));
    } else {
        notesData = [{ title: "New Note", content: "" }];
        selectNote(0);
    }
}

// Initialize Notes
renderNotesList();
selectNote(0);

// Browser Logic
function navigateBrowser() {
    let url = document.getElementById('browser-url').value;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
        document.getElementById('browser-url').value = url;
    }
    document.getElementById('browser-frame').src = url;
}

// Paint Logic (Apple Level)
const paintCanvas = document.getElementById('paint-canvas');
const paintCtx = paintCanvas.getContext('2d');
let painting = false;
let paintColor = '#000';
let paintSize = 5;

// Fill canvas with white/frosted background initially
paintCtx.fillStyle = '#f5f5f7';
paintCtx.fillRect(0, 0, paintCanvas.width, paintCanvas.height);

function startPosition(e) {
    painting = true;
    drawPaint(e);
}
function endPosition() {
    painting = false;
    paintCtx.beginPath();
}
function drawPaint(e) {
    if (!painting) return;
    const rect = paintCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    paintCtx.lineWidth = paintSize;
    paintCtx.lineCap = 'round';
    paintCtx.strokeStyle = paintColor;

    paintCtx.lineTo(x, y);
    paintCtx.stroke();
    paintCtx.beginPath();
    paintCtx.moveTo(x, y);
}

paintCanvas.addEventListener('mousedown', startPosition);
paintCanvas.addEventListener('mouseup', endPosition);
paintCanvas.addEventListener('mousemove', drawPaint);
paintCanvas.addEventListener('mouseout', endPosition);

function setPaintColor(color) { paintColor = color; }
function setPaintSize(size) { paintSize = size; }
function clearCanvas() {
    paintCtx.fillStyle = '#f5f5f7';
    paintCtx.fillRect(0, 0, paintCanvas.width, paintCanvas.height);
}

// Pong Logic
const pongCanvas = document.getElementById('pong-canvas');
const pCtx = pongCanvas.getContext('2d');

let p1Y = 160, p2Y = 160;
const paddleHeight = 80, paddleWidth = 10;
let ballX = 300, ballY = 200, ballSpeedX = 4, ballSpeedY = 4;
const ballSize = 8;
let p1Score = 0, p2Score = 0;

function resetBall() {
    ballX = 300;
    ballY = 200;
    ballSpeedX = -ballSpeedX;
    ballSpeedY = 4 * (Math.random() > 0.5 ? 1 : -1);
}

function updatePong() {
    // Only run if window is open to save CPU
    if(document.getElementById('pong-window').style.display === 'none') return;

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // AI logic
    const aiCenter = p2Y + paddleHeight/2;
    if (aiCenter < ballY - 10) p2Y += 4;
    else if (aiCenter > ballY + 10) p2Y -= 4;

    p2Y = Math.max(0, Math.min(400 - paddleHeight, p2Y));

    // Bounds
    if (ballY <= 0 || ballY >= 400) ballSpeedY = -ballSpeedY;

    // Paddle hit
    if (ballX <= paddleWidth && ballY > p1Y && ballY < p1Y + paddleHeight) {
        ballSpeedX = -ballSpeedX;
        let deltaY = ballY - (p1Y + paddleHeight/2);
        ballSpeedY = deltaY * 0.15;
    }
    if (ballX >= 600 - paddleWidth && ballY > p2Y && ballY < p2Y + paddleHeight) {
        ballSpeedX = -ballSpeedX;
        let deltaY = ballY - (p2Y + paddleHeight/2);
        ballSpeedY = deltaY * 0.15;
    }

    // Score
    if (ballX < 0) { p2Score++; document.getElementById('pong-score').innerText = `${p1Score} - ${p2Score}`; resetBall(); }
    if (ballX > 600) { p1Score++; document.getElementById('pong-score').innerText = `${p1Score} - ${p2Score}`; resetBall(); }
}

function drawPong() {
    if(document.getElementById('pong-window').style.display === 'none') return;
    
    pCtx.fillStyle = '#000';
    pCtx.fillRect(0, 0, 600, 400);

    pCtx.fillStyle = 'rgba(255,255,255,0.2)';
    for(let i=0; i<400; i+=40) { pCtx.fillRect(299, i+10, 2, 20); }

    pCtx.fillStyle = '#fff';
    pCtx.fillRect(0, p1Y, paddleWidth, paddleHeight);
    pCtx.fillRect(600 - paddleWidth, p2Y, paddleWidth, paddleHeight);

    pCtx.fillRect(ballX - ballSize/2, ballY - ballSize/2, ballSize, ballSize);
}

function gameLoop() {
    updatePong();
    drawPong();
    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

pongCanvas.addEventListener('mousemove', function(e) {
    const rect = pongCanvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    p1Y = mouseY - paddleHeight/2;
    p1Y = Math.max(0, Math.min(400 - paddleHeight, p1Y));
});

// Settings Logic
function applyPackage(pkg) {
    if (pkg === 'apollo') {
        setTheme('#66fcf1', '#45a29e', '#0b0c10');
        setWallpaper('grid');
    } else if (pkg === 'macos') {
        setTheme('#007aff', '#34c759', '#e5e5ea', true);
        setWallpaper('macos');
    } else if (pkg === 'cyberpunk') {
        setTheme('#ff00ff', '#00ffff', '#110011');
        setWallpaper('space');
    } else if (pkg === 'hacker') {
        setTheme('#00ff00', '#00cc00', '#000000');
        setWallpaper('matrix');
    }
}

function setWallpaper(type) {
    const body = document.body;
    if (type === 'grid') {
        body.style.backgroundImage = 'linear-gradient(rgba(102, 252, 241, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(102, 252, 241, 0.1) 1px, transparent 1px)';
        body.style.backgroundSize = '30px 30px';
    } else if (type === 'macos') {
        body.style.backgroundImage = "url('https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/GoldenGateBridge-001.jpg/1920px-GoldenGateBridge-001.jpg')";
        body.style.backgroundSize = 'cover';
    } else if (type === 'matrix') {
        body.style.backgroundImage = "url('https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')";
        body.style.backgroundSize = 'cover';
    } else if (type === 'space') {
        body.style.backgroundImage = "url('https://images.unsplash.com/photo-1462331940025-496dfbfc7564?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')";
        body.style.backgroundSize = 'cover';
    }
}

function setTheme(primary, secondary, bg, isLight = false) {
    const root = document.documentElement;
    root.style.setProperty('--neon-blue', primary);
    root.style.setProperty('--neon-green', secondary);
    root.style.setProperty('--bg-color', bg);
    
    if (isLight) {
        root.style.setProperty('--text-primary', '#1d1d1f');
        root.style.setProperty('--text-secondary', '#555555');
        root.style.setProperty('--panel-bg', 'rgba(255, 255, 255, 0.85)');
    } else {
        root.style.setProperty('--text-primary', '#ffffff');
        root.style.setProperty('--text-secondary', '#c5c6c7');
        root.style.setProperty('--panel-bg', 'rgba(31, 40, 51, 0.85)');
    }
}

// On boot, ensure welcome card is in front of desktop icons
const welcomeCard = document.getElementById("welcome-card");
if (welcomeCard) {
    welcomeCard.style.zIndex = getHighestZIndex() + 1;
}
