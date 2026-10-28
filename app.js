const STORAGE_KEY = 'projectlink_state_v1';

const defaultUsers = [
  { id: 'req-1', username: 'Abhiram', email: 'abhiram@example.com', password: 'demo123', role: 'Requester' },
  { id: 'hel-1', username: 'Meera', email: 'meera@example.com', password: 'help123', role: 'Helper' }
];

const defaultProjects = [
  {
    id: 1,
    title: 'Campus event management portal',
    category: 'Web Development',
    budget: '₹2,500',
    level: 'Medium',
    difficulty: 'Medium',
    skills: ['HTML', 'CSS', 'JavaScript'],
    ownerName: 'Priya N.',
    ownerEmail: 'priya@college.edu',
    createdBy: 'abhiram@example.com',
    offers: 4,
    deadline: 'Sep 28',
    description: 'Build a clean portal for students to discover, register for and manage college events.'
  },
  {
    id: 2,
    title: 'Student attendance predictor',
    category: 'Machine Learning',
    budget: '₹3,500',
    level: 'Advanced',
    difficulty: 'Advanced',
    skills: ['Python', 'Pandas', 'ML'],
    ownerName: 'Rohit K.',
    ownerEmail: 'rohit@college.edu',
    createdBy: 'rohit@college.edu',
    offers: 7,
    deadline: 'Oct 04',
    description: 'Train a simple model that identifies attendance-risk patterns using sample data.'
  },
  {
    id: 3,
    title: 'Library book finder mobile UI',
    category: 'UI/UX Design',
    budget: '₹1,800',
    level: 'Easy',
    difficulty: 'Easy',
    skills: ['Figma', 'UI Design'],
    ownerName: 'Neha R.',
    ownerEmail: 'neha@college.edu',
    createdBy: 'neha@college.edu',
    offers: 3,
    deadline: 'Sep 25',
    description: 'Design friendly mobile screens for a digital library search experience.'
  },
  {
    id: 4,
    title: 'Expense tracker dashboard',
    category: 'Web Development',
    budget: '₹2,200',
    level: 'Medium',
    difficulty: 'Medium',
    skills: ['JavaScript', 'Charts', 'CSS'],
    ownerName: 'Kunal S.',
    ownerEmail: 'kunal@college.edu',
    createdBy: 'kunal@college.edu',
    offers: 5,
    deadline: 'Oct 01',
    description: 'Create a responsive dashboard to track spending categories and monthly budgets.'
  }
];

const defaultWorkspace = {
  title: 'Campus event management portal',
  tasks: [
    ['Wireframe key screens', true],
    ['Build registration page', true],
    ['Create event listing', false],
    ['Connect backend APIs', false]
  ],
  messages: [
    ['Sivapriya', 'I have completed the event listing layout.'],
    ['You', 'Looks great! Please add filters for event type.'],
    ['Sivapriya', 'On it — I’ll share the updated file today.']
  ]
};

const defaultFreelanceOffers = [
  { id: 'offer-1', title: 'Campus event management portal', client: 'Priya N.', category: 'Web Development', price: 2500, delivery: '5 days', rating: '4.8', description: 'Build a responsive event portal with registration, event listings, and category filters.', skills: ['HTML', 'CSS', 'JavaScript'] },
  { id: 'offer-2', title: 'Student attendance predictor', client: 'Rohit K.', category: 'Machine Learning', price: 3500, delivery: '8 days', rating: '4.9', description: 'Create a small attendance-risk model and a clear results summary for students.', skills: ['Python', 'Pandas', 'Machine Learning'] },
  { id: 'offer-3', title: 'Library book finder mobile UI', client: 'Neha R.', category: 'UI/UX Design', price: 1800, delivery: '4 days', rating: '4.7', description: 'Design a polished mobile search experience for a college library.', skills: ['Figma', 'UI Design'] }
];

const defaultFreelancePayments = [
  { id: 'payment-1', project: 'Portfolio landing page', milestone: 'Final delivery', amount: 4800, status: 'Available', date: 'Oct 22' },
  { id: 'payment-2', project: 'Student club identity kit', milestone: 'Design review', amount: 1600, status: 'In progress', date: 'Oct 26' }
];

function buildInitialState() {
  return {
    users: JSON.parse(JSON.stringify(defaultUsers)),
    projects: JSON.parse(JSON.stringify(defaultProjects)),
    currentUser: null,
    currentProjectId: 1,
    workspace: JSON.parse(JSON.stringify(defaultWorkspace)),
    freelanceOffers: JSON.parse(JSON.stringify(defaultFreelanceOffers)),
    selectedFreelanceOfferId: null,
    freelancePayments: JSON.parse(JSON.stringify(defaultFreelancePayments))
  };
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    return saved ? { ...buildInitialState(), ...saved } : buildInitialState();
  } catch (error) {
    return buildInitialState();
  }
}

