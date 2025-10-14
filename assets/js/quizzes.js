// ===== QUIZ SYSTEM =====
// Quizzes appear after completing milestones to test understanding
// If failed, user gets remedial challenges before retaking

// Quiz structure: Multiple choice + code challenges mixed
function getQuizzes() {
  return {
    "html-quiz-1": {
      id: "html-quiz-1",
      title: "HTML Fundamentals Quiz",
      category: "HTML",
      description: "Test your understanding of basic HTML concepts",
      requiredChallenges: [
        "html-01",
        "html-02",
        "html-03",
        "html-04",
        "html-05",
      ],
      passingScore: 70, // percentage
      xpReward: 50,
      questions: [
        {
          id: "hq1-1",
          type: "multiple-choice",
          question: "What does HTML stand for?",
          options: [
            "Hyper Text Markup Language",
            "High Tech Modern Language",
            "Home Tool Markup Language",
            "Hyperlinks and Text Markup Language",
          ],
          correctAnswer: 0,
          explanation:
            "HTML stands for HyperText Markup Language. It's the standard language for creating web pages.",
        },
        {
          id: "hq1-2",
          type: "multiple-choice",
          question: "Which tag is used for the largest heading?",
          options: ["<h6>", "<heading>", "<h1>", "<head>"],
          correctAnswer: 2,
          explanation:
            "<h1> creates the largest heading. Headings go from <h1> (largest) to <h6> (smallest).",
        },
        {
          id: "hq1-3",
          type: "code",
          question: "Create a paragraph that says 'I love coding!'",
          starterCode: "<!-- Write your code here -->\n",
          correctAnswer: "<p>I love coding!</p>",
          testFunction: (code) => {
            return (
              code.includes("<p>") &&
              code.includes("</p>") &&
              code.toLowerCase().includes("i love coding")
            );
          },
          explanation:
            "Paragraphs use the <p> tag. The text goes between the opening and closing tags.",
        },
        {
          id: "hq1-4",
          type: "multiple-choice",
          question: "What's the correct way to create a link?",
          options: [
            "<link>Click here</link>",
            "<a href='url'>Click here</a>",
            "<url>Click here</url>",
            "<hyperlink>Click here</hyperlink>",
          ],
          correctAnswer: 1,
          explanation:
            "Links use the <a> (anchor) tag with an href attribute containing the URL.",
        },
        {
          id: "hq1-5",
          type: "code",
          question:
            "Create an unordered list with 2 items: 'Apple' and 'Banana'",
          starterCode: "<!-- Write your code here -->\n",
          correctAnswer: "<ul>\n  <li>Apple</li>\n  <li>Banana</li>\n</ul>",
          testFunction: (code) => {
            return (
              code.includes("<ul>") &&
              code.includes("</ul>") &&
              code.includes("<li>") &&
              code.match(/<li>/g).length >= 2 &&
              (code.toLowerCase().includes("apple") ||
                code.toLowerCase().includes("banana"))
            );
          },
          explanation:
            "Unordered lists use <ul> as the container and <li> for each list item.",
        },
      ],
      remedialChallenges: ["html-01", "html-02", "html-03"], // Challenges to review if failed
    },

    "html-quiz-2": {
      id: "html-quiz-2",
      title: "HTML Structure & Forms Quiz",
      category: "HTML",
      description:
        "Test your knowledge of HTML structure, forms, and semantic elements",
      requiredChallenges: [
        "html-06",
        "html-07",
        "html-08",
        "html-09",
        "html-10",
      ],
      passingScore: 70,
      xpReward: 75,
      questions: [
        {
          id: "hq2-1",
          type: "multiple-choice",
          question: "Which tag creates a clickable button?",
          options: ["<btn>", "<button>", "<click>", "<input>"],
          correctAnswer: 1,
          explanation: "The <button> tag creates a clickable button element.",
        },
        {
          id: "hq2-2",
          type: "code",
          question:
            "Create a text input field with placeholder 'Enter your name'",
          starterCode: "<!-- Write your code here -->\n",
          correctAnswer: '<input type="text" placeholder="Enter your name">',
          testFunction: (code) => {
            return (
              code.includes("<input") &&
              code.includes('type="text"') &&
              code.toLowerCase().includes("placeholder")
            );
          },
          explanation:
            "Input fields use <input> with type='text' and can have a placeholder attribute.",
        },
        {
          id: "hq2-3",
          type: "multiple-choice",
          question:
            "What's the purpose of semantic HTML tags like <article>, <nav>, <footer>?",
          options: [
            "They make the page load faster",
            "They add style to the page",
            "They give meaning and structure to content",
            "They are required by browsers",
          ],
          correctAnswer: 2,
          explanation:
            "Semantic tags give meaning to content, helping browsers, screen readers, and search engines understand the page structure.",
        },
        {
          id: "hq2-4",
          type: "code",
          question: "Create a div with class 'container'",
          starterCode: "<!-- Write your code here -->\n",
          correctAnswer: '<div class="container"></div>',
          testFunction: (code) => {
            return (
              code.includes("<div") &&
              code.includes("class") &&
              code.includes("container")
            );
          },
          explanation:
            "Divs are created with <div> and classes are added with the class attribute.",
        },
        {
          id: "hq2-5",
          type: "multiple-choice",
          question: "Which attribute makes an input field required?",
          options: [
            "mandatory='true'",
            "required",
            "necessary='yes'",
            "validate='required'",
          ],
          correctAnswer: 1,
          explanation:
            "The 'required' attribute (no value needed) makes an input field mandatory.",
        },
      ],
      remedialChallenges: ["html-06", "html-07", "html-08"],
    },

    "css-quiz-1": {
      id: "css-quiz-1",
      title: "CSS Basics Quiz",
      category: "CSS",
      description:
        "Test your understanding of CSS selectors, properties, and styling",
      requiredChallenges: ["css-01", "css-02", "css-03", "css-04", "css-05"],
      passingScore: 70,
      xpReward: 50,
      questions: [
        {
          id: "cq1-1",
          type: "multiple-choice",
          question: "What does CSS stand for?",
          options: [
            "Computer Style Sheets",
            "Cascading Style Sheets",
            "Creative Style System",
            "Colorful Style Sheets",
          ],
          correctAnswer: 1,
          explanation:
            "CSS stands for Cascading Style Sheets. It's used to style and layout web pages.",
        },
        {
          id: "cq1-2",
          type: "code",
          question: "Write CSS to make all paragraphs blue",
          starterCode: "/* Write your CSS here */\n",
          correctAnswer: "p { color: blue; }",
          testFunction: (code) => {
            return (
              code.includes("p") &&
              code.includes("color") &&
              code.includes("blue")
            );
          },
          explanation:
            "Use the element selector 'p' and set the color property to blue.",
        },
        {
          id: "cq1-3",
          type: "multiple-choice",
          question: "Which selector targets an element with id='header'?",
          options: [".header", "#header", "*header", "header"],
          correctAnswer: 1,
          explanation:
            "The # symbol is used to select elements by their ID. So #header selects id='header'.",
        },
        {
          id: "cq1-4",
          type: "code",
          question:
            "Write CSS to give an element with class 'box' a red background",
          starterCode: "/* Write your CSS here */\n",
          correctAnswer: ".box { background-color: red; }",
          testFunction: (code) => {
            return (
              code.includes(".box") &&
              code.includes("background") &&
              code.includes("red")
            );
          },
          explanation:
            "Use the class selector '.box' and set background-color to red.",
        },
        {
          id: "cq1-5",
          type: "multiple-choice",
          question: "Which property controls the text size?",
          options: ["text-size", "font-size", "text-style", "size"],
          correctAnswer: 1,
          explanation: "The 'font-size' property controls the size of text.",
        },
      ],
      remedialChallenges: ["css-01", "css-02", "css-03"],
    },

    "css-quiz-2": {
      id: "css-quiz-2",
      title: "CSS Layout & Box Model Quiz",
      category: "CSS",
      description:
        "Test your knowledge of CSS layout, flexbox, and the box model",
      requiredChallenges: ["css-06", "css-07", "css-08", "css-09", "css-10"],
      passingScore: 70,
      xpReward: 75,
      questions: [
        {
          id: "cq2-1",
          type: "multiple-choice",
          question:
            "What does the box model consist of (from inside to outside)?",
          options: [
            "margin, border, padding, content",
            "content, padding, border, margin",
            "padding, content, margin, border",
            "border, padding, content, margin",
          ],
          correctAnswer: 1,
          explanation:
            "The box model goes: content (center) → padding → border → margin (outside).",
        },
        {
          id: "cq2-2",
          type: "code",
          question:
            "Use flexbox to center content both horizontally and vertically",
          starterCode:
            ".container {\n  display: flex;\n  /* Add your code here */\n}",
          correctAnswer:
            ".container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}",
          testFunction: (code) => {
            return (
              code.includes("display: flex") &&
              code.includes("justify-content") &&
              code.includes("align-items") &&
              code.includes("center")
            );
          },
          explanation:
            "Use display: flex with justify-content: center (horizontal) and align-items: center (vertical).",
        },
        {
          id: "cq2-3",
          type: "multiple-choice",
          question:
            "Which property adds space INSIDE an element between content and border?",
          options: ["margin", "padding", "spacing", "gap"],
          correctAnswer: 1,
          explanation:
            "Padding adds space inside an element. Margin adds space outside.",
        },
        {
          id: "cq2-4",
          type: "code",
          question:
            "Write CSS to make an element 200px wide with 10px padding on all sides",
          starterCode: "/* Write your CSS here */\n",
          correctAnswer: "width: 200px;\npadding: 10px;",
          testFunction: (code) => {
            return (
              code.includes("width") &&
              code.includes("200") &&
              code.includes("padding") &&
              code.includes("10")
            );
          },
          explanation:
            "Use 'width: 200px;' for width and 'padding: 10px;' for padding on all sides.",
        },
        {
          id: "cq2-5",
          type: "multiple-choice",
          question: "What does 'display: none;' do?",
          options: [
            "Makes element transparent",
            "Removes element from page completely",
            "Hides element but keeps its space",
            "Makes element very small",
          ],
          correctAnswer: 1,
          explanation:
            "display: none removes the element from the page flow entirely. Use visibility: hidden to keep the space.",
        },
      ],
      remedialChallenges: ["css-06", "css-07", "css-08"],
    },

    "js-quiz-1": {
      id: "js-quiz-1",
      title: "JavaScript Fundamentals Quiz",
      category: "JavaScript",
      description:
        "Test your understanding of JavaScript basics, variables, and functions",
      requiredChallenges: ["js-01", "js-02", "js-03", "js-04", "js-05"],
      passingScore: 70,
      xpReward: 50,
      questions: [
        {
          id: "jq1-1",
          type: "multiple-choice",
          question:
            "Which keyword is used to declare a variable that can be changed?",
          options: ["const", "let", "var", "Both let and var"],
          correctAnswer: 3,
          explanation:
            "'let' and 'var' both create changeable variables, but 'let' is recommended in modern JavaScript.",
        },
        {
          id: "jq1-2",
          type: "code",
          question:
            "Create a variable called 'name' with the value 'CodeQuest'",
          starterCode: "// Write your code here\n",
          correctAnswer: "let name = 'CodeQuest';",
          testFunction: (code) => {
            return (
              (code.includes("let") ||
                code.includes("const") ||
                code.includes("var")) &&
              code.includes("name") &&
              code.includes("CodeQuest")
            );
          },
          explanation:
            "Use 'let name = \"CodeQuest\";' to create a variable with a string value.",
        },
        {
          id: "jq1-3",
          type: "multiple-choice",
          question: "What will console.log(2 + '2') output?",
          options: ["4", "22", "Error", "undefined"],
          correctAnswer: 1,
          explanation:
            "JavaScript converts the number 2 to a string and concatenates them, resulting in '22'.",
        },
        {
          id: "jq1-4",
          type: "code",
          question: "Write a function called 'greet' that returns 'Hello'",
          starterCode: "// Write your code here\n",
          correctAnswer: "function greet() {\n  return 'Hello';\n}",
          testFunction: (code) => {
            return (
              code.includes("function") &&
              code.includes("greet") &&
              code.includes("return") &&
              code.includes("Hello")
            );
          },
          explanation:
            "Functions are declared with 'function name() { }' and use 'return' to give back a value.",
        },
        {
          id: "jq1-5",
          type: "multiple-choice",
          question: "What's the correct way to write an if statement?",
          options: [
            "if x > 5 then",
            "if (x > 5) { }",
            "if x > 5:",
            "if [x > 5] { }",
          ],
          correctAnswer: 1,
          explanation:
            "JavaScript if statements use parentheses for the condition and curly braces for the code block.",
        },
      ],
      remedialChallenges: ["js-01", "js-02", "js-03"],
    },
  };
}

// Check if user should take a quiz
function checkForQuiz() {
  const progress = getProgress();
  const quizzes = getQuizzes();

  for (const [quizId, quiz] of Object.entries(quizzes)) {
    // Skip if already passed
    if (progress.quizResults && progress.quizResults[quizId]?.passed) {
      continue;
    }

    // Check if all required challenges are completed
    const allCompleted = quiz.requiredChallenges.every((challengeId) =>
      progress.completedChallenges.includes(challengeId)
    );

    // Check if quiz hasn't been shown yet
    const notShown =
      !progress.quizResults || !progress.quizResults[quizId]?.shown;

    if (allCompleted && notShown) {
      return quiz; // Return the quiz to take
    }
  }

  return null; // No quiz available
}

// Mark quiz as shown (so it doesn't pop up again immediately)
function markQuizShown(quizId) {
  const progress = getProgress();
  if (!progress.quizResults) {
    progress.quizResults = {};
  }
  if (!progress.quizResults[quizId]) {
    progress.quizResults[quizId] = {};
  }
  progress.quizResults[quizId].shown = true;
  saveProgress(progress);
}

// Save quiz results
function saveQuizResult(quizId, score, answers, passed) {
  const progress = getProgress();

  if (!progress.quizResults) {
    progress.quizResults = {};
  }

  if (!progress.quizResults[quizId]) {
    progress.quizResults[quizId] = { attempts: [] };
  }

  const attempt = {
    date: new Date().toISOString(),
    score: score,
    passed: passed,
    answers: answers,
  };

  progress.quizResults[quizId].attempts.push(attempt);
  progress.quizResults[quizId].passed = passed;
  progress.quizResults[quizId].bestScore = Math.max(
    progress.quizResults[quizId].bestScore || 0,
    score
  );

  // If failed, lock next challenges until remedial work is done
  if (!passed) {
    const quiz = getQuizzes()[quizId];
    progress.quizResults[quizId].needsRemedial = true;
    progress.quizResults[quizId].remedialRequired = quiz.remedialChallenges;
  }

  saveProgress(progress);
  return progress;
}

