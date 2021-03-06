import React, {useState} from 'react';
import Backdrop from '../../UIElements/Backdrop/Backdrop';

import MainHeader from '../MainHeader/MainHeader';
import NavLinks from '../NavLinks/NavLinks';
import SideDrawer from '../SideDrawer/SideDrawer';
import './MainNavigation.css';

const MainNavigation = () => {

  const [drawerIsOpen, setDrawerIsOpen] = useState(false);

  const openDrawer = () => {
    setDrawerIsOpen(true);
  }

  const closeDrawer = () => {
    setDrawerIsOpen(false);
  }

  return (
    <React.Fragment>
      {drawerIsOpen && <Backdrop onClick={closeDrawer} />}
      <SideDrawer show={drawerIsOpen} onClick={closeDrawer}>
        <nav className="main-navigation__drawer-nav">
          <NavLinks />
        </nav>
      </SideDrawer>
      <MainHeader>
        <button className="main-navigation__menu-btn" onClick={openDrawer}>
          <span />
          <span />
          <span />
        </button>
        <h3 className="main-navigation__user">Milica Medic</h3>
        <nav className="main-navigation__header-nav">
          <NavLinks />
        </nav>
      </MainHeader>
    </React.Fragment>
  );
};

export default MainNavigation;