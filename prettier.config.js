module.exports = {
    plugins: ['prettier-plugin-tailwindcss', 'prettier'],
    printWidth: 80, // Reduce line width for better readability
    tabWidth: 3, // Use 2 spaces for indentation
    useTabs: false, // Use spaces instead of tabs
    semi: true, // Add semicolons at the ends of statements
    singleQuote: true, // Use single quotes instead of double quotes
    trailingComma: 'all', // Add trailing commas wherever possible
    bracketSpacing: true, // Add spaces between brackets in object literals
    jsxBracketSameLine: false, // Put the > of a multi-line JSX element at the end of the last line
    arrowParens: 'always', // Always include parentheses around arrow function parameters
    endOfLine: 'lf', // Use line feed only (\n) for newlines
    proseWrap: 'always', // Wrap prose if it exceeds the print width
    htmlWhitespaceSensitivity: 'strict' // Respect the whitespace sensitivity of HTML
  };