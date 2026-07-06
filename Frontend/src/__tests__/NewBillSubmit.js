import { screen, fireEvent, waitFor } from "@testing-library/dom";
import "@testing-library/jest-dom";
import mockStore from "../__mocks__/store.js";
import { NEW_BILL } from "../__mocks__/testConstants.js";
import { makeBillsStore, setupEmployeeUser } from "../__mocks__/testHelpers.js";
import { ROUTES_PATH } from "../constants/routes.js";
import NewBill from "../containers/NewBill.js";
import NewBillUI from "../views/NewBillUI.js";

const {
  EMPLOYEE_TYPE,
  FORM_TEST_ID: FORM_NEW_BILL_TEST_ID,
  TEST_EMAIL,
  TEST_FILE_URL,
  TEST_FILE_NAME,
  TEST_BILL_ID,
} = NEW_BILL;

// Instance with a completed file upload, ready to submit.
const makeSubmittableNewBill = (store, onNavigate) => {
  const newBillInstance = new NewBill({
    document,
    onNavigate,
    store,
    localStorage: window.localStorage,
  });
  newBillInstance.fileUrl = TEST_FILE_URL;
  newBillInstance.fileName = TEST_FILE_NAME;
  newBillInstance.billId = TEST_BILL_ID;
  newBillInstance.userData = { type: EMPLOYEE_TYPE, email: TEST_EMAIL };
  return newBillInstance;
};

const makeSubmitEvent = () => ({
  preventDefault: jest.fn(),
  target: screen.getByTestId(FORM_NEW_BILL_TEST_ID),
});

describe("Given I am connected as an employee", () => {
  beforeEach(() => {
    setupEmployeeUser(TEST_EMAIL);
    document.body.innerHTML = NewBillUI();
  });

  describe("When I submit the form", () => {
    test("Then it should call updateBill and redirect on success", async () => {
      const updateSpy = jest.fn(() => Promise.resolve({}));
      const onNavigate = jest.fn();
      const newBillInstance = makeSubmittableNewBill(makeBillsStore(updateSpy), onNavigate);

      const submitEvent = makeSubmitEvent();
      newBillInstance.handleFormSubmit(submitEvent);

      expect(submitEvent.preventDefault).toHaveBeenCalled();
      await waitFor(() => {
        expect(updateSpy).toHaveBeenCalled();
        expect(onNavigate).toHaveBeenCalledWith(ROUTES_PATH["Bills"]);
      });
    });

    test("Then it should capture all form field values correctly", async () => {
      const updateSpy = jest.fn(() => Promise.resolve({}));
      const newBillInstance = makeSubmittableNewBill(makeBillsStore(updateSpy), jest.fn());

      fireEvent.change(screen.getByTestId("expense-type"), { target: { value: "Transports" } });
      fireEvent.change(screen.getByTestId("expense-name"), { target: { value: "Test expense" } });
      fireEvent.change(screen.getByTestId("datepicker"), { target: { value: "2024-01-15" } });
      fireEvent.change(screen.getByTestId("amount"), { target: { value: "500" } });
      fireEvent.change(screen.getByTestId("vat"), { target: { value: "100" } });
      fireEvent.change(screen.getByTestId("pct"), { target: { value: "20" } });
      fireEvent.change(screen.getByTestId("commentary"), { target: { value: "Test commentary" } });

      newBillInstance.handleFormSubmit(makeSubmitEvent());

      await waitFor(() => {
        expect(updateSpy).toHaveBeenCalledWith({
          data: JSON.stringify({
            email: TEST_EMAIL,
            type: "Transports",
            name: "Test expense",
            amount: 500,
            date: "2024-01-15",
            vat: "100",
            pct: 20,
            commentary: "Test commentary",
            fileUrl: TEST_FILE_URL,
            fileName: TEST_FILE_NAME,
            status: "pending",
          }),
          selector: TEST_BILL_ID,
        });
      });
    });

    test("Then it should not submit without file upload", async () => {
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
      const onNavigate = jest.fn();
      const newBillInstance = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage,
      });

      newBillInstance.handleFormSubmit(makeSubmitEvent());

      await new Promise(resolve => setTimeout(resolve, 100));
      expect(onNavigate).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith("Cannot submit bill: missing file upload");

      consoleErrorSpy.mockRestore();
    });

    describe("When there is an API error", () => {
      test("Then it should not redirect and log error", async () => {
        const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
        const errorStore = makeBillsStore(jest.fn(() => Promise.reject(new Error("Update failed"))));

        const onNavigate = jest.fn();
        const newBillInstance = makeSubmittableNewBill(errorStore, onNavigate);
        // No userData: the submit should still fail safely and log.
        newBillInstance.userData = null;

        newBillInstance.handleFormSubmit(makeSubmitEvent());

        await waitFor(() => {
          expect(consoleErrorSpy).toHaveBeenCalled();
        });
        expect(onNavigate).not.toHaveBeenCalled();

        consoleErrorSpy.mockRestore();
      });

      test("Then it should log error when update fails and handle the error", async () => {
        const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
        const updateError = new Error("Update failed");
        const updateSpy = jest.fn(() => Promise.reject(updateError));

        const onNavigate = jest.fn();
        const newBillInstance = makeSubmittableNewBill(makeBillsStore(updateSpy), onNavigate);

        newBillInstance.handleFormSubmit(makeSubmitEvent());

        await waitFor(() => {
          expect(consoleErrorSpy).toHaveBeenCalledWith("Error updating bill:", updateError);
        });
        expect(onNavigate).not.toHaveBeenCalled();

        consoleErrorSpy.mockRestore();
      });
    });
  });
});