const state = loadState();
const app = document.querySelector('#app');

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function toast(message) {
  const toastNode = document.createElement('div');
  toastNode.className = 'toast';
  toastNode.textContent = message;
  document.body.appendChild(toastNode);
  setTimeout(() => toastNode.remove(), 2600);
}

function getCurrentUser() {
  return state.currentUser;
}

function go(page) {
  location.hash = page;
  render();
}

function logout() {
  state.currentUser = null;
  saveState();
  go('home');
}

function nav() {
  const user = getCurrentUser();
  const isFreelancer = user?.role === 'Freelancer';
  return `
    <header class="topbar">
      <button type="button" class="brand" onclick="go('home')">Project<span>Link</span></button>
      <nav class="nav">
        <a href="#" onclick="go('${isFreelancer ? 'freelanceOffers' : 'browse'}')">${isFreelancer ? 'Project offers' : 'Browse projects'}</a>
        <a href="#" onclick="${user ? `go('${isFreelancer ? 'freelance' : 'dashboard'}')` : "go('login')"}">${user ? (isFreelancer ? 'Freelance' : 'Dashboard') : 'Sign in'}</a>
        ${user ? `<div class="user-pill">${escapeHtml(user.username)}</div>` : '<button type="button" class="btn" onclick="go(\'register\')">Get started</button>'}
      </nav>
    </header>
  `;
}

function projectCard(project) {
  return `
    <article class="card project-card">
      <div class="card-head">
        <span class="tag ${project.level === 'Easy' ? 'mint' : project.level === 'Advanced' ? 'gold' : ''}">${project.level}</span>
        <span class="muted">${project.offers} offers</span>
      </div>
      <h3>${escapeHtml(project.title)}</h3>
      <p>${escapeHtml(project.description)}</p>
      <div>${project.skills.map((skill) => `<span class="tag">${escapeHtml(skill)}</span>`).join(' ')}</div>
      <div class="meta"><span>◷ ${escapeHtml(project.deadline)}</span><span>◉ ${escapeHtml(project.budget)}</span></div>
      <button type="button" class="btn secondary" onclick="openProject(${project.id})">View project</button>
    </article>
  `;
}

function home() {
  const user = getCurrentUser();
  return `
    ${nav()}
    <main class="hero">
      <section class="hero-copy">
        <span class="eyebrow">Student collaboration, made simpler</span>
        <h1>Find the right teammate. <em>Build something great.</em></h1>
        <p class="lead">ProjectLink brings students together to turn ideas, assignments and side projects into work they are proud to submit.</p>
        <div class="hero-actions">
          <button type="button" class="btn" onclick="${user ? "go('dashboard')" : "go('register')"}">${user ? 'Open dashboard' : 'Get started free →'}</button>
          <button type="button" class="btn secondary" onclick="go('browse')">Explore projects</button>
        </div>
        <div class="stats">
          <div><b>1,200+</b><small>student builders</small></div>
          <div><b>380+</b><small>projects completed</small></div>
          <div><b>4.8/5</b><small>average rating</small></div>
        </div>
      </section>
    </main>
  `;
}

function auth(register = false) {
  return `
    ${nav()}
    <main class="auth-shell">
      <section class="auth-card">
        <h1>${register ? 'Create your account' : 'Welcome back'}</h1>
        <p class="sub">${register ? 'Create an account to manage projects or work as a freelancer.' : 'Sign in with your email and password.'}</p>

        <form class="auth-form" onsubmit="event.preventDefault(); handleAuthSubmit(${register});">
          ${register ? '<div class="field"><label>Username</label><input id="username" type="text" placeholder="Your username" required></div>' : ''}
          <div class="field"><label>Email</label><input id="email" type="email" placeholder="you@college.edu" required></div>
          <div class="field"><label>Password</label><input id="password" type="password" placeholder="Enter your password" required></div>
          <label class="freelancer-choice"><input id="freelancer-choice" type="checkbox"><span><b>I want a freelancer account</b><small>Open the freelance workspace, choose project offers, and track payments.</small></span></label>

          <button class="btn" type="submit" style="width:100%;margin-top:12px">${register ? 'Create account' : 'Sign in'} →</button>
        </form>

        <p class="sub center">
          ${register ? 'Already have an account?' : 'Need a new account?'}
          <button type="button" class="btn ghost" onclick="go('${register ? 'login' : 'register'}')">${register ? 'Sign in' : 'Create an account'}</button>
        </p>
      </section>
    </main>
  `;
}

