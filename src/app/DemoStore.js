// In-browser stand-in for the Express API, used when USE_DEMO is on (GitHub Pages, Coolify).
// Mirrors Backend/controllers: same routes, response shapes and error messages.
// Data starts from Backend/seed.js and lives in sessionStorage: Logout clears localStorage,
// and the demo resets when the tab closes.
const STORAGE_KEY = "billed-demo-db";
export const DEMO_TOKEN_PREFIX = "demo-jwt:";
const LATENCY_MS = 200;
// Uploaded proofs are stored as data URLs; bigger files fall back to the demo receipt.
const MAX_FILE_BYTES = 1_000_000;
const DEMO_RECEIPT = "src/assets/images/facturefreemobile.jpg";
const PICTURE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
const BILL_FIELDS = [
  "name",
  "type",
  "email",
  "date",
  "vat",
  "pct",
  "commentary",
  "status",
  "commentAdmin",
  "amount",
];

const USER_MUST_BE_AUTHENTICATED = "user must be authenticated";
const UNAUTHORIZED_ACTION = "unauthorized action";

// Same date as Backend/seed.js (DEFAULT_SEED_DATE).
const SEED_DATE = "2021-11-22";

const SEED_USERS = [
  {
    key: "uoaRkMFrV67MKweoga5T3j",
    name: "employee",
    email: "employee@test.tld",
    type: "Employee",
    password: "employee",
    status: "connected",
  },
  {
    key: "29hUAGWbj3F9eaW4D7PvE1",
    name: "admin",
    email: "admin@test.tld",
    type: "Admin",
    password: "admin",
    status: "connected",
  },
];

const SEED_BILLS = [
  {
    key: "6g7PRkKM5gk35Fc2mw7JHw",
    vat: "40",
    status: "refused",
    type: "Transports",
    commentary: "Vol pour la vente de consommables",
    name: "Vol Paris Marseille",
    fileName: null,
    date: SEED_DATE,
    amount: 240,
    commentAdmin: "",
    pct: 20,
    email: "employee@test.tld",
    filePath: null,
  },
  {
    key: "7to5QJDw6o4XWK9Wsjs7Go",
    vat: "20",
    status: "accepted",
    type: "Hôtel et logement",
    commentary: "",
    name: "Hôtel du centre ville",
    fileName: "bill-abcde.jpg",
    date: SEED_DATE,
    amount: 120,
    commentAdmin: "",
    pct: 20,
    email: "employee@test.tld",
    filePath: DEMO_RECEIPT,
  },
  {
    key: "d7vVuoPrxhBZog2Nya6oCW",
    vat: "10",
    status: "pending",
    type: "Restaurants et bars",
    commentary: "Repas pour la vente",
    name: "Repas d'affaire",
    fileName: "bill-efgh.jpg",
    date: SEED_DATE,
    amount: 60,
    commentAdmin: "",
    pct: 20,
    email: "employee@test.tld",
    filePath: DEMO_RECEIPT,
  },
  {
    key: "xAntdtPjo8zA42m5WhWcXR",
    vat: "40",
    status: "pending",
    type: "Transports",
    commentary: "Sales meeting",
    name: "Fly London Paris",
    fileName: null,
    date: SEED_DATE,
    amount: 240,
    commentAdmin: "",
    pct: 20,
    email: "employee@company.test",
    filePath: null,
  },
  {
    key: "dMFWAp6UpHzNEqhK3aih29",
    vat: "10",
    status: "pending",
    type: "Restaurants et bars",
    commentary: "business meal",
    name: "Restaurant",
    fileName: "bill-abcde.jpg",
    date: SEED_DATE,
    amount: 60,
    commentAdmin: "",
    pct: 20,
    email: "employee@company.test",
    filePath: DEMO_RECEIPT,
  },
  {
    key: "nRHu1FXps8GDvNKwoQE7ma",
    vat: "20",
    status: "pending",
    type: "Hôtel et logement",
    commentary: "hotel room in city center",
    name: "Hotel room",
    fileName: "bill-efgh.jpg",
    date: SEED_DATE,
    amount: 120,
    commentAdmin: "",
    pct: 20,
    email: "employee@company.test",
    filePath: DEMO_RECEIPT,
  },
];

const clone = value => JSON.parse(JSON.stringify(value));

const loadDb = () => {
  const raw = sessionStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : { users: clone(SEED_USERS), bills: clone(SEED_BILLS) };
};
const saveDb = db => sessionStorage.setItem(STORAGE_KEY, JSON.stringify(db));

const delay = () => new Promise(resolve => setTimeout(resolve, LATENCY_MS));
const respond = async value => {
  await delay();
  return clone(value);
};
const fail = async message => {
  await delay();
  throw new Error(message);
};

