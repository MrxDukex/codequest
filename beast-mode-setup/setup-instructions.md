# Beast Mode Setup Instructions

This guide provides step-by-step instructions for setting up Beast Mode in both VS Code GitHub Copilot and Cline.

## VS Code GitHub Copilot Setup

### Step 1: Locate VS Code User Data Folder

The location depends on your operating system:

**Windows:**

```
%APPDATA%\Code\User\
```

**macOS:**

```
~/Library/Application Support/Code/User/
```

**Linux:**

```
~/.config/Code/User/
```

### Step 2: Install Beast Mode Chat Mode

1. Navigate to your VS Code User Data folder
2. Create a `chatmodes` directory if it doesn't exist
3. Copy `beastmode3.1.chatmode.md` to the `chatmodes` directory
4. The final path should be: `[User Data Folder]/chatmodes/beastmode3.1.chatmode.md`

### Step 3: Apply VS Code Settings

1. Open VS Code Settings (Ctrl/Cmd + ,)
2. Click the "Open Settings (JSON)" button (top right corner)
3. Add the settings from `vscode-settings.json` to your settings file:

```json
{
  "chat.tools.autoApprove": true,
  "chat.agent.maxRequests": 100,
  "chat.experimental.defaultAgent": "copilot",
  "chat.experimental.offtopic.enabled": true,
  "workbench.commandPalette.experimental.suggestCommands": true,
  "editor.experimental.asyncTokenization": true,
  "terminal.integrated.shellIntegration.enabled": true,
  "terminal.integrated.shellIntegration.decorationsEnabled": "both"
}
```

### Step 4: Set Up UI Instructions (Optional)

If you work with shadcn/ui:

1. Create a `.github/instructions/` directory in your project root
2. Copy `ui.instructions.md` to `.github/instructions/ui.instructions.md`

### Step 5: Restart and Test

1. Restart VS Code completely
2. Open the GitHub Copilot Chat panel
3. Click the agent dropdown (should show "Copilot" by default)
4. Select "Beast Mode 3.1" from the dropdown
5. Test with a simple query: "Help me understand how Beast Mode works"

## Cline Setup

### Step 1: Review Beast Mode Principles

1. Read through `cline-beast-mode-instructions.md` thoroughly
2. Understand the core principles and workflow
3. Familiarize yourself with the systematic approach

### Step 2: Apply Beast Mode Methodology

When working with Cline on complex tasks:

1. **Start with Research**: Always begin by researching the problem domain
2. **Create Todo Lists**: Use the markdown format for systematic tracking
3. **Work Incrementally**: Make small, testable changes
4. **Test Thoroughly**: Validate each step before proceeding

### Step 3: Use Beast Mode Prompting

Structure your requests to Cline using Beast Mode principles:

```
I need you to [describe the task]. Please follow Beast Mode methodology:

1. Research the current best practices for [technology/framework]
2. Create a detailed todo list for the implementation
3. Work through each step systematically
4. Test thoroughly at each stage
5. Validate the complete solution

Please use web_fetch to research current documentation and examples before starting.
```

## Verification and Testing

### VS Code Verification

1. **Chat Mode Available**: Beast Mode 3.1 appears in agent dropdown
2. **Auto-Approve Working**: Commands execute without manual approval
3. **Extended Sessions**: Agent continues working on complex tasks
4. **Internet Research**: Agent uses fetch tool for research

### Cline Verification

1. **Systematic Approach**: Cline follows the Beast Mode workflow
2. **Research First**: Uses web_fetch before implementing
3. **Todo Lists**: Creates and maintains progress tracking
4. **Thorough Testing**: Validates solutions comprehensively

## Troubleshooting

### VS Code Issues

**Beast Mode not appearing in dropdown:**

- Check file location: `[User Data]/chatmodes/beastmode3.1.chatmode.md`
- Restart VS Code completely
- Verify GitHub Copilot extension is active

**Auto-approve not working:**

- Check settings: `"chat.tools.autoApprove": true`
- Restart VS Code after changing settings
- Verify you're using Beast Mode (not default Copilot)

**Agent stops working on complex tasks:**

- Check: `"chat.agent.maxRequests": 100`
- Increase the number if needed
- Restart VS Code after changing settings

### Cline Issues

**Not following Beast Mode methodology:**

- Be explicit in your prompts about using Beast Mode approach
- Reference the specific workflow phases
- Remind Cline to create and maintain todo lists

**Not researching before implementing:**

- Explicitly request research using web_fetch
- Ask for current documentation and examples
- Emphasize the importance of up-to-date information

## Advanced Configuration

### Custom Search Engines

You can modify the search engine URLs in the Beast Mode files:

- Google: `https://www.google.com/search?q=your+search+query`
- Bing: `https://www.bing.com/search?q=your+search+query`
- DuckDuckGo: `https://duckduckgo.com/?q=your+search+query&t=h_&ia=web`

### Memory Management

For projects requiring persistent memory:

1. Create `.github/instructions/memory.instruction.md` in your project
2. Add the front matter:
   ```
   ---
   applyTo: "**"
   ---
   ```
3. Beast Mode will use this for project-specific memory

### Custom Instructions

Add project-specific instructions to `.github/instructions/`:

- `coding-standards.instruction.md` - Your coding standards
- `architecture.instruction.md` - Project architecture guidelines
- `testing.instruction.md` - Testing requirements and patterns

## Best Practices

### For VS Code

1. **Use Auto-Approve Carefully**: Only enable for trusted projects
2. **Monitor Resource Usage**: Beast Mode can be intensive
3. **Regular Updates**: Keep the chat mode file updated
4. **Backup Settings**: Save your VS Code settings configuration

### For Cline

1. **Clear Instructions**: Be explicit about using Beast Mode methodology
2. **Context Management**: Provide sufficient context for complex tasks
3. **Progress Monitoring**: Review todo lists and progress regularly
4. **Iterative Refinement**: Adjust approach based on results

## Support and Updates

### Getting Help

1. Check the troubleshooting section above
2. Review the original Beast Mode gist for updates
3. Verify your setup matches these instructions exactly
4. Test with simple tasks before complex ones

### Staying Updated

1. Monitor the original Beast Mode gist for updates
2. Update your chat mode files when new versions are released
3. Adjust VS Code settings as new features become available
4. Refine your Cline prompting based on experience

This setup will give you a powerful, systematic development workflow that leverages the best of both VS Code GitHub Copilot and Cline capabilities.
