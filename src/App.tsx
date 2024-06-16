import "./App.css";
import "@shoelace-style/shoelace/dist/themes/light.css";
import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path";
import "react-datepicker/dist/react-datepicker.css";
setBasePath(
  "https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.15.1/cdn/"
);
import moment from "moment";
import "moment/dist/locale/sr";
import Login from "./Pages/Login/Login";
import { Home } from "./Pages/Home/Home";
moment.locale("sr");
function App() {
  // return <Login />;
  return <Home />;
}

export default App;
