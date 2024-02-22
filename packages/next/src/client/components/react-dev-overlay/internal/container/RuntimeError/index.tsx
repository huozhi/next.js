import * as React from 'react'
import { CodeFrame } from '../../components/CodeFrame'
import type { ReadyRuntimeError } from '../../helpers/getErrorByType'
import { noop as css } from '../../helpers/noop-template'
import { groupStackFramesByFramework } from '../../helpers/group-stack-frames-by-framework'
import { GroupedStackFrames } from './GroupedStackFrames'
import { isHydrationError } from '../../../../is-hydration-error'
import { HtmlDiffView } from './html-diff-view'

export type RuntimeErrorProps = { error: ReadyRuntimeError }

export function RuntimeError({ error }: RuntimeErrorProps) {
  const { firstFrame, allLeadingFrames, allCallStackFrames } =
    React.useMemo(() => {
      const filteredFrames = error.frames.filter(
        (f) =>
          !(
            f.sourceStackFrame.file === '<anonymous>' &&
            ['stringify', '<unknown>'].includes(f.sourceStackFrame.methodName)
          ) && !f.sourceStackFrame.file?.startsWith('node:internal')
      )

      const firstFirstPartyFrameIndex = filteredFrames.findIndex(
        (entry) =>
          entry.expanded &&
          Boolean(entry.originalCodeFrame) &&
          Boolean(entry.originalStackFrame)
      )

      return {
        firstFrame: filteredFrames[firstFirstPartyFrameIndex] ?? null,
        allLeadingFrames:
          firstFirstPartyFrameIndex < 0
            ? []
            : filteredFrames.slice(0, firstFirstPartyFrameIndex),
        allCallStackFrames: filteredFrames.slice(firstFirstPartyFrameIndex + 1),
      }
    }, [error.frames])

  const [all, setAll] = React.useState(firstFrame == null)

  const {
    canShowMore,
    leadingFramesGroupedByFramework,
    stackFramesGroupedByFramework,
  } = React.useMemo(() => {
    const leadingFrames = allLeadingFrames.filter((f) => f.expanded || all)
    const visibleCallStackFrames = allCallStackFrames.filter(
      (f) => f.expanded || all
    )

    return {
      canShowMore:
        allCallStackFrames.length !== visibleCallStackFrames.length ||
        (all && firstFrame != null),

      stackFramesGroupedByFramework:
        groupStackFramesByFramework(allCallStackFrames),

      leadingFramesGroupedByFramework:
        groupStackFramesByFramework(leadingFrames),
    }
  }, [all, allCallStackFrames, allLeadingFrames, firstFrame])

  const isRuntimeHydrationMismatchError = isHydrationError(error.error)

  return (
    <React.Fragment>
      {firstFrame ? (
        <React.Fragment>
          <h2>Source</h2>
          <GroupedStackFrames
            groupedStackFrames={leadingFramesGroupedByFramework}
            show={all}
          />
          <CodeFrame
            stackFrame={firstFrame.originalStackFrame!}
            codeFrame={firstFrame.originalCodeFrame!}
          />
          {isRuntimeHydrationMismatchError ? <HtmlDiffView /> : null}
        </React.Fragment>
      ) : undefined}

      {stackFramesGroupedByFramework.length ? (
        <React.Fragment>
          <h2>Call Stack</h2>
          <GroupedStackFrames
            groupedStackFrames={stackFramesGroupedByFramework}
            show={all}
          />
        </React.Fragment>
      ) : undefined}
      {canShowMore ? (
        <React.Fragment>
          <button
            tabIndex={10}
            data-nextjs-data-runtime-error-collapsed-action
            type="button"
            onClick={() => setAll(!all)}
          >
            {all ? 'Hide' : 'Show'} collapsed frames
          </button>
        </React.Fragment>
      ) : undefined}
    </React.Fragment>
  )
}

