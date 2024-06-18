import { useEffect, useState } from "react";
import { Navbar } from "./Components/Navbar/Navbar";
import "./Home.styles.css";
import { HomeContent } from "./Components/HomeContent/HomeContent";
import { Jobs } from "./Components/Jobs/Jobs";
import { Customers } from "./Components/Customers/Customers";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../../redux/slices/userSlice";
import { fetchCustomers } from "../../redux/slices/customerSlice";
import { IInitialUserState } from "../../redux/types/userTypes";

export const Home = () => {
  const [currentPage, setCurrentPage] = useState("HOME");
  const userData = useSelector(
    (state: IInitialUserState) => state.userData.data
  );

  const getContent = (content) => {
    switch (content) {
      case "HOME":
        return <HomeContent setCurrentPage={setCurrentPage} />;
      case "JOBS":
        return <Jobs user={userData} />;
      case "CUSTOMERS":
        return <Customers user={userData} />;
      default:
        return null;
    }
  };
  return (
    <div className="home-page">
      <div className="navbar-wrapper">
        <Navbar setCurrentPage={setCurrentPage} currentPage={currentPage} />
      </div>
      {userData && (
        <div className="content-wrapper">{getContent(currentPage)}</div>
      )}
    </div>
  );
};