// Check if user can take quiz (not blocked by remedial work)
function canTakeQuiz(quizId) {
  const progress = getProgress();

  if (!progress.quizResults || !progress.quizResults[quizId]) {
    return true; // First attempt
  }

  const quizResult = progress.quizResults[quizId];

  // If already passed, can retake for better score
  if (quizResult.passed) {
    return true;
  }

  // If needs remedial work, check if completed
  if (quizResult.needsRemedial && quizResult.remedialRequired) {
    const remedialDone = quizResult.remedialRequired.every((challengeId) => {
      // Check if challenge was completed AFTER the last failed quiz attempt
      const lastAttempt = quizResult.attempts[quizResult.attempts.length - 1];
      const challengeState = progress.challengeStates[challengeId];

      return (
        challengeState &&
        challengeState.completedAt &&
        new Date(challengeState.completedAt) > new Date(lastAttempt.date)
      );
    });

    return remedialDone;
  }

  return true;
}

// Get quiz progress message
function getQuizStatusMessage(quizId) {
  const progress = getProgress();

  if (!progress.quizResults || !progress.quizResults[quizId]) {
    return "Ready to take quiz!";
  }

  const result = progress.quizResults[quizId];

  if (result.passed) {
    return `✅ Passed with ${result.bestScore}%`;
  }

  if (result.needsRemedial && result.remedialRequired) {
    const remaining = result.remedialRequired.filter((challengeId) => {
      const lastAttempt = result.attempts[result.attempts.length - 1];
      const challengeState = progress.challengeStates[challengeId];
      return (
        !challengeState ||
        !challengeState.completedAt ||
        new Date(challengeState.completedAt) <= new Date(lastAttempt.date)
      );
    });

    if (remaining.length > 0) {
      return `📚 Complete ${remaining.length} review challenge(s) to retake`;
    }
  }

  return `Last score: ${
    result.attempts[result.attempts.length - 1].score
  }% - Try again!`;
}
