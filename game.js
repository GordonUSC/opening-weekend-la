// Opening Weekend LA — Gordon + Quinn — gameplay
// Penalty shootout, bingo, predictions, achievements

// ===== Penalty shootout =====
const penaltyState = {
  scored: 0,
  shots: 0,
  totalShots: 5,
  taking: false
};

function takePenalty(direction) {
  if (penaltyState.taking) return;
  if (penaltyState.shots >= penaltyState.totalShots) return;

  penaltyState.taking = true;
  const ball = document.getElementById('ball');
  const keeper = document.getElementById('keeper');
  const msg = document.getElementById('penaltyMsg');
  const score = document.getElementById('penaltyScore');

  // Where the player aims
  const aim = direction; // 'left', 'center', 'right'
  // Where the keeper dives (random)
  const choices = ['left', 'center', 'right'];
  const dive = choices[Math.floor(Math.random() * 3)];

  // Move ball
  let ballLeft = '50%';
  let ballTop = '20%';
  if (aim === 'left') ballLeft = '24%';
  if (aim === 'right') ballLeft = '76%';
  // Slight chance to miss the goal (1 in 8)
  const missed = Math.random() < 0.12;

  if (missed) {
    ballTop = '8%';
    if (aim === 'left') ballLeft = '8%';
    if (aim === 'right') ballLeft = '92%';
  }

  ball.style.left = ballLeft;
  ball.style.bottom = '60%';
  ball.style.transform = 'translateX(-50%) scale(0.6)';

  // Move keeper
  if (dive === 'left') keeper.style.left = '28%';
  else if (dive === 'right') keeper.style.left = '72%';
  else keeper.style.left = '50%';

  setTimeout(() => {
    penaltyState.shots++;
    const saved = (aim === dive) && !missed;
    const isGoal = !saved && !missed;
    if (isGoal) {
      penaltyState.scored++;
      msg.textContent = randomGoalMsg();
    } else if (saved) {
      msg.textContent = randomSaveMsg();
    } else {
      msg.textContent = "Miss! Wide of the post.";
    }
    score.textContent = `${penaltyState.scored} / ${penaltyState.shots}`;

    // Reset for next shot
    setTimeout(() => {
      ball.style.transition = 'none';
      ball.style.left = '50%';
      ball.style.bottom = '8%';
      ball.style.transform = 'translateX(-50%) scale(1)';
      keeper.style.transition = 'none';
      keeper.style.left = '50%';
      setTimeout(() => {
        ball.style.transition = '';
        keeper.style.transition = '';
        penaltyState.taking = false;
        if (penaltyState.shots >= penaltyState.totalShots) {
          msg.textContent = finalMsg(penaltyState.scored, penaltyState.totalShots);
          unlockBadge('penalty-king');
        }
      }, 50);
    }, 1200);
  }, 700);
}

function resetPenalty() {
  penaltyState.scored = 0;
  penaltyState.shots = 0;
  penaltyState.taking = false;
  document.getElementById('penaltyScore').textContent = '0 / 5';
  document.getElementById('penaltyMsg').textContent = 'Aim left, center, or right.';
  const ball = document.getElementById('ball');
  const keeper = document.getElementById('keeper');
  ball.style.transition = 'none';
  ball.style.left = '50%';
  ball.style.bottom = '8%';
  ball.style.transform = 'translateX(-50%) scale(1)';
  keeper.style.transition = 'none';
  keeper.style.left = '50%';
  setTimeout(() => {
    ball.style.transition = '';
    keeper.style.transition = '';
  }, 50);
}

function randomGoalMsg() {
  const msgs = [
    "GOAAAAL! Top corner.",
    "Back of the net!",
    "Like Pulisic in the box.",
    "Tucked away. Cool.",
    "Net ripples!",
    "Quinn would be proud.",
    "Estadio Azteca roars."
  ];
  return msgs[Math.floor(Math.random() * msgs.length)];
}
function randomSaveMsg() {
  const msgs = [
    "Saved! Keeper guessed right.",
    "Big hands, big save.",
    "Tip away! Corner kick.",
    "Reflex stop.",
    "Wall. Try again."
  ];
  return msgs[Math.floor(Math.random() * msgs.length)];
}
function finalMsg(s, t) {
  if (s === t) return `Perfect ${s}/${t}. You ARE the Golden Boot.`;
  if (s >= 4) return `${s}/${t}. Star player.`;
  if (s >= 3) return `${s}/${t}. Solid penalty taker.`;
  if (s >= 2) return `${s}/${t}. Keep practicing.`;
  return `${s}/${t}. Don't quit your day job.`;
}

// ===== Bingo =====
function toggleBingo(cell) {
  cell.classList.toggle('marked');
  if (cell.classList.contains('marked')) cell.classList.add('pop');
  checkBingo();
}
function checkBingo() {
  const cells = Array.from(document.querySelectorAll('.bingo-cell'));
  if (cells.length === 0) return;
  // 5x5 grid
  const grid = [];
  for (let r = 0; r < 5; r++) grid.push(cells.slice(r * 5, r * 5 + 5));
  // Check rows
  for (const row of grid) {
    if (row.every(c => c.classList.contains('marked'))) {
      unlockBadge('bingo-row');
      return;
    }
  }
  // Check columns
  for (let c = 0; c < 5; c++) {
    if (grid.every(row => row[c].classList.contains('marked'))) {
      unlockBadge('bingo-row');
      return;
    }
  }
  // Diagonals
  if ([0,1,2,3,4].every(i => grid[i][i].classList.contains('marked'))) unlockBadge('bingo-row');
  if ([0,1,2,3,4].every(i => grid[i][4-i].classList.contains('marked'))) unlockBadge('bingo-row');
}

// ===== Predictions =====
function choosePredict(card, option) {
  card.querySelectorAll('.opt').forEach(o => o.classList.remove('chosen'));
  option.classList.add('chosen');
  // count chosen predictions
  const chosen = document.querySelectorAll('.opt.chosen').length;
  if (chosen >= 4) unlockBadge('predict-pro');
}

// ===== Badges =====
function unlockBadge(id) {
  const badge = document.querySelector(`.badge[data-badge="${id}"]`);
  if (badge && !badge.classList.contains('unlocked')) {
    badge.classList.add('unlocked', 'pop');
  }
  saveBadges();
}
function toggleBadge(badge) {
  badge.classList.toggle('unlocked');
  if (badge.classList.contains('unlocked')) badge.classList.add('pop');
  saveBadges();
}
function saveBadges() {
  try {
    const unlocked = Array.from(document.querySelectorAll('.badge.unlocked')).map(b => b.dataset.badge);
    localStorage.setItem('wc-badges', JSON.stringify(unlocked));
  } catch (e) {}
}
function loadBadges() {
  try {
    const unlocked = JSON.parse(localStorage.getItem('wc-badges') || '[]');
    unlocked.forEach(id => {
      const b = document.querySelector(`.badge[data-badge="${id}"]`);
      if (b) b.classList.add('unlocked');
    });
  } catch (e) {}
}

window.addEventListener('DOMContentLoaded', () => {
  loadBadges();
});
