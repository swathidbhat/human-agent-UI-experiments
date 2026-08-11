/* Behaviour. Expects data.js to have defined GLYPH, LABEL, TIP, AGENTS and goals. */

var cockpit = document.getElementById('cockpit');
var mapView = document.getElementById('mapView');
var chatView = document.getElementById('chatView');
var edgeLayer = document.getElementById('edgeLayer');
var branchModal = document.getElementById('branchModal');
var proofModal = document.getElementById('proofModal');
var branchName = document.getElementById('branchName');
var selectedKind = 'Investigate';
var activeGoal = 'swish';
var branchSourceTitle = '';
var currentView = 'cockpit';
var lastWorkView = 'cockpit';
var openDecision = 0;
var filter = null;
var selectedKey = null;

/* ---------- small builders ---------- */
function svgIcon(symbol, cls) {
  var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  if (cls) svg.setAttribute('class', cls);
  svg.setAttribute('viewBox', '0 0 16 16');
  var use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttribute('href', '#' + symbol);
  svg.appendChild(use);
  return svg;
}
function glyphSvg(state, big) {
  var svg = svgIcon(GLYPH[state], 'gl' + (big ? ' lg' : ''));
  var t = document.createElementNS('http://www.w3.org/2000/svg', 'title');
  t.textContent = TIP[state];
  svg.insertBefore(t, svg.firstChild);
  return svg;
}
var MOTIF = {
  rosette: '<path d="M1 8Q8 8 8 1M8 1Q8 8 15 8M15 8Q8 8 8 15M8 15Q8 8 1 8"/><circle cx="8" cy="8" r="1.5" fill="#1740a0" stroke="none"/>',
  leaf:    '<path d="M3 13Q8 12 11 8T13 3"/><path d="M4.5 9.5Q8 10 9.5 6.5"/><path d="M7 12Q10.5 12 12 8.5"/>',
  star:    '<path d="M8 1v14M1 8h14"/><path d="M3.4 3.4l9.2 9.2M12.6 3.4l-9.2 9.2"/><circle cx="8" cy="8" r="1.4" fill="#1740a0" stroke="none"/>',
  lattice: '<path d="M8 1L15 8L8 15L1 8Z"/><path d="M8 4.8L11.2 8L8 11.2L4.8 8Z"/>'
};
function avatar(agent, size) {
  // each agent is a tile: identity by motif, cobalt on white, the way a border
  // course tells you which tile you are looking at
  var a = AGENTS[agent] || {};
  var el = svgIcon('t-' + (a.motif || 'rosette'), 'avatar' + (size ? ' ' + size : ''));
  var t = document.createElementNS('http://www.w3.org/2000/svg', 'title');
  t.textContent = agent;
  el.insertBefore(t, el.firstChild);
  return el;
}
function agentButton(agent, size) {
  var b = document.createElement('button');
  b.className = 'agent-link';
  b.appendChild(avatar(agent, size || 'sm'));
  var n = document.createElement('span');
  n.className = 'name';
  n.textContent = agent;
  b.appendChild(n);
  b.addEventListener('click', function (e) { e.stopPropagation(); openAgent(agent); });
  return b;
}
function branchDot(src) {
  var b = document.createElement('button');
  b.className = 'branch-dot';
  b.title = BRANCH_TIP;
  b.setAttribute('aria-label', BRANCH_TIP);
  b.appendChild(svgIcon('g-branch'));
  b.addEventListener('click', function (e) { e.stopPropagation(); openBranch(src); });
  return b;
}
function meter(value, eta, muted) {
  var wrap = document.createElement('div');
  // ongoing work has no percentage to report, so it says so instead
  if (value === null || value === undefined) {
    var running = document.createElement('span');
    running.className = 'ongoing';
    running.textContent = 'ongoing';
    wrap.appendChild(running);
    return wrap;
  }
  var row = document.createElement('div');
  row.className = 'meter';
  var bar = document.createElement('div');
  bar.className = 'bar';
  var fill = document.createElement('i');
  fill.style.width = Math.max(0, Math.min(100, value || 0)) + '%';
  if (muted) fill.style.background = 'var(--done)';
  bar.appendChild(fill);
  var pct = document.createElement('span');
  pct.className = 'pct';
  pct.textContent = (value || 0) + '%';
  row.append(bar, pct);
  wrap.appendChild(row);
  return wrap;
}
function toast(message, undoFn) {
  var wrap = document.getElementById('toasts');
  var t = document.createElement('div');
  t.className = 'toast';
  var m = document.createElement('span');
  m.textContent = message;
  t.appendChild(m);
  if (undoFn) {
    var u = document.createElement('button');
    u.textContent = 'Undo';
    u.addEventListener('click', function () { undoFn(); wrap.removeChild(t); });
    t.appendChild(u);
  }
  wrap.appendChild(t);
  setTimeout(function () { if (t.parentNode) wrap.removeChild(t); }, 5200);
}
function rater(key, goal) {
  var wrap = document.createElement('span');
  wrap.className = 'rate';
  [['up', '▲'], ['down', '▼']].forEach(function (pair) {
    var b = document.createElement('button');
    b.className = pair[0] === 'down' ? 'down' : '';
    b.textContent = pair[1];
    b.title = pair[0] === 'up' ? 'Useful' : 'Not useful';
    if (goal.rated[key] === pair[0]) b.classList.add('on');
    b.addEventListener('click', function () {
      goal.rated[key] = goal.rated[key] === pair[0] ? null : pair[0];
      Array.prototype.forEach.call(wrap.children, function (c, i) {
        c.classList.toggle('on', goal.rated[key] === (i === 0 ? 'up' : 'down'));
      });
      toast(goal.rated[key] === 'up' ? 'Marked useful. The agent will do more of this.'
           : goal.rated[key] === 'down' ? 'Marked not useful. The agent will change approach.'
           : 'Rating cleared.');
    });
    wrap.appendChild(b);
  });
  return wrap;
}
function taskById(goal, id) {
  return goal.tasks.filter(function (t) { return t.id === id; })[0];
}
function allItems(goal) {
  return goal.tasks.concat(goal.branches);
}

