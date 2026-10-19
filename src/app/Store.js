import { USE_DEMO } from "./config.js";
import DemoStore, { DEMO_TOKEN_PREFIX } from "./DemoStore.js";

const jsonOrThrowIfError = async response => {
  if (!response.ok) throw new Error((await response.json()).message);
  return response.json();
};

class Api {
  constructor({ baseUrl }) {
    this.baseUrl = baseUrl;
  }
  async get({ url, headers }) {
    return jsonOrThrowIfError(await fetch(`${this.baseUrl}${url}`, { headers, method: "GET" }));
  }
  async post({ url, data, headers }) {
    return jsonOrThrowIfError(
      await fetch(`${this.baseUrl}${url}`, {
        headers,
        method: "POST",
        body: data,
      }),
    );
  }
  async delete({ url, headers }) {
    return jsonOrThrowIfError(await fetch(`${this.baseUrl}${url}`, { headers, method: "DELETE" }));
  }
  async patch({ url, data, headers }) {
    return jsonOrThrowIfError(
      await fetch(`${this.baseUrl}${url}`, {
        headers,
        method: "PATCH",
        body: data,
      }),
    );
  }
}

const getHeaders = headers => {
  const headersObject = {};
  if (!headers.noContentType) headersObject["Content-Type"] = "application/json";
  const jwt = localStorage.getItem("jwt");
  if (jwt && !headers.noAuthorization) headersObject["Authorization"] = `Bearer ${jwt}`;
  return { ...headersObject, ...headers };
};

class ApiEntity {
  constructor({ key, api }) {
    this.key = key;
    this.api = api;
  }
  async select({ selector, headers = {} }) {
    return await this.api.get({
      url: `/${this.key}/${selector}`,
      headers: getHeaders(headers),
    });
  }
  async list({ headers = {} } = {}) {
    return await this.api.get({
      url: `/${this.key}`,
      headers: getHeaders(headers),
    });
  }
  async update({ data, selector, headers = {} }) {
    return await this.api.patch({
      url: `/${this.key}/${selector}`,
      headers: getHeaders(headers),
      data,
    });
  }
  async create({ data, headers = {} }) {
    return await this.api.post({
      url: `/${this.key}`,
      headers: getHeaders(headers),
      data,
    });
  }
  async delete({ selector, headers = {} }) {
    return await this.api.delete({
      url: `/${this.key}/${selector}`,
      headers: getHeaders(headers),
    });
  }
}

class Store {
  constructor() {
    this.api = new Api({ baseUrl: "http://localhost:5678" });
  }

  user = uid => new ApiEntity({ key: "users", api: this.api }).select({ selector: uid });
  users = () => new ApiEntity({ key: "users", api: this.api });
  login = data =>
    this.api.post({
      url: "/auth/login",
      data,
      headers: getHeaders({ noAuthorization: true }),
    });

  bill = bid => new ApiEntity({ key: "bills", api: this.api }).select({ selector: bid });
  bills = () => new ApiEntity({ key: "bills", api: this.api });
}

// On localhost the real API and the demo store (?demo) share localStorage: a session
// from the other store is meaningless here, so drop it and start from the login page.
const jwt = localStorage.getItem("jwt");
if (jwt && jwt.startsWith(DEMO_TOKEN_PREFIX) !== USE_DEMO) {
  localStorage.removeItem("jwt");
  localStorage.removeItem("user");
  window.history.replaceState(null, "", window.location.pathname);
}

export default USE_DEMO ? new DemoStore() : new Store();
