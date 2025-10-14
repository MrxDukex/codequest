# 🎓 Quiz System Documentation

## Overview

The quiz system tests your understanding of concepts after completing milestone challenges. It ensures you're actually learning, not just copying solutions!

## How It Works

### 1. Quiz Availability

- Quizzes automatically unlock after completing required challenges
- A notification pops up when a quiz becomes available
- You can also see available quizzes on the dashboard

### 2. Quiz Structure

Each quiz contains:

- **Multiple-choice questions** - Test conceptual understanding
- **Code challenges** - Test practical skills
- **Mixed difficulty** - Covers all required challenge topics

### 3. Passing Requirements

- **Passing Score:** 70% or higher
- **XP Reward:** Bonus XP for passing (50-75 XP depending on quiz)
- **Multiple Attempts:** You can retake quizzes

### 4. Failed Quiz System

If you score below 70%:

1. ✅ You see which questions you got wrong with explanations
2. ✅ System assigns **remedial challenges** to review
3. ✅ Must complete remedial challenges AFTER the failed attempt
4. ✅ Once complete, you can retake the quiz

This ensures you actually review the material before trying again!

## Available Quizzes

### HTML Quiz 1: Fundamentals

- **Unlocks after:** html-01, html-02, html-03, html-04, html-05
- **Topics:** HTML basics, headings, paragraphs, lists, links, images
- **Questions:** 5 (mix of multiple-choice and code)
- **XP Reward:** 50 XP
- **Remedial Challenges:** html-01, html-02, html-03

### HTML Quiz 2: Structure & Forms

- **Unlocks after:** html-06, html-07, html-08, html-09, html-10
- **Topics:** Forms, inputs, buttons, semantic HTML, divs
- **Questions:** 5
- **XP Reward:** 75 XP
- **Remedial Challenges:** html-06, html-07, html-08

### CSS Quiz 1: Basics

- **Unlocks after:** css-01, css-02, css-03, css-04, css-05
- **Topics:** CSS syntax, selectors, colors, fonts, text styling
- **Questions:** 5
- **XP Reward:** 50 XP
- **Remedial Challenges:** css-01, css-02, css-03

### CSS Quiz 2: Layout & Box Model

- **Unlocks after:** css-06, css-07, css-08, css-09, css-10
- **Topics:** Box model, padding, margin, flexbox, layouts
- **Questions:** 5
- **XP Reward:** 75 XP
- **Remedial Challenges:** css-06, css-07, css-08

### JavaScript Quiz 1: Fundamentals

- **Unlocks after:** js-01, js-02, js-03, js-04, js-05
- **Topics:** Variables, functions, data types, conditionals, operators
- **Questions:** 5
- **XP Reward:** 50 XP
- **Remedial Challenges:** js-01, js-02, js-03

## Quiz Features

### ✅ Question Types

1. **Multiple Choice**

   - 4 options (A, B, C, D)
   - Clear explanations after submission
   - One correct answer

2. **Code Challenges**
   - Write actual code to solve problems
   - Auto-graded with smart test functions
   - Can reset code if needed

### ✅ Review System

After submitting:

- See all questions with your answers
- View correct answers for wrong questions
- Read explanations for every question
- Understand WHY answers are correct

### ✅ Progress Tracking

- All attempts are saved
- Track your best score
- See improvement over time
- Quiz results sync across devices via Firebase

### ✅ Smart Remedial System

- Only counts challenges completed AFTER the failed quiz
- Can't "cheat" by having already done them
- Ensures fresh review of material

## Tips for Success

1. **Don't Rush** - Read questions carefully
2. **Review Before Taking** - Look over completed challenges first
3. **Learn from Mistakes** - Read all explanations, even for correct answers
4. **Practice Remedial Work** - If you fail, take the review seriously
5. **Retake for Better Scores** - Even after passing, you can retake for improvement

## File Structure

```
assets/js/
├── quizzes.js       # Quiz data and logic
├── quiz-ui.js       # UI handlers and view management
└── progress.js      # Updated with quiz tracking

assets/css/
└── main.css         # Updated with quiz styles

index.html           # Added quiz view section
```

## Data Storage

Quiz results are stored in `localStorage` under `codequest_progress`:

```javascript
{
  quizResults: {
    'html-quiz-1': {
      attempts: [
        { date, score, passed, answers }
      ],
      passed: true/false,
      bestScore: 85,
      needsRemedial: false,
      remedialRequired: []
    }
  }
}
```

## Future Enhancements (Ideas)

- [ ] Add more quizzes for advanced topics
- [ ] Timed quiz mode for challenge
- [ ] Leaderboards for quiz scores
- [ ] Quiz streaks and achievements
- [ ] Randomized question order
- [ ] Question pools (random selection from larger set)
- [ ] Certificate generation for passing all quizzes

---

**Built on:** October 14, 2025
**Status:** ✅ Fully Functional
