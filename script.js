/**
 * ==========================================
 * 1. 상태 및 설정 (State & Config)
 * ==========================================
 */
const STATE = {
    language: 'kr', 
    history: [],    
    // [이스터에그용 변수]
    clickCount: 0,
    clickTimer: null,
    isSuperFastMode: false
};

/**
 * ==========================================
 * 2. 핵심 로직 (Core Logic)
 * ==========================================
 */

function getCurrentDatabase() {
    return (STATE.language === 'en') ? SAVANT_DATA_EN : SAVANT_DATA_KR;
}

function getRandomProposition() {
    const database = getCurrentDatabase();
    
    if (!database || database.length === 0) {
        return "데이터를 불러올 수 없습니다.";
    }

    let newProposition = "";
    let isDuplicate = true;
    let maxAttempts = 10; 

    while (isDuplicate && maxAttempts > 0) {
        const randomIndex = Math.floor(Math.random() * database.length);
        newProposition = database[randomIndex];

        if (STATE.history.includes(newProposition)) {
            isDuplicate = true;
            maxAttempts--; 
        } else {
            isDuplicate = false;
        }
    }

    updateHistory(newProposition);
    return newProposition;
}

function updateHistory(proposition) {
    STATE.history.push(proposition);
    if (STATE.history.length > 3) {
        STATE.history.shift(); 
    }
    console.log("현재 기억중인 명제들:", STATE.history);
}

/**
 * ==========================================
 * 3. 이스터에그 로직 (Easter Egg)
 * ==========================================
 */
function handleIconClick() {
    // 1. 기본 기능: 명제 생성은 항상 수행
    updateDisplay();

    // 2. 이스터에그 로직
    const savantIcon = document.getElementById('savant-icon');
    const msgBox = document.getElementById('easter-egg-msg');

    // 이미 초고속 모드라면? -> 한 번 더 눌러서 해제
    if (STATE.isSuperFastMode) {
        STATE.isSuperFastMode = false;
        savantIcon.classList.remove('super-fast');
        console.log("이스터에그 종료: 정상 속도 복귀");
        return;
    }

    // 카운트 증가
    STATE.clickCount++;

    // 첫 클릭이라면 타이머 시작 (3초 뒤 초기화)
    if (STATE.clickCount === 1) {
        STATE.clickTimer = setTimeout(() => {
            STATE.clickCount = 0; // 시간 초과 시 카운트 리셋
        }, 3000); // 3000ms = 3초
    }

    // 5번 클릭 달성 시
    if (STATE.clickCount >= 5) {
        // 타이머 취소 및 카운트 리셋
        clearTimeout(STATE.clickTimer);
        STATE.clickCount = 0;
        
        // 이스터에그 발동!
        STATE.isSuperFastMode = true;
        savantIcon.classList.add('super-fast');
        
        // "너무 빨라..." 메시지 보여주기
        msgBox.classList.add('show');
        
        // 2초 뒤에 메시지만 사라지게 하기
        setTimeout(() => {
            msgBox.classList.remove('show');
        }, 2000);

        console.log("🚀 이스터에그 발동! 너무 빨라!");
    }
}

/**
 * ==========================================
 * 4. UI 제어 및 이벤트 핸들러
 * ==========================================
 */

function updateDisplay() {
    const propositionElement = document.getElementById('proposition-text');
    const newProposition = getRandomProposition();
    propositionElement.textContent = newProposition;
}

function changeLanguage(event) {
    STATE.language = event.target.value;
    STATE.history = []; 
    updateDisplay();
}

function init() {
    const generateBtn = document.getElementById('generate-btn');
    const savantIcon = document.getElementById('savant-icon');
    const langSelect = document.getElementById('language-select');

    generateBtn.addEventListener('click', updateDisplay);
    
    // 아이콘 클릭 시 이스터에그 핸들러 연결
    savantIcon.addEventListener('click', handleIconClick);

    langSelect.addEventListener('change', changeLanguage);

    console.log("✅ 모든 기능 + 이스터에그 준비 완료.");
}

init();