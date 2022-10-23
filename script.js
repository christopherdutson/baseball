// document.getElementById("stockSubmit").addEventListener("click", function(event) {
//   event.preventDefault();
//   const value = document.getElementById("stockInput").value;
//   if (value === "")
//     return;
//   console.log(value);

//   data() {
//     return {
//       enterName: '',
//       isStarting: true,
//       onBook: true,
//       currentVerse: "",
//       currentBook: "",
//       currentChapter: "",
//       totalRounds: 0,
//       correctRounds: 0,
//       guessesLeft: 3,
//       currentRound: 9,
//       message: "",
//       showNext: false,
//       isFinished: false,
//     }
//   },
//   methods: {
//     randomVerse() {
//         let rand = Math.floor(Math.random() * 6604);
//         return this.$root.$data.verses[rand];
//     },
//     startGame() {
//       this.isStarting = false;
//       this.isFinished = false;
//       this.totalRounds = 0;
//       this.correctRounds = 0;
//       this.currentRound = 10;
//       this.startRound();
//     },
//     startRound() {
//       this.showNext = false;
//       --this.currentRound;
//       this.message = "";
//       this.currentVerse = this.randomVerse();
//       var verse = this.currentVerse.reference;
//       var lastWord = verse.lastIndexOf(" ");
//       this.currentBook = verse.substring(0, lastWord);
//       var colon = verse.lastIndexOf(":");
//       this.currentChapter = verse.substring(lastWord + 1, colon);
//       this.guessesLeft = 3;
//       this.onBook = true;
//     },
//     checkBook(book) {
//       if(book === this.currentBook) {
//         this.message = "Correct: " + book;
//         this.onBook = false;
//       }
//       else {
//         --this.guessesLeft;
//         if(this.guessesLeft === 0) {
//           this.message = "You're Out!";
//           this.finishRound();
//         }
//         else {
//           this.message = "Not " + book;
//         }
//       }
//     },
//     checkChapter(chapter) {
//       var correctChapter = parseInt(this.currentChapter);
//       if(chapter === correctChapter) {
//         this.message = "Correct!";
//         ++this.correctRounds;
//         this.finishRound();
//       }
//       else {
//         --this.guessesLeft;
//         if(this.guessesLeft === 0) {
//           this.message = "You're out!";
//           this.finishRound();
//         }
//         else if (correctChapter > chapter) {
//           this.message = "Higher than " + chapter;
//         }
//         else {
//           this.message = "Lower than " + chapter;
//         }
//       }
//     },
//     async saveScore() {
//       try {
//         let r1 = await axios.post('/api/scores', {
//           username: this.enterName,
//           score: this.correctRounds,
//         });
//         this.addScore = r1.data;
//       } catch (error) {
//         console.log(error);
//       }
//     },
//     finishRound() {
//       ++this.totalRounds;
//       this.showNext = true;
//       if(this.totalRounds == 9) {
//         this.isFinished = true;
//         this.saveScore();
//       }
//     },
//     done() {
//       this.isStarting = true;
//     }
//   }
// }