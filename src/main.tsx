import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { store } from "./redux/store";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LoadingProvider } from "./Context/LoadingContext/LoadingContext.tsx";
import Overlay from "./Components/Overlay/Overlay.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <LoadingProvider>
      <Provider store={store}>
        <App />
        <Overlay />
        <ToastContainer />
      </Provider>
    </LoadingProvider>
  </React.StrictMode>
);