const newKey = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 12)}`;

const pickBillAttributes = source =>
  Object.fromEntries(
    BILL_FIELDS.filter(field => source[field] !== undefined).map(field => [field, source[field]]),
  );

const toFileUrl = filePath => {
  if (!filePath) return null;
  return filePath.startsWith("data:") ? filePath : new URL(filePath, document.baseURI).href;
};

const toBillDTO = bill => ({
  id: bill.key,
  ...pickBillAttributes(bill),
  fileName: bill.fileName,
  fileUrl: toFileUrl(bill.filePath),
});

const currentUser = db => {
  const jwt = localStorage.getItem("jwt");
  if (!jwt?.startsWith(DEMO_TOKEN_PREFIX)) return null;
  return db.users.find(user => user.email === jwt.slice(DEMO_TOKEN_PREFIX.length)) ?? null;
};

const findBillForUser = (db, user, key) =>
  db.bills.find(bill => bill.key === key && (user.type === "Admin" || bill.email === user.email));

const readAsDataUrl = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

const bills = {
  async list() {
    const db = loadDb();
    const user = currentUser(db);
    if (!user) return fail(USER_MUST_BE_AUTHENTICATED);
    const visible =
      user.type === "Admin" ? db.bills : db.bills.filter(bill => bill.email === user.email);
    return respond(visible.map(toBillDTO));
  },
  async select({ selector }) {
    const db = loadDb();
    const user = currentUser(db);
    if (!user) return fail(USER_MUST_BE_AUTHENTICATED);
    const bill = findBillForUser(db, user, selector);
    return bill ? respond(toBillDTO(bill)) : fail(UNAUTHORIZED_ACTION);
  },
  async create({ data }) {
    const db = loadDb();
    if (!currentUser(db)) return fail(USER_MUST_BE_AUTHENTICATED);
    const file = data.get("file");
    const hasPicture = file instanceof Blob && PICTURE_TYPES.includes(file.type);
    let filePath = null;
    if (hasPicture)
      filePath = file.size <= MAX_FILE_BYTES ? await readAsDataUrl(file) : DEMO_RECEIPT;
    const bill = {
      key: newKey(),
      ...pickBillAttributes(Object.fromEntries(data.entries())),
      fileName: hasPicture ? file.name : null,
      filePath,
    };
    db.bills.push(bill);
    saveDb(db);
    return respond({ ...bill, fileUrl: toFileUrl(filePath) });
  },
  async update({ data, selector }) {
    const db = loadDb();
    const user = currentUser(db);
    if (!user) return fail(USER_MUST_BE_AUTHENTICATED);
    const bill = findBillForUser(db, user, selector);
    if (!bill) return fail(UNAUTHORIZED_ACTION);
    Object.assign(bill, pickBillAttributes(JSON.parse(data)));
    saveDb(db);
    return respond(bill);
  },
  async delete({ selector }) {
    const db = loadDb();
    const user = currentUser(db);
    if (!user) return fail(USER_MUST_BE_AUTHENTICATED);
    const bill = findBillForUser(db, user, selector);
    if (!bill) return fail(UNAUTHORIZED_ACTION);
    db.bills = db.bills.filter(item => item !== bill);
    saveDb(db);
    return respond("Bill removed");
  },
};

const users = {
  async create({ data }) {
    const db = loadDb();
    const { name, type, email, status, password } = JSON.parse(data);
    if (db.users.some(user => user.email === email)) return fail("Validation error");
    db.users.push({ key: newKey(), name, type, email, status, password });
    saveDb(db);
    return respond({ name, type, email, status });
  },
  async select({ selector }) {
    const db = loadDb();
    if (!currentUser(db)) return fail(USER_MUST_BE_AUTHENTICATED);
    const user = db.users.find(item => item.key === selector);
    if (!user) return fail(UNAUTHORIZED_ACTION);
    const { name, type, email, status } = user;
    return respond({ id: user.key, name, type, email, status });
  },
};

// Same public surface as Store (Store.js).
export default class DemoStore {
  user = uid => users.select({ selector: uid });
  users = () => users;
  login = async data => {
    const { email, password } = JSON.parse(data);
    const user = loadDb().users.find(item => item.email === email && item.password === password);
    return user
      ? respond({ jwt: `${DEMO_TOKEN_PREFIX}${user.email}` })
      : fail("Cannot authenticate user");
  };

  bill = bid => bills.select({ selector: bid });
  bills = () => bills;
}

// Test helper: drop the persisted demo data.
export const resetDemoStore = () => sessionStorage.removeItem(STORAGE_KEY);
