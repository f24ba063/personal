//データ読込処理
load();

//更新ボタン・全テキスト削除ボタンの設定
const update = document.getElementById('update');
const deleteButton = document.getElementById('delete');

//入力文字の削除ボタンの変数設定
const nameClear = document.getElementById('nameClear');
const furiganaClear = document.getElementById('furiganaClear');
const postClear = document.getElementById('postClear');
const addressClear = document.getElementById('addressClear');
const telClear = document.getElementById('telClear');
const mailClear = document.getElementById('mailClear');

//入力を受け取る変数設定
const NAME = document.getElementById('NAME');
const FURIGANA = document.getElementById('FURIGANA');
const POST = document.getElementById('POST');
const ADDRESS = document.getElementById('ADDRESS');
const TEL = document.getElementById('TEL');
const MAIL = document.getElementById('MAIL');

//入力不備の警告文の変数設定
const nameAlert = document.getElementById('nameAlert');
const furiganaAlert = document.getElementById('furiganaAlert');
const postAlert = document.getElementById('postAlert');
const addressAlert = document.getElementById('addressAlert');
const telAlert = document.getElementById('telAlert');
const mailAlert = document.getElementById('mailAlert');

// 更新ボタン押下時のポップアップの変数設定
const savePopup = document.getElementById('save-popup');
const deletePopup = document.getElementById('delete-popup');

//入力欄、削除ボタン、アラートのセット
const inputMap = [
    {input:NAME, clear:nameClear, alert:nameAlert},
    {input:FURIGANA, clear:furiganaClear, alert:furiganaAlert},
    {input:POST, clear:postClear, alert:postAlert},
    {input:ADDRESS, clear:addressClear, alert:addressAlert},
    {input:TEL, clear:telClear, alert:telAlert},
    {input:MAIL, clear:mailClear, alert:mailAlert},   
]

// ページ読み込み時の不正入力警告の不可視化処理
inputMap.forEach(({ alert }) => {
    alert.classList.add('hidden');
});

//個別のテキスト消去ボタン。ボタンを押すごとにテキストが消え、
//同時にアラートも消えてデータセーブも行われる
inputMap.forEach(({input, clear, alert}) => {
    clear.addEventListener('click', () => {
        input.value = "";
        alert.classList.add('hidden');
    });
    save();
});

//IME対応のイベント設定
inputMap.forEach(({input, alert}) => {
    let isComposing = false;

    input.addEventListener('compositionstart', () => {
        isComposing = true;
    });

    input.addEventListener('compositionend', () => {
        isComposing = false;
        CheckOnTouch(input, alert);
    });

    input.addEventListener('input', () => {
        if(!isComposing){
            CheckOnTouch(input,alert);
        }
    });

    input.addEventListener('blur', () => {
        CheckInBlur(input, alert);
    });
});

//テキストボックスが規定外の状態、または空白のままフォーカスを外したときの処理
//保存をしている
function CheckInBlur(input, alert){
    if(input.value === ""){
        alert.classList.remove('hidden');
        if(input.id === 'FURIGANA'){
            alert.textContent = '※ふりがなを入力してください';
        }else if(input.id === 'MAIL'){
            alert.textContent = '※メールアドレスを入力してください';
        }
    }else if(input.id === 'MAIL'){
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if(!regex.test(input.value)){
            alert.classList.remove('hidden');
            alert.textContent = '※メールアドレスの入力に誤りがあります';
        }else{
            alert.classList.add('hidden');
        }
    }else if(input.id =='POST' && input.value.length > 7){
        alert.classList.remove('hidden');
    }else{
        alert.classList.add('hidden');
    }
    save();
}

//ひらがな・郵便番号・電話番号・eメールに関してのバリデーション
function CheckOnTouch(input, alert){
    if(input.id === 'FURIGANA'){
        const clean = input.value.replace(/[^\u3040-\u309F]/g, '');
        if(input.value !== clean){
            input.value = clean;
        }
        alert.classList.add('hidden');
    }else if(input.id ==='POST'){
        input.value = input.value.replace(/[^\d]/g, '');
        if(input.value.length > 7){
            alert.classList.remove('hidden');
        }else{
            alert.classList.add('hidden');
        }
    }else if(input.id === 'TEL'){
        input.value = input.value.replace(/[^\d]/g, '');
        if(input.value.length > 11){
            alert.classList.remove('hidden');
            alert.textContent = '※半角数字10～11文字で入力してください';
        }else{
            alert.classList.add('hidden');
        }
    }
}

//「更新」「削除」ボタンに伴うポップアップの制御関数
function popupControl(popup){
    popup.classList.remove('hidden');
    popup.classList.add('show');

    const onAnimationEnd = () => {
        popup.classList.remove('show');
        popup.classList.add('hidden');
        popup.removeEventListener('animation', onAnimationEnd);
    };

    popup.addEventListener('animationend', onAnimationEnd);
};

//「削除」ボタン押下時の動き
deleteButton.addEventListener('click', () => {
    inputMap.forEach(({input, alert}) => {
        alert.classList.add('hidden');
        input.value = "";
    });
    popupControl(deletePopup);
    save();
});

//「更新」ボタン押下時の動き
update.addEventListener('click', () => {
    popupControl(savePopup);
    save();
});

//読み込み
function load(){
    const KEY = 'inputData';
    const strings = localStorage.getItem(KEY);
    if(!strings)return;

    const txt = JSON.parse(strings);
    const inputs = document.querySelectorAll("input");
    inputs.forEach(input  => {
        const nm = input.name;
        if(nm in txt){
            input.value = txt[nm];
        }
    });
};

//保存
function save(){
    const KEY = 'inputData';
    const personalData = {};
    const I = document.querySelectorAll("input");
    I.forEach(Input => {
        personalData[Input.name] = Input.value;
    });
    localStorage.setItem(KEY, JSON.stringify(personalData));
}