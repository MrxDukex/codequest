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
            const liMatches = code.match(/<li>/gi);
            return (
              code.includes("<ul>") &&
              code.includes("</ul>") &&
              code.includes("<li>") &&
              liMatches &&
              liMatches.length >= 2 &&
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

    "html-quiz-3": {
      id: "html-quiz-3",
      title: "HTML Advanced Elements Quiz",
      category: "HTML",
      description:
        "Test your knowledge of advanced HTML elements and structure",
      requiredChallenges: [
        "html-11",
        "html-12",
        "html-13",
        "html-14",
        "html-15",
      ],
      passingScore: 70,
      xpReward: 75,
      questions: [
        {
          id: "hq3-1",
          type: "multiple-choice",
          question:
            "Which HTML5 element represents a self-contained composition?",
          options: ["<div>", "<article>", "<section>", "<container>"],
          correctAnswer: 1,
          explanation:
            "<article> represents a self-contained composition like a blog post or news story.",
        },
        {
          id: "hq3-2",
          type: "code",
          question: "Create a navigation menu using semantic HTML with 3 links",
          starterCode: "<!-- Write your code here -->\n",
          correctAnswer:
            '<nav>\n  <a href="#">Home</a>\n  <a href="#">About</a>\n  <a href="#">Contact</a>\n</nav>',
          testFunction: (code) => {
            return (
              code.includes("<nav>") &&
              code.includes("</nav>") &&
              code.includes("<a") &&
              (code.match(/<a/g) || []).length >= 3
            );
          },
          explanation:
            "Use <nav> for navigation menus with anchor tags <a> for links.",
        },
        {
          id: "hq3-3",
          type: "multiple-choice",
          question: "What's the purpose of the <main> element?",
          options: [
            "To create the main navigation",
            "To hold the dominant content of the page",
            "To create the header section",
            "To define the main stylesheet",
          ],
          correctAnswer: 1,
          explanation:
            "<main> contains the dominant content of the <body>, excluding headers, footers, and sidebars.",
        },
        {
          id: "hq3-4",
          type: "code",
          question: "Create a figure with an image and caption",
          starterCode: "<!-- Write your code here -->\n",
          correctAnswer:
            '<figure>\n  <img src="image.jpg" alt="Description">\n  <figcaption>Image caption</figcaption>\n</figure>',
          testFunction: (code) => {
            return (
              code.includes("<figure>") &&
              code.includes("<img") &&
              code.includes("<figcaption>")
            );
          },
          explanation:
            "<figure> groups media with <figcaption> for accessible image descriptions.",
        },
        {
          id: "hq3-5",
          type: "multiple-choice",
          question: "Which attribute makes an input field read-only?",
          options: ["locked", "readonly", "disabled", "fixed"],
          correctAnswer: 1,
          explanation:
            "The 'readonly' attribute prevents users from editing the field while still submitting its value.",
        },
      ],
      remedialChallenges: ["html-11", "html-12", "html-13"],
    },

    "html-quiz-4": {
      id: "html-quiz-4",
      title: "HTML Mastery Quiz",
      category: "HTML",
      description: "Advanced HTML concepts and best practices",
      requiredChallenges: [
        "html-16",
        "html-17",
        "html-18",
        "html-19",
        "html-20",
      ],
      passingScore: 70,
      xpReward: 75,
      questions: [
        {
          id: "hq4-1",
          type: "multiple-choice",
          question: "What's the difference between <section> and <div>?",
          options: [
            "No difference, they're the same",
            "<section> has semantic meaning, <div> doesn't",
            "<div> is newer than <section>",
            "<section> can't be styled with CSS",
          ],
          correctAnswer: 1,
          explanation:
            "<section> represents a thematic grouping with semantic meaning, while <div> is a generic container.",
        },
        {
          id: "hq4-2",
          type: "code",
          question: "Create a responsive video embed container using iframe",
          starterCode: "<!-- Write your code here -->\n",
          correctAnswer:
            '<div class="video-container">\n  <iframe src="video-url" title="Video" allowfullscreen></iframe>\n</div>',
          testFunction: (code) => {
            return (
              code.includes("<iframe") &&
              code.includes("src=") &&
              code.includes("</iframe>")
            );
          },
          explanation:
            "Use <iframe> for embedded content with src attribute and proper title for accessibility.",
        },
        {
          id: "hq4-3",
          type: "multiple-choice",
          question: "Which meta tag is essential for responsive design?",
          options: [
            "<meta charset='utf-8'>",
            "<meta name='viewport' content='width=device-width'>",
            "<meta name='author'>",
            "<meta name='keywords'>",
          ],
          correctAnswer: 1,
          explanation:
            "The viewport meta tag ensures proper rendering on mobile devices by setting the width to device width.",
        },
        {
          id: "hq4-4",
          type: "code",
          question: "Create an accessible table with headers for a price list",
          starterCode: "<!-- Write your code here -->\n",
          correctAnswer:
            "<table>\n  <thead>\n    <tr>\n      <th>Item</th>\n      <th>Price</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Product</td>\n      <td>$10</td>\n    </tr>\n  </tbody>\n</table>",
          testFunction: (code) => {
            return (
              code.includes("<table>") &&
              code.includes("<th>") &&
              code.includes("<thead>") &&
              code.includes("<tbody>")
            );
          },
          explanation:
            "Semantic tables use <thead>, <tbody>, and <th> elements for proper structure and accessibility.",
        },
        {
          id: "hq4-5",
          type: "multiple-choice",
          question: "What does the 'defer' attribute do on a <script> tag?",
          options: [
            "Delays script execution until page is fully loaded",
            "Executes script after HTML is parsed",
            "Prevents the script from running",
            "Makes the script run in the background",
          ],
          correctAnswer: 1,
          explanation:
            "'defer' downloads the script in parallel but executes it only after HTML parsing is complete.",
        },
      ],
      remedialChallenges: ["html-16", "html-17", "html-18"],
    },

    "html-final-exam": {
      id: "html-final-exam",
      title: "HTML Path Final Exam",
      category: "HTML",
      description:
        "Comprehensive exam covering all HTML concepts from this path",
      requiredChallenges: [
        "html-01",
        "html-02",
        "html-03",
        "html-04",
        "html-05",
        "html-06",
        "html-07",
        "html-08",
        "html-09",
        "html-10",
        "html-11",
        "html-12",
        "html-13",
        "html-14",
        "html-15",
        "html-16",
        "html-17",
        "html-18",
        "html-19",
        "html-20",
      ],
      requiredQuizzes: [
        "html-quiz-1",
        "html-quiz-2",
        "html-quiz-3",
        "html-quiz-4",
      ],
      passingScore: 75,
      xpReward: 150,
      questions: [
        {
          id: "hfe-1",
          type: "multiple-choice",
          question: "What's the correct order of heading importance?",
          options: [
            "<h6> is most important, <h1> is least",
            "<h1> is most important, <h6> is least",
            "All headings have equal importance",
            "It depends on the page style",
          ],
          correctAnswer: 1,
          explanation:
            "<h1> represents the most important heading, down to <h6> which is the least important.",
        },
        {
          id: "hfe-2",
          type: "code",
          question:
            "Create a complete contact form with name, email, message, and submit button",
          starterCode: "<!-- Write your HTML here -->\n",
          correctAnswer:
            '<form>\n  <label for="name">Name</label>\n  <input type="text" id="name" required>\n  \n  <label for="email">Email</label>\n  <input type="email" id="email" required>\n  \n  <label for="message">Message</label>\n  <textarea id="message" required></textarea>\n  \n  <button type="submit">Send</button>\n</form>',
          testFunction: (code) => {
            return (
              code.includes("<form>") &&
              code.includes('type="text"') &&
              code.includes('type="email"') &&
              code.includes("<textarea") &&
              code.includes("<button") &&
              code.includes("<label")
            );
          },
          explanation:
            "A proper form includes labels connected to inputs, appropriate input types, and a submit button.",
        },
        {
          id: "hfe-3",
          type: "multiple-choice",
          question: "Which elements are considered 'block-level' elements?",
          options: [
            "<span>, <a>, <strong>",
            "<div>, <p>, <section>",
            "<img>, <input>, <button>",
            "<br>, <hr>, <meta>",
          ],
          correctAnswer: 1,
          explanation:
            "Block-level elements like <div>, <p>, and <section> take up the full width available.",
        },
        {
          id: "hfe-4",
          type: "code",
          question:
            "Create a semantic article structure with header, main content, and footer",
          starterCode: "<!-- Write your HTML here -->\n",
          correctAnswer:
            "<article>\n  <header>\n    <h2>Article Title</h2>\n  </header>\n  <p>Main content here</p>\n  <footer>Published: 2024</footer>\n</article>",
          testFunction: (code) => {
            return (
              code.includes("<article>") &&
              code.includes("<header>") &&
              code.includes("<footer>") &&
              code.includes("</article>")
            );
          },
          explanation:
            "Semantic structure uses <article>, <header>, and <footer> for meaningful content organization.",
        },
        {
          id: "hfe-5",
          type: "multiple-choice",
          question: "What's the purpose of the 'alt' attribute on images?",
          options: [
            "To make images load faster",
            "To provide alternative text for accessibility",
            "To add a caption below the image",
            "To specify the image size",
          ],
          correctAnswer: 1,
          explanation:
            "The 'alt' attribute provides descriptive text for screen readers and when images fail to load.",
        },
        {
          id: "hfe-6",
          type: "code",
          question: "Create a navigation menu with 4 links using semantic HTML",
          starterCode: "<!-- Write your HTML here -->\n",
          correctAnswer:
            '<nav>\n  <a href="#home">Home</a>\n  <a href="#about">About</a>\n  <a href="#services">Services</a>\n  <a href="#contact">Contact</a>\n</nav>',
          testFunction: (code) => {
            return (
              code.includes("<nav>") && (code.match(/<a/g) || []).length >= 4
            );
          },
          explanation:
            "Navigation menus should use <nav> with anchor tags linking to different sections or pages.",
        },
        {
          id: "hfe-7",
          type: "multiple-choice",
          question:
            "Which HTML5 input type validates email format automatically?",
          options: [
            'type="text"',
            'type="email"',
            'type="mail"',
            'type="validate-email"',
          ],
          correctAnswer: 1,
          explanation:
            'type="email" provides built-in validation for email format in modern browsers.',
        },
        {
          id: "hfe-8",
          type: "code",
          question: "Create a definition list for a glossary with 2 terms",
          starterCode: "<!-- Write your HTML here -->\n",
          correctAnswer:
            "<dl>\n  <dt>HTML</dt>\n  <dd>HyperText Markup Language</dd>\n  <dt>CSS</dt>\n  <dd>Cascading Style Sheets</dd>\n</dl>",
          testFunction: (code) => {
            return (
              code.includes("<dl>") &&
              code.includes("<dt>") &&
              code.includes("<dd>")
            );
          },
          explanation:
            "Definition lists use <dl> with <dt> for terms and <dd> for descriptions.",
        },
      ],
      remedialChallenges: [
        "html-01",
        "html-05",
        "html-10",
        "html-15",
        "html-20",
      ],
    },

    "css-quiz-3": {
      id: "css-quiz-3",
      title: "CSS Advanced Styling Quiz",
      category: "CSS",
      description:
        "Test your knowledge of advanced CSS properties and techniques",
      requiredChallenges: ["css-11", "css-12", "css-13", "css-14", "css-15"],
      passingScore: 70,
      xpReward: 75,
      questions: [
        {
          id: "cq3-1",
          type: "multiple-choice",
          question: "What does 'position: relative' do?",
          options: [
            "Positions element relative to viewport",
            "Positions element relative to its normal position",
            "Makes element float to the right",
            "Centers the element",
          ],
          correctAnswer: 1,
          explanation:
            "position: relative positions an element relative to where it would normally be, allowing offset adjustments.",
        },
        {
          id: "cq3-2",
          type: "code",
          question:
            "Create a CSS animation that fades in an element over 1 second",
          starterCode: "/* Write your CSS here */\n",
          correctAnswer:
            "@keyframes fadeIn {\n  from { opacity: 0; }\n  to { opacity: 1; }\n}\n.fade {\n  animation: fadeIn 1s;\n}",
          testFunction: (code) => {
            return (
              code.includes("@keyframes") &&
              code.includes("opacity") &&
              code.includes("animation:")
            );
          },
          explanation:
            "CSS animations use @keyframes to define the animation stages and animation property to apply it.",
        },
        {
          id: "cq3-3",
          type: "multiple-choice",
          question: "Which CSS property creates rounded corners?",
          options: [
            "corner-radius",
            "border-radius",
            "round-corner",
            "corner-style",
          ],
          correctAnswer: 1,
          explanation:
            "border-radius creates rounded corners on elements. Values can be in px, %, or other units.",
        },
        {
          id: "cq3-4",
          type: "code",
          question: "Write CSS to create a box shadow with blur effect",
          starterCode: "/* Write your CSS here */\n",
          correctAnswer:
            ".box {\n  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);\n}",
          testFunction: (code) => {
            return code.includes("box-shadow") && code.includes("rgba");
          },
          explanation:
            "box-shadow adds depth with syntax: horizontal vertical blur spread color.",
        },
        {
          id: "cq3-5",
          type: "multiple-choice",
          question:
            "What's the difference between 'visibility: hidden' and 'display: none'?",
          options: [
            "No difference, they do the same thing",
            "visibility: hidden keeps space, display: none doesn't",
            "display: none keeps space, visibility: hidden doesn't",
            "Both remove the element completely",
          ],
          correctAnswer: 1,
          explanation:
            "visibility: hidden hides the element but keeps its space. display: none removes it from the layout entirely.",
        },
      ],
      remedialChallenges: ["css-11", "css-12", "css-13"],
    },

    "css-quiz-4": {
      id: "css-quiz-4",
      title: "CSS Mastery Quiz",
      category: "CSS",
      description:
        "Advanced CSS concepts including transforms and modern layouts",
      requiredChallenges: ["css-16", "css-17", "css-18", "css-19", "css-20"],
      passingScore: 70,
      xpReward: 75,
      questions: [
        {
          id: "cq4-1",
          type: "multiple-choice",
          question: "What does 'transform: scale(2)' do?",
          options: [
            "Moves element 2px",
            "Makes element twice as large",
            "Rotates element 2 degrees",
            "Creates 2 copies of the element",
          ],
          correctAnswer: 1,
          explanation:
            "transform: scale(2) makes an element twice its original size in both width and height.",
        },
        {
          id: "cq4-2",
          type: "code",
          question: "Create a CSS Grid with 3 equal columns and 20px gap",
          starterCode: "/* Write your CSS here */\n",
          correctAnswer:
            ".grid {\n  display: grid;\n  grid-template-columns: 1fr 1fr 1fr;\n  gap: 20px;\n}",
          testFunction: (code) => {
            return (
              code.includes("display: grid") &&
              code.includes("grid-template-columns") &&
              code.includes("gap") &&
              code.includes("1fr")
            );
          },
          explanation:
            "CSS Grid uses grid-template-columns with fr units for flexible columns and gap for spacing.",
        },
        {
          id: "cq4-3",
          type: "multiple-choice",
          question: "What's the purpose of 'z-index'?",
          options: [
            "Controls element size",
            "Controls stacking order of positioned elements",
            "Sets animation speed",
            "Defines grid columns",
          ],
          correctAnswer: 1,
          explanation:
            "z-index controls the vertical stacking order of positioned elements (relative, absolute, fixed).",
        },
        {
          id: "cq4-4",
          type: "code",
          question:
            "Create a media query that applies styles for screens under 768px",
          starterCode: "/* Write your CSS here */\n",
          correctAnswer:
            "@media (max-width: 768px) {\n  .container {\n    width: 100%;\n  }\n}",
          testFunction: (code) => {
            return (
              code.includes("@media") &&
              code.includes("max-width") &&
              code.includes("768")
            );
          },
          explanation:
            "Media queries use @media with conditions like max-width to apply styles based on screen size.",
        },
        {
          id: "cq4-5",
          type: "multiple-choice",
          question: "Which CSS property makes text uppercase?",
          options: [
            "text-style: uppercase",
            "text-transform: uppercase",
            "font-case: upper",
            "text-case: uppercase",
          ],
          correctAnswer: 1,
          explanation:
            "text-transform: uppercase converts all text to uppercase letters. Other values include lowercase and capitalize.",
        },
      ],
      remedialChallenges: ["css-16", "css-17", "css-18"],
    },

    "css-final-exam": {
      id: "css-final-exam",
      title: "CSS Path Final Exam",
      category: "CSS",
      description:
        "Comprehensive exam covering all CSS concepts from this path",
      requiredChallenges: [
        "css-01",
        "css-02",
        "css-03",
        "css-04",
        "css-05",
        "css-06",
        "css-07",
        "css-08",
        "css-09",
        "css-10",
        "css-11",
        "css-12",
        "css-13",
        "css-14",
        "css-15",
        "css-16",
        "css-17",
        "css-18",
        "css-19",
        "css-20",
      ],
      requiredQuizzes: ["css-quiz-1", "css-quiz-2", "css-quiz-3", "css-quiz-4"],
      passingScore: 75,
      xpReward: 150,
      questions: [
        {
          id: "cfe-1",
          type: "multiple-choice",
          question: "What's the correct CSS syntax structure?",
          options: [
            "selector: property { value }",
            "selector { property: value; }",
            "property { selector: value; }",
            "{ selector: property = value }",
          ],
          correctAnswer: 1,
          explanation:
            "CSS uses: selector { property: value; } with semicolons to separate declarations.",
        },
        {
          id: "cfe-2",
          type: "code",
          question:
            "Create a centered button with padding, rounded corners, and hover effect",
          starterCode: "/* Write your CSS here */\n",
          correctAnswer:
            ".button {\n  display: block;\n  margin: 0 auto;\n  padding: 12px 24px;\n  border-radius: 8px;\n  background: #007bff;\n  color: white;\n}\n.button:hover {\n  background: #0056b3;\n}",
          testFunction: (code) => {
            return (
              code.includes("padding") &&
              code.includes("border-radius") &&
              code.includes(":hover") &&
              code.includes("margin")
            );
          },
          explanation:
            "Combine display: block, margin: auto for centering, padding for space, and :hover for interactivity.",
        },
        {
          id: "cfe-3",
          type: "multiple-choice",
          question: "What's the CSS specificity order (lowest to highest)?",
          options: [
            "ID, Class, Element",
            "Element, Class, ID",
            "Class, ID, Element",
            "All have equal specificity",
          ],
          correctAnswer: 1,
          explanation:
            "CSS specificity hierarchy: Element selectors < Class selectors < ID selectors < Inline styles.",
        },
        {
          id: "cfe-4",
          type: "code",
          question:
            "Create a flexbox layout with items centered vertically and spaced evenly",
          starterCode: "/* Write your CSS here */\n",
          correctAnswer:
            ".container {\n  display: flex;\n  align-items: center;\n  justify-content: space-evenly;\n}",
          testFunction: (code) => {
            return (
              code.includes("display: flex") &&
              code.includes("align-items") &&
              code.includes("justify-content")
            );
          },
          explanation:
            "Flexbox uses align-items for vertical alignment and justify-content for horizontal distribution.",
        },
        {
          id: "cfe-5",
          type: "multiple-choice",
          question: "What does the 'rem' unit represent?",
          options: [
            "Relative to the element's font size",
            "Relative to the root (html) element's font size",
            "Relative to the parent element",
            "A fixed pixel value",
          ],
          correctAnswer: 1,
          explanation:
            "rem (root em) is relative to the root element's font size, making it consistent across the page.",
        },
        {
          id: "cfe-6",
          type: "code",
          question:
            "Create a CSS transition that animates all properties over 0.3 seconds",
          starterCode: "/* Write your CSS here */\n",
          correctAnswer: ".element {\n  transition: all 0.3s ease;\n}",
          testFunction: (code) => {
            return code.includes("transition") && code.includes("0.3");
          },
          explanation:
            "CSS transitions use: transition: property duration timing-function; 'all' animates all changing properties.",
        },
        {
          id: "cfe-7",
          type: "multiple-choice",
          question: "Which pseudo-class targets the first child element?",
          options: [":first", ":first-child", ":child-first", ":nth-child(0)"],
          correctAnswer: 1,
          explanation:
            ":first-child selects an element that is the first child of its parent.",
        },
        {
          id: "cfe-8",
          type: "code",
          question: "Make an image responsive and prevent distortion",
          starterCode: "/* Write your CSS here */\n",
          correctAnswer: "img {\n  max-width: 100%;\n  height: auto;\n}",
          testFunction: (code) => {
            return (
              code.includes("max-width: 100%") && code.includes("height: auto")
            );
          },
          explanation:
            "max-width: 100% prevents overflow, and height: auto maintains aspect ratio.",
        },
      ],
      remedialChallenges: ["css-01", "css-05", "css-10", "css-15", "css-20"],
    },

    "js-quiz-2": {
      id: "js-quiz-2",
      title: "JavaScript DOM & Events Quiz",
      category: "JavaScript",
      description:
        "Test your understanding of DOM manipulation and event handling",
      requiredChallenges: ["js-06", "js-07", "js-08", "js-09", "js-10"],
      passingScore: 70,
      xpReward: 75,
      questions: [
        {
          id: "jq2-1",
          type: "multiple-choice",
          question: "Which method adds an event listener to an element?",
          options: [
            "element.addListener()",
            "element.addEventListener()",
            "element.on()",
            "element.listen()",
          ],
          correctAnswer: 1,
          explanation:
            "addEventListener() is the standard method to attach event handlers to DOM elements.",
        },
        {
          id: "jq2-2",
          type: "code",
          question:
            "Select an element with id 'title' and change its text to 'Hello'",
          starterCode: "// Write your JavaScript here\n",
          correctAnswer:
            "document.getElementById('title').textContent = 'Hello';",
          testFunction: (code) => {
            return (
              code.includes("getElementById") &&
              code.includes("textContent") &&
              code.includes("Hello")
            );
          },
          explanation:
            "Use getElementById() to select by ID and textContent to change the text.",
        },
        {
          id: "jq2-3",
          type: "multiple-choice",
          question: "What's the difference between textContent and innerHTML?",
          options: [
            "No difference",
            "textContent is safer and ignores HTML tags",
            "innerHTML is faster",
            "textContent only works with divs",
          ],
          correctAnswer: 1,
          explanation:
            "textContent treats everything as plain text, while innerHTML parses HTML tags (potential security risk).",
        },
        {
          id: "jq2-4",
          type: "code",
          question:
            "Add a click event listener to a button that logs 'Clicked!'",
          starterCode:
            "const btn = document.querySelector('button');\n// Add your code here\n",
          correctAnswer:
            "const btn = document.querySelector('button');\nbtn.addEventListener('click', () => {\n  console.log('Clicked!');\n});",
          testFunction: (code) => {
            return (
              code.includes("addEventListener") &&
              code.includes("'click'") &&
              code.includes("console.log")
            );
          },
          explanation:
            "addEventListener takes the event type ('click') and a callback function to execute.",
        },
        {
          id: "jq2-5",
          type: "multiple-choice",
          question:
            "Which method selects all elements matching a CSS selector?",
          options: [
            "document.getAll()",
            "document.querySelectorAll()",
            "document.selectAll()",
            "document.findAll()",
          ],
          correctAnswer: 1,
          explanation:
            "querySelectorAll() returns all elements matching a CSS selector as a NodeList.",
        },
      ],
      remedialChallenges: ["js-06", "js-07", "js-08"],
    },

    "js-quiz-3": {
      id: "js-quiz-3",
      title: "JavaScript Arrays & Objects Quiz",
      category: "JavaScript",
      description:
        "Test your knowledge of arrays, objects, and data manipulation",
      requiredChallenges: ["js-11", "js-12", "js-13", "js-14", "js-15"],
      passingScore: 70,
      xpReward: 75,
      questions: [
        {
          id: "jq3-1",
          type: "multiple-choice",
          question: "Which array method adds an item to the end?",
          options: [".add()", ".push()", ".append()", ".insert()"],
          correctAnswer: 1,
          explanation:
            ".push() adds one or more items to the end of an array and returns the new length.",
        },
        {
          id: "jq3-2",
          type: "code",
          question:
            "Create an object representing a person with name and age properties",
          starterCode: "// Write your JavaScript here\n",
          correctAnswer: "const person = {\n  name: 'John',\n  age: 25\n};",
          testFunction: (code) => {
            return (
              code.includes("{") &&
              code.includes("name") &&
              code.includes("age")
            );
          },
          explanation:
            "Objects use curly braces with key-value pairs separated by commas.",
        },
        {
          id: "jq3-3",
          type: "multiple-choice",
          question: "What does array.map() return?",
          options: [
            "The same array modified",
            "A new array with transformed elements",
            "A single value",
            "Nothing, it modifies in place",
          ],
          correctAnswer: 1,
          explanation:
            ".map() returns a NEW array with each element transformed by the callback function.",
        },
        {
          id: "jq3-4",
          type: "code",
          question: "Filter an array to keep only numbers greater than 10",
          starterCode:
            "const numbers = [5, 15, 8, 20, 3];\n// Write your code here\n",
          correctAnswer:
            "const numbers = [5, 15, 8, 20, 3];\nconst filtered = numbers.filter(n => n > 10);",
          testFunction: (code) => {
            return (
              code.includes(".filter") &&
              code.includes(">") &&
              code.includes("10")
            );
          },
          explanation:
            ".filter() returns a new array with elements that pass the test function.",
        },
        {
          id: "jq3-5",
          type: "multiple-choice",
          question: "How do you access a property in an object?",
          options: [
            "object->property",
            "object.property or object['property']",
            "object::property",
            "object(property)",
          ],
          correctAnswer: 1,
          explanation:
            "Use dot notation (obj.prop) or bracket notation (obj['prop']) to access object properties.",
        },
      ],
      remedialChallenges: ["js-11", "js-12", "js-13"],
    },

    "js-quiz-4": {
      id: "js-quiz-4",
      title: "JavaScript Advanced Concepts Quiz",
      category: "JavaScript",
      description: "Test your understanding of advanced JavaScript concepts",
      requiredChallenges: ["js-16", "js-17", "js-18", "js-19", "js-20"],
      passingScore: 70,
      xpReward: 75,
      questions: [
        {
          id: "jq4-1",
          type: "multiple-choice",
          question: "What is a closure in JavaScript?",
          options: [
            "A way to close the browser",
            "A function that has access to outer function's variables",
            "A loop termination",
            "An error handling method",
          ],
          correctAnswer: 1,
          explanation:
            "A closure is when a function retains access to variables from its outer (enclosing) function scope.",
        },
        {
          id: "jq4-2",
          type: "code",
          question: "Use the spread operator to combine two arrays",
          starterCode:
            "const arr1 = [1, 2];\nconst arr2 = [3, 4];\n// Write your code here\n",
          correctAnswer:
            "const arr1 = [1, 2];\nconst arr2 = [3, 4];\nconst combined = [...arr1, ...arr2];",
          testFunction: (code) => {
            return code.includes("...arr1") && code.includes("...arr2");
          },
          explanation:
            "The spread operator (...) expands arrays, allowing easy concatenation: [...arr1, ...arr2].",
        },
        {
          id: "jq4-3",
          type: "multiple-choice",
          question: "What does 'async/await' do?",
          options: [
            "Makes code run faster",
            "Handles asynchronous operations more readably",
            "Creates multiple threads",
            "Prevents errors",
          ],
          correctAnswer: 1,
          explanation:
            "async/await provides a cleaner syntax for working with promises and asynchronous code.",
        },
        {
          id: "jq4-4",
          type: "code",
          question: "Use destructuring to extract 'name' from an object",
          starterCode:
            "const user = { name: 'Alice', age: 30 };\n// Write your code here\n",
          correctAnswer:
            "const user = { name: 'Alice', age: 30 };\nconst { name } = user;",
          testFunction: (code) => {
            return code.includes("{ name }") && code.includes("user");
          },
          explanation:
            "Destructuring uses curly braces to extract properties: const { name } = object;",
        },
        {
          id: "jq4-5",
          type: "multiple-choice",
          question: "What's the difference between '==' and '==='?",
          options: [
            "No difference",
            "'===' also checks type, '==' doesn't",
            "'==' is faster",
            "'===' only works with numbers",
          ],
          correctAnswer: 1,
          explanation:
            "'===' checks both value AND type (strict equality), while '==' only checks value (type coercion).",
        },
      ],
      remedialChallenges: ["js-16", "js-17", "js-18"],
    },

    "js-quiz-5": {
      id: "js-quiz-5",
      title: "JavaScript Mastery Quiz",
      category: "JavaScript",
      description: "Advanced JavaScript patterns and best practices",
      requiredChallenges: ["js-21", "js-22", "js-23", "js-24", "js-25"],
      passingScore: 70,
      xpReward: 75,
      questions: [
        {
          id: "jq5-1",
          type: "multiple-choice",
          question: "What is the purpose of 'try...catch'?",
          options: [
            "To make code run faster",
            "To handle errors gracefully",
            "To create loops",
            "To define functions",
          ],
          correctAnswer: 1,
          explanation:
            "try...catch handles errors without crashing the program, allowing graceful error recovery.",
        },
        {
          id: "jq5-2",
          type: "code",
          question:
            "Create a promise that resolves with 'Success' after 1 second",
          starterCode: "// Write your JavaScript here\n",
          correctAnswer:
            "const promise = new Promise((resolve) => {\n  setTimeout(() => resolve('Success'), 1000);\n});",
          testFunction: (code) => {
            return (
              code.includes("new Promise") &&
              code.includes("resolve") &&
              code.includes("setTimeout")
            );
          },
          explanation:
            "Promises represent async operations. Use setTimeout with resolve to create a delayed promise.",
        },
        {
          id: "jq5-3",
          type: "multiple-choice",
          question: "What does 'Array.reduce()' do?",
          options: [
            "Makes an array smaller",
            "Reduces array to a single value using a function",
            "Removes duplicates",
            "Sorts the array",
          ],
          correctAnswer: 1,
          explanation:
            ".reduce() executes a reducer function on each element, returning a single output value.",
        },
        {
          id: "jq5-4",
          type: "code",
          question:
            "Use template literals to create a greeting with a name variable",
          starterCode: "const name = 'World';\n// Write your code here\n",
          correctAnswer:
            "const name = 'World';\nconst greeting = `Hello, ${name}!`;",
          testFunction: (code) => {
            return (
              code.includes("`") && code.includes("${") && code.includes("name")
            );
          },
          explanation:
            "Template literals use backticks and ${} for variable interpolation: `Hello, ${name}!`",
        },
        {
          id: "jq5-5",
          type: "multiple-choice",
          question: "What is the purpose of 'localStorage'?",
          options: [
            "To store temporary data",
            "To store data persistently in the browser",
            "To store data on the server",
            "To improve performance",
          ],
          correctAnswer: 1,
          explanation:
            "localStorage stores data persistently in the browser with no expiration, surviving page reloads.",
        },
      ],
      remedialChallenges: ["js-21", "js-22", "js-23"],
    },

    "js-final-exam": {
      id: "js-final-exam",
      title: "JavaScript Path Final Exam",
      category: "JavaScript",
      description:
        "Comprehensive exam covering all JavaScript concepts from this path",
      requiredChallenges: [
        "js-01",
        "js-02",
        "js-03",
        "js-04",
        "js-05",
        "js-06",
        "js-07",
        "js-08",
        "js-09",
        "js-10",
        "js-11",
        "js-12",
        "js-13",
        "js-14",
        "js-15",
        "js-16",
        "js-17",
        "js-18",
        "js-19",
        "js-20",
        "js-21",
        "js-22",
        "js-23",
        "js-24",
        "js-25",
      ],
      requiredQuizzes: [
        "js-quiz-1",
        "js-quiz-2",
        "js-quiz-3",
        "js-quiz-4",
        "js-quiz-5",
      ],
      passingScore: 75,
      xpReward: 150,
      questions: [
        {
          id: "jfe-1",
          type: "multiple-choice",
          question: "Which keyword declares a constant variable?",
          options: ["var", "let", "const", "static"],
          correctAnswer: 2,
          explanation:
            "'const' declares a constant that cannot be reassigned (though objects/arrays can be mutated).",
        },
        {
          id: "jfe-2",
          type: "code",
          question:
            "Create a function that takes an array and returns the sum of all numbers",
          starterCode: "// Write your JavaScript here\n",
          correctAnswer:
            "function sum(arr) {\n  return arr.reduce((acc, num) => acc + num, 0);\n}",
          testFunction: (code) => {
            return (
              code.includes("function") &&
              (code.includes("reduce") || code.includes("for")) &&
              code.includes("return")
            );
          },
          explanation:
            "Use reduce() to accumulate values: arr.reduce((acc, num) => acc + num, 0);",
        },
        {
          id: "jfe-3",
          type: "multiple-choice",
          question: "What does 'this' refer to in JavaScript?",
          options: [
            "The current function",
            "The window object always",
            "The execution context/object",
            "It's a reserved word with no use",
          ],
          correctAnswer: 2,
          explanation:
            "'this' refers to the execution context - the object that is executing the current function.",
        },
        {
          id: "jfe-4",
          type: "code",
          question:
            "Add a click event to a button that toggles a class 'active' on itself",
          starterCode:
            "const btn = document.querySelector('.btn');\n// Write your code here\n",
          correctAnswer:
            "const btn = document.querySelector('.btn');\nbtn.addEventListener('click', () => {\n  btn.classList.toggle('active');\n});",
          testFunction: (code) => {
            return (
              code.includes("addEventListener") &&
              code.includes("classList.toggle")
            );
          },
          explanation:
            "Use addEventListener with classList.toggle() to add/remove a class on click.",
        },
        {
          id: "jfe-5",
          type: "multiple-choice",
          question: "What's the purpose of array.filter()?",
          options: [
            "Removes all elements",
            "Creates new array with elements passing a test",
            "Sorts the array",
            "Transforms each element",
          ],
          correctAnswer: 1,
          explanation:
            ".filter() returns a new array containing only elements that pass the test function.",
        },
        {
          id: "jfe-6",
          type: "code",
          question: "Fetch data from an API and log it (use async/await)",
          starterCode: "// Write your JavaScript here\n",
          correctAnswer:
            "async function getData() {\n  const response = await fetch('api-url');\n  const data = await response.json();\n  console.log(data);\n}",
          testFunction: (code) => {
            return (
              code.includes("async") &&
              code.includes("await") &&
              code.includes("fetch")
            );
          },
          explanation:
            "async/await makes promise handling cleaner: async function, await fetch, await .json().",
        },
        {
          id: "jfe-7",
          type: "multiple-choice",
          question: "What's a callback function?",
          options: [
            "A function that returns another function",
            "A function passed as an argument to another function",
            "A function that runs automatically",
            "An error handling function",
          ],
          correctAnswer: 1,
          explanation:
            "A callback is a function passed as an argument to be executed later, often for async operations.",
        },
        {
          id: "jfe-8",
          type: "code",
          question: "Use array destructuring to get first and second elements",
          starterCode:
            "const colors = ['red', 'green', 'blue'];\n// Write your code here\n",
          correctAnswer:
            "const colors = ['red', 'green', 'blue'];\nconst [first, second] = colors;",
          testFunction: (code) => {
            return (
              code.includes("[") &&
              code.includes("first") &&
              code.includes("second") &&
              code.includes("colors")
            );
          },
          explanation:
            "Array destructuring uses square brackets: const [first, second] = array;",
        },
      ],
      remedialChallenges: [
        "js-01",
        "js-05",
        "js-10",
        "js-15",
        "js-20",
        "js-25",
      ],
    },

    "final-exam": {
      id: "final-exam",
      title: "CodeQuest Grand Final Exam",
      category: "All",
      description:
        "Ultimate comprehensive test covering HTML, CSS, and JavaScript fundamentals",
      requiredChallenges: [], // Unlocked by passing all section quizzes
      requiredQuizzes: [
        "html-quiz-1",
        "html-quiz-2",
        "html-quiz-3",
        "html-quiz-4",
        "html-final-exam",
        "css-quiz-1",
        "css-quiz-2",
        "css-quiz-3",
        "css-quiz-4",
        "css-final-exam",
        "js-quiz-1",
        "js-quiz-2",
        "js-quiz-3",
        "js-quiz-4",
        "js-quiz-5",
        "js-final-exam",
      ],
      passingScore: 75,
      xpReward: 200,
      questions: [
        {
          id: "fe-1",
          type: "multiple-choice",
          question: "What is the correct HTML structure for a webpage?",
          options: [
            "<html><body><head></head></body></html>",
            "<html><head></head><body></body></html>",
            "<body><html><head></head></html></body>",
            "<head><html><body></body></html></head>",
          ],
          correctAnswer: 1,
          explanation:
            "The correct structure is <html> containing <head> then <body>.",
        },
        {
          id: "fe-2",
          type: "code",
          question: "Create a form with a text input and submit button",
          starterCode: "<!-- Write your HTML here -->\n",
          correctAnswer:
            '<form>\n  <input type="text">\n  <button type="submit">Submit</button>\n</form>',
          testFunction: (code) => {
            return (
              code.includes("<form") &&
              code.includes("<input") &&
              code.includes('type="text"') &&
              code.includes("<button")
            );
          },
          explanation:
            "Forms need <form> tags, input fields, and a submit button.",
        },
        {
          id: "fe-3",
          type: "multiple-choice",
          question: "Which CSS property would you use to change text color?",
          options: ["text-color", "color", "font-color", "text-style"],
          correctAnswer: 1,
          explanation: "The 'color' property controls text color in CSS.",
        },
        {
          id: "fe-4",
          type: "code",
          question: "Write CSS to center text and make it 20px",
          starterCode: "/* Write your CSS here */\n",
          correctAnswer: "text-align: center;\nfont-size: 20px;",
          testFunction: (code) => {
            return (
              code.includes("text-align") &&
              code.includes("center") &&
              code.includes("font-size") &&
              code.includes("20")
            );
          },
          explanation:
            "Use 'text-align: center' for centering and 'font-size: 20px' for size.",
        },
        {
          id: "fe-5",
          type: "multiple-choice",
          question: "What does CSS Flexbox help with?",
          options: [
            "Adding colors to elements",
            "Creating flexible layouts",
            "Writing JavaScript",
            "Creating HTML forms",
          ],
          correctAnswer: 1,
          explanation:
            "Flexbox is a CSS layout system for creating flexible, responsive layouts.",
        },
        {
          id: "fe-6",
          type: "code",
          question:
            "Create a variable 'age' with value 25 and log it to console",
          starterCode: "// Write your JavaScript here\n",
          correctAnswer: "let age = 25;\nconsole.log(age);",
          testFunction: (code) => {
            return (
              (code.includes("let") ||
                code.includes("const") ||
                code.includes("var")) &&
              code.includes("age") &&
              code.includes("25") &&
              code.includes("console.log")
            );
          },
          explanation:
            "Declare the variable with let/const and use console.log() to display it.",
        },
        {
          id: "fe-7",
          type: "multiple-choice",
          question:
            "What is the purpose of semantic HTML tags like <article>, <nav>?",
          options: [
            "To make pages colorful",
            "To give meaning to content structure",
            "To add JavaScript functionality",
            "To create animations",
          ],
          correctAnswer: 1,
          explanation:
            "Semantic tags provide meaning to the structure, helping accessibility and SEO.",
        },
        {
          id: "fe-8",
          type: "code",
          question:
            "Create a function 'add' that takes two parameters and returns their sum",
          starterCode: "// Write your JavaScript here\n",
          correctAnswer: "function add(a, b) {\n  return a + b;\n}",
          testFunction: (code) => {
            return (
              code.includes("function") &&
              code.includes("add") &&
              code.includes("return") &&
              code.includes("+")
            );
          },
          explanation:
            "Functions are declared with 'function name(params) { return value; }'.",
        },
        {
          id: "fe-9",
          type: "multiple-choice",
          question: "Which is the correct way to comment in CSS?",
          options: [
            "// This is a comment",
            "/* This is a comment */",
            "<!-- This is a comment -->",
            "# This is a comment",
          ],
          correctAnswer: 1,
          explanation:
            "CSS uses /* */ for comments, just like in many programming languages.",
        },
        {
          id: "fe-10",
          type: "code",
          question: "Write an if statement that checks if x > 10",
          starterCode: "// Assume x is already defined\n",
          correctAnswer: "if (x > 10) {\n  // code here\n}",
          testFunction: (code) => {
            return (
              code.includes("if") &&
              code.includes("(") &&
              code.includes("x") &&
              code.includes(">") &&
              code.includes("10")
            );
          },
          explanation: "If statements use the syntax: if (condition) { code }",
        },
      ],
      remedialChallenges: [], // Final exam doesn't have remedial - you should review your weak areas
    },
  };
}

// Get quiz checkpoints for a category
function getQuizCheckpoints(category) {
  const quizzes = getQuizzes();
  const checkpoints = [];

  for (const quiz of Object.values(quizzes)) {
    if (
      quiz.category === category ||
      (category === "JavaScript" && quiz.category === "JavaScript")
    ) {
      // Find the checkpoint position (after which challenge number)
      const challengeCount = quiz.requiredChallenges.length;
      checkpoints.push({
        quiz: quiz,
        afterChallenge: challengeCount,
        requiredChallenges: quiz.requiredChallenges,
      });
    }
  }

  return checkpoints;
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

    // Skip final exam from auto-popup (it's on dashboard)
    if (quizId === "final-exam") {
      continue;
    }

    // Check if all required challenges are completed
    const allCompleted = quiz.requiredChallenges.every((challengeId) =>
      progress.completedChallenges.includes(challengeId)
    );

    // Check if required quizzes are passed (for final exam)
    let quizzesCompleted = true;
    if (quiz.requiredQuizzes) {
      quizzesCompleted = quiz.requiredQuizzes.every(
        (requiredQuizId) => progress.quizResults?.[requiredQuizId]?.passed
      );
    }

    // Check if quiz hasn't been shown yet
    const notShown =
      !progress.quizResults || !progress.quizResults[quizId]?.shown;

    if (allCompleted && quizzesCompleted && notShown) {
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
    progress.quizResults[quizId] = { attempts: [] };
  }
  if (!progress.quizResults[quizId].attempts) {
    progress.quizResults[quizId].attempts = [];
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

  // Ensure attempts array exists (in case quiz was marked as shown but not initialized properly)
  if (!progress.quizResults[quizId].attempts) {
    progress.quizResults[quizId].attempts = [];
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
