/* ===================================================================
   CHECKLIST MEMULAI BISNIS DIGITAL
   Vanilla JS: checkbox logic, progress calculation, localStorage,
   reset (with confirm modal), tandai semua, stage rail, animasi.
=================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  const STORAGE_KEY = 'nyvora-checklist-bisnis-digital-v1';

  const checkboxes = Array.from(document.querySelectorAll('.item__checkbox'));
  const categories = Array.from(document.querySelectorAll('.category'));

  const percentText = document.getElementById('percentText');
  const countText = document.getElementById('countText');
  const progressFill = document.getElementById('progressFill');
  const progressTrack = document.getElementById('progressTrack');
  const progressMessage = document.getElementById('progressMessage');
  const stageRail = document.getElementById('stageRail');

  const resetBtn = document.getElementById('resetBtn');
  const checkAllBtn = document.getElementById('checkAllBtn');
  const resetModal = document.getElementById('resetModal');
  const resetCancelBtn = document.getElementById('resetCancelBtn');
  const resetConfirmBtn = document.getElementById('resetConfirmBtn');

  /* -----------------------------------------------------------
     1. LOCALSTORAGE — baca & simpan progres
  ----------------------------------------------------------- */
  const loadProgress = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (err) {
      console.error('Gagal membaca progres tersimpan:', err);
      return {};
    }
  };

  const saveProgress = () => {
    const state = {};
    checkboxes.forEach((cb) => { state[cb.id] = cb.checked; });
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.error('Gagal menyimpan progres:', err);
    }
  };

  const applyStoredProgress = () => {
    const state = loadProgress();
    checkboxes.forEach((cb) => {
      if (state[cb.id]) cb.checked = true;
    });
  };

  /* -----------------------------------------------------------
     2. BUILD STAGE RAIL (7 titik, satu per kategori)
  ----------------------------------------------------------- */
  categories.forEach((cat, index) => {
    const node = document.createElement('div');
    node.className = 'stage-node';
    node.dataset.categoryIndex = String(index);
    node.textContent = String(index + 1);
    stageRail.appendChild(node);
  });

  const stageNodes = Array.from(stageRail.querySelectorAll('.stage-node'));

  const checkIconSVG = `
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 8.5L6.2 11.5L13 4.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;

  /* -----------------------------------------------------------
     3. PESAN MOTIVASI BERDASARKAN PERSENTASE
  ----------------------------------------------------------- */
  const getMessage = (percent) => {
    if (percent === 0) return 'Yuk mulai dari langkah pertama 🚀';
    if (percent <= 25) return 'Mantap, kamu sudah mulai!';
    if (percent <= 50) return 'Bagus! Sedikit demi sedikit mulai terbentuk.';
    if (percent <= 75) return 'Keren, kamu sudah lebih dari setengah jalan!';
    if (percent < 100) return 'Dikit lagi! Tinggal beberapa langkah.';
    return '🎉 Checklist selesai! Sekarang waktunya mulai menjalankan bisnis kamu.';
  };

  /* -----------------------------------------------------------
     4. HITUNG & RENDER PROGRES (total, per kategori, rail, pesan)
  ----------------------------------------------------------- */
  const updateProgress = () => {
    const total = checkboxes.length;
    const completed = checkboxes.filter((cb) => cb.checked).length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Angka besar + hitungan
    percentText.textContent = `${percent}%`;
    countText.textContent = `${completed} / ${total} selesai`;

    // Progress bar
    progressFill.style.width = `${percent}%`;
    progressTrack.setAttribute('aria-valuenow', String(percent));

    // Pesan motivasi
    progressMessage.textContent = getMessage(percent);

    // Badge jumlah per kategori + status node di stage rail
    categories.forEach((cat, index) => {
      const catCheckboxes = Array.from(cat.querySelectorAll('.item__checkbox'));
      const catCompleted = catCheckboxes.filter((cb) => cb.checked).length;
      const catTotal = catCheckboxes.length;
      const countEl = cat.querySelector('[data-category-count]');
      if (countEl) countEl.textContent = `${catCompleted}/${catTotal}`;

      const node = stageNodes[index];
      if (!node) return;

      const isComplete = catTotal > 0 && catCompleted === catTotal;
      const isActive = catCompleted > 0 && !isComplete;

      node.classList.toggle('is-complete', isComplete);
      node.classList.toggle('is-active', isActive);
      node.innerHTML = isComplete ? checkIconSVG : String(index + 1);
    });
  };

  /* -----------------------------------------------------------
     5. EVENT: checkbox berubah → animasi kecil + simpan + hitung ulang
  ----------------------------------------------------------- */
  checkboxes.forEach((cb) => {
    cb.addEventListener('change', () => {
      const item = cb.closest('.item');
      if (cb.checked && item) {
        item.classList.add('is-just-checked');
        setTimeout(() => item.classList.remove('is-just-checked'), 220);
      }
      saveProgress();
      updateProgress();
    });
  });

  /* -----------------------------------------------------------
     6. TOMBOL "TANDAI SEMUA SELESAI"
  ----------------------------------------------------------- */
  checkAllBtn.addEventListener('click', () => {
    checkboxes.forEach((cb) => { cb.checked = true; });
    saveProgress();
    updateProgress();
  });

  /* -----------------------------------------------------------
     7. TOMBOL "RESET CHECKLIST" — pakai modal konfirmasi sendiri
  ----------------------------------------------------------- */
  const openResetModal = () => {
    resetModal.hidden = false;
    requestAnimationFrame(() => resetModal.classList.add('is-visible'));
    resetConfirmBtn.focus();
  };

  const closeResetModal = () => {
    resetModal.classList.remove('is-visible');
    setTimeout(() => { resetModal.hidden = true; }, 200);
  };

  resetBtn.addEventListener('click', openResetModal);
  resetCancelBtn.addEventListener('click', closeResetModal);

  resetModal.addEventListener('click', (e) => {
    if (e.target === resetModal) closeResetModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !resetModal.hidden) closeResetModal();
  });

  resetConfirmBtn.addEventListener('click', () => {
    checkboxes.forEach((cb) => { cb.checked = false; });
    saveProgress();
    updateProgress();
    closeResetModal();
  });

  /* -----------------------------------------------------------
     8. INISIALISASI
  ----------------------------------------------------------- */
  applyStoredProgress();
  updateProgress();

});