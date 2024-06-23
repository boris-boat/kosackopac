import { useState } from "react";
import { Navbar } from "./Components/Navbar/Navbar";
import "./Home.styles.css";
import { HomeContent } from "./Components/HomeContent/HomeContent";
import { Jobs } from "./Components/Jobs/Jobs";
import { Customers } from "./Components/Customers/Customers";
import { useSelector } from "react-redux";
import { IInitialUserState, IUser } from "../../redux/types/userTypes";

export const Home = () => {
  const [currentPage, setCurrentPage] = useState<"HOME" | "JOBS" | "CUSTOMERS">(
    "HOME"
  );
  const userData: IUser = useSelector(
    (state: IInitialUserState) => state.userData
  );

  const getContent = (content: "HOME" | "ALL JOBS" | "CUSTOMERS") => {
    switch (content) {
      case "HOME":
        return <HomeContent setCurrentPage={setCurrentPage} />;
      case "ALL JOBS":
        return <Jobs />;
      case "CUSTOMERS":
        return <Customers user={userData} />;
      default:
        return null;
    }
  };
  return (
    <div className="home-page">
      <div className="navbar-wrapper">
        <Navbar
          setCurrentPage={
            setCurrentPage as React.Dispatch<
              React.SetStateAction<"HOME" | "ALL JOBS" | "CUSTOMERS">
            >
          }
          currentPage={currentPage}
        />
      </div>
      {userData && (
        <div className="content-wrapper">{getContent(currentPage)}</div>
      )}
    </div>
  );
};
