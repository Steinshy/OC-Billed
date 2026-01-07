import { formatDate } from "../app/format.js";
import BigBilledIcon from "../assets/svg/big_billed.js";
import { ROUTES_PATH } from "../constants/routes.js";
import USERS_TEST from "../constants/usersTest.js";
import DashboardFormUI from "../views/DashboardFormUI.js";
import Logout from "./Logout.js";

export const filteredBills = (data, status) => {
  return data && data.length
    ? data.filter((bill) => {
        let selectCondition;

        // in jest environment
        if (typeof jest !== "undefined") {
          selectCondition = bill.status === status;
        } else {
        /* istanbul ignore next */
          // in prod environment
          const user = JSON.parse(localStorage.getItem("user"));
          const userEmail = user.email;
          const isAdmin = user.type === "Admin";

          if (isAdmin) {
            selectCondition = bill.status === status && !USERS_TEST.includes(bill.email);
          } else {
            selectCondition =
              bill.status === status &&
              ![...USERS_TEST, userEmail].includes(bill.email);
          }
        }

        return selectCondition;
      })
    : [];
};

export const validateFileUrl = value => {
  if (value == null || typeof value !== "string") return true;
  const trimmed = value.trim();
  return !trimmed || /^(null|undefined)$|\/(null|undefined)/.test(trimmed);
};

export const formatBillForDisplay = bill => {
  const hasValidFile = !validateFileUrl(bill.fileUrl);
  return {
    ...bill,
    hasValidFile,
    displayFileName: validateFileUrl(bill.fileName) ? "" : bill.fileName,
    displayFileUrl: validateFileUrl(bill.fileUrl) ? "" : bill.fileUrl,
    displayCommentAdmin: validateFileUrl(bill.commentAdmin) ? "" : bill.commentAdmin,
  };
};

export const card = (bill) => {
  const firstAndLastNames = bill.email.split("@")[0];
  const firstName = firstAndLastNames.includes(".")
    ? firstAndLastNames.split(".")[0]
    : "";
  const lastName = firstAndLastNames.includes(".")
    ? firstAndLastNames.split(".")[1]
    : firstAndLastNames;

  return `
    <div class='bill-card' id='open-bill${bill.id}' data-testid='open-bill${
    bill.id
  }'>
      <div class='bill-card-name-container'>
        <div class='bill-card-name'> ${firstName} ${lastName} </div>
        <span class='bill-card-grey'> ... </span>
      </div>
      <div class='name-price-container'>
        <span> ${bill.name} </span>
        <span> ${bill.amount} € </span>
      </div>
      <div class='date-type-container'>
        <span> ${formatDate(bill.date)} </span>
        <span> ${bill.type} </span>
      </div>
    </div>
  `;
};

export const cards = (bills) => {
  return bills && bills.length ? bills.map((bill) => card(bill)).join("") : "";
};

export const getStatus = (index) => {
  switch (index) {
    case 1:
      return "pending";
    case 2:
      return "accepted";
    case 3:
      return "refused";
  }
};


export default class {
  constructor({ document, onNavigate, store, bills, localStorage }) {
    this.document = document;
    this.onNavigate = onNavigate;
    this.store = store;
    this.bills = bills;
    this.preservedSectionIndex = null;

    $(document).on("click", "#status-bills-header1", () => this.handleShowTickets(1));
    $(document).on("click", "#arrow-icon1", (event) => {
      event.stopPropagation();
      this.handleShowTickets(1);
    });
    $(document).on("click", "#status-bills-header2", () => this.handleShowTickets(2));
    $(document).on("click", "#arrow-icon2", (event) => {
      event.stopPropagation();
      this.handleShowTickets(2);
    });
    $(document).on("click", "#status-bills-header3", () => this.handleShowTickets(3));
    $(document).on("click", "#arrow-icon3", (event) => {
      event.stopPropagation();
      this.handleShowTickets(3);
    });


    $(document).on("click", '[id^="open-bill"]', event => {
      const billId = event.currentTarget.id.replace("open-bill", "");
      const bill = this.bills.find(b => b.id === billId);
      if (bill) {
        this.handleEditTicket(event, bill, this.bills);
      }
    });

    if (this.preservedSectionIndex !== null && this.bills && this.bills.length > 0) {
      setTimeout(() => {
        const headerElement = $(`#status-bills-header${this.preservedSectionIndex}`);
        if (headerElement.length > 0) {
          this.handleShowTickets(this.preservedSectionIndex);
        }
      }, 100);
    }
    new Logout({ localStorage, onNavigate });
  }

