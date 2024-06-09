import "./App.css";
import "@shoelace-style/shoelace/dist/themes/light.css";
import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path";

setBasePath(
  "https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.15.1/cdn/"
);
import Login from "./Pages/Login/Login";
import { Home } from "./Pages/Home/Home";

function App() {
  // return <Login />;
  return <Home />;
}

export default App;
