import React from "react";
import { isTouchScreen } from '../../common/utils';
import Menu from '@mui/material/Menu';

/**
 * Component for representing a dropdown menu with a visible toggling button.
 *   Clicking on the button the first time (or also hovering over it on a non-touch
 *   screen) opens the menu clicking on the button a second time or on the menu option
 *   closes it. The menu is also closed after a delay after moving off of it
 *   (on a non-touch screen).
 * @param {ReactElement} DropDownButton the button to toggle the opening/closing of the menu
 * @param {object=} menuContainerProps properties of the menu
 * @param {number=} delay the delay in ms for which to close the menu on a non-touch screen after
 *   the pointer is moved off of it, defaults to 200
 * @param {Array.<MenuItem>} children the Array of options in the dropdown menu
 */
export default function DropDownMenu({
  DropDownButton,
  menuContainerProps,
  delay,
  children,
}) {
  const [inDropdown, setInDropdown] = React.useState({
    inProgress: false,
    value: false,
  });
  const [anchorEl, setAnchorEl] = React.useState(null);

  const inDropdownRef = React.useRef(inDropdown);
  inDropdownRef.current = inDropdown;

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const updateInDropdownState = () => {
    setInDropdown({ inProgress: true, value: false });
    setTimeout(
      () =>
        setInDropdown({
          value: inDropdownRef.current?.value,
          inProgress: false,
        }),
      delay || 200
    );
  };

  const DropDownButtonWithHandlers = React.cloneElement(DropDownButton, {
    onMouseEnter: (e) => {
      if (typeof DropDownButton.props.onMouseEnter === 'function') {
        DropDownButton.props.onMouseEnter(e);
      }
      if (!isTouchScreen()) {
        setInDropdown({ value: true, inProgress: false });
        handleOpenMenu(e);
      }
    },
    onMouseLeave: (e) => {
      if (typeof DropDownButton.props.onMouseLeave === 'function') {
        DropDownButton.props.onMouseLeave(e);
      }
      console.log('test');

      if (!isTouchScreen()) {
        updateInDropdownState();
      }
    },
    onClick: (e) => (anchorEl ? handleCloseMenu() : handleOpenMenu(e)),
    /*
    style: {
      position: 'relative',
      zIndex: menuContainerProps?.zIndex + 1 || 10000,
      ...DropDownButton.props.style,
    },
    */
  });

  React.useEffect(() => {
    if (!inDropdown.inProgress && !inDropdown.value) {
      // mouse has moved out of main menu item and its
      //   dropdown after delay milliseconds
      // menuCloseHandler();
      //console.log(inDropdown);
      handleCloseMenu();
    }
  }, [inDropdown]);

  return (
    <>
      {DropDownButtonWithHandlers}
      <Menu
        {...menuContainerProps}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        //transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        keepMounted
        anchorEl={anchorEl}
        MenuListProps={{
          onMouseEnter: () =>
            !isTouchScreen() &&
            setInDropdown({ value: true, inProgress: false }),
          onMouseLeave: () => !isTouchScreen() && updateInDropdownState(),
          onClick: handleCloseMenu,
        }}
        hideBackdrop
        open={!!anchorEl}
      >
        {children}
      </Menu>
    </>
  );
}