/* ---------- decisions ---------- */
function renderDecisions(goal) {
  var zone = document.getElementById('decisionZone');
  zone.innerHTML = '';
  var pending = goal.tasks.filter(function (t) { return t.state === 'you'; });
  if (!pending.length) {
    zone.appendChild(emptyState());
    return;
  }
  if (openDecision >= pending.length) openDecision = 0;
  pending.forEach(function (task, i) {
    zone.appendChild(i === openDecision ? decisionCard(goal, task) : foldedCard(goal, task, i));
  });
}
function emptyState() {
  var wrap = document.createElement('div');
  wrap.className = 'clear';
  var art = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  art.setAttribute('viewBox', '0 0 64 64');
  art.setAttribute('width', '64');
  art.setAttribute('height', '64');
  art.innerHTML =
      '<rect x="1" y="1" width="62" height="62" rx="3" fill="#f2f6fc" stroke="#b07a4a" stroke-width="1.5"/>'
    + '<g fill="none" stroke="#1740a0" stroke-width="2.2">'
    + '<path d="M2 32Q32 32 32 2"/><path d="M32 2Q32 32 62 32"/>'
    + '<path d="M62 32Q32 32 32 62"/><path d="M32 62Q32 32 2 32"/>'
    + '</g>'
    + '<g fill="none" stroke="#5b86d0" stroke-width="1.4">'
    + '<path d="M12 32Q32 32 32 12"/><path d="M32 12Q32 32 52 32"/>'
    + '<path d="M52 32Q32 32 32 52"/><path d="M32 52Q32 32 12 32"/>'
    + '</g>'
    + '<circle cx="32" cy="32" r="3.4" fill="#1740a0"/>'
    + '<circle cx="9" cy="9" r="2" fill="#b07a4a"/><circle cx="55" cy="9" r="2" fill="#b07a4a"/>'
    + '<circle cx="9" cy="55" r="2" fill="#b07a4a"/><circle cx="55" cy="55" r="2" fill="#b07a4a"/>';
  var text = document.createElement('div');
  text.innerHTML = '<b>Nothing needs you right now.</b><p>Three agents are working. You will be asked when a choice would change what they do.</p>';
  wrap.append(art, text);
  return wrap;
}
function foldedCard(goal, task, index) {
  var el = document.createElement('div');
  el.className = 'decision folded';
  var title = document.createElement('span');
  title.className = 'fold-title';
  title.textContent = task.title;
  var since = document.createElement('span');
  since.className = 'since';
  since.textContent = 'waiting ' + task.since;
  var chev = document.createElement('span');
  chev.className = 'chev';
  chev.textContent = '▾';
  el.append(glyphSvg('you'), title, since, chev);
  el.addEventListener('click', function () { openDecision = index; renderDecisions(goal); });
  return el;
}
function decisionCard(goal, task) {
  var card = document.createElement('div');
  card.className = 'decision';
  var top = document.createElement('div');
  top.className = 'top';
  var kicker = document.createElement('span');
  kicker.className = 'kicker';
  kicker.textContent = 'Needs you';
  var since = document.createElement('span');
  since.className = 'since';
  since.textContent = 'waiting ' + task.since;
  top.append(branchDot(task.title), glyphSvg('you', true), kicker, since);

  var h = document.createElement('h3');
  h.textContent = task.title;
  var why = document.createElement('p');
  why.className = 'why';
  why.textContent = task.note + (task.holds ? ' This is holding up “' + task.holds + '”.' : '');
  card.append(top, h, why);

  var options = document.createElement('div');
  options.className = 'options';
  task.options.forEach(function (option) {
    var b = document.createElement('button');
    b.className = 'option';
    // title and mark share one row so both cards line up on the same baseline
    var head = document.createElement('span');
    head.className = 'o-head';
    var lab = document.createElement('b');
    lab.textContent = option.label;
    head.appendChild(lab);
    if (option.recommended) {
      var rec = document.createElement('span');
      rec.className = 'rec';
      rec.textContent = 'Recommended';
      head.appendChild(rec);
    }
    var con = document.createElement('span');
    con.className = 'o-why';
    con.textContent = option.consequence;
    b.append(head, con);
    b.addEventListener('click', function () { resolveDecision(goal, task, option); });
    options.appendChild(b);
  });
  var acts = document.createElement('div');
  acts.className = 'acts';
  var src = task.basis ? taskById(goal, task.basis) : null;
  if (src) {
    var lead = document.createElement('span');
    lead.className = 'basis-of';
    lead.textContent = 'Based on ' + (task.basisLabel || '“' + src.title + '”');
    var b = document.createElement('button');
    b.className = 'quiet-act';
    b.textContent = '→ see';
    b.addEventListener('click', function () {
      if (src.proof) openProof(src.proof); else openAgent(src.agent);
    });
    acts.append(lead, b);
  } else {
    var ask = agentButton(task.agent);
    ask.className = 'quiet-act';
    ask.textContent = '→ see';
    acts.appendChild(ask);
  }
  card.append(options, acts);
  return card;
}
function resolveDecision(goal, task, option) {
  var held = task.holds ? goal.tasks.filter(function (t) { return t.title === task.holds; })[0] : null;
  var snap = { state: task.state, note: task.note, since: task.since, options: task.options, progress: task.progress,
               eta: task.eta, held: held, heldNote: held && held.note, heldSince: held && held.since };
  task.state = 'motion';
  task.stage = 'build';
  task.note = 'Applying your choice: ' + option.label.toLowerCase() + '.';
  task.progress = 6;
  task.since = 'just now';
  task.eta = 'just started';
  delete task.options;
  if (held) { held.note = 'Unblocked, building with your choice.'; held.since = 'just now'; }
  openDecision = 0;
  render(goal);
  toast('Decided: ' + option.label, function () {
    task.state = snap.state; task.stage = 'decide'; task.note = snap.note; task.since = snap.since;
    task.options = snap.options; task.progress = snap.progress; task.eta = snap.eta;
    if (snap.held) { snap.held.note = snap.heldNote; snap.held.since = snap.heldSince; }
    render(goal);
  });
}

