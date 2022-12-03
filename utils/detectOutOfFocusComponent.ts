export default function detectOutOfFocusComponent(e: MouseEvent, targetEl: HTMLElement, cb: Function) {
  const el = e.target as HTMLElement;
  if (
    el != targetEl &&
    (el as HTMLElement)?.parentElement?.parentElement != targetEl &&
    (el as HTMLElement)?.parentElement != targetEl
  ) {
    cb();
  }
}