function handleAuthSubmit(isRegister) {
  const usernameValue = document.getElementById('username')?.value.trim() || '';
  const emailValue = (document.getElementById('email')?.value || '').trim().toLowerCase();
  const passwordValue = (document.getElementById('password')?.value || '').trim();
  const isFreelancer = document.getElementById('freelancer-choice')?.checked || false;

  if (!emailValue || !passwordValue || (isRegister && !usernameValue)) {
    toast('Please enter all required details.');
    return;
  }

  if (isRegister) {
    const accountExists = state.users.some((user) => user.email.toLowerCase() === emailValue);
    if (accountExists) {
      toast('An account with this email already exists.');
      return;
    }

    const newUser = {
      id: Date.now().toString(),
      username: usernameValue,
      email: emailValue,
      password: passwordValue,
      role: isFreelancer ? 'Freelancer' : 'Member'
    };

    state.users.push(newUser);
    state.currentUser = newUser;
    saveState();
    toast('Account created successfully.');
    go(isFreelancer ? 'freelance' : 'dashboard');
    return;
  }

  const validUser = state.users.find(
    (user) => user.email.toLowerCase() === emailValue && user.password === passwordValue && (user.role === 'Freelancer') === isFreelancer
  );

  if (!validUser) {
    toast('Invalid login. Check your email, password, and freelancer selection.');
    return;
  }

  state.currentUser = validUser;
  saveState();
  toast(`Welcome back, ${validUser.username}!`);
  go(isFreelancer ? 'freelance' : 'dashboard');
}

function sidebar(active) {
  const isFreelancer = getCurrentUser()?.role === 'Freelancer';
  if (isFreelancer) {
    return `
      <aside class="sidebar">
        <p class="side-label">FREELANCE WORKSPACE</p>
        ${[['freelance', '⌂', 'Overview'], ['freelanceOffers', '⌕', 'Project offers'], ['freelancePayments', '◈', 'Payments']].map(([key, icon, label]) => `
          <button type="button" class="side-link ${active === key ? 'active' : ''}" onclick="go('${key}')"><span>${icon}</span>${label}</button>
        `).join('')}
        <p class="side-label">ACCOUNT</p>
        <button type="button" class="side-link ${active === 'profile' ? 'active' : ''}" onclick="go('profile')">◉ Profile</button>
        <button type="button" class="side-link" onclick="logout()">↩ Sign out</button>
      </aside>
    `;
  }

  return `
    <aside class="sidebar">
      <p class="side-label">WORKSPACE</p>
      ${[['dashboard', '⌂', 'Overview'], ['browse', '⌕', 'Browse projects'], ['offers', '◈', 'Offers'], ['workspace', '▣', 'My workspace']].map(([key, icon, label]) => `
        <button type="button" class="side-link ${active === key ? 'active' : ''}" onclick="go('${key}')"><span>${icon}</span>${label}</button>
      `).join('')}
      <p class="side-label">ACCOUNT</p>
      <button type="button" class="side-link ${active === 'profile' ? 'active' : ''}" onclick="go('profile')">◉ Profile</button>
      <button type="button" class="side-link" onclick="logout()">↩ Sign out</button>
    </aside>
  `;
}

function shell(active, body) {
  return `${nav()}<div class="layout">${sidebar(active)}<main class="content">${body}</main></div>`;
}

function dashboard() {
  if (!getCurrentUser()) {
    return auth(false);
  }

  const user = getCurrentUser();
  if (user.role === 'Freelancer') return freelance();
  const metrics = [
    ['📌', 'Open projects', `${state.projects.length} live`],
    ['◈', 'New offers', '6 offers'],
    ['✓', 'Tasks done', '12 of 18'],
    ['⚑', 'Portfolio score', 'High']
  ];

  return shell('dashboard', `
    <h1 class="page-title">Good ${new Date().getHours() < 12 ? 'morning' : 'afternoon'}, ${escapeHtml(user.username)} 👋</h1>
    <p class="page-intro">Manage your projects, monitor activity, and create a new listing whenever you’re ready.</p>

    <div class="dashboard-actions" style="display:flex;flex-wrap:wrap;gap:12px;">
      <button type="button" class="btn" onclick="go('create')">+ Create new project</button>
      <button type="button" class="btn secondary" onclick="go('browse')">Browse projects</button>
    </div>

    <section class="grid four">
      ${metrics.map(([icon, label, value]) => `
        <article class="card stat-card">
          <span class="icon">${icon}</span>
          <b>${value}</b>
          <small>${label}</small>
        </article>
      `).join('')}
    </section>
    <h2 class="section-title">Your active projects</h2>
    <section class="grid two">${state.projects.slice(0, 2).map(projectCard).join('')}</section>
  `);
}

