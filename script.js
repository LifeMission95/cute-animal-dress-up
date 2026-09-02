const characters = [
  { value: "bunny", name: "토끼 모찌", nickname: "모찌", icon: "🐰", fullName: "아기토끼 모찌", color: "#fff0f3" },
  { value: "cheetah", name: "치타 치치", nickname: "치치", icon: "🐯", fullName: "아기치타 치치", color: "#fff0c9" },
  { value: "penguin", name: "펭귄 포포", nickname: "포포", icon: "🐧", fullName: "아기펭귄 포포", color: "#e4effa" },
];

const themeColors = { 기본: "#f4eee9", 햇살: "#fff0b9", 딸기: "#ffe0e7", 별빛: "#e7e2f8", 바다: "#dfedfb", 무지개: "#eee4fb", 숲속: "#dff4ec", 요리사: "#fff5d6", 왕자님: "#e5edf9" };
const item = (value, name, theme) => ({ value, name, theme, color: themeColors[theme] });

const wardrobe = {
  hat: { title: "모자", hint: "같은 테마의 옷과 맞춰 봐!", items: [
    item("none", "모자 벗기", "기본"), item("flower", "꽃밭 밀짚모자", "햇살"), item("beret", "딸기 베레모", "딸기"),
    item("nightcap", "달님 잠옷모자", "별빛"), item("cap", "파도 야구모자", "바다"), item("party", "무지개 파티모자", "무지개"),
    item("beanie", "숲속 방울모자", "숲속"), item("chef", "꼬마 요리사모자", "요리사"), item("crown", "반짝 왕관", "왕자님"),
  ] },
  top: { title: "상의", hint: "품이 살짝 넉넉한 상의를 골라 봐!", items: [
    item("none", "상의 벗기", "기본"), item("sweater", "햇살 별니트", "햇살"), item("polka", "딸기 도트티", "딸기"),
    item("pajama-top", "달빛 잠옷상의", "별빛"), item("sailor", "파도 세일러티", "바다"), item("rainbow", "무지개 티셔츠", "무지개"),
    item("hoodie", "민트 후드티", "숲속"), item("stripe", "요리사 줄무늬티", "요리사"), item("jacket", "꼬마 왕자재킷", "왕자님"),
  ] },
  bottom: { title: "하의", hint: "테마 색을 맞추면 세트처럼 보여!", items: [
    item("none", "하의 벗기", "기본"), item("skirt", "햇살 주름치마", "햇살"), item("bloomers", "딸기 블루머", "딸기"),
    item("pajama", "달빛 잠옷바지", "별빛"), item("shorts", "파도 반바지", "바다"), item("rainbow-skirt", "무지개 치마", "무지개"),
    item("cargo", "숲속 카고바지", "숲속"), item("overalls", "요리사 멜빵바지", "요리사"), item("tutu", "왕실 프릴치마", "왕자님"),
  ] },
  shoes: { title: "신발", hint: "마지막 신발까지 자유롭게 골라 봐!", items: [
    item("none", "신발 벗기", "기본"), item("yellow", "햇살 운동화", "햇살"), item("ballet", "딸기 리본슈즈", "딸기"),
    item("bunny", "달빛 토끼슬리퍼", "별빛"), item("blue-sneakers", "파도 운동화", "바다"), item("skates", "무지개 롤러스케이트", "무지개"),
    item("rainboots", "숲속 장화", "숲속"), item("sandals", "요리사 샌들", "요리사"), item("boots", "왕실 부츠", "왕자님"),
  ] },
};

const coordinatedLooks = [
  { theme: "햇살", hat: "flower", top: "sweater", bottom: "skirt", shoes: "yellow" },
  { theme: "딸기", hat: "beret", top: "polka", bottom: "bloomers", shoes: "ballet" },
  { theme: "별빛", hat: "nightcap", top: "pajama-top", bottom: "pajama", shoes: "bunny" },
  { theme: "바다", hat: "cap", top: "sailor", bottom: "shorts", shoes: "blue-sneakers" },
  { theme: "무지개", hat: "party", top: "rainbow", bottom: "rainbow-skirt", shoes: "skates" },
  { theme: "숲속", hat: "beanie", top: "hoodie", bottom: "cargo", shoes: "rainboots" },
  { theme: "요리사", hat: "chef", top: "stripe", bottom: "overalls", shoes: "sandals" },
  { theme: "왕자님", hat: "crown", top: "jacket", bottom: "tutu", shoes: "boots" },
];

const catalog = { ...wardrobe };
const STORAGE_KEY = "mochi-wardrobe-v3";
const defaultState = { activeTab: "top", character: "bunny", hat: "none", top: "none", bottom: "none", shoes: "none", soundOn: true };
const oldLooks = { bare: {}, "sunny-picnic": coordinatedLooks[0], "strawberry-picnic": coordinatedLooks[1], "starlight-dream": coordinatedLooks[2], "ocean-explorer": coordinatedLooks[3], "rainbow-party": coordinatedLooks[4], "forest-camp": coordinatedLooks[5], "little-chef": coordinatedLooks[6], "ballet-day": coordinatedLooks[7] };

const isValidValue = (items, value) => items.some((candidate) => candidate.value === value);
function readStorage(key) { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } }
function validateState(candidate = {}) {
  const next = { ...defaultState };
  next.activeTab = Object.hasOwn(catalog, candidate.activeTab) ? candidate.activeTab : "top";
  next.character = isValidValue(characters, candidate.character) ? candidate.character : "bunny";
  Object.keys(wardrobe).forEach((category) => { next[category] = isValidValue(wardrobe[category].items, candidate[category]) ? candidate[category] : "none"; });
  next.soundOn = typeof candidate.soundOn === "boolean" ? candidate.soundOn : true;
  return next;
}
function loadState() {
  const saved = readStorage(STORAGE_KEY);
  if (saved && typeof saved === "object") return validateState(saved);
  const v2 = readStorage("mochi-wardrobe-v2");
  if (v2 && typeof v2 === "object") return validateState({ ...v2, ...(oldLooks[v2.outfit] || {}), activeTab: "top" });
  return validateState(readStorage("mochi-wardrobe-v1") || {});
}
const state = loadState();
function saveState() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* 저장 없이도 게임을 계속합니다. */ } }

const categoryTabs = [...document.querySelectorAll(".category-tab")];
const itemGrid = document.querySelector("#itemGrid");
const itemTemplate = document.querySelector("#itemTemplate");
const closetTitle = document.querySelector("#closetTitle");
const closetHint = document.querySelector("#closetHint");
const characterSvg = document.querySelector("#bunny");
const characterName = document.querySelector("#characterName");
const speechBubble = document.querySelector("#speechBubble");
const progressDots = document.querySelector("#progressDots");
const soundButton = document.querySelector("#soundButton");
const soundLabel = soundButton.querySelector(".sound-label");
const refreshButton = document.querySelector("#refreshButton");
const sparkleBox = document.querySelector("#sparkles");
const characterPicker = document.querySelector("#characterPicker");
const pickerGrid = document.querySelector("#pickerGrid");
const gameBoard = document.querySelector("#gameBoard");
const changeCharacterButton = document.querySelector("#changeCharacterButton");
let audioContext;
let bounceTimer;
let messageTimer;

const getCharacter = (value = state.character) => characters.find((character) => character.value === value) || characters[0];
const getItem = (category, value = state[category]) => wardrobe[category]?.items.find((candidate) => candidate.value === value);
let previewId = 0;

function isolateSvgIds(svg, label) {
  const idMap = new Map();
  svg.querySelectorAll("[id]").forEach((node) => {
    const oldId = node.id;
    const nextId = `${label}-${previewId}-${oldId}`;
    idMap.set(oldId, nextId);
    node.id = nextId;
  });
  svg.querySelectorAll("*").forEach((node) => {
    [...node.attributes].forEach((attribute) => {
      let nextValue = attribute.value;
      idMap.forEach((nextId, oldId) => { nextValue = nextValue.replaceAll(`url(#${oldId})`, `url(#${nextId})`); });
      if (nextValue !== attribute.value) node.setAttribute(attribute.name, nextValue);
    });
  });
  previewId += 1;
}

function applyStateToCharacter() {
  const selectedCharacter = getCharacter();
  gameBoard.style.setProperty("--character-bg", selectedCharacter.color);
  characterSvg.querySelectorAll(":scope > .character-layer").forEach((layer) => layer.classList.toggle("is-active", layer.dataset.character === selectedCharacter.value));
  characterSvg.querySelectorAll(":scope > .clothing-layer").forEach((layer) => layer.classList.toggle("is-worn", state[layer.dataset.category] === layer.dataset.value));
  const heart = document.createElement("span");
  heart.setAttribute("aria-hidden", "true");
  heart.textContent = selectedCharacter.icon;
  characterName.replaceChildren(heart, document.createTextNode(` ${selectedCharacter.nickname}`));
  const wornNames = Object.keys(wardrobe).filter((category) => state[category] !== "none").map((category) => getItem(category)?.name).filter(Boolean);
  characterSvg.setAttribute("aria-label", `${wornNames.length ? wornNames.join(", ") : "포근한 털옷"}을 입고 있는 ${selectedCharacter.fullName}`);
}

function createLookPreview(characterValue = state.character) {
  const preview = characterSvg.cloneNode(true);
  preview.removeAttribute("id"); preview.removeAttribute("role");
  preview.setAttribute("class", "item-preview-svg look-preview"); preview.setAttribute("aria-hidden", "true"); preview.setAttribute("focusable", "false");
  preview.querySelectorAll(".character-layer").forEach((layer) => { if (layer.dataset.character !== characterValue) layer.remove(); else layer.classList.add("is-active"); });
  preview.querySelectorAll(".clothing-layer").forEach((layer) => { if (state[layer.dataset.category] !== layer.dataset.value) layer.remove(); else layer.classList.add("is-worn"); });
  isolateSvgIds(preview, "look");
  return preview;
}

function createPickerPreview(characterValue) {
  const preview = characterSvg.cloneNode(true);
  preview.removeAttribute("id"); preview.removeAttribute("role");
  preview.setAttribute("class", "picker-character-svg"); preview.setAttribute("aria-hidden", "true"); preview.setAttribute("focusable", "false");
  preview.querySelectorAll(".character-layer").forEach((layer) => { if (layer.dataset.character !== characterValue) layer.remove(); else layer.classList.add("is-active"); });
  preview.querySelectorAll(".clothing-layer").forEach((layer) => layer.remove());
  isolateSvgIds(preview, `picker-${characterValue}`);
  return preview;
}

function renderPicker() {
  pickerGrid.replaceChildren();
  characters.forEach((character) => {
    const button = document.createElement("button");
    const art = document.createElement("span");
    const name = document.createElement("strong");
    button.type = "button"; button.className = "picker-card"; button.style.setProperty("--picker-bg", character.color);
    button.classList.toggle("is-selected", state.character === character.value);
    button.setAttribute("aria-label", `${character.fullName} 선택하고 옷장 들어가기`);
    art.className = "picker-card__art"; art.appendChild(createPickerPreview(character.value));
    name.textContent = character.nickname;
    button.append(art, name);
    button.addEventListener("click", () => enterWardrobe(character.value));
    pickerGrid.appendChild(button);
  });
}

function showPicker() {
  characterPicker.classList.remove("is-hidden");
  gameBoard.classList.add("is-hidden");
  changeCharacterButton.classList.add("is-hidden");
  renderPicker();
}

function enterWardrobe(characterValue) {
  state.character = characterValue;
  applyStateToCharacter(); renderItems(); updateProgress(); saveState();
  characterPicker.classList.add("is-hidden");
  gameBoard.classList.remove("is-hidden");
  changeCharacterButton.classList.remove("is-hidden");
  bounceCharacter(); makeSparkles(); playPop();
}
const previewViews = { hat: "72 40 236 132", top: "60 246 260 150", bottom: "72 334 236 135", shoes: "72 424 236 84" };
function createEmptyPreview() { const empty = document.createElement("span"); empty.className = "item-preview-empty"; empty.textContent = "☁"; return empty; }
function createClothingPreview(category, value) {
  if (value === "none") return createEmptyPreview();
  const preview = characterSvg.cloneNode(true);
  preview.removeAttribute("id"); preview.removeAttribute("role");
  preview.setAttribute("viewBox", previewViews[category]); preview.setAttribute("class", `item-preview-svg clothing-preview clothing-preview--${category}`);
  preview.setAttribute("aria-hidden", "true"); preview.setAttribute("focusable", "false");
  preview.querySelectorAll(".character-layer").forEach((layer) => layer.remove());
  preview.querySelectorAll(".clothing-layer").forEach((layer) => { if (layer.dataset.category !== category || layer.dataset.value !== value) layer.remove(); else layer.classList.add("is-worn"); });
  [...preview.children].forEach((child) => { if (child.tagName.toLowerCase() === "ellipse") child.remove(); });
  isolateSvgIds(preview, `item-${category}`);
  return preview;
}
const createCardPreview = (tab, value) => createClothingPreview(tab, value);

function renderItems() {
  const section = catalog[state.activeTab];
  closetTitle.textContent = section.title; closetHint.textContent = section.hint;
  itemGrid.classList.remove("is-character-grid"); itemGrid.replaceChildren();
  section.items.forEach((currentItem, index) => {
    const card = itemTemplate.content.firstElementChild.cloneNode(true);
    const isSelected = state[state.activeTab] === currentItem.value;
    card.dataset.value = currentItem.value; card.dataset.category = state.activeTab;
    card.style.setProperty("--card-bg", currentItem.color); card.style.setProperty("--art-angle", index % 2 ? "2deg" : "-2deg");
    card.querySelector(".item-art").replaceChildren(createCardPreview(state.activeTab, currentItem.value));
    card.querySelector(".item-name").textContent = currentItem.value === "none" ? "벗기" : currentItem.theme;
    card.querySelector(".item-theme").textContent = "";
    card.classList.toggle("is-remove-card", currentItem.value === "none");
    card.classList.toggle("is-selected", isSelected); card.setAttribute("aria-pressed", isSelected ? "true" : "false");
    card.setAttribute("aria-label", currentItem.value === "none" ? `${currentItem.name}, 눌러서 바로 벗기` : `${currentItem.name}, 눌러서 입히기`);
    card.addEventListener("click", () => selectItem(state.activeTab, currentItem.value, currentItem.name));
    itemGrid.appendChild(card);
  });
}

function selectTab(tab) {
  state.activeTab = tab;
  categoryTabs.forEach((button) => { const active = button.dataset.tab === tab; button.classList.toggle("is-active", active); button.setAttribute("aria-selected", active ? "true" : "false"); });
  renderItems(); saveState();
}
function selectItem(category, value, name, options = {}) {
  state[category] = value; applyStateToCharacter(); renderItems(); updateProgress(); saveState(); bounceCharacter();
  if (!options.quiet) { showMessage(value === "none" ? "○" : "✨"); makeSparkles(); playPop(); }
}
function updateProgress() {
  const categories = Object.keys(wardrobe); const filledCount = categories.filter((category) => state[category] !== "none").length;
  [...progressDots.children].forEach((dot, index) => dot.classList.toggle("is-filled", index < filledCount)); progressDots.setAttribute("aria-label", `코디 ${filledCount}/4 완성`);
  categoryTabs.forEach((button) => { const tab = button.dataset.tab; button.classList.toggle("is-complete", state[tab] !== "none"); });
}
function bounceCharacter() { characterSvg.classList.remove("is-bouncing"); void characterSvg.getBoundingClientRect(); characterSvg.classList.add("is-bouncing"); window.clearTimeout(bounceTimer); bounceTimer = window.setTimeout(() => characterSvg.classList.remove("is-bouncing"), 600); }
function showMessage(message) { speechBubble.textContent = message; window.clearTimeout(messageTimer); messageTimer = window.setTimeout(() => { speechBubble.textContent = "♥"; }, 1200); }
function makeSparkles() {
  const symbols = ["✦", "♥", "●", "✿", "★", "✦"]; const colors = ["#f49aab", "#ffd66b", "#59ad8d", "#8ec8ec", "#c7b5eb"]; sparkleBox.replaceChildren();
  symbols.forEach((symbol, index) => { const sparkle = document.createElement("span"); const angle = (Math.PI * 2 * index) / symbols.length - Math.PI / 2; const distance = 90 + Math.random() * 85;
    sparkle.className = "sparkle"; sparkle.textContent = symbol; sparkle.style.setProperty("--tx", `${Math.cos(angle) * distance}px`); sparkle.style.setProperty("--ty", `${Math.sin(angle) * distance}px`); sparkle.style.setProperty("--sparkle-color", colors[index % colors.length]); sparkle.style.setProperty("--sparkle-size", `${15 + Math.random() * 12}px`); sparkleBox.appendChild(sparkle); });
}
function playPop() {
  if (!state.soundOn) return;
  try { audioContext ||= new (window.AudioContext || window.webkitAudioContext)(); const now = audioContext.currentTime;
    [523.25, 659.25, 783.99].forEach((frequency, index) => { const oscillator = audioContext.createOscillator(); const gain = audioContext.createGain(); oscillator.type = "sine"; oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, now + index * 0.045); gain.gain.exponentialRampToValueAtTime(0.08, now + index * 0.045 + 0.012); gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.045 + 0.16);
      oscillator.connect(gain).connect(audioContext.destination); oscillator.start(now + index * 0.045); oscillator.stop(now + index * 0.045 + 0.18); });
  } catch { state.soundOn = false; updateSoundButton(); }
}
function updateSoundButton() { soundButton.setAttribute("aria-pressed", state.soundOn ? "true" : "false"); soundLabel.textContent = state.soundOn ? "소리 켜짐" : "소리 꺼짐"; soundButton.querySelector("span").textContent = state.soundOn ? "♪" : "×"; }
function randomizeLook() {
  const look = coordinatedLooks[Math.floor(Math.random() * coordinatedLooks.length)];
  Object.keys(wardrobe).forEach((category) => { state[category] = look[category]; }); applyStateToCharacter(); selectTab("top"); updateProgress(); saveState(); bounceCharacter(); showMessage("✨"); makeSparkles(); playPop();
}
function resetGame() { Object.keys(wardrobe).forEach((category) => { state[category] = "none"; }); applyStateToCharacter(); selectTab("top"); updateProgress(); saveState(); showMessage("○"); playPop(); }

categoryTabs.forEach((button) => button.addEventListener("click", () => { selectTab(button.dataset.tab); playPop(); }));
soundButton.addEventListener("click", () => { state.soundOn = !state.soundOn; updateSoundButton(); saveState(); if (state.soundOn) playPop(); });
refreshButton.addEventListener("click", () => window.location.reload());
document.querySelector("#randomButton").addEventListener("click", randomizeLook);
document.querySelector("#resetButton").addEventListener("click", resetGame);
changeCharacterButton.addEventListener("click", showPicker);
applyStateToCharacter(); selectTab(state.activeTab); updateSoundButton(); updateProgress(); renderPicker(); showPicker();
