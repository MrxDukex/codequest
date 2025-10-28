// ===== CHALLENGES CATALOG =====
// Each challenge: { id, title, category, difficulty, xp, description, instructions, starterCode, solution, hints[], tests[], concepts[] }

function getAllChallenges() {
  const html = [
    {
      id: "html-01",
      title: "Your First Webpage",
      category: "HTML",
      difficulty: "beginner",
      xp: 75,
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
      tests: [
        "Must contain an &lt;h1&gt; tag",
        "Must contain the text 'Hello, World!' inside the h1",
      ],
      concepts: ["Headings", "HTML basics", "Tags"],
    },
    {
      id: "html-02",
      title: "Paragraphs of Text",
      category: "HTML",
      difficulty: "beginner",
      xp: 75,
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
      tests: [
        "Must contain at least one &lt;p&gt; tag",
        "Must have two closing &lt;/p&gt; tags (two paragraphs)",
      ],
      concepts: ["Paragraphs", "Text content"],
    },
    {
      id: "html-03",
      title: "Lists and Items",
      category: "HTML",
      difficulty: "beginner",
      xp: 90,
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
        "Must contain a &lt;ul&gt; tag for unordered list",
        "Must contain 'Apple' as a list item",
        "Must contain 'Banana' as a list item",
        "Must contain 'Orange' as a list item",
      ],
      concepts: ["Lists", "Unordered Lists", "List Items"],
    },
    {
      id: "html-04",
      title: "Links",
      category: "HTML",
      difficulty: "beginner",
      xp: 90,
      description: "Learn how to create clickable links.",
      instructions: `
        <h4>📚 What are Links?</h4>
        <p>Links (also called <strong>anchors</strong> or <strong>hyperlinks</strong>) are clickable elements that transport users to different pages, websites, or sections. They're what makes the "web" interconnected! Every time you click a navigation menu item or a "Read more" button, you're using a link.</p>
        <p>Links are created with the <code>&lt;a&gt;</code> tag ("a" stands for "anchor").</p>
        
        <h4>🏗️ Anatomy of a Link - Breaking it Down</h4>
        <p>Links have TWO essential parts:</p>
        <pre><code>&lt;a href="URL_HERE"&gt;Click Text Here&lt;/a&gt;</code></pre>
        <ul>
          <li><code>&lt;a</code> = Opens the anchor tag</li>
          <li><code>href="URL_HERE"</code> = The <strong>destination</strong> (where clicking will take you). "href" stands for "hypertext reference"</li>
          <li><code>&gt;</code> = Closes the opening tag</li>
          <li><code>Click Text Here</code> = The visible, clickable text users see on the page</li>
          <li><code>&lt;/a&gt;</code> = Closes the anchor tag</li>
        </ul>
        
        <h4>🎯 Your Task</h4>
        <p>Create a link to the <strong>MDN Web Docs</strong> (Mozilla Developer Network - one of the best coding resources!):</p>
        <ol>
          <li>Use the <code>&lt;a&gt;</code> tag to create the link</li>
          <li>Set <code>href="https://developer.mozilla.org/"</code> as the destination</li>
          <li>Make the clickable text say <strong>MDN</strong></li>
        </ol>
        
        <h4>💻 What Your Code Should Look Like:</h4>
        <pre><code>&lt;a href="https://developer.mozilla.org/"&gt;MDN&lt;/a&gt;</code></pre>
        
        <h4> Understanding 'href'</h4>
        <p>"<strong>href</strong>" = "<strong>h</strong>ypertext <strong>ref</strong>erence"</p>
        <p>Think of it as the "address" or "destination" attribute. It tells the browser: "When someone clicks this link, send them HERE."</p>
        <p><strong>How it works:</strong> When you click on the text "MDN", your browser reads the href attribute and navigates to that URL.</p>
        
        <h4>🌐 Real-World Uses:</h4>
        <ul>
          <li><strong>Navigation:</strong> Home, About, Contact buttons in website menus</li>
          <li><strong>External links:</strong> Linking to partner sites or resources</li>
          <li><strong>Call-to-actions:</strong> "Learn More", "Sign Up", "Shop Now" buttons</li>
          <li><strong>Social media:</strong> Icons linking to your Facebook, Twitter, etc.</li>
        </ul>
        
        <h4>✨ Pro Tips:</h4>
        <ul>
          <li>Always use <strong>descriptive text</strong> ("View our pricing" instead of "click here")</li>
          <li>Add <code>target="_blank"</code> to open in a new tab: <code>&lt;a href="..." target="_blank"&gt;</code></li>
          <li>For external links with <code>target="_blank"</code>, add <code>rel="noopener"</code> for security</li>
        </ul>
      `,
      starterCode: ``,
      solution: `<a href="https://developer.mozilla.org/">MDN</a>`,
      hints: [
        "Use the <a> tag for links",
        "The href attribute holds the URL (inside quotes)",
        "The text between <a> and </a> is what users click",
      ],
      tests: [
        "Must contain an &lt;a&gt; anchor tag",
        "Must have an href attribute",
        "Must contain the text 'MDN'",
      ],
      concepts: ["Links", "Anchors", "Attributes", "href"],
    },
    {
      id: "html-05",
      title: "Images",
      category: "HTML",
      difficulty: "beginner",
      xp: 90,
      description: "Learn how to display images on your webpage.",
      instructions: `
        <h4>📚 What are Images in HTML?</h4>
        <p>The <code>&lt;img&gt;</code> tag embeds pictures, photos, logos, or graphics directly into your webpage. Images make websites visually appealing and help communicate information quickly.</p>
        <p><strong>Special note:</strong> The img tag is <strong>self-closing</strong>, meaning it doesn't have a separate closing tag like <code>&lt;/img&gt;</code>. Everything is contained in one tag!</p>
        
        <h4>🏗️ Image Tag Syntax - Breaking it Down</h4>
        <pre><code>&lt;img src="image-url.jpg" alt="description"&gt;</code></pre>
        <p>Let's understand each part:</p>
        <ul>
          <li><code>&lt;img</code> = Opens the image tag</li>
          <li><code>src="image-url.jpg"</code> = <strong>Source</strong> - the location/path/URL where the image file lives (like an address)</li>
          <li><code>alt="description"</code> = <strong>Alternative text</strong> - a written description of what the image shows</li>
          <li><code>&gt;</code> = Closes the tag (no separate <code>&lt;/img&gt;</code> needed!)</li>
        </ul>
        
        <h4>🎯 Your Task</h4>
        <p>Add an image to your webpage following these steps:</p>
        <ol>
          <li>Start with <code>&lt;img</code></li>
          <li>Add <code>src="https://via.placeholder.com/150"</code> (this is a test image URL that generates a 150x150 placeholder)</li>
          <li>Add <code>alt="Placeholder"</code> (describes what the image is)</li>
          <li>Close with <code>&gt;</code></li>
        </ol>
        
        <h4>💻 What Your Code Should Look Like:</h4>
        <pre><code>&lt;img src="https://via.placeholder.com/150" alt="Placeholder"&gt;</code></pre>
        
        <h4>🔍 Understanding the Attributes:</h4>
        <p><strong>src (source):</strong></p>
        <ul>
          <li>Can be a full URL: <code>https://example.com/photo.jpg</code></li>
          <li>Can be a relative path: <code>images/logo.png</code> (file in your project)</li>
          <li>Tells the browser where to fetch the image from</li>
        </ul>
        <p><strong>alt (alternative text):</strong></p>
        <ul>
          <li>Should describe what the image shows or its purpose</li>
          <li>Good example: <code>alt="Red sports car on mountain road"</code></li>
          <li>Bad example: <code>alt="image1"</code> (not descriptive)</li>
        </ul>
        
        <h4>💡 Why is 'alt' Text CRITICAL?</h4>
        <p>The <code>alt</code> attribute is not optional - it's essential for multiple reasons:</p>
        <ul>
          <li><strong>♿ Accessibility:</strong> Screen readers (used by blind/visually impaired people) read alt text aloud so they know what the image shows</li>
          <li><strong>🔗 Broken images:</strong> If the image fails to load (slow internet, broken link), the alt text displays instead</li>
          <li><strong>🔍 SEO:</strong> Search engines can't "see" images - they read alt text to understand and index your images</li>
          <li><strong>⏳ Loading:</strong> Alt text shows while images are loading on slow connections</li>
        </ul>
        <p><strong>⚠️ ALWAYS include meaningful alt text!</strong> It makes the web usable and accessible for everyone.</p>
        
        <h4>🌍 Real-World Examples:</h4>
        <ul>
          <li><strong>E-commerce:</strong> Product photos with alt="Blue denim jacket - front view"</li>
          <li><strong>Blogs:</strong> Article featured images with descriptive alt text</li>
          <li><strong>Logos:</strong> Company logos with alt="CompanyName logo"</li>
          <li><strong>Profile pics:</strong> User avatars with alt="John Smith profile picture"</li>
        </ul>
        
        <h4>✨ Pro Tips:</h4>
        <ul>
          <li>Be specific with alt text: "Golden retriever puppy playing with red ball" beats just "dog"</li>
          <li>For purely decorative images, use empty alt: <code>alt=""</code> (screen readers will skip it)</li>
          <li>You can control size with <code>width</code> and <code>height</code> attributes: <code>&lt;img src="..." width="300" height="200" alt="..."&gt;</code></li>
          <li>For responsive images, use CSS: <code>max-width: 100%;</code></li>
        </ul>
      `,
      starterCode: ``,
      solution: `<img src="https://via.placeholder.com/150" alt="Placeholder">`,
      hints: [
        "img is a self-closing tag (no </img> needed)",
        "Both src and alt go inside the opening tag",
        "Use quotes around the attribute values",
      ],
      tests: [
        "Must contain an <img> tag",
        "Must have an alt attribute for accessibility",
      ],
      concepts: ["Images", "Accessibility", "Self-closing tags", "Attributes"],
    },
    {
      id: "html-06",
      title: "Semantic Sections",
      category: "HTML",
      difficulty: "beginner",
      xp: 105,
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
      tests: [
        "Must contain a &lt;header&gt; semantic tag",
        "Must contain a &lt;main&gt; semantic tag",
        "Must contain a &lt;footer&gt; semantic tag",
      ],
      concepts: ["Semantic HTML", "Page Structure", "Accessibility"],
    },
    {
      id: "html-07",
      title: "Forms Basics",
      category: "HTML",
      difficulty: "beginner",
      xp: 105,
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
      tests: [
        "Must contain a &lt;form&gt; tag",
        "Must contain an &lt;input&gt; element",
        "Must contain a &lt;button&gt; element",
      ],
      concepts: ["Forms", "User Input", "Buttons"],
    },
    {
      id: "html-08",
      title: "Tables",
      category: "HTML",
      difficulty: "intermediate",
      xp: 120,
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
      tests: [
        "Must have a &lt;table&gt; tag",
        "Must have exactly 2 &lt;tr&gt; tags",
        "Must have exactly 4 &lt;td&gt; tags",
        "Must contain the letters A, B, C, and D",
      ],
      customValidator: function (code) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(code, "text/html");
        const table = doc.querySelector("table");

        if (!table) return [false, false, false, false];

        const rows = table.querySelectorAll("tr");
        const cells = table.querySelectorAll("td");

        const hasTable = !!table;
        const hasTwoRows = rows.length === 2;
        const hasFourCells = cells.length === 4;

        const text = code.toUpperCase();
        const hasAllLetters =
          text.includes("A") &&
          text.includes("B") &&
          text.includes("C") &&
          text.includes("D");

        return [hasTable, hasTwoRows, hasFourCells, hasAllLetters];
      },
      concepts: ["Tables", "Rows", "Cells", "Data Organization"],
    },
    {
      id: "html-09",
      title: "Inline vs Block",
      category: "HTML",
      difficulty: "intermediate",
      xp: 120,
      description:
        "Understand the difference between block and inline elements.",
      instructions: `
        <h4>📚 Block vs Inline Elements - What's the Difference?</h4>
        <p>Every HTML element behaves in ONE of TWO ways on the page:</p>
        <ul>
          <li><strong>Block elements:</strong> Take up the FULL WIDTH available and start on a NEW LINE (like paragraphs stacking vertically)</li>
          <li><strong>Inline elements:</strong> Only take up as MUCH SPACE as needed and stay IN THE SAME LINE with surrounding content (like words in a sentence)</li>
        </ul>
        
        <h4>🔍 Real-World Analogy</h4>
        <p>Think of <strong>block elements</strong> like Lego bricks stacked on top of each other - each one gets its own "row".</p>
        <p>Think of <strong>inline elements</strong> like words in a sentence - they flow together on the same line until they run out of space.</p>
        
        <h4>🏗️ Common Examples</h4>
        <p><strong>Block elements:</strong></p>
        <ul>
          <li><code>&lt;div&gt;</code> - Generic container (division) for grouping content</li>
          <li><code>&lt;p&gt;</code> - Paragraph (always starts new line)</li>
          <li><code>&lt;h1&gt;</code> - Headings (get their own line)</li>
          <li><code>&lt;ul&gt;</code>, <code>&lt;li&gt;</code> - Lists (stack vertically)</li>
        </ul>
        <p><strong>Inline elements:</strong></p>
        <ul>
          <li><code>&lt;span&gt;</code> - Generic container for small pieces of text</li>
          <li><code>&lt;a&gt;</code> - Links (sit within text)</li>
          <li><code>&lt;strong&gt;</code> - Bold text (doesn't break the line)</li>
          <li><code>&lt;em&gt;</code> - Italic text (flows with text)</li>
        </ul>
        
        <h4>🎯 Your Task</h4>
        <p>Create a sentence that highlights ONE specific word:</p>
        <ol>
          <li>Use <code>&lt;div&gt;</code> to wrap the entire sentence (this is the block container)</li>
          <li>Use <code>&lt;span&gt;</code> to wrap just ONE word inside that sentence (this stays inline)</li>
        </ol>
        
        <h4>💻 Code Breakdown:</h4>
        <pre><code>&lt;div&gt;This is a &lt;span&gt;special&lt;/span&gt; word.&lt;/div&gt;</code></pre>
        <ul>
          <li><code>&lt;div&gt;</code> - Creates a block container (takes full width)</li>
          <li>Text: "This is a " - Regular text inside the div</li>
          <li><code>&lt;span&gt;special&lt;/span&gt;</code> - Wraps just the word "special" so you can style it differently (like color or bold)</li>
          <li>Text: " word." - More regular text after the span</li>
          <li><code>&lt;/div&gt;</code> - Closes the block container</li>
        </ul>
        
        <h4>💡 Why This Matters</h4>
        <ul>
          <li><strong>div:</strong> Use when you want to create SECTIONS or CONTAINERS that stack vertically</li>
          <li><strong>span:</strong> Use when you want to style or manipulate a SMALL PIECE of text without breaking the paragraph flow</li>
          <li><strong>Real example:</strong> On a blog post, the entire article might be in a <code>&lt;div&gt;</code>, but if you want to highlight a single keyword in red, you'd wrap that keyword in a <code>&lt;span&gt;</code></li>
        </ul>
        
        <h4>🎨 What You Can Do With This</h4>
        <p>Later with CSS, you could make the span word have a different color, background, or make it bold - while keeping it flowing naturally in the sentence!</p>
      `,
      starterCode: ``,
      solution: `<div>This is a <span>highlight</span> word.</div>`,
      hints: [
        "div wraps the entire sentence",
        "span goes around just one word inside the sentence",
        "The span should be INSIDE the div",
      ],
      tests: [
        "Must contain a &lt;div&gt; block element",
        "Must contain a &lt;span&gt; inline element",
      ],
      concepts: ["Block elements", "Inline elements", "Display types"],
    },
    {
      id: "html-10",
      title: "Accessibility Basics",
      category: "HTML",
      difficulty: "intermediate",
      xp: 120,
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
      tests: [
        "Must contain a &lt;label&gt; tag",
        "Label must have for='email' attribute",
        "Input must have id='email' attribute",
      ],
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
      xp: 75,
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
        
        <h4>💡 Why CSS?</h4>
        <p>Without CSS, websites would be plain black text on white! CSS brings design to life.</p>
        
        <h4>✨ Remember:</h4>
        <p>The selector goes first (p), then curly braces { }, then the property: value; inside. Don't forget the semicolon!</p>
      `,
      starterCode: `<style>\n/* Add your CSS here */\n</style>\n<p>Hello</p>`,
      solution: `<style>\np { color: red; }\n</style>\n<p>Hello</p>`,
      hints: [
        "Select the p element (no < > needed in CSS)",
        "Use curly braces { } to contain your styles",
        "Don't forget the semicolon after red;",
      ],
      tests: ["Must have color property", "Must target p element with { }"],
      concepts: ["CSS Basics", "Selectors", "Color Property"],
    },
    {
      id: "css-02",
      title: "Fonts & Sizes",
      category: "CSS",
      difficulty: "beginner",
      xp: 75,
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
      tests: ["Must have font-size property", "Must target h1 element"],
      concepts: ["Typography", "Font Size", "CSS Units"],
    },
    {
      id: "css-03",
      title: "Box Model Basics",
      category: "CSS",
      difficulty: "beginner",
      xp: 90,
      description: "Understand spacing with margin and padding.",
      instructions: `
        <h4>📚 The CSS Box Model - Foundation of Layout</h4>
        <p>This is ONE of the most important concepts in CSS! Every single HTML element on a page is treated as a <strong>rectangular box</strong>. Understanding how these boxes work is key to controlling layout and spacing.</p>
        <p>Each box has 4 layers from inside to outside:</p>
        <ol>
          <li><strong>Content</strong> - the actual text, image, or content inside</li>
          <li><strong>Padding</strong> - transparent space INSIDE the box, around the content</li>
          <li><strong>Border</strong> - the edge/outline of the box (can be visible or invisible)</li>
          <li><strong>Margin</strong> - transparent space OUTSIDE the box, pushing other elements away</li>
        </ol>
        
        <h4>🖌️ Visual Representation:</h4>
        <pre><code>
┌───────── MARGIN (outside space) ─────────┐
│  ┌─────── BORDER (visible edge) ───────┐  │
│  │  ┌─── PADDING (inside space) ───┐  │  │
│  │  │                              │  │  │
│  │  │    CONTENT (text/image)     │  │  │
│  │  │                              │  │  │
│  │  └──────────────────────────────┘  │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
        </code></pre>
        
        <h4>🏗️ Padding vs Margin - What's the Difference?</h4>
        <p>This confuses EVERYONE at first! Here's the key difference:</p>
        <ul>
          <li><code>padding</code> = Space <strong>INSIDE</strong> the box, between the content and the border
            <ul>
              <li>Makes the box bigger from the inside</li>
              <li>Inherits the background color of the element</li>
              <li>Think: "cushioning" or "breathing room" for your content</li>
            </ul>
          </li>
          <li><code>margin</code> = Space <strong>OUTSIDE</strong> the box, pushing other elements away
            <ul>
              <li>Creates distance between this box and neighboring boxes</li>
              <li>Always transparent (no background color)</li>
              <li>Think: "personal space" between elements</li>
            </ul>
          </li>
        </ul>
        
        <h4>🎯 Your Task</h4>
        <p>Style a div with class "box" to demonstrate all three properties:</p>
        <ol>
          <li>Add <code>padding: 10px;</code> - creates 10px of space INSIDE the box, around the content</li>
          <li>Add <code>margin: 10px;</code> - creates 10px of space OUTSIDE the box, pushing other elements away</li>
          <li>Add <code>border: 1px solid #333;</code> - adds a visible 1-pixel solid dark gray border so you can SEE the box!</li>
        </ol>
        
        <h4>💻 What Your CSS Should Look Like:</h4>
        <pre><code>&lt;style&gt;
.box {
  padding: 10px;      /* Inside space */
  margin: 10px;       /* Outside space */
  border: 1px solid #333;  /* Visible edge */
}
&lt;/style&gt;</code></pre>
        
        <h4>� Breaking Down the Border Property:</h4>
        <p><code>border: 1px solid #333;</code> is actually three values in one:</p>
        <ul>
          <li><code>1px</code> = thickness/width of the border</li>
          <li><code>solid</code> = style (could also be dashed, dotted, etc.)</li>
          <li><code>#333</code> = color (dark gray hex code)</li>
        </ul>
        
        <h4>�💡 Understanding Class Selectors</h4>
        <p>In your HTML, you have: <code>&lt;div class="box"&gt;Content&lt;/div&gt;</code></p>
        <p>In CSS, use a <strong>period/dot</strong> before the class name to target it: <code>.box { }</code></p>
        <p>The dot tells CSS: "Find all elements with class='box' and apply these styles."</p>
        
        <h4>🌍 Real-World Applications:</h4>
        <ul>
          <li><strong>Cards:</strong> Product cards need padding so text isn't touching the edges</li>
          <li><strong>Buttons:</strong> Padding makes buttons bigger and easier to click</li>
          <li><strong>Spacing:</strong> Margin creates gaps between sections of a page</li>
          <li><strong>Layout:</strong> Understanding the box model is essential for precise layouts</li>
        </ul>
        
        <h4>✨ Pro Tips:</h4>
        <ul>
          <li>You can set different values for each side: <code>padding: 10px 20px 10px 20px;</code> (top, right, bottom, left - clockwise!)</li>
          <li>Shorthand for top/bottom and left/right: <code>padding: 10px 20px;</code> (first is top/bottom, second is left/right)</li>
          <li>Browser DevTools (F12) lets you VISUALIZE the box model - try it!</li>
          <li>Use <code>box-sizing: border-box;</code> to make width calculations easier (padding included in width)</li>
        </ul>
      `,
      starterCode: `<style></style>\n<div class="box">Box</div>`,
      solution: `<style>.box{padding:10px;margin:10px;border:1px solid #333}</style>\n<div class="box">Box</div>`,
      hints: [
        "Use .box (dot means class) as the selector",
        "All three properties go inside the { } braces",
        "Border helps you see the padding and margin!",
      ],
      tests: [
        "Must use padding property",
        "Must use margin property",
        "Must target the .box class selector",
      ],
      concepts: ["Box Model", "Padding", "Margin", "Class Selectors"],
    },
    {
      id: "css-04",
      title: "Center with Flexbox",
      category: "CSS",
      difficulty: "beginner",
      xp: 105,
      description: "Learn the modern way to center content with Flexbox.",
      instructions: `
        <h4>📚 What is Flexbox?</h4>
        <p>Flexbox (Flexible Box Layout) is a modern CSS layout system that revolutionized how we arrange elements. It makes tasks that used to be difficult (like centering, equal spacing, responsive layouts) incredibly easy!</p>
        <p><strong>Key concept:</strong> Flexbox works with a <strong>container</strong> (parent element) and <strong>items</strong> (children). You apply flex properties to the container to control how its children are arranged.</p>
        
        <h4>🏗️ How Flexbox Works</h4>
        <p>When you set <code>display: flex;</code> on a container, it becomes a <strong>flex container</strong> and gains superpowers for arranging its children!</p>
        <p>Flexbox has two axes (directions):</p>
        <ul>
          <li><strong>Main axis</strong> - horizontal by default (left to right)</li>
          <li><strong>Cross axis</strong> - vertical by default (top to bottom)</li>
        </ul>
        
        <h4>� Centering with Flexbox - The Three Properties</h4>
        <p>To perfectly center content both horizontally AND vertically, you need THREE properties on the CONTAINER:</p>
        <ol>
          <li><code>display: flex;</code> 
            <ul><li>Activates flexbox layout mode</li>
            <li>This is REQUIRED - without it, the other properties won't work</li></ul>
          </li>
          <li><code>justify-content: center;</code> 
            <ul><li>Centers items along the <strong>main axis</strong> (horizontally)</li>
            <li>Think "justify" like text justification</li>
            <li>Other values: flex-start (left), flex-end (right), space-between, space-around</li></ul>
          </li>
          <li><code>align-items: center;</code> 
            <ul><li>Centers items along the <strong>cross axis</strong> (vertically)</li>
            <li>Think "align" like vertical alignment</li>
            <li>Other values: flex-start (top), flex-end (bottom), stretch</li></ul>
          </li>
        </ol>
        
        <h4>🎯 Your Task</h4>
        <p>Style the <code>.container</code> class to center its content perfectly:</p>
        <ol>
          <li>Add <code>display: flex;</code> - turns on flexbox</li>
          <li>Add <code>justify-content: center;</code> - centers horizontally</li>
          <li>Add <code>align-items: center;</code> - centers vertically</li>
          <li>Add <code>min-height: 200px;</code> - gives the container enough height to see the centering</li>
          <li>Add <code>background: #222;</code> - dark background so you can see the centered content</li>
        </ol>
        
        <h4>💻 What Your CSS Should Look Like:</h4>
        <pre><code>&lt;style&gt;
.container {
  display: flex;              /* Activate flexbox */
  justify-content: center;    /* Center horizontally */
  align-items: center;        /* Center vertically */
  min-height: 200px;          /* Give height to see effect */
  background: #222;           /* Dark background */
}
&lt;/style&gt;</code></pre>
        
        <h4>🔍 Memory Trick</h4>
        <p><strong>justify-content</strong> = horizontal (think of justified text - left/right)</p>
        <p><strong>align-items</strong> = vertical (think of aligning things top/bottom)</p>
        
        <h4>💡 Why Flexbox Changed Everything</h4>
        <p>Before flexbox (pre-2015), centering content vertically required:</p>
        <ul>
          <li>Complicated positioning hacks</li>
          <li>Knowing the exact height of elements</li>
          <li>Using tables (bad practice)</li>
          <li>JavaScript calculations</li>
        </ul>
        <p><strong>Now with flexbox:</strong> It's just 3 simple CSS properties! This is why developers love it.</p>
        
        <h4>🌐 Real-World Uses:</h4>
        <ul>
          <li><strong>Hero sections:</strong> Centering headline and button on landing pages</li>
          <li><strong>Cards:</strong> Aligning content inside card components</li>
          <li><strong>Navigation bars:</strong> Spacing and aligning menu items</li>
          <li><strong>Modal dialogs:</strong> Centering popup boxes on screen</li>
          <li><strong>Loading spinners:</strong> Centering loading indicators</li>
        </ul>
        
        <h4>✨ Pro Tips:</h4>
        <ul>
          <li><code>flex-direction: column;</code> switches the axes (vertical becomes main axis)</li>
          <li><code>gap: 20px;</code> adds spacing between flex items</li>
          <li>Flexbox only affects DIRECT children, not grandchildren</li>
          <li>Use browser DevTools to experiment with different flex values</li>
        </ul>
      `,
      starterCode: `<style></style>\n<div class="container"><div>Center me</div></div>`,
      solution: `<style>.container{display:flex;align-items:center;justify-content:center;min-height:200px;background:#222}</style>\n<div class="container"><div>Center me</div></div>`,
      hints: [
        "All properties go on the .container (the parent)",
        "justify-content controls horizontal",
        "align-items controls vertical",
      ],
      tests: [
        "Must use display property",
        "Must set display to flex",
        "Must use justify-content property",
        "Must use align-items property",
      ],
      concepts: ["Flexbox", "Centering", "Layout"],
    },
    {
      id: "css-05",
      title: "Create a Grid",
      category: "CSS",
      difficulty: "intermediate",
      xp: 135,
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
      tests: [
        "Must use display property",
        "Must set display to grid",
        "Must use grid-template-columns property",
      ],
      concepts: ["CSS Grid", "Layout", "fr units"],
    },
    {
      id: "css-06",
      title: "Responsive Image",
      category: "CSS",
      difficulty: "intermediate",
      xp: 120,
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
      tests: [
        "Must use max-width property",
        "Must set max-width to 100%",
        "Must use height property",
        "Must set height to auto",
      ],
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
      xp: 105,
      description: "Write your first JavaScript code!",
      instructions: `
        <h4>📚 What is JavaScript?</h4>
        <p>JavaScript makes websites <strong>interactive</strong> and <strong>dynamic</strong>! While HTML creates the structure (like building a house) and CSS adds the style (like painting and decorating), JavaScript adds <strong>behavior</strong> - making things respond to clicks, load data, animate, calculate, and more!</p>
        <p><strong>JavaScript runs in the browser</strong> - it executes right on the user's computer, making websites feel responsive and alive.</p>
        
        <h4>🏗️ What are Variables?</h4>
        <p>Variables are like <strong>labeled boxes</strong> that store information you want to use later. Just like you might put your phone in a box labeled "Phone", you put data in a variable with a name.</p>
        <p>JavaScript has THREE ways to declare variables:</p>
        <ul>
          <li><code>const</code> = <strong>constant</strong> (value CAN'T be changed after set)
            <ul><li>Use for values that stay the same (like your birthdate, API keys, fixed configurations)</li></ul>
          </li>
          <li><code>let</code> = <strong>variable</strong> (value CAN be changed)
            <ul><li>Use for values that will change (like counters, user input, calculated results)</li></ul>
          </li>
          <li><code>var</code> = <strong>old way</strong> (has confusing scope rules)
            <ul><li>DON'T USE THIS - it's outdated and causes bugs. Use const/let instead!</li></ul>
          </li>
        </ul>
        
        <h4>📝 Variable Syntax:</h4>
        <pre><code>const variableName = 'value';
let anotherVariable = 42;</code></pre>
        <p>Breaking it down:</p>
        <ul>
          <li><code>const</code> or <code>let</code> = keyword that declares the variable</li>
          <li><code>variableName</code> = the name you choose (use descriptive names!)</li>
          <li><code>=</code> = assignment operator (means "store this value")</li>
          <li><code>'value'</code> = the data you're storing (text in quotes, numbers without)</li>
          <li><code>;</code> = semicolon ends the statement</li>
        </ul>
        
        <h4>🎯 Your Task</h4>
        <p>Write JavaScript to display your name on the page. Follow these steps:</p>
        <ol>
          <li>Create a variable using <code>const name = 'YourName';</code> (replace YourName with any name)</li>
          <li>Find the paragraph element by its ID: <code>document.getElementById('out')</code></li>
          <li>Change its text content: <code>.textContent = name;</code></li>
        </ol>
        
        <h4>💻 Complete Code Example:</h4>
        <pre><code>&lt;script&gt;
// Step 1: Store a name in a variable
const name = 'Alex';

// Step 2 & 3: Find the paragraph and set its text
document.getElementById('out').textContent = name;
&lt;/script&gt;</code></pre>
        
        <h4>� Breaking Down the DOM Manipulation:</h4>
        <ul>
          <li><code>document</code> = represents the entire HTML page (the "document")</li>
          <li><code>.getElementById('out')</code> = finds an HTML element with <code>id="out"</code></li>
          <li><code>.textContent</code> = property that controls the text inside an element</li>
          <li><code>= name</code> = sets the text to whatever is stored in the name variable</li>
        </ul>
        
        <h4>💡 How It Works (Step by Step):</h4>
        <ol>
          <li>JavaScript creates a variable called <code>name</code> and stores a text value in it</li>
          <li>JavaScript looks through the HTML document to find an element with <code>id="out"</code></li>
          <li>When found, it changes that element's text to display the value from the <code>name</code> variable</li>
          <li>The page updates instantly to show the new text!</li>
        </ol>
        
        <h4>🌐 Real-World Examples:</h4>
        <ul>
          <li><strong>Personalization:</strong> Displaying logged-in user's name: "Welcome back, Sarah!"</li>
          <li><strong>Calculations:</strong> Storing shopping cart total: <code>let total = 99.99;</code></li>
          <li><strong>Settings:</strong> Storing user preferences: <code>const theme = 'dark';</code></li>
          <li><strong>API data:</strong> Storing fetched data: <code>const userData = response.data;</code></li>
        </ul>
        
        <h4>✨ Pro Tips:</h4>
        <ul>
          <li><strong>Naming:</strong> Use descriptive names (firstName not x, totalPrice not t)</li>
          <li><strong>camelCase:</strong> JavaScript convention: myVariableName (first word lowercase, capitalize rest)</li>
          <li><strong>const by default:</strong> Always use const unless you KNOW the value will change, then use let</li>
          <li><strong>String quotes:</strong> Use single quotes 'text' or double quotes "text" - they're the same!</li>
        </ul>
      `,
      starterCode: `<p id="out"></p>\n<script>\n// Your JS here\n</script>`,
      solution: `<p id="out"></p>\n<script>const name='Coder';document.getElementById('out').textContent=name;</script>`,
      hints: [
        "Start with: const name = 'YourName';",
        "Use document.getElementById('out') to find the paragraph",
        "Set .textContent = name; to display it",
      ],
      tests: [
        "Must use document method",
        "Must declare variable with const or let",
      ],
      concepts: ["Variables", "DOM", "JavaScript Basics"],
    },
    {
      id: "js-02",
      title: "Click Counter",
      category: "JavaScript",
      difficulty: "beginner",
      xp: 120,
      description: "Learn event handling by building a click counter.",
      instructions: `
        <h4>📚 Events in JavaScript - Making Things Interactive!</h4>
        <p><strong>Events</strong> are things that happen in the browser that JavaScript can detect and respond to. Every interaction on a website triggers an event:</p>
        <ul>
          <li>User clicks a button → <code>click</code> event</li>
          <li>User types in a text box → <code>keypress</code> event</li>
          <li>User moves the mouse → <code>mousemove</code> event</li>
          <li>Page finishes loading → <code>load</code> event</li>
        </ul>
        <p>JavaScript can "listen" for these events and run code when they happen. This is what makes websites interactive!</p>
        
        <h4>🏗️ Event Listeners - How to Respond to Events</h4>
        <p>To make JavaScript respond to an event, you use <code>addEventListener</code>. It's like setting up a guard who watches for something specific to happen:</p>
        <pre><code>element.addEventListener('eventType', function() {
  // Your code here runs when event happens
});</code></pre>
        
        <h4>🔍 Breaking Down the Syntax:</h4>
        <ul>
          <li><code>element</code> = the HTML element you want to watch (like a button)</li>
          <li><code>.addEventListener()</code> = method that sets up the listener</li>
          <li><code>'click'</code> = the type of event to listen for (in quotes!)</li>
          <li><code>function() { }</code> = the code to run when the event happens (called a "callback function")</li>
        </ul>
        
        <h4>🎯 Your Task - Build a Click Counter</h4>
        <p>Create a counter that increases each time you click a button. Here's what you need to do:</p>
        <ol>
          <li><strong>Create a counter variable:</strong> <code>let count = 0;</code> (starts at 0, uses let because it will change)</li>
          <li><strong>Find the button:</strong> <code>document.getElementById('btn')</code></li>
          <li><strong>Add a click listener:</strong> Use <code>.addEventListener('click', function)</code></li>
          <li><strong>Inside the function:</strong>
            <ul>
              <li>Increase the counter: <code>count++;</code> (shorthand for count = count + 1)</li>
              <li>Update the display: <code>document.getElementById('count').textContent = count;</code></li>
            </ul>
          </li>
        </ol>
        
        <h4>💻 Complete Code Example:</h4>
        <pre><code>&lt;script&gt;
// Step 1: Create a counter variable
let count = 0;

// Step 2-3: Find button and add click listener
document.getElementById('btn').addEventListener('click', function() {
  // Step 4a: Increase the counter
  count++;
  
  // Step 4b: Update the display
  document.getElementById('count').textContent = count;
});
&lt;/script&gt;</code></pre>
        
        <h4>� Modern Arrow Function Syntax (Shortcut):</h4>
        <pre><code>document.getElementById('btn').addEventListener('click', () => {
  count++;
  document.getElementById('count').textContent = count;
});</code></pre>
        <p><code>() => { }</code> is shorthand for <code>function() { }</code> - they do the same thing!</p>
        
        <h4>�💡 Why 'let' instead of 'const'?</h4>
        <p>We use <code>let count = 0;</code> because the count value CHANGES every time you click. If you tried <code>const count = 0;</code>, JavaScript would throw an error when you try to do <code>count++</code> because constants can't be changed!</p>
        
        <h4>🔢 Understanding count++:</h4>
        <p><code>count++</code> is a shorthand operator that means "increase this number by 1"</p>
        <ul>
          <li><code>count++</code> is the same as <code>count = count + 1</code></li>
          <li><code>count--</code> would decrease by 1</li>
          <li><code>count += 5</code> would increase by 5</li>
        </ul>
        
        <h4>🌐 Real-World Examples:</h4>
        <ul>
          <li><strong>Like buttons:</strong> Counting likes on social media posts</li>
          <li><strong>Shopping carts:</strong> Quantity increase/decrease buttons</li>
          <li><strong>Game scores:</strong> Tracking points in browser games</li>
          <li><strong>Form validation:</strong> Responding when user submits a form</li>
          <li><strong>Image galleries:</strong> Next/previous button clicks</li>
        </ul>
        
        <h4>✨ Pro Tips:</h4>
        <ul>
          <li>You can listen for many event types: 'mouseover', 'keydown', 'submit', 'change', etc.</li>
          <li>One element can have multiple event listeners</li>
          <li>You can remove listeners with <code>removeEventListener</code></li>
          <li>Use <code>event.preventDefault()</code> to stop default browser behavior</li>
        </ul>
      `,
      starterCode: `<button id="btn">Click</button> <span id="count">0</span>\n<script>// code</script>`,
      solution: `<button id="btn">Click</button> <span id="count">0</span>\n<script>let c=0;document.getElementById('btn').addEventListener('click',()=>{c++;document.getElementById('count').textContent=c;});</script>`,
      hints: [
        "Get the button with getElementById('btn')",
        "addEventListener('click', function)",
        "Increment the counter inside: count++",
      ],
      tests: [
        "Must use addEventListener method",
        "Must update textContent property",
      ],
      concepts: ["Events", "Event Listeners", "State"],
    },
    {
      id: "js-03",
      title: "Conditionals",
      category: "JavaScript",
      difficulty: "beginner",
      xp: 120,
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
      tests: [
        "Must create an 'age' variable",
        "Must use >= comparison operator",
      ],
      concepts: ["Conditionals", "If/Else", "Comparison Operators"],
    },
    {
      id: "js-04",
      title: "Arrays & Loops",
      category: "JavaScript",
      difficulty: "beginner",
      xp: 135,
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
      tests: [
        "Must create an array with square brackets",
        "Must use the .map() method",
        "Must generate &lt;li&gt; tags",
      ],
      concepts: ["Arrays", "Array Methods", "Loops", "DOM"],
    },
    {
      id: "js-05",
      title: "Local Storage",
      category: "JavaScript",
      difficulty: "intermediate",
      xp: 150,
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
      tests: [
        "Must use localStorage object",
        "Must call setItem() method",
        "Must call getItem() method",
      ],
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
      xp: i < 14 ? 90 : 120,
      description: "Practice HTML elements and structure.",
      instructions:
        "<p>Create a small page using headings, paragraphs, and lists. For project: build a simple profile card.</p>",
      starterCode: "",
      solution: "<div><h2>Title</h2><p>Text</p><ul><li>One</li></ul></div>",
      hints: ["Use headings, lists, and semantic tags."],
      tests: [
        "Must contain a heading tag",
        "Must contain a paragraph tag",
        "Must contain a list element",
      ],
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
      xp: i < 11 ? 90 : 135,
      description: "Practice common CSS patterns and layouts.",
      instructions:
        "<p>Style elements with spacing, colors, and layout. For project: hero with title, subtitle, and button.</p>",
      starterCode:
        '<style></style>\n<div class="hero"><h1>Title</h1><p>Subtitle</p><button>Get Started</button></div>',
      solution:
        '<style>.hero{padding:32px;background:#222;color:#fff}.hero button{background:#667eea;color:#fff;padding:10px 16px;border:none;border-radius:6px}</style>\n<div class="hero"><h1>Title</h1><p>Subtitle</p><button>Get Started</button></div>',
      hints: ["Use padding, colors, and border-radius."],
      tests: [
        "Must use padding property",
        "Must use background property",
        "Must style button element",
      ],
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
      xp: i < 11 ? 135 : 165,
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
      tests: [
        "Must use document methods",
        "Must use addEventListener",
        "Must create or manipulate elements",
      ],
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
      xp: 150,
      description:
        "Learn what React is and create your first functional component.",
      instructions: `
        <h4>📚 What is React?</h4>
        <p>React is a JavaScript <strong>library</strong> (not a language!) created by Facebook for building user interfaces. It's used by millions of websites including Facebook, Instagram, Netflix, Airbnb, and more!</p>
        <p><strong>Key concept:</strong> React lets you build websites using <strong>reusable components</strong> - like building with LEGO blocks instead of drawing everything from scratch.</p>
        
        <h4>🧩 What are Components?</h4>
        <p>Think of components as <strong>custom HTML elements</strong> that you create. Instead of just using <code>&lt;div&gt;</code> and <code>&lt;p&gt;</code>, you can create your own tags like <code>&lt;WelcomeMessage /&gt;</code> or <code>&lt;ShoppingCart /&gt;</code>!</p>
        <p>Benefits of components:</p>
        <ul>
          <li><strong>Reusable:</strong> Write once, use everywhere (like a button component used 50 times)</li>
          <li><strong>Maintainable:</strong> Fix bugs in one place, fixed everywhere</li>
          <li><strong>Organized:</strong> Break complex UIs into small, manageable pieces</li>
        </ul>
        
        <h4>🏗️ Two Types of Components:</h4>
        <ul>
          <li><strong>Class components:</strong> Older way (uses ES6 classes) - you'll see this in legacy code</li>
          <li><strong>Functional components:</strong> Modern way (uses functions) - what we use now! Simpler and cleaner</li>
        </ul>
        
        <h4>📝 Functional Component Syntax:</h4>
        <pre><code>function ComponentName() {
  return &lt;h1&gt;Hello!&lt;/h1&gt;;
}</code></pre>
        <p>Breaking it down:</p>
        <ul>
          <li><code>function</code> = regular JavaScript function keyword</li>
          <li><code>ComponentName</code> = name of your component (<strong>MUST start with capital letter!</strong>)</li>
          <li><code>return</code> = what the component displays/outputs</li>
          <li><code>&lt;h1&gt;Hello!&lt;/h1&gt;</code> = JSX (looks like HTML but it's JavaScript)</li>
        </ul>
        
        <h4>🎯 Your Task</h4>
        <p>Create your first React component called <code>Welcome</code> that displays a heading:</p>
        <ol>
          <li>Declare a function named <code>Welcome</code> (capital W is important!)</li>
          <li>Inside the function, use <code>return</code></li>
          <li>Return an <code>&lt;h1&gt;</code> tag with the text "Welcome to React!"</li>
          <li>Don't forget the semicolon after the return statement</li>
        </ol>
        
        <h4>💻 What Your Code Should Look Like:</h4>
        <pre><code>function Welcome() {
  return &lt;h1&gt;Welcome to React!&lt;/h1&gt;;
}</code></pre>
        
        <h4>💡 Why Capital Letter Names?</h4>
        <p>React REQUIRES component names to start with a capital letter. This is how React tells the difference between:</p>
        <ul>
          <li><code>&lt;div&gt;</code> = regular HTML element (lowercase)</li>
          <li><code>&lt;Welcome /&gt;</code> = your custom React component (capital)</li>
        </ul>
        <p>If you write <code>function welcome()</code> (lowercase), React won't recognize it as a component!</p>
        
        <h4>🔍 What is JSX?</h4>
        <p>JSX (JavaScript XML) is the HTML-like syntax you see inside the return statement. It's not actually HTML - it's JavaScript that <strong>looks like</strong> HTML!</p>
        <ul>
          <li>Under the hood, <code>&lt;h1&gt;Hello&lt;/h1&gt;</code> becomes <code>React.createElement('h1', null, 'Hello')</code></li>
          <li>JSX makes React code much easier to read and write</li>
          <li>Your build tools (like Vite or Create React App) convert JSX to regular JavaScript</li>
        </ul>
        
        <h4>🌐 Real-World Component Examples:</h4>
        <ul>
          <li><code>Header</code> - Navigation bar at top of site</li>
          <li><code>Button</code> - Reusable button with consistent styling</li>
          <li><code>Card</code> - Product cards, user profiles, article previews</li>
          <li><code>Footer</code> - Bottom section with links and copyright</li>
          <li><code>Modal</code> - Popup dialog boxes</li>
        </ul>
        
        <h4>✨ Pro Tips:</h4>
        <ul>
          <li>Component names should be descriptive: <code>UserProfile</code> not <code>Comp1</code></li>
          <li>Keep components small and focused (one job per component)</li>
          <li>A typical React app has dozens or hundreds of components</li>
          <li>Components can render other components (nesting)</li>
        </ul>
      `,
      starterCode: `function Welcome() {\n  // Your code here\n}\n`,
      solution: `function Welcome() {\n  return <h1>Welcome to React!</h1>;\n}`,
      hints: [
        "Function should return JSX",
        "Use return <h1>Welcome to React!</h1>;",
        "Don't forget the semicolon",
      ],
      tests: [
        "Must declare a function named Welcome",
        "Must return JSX",
        "Must contain an &lt;h1&gt; tag",
      ],
      concepts: ["Components", "JSX", "Functions"],
    },
    {
      id: "react-02",
      title: "Understanding JSX",
      category: "React",
      difficulty: "beginner",
      xp: 150,
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
      tests: [
        "Must return JSX",
        "Must contain a &lt;div&gt; wrapper",
        "Must contain an &lt;h2&gt; heading",
        "Must contain a &lt;p&gt; paragraph",
      ],
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
      xp: i < 8 ? 150 : i < 15 ? 180 : 210,
      description:
        i === 20
          ? "Build a complete todo app with React"
          : "Practice React concepts and hooks.",
      instructions:
        "<p>Learn React patterns, state management, and component composition.</p>",
      starterCode: "function App() {\n  // Your code\n}\n",
      solution: "function App() { return <div>Solution</div>; }",
      hints: ["Use React hooks", "Think about component structure"],
      tests: [
        "Must declare a component function",
        "Must return JSX",
        "Must use React patterns",
      ],
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
      xp: 180,
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
      xp: i < 6 ? 60 : 70,
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
      tests: [
        "Must export default a page component",
        "Must declare a function",
        "Must return JSX",
      ],
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
      xp: 135,
      description: "Learn what SQL is and write your first SELECT query.",
      instructions: `
        <h4>📚 What is SQL?</h4>
        <p>SQL (Structured Query Language, pronounced "sequel" or "S-Q-L") is the universal language for talking to databases. It's used to store, retrieve, update, and manage data.</p>
        <p><strong>MySQL</strong> is one specific <strong>database system</strong> that uses SQL. Others include PostgreSQL, SQLite, Oracle, and SQL Server - they all use similar SQL syntax!</p>
        
        <h4>🗄️ What are Databases and Tables?</h4>
        <p>Think of a database like an Excel spreadsheet:</p>
        <ul>
          <li><strong>Database</strong> = The entire Excel file (contains multiple sheets)</li>
          <li><strong>Table</strong> = A single sheet (like "Users" or "Products")</li>
          <li><strong>Row</strong> = One record (like one user: John, age 25, email@example.com)</li>
          <li><strong>Column</strong> = One field/attribute (like "name", "age", "email")</li>
        </ul>
        
        <h4>🏗️ The SELECT Statement - Reading Data</h4>
        <p>The <code>SELECT</code> statement is how you retrieve (read) data from a database. It's like asking the database a question: "Show me information from this table."</p>
        <p>Basic syntax:</p>
        <pre><code>SELECT column_names FROM table_name;</code></pre>
        
        <h4>🔍 Breaking Down the Syntax:</h4>
        <ul>
          <li><code>SELECT</code> = SQL keyword that means "I want to retrieve data"</li>
          <li><code>column_names</code> = Which columns (fields) you want to see
            <ul>
              <li>List specific columns: <code>SELECT name, email</code></li>
              <li>Or use <code>*</code> (asterisk) to mean "all columns"</li>
            </ul>
          </li>
          <li><code>FROM</code> = SQL keyword that means "from which table"</li>
          <li><code>table_name</code> = The name of the table to query</li>
          <li><code>;</code> = Semicolon ends the SQL statement</li>
        </ul>
        
        <h4>🎯 Your Task</h4>
        <p>Write a query to select ALL columns from a table called <code>users</code>:</p>
        <ol>
          <li>Start with the <code>SELECT</code> keyword</li>
          <li>Use <code>*</code> to mean "all columns"</li>
          <li>Add <code>FROM users</code> to specify the table</li>
          <li>End with a semicolon <code>;</code></li>
        </ol>
        
        <h4>💻 What Your Query Should Look Like:</h4>
        <pre><code>SELECT * FROM users;</code></pre>
        
        <h4>📖 Reading This Query in Plain English:</h4>
        <p>"Select all columns (*) from the users table"</p>
        <p>This would return every column and every row in the users table - all the data!</p>
        
        <h4>💡 Understanding the Asterisk (*)</h4>
        <p>The <code>*</code> symbol is a wildcard that means "everything" or "all columns". It's a shortcut so you don't have to type:</p>
        <pre><code>SELECT id, name, email, age, city, created_at FROM users;</code></pre>
        <p>You can just type:</p>
        <pre><code>SELECT * FROM users;</code></pre>
        
        <h4>� Common SELECT Variations:</h4>
        <pre><code>-- Get all columns from users table
SELECT * FROM users;

-- Get only specific columns
SELECT name, email FROM users;

-- Get one column
SELECT name FROM users;</code></pre>
        <p><em>Note: Lines starting with <code>--</code> are comments (explanations, not executed)</em></p>
        
        <h4>🌐 Real-World Examples:</h4>
        <ul>
          <li><strong>E-commerce:</strong> <code>SELECT * FROM products;</code> - show all products</li>
          <li><strong>Social media:</strong> <code>SELECT * FROM posts;</code> - show all posts</li>
          <li><strong>Blog:</strong> <code>SELECT title, author FROM articles;</code> - show article titles and authors</li>
          <li><strong>User management:</strong> <code>SELECT username, email FROM users;</code> - list all users</li>
        </ul>
        
        <h4>✨ Pro Tips:</h4>
        <ul>
          <li>SQL keywords are NOT case-sensitive (<code>SELECT</code> = <code>select</code>), but UPPERCASE is convention</li>
          <li>Table and column names ARE case-sensitive on some systems</li>
          <li>In production, avoid <code>SELECT *</code> - it's better to specify only needed columns for performance</li>
          <li>Always end SQL statements with semicolon <code>;</code></li>
          <li>You can split queries across multiple lines for readability</li>
        </ul>
        
        <h4>🚀 What's Next?</h4>
        <p>Once you master SELECT, you'll learn:</p>
        <ul>
          <li><code>WHERE</code> - Filter results (only users over 18)</li>
          <li><code>ORDER BY</code> - Sort results (alphabetically, by date, etc.)</li>
          <li><code>JOIN</code> - Combine data from multiple tables</li>
          <li><code>INSERT</code> - Add new data</li>
          <li><code>UPDATE</code> - Modify existing data</li>
          <li><code>DELETE</code> - Remove data</li>
        </ul>
      `,
      starterCode: `-- Write your SQL query here\n`,
      solution: `SELECT * FROM users;`,
      hints: [
        "Use SELECT * to get all columns",
        "Specify FROM users",
        "Don't forget the semicolon",
      ],
      tests: [
        "Must use SELECT keyword",
        "Must select all columns with *",
        "Must use FROM clause",
        "Must query the users table",
      ],
      concepts: ["SQL", "SELECT", "Queries"],
    },
    {
      id: "mysql-02",
      title: "Filtering with WHERE",
      category: "MySQL",
      difficulty: "beginner",
      xp: 135,
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
      tests: [
        "Must use SELECT keyword",
        "Must use FROM clause",
        "Must use WHERE clause",
        "Must filter by age column",
        "Must use > comparison operator",
      ],
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
      xp: i < 6 ? 45 : i < 11 ? 55 : 65,
      description:
        i === 15
          ? "Design and query a complete e-commerce database"
          : "Practice SQL queries, joins, and database design.",
      instructions:
        "<p>Master SQL concepts like JOINs, GROUP BY, indexes, and transactions.</p>",
      starterCode: "-- Write your SQL query\n",
      solution: "SELECT * FROM table;",
      hints: ["Think about table relationships", "Use proper SQL syntax"],
      tests: [
        "Must write a valid SQL query",
        "Must use appropriate SQL keywords",
        "Query should match the requirements",
      ],
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
      xp: 150,
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
      tests: [
        "Must use SELECT keyword",
        "Must use FROM clause",
        "Must use ORDER BY clause",
        "Must sort in DESC (descending) order",
      ],
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
      xp: i < 6 ? 50 : i < 11 ? 60 : 70,
      description:
        i === 15
          ? "Build an analytics database with advanced queries"
          : "Practice PostgreSQL features, JSON handling, and window functions.",
      instructions:
        "<p>Master PostgreSQL-specific features like JSON, CTEs, and window functions.</p>",
      starterCode: "-- Write your query\n",
      solution: "SELECT * FROM table;",
      hints: ["Use PostgreSQL syntax", "Leverage advanced features"],
      tests: [
        "Must write a valid PostgreSQL query",
        "Must use appropriate SQL syntax",
        "Query should match the requirements",
      ],
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
      xp: 135,
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
      tests: [
        "Must use CREATE TABLE statement",
        "Must name the table 'notes'",
        "Must use INTEGER data type",
        "Must use TEXT data type",
      ],
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
      xp: i < 6 ? 135 : i < 11 ? 165 : 195,
      description:
        i === 15
          ? "Design a complete mobile app database schema"
          : "Practice SQLite-specific features and optimization.",
      instructions:
        "<p>Master SQLite for embedded and mobile applications.</p>",
      starterCode: "-- Write your SQLite command\n",
      solution: "SELECT * FROM table;",
      hints: ["Use SQLite syntax", "Think about mobile constraints"],
      tests: [
        "Must write a valid SQLite query",
        "Must use appropriate SQL syntax",
        "Query should match the requirements",
      ],
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
