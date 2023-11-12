// Character in strings that can be replaced by optional inputs (options array)
DIVIDER = '*';

english = {
    // Title
    'title': "BOOK OF MORMON BASEBALL",
    // Headers
    'round_number': `Round ${DIVIDER}. `,
    'correct': "Correct! ",
    'guess_chapter': "Now guess the chapter.",
    'incorrect': "Incorrect. ",
    'lower_hint': `Lower than ${DIVIDER}! `,
    'higher_hint': `Higher than ${DIVIDER}! `,
    'strikes_left': `${DIVIDER} strikes left.`,
    'one_strike_left': `1 strike left.`,
    'strike_out': "You're out!",
    // Scripture Section
    'instructions': "How to play: A random verse from the Book of Mormon is given. Guess the correct book and chapter it's found in before you strike out!",
    'give_reference_and_score': `The verse was ${DIVIDER}.<br><br>Your score is ${DIVIDER}/${DIVIDER} (${DIVIDER}%)`,
    // Difficulties
    'rookie': "Rookie: 9 Strikes",
    'pro': "Pro: 6 Strikes",
    'all-star': "All-Star: 3 Strikes",
    'flawless': "Flawless: 1 Strike",
    // Button Labels
    'start': "Start Game",
    'guess': "Guess",
    'show_scripture': "Show Scripture",
    'next_round': "Next Round",
    // Error
    'error': "Error: unable to translate",
}

portuguese = {
    // Title
    'title': 'BEISEBOL DO LIVRO DE MORMON',
    // Headers
    'round_number': `Vez ${DIVIDER}. `,
    'correct': "Correto! ",
    'guess_chapter': "Agora adivinhe o capítulo.",
    'incorrect': "Incorreto. ",
    'lower_hint': `Menor que ${DIVIDER}! `,
    'higher_hint': `Maior que ${DIVIDER}! `,
    'strikes_left': `${DIVIDER} tentativas restantes.`,
    'one_strike_left': `1 tentativa restante.`,
    'strike_out': "Você está sem palpites!",
    // Scripture Section
    'instructions': "Como jogar: É fornecido um versículo aleatório do Livro de Mórmon. Adivinhe o livro e o capítulo corretos antes que não haja mais palpites!",
    'give_reference_and_score': `O versículo era ${DIVIDER}.<br><br>Sua pontuação é ${DIVIDER}/${DIVIDER} (${DIVIDER}%)`,
    // Difficulties
    'rookie': "Novato: 9 Tentativa",
    'pro': "Pró: 6 Tentativa",
    'all-star': "Todas as Estrelas: 3 Tentativa",
    'flawless': "Perfeito: 1 Tentativa",
    // Button Labels
    'start': "Começar o Jogo",
    'guess': "Adivinha",
    'show_scripture': "Mostra Escritura",
    'next_round': "Proxima Rodada",
    // Error
    'error': "Erro: não foi possível traduzir",
}

languageMap = {'english': english, 'portuguese': portuguese};
scriptureMap = {'english': englishBookOfMormon, 'portuguese': portugueseBookOfMormon};