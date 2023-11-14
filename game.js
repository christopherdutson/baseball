// --------------------------------------------------------------------------------------- //
// //////////////////////////////// Scripture Model ////////////////////////////////////// //
// --------------------------------------------------------------------------------------- //

class Verse {
    constructor(book, chapter, verse, text) {
        this.book = book;
        this.chaper = chapter;
        this.verse = verse;
        this.text = text;
    }

    getReference() {
        return `${this.book} ${this.chaper}:${this.verse}`;
    }
}

class BookOfMormon {
    constructor(verses, books, chapterMap) {
        this.verses = verses;
        this.books = books;
        this.chapterMap = chapterMap;
    }

    getRandomVerse() {
        return this.verses[Math.floor(Math.random() * this.verses.length)];
    }
}

// --------------------------------------------------------------------------------------- //
// ////////////////////////////////// Game Info ////////////////////////////////////////// //
// --------------------------------------------------------------------------------------- //

const game = {
    currentVerse: undefined,
    round: 0,
    correct: 0,
    strikes_left: 3,
    showBooks: true,
    language: 'english',
    selectedDifficulty: 'all-star',
}

// --------------------------------------------------------------------------------------- //
// ////////////////////////////////// Translator////////////////////////////////////////// //
// --------------------------------------------------------------------------------------- //

class Translator {
    constructor() {}
    
    get(token, options = []) {
        const rawString = languageMap[game.language][token] ?? languageMap[game.language]['error'] + token;
        if(options.length > 0) {
            let optionsIndex = 0
            let lastDivider = 0;
            let finalString = "";
            for (let i = 0; i < rawString.length; ++i) {
                if (rawString[i] == DIVIDER) {
                    finalString += rawString.substring(lastDivider, i);
                    lastDivider = i + 1;
                    finalString += options[optionsIndex];
                    optionsIndex += 1;
                }
            }
            finalString += rawString.substring(lastDivider);
            return finalString;
        }
        else {
            return rawString;
        }
    }
}

// --------------------------------------------------------------------------------------- //
//////////////////////////////////////// General ////////////////////////////////////////////
// --------------------------------------------------------------------------------------- //

const difficulties = {'rookie': 9, 'pro': 6, 'all-star': 3, 'flawless': 1};
const accentColors = {'rookie': '#ff9933', 'pro': '#ff66cc', 'all-star': '#00ffff', 'flawless': '#aaff00'};
const textColor = "var(--text-color)";
const primaryColor = "var(--primary-color)";
let divList = [];
let buttonFunction = setup;
let translator = undefined;
let bookOfMormon = undefined;

function setDivText(className, text) {
    document.getElementsByClassName(className)[0].innerHTML = text;
}

function setButton(func, text) {
    button = document.getElementsByClassName("button")[0];
    button.removeEventListener("click", buttonFunction);
    button.addEventListener("click", func);
    button.innerHTML = text;
    buttonFunction = func;
}

function makeDiv(name) {
    var div = document.createElement("div");
    div.style.padding = "2vh";
    div.style.border = `${textColor} solid 1px`;
    div.innerHTML = name;
    div.addEventListener("click", checkScripture)
    return div;
}

////////////////////////////////////// Start Page //////////////////////////////////////////

function newRound() {
    game.currentVerse = bookOfMormon.getRandomVerse();
    game.showBooks = true;
    game.round += 1;
    game.strikes_left = difficulties[game.selectedDifficulty];
    let roundMessage = translator.get('round_number', [game.round]);
    if (game.strikes_left > 1) {
        roundMessage += translator.get('strikes_left', [game.strikes_left]);
    }
    else {
        roundMessage += translator.get('one_strike_left');
    }
    setDivText("hint", roundMessage);
    showScripture();
}

function setup() {
    let verses = [];
    let books = [];
    let chapterMap = {};
    const bofmObject = scriptureMap[game.language];
    for (const chapterKey in bofmObject) {
        const chapter = bofmObject[chapterKey];
        const bookName = chapter.title.substring(0, chapter.title.lastIndexOf(" "));
        if (books.at(-1) != bookName) {
            books.push(bookName);
            chapterMap[bookName] = 0;
        }
        chapterMap[bookName] += 1;
        const chapterNum = parseInt(chapter.title.substring(chapter.title.lastIndexOf(" ") + 1));
        chapter.verses.forEach((verse) => {
            verses.push(new Verse(bookName, chapterNum, verse.number, verse.text));
        });
    }
    bookOfMormon = new BookOfMormon(verses, books, chapterMap);
    document.getElementById('hint').style.backgroundColor = primaryColor;
    newRound()
}

