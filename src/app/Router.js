import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import Bills from "../containers/Bills.js";
import Dashboard from "../containers/Dashboard.js";
import Login from "../containers/Login.js";
import NewBill from "../containers/NewBill.js";
import BillsUI from "../views/BillsUI.js";
import DashboardUI from "../views/DashboardUI.js";

import store from "./Store.js";

const ACTIVE_ICON_CLASS = "active-icon";

const layoutIcons = () => {
  return {
    divIcon1: document.getElementById("layout-icon1"),
    divIcon2: document.getElementById("layout-icon2"),
  };
};

export default async () => {
  const rootDiv = document.getElementById("root");
  rootDiv.innerHTML = ROUTES({ pathname: window.location.pathname });

  // Directory the app is served from: "/" locally, "/<repo>/" on GitHub Pages.
  const basePath = window.location.pathname.replace(/[^/]*$/, "");

  window.onNavigate = pathname => {
    const url = pathname === ROUTES_PATH["Login"] ? basePath : `${basePath}${pathname}`;
    window.history.pushState({}, pathname, window.location.origin + url);
    if (pathname === ROUTES_PATH["Login"]) {
      rootDiv.innerHTML = ROUTES({ pathname });
      document.body.classList.add("login-page");
      new Login({ document, localStorage, onNavigate, store });
    } else if (pathname === ROUTES_PATH["Bills"]) {
      rootDiv.innerHTML = ROUTES({ pathname, loading: true });
      const { divIcon1, divIcon2 } = layoutIcons();
        divIcon1.classList.add(ACTIVE_ICON_CLASS);
        divIcon2.classList.remove(ACTIVE_ICON_CLASS);
      const bills = new Bills({ document, onNavigate, store, localStorage });
      bills.getBills().then(data => {
        rootDiv.innerHTML = BillsUI({ data });
        const { divIcon1, divIcon2 } = layoutIcons();
          divIcon1.classList.add(ACTIVE_ICON_CLASS);
          divIcon2.classList.remove(ACTIVE_ICON_CLASS);
        new Bills({ document, onNavigate, store, localStorage });
      }).catch(error => rootDiv.innerHTML = ROUTES({ pathname, error }));
    } else if (pathname === ROUTES_PATH["NewBill"]) {
      rootDiv.innerHTML = ROUTES({ pathname, loading: true });
      const { divIcon1, divIcon2 } = layoutIcons();
        divIcon1.classList.remove(ACTIVE_ICON_CLASS);
        divIcon2.classList.add(ACTIVE_ICON_CLASS);
      new NewBill({ document, onNavigate, store, localStorage });

    } else if (pathname === ROUTES_PATH["Dashboard"]) {
      rootDiv.innerHTML = ROUTES({ pathname, loading: true });

      const bills = new Dashboard({ document, onNavigate, store, bills: [], localStorage });

      bills.getBillsAllUsers().then(bills => {
        rootDiv.innerHTML = DashboardUI({ data: { bills } });
        new Dashboard({ document, onNavigate, store, bills, localStorage });
      }).catch(error => rootDiv.innerHTML = ROUTES({ pathname, error }));
    }
  };

  window.onpopstate = () => {
    const userItem = localStorage.getItem("user");
    const user = userItem ? JSON.parse(userItem) : null;
    if (window.location.pathname === basePath && !user) {
      document.body.classList.add("login-page");
      rootDiv.innerHTML = ROUTES({ pathname: window.location.pathname });
    } else if (user) onNavigate(window.location.hash || ROUTES_PATH["Login"]);
  };

  if (window.location.pathname === basePath && window.location.hash === "") {
    new Login({ document, localStorage, onNavigate, store });
    document.body.classList.add("login-page");
  } else if (window.location.hash !== "") {
    if (window.location.hash === ROUTES_PATH["Bills"]) {
      rootDiv.innerHTML = ROUTES({ pathname: window.location.hash, loading: true });
      const { divIcon1, divIcon2 } = layoutIcons();
        divIcon1.classList.add(ACTIVE_ICON_CLASS);
        divIcon2.classList.remove(ACTIVE_ICON_CLASS);
      const bills = new Bills({ document, onNavigate, store, localStorage });

      bills.getBills().then(data => {
        rootDiv.innerHTML = BillsUI({ data });
        const { divIcon1, divIcon2 } = layoutIcons();
          divIcon1.classList.add(ACTIVE_ICON_CLASS);
          divIcon2.classList.remove(ACTIVE_ICON_CLASS);
        new Bills({ document, onNavigate, store, localStorage });
      })
      .catch(error => rootDiv.innerHTML = ROUTES({ pathname: window.location.hash, error }));
    }

    else if (window.location.hash === ROUTES_PATH["NewBill"]) {
      rootDiv.innerHTML = ROUTES({ pathname: window.location.hash, loading: true });
      const { divIcon1, divIcon2 } = layoutIcons();
        divIcon1.classList.remove(ACTIVE_ICON_CLASS);
        divIcon2.classList.add(ACTIVE_ICON_CLASS);
      new NewBill({ document, onNavigate, store, localStorage });
    } else if (window.location.hash === ROUTES_PATH["Dashboard"]) {
      rootDiv.innerHTML = ROUTES({ pathname: window.location.hash, loading: true });
      const bills = new Dashboard({ document, onNavigate, store, bills: [], localStorage });
      bills.getBillsAllUsers()
        .then(bills => {rootDiv.innerHTML = DashboardUI({ data: { bills } });
          new Dashboard({ document, onNavigate, store, bills, localStorage });})
        .catch(error => {rootDiv.innerHTML = ROUTES({ pathname: window.location.hash, error });});
    }
  }

  return null;
};
