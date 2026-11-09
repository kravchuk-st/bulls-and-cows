type Child = Node | string;

export const el = <K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props: Partial<HTMLElementTagNameMap[K]> = {},
  ...children: Child[]
): HTMLElementTagNameMap[K] => {
  const element = Object.assign(document.createElement(tag), props);
  element.append(...children);
  return element;
};