function freelance() {
  if (getCurrentUser()?.role !== 'Freelancer') return dashboard();

  const selectedOffer = state.freelanceOffers.find((offer) => offer.id === state.selectedFreelanceOfferId);
  const activePayments = state.freelancePayments.filter((payment) => payment.status === 'In progress');
  const availableBalance = state.freelancePayments
    .filter((payment) => payment.status === 'Available')
    .reduce((total, payment) => total + payment.amount, 0);

  return shell('freelance', `
    <h1 class="page-title">Freelance overview</h1>
    <p class="page-intro">Find a good-fit project, keep delivery on track, and see what you’ve earned.</p>
    <section class="grid four">
      <article class="card stat-card"><span class="icon">⌕</span><b>${state.freelanceOffers.length}</b><small>Open project offers</small></article>
      <article class="card stat-card"><span class="icon">▣</span><b>${selectedOffer ? '1' : '0'}</b><small>Selected projects</small></article>
      <article class="card stat-card"><span class="icon">◈</span><b>₹${availableBalance.toLocaleString('en-IN')}</b><small>Available for payout</small></article>
      <article class="card stat-card"><span class="icon">✓</span><b>${activePayments.length}</b><small>Payments in progress</small></article>
    </section>
    <div class="freelance-section-heading">
      <h2 class="section-title">${selectedOffer ? 'Your selected project' : 'Choose your next project'}</h2>
      <button type="button" class="btn secondary" onclick="go('freelanceOffers')">Browse offers</button>
    </div>
    ${selectedOffer ? `
      <section class="detail-hero freelance-project">
        <span class="tag mint">Selected · ${escapeHtml(selectedOffer.category)}</span>
        <h2>${escapeHtml(selectedOffer.title)}</h2>
        <p>${escapeHtml(selectedOffer.description)}</p>
        <div class="meta"><span>Client: ${escapeHtml(selectedOffer.client)}</span><span>Delivery: ${escapeHtml(selectedOffer.delivery)}</span><span>₹${selectedOffer.price.toLocaleString('en-IN')}</span></div>
        <button type="button" class="btn" onclick="go('freelancePayments')">View payment</button>
      </section>
    ` : `
      <section class="card empty freelance-empty"><h3>No project selected yet</h3><p class="muted">Browse current offers and choose a project that matches your skills.</p><button type="button" class="btn" onclick="go('freelanceOffers')">Explore project offers</button></section>
    `}
    <h2 class="section-title">Payment snapshot</h2>
    <section class="card payment-summary">
      <div><small class="muted">Available balance</small><b>₹${availableBalance.toLocaleString('en-IN')}</b></div>
      <button type="button" class="btn secondary" onclick="go('freelancePayments')">Open payments</button>
    </section>
  `);
}

function freelanceOffers() {
  if (getCurrentUser()?.role !== 'Freelancer') return dashboard();

  const selectedId = state.selectedFreelanceOfferId;
  return shell('freelanceOffers', `
    <h1 class="page-title">Project offers</h1>
    <p class="page-intro">Review the brief, delivery window, and budget before choosing an offer.</p>
    <section class="grid two freelance-offer-grid">
      ${state.freelanceOffers.map((offer) => `
        <article class="card project-card freelance-offer-card">
          <div class="card-head"><span class="tag">${escapeHtml(offer.category)}</span><span class="tag gold">★ ${escapeHtml(offer.rating)}</span></div>
          <h2>${escapeHtml(offer.title)}</h2>
          <p>${escapeHtml(offer.description)}</p>
          <div class="freelance-skills">${offer.skills.map((skill) => `<span class="tag">${escapeHtml(skill)}</span>`).join(' ')}</div>
          <div class="freelance-offer-meta"><span><small>Client</small><b>${escapeHtml(offer.client)}</b></span><span><small>Delivery</small><b>${escapeHtml(offer.delivery)}</b></span><span><small>Budget</small><b>₹${offer.price.toLocaleString('en-IN')}</b></span></div>
          <button type="button" class="btn ${selectedId === offer.id ? 'secondary' : ''}" onclick="selectFreelanceOffer('${offer.id}')" ${selectedId === offer.id ? 'disabled' : ''}>${selectedId === offer.id ? 'Selected' : 'Choose offer'}</button>
        </article>
      `).join('')}
    </section>
  `);
}

