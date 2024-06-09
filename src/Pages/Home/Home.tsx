import { useEffect, useState } from "react";
import { Navbar } from "./Components/Navbar/Navbar";
import "./Home.styles.css";
import { HomeContent } from "./Components/HomeContent/HomeContent";
import { supabase } from "../../Utils/database";
import { Jobs } from "./Components/Jobs/Jobs";
import { Customers } from "./Components/Customers/Customers";

export const Home = () => {
  const [currentPage, setCurrentPage] = useState("HOME");
  const [user, setUser] = useState();

  useEffect(() => {
    let getData = async () => {
      const { data, error } = await supabase
        .from("registeredUsers")
        .select(
          `
            *,
            jobs (
              *,
              customers (
                *
              )
            )
          `
        )
        .eq("id", "50939095-1094-4a64-b0b2-d37b31fc1fbd");
      setUser(data[0]);
    };
    getData();
  }, []);

  const getContent = (content) => {
    switch (content) {
      case "HOME":
        return <HomeContent user={user} />;
      case "JOBS":
        return <Jobs user={user} />;
      case "CUSTOMERS":
        return <Customers user={user} />;
      default:
        return null;
    }
  };
  return (
    <div className="home-page">
      <div className="navbar-wrapper">
        <Navbar setCurrentPage={setCurrentPage} currentPage={currentPage} />
      </div>
      {user && <div className="content-wrapper">{getContent(currentPage)}</div>}
    </div>
  );
};
