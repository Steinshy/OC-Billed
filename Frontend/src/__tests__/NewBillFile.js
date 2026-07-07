import { screen } from "@testing-library/dom";
import "@testing-library/jest-dom";
import mockStore from "../__mocks__/store.js";
import { NEW_BILL } from "../__mocks__/testConstants.js";
import { setupEmployeeUser } from "../__mocks__/testHelpers.js";
import NewBill from "../containers/NewBill.js";
import NewBillUI from "../views/NewBillUI.js";

const { TEST_EMAIL } = NEW_BILL;

const makeChangeEvent = ({ files, value, closest }) => {
  const changeEvent = new Event("change", { bubbles: true });
  Object.defineProperty(changeEvent, "preventDefault", { value: jest.fn() });
  Object.defineProperty(changeEvent, "target", {
    value: { files, value, ...(closest && { closest }) },
    writable: false,
  });
  return changeEvent;
};

describe("Given I am connected as an employee", () => {
  beforeEach(() => {
    setupEmployeeUser(TEST_EMAIL);
  });

  describe("When I select a valid image file", () => {
    test("Then it should accept jpg, jpeg, png image formats", async () => {
      const fileTypes = [
        { extension: "jpg", mimeType: "image/jpeg" },
        { extension: "jpeg", mimeType: "image/jpeg" },
        { extension: "png", mimeType: "image/png" },
      ];

      for (const fileType of fileTypes) {
        document.body.innerHTML = NewBillUI();
        const onNavigate = jest.fn();
        const storeWithApi = {
          ...mockStore,
          api: { baseUrl: "https://localhost:3456" },
        };
        const newBillInstance = new NewBill({
          document,
          onNavigate,
          store: storeWithApi,
          localStorage: window.localStorage,
        });

        const fileName = `test.${fileType.extension}`;
        const file = new File(["test"], fileName, { type: fileType.mimeType });
        const changeEvent = makeChangeEvent({
          files: [file],
          value: `C:\\fakepath\\${fileName}`,
        });
        changeEvent.target.closest = jest.fn().mockReturnValue({
          querySelector: jest.fn().mockReturnValue(null),
          appendChild: jest.fn(),
        });

        newBillInstance.handleFileChange(changeEvent);
        await new Promise(resolve => setTimeout(resolve, 100));

        const errorMessage = document.querySelector(".file-error-message");
        expect(errorMessage).toBeNull();
      }
    });
  });

  describe("When I select no file", () => {
    test("Then it should reset file data", () => {
      document.body.innerHTML = NewBillUI();
      const onNavigate = jest.fn();
      const newBillInstance = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage,
      });

      newBillInstance.fileUrl = "http://example.com/file.jpg";
      newBillInstance.fileName = "test.jpg";
      newBillInstance.billId = "123";

      newBillInstance.handleFileChange(makeChangeEvent({ files: [], value: "" }));

      expect(newBillInstance.fileUrl).toBeNull();
      expect(newBillInstance.fileName).toBeNull();
      expect(newBillInstance.filePath).toBeNull();
      expect(newBillInstance.billId).toBeNull();
    });
  });

  describe("When I select an invalid file", () => {
    test("Then it should show an error message for invalid file formats", () => {
      const invalidFormats = ["pdf", "doc", "docx", "xls", "txt"];

      for (const format of invalidFormats) {
        document.body.innerHTML = NewBillUI();
        const onNavigate = jest.fn();
        const newBillInstance = new NewBill({
          document,
          onNavigate,
          store: mockStore,
          localStorage: window.localStorage,
        });

        const fileInput = screen.getByTestId("file");
        const fileName = `test.${format}`;
        const file = new File(["test"], fileName, { type: "application/octet-stream" });
        const fileInputContainer = fileInput.closest(".col-half");

        const changeEvent = makeChangeEvent({
          files: [file],
          value: `C:\\fakepath\\${fileName}`,
          closest: jest.fn().mockReturnValue(fileInputContainer),
        });

        newBillInstance.handleFileChange(changeEvent);

        const errorMessage = document.querySelector(".file-error-message");
        expect(errorMessage).toBeTruthy();
        expect(errorMessage.textContent).toBe("Les fichiers autorisés sont: jpg, jpeg ou png");
      }
    });
  });
});
