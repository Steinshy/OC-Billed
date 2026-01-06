import { ROUTES_PATH } from "../constants/routes.js";
import Logout from "./Logout.js";

export default class NewBill {
  constructor({ document, onNavigate, store, localStorage }) {
    this.document = document;
    this.onNavigate = onNavigate;
    this.store = store;
    this.fileUrl = null;
    this.fileName = null;
    this.billId = null;
    this.userData = JSON.parse(localStorage.getItem("user"));

    const formNewBill = this.document.querySelector("form[data-testid=\"form-new-bill\"]");
    formNewBill?.addEventListener("submit", this.handleSubmit);

    const fileInput = this.document.querySelector('input[data-testid="file"]');
    fileInput?.addEventListener("change", this.handleFileChange);

    new Logout({ document, localStorage, onNavigate });
  }
  handleFileChange = event => {
    event.preventDefault();
    const fileInput = event?.target?.querySelector('input[data-testid="file"]');
    const file = fileInput?.files[0];
    if (!file || !fileInput) return;

    const extension = file.name.split(".").pop().toLowerCase();
    const allowedExtensions = ["jpg", "jpeg", "png"];
    const fileInputContainer = fileInput.closest(".col-half");
    const userEmail = this.userData ? this.userData.email : JSON.parse(localStorage.getItem("user")).email;
    if (!allowedExtensions.includes(extension)) {
      const previousError = fileInputContainer?.querySelector(".file-error-message");
      if (previousError) previousError.remove();
      const errorMessage = document.createElement("small");
      errorMessage.className = "file-error-message";
      errorMessage.textContent = "Les fichiers autorisés sont: jpg, jpeg ou png";
      fileInputContainer.appendChild(errorMessage);
      fileInput.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("email", userEmail);

    this.store.bills().create({ data: formData, headers: { noContentType: true } })
    .then(({ fileUrl, key }) => {
      this.billId = key;
      this.fileUrl = fileUrl;
      this.fileName = file.name;
    }).catch(error => console.error(error));
  };
  handleSubmit = (event) => {
    event.preventDefault();
    const bill = {
      email: this.userData ? this.userData.email : "",
      type: event.target.querySelector("select[data-testid=\"expense-type\"]").value || "",
      name: event.target.querySelector("input[data-testid=\"expense-name\"]").value || "",
      amount: parseInt(event.target.querySelector("input[data-testid=\"amount\"]").value || 0),
      date: event.target.querySelector("input[data-testid=\"datepicker\"]").value || "",
      vat: event.target.querySelector("input[data-testid=\"vat\"]").value || 0,
      pct: parseInt(event.target.querySelector("input[data-testid=\"pct\"]").value) || 20,
      commentary: event.target.querySelector("textarea[data-testid=\"commentary\"]").value || "",
      fileUrl: this.fileUrl || "",
      fileName: this.fileName || "",
      status: "pending",
    };
    this.updateBill(bill);
  };

  // not need to cover this function by tests
  updateBill = (bill) => {
    if (this.store) {
      this.store.bills().update({ data: JSON.stringify(bill), selector: this.billId })
        .then(() => this.onNavigate(ROUTES_PATH["Bills"]))
        .catch(error => console.error(error));
    }
  };
}