function selectFreelanceOffer(offerId) {
  if (getCurrentUser()?.role !== 'Freelancer') return;
  const offer = state.freelanceOffers.find((item) => item.id === offerId);
  if (!offer) return;

  state.selectedFreelanceOfferId = offer.id;
  const paymentId = `selected-${offer.id}-${getCurrentUser().id}`;
  if (!state.freelancePayments.some((payment) => payment.id === paymentId)) {
    state.freelancePayments.unshift({
      id: paymentId,
      project: offer.title,
      milestone: 'Project accepted',
      amount: offer.price,
      status: 'In progress',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    });
  }
  saveState();
  toast('Offer selected. Project added to your workspace.');
  go('freelance');
}

function freelancePayments() {
  if (getCurrentUser()?.role !== 'Freelancer') return dashboard();

  const availableBalance = state.freelancePayments
    .filter((payment) => payment.status === 'Available')
    .reduce((total, payment) => total + payment.amount, 0);
  const inProgressTotal = state.freelancePayments
    .filter((payment) => payment.status === 'In progress')
    .reduce((total, payment) => total + payment.amount, 0);

  return shell('freelancePayments', `
    <h1 class="page-title">Freelance payments</h1>
    <p class="page-intro">Review project payment status and request a demo payout for available earnings.</p>
    <section class="grid two payment-totals">
      <article class="card stat-card"><small>Available for payout</small><b>₹${availableBalance.toLocaleString('en-IN')}</b><span class="muted">Ready to request</span></article>
      <article class="card stat-card"><small>In progress</small><b>₹${inProgressTotal.toLocaleString('en-IN')}</b><span class="muted">Held until the project milestone is complete</span></article>
    </section>
    <section class="card payment-ledger">
      <div class="card-head"><div><h2 class="section-title" style="margin:0">Payment activity</h2><p class="muted">Payout actions are a local demo and do not transfer real money.</p></div><span class="tag">${state.freelancePayments.length} records</span></div>
      ${state.freelancePayments.map((payment) => `
        <article class="payment-row">
          <div class="payment-mark">₹</div>
          <div class="payment-description"><b>${escapeHtml(payment.project)}</b><small>${escapeHtml(payment.milestone)} · ${escapeHtml(payment.date)}</small></div>
          <b class="payment-amount">₹${payment.amount.toLocaleString('en-IN')}</b>
          <span class="tag ${payment.status === 'Available' ? 'mint' : payment.status === 'Requested' ? 'gold' : ''}">${escapeHtml(payment.status)}</span>
          ${payment.status === 'Available' ? `<button type="button" class="btn secondary" onclick="requestPayout('${payment.id}')">Request payout</button>` : ''}
        </article>
      `).join('')}
    </section>
  `);
}

function requestPayout(paymentId) {
  const payment = state.freelancePayments.find((item) => item.id === paymentId);
  if (!payment || payment.status !== 'Available' || getCurrentUser()?.role !== 'Freelancer') return;
  payment.status = 'Requested';
  saveState();
  toast('Demo payout request recorded. No real payment was sent.');
  render();
}

function browse() {
  return shell('browse', `
    <h1 class="page-title">Explore projects</h1>
    <p class="page-intro">Find a project that fits your skills, interests and schedule.</p>
    <div class="toolbar">
      <input class="search" id="search" oninput="filterProjects()" placeholder="Search by project, skill or category">
      <select class="filter" id="category" onchange="filterProjects()">
        <option value="">All categories</option>
        <option>Web Development</option>
        <option>Machine Learning</option>
        <option>UI/UX Design</option>
      </select>
      <select class="filter" id="level" onchange="filterProjects()">
        <option value="">All levels</option>
        <option>Easy</option>
        <option>Medium</option>
        <option>Advanced</option>
      </select>
    </div>
    <section class="grid two" id="project-grid">${state.projects.map(projectCard).join('')}</section>
  `);
}

function filterProjects() {
  const searchValue = document.querySelector('#search')?.value.toLowerCase() || '';
  const categoryValue = document.querySelector('#category')?.value || '';
  const levelValue = document.querySelector('#level')?.value || '';

  const results = state.projects.filter((project) => {
    const haystack = JSON.stringify(project).toLowerCase();
    return haystack.includes(searchValue) && (!categoryValue || project.category === categoryValue) && (!levelValue || project.level === levelValue || project.difficulty === levelValue);
  });

  const grid = document.querySelector('#project-grid');
  if (!grid) return;
  grid.innerHTML = results.length ? results.map(projectCard).join('') : '<div class="card empty">No projects match those filters.</div>';
}