/* ---------- table ---------- */
function renderList(goal) {
  var list = document.getElementById('workList');
  list.innerHTML = '';
  if (filter === 'you') return;
  var moving = allItems(goal).filter(function (t) { return t.state === 'motion'; });
  var done = allItems(goal).filter(function (t) { return t.state === 'complete'; });
  if (moving.length && filter !== 'complete') addGroup(list, 'Working', moving, goal);
  if (done.length && filter !== 'motion') addGroup(list, 'Completed', done, goal);
}
function addGroup(list, name, tasks, goal) {
  var head = document.createElement('div');
  head.className = 'group';
  var cell = document.createElement('div');
  cell.className = 'g-label';
  var lab = document.createElement('span');
  lab.className = 'section';
  lab.textContent = name;
  var count = document.createElement('span');
  count.className = 'count';
  count.textContent = tasks.length;
  cell.append(lab, count);
  head.appendChild(cell);
  if (name === 'Working') {
    var add = document.createElement('button');
    add.className = 'icon-add';
    add.style.gridColumn = '4';
    add.style.justifySelf = 'end';
    add.title = 'Add work to this goal';
    add.setAttribute('aria-label', 'Add work to this goal');
    add.appendChild(svgIcon('g-plus'));
    add.addEventListener('click', function () { openBranch(''); });
    head.appendChild(add);
  }
  list.appendChild(head);
  tasks.forEach(function (t) { list.appendChild(taskRow(t, goal)); });
}
function taskRow(task, goal) {
  var row = document.createElement('div');
  row.className = 'row' + (task.state === 'complete' ? ' complete' : '') + (task.isBranch ? ' is-branch' : '');
  var icons = document.createElement('div');
  icons.className = 'icons';
  icons.append(branchDot(task.title), glyphSvg(task.state));
  var body = document.createElement('div');
  body.className = 'body';
  var name = document.createElement('span');
  name.className = 'name';
  name.textContent = task.title;
  var who = document.createElement('span');
  who.className = 'who';
  if (task.agent) who.appendChild(agentButton(task.agent));
  var head = document.createElement('div');
  head.className = 'headline';
  head.appendChild(name);
  var note = document.createElement('span');
  note.className = 'note';
  note.textContent = task.note;
  // the agent mark leads the row so every mark lines up down the page
  body.append(who, head, note);
  if (task.proof) {
    var open = document.createElement('button');
    open.className = 'proof';
    open.textContent = '→ result';
    open.addEventListener('click', function (e) { e.stopPropagation(); openProof(task.proof); });
    head.appendChild(open);
  }
  if (task.state === 'motion') {
    // an agent is doing this, so the move is to watch it, not to tick it off
    var watch = document.createElement('button');
    watch.className = 'tick';
    watch.textContent = '→ see';
    watch.title = 'Watch ' + task.agent + ' work on this';
    watch.addEventListener('click', function () { openAgent(task.agent); });
    head.appendChild(watch);
  }
  var status = document.createElement('div');
  status.className = 'status';
  status.textContent = task.state === 'motion' && task.eta ? task.eta
    : (task.since === 'just now' ? 'just now' : task.since + ' ago');
  row.append(icons, body, meter(task.progress, task.state === 'motion' ? task.eta : null, task.state === 'complete'), status);
  if (task.agent) {
    row.title = 'Open ' + task.agent + ' working on this';
    row.addEventListener('click', function () { openAgent(task.agent, task); });
  }
  return row;
}

