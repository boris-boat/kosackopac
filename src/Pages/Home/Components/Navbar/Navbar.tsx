import { useState } from "react";
import "./Navbar.styles.css";
import {
  SlButton,
  SlIconButton,
  SlDrawer,
} from "@shoelace-style/shoelace/dist/react/index.js";

export const Navbar = ({ currentPage, setCurrentPage }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="navbar">
      <SlDrawer
        label="Drawer"
        placement="start"
        open={open}
        onSlAfterHide={() => setOpen(false)}
      >
        <div className="navbar-content-buttons">
          <SlButton
            onClick={() => {
              setCurrentPage("HOME");
              setOpen(false);
            }}
          >
            HOME
          </SlButton>
          <SlButton
            onClick={() => {
              setCurrentPage("CUSTOMERS");
              setOpen(false);
            }}
          >
            CUSTOMERS
          </SlButton>
          <SlButton
            onClick={() => {
              setCurrentPage("JOBS");
              setOpen(false);
            }}
          >
            JOBS
          </SlButton>
        </div>
        <SlButton
          slot="footer"
          variant="primary"
          onClick={() => setOpen(false)}
        >
          Close
        </SlButton>
      </SlDrawer>
      <div className="burger-button-wrapper">
        <SlIconButton
          name="list"
          label="Settings"
          onClick={() => setOpen(true)}
          style={{ fontSize: "2rem" }}
        />
      </div>
      <div className="current-location">{currentPage}</div>
    </div>
  );
};