function openProject(id) {
  state.currentProjectId = id;
  go('project');
}

function project() {
  const currentProject = state.projects.find((project) => project.id === state.currentProjectId);
  if (!currentProject) return browse();

  const user = getCurrentUser();
  const canSetDifficulty = user && currentProject.createdBy === user.email;

  return shell('browse', `
    <button type="button" class="btn ghost" onclick="go('browse')">← Back to projects</button>
    <section class="detail-hero">
      <span class="tag">${escapeHtml(currentProject.category)}</span>
      <h1>${escapeHtml(currentProject.title)}</h1>
      <p>${escapeHtml(currentProject.description)}</p>
      <div class="meta">
        <span>Budget: ${escapeHtml(currentProject.budget)}</span>
        <span>Due ${escapeHtml(currentProject.deadline)}</span>
        <span>${escapeHtml(currentProject.level)} difficulty</span>
      </div>
    </section>

    <section class="split">
      <div class="card">
        <h2 class="section-title" style="margin-top:0">What you’ll build</h2>
        <p class="muted">The requester is looking for a student who can plan, design and develop a well-organised solution.</p>

        <h2 class="section-title">Skills needed</h2>
        <div>${currentProject.skills.map((skill) => `<span class="tag">${escapeHtml(skill)}</span>`).join(' ')}</div>

        <h2 class="section-title">About the requester</h2>
        <div class="row">
          <div class="avatar">${escapeHtml(currentProject.ownerName[0] || 'P')}</div>
          <div style="flex:1">
            <b>${escapeHtml(currentProject.ownerName)}</b><br>
            <small class="muted">Verified student · 4.8 rating</small>
          </div>
          <button type="button" class="btn ghost" onclick="go('profile')">View profile</button>
        </div>
      </div>

      <aside class="card">
        <span class="tag mint">${currentProject.offers} offers received</span>
        <h2 class="section-title">Interested?</h2>
        <p class="muted">Send a clear offer explaining your approach and timeline.</p>
        ${canSetDifficulty ? `
          <div class="difficulty-box">
            <label>Set project difficulty</label>
            <select id="projectDifficulty">
              <option ${currentProject.level === 'Easy' ? 'selected' : ''}>Easy</option>
              <option ${currentProject.level === 'Medium' ? 'selected' : ''}>Medium</option>
              <option ${currentProject.level === 'Advanced' ? 'selected' : ''}>Advanced</option>
            </select>
            <button type="button" class="btn" onclick="saveProjectDifficulty()">Save difficulty</button>
          </div>
        ` : ''}
        <button type="button" class="btn" style="width:100%" onclick="showOfferForm()">Send an offer</button>
      </aside>
    </section>

    <section id="offer-form"></section>
  `);
}

function saveProjectDifficulty() {
  const selected = document.getElementById('projectDifficulty')?.value;
  const currentProject = state.projects.find((project) => project.id === state.currentProjectId);

  if (!currentProject || !selected) {
    toast('Choose a valid difficulty level.');
    return;
  }

  currentProject.level = selected;
  currentProject.difficulty = selected;
  saveState();
  toast('Project difficulty updated.');
  render();
}

function showOfferForm() {
  const form = document.querySelector('#offer-form');
  if (!form) return;

  form.innerHTML = `
    <section class="card form-card" style="margin-top:20px">
      <h2 class="section-title" style="margin-top:0">Send your offer</h2>
      <div class="form-grid">
        <div class="field"><label>Your price</label><input value="₹2,300"></div>
        <div class="field">
          <label>Delivery time</label>
          <select>
            <option>5 days</option>
            <option>7 days</option>
            <option>10 days</option>
          </select>
        </div>
      </div>
      <div class="field"><label>Message to requester</label><textarea placeholder="Explain how you would approach this project..."></textarea></div>
      <button type="button" class="btn" onclick="toast('Offer sent! The requester will be notified.')">Submit offer</button>
    </section>
  `;
}