/* ---------- counts, badges, greeting ---------- */
function renderMetrics(goal) {
  var items = allItems(goal);
  function n(state) { return items.filter(function (t) { return t.state === state; }).length; }
  document.getElementById('decisionCount').textContent = n('you');
  document.getElementById('workCount').textContent = n('motion');
  document.getElementById('completeCount').textContent = n('complete');
  Array.prototype.forEach.call(document.querySelectorAll('.stat'), function (b) {
    b.classList.toggle('on', filter === b.dataset.filter);
  });
}
function renderSidebar() {
  var list = document.getElementById('goalList');
  list.innerHTML = '';
  Object.keys(goals).forEach(function (key) {
    var goal = goals[key];
    var b = document.createElement('button');
    b.className = 'goal' + (key === activeGoal ? ' active' : '');
    b.dataset.goal = key;
    var t = document.createElement('span');
    t.textContent = goal.title;
    var badge = document.createElement('span');
    badge.className = 'badge';
    var waiting = goal.tasks.filter(function (x) { return x.state === 'you'; }).length;
    badge.textContent = waiting || '';
    b.append(t, badge);
    b.addEventListener('click', function () { switchGoal(key); });
    list.appendChild(b);
  });
  filterSidebar();
}
function filterSidebar() {
  var q = document.getElementById('goalSearch').value.trim().toLowerCase();
  var shown = 0;
  Array.prototype.forEach.call(document.querySelectorAll('.goal'), function (b) {
    var hit = !q || goals[b.dataset.goal].title.toLowerCase().indexOf(q) > -1;
    b.classList.toggle('hidden', !hit);
    if (hit) shown++;
  });
  document.getElementById('sideEmpty').style.display = shown ? 'none' : 'block';
}
document.getElementById('goalSearch').addEventListener('input', filterSidebar);
function renderGreeting() {
  var total = 0, goalsWaiting = 0;
  Object.keys(goals).forEach(function (k) {
    var w = goals[k].tasks.filter(function (t) { return t.state === 'you'; }).length;
    total += w;
    if (w) goalsWaiting++;
  });
  var g = document.getElementById('greeting');
  g.innerHTML = '';
  if (!total) { g.textContent = 'Morning, Swathi. Nothing is waiting on you.'; return; }
  var b = document.createElement('b');
  b.textContent = total + (total === 1 ? ' decision' : ' decisions');
  g.append('Morning, Swathi. ', b, ' across ' + goalsWaiting + (goalsWaiting === 1 ? ' goal' : ' goals') + ' need you.');
}

