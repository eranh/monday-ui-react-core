import { useCallback } from "react";

import useKeyEvent from "../../../../hooks/useKeyEvent";

const KEYS = ["Enter", "ArrowRight"];

export default function useMenuItemKeyboardEvents(
  onClick,
  disabled,
  isActive,
  index,
  setActiveItemIndex,
  hasChildren,
  shouldShowSubMenu,
  setSubMenuIsOpenByIndex,
  menuRef,
  isMouseEnter,
  closeMenu
) {
  const onClickCallback = useCallback(
    event => {
      event.preventDefault();
      event.stopPropagation();

      if (!isActive && !isMouseEnter) return;

      if (!setActiveItemIndex || !setSubMenuIsOpenByIndex) {
        console.error("MenuItem must be a first level child of a menu");
        return;
      }

      if (isActive && hasChildren) {
        setActiveItemIndex(index);
        setSubMenuIsOpenByIndex(index, true);
        return;
      }

      if (shouldShowSubMenu) return;

      const isKeyEvent = !!event.key;

      const clickCallback = () => {
        onClick(event);
        closeMenu({ propagate: true });
      };

      if (isKeyEvent && onClick && !disabled && isActive) {
        clickCallback();
      }

      if (!isKeyEvent && onClick && !disabled && isMouseEnter) {
        if (!isActive) {
          setActiveItemIndex(index);
          if (hasChildren) {
            setSubMenuIsOpenByIndex(index, true);
          }
        }

        if (!hasChildren) {
          // wait for background of menu item to change before trigger click
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              clickCallback();
            });
          });
        }
      }
    },
    [
      onClick,
      disabled,
      isActive,
      index,
      setActiveItemIndex,
      hasChildren,
      shouldShowSubMenu,
      setSubMenuIsOpenByIndex,
      isMouseEnter
    ]
  );

  useKeyEvent({
    keys: KEYS,
    callback: onClickCallback,
    ref: menuRef,
    preventDefault: true
  });

  return { onClickCallback };
}
