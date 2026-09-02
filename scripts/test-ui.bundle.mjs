var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/config/env.ts
var metaEnv, APP_NAME, APP_ENV, API_BASE_URL, TELEGRAM_BOT_USERNAME, TELEGRAM_DEV_MODE;
var init_env = __esm({
  "src/config/env.ts"() {
    metaEnv = import.meta?.env ?? {};
    APP_NAME = metaEnv.VITE_APP_NAME ?? "Lotus Hub";
    APP_ENV = metaEnv.MODE;
    API_BASE_URL = metaEnv.VITE_API_URL ?? "";
    TELEGRAM_BOT_USERNAME = metaEnv.VITE_TELEGRAM_BOT_USERNAME ?? "";
    TELEGRAM_DEV_MODE = !metaEnv.PROD && (metaEnv.VITE_TELEGRAM_DEV_MODE === void 0 || metaEnv.VITE_TELEGRAM_DEV_MODE !== "false");
  }
});

// src/services/auth.ts
var auth_exports = {};
__export(auth_exports, {
  AuthApiError: () => AuthApiError,
  checkAdmin: () => checkAdmin,
  fetchAccountSummary: () => fetchAccountSummary,
  getSession: () => getSession,
  login: () => login,
  logout: () => logout,
  registerComplete: () => registerComplete,
  registerStart: () => registerStart
});
async function request(method, path, body) {
  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      credentials: "same-origin",
      headers: body !== void 0 ? { "Content-Type": "application/json" } : void 0,
      body: body !== void 0 ? JSON.stringify(body) : void 0
    });
  } catch {
    throw new AuthApiError({
      status: 0,
      error: "network_error",
      message: "Cannot reach the service right now. Please try again."
    });
  }
  let data = null;
  try {
    data = await res.json();
  } catch {
  }
  if (!res.ok) {
    const err = data ?? {};
    throw new AuthApiError({
      status: res.status,
      error: err.error ?? "error",
      message: err.message ?? "Something went wrong.",
      field: err.field,
      retryAfterSeconds: err.retryAfterSeconds
    });
  }
  return data;
}
function getSession() {
  return request("GET", "/api/me");
}
async function login(username, password) {
  const data = await request("POST", "/api/auth/login", {
    username,
    password
  });
  return data.user;
}
function logout() {
  return request("POST", "/api/auth/logout", {});
}
function registerStart(telegram) {
  return request("POST", "/api/auth/register/start", { telegram });
}
function registerComplete(telegram, username, password) {
  return request("POST", "/api/auth/register/complete", {
    telegram,
    username,
    password
  });
}
function checkAdmin() {
  return request("GET", "/api/admin/status");
}
function fetchAccountSummary() {
  return request("GET", "/api/account/summary");
}
var BASE, AuthApiError;
var init_auth = __esm({
  "src/services/auth.ts"() {
    init_env();
    BASE = API_BASE_URL;
    AuthApiError = class extends Error {
      status;
      field;
      retryAfterSeconds;
      constructor(err) {
        super(err.message || "Something went wrong.");
        this.name = "AuthApiError";
        this.status = err.status;
        this.field = err.field;
        this.retryAfterSeconds = err.retryAfterSeconds;
      }
    };
  }
});

// scripts/test-ui.mjs
import { JSDOM } from "jsdom";
var dom = new JSDOM("<!doctype html><html><body></body></html>", {
  url: "http://localhost:5173/"
});
globalThis.window = dom.window;
globalThis.document = dom.window.document;
Object.defineProperty(globalThis, "navigator", {
  value: dom.window.navigator,
  configurable: true
});
var BASE2 = process.env.TEST_API_BASE ? process.env.TEST_API_BASE.replace(/\/api$/, "") : "http://localhost:5173";
var nativeFetch = globalThis.fetch;
var cookieJar = "";
globalThis.fetch = async (url, opts = {}) => {
  const full = String(url).startsWith("http") ? url : BASE2 + url;
  const headers = { ...opts.headers || {} };
  if (cookieJar) headers.Cookie = cookieJar;
  const res = await nativeFetch(full, { ...opts, headers });
  const sc = res.headers.get("set-cookie");
  if (sc) {
    const name = sc.split(";")[0];
    cookieJar = name === "lotus_session=;" ? "" : name;
  }
  return res;
};
var {
  login: login2,
  logout: logout2,
  getSession: getSession2,
  registerStart: registerStart2,
  registerComplete: registerComplete2,
  checkAdmin: checkAdmin2,
  AuthApiError: AuthApiError2
} = await Promise.resolve().then(() => (init_auth(), auth_exports));
var pass = 0;
var fail = 0;
var check = (name, cond, extra) => {
  if (cond) {
    pass++;
    console.log(`  \u2714 ${name}`);
  } else {
    fail++;
    console.log(`  \u2718 ${name}${extra ? " \u2014 " + JSON.stringify(extra) : ""}`);
  }
};
function sim(id, username) {
  return { id, username, simulated: true };
}
console.log("\n[register: new identity]");
var tgNew = 990101;
var start = await registerStart2(sim(tgNew, "uitester"));
check("start available", start.available === true, start);
var reg = await registerComplete2(sim(tgNew, "uitester"), "uitestuser", "UiTestPass1");
check("account created + authed user", reg.user.username === "uitestuser", reg.user);
check("6-digit Lotus Hub ID", /^\d{6}$/.test(reg.user.lotusHubId), reg.user.lotusHubId);
var meAfterReg = await getSession2();
check("session active after register", meAfterReg.authenticated === true);
console.log("\n[admin: normal user \u2192 403]");
try {
  await checkAdmin2();
  check("normal user rejected", false, "checkAdmin did not throw");
} catch (e) {
  check("normal user rejected (403)", e instanceof AuthApiError2 && e.status === 403, e.status);
}
console.log("\n[logout]");
await logout2();
var meAfterLogout = await getSession2();
check(
  "session cleared after logout",
  meAfterLogout.authenticated === false && meAfterLogout.reason === "no_session",
  meAfterLogout
);
console.log("\n[login: invalid]");
try {
  await login2("uitestuser", "WrongPass1");
  check("invalid login rejected", false, "did not throw");
} catch (e) {
  check(
    "generic message",
    e instanceof AuthApiError2 && e.status === 401 && e.message === "Invalid username or password.",
    e.message
  );
}
console.log("\n[login: valid]");
var u = await login2("uitestuser", "UiTestPass1");
check("logged in", u.username === "uitestuser", u);
var me = await getSession2();
check("session active after login", me.authenticated === true && me.user.username === "uitestuser");
console.log("\n[register: duplicate telegram]");
var dupStart = await registerStart2(sim(tgNew, "uitester"));
check("duplicate telegram reported", dupStart.available === false, dupStart);
try {
  await registerComplete2(sim(tgNew, "uitester"), "anotheruser", "OtherPass1");
  check("duplicate registration blocked", false, "did not throw");
} catch (e) {
  check("duplicate registration blocked (409)", e instanceof AuthApiError2 && e.status === 409, e.status);
}
console.log("\n[admin: super admin allowed]");
await logout2();
cookieJar = "";
await login2("admin", "AdminPass1");
var adminStatus = await checkAdmin2();
check("super admin authorized", adminStatus.ok === true && adminStatus.role === "superadmin", adminStatus);
console.log(`
==== ${pass} passed, ${fail} failed ====`);
if (fail > 0) process.exit(1);
