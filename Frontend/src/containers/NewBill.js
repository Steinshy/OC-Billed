import { ROUTES_PATH } from "../constants/routes.js";
import Logout from "./Logout.js";

const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png"];

export default class NewBill {
  constructor({ document, onNavigate, store, localStorage }) {
    this.document = document;
    this.onNavigate = onNavigate;
    this.store = store;
    this.localStorage = localStorage;
    this.resetFileState();
    const userItem = localStorage.getItem("user");
    this.userData = userItem ? JSON.parse(userItem) : null;

    const formNewBill = this.document.querySelector('form[data-testid="form-new-bill"]');
    if (formNewBill) formNewBill.addEventListener("submit", this.handleFormSubmit);
    else console.error("Form not found when initializing NewBill");

    const file = this.document.querySelector('input[data-testid="file"]');
    if (file) file.addEventListener("change", this.handleFileChange);
    else console.error("File input not found when initializing NewBill");

    new Logout({ document, localStorage, onNavigate });
  }

  resetFileState = () => {
    this.fileUrl = null;
    this.fileName = null;
    this.filePath = null;
    this.billId = null;
  };

  getUserEmail = () => {
    if (this.userData?.email) return this.userData.email;
    const userItem = this.localStorage.getItem("user");
    const user = userItem ? JSON.parse(userItem) : null;
    return user?.email ?? null;
  };

  handleFileChange = event => {
    event.preventDefault();
    const fileInput = event.target;
    const file = fileInput?.files[0];

    if (!file) {
      this.resetFileState();
      return;
    }

    const fileName = fileInput.value.split(/\\/g).pop();
    const extension = fileName.split(".").pop().toLowerCase();

    const fileInputContainer = fileInput.closest(".col-half");
    const existingError = fileInputContainer.querySelector(".file-error-message");

    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      if (!existingError) {
        const errorMessage = document.createElement("small");
        errorMessage.className = "file-error-message";
        errorMessage.textContent = "Les fichiers autorisés sont: jpg, jpeg ou png";
        fileInputContainer.appendChild(errorMessage);
      }
      fileInput.value = "";
      this.resetFileState();
      return;
    }

    if (existingError) existingError.remove();

    const email = this.getUserEmail();
    if (!email) {
      console.error("User email not found");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("email", email);

    this.store
      .bills()
      .create({ data: formData, headers: { noContentType: true } })
      .then(bill => {
        this.billId = bill.key;
        this.filePath = bill.filePath;
        this.fileUrl = `${this.store.api.baseUrl}/${bill.filePath}`;
        this.fileName = fileName;
      })
      .catch(error => console.error(error));
  };

  handleFormSubmit = event => {
    event.preventDefault();

    if (!this.billId || !this.fileUrl) {
      console.error("Cannot submit bill: missing file upload");
      return;
    }

    const email = this.getUserEmail();
    if (!email) {
      console.error("User email not found");
      return;
    }

    const bill = {
      email,
      type: event.target.querySelector('select[data-testid="expense-type"]').value,
      name: event.target.querySelector('input[data-testid="expense-name"]').value,
      amount: parseInt(event.target.querySelector('input[data-testid="amount"]').value),
      date: event.target.querySelector('input[data-testid="datepicker"]').value,
      vat: event.target.querySelector('input[data-testid="vat"]').value,
      pct: parseInt(event.target.querySelector('input[data-testid="pct"]').value) || 20,
      commentary: event.target.querySelector('textarea[data-testid="commentary"]').value,
      fileUrl: this.fileUrl,
      fileName: this.fileName,
      status: "pending",
    };
    this.updateBill(bill);
  };

  updateBill = bill => {
    if (!this.store) return;
    this.store
      .bills()
      .update({ data: JSON.stringify(bill), selector: this.billId })
      .then(() => {
        this.resetFileState();
        this.onNavigate(ROUTES_PATH["Bills"]);
      })
      .catch(error => {
        console.error("Error updating bill:", error);
      });
  };
}