function create() {
  if (!getCurrentUser()) {
    toast('Please log in to create a project.');
    go('login');
    return '';
  }

  return shell('dashboard', `
    <h1 class="page-title">Post a new project</h1>
    <p class="page-intro">Describe what you need. ProjectLink will help you find the right helper.</p>
    <section class="card form-card">
      <form onsubmit="event.preventDefault(); submitProject();">
        <div class="field"><label>Project title</label><input id="project-title" placeholder="e.g. Campus event management portal" required></div>
        <div class="form-grid">
          <div class="field">
            <label>Category</label>
            <select id="project-category">
              <option>Web Development</option>
              <option>UI/UX Design</option>
              <option>Machine Learning</option>
              <option>Java Application</option>
            </select>
          </div>
          <div class="field"><label>Budget</label><input id="project-budget" placeholder="e.g. ₹2,500" required></div>
        </div>
        <div class="field"><label>Describe your project</label><textarea id="project-description" placeholder="What needs to be created? Include the expected features and outcome." required></textarea></div>
        <div class="form-grid">
          <div class="field"><label>Skills required</label><input id="project-skills" placeholder="HTML, CSS, JavaScript" required></div>
          <div class="field">
            <label>Difficulty</label>
            <select id="project-level">
              <option>Easy</option>
              <option selected>Medium</option>
              <option>Advanced</option>
            </select>
          </div>
        </div>
        <div class="field"><label>Deadline</label><input id="project-deadline" type="date"></div>
        <button class="btn" type="submit">Post project</button>
      </form>
    </section>
  `);
}

function submitProject() {
  const title = document.getElementById('project-title')?.value.trim();
  const category = document.getElementById('project-category')?.value || 'Web Development';
  const budget = document.getElementById('project-budget')?.value.trim();
  const description = document.getElementById('project-description')?.value.trim();
  const skillsText = document.getElementById('project-skills')?.value.trim();
  const level = document.getElementById('project-level')?.value || 'Medium';
  const deadlineValue = document.getElementById('project-deadline')?.value || '';

  if (!title || !budget || !description || !skillsText) {
    toast('Please complete all project fields.');
    return;
  }

  const user = getCurrentUser();
  const newProject = {
    id: Date.now(),
    title,
    category,
    budget,
    level,
    difficulty: level,
    skills: skillsText.split(',').map((item) => item.trim()).filter(Boolean),
    ownerName: user.username,
    ownerEmail: user.email,
    createdBy: user.email,
    offers: 0,
    deadline: deadlineValue ? new Date(deadlineValue).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'TBD',
    description
  };

  state.projects.unshift(newProject);
  saveState();
  toast('Project posted successfully!');
  go('dashboard');
}

function offers() {
  const user = getCurrentUser();
  const isHelper = false;

  return shell('offers', `
    <h1 class="page-title">Offers received</h1>
    <p class="page-intro">Compare proposals and choose the best candidate for your project.</p>
    <section class="card">
      <div class="card-head">
        <div>
          <b>Campus event management portal</b><br>
          <small class="muted">${isHelper ? 'Your offer is under review' : '2 new offers'}</small>
        </div>
        <span class="tag mint">Active</span>
      </div>
      ${[
        { name: 'Joana DCruz', initials: 'JD', price: '₹2,300', time: '5 days', rating: '4.8', message: 'I have built two college portals and can deliver a polished, responsive result.' },
        { name: 'Joseph Muthuvel Pandian', initials: 'JMP', price: '₹2,500', time: '6 days', rating: '4.9', message: 'I can build this with clear documentation so your team can present it easily.' }
      ].map((offer) => `
        <div class="offer">
          <div class="avatar">${offer.initials}</div>
          <div style="flex:1">
            <div class="row"><b>${offer.name}</b><span class="tag">★ ${offer.rating}</span></div>
            <p>${offer.message}</p>
            <small class="muted">${offer.time} delivery · ${offer.price}</small>
          </div>
          ${!isHelper ? `<button type="button" class="btn secondary" onclick="toast('${offer.name} has been selected! Workspace created.');go('workspace')">Select</button>` : ''}
        </div>
      `).join('')}
    </section>
  `);
}

function profile() {
  if (!getCurrentUser()) {
    return auth(false);
  }

  const user = getCurrentUser();
  const skillList = ['UI Design', 'Java', 'SQL', 'Product thinking'];

  return shell('profile', `
    <h1 class="page-title">Your profile</h1>
    <p class="page-intro">This is what other students see when deciding to collaborate with you.</p>
    <section class="grid two">
      <article class="card">
        <div class="row">
          <div class="avatar" style="width:62px;height:62px;font-size:20px">${escapeHtml(user.username.slice(0, 2).toUpperCase())}</div>
          <div style="flex:1">
            <h2 style="margin:0;font-family:Outfit, sans-serif">${escapeHtml(user.username)}</h2>
            <p class="muted" style="margin:4px 0">${escapeHtml(user.role)}</p>
          </div>
          <span class="tag mint">Verified</span>
        </div>
        <div class="list-item"><b>Email</b><span class="muted" style="float:right">${escapeHtml(user.email)}</span></div>
        <div class="list-item"><b>Role</b><span class="muted" style="float:right">${escapeHtml(user.role)}</span></div>
        <div class="list-item"><b>Rating</b><span style="float:right">★ 4.9</span></div>
        <div class="list-item"><b>Completed projects</b><span class="muted" style="float:right">8</span></div>
      </article>

      <article class="card">
        <h2 class="section-title" style="margin-top:0">Skills & strengths</h2>
        <p class="muted">These power the SkillMatcher recommendations.</p>
        <div id="skills">${skillList.map((skill) => `<span class="tag">${escapeHtml(skill)}</span>`).join(' ')}</div>
        <div class="field"><label>Add a skill</label><input id="skill-input" placeholder="e.g. Figma"></div>
        <button type="button" class="btn secondary" onclick="addSkill()">Add skill</button>
      </article>
    </section>
  `);
}

