
const produk = [
  {icon:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>', title:'Starter Pack Bisnis Digital', desc:'Panduan lengkap untuk memulai bisnis digital beserta kumpulan aset pilihan yang cocok untuk pelajar maupun pemula.', meta:'PLR / MRR • Aktif Selamanya'},
  {icon:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v9a6 6 0 0 0 12 0V2z"/></svg>', title:'1000+ Produk Digital Terlaris', desc:'Kumpulan produk digital best seller yang dapat dijual maupun dijadikan referensi untuk memulai bisnis.', meta:'1000+ Produk • PLR / MRR'}
];
const bonus = [
  {icon:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>', cat:'Education', title:'Video Belajar Digital Marketing', desc:'Belajar dasar digital marketing lewat video singkat yang simple dan mudah dipahami.'},
  {icon:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 22a7 7 0 1 1 0-14 7 7 0 0 1 0 14z"/><path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/></svg>', cat:'Template', title:'Template Canva', desc:'Kumpulan template canva siap edit untuk membantu kebutuhan konten dan promosi bisnis digital.'},
  {icon:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>', cat:'Content', title:'Template Konten Media Sosial', desc:'Ide dan template konten untuk TikTok, Facebook, dan platform lainnya.'},
  {icon:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 11l18-5v12L3 14v-3z"/><path d="M11.6 16.9a3 3 0 1 1-5.8-1.1"/></svg>', cat:'Resources', title:'Marketing Kit', desc:'Kumpulan aset marketing siap pakai untuk promosi produk digital kamu.'},
  {icon:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>', cat:'Guide', title:'Checklist Memulai Bisnis Digital', desc:'Checklist step-by-step biar kamu nggak bingung mulai dari mana.'}
];

function renderProduk(containerId){
  const el=document.getElementById(containerId);
  if(!el) return;
  el.innerHTML = produk.map(p=>`
    <div class="card reveal">
      <div class="card-top">
        <div class="card-icon">${p.icon}</div>
        <div class="card-badge">Aktif</div>
      </div>
      <h3>${p.title}</h3>
      <div class="desc">${p.desc}</div>
      <div class="meta">${p.meta}</div>
      <button class="btn btn-dark" style="width:100%">Akses Produk <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg></button>
    </div>
  `).join('');
}

function renderBonus(containerId, limit){
  const el=document.getElementById(containerId);
  if(!el) return;
  const list = limit ? bonus.slice(0,limit) : bonus;
  el.innerHTML = list.map(b=>`
    <div class="card reveal">
      <div class="card-top">
        <div class="card-icon">${b.icon}</div>
        <div class="card-badge">${b.cat}</div>
      </div>
      <h3>${b.title}</h3>
      <div class="desc">${b.desc}</div>
      <button class="btn btn-dark" style="width:100%;background:#F1F5F1;color:var(--dark);border:1px solid var(--border)">Akses Bonus <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg></button>
    </div>
  `).join('');
}

renderProduk('produk-grid');
renderProduk('produk-page-grid');
renderBonus('bonus-grid-mini',3);
renderBonus('bonus-page-grid');

const tabs=document.querySelectorAll('.tab');
const pages=document.querySelectorAll('.page');
tabs.forEach(t=>{
  t.addEventListener('click',()=>{
    tabs.forEach(x=>x.classList.remove('active'));
    t.classList.add('active');
    pages.forEach(p=>p.classList.remove('active'));
    document.getElementById(t.dataset.tab).classList.add('active');
    window.scrollTo({top:0,behavior:'smooth'});
    setTimeout(observe,100);
  });
});

function observe(){
  const els=document.querySelectorAll('.reveal');
  const io=new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('in'); });
  },{threshold:.15});
  els.forEach(el=>io.observe(el));
}
observe();

document.addEventListener('mousemove',(e)=>{
  const cards=document.querySelectorAll('.card');
  cards.forEach(c=>{
    const rect=c.getBoundingClientRect();
    const x=(e.clientX-rect.left)/rect.width-.5;
    const y=(e.clientY-rect.top)/rect.height-.5;
    if(Math.abs(x)<1 && Math.abs(y)<1){
      c.style.transform=`perspective(600px) rotateY(${x*4}deg) rotateX(${-y*4}deg) translateY(-3px)`;
    }
  });
});
document.addEventListener('mouseleave',()=>{
  document.querySelectorAll('.card').forEach(c=>c.style.transform='');
});
