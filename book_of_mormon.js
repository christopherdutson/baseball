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
    constructor(verses, books) {
        this.verses = verses;
        this.books = books;
        // map of book names to chapter numbers
    }

    getRandomVerse() {
        return this.verses[Math.floor(Math.random() * this.verses.length)];
    }
}

// --------------------------------------------------------------------------------------- //
// ////////////////////////////////// Game Info ////////////////////////////////////////// //
// --------------------------------------------------------------------------------------- //

const game = {
    isEnglish: true,
    currentVerse: undefined,
    round: 0,
    correct: 0,
    strikes_left: 3,
    showBooks: true,
    selectedDifficulty: 'all-star',
}

// --------------------------------------------------------------------------------------- //
// ////////////////////////////////// Translator////////////////////////////////////////// //
// --------------------------------------------------------------------------------------- //

class Translator {
    constructor() {}
    
    get(token, options = []) {
        const rawString = languageMap[game.isEnglish][token] ?? languageMap[game.isEnglish]['error'];
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
//////////////////////////////////////// CODE ///////////////////////////////////////////////
// --------------------------------------------------------------------------------------- //

const difficulties = {'rookie': 9, 'pro': 6, 'all-star': 3, 'flawless': 1};
const accentColors = {'rookie': '#ff9933', 'pro': '#ff66cc', 'all-star': '#00ffff', 'flawless': '#aaff00'};
const textColor = "var(--text-color)";
const primaryColor = "var(--primary-color)";
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
    div.addEventListener("click", function(event) {
        checkScripture(name);
    })
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
    const bofmObject = game.isEnglish ? englishBookOfMormon : portugueseBookOfMormon;
    // get chapters here too
    for (const chapterKey in bofmObject) {
        const chapter = bofmObject[chapterKey];
        const bookName = chapter.title.substring(0, chapter.title.lastIndexOf(" "));
        if (books.at(-1) != bookName) {
            books.push(bookName);
        }
        const chapterNumber = parseInt(chapter.title.substring(chapter.title.lastIndexOf(" ") + 1));
        chapter.verses.forEach((verse) => {
            verses.push(new Verse(bookName, chapterNumber, verse.number, verse.text));
        });
    }
    bookOfMormon = new BookOfMormon(verses, books);
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

function showScripture(event=undefined) {
    setDivText("scripture", game.currentVerse.text);
    setButton(showGuess, translator.get('guess'));
}

function showGuess(event=undefined) {
    let scripture = document.getElementsByClassName("scripture")[0];
    scripture.innerHTML = "";
    if (game.showBooks) {
        bookOfMormon.books.forEach((book) => scripture.appendChild(makeDiv(book)));
    }
    else {
        for (let i = 1; i <= 63; ++i) {
            scripture.appendChild(makeDiv(i));
        }
    }
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
        setDivText("hint", translator.get('incorrect_final'));
        endRound()
    }
    else {
        strikesLeftMessage('incorrect', hint);
    }
}

function guessedCorrectBook() {
    game.showBooks = false;
    setDivText("hint", translator.get("correct") + translator.get('guess_chapter'));
    showGuess();
}

function guessedCorrectChapter() {
    game.correct = game.correct + 1;
    strikesLeftMessage('correct');
    endRound();
}

function checkScripture(guess) {
    if (game.showBooks && game.currentVerse.book === guess) {
        guessedCorrectBook();
    }
    else if (!game.showBooks) {
        if (game.currentVerse.chaper === guess) {
            guessedCorrectChapter();
        }
        else if (guess > game.currentVerse.chaper) {
            wrongGuess(translator.get('lower_hint', [guess])); 
        }
        else {
            wrongGuess(translator.get('higher_hint', [guess]));
        }
    }
    else {
        wrongGuess();
    }
}

////////////////////////////////////// End Round //////////////////////////////////////////

function endRound() {
    const options = [game.currentVerse.getReference(), game.correct, game.round, Math.round(100 * game.correct/game.round)];
    setDivText("scripture", translator.get('give_reference_and_score', options));
    setButton(newRound, translator.get('next_round'));
}

////////////////////////////////////// Initialize //////////////////////////////////////////

function changeLanguage() {
    game.isEnglish = !game.isEnglish;
    document.getElementsByClassName("title")[0].innerHTML = translator.get('title');
    document.getElementById("hint").innerHTML = translator.get('welcome');
    document.getElementsByClassName("description")[0].innerHTML = translator.get('instructions');
    for (const [diff, s] of Object.entries(difficulties)) {
        document.getElementById(diff).innerHTML = translator.get(diff);
    }
    document.getElementById("language").innerHTML = translator.get('language');
    document.getElementsByClassName("button")[0].innerHTML = translator.get('start');
}

window.onload = function() {
    translator = new Translator();
    let startingDifficulty = document.getElementById('all-star');
    startingDifficulty.style.backgroundColor = textColor;
    startingDifficulty.style.color = primaryColor;
    for (const [diff, s] of Object.entries(difficulties)) {
        document.getElementById(diff).addEventListener('click', selectDifficulty);
    }
    document.getElementById("language").addEventListener('click', changeLanguage);
    document.getElementsByClassName("button")[0].addEventListener("click", setup);
};