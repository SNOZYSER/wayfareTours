const cards = [...document.querySelectorAll('.dest')];
const buttons = [...document.querySelectorAll('.filters button')];
const count = document.getElementById('count');

// Filter destinations by type
buttons.forEach(btn => btn.addEventListener('click', () => {
  buttons.forEach(b => b.setAttribute('aria-pressed', b === btn));
  let shown = 0;
  cards.forEach(card => {
    const match = btn.dataset.filter === 'all' || card.dataset.type === btn.dataset.filter;
    card.hidden = !match;
    if (match) shown++;
  });
  count.textContent = `Showing ${shown} destination${shown === 1 ? '' : 's'}`;
}));

// "Plan this trip" fills the form's destination field
document.querySelectorAll('.go').forEach(link => link.addEventListener('click', () => {
  const field = document.querySelector('[name="destination"]');
  field.value = link.dataset.dest;
  setTimeout(() => field.focus({ preventScroll: true }), 500);
}));


/* ---------- Tour packages ---------- */
// Edit this list to change names, prices and visits. Price is per person in rupees.
const packages = [
  {key:'goa', dest:'Goa, India', name:'Goa Beach Escape', nights:3, price:14999,
   visits:['Baga Beach','Fort Aguada sunset','Basilica of Bom Jesus','Dudhsagar Falls','Panjim Latin Quarter']},
  {key:'jaipur', dest:'Jaipur, India', name:'Royal Jaipur', nights:3, price:12499,
   visits:['Amber Fort','Hawa Mahal','City Palace','Jantar Mantar','Chokhi Dhani dinner']},
  {key:'munnar', dest:'Munnar, India', name:'Munnar Tea Hills', nights:2, price:9999,
   visits:['Tea Museum','Eravikulam National Park','Mattupetty Dam','Top Station viewpoint']},
  {key:'ladakh', dest:'Ladakh, India', name:'Ladakh High Passes', nights:6, price:32999,
   visits:['Leh Palace','Thiksey Monastery','Khardung La pass','Nubra Valley','Pangong Lake']},
  {key:'udaipur', dest:'Udaipur, India', name:'Udaipur Lakes', nights:2, price:11999,
   visits:['City Palace','Lake Pichola boat ride','Jagdish Temple','Saheliyon Ki Bari']},
  {key:'alleppey', dest:'Alleppey, India', name:'Backwater Houseboat', nights:2, price:10499,
   visits:['Overnight houseboat cruise','Kuttanad village walk','Marari Beach','Alappuzha Beach']},
  {key:'rishikesh', dest:'Rishikesh, India', name:'Rishikesh Adventure', nights:3, price:8999,
   visits:['River rafting','Laxman Jhula','Ganga Aarti at Triveni Ghat','Beatles Ashram']},
  {key:'andaman', dest:'Andaman Islands, India', name:'Andaman Island Hop', nights:5, price:38999,
   visits:['Radhanagar Beach','Cellular Jail','Ross Island','Snorkelling at Havelock','Neil Island']},
  {key:'hampi', dest:'Hampi, India', name:'Hampi Ruins Trail', nights:2, price:7499,
   visits:['Virupaksha Temple','Vittala Temple stone chariot','Hemakuta Hill','Elephant Stables']},
  {key:'darjeeling', dest:'Darjeeling, India', name:'Darjeeling Hill Station', nights:3, price:13499,
   visits:['Tiger Hill sunrise','Toy Train ride','Batasia Loop','Happy Valley Tea Estate']}
];

const grid = document.getElementById('packageGrid');
const rupees = n => '₹' + n.toLocaleString('en-IN');

function renderPackages(list) {
  grid.innerHTML = list.map(p => `
    <article class="pkg">
      <div class="pkg-img ${p.key}" role="img" aria-label="${p.dest}"></div>
      <h3>${p.name}</h3>
      <p class="len">${p.nights} nights, ${p.nights + 1} days · ${p.visits.length} visits</p>
      <h4>Places you'll visit</h4>
      <ul>${p.visits.map(v => `<li>${v}</li>`).join('')}</ul>
      <div class="pkg-foot">
        <div class="price">${rupees(p.price)}<small>per person</small></div>
        <a class="btn small book" href="#plan" data-dest="${p.dest}" data-pkg="${p.name}">Book this</a>
      </div>
    </article>`).join('');
}

document.getElementById('sort').addEventListener('change', e => {
  const sorted = [...packages];
  if (e.target.value === 'low') sorted.sort((a, b) => a.price - b.price);
  if (e.target.value === 'high') sorted.sort((a, b) => b.price - a.price);
  if (e.target.value === 'short') sorted.sort((a, b) => a.nights - b.nights);
  renderPackages(sorted);
});

// "Book this" fills the destination and package in the form
grid.addEventListener('click', e => {
  const btn = e.target.closest('.book');
  if (!btn) return;
  document.querySelector('[name="destination"]').value = btn.dataset.dest;
  document.querySelector('[name="package"]').value = btn.dataset.pkg;
});

renderPackages(packages);


/* ---------- Contact form (sends to your email through Formspree) ---------- */
const contactForm = document.getElementById('contactForm');
const sent = document.getElementById('sent');

contactForm.addEventListener('submit', async e => {
  e.preventDefault();
  const note = (text, ok) => {
    sent.textContent = text;
    sent.style.borderColor = ok ? 'var(--leaf)' : '#B3261E';
    sent.hidden = false;
  };

  if (contactForm.action.includes('YOUR_FORM_ID')) {
    return note('The contact form is not connected yet. Please call or email us instead.', false);
  }

  const button = contactForm.querySelector('button[type="submit"]');
  button.disabled = true;
  button.textContent = 'Sending...';

  try {
    const res = await fetch(contactForm.action, {
      method: 'POST',
      body: new FormData(contactForm),
      headers: { Accept: 'application/json' }
    });
    if (!res.ok) throw new Error('Request failed');
    const first = contactForm.name.value.trim().split(' ')[0];
    note(`Thanks, ${first}. We got your message and will reply within one working day.`, true);
    contactForm.reset();
  } catch {
    note('Sorry, your message was not sent. Please try again or call our support line.', false);
  } finally {
    button.disabled = false;
    button.textContent = 'Send message';
  }
});
