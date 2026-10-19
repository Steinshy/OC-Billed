/**
 * @jest-environment jsdom
 */

import DemoStore, { resetDemoStore } from "../app/DemoStore.js";

const EMPLOYEE_EMAIL = "employee@test.tld";

const credentials = (email, password) => JSON.stringify({ email, password });

const loginAs = async (store, email, password) => {
  const { jwt } = await store.login(credentials(email, password));
  window.localStorage.setItem("jwt", jwt);
};

describe("Given the in-browser demo store", () => {
  let store;

  beforeEach(() => {
    jest.useFakeTimers();
    window.localStorage.clear();
    resetDemoStore();
    store = new DemoStore();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const settle = async promise => {
    jest.runAllTimers();
    return promise;
  };

  describe("When I log in", () => {
    test("Then a seeded account gets a jwt", async () => {
      const result = await settle(store.login(credentials(EMPLOYEE_EMAIL, "employee")));
      expect(result.jwt).toBe("demo-jwt:employee@test.tld");
    });

    test("Then a wrong password is rejected like the API", async () => {
      await expect(settle(store.login(credentials(EMPLOYEE_EMAIL, "nope")))).rejects.toThrow(
        "Cannot authenticate user",
      );
    });
  });

  describe("When I list bills", () => {
    test("Then it requires a logged-in user", async () => {
      await expect(settle(store.bills().list())).rejects.toThrow("user must be authenticated");
    });

    test("Then an employee only sees their own bills", async () => {
      await settle(loginAs(store, EMPLOYEE_EMAIL, "employee"));
      const bills = await settle(store.bills().list());
      expect(bills).toHaveLength(3);
      expect(bills.every(bill => bill.email === EMPLOYEE_EMAIL)).toBe(true);
      expect(bills[0]).toHaveProperty("id");
    });

    test("Then an admin sees every bill", async () => {
      await settle(loginAs(store, "admin@test.tld", "admin"));
      const bills = await settle(store.bills().list());
      expect(bills).toHaveLength(6);
    });
  });

  describe("When an employee creates then submits a bill", () => {
    test("Then the bill is stored with its proof and persists", async () => {
      // jsdom's FileReader runs on timers, so this test uses the real latency.
      jest.useRealTimers();
      await loginAs(store, EMPLOYEE_EMAIL, "employee");
      const formData = new FormData();
      formData.append("file", new File(["img"], "receipt.png", { type: "image/png" }));
      formData.append("email", EMPLOYEE_EMAIL);

      const bill = await store.bills().create({ data: formData });
      expect(bill.fileName).toBe("receipt.png");
      expect(bill.filePath).toMatch(/^data:image\/png;base64,/);
      expect(bill.fileUrl).toBe(bill.filePath);

      await store.bills().update({ data: JSON.stringify({ name: "Taxi", amount: 30 }), selector: bill.key });
      const bills = await new DemoStore().bills().list();
      expect(bills).toHaveLength(4);
      expect(bills.find(item => item.id === bill.key)).toMatchObject({ name: "Taxi", amount: 30 });
    });
  });

  describe("When an employee updates someone else's bill", () => {
    test("Then it is rejected like the API", async () => {
      await settle(loginAs(store, EMPLOYEE_EMAIL, "employee"));
      await expect(
        settle(store.bills().update({ data: JSON.stringify({ name: "x" }), selector: "xAntdtPjo8zA42m5WhWcXR" })),
      ).rejects.toThrow("unauthorized action");
    });
  });
});