/* ---------- flow ---------- */
function nodeButton(goal, task) {
  var b = document.createElement('button');
  b.className = 'node' + (task.state === 'you' ? ' you' : '') + (task.key === selectedKey ? ' selected' : '');
  b.dataset.node = task.key;
  var text = document.createElement('div');
  text.style.flex = '1';
  var title = document.createElement('b');
  title.textContent = task.title;
  var meta = document.createElement('span');
  meta.textContent = task.state === 'complete' ? 'completed' : task.agent;
  text.append(title, meta);
  if (task.state !== 'you') text.appendChild(meter(task.progress, null, task.state === 'complete'));
  b.append(glyphSvg(task.state, task.state === 'you'), text);
  b.addEventListener('click', function () { selectNode(task.key); });
  return b;
}
function renderMap(goal) {
  var cols = { learn: document.getElementById('colLearn'), decide: document.getElementById('colDecide'), build: document.getElementById('colBuild') };
  Object.keys(cols).forEach(function (k) { cols[k].innerHTML = ''; });
  allItems(goal).forEach(function (t) {
    t.key = t.id || t.key;
    var col = cols[t.stage] || cols.build;
    col.appendChild(nodeButton(goal, t));
  });
  if (!selectedKey || !allItems(goal).filter(function (t) { return t.key === selectedKey; }).length) {
    var first = allItems(goal).filter(function (t) { return t.state === 'you'; })[0] || allItems(goal)[0];
    selectedKey = first && first.key;
  }
  selectNode(selectedKey);
  drawEdges();
}
/* Connectors are measured from the rendered nodes and only drawn where a real
   dependency exists: a decision to the work it is holding up. */
function drawEdges() {
  if (!mapView.classList.contains('visible')) return;
  var goal = goals[activeGoal];
  var flow = document.querySelector('.flow');
  var box = flow.getBoundingClientRect();
  function at(key) {
    var el = flow.querySelector('.node[data-node="' + key + '"]');
    if (!el) return null;
    var r = el.getBoundingClientRect();
    return { l: r.left - box.left, r: r.right - box.left, y: r.top - box.top + r.height / 2 };
  }
  var pairs = [];
  goal.tasks.forEach(function (t) {
    if (t.holds) {
      var target = goal.tasks.filter(function (x) { return x.title === t.holds; })[0];
      if (target) pairs.push([t.key, target.key, false]);
    }
    // what a decision was built on is as real a link as what it is blocking
    if (t.basis) {
      var src = taskById(goal, t.basis);
      if (src) pairs.push([src.key, t.key, false]);
    }
  });
  goal.branches.forEach(function (b) {
    var from = goal.tasks.filter(function (t) { return t.state === 'you'; })[0] || goal.tasks[0];
    pairs.push([from.key, b.key, true]);
  });
  edgeLayer.innerHTML = '';
  pairs.forEach(function (p) {
    var a = at(p[0]), b = at(p[1]);
    if (!a || !b || a.r > b.l) return;
    var x1 = a.r + 6, x2 = b.l - 6, mid = (x1 + x2) / 2;
    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M' + x1 + ' ' + a.y + ' C' + mid + ' ' + a.y + ' ' + mid + ' ' + b.y + ' ' + x2 + ' ' + b.y);
    if (p[2]) path.setAttribute('class', 'dash');
    edgeLayer.appendChild(path);
  });
}
function aimNotch(key) {
  var panel = document.querySelector('.map-view .panel');
  var node = document.querySelector('.node[data-node="' + key + '"]');
  if (!panel || !node) return;
  var p = panel.getBoundingClientRect(), n = node.getBoundingClientRect();
  var y = n.top - p.top + n.height / 2;
  panel.style.setProperty('--notch-y', Math.max(16, Math.min(p.height - 16, y)) + 'px');
}
window.addEventListener('resize', function () { drawEdges(); if (selectedKey) aimNotch(selectedKey); });

