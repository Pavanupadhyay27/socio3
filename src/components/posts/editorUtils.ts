export const insertAtCursor = (textarea: HTMLTextAreaElement, before: string, after: string = '') => {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selectedText = textarea.value.substring(start, end);
  const beforeText = textarea.value.substring(0, start);
  const afterText = textarea.value.substring(end);

  let newText = '';
  let newCursorPos = 0;

  // If text is already selected
  if (selectedText) {
    newText = beforeText + before + selectedText + after + afterText;
    newCursorPos = start + before.length + selectedText.length + (after ? after.length : 0);
  } else {
    // Add a new line for block elements
    const needsNewLine = ['# ', '* ', '1. ', '> ', '```'];
    const isBlockElement = needsNewLine.some(el => before.startsWith(el));
    const addNewLine = isBlockElement && !beforeText.endsWith('\n');
    
    // If at start of line or needs new line
    if (start === 0 || beforeText.endsWith('\n') || addNewLine) {
      newText = beforeText + (addNewLine ? '\n' : '') + before + after + afterText;
      newCursorPos = start + before.length + (addNewLine ? 1 : 0);
    } else {
      // For inline elements
      newText = beforeText + ' ' + before + after + afterText;
      newCursorPos = start + 1 + before.length;
    }
  }

  return {
    text: newText,
    cursorPos: newCursorPos
  };
};

export const formatText = (textarea: HTMLTextAreaElement, format: string) => {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selectedText = textarea.value.substring(start, end);
  const currentLine = textarea.value.substring(0, end).split('\n').pop() || '';

  let result;
  switch (format) {
    case 'bold':
      result = insertAtCursor(textarea, '**', selectedText ? '**' : '');
      break;
    case 'italic':
      result = insertAtCursor(textarea, '_', selectedText ? '_' : '');
      break;
    case 'strikethrough':
      result = insertAtCursor(textarea, '~~', selectedText ? '~~' : '');
      break;
    case 'heading':
      // Don't add multiple #s
      if (!currentLine.startsWith('# ')) {
        result = insertAtCursor(textarea, '# ');
      }
      break;
    case 'link':
      if (selectedText) {
        result = insertAtCursor(textarea, '[', '](url)');
      } else {
        result = insertAtCursor(textarea, '[Link text](', ')');
      }
      break;
    case 'bulletList':
      result = insertAtCursor(textarea, '* ');
      break;
    case 'numberList':
      result = insertAtCursor(textarea, '1. ');
      break;
    case 'quote':
      result = insertAtCursor(textarea, '> ');
      break;
    case 'code':
      result = insertAtCursor(textarea, '`', selectedText ? '`' : '');
      break;
    case 'codeBlock':
      if (selectedText) {
        result = insertAtCursor(textarea, '```\n', '\n```');
      } else {
        result = insertAtCursor(textarea, '```\ncode here\n', '```');
      }
      break;
    case 'table':
      result = insertAtCursor(textarea, 
        '| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |\n'
      );
      break;
    default:
      return textarea.value;
  }

  return result;
};
