import { useState } from "react";
import "./Navbar.styles.css";
import {
  SlButton,
  SlIconButton,
  SlDrawer,
} from "@shoelace-style/shoelace/dist/react/index.js";
import { supabase } from "../../../../Utils/database";
import { useDispatch } from "react-redux";
import { setUser } from "../../../../redux/slices/userSlice";
import { searchCustomersFilter } from "../../../../redux/slices/customerSlice";
import { searchJobFilter } from "../../../../redux/slices/jobSlice";

export const Navbar = ({ currentPage, setCurrentPage }) => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const handleCustomersSearch = (filter) => {
    dispatch(searchCustomersFilter(filter));
  };
  const handleJobsSearch = (filter) => {
    dispatch(searchJobFilter(filter));
  };
  return (
    <div className="navbar">
      <SlDrawer
        label="Options"
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
          variant="danger"
          onClick={async () => {
            const { error } = await supabase.auth.signOut();
            if (error) {
              console.log(error);
            }
            dispatch(setUser(null));
            setOpen(false);
          }}
        >
          Logout
        </SlButton>
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
      <div className="top-bar">
        <div className="current-location">{currentPage}</div>
        <div className="search">
          {currentPage === "JOBS" && (
            <input
              type="text"
              placeholder="Search"
              className="jobs-search"
              onChange={(e) => {
                handleJobsSearch(e.target.value);
              }}
            />
          )}
          {currentPage === "CUSTOMERS" && (
            <input
              type="text"
              placeholder="Search"
              className="customers-search"
              onChange={(e) => {
                handleCustomersSearch(e.target.value);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
