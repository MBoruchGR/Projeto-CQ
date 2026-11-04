// --- VARIÁVEIS DO JOGO ---
let cookies = 0;
let cookiesPerSecond = 0;

// Ponteiros
let pointerCost = 10;
let pointerCount = 0;
let contadorautoclick = 0; // Contador de quantas vezes o item foi comprado
let pointerBatchSize = 1;      // Quantos ponteiros ganha por compra atual
const basePointerCPS = 1;
let pointerMultiplier = 1;

// Upgrade do Ponteiro (7 Níveis)
let pointerUpgradeLevel = 0;
const pointerUpgradeTiers = [
    { name: "Ponteiro Lubrificado (Nível 1)", cost: 500, multiplier: 2 },
    { name: "Ponteiro Turbo (Nível 2)", cost: 2500, multiplier: 4 },
    { name: "Ponteiro Quântico (Nível 3)", cost: 10000, multiplier: 8 },
    { name: "Ponteiro Galático (Nível 4)", cost: 50000, multiplier: 16},
    { name: "Ponteiro Universal (Nível 5)", cost: 100000, multiplier: 32},
    { name: "Ponteiro Multiversal (Nível 6)", cost: 200000, multiplier: 64},
    { name: "Ponteiro Paradoxal (Final)", cost: 500000, multiplier: 128}
];

// Luvas (8 Níveis)
let baseClick = 1;
let gloveLevel = 0;
let gloveBonus = 0; 
const gloveTiers = [
    { name: "Luvas de Couro", cost: 100, bonus: 2 },
    { name: "Luvas de Malha", cost: 500, bonus: 5 },
    { name: "Luvas de Ouro", cost: 2500, bonus: 15 },
    { name: "Luvas de Cobre", cost: 12000, bonus: 50 },
    { name: "Luvas de Ferro", cost: 50000, bonus: 200 },
    { name: "Luvas de Diamante", cost: 100000, bonus: 800 },
    { name: "Luvas de Esmeralda", cost: 200000, bonus: 2000 },
    { name: "Luvas de Netherita", cost: 500000, bonus: 5000 },
];

// Upgrade de Luva
let gloveUpgradeLevel = 0;
let gloveMultiplier = 1; 
const gloveUpgradeTiers = [
    { name: "Polimento de Luvas (Nível 1)", cost: 1000, multiplier: 2 },
    { name: "Costura Reforçada (Nível 2)", cost: 5000, multiplier: 3 },
    { name: "Infusão Mágica (Nível 3)", cost: 25000, multiplier: 5 }
];

// Upgrades do Biscoito Dourado
let goldenMultLevel = 0;
let goldenMultiplierValue = 3; 
const goldenMultTiers = [
    { name: "Sorte Aprimorada (x5)", cost: 25000, mult: 5 },
    { name: "Sorte Suprema (x7)", cost: 100000, mult: 7 }
];

let goldenDurationLevel = 0;
let goldenDurationSeconds = 10; 
const goldenDurationTiers = [
    { name: "Biscoito Extendido (15s)", cost: 40000, duration: 15 },
    { name: "Biscoito Eterno (25s)", cost: 150000, duration: 25 }
];

// --- UPGRADE FINAL ---
let matterTransmuterBought = false;
const matterTransmuterCost = 67000000;

// Biscoito Dourado e Bônus
let temporaryMultiplier = 1; 
let bonusActive = false;
let goldenTimerInterval = null;
let goldenTimeout = null;

// --- ELEMENTOS DO DOM ---
const cookieCountSpan = document.getElementById('cookie-count');
const cpsCountSpan = document.getElementById('cps-count');
const mainCookie = document.getElementById('main-cookie');
const goldenCookie = document.getElementById('golden-cookie');
const container = document.getElementById('cookie-container');
const goldenTimerP = document.getElementById('golden-timer');
const timeLeftSpan = document.getElementById('time-left');

// --- CLIQUE NO COOKIE PRINCIPAL ---
mainCookie.addEventListener('click', (event) => {
    let matterMultiplier = matterTransmuterBought ? 1000000 : 1;
    let ganho = (baseClick + (gloveBonus * gloveMultiplier)) * temporaryMultiplier * matterMultiplier;
    cookies += ganho;
    updateDisplay();
    
    createFloatingNumber(event, ganho);
});

// --- NÚMEROS FLUTUANTES ---
function createFloatingNumber(event, valor) {
    const floatingNum = document.createElement('div');
    
    floatingNum.classList.add('floating-number');
    floatingNum.innerText = `+${valor}`;
    
    if (bonusActive) {
        floatingNum.style.color = '#ffeb3b';
        floatingNum.style.textShadow = '2px 2px 0px #e65100';
    }

    const rect = container.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    floatingNum.style.left = `${x}px`;
    floatingNum.style.top = `${y}px`;

    container.appendChild(floatingNum);

    setTimeout(() => {
        floatingNum.remove();
    }, 800);
}

const contador = document.getElementById("contadorautoclick");

// --- LOJA: PONTEIRO ---
function buyPointer() {
    if (cookies >= pointerCost) {
        cookies -= pointerCost;
        
        pointerCount += pointerBatchSize; // Adiciona a quantidade do lote atual
        contadorautoclick++;         // Incrementa o contador de vezes comprado
        contador.innerText = contadorautoclick;
        updatePointerBatchSize();        // Verifica se atingiu algum marco para aumentar o lote
        recalculateCPS();

        pointerCost = Math.ceil(pointerCost * 1.15);

        updateShopDisplay();
        updateDisplay();
    }
    else {
        alert("Você precisa de mais biscoitos!");
    }
}

// --- MARCOS DE QUANTIDADE DO PONTEIRO ---
function updatePointerBatchSize() {
    if (contadorautoclick >= 200) {
        pointerBatchSize = 10000000;
    } else if (contadorautoclick >= 150) {
        pointerBatchSize = 500;
    } else if (contadorautoclick >= 100) {
        pointerBatchSize = 250;
    } else if (contadorautoclick >= 74) {
        pointerBatchSize = 100;
    } else if (contadorautoclick >= 50) {
        pointerBatchSize = 50;
    } else if (contadorautoclick >= 24) {
        pointerBatchSize = 10;
    } else if (contadorautoclick >= 10) {
        pointerBatchSize = 5;
    } else {
        pointerBatchSize = 1;
    }
}

// --- LOJA: UPGRADE DO PONTEIRO ---
function buyPointerUpgrade() {
    if (pointerUpgradeLevel >= pointerUpgradeTiers.length) {
        alert("Você já comprou o nível máximo deste upgrade!");
        return;
    }

    let currentTier = pointerUpgradeTiers[pointerUpgradeLevel];

    if (cookies >= currentTier.cost) {
        cookies -= currentTier.cost;
        pointerMultiplier = currentTier.multiplier;
        pointerUpgradeLevel++;

        updatePointerUpgradeShop();
        recalculateCPS();
        updateDisplay();
    }
    else {
        alert("Você precisa de mais biscoitos!");
    }
}

function updatePointerUpgradeShop() {
    const nameSpan = document.getElementById('pointer-upgrade-name');
    const costSpan = document.getElementById('pointer-upgrade-cost');
    const itemContainer = document.getElementById('buy-pointer-upgrade');

    if (pointerUpgradeLevel < pointerUpgradeTiers.length) {
        nameSpan.innerText = pointerUpgradeTiers[pointerUpgradeLevel].name;
        costSpan.innerText = pointerUpgradeTiers[pointerUpgradeLevel].cost;
    }
    else {
        nameSpan.innerText = "Ponteiros Lendários (Máximo)";
        itemContainer.querySelector('p').innerText = "Eficiência máxima atingida!";
        costSpan.parentElement.style.display = 'none';
        itemContainer.querySelector('button').style.display = 'none';
    }
}

function recalculateCPS() {
    cookiesPerSecond = (pointerCount * basePointerCPS * pointerMultiplier);
}

// --- LOJA: SISTEMA DE LUVAS ---
function buyGloves() {
    if (gloveLevel >= gloveTiers.length) {
        alert("Você já comprou o nível máximo das luvas!");
        return;
    }

    let currentTier = gloveTiers[gloveLevel];

    if (cookies >= currentTier.cost) {
        cookies -= currentTier.cost;
        gloveBonus += currentTier.bonus; 
        gloveLevel++; 

        updateGlovesShop();
        updateDisplay();
    }
    else {
        alert("Você precisa de mais biscoitos!");
    }
}

function updateGlovesShop() {
    const nameSpan = document.getElementById('gloves-name');
    const costSpan = document.getElementById('gloves-cost');
    const itemContainer = document.getElementById('buy-gloves-item');

    if (gloveLevel < gloveTiers.length) {
        nameSpan.innerText = gloveTiers[gloveLevel].name;
        costSpan.innerText = gloveTiers[gloveLevel].cost;
    } 
    else {
        nameSpan.innerText = "Luvas Lendárias (Máximo)";
        itemContainer.querySelector('p').innerText = "Nível máximo atingido!";
        costSpan.parentElement.style.display = 'none';
        itemContainer.querySelector('button').style.display = 'none';
    }
}

// --- LOJA: UPGRADE DAS LUVAS ---
function buyGloveUpgrade() {
    if (gloveUpgradeLevel >= gloveUpgradeTiers.length) {
        alert("Você já comprou o nível máximo deste upgrade!");
        return;
    }

    let currentTier = gloveUpgradeTiers[gloveUpgradeLevel];

    if (cookies >= currentTier.cost) {
        cookies -= currentTier.cost;
        gloveMultiplier = currentTier.multiplier;
        gloveUpgradeLevel++;

        updateGloveUpgradeShop();
        updateDisplay();
    }
    else {
        alert("Você precisa de mais biscoitos!");
    }
}

function updateGloveUpgradeShop() {
    const nameSpan = document.getElementById('glove-upgrade-name');
    const costSpan = document.getElementById('glove-upgrade-cost');
    const itemContainer = document.getElementById('buy-glove-upgrade');

    if (gloveUpgradeLevel < gloveUpgradeTiers.length) {
        nameSpan.innerText = gloveUpgradeTiers[gloveUpgradeLevel].name;
        costSpan.innerText = gloveUpgradeTiers[gloveUpgradeLevel].cost;
    }
    else {
        nameSpan.innerText = "Luvas Supremas (Máximo)";
        itemContainer.querySelector('p').innerText = "Eficiência máxima atingida!";
        costSpan.parentElement.style.display = 'none';
        itemContainer.querySelector('button').style.display = 'none';
    }
}

// --- LOJA: UPGRADE DO MULTIPLICADOR DO BISCOITO DOURADO ---
function buyGoldenMultUpgrade() {
    if (goldenMultLevel >= goldenMultTiers.length) {
        alert("Você já comprou o nível máximo deste upgrade!");
        return;
    }

    let currentTier = goldenMultTiers[goldenMultLevel];

    if (cookies >= currentTier.cost) {
        cookies -= currentTier.cost;
        goldenMultiplierValue = currentTier.mult;
        goldenMultLevel++;

        updateGoldenMultShop();
        updateDisplay();
    }
    else {
        alert("Você precisa de mais biscoitos!");
    }
}

function updateGoldenMultShop() {
    const nameSpan = document.getElementById('golden-mult-name');
    const costSpan = document.getElementById('golden-mult-cost');
    const itemContainer = document.getElementById('buy-golden-mult-upgrade');

    if (goldenMultLevel < goldenMultTiers.length) {
        nameSpan.innerText = goldenMultTiers[goldenMultLevel].name;
        costSpan.innerText = goldenMultTiers[goldenMultLevel].cost;
    }
    else {
        nameSpan.innerText = "Sorte Divina (Máximo)";
        itemContainer.querySelector('p').innerText = "Multiplicador máximo atingido!";
        costSpan.parentElement.style.display = 'none';
        itemContainer.querySelector('button').style.display = 'none';
    }
}

// --- LOJA: UPGRADE DA DURAÇÃO DO BISCOITO DOURADO ---
function buyGoldenDurationUpgrade() {
    if (goldenDurationLevel >= goldenDurationTiers.length) {
        alert("Você já comprou o nível máximo deste upgrade!");
        return;
    }

    let currentTier = goldenDurationTiers[goldenDurationLevel];

    if (cookies >= currentTier.cost) {
        cookies -= currentTier.cost;
        goldenDurationSeconds = currentTier.duration;
        goldenDurationLevel++;

        updateGoldenDurationShop();
        updateDisplay();
    }
    else {
        alert("Você precisa de mais biscoitos!");
    }
}

function updateGoldenDurationShop() {
    const nameSpan = document.getElementById('golden-duration-name');
    const costSpan = document.getElementById('golden-duration-cost');
    const itemContainer = document.getElementById('buy-golden-duration-upgrade');

    if (goldenDurationLevel < goldenDurationTiers.length) {
        nameSpan.innerText = goldenDurationTiers[goldenDurationLevel].name;
        costSpan.innerText = goldenDurationTiers[goldenDurationLevel].cost;
    }
    else {
        nameSpan.innerText = "Tempo Infinito (Máximo)";
        itemContainer.querySelector('p').innerText = "Duração máxima atingida!";
        costSpan.parentElement.style.display = 'none';
        itemContainer.querySelector('button').style.display = 'none';
    }
}

// --- LOJA: TRANSMUTADOR DE MATÉRIA (UPGRADE FINAL) ---
function buyMatterTransmuter() {
    if (matterTransmuterBought) {
        alert("Você já comprou este upgrade final!");
        return;
    }

    if (cookies >= matterTransmuterCost) {
        cookies -= matterTransmuterCost;
        matterTransmuterBought = true;

        updateMatterTransmuterShop();
        updateDisplay();
    }
    else {
        alert("Você precisa de mais biscoitos!");
    }
}

function updateMatterTransmuterShop() {
    const nameSpan = document.getElementById('matter-transmuter-name');
    const costSpan = document.getElementById('matter-transmuter-cost');
    const itemContainer = document.getElementById('buy-matter-transmuter');

    if (matterTransmuterBought) {
        nameSpan.innerText = "Elefante Africano Transvesti Amarelo Berinjeludo (Comprado)";
        itemContainer.querySelector('p').innerText = "Poder cósmico desbloqueado!";
        costSpan.parentElement.style.display = 'none';
        itemContainer.querySelector('button').style.display = 'none';
    }
}

// --- SISTEMA DO BISCOITO DOURADO ---
function scheduleGoldenCookie() {
    const randomTime = Math.random() * 15000 + 15000; // Entre 15 e 30 segundos

    setTimeout(() => {
        spawnGoldenCookie();
    }, randomTime);
}

function spawnGoldenCookie() {
    const maxX = container.clientWidth - 90;
    const maxY = container.clientHeight - 90;

    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);

    goldenCookie.style.left = `${randomX}px`;
    goldenCookie.style.top = `${randomY}px`;

    goldenCookie.classList.remove('hidden');

    setTimeout(() => {
        if (!goldenCookie.classList.contains('hidden')) {
            goldenCookie.classList.add('hidden');
            scheduleGoldenCookie();
        }
    }, 5000);
}

goldenCookie.addEventListener('click', () => {
    goldenCookie.classList.add('hidden');

    temporaryMultiplier = goldenMultiplierValue; 
    bonusActive = true;
    document.querySelector('header').classList.add('bonus-active');

    let timeLeft = goldenDurationSeconds; 
    timeLeftSpan.innerText = timeLeft;
    goldenTimerP.classList.remove('hidden');

    clearInterval(goldenTimerInterval);
    clearTimeout(goldenTimeout);

    goldenTimerInterval = setInterval(() => {
        timeLeft--;
        timeLeftSpan.innerText = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(goldenTimerInterval);
        }
    }, 1000);

    goldenTimeout = setTimeout(() => {
        temporaryMultiplier = 1; 
        bonusActive = false;
        document.querySelector('header').classList.remove('bonus-active');
        goldenTimerP.classList.add('hidden');
        
        scheduleGoldenCookie();
    }, goldenDurationSeconds * 1000);
});

// --- LOOP DO JOGO ---
setInterval(() => {
    cookies += cookiesPerSecond / 10;
    updateDisplay();
}, 100);

// --- ATUALIZAÇÕES DA TELA ---
function updateDisplay() {
    cookieCountSpan.innerText = Math.floor(cookies);
    cpsCountSpan.innerText = cookiesPerSecond.toFixed(1);
}

function updateShopDisplay() {
    const costElement = document.querySelector('#buy-pointer .cost');
    if (costElement) {
        costElement.innerText = pointerCost;
    }
}

// Inicializações
updateDisplay();
updateShopDisplay();
updateGlovesShop();
updatePointerUpgradeShop();
updateGloveUpgradeShop();
updateGoldenMultShop();
updateGoldenDurationShop();
updateMatterTransmuterShop();
scheduleGoldenCookie();