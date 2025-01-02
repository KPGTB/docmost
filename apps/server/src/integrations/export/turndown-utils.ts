import * as TurndownService from '@joplin/turndown';
import * as TurndownPluginGfm from '@joplin/turndown-plugin-gfm';

const css = require('@adobe/css-tools');

export function turndown(html: string): string {
  const turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    hr: '---',
    bulletListMarker: '-',
  });
  const tables = TurndownPluginGfm.tables;
  const strikethrough = TurndownPluginGfm.strikethrough;
  const highlightedCodeBlock = TurndownPluginGfm.highlightedCodeBlock;

  turndownService.use([
    tables,
    strikethrough,
    highlightedCodeBlock,
    taskList,
    callout,
    preserveDetail,
    listParagraph,
    mathInline,
    mathBlock,
    iframeEmbed,
    codeBlock,
    tabs,
    tab,
  ]);
  const content = turndownService.turndown(html).replaceAll('<br>', ' ');

  return (
    "import Tabs from '@theme/Tabs';\nimport TabItem from '@theme/TabItem';\n" +
    content
  );
}

function listParagraph(turndownService: TurndownService) {
  turndownService.addRule('paragraph', {
    filter: ['p'],
    replacement: (content: any, node: HTMLInputElement) => {
      if (node.parentElement?.nodeName === 'LI') {
        return content;
      }

      return `\n\n${content}\n\n`;
    },
  });
}

function callout(turndownService: TurndownService) {
  turndownService.addRule('callout', {
    filter: function (node: HTMLInputElement) {
      return (
        node.nodeName === 'DIV' && node.getAttribute('data-type') === 'callout'
      );
    },
    replacement: function (content: any, node: HTMLInputElement) {
      const calloutType = node.getAttribute('data-callout-type');
      return `\n\n:::${calloutType}\n${content.trim()}\n:::\n\n`;
    },
  });
}

function tabs(turndownService: TurndownService) {
  turndownService.addRule('tabs', {
    filter: function (node: HTMLInputElement) {
      return (
        node.nodeName === 'DIV' && node.getAttribute('data-type') === 'tabs'
      );
    },
    replacement: function (content: any, node: HTMLInputElement) {
      return `\n\n<Tabs>\n${content.trim()}\n</Tabs>\n\n`;
    },
  });
}

function tab(turndownService: TurndownService) {
  turndownService.addRule('tab', {
    filter: function (node: HTMLInputElement) {
      return (
        node.nodeName === 'DIV' && node.getAttribute('data-type') === 'tab'
      );
    },
    replacement: function (content: any, node: HTMLInputElement) {
      const title = node.getAttribute('data-tab-title');
      return `\n\n<TabItem value='${title.toLowerCase().replaceAll(' ', '')}' label='${title}'>\n${content.trim()}\n</TabItem>\n\n`;
    },
  });
}

function taskList(turndownService: TurndownService) {
  turndownService.addRule('taskListItem', {
    filter: function (node: HTMLInputElement) {
      return (
        node.getAttribute('data-type') === 'taskItem' &&
        node.parentNode.nodeName === 'UL'
      );
    },
    replacement: function (content: any, node: HTMLInputElement) {
      const checkbox = node.querySelector(
        'input[type="checkbox"]',
      ) as HTMLInputElement;
      const isChecked = checkbox.checked;

      return `- ${isChecked ? '[x]' : '[ ]'}  ${content.trim()} \n`;
    },
  });
}

function preserveDetail(turndownService: TurndownService) {
  turndownService.addRule('preserveDetail', {
    filter: function (node: HTMLInputElement) {
      return node.nodeName === 'DETAILS';
    },
    replacement: function (content: any, node: HTMLInputElement) {
      // TODO: preserve summary of nested details
      const summary = node.querySelector(':scope > summary');
      let detailSummary = '';

      if (summary) {
        detailSummary = `<summary>${turndownService.turndown(summary.innerHTML)}</summary>`;
        summary.remove();
      }

      const detailsContent = turndownService.turndown(node.innerHTML);
      return `\n<details>\n${detailSummary}\n\n${detailsContent}\n\n</details>\n`;
    },
  });
}

