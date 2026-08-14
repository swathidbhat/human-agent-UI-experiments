/* Builds the social card from the same data the prototype uses, so the two
   cannot tell different stories. One goal, one decision, nothing else.

   The card is live: answering a decision commits it, the counts move, and the
   next question takes its place. That is what the walkthrough records. */
(function () {
  var stage = document.getElementById('stage');

  // the first goal with a decision waiting, so renaming goals never breaks this
  var keys = Object.keys(goals);
  var key = keys.filter(function (k) {
    return goals[k].tasks.some(function (t) { return t.state === 'you' && t.options; });
  })[0] || keys[0];
  var goal = goals[key];

  function pending() {
    return goal.tasks.filter(function (t) { return t.state === 'you' && t.options; })[0];
  }
  function count(state) {
    return goal.tasks.filter(function (t) { return t.state === state; }).length;
  }
  function waiting() {
    var n = 0, g = 0;
    keys.forEach(function (k) {
      var c = goals[k].tasks.filter(function (t) { return t.state === 'you'; }).length;
      if (c) { n += c; g += 1; }
    });
    return [n, g];
  }
  function icon(id) {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 16 16');
    var use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttribute('href', '#' + id);
    svg.appendChild(use);
    return svg;
  }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function decide(task, option) {
    task.state = 'motion';
    task.note = 'Applying your choice: ' + option.label.toLowerCase() + '.';
    task.progress = 0;
    task.eta = 'just started';
    delete task.options;
    goal.tasks.splice(goal.tasks.indexOf(task), 1);
    goal.tasks.unshift(task);
    render();
  }

  function render() {
    stage.innerHTML = '';
    var task = pending();

    var w = waiting();
    var greet = el('p', 's-greet');
    greet.append('Morning, Swathi. ',
      el('b', null, w[0] + (w[0] === 1 ? ' decision' : ' decisions')),
      ' across ' + w[1] + (w[1] === 1 ? ' goal' : ' goals') + ' need you.');
    if (!w[0]) { greet.textContent = 'Morning, Swathi. Nothing is waiting on you.'; }
    stage.append(greet, el('h1', 's-title', goal.title));

    var stats = el('div', 's-stats');
    [['you', count('you'), 'needs you'], ['live', count('motion'), 'working'], ['done', count('complete'), 'done']]
      .forEach(function (s) {
        var p = el('span', 's-stat ' + s[0]);
        p.append(el('b', null, String(s[1])), el('span', null, s[2]));
        stats.appendChild(p);
      });
    var team = el('div', 's-team');
    goal.agents.forEach(function (name) {
      var a = el('span', 's-agent');
      a.append(icon('t-' + (AGENTS[name].motif || 'rosette')), name);
      team.appendChild(a);
    });
    stage.append(stats, team);

    if (task) {
      var card = el('div', 'decision s-card');
      var top = el('div', 's-top');
      top.append(icon('g-you'), el('span', 's-kicker', 'Needs you'), el('span', 's-since', 'waiting ' + task.since));
      var why = el('p', 's-why', task.note + (task.holds ? ' This is holding up “' + task.holds + '”.' : ''));
      var options = el('div', 's-options');
      task.options.forEach(function (option) {
        var o = el('button', 's-option');
        var head = el('span', 's-ohead');
        head.appendChild(el('b', null, option.label));
        if (option.recommended) head.appendChild(el('span', 's-rec', 'Recommended'));
        o.append(head, el('span', 's-owhy', option.consequence));
        o.addEventListener('click', function () { decide(task, option); });
        options.appendChild(o);
      });
      card.append(top, el('h2', null, task.title), why, options);
      stage.appendChild(card);
    }

    var working = goal.tasks.filter(function (t) { return t.state === 'motion'; }).slice(0, task ? 2 : 4);
    if (working.length) {
      var wrap = el('div', 's-work');
      var sect = el('p', 's-sect');
      sect.append(el('b', null, 'Working'), el('i', null, String(count('motion'))));
      wrap.appendChild(sect);
      working.forEach(function (t) {
        var row = el('div', 's-row');
        var text = el('span');
        text.append(el('span', 's-name', t.title), el('span', 's-note', t.note));
        var meter = el('div', 's-meter');
        if (t.progress == null) {
          meter.className = 's-meter s-ongoing';
          meter.textContent = t.eta || 'ongoing';
        } else {
          var bar = el('div', 's-bar');
          var fill = el('i');
          fill.style.width = t.progress + '%';
          bar.appendChild(fill);
          meter.append(bar, el('span', 's-pct', t.progress + '%'));
        }
        row.append(icon('t-' + (AGENTS[t.agent].motif || 'rosette')), text, meter);
        wrap.appendChild(row);
      });
      stage.appendChild(wrap);
    }

    var foot = el('div', 's-foot');
    foot.append(el('span', 's-mark', 'Swathi’s workspace'), el('span', 's-handle', 'github: @swathidbhat'));
    stage.appendChild(foot);
  }

  // ?decided=N pre-answers the first N decisions, so a walkthrough can be
  // captured one frame at a time without driving clicks
  var pre = parseInt((location.search.match(/decided=(\d+)/) || [])[1], 10) || 0;
  while (pre-- > 0) {
    var t = pending();
    if (!t) break;
    decide(t, t.options.filter(function (o) { return o.recommended; })[0] || t.options[0]);
  }
  render();
})();
