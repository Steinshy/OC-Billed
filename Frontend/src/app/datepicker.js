// GLOBAL CONSTANTS
const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;
const WEEK = DAY * 7;

const _weekdays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const weekdays_short = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const months_short = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// PROTOTYPES
Date.prototype.getWeekNumber = function () {
  const d = new Date(
    Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()),
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
};

const DATEPICKER_FRAME_ID = "datepicker-frame";

// DATEPICKER
class Datepicker {
  constructor(host, s) {
    const t = this;
    t.host = host;
    t.frame = document.createElement("div");
    t.frame.id = DATEPICKER_FRAME_ID;
    t.frame.className = "noselect";

    // Run config if settings present
    if (s) t.config(s);

    // Show conditions
    window.onresize = () => {
      if (t.display_state) show(true);
    }; // to update screen position
    document.addEventListener("click", (e) => {
      if (
        e.target == document.getElementById("datepicker") &&
        !document.getElementById(DATEPICKER_FRAME_ID)
      ) {
        t.load("day"); // Start date when opening
        show(true);
      } else if (
        document.getElementById(DATEPICKER_FRAME_ID) != null &&
        !e.path.includes(document.getElementById(DATEPICKER_FRAME_ID))
      )
        show(false);
    });

    // Helper functions for load
    const createNavigationButton = (content, isEnabled, onClick) => {
      const button = document.createElement("li");
      button.innerHTML = content;
      if (isEnabled) {
        button.className = "pointer";
        button.onclick = onClick;
      } else {
        button.className = "disabled";
      }
      return button;
    };

    const canNavigatePrevious = (viewType) => {
      if (viewType === "day") {
        return (
          t.firstdate == undefined ||
          t.date.getMonth() > t.firstdate.getMonth() ||
          t.date.getFullYear() > t.firstdate.getFullYear()
        );
      }
      return (
        t.firstdate == undefined ||
        t.date.getFullYear() > t.firstdate.getFullYear()
      );
    };

    const canNavigateNext = (viewType) => {
      if (viewType === "day") {
        return (
          t.lastdate == undefined ||
          t.date.getMonth() < t.lastdate.getMonth() ||
          t.date.getFullYear() < t.lastdate.getFullYear()
        );
      }
      return (
        t.lastdate == undefined ||
        t.date.getFullYear() < t.lastdate.getFullYear()
      );
    };

    const isDateInRange = (day) => {
      const inFirstRange =
        t.firstdate == undefined
          ? true
          : day.getMonth() == t.firstdate.getMonth()
          ? day.getFullYear() == t.firstdate.getFullYear()
            ? day.getDate() >= t.firstdate.getDate()
            : true
          : true;

      const inLastRange =
        t.lastdate == undefined
          ? true
          : day.getMonth() == t.lastdate.getMonth()
          ? day.getFullYear() == t.lastdate.getFullYear()
            ? day.getDate() <= t.lastdate.getDate()
            : true
          : true;

      return inFirstRange && inLastRange;
    };

    const loadDayView = () => {
      const prev = createNavigationButton("<<", canNavigatePrevious("day"), () => {
        t.date = new Date(t.date.getFullYear(), t.date.getMonth() - 1, 1);
        t.load("day");
      });
      t.head.append(prev);

      const head = document.createElement("li");
      t.head.append(head);
      head.colSpan = 5;
      head.innerHTML = `${months[t.date.getMonth()]} ${t.date.getFullYear()}`;
      head.onclick = () => t.load("month");
      head.className = "pointer";

      const next = createNavigationButton(">>", canNavigateNext("day"), () => {
        t.date = new Date(t.date.getFullYear(), t.date.getMonth() + 1, 1);
        t.load("day");
      });
      t.head.append(next);

      const row = document.createElement("tr");
      t.table.append(row);
      for (let day = 0; day < 7; day++) {
        const cell = document.createElement("th");
        cell.innerHTML = weekdays_short[day];
        row.append(cell);
      }

      const first_day_in_month = new Date(
        t.date.getFullYear(),
        t.date.getMonth(),
        1,
      );
      let index = 1 - (first_day_in_month.getDay() || 7);
      for (let y = 0; y < 6; y++) {
        const tr = document.createElement("tr");
        t.table.append(tr);
        for (let x = 0; x < 7; x++) {
          const day = new Date(first_day_in_month.getTime());
          day.setDate(day.getDate() + index);

          const td = document.createElement("td");
          tr.append(td);
          td.innerHTML = day.getDate();

          const isCurrentMonth = day.getMonth() == t.date.getMonth();
          const isEnabled = t.disableddays(day) && isDateInRange(day);

          if (isCurrentMonth && isEnabled) {
            td.className = "pointer";
            td.onclick = () => {
              t.setDate(day);
              show(false);
            };
          } else {
            td.className = "disabled";
          }
          td.className +=
            day.toDateString() == new Date().toDateString() ? " today" : "";

          index++;
        }
      }
    };

    const loadMonthView = () => {
      const prev = createNavigationButton("<<", canNavigatePrevious("month"), () => {
        t.date = new Date(t.date.getFullYear() - 1, 1, 1);
        t.load("month");
      });
      t.head.append(prev);

      const head = document.createElement("li");
      t.head.append(head);
      head.innerHTML = t.date.getFullYear();

      const next = createNavigationButton(">>", canNavigateNext("month"), () => {
        t.date = new Date(t.date.getFullYear() + 1, 1, 1);
        t.load("month");
      });
      t.head.append(next);

      for (let y = 0; y < 3; y++) {
        const row = document.createElement("tr");
        t.table.append(row);
        for (let x = 0; x < 4; x++) {
          const index = y * 4 + x;
          const day = new Date(t.date.getFullYear(), index, 1);

          const cell = document.createElement("td");
          row.append(cell);
          cell.innerHTML = months_short[index];

          const inRange =
            (t.firstdate == undefined
              ? true
              : day.getTime() >= new Date(t.firstdate).setDate(1)) &&
            (t.lastdate == undefined
              ? true
              : day.getTime() <= new Date(t.lastdate).setDate(1));

          if (inRange) {
            cell.className = "pointer";
            cell.onclick = () => {
              t.date = new Date(t.date.getFullYear(), index, 1);
              t.load("day");
            };
          } else {
            cell.className = "disabled";
          }
        }
      }
    };

    // Load
    t.load = function (n) {
      while (t.frame.firstChild) t.frame.removeChild(t.frame.firstChild);

      t.head = document.createElement("ul");
      t.frame.append(t.head);

      t.table = document.createElement("table");
      t.frame.append(t.table);
      t.table.className = n;

      if (n == "day") {
        loadDayView();
      } else if (n == "month") {
        loadMonthView();
      }
    };

    const show = function (bool) {
      if (bool) {
        const rect = t.host.getBoundingClientRect();
        const x = (rect.left + rect.right) / 2;
        const y = rect.bottom - rect.top + document.documentElement.scrollTop;
        t.frame.style.setProperty("top", `${y + 20  }px`);
        t.frame.style.setProperty("left", `${x - 152  }px`);

        document.body.append(t.frame);
      } else if (!bool) document.getElementById(DATEPICKER_FRAME_ID).remove();
    };
  }

