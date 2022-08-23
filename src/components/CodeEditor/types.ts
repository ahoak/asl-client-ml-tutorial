export type CodeEditorChangeEventArgs = {
  code: string;
  transpiledCode: string;
  issues: CodeIssue[];
};
export type CodeEditorChangeEvent = CustomEvent<CodeEditorChangeEventArgs>;

export type CodeIssueType = 'error' | 'warning' | 'hint' | 'info' | 'validation';
export interface CodeIssue {
  type: CodeIssueType;
  startLineNumber?: number;
  startColumn?: number;
  message?: string;
  detail?: string;
}
