/* ===================================================================
   MARKETING KIT
   Vanilla JS: smooth scroll, audience form + localStorage,
   USP generator, copy-to-clipboard + toast, content idea generator,
   marketing checklist + progress, marketing plan 7 hari, icons.
=================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* -----------------------------------------------------------
     0. ICONS
  ----------------------------------------------------------- */
  if (window.lucide) {
    lucide.createIcons();
  } else {
    const t = setInterval(() => {
      if (window.lucide) { lucide.createIcons(); clearInterval(t); }
    }, 60);
    setTimeout(() => clearInterval(t), 3000);
  }

  /* -----------------------------------------------------------
     1. TOAST NOTIFICATION
  ----------------------------------------------------------- */
  const toast = document.getElementById('toast');
  let toastTimer = null;

  const showToast = (message) => {
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2200);
  };

  /* -----------------------------------------------------------
     2. COPY TO CLIPBOARD (dipakai berulang di banyak tombol)
     Tombol bisa punya data-copy="teks langsung" ATAU
     data-copy-target="#elementId" (ambil textContent elemen itu).
  ----------------------------------------------------------- */
  const copyText = async (text, btn) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      // Fallback untuk browser lama / konteks tanpa izin clipboard
      const temp = document.createElement('textarea');
      temp.value = text;
      temp.style.position = 'fixed';
      temp.style.opacity = '0';
      document.body.appendChild(temp);
      temp.select();
      try { document.execCommand('copy'); } catch (e) { console.error('Copy gagal:', e); }
      document.body.removeChild(temp);
    }

    showToast('Berhasil disalin ✓');

    if (btn) {
      btn.classList.add('is-copied');
      setTimeout(() => btn.classList.remove('is-copied'), 1200);
    }
  };

  document.querySelectorAll('.copy-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      let text = '';
      if (btn.dataset.copy) {
        text = btn.dataset.copy;
      } else if (btn.dataset.copyTarget) {
        const target = document.querySelector(btn.dataset.copyTarget);
        text = target ? target.textContent.trim() : '';
      }
      if (text) copyText(text, btn);
    });
  });

  /* -----------------------------------------------------------
     3. AUDIENCE FORM — simpan & muat dari localStorage
  ----------------------------------------------------------- */
  const AUDIENCE_KEY = 'marketing-kit-audience-profile';
  const audienceForm = document.getElementById('audienceForm');
  const audienceSavedNote = document.getElementById('audienceSavedNote');
  const audienceFields = ['audTarget', 'audUmur', 'audMasalah', 'audKeinginan', 'audPlatform'];

  const loadAudienceProfile = () => {
    try {
      const raw = localStorage.getItem(AUDIENCE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      audienceFields.forEach((id) => {
        const el = document.getElementById(id);
        if (el && data[id]) el.value = data[id];
      });
    } catch (err) {
      console.error('Gagal memuat profil audiens:', err);
    }
  };

  if (audienceForm) {
    audienceForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = {};
      audienceFields.forEach((id) => {
        const el = document.getElementById(id);
        data[id] = el ? el.value.trim() : '';
      });
      try {
        localStorage.setItem(AUDIENCE_KEY, JSON.stringify(data));
        audienceSavedNote.hidden = false;
        requestAnimationFrame(() => audienceSavedNote.classList.add('is-visible'));
        showToast('Profil audiens tersimpan ✓');
      } catch (err) {
        console.error('Gagal menyimpan profil audiens:', err);
      }
    });

    loadAudienceProfile();
  }

  /* -----------------------------------------------------------
     4. USP GENERATOR
  ----------------------------------------------------------- */
  const uspBtn = document.getElementById('uspGenerateBtn');
  const uspResult = document.getElementById('uspResult');
  const uspResultText = document.getElementById('uspResultText');

  if (uspBtn) {
    uspBtn.addEventListener('click', () => {
      const target = document.getElementById('uspTarget').value.trim();
      const hasil = document.getElementById('uspHasil').value.trim();
      const cara = document.getElementById('uspCara').value.trim();

      if (!target || !hasil || !cara) {
        showToast('Isi ketiga kolom dulu ya 🙂');
        return;
      }

      uspResultText.textContent = `Saya membantu ${target} mendapatkan ${hasil} dengan cara ${cara}.`;
      uspResult.hidden = false;
    });
  }

  /* -----------------------------------------------------------
     5. SALIN FORMULA KONTEN (HOOK -> MASALAH -> SOLUSI -> CTA)
  ----------------------------------------------------------- */
  const copyFormulaBtn = document.getElementById('copyFormulaBtn');

  if (copyFormulaBtn) {
    copyFormulaBtn.addEventListener('click', () => {
      const formulaText = [
        'HOOK: Kalimat pertama yang bikin orang berhenti scroll.',
        'MASALAH: Jelaskan masalah yang kemungkinan sedang mereka alami.',
        'SOLUSI: Berikan tips, informasi, atau solusi yang relevan.',
        'CTA: Beritahu mereka harus melakukan apa selanjutnya.',
      ].join('\n');
      copyText(formulaText, copyFormulaBtn);
    });
  }

  /* -----------------------------------------------------------
     6. CONTENT IDEA GENERATOR
  ----------------------------------------------------------- */
  const ideaTemplates = {
    edukasi: [
      '5 kesalahan pemula saat menggunakan {topic}',
      'Cara memilih {topic} yang cocok untuk pemula',
      'Kenapa {topic} bisa menjadi peluang bisnis?',
      'Panduan singkat memahami {topic} dari nol',
      'Apa itu {topic}? Ini penjelasan simpelnya',
      '3 hal yang wajib kamu tahu sebelum mulai {topic}',
      'Perbedaan {topic} untuk pemula vs yang sudah jalan',
      'Istilah dasar seputar {topic} yang sering bikin bingung',
    ],
    tips: [
      '3 cara mencari ide untuk {topic}',
      'Tips sederhana biar konsisten jualan {topic}',
      'Cara mulai {topic} walau masih pemula banget',
      'Tips hemat waktu ngurus {topic} sendirian',
      '5 tools gratis yang membantu untuk {topic}',
      'Trik biar {topic} kamu lebih gampang dijual',
      'Cara riset pasar sederhana buat {topic}',
    ],
    problem: [
      'Udah coba jualan {topic} tapi belum ada yang beli?',
      'Kenapa {topic} kamu belum dilirik orang?',
      'Masalah yang sering bikin pemula {topic} nyerah duluan',
      'Bingung mulai {topic} dari mana? Ini biasanya penyebabnya',
      'Kesalahan yang bikin {topic} susah berkembang',
      'Kenapa followers banyak tapi {topic} tetap sepi pembeli?',
    ],
    story: [
      'Kenapa saya mulai jualan {topic}',
      'Cerita awal mula belajar {topic} dari nol',
      'Proses jatuh bangun membangun {topic}',
      'Apa yang saya pelajari setelah 30 hari jualan {topic}',
      'Momen paling susah waktu mulai {topic}, dan cara saya lewatinnya',
    ],
    promosi: [
      'Ini yang kamu dapetin kalau pakai {topic} dari saya',
      'Kenapa {topic} ini layak buat kamu coba',
      '{topic} yang saya tawarkan, cocok buat siapa aja',
      'Promo khusus buat kamu yang tertarik sama {topic}',
      'Testimoni dari yang udah coba {topic} ini',
    ],
  };

  const ideaTopicInput = document.getElementById('ideaTopic');
  const ideaTypeSelect = document.getElementById('ideaType');
  const ideaGenerateBtn = document.getElementById('ideaGenerateBtn');
  const ideaResults = document.getElementById('ideaResults');

  const shuffle = (arr) => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  if (ideaGenerateBtn) {
    ideaGenerateBtn.addEventListener('click', () => {
      const topic = ideaTopicInput.value.trim() || 'bisnis kamu';
      const type = ideaTypeSelect.value;
      const templates = ideaTemplates[type] || [];

      const picked = shuffle(templates).slice(0, 5);

      ideaResults.innerHTML = '';
      picked.forEach((tpl, index) => {
        const li = document.createElement('li');
        li.style.animationDelay = `${index * 40}ms`;

        const span = document.createElement('span');
        span.textContent = tpl.replace(/\{topic\}/g, topic);

        const copyIdeaBtn = document.createElement('button');
        copyIdeaBtn.type = 'button';
        copyIdeaBtn.className = 'copy-btn';
        copyIdeaBtn.innerHTML = '<i data-lucide="copy"></i> Copy';
        copyIdeaBtn.addEventListener('click', () => copyText(span.textContent, copyIdeaBtn));

        li.appendChild(span);
        li.appendChild(copyIdeaBtn);
        ideaResults.appendChild(li);
      });

      ideaResults.hidden = false;
      if (window.lucide) lucide.createIcons();
    });
  }

  /* -----------------------------------------------------------
     7. CHECKLIST GENERIK (dipakai untuk Marketing Checklist
     & Marketing Plan 7 Hari) — disimpan per grup di localStorage
  ----------------------------------------------------------- */
  const setupCheckGroup = (groupName, countElId) => {
    const key = `marketing-kit-${groupName}`;
    const inputs = Array.from(document.querySelectorAll(`input[data-group="${groupName}"]`));
    const countEl = countElId ? document.getElementById(countElId) : null;

    const load = () => {
      try {
        const raw = localStorage.getItem(key);
        if (!raw) return;
        const state = JSON.parse(raw);
        inputs.forEach((input) => { if (state[input.id]) input.checked = true; });
      } catch (err) {
        console.error(`Gagal memuat progres ${groupName}:`, err);
      }
    };

    const save = () => {
      const state = {};
      inputs.forEach((input) => { state[input.id] = input.checked; });
      try {
        localStorage.setItem(key, JSON.stringify(state));
      } catch (err) {
        console.error(`Gagal menyimpan progres ${groupName}:`, err);
      }
    };

    const updateCount = () => {
      if (!countEl) return;
      const total = inputs.length;
      const completed = inputs.filter((i) => i.checked).length;
      const label = groupName === 'plan7' ? 'hari selesai' : 'selesai';
      countEl.textContent = `${completed} / ${total} ${label}`;
    };

    inputs.forEach((input) => {
      input.addEventListener('change', () => {
        save();
        updateCount();
      });
    });

    load();
    updateCount();
  };

  setupCheckGroup('checklist', 'checklistCount');
  setupCheckGroup('plan7', 'planCount');

});