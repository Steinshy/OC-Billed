import { fireEvent, screen } from "@testing-library/dom";

import { ROUTES } from "../src/constants/routes.js";
import Logout from "../src/containers/Logout.js";
import DashboardUI from "../src/views/DashboardUI.js";

import { localStorageMock } from "./mocks/localStorage.js";
import { singleBillArray as bills } from "./mocks/testData.js";

describe("Given I am connected", () => {
  describe("When I click on disconnect button", () => {
    test("Then, I should be sent to login page", () => {
      const onNavigate = jest.fn(pathname => {
        document.body.innerHTML = ROUTES({ pathname });
      });
      const mockLocalStorage = {
        ...localStorageMock,
        clear: jest.fn(),
      };
      Object.defineProperty(window, "localStorage", {
        value: mockLocalStorage,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Admin",
        }),
      );
      document.body.innerHTML = DashboardUI({ bills });
      new Logout({ document, onNavigate, localStorage: mockLocalStorage });

      const disco = screen.getByTestId("layout-disconnect");
      fireEvent.click(disco);
      expect(mockLocalStorage.clear).toHaveBeenCalled();
      expect(onNavigate).toHaveBeenCalledWith("/");
      expect(screen.getByText("Administration")).toBeTruthy();
    });
  });
});
