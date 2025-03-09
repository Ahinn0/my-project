let wordList = [];
let quizMode = 1; // 기본값: 스펠링 암기

// 엑셀 파일 읽기
function loadFile() {
    const input = document.getElementById("fileInput");
    if (!input.files.length) return alert("엑셀 파일을 선택하세요!");

    const reader = new FileReader();
    reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        wordList = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        alert("파일 업로드 완료!");
        localStorage.setItem("wordList", JSON.stringify(wordList)); // 데이터 저장
    };
    reader.readAsArrayBuffer(input.files[0]);
}

// 퀴즈 시작
function startQuiz(mode) {
    quizMode = mode;
    localStorage.setItem("quizMode", quizMode);
    location.href = "quiz.html";
}

// 퀴즈 화면 로딩
function loadQuiz() {
    wordList = JSON.parse(localStorage.getItem("wordList")) || [];
    quizMode = localStorage.getItem("quizMode") || 1;

    if (!wordList.length) return alert("단어 목록이 없습니다!");

    const container = document.getElementById("quiz-container");
    container.innerHTML = "";

    wordList.forEach((row, index) => {
        if (index === 0) return; // 헤더 건너뜀
        const [word, meaning] = row;

        const question = document.createElement("div");
        question.innerHTML = `
            <p>${quizMode == 1 ? meaning : word}</p>
            <input type="text" id="answer-${index}">
        `;
        container.appendChild(question);
    });
}

// 제출 및 채점
function submitAnswers() {
    const results = [];
    let correctCount = 0;

    wordList.forEach((row, index) => {
        if (index === 0) return;
        const [word, meaning] = row;
        const answer = document.getElementById(`answer-${index}`).value.trim();
        const correctAnswer = quizMode == 1 ? word : meaning;

        if (answer.toLowerCase() === correctAnswer.toLowerCase()) {
            results.push(`${index}. (O) ${questionText} {${correctAnswer}`);
            correctCount++;
        } else {
            results.push(`${index}. (X) ${questionText} ${answer} -> ${correctAnswer}`);
        }
    });

    alert(`결과: ${correctCount} / ${wordList.length - 1}`);
    document.getElementById("quiz-container").innerHTML = results.join("<br>");
}

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("quiz-container")) {
        loadQuiz();
    }
});
