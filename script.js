/**
 * ==========================================
 * 1. 상태 및 설정 (State & Config)
 * ==========================================
 */
const STATE = {
    language: 'kr', // 기본 언어 설정 (kr: 한글, en: 영어)
    history: [],    // [New] 최근에 뽑은 명제들을 기억하는 저장소 (최대 3개)
};

/**
 * ==========================================
 * 2. 핵심 로직 (Core Logic)
 * ==========================================
 */

// 선택된 언어에 맞는 데이터베이스를 가져오는 함수
function getCurrentDatabase() {
    return (STATE.language === 'en') ? SAVANT_DATA_EN : SAVANT_DATA_KR;
}

// 데이터베이스에서 랜덤한 명제 하나를 뽑는 함수 (중복 방지 기능 추가됨)
function getRandomProposition() {
    const database = getCurrentDatabase();
    
    // 데이터가 비어있으면 에러 방지
    if (!database || database.length === 0) {
        return "데이터를 불러올 수 없습니다.";
    }

    let newProposition = "";
    let isDuplicate = true;
    let maxAttempts = 10; // 무한루프 방지용 안전장치 (10번 시도해도 중복이면 그냥 씀)

    // 중복이 아닐 때까지(또는 10번 시도할 때까지) 계속 뽑습니다.
    while (isDuplicate && maxAttempts > 0) {
        const randomIndex = Math.floor(Math.random() * database.length);
        newProposition = database[randomIndex];

        // 방금 뽑은 게 역사(history)에 있는지 확인합니다.
        // includes()는 목록에 그 내용이 있는지 검사하는 함수입니다.
        if (STATE.history.includes(newProposition)) {
            // "아, 이거 아까 나온 거네!" -> 다시 뽑기
            isDuplicate = true;
            maxAttempts--; // 시도 횟수 차감
        } else {
            // "오, 새로운 거네!" -> 통과
            isDuplicate = false;
        }
    }

    // [중요] 새로운 명제를 역사(history)에 기록합니다.
    updateHistory(newProposition);

    return newProposition;
}

// 최근 기록을 업데이트하는 함수
function updateHistory(proposition) {
    // 1. 새로운 명제를 기록장에 넣습니다.
    STATE.history.push(proposition);

    // 2. 만약 기억한 게 3개를 넘으면, 가장 오래된 것(맨 앞)을 지웁니다.
    if (STATE.history.length > 3) {
        STATE.history.shift(); // shift()는 배열의 첫 번째 요소를 제거합니다.
    }
    
    // (개발자용 확인) 현재 기억하고 있는 내용 출력
    console.log("현재 기억중인 명제들(중복방지):", STATE.history);
}

/**
 * ==========================================
 * 3. UI 제어 및 이벤트 핸들러 (UI Controller)
 * ==========================================
 */

function updateDisplay() {
    const propositionElement = document.getElementById('proposition-text');
    const newProposition = getRandomProposition();
    
    // 화면의 글자를 교체합니다.
    propositionElement.textContent = newProposition;
}

function changeLanguage(event) {
    STATE.language = event.target.value;
    
    // 언어가 바뀌면 기존 기록(history)을 초기화하는 게 좋습니다.
    // (한글 명제랑 영어 명제를 섞어서 기억하면 꼬일 수 있으니까요)
    STATE.history = []; 
    
    console.log(`언어 설정 변경: ${STATE.language} (기록 초기화됨)`);
    updateDisplay();
}

/**
 * ==========================================
 * 4. 초기화 (Initialization)
 * ==========================================
 */
function init() {
    const generateBtn = document.getElementById('generate-btn');
    const savantIcon = document.getElementById('savant-icon');
    const langSelect = document.getElementById('language-select');

    generateBtn.addEventListener('click', updateDisplay);
    savantIcon.addEventListener('click', updateDisplay);
    langSelect.addEventListener('change', changeLanguage);

    console.log("✅ 모든 기능(중복 방지 포함)이 준비되었습니다.");
}

// 초기화 실행
init();