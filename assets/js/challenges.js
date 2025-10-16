// ===== CHALLENGES CATALOG =====
// Each challenge: { id, title, category, difficulty, xp, description, instructions, starterCode, solution, hints[], tests[], concepts[] }

function getAllChallenges() {
  const html = [
    {
      id: "html-01",
      title: "Your First Webpage",
      category: "HTML",
      difficulty: "beginner",
      xp: 10,
      description: "Learn what HTML is and create your first heading.",
      instructions: `
        <h4>📚 What is HTML?</h4>
        <p>HTML (HyperText Markup Language) is the foundation of every website. It tells browsers what to display using <strong>tags</strong>.</p>
        
        <h4>🏗️ What are Tags?</h4>
        <p>Tags are like containers for content. Most have an opening tag <code>&lt;tag&gt;</code> and closing tag <code>&lt;/tag&gt;</code>.</p>
        <p>Example: <code>&lt;h1&gt;My Title&lt;/h1&gt;</code></p>
        <ul>
          <li><code>&lt;h1&gt;</code> = opening tag (starts the container)</li>
          <li><code>My Title</code> = the content inside</li>
          <li><code>&lt;/h1&gt;</code> = closing tag (ends the container)</li>
        </ul>
        
        <h4>🎯 Your Task</h4>
        <p>The <code>&lt;h1&gt;</code> tag creates the biggest heading (main title) on a webpage.</p>
        <p><strong>Create an h1 heading that says "Hello, World!"</strong></p>
        
        <h4>💡 Why?</h4>
        <p>Every webpage needs a clear title. The h1 tag tells browsers and search engines "this is the most important heading on this page".</p>
      `,
      starterCode: `<!-- Write your HTML here -->\n`,
      solution: `<h1>Hello, World!</h1>`,
      hints: [
        "Remember: you need BOTH an opening <h1> and closing </h1> tag",
        "The text goes between the tags: <h1>Your Text Here</h1>",
        "Type exactly: <h1>Hello, World!</h1>",
      ],
      tests: ["Check if <h1> exists", 'Contain "Hello, World!"'],
      concepts: ["Headings", "HTML basics", "Tags"],
    },
    {
      id: "html-02",
      title: "Paragraphs of Text",
      category: "HTML",
      difficulty: "beginner",
      xp: 10,
      description: "Learn how to add paragraph text to your webpage.",
      instructions: `
        <h4>📚 What are Paragraphs?</h4>
        <p>The <code>&lt;p&gt;</code> tag creates paragraphs of text. It's one of the most common HTML elements you'll use.</p>
        
        <h4>🏗️ How Paragraphs Work</h4>
        <p>Each paragraph is a separate block of text that automatically adds spacing above and below.</p>
        <p>Syntax: <code>&lt;p&gt;Your text goes here&lt;/p&gt;</code></p>
        
        <h4>🎯 Your Task</h4>
        <p>You already have a heading. Now <strong>add TWO paragraphs</strong> below it with any text you want.</p>
        <p>Write about yourself, your hobbies, or anything!</p>
        
        <h4>💡 Why Multiple Paragraphs?</h4>
        <p>Breaking text into paragraphs makes content easier to read. Each new idea or topic should get its own paragraph.</p>
        
        <h4>Example:</h4>
        <pre><code>&lt;h1&gt;About Me&lt;/h1&gt;
&lt;p&gt;I love learning new things.&lt;/p&gt;
&lt;p&gt;Coding is my new adventure!&lt;/p&gt;</code></pre>
      `,
      starterCode: `<h1>About Me</h1>\n`,
      solution: `<h1>About Me</h1>\n<p>I like learning to code.</p>\n<p>This is fun!</p>`,
      hints: [
        "Each paragraph needs opening <p> and closing </p> tags",
        "You need to create TWO separate paragraphs",
        "Put any text you want between the tags!",
      ],
      tests: ["Check if <p> exists", 'include "</p>" twice'],
      concepts: ["Paragraphs", "Text content"],
    },
    {
      id: "html-03",
      title: "Lists and Items",
      category: "HTML",
      difficulty: "beginner",
      xp: 15,
      description: "Learn how to create bullet point lists.",
      instructions: `
        <h4>📚 What are Lists?</h4>
        <p>Lists help organize information in an easy-to-read format. HTML has two types:</p>
        <ul>
          <li><code>&lt;ul&gt;</code> = <strong>Unordered List</strong> (bullet points)</li>
          <li><code>&lt;ol&gt;</code> = <strong>Ordered List</strong> (numbered)</li>
        </ul>
        
        <h4>🏗️ How Lists Work</h4>
        <p>Lists have TWO parts:</p>
        <ol>
          <li>A container tag (<code>&lt;ul&gt;</code> or <code>&lt;ol&gt;</code>)</li>
          <li>List items inside (<code>&lt;li&gt;</code>)</li>
        </ol>
        
        <h4>🎯 Your Task</h4>
        <p>Create an <strong>unordered list</strong> with these 3 fruits:</p>
        <ul>
          <li>Apple</li>
          <li>Banana</li>
          <li>Orange</li>
        </ul>
        
        <h4>Example Structure:</h4>
        <pre><code>&lt;ul&gt;
  &lt;li&gt;First item&lt;/li&gt;
  &lt;li&gt;Second item&lt;/li&gt;
&lt;/ul&gt;</code></pre>
        
        <h4>💡 Why Lists?</h4>
        <p>Lists make information scannable. Your brain processes bullet points faster than paragraphs!</p>
      `,
      starterCode: ``,
      solution: `<ul>\n  <li>Apple</li>\n  <li>Banana</li>\n  <li>Orange</li>\n</ul>`,
      hints: [
        "Start with <ul> tag to open the list container",
        "Each fruit needs its own <li> tag",
        "Don't forget to close the list with </ul>",
      ],
      tests: [
        "Check if <ul> exists",
        'Contain "Apple"',
        'Contain "Banana"',
        'Contain "Orange"',
      ],
      concepts: ["Lists", "Unordered Lists", "List Items"],
    },
    {
      id: "html-04",
      title: "Links",
      category: "HTML",
      difficulty: "beginner",
      xp: 15,
      description: "Learn how to create clickable links.",
      instructions: `
        <h4>📚 What are Links?</h4>
        <p>Links (also called <strong>anchors</strong>) let users navigate between pages. They use the <code>&lt;a&gt;</code> tag.</p>
        
        <h4>🏗️ Anatomy of a Link</h4>
        <p>Links have TWO key parts:</p>
        <pre><code>&lt;a href="URL_HERE"&gt;Click Text Here&lt;/a&gt;</code></pre>
        <ul>
          <li><code>href</code> = the <strong>destination</strong> (where you go)</li>
          <li>Text inside = what the user <strong>sees and clicks</strong></li>
        </ul>
        
        <h4>🎯 Your Task</h4>
        <p>Create a link to the <strong>MDN Web Docs</strong> (a popular coding resource):</p>
        <ul>
          <li><strong>URL:</strong> https://developer.mozilla.org/</li>
          <li><strong>Link text:</strong> MDN</li>
        </ul>
        
        <h4>Example:</h4>
        <pre><code>&lt;a href="https://google.com"&gt;Go to Google&lt;/a&gt;</code></pre>
        
        <h4>💡 Why href?</h4>
        <p>"href" stands for "hypertext reference" - it tells the browser where to send users when they click.</p>
      `,
      starterCode: ``,
      solution: `<a href="https://developer.mozilla.org/">MDN</a>`,
      hints: [
        "Use the <a> tag for links",
        "The href attribute holds the URL (inside quotes)",
        "The text between <a> and </a> is what users click",
      ],
      tests: ["<a> tag", 'Contain "href"', 'Contain "MDN"'],
      concepts: ["Links", "Anchors", "Attributes", "href"],
    },
    {
      id: "html-05",
      title: "Images",
      category: "HTML",
      difficulty: "beginner",
      xp: 15,
      description: "Learn how to display images on your webpage.",
      instructions: `
        <h4>📚 What are Images?</h4>
        <p>The <code>&lt;img&gt;</code> tag displays pictures on your webpage. It's a <strong>self-closing tag</strong> (no closing tag needed!).</p>
        
        <h4>🏗️ Image Syntax</h4>
        <pre><code>&lt;img src="image-url.jpg" alt="description"&gt;</code></pre>
        <ul>
          <li><code>src</code> = <strong>source</strong> (where the image is located)</li>
          <li><code>alt</code> = <strong>alternative text</strong> (describes the image)</li>
        </ul>
        
        <h4>🎯 Your Task</h4>
        <p>Add an image using this placeholder URL:</p>
        <p><code>https://via.placeholder.com/150</code></p>
        <p><strong>Important:</strong> Add an <code>alt</code> attribute describing the image (e.g., "Placeholder").</p>
        
        <h4>💡 Why alt text?</h4>
        <p>Alt text helps:</p>
        <ul>
          <li><strong>Blind users</strong> - screen readers read the alt text aloud</li>
          <li><strong>Broken images</strong> - shows text if image doesn't load</li>
          <li><strong>SEO</strong> - search engines understand what the image shows</li>
        </ul>
        <p><strong>Always include alt text!</strong> It makes the web accessible to everyone.</p>
      `,
      starterCode: ``,
      solution: `<img src="https://via.placeholder.com/150" alt="Placeholder">`,
      hints: [
        "img is a self-closing tag (no </img> needed)",
        "Both src and alt go inside the opening tag",
        "Use quotes around the attribute values",
      ],
      tests: ["<img", 'Contain "alt"'],
      concepts: ["Images", "Accessibility", "Self-closing tags", "Attributes"],
    },
    {
      id: "html-06",
      title: "Semantic Sections",
      category: "HTML",
      difficulty: "beginner",
      xp: 20,
      description: "Learn how to structure pages with meaningful sections.",
      instructions: `
        <h4>📚 What is Semantic HTML?</h4>
        <p>Semantic tags <strong>describe their purpose</strong>, not just how they look. They make your code more meaningful!</p>
        
        <h4>🏗️ Common Semantic Tags</h4>
        <ul>
          <li><code>&lt;header&gt;</code> - Top section (logo, navigation, title)</li>
          <li><code>&lt;main&gt;</code> - Main content of the page</li>
          <li><code>&lt;footer&gt;</code> - Bottom section (copyright, links)</li>
        </ul>
        
        <h4>🎯 Your Task</h4>
        <p>Create a basic page structure with THREE sections:</p>
        <ol>
          <li>A <code>&lt;header&gt;</code> with text "My Site"</li>
          <li>A <code>&lt;main&gt;</code> with text "Welcome!"</li>
          <li>A <code>&lt;footer&gt;</code> with text "© 2025"</li>
        </ol>
        
        <h4>Example Structure:</h4>
        <pre><code>&lt;header&gt;Site Title&lt;/header&gt;
&lt;main&gt;Page content goes here&lt;/main&gt;
&lt;footer&gt;Footer info&lt;/footer&gt;</code></pre>
        
        <h4>💡 Why Use Semantic Tags?</h4>
        <ul>
          <li><strong>Accessibility:</strong> Screen readers understand page structure</li>
          <li><strong>SEO:</strong> Search engines know what content is important</li>
          <li><strong>Readability:</strong> Other developers understand your code faster</li>
        </ul>
      `,
      starterCode: ``,
      solution: `<header>My Site</header>\n<main>Welcome!</main>\n<footer>© 2025</footer>`,
      hints: [
        "Each semantic tag has opening and closing tags",
        "Put text content between the tags",
        "You need all three: header, main, and footer",
      ],
      tests: ["<header>", "<main>", "<footer>"],
      concepts: ["Semantic HTML", "Page Structure", "Accessibility"],
    },
    {
      id: "html-07",
      title: "Forms Basics",
      category: "HTML",
      difficulty: "beginner",
      xp: 20,
      description: "Learn how to collect user input with forms.",
      instructions: `
        <h4>📚 What are Forms?</h4>
        <p>Forms let users enter information on a webpage (like login boxes, search bars, contact forms).</p>
        
        <h4>🏗️ Form Structure</h4>
        <p>Forms have THREE key parts:</p>
        <ul>
          <li><code>&lt;form&gt;</code> - Container for all form elements</li>
          <li><code>&lt;input&gt;</code> - Where users type (text box)</li>
          <li><code>&lt;button&gt;</code> - What users click to submit</li>
        </ul>
        
        <h4>🎯 Your Task</h4>
        <p>Create a simple form with:</p>
        <ol>
          <li>A <code>&lt;form&gt;</code> container</li>
          <li>An <code>&lt;input type="text"&gt;</code> where users can type their name</li>
          <li>A <code>&lt;button&gt;</code> that says "Submit"</li>
        </ol>
        
        <h4>Example Structure:</h4>
        <pre><code>&lt;form&gt;
  &lt;input type="text" placeholder="Your name"&gt;
  &lt;button&gt;Submit&lt;/button&gt;
&lt;/form&gt;</code></pre>
        
        <h4>💡 Pro Tip</h4>
        <p>The <code>placeholder</code> attribute shows hint text inside the input box!</p>
      `,
      starterCode: ``,
      solution: `<form>\n  <input type="text" placeholder="Your name">\n  <button>Submit</button>\n</form>`,
      hints: [
        "Start with <form> to wrap everything",
        "Input is self-closing: <input type='text'>",
        "Button text goes between <button> and </button>",
      ],
      tests: ["<form>", "<input", "<button>"],
      concepts: ["Forms", "User Input", "Buttons"],
    },
    {
      id: "html-08",
      title: "Tables",
      category: "HTML",
      difficulty: "intermediate",
      xp: 20,
      description: "Learn how to display data in rows and columns.",
      instructions: `
        <h4>📚 What are Tables?</h4>
        <p>Tables organize data into rows and columns (like a spreadsheet). Perfect for schedules, price lists, or data comparisons.</p>
        
        <h4>🏗️ Table Structure</h4>
        <p>Tables have THREE nested layers:</p>
        <ol>
          <li><code>&lt;table&gt;</code> - Container for the entire table</li>
          <li><code>&lt;tr&gt;</code> - Table Row (horizontal)</li>
          <li><code>&lt;td&gt;</code> - Table Data (individual cells)</li>
        </ol>
        
        <h4>🎯 Your Task</h4>
        <p>Create a <strong>2x2 table</strong> (2 rows, 2 columns) that looks like this:</p>
        <table border="1" style="background: white; color: black; margin: 10px 0;">
          <tr><td>A</td><td>B</td></tr>
          <tr><td>C</td><td>D</td></tr>
        </table>
        
        <h4>Example Structure:</h4>
        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='80'%3E%3Crect x='10' y='10' width='50' height='30' fill='%23e8e8f0' stroke='%23667eea' stroke-width='2'/%3E%3Crect x='60' y='10' width='50' height='30' fill='%23e8e8f0' stroke='%23667eea' stroke-width='2'/%3E%3Crect x='10' y='40' width='50' height='30' fill='%23e8e8f0' stroke='%23667eea' stroke-width='2'/%3E%3Crect x='60' y='40' width='50' height='30' fill='%23e8e8f0' stroke='%23667eea' stroke-width='2'/%3E%3Ctext x='35' y='30' text-anchor='middle' fill='%231a1a2e' font-size='16' font-weight='bold'%3EA%3C/text%3E%3Ctext x='85' y='30' text-anchor='middle' fill='%231a1a2e' font-size='16' font-weight='bold'%3EB%3C/text%3E%3Ctext x='35' y='60' text-anchor='middle' fill='%231a1a2e' font-size='16' font-weight='bold'%3EC%3C/text%3E%3Ctext x='85' y='60' text-anchor='middle' fill='%231a1a2e' font-size='16' font-weight='bold'%3ED%3C/text%3E%3C/svg%3E" alt="2x2 table grid" style="display: block; margin: 10px 0;">
        <pre><code>&lt;table&gt;
  &lt;tr&gt;
    &lt;td&gt;A&lt;/td&gt;
    &lt;td&gt;B&lt;/td&gt;
  &lt;/tr&gt;
  &lt;tr&gt;
    &lt;td&gt;C&lt;/td&gt;
    &lt;td&gt;D&lt;/td&gt;
  &lt;/tr&gt;
&lt;/table&gt;</code></pre>
        
        <h4>💡 Think of it Like This</h4>
        <p>table = the box, tr = shelf, td = item on shelf</p>
        <p><strong>Use the exact letters A, B, C, D in your cells!</strong></p>
      `,
      starterCode: ``,
      solution: `<table>\n  <tr><td>A</td><td>B</td></tr>\n  <tr><td>C</td><td>D</td></tr>\n</table>`,
      hints: [
        "Each row (<tr>) contains multiple cells (<td>)",
        "You need 2 rows, each with 2 cells",
        "The letters A, B, C, D go inside the <td> tags",
      ],
      tests: ["<table>", "<tr>", "<td>"],
      concepts: ["Tables", "Rows", "Cells", "Data Organization"],
    },
    {
      id: "html-09",
      title: "Inline vs Block",
      category: "HTML",
      difficulty: "intermediate",
      xp: 15,
      description:
        "Understand the difference between block and inline elements.",
      instructions: `
        <h4>📚 Block vs Inline Elements</h4>
        <p>HTML elements display in TWO ways:</p>
        <ul>
          <li><strong>Block:</strong> Takes full width, starts on new line (like paragraphs)</li>
          <li><strong>Inline:</strong> Only takes space needed, stays in line (like bold text)</li>
        </ul>
        
        <h4>🏗️ Common Examples</h4>
        <p><strong>Block elements:</strong> <code>&lt;div&gt;</code>, <code>&lt;p&gt;</code>, <code>&lt;h1&gt;</code></p>
        <p><strong>Inline elements:</strong> <code>&lt;span&gt;</code>, <code>&lt;a&gt;</code>, <code>&lt;strong&gt;</code></p>
        
        <h4>🎯 Your Task</h4>
        <p>Create a sentence that highlights one word:</p>
        <ol>
          <li>Use <code>&lt;div&gt;</code> for the full sentence</li>
          <li>Use <code>&lt;span&gt;</code> to wrap ONE word you want to highlight</li>
        </ol>
        
        <h4>Example:</h4>
        <pre><code>&lt;div&gt;This is a &lt;span&gt;special&lt;/span&gt; word.&lt;/div&gt;</code></pre>
        
        <h4>💡 Why This Matters</h4>
        <p><code>&lt;div&gt;</code> structures layout, <code>&lt;span&gt;</code> styles specific text without breaking the flow!</p>
      `,
      starterCode: ``,
      solution: `<div>This is a <span>highlight</span> word.</div>`,
      hints: [
        "div wraps the entire sentence",
        "span goes around just one word inside the sentence",
        "The span should be INSIDE the div",
      ],
      tests: ["<div>", "<span>"],
      concepts: ["Block elements", "Inline elements", "Display types"],
    },
    {
      id: "html-10",
      title: "Accessibility Basics",
      category: "HTML",
      difficulty: "intermediate",
      xp: 20,
      description: "Make forms accessible by connecting labels to inputs.",
      instructions: `
        <h4>📚 What are Labels?</h4>
        <p>Labels describe form inputs, making them easier to use for EVERYONE (especially screen reader users).</p>
        
        <h4>🏗️ Connecting Labels to Inputs</h4>
        <p>To link a label with its input, use matching attributes:</p>
        <ul>
          <li>Label gets <code>for="uniqueID"</code></li>
          <li>Input gets <code>id="uniqueID"</code></li>
          <li>Both must have the <strong>same value</strong></li>
        </ul>
        
        <h4>🎯 Your Task</h4>
        <p>Create an email input with a connected label:</p>
        <ol>
          <li>Make a <code>&lt;label&gt;</code> with <code>for="email"</code> and text "Email"</li>
          <li>Make an <code>&lt;input&gt;</code> with <code>id="email"</code> and <code>type="email"</code></li>
        </ol>
        
        <h4>Example:</h4>
        <pre><code>&lt;label for="username"&gt;Username&lt;/label&gt;
&lt;input id="username" type="text"&gt;</code></pre>
        
        <h4>💡 Why Connect Them?</h4>
        <ul>
          <li><strong>Clickable:</strong> Clicking the label focuses the input</li>
          <li><strong>Screen readers:</strong> Read the label when user reaches the input</li>
          <li><strong>Better UX:</strong> Larger click target for mobile users</li>
        </ul>
      `,
      starterCode: ``,
      solution: `<label for="email">Email</label>\n<input id="email" type="email">`,
      hints: [
        "The label's 'for' and input's 'id' must match exactly",
        "Use 'email' as the matching value",
        "Don't forget type='email' on the input",
      ],
      tests: ["<label", 'for="email"', 'id="email"'],
      concepts: ["Accessibility", "Form labels", "Attributes"],
    },
    // Add more HTML challenges up to 20
  ];

  const css = [
    {
      id: "css-01",
      title: "Color the Text",
      category: "CSS",
      difficulty: "beginner",
      xp: 10,
      description: "Learn how CSS styles HTML elements.",
      instructions: `
        <h4>📚 What is CSS?</h4>
        <p>CSS (Cascading Style Sheets) controls how HTML looks - colors, sizes, spacing, layouts, animations, and more!</p>
        
        <h4>🏗️ CSS Syntax</h4>
        <p>CSS has THREE parts:</p>
        <pre><code>selector {
  property: value;
}</code></pre>
        <ul>
          <li><strong>Selector</strong> = which element to style (e.g., <code>p</code>)</li>
          <li><strong>Property</strong> = what to change (e.g., <code>color</code>)</li>
          <li><strong>Value</strong> = how to change it (e.g., <code>red</code>)</li>
        </ul>
        
        <h4>🎯 Your Task</h4>
        <p>Make the paragraph text red:</p>
        <ol>
          <li>Inside the <code>&lt;style&gt;</code> tags, target <code>p</code></li>
          <li>Set <code>color: red;</code></li>
        </ol>
        
        <h4>Example:</h4>
        <pre><code>&lt;style&gt;
p {
  color: red;
}
&lt;/style&gt;
&lt;p&gt;Hello&lt;/p&gt;</code></pre>
        
        <h4>💡 Why CSS?</h4>
        <p>Without CSS, websites would be plain black text on white! CSS brings design to life.</p>
      `,
      starterCode: `<style>\n/* Add your CSS here */\n</style>\n<p>Hello</p>`,
      solution: `<style>\np { color: red; }\n</style>\n<p>Hello</p>`,
      hints: [
        "Select the p element (no < > needed in CSS)",
        "Use curly braces { } to contain your styles",
        "Don't forget the semicolon after red;",
      ],
      tests: ["color:", "p {"],
      concepts: ["CSS Basics", "Selectors", "Color Property"],
    },
    {
      id: "css-02",
      title: "Fonts & Sizes",
      category: "CSS",
      difficulty: "beginner",
      xp: 10,
      description: "Learn how to control text size with CSS.",
      instructions: `
        <h4>📚 Typography in CSS</h4>
        <p>The <code>font-size</code> property controls how big or small text appears on screen.</p>
        
        <h4>🏗️ CSS Units</h4>
        <p>Font sizes need <strong>units</strong> to tell the browser the measurement:</p>
        <ul>
          <li><code>px</code> = pixels (fixed size, e.g., <code>16px</code>)</li>
          <li><code>em</code> = relative to parent (e.g., <code>1.5em</code>)</li>
          <li><code>rem</code> = relative to root (e.g., <code>2rem</code>)</li>
          <li><code>%</code> = percentage of parent (e.g., <code>150%</code>)</li>
        </ul>
        
        <h4>🎯 Your Task</h4>
        <p>Make the <code>&lt;h1&gt;</code> heading have a font size of <strong>32 pixels</strong>:</p>
        <pre><code>&lt;style&gt;
h1 {
  font-size: 32px;
}
&lt;/style&gt;</code></pre>
        
        <h4>💡 Pro Tip</h4>
        <p>Always include units! Writing <code>font-size: 32</code> (without px) won't work.</p>
      `,
      starterCode: `<style></style>\n<h1>Title</h1>`,
      solution: `<style>h1{font-size:32px}</style>\n<h1>Title</h1>`,
      hints: [
        "Target the h1 element",
        "Use font-size property",
        "Don't forget 'px' after 32",
      ],
      tests: ["font-size:", "h1"],
      concepts: ["Typography", "Font Size", "CSS Units"],
    },
    {
      id: "css-03",
      title: "Box Model Basics",
      category: "CSS",
      difficulty: "beginner",
      xp: 15,
      description: "Understand spacing with margin and padding.",
      instructions: `
        <h4>📚 The CSS Box Model</h4>
        <p>Every HTML element is a <strong>box</strong> with 4 layers of spacing:</p>
        <ol>
          <li><strong>Content</strong> - the text/image inside</li>
          <li><strong>Padding</strong> - space inside the border</li>
          <li><strong>Border</strong> - the edge of the box</li>
          <li><strong>Margin</strong> - space outside the border</li>
        </ol>
        
        <h4>🏗️ Padding vs Margin</h4>
        <ul>
          <li><code>padding</code> = pushes content AWAY from border (internal space)</li>
          <li><code>margin</code> = pushes OTHER elements away (external space)</li>
        </ul>
        
        <h4>🎯 Your Task</h4>
        <p>Style a div with class "box":</p>
        <ol>
          <li>Add <code>padding: 10px;</code> (space inside)</li>
          <li>Add <code>margin: 10px;</code> (space outside)</li>
          <li>Add <code>border: 1px solid #333;</code> (so you can see it!)</li>
        </ol>
        
        <h4>Example:</h4>
        <pre><code>&lt;style&gt;
.box {
  padding: 10px;
  margin: 10px;
  border: 1px solid #333;
}
&lt;/style&gt;</code></pre>
        
        <h4>💡 Class Selectors</h4>
        <p>Use <code>.className</code> in CSS to target elements with that class!</p>
      `,
      starterCode: `<style></style>\n<div class="box">Box</div>`,
      solution: `<style>.box{padding:10px;margin:10px;border:1px solid #333}</style>\n<div class="box">Box</div>`,
      hints: [
        "Use .box (dot means class) as the selector",
        "All three properties go inside the { } braces",
        "Border helps you see the padding and margin!",
      ],
      tests: ["padding:", "margin:", ".box"],
      concepts: ["Box Model", "Padding", "Margin", "Class Selectors"],
    },
    {
      id: "css-04",
      title: "Center with Flexbox",
      category: "CSS",
      difficulty: "beginner",
      xp: 20,
      description: "Learn the modern way to center content with Flexbox.",
      instructions: `
        <h4>📚 What is Flexbox?</h4>
        <p>Flexbox is a CSS layout system that makes arranging elements EASY. It's perfect for centering, spacing, and aligning items.</p>
        
        <h4>🏗️ Centering with Flexbox</h4>
        <p>To center content, you need THREE properties on the container:</p>
        <ul>
          <li><code>display: flex;</code> - activates flexbox</li>
          <li><code>justify-content: center;</code> - centers horizontally (main axis)</li>
          <li><code>align-items: center;</code> - centers vertically (cross axis)</li>
        </ul>
        
        <h4>🎯 Your Task</h4>
        <p>Style the <code>.container</code> div to center its content:</p>
        <pre><code>&lt;style&gt;
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  background: #222;
}
&lt;/style&gt;</code></pre>
        
        <h4>💡 Why Flexbox?</h4>
        <p>Before flexbox, centering was HARD and required hacky tricks. Now it's just 3 lines!</p>
      `,
      starterCode: `<style></style>\n<div class="container"><div>Center me</div></div>`,
      solution: `<style>.container{display:flex;align-items:center;justify-content:center;min-height:200px;background:#222}</style>\n<div class="container"><div>Center me</div></div>`,
      hints: [
        "All properties go on the .container (the parent)",
        "justify-content controls horizontal",
        "align-items controls vertical",
      ],
      tests: ["display", "flex", "justify-content:", "align-items:"],
      concepts: ["Flexbox", "Centering", "Layout"],
    },
    {
      id: "css-05",
      title: "Create a Grid",
      category: "CSS",
      difficulty: "intermediate",
      xp: 20,
      description: "Learn CSS Grid for powerful 2D layouts.",
      instructions: `
        <h4>📚 What is CSS Grid?</h4>
        <p>CSS Grid is the most powerful layout system in CSS. It lets you create rows AND columns easily.</p>
        
        <h4>🏗️ Grid Basics</h4>
        <p>To create a grid, you need:</p>
        <ul>
          <li><code>display: grid;</code> - activates grid layout</li>
          <li><code>grid-template-columns</code> - defines column widths</li>
          <li><code>gap</code> - spacing between grid items (optional)</li>
        </ul>
        
        <h4>🎯 Your Task</h4>
        <p>Create a 2-column grid using <strong>fr units</strong> (fractional units):</p>
        <pre><code>&lt;style&gt;
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
&lt;/style&gt;</code></pre>
        
        <h4>💡 What is 'fr'?</h4>
        <p><code>1fr 1fr</code> means "split available space into 2 equal parts". It's like saying "50% 50%" but smarter!</p>
        <p>You could also write <code>2fr 1fr</code> for a 2:1 ratio (bigger first column).</p>
      `,
      starterCode: `<style></style>\n<div class="grid"><div>A</div><div>B</div></div>`,
      solution: `<style>.grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}</style>\n<div class="grid"><div>A</div><div>B</div></div>`,
      hints: [
        "Start with display: grid; on .grid",
        "grid-template-columns: 1fr 1fr; creates 2 equal columns",
        "Add gap: 10px; for spacing",
      ],
      tests: ["display", "grid", "grid-template-columns:"],
      concepts: ["CSS Grid", "Layout", "fr units"],
    },
    {
      id: "css-06",
      title: "Responsive Image",
      category: "CSS",
      difficulty: "intermediate",
      xp: 15,
      description: "Make images adapt to any screen size.",
      instructions: `
        <h4>📚 Responsive Images</h4>
        <p>By default, images can overflow their containers on small screens. We need to make them <strong>responsive</strong> (flexible).</p>
        
        <h4>🏗️ The Magic Formula</h4>
        <p>Two properties make ANY image responsive:</p>
        <ul>
          <li><code>max-width: 100%;</code> - never wider than container</li>
          <li><code>height: auto;</code> - scales proportionally (no stretching!)</li>
        </ul>
        
        <h4>🎯 Your Task</h4>
        <p>Style all images to be responsive:</p>
        <pre><code>&lt;style&gt;
img {
  max-width: 100%;
  height: auto;
}
&lt;/style&gt;</code></pre>
        
        <h4>💡 Why This Works</h4>
        <p><code>max-width: 100%</code> means "you can be smaller, but never bigger than your container."</p>
        <p><code>height: auto</code> maintains the image's aspect ratio (no squishing!).</p>
        
        <h4>📡 Pro Tip</h4>
        <p>This is one of the FIRST things every developer adds to their CSS. It prevents broken layouts on mobile!</p>
      `,
      starterCode: `<style></style>\n<img src="https://via.placeholder.com/300">`,
      solution: `<style>img{max-width:100%;height:auto}</style>\n<img src="https://via.placeholder.com/300">`,
      hints: [
        "Target the img element",
        "max-width prevents overflow",
        "height: auto maintains aspect ratio",
      ],
      tests: ["max-width", "100%", "height", "auto"],
      concepts: ["Responsive Design", "Images", "Mobile-First"],
    },
    // Add more CSS challenges up to 20
  ];

  const js = [
    {
      id: "js-01",
      title: "Variables",
      category: "JavaScript",
      difficulty: "beginner",
      xp: 10,
      description: "Write your first JavaScript code!",
      instructions: `
        <h4>📚 What is JavaScript?</h4>
        <p>JavaScript makes websites <strong>interactive</strong>! While HTML structures content and CSS styles it, JavaScript adds behavior (clicks, animations, data loading).</p>
        
        <h4>🏗️ Variables</h4>
        <p>Variables store information you want to use later:</p>
        <ul>
          <li><code>const</code> = can't be changed (constant)</li>
          <li><code>let</code> = can be changed</li>
          <li><code>var</code> = old way (avoid it)</li>
        </ul>
        
        <h4>🎯 Your Task</h4>
        <p>Write JavaScript to display your name:</p>
        <ol>
          <li>Create a variable: <code>const name = 'YourName';</code></li>
          <li>Get the paragraph: <code>document.getElementById('out')</code></li>
          <li>Set its text: <code>.textContent = name;</code></li>
        </ol>
        
        <h4>Example:</h4>
        <pre><code>&lt;script&gt;
const name = 'Alex';
document.getElementById('out').textContent = name;
&lt;/script&gt;</code></pre>
        
        <h4>💡 How It Works</h4>
        <p><code>document</code> represents the webpage. <code>getElementById()</code> finds an element by its id attribute. <code>textContent</code> changes what text it shows!</p>
      `,
      starterCode: `<p id="out"></p>\n<script>\n// Your JS here\n</script>`,
      solution: `<p id="out"></p>\n<script>const name='Coder';document.getElementById('out').textContent=name;</script>`,
      hints: [
        "Start with: const name = 'YourName';",
        "Use document.getElementById('out') to find the paragraph",
        "Set .textContent = name; to display it",
      ],
      tests: ["document.", "const"],
      concepts: ["Variables", "DOM", "JavaScript Basics"],
    },
    {
      id: "js-02",
      title: "Click Counter",
      category: "JavaScript",
      difficulty: "beginner",
      xp: 15,
      description: "Learn event handling by building a click counter.",
      instructions: `
        <h4>📚 Events in JavaScript</h4>
        <p><strong>Events</strong> are things that happen in the browser: clicks, keyboard presses, scrolling, etc. JavaScript can "listen" for these and respond!</p>
        
        <h4>🏗️ Event Listeners</h4>
        <p>To respond to a click, use <code>addEventListener</code>:</p>
        <pre><code>element.addEventListener('click', function() {
  // code runs when clicked
});</code></pre>
        
        <h4>🎯 Your Task</h4>
        <p>Make a click counter that increases each time you click the button:</p>
        <ol>
          <li>Create a variable: <code>let count = 0;</code></li>
          <li>Add click listener to button</li>
          <li>Inside the function: increase count and update the display</li>
        </ol>
        
        <h4>Example:</h4>
        <pre><code>&lt;script&gt;
let count = 0;
document.getElementById('btn').addEventListener('click', () => {
  count++;
  document.getElementById('count').textContent = count;
});
&lt;/script&gt;</code></pre>
        
        <h4>💡 Why 'let' not 'const'?</h4>
        <p>We use <code>let</code> because the count CHANGES. <code>const</code> would give an error!</p>
      `,
      starterCode: `<button id="btn">Click</button> <span id="count">0</span>\n<script>// code</script>`,
      solution: `<button id="btn">Click</button> <span id="count">0</span>\n<script>let c=0;document.getElementById('btn').addEventListener('click',()=>{c++;document.getElementById('count').textContent=c;});</script>`,
      hints: [
        "Get the button with getElementById('btn')",
        "addEventListener('click', function)",
        "Increment the counter inside: count++",
      ],
      tests: ["addEventListener", "textContent"],
      concepts: ["Events", "Event Listeners", "State"],
    },
    {
      id: "js-03",
      title: "Conditionals",
      category: "JavaScript",
      difficulty: "beginner",
      xp: 15,
      description: "Make decisions with if/else statements.",
      instructions: `
        <h4>📚 Conditionals (Decision Making)</h4>
        <p>Conditionals let your code make <strong>decisions</strong> based on conditions. "If this is true, do that. Otherwise, do something else."</p>
        
        <h4>🏗️ If/Else Syntax</h4>
        <pre><code>if (condition) {
  // runs if true
} else {
  // runs if false
}</code></pre>
        
        <h4>🎯 Your Task</h4>
        <p>Check if someone is an adult or minor:</p>
        <ol>
          <li>Create a variable: <code>const age = 20;</code></li>
          <li>If age >= 18, display "Adult"</li>
          <li>Otherwise, display "Minor"</li>
        </ol>
        
        <h4>Example:</h4>
        <pre><code>&lt;script&gt;
const age = 20;
let status;

if (age >= 18) {
  status = 'Adult';
} else {
  status = 'Minor';
}

document.getElementById('out').textContent = status;
&lt;/script&gt;</code></pre>
        
        <h4>💡 Ternary Operator (Shortcut)</h4>
        <p>You can write if/else in one line:</p>
        <p><code>const status = age >= 18 ? 'Adult' : 'Minor';</code></p>
      `,
      starterCode: `<p id="out"></p>\n<script>// code</script>`,
      solution: `<p id="out"></p>\n<script>const age=20;document.getElementById('out').textContent=age>=18?'Adult':'Minor';</script>`,
      hints: [
        "Create variable: const age = 20;",
        "Use if (age >= 18) to check",
        "Set textContent to 'Adult' or 'Minor'",
      ],
      tests: ["age", ">="],
      concepts: ["Conditionals", "If/Else", "Comparison Operators"],
    },
    {
      id: "js-04",
      title: "Arrays & Loops",
      category: "JavaScript",
      difficulty: "beginner",
      xp: 20,
      description: "Work with lists of data using arrays.",
      instructions: `
        <h4>📚 Arrays</h4>
        <p>Arrays store <strong>multiple values</strong> in one variable. Perfect for lists!</p>
        <pre><code>const fruits = ['Apple', 'Banana', 'Orange'];</code></pre>
        
        <h4>🏗️ Array.map()</h4>
        <p>The <code>map()</code> method transforms each item in an array:</p>
        <pre><code>const numbers = [1, 2, 3];
const doubled = numbers.map(n => n * 2);
// Result: [2, 4, 6]</code></pre>
        
        <h4>🎯 Your Task</h4>
        <p>Create a fruit array and render it as an HTML list:</p>
        <ol>
          <li>Create array: <code>const fruits = ['Apple', 'Banana', 'Orange'];</code></li>
          <li>Use <code>.map()</code> to convert each fruit to <code>&lt;li&gt;fruit&lt;/li&gt;</code></li>
          <li>Use <code>.join('')</code> to combine them</li>
          <li>Set <code>innerHTML</code> of the list</li>
        </ol>
        
        <h4>Example:</h4>
        <pre><code>&lt;script&gt;
const fruits = ['Apple', 'Banana', 'Orange'];
const html = fruits.map(fruit => '<li>' + fruit + '</li>').join('');
document.getElementById('list').innerHTML = html;
&lt;/script&gt;</code></pre>
        
        <h4>💡 Why join('')?</h4>
        <p><code>map()</code> returns an array of strings. <code>join('')</code> combines them into one HTML string!</p>
      `,
      starterCode: `<ul id="list"></ul>\n<script>// code</script>`,
      solution: `<ul id="list"></ul>\n<script>const fruits=['Apple','Banana','Orange'];document.getElementById('list').innerHTML=fruits.map(f=>'<li>'+f+'</li>').join('');</script>`,
      hints: [
        "Create array with 3 fruits",
        "Use .map() to wrap each in <li> tags",
        "Use .join('') to combine, then set innerHTML",
      ],
      tests: ["[", "map", "<li>"],
      concepts: ["Arrays", "Array Methods", "Loops", "DOM"],
    },
    {
      id: "js-05",
      title: "Local Storage",
      category: "JavaScript",
      difficulty: "intermediate",
      xp: 20,
      description: "Save data in the browser that persists even after refresh!",
      instructions: `
        <h4>📚 LocalStorage</h4>
        <p>LocalStorage lets you <strong>save data in the browser</strong> permanently (until user clears it). Perfect for preferences, scores, or user data!</p>
        
        <h4>🏗️ Storage Methods</h4>
        <ul>
          <li><code>localStorage.setItem(key, value)</code> - saves data</li>
          <li><code>localStorage.getItem(key)</code> - retrieves data</li>
          <li><code>localStorage.removeItem(key)</code> - deletes data</li>
        </ul>
        
        <h4>🎯 Your Task</h4>
        <p>Save a name to localStorage and display it:</p>
        <ol>
          <li>Store: <code>localStorage.setItem('name', 'Coder');</code></li>
          <li>Retrieve: <code>const name = localStorage.getItem('name');</code></li>
          <li>Display it in the paragraph</li>
        </ol>
        
        <h4>Example:</h4>
        <pre><code>&lt;script&gt;
// Save data
localStorage.setItem('name', 'Coder');

// Load data
const name = localStorage.getItem('name');

// Display it
document.getElementById('out').textContent = name;
&lt;/script&gt;</code></pre>
        
        <h4>💡 Try This!</h4>
        <p>After completing this challenge, refresh the page. The data is still there! That's the power of localStorage.</p>
        
        <h4>⚠️ Important</h4>
        <p>LocalStorage only stores <strong>strings</strong>. For objects/arrays, use <code>JSON.stringify()</code> and <code>JSON.parse()</code>.</p>
      `,
      starterCode: `<p id="out"></p>\n<script>// code</script>`,
      solution: `<p id="out"></p>\n<script>localStorage.setItem('name','Coder');document.getElementById('out').textContent=localStorage.getItem('name');</script>`,
      hints: [
        "Use localStorage.setItem('name', 'YourName')",
        "Then localStorage.getItem('name') to retrieve it",
        "Set the textContent to display the retrieved value",
      ],
      tests: ["localStorage", "setItem", "getItem"],
      concepts: ["LocalStorage", "Browser Storage", "Persistence"],
    },
    // Add more JS challenges up to 25
  ];

  // Expand sets to required totals by adding progressively more advanced tasks
  // For brevity here, the first batches are defined. More will be appended below:

  const moreHTML = [];
  for (let i = 11; i <= 20; i++) {
    moreHTML.push({
      id: `html-${String(i).padStart(2, "0")}`,
      title:
        i === 20 ? "HTML Review Project: Profile Card" : `HTML Challenge ${i}`,
      category: "HTML",
      difficulty:
        i < 14 ? "beginner" : i < 18 ? "intermediate" : "intermediate",
      xp: i < 14 ? 10 : 15,
      description: "Practice HTML elements and structure.",
      instructions:
        "<p>Create a small page using headings, paragraphs, and lists. For project: build a simple profile card.</p>",
      starterCode: "",
      solution: "<div><h2>Title</h2><p>Text</p><ul><li>One</li></ul></div>",
      hints: ["Use headings, lists, and semantic tags."],
      tests: ["<h", "<p", "<ul"],
      concepts: ["HTML structure"],
    });
  }

  const moreCSS = [];
  for (let i = 7; i <= 20; i++) {
    moreCSS.push({
      id: `css-${String(i).padStart(2, "0")}`,
      title:
        i === 20 ? "CSS Review Project: Landing Section" : `CSS Challenge ${i}`,
      category: "CSS",
      difficulty:
        i < 11 ? "beginner" : i < 16 ? "intermediate" : "intermediate",
      xp: i < 11 ? 10 : 15,
      description: "Practice common CSS patterns and layouts.",
      instructions:
        "<p>Style elements with spacing, colors, and layout. For project: hero with title, subtitle, and button.</p>",
      starterCode:
        '<style></style>\n<div class="hero"><h1>Title</h1><p>Subtitle</p><button>Get Started</button></div>',
      solution:
        '<style>.hero{padding:32px;background:#222;color:#fff}.hero button{background:#667eea;color:#fff;padding:10px 16px;border:none;border-radius:6px}</style>\n<div class="hero"><h1>Title</h1><p>Subtitle</p><button>Get Started</button></div>',
      hints: ["Use padding, colors, and border-radius."],
      tests: ["padding:", "background:", "button{"],
      concepts: ["Styling", "Layout"],
    });
  }

  const moreJS = [];
  for (let i = 6; i <= 25; i++) {
    moreJS.push({
      id: `js-${String(i).padStart(2, "0")}`,
      title:
        i === 25 ? "JS Review Project: Todo Mini" : `JavaScript Challenge ${i}`,
      category: "JavaScript",
      difficulty:
        i < 11 ? "beginner" : i < 18 ? "intermediate" : "intermediate",
      xp: i < 11 ? 15 : 20,
      description: "Practice DOM, events, arrays, and functions.",
      instructions:
        "<p>Manipulate elements, handle events, or compute values. For project: simple todo add/remove.</p>",
      starterCode: '<div id="app"></div>\n<script>// your code</script>',
      solution:
        '<div id="app"><input id="t"><button id="add">Add</button><ul id="list"></ul></div>\n<script>const t=document.getElementById("t"),list=document.getElementById("list");document.getElementById("add").addEventListener("click",()=>{if(!t.value) return;const li=document.createElement("li");li.textContent=t.value;li.onclick=()=>li.remove();list.appendChild(li);t.value="";});</script>',
      hints: [
        "Use document.createElement and appendChild.",
        "Use addEventListener.",
      ],
      tests: ["document.", "addEventListener", "<ul"],
      concepts: ["DOM", "Events"],
    });
  }

  // ===== REACT CHALLENGES =====
  const react = [
    {
      id: "react-01",
      title: "Your First React Component",
      category: "React",
      difficulty: "beginner",
      xp: 15,
      description:
        "Learn what React is and create your first functional component.",
      instructions: `
        <h4>📚 What is React?</h4>
        <p>React is a JavaScript library for building user interfaces. It lets you create reusable UI components that update efficiently.</p>
        
        <h4>🏗️ What are Components?</h4>
        <p>Components are like custom HTML elements. They're JavaScript functions that return JSX (HTML-like syntax).</p>
        
        <h4>🎯 Your Task</h4>
        <p>Create a simple functional component called <code>Welcome</code> that returns an h1 saying "Welcome to React!"</p>
        
        <h4>Example:</h4>
        <pre><code>function Welcome() {
  return &lt;h1&gt;Welcome to React!&lt;/h1&gt;;
}</code></pre>
        
        <h4>💡 Key Points</h4>
        <ul>
          <li>Function names start with capital letter</li>
          <li>Use <code>return</code> to output JSX</li>
          <li>JSX looks like HTML but it's JavaScript</li>
        </ul>
      `,
      starterCode: `function Welcome() {\n  // Your code here\n}\n`,
      solution: `function Welcome() {\n  return <h1>Welcome to React!</h1>;\n}`,
      hints: [
        "Function should return JSX",
        "Use return <h1>Welcome to React!</h1>;",
        "Don't forget the semicolon",
      ],
      tests: ["function Welcome", "return", "<h1>"],
      concepts: ["Components", "JSX", "Functions"],
    },
    {
      id: "react-02",
      title: "Understanding JSX",
      category: "React",
      difficulty: "beginner",
      xp: 15,
      description: "Learn how JSX works and its syntax rules.",
      instructions: `
        <h4>📚 What is JSX?</h4>
        <p>JSX is a syntax extension for JavaScript that looks like HTML. It gets compiled to regular JavaScript.</p>
        
        <h4>🏗️ JSX Rules</h4>
        <ul>
          <li>Must return a single parent element</li>
          <li>Use <code>className</code> instead of <code>class</code></li>
          <li>Close all tags (even self-closing like &lt;img /&gt;)</li>
          <li>Use camelCase for attributes</li>
        </ul>
        
        <h4>🎯 Your Task</h4>
        <p>Create a component that returns a div with a heading and paragraph inside.</p>
      `,
      starterCode: `function Card() {\n  return (\n    // Your JSX here\n  );\n}\n`,
      solution: `function Card() {\n  return (\n    <div>\n      <h2>My Card</h2>\n      <p>This is a card component</p>\n    </div>\n  );\n}`,
      hints: [
        "Wrap everything in a <div>",
        "Include an <h2> and <p> tag",
        "JSX needs proper closing tags",
      ],
      tests: ["return", "<div>", "<h2>", "<p>"],
      concepts: ["JSX", "Syntax", "Components"],
    },
  ];

  // Add 18 more React challenges
  for (let i = 3; i <= 20; i++) {
    react.push({
      id: `react-${String(i).padStart(2, "0")}`,
      title:
        i === 20 ? "React Review Project: Todo App" : `React Challenge ${i}`,
      category: "React",
      difficulty: i < 8 ? "beginner" : i < 15 ? "intermediate" : "advanced",
      xp: i < 8 ? 15 : i < 15 ? 20 : 25,
      description:
        i === 20
          ? "Build a complete todo app with React"
          : "Practice React concepts and hooks.",
      instructions:
        "<p>Learn React patterns, state management, and component composition.</p>",
      starterCode: "function App() {\n  // Your code\n}\n",
      solution: "function App() { return <div>Solution</div>; }",
      hints: ["Use React hooks", "Think about component structure"],
      tests: ["function", "return"],
      concepts: ["React", "Components", "State"],
    });
  }

  // ===== NEXT.JS CHALLENGES =====
  const nextjs = [
    {
      id: "next-01",
      title: "Introduction to Next.js",
      category: "Next.js",
      difficulty: "intermediate",
      xp: 20,
      description: "Learn what Next.js is and how it extends React.",
      instructions: `
        <h4>📚 What is Next.js?</h4>
        <p>Next.js is a React framework that provides features like server-side rendering, routing, and optimization out of the box.</p>
        
        <h4>🏗️ Key Features</h4>
        <ul>
          <li><strong>File-based routing</strong> - Pages created from files</li>
          <li><strong>Server-side rendering (SSR)</strong> - Better SEO and performance</li>
          <li><strong>API routes</strong> - Backend endpoints in your app</li>
          <li><strong>Automatic code splitting</strong> - Faster page loads</li>
        </ul>
        
        <h4>🎯 Your Task</h4>
        <p>Create a simple Next.js page component that exports a default function.</p>
        
        <h4>Example:</h4>
        <pre><code>export default function Home() {
  return <h1>Welcome to Next.js!</h1>;
}</code></pre>
      `,
      starterCode: `export default function Home() {\n  // Your code here\n}\n`,
      solution: `export default function Home() {\n  return <h1>Welcome to Next.js!</h1>;\n}`,
      hints: [
        "Use 'export default' for page components",
        "Return JSX from the function",
        "Function name should start with capital letter",
      ],
      tests: ["export default", "function", "return"],
      concepts: ["Next.js", "Pages", "Routing"],
    },
  ];

  // Add 14 more Next.js challenges
  for (let i = 2; i <= 15; i++) {
    nextjs.push({
      id: `next-${String(i).padStart(2, "0")}`,
      title:
        i === 15 ? "Next.js Review Project: Blog" : `Next.js Challenge ${i}`,
      category: "Next.js",
      difficulty: i < 6 ? "intermediate" : "advanced",
      xp: i < 6 ? 20 : 25,
      description:
        i === 15
          ? "Build a complete blog with Next.js"
          : "Practice Next.js routing, SSR, and API routes.",
      instructions:
        "<p>Master Next.js features like dynamic routes, data fetching, and server components.</p>",
      starterCode: "export default function Page() {\n  // Your code\n}\n",
      solution:
        "export default function Page() { return <div>Solution</div>; }",
      hints: ["Use Next.js conventions", "Think about routing"],
      tests: ["export", "function"],
      concepts: ["Next.js", "SSR", "Routing"],
    });
  }

  // ===== MYSQL CHALLENGES =====
  const mysql = [
    {
      id: "mysql-01",
      title: "Your First SQL Query",
      category: "MySQL",
      difficulty: "beginner",
      xp: 15,
      description: "Learn what SQL is and write your first SELECT query.",
      instructions: `
        <h4>📚 What is SQL?</h4>
        <p>SQL (Structured Query Language) is the standard language for working with relational databases. MySQL is one implementation of SQL.</p>
        
        <h4>🏗️ Basic SELECT Query</h4>
        <p>The SELECT statement retrieves data from a database table.</p>
        
        <h4>🎯 Your Task</h4>
        <p>Write a query to select all columns from a table called <code>users</code>.</p>
        
        <h4>Syntax:</h4>
        <pre><code>SELECT * FROM table_name;</code></pre>
        
        <h4>💡 Key Points</h4>
        <ul>
          <li><code>SELECT</code> - Choose what columns to retrieve</li>
          <li><code>*</code> - Asterisk means "all columns"</li>
          <li><code>FROM</code> - Specifies which table</li>
          <li>End with semicolon <code>;</code></li>
        </ul>
      `,
      starterCode: `-- Write your SQL query here\n`,
      solution: `SELECT * FROM users;`,
      hints: [
        "Use SELECT * to get all columns",
        "Specify FROM users",
        "Don't forget the semicolon",
      ],
      tests: ["SELECT", "*", "FROM", "users"],
      concepts: ["SQL", "SELECT", "Queries"],
    },
    {
      id: "mysql-02",
      title: "Filtering with WHERE",
      category: "MySQL",
      difficulty: "beginner",
      xp: 15,
      description: "Learn to filter data using WHERE clause.",
      instructions: `
        <h4>📚 WHERE Clause</h4>
        <p>The WHERE clause filters records based on conditions.</p>
        
        <h4>🎯 Your Task</h4>
        <p>Select all users where age is greater than 18.</p>
        
        <h4>Syntax:</h4>
        <pre><code>SELECT * FROM users WHERE age > 18;</code></pre>
      `,
      starterCode: `-- Write your SQL query here\n`,
      solution: `SELECT * FROM users WHERE age > 18;`,
      hints: [
        "Use WHERE clause after FROM",
        "Use > for greater than",
        "Column name is 'age'",
      ],
      tests: ["SELECT", "FROM", "WHERE", "age", ">"],
      concepts: ["WHERE", "Filtering", "Conditions"],
    },
  ];

  // Add 13 more MySQL challenges
  for (let i = 3; i <= 15; i++) {
    mysql.push({
      id: `mysql-${String(i).padStart(2, "0")}`,
      title:
        i === 15
          ? "MySQL Review Project: E-commerce Database"
          : `MySQL Challenge ${i}`,
      category: "MySQL",
      difficulty: i < 6 ? "beginner" : i < 11 ? "intermediate" : "advanced",
      xp: i < 6 ? 15 : i < 11 ? 20 : 25,
      description:
        i === 15
          ? "Design and query a complete e-commerce database"
          : "Practice SQL queries, joins, and database design.",
      instructions:
        "<p>Master SQL concepts like JOINs, GROUP BY, indexes, and transactions.</p>",
      starterCode: "-- Write your SQL query\n",
      solution: "SELECT * FROM table;",
      hints: ["Think about table relationships", "Use proper SQL syntax"],
      tests: ["SELECT"],
      concepts: ["SQL", "Databases", "Queries"],
    });
  }

  // ===== POSTGRESQL CHALLENGES =====
  const postgresql = [
    {
      id: "postgres-01",
      title: "PostgreSQL Basics",
      category: "PostgreSQL",
      difficulty: "beginner",
      xp: 15,
      description: "Learn PostgreSQL-specific features and syntax.",
      instructions: `
        <h4>📚 What is PostgreSQL?</h4>
        <p>PostgreSQL is a powerful, open-source relational database. It's known for reliability and advanced features.</p>
        
        <h4>🏗️ Differences from MySQL</h4>
        <ul>
          <li>More SQL standard compliant</li>
          <li>Better support for complex queries</li>
          <li>Advanced data types (JSON, Arrays)</li>
          <li>Extensible with custom functions</li>
        </ul>
        
        <h4>🎯 Your Task</h4>
        <p>Write a query to select all products ordered by price descending.</p>
        
        <h4>Syntax:</h4>
        <pre><code>SELECT * FROM products ORDER BY price DESC;</code></pre>
      `,
      starterCode: `-- Write your PostgreSQL query\n`,
      solution: `SELECT * FROM products ORDER BY price DESC;`,
      hints: [
        "Use ORDER BY clause",
        "DESC means descending order",
        "Column name is 'price'",
      ],
      tests: ["SELECT", "FROM", "ORDER BY", "DESC"],
      concepts: ["PostgreSQL", "Sorting", "Queries"],
    },
  ];

  // Add 14 more PostgreSQL challenges
  for (let i = 2; i <= 15; i++) {
    postgresql.push({
      id: `postgres-${String(i).padStart(2, "0")}`,
      title:
        i === 15
          ? "PostgreSQL Review Project: Analytics Database"
          : `PostgreSQL Challenge ${i}`,
      category: "PostgreSQL",
      difficulty: i < 6 ? "beginner" : i < 11 ? "intermediate" : "advanced",
      xp: i < 6 ? 15 : i < 11 ? 20 : 25,
      description:
        i === 15
          ? "Build an analytics database with advanced queries"
          : "Practice PostgreSQL features, JSON handling, and window functions.",
      instructions:
        "<p>Master PostgreSQL-specific features like JSON, CTEs, and window functions.</p>",
      starterCode: "-- Write your query\n",
      solution: "SELECT * FROM table;",
      hints: ["Use PostgreSQL syntax", "Leverage advanced features"],
      tests: ["SELECT"],
      concepts: ["PostgreSQL", "Advanced SQL"],
    });
  }

  // ===== SQLITE CHALLENGES =====
  const sqlite = [
    {
      id: "sqlite-01",
      title: "Introduction to SQLite",
      category: "SQLite",
      difficulty: "beginner",
      xp: 15,
      description: "Learn about SQLite and its use cases.",
      instructions: `
        <h4>📚 What is SQLite?</h4>
        <p>SQLite is a lightweight, file-based database. It's perfect for mobile apps, embedded systems, and small to medium websites.</p>
        
        <h4>🏗️ Key Features</h4>
        <ul>
          <li><strong>Serverless</strong> - No separate server process</li>
          <li><strong>Zero configuration</strong> - Works out of the box</li>
          <li><strong>Single file</strong> - Entire database in one file</li>
          <li><strong>Cross-platform</strong> - Works everywhere</li>
        </ul>
        
        <h4>🎯 Your Task</h4>
        <p>Create a simple table called <code>notes</code> with id and content columns.</p>
        
        <h4>Syntax:</h4>
        <pre><code>CREATE TABLE notes (
  id INTEGER PRIMARY KEY,
  content TEXT
);</code></pre>
      `,
      starterCode: `-- Write your SQLite command\n`,
      solution: `CREATE TABLE notes (\n  id INTEGER PRIMARY KEY,\n  content TEXT\n);`,
      hints: [
        "Use CREATE TABLE statement",
        "INTEGER PRIMARY KEY for id",
        "TEXT for content column",
      ],
      tests: ["CREATE TABLE", "notes", "INTEGER", "TEXT"],
      concepts: ["SQLite", "Tables", "Schema"],
    },
  ];

  // Add 14 more SQLite challenges
  for (let i = 2; i <= 15; i++) {
    sqlite.push({
      id: `sqlite-${String(i).padStart(2, "0")}`,
      title:
        i === 15
          ? "SQLite Review Project: Mobile App Database"
          : `SQLite Challenge ${i}`,
      category: "SQLite",
      difficulty: i < 6 ? "beginner" : i < 11 ? "intermediate" : "advanced",
      xp: i < 6 ? 15 : i < 11 ? 20 : 25,
      description:
        i === 15
          ? "Design a complete mobile app database schema"
          : "Practice SQLite-specific features and optimization.",
      instructions:
        "<p>Master SQLite for embedded and mobile applications.</p>",
      starterCode: "-- Write your SQLite command\n",
      solution: "SELECT * FROM table;",
      hints: ["Use SQLite syntax", "Think about mobile constraints"],
      tests: ["SELECT"],
      concepts: ["SQLite", "Mobile", "Databases"],
    });
  }

  return [
    ...html,
    ...moreHTML,
    ...css,
    ...moreCSS,
    ...js,
    ...moreJS,
    ...react,
    ...nextjs,
    ...mysql,
    ...postgresql,
    ...sqlite,
  ];
}