export const styles = css`
  button[data-nextjs-data-runtime-error-collapsed-action] {
    background: none;
    border: none;
    padding: 0;
    font-size: var(--size-font-small);
    line-height: var(--size-font-bigger);
    color: var(--color-accents-3);
  }

  [data-nextjs-call-stack-frame]:not(:last-child),
  [data-nextjs-component-stack-frame]:not(:last-child) {
    margin-bottom: var(--size-gap-double);
  }

  [data-nextjs-call-stack-frame] > h3,
  [data-nextjs-component-stack-frame] > h3 {
    margin-top: 0;
    margin-bottom: var(--size-gap);
    font-family: var(--font-stack-monospace);
    font-size: var(--size-font);
    color: #222;
  }
  [data-nextjs-call-stack-frame] > h3[data-nextjs-frame-expanded='false'] {
    color: #666;
  }
  [data-nextjs-call-stack-frame] > div,
  [data-nextjs-component-stack-frame] > div {
    display: flex;
    align-items: center;
    padding-left: calc(var(--size-gap) + var(--size-gap-half));
    font-size: var(--size-font-small);
    color: #999;
  }
  [data-nextjs-call-stack-frame] > div > svg,
  [data-nextjs-component-stack-frame] > [role='link'] > svg {
    width: auto;
    height: var(--size-font-small);
    margin-left: var(--size-gap);
    flex-shrink: 0;

    display: none;
  }

  [data-nextjs-call-stack-frame] > div[data-has-source],
  [data-nextjs-component-stack-frame] > [role='link'] {
    cursor: pointer;
  }
  [data-nextjs-call-stack-frame] > div[data-has-source]:hover,
  [data-nextjs-component-stack-frame] > [role='link']:hover {
    text-decoration: underline dotted;
  }
  [data-nextjs-call-stack-frame] > div[data-has-source] > svg,
  [data-nextjs-component-stack-frame] > [role='link'] > svg {
    display: unset;
  }

  [data-nextjs-call-stack-framework-icon] {
    margin-right: var(--size-gap);
  }
  [data-nextjs-call-stack-framework-icon='next'] > mask {
    mask-type: alpha;
  }
  [data-nextjs-call-stack-framework-icon='react'] {
    color: rgb(20, 158, 202);
  }
  [data-nextjs-collapsed-call-stack-details][open]
    [data-nextjs-call-stack-chevron-icon] {
    transform: rotate(90deg);
  }
  [data-nextjs-collapsed-call-stack-details] summary {
    display: flex;
    align-items: center;
    margin-bottom: var(--size-gap);
    list-style: none;
  }
  [data-nextjs-collapsed-call-stack-details] summary::-webkit-details-marker {
    display: none;
  }

  [data-nextjs-collapsed-call-stack-details] h3 {
    color: #666;
  }
  [data-nextjs-collapsed-call-stack-details] [data-nextjs-call-stack-frame] {
    margin-bottom: var(--size-gap-double);
  }

<<<<<<< HEAD
<<<<<<< HEAD
  [data-nextjs-container-errors-pseudo-html] {
    position: relative;
    padding-left: var(--size-gap-triple);
  }

  [data-nextjs-container-errors-pseudo-html-collapse] {
    position: absolute;
    left: 0;
=======
=======
  /* Diff viewer */
>>>>>>> f725b9c5ab (extract component)
  :host {
    --diff-background-color: initial;
    --diff-text-color: initial;
    --diff-font-family: Consolas, Courier, monospace;
    --diff-selection-background-color: #b3d7ff;
    --diff-selection-text-color: var(--diff-text-color);
    --diff-gutter-insert-background-color: #d6fedb;
    --diff-gutter-insert-text-color: var(--diff-text-color);
    --diff-gutter-delete-background-color: #fadde0;
    --diff-gutter-delete-text-color: var(--diff-text-color);
    --diff-gutter-selected-background-color: #fffce0;
    --diff-gutter-selected-text-color: var(--diff-text-color);
    --diff-code-insert-background-color: #eaffee;
    --diff-code-insert-text-color: var(--diff-text-color);
    --diff-code-delete-background-color: #fdeff0;
    --diff-code-delete-text-color: var(--diff-text-color);
    --diff-code-insert-edit-background-color: #c0dc91;
    --diff-code-insert-edit-text-color: var(--diff-text-color);
    --diff-code-delete-edit-background-color: #f39ea2;
    --diff-code-delete-edit-text-color: var(--diff-text-color);
    --diff-code-selected-background-color: #fffce0;
    --diff-code-selected-text-color: var(--diff-text-color);
    --diff-omit-gutter-line-color: #cb2a1d;
  }
  @media (prefers-color-scheme: dark) {
    :host {
      --diff-code-delete-background-color: rgba(229, 83, 75, 0.1);
      --diff-code-insert-background-color: rgba(70, 149, 74, 0.15);
      --diff-code-delete-edit-background-color: rgba(229, 83, 75, 0.4);
      --diff-gutter-delete-background-color: rgba(229, 83, 75, 0.1);
      --diff-gutter-insert-background-color: rgba(87, 171, 90, 0.3);
      --diff-gutter-delete-edit-background-color: rgba(229, 83, 75, 0.4);
    }
  }
  .diff {
    background-color: var(--diff-background-color);
    border-collapse: collapse;
    color: var(--diff-text-color);
    table-layout: fixed;
    width: 100%;
  }
  .diff::-moz-selection {
    background-color: #b3d7ff;
    background-color: var(--diff-selection-background-color);
    color: var(--diff-text-color);
    color: var(--diff-selection-text-color);
  }
  .diff::selection {
    background-color: #b3d7ff;
    background-color: var(--diff-selection-background-color);
    color: var(--diff-text-color);
    color: var(--diff-selection-text-color);
  }
  .diff td {
    padding-bottom: 0;
    padding-top: 0;
    vertical-align: top;
  }
  .diff-line {
    font-family: Consolas, Courier, monospace;
    font-family: var(--diff-font-family);
    line-height: 1.5;
  }
  .diff-gutter > a {
    color: inherit;
    display: block;
  }
  .diff-gutter {
    cursor: pointer;
    padding: 0 1ch;
    text-align: right;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
  }
  .diff-gutter-insert {
    background-color: #d6fedb;
    background-color: var(--diff-gutter-insert-background-color);
    color: var(--diff-text-color);
    color: var(--diff-gutter-insert-text-color);
  }
  .diff-gutter-delete {
    background-color: #fadde0;
    background-color: var(--diff-gutter-delete-background-color);
    color: var(--diff-text-color);
    color: var(--diff-gutter-delete-text-color);
  }
  .diff-gutter-omit {
    cursor: default;
  }
  .diff-gutter-selected {
    background-color: #fffce0;
    background-color: var(--diff-gutter-selected-background-color);
    color: var(--diff-text-color);
    color: var(--diff-gutter-selected-text-color);
  }
  .diff-code {
    word-wrap: break-word;
    padding: 0 0 0 0.5em;
    white-space: pre-wrap;
    word-break: break-all;
  }
  .diff-code-edit {
    color: inherit;
  }
  .diff-code-insert {
    background-color: #eaffee;
    background-color: var(--diff-code-insert-background-color);
    color: var(--diff-text-color);
    color: var(--diff-code-insert-text-color);
  }
  .diff-code-insert .diff-code-edit {
    background-color: #c0dc91;
    background-color: var(--diff-code-insert-edit-background-color);
    color: var(--diff-text-color);
    color: var(--diff-code-insert-edit-text-color);
  }
  .diff-code-delete {
    background-color: #fdeff0;
    background-color: var(--diff-code-delete-background-color);
    color: var(--diff-text-color);
    color: var(--diff-code-delete-text-color);
  }
  .diff-code-delete .diff-code-edit {
    background-color: #f39ea2;
    background-color: var(--diff-code-delete-edit-background-color);
    color: var(--diff-text-color);
    color: var(--diff-code-delete-edit-text-color);
  }
  .diff-code-selected {
    background-color: #fffce0;
    background-color: var(--diff-code-selected-background-color);
    color: var(--diff-text-color);
    color: var(--diff-code-selected-text-color);
  }
  .diff-widget-content {
    vertical-align: top;
  }
  .diff-gutter-col {
    width: 7ch;
  }
  .diff-gutter-omit {
    height: 0;
  }
  .diff-gutter-omit:before {
    background-color: #cb2a1d;
    background-color: var(--diff-omit-gutter-line-color);
    content: ' ';
    display: block;
    height: 100%;
    margin-left: 4.6ch;
    overflow: hidden;
    white-space: pre;
    width: 2px;
  }
  .diff-decoration {
    line-height: 1.5;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
  }
  .diff-decoration-content {
    font-family: Consolas, Courier, monospace;
    font-family: var(--diff-font-family);
    padding: 0;
>>>>>>> b7c7462da4 (prototyping)
  }
`
