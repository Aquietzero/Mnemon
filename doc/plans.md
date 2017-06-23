# Mnemon

A tool to create, manage cards and provides a way for better remember those cards.

## Card

A card has 3 faces. You can type anything on a card with the given structure provided by the selected card type.

### Card Structure

Principles:

+ Words, phrases and grammar points should always be remembered with context and comparison.
+ Only a proper amount of knowledge should be included. If there are too much content within a card, then nothing can be remember in the end.

+ Main part: it can be a word, a phrase or a grammar point.
+ Sub part: description or explanation of the main part.
+ Add ons: connection with other words, phrases or grammar points.
+ Memory aid: notes on how to remember the word.

## Basic functions

- Create and update cards.
- View and search all cards.
+ Auto connection suggestions while create or update cards.
- Basic memory flow and statistics.

- Keyword shortcuts to enhance the speed of creating cards.

## Leitner system

A basic spacing repetition method used by anki droid for cards memorization.

Setup seven periods of memory:

1. Repeat in 1 minute.
2. Repeat in 10 minutes.
3. Repeat in 1 day.
4. Repeat in 4 days.
5. Repeat in 10 days.
6. Repeat in a month.
7. Repeat in 3 months.

Basic information of a box:

    Box:
        User: user name or user id.
        Deck: deck id.
        Type: box type denotes the period of the repetition.
        Cards: an array store card id an insertion time of the card.

### Flow:

#### Pick up a card

1. Get boxes of the current user and deck.
2. Scan from the box with the lowest repetition time.
3. Compare card insertion time and box repetition time and the current time, if
    now > insertion time + repetition time
   then pick up the card. (of course the diff should be sorted.)

If the limit of daily new cards is specified, then only the limit of new cards should be drew from the box with lowest repetition time.

#### Put a card

1. Put in the box with current time according to the answer of user.

#### Deck page

Deck page is an important transition page from deck list to review flow. Since new cards will be continuously added to decks, so once user enters a specific deck, maybe that is a good timing for setup mnomons for new cards.

+ Display basic deck information, including card numbers, name and creating time.
+ Show whether the deck is under review or not.
+ If the deck is not under a review, show a button for review setup.
+ If the deck is under review, show numbers of cards in each stage.

#### Control hidden part of a card

Each card should be able to control the show and hide of each part.

### Think about grammar connection

Grammars with similar ideas should be grouped together. Differences between these grammars should be pointed out in detail.

### Think about adding tags in a simple way

Tag types:

+ word type
+ usage
+ meaning
+ reference

## Connection with other words or grammars

1. **When creating a card**: Connections can be added manually in the form of simple text.
2. **When loading a card**: Check to see whether each connection has a corresponding card. If yes, then also load the card, or just allow to click a link the connected card.