function selectNode(key) {
  var goal = goals[activeGoal];
  var task = allItems(goal).filter(function (t) { return t.key === key; })[0];
  if (!task) return;
  selectedKey = key;
  Array.prototype.forEach.call(document.querySelectorAll('.node'), function (el) {
    el.classList.toggle('selected', el.dataset.node === key);
  });
  var gs = document.getElementById('panelGlyph');
  gs.innerHTML = '';
  gs.appendChild(glyphSvg(task.state));
  document.getElementById('panelWord').textContent = LABEL[task.state];
  document.getElementById('nodeTitle').textContent = task.title;
  aimNotch(key);
  document.getElementById('nodeCopy').textContent = task.note;
  document.getElementById('nodeReason').textContent = task.why || '';
  var m = document.getElementById('panelMeter');
  m.innerHTML = '';
  if (task.state !== 'you') m.appendChild(meter(task.progress, task.eta, task.state === 'complete'));

  // a decision has to be decidable wherever it appears, not just on the overview
  var opts = document.getElementById('panelOptions');
  opts.innerHTML = '';
  opts.className = '';
  if (task.state === 'you' && task.options) {
    opts.className = 'options';
    task.options.forEach(function (option) {
      var b = document.createElement('button');
      b.className = 'option';
      var head = document.createElement('span');
      head.className = 'o-head';
      var lab = document.createElement('b');
      lab.textContent = option.label;
      head.appendChild(lab);
      if (option.recommended) {
        var rec = document.createElement('span');
        rec.className = 'rec';
        rec.textContent = 'Recommended';
        head.appendChild(rec);
      }
      var con = document.createElement('span');
      con.className = 'o-why';
      con.textContent = option.consequence;
      b.append(head, con);
      b.addEventListener('click', function () { resolveDecision(goal, task, option); });
      opts.appendChild(b);
    });
  }

  var dep = document.getElementById('panelDep');
  dep.innerHTML = '';
  if (task.holds) {
    dep.className = 'p-dep';
    var s = document.createElement('span'); s.textContent = 'Holding up';
    var w = document.createElement('b'); w.textContent = task.holds;
    dep.append(s, w);
  } else dep.className = '';

  var latest = document.getElementById('panelLatest');
  latest.innerHTML = '';
  var thread = (goal.threads || {})[task.agent];
  if (thread && thread.length) {
    latest.className = 'p-latest';
    var line = thread[thread.length - 1];
    var who = document.createElement('p');
    who.className = 'who';
    who.append(avatar(task.agent, 'sm'), line[0] + ' · ' + line[1], rater('panel-' + task.agent, goal));
    var said = document.createElement('p');
    said.className = 'said';
    said.textContent = line[2];
    var open = document.createElement('button');
    open.className = 'panel-link';
    open.textContent = '→ see';
    open.addEventListener('click', function () { openAgent(task.agent); });
    latest.append(who, said, open);
  } else latest.className = '';

  var result = document.getElementById('panelResult');
  result.innerHTML = '';
  if (task.proof) {
    result.className = 'p-result';
    var n = document.createElement('span'); n.className = 'name'; n.textContent = task.proof;
    var sub = document.createElement('span'); sub.className = 'sub'; sub.textContent = 'Finished · ready to use';
    var see = document.createElement('button');
    see.className = 'panel-link';
    see.textContent = '→ result';
    see.addEventListener('click', function () { openProof(task.proof); });
    result.append(n, sub, see);
  } else result.className = '';
}

/* ---------- views ---------- */
function setView(view) {
  if (view !== 'chat') lastWorkView = view;
  currentView = view;
  cockpit.style.display = view === 'cockpit' ? 'block' : 'none';
  mapView.classList.toggle('visible', view === 'map');
  chatView.classList.toggle('visible', view === 'chat');
  // in a conversation the goal header is repetition: the breadcrumb already says where you are
  var inChat = view === 'chat';
  document.querySelector('.summary').style.display = inChat ? 'none' : 'flex';
  document.getElementById('goalTitle').style.display = inChat ? 'none' : '';
  Array.prototype.forEach.call(document.querySelectorAll('[data-view]'), function (b) {
    b.classList.toggle('active', b.dataset.view === view);
  });
  var tail = document.getElementById('crumbTail');
  var crumb = document.getElementById('crumbGoal');
  if (view === 'chat') {
    tail.textContent = ' / ' + document.getElementById('chatAgent').textContent;
    crumb.className = 'link';
    crumb.onclick = function () { setView(lastWorkView); };
  } else {
    tail.textContent = '';
    crumb.className = '';
    crumb.onclick = null;
  }
  if (view === 'map') { drawEdges(); if (selectedKey) aimNotch(selectedKey); }
}
Array.prototype.forEach.call(document.querySelectorAll('[data-view]'), function (b) {
  b.addEventListener('click', function () { setView(b.dataset.view); });
});
Array.prototype.forEach.call(document.querySelectorAll('.stat'), function (b) {
  b.addEventListener('click', function () {
    filter = filter === b.dataset.filter ? null : b.dataset.filter;
    if (currentView !== 'cockpit') setView('cockpit');
    render(goals[activeGoal]);
    toast(filter ? 'Showing ' + (filter === 'you' ? 'what needs you' : filter === 'motion' ? 'work in progress' : 'completed work') : 'Showing everything');
  });
});

function render(goal) {
  renderDecisions(goal);
  renderList(goal);
  renderMetrics(goal);
  renderSidebar();
  renderGreeting();
  renderMap(goal);
}
function switchGoal(key) {
  activeGoal = key;
  filter = null;
  openDecision = 0;
  selectedKey = null;
  var goal = goals[key];
  document.getElementById('crumbGoal').textContent = goal.title;
  document.getElementById('goalTitle').textContent = goal.title;
  var roster = document.getElementById('agentRoster');
  roster.innerHTML = '';
  goal.agents.forEach(function (a) { roster.appendChild(agentButton(a)); });
  render(goal);
  if (currentView === 'chat') setView('cockpit');
}

/* ---------- modals ---------- */
function openModal(m) { m.classList.add('open'); }
function closeModal(m) { m.classList.remove('open'); }
function openBranch(src) {
  branchSourceTitle = src || '';
  var s = document.getElementById('branchSource');
  s.textContent = branchSourceTitle ? 'Following up on: ' + branchSourceTitle : '';
  s.style.display = branchSourceTitle ? 'block' : 'none';
  branchName.value = goals[activeGoal].branchDefault;
  openModal(branchModal);
}
Array.prototype.forEach.call(document.querySelectorAll('[data-close]'), function (b) {
  b.addEventListener('click', function () { closeModal(document.getElementById(b.dataset.close)); });
});
[branchModal, proofModal].forEach(function (m) {
  m.addEventListener('click', function (e) { if (e.target === m) closeModal(m); });
});
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') [branchModal, proofModal].forEach(closeModal);
});
document.getElementById('addGoal').addEventListener('click', function () {
  toast('Adding goals is not wired up in this prototype.');
});
document.getElementById('branchFromNode').addEventListener('click', function () {
  openBranch(document.getElementById('nodeTitle').textContent);
});
Array.prototype.forEach.call(document.querySelectorAll('#branchKinds .choice'), function (c) {
  c.addEventListener('click', function () {
    selectedKind = c.dataset.kind;
    Array.prototype.forEach.call(document.querySelectorAll('#branchKinds .choice'), function (i) {
      i.classList.toggle('selected', i === c);
    });
  });
});
document.getElementById('createBranch').addEventListener('click', function () {
  var goal = goals[activeGoal];
  var name = branchName.value.trim() || 'New work';
  var key = 'b' + (goal.branches.length + 1);
  goal.branches.push({ id: key, key: key, state: 'motion', stage: 'build', title: name, isBranch: true,
    note: 'Working on this follow-up.', agent: goal.agents[0], progress: 5, since: 'just now', eta: 'just started',
    why: 'It carries over everything worked out so far and stays visible on the goal.' });
  closeModal(branchModal);
  selectedKey = key;
  render(goal);
  setView('map');
  toast('Added: ' + name);
});

