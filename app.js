const COUNTIES = [
  "Nairobi", "Mombasa", "Kisumu", "Kiambu", "Nakuru", "Uasin Gishu",
  "Machakos", "Kajiado", "Kilifi", "Nyeri", "Kakamega", "Meru", "Kisii"
];

const PEOPLE = [
  { id: "aisha", name: "Aisha", age: 26, county: "Mombasa", distance: 4, tribe: "Swahili", religion: "Muslim", mode: "Professional", bio: "Old Town walks, coconut juice, and sunset ferry rides.", interests: ["Travel", "Food", "Photography"], photo: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=900&q=80" },
  { id: "brian", name: "Brian", age: 29, county: "Nairobi", distance: 3, tribe: "Kikuyu", religion: "Christian", mode: "Professional", bio: "Westlands coffee, Sunday hikes in Ngong, and late coding sessions.", interests: ["Hiking", "Tech", "Afrobeats"], photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80" },
  { id: "mercy", name: "Mercy", age: 24, county: "Kiambu", distance: 8, tribe: "Kikuyu", religion: "Christian", mode: "Student", bio: "Campus life, gospel playlists, and chai at 5pm sharp.", interests: ["Church", "Books", "Running"], photo: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80" },
  { id: "otis", name: "Otis", age: 31, county: "Kisumu", distance: 6, tribe: "Luo", religion: "Christian", mode: "Lifestyle", bio: "Tilapia by the lake, rumba, and long talks about home.", interests: ["Music", "Cooking", "Football"], photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80" },
  { id: "zawadi", name: "Zawadi", age: 27, county: "Nairobi", distance: 2, tribe: "Kamba", religion: "Christian", mode: "Professional", bio: "Design studio by day, live bands at The Alchemist by night.", interests: ["Art", "Nightlife", "Yoga"], photo: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80" },
  { id: "hassan", name: "Hassan", age: 28, county: "Mombasa", distance: 5, tribe: "Swahili", religion: "Muslim", mode: "Lifestyle", bio: "Dhow rides, chai ya tangawizi, and quiet evenings in Nyali.", interests: ["Sea", "Poetry", "Food"], photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80" }
];

const store = {
  get user() { try { return JSON.parse(localStorage.getItem("kh_user") || "null"); } catch { return null; } },
  set user(v) { localStorage.setItem("kh_user", JSON.stringify(v)); },
  get likes() { return JSON.parse(localStorage.getItem("kh_likes") || "[]"); },
  set likes(v) { localStorage.setItem("kh_likes", JSON.stringify(v)); },
  get passes() { return JSON.parse(localStorage.getItem("kh_passes") || "[]"); },
  set passes(v) { localStorage.setItem("kh_passes", JSON.stringify(v)); },
  get chats() { return JSON.parse(localStorage.getItem("kh_chats") || "{}"); },
  set chats(v) { localStorage.setItem("kh_chats", JSON.stringify(v)); },
};

let route = location.hash.replace("#", "") || (store.user ? "discover" : "home");
let filters = { county: "All", maxKm: 50, mode: "All" };
let chatWith = null;
let toastMsg = "";

function toast(t) {
  toastMsg = t;
  render();
  setTimeout(() => { toastMsg = ""; render(); }, 2200);
}

function go(r) {
  route = r;
  location.hash = r;
  render();
}

window.addEventListener("hashchange", () => {
  route = location.hash.replace("#", "") || "home";
  render();
});

function nearby() {
  return PEOPLE.filter((p) => {
    if (store.likes.includes(p.id) || store.passes.includes(p.id)) return false;
    if (filters.county !== "All" && p.county !== filters.county) return false;
    if (p.distance > Number(filters.maxKm)) return false;
    if (filters.mode !== "All" && p.mode !== filters.mode) return false;
    return true;
  });
}

function matches() {
  return PEOPLE.filter((p) => store.likes.includes(p.id));
}

function Landing() {
  return `
    <div class="wrap">
      <header class="nav">
        <div class="brand"><div class="logo">K</div> Karibu Hapa</div>
        <div class="nav-actions">
          <button class="btn" onclick="go('login')">Log in</button>
          <button class="btn primary" onclick="go('signup')">Create profile</button>
        </div>
      </header>
      <section class="hero">
        <div>
          <div class="eyebrow">Location-based matchmaking · Kenya</div>
          <h1>Meet someone in your county, not across the ocean.</h1>
          <p class="lede">Karibu Hapa is dating built for Kenya — Nairobi traffic, Mombasa evenings, Kisumu lake air. Filter by county, distance, faith, lifestyle, or student / professional / church mode.</p>
          <div class="hero-cta">
            <button class="btn primary" onclick="go('signup')">Start matching</button>
            <button class="btn" onclick="go('login')">I already have a vibe</button>
          </div>
          <div class="pills">
            ${["Nairobi", "Mombasa", "Kisumu", "Kiambu", "Nakuru", "M-Pesa ready*"].map((x) => `<span class="pill">${x}</span>`).join("")}
          </div>
        </div>
        <div class="phone">
          <div class="phone-bar"></div>
          <div class="card-stack">
            <article class="swipe-card">
              <img src="${PEOPLE[0].photo}" alt="" />
              <div class="swipe-meta">
                <h3>${PEOPLE[0].name}, ${PEOPLE[0].age}</h3>
                <p>${PEOPLE[0].county} · ${PEOPLE[0].distance} km · ${PEOPLE[0].bio}</p>
              </div>
            </article>
          </div>
        </div>
      </section>
      <section class="section">
        <div class="grid-3">
          <div class="feature"><div class="eyebrow">01</div><h3>Nearby first</h3><p>We use county + approximate distance so you meet people you can actually grab chai with this week.</p></div>
          <div class="feature"><div class="eyebrow">02</div><h3>Kenyan filters</h3><p>County, age, interests, religion, and optional tribe. Student, professional, or church mode.</p></div>
          <div class="feature"><div class="eyebrow">03</div><h3>Safety built in</h3><p>Report, block, and keep chats respectful. Real GPS + payments come next with a proper backend.</p></div>
        </div>
      </section>
    </div>
  `;
}

function Auth(kind) {
  const isLogin = kind === "login";
  return `
    <div class="auth-box">
      <div class="brand" style="margin-bottom:16px"><div class="logo">K</div> Karibu Hapa</div>
      <h2 class="display">${isLogin ? "Welcome back" : "Create your profile"}</h2>
      <p class="muted" style="margin:8px 0 18px">${isLogin ? "Log in to keep swiping." : "Demo auth — stored only on this device."}</p>
      <form class="form" onsubmit="handleAuth(event, '${kind}')">
        ${isLogin ? "" : `<input name="name" required placeholder="Display name" />`}
        <input name="email" type="email" required placeholder="Email" />
        <input name="password" type="password" required placeholder="Password" minlength="4" />
        ${isLogin ? "" : `
          <select name="county">${COUNTIES.map((c) => `<option>${c}</option>`).join("")}</select>
          <select name="mode"><option>Professional</option><option>Student</option><option>Church</option><option>Lifestyle</option></select>
          <textarea name="bio" rows="3" placeholder="A short bio — what should someone know?"></textarea>
        `}
        <button class="btn primary" type="submit">${isLogin ? "Log in" : "Join Karibu Hapa"}</button>
        <button class="btn ghost" type="button" onclick="go('${isLogin ? "signup" : "login"}')">${isLogin ? "Need an account?" : "Already registered?"}</button>
      </form>
    </div>
  `;
}

window.handleAuth = (e, kind) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const existing = store.user;
  if (kind === "login") {
    if (!existing || existing.email !== fd.get("email")) {
      toast("No account on this device — create a profile.");
      return go("signup");
    }
    go("discover");
    return;
  }
  store.user = {
    name: fd.get("name"),
    email: fd.get("email"),
    county: fd.get("county"),
    mode: fd.get("mode"),
    bio: fd.get("bio"),
    age: 27,
  };
  toast("Karibu. Let’s find people nearby.");
  go("discover");
};

function Shell(inner) {
  const u = store.user;
  return `
    <div class="app-shell">
      <aside class="side">
        <div class="brand"><div class="logo">K</div> Karibu Hapa</div>
        <nav>
          <button class="link ${route === "discover" ? "active" : ""}" onclick="go('discover')">Discover</button>
          <button class="link ${route === "matches" ? "active" : ""}" onclick="go('matches')">Matches</button>
          <button class="link ${route === "chat" ? "active" : ""}" onclick="go('chat')">Chat</button>
          <button class="link ${route === "profile" ? "active" : ""}" onclick="go('profile')">My profile</button>
          <button class="link ${route === "safety" ? "active" : ""}" onclick="go('safety')">Safety</button>
        </nav>
        <p class="muted" style="margin-top:24px;font-size:13px">${u ? u.name + " · " + u.county : ""}</p>
        <button class="btn" style="margin-top:10px" onclick="logout()">Log out</button>
      </aside>
      <main class="main">${inner}</main>
    </div>
  `;
}

window.logout = () => { localStorage.removeItem("kh_user"); go("home"); };

window.setFilter = (k, v) => { filters[k] = v; render(); };

window.swipe = (id, yes) => {
  if (yes) {
    store.likes = [...store.likes, id];
    toast("It's a demo match. Say hi.");
  } else {
    store.passes = [...store.passes, id];
  }
  render();
};

window.openChat = (id) => { chatWith = id; go("chat"); };

window.sendMsg = (e) => {
  e.preventDefault();
  const text = e.target.msg.value.trim();
  if (!text || !chatWith) return;
  const chats = store.chats;
  chats[chatWith] = chats[chatWith] || [
    { me: false, text: "Sasa! Saw your profile — karibu." }
  ];
  chats[chatWith].push({ me: true, text });
  store.chats = chats;
  e.target.reset();
  render();
};

window.reportUser = (id) => {
  store.passes = [...new Set([...store.passes, id])];
  store.likes = store.likes.filter((x) => x !== id);
  toast("Report received (demo). They’ll be hidden.");
  render();
};

function Discover() {
  const list = nearby();
  const p = list[0];
  return Shell(`
    <div class="filters">
      <select onchange="setFilter('county', this.value)">
        <option ${filters.county === "All" ? "selected" : ""}>All</option>
        ${COUNTIES.map((c) => `<option ${filters.county === c ? "selected" : ""}>${c}</option>`).join("")}
      </select>
      <select onchange="setFilter('maxKm', this.value)">
        ${[5, 10, 25, 50].map((n) => `<option value="${n}" ${Number(filters.maxKm) === n ? "selected" : ""}>Within ${n} km</option>`).join("")}
      </select>
      <select onchange="setFilter('mode', this.value)">
        ${["All", "Student", "Professional", "Church", "Lifestyle"].map((m) => `<option ${filters.mode === m ? "selected" : ""}>${m}</option>`).join("")}
      </select>
    </div>
    <div class="discover">
      <div class="profile-card">
        ${p ? `
          <div class="photo"><img src="${p.photo}" alt="${p.name}" /></div>
          <div style="padding:16px 18px 0">
            <h2>${p.name}, ${p.age}</h2>
            <p class="muted">${p.county} · ${p.distance} km · ${p.mode} · ${p.religion}</p>
            <p style="margin-top:10px">${p.bio}</p>
            <div class="pills" style="margin-top:10px">${p.interests.map((i) => `<span class="pill">${i}</span>`).join("")}</div>
          </div>
          <div class="actions">
            <button class="round no" onclick="swipe('${p.id}', false)">✕</button>
            <button class="round yes" onclick="swipe('${p.id}', true)">♥</button>
          </div>
        ` : `<div style="padding:48px 24px"><h2>That’s the neighbourhood.</h2><p class="muted">No more profiles with these filters. Loosen distance or county.</p></div>`}
      </div>
      <div class="panel">
        <h3>How matching works</h3>
        <p class="muted" style="margin-top:8px">This demo filters mock profiles by county and distance. A production app would request GPS, store coordinates, and rank by Haversine distance plus shared interests.</p>
        <p class="muted" style="margin-top:12px">Liked: ${store.likes.length} · Passed: ${store.passes.length}</p>
      </div>
    </div>
  `);
}

function Matches() {
  const m = matches();
  return Shell(`
    <h2>Matches</h2>
    <p class="muted" style="margin:8px 0 16px">People you liked — tap to chat.</p>
    <div class="match-list">
      ${m.length ? m.map((p) => `
        <div class="match-item" onclick="openChat('${p.id}')">
          <img class="avatar" src="${p.photo}" alt="" />
          <div><strong>${p.name}</strong><div class="muted">${p.county} · ${p.distance} km</div></div>
        </div>`).join("") : `<p class="muted">No matches yet. Discover someone nearby.</p>`}
    </div>
  `);
}

function Chat() {
  const m = matches();
  const person = PEOPLE.find((p) => p.id === chatWith) || m[0];
  chatWith = person ? person.id : null;
  const msgs = (chatWith && store.chats[chatWith]) || (chatWith ? [{ me: false, text: "Sasa! Nice to match with you." }] : []);
  return Shell(`
    <div class="discover">
      <div class="chat-pane">
        <div style="padding:14px;border-bottom:1px solid var(--line)">${person ? person.name + " · " + person.county : "Pick a match"}</div>
        <div class="msgs">${msgs.map((x) => `<div class="bubble ${x.me ? "me" : ""}">${x.text}</div>`).join("")}</div>
        ${person ? `<form class="composer" onsubmit="sendMsg(event)"><input name="msg" placeholder="Write a message…" autocomplete="off" /><button class="btn primary" type="submit">Send</button></form>` : ""}
      </div>
      <div class="match-list">
        ${m.map((p) => `
          <div class="match-item" onclick="openChat('${p.id}')">
            <img class="avatar" src="${p.photo}" alt="" />
            <div><strong>${p.name}</strong><div class="muted">${p.county}</div></div>
          </div>`).join("") || "<p class='muted'>Match someone first.</p>"}
      </div>
    </div>
  `);
}

function Profile() {
  const u = store.user || {};
  return Shell(`
    <h2>Your profile</h2>
    <form class="form" style="margin-top:16px" onsubmit="saveProfile(event)">
      <input name="name" value="${u.name || ""}" required />
      <select name="county">${COUNTIES.map((c) => `<option ${u.county === c ? "selected" : ""}>${c}</option>`).join("")}</select>
      <select name="mode">${["Professional", "Student", "Church", "Lifestyle"].map((m) => `<option ${u.mode === m ? "selected" : ""}>${m}</option>`).join("")}</select>
      <textarea name="bio" rows="4">${u.bio || ""}</textarea>
      <p class="muted">Photo uploads and live GPS need cloud storage + a backend. This demo keeps profile text on-device.</p>
      <button class="btn primary" type="submit">Save</button>
    </form>
  `);
}

window.saveProfile = (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  store.user = { ...store.user, name: fd.get("name"), county: fd.get("county"), mode: fd.get("mode"), bio: fd.get("bio") };
  toast("Profile updated.");
};

function Safety() {
  const m = matches();
  return Shell(`
    <h2>Safety & reports</h2>
    <p class="muted" style="margin:8px 0 16px">Meet in public. Tell a friend. Never send M-Pesa to a stranger “to verify”.</p>
    <div class="match-list">
      ${m.map((p) => `
        <div class="match-item">
          <img class="avatar" src="${p.photo}" alt="" />
          <div style="flex:1"><strong>${p.name}</strong><div class="muted">${p.county}</div></div>
          <button class="btn danger" onclick="reportUser('${p.id}')">Report / hide</button>
        </div>`).join("") || "<p class='muted'>No conversations to review.</p>"}
    </div>
  `);
}

function render() {
  const needAuth = ["discover", "matches", "chat", "profile", "safety"].includes(route);
  if (needAuth && !store.user) route = "signup";
  const root = document.getElementById("app");
  let html = "";
  if (route === "home") html = Landing();
  else if (route === "login") html = Auth("login");
  else if (route === "signup") html = Auth("signup");
  else if (route === "discover") html = Discover();
  else if (route === "matches") html = Matches();
  else if (route === "chat") html = Chat();
  else if (route === "profile") html = Profile();
  else if (route === "safety") html = Safety();
  else html = Landing();
  if (toastMsg) html += `<div class="toast">${toastMsg}</div>`;
  root.innerHTML = html;
}

render();