  config(s) {
    this.firstdate = s.firstdate || this.firstdate;
    this.lastdate = s.lastdate || this.lastdate;
    this.disableddays =
      s.disableddays ||
      this.disableddays ||
      (() => {
        return true;
      });
    this.format =
      s.format ||
      this.format ||
      ((d) => {
        return d;
      });

    this.validateConfig();

    const initialDate = this.findValidInitialDate();
    this.date = this.date || initialDate;
    this.host.value = this.format(this.date);
  }

  validateConfig() {
    if (typeof this.firstdate != "object" && this.firstdate != undefined) {
      throw new Error("firstdate is not of type Object");
    }
    if (typeof this.lastdate != "object" && this.lastdate != undefined) {
      throw new Error("lastdate is not of type Object");
    }
    if (typeof this.disableddays != "function") {
      throw new Error("disableddays is not of type function");
    }
    if (typeof this.format != "function") {
      throw new Error("format is not of type function");
    }
  }

  findValidInitialDate() {
    const d = new Date();
    let date = d;

    while (!this.disableddays(date)) {
      date = this.selectInitialDate(d);
      d.setTime(d.getTime() + DAY);
    }

    return date;
  }

  selectInitialDate(d) {
    if (this.firstdate && this.lastdate) {
      const inRange =
        d.getTime() >= this.firstdate.getTime() &&
        d.getTime() <= this.lastdate.getTime();
      return inRange ? d : this.firstdate;
    }

    if (this.firstdate) {
      return d.getTime() >= this.firstdate.getTime() ? d : this.firstdate;
    }

    if (this.lastdate) {
      return d.getTime() <= this.lastdate.getTime() ? d : this.lastdate;
    }

    return d;
  }

  getDate() {
    return this.date;
  }

  setDate(date) {
    if (date < this.firstdate || date > this.lastdate) return;
    if (!this.disableddays(date)) {
      const nextDate = new Date(date.getTime() + DAY);
      this.setDate(nextDate);
      return;
    }
    this.date = date;
    this.host.value = this.format(date);
    if (typeof this.host.onchange == "function") this.host.onchange();
  }
}