/* ---------- proof, with tabs ---------- */
var proofName = null;
function openProof(name) {
  proofName = name;
  document.getElementById('proofTitle').textContent = name;
  Array.prototype.forEach.call(document.querySelectorAll('#proofTabs button'), function (b, i) {
    b.classList.toggle('on', i === 0);
  });
  showTab('result');
  openModal(proofModal);
}
function showTab(tab) {
  var goal = goals[activeGoal];
  var art = (goal.artifacts || {})[proofName];
  var body = document.getElementById('proofBody');
  body.innerHTML = '';
  if (!art) { body.textContent = 'Nothing recorded.'; return; }
  if (tab === 'sources') {
    var ul = document.createElement('ul');
    art.sources.forEach(function (s) {
      var li = document.createElement('li');
      li.textContent = s;
      ul.appendChild(li);
    });
    body.appendChild(ul);
  } else {
    body.textContent = art[tab];
  }
  if (tab !== 'sources') body.appendChild(rater('proof-' + proofName + '-' + tab, goal));
}
Array.prototype.forEach.call(document.querySelectorAll('#proofTabs button'), function (b) {
  b.addEventListener('click', function () {
    Array.prototype.forEach.call(document.querySelectorAll('#proofTabs button'), function (x) { x.classList.remove('on'); });
    b.classList.add('on');
    showTab(b.dataset.tab);
  });
});

/* ---------- chat ---------- */
function chatLine(who, when, said, self, goal, idx) {
  var row = document.createElement('div');
  row.className = 'msg' + (self ? ' self' : '');
  var av = avatar(self ? 'You' : who);
  if (self) { av.innerHTML = ''; av.className = 'avatar self-mark'; av.textContent = 'You'; }
  var block = document.createElement('div');
  var text = document.createElement('div');
  text.className = 'said' + (self ? ' bubble' : '');
  text.textContent = said;
  var foot = document.createElement('div');
  foot.className = 'foot';
  foot.textContent = self ? when : who + ' · ' + when;
  if (!self && goal) foot.appendChild(rater('chat-' + who + '-' + idx, goal));
  block.append(text, foot);
  row.append(av, block);
  return row;
}
function openAgent(agent, task) {
  var goal = goals[activeGoal];
  var thread = (goal.threads || {})[agent] || [[agent, 'now', 'Working inside this goal.']];
  var mine = goal.tasks.filter(function (t) { return t.agent === agent && t.state !== 'complete'; })
    .map(function (t) { return t.title; });
  document.getElementById('chatAgent').textContent = agent;
  var av = document.getElementById('chatAvatar');
  av.innerHTML = '';
  av.appendChild(avatar(agent, 'lg'));
  document.getElementById('chatContext').textContent = task
    ? 'On ' + task.title.charAt(0).toLowerCase() + task.title.slice(1)
    : (mine.length ? 'On ' + goal.title.toLowerCase() + ' · ' + mine.join(' · ')
                   : 'On ' + goal.title.toLowerCase());
  var box = document.getElementById('chatThread');
  box.innerHTML = '';
  thread.forEach(function (l, i) { box.appendChild(chatLine(l[0], l[1], l[2], false, goal, i)); });
  document.getElementById('chatInput').value = '';
  setView('chat');
}
function sendChat() {
  var input = document.getElementById('chatInput');
  var msg = input.value.trim();
  if (!msg) return;
  var box = document.getElementById('chatThread');
  var agent = document.getElementById('chatAgent').textContent;
  box.appendChild(chatLine('You', 'now', msg, true));
  input.value = '';
  toast('Sent to ' + agent);
  setTimeout(function () {
    box.appendChild(chatLine(agent, 'now', 'Got it. I will fold that in and update the task on your overview.', false, goals[activeGoal], 99));
  }, 500);
}
document.getElementById('chatSend').addEventListener('click', sendChat);
document.getElementById('chatInput').addEventListener('keydown', function (e) { if (e.key === 'Enter') sendChat(); });

switchGoal('swish');
