// Simple UI to render industries -> use cases -> platform steps from usecases.json
let data = [];
const industrySelect = document.getElementById('industrySelect');
const usecaseSelect = document.getElementById('usecaseSelect');
const platformSelect = document.getElementById('platformSelect');
const usecaseTitle = document.getElementById('usecaseTitle');
const stepsContainer = document.getElementById('stepsContainer');

function loadData() {
  fetch('./usecases.json')
    .then(r => {
      if (!r.ok) throw new Error('Failed to load usecases.json');
      return r.json();
    })
    .then(json => {
      data = json;
      populateIndustries();
    })
    .catch(err => {
      console.error(err);
      industrySelect.innerHTML = '<option value="">Failed to load</option>';
      usecaseSelect.innerHTML = '<option value="">Failed to load</option>';
      usecaseTitle.textContent = 'Error loading data';
      stepsContainer.innerHTML = '<pre style="color:maroon">' + err.message + '</pre>';
    });
}

function populateIndustries() {
  industrySelect.innerHTML = '<option value="">-- choose industry --</option>';
  data.forEach(ind => {
    const opt = document.createElement('option');
    opt.value = ind.id;
    opt.textContent = ind.name;
    industrySelect.appendChild(opt);
  });
  industrySelect.addEventListener('change', onIndustryChange);
  usecaseSelect.addEventListener('change', onUsecaseChange);
  platformSelect.addEventListener('change', renderSteps);
}

function onIndustryChange() {
  const indId = industrySelect.value;
  stepsContainer.innerHTML = '';
  usecaseTitle.textContent = 'Select a use case';
  usecaseSelect.innerHTML = '';
  if (!indId) {
    usecaseSelect.innerHTML = '<option value="">Select industry first</option>';
    return;
  }
  const industry = data.find(i => i.id === indId);
  if (!industry) return;
  usecaseSelect.innerHTML = '<option value="">-- choose use case --</option>';
  industry.useCases.forEach(uc => {
    const opt = document.createElement('option');
    opt.value = uc.id;
    opt.textContent = uc.title;
    usecaseSelect.appendChild(opt);
  });
}

function onUsecaseChange() {
  const indId = industrySelect.value;
  const ucId = usecaseSelect.value;
  if (!indId || !ucId) {
    usecaseTitle.textContent = 'Select an industry and use case';
    stepsContainer.innerHTML = '';
    return;
  }
  const industry = data.find(i => i.id === indId);
  const uc = industry.useCases.find(u => u.id === ucId);
  usecaseTitle.textContent = uc.title;
  renderSteps();
}

function clearChildren(el) {
  while (el.firstChild) el.removeChild(el.firstChild);
}

function renderSteps() {
  const indId = industrySelect.value;
  const ucId = usecaseSelect.value;
  const platform = platformSelect.value || 'moengage';
  clearChildren(stepsContainer);
  if (!indId || !ucId) return;
  const industry = data.find(i => i.id === indId);
  const uc = industry.useCases.find(u => u.id === ucId);
  const steps = (uc && uc[platform] && uc[platform].steps) ? uc[platform].steps : [];
  if (!steps.length) {
    stepsContainer.innerHTML = '<p>No steps available for this selection.</p>';
    return;
  }
  const ol = document.createElement('ol');
  steps.forEach(s => {
    const li = document.createElement('li');
    li.textContent = s;
    ol.appendChild(li);
  });
  stepsContainer.appendChild(ol);
}

// Initialize
loadData();
