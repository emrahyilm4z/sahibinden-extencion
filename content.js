const keywords = [

    "değişen", "degisen", "değişmiş", "degismis",
    "boyalı", "boyali", "lokal boya", "komple boya",
    "hasarlı", "hasarli",
    "hasar kaydı", "hasar kaydi",
    "tramer", "tramer kaydı", "tramer kaydi",
    "ağır hasar", "agir hasar", "ağır hasar kayıtlı", "agir hasar kayitli",
    "pert", "pert kayıtlı", "pert kayitli",
    "pert total", "pertten toplama",
    "hurda kayıtlı", "hurda kayitli",

    "şase", "sase",
    "şase işlemli", "sase islemli",
    "şase düzeltme", "sase duzeltme",
    "şase kaynak", "sase kaynak",
    "şase hasarlı", "sase hasarli",
    "podye", "podya", "podia",
    "şasi podye işlemli", "sasi podye islemli",
    "direk işlemli", "direk hasarlı",
    "tavan işlemli", "tavan hasarlı",
    "tavan kesilmiş", "tavan değişmiş",
    "şase ucu işlemli",

    "airbag işlemli", "air bag işlemli", "airbag islemli",
    "airbag açmış", "airbag açmis",
    "airbag patlak",
    "airbag iptal",
    "airbag tamir",
    "airbag değişmiş",
    "airbag dirençli", "direnç takılmış airbag",

    "kazalı", "kazali",
    "ağır kazalı", "agir kazali",
    "takla", "taklalı", "taklali",
    "önden darbe", "arkadan darbe",
    "yan darbe",
    "şiddetli çarpma",
    "kaza geçmişi",

    "kaput değişmiş", "kaput degismis",
    "çamurluk değişmiş", "camurluk degismis",
    "bagaj değişmiş", "bagaj degismis",
    "tavan değişmiş", "tavan degismis",
    "direk değişmiş",
    "panel değişmiş",
    "ön panel işlemli",
    "arka panel işlemli",
    "motor değişmiş",
    "şanzıman değişmiş",

    "sök tak", "sok tak",
    "sökülüp takılmış",
    "kesme biçme", "kesilmiş",
    "kaynak yapılmış",
    "macunlu",
    "dolgu",
    "göçük", "gocuk",
    "boyasız göçük düzeltme",

    "su almış", "su almis",
    "sel hasarlı", "sel hasarli",
    "yanık", "yanmis",
    "yangın hasarlı", "yangin hasarli",

    "motor yapılmış", "motor yapilmis",
    "revizyonlu motor",
    "rekfiye", "rektifiye",
    "şanzıman arızalı",
    "motor arızalı",

    "kasa değişmiş",
    "plaka değişmiş",
    "şase numarası işlemli",
    "şase numarası kazınmış",
    "ekspertiz önerilir",
    "exper raporu yok",
    "sigorta şişirmesi",
    "pert kayıt silindi",
    "kayıtsız kaza",
    "toplama araç",

];


let matchElements = [];
let currentMatchIndex = -1;

function checkPageContent(descriptionElement) {
    let currentHtml = descriptionElement.innerHTML;
    let foundKeywords = [];

    const sortedKeywords = [...keywords].sort((a, b) => b.length - a.length);

    for (let word of sortedKeywords) {
        const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        const regex = new RegExp(`(${escapedWord})(?![^<]*>)`, 'gi');

        if (regex.test(currentHtml)) {
            if (!foundKeywords.includes(word)) {
                foundKeywords.push(word);
            }
            currentHtml = currentHtml.replace(regex, `<span class="car-criteria-highlight">$1</span>`);
        }
    }

    if (foundKeywords.length > 0) {
        descriptionElement.innerHTML = currentHtml;
        showWarning(foundKeywords);

        matchElements = document.querySelectorAll('.car-criteria-highlight');
        currentMatchIndex = -1;
    }
}

function showWarning(foundWords) {
    if (document.getElementById('car-criteria-warning')) return;

    const warningDiv = document.createElement('div');
    warningDiv.id = 'car-criteria-warning';

    const wordsText = foundWords.join(", ");

    warningDiv.innerHTML = `
        <div class="warning-container">
            <span class="warning-icon">⚠️</span>
            <div class="warning-message">
                <strong>DİKKAT!</strong> Bu ilanın açıklamasında riskli kelimeler bulundu: 
                <span class="warning-words">${wordsText}</span>
            </div>
            
            <div class="warning-actions">
                <div class="warning-nav">
                    <button id="nav-prev" title="Önceki kelimeye git">▲</button>
                    <button id="nav-next" title="Sonraki kelimeye git">▼</button>
                </div>
                <button id="close-warning">✖</button>
            </div>
        </div>
    `;

    document.body.prepend(warningDiv);

    document.getElementById('close-warning').addEventListener('click', () => {
        warningDiv.remove();
    });

    document.getElementById('nav-prev').addEventListener('click', () => {
        if (matchElements.length === 0) return;
        currentMatchIndex--;
        if (currentMatchIndex < 0) currentMatchIndex = matchElements.length - 1;
        scrollToMatch();
    });

    document.getElementById('nav-next').addEventListener('click', () => {
        if (matchElements.length === 0) return;
        currentMatchIndex++;
        if (currentMatchIndex >= matchElements.length) currentMatchIndex = 0;
        scrollToMatch();
    });
}

function scrollToMatch() {
    if (matchElements[currentMatchIndex]) {
        matchElements[currentMatchIndex].scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });

        matchElements.forEach(el => el.style.outline = 'none');
        matchElements[currentMatchIndex].style.outline = '3px solid #000';
        matchElements[currentMatchIndex].style.outlineOffset = '2px';
    }
}

let checkInterval = setInterval(() => {
    const descriptionElement = document.getElementById('classifiedDescription');

    if (descriptionElement && descriptionElement.innerText.trim().length > 0) {
        clearInterval(checkInterval);
        checkPageContent(descriptionElement);
    }
}, 500);

setTimeout(() => clearInterval(checkInterval), 15000);
