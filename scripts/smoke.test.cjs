var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/utils/cn.ts
function cn(...parts) {
  return parts.filter(Boolean).join(" ");
}
var init_cn = __esm({
  "src/utils/cn.ts"() {
  }
});

// src/components/ui/LotusLogo.tsx
function LotusMark({
  className,
  color = "currentColor"
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "svg",
    {
      viewBox: "0 0 64 64",
      fill: "none",
      className: cn("lotus-mark", className),
      "aria-hidden": "true",
      role: "img",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          "g",
          {
            stroke: color,
            strokeWidth: "2.6",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M32 50 C 22 44, 20 26, 32 12 C 44 26, 42 44, 32 50 Z" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M30 48 C 18 40, 10 30, 14 14 C 26 20, 34 32, 30 48 Z" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M34 48 C 46 40, 54 30, 50 14 C 38 20, 30 32, 34 48 Z" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M28 46 C 14 40, 6 30, 10 12 C 22 16, 30 30, 28 46 Z" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M36 46 C 50 40, 58 30, 54 12 C 42 16, 34 30, 36 46 Z" })
            ]
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "path",
          {
            d: "M20 52 H 44",
            stroke: color,
            strokeWidth: "2.6",
            strokeLinecap: "round"
          }
        )
      ]
    }
  );
}
function LotusLogo({
  className,
  withWordmark = false,
  color
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "span",
    {
      className: cn("lotus-logo", className),
      style: { display: "inline-flex", alignItems: "center", gap: 10 },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LotusMark, { color, className: "lotus-logo__mark" }),
        withWordmark && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          "span",
          {
            className: "lotus-logo__wordmark",
            style: {
              fontSize: 20,
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: "var(--text)"
            },
            children: [
              "Lotus",
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { color: "var(--accent)" }, children: "Hub" })
            ]
          }
        )
      ]
    }
  );
}
var import_jsx_runtime;
var init_LotusLogo = __esm({
  "src/components/ui/LotusLogo.tsx"() {
    init_cn();
    import_jsx_runtime = require("react/jsx-runtime");
  }
});

// src/pages/errors/RouteError.tsx
function RouteError() {
  const error = (0, import_react_router_dom.useRouteError)();
  if (import_meta.env?.DEV && error) {
    console.error("[RouteError]", error);
  }
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("main", { className: "error-page", role: "alert", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "error-page__card", children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(LotusMark, { className: "error-page__mark" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "error-page__code", children: "Error" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("h1", { className: "error-page__title", children: "This page hit a problem" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: "error-page__message", children: "Something went wrong while rendering this page. Please try again." }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "error-page__actions", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { type: "button", className: "btn btn-secondary", onClick: () => window.location.reload(), children: "Retry" }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_react_router_dom.Link, { to: "/", className: "btn btn-primary", children: "Home" })
    ] })
  ] }) });
}
var import_react_router_dom, import_jsx_runtime2, import_meta;
var init_RouteError = __esm({
  "src/pages/errors/RouteError.tsx"() {
    import_react_router_dom = require("react-router-dom");
    init_LotusLogo();
    import_jsx_runtime2 = require("react/jsx-runtime");
    import_meta = {};
  }
});

// src/config/env.ts
var import_meta2, metaEnv, APP_NAME, APP_ENV, API_BASE_URL, TELEGRAM_BOT_USERNAME, TELEGRAM_DEV_MODE;
var init_env = __esm({
  "src/config/env.ts"() {
    import_meta2 = {};
    metaEnv = import_meta2?.env ?? {};
    APP_NAME = metaEnv.VITE_APP_NAME ?? "Lotus Hub";
    APP_ENV = metaEnv.MODE;
    API_BASE_URL = metaEnv.VITE_API_URL ?? "";
    TELEGRAM_BOT_USERNAME = metaEnv.VITE_TELEGRAM_BOT_USERNAME ?? "";
    TELEGRAM_DEV_MODE = !metaEnv.PROD && (metaEnv.VITE_TELEGRAM_DEV_MODE === void 0 || metaEnv.VITE_TELEGRAM_DEV_MODE !== "false");
  }
});

// src/services/auth.ts
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

// src/context/AuthContext.tsx
function AuthProvider({ children }) {
  const [status, setStatus] = (0, import_react.useState)("loading");
  const [user, setUser] = (0, import_react.useState)(null);
  const [sessionExpired, setSessionExpired] = (0, import_react.useState)(false);
  const refresh = (0, import_react.useCallback)(async () => {
    try {
      const session = await getSession();
      if (session.authenticated && session.user) {
        setUser(session.user);
        setStatus("authenticated");
        setSessionExpired(false);
      } else {
        setUser(null);
        setStatus("anonymous");
        setSessionExpired(session.reason === "expired");
      }
    } catch {
      setUser(null);
      setStatus("anonymous");
    }
  }, []);
  (0, import_react.useEffect)(() => {
    refresh();
  }, [refresh]);
  const login2 = (0, import_react.useCallback)(
    async (username, password) => {
      const u = await login(username, password);
      setUser(u);
      setStatus("authenticated");
      setSessionExpired(false);
    },
    []
  );
  const logout2 = (0, import_react.useCallback)(async () => {
    try {
      await logout();
    } catch {
    }
    setUser(null);
    setStatus("anonymous");
    setSessionExpired(false);
  }, []);
  const beginRegistration = (0, import_react.useCallback)(
    async (telegram) => registerStart(telegram),
    []
  );
  const completeRegistration = (0, import_react.useCallback)(
    async (telegram, username, password) => {
      const { user: u } = await registerComplete(telegram, username, password);
      setUser(u);
      setStatus("authenticated");
      setSessionExpired(false);
    },
    []
  );
  const value = (0, import_react.useMemo)(
    () => ({
      status,
      user,
      sessionExpired,
      login: login2,
      logout: logout2,
      beginRegistration,
      completeRegistration,
      refresh
    }),
    [status, user, sessionExpired, login2, logout2, beginRegistration, completeRegistration, refresh]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(AuthContext.Provider, { value, children });
}
function useAuth() {
  const ctx = (0, import_react.useContext)(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
var import_react, import_jsx_runtime3, AuthContext;
var init_AuthContext = __esm({
  "src/context/AuthContext.tsx"() {
    import_react = require("react");
    init_auth();
    import_jsx_runtime3 = require("react/jsx-runtime");
    AuthContext = (0, import_react.createContext)(null);
  }
});

// src/config/site.ts
var SITE_NAME, NAV, LEGAL, SUPPORT_LINKS;
var init_site = __esm({
  "src/config/site.ts"() {
    SITE_NAME = "Lotus Hub";
    NAV = {
      desktop: [
        { label: "Home", to: "/" },
        { label: "Browse", to: "/browse" },
        { label: "Categories", to: "/categories" },
        { label: "Get Tokens", to: "/tokens" },
        { label: "Profile", to: "/profile" }
      ],
      mobile: [
        { label: "Home", to: "/" },
        { label: "Browse", to: "/browse" },
        { label: "Categories", to: "/categories" },
        { label: "Tokens", to: "/tokens" },
        { label: "Profile", to: "/profile" }
      ]
    };
    LEGAL = {
      label: "Legal",
      links: [
        { label: "Terms", to: "/terms" },
        { label: "Privacy", to: "/privacy" },
        { label: "Cookies", to: "/cookies" }
      ]
    };
    SUPPORT_LINKS = [
      { label: "FAQ", to: "/faq" },
      { label: "Contact", to: "/contact" }
    ];
  }
});

// src/components/layout/DesktopNav.tsx
function DesktopNav() {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("nav", { "aria-label": "Primary", className: "desktop-nav", children: NAV.desktop.map((item) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
    import_react_router_dom2.NavLink,
    {
      to: item.to,
      className: ({ isActive }) => cn("desktop-nav__link", isActive && "is-active"),
      children: item.label
    },
    item.to
  )) });
}
var import_react_router_dom2, import_jsx_runtime4;
var init_DesktopNav = __esm({
  "src/components/layout/DesktopNav.tsx"() {
    import_react_router_dom2 = require("react-router-dom");
    init_site();
    init_cn();
    import_jsx_runtime4 = require("react/jsx-runtime");
  }
});

// src/components/layout/MobileNav.tsx
function MobileNav() {
  const items = [
    { label: "Home", to: "/", icon: "\u2302" },
    { label: "Browse", to: "/browse", icon: "\u2315" },
    { label: "Categories", to: "/categories", icon: "\u25A6" },
    { label: "Tokens", to: "/tokens", icon: "\u25C8" },
    { label: "Profile", to: "/profile", icon: "\u25CB" }
  ];
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("nav", { "aria-label": "Mobile", className: "mobile-nav", children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
    import_react_router_dom3.NavLink,
    {
      to: item.to,
      end: item.to === "/",
      className: ({ isActive }) => cn("mobile-nav__link", isActive && "is-active"),
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "mobile-nav__icon", "aria-hidden": "true", children: item.icon }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "mobile-nav__label", children: item.label })
      ]
    },
    item.to
  )) });
}
var import_react_router_dom3, import_jsx_runtime5;
var init_MobileNav = __esm({
  "src/components/layout/MobileNav.tsx"() {
    import_react_router_dom3 = require("react-router-dom");
    init_cn();
    import_jsx_runtime5 = require("react/jsx-runtime");
  }
});

// src/components/layout/Header.tsx
function Header() {
  const location = (0, import_react_router_dom4.useLocation)();
  const navigate = (0, import_react_router_dom4.useNavigate)();
  const { status, user, logout: logout2 } = useAuth();
  const [menuOpen, setMenuOpen] = (0, import_react2.useState)(false);
  const onAuthPage = location.pathname === "/login" || location.pathname === "/register";
  const authed = status === "authenticated" && !!user;
  const handleLogout = async () => {
    setMenuOpen(false);
    await logout2();
    navigate("/login", { replace: true });
  };
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(import_jsx_runtime6.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("header", { className: "header", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "header__inner container", children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_react_router_dom4.Link, { to: "/", className: "header__brand", "aria-label": "Lotus Hub \u2014 Home", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(LotusLogo, { withWordmark: true }) }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(DesktopNav, {}),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "header__actions", children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
          import_react_router_dom4.Link,
          {
            to: "/browse",
            className: "header__search",
            "aria-label": "Search and browse",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { "aria-hidden": "true", children: "\u2315" }),
              /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "header__search-label", children: "Search" })
            ]
          }
        ),
        authed ? /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "user-menu", children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
            "button",
            {
              type: "button",
              className: "user-menu__trigger",
              onClick: () => setMenuOpen((v) => !v),
              "aria-haspopup": "menu",
              "aria-expanded": menuOpen,
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "user-menu__avatar", "aria-hidden": "true", children: user.username.charAt(0).toUpperCase() }),
                /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "user-menu__name", children: user.username })
              ]
            }
          ),
          menuOpen && /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "user-menu__dropdown", role: "menu", children: [
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
              import_react_router_dom4.Link,
              {
                to: "/profile",
                className: "user-menu__item",
                onClick: () => setMenuOpen(false),
                role: "menuitem",
                children: "Profile"
              }
            ),
            user.role === "superadmin" && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
              import_react_router_dom4.Link,
              {
                to: "/Admin/admin",
                className: "user-menu__item",
                onClick: () => setMenuOpen(false),
                role: "menuitem",
                children: "Admin"
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
              "button",
              {
                type: "button",
                className: "user-menu__item user-menu__item--danger",
                onClick: handleLogout,
                role: "menuitem",
                children: "Sign out"
              }
            )
          ] })
        ] }) : !onAuthPage && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_react_router_dom4.Link, { to: "/login", className: "btn btn-secondary btn-sm", children: "Sign in" })
      ] })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(MobileNav, {}),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "header-spacer", "aria-hidden": "true" })
  ] });
}
var import_react2, import_react_router_dom4, import_jsx_runtime6;
var init_Header = __esm({
  "src/components/layout/Header.tsx"() {
    import_react2 = require("react");
    import_react_router_dom4 = require("react-router-dom");
    init_LotusLogo();
    init_AuthContext();
    init_DesktopNav();
    init_MobileNav();
    import_jsx_runtime6 = require("react/jsx-runtime");
  }
});

// src/components/layout/Footer.tsx
function Footer() {
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("footer", { className: "footer", children: /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "container", children: [
    /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "footer__grid", children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "footer__brand", children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(LotusMark, { className: "footer__mark" }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("p", { className: "footer__about", children: [
          SITE_NAME,
          " is a premium media content discovery platform. Thoughtfully organized, always evolving."
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "footer__col", children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("h4", { className: "footer__heading", children: "Explore" }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("nav", { "aria-label": "Explore", children: [
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_react_router_dom5.Link, { to: "/browse", children: "Browse" }),
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_react_router_dom5.Link, { to: "/categories", children: "Categories" }),
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_react_router_dom5.Link, { to: "/tokens", children: "Get Tokens" }),
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_react_router_dom5.Link, { to: "/profile", children: "Profile" })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "footer__col", children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("h4", { className: "footer__heading", children: "Support" }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("nav", { "aria-label": "Support", children: SUPPORT_LINKS.map((l) => /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_react_router_dom5.Link, { to: l.to, children: l.label }, l.to)) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "footer__col", children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("h4", { className: "footer__heading", children: LEGAL.label }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("nav", { "aria-label": "Legal", children: LEGAL.links.map((l) => /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_react_router_dom5.Link, { to: l.to, children: l.label }, l.to)) })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "footer__bottom", children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("span", { children: [
        "\xA9 ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " ",
        SITE_NAME,
        ". All rights reserved."
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { children: "Made for discovery." })
    ] })
  ] }) });
}
var import_react_router_dom5, import_jsx_runtime7;
var init_Footer = __esm({
  "src/components/layout/Footer.tsx"() {
    import_react_router_dom5 = require("react-router-dom");
    init_LotusLogo();
    init_site();
    import_jsx_runtime7 = require("react/jsx-runtime");
  }
});

// src/hooks/useScrollToTop.ts
function useScrollToTop() {
  const { pathname } = (0, import_react_router_dom6.useLocation)();
  (0, import_react3.useEffect)(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);
}
var import_react3, import_react_router_dom6;
var init_useScrollToTop = __esm({
  "src/hooks/useScrollToTop.ts"() {
    import_react3 = require("react");
    import_react_router_dom6 = require("react-router-dom");
  }
});

// src/layouts/PublicLayout.tsx
function PublicLayout() {
  useScrollToTop();
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "app-shell", children: [
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("a", { className: "skip-link", href: "#main", children: "Skip to content" }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Header, {}),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("main", { id: "main", className: "app-main", children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(import_react_router_dom7.Outlet, {}) }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Footer, {})
  ] });
}
var import_react_router_dom7, import_jsx_runtime8;
var init_PublicLayout = __esm({
  "src/layouts/PublicLayout.tsx"() {
    import_react_router_dom7 = require("react-router-dom");
    init_Header();
    init_Footer();
    init_useScrollToTop();
    import_jsx_runtime8 = require("react/jsx-runtime");
  }
});

// src/layouts/AuthLayout.tsx
function AuthLayout() {
  useScrollToTop();
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "auth-layout", children: [
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(import_react_router_dom8.Link, { to: "/", className: "auth-layout__brand", "aria-label": "Lotus Hub \u2014 Home", children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(LotusLogo, { withWordmark: true }) }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("main", { className: "auth-layout__main", children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(import_react_router_dom8.Outlet, {}) }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("footer", { className: "auth-layout__foot", children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(import_react_router_dom8.Link, { to: "/terms", children: "Terms" }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { "aria-hidden": "true", children: "\xB7" }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(import_react_router_dom8.Link, { to: "/privacy", children: "Privacy" }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { "aria-hidden": "true", children: "\xB7" }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(import_react_router_dom8.Link, { to: "/contact", children: "Contact" })
    ] })
  ] });
}
var import_react_router_dom8, import_jsx_runtime9;
var init_AuthLayout = __esm({
  "src/layouts/AuthLayout.tsx"() {
    import_react_router_dom8 = require("react-router-dom");
    init_LotusLogo();
    init_useScrollToTop();
    import_jsx_runtime9 = require("react/jsx-runtime");
  }
});

// src/components/ui/Loading.tsx
function Loading({
  label = "Loading",
  className
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(
    "div",
    {
      className: cn("loading", className),
      role: "status",
      "aria-live": "polite",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { className: "loading__spinner", "aria-hidden": "true" }),
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { className: "loading__label", children: label })
      ]
    }
  );
}
function Skeleton({ className }) {
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: cn("skeleton", className), "aria-hidden": "true" });
}
var import_jsx_runtime10;
var init_Loading = __esm({
  "src/components/ui/Loading.tsx"() {
    init_cn();
    import_jsx_runtime10 = require("react/jsx-runtime");
  }
});

// src/layouts/AdminLayout.tsx
function AdminLayout() {
  useScrollToTop();
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "admin-shell", children: [
    /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("aside", { className: "admin-sidebar", children: [
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(import_react_router_dom9.Link, { to: "/", className: "admin-sidebar__brand", "aria-label": "Lotus Hub", children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(LotusLogo, {}) }),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("nav", { className: "admin-nav", "aria-label": "Admin", children: [
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { className: "admin-nav__heading", children: "Dashboard" }),
        ADMIN_NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
          import_react_router_dom9.NavLink,
          {
            to: item.to,
            end: item.to === "/Admin/admin",
            className: ({ isActive }) => cn("admin-nav__link", isActive && "is-active"),
            children: item.label
          },
          item.to
        ))
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { className: "admin-sidebar__foot", children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(import_react_router_dom9.Link, { to: "/", className: "admin-sidebar__back", children: "\u2190 Back to site" }) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "admin-main", children: [
      /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("header", { className: "admin-topbar", children: [
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { className: "admin-topbar__title", children: "Super Admin Console" }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { className: "badge badge-accent", children: "Super Admin" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("main", { className: "admin-content", children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(import_react4.Suspense, { fallback: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Loading, { label: "Loading module\u2026" }), children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(import_react_router_dom9.Outlet, {}) }) })
    ] })
  ] });
}
var import_react4, import_react_router_dom9, import_jsx_runtime11, ADMIN_NAV;
var init_AdminLayout = __esm({
  "src/layouts/AdminLayout.tsx"() {
    import_react4 = require("react");
    import_react_router_dom9 = require("react-router-dom");
    init_LotusLogo();
    init_Loading();
    init_useScrollToTop();
    init_cn();
    import_jsx_runtime11 = require("react/jsx-runtime");
    ADMIN_NAV = [
      { label: "Dashboard", to: "/Admin/admin" },
      { label: "Files", to: "/Admin/admin/files" },
      { label: "Categories", to: "/Admin/admin/categories" },
      { label: "Users", to: "/Admin/admin/users" },
      { label: "Token Top-ups", to: "/Admin/admin/topups" },
      { label: "Audit Logs", to: "/Admin/admin/audit" }
    ];
  }
});

// src/components/auth/RequireAuth.tsx
function FullScreenLoading() {
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "auth-gate", children: [
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(LotusMark, { className: "auth-gate__mark" }),
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Loading, { label: "Checking session\u2026" })
  ] });
}
function LoginRequired() {
  const location = (0, import_react_router_dom10.useLocation)();
  const from = location.pathname + location.search;
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: "gate-page", children: /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "gate-card", children: [
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("span", { className: "gate-card__icon", "aria-hidden": "true", children: "\u{1F512}" }),
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("h1", { className: "gate-card__title", children: "Sign In Required" }),
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("p", { className: "gate-card__message", children: "You need to be logged in to access this page." }),
    /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "gate-card__actions", children: [
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(import_react_router_dom10.Link, { to: "/login", state: { from }, className: "btn btn-primary btn-lg", children: "Login" }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(import_react_router_dom10.Link, { to: "/register", state: { from }, className: "btn btn-secondary btn-lg", children: "Register" })
    ] })
  ] }) });
}
function SessionExpiredGate() {
  const location = (0, import_react_router_dom10.useLocation)();
  const from = location.pathname + location.search;
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: "gate-page", children: /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "gate-card", children: [
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("span", { className: "gate-card__icon", "aria-hidden": "true", children: "\u23F3" }),
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("h1", { className: "gate-card__title", children: "Session Expired" }),
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("p", { className: "gate-card__message", children: "Your session has expired. Please log in again to continue." }),
    /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "gate-card__actions", children: [
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(import_react_router_dom10.Link, { to: "/login", state: { from }, className: "btn btn-primary btn-lg", children: "Login" }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(import_react_router_dom10.Link, { to: "/", className: "btn btn-secondary btn-lg", children: "Home" })
    ] })
  ] }) });
}
function RequireAuth() {
  const { status, sessionExpired } = useAuth();
  if (status === "loading") return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(FullScreenLoading, {});
  if (status === "authenticated") return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(import_react_router_dom10.Outlet, {});
  if (sessionExpired) return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(SessionExpiredGate, {});
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(LoginRequired, {});
}
var import_react_router_dom10, import_jsx_runtime12;
var init_RequireAuth = __esm({
  "src/components/auth/RequireAuth.tsx"() {
    import_react_router_dom10 = require("react-router-dom");
    init_AuthContext();
    init_LotusLogo();
    init_Loading();
    import_jsx_runtime12 = require("react/jsx-runtime");
  }
});

// src/components/layout/PageContainer.tsx
function PageContainer({
  children,
  className,
  as: Tag = "div",
  padded = true
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Tag, { className: cn("container", padded && "section", className), children });
}
var import_jsx_runtime13;
var init_PageContainer = __esm({
  "src/components/layout/PageContainer.tsx"() {
    init_cn();
    import_jsx_runtime13 = require("react/jsx-runtime");
  }
});

// src/config/seo.ts
function getSiteOrigin() {
  if (SITE_URL) return SITE_URL;
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }
  return "";
}
var import_meta3, metaEnv2, SITE_URL, SITE_NAME2, SITE_TAGLINE, SITE_DESCRIPTION, SITE_OG_IMAGE;
var init_seo = __esm({
  "src/config/seo.ts"() {
    init_env();
    import_meta3 = {};
    metaEnv2 = import_meta3?.env ?? {};
    SITE_URL = (metaEnv2.VITE_SITE_URL || "").replace(/\/+$/, "");
    SITE_NAME2 = APP_NAME;
    SITE_TAGLINE = metaEnv2.VITE_SITE_TAGLINE || "A premium media content discovery platform.";
    SITE_DESCRIPTION = metaEnv2.VITE_SITE_DESCRIPTION || "Discover films, images, documents and audio \u2014 thoughtfully organized on Lotus Hub.";
    SITE_OG_IMAGE = metaEnv2.VITE_SOCIAL_IMAGE || "/og-image.png";
  }
});

// src/lib/pageHead.ts
function resolve(siteUrl, path) {
  if (/^https?:\/\//i.test(path)) return path;
  return `${siteUrl.replace(/\/+$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}
function setMeta(attr, key, content) {
  const selector = `${attr === "property" ? `meta[property="${key}"]` : `meta[name="${key}"]`}`;
  let el = document.head.querySelector(selector);
  if (content === void 0 || content === "") {
    if (el) el.remove();
    return;
  }
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    el.setAttribute(OWNED, "true");
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}
function renderHead(state, site) {
  document.head.querySelectorAll(`[${OWNED}]`).forEach((el) => el.remove());
  document.title = state.title ? `${state.title} | ${site.name}` : site.name;
  setMeta("name", "description", state.description);
  const indexable = state.index === true;
  setMeta("name", "robots", indexable ? void 0 : "noindex, nofollow");
  const url = site.url;
  if (indexable) {
    const canonical = state.canonicalPath ? resolve(url, state.canonicalPath) : void 0;
    if (canonical) {
      let link = document.head.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        link.setAttribute(OWNED, "true");
        document.head.appendChild(link);
      }
      link.setAttribute("href", canonical);
    }
    const canonicalEl = document.head.querySelector('link[rel="canonical"]');
    if (!state.canonicalPath && canonicalEl) canonicalEl.remove();
    const ogImage = state.ogImage ? resolve(url, state.ogImage) : void 0;
    const ogType = state.ogType ?? "website";
    const pageUrl = state.canonicalPath ? resolve(url, state.canonicalPath) : url;
    setMeta("property", "og:title", state.title || site.name);
    setMeta("property", "og:description", state.description);
    setMeta("property", "og:type", ogType);
    setMeta("property", "og:url", pageUrl);
    setMeta("property", "og:site_name", site.name);
    setMeta("property", "og:image", ogImage);
    setMeta("name", "twitter:card", ogImage ? "summary_large_image" : "summary");
    setMeta("name", "twitter:title", state.title || site.name);
    setMeta("name", "twitter:description", state.description);
    setMeta("name", "twitter:image", ogImage);
  }
  if (state.jsonLd) {
    const arr = Array.isArray(state.jsonLd) ? state.jsonLd : [state.jsonLd];
    const script = document.createElement("script");
    script.setAttribute("type", "application/ld+json");
    script.setAttribute(OWNED, "true");
    script.textContent = JSON.stringify(arr.length === 1 ? arr[0] : arr);
    document.head.appendChild(script);
  }
}
var OWNED;
var init_pageHead = __esm({
  "src/lib/pageHead.ts"() {
    OWNED = "data-lh-head";
  }
});

// src/hooks/usePageMeta.ts
function isIndexable(pathname) {
  return INDEXABLE_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}
function siteJsonLd(url) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE_NAME2,
      url
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: SITE_NAME2,
      url
    }
  ];
}
function usePageMeta(title, description, ogType, jsonLd) {
  const location = (0, import_react_router_dom11.useLocation)();
  (0, import_react5.useEffect)(() => {
    const origin = getSiteOrigin();
    const url = origin || "";
    const indexable = isIndexable(location.pathname);
    const extraJsonLd = indexable && jsonLd ? jsonLd : [];
    renderHead(
      {
        title,
        description: description || SITE_DESCRIPTION,
        index: indexable,
        canonicalPath: indexable ? location.pathname : void 0,
        ogImage: indexable ? SITE_OG_IMAGE : void 0,
        ogType: indexable ? ogType : void 0,
        jsonLd: indexable && url ? [...siteJsonLd(url), ...extraJsonLd] : void 0
      },
      { url: url || SITE_NAME2, name: SITE_NAME2 }
    );
  }, [title, description, ogType, location.pathname]);
}
var import_react5, import_react_router_dom11, INDEXABLE_PREFIXES;
var init_usePageMeta = __esm({
  "src/hooks/usePageMeta.ts"() {
    import_react5 = require("react");
    import_react_router_dom11 = require("react-router-dom");
    init_seo();
    init_pageHead();
    INDEXABLE_PREFIXES = ["/faq", "/contact", "/terms", "/privacy", "/cookies"];
  }
});

// src/pages/errors/Error403.tsx
function Error403() {
  usePageMeta("Access Denied", "You don't have permission to access this page.");
  return /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(PageContainer, { as: "main", className: "error-page", children: /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "error-page__card", children: [
    /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(LotusMark, { className: "error-page__mark" }),
    /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("span", { className: "error-page__code", children: "403" }),
    /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("h1", { className: "error-page__title", children: "Access Denied" }),
    /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("p", { className: "error-page__message", children: "You don\u2019t have permission to access this page. If you believe this is a mistake, please contact support." }),
    /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "error-page__actions", children: [
      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(import_react_router_dom12.Link, { to: "/", className: "btn btn-primary btn-lg", children: "Home" }),
      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(import_react_router_dom12.Link, { to: "/contact", className: "btn btn-ghost btn-lg", children: "Contact support" })
    ] })
  ] }) });
}
var import_react_router_dom12, import_jsx_runtime14;
var init_Error403 = __esm({
  "src/pages/errors/Error403.tsx"() {
    import_react_router_dom12 = require("react-router-dom");
    init_PageContainer();
    init_LotusLogo();
    init_usePageMeta();
    import_jsx_runtime14 = require("react/jsx-runtime");
  }
});

// src/components/auth/AdminRoute.tsx
function AdminRoute() {
  const { status, user, sessionExpired } = useAuth();
  if (status === "loading") {
    return /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("div", { className: "auth-gate", children: [
      /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(LotusMark, { className: "auth-gate__mark" }),
      /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(Loading, { label: "Checking access\u2026" })
    ] });
  }
  if (status === "anonymous") {
    return sessionExpired ? /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(SessionExpiredGate, {}) : /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(LoginRequired, {});
  }
  const isSuperAdmin = user?.role === "superadmin";
  if (!isSuperAdmin) {
    return /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(Error403, {});
  }
  return /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(import_react_router_dom13.Outlet, {});
}
var import_react_router_dom13, import_jsx_runtime15;
var init_AdminRoute = __esm({
  "src/components/auth/AdminRoute.tsx"() {
    import_react_router_dom13 = require("react-router-dom");
    init_AuthContext();
    init_RequireAuth();
    init_Error403();
    init_Loading();
    init_LotusLogo();
    import_jsx_runtime15 = require("react/jsx-runtime");
  }
});

// src/config/content.ts
var CONTENT_TYPES, TYPE_LABEL, TYPE_TITLE, SORT_OPTIONS;
var init_content = __esm({
  "src/config/content.ts"() {
    CONTENT_TYPES = ["video", "image", "document", "audio"];
    TYPE_LABEL = {
      video: "Video",
      image: "Image",
      document: "Document",
      audio: "Audio"
    };
    TYPE_TITLE = {
      video: "Videos",
      image: "Images",
      document: "Documents",
      audio: "Audio"
    };
    SORT_OPTIONS = [
      { value: "newest", label: "Newest" },
      { value: "oldest", label: "Oldest" },
      { value: "name_asc", label: "Name A\u2013Z" },
      { value: "name_desc", label: "Name Z\u2013A" },
      { value: "size_asc", label: "File size: Low \u2192 High" },
      { value: "size_desc", label: "File size: High \u2192 Low" }
    ];
  }
});

// src/components/media/Hero.tsx
function Hero({ item, className }) {
  const hasImage = Boolean(item.thumbnailUrl);
  return /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("section", { className: cn("hero", className), "aria-label": "Featured content", children: [
    hasImage ? /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
      "img",
      {
        className: "hero__img",
        src: item.thumbnailUrl ?? "",
        alt: "",
        "aria-hidden": "true",
        draggable: false
      }
    ) : /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
      "div",
      {
        className: "hero__backdrop",
        "aria-hidden": "true",
        style: {
          background: `radial-gradient(120% 120% at 25% 15%, hsl(${item.hue} 30% 24%) 0%, hsl(${(item.hue + 30) % 360} 34% 12%) 60%, var(--bg) 100%)`
        }
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("div", { className: "container hero__inner", children: /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("div", { className: "hero__content", children: [
      /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("span", { className: "badge badge-accent", children: "Featured" }),
      /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("h1", { className: "hero__title", children: item.title }),
      /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("p", { className: "hero__desc", children: item.description }),
      /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("div", { className: "hero__meta", children: [
        /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("span", { children: TYPE_LABEL[item.type] }),
        /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("span", { "aria-hidden": "true", children: "\xB7" }),
        /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("span", { children: item.category }),
        item.duration && /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(import_jsx_runtime16.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("span", { "aria-hidden": "true", children: "\xB7" }),
          /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("span", { children: item.duration })
        ] }),
        item.rating && /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(import_jsx_runtime16.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("span", { "aria-hidden": "true", children: "\xB7" }),
          /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("span", { children: item.rating })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("div", { className: "hero__actions", children: [
        /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(import_react_router_dom14.Link, { to: `/file/${item.id}`, className: "btn btn-primary btn-lg", children: "View details" }),
        /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(import_react_router_dom14.Link, { to: "/browse", className: "btn btn-secondary btn-lg", children: "Browse all" })
      ] })
    ] }) })
  ] });
}
var import_react_router_dom14, import_jsx_runtime16;
var init_Hero = __esm({
  "src/components/media/Hero.tsx"() {
    import_react_router_dom14 = require("react-router-dom");
    init_content();
    init_cn();
    import_jsx_runtime16 = require("react/jsx-runtime");
  }
});

// src/utils/format.ts
function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes < 0) return "\u2014";
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );
  const value = bytes / 1024 ** i;
  const rounded = value >= 10 || i === 0 ? Math.round(value) : value.toFixed(1);
  return `${rounded} ${units[i]}`;
}
function formatDate(ts) {
  return new Date(ts).toLocaleDateString(void 0, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}
function formatDateTime(ts) {
  return new Date(ts).toLocaleString(void 0, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
function timeAgo(ts) {
  const seconds = Math.floor((Date.now() - ts) / 1e3);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(ts);
}
function timeUntil(ts, now = Date.now()) {
  const ms = ts - now;
  if (!Number.isFinite(ms)) return "";
  const minutes = Math.floor(ms / 6e4);
  if (minutes <= 0) return "expired";
  if (minutes < 60) return `in ${minutes} minute${minutes === 1 ? "" : "s"}`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `in ${hours} hour${hours === 1 ? "" : "s"}`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} remaining`;
  return formatDate(ts);
}
var init_format = __esm({
  "src/utils/format.ts"() {
  }
});

// src/utils/uiRestrictions.ts
function blockContextMenu(e) {
  e.preventDefault();
}
function blockImageDrag(e) {
  e.preventDefault();
}
function installUIRestrictions() {
  document.addEventListener("contextmenu", blockContextMenu);
  document.addEventListener("dragstart", blockImageDrag);
  return () => {
    document.removeEventListener("contextmenu", blockContextMenu);
    document.removeEventListener("dragstart", blockImageDrag);
  };
}
var noDrag;
var init_uiRestrictions = __esm({
  "src/utils/uiRestrictions.ts"() {
    noDrag = { draggable: false };
  }
});

// src/components/media/MediaThumbnail.tsx
function MediaThumbnail({
  hue,
  type,
  title,
  rating,
  thumbnailUrl,
  className,
  tall
}) {
  const hasImage = Boolean(thumbnailUrl);
  const style = hasImage ? {} : {
    background: `radial-gradient(120% 120% at 20% 12%, hsl(${hue} 32% 26%) 0%, hsl(${(hue + 24) % 360} 34% 16%) 58%, hsl(${(hue + 48) % 360} 40% 9%) 100%)`
  };
  return /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(
    "div",
    {
      className: cn("media-thumb", tall && "media-thumb--tall", className),
      style,
      role: "img",
      "aria-label": `${title} \u2014 ${TYPE_LABEL[type]}`,
      children: [
        hasImage ? /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("img", { src: thumbnailUrl ?? "", alt: "", loading: "lazy", className: "media-thumb__img", ...noDrag }) : /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("span", { className: "media-thumb__glyph", "aria-hidden": "true", children: TYPE_GLYPH[type] }),
        rating && /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("span", { className: "media-thumb__rating", children: rating })
      ]
    }
  );
}
var import_jsx_runtime17, TYPE_GLYPH;
var init_MediaThumbnail = __esm({
  "src/components/media/MediaThumbnail.tsx"() {
    init_content();
    init_cn();
    init_uiRestrictions();
    import_jsx_runtime17 = require("react/jsx-runtime");
    TYPE_GLYPH = {
      video: "\u25B6",
      image: "\u25EB",
      document: "\u25A4",
      audio: "\u266A"
    };
  }
});

// src/components/media/MediaCard.tsx
function MediaCard({ item, className }) {
  return /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(
    import_react_router_dom15.Link,
    {
      to: `/file/${item.id}`,
      className: cn("media-card", className),
      "aria-label": `${item.title} \u2014 ${TYPE_LABEL[item.type]}`,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
          MediaThumbnail,
          {
            hue: item.hue,
            type: item.type,
            title: item.title,
            rating: item.rating,
            thumbnailUrl: item.thumbnailUrl,
            className: "media-card__thumb"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { className: "media-card__meta", children: [
          /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("span", { className: "media-card__title", title: item.title, children: item.title }),
          /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("span", { className: "media-card__type", children: TYPE_LABEL[item.type] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { className: "media-card__sub", children: [
          /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("span", { children: formatBytes(item.fileSize) }),
          /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("span", { "aria-hidden": "true", children: "\xB7" }),
          /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("span", { children: timeAgo(item.createdAt) })
        ] })
      ]
    }
  );
}
var import_react_router_dom15, import_jsx_runtime18;
var init_MediaCard = __esm({
  "src/components/media/MediaCard.tsx"() {
    import_react_router_dom15 = require("react-router-dom");
    init_content();
    init_cn();
    init_format();
    init_MediaThumbnail();
    import_jsx_runtime18 = require("react/jsx-runtime");
  }
});

// src/components/media/MediaRow.tsx
function MediaRow({ items, className, empty }) {
  const scrollerRef = (0, import_react6.useRef)(null);
  const scrollBy = (dir) => {
    scrollerRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };
  if (items.length === 0) {
    return /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("div", { className, children: empty ?? null });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("div", { className: cn("media-row", className), children: [
    /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
      "button",
      {
        type: "button",
        className: "media-row__arrow media-row__arrow--left",
        onClick: () => scrollBy(-1),
        "aria-label": "Scroll row left",
        children: "\u2039"
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("div", { ref: scrollerRef, className: "media-row__scroller", tabIndex: 0, children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(MediaCard, { item, className: "media-row__card" }, item.id)) }),
    /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
      "button",
      {
        type: "button",
        className: "media-row__arrow media-row__arrow--right",
        onClick: () => scrollBy(1),
        "aria-label": "Scroll row right",
        children: "\u203A"
      }
    )
  ] });
}
var import_react6, import_jsx_runtime19;
var init_MediaRow = __esm({
  "src/components/media/MediaRow.tsx"() {
    import_react6 = require("react");
    init_cn();
    init_MediaCard();
    import_jsx_runtime19 = require("react/jsx-runtime");
  }
});

// src/components/media/MediaStates.tsx
function MediaRowSkeleton({ count = 6 }) {
  return /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("div", { className: "media-row", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("div", { className: "media-row__scroller", children: Array.from({ length: count }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("div", { className: "media-row__card", children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(Skeleton, { className: "sk-card" }) }, i)) }) });
}
function MediaGridSkeleton({ count = 8 }) {
  return /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("div", { className: "media-grid", "aria-hidden": "true", children: Array.from({ length: count }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(Skeleton, { className: "sk-card" }, i)) });
}
var import_jsx_runtime20;
var init_MediaStates = __esm({
  "src/components/media/MediaStates.tsx"() {
    init_Loading();
    import_jsx_runtime20 = require("react/jsx-runtime");
  }
});

// src/components/ui/ErrorState.tsx
function ErrorState({ title, message, action }) {
  return /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("div", { className: "error-state", role: "alert", children: [
    /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("div", { className: "error-state__icon", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("span", { children: "!" }) }),
    /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("h3", { className: "error-state__title", children: title }),
    message && /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("p", { className: "error-state__message", children: message }),
    action && /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("div", { className: "error-state__action", children: action })
  ] });
}
var import_jsx_runtime21;
var init_ErrorState = __esm({
  "src/components/ui/ErrorState.tsx"() {
    import_jsx_runtime21 = require("react/jsx-runtime");
  }
});

// src/components/ui/EmptyState.tsx
function EmptyState({ title, message, action, icon }) {
  return /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)("div", { className: "empty-state", children: [
    icon && /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("div", { className: "empty-state__icon", "aria-hidden": "true", children: icon }),
    /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("h3", { className: "empty-state__title", children: title }),
    message && /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("p", { className: "empty-state__message", children: message }),
    action && /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("div", { className: "empty-state__action", children: action })
  ] });
}
var import_jsx_runtime22;
var init_EmptyState = __esm({
  "src/components/ui/EmptyState.tsx"() {
    import_jsx_runtime22 = require("react/jsx-runtime");
  }
});

// src/services/content.ts
async function request2(method, path, body) {
  let res;
  try {
    res = await fetch(`${BASE2}${path}`, {
      method,
      credentials: "same-origin",
      headers: body !== void 0 ? { "Content-Type": "application/json" } : void 0,
      body: body !== void 0 ? JSON.stringify(body) : void 0
    });
  } catch {
    throw new ContentApiError(
      "Cannot reach the service right now. Please check your connection and try again.",
      0
    );
  }
  if (!res.ok) {
    let payload = null;
    try {
      payload = await res.json();
    } catch {
    }
    const message = payload?.message || (res.status === 401 ? "Your session has ended. Please sign in again." : res.status === 404 ? "This content is not available." : "Something went wrong. Please try again.");
    throw new ContentApiError(message, res.status, payload?.error);
  }
  return await res.json();
}
function getJson(path) {
  return request2("GET", path);
}
function buildQuery(params) {
  const search = new URLSearchParams();
  if (params.q) search.set("q", params.q);
  if (params.types?.length) search.set("types", params.types.join(","));
  if (params.categories?.length) search.set("categories", params.categories.join(","));
  if (params.size) search.set("size", params.size);
  if (params.sort) search.set("sort", params.sort);
  if (params.featured !== void 0) search.set("featured", String(params.featured));
  if (params.limit !== void 0) search.set("limit", String(params.limit));
  if (params.offset !== void 0) search.set("offset", String(params.offset));
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}
function fetchHome() {
  return getJson("/api/home");
}
function fetchContentMeta() {
  return getJson("/api/content/meta");
}
function fetchContentList(params = {}) {
  return getJson(`/api/content${buildQuery(params)}`);
}
function fetchContent(id) {
  return getJson(`/api/content/${encodeURIComponent(id)}`);
}
function fetchRelatedContent(id) {
  return getJson(`/api/content/${encodeURIComponent(id)}/related`);
}
function fetchFileAccess(id) {
  return getJson(`/api/content/${encodeURIComponent(id)}/access`);
}
function fetchArchivePassword(id) {
  return getJson(`/api/content/${encodeURIComponent(id)}/access/password`);
}
function authorizeDownload(id) {
  return request2("POST", `/api/content/${encodeURIComponent(id)}/download`);
}
var BASE2, ContentApiError;
var init_content2 = __esm({
  "src/services/content.ts"() {
    init_env();
    BASE2 = API_BASE_URL;
    ContentApiError = class extends Error {
      status;
      /** Server-provided machine-readable error code (e.g. 'insufficient_access'). */
      code;
      constructor(message, status, code) {
        super(message);
        this.name = "ContentApiError";
        this.status = status;
        this.code = code;
      }
    };
  }
});

// src/hooks/useAsyncData.ts
function useAsyncData(loader, deps = []) {
  const [state, setState] = (0, import_react7.useState)(idle);
  const loaderRef = (0, import_react7.useRef)(loader);
  loaderRef.current = loader;
  const mountedRef = (0, import_react7.useRef)(true);
  const seqRef = (0, import_react7.useRef)(0);
  const run = (0, import_react7.useCallback)(async () => {
    const seq = ++seqRef.current;
    setState((s) => ({ ...s, status: "loading" }));
    try {
      const data = await loaderRef.current();
      if (mountedRef.current && seq === seqRef.current) {
        setState({ status: "success", data, error: null, isUnauthenticated: false });
      }
    } catch (err) {
      if (mountedRef.current && seq === seqRef.current) {
        const message = err instanceof ContentApiError ? err.message : "Something went wrong loading content.";
        const status = err instanceof ContentApiError ? err.status : 0;
        setState({
          status: "error",
          data: null,
          error: message,
          isUnauthenticated: status === 401
        });
      }
    }
  }, []);
  (0, import_react7.useEffect)(() => {
    mountedRef.current = true;
    run();
    return () => {
      mountedRef.current = false;
      seqRef.current += 1;
    };
  }, deps);
  const retry = (0, import_react7.useCallback)(() => run(), [run]);
  return { ...state, retry };
}
var import_react7, idle;
var init_useAsyncData = __esm({
  "src/hooks/useAsyncData.ts"() {
    import_react7 = require("react");
    init_content2();
    idle = { status: "loading", data: null, error: null, isUnauthenticated: false };
  }
});

// src/pages/public/Home.tsx
function Home() {
  usePageMeta("Home", "Discover films, images, documents and audio curated on Lotus Hub.");
  const { status, data, error, retry, isUnauthenticated } = useAsyncData(fetchHome, []);
  if (status === "loading") {
    return /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)(import_jsx_runtime23.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("div", { className: "hero hero--skeleton", "aria-hidden": "true" }),
      /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)(PageContainer, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("div", { className: "home-section", children: /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(MediaRowSkeleton, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("div", { className: "home-section", children: /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(MediaRowSkeleton, {}) })
      ] })
    ] });
  }
  if (status === "error") {
    return /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(PageContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("div", { className: "home-status", children: /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(
      ErrorState,
      {
        title: "Couldn\u2019t load content",
        message: isUnauthenticated ? "Your session has ended. Please sign in again to continue." : error ?? "Something went wrong loading the library.",
        action: isUnauthenticated ? /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(import_react_router_dom16.Link, { to: "/login", className: "btn btn-primary", children: "Sign in" }) : /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("button", { type: "button", className: "btn btn-secondary", onClick: retry, children: "Retry" })
      }
    ) }) });
  }
  const hero = data?.hero ?? null;
  const sections = data?.sections ?? [];
  const totalItems = sections.reduce((n, s) => n + s.items.length, 0);
  if (!hero && totalItems === 0) {
    return /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(PageContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("div", { className: "home-status", children: /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(
      EmptyState,
      {
        title: "No content yet",
        message: "The library is still being curated. Check back soon.",
        action: /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(import_react_router_dom16.Link, { to: "/browse", className: "btn btn-primary", children: "Browse" })
      }
    ) }) });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)(import_jsx_runtime23.Fragment, { children: [
    hero ? /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(Hero, { item: hero }) : /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("div", { className: "hero hero--welcome", children: /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("div", { className: "container hero__inner", children: /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)("div", { className: "hero__content", children: [
      /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("h1", { className: "hero__title", children: "Welcome to Lotus Hub" }),
      /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("p", { className: "hero__desc", children: "Discover films, images, documents and audio \u2014 curated and beautifully presented." }),
      /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("div", { className: "hero__actions", children: /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(import_react_router_dom16.Link, { to: "/browse", className: "btn btn-primary btn-lg", children: "Browse the library" }) })
    ] }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)(PageContainer, { children: [
      sections.map((section) => /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)("section", { className: "home-section", children: [
        /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)("div", { className: "section-head", children: [
          /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("h2", { className: "section-title", children: section.title }),
          /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(import_react_router_dom16.Link, { to: "/browse", className: "section-link", children: "View all" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(MediaRow, { items: section.items })
      ] }, section.id)),
      /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("div", { className: "home-status home-status--subtle", children: /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(import_react_router_dom16.Link, { to: "/browse", className: "btn btn-secondary btn-lg", children: "Browse the full library" }) })
    ] })
  ] });
}
var import_react_router_dom16, import_jsx_runtime23;
var init_Home = __esm({
  "src/pages/public/Home.tsx"() {
    import_react_router_dom16 = require("react-router-dom");
    init_PageContainer();
    init_Hero();
    init_MediaRow();
    init_MediaStates();
    init_ErrorState();
    init_EmptyState();
    init_useAsyncData();
    init_usePageMeta();
    init_content2();
    import_jsx_runtime23 = require("react/jsx-runtime");
  }
});

// src/components/media/MediaGrid.tsx
function MediaGrid({ items, className, empty }) {
  if (items.length === 0) {
    return /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("div", { className, children: empty ?? null });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("div", { className: cn("media-grid", className), children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(MediaCard, { item }, item.id)) });
}
var import_jsx_runtime24;
var init_MediaGrid = __esm({
  "src/components/media/MediaGrid.tsx"() {
    init_cn();
    init_MediaCard();
    import_jsx_runtime24 = require("react/jsx-runtime");
  }
});

// src/components/media/ContentFilters.tsx
function toggle(list, value) {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}
function ContentFilters({
  meta,
  types,
  setTypes,
  categories,
  setCategories,
  size,
  setSize,
  sort,
  setSort
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)("div", { className: "content-filters", children: [
    /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)("fieldset", { className: "content-filter", children: [
      /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("legend", { children: "Type" }),
      /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)("div", { className: "filter-chips", children: [
        /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(
          "button",
          {
            type: "button",
            className: cn("chip", types.length === 0 && "is-active"),
            "aria-pressed": types.length === 0,
            onClick: () => setTypes([]),
            children: "All types"
          }
        ),
        CONTENT_TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(
          "button",
          {
            type: "button",
            className: cn("chip", types.includes(t) && "is-active"),
            "aria-pressed": types.includes(t),
            onClick: () => setTypes(toggle(types, t)),
            children: TYPE_LABEL[t]
          },
          t
        ))
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)("fieldset", { className: "content-filter", children: [
      /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("legend", { children: "Category" }),
      /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)("div", { className: "filter-chips", children: [
        /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(
          "button",
          {
            type: "button",
            className: cn("chip", categories.length === 0 && "is-active"),
            "aria-pressed": categories.length === 0,
            onClick: () => setCategories([]),
            children: "All categories"
          }
        ),
        meta.categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(
          "button",
          {
            type: "button",
            className: cn("chip", categories.includes(c.name) && "is-active"),
            "aria-pressed": categories.includes(c.name),
            onClick: () => setCategories(toggle(categories, c.name)),
            children: c.name
          },
          c.name
        ))
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)("div", { className: "content-filter content-filter--row", children: [
      /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("span", { className: "content-filter__label", children: "File size" }),
      /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)("div", { className: "filter-selects", children: [
        /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)(
          "select",
          {
            className: "select",
            value: size,
            onChange: (e) => setSize(e.target.value),
            "aria-label": "File size filter",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("option", { value: "", children: "All sizes" }),
              meta.sizeRanges.map((r) => /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("option", { value: r.key, children: r.label }, r.key))
            ]
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("label", { className: "content-filter__label", htmlFor: "content-sort", children: "Sort by" }),
        /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(
          "select",
          {
            id: "content-sort",
            className: "select",
            value: sort,
            onChange: (e) => setSort(e.target.value),
            children: SORT_OPTIONS.map((o) => /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("option", { value: o.value, children: o.label }, o.value))
          }
        )
      ] })
    ] })
  ] });
}
var import_jsx_runtime25;
var init_ContentFilters = __esm({
  "src/components/media/ContentFilters.tsx"() {
    init_content();
    init_cn();
    import_jsx_runtime25 = require("react/jsx-runtime");
  }
});

// src/components/ui/Modal.tsx
function Modal({ open, onClose, title, children, size = "md" }) {
  const dialogRef = (0, import_react8.useRef)(null);
  (0, import_react8.useEffect)(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);
  if (!open) return null;
  return (0, import_react_dom.createPortal)(
    /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("div", { className: "modal-overlay", onMouseDown: onClose, children: /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)(
      "div",
      {
        ref: dialogRef,
        className: cn("modal", `modal--${size}`),
        role: "dialog",
        "aria-modal": "true",
        "aria-label": title,
        tabIndex: -1,
        onMouseDown: (e) => e.stopPropagation(),
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)("div", { className: "modal__head", children: [
            title && /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("h2", { className: "modal__title", children: title }),
            /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(
              "button",
              {
                type: "button",
                className: "modal__close",
                onClick: onClose,
                "aria-label": "Close dialog",
                children: "\xD7"
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("div", { className: "modal__body", children })
        ]
      }
    ) }),
    document.body
  );
}
var import_react8, import_react_dom, import_jsx_runtime26;
var init_Modal = __esm({
  "src/components/ui/Modal.tsx"() {
    import_react8 = require("react");
    import_react_dom = require("react-dom");
    init_cn();
    import_jsx_runtime26 = require("react/jsx-runtime");
  }
});

// src/components/ui/Button.tsx
function Button({
  variant = "primary",
  size = "md",
  block = false,
  className,
  children,
  type = "button",
  ...rest
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(
    "button",
    {
      type,
      className: cn("btn", VARIANTS[variant], SIZES[size], block && "btn-block", className),
      ...rest,
      children
    }
  );
}
var import_jsx_runtime27, VARIANTS, SIZES;
var init_Button = __esm({
  "src/components/ui/Button.tsx"() {
    init_cn();
    import_jsx_runtime27 = require("react/jsx-runtime");
    VARIANTS = {
      primary: "btn-primary",
      secondary: "btn-secondary",
      ghost: "btn-ghost",
      danger: "btn-danger"
    };
    SIZES = {
      sm: "btn-sm",
      md: "",
      lg: "btn-lg"
    };
  }
});

// src/components/ui/Breadcrumbs.tsx
function Breadcrumbs({ items }) {
  return /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("nav", { "aria-label": "Breadcrumb", className: "breadcrumb", children: /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("ol", { className: "breadcrumb__list", children: items.map((crumb, i) => {
    const last = i === items.length - 1;
    return /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)(import_react9.Fragment, { children: [
      i > 0 && /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("li", { className: "breadcrumb__sep", "aria-hidden": "true", children: "/" }),
      /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("li", { className: "breadcrumb__item", children: crumb.to && !last ? /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(import_react_router_dom17.Link, { to: crumb.to, children: crumb.label }) : /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("span", { "aria-current": last ? "page" : void 0, children: crumb.label }) })
    ] }, `${crumb.label}-${i}`);
  }) }) });
}
var import_react9, import_react_router_dom17, import_jsx_runtime28;
var init_Breadcrumbs = __esm({
  "src/components/ui/Breadcrumbs.tsx"() {
    import_react9 = require("react");
    import_react_router_dom17 = require("react-router-dom");
    import_jsx_runtime28 = require("react/jsx-runtime");
  }
});

// src/hooks/useMediaQuery.ts
function useMediaQuery(query) {
  const [matches, setMatches] = (0, import_react10.useState)(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });
  (0, import_react10.useEffect)(() => {
    const mql = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);
    setMatches(mql.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);
  return matches;
}
var import_react10;
var init_useMediaQuery = __esm({
  "src/hooks/useMediaQuery.ts"() {
    import_react10 = require("react");
  }
});

// src/hooks/useDebouncedValue.ts
function useDebouncedValue(value, delay = 300) {
  const [debounced, setDebounced] = (0, import_react11.useState)(value);
  (0, import_react11.useEffect)(() => {
    const t = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(t);
  }, [value, delay]);
  return debounced;
}
var import_react11;
var init_useDebouncedValue = __esm({
  "src/hooks/useDebouncedValue.ts"() {
    import_react11 = require("react");
  }
});

// src/pages/public/Browse.tsx
function Browse() {
  usePageMeta("Browse", "Search, filter and sort the Lotus Hub library.");
  const isMobile = !useMediaQuery("(min-width: 960px)");
  const [searchParams] = (0, import_react_router_dom18.useSearchParams)();
  const initialType = searchParams.get("type") || "";
  const initialCategory = searchParams.get("category") ?? "";
  const [rawQuery, setRawQuery] = (0, import_react12.useState)("");
  const query = useDebouncedValue(rawQuery.trim(), 300);
  const [types, setTypes] = (0, import_react12.useState)(initialType ? [initialType] : []);
  const [categories, setCategories] = (0, import_react12.useState)(initialCategory ? [initialCategory] : []);
  const [size, setSize] = (0, import_react12.useState)("");
  const [sort, setSort] = (0, import_react12.useState)("newest");
  const [showFilters, setShowFilters] = (0, import_react12.useState)(false);
  const metaState = useAsyncData(fetchContentMeta, []);
  const filtersDeps = [query, types.join("|"), categories.join("|"), size, sort];
  const listState = useAsyncData(
    () => fetchContentList({ q: query || void 0, types, categories, size: size || null, sort }),
    filtersDeps
  );
  const hasActive = rawQuery.trim() !== "" || types.length > 0 || categories.length > 0 || size !== "" || sort !== "newest";
  const clearAll = () => {
    setRawQuery("");
    setTypes([]);
    setCategories([]);
    setSize("");
    setSort("newest");
  };
  const results = listState.data?.items ?? [];
  const total = listState.data?.total ?? 0;
  const controls = (meta, key) => meta ? /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(
    ContentFilters,
    {
      meta,
      types,
      setTypes,
      categories,
      setCategories,
      size,
      setSize,
      sort,
      setSort
    },
    key
  ) : null;
  return /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)(PageContainer, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(Breadcrumbs, { items: [{ label: "Home", to: "/" }, { label: "Browse" }] }),
    /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)("header", { className: "browse-head browse-head--flex", children: [
      /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("h1", { className: "page-title", children: "Browse" }),
        /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("p", { className: "page-subtitle", children: "Search, filter and sort the Lotus Hub library." })
      ] }),
      isMobile && /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)(
        Button,
        {
          variant: "secondary",
          onClick: () => setShowFilters(true),
          "aria-haspopup": "dialog",
          children: [
            "Filters & sort",
            hasActive && /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("span", { className: "badge badge-accent", children: "\u2022" })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)("div", { className: "browse-search", children: [
      /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("span", { className: "browse-search__icon", "aria-hidden": "true", children: "\u2315" }),
      /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(
        "input",
        {
          type: "search",
          className: "input browse-search__input",
          placeholder: "Search titles, tags\u2026",
          value: rawQuery,
          onChange: (e) => setRawQuery(e.target.value),
          "aria-label": "Search titles and tags"
        }
      ),
      query && /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)("span", { className: "browse-search__active", "aria-live": "polite", children: [
        "Showing results for \u201C",
        query,
        "\u201D"
      ] })
    ] }),
    !isMobile && metaState.data && /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("div", { className: "browse-inline-filters", children: controls(metaState.data, "inline") }),
    /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)("div", { className: "browse-results-head", children: [
      listState.status === "success" ? /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)("span", { className: "browse-count", children: [
        total,
        " ",
        total === 1 ? "result" : "results",
        query ? ` for \u201C${query}\u201D` : ""
      ] }) : /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("span", { className: "browse-count faint", children: "Loading results\u2026" }),
      hasActive && /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("button", { type: "button", className: "btn btn-ghost btn-sm", onClick: clearAll, children: "Clear filters" })
    ] }),
    listState.status === "loading" ? /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(MediaGridSkeleton, { count: 10 }) : listState.status === "error" ? /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(
      ErrorState,
      {
        title: "Couldn\u2019t load results",
        message: listState.isUnauthenticated ? "Your session has ended. Please sign in again to continue." : listState.error ?? "Something went wrong.",
        action: /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("button", { type: "button", className: "btn btn-secondary", onClick: listState.retry, children: "Retry" })
      }
    ) : results.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(
      EmptyState,
      {
        title: "No content found",
        message: query ? `Nothing matched \u201C${query}\u201D. Try different keywords.` : "No content matches your filters.",
        action: /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("button", { type: "button", className: "btn btn-secondary", onClick: clearAll, children: "Clear filters" })
      }
    ) : /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(MediaGrid, { items: results, className: "browse-grid" }),
    isMobile && /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)(
      Modal,
      {
        open: showFilters,
        onClose: () => setShowFilters(false),
        title: "Filters & sort",
        size: "lg",
        children: [
          metaState.data ? controls(metaState.data, "mobile") : null,
          /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)("div", { className: "mobile-filter-actions", children: [
            /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(
              Button,
              {
                variant: "ghost",
                onClick: () => {
                  clearAll();
                  setShowFilters(false);
                },
                children: "Clear all"
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(Button, { onClick: () => setShowFilters(false), children: "Show results" })
          ] })
        ]
      }
    )
  ] });
}
var import_react12, import_react_router_dom18, import_jsx_runtime29;
var init_Browse = __esm({
  "src/pages/public/Browse.tsx"() {
    import_react12 = require("react");
    import_react_router_dom18 = require("react-router-dom");
    init_PageContainer();
    init_MediaGrid();
    init_MediaStates();
    init_ContentFilters();
    init_EmptyState();
    init_ErrorState();
    init_Modal();
    init_Button();
    init_Breadcrumbs();
    init_useMediaQuery();
    init_useDebouncedValue();
    init_useAsyncData();
    init_usePageMeta();
    init_content2();
    import_jsx_runtime29 = require("react/jsx-runtime");
  }
});

// src/pages/public/Categories.tsx
function Categories() {
  usePageMeta("Categories", "Browse Lotus Hub content by type and category.");
  const { status, data, error, retry } = useAsyncData(fetchContentMeta, []);
  if (status === "loading") {
    return /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)(PageContainer, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("div", { className: "browse-head", children: /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("div", { className: "page-title", "aria-hidden": "true", children: "Categories" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(MediaGridSkeleton, { count: 4 })
    ] });
  }
  if (status === "error") {
    return /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)(PageContainer, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("div", { className: "browse-head", children: /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("h1", { className: "page-title", children: "Categories" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(
        ErrorState,
        {
          title: "Couldn\u2019t load categories",
          message: error ?? "Something went wrong.",
          action: /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("button", { type: "button", className: "btn btn-secondary", onClick: retry, children: "Retry" })
        }
      )
    ] });
  }
  const meta = data;
  const hasContent = Object.values(meta?.typeCounts ?? {}).some((n) => n > 0);
  if (!meta || !hasContent) {
    return /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)(PageContainer, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("div", { className: "browse-head", children: /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("h1", { className: "page-title", children: "Categories" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(
        EmptyState,
        {
          title: "No categories yet",
          message: "Categories will appear here as the library grows."
        }
      )
    ] });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)(PageContainer, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(Breadcrumbs, { items: [{ label: "Home", to: "/" }, { label: "Categories" }] }),
    /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)("header", { className: "browse-head", children: [
      /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("h1", { className: "page-title", children: "Categories" }),
      /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("p", { className: "page-subtitle", children: "Explore the Lotus Hub library by content type or a specific category." })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("div", { className: "cat-type-grid", children: CONTENT_TYPES.map((type, i) => /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)(
      import_react_router_dom19.Link,
      {
        to: `/browse?type=${type}`,
        className: "cat-type",
        "aria-label": `Browse ${TYPE_TITLE[type].toLowerCase()}`,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(
            MediaThumbnail,
            {
              hue: (type === "video" ? 200 : type === "image" ? 30 : type === "audio" ? 260 : 120) + i * 4,
              type,
              title: TYPE_TITLE[type],
              tall: true
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)("div", { className: "cat-type__overlay", children: [
            /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("span", { className: "cat-type__icon", "aria-hidden": "true", children: TYPE_GLYPH[type] }),
            /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("span", { className: "cat-type__name", children: TYPE_TITLE[type] }),
            /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)("span", { className: "cat-type__count", children: [
              meta.typeCounts[type],
              " ",
              meta.typeCounts[type] === 1 ? "title" : "titles"
            ] })
          ] })
        ]
      },
      type
    )) }),
    meta.categories.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)("section", { className: "home-section", children: [
      /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("div", { className: "section-head", children: /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("h2", { className: "section-title", children: "Browse by category" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("div", { className: "cat-name-grid", children: meta.categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)(
        import_react_router_dom19.Link,
        {
          to: `/browse?category=${encodeURIComponent(c.name)}`,
          className: "cat-name",
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("span", { className: "cat-name__label", children: c.name }),
            /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("span", { className: "cat-name__count", children: c.count })
          ]
        },
        c.name
      )) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("div", { className: "cat-all", children: /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(import_react_router_dom19.Link, { to: "/browse", className: "btn btn-secondary btn-lg", children: "Browse everything" }) })
  ] });
}
var import_react_router_dom19, import_jsx_runtime30;
var init_Categories = __esm({
  "src/pages/public/Categories.tsx"() {
    import_react_router_dom19 = require("react-router-dom");
    init_PageContainer();
    init_MediaThumbnail();
    init_MediaStates();
    init_ErrorState();
    init_EmptyState();
    init_Breadcrumbs();
    init_content();
    init_useAsyncData();
    init_usePageMeta();
    init_content2();
    import_jsx_runtime30 = require("react/jsx-runtime");
  }
});

// src/components/media/ContentMetadata.tsx
function ContentMetadata({ item }) {
  const rows = [
    ["Type", TYPE_LABEL[item.type]],
    ["Category", item.category],
    ["File size", formatBytes(item.fileSize)],
    ["Provider", item.provider || "Lotus Originals"],
    ["Added", formatDate(item.createdAt)]
  ];
  if (item.duration) rows.push(["Duration", item.duration]);
  if (item.rating) rows.push(["Rating", item.rating]);
  return /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("dl", { className: "content-meta", children: rows.map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)("div", { className: "content-meta__row", children: [
    /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("dt", { children: k }),
    /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("dd", { children: v })
  ] }, k)) });
}
var import_jsx_runtime31;
var init_ContentMetadata = __esm({
  "src/components/media/ContentMetadata.tsx"() {
    init_content();
    init_format();
    import_jsx_runtime31 = require("react/jsx-runtime");
  }
});

// src/components/media/DownloadAccess.tsx
function DownloadAccess({ fileId }) {
  const { status: authStatus } = useAuth();
  const [loading, setLoading] = (0, import_react13.useState)(true);
  const [access, setAccess] = (0, import_react13.useState)(null);
  const [authorized, setAuthorized] = (0, import_react13.useState)(false);
  const [password, setPassword] = (0, import_react13.useState)(null);
  const [revealDownload, setRevealDownload] = (0, import_react13.useState)(false);
  const [checking, setChecking] = (0, import_react13.useState)(false);
  const [downloading, setDownloading] = (0, import_react13.useState)(false);
  const [freshResult, setFreshResult] = (0, import_react13.useState)(null);
  const [upgradeOpen, setUpgradeOpen] = (0, import_react13.useState)(false);
  const [error, setError] = (0, import_react13.useState)(null);
  const [copied, setCopied] = (0, import_react13.useState)(false);
  const busyRef = (0, import_react13.useRef)(false);
  const loadAccess = (0, import_react13.useCallback)(async () => {
    setLoading(true);
    setError(null);
    try {
      const status = await fetchFileAccess(fileId);
      setAccess(status);
      if (status.authorized) {
        setAuthorized(true);
        const pw = await fetchArchivePassword(fileId);
        setPassword(pw.archivePassword ?? null);
      } else {
        setAuthorized(false);
        setRevealDownload(false);
      }
    } catch (err) {
      setAuthorized(false);
      setError(
        err instanceof ContentApiError ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [fileId]);
  (0, import_react13.useEffect)(() => {
    setCopied(false);
    setFreshResult(null);
    setPassword(null);
    setRevealDownload(false);
    setDownloading(false);
    setUpgradeOpen(false);
    busyRef.current = false;
    if (authStatus === "authenticated") loadAccess();
  }, [authStatus, fileId, loadAccess]);
  const handleGetLink = (0, import_react13.useCallback)(async () => {
    if (checking || downloading) return;
    setChecking(true);
    setError(null);
    try {
      const status = await fetchFileAccess(fileId);
      if (status.authorized) {
        setAuthorized(true);
        const pw = await fetchArchivePassword(fileId);
        setPassword(pw.archivePassword ?? null);
      } else if (status.hasAvailableAccess) {
        setRevealDownload(true);
      } else {
        setUpgradeOpen(true);
      }
    } catch (err) {
      setError(
        err instanceof ContentApiError ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setChecking(false);
    }
  }, [checking, downloading, fileId]);
  const handleDownload = (0, import_react13.useCallback)(async () => {
    if (busyRef.current) return;
    busyRef.current = true;
    setDownloading(true);
    setError(null);
    try {
      const result = await authorizeDownload(fileId);
      setAuthorized(true);
      setPassword(result.archivePassword ?? null);
      if (!result.alreadyAuthorized) {
        setFreshResult({
          downloadUrl: result.downloadUrl,
          fileName: result.fileName,
          method: result.accessMethod
        });
      }
    } catch (err) {
      if (err instanceof ContentApiError && err.status === 409 && err.code === "insufficient_access") {
        setRevealDownload(false);
        setUpgradeOpen(true);
      } else {
        setError(
          err instanceof ContentApiError ? err.message : "Something went wrong. Please try again."
        );
      }
    } finally {
      setDownloading(false);
      busyRef.current = false;
    }
  }, [fileId]);
  const handleCopy = (0, import_react13.useCallback)(async () => {
    if (!password) return;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(password);
      } else {
        const ta = document.createElement("textarea");
        ta.value = password;
        ta.setAttribute("readonly", "");
        ta.style.position = "absolute";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2e3);
    } catch {
    }
  }, [password]);
  const freePerDay = access?.freePerDay ?? 2;
  const freeRemaining = access?.freeRemaining ?? 0;
  const tokenBalance = access?.tokenBalance ?? 0;
  if (authorized) {
    return /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("div", { className: "dl", "aria-label": "Archive access unlocked", children: [
      /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("div", { className: "dl__row dl__head", children: [
        /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("span", { className: "dl__key", "aria-hidden": "true", children: "\u{1F511}" }),
        /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("h3", { className: "dl__title", children: "Archive password" }),
          /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("p", { className: "dl__text", children: "This file is unlocked. Use the password below to open the downloaded archive." })
        ] })
      ] }),
      freshResult && /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("div", { className: "dl__fresh", children: [
        /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("p", { className: "dl__text", children: [
          "Download authorized",
          freshResult.method === "free" ? " using your free daily download" : " using a purchased token",
          "."
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)(
          "a",
          {
            className: "btn btn-primary",
            href: freshResult.downloadUrl,
            target: "_blank",
            rel: "noopener noreferrer",
            children: [
              "Open download \xB7 ",
              freshResult.fileName
            ]
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("div", { className: "dl__pw", children: [
        /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("code", { className: "dl__code mono", children: password ?? "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" }),
        /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(Button, { size: "sm", onClick: handleCopy, "aria-live": "polite", children: copied ? "\u2713 Copied" : "Copy" })
      ] }),
      copied && /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("p", { className: "dl__copied", children: "Password copied to clipboard." })
    ] });
  }
  if (loading) {
    return /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("div", { className: "dl dl--loading", children: [
      /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("span", { className: "loading__spinner", "aria-hidden": "true" }),
      /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("span", { className: "dl__text", children: "Checking download access\u2026" })
    ] });
  }
  if (revealDownload) {
    return /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("div", { className: "dl", children: [
      /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("div", { className: "dl__row dl__head", children: [
        /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("span", { className: "dl__key", "aria-hidden": "true", children: "\u21E9" }),
        /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("h3", { className: "dl__title", children: "Ready to download" }),
          /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("p", { className: "dl__text", children: "This will use your free daily download first, then purchased tokens. Each authorization unlocks the archive password." })
        ] })
      ] }),
      error && /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("p", { className: "form-error dl__err", children: error }),
      /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("div", { className: "dl__actions", children: [
        /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(
          Button,
          {
            onClick: handleDownload,
            disabled: downloading,
            "aria-busy": downloading,
            children: downloading ? "Authorizing\u2026" : "DOWNLOAD"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("span", { className: "dl__hint", children: freeRemaining > 0 ? `${freeRemaining} of ${freePerDay} free downloads left today` : `Tokens available: ${tokenBalance.toLocaleString()}` })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(Modal, { open: upgradeOpen, onClose: () => setUpgradeOpen(false), title: "Upgrade to download more", children: /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("div", { className: "modal-block", children: [
        /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("p", { className: "dl__text", children: "You\u2019ve used your free downloads for today and have no purchased tokens available. Add tokens to keep downloading." }),
        /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("div", { className: "dl__modal-actions", children: [
          /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(import_react_router_dom20.Link, { to: "/tokens", className: "btn btn-primary", children: "Get Tokens" }),
          /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(Button, { variant: "secondary", onClick: () => setUpgradeOpen(false), children: "Close" })
        ] })
      ] }) })
    ] });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("div", { className: "dl", children: [
    /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("div", { className: "dl__row dl__head", children: [
      /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("span", { className: "dl__key", "aria-hidden": "true", children: "\u{1F512}" }),
      /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("h3", { className: "dl__title", children: "Locked archive" }),
        /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("p", { className: "dl__text", children: "Unlock this file to get its archive password and download access. Getting a link is free \u2014 access is only consumed when you download." })
      ] })
    ] }),
    error && /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("p", { className: "form-error dl__err", children: error }),
    /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("div", { className: "dl__actions", children: [
      /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(Button, { onClick: handleGetLink, disabled: checking || downloading, children: checking ? "Checking\u2026" : "GET LINK" }),
      /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("span", { className: "dl__hint", children: freeRemaining > 0 ? `${freeRemaining} of ${freePerDay} free downloads left today` : tokenBalance > 0 ? `${tokenBalance.toLocaleString()} tokens available` : "No downloads remaining today" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(Modal, { open: upgradeOpen, onClose: () => setUpgradeOpen(false), title: "Upgrade to download more", children: /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("div", { className: "modal-block", children: [
      /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("p", { className: "dl__text", children: [
        "You have no downloads remaining today. Free quota resets at midnight (",
        access?.timezone ?? "UTC",
        "), or add tokens to download immediately."
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("div", { className: "dl__modal-actions", children: [
        /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(import_react_router_dom20.Link, { to: "/tokens", className: "btn btn-primary", children: "Get Tokens" }),
        /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(Button, { variant: "secondary", onClick: () => setUpgradeOpen(false), children: "Close" })
      ] })
    ] }) })
  ] });
}
var import_react13, import_react_router_dom20, import_jsx_runtime32;
var init_DownloadAccess = __esm({
  "src/components/media/DownloadAccess.tsx"() {
    import_react13 = require("react");
    import_react_router_dom20 = require("react-router-dom");
    init_Button();
    init_Modal();
    init_AuthContext();
    init_content2();
    import_jsx_runtime32 = require("react/jsx-runtime");
  }
});

// src/pages/public/FileDetails.tsx
function FileDetails() {
  const { id = "" } = (0, import_react_router_dom21.useParams)();
  const itemState = useAsyncData(() => fetchContent(id), [id]);
  const relatedState = useAsyncData(
    () => fetchRelatedContent(id),
    [id]
  );
  usePageMeta(
    itemState.data?.title ?? "Content",
    itemState.data?.description ? itemState.data.description : "Content details on Lotus Hub."
  );
  if (itemState.status === "loading") {
    return /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(PageContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("div", { className: "file-loading", children: /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(Loading, { label: "Loading content\u2026" }) }) });
  }
  if (itemState.status === "error") {
    const notFound = itemState.error?.includes("not available");
    return /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(PageContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("div", { className: "file-status", children: notFound ? /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(
      EmptyState,
      {
        title: "Content not found",
        message: "This content may have been removed or is no longer available.",
        action: /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(import_react_router_dom21.Link, { to: "/browse", className: "btn btn-primary", children: "Browse the library" })
      }
    ) : /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(
      ErrorState,
      {
        title: "Couldn\u2019t load content",
        message: itemState.isUnauthenticated ? "Your session has ended. Please sign in again." : itemState.error ?? "Something went wrong.",
        action: itemState.isUnauthenticated ? /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(import_react_router_dom21.Link, { to: "/login", className: "btn btn-primary", children: "Sign in" }) : /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("button", { type: "button", className: "btn btn-secondary", onClick: itemState.retry, children: "Retry" })
      }
    ) }) });
  }
  const item = itemState.data;
  const related = relatedState.data?.items ?? [];
  return /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)(PageContainer, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(
      Breadcrumbs,
      {
        items: [
          { label: "Home", to: "/" },
          { label: "Browse", to: "/browse" },
          { label: item.category }
        ]
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)("div", { className: "file-layout", children: [
      /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("div", { className: "file-poster", children: /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(
        MediaThumbnail,
        {
          hue: item.hue,
          type: item.type,
          title: item.title,
          rating: item.rating,
          thumbnailUrl: item.thumbnailUrl,
          className: "file-poster__thumb",
          tall: true
        }
      ) }),
      /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)("div", { className: "file-info", children: [
        /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("span", { className: "badge badge-accent", children: TYPE_LABEL[item.type] }),
        /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("h1", { className: "file-info__title", children: item.title }),
        /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("p", { className: "file-info__desc", children: item.description }),
        /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(ContentMetadata, { item }),
        item.tags.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)("div", { className: "file-tags", children: [
          /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("span", { className: "file-tags__label", children: "Tags" }),
          /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("div", { className: "file-tags__list", children: item.tags.map((tag) => /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("span", { className: "badge", children: tag }, tag)) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(DownloadAccess, { fileId: item.id }, item.id)
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("section", { className: "file-related", children: relatedState.status === "loading" ? /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)(import_jsx_runtime33.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("div", { className: "section-head", children: /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("h2", { className: "section-title", children: "Related" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(MediaRowSkeleton, { count: 4 })
    ] }) : related.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)(import_jsx_runtime33.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)("div", { className: "section-head", children: [
        /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("h2", { className: "section-title", children: "More from Lotus Hub" }),
        /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(import_react_router_dom21.Link, { to: "/browse", className: "section-link", children: "View all" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(MediaRow, { items: related })
    ] }) : null })
  ] });
}
var import_react_router_dom21, import_jsx_runtime33;
var init_FileDetails = __esm({
  "src/pages/public/FileDetails.tsx"() {
    import_react_router_dom21 = require("react-router-dom");
    init_PageContainer();
    init_MediaThumbnail();
    init_MediaRow();
    init_MediaStates();
    init_ContentMetadata();
    init_DownloadAccess();
    init_Loading();
    init_ErrorState();
    init_EmptyState();
    init_Breadcrumbs();
    init_content();
    init_useAsyncData();
    init_usePageMeta();
    init_content2();
    import_jsx_runtime33 = require("react/jsx-runtime");
  }
});

// src/components/ui/CopyButton.tsx
function CopyButton({
  value,
  label = "Copy",
  feedback = "Copied to clipboard",
  className
}) {
  const [copied, setCopied] = (0, import_react14.useState)(false);
  const timerRef = (0, import_react14.useRef)(null);
  const handleCopy = async () => {
    if (!value) return;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        const ta = document.createElement("textarea");
        ta.value = value;
        ta.setAttribute("readonly", "");
        ta.style.position = "absolute";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setCopied(false), 2e3);
    } catch {
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime34.jsxs)("span", { className: cn("copybox", className), children: [
    /* @__PURE__ */ (0, import_jsx_runtime34.jsxs)(
      "button",
      {
        type: "button",
        className: cn("btn", "btn-secondary", "btn-sm", copied && "is-copied"),
        onClick: handleCopy,
        "aria-label": copied ? `${label} \u2014 ${feedback}` : label,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("span", { "aria-hidden": "true", children: copied ? "\u2713 " : "" }),
          copied ? "Copied" : label
        ]
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("span", { className: "sr-only", role: "status", "aria-live": "polite", children: copied ? feedback : "" })
  ] });
}
var import_react14, import_jsx_runtime34;
var init_CopyButton = __esm({
  "src/components/ui/CopyButton.tsx"() {
    import_react14 = require("react");
    init_cn();
    import_jsx_runtime34 = require("react/jsx-runtime");
  }
});

// src/hooks/useAccountSummary.ts
function useAccountSummary() {
  const [state, setState] = (0, import_react15.useState)(idle2);
  const mountedRef = (0, import_react15.useRef)(true);
  const seqRef = (0, import_react15.useRef)(0);
  const run = (0, import_react15.useCallback)(async () => {
    const seq = ++seqRef.current;
    setState((s) => ({ ...s, status: "loading" }));
    try {
      const data = await fetchAccountSummary();
      if (mountedRef.current && seq === seqRef.current) {
        setState({ status: "success", data, error: null, isUnauthenticated: false });
      }
    } catch (err) {
      if (mountedRef.current && seq === seqRef.current) {
        const isAuthErr = err instanceof AuthApiError;
        setState({
          status: "error",
          data: null,
          error: isAuthErr ? err.message : "Something went wrong loading your account.",
          isUnauthenticated: isAuthErr && err.status === 401
        });
      }
    }
  }, []);
  (0, import_react15.useEffect)(() => {
    mountedRef.current = true;
    run();
    return () => {
      mountedRef.current = false;
      seqRef.current += 1;
    };
  }, [run]);
  const retry = (0, import_react15.useCallback)(() => run(), [run]);
  return { ...state, retry };
}
var import_react15, idle2;
var init_useAccountSummary = __esm({
  "src/hooks/useAccountSummary.ts"() {
    import_react15 = require("react");
    init_auth();
    idle2 = { status: "loading", data: null, error: null, isUnauthenticated: false };
  }
});

// src/config/contact.ts
function getContactMethod() {
  if (CONFIG.method === "telegram" && CONFIG.telegramUsername) return "telegram";
  if (CONFIG.method === "whatsapp" && CONFIG.whatsappNumber) return "whatsapp";
  return "email";
}
function getContactLabel() {
  const m = getContactMethod();
  if (m === "telegram") return "Telegram";
  if (m === "whatsapp") return "WhatsApp";
  return "Email";
}
function getPurchaseContactHref(lotusHubId) {
  const m = getContactMethod();
  const idLine = `My Lotus Hub ID: ${lotusHubId}`;
  if (m === "telegram") {
    return `https://t.me/${CONFIG.telegramUsername}`;
  }
  if (m === "whatsapp") {
    const text = encodeURIComponent(`Hi, I'd like to purchase Lotus Hub tokens. ${idLine}`);
    return `https://wa.me/${CONFIG.whatsappNumber}?text=${text}`;
  }
  const subject = encodeURIComponent("Lotus Hub token purchase");
  const body = encodeURIComponent(`Hello,

${idLine}

I'd like to purchase tokens.`);
  return `mailto:${CONFIG.email}?subject=${subject}&body=${body}`;
}
function getContactDestination() {
  const m = getContactMethod();
  if (m === "telegram") return `@${CONFIG.telegramUsername}`;
  if (m === "whatsapp") return CONFIG.whatsappNumber;
  return CONFIG.email;
}
function getGeneralContactHref() {
  const m = getContactMethod();
  if (m === "telegram") {
    return `https://t.me/${CONFIG.telegramUsername}`;
  }
  if (m === "whatsapp") {
    const text = encodeURIComponent("Hi, I'd like to ask about Lotus Hub.");
    return `https://wa.me/${CONFIG.whatsappNumber}?text=${text}`;
  }
  const subject = encodeURIComponent("Lotus Hub enquiry");
  return `mailto:${CONFIG.email}?subject=${subject}`;
}
function isContactPlaceholder() {
  const m = getContactMethod();
  if (m === "telegram") return !CONFIG.telegramUsername;
  if (m === "whatsapp") return !CONFIG.whatsappNumber;
  return /\.example$/i.test(CONFIG.email) || !CONFIG.email;
}
var import_meta4, metaEnv3, CONFIG;
var init_contact = __esm({
  "src/config/contact.ts"() {
    import_meta4 = {};
    metaEnv3 = import_meta4?.env ?? {};
    CONFIG = {
      method: metaEnv3.VITE_CONTACT_METHOD || "email",
      email: metaEnv3.VITE_CONTACT_EMAIL || "support@lotushub.example",
      telegramUsername: (metaEnv3.VITE_CONTACT_TELEGRAM || "").replace(/^@/, ""),
      whatsappNumber: (metaEnv3.VITE_CONTACT_WHATSAPP || "").replace(/\D/g, "")
    };
  }
});

// src/pages/public/Tokens.tsx
function Tokens() {
  const { user } = useAuth();
  const summary = useAccountSummary();
  const navigate = (0, import_react_router_dom22.useNavigate)();
  usePageMeta("Get Tokens", "Purchase Lotus Hub tokens for downloads.");
  if (!user) {
    navigate("/login", { replace: true });
    return null;
  }
  const lotusHubId = summary.data?.lotusHubId ?? user.lotusHubId;
  const balance = summary.data?.tokenBalance;
  const free = summary.data?.freeDownloadsToday;
  const nextExpiry = summary.data?.nextTokenExpiryAt;
  const validityDays = summary.data?.tokenValidityDays ?? 14;
  const contactHref = getPurchaseContactHref(lotusHubId);
  const contactLabel = getContactLabel();
  const contactDest = getContactDestination();
  return /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)(PageContainer, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("header", { className: "browse-head", style: { textAlign: "center" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("h1", { className: "page-title", children: "Get Tokens" }),
      /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("p", { className: "page-subtitle", style: { marginInline: "auto", maxWidth: "56ch" }, children: "Need more downloads? Purchase Lotus Hub tokens to continue downloading after your free daily quota is used." })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("section", { className: "acct-card acct-id acct-id--centered", "aria-label": "Your Lotus Hub ID", children: [
      /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: "acct-id__eyebrow", children: "Your Lotus Hub ID" }),
      /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: "acct-id__code-row", children: [
        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("code", { className: "acct-id__code mono", children: lotusHubId }),
        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(CopyButton, { value: lotusHubId, label: "Copy ID" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("p", { className: "acct-id__hint", children: "You\u2019ll share this ID when you contact us, so tokens can be added to the right account." })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("section", { className: "tokens-how", children: [
      /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("h2", { className: "section-title", style: { textAlign: "center" }, children: "How to purchase tokens" }),
      /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("div", { className: "tokens-steps", children: STEPS.map((step, i) => /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: "tokens-step", children: [
        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: "tokens-step__num", children: i + 1 }),
        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("h3", { children: step.title }),
        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("p", { children: step.body })
      ] }, step.title)) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("section", { className: "purchase-cta", "aria-label": "Contact to purchase tokens", children: [
      /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("h2", { children: "Ready to buy tokens?" }),
      /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("p", { children: [
        "Contact Lotus Hub by ",
        contactLabel.toLowerCase(),
        " to purchase tokens. Processing time depends on the administrator and can vary."
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
        "a",
        {
          className: "btn btn-primary btn-lg",
          href: contactHref,
          target: "_blank",
          rel: "noopener noreferrer",
          children: "Contact to purchase tokens"
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("span", { className: "purchase-cta__dest", children: [
        contactLabel,
        ": ",
        contactDest
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("section", { className: "tokens-how", children: [
      /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("h2", { className: "section-title", children: "Your balance" }),
      summary.status === "loading" && /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("p", { className: "faint", children: "Loading your balance\u2026" }),
      summary.status === "error" && /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("p", { className: "form-error", children: summary.error ?? "Couldn\u2019t load your balance. Please try again." }),
      summary.status === "success" && /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: "acct-stats", children: [
        /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: "acct-stat", children: [
          /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: "acct-stat__label", children: "Free Downloads Today" }),
          /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("span", { className: "acct-stat__value", children: [
            free.remaining,
            " ",
            /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("span", { className: "acct-stat__per", children: [
              "/ ",
              free.perDay
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: "acct-stat__sub", children: "remaining today" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: "acct-stat", children: [
          /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: "acct-stat__label", children: "Available Tokens" }),
          /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: "acct-stat__value", children: (balance ?? 0).toLocaleString() }),
          /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: "acct-stat__sub", children: balance ? `expire after ${validityDays} days` : "no active tokens" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: "acct-stat", children: [
          /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: "acct-stat__label", children: "Next Token Expiry" }),
          /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: "acct-stat__value acct-stat__value--sm", children: nextExpiry ? timeUntil(nextExpiry) : "\u2014" }),
          /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: "acct-stat__sub", children: nextExpiry ? `expires ${formatDate(nextExpiry)}` : "\u2014" })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: "tokens-facts", children: [
        /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: "tokens-fact", children: [
          /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("h3", { children: "When are tokens used?" }),
          /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("p", { children: "Tokens are used once your free daily downloads are exhausted \u2014 free downloads are always used first." })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: "tokens-fact", children: [
          /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("h3", { children: "How long do tokens last?" }),
          /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("p", { children: [
            "Purchased tokens expire ",
            validityDays,
            " days after they\u2019re added. Unused expired tokens can\u2019t be used."
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: "tokens-fact", children: [
          /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("h3", { children: "How are tokens added?" }),
          /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("p", { children: "Tokens are added manually after the administrator confirms your payment. Timing depends on the administrator \u2014 there\u2019s no fixed guarantee." })
        ] })
      ] })
    ] })
  ] });
}
var import_react_router_dom22, import_jsx_runtime35, STEPS;
var init_Tokens = __esm({
  "src/pages/public/Tokens.tsx"() {
    import_react_router_dom22 = require("react-router-dom");
    init_PageContainer();
    init_CopyButton();
    init_AuthContext();
    init_useAccountSummary();
    init_usePageMeta();
    init_contact();
    init_format();
    import_jsx_runtime35 = require("react/jsx-runtime");
    STEPS = [
      {
        title: "Note your Lotus Hub ID",
        body: "Copy the 6-digit Lotus Hub ID shown on this page."
      },
      {
        title: "Contact Lotus Hub",
        body: "Reach out through the contact action below and share your Lotus Hub ID."
      },
      {
        title: "Complete the payment process",
        body: "The administrator will confirm your purchase details."
      },
      {
        title: "Tokens are added manually",
        body: "After payment is confirmed, tokens are added to your account."
      }
    ];
  }
});

// src/pages/public/Profile.tsx
function Profile() {
  const { user, logout: logout2 } = useAuth();
  const summary = useAccountSummary();
  const navigate = (0, import_react_router_dom23.useNavigate)();
  usePageMeta("Your profile", "Your Lotus Hub account, tokens and downloads.");
  if (!user) {
    return /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(PageContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "browse-head", children: [
      /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("h1", { className: "page-title", children: "Your profile" }),
      /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("p", { className: "page-subtitle", children: "Profile details are unavailable right now." })
    ] }) });
  }
  const roleLabel = user.role === "superadmin" ? "Super Admin" : user.role === "admin" ? "Admin" : "Member";
  const lotusHubId = summary.data?.lotusHubId ?? user.lotusHubId;
  const handleLogout = async () => {
    await logout2();
    navigate("/login", { replace: true });
  };
  const renderSummary = () => {
    if (summary.status === "loading") {
      return /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("div", { className: "acct-loading", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(Loading, { label: "Loading your balance\u2026" }) });
    }
    if (summary.status === "error") {
      return /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(
        ErrorState,
        {
          title: "Couldn\u2019t load your account",
          message: summary.isUnauthenticated ? "Your session has ended. Please sign in again." : summary.error ?? "Something went wrong.",
          action: summary.isUnauthenticated ? /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(import_react_router_dom23.Link, { to: "/login", className: "btn btn-primary", children: "Sign in" }) : /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("button", { type: "button", className: "btn btn-secondary", onClick: summary.retry, children: "Retry" })
        }
      );
    }
    const free = summary.data.freeDownloadsToday;
    const tokens = summary.data.tokenBalance;
    const nextExpiry = summary.data.nextTokenExpiryAt;
    const validityDays = summary.data.tokenValidityDays;
    return /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)(import_jsx_runtime36.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "acct-stats", children: [
        /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "acct-stat", children: [
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("span", { className: "acct-stat__label", children: "Free Downloads Today" }),
          /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("span", { className: "acct-stat__value", children: [
            free.remaining,
            " ",
            /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("span", { className: "acct-stat__per", children: [
              "/ ",
              free.perDay
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("span", { className: "acct-stat__sub", children: free.remaining > 0 ? "remaining today" : "used up for today" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "acct-stat", children: [
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("span", { className: "acct-stat__label", children: "Available Tokens" }),
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("span", { className: "acct-stat__value", children: tokens.toLocaleString() }),
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("span", { className: "acct-stat__sub", children: tokens > 0 ? `valid \xB7 expire after ${validityDays} days` : "no active tokens" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "acct-stat", children: [
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("span", { className: "acct-stat__label", children: "Next Token Expiry" }),
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("span", { className: "acct-stat__value acct-stat__value--sm", children: nextExpiry ? timeUntil(nextExpiry) : "\u2014" }),
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("span", { className: "acct-stat__sub", children: nextExpiry ? `expires ${formatDate(nextExpiry)}` : "purchased tokens last 14 days" })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("p", { className: "acct-note", children: [
        "Purchased tokens are used once your free daily downloads are exhausted, and they expire ",
        validityDays,
        " days after they\u2019re added. Tokens are added manually after the Lotus Hub administrator confirms your payment."
      ] })
    ] });
  };
  return /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)(PageContainer, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("header", { className: "browse-head", children: [
      /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("h1", { className: "page-title", children: "Your profile" }),
      /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("p", { className: "page-subtitle", children: "Your account identity and downloads at a glance." })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "acct-grid", children: [
      /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("section", { className: "acct-card", "aria-labelledby": "acct-identity", children: [
        /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "profile-identity", children: [
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("span", { className: "profile-identity__avatar", "aria-hidden": "true", children: user.username.charAt(0).toUpperCase() }),
          /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("h2", { id: "acct-identity", className: "profile-identity__name", children: user.username }),
            /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("span", { className: "badge", children: roleLabel })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("div", { className: "acct-divider", "aria-hidden": "true" }),
        /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("dl", { className: "profile-details", children: [
          /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("dt", { children: "Username" }),
            /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("dd", { children: user.username })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("dt", { children: "Role" }),
            /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("dd", { children: roleLabel })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("dt", { children: "Member since" }),
            /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("dd", { children: formatDate(user.createdAt) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("section", { className: "acct-card acct-id", "aria-label": "Lotus Hub ID", children: [
        /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("span", { className: "acct-id__eyebrow", children: "Lotus Hub ID" }),
        /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "acct-id__code-row", children: [
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("code", { className: "acct-id__code mono", children: lotusHubId }),
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(CopyButton, { value: lotusHubId, label: "Copy ID" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("p", { className: "acct-id__hint", children: "Share this ID when purchasing tokens so the administrator can add them to your account." })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("section", { className: "profile-section", children: [
      /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("h2", { className: "section-title", children: "Downloads & tokens" }),
      renderSummary()
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("section", { className: "profile-section", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "profile-notice acct-logout", children: [
      /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("h3", { children: [
          "Signed in as ",
          user.username
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("p", { children: "Sign out of Lotus Hub on this device. You can sign back in anytime." })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "profile-notice__actions", children: [
        /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(import_react_router_dom23.Link, { to: "/tokens", className: "btn btn-secondary", children: "Get Tokens" }),
        /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("button", { type: "button", className: "btn btn-danger", onClick: handleLogout, children: "Sign out" })
      ] })
    ] }) })
  ] });
}
var import_react_router_dom23, import_jsx_runtime36;
var init_Profile = __esm({
  "src/pages/public/Profile.tsx"() {
    import_react_router_dom23 = require("react-router-dom");
    init_PageContainer();
    init_CopyButton();
    init_Loading();
    init_ErrorState();
    init_AuthContext();
    init_useAccountSummary();
    init_usePageMeta();
    init_format();
    import_jsx_runtime36 = require("react/jsx-runtime");
  }
});

// src/components/ui/StaticPage.tsx
function StaticPage({ title, subtitle, meta, children }) {
  return /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)(PageContainer, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("header", { className: "static-head", children: [
      /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("h1", { className: "page-title", children: title }),
      subtitle && /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("p", { className: "page-subtitle", children: subtitle }),
      meta && /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("span", { className: "static-meta", children: meta })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("div", { className: "static-body", children })
  ] });
}
var import_jsx_runtime37;
var init_StaticPage = __esm({
  "src/components/ui/StaticPage.tsx"() {
    init_PageContainer();
    import_jsx_runtime37 = require("react/jsx-runtime");
  }
});

// src/pages/public/FAQ.tsx
function FAQ() {
  usePageMeta(
    "FAQ",
    "Frequently asked questions about Lotus Hub \u2014 accounts, downloads, tokens and support.",
    "website",
    [
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: FAQS.map((f, i) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
          inLanguage: "en",
          position: i + 1
        }))
      }
    ]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime38.jsxs)(
    StaticPage,
    {
      title: "Frequently asked questions",
      subtitle: "Common questions about accounts, downloads and tokens.",
      children: [
        FAQS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime38.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime38.jsx)("h2", { children: f.q }),
          /* @__PURE__ */ (0, import_jsx_runtime38.jsx)("p", { children: f.a })
        ] }, f.q)),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)("h2", { children: "Still have questions?" }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsxs)("p", { children: [
          "If you didn\u2019t find an answer here, you can",
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(import_react_router_dom24.Link, { to: "/contact", children: "contact the Lotus Hub team" }),
          " for help."
        ] })
      ]
    }
  );
}
var import_react_router_dom24, import_jsx_runtime38, FAQS;
var init_FAQ = __esm({
  "src/pages/public/FAQ.tsx"() {
    import_react_router_dom24 = require("react-router-dom");
    init_StaticPage();
    init_usePageMeta();
    import_jsx_runtime38 = require("react/jsx-runtime");
    FAQS = [
      {
        q: "What is Lotus Hub?",
        a: "Lotus Hub is a media content discovery platform that organizes films, images, documents and audio into a clean, modern library."
      },
      {
        q: "Do I need an account?",
        a: "Yes. Browsing the library, downloads and your token balance are tied to an account. You can create one by signing in with Telegram and choosing a username and password."
      },
      {
        q: "How do downloads work?",
        a: "Open a file and use GET LINK, then DOWNLOAD. Each download grants access to that file\u2019s archive password. There is a limited number of free downloads each day; after those run out you use purchased tokens."
      },
      {
        q: "What are tokens?",
        a: "Tokens are download credits. After your free daily downloads are used, further downloads consume tokens. Each token batch expires 14 days after it is added."
      },
      {
        q: "How do I get tokens?",
        a: "Token purchases are arranged directly with the Lotus Hub team. Visit Get Tokens for instructions on how to contact us with your Lotus Hub ID and complete a purchase."
      },
      {
        q: "How can I contact support?",
        a: "Use the contact page to reach the Lotus Hub team with questions, feedback or help requests."
      }
    ];
  }
});

// src/pages/public/Contact.tsx
function Contact() {
  usePageMeta(
    "Contact",
    "Contact the Lotus Hub team with questions, feedback or support requests."
  );
  const label = getContactLabel();
  const destination = getContactDestination();
  const href = getGeneralContactHref();
  const placeholder = isContactPlaceholder();
  return /* @__PURE__ */ (0, import_jsx_runtime39.jsxs)(PageContainer, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime39.jsxs)("header", { className: "static-head", children: [
      /* @__PURE__ */ (0, import_jsx_runtime39.jsx)("h1", { className: "page-title", children: "Contact us" }),
      /* @__PURE__ */ (0, import_jsx_runtime39.jsx)("p", { className: "page-subtitle", children: "Questions, feedback or support requests? The Lotus Hub team is here to help." })
    ] }),
    placeholder && /* @__PURE__ */ (0, import_jsx_runtime39.jsxs)("div", { className: "form-error", role: "status", children: [
      "Contact details have not been configured yet. The project owner must set ",
      /* @__PURE__ */ (0, import_jsx_runtime39.jsx)("code", { children: "VITE_CONTACT_METHOD" }),
      " and its destination before going live."
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime39.jsxs)("div", { className: "contact-layout", children: [
      /* @__PURE__ */ (0, import_jsx_runtime39.jsxs)("div", { className: "contact-info", style: { gridRow: "1" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime39.jsx)("h2", { className: "section-title", children: "Get in touch" }),
        /* @__PURE__ */ (0, import_jsx_runtime39.jsxs)("ul", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime39.jsxs)("li", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime39.jsx)("span", { className: "contact-info__label", children: "Preferred channel" }),
            /* @__PURE__ */ (0, import_jsx_runtime39.jsx)("span", { children: label })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime39.jsxs)("li", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime39.jsx)("span", { className: "contact-info__label", children: "Reach us at" }),
            /* @__PURE__ */ (0, import_jsx_runtime39.jsx)("span", { children: destination })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime39.jsx)("div", { style: { marginTop: 22 }, children: /* @__PURE__ */ (0, import_jsx_runtime39.jsxs)("a", { href, className: "btn btn-primary", target: "_blank", rel: "noopener noreferrer", children: [
          "Contact via ",
          label
        ] }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime39.jsxs)("aside", { className: "static-body", children: [
        /* @__PURE__ */ (0, import_jsx_runtime39.jsx)("h2", { children: "What to include" }),
        /* @__PURE__ */ (0, import_jsx_runtime39.jsx)("p", { children: "To help us respond quickly, please share a short description of your question or issue." }),
        /* @__PURE__ */ (0, import_jsx_runtime39.jsx)("h2", { children: "Buying tokens" }),
        /* @__PURE__ */ (0, import_jsx_runtime39.jsxs)("p", { children: [
          "To purchase tokens you\u2019ll need your 6-digit Lotus Hub ID, which is shown on your ",
          /* @__PURE__ */ (0, import_jsx_runtime39.jsx)(import_react_router_dom25.Link, { to: "/profile", children: "profile" }),
          " and",
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime39.jsx)(import_react_router_dom25.Link, { to: "/tokens", children: "Get Tokens" }),
          " pages after signing in."
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime39.jsx)("h2", { children: "Response times" }),
        /* @__PURE__ */ (0, import_jsx_runtime39.jsx)("p", { children: "We aim to respond within a couple of business days. Please avoid including passwords or sensitive account details in your message." })
      ] })
    ] })
  ] });
}
var import_react_router_dom25, import_jsx_runtime39;
var init_Contact = __esm({
  "src/pages/public/Contact.tsx"() {
    import_react_router_dom25 = require("react-router-dom");
    init_PageContainer();
    init_usePageMeta();
    init_contact();
    import_jsx_runtime39 = require("react/jsx-runtime");
  }
});

// src/config/company.ts
function operatorNotice() {
  if (hasConfiguredOperator) return null;
  return "This page uses a placeholder operator identity. The project owner must provide the registered business name, address and contact details before publishing.";
}
var import_meta5, metaEnv4, OPERATOR_NAME, hasConfiguredOperator, OPERATOR_CONTACT_LABEL, OPERATOR_CONTACT_DESTINATION, OPERATOR_CONTACT_METHOD;
var init_company = __esm({
  "src/config/company.ts"() {
    init_env();
    init_contact();
    import_meta5 = {};
    metaEnv4 = import_meta5?.env ?? {};
    OPERATOR_NAME = metaEnv4.VITE_OPERATOR_NAME || APP_NAME;
    hasConfiguredOperator = Boolean(metaEnv4.VITE_OPERATOR_NAME) || Boolean(metaEnv4.VITE_CONTACT_EMAIL);
    OPERATOR_CONTACT_LABEL = getContactLabel();
    OPERATOR_CONTACT_DESTINATION = getContactDestination();
    OPERATOR_CONTACT_METHOD = getContactMethod();
  }
});

// src/pages/public/Terms.tsx
function Terms() {
  usePageMeta(
    "Terms of service",
    "The terms that govern your use of Lotus Hub \u2014 accounts, downloads and tokens."
  );
  const notice = operatorNotice();
  return /* @__PURE__ */ (0, import_jsx_runtime40.jsxs)(
    StaticPage,
    {
      title: "Terms of service",
      subtitle: "The terms that govern your use of Lotus Hub.",
      meta: "Last reviewed September 2026",
      children: [
        notice && /* @__PURE__ */ (0, import_jsx_runtime40.jsx)("p", { className: "form-error", children: notice }),
        /* @__PURE__ */ (0, import_jsx_runtime40.jsx)("h2", { children: "1. The service" }),
        /* @__PURE__ */ (0, import_jsx_runtime40.jsx)("p", { children: "Lotus Hub is a media content discovery platform. Depending on the service available to you, it may provide browsing of a curated media library, account features, and download access that is subject to a free daily quota and, where enabled, purchased tokens." }),
        /* @__PURE__ */ (0, import_jsx_runtime40.jsx)("h2", { children: "2. Accounts" }),
        /* @__PURE__ */ (0, import_jsx_runtime40.jsx)("p", { children: "Some features require an account. When you create one you are responsible for keeping your login credentials confidential and for activity that happens on your account. You may not share your account or use another person\u2019s account." }),
        /* @__PURE__ */ (0, import_jsx_runtime40.jsx)("h2", { children: "3. Acceptable use" }),
        /* @__PURE__ */ (0, import_jsx_runtime40.jsx)("p", { children: "You agree not to misuse the service, attempt to disrupt or reverse-engineer it, bypass access or quota controls, or use automated means to access the platform beyond normal browsing." }),
        /* @__PURE__ */ (0, import_jsx_runtime40.jsx)("h2", { children: "4. Content and downloads" }),
        /* @__PURE__ */ (0, import_jsx_runtime40.jsx)("p", { children: "Content shown on Lotus Hub is provided for authorized personal use and is owned by its respective rights holders. Download access is granted on a per-file authorization basis; you may not redistribute downloaded material except as permitted by the relevant rights holder." }),
        /* @__PURE__ */ (0, import_jsx_runtime40.jsx)("h2", { children: "5. Disclaimers and limitation of liability" }),
        /* @__PURE__ */ (0, import_jsx_runtime40.jsx)("p", { children: "The service is provided \u201Cas is\u201D and \u201Cas available\u201D without warranties of any kind. To the fullest extent permitted by law, Lotus Hub is not liable for indirect or consequential loss arising from your use of the service." }),
        /* @__PURE__ */ (0, import_jsx_runtime40.jsx)("h2", { children: "6. Changes and contact" }),
        /* @__PURE__ */ (0, import_jsx_runtime40.jsxs)("p", { children: [
          "We may update these terms from time to time and will reflect the change date above. Questions about these terms can be sent via the",
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime40.jsx)(import_react_router_dom26.Link, { to: "/contact", children: "contact page" }),
          "."
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime40.jsx)("h2", { children: "7. Legal review" }),
        /* @__PURE__ */ (0, import_jsx_runtime40.jsx)("p", { children: "These terms are provided as a starting point and are not legal advice. The project owner should have the terms reviewed for the operator\u2019s jurisdiction and company before publishing the service." })
      ]
    }
  );
}
var import_react_router_dom26, import_jsx_runtime40;
var init_Terms = __esm({
  "src/pages/public/Terms.tsx"() {
    import_react_router_dom26 = require("react-router-dom");
    init_StaticPage();
    init_usePageMeta();
    init_company();
    import_jsx_runtime40 = require("react/jsx-runtime");
  }
});

// src/pages/public/Privacy.tsx
function Privacy() {
  usePageMeta(
    "Privacy policy",
    "How Lotus Hub handles your information \u2014 data we collect, how it is used and your rights."
  );
  const notice = operatorNotice();
  return /* @__PURE__ */ (0, import_jsx_runtime41.jsxs)(
    StaticPage,
    {
      title: "Privacy policy",
      subtitle: "How Lotus Hub handles your information.",
      meta: "Last reviewed September 2026",
      children: [
        notice && /* @__PURE__ */ (0, import_jsx_runtime41.jsx)("p", { className: "form-error", children: notice }),
        /* @__PURE__ */ (0, import_jsx_runtime41.jsx)("h2", { children: "1. Information we collect" }),
        /* @__PURE__ */ (0, import_jsx_runtime41.jsx)("p", { children: "To provide your account and the service we collect a username, a password (stored only as a secure hash), a Telegram identifier used to verify sign-in, a unique Lotus Hub ID issued to your account, and limited technical information such as your session cookie and browser type for security." }),
        /* @__PURE__ */ (0, import_jsx_runtime41.jsx)("h2", { children: "2. How we use information" }),
        /* @__PURE__ */ (0, import_jsx_runtime41.jsx)("p", { children: "We use this information to operate and secure the service, to authenticate you, to enforce your free-download quota and token balance, and to provide support. We do not sell personal information." }),
        /* @__PURE__ */ (0, import_jsx_runtime41.jsx)("h2", { children: "3. Storage and security" }),
        /* @__PURE__ */ (0, import_jsx_runtime41.jsx)("p", { children: "Passwords are stored as salted hashes and archive access details are encrypted at rest. Sensitive values are never exposed in frontend code or public pages." }),
        /* @__PURE__ */ (0, import_jsx_runtime41.jsx)("h2", { children: "4. Cookies" }),
        /* @__PURE__ */ (0, import_jsx_runtime41.jsxs)("p", { children: [
          "We use a necessary session cookie to keep you signed in. See the",
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime41.jsx)(import_react_router_dom27.Link, { to: "/cookies", children: "cookies policy" }),
          " for details."
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime41.jsx)("h2", { children: "5. Your rights" }),
        /* @__PURE__ */ (0, import_jsx_runtime41.jsxs)("p", { children: [
          "Depending on your jurisdiction you may have rights to access, correct, delete or restrict the processing of your personal information. To exercise any of these rights, contact us through the",
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime41.jsx)(import_react_router_dom27.Link, { to: "/contact", children: "contact page" }),
          "."
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime41.jsx)("h2", { children: "6. Children" }),
        /* @__PURE__ */ (0, import_jsx_runtime41.jsx)("p", { children: "The service is not directed at children, and we do not knowingly collect information from children without the required consent." }),
        /* @__PURE__ */ (0, import_jsx_runtime41.jsx)("h2", { children: "7. Legal review" }),
        /* @__PURE__ */ (0, import_jsx_runtime41.jsx)("p", { children: "This policy is provided as a starting point and is not legal advice. The project owner should have it reviewed for the operator\u2019s jurisdiction before publishing." })
      ]
    }
  );
}
var import_react_router_dom27, import_jsx_runtime41;
var init_Privacy = __esm({
  "src/pages/public/Privacy.tsx"() {
    import_react_router_dom27 = require("react-router-dom");
    init_StaticPage();
    init_usePageMeta();
    init_company();
    import_jsx_runtime41 = require("react/jsx-runtime");
  }
});

// src/pages/public/Cookies.tsx
function Cookies() {
  usePageMeta(
    "Cookies policy",
    "How cookies are used on Lotus Hub \u2014 only the strictly necessary session cookie is set today."
  );
  return /* @__PURE__ */ (0, import_jsx_runtime42.jsxs)(
    StaticPage,
    {
      title: "Cookies policy",
      subtitle: "How cookies are used on Lotus Hub.",
      meta: "Last reviewed September 2026",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("h2", { children: "1. What are cookies?" }),
        /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("p", { children: "Cookies are small text files stored on your device that help a website remember information about your visit." }),
        /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("h2", { children: "2. Cookies we use" }),
        /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("p", { children: "Lotus Hub currently sets only a strictly necessary session cookie (httpOnly, not readable by scripts) to keep you signed in while you use the service. We do not currently use analytics, advertising or social tracking cookies." }),
        /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("h2", { children: "3. Managing cookies" }),
        /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("p", { children: "You can clear or block cookies through your browser settings. Blocking cookies may prevent you from staying signed in, which can affect how the platform functions." }),
        /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("h2", { children: "4. Future changes" }),
        /* @__PURE__ */ (0, import_jsx_runtime42.jsx)("p", { children: "If we ever add other cookies (for example analytics), we will update this page to describe them clearly before enabling them." })
      ]
    }
  );
}
var import_jsx_runtime42;
var init_Cookies = __esm({
  "src/pages/public/Cookies.tsx"() {
    init_StaticPage();
    init_usePageMeta();
    import_jsx_runtime42 = require("react/jsx-runtime");
  }
});

// src/utils/redirect.ts
function resolveReturnTo(from, fallback = "/") {
  if (typeof from !== "string") return fallback;
  if (!from.startsWith("/")) return fallback;
  if (from.startsWith("//")) return fallback;
  if (from.startsWith("/\\")) return fallback;
  if (/[\r\n]/.test(from)) return fallback;
  return from;
}
var init_redirect = __esm({
  "src/utils/redirect.ts"() {
  }
});

// src/pages/auth/Login.tsx
function Login() {
  usePageMeta("Sign in", "Sign in to your Lotus Hub account.");
  const { login: login2 } = useAuth();
  const navigate = (0, import_react_router_dom28.useNavigate)();
  const location = (0, import_react_router_dom28.useLocation)();
  const from = resolveReturnTo(location.state?.from);
  const [username, setUsername] = (0, import_react16.useState)("");
  const [password, setPassword] = (0, import_react16.useState)("");
  const [showPassword, setShowPassword] = (0, import_react16.useState)(false);
  const [loading, setLoading] = (0, import_react16.useState)(false);
  const [error, setError] = (0, import_react16.useState)(null);
  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login2(username.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      if (err instanceof AuthApiError) {
        if (err.status === 429) {
          setError(
            `Too many sign-in attempts. Please try again in a moment${err.retryAfterSeconds ? ` (${err.retryAfterSeconds}s)` : ""}.`
          );
        } else {
          setError(err.message);
        }
      } else {
        setError("Unable to sign in. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime43.jsxs)("div", { className: "auth-card", children: [
    /* @__PURE__ */ (0, import_jsx_runtime43.jsx)("h1", { className: "auth-card__title", children: "Welcome back" }),
    /* @__PURE__ */ (0, import_jsx_runtime43.jsx)("p", { className: "auth-card__subtitle", children: "Sign in to your Lotus Hub account." }),
    /* @__PURE__ */ (0, import_jsx_runtime43.jsxs)("form", { onSubmit, "aria-label": "Sign in", noValidate: true, children: [
      /* @__PURE__ */ (0, import_jsx_runtime43.jsxs)("div", { className: "field", children: [
        /* @__PURE__ */ (0, import_jsx_runtime43.jsx)("label", { className: "field__label", htmlFor: "login-username", children: "Username" }),
        /* @__PURE__ */ (0, import_jsx_runtime43.jsx)(
          "input",
          {
            id: "login-username",
            className: "input",
            autoComplete: "username",
            placeholder: "Enter your username",
            value: username,
            onChange: (e) => setUsername(e.target.value),
            required: true,
            disabled: loading
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime43.jsxs)("div", { className: "field", children: [
        /* @__PURE__ */ (0, import_jsx_runtime43.jsx)("label", { className: "field__label", htmlFor: "login-password", children: "Password" }),
        /* @__PURE__ */ (0, import_jsx_runtime43.jsxs)("div", { className: "password-field", children: [
          /* @__PURE__ */ (0, import_jsx_runtime43.jsx)(
            "input",
            {
              id: "login-password",
              type: showPassword ? "text" : "password",
              className: "input password-field__input",
              autoComplete: "current-password",
              placeholder: "Enter your password",
              value: password,
              onChange: (e) => setPassword(e.target.value),
              required: true,
              disabled: loading
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime43.jsx)(
            "button",
            {
              type: "button",
              className: "password-field__toggle",
              onClick: () => setShowPassword((v) => !v),
              "aria-pressed": showPassword,
              "aria-label": showPassword ? "Hide password" : "Show password",
              children: showPassword ? "Hide" : "Show"
            }
          )
        ] })
      ] }),
      error && /* @__PURE__ */ (0, import_jsx_runtime43.jsx)("div", { className: "form-error", role: "alert", children: error }),
      /* @__PURE__ */ (0, import_jsx_runtime43.jsx)(
        "button",
        {
          type: "submit",
          className: "btn btn-primary btn-block btn-lg",
          disabled: loading,
          children: loading ? "Signing in\u2026" : "Sign in"
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime43.jsx)("div", { className: "auth-card__foot", children: /* @__PURE__ */ (0, import_jsx_runtime43.jsxs)("p", { children: [
      "Don\u2019t have an account? ",
      /* @__PURE__ */ (0, import_jsx_runtime43.jsx)(import_react_router_dom28.Link, { to: "/register", state: { from }, children: "Create one" })
    ] }) })
  ] });
}
var import_react16, import_react_router_dom28, import_jsx_runtime43;
var init_Login = __esm({
  "src/pages/auth/Login.tsx"() {
    import_react16 = require("react");
    import_react_router_dom28 = require("react-router-dom");
    init_AuthContext();
    init_auth();
    init_usePageMeta();
    init_redirect();
    import_jsx_runtime43 = require("react/jsx-runtime");
  }
});

// src/components/auth/TelegramLoginWidget.tsx
function TelegramLoginWidget({ onAuth }) {
  const containerRef = (0, import_react17.useRef)(null);
  const onAuthRef = (0, import_react17.useRef)(onAuth);
  onAuthRef.current = onAuth;
  (0, import_react17.useEffect)(() => {
    const container = containerRef.current;
    if (!container) return;
    window.onLotusTelegramAuth = (rawUser) => {
      onAuthRef.current(rawUser);
    };
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute("data-telegram-login", TELEGRAM_BOT_USERNAME);
    script.setAttribute("data-size", "large");
    script.setAttribute("data-radius", "8");
    script.setAttribute("data-onauth", "window.onLotusTelegramAuth(user)");
    container.appendChild(script);
    return () => {
      script.remove();
      delete window.onLotusTelegramAuth;
    };
  }, []);
  if (!TELEGRAM_BOT_USERNAME) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime44.jsx)("div", { ref: containerRef, className: "telegram-widget", "aria-label": "Telegram login" });
}
var import_react17, import_jsx_runtime44;
var init_TelegramLoginWidget = __esm({
  "src/components/auth/TelegramLoginWidget.tsx"() {
    import_react17 = require("react");
    init_env();
    import_jsx_runtime44 = require("react/jsx-runtime");
  }
});

// src/pages/auth/Register.tsx
function randomSimulatedId() {
  return 1e8 + Math.floor(Math.random() * 899999999);
}
function Register() {
  usePageMeta("Create account", "Join Lotus Hub with Telegram verification.");
  const { beginRegistration, completeRegistration } = useAuth();
  const navigate = (0, import_react_router_dom29.useNavigate)();
  const location = (0, import_react_router_dom29.useLocation)();
  const from = resolveReturnTo(location.state?.from);
  const [step, setStep] = (0, import_react18.useState)("telegram");
  const [telegram, setTelegram] = (0, import_react18.useState)(null);
  const [verifying, setVerifying] = (0, import_react18.useState)(false);
  const [telegramError, setTelegramError] = (0, import_react18.useState)(null);
  const [alreadyRegistered, setAlreadyRegistered] = (0, import_react18.useState)(false);
  const [simId, setSimId] = (0, import_react18.useState)(() => String(randomSimulatedId()));
  const [simUsername, setSimUsername] = (0, import_react18.useState)("");
  const [username, setUsername] = (0, import_react18.useState)("");
  const [password, setPassword] = (0, import_react18.useState)("");
  const [confirm, setConfirm] = (0, import_react18.useState)("");
  const [showPassword, setShowPassword] = (0, import_react18.useState)(false);
  const [submitting, setSubmitting] = (0, import_react18.useState)(false);
  const [credError, setCredError] = (0, import_react18.useState)(null);
  const [fieldErrors, setFieldErrors] = (0, import_react18.useState)({});
  const handleTelegramAuth = async (tg) => {
    setVerifying(true);
    setTelegramError(null);
    setAlreadyRegistered(false);
    try {
      const result = await beginRegistration({
        id: tg.id,
        username: tg.username,
        hash: tg.hash,
        first_name: tg.first_name,
        last_name: tg.last_name,
        auth_date: tg.auth_date
      });
      setTelegram(tg);
      if (result.available) {
        setStep("credentials");
      } else {
        setAlreadyRegistered(true);
      }
    } catch (err) {
      setTelegramError(
        err instanceof AuthApiError ? err.message : "Could not verify your Telegram identity. Please try again."
      );
    } finally {
      setVerifying(false);
    }
  };
  const handleSimulated = async () => {
    const id = Number(simId.trim());
    if (!Number.isInteger(id) || id <= 0) {
      setTelegramError("Please enter a valid simulated Telegram account ID.");
      return;
    }
    await handleTelegramAuth({
      id,
      username: simUsername.trim() || void 0,
      simulated: true
    });
  };
  const validateCredentials = () => {
    const errors = {};
    if (!USERNAME_RE.test(username.trim())) {
      errors.username = "Username must be 3\u201324 characters using letters, numbers, underscores or dots.";
    }
    if (password.length < 8 || password.length > 128) {
      errors.password = "Password must be 8\u2013128 characters.";
    } else if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      errors.password = "Password must include letters and numbers.";
    }
    if (confirm !== password) {
      errors.password = errors.password || "Passwords do not match.";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const onSubmitCredentials = async (e) => {
    e.preventDefault();
    setCredError(null);
    if (!telegram) {
      setCredError("Telegram verification is required. Please go back and verify first.");
      return;
    }
    if (!validateCredentials()) return;
    setSubmitting(true);
    try {
      await completeRegistration(telegram, username.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      if (err instanceof AuthApiError) {
        setCredError(err.message);
      } else {
        setCredError("Unable to create your account. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime45.jsxs)("div", { className: "auth-card", children: [
    /* @__PURE__ */ (0, import_jsx_runtime45.jsx)("h1", { className: "auth-card__title", children: "Create your account" }),
    /* @__PURE__ */ (0, import_jsx_runtime45.jsx)("p", { className: "auth-card__subtitle", children: "Verify your Telegram identity, then choose your Lotus Hub credentials." }),
    /* @__PURE__ */ (0, import_jsx_runtime45.jsxs)("ol", { className: "register-steps", children: [
      /* @__PURE__ */ (0, import_jsx_runtime45.jsxs)("li", { className: step === "telegram" ? "is-active" : "is-done", children: [
        /* @__PURE__ */ (0, import_jsx_runtime45.jsx)("span", { className: "register-steps__num", children: "1" }),
        /* @__PURE__ */ (0, import_jsx_runtime45.jsx)("span", { children: "Verify Telegram" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime45.jsxs)("li", { className: step === "credentials" ? "is-active" : "", children: [
        /* @__PURE__ */ (0, import_jsx_runtime45.jsx)("span", { className: "register-steps__num", children: "2" }),
        /* @__PURE__ */ (0, import_jsx_runtime45.jsx)("span", { children: "Create credentials" })
      ] })
    ] }),
    step === "telegram" ? /* @__PURE__ */ (0, import_jsx_runtime45.jsxs)("div", { className: "register-telegram", children: [
      /* @__PURE__ */ (0, import_jsx_runtime45.jsx)("p", { className: "register-telegram__intro", children: "We verify your Telegram identity to keep the platform free of duplicate accounts. One Telegram account can register a single Lotus Hub account." }),
      /* @__PURE__ */ (0, import_jsx_runtime45.jsxs)("div", { className: "register-telegram__widgets", children: [
        /* @__PURE__ */ (0, import_jsx_runtime45.jsx)(TelegramLoginWidget, { onAuth: handleTelegramAuth }),
        !TELEGRAM_DEV_MODE && !telegram && /* @__PURE__ */ (0, import_jsx_runtime45.jsx)("p", { className: "faint register-telegram__note", children: telegramError ? "" : "Use the official Telegram button above to continue." }),
        TELEGRAM_DEV_MODE && /* @__PURE__ */ (0, import_jsx_runtime45.jsxs)("div", { className: "dev-telegram", children: [
          /* @__PURE__ */ (0, import_jsx_runtime45.jsx)("span", { className: "badge", children: "Development mode" }),
          /* @__PURE__ */ (0, import_jsx_runtime45.jsx)("p", { className: "dev-telegram__hint", children: "No Telegram bot is configured in this environment, so real Telegram verification is unavailable here. Use the simulated identity below to exercise the registration flow." }),
          /* @__PURE__ */ (0, import_jsx_runtime45.jsxs)("div", { className: "field", children: [
            /* @__PURE__ */ (0, import_jsx_runtime45.jsx)("label", { className: "field__label", htmlFor: "sim-id", children: "Simulated Telegram account ID" }),
            /* @__PURE__ */ (0, import_jsx_runtime45.jsx)(
              "input",
              {
                id: "sim-id",
                type: "number",
                className: "input",
                value: simId,
                onChange: (e) => setSimId(e.target.value),
                disabled: verifying
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime45.jsxs)("div", { className: "field", children: [
            /* @__PURE__ */ (0, import_jsx_runtime45.jsx)("label", { className: "field__label", htmlFor: "sim-username", children: "Simulated Telegram username (optional)" }),
            /* @__PURE__ */ (0, import_jsx_runtime45.jsx)(
              "input",
              {
                id: "sim-username",
                className: "input",
                value: simUsername,
                onChange: (e) => setSimUsername(e.target.value),
                disabled: verifying,
                placeholder: "@username"
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime45.jsx)(
            "button",
            {
              type: "button",
              className: "btn btn-secondary btn-block",
              onClick: handleSimulated,
              disabled: verifying,
              children: verifying ? "Verifying\u2026" : "Simulate Telegram verification"
            }
          )
        ] })
      ] }),
      verifying && /* @__PURE__ */ (0, import_jsx_runtime45.jsxs)("div", { className: "register-status", children: [
        /* @__PURE__ */ (0, import_jsx_runtime45.jsx)("span", { className: "loading__spinner", "aria-hidden": "true" }),
        "Verifying your Telegram identity\u2026"
      ] }),
      alreadyRegistered && !verifying && /* @__PURE__ */ (0, import_jsx_runtime45.jsxs)("div", { className: "form-error", role: "alert", children: [
        "This Telegram account is already registered to a Lotus Hub account. You can",
        " ",
        /* @__PURE__ */ (0, import_jsx_runtime45.jsx)(import_react_router_dom29.Link, { to: "/login", state: { from }, children: "log in" }),
        " ",
        "instead."
      ] }),
      telegramError && !verifying && !alreadyRegistered && /* @__PURE__ */ (0, import_jsx_runtime45.jsx)("div", { className: "form-error", role: "alert", children: telegramError })
    ] }) : /* @__PURE__ */ (0, import_jsx_runtime45.jsxs)("form", { onSubmit: onSubmitCredentials, "aria-label": "Create credentials", noValidate: true, children: [
      /* @__PURE__ */ (0, import_jsx_runtime45.jsxs)("div", { className: "field", children: [
        /* @__PURE__ */ (0, import_jsx_runtime45.jsx)("label", { className: "field__label", htmlFor: "reg-username", children: "Username" }),
        /* @__PURE__ */ (0, import_jsx_runtime45.jsx)(
          "input",
          {
            id: "reg-username",
            className: "input",
            autoComplete: "username",
            placeholder: "Pick a username",
            value: username,
            onChange: (e) => setUsername(e.target.value),
            disabled: submitting,
            "aria-invalid": Boolean(fieldErrors.username)
          }
        ),
        fieldErrors.username && /* @__PURE__ */ (0, import_jsx_runtime45.jsx)("span", { className: "field__error", children: fieldErrors.username })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime45.jsxs)("div", { className: "field", children: [
        /* @__PURE__ */ (0, import_jsx_runtime45.jsx)("label", { className: "field__label", htmlFor: "reg-password", children: "Password" }),
        /* @__PURE__ */ (0, import_jsx_runtime45.jsxs)("div", { className: "password-field", children: [
          /* @__PURE__ */ (0, import_jsx_runtime45.jsx)(
            "input",
            {
              id: "reg-password",
              type: showPassword ? "text" : "password",
              className: "input password-field__input",
              autoComplete: "new-password",
              placeholder: "Choose a password",
              value: password,
              onChange: (e) => setPassword(e.target.value),
              disabled: submitting,
              "aria-invalid": Boolean(fieldErrors.password)
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime45.jsx)(
            "button",
            {
              type: "button",
              className: "password-field__toggle",
              onClick: () => setShowPassword((v) => !v),
              "aria-pressed": showPassword,
              "aria-label": showPassword ? "Hide password" : "Show password",
              children: showPassword ? "Hide" : "Show"
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime45.jsx)("span", { className: "field__hint", children: "Use at least 8 characters, including letters and numbers." })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime45.jsxs)("div", { className: "field", children: [
        /* @__PURE__ */ (0, import_jsx_runtime45.jsx)("label", { className: "field__label", htmlFor: "reg-confirm", children: "Confirm password" }),
        /* @__PURE__ */ (0, import_jsx_runtime45.jsx)("div", { className: "password-field", children: /* @__PURE__ */ (0, import_jsx_runtime45.jsx)(
          "input",
          {
            id: "reg-confirm",
            type: showPassword ? "text" : "password",
            className: "input password-field__input",
            autoComplete: "new-password",
            placeholder: "Re-enter your password",
            value: confirm,
            onChange: (e) => setConfirm(e.target.value),
            disabled: submitting,
            "aria-invalid": Boolean(fieldErrors.password)
          }
        ) }),
        fieldErrors.password && /* @__PURE__ */ (0, import_jsx_runtime45.jsx)("span", { className: "field__error", children: fieldErrors.password })
      ] }),
      credError && /* @__PURE__ */ (0, import_jsx_runtime45.jsx)("div", { className: "form-error", role: "alert", children: credError }),
      /* @__PURE__ */ (0, import_jsx_runtime45.jsx)(
        "button",
        {
          type: "submit",
          className: "btn btn-primary btn-block btn-lg",
          disabled: submitting,
          children: submitting ? "Creating account\u2026" : "Create account"
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime45.jsx)("div", { className: "auth-card__foot", children: /* @__PURE__ */ (0, import_jsx_runtime45.jsxs)("p", { children: [
        "Already verified?",
        " ",
        /* @__PURE__ */ (0, import_jsx_runtime45.jsx)(
          "button",
          {
            type: "button",
            className: "link-button",
            onClick: () => setStep("telegram"),
            children: "Back to Telegram verification"
          }
        )
      ] }) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime45.jsx)("div", { className: "auth-card__foot", children: /* @__PURE__ */ (0, import_jsx_runtime45.jsxs)("p", { children: [
      "Already have an account?",
      " ",
      /* @__PURE__ */ (0, import_jsx_runtime45.jsx)(import_react_router_dom29.Link, { to: "/login", state: { from }, children: "Sign in" })
    ] }) })
  ] });
}
var import_react18, import_react_router_dom29, import_jsx_runtime45, USERNAME_RE;
var init_Register = __esm({
  "src/pages/auth/Register.tsx"() {
    import_react18 = require("react");
    import_react_router_dom29 = require("react-router-dom");
    init_AuthContext();
    init_auth();
    init_TelegramLoginWidget();
    init_env();
    init_usePageMeta();
    init_redirect();
    import_jsx_runtime45 = require("react/jsx-runtime");
    USERNAME_RE = /^[A-Za-z0-9_.]{3,24}$/;
  }
});

// src/pages/errors/Error401.tsx
function Error401() {
  usePageMeta("Sign In Required", "You need to be logged in to access this page.");
  return /* @__PURE__ */ (0, import_jsx_runtime46.jsx)(PageContainer, { as: "main", className: "error-page", children: /* @__PURE__ */ (0, import_jsx_runtime46.jsxs)("div", { className: "error-page__card", children: [
    /* @__PURE__ */ (0, import_jsx_runtime46.jsx)(LotusMark, { className: "error-page__mark" }),
    /* @__PURE__ */ (0, import_jsx_runtime46.jsx)("span", { className: "error-page__code", children: "401" }),
    /* @__PURE__ */ (0, import_jsx_runtime46.jsx)("h1", { className: "error-page__title", children: "Sign In Required" }),
    /* @__PURE__ */ (0, import_jsx_runtime46.jsx)("p", { className: "error-page__message", children: "You need to be logged in to access this page. Sign in to your account to continue, or create a new one." }),
    /* @__PURE__ */ (0, import_jsx_runtime46.jsxs)("div", { className: "error-page__actions", children: [
      /* @__PURE__ */ (0, import_jsx_runtime46.jsx)(import_react_router_dom30.Link, { to: "/login", className: "btn btn-primary btn-lg", children: "Login" }),
      /* @__PURE__ */ (0, import_jsx_runtime46.jsx)(import_react_router_dom30.Link, { to: "/register", className: "btn btn-secondary btn-lg", children: "Register" }),
      /* @__PURE__ */ (0, import_jsx_runtime46.jsx)(import_react_router_dom30.Link, { to: "/", className: "btn btn-ghost btn-lg", children: "Home" })
    ] })
  ] }) });
}
var import_react_router_dom30, import_jsx_runtime46;
var init_Error401 = __esm({
  "src/pages/errors/Error401.tsx"() {
    import_react_router_dom30 = require("react-router-dom");
    init_PageContainer();
    init_LotusLogo();
    init_usePageMeta();
    import_jsx_runtime46 = require("react/jsx-runtime");
  }
});

// src/pages/errors/ErrorPage.tsx
function ErrorPage({
  code,
  title,
  message,
  detail,
  showRetry = false,
  showHome = true
}) {
  usePageMeta(title, message);
  return /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(PageContainer, { as: "main", className: "error-page", children: /* @__PURE__ */ (0, import_jsx_runtime47.jsxs)("div", { className: "error-page__card", children: [
    /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(LotusMark, { className: "error-page__mark" }),
    /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("span", { className: "error-page__code", children: code }),
    /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("h1", { className: "error-page__title", children: title }),
    /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("p", { className: "error-page__message", children: message }),
    detail && /* @__PURE__ */ (0, import_jsx_runtime47.jsx)("p", { className: "error-page__detail", children: detail }),
    /* @__PURE__ */ (0, import_jsx_runtime47.jsxs)("div", { className: "error-page__actions", children: [
      showRetry && /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(
        "button",
        {
          type: "button",
          className: "btn btn-secondary",
          onClick: () => window.location.reload(),
          children: "Retry"
        }
      ),
      showHome && /* @__PURE__ */ (0, import_jsx_runtime47.jsx)(import_react_router_dom31.Link, { to: "/", className: "btn btn-primary", children: "Home" })
    ] })
  ] }) });
}
var import_react_router_dom31, import_jsx_runtime47;
var init_ErrorPage = __esm({
  "src/pages/errors/ErrorPage.tsx"() {
    import_react_router_dom31 = require("react-router-dom");
    init_LotusLogo();
    init_PageContainer();
    init_usePageMeta();
    import_jsx_runtime47 = require("react/jsx-runtime");
  }
});

// src/pages/errors/Error404.tsx
function Error404() {
  return /* @__PURE__ */ (0, import_jsx_runtime48.jsx)(
    ErrorPage,
    {
      code: "404",
      title: "Page not found",
      message: "The page you\u2019re looking for doesn\u2019t exist, or it may have moved. Check the address and try again.",
      showRetry: false,
      showHome: true
    }
  );
}
var import_jsx_runtime48;
var init_Error404 = __esm({
  "src/pages/errors/Error404.tsx"() {
    init_ErrorPage();
    import_jsx_runtime48 = require("react/jsx-runtime");
  }
});

// src/pages/errors/Error429.tsx
function Error429() {
  return /* @__PURE__ */ (0, import_jsx_runtime49.jsx)(
    ErrorPage,
    {
      code: "429",
      title: "Too many requests",
      message: "You\u2019ve made too many requests in a short time. Please wait a moment before trying again.",
      showRetry: true,
      showHome: true
    }
  );
}
var import_jsx_runtime49;
var init_Error429 = __esm({
  "src/pages/errors/Error429.tsx"() {
    init_ErrorPage();
    import_jsx_runtime49 = require("react/jsx-runtime");
  }
});

// src/pages/errors/Error500.tsx
function Error500() {
  return /* @__PURE__ */ (0, import_jsx_runtime50.jsx)(
    ErrorPage,
    {
      code: "500",
      title: "Something went wrong",
      message: "An unexpected error occurred on our side. Please try again in a moment.",
      showRetry: true,
      showHome: true
    }
  );
}
var import_jsx_runtime50;
var init_Error500 = __esm({
  "src/pages/errors/Error500.tsx"() {
    init_ErrorPage();
    import_jsx_runtime50 = require("react/jsx-runtime");
  }
});

// src/pages/errors/Error502.tsx
function Error502() {
  return /* @__PURE__ */ (0, import_jsx_runtime51.jsx)(
    ErrorPage,
    {
      code: "502",
      title: "Service temporarily unavailable",
      message: "We\u2019re having a brief connectivity issue with our service. Please try again shortly.",
      showRetry: true,
      showHome: true
    }
  );
}
var import_jsx_runtime51;
var init_Error502 = __esm({
  "src/pages/errors/Error502.tsx"() {
    init_ErrorPage();
    import_jsx_runtime51 = require("react/jsx-runtime");
  }
});

// src/pages/errors/Error503.tsx
function Error503() {
  return /* @__PURE__ */ (0, import_jsx_runtime52.jsx)(
    ErrorPage,
    {
      code: "503",
      title: "Service under maintenance",
      message: "Lotus Hub is undergoing scheduled maintenance. We\u2019ll be back shortly \u2014 thank you for your patience.",
      showRetry: true,
      showHome: true
    }
  );
}
var import_jsx_runtime52;
var init_Error503 = __esm({
  "src/pages/errors/Error503.tsx"() {
    init_ErrorPage();
    import_jsx_runtime52 = require("react/jsx-runtime");
  }
});

// src/pages/errors/Offline.tsx
function Offline() {
  return /* @__PURE__ */ (0, import_jsx_runtime53.jsx)(
    ErrorPage,
    {
      code: "Offline",
      title: "No internet connection",
      message: "It looks like you\u2019re offline. Check your connection and try again.",
      showRetry: true,
      showHome: true
    }
  );
}
var import_jsx_runtime53;
var init_Offline = __esm({
  "src/pages/errors/Offline.tsx"() {
    init_ErrorPage();
    import_jsx_runtime53 = require("react/jsx-runtime");
  }
});

// src/pages/errors/SessionExpired.tsx
function SessionExpired() {
  usePageMeta("Session Expired", "Your session has ended. Please sign in again.");
  return /* @__PURE__ */ (0, import_jsx_runtime54.jsx)(PageContainer, { as: "main", className: "error-page", children: /* @__PURE__ */ (0, import_jsx_runtime54.jsxs)("div", { className: "error-page__card", children: [
    /* @__PURE__ */ (0, import_jsx_runtime54.jsx)(LotusMark, { className: "error-page__mark" }),
    /* @__PURE__ */ (0, import_jsx_runtime54.jsx)("span", { className: "error-page__code", children: "Session Expired" }),
    /* @__PURE__ */ (0, import_jsx_runtime54.jsx)("h1", { className: "error-page__title", children: "Your session has expired" }),
    /* @__PURE__ */ (0, import_jsx_runtime54.jsx)("p", { className: "error-page__message", children: "Please log in again to continue." }),
    /* @__PURE__ */ (0, import_jsx_runtime54.jsxs)("div", { className: "error-page__actions", children: [
      /* @__PURE__ */ (0, import_jsx_runtime54.jsx)(import_react_router_dom32.Link, { to: "/login", className: "btn btn-primary btn-lg", children: "Login" }),
      /* @__PURE__ */ (0, import_jsx_runtime54.jsx)(import_react_router_dom32.Link, { to: "/", className: "btn btn-secondary btn-lg", children: "Home" })
    ] })
  ] }) });
}
var import_react_router_dom32, import_jsx_runtime54;
var init_SessionExpired = __esm({
  "src/pages/errors/SessionExpired.tsx"() {
    import_react_router_dom32 = require("react-router-dom");
    init_PageContainer();
    init_LotusLogo();
    init_usePageMeta();
    import_jsx_runtime54 = require("react/jsx-runtime");
  }
});

// src/hooks/useApi.ts
function useApi(loader, deps = []) {
  const [state, setState] = (0, import_react19.useState)(idle3);
  const loaderRef = (0, import_react19.useRef)(loader);
  loaderRef.current = loader;
  const mountedRef = (0, import_react19.useRef)(true);
  const seqRef = (0, import_react19.useRef)(0);
  const run = (0, import_react19.useCallback)(async () => {
    const seq = ++seqRef.current;
    setState((s) => ({ ...s, status: "loading" }));
    try {
      const data = await loaderRef.current();
      if (mountedRef.current && seq === seqRef.current) {
        setState({ status: "success", data, error: null, isUnauthenticated: false });
      }
    } catch (err) {
      if (mountedRef.current && seq === seqRef.current) {
        const status = typeof err?.status === "number" ? err.status : 0;
        setState({
          status: "error",
          data: null,
          error: err instanceof Error ? err.message : "Something went wrong. Please try again.",
          isUnauthenticated: status === 401
        });
      }
    }
  }, []);
  (0, import_react19.useEffect)(() => {
    mountedRef.current = true;
    run();
    return () => {
      mountedRef.current = false;
      seqRef.current += 1;
    };
  }, deps);
  const retry = (0, import_react19.useCallback)(() => run(), [run]);
  return { ...state, retry };
}
var import_react19, idle3;
var init_useApi = __esm({
  "src/hooks/useApi.ts"() {
    import_react19 = require("react");
    idle3 = { status: "loading", data: null, error: null, isUnauthenticated: false };
  }
});

// src/services/admin.ts
async function request3(method, path, body) {
  let res;
  try {
    res = await fetch(`${BASE3}${path}`, {
      method,
      credentials: "same-origin",
      headers: body !== void 0 ? { "Content-Type": "application/json" } : void 0,
      body: body !== void 0 ? JSON.stringify(body) : void 0
    });
  } catch {
    throw new AdminApiError("Cannot reach the service right now. Please try again.", 0);
  }
  if (!res.ok) {
    let payload = null;
    try {
      payload = await res.json();
    } catch {
    }
    const message = payload?.message || (res.status === 403 ? "Access denied." : res.status === 401 ? "Your session has ended. Please sign in again." : "Something went wrong. Please try again.");
    throw new AdminApiError(message, res.status, payload?.error);
  }
  return await res.json();
}
function getJson2(path) {
  return request3("GET", path);
}
function fetchOverview() {
  return getJson2("/api/admin/overview");
}
function fetchUsers(q = "") {
  const qs = q ? `?q=${encodeURIComponent(q)}` : "";
  return getJson2(`/api/admin/users${qs}`);
}
function fetchUserDetail(lotusHubId) {
  return getJson2(`/api/admin/users/lotus/${encodeURIComponent(lotusHubId)}`);
}
function setUserStatus(systemUserId, status) {
  return request3("POST", "/api/admin/users/status", { systemUserId, status });
}
function topUpTokens(payload) {
  return request3("POST", "/api/admin/topup", payload);
}
function fetchAdminFiles(params = {}) {
  const search = new URLSearchParams();
  if (params.q) search.set("q", params.q);
  if (params.published !== void 0 && params.published !== null) {
    search.set("published", String(params.published));
  }
  const qs = search.toString();
  return getJson2(`/api/admin/files${qs ? `?${qs}` : ""}`);
}
function fetchAdminFileDetail(id) {
  return getJson2(`/api/admin/files/${encodeURIComponent(id)}`);
}
function createAdminFile(data) {
  return request3("POST", "/api/admin/files", data);
}
function updateAdminFile(id, data) {
  return request3("PUT", `/api/admin/files/${encodeURIComponent(id)}`, data);
}
function setFilePublished(id, published) {
  return request3("POST", `/api/admin/files/${encodeURIComponent(id)}`, { published });
}
function fetchCategories() {
  return getJson2("/api/admin/categories");
}
function createCategory(name) {
  return request3("POST", "/api/admin/categories", { name });
}
function updateCategory(id, data) {
  return request3("PUT", `/api/admin/categories/${encodeURIComponent(id)}`, data);
}
function fetchAudit(params = {}) {
  const search = new URLSearchParams();
  if (params.action) search.set("action", params.action);
  if (params.limit) search.set("limit", String(params.limit));
  const qs = search.toString();
  return getJson2(`/api/admin/audit${qs ? `?${qs}` : ""}`);
}
var BASE3, AdminApiError;
var init_admin = __esm({
  "src/services/admin.ts"() {
    init_env();
    BASE3 = API_BASE_URL;
    AdminApiError = class extends Error {
      status;
      code;
      constructor(message, status, code) {
        super(message);
        this.name = "AdminApiError";
        this.status = status;
        this.code = code;
      }
    };
  }
});

// src/pages/admin/AdminOverview.tsx
var AdminOverview_exports = {};
__export(AdminOverview_exports, {
  default: () => AdminOverview
});
function AdminOverview() {
  const state = useApi(() => fetchOverview(), []);
  usePageMeta("Dashboard \xB7 Super Admin", "Lotus Hub super admin overview.");
  return /* @__PURE__ */ (0, import_jsx_runtime55.jsxs)(import_jsx_runtime55.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime55.jsxs)("header", { className: "admin-head", children: [
      /* @__PURE__ */ (0, import_jsx_runtime55.jsx)("h1", { children: "Dashboard" }),
      /* @__PURE__ */ (0, import_jsx_runtime55.jsx)("p", { children: "Overview of the Lotus Hub platform. All figures are computed live from platform data." })
    ] }),
    state.status === "loading" && /* @__PURE__ */ (0, import_jsx_runtime55.jsx)("div", { style: { padding: 16 }, children: /* @__PURE__ */ (0, import_jsx_runtime55.jsx)(Loading, { label: "Loading overview\u2026" }) }),
    state.status === "error" && /* @__PURE__ */ (0, import_jsx_runtime55.jsx)(
      ErrorState,
      {
        title: "Couldn\u2019t load the dashboard",
        message: state.error ?? "Something went wrong.",
        action: state.isUnauthenticated ? /* @__PURE__ */ (0, import_jsx_runtime55.jsx)(import_react_router_dom33.Link, { to: "/login", className: "btn btn-primary", children: "Sign in" }) : /* @__PURE__ */ (0, import_jsx_runtime55.jsx)("button", { type: "button", className: "btn btn-secondary", onClick: state.retry, children: "Retry" })
      }
    ),
    state.status === "success" && state.data && /* @__PURE__ */ (0, import_jsx_runtime55.jsxs)(import_jsx_runtime55.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime55.jsx)("div", { className: "admin-stats", children: STATS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime55.jsxs)("div", { className: "stat-card", children: [
        /* @__PURE__ */ (0, import_jsx_runtime55.jsx)("div", { className: "stat-card__label", children: s.label }),
        /* @__PURE__ */ (0, import_jsx_runtime55.jsx)("div", { className: "stat-card__value", children: state.data[s.key].toLocaleString() })
      ] }, s.key)) }),
      /* @__PURE__ */ (0, import_jsx_runtime55.jsxs)("div", { className: "admin-panel", children: [
        /* @__PURE__ */ (0, import_jsx_runtime55.jsx)("h2", { className: "admin-panel__title", children: "Quick actions" }),
        /* @__PURE__ */ (0, import_jsx_runtime55.jsx)("p", { className: "admin-panel__desc", children: "Manage content, users and token balances." }),
        /* @__PURE__ */ (0, import_jsx_runtime55.jsxs)("div", { className: "admin-module-grid", children: [
          /* @__PURE__ */ (0, import_jsx_runtime55.jsxs)(import_react_router_dom33.Link, { to: "/Admin/admin/files", className: "admin-module", children: [
            /* @__PURE__ */ (0, import_jsx_runtime55.jsx)("span", { className: "admin-module__label", children: "Files" }),
            /* @__PURE__ */ (0, import_jsx_runtime55.jsx)("span", { className: "admin-module__status", children: "Manage & publish content" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime55.jsxs)(import_react_router_dom33.Link, { to: "/Admin/admin/categories", className: "admin-module", children: [
            /* @__PURE__ */ (0, import_jsx_runtime55.jsx)("span", { className: "admin-module__label", children: "Categories" }),
            /* @__PURE__ */ (0, import_jsx_runtime55.jsx)("span", { className: "admin-module__status", children: "Organize content" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime55.jsxs)(import_react_router_dom33.Link, { to: "/Admin/admin/users", className: "admin-module", children: [
            /* @__PURE__ */ (0, import_jsx_runtime55.jsx)("span", { className: "admin-module__label", children: "Users" }),
            /* @__PURE__ */ (0, import_jsx_runtime55.jsx)("span", { className: "admin-module__status", children: "Search & manage accounts" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime55.jsxs)(import_react_router_dom33.Link, { to: "/Admin/admin/topups", className: "admin-module", children: [
            /* @__PURE__ */ (0, import_jsx_runtime55.jsx)("span", { className: "admin-module__label", children: "Token Top-ups" }),
            /* @__PURE__ */ (0, import_jsx_runtime55.jsx)("span", { className: "admin-module__status", children: "Add tokens after payment" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime55.jsxs)(import_react_router_dom33.Link, { to: "/Admin/admin/audit", className: "admin-module", children: [
            /* @__PURE__ */ (0, import_jsx_runtime55.jsx)("span", { className: "admin-module__label", children: "Audit Logs" }),
            /* @__PURE__ */ (0, import_jsx_runtime55.jsx)("span", { className: "admin-module__status", children: "Review admin actions" })
          ] })
        ] })
      ] })
    ] })
  ] });
}
var import_react_router_dom33, import_jsx_runtime55, STATS;
var init_AdminOverview = __esm({
  "src/pages/admin/AdminOverview.tsx"() {
    import_react_router_dom33 = require("react-router-dom");
    init_Loading();
    init_ErrorState();
    init_useApi();
    init_usePageMeta();
    init_admin();
    import_jsx_runtime55 = require("react/jsx-runtime");
    STATS = [
      { key: "totalUsers", label: "Total users" },
      { key: "activeUsers", label: "Active users" },
      { key: "totalPublishedFiles", label: "Published files" },
      { key: "totalFiles", label: "Total files" },
      { key: "totalDownloadAuthorizations", label: "Download authorizations" },
      { key: "totalCategories", label: "Categories" },
      { key: "activeTokenBalance", label: "Active token balance" },
      { key: "tokensAdded", label: "Tokens added" },
      { key: "tokensConsumed", label: "Tokens consumed" }
    ];
  }
});

// src/pages/admin/AdminFiles.tsx
var AdminFiles_exports = {};
__export(AdminFiles_exports, {
  default: () => AdminFiles
});
function AdminFiles() {
  const [q, setQ] = (0, import_react20.useState)("");
  const [query, setQuery] = (0, import_react20.useState)("");
  const [pub, setPub] = (0, import_react20.useState)("all");
  const list = useApi(
    () => fetchAdminFiles({
      q: query,
      published: pub === "all" ? null : pub === "published"
    }),
    [query, pub]
  );
  const [editor, setEditor] = (0, import_react20.useState)(null);
  usePageMeta("Files \xB7 Super Admin", "Manage Lotus Hub content files.");
  const refresh = () => list.retry();
  const search = (e) => {
    e.preventDefault();
    setQuery(q.trim());
  };
  const togglePublish = async (f) => {
    try {
      await setFilePublished(f.id, !f.published);
      refresh();
    } catch {
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime56.jsxs)(import_jsx_runtime56.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime56.jsxs)("header", { className: "admin-head", children: [
      /* @__PURE__ */ (0, import_jsx_runtime56.jsx)("h1", { children: "Files" }),
      /* @__PURE__ */ (0, import_jsx_runtime56.jsx)("p", { children: "Manage content metadata and availability. Lotus Hub does not host the large files \u2014 it manages metadata and protected access information for files stored externally." })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime56.jsxs)("div", { className: "admin-toolbar", children: [
      /* @__PURE__ */ (0, import_jsx_runtime56.jsxs)("form", { className: "admin-search", onSubmit: search, role: "search", children: [
        /* @__PURE__ */ (0, import_jsx_runtime56.jsx)(
          "input",
          {
            className: "input",
            value: q,
            onChange: (e) => setQ(e.target.value),
            placeholder: "Search files by title, category or provider\u2026",
            "aria-label": "Search files"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime56.jsx)("button", { type: "submit", className: "btn btn-primary", children: "Search" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime56.jsx)("div", { className: "admin-filter", children: ["all", "published", "unpublished"].map((p) => /* @__PURE__ */ (0, import_jsx_runtime56.jsx)(
        "button",
        {
          type: "button",
          className: pub === p ? "chip is-active" : "chip",
          onClick: () => setPub(p),
          children: p === "all" ? "All" : p === "published" ? "Published" : "Unpublished"
        },
        p
      )) }),
      /* @__PURE__ */ (0, import_jsx_runtime56.jsx)(Button, { onClick: () => setEditor({ mode: "create" }), children: "New file" })
    ] }),
    list.status === "loading" && /* @__PURE__ */ (0, import_jsx_runtime56.jsx)("div", { style: { padding: 16 }, children: /* @__PURE__ */ (0, import_jsx_runtime56.jsx)(Loading, { label: "Loading files\u2026" }) }),
    list.status === "error" && /* @__PURE__ */ (0, import_jsx_runtime56.jsx)(ErrorState, { title: "Couldn\u2019t load files", message: list.error ?? "", action: /* @__PURE__ */ (0, import_jsx_runtime56.jsx)("button", { type: "button", className: "btn btn-secondary", onClick: list.retry, children: "Retry" }) }),
    list.status === "success" && (list.data.items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime56.jsx)(EmptyState, { title: "No files found", message: "Try adjusting your search or filters." }) : /* @__PURE__ */ (0, import_jsx_runtime56.jsx)("div", { className: "admin-panel", style: { marginTop: 0 }, children: /* @__PURE__ */ (0, import_jsx_runtime56.jsxs)("table", { className: "admin-table", children: [
      /* @__PURE__ */ (0, import_jsx_runtime56.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime56.jsxs)("tr", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime56.jsx)("th", { children: "Title" }),
        /* @__PURE__ */ (0, import_jsx_runtime56.jsx)("th", { children: "Type" }),
        /* @__PURE__ */ (0, import_jsx_runtime56.jsx)("th", { children: "Category" }),
        /* @__PURE__ */ (0, import_jsx_runtime56.jsx)("th", { children: "Size" }),
        /* @__PURE__ */ (0, import_jsx_runtime56.jsx)("th", { children: "Status" }),
        /* @__PURE__ */ (0, import_jsx_runtime56.jsx)("th", { children: "Actions" })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime56.jsx)("tbody", { children: list.data.items.map((f) => /* @__PURE__ */ (0, import_jsx_runtime56.jsxs)("tr", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime56.jsxs)("td", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime56.jsx)("strong", { children: f.title }),
          /* @__PURE__ */ (0, import_jsx_runtime56.jsx)("div", { className: "admin-sub", children: f.id })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime56.jsx)("td", { children: TYPE_LABEL[f.type] ?? f.type }),
        /* @__PURE__ */ (0, import_jsx_runtime56.jsx)("td", { children: f.category }),
        /* @__PURE__ */ (0, import_jsx_runtime56.jsx)("td", { children: formatBytes(f.fileSize) }),
        /* @__PURE__ */ (0, import_jsx_runtime56.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime56.jsx)("span", { className: f.published ? "status-badge" : "status-badge is-off", children: f.published ? "published" : "unpublished" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime56.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime56.jsxs)("div", { className: "admin-row-actions", children: [
          /* @__PURE__ */ (0, import_jsx_runtime56.jsx)(Button, { size: "sm", variant: "ghost", onClick: () => setEditor({ mode: "edit", id: f.id }), children: "Edit" }),
          /* @__PURE__ */ (0, import_jsx_runtime56.jsx)(Button, { size: "sm", variant: "secondary", onClick: () => togglePublish(f), children: f.published ? "Unpublish" : "Publish" })
        ] }) })
      ] }, f.id)) })
    ] }) })),
    editor && /* @__PURE__ */ (0, import_jsx_runtime56.jsx)(
      FileEditor,
      {
        mode: editor.mode,
        fileId: editor.id,
        onDone: () => {
          setEditor(null);
          refresh();
        },
        onCancel: () => setEditor(null)
      }
    )
  ] });
}
function FileEditor({
  mode,
  fileId,
  onDone,
  onCancel
}) {
  const [form, setForm] = (0, import_react20.useState)({
    title: "",
    description: "",
    type: "video",
    category: "Films",
    thumbnailUrl: "",
    tags: "",
    fileSize: "",
    provider: "Lotus Originals",
    duration: "",
    rating: "PG",
    featured: false,
    published: true,
    // Sensitive — never prefilled on edit.
    archivePassword: "",
    providerDestination: "",
    fileName: ""
  });
  const [loading, setLoading] = (0, import_react20.useState)(mode === "edit");
  const [saving, setSaving] = (0, import_react20.useState)(false);
  const [error, setError] = (0, import_react20.useState)(null);
  const cats = useApi(() => fetchCategories(), []);
  (0, import_react20.useEffect)(() => {
    if (mode === "edit" && fileId) {
      setLoading(true);
      fetchAdminFileDetail(fileId).then((d) => {
        setForm({
          title: d.title,
          description: d.description,
          type: d.type,
          category: d.category,
          thumbnailUrl: d.thumbnailUrl ?? "",
          tags: d.tags.join(", "),
          fileSize: String(d.fileSize),
          provider: d.provider,
          duration: d.duration,
          rating: d.rating,
          featured: d.featured,
          published: d.published,
          archivePassword: "",
          providerDestination: "",
          fileName: d.fileName
        });
        setError(null);
      }).catch((err) => setError(err instanceof AdminApiError ? err.message : "Could not load the file.")).finally(() => setLoading(false));
    }
  }, [mode, fileId]);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const payload = {
      title: form.title,
      description: form.description,
      type: form.type,
      category: form.category,
      thumbnailUrl: form.thumbnailUrl,
      tags: form.tags.split(",").map((s) => s.trim()).filter(Boolean),
      fileSize: Number(form.fileSize) || 0,
      provider: form.provider,
      duration: form.duration,
      rating: form.rating,
      featured: form.featured,
      published: form.published,
      archivePassword: form.archivePassword || void 0,
      providerDestination: form.providerDestination || void 0,
      fileName: form.fileName || void 0
    };
    try {
      if (mode === "create") await createAdminFile(payload);
      else if (fileId) await updateAdminFile(fileId, payload);
      onDone();
    } catch (err) {
      setError(err instanceof AdminApiError ? err.message : "Could not save the file.");
    } finally {
      setSaving(false);
    }
  };
  const activeCategories = (cats.data?.categories ?? []).filter((c) => c.active);
  return /* @__PURE__ */ (0, import_jsx_runtime56.jsx)(
    Modal,
    {
      open: true,
      onClose: onCancel,
      title: mode === "create" ? "New file" : "Edit file",
      size: "lg",
      children: loading ? /* @__PURE__ */ (0, import_jsx_runtime56.jsx)(Loading, { label: "Loading file\u2026" }) : /* @__PURE__ */ (0, import_jsx_runtime56.jsxs)("form", { onSubmit: save, className: "file-form", children: [
        /* @__PURE__ */ (0, import_jsx_runtime56.jsxs)("div", { className: "field", children: [
          /* @__PURE__ */ (0, import_jsx_runtime56.jsx)("label", { className: "field__label", htmlFor: "title", children: "Title *" }),
          /* @__PURE__ */ (0, import_jsx_runtime56.jsx)("input", { id: "title", className: "input", required: true, value: form.title, onChange: (e) => set("title", e.target.value) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime56.jsxs)("div", { className: "field", children: [
          /* @__PURE__ */ (0, import_jsx_runtime56.jsx)("label", { className: "field__label", htmlFor: "desc", children: "Description" }),
          /* @__PURE__ */ (0, import_jsx_runtime56.jsx)("textarea", { id: "desc", className: "textarea", rows: 3, value: form.description, onChange: (e) => set("description", e.target.value) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime56.jsxs)("div", { className: "file-form__row", children: [
          /* @__PURE__ */ (0, import_jsx_runtime56.jsxs)("div", { className: "field", children: [
            /* @__PURE__ */ (0, import_jsx_runtime56.jsx)("label", { className: "field__label", htmlFor: "type", children: "Type" }),
            /* @__PURE__ */ (0, import_jsx_runtime56.jsx)("select", { id: "type", className: "select", value: form.type, onChange: (e) => set("type", e.target.value), children: CONTENT_TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime56.jsx)("option", { value: t, children: TYPE_LABEL[t] }, t)) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime56.jsxs)("div", { className: "field", children: [
            /* @__PURE__ */ (0, import_jsx_runtime56.jsx)("label", { className: "field__label", htmlFor: "cat", children: "Category" }),
            /* @__PURE__ */ (0, import_jsx_runtime56.jsx)("select", { id: "cat", className: "select", value: form.category, onChange: (e) => set("category", e.target.value), children: activeCategories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime56.jsx)("option", { value: c.name, children: c.name }, c.id)) })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime56.jsxs)("div", { className: "file-form__row", children: [
          /* @__PURE__ */ (0, import_jsx_runtime56.jsxs)("div", { className: "field", children: [
            /* @__PURE__ */ (0, import_jsx_runtime56.jsx)("label", { className: "field__label", htmlFor: "size", children: "File size (bytes)" }),
            /* @__PURE__ */ (0, import_jsx_runtime56.jsx)("input", { id: "size", className: "input", type: "number", min: 0, value: form.fileSize, onChange: (e) => set("fileSize", e.target.value) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime56.jsxs)("div", { className: "field", children: [
            /* @__PURE__ */ (0, import_jsx_runtime56.jsx)("label", { className: "field__label", htmlFor: "provider", children: "Provider" }),
            /* @__PURE__ */ (0, import_jsx_runtime56.jsx)("input", { id: "provider", className: "input", value: form.provider, onChange: (e) => set("provider", e.target.value) })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime56.jsxs)("div", { className: "field", children: [
          /* @__PURE__ */ (0, import_jsx_runtime56.jsx)("label", { className: "field__label", htmlFor: "thumb", children: "Thumbnail URL" }),
          /* @__PURE__ */ (0, import_jsx_runtime56.jsx)("input", { id: "thumb", className: "input", value: form.thumbnailUrl, onChange: (e) => set("thumbnailUrl", e.target.value), placeholder: "https://\u2026 (optional)" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime56.jsxs)("div", { className: "field", children: [
          /* @__PURE__ */ (0, import_jsx_runtime56.jsx)("label", { className: "field__label", htmlFor: "tags", children: "Tags" }),
          /* @__PURE__ */ (0, import_jsx_runtime56.jsx)("input", { id: "tags", className: "input", value: form.tags, onChange: (e) => set("tags", e.target.value), placeholder: "comma, separated" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime56.jsxs)("div", { className: "file-form__row", children: [
          /* @__PURE__ */ (0, import_jsx_runtime56.jsxs)("div", { className: "field", children: [
            /* @__PURE__ */ (0, import_jsx_runtime56.jsx)("label", { className: "field__label", htmlFor: "dur", children: "Duration" }),
            /* @__PURE__ */ (0, import_jsx_runtime56.jsx)("input", { id: "dur", className: "input", value: form.duration, onChange: (e) => set("duration", e.target.value), placeholder: "e.g. 1h 45m" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime56.jsxs)("div", { className: "field", children: [
            /* @__PURE__ */ (0, import_jsx_runtime56.jsx)("label", { className: "field__label", htmlFor: "rate", children: "Rating" }),
            /* @__PURE__ */ (0, import_jsx_runtime56.jsx)("input", { id: "rate", className: "input", value: form.rating, onChange: (e) => set("rating", e.target.value) })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime56.jsxs)("div", { className: "file-form__secure", children: [
          /* @__PURE__ */ (0, import_jsx_runtime56.jsx)("h3", { children: "Protected access info" }),
          /* @__PURE__ */ (0, import_jsx_runtime56.jsx)("p", { children: "Stored encrypted/private and never exposed to users before authorization." }),
          /* @__PURE__ */ (0, import_jsx_runtime56.jsxs)("div", { className: "file-form__row", children: [
            /* @__PURE__ */ (0, import_jsx_runtime56.jsxs)("div", { className: "field", children: [
              /* @__PURE__ */ (0, import_jsx_runtime56.jsxs)("label", { className: "field__label", htmlFor: "pw", children: [
                "Archive password ",
                mode === "edit" && "(leave blank to keep)"
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime56.jsx)("input", { id: "pw", className: "input", value: form.archivePassword, onChange: (e) => set("archivePassword", e.target.value) })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime56.jsxs)("div", { className: "field", children: [
              /* @__PURE__ */ (0, import_jsx_runtime56.jsxs)("label", { className: "field__label", htmlFor: "dest", children: [
                "Provider download destination ",
                mode === "edit" && "(leave blank to keep)"
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime56.jsx)("input", { id: "dest", className: "input", value: form.providerDestination, onChange: (e) => set("providerDestination", e.target.value) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime56.jsxs)("div", { className: "checkbox-row", children: [
          /* @__PURE__ */ (0, import_jsx_runtime56.jsx)("input", { id: "featured", type: "checkbox", checked: form.featured, onChange: (e) => set("featured", e.target.checked) }),
          /* @__PURE__ */ (0, import_jsx_runtime56.jsx)("label", { htmlFor: "featured", children: "Featured" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime56.jsxs)("div", { className: "checkbox-row", children: [
          /* @__PURE__ */ (0, import_jsx_runtime56.jsx)("input", { id: "published", type: "checkbox", checked: form.published, onChange: (e) => set("published", e.target.checked) }),
          /* @__PURE__ */ (0, import_jsx_runtime56.jsx)("label", { htmlFor: "published", children: "Published (visible to users)" })
        ] }),
        error && /* @__PURE__ */ (0, import_jsx_runtime56.jsx)("p", { className: "form-error", children: error }),
        /* @__PURE__ */ (0, import_jsx_runtime56.jsxs)("div", { className: "admin-actions", children: [
          /* @__PURE__ */ (0, import_jsx_runtime56.jsx)(Button, { type: "submit", disabled: saving, children: saving ? "Saving\u2026" : mode === "create" ? "Create file" : "Save changes" }),
          /* @__PURE__ */ (0, import_jsx_runtime56.jsx)(Button, { type: "button", variant: "ghost", onClick: onCancel, children: "Cancel" })
        ] })
      ] })
    }
  );
}
var import_react20, import_jsx_runtime56;
var init_AdminFiles = __esm({
  "src/pages/admin/AdminFiles.tsx"() {
    import_react20 = require("react");
    init_Loading();
    init_ErrorState();
    init_EmptyState();
    init_Modal();
    init_Button();
    init_useApi();
    init_usePageMeta();
    init_content();
    init_admin();
    init_format();
    import_jsx_runtime56 = require("react/jsx-runtime");
  }
});

// src/pages/admin/AdminCategories.tsx
var AdminCategories_exports = {};
__export(AdminCategories_exports, {
  default: () => AdminCategories
});
function AdminCategories() {
  const list = useApi(() => fetchCategories(), []);
  const [creating, setCreating] = (0, import_react21.useState)(false);
  const [newName, setNewName] = (0, import_react21.useState)("");
  const [editing, setEditing] = (0, import_react21.useState)(null);
  const [editName, setEditName] = (0, import_react21.useState)("");
  const [busy, setBusy] = (0, import_react21.useState)(false);
  const [error, setError] = (0, import_react21.useState)(null);
  usePageMeta("Categories \xB7 Super Admin", "Manage Lotus Hub content categories.");
  const doCreate = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await createCategory(newName);
      setNewName("");
      setCreating(false);
      list.retry();
    } catch (err) {
      setError(err instanceof AdminApiError ? err.message : "Could not create the category.");
    } finally {
      setBusy(false);
    }
  };
  const toggleActive = async (c) => {
    setBusy(true);
    setError(null);
    try {
      await updateCategory(c.id, { active: !c.active });
      list.retry();
    } catch (err) {
      setError(err instanceof AdminApiError ? err.message : "Could not update the category.");
    } finally {
      setBusy(false);
    }
  };
  const saveEdit = async (e) => {
    e.preventDefault();
    if (!editing) return;
    setBusy(true);
    setError(null);
    try {
      await updateCategory(editing.id, { name: editName });
      setEditing(null);
      list.retry();
    } catch (err) {
      setError(err instanceof AdminApiError ? err.message : "Could not update the category.");
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime57.jsxs)(import_jsx_runtime57.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime57.jsxs)("header", { className: "admin-head", children: [
      /* @__PURE__ */ (0, import_jsx_runtime57.jsx)("h1", { children: "Categories" }),
      /* @__PURE__ */ (0, import_jsx_runtime57.jsx)("p", { children: "Organize content. Disabling a category hides it from browsing but never touches the files assigned to it." })
    ] }),
    error && /* @__PURE__ */ (0, import_jsx_runtime57.jsx)("p", { className: "form-error", children: error }),
    /* @__PURE__ */ (0, import_jsx_runtime57.jsx)("div", { className: "admin-toolbar", style: { justifyContent: "flex-start" }, children: /* @__PURE__ */ (0, import_jsx_runtime57.jsx)(Button, { onClick: () => {
      setCreating(true);
      setNewName("");
      setError(null);
    }, children: "New category" }) }),
    list.status === "loading" && /* @__PURE__ */ (0, import_jsx_runtime57.jsx)("div", { style: { padding: 16 }, children: /* @__PURE__ */ (0, import_jsx_runtime57.jsx)(Loading, { label: "Loading categories\u2026" }) }),
    list.status === "error" && /* @__PURE__ */ (0, import_jsx_runtime57.jsx)(ErrorState, { title: "Couldn\u2019t load categories", message: list.error ?? "", action: /* @__PURE__ */ (0, import_jsx_runtime57.jsx)("button", { type: "button", className: "btn btn-secondary", onClick: list.retry, children: "Retry" }) }),
    list.status === "success" && (list.data.categories.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime57.jsx)(EmptyState, { title: "No categories yet", message: "Create one to start organizing content." }) : /* @__PURE__ */ (0, import_jsx_runtime57.jsx)("div", { className: "admin-panel", style: { marginTop: 0 }, children: /* @__PURE__ */ (0, import_jsx_runtime57.jsxs)("table", { className: "admin-table", children: [
      /* @__PURE__ */ (0, import_jsx_runtime57.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime57.jsxs)("tr", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime57.jsx)("th", { children: "Name" }),
        /* @__PURE__ */ (0, import_jsx_runtime57.jsx)("th", { children: "Files" }),
        /* @__PURE__ */ (0, import_jsx_runtime57.jsx)("th", { children: "Status" }),
        /* @__PURE__ */ (0, import_jsx_runtime57.jsx)("th", { children: "Created" }),
        /* @__PURE__ */ (0, import_jsx_runtime57.jsx)("th", { children: "Actions" })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime57.jsx)("tbody", { children: list.data.categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime57.jsxs)("tr", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime57.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime57.jsx)("strong", { children: c.name }) }),
        /* @__PURE__ */ (0, import_jsx_runtime57.jsx)("td", { children: c.fileCount }),
        /* @__PURE__ */ (0, import_jsx_runtime57.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime57.jsx)("span", { className: c.active ? "status-badge" : "status-badge is-off", children: c.active ? "active" : "disabled" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime57.jsx)("td", { children: formatDate(c.createdAt) }),
        /* @__PURE__ */ (0, import_jsx_runtime57.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime57.jsxs)("div", { className: "admin-row-actions", children: [
          /* @__PURE__ */ (0, import_jsx_runtime57.jsx)(Button, { size: "sm", variant: "ghost", onClick: () => {
            setEditing(c);
            setEditName(c.name);
            setError(null);
          }, children: "Rename" }),
          /* @__PURE__ */ (0, import_jsx_runtime57.jsx)(Button, { size: "sm", variant: "secondary", onClick: () => toggleActive(c), children: c.active ? "Disable" : "Enable" })
        ] }) })
      ] }, c.id)) })
    ] }) })),
    /* @__PURE__ */ (0, import_jsx_runtime57.jsx)(Modal, { open: creating, onClose: () => setCreating(false), title: "New category", children: /* @__PURE__ */ (0, import_jsx_runtime57.jsxs)("form", { onSubmit: doCreate, className: "modal-block", children: [
      /* @__PURE__ */ (0, import_jsx_runtime57.jsxs)("div", { className: "field", children: [
        /* @__PURE__ */ (0, import_jsx_runtime57.jsx)("label", { className: "field__label", htmlFor: "catname", children: "Category name" }),
        /* @__PURE__ */ (0, import_jsx_runtime57.jsx)("input", { id: "catname", className: "input", value: newName, onChange: (e) => setNewName(e.target.value), required: true, autoFocus: true })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime57.jsxs)("div", { className: "admin-actions", children: [
        /* @__PURE__ */ (0, import_jsx_runtime57.jsx)(Button, { type: "submit", disabled: busy || !newName.trim(), children: busy ? "Creating\u2026" : "Create category" }),
        /* @__PURE__ */ (0, import_jsx_runtime57.jsx)(Button, { type: "button", variant: "ghost", onClick: () => setCreating(false), children: "Cancel" })
      ] })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime57.jsx)(Modal, { open: !!editing, onClose: () => setEditing(null), title: "Rename category", children: editing && /* @__PURE__ */ (0, import_jsx_runtime57.jsxs)("form", { onSubmit: saveEdit, className: "modal-block", children: [
      /* @__PURE__ */ (0, import_jsx_runtime57.jsx)("p", { className: "muted", children: "Renaming updates the category on every file that uses it." }),
      /* @__PURE__ */ (0, import_jsx_runtime57.jsxs)("div", { className: "field", children: [
        /* @__PURE__ */ (0, import_jsx_runtime57.jsx)("label", { className: "field__label", htmlFor: "editname", children: "Category name" }),
        /* @__PURE__ */ (0, import_jsx_runtime57.jsx)("input", { id: "editname", className: "input", value: editName, onChange: (e) => setEditName(e.target.value), required: true, autoFocus: true })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime57.jsxs)("div", { className: "admin-actions", children: [
        /* @__PURE__ */ (0, import_jsx_runtime57.jsx)(Button, { type: "submit", disabled: busy || !editName.trim(), children: busy ? "Saving\u2026" : "Save" }),
        /* @__PURE__ */ (0, import_jsx_runtime57.jsx)(Button, { type: "button", variant: "ghost", onClick: () => setEditing(null), children: "Cancel" })
      ] })
    ] }) })
  ] });
}
var import_react21, import_jsx_runtime57;
var init_AdminCategories = __esm({
  "src/pages/admin/AdminCategories.tsx"() {
    import_react21 = require("react");
    init_Loading();
    init_ErrorState();
    init_EmptyState();
    init_Modal();
    init_Button();
    init_useApi();
    init_usePageMeta();
    init_admin();
    init_format();
    import_jsx_runtime57 = require("react/jsx-runtime");
  }
});

// src/pages/admin/AdminUsers.tsx
var AdminUsers_exports = {};
__export(AdminUsers_exports, {
  default: () => AdminUsers
});
function AdminUsers() {
  const [q, setQ] = (0, import_react22.useState)("");
  const [query, setQuery] = (0, import_react22.useState)("");
  const list = useApi(() => fetchUsers(query), [query]);
  const [selected, setSelected] = (0, import_react22.useState)(null);
  const [detailOpen, setDetailOpen] = (0, import_react22.useState)(false);
  const [detailLoading, setDetailLoading] = (0, import_react22.useState)(false);
  const [detailError, setDetailError] = (0, import_react22.useState)(null);
  const [confirmOpen, setConfirmOpen] = (0, import_react22.useState)(false);
  const [busy, setBusy] = (0, import_react22.useState)(false);
  const [feedback, setFeedback] = (0, import_react22.useState)(null);
  usePageMeta("Users \xB7 Super Admin", "Search and manage Lotus Hub user accounts.");
  const openUser = async (u) => {
    setDetailOpen(true);
    setDetailLoading(true);
    setDetailError(null);
    try {
      const d = await fetchUserDetail(u.lotusHubId);
      setSelected(d);
    } catch (err) {
      setDetailError(err instanceof AdminApiError ? err.message : "Could not load the user.");
    } finally {
      setDetailLoading(false);
    }
  };
  const applyStatus = async () => {
    if (!selected) return;
    const next = selected.accountStatus === "disabled" ? "active" : "disabled";
    setBusy(true);
    setFeedback(null);
    try {
      await setUserStatus(selected.systemUserId, next);
      setSelected({ ...selected, accountStatus: next });
      setFeedback(
        next === "disabled" ? `${selected.username} has been disabled and signed out.` : `${selected.username} has been re-enabled.`
      );
      setConfirmOpen(false);
      list.retry();
    } catch (err) {
      setFeedback(err instanceof AdminApiError ? err.message : "Could not update the account.");
    } finally {
      setBusy(false);
    }
  };
  const search = (e) => {
    e.preventDefault();
    setQuery(q.trim());
  };
  return /* @__PURE__ */ (0, import_jsx_runtime58.jsxs)(import_jsx_runtime58.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime58.jsxs)("header", { className: "admin-head", children: [
      /* @__PURE__ */ (0, import_jsx_runtime58.jsx)("h1", { children: "Users" }),
      /* @__PURE__ */ (0, import_jsx_runtime58.jsx)("p", { children: "Search by Lotus Hub ID (recommended) or username. The Lotus Hub ID is the exact identifier users share when purchasing tokens." })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime58.jsxs)("form", { className: "admin-search", onSubmit: search, role: "search", children: [
      /* @__PURE__ */ (0, import_jsx_runtime58.jsx)(
        "input",
        {
          className: "input",
          value: q,
          onChange: (e) => setQ(e.target.value),
          placeholder: "Search by Lotus Hub ID or username\u2026",
          "aria-label": "Search users"
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime58.jsx)("button", { type: "submit", className: "btn btn-primary", children: "Search" })
    ] }),
    list.status === "loading" && /* @__PURE__ */ (0, import_jsx_runtime58.jsx)("div", { style: { padding: 16 }, children: /* @__PURE__ */ (0, import_jsx_runtime58.jsx)(Loading, { label: "Loading users\u2026" }) }),
    list.status === "error" && /* @__PURE__ */ (0, import_jsx_runtime58.jsx)(ErrorState, { title: "Couldn\u2019t load users", message: list.error ?? "", action: /* @__PURE__ */ (0, import_jsx_runtime58.jsx)("button", { type: "button", className: "btn btn-secondary", onClick: list.retry, children: "Retry" }) }),
    list.status === "success" && (list.data.users.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime58.jsx)(
      EmptyState,
      {
        title: "No users found",
        message: query ? "Try another Lotus Hub ID or username." : "No user accounts yet."
      }
    ) : /* @__PURE__ */ (0, import_jsx_runtime58.jsx)("div", { className: "admin-panel", style: { marginTop: 0 }, children: /* @__PURE__ */ (0, import_jsx_runtime58.jsxs)("table", { className: "admin-table", children: [
      /* @__PURE__ */ (0, import_jsx_runtime58.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime58.jsxs)("tr", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime58.jsx)("th", { children: "Lotus Hub ID" }),
        /* @__PURE__ */ (0, import_jsx_runtime58.jsx)("th", { children: "Username" }),
        /* @__PURE__ */ (0, import_jsx_runtime58.jsx)("th", { children: "Status" }),
        /* @__PURE__ */ (0, import_jsx_runtime58.jsx)("th", { children: "Joined" })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime58.jsx)("tbody", { children: list.data.users.map((u) => /* @__PURE__ */ (0, import_jsx_runtime58.jsxs)("tr", { className: "admin-row-click", onClick: () => openUser(u), children: [
        /* @__PURE__ */ (0, import_jsx_runtime58.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime58.jsx)("strong", { className: "mono", children: u.lotusHubId }) }),
        /* @__PURE__ */ (0, import_jsx_runtime58.jsx)("td", { children: u.username }),
        /* @__PURE__ */ (0, import_jsx_runtime58.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime58.jsx)("span", { className: u.accountStatus === "disabled" ? "status-badge is-off" : "status-badge", children: u.accountStatus }) }),
        /* @__PURE__ */ (0, import_jsx_runtime58.jsx)("td", { children: formatDate(u.createdAt) })
      ] }, u.systemUserId)) })
    ] }) })),
    /* @__PURE__ */ (0, import_jsx_runtime58.jsx)(Modal, { open: detailOpen, onClose: () => setDetailOpen(false), title: "User details", children: detailLoading ? /* @__PURE__ */ (0, import_jsx_runtime58.jsx)(Loading, { label: "Loading user\u2026" }) : detailError ? /* @__PURE__ */ (0, import_jsx_runtime58.jsx)(ErrorState, { title: "Couldn\u2019t load the user", message: detailError }) : selected ? /* @__PURE__ */ (0, import_jsx_runtime58.jsxs)("div", { className: "modal-block", children: [
      /* @__PURE__ */ (0, import_jsx_runtime58.jsxs)("dl", { className: "admin-detail", children: [
        /* @__PURE__ */ (0, import_jsx_runtime58.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime58.jsx)("dt", { children: "Username" }),
          /* @__PURE__ */ (0, import_jsx_runtime58.jsx)("dd", { children: selected.username })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime58.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime58.jsx)("dt", { children: "Lotus Hub ID" }),
          /* @__PURE__ */ (0, import_jsx_runtime58.jsx)("dd", { className: "mono", children: selected.lotusHubId })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime58.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime58.jsx)("dt", { children: "Joined" }),
          /* @__PURE__ */ (0, import_jsx_runtime58.jsx)("dd", { children: formatDate(selected.createdAt) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime58.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime58.jsx)("dt", { children: "Status" }),
          /* @__PURE__ */ (0, import_jsx_runtime58.jsx)("dd", { children: /* @__PURE__ */ (0, import_jsx_runtime58.jsx)("span", { className: selected.accountStatus === "disabled" ? "status-badge is-off" : "status-badge", children: selected.accountStatus }) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime58.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime58.jsx)("dt", { children: "Free downloads remaining today" }),
          /* @__PURE__ */ (0, import_jsx_runtime58.jsxs)("dd", { children: [
            selected.freeDownloadsToday.remaining,
            " / ",
            selected.freeDownloadsToday.perDay
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime58.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime58.jsx)("dt", { children: "Valid token balance" }),
          /* @__PURE__ */ (0, import_jsx_runtime58.jsx)("dd", { children: selected.tokenBalance.toLocaleString() })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime58.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime58.jsx)("dt", { children: "Next token expiry" }),
          /* @__PURE__ */ (0, import_jsx_runtime58.jsx)("dd", { children: selected.nextTokenExpiryAt ? formatDate(selected.nextTokenExpiryAt) : "\u2014" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime58.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime58.jsx)("dt", { children: "Download authorizations" }),
          /* @__PURE__ */ (0, import_jsx_runtime58.jsx)("dd", { children: selected.downloadAuthorizations })
        ] })
      ] }),
      feedback && /* @__PURE__ */ (0, import_jsx_runtime58.jsx)("p", { className: "form-error", children: feedback }),
      /* @__PURE__ */ (0, import_jsx_runtime58.jsxs)("div", { className: "admin-actions", children: [
        /* @__PURE__ */ (0, import_jsx_runtime58.jsx)(
          Button,
          {
            variant: selected.accountStatus === "disabled" ? "primary" : "danger",
            onClick: () => setConfirmOpen(true),
            children: selected.accountStatus === "disabled" ? "Enable account" : "Disable account"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime58.jsx)(Button, { variant: "ghost", onClick: () => setDetailOpen(false), children: "Close" })
      ] })
    ] }) : null }),
    /* @__PURE__ */ (0, import_jsx_runtime58.jsx)(
      Modal,
      {
        open: confirmOpen,
        onClose: () => setConfirmOpen(false),
        title: selected?.accountStatus === "disabled" ? "Enable account" : "Disable account",
        children: /* @__PURE__ */ (0, import_jsx_runtime58.jsxs)("div", { className: "modal-block", children: [
          /* @__PURE__ */ (0, import_jsx_runtime58.jsx)("p", { children: selected?.accountStatus === "disabled" ? `Re-enable @${selected?.username}? They will regain access immediately.` : `Disable @${selected?.username} (Lotus Hub ID ${selected?.lotusHubId})? They will be signed out and blocked from protected content.` }),
          /* @__PURE__ */ (0, import_jsx_runtime58.jsxs)("div", { className: "admin-actions", children: [
            /* @__PURE__ */ (0, import_jsx_runtime58.jsx)(Button, { variant: selected?.accountStatus === "disabled" ? "primary" : "danger", onClick: applyStatus, disabled: busy, children: busy ? "Saving\u2026" : "Confirm" }),
            /* @__PURE__ */ (0, import_jsx_runtime58.jsx)(Button, { variant: "ghost", onClick: () => setConfirmOpen(false), children: "Cancel" })
          ] })
        ] })
      }
    )
  ] });
}
var import_react22, import_jsx_runtime58;
var init_AdminUsers = __esm({
  "src/pages/admin/AdminUsers.tsx"() {
    import_react22 = require("react");
    init_Loading();
    init_ErrorState();
    init_EmptyState();
    init_Modal();
    init_Button();
    init_useApi();
    init_usePageMeta();
    init_admin();
    init_format();
    import_jsx_runtime58 = require("react/jsx-runtime");
  }
});

// src/pages/admin/AdminTopups.tsx
var AdminTopups_exports = {};
__export(AdminTopups_exports, {
  default: () => AdminTopups
});
function AdminTopups() {
  const [q, setQ] = (0, import_react23.useState)("");
  const [query, setQuery] = (0, import_react23.useState)("");
  const found = useApi(() => fetchUsers(query), [query]);
  const [selected, setSelected] = (0, import_react23.useState)(null);
  const [opKey, setOpKey] = (0, import_react23.useState)("");
  const [amount, setAmount] = (0, import_react23.useState)("10");
  const [note, setNote] = (0, import_react23.useState)("");
  const [busy, setBusy] = (0, import_react23.useState)(false);
  const [result, setResult] = (0, import_react23.useState)(null);
  const [error, setError] = (0, import_react23.useState)(null);
  usePageMeta("Token Top-ups \xB7 Super Admin", "Add purchased tokens to user accounts.");
  const search = (e) => {
    e.preventDefault();
    setQuery(q.trim());
    setSelected(null);
    setResult(null);
    setError(null);
  };
  const chooseUser = (u) => {
    setSelected(u);
    setOpKey(`topup-${u.systemUserId}-${Date.now()}`);
    setResult(null);
    setError(null);
  };
  const confirmTopUp = async () => {
    if (!selected) return;
    setBusy(true);
    setError(null);
    try {
      const r = await topUpTokens({
        lotusHubId: selected.lotusHubId,
        amount: Number(amount),
        note,
        opKey
      });
      setResult(r);
      setOpKey(`topup-${selected.systemUserId}-${Date.now()}`);
    } catch (err) {
      setError(err instanceof AdminApiError ? err.message : "Could not add tokens.");
    } finally {
      setBusy(false);
    }
  };
  const expiryText = result ? formatDate(result.expiresAt) : null;
  const validityDays = 14;
  return /* @__PURE__ */ (0, import_jsx_runtime59.jsxs)(import_jsx_runtime59.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime59.jsxs)("header", { className: "admin-head", children: [
      /* @__PURE__ */ (0, import_jsx_runtime59.jsx)("h1", { children: "Token Top-ups" }),
      /* @__PURE__ */ (0, import_jsx_runtime59.jsxs)("p", { children: [
        "After confirming a payment externally, add the purchased tokens here. Each top-up creates a separate token batch that expires automatically after ",
        validityDays,
        " days."
      ] })
    ] }),
    !selected ? /* @__PURE__ */ (0, import_jsx_runtime59.jsxs)(import_jsx_runtime59.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime59.jsxs)("form", { className: "admin-search", onSubmit: search, role: "search", children: [
        /* @__PURE__ */ (0, import_jsx_runtime59.jsx)(
          "input",
          {
            className: "input",
            value: q,
            onChange: (e) => setQ(e.target.value),
            placeholder: "Search by Lotus Hub ID (recommended) or username\u2026",
            "aria-label": "Find user for top-up"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime59.jsx)("button", { type: "submit", className: "btn btn-primary", children: "Search" })
      ] }),
      found.status === "loading" && /* @__PURE__ */ (0, import_jsx_runtime59.jsx)("div", { style: { padding: 16 }, children: /* @__PURE__ */ (0, import_jsx_runtime59.jsx)(Loading, { label: "Searching\u2026" }) }),
      found.status === "error" && /* @__PURE__ */ (0, import_jsx_runtime59.jsx)(ErrorState, { title: "Search failed", message: found.error ?? "", action: /* @__PURE__ */ (0, import_jsx_runtime59.jsx)("button", { type: "button", className: "btn btn-secondary", onClick: found.retry, children: "Retry" }) }),
      found.status === "success" && (found.data.users.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime59.jsx)(
        EmptyState,
        {
          title: "No matching user",
          message: "Verify the Lotus Hub ID. Usernames can look similar, so the numeric ID is the reliable identifier."
        }
      ) : /* @__PURE__ */ (0, import_jsx_runtime59.jsx)("div", { className: "admin-panel", style: { marginTop: 0 }, children: /* @__PURE__ */ (0, import_jsx_runtime59.jsxs)("table", { className: "admin-table", children: [
        /* @__PURE__ */ (0, import_jsx_runtime59.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime59.jsxs)("tr", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime59.jsx)("th", { children: "Lotus Hub ID" }),
          /* @__PURE__ */ (0, import_jsx_runtime59.jsx)("th", { children: "Username" }),
          /* @__PURE__ */ (0, import_jsx_runtime59.jsx)("th", { children: "Status" })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime59.jsx)("tbody", { children: found.data.users.map((u) => /* @__PURE__ */ (0, import_jsx_runtime59.jsxs)("tr", { className: "admin-row-click", onClick: () => chooseUser(u), children: [
          /* @__PURE__ */ (0, import_jsx_runtime59.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime59.jsx)("strong", { className: "mono", children: u.lotusHubId }) }),
          /* @__PURE__ */ (0, import_jsx_runtime59.jsx)("td", { children: u.username }),
          /* @__PURE__ */ (0, import_jsx_runtime59.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime59.jsx)("span", { className: u.accountStatus === "disabled" ? "status-badge is-off" : "status-badge", children: u.accountStatus }) })
        ] }, u.systemUserId)) })
      ] }) }))
    ] }) : /* @__PURE__ */ (0, import_jsx_runtime59.jsxs)("div", { className: "admin-panel", style: { maxWidth: 640 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime59.jsx)("h2", { className: "admin-panel__title", children: "Confirm top-up" }),
      /* @__PURE__ */ (0, import_jsx_runtime59.jsxs)("dl", { className: "admin-detail", children: [
        /* @__PURE__ */ (0, import_jsx_runtime59.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime59.jsx)("dt", { children: "User" }),
          /* @__PURE__ */ (0, import_jsx_runtime59.jsx)("dd", { children: selected.username })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime59.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime59.jsx)("dt", { children: "Lotus Hub ID" }),
          /* @__PURE__ */ (0, import_jsx_runtime59.jsx)("dd", { className: "mono", children: selected.lotusHubId })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime59.jsxs)("div", { className: "field", children: [
        /* @__PURE__ */ (0, import_jsx_runtime59.jsx)("label", { className: "field__label", htmlFor: "amount", children: "Tokens to add" }),
        /* @__PURE__ */ (0, import_jsx_runtime59.jsx)(
          "input",
          {
            id: "amount",
            className: "input",
            type: "number",
            min: 1,
            step: 1,
            value: amount,
            onChange: (e) => setAmount(e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime59.jsxs)("div", { className: "field", children: [
        /* @__PURE__ */ (0, import_jsx_runtime59.jsx)("label", { className: "field__label", htmlFor: "note", children: "Note (optional)" }),
        /* @__PURE__ */ (0, import_jsx_runtime59.jsx)(
          "input",
          {
            id: "note",
            className: "input",
            value: note,
            onChange: (e) => setNote(e.target.value),
            placeholder: "e.g. Payment #1234 confirmed"
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime59.jsx)("dl", { className: "admin-detail", children: /* @__PURE__ */ (0, import_jsx_runtime59.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime59.jsx)("dt", { children: "Expiry" }),
        /* @__PURE__ */ (0, import_jsx_runtime59.jsxs)("dd", { children: [
          "Automatically calculated \xB7 ",
          validityDays,
          " days from top-up"
        ] })
      ] }) }),
      result && expiryText && /* @__PURE__ */ (0, import_jsx_runtime59.jsxs)("p", { className: "admin-success", children: [
        "\u2713 Added ",
        result.amount.toLocaleString(),
        " tokens to ",
        selected.username,
        ". Batch expires ",
        expiryText,
        ". An audit entry was created."
      ] }),
      error && /* @__PURE__ */ (0, import_jsx_runtime59.jsx)("p", { className: "form-error", children: error }),
      /* @__PURE__ */ (0, import_jsx_runtime59.jsxs)("div", { className: "admin-actions", children: [
        /* @__PURE__ */ (0, import_jsx_runtime59.jsx)(Button, { onClick: confirmTopUp, disabled: busy || !amount || Number(amount) <= 0, children: busy ? "Adding tokens\u2026" : result ? "Add another top-up" : "Confirm top-up" }),
        /* @__PURE__ */ (0, import_jsx_runtime59.jsx)(Button, { variant: "ghost", onClick: () => {
          setSelected(null);
          setResult(null);
          setError(null);
        }, children: "Cancel" })
      ] })
    ] })
  ] });
}
var import_react23, import_jsx_runtime59;
var init_AdminTopups = __esm({
  "src/pages/admin/AdminTopups.tsx"() {
    import_react23 = require("react");
    init_Loading();
    init_ErrorState();
    init_EmptyState();
    init_Button();
    init_useApi();
    init_usePageMeta();
    init_admin();
    init_format();
    import_jsx_runtime59 = require("react/jsx-runtime");
  }
});

// src/pages/admin/AdminAudit.tsx
var AdminAudit_exports = {};
__export(AdminAudit_exports, {
  default: () => AdminAudit
});
function describe(e) {
  switch (e.action) {
    case "token_topup": {
      const a = Number(e.detail.amount ?? 0);
      return `${a.toLocaleString()} tokens \xB7 expiry ${e.detail.expiresAt ? new Date(Number(e.detail.expiresAt)).toLocaleDateString() : "n/a"}`;
    }
    case "file_edited": {
      const s = e.detail.changedSensitive;
      const parts = (s ?? []).map((x) => x === "archive_password" ? "archive password" : "provider destination");
      return parts.length ? `Sensitive fields changed: ${parts.join(", ")}` : "Metadata updated";
    }
    default:
      return "";
  }
}
function AdminAudit() {
  const [action, setAction] = (0, import_react24.useState)("all");
  const list = useApi(
    () => fetchAudit({ action: action === "all" ? "" : action, limit: 100 }),
    [action]
  );
  usePageMeta("Audit Logs \xB7 Super Admin", "Immutable record of admin actions.");
  return /* @__PURE__ */ (0, import_jsx_runtime60.jsxs)(import_jsx_runtime60.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime60.jsxs)("header", { className: "admin-head", children: [
      /* @__PURE__ */ (0, import_jsx_runtime60.jsx)("h1", { children: "Audit Logs" }),
      /* @__PURE__ */ (0, import_jsx_runtime60.jsx)("p", { children: "Append-only record of admin actions. Entries note that sensitive fields changed without exposing their values, and cannot be edited." })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime60.jsx)("div", { className: "admin-toolbar", style: { justifyContent: "flex-start" }, children: /* @__PURE__ */ (0, import_jsx_runtime60.jsx)("div", { className: "admin-filter", children: ACTIONS.map((a) => /* @__PURE__ */ (0, import_jsx_runtime60.jsx)(
      "button",
      {
        type: "button",
        className: action === a ? "chip is-active" : "chip",
        onClick: () => setAction(a),
        children: a === "all" ? "All" : ACTION_LABEL[a]
      },
      a
    )) }) }),
    list.status === "loading" && /* @__PURE__ */ (0, import_jsx_runtime60.jsx)("div", { style: { padding: 16 }, children: /* @__PURE__ */ (0, import_jsx_runtime60.jsx)(Loading, { label: "Loading audit log\u2026" }) }),
    list.status === "error" && /* @__PURE__ */ (0, import_jsx_runtime60.jsx)(ErrorState, { title: "Couldn\u2019t load the audit log", message: list.error ?? "", action: /* @__PURE__ */ (0, import_jsx_runtime60.jsx)("button", { type: "button", className: "btn btn-secondary", onClick: list.retry, children: "Retry" }) }),
    list.status === "success" && (list.data.items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime60.jsx)(EmptyState, { title: "No audit entries", message: "Admin actions will appear here." }) : /* @__PURE__ */ (0, import_jsx_runtime60.jsx)("div", { className: "admin-panel", style: { marginTop: 0 }, children: /* @__PURE__ */ (0, import_jsx_runtime60.jsx)("div", { className: "audit-list", children: list.data.items.map((e) => /* @__PURE__ */ (0, import_jsx_runtime60.jsxs)("div", { className: "audit-item", children: [
      /* @__PURE__ */ (0, import_jsx_runtime60.jsx)("span", { className: `status-badge badge-action badge-${e.action}`, children: ACTION_LABEL[e.action] ?? e.action }),
      /* @__PURE__ */ (0, import_jsx_runtime60.jsxs)("div", { className: "audit-item__body", children: [
        /* @__PURE__ */ (0, import_jsx_runtime60.jsxs)("div", { className: "audit-item__label", children: [
          /* @__PURE__ */ (0, import_jsx_runtime60.jsx)("strong", { children: e.targetLabel }),
          /* @__PURE__ */ (0, import_jsx_runtime60.jsx)("span", { className: "mono muted", children: e.targetId })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime60.jsx)("div", { className: "audit-item__detail", children: describe(e) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime60.jsxs)("div", { className: "audit-item__meta", children: [
        /* @__PURE__ */ (0, import_jsx_runtime60.jsxs)("div", { children: [
          "by ",
          /* @__PURE__ */ (0, import_jsx_runtime60.jsx)("strong", { children: e.actorUsername || "\u2014" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime60.jsx)("div", { className: "muted", children: formatDateTime(e.createdAt) })
      ] })
    ] }, e.id)) }) }))
  ] });
}
var import_react24, import_jsx_runtime60, ACTIONS, ACTION_LABEL;
var init_AdminAudit = __esm({
  "src/pages/admin/AdminAudit.tsx"() {
    import_react24 = require("react");
    init_Loading();
    init_ErrorState();
    init_EmptyState();
    init_useApi();
    init_usePageMeta();
    init_admin();
    init_format();
    import_jsx_runtime60 = require("react/jsx-runtime");
    ACTIONS = [
      "all",
      "token_topup",
      "file_created",
      "file_edited",
      "file_published",
      "file_unpublished",
      "category_created",
      "category_edited",
      "user_disabled",
      "user_enabled"
    ];
    ACTION_LABEL = {
      token_topup: "Token top-up",
      file_created: "File created",
      file_edited: "File edited",
      file_published: "File published",
      file_unpublished: "File unpublished",
      category_created: "Category created",
      category_edited: "Category changed",
      user_disabled: "User disabled",
      user_enabled: "User enabled"
    };
  }
});

// src/routes/index.tsx
var routes_exports = {};
__export(routes_exports, {
  router: () => router
});
function ErrorShell() {
  return /* @__PURE__ */ (0, import_jsx_runtime61.jsx)(import_react_router_dom34.Outlet, {});
}
var import_react25, import_react_router_dom34, import_jsx_runtime61, AdminOverview2, AdminFiles2, AdminCategories2, AdminUsers2, AdminTopups2, AdminAudit2, router;
var init_routes = __esm({
  "src/routes/index.tsx"() {
    import_react25 = require("react");
    import_react_router_dom34 = require("react-router-dom");
    init_RouteError();
    init_PublicLayout();
    init_AuthLayout();
    init_AdminLayout();
    init_RequireAuth();
    init_AdminRoute();
    init_Home();
    init_Browse();
    init_Categories();
    init_FileDetails();
    init_Tokens();
    init_Profile();
    init_FAQ();
    init_Contact();
    init_Terms();
    init_Privacy();
    init_Cookies();
    init_Login();
    init_Register();
    init_Error401();
    init_Error403();
    init_Error404();
    init_Error429();
    init_Error500();
    init_Error502();
    init_Error503();
    init_Offline();
    init_SessionExpired();
    import_jsx_runtime61 = require("react/jsx-runtime");
    AdminOverview2 = (0, import_react25.lazy)(() => Promise.resolve().then(() => (init_AdminOverview(), AdminOverview_exports)));
    AdminFiles2 = (0, import_react25.lazy)(() => Promise.resolve().then(() => (init_AdminFiles(), AdminFiles_exports)));
    AdminCategories2 = (0, import_react25.lazy)(() => Promise.resolve().then(() => (init_AdminCategories(), AdminCategories_exports)));
    AdminUsers2 = (0, import_react25.lazy)(() => Promise.resolve().then(() => (init_AdminUsers(), AdminUsers_exports)));
    AdminTopups2 = (0, import_react25.lazy)(() => Promise.resolve().then(() => (init_AdminTopups(), AdminTopups_exports)));
    AdminAudit2 = (0, import_react25.lazy)(() => Promise.resolve().then(() => (init_AdminAudit(), AdminAudit_exports)));
    router = (0, import_react_router_dom34.createBrowserRouter)(
      [
        {
          element: /* @__PURE__ */ (0, import_jsx_runtime61.jsx)(PublicLayout, {}),
          errorElement: /* @__PURE__ */ (0, import_jsx_runtime61.jsx)(RouteError, {}),
          children: [
            // Public (no auth required)
            { path: "/faq", element: /* @__PURE__ */ (0, import_jsx_runtime61.jsx)(FAQ, {}) },
            { path: "/contact", element: /* @__PURE__ */ (0, import_jsx_runtime61.jsx)(Contact, {}) },
            { path: "/terms", element: /* @__PURE__ */ (0, import_jsx_runtime61.jsx)(Terms, {}) },
            { path: "/privacy", element: /* @__PURE__ */ (0, import_jsx_runtime61.jsx)(Privacy, {}) },
            { path: "/cookies", element: /* @__PURE__ */ (0, import_jsx_runtime61.jsx)(Cookies, {}) },
            // Protected application pages
            {
              element: /* @__PURE__ */ (0, import_jsx_runtime61.jsx)(RequireAuth, {}),
              errorElement: /* @__PURE__ */ (0, import_jsx_runtime61.jsx)(RouteError, {}),
              children: [
                { path: "/", element: /* @__PURE__ */ (0, import_jsx_runtime61.jsx)(Home, {}) },
                { path: "/browse", element: /* @__PURE__ */ (0, import_jsx_runtime61.jsx)(Browse, {}) },
                { path: "/categories", element: /* @__PURE__ */ (0, import_jsx_runtime61.jsx)(Categories, {}) },
                { path: "/file/:id", element: /* @__PURE__ */ (0, import_jsx_runtime61.jsx)(FileDetails, {}) },
                { path: "/tokens", element: /* @__PURE__ */ (0, import_jsx_runtime61.jsx)(Tokens, {}) },
                { path: "/profile", element: /* @__PURE__ */ (0, import_jsx_runtime61.jsx)(Profile, {}) }
              ]
            }
          ]
        },
        {
          element: /* @__PURE__ */ (0, import_jsx_runtime61.jsx)(AuthLayout, {}),
          errorElement: /* @__PURE__ */ (0, import_jsx_runtime61.jsx)(RouteError, {}),
          children: [
            { path: "/login", element: /* @__PURE__ */ (0, import_jsx_runtime61.jsx)(Login, {}) },
            { path: "/register", element: /* @__PURE__ */ (0, import_jsx_runtime61.jsx)(Register, {}) }
          ]
        },
        {
          path: "/Admin/admin",
          element: /* @__PURE__ */ (0, import_jsx_runtime61.jsx)(AdminRoute, {}),
          errorElement: /* @__PURE__ */ (0, import_jsx_runtime61.jsx)(RouteError, {}),
          children: [
            {
              element: /* @__PURE__ */ (0, import_jsx_runtime61.jsx)(AdminLayout, {}),
              errorElement: /* @__PURE__ */ (0, import_jsx_runtime61.jsx)(RouteError, {}),
              children: [
                { index: true, element: /* @__PURE__ */ (0, import_jsx_runtime61.jsx)(AdminOverview2, {}) },
                { path: "files", element: /* @__PURE__ */ (0, import_jsx_runtime61.jsx)(AdminFiles2, {}) },
                { path: "categories", element: /* @__PURE__ */ (0, import_jsx_runtime61.jsx)(AdminCategories2, {}) },
                { path: "users", element: /* @__PURE__ */ (0, import_jsx_runtime61.jsx)(AdminUsers2, {}) },
                { path: "topups", element: /* @__PURE__ */ (0, import_jsx_runtime61.jsx)(AdminTopups2, {}) },
                { path: "audit", element: /* @__PURE__ */ (0, import_jsx_runtime61.jsx)(AdminAudit2, {}) }
              ]
            }
          ]
        },
        {
          element: /* @__PURE__ */ (0, import_jsx_runtime61.jsx)(ErrorShell, {}),
          children: [
            { path: "/error/401", element: /* @__PURE__ */ (0, import_jsx_runtime61.jsx)(Error401, {}) },
            { path: "/error/403", element: /* @__PURE__ */ (0, import_jsx_runtime61.jsx)(Error403, {}) },
            { path: "/error/429", element: /* @__PURE__ */ (0, import_jsx_runtime61.jsx)(Error429, {}) },
            { path: "/error/500", element: /* @__PURE__ */ (0, import_jsx_runtime61.jsx)(Error500, {}) },
            { path: "/error/502", element: /* @__PURE__ */ (0, import_jsx_runtime61.jsx)(Error502, {}) },
            { path: "/error/503", element: /* @__PURE__ */ (0, import_jsx_runtime61.jsx)(Error503, {}) },
            { path: "/offline", element: /* @__PURE__ */ (0, import_jsx_runtime61.jsx)(Offline, {}) },
            { path: "/session-expired", element: /* @__PURE__ */ (0, import_jsx_runtime61.jsx)(SessionExpired, {}) },
            { path: "*", element: /* @__PURE__ */ (0, import_jsx_runtime61.jsx)(Error404, {}) }
          ]
        }
      ],
      {
        future: {
          v7_relativeSplatPath: true
        }
      }
    );
  }
});

// src/hooks/useUIRestrictions.ts
function useUIRestrictions() {
  (0, import_react26.useEffect)(() => {
    return installUIRestrictions();
  }, []);
}
var import_react26;
var init_useUIRestrictions = __esm({
  "src/hooks/useUIRestrictions.ts"() {
    import_react26 = require("react");
    init_uiRestrictions();
  }
});

// src/components/system/ErrorBoundary.tsx
var import_react27, import_jsx_runtime62, import_meta6, ErrorBoundary;
var init_ErrorBoundary = __esm({
  "src/components/system/ErrorBoundary.tsx"() {
    import_react27 = require("react");
    init_LotusLogo();
    import_jsx_runtime62 = require("react/jsx-runtime");
    import_meta6 = {};
    ErrorBoundary = class extends import_react27.Component {
      state = { hasError: false };
      static getDerivedStateFromError() {
        return { hasError: true };
      }
      componentDidCatch(error, info) {
        if (import_meta6.env?.DEV) {
          console.error("[ErrorBoundary]", error, info.componentStack);
        }
      }
      reset = () => {
        this.setState({ hasError: false });
        window.location.href = "/";
      };
      retry = () => {
        this.setState({ hasError: false });
        window.location.reload();
      };
      render() {
        if (!this.state.hasError) return this.props.children;
        return /* @__PURE__ */ (0, import_jsx_runtime62.jsx)("main", { className: "gate-page", role: "alert", children: /* @__PURE__ */ (0, import_jsx_runtime62.jsxs)("div", { className: "gate-card", children: [
          /* @__PURE__ */ (0, import_jsx_runtime62.jsx)(LotusMark, { className: "auth-gate__mark" }),
          /* @__PURE__ */ (0, import_jsx_runtime62.jsx)("span", { className: "gate-card__icon", "aria-hidden": "true", children: "!" }),
          /* @__PURE__ */ (0, import_jsx_runtime62.jsx)("h1", { className: "gate-card__title", children: "Something went wrong" }),
          /* @__PURE__ */ (0, import_jsx_runtime62.jsx)("p", { className: "gate-card__message", children: "An unexpected error occurred. Please try again \u2014 your account and data are safe." }),
          /* @__PURE__ */ (0, import_jsx_runtime62.jsxs)("div", { className: "gate-card__actions", children: [
            /* @__PURE__ */ (0, import_jsx_runtime62.jsx)("button", { type: "button", className: "btn btn-primary btn-lg", onClick: this.retry, children: "Retry" }),
            /* @__PURE__ */ (0, import_jsx_runtime62.jsx)("button", { type: "button", className: "btn btn-secondary btn-lg", onClick: this.reset, children: "Go home" })
          ] })
        ] }) });
      }
    };
  }
});

// src/App.tsx
var App_exports = {};
__export(App_exports, {
  App: () => App
});
function App() {
  useUIRestrictions();
  return /* @__PURE__ */ (0, import_jsx_runtime63.jsx)(ErrorBoundary, { children: /* @__PURE__ */ (0, import_jsx_runtime63.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime63.jsx)(import_react_router_dom35.RouterProvider, { router }) }) });
}
var import_react_router_dom35, import_jsx_runtime63;
var init_App = __esm({
  "src/App.tsx"() {
    import_react_router_dom35 = require("react-router-dom");
    init_routes();
    init_AuthContext();
    init_useUIRestrictions();
    init_ErrorBoundary();
    import_jsx_runtime63 = require("react/jsx-runtime");
  }
});

// scripts/smoke.test.tsx
var import_jsdom = require("jsdom");
var import_react28 = __toESM(require("react"), 1);
var dom = new import_jsdom.JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
  url: "http://localhost/"
});
var { window: window2 } = dom;
globalThis.window = window2;
globalThis.document = window2.document;
globalThis.navigator = window2.navigator;
globalThis.HTMLElement = window2.HTMLElement;
globalThis.Event = window2.Event;
globalThis.KeyboardEvent = window2.KeyboardEvent;
globalThis.DragEvent = window2.DragEvent;
globalThis.MouseEvent = window2.MouseEvent;
globalThis.Node = window2.Node;
globalThis.Element = window2.Element;
globalThis.HTMLInputElement = window2.HTMLInputElement;
window2.matchMedia = () => ({ matches: false, addEventListener() {
}, removeEventListener() {
} });
window2.scrollTo = () => {
};
globalThis.fetch = async () => {
  throw new TypeError("network unavailable in smoke test");
};
var consoleErrors = [];
console.error = (...args) => {
  consoleErrors.push(args.map(String).join(" "));
};
var PUBLIC = [
  ["/login", "Welcome back"],
  ["/register", "Create your account"],
  ["/faq", "Frequently asked questions"],
  ["/contact", "Contact us"],
  ["/terms", "Terms of service"],
  ["/privacy", "Privacy policy"],
  ["/cookies", "Cookies policy"]
];
var PROTECTED = [
  "/",
  "/browse",
  "/categories",
  "/file/1",
  "/tokens",
  "/profile",
  "/Admin/admin",
  "/Admin/admin/files"
];
var ERROR_ROUTES = [
  ["/error/401", "Sign In Required"],
  ["/error/403", "Access Denied"],
  ["/error/404", "Page not found"],
  ["/error/429", "Too many requests"],
  ["/error/500", "Something went wrong"],
  ["/error/502", "Service temporarily unavailable"],
  ["/error/503", "Service under maintenance"],
  ["/offline", "No internet connection"],
  ["/session-expired", "Session Expired"]
];
async function main() {
  const { createRoot } = await import("react-dom/client");
  const { App: App2 } = await Promise.resolve().then(() => (init_App(), App_exports));
  const { router: router2 } = await Promise.resolve().then(() => (init_routes(), routes_exports));
  const root = createRoot(document.getElementById("root"));
  root.render(import_react28.default.createElement(App2));
  await new Promise((r) => setTimeout(r, 200));
  const failures = [];
  const text = () => document.body.textContent ?? "";
  const wait = () => new Promise((r) => setTimeout(r, 60));
  for (const [route] of PUBLIC) {
    router2.navigate(route);
    await wait();
    const t = text();
    if (t.length < 5) failures.push(`PUBLIC ${route}: no content`);
    if (t.includes("Sign In Required")) {
      failures.push(`PUBLIC ${route}: unexpectedly gated`);
    }
  }
  for (const route of PROTECTED) {
    router2.navigate(route);
    await wait();
    const t = text();
    if (!t.includes("Sign In Required")) {
      failures.push(`PROTECTED ${route}: did not show Sign In Required gate`);
    }
  }
  for (const [route, expected] of ERROR_ROUTES) {
    router2.navigate(route);
    await wait();
    const t = text();
    if (!t.includes(expected)) {
      failures.push(`ERROR ${route}: expected "${expected}"`);
    }
  }
  router2.navigate("/this-route-does-not-exist");
  await wait();
  if (!text().includes("Page not found")) failures.push("404 wildcard not shown");
  const e = new window2.Event("contextmenu", { cancelable: true });
  const defaultPrevented = !window2.document.dispatchEvent(e);
  if (!defaultPrevented) failures.push("contextmenu not suppressed");
  root.unmount();
  console.log("==== CONSOLE ERRORS ====");
  if (consoleErrors.length === 0) console.log("NONE");
  else consoleErrors.forEach((x) => console.log(" - " + x));
  console.log("\n==== RESULT ====");
  if (failures.length === 0 && consoleErrors.length === 0) {
    console.log("PASS \u2014 routing, access control, error pages & UI restrictions OK");
  } else {
    console.log("FAILURES:");
    failures.forEach((f) => console.log(" - " + f));
  }
  if (failures.length > 0 || consoleErrors.length > 0) process.exit(1);
}
main();