function selectDifficulty(event) {
    let prevDifficulty = document.getElementById(game.selectedDifficulty);
    prevDifficulty.style.backgroundColor = primaryColor;
    prevDifficulty.style.color = textColor;
    game.selectedDifficulty = event.target.id;
    event.target.style.backgroundColor = textColor;
    event.target.style.color = primaryColor;
    var r = document.querySelector(':root');
    r.style.setProperty('--accent-color', accentColors[game.selectedDifficulty]);
}

////////////////////////////////////// Scripture //////////////////////////////////////////

function showScripture() {
    setDivText("scripture", game.currentVerse.text);
    setButton(showGuess, translator.get('guess'));
}

function showGuess() {
    if (divList.length == 0) {
        if (game.showBooks) {
            divList = bookOfMormon.books.map((book) => makeDiv(book));
        }
        else {
            for (let i = 1; i <= bookOfMormon.chapterMap[game.currentVerse.book]; ++i) {
                divList.push(makeDiv(i));
            }
        }
    }
    let scripture = document.getElementById("scripture");
    scripture.innerHTML = "";
    divList.forEach((div) => scripture.appendChild(div));
    setButton(showScripture, translator.get('show_scripture'))
}

function strikesLeftMessage(isCorrectString, hint='') {
    let message = translator.get(isCorrectString) + hint;
    if (game.strikes_left > 1) {
        message += translator.get('strikes_left', [game.strikes_left]);
    }
    else {
        message += translator.get('one_strike_left');
    }
    setDivText("hint", message);
}

function wrongGuess(hint='') {
    game.strikes_left -= 1;
    if (game.strikes_left < 1) {
        setDivText("hint", translator.get('strike_out'));
        endRound()
    }
    else {
        strikesLeftMessage('incorrect', hint);
    }
}

function guessedCorrectBook() {
    game.showBooks = false;
    divList = [];
    setDivText("hint", translator.get("correct") + translator.get('guess_chapter'));
    showGuess();
}

function guessedCorrectChapter() {
    game.correct += 1;
    strikesLeftMessage('correct');
    endRound();
}

function disable(div) {
    div.removeEventListener("click", checkScripture);
    div.className = 'disabled';
}

function checkScripture(event) {
    let guess = event.target.innerText;
    if (game.showBooks) {
        if (game.currentVerse.book === guess) {
            guessedCorrectBook();
        }
        else {
            disable(event.target);
            wrongGuess();
        }
    }
    else {
        guess = parseInt(guess);
        if (game.currentVerse.chaper === guess) {
            guessedCorrectChapter();
        }
        else if (guess > game.currentVerse.chaper) {
            for (let i = guess - 1; i < divList.length && divList[i].className != "disabled"; ++i) {
                disable(divList[i]);
            }
            wrongGuess(translator.get('lower_hint', [guess])); 
        }
        else {
            for (let i = guess - 1; i >= 0 && divList[i].className != "disabled"; --i) {
                disable(divList[i]);
            }
            wrongGuess(translator.get('higher_hint', [guess]));
        }
    }
}

////////////////////////////////////// End Round //////////////////////////////////////////

function endRound() {
    divList = [];
    const options = [game.currentVerse.getReference(), game.correct, game.round, Math.round(100 * game.correct/game.round)];
    setDivText("scripture", translator.get('give_reference_and_score', options));
    setButton(newRound, translator.get('next_round'));
}

////////////////////////////////////// Initialize //////////////////////////////////////////

function changeLanguage(event) {
    let selectedLanguage = event.target.id;
    if (selectedLanguage !== game.language) {
        let prevLanguage = document.getElementById(game.language);
        prevLanguage.style.backgroundColor = primaryColor;
        prevLanguage.style.color = textColor;
        event.target.style.backgroundColor = textColor;
        event.target.style.color = primaryColor;
        game.language = selectedLanguage;
        document.getElementsByClassName("title")[0].innerHTML = translator.get('title');
        document.getElementsByClassName("description")[0].innerHTML = translator.get('instructions');
        for (const [diff, s] of Object.entries(difficulties)) {
            document.getElementById(diff).innerHTML = translator.get(diff);
        }
        document.getElementsByClassName("button")[0].innerHTML = translator.get('start');
    }
}

window.onload = function() {
    translator = new Translator();
    let startingDifficulty = document.getElementById(game.selectedDifficulty);
    startingDifficulty.style.backgroundColor = textColor;
    startingDifficulty.style.color = primaryColor;
    for (const language of Object.keys(languageMap)) {
        document.getElementById(language).addEventListener('click', changeLanguage);
    }
    let startingLanguage = document.getElementById(game.language);
    startingLanguage.style.backgroundColor = textColor;
    startingLanguage.style.color = primaryColor;
    for (const diff of Object.keys(difficulties)) {
        document.getElementById(diff).addEventListener('click', selectDifficulty);
    }
    document.getElementsByClassName("button")[0].addEventListener("click", setup);
};