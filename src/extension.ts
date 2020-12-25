import {
  commands,
  ExtensionContext,
  Position,
  Range,
  TextEditor,
} from 'vscode';
import { TransverterOptions, transverter } from './transverter';

const COMMANDS: { command: string; options: TransverterOptions }[] = [
  {
    command: 'zh-hans-to-zh-hant',
    options: { type: 'traditional', language: '' },
  },
  {
    command: 'zh-hant-to-zh-hans',
    options: { type: 'simplified', language: '' },
  },
  {
    command: 'zh-hans-to-zh-hant-tw',
    options: { type: 'traditional', language: 'zh_TW' },
  },
  {
    command: 'zh-hant-to-zh-hans-tw',
    options: { type: 'simplified', language: 'zh_TW' },
  },
];

function process(textEditor: TextEditor, options: TransverterOptions) {
  const doc = textEditor.document;
  let selection: Selection | Range = textEditor.selection;
  if (selection.isEmpty) {
    const start = new Position(0, 0);
    const end = new Position(
      doc.lineCount - 1,
      doc.lineAt(doc.lineCount - 1).text.length,
    );
    selection = new Range(start, end);
  }

  let text = doc.getText(selection);
  textEditor.edit(builder => {
    builder.replace(selection as any, transverter(text, options));
  });
}

export function activate(context: ExtensionContext) {
  COMMANDS.forEach(item => {
    context.subscriptions.push(commands.registerTextEditorCommand(item.command, textEditor => {
      process(textEditor, item.options)
    })
    )
  })
}

export function deactivate(): void { }
