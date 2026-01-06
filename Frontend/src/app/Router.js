  import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import Bills from "../containers/Bills.js";
import Dashboard from "../containers/Dashboard.js";
import Login, { PREVIOUS_LOCATION } from "../containers/Login.js";
import NewBill from "../containers/NewBill.js";

import BillsUI from "../views/BillsUI.js";
import DashboardUI from "../views/DashboardUI.js";
import store from "./Store.js";

const LAYOUT_ICON_1_ID = "layout-icon1";
const LAYOUT_ICON_2_ID = "layout-icon2";
const ACTIVE_ICON_CLASS = "active-icon";

export default async () => {
  const rootDiv = document.getElementById("root");
  rootDiv.innerHTML = ROUTES({ pathname: window.location.pathname });

  window.onNavigate = (pathname) => {
    window.history.pushState({}, pathname, window.location.origin + pathname);
    if (pathname === ROUTES_PATH["Login"]) {
      rootDiv.innerHTML = ROUTES({ pathname });
      document.body.style.backgroundColor = "#0E5AE5";
      new Login({
        document,
        localStorage,
        onNavigate,
        PREVIOUS_LOCATION,
        store,
      });
    } else if (pathname === ROUTES_PATH["Bills"]) {
      rootDiv.innerHTML = ROUTES({ pathname, loading: true });
      const divIcon1 = document.getElementById(LAYOUT_ICON_1_ID);
      const divIcon2 = document.getElementById(LAYOUT_ICON_2_ID);
      divIcon1.classList.add(ACTIVE_ICON_CLASS);
      divIcon2.classList.remove(ACTIVE_ICON_CLASS);
      const bills = new Bills({ document, onNavigate, store, localStorage });
      bills.getBills()
        .then(data => {
          rootDiv.innerHTML = BillsUI({ data });
          const divIcon1 = document.getElementById(LAYOUT_ICON_1_ID);
          const divIcon2 = document.getElementById(LAYOUT_ICON_2_ID);
          divIcon1.classList.add(ACTIVE_ICON_CLASS);
          divIcon2.classList.remove(ACTIVE_ICON_CLASS);
          new Bills({ document, onNavigate, store, localStorage });
        })
        .catch((error) => {
          rootDiv.innerHTML = ROUTES({ pathname, error });
        });
    } else if (pathname === ROUTES_PATH["NewBill"]) {
      rootDiv.innerHTML = ROUTES({ pathname, loading: true });
      new NewBill({ document, onNavigate, store, localStorage });
      const divIcon1 = document.getElementById(LAYOUT_ICON_1_ID);
      const divIcon2 = document.getElementById(LAYOUT_ICON_2_ID);
      divIcon1.classList.remove(ACTIVE_ICON_CLASS);
      divIcon2.classList.add(ACTIVE_ICON_CLASS);

    } else if (pathname === ROUTES_PATH["Dashboard"]) {
      rootDiv.innerHTML = ROUTES({ pathname, loading: true });
      const bills = new Dashboard({
        document,
        onNavigate,
        store,
        bills: [],
        localStorage,
      });
      bills.getBillsAllUsers()
        .then(bills => {
          rootDiv.innerHTML = DashboardUI({ data: { bills } });
          new Dashboard({ document, onNavigate, store, bills, localStorage });
        })
        .catch(error => {
          rootDiv.innerHTML = ROUTES({ pathname, error });
        });
    }
  };

  window.onpopstate = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (window.location.pathname === "/" && !user) {
      document.body.style.backgroundColor = "#0E5AE5";
      rootDiv.innerHTML = ROUTES({ pathname: window.location.pathname });
    } else if (user) {
      onNavigate(PREVIOUS_LOCATION);
    }
  };

  if (window.location.pathname === "/" && window.location.hash === "") {
    new Login({ document, localStorage, onNavigate, PREVIOUS_LOCATION, store });
    document.body.style.backgroundColor = "#0E5AE5";
  } else if (window.location.hash !== "") {
    if (window.location.hash === ROUTES_PATH["Bills"]) {
      rootDiv.innerHTML = ROUTES({
        pathname: window.location.hash,
        loading: true,
      });
      const divIcon1 = document.getElementById(LAYOUT_ICON_1_ID);
      const divIcon2 = document.getElementById(LAYOUT_ICON_2_ID);
      divIcon1.classList.add(ACTIVE_ICON_CLASS);
      divIcon2.classList.remove(ACTIVE_ICON_CLASS);
      const bills = new Bills({ document, onNavigate, store, localStorage });
      bills.getBills()
        .then(data => {
          rootDiv.innerHTML = BillsUI({ data });
          const divIcon1 = document.getElementById(LAYOUT_ICON_1_ID);
          const divIcon2 = document.getElementById(LAYOUT_ICON_2_ID);
          divIcon1.classList.add(ACTIVE_ICON_CLASS);
          divIcon2.classList.remove(ACTIVE_ICON_CLASS);
          new Bills({ document, onNavigate, store, localStorage });
        })
        .catch((error) => {
          rootDiv.innerHTML = ROUTES({ pathname: window.location.hash, error });
        });
    } else if (window.location.hash === ROUTES_PATH["NewBill"]) {
      rootDiv.innerHTML = ROUTES({
        pathname: window.location.hash,
        loading: true,
      });
      new NewBill({ document, onNavigate, store, localStorage });
      const divIcon1 = document.getElementById(LAYOUT_ICON_1_ID);
      const divIcon2 = document.getElementById(LAYOUT_ICON_2_ID);
      divIcon1.classList.remove(ACTIVE_ICON_CLASS);
      divIcon2.classList.add(ACTIVE_ICON_CLASS);
    } else if (window.location.hash === ROUTES_PATH["Dashboard"]) {
      rootDiv.innerHTML = ROUTES({
        pathname: window.location.hash,
        loading: true,
      });
      const bills = new Dashboard({
        document,
        onNavigate,
        store,
        bills: [],
        localStorage,
      });
      bills.getBillsAllUsers()
        .then(bills => {rootDiv.innerHTML = DashboardUI({ data: { bills } });
          new Dashboard({ document, onNavigate, store, bills, localStorage });
        })
        .catch(error => {
          rootDiv.innerHTML = ROUTES({ pathname: window.location.hash, error });
        });
    }
  }

  return null;
};
