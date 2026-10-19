import { formatDate, formatStatus, validateFileUrl } from "../app/format.js";
import { ROUTES_PATH } from "../constants/routes.js";
import Logout from "./Logout.js";

export default class Bills {
  constructor({ document, onNavigate, store, localStorage }) {
    this.document = document;
    this.onNavigate = onNavigate;
    this.store = store;
    const buttonNewBill = document.querySelector('button[data-testid="btn-new-bill"]');
    if (buttonNewBill) buttonNewBill.addEventListener("click", this.handleClickNewBill);
    const iconsEye = document.querySelectorAll('div[data-testid="icon-eye"]');
    iconsEye.forEach(icon => icon.addEventListener("click", () => this.handleClickIconEye(icon)));
    new Logout({ document, localStorage, onNavigate });
  }

  handleClickNewBill = () => this.onNavigate(ROUTES_PATH["NewBill"]);

  handleClickIconEye = icon => {
    const billUrl = icon.getAttribute("data-bill-url");

    if (validateFileUrl(billUrl)) return;
    const modalElement = $("#modaleFile");
    const imgWidth = Math.floor(modalElement.width() * 0.5);
    modalElement
      .find(".modal-body")
      .html(`<div class="bill-proof-container"><img width=${imgWidth} src=${billUrl} alt="Bill" /></div>`);
    modalElement.attr("aria-hidden", "false");
    modalElement.modal("show");
  };

  getBills = () => {
    if (!this.store) return;
    return this.store
      .bills()
      .list()
      .then(snapshot =>
        snapshot.map(doc => {
          try {
            return {
              ...doc,
              date: formatDate(doc.date),
              status: formatStatus(doc.status),
            };
          } catch (error) {
            // Corrupted data: log it and fall back to the unformatted date.
            console.error(error, "for", doc);
            return {
              ...doc,
              date: doc.date,
              status: formatStatus(doc.status),
            };
          }
        }),
      );
  };
}