function addSkill() {
  const input = document.querySelector('#skill-input');
  if (!input) return;

  const value = input.value.trim();
  if (!value) {
    toast('Enter a new skill first.');
    return;
  }

  const user = getCurrentUser();
  const skillList = ['UI Design', 'Java', 'SQL', 'Product thinking'];

  if (!skillList.includes(value)) {
    skillList.push(value);
    toast('Skill added to your profile.');
    render();
  } else {
    toast('This skill is already on your profile.');
  }
}

function workspace() {
  return shell('workspace', `
    <h1 class="page-title">Project workspace</h1>
    <p class="page-intro">Collaborate with your team and track progress on the active project.</p>
    <section class="grid two">
      <article class="card">
        <h2 class="section-title">Project tasks</h2>
        ${state.workspace.tasks.map((task, index) => `
          <div class="task">
            <button type="button" class="check ${task[1] ? 'done' : ''}" onclick="toggleTask(${index})"></button>
            <span style="flex:1;${task[1] ? 'text-decoration:line-through;color:#8a94a5' : ''}">${escapeHtml(task[0])}</span>
            <span class="tag">${index < 2 ? 'Done' : 'To do'}</span>
          </div>
        `).join('')}
        <button type="button" class="btn secondary" style="margin-top:15px" onclick="toast('New task added (demo).')">+ Add task</button>
      </article>
      <article class="card">
        <h2 class="section-title">Project chat</h2>
        ${state.workspace.messages.map(([author, message]) => `
          <div class="message ${author === 'You' ? 'mine' : ''}"><b>${escapeHtml(author)}</b><br>${escapeHtml(message)}</div>
        `).join('')}
        <div class="row" style="margin-top:15px">
          <input class="search" id="chat-input" placeholder="Write a message...">
          <button type="button" class="btn" onclick="sendMessage()">Send</button>
        </div>
      </article>
    </section>
  `);
}

function toggleTask(index) {
  state.workspace.tasks[index][1] = !state.workspace.tasks[index][1];
  saveState();
  render();
}

function sendMessage() {
  const input = document.getElementById('chat-input');
  if (!input || !input.value.trim()) return;
  state.workspace.messages.push(['You', input.value.trim()]);
  saveState();
  render();
}

function render() {
  const page = location.hash.slice(1) || 'home';
  const validPages = ['home', 'login', 'register', 'browse', 'dashboard', 'project', 'create', 'offers', 'profile', 'workspace', 'freelance', 'freelanceOffers', 'freelancePayments'];
  const selectedPage = validPages.includes(page) ? page : 'home';
  const user = getCurrentUser();

  if ((selectedPage === 'dashboard' || selectedPage === 'create' || selectedPage === 'offers' || selectedPage === 'profile' || selectedPage === 'workspace' || selectedPage === 'freelance' || selectedPage === 'freelanceOffers' || selectedPage === 'freelancePayments') && !user) {
    app.innerHTML = auth(false);
    return;
  }

  if (user?.role === 'Freelancer' && ['create', 'offers', 'workspace'].includes(selectedPage)) {
    location.hash = 'freelance';
    return;
  }

  if (user?.role !== 'Freelancer' && ['freelance', 'freelanceOffers', 'freelancePayments'].includes(selectedPage)) {
    location.hash = 'dashboard';
    return;
  }

  const pages = {
    home,
    login: () => auth(false),
    register: () => auth(true),
    dashboard,
    browse,
    project,
    create,
    offers,
    profile,
    workspace,
    freelance,
    freelanceOffers,
    freelancePayments
  };

  app.innerHTML = (pages[selectedPage] || home)();

  const appNode = document.querySelector('#app');
  if (appNode) {
    appNode.classList.remove('page-animate');
    void appNode.offsetWidth;
    appNode.classList.add('page-animate');
  }
}

window.onhashchange = render;
render();