function mathInline(turndownService: TurndownService) {
  turndownService.addRule('mathInline', {
    filter: function (node: HTMLInputElement) {
      return (
        node.nodeName === 'SPAN' &&
        node.getAttribute('data-type') === 'mathInline'
      );
    },
    replacement: function (content: any, node: HTMLInputElement) {
      return `$${content}$`;
    },
  });
}

function mathBlock(turndownService: TurndownService) {
  turndownService.addRule('mathBlock', {
    filter: function (node: HTMLInputElement) {
      return (
        node.nodeName === 'DIV' &&
        node.getAttribute('data-type') === 'mathBlock'
      );
    },
    replacement: function (content: any, node: HTMLInputElement) {
      return `\n$$\n${content}\n$$\n`;
    },
  });
}

function iframeEmbed(turndownService: TurndownService) {
  turndownService.addRule('iframeEmbed', {
    filter: function (node: HTMLInputElement) {
      return node.nodeName === 'IFRAME';
    },
    replacement: function (content: any, node: HTMLInputElement) {
      const src = node.getAttribute('src');
      return '[' + src + '](' + src + ')';
    },
  });
}

function codeBlock(turndownService: TurndownService) {
  turndownService.addRule('fencedCodeBlock', {
    filter: function (node, options) {
      if (options.codeBlockStyle !== 'fenced') return false;
      return isCodeBlock(node);
    },

    replacement: function (content, node, options) {
      let handledNode = node.firstChild;
      if (isCodeBlockSpecialCase1(node) || isCodeBlockSpecialCase2(node))
        handledNode = node;

      var className = handledNode.className || '';
      var language = (className.match(/language-(\S+)/) || [null, ''])[1];
      var code = content;

      var title = handledNode.getAttribute('data-title');

      var fenceChar = options.fence.charAt(0);
      var fenceSize = 3;
      var fenceInCodeRegex = new RegExp('^' + fenceChar + '{3,}', 'gm');

      var match;
      while ((match = fenceInCodeRegex.exec(code))) {
        if (match[0].length >= fenceSize) {
          fenceSize = match[0].length + 1;
        }
      }

      var fence = repeat(fenceChar, fenceSize);

      // remove code block leading and trailing empty lines
      code = code.replace(/^([ \t]*\n)+/, '').trimEnd();

      return (
        '\n\n' +
        fence +
        language +
        (title ? ` title="${title}"` : '') +
        '\n' +
        code.replace(/\n$/, '') +
        '\n' +
        fence +
        '\n\n'
      );
    },
  });
}

function isCodeBlock(node) {
  if (isCodeBlockSpecialCase1(node) || isCodeBlockSpecialCase2(node))
    return true;

  return (
    node.nodeName === 'PRE' &&
    node.firstChild &&
    node.firstChild.nodeName === 'CODE'
  );
}
function isCodeBlockSpecialCase1(node) {
  const parent = node.parentNode;
  if (!parent) return false;
  return (
    parent.classList &&
    parent.classList.contains('code') &&
    parent.nodeName === 'TD' &&
    node.nodeName === 'PRE'
  );
}

function isCodeBlockSpecialCase2(node) {
  if (node.nodeName !== 'PRE') return false;

  const style = node.getAttribute('style');
  if (!style) return false;
  const o = css.parse('pre {' + style + '}');
  if (!o.stylesheet.rules.length) return;
  const fontFamily = o.stylesheet.rules[0].declarations.find(
    (d) => d.property.toLowerCase() === 'font-family',
  );
  if (!fontFamily || !fontFamily.value) return false;
  const isMonospace =
    fontFamily.value
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .indexOf('monospace') >= 0;
  return isMonospace;
}

function repeat(character, count) {
  return Array(count + 1).join(character);
}