  handleShowTickets(index) {
    const sectionIsOpen = this.index !== undefined && this.index !== index;

    const openTicketsSection = (index) => {
      this.index = index;
      this.preservedSectionIndex = index;
      this.isSectionOpen = true;
      $(`#arrow-icon${index}`).css({ transform: "rotate(0deg)" });
      $(`#status-bills-container${index}`).html(
        cards(filteredBills(this.bills, getStatus(this.index))),
      );
    };

    const closeTicketsSection = index => {
      this.isSectionOpen = false;
      $(`#arrow-icon${index}`).css({ transform: "rotate(90deg)" });
      $(`#status-bills-container${index}`).html("");
    };

    if (sectionIsOpen || this.index === undefined || !this.isSectionOpen) {
      openTicketsSection(index);
    } else {
      closeTicketsSection(index);
    }
    return this.bills;
  }

  handleClickIconEye = () => {
    const iconEyes = $("#icon-eye-d");
    if (iconEyes.hasClass("disabled")) return;

    const billUrl = iconEyes.attr("data-bill-url");
    if (validateFileUrl(billUrl)) return;
    const imgWidth = Math.floor($("#modaleFileAdmin1").width() * 0.8);
    $("#modaleFileAdmin1").find(".modal-body")
      .html(`<div class="bill-proof-container"><img width=${imgWidth} src=${billUrl} alt="Bill"/></div>`);
    if (typeof $("#modaleFileAdmin1").modal === "function")
      $("#modaleFileAdmin1").modal("show");
  };

  handleEditTicket(e, bill, bills) {
    const isSwitchingTicket = this.id !== undefined && this.id !== bill.id;

    if (isSwitchingTicket) {
      $(`#open-bill${this.id}`).css({ background: "#0D5AE5" });
      this.id = bill.id;
      this.counter = 1;
      bills.forEach(b => {
        $(`#open-bill${b.id}`).css({ background: "#0D5AE5" });
      });
      $(`#open-bill${bill.id}`).css({ background: "#2A2B35" });
      $(".dashboard-right-container div").html(DashboardFormUI(formatBillForDisplay(bill)));
      $(".vertical-navbar").css({ height: "150vh" });
    } else if (this.id === undefined) {
      this.id = bill.id;
      this.counter = 0;
    }

    if (!isSwitchingTicket) {
      if (this.counter % 2 === 0) {
        bills.forEach(b => {
          $(`#open-bill${b.id}`).css({ background: "#0D5AE5" });
        });
        $(`#open-bill${bill.id}`).css({ background: "#2A2B35" });
        $(".dashboard-right-container div").html(DashboardFormUI(formatBillForDisplay(bill)));
        $(".vertical-navbar").css({ height: "150vh" });
        this.counter++;
      } else {
        $(`#open-bill${bill.id}`).css({ background: "#0D5AE5" });
        $(".dashboard-right-container").html(`
          <h3> Validations </h3>
          <div id="big-billed-icon" data-testid="big-billed-icon">${BigBilledIcon}</div>
        `);
        $(".vertical-navbar").css({ height: "120vh" });
        this.counter++;
      }
    }

    $("#icon-eye-d").off("click").click(this.handleClickIconEye);
    $("#btn-accept-bill").click(event => this.handleAcceptSubmit(event, bill));
    $("#btn-refuse-bill").click(event => this.handleRefuseSubmit(event, bill));
  }

  handleAcceptSubmit = async (event, bill) => {
    event.preventDefault();
    const newBill = {
      id: bill.id,
      name: bill.name,
      type: bill.type,
      email: bill.email,
      date: bill.date,
      vat: bill.vat,
      pct: bill.pct,
      commentary: bill.commentary,
      amount: bill.amount,
      status: "accepted",
      commentAdmin: $("#commentary2").val(),
    };
    await this.updateBill(newBill);
    this.onNavigate(ROUTES_PATH["Dashboard"]);
  };

  handleRefuseSubmit = async (event, bill) => {
    event.preventDefault();
    const newBill = {
      id: bill.id,
      name: bill.name,
      type: bill.type,
      email: bill.email,
      date: bill.date,
      vat: bill.vat,
      pct: bill.pct,
      commentary: bill.commentary,
      amount: bill.amount,
      status: "refused",
      commentAdmin: $("#commentary2").val(),
    };
    await this.updateBill(newBill);
    this.onNavigate(ROUTES_PATH["Dashboard"]);
  };


  getBillsAllUsers = () => {
    if (this.store) {
      return this.store
        .bills()
        .list()
        .then((snapshot) => {
          const bills = snapshot.map((doc) => ({
            id: doc.id,
            ...doc,
            date: doc.date,
            status: doc.status,
          }));
          return bills;
        })
        .catch((error) => {
          throw error;
        });
    }
    return Promise.reject(new Error("Store is not available"));
  };

  // not need to cover this function by tests
  /* istanbul ignore next */
  updateBill = async (bill) => {
    if (this.store) {
      return await this.store.bills()
        .update({ data: JSON.stringify(bill), selector: bill.id })
        .catch(error => {
          console.error(error);
          return Promise.reject(new Error("Failed to update bill"));
        });
    }
    return Promise.reject(new Error("Store is not available"));
  };
}
