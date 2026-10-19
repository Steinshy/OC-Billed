import { screen } from "@testing-library/dom";

import "@testing-library/jest-dom";
import NewBill from "../src/containers/NewBill.js";
import NewBillUI from "../src/views/NewBillUI.js";

import mockStore from "./mocks/store.js";
import { NEW_BILL } from "./mocks/testConstants.js";
import { setupEmployeeUser } from "./mocks/testHelpers.js";

const { FORM_TEST_ID: FORM_NEW_BILL_TEST_ID, TEST_EMAIL } = NEW_BILL;

describe("Given I am connected as an employee", () => {
  beforeEach(() => {
    setupEmployeeUser(TEST_EMAIL);
  });

  describe("When I am on NewBill Page", () => {
    test("Then the form should be displayed", () => {
      document.body.innerHTML = NewBillUI();
      expect(screen.getByTestId(FORM_NEW_BILL_TEST_ID)).toBeTruthy();
    });

    test("Then it should handle missing form gracefully", () => {
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
      document.body.innerHTML = "<div></div>";
      const onNavigate = jest.fn();

      new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage,
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith("Form not found when initializing NewBill");
      consoleErrorSpy.mockRestore();
    });

    test("Then it should handle missing file input gracefully", () => {
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
      document.body.innerHTML = `<form data-testid="${FORM_NEW_BILL_TEST_ID}"></form>`;
      const onNavigate = jest.fn();

      new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage,
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "File input not found when initializing NewBill",
      );
      consoleErrorSpy.mockRestore();
    });
  });
});
