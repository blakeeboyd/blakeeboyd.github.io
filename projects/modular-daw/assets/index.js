var Ov = Object.defineProperty;
var Hv = (e, r, o) => r in e ? Ov(e, r, { enumerable: !0, configurable: !0, writable: !0, value: o }) : e[r] = o;
var xr = (e, r, o) => Hv(e, typeof r != "symbol" ? r + "" : r, o);
function mu(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var jc = { exports: {} }, ua = {}, Mc = { exports: {} }, Me = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var ip;
function Wv() {
  if (ip) return Me;
  ip = 1;
  var e = Symbol.for("react.element"), r = Symbol.for("react.portal"), o = Symbol.for("react.fragment"), s = Symbol.for("react.strict_mode"), i = Symbol.for("react.profiler"), l = Symbol.for("react.provider"), c = Symbol.for("react.context"), u = Symbol.for("react.forward_ref"), p = Symbol.for("react.suspense"), g = Symbol.for("react.memo"), m = Symbol.for("react.lazy"), h = Symbol.iterator;
  function w(M) {
    return M === null || typeof M != "object" ? null : (M = h && M[h] || M["@@iterator"], typeof M == "function" ? M : null);
  }
  var I = { isMounted: function() {
    return !1;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, x = Object.assign, C = {};
  function b(M, V, te) {
    this.props = M, this.context = V, this.refs = C, this.updater = te || I;
  }
  b.prototype.isReactComponent = {}, b.prototype.setState = function(M, V) {
    if (typeof M != "object" && typeof M != "function" && M != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, M, V, "setState");
  }, b.prototype.forceUpdate = function(M) {
    this.updater.enqueueForceUpdate(this, M, "forceUpdate");
  };
  function N() {
  }
  N.prototype = b.prototype;
  function k(M, V, te) {
    this.props = M, this.context = V, this.refs = C, this.updater = te || I;
  }
  var A = k.prototype = new N();
  A.constructor = k, x(A, b.prototype), A.isPureReactComponent = !0;
  var S = Array.isArray, P = Object.prototype.hasOwnProperty, F = { current: null }, j = { key: !0, ref: !0, __self: !0, __source: !0 };
  function W(M, V, te) {
    var re, le = {}, ue = null, de = null;
    if (V != null) for (re in V.ref !== void 0 && (de = V.ref), V.key !== void 0 && (ue = "" + V.key), V) P.call(V, re) && !j.hasOwnProperty(re) && (le[re] = V[re]);
    var ne = arguments.length - 2;
    if (ne === 1) le.children = te;
    else if (1 < ne) {
      for (var fe = Array(ne), be = 0; be < ne; be++) fe[be] = arguments[be + 2];
      le.children = fe;
    }
    if (M && M.defaultProps) for (re in ne = M.defaultProps, ne) le[re] === void 0 && (le[re] = ne[re]);
    return { $$typeof: e, type: M, key: ue, ref: de, props: le, _owner: F.current };
  }
  function D(M, V) {
    return { $$typeof: e, type: M.type, key: V, ref: M.ref, props: M.props, _owner: M._owner };
  }
  function Z(M) {
    return typeof M == "object" && M !== null && M.$$typeof === e;
  }
  function H(M) {
    var V = { "=": "=0", ":": "=2" };
    return "$" + M.replace(/[=:]/g, function(te) {
      return V[te];
    });
  }
  var L = /\/+/g;
  function ee(M, V) {
    return typeof M == "object" && M !== null && M.key != null ? H("" + M.key) : V.toString(36);
  }
  function T(M, V, te, re, le) {
    var ue = typeof M;
    (ue === "undefined" || ue === "boolean") && (M = null);
    var de = !1;
    if (M === null) de = !0;
    else switch (ue) {
      case "string":
      case "number":
        de = !0;
        break;
      case "object":
        switch (M.$$typeof) {
          case e:
          case r:
            de = !0;
        }
    }
    if (de) return de = M, le = le(de), M = re === "" ? "." + ee(de, 0) : re, S(le) ? (te = "", M != null && (te = M.replace(L, "$&/") + "/"), T(le, V, te, "", function(be) {
      return be;
    })) : le != null && (Z(le) && (le = D(le, te + (!le.key || de && de.key === le.key ? "" : ("" + le.key).replace(L, "$&/") + "/") + M)), V.push(le)), 1;
    if (de = 0, re = re === "" ? "." : re + ":", S(M)) for (var ne = 0; ne < M.length; ne++) {
      ue = M[ne];
      var fe = re + ee(ue, ne);
      de += T(ue, V, te, fe, le);
    }
    else if (fe = w(M), typeof fe == "function") for (M = fe.call(M), ne = 0; !(ue = M.next()).done; ) ue = ue.value, fe = re + ee(ue, ne++), de += T(ue, V, te, fe, le);
    else if (ue === "object") throw V = String(M), Error("Objects are not valid as a React child (found: " + (V === "[object Object]" ? "object with keys {" + Object.keys(M).join(", ") + "}" : V) + "). If you meant to render a collection of children, use an array instead.");
    return de;
  }
  function Y(M, V, te) {
    if (M == null) return M;
    var re = [], le = 0;
    return T(M, re, "", "", function(ue) {
      return V.call(te, ue, le++);
    }), re;
  }
  function O(M) {
    if (M._status === -1) {
      var V = M._result;
      V = V(), V.then(function(te) {
        (M._status === 0 || M._status === -1) && (M._status = 1, M._result = te);
      }, function(te) {
        (M._status === 0 || M._status === -1) && (M._status = 2, M._result = te);
      }), M._status === -1 && (M._status = 0, M._result = V);
    }
    if (M._status === 1) return M._result.default;
    throw M._result;
  }
  var U = { current: null }, E = { transition: null }, G = { ReactCurrentDispatcher: U, ReactCurrentBatchConfig: E, ReactCurrentOwner: F };
  function K() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  return Me.Children = { map: Y, forEach: function(M, V, te) {
    Y(M, function() {
      V.apply(this, arguments);
    }, te);
  }, count: function(M) {
    var V = 0;
    return Y(M, function() {
      V++;
    }), V;
  }, toArray: function(M) {
    return Y(M, function(V) {
      return V;
    }) || [];
  }, only: function(M) {
    if (!Z(M)) throw Error("React.Children.only expected to receive a single React element child.");
    return M;
  } }, Me.Component = b, Me.Fragment = o, Me.Profiler = i, Me.PureComponent = k, Me.StrictMode = s, Me.Suspense = p, Me.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = G, Me.act = K, Me.cloneElement = function(M, V, te) {
    if (M == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + M + ".");
    var re = x({}, M.props), le = M.key, ue = M.ref, de = M._owner;
    if (V != null) {
      if (V.ref !== void 0 && (ue = V.ref, de = F.current), V.key !== void 0 && (le = "" + V.key), M.type && M.type.defaultProps) var ne = M.type.defaultProps;
      for (fe in V) P.call(V, fe) && !j.hasOwnProperty(fe) && (re[fe] = V[fe] === void 0 && ne !== void 0 ? ne[fe] : V[fe]);
    }
    var fe = arguments.length - 2;
    if (fe === 1) re.children = te;
    else if (1 < fe) {
      ne = Array(fe);
      for (var be = 0; be < fe; be++) ne[be] = arguments[be + 2];
      re.children = ne;
    }
    return { $$typeof: e, type: M.type, key: le, ref: ue, props: re, _owner: de };
  }, Me.createContext = function(M) {
    return M = { $$typeof: c, _currentValue: M, _currentValue2: M, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, M.Provider = { $$typeof: l, _context: M }, M.Consumer = M;
  }, Me.createElement = W, Me.createFactory = function(M) {
    var V = W.bind(null, M);
    return V.type = M, V;
  }, Me.createRef = function() {
    return { current: null };
  }, Me.forwardRef = function(M) {
    return { $$typeof: u, render: M };
  }, Me.isValidElement = Z, Me.lazy = function(M) {
    return { $$typeof: m, _payload: { _status: -1, _result: M }, _init: O };
  }, Me.memo = function(M, V) {
    return { $$typeof: g, type: M, compare: V === void 0 ? null : V };
  }, Me.startTransition = function(M) {
    var V = E.transition;
    E.transition = {};
    try {
      M();
    } finally {
      E.transition = V;
    }
  }, Me.unstable_act = K, Me.useCallback = function(M, V) {
    return U.current.useCallback(M, V);
  }, Me.useContext = function(M) {
    return U.current.useContext(M);
  }, Me.useDebugValue = function() {
  }, Me.useDeferredValue = function(M) {
    return U.current.useDeferredValue(M);
  }, Me.useEffect = function(M, V) {
    return U.current.useEffect(M, V);
  }, Me.useId = function() {
    return U.current.useId();
  }, Me.useImperativeHandle = function(M, V, te) {
    return U.current.useImperativeHandle(M, V, te);
  }, Me.useInsertionEffect = function(M, V) {
    return U.current.useInsertionEffect(M, V);
  }, Me.useLayoutEffect = function(M, V) {
    return U.current.useLayoutEffect(M, V);
  }, Me.useMemo = function(M, V) {
    return U.current.useMemo(M, V);
  }, Me.useReducer = function(M, V, te) {
    return U.current.useReducer(M, V, te);
  }, Me.useRef = function(M) {
    return U.current.useRef(M);
  }, Me.useState = function(M) {
    return U.current.useState(M);
  }, Me.useSyncExternalStore = function(M, V, te) {
    return U.current.useSyncExternalStore(M, V, te);
  }, Me.useTransition = function() {
    return U.current.useTransition();
  }, Me.version = "18.3.1", Me;
}
var lp;
function Aa() {
  return lp || (lp = 1, Mc.exports = Wv()), Mc.exports;
}
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var cp;
function Xv() {
  if (cp) return ua;
  cp = 1;
  var e = Aa(), r = Symbol.for("react.element"), o = Symbol.for("react.fragment"), s = Object.prototype.hasOwnProperty, i = e.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, l = { key: !0, ref: !0, __self: !0, __source: !0 };
  function c(u, p, g) {
    var m, h = {}, w = null, I = null;
    g !== void 0 && (w = "" + g), p.key !== void 0 && (w = "" + p.key), p.ref !== void 0 && (I = p.ref);
    for (m in p) s.call(p, m) && !l.hasOwnProperty(m) && (h[m] = p[m]);
    if (u && u.defaultProps) for (m in p = u.defaultProps, p) h[m] === void 0 && (h[m] = p[m]);
    return { $$typeof: r, type: u, key: w, ref: I, props: h, _owner: i.current };
  }
  return ua.Fragment = o, ua.jsx = c, ua.jsxs = c, ua;
}
var up;
function Lv() {
  return up || (up = 1, jc.exports = Xv()), jc.exports;
}
var f = Lv(), R = Aa();
const bn = /* @__PURE__ */ mu(R);
var Qs = {}, Tc = { exports: {} }, yt = {}, Rc = { exports: {} }, Bc = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var dp;
function Kv() {
  return dp || (dp = 1, (function(e) {
    function r(E, G) {
      var K = E.length;
      E.push(G);
      e: for (; 0 < K; ) {
        var M = K - 1 >>> 1, V = E[M];
        if (0 < i(V, G)) E[M] = G, E[K] = V, K = M;
        else break e;
      }
    }
    function o(E) {
      return E.length === 0 ? null : E[0];
    }
    function s(E) {
      if (E.length === 0) return null;
      var G = E[0], K = E.pop();
      if (K !== G) {
        E[0] = K;
        e: for (var M = 0, V = E.length, te = V >>> 1; M < te; ) {
          var re = 2 * (M + 1) - 1, le = E[re], ue = re + 1, de = E[ue];
          if (0 > i(le, K)) ue < V && 0 > i(de, le) ? (E[M] = de, E[ue] = K, M = ue) : (E[M] = le, E[re] = K, M = re);
          else if (ue < V && 0 > i(de, K)) E[M] = de, E[ue] = K, M = ue;
          else break e;
        }
      }
      return G;
    }
    function i(E, G) {
      var K = E.sortIndex - G.sortIndex;
      return K !== 0 ? K : E.id - G.id;
    }
    if (typeof performance == "object" && typeof performance.now == "function") {
      var l = performance;
      e.unstable_now = function() {
        return l.now();
      };
    } else {
      var c = Date, u = c.now();
      e.unstable_now = function() {
        return c.now() - u;
      };
    }
    var p = [], g = [], m = 1, h = null, w = 3, I = !1, x = !1, C = !1, b = typeof setTimeout == "function" ? setTimeout : null, N = typeof clearTimeout == "function" ? clearTimeout : null, k = typeof setImmediate < "u" ? setImmediate : null;
    typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function A(E) {
      for (var G = o(g); G !== null; ) {
        if (G.callback === null) s(g);
        else if (G.startTime <= E) s(g), G.sortIndex = G.expirationTime, r(p, G);
        else break;
        G = o(g);
      }
    }
    function S(E) {
      if (C = !1, A(E), !x) if (o(p) !== null) x = !0, O(P);
      else {
        var G = o(g);
        G !== null && U(S, G.startTime - E);
      }
    }
    function P(E, G) {
      x = !1, C && (C = !1, N(W), W = -1), I = !0;
      var K = w;
      try {
        for (A(G), h = o(p); h !== null && (!(h.expirationTime > G) || E && !H()); ) {
          var M = h.callback;
          if (typeof M == "function") {
            h.callback = null, w = h.priorityLevel;
            var V = M(h.expirationTime <= G);
            G = e.unstable_now(), typeof V == "function" ? h.callback = V : h === o(p) && s(p), A(G);
          } else s(p);
          h = o(p);
        }
        if (h !== null) var te = !0;
        else {
          var re = o(g);
          re !== null && U(S, re.startTime - G), te = !1;
        }
        return te;
      } finally {
        h = null, w = K, I = !1;
      }
    }
    var F = !1, j = null, W = -1, D = 5, Z = -1;
    function H() {
      return !(e.unstable_now() - Z < D);
    }
    function L() {
      if (j !== null) {
        var E = e.unstable_now();
        Z = E;
        var G = !0;
        try {
          G = j(!0, E);
        } finally {
          G ? ee() : (F = !1, j = null);
        }
      } else F = !1;
    }
    var ee;
    if (typeof k == "function") ee = function() {
      k(L);
    };
    else if (typeof MessageChannel < "u") {
      var T = new MessageChannel(), Y = T.port2;
      T.port1.onmessage = L, ee = function() {
        Y.postMessage(null);
      };
    } else ee = function() {
      b(L, 0);
    };
    function O(E) {
      j = E, F || (F = !0, ee());
    }
    function U(E, G) {
      W = b(function() {
        E(e.unstable_now());
      }, G);
    }
    e.unstable_IdlePriority = 5, e.unstable_ImmediatePriority = 1, e.unstable_LowPriority = 4, e.unstable_NormalPriority = 3, e.unstable_Profiling = null, e.unstable_UserBlockingPriority = 2, e.unstable_cancelCallback = function(E) {
      E.callback = null;
    }, e.unstable_continueExecution = function() {
      x || I || (x = !0, O(P));
    }, e.unstable_forceFrameRate = function(E) {
      0 > E || 125 < E ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : D = 0 < E ? Math.floor(1e3 / E) : 5;
    }, e.unstable_getCurrentPriorityLevel = function() {
      return w;
    }, e.unstable_getFirstCallbackNode = function() {
      return o(p);
    }, e.unstable_next = function(E) {
      switch (w) {
        case 1:
        case 2:
        case 3:
          var G = 3;
          break;
        default:
          G = w;
      }
      var K = w;
      w = G;
      try {
        return E();
      } finally {
        w = K;
      }
    }, e.unstable_pauseExecution = function() {
    }, e.unstable_requestPaint = function() {
    }, e.unstable_runWithPriority = function(E, G) {
      switch (E) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          E = 3;
      }
      var K = w;
      w = E;
      try {
        return G();
      } finally {
        w = K;
      }
    }, e.unstable_scheduleCallback = function(E, G, K) {
      var M = e.unstable_now();
      switch (typeof K == "object" && K !== null ? (K = K.delay, K = typeof K == "number" && 0 < K ? M + K : M) : K = M, E) {
        case 1:
          var V = -1;
          break;
        case 2:
          V = 250;
          break;
        case 5:
          V = 1073741823;
          break;
        case 4:
          V = 1e4;
          break;
        default:
          V = 5e3;
      }
      return V = K + V, E = { id: m++, callback: G, priorityLevel: E, startTime: K, expirationTime: V, sortIndex: -1 }, K > M ? (E.sortIndex = K, r(g, E), o(p) === null && E === o(g) && (C ? (N(W), W = -1) : C = !0, U(S, K - M))) : (E.sortIndex = V, r(p, E), x || I || (x = !0, O(P))), E;
    }, e.unstable_shouldYield = H, e.unstable_wrapCallback = function(E) {
      var G = w;
      return function() {
        var K = w;
        w = G;
        try {
          return E.apply(this, arguments);
        } finally {
          w = K;
        }
      };
    };
  })(Bc)), Bc;
}
var fp;
function Zv() {
  return fp || (fp = 1, Rc.exports = Kv()), Rc.exports;
}
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var pp;
function Yv() {
  if (pp) return yt;
  pp = 1;
  var e = Aa(), r = Zv();
  function o(t) {
    for (var n = "https://reactjs.org/docs/error-decoder.html?invariant=" + t, a = 1; a < arguments.length; a++) n += "&args[]=" + encodeURIComponent(arguments[a]);
    return "Minified React error #" + t + "; visit " + n + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var s = /* @__PURE__ */ new Set(), i = {};
  function l(t, n) {
    c(t, n), c(t + "Capture", n);
  }
  function c(t, n) {
    for (i[t] = n, t = 0; t < n.length; t++) s.add(n[t]);
  }
  var u = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), p = Object.prototype.hasOwnProperty, g = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, m = {}, h = {};
  function w(t) {
    return p.call(h, t) ? !0 : p.call(m, t) ? !1 : g.test(t) ? h[t] = !0 : (m[t] = !0, !1);
  }
  function I(t, n, a, d) {
    if (a !== null && a.type === 0) return !1;
    switch (typeof n) {
      case "function":
      case "symbol":
        return !0;
      case "boolean":
        return d ? !1 : a !== null ? !a.acceptsBooleans : (t = t.toLowerCase().slice(0, 5), t !== "data-" && t !== "aria-");
      default:
        return !1;
    }
  }
  function x(t, n, a, d) {
    if (n === null || typeof n > "u" || I(t, n, a, d)) return !0;
    if (d) return !1;
    if (a !== null) switch (a.type) {
      case 3:
        return !n;
      case 4:
        return n === !1;
      case 5:
        return isNaN(n);
      case 6:
        return isNaN(n) || 1 > n;
    }
    return !1;
  }
  function C(t, n, a, d, y, v, _) {
    this.acceptsBooleans = n === 2 || n === 3 || n === 4, this.attributeName = d, this.attributeNamespace = y, this.mustUseProperty = a, this.propertyName = t, this.type = n, this.sanitizeURL = v, this.removeEmptyString = _;
  }
  var b = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(t) {
    b[t] = new C(t, 0, !1, t, null, !1, !1);
  }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(t) {
    var n = t[0];
    b[n] = new C(n, 1, !1, t[1], null, !1, !1);
  }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(t) {
    b[t] = new C(t, 2, !1, t.toLowerCase(), null, !1, !1);
  }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(t) {
    b[t] = new C(t, 2, !1, t, null, !1, !1);
  }), "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(t) {
    b[t] = new C(t, 3, !1, t.toLowerCase(), null, !1, !1);
  }), ["checked", "multiple", "muted", "selected"].forEach(function(t) {
    b[t] = new C(t, 3, !0, t, null, !1, !1);
  }), ["capture", "download"].forEach(function(t) {
    b[t] = new C(t, 4, !1, t, null, !1, !1);
  }), ["cols", "rows", "size", "span"].forEach(function(t) {
    b[t] = new C(t, 6, !1, t, null, !1, !1);
  }), ["rowSpan", "start"].forEach(function(t) {
    b[t] = new C(t, 5, !1, t.toLowerCase(), null, !1, !1);
  });
  var N = /[\-:]([a-z])/g;
  function k(t) {
    return t[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(t) {
    var n = t.replace(
      N,
      k
    );
    b[n] = new C(n, 1, !1, t, null, !1, !1);
  }), "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(t) {
    var n = t.replace(N, k);
    b[n] = new C(n, 1, !1, t, "http://www.w3.org/1999/xlink", !1, !1);
  }), ["xml:base", "xml:lang", "xml:space"].forEach(function(t) {
    var n = t.replace(N, k);
    b[n] = new C(n, 1, !1, t, "http://www.w3.org/XML/1998/namespace", !1, !1);
  }), ["tabIndex", "crossOrigin"].forEach(function(t) {
    b[t] = new C(t, 1, !1, t.toLowerCase(), null, !1, !1);
  }), b.xlinkHref = new C("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1), ["src", "href", "action", "formAction"].forEach(function(t) {
    b[t] = new C(t, 1, !1, t.toLowerCase(), null, !0, !0);
  });
  function A(t, n, a, d) {
    var y = b.hasOwnProperty(n) ? b[n] : null;
    (y !== null ? y.type !== 0 : d || !(2 < n.length) || n[0] !== "o" && n[0] !== "O" || n[1] !== "n" && n[1] !== "N") && (x(n, a, y, d) && (a = null), d || y === null ? w(n) && (a === null ? t.removeAttribute(n) : t.setAttribute(n, "" + a)) : y.mustUseProperty ? t[y.propertyName] = a === null ? y.type === 3 ? !1 : "" : a : (n = y.attributeName, d = y.attributeNamespace, a === null ? t.removeAttribute(n) : (y = y.type, a = y === 3 || y === 4 && a === !0 ? "" : "" + a, d ? t.setAttributeNS(d, n, a) : t.setAttribute(n, a))));
  }
  var S = e.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, P = Symbol.for("react.element"), F = Symbol.for("react.portal"), j = Symbol.for("react.fragment"), W = Symbol.for("react.strict_mode"), D = Symbol.for("react.profiler"), Z = Symbol.for("react.provider"), H = Symbol.for("react.context"), L = Symbol.for("react.forward_ref"), ee = Symbol.for("react.suspense"), T = Symbol.for("react.suspense_list"), Y = Symbol.for("react.memo"), O = Symbol.for("react.lazy"), U = Symbol.for("react.offscreen"), E = Symbol.iterator;
  function G(t) {
    return t === null || typeof t != "object" ? null : (t = E && t[E] || t["@@iterator"], typeof t == "function" ? t : null);
  }
  var K = Object.assign, M;
  function V(t) {
    if (M === void 0) try {
      throw Error();
    } catch (a) {
      var n = a.stack.trim().match(/\n( *(at )?)/);
      M = n && n[1] || "";
    }
    return `
` + M + t;
  }
  var te = !1;
  function re(t, n) {
    if (!t || te) return "";
    te = !0;
    var a = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      if (n) if (n = function() {
        throw Error();
      }, Object.defineProperty(n.prototype, "props", { set: function() {
        throw Error();
      } }), typeof Reflect == "object" && Reflect.construct) {
        try {
          Reflect.construct(n, []);
        } catch (q) {
          var d = q;
        }
        Reflect.construct(t, [], n);
      } else {
        try {
          n.call();
        } catch (q) {
          d = q;
        }
        t.call(n.prototype);
      }
      else {
        try {
          throw Error();
        } catch (q) {
          d = q;
        }
        t();
      }
    } catch (q) {
      if (q && d && typeof q.stack == "string") {
        for (var y = q.stack.split(`
`), v = d.stack.split(`
`), _ = y.length - 1, B = v.length - 1; 1 <= _ && 0 <= B && y[_] !== v[B]; ) B--;
        for (; 1 <= _ && 0 <= B; _--, B--) if (y[_] !== v[B]) {
          if (_ !== 1 || B !== 1)
            do
              if (_--, B--, 0 > B || y[_] !== v[B]) {
                var z = `
` + y[_].replace(" at new ", " at ");
                return t.displayName && z.includes("<anonymous>") && (z = z.replace("<anonymous>", t.displayName)), z;
              }
            while (1 <= _ && 0 <= B);
          break;
        }
      }
    } finally {
      te = !1, Error.prepareStackTrace = a;
    }
    return (t = t ? t.displayName || t.name : "") ? V(t) : "";
  }
  function le(t) {
    switch (t.tag) {
      case 5:
        return V(t.type);
      case 16:
        return V("Lazy");
      case 13:
        return V("Suspense");
      case 19:
        return V("SuspenseList");
      case 0:
      case 2:
      case 15:
        return t = re(t.type, !1), t;
      case 11:
        return t = re(t.type.render, !1), t;
      case 1:
        return t = re(t.type, !0), t;
      default:
        return "";
    }
  }
  function ue(t) {
    if (t == null) return null;
    if (typeof t == "function") return t.displayName || t.name || null;
    if (typeof t == "string") return t;
    switch (t) {
      case j:
        return "Fragment";
      case F:
        return "Portal";
      case D:
        return "Profiler";
      case W:
        return "StrictMode";
      case ee:
        return "Suspense";
      case T:
        return "SuspenseList";
    }
    if (typeof t == "object") switch (t.$$typeof) {
      case H:
        return (t.displayName || "Context") + ".Consumer";
      case Z:
        return (t._context.displayName || "Context") + ".Provider";
      case L:
        var n = t.render;
        return t = t.displayName, t || (t = n.displayName || n.name || "", t = t !== "" ? "ForwardRef(" + t + ")" : "ForwardRef"), t;
      case Y:
        return n = t.displayName || null, n !== null ? n : ue(t.type) || "Memo";
      case O:
        n = t._payload, t = t._init;
        try {
          return ue(t(n));
        } catch {
        }
    }
    return null;
  }
  function de(t) {
    var n = t.type;
    switch (t.tag) {
      case 24:
        return "Cache";
      case 9:
        return (n.displayName || "Context") + ".Consumer";
      case 10:
        return (n._context.displayName || "Context") + ".Provider";
      case 18:
        return "DehydratedFragment";
      case 11:
        return t = n.render, t = t.displayName || t.name || "", n.displayName || (t !== "" ? "ForwardRef(" + t + ")" : "ForwardRef");
      case 7:
        return "Fragment";
      case 5:
        return n;
      case 4:
        return "Portal";
      case 3:
        return "Root";
      case 6:
        return "Text";
      case 16:
        return ue(n);
      case 8:
        return n === W ? "StrictMode" : "Mode";
      case 22:
        return "Offscreen";
      case 12:
        return "Profiler";
      case 21:
        return "Scope";
      case 13:
        return "Suspense";
      case 19:
        return "SuspenseList";
      case 25:
        return "TracingMarker";
      case 1:
      case 0:
      case 17:
      case 2:
      case 14:
      case 15:
        if (typeof n == "function") return n.displayName || n.name || null;
        if (typeof n == "string") return n;
    }
    return null;
  }
  function ne(t) {
    switch (typeof t) {
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return t;
      case "object":
        return t;
      default:
        return "";
    }
  }
  function fe(t) {
    var n = t.type;
    return (t = t.nodeName) && t.toLowerCase() === "input" && (n === "checkbox" || n === "radio");
  }
  function be(t) {
    var n = fe(t) ? "checked" : "value", a = Object.getOwnPropertyDescriptor(t.constructor.prototype, n), d = "" + t[n];
    if (!t.hasOwnProperty(n) && typeof a < "u" && typeof a.get == "function" && typeof a.set == "function") {
      var y = a.get, v = a.set;
      return Object.defineProperty(t, n, { configurable: !0, get: function() {
        return y.call(this);
      }, set: function(_) {
        d = "" + _, v.call(this, _);
      } }), Object.defineProperty(t, n, { enumerable: a.enumerable }), { getValue: function() {
        return d;
      }, setValue: function(_) {
        d = "" + _;
      }, stopTracking: function() {
        t._valueTracker = null, delete t[n];
      } };
    }
  }
  function Ne(t) {
    t._valueTracker || (t._valueTracker = be(t));
  }
  function Ce(t) {
    if (!t) return !1;
    var n = t._valueTracker;
    if (!n) return !0;
    var a = n.getValue(), d = "";
    return t && (d = fe(t) ? t.checked ? "true" : "false" : t.value), t = d, t !== a ? (n.setValue(t), !0) : !1;
  }
  function xe(t) {
    if (t = t || (typeof document < "u" ? document : void 0), typeof t > "u") return null;
    try {
      return t.activeElement || t.body;
    } catch {
      return t.body;
    }
  }
  function Te(t, n) {
    var a = n.checked;
    return K({}, n, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: a ?? t._wrapperState.initialChecked });
  }
  function Be(t, n) {
    var a = n.defaultValue == null ? "" : n.defaultValue, d = n.checked != null ? n.checked : n.defaultChecked;
    a = ne(n.value != null ? n.value : a), t._wrapperState = { initialChecked: d, initialValue: a, controlled: n.type === "checkbox" || n.type === "radio" ? n.checked != null : n.value != null };
  }
  function je(t, n) {
    n = n.checked, n != null && A(t, "checked", n, !1);
  }
  function We(t, n) {
    je(t, n);
    var a = ne(n.value), d = n.type;
    if (a != null) d === "number" ? (a === 0 && t.value === "" || t.value != a) && (t.value = "" + a) : t.value !== "" + a && (t.value = "" + a);
    else if (d === "submit" || d === "reset") {
      t.removeAttribute("value");
      return;
    }
    n.hasOwnProperty("value") ? vt(t, n.type, a) : n.hasOwnProperty("defaultValue") && vt(t, n.type, ne(n.defaultValue)), n.checked == null && n.defaultChecked != null && (t.defaultChecked = !!n.defaultChecked);
  }
  function Ft(t, n, a) {
    if (n.hasOwnProperty("value") || n.hasOwnProperty("defaultValue")) {
      var d = n.type;
      if (!(d !== "submit" && d !== "reset" || n.value !== void 0 && n.value !== null)) return;
      n = "" + t._wrapperState.initialValue, a || n === t.value || (t.value = n), t.defaultValue = n;
    }
    a = t.name, a !== "" && (t.name = ""), t.defaultChecked = !!t._wrapperState.initialChecked, a !== "" && (t.name = a);
  }
  function vt(t, n, a) {
    (n !== "number" || xe(t.ownerDocument) !== t) && (a == null ? t.defaultValue = "" + t._wrapperState.initialValue : t.defaultValue !== "" + a && (t.defaultValue = "" + a));
  }
  var xt = Array.isArray;
  function jt(t, n, a, d) {
    if (t = t.options, n) {
      n = {};
      for (var y = 0; y < a.length; y++) n["$" + a[y]] = !0;
      for (a = 0; a < t.length; a++) y = n.hasOwnProperty("$" + t[a].value), t[a].selected !== y && (t[a].selected = y), y && d && (t[a].defaultSelected = !0);
    } else {
      for (a = "" + ne(a), n = null, y = 0; y < t.length; y++) {
        if (t[y].value === a) {
          t[y].selected = !0, d && (t[y].defaultSelected = !0);
          return;
        }
        n !== null || t[y].disabled || (n = t[y]);
      }
      n !== null && (n.selected = !0);
    }
  }
  function cn(t, n) {
    if (n.dangerouslySetInnerHTML != null) throw Error(o(91));
    return K({}, n, { value: void 0, defaultValue: void 0, children: "" + t._wrapperState.initialValue });
  }
  function kn(t, n) {
    var a = n.value;
    if (a == null) {
      if (a = n.children, n = n.defaultValue, a != null) {
        if (n != null) throw Error(o(92));
        if (xt(a)) {
          if (1 < a.length) throw Error(o(93));
          a = a[0];
        }
        n = a;
      }
      n == null && (n = ""), a = n;
    }
    t._wrapperState = { initialValue: ne(a) };
  }
  function jr(t, n) {
    var a = ne(n.value), d = ne(n.defaultValue);
    a != null && (a = "" + a, a !== t.value && (t.value = a), n.defaultValue == null && t.defaultValue !== a && (t.defaultValue = a)), d != null && (t.defaultValue = "" + d);
  }
  function er(t) {
    var n = t.textContent;
    n === t._wrapperState.initialValue && n !== "" && n !== null && (t.value = n);
  }
  function un(t) {
    switch (t) {
      case "svg":
        return "http://www.w3.org/2000/svg";
      case "math":
        return "http://www.w3.org/1998/Math/MathML";
      default:
        return "http://www.w3.org/1999/xhtml";
    }
  }
  function dn(t, n) {
    return t == null || t === "http://www.w3.org/1999/xhtml" ? un(n) : t === "http://www.w3.org/2000/svg" && n === "foreignObject" ? "http://www.w3.org/1999/xhtml" : t;
  }
  var tr, Ba = (function(t) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(n, a, d, y) {
      MSApp.execUnsafeLocalFunction(function() {
        return t(n, a, d, y);
      });
    } : t;
  })(function(t, n) {
    if (t.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in t) t.innerHTML = n;
    else {
      for (tr = tr || document.createElement("div"), tr.innerHTML = "<svg>" + n.valueOf().toString() + "</svg>", n = tr.firstChild; t.firstChild; ) t.removeChild(t.firstChild);
      for (; n.firstChild; ) t.appendChild(n.firstChild);
    }
  });
  function fn(t, n) {
    if (n) {
      var a = t.firstChild;
      if (a && a === t.lastChild && a.nodeType === 3) {
        a.nodeValue = n;
        return;
      }
    }
    t.textContent = n;
  }
  var nr = {
    animationIterationCount: !0,
    aspectRatio: !0,
    borderImageOutset: !0,
    borderImageSlice: !0,
    borderImageWidth: !0,
    boxFlex: !0,
    boxFlexGroup: !0,
    boxOrdinalGroup: !0,
    columnCount: !0,
    columns: !0,
    flex: !0,
    flexGrow: !0,
    flexPositive: !0,
    flexShrink: !0,
    flexNegative: !0,
    flexOrder: !0,
    gridArea: !0,
    gridRow: !0,
    gridRowEnd: !0,
    gridRowSpan: !0,
    gridRowStart: !0,
    gridColumn: !0,
    gridColumnEnd: !0,
    gridColumnSpan: !0,
    gridColumnStart: !0,
    fontWeight: !0,
    lineClamp: !0,
    lineHeight: !0,
    opacity: !0,
    order: !0,
    orphans: !0,
    tabSize: !0,
    widows: !0,
    zIndex: !0,
    zoom: !0,
    fillOpacity: !0,
    floodOpacity: !0,
    stopOpacity: !0,
    strokeDasharray: !0,
    strokeDashoffset: !0,
    strokeMiterlimit: !0,
    strokeOpacity: !0,
    strokeWidth: !0
  }, Fi = ["Webkit", "ms", "Moz", "O"];
  Object.keys(nr).forEach(function(t) {
    Fi.forEach(function(n) {
      n = n + t.charAt(0).toUpperCase() + t.substring(1), nr[n] = nr[t];
    });
  });
  function Ea(t, n, a) {
    return n == null || typeof n == "boolean" || n === "" ? "" : a || typeof n != "number" || n === 0 || nr.hasOwnProperty(t) && nr[t] ? ("" + n).trim() : n + "px";
  }
  function Da(t, n) {
    t = t.style;
    for (var a in n) if (n.hasOwnProperty(a)) {
      var d = a.indexOf("--") === 0, y = Ea(a, n[a], d);
      a === "float" && (a = "cssFloat"), d ? t.setProperty(a, y) : t[a] = y;
    }
  }
  var Pi = K({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
  function xo(t, n) {
    if (n) {
      if (Pi[t] && (n.children != null || n.dangerouslySetInnerHTML != null)) throw Error(o(137, t));
      if (n.dangerouslySetInnerHTML != null) {
        if (n.children != null) throw Error(o(60));
        if (typeof n.dangerouslySetInnerHTML != "object" || !("__html" in n.dangerouslySetInnerHTML)) throw Error(o(61));
      }
      if (n.style != null && typeof n.style != "object") throw Error(o(62));
    }
  }
  function Io(t, n) {
    if (t.indexOf("-") === -1) return typeof n.is == "string";
    switch (t) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return !1;
      default:
        return !0;
    }
  }
  var Co = null;
  function bo(t) {
    return t = t.target || t.srcElement || window, t.correspondingUseElement && (t = t.correspondingUseElement), t.nodeType === 3 ? t.parentNode : t;
  }
  var No = null, jn = null, Mn = null;
  function Ga(t) {
    if (t = Uo(t)) {
      if (typeof No != "function") throw Error(o(280));
      var n = t.stateNode;
      n && (n = fs(n), No(t.stateNode, t.type, n));
    }
  }
  function Fa(t) {
    jn ? Mn ? Mn.push(t) : Mn = [t] : jn = t;
  }
  function Pa() {
    if (jn) {
      var t = jn, n = Mn;
      if (Mn = jn = null, Ga(t), n) for (t = 0; t < n.length; t++) Ga(n[t]);
    }
  }
  function za(t, n) {
    return t(n);
  }
  function Va() {
  }
  var _o = !1;
  function Oa(t, n, a) {
    if (_o) return t(n, a);
    _o = !0;
    try {
      return za(t, n, a);
    } finally {
      _o = !1, (jn !== null || Mn !== null) && (Va(), Pa());
    }
  }
  function rr(t, n) {
    var a = t.stateNode;
    if (a === null) return null;
    var d = fs(a);
    if (d === null) return null;
    a = d[n];
    e: switch (n) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        (d = !d.disabled) || (t = t.type, d = !(t === "button" || t === "input" || t === "select" || t === "textarea")), t = !d;
        break e;
      default:
        t = !1;
    }
    if (t) return null;
    if (a && typeof a != "function") throw Error(o(231, n, typeof a));
    return a;
  }
  var Ao = !1;
  if (u) try {
    var or = {};
    Object.defineProperty(or, "passive", { get: function() {
      Ao = !0;
    } }), window.addEventListener("test", or, or), window.removeEventListener("test", or, or);
  } catch {
    Ao = !1;
  }
  function zi(t, n, a, d, y, v, _, B, z) {
    var q = Array.prototype.slice.call(arguments, 3);
    try {
      n.apply(a, q);
    } catch (se) {
      this.onError(se);
    }
  }
  var ar = !1, Mr = null, Tr = !1, So = null, Vi = { onError: function(t) {
    ar = !0, Mr = t;
  } };
  function Oi(t, n, a, d, y, v, _, B, z) {
    ar = !1, Mr = null, zi.apply(Vi, arguments);
  }
  function Hi(t, n, a, d, y, v, _, B, z) {
    if (Oi.apply(this, arguments), ar) {
      if (ar) {
        var q = Mr;
        ar = !1, Mr = null;
      } else throw Error(o(198));
      Tr || (Tr = !0, So = q);
    }
  }
  function Qt(t) {
    var n = t, a = t;
    if (t.alternate) for (; n.return; ) n = n.return;
    else {
      t = n;
      do
        n = t, (n.flags & 4098) !== 0 && (a = n.return), t = n.return;
      while (t);
    }
    return n.tag === 3 ? a : null;
  }
  function ko(t) {
    if (t.tag === 13) {
      var n = t.memoizedState;
      if (n === null && (t = t.alternate, t !== null && (n = t.memoizedState)), n !== null) return n.dehydrated;
    }
    return null;
  }
  function jo(t) {
    if (Qt(t) !== t) throw Error(o(188));
  }
  function Wi(t) {
    var n = t.alternate;
    if (!n) {
      if (n = Qt(t), n === null) throw Error(o(188));
      return n !== t ? null : t;
    }
    for (var a = t, d = n; ; ) {
      var y = a.return;
      if (y === null) break;
      var v = y.alternate;
      if (v === null) {
        if (d = y.return, d !== null) {
          a = d;
          continue;
        }
        break;
      }
      if (y.child === v.child) {
        for (v = y.child; v; ) {
          if (v === a) return jo(y), t;
          if (v === d) return jo(y), n;
          v = v.sibling;
        }
        throw Error(o(188));
      }
      if (a.return !== d.return) a = y, d = v;
      else {
        for (var _ = !1, B = y.child; B; ) {
          if (B === a) {
            _ = !0, a = y, d = v;
            break;
          }
          if (B === d) {
            _ = !0, d = y, a = v;
            break;
          }
          B = B.sibling;
        }
        if (!_) {
          for (B = v.child; B; ) {
            if (B === a) {
              _ = !0, a = v, d = y;
              break;
            }
            if (B === d) {
              _ = !0, d = v, a = y;
              break;
            }
            B = B.sibling;
          }
          if (!_) throw Error(o(189));
        }
      }
      if (a.alternate !== d) throw Error(o(190));
    }
    if (a.tag !== 3) throw Error(o(188));
    return a.stateNode.current === a ? t : n;
  }
  function Ha(t) {
    return t = Wi(t), t !== null ? Wa(t) : null;
  }
  function Wa(t) {
    if (t.tag === 5 || t.tag === 6) return t;
    for (t = t.child; t !== null; ) {
      var n = Wa(t);
      if (n !== null) return n;
      t = t.sibling;
    }
    return null;
  }
  var Xa = r.unstable_scheduleCallback, La = r.unstable_cancelCallback, Xi = r.unstable_shouldYield, Ka = r.unstable_requestPaint, Xe = r.unstable_now, Li = r.unstable_getCurrentPriorityLevel, Mo = r.unstable_ImmediatePriority, Za = r.unstable_UserBlockingPriority, Rr = r.unstable_NormalPriority, Ki = r.unstable_LowPriority, Ya = r.unstable_IdlePriority, sr = null, Mt = null;
  function Zi(t) {
    if (Mt && typeof Mt.onCommitFiberRoot == "function") try {
      Mt.onCommitFiberRoot(sr, t, void 0, (t.current.flags & 128) === 128);
    } catch {
    }
  }
  var It = Math.clz32 ? Math.clz32 : $i, Yi = Math.log, Ui = Math.LN2;
  function $i(t) {
    return t >>>= 0, t === 0 ? 32 : 31 - (Yi(t) / Ui | 0) | 0;
  }
  var Br = 64, Er = 4194304;
  function Jt(t) {
    switch (t & -t) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return t & 4194240;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return t & 130023424;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 1073741824;
      default:
        return t;
    }
  }
  function Dr(t, n) {
    var a = t.pendingLanes;
    if (a === 0) return 0;
    var d = 0, y = t.suspendedLanes, v = t.pingedLanes, _ = a & 268435455;
    if (_ !== 0) {
      var B = _ & ~y;
      B !== 0 ? d = Jt(B) : (v &= _, v !== 0 && (d = Jt(v)));
    } else _ = a & ~y, _ !== 0 ? d = Jt(_) : v !== 0 && (d = Jt(v));
    if (d === 0) return 0;
    if (n !== 0 && n !== d && (n & y) === 0 && (y = d & -d, v = n & -n, y >= v || y === 16 && (v & 4194240) !== 0)) return n;
    if ((d & 4) !== 0 && (d |= a & 16), n = t.entangledLanes, n !== 0) for (t = t.entanglements, n &= d; 0 < n; ) a = 31 - It(n), y = 1 << a, d |= t[a], n &= ~y;
    return d;
  }
  function Ua(t, n) {
    switch (t) {
      case 1:
      case 2:
      case 4:
        return n + 250;
      case 8:
      case 16:
      case 32:
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return n + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return -1;
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function Qi(t, n) {
    for (var a = t.suspendedLanes, d = t.pingedLanes, y = t.expirationTimes, v = t.pendingLanes; 0 < v; ) {
      var _ = 31 - It(v), B = 1 << _, z = y[_];
      z === -1 ? ((B & a) === 0 || (B & d) !== 0) && (y[_] = Ua(B, n)) : z <= n && (t.expiredLanes |= B), v &= ~B;
    }
  }
  function To(t) {
    return t = t.pendingLanes & -1073741825, t !== 0 ? t : t & 1073741824 ? 1073741824 : 0;
  }
  function Gr() {
    var t = Br;
    return Br <<= 1, (Br & 4194240) === 0 && (Br = 64), t;
  }
  function Ro(t) {
    for (var n = [], a = 0; 31 > a; a++) n.push(t);
    return n;
  }
  function ir(t, n, a) {
    t.pendingLanes |= n, n !== 536870912 && (t.suspendedLanes = 0, t.pingedLanes = 0), t = t.eventTimes, n = 31 - It(n), t[n] = a;
  }
  function $a(t, n) {
    var a = t.pendingLanes & ~n;
    t.pendingLanes = n, t.suspendedLanes = 0, t.pingedLanes = 0, t.expiredLanes &= n, t.mutableReadLanes &= n, t.entangledLanes &= n, n = t.entanglements;
    var d = t.eventTimes;
    for (t = t.expirationTimes; 0 < a; ) {
      var y = 31 - It(a), v = 1 << y;
      n[y] = 0, d[y] = -1, t[y] = -1, a &= ~v;
    }
  }
  function Ji(t, n) {
    var a = t.entangledLanes |= n;
    for (t = t.entanglements; a; ) {
      var d = 31 - It(a), y = 1 << d;
      y & n | t[d] & n && (t[d] |= n), a &= ~y;
    }
  }
  var Ge = 0;
  function Pu(t) {
    return t &= -t, 1 < t ? 4 < t ? (t & 268435455) !== 0 ? 16 : 536870912 : 4 : 1;
  }
  var zu, qi, Vu, Ou, Hu, el = !1, Qa = [], Tn = null, Rn = null, Bn = null, Bo = /* @__PURE__ */ new Map(), Eo = /* @__PURE__ */ new Map(), En = [], cw = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  function Wu(t, n) {
    switch (t) {
      case "focusin":
      case "focusout":
        Tn = null;
        break;
      case "dragenter":
      case "dragleave":
        Rn = null;
        break;
      case "mouseover":
      case "mouseout":
        Bn = null;
        break;
      case "pointerover":
      case "pointerout":
        Bo.delete(n.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        Eo.delete(n.pointerId);
    }
  }
  function Do(t, n, a, d, y, v) {
    return t === null || t.nativeEvent !== v ? (t = { blockedOn: n, domEventName: a, eventSystemFlags: d, nativeEvent: v, targetContainers: [y] }, n !== null && (n = Uo(n), n !== null && qi(n)), t) : (t.eventSystemFlags |= d, n = t.targetContainers, y !== null && n.indexOf(y) === -1 && n.push(y), t);
  }
  function uw(t, n, a, d, y) {
    switch (n) {
      case "focusin":
        return Tn = Do(Tn, t, n, a, d, y), !0;
      case "dragenter":
        return Rn = Do(Rn, t, n, a, d, y), !0;
      case "mouseover":
        return Bn = Do(Bn, t, n, a, d, y), !0;
      case "pointerover":
        var v = y.pointerId;
        return Bo.set(v, Do(Bo.get(v) || null, t, n, a, d, y)), !0;
      case "gotpointercapture":
        return v = y.pointerId, Eo.set(v, Do(Eo.get(v) || null, t, n, a, d, y)), !0;
    }
    return !1;
  }
  function Xu(t) {
    var n = lr(t.target);
    if (n !== null) {
      var a = Qt(n);
      if (a !== null) {
        if (n = a.tag, n === 13) {
          if (n = ko(a), n !== null) {
            t.blockedOn = n, Hu(t.priority, function() {
              Vu(a);
            });
            return;
          }
        } else if (n === 3 && a.stateNode.current.memoizedState.isDehydrated) {
          t.blockedOn = a.tag === 3 ? a.stateNode.containerInfo : null;
          return;
        }
      }
    }
    t.blockedOn = null;
  }
  function Ja(t) {
    if (t.blockedOn !== null) return !1;
    for (var n = t.targetContainers; 0 < n.length; ) {
      var a = nl(t.domEventName, t.eventSystemFlags, n[0], t.nativeEvent);
      if (a === null) {
        a = t.nativeEvent;
        var d = new a.constructor(a.type, a);
        Co = d, a.target.dispatchEvent(d), Co = null;
      } else return n = Uo(a), n !== null && qi(n), t.blockedOn = a, !1;
      n.shift();
    }
    return !0;
  }
  function Lu(t, n, a) {
    Ja(t) && a.delete(n);
  }
  function dw() {
    el = !1, Tn !== null && Ja(Tn) && (Tn = null), Rn !== null && Ja(Rn) && (Rn = null), Bn !== null && Ja(Bn) && (Bn = null), Bo.forEach(Lu), Eo.forEach(Lu);
  }
  function Go(t, n) {
    t.blockedOn === n && (t.blockedOn = null, el || (el = !0, r.unstable_scheduleCallback(r.unstable_NormalPriority, dw)));
  }
  function Fo(t) {
    function n(y) {
      return Go(y, t);
    }
    if (0 < Qa.length) {
      Go(Qa[0], t);
      for (var a = 1; a < Qa.length; a++) {
        var d = Qa[a];
        d.blockedOn === t && (d.blockedOn = null);
      }
    }
    for (Tn !== null && Go(Tn, t), Rn !== null && Go(Rn, t), Bn !== null && Go(Bn, t), Bo.forEach(n), Eo.forEach(n), a = 0; a < En.length; a++) d = En[a], d.blockedOn === t && (d.blockedOn = null);
    for (; 0 < En.length && (a = En[0], a.blockedOn === null); ) Xu(a), a.blockedOn === null && En.shift();
  }
  var Fr = S.ReactCurrentBatchConfig, qa = !0;
  function fw(t, n, a, d) {
    var y = Ge, v = Fr.transition;
    Fr.transition = null;
    try {
      Ge = 1, tl(t, n, a, d);
    } finally {
      Ge = y, Fr.transition = v;
    }
  }
  function pw(t, n, a, d) {
    var y = Ge, v = Fr.transition;
    Fr.transition = null;
    try {
      Ge = 4, tl(t, n, a, d);
    } finally {
      Ge = y, Fr.transition = v;
    }
  }
  function tl(t, n, a, d) {
    if (qa) {
      var y = nl(t, n, a, d);
      if (y === null) vl(t, n, d, es, a), Wu(t, d);
      else if (uw(y, t, n, a, d)) d.stopPropagation();
      else if (Wu(t, d), n & 4 && -1 < cw.indexOf(t)) {
        for (; y !== null; ) {
          var v = Uo(y);
          if (v !== null && zu(v), v = nl(t, n, a, d), v === null && vl(t, n, d, es, a), v === y) break;
          y = v;
        }
        y !== null && d.stopPropagation();
      } else vl(t, n, d, null, a);
    }
  }
  var es = null;
  function nl(t, n, a, d) {
    if (es = null, t = bo(d), t = lr(t), t !== null) if (n = Qt(t), n === null) t = null;
    else if (a = n.tag, a === 13) {
      if (t = ko(n), t !== null) return t;
      t = null;
    } else if (a === 3) {
      if (n.stateNode.current.memoizedState.isDehydrated) return n.tag === 3 ? n.stateNode.containerInfo : null;
      t = null;
    } else n !== t && (t = null);
    return es = t, null;
  }
  function Ku(t) {
    switch (t) {
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "resize":
      case "seeked":
      case "submit":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 1;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "scroll":
      case "toggle":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 4;
      case "message":
        switch (Li()) {
          case Mo:
            return 1;
          case Za:
            return 4;
          case Rr:
          case Ki:
            return 16;
          case Ya:
            return 536870912;
          default:
            return 16;
        }
      default:
        return 16;
    }
  }
  var Dn = null, rl = null, ts = null;
  function Zu() {
    if (ts) return ts;
    var t, n = rl, a = n.length, d, y = "value" in Dn ? Dn.value : Dn.textContent, v = y.length;
    for (t = 0; t < a && n[t] === y[t]; t++) ;
    var _ = a - t;
    for (d = 1; d <= _ && n[a - d] === y[v - d]; d++) ;
    return ts = y.slice(t, 1 < d ? 1 - d : void 0);
  }
  function ns(t) {
    var n = t.keyCode;
    return "charCode" in t ? (t = t.charCode, t === 0 && n === 13 && (t = 13)) : t = n, t === 10 && (t = 13), 32 <= t || t === 13 ? t : 0;
  }
  function rs() {
    return !0;
  }
  function Yu() {
    return !1;
  }
  function Ct(t) {
    function n(a, d, y, v, _) {
      this._reactName = a, this._targetInst = y, this.type = d, this.nativeEvent = v, this.target = _, this.currentTarget = null;
      for (var B in t) t.hasOwnProperty(B) && (a = t[B], this[B] = a ? a(v) : v[B]);
      return this.isDefaultPrevented = (v.defaultPrevented != null ? v.defaultPrevented : v.returnValue === !1) ? rs : Yu, this.isPropagationStopped = Yu, this;
    }
    return K(n.prototype, { preventDefault: function() {
      this.defaultPrevented = !0;
      var a = this.nativeEvent;
      a && (a.preventDefault ? a.preventDefault() : typeof a.returnValue != "unknown" && (a.returnValue = !1), this.isDefaultPrevented = rs);
    }, stopPropagation: function() {
      var a = this.nativeEvent;
      a && (a.stopPropagation ? a.stopPropagation() : typeof a.cancelBubble != "unknown" && (a.cancelBubble = !0), this.isPropagationStopped = rs);
    }, persist: function() {
    }, isPersistent: rs }), n;
  }
  var Pr = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(t) {
    return t.timeStamp || Date.now();
  }, defaultPrevented: 0, isTrusted: 0 }, ol = Ct(Pr), Po = K({}, Pr, { view: 0, detail: 0 }), gw = Ct(Po), al, sl, zo, os = K({}, Po, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: ll, button: 0, buttons: 0, relatedTarget: function(t) {
    return t.relatedTarget === void 0 ? t.fromElement === t.srcElement ? t.toElement : t.fromElement : t.relatedTarget;
  }, movementX: function(t) {
    return "movementX" in t ? t.movementX : (t !== zo && (zo && t.type === "mousemove" ? (al = t.screenX - zo.screenX, sl = t.screenY - zo.screenY) : sl = al = 0, zo = t), al);
  }, movementY: function(t) {
    return "movementY" in t ? t.movementY : sl;
  } }), Uu = Ct(os), mw = K({}, os, { dataTransfer: 0 }), hw = Ct(mw), yw = K({}, Po, { relatedTarget: 0 }), il = Ct(yw), ww = K({}, Pr, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), vw = Ct(ww), xw = K({}, Pr, { clipboardData: function(t) {
    return "clipboardData" in t ? t.clipboardData : window.clipboardData;
  } }), Iw = Ct(xw), Cw = K({}, Pr, { data: 0 }), $u = Ct(Cw), bw = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified"
  }, Nw = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta"
  }, _w = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function Aw(t) {
    var n = this.nativeEvent;
    return n.getModifierState ? n.getModifierState(t) : (t = _w[t]) ? !!n[t] : !1;
  }
  function ll() {
    return Aw;
  }
  var Sw = K({}, Po, { key: function(t) {
    if (t.key) {
      var n = bw[t.key] || t.key;
      if (n !== "Unidentified") return n;
    }
    return t.type === "keypress" ? (t = ns(t), t === 13 ? "Enter" : String.fromCharCode(t)) : t.type === "keydown" || t.type === "keyup" ? Nw[t.keyCode] || "Unidentified" : "";
  }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: ll, charCode: function(t) {
    return t.type === "keypress" ? ns(t) : 0;
  }, keyCode: function(t) {
    return t.type === "keydown" || t.type === "keyup" ? t.keyCode : 0;
  }, which: function(t) {
    return t.type === "keypress" ? ns(t) : t.type === "keydown" || t.type === "keyup" ? t.keyCode : 0;
  } }), kw = Ct(Sw), jw = K({}, os, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), Qu = Ct(jw), Mw = K({}, Po, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: ll }), Tw = Ct(Mw), Rw = K({}, Pr, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), Bw = Ct(Rw), Ew = K({}, os, {
    deltaX: function(t) {
      return "deltaX" in t ? t.deltaX : "wheelDeltaX" in t ? -t.wheelDeltaX : 0;
    },
    deltaY: function(t) {
      return "deltaY" in t ? t.deltaY : "wheelDeltaY" in t ? -t.wheelDeltaY : "wheelDelta" in t ? -t.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), Dw = Ct(Ew), Gw = [9, 13, 27, 32], cl = u && "CompositionEvent" in window, Vo = null;
  u && "documentMode" in document && (Vo = document.documentMode);
  var Fw = u && "TextEvent" in window && !Vo, Ju = u && (!cl || Vo && 8 < Vo && 11 >= Vo), qu = " ", ed = !1;
  function td(t, n) {
    switch (t) {
      case "keyup":
        return Gw.indexOf(n.keyCode) !== -1;
      case "keydown":
        return n.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function nd(t) {
    return t = t.detail, typeof t == "object" && "data" in t ? t.data : null;
  }
  var zr = !1;
  function Pw(t, n) {
    switch (t) {
      case "compositionend":
        return nd(n);
      case "keypress":
        return n.which !== 32 ? null : (ed = !0, qu);
      case "textInput":
        return t = n.data, t === qu && ed ? null : t;
      default:
        return null;
    }
  }
  function zw(t, n) {
    if (zr) return t === "compositionend" || !cl && td(t, n) ? (t = Zu(), ts = rl = Dn = null, zr = !1, t) : null;
    switch (t) {
      case "paste":
        return null;
      case "keypress":
        if (!(n.ctrlKey || n.altKey || n.metaKey) || n.ctrlKey && n.altKey) {
          if (n.char && 1 < n.char.length) return n.char;
          if (n.which) return String.fromCharCode(n.which);
        }
        return null;
      case "compositionend":
        return Ju && n.locale !== "ko" ? null : n.data;
      default:
        return null;
    }
  }
  var Vw = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
  function rd(t) {
    var n = t && t.nodeName && t.nodeName.toLowerCase();
    return n === "input" ? !!Vw[t.type] : n === "textarea";
  }
  function od(t, n, a, d) {
    Fa(d), n = cs(n, "onChange"), 0 < n.length && (a = new ol("onChange", "change", null, a, d), t.push({ event: a, listeners: n }));
  }
  var Oo = null, Ho = null;
  function Ow(t) {
    Cd(t, 0);
  }
  function as(t) {
    var n = Xr(t);
    if (Ce(n)) return t;
  }
  function Hw(t, n) {
    if (t === "change") return n;
  }
  var ad = !1;
  if (u) {
    var ul;
    if (u) {
      var dl = "oninput" in document;
      if (!dl) {
        var sd = document.createElement("div");
        sd.setAttribute("oninput", "return;"), dl = typeof sd.oninput == "function";
      }
      ul = dl;
    } else ul = !1;
    ad = ul && (!document.documentMode || 9 < document.documentMode);
  }
  function id() {
    Oo && (Oo.detachEvent("onpropertychange", ld), Ho = Oo = null);
  }
  function ld(t) {
    if (t.propertyName === "value" && as(Ho)) {
      var n = [];
      od(n, Ho, t, bo(t)), Oa(Ow, n);
    }
  }
  function Ww(t, n, a) {
    t === "focusin" ? (id(), Oo = n, Ho = a, Oo.attachEvent("onpropertychange", ld)) : t === "focusout" && id();
  }
  function Xw(t) {
    if (t === "selectionchange" || t === "keyup" || t === "keydown") return as(Ho);
  }
  function Lw(t, n) {
    if (t === "click") return as(n);
  }
  function Kw(t, n) {
    if (t === "input" || t === "change") return as(n);
  }
  function Zw(t, n) {
    return t === n && (t !== 0 || 1 / t === 1 / n) || t !== t && n !== n;
  }
  var Pt = typeof Object.is == "function" ? Object.is : Zw;
  function Wo(t, n) {
    if (Pt(t, n)) return !0;
    if (typeof t != "object" || t === null || typeof n != "object" || n === null) return !1;
    var a = Object.keys(t), d = Object.keys(n);
    if (a.length !== d.length) return !1;
    for (d = 0; d < a.length; d++) {
      var y = a[d];
      if (!p.call(n, y) || !Pt(t[y], n[y])) return !1;
    }
    return !0;
  }
  function cd(t) {
    for (; t && t.firstChild; ) t = t.firstChild;
    return t;
  }
  function ud(t, n) {
    var a = cd(t);
    t = 0;
    for (var d; a; ) {
      if (a.nodeType === 3) {
        if (d = t + a.textContent.length, t <= n && d >= n) return { node: a, offset: n - t };
        t = d;
      }
      e: {
        for (; a; ) {
          if (a.nextSibling) {
            a = a.nextSibling;
            break e;
          }
          a = a.parentNode;
        }
        a = void 0;
      }
      a = cd(a);
    }
  }
  function dd(t, n) {
    return t && n ? t === n ? !0 : t && t.nodeType === 3 ? !1 : n && n.nodeType === 3 ? dd(t, n.parentNode) : "contains" in t ? t.contains(n) : t.compareDocumentPosition ? !!(t.compareDocumentPosition(n) & 16) : !1 : !1;
  }
  function fd() {
    for (var t = window, n = xe(); n instanceof t.HTMLIFrameElement; ) {
      try {
        var a = typeof n.contentWindow.location.href == "string";
      } catch {
        a = !1;
      }
      if (a) t = n.contentWindow;
      else break;
      n = xe(t.document);
    }
    return n;
  }
  function fl(t) {
    var n = t && t.nodeName && t.nodeName.toLowerCase();
    return n && (n === "input" && (t.type === "text" || t.type === "search" || t.type === "tel" || t.type === "url" || t.type === "password") || n === "textarea" || t.contentEditable === "true");
  }
  function Yw(t) {
    var n = fd(), a = t.focusedElem, d = t.selectionRange;
    if (n !== a && a && a.ownerDocument && dd(a.ownerDocument.documentElement, a)) {
      if (d !== null && fl(a)) {
        if (n = d.start, t = d.end, t === void 0 && (t = n), "selectionStart" in a) a.selectionStart = n, a.selectionEnd = Math.min(t, a.value.length);
        else if (t = (n = a.ownerDocument || document) && n.defaultView || window, t.getSelection) {
          t = t.getSelection();
          var y = a.textContent.length, v = Math.min(d.start, y);
          d = d.end === void 0 ? v : Math.min(d.end, y), !t.extend && v > d && (y = d, d = v, v = y), y = ud(a, v);
          var _ = ud(
            a,
            d
          );
          y && _ && (t.rangeCount !== 1 || t.anchorNode !== y.node || t.anchorOffset !== y.offset || t.focusNode !== _.node || t.focusOffset !== _.offset) && (n = n.createRange(), n.setStart(y.node, y.offset), t.removeAllRanges(), v > d ? (t.addRange(n), t.extend(_.node, _.offset)) : (n.setEnd(_.node, _.offset), t.addRange(n)));
        }
      }
      for (n = [], t = a; t = t.parentNode; ) t.nodeType === 1 && n.push({ element: t, left: t.scrollLeft, top: t.scrollTop });
      for (typeof a.focus == "function" && a.focus(), a = 0; a < n.length; a++) t = n[a], t.element.scrollLeft = t.left, t.element.scrollTop = t.top;
    }
  }
  var Uw = u && "documentMode" in document && 11 >= document.documentMode, Vr = null, pl = null, Xo = null, gl = !1;
  function pd(t, n, a) {
    var d = a.window === a ? a.document : a.nodeType === 9 ? a : a.ownerDocument;
    gl || Vr == null || Vr !== xe(d) || (d = Vr, "selectionStart" in d && fl(d) ? d = { start: d.selectionStart, end: d.selectionEnd } : (d = (d.ownerDocument && d.ownerDocument.defaultView || window).getSelection(), d = { anchorNode: d.anchorNode, anchorOffset: d.anchorOffset, focusNode: d.focusNode, focusOffset: d.focusOffset }), Xo && Wo(Xo, d) || (Xo = d, d = cs(pl, "onSelect"), 0 < d.length && (n = new ol("onSelect", "select", null, n, a), t.push({ event: n, listeners: d }), n.target = Vr)));
  }
  function ss(t, n) {
    var a = {};
    return a[t.toLowerCase()] = n.toLowerCase(), a["Webkit" + t] = "webkit" + n, a["Moz" + t] = "moz" + n, a;
  }
  var Or = { animationend: ss("Animation", "AnimationEnd"), animationiteration: ss("Animation", "AnimationIteration"), animationstart: ss("Animation", "AnimationStart"), transitionend: ss("Transition", "TransitionEnd") }, ml = {}, gd = {};
  u && (gd = document.createElement("div").style, "AnimationEvent" in window || (delete Or.animationend.animation, delete Or.animationiteration.animation, delete Or.animationstart.animation), "TransitionEvent" in window || delete Or.transitionend.transition);
  function is(t) {
    if (ml[t]) return ml[t];
    if (!Or[t]) return t;
    var n = Or[t], a;
    for (a in n) if (n.hasOwnProperty(a) && a in gd) return ml[t] = n[a];
    return t;
  }
  var md = is("animationend"), hd = is("animationiteration"), yd = is("animationstart"), wd = is("transitionend"), vd = /* @__PURE__ */ new Map(), xd = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function Gn(t, n) {
    vd.set(t, n), l(n, [t]);
  }
  for (var hl = 0; hl < xd.length; hl++) {
    var yl = xd[hl], $w = yl.toLowerCase(), Qw = yl[0].toUpperCase() + yl.slice(1);
    Gn($w, "on" + Qw);
  }
  Gn(md, "onAnimationEnd"), Gn(hd, "onAnimationIteration"), Gn(yd, "onAnimationStart"), Gn("dblclick", "onDoubleClick"), Gn("focusin", "onFocus"), Gn("focusout", "onBlur"), Gn(wd, "onTransitionEnd"), c("onMouseEnter", ["mouseout", "mouseover"]), c("onMouseLeave", ["mouseout", "mouseover"]), c("onPointerEnter", ["pointerout", "pointerover"]), c("onPointerLeave", ["pointerout", "pointerover"]), l("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), l("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), l("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), l("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), l("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), l("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var Lo = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), Jw = new Set("cancel close invalid load scroll toggle".split(" ").concat(Lo));
  function Id(t, n, a) {
    var d = t.type || "unknown-event";
    t.currentTarget = a, Hi(d, n, void 0, t), t.currentTarget = null;
  }
  function Cd(t, n) {
    n = (n & 4) !== 0;
    for (var a = 0; a < t.length; a++) {
      var d = t[a], y = d.event;
      d = d.listeners;
      e: {
        var v = void 0;
        if (n) for (var _ = d.length - 1; 0 <= _; _--) {
          var B = d[_], z = B.instance, q = B.currentTarget;
          if (B = B.listener, z !== v && y.isPropagationStopped()) break e;
          Id(y, B, q), v = z;
        }
        else for (_ = 0; _ < d.length; _++) {
          if (B = d[_], z = B.instance, q = B.currentTarget, B = B.listener, z !== v && y.isPropagationStopped()) break e;
          Id(y, B, q), v = z;
        }
      }
    }
    if (Tr) throw t = So, Tr = !1, So = null, t;
  }
  function Pe(t, n) {
    var a = n[_l];
    a === void 0 && (a = n[_l] = /* @__PURE__ */ new Set());
    var d = t + "__bubble";
    a.has(d) || (bd(n, t, 2, !1), a.add(d));
  }
  function wl(t, n, a) {
    var d = 0;
    n && (d |= 4), bd(a, t, d, n);
  }
  var ls = "_reactListening" + Math.random().toString(36).slice(2);
  function Ko(t) {
    if (!t[ls]) {
      t[ls] = !0, s.forEach(function(a) {
        a !== "selectionchange" && (Jw.has(a) || wl(a, !1, t), wl(a, !0, t));
      });
      var n = t.nodeType === 9 ? t : t.ownerDocument;
      n === null || n[ls] || (n[ls] = !0, wl("selectionchange", !1, n));
    }
  }
  function bd(t, n, a, d) {
    switch (Ku(n)) {
      case 1:
        var y = fw;
        break;
      case 4:
        y = pw;
        break;
      default:
        y = tl;
    }
    a = y.bind(null, n, a, t), y = void 0, !Ao || n !== "touchstart" && n !== "touchmove" && n !== "wheel" || (y = !0), d ? y !== void 0 ? t.addEventListener(n, a, { capture: !0, passive: y }) : t.addEventListener(n, a, !0) : y !== void 0 ? t.addEventListener(n, a, { passive: y }) : t.addEventListener(n, a, !1);
  }
  function vl(t, n, a, d, y) {
    var v = d;
    if ((n & 1) === 0 && (n & 2) === 0 && d !== null) e: for (; ; ) {
      if (d === null) return;
      var _ = d.tag;
      if (_ === 3 || _ === 4) {
        var B = d.stateNode.containerInfo;
        if (B === y || B.nodeType === 8 && B.parentNode === y) break;
        if (_ === 4) for (_ = d.return; _ !== null; ) {
          var z = _.tag;
          if ((z === 3 || z === 4) && (z = _.stateNode.containerInfo, z === y || z.nodeType === 8 && z.parentNode === y)) return;
          _ = _.return;
        }
        for (; B !== null; ) {
          if (_ = lr(B), _ === null) return;
          if (z = _.tag, z === 5 || z === 6) {
            d = v = _;
            continue e;
          }
          B = B.parentNode;
        }
      }
      d = d.return;
    }
    Oa(function() {
      var q = v, se = bo(a), ie = [];
      e: {
        var ae = vd.get(t);
        if (ae !== void 0) {
          var ge = ol, he = t;
          switch (t) {
            case "keypress":
              if (ns(a) === 0) break e;
            case "keydown":
            case "keyup":
              ge = kw;
              break;
            case "focusin":
              he = "focus", ge = il;
              break;
            case "focusout":
              he = "blur", ge = il;
              break;
            case "beforeblur":
            case "afterblur":
              ge = il;
              break;
            case "click":
              if (a.button === 2) break e;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              ge = Uu;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              ge = hw;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              ge = Tw;
              break;
            case md:
            case hd:
            case yd:
              ge = vw;
              break;
            case wd:
              ge = Bw;
              break;
            case "scroll":
              ge = gw;
              break;
            case "wheel":
              ge = Dw;
              break;
            case "copy":
            case "cut":
            case "paste":
              ge = Iw;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              ge = Qu;
          }
          var we = (n & 4) !== 0, Ye = !we && t === "scroll", $ = we ? ae !== null ? ae + "Capture" : null : ae;
          we = [];
          for (var X = q, J; X !== null; ) {
            J = X;
            var ce = J.stateNode;
            if (J.tag === 5 && ce !== null && (J = ce, $ !== null && (ce = rr(X, $), ce != null && we.push(Zo(X, ce, J)))), Ye) break;
            X = X.return;
          }
          0 < we.length && (ae = new ge(ae, he, null, a, se), ie.push({ event: ae, listeners: we }));
        }
      }
      if ((n & 7) === 0) {
        e: {
          if (ae = t === "mouseover" || t === "pointerover", ge = t === "mouseout" || t === "pointerout", ae && a !== Co && (he = a.relatedTarget || a.fromElement) && (lr(he) || he[pn])) break e;
          if ((ge || ae) && (ae = se.window === se ? se : (ae = se.ownerDocument) ? ae.defaultView || ae.parentWindow : window, ge ? (he = a.relatedTarget || a.toElement, ge = q, he = he ? lr(he) : null, he !== null && (Ye = Qt(he), he !== Ye || he.tag !== 5 && he.tag !== 6) && (he = null)) : (ge = null, he = q), ge !== he)) {
            if (we = Uu, ce = "onMouseLeave", $ = "onMouseEnter", X = "mouse", (t === "pointerout" || t === "pointerover") && (we = Qu, ce = "onPointerLeave", $ = "onPointerEnter", X = "pointer"), Ye = ge == null ? ae : Xr(ge), J = he == null ? ae : Xr(he), ae = new we(ce, X + "leave", ge, a, se), ae.target = Ye, ae.relatedTarget = J, ce = null, lr(se) === q && (we = new we($, X + "enter", he, a, se), we.target = J, we.relatedTarget = Ye, ce = we), Ye = ce, ge && he) t: {
              for (we = ge, $ = he, X = 0, J = we; J; J = Hr(J)) X++;
              for (J = 0, ce = $; ce; ce = Hr(ce)) J++;
              for (; 0 < X - J; ) we = Hr(we), X--;
              for (; 0 < J - X; ) $ = Hr($), J--;
              for (; X--; ) {
                if (we === $ || $ !== null && we === $.alternate) break t;
                we = Hr(we), $ = Hr($);
              }
              we = null;
            }
            else we = null;
            ge !== null && Nd(ie, ae, ge, we, !1), he !== null && Ye !== null && Nd(ie, Ye, he, we, !0);
          }
        }
        e: {
          if (ae = q ? Xr(q) : window, ge = ae.nodeName && ae.nodeName.toLowerCase(), ge === "select" || ge === "input" && ae.type === "file") var Ie = Hw;
          else if (rd(ae)) if (ad) Ie = Kw;
          else {
            Ie = Xw;
            var _e = Ww;
          }
          else (ge = ae.nodeName) && ge.toLowerCase() === "input" && (ae.type === "checkbox" || ae.type === "radio") && (Ie = Lw);
          if (Ie && (Ie = Ie(t, q))) {
            od(ie, Ie, a, se);
            break e;
          }
          _e && _e(t, ae, q), t === "focusout" && (_e = ae._wrapperState) && _e.controlled && ae.type === "number" && vt(ae, "number", ae.value);
        }
        switch (_e = q ? Xr(q) : window, t) {
          case "focusin":
            (rd(_e) || _e.contentEditable === "true") && (Vr = _e, pl = q, Xo = null);
            break;
          case "focusout":
            Xo = pl = Vr = null;
            break;
          case "mousedown":
            gl = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            gl = !1, pd(ie, a, se);
            break;
          case "selectionchange":
            if (Uw) break;
          case "keydown":
          case "keyup":
            pd(ie, a, se);
        }
        var Ae;
        if (cl) e: {
          switch (t) {
            case "compositionstart":
              var ke = "onCompositionStart";
              break e;
            case "compositionend":
              ke = "onCompositionEnd";
              break e;
            case "compositionupdate":
              ke = "onCompositionUpdate";
              break e;
          }
          ke = void 0;
        }
        else zr ? td(t, a) && (ke = "onCompositionEnd") : t === "keydown" && a.keyCode === 229 && (ke = "onCompositionStart");
        ke && (Ju && a.locale !== "ko" && (zr || ke !== "onCompositionStart" ? ke === "onCompositionEnd" && zr && (Ae = Zu()) : (Dn = se, rl = "value" in Dn ? Dn.value : Dn.textContent, zr = !0)), _e = cs(q, ke), 0 < _e.length && (ke = new $u(ke, t, null, a, se), ie.push({ event: ke, listeners: _e }), Ae ? ke.data = Ae : (Ae = nd(a), Ae !== null && (ke.data = Ae)))), (Ae = Fw ? Pw(t, a) : zw(t, a)) && (q = cs(q, "onBeforeInput"), 0 < q.length && (se = new $u("onBeforeInput", "beforeinput", null, a, se), ie.push({ event: se, listeners: q }), se.data = Ae));
      }
      Cd(ie, n);
    });
  }
  function Zo(t, n, a) {
    return { instance: t, listener: n, currentTarget: a };
  }
  function cs(t, n) {
    for (var a = n + "Capture", d = []; t !== null; ) {
      var y = t, v = y.stateNode;
      y.tag === 5 && v !== null && (y = v, v = rr(t, a), v != null && d.unshift(Zo(t, v, y)), v = rr(t, n), v != null && d.push(Zo(t, v, y))), t = t.return;
    }
    return d;
  }
  function Hr(t) {
    if (t === null) return null;
    do
      t = t.return;
    while (t && t.tag !== 5);
    return t || null;
  }
  function Nd(t, n, a, d, y) {
    for (var v = n._reactName, _ = []; a !== null && a !== d; ) {
      var B = a, z = B.alternate, q = B.stateNode;
      if (z !== null && z === d) break;
      B.tag === 5 && q !== null && (B = q, y ? (z = rr(a, v), z != null && _.unshift(Zo(a, z, B))) : y || (z = rr(a, v), z != null && _.push(Zo(a, z, B)))), a = a.return;
    }
    _.length !== 0 && t.push({ event: n, listeners: _ });
  }
  var qw = /\r\n?/g, ev = /\u0000|\uFFFD/g;
  function _d(t) {
    return (typeof t == "string" ? t : "" + t).replace(qw, `
`).replace(ev, "");
  }
  function us(t, n, a) {
    if (n = _d(n), _d(t) !== n && a) throw Error(o(425));
  }
  function ds() {
  }
  var xl = null, Il = null;
  function Cl(t, n) {
    return t === "textarea" || t === "noscript" || typeof n.children == "string" || typeof n.children == "number" || typeof n.dangerouslySetInnerHTML == "object" && n.dangerouslySetInnerHTML !== null && n.dangerouslySetInnerHTML.__html != null;
  }
  var bl = typeof setTimeout == "function" ? setTimeout : void 0, tv = typeof clearTimeout == "function" ? clearTimeout : void 0, Ad = typeof Promise == "function" ? Promise : void 0, nv = typeof queueMicrotask == "function" ? queueMicrotask : typeof Ad < "u" ? function(t) {
    return Ad.resolve(null).then(t).catch(rv);
  } : bl;
  function rv(t) {
    setTimeout(function() {
      throw t;
    });
  }
  function Nl(t, n) {
    var a = n, d = 0;
    do {
      var y = a.nextSibling;
      if (t.removeChild(a), y && y.nodeType === 8) if (a = y.data, a === "/$") {
        if (d === 0) {
          t.removeChild(y), Fo(n);
          return;
        }
        d--;
      } else a !== "$" && a !== "$?" && a !== "$!" || d++;
      a = y;
    } while (a);
    Fo(n);
  }
  function Fn(t) {
    for (; t != null; t = t.nextSibling) {
      var n = t.nodeType;
      if (n === 1 || n === 3) break;
      if (n === 8) {
        if (n = t.data, n === "$" || n === "$!" || n === "$?") break;
        if (n === "/$") return null;
      }
    }
    return t;
  }
  function Sd(t) {
    t = t.previousSibling;
    for (var n = 0; t; ) {
      if (t.nodeType === 8) {
        var a = t.data;
        if (a === "$" || a === "$!" || a === "$?") {
          if (n === 0) return t;
          n--;
        } else a === "/$" && n++;
      }
      t = t.previousSibling;
    }
    return null;
  }
  var Wr = Math.random().toString(36).slice(2), qt = "__reactFiber$" + Wr, Yo = "__reactProps$" + Wr, pn = "__reactContainer$" + Wr, _l = "__reactEvents$" + Wr, ov = "__reactListeners$" + Wr, av = "__reactHandles$" + Wr;
  function lr(t) {
    var n = t[qt];
    if (n) return n;
    for (var a = t.parentNode; a; ) {
      if (n = a[pn] || a[qt]) {
        if (a = n.alternate, n.child !== null || a !== null && a.child !== null) for (t = Sd(t); t !== null; ) {
          if (a = t[qt]) return a;
          t = Sd(t);
        }
        return n;
      }
      t = a, a = t.parentNode;
    }
    return null;
  }
  function Uo(t) {
    return t = t[qt] || t[pn], !t || t.tag !== 5 && t.tag !== 6 && t.tag !== 13 && t.tag !== 3 ? null : t;
  }
  function Xr(t) {
    if (t.tag === 5 || t.tag === 6) return t.stateNode;
    throw Error(o(33));
  }
  function fs(t) {
    return t[Yo] || null;
  }
  var Al = [], Lr = -1;
  function Pn(t) {
    return { current: t };
  }
  function ze(t) {
    0 > Lr || (t.current = Al[Lr], Al[Lr] = null, Lr--);
  }
  function Fe(t, n) {
    Lr++, Al[Lr] = t.current, t.current = n;
  }
  var zn = {}, at = Pn(zn), ft = Pn(!1), cr = zn;
  function Kr(t, n) {
    var a = t.type.contextTypes;
    if (!a) return zn;
    var d = t.stateNode;
    if (d && d.__reactInternalMemoizedUnmaskedChildContext === n) return d.__reactInternalMemoizedMaskedChildContext;
    var y = {}, v;
    for (v in a) y[v] = n[v];
    return d && (t = t.stateNode, t.__reactInternalMemoizedUnmaskedChildContext = n, t.__reactInternalMemoizedMaskedChildContext = y), y;
  }
  function pt(t) {
    return t = t.childContextTypes, t != null;
  }
  function ps() {
    ze(ft), ze(at);
  }
  function kd(t, n, a) {
    if (at.current !== zn) throw Error(o(168));
    Fe(at, n), Fe(ft, a);
  }
  function jd(t, n, a) {
    var d = t.stateNode;
    if (n = n.childContextTypes, typeof d.getChildContext != "function") return a;
    d = d.getChildContext();
    for (var y in d) if (!(y in n)) throw Error(o(108, de(t) || "Unknown", y));
    return K({}, a, d);
  }
  function gs(t) {
    return t = (t = t.stateNode) && t.__reactInternalMemoizedMergedChildContext || zn, cr = at.current, Fe(at, t), Fe(ft, ft.current), !0;
  }
  function Md(t, n, a) {
    var d = t.stateNode;
    if (!d) throw Error(o(169));
    a ? (t = jd(t, n, cr), d.__reactInternalMemoizedMergedChildContext = t, ze(ft), ze(at), Fe(at, t)) : ze(ft), Fe(ft, a);
  }
  var gn = null, ms = !1, Sl = !1;
  function Td(t) {
    gn === null ? gn = [t] : gn.push(t);
  }
  function sv(t) {
    ms = !0, Td(t);
  }
  function Vn() {
    if (!Sl && gn !== null) {
      Sl = !0;
      var t = 0, n = Ge;
      try {
        var a = gn;
        for (Ge = 1; t < a.length; t++) {
          var d = a[t];
          do
            d = d(!0);
          while (d !== null);
        }
        gn = null, ms = !1;
      } catch (y) {
        throw gn !== null && (gn = gn.slice(t + 1)), Xa(Mo, Vn), y;
      } finally {
        Ge = n, Sl = !1;
      }
    }
    return null;
  }
  var Zr = [], Yr = 0, hs = null, ys = 0, Tt = [], Rt = 0, ur = null, mn = 1, hn = "";
  function dr(t, n) {
    Zr[Yr++] = ys, Zr[Yr++] = hs, hs = t, ys = n;
  }
  function Rd(t, n, a) {
    Tt[Rt++] = mn, Tt[Rt++] = hn, Tt[Rt++] = ur, ur = t;
    var d = mn;
    t = hn;
    var y = 32 - It(d) - 1;
    d &= ~(1 << y), a += 1;
    var v = 32 - It(n) + y;
    if (30 < v) {
      var _ = y - y % 5;
      v = (d & (1 << _) - 1).toString(32), d >>= _, y -= _, mn = 1 << 32 - It(n) + y | a << y | d, hn = v + t;
    } else mn = 1 << v | a << y | d, hn = t;
  }
  function kl(t) {
    t.return !== null && (dr(t, 1), Rd(t, 1, 0));
  }
  function jl(t) {
    for (; t === hs; ) hs = Zr[--Yr], Zr[Yr] = null, ys = Zr[--Yr], Zr[Yr] = null;
    for (; t === ur; ) ur = Tt[--Rt], Tt[Rt] = null, hn = Tt[--Rt], Tt[Rt] = null, mn = Tt[--Rt], Tt[Rt] = null;
  }
  var bt = null, Nt = null, Ve = !1, zt = null;
  function Bd(t, n) {
    var a = Gt(5, null, null, 0);
    a.elementType = "DELETED", a.stateNode = n, a.return = t, n = t.deletions, n === null ? (t.deletions = [a], t.flags |= 16) : n.push(a);
  }
  function Ed(t, n) {
    switch (t.tag) {
      case 5:
        var a = t.type;
        return n = n.nodeType !== 1 || a.toLowerCase() !== n.nodeName.toLowerCase() ? null : n, n !== null ? (t.stateNode = n, bt = t, Nt = Fn(n.firstChild), !0) : !1;
      case 6:
        return n = t.pendingProps === "" || n.nodeType !== 3 ? null : n, n !== null ? (t.stateNode = n, bt = t, Nt = null, !0) : !1;
      case 13:
        return n = n.nodeType !== 8 ? null : n, n !== null ? (a = ur !== null ? { id: mn, overflow: hn } : null, t.memoizedState = { dehydrated: n, treeContext: a, retryLane: 1073741824 }, a = Gt(18, null, null, 0), a.stateNode = n, a.return = t, t.child = a, bt = t, Nt = null, !0) : !1;
      default:
        return !1;
    }
  }
  function Ml(t) {
    return (t.mode & 1) !== 0 && (t.flags & 128) === 0;
  }
  function Tl(t) {
    if (Ve) {
      var n = Nt;
      if (n) {
        var a = n;
        if (!Ed(t, n)) {
          if (Ml(t)) throw Error(o(418));
          n = Fn(a.nextSibling);
          var d = bt;
          n && Ed(t, n) ? Bd(d, a) : (t.flags = t.flags & -4097 | 2, Ve = !1, bt = t);
        }
      } else {
        if (Ml(t)) throw Error(o(418));
        t.flags = t.flags & -4097 | 2, Ve = !1, bt = t;
      }
    }
  }
  function Dd(t) {
    for (t = t.return; t !== null && t.tag !== 5 && t.tag !== 3 && t.tag !== 13; ) t = t.return;
    bt = t;
  }
  function ws(t) {
    if (t !== bt) return !1;
    if (!Ve) return Dd(t), Ve = !0, !1;
    var n;
    if ((n = t.tag !== 3) && !(n = t.tag !== 5) && (n = t.type, n = n !== "head" && n !== "body" && !Cl(t.type, t.memoizedProps)), n && (n = Nt)) {
      if (Ml(t)) throw Gd(), Error(o(418));
      for (; n; ) Bd(t, n), n = Fn(n.nextSibling);
    }
    if (Dd(t), t.tag === 13) {
      if (t = t.memoizedState, t = t !== null ? t.dehydrated : null, !t) throw Error(o(317));
      e: {
        for (t = t.nextSibling, n = 0; t; ) {
          if (t.nodeType === 8) {
            var a = t.data;
            if (a === "/$") {
              if (n === 0) {
                Nt = Fn(t.nextSibling);
                break e;
              }
              n--;
            } else a !== "$" && a !== "$!" && a !== "$?" || n++;
          }
          t = t.nextSibling;
        }
        Nt = null;
      }
    } else Nt = bt ? Fn(t.stateNode.nextSibling) : null;
    return !0;
  }
  function Gd() {
    for (var t = Nt; t; ) t = Fn(t.nextSibling);
  }
  function Ur() {
    Nt = bt = null, Ve = !1;
  }
  function Rl(t) {
    zt === null ? zt = [t] : zt.push(t);
  }
  var iv = S.ReactCurrentBatchConfig;
  function $o(t, n, a) {
    if (t = a.ref, t !== null && typeof t != "function" && typeof t != "object") {
      if (a._owner) {
        if (a = a._owner, a) {
          if (a.tag !== 1) throw Error(o(309));
          var d = a.stateNode;
        }
        if (!d) throw Error(o(147, t));
        var y = d, v = "" + t;
        return n !== null && n.ref !== null && typeof n.ref == "function" && n.ref._stringRef === v ? n.ref : (n = function(_) {
          var B = y.refs;
          _ === null ? delete B[v] : B[v] = _;
        }, n._stringRef = v, n);
      }
      if (typeof t != "string") throw Error(o(284));
      if (!a._owner) throw Error(o(290, t));
    }
    return t;
  }
  function vs(t, n) {
    throw t = Object.prototype.toString.call(n), Error(o(31, t === "[object Object]" ? "object with keys {" + Object.keys(n).join(", ") + "}" : t));
  }
  function Fd(t) {
    var n = t._init;
    return n(t._payload);
  }
  function Pd(t) {
    function n($, X) {
      if (t) {
        var J = $.deletions;
        J === null ? ($.deletions = [X], $.flags |= 16) : J.push(X);
      }
    }
    function a($, X) {
      if (!t) return null;
      for (; X !== null; ) n($, X), X = X.sibling;
      return null;
    }
    function d($, X) {
      for ($ = /* @__PURE__ */ new Map(); X !== null; ) X.key !== null ? $.set(X.key, X) : $.set(X.index, X), X = X.sibling;
      return $;
    }
    function y($, X) {
      return $ = Yn($, X), $.index = 0, $.sibling = null, $;
    }
    function v($, X, J) {
      return $.index = J, t ? (J = $.alternate, J !== null ? (J = J.index, J < X ? ($.flags |= 2, X) : J) : ($.flags |= 2, X)) : ($.flags |= 1048576, X);
    }
    function _($) {
      return t && $.alternate === null && ($.flags |= 2), $;
    }
    function B($, X, J, ce) {
      return X === null || X.tag !== 6 ? (X = bc(J, $.mode, ce), X.return = $, X) : (X = y(X, J), X.return = $, X);
    }
    function z($, X, J, ce) {
      var Ie = J.type;
      return Ie === j ? se($, X, J.props.children, ce, J.key) : X !== null && (X.elementType === Ie || typeof Ie == "object" && Ie !== null && Ie.$$typeof === O && Fd(Ie) === X.type) ? (ce = y(X, J.props), ce.ref = $o($, X, J), ce.return = $, ce) : (ce = Ws(J.type, J.key, J.props, null, $.mode, ce), ce.ref = $o($, X, J), ce.return = $, ce);
    }
    function q($, X, J, ce) {
      return X === null || X.tag !== 4 || X.stateNode.containerInfo !== J.containerInfo || X.stateNode.implementation !== J.implementation ? (X = Nc(J, $.mode, ce), X.return = $, X) : (X = y(X, J.children || []), X.return = $, X);
    }
    function se($, X, J, ce, Ie) {
      return X === null || X.tag !== 7 ? (X = vr(J, $.mode, ce, Ie), X.return = $, X) : (X = y(X, J), X.return = $, X);
    }
    function ie($, X, J) {
      if (typeof X == "string" && X !== "" || typeof X == "number") return X = bc("" + X, $.mode, J), X.return = $, X;
      if (typeof X == "object" && X !== null) {
        switch (X.$$typeof) {
          case P:
            return J = Ws(X.type, X.key, X.props, null, $.mode, J), J.ref = $o($, null, X), J.return = $, J;
          case F:
            return X = Nc(X, $.mode, J), X.return = $, X;
          case O:
            var ce = X._init;
            return ie($, ce(X._payload), J);
        }
        if (xt(X) || G(X)) return X = vr(X, $.mode, J, null), X.return = $, X;
        vs($, X);
      }
      return null;
    }
    function ae($, X, J, ce) {
      var Ie = X !== null ? X.key : null;
      if (typeof J == "string" && J !== "" || typeof J == "number") return Ie !== null ? null : B($, X, "" + J, ce);
      if (typeof J == "object" && J !== null) {
        switch (J.$$typeof) {
          case P:
            return J.key === Ie ? z($, X, J, ce) : null;
          case F:
            return J.key === Ie ? q($, X, J, ce) : null;
          case O:
            return Ie = J._init, ae(
              $,
              X,
              Ie(J._payload),
              ce
            );
        }
        if (xt(J) || G(J)) return Ie !== null ? null : se($, X, J, ce, null);
        vs($, J);
      }
      return null;
    }
    function ge($, X, J, ce, Ie) {
      if (typeof ce == "string" && ce !== "" || typeof ce == "number") return $ = $.get(J) || null, B(X, $, "" + ce, Ie);
      if (typeof ce == "object" && ce !== null) {
        switch (ce.$$typeof) {
          case P:
            return $ = $.get(ce.key === null ? J : ce.key) || null, z(X, $, ce, Ie);
          case F:
            return $ = $.get(ce.key === null ? J : ce.key) || null, q(X, $, ce, Ie);
          case O:
            var _e = ce._init;
            return ge($, X, J, _e(ce._payload), Ie);
        }
        if (xt(ce) || G(ce)) return $ = $.get(J) || null, se(X, $, ce, Ie, null);
        vs(X, ce);
      }
      return null;
    }
    function he($, X, J, ce) {
      for (var Ie = null, _e = null, Ae = X, ke = X = 0, tt = null; Ae !== null && ke < J.length; ke++) {
        Ae.index > ke ? (tt = Ae, Ae = null) : tt = Ae.sibling;
        var De = ae($, Ae, J[ke], ce);
        if (De === null) {
          Ae === null && (Ae = tt);
          break;
        }
        t && Ae && De.alternate === null && n($, Ae), X = v(De, X, ke), _e === null ? Ie = De : _e.sibling = De, _e = De, Ae = tt;
      }
      if (ke === J.length) return a($, Ae), Ve && dr($, ke), Ie;
      if (Ae === null) {
        for (; ke < J.length; ke++) Ae = ie($, J[ke], ce), Ae !== null && (X = v(Ae, X, ke), _e === null ? Ie = Ae : _e.sibling = Ae, _e = Ae);
        return Ve && dr($, ke), Ie;
      }
      for (Ae = d($, Ae); ke < J.length; ke++) tt = ge(Ae, $, ke, J[ke], ce), tt !== null && (t && tt.alternate !== null && Ae.delete(tt.key === null ? ke : tt.key), X = v(tt, X, ke), _e === null ? Ie = tt : _e.sibling = tt, _e = tt);
      return t && Ae.forEach(function(Un) {
        return n($, Un);
      }), Ve && dr($, ke), Ie;
    }
    function we($, X, J, ce) {
      var Ie = G(J);
      if (typeof Ie != "function") throw Error(o(150));
      if (J = Ie.call(J), J == null) throw Error(o(151));
      for (var _e = Ie = null, Ae = X, ke = X = 0, tt = null, De = J.next(); Ae !== null && !De.done; ke++, De = J.next()) {
        Ae.index > ke ? (tt = Ae, Ae = null) : tt = Ae.sibling;
        var Un = ae($, Ae, De.value, ce);
        if (Un === null) {
          Ae === null && (Ae = tt);
          break;
        }
        t && Ae && Un.alternate === null && n($, Ae), X = v(Un, X, ke), _e === null ? Ie = Un : _e.sibling = Un, _e = Un, Ae = tt;
      }
      if (De.done) return a(
        $,
        Ae
      ), Ve && dr($, ke), Ie;
      if (Ae === null) {
        for (; !De.done; ke++, De = J.next()) De = ie($, De.value, ce), De !== null && (X = v(De, X, ke), _e === null ? Ie = De : _e.sibling = De, _e = De);
        return Ve && dr($, ke), Ie;
      }
      for (Ae = d($, Ae); !De.done; ke++, De = J.next()) De = ge(Ae, $, ke, De.value, ce), De !== null && (t && De.alternate !== null && Ae.delete(De.key === null ? ke : De.key), X = v(De, X, ke), _e === null ? Ie = De : _e.sibling = De, _e = De);
      return t && Ae.forEach(function(Vv) {
        return n($, Vv);
      }), Ve && dr($, ke), Ie;
    }
    function Ye($, X, J, ce) {
      if (typeof J == "object" && J !== null && J.type === j && J.key === null && (J = J.props.children), typeof J == "object" && J !== null) {
        switch (J.$$typeof) {
          case P:
            e: {
              for (var Ie = J.key, _e = X; _e !== null; ) {
                if (_e.key === Ie) {
                  if (Ie = J.type, Ie === j) {
                    if (_e.tag === 7) {
                      a($, _e.sibling), X = y(_e, J.props.children), X.return = $, $ = X;
                      break e;
                    }
                  } else if (_e.elementType === Ie || typeof Ie == "object" && Ie !== null && Ie.$$typeof === O && Fd(Ie) === _e.type) {
                    a($, _e.sibling), X = y(_e, J.props), X.ref = $o($, _e, J), X.return = $, $ = X;
                    break e;
                  }
                  a($, _e);
                  break;
                } else n($, _e);
                _e = _e.sibling;
              }
              J.type === j ? (X = vr(J.props.children, $.mode, ce, J.key), X.return = $, $ = X) : (ce = Ws(J.type, J.key, J.props, null, $.mode, ce), ce.ref = $o($, X, J), ce.return = $, $ = ce);
            }
            return _($);
          case F:
            e: {
              for (_e = J.key; X !== null; ) {
                if (X.key === _e) if (X.tag === 4 && X.stateNode.containerInfo === J.containerInfo && X.stateNode.implementation === J.implementation) {
                  a($, X.sibling), X = y(X, J.children || []), X.return = $, $ = X;
                  break e;
                } else {
                  a($, X);
                  break;
                }
                else n($, X);
                X = X.sibling;
              }
              X = Nc(J, $.mode, ce), X.return = $, $ = X;
            }
            return _($);
          case O:
            return _e = J._init, Ye($, X, _e(J._payload), ce);
        }
        if (xt(J)) return he($, X, J, ce);
        if (G(J)) return we($, X, J, ce);
        vs($, J);
      }
      return typeof J == "string" && J !== "" || typeof J == "number" ? (J = "" + J, X !== null && X.tag === 6 ? (a($, X.sibling), X = y(X, J), X.return = $, $ = X) : (a($, X), X = bc(J, $.mode, ce), X.return = $, $ = X), _($)) : a($, X);
    }
    return Ye;
  }
  var $r = Pd(!0), zd = Pd(!1), xs = Pn(null), Is = null, Qr = null, Bl = null;
  function El() {
    Bl = Qr = Is = null;
  }
  function Dl(t) {
    var n = xs.current;
    ze(xs), t._currentValue = n;
  }
  function Gl(t, n, a) {
    for (; t !== null; ) {
      var d = t.alternate;
      if ((t.childLanes & n) !== n ? (t.childLanes |= n, d !== null && (d.childLanes |= n)) : d !== null && (d.childLanes & n) !== n && (d.childLanes |= n), t === a) break;
      t = t.return;
    }
  }
  function Jr(t, n) {
    Is = t, Bl = Qr = null, t = t.dependencies, t !== null && t.firstContext !== null && ((t.lanes & n) !== 0 && (gt = !0), t.firstContext = null);
  }
  function Bt(t) {
    var n = t._currentValue;
    if (Bl !== t) if (t = { context: t, memoizedValue: n, next: null }, Qr === null) {
      if (Is === null) throw Error(o(308));
      Qr = t, Is.dependencies = { lanes: 0, firstContext: t };
    } else Qr = Qr.next = t;
    return n;
  }
  var fr = null;
  function Fl(t) {
    fr === null ? fr = [t] : fr.push(t);
  }
  function Vd(t, n, a, d) {
    var y = n.interleaved;
    return y === null ? (a.next = a, Fl(n)) : (a.next = y.next, y.next = a), n.interleaved = a, yn(t, d);
  }
  function yn(t, n) {
    t.lanes |= n;
    var a = t.alternate;
    for (a !== null && (a.lanes |= n), a = t, t = t.return; t !== null; ) t.childLanes |= n, a = t.alternate, a !== null && (a.childLanes |= n), a = t, t = t.return;
    return a.tag === 3 ? a.stateNode : null;
  }
  var On = !1;
  function Pl(t) {
    t.updateQueue = { baseState: t.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
  }
  function Od(t, n) {
    t = t.updateQueue, n.updateQueue === t && (n.updateQueue = { baseState: t.baseState, firstBaseUpdate: t.firstBaseUpdate, lastBaseUpdate: t.lastBaseUpdate, shared: t.shared, effects: t.effects });
  }
  function wn(t, n) {
    return { eventTime: t, lane: n, tag: 0, payload: null, callback: null, next: null };
  }
  function Hn(t, n, a) {
    var d = t.updateQueue;
    if (d === null) return null;
    if (d = d.shared, (Ee & 2) !== 0) {
      var y = d.pending;
      return y === null ? n.next = n : (n.next = y.next, y.next = n), d.pending = n, yn(t, a);
    }
    return y = d.interleaved, y === null ? (n.next = n, Fl(d)) : (n.next = y.next, y.next = n), d.interleaved = n, yn(t, a);
  }
  function Cs(t, n, a) {
    if (n = n.updateQueue, n !== null && (n = n.shared, (a & 4194240) !== 0)) {
      var d = n.lanes;
      d &= t.pendingLanes, a |= d, n.lanes = a, Ji(t, a);
    }
  }
  function Hd(t, n) {
    var a = t.updateQueue, d = t.alternate;
    if (d !== null && (d = d.updateQueue, a === d)) {
      var y = null, v = null;
      if (a = a.firstBaseUpdate, a !== null) {
        do {
          var _ = { eventTime: a.eventTime, lane: a.lane, tag: a.tag, payload: a.payload, callback: a.callback, next: null };
          v === null ? y = v = _ : v = v.next = _, a = a.next;
        } while (a !== null);
        v === null ? y = v = n : v = v.next = n;
      } else y = v = n;
      a = { baseState: d.baseState, firstBaseUpdate: y, lastBaseUpdate: v, shared: d.shared, effects: d.effects }, t.updateQueue = a;
      return;
    }
    t = a.lastBaseUpdate, t === null ? a.firstBaseUpdate = n : t.next = n, a.lastBaseUpdate = n;
  }
  function bs(t, n, a, d) {
    var y = t.updateQueue;
    On = !1;
    var v = y.firstBaseUpdate, _ = y.lastBaseUpdate, B = y.shared.pending;
    if (B !== null) {
      y.shared.pending = null;
      var z = B, q = z.next;
      z.next = null, _ === null ? v = q : _.next = q, _ = z;
      var se = t.alternate;
      se !== null && (se = se.updateQueue, B = se.lastBaseUpdate, B !== _ && (B === null ? se.firstBaseUpdate = q : B.next = q, se.lastBaseUpdate = z));
    }
    if (v !== null) {
      var ie = y.baseState;
      _ = 0, se = q = z = null, B = v;
      do {
        var ae = B.lane, ge = B.eventTime;
        if ((d & ae) === ae) {
          se !== null && (se = se.next = {
            eventTime: ge,
            lane: 0,
            tag: B.tag,
            payload: B.payload,
            callback: B.callback,
            next: null
          });
          e: {
            var he = t, we = B;
            switch (ae = n, ge = a, we.tag) {
              case 1:
                if (he = we.payload, typeof he == "function") {
                  ie = he.call(ge, ie, ae);
                  break e;
                }
                ie = he;
                break e;
              case 3:
                he.flags = he.flags & -65537 | 128;
              case 0:
                if (he = we.payload, ae = typeof he == "function" ? he.call(ge, ie, ae) : he, ae == null) break e;
                ie = K({}, ie, ae);
                break e;
              case 2:
                On = !0;
            }
          }
          B.callback !== null && B.lane !== 0 && (t.flags |= 64, ae = y.effects, ae === null ? y.effects = [B] : ae.push(B));
        } else ge = { eventTime: ge, lane: ae, tag: B.tag, payload: B.payload, callback: B.callback, next: null }, se === null ? (q = se = ge, z = ie) : se = se.next = ge, _ |= ae;
        if (B = B.next, B === null) {
          if (B = y.shared.pending, B === null) break;
          ae = B, B = ae.next, ae.next = null, y.lastBaseUpdate = ae, y.shared.pending = null;
        }
      } while (!0);
      if (se === null && (z = ie), y.baseState = z, y.firstBaseUpdate = q, y.lastBaseUpdate = se, n = y.shared.interleaved, n !== null) {
        y = n;
        do
          _ |= y.lane, y = y.next;
        while (y !== n);
      } else v === null && (y.shared.lanes = 0);
      mr |= _, t.lanes = _, t.memoizedState = ie;
    }
  }
  function Wd(t, n, a) {
    if (t = n.effects, n.effects = null, t !== null) for (n = 0; n < t.length; n++) {
      var d = t[n], y = d.callback;
      if (y !== null) {
        if (d.callback = null, d = a, typeof y != "function") throw Error(o(191, y));
        y.call(d);
      }
    }
  }
  var Qo = {}, en = Pn(Qo), Jo = Pn(Qo), qo = Pn(Qo);
  function pr(t) {
    if (t === Qo) throw Error(o(174));
    return t;
  }
  function zl(t, n) {
    switch (Fe(qo, n), Fe(Jo, t), Fe(en, Qo), t = n.nodeType, t) {
      case 9:
      case 11:
        n = (n = n.documentElement) ? n.namespaceURI : dn(null, "");
        break;
      default:
        t = t === 8 ? n.parentNode : n, n = t.namespaceURI || null, t = t.tagName, n = dn(n, t);
    }
    ze(en), Fe(en, n);
  }
  function qr() {
    ze(en), ze(Jo), ze(qo);
  }
  function Xd(t) {
    pr(qo.current);
    var n = pr(en.current), a = dn(n, t.type);
    n !== a && (Fe(Jo, t), Fe(en, a));
  }
  function Vl(t) {
    Jo.current === t && (ze(en), ze(Jo));
  }
  var Le = Pn(0);
  function Ns(t) {
    for (var n = t; n !== null; ) {
      if (n.tag === 13) {
        var a = n.memoizedState;
        if (a !== null && (a = a.dehydrated, a === null || a.data === "$?" || a.data === "$!")) return n;
      } else if (n.tag === 19 && n.memoizedProps.revealOrder !== void 0) {
        if ((n.flags & 128) !== 0) return n;
      } else if (n.child !== null) {
        n.child.return = n, n = n.child;
        continue;
      }
      if (n === t) break;
      for (; n.sibling === null; ) {
        if (n.return === null || n.return === t) return null;
        n = n.return;
      }
      n.sibling.return = n.return, n = n.sibling;
    }
    return null;
  }
  var Ol = [];
  function Hl() {
    for (var t = 0; t < Ol.length; t++) Ol[t]._workInProgressVersionPrimary = null;
    Ol.length = 0;
  }
  var _s = S.ReactCurrentDispatcher, Wl = S.ReactCurrentBatchConfig, gr = 0, Ke = null, Qe = null, qe = null, As = !1, ea = !1, ta = 0, lv = 0;
  function st() {
    throw Error(o(321));
  }
  function Xl(t, n) {
    if (n === null) return !1;
    for (var a = 0; a < n.length && a < t.length; a++) if (!Pt(t[a], n[a])) return !1;
    return !0;
  }
  function Ll(t, n, a, d, y, v) {
    if (gr = v, Ke = n, n.memoizedState = null, n.updateQueue = null, n.lanes = 0, _s.current = t === null || t.memoizedState === null ? fv : pv, t = a(d, y), ea) {
      v = 0;
      do {
        if (ea = !1, ta = 0, 25 <= v) throw Error(o(301));
        v += 1, qe = Qe = null, n.updateQueue = null, _s.current = gv, t = a(d, y);
      } while (ea);
    }
    if (_s.current = js, n = Qe !== null && Qe.next !== null, gr = 0, qe = Qe = Ke = null, As = !1, n) throw Error(o(300));
    return t;
  }
  function Kl() {
    var t = ta !== 0;
    return ta = 0, t;
  }
  function tn() {
    var t = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return qe === null ? Ke.memoizedState = qe = t : qe = qe.next = t, qe;
  }
  function Et() {
    if (Qe === null) {
      var t = Ke.alternate;
      t = t !== null ? t.memoizedState : null;
    } else t = Qe.next;
    var n = qe === null ? Ke.memoizedState : qe.next;
    if (n !== null) qe = n, Qe = t;
    else {
      if (t === null) throw Error(o(310));
      Qe = t, t = { memoizedState: Qe.memoizedState, baseState: Qe.baseState, baseQueue: Qe.baseQueue, queue: Qe.queue, next: null }, qe === null ? Ke.memoizedState = qe = t : qe = qe.next = t;
    }
    return qe;
  }
  function na(t, n) {
    return typeof n == "function" ? n(t) : n;
  }
  function Zl(t) {
    var n = Et(), a = n.queue;
    if (a === null) throw Error(o(311));
    a.lastRenderedReducer = t;
    var d = Qe, y = d.baseQueue, v = a.pending;
    if (v !== null) {
      if (y !== null) {
        var _ = y.next;
        y.next = v.next, v.next = _;
      }
      d.baseQueue = y = v, a.pending = null;
    }
    if (y !== null) {
      v = y.next, d = d.baseState;
      var B = _ = null, z = null, q = v;
      do {
        var se = q.lane;
        if ((gr & se) === se) z !== null && (z = z.next = { lane: 0, action: q.action, hasEagerState: q.hasEagerState, eagerState: q.eagerState, next: null }), d = q.hasEagerState ? q.eagerState : t(d, q.action);
        else {
          var ie = {
            lane: se,
            action: q.action,
            hasEagerState: q.hasEagerState,
            eagerState: q.eagerState,
            next: null
          };
          z === null ? (B = z = ie, _ = d) : z = z.next = ie, Ke.lanes |= se, mr |= se;
        }
        q = q.next;
      } while (q !== null && q !== v);
      z === null ? _ = d : z.next = B, Pt(d, n.memoizedState) || (gt = !0), n.memoizedState = d, n.baseState = _, n.baseQueue = z, a.lastRenderedState = d;
    }
    if (t = a.interleaved, t !== null) {
      y = t;
      do
        v = y.lane, Ke.lanes |= v, mr |= v, y = y.next;
      while (y !== t);
    } else y === null && (a.lanes = 0);
    return [n.memoizedState, a.dispatch];
  }
  function Yl(t) {
    var n = Et(), a = n.queue;
    if (a === null) throw Error(o(311));
    a.lastRenderedReducer = t;
    var d = a.dispatch, y = a.pending, v = n.memoizedState;
    if (y !== null) {
      a.pending = null;
      var _ = y = y.next;
      do
        v = t(v, _.action), _ = _.next;
      while (_ !== y);
      Pt(v, n.memoizedState) || (gt = !0), n.memoizedState = v, n.baseQueue === null && (n.baseState = v), a.lastRenderedState = v;
    }
    return [v, d];
  }
  function Ld() {
  }
  function Kd(t, n) {
    var a = Ke, d = Et(), y = n(), v = !Pt(d.memoizedState, y);
    if (v && (d.memoizedState = y, gt = !0), d = d.queue, Ul(Ud.bind(null, a, d, t), [t]), d.getSnapshot !== n || v || qe !== null && qe.memoizedState.tag & 1) {
      if (a.flags |= 2048, ra(9, Yd.bind(null, a, d, y, n), void 0, null), et === null) throw Error(o(349));
      (gr & 30) !== 0 || Zd(a, n, y);
    }
    return y;
  }
  function Zd(t, n, a) {
    t.flags |= 16384, t = { getSnapshot: n, value: a }, n = Ke.updateQueue, n === null ? (n = { lastEffect: null, stores: null }, Ke.updateQueue = n, n.stores = [t]) : (a = n.stores, a === null ? n.stores = [t] : a.push(t));
  }
  function Yd(t, n, a, d) {
    n.value = a, n.getSnapshot = d, $d(n) && Qd(t);
  }
  function Ud(t, n, a) {
    return a(function() {
      $d(n) && Qd(t);
    });
  }
  function $d(t) {
    var n = t.getSnapshot;
    t = t.value;
    try {
      var a = n();
      return !Pt(t, a);
    } catch {
      return !0;
    }
  }
  function Qd(t) {
    var n = yn(t, 1);
    n !== null && Wt(n, t, 1, -1);
  }
  function Jd(t) {
    var n = tn();
    return typeof t == "function" && (t = t()), n.memoizedState = n.baseState = t, t = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: na, lastRenderedState: t }, n.queue = t, t = t.dispatch = dv.bind(null, Ke, t), [n.memoizedState, t];
  }
  function ra(t, n, a, d) {
    return t = { tag: t, create: n, destroy: a, deps: d, next: null }, n = Ke.updateQueue, n === null ? (n = { lastEffect: null, stores: null }, Ke.updateQueue = n, n.lastEffect = t.next = t) : (a = n.lastEffect, a === null ? n.lastEffect = t.next = t : (d = a.next, a.next = t, t.next = d, n.lastEffect = t)), t;
  }
  function qd() {
    return Et().memoizedState;
  }
  function Ss(t, n, a, d) {
    var y = tn();
    Ke.flags |= t, y.memoizedState = ra(1 | n, a, void 0, d === void 0 ? null : d);
  }
  function ks(t, n, a, d) {
    var y = Et();
    d = d === void 0 ? null : d;
    var v = void 0;
    if (Qe !== null) {
      var _ = Qe.memoizedState;
      if (v = _.destroy, d !== null && Xl(d, _.deps)) {
        y.memoizedState = ra(n, a, v, d);
        return;
      }
    }
    Ke.flags |= t, y.memoizedState = ra(1 | n, a, v, d);
  }
  function ef(t, n) {
    return Ss(8390656, 8, t, n);
  }
  function Ul(t, n) {
    return ks(2048, 8, t, n);
  }
  function tf(t, n) {
    return ks(4, 2, t, n);
  }
  function nf(t, n) {
    return ks(4, 4, t, n);
  }
  function rf(t, n) {
    if (typeof n == "function") return t = t(), n(t), function() {
      n(null);
    };
    if (n != null) return t = t(), n.current = t, function() {
      n.current = null;
    };
  }
  function of(t, n, a) {
    return a = a != null ? a.concat([t]) : null, ks(4, 4, rf.bind(null, n, t), a);
  }
  function $l() {
  }
  function af(t, n) {
    var a = Et();
    n = n === void 0 ? null : n;
    var d = a.memoizedState;
    return d !== null && n !== null && Xl(n, d[1]) ? d[0] : (a.memoizedState = [t, n], t);
  }
  function sf(t, n) {
    var a = Et();
    n = n === void 0 ? null : n;
    var d = a.memoizedState;
    return d !== null && n !== null && Xl(n, d[1]) ? d[0] : (t = t(), a.memoizedState = [t, n], t);
  }
  function lf(t, n, a) {
    return (gr & 21) === 0 ? (t.baseState && (t.baseState = !1, gt = !0), t.memoizedState = a) : (Pt(a, n) || (a = Gr(), Ke.lanes |= a, mr |= a, t.baseState = !0), n);
  }
  function cv(t, n) {
    var a = Ge;
    Ge = a !== 0 && 4 > a ? a : 4, t(!0);
    var d = Wl.transition;
    Wl.transition = {};
    try {
      t(!1), n();
    } finally {
      Ge = a, Wl.transition = d;
    }
  }
  function cf() {
    return Et().memoizedState;
  }
  function uv(t, n, a) {
    var d = Kn(t);
    if (a = { lane: d, action: a, hasEagerState: !1, eagerState: null, next: null }, uf(t)) df(n, a);
    else if (a = Vd(t, n, a, d), a !== null) {
      var y = dt();
      Wt(a, t, d, y), ff(a, n, d);
    }
  }
  function dv(t, n, a) {
    var d = Kn(t), y = { lane: d, action: a, hasEagerState: !1, eagerState: null, next: null };
    if (uf(t)) df(n, y);
    else {
      var v = t.alternate;
      if (t.lanes === 0 && (v === null || v.lanes === 0) && (v = n.lastRenderedReducer, v !== null)) try {
        var _ = n.lastRenderedState, B = v(_, a);
        if (y.hasEagerState = !0, y.eagerState = B, Pt(B, _)) {
          var z = n.interleaved;
          z === null ? (y.next = y, Fl(n)) : (y.next = z.next, z.next = y), n.interleaved = y;
          return;
        }
      } catch {
      } finally {
      }
      a = Vd(t, n, y, d), a !== null && (y = dt(), Wt(a, t, d, y), ff(a, n, d));
    }
  }
  function uf(t) {
    var n = t.alternate;
    return t === Ke || n !== null && n === Ke;
  }
  function df(t, n) {
    ea = As = !0;
    var a = t.pending;
    a === null ? n.next = n : (n.next = a.next, a.next = n), t.pending = n;
  }
  function ff(t, n, a) {
    if ((a & 4194240) !== 0) {
      var d = n.lanes;
      d &= t.pendingLanes, a |= d, n.lanes = a, Ji(t, a);
    }
  }
  var js = { readContext: Bt, useCallback: st, useContext: st, useEffect: st, useImperativeHandle: st, useInsertionEffect: st, useLayoutEffect: st, useMemo: st, useReducer: st, useRef: st, useState: st, useDebugValue: st, useDeferredValue: st, useTransition: st, useMutableSource: st, useSyncExternalStore: st, useId: st, unstable_isNewReconciler: !1 }, fv = { readContext: Bt, useCallback: function(t, n) {
    return tn().memoizedState = [t, n === void 0 ? null : n], t;
  }, useContext: Bt, useEffect: ef, useImperativeHandle: function(t, n, a) {
    return a = a != null ? a.concat([t]) : null, Ss(
      4194308,
      4,
      rf.bind(null, n, t),
      a
    );
  }, useLayoutEffect: function(t, n) {
    return Ss(4194308, 4, t, n);
  }, useInsertionEffect: function(t, n) {
    return Ss(4, 2, t, n);
  }, useMemo: function(t, n) {
    var a = tn();
    return n = n === void 0 ? null : n, t = t(), a.memoizedState = [t, n], t;
  }, useReducer: function(t, n, a) {
    var d = tn();
    return n = a !== void 0 ? a(n) : n, d.memoizedState = d.baseState = n, t = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: t, lastRenderedState: n }, d.queue = t, t = t.dispatch = uv.bind(null, Ke, t), [d.memoizedState, t];
  }, useRef: function(t) {
    var n = tn();
    return t = { current: t }, n.memoizedState = t;
  }, useState: Jd, useDebugValue: $l, useDeferredValue: function(t) {
    return tn().memoizedState = t;
  }, useTransition: function() {
    var t = Jd(!1), n = t[0];
    return t = cv.bind(null, t[1]), tn().memoizedState = t, [n, t];
  }, useMutableSource: function() {
  }, useSyncExternalStore: function(t, n, a) {
    var d = Ke, y = tn();
    if (Ve) {
      if (a === void 0) throw Error(o(407));
      a = a();
    } else {
      if (a = n(), et === null) throw Error(o(349));
      (gr & 30) !== 0 || Zd(d, n, a);
    }
    y.memoizedState = a;
    var v = { value: a, getSnapshot: n };
    return y.queue = v, ef(Ud.bind(
      null,
      d,
      v,
      t
    ), [t]), d.flags |= 2048, ra(9, Yd.bind(null, d, v, a, n), void 0, null), a;
  }, useId: function() {
    var t = tn(), n = et.identifierPrefix;
    if (Ve) {
      var a = hn, d = mn;
      a = (d & ~(1 << 32 - It(d) - 1)).toString(32) + a, n = ":" + n + "R" + a, a = ta++, 0 < a && (n += "H" + a.toString(32)), n += ":";
    } else a = lv++, n = ":" + n + "r" + a.toString(32) + ":";
    return t.memoizedState = n;
  }, unstable_isNewReconciler: !1 }, pv = {
    readContext: Bt,
    useCallback: af,
    useContext: Bt,
    useEffect: Ul,
    useImperativeHandle: of,
    useInsertionEffect: tf,
    useLayoutEffect: nf,
    useMemo: sf,
    useReducer: Zl,
    useRef: qd,
    useState: function() {
      return Zl(na);
    },
    useDebugValue: $l,
    useDeferredValue: function(t) {
      var n = Et();
      return lf(n, Qe.memoizedState, t);
    },
    useTransition: function() {
      var t = Zl(na)[0], n = Et().memoizedState;
      return [t, n];
    },
    useMutableSource: Ld,
    useSyncExternalStore: Kd,
    useId: cf,
    unstable_isNewReconciler: !1
  }, gv = { readContext: Bt, useCallback: af, useContext: Bt, useEffect: Ul, useImperativeHandle: of, useInsertionEffect: tf, useLayoutEffect: nf, useMemo: sf, useReducer: Yl, useRef: qd, useState: function() {
    return Yl(na);
  }, useDebugValue: $l, useDeferredValue: function(t) {
    var n = Et();
    return Qe === null ? n.memoizedState = t : lf(n, Qe.memoizedState, t);
  }, useTransition: function() {
    var t = Yl(na)[0], n = Et().memoizedState;
    return [t, n];
  }, useMutableSource: Ld, useSyncExternalStore: Kd, useId: cf, unstable_isNewReconciler: !1 };
  function Vt(t, n) {
    if (t && t.defaultProps) {
      n = K({}, n), t = t.defaultProps;
      for (var a in t) n[a] === void 0 && (n[a] = t[a]);
      return n;
    }
    return n;
  }
  function Ql(t, n, a, d) {
    n = t.memoizedState, a = a(d, n), a = a == null ? n : K({}, n, a), t.memoizedState = a, t.lanes === 0 && (t.updateQueue.baseState = a);
  }
  var Ms = { isMounted: function(t) {
    return (t = t._reactInternals) ? Qt(t) === t : !1;
  }, enqueueSetState: function(t, n, a) {
    t = t._reactInternals;
    var d = dt(), y = Kn(t), v = wn(d, y);
    v.payload = n, a != null && (v.callback = a), n = Hn(t, v, y), n !== null && (Wt(n, t, y, d), Cs(n, t, y));
  }, enqueueReplaceState: function(t, n, a) {
    t = t._reactInternals;
    var d = dt(), y = Kn(t), v = wn(d, y);
    v.tag = 1, v.payload = n, a != null && (v.callback = a), n = Hn(t, v, y), n !== null && (Wt(n, t, y, d), Cs(n, t, y));
  }, enqueueForceUpdate: function(t, n) {
    t = t._reactInternals;
    var a = dt(), d = Kn(t), y = wn(a, d);
    y.tag = 2, n != null && (y.callback = n), n = Hn(t, y, d), n !== null && (Wt(n, t, d, a), Cs(n, t, d));
  } };
  function pf(t, n, a, d, y, v, _) {
    return t = t.stateNode, typeof t.shouldComponentUpdate == "function" ? t.shouldComponentUpdate(d, v, _) : n.prototype && n.prototype.isPureReactComponent ? !Wo(a, d) || !Wo(y, v) : !0;
  }
  function gf(t, n, a) {
    var d = !1, y = zn, v = n.contextType;
    return typeof v == "object" && v !== null ? v = Bt(v) : (y = pt(n) ? cr : at.current, d = n.contextTypes, v = (d = d != null) ? Kr(t, y) : zn), n = new n(a, v), t.memoizedState = n.state !== null && n.state !== void 0 ? n.state : null, n.updater = Ms, t.stateNode = n, n._reactInternals = t, d && (t = t.stateNode, t.__reactInternalMemoizedUnmaskedChildContext = y, t.__reactInternalMemoizedMaskedChildContext = v), n;
  }
  function mf(t, n, a, d) {
    t = n.state, typeof n.componentWillReceiveProps == "function" && n.componentWillReceiveProps(a, d), typeof n.UNSAFE_componentWillReceiveProps == "function" && n.UNSAFE_componentWillReceiveProps(a, d), n.state !== t && Ms.enqueueReplaceState(n, n.state, null);
  }
  function Jl(t, n, a, d) {
    var y = t.stateNode;
    y.props = a, y.state = t.memoizedState, y.refs = {}, Pl(t);
    var v = n.contextType;
    typeof v == "object" && v !== null ? y.context = Bt(v) : (v = pt(n) ? cr : at.current, y.context = Kr(t, v)), y.state = t.memoizedState, v = n.getDerivedStateFromProps, typeof v == "function" && (Ql(t, n, v, a), y.state = t.memoizedState), typeof n.getDerivedStateFromProps == "function" || typeof y.getSnapshotBeforeUpdate == "function" || typeof y.UNSAFE_componentWillMount != "function" && typeof y.componentWillMount != "function" || (n = y.state, typeof y.componentWillMount == "function" && y.componentWillMount(), typeof y.UNSAFE_componentWillMount == "function" && y.UNSAFE_componentWillMount(), n !== y.state && Ms.enqueueReplaceState(y, y.state, null), bs(t, a, y, d), y.state = t.memoizedState), typeof y.componentDidMount == "function" && (t.flags |= 4194308);
  }
  function eo(t, n) {
    try {
      var a = "", d = n;
      do
        a += le(d), d = d.return;
      while (d);
      var y = a;
    } catch (v) {
      y = `
Error generating stack: ` + v.message + `
` + v.stack;
    }
    return { value: t, source: n, stack: y, digest: null };
  }
  function ql(t, n, a) {
    return { value: t, source: null, stack: a ?? null, digest: n ?? null };
  }
  function ec(t, n) {
    try {
      console.error(n.value);
    } catch (a) {
      setTimeout(function() {
        throw a;
      });
    }
  }
  var mv = typeof WeakMap == "function" ? WeakMap : Map;
  function hf(t, n, a) {
    a = wn(-1, a), a.tag = 3, a.payload = { element: null };
    var d = n.value;
    return a.callback = function() {
      Fs || (Fs = !0, mc = d), ec(t, n);
    }, a;
  }
  function yf(t, n, a) {
    a = wn(-1, a), a.tag = 3;
    var d = t.type.getDerivedStateFromError;
    if (typeof d == "function") {
      var y = n.value;
      a.payload = function() {
        return d(y);
      }, a.callback = function() {
        ec(t, n);
      };
    }
    var v = t.stateNode;
    return v !== null && typeof v.componentDidCatch == "function" && (a.callback = function() {
      ec(t, n), typeof d != "function" && (Xn === null ? Xn = /* @__PURE__ */ new Set([this]) : Xn.add(this));
      var _ = n.stack;
      this.componentDidCatch(n.value, { componentStack: _ !== null ? _ : "" });
    }), a;
  }
  function wf(t, n, a) {
    var d = t.pingCache;
    if (d === null) {
      d = t.pingCache = new mv();
      var y = /* @__PURE__ */ new Set();
      d.set(n, y);
    } else y = d.get(n), y === void 0 && (y = /* @__PURE__ */ new Set(), d.set(n, y));
    y.has(a) || (y.add(a), t = jv.bind(null, t, n, a), n.then(t, t));
  }
  function vf(t) {
    do {
      var n;
      if ((n = t.tag === 13) && (n = t.memoizedState, n = n !== null ? n.dehydrated !== null : !0), n) return t;
      t = t.return;
    } while (t !== null);
    return null;
  }
  function xf(t, n, a, d, y) {
    return (t.mode & 1) === 0 ? (t === n ? t.flags |= 65536 : (t.flags |= 128, a.flags |= 131072, a.flags &= -52805, a.tag === 1 && (a.alternate === null ? a.tag = 17 : (n = wn(-1, 1), n.tag = 2, Hn(a, n, 1))), a.lanes |= 1), t) : (t.flags |= 65536, t.lanes = y, t);
  }
  var hv = S.ReactCurrentOwner, gt = !1;
  function ut(t, n, a, d) {
    n.child = t === null ? zd(n, null, a, d) : $r(n, t.child, a, d);
  }
  function If(t, n, a, d, y) {
    a = a.render;
    var v = n.ref;
    return Jr(n, y), d = Ll(t, n, a, d, v, y), a = Kl(), t !== null && !gt ? (n.updateQueue = t.updateQueue, n.flags &= -2053, t.lanes &= ~y, vn(t, n, y)) : (Ve && a && kl(n), n.flags |= 1, ut(t, n, d, y), n.child);
  }
  function Cf(t, n, a, d, y) {
    if (t === null) {
      var v = a.type;
      return typeof v == "function" && !Cc(v) && v.defaultProps === void 0 && a.compare === null && a.defaultProps === void 0 ? (n.tag = 15, n.type = v, bf(t, n, v, d, y)) : (t = Ws(a.type, null, d, n, n.mode, y), t.ref = n.ref, t.return = n, n.child = t);
    }
    if (v = t.child, (t.lanes & y) === 0) {
      var _ = v.memoizedProps;
      if (a = a.compare, a = a !== null ? a : Wo, a(_, d) && t.ref === n.ref) return vn(t, n, y);
    }
    return n.flags |= 1, t = Yn(v, d), t.ref = n.ref, t.return = n, n.child = t;
  }
  function bf(t, n, a, d, y) {
    if (t !== null) {
      var v = t.memoizedProps;
      if (Wo(v, d) && t.ref === n.ref) if (gt = !1, n.pendingProps = d = v, (t.lanes & y) !== 0) (t.flags & 131072) !== 0 && (gt = !0);
      else return n.lanes = t.lanes, vn(t, n, y);
    }
    return tc(t, n, a, d, y);
  }
  function Nf(t, n, a) {
    var d = n.pendingProps, y = d.children, v = t !== null ? t.memoizedState : null;
    if (d.mode === "hidden") if ((n.mode & 1) === 0) n.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, Fe(no, _t), _t |= a;
    else {
      if ((a & 1073741824) === 0) return t = v !== null ? v.baseLanes | a : a, n.lanes = n.childLanes = 1073741824, n.memoizedState = { baseLanes: t, cachePool: null, transitions: null }, n.updateQueue = null, Fe(no, _t), _t |= t, null;
      n.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, d = v !== null ? v.baseLanes : a, Fe(no, _t), _t |= d;
    }
    else v !== null ? (d = v.baseLanes | a, n.memoizedState = null) : d = a, Fe(no, _t), _t |= d;
    return ut(t, n, y, a), n.child;
  }
  function _f(t, n) {
    var a = n.ref;
    (t === null && a !== null || t !== null && t.ref !== a) && (n.flags |= 512, n.flags |= 2097152);
  }
  function tc(t, n, a, d, y) {
    var v = pt(a) ? cr : at.current;
    return v = Kr(n, v), Jr(n, y), a = Ll(t, n, a, d, v, y), d = Kl(), t !== null && !gt ? (n.updateQueue = t.updateQueue, n.flags &= -2053, t.lanes &= ~y, vn(t, n, y)) : (Ve && d && kl(n), n.flags |= 1, ut(t, n, a, y), n.child);
  }
  function Af(t, n, a, d, y) {
    if (pt(a)) {
      var v = !0;
      gs(n);
    } else v = !1;
    if (Jr(n, y), n.stateNode === null) Rs(t, n), gf(n, a, d), Jl(n, a, d, y), d = !0;
    else if (t === null) {
      var _ = n.stateNode, B = n.memoizedProps;
      _.props = B;
      var z = _.context, q = a.contextType;
      typeof q == "object" && q !== null ? q = Bt(q) : (q = pt(a) ? cr : at.current, q = Kr(n, q));
      var se = a.getDerivedStateFromProps, ie = typeof se == "function" || typeof _.getSnapshotBeforeUpdate == "function";
      ie || typeof _.UNSAFE_componentWillReceiveProps != "function" && typeof _.componentWillReceiveProps != "function" || (B !== d || z !== q) && mf(n, _, d, q), On = !1;
      var ae = n.memoizedState;
      _.state = ae, bs(n, d, _, y), z = n.memoizedState, B !== d || ae !== z || ft.current || On ? (typeof se == "function" && (Ql(n, a, se, d), z = n.memoizedState), (B = On || pf(n, a, B, d, ae, z, q)) ? (ie || typeof _.UNSAFE_componentWillMount != "function" && typeof _.componentWillMount != "function" || (typeof _.componentWillMount == "function" && _.componentWillMount(), typeof _.UNSAFE_componentWillMount == "function" && _.UNSAFE_componentWillMount()), typeof _.componentDidMount == "function" && (n.flags |= 4194308)) : (typeof _.componentDidMount == "function" && (n.flags |= 4194308), n.memoizedProps = d, n.memoizedState = z), _.props = d, _.state = z, _.context = q, d = B) : (typeof _.componentDidMount == "function" && (n.flags |= 4194308), d = !1);
    } else {
      _ = n.stateNode, Od(t, n), B = n.memoizedProps, q = n.type === n.elementType ? B : Vt(n.type, B), _.props = q, ie = n.pendingProps, ae = _.context, z = a.contextType, typeof z == "object" && z !== null ? z = Bt(z) : (z = pt(a) ? cr : at.current, z = Kr(n, z));
      var ge = a.getDerivedStateFromProps;
      (se = typeof ge == "function" || typeof _.getSnapshotBeforeUpdate == "function") || typeof _.UNSAFE_componentWillReceiveProps != "function" && typeof _.componentWillReceiveProps != "function" || (B !== ie || ae !== z) && mf(n, _, d, z), On = !1, ae = n.memoizedState, _.state = ae, bs(n, d, _, y);
      var he = n.memoizedState;
      B !== ie || ae !== he || ft.current || On ? (typeof ge == "function" && (Ql(n, a, ge, d), he = n.memoizedState), (q = On || pf(n, a, q, d, ae, he, z) || !1) ? (se || typeof _.UNSAFE_componentWillUpdate != "function" && typeof _.componentWillUpdate != "function" || (typeof _.componentWillUpdate == "function" && _.componentWillUpdate(d, he, z), typeof _.UNSAFE_componentWillUpdate == "function" && _.UNSAFE_componentWillUpdate(d, he, z)), typeof _.componentDidUpdate == "function" && (n.flags |= 4), typeof _.getSnapshotBeforeUpdate == "function" && (n.flags |= 1024)) : (typeof _.componentDidUpdate != "function" || B === t.memoizedProps && ae === t.memoizedState || (n.flags |= 4), typeof _.getSnapshotBeforeUpdate != "function" || B === t.memoizedProps && ae === t.memoizedState || (n.flags |= 1024), n.memoizedProps = d, n.memoizedState = he), _.props = d, _.state = he, _.context = z, d = q) : (typeof _.componentDidUpdate != "function" || B === t.memoizedProps && ae === t.memoizedState || (n.flags |= 4), typeof _.getSnapshotBeforeUpdate != "function" || B === t.memoizedProps && ae === t.memoizedState || (n.flags |= 1024), d = !1);
    }
    return nc(t, n, a, d, v, y);
  }
  function nc(t, n, a, d, y, v) {
    _f(t, n);
    var _ = (n.flags & 128) !== 0;
    if (!d && !_) return y && Md(n, a, !1), vn(t, n, v);
    d = n.stateNode, hv.current = n;
    var B = _ && typeof a.getDerivedStateFromError != "function" ? null : d.render();
    return n.flags |= 1, t !== null && _ ? (n.child = $r(n, t.child, null, v), n.child = $r(n, null, B, v)) : ut(t, n, B, v), n.memoizedState = d.state, y && Md(n, a, !0), n.child;
  }
  function Sf(t) {
    var n = t.stateNode;
    n.pendingContext ? kd(t, n.pendingContext, n.pendingContext !== n.context) : n.context && kd(t, n.context, !1), zl(t, n.containerInfo);
  }
  function kf(t, n, a, d, y) {
    return Ur(), Rl(y), n.flags |= 256, ut(t, n, a, d), n.child;
  }
  var rc = { dehydrated: null, treeContext: null, retryLane: 0 };
  function oc(t) {
    return { baseLanes: t, cachePool: null, transitions: null };
  }
  function jf(t, n, a) {
    var d = n.pendingProps, y = Le.current, v = !1, _ = (n.flags & 128) !== 0, B;
    if ((B = _) || (B = t !== null && t.memoizedState === null ? !1 : (y & 2) !== 0), B ? (v = !0, n.flags &= -129) : (t === null || t.memoizedState !== null) && (y |= 1), Fe(Le, y & 1), t === null)
      return Tl(n), t = n.memoizedState, t !== null && (t = t.dehydrated, t !== null) ? ((n.mode & 1) === 0 ? n.lanes = 1 : t.data === "$!" ? n.lanes = 8 : n.lanes = 1073741824, null) : (_ = d.children, t = d.fallback, v ? (d = n.mode, v = n.child, _ = { mode: "hidden", children: _ }, (d & 1) === 0 && v !== null ? (v.childLanes = 0, v.pendingProps = _) : v = Xs(_, d, 0, null), t = vr(t, d, a, null), v.return = n, t.return = n, v.sibling = t, n.child = v, n.child.memoizedState = oc(a), n.memoizedState = rc, t) : ac(n, _));
    if (y = t.memoizedState, y !== null && (B = y.dehydrated, B !== null)) return yv(t, n, _, d, B, y, a);
    if (v) {
      v = d.fallback, _ = n.mode, y = t.child, B = y.sibling;
      var z = { mode: "hidden", children: d.children };
      return (_ & 1) === 0 && n.child !== y ? (d = n.child, d.childLanes = 0, d.pendingProps = z, n.deletions = null) : (d = Yn(y, z), d.subtreeFlags = y.subtreeFlags & 14680064), B !== null ? v = Yn(B, v) : (v = vr(v, _, a, null), v.flags |= 2), v.return = n, d.return = n, d.sibling = v, n.child = d, d = v, v = n.child, _ = t.child.memoizedState, _ = _ === null ? oc(a) : { baseLanes: _.baseLanes | a, cachePool: null, transitions: _.transitions }, v.memoizedState = _, v.childLanes = t.childLanes & ~a, n.memoizedState = rc, d;
    }
    return v = t.child, t = v.sibling, d = Yn(v, { mode: "visible", children: d.children }), (n.mode & 1) === 0 && (d.lanes = a), d.return = n, d.sibling = null, t !== null && (a = n.deletions, a === null ? (n.deletions = [t], n.flags |= 16) : a.push(t)), n.child = d, n.memoizedState = null, d;
  }
  function ac(t, n) {
    return n = Xs({ mode: "visible", children: n }, t.mode, 0, null), n.return = t, t.child = n;
  }
  function Ts(t, n, a, d) {
    return d !== null && Rl(d), $r(n, t.child, null, a), t = ac(n, n.pendingProps.children), t.flags |= 2, n.memoizedState = null, t;
  }
  function yv(t, n, a, d, y, v, _) {
    if (a)
      return n.flags & 256 ? (n.flags &= -257, d = ql(Error(o(422))), Ts(t, n, _, d)) : n.memoizedState !== null ? (n.child = t.child, n.flags |= 128, null) : (v = d.fallback, y = n.mode, d = Xs({ mode: "visible", children: d.children }, y, 0, null), v = vr(v, y, _, null), v.flags |= 2, d.return = n, v.return = n, d.sibling = v, n.child = d, (n.mode & 1) !== 0 && $r(n, t.child, null, _), n.child.memoizedState = oc(_), n.memoizedState = rc, v);
    if ((n.mode & 1) === 0) return Ts(t, n, _, null);
    if (y.data === "$!") {
      if (d = y.nextSibling && y.nextSibling.dataset, d) var B = d.dgst;
      return d = B, v = Error(o(419)), d = ql(v, d, void 0), Ts(t, n, _, d);
    }
    if (B = (_ & t.childLanes) !== 0, gt || B) {
      if (d = et, d !== null) {
        switch (_ & -_) {
          case 4:
            y = 2;
            break;
          case 16:
            y = 8;
            break;
          case 64:
          case 128:
          case 256:
          case 512:
          case 1024:
          case 2048:
          case 4096:
          case 8192:
          case 16384:
          case 32768:
          case 65536:
          case 131072:
          case 262144:
          case 524288:
          case 1048576:
          case 2097152:
          case 4194304:
          case 8388608:
          case 16777216:
          case 33554432:
          case 67108864:
            y = 32;
            break;
          case 536870912:
            y = 268435456;
            break;
          default:
            y = 0;
        }
        y = (y & (d.suspendedLanes | _)) !== 0 ? 0 : y, y !== 0 && y !== v.retryLane && (v.retryLane = y, yn(t, y), Wt(d, t, y, -1));
      }
      return Ic(), d = ql(Error(o(421))), Ts(t, n, _, d);
    }
    return y.data === "$?" ? (n.flags |= 128, n.child = t.child, n = Mv.bind(null, t), y._reactRetry = n, null) : (t = v.treeContext, Nt = Fn(y.nextSibling), bt = n, Ve = !0, zt = null, t !== null && (Tt[Rt++] = mn, Tt[Rt++] = hn, Tt[Rt++] = ur, mn = t.id, hn = t.overflow, ur = n), n = ac(n, d.children), n.flags |= 4096, n);
  }
  function Mf(t, n, a) {
    t.lanes |= n;
    var d = t.alternate;
    d !== null && (d.lanes |= n), Gl(t.return, n, a);
  }
  function sc(t, n, a, d, y) {
    var v = t.memoizedState;
    v === null ? t.memoizedState = { isBackwards: n, rendering: null, renderingStartTime: 0, last: d, tail: a, tailMode: y } : (v.isBackwards = n, v.rendering = null, v.renderingStartTime = 0, v.last = d, v.tail = a, v.tailMode = y);
  }
  function Tf(t, n, a) {
    var d = n.pendingProps, y = d.revealOrder, v = d.tail;
    if (ut(t, n, d.children, a), d = Le.current, (d & 2) !== 0) d = d & 1 | 2, n.flags |= 128;
    else {
      if (t !== null && (t.flags & 128) !== 0) e: for (t = n.child; t !== null; ) {
        if (t.tag === 13) t.memoizedState !== null && Mf(t, a, n);
        else if (t.tag === 19) Mf(t, a, n);
        else if (t.child !== null) {
          t.child.return = t, t = t.child;
          continue;
        }
        if (t === n) break e;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === n) break e;
          t = t.return;
        }
        t.sibling.return = t.return, t = t.sibling;
      }
      d &= 1;
    }
    if (Fe(Le, d), (n.mode & 1) === 0) n.memoizedState = null;
    else switch (y) {
      case "forwards":
        for (a = n.child, y = null; a !== null; ) t = a.alternate, t !== null && Ns(t) === null && (y = a), a = a.sibling;
        a = y, a === null ? (y = n.child, n.child = null) : (y = a.sibling, a.sibling = null), sc(n, !1, y, a, v);
        break;
      case "backwards":
        for (a = null, y = n.child, n.child = null; y !== null; ) {
          if (t = y.alternate, t !== null && Ns(t) === null) {
            n.child = y;
            break;
          }
          t = y.sibling, y.sibling = a, a = y, y = t;
        }
        sc(n, !0, a, null, v);
        break;
      case "together":
        sc(n, !1, null, null, void 0);
        break;
      default:
        n.memoizedState = null;
    }
    return n.child;
  }
  function Rs(t, n) {
    (n.mode & 1) === 0 && t !== null && (t.alternate = null, n.alternate = null, n.flags |= 2);
  }
  function vn(t, n, a) {
    if (t !== null && (n.dependencies = t.dependencies), mr |= n.lanes, (a & n.childLanes) === 0) return null;
    if (t !== null && n.child !== t.child) throw Error(o(153));
    if (n.child !== null) {
      for (t = n.child, a = Yn(t, t.pendingProps), n.child = a, a.return = n; t.sibling !== null; ) t = t.sibling, a = a.sibling = Yn(t, t.pendingProps), a.return = n;
      a.sibling = null;
    }
    return n.child;
  }
  function wv(t, n, a) {
    switch (n.tag) {
      case 3:
        Sf(n), Ur();
        break;
      case 5:
        Xd(n);
        break;
      case 1:
        pt(n.type) && gs(n);
        break;
      case 4:
        zl(n, n.stateNode.containerInfo);
        break;
      case 10:
        var d = n.type._context, y = n.memoizedProps.value;
        Fe(xs, d._currentValue), d._currentValue = y;
        break;
      case 13:
        if (d = n.memoizedState, d !== null)
          return d.dehydrated !== null ? (Fe(Le, Le.current & 1), n.flags |= 128, null) : (a & n.child.childLanes) !== 0 ? jf(t, n, a) : (Fe(Le, Le.current & 1), t = vn(t, n, a), t !== null ? t.sibling : null);
        Fe(Le, Le.current & 1);
        break;
      case 19:
        if (d = (a & n.childLanes) !== 0, (t.flags & 128) !== 0) {
          if (d) return Tf(t, n, a);
          n.flags |= 128;
        }
        if (y = n.memoizedState, y !== null && (y.rendering = null, y.tail = null, y.lastEffect = null), Fe(Le, Le.current), d) break;
        return null;
      case 22:
      case 23:
        return n.lanes = 0, Nf(t, n, a);
    }
    return vn(t, n, a);
  }
  var Rf, ic, Bf, Ef;
  Rf = function(t, n) {
    for (var a = n.child; a !== null; ) {
      if (a.tag === 5 || a.tag === 6) t.appendChild(a.stateNode);
      else if (a.tag !== 4 && a.child !== null) {
        a.child.return = a, a = a.child;
        continue;
      }
      if (a === n) break;
      for (; a.sibling === null; ) {
        if (a.return === null || a.return === n) return;
        a = a.return;
      }
      a.sibling.return = a.return, a = a.sibling;
    }
  }, ic = function() {
  }, Bf = function(t, n, a, d) {
    var y = t.memoizedProps;
    if (y !== d) {
      t = n.stateNode, pr(en.current);
      var v = null;
      switch (a) {
        case "input":
          y = Te(t, y), d = Te(t, d), v = [];
          break;
        case "select":
          y = K({}, y, { value: void 0 }), d = K({}, d, { value: void 0 }), v = [];
          break;
        case "textarea":
          y = cn(t, y), d = cn(t, d), v = [];
          break;
        default:
          typeof y.onClick != "function" && typeof d.onClick == "function" && (t.onclick = ds);
      }
      xo(a, d);
      var _;
      a = null;
      for (q in y) if (!d.hasOwnProperty(q) && y.hasOwnProperty(q) && y[q] != null) if (q === "style") {
        var B = y[q];
        for (_ in B) B.hasOwnProperty(_) && (a || (a = {}), a[_] = "");
      } else q !== "dangerouslySetInnerHTML" && q !== "children" && q !== "suppressContentEditableWarning" && q !== "suppressHydrationWarning" && q !== "autoFocus" && (i.hasOwnProperty(q) ? v || (v = []) : (v = v || []).push(q, null));
      for (q in d) {
        var z = d[q];
        if (B = y != null ? y[q] : void 0, d.hasOwnProperty(q) && z !== B && (z != null || B != null)) if (q === "style") if (B) {
          for (_ in B) !B.hasOwnProperty(_) || z && z.hasOwnProperty(_) || (a || (a = {}), a[_] = "");
          for (_ in z) z.hasOwnProperty(_) && B[_] !== z[_] && (a || (a = {}), a[_] = z[_]);
        } else a || (v || (v = []), v.push(
          q,
          a
        )), a = z;
        else q === "dangerouslySetInnerHTML" ? (z = z ? z.__html : void 0, B = B ? B.__html : void 0, z != null && B !== z && (v = v || []).push(q, z)) : q === "children" ? typeof z != "string" && typeof z != "number" || (v = v || []).push(q, "" + z) : q !== "suppressContentEditableWarning" && q !== "suppressHydrationWarning" && (i.hasOwnProperty(q) ? (z != null && q === "onScroll" && Pe("scroll", t), v || B === z || (v = [])) : (v = v || []).push(q, z));
      }
      a && (v = v || []).push("style", a);
      var q = v;
      (n.updateQueue = q) && (n.flags |= 4);
    }
  }, Ef = function(t, n, a, d) {
    a !== d && (n.flags |= 4);
  };
  function oa(t, n) {
    if (!Ve) switch (t.tailMode) {
      case "hidden":
        n = t.tail;
        for (var a = null; n !== null; ) n.alternate !== null && (a = n), n = n.sibling;
        a === null ? t.tail = null : a.sibling = null;
        break;
      case "collapsed":
        a = t.tail;
        for (var d = null; a !== null; ) a.alternate !== null && (d = a), a = a.sibling;
        d === null ? n || t.tail === null ? t.tail = null : t.tail.sibling = null : d.sibling = null;
    }
  }
  function it(t) {
    var n = t.alternate !== null && t.alternate.child === t.child, a = 0, d = 0;
    if (n) for (var y = t.child; y !== null; ) a |= y.lanes | y.childLanes, d |= y.subtreeFlags & 14680064, d |= y.flags & 14680064, y.return = t, y = y.sibling;
    else for (y = t.child; y !== null; ) a |= y.lanes | y.childLanes, d |= y.subtreeFlags, d |= y.flags, y.return = t, y = y.sibling;
    return t.subtreeFlags |= d, t.childLanes = a, n;
  }
  function vv(t, n, a) {
    var d = n.pendingProps;
    switch (jl(n), n.tag) {
      case 2:
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return it(n), null;
      case 1:
        return pt(n.type) && ps(), it(n), null;
      case 3:
        return d = n.stateNode, qr(), ze(ft), ze(at), Hl(), d.pendingContext && (d.context = d.pendingContext, d.pendingContext = null), (t === null || t.child === null) && (ws(n) ? n.flags |= 4 : t === null || t.memoizedState.isDehydrated && (n.flags & 256) === 0 || (n.flags |= 1024, zt !== null && (wc(zt), zt = null))), ic(t, n), it(n), null;
      case 5:
        Vl(n);
        var y = pr(qo.current);
        if (a = n.type, t !== null && n.stateNode != null) Bf(t, n, a, d, y), t.ref !== n.ref && (n.flags |= 512, n.flags |= 2097152);
        else {
          if (!d) {
            if (n.stateNode === null) throw Error(o(166));
            return it(n), null;
          }
          if (t = pr(en.current), ws(n)) {
            d = n.stateNode, a = n.type;
            var v = n.memoizedProps;
            switch (d[qt] = n, d[Yo] = v, t = (n.mode & 1) !== 0, a) {
              case "dialog":
                Pe("cancel", d), Pe("close", d);
                break;
              case "iframe":
              case "object":
              case "embed":
                Pe("load", d);
                break;
              case "video":
              case "audio":
                for (y = 0; y < Lo.length; y++) Pe(Lo[y], d);
                break;
              case "source":
                Pe("error", d);
                break;
              case "img":
              case "image":
              case "link":
                Pe(
                  "error",
                  d
                ), Pe("load", d);
                break;
              case "details":
                Pe("toggle", d);
                break;
              case "input":
                Be(d, v), Pe("invalid", d);
                break;
              case "select":
                d._wrapperState = { wasMultiple: !!v.multiple }, Pe("invalid", d);
                break;
              case "textarea":
                kn(d, v), Pe("invalid", d);
            }
            xo(a, v), y = null;
            for (var _ in v) if (v.hasOwnProperty(_)) {
              var B = v[_];
              _ === "children" ? typeof B == "string" ? d.textContent !== B && (v.suppressHydrationWarning !== !0 && us(d.textContent, B, t), y = ["children", B]) : typeof B == "number" && d.textContent !== "" + B && (v.suppressHydrationWarning !== !0 && us(
                d.textContent,
                B,
                t
              ), y = ["children", "" + B]) : i.hasOwnProperty(_) && B != null && _ === "onScroll" && Pe("scroll", d);
            }
            switch (a) {
              case "input":
                Ne(d), Ft(d, v, !0);
                break;
              case "textarea":
                Ne(d), er(d);
                break;
              case "select":
              case "option":
                break;
              default:
                typeof v.onClick == "function" && (d.onclick = ds);
            }
            d = y, n.updateQueue = d, d !== null && (n.flags |= 4);
          } else {
            _ = y.nodeType === 9 ? y : y.ownerDocument, t === "http://www.w3.org/1999/xhtml" && (t = un(a)), t === "http://www.w3.org/1999/xhtml" ? a === "script" ? (t = _.createElement("div"), t.innerHTML = "<script><\/script>", t = t.removeChild(t.firstChild)) : typeof d.is == "string" ? t = _.createElement(a, { is: d.is }) : (t = _.createElement(a), a === "select" && (_ = t, d.multiple ? _.multiple = !0 : d.size && (_.size = d.size))) : t = _.createElementNS(t, a), t[qt] = n, t[Yo] = d, Rf(t, n, !1, !1), n.stateNode = t;
            e: {
              switch (_ = Io(a, d), a) {
                case "dialog":
                  Pe("cancel", t), Pe("close", t), y = d;
                  break;
                case "iframe":
                case "object":
                case "embed":
                  Pe("load", t), y = d;
                  break;
                case "video":
                case "audio":
                  for (y = 0; y < Lo.length; y++) Pe(Lo[y], t);
                  y = d;
                  break;
                case "source":
                  Pe("error", t), y = d;
                  break;
                case "img":
                case "image":
                case "link":
                  Pe(
                    "error",
                    t
                  ), Pe("load", t), y = d;
                  break;
                case "details":
                  Pe("toggle", t), y = d;
                  break;
                case "input":
                  Be(t, d), y = Te(t, d), Pe("invalid", t);
                  break;
                case "option":
                  y = d;
                  break;
                case "select":
                  t._wrapperState = { wasMultiple: !!d.multiple }, y = K({}, d, { value: void 0 }), Pe("invalid", t);
                  break;
                case "textarea":
                  kn(t, d), y = cn(t, d), Pe("invalid", t);
                  break;
                default:
                  y = d;
              }
              xo(a, y), B = y;
              for (v in B) if (B.hasOwnProperty(v)) {
                var z = B[v];
                v === "style" ? Da(t, z) : v === "dangerouslySetInnerHTML" ? (z = z ? z.__html : void 0, z != null && Ba(t, z)) : v === "children" ? typeof z == "string" ? (a !== "textarea" || z !== "") && fn(t, z) : typeof z == "number" && fn(t, "" + z) : v !== "suppressContentEditableWarning" && v !== "suppressHydrationWarning" && v !== "autoFocus" && (i.hasOwnProperty(v) ? z != null && v === "onScroll" && Pe("scroll", t) : z != null && A(t, v, z, _));
              }
              switch (a) {
                case "input":
                  Ne(t), Ft(t, d, !1);
                  break;
                case "textarea":
                  Ne(t), er(t);
                  break;
                case "option":
                  d.value != null && t.setAttribute("value", "" + ne(d.value));
                  break;
                case "select":
                  t.multiple = !!d.multiple, v = d.value, v != null ? jt(t, !!d.multiple, v, !1) : d.defaultValue != null && jt(
                    t,
                    !!d.multiple,
                    d.defaultValue,
                    !0
                  );
                  break;
                default:
                  typeof y.onClick == "function" && (t.onclick = ds);
              }
              switch (a) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  d = !!d.autoFocus;
                  break e;
                case "img":
                  d = !0;
                  break e;
                default:
                  d = !1;
              }
            }
            d && (n.flags |= 4);
          }
          n.ref !== null && (n.flags |= 512, n.flags |= 2097152);
        }
        return it(n), null;
      case 6:
        if (t && n.stateNode != null) Ef(t, n, t.memoizedProps, d);
        else {
          if (typeof d != "string" && n.stateNode === null) throw Error(o(166));
          if (a = pr(qo.current), pr(en.current), ws(n)) {
            if (d = n.stateNode, a = n.memoizedProps, d[qt] = n, (v = d.nodeValue !== a) && (t = bt, t !== null)) switch (t.tag) {
              case 3:
                us(d.nodeValue, a, (t.mode & 1) !== 0);
                break;
              case 5:
                t.memoizedProps.suppressHydrationWarning !== !0 && us(d.nodeValue, a, (t.mode & 1) !== 0);
            }
            v && (n.flags |= 4);
          } else d = (a.nodeType === 9 ? a : a.ownerDocument).createTextNode(d), d[qt] = n, n.stateNode = d;
        }
        return it(n), null;
      case 13:
        if (ze(Le), d = n.memoizedState, t === null || t.memoizedState !== null && t.memoizedState.dehydrated !== null) {
          if (Ve && Nt !== null && (n.mode & 1) !== 0 && (n.flags & 128) === 0) Gd(), Ur(), n.flags |= 98560, v = !1;
          else if (v = ws(n), d !== null && d.dehydrated !== null) {
            if (t === null) {
              if (!v) throw Error(o(318));
              if (v = n.memoizedState, v = v !== null ? v.dehydrated : null, !v) throw Error(o(317));
              v[qt] = n;
            } else Ur(), (n.flags & 128) === 0 && (n.memoizedState = null), n.flags |= 4;
            it(n), v = !1;
          } else zt !== null && (wc(zt), zt = null), v = !0;
          if (!v) return n.flags & 65536 ? n : null;
        }
        return (n.flags & 128) !== 0 ? (n.lanes = a, n) : (d = d !== null, d !== (t !== null && t.memoizedState !== null) && d && (n.child.flags |= 8192, (n.mode & 1) !== 0 && (t === null || (Le.current & 1) !== 0 ? Je === 0 && (Je = 3) : Ic())), n.updateQueue !== null && (n.flags |= 4), it(n), null);
      case 4:
        return qr(), ic(t, n), t === null && Ko(n.stateNode.containerInfo), it(n), null;
      case 10:
        return Dl(n.type._context), it(n), null;
      case 17:
        return pt(n.type) && ps(), it(n), null;
      case 19:
        if (ze(Le), v = n.memoizedState, v === null) return it(n), null;
        if (d = (n.flags & 128) !== 0, _ = v.rendering, _ === null) if (d) oa(v, !1);
        else {
          if (Je !== 0 || t !== null && (t.flags & 128) !== 0) for (t = n.child; t !== null; ) {
            if (_ = Ns(t), _ !== null) {
              for (n.flags |= 128, oa(v, !1), d = _.updateQueue, d !== null && (n.updateQueue = d, n.flags |= 4), n.subtreeFlags = 0, d = a, a = n.child; a !== null; ) v = a, t = d, v.flags &= 14680066, _ = v.alternate, _ === null ? (v.childLanes = 0, v.lanes = t, v.child = null, v.subtreeFlags = 0, v.memoizedProps = null, v.memoizedState = null, v.updateQueue = null, v.dependencies = null, v.stateNode = null) : (v.childLanes = _.childLanes, v.lanes = _.lanes, v.child = _.child, v.subtreeFlags = 0, v.deletions = null, v.memoizedProps = _.memoizedProps, v.memoizedState = _.memoizedState, v.updateQueue = _.updateQueue, v.type = _.type, t = _.dependencies, v.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }), a = a.sibling;
              return Fe(Le, Le.current & 1 | 2), n.child;
            }
            t = t.sibling;
          }
          v.tail !== null && Xe() > ro && (n.flags |= 128, d = !0, oa(v, !1), n.lanes = 4194304);
        }
        else {
          if (!d) if (t = Ns(_), t !== null) {
            if (n.flags |= 128, d = !0, a = t.updateQueue, a !== null && (n.updateQueue = a, n.flags |= 4), oa(v, !0), v.tail === null && v.tailMode === "hidden" && !_.alternate && !Ve) return it(n), null;
          } else 2 * Xe() - v.renderingStartTime > ro && a !== 1073741824 && (n.flags |= 128, d = !0, oa(v, !1), n.lanes = 4194304);
          v.isBackwards ? (_.sibling = n.child, n.child = _) : (a = v.last, a !== null ? a.sibling = _ : n.child = _, v.last = _);
        }
        return v.tail !== null ? (n = v.tail, v.rendering = n, v.tail = n.sibling, v.renderingStartTime = Xe(), n.sibling = null, a = Le.current, Fe(Le, d ? a & 1 | 2 : a & 1), n) : (it(n), null);
      case 22:
      case 23:
        return xc(), d = n.memoizedState !== null, t !== null && t.memoizedState !== null !== d && (n.flags |= 8192), d && (n.mode & 1) !== 0 ? (_t & 1073741824) !== 0 && (it(n), n.subtreeFlags & 6 && (n.flags |= 8192)) : it(n), null;
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(o(156, n.tag));
  }
  function xv(t, n) {
    switch (jl(n), n.tag) {
      case 1:
        return pt(n.type) && ps(), t = n.flags, t & 65536 ? (n.flags = t & -65537 | 128, n) : null;
      case 3:
        return qr(), ze(ft), ze(at), Hl(), t = n.flags, (t & 65536) !== 0 && (t & 128) === 0 ? (n.flags = t & -65537 | 128, n) : null;
      case 5:
        return Vl(n), null;
      case 13:
        if (ze(Le), t = n.memoizedState, t !== null && t.dehydrated !== null) {
          if (n.alternate === null) throw Error(o(340));
          Ur();
        }
        return t = n.flags, t & 65536 ? (n.flags = t & -65537 | 128, n) : null;
      case 19:
        return ze(Le), null;
      case 4:
        return qr(), null;
      case 10:
        return Dl(n.type._context), null;
      case 22:
      case 23:
        return xc(), null;
      case 24:
        return null;
      default:
        return null;
    }
  }
  var Bs = !1, lt = !1, Iv = typeof WeakSet == "function" ? WeakSet : Set, me = null;
  function to(t, n) {
    var a = t.ref;
    if (a !== null) if (typeof a == "function") try {
      a(null);
    } catch (d) {
      Ze(t, n, d);
    }
    else a.current = null;
  }
  function lc(t, n, a) {
    try {
      a();
    } catch (d) {
      Ze(t, n, d);
    }
  }
  var Df = !1;
  function Cv(t, n) {
    if (xl = qa, t = fd(), fl(t)) {
      if ("selectionStart" in t) var a = { start: t.selectionStart, end: t.selectionEnd };
      else e: {
        a = (a = t.ownerDocument) && a.defaultView || window;
        var d = a.getSelection && a.getSelection();
        if (d && d.rangeCount !== 0) {
          a = d.anchorNode;
          var y = d.anchorOffset, v = d.focusNode;
          d = d.focusOffset;
          try {
            a.nodeType, v.nodeType;
          } catch {
            a = null;
            break e;
          }
          var _ = 0, B = -1, z = -1, q = 0, se = 0, ie = t, ae = null;
          t: for (; ; ) {
            for (var ge; ie !== a || y !== 0 && ie.nodeType !== 3 || (B = _ + y), ie !== v || d !== 0 && ie.nodeType !== 3 || (z = _ + d), ie.nodeType === 3 && (_ += ie.nodeValue.length), (ge = ie.firstChild) !== null; )
              ae = ie, ie = ge;
            for (; ; ) {
              if (ie === t) break t;
              if (ae === a && ++q === y && (B = _), ae === v && ++se === d && (z = _), (ge = ie.nextSibling) !== null) break;
              ie = ae, ae = ie.parentNode;
            }
            ie = ge;
          }
          a = B === -1 || z === -1 ? null : { start: B, end: z };
        } else a = null;
      }
      a = a || { start: 0, end: 0 };
    } else a = null;
    for (Il = { focusedElem: t, selectionRange: a }, qa = !1, me = n; me !== null; ) if (n = me, t = n.child, (n.subtreeFlags & 1028) !== 0 && t !== null) t.return = n, me = t;
    else for (; me !== null; ) {
      n = me;
      try {
        var he = n.alternate;
        if ((n.flags & 1024) !== 0) switch (n.tag) {
          case 0:
          case 11:
          case 15:
            break;
          case 1:
            if (he !== null) {
              var we = he.memoizedProps, Ye = he.memoizedState, $ = n.stateNode, X = $.getSnapshotBeforeUpdate(n.elementType === n.type ? we : Vt(n.type, we), Ye);
              $.__reactInternalSnapshotBeforeUpdate = X;
            }
            break;
          case 3:
            var J = n.stateNode.containerInfo;
            J.nodeType === 1 ? J.textContent = "" : J.nodeType === 9 && J.documentElement && J.removeChild(J.documentElement);
            break;
          case 5:
          case 6:
          case 4:
          case 17:
            break;
          default:
            throw Error(o(163));
        }
      } catch (ce) {
        Ze(n, n.return, ce);
      }
      if (t = n.sibling, t !== null) {
        t.return = n.return, me = t;
        break;
      }
      me = n.return;
    }
    return he = Df, Df = !1, he;
  }
  function aa(t, n, a) {
    var d = n.updateQueue;
    if (d = d !== null ? d.lastEffect : null, d !== null) {
      var y = d = d.next;
      do {
        if ((y.tag & t) === t) {
          var v = y.destroy;
          y.destroy = void 0, v !== void 0 && lc(n, a, v);
        }
        y = y.next;
      } while (y !== d);
    }
  }
  function Es(t, n) {
    if (n = n.updateQueue, n = n !== null ? n.lastEffect : null, n !== null) {
      var a = n = n.next;
      do {
        if ((a.tag & t) === t) {
          var d = a.create;
          a.destroy = d();
        }
        a = a.next;
      } while (a !== n);
    }
  }
  function cc(t) {
    var n = t.ref;
    if (n !== null) {
      var a = t.stateNode;
      switch (t.tag) {
        case 5:
          t = a;
          break;
        default:
          t = a;
      }
      typeof n == "function" ? n(t) : n.current = t;
    }
  }
  function Gf(t) {
    var n = t.alternate;
    n !== null && (t.alternate = null, Gf(n)), t.child = null, t.deletions = null, t.sibling = null, t.tag === 5 && (n = t.stateNode, n !== null && (delete n[qt], delete n[Yo], delete n[_l], delete n[ov], delete n[av])), t.stateNode = null, t.return = null, t.dependencies = null, t.memoizedProps = null, t.memoizedState = null, t.pendingProps = null, t.stateNode = null, t.updateQueue = null;
  }
  function Ff(t) {
    return t.tag === 5 || t.tag === 3 || t.tag === 4;
  }
  function Pf(t) {
    e: for (; ; ) {
      for (; t.sibling === null; ) {
        if (t.return === null || Ff(t.return)) return null;
        t = t.return;
      }
      for (t.sibling.return = t.return, t = t.sibling; t.tag !== 5 && t.tag !== 6 && t.tag !== 18; ) {
        if (t.flags & 2 || t.child === null || t.tag === 4) continue e;
        t.child.return = t, t = t.child;
      }
      if (!(t.flags & 2)) return t.stateNode;
    }
  }
  function uc(t, n, a) {
    var d = t.tag;
    if (d === 5 || d === 6) t = t.stateNode, n ? a.nodeType === 8 ? a.parentNode.insertBefore(t, n) : a.insertBefore(t, n) : (a.nodeType === 8 ? (n = a.parentNode, n.insertBefore(t, a)) : (n = a, n.appendChild(t)), a = a._reactRootContainer, a != null || n.onclick !== null || (n.onclick = ds));
    else if (d !== 4 && (t = t.child, t !== null)) for (uc(t, n, a), t = t.sibling; t !== null; ) uc(t, n, a), t = t.sibling;
  }
  function dc(t, n, a) {
    var d = t.tag;
    if (d === 5 || d === 6) t = t.stateNode, n ? a.insertBefore(t, n) : a.appendChild(t);
    else if (d !== 4 && (t = t.child, t !== null)) for (dc(t, n, a), t = t.sibling; t !== null; ) dc(t, n, a), t = t.sibling;
  }
  var rt = null, Ot = !1;
  function Wn(t, n, a) {
    for (a = a.child; a !== null; ) zf(t, n, a), a = a.sibling;
  }
  function zf(t, n, a) {
    if (Mt && typeof Mt.onCommitFiberUnmount == "function") try {
      Mt.onCommitFiberUnmount(sr, a);
    } catch {
    }
    switch (a.tag) {
      case 5:
        lt || to(a, n);
      case 6:
        var d = rt, y = Ot;
        rt = null, Wn(t, n, a), rt = d, Ot = y, rt !== null && (Ot ? (t = rt, a = a.stateNode, t.nodeType === 8 ? t.parentNode.removeChild(a) : t.removeChild(a)) : rt.removeChild(a.stateNode));
        break;
      case 18:
        rt !== null && (Ot ? (t = rt, a = a.stateNode, t.nodeType === 8 ? Nl(t.parentNode, a) : t.nodeType === 1 && Nl(t, a), Fo(t)) : Nl(rt, a.stateNode));
        break;
      case 4:
        d = rt, y = Ot, rt = a.stateNode.containerInfo, Ot = !0, Wn(t, n, a), rt = d, Ot = y;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (!lt && (d = a.updateQueue, d !== null && (d = d.lastEffect, d !== null))) {
          y = d = d.next;
          do {
            var v = y, _ = v.destroy;
            v = v.tag, _ !== void 0 && ((v & 2) !== 0 || (v & 4) !== 0) && lc(a, n, _), y = y.next;
          } while (y !== d);
        }
        Wn(t, n, a);
        break;
      case 1:
        if (!lt && (to(a, n), d = a.stateNode, typeof d.componentWillUnmount == "function")) try {
          d.props = a.memoizedProps, d.state = a.memoizedState, d.componentWillUnmount();
        } catch (B) {
          Ze(a, n, B);
        }
        Wn(t, n, a);
        break;
      case 21:
        Wn(t, n, a);
        break;
      case 22:
        a.mode & 1 ? (lt = (d = lt) || a.memoizedState !== null, Wn(t, n, a), lt = d) : Wn(t, n, a);
        break;
      default:
        Wn(t, n, a);
    }
  }
  function Vf(t) {
    var n = t.updateQueue;
    if (n !== null) {
      t.updateQueue = null;
      var a = t.stateNode;
      a === null && (a = t.stateNode = new Iv()), n.forEach(function(d) {
        var y = Tv.bind(null, t, d);
        a.has(d) || (a.add(d), d.then(y, y));
      });
    }
  }
  function Ht(t, n) {
    var a = n.deletions;
    if (a !== null) for (var d = 0; d < a.length; d++) {
      var y = a[d];
      try {
        var v = t, _ = n, B = _;
        e: for (; B !== null; ) {
          switch (B.tag) {
            case 5:
              rt = B.stateNode, Ot = !1;
              break e;
            case 3:
              rt = B.stateNode.containerInfo, Ot = !0;
              break e;
            case 4:
              rt = B.stateNode.containerInfo, Ot = !0;
              break e;
          }
          B = B.return;
        }
        if (rt === null) throw Error(o(160));
        zf(v, _, y), rt = null, Ot = !1;
        var z = y.alternate;
        z !== null && (z.return = null), y.return = null;
      } catch (q) {
        Ze(y, n, q);
      }
    }
    if (n.subtreeFlags & 12854) for (n = n.child; n !== null; ) Of(n, t), n = n.sibling;
  }
  function Of(t, n) {
    var a = t.alternate, d = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (Ht(n, t), nn(t), d & 4) {
          try {
            aa(3, t, t.return), Es(3, t);
          } catch (we) {
            Ze(t, t.return, we);
          }
          try {
            aa(5, t, t.return);
          } catch (we) {
            Ze(t, t.return, we);
          }
        }
        break;
      case 1:
        Ht(n, t), nn(t), d & 512 && a !== null && to(a, a.return);
        break;
      case 5:
        if (Ht(n, t), nn(t), d & 512 && a !== null && to(a, a.return), t.flags & 32) {
          var y = t.stateNode;
          try {
            fn(y, "");
          } catch (we) {
            Ze(t, t.return, we);
          }
        }
        if (d & 4 && (y = t.stateNode, y != null)) {
          var v = t.memoizedProps, _ = a !== null ? a.memoizedProps : v, B = t.type, z = t.updateQueue;
          if (t.updateQueue = null, z !== null) try {
            B === "input" && v.type === "radio" && v.name != null && je(y, v), Io(B, _);
            var q = Io(B, v);
            for (_ = 0; _ < z.length; _ += 2) {
              var se = z[_], ie = z[_ + 1];
              se === "style" ? Da(y, ie) : se === "dangerouslySetInnerHTML" ? Ba(y, ie) : se === "children" ? fn(y, ie) : A(y, se, ie, q);
            }
            switch (B) {
              case "input":
                We(y, v);
                break;
              case "textarea":
                jr(y, v);
                break;
              case "select":
                var ae = y._wrapperState.wasMultiple;
                y._wrapperState.wasMultiple = !!v.multiple;
                var ge = v.value;
                ge != null ? jt(y, !!v.multiple, ge, !1) : ae !== !!v.multiple && (v.defaultValue != null ? jt(
                  y,
                  !!v.multiple,
                  v.defaultValue,
                  !0
                ) : jt(y, !!v.multiple, v.multiple ? [] : "", !1));
            }
            y[Yo] = v;
          } catch (we) {
            Ze(t, t.return, we);
          }
        }
        break;
      case 6:
        if (Ht(n, t), nn(t), d & 4) {
          if (t.stateNode === null) throw Error(o(162));
          y = t.stateNode, v = t.memoizedProps;
          try {
            y.nodeValue = v;
          } catch (we) {
            Ze(t, t.return, we);
          }
        }
        break;
      case 3:
        if (Ht(n, t), nn(t), d & 4 && a !== null && a.memoizedState.isDehydrated) try {
          Fo(n.containerInfo);
        } catch (we) {
          Ze(t, t.return, we);
        }
        break;
      case 4:
        Ht(n, t), nn(t);
        break;
      case 13:
        Ht(n, t), nn(t), y = t.child, y.flags & 8192 && (v = y.memoizedState !== null, y.stateNode.isHidden = v, !v || y.alternate !== null && y.alternate.memoizedState !== null || (gc = Xe())), d & 4 && Vf(t);
        break;
      case 22:
        if (se = a !== null && a.memoizedState !== null, t.mode & 1 ? (lt = (q = lt) || se, Ht(n, t), lt = q) : Ht(n, t), nn(t), d & 8192) {
          if (q = t.memoizedState !== null, (t.stateNode.isHidden = q) && !se && (t.mode & 1) !== 0) for (me = t, se = t.child; se !== null; ) {
            for (ie = me = se; me !== null; ) {
              switch (ae = me, ge = ae.child, ae.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  aa(4, ae, ae.return);
                  break;
                case 1:
                  to(ae, ae.return);
                  var he = ae.stateNode;
                  if (typeof he.componentWillUnmount == "function") {
                    d = ae, a = ae.return;
                    try {
                      n = d, he.props = n.memoizedProps, he.state = n.memoizedState, he.componentWillUnmount();
                    } catch (we) {
                      Ze(d, a, we);
                    }
                  }
                  break;
                case 5:
                  to(ae, ae.return);
                  break;
                case 22:
                  if (ae.memoizedState !== null) {
                    Xf(ie);
                    continue;
                  }
              }
              ge !== null ? (ge.return = ae, me = ge) : Xf(ie);
            }
            se = se.sibling;
          }
          e: for (se = null, ie = t; ; ) {
            if (ie.tag === 5) {
              if (se === null) {
                se = ie;
                try {
                  y = ie.stateNode, q ? (v = y.style, typeof v.setProperty == "function" ? v.setProperty("display", "none", "important") : v.display = "none") : (B = ie.stateNode, z = ie.memoizedProps.style, _ = z != null && z.hasOwnProperty("display") ? z.display : null, B.style.display = Ea("display", _));
                } catch (we) {
                  Ze(t, t.return, we);
                }
              }
            } else if (ie.tag === 6) {
              if (se === null) try {
                ie.stateNode.nodeValue = q ? "" : ie.memoizedProps;
              } catch (we) {
                Ze(t, t.return, we);
              }
            } else if ((ie.tag !== 22 && ie.tag !== 23 || ie.memoizedState === null || ie === t) && ie.child !== null) {
              ie.child.return = ie, ie = ie.child;
              continue;
            }
            if (ie === t) break e;
            for (; ie.sibling === null; ) {
              if (ie.return === null || ie.return === t) break e;
              se === ie && (se = null), ie = ie.return;
            }
            se === ie && (se = null), ie.sibling.return = ie.return, ie = ie.sibling;
          }
        }
        break;
      case 19:
        Ht(n, t), nn(t), d & 4 && Vf(t);
        break;
      case 21:
        break;
      default:
        Ht(
          n,
          t
        ), nn(t);
    }
  }
  function nn(t) {
    var n = t.flags;
    if (n & 2) {
      try {
        e: {
          for (var a = t.return; a !== null; ) {
            if (Ff(a)) {
              var d = a;
              break e;
            }
            a = a.return;
          }
          throw Error(o(160));
        }
        switch (d.tag) {
          case 5:
            var y = d.stateNode;
            d.flags & 32 && (fn(y, ""), d.flags &= -33);
            var v = Pf(t);
            dc(t, v, y);
            break;
          case 3:
          case 4:
            var _ = d.stateNode.containerInfo, B = Pf(t);
            uc(t, B, _);
            break;
          default:
            throw Error(o(161));
        }
      } catch (z) {
        Ze(t, t.return, z);
      }
      t.flags &= -3;
    }
    n & 4096 && (t.flags &= -4097);
  }
  function bv(t, n, a) {
    me = t, Hf(t);
  }
  function Hf(t, n, a) {
    for (var d = (t.mode & 1) !== 0; me !== null; ) {
      var y = me, v = y.child;
      if (y.tag === 22 && d) {
        var _ = y.memoizedState !== null || Bs;
        if (!_) {
          var B = y.alternate, z = B !== null && B.memoizedState !== null || lt;
          B = Bs;
          var q = lt;
          if (Bs = _, (lt = z) && !q) for (me = y; me !== null; ) _ = me, z = _.child, _.tag === 22 && _.memoizedState !== null ? Lf(y) : z !== null ? (z.return = _, me = z) : Lf(y);
          for (; v !== null; ) me = v, Hf(v), v = v.sibling;
          me = y, Bs = B, lt = q;
        }
        Wf(t);
      } else (y.subtreeFlags & 8772) !== 0 && v !== null ? (v.return = y, me = v) : Wf(t);
    }
  }
  function Wf(t) {
    for (; me !== null; ) {
      var n = me;
      if ((n.flags & 8772) !== 0) {
        var a = n.alternate;
        try {
          if ((n.flags & 8772) !== 0) switch (n.tag) {
            case 0:
            case 11:
            case 15:
              lt || Es(5, n);
              break;
            case 1:
              var d = n.stateNode;
              if (n.flags & 4 && !lt) if (a === null) d.componentDidMount();
              else {
                var y = n.elementType === n.type ? a.memoizedProps : Vt(n.type, a.memoizedProps);
                d.componentDidUpdate(y, a.memoizedState, d.__reactInternalSnapshotBeforeUpdate);
              }
              var v = n.updateQueue;
              v !== null && Wd(n, v, d);
              break;
            case 3:
              var _ = n.updateQueue;
              if (_ !== null) {
                if (a = null, n.child !== null) switch (n.child.tag) {
                  case 5:
                    a = n.child.stateNode;
                    break;
                  case 1:
                    a = n.child.stateNode;
                }
                Wd(n, _, a);
              }
              break;
            case 5:
              var B = n.stateNode;
              if (a === null && n.flags & 4) {
                a = B;
                var z = n.memoizedProps;
                switch (n.type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    z.autoFocus && a.focus();
                    break;
                  case "img":
                    z.src && (a.src = z.src);
                }
              }
              break;
            case 6:
              break;
            case 4:
              break;
            case 12:
              break;
            case 13:
              if (n.memoizedState === null) {
                var q = n.alternate;
                if (q !== null) {
                  var se = q.memoizedState;
                  if (se !== null) {
                    var ie = se.dehydrated;
                    ie !== null && Fo(ie);
                  }
                }
              }
              break;
            case 19:
            case 17:
            case 21:
            case 22:
            case 23:
            case 25:
              break;
            default:
              throw Error(o(163));
          }
          lt || n.flags & 512 && cc(n);
        } catch (ae) {
          Ze(n, n.return, ae);
        }
      }
      if (n === t) {
        me = null;
        break;
      }
      if (a = n.sibling, a !== null) {
        a.return = n.return, me = a;
        break;
      }
      me = n.return;
    }
  }
  function Xf(t) {
    for (; me !== null; ) {
      var n = me;
      if (n === t) {
        me = null;
        break;
      }
      var a = n.sibling;
      if (a !== null) {
        a.return = n.return, me = a;
        break;
      }
      me = n.return;
    }
  }
  function Lf(t) {
    for (; me !== null; ) {
      var n = me;
      try {
        switch (n.tag) {
          case 0:
          case 11:
          case 15:
            var a = n.return;
            try {
              Es(4, n);
            } catch (z) {
              Ze(n, a, z);
            }
            break;
          case 1:
            var d = n.stateNode;
            if (typeof d.componentDidMount == "function") {
              var y = n.return;
              try {
                d.componentDidMount();
              } catch (z) {
                Ze(n, y, z);
              }
            }
            var v = n.return;
            try {
              cc(n);
            } catch (z) {
              Ze(n, v, z);
            }
            break;
          case 5:
            var _ = n.return;
            try {
              cc(n);
            } catch (z) {
              Ze(n, _, z);
            }
        }
      } catch (z) {
        Ze(n, n.return, z);
      }
      if (n === t) {
        me = null;
        break;
      }
      var B = n.sibling;
      if (B !== null) {
        B.return = n.return, me = B;
        break;
      }
      me = n.return;
    }
  }
  var Nv = Math.ceil, Ds = S.ReactCurrentDispatcher, fc = S.ReactCurrentOwner, Dt = S.ReactCurrentBatchConfig, Ee = 0, et = null, Ue = null, ot = 0, _t = 0, no = Pn(0), Je = 0, sa = null, mr = 0, Gs = 0, pc = 0, ia = null, mt = null, gc = 0, ro = 1 / 0, xn = null, Fs = !1, mc = null, Xn = null, Ps = !1, Ln = null, zs = 0, la = 0, hc = null, Vs = -1, Os = 0;
  function dt() {
    return (Ee & 6) !== 0 ? Xe() : Vs !== -1 ? Vs : Vs = Xe();
  }
  function Kn(t) {
    return (t.mode & 1) === 0 ? 1 : (Ee & 2) !== 0 && ot !== 0 ? ot & -ot : iv.transition !== null ? (Os === 0 && (Os = Gr()), Os) : (t = Ge, t !== 0 || (t = window.event, t = t === void 0 ? 16 : Ku(t.type)), t);
  }
  function Wt(t, n, a, d) {
    if (50 < la) throw la = 0, hc = null, Error(o(185));
    ir(t, a, d), ((Ee & 2) === 0 || t !== et) && (t === et && ((Ee & 2) === 0 && (Gs |= a), Je === 4 && Zn(t, ot)), ht(t, d), a === 1 && Ee === 0 && (n.mode & 1) === 0 && (ro = Xe() + 500, ms && Vn()));
  }
  function ht(t, n) {
    var a = t.callbackNode;
    Qi(t, n);
    var d = Dr(t, t === et ? ot : 0);
    if (d === 0) a !== null && La(a), t.callbackNode = null, t.callbackPriority = 0;
    else if (n = d & -d, t.callbackPriority !== n) {
      if (a != null && La(a), n === 1) t.tag === 0 ? sv(Zf.bind(null, t)) : Td(Zf.bind(null, t)), nv(function() {
        (Ee & 6) === 0 && Vn();
      }), a = null;
      else {
        switch (Pu(d)) {
          case 1:
            a = Mo;
            break;
          case 4:
            a = Za;
            break;
          case 16:
            a = Rr;
            break;
          case 536870912:
            a = Ya;
            break;
          default:
            a = Rr;
        }
        a = tp(a, Kf.bind(null, t));
      }
      t.callbackPriority = n, t.callbackNode = a;
    }
  }
  function Kf(t, n) {
    if (Vs = -1, Os = 0, (Ee & 6) !== 0) throw Error(o(327));
    var a = t.callbackNode;
    if (oo() && t.callbackNode !== a) return null;
    var d = Dr(t, t === et ? ot : 0);
    if (d === 0) return null;
    if ((d & 30) !== 0 || (d & t.expiredLanes) !== 0 || n) n = Hs(t, d);
    else {
      n = d;
      var y = Ee;
      Ee |= 2;
      var v = Uf();
      (et !== t || ot !== n) && (xn = null, ro = Xe() + 500, yr(t, n));
      do
        try {
          Sv();
          break;
        } catch (B) {
          Yf(t, B);
        }
      while (!0);
      El(), Ds.current = v, Ee = y, Ue !== null ? n = 0 : (et = null, ot = 0, n = Je);
    }
    if (n !== 0) {
      if (n === 2 && (y = To(t), y !== 0 && (d = y, n = yc(t, y))), n === 1) throw a = sa, yr(t, 0), Zn(t, d), ht(t, Xe()), a;
      if (n === 6) Zn(t, d);
      else {
        if (y = t.current.alternate, (d & 30) === 0 && !_v(y) && (n = Hs(t, d), n === 2 && (v = To(t), v !== 0 && (d = v, n = yc(t, v))), n === 1)) throw a = sa, yr(t, 0), Zn(t, d), ht(t, Xe()), a;
        switch (t.finishedWork = y, t.finishedLanes = d, n) {
          case 0:
          case 1:
            throw Error(o(345));
          case 2:
            wr(t, mt, xn);
            break;
          case 3:
            if (Zn(t, d), (d & 130023424) === d && (n = gc + 500 - Xe(), 10 < n)) {
              if (Dr(t, 0) !== 0) break;
              if (y = t.suspendedLanes, (y & d) !== d) {
                dt(), t.pingedLanes |= t.suspendedLanes & y;
                break;
              }
              t.timeoutHandle = bl(wr.bind(null, t, mt, xn), n);
              break;
            }
            wr(t, mt, xn);
            break;
          case 4:
            if (Zn(t, d), (d & 4194240) === d) break;
            for (n = t.eventTimes, y = -1; 0 < d; ) {
              var _ = 31 - It(d);
              v = 1 << _, _ = n[_], _ > y && (y = _), d &= ~v;
            }
            if (d = y, d = Xe() - d, d = (120 > d ? 120 : 480 > d ? 480 : 1080 > d ? 1080 : 1920 > d ? 1920 : 3e3 > d ? 3e3 : 4320 > d ? 4320 : 1960 * Nv(d / 1960)) - d, 10 < d) {
              t.timeoutHandle = bl(wr.bind(null, t, mt, xn), d);
              break;
            }
            wr(t, mt, xn);
            break;
          case 5:
            wr(t, mt, xn);
            break;
          default:
            throw Error(o(329));
        }
      }
    }
    return ht(t, Xe()), t.callbackNode === a ? Kf.bind(null, t) : null;
  }
  function yc(t, n) {
    var a = ia;
    return t.current.memoizedState.isDehydrated && (yr(t, n).flags |= 256), t = Hs(t, n), t !== 2 && (n = mt, mt = a, n !== null && wc(n)), t;
  }
  function wc(t) {
    mt === null ? mt = t : mt.push.apply(mt, t);
  }
  function _v(t) {
    for (var n = t; ; ) {
      if (n.flags & 16384) {
        var a = n.updateQueue;
        if (a !== null && (a = a.stores, a !== null)) for (var d = 0; d < a.length; d++) {
          var y = a[d], v = y.getSnapshot;
          y = y.value;
          try {
            if (!Pt(v(), y)) return !1;
          } catch {
            return !1;
          }
        }
      }
      if (a = n.child, n.subtreeFlags & 16384 && a !== null) a.return = n, n = a;
      else {
        if (n === t) break;
        for (; n.sibling === null; ) {
          if (n.return === null || n.return === t) return !0;
          n = n.return;
        }
        n.sibling.return = n.return, n = n.sibling;
      }
    }
    return !0;
  }
  function Zn(t, n) {
    for (n &= ~pc, n &= ~Gs, t.suspendedLanes |= n, t.pingedLanes &= ~n, t = t.expirationTimes; 0 < n; ) {
      var a = 31 - It(n), d = 1 << a;
      t[a] = -1, n &= ~d;
    }
  }
  function Zf(t) {
    if ((Ee & 6) !== 0) throw Error(o(327));
    oo();
    var n = Dr(t, 0);
    if ((n & 1) === 0) return ht(t, Xe()), null;
    var a = Hs(t, n);
    if (t.tag !== 0 && a === 2) {
      var d = To(t);
      d !== 0 && (n = d, a = yc(t, d));
    }
    if (a === 1) throw a = sa, yr(t, 0), Zn(t, n), ht(t, Xe()), a;
    if (a === 6) throw Error(o(345));
    return t.finishedWork = t.current.alternate, t.finishedLanes = n, wr(t, mt, xn), ht(t, Xe()), null;
  }
  function vc(t, n) {
    var a = Ee;
    Ee |= 1;
    try {
      return t(n);
    } finally {
      Ee = a, Ee === 0 && (ro = Xe() + 500, ms && Vn());
    }
  }
  function hr(t) {
    Ln !== null && Ln.tag === 0 && (Ee & 6) === 0 && oo();
    var n = Ee;
    Ee |= 1;
    var a = Dt.transition, d = Ge;
    try {
      if (Dt.transition = null, Ge = 1, t) return t();
    } finally {
      Ge = d, Dt.transition = a, Ee = n, (Ee & 6) === 0 && Vn();
    }
  }
  function xc() {
    _t = no.current, ze(no);
  }
  function yr(t, n) {
    t.finishedWork = null, t.finishedLanes = 0;
    var a = t.timeoutHandle;
    if (a !== -1 && (t.timeoutHandle = -1, tv(a)), Ue !== null) for (a = Ue.return; a !== null; ) {
      var d = a;
      switch (jl(d), d.tag) {
        case 1:
          d = d.type.childContextTypes, d != null && ps();
          break;
        case 3:
          qr(), ze(ft), ze(at), Hl();
          break;
        case 5:
          Vl(d);
          break;
        case 4:
          qr();
          break;
        case 13:
          ze(Le);
          break;
        case 19:
          ze(Le);
          break;
        case 10:
          Dl(d.type._context);
          break;
        case 22:
        case 23:
          xc();
      }
      a = a.return;
    }
    if (et = t, Ue = t = Yn(t.current, null), ot = _t = n, Je = 0, sa = null, pc = Gs = mr = 0, mt = ia = null, fr !== null) {
      for (n = 0; n < fr.length; n++) if (a = fr[n], d = a.interleaved, d !== null) {
        a.interleaved = null;
        var y = d.next, v = a.pending;
        if (v !== null) {
          var _ = v.next;
          v.next = y, d.next = _;
        }
        a.pending = d;
      }
      fr = null;
    }
    return t;
  }
  function Yf(t, n) {
    do {
      var a = Ue;
      try {
        if (El(), _s.current = js, As) {
          for (var d = Ke.memoizedState; d !== null; ) {
            var y = d.queue;
            y !== null && (y.pending = null), d = d.next;
          }
          As = !1;
        }
        if (gr = 0, qe = Qe = Ke = null, ea = !1, ta = 0, fc.current = null, a === null || a.return === null) {
          Je = 1, sa = n, Ue = null;
          break;
        }
        e: {
          var v = t, _ = a.return, B = a, z = n;
          if (n = ot, B.flags |= 32768, z !== null && typeof z == "object" && typeof z.then == "function") {
            var q = z, se = B, ie = se.tag;
            if ((se.mode & 1) === 0 && (ie === 0 || ie === 11 || ie === 15)) {
              var ae = se.alternate;
              ae ? (se.updateQueue = ae.updateQueue, se.memoizedState = ae.memoizedState, se.lanes = ae.lanes) : (se.updateQueue = null, se.memoizedState = null);
            }
            var ge = vf(_);
            if (ge !== null) {
              ge.flags &= -257, xf(ge, _, B, v, n), ge.mode & 1 && wf(v, q, n), n = ge, z = q;
              var he = n.updateQueue;
              if (he === null) {
                var we = /* @__PURE__ */ new Set();
                we.add(z), n.updateQueue = we;
              } else he.add(z);
              break e;
            } else {
              if ((n & 1) === 0) {
                wf(v, q, n), Ic();
                break e;
              }
              z = Error(o(426));
            }
          } else if (Ve && B.mode & 1) {
            var Ye = vf(_);
            if (Ye !== null) {
              (Ye.flags & 65536) === 0 && (Ye.flags |= 256), xf(Ye, _, B, v, n), Rl(eo(z, B));
              break e;
            }
          }
          v = z = eo(z, B), Je !== 4 && (Je = 2), ia === null ? ia = [v] : ia.push(v), v = _;
          do {
            switch (v.tag) {
              case 3:
                v.flags |= 65536, n &= -n, v.lanes |= n;
                var $ = hf(v, z, n);
                Hd(v, $);
                break e;
              case 1:
                B = z;
                var X = v.type, J = v.stateNode;
                if ((v.flags & 128) === 0 && (typeof X.getDerivedStateFromError == "function" || J !== null && typeof J.componentDidCatch == "function" && (Xn === null || !Xn.has(J)))) {
                  v.flags |= 65536, n &= -n, v.lanes |= n;
                  var ce = yf(v, B, n);
                  Hd(v, ce);
                  break e;
                }
            }
            v = v.return;
          } while (v !== null);
        }
        Qf(a);
      } catch (Ie) {
        n = Ie, Ue === a && a !== null && (Ue = a = a.return);
        continue;
      }
      break;
    } while (!0);
  }
  function Uf() {
    var t = Ds.current;
    return Ds.current = js, t === null ? js : t;
  }
  function Ic() {
    (Je === 0 || Je === 3 || Je === 2) && (Je = 4), et === null || (mr & 268435455) === 0 && (Gs & 268435455) === 0 || Zn(et, ot);
  }
  function Hs(t, n) {
    var a = Ee;
    Ee |= 2;
    var d = Uf();
    (et !== t || ot !== n) && (xn = null, yr(t, n));
    do
      try {
        Av();
        break;
      } catch (y) {
        Yf(t, y);
      }
    while (!0);
    if (El(), Ee = a, Ds.current = d, Ue !== null) throw Error(o(261));
    return et = null, ot = 0, Je;
  }
  function Av() {
    for (; Ue !== null; ) $f(Ue);
  }
  function Sv() {
    for (; Ue !== null && !Xi(); ) $f(Ue);
  }
  function $f(t) {
    var n = ep(t.alternate, t, _t);
    t.memoizedProps = t.pendingProps, n === null ? Qf(t) : Ue = n, fc.current = null;
  }
  function Qf(t) {
    var n = t;
    do {
      var a = n.alternate;
      if (t = n.return, (n.flags & 32768) === 0) {
        if (a = vv(a, n, _t), a !== null) {
          Ue = a;
          return;
        }
      } else {
        if (a = xv(a, n), a !== null) {
          a.flags &= 32767, Ue = a;
          return;
        }
        if (t !== null) t.flags |= 32768, t.subtreeFlags = 0, t.deletions = null;
        else {
          Je = 6, Ue = null;
          return;
        }
      }
      if (n = n.sibling, n !== null) {
        Ue = n;
        return;
      }
      Ue = n = t;
    } while (n !== null);
    Je === 0 && (Je = 5);
  }
  function wr(t, n, a) {
    var d = Ge, y = Dt.transition;
    try {
      Dt.transition = null, Ge = 1, kv(t, n, a, d);
    } finally {
      Dt.transition = y, Ge = d;
    }
    return null;
  }
  function kv(t, n, a, d) {
    do
      oo();
    while (Ln !== null);
    if ((Ee & 6) !== 0) throw Error(o(327));
    a = t.finishedWork;
    var y = t.finishedLanes;
    if (a === null) return null;
    if (t.finishedWork = null, t.finishedLanes = 0, a === t.current) throw Error(o(177));
    t.callbackNode = null, t.callbackPriority = 0;
    var v = a.lanes | a.childLanes;
    if ($a(t, v), t === et && (Ue = et = null, ot = 0), (a.subtreeFlags & 2064) === 0 && (a.flags & 2064) === 0 || Ps || (Ps = !0, tp(Rr, function() {
      return oo(), null;
    })), v = (a.flags & 15990) !== 0, (a.subtreeFlags & 15990) !== 0 || v) {
      v = Dt.transition, Dt.transition = null;
      var _ = Ge;
      Ge = 1;
      var B = Ee;
      Ee |= 4, fc.current = null, Cv(t, a), Of(a, t), Yw(Il), qa = !!xl, Il = xl = null, t.current = a, bv(a), Ka(), Ee = B, Ge = _, Dt.transition = v;
    } else t.current = a;
    if (Ps && (Ps = !1, Ln = t, zs = y), v = t.pendingLanes, v === 0 && (Xn = null), Zi(a.stateNode), ht(t, Xe()), n !== null) for (d = t.onRecoverableError, a = 0; a < n.length; a++) y = n[a], d(y.value, { componentStack: y.stack, digest: y.digest });
    if (Fs) throw Fs = !1, t = mc, mc = null, t;
    return (zs & 1) !== 0 && t.tag !== 0 && oo(), v = t.pendingLanes, (v & 1) !== 0 ? t === hc ? la++ : (la = 0, hc = t) : la = 0, Vn(), null;
  }
  function oo() {
    if (Ln !== null) {
      var t = Pu(zs), n = Dt.transition, a = Ge;
      try {
        if (Dt.transition = null, Ge = 16 > t ? 16 : t, Ln === null) var d = !1;
        else {
          if (t = Ln, Ln = null, zs = 0, (Ee & 6) !== 0) throw Error(o(331));
          var y = Ee;
          for (Ee |= 4, me = t.current; me !== null; ) {
            var v = me, _ = v.child;
            if ((me.flags & 16) !== 0) {
              var B = v.deletions;
              if (B !== null) {
                for (var z = 0; z < B.length; z++) {
                  var q = B[z];
                  for (me = q; me !== null; ) {
                    var se = me;
                    switch (se.tag) {
                      case 0:
                      case 11:
                      case 15:
                        aa(8, se, v);
                    }
                    var ie = se.child;
                    if (ie !== null) ie.return = se, me = ie;
                    else for (; me !== null; ) {
                      se = me;
                      var ae = se.sibling, ge = se.return;
                      if (Gf(se), se === q) {
                        me = null;
                        break;
                      }
                      if (ae !== null) {
                        ae.return = ge, me = ae;
                        break;
                      }
                      me = ge;
                    }
                  }
                }
                var he = v.alternate;
                if (he !== null) {
                  var we = he.child;
                  if (we !== null) {
                    he.child = null;
                    do {
                      var Ye = we.sibling;
                      we.sibling = null, we = Ye;
                    } while (we !== null);
                  }
                }
                me = v;
              }
            }
            if ((v.subtreeFlags & 2064) !== 0 && _ !== null) _.return = v, me = _;
            else e: for (; me !== null; ) {
              if (v = me, (v.flags & 2048) !== 0) switch (v.tag) {
                case 0:
                case 11:
                case 15:
                  aa(9, v, v.return);
              }
              var $ = v.sibling;
              if ($ !== null) {
                $.return = v.return, me = $;
                break e;
              }
              me = v.return;
            }
          }
          var X = t.current;
          for (me = X; me !== null; ) {
            _ = me;
            var J = _.child;
            if ((_.subtreeFlags & 2064) !== 0 && J !== null) J.return = _, me = J;
            else e: for (_ = X; me !== null; ) {
              if (B = me, (B.flags & 2048) !== 0) try {
                switch (B.tag) {
                  case 0:
                  case 11:
                  case 15:
                    Es(9, B);
                }
              } catch (Ie) {
                Ze(B, B.return, Ie);
              }
              if (B === _) {
                me = null;
                break e;
              }
              var ce = B.sibling;
              if (ce !== null) {
                ce.return = B.return, me = ce;
                break e;
              }
              me = B.return;
            }
          }
          if (Ee = y, Vn(), Mt && typeof Mt.onPostCommitFiberRoot == "function") try {
            Mt.onPostCommitFiberRoot(sr, t);
          } catch {
          }
          d = !0;
        }
        return d;
      } finally {
        Ge = a, Dt.transition = n;
      }
    }
    return !1;
  }
  function Jf(t, n, a) {
    n = eo(a, n), n = hf(t, n, 1), t = Hn(t, n, 1), n = dt(), t !== null && (ir(t, 1, n), ht(t, n));
  }
  function Ze(t, n, a) {
    if (t.tag === 3) Jf(t, t, a);
    else for (; n !== null; ) {
      if (n.tag === 3) {
        Jf(n, t, a);
        break;
      } else if (n.tag === 1) {
        var d = n.stateNode;
        if (typeof n.type.getDerivedStateFromError == "function" || typeof d.componentDidCatch == "function" && (Xn === null || !Xn.has(d))) {
          t = eo(a, t), t = yf(n, t, 1), n = Hn(n, t, 1), t = dt(), n !== null && (ir(n, 1, t), ht(n, t));
          break;
        }
      }
      n = n.return;
    }
  }
  function jv(t, n, a) {
    var d = t.pingCache;
    d !== null && d.delete(n), n = dt(), t.pingedLanes |= t.suspendedLanes & a, et === t && (ot & a) === a && (Je === 4 || Je === 3 && (ot & 130023424) === ot && 500 > Xe() - gc ? yr(t, 0) : pc |= a), ht(t, n);
  }
  function qf(t, n) {
    n === 0 && ((t.mode & 1) === 0 ? n = 1 : (n = Er, Er <<= 1, (Er & 130023424) === 0 && (Er = 4194304)));
    var a = dt();
    t = yn(t, n), t !== null && (ir(t, n, a), ht(t, a));
  }
  function Mv(t) {
    var n = t.memoizedState, a = 0;
    n !== null && (a = n.retryLane), qf(t, a);
  }
  function Tv(t, n) {
    var a = 0;
    switch (t.tag) {
      case 13:
        var d = t.stateNode, y = t.memoizedState;
        y !== null && (a = y.retryLane);
        break;
      case 19:
        d = t.stateNode;
        break;
      default:
        throw Error(o(314));
    }
    d !== null && d.delete(n), qf(t, a);
  }
  var ep;
  ep = function(t, n, a) {
    if (t !== null) if (t.memoizedProps !== n.pendingProps || ft.current) gt = !0;
    else {
      if ((t.lanes & a) === 0 && (n.flags & 128) === 0) return gt = !1, wv(t, n, a);
      gt = (t.flags & 131072) !== 0;
    }
    else gt = !1, Ve && (n.flags & 1048576) !== 0 && Rd(n, ys, n.index);
    switch (n.lanes = 0, n.tag) {
      case 2:
        var d = n.type;
        Rs(t, n), t = n.pendingProps;
        var y = Kr(n, at.current);
        Jr(n, a), y = Ll(null, n, d, t, y, a);
        var v = Kl();
        return n.flags |= 1, typeof y == "object" && y !== null && typeof y.render == "function" && y.$$typeof === void 0 ? (n.tag = 1, n.memoizedState = null, n.updateQueue = null, pt(d) ? (v = !0, gs(n)) : v = !1, n.memoizedState = y.state !== null && y.state !== void 0 ? y.state : null, Pl(n), y.updater = Ms, n.stateNode = y, y._reactInternals = n, Jl(n, d, t, a), n = nc(null, n, d, !0, v, a)) : (n.tag = 0, Ve && v && kl(n), ut(null, n, y, a), n = n.child), n;
      case 16:
        d = n.elementType;
        e: {
          switch (Rs(t, n), t = n.pendingProps, y = d._init, d = y(d._payload), n.type = d, y = n.tag = Bv(d), t = Vt(d, t), y) {
            case 0:
              n = tc(null, n, d, t, a);
              break e;
            case 1:
              n = Af(null, n, d, t, a);
              break e;
            case 11:
              n = If(null, n, d, t, a);
              break e;
            case 14:
              n = Cf(null, n, d, Vt(d.type, t), a);
              break e;
          }
          throw Error(o(
            306,
            d,
            ""
          ));
        }
        return n;
      case 0:
        return d = n.type, y = n.pendingProps, y = n.elementType === d ? y : Vt(d, y), tc(t, n, d, y, a);
      case 1:
        return d = n.type, y = n.pendingProps, y = n.elementType === d ? y : Vt(d, y), Af(t, n, d, y, a);
      case 3:
        e: {
          if (Sf(n), t === null) throw Error(o(387));
          d = n.pendingProps, v = n.memoizedState, y = v.element, Od(t, n), bs(n, d, null, a);
          var _ = n.memoizedState;
          if (d = _.element, v.isDehydrated) if (v = { element: d, isDehydrated: !1, cache: _.cache, pendingSuspenseBoundaries: _.pendingSuspenseBoundaries, transitions: _.transitions }, n.updateQueue.baseState = v, n.memoizedState = v, n.flags & 256) {
            y = eo(Error(o(423)), n), n = kf(t, n, d, a, y);
            break e;
          } else if (d !== y) {
            y = eo(Error(o(424)), n), n = kf(t, n, d, a, y);
            break e;
          } else for (Nt = Fn(n.stateNode.containerInfo.firstChild), bt = n, Ve = !0, zt = null, a = zd(n, null, d, a), n.child = a; a; ) a.flags = a.flags & -3 | 4096, a = a.sibling;
          else {
            if (Ur(), d === y) {
              n = vn(t, n, a);
              break e;
            }
            ut(t, n, d, a);
          }
          n = n.child;
        }
        return n;
      case 5:
        return Xd(n), t === null && Tl(n), d = n.type, y = n.pendingProps, v = t !== null ? t.memoizedProps : null, _ = y.children, Cl(d, y) ? _ = null : v !== null && Cl(d, v) && (n.flags |= 32), _f(t, n), ut(t, n, _, a), n.child;
      case 6:
        return t === null && Tl(n), null;
      case 13:
        return jf(t, n, a);
      case 4:
        return zl(n, n.stateNode.containerInfo), d = n.pendingProps, t === null ? n.child = $r(n, null, d, a) : ut(t, n, d, a), n.child;
      case 11:
        return d = n.type, y = n.pendingProps, y = n.elementType === d ? y : Vt(d, y), If(t, n, d, y, a);
      case 7:
        return ut(t, n, n.pendingProps, a), n.child;
      case 8:
        return ut(t, n, n.pendingProps.children, a), n.child;
      case 12:
        return ut(t, n, n.pendingProps.children, a), n.child;
      case 10:
        e: {
          if (d = n.type._context, y = n.pendingProps, v = n.memoizedProps, _ = y.value, Fe(xs, d._currentValue), d._currentValue = _, v !== null) if (Pt(v.value, _)) {
            if (v.children === y.children && !ft.current) {
              n = vn(t, n, a);
              break e;
            }
          } else for (v = n.child, v !== null && (v.return = n); v !== null; ) {
            var B = v.dependencies;
            if (B !== null) {
              _ = v.child;
              for (var z = B.firstContext; z !== null; ) {
                if (z.context === d) {
                  if (v.tag === 1) {
                    z = wn(-1, a & -a), z.tag = 2;
                    var q = v.updateQueue;
                    if (q !== null) {
                      q = q.shared;
                      var se = q.pending;
                      se === null ? z.next = z : (z.next = se.next, se.next = z), q.pending = z;
                    }
                  }
                  v.lanes |= a, z = v.alternate, z !== null && (z.lanes |= a), Gl(
                    v.return,
                    a,
                    n
                  ), B.lanes |= a;
                  break;
                }
                z = z.next;
              }
            } else if (v.tag === 10) _ = v.type === n.type ? null : v.child;
            else if (v.tag === 18) {
              if (_ = v.return, _ === null) throw Error(o(341));
              _.lanes |= a, B = _.alternate, B !== null && (B.lanes |= a), Gl(_, a, n), _ = v.sibling;
            } else _ = v.child;
            if (_ !== null) _.return = v;
            else for (_ = v; _ !== null; ) {
              if (_ === n) {
                _ = null;
                break;
              }
              if (v = _.sibling, v !== null) {
                v.return = _.return, _ = v;
                break;
              }
              _ = _.return;
            }
            v = _;
          }
          ut(t, n, y.children, a), n = n.child;
        }
        return n;
      case 9:
        return y = n.type, d = n.pendingProps.children, Jr(n, a), y = Bt(y), d = d(y), n.flags |= 1, ut(t, n, d, a), n.child;
      case 14:
        return d = n.type, y = Vt(d, n.pendingProps), y = Vt(d.type, y), Cf(t, n, d, y, a);
      case 15:
        return bf(t, n, n.type, n.pendingProps, a);
      case 17:
        return d = n.type, y = n.pendingProps, y = n.elementType === d ? y : Vt(d, y), Rs(t, n), n.tag = 1, pt(d) ? (t = !0, gs(n)) : t = !1, Jr(n, a), gf(n, d, y), Jl(n, d, y, a), nc(null, n, d, !0, t, a);
      case 19:
        return Tf(t, n, a);
      case 22:
        return Nf(t, n, a);
    }
    throw Error(o(156, n.tag));
  };
  function tp(t, n) {
    return Xa(t, n);
  }
  function Rv(t, n, a, d) {
    this.tag = t, this.key = a, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = n, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = d, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function Gt(t, n, a, d) {
    return new Rv(t, n, a, d);
  }
  function Cc(t) {
    return t = t.prototype, !(!t || !t.isReactComponent);
  }
  function Bv(t) {
    if (typeof t == "function") return Cc(t) ? 1 : 0;
    if (t != null) {
      if (t = t.$$typeof, t === L) return 11;
      if (t === Y) return 14;
    }
    return 2;
  }
  function Yn(t, n) {
    var a = t.alternate;
    return a === null ? (a = Gt(t.tag, n, t.key, t.mode), a.elementType = t.elementType, a.type = t.type, a.stateNode = t.stateNode, a.alternate = t, t.alternate = a) : (a.pendingProps = n, a.type = t.type, a.flags = 0, a.subtreeFlags = 0, a.deletions = null), a.flags = t.flags & 14680064, a.childLanes = t.childLanes, a.lanes = t.lanes, a.child = t.child, a.memoizedProps = t.memoizedProps, a.memoizedState = t.memoizedState, a.updateQueue = t.updateQueue, n = t.dependencies, a.dependencies = n === null ? null : { lanes: n.lanes, firstContext: n.firstContext }, a.sibling = t.sibling, a.index = t.index, a.ref = t.ref, a;
  }
  function Ws(t, n, a, d, y, v) {
    var _ = 2;
    if (d = t, typeof t == "function") Cc(t) && (_ = 1);
    else if (typeof t == "string") _ = 5;
    else e: switch (t) {
      case j:
        return vr(a.children, y, v, n);
      case W:
        _ = 8, y |= 8;
        break;
      case D:
        return t = Gt(12, a, n, y | 2), t.elementType = D, t.lanes = v, t;
      case ee:
        return t = Gt(13, a, n, y), t.elementType = ee, t.lanes = v, t;
      case T:
        return t = Gt(19, a, n, y), t.elementType = T, t.lanes = v, t;
      case U:
        return Xs(a, y, v, n);
      default:
        if (typeof t == "object" && t !== null) switch (t.$$typeof) {
          case Z:
            _ = 10;
            break e;
          case H:
            _ = 9;
            break e;
          case L:
            _ = 11;
            break e;
          case Y:
            _ = 14;
            break e;
          case O:
            _ = 16, d = null;
            break e;
        }
        throw Error(o(130, t == null ? t : typeof t, ""));
    }
    return n = Gt(_, a, n, y), n.elementType = t, n.type = d, n.lanes = v, n;
  }
  function vr(t, n, a, d) {
    return t = Gt(7, t, d, n), t.lanes = a, t;
  }
  function Xs(t, n, a, d) {
    return t = Gt(22, t, d, n), t.elementType = U, t.lanes = a, t.stateNode = { isHidden: !1 }, t;
  }
  function bc(t, n, a) {
    return t = Gt(6, t, null, n), t.lanes = a, t;
  }
  function Nc(t, n, a) {
    return n = Gt(4, t.children !== null ? t.children : [], t.key, n), n.lanes = a, n.stateNode = { containerInfo: t.containerInfo, pendingChildren: null, implementation: t.implementation }, n;
  }
  function Ev(t, n, a, d, y) {
    this.tag = n, this.containerInfo = t, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = Ro(0), this.expirationTimes = Ro(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = Ro(0), this.identifierPrefix = d, this.onRecoverableError = y, this.mutableSourceEagerHydrationData = null;
  }
  function _c(t, n, a, d, y, v, _, B, z) {
    return t = new Ev(t, n, a, B, z), n === 1 ? (n = 1, v === !0 && (n |= 8)) : n = 0, v = Gt(3, null, null, n), t.current = v, v.stateNode = t, v.memoizedState = { element: d, isDehydrated: a, cache: null, transitions: null, pendingSuspenseBoundaries: null }, Pl(v), t;
  }
  function Dv(t, n, a) {
    var d = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: F, key: d == null ? null : "" + d, children: t, containerInfo: n, implementation: a };
  }
  function np(t) {
    if (!t) return zn;
    t = t._reactInternals;
    e: {
      if (Qt(t) !== t || t.tag !== 1) throw Error(o(170));
      var n = t;
      do {
        switch (n.tag) {
          case 3:
            n = n.stateNode.context;
            break e;
          case 1:
            if (pt(n.type)) {
              n = n.stateNode.__reactInternalMemoizedMergedChildContext;
              break e;
            }
        }
        n = n.return;
      } while (n !== null);
      throw Error(o(171));
    }
    if (t.tag === 1) {
      var a = t.type;
      if (pt(a)) return jd(t, a, n);
    }
    return n;
  }
  function rp(t, n, a, d, y, v, _, B, z) {
    return t = _c(a, d, !0, t, y, v, _, B, z), t.context = np(null), a = t.current, d = dt(), y = Kn(a), v = wn(d, y), v.callback = n ?? null, Hn(a, v, y), t.current.lanes = y, ir(t, y, d), ht(t, d), t;
  }
  function Ls(t, n, a, d) {
    var y = n.current, v = dt(), _ = Kn(y);
    return a = np(a), n.context === null ? n.context = a : n.pendingContext = a, n = wn(v, _), n.payload = { element: t }, d = d === void 0 ? null : d, d !== null && (n.callback = d), t = Hn(y, n, _), t !== null && (Wt(t, y, _, v), Cs(t, y, _)), _;
  }
  function Ks(t) {
    if (t = t.current, !t.child) return null;
    switch (t.child.tag) {
      case 5:
        return t.child.stateNode;
      default:
        return t.child.stateNode;
    }
  }
  function op(t, n) {
    if (t = t.memoizedState, t !== null && t.dehydrated !== null) {
      var a = t.retryLane;
      t.retryLane = a !== 0 && a < n ? a : n;
    }
  }
  function Ac(t, n) {
    op(t, n), (t = t.alternate) && op(t, n);
  }
  function Gv() {
    return null;
  }
  var ap = typeof reportError == "function" ? reportError : function(t) {
    console.error(t);
  };
  function Sc(t) {
    this._internalRoot = t;
  }
  Zs.prototype.render = Sc.prototype.render = function(t) {
    var n = this._internalRoot;
    if (n === null) throw Error(o(409));
    Ls(t, n, null, null);
  }, Zs.prototype.unmount = Sc.prototype.unmount = function() {
    var t = this._internalRoot;
    if (t !== null) {
      this._internalRoot = null;
      var n = t.containerInfo;
      hr(function() {
        Ls(null, t, null, null);
      }), n[pn] = null;
    }
  };
  function Zs(t) {
    this._internalRoot = t;
  }
  Zs.prototype.unstable_scheduleHydration = function(t) {
    if (t) {
      var n = Ou();
      t = { blockedOn: null, target: t, priority: n };
      for (var a = 0; a < En.length && n !== 0 && n < En[a].priority; a++) ;
      En.splice(a, 0, t), a === 0 && Xu(t);
    }
  };
  function kc(t) {
    return !(!t || t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11);
  }
  function Ys(t) {
    return !(!t || t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11 && (t.nodeType !== 8 || t.nodeValue !== " react-mount-point-unstable "));
  }
  function sp() {
  }
  function Fv(t, n, a, d, y) {
    if (y) {
      if (typeof d == "function") {
        var v = d;
        d = function() {
          var q = Ks(_);
          v.call(q);
        };
      }
      var _ = rp(n, d, t, 0, null, !1, !1, "", sp);
      return t._reactRootContainer = _, t[pn] = _.current, Ko(t.nodeType === 8 ? t.parentNode : t), hr(), _;
    }
    for (; y = t.lastChild; ) t.removeChild(y);
    if (typeof d == "function") {
      var B = d;
      d = function() {
        var q = Ks(z);
        B.call(q);
      };
    }
    var z = _c(t, 0, !1, null, null, !1, !1, "", sp);
    return t._reactRootContainer = z, t[pn] = z.current, Ko(t.nodeType === 8 ? t.parentNode : t), hr(function() {
      Ls(n, z, a, d);
    }), z;
  }
  function Us(t, n, a, d, y) {
    var v = a._reactRootContainer;
    if (v) {
      var _ = v;
      if (typeof y == "function") {
        var B = y;
        y = function() {
          var z = Ks(_);
          B.call(z);
        };
      }
      Ls(n, _, t, y);
    } else _ = Fv(a, n, t, y, d);
    return Ks(_);
  }
  zu = function(t) {
    switch (t.tag) {
      case 3:
        var n = t.stateNode;
        if (n.current.memoizedState.isDehydrated) {
          var a = Jt(n.pendingLanes);
          a !== 0 && (Ji(n, a | 1), ht(n, Xe()), (Ee & 6) === 0 && (ro = Xe() + 500, Vn()));
        }
        break;
      case 13:
        hr(function() {
          var d = yn(t, 1);
          if (d !== null) {
            var y = dt();
            Wt(d, t, 1, y);
          }
        }), Ac(t, 1);
    }
  }, qi = function(t) {
    if (t.tag === 13) {
      var n = yn(t, 134217728);
      if (n !== null) {
        var a = dt();
        Wt(n, t, 134217728, a);
      }
      Ac(t, 134217728);
    }
  }, Vu = function(t) {
    if (t.tag === 13) {
      var n = Kn(t), a = yn(t, n);
      if (a !== null) {
        var d = dt();
        Wt(a, t, n, d);
      }
      Ac(t, n);
    }
  }, Ou = function() {
    return Ge;
  }, Hu = function(t, n) {
    var a = Ge;
    try {
      return Ge = t, n();
    } finally {
      Ge = a;
    }
  }, No = function(t, n, a) {
    switch (n) {
      case "input":
        if (We(t, a), n = a.name, a.type === "radio" && n != null) {
          for (a = t; a.parentNode; ) a = a.parentNode;
          for (a = a.querySelectorAll("input[name=" + JSON.stringify("" + n) + '][type="radio"]'), n = 0; n < a.length; n++) {
            var d = a[n];
            if (d !== t && d.form === t.form) {
              var y = fs(d);
              if (!y) throw Error(o(90));
              Ce(d), We(d, y);
            }
          }
        }
        break;
      case "textarea":
        jr(t, a);
        break;
      case "select":
        n = a.value, n != null && jt(t, !!a.multiple, n, !1);
    }
  }, za = vc, Va = hr;
  var Pv = { usingClientEntryPoint: !1, Events: [Uo, Xr, fs, Fa, Pa, vc] }, ca = { findFiberByHostInstance: lr, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, zv = { bundleType: ca.bundleType, version: ca.version, rendererPackageName: ca.rendererPackageName, rendererConfig: ca.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: S.ReactCurrentDispatcher, findHostInstanceByFiber: function(t) {
    return t = Ha(t), t === null ? null : t.stateNode;
  }, findFiberByHostInstance: ca.findFiberByHostInstance || Gv, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var $s = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!$s.isDisabled && $s.supportsFiber) try {
      sr = $s.inject(zv), Mt = $s;
    } catch {
    }
  }
  return yt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Pv, yt.createPortal = function(t, n) {
    var a = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!kc(n)) throw Error(o(200));
    return Dv(t, n, null, a);
  }, yt.createRoot = function(t, n) {
    if (!kc(t)) throw Error(o(299));
    var a = !1, d = "", y = ap;
    return n != null && (n.unstable_strictMode === !0 && (a = !0), n.identifierPrefix !== void 0 && (d = n.identifierPrefix), n.onRecoverableError !== void 0 && (y = n.onRecoverableError)), n = _c(t, 1, !1, null, null, a, !1, d, y), t[pn] = n.current, Ko(t.nodeType === 8 ? t.parentNode : t), new Sc(n);
  }, yt.findDOMNode = function(t) {
    if (t == null) return null;
    if (t.nodeType === 1) return t;
    var n = t._reactInternals;
    if (n === void 0)
      throw typeof t.render == "function" ? Error(o(188)) : (t = Object.keys(t).join(","), Error(o(268, t)));
    return t = Ha(n), t = t === null ? null : t.stateNode, t;
  }, yt.flushSync = function(t) {
    return hr(t);
  }, yt.hydrate = function(t, n, a) {
    if (!Ys(n)) throw Error(o(200));
    return Us(null, t, n, !0, a);
  }, yt.hydrateRoot = function(t, n, a) {
    if (!kc(t)) throw Error(o(405));
    var d = a != null && a.hydratedSources || null, y = !1, v = "", _ = ap;
    if (a != null && (a.unstable_strictMode === !0 && (y = !0), a.identifierPrefix !== void 0 && (v = a.identifierPrefix), a.onRecoverableError !== void 0 && (_ = a.onRecoverableError)), n = rp(n, null, t, 1, a ?? null, y, !1, v, _), t[pn] = n.current, Ko(t), d) for (t = 0; t < d.length; t++) a = d[t], y = a._getVersion, y = y(a._source), n.mutableSourceEagerHydrationData == null ? n.mutableSourceEagerHydrationData = [a, y] : n.mutableSourceEagerHydrationData.push(
      a,
      y
    );
    return new Zs(n);
  }, yt.render = function(t, n, a) {
    if (!Ys(n)) throw Error(o(200));
    return Us(null, t, n, !1, a);
  }, yt.unmountComponentAtNode = function(t) {
    if (!Ys(t)) throw Error(o(40));
    return t._reactRootContainer ? (hr(function() {
      Us(null, null, t, !1, function() {
        t._reactRootContainer = null, t[pn] = null;
      });
    }), !0) : !1;
  }, yt.unstable_batchedUpdates = vc, yt.unstable_renderSubtreeIntoContainer = function(t, n, a, d) {
    if (!Ys(a)) throw Error(o(200));
    if (t == null || t._reactInternals === void 0) throw Error(o(38));
    return Us(t, n, a, !1, d);
  }, yt.version = "18.3.1-next-f1338f8080-20240426", yt;
}
var gp;
function Rg() {
  if (gp) return Tc.exports;
  gp = 1;
  function e() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(e);
      } catch (r) {
        console.error(r);
      }
  }
  return e(), Tc.exports = Yv(), Tc.exports;
}
var mp;
function Uv() {
  if (mp) return Qs;
  mp = 1;
  var e = Rg();
  return Qs.createRoot = e.createRoot, Qs.hydrateRoot = e.hydrateRoot, Qs;
}
var $v = Uv();
const Bg = /* @__PURE__ */ mu($v);
function $e(e) {
  if (typeof e == "string" || typeof e == "number") return "" + e;
  let r = "";
  if (Array.isArray(e))
    for (let o = 0, s; o < e.length; o++)
      (s = $e(e[o])) !== "" && (r += (r && " ") + s);
  else
    for (let o in e)
      e[o] && (r += (r && " ") + o);
  return r;
}
var Qv = { value: () => {
} };
function Ni() {
  for (var e = 0, r = arguments.length, o = {}, s; e < r; ++e) {
    if (!(s = arguments[e] + "") || s in o || /[\s.]/.test(s)) throw new Error("illegal type: " + s);
    o[s] = [];
  }
  return new li(o);
}
function li(e) {
  this._ = e;
}
function Jv(e, r) {
  return e.trim().split(/^|\s+/).map(function(o) {
    var s = "", i = o.indexOf(".");
    if (i >= 0 && (s = o.slice(i + 1), o = o.slice(0, i)), o && !r.hasOwnProperty(o)) throw new Error("unknown type: " + o);
    return { type: o, name: s };
  });
}
li.prototype = Ni.prototype = {
  constructor: li,
  on: function(e, r) {
    var o = this._, s = Jv(e + "", o), i, l = -1, c = s.length;
    if (arguments.length < 2) {
      for (; ++l < c; ) if ((i = (e = s[l]).type) && (i = qv(o[i], e.name))) return i;
      return;
    }
    if (r != null && typeof r != "function") throw new Error("invalid callback: " + r);
    for (; ++l < c; )
      if (i = (e = s[l]).type) o[i] = hp(o[i], e.name, r);
      else if (r == null) for (i in o) o[i] = hp(o[i], e.name, null);
    return this;
  },
  copy: function() {
    var e = {}, r = this._;
    for (var o in r) e[o] = r[o].slice();
    return new li(e);
  },
  call: function(e, r) {
    if ((i = arguments.length - 2) > 0) for (var o = new Array(i), s = 0, i, l; s < i; ++s) o[s] = arguments[s + 2];
    if (!this._.hasOwnProperty(e)) throw new Error("unknown type: " + e);
    for (l = this._[e], s = 0, i = l.length; s < i; ++s) l[s].value.apply(r, o);
  },
  apply: function(e, r, o) {
    if (!this._.hasOwnProperty(e)) throw new Error("unknown type: " + e);
    for (var s = this._[e], i = 0, l = s.length; i < l; ++i) s[i].value.apply(r, o);
  }
};
function qv(e, r) {
  for (var o = 0, s = e.length, i; o < s; ++o)
    if ((i = e[o]).name === r)
      return i.value;
}
function hp(e, r, o) {
  for (var s = 0, i = e.length; s < i; ++s)
    if (e[s].name === r) {
      e[s] = Qv, e = e.slice(0, s).concat(e.slice(s + 1));
      break;
    }
  return o != null && e.push({ name: r, value: o }), e;
}
var Jc = "http://www.w3.org/1999/xhtml";
const yp = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: Jc,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
function _i(e) {
  var r = e += "", o = r.indexOf(":");
  return o >= 0 && (r = e.slice(0, o)) !== "xmlns" && (e = e.slice(o + 1)), yp.hasOwnProperty(r) ? { space: yp[r], local: e } : e;
}
function ex(e) {
  return function() {
    var r = this.ownerDocument, o = this.namespaceURI;
    return o === Jc && r.documentElement.namespaceURI === Jc ? r.createElement(e) : r.createElementNS(o, e);
  };
}
function tx(e) {
  return function() {
    return this.ownerDocument.createElementNS(e.space, e.local);
  };
}
function Eg(e) {
  var r = _i(e);
  return (r.local ? tx : ex)(r);
}
function nx() {
}
function hu(e) {
  return e == null ? nx : function() {
    return this.querySelector(e);
  };
}
function rx(e) {
  typeof e != "function" && (e = hu(e));
  for (var r = this._groups, o = r.length, s = new Array(o), i = 0; i < o; ++i)
    for (var l = r[i], c = l.length, u = s[i] = new Array(c), p, g, m = 0; m < c; ++m)
      (p = l[m]) && (g = e.call(p, p.__data__, m, l)) && ("__data__" in p && (g.__data__ = p.__data__), u[m] = g);
  return new kt(s, this._parents);
}
function ox(e) {
  return e == null ? [] : Array.isArray(e) ? e : Array.from(e);
}
function ax() {
  return [];
}
function Dg(e) {
  return e == null ? ax : function() {
    return this.querySelectorAll(e);
  };
}
function sx(e) {
  return function() {
    return ox(e.apply(this, arguments));
  };
}
function ix(e) {
  typeof e == "function" ? e = sx(e) : e = Dg(e);
  for (var r = this._groups, o = r.length, s = [], i = [], l = 0; l < o; ++l)
    for (var c = r[l], u = c.length, p, g = 0; g < u; ++g)
      (p = c[g]) && (s.push(e.call(p, p.__data__, g, c)), i.push(p));
  return new kt(s, i);
}
function Gg(e) {
  return function() {
    return this.matches(e);
  };
}
function Fg(e) {
  return function(r) {
    return r.matches(e);
  };
}
var lx = Array.prototype.find;
function cx(e) {
  return function() {
    return lx.call(this.children, e);
  };
}
function ux() {
  return this.firstElementChild;
}
function dx(e) {
  return this.select(e == null ? ux : cx(typeof e == "function" ? e : Fg(e)));
}
var fx = Array.prototype.filter;
function px() {
  return Array.from(this.children);
}
function gx(e) {
  return function() {
    return fx.call(this.children, e);
  };
}
function mx(e) {
  return this.selectAll(e == null ? px : gx(typeof e == "function" ? e : Fg(e)));
}
function hx(e) {
  typeof e != "function" && (e = Gg(e));
  for (var r = this._groups, o = r.length, s = new Array(o), i = 0; i < o; ++i)
    for (var l = r[i], c = l.length, u = s[i] = [], p, g = 0; g < c; ++g)
      (p = l[g]) && e.call(p, p.__data__, g, l) && u.push(p);
  return new kt(s, this._parents);
}
function Pg(e) {
  return new Array(e.length);
}
function yx() {
  return new kt(this._enter || this._groups.map(Pg), this._parents);
}
function pi(e, r) {
  this.ownerDocument = e.ownerDocument, this.namespaceURI = e.namespaceURI, this._next = null, this._parent = e, this.__data__ = r;
}
pi.prototype = {
  constructor: pi,
  appendChild: function(e) {
    return this._parent.insertBefore(e, this._next);
  },
  insertBefore: function(e, r) {
    return this._parent.insertBefore(e, r);
  },
  querySelector: function(e) {
    return this._parent.querySelector(e);
  },
  querySelectorAll: function(e) {
    return this._parent.querySelectorAll(e);
  }
};
function wx(e) {
  return function() {
    return e;
  };
}
function vx(e, r, o, s, i, l) {
  for (var c = 0, u, p = r.length, g = l.length; c < g; ++c)
    (u = r[c]) ? (u.__data__ = l[c], s[c] = u) : o[c] = new pi(e, l[c]);
  for (; c < p; ++c)
    (u = r[c]) && (i[c] = u);
}
function xx(e, r, o, s, i, l, c) {
  var u, p, g = /* @__PURE__ */ new Map(), m = r.length, h = l.length, w = new Array(m), I;
  for (u = 0; u < m; ++u)
    (p = r[u]) && (w[u] = I = c.call(p, p.__data__, u, r) + "", g.has(I) ? i[u] = p : g.set(I, p));
  for (u = 0; u < h; ++u)
    I = c.call(e, l[u], u, l) + "", (p = g.get(I)) ? (s[u] = p, p.__data__ = l[u], g.delete(I)) : o[u] = new pi(e, l[u]);
  for (u = 0; u < m; ++u)
    (p = r[u]) && g.get(w[u]) === p && (i[u] = p);
}
function Ix(e) {
  return e.__data__;
}
function Cx(e, r) {
  if (!arguments.length) return Array.from(this, Ix);
  var o = r ? xx : vx, s = this._parents, i = this._groups;
  typeof e != "function" && (e = wx(e));
  for (var l = i.length, c = new Array(l), u = new Array(l), p = new Array(l), g = 0; g < l; ++g) {
    var m = s[g], h = i[g], w = h.length, I = bx(e.call(m, m && m.__data__, g, s)), x = I.length, C = u[g] = new Array(x), b = c[g] = new Array(x), N = p[g] = new Array(w);
    o(m, h, C, b, N, I, r);
    for (var k = 0, A = 0, S, P; k < x; ++k)
      if (S = C[k]) {
        for (k >= A && (A = k + 1); !(P = b[A]) && ++A < x; ) ;
        S._next = P || null;
      }
  }
  return c = new kt(c, s), c._enter = u, c._exit = p, c;
}
function bx(e) {
  return typeof e == "object" && "length" in e ? e : Array.from(e);
}
function Nx() {
  return new kt(this._exit || this._groups.map(Pg), this._parents);
}
function _x(e, r, o) {
  var s = this.enter(), i = this, l = this.exit();
  return typeof e == "function" ? (s = e(s), s && (s = s.selection())) : s = s.append(e + ""), r != null && (i = r(i), i && (i = i.selection())), o == null ? l.remove() : o(l), s && i ? s.merge(i).order() : i;
}
function Ax(e) {
  for (var r = e.selection ? e.selection() : e, o = this._groups, s = r._groups, i = o.length, l = s.length, c = Math.min(i, l), u = new Array(i), p = 0; p < c; ++p)
    for (var g = o[p], m = s[p], h = g.length, w = u[p] = new Array(h), I, x = 0; x < h; ++x)
      (I = g[x] || m[x]) && (w[x] = I);
  for (; p < i; ++p)
    u[p] = o[p];
  return new kt(u, this._parents);
}
function Sx() {
  for (var e = this._groups, r = -1, o = e.length; ++r < o; )
    for (var s = e[r], i = s.length - 1, l = s[i], c; --i >= 0; )
      (c = s[i]) && (l && c.compareDocumentPosition(l) ^ 4 && l.parentNode.insertBefore(c, l), l = c);
  return this;
}
function kx(e) {
  e || (e = jx);
  function r(h, w) {
    return h && w ? e(h.__data__, w.__data__) : !h - !w;
  }
  for (var o = this._groups, s = o.length, i = new Array(s), l = 0; l < s; ++l) {
    for (var c = o[l], u = c.length, p = i[l] = new Array(u), g, m = 0; m < u; ++m)
      (g = c[m]) && (p[m] = g);
    p.sort(r);
  }
  return new kt(i, this._parents).order();
}
function jx(e, r) {
  return e < r ? -1 : e > r ? 1 : e >= r ? 0 : NaN;
}
function Mx() {
  var e = arguments[0];
  return arguments[0] = this, e.apply(null, arguments), this;
}
function Tx() {
  return Array.from(this);
}
function Rx() {
  for (var e = this._groups, r = 0, o = e.length; r < o; ++r)
    for (var s = e[r], i = 0, l = s.length; i < l; ++i) {
      var c = s[i];
      if (c) return c;
    }
  return null;
}
function Bx() {
  let e = 0;
  for (const r of this) ++e;
  return e;
}
function Ex() {
  return !this.node();
}
function Dx(e) {
  for (var r = this._groups, o = 0, s = r.length; o < s; ++o)
    for (var i = r[o], l = 0, c = i.length, u; l < c; ++l)
      (u = i[l]) && e.call(u, u.__data__, l, i);
  return this;
}
function Gx(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function Fx(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function Px(e, r) {
  return function() {
    this.setAttribute(e, r);
  };
}
function zx(e, r) {
  return function() {
    this.setAttributeNS(e.space, e.local, r);
  };
}
function Vx(e, r) {
  return function() {
    var o = r.apply(this, arguments);
    o == null ? this.removeAttribute(e) : this.setAttribute(e, o);
  };
}
function Ox(e, r) {
  return function() {
    var o = r.apply(this, arguments);
    o == null ? this.removeAttributeNS(e.space, e.local) : this.setAttributeNS(e.space, e.local, o);
  };
}
function Hx(e, r) {
  var o = _i(e);
  if (arguments.length < 2) {
    var s = this.node();
    return o.local ? s.getAttributeNS(o.space, o.local) : s.getAttribute(o);
  }
  return this.each((r == null ? o.local ? Fx : Gx : typeof r == "function" ? o.local ? Ox : Vx : o.local ? zx : Px)(o, r));
}
function zg(e) {
  return e.ownerDocument && e.ownerDocument.defaultView || e.document && e || e.defaultView;
}
function Wx(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function Xx(e, r, o) {
  return function() {
    this.style.setProperty(e, r, o);
  };
}
function Lx(e, r, o) {
  return function() {
    var s = r.apply(this, arguments);
    s == null ? this.style.removeProperty(e) : this.style.setProperty(e, s, o);
  };
}
function Kx(e, r, o) {
  return arguments.length > 1 ? this.each((r == null ? Wx : typeof r == "function" ? Lx : Xx)(e, r, o ?? "")) : uo(this.node(), e);
}
function uo(e, r) {
  return e.style.getPropertyValue(r) || zg(e).getComputedStyle(e, null).getPropertyValue(r);
}
function Zx(e) {
  return function() {
    delete this[e];
  };
}
function Yx(e, r) {
  return function() {
    this[e] = r;
  };
}
function Ux(e, r) {
  return function() {
    var o = r.apply(this, arguments);
    o == null ? delete this[e] : this[e] = o;
  };
}
function $x(e, r) {
  return arguments.length > 1 ? this.each((r == null ? Zx : typeof r == "function" ? Ux : Yx)(e, r)) : this.node()[e];
}
function Vg(e) {
  return e.trim().split(/^|\s+/);
}
function yu(e) {
  return e.classList || new Og(e);
}
function Og(e) {
  this._node = e, this._names = Vg(e.getAttribute("class") || "");
}
Og.prototype = {
  add: function(e) {
    var r = this._names.indexOf(e);
    r < 0 && (this._names.push(e), this._node.setAttribute("class", this._names.join(" ")));
  },
  remove: function(e) {
    var r = this._names.indexOf(e);
    r >= 0 && (this._names.splice(r, 1), this._node.setAttribute("class", this._names.join(" ")));
  },
  contains: function(e) {
    return this._names.indexOf(e) >= 0;
  }
};
function Hg(e, r) {
  for (var o = yu(e), s = -1, i = r.length; ++s < i; ) o.add(r[s]);
}
function Wg(e, r) {
  for (var o = yu(e), s = -1, i = r.length; ++s < i; ) o.remove(r[s]);
}
function Qx(e) {
  return function() {
    Hg(this, e);
  };
}
function Jx(e) {
  return function() {
    Wg(this, e);
  };
}
function qx(e, r) {
  return function() {
    (r.apply(this, arguments) ? Hg : Wg)(this, e);
  };
}
function e1(e, r) {
  var o = Vg(e + "");
  if (arguments.length < 2) {
    for (var s = yu(this.node()), i = -1, l = o.length; ++i < l; ) if (!s.contains(o[i])) return !1;
    return !0;
  }
  return this.each((typeof r == "function" ? qx : r ? Qx : Jx)(o, r));
}
function t1() {
  this.textContent = "";
}
function n1(e) {
  return function() {
    this.textContent = e;
  };
}
function r1(e) {
  return function() {
    var r = e.apply(this, arguments);
    this.textContent = r ?? "";
  };
}
function o1(e) {
  return arguments.length ? this.each(e == null ? t1 : (typeof e == "function" ? r1 : n1)(e)) : this.node().textContent;
}
function a1() {
  this.innerHTML = "";
}
function s1(e) {
  return function() {
    this.innerHTML = e;
  };
}
function i1(e) {
  return function() {
    var r = e.apply(this, arguments);
    this.innerHTML = r ?? "";
  };
}
function l1(e) {
  return arguments.length ? this.each(e == null ? a1 : (typeof e == "function" ? i1 : s1)(e)) : this.node().innerHTML;
}
function c1() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function u1() {
  return this.each(c1);
}
function d1() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function f1() {
  return this.each(d1);
}
function p1(e) {
  var r = typeof e == "function" ? e : Eg(e);
  return this.select(function() {
    return this.appendChild(r.apply(this, arguments));
  });
}
function g1() {
  return null;
}
function m1(e, r) {
  var o = typeof e == "function" ? e : Eg(e), s = r == null ? g1 : typeof r == "function" ? r : hu(r);
  return this.select(function() {
    return this.insertBefore(o.apply(this, arguments), s.apply(this, arguments) || null);
  });
}
function h1() {
  var e = this.parentNode;
  e && e.removeChild(this);
}
function y1() {
  return this.each(h1);
}
function w1() {
  var e = this.cloneNode(!1), r = this.parentNode;
  return r ? r.insertBefore(e, this.nextSibling) : e;
}
function v1() {
  var e = this.cloneNode(!0), r = this.parentNode;
  return r ? r.insertBefore(e, this.nextSibling) : e;
}
function x1(e) {
  return this.select(e ? v1 : w1);
}
function I1(e) {
  return arguments.length ? this.property("__data__", e) : this.node().__data__;
}
function C1(e) {
  return function(r) {
    e.call(this, r, this.__data__);
  };
}
function b1(e) {
  return e.trim().split(/^|\s+/).map(function(r) {
    var o = "", s = r.indexOf(".");
    return s >= 0 && (o = r.slice(s + 1), r = r.slice(0, s)), { type: r, name: o };
  });
}
function N1(e) {
  return function() {
    var r = this.__on;
    if (r) {
      for (var o = 0, s = -1, i = r.length, l; o < i; ++o)
        l = r[o], (!e.type || l.type === e.type) && l.name === e.name ? this.removeEventListener(l.type, l.listener, l.options) : r[++s] = l;
      ++s ? r.length = s : delete this.__on;
    }
  };
}
function _1(e, r, o) {
  return function() {
    var s = this.__on, i, l = C1(r);
    if (s) {
      for (var c = 0, u = s.length; c < u; ++c)
        if ((i = s[c]).type === e.type && i.name === e.name) {
          this.removeEventListener(i.type, i.listener, i.options), this.addEventListener(i.type, i.listener = l, i.options = o), i.value = r;
          return;
        }
    }
    this.addEventListener(e.type, l, o), i = { type: e.type, name: e.name, value: r, listener: l, options: o }, s ? s.push(i) : this.__on = [i];
  };
}
function A1(e, r, o) {
  var s = b1(e + ""), i, l = s.length, c;
  if (arguments.length < 2) {
    var u = this.node().__on;
    if (u) {
      for (var p = 0, g = u.length, m; p < g; ++p)
        for (i = 0, m = u[p]; i < l; ++i)
          if ((c = s[i]).type === m.type && c.name === m.name)
            return m.value;
    }
    return;
  }
  for (u = r ? _1 : N1, i = 0; i < l; ++i) this.each(u(s[i], r, o));
  return this;
}
function Xg(e, r, o) {
  var s = zg(e), i = s.CustomEvent;
  typeof i == "function" ? i = new i(r, o) : (i = s.document.createEvent("Event"), o ? (i.initEvent(r, o.bubbles, o.cancelable), i.detail = o.detail) : i.initEvent(r, !1, !1)), e.dispatchEvent(i);
}
function S1(e, r) {
  return function() {
    return Xg(this, e, r);
  };
}
function k1(e, r) {
  return function() {
    return Xg(this, e, r.apply(this, arguments));
  };
}
function j1(e, r) {
  return this.each((typeof r == "function" ? k1 : S1)(e, r));
}
function* M1() {
  for (var e = this._groups, r = 0, o = e.length; r < o; ++r)
    for (var s = e[r], i = 0, l = s.length, c; i < l; ++i)
      (c = s[i]) && (yield c);
}
var Lg = [null];
function kt(e, r) {
  this._groups = e, this._parents = r;
}
function Sa() {
  return new kt([[document.documentElement]], Lg);
}
function T1() {
  return this;
}
kt.prototype = Sa.prototype = {
  constructor: kt,
  select: rx,
  selectAll: ix,
  selectChild: dx,
  selectChildren: mx,
  filter: hx,
  data: Cx,
  enter: yx,
  exit: Nx,
  join: _x,
  merge: Ax,
  selection: T1,
  order: Sx,
  sort: kx,
  call: Mx,
  nodes: Tx,
  node: Rx,
  size: Bx,
  empty: Ex,
  each: Dx,
  attr: Hx,
  style: Kx,
  property: $x,
  classed: e1,
  text: o1,
  html: l1,
  raise: u1,
  lower: f1,
  append: p1,
  insert: m1,
  remove: y1,
  clone: x1,
  datum: I1,
  on: A1,
  dispatch: j1,
  [Symbol.iterator]: M1
};
function St(e) {
  return typeof e == "string" ? new kt([[document.querySelector(e)]], [document.documentElement]) : new kt([[e]], Lg);
}
function R1(e) {
  let r;
  for (; r = e.sourceEvent; ) e = r;
  return e;
}
function Xt(e, r) {
  if (e = R1(e), r === void 0 && (r = e.currentTarget), r) {
    var o = r.ownerSVGElement || r;
    if (o.createSVGPoint) {
      var s = o.createSVGPoint();
      return s.x = e.clientX, s.y = e.clientY, s = s.matrixTransform(r.getScreenCTM().inverse()), [s.x, s.y];
    }
    if (r.getBoundingClientRect) {
      var i = r.getBoundingClientRect();
      return [e.clientX - i.left - r.clientLeft, e.clientY - i.top - r.clientTop];
    }
  }
  return [e.pageX, e.pageY];
}
const B1 = { passive: !1 }, ya = { capture: !0, passive: !1 };
function Ec(e) {
  e.stopImmediatePropagation();
}
function lo(e) {
  e.preventDefault(), e.stopImmediatePropagation();
}
function Kg(e) {
  var r = e.document.documentElement, o = St(e).on("dragstart.drag", lo, ya);
  "onselectstart" in r ? o.on("selectstart.drag", lo, ya) : (r.__noselect = r.style.MozUserSelect, r.style.MozUserSelect = "none");
}
function Zg(e, r) {
  var o = e.document.documentElement, s = St(e).on("dragstart.drag", null);
  r && (s.on("click.drag", lo, ya), setTimeout(function() {
    s.on("click.drag", null);
  }, 0)), "onselectstart" in o ? s.on("selectstart.drag", null) : (o.style.MozUserSelect = o.__noselect, delete o.__noselect);
}
const Js = (e) => () => e;
function qc(e, {
  sourceEvent: r,
  subject: o,
  target: s,
  identifier: i,
  active: l,
  x: c,
  y: u,
  dx: p,
  dy: g,
  dispatch: m
}) {
  Object.defineProperties(this, {
    type: { value: e, enumerable: !0, configurable: !0 },
    sourceEvent: { value: r, enumerable: !0, configurable: !0 },
    subject: { value: o, enumerable: !0, configurable: !0 },
    target: { value: s, enumerable: !0, configurable: !0 },
    identifier: { value: i, enumerable: !0, configurable: !0 },
    active: { value: l, enumerable: !0, configurable: !0 },
    x: { value: c, enumerable: !0, configurable: !0 },
    y: { value: u, enumerable: !0, configurable: !0 },
    dx: { value: p, enumerable: !0, configurable: !0 },
    dy: { value: g, enumerable: !0, configurable: !0 },
    _: { value: m }
  });
}
qc.prototype.on = function() {
  var e = this._.on.apply(this._, arguments);
  return e === this._ ? this : e;
};
function E1(e) {
  return !e.ctrlKey && !e.button;
}
function D1() {
  return this.parentNode;
}
function G1(e, r) {
  return r ?? { x: e.x, y: e.y };
}
function F1() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function Yg() {
  var e = E1, r = D1, o = G1, s = F1, i = {}, l = Ni("start", "drag", "end"), c = 0, u, p, g, m, h = 0;
  function w(S) {
    S.on("mousedown.drag", I).filter(s).on("touchstart.drag", b).on("touchmove.drag", N, B1).on("touchend.drag touchcancel.drag", k).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  function I(S, P) {
    if (!(m || !e.call(this, S, P))) {
      var F = A(this, r.call(this, S, P), S, P, "mouse");
      F && (St(S.view).on("mousemove.drag", x, ya).on("mouseup.drag", C, ya), Kg(S.view), Ec(S), g = !1, u = S.clientX, p = S.clientY, F("start", S));
    }
  }
  function x(S) {
    if (lo(S), !g) {
      var P = S.clientX - u, F = S.clientY - p;
      g = P * P + F * F > h;
    }
    i.mouse("drag", S);
  }
  function C(S) {
    St(S.view).on("mousemove.drag mouseup.drag", null), Zg(S.view, g), lo(S), i.mouse("end", S);
  }
  function b(S, P) {
    if (e.call(this, S, P)) {
      var F = S.changedTouches, j = r.call(this, S, P), W = F.length, D, Z;
      for (D = 0; D < W; ++D)
        (Z = A(this, j, S, P, F[D].identifier, F[D])) && (Ec(S), Z("start", S, F[D]));
    }
  }
  function N(S) {
    var P = S.changedTouches, F = P.length, j, W;
    for (j = 0; j < F; ++j)
      (W = i[P[j].identifier]) && (lo(S), W("drag", S, P[j]));
  }
  function k(S) {
    var P = S.changedTouches, F = P.length, j, W;
    for (m && clearTimeout(m), m = setTimeout(function() {
      m = null;
    }, 500), j = 0; j < F; ++j)
      (W = i[P[j].identifier]) && (Ec(S), W("end", S, P[j]));
  }
  function A(S, P, F, j, W, D) {
    var Z = l.copy(), H = Xt(D || F, P), L, ee, T;
    if ((T = o.call(S, new qc("beforestart", {
      sourceEvent: F,
      target: w,
      identifier: W,
      active: c,
      x: H[0],
      y: H[1],
      dx: 0,
      dy: 0,
      dispatch: Z
    }), j)) != null)
      return L = T.x - H[0] || 0, ee = T.y - H[1] || 0, function Y(O, U, E) {
        var G = H, K;
        switch (O) {
          case "start":
            i[W] = Y, K = c++;
            break;
          case "end":
            delete i[W], --c;
          // falls through
          case "drag":
            H = Xt(E || U, P), K = c;
            break;
        }
        Z.call(
          O,
          S,
          new qc(O, {
            sourceEvent: U,
            subject: T,
            target: w,
            identifier: W,
            active: K,
            x: H[0] + L,
            y: H[1] + ee,
            dx: H[0] - G[0],
            dy: H[1] - G[1],
            dispatch: Z
          }),
          j
        );
      };
  }
  return w.filter = function(S) {
    return arguments.length ? (e = typeof S == "function" ? S : Js(!!S), w) : e;
  }, w.container = function(S) {
    return arguments.length ? (r = typeof S == "function" ? S : Js(S), w) : r;
  }, w.subject = function(S) {
    return arguments.length ? (o = typeof S == "function" ? S : Js(S), w) : o;
  }, w.touchable = function(S) {
    return arguments.length ? (s = typeof S == "function" ? S : Js(!!S), w) : s;
  }, w.on = function() {
    var S = l.on.apply(l, arguments);
    return S === l ? w : S;
  }, w.clickDistance = function(S) {
    return arguments.length ? (h = (S = +S) * S, w) : Math.sqrt(h);
  }, w;
}
function wu(e, r, o) {
  e.prototype = r.prototype = o, o.constructor = e;
}
function Ug(e, r) {
  var o = Object.create(e.prototype);
  for (var s in r) o[s] = r[s];
  return o;
}
function ka() {
}
var wa = 0.7, gi = 1 / wa, co = "\\s*([+-]?\\d+)\\s*", va = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", an = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", P1 = /^#([0-9a-f]{3,8})$/, z1 = new RegExp(`^rgb\\(${co},${co},${co}\\)$`), V1 = new RegExp(`^rgb\\(${an},${an},${an}\\)$`), O1 = new RegExp(`^rgba\\(${co},${co},${co},${va}\\)$`), H1 = new RegExp(`^rgba\\(${an},${an},${an},${va}\\)$`), W1 = new RegExp(`^hsl\\(${va},${an},${an}\\)$`), X1 = new RegExp(`^hsla\\(${va},${an},${an},${va}\\)$`), wp = {
  aliceblue: 15792383,
  antiquewhite: 16444375,
  aqua: 65535,
  aquamarine: 8388564,
  azure: 15794175,
  beige: 16119260,
  bisque: 16770244,
  black: 0,
  blanchedalmond: 16772045,
  blue: 255,
  blueviolet: 9055202,
  brown: 10824234,
  burlywood: 14596231,
  cadetblue: 6266528,
  chartreuse: 8388352,
  chocolate: 13789470,
  coral: 16744272,
  cornflowerblue: 6591981,
  cornsilk: 16775388,
  crimson: 14423100,
  cyan: 65535,
  darkblue: 139,
  darkcyan: 35723,
  darkgoldenrod: 12092939,
  darkgray: 11119017,
  darkgreen: 25600,
  darkgrey: 11119017,
  darkkhaki: 12433259,
  darkmagenta: 9109643,
  darkolivegreen: 5597999,
  darkorange: 16747520,
  darkorchid: 10040012,
  darkred: 9109504,
  darksalmon: 15308410,
  darkseagreen: 9419919,
  darkslateblue: 4734347,
  darkslategray: 3100495,
  darkslategrey: 3100495,
  darkturquoise: 52945,
  darkviolet: 9699539,
  deeppink: 16716947,
  deepskyblue: 49151,
  dimgray: 6908265,
  dimgrey: 6908265,
  dodgerblue: 2003199,
  firebrick: 11674146,
  floralwhite: 16775920,
  forestgreen: 2263842,
  fuchsia: 16711935,
  gainsboro: 14474460,
  ghostwhite: 16316671,
  gold: 16766720,
  goldenrod: 14329120,
  gray: 8421504,
  green: 32768,
  greenyellow: 11403055,
  grey: 8421504,
  honeydew: 15794160,
  hotpink: 16738740,
  indianred: 13458524,
  indigo: 4915330,
  ivory: 16777200,
  khaki: 15787660,
  lavender: 15132410,
  lavenderblush: 16773365,
  lawngreen: 8190976,
  lemonchiffon: 16775885,
  lightblue: 11393254,
  lightcoral: 15761536,
  lightcyan: 14745599,
  lightgoldenrodyellow: 16448210,
  lightgray: 13882323,
  lightgreen: 9498256,
  lightgrey: 13882323,
  lightpink: 16758465,
  lightsalmon: 16752762,
  lightseagreen: 2142890,
  lightskyblue: 8900346,
  lightslategray: 7833753,
  lightslategrey: 7833753,
  lightsteelblue: 11584734,
  lightyellow: 16777184,
  lime: 65280,
  limegreen: 3329330,
  linen: 16445670,
  magenta: 16711935,
  maroon: 8388608,
  mediumaquamarine: 6737322,
  mediumblue: 205,
  mediumorchid: 12211667,
  mediumpurple: 9662683,
  mediumseagreen: 3978097,
  mediumslateblue: 8087790,
  mediumspringgreen: 64154,
  mediumturquoise: 4772300,
  mediumvioletred: 13047173,
  midnightblue: 1644912,
  mintcream: 16121850,
  mistyrose: 16770273,
  moccasin: 16770229,
  navajowhite: 16768685,
  navy: 128,
  oldlace: 16643558,
  olive: 8421376,
  olivedrab: 7048739,
  orange: 16753920,
  orangered: 16729344,
  orchid: 14315734,
  palegoldenrod: 15657130,
  palegreen: 10025880,
  paleturquoise: 11529966,
  palevioletred: 14381203,
  papayawhip: 16773077,
  peachpuff: 16767673,
  peru: 13468991,
  pink: 16761035,
  plum: 14524637,
  powderblue: 11591910,
  purple: 8388736,
  rebeccapurple: 6697881,
  red: 16711680,
  rosybrown: 12357519,
  royalblue: 4286945,
  saddlebrown: 9127187,
  salmon: 16416882,
  sandybrown: 16032864,
  seagreen: 3050327,
  seashell: 16774638,
  sienna: 10506797,
  silver: 12632256,
  skyblue: 8900331,
  slateblue: 6970061,
  slategray: 7372944,
  slategrey: 7372944,
  snow: 16775930,
  springgreen: 65407,
  steelblue: 4620980,
  tan: 13808780,
  teal: 32896,
  thistle: 14204888,
  tomato: 16737095,
  turquoise: 4251856,
  violet: 15631086,
  wheat: 16113331,
  white: 16777215,
  whitesmoke: 16119285,
  yellow: 16776960,
  yellowgreen: 10145074
};
wu(ka, _r, {
  copy(e) {
    return Object.assign(new this.constructor(), this, e);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: vp,
  // Deprecated! Use color.formatHex.
  formatHex: vp,
  formatHex8: L1,
  formatHsl: K1,
  formatRgb: xp,
  toString: xp
});
function vp() {
  return this.rgb().formatHex();
}
function L1() {
  return this.rgb().formatHex8();
}
function K1() {
  return $g(this).formatHsl();
}
function xp() {
  return this.rgb().formatRgb();
}
function _r(e) {
  var r, o;
  return e = (e + "").trim().toLowerCase(), (r = P1.exec(e)) ? (o = r[1].length, r = parseInt(r[1], 16), o === 6 ? Ip(r) : o === 3 ? new wt(r >> 8 & 15 | r >> 4 & 240, r >> 4 & 15 | r & 240, (r & 15) << 4 | r & 15, 1) : o === 8 ? qs(r >> 24 & 255, r >> 16 & 255, r >> 8 & 255, (r & 255) / 255) : o === 4 ? qs(r >> 12 & 15 | r >> 8 & 240, r >> 8 & 15 | r >> 4 & 240, r >> 4 & 15 | r & 240, ((r & 15) << 4 | r & 15) / 255) : null) : (r = z1.exec(e)) ? new wt(r[1], r[2], r[3], 1) : (r = V1.exec(e)) ? new wt(r[1] * 255 / 100, r[2] * 255 / 100, r[3] * 255 / 100, 1) : (r = O1.exec(e)) ? qs(r[1], r[2], r[3], r[4]) : (r = H1.exec(e)) ? qs(r[1] * 255 / 100, r[2] * 255 / 100, r[3] * 255 / 100, r[4]) : (r = W1.exec(e)) ? Np(r[1], r[2] / 100, r[3] / 100, 1) : (r = X1.exec(e)) ? Np(r[1], r[2] / 100, r[3] / 100, r[4]) : wp.hasOwnProperty(e) ? Ip(wp[e]) : e === "transparent" ? new wt(NaN, NaN, NaN, 0) : null;
}
function Ip(e) {
  return new wt(e >> 16 & 255, e >> 8 & 255, e & 255, 1);
}
function qs(e, r, o, s) {
  return s <= 0 && (e = r = o = NaN), new wt(e, r, o, s);
}
function Z1(e) {
  return e instanceof ka || (e = _r(e)), e ? (e = e.rgb(), new wt(e.r, e.g, e.b, e.opacity)) : new wt();
}
function eu(e, r, o, s) {
  return arguments.length === 1 ? Z1(e) : new wt(e, r, o, s ?? 1);
}
function wt(e, r, o, s) {
  this.r = +e, this.g = +r, this.b = +o, this.opacity = +s;
}
wu(wt, eu, Ug(ka, {
  brighter(e) {
    return e = e == null ? gi : Math.pow(gi, e), new wt(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? wa : Math.pow(wa, e), new wt(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new wt(br(this.r), br(this.g), br(this.b), mi(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: Cp,
  // Deprecated! Use color.formatHex.
  formatHex: Cp,
  formatHex8: Y1,
  formatRgb: bp,
  toString: bp
}));
function Cp() {
  return `#${Cr(this.r)}${Cr(this.g)}${Cr(this.b)}`;
}
function Y1() {
  return `#${Cr(this.r)}${Cr(this.g)}${Cr(this.b)}${Cr((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function bp() {
  const e = mi(this.opacity);
  return `${e === 1 ? "rgb(" : "rgba("}${br(this.r)}, ${br(this.g)}, ${br(this.b)}${e === 1 ? ")" : `, ${e})`}`;
}
function mi(e) {
  return isNaN(e) ? 1 : Math.max(0, Math.min(1, e));
}
function br(e) {
  return Math.max(0, Math.min(255, Math.round(e) || 0));
}
function Cr(e) {
  return e = br(e), (e < 16 ? "0" : "") + e.toString(16);
}
function Np(e, r, o, s) {
  return s <= 0 ? e = r = o = NaN : o <= 0 || o >= 1 ? e = r = NaN : r <= 0 && (e = NaN), new Lt(e, r, o, s);
}
function $g(e) {
  if (e instanceof Lt) return new Lt(e.h, e.s, e.l, e.opacity);
  if (e instanceof ka || (e = _r(e)), !e) return new Lt();
  if (e instanceof Lt) return e;
  e = e.rgb();
  var r = e.r / 255, o = e.g / 255, s = e.b / 255, i = Math.min(r, o, s), l = Math.max(r, o, s), c = NaN, u = l - i, p = (l + i) / 2;
  return u ? (r === l ? c = (o - s) / u + (o < s) * 6 : o === l ? c = (s - r) / u + 2 : c = (r - o) / u + 4, u /= p < 0.5 ? l + i : 2 - l - i, c *= 60) : u = p > 0 && p < 1 ? 0 : c, new Lt(c, u, p, e.opacity);
}
function U1(e, r, o, s) {
  return arguments.length === 1 ? $g(e) : new Lt(e, r, o, s ?? 1);
}
function Lt(e, r, o, s) {
  this.h = +e, this.s = +r, this.l = +o, this.opacity = +s;
}
wu(Lt, U1, Ug(ka, {
  brighter(e) {
    return e = e == null ? gi : Math.pow(gi, e), new Lt(this.h, this.s, this.l * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? wa : Math.pow(wa, e), new Lt(this.h, this.s, this.l * e, this.opacity);
  },
  rgb() {
    var e = this.h % 360 + (this.h < 0) * 360, r = isNaN(e) || isNaN(this.s) ? 0 : this.s, o = this.l, s = o + (o < 0.5 ? o : 1 - o) * r, i = 2 * o - s;
    return new wt(
      Dc(e >= 240 ? e - 240 : e + 120, i, s),
      Dc(e, i, s),
      Dc(e < 120 ? e + 240 : e - 120, i, s),
      this.opacity
    );
  },
  clamp() {
    return new Lt(_p(this.h), ei(this.s), ei(this.l), mi(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const e = mi(this.opacity);
    return `${e === 1 ? "hsl(" : "hsla("}${_p(this.h)}, ${ei(this.s) * 100}%, ${ei(this.l) * 100}%${e === 1 ? ")" : `, ${e})`}`;
  }
}));
function _p(e) {
  return e = (e || 0) % 360, e < 0 ? e + 360 : e;
}
function ei(e) {
  return Math.max(0, Math.min(1, e || 0));
}
function Dc(e, r, o) {
  return (e < 60 ? r + (o - r) * e / 60 : e < 180 ? o : e < 240 ? r + (o - r) * (240 - e) / 60 : r) * 255;
}
const vu = (e) => () => e;
function $1(e, r) {
  return function(o) {
    return e + o * r;
  };
}
function Q1(e, r, o) {
  return e = Math.pow(e, o), r = Math.pow(r, o) - e, o = 1 / o, function(s) {
    return Math.pow(e + s * r, o);
  };
}
function J1(e) {
  return (e = +e) == 1 ? Qg : function(r, o) {
    return o - r ? Q1(r, o, e) : vu(isNaN(r) ? o : r);
  };
}
function Qg(e, r) {
  var o = r - e;
  return o ? $1(e, o) : vu(isNaN(e) ? r : e);
}
const hi = (function e(r) {
  var o = J1(r);
  function s(i, l) {
    var c = o((i = eu(i)).r, (l = eu(l)).r), u = o(i.g, l.g), p = o(i.b, l.b), g = Qg(i.opacity, l.opacity);
    return function(m) {
      return i.r = c(m), i.g = u(m), i.b = p(m), i.opacity = g(m), i + "";
    };
  }
  return s.gamma = e, s;
})(1);
function q1(e, r) {
  r || (r = []);
  var o = e ? Math.min(r.length, e.length) : 0, s = r.slice(), i;
  return function(l) {
    for (i = 0; i < o; ++i) s[i] = e[i] * (1 - l) + r[i] * l;
    return s;
  };
}
function eI(e) {
  return ArrayBuffer.isView(e) && !(e instanceof DataView);
}
function tI(e, r) {
  var o = r ? r.length : 0, s = e ? Math.min(o, e.length) : 0, i = new Array(s), l = new Array(o), c;
  for (c = 0; c < s; ++c) i[c] = ma(e[c], r[c]);
  for (; c < o; ++c) l[c] = r[c];
  return function(u) {
    for (c = 0; c < s; ++c) l[c] = i[c](u);
    return l;
  };
}
function nI(e, r) {
  var o = /* @__PURE__ */ new Date();
  return e = +e, r = +r, function(s) {
    return o.setTime(e * (1 - s) + r * s), o;
  };
}
function rn(e, r) {
  return e = +e, r = +r, function(o) {
    return e * (1 - o) + r * o;
  };
}
function rI(e, r) {
  var o = {}, s = {}, i;
  (e === null || typeof e != "object") && (e = {}), (r === null || typeof r != "object") && (r = {});
  for (i in r)
    i in e ? o[i] = ma(e[i], r[i]) : s[i] = r[i];
  return function(l) {
    for (i in o) s[i] = o[i](l);
    return s;
  };
}
var tu = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, Gc = new RegExp(tu.source, "g");
function oI(e) {
  return function() {
    return e;
  };
}
function aI(e) {
  return function(r) {
    return e(r) + "";
  };
}
function Jg(e, r) {
  var o = tu.lastIndex = Gc.lastIndex = 0, s, i, l, c = -1, u = [], p = [];
  for (e = e + "", r = r + ""; (s = tu.exec(e)) && (i = Gc.exec(r)); )
    (l = i.index) > o && (l = r.slice(o, l), u[c] ? u[c] += l : u[++c] = l), (s = s[0]) === (i = i[0]) ? u[c] ? u[c] += i : u[++c] = i : (u[++c] = null, p.push({ i: c, x: rn(s, i) })), o = Gc.lastIndex;
  return o < r.length && (l = r.slice(o), u[c] ? u[c] += l : u[++c] = l), u.length < 2 ? p[0] ? aI(p[0].x) : oI(r) : (r = p.length, function(g) {
    for (var m = 0, h; m < r; ++m) u[(h = p[m]).i] = h.x(g);
    return u.join("");
  });
}
function ma(e, r) {
  var o = typeof r, s;
  return r == null || o === "boolean" ? vu(r) : (o === "number" ? rn : o === "string" ? (s = _r(r)) ? (r = s, hi) : Jg : r instanceof _r ? hi : r instanceof Date ? nI : eI(r) ? q1 : Array.isArray(r) ? tI : typeof r.valueOf != "function" && typeof r.toString != "function" || isNaN(r) ? rI : rn)(e, r);
}
var Ap = 180 / Math.PI, nu = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function qg(e, r, o, s, i, l) {
  var c, u, p;
  return (c = Math.sqrt(e * e + r * r)) && (e /= c, r /= c), (p = e * o + r * s) && (o -= e * p, s -= r * p), (u = Math.sqrt(o * o + s * s)) && (o /= u, s /= u, p /= u), e * s < r * o && (e = -e, r = -r, p = -p, c = -c), {
    translateX: i,
    translateY: l,
    rotate: Math.atan2(r, e) * Ap,
    skewX: Math.atan(p) * Ap,
    scaleX: c,
    scaleY: u
  };
}
var ti;
function sI(e) {
  const r = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(e + "");
  return r.isIdentity ? nu : qg(r.a, r.b, r.c, r.d, r.e, r.f);
}
function iI(e) {
  return e == null || (ti || (ti = document.createElementNS("http://www.w3.org/2000/svg", "g")), ti.setAttribute("transform", e), !(e = ti.transform.baseVal.consolidate())) ? nu : (e = e.matrix, qg(e.a, e.b, e.c, e.d, e.e, e.f));
}
function em(e, r, o, s) {
  function i(g) {
    return g.length ? g.pop() + " " : "";
  }
  function l(g, m, h, w, I, x) {
    if (g !== h || m !== w) {
      var C = I.push("translate(", null, r, null, o);
      x.push({ i: C - 4, x: rn(g, h) }, { i: C - 2, x: rn(m, w) });
    } else (h || w) && I.push("translate(" + h + r + w + o);
  }
  function c(g, m, h, w) {
    g !== m ? (g - m > 180 ? m += 360 : m - g > 180 && (g += 360), w.push({ i: h.push(i(h) + "rotate(", null, s) - 2, x: rn(g, m) })) : m && h.push(i(h) + "rotate(" + m + s);
  }
  function u(g, m, h, w) {
    g !== m ? w.push({ i: h.push(i(h) + "skewX(", null, s) - 2, x: rn(g, m) }) : m && h.push(i(h) + "skewX(" + m + s);
  }
  function p(g, m, h, w, I, x) {
    if (g !== h || m !== w) {
      var C = I.push(i(I) + "scale(", null, ",", null, ")");
      x.push({ i: C - 4, x: rn(g, h) }, { i: C - 2, x: rn(m, w) });
    } else (h !== 1 || w !== 1) && I.push(i(I) + "scale(" + h + "," + w + ")");
  }
  return function(g, m) {
    var h = [], w = [];
    return g = e(g), m = e(m), l(g.translateX, g.translateY, m.translateX, m.translateY, h, w), c(g.rotate, m.rotate, h, w), u(g.skewX, m.skewX, h, w), p(g.scaleX, g.scaleY, m.scaleX, m.scaleY, h, w), g = m = null, function(I) {
      for (var x = -1, C = w.length, b; ++x < C; ) h[(b = w[x]).i] = b.x(I);
      return h.join("");
    };
  };
}
var lI = em(sI, "px, ", "px)", "deg)"), cI = em(iI, ", ", ")", ")"), uI = 1e-12;
function Sp(e) {
  return ((e = Math.exp(e)) + 1 / e) / 2;
}
function dI(e) {
  return ((e = Math.exp(e)) - 1 / e) / 2;
}
function fI(e) {
  return ((e = Math.exp(2 * e)) - 1) / (e + 1);
}
const ci = (function e(r, o, s) {
  function i(l, c) {
    var u = l[0], p = l[1], g = l[2], m = c[0], h = c[1], w = c[2], I = m - u, x = h - p, C = I * I + x * x, b, N;
    if (C < uI)
      N = Math.log(w / g) / r, b = function(j) {
        return [
          u + j * I,
          p + j * x,
          g * Math.exp(r * j * N)
        ];
      };
    else {
      var k = Math.sqrt(C), A = (w * w - g * g + s * C) / (2 * g * o * k), S = (w * w - g * g - s * C) / (2 * w * o * k), P = Math.log(Math.sqrt(A * A + 1) - A), F = Math.log(Math.sqrt(S * S + 1) - S);
      N = (F - P) / r, b = function(j) {
        var W = j * N, D = Sp(P), Z = g / (o * k) * (D * fI(r * W + P) - dI(P));
        return [
          u + Z * I,
          p + Z * x,
          g * D / Sp(r * W + P)
        ];
      };
    }
    return b.duration = N * 1e3 * r / Math.SQRT2, b;
  }
  return i.rho = function(l) {
    var c = Math.max(1e-3, +l), u = c * c, p = u * u;
    return e(c, u, p);
  }, i;
})(Math.SQRT2, 2, 4);
var fo = 0, pa = 0, da = 0, tm = 1e3, yi, ga, wi = 0, Ar = 0, Ai = 0, xa = typeof performance == "object" && performance.now ? performance : Date, nm = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(e) {
  setTimeout(e, 17);
};
function xu() {
  return Ar || (nm(pI), Ar = xa.now() + Ai);
}
function pI() {
  Ar = 0;
}
function vi() {
  this._call = this._time = this._next = null;
}
vi.prototype = rm.prototype = {
  constructor: vi,
  restart: function(e, r, o) {
    if (typeof e != "function") throw new TypeError("callback is not a function");
    o = (o == null ? xu() : +o) + (r == null ? 0 : +r), !this._next && ga !== this && (ga ? ga._next = this : yi = this, ga = this), this._call = e, this._time = o, ru();
  },
  stop: function() {
    this._call && (this._call = null, this._time = 1 / 0, ru());
  }
};
function rm(e, r, o) {
  var s = new vi();
  return s.restart(e, r, o), s;
}
function gI() {
  xu(), ++fo;
  for (var e = yi, r; e; )
    (r = Ar - e._time) >= 0 && e._call.call(void 0, r), e = e._next;
  --fo;
}
function kp() {
  Ar = (wi = xa.now()) + Ai, fo = pa = 0;
  try {
    gI();
  } finally {
    fo = 0, hI(), Ar = 0;
  }
}
function mI() {
  var e = xa.now(), r = e - wi;
  r > tm && (Ai -= r, wi = e);
}
function hI() {
  for (var e, r = yi, o, s = 1 / 0; r; )
    r._call ? (s > r._time && (s = r._time), e = r, r = r._next) : (o = r._next, r._next = null, r = e ? e._next = o : yi = o);
  ga = e, ru(s);
}
function ru(e) {
  if (!fo) {
    pa && (pa = clearTimeout(pa));
    var r = e - Ar;
    r > 24 ? (e < 1 / 0 && (pa = setTimeout(kp, e - xa.now() - Ai)), da && (da = clearInterval(da))) : (da || (wi = xa.now(), da = setInterval(mI, tm)), fo = 1, nm(kp));
  }
}
function jp(e, r, o) {
  var s = new vi();
  return r = r == null ? 0 : +r, s.restart((i) => {
    s.stop(), e(i + r);
  }, r, o), s;
}
var yI = Ni("start", "end", "cancel", "interrupt"), wI = [], om = 0, Mp = 1, ou = 2, ui = 3, Tp = 4, au = 5, di = 6;
function Si(e, r, o, s, i, l) {
  var c = e.__transition;
  if (!c) e.__transition = {};
  else if (o in c) return;
  vI(e, o, {
    name: r,
    index: s,
    // For context during callback.
    group: i,
    // For context during callback.
    on: yI,
    tween: wI,
    time: l.time,
    delay: l.delay,
    duration: l.duration,
    ease: l.ease,
    timer: null,
    state: om
  });
}
function Iu(e, r) {
  var o = Ut(e, r);
  if (o.state > om) throw new Error("too late; already scheduled");
  return o;
}
function ln(e, r) {
  var o = Ut(e, r);
  if (o.state > ui) throw new Error("too late; already running");
  return o;
}
function Ut(e, r) {
  var o = e.__transition;
  if (!o || !(o = o[r])) throw new Error("transition not found");
  return o;
}
function vI(e, r, o) {
  var s = e.__transition, i;
  s[r] = o, o.timer = rm(l, 0, o.time);
  function l(g) {
    o.state = Mp, o.timer.restart(c, o.delay, o.time), o.delay <= g && c(g - o.delay);
  }
  function c(g) {
    var m, h, w, I;
    if (o.state !== Mp) return p();
    for (m in s)
      if (I = s[m], I.name === o.name) {
        if (I.state === ui) return jp(c);
        I.state === Tp ? (I.state = di, I.timer.stop(), I.on.call("interrupt", e, e.__data__, I.index, I.group), delete s[m]) : +m < r && (I.state = di, I.timer.stop(), I.on.call("cancel", e, e.__data__, I.index, I.group), delete s[m]);
      }
    if (jp(function() {
      o.state === ui && (o.state = Tp, o.timer.restart(u, o.delay, o.time), u(g));
    }), o.state = ou, o.on.call("start", e, e.__data__, o.index, o.group), o.state === ou) {
      for (o.state = ui, i = new Array(w = o.tween.length), m = 0, h = -1; m < w; ++m)
        (I = o.tween[m].value.call(e, e.__data__, o.index, o.group)) && (i[++h] = I);
      i.length = h + 1;
    }
  }
  function u(g) {
    for (var m = g < o.duration ? o.ease.call(null, g / o.duration) : (o.timer.restart(p), o.state = au, 1), h = -1, w = i.length; ++h < w; )
      i[h].call(e, m);
    o.state === au && (o.on.call("end", e, e.__data__, o.index, o.group), p());
  }
  function p() {
    o.state = di, o.timer.stop(), delete s[r];
    for (var g in s) return;
    delete e.__transition;
  }
}
function fi(e, r) {
  var o = e.__transition, s, i, l = !0, c;
  if (o) {
    r = r == null ? null : r + "";
    for (c in o) {
      if ((s = o[c]).name !== r) {
        l = !1;
        continue;
      }
      i = s.state > ou && s.state < au, s.state = di, s.timer.stop(), s.on.call(i ? "interrupt" : "cancel", e, e.__data__, s.index, s.group), delete o[c];
    }
    l && delete e.__transition;
  }
}
function xI(e) {
  return this.each(function() {
    fi(this, e);
  });
}
function II(e, r) {
  var o, s;
  return function() {
    var i = ln(this, e), l = i.tween;
    if (l !== o) {
      s = o = l;
      for (var c = 0, u = s.length; c < u; ++c)
        if (s[c].name === r) {
          s = s.slice(), s.splice(c, 1);
          break;
        }
    }
    i.tween = s;
  };
}
function CI(e, r, o) {
  var s, i;
  if (typeof o != "function") throw new Error();
  return function() {
    var l = ln(this, e), c = l.tween;
    if (c !== s) {
      i = (s = c).slice();
      for (var u = { name: r, value: o }, p = 0, g = i.length; p < g; ++p)
        if (i[p].name === r) {
          i[p] = u;
          break;
        }
      p === g && i.push(u);
    }
    l.tween = i;
  };
}
function bI(e, r) {
  var o = this._id;
  if (e += "", arguments.length < 2) {
    for (var s = Ut(this.node(), o).tween, i = 0, l = s.length, c; i < l; ++i)
      if ((c = s[i]).name === e)
        return c.value;
    return null;
  }
  return this.each((r == null ? II : CI)(o, e, r));
}
function Cu(e, r, o) {
  var s = e._id;
  return e.each(function() {
    var i = ln(this, s);
    (i.value || (i.value = {}))[r] = o.apply(this, arguments);
  }), function(i) {
    return Ut(i, s).value[r];
  };
}
function am(e, r) {
  var o;
  return (typeof r == "number" ? rn : r instanceof _r ? hi : (o = _r(r)) ? (r = o, hi) : Jg)(e, r);
}
function NI(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function _I(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function AI(e, r, o) {
  var s, i = o + "", l;
  return function() {
    var c = this.getAttribute(e);
    return c === i ? null : c === s ? l : l = r(s = c, o);
  };
}
function SI(e, r, o) {
  var s, i = o + "", l;
  return function() {
    var c = this.getAttributeNS(e.space, e.local);
    return c === i ? null : c === s ? l : l = r(s = c, o);
  };
}
function kI(e, r, o) {
  var s, i, l;
  return function() {
    var c, u = o(this), p;
    return u == null ? void this.removeAttribute(e) : (c = this.getAttribute(e), p = u + "", c === p ? null : c === s && p === i ? l : (i = p, l = r(s = c, u)));
  };
}
function jI(e, r, o) {
  var s, i, l;
  return function() {
    var c, u = o(this), p;
    return u == null ? void this.removeAttributeNS(e.space, e.local) : (c = this.getAttributeNS(e.space, e.local), p = u + "", c === p ? null : c === s && p === i ? l : (i = p, l = r(s = c, u)));
  };
}
function MI(e, r) {
  var o = _i(e), s = o === "transform" ? cI : am;
  return this.attrTween(e, typeof r == "function" ? (o.local ? jI : kI)(o, s, Cu(this, "attr." + e, r)) : r == null ? (o.local ? _I : NI)(o) : (o.local ? SI : AI)(o, s, r));
}
function TI(e, r) {
  return function(o) {
    this.setAttribute(e, r.call(this, o));
  };
}
function RI(e, r) {
  return function(o) {
    this.setAttributeNS(e.space, e.local, r.call(this, o));
  };
}
function BI(e, r) {
  var o, s;
  function i() {
    var l = r.apply(this, arguments);
    return l !== s && (o = (s = l) && RI(e, l)), o;
  }
  return i._value = r, i;
}
function EI(e, r) {
  var o, s;
  function i() {
    var l = r.apply(this, arguments);
    return l !== s && (o = (s = l) && TI(e, l)), o;
  }
  return i._value = r, i;
}
function DI(e, r) {
  var o = "attr." + e;
  if (arguments.length < 2) return (o = this.tween(o)) && o._value;
  if (r == null) return this.tween(o, null);
  if (typeof r != "function") throw new Error();
  var s = _i(e);
  return this.tween(o, (s.local ? BI : EI)(s, r));
}
function GI(e, r) {
  return function() {
    Iu(this, e).delay = +r.apply(this, arguments);
  };
}
function FI(e, r) {
  return r = +r, function() {
    Iu(this, e).delay = r;
  };
}
function PI(e) {
  var r = this._id;
  return arguments.length ? this.each((typeof e == "function" ? GI : FI)(r, e)) : Ut(this.node(), r).delay;
}
function zI(e, r) {
  return function() {
    ln(this, e).duration = +r.apply(this, arguments);
  };
}
function VI(e, r) {
  return r = +r, function() {
    ln(this, e).duration = r;
  };
}
function OI(e) {
  var r = this._id;
  return arguments.length ? this.each((typeof e == "function" ? zI : VI)(r, e)) : Ut(this.node(), r).duration;
}
function HI(e, r) {
  if (typeof r != "function") throw new Error();
  return function() {
    ln(this, e).ease = r;
  };
}
function WI(e) {
  var r = this._id;
  return arguments.length ? this.each(HI(r, e)) : Ut(this.node(), r).ease;
}
function XI(e, r) {
  return function() {
    var o = r.apply(this, arguments);
    if (typeof o != "function") throw new Error();
    ln(this, e).ease = o;
  };
}
function LI(e) {
  if (typeof e != "function") throw new Error();
  return this.each(XI(this._id, e));
}
function KI(e) {
  typeof e != "function" && (e = Gg(e));
  for (var r = this._groups, o = r.length, s = new Array(o), i = 0; i < o; ++i)
    for (var l = r[i], c = l.length, u = s[i] = [], p, g = 0; g < c; ++g)
      (p = l[g]) && e.call(p, p.__data__, g, l) && u.push(p);
  return new An(s, this._parents, this._name, this._id);
}
function ZI(e) {
  if (e._id !== this._id) throw new Error();
  for (var r = this._groups, o = e._groups, s = r.length, i = o.length, l = Math.min(s, i), c = new Array(s), u = 0; u < l; ++u)
    for (var p = r[u], g = o[u], m = p.length, h = c[u] = new Array(m), w, I = 0; I < m; ++I)
      (w = p[I] || g[I]) && (h[I] = w);
  for (; u < s; ++u)
    c[u] = r[u];
  return new An(c, this._parents, this._name, this._id);
}
function YI(e) {
  return (e + "").trim().split(/^|\s+/).every(function(r) {
    var o = r.indexOf(".");
    return o >= 0 && (r = r.slice(0, o)), !r || r === "start";
  });
}
function UI(e, r, o) {
  var s, i, l = YI(r) ? Iu : ln;
  return function() {
    var c = l(this, e), u = c.on;
    u !== s && (i = (s = u).copy()).on(r, o), c.on = i;
  };
}
function $I(e, r) {
  var o = this._id;
  return arguments.length < 2 ? Ut(this.node(), o).on.on(e) : this.each(UI(o, e, r));
}
function QI(e) {
  return function() {
    var r = this.parentNode;
    for (var o in this.__transition) if (+o !== e) return;
    r && r.removeChild(this);
  };
}
function JI() {
  return this.on("end.remove", QI(this._id));
}
function qI(e) {
  var r = this._name, o = this._id;
  typeof e != "function" && (e = hu(e));
  for (var s = this._groups, i = s.length, l = new Array(i), c = 0; c < i; ++c)
    for (var u = s[c], p = u.length, g = l[c] = new Array(p), m, h, w = 0; w < p; ++w)
      (m = u[w]) && (h = e.call(m, m.__data__, w, u)) && ("__data__" in m && (h.__data__ = m.__data__), g[w] = h, Si(g[w], r, o, w, g, Ut(m, o)));
  return new An(l, this._parents, r, o);
}
function eC(e) {
  var r = this._name, o = this._id;
  typeof e != "function" && (e = Dg(e));
  for (var s = this._groups, i = s.length, l = [], c = [], u = 0; u < i; ++u)
    for (var p = s[u], g = p.length, m, h = 0; h < g; ++h)
      if (m = p[h]) {
        for (var w = e.call(m, m.__data__, h, p), I, x = Ut(m, o), C = 0, b = w.length; C < b; ++C)
          (I = w[C]) && Si(I, r, o, C, w, x);
        l.push(w), c.push(m);
      }
  return new An(l, c, r, o);
}
var tC = Sa.prototype.constructor;
function nC() {
  return new tC(this._groups, this._parents);
}
function rC(e, r) {
  var o, s, i;
  return function() {
    var l = uo(this, e), c = (this.style.removeProperty(e), uo(this, e));
    return l === c ? null : l === o && c === s ? i : i = r(o = l, s = c);
  };
}
function sm(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function oC(e, r, o) {
  var s, i = o + "", l;
  return function() {
    var c = uo(this, e);
    return c === i ? null : c === s ? l : l = r(s = c, o);
  };
}
function aC(e, r, o) {
  var s, i, l;
  return function() {
    var c = uo(this, e), u = o(this), p = u + "";
    return u == null && (p = u = (this.style.removeProperty(e), uo(this, e))), c === p ? null : c === s && p === i ? l : (i = p, l = r(s = c, u));
  };
}
function sC(e, r) {
  var o, s, i, l = "style." + r, c = "end." + l, u;
  return function() {
    var p = ln(this, e), g = p.on, m = p.value[l] == null ? u || (u = sm(r)) : void 0;
    (g !== o || i !== m) && (s = (o = g).copy()).on(c, i = m), p.on = s;
  };
}
function iC(e, r, o) {
  var s = (e += "") == "transform" ? lI : am;
  return r == null ? this.styleTween(e, rC(e, s)).on("end.style." + e, sm(e)) : typeof r == "function" ? this.styleTween(e, aC(e, s, Cu(this, "style." + e, r))).each(sC(this._id, e)) : this.styleTween(e, oC(e, s, r), o).on("end.style." + e, null);
}
function lC(e, r, o) {
  return function(s) {
    this.style.setProperty(e, r.call(this, s), o);
  };
}
function cC(e, r, o) {
  var s, i;
  function l() {
    var c = r.apply(this, arguments);
    return c !== i && (s = (i = c) && lC(e, c, o)), s;
  }
  return l._value = r, l;
}
function uC(e, r, o) {
  var s = "style." + (e += "");
  if (arguments.length < 2) return (s = this.tween(s)) && s._value;
  if (r == null) return this.tween(s, null);
  if (typeof r != "function") throw new Error();
  return this.tween(s, cC(e, r, o ?? ""));
}
function dC(e) {
  return function() {
    this.textContent = e;
  };
}
function fC(e) {
  return function() {
    var r = e(this);
    this.textContent = r ?? "";
  };
}
function pC(e) {
  return this.tween("text", typeof e == "function" ? fC(Cu(this, "text", e)) : dC(e == null ? "" : e + ""));
}
function gC(e) {
  return function(r) {
    this.textContent = e.call(this, r);
  };
}
function mC(e) {
  var r, o;
  function s() {
    var i = e.apply(this, arguments);
    return i !== o && (r = (o = i) && gC(i)), r;
  }
  return s._value = e, s;
}
function hC(e) {
  var r = "text";
  if (arguments.length < 1) return (r = this.tween(r)) && r._value;
  if (e == null) return this.tween(r, null);
  if (typeof e != "function") throw new Error();
  return this.tween(r, mC(e));
}
function yC() {
  for (var e = this._name, r = this._id, o = im(), s = this._groups, i = s.length, l = 0; l < i; ++l)
    for (var c = s[l], u = c.length, p, g = 0; g < u; ++g)
      if (p = c[g]) {
        var m = Ut(p, r);
        Si(p, e, o, g, c, {
          time: m.time + m.delay + m.duration,
          delay: 0,
          duration: m.duration,
          ease: m.ease
        });
      }
  return new An(s, this._parents, e, o);
}
function wC() {
  var e, r, o = this, s = o._id, i = o.size();
  return new Promise(function(l, c) {
    var u = { value: c }, p = { value: function() {
      --i === 0 && l();
    } };
    o.each(function() {
      var g = ln(this, s), m = g.on;
      m !== e && (r = (e = m).copy(), r._.cancel.push(u), r._.interrupt.push(u), r._.end.push(p)), g.on = r;
    }), i === 0 && l();
  });
}
var vC = 0;
function An(e, r, o, s) {
  this._groups = e, this._parents = r, this._name = o, this._id = s;
}
function im() {
  return ++vC;
}
var In = Sa.prototype;
An.prototype = {
  constructor: An,
  select: qI,
  selectAll: eC,
  selectChild: In.selectChild,
  selectChildren: In.selectChildren,
  filter: KI,
  merge: ZI,
  selection: nC,
  transition: yC,
  call: In.call,
  nodes: In.nodes,
  node: In.node,
  size: In.size,
  empty: In.empty,
  each: In.each,
  on: $I,
  attr: MI,
  attrTween: DI,
  style: iC,
  styleTween: uC,
  text: pC,
  textTween: hC,
  remove: JI,
  tween: bI,
  delay: PI,
  duration: OI,
  ease: WI,
  easeVarying: LI,
  end: wC,
  [Symbol.iterator]: In[Symbol.iterator]
};
function xC(e) {
  return ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2;
}
var IC = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: xC
};
function CC(e, r) {
  for (var o; !(o = e.__transition) || !(o = o[r]); )
    if (!(e = e.parentNode))
      throw new Error(`transition ${r} not found`);
  return o;
}
function bC(e) {
  var r, o;
  e instanceof An ? (r = e._id, e = e._name) : (r = im(), (o = IC).time = xu(), e = e == null ? null : e + "");
  for (var s = this._groups, i = s.length, l = 0; l < i; ++l)
    for (var c = s[l], u = c.length, p, g = 0; g < u; ++g)
      (p = c[g]) && Si(p, e, r, g, c, o || CC(p, r));
  return new An(s, this._parents, e, r);
}
Sa.prototype.interrupt = xI;
Sa.prototype.transition = bC;
const ni = (e) => () => e;
function NC(e, {
  sourceEvent: r,
  target: o,
  transform: s,
  dispatch: i
}) {
  Object.defineProperties(this, {
    type: { value: e, enumerable: !0, configurable: !0 },
    sourceEvent: { value: r, enumerable: !0, configurable: !0 },
    target: { value: o, enumerable: !0, configurable: !0 },
    transform: { value: s, enumerable: !0, configurable: !0 },
    _: { value: i }
  });
}
function Nn(e, r, o) {
  this.k = e, this.x = r, this.y = o;
}
Nn.prototype = {
  constructor: Nn,
  scale: function(e) {
    return e === 1 ? this : new Nn(this.k * e, this.x, this.y);
  },
  translate: function(e, r) {
    return e === 0 & r === 0 ? this : new Nn(this.k, this.x + this.k * e, this.y + this.k * r);
  },
  apply: function(e) {
    return [e[0] * this.k + this.x, e[1] * this.k + this.y];
  },
  applyX: function(e) {
    return e * this.k + this.x;
  },
  applyY: function(e) {
    return e * this.k + this.y;
  },
  invert: function(e) {
    return [(e[0] - this.x) / this.k, (e[1] - this.y) / this.k];
  },
  invertX: function(e) {
    return (e - this.x) / this.k;
  },
  invertY: function(e) {
    return (e - this.y) / this.k;
  },
  rescaleX: function(e) {
    return e.copy().domain(e.range().map(this.invertX, this).map(e.invert, e));
  },
  rescaleY: function(e) {
    return e.copy().domain(e.range().map(this.invertY, this).map(e.invert, e));
  },
  toString: function() {
    return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
  }
};
var ki = new Nn(1, 0, 0);
lm.prototype = Nn.prototype;
function lm(e) {
  for (; !e.__zoom; ) if (!(e = e.parentNode)) return ki;
  return e.__zoom;
}
function Fc(e) {
  e.stopImmediatePropagation();
}
function fa(e) {
  e.preventDefault(), e.stopImmediatePropagation();
}
function _C(e) {
  return (!e.ctrlKey || e.type === "wheel") && !e.button;
}
function AC() {
  var e = this;
  return e instanceof SVGElement ? (e = e.ownerSVGElement || e, e.hasAttribute("viewBox") ? (e = e.viewBox.baseVal, [[e.x, e.y], [e.x + e.width, e.y + e.height]]) : [[0, 0], [e.width.baseVal.value, e.height.baseVal.value]]) : [[0, 0], [e.clientWidth, e.clientHeight]];
}
function Rp() {
  return this.__zoom || ki;
}
function SC(e) {
  return -e.deltaY * (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 2e-3) * (e.ctrlKey ? 10 : 1);
}
function kC() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function jC(e, r, o) {
  var s = e.invertX(r[0][0]) - o[0][0], i = e.invertX(r[1][0]) - o[1][0], l = e.invertY(r[0][1]) - o[0][1], c = e.invertY(r[1][1]) - o[1][1];
  return e.translate(
    i > s ? (s + i) / 2 : Math.min(0, s) || Math.max(0, i),
    c > l ? (l + c) / 2 : Math.min(0, l) || Math.max(0, c)
  );
}
function cm() {
  var e = _C, r = AC, o = jC, s = SC, i = kC, l = [0, 1 / 0], c = [[-1 / 0, -1 / 0], [1 / 0, 1 / 0]], u = 250, p = ci, g = Ni("start", "zoom", "end"), m, h, w, I = 500, x = 150, C = 0, b = 10;
  function N(T) {
    T.property("__zoom", Rp).on("wheel.zoom", W, { passive: !1 }).on("mousedown.zoom", D).on("dblclick.zoom", Z).filter(i).on("touchstart.zoom", H).on("touchmove.zoom", L).on("touchend.zoom touchcancel.zoom", ee).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  N.transform = function(T, Y, O, U) {
    var E = T.selection ? T.selection() : T;
    E.property("__zoom", Rp), T !== E ? P(T, Y, O, U) : E.interrupt().each(function() {
      F(this, arguments).event(U).start().zoom(null, typeof Y == "function" ? Y.apply(this, arguments) : Y).end();
    });
  }, N.scaleBy = function(T, Y, O, U) {
    N.scaleTo(T, function() {
      var E = this.__zoom.k, G = typeof Y == "function" ? Y.apply(this, arguments) : Y;
      return E * G;
    }, O, U);
  }, N.scaleTo = function(T, Y, O, U) {
    N.transform(T, function() {
      var E = r.apply(this, arguments), G = this.__zoom, K = O == null ? S(E) : typeof O == "function" ? O.apply(this, arguments) : O, M = G.invert(K), V = typeof Y == "function" ? Y.apply(this, arguments) : Y;
      return o(A(k(G, V), K, M), E, c);
    }, O, U);
  }, N.translateBy = function(T, Y, O, U) {
    N.transform(T, function() {
      return o(this.__zoom.translate(
        typeof Y == "function" ? Y.apply(this, arguments) : Y,
        typeof O == "function" ? O.apply(this, arguments) : O
      ), r.apply(this, arguments), c);
    }, null, U);
  }, N.translateTo = function(T, Y, O, U, E) {
    N.transform(T, function() {
      var G = r.apply(this, arguments), K = this.__zoom, M = U == null ? S(G) : typeof U == "function" ? U.apply(this, arguments) : U;
      return o(ki.translate(M[0], M[1]).scale(K.k).translate(
        typeof Y == "function" ? -Y.apply(this, arguments) : -Y,
        typeof O == "function" ? -O.apply(this, arguments) : -O
      ), G, c);
    }, U, E);
  };
  function k(T, Y) {
    return Y = Math.max(l[0], Math.min(l[1], Y)), Y === T.k ? T : new Nn(Y, T.x, T.y);
  }
  function A(T, Y, O) {
    var U = Y[0] - O[0] * T.k, E = Y[1] - O[1] * T.k;
    return U === T.x && E === T.y ? T : new Nn(T.k, U, E);
  }
  function S(T) {
    return [(+T[0][0] + +T[1][0]) / 2, (+T[0][1] + +T[1][1]) / 2];
  }
  function P(T, Y, O, U) {
    T.on("start.zoom", function() {
      F(this, arguments).event(U).start();
    }).on("interrupt.zoom end.zoom", function() {
      F(this, arguments).event(U).end();
    }).tween("zoom", function() {
      var E = this, G = arguments, K = F(E, G).event(U), M = r.apply(E, G), V = O == null ? S(M) : typeof O == "function" ? O.apply(E, G) : O, te = Math.max(M[1][0] - M[0][0], M[1][1] - M[0][1]), re = E.__zoom, le = typeof Y == "function" ? Y.apply(E, G) : Y, ue = p(re.invert(V).concat(te / re.k), le.invert(V).concat(te / le.k));
      return function(de) {
        if (de === 1) de = le;
        else {
          var ne = ue(de), fe = te / ne[2];
          de = new Nn(fe, V[0] - ne[0] * fe, V[1] - ne[1] * fe);
        }
        K.zoom(null, de);
      };
    });
  }
  function F(T, Y, O) {
    return !O && T.__zooming || new j(T, Y);
  }
  function j(T, Y) {
    this.that = T, this.args = Y, this.active = 0, this.sourceEvent = null, this.extent = r.apply(T, Y), this.taps = 0;
  }
  j.prototype = {
    event: function(T) {
      return T && (this.sourceEvent = T), this;
    },
    start: function() {
      return ++this.active === 1 && (this.that.__zooming = this, this.emit("start")), this;
    },
    zoom: function(T, Y) {
      return this.mouse && T !== "mouse" && (this.mouse[1] = Y.invert(this.mouse[0])), this.touch0 && T !== "touch" && (this.touch0[1] = Y.invert(this.touch0[0])), this.touch1 && T !== "touch" && (this.touch1[1] = Y.invert(this.touch1[0])), this.that.__zoom = Y, this.emit("zoom"), this;
    },
    end: function() {
      return --this.active === 0 && (delete this.that.__zooming, this.emit("end")), this;
    },
    emit: function(T) {
      var Y = St(this.that).datum();
      g.call(
        T,
        this.that,
        new NC(T, {
          sourceEvent: this.sourceEvent,
          target: N,
          transform: this.that.__zoom,
          dispatch: g
        }),
        Y
      );
    }
  };
  function W(T, ...Y) {
    if (!e.apply(this, arguments)) return;
    var O = F(this, Y).event(T), U = this.__zoom, E = Math.max(l[0], Math.min(l[1], U.k * Math.pow(2, s.apply(this, arguments)))), G = Xt(T);
    if (O.wheel)
      (O.mouse[0][0] !== G[0] || O.mouse[0][1] !== G[1]) && (O.mouse[1] = U.invert(O.mouse[0] = G)), clearTimeout(O.wheel);
    else {
      if (U.k === E) return;
      O.mouse = [G, U.invert(G)], fi(this), O.start();
    }
    fa(T), O.wheel = setTimeout(K, x), O.zoom("mouse", o(A(k(U, E), O.mouse[0], O.mouse[1]), O.extent, c));
    function K() {
      O.wheel = null, O.end();
    }
  }
  function D(T, ...Y) {
    if (w || !e.apply(this, arguments)) return;
    var O = T.currentTarget, U = F(this, Y, !0).event(T), E = St(T.view).on("mousemove.zoom", V, !0).on("mouseup.zoom", te, !0), G = Xt(T, O), K = T.clientX, M = T.clientY;
    Kg(T.view), Fc(T), U.mouse = [G, this.__zoom.invert(G)], fi(this), U.start();
    function V(re) {
      if (fa(re), !U.moved) {
        var le = re.clientX - K, ue = re.clientY - M;
        U.moved = le * le + ue * ue > C;
      }
      U.event(re).zoom("mouse", o(A(U.that.__zoom, U.mouse[0] = Xt(re, O), U.mouse[1]), U.extent, c));
    }
    function te(re) {
      E.on("mousemove.zoom mouseup.zoom", null), Zg(re.view, U.moved), fa(re), U.event(re).end();
    }
  }
  function Z(T, ...Y) {
    if (e.apply(this, arguments)) {
      var O = this.__zoom, U = Xt(T.changedTouches ? T.changedTouches[0] : T, this), E = O.invert(U), G = O.k * (T.shiftKey ? 0.5 : 2), K = o(A(k(O, G), U, E), r.apply(this, Y), c);
      fa(T), u > 0 ? St(this).transition().duration(u).call(P, K, U, T) : St(this).call(N.transform, K, U, T);
    }
  }
  function H(T, ...Y) {
    if (e.apply(this, arguments)) {
      var O = T.touches, U = O.length, E = F(this, Y, T.changedTouches.length === U).event(T), G, K, M, V;
      for (Fc(T), K = 0; K < U; ++K)
        M = O[K], V = Xt(M, this), V = [V, this.__zoom.invert(V), M.identifier], E.touch0 ? !E.touch1 && E.touch0[2] !== V[2] && (E.touch1 = V, E.taps = 0) : (E.touch0 = V, G = !0, E.taps = 1 + !!m);
      m && (m = clearTimeout(m)), G && (E.taps < 2 && (h = V[0], m = setTimeout(function() {
        m = null;
      }, I)), fi(this), E.start());
    }
  }
  function L(T, ...Y) {
    if (this.__zooming) {
      var O = F(this, Y).event(T), U = T.changedTouches, E = U.length, G, K, M, V;
      for (fa(T), G = 0; G < E; ++G)
        K = U[G], M = Xt(K, this), O.touch0 && O.touch0[2] === K.identifier ? O.touch0[0] = M : O.touch1 && O.touch1[2] === K.identifier && (O.touch1[0] = M);
      if (K = O.that.__zoom, O.touch1) {
        var te = O.touch0[0], re = O.touch0[1], le = O.touch1[0], ue = O.touch1[1], de = (de = le[0] - te[0]) * de + (de = le[1] - te[1]) * de, ne = (ne = ue[0] - re[0]) * ne + (ne = ue[1] - re[1]) * ne;
        K = k(K, Math.sqrt(de / ne)), M = [(te[0] + le[0]) / 2, (te[1] + le[1]) / 2], V = [(re[0] + ue[0]) / 2, (re[1] + ue[1]) / 2];
      } else if (O.touch0) M = O.touch0[0], V = O.touch0[1];
      else return;
      O.zoom("touch", o(A(K, M, V), O.extent, c));
    }
  }
  function ee(T, ...Y) {
    if (this.__zooming) {
      var O = F(this, Y).event(T), U = T.changedTouches, E = U.length, G, K;
      for (Fc(T), w && clearTimeout(w), w = setTimeout(function() {
        w = null;
      }, I), G = 0; G < E; ++G)
        K = U[G], O.touch0 && O.touch0[2] === K.identifier ? delete O.touch0 : O.touch1 && O.touch1[2] === K.identifier && delete O.touch1;
      if (O.touch1 && !O.touch0 && (O.touch0 = O.touch1, delete O.touch1), O.touch0) O.touch0[1] = this.__zoom.invert(O.touch0[0]);
      else if (O.end(), O.taps === 2 && (K = Xt(K, this), Math.hypot(h[0] - K[0], h[1] - K[1]) < b)) {
        var M = St(this).on("dblclick.zoom");
        M && M.apply(this, arguments);
      }
    }
  }
  return N.wheelDelta = function(T) {
    return arguments.length ? (s = typeof T == "function" ? T : ni(+T), N) : s;
  }, N.filter = function(T) {
    return arguments.length ? (e = typeof T == "function" ? T : ni(!!T), N) : e;
  }, N.touchable = function(T) {
    return arguments.length ? (i = typeof T == "function" ? T : ni(!!T), N) : i;
  }, N.extent = function(T) {
    return arguments.length ? (r = typeof T == "function" ? T : ni([[+T[0][0], +T[0][1]], [+T[1][0], +T[1][1]]]), N) : r;
  }, N.scaleExtent = function(T) {
    return arguments.length ? (l[0] = +T[0], l[1] = +T[1], N) : [l[0], l[1]];
  }, N.translateExtent = function(T) {
    return arguments.length ? (c[0][0] = +T[0][0], c[1][0] = +T[1][0], c[0][1] = +T[0][1], c[1][1] = +T[1][1], N) : [[c[0][0], c[0][1]], [c[1][0], c[1][1]]];
  }, N.constrain = function(T) {
    return arguments.length ? (o = T, N) : o;
  }, N.duration = function(T) {
    return arguments.length ? (u = +T, N) : u;
  }, N.interpolate = function(T) {
    return arguments.length ? (p = T, N) : p;
  }, N.on = function() {
    var T = g.on.apply(g, arguments);
    return T === g ? N : T;
  }, N.clickDistance = function(T) {
    return arguments.length ? (C = (T = +T) * T, N) : Math.sqrt(C);
  }, N.tapDistance = function(T) {
    return arguments.length ? (b = +T, N) : b;
  }, N;
}
const sn = {
  error001: () => "[React Flow]: Seems like you have not used zustand provider as an ancestor. Help: https://reactflow.dev/error#001",
  error002: () => "It looks like you've created a new nodeTypes or edgeTypes object. If this wasn't on purpose please define the nodeTypes/edgeTypes outside of the component or memoize them.",
  error003: (e) => `Node type "${e}" not found. Using fallback type "default".`,
  error004: () => "The React Flow parent container needs a width and a height to render the graph.",
  error005: () => "Only child nodes can use a parent extent.",
  error006: () => "Can't create edge. An edge needs a source and a target.",
  error007: (e) => `The old edge with id=${e} does not exist.`,
  error009: (e) => `Marker type "${e}" doesn't exist.`,
  error008: (e, { id: r, sourceHandle: o, targetHandle: s }) => `Couldn't create edge for ${e} handle id: "${e === "source" ? o : s}", edge id: ${r}.`,
  error010: () => "Handle: No node id found. Make sure to only use a Handle inside a custom Node.",
  error011: (e) => `Edge type "${e}" not found. Using fallback type "default".`,
  error012: (e) => `Node with id "${e}" does not exist, it may have been removed. This can happen when a node is deleted before the "onNodeClick" handler is called.`,
  error013: (e = "react") => `It seems that you haven't loaded the styles. Please import '@xyflow/${e}/dist/style.css' or base.css to make sure everything is working properly.`,
  error014: () => "useNodeConnections: No node ID found. Call useNodeConnections inside a custom Node or provide a node ID.",
  error015: () => "It seems that you are trying to drag a node that is not initialized. Please use onNodesChange as explained in the docs."
}, Ia = [
  [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY],
  [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY]
], um = ["Enter", " ", "Escape"], dm = {
  "node.a11yDescription.default": "Press enter or space to select a node. Press delete to remove it and escape to cancel.",
  "node.a11yDescription.keyboardDisabled": "Press enter or space to select a node. You can then use the arrow keys to move the node around. Press delete to remove it and escape to cancel.",
  "node.a11yDescription.ariaLiveMessage": ({ direction: e, x: r, y: o }) => `Moved selected node ${e}. New position, x: ${r}, y: ${o}`,
  "edge.a11yDescription.default": "Press enter or space to select an edge. You can then press delete to remove it or escape to cancel.",
  // Control elements
  "controls.ariaLabel": "Control Panel",
  "controls.zoomIn.ariaLabel": "Zoom In",
  "controls.zoomOut.ariaLabel": "Zoom Out",
  "controls.fitView.ariaLabel": "Fit View",
  "controls.interactive.ariaLabel": "Toggle Interactivity",
  // Mini map
  "minimap.ariaLabel": "Mini Map",
  // Handle
  "handle.ariaLabel": "Handle"
};
var po;
(function(e) {
  e.Strict = "strict", e.Loose = "loose";
})(po || (po = {}));
var Nr;
(function(e) {
  e.Free = "free", e.Vertical = "vertical", e.Horizontal = "horizontal";
})(Nr || (Nr = {}));
var Ca;
(function(e) {
  e.Partial = "partial", e.Full = "full";
})(Ca || (Ca = {}));
const fm = {
  inProgress: !1,
  isValid: null,
  from: null,
  fromHandle: null,
  fromPosition: null,
  fromNode: null,
  to: null,
  toHandle: null,
  toPosition: null,
  toNode: null,
  pointer: null
};
var Jn;
(function(e) {
  e.Bezier = "default", e.Straight = "straight", e.Step = "step", e.SmoothStep = "smoothstep", e.SimpleBezier = "simplebezier";
})(Jn || (Jn = {}));
var xi;
(function(e) {
  e.Arrow = "arrow", e.ArrowClosed = "arrowclosed";
})(xi || (xi = {}));
var Q;
(function(e) {
  e.Left = "left", e.Top = "top", e.Right = "right", e.Bottom = "bottom";
})(Q || (Q = {}));
const Bp = {
  [Q.Left]: Q.Right,
  [Q.Right]: Q.Left,
  [Q.Top]: Q.Bottom,
  [Q.Bottom]: Q.Top
};
function pm(e) {
  return e === null ? null : e ? "valid" : "invalid";
}
const gm = (e) => "id" in e && "source" in e && "target" in e, MC = (e) => "id" in e && "position" in e && !("source" in e) && !("target" in e), bu = (e) => "id" in e && "internals" in e && !("source" in e) && !("target" in e), ja = (e, r = [0, 0]) => {
  const { width: o, height: s } = Sn(e), i = e.origin ?? r, l = o * i[0], c = s * i[1];
  return {
    x: e.position.x - l,
    y: e.position.y - c
  };
}, TC = (e, r = { nodeOrigin: [0, 0] }) => {
  if (e.length === 0)
    return { x: 0, y: 0, width: 0, height: 0 };
  const o = e.reduce((s, i) => {
    const l = typeof i == "string";
    let c = !r.nodeLookup && !l ? i : void 0;
    r.nodeLookup && (c = l ? r.nodeLookup.get(i) : bu(i) ? i : r.nodeLookup.get(i.id));
    const u = c ? Ii(c, r.nodeOrigin) : { x: 0, y: 0, x2: 0, y2: 0 };
    return ji(s, u);
  }, { x: 1 / 0, y: 1 / 0, x2: -1 / 0, y2: -1 / 0 });
  return Mi(o);
}, Ma = (e, r = {}) => {
  let o = { x: 1 / 0, y: 1 / 0, x2: -1 / 0, y2: -1 / 0 }, s = !1;
  return e.forEach((i) => {
    (r.filter === void 0 || r.filter(i)) && (o = ji(o, Ii(i)), s = !0);
  }), s ? Mi(o) : { x: 0, y: 0, width: 0, height: 0 };
}, Nu = (e, r, [o, s, i] = [0, 0, 1], l = !1, c = !1) => {
  const u = {
    ...Ra(r, [o, s, i]),
    width: r.width / i,
    height: r.height / i
  }, p = [];
  for (const g of e.values()) {
    const { measured: m, selectable: h = !0, hidden: w = !1 } = g;
    if (c && !h || w)
      continue;
    const I = m.width ?? g.width ?? g.initialWidth ?? null, x = m.height ?? g.height ?? g.initialHeight ?? null, C = ba(u, mo(g)), b = (I ?? 0) * (x ?? 0), N = l && C > 0;
    (!g.internals.handleBounds || N || C >= b || g.dragging) && p.push(g);
  }
  return p;
}, RC = (e, r) => {
  const o = /* @__PURE__ */ new Set();
  return e.forEach((s) => {
    o.add(s.id);
  }), r.filter((s) => o.has(s.source) || o.has(s.target));
};
function BC(e, r) {
  const o = /* @__PURE__ */ new Map(), s = r != null && r.nodes ? new Set(r.nodes.map((i) => i.id)) : null;
  return e.forEach((i) => {
    i.measured.width && i.measured.height && ((r == null ? void 0 : r.includeHiddenNodes) || !i.hidden) && (!s || s.has(i.id)) && o.set(i.id, i);
  }), o;
}
async function EC({ nodes: e, width: r, height: o, panZoom: s, minZoom: i, maxZoom: l }, c) {
  if (e.size === 0)
    return Promise.resolve(!0);
  const u = BC(e, c), p = Ma(u), g = _u(p, r, o, (c == null ? void 0 : c.minZoom) ?? i, (c == null ? void 0 : c.maxZoom) ?? l, (c == null ? void 0 : c.padding) ?? 0.1);
  return await s.setViewport(g, {
    duration: c == null ? void 0 : c.duration,
    ease: c == null ? void 0 : c.ease,
    interpolate: c == null ? void 0 : c.interpolate
  }), Promise.resolve(!0);
}
function mm({ nodeId: e, nextPosition: r, nodeLookup: o, nodeOrigin: s = [0, 0], nodeExtent: i, onError: l }) {
  const c = o.get(e), u = c.parentId ? o.get(c.parentId) : void 0, { x: p, y: g } = u ? u.internals.positionAbsolute : { x: 0, y: 0 }, m = c.origin ?? s;
  let h = c.extent || i;
  if (c.extent === "parent" && !c.expandParent)
    if (!u)
      l == null || l("005", sn.error005());
    else {
      const I = u.measured.width, x = u.measured.height;
      I && x && (h = [
        [p, g],
        [p + I, g + x]
      ]);
    }
  else u && ho(c.extent) && (h = [
    [c.extent[0][0] + p, c.extent[0][1] + g],
    [c.extent[1][0] + p, c.extent[1][1] + g]
  ]);
  const w = ho(h) ? Sr(r, h, c.measured) : r;
  return (c.measured.width === void 0 || c.measured.height === void 0) && (l == null || l("015", sn.error015())), {
    position: {
      x: w.x - p + (c.measured.width ?? 0) * m[0],
      y: w.y - g + (c.measured.height ?? 0) * m[1]
    },
    positionAbsolute: w
  };
}
async function DC({ nodesToRemove: e = [], edgesToRemove: r = [], nodes: o, edges: s, onBeforeDelete: i }) {
  const l = new Set(e.map((w) => w.id)), c = [];
  for (const w of o) {
    if (w.deletable === !1)
      continue;
    const I = l.has(w.id), x = !I && w.parentId && c.find((C) => C.id === w.parentId);
    (I || x) && c.push(w);
  }
  const u = new Set(r.map((w) => w.id)), p = s.filter((w) => w.deletable !== !1), m = RC(c, p);
  for (const w of p)
    u.has(w.id) && !m.find((x) => x.id === w.id) && m.push(w);
  if (!i)
    return {
      edges: m,
      nodes: c
    };
  const h = await i({
    nodes: c,
    edges: m
  });
  return typeof h == "boolean" ? h ? { edges: m, nodes: c } : { edges: [], nodes: [] } : h;
}
const go = (e, r = 0, o = 1) => Math.min(Math.max(e, r), o), Sr = (e = { x: 0, y: 0 }, r, o) => ({
  x: go(e.x, r[0][0], r[1][0] - ((o == null ? void 0 : o.width) ?? 0)),
  y: go(e.y, r[0][1], r[1][1] - ((o == null ? void 0 : o.height) ?? 0))
});
function hm(e, r, o) {
  const { width: s, height: i } = Sn(o), { x: l, y: c } = o.internals.positionAbsolute;
  return Sr(e, [
    [l, c],
    [l + s, c + i]
  ], r);
}
const Ep = (e, r, o) => e < r ? go(Math.abs(e - r), 1, r) / r : e > o ? -go(Math.abs(e - o), 1, r) / r : 0, ym = (e, r, o = 15, s = 40) => {
  const i = Ep(e.x, s, r.width - s) * o, l = Ep(e.y, s, r.height - s) * o;
  return [i, l];
}, ji = (e, r) => ({
  x: Math.min(e.x, r.x),
  y: Math.min(e.y, r.y),
  x2: Math.max(e.x2, r.x2),
  y2: Math.max(e.y2, r.y2)
}), su = ({ x: e, y: r, width: o, height: s }) => ({
  x: e,
  y: r,
  x2: e + o,
  y2: r + s
}), Mi = ({ x: e, y: r, x2: o, y2: s }) => ({
  x: e,
  y: r,
  width: o - e,
  height: s - r
}), mo = (e, r = [0, 0]) => {
  var i, l;
  const { x: o, y: s } = bu(e) ? e.internals.positionAbsolute : ja(e, r);
  return {
    x: o,
    y: s,
    width: ((i = e.measured) == null ? void 0 : i.width) ?? e.width ?? e.initialWidth ?? 0,
    height: ((l = e.measured) == null ? void 0 : l.height) ?? e.height ?? e.initialHeight ?? 0
  };
}, Ii = (e, r = [0, 0]) => {
  var i, l;
  const { x: o, y: s } = bu(e) ? e.internals.positionAbsolute : ja(e, r);
  return {
    x: o,
    y: s,
    x2: o + (((i = e.measured) == null ? void 0 : i.width) ?? e.width ?? e.initialWidth ?? 0),
    y2: s + (((l = e.measured) == null ? void 0 : l.height) ?? e.height ?? e.initialHeight ?? 0)
  };
}, wm = (e, r) => Mi(ji(su(e), su(r))), ba = (e, r) => {
  const o = Math.max(0, Math.min(e.x + e.width, r.x + r.width) - Math.max(e.x, r.x)), s = Math.max(0, Math.min(e.y + e.height, r.y + r.height) - Math.max(e.y, r.y));
  return Math.ceil(o * s);
}, Dp = (e) => Zt(e.width) && Zt(e.height) && Zt(e.x) && Zt(e.y), Zt = (e) => !isNaN(e) && isFinite(e), GC = (e, r) => {
}, Ta = (e, r = [1, 1]) => ({
  x: r[0] * Math.round(e.x / r[0]),
  y: r[1] * Math.round(e.y / r[1])
}), Ra = ({ x: e, y: r }, [o, s, i], l = !1, c = [1, 1]) => {
  const u = {
    x: (e - o) / i,
    y: (r - s) / i
  };
  return l ? Ta(u, c) : u;
}, Ci = ({ x: e, y: r }, [o, s, i]) => ({
  x: e * i + o,
  y: r * i + s
});
function ao(e, r) {
  if (typeof e == "number")
    return Math.floor((r - r / (1 + e)) * 0.5);
  if (typeof e == "string" && e.endsWith("px")) {
    const o = parseFloat(e);
    if (!Number.isNaN(o))
      return Math.floor(o);
  }
  if (typeof e == "string" && e.endsWith("%")) {
    const o = parseFloat(e);
    if (!Number.isNaN(o))
      return Math.floor(r * o * 0.01);
  }
  return console.error(`[React Flow] The padding value "${e}" is invalid. Please provide a number or a string with a valid unit (px or %).`), 0;
}
function FC(e, r, o) {
  if (typeof e == "string" || typeof e == "number") {
    const s = ao(e, o), i = ao(e, r);
    return {
      top: s,
      right: i,
      bottom: s,
      left: i,
      x: i * 2,
      y: s * 2
    };
  }
  if (typeof e == "object") {
    const s = ao(e.top ?? e.y ?? 0, o), i = ao(e.bottom ?? e.y ?? 0, o), l = ao(e.left ?? e.x ?? 0, r), c = ao(e.right ?? e.x ?? 0, r);
    return { top: s, right: c, bottom: i, left: l, x: l + c, y: s + i };
  }
  return { top: 0, right: 0, bottom: 0, left: 0, x: 0, y: 0 };
}
function PC(e, r, o, s, i, l) {
  const { x: c, y: u } = Ci(e, [r, o, s]), { x: p, y: g } = Ci({ x: e.x + e.width, y: e.y + e.height }, [r, o, s]), m = i - p, h = l - g;
  return {
    left: Math.floor(c),
    top: Math.floor(u),
    right: Math.floor(m),
    bottom: Math.floor(h)
  };
}
const _u = (e, r, o, s, i, l) => {
  const c = FC(l, r, o), u = (r - c.x) / e.width, p = (o - c.y) / e.height, g = Math.min(u, p), m = go(g, s, i), h = e.x + e.width / 2, w = e.y + e.height / 2, I = r / 2 - h * m, x = o / 2 - w * m, C = PC(e, I, x, m, r, o), b = {
    left: Math.min(C.left - c.left, 0),
    top: Math.min(C.top - c.top, 0),
    right: Math.min(C.right - c.right, 0),
    bottom: Math.min(C.bottom - c.bottom, 0)
  };
  return {
    x: I - b.left + b.right,
    y: x - b.top + b.bottom,
    zoom: m
  };
}, Na = () => {
  var e;
  return typeof navigator < "u" && ((e = navigator == null ? void 0 : navigator.userAgent) == null ? void 0 : e.indexOf("Mac")) >= 0;
};
function ho(e) {
  return e != null && e !== "parent";
}
function Sn(e) {
  var r, o;
  return {
    width: ((r = e.measured) == null ? void 0 : r.width) ?? e.width ?? e.initialWidth ?? 0,
    height: ((o = e.measured) == null ? void 0 : o.height) ?? e.height ?? e.initialHeight ?? 0
  };
}
function vm(e) {
  var r, o;
  return (((r = e.measured) == null ? void 0 : r.width) ?? e.width ?? e.initialWidth) !== void 0 && (((o = e.measured) == null ? void 0 : o.height) ?? e.height ?? e.initialHeight) !== void 0;
}
function xm(e, r = { width: 0, height: 0 }, o, s, i) {
  const l = { ...e }, c = s.get(o);
  if (c) {
    const u = c.origin || i;
    l.x += c.internals.positionAbsolute.x - (r.width ?? 0) * u[0], l.y += c.internals.positionAbsolute.y - (r.height ?? 0) * u[1];
  }
  return l;
}
function Gp(e, r) {
  if (e.size !== r.size)
    return !1;
  for (const o of e)
    if (!r.has(o))
      return !1;
  return !0;
}
function zC() {
  let e, r;
  return { promise: new Promise((s, i) => {
    e = s, r = i;
  }), resolve: e, reject: r };
}
function VC(e) {
  return { ...dm, ...e || {} };
}
function ha(e, { snapGrid: r = [0, 0], snapToGrid: o = !1, transform: s, containerBounds: i }) {
  const { x: l, y: c } = Yt(e), u = Ra({ x: l - ((i == null ? void 0 : i.left) ?? 0), y: c - ((i == null ? void 0 : i.top) ?? 0) }, s), { x: p, y: g } = o ? Ta(u, r) : u;
  return {
    xSnapped: p,
    ySnapped: g,
    ...u
  };
}
const Au = (e) => ({
  width: e.offsetWidth,
  height: e.offsetHeight
}), Im = (e) => {
  var r;
  return ((r = e == null ? void 0 : e.getRootNode) == null ? void 0 : r.call(e)) || (window == null ? void 0 : window.document);
}, OC = ["INPUT", "SELECT", "TEXTAREA"];
function Cm(e) {
  var s, i;
  const r = ((i = (s = e.composedPath) == null ? void 0 : s.call(e)) == null ? void 0 : i[0]) || e.target;
  return (r == null ? void 0 : r.nodeType) !== 1 ? !1 : OC.includes(r.nodeName) || r.hasAttribute("contenteditable") || !!r.closest(".nokey");
}
const bm = (e) => "clientX" in e, Yt = (e, r) => {
  var l, c;
  const o = bm(e), s = o ? e.clientX : (l = e.touches) == null ? void 0 : l[0].clientX, i = o ? e.clientY : (c = e.touches) == null ? void 0 : c[0].clientY;
  return {
    x: s - ((r == null ? void 0 : r.left) ?? 0),
    y: i - ((r == null ? void 0 : r.top) ?? 0)
  };
}, Fp = (e, r, o, s, i) => {
  const l = r.querySelectorAll(`.${e}`);
  return !l || !l.length ? null : Array.from(l).map((c) => {
    const u = c.getBoundingClientRect();
    return {
      id: c.getAttribute("data-handleid"),
      type: e,
      nodeId: i,
      position: c.getAttribute("data-handlepos"),
      x: (u.left - o.left) / s,
      y: (u.top - o.top) / s,
      ...Au(c)
    };
  });
};
function Nm({ sourceX: e, sourceY: r, targetX: o, targetY: s, sourceControlX: i, sourceControlY: l, targetControlX: c, targetControlY: u }) {
  const p = e * 0.125 + i * 0.375 + c * 0.375 + o * 0.125, g = r * 0.125 + l * 0.375 + u * 0.375 + s * 0.125, m = Math.abs(p - e), h = Math.abs(g - r);
  return [p, g, m, h];
}
function ri(e, r) {
  return e >= 0 ? 0.5 * e : r * 25 * Math.sqrt(-e);
}
function Pp({ pos: e, x1: r, y1: o, x2: s, y2: i, c: l }) {
  switch (e) {
    case Q.Left:
      return [r - ri(r - s, l), o];
    case Q.Right:
      return [r + ri(s - r, l), o];
    case Q.Top:
      return [r, o - ri(o - i, l)];
    case Q.Bottom:
      return [r, o + ri(i - o, l)];
  }
}
function Ti({ sourceX: e, sourceY: r, sourcePosition: o = Q.Bottom, targetX: s, targetY: i, targetPosition: l = Q.Top, curvature: c = 0.25 }) {
  const [u, p] = Pp({
    pos: o,
    x1: e,
    y1: r,
    x2: s,
    y2: i,
    c
  }), [g, m] = Pp({
    pos: l,
    x1: s,
    y1: i,
    x2: e,
    y2: r,
    c
  }), [h, w, I, x] = Nm({
    sourceX: e,
    sourceY: r,
    targetX: s,
    targetY: i,
    sourceControlX: u,
    sourceControlY: p,
    targetControlX: g,
    targetControlY: m
  });
  return [
    `M${e},${r} C${u},${p} ${g},${m} ${s},${i}`,
    h,
    w,
    I,
    x
  ];
}
function _m({ sourceX: e, sourceY: r, targetX: o, targetY: s }) {
  const i = Math.abs(o - e) / 2, l = o < e ? o + i : o - i, c = Math.abs(s - r) / 2, u = s < r ? s + c : s - c;
  return [l, u, i, c];
}
function HC({ sourceNode: e, targetNode: r, selected: o = !1, zIndex: s = 0, elevateOnSelect: i = !1, zIndexMode: l = "basic" }) {
  if (l === "manual")
    return s;
  const c = i && o ? s + 1e3 : s, u = Math.max(e.parentId || i && e.selected ? e.internals.z : 0, r.parentId || i && r.selected ? r.internals.z : 0);
  return c + u;
}
function WC({ sourceNode: e, targetNode: r, width: o, height: s, transform: i }) {
  const l = ji(Ii(e), Ii(r));
  l.x === l.x2 && (l.x2 += 1), l.y === l.y2 && (l.y2 += 1);
  const c = {
    x: -i[0] / i[2],
    y: -i[1] / i[2],
    width: o / i[2],
    height: s / i[2]
  };
  return ba(c, Mi(l)) > 0;
}
const XC = ({ source: e, sourceHandle: r, target: o, targetHandle: s }) => `xy-edge__${e}${r || ""}-${o}${s || ""}`, LC = (e, r) => r.some((o) => o.source === e.source && o.target === e.target && (o.sourceHandle === e.sourceHandle || !o.sourceHandle && !e.sourceHandle) && (o.targetHandle === e.targetHandle || !o.targetHandle && !e.targetHandle)), KC = (e, r, o = {}) => {
  if (!e.source || !e.target)
    return r;
  const s = o.getEdgeId || XC;
  let i;
  return gm(e) ? i = { ...e } : i = {
    ...e,
    id: s(e)
  }, LC(i, r) ? r : (i.sourceHandle === null && delete i.sourceHandle, i.targetHandle === null && delete i.targetHandle, r.concat(i));
};
function Am({ sourceX: e, sourceY: r, targetX: o, targetY: s }) {
  const [i, l, c, u] = _m({
    sourceX: e,
    sourceY: r,
    targetX: o,
    targetY: s
  });
  return [`M ${e},${r}L ${o},${s}`, i, l, c, u];
}
const zp = {
  [Q.Left]: { x: -1, y: 0 },
  [Q.Right]: { x: 1, y: 0 },
  [Q.Top]: { x: 0, y: -1 },
  [Q.Bottom]: { x: 0, y: 1 }
}, ZC = ({ source: e, sourcePosition: r = Q.Bottom, target: o }) => r === Q.Left || r === Q.Right ? e.x < o.x ? { x: 1, y: 0 } : { x: -1, y: 0 } : e.y < o.y ? { x: 0, y: 1 } : { x: 0, y: -1 }, Vp = (e, r) => Math.sqrt(Math.pow(r.x - e.x, 2) + Math.pow(r.y - e.y, 2));
function YC({ source: e, sourcePosition: r = Q.Bottom, target: o, targetPosition: s = Q.Top, center: i, offset: l, stepPosition: c }) {
  const u = zp[r], p = zp[s], g = { x: e.x + u.x * l, y: e.y + u.y * l }, m = { x: o.x + p.x * l, y: o.y + p.y * l }, h = ZC({
    source: g,
    sourcePosition: r,
    target: m
  }), w = h.x !== 0 ? "x" : "y", I = h[w];
  let x = [], C, b;
  const N = { x: 0, y: 0 }, k = { x: 0, y: 0 }, [, , A, S] = _m({
    sourceX: e.x,
    sourceY: e.y,
    targetX: o.x,
    targetY: o.y
  });
  if (u[w] * p[w] === -1) {
    w === "x" ? (C = i.x ?? g.x + (m.x - g.x) * c, b = i.y ?? (g.y + m.y) / 2) : (C = i.x ?? (g.x + m.x) / 2, b = i.y ?? g.y + (m.y - g.y) * c);
    const F = [
      { x: C, y: g.y },
      { x: C, y: m.y }
    ], j = [
      { x: g.x, y: b },
      { x: m.x, y: b }
    ];
    u[w] === I ? x = w === "x" ? F : j : x = w === "x" ? j : F;
  } else {
    const F = [{ x: g.x, y: m.y }], j = [{ x: m.x, y: g.y }];
    if (w === "x" ? x = u.x === I ? j : F : x = u.y === I ? F : j, r === s) {
      const L = Math.abs(e[w] - o[w]);
      if (L <= l) {
        const ee = Math.min(l - 1, l - L);
        u[w] === I ? N[w] = (g[w] > e[w] ? -1 : 1) * ee : k[w] = (m[w] > o[w] ? -1 : 1) * ee;
      }
    }
    if (r !== s) {
      const L = w === "x" ? "y" : "x", ee = u[w] === p[L], T = g[L] > m[L], Y = g[L] < m[L];
      (u[w] === 1 && (!ee && T || ee && Y) || u[w] !== 1 && (!ee && Y || ee && T)) && (x = w === "x" ? F : j);
    }
    const W = { x: g.x + N.x, y: g.y + N.y }, D = { x: m.x + k.x, y: m.y + k.y }, Z = Math.max(Math.abs(W.x - x[0].x), Math.abs(D.x - x[0].x)), H = Math.max(Math.abs(W.y - x[0].y), Math.abs(D.y - x[0].y));
    Z >= H ? (C = (W.x + D.x) / 2, b = x[0].y) : (C = x[0].x, b = (W.y + D.y) / 2);
  }
  return [[
    e,
    { x: g.x + N.x, y: g.y + N.y },
    ...x,
    { x: m.x + k.x, y: m.y + k.y },
    o
  ], C, b, A, S];
}
function UC(e, r, o, s) {
  const i = Math.min(Vp(e, r) / 2, Vp(r, o) / 2, s), { x: l, y: c } = r;
  if (e.x === l && l === o.x || e.y === c && c === o.y)
    return `L${l} ${c}`;
  if (e.y === c) {
    const g = e.x < o.x ? -1 : 1, m = e.y < o.y ? 1 : -1;
    return `L ${l + i * g},${c}Q ${l},${c} ${l},${c + i * m}`;
  }
  const u = e.x < o.x ? 1 : -1, p = e.y < o.y ? -1 : 1;
  return `L ${l},${c + i * p}Q ${l},${c} ${l + i * u},${c}`;
}
function iu({ sourceX: e, sourceY: r, sourcePosition: o = Q.Bottom, targetX: s, targetY: i, targetPosition: l = Q.Top, borderRadius: c = 5, centerX: u, centerY: p, offset: g = 20, stepPosition: m = 0.5 }) {
  const [h, w, I, x, C] = YC({
    source: { x: e, y: r },
    sourcePosition: o,
    target: { x: s, y: i },
    targetPosition: l,
    center: { x: u, y: p },
    offset: g,
    stepPosition: m
  });
  return [h.reduce((N, k, A) => {
    let S = "";
    return A > 0 && A < h.length - 1 ? S = UC(h[A - 1], k, h[A + 1], c) : S = `${A === 0 ? "M" : "L"}${k.x} ${k.y}`, N += S, N;
  }, ""), w, I, x, C];
}
function Op(e) {
  var r;
  return e && !!(e.internals.handleBounds || (r = e.handles) != null && r.length) && !!(e.measured.width || e.width || e.initialWidth);
}
function $C(e) {
  var h;
  const { sourceNode: r, targetNode: o } = e;
  if (!Op(r) || !Op(o))
    return null;
  const s = r.internals.handleBounds || Hp(r.handles), i = o.internals.handleBounds || Hp(o.handles), l = Wp((s == null ? void 0 : s.source) ?? [], e.sourceHandle), c = Wp(
    // when connection type is loose we can define all handles as sources and connect source -> source
    e.connectionMode === po.Strict ? (i == null ? void 0 : i.target) ?? [] : ((i == null ? void 0 : i.target) ?? []).concat((i == null ? void 0 : i.source) ?? []),
    e.targetHandle
  );
  if (!l || !c)
    return (h = e.onError) == null || h.call(e, "008", sn.error008(l ? "target" : "source", {
      id: e.id,
      sourceHandle: e.sourceHandle,
      targetHandle: e.targetHandle
    })), null;
  const u = (l == null ? void 0 : l.position) || Q.Bottom, p = (c == null ? void 0 : c.position) || Q.Top, g = kr(r, l, u), m = kr(o, c, p);
  return {
    sourceX: g.x,
    sourceY: g.y,
    targetX: m.x,
    targetY: m.y,
    sourcePosition: u,
    targetPosition: p
  };
}
function Hp(e) {
  if (!e)
    return null;
  const r = [], o = [];
  for (const s of e)
    s.width = s.width ?? 1, s.height = s.height ?? 1, s.type === "source" ? r.push(s) : s.type === "target" && o.push(s);
  return {
    source: r,
    target: o
  };
}
function kr(e, r, o = Q.Left, s = !1) {
  const i = ((r == null ? void 0 : r.x) ?? 0) + e.internals.positionAbsolute.x, l = ((r == null ? void 0 : r.y) ?? 0) + e.internals.positionAbsolute.y, { width: c, height: u } = r ?? Sn(e);
  if (s)
    return { x: i + c / 2, y: l + u / 2 };
  switch ((r == null ? void 0 : r.position) ?? o) {
    case Q.Top:
      return { x: i + c / 2, y: l };
    case Q.Right:
      return { x: i + c, y: l + u / 2 };
    case Q.Bottom:
      return { x: i + c / 2, y: l + u };
    case Q.Left:
      return { x: i, y: l + u / 2 };
  }
}
function Wp(e, r) {
  return e && (r ? e.find((o) => o.id === r) : e[0]) || null;
}
function lu(e, r) {
  return e ? typeof e == "string" ? e : `${r ? `${r}__` : ""}${Object.keys(e).sort().map((s) => `${s}=${e[s]}`).join("&")}` : "";
}
function QC(e, { id: r, defaultColor: o, defaultMarkerStart: s, defaultMarkerEnd: i }) {
  const l = /* @__PURE__ */ new Set();
  return e.reduce((c, u) => ([u.markerStart || s, u.markerEnd || i].forEach((p) => {
    if (p && typeof p == "object") {
      const g = lu(p, r);
      l.has(g) || (c.push({ id: g, color: p.color || o, ...p }), l.add(g));
    }
  }), c), []).sort((c, u) => c.id.localeCompare(u.id));
}
const Sm = 1e3, JC = 10, Su = {
  nodeOrigin: [0, 0],
  nodeExtent: Ia,
  elevateNodesOnSelect: !0,
  zIndexMode: "basic",
  defaults: {}
}, qC = {
  ...Su,
  checkEquality: !0
};
function ku(e, r) {
  const o = { ...e };
  for (const s in r)
    r[s] !== void 0 && (o[s] = r[s]);
  return o;
}
function eb(e, r, o) {
  const s = ku(Su, o);
  for (const i of e.values())
    if (i.parentId)
      Mu(i, e, r, s);
    else {
      const l = ja(i, s.nodeOrigin), c = ho(i.extent) ? i.extent : s.nodeExtent, u = Sr(l, c, Sn(i));
      i.internals.positionAbsolute = u;
    }
}
function tb(e, r) {
  if (!e.handles)
    return e.measured ? r == null ? void 0 : r.internals.handleBounds : void 0;
  const o = [], s = [];
  for (const i of e.handles) {
    const l = {
      id: i.id,
      width: i.width ?? 1,
      height: i.height ?? 1,
      nodeId: e.id,
      x: i.x,
      y: i.y,
      position: i.position,
      type: i.type
    };
    i.type === "source" ? o.push(l) : i.type === "target" && s.push(l);
  }
  return {
    source: o,
    target: s
  };
}
function ju(e) {
  return e === "manual";
}
function cu(e, r, o, s = {}) {
  var g, m;
  const i = ku(qC, s), l = { i: 0 }, c = new Map(r), u = i != null && i.elevateNodesOnSelect && !ju(i.zIndexMode) ? Sm : 0;
  let p = e.length > 0;
  r.clear(), o.clear();
  for (const h of e) {
    let w = c.get(h.id);
    if (i.checkEquality && h === (w == null ? void 0 : w.internals.userNode))
      r.set(h.id, w);
    else {
      const I = ja(h, i.nodeOrigin), x = ho(h.extent) ? h.extent : i.nodeExtent, C = Sr(I, x, Sn(h));
      w = {
        ...i.defaults,
        ...h,
        measured: {
          width: (g = h.measured) == null ? void 0 : g.width,
          height: (m = h.measured) == null ? void 0 : m.height
        },
        internals: {
          positionAbsolute: C,
          // if user re-initializes the node or removes `measured` for whatever reason, we reset the handleBounds so that the node gets re-measured
          handleBounds: tb(h, w),
          z: km(h, u, i.zIndexMode),
          userNode: h
        }
      }, r.set(h.id, w);
    }
    (w.measured === void 0 || w.measured.width === void 0 || w.measured.height === void 0) && !w.hidden && (p = !1), h.parentId && Mu(w, r, o, s, l);
  }
  return p;
}
function nb(e, r) {
  if (!e.parentId)
    return;
  const o = r.get(e.parentId);
  o ? o.set(e.id, e) : r.set(e.parentId, /* @__PURE__ */ new Map([[e.id, e]]));
}
function Mu(e, r, o, s, i) {
  const { elevateNodesOnSelect: l, nodeOrigin: c, nodeExtent: u, zIndexMode: p } = ku(Su, s), g = e.parentId, m = r.get(g);
  if (!m) {
    console.warn(`Parent node ${g} not found. Please make sure that parent nodes are in front of their child nodes in the nodes array.`);
    return;
  }
  nb(e, o), i && !m.parentId && m.internals.rootParentIndex === void 0 && p === "auto" && (m.internals.rootParentIndex = ++i.i, m.internals.z = m.internals.z + i.i * JC), i && m.internals.rootParentIndex !== void 0 && (i.i = m.internals.rootParentIndex);
  const h = l && !ju(p) ? Sm : 0, { x: w, y: I, z: x } = rb(e, m, c, u, h, p), { positionAbsolute: C } = e.internals, b = w !== C.x || I !== C.y;
  (b || x !== e.internals.z) && r.set(e.id, {
    ...e,
    internals: {
      ...e.internals,
      positionAbsolute: b ? { x: w, y: I } : C,
      z: x
    }
  });
}
function km(e, r, o) {
  const s = Zt(e.zIndex) ? e.zIndex : 0;
  return ju(o) ? s : s + (e.selected ? r : 0);
}
function rb(e, r, o, s, i, l) {
  const { x: c, y: u } = r.internals.positionAbsolute, p = Sn(e), g = ja(e, o), m = ho(e.extent) ? Sr(g, e.extent, p) : g;
  let h = Sr({ x: c + m.x, y: u + m.y }, s, p);
  e.extent === "parent" && (h = hm(h, p, r));
  const w = km(e, i, l), I = r.internals.z ?? 0;
  return {
    x: h.x,
    y: h.y,
    z: I >= w ? I + 1 : w
  };
}
function Tu(e, r, o, s = [0, 0]) {
  var c;
  const i = [], l = /* @__PURE__ */ new Map();
  for (const u of e) {
    const p = r.get(u.parentId);
    if (!p)
      continue;
    const g = ((c = l.get(u.parentId)) == null ? void 0 : c.expandedRect) ?? mo(p), m = wm(g, u.rect);
    l.set(u.parentId, { expandedRect: m, parent: p });
  }
  return l.size > 0 && l.forEach(({ expandedRect: u, parent: p }, g) => {
    var A;
    const m = p.internals.positionAbsolute, h = Sn(p), w = p.origin ?? s, I = u.x < m.x ? Math.round(Math.abs(m.x - u.x)) : 0, x = u.y < m.y ? Math.round(Math.abs(m.y - u.y)) : 0, C = Math.max(h.width, Math.round(u.width)), b = Math.max(h.height, Math.round(u.height)), N = (C - h.width) * w[0], k = (b - h.height) * w[1];
    (I > 0 || x > 0 || N || k) && (i.push({
      id: g,
      type: "position",
      position: {
        x: p.position.x - I + N,
        y: p.position.y - x + k
      }
    }), (A = o.get(g)) == null || A.forEach((S) => {
      e.some((P) => P.id === S.id) || i.push({
        id: S.id,
        type: "position",
        position: {
          x: S.position.x + I,
          y: S.position.y + x
        }
      });
    })), (h.width < u.width || h.height < u.height || I || x) && i.push({
      id: g,
      type: "dimensions",
      setAttributes: !0,
      dimensions: {
        width: C + (I ? w[0] * I - N : 0),
        height: b + (x ? w[1] * x - k : 0)
      }
    });
  }), i;
}
function ob(e, r, o, s, i, l, c) {
  const u = s == null ? void 0 : s.querySelector(".xyflow__viewport");
  let p = !1;
  if (!u)
    return { changes: [], updatedInternals: p };
  const g = [], m = window.getComputedStyle(u), { m22: h } = new window.DOMMatrixReadOnly(m.transform), w = [];
  for (const I of e.values()) {
    const x = r.get(I.id);
    if (!x)
      continue;
    if (x.hidden) {
      r.set(x.id, {
        ...x,
        internals: {
          ...x.internals,
          handleBounds: void 0
        }
      }), p = !0;
      continue;
    }
    const C = Au(I.nodeElement), b = x.measured.width !== C.width || x.measured.height !== C.height;
    if (!!(C.width && C.height && (b || !x.internals.handleBounds || I.force))) {
      const k = I.nodeElement.getBoundingClientRect(), A = ho(x.extent) ? x.extent : l;
      let { positionAbsolute: S } = x.internals;
      x.parentId && x.extent === "parent" ? S = hm(S, C, r.get(x.parentId)) : A && (S = Sr(S, A, C));
      const P = {
        ...x,
        measured: C,
        internals: {
          ...x.internals,
          positionAbsolute: S,
          handleBounds: {
            source: Fp("source", I.nodeElement, k, h, x.id),
            target: Fp("target", I.nodeElement, k, h, x.id)
          }
        }
      };
      r.set(x.id, P), x.parentId && Mu(P, r, o, { nodeOrigin: i, zIndexMode: c }), p = !0, b && (g.push({
        id: x.id,
        type: "dimensions",
        dimensions: C
      }), x.expandParent && x.parentId && w.push({
        id: x.id,
        parentId: x.parentId,
        rect: mo(P, i)
      }));
    }
  }
  if (w.length > 0) {
    const I = Tu(w, r, o, i);
    g.push(...I);
  }
  return { changes: g, updatedInternals: p };
}
async function ab({ delta: e, panZoom: r, transform: o, translateExtent: s, width: i, height: l }) {
  if (!r || !e.x && !e.y)
    return Promise.resolve(!1);
  const c = await r.setViewportConstrained({
    x: o[0] + e.x,
    y: o[1] + e.y,
    zoom: o[2]
  }, [
    [0, 0],
    [i, l]
  ], s), u = !!c && (c.x !== o[0] || c.y !== o[1] || c.k !== o[2]);
  return Promise.resolve(u);
}
function Xp(e, r, o, s, i, l) {
  let c = i;
  const u = s.get(c) || /* @__PURE__ */ new Map();
  s.set(c, u.set(o, r)), c = `${i}-${e}`;
  const p = s.get(c) || /* @__PURE__ */ new Map();
  if (s.set(c, p.set(o, r)), l) {
    c = `${i}-${e}-${l}`;
    const g = s.get(c) || /* @__PURE__ */ new Map();
    s.set(c, g.set(o, r));
  }
}
function jm(e, r, o) {
  e.clear(), r.clear();
  for (const s of o) {
    const { source: i, target: l, sourceHandle: c = null, targetHandle: u = null } = s, p = { edgeId: s.id, source: i, target: l, sourceHandle: c, targetHandle: u }, g = `${i}-${c}--${l}-${u}`, m = `${l}-${u}--${i}-${c}`;
    Xp("source", p, m, e, i, c), Xp("target", p, g, e, l, u), r.set(s.id, s);
  }
}
function Mm(e, r) {
  if (!e.parentId)
    return !1;
  const o = r.get(e.parentId);
  return o ? o.selected ? !0 : Mm(o, r) : !1;
}
function Lp(e, r, o) {
  var i;
  let s = e;
  do {
    if ((i = s == null ? void 0 : s.matches) != null && i.call(s, r))
      return !0;
    if (s === o)
      return !1;
    s = s == null ? void 0 : s.parentElement;
  } while (s);
  return !1;
}
function sb(e, r, o, s) {
  const i = /* @__PURE__ */ new Map();
  for (const [l, c] of e)
    if ((c.selected || c.id === s) && (!c.parentId || !Mm(c, e)) && (c.draggable || r && typeof c.draggable > "u")) {
      const u = e.get(l);
      u && i.set(l, {
        id: l,
        position: u.position || { x: 0, y: 0 },
        distance: {
          x: o.x - u.internals.positionAbsolute.x,
          y: o.y - u.internals.positionAbsolute.y
        },
        extent: u.extent,
        parentId: u.parentId,
        origin: u.origin,
        expandParent: u.expandParent,
        internals: {
          positionAbsolute: u.internals.positionAbsolute || { x: 0, y: 0 }
        },
        measured: {
          width: u.measured.width ?? 0,
          height: u.measured.height ?? 0
        }
      });
    }
  return i;
}
function Pc({ nodeId: e, dragItems: r, nodeLookup: o, dragging: s = !0 }) {
  var c, u, p;
  const i = [];
  for (const [g, m] of r) {
    const h = (c = o.get(g)) == null ? void 0 : c.internals.userNode;
    h && i.push({
      ...h,
      position: m.position,
      dragging: s
    });
  }
  if (!e)
    return [i[0], i];
  const l = (u = o.get(e)) == null ? void 0 : u.internals.userNode;
  return [
    l ? {
      ...l,
      position: ((p = r.get(e)) == null ? void 0 : p.position) || l.position,
      dragging: s
    } : i[0],
    i
  ];
}
function ib({ dragItems: e, snapGrid: r, x: o, y: s }) {
  const i = e.values().next().value;
  if (!i)
    return null;
  const l = {
    x: o - i.distance.x,
    y: s - i.distance.y
  }, c = Ta(l, r);
  return {
    x: c.x - l.x,
    y: c.y - l.y
  };
}
function lb({ onNodeMouseDown: e, getStoreItems: r, onDragStart: o, onDrag: s, onDragStop: i }) {
  let l = { x: null, y: null }, c = 0, u = /* @__PURE__ */ new Map(), p = !1, g = { x: 0, y: 0 }, m = null, h = !1, w = null, I = !1, x = !1, C = null;
  function b({ noDragClassName: k, handleSelector: A, domNode: S, isSelectable: P, nodeId: F, nodeClickDistance: j = 0 }) {
    w = St(S);
    function W({ x: L, y: ee }) {
      const { nodeLookup: T, nodeExtent: Y, snapGrid: O, snapToGrid: U, nodeOrigin: E, onNodeDrag: G, onSelectionDrag: K, onError: M, updateNodePositions: V } = r();
      l = { x: L, y: ee };
      let te = !1;
      const re = u.size > 1, le = re && Y ? su(Ma(u)) : null, ue = re && U ? ib({
        dragItems: u,
        snapGrid: O,
        x: L,
        y: ee
      }) : null;
      for (const [de, ne] of u) {
        if (!T.has(de))
          continue;
        let fe = { x: L - ne.distance.x, y: ee - ne.distance.y };
        U && (fe = ue ? {
          x: Math.round(fe.x + ue.x),
          y: Math.round(fe.y + ue.y)
        } : Ta(fe, O));
        let be = null;
        if (re && Y && !ne.extent && le) {
          const { positionAbsolute: xe } = ne.internals, Te = xe.x - le.x + Y[0][0], Be = xe.x + ne.measured.width - le.x2 + Y[1][0], je = xe.y - le.y + Y[0][1], We = xe.y + ne.measured.height - le.y2 + Y[1][1];
          be = [
            [Te, je],
            [Be, We]
          ];
        }
        const { position: Ne, positionAbsolute: Ce } = mm({
          nodeId: de,
          nextPosition: fe,
          nodeLookup: T,
          nodeExtent: be || Y,
          nodeOrigin: E,
          onError: M
        });
        te = te || ne.position.x !== Ne.x || ne.position.y !== Ne.y, ne.position = Ne, ne.internals.positionAbsolute = Ce;
      }
      if (x = x || te, !!te && (V(u, !0), C && (s || G || !F && K))) {
        const [de, ne] = Pc({
          nodeId: F,
          dragItems: u,
          nodeLookup: T
        });
        s == null || s(C, u, de, ne), G == null || G(C, de, ne), F || K == null || K(C, ne);
      }
    }
    async function D() {
      if (!m)
        return;
      const { transform: L, panBy: ee, autoPanSpeed: T, autoPanOnNodeDrag: Y } = r();
      if (!Y) {
        p = !1, cancelAnimationFrame(c);
        return;
      }
      const [O, U] = ym(g, m, T);
      (O !== 0 || U !== 0) && (l.x = (l.x ?? 0) - O / L[2], l.y = (l.y ?? 0) - U / L[2], await ee({ x: O, y: U }) && W(l)), c = requestAnimationFrame(D);
    }
    function Z(L) {
      var re;
      const { nodeLookup: ee, multiSelectionActive: T, nodesDraggable: Y, transform: O, snapGrid: U, snapToGrid: E, selectNodesOnDrag: G, onNodeDragStart: K, onSelectionDragStart: M, unselectNodesAndEdges: V } = r();
      h = !0, (!G || !P) && !T && F && ((re = ee.get(F)) != null && re.selected || V()), P && G && F && (e == null || e(F));
      const te = ha(L.sourceEvent, { transform: O, snapGrid: U, snapToGrid: E, containerBounds: m });
      if (l = te, u = sb(ee, Y, te, F), u.size > 0 && (o || K || !F && M)) {
        const [le, ue] = Pc({
          nodeId: F,
          dragItems: u,
          nodeLookup: ee
        });
        o == null || o(L.sourceEvent, u, le, ue), K == null || K(L.sourceEvent, le, ue), F || M == null || M(L.sourceEvent, ue);
      }
    }
    const H = Yg().clickDistance(j).on("start", (L) => {
      const { domNode: ee, nodeDragThreshold: T, transform: Y, snapGrid: O, snapToGrid: U } = r();
      m = (ee == null ? void 0 : ee.getBoundingClientRect()) || null, I = !1, x = !1, C = L.sourceEvent, T === 0 && Z(L), l = ha(L.sourceEvent, { transform: Y, snapGrid: O, snapToGrid: U, containerBounds: m }), g = Yt(L.sourceEvent, m);
    }).on("drag", (L) => {
      const { autoPanOnNodeDrag: ee, transform: T, snapGrid: Y, snapToGrid: O, nodeDragThreshold: U, nodeLookup: E } = r(), G = ha(L.sourceEvent, { transform: T, snapGrid: Y, snapToGrid: O, containerBounds: m });
      if (C = L.sourceEvent, (L.sourceEvent.type === "touchmove" && L.sourceEvent.touches.length > 1 || // if user deletes a node while dragging, we need to abort the drag to prevent errors
      F && !E.has(F)) && (I = !0), !I) {
        if (!p && ee && h && (p = !0, D()), !h) {
          const K = Yt(L.sourceEvent, m), M = K.x - g.x, V = K.y - g.y;
          Math.sqrt(M * M + V * V) > U && Z(L);
        }
        (l.x !== G.xSnapped || l.y !== G.ySnapped) && u && h && (g = Yt(L.sourceEvent, m), W(G));
      }
    }).on("end", (L) => {
      if (!(!h || I) && (p = !1, h = !1, cancelAnimationFrame(c), u.size > 0)) {
        const { nodeLookup: ee, updateNodePositions: T, onNodeDragStop: Y, onSelectionDragStop: O } = r();
        if (x && (T(u, !1), x = !1), i || Y || !F && O) {
          const [U, E] = Pc({
            nodeId: F,
            dragItems: u,
            nodeLookup: ee,
            dragging: !1
          });
          i == null || i(L.sourceEvent, u, U, E), Y == null || Y(L.sourceEvent, U, E), F || O == null || O(L.sourceEvent, E);
        }
      }
    }).filter((L) => {
      const ee = L.target;
      return !L.button && (!k || !Lp(ee, `.${k}`, S)) && (!A || Lp(ee, A, S));
    });
    w.call(H);
  }
  function N() {
    w == null || w.on(".drag", null);
  }
  return {
    update: b,
    destroy: N
  };
}
function cb(e, r, o) {
  const s = [], i = {
    x: e.x - o,
    y: e.y - o,
    width: o * 2,
    height: o * 2
  };
  for (const l of r.values())
    ba(i, mo(l)) > 0 && s.push(l);
  return s;
}
const ub = 250;
function db(e, r, o, s) {
  var u, p;
  let i = [], l = 1 / 0;
  const c = cb(e, o, r + ub);
  for (const g of c) {
    const m = [...((u = g.internals.handleBounds) == null ? void 0 : u.source) ?? [], ...((p = g.internals.handleBounds) == null ? void 0 : p.target) ?? []];
    for (const h of m) {
      if (s.nodeId === h.nodeId && s.type === h.type && s.id === h.id)
        continue;
      const { x: w, y: I } = kr(g, h, h.position, !0), x = Math.sqrt(Math.pow(w - e.x, 2) + Math.pow(I - e.y, 2));
      x > r || (x < l ? (i = [{ ...h, x: w, y: I }], l = x) : x === l && i.push({ ...h, x: w, y: I }));
    }
  }
  if (!i.length)
    return null;
  if (i.length > 1) {
    const g = s.type === "source" ? "target" : "source";
    return i.find((m) => m.type === g) ?? i[0];
  }
  return i[0];
}
function Tm(e, r, o, s, i, l = !1) {
  var g, m, h;
  const c = s.get(e);
  if (!c)
    return null;
  const u = i === "strict" ? (g = c.internals.handleBounds) == null ? void 0 : g[r] : [...((m = c.internals.handleBounds) == null ? void 0 : m.source) ?? [], ...((h = c.internals.handleBounds) == null ? void 0 : h.target) ?? []], p = (o ? u == null ? void 0 : u.find((w) => w.id === o) : u == null ? void 0 : u[0]) ?? null;
  return p && l ? { ...p, ...kr(c, p, p.position, !0) } : p;
}
function Rm(e, r) {
  return e || (r != null && r.classList.contains("target") ? "target" : r != null && r.classList.contains("source") ? "source" : null);
}
function fb(e, r) {
  let o = null;
  return r ? o = !0 : e && !r && (o = !1), o;
}
const Bm = () => !0;
function pb(e, { connectionMode: r, connectionRadius: o, handleId: s, nodeId: i, edgeUpdaterType: l, isTarget: c, domNode: u, nodeLookup: p, lib: g, autoPanOnConnect: m, flowId: h, panBy: w, cancelConnection: I, onConnectStart: x, onConnect: C, onConnectEnd: b, isValidConnection: N = Bm, onReconnectEnd: k, updateConnection: A, getTransform: S, getFromHandle: P, autoPanSpeed: F, dragThreshold: j = 1, handleDomNode: W }) {
  const D = Im(e.target);
  let Z = 0, H;
  const { x: L, y: ee } = Yt(e), T = Rm(l, W), Y = u == null ? void 0 : u.getBoundingClientRect();
  let O = !1;
  if (!Y || !T)
    return;
  const U = Tm(i, T, s, p, r);
  if (!U)
    return;
  let E = Yt(e, Y), G = !1, K = null, M = !1, V = null;
  function te() {
    if (!m || !Y)
      return;
    const [Ne, Ce] = ym(E, Y, F);
    w({ x: Ne, y: Ce }), Z = requestAnimationFrame(te);
  }
  const re = {
    ...U,
    nodeId: i,
    type: T,
    position: U.position
  }, le = p.get(i);
  let de = {
    inProgress: !0,
    isValid: null,
    from: kr(le, re, Q.Left, !0),
    fromHandle: re,
    fromPosition: re.position,
    fromNode: le,
    to: E,
    toHandle: null,
    toPosition: Bp[re.position],
    toNode: null,
    pointer: E
  };
  function ne() {
    O = !0, A(de), x == null || x(e, { nodeId: i, handleId: s, handleType: T });
  }
  j === 0 && ne();
  function fe(Ne) {
    if (!O) {
      const { x: We, y: Ft } = Yt(Ne), vt = We - L, xt = Ft - ee;
      if (!(vt * vt + xt * xt > j * j))
        return;
      ne();
    }
    if (!P() || !re) {
      be(Ne);
      return;
    }
    const Ce = S();
    E = Yt(Ne, Y), H = db(Ra(E, Ce, !1, [1, 1]), o, p, re), G || (te(), G = !0);
    const xe = Em(Ne, {
      handle: H,
      connectionMode: r,
      fromNodeId: i,
      fromHandleId: s,
      fromType: c ? "target" : "source",
      isValidConnection: N,
      doc: D,
      lib: g,
      flowId: h,
      nodeLookup: p
    });
    V = xe.handleDomNode, K = xe.connection, M = fb(!!H, xe.isValid);
    const Te = p.get(i), Be = Te ? kr(Te, re, Q.Left, !0) : de.from, je = {
      ...de,
      from: Be,
      isValid: M,
      to: xe.toHandle && M ? Ci({ x: xe.toHandle.x, y: xe.toHandle.y }, Ce) : E,
      toHandle: xe.toHandle,
      toPosition: M && xe.toHandle ? xe.toHandle.position : Bp[re.position],
      toNode: xe.toHandle ? p.get(xe.toHandle.nodeId) : null,
      pointer: E
    };
    A(je), de = je;
  }
  function be(Ne) {
    if (!("touches" in Ne && Ne.touches.length > 0)) {
      if (O) {
        (H || V) && K && M && (C == null || C(K));
        const { inProgress: Ce, ...xe } = de, Te = {
          ...xe,
          toPosition: de.toHandle ? de.toPosition : null
        };
        b == null || b(Ne, Te), l && (k == null || k(Ne, Te));
      }
      I(), cancelAnimationFrame(Z), G = !1, M = !1, K = null, V = null, D.removeEventListener("mousemove", fe), D.removeEventListener("mouseup", be), D.removeEventListener("touchmove", fe), D.removeEventListener("touchend", be);
    }
  }
  D.addEventListener("mousemove", fe), D.addEventListener("mouseup", be), D.addEventListener("touchmove", fe), D.addEventListener("touchend", be);
}
function Em(e, { handle: r, connectionMode: o, fromNodeId: s, fromHandleId: i, fromType: l, doc: c, lib: u, flowId: p, isValidConnection: g = Bm, nodeLookup: m }) {
  const h = l === "target", w = r ? c.querySelector(`.${u}-flow__handle[data-id="${p}-${r == null ? void 0 : r.nodeId}-${r == null ? void 0 : r.id}-${r == null ? void 0 : r.type}"]`) : null, { x: I, y: x } = Yt(e), C = c.elementFromPoint(I, x), b = C != null && C.classList.contains(`${u}-flow__handle`) ? C : w, N = {
    handleDomNode: b,
    isValid: !1,
    connection: null,
    toHandle: null
  };
  if (b) {
    const k = Rm(void 0, b), A = b.getAttribute("data-nodeid"), S = b.getAttribute("data-handleid"), P = b.classList.contains("connectable"), F = b.classList.contains("connectableend");
    if (!A || !k)
      return N;
    const j = {
      source: h ? A : s,
      sourceHandle: h ? S : i,
      target: h ? s : A,
      targetHandle: h ? i : S
    };
    N.connection = j;
    const D = P && F && (o === po.Strict ? h && k === "source" || !h && k === "target" : A !== s || S !== i);
    N.isValid = D && g(j), N.toHandle = Tm(A, k, S, m, o, !0);
  }
  return N;
}
const uu = {
  onPointerDown: pb,
  isValid: Em
};
function gb({ domNode: e, panZoom: r, getTransform: o, getViewScale: s }) {
  const i = St(e);
  function l({ translateExtent: u, width: p, height: g, zoomStep: m = 1, pannable: h = !0, zoomable: w = !0, inversePan: I = !1 }) {
    const x = (A) => {
      if (A.sourceEvent.type !== "wheel" || !r)
        return;
      const S = o(), P = A.sourceEvent.ctrlKey && Na() ? 10 : 1, F = -A.sourceEvent.deltaY * (A.sourceEvent.deltaMode === 1 ? 0.05 : A.sourceEvent.deltaMode ? 1 : 2e-3) * m, j = S[2] * Math.pow(2, F * P);
      r.scaleTo(j);
    };
    let C = [0, 0];
    const b = (A) => {
      (A.sourceEvent.type === "mousedown" || A.sourceEvent.type === "touchstart") && (C = [
        A.sourceEvent.clientX ?? A.sourceEvent.touches[0].clientX,
        A.sourceEvent.clientY ?? A.sourceEvent.touches[0].clientY
      ]);
    }, N = (A) => {
      const S = o();
      if (A.sourceEvent.type !== "mousemove" && A.sourceEvent.type !== "touchmove" || !r)
        return;
      const P = [
        A.sourceEvent.clientX ?? A.sourceEvent.touches[0].clientX,
        A.sourceEvent.clientY ?? A.sourceEvent.touches[0].clientY
      ], F = [P[0] - C[0], P[1] - C[1]];
      C = P;
      const j = s() * Math.max(S[2], Math.log(S[2])) * (I ? -1 : 1), W = {
        x: S[0] - F[0] * j,
        y: S[1] - F[1] * j
      }, D = [
        [0, 0],
        [p, g]
      ];
      r.setViewportConstrained({
        x: W.x,
        y: W.y,
        zoom: S[2]
      }, D, u);
    }, k = cm().on("start", b).on("zoom", h ? N : null).on("zoom.wheel", w ? x : null);
    i.call(k, {});
  }
  function c() {
    i.on("zoom", null);
  }
  return {
    update: l,
    destroy: c,
    pointer: Xt
  };
}
const Ri = (e) => ({
  x: e.x,
  y: e.y,
  zoom: e.k
}), zc = ({ x: e, y: r, zoom: o }) => ki.translate(e, r).scale(o), so = (e, r) => e.target.closest(`.${r}`), Dm = (e, r) => r === 2 && Array.isArray(e) && e.includes(2), mb = (e) => ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2, Vc = (e, r = 0, o = mb, s = () => {
}) => {
  const i = typeof r == "number" && r > 0;
  return i || s(), i ? e.transition().duration(r).ease(o).on("end", s) : e;
}, Gm = (e) => {
  const r = e.ctrlKey && Na() ? 10 : 1;
  return -e.deltaY * (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 2e-3) * r;
};
function hb({ zoomPanValues: e, noWheelClassName: r, d3Selection: o, d3Zoom: s, panOnScrollMode: i, panOnScrollSpeed: l, zoomOnPinch: c, onPanZoomStart: u, onPanZoom: p, onPanZoomEnd: g }) {
  return (m) => {
    if (so(m, r))
      return m.ctrlKey && m.preventDefault(), !1;
    m.preventDefault(), m.stopImmediatePropagation();
    const h = o.property("__zoom").k || 1;
    if (m.ctrlKey && c) {
      const b = Xt(m), N = Gm(m), k = h * Math.pow(2, N);
      s.scaleTo(o, k, b, m);
      return;
    }
    const w = m.deltaMode === 1 ? 20 : 1;
    let I = i === Nr.Vertical ? 0 : m.deltaX * w, x = i === Nr.Horizontal ? 0 : m.deltaY * w;
    !Na() && m.shiftKey && i !== Nr.Vertical && (I = m.deltaY * w, x = 0), s.translateBy(
      o,
      -(I / h) * l,
      -(x / h) * l,
      // @ts-ignore
      { internal: !0 }
    );
    const C = Ri(o.property("__zoom"));
    clearTimeout(e.panScrollTimeout), e.isPanScrolling ? (p == null || p(m, C), e.panScrollTimeout = setTimeout(() => {
      g == null || g(m, C), e.isPanScrolling = !1;
    }, 150)) : (e.isPanScrolling = !0, u == null || u(m, C));
  };
}
function yb({ noWheelClassName: e, preventScrolling: r, d3ZoomHandler: o }) {
  return function(s, i) {
    const l = s.type === "wheel", c = !r && l && !s.ctrlKey, u = so(s, e);
    if (s.ctrlKey && l && u && s.preventDefault(), c || u)
      return null;
    s.preventDefault(), o.call(this, s, i);
  };
}
function wb({ zoomPanValues: e, onDraggingChange: r, onPanZoomStart: o }) {
  return (s) => {
    var l, c, u;
    if ((l = s.sourceEvent) != null && l.internal)
      return;
    const i = Ri(s.transform);
    e.mouseButton = ((c = s.sourceEvent) == null ? void 0 : c.button) || 0, e.isZoomingOrPanning = !0, e.prevViewport = i, ((u = s.sourceEvent) == null ? void 0 : u.type) === "mousedown" && r(!0), o && (o == null || o(s.sourceEvent, i));
  };
}
function vb({ zoomPanValues: e, panOnDrag: r, onPaneContextMenu: o, onTransformChange: s, onPanZoom: i }) {
  return (l) => {
    var c, u;
    e.usedRightMouseButton = !!(o && Dm(r, e.mouseButton ?? 0)), (c = l.sourceEvent) != null && c.sync || s([l.transform.x, l.transform.y, l.transform.k]), i && !((u = l.sourceEvent) != null && u.internal) && (i == null || i(l.sourceEvent, Ri(l.transform)));
  };
}
function xb({ zoomPanValues: e, panOnDrag: r, panOnScroll: o, onDraggingChange: s, onPanZoomEnd: i, onPaneContextMenu: l }) {
  return (c) => {
    var u;
    if (!((u = c.sourceEvent) != null && u.internal) && (e.isZoomingOrPanning = !1, l && Dm(r, e.mouseButton ?? 0) && !e.usedRightMouseButton && c.sourceEvent && l(c.sourceEvent), e.usedRightMouseButton = !1, s(!1), i)) {
      const p = Ri(c.transform);
      e.prevViewport = p, clearTimeout(e.timerId), e.timerId = setTimeout(
        () => {
          i == null || i(c.sourceEvent, p);
        },
        // we need a setTimeout for panOnScroll to supress multiple end events fired during scroll
        o ? 150 : 0
      );
    }
  };
}
function Ib({ zoomActivationKeyPressed: e, zoomOnScroll: r, zoomOnPinch: o, panOnDrag: s, panOnScroll: i, zoomOnDoubleClick: l, userSelectionActive: c, noWheelClassName: u, noPanClassName: p, lib: g, connectionInProgress: m }) {
  return (h) => {
    var b;
    const w = e || r, I = o && h.ctrlKey, x = h.type === "wheel";
    if (h.button === 1 && h.type === "mousedown" && (so(h, `${g}-flow__node`) || so(h, `${g}-flow__edge`)))
      return !0;
    if (!s && !w && !i && !l && !o || c || m && !x || so(h, u) && x || so(h, p) && (!x || i && x && !e) || !o && h.ctrlKey && x)
      return !1;
    if (!o && h.type === "touchstart" && ((b = h.touches) == null ? void 0 : b.length) > 1)
      return h.preventDefault(), !1;
    if (!w && !i && !I && x || !s && (h.type === "mousedown" || h.type === "touchstart") || Array.isArray(s) && !s.includes(h.button) && h.type === "mousedown")
      return !1;
    const C = Array.isArray(s) && s.includes(h.button) || !h.button || h.button <= 1;
    return (!h.ctrlKey || x) && C;
  };
}
function Cb({ domNode: e, minZoom: r, maxZoom: o, translateExtent: s, viewport: i, onPanZoom: l, onPanZoomStart: c, onPanZoomEnd: u, onDraggingChange: p }) {
  const g = {
    isZoomingOrPanning: !1,
    usedRightMouseButton: !1,
    prevViewport: {},
    mouseButton: 0,
    timerId: void 0,
    panScrollTimeout: void 0,
    isPanScrolling: !1
  }, m = e.getBoundingClientRect(), h = cm().scaleExtent([r, o]).translateExtent(s), w = St(e).call(h);
  k({
    x: i.x,
    y: i.y,
    zoom: go(i.zoom, r, o)
  }, [
    [0, 0],
    [m.width, m.height]
  ], s);
  const I = w.on("wheel.zoom"), x = w.on("dblclick.zoom");
  h.wheelDelta(Gm);
  function C(H, L) {
    return w ? new Promise((ee) => {
      h == null || h.interpolate((L == null ? void 0 : L.interpolate) === "linear" ? ma : ci).transform(Vc(w, L == null ? void 0 : L.duration, L == null ? void 0 : L.ease, () => ee(!0)), H);
    }) : Promise.resolve(!1);
  }
  function b({ noWheelClassName: H, noPanClassName: L, onPaneContextMenu: ee, userSelectionActive: T, panOnScroll: Y, panOnDrag: O, panOnScrollMode: U, panOnScrollSpeed: E, preventScrolling: G, zoomOnPinch: K, zoomOnScroll: M, zoomOnDoubleClick: V, zoomActivationKeyPressed: te, lib: re, onTransformChange: le, connectionInProgress: ue, paneClickDistance: de, selectionOnDrag: ne }) {
    T && !g.isZoomingOrPanning && N();
    const fe = Y && !te && !T;
    h.clickDistance(ne ? 1 / 0 : !Zt(de) || de < 0 ? 0 : de);
    const be = fe ? hb({
      zoomPanValues: g,
      noWheelClassName: H,
      d3Selection: w,
      d3Zoom: h,
      panOnScrollMode: U,
      panOnScrollSpeed: E,
      zoomOnPinch: K,
      onPanZoomStart: c,
      onPanZoom: l,
      onPanZoomEnd: u
    }) : yb({
      noWheelClassName: H,
      preventScrolling: G,
      d3ZoomHandler: I
    });
    if (w.on("wheel.zoom", be, { passive: !1 }), !T) {
      const Ce = wb({
        zoomPanValues: g,
        onDraggingChange: p,
        onPanZoomStart: c
      });
      h.on("start", Ce);
      const xe = vb({
        zoomPanValues: g,
        panOnDrag: O,
        onPaneContextMenu: !!ee,
        onPanZoom: l,
        onTransformChange: le
      });
      h.on("zoom", xe);
      const Te = xb({
        zoomPanValues: g,
        panOnDrag: O,
        panOnScroll: Y,
        onPaneContextMenu: ee,
        onPanZoomEnd: u,
        onDraggingChange: p
      });
      h.on("end", Te);
    }
    const Ne = Ib({
      zoomActivationKeyPressed: te,
      panOnDrag: O,
      zoomOnScroll: M,
      panOnScroll: Y,
      zoomOnDoubleClick: V,
      zoomOnPinch: K,
      userSelectionActive: T,
      noPanClassName: L,
      noWheelClassName: H,
      lib: re,
      connectionInProgress: ue
    });
    h.filter(Ne), V ? w.on("dblclick.zoom", x) : w.on("dblclick.zoom", null);
  }
  function N() {
    h.on("zoom", null);
  }
  async function k(H, L, ee) {
    const T = zc(H), Y = h == null ? void 0 : h.constrain()(T, L, ee);
    return Y && await C(Y), new Promise((O) => O(Y));
  }
  async function A(H, L) {
    const ee = zc(H);
    return await C(ee, L), new Promise((T) => T(ee));
  }
  function S(H) {
    if (w) {
      const L = zc(H), ee = w.property("__zoom");
      (ee.k !== H.zoom || ee.x !== H.x || ee.y !== H.y) && (h == null || h.transform(w, L, null, { sync: !0 }));
    }
  }
  function P() {
    const H = w ? lm(w.node()) : { x: 0, y: 0, k: 1 };
    return { x: H.x, y: H.y, zoom: H.k };
  }
  function F(H, L) {
    return w ? new Promise((ee) => {
      h == null || h.interpolate((L == null ? void 0 : L.interpolate) === "linear" ? ma : ci).scaleTo(Vc(w, L == null ? void 0 : L.duration, L == null ? void 0 : L.ease, () => ee(!0)), H);
    }) : Promise.resolve(!1);
  }
  function j(H, L) {
    return w ? new Promise((ee) => {
      h == null || h.interpolate((L == null ? void 0 : L.interpolate) === "linear" ? ma : ci).scaleBy(Vc(w, L == null ? void 0 : L.duration, L == null ? void 0 : L.ease, () => ee(!0)), H);
    }) : Promise.resolve(!1);
  }
  function W(H) {
    h == null || h.scaleExtent(H);
  }
  function D(H) {
    h == null || h.translateExtent(H);
  }
  function Z(H) {
    const L = !Zt(H) || H < 0 ? 0 : H;
    h == null || h.clickDistance(L);
  }
  return {
    update: b,
    destroy: N,
    setViewport: A,
    setViewportConstrained: k,
    getViewport: P,
    scaleTo: F,
    scaleBy: j,
    setScaleExtent: W,
    setTranslateExtent: D,
    syncViewport: S,
    setClickDistance: Z
  };
}
var yo;
(function(e) {
  e.Line = "line", e.Handle = "handle";
})(yo || (yo = {}));
function bb({ width: e, prevWidth: r, height: o, prevHeight: s, affectsX: i, affectsY: l }) {
  const c = e - r, u = o - s, p = [c > 0 ? 1 : c < 0 ? -1 : 0, u > 0 ? 1 : u < 0 ? -1 : 0];
  return c && i && (p[0] = p[0] * -1), u && l && (p[1] = p[1] * -1), p;
}
function Kp(e) {
  const r = e.includes("right") || e.includes("left"), o = e.includes("bottom") || e.includes("top"), s = e.includes("left"), i = e.includes("top");
  return {
    isHorizontal: r,
    isVertical: o,
    affectsX: s,
    affectsY: i
  };
}
function $n(e, r) {
  return Math.max(0, r - e);
}
function Qn(e, r) {
  return Math.max(0, e - r);
}
function oi(e, r, o) {
  return Math.max(0, r - e, e - o);
}
function Zp(e, r) {
  return e ? !r : r;
}
function Nb(e, r, o, s, i, l, c, u) {
  let { affectsX: p, affectsY: g } = r;
  const { isHorizontal: m, isVertical: h } = r, w = m && h, { xSnapped: I, ySnapped: x } = o, { minWidth: C, maxWidth: b, minHeight: N, maxHeight: k } = s, { x: A, y: S, width: P, height: F, aspectRatio: j } = e;
  let W = Math.floor(m ? I - e.pointerX : 0), D = Math.floor(h ? x - e.pointerY : 0);
  const Z = P + (p ? -W : W), H = F + (g ? -D : D), L = -l[0] * P, ee = -l[1] * F;
  let T = oi(Z, C, b), Y = oi(H, N, k);
  if (c) {
    let E = 0, G = 0;
    p && W < 0 ? E = $n(A + W + L, c[0][0]) : !p && W > 0 && (E = Qn(A + Z + L, c[1][0])), g && D < 0 ? G = $n(S + D + ee, c[0][1]) : !g && D > 0 && (G = Qn(S + H + ee, c[1][1])), T = Math.max(T, E), Y = Math.max(Y, G);
  }
  if (u) {
    let E = 0, G = 0;
    p && W > 0 ? E = Qn(A + W, u[0][0]) : !p && W < 0 && (E = $n(A + Z, u[1][0])), g && D > 0 ? G = Qn(S + D, u[0][1]) : !g && D < 0 && (G = $n(S + H, u[1][1])), T = Math.max(T, E), Y = Math.max(Y, G);
  }
  if (i) {
    if (m) {
      const E = oi(Z / j, N, k) * j;
      if (T = Math.max(T, E), c) {
        let G = 0;
        !p && !g || p && !g && w ? G = Qn(S + ee + Z / j, c[1][1]) * j : G = $n(S + ee + (p ? W : -W) / j, c[0][1]) * j, T = Math.max(T, G);
      }
      if (u) {
        let G = 0;
        !p && !g || p && !g && w ? G = $n(S + Z / j, u[1][1]) * j : G = Qn(S + (p ? W : -W) / j, u[0][1]) * j, T = Math.max(T, G);
      }
    }
    if (h) {
      const E = oi(H * j, C, b) / j;
      if (Y = Math.max(Y, E), c) {
        let G = 0;
        !p && !g || g && !p && w ? G = Qn(A + H * j + L, c[1][0]) / j : G = $n(A + (g ? D : -D) * j + L, c[0][0]) / j, Y = Math.max(Y, G);
      }
      if (u) {
        let G = 0;
        !p && !g || g && !p && w ? G = $n(A + H * j, u[1][0]) / j : G = Qn(A + (g ? D : -D) * j, u[0][0]) / j, Y = Math.max(Y, G);
      }
    }
  }
  D = D + (D < 0 ? Y : -Y), W = W + (W < 0 ? T : -T), i && (w ? Z > H * j ? D = (Zp(p, g) ? -W : W) / j : W = (Zp(p, g) ? -D : D) * j : m ? (D = W / j, g = p) : (W = D * j, p = g));
  const O = p ? A + W : A, U = g ? S + D : S;
  return {
    width: P + (p ? -W : W),
    height: F + (g ? -D : D),
    x: l[0] * W * (p ? -1 : 1) + O,
    y: l[1] * D * (g ? -1 : 1) + U
  };
}
const Fm = { width: 0, height: 0, x: 0, y: 0 }, _b = {
  ...Fm,
  pointerX: 0,
  pointerY: 0,
  aspectRatio: 1
};
function Ab(e) {
  return [
    [0, 0],
    [e.measured.width, e.measured.height]
  ];
}
function Sb(e, r, o) {
  const s = r.position.x + e.position.x, i = r.position.y + e.position.y, l = e.measured.width ?? 0, c = e.measured.height ?? 0, u = o[0] * l, p = o[1] * c;
  return [
    [s - u, i - p],
    [s + l - u, i + c - p]
  ];
}
function kb({ domNode: e, nodeId: r, getStoreItems: o, onChange: s, onEnd: i }) {
  const l = St(e);
  let c = {
    controlDirection: Kp("bottom-right"),
    boundaries: {
      minWidth: 0,
      minHeight: 0,
      maxWidth: Number.MAX_VALUE,
      maxHeight: Number.MAX_VALUE
    },
    resizeDirection: void 0,
    keepAspectRatio: !1
  };
  function u({ controlPosition: g, boundaries: m, keepAspectRatio: h, resizeDirection: w, onResizeStart: I, onResize: x, onResizeEnd: C, shouldResize: b }) {
    let N = { ...Fm }, k = { ..._b };
    c = {
      boundaries: m,
      resizeDirection: w,
      keepAspectRatio: h,
      controlDirection: Kp(g)
    };
    let A, S = null, P = [], F, j, W, D = !1;
    const Z = Yg().on("start", (H) => {
      const { nodeLookup: L, transform: ee, snapGrid: T, snapToGrid: Y, nodeOrigin: O, paneDomNode: U } = o();
      if (A = L.get(r), !A)
        return;
      S = (U == null ? void 0 : U.getBoundingClientRect()) ?? null;
      const { xSnapped: E, ySnapped: G } = ha(H.sourceEvent, {
        transform: ee,
        snapGrid: T,
        snapToGrid: Y,
        containerBounds: S
      });
      N = {
        width: A.measured.width ?? 0,
        height: A.measured.height ?? 0,
        x: A.position.x ?? 0,
        y: A.position.y ?? 0
      }, k = {
        ...N,
        pointerX: E,
        pointerY: G,
        aspectRatio: N.width / N.height
      }, F = void 0, A.parentId && (A.extent === "parent" || A.expandParent) && (F = L.get(A.parentId), j = F && A.extent === "parent" ? Ab(F) : void 0), P = [], W = void 0;
      for (const [K, M] of L)
        if (M.parentId === r && (P.push({
          id: K,
          position: { ...M.position },
          extent: M.extent
        }), M.extent === "parent" || M.expandParent)) {
          const V = Sb(M, A, M.origin ?? O);
          W ? W = [
            [Math.min(V[0][0], W[0][0]), Math.min(V[0][1], W[0][1])],
            [Math.max(V[1][0], W[1][0]), Math.max(V[1][1], W[1][1])]
          ] : W = V;
        }
      I == null || I(H, { ...N });
    }).on("drag", (H) => {
      const { transform: L, snapGrid: ee, snapToGrid: T, nodeOrigin: Y } = o(), O = ha(H.sourceEvent, {
        transform: L,
        snapGrid: ee,
        snapToGrid: T,
        containerBounds: S
      }), U = [];
      if (!A)
        return;
      const { x: E, y: G, width: K, height: M } = N, V = {}, te = A.origin ?? Y, { width: re, height: le, x: ue, y: de } = Nb(k, c.controlDirection, O, c.boundaries, c.keepAspectRatio, te, j, W), ne = re !== K, fe = le !== M, be = ue !== E && ne, Ne = de !== G && fe;
      if (!be && !Ne && !ne && !fe)
        return;
      if ((be || Ne || te[0] === 1 || te[1] === 1) && (V.x = be ? ue : N.x, V.y = Ne ? de : N.y, N.x = V.x, N.y = V.y, P.length > 0)) {
        const Be = ue - E, je = de - G;
        for (const We of P)
          We.position = {
            x: We.position.x - Be + te[0] * (re - K),
            y: We.position.y - je + te[1] * (le - M)
          }, U.push(We);
      }
      if ((ne || fe) && (V.width = ne && (!c.resizeDirection || c.resizeDirection === "horizontal") ? re : N.width, V.height = fe && (!c.resizeDirection || c.resizeDirection === "vertical") ? le : N.height, N.width = V.width, N.height = V.height), F && A.expandParent) {
        const Be = te[0] * (V.width ?? 0);
        V.x && V.x < Be && (N.x = Be, k.x = k.x - (V.x - Be));
        const je = te[1] * (V.height ?? 0);
        V.y && V.y < je && (N.y = je, k.y = k.y - (V.y - je));
      }
      const Ce = bb({
        width: N.width,
        prevWidth: K,
        height: N.height,
        prevHeight: M,
        affectsX: c.controlDirection.affectsX,
        affectsY: c.controlDirection.affectsY
      }), xe = { ...N, direction: Ce };
      (b == null ? void 0 : b(H, xe)) !== !1 && (D = !0, x == null || x(H, xe), s(V, U));
    }).on("end", (H) => {
      D && (C == null || C(H, { ...N }), i == null || i({ ...N }), D = !1);
    });
    l.call(Z);
  }
  function p() {
    l.on(".drag", null);
  }
  return {
    update: u,
    destroy: p
  };
}
var Oc = { exports: {} }, Hc = {}, Wc = { exports: {} }, Xc = {};
/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Yp;
function jb() {
  if (Yp) return Xc;
  Yp = 1;
  var e = Aa();
  function r(h, w) {
    return h === w && (h !== 0 || 1 / h === 1 / w) || h !== h && w !== w;
  }
  var o = typeof Object.is == "function" ? Object.is : r, s = e.useState, i = e.useEffect, l = e.useLayoutEffect, c = e.useDebugValue;
  function u(h, w) {
    var I = w(), x = s({ inst: { value: I, getSnapshot: w } }), C = x[0].inst, b = x[1];
    return l(
      function() {
        C.value = I, C.getSnapshot = w, p(C) && b({ inst: C });
      },
      [h, I, w]
    ), i(
      function() {
        return p(C) && b({ inst: C }), h(function() {
          p(C) && b({ inst: C });
        });
      },
      [h]
    ), c(I), I;
  }
  function p(h) {
    var w = h.getSnapshot;
    h = h.value;
    try {
      var I = w();
      return !o(h, I);
    } catch {
      return !0;
    }
  }
  function g(h, w) {
    return w();
  }
  var m = typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u" ? g : u;
  return Xc.useSyncExternalStore = e.useSyncExternalStore !== void 0 ? e.useSyncExternalStore : m, Xc;
}
var Up;
function Mb() {
  return Up || (Up = 1, Wc.exports = jb()), Wc.exports;
}
/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var $p;
function Tb() {
  if ($p) return Hc;
  $p = 1;
  var e = Aa(), r = Mb();
  function o(g, m) {
    return g === m && (g !== 0 || 1 / g === 1 / m) || g !== g && m !== m;
  }
  var s = typeof Object.is == "function" ? Object.is : o, i = r.useSyncExternalStore, l = e.useRef, c = e.useEffect, u = e.useMemo, p = e.useDebugValue;
  return Hc.useSyncExternalStoreWithSelector = function(g, m, h, w, I) {
    var x = l(null);
    if (x.current === null) {
      var C = { hasValue: !1, value: null };
      x.current = C;
    } else C = x.current;
    x = u(
      function() {
        function N(F) {
          if (!k) {
            if (k = !0, A = F, F = w(F), I !== void 0 && C.hasValue) {
              var j = C.value;
              if (I(j, F))
                return S = j;
            }
            return S = F;
          }
          if (j = S, s(A, F)) return j;
          var W = w(F);
          return I !== void 0 && I(j, W) ? (A = F, j) : (A = F, S = W);
        }
        var k = !1, A, S, P = h === void 0 ? null : h;
        return [
          function() {
            return N(m());
          },
          P === null ? void 0 : function() {
            return N(P());
          }
        ];
      },
      [m, h, w, I]
    );
    var b = i(g, x[0], x[1]);
    return c(
      function() {
        C.hasValue = !0, C.value = b;
      },
      [b]
    ), p(b), b;
  }, Hc;
}
var Qp;
function Rb() {
  return Qp || (Qp = 1, Oc.exports = Tb()), Oc.exports;
}
var Bb = Rb();
const Eb = /* @__PURE__ */ mu(Bb), Db = {}, Jp = (e) => {
  let r;
  const o = /* @__PURE__ */ new Set(), s = (m, h) => {
    const w = typeof m == "function" ? m(r) : m;
    if (!Object.is(w, r)) {
      const I = r;
      r = h ?? (typeof w != "object" || w === null) ? w : Object.assign({}, r, w), o.forEach((x) => x(r, I));
    }
  }, i = () => r, p = { setState: s, getState: i, getInitialState: () => g, subscribe: (m) => (o.add(m), () => o.delete(m)), destroy: () => {
    (Db ? "production" : void 0) !== "production" && console.warn(
      "[DEPRECATED] The `destroy` method will be unsupported in a future version. Instead use unsubscribe function returned by subscribe. Everything will be garbage-collected if store is garbage-collected."
    ), o.clear();
  } }, g = r = e(s, i, p);
  return p;
}, Gb = (e) => e ? Jp(e) : Jp, { useDebugValue: Fb } = bn, { useSyncExternalStoreWithSelector: Pb } = Eb, zb = (e) => e;
function Pm(e, r = zb, o) {
  const s = Pb(
    e.subscribe,
    e.getState,
    e.getServerState || e.getInitialState,
    r,
    o
  );
  return Fb(s), s;
}
const qp = (e, r) => {
  const o = Gb(e), s = (i, l = r) => Pm(o, i, l);
  return Object.assign(s, o), s;
}, Vb = (e, r) => e ? qp(e, r) : qp;
function Oe(e, r) {
  if (Object.is(e, r))
    return !0;
  if (typeof e != "object" || e === null || typeof r != "object" || r === null)
    return !1;
  if (e instanceof Map && r instanceof Map) {
    if (e.size !== r.size) return !1;
    for (const [s, i] of e)
      if (!Object.is(i, r.get(s)))
        return !1;
    return !0;
  }
  if (e instanceof Set && r instanceof Set) {
    if (e.size !== r.size) return !1;
    for (const s of e)
      if (!r.has(s))
        return !1;
    return !0;
  }
  const o = Object.keys(e);
  if (o.length !== Object.keys(r).length)
    return !1;
  for (const s of o)
    if (!Object.prototype.hasOwnProperty.call(r, s) || !Object.is(e[s], r[s]))
      return !1;
  return !0;
}
var Ob = Rg();
const Bi = R.createContext(null), Hb = Bi.Provider, zm = sn.error001();
function Re(e, r) {
  const o = R.useContext(Bi);
  if (o === null)
    throw new Error(zm);
  return Pm(o, e, r);
}
function He() {
  const e = R.useContext(Bi);
  if (e === null)
    throw new Error(zm);
  return R.useMemo(() => ({
    getState: e.getState,
    setState: e.setState,
    subscribe: e.subscribe
  }), [e]);
}
const eg = { display: "none" }, Wb = {
  position: "absolute",
  width: 1,
  height: 1,
  margin: -1,
  border: 0,
  padding: 0,
  overflow: "hidden",
  clip: "rect(0px, 0px, 0px, 0px)",
  clipPath: "inset(100%)"
}, Vm = "react-flow__node-desc", Om = "react-flow__edge-desc", Xb = "react-flow__aria-live", Lb = (e) => e.ariaLiveMessage, Kb = (e) => e.ariaLabelConfig;
function Zb({ rfId: e }) {
  const r = Re(Lb);
  return f.jsx("div", { id: `${Xb}-${e}`, "aria-live": "assertive", "aria-atomic": "true", style: Wb, children: r });
}
function Yb({ rfId: e, disableKeyboardA11y: r }) {
  const o = Re(Kb);
  return f.jsxs(f.Fragment, { children: [f.jsx("div", { id: `${Vm}-${e}`, style: eg, children: r ? o["node.a11yDescription.default"] : o["node.a11yDescription.keyboardDisabled"] }), f.jsx("div", { id: `${Om}-${e}`, style: eg, children: o["edge.a11yDescription.default"] }), !r && f.jsx(Zb, { rfId: e })] });
}
const Cn = R.forwardRef(({ position: e = "top-left", children: r, className: o, style: s, ...i }, l) => {
  const c = `${e}`.split("-");
  return f.jsx("div", { className: $e(["react-flow__panel", o, ...c]), style: s, ref: l, ...i, children: r });
});
Cn.displayName = "Panel";
function Ub({ proOptions: e, position: r = "bottom-right" }) {
  return e != null && e.hideAttribution ? null : f.jsx(Cn, { position: r, className: "react-flow__attribution", "data-message": "Please only hide this attribution when you are subscribed to React Flow Pro: https://pro.reactflow.dev", children: f.jsx("a", { href: "https://reactflow.dev", target: "_blank", rel: "noopener noreferrer", "aria-label": "React Flow attribution", children: "React Flow" }) });
}
const $b = (e) => {
  const r = [], o = [];
  for (const [, s] of e.nodeLookup)
    s.selected && r.push(s.internals.userNode);
  for (const [, s] of e.edgeLookup)
    s.selected && o.push(s);
  return { selectedNodes: r, selectedEdges: o };
}, ai = (e) => e.id;
function Qb(e, r) {
  return Oe(e.selectedNodes.map(ai), r.selectedNodes.map(ai)) && Oe(e.selectedEdges.map(ai), r.selectedEdges.map(ai));
}
function Jb({ onSelectionChange: e }) {
  const r = He(), { selectedNodes: o, selectedEdges: s } = Re($b, Qb);
  return R.useEffect(() => {
    const i = { nodes: o, edges: s };
    e == null || e(i), r.getState().onSelectionChangeHandlers.forEach((l) => l(i));
  }, [o, s, e]), null;
}
const qb = (e) => !!e.onSelectionChangeHandlers;
function eN({ onSelectionChange: e }) {
  const r = Re(qb);
  return e || r ? f.jsx(Jb, { onSelectionChange: e }) : null;
}
const Hm = [0, 0], tN = { x: 0, y: 0, zoom: 1 }, nN = [
  "nodes",
  "edges",
  "defaultNodes",
  "defaultEdges",
  "onConnect",
  "onConnectStart",
  "onConnectEnd",
  "onClickConnectStart",
  "onClickConnectEnd",
  "nodesDraggable",
  "autoPanOnNodeFocus",
  "nodesConnectable",
  "nodesFocusable",
  "edgesFocusable",
  "edgesReconnectable",
  "elevateNodesOnSelect",
  "elevateEdgesOnSelect",
  "minZoom",
  "maxZoom",
  "nodeExtent",
  "onNodesChange",
  "onEdgesChange",
  "elementsSelectable",
  "connectionMode",
  "snapGrid",
  "snapToGrid",
  "translateExtent",
  "connectOnClick",
  "defaultEdgeOptions",
  "fitView",
  "fitViewOptions",
  "onNodesDelete",
  "onEdgesDelete",
  "onDelete",
  "onNodeDrag",
  "onNodeDragStart",
  "onNodeDragStop",
  "onSelectionDrag",
  "onSelectionDragStart",
  "onSelectionDragStop",
  "onMoveStart",
  "onMove",
  "onMoveEnd",
  "noPanClassName",
  "nodeOrigin",
  "autoPanOnConnect",
  "autoPanOnNodeDrag",
  "onError",
  "connectionRadius",
  "isValidConnection",
  "selectNodesOnDrag",
  "nodeDragThreshold",
  "connectionDragThreshold",
  "onBeforeDelete",
  "debug",
  "autoPanSpeed",
  "ariaLabelConfig",
  "zIndexMode"
], tg = [...nN, "rfId"], rN = (e) => ({
  setNodes: e.setNodes,
  setEdges: e.setEdges,
  setMinZoom: e.setMinZoom,
  setMaxZoom: e.setMaxZoom,
  setTranslateExtent: e.setTranslateExtent,
  setNodeExtent: e.setNodeExtent,
  reset: e.reset,
  setDefaultNodesAndEdges: e.setDefaultNodesAndEdges
}), ng = {
  /*
   * these are values that are also passed directly to other components
   * than the StoreUpdater. We can reduce the number of setStore calls
   * by setting the same values here as prev fields.
   */
  translateExtent: Ia,
  nodeOrigin: Hm,
  minZoom: 0.5,
  maxZoom: 2,
  elementsSelectable: !0,
  noPanClassName: "nopan",
  rfId: "1"
};
function oN(e) {
  const { setNodes: r, setEdges: o, setMinZoom: s, setMaxZoom: i, setTranslateExtent: l, setNodeExtent: c, reset: u, setDefaultNodesAndEdges: p } = Re(rN, Oe), g = He();
  R.useEffect(() => (p(e.defaultNodes, e.defaultEdges), () => {
    m.current = ng, u();
  }), []);
  const m = R.useRef(ng);
  return R.useEffect(
    () => {
      for (const h of tg) {
        const w = e[h], I = m.current[h];
        w !== I && (typeof e[h] > "u" || (h === "nodes" ? r(w) : h === "edges" ? o(w) : h === "minZoom" ? s(w) : h === "maxZoom" ? i(w) : h === "translateExtent" ? l(w) : h === "nodeExtent" ? c(w) : h === "ariaLabelConfig" ? g.setState({ ariaLabelConfig: VC(w) }) : h === "fitView" ? g.setState({ fitViewQueued: w }) : h === "fitViewOptions" ? g.setState({ fitViewOptions: w }) : g.setState({ [h]: w })));
      }
      m.current = e;
    },
    // Only re-run the effect if one of the fields we track changes
    tg.map((h) => e[h])
  ), null;
}
function rg() {
  return typeof window > "u" || !window.matchMedia ? null : window.matchMedia("(prefers-color-scheme: dark)");
}
function aN(e) {
  var s;
  const [r, o] = R.useState(e === "system" ? null : e);
  return R.useEffect(() => {
    if (e !== "system") {
      o(e);
      return;
    }
    const i = rg(), l = () => o(i != null && i.matches ? "dark" : "light");
    return l(), i == null || i.addEventListener("change", l), () => {
      i == null || i.removeEventListener("change", l);
    };
  }, [e]), r !== null ? r : (s = rg()) != null && s.matches ? "dark" : "light";
}
const og = typeof document < "u" ? document : null;
function _a(e = null, r = { target: og, actInsideInputWithModifier: !0 }) {
  const [o, s] = R.useState(!1), i = R.useRef(!1), l = R.useRef(/* @__PURE__ */ new Set([])), [c, u] = R.useMemo(() => {
    if (e !== null) {
      const g = (Array.isArray(e) ? e : [e]).filter((h) => typeof h == "string").map((h) => h.replace("+", `
`).replace(`

`, `
+`).split(`
`)), m = g.reduce((h, w) => h.concat(...w), []);
      return [g, m];
    }
    return [[], []];
  }, [e]);
  return R.useEffect(() => {
    const p = (r == null ? void 0 : r.target) ?? og, g = (r == null ? void 0 : r.actInsideInputWithModifier) ?? !0;
    if (e !== null) {
      const m = (I) => {
        var b, N;
        if (i.current = I.ctrlKey || I.metaKey || I.shiftKey || I.altKey, (!i.current || i.current && !g) && Cm(I))
          return !1;
        const C = sg(I.code, u);
        if (l.current.add(I[C]), ag(c, l.current, !1)) {
          const k = ((N = (b = I.composedPath) == null ? void 0 : b.call(I)) == null ? void 0 : N[0]) || I.target, A = (k == null ? void 0 : k.nodeName) === "BUTTON" || (k == null ? void 0 : k.nodeName) === "A";
          r.preventDefault !== !1 && (i.current || !A) && I.preventDefault(), s(!0);
        }
      }, h = (I) => {
        const x = sg(I.code, u);
        ag(c, l.current, !0) ? (s(!1), l.current.clear()) : l.current.delete(I[x]), I.key === "Meta" && l.current.clear(), i.current = !1;
      }, w = () => {
        l.current.clear(), s(!1);
      };
      return p == null || p.addEventListener("keydown", m), p == null || p.addEventListener("keyup", h), window.addEventListener("blur", w), window.addEventListener("contextmenu", w), () => {
        p == null || p.removeEventListener("keydown", m), p == null || p.removeEventListener("keyup", h), window.removeEventListener("blur", w), window.removeEventListener("contextmenu", w);
      };
    }
  }, [e, s]), o;
}
function ag(e, r, o) {
  return e.filter((s) => o || s.length === r.size).some((s) => s.every((i) => r.has(i)));
}
function sg(e, r) {
  return r.includes(e) ? "code" : "key";
}
const sN = () => {
  const e = He();
  return R.useMemo(() => ({
    zoomIn: (r) => {
      const { panZoom: o } = e.getState();
      return o ? o.scaleBy(1.2, { duration: r == null ? void 0 : r.duration }) : Promise.resolve(!1);
    },
    zoomOut: (r) => {
      const { panZoom: o } = e.getState();
      return o ? o.scaleBy(1 / 1.2, { duration: r == null ? void 0 : r.duration }) : Promise.resolve(!1);
    },
    zoomTo: (r, o) => {
      const { panZoom: s } = e.getState();
      return s ? s.scaleTo(r, { duration: o == null ? void 0 : o.duration }) : Promise.resolve(!1);
    },
    getZoom: () => e.getState().transform[2],
    setViewport: async (r, o) => {
      const { transform: [s, i, l], panZoom: c } = e.getState();
      return c ? (await c.setViewport({
        x: r.x ?? s,
        y: r.y ?? i,
        zoom: r.zoom ?? l
      }, o), Promise.resolve(!0)) : Promise.resolve(!1);
    },
    getViewport: () => {
      const [r, o, s] = e.getState().transform;
      return { x: r, y: o, zoom: s };
    },
    setCenter: async (r, o, s) => e.getState().setCenter(r, o, s),
    fitBounds: async (r, o) => {
      const { width: s, height: i, minZoom: l, maxZoom: c, panZoom: u } = e.getState(), p = _u(r, s, i, l, c, (o == null ? void 0 : o.padding) ?? 0.1);
      return u ? (await u.setViewport(p, {
        duration: o == null ? void 0 : o.duration,
        ease: o == null ? void 0 : o.ease,
        interpolate: o == null ? void 0 : o.interpolate
      }), Promise.resolve(!0)) : Promise.resolve(!1);
    },
    screenToFlowPosition: (r, o = {}) => {
      const { transform: s, snapGrid: i, snapToGrid: l, domNode: c } = e.getState();
      if (!c)
        return r;
      const { x: u, y: p } = c.getBoundingClientRect(), g = {
        x: r.x - u,
        y: r.y - p
      }, m = o.snapGrid ?? i, h = o.snapToGrid ?? l;
      return Ra(g, s, h, m);
    },
    flowToScreenPosition: (r) => {
      const { transform: o, domNode: s } = e.getState();
      if (!s)
        return r;
      const { x: i, y: l } = s.getBoundingClientRect(), c = Ci(r, o);
      return {
        x: c.x + i,
        y: c.y + l
      };
    }
  }), []);
};
function Wm(e, r) {
  const o = [], s = /* @__PURE__ */ new Map(), i = [];
  for (const l of e)
    if (l.type === "add") {
      i.push(l);
      continue;
    } else if (l.type === "remove" || l.type === "replace")
      s.set(l.id, [l]);
    else {
      const c = s.get(l.id);
      c ? c.push(l) : s.set(l.id, [l]);
    }
  for (const l of r) {
    const c = s.get(l.id);
    if (!c) {
      o.push(l);
      continue;
    }
    if (c[0].type === "remove")
      continue;
    if (c[0].type === "replace") {
      o.push({ ...c[0].item });
      continue;
    }
    const u = { ...l };
    for (const p of c)
      iN(p, u);
    o.push(u);
  }
  return i.length && i.forEach((l) => {
    l.index !== void 0 ? o.splice(l.index, 0, { ...l.item }) : o.push({ ...l.item });
  }), o;
}
function iN(e, r) {
  switch (e.type) {
    case "select": {
      r.selected = e.selected;
      break;
    }
    case "position": {
      typeof e.position < "u" && (r.position = e.position), typeof e.dragging < "u" && (r.dragging = e.dragging);
      break;
    }
    case "dimensions": {
      typeof e.dimensions < "u" && (r.measured = {
        ...e.dimensions
      }, e.setAttributes && ((e.setAttributes === !0 || e.setAttributes === "width") && (r.width = e.dimensions.width), (e.setAttributes === !0 || e.setAttributes === "height") && (r.height = e.dimensions.height))), typeof e.resizing == "boolean" && (r.resizing = e.resizing);
      break;
    }
  }
}
function Ru(e, r) {
  return Wm(e, r);
}
function Bu(e, r) {
  return Wm(e, r);
}
function Ir(e, r) {
  return {
    id: e,
    type: "select",
    selected: r
  };
}
function io(e, r = /* @__PURE__ */ new Set(), o = !1) {
  const s = [];
  for (const [i, l] of e) {
    const c = r.has(i);
    !(l.selected === void 0 && !c) && l.selected !== c && (o && (l.selected = c), s.push(Ir(l.id, c)));
  }
  return s;
}
function ig({ items: e = [], lookup: r }) {
  var i;
  const o = [], s = new Map(e.map((l) => [l.id, l]));
  for (const [l, c] of e.entries()) {
    const u = r.get(c.id), p = ((i = u == null ? void 0 : u.internals) == null ? void 0 : i.userNode) ?? u;
    p !== void 0 && p !== c && o.push({ id: c.id, item: c, type: "replace" }), p === void 0 && o.push({ item: c, type: "add", index: l });
  }
  for (const [l] of r)
    s.get(l) === void 0 && o.push({ id: l, type: "remove" });
  return o;
}
function lg(e) {
  return {
    id: e.id,
    type: "remove"
  };
}
const cg = (e) => MC(e), lN = (e) => gm(e);
function Xm(e) {
  return R.forwardRef(e);
}
const cN = typeof window < "u" ? R.useLayoutEffect : R.useEffect;
function ug(e) {
  const [r, o] = R.useState(BigInt(0)), [s] = R.useState(() => uN(() => o((i) => i + BigInt(1))));
  return cN(() => {
    const i = s.get();
    i.length && (e(i), s.reset());
  }, [r]), s;
}
function uN(e) {
  let r = [];
  return {
    get: () => r,
    reset: () => {
      r = [];
    },
    push: (o) => {
      r.push(o), e();
    }
  };
}
const Lm = R.createContext(null);
function dN({ children: e }) {
  const r = He(), o = R.useCallback((u) => {
    const { nodes: p = [], setNodes: g, hasDefaultNodes: m, onNodesChange: h, nodeLookup: w, fitViewQueued: I, onNodesChangeMiddlewareMap: x } = r.getState();
    let C = p;
    for (const N of u)
      C = typeof N == "function" ? N(C) : N;
    let b = ig({
      items: C,
      lookup: w
    });
    for (const N of x.values())
      b = N(b);
    m && g(C), b.length > 0 ? h == null || h(b) : I && window.requestAnimationFrame(() => {
      const { fitViewQueued: N, nodes: k, setNodes: A } = r.getState();
      N && A(k);
    });
  }, []), s = ug(o), i = R.useCallback((u) => {
    const { edges: p = [], setEdges: g, hasDefaultEdges: m, onEdgesChange: h, edgeLookup: w } = r.getState();
    let I = p;
    for (const x of u)
      I = typeof x == "function" ? x(I) : x;
    m ? g(I) : h && h(ig({
      items: I,
      lookup: w
    }));
  }, []), l = ug(i), c = R.useMemo(() => ({ nodeQueue: s, edgeQueue: l }), []);
  return f.jsx(Lm.Provider, { value: c, children: e });
}
function fN() {
  const e = R.useContext(Lm);
  if (!e)
    throw new Error("useBatchContext must be used within a BatchProvider");
  return e;
}
const pN = (e) => !!e.panZoom;
function Eu() {
  const e = sN(), r = He(), o = fN(), s = Re(pN), i = R.useMemo(() => {
    const l = (h) => r.getState().nodeLookup.get(h), c = (h) => {
      o.nodeQueue.push(h);
    }, u = (h) => {
      o.edgeQueue.push(h);
    }, p = (h) => {
      var N, k;
      const { nodeLookup: w, nodeOrigin: I } = r.getState(), x = cg(h) ? h : w.get(h.id), C = x.parentId ? xm(x.position, x.measured, x.parentId, w, I) : x.position, b = {
        ...x,
        position: C,
        width: ((N = x.measured) == null ? void 0 : N.width) ?? x.width,
        height: ((k = x.measured) == null ? void 0 : k.height) ?? x.height
      };
      return mo(b);
    }, g = (h, w, I = { replace: !1 }) => {
      c((x) => x.map((C) => {
        if (C.id === h) {
          const b = typeof w == "function" ? w(C) : w;
          return I.replace && cg(b) ? b : { ...C, ...b };
        }
        return C;
      }));
    }, m = (h, w, I = { replace: !1 }) => {
      u((x) => x.map((C) => {
        if (C.id === h) {
          const b = typeof w == "function" ? w(C) : w;
          return I.replace && lN(b) ? b : { ...C, ...b };
        }
        return C;
      }));
    };
    return {
      getNodes: () => r.getState().nodes.map((h) => ({ ...h })),
      getNode: (h) => {
        var w;
        return (w = l(h)) == null ? void 0 : w.internals.userNode;
      },
      getInternalNode: l,
      getEdges: () => {
        const { edges: h = [] } = r.getState();
        return h.map((w) => ({ ...w }));
      },
      getEdge: (h) => r.getState().edgeLookup.get(h),
      setNodes: c,
      setEdges: u,
      addNodes: (h) => {
        const w = Array.isArray(h) ? h : [h];
        o.nodeQueue.push((I) => [...I, ...w]);
      },
      addEdges: (h) => {
        const w = Array.isArray(h) ? h : [h];
        o.edgeQueue.push((I) => [...I, ...w]);
      },
      toObject: () => {
        const { nodes: h = [], edges: w = [], transform: I } = r.getState(), [x, C, b] = I;
        return {
          nodes: h.map((N) => ({ ...N })),
          edges: w.map((N) => ({ ...N })),
          viewport: {
            x,
            y: C,
            zoom: b
          }
        };
      },
      deleteElements: async ({ nodes: h = [], edges: w = [] }) => {
        const { nodes: I, edges: x, onNodesDelete: C, onEdgesDelete: b, triggerNodeChanges: N, triggerEdgeChanges: k, onDelete: A, onBeforeDelete: S } = r.getState(), { nodes: P, edges: F } = await DC({
          nodesToRemove: h,
          edgesToRemove: w,
          nodes: I,
          edges: x,
          onBeforeDelete: S
        }), j = F.length > 0, W = P.length > 0;
        if (j) {
          const D = F.map(lg);
          b == null || b(F), k(D);
        }
        if (W) {
          const D = P.map(lg);
          C == null || C(P), N(D);
        }
        return (W || j) && (A == null || A({ nodes: P, edges: F })), { deletedNodes: P, deletedEdges: F };
      },
      /**
       * Partial is defined as "the 2 nodes/areas are intersecting partially".
       * If a is contained in b or b is contained in a, they are both
       * considered fully intersecting.
       */
      getIntersectingNodes: (h, w = !0, I) => {
        const x = Dp(h), C = x ? h : p(h), b = I !== void 0;
        return C ? (I || r.getState().nodes).filter((N) => {
          const k = r.getState().nodeLookup.get(N.id);
          if (k && !x && (N.id === h.id || !k.internals.positionAbsolute))
            return !1;
          const A = mo(b ? N : k), S = ba(A, C);
          return w && S > 0 || S >= A.width * A.height || S >= C.width * C.height;
        }) : [];
      },
      isNodeIntersecting: (h, w, I = !0) => {
        const C = Dp(h) ? h : p(h);
        if (!C)
          return !1;
        const b = ba(C, w);
        return I && b > 0 || b >= w.width * w.height || b >= C.width * C.height;
      },
      updateNode: g,
      updateNodeData: (h, w, I = { replace: !1 }) => {
        g(h, (x) => {
          const C = typeof w == "function" ? w(x) : w;
          return I.replace ? { ...x, data: C } : { ...x, data: { ...x.data, ...C } };
        }, I);
      },
      updateEdge: m,
      updateEdgeData: (h, w, I = { replace: !1 }) => {
        m(h, (x) => {
          const C = typeof w == "function" ? w(x) : w;
          return I.replace ? { ...x, data: C } : { ...x, data: { ...x.data, ...C } };
        }, I);
      },
      getNodesBounds: (h) => {
        const { nodeLookup: w, nodeOrigin: I } = r.getState();
        return TC(h, { nodeLookup: w, nodeOrigin: I });
      },
      getHandleConnections: ({ type: h, id: w, nodeId: I }) => {
        var x;
        return Array.from(((x = r.getState().connectionLookup.get(`${I}-${h}${w ? `-${w}` : ""}`)) == null ? void 0 : x.values()) ?? []);
      },
      getNodeConnections: ({ type: h, handleId: w, nodeId: I }) => {
        var x;
        return Array.from(((x = r.getState().connectionLookup.get(`${I}${h ? w ? `-${h}-${w}` : `-${h}` : ""}`)) == null ? void 0 : x.values()) ?? []);
      },
      fitView: async (h) => {
        const w = r.getState().fitViewResolver ?? zC();
        return r.setState({ fitViewQueued: !0, fitViewOptions: h, fitViewResolver: w }), o.nodeQueue.push((I) => [...I]), w.promise;
      }
    };
  }, []);
  return R.useMemo(() => ({
    ...i,
    ...e,
    viewportInitialized: s
  }), [s]);
}
const dg = (e) => e.selected, gN = typeof window < "u" ? window : void 0;
function mN({ deleteKeyCode: e, multiSelectionKeyCode: r }) {
  const o = He(), { deleteElements: s } = Eu(), i = _a(e, { actInsideInputWithModifier: !1 }), l = _a(r, { target: gN });
  R.useEffect(() => {
    if (i) {
      const { edges: c, nodes: u } = o.getState();
      s({ nodes: u.filter(dg), edges: c.filter(dg) }), o.setState({ nodesSelectionActive: !1 });
    }
  }, [i]), R.useEffect(() => {
    o.setState({ multiSelectionActive: l });
  }, [l]);
}
function hN(e) {
  const r = He();
  R.useEffect(() => {
    const o = () => {
      var i, l, c, u;
      if (!e.current || !(((l = (i = e.current).checkVisibility) == null ? void 0 : l.call(i)) ?? !0))
        return !1;
      const s = Au(e.current);
      (s.height === 0 || s.width === 0) && ((u = (c = r.getState()).onError) == null || u.call(c, "004", sn.error004())), r.setState({ width: s.width || 500, height: s.height || 500 });
    };
    if (e.current) {
      o(), window.addEventListener("resize", o);
      const s = new ResizeObserver(() => o());
      return s.observe(e.current), () => {
        window.removeEventListener("resize", o), s && e.current && s.unobserve(e.current);
      };
    }
  }, []);
}
const Ei = {
  position: "absolute",
  width: "100%",
  height: "100%",
  top: 0,
  left: 0
}, yN = (e) => ({
  userSelectionActive: e.userSelectionActive,
  lib: e.lib,
  connectionInProgress: e.connection.inProgress
});
function wN({ onPaneContextMenu: e, zoomOnScroll: r = !0, zoomOnPinch: o = !0, panOnScroll: s = !1, panOnScrollSpeed: i = 0.5, panOnScrollMode: l = Nr.Free, zoomOnDoubleClick: c = !0, panOnDrag: u = !0, defaultViewport: p, translateExtent: g, minZoom: m, maxZoom: h, zoomActivationKeyCode: w, preventScrolling: I = !0, children: x, noWheelClassName: C, noPanClassName: b, onViewportChange: N, isControlledViewport: k, paneClickDistance: A, selectionOnDrag: S }) {
  const P = He(), F = R.useRef(null), { userSelectionActive: j, lib: W, connectionInProgress: D } = Re(yN, Oe), Z = _a(w), H = R.useRef();
  hN(F);
  const L = R.useCallback((ee) => {
    N == null || N({ x: ee[0], y: ee[1], zoom: ee[2] }), k || P.setState({ transform: ee });
  }, [N, k]);
  return R.useEffect(() => {
    if (F.current) {
      H.current = Cb({
        domNode: F.current,
        minZoom: m,
        maxZoom: h,
        translateExtent: g,
        viewport: p,
        onDraggingChange: (O) => P.setState({ paneDragging: O }),
        onPanZoomStart: (O, U) => {
          const { onViewportChangeStart: E, onMoveStart: G } = P.getState();
          G == null || G(O, U), E == null || E(U);
        },
        onPanZoom: (O, U) => {
          const { onViewportChange: E, onMove: G } = P.getState();
          G == null || G(O, U), E == null || E(U);
        },
        onPanZoomEnd: (O, U) => {
          const { onViewportChangeEnd: E, onMoveEnd: G } = P.getState();
          G == null || G(O, U), E == null || E(U);
        }
      });
      const { x: ee, y: T, zoom: Y } = H.current.getViewport();
      return P.setState({
        panZoom: H.current,
        transform: [ee, T, Y],
        domNode: F.current.closest(".react-flow")
      }), () => {
        var O;
        (O = H.current) == null || O.destroy();
      };
    }
  }, []), R.useEffect(() => {
    var ee;
    (ee = H.current) == null || ee.update({
      onPaneContextMenu: e,
      zoomOnScroll: r,
      zoomOnPinch: o,
      panOnScroll: s,
      panOnScrollSpeed: i,
      panOnScrollMode: l,
      zoomOnDoubleClick: c,
      panOnDrag: u,
      zoomActivationKeyPressed: Z,
      preventScrolling: I,
      noPanClassName: b,
      userSelectionActive: j,
      noWheelClassName: C,
      lib: W,
      onTransformChange: L,
      connectionInProgress: D,
      selectionOnDrag: S,
      paneClickDistance: A
    });
  }, [
    e,
    r,
    o,
    s,
    i,
    l,
    c,
    u,
    Z,
    I,
    b,
    j,
    C,
    W,
    L,
    D,
    S,
    A
  ]), f.jsx("div", { className: "react-flow__renderer", ref: F, style: Ei, children: x });
}
const vN = (e) => ({
  userSelectionActive: e.userSelectionActive,
  userSelectionRect: e.userSelectionRect
});
function xN() {
  const { userSelectionActive: e, userSelectionRect: r } = Re(vN, Oe);
  return e && r ? f.jsx("div", { className: "react-flow__selection react-flow__container", style: {
    width: r.width,
    height: r.height,
    transform: `translate(${r.x}px, ${r.y}px)`
  } }) : null;
}
const Lc = (e, r) => (o) => {
  o.target === r.current && (e == null || e(o));
}, IN = (e) => ({
  userSelectionActive: e.userSelectionActive,
  elementsSelectable: e.elementsSelectable,
  connectionInProgress: e.connection.inProgress,
  dragging: e.paneDragging
});
function CN({ isSelecting: e, selectionKeyPressed: r, selectionMode: o = Ca.Full, panOnDrag: s, paneClickDistance: i, selectionOnDrag: l, onSelectionStart: c, onSelectionEnd: u, onPaneClick: p, onPaneContextMenu: g, onPaneScroll: m, onPaneMouseEnter: h, onPaneMouseMove: w, onPaneMouseLeave: I, children: x }) {
  const C = He(), { userSelectionActive: b, elementsSelectable: N, dragging: k, connectionInProgress: A } = Re(IN, Oe), S = N && (e || b), P = R.useRef(null), F = R.useRef(), j = R.useRef(/* @__PURE__ */ new Set()), W = R.useRef(/* @__PURE__ */ new Set()), D = R.useRef(!1), Z = (E) => {
    if (D.current || A) {
      D.current = !1;
      return;
    }
    p == null || p(E), C.getState().resetSelectedElements(), C.setState({ nodesSelectionActive: !1 });
  }, H = (E) => {
    if (Array.isArray(s) && (s != null && s.includes(2))) {
      E.preventDefault();
      return;
    }
    g == null || g(E);
  }, L = m ? (E) => m(E) : void 0, ee = (E) => {
    D.current && (E.stopPropagation(), D.current = !1);
  }, T = (E) => {
    var le, ue;
    const { domNode: G } = C.getState();
    if (F.current = G == null ? void 0 : G.getBoundingClientRect(), !F.current)
      return;
    const K = E.target === P.current;
    if (!K && !!E.target.closest(".nokey") || !e || !(l && K || r) || E.button !== 0 || !E.isPrimary)
      return;
    (ue = (le = E.target) == null ? void 0 : le.setPointerCapture) == null || ue.call(le, E.pointerId), D.current = !1;
    const { x: te, y: re } = Yt(E.nativeEvent, F.current);
    C.setState({
      userSelectionRect: {
        width: 0,
        height: 0,
        startX: te,
        startY: re,
        x: te,
        y: re
      }
    }), K || (E.stopPropagation(), E.preventDefault());
  }, Y = (E) => {
    const { userSelectionRect: G, transform: K, nodeLookup: M, edgeLookup: V, connectionLookup: te, triggerNodeChanges: re, triggerEdgeChanges: le, defaultEdgeOptions: ue, resetSelectedElements: de } = C.getState();
    if (!F.current || !G)
      return;
    const { x: ne, y: fe } = Yt(E.nativeEvent, F.current), { startX: be, startY: Ne } = G;
    if (!D.current) {
      const je = r ? 0 : i;
      if (Math.hypot(ne - be, fe - Ne) <= je)
        return;
      de(), c == null || c(E);
    }
    D.current = !0;
    const Ce = {
      startX: be,
      startY: Ne,
      x: ne < be ? ne : be,
      y: fe < Ne ? fe : Ne,
      width: Math.abs(ne - be),
      height: Math.abs(fe - Ne)
    }, xe = j.current, Te = W.current;
    j.current = new Set(Nu(M, Ce, K, o === Ca.Partial, !0).map((je) => je.id)), W.current = /* @__PURE__ */ new Set();
    const Be = (ue == null ? void 0 : ue.selectable) ?? !0;
    for (const je of j.current) {
      const We = te.get(je);
      if (We)
        for (const { edgeId: Ft } of We.values()) {
          const vt = V.get(Ft);
          vt && (vt.selectable ?? Be) && W.current.add(Ft);
        }
    }
    if (!Gp(xe, j.current)) {
      const je = io(M, j.current, !0);
      re(je);
    }
    if (!Gp(Te, W.current)) {
      const je = io(V, W.current);
      le(je);
    }
    C.setState({
      userSelectionRect: Ce,
      userSelectionActive: !0,
      nodesSelectionActive: !1
    });
  }, O = (E) => {
    var G, K;
    E.button === 0 && ((K = (G = E.target) == null ? void 0 : G.releasePointerCapture) == null || K.call(G, E.pointerId), !b && E.target === P.current && C.getState().userSelectionRect && (Z == null || Z(E)), C.setState({
      userSelectionActive: !1,
      userSelectionRect: null
    }), D.current && (u == null || u(E), C.setState({
      nodesSelectionActive: j.current.size > 0
    })));
  }, U = s === !0 || Array.isArray(s) && s.includes(0);
  return f.jsxs("div", { className: $e(["react-flow__pane", { draggable: U, dragging: k, selection: e }]), onClick: S ? void 0 : Lc(Z, P), onContextMenu: Lc(H, P), onWheel: Lc(L, P), onPointerEnter: S ? void 0 : h, onPointerMove: S ? Y : w, onPointerUp: S ? O : void 0, onPointerDownCapture: S ? T : void 0, onClickCapture: S ? ee : void 0, onPointerLeave: I, ref: P, style: Ei, children: [x, f.jsx(xN, {})] });
}
function du({ id: e, store: r, unselect: o = !1, nodeRef: s }) {
  const { addSelectedNodes: i, unselectNodesAndEdges: l, multiSelectionActive: c, nodeLookup: u, onError: p } = r.getState(), g = u.get(e);
  if (!g) {
    p == null || p("012", sn.error012(e));
    return;
  }
  r.setState({ nodesSelectionActive: !1 }), g.selected ? (o || g.selected && c) && (l({ nodes: [g], edges: [] }), requestAnimationFrame(() => {
    var m;
    return (m = s == null ? void 0 : s.current) == null ? void 0 : m.blur();
  })) : i([e]);
}
function Km({ nodeRef: e, disabled: r = !1, noDragClassName: o, handleSelector: s, nodeId: i, isSelectable: l, nodeClickDistance: c }) {
  const u = He(), [p, g] = R.useState(!1), m = R.useRef();
  return R.useEffect(() => {
    m.current = lb({
      getStoreItems: () => u.getState(),
      onNodeMouseDown: (h) => {
        du({
          id: h,
          store: u,
          nodeRef: e
        });
      },
      onDragStart: () => {
        g(!0);
      },
      onDragStop: () => {
        g(!1);
      }
    });
  }, []), R.useEffect(() => {
    var h, w;
    if (r)
      (h = m.current) == null || h.destroy();
    else if (e.current)
      return (w = m.current) == null || w.update({
        noDragClassName: o,
        handleSelector: s,
        domNode: e.current,
        isSelectable: l,
        nodeId: i,
        nodeClickDistance: c
      }), () => {
        var I;
        (I = m.current) == null || I.destroy();
      };
  }, [o, s, r, l, e, i]), p;
}
const bN = (e) => (r) => r.selected && (r.draggable || e && typeof r.draggable > "u");
function Zm() {
  const e = He();
  return R.useCallback((o) => {
    const { nodeExtent: s, snapToGrid: i, snapGrid: l, nodesDraggable: c, onError: u, updateNodePositions: p, nodeLookup: g, nodeOrigin: m } = e.getState(), h = /* @__PURE__ */ new Map(), w = bN(c), I = i ? l[0] : 5, x = i ? l[1] : 5, C = o.direction.x * I * o.factor, b = o.direction.y * x * o.factor;
    for (const [, N] of g) {
      if (!w(N))
        continue;
      let k = {
        x: N.internals.positionAbsolute.x + C,
        y: N.internals.positionAbsolute.y + b
      };
      i && (k = Ta(k, l));
      const { position: A, positionAbsolute: S } = mm({
        nodeId: N.id,
        nextPosition: k,
        nodeLookup: g,
        nodeExtent: s,
        nodeOrigin: m,
        onError: u
      });
      N.position = A, N.internals.positionAbsolute = S, h.set(N.id, N);
    }
    p(h);
  }, []);
}
const Du = R.createContext(null), NN = Du.Provider;
Du.Consumer;
const Ym = () => R.useContext(Du), _N = (e) => ({
  connectOnClick: e.connectOnClick,
  noPanClassName: e.noPanClassName,
  rfId: e.rfId
}), AN = (e, r, o) => (s) => {
  const { connectionClickStartHandle: i, connectionMode: l, connection: c } = s, { fromHandle: u, toHandle: p, isValid: g } = c, m = (p == null ? void 0 : p.nodeId) === e && (p == null ? void 0 : p.id) === r && (p == null ? void 0 : p.type) === o;
  return {
    connectingFrom: (u == null ? void 0 : u.nodeId) === e && (u == null ? void 0 : u.id) === r && (u == null ? void 0 : u.type) === o,
    connectingTo: m,
    clickConnecting: (i == null ? void 0 : i.nodeId) === e && (i == null ? void 0 : i.id) === r && (i == null ? void 0 : i.type) === o,
    isPossibleEndHandle: l === po.Strict ? (u == null ? void 0 : u.type) !== o : e !== (u == null ? void 0 : u.nodeId) || r !== (u == null ? void 0 : u.id),
    connectionInProcess: !!u,
    clickConnectionInProcess: !!i,
    valid: m && g
  };
};
function SN({ type: e = "source", position: r = Q.Top, isValidConnection: o, isConnectable: s = !0, isConnectableStart: i = !0, isConnectableEnd: l = !0, id: c, onConnect: u, children: p, className: g, onMouseDown: m, onTouchStart: h, ...w }, I) {
  var Y, O;
  const x = c || null, C = e === "target", b = He(), N = Ym(), { connectOnClick: k, noPanClassName: A, rfId: S } = Re(_N, Oe), { connectingFrom: P, connectingTo: F, clickConnecting: j, isPossibleEndHandle: W, connectionInProcess: D, clickConnectionInProcess: Z, valid: H } = Re(AN(N, x, e), Oe);
  N || (O = (Y = b.getState()).onError) == null || O.call(Y, "010", sn.error010());
  const L = (U) => {
    const { defaultEdgeOptions: E, onConnect: G, hasDefaultEdges: K } = b.getState(), M = {
      ...E,
      ...U
    };
    if (K) {
      const { edges: V, setEdges: te } = b.getState();
      te(KC(M, V));
    }
    G == null || G(M), u == null || u(M);
  }, ee = (U) => {
    if (!N)
      return;
    const E = bm(U.nativeEvent);
    if (i && (E && U.button === 0 || !E)) {
      const G = b.getState();
      uu.onPointerDown(U.nativeEvent, {
        handleDomNode: U.currentTarget,
        autoPanOnConnect: G.autoPanOnConnect,
        connectionMode: G.connectionMode,
        connectionRadius: G.connectionRadius,
        domNode: G.domNode,
        nodeLookup: G.nodeLookup,
        lib: G.lib,
        isTarget: C,
        handleId: x,
        nodeId: N,
        flowId: G.rfId,
        panBy: G.panBy,
        cancelConnection: G.cancelConnection,
        onConnectStart: G.onConnectStart,
        onConnectEnd: G.onConnectEnd,
        updateConnection: G.updateConnection,
        onConnect: L,
        isValidConnection: o || G.isValidConnection,
        getTransform: () => b.getState().transform,
        getFromHandle: () => b.getState().connection.fromHandle,
        autoPanSpeed: G.autoPanSpeed,
        dragThreshold: G.connectionDragThreshold
      });
    }
    E ? m == null || m(U) : h == null || h(U);
  }, T = (U) => {
    const { onClickConnectStart: E, onClickConnectEnd: G, connectionClickStartHandle: K, connectionMode: M, isValidConnection: V, lib: te, rfId: re, nodeLookup: le, connection: ue } = b.getState();
    if (!N || !K && !i)
      return;
    if (!K) {
      E == null || E(U.nativeEvent, { nodeId: N, handleId: x, handleType: e }), b.setState({ connectionClickStartHandle: { nodeId: N, type: e, id: x } });
      return;
    }
    const de = Im(U.target), ne = o || V, { connection: fe, isValid: be } = uu.isValid(U.nativeEvent, {
      handle: {
        nodeId: N,
        id: x,
        type: e
      },
      connectionMode: M,
      fromNodeId: K.nodeId,
      fromHandleId: K.id || null,
      fromType: K.type,
      isValidConnection: ne,
      flowId: re,
      doc: de,
      lib: te,
      nodeLookup: le
    });
    be && fe && L(fe);
    const Ne = structuredClone(ue);
    delete Ne.inProgress, Ne.toPosition = Ne.toHandle ? Ne.toHandle.position : null, G == null || G(U, Ne), b.setState({ connectionClickStartHandle: null });
  };
  return f.jsx("div", { "data-handleid": x, "data-nodeid": N, "data-handlepos": r, "data-id": `${S}-${N}-${x}-${e}`, className: $e([
    "react-flow__handle",
    `react-flow__handle-${r}`,
    "nodrag",
    A,
    g,
    {
      source: !C,
      target: C,
      connectable: s,
      connectablestart: i,
      connectableend: l,
      clickconnecting: j,
      connectingfrom: P,
      connectingto: F,
      valid: H,
      /*
       * shows where you can start a connection from
       * and where you can end it while connecting
       */
      connectionindicator: s && (!D || W) && (D || Z ? l : i)
    }
  ]), onMouseDown: ee, onTouchStart: ee, onClick: k ? T : void 0, ref: I, ...w, children: p });
}
const oe = R.memo(Xm(SN));
function kN({ data: e, isConnectable: r, sourcePosition: o = Q.Bottom }) {
  return f.jsxs(f.Fragment, { children: [e == null ? void 0 : e.label, f.jsx(oe, { type: "source", position: o, isConnectable: r })] });
}
function jN({ data: e, isConnectable: r, targetPosition: o = Q.Top, sourcePosition: s = Q.Bottom }) {
  return f.jsxs(f.Fragment, { children: [f.jsx(oe, { type: "target", position: o, isConnectable: r }), e == null ? void 0 : e.label, f.jsx(oe, { type: "source", position: s, isConnectable: r })] });
}
function MN() {
  return null;
}
function TN({ data: e, isConnectable: r, targetPosition: o = Q.Top }) {
  return f.jsxs(f.Fragment, { children: [f.jsx(oe, { type: "target", position: o, isConnectable: r }), e == null ? void 0 : e.label] });
}
const bi = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 }
}, fg = {
  input: kN,
  default: jN,
  output: TN,
  group: MN
};
function RN(e) {
  var r, o, s, i;
  return e.internals.handleBounds === void 0 ? {
    width: e.width ?? e.initialWidth ?? ((r = e.style) == null ? void 0 : r.width),
    height: e.height ?? e.initialHeight ?? ((o = e.style) == null ? void 0 : o.height)
  } : {
    width: e.width ?? ((s = e.style) == null ? void 0 : s.width),
    height: e.height ?? ((i = e.style) == null ? void 0 : i.height)
  };
}
const BN = (e) => {
  const { width: r, height: o, x: s, y: i } = Ma(e.nodeLookup, {
    filter: (l) => !!l.selected
  });
  return {
    width: Zt(r) ? r : null,
    height: Zt(o) ? o : null,
    userSelectionActive: e.userSelectionActive,
    transformString: `translate(${e.transform[0]}px,${e.transform[1]}px) scale(${e.transform[2]}) translate(${s}px,${i}px)`
  };
};
function EN({ onSelectionContextMenu: e, noPanClassName: r, disableKeyboardA11y: o }) {
  const s = He(), { width: i, height: l, transformString: c, userSelectionActive: u } = Re(BN, Oe), p = Zm(), g = R.useRef(null);
  if (R.useEffect(() => {
    var w;
    o || (w = g.current) == null || w.focus({
      preventScroll: !0
    });
  }, [o]), Km({
    nodeRef: g
  }), u || !i || !l)
    return null;
  const m = e ? (w) => {
    const I = s.getState().nodes.filter((x) => x.selected);
    e(w, I);
  } : void 0, h = (w) => {
    Object.prototype.hasOwnProperty.call(bi, w.key) && (w.preventDefault(), p({
      direction: bi[w.key],
      factor: w.shiftKey ? 4 : 1
    }));
  };
  return f.jsx("div", { className: $e(["react-flow__nodesselection", "react-flow__container", r]), style: {
    transform: c
  }, children: f.jsx("div", { ref: g, className: "react-flow__nodesselection-rect", onContextMenu: m, tabIndex: o ? void 0 : -1, onKeyDown: o ? void 0 : h, style: {
    width: i,
    height: l
  } }) });
}
const pg = typeof window < "u" ? window : void 0, DN = (e) => ({ nodesSelectionActive: e.nodesSelectionActive, userSelectionActive: e.userSelectionActive });
function Um({ children: e, onPaneClick: r, onPaneMouseEnter: o, onPaneMouseMove: s, onPaneMouseLeave: i, onPaneContextMenu: l, onPaneScroll: c, paneClickDistance: u, deleteKeyCode: p, selectionKeyCode: g, selectionOnDrag: m, selectionMode: h, onSelectionStart: w, onSelectionEnd: I, multiSelectionKeyCode: x, panActivationKeyCode: C, zoomActivationKeyCode: b, elementsSelectable: N, zoomOnScroll: k, zoomOnPinch: A, panOnScroll: S, panOnScrollSpeed: P, panOnScrollMode: F, zoomOnDoubleClick: j, panOnDrag: W, defaultViewport: D, translateExtent: Z, minZoom: H, maxZoom: L, preventScrolling: ee, onSelectionContextMenu: T, noWheelClassName: Y, noPanClassName: O, disableKeyboardA11y: U, onViewportChange: E, isControlledViewport: G }) {
  const { nodesSelectionActive: K, userSelectionActive: M } = Re(DN, Oe), V = _a(g, { target: pg }), te = _a(C, { target: pg }), re = te || W, le = te || S, ue = m && re !== !0, de = V || M || ue;
  return mN({ deleteKeyCode: p, multiSelectionKeyCode: x }), f.jsx(wN, { onPaneContextMenu: l, elementsSelectable: N, zoomOnScroll: k, zoomOnPinch: A, panOnScroll: le, panOnScrollSpeed: P, panOnScrollMode: F, zoomOnDoubleClick: j, panOnDrag: !V && re, defaultViewport: D, translateExtent: Z, minZoom: H, maxZoom: L, zoomActivationKeyCode: b, preventScrolling: ee, noWheelClassName: Y, noPanClassName: O, onViewportChange: E, isControlledViewport: G, paneClickDistance: u, selectionOnDrag: ue, children: f.jsxs(CN, { onSelectionStart: w, onSelectionEnd: I, onPaneClick: r, onPaneMouseEnter: o, onPaneMouseMove: s, onPaneMouseLeave: i, onPaneContextMenu: l, onPaneScroll: c, panOnDrag: re, isSelecting: !!de, selectionMode: h, selectionKeyPressed: V, paneClickDistance: u, selectionOnDrag: ue, children: [e, K && f.jsx(EN, { onSelectionContextMenu: T, noPanClassName: O, disableKeyboardA11y: U })] }) });
}
Um.displayName = "FlowRenderer";
const GN = R.memo(Um), FN = (e) => (r) => e ? Nu(r.nodeLookup, { x: 0, y: 0, width: r.width, height: r.height }, r.transform, !0).map((o) => o.id) : Array.from(r.nodeLookup.keys());
function PN(e) {
  return Re(R.useCallback(FN(e), [e]), Oe);
}
const zN = (e) => e.updateNodeInternals;
function VN() {
  const e = Re(zN), [r] = R.useState(() => typeof ResizeObserver > "u" ? null : new ResizeObserver((o) => {
    const s = /* @__PURE__ */ new Map();
    o.forEach((i) => {
      const l = i.target.getAttribute("data-id");
      s.set(l, {
        id: l,
        nodeElement: i.target,
        force: !0
      });
    }), e(s);
  }));
  return R.useEffect(() => () => {
    r == null || r.disconnect();
  }, [r]), r;
}
function ON({ node: e, nodeType: r, hasDimensions: o, resizeObserver: s }) {
  const i = He(), l = R.useRef(null), c = R.useRef(null), u = R.useRef(e.sourcePosition), p = R.useRef(e.targetPosition), g = R.useRef(r), m = o && !!e.internals.handleBounds;
  return R.useEffect(() => {
    l.current && !e.hidden && (!m || c.current !== l.current) && (c.current && (s == null || s.unobserve(c.current)), s == null || s.observe(l.current), c.current = l.current);
  }, [m, e.hidden]), R.useEffect(() => () => {
    c.current && (s == null || s.unobserve(c.current), c.current = null);
  }, []), R.useEffect(() => {
    if (l.current) {
      const h = g.current !== r, w = u.current !== e.sourcePosition, I = p.current !== e.targetPosition;
      (h || w || I) && (g.current = r, u.current = e.sourcePosition, p.current = e.targetPosition, i.getState().updateNodeInternals(/* @__PURE__ */ new Map([[e.id, { id: e.id, nodeElement: l.current, force: !0 }]])));
    }
  }, [e.id, r, e.sourcePosition, e.targetPosition]), l;
}
function HN({ id: e, onClick: r, onMouseEnter: o, onMouseMove: s, onMouseLeave: i, onContextMenu: l, onDoubleClick: c, nodesDraggable: u, elementsSelectable: p, nodesConnectable: g, nodesFocusable: m, resizeObserver: h, noDragClassName: w, noPanClassName: I, disableKeyboardA11y: x, rfId: C, nodeTypes: b, nodeClickDistance: N, onError: k }) {
  const { node: A, internals: S, isParent: P } = Re((ne) => {
    const fe = ne.nodeLookup.get(e), be = ne.parentLookup.has(e);
    return {
      node: fe,
      internals: fe.internals,
      isParent: be
    };
  }, Oe);
  let F = A.type || "default", j = (b == null ? void 0 : b[F]) || fg[F];
  j === void 0 && (k == null || k("003", sn.error003(F)), F = "default", j = (b == null ? void 0 : b.default) || fg.default);
  const W = !!(A.draggable || u && typeof A.draggable > "u"), D = !!(A.selectable || p && typeof A.selectable > "u"), Z = !!(A.connectable || g && typeof A.connectable > "u"), H = !!(A.focusable || m && typeof A.focusable > "u"), L = He(), ee = vm(A), T = ON({ node: A, nodeType: F, hasDimensions: ee, resizeObserver: h }), Y = Km({
    nodeRef: T,
    disabled: A.hidden || !W,
    noDragClassName: w,
    handleSelector: A.dragHandle,
    nodeId: e,
    isSelectable: D,
    nodeClickDistance: N
  }), O = Zm();
  if (A.hidden)
    return null;
  const U = Sn(A), E = RN(A), G = D || W || r || o || s || i, K = o ? (ne) => o(ne, { ...S.userNode }) : void 0, M = s ? (ne) => s(ne, { ...S.userNode }) : void 0, V = i ? (ne) => i(ne, { ...S.userNode }) : void 0, te = l ? (ne) => l(ne, { ...S.userNode }) : void 0, re = c ? (ne) => c(ne, { ...S.userNode }) : void 0, le = (ne) => {
    const { selectNodesOnDrag: fe, nodeDragThreshold: be } = L.getState();
    D && (!fe || !W || be > 0) && du({
      id: e,
      store: L,
      nodeRef: T
    }), r && r(ne, { ...S.userNode });
  }, ue = (ne) => {
    if (!(Cm(ne.nativeEvent) || x)) {
      if (um.includes(ne.key) && D) {
        const fe = ne.key === "Escape";
        du({
          id: e,
          store: L,
          unselect: fe,
          nodeRef: T
        });
      } else if (W && A.selected && Object.prototype.hasOwnProperty.call(bi, ne.key)) {
        ne.preventDefault();
        const { ariaLabelConfig: fe } = L.getState();
        L.setState({
          ariaLiveMessage: fe["node.a11yDescription.ariaLiveMessage"]({
            direction: ne.key.replace("Arrow", "").toLowerCase(),
            x: ~~S.positionAbsolute.x,
            y: ~~S.positionAbsolute.y
          })
        }), O({
          direction: bi[ne.key],
          factor: ne.shiftKey ? 4 : 1
        });
      }
    }
  }, de = () => {
    var Te;
    if (x || !((Te = T.current) != null && Te.matches(":focus-visible")))
      return;
    const { transform: ne, width: fe, height: be, autoPanOnNodeFocus: Ne, setCenter: Ce } = L.getState();
    if (!Ne)
      return;
    Nu(/* @__PURE__ */ new Map([[e, A]]), { x: 0, y: 0, width: fe, height: be }, ne, !0).length > 0 || Ce(A.position.x + U.width / 2, A.position.y + U.height / 2, {
      zoom: ne[2]
    });
  };
  return f.jsx("div", { className: $e([
    "react-flow__node",
    `react-flow__node-${F}`,
    {
      // this is overwritable by passing `nopan` as a class name
      [I]: W
    },
    A.className,
    {
      selected: A.selected,
      selectable: D,
      parent: P,
      draggable: W,
      dragging: Y
    }
  ]), ref: T, style: {
    zIndex: S.z,
    transform: `translate(${S.positionAbsolute.x}px,${S.positionAbsolute.y}px)`,
    pointerEvents: G ? "all" : "none",
    visibility: ee ? "visible" : "hidden",
    ...A.style,
    ...E
  }, "data-id": e, "data-testid": `rf__node-${e}`, onMouseEnter: K, onMouseMove: M, onMouseLeave: V, onContextMenu: te, onClick: le, onDoubleClick: re, onKeyDown: H ? ue : void 0, tabIndex: H ? 0 : void 0, onFocus: H ? de : void 0, role: A.ariaRole ?? (H ? "group" : void 0), "aria-roledescription": "node", "aria-describedby": x ? void 0 : `${Vm}-${C}`, "aria-label": A.ariaLabel, ...A.domAttributes, children: f.jsx(NN, { value: e, children: f.jsx(j, { id: e, data: A.data, type: F, positionAbsoluteX: S.positionAbsolute.x, positionAbsoluteY: S.positionAbsolute.y, selected: A.selected ?? !1, selectable: D, draggable: W, deletable: A.deletable ?? !0, isConnectable: Z, sourcePosition: A.sourcePosition, targetPosition: A.targetPosition, dragging: Y, dragHandle: A.dragHandle, zIndex: S.z, parentId: A.parentId, ...U }) }) });
}
var WN = R.memo(HN);
const XN = (e) => ({
  nodesDraggable: e.nodesDraggable,
  nodesConnectable: e.nodesConnectable,
  nodesFocusable: e.nodesFocusable,
  elementsSelectable: e.elementsSelectable,
  onError: e.onError
});
function $m(e) {
  const { nodesDraggable: r, nodesConnectable: o, nodesFocusable: s, elementsSelectable: i, onError: l } = Re(XN, Oe), c = PN(e.onlyRenderVisibleElements), u = VN();
  return f.jsx("div", { className: "react-flow__nodes", style: Ei, children: c.map((p) => (
    /*
     * The split of responsibilities between NodeRenderer and
     * NodeComponentWrapper may appear weird. However, it’s designed to
     * minimize the cost of updates when individual nodes change.
     *
     * For example, when you’re dragging a single node, that node gets
     * updated multiple times per second. If `NodeRenderer` were to update
     * every time, it would have to re-run the `nodes.map()` loop every
     * time. This gets pricey with hundreds of nodes, especially if every
     * loop cycle does more than just rendering a JSX element!
     *
     * As a result of this choice, we took the following implementation
     * decisions:
     * - NodeRenderer subscribes *only* to node IDs – and therefore
     *   rerender *only* when visible nodes are added or removed.
     * - NodeRenderer performs all operations the result of which can be
     *   shared between nodes (such as creating the `ResizeObserver`
     *   instance, or subscribing to `selector`). This means extra prop
     *   drilling into `NodeComponentWrapper`, but it means we need to run
     *   these operations only once – instead of once per node.
     * - Any operations that you’d normally write inside `nodes.map` are
     *   moved into `NodeComponentWrapper`. This ensures they are
     *   memorized – so if `NodeRenderer` *has* to rerender, it only
     *   needs to regenerate the list of nodes, nothing else.
     */
    f.jsx(WN, { id: p, nodeTypes: e.nodeTypes, nodeExtent: e.nodeExtent, onClick: e.onNodeClick, onMouseEnter: e.onNodeMouseEnter, onMouseMove: e.onNodeMouseMove, onMouseLeave: e.onNodeMouseLeave, onContextMenu: e.onNodeContextMenu, onDoubleClick: e.onNodeDoubleClick, noDragClassName: e.noDragClassName, noPanClassName: e.noPanClassName, rfId: e.rfId, disableKeyboardA11y: e.disableKeyboardA11y, resizeObserver: u, nodesDraggable: r, nodesConnectable: o, nodesFocusable: s, elementsSelectable: i, nodeClickDistance: e.nodeClickDistance, onError: l }, p)
  )) });
}
$m.displayName = "NodeRenderer";
const LN = R.memo($m);
function KN(e) {
  return Re(R.useCallback((o) => {
    if (!e)
      return o.edges.map((i) => i.id);
    const s = [];
    if (o.width && o.height)
      for (const i of o.edges) {
        const l = o.nodeLookup.get(i.source), c = o.nodeLookup.get(i.target);
        l && c && WC({
          sourceNode: l,
          targetNode: c,
          width: o.width,
          height: o.height,
          transform: o.transform
        }) && s.push(i.id);
      }
    return s;
  }, [e]), Oe);
}
const ZN = ({ color: e = "none", strokeWidth: r = 1 }) => {
  const o = {
    strokeWidth: r,
    ...e && { stroke: e }
  };
  return f.jsx("polyline", { className: "arrow", style: o, strokeLinecap: "round", fill: "none", strokeLinejoin: "round", points: "-5,-4 0,0 -5,4" });
}, YN = ({ color: e = "none", strokeWidth: r = 1 }) => {
  const o = {
    strokeWidth: r,
    ...e && { stroke: e, fill: e }
  };
  return f.jsx("polyline", { className: "arrowclosed", style: o, strokeLinecap: "round", strokeLinejoin: "round", points: "-5,-4 0,0 -5,4 -5,-4" });
}, gg = {
  [xi.Arrow]: ZN,
  [xi.ArrowClosed]: YN
};
function UN(e) {
  const r = He();
  return R.useMemo(() => {
    var i, l;
    return Object.prototype.hasOwnProperty.call(gg, e) ? gg[e] : ((l = (i = r.getState()).onError) == null || l.call(i, "009", sn.error009(e)), null);
  }, [e]);
}
const $N = ({ id: e, type: r, color: o, width: s = 12.5, height: i = 12.5, markerUnits: l = "strokeWidth", strokeWidth: c, orient: u = "auto-start-reverse" }) => {
  const p = UN(r);
  return p ? f.jsx("marker", { className: "react-flow__arrowhead", id: e, markerWidth: `${s}`, markerHeight: `${i}`, viewBox: "-10 -10 20 20", markerUnits: l, orient: u, refX: "0", refY: "0", children: f.jsx(p, { color: o, strokeWidth: c }) }) : null;
}, Qm = ({ defaultColor: e, rfId: r }) => {
  const o = Re((l) => l.edges), s = Re((l) => l.defaultEdgeOptions), i = R.useMemo(() => QC(o, {
    id: r,
    defaultColor: e,
    defaultMarkerStart: s == null ? void 0 : s.markerStart,
    defaultMarkerEnd: s == null ? void 0 : s.markerEnd
  }), [o, s, r, e]);
  return i.length ? f.jsx("svg", { className: "react-flow__marker", "aria-hidden": "true", children: f.jsx("defs", { children: i.map((l) => f.jsx($N, { id: l.id, type: l.type, color: l.color, width: l.width, height: l.height, markerUnits: l.markerUnits, strokeWidth: l.strokeWidth, orient: l.orient }, l.id)) }) }) : null;
};
Qm.displayName = "MarkerDefinitions";
var QN = R.memo(Qm);
function Jm({ x: e, y: r, label: o, labelStyle: s, labelShowBg: i = !0, labelBgStyle: l, labelBgPadding: c = [2, 4], labelBgBorderRadius: u = 2, children: p, className: g, ...m }) {
  const [h, w] = R.useState({ x: 1, y: 0, width: 0, height: 0 }), I = $e(["react-flow__edge-textwrapper", g]), x = R.useRef(null);
  return R.useEffect(() => {
    if (x.current) {
      const C = x.current.getBBox();
      w({
        x: C.x,
        y: C.y,
        width: C.width,
        height: C.height
      });
    }
  }, [o]), o ? f.jsxs("g", { transform: `translate(${e - h.width / 2} ${r - h.height / 2})`, className: I, visibility: h.width ? "visible" : "hidden", ...m, children: [i && f.jsx("rect", { width: h.width + 2 * c[0], x: -c[0], y: -c[1], height: h.height + 2 * c[1], className: "react-flow__edge-textbg", style: l, rx: u, ry: u }), f.jsx("text", { className: "react-flow__edge-text", y: h.height / 2, dy: "0.3em", ref: x, style: s, children: o }), p] }) : null;
}
Jm.displayName = "EdgeText";
const JN = R.memo(Jm);
function wo({ path: e, labelX: r, labelY: o, label: s, labelStyle: i, labelShowBg: l, labelBgStyle: c, labelBgPadding: u, labelBgBorderRadius: p, interactionWidth: g = 20, ...m }) {
  return f.jsxs(f.Fragment, { children: [f.jsx("path", { ...m, d: e, fill: "none", className: $e(["react-flow__edge-path", m.className]) }), g ? f.jsx("path", { d: e, fill: "none", strokeOpacity: 0, strokeWidth: g, className: "react-flow__edge-interaction" }) : null, s && Zt(r) && Zt(o) ? f.jsx(JN, { x: r, y: o, label: s, labelStyle: i, labelShowBg: l, labelBgStyle: c, labelBgPadding: u, labelBgBorderRadius: p }) : null] });
}
function mg({ pos: e, x1: r, y1: o, x2: s, y2: i }) {
  return e === Q.Left || e === Q.Right ? [0.5 * (r + s), o] : [r, 0.5 * (o + i)];
}
function qm({ sourceX: e, sourceY: r, sourcePosition: o = Q.Bottom, targetX: s, targetY: i, targetPosition: l = Q.Top }) {
  const [c, u] = mg({
    pos: o,
    x1: e,
    y1: r,
    x2: s,
    y2: i
  }), [p, g] = mg({
    pos: l,
    x1: s,
    y1: i,
    x2: e,
    y2: r
  }), [m, h, w, I] = Nm({
    sourceX: e,
    sourceY: r,
    targetX: s,
    targetY: i,
    sourceControlX: c,
    sourceControlY: u,
    targetControlX: p,
    targetControlY: g
  });
  return [
    `M${e},${r} C${c},${u} ${p},${g} ${s},${i}`,
    m,
    h,
    w,
    I
  ];
}
function eh(e) {
  return R.memo(({ id: r, sourceX: o, sourceY: s, targetX: i, targetY: l, sourcePosition: c, targetPosition: u, label: p, labelStyle: g, labelShowBg: m, labelBgStyle: h, labelBgPadding: w, labelBgBorderRadius: I, style: x, markerEnd: C, markerStart: b, interactionWidth: N }) => {
    const [k, A, S] = qm({
      sourceX: o,
      sourceY: s,
      sourcePosition: c,
      targetX: i,
      targetY: l,
      targetPosition: u
    }), P = e.isInternal ? void 0 : r;
    return f.jsx(wo, { id: P, path: k, labelX: A, labelY: S, label: p, labelStyle: g, labelShowBg: m, labelBgStyle: h, labelBgPadding: w, labelBgBorderRadius: I, style: x, markerEnd: C, markerStart: b, interactionWidth: N });
  });
}
const qN = eh({ isInternal: !1 }), th = eh({ isInternal: !0 });
qN.displayName = "SimpleBezierEdge";
th.displayName = "SimpleBezierEdgeInternal";
function nh(e) {
  return R.memo(({ id: r, sourceX: o, sourceY: s, targetX: i, targetY: l, label: c, labelStyle: u, labelShowBg: p, labelBgStyle: g, labelBgPadding: m, labelBgBorderRadius: h, style: w, sourcePosition: I = Q.Bottom, targetPosition: x = Q.Top, markerEnd: C, markerStart: b, pathOptions: N, interactionWidth: k }) => {
    const [A, S, P] = iu({
      sourceX: o,
      sourceY: s,
      sourcePosition: I,
      targetX: i,
      targetY: l,
      targetPosition: x,
      borderRadius: N == null ? void 0 : N.borderRadius,
      offset: N == null ? void 0 : N.offset,
      stepPosition: N == null ? void 0 : N.stepPosition
    }), F = e.isInternal ? void 0 : r;
    return f.jsx(wo, { id: F, path: A, labelX: S, labelY: P, label: c, labelStyle: u, labelShowBg: p, labelBgStyle: g, labelBgPadding: m, labelBgBorderRadius: h, style: w, markerEnd: C, markerStart: b, interactionWidth: k });
  });
}
const rh = nh({ isInternal: !1 }), oh = nh({ isInternal: !0 });
rh.displayName = "SmoothStepEdge";
oh.displayName = "SmoothStepEdgeInternal";
function ah(e) {
  return R.memo(({ id: r, ...o }) => {
    var i;
    const s = e.isInternal ? void 0 : r;
    return f.jsx(rh, { ...o, id: s, pathOptions: R.useMemo(() => {
      var l;
      return { borderRadius: 0, offset: (l = o.pathOptions) == null ? void 0 : l.offset };
    }, [(i = o.pathOptions) == null ? void 0 : i.offset]) });
  });
}
const e_ = ah({ isInternal: !1 }), sh = ah({ isInternal: !0 });
e_.displayName = "StepEdge";
sh.displayName = "StepEdgeInternal";
function ih(e) {
  return R.memo(({ id: r, sourceX: o, sourceY: s, targetX: i, targetY: l, label: c, labelStyle: u, labelShowBg: p, labelBgStyle: g, labelBgPadding: m, labelBgBorderRadius: h, style: w, markerEnd: I, markerStart: x, interactionWidth: C }) => {
    const [b, N, k] = Am({ sourceX: o, sourceY: s, targetX: i, targetY: l }), A = e.isInternal ? void 0 : r;
    return f.jsx(wo, { id: A, path: b, labelX: N, labelY: k, label: c, labelStyle: u, labelShowBg: p, labelBgStyle: g, labelBgPadding: m, labelBgBorderRadius: h, style: w, markerEnd: I, markerStart: x, interactionWidth: C });
  });
}
const t_ = ih({ isInternal: !1 }), lh = ih({ isInternal: !0 });
t_.displayName = "StraightEdge";
lh.displayName = "StraightEdgeInternal";
function ch(e) {
  return R.memo(({ id: r, sourceX: o, sourceY: s, targetX: i, targetY: l, sourcePosition: c = Q.Bottom, targetPosition: u = Q.Top, label: p, labelStyle: g, labelShowBg: m, labelBgStyle: h, labelBgPadding: w, labelBgBorderRadius: I, style: x, markerEnd: C, markerStart: b, pathOptions: N, interactionWidth: k }) => {
    const [A, S, P] = Ti({
      sourceX: o,
      sourceY: s,
      sourcePosition: c,
      targetX: i,
      targetY: l,
      targetPosition: u,
      curvature: N == null ? void 0 : N.curvature
    }), F = e.isInternal ? void 0 : r;
    return f.jsx(wo, { id: F, path: A, labelX: S, labelY: P, label: p, labelStyle: g, labelShowBg: m, labelBgStyle: h, labelBgPadding: w, labelBgBorderRadius: I, style: x, markerEnd: C, markerStart: b, interactionWidth: k });
  });
}
const n_ = ch({ isInternal: !1 }), uh = ch({ isInternal: !0 });
n_.displayName = "BezierEdge";
uh.displayName = "BezierEdgeInternal";
const hg = {
  default: uh,
  straight: lh,
  step: sh,
  smoothstep: oh,
  simplebezier: th
}, yg = {
  sourceX: null,
  sourceY: null,
  targetX: null,
  targetY: null,
  sourcePosition: null,
  targetPosition: null
}, r_ = (e, r, o) => o === Q.Left ? e - r : o === Q.Right ? e + r : e, o_ = (e, r, o) => o === Q.Top ? e - r : o === Q.Bottom ? e + r : e, wg = "react-flow__edgeupdater";
function vg({ position: e, centerX: r, centerY: o, radius: s = 10, onMouseDown: i, onMouseEnter: l, onMouseOut: c, type: u }) {
  return f.jsx("circle", { onMouseDown: i, onMouseEnter: l, onMouseOut: c, className: $e([wg, `${wg}-${u}`]), cx: r_(r, s, e), cy: o_(o, s, e), r: s, stroke: "transparent", fill: "transparent" });
}
function a_({ isReconnectable: e, reconnectRadius: r, edge: o, sourceX: s, sourceY: i, targetX: l, targetY: c, sourcePosition: u, targetPosition: p, onReconnect: g, onReconnectStart: m, onReconnectEnd: h, setReconnecting: w, setUpdateHover: I }) {
  const x = He(), C = (S, P) => {
    if (S.button !== 0)
      return;
    const { autoPanOnConnect: F, domNode: j, isValidConnection: W, connectionMode: D, connectionRadius: Z, lib: H, onConnectStart: L, onConnectEnd: ee, cancelConnection: T, nodeLookup: Y, rfId: O, panBy: U, updateConnection: E } = x.getState(), G = P.type === "target", K = (te, re) => {
      w(!1), h == null || h(te, o, P.type, re);
    }, M = (te) => g == null ? void 0 : g(o, te), V = (te, re) => {
      w(!0), m == null || m(S, o, P.type), L == null || L(te, re);
    };
    uu.onPointerDown(S.nativeEvent, {
      autoPanOnConnect: F,
      connectionMode: D,
      connectionRadius: Z,
      domNode: j,
      handleId: P.id,
      nodeId: P.nodeId,
      nodeLookup: Y,
      isTarget: G,
      edgeUpdaterType: P.type,
      lib: H,
      flowId: O,
      cancelConnection: T,
      panBy: U,
      isValidConnection: W,
      onConnect: M,
      onConnectStart: V,
      onConnectEnd: ee,
      onReconnectEnd: K,
      updateConnection: E,
      getTransform: () => x.getState().transform,
      getFromHandle: () => x.getState().connection.fromHandle,
      dragThreshold: x.getState().connectionDragThreshold,
      handleDomNode: S.currentTarget
    });
  }, b = (S) => C(S, { nodeId: o.target, id: o.targetHandle ?? null, type: "target" }), N = (S) => C(S, { nodeId: o.source, id: o.sourceHandle ?? null, type: "source" }), k = () => I(!0), A = () => I(!1);
  return f.jsxs(f.Fragment, { children: [(e === !0 || e === "source") && f.jsx(vg, { position: u, centerX: s, centerY: i, radius: r, onMouseDown: b, onMouseEnter: k, onMouseOut: A, type: "source" }), (e === !0 || e === "target") && f.jsx(vg, { position: p, centerX: l, centerY: c, radius: r, onMouseDown: N, onMouseEnter: k, onMouseOut: A, type: "target" })] });
}
function s_({ id: e, edgesFocusable: r, edgesReconnectable: o, elementsSelectable: s, onClick: i, onDoubleClick: l, onContextMenu: c, onMouseEnter: u, onMouseMove: p, onMouseLeave: g, reconnectRadius: m, onReconnect: h, onReconnectStart: w, onReconnectEnd: I, rfId: x, edgeTypes: C, noPanClassName: b, onError: N, disableKeyboardA11y: k }) {
  let A = Re((Ce) => Ce.edgeLookup.get(e));
  const S = Re((Ce) => Ce.defaultEdgeOptions);
  A = S ? { ...S, ...A } : A;
  let P = A.type || "default", F = (C == null ? void 0 : C[P]) || hg[P];
  F === void 0 && (N == null || N("011", sn.error011(P)), P = "default", F = (C == null ? void 0 : C.default) || hg.default);
  const j = !!(A.focusable || r && typeof A.focusable > "u"), W = typeof h < "u" && (A.reconnectable || o && typeof A.reconnectable > "u"), D = !!(A.selectable || s && typeof A.selectable > "u"), Z = R.useRef(null), [H, L] = R.useState(!1), [ee, T] = R.useState(!1), Y = He(), { zIndex: O, sourceX: U, sourceY: E, targetX: G, targetY: K, sourcePosition: M, targetPosition: V } = Re(R.useCallback((Ce) => {
    const xe = Ce.nodeLookup.get(A.source), Te = Ce.nodeLookup.get(A.target);
    if (!xe || !Te)
      return {
        zIndex: A.zIndex,
        ...yg
      };
    const Be = $C({
      id: e,
      sourceNode: xe,
      targetNode: Te,
      sourceHandle: A.sourceHandle || null,
      targetHandle: A.targetHandle || null,
      connectionMode: Ce.connectionMode,
      onError: N
    });
    return {
      zIndex: HC({
        selected: A.selected,
        zIndex: A.zIndex,
        sourceNode: xe,
        targetNode: Te,
        elevateOnSelect: Ce.elevateEdgesOnSelect,
        zIndexMode: Ce.zIndexMode
      }),
      ...Be || yg
    };
  }, [A.source, A.target, A.sourceHandle, A.targetHandle, A.selected, A.zIndex]), Oe), te = R.useMemo(() => A.markerStart ? `url('#${lu(A.markerStart, x)}')` : void 0, [A.markerStart, x]), re = R.useMemo(() => A.markerEnd ? `url('#${lu(A.markerEnd, x)}')` : void 0, [A.markerEnd, x]);
  if (A.hidden || U === null || E === null || G === null || K === null)
    return null;
  const le = (Ce) => {
    var je;
    const { addSelectedEdges: xe, unselectNodesAndEdges: Te, multiSelectionActive: Be } = Y.getState();
    D && (Y.setState({ nodesSelectionActive: !1 }), A.selected && Be ? (Te({ nodes: [], edges: [A] }), (je = Z.current) == null || je.blur()) : xe([e])), i && i(Ce, A);
  }, ue = l ? (Ce) => {
    l(Ce, { ...A });
  } : void 0, de = c ? (Ce) => {
    c(Ce, { ...A });
  } : void 0, ne = u ? (Ce) => {
    u(Ce, { ...A });
  } : void 0, fe = p ? (Ce) => {
    p(Ce, { ...A });
  } : void 0, be = g ? (Ce) => {
    g(Ce, { ...A });
  } : void 0, Ne = (Ce) => {
    var xe;
    if (!k && um.includes(Ce.key) && D) {
      const { unselectNodesAndEdges: Te, addSelectedEdges: Be } = Y.getState();
      Ce.key === "Escape" ? ((xe = Z.current) == null || xe.blur(), Te({ edges: [A] })) : Be([e]);
    }
  };
  return f.jsx("svg", { style: { zIndex: O }, children: f.jsxs("g", { className: $e([
    "react-flow__edge",
    `react-flow__edge-${P}`,
    A.className,
    b,
    {
      selected: A.selected,
      animated: A.animated,
      inactive: !D && !i,
      updating: H,
      selectable: D
    }
  ]), onClick: le, onDoubleClick: ue, onContextMenu: de, onMouseEnter: ne, onMouseMove: fe, onMouseLeave: be, onKeyDown: j ? Ne : void 0, tabIndex: j ? 0 : void 0, role: A.ariaRole ?? (j ? "group" : "img"), "aria-roledescription": "edge", "data-id": e, "data-testid": `rf__edge-${e}`, "aria-label": A.ariaLabel === null ? void 0 : A.ariaLabel || `Edge from ${A.source} to ${A.target}`, "aria-describedby": j ? `${Om}-${x}` : void 0, ref: Z, ...A.domAttributes, children: [!ee && f.jsx(F, { id: e, source: A.source, target: A.target, type: A.type, selected: A.selected, animated: A.animated, selectable: D, deletable: A.deletable ?? !0, label: A.label, labelStyle: A.labelStyle, labelShowBg: A.labelShowBg, labelBgStyle: A.labelBgStyle, labelBgPadding: A.labelBgPadding, labelBgBorderRadius: A.labelBgBorderRadius, sourceX: U, sourceY: E, targetX: G, targetY: K, sourcePosition: M, targetPosition: V, data: A.data, style: A.style, sourceHandleId: A.sourceHandle, targetHandleId: A.targetHandle, markerStart: te, markerEnd: re, pathOptions: "pathOptions" in A ? A.pathOptions : void 0, interactionWidth: A.interactionWidth }), W && f.jsx(a_, { edge: A, isReconnectable: W, reconnectRadius: m, onReconnect: h, onReconnectStart: w, onReconnectEnd: I, sourceX: U, sourceY: E, targetX: G, targetY: K, sourcePosition: M, targetPosition: V, setUpdateHover: L, setReconnecting: T })] }) });
}
var i_ = R.memo(s_);
const l_ = (e) => ({
  edgesFocusable: e.edgesFocusable,
  edgesReconnectable: e.edgesReconnectable,
  elementsSelectable: e.elementsSelectable,
  connectionMode: e.connectionMode,
  onError: e.onError
});
function dh({ defaultMarkerColor: e, onlyRenderVisibleElements: r, rfId: o, edgeTypes: s, noPanClassName: i, onReconnect: l, onEdgeContextMenu: c, onEdgeMouseEnter: u, onEdgeMouseMove: p, onEdgeMouseLeave: g, onEdgeClick: m, reconnectRadius: h, onEdgeDoubleClick: w, onReconnectStart: I, onReconnectEnd: x, disableKeyboardA11y: C }) {
  const { edgesFocusable: b, edgesReconnectable: N, elementsSelectable: k, onError: A } = Re(l_, Oe), S = KN(r);
  return f.jsxs("div", { className: "react-flow__edges", children: [f.jsx(QN, { defaultColor: e, rfId: o }), S.map((P) => f.jsx(i_, { id: P, edgesFocusable: b, edgesReconnectable: N, elementsSelectable: k, noPanClassName: i, onReconnect: l, onContextMenu: c, onMouseEnter: u, onMouseMove: p, onMouseLeave: g, onClick: m, reconnectRadius: h, onDoubleClick: w, onReconnectStart: I, onReconnectEnd: x, rfId: o, onError: A, edgeTypes: s, disableKeyboardA11y: C }, P))] });
}
dh.displayName = "EdgeRenderer";
const c_ = R.memo(dh), u_ = (e) => `translate(${e.transform[0]}px,${e.transform[1]}px) scale(${e.transform[2]})`;
function d_({ children: e }) {
  const r = Re(u_);
  return f.jsx("div", { className: "react-flow__viewport xyflow__viewport react-flow__container", style: { transform: r }, children: e });
}
function f_(e) {
  const r = Eu(), o = R.useRef(!1);
  R.useEffect(() => {
    !o.current && r.viewportInitialized && e && (setTimeout(() => e(r), 1), o.current = !0);
  }, [e, r.viewportInitialized]);
}
const p_ = (e) => {
  var r;
  return (r = e.panZoom) == null ? void 0 : r.syncViewport;
};
function g_(e) {
  const r = Re(p_), o = He();
  return R.useEffect(() => {
    e && (r == null || r(e), o.setState({ transform: [e.x, e.y, e.zoom] }));
  }, [e, r]), null;
}
function m_(e) {
  return e.connection.inProgress ? { ...e.connection, to: Ra(e.connection.to, e.transform) } : { ...e.connection };
}
function h_(e) {
  return m_;
}
function y_(e) {
  const r = h_();
  return Re(r, Oe);
}
const w_ = (e) => ({
  nodesConnectable: e.nodesConnectable,
  isValid: e.connection.isValid,
  inProgress: e.connection.inProgress,
  width: e.width,
  height: e.height
});
function v_({ containerStyle: e, style: r, type: o, component: s }) {
  const { nodesConnectable: i, width: l, height: c, isValid: u, inProgress: p } = Re(w_, Oe);
  return !(l && i && p) ? null : f.jsx("svg", { style: e, width: l, height: c, className: "react-flow__connectionline react-flow__container", children: f.jsx("g", { className: $e(["react-flow__connection", pm(u)]), children: f.jsx(fh, { style: r, type: o, CustomComponent: s, isValid: u }) }) });
}
const fh = ({ style: e, type: r = Jn.Bezier, CustomComponent: o, isValid: s }) => {
  const { inProgress: i, from: l, fromNode: c, fromHandle: u, fromPosition: p, to: g, toNode: m, toHandle: h, toPosition: w, pointer: I } = y_();
  if (!i)
    return;
  if (o)
    return f.jsx(o, { connectionLineType: r, connectionLineStyle: e, fromNode: c, fromHandle: u, fromX: l.x, fromY: l.y, toX: g.x, toY: g.y, fromPosition: p, toPosition: w, connectionStatus: pm(s), toNode: m, toHandle: h, pointer: I });
  let x = "";
  const C = {
    sourceX: l.x,
    sourceY: l.y,
    sourcePosition: p,
    targetX: g.x,
    targetY: g.y,
    targetPosition: w
  };
  switch (r) {
    case Jn.Bezier:
      [x] = Ti(C);
      break;
    case Jn.SimpleBezier:
      [x] = qm(C);
      break;
    case Jn.Step:
      [x] = iu({
        ...C,
        borderRadius: 0
      });
      break;
    case Jn.SmoothStep:
      [x] = iu(C);
      break;
    default:
      [x] = Am(C);
  }
  return f.jsx("path", { d: x, fill: "none", className: "react-flow__connection-path", style: e });
};
fh.displayName = "ConnectionLine";
const x_ = {};
function xg(e = x_) {
  R.useRef(e), He(), R.useEffect(() => {
  }, [e]);
}
function I_() {
  He(), R.useRef(!1), R.useEffect(() => {
  }, []);
}
function ph({ nodeTypes: e, edgeTypes: r, onInit: o, onNodeClick: s, onEdgeClick: i, onNodeDoubleClick: l, onEdgeDoubleClick: c, onNodeMouseEnter: u, onNodeMouseMove: p, onNodeMouseLeave: g, onNodeContextMenu: m, onSelectionContextMenu: h, onSelectionStart: w, onSelectionEnd: I, connectionLineType: x, connectionLineStyle: C, connectionLineComponent: b, connectionLineContainerStyle: N, selectionKeyCode: k, selectionOnDrag: A, selectionMode: S, multiSelectionKeyCode: P, panActivationKeyCode: F, zoomActivationKeyCode: j, deleteKeyCode: W, onlyRenderVisibleElements: D, elementsSelectable: Z, defaultViewport: H, translateExtent: L, minZoom: ee, maxZoom: T, preventScrolling: Y, defaultMarkerColor: O, zoomOnScroll: U, zoomOnPinch: E, panOnScroll: G, panOnScrollSpeed: K, panOnScrollMode: M, zoomOnDoubleClick: V, panOnDrag: te, onPaneClick: re, onPaneMouseEnter: le, onPaneMouseMove: ue, onPaneMouseLeave: de, onPaneScroll: ne, onPaneContextMenu: fe, paneClickDistance: be, nodeClickDistance: Ne, onEdgeContextMenu: Ce, onEdgeMouseEnter: xe, onEdgeMouseMove: Te, onEdgeMouseLeave: Be, reconnectRadius: je, onReconnect: We, onReconnectStart: Ft, onReconnectEnd: vt, noDragClassName: xt, noWheelClassName: jt, noPanClassName: cn, disableKeyboardA11y: kn, nodeExtent: jr, rfId: er, viewport: un, onViewportChange: dn }) {
  return xg(e), xg(r), I_(), f_(o), g_(un), f.jsx(GN, { onPaneClick: re, onPaneMouseEnter: le, onPaneMouseMove: ue, onPaneMouseLeave: de, onPaneContextMenu: fe, onPaneScroll: ne, paneClickDistance: be, deleteKeyCode: W, selectionKeyCode: k, selectionOnDrag: A, selectionMode: S, onSelectionStart: w, onSelectionEnd: I, multiSelectionKeyCode: P, panActivationKeyCode: F, zoomActivationKeyCode: j, elementsSelectable: Z, zoomOnScroll: U, zoomOnPinch: E, zoomOnDoubleClick: V, panOnScroll: G, panOnScrollSpeed: K, panOnScrollMode: M, panOnDrag: te, defaultViewport: H, translateExtent: L, minZoom: ee, maxZoom: T, onSelectionContextMenu: h, preventScrolling: Y, noDragClassName: xt, noWheelClassName: jt, noPanClassName: cn, disableKeyboardA11y: kn, onViewportChange: dn, isControlledViewport: !!un, children: f.jsxs(d_, { children: [f.jsx(c_, { edgeTypes: r, onEdgeClick: i, onEdgeDoubleClick: c, onReconnect: We, onReconnectStart: Ft, onReconnectEnd: vt, onlyRenderVisibleElements: D, onEdgeContextMenu: Ce, onEdgeMouseEnter: xe, onEdgeMouseMove: Te, onEdgeMouseLeave: Be, reconnectRadius: je, defaultMarkerColor: O, noPanClassName: cn, disableKeyboardA11y: kn, rfId: er }), f.jsx(v_, { style: C, type: x, component: b, containerStyle: N }), f.jsx("div", { className: "react-flow__edgelabel-renderer" }), f.jsx(LN, { nodeTypes: e, onNodeClick: s, onNodeDoubleClick: l, onNodeMouseEnter: u, onNodeMouseMove: p, onNodeMouseLeave: g, onNodeContextMenu: m, nodeClickDistance: Ne, onlyRenderVisibleElements: D, noPanClassName: cn, noDragClassName: xt, disableKeyboardA11y: kn, nodeExtent: jr, rfId: er }), f.jsx("div", { className: "react-flow__viewport-portal" })] }) });
}
ph.displayName = "GraphView";
const C_ = R.memo(ph), Ig = ({ nodes: e, edges: r, defaultNodes: o, defaultEdges: s, width: i, height: l, fitView: c, fitViewOptions: u, minZoom: p = 0.5, maxZoom: g = 2, nodeOrigin: m, nodeExtent: h, zIndexMode: w = "basic" } = {}) => {
  const I = /* @__PURE__ */ new Map(), x = /* @__PURE__ */ new Map(), C = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map(), N = s ?? r ?? [], k = o ?? e ?? [], A = m ?? [0, 0], S = h ?? Ia;
  jm(C, b, N);
  const P = cu(k, I, x, {
    nodeOrigin: A,
    nodeExtent: S,
    zIndexMode: w
  });
  let F = [0, 0, 1];
  if (c && i && l) {
    const j = Ma(I, {
      filter: (H) => !!((H.width || H.initialWidth) && (H.height || H.initialHeight))
    }), { x: W, y: D, zoom: Z } = _u(j, i, l, p, g, (u == null ? void 0 : u.padding) ?? 0.1);
    F = [W, D, Z];
  }
  return {
    rfId: "1",
    width: i ?? 0,
    height: l ?? 0,
    transform: F,
    nodes: k,
    nodesInitialized: P,
    nodeLookup: I,
    parentLookup: x,
    edges: N,
    edgeLookup: b,
    connectionLookup: C,
    onNodesChange: null,
    onEdgesChange: null,
    hasDefaultNodes: o !== void 0,
    hasDefaultEdges: s !== void 0,
    panZoom: null,
    minZoom: p,
    maxZoom: g,
    translateExtent: Ia,
    nodeExtent: S,
    nodesSelectionActive: !1,
    userSelectionActive: !1,
    userSelectionRect: null,
    connectionMode: po.Strict,
    domNode: null,
    paneDragging: !1,
    noPanClassName: "nopan",
    nodeOrigin: A,
    nodeDragThreshold: 1,
    connectionDragThreshold: 1,
    snapGrid: [15, 15],
    snapToGrid: !1,
    nodesDraggable: !0,
    nodesConnectable: !0,
    nodesFocusable: !0,
    edgesFocusable: !0,
    edgesReconnectable: !0,
    elementsSelectable: !0,
    elevateNodesOnSelect: !0,
    elevateEdgesOnSelect: !0,
    selectNodesOnDrag: !0,
    multiSelectionActive: !1,
    fitViewQueued: c ?? !1,
    fitViewOptions: u,
    fitViewResolver: null,
    connection: { ...fm },
    connectionClickStartHandle: null,
    connectOnClick: !0,
    ariaLiveMessage: "",
    autoPanOnConnect: !0,
    autoPanOnNodeDrag: !0,
    autoPanOnNodeFocus: !0,
    autoPanSpeed: 15,
    connectionRadius: 20,
    onError: GC,
    isValidConnection: void 0,
    onSelectionChangeHandlers: [],
    lib: "react",
    debug: !1,
    ariaLabelConfig: dm,
    zIndexMode: w,
    onNodesChangeMiddlewareMap: /* @__PURE__ */ new Map(),
    onEdgesChangeMiddlewareMap: /* @__PURE__ */ new Map()
  };
}, b_ = ({ nodes: e, edges: r, defaultNodes: o, defaultEdges: s, width: i, height: l, fitView: c, fitViewOptions: u, minZoom: p, maxZoom: g, nodeOrigin: m, nodeExtent: h, zIndexMode: w }) => Vb((I, x) => {
  async function C() {
    const { nodeLookup: b, panZoom: N, fitViewOptions: k, fitViewResolver: A, width: S, height: P, minZoom: F, maxZoom: j } = x();
    N && (await EC({
      nodes: b,
      width: S,
      height: P,
      panZoom: N,
      minZoom: F,
      maxZoom: j
    }, k), A == null || A.resolve(!0), I({ fitViewResolver: null }));
  }
  return {
    ...Ig({
      nodes: e,
      edges: r,
      width: i,
      height: l,
      fitView: c,
      fitViewOptions: u,
      minZoom: p,
      maxZoom: g,
      nodeOrigin: m,
      nodeExtent: h,
      defaultNodes: o,
      defaultEdges: s,
      zIndexMode: w
    }),
    setNodes: (b) => {
      const { nodeLookup: N, parentLookup: k, nodeOrigin: A, elevateNodesOnSelect: S, fitViewQueued: P, zIndexMode: F } = x(), j = cu(b, N, k, {
        nodeOrigin: A,
        nodeExtent: h,
        elevateNodesOnSelect: S,
        checkEquality: !0,
        zIndexMode: F
      });
      P && j ? (C(), I({ nodes: b, nodesInitialized: j, fitViewQueued: !1, fitViewOptions: void 0 })) : I({ nodes: b, nodesInitialized: j });
    },
    setEdges: (b) => {
      const { connectionLookup: N, edgeLookup: k } = x();
      jm(N, k, b), I({ edges: b });
    },
    setDefaultNodesAndEdges: (b, N) => {
      if (b) {
        const { setNodes: k } = x();
        k(b), I({ hasDefaultNodes: !0 });
      }
      if (N) {
        const { setEdges: k } = x();
        k(N), I({ hasDefaultEdges: !0 });
      }
    },
    /*
     * Every node gets registerd at a ResizeObserver. Whenever a node
     * changes its dimensions, this function is called to measure the
     * new dimensions and update the nodes.
     */
    updateNodeInternals: (b) => {
      const { triggerNodeChanges: N, nodeLookup: k, parentLookup: A, domNode: S, nodeOrigin: P, nodeExtent: F, debug: j, fitViewQueued: W, zIndexMode: D } = x(), { changes: Z, updatedInternals: H } = ob(b, k, A, S, P, F, D);
      H && (eb(k, A, { nodeOrigin: P, nodeExtent: F, zIndexMode: D }), W ? (C(), I({ fitViewQueued: !1, fitViewOptions: void 0 })) : I({}), (Z == null ? void 0 : Z.length) > 0 && (j && console.log("React Flow: trigger node changes", Z), N == null || N(Z)));
    },
    updateNodePositions: (b, N = !1) => {
      const k = [];
      let A = [];
      const { nodeLookup: S, triggerNodeChanges: P, connection: F, updateConnection: j, onNodesChangeMiddlewareMap: W } = x();
      for (const [D, Z] of b) {
        const H = S.get(D), L = !!(H != null && H.expandParent && (H != null && H.parentId) && (Z != null && Z.position)), ee = {
          id: D,
          type: "position",
          position: L ? {
            x: Math.max(0, Z.position.x),
            y: Math.max(0, Z.position.y)
          } : Z.position,
          dragging: N
        };
        if (H && F.inProgress && F.fromNode.id === H.id) {
          const T = kr(H, F.fromHandle, Q.Left, !0);
          j({ ...F, from: T });
        }
        L && H.parentId && k.push({
          id: D,
          parentId: H.parentId,
          rect: {
            ...Z.internals.positionAbsolute,
            width: Z.measured.width ?? 0,
            height: Z.measured.height ?? 0
          }
        }), A.push(ee);
      }
      if (k.length > 0) {
        const { parentLookup: D, nodeOrigin: Z } = x(), H = Tu(k, S, D, Z);
        A.push(...H);
      }
      for (const D of W.values())
        A = D(A);
      P(A);
    },
    triggerNodeChanges: (b) => {
      const { onNodesChange: N, setNodes: k, nodes: A, hasDefaultNodes: S, debug: P } = x();
      if (b != null && b.length) {
        if (S) {
          const F = Ru(b, A);
          k(F);
        }
        P && console.log("React Flow: trigger node changes", b), N == null || N(b);
      }
    },
    triggerEdgeChanges: (b) => {
      const { onEdgesChange: N, setEdges: k, edges: A, hasDefaultEdges: S, debug: P } = x();
      if (b != null && b.length) {
        if (S) {
          const F = Bu(b, A);
          k(F);
        }
        P && console.log("React Flow: trigger edge changes", b), N == null || N(b);
      }
    },
    addSelectedNodes: (b) => {
      const { multiSelectionActive: N, edgeLookup: k, nodeLookup: A, triggerNodeChanges: S, triggerEdgeChanges: P } = x();
      if (N) {
        const F = b.map((j) => Ir(j, !0));
        S(F);
        return;
      }
      S(io(A, /* @__PURE__ */ new Set([...b]), !0)), P(io(k));
    },
    addSelectedEdges: (b) => {
      const { multiSelectionActive: N, edgeLookup: k, nodeLookup: A, triggerNodeChanges: S, triggerEdgeChanges: P } = x();
      if (N) {
        const F = b.map((j) => Ir(j, !0));
        P(F);
        return;
      }
      P(io(k, /* @__PURE__ */ new Set([...b]))), S(io(A, /* @__PURE__ */ new Set(), !0));
    },
    unselectNodesAndEdges: ({ nodes: b, edges: N } = {}) => {
      const { edges: k, nodes: A, nodeLookup: S, triggerNodeChanges: P, triggerEdgeChanges: F } = x(), j = b || A, W = N || k, D = j.map((H) => {
        const L = S.get(H.id);
        return L && (L.selected = !1), Ir(H.id, !1);
      }), Z = W.map((H) => Ir(H.id, !1));
      P(D), F(Z);
    },
    setMinZoom: (b) => {
      const { panZoom: N, maxZoom: k } = x();
      N == null || N.setScaleExtent([b, k]), I({ minZoom: b });
    },
    setMaxZoom: (b) => {
      const { panZoom: N, minZoom: k } = x();
      N == null || N.setScaleExtent([k, b]), I({ maxZoom: b });
    },
    setTranslateExtent: (b) => {
      var N;
      (N = x().panZoom) == null || N.setTranslateExtent(b), I({ translateExtent: b });
    },
    resetSelectedElements: () => {
      const { edges: b, nodes: N, triggerNodeChanges: k, triggerEdgeChanges: A, elementsSelectable: S } = x();
      if (!S)
        return;
      const P = N.reduce((j, W) => W.selected ? [...j, Ir(W.id, !1)] : j, []), F = b.reduce((j, W) => W.selected ? [...j, Ir(W.id, !1)] : j, []);
      k(P), A(F);
    },
    setNodeExtent: (b) => {
      const { nodes: N, nodeLookup: k, parentLookup: A, nodeOrigin: S, elevateNodesOnSelect: P, nodeExtent: F, zIndexMode: j } = x();
      b[0][0] === F[0][0] && b[0][1] === F[0][1] && b[1][0] === F[1][0] && b[1][1] === F[1][1] || (cu(N, k, A, {
        nodeOrigin: S,
        nodeExtent: b,
        elevateNodesOnSelect: P,
        checkEquality: !1,
        zIndexMode: j
      }), I({ nodeExtent: b }));
    },
    panBy: (b) => {
      const { transform: N, width: k, height: A, panZoom: S, translateExtent: P } = x();
      return ab({ delta: b, panZoom: S, transform: N, translateExtent: P, width: k, height: A });
    },
    setCenter: async (b, N, k) => {
      const { width: A, height: S, maxZoom: P, panZoom: F } = x();
      if (!F)
        return Promise.resolve(!1);
      const j = typeof (k == null ? void 0 : k.zoom) < "u" ? k.zoom : P;
      return await F.setViewport({
        x: A / 2 - b * j,
        y: S / 2 - N * j,
        zoom: j
      }, { duration: k == null ? void 0 : k.duration, ease: k == null ? void 0 : k.ease, interpolate: k == null ? void 0 : k.interpolate }), Promise.resolve(!0);
    },
    cancelConnection: () => {
      I({
        connection: { ...fm }
      });
    },
    updateConnection: (b) => {
      I({ connection: b });
    },
    reset: () => I({ ...Ig() })
  };
}, Object.is);
function Gu({ initialNodes: e, initialEdges: r, defaultNodes: o, defaultEdges: s, initialWidth: i, initialHeight: l, initialMinZoom: c, initialMaxZoom: u, initialFitViewOptions: p, fitView: g, nodeOrigin: m, nodeExtent: h, zIndexMode: w, children: I }) {
  const [x] = R.useState(() => b_({
    nodes: e,
    edges: r,
    defaultNodes: o,
    defaultEdges: s,
    width: i,
    height: l,
    fitView: g,
    minZoom: c,
    maxZoom: u,
    fitViewOptions: p,
    nodeOrigin: m,
    nodeExtent: h,
    zIndexMode: w
  }));
  return f.jsx(Hb, { value: x, children: f.jsx(dN, { children: I }) });
}
function N_({ children: e, nodes: r, edges: o, defaultNodes: s, defaultEdges: i, width: l, height: c, fitView: u, fitViewOptions: p, minZoom: g, maxZoom: m, nodeOrigin: h, nodeExtent: w, zIndexMode: I }) {
  return R.useContext(Bi) ? f.jsx(f.Fragment, { children: e }) : f.jsx(Gu, { initialNodes: r, initialEdges: o, defaultNodes: s, defaultEdges: i, initialWidth: l, initialHeight: c, fitView: u, initialFitViewOptions: p, initialMinZoom: g, initialMaxZoom: m, nodeOrigin: h, nodeExtent: w, zIndexMode: I, children: e });
}
const __ = {
  width: "100%",
  height: "100%",
  overflow: "hidden",
  position: "relative",
  zIndex: 0
};
function A_({ nodes: e, edges: r, defaultNodes: o, defaultEdges: s, className: i, nodeTypes: l, edgeTypes: c, onNodeClick: u, onEdgeClick: p, onInit: g, onMove: m, onMoveStart: h, onMoveEnd: w, onConnect: I, onConnectStart: x, onConnectEnd: C, onClickConnectStart: b, onClickConnectEnd: N, onNodeMouseEnter: k, onNodeMouseMove: A, onNodeMouseLeave: S, onNodeContextMenu: P, onNodeDoubleClick: F, onNodeDragStart: j, onNodeDrag: W, onNodeDragStop: D, onNodesDelete: Z, onEdgesDelete: H, onDelete: L, onSelectionChange: ee, onSelectionDragStart: T, onSelectionDrag: Y, onSelectionDragStop: O, onSelectionContextMenu: U, onSelectionStart: E, onSelectionEnd: G, onBeforeDelete: K, connectionMode: M, connectionLineType: V = Jn.Bezier, connectionLineStyle: te, connectionLineComponent: re, connectionLineContainerStyle: le, deleteKeyCode: ue = "Backspace", selectionKeyCode: de = "Shift", selectionOnDrag: ne = !1, selectionMode: fe = Ca.Full, panActivationKeyCode: be = "Space", multiSelectionKeyCode: Ne = Na() ? "Meta" : "Control", zoomActivationKeyCode: Ce = Na() ? "Meta" : "Control", snapToGrid: xe, snapGrid: Te, onlyRenderVisibleElements: Be = !1, selectNodesOnDrag: je, nodesDraggable: We, autoPanOnNodeFocus: Ft, nodesConnectable: vt, nodesFocusable: xt, nodeOrigin: jt = Hm, edgesFocusable: cn, edgesReconnectable: kn, elementsSelectable: jr = !0, defaultViewport: er = tN, minZoom: un = 0.5, maxZoom: dn = 2, translateExtent: tr = Ia, preventScrolling: Ba = !0, nodeExtent: fn, defaultMarkerColor: nr = "#b1b1b7", zoomOnScroll: Fi = !0, zoomOnPinch: Ea = !0, panOnScroll: Da = !1, panOnScrollSpeed: Pi = 0.5, panOnScrollMode: xo = Nr.Free, zoomOnDoubleClick: Io = !0, panOnDrag: Co = !0, onPaneClick: bo, onPaneMouseEnter: No, onPaneMouseMove: jn, onPaneMouseLeave: Mn, onPaneScroll: Ga, onPaneContextMenu: Fa, paneClickDistance: Pa = 1, nodeClickDistance: za = 0, children: Va, onReconnect: _o, onReconnectStart: Oa, onReconnectEnd: rr, onEdgeContextMenu: Ao, onEdgeDoubleClick: or, onEdgeMouseEnter: zi, onEdgeMouseMove: ar, onEdgeMouseLeave: Mr, reconnectRadius: Tr = 10, onNodesChange: So, onEdgesChange: Vi, noDragClassName: Oi = "nodrag", noWheelClassName: Hi = "nowheel", noPanClassName: Qt = "nopan", fitView: ko, fitViewOptions: jo, connectOnClick: Wi, attributionPosition: Ha, proOptions: Wa, defaultEdgeOptions: Xa, elevateNodesOnSelect: La = !0, elevateEdgesOnSelect: Xi = !1, disableKeyboardA11y: Ka = !1, autoPanOnConnect: Xe, autoPanOnNodeDrag: Li, autoPanSpeed: Mo, connectionRadius: Za, isValidConnection: Rr, onError: Ki, style: Ya, id: sr, nodeDragThreshold: Mt, connectionDragThreshold: Zi, viewport: It, onViewportChange: Yi, width: Ui, height: $i, colorMode: Br = "light", debug: Er, onScroll: Jt, ariaLabelConfig: Dr, zIndexMode: Ua = "basic", ...Qi }, To) {
  const Gr = sr || "1", Ro = aN(Br), ir = R.useCallback(($a) => {
    $a.currentTarget.scrollTo({ top: 0, left: 0, behavior: "instant" }), Jt == null || Jt($a);
  }, [Jt]);
  return f.jsx("div", { "data-testid": "rf__wrapper", ...Qi, onScroll: ir, style: { ...Ya, ...__ }, ref: To, className: $e(["react-flow", i, Ro]), id: sr, role: "application", children: f.jsxs(N_, { nodes: e, edges: r, width: Ui, height: $i, fitView: ko, fitViewOptions: jo, minZoom: un, maxZoom: dn, nodeOrigin: jt, nodeExtent: fn, zIndexMode: Ua, children: [f.jsx(C_, { onInit: g, onNodeClick: u, onEdgeClick: p, onNodeMouseEnter: k, onNodeMouseMove: A, onNodeMouseLeave: S, onNodeContextMenu: P, onNodeDoubleClick: F, nodeTypes: l, edgeTypes: c, connectionLineType: V, connectionLineStyle: te, connectionLineComponent: re, connectionLineContainerStyle: le, selectionKeyCode: de, selectionOnDrag: ne, selectionMode: fe, deleteKeyCode: ue, multiSelectionKeyCode: Ne, panActivationKeyCode: be, zoomActivationKeyCode: Ce, onlyRenderVisibleElements: Be, defaultViewport: er, translateExtent: tr, minZoom: un, maxZoom: dn, preventScrolling: Ba, zoomOnScroll: Fi, zoomOnPinch: Ea, zoomOnDoubleClick: Io, panOnScroll: Da, panOnScrollSpeed: Pi, panOnScrollMode: xo, panOnDrag: Co, onPaneClick: bo, onPaneMouseEnter: No, onPaneMouseMove: jn, onPaneMouseLeave: Mn, onPaneScroll: Ga, onPaneContextMenu: Fa, paneClickDistance: Pa, nodeClickDistance: za, onSelectionContextMenu: U, onSelectionStart: E, onSelectionEnd: G, onReconnect: _o, onReconnectStart: Oa, onReconnectEnd: rr, onEdgeContextMenu: Ao, onEdgeDoubleClick: or, onEdgeMouseEnter: zi, onEdgeMouseMove: ar, onEdgeMouseLeave: Mr, reconnectRadius: Tr, defaultMarkerColor: nr, noDragClassName: Oi, noWheelClassName: Hi, noPanClassName: Qt, rfId: Gr, disableKeyboardA11y: Ka, nodeExtent: fn, viewport: It, onViewportChange: Yi }), f.jsx(oN, { nodes: e, edges: r, defaultNodes: o, defaultEdges: s, onConnect: I, onConnectStart: x, onConnectEnd: C, onClickConnectStart: b, onClickConnectEnd: N, nodesDraggable: We, autoPanOnNodeFocus: Ft, nodesConnectable: vt, nodesFocusable: xt, edgesFocusable: cn, edgesReconnectable: kn, elementsSelectable: jr, elevateNodesOnSelect: La, elevateEdgesOnSelect: Xi, minZoom: un, maxZoom: dn, nodeExtent: fn, onNodesChange: So, onEdgesChange: Vi, snapToGrid: xe, snapGrid: Te, connectionMode: M, translateExtent: tr, connectOnClick: Wi, defaultEdgeOptions: Xa, fitView: ko, fitViewOptions: jo, onNodesDelete: Z, onEdgesDelete: H, onDelete: L, onNodeDragStart: j, onNodeDrag: W, onNodeDragStop: D, onSelectionDrag: Y, onSelectionDragStart: T, onSelectionDragStop: O, onMove: m, onMoveStart: h, onMoveEnd: w, noPanClassName: Qt, nodeOrigin: jt, rfId: Gr, autoPanOnConnect: Xe, autoPanOnNodeDrag: Li, autoPanSpeed: Mo, onError: Ki, connectionRadius: Za, isValidConnection: Rr, selectNodesOnDrag: je, nodeDragThreshold: Mt, connectionDragThreshold: Zi, onBeforeDelete: K, debug: Er, ariaLabelConfig: Dr, zIndexMode: Ua }), f.jsx(eN, { onSelectionChange: ee }), Va, f.jsx(Ub, { proOptions: Wa, position: Ha }), f.jsx(Yb, { rfId: Gr, disableKeyboardA11y: Ka })] }) });
}
var S_ = Xm(A_);
const k_ = (e) => {
  var r;
  return (r = e.domNode) == null ? void 0 : r.querySelector(".react-flow__edgelabel-renderer");
};
function j_({ children: e }) {
  const r = Re(k_);
  return r ? Ob.createPortal(e, r) : null;
}
function M_({ dimensions: e, lineWidth: r, variant: o, className: s }) {
  return f.jsx("path", { strokeWidth: r, d: `M${e[0] / 2} 0 V${e[1]} M0 ${e[1] / 2} H${e[0]}`, className: $e(["react-flow__background-pattern", o, s]) });
}
function T_({ radius: e, className: r }) {
  return f.jsx("circle", { cx: e, cy: e, r: e, className: $e(["react-flow__background-pattern", "dots", r]) });
}
var _n;
(function(e) {
  e.Lines = "lines", e.Dots = "dots", e.Cross = "cross";
})(_n || (_n = {}));
const R_ = {
  [_n.Dots]: 1,
  [_n.Lines]: 1,
  [_n.Cross]: 6
}, B_ = (e) => ({ transform: e.transform, patternId: `pattern-${e.rfId}` });
function gh({
  id: e,
  variant: r = _n.Dots,
  // only used for dots and cross
  gap: o = 20,
  // only used for lines and cross
  size: s,
  lineWidth: i = 1,
  offset: l = 0,
  color: c,
  bgColor: u,
  style: p,
  className: g,
  patternClassName: m
}) {
  const h = R.useRef(null), { transform: w, patternId: I } = Re(B_, Oe), x = s || R_[r], C = r === _n.Dots, b = r === _n.Cross, N = Array.isArray(o) ? o : [o, o], k = [N[0] * w[2] || 1, N[1] * w[2] || 1], A = x * w[2], S = Array.isArray(l) ? l : [l, l], P = b ? [A, A] : k, F = [
    S[0] * w[2] || 1 + P[0] / 2,
    S[1] * w[2] || 1 + P[1] / 2
  ], j = `${I}${e || ""}`;
  return f.jsxs("svg", { className: $e(["react-flow__background", g]), style: {
    ...p,
    ...Ei,
    "--xy-background-color-props": u,
    "--xy-background-pattern-color-props": c
  }, ref: h, "data-testid": "rf__background", children: [f.jsx("pattern", { id: j, x: w[0] % k[0], y: w[1] % k[1], width: k[0], height: k[1], patternUnits: "userSpaceOnUse", patternTransform: `translate(-${F[0]},-${F[1]})`, children: C ? f.jsx(T_, { radius: A / 2, className: m }) : f.jsx(M_, { dimensions: P, lineWidth: i, variant: r, className: m }) }), f.jsx("rect", { x: "0", y: "0", width: "100%", height: "100%", fill: `url(#${j})` })] });
}
gh.displayName = "Background";
const E_ = R.memo(gh);
function D_() {
  return f.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 32", children: f.jsx("path", { d: "M32 18.133H18.133V32h-4.266V18.133H0v-4.266h13.867V0h4.266v13.867H32z" }) });
}
function G_() {
  return f.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 5", children: f.jsx("path", { d: "M0 0h32v4.2H0z" }) });
}
function F_() {
  return f.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 30", children: f.jsx("path", { d: "M3.692 4.63c0-.53.4-.938.939-.938h5.215V0H4.708C2.13 0 0 2.054 0 4.63v5.216h3.692V4.631zM27.354 0h-5.2v3.692h5.17c.53 0 .984.4.984.939v5.215H32V4.631A4.624 4.624 0 0027.354 0zm.954 24.83c0 .532-.4.94-.939.94h-5.215v3.768h5.215c2.577 0 4.631-2.13 4.631-4.707v-5.139h-3.692v5.139zm-23.677.94c-.531 0-.939-.4-.939-.94v-5.138H0v5.139c0 2.577 2.13 4.707 4.708 4.707h5.138V25.77H4.631z" }) });
}
function P_() {
  return f.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 25 32", children: f.jsx("path", { d: "M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0 8 0 4.571 3.429 4.571 7.619v3.048H3.048A3.056 3.056 0 000 13.714v15.238A3.056 3.056 0 003.048 32h18.285a3.056 3.056 0 003.048-3.048V13.714a3.056 3.056 0 00-3.048-3.047zM12.19 24.533a3.056 3.056 0 01-3.047-3.047 3.056 3.056 0 013.047-3.048 3.056 3.056 0 013.048 3.048 3.056 3.056 0 01-3.048 3.047zm4.724-13.866H7.467V7.619c0-2.59 2.133-4.724 4.723-4.724 2.591 0 4.724 2.133 4.724 4.724v3.048z" }) });
}
function z_() {
  return f.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 25 32", children: f.jsx("path", { d: "M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0c-4.114 1.828-1.37 2.133.305 2.438 1.676.305 4.42 2.59 4.42 5.181v3.048H3.047A3.056 3.056 0 000 13.714v15.238A3.056 3.056 0 003.048 32h18.285a3.056 3.056 0 003.048-3.048V13.714a3.056 3.056 0 00-3.048-3.047zM12.19 24.533a3.056 3.056 0 01-3.047-3.047 3.056 3.056 0 013.047-3.048 3.056 3.056 0 013.048 3.048 3.056 3.056 0 01-3.048 3.047z" }) });
}
function si({ children: e, className: r, ...o }) {
  return f.jsx("button", { type: "button", className: $e(["react-flow__controls-button", r]), ...o, children: e });
}
const V_ = (e) => ({
  isInteractive: e.nodesDraggable || e.nodesConnectable || e.elementsSelectable,
  minZoomReached: e.transform[2] <= e.minZoom,
  maxZoomReached: e.transform[2] >= e.maxZoom,
  ariaLabelConfig: e.ariaLabelConfig
});
function mh({ style: e, showZoom: r = !0, showFitView: o = !0, showInteractive: s = !0, fitViewOptions: i, onZoomIn: l, onZoomOut: c, onFitView: u, onInteractiveChange: p, className: g, children: m, position: h = "bottom-left", orientation: w = "vertical", "aria-label": I }) {
  const x = He(), { isInteractive: C, minZoomReached: b, maxZoomReached: N, ariaLabelConfig: k } = Re(V_, Oe), { zoomIn: A, zoomOut: S, fitView: P } = Eu(), F = () => {
    A(), l == null || l();
  }, j = () => {
    S(), c == null || c();
  }, W = () => {
    P(i), u == null || u();
  }, D = () => {
    x.setState({
      nodesDraggable: !C,
      nodesConnectable: !C,
      elementsSelectable: !C
    }), p == null || p(!C);
  }, Z = w === "horizontal" ? "horizontal" : "vertical";
  return f.jsxs(Cn, { className: $e(["react-flow__controls", Z, g]), position: h, style: e, "data-testid": "rf__controls", "aria-label": I ?? k["controls.ariaLabel"], children: [r && f.jsxs(f.Fragment, { children: [f.jsx(si, { onClick: F, className: "react-flow__controls-zoomin", title: k["controls.zoomIn.ariaLabel"], "aria-label": k["controls.zoomIn.ariaLabel"], disabled: N, children: f.jsx(D_, {}) }), f.jsx(si, { onClick: j, className: "react-flow__controls-zoomout", title: k["controls.zoomOut.ariaLabel"], "aria-label": k["controls.zoomOut.ariaLabel"], disabled: b, children: f.jsx(G_, {}) })] }), o && f.jsx(si, { className: "react-flow__controls-fitview", onClick: W, title: k["controls.fitView.ariaLabel"], "aria-label": k["controls.fitView.ariaLabel"], children: f.jsx(F_, {}) }), s && f.jsx(si, { className: "react-flow__controls-interactive", onClick: D, title: k["controls.interactive.ariaLabel"], "aria-label": k["controls.interactive.ariaLabel"], children: C ? f.jsx(z_, {}) : f.jsx(P_, {}) }), m] });
}
mh.displayName = "Controls";
const O_ = R.memo(mh);
function H_({ id: e, x: r, y: o, width: s, height: i, style: l, color: c, strokeColor: u, strokeWidth: p, className: g, borderRadius: m, shapeRendering: h, selected: w, onClick: I }) {
  const { background: x, backgroundColor: C } = l || {}, b = c || x || C;
  return f.jsx("rect", { className: $e(["react-flow__minimap-node", { selected: w }, g]), x: r, y: o, rx: m, ry: m, width: s, height: i, style: {
    fill: b,
    stroke: u,
    strokeWidth: p
  }, shapeRendering: h, onClick: I ? (N) => I(N, e) : void 0 });
}
const W_ = R.memo(H_), X_ = (e) => e.nodes.map((r) => r.id), Kc = (e) => e instanceof Function ? e : () => e;
function L_({
  nodeStrokeColor: e,
  nodeColor: r,
  nodeClassName: o = "",
  nodeBorderRadius: s = 5,
  nodeStrokeWidth: i,
  /*
   * We need to rename the prop to be `CapitalCase` so that JSX will render it as
   * a component properly.
   */
  nodeComponent: l = W_,
  onClick: c
}) {
  const u = Re(X_, Oe), p = Kc(r), g = Kc(e), m = Kc(o), h = typeof window > "u" || window.chrome ? "crispEdges" : "geometricPrecision";
  return f.jsx(f.Fragment, { children: u.map((w) => (
    /*
     * The split of responsibilities between MiniMapNodes and
     * NodeComponentWrapper may appear weird. However, it’s designed to
     * minimize the cost of updates when individual nodes change.
     *
     * For more details, see a similar commit in `NodeRenderer/index.tsx`.
     */
    f.jsx(Z_, { id: w, nodeColorFunc: p, nodeStrokeColorFunc: g, nodeClassNameFunc: m, nodeBorderRadius: s, nodeStrokeWidth: i, NodeComponent: l, onClick: c, shapeRendering: h }, w)
  )) });
}
function K_({ id: e, nodeColorFunc: r, nodeStrokeColorFunc: o, nodeClassNameFunc: s, nodeBorderRadius: i, nodeStrokeWidth: l, shapeRendering: c, NodeComponent: u, onClick: p }) {
  const { node: g, x: m, y: h, width: w, height: I } = Re((x) => {
    const { internals: C } = x.nodeLookup.get(e), b = C.userNode, { x: N, y: k } = C.positionAbsolute, { width: A, height: S } = Sn(b);
    return {
      node: b,
      x: N,
      y: k,
      width: A,
      height: S
    };
  }, Oe);
  return !g || g.hidden || !vm(g) ? null : f.jsx(u, { x: m, y: h, width: w, height: I, style: g.style, selected: !!g.selected, className: s(g), color: r(g), borderRadius: i, strokeColor: o(g), strokeWidth: l, shapeRendering: c, onClick: p, id: g.id });
}
const Z_ = R.memo(K_);
var Y_ = R.memo(L_);
const U_ = 200, $_ = 150, Q_ = (e) => !e.hidden, J_ = (e) => {
  const r = {
    x: -e.transform[0] / e.transform[2],
    y: -e.transform[1] / e.transform[2],
    width: e.width / e.transform[2],
    height: e.height / e.transform[2]
  };
  return {
    viewBB: r,
    boundingRect: e.nodeLookup.size > 0 ? wm(Ma(e.nodeLookup, { filter: Q_ }), r) : r,
    rfId: e.rfId,
    panZoom: e.panZoom,
    translateExtent: e.translateExtent,
    flowWidth: e.width,
    flowHeight: e.height,
    ariaLabelConfig: e.ariaLabelConfig
  };
}, q_ = "react-flow__minimap-desc";
function hh({
  style: e,
  className: r,
  nodeStrokeColor: o,
  nodeColor: s,
  nodeClassName: i = "",
  nodeBorderRadius: l = 5,
  nodeStrokeWidth: c,
  /*
   * We need to rename the prop to be `CapitalCase` so that JSX will render it as
   * a component properly.
   */
  nodeComponent: u,
  bgColor: p,
  maskColor: g,
  maskStrokeColor: m,
  maskStrokeWidth: h,
  position: w = "bottom-right",
  onClick: I,
  onNodeClick: x,
  pannable: C = !1,
  zoomable: b = !1,
  ariaLabel: N,
  inversePan: k,
  zoomStep: A = 1,
  offsetScale: S = 5
}) {
  const P = He(), F = R.useRef(null), { boundingRect: j, viewBB: W, rfId: D, panZoom: Z, translateExtent: H, flowWidth: L, flowHeight: ee, ariaLabelConfig: T } = Re(J_, Oe), Y = (e == null ? void 0 : e.width) ?? U_, O = (e == null ? void 0 : e.height) ?? $_, U = j.width / Y, E = j.height / O, G = Math.max(U, E), K = G * Y, M = G * O, V = S * G, te = j.x - (K - j.width) / 2 - V, re = j.y - (M - j.height) / 2 - V, le = K + V * 2, ue = M + V * 2, de = `${q_}-${D}`, ne = R.useRef(0), fe = R.useRef();
  ne.current = G, R.useEffect(() => {
    if (F.current && Z)
      return fe.current = gb({
        domNode: F.current,
        panZoom: Z,
        getTransform: () => P.getState().transform,
        getViewScale: () => ne.current
      }), () => {
        var xe;
        (xe = fe.current) == null || xe.destroy();
      };
  }, [Z]), R.useEffect(() => {
    var xe;
    (xe = fe.current) == null || xe.update({
      translateExtent: H,
      width: L,
      height: ee,
      inversePan: k,
      pannable: C,
      zoomStep: A,
      zoomable: b
    });
  }, [C, b, k, A, H, L, ee]);
  const be = I ? (xe) => {
    var je;
    const [Te, Be] = ((je = fe.current) == null ? void 0 : je.pointer(xe)) || [0, 0];
    I(xe, { x: Te, y: Be });
  } : void 0, Ne = x ? R.useCallback((xe, Te) => {
    const Be = P.getState().nodeLookup.get(Te).internals.userNode;
    x(xe, Be);
  }, []) : void 0, Ce = N ?? T["minimap.ariaLabel"];
  return f.jsx(Cn, { position: w, style: {
    ...e,
    "--xy-minimap-background-color-props": typeof p == "string" ? p : void 0,
    "--xy-minimap-mask-background-color-props": typeof g == "string" ? g : void 0,
    "--xy-minimap-mask-stroke-color-props": typeof m == "string" ? m : void 0,
    "--xy-minimap-mask-stroke-width-props": typeof h == "number" ? h * G : void 0,
    "--xy-minimap-node-background-color-props": typeof s == "string" ? s : void 0,
    "--xy-minimap-node-stroke-color-props": typeof o == "string" ? o : void 0,
    "--xy-minimap-node-stroke-width-props": typeof c == "number" ? c : void 0
  }, className: $e(["react-flow__minimap", r]), "data-testid": "rf__minimap", children: f.jsxs("svg", { width: Y, height: O, viewBox: `${te} ${re} ${le} ${ue}`, className: "react-flow__minimap-svg", role: "img", "aria-labelledby": de, ref: F, onClick: be, children: [Ce && f.jsx("title", { id: de, children: Ce }), f.jsx(Y_, { onClick: Ne, nodeColor: s, nodeStrokeColor: o, nodeBorderRadius: l, nodeClassName: i, nodeStrokeWidth: c, nodeComponent: u }), f.jsx("path", { className: "react-flow__minimap-mask", d: `M${te - V},${re - V}h${le + V * 2}v${ue + V * 2}h${-le - V * 2}z
        M${W.x},${W.y}h${W.width}v${W.height}h${-W.width}z`, fillRule: "evenodd", pointerEvents: "none" })] }) });
}
hh.displayName = "MiniMap";
const e2 = R.memo(hh), t2 = (e) => (r) => e ? `${Math.max(1 / r.transform[2], 1)}` : void 0, n2 = {
  [yo.Line]: "right",
  [yo.Handle]: "bottom-right"
};
function r2({ nodeId: e, position: r, variant: o = yo.Handle, className: s, style: i = void 0, children: l, color: c, minWidth: u = 10, minHeight: p = 10, maxWidth: g = Number.MAX_VALUE, maxHeight: m = Number.MAX_VALUE, keepAspectRatio: h = !1, resizeDirection: w, autoScale: I = !0, shouldResize: x, onResizeStart: C, onResize: b, onResizeEnd: N }) {
  const k = Ym(), A = typeof e == "string" ? e : k, S = He(), P = R.useRef(null), F = o === yo.Handle, j = Re(R.useCallback(t2(F && I), [F, I]), Oe), W = R.useRef(null), D = r ?? n2[o];
  R.useEffect(() => {
    if (!(!P.current || !A))
      return W.current || (W.current = kb({
        domNode: P.current,
        nodeId: A,
        getStoreItems: () => {
          const { nodeLookup: H, transform: L, snapGrid: ee, snapToGrid: T, nodeOrigin: Y, domNode: O } = S.getState();
          return {
            nodeLookup: H,
            transform: L,
            snapGrid: ee,
            snapToGrid: T,
            nodeOrigin: Y,
            paneDomNode: O
          };
        },
        onChange: (H, L) => {
          const { triggerNodeChanges: ee, nodeLookup: T, parentLookup: Y, nodeOrigin: O } = S.getState(), U = [], E = { x: H.x, y: H.y }, G = T.get(A);
          if (G && G.expandParent && G.parentId) {
            const K = G.origin ?? O, M = H.width ?? G.measured.width ?? 0, V = H.height ?? G.measured.height ?? 0, te = {
              id: G.id,
              parentId: G.parentId,
              rect: {
                width: M,
                height: V,
                ...xm({
                  x: H.x ?? G.position.x,
                  y: H.y ?? G.position.y
                }, { width: M, height: V }, G.parentId, T, K)
              }
            }, re = Tu([te], T, Y, O);
            U.push(...re), E.x = H.x ? Math.max(K[0] * M, H.x) : void 0, E.y = H.y ? Math.max(K[1] * V, H.y) : void 0;
          }
          if (E.x !== void 0 && E.y !== void 0) {
            const K = {
              id: A,
              type: "position",
              position: { ...E }
            };
            U.push(K);
          }
          if (H.width !== void 0 && H.height !== void 0) {
            const M = {
              id: A,
              type: "dimensions",
              resizing: !0,
              setAttributes: w ? w === "horizontal" ? "width" : "height" : !0,
              dimensions: {
                width: H.width,
                height: H.height
              }
            };
            U.push(M);
          }
          for (const K of L) {
            const M = {
              ...K,
              type: "position"
            };
            U.push(M);
          }
          ee(U);
        },
        onEnd: ({ width: H, height: L }) => {
          const ee = {
            id: A,
            type: "dimensions",
            resizing: !1,
            dimensions: {
              width: H,
              height: L
            }
          };
          S.getState().triggerNodeChanges([ee]);
        }
      })), W.current.update({
        controlPosition: D,
        boundaries: {
          minWidth: u,
          minHeight: p,
          maxWidth: g,
          maxHeight: m
        },
        keepAspectRatio: h,
        resizeDirection: w,
        onResizeStart: C,
        onResize: b,
        onResizeEnd: N,
        shouldResize: x
      }), () => {
        var H;
        (H = W.current) == null || H.destroy();
      };
  }, [
    D,
    u,
    p,
    g,
    m,
    h,
    C,
    b,
    N,
    x
  ]);
  const Z = D.split("-");
  return f.jsx("div", { className: $e(["react-flow__resize-control", "nodrag", ...Z, o, s]), ref: P, style: {
    ...i,
    scale: j,
    ...c && { [F ? "backgroundColor" : "borderColor"]: c }
  }, children: l });
}
R.memo(r2);
const vo = /* @__PURE__ */ new Map();
function Se(e) {
  vo.set(e.manifest.type, e);
}
function ct(e) {
  const r = vo.get(e);
  if (!r) throw new Error(`Unknown module type: ${e}`);
  return r.manifest;
}
function yh(e) {
  const r = vo.get(e);
  if (!r) throw new Error(`Unknown module type: ${e}`);
  return r.factory;
}
function o2() {
  const e = {};
  for (const [r, o] of vo)
    e[r] = o.component;
  return e;
}
function a2() {
  return Array.from(vo.values()).map((e) => e.manifest);
}
function s2() {
  vo.clear();
}
function i2(e, r, o) {
  if (r === o || r === "mono" && o === "stereo") return null;
  const s = e.createChannelSplitter(2), i = e.createChannelMerger(1), l = e.createGain(), c = e.createGain();
  return l.gain.value = 0.707, c.gain.value = 0.707, s.connect(l, 0), s.connect(c, 1), l.connect(i, 0, 0), c.connect(i, 0, 0), { input: s, output: i };
}
const wh = /* @__PURE__ */ new Map();
function l2(e, r) {
  wh.set(e, r);
}
function Di(e) {
  return wh.get(e);
}
function vh(e, r) {
  const o = new Float32Array(r), s = e.numberOfChannels, i = e.length, l = i / r, c = [];
  for (let u = 0; u < s; u++)
    c.push(e.getChannelData(u));
  for (let u = 0; u < r; u++) {
    const p = Math.floor(u * l), g = Math.min(Math.floor((u + 1) * l), i);
    let m = 0;
    for (let h = p; h < g; h++) {
      let w = 0;
      for (let x = 0; x < s; x++)
        w += Math.abs(c[x][h]);
      const I = w / s;
      I > m && (m = I);
    }
    o[u] = m;
  }
  return o;
}
function c2(e, r) {
  const o = new Float32Array(r), s = new Float32Array(r), i = e.length, l = i / r, c = e.getChannelData(0), u = e.numberOfChannels > 1 ? e.getChannelData(1) : c;
  for (let p = 0; p < r; p++) {
    const g = Math.floor(p * l), m = Math.min(Math.floor((p + 1) * l), i);
    let h = 0, w = 0;
    for (let I = g; I < m; I++) {
      const x = Math.abs(c[I]), C = Math.abs(u[I]);
      x > h && (h = x), C > w && (w = C);
    }
    o[p] = h, s[p] = w;
  }
  return { left: o, right: s };
}
let xh = null;
function u2(e) {
  xh = e;
}
function d2() {
  return xh;
}
let Cg = !1;
async function f2(e) {
  Cg || (await e.audioWorklet.addModule(
    new URL("data:text/javascript;base64,LyoqCiAqIEF0b21pYyBEU1AgUHJpbWl0aXZlIFByb2Nlc3NvcnMKICoKICogVGhlc2UgQXVkaW9Xb3JrbGV0UHJvY2Vzc29ycyBhcmUgdGhlIGlycmVkdWNpYmxlIGJ1aWxkaW5nIGJsb2NrcyBmcm9tIHdoaWNoCiAqIGFsbCBjb21wb3NpdGUgbW9kdWxlcyAoY29tcHJlc3NvciwgRVEsIGRlbGF5LCBldGMuKSBhcmUgY29uc3RydWN0ZWQuCiAqIEVhY2ggb3BlcmF0ZXMgc2FtcGxlLWJ5LXNhbXBsZSBvbiAxMjgtc2FtcGxlIGZyYW1lcy4KICovCgovLyDilIDilIDilIAgTWF0aCBPcGVyYXRpb25zIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgAoKY2xhc3MgTXVsdGlwbHlQcm9jZXNzb3IgZXh0ZW5kcyBBdWRpb1dvcmtsZXRQcm9jZXNzb3IgewogIHByb2Nlc3MoaW5wdXRzLCBvdXRwdXRzKSB7CiAgICBjb25zdCBhID0gaW5wdXRzWzBdOwogICAgY29uc3QgYiA9IGlucHV0c1sxXTsKICAgIGNvbnN0IG91dCA9IG91dHB1dHNbMF07CiAgICBmb3IgKGxldCBjaCA9IDA7IGNoIDwgb3V0Lmxlbmd0aDsgY2grKykgewogICAgICBjb25zdCBvdXRDaCA9IG91dFtjaF07CiAgICAgIGNvbnN0IGFDaCA9IGFbMF0gPyBhWzBdW2NoXSB8fCBhWzBdWzBdIDogbnVsbDsKICAgICAgY29uc3QgYkNoID0gYlswXSA/IGJbMF1bY2hdIHx8IGJbMF1bMF0gOiBudWxsOwogICAgICBpZiAoYUNoICYmIGJDaCkgewogICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3V0Q2gubGVuZ3RoOyBpKyspIHsKICAgICAgICAgIG91dENoW2ldID0gYUNoW2ldICogYkNoW2ldOwogICAgICAgIH0KICAgICAgfQogICAgfQogICAgcmV0dXJuIHRydWU7CiAgfQp9CnJlZ2lzdGVyUHJvY2Vzc29yKCdtdWx0aXBseS1wcm9jZXNzb3InLCBNdWx0aXBseVByb2Nlc3Nvcik7CgpjbGFzcyBBZGRQcm9jZXNzb3IgZXh0ZW5kcyBBdWRpb1dvcmtsZXRQcm9jZXNzb3IgewogIHByb2Nlc3MoaW5wdXRzLCBvdXRwdXRzKSB7CiAgICBjb25zdCBhID0gaW5wdXRzWzBdOwogICAgY29uc3QgYiA9IGlucHV0c1sxXTsKICAgIGNvbnN0IG91dCA9IG91dHB1dHNbMF07CiAgICBmb3IgKGxldCBjaCA9IDA7IGNoIDwgb3V0Lmxlbmd0aDsgY2grKykgewogICAgICBjb25zdCBvdXRDaCA9IG91dFtjaF07CiAgICAgIGNvbnN0IGFDaCA9IGFbMF0gPyBhWzBdW2NoXSB8fCBhWzBdWzBdIDogbnVsbDsKICAgICAgY29uc3QgYkNoID0gYlswXSA/IGJbMF1bY2hdIHx8IGJbMF1bMF0gOiBudWxsOwogICAgICBpZiAoYUNoICYmIGJDaCkgewogICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3V0Q2gubGVuZ3RoOyBpKyspIHsKICAgICAgICAgIG91dENoW2ldID0gYUNoW2ldICsgYkNoW2ldOwogICAgICAgIH0KICAgICAgfSBlbHNlIGlmIChhQ2gpIHsKICAgICAgICBvdXRDaC5zZXQoYUNoKTsKICAgICAgfSBlbHNlIGlmIChiQ2gpIHsKICAgICAgICBvdXRDaC5zZXQoYkNoKTsKICAgICAgfQogICAgfQogICAgcmV0dXJuIHRydWU7CiAgfQp9CnJlZ2lzdGVyUHJvY2Vzc29yKCdhZGQtcHJvY2Vzc29yJywgQWRkUHJvY2Vzc29yKTsKCmNsYXNzIFN1YnRyYWN0UHJvY2Vzc29yIGV4dGVuZHMgQXVkaW9Xb3JrbGV0UHJvY2Vzc29yIHsKICBwcm9jZXNzKGlucHV0cywgb3V0cHV0cykgewogICAgY29uc3QgYSA9IGlucHV0c1swXTsKICAgIGNvbnN0IGIgPSBpbnB1dHNbMV07CiAgICBjb25zdCBvdXQgPSBvdXRwdXRzWzBdOwogICAgZm9yIChsZXQgY2ggPSAwOyBjaCA8IG91dC5sZW5ndGg7IGNoKyspIHsKICAgICAgY29uc3Qgb3V0Q2ggPSBvdXRbY2hdOwogICAgICBjb25zdCBhQ2ggPSBhWzBdID8gYVswXVtjaF0gfHwgYVswXVswXSA6IG51bGw7CiAgICAgIGNvbnN0IGJDaCA9IGJbMF0gPyBiWzBdW2NoXSB8fCBiWzBdWzBdIDogbnVsbDsKICAgICAgaWYgKGFDaCAmJiBiQ2gpIHsKICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG91dENoLmxlbmd0aDsgaSsrKSB7CiAgICAgICAgICBvdXRDaFtpXSA9IGFDaFtpXSAtIGJDaFtpXTsKICAgICAgICB9CiAgICAgIH0gZWxzZSBpZiAoYUNoKSB7CiAgICAgICAgb3V0Q2guc2V0KGFDaCk7CiAgICAgIH0KICAgIH0KICAgIHJldHVybiB0cnVlOwogIH0KfQpyZWdpc3RlclByb2Nlc3Nvcignc3VidHJhY3QtcHJvY2Vzc29yJywgU3VidHJhY3RQcm9jZXNzb3IpOwoKY2xhc3MgQWJzUHJvY2Vzc29yIGV4dGVuZHMgQXVkaW9Xb3JrbGV0UHJvY2Vzc29yIHsKICBwcm9jZXNzKGlucHV0cywgb3V0cHV0cykgewogICAgY29uc3QgaW5wdXQgPSBpbnB1dHNbMF07CiAgICBjb25zdCBvdXQgPSBvdXRwdXRzWzBdOwogICAgZm9yIChsZXQgY2ggPSAwOyBjaCA8IG91dC5sZW5ndGg7IGNoKyspIHsKICAgICAgY29uc3Qgb3V0Q2ggPSBvdXRbY2hdOwogICAgICBjb25zdCBpbkNoID0gaW5wdXRbMF0gPyBpbnB1dFswXVtjaF0gfHwgaW5wdXRbMF1bMF0gOiBudWxsOwogICAgICBpZiAoaW5DaCkgewogICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3V0Q2gubGVuZ3RoOyBpKyspIHsKICAgICAgICAgIG91dENoW2ldID0gTWF0aC5hYnMoaW5DaFtpXSk7CiAgICAgICAgfQogICAgICB9CiAgICB9CiAgICByZXR1cm4gdHJ1ZTsKICB9Cn0KcmVnaXN0ZXJQcm9jZXNzb3IoJ2Ficy1wcm9jZXNzb3InLCBBYnNQcm9jZXNzb3IpOwoKLy8g4pSA4pSA4pSAIENvbXBhcmlzb24gT3BlcmF0aW9ucyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIAKCmNsYXNzIE1heFByb2Nlc3NvciBleHRlbmRzIEF1ZGlvV29ya2xldFByb2Nlc3NvciB7CiAgcHJvY2VzcyhpbnB1dHMsIG91dHB1dHMpIHsKICAgIGNvbnN0IGEgPSBpbnB1dHNbMF07CiAgICBjb25zdCBiID0gaW5wdXRzWzFdOwogICAgY29uc3Qgb3V0ID0gb3V0cHV0c1swXTsKICAgIGZvciAobGV0IGNoID0gMDsgY2ggPCBvdXQubGVuZ3RoOyBjaCsrKSB7CiAgICAgIGNvbnN0IG91dENoID0gb3V0W2NoXTsKICAgICAgY29uc3QgYUNoID0gYVswXSA/IGFbMF1bY2hdIHx8IGFbMF1bMF0gOiBudWxsOwogICAgICBjb25zdCBiQ2ggPSBiWzBdID8gYlswXVtjaF0gfHwgYlswXVswXSA6IG51bGw7CiAgICAgIGlmIChhQ2ggJiYgYkNoKSB7CiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvdXRDaC5sZW5ndGg7IGkrKykgewogICAgICAgICAgb3V0Q2hbaV0gPSBNYXRoLm1heChhQ2hbaV0sIGJDaFtpXSk7CiAgICAgICAgfQogICAgICB9IGVsc2UgaWYgKGFDaCkgewogICAgICAgIG91dENoLnNldChhQ2gpOwogICAgICB9IGVsc2UgaWYgKGJDaCkgewogICAgICAgIG91dENoLnNldChiQ2gpOwogICAgICB9CiAgICB9CiAgICByZXR1cm4gdHJ1ZTsKICB9Cn0KcmVnaXN0ZXJQcm9jZXNzb3IoJ21heC1wcm9jZXNzb3InLCBNYXhQcm9jZXNzb3IpOwoKY2xhc3MgQ29tcGFyZUd0UHJvY2Vzc29yIGV4dGVuZHMgQXVkaW9Xb3JrbGV0UHJvY2Vzc29yIHsKICBwcm9jZXNzKGlucHV0cywgb3V0cHV0cykgewogICAgY29uc3QgYSA9IGlucHV0c1swXTsKICAgIGNvbnN0IGIgPSBpbnB1dHNbMV07CiAgICBjb25zdCBvdXQgPSBvdXRwdXRzWzBdOwogICAgZm9yIChsZXQgY2ggPSAwOyBjaCA8IG91dC5sZW5ndGg7IGNoKyspIHsKICAgICAgY29uc3Qgb3V0Q2ggPSBvdXRbY2hdOwogICAgICBjb25zdCBhQ2ggPSBhWzBdID8gYVswXVtjaF0gfHwgYVswXVswXSA6IG51bGw7CiAgICAgIGNvbnN0IGJDaCA9IGJbMF0gPyBiWzBdW2NoXSB8fCBiWzBdWzBdIDogbnVsbDsKICAgICAgaWYgKGFDaCAmJiBiQ2gpIHsKICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG91dENoLmxlbmd0aDsgaSsrKSB7CiAgICAgICAgICBvdXRDaFtpXSA9IGFDaFtpXSA+IGJDaFtpXSA/IDEuMCA6IDAuMDsKICAgICAgICB9CiAgICAgIH0KICAgIH0KICAgIHJldHVybiB0cnVlOwogIH0KfQpyZWdpc3RlclByb2Nlc3NvcignY29tcGFyZS1ndC1wcm9jZXNzb3InLCBDb21wYXJlR3RQcm9jZXNzb3IpOwoKLy8g4pSA4pSA4pSAIFNpZ25hbCBPcGVyYXRpb25zIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgAoKY2xhc3MgVW5pdERlbGF5UHJvY2Vzc29yIGV4dGVuZHMgQXVkaW9Xb3JrbGV0UHJvY2Vzc29yIHsKICBjb25zdHJ1Y3RvcigpIHsKICAgIHN1cGVyKCk7CiAgICB0aGlzLl9wcmV2ID0gbmV3IEZsb2F0MzJBcnJheSg4KTsgLy8gdXAgdG8gOCBjaGFubmVscwogIH0KICBwcm9jZXNzKGlucHV0cywgb3V0cHV0cykgewogICAgY29uc3QgaW5wdXQgPSBpbnB1dHNbMF07CiAgICBjb25zdCBvdXQgPSBvdXRwdXRzWzBdOwogICAgZm9yIChsZXQgY2ggPSAwOyBjaCA8IG91dC5sZW5ndGg7IGNoKyspIHsKICAgICAgY29uc3Qgb3V0Q2ggPSBvdXRbY2hdOwogICAgICBjb25zdCBpbkNoID0gaW5wdXRbMF0gPyBpbnB1dFswXVtjaF0gfHwgaW5wdXRbMF1bMF0gOiBudWxsOwogICAgICBpZiAoaW5DaCkgewogICAgICAgIC8vIEZpcnN0IHNhbXBsZSBnZXRzIHRoZSBzdG9yZWQgcHJldmlvdXMgdmFsdWUKICAgICAgICBvdXRDaFswXSA9IHRoaXMuX3ByZXZbY2hdOwogICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgb3V0Q2gubGVuZ3RoOyBpKyspIHsKICAgICAgICAgIG91dENoW2ldID0gaW5DaFtpIC0gMV07CiAgICAgICAgfQogICAgICAgIHRoaXMuX3ByZXZbY2hdID0gaW5DaFtpbkNoLmxlbmd0aCAtIDFdOwogICAgICB9CiAgICB9CiAgICByZXR1cm4gdHJ1ZTsKICB9Cn0KcmVnaXN0ZXJQcm9jZXNzb3IoJ3VuaXQtZGVsYXktcHJvY2Vzc29yJywgVW5pdERlbGF5UHJvY2Vzc29yKTsKCmNsYXNzIFNlbGVjdG9yUHJvY2Vzc29yIGV4dGVuZHMgQXVkaW9Xb3JrbGV0UHJvY2Vzc29yIHsKICBwcm9jZXNzKGlucHV0cywgb3V0cHV0cykgewogICAgY29uc3QgYSA9IGlucHV0c1swXTsKICAgIGNvbnN0IGIgPSBpbnB1dHNbMV07CiAgICBjb25zdCBjdHJsID0gaW5wdXRzWzJdOwogICAgY29uc3Qgb3V0ID0gb3V0cHV0c1swXTsKICAgIGZvciAobGV0IGNoID0gMDsgY2ggPCBvdXQubGVuZ3RoOyBjaCsrKSB7CiAgICAgIGNvbnN0IG91dENoID0gb3V0W2NoXTsKICAgICAgY29uc3QgYUNoID0gYVswXSA/IGFbMF1bY2hdIHx8IGFbMF1bMF0gOiBudWxsOwogICAgICBjb25zdCBiQ2ggPSBiWzBdID8gYlswXVtjaF0gfHwgYlswXVswXSA6IG51bGw7CiAgICAgIGNvbnN0IGNDaCA9IGN0cmxbMF0gPyBjdHJsWzBdW2NoXSB8fCBjdHJsWzBdWzBdIDogbnVsbDsKICAgICAgaWYgKGFDaCAmJiBiQ2ggJiYgY0NoKSB7CiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvdXRDaC5sZW5ndGg7IGkrKykgewogICAgICAgICAgb3V0Q2hbaV0gPSBjQ2hbaV0gPj0gMC41ID8gYkNoW2ldIDogYUNoW2ldOwogICAgICAgIH0KICAgICAgfSBlbHNlIGlmIChhQ2gpIHsKICAgICAgICBvdXRDaC5zZXQoYUNoKTsKICAgICAgfQogICAgfQogICAgcmV0dXJuIHRydWU7CiAgfQp9CnJlZ2lzdGVyUHJvY2Vzc29yKCdzZWxlY3Rvci1wcm9jZXNzb3InLCBTZWxlY3RvclByb2Nlc3Nvcik7CgpjbGFzcyBDb25zdGFudFByb2Nlc3NvciBleHRlbmRzIEF1ZGlvV29ya2xldFByb2Nlc3NvciB7CiAgc3RhdGljIGdldCBwYXJhbWV0ZXJEZXNjcmlwdG9ycygpIHsKICAgIHJldHVybiBbeyBuYW1lOiAndmFsdWUnLCBkZWZhdWx0VmFsdWU6IDAsIGF1dG9tYXRpb25SYXRlOiAnYS1yYXRlJyB9XTsKICB9CiAgcHJvY2VzcyhfaW5wdXRzLCBvdXRwdXRzLCBwYXJhbWV0ZXJzKSB7CiAgICBjb25zdCBvdXQgPSBvdXRwdXRzWzBdOwogICAgY29uc3QgdmFsdWVzID0gcGFyYW1ldGVycy52YWx1ZTsKICAgIGZvciAobGV0IGNoID0gMDsgY2ggPCBvdXQubGVuZ3RoOyBjaCsrKSB7CiAgICAgIGNvbnN0IG91dENoID0gb3V0W2NoXTsKICAgICAgaWYgKHZhbHVlcy5sZW5ndGggPT09IDEpIHsKICAgICAgICBvdXRDaC5maWxsKHZhbHVlc1swXSk7CiAgICAgIH0gZWxzZSB7CiAgICAgICAgb3V0Q2guc2V0KHZhbHVlcyk7CiAgICAgIH0KICAgIH0KICAgIHJldHVybiB0cnVlOwogIH0KfQpyZWdpc3RlclByb2Nlc3NvcignY29uc3RhbnQtcHJvY2Vzc29yJywgQ29uc3RhbnRQcm9jZXNzb3IpOwoKLy8g4pSA4pSA4pSAIENvbnZlcnNpb24gT3BlcmF0aW9ucyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIAKCmNsYXNzIERiVG9MaW5Qcm9jZXNzb3IgZXh0ZW5kcyBBdWRpb1dvcmtsZXRQcm9jZXNzb3IgewogIHByb2Nlc3MoaW5wdXRzLCBvdXRwdXRzKSB7CiAgICBjb25zdCBpbnB1dCA9IGlucHV0c1swXTsKICAgIGNvbnN0IG91dCA9IG91dHB1dHNbMF07CiAgICBmb3IgKGxldCBjaCA9IDA7IGNoIDwgb3V0Lmxlbmd0aDsgY2grKykgewogICAgICBjb25zdCBvdXRDaCA9IG91dFtjaF07CiAgICAgIGNvbnN0IGluQ2ggPSBpbnB1dFswXSA/IGlucHV0WzBdW2NoXSB8fCBpbnB1dFswXVswXSA6IG51bGw7CiAgICAgIGlmIChpbkNoKSB7CiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvdXRDaC5sZW5ndGg7IGkrKykgewogICAgICAgICAgb3V0Q2hbaV0gPSBNYXRoLnBvdygxMCwgaW5DaFtpXSAvIDIwKTsKICAgICAgICB9CiAgICAgIH0KICAgIH0KICAgIHJldHVybiB0cnVlOwogIH0KfQpyZWdpc3RlclByb2Nlc3NvcignZGItdG8tbGluLXByb2Nlc3NvcicsIERiVG9MaW5Qcm9jZXNzb3IpOwoKY2xhc3MgTGluVG9EYlByb2Nlc3NvciBleHRlbmRzIEF1ZGlvV29ya2xldFByb2Nlc3NvciB7CiAgcHJvY2VzcyhpbnB1dHMsIG91dHB1dHMpIHsKICAgIGNvbnN0IGlucHV0ID0gaW5wdXRzWzBdOwogICAgY29uc3Qgb3V0ID0gb3V0cHV0c1swXTsKICAgIGZvciAobGV0IGNoID0gMDsgY2ggPCBvdXQubGVuZ3RoOyBjaCsrKSB7CiAgICAgIGNvbnN0IG91dENoID0gb3V0W2NoXTsKICAgICAgY29uc3QgaW5DaCA9IGlucHV0WzBdID8gaW5wdXRbMF1bY2hdIHx8IGlucHV0WzBdWzBdIDogbnVsbDsKICAgICAgaWYgKGluQ2gpIHsKICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG91dENoLmxlbmd0aDsgaSsrKSB7CiAgICAgICAgICBjb25zdCB2YWwgPSBNYXRoLmFicyhpbkNoW2ldKTsKICAgICAgICAgIG91dENoW2ldID0gdmFsID4gMWUtMTAgPyAyMCAqIE1hdGgubG9nMTAodmFsKSA6IC0yMDA7CiAgICAgICAgfQogICAgICB9CiAgICB9CiAgICByZXR1cm4gdHJ1ZTsKICB9Cn0KcmVnaXN0ZXJQcm9jZXNzb3IoJ2xpbi10by1kYi1wcm9jZXNzb3InLCBMaW5Ub0RiUHJvY2Vzc29yKTsKCi8vIOKUgOKUgOKUgCBWaXN1YWxpemF0aW9uIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgAoKY2xhc3MgUHJvYmVQcm9jZXNzb3IgZXh0ZW5kcyBBdWRpb1dvcmtsZXRQcm9jZXNzb3IgewogIGNvbnN0cnVjdG9yKCkgewogICAgc3VwZXIoKTsKICAgIHRoaXMuX2NvdW50ZXIgPSAwOwogIH0KICBwcm9jZXNzKGlucHV0cywgb3V0cHV0cykgewogICAgY29uc3QgaW5wdXQgPSBpbnB1dHNbMF07CiAgICBjb25zdCBvdXQgPSBvdXRwdXRzWzBdOwogICAgLy8gUGFzcyB0aHJvdWdoCiAgICBmb3IgKGxldCBjaCA9IDA7IGNoIDwgb3V0Lmxlbmd0aDsgY2grKykgewogICAgICBjb25zdCBpbkNoID0gaW5wdXRbMF0gPyBpbnB1dFswXVtjaF0gfHwgaW5wdXRbMF1bMF0gOiBudWxsOwogICAgICBpZiAoaW5DaCkgewogICAgICAgIG91dFtjaF0uc2V0KGluQ2gpOwogICAgICB9CiAgICB9CiAgICAvLyBSZXBvcnQgdmFsdWUgZXZlcnkgfjEwMG1zIChhdCA0NDEwMCBIeiwgMTI4IHNhbXBsZXMvZnJhbWUsIH4zNDQgZnJhbWVzL3NlYykKICAgIHRoaXMuX2NvdW50ZXIrKzsKICAgIGlmICh0aGlzLl9jb3VudGVyID49IDM0KSB7CiAgICAgIHRoaXMuX2NvdW50ZXIgPSAwOwogICAgICBjb25zdCBjaDAgPSBpbnB1dFswXSAmJiBpbnB1dFswXVswXSA/IGlucHV0WzBdWzBdIDogbnVsbDsKICAgICAgaWYgKGNoMCkgewogICAgICAgIHRoaXMucG9ydC5wb3N0TWVzc2FnZSh7IHZhbHVlOiBjaDBbMF0sIHBlYWs6IE1hdGgubWF4KC4uLmNoMC5tYXAoTWF0aC5hYnMpKSB9KTsKICAgICAgfQogICAgfQogICAgcmV0dXJuIHRydWU7CiAgfQp9CnJlZ2lzdGVyUHJvY2Vzc29yKCdwcm9iZS1wcm9jZXNzb3InLCBQcm9iZVByb2Nlc3Nvcik7CgovLyDilIDilIDilIAgQ29tcHJlc3Nvci1zcGVjaWZpYyBmdW5jdGlvbmFsIGJsb2NrcyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIAKCmNsYXNzIEVudmVsb3BlRGV0ZWN0b3JQcm9jZXNzb3IgZXh0ZW5kcyBBdWRpb1dvcmtsZXRQcm9jZXNzb3IgewogIHN0YXRpYyBnZXQgcGFyYW1ldGVyRGVzY3JpcHRvcnMoKSB7CiAgICByZXR1cm4gWwogICAgICB7IG5hbWU6ICdhdHRhY2snLCBkZWZhdWx0VmFsdWU6IDAuMDAzLCBhdXRvbWF0aW9uUmF0ZTogJ2stcmF0ZScgfSwKICAgICAgeyBuYW1lOiAncmVsZWFzZScsIGRlZmF1bHRWYWx1ZTogMC4yNSwgYXV0b21hdGlvblJhdGU6ICdrLXJhdGUnIH0sCiAgICBdOwogIH0KICBjb25zdHJ1Y3RvcigpIHsKICAgIHN1cGVyKCk7CiAgICB0aGlzLl9lbnZlbG9wZSA9IDA7CiAgfQogIHByb2Nlc3MoaW5wdXRzLCBvdXRwdXRzLCBwYXJhbWV0ZXJzKSB7CiAgICBjb25zdCBpbnB1dCA9IGlucHV0c1swXTsKICAgIGNvbnN0IG91dCA9IG91dHB1dHNbMF07CiAgICBjb25zdCBhdHRhY2tUaW1lID0gcGFyYW1ldGVycy5hdHRhY2tbMF07CiAgICBjb25zdCByZWxlYXNlVGltZSA9IHBhcmFtZXRlcnMucmVsZWFzZVswXTsKICAgIGNvbnN0IHNyID0gc2FtcGxlUmF0ZTsKICAgIC8vIENvbnZlcnQgdGltZSB0byBvbmUtcG9sZSBjb2VmZmljaWVudAogICAgY29uc3QgYXR0YWNrQ29lZmYgPSBhdHRhY2tUaW1lID4gMCA/IDEgLSBNYXRoLmV4cCgtMSAvIChzciAqIGF0dGFja1RpbWUpKSA6IDE7CiAgICBjb25zdCByZWxlYXNlQ29lZmYgPSByZWxlYXNlVGltZSA+IDAgPyAxIC0gTWF0aC5leHAoLTEgLyAoc3IgKiByZWxlYXNlVGltZSkpIDogMTsKCiAgICBjb25zdCBpbkNoID0gaW5wdXRbMF0gPyBpbnB1dFswXVswXSA6IG51bGw7CiAgICBpZiAoaW5DaCkgewogICAgICBjb25zdCBvdXRDaCA9IG91dFswXTsKICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbkNoLmxlbmd0aDsgaSsrKSB7CiAgICAgICAgY29uc3QgcmVjdGlmaWVkID0gTWF0aC5hYnMoaW5DaFtpXSk7CiAgICAgICAgY29uc3QgY29lZmYgPSByZWN0aWZpZWQgPiB0aGlzLl9lbnZlbG9wZSA/IGF0dGFja0NvZWZmIDogcmVsZWFzZUNvZWZmOwogICAgICAgIHRoaXMuX2VudmVsb3BlID0gY29lZmYgKiByZWN0aWZpZWQgKyAoMSAtIGNvZWZmKSAqIHRoaXMuX2VudmVsb3BlOwogICAgICAgIC8vIE91dHB1dCBhcyBkQgogICAgICAgIG91dENoW2ldID0gdGhpcy5fZW52ZWxvcGUgPiAxZS0xMCA/IDIwICogTWF0aC5sb2cxMCh0aGlzLl9lbnZlbG9wZSkgOiAtMjAwOwogICAgICB9CiAgICAgIC8vIENvcHkgdG8gb3RoZXIgb3V0cHV0IGNoYW5uZWxzCiAgICAgIGZvciAobGV0IGNoID0gMTsgY2ggPCBvdXQubGVuZ3RoOyBjaCsrKSB7CiAgICAgICAgb3V0W2NoXS5zZXQob3V0Q2gpOwogICAgICB9CiAgICB9CiAgICByZXR1cm4gdHJ1ZTsKICB9Cn0KcmVnaXN0ZXJQcm9jZXNzb3IoJ2VudmVsb3BlLWRldGVjdG9yLXByb2Nlc3NvcicsIEVudmVsb3BlRGV0ZWN0b3JQcm9jZXNzb3IpOwoKY2xhc3MgR2FpbkNvbXB1dGVyUHJvY2Vzc29yIGV4dGVuZHMgQXVkaW9Xb3JrbGV0UHJvY2Vzc29yIHsKICBzdGF0aWMgZ2V0IHBhcmFtZXRlckRlc2NyaXB0b3JzKCkgewogICAgcmV0dXJuIFsKICAgICAgeyBuYW1lOiAndGhyZXNob2xkJywgZGVmYXVsdFZhbHVlOiAtMTgsIGF1dG9tYXRpb25SYXRlOiAnay1yYXRlJyB9LAogICAgICB7IG5hbWU6ICdyYXRpbycsIGRlZmF1bHRWYWx1ZTogNCwgYXV0b21hdGlvblJhdGU6ICdrLXJhdGUnIH0sCiAgICBdOwogIH0KICBwcm9jZXNzKGlucHV0cywgb3V0cHV0cywgcGFyYW1ldGVycykgewogICAgY29uc3QgaW5wdXQgPSBpbnB1dHNbMF07CiAgICBjb25zdCBvdXQgPSBvdXRwdXRzWzBdOwogICAgY29uc3QgdGhyZXNob2xkID0gcGFyYW1ldGVycy50aHJlc2hvbGRbMF07CiAgICBjb25zdCByYXRpbyA9IHBhcmFtZXRlcnMucmF0aW9bMF07CgogICAgY29uc3QgaW5DaCA9IGlucHV0WzBdID8gaW5wdXRbMF1bMF0gOiBudWxsOwogICAgaWYgKGluQ2gpIHsKICAgICAgY29uc3Qgb3V0Q2ggPSBvdXRbMF07CiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5DaC5sZW5ndGg7IGkrKykgewogICAgICAgIGNvbnN0IGxldmVsRGIgPSBpbkNoW2ldOwogICAgICAgIGNvbnN0IGV4Y2VzcyA9IE1hdGgubWF4KDAsIGxldmVsRGIgLSB0aHJlc2hvbGQpOwogICAgICAgIC8vIE91dHB1dCBnYWluIHJlZHVjdGlvbiBhcyBuZWdhdGl2ZSBkQgogICAgICAgIG91dENoW2ldID0gLShleGNlc3MgKiAoMSAtIDEgLyByYXRpbykpOwogICAgICB9CiAgICAgIGZvciAobGV0IGNoID0gMTsgY2ggPCBvdXQubGVuZ3RoOyBjaCsrKSB7CiAgICAgICAgb3V0W2NoXS5zZXQob3V0Q2gpOwogICAgICB9CiAgICB9CiAgICByZXR1cm4gdHJ1ZTsKICB9Cn0KcmVnaXN0ZXJQcm9jZXNzb3IoJ2dhaW4tY29tcHV0ZXItcHJvY2Vzc29yJywgR2FpbkNvbXB1dGVyUHJvY2Vzc29yKTsKCi8vIOKUgOKUgOKUgCBHYXRlIFByb2Nlc3NvciDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIAKCmNsYXNzIEdhdGVQcm9jZXNzb3IgZXh0ZW5kcyBBdWRpb1dvcmtsZXRQcm9jZXNzb3IgewogIHN0YXRpYyBnZXQgcGFyYW1ldGVyRGVzY3JpcHRvcnMoKSB7CiAgICByZXR1cm4gWwogICAgICB7IG5hbWU6ICd0aHJlc2hvbGQnLCBkZWZhdWx0VmFsdWU6IC00MCwgYXV0b21hdGlvblJhdGU6ICdrLXJhdGUnIH0sCiAgICAgIHsgbmFtZTogJ2F0dGFjaycsIGRlZmF1bHRWYWx1ZTogMC4wMDEsIGF1dG9tYXRpb25SYXRlOiAnay1yYXRlJyB9LAogICAgICB7IG5hbWU6ICdob2xkJywgZGVmYXVsdFZhbHVlOiAwLjA1LCBhdXRvbWF0aW9uUmF0ZTogJ2stcmF0ZScgfSwKICAgICAgeyBuYW1lOiAncmVsZWFzZScsIGRlZmF1bHRWYWx1ZTogMC4xLCBhdXRvbWF0aW9uUmF0ZTogJ2stcmF0ZScgfSwKICAgICAgeyBuYW1lOiAncmFuZ2UnLCBkZWZhdWx0VmFsdWU6IC04MCwgYXV0b21hdGlvblJhdGU6ICdrLXJhdGUnIH0sCiAgICBdOwogIH0KICBjb25zdHJ1Y3RvcigpIHsKICAgIHN1cGVyKCk7CiAgICB0aGlzLl9lbnZlbG9wZSA9IDA7CiAgICB0aGlzLl9ob2xkQ291bnRlciA9IDA7CiAgICB0aGlzLl9nYXRlR2FpbiA9IDA7CiAgICB0aGlzLl9yZXBvcnRDb3VudGVyID0gMDsKICB9CiAgcHJvY2VzcyhpbnB1dHMsIG91dHB1dHMsIHBhcmFtZXRlcnMpIHsKICAgIGNvbnN0IGF1ZGlvID0gaW5wdXRzWzBdOwogICAgY29uc3Qgc2lkZWNoYWluID0gaW5wdXRzWzFdOwogICAgY29uc3Qgb3V0ID0gb3V0cHV0c1swXTsKICAgIGNvbnN0IHNyID0gc2FtcGxlUmF0ZTsKCiAgICBjb25zdCB0aHJlc2hvbGREYiA9IHBhcmFtZXRlcnMudGhyZXNob2xkWzBdOwogICAgY29uc3QgYXR0YWNrVGltZSA9IHBhcmFtZXRlcnMuYXR0YWNrWzBdOwogICAgY29uc3QgaG9sZFRpbWUgPSBwYXJhbWV0ZXJzLmhvbGRbMF07CiAgICBjb25zdCByZWxlYXNlVGltZSA9IHBhcmFtZXRlcnMucmVsZWFzZVswXTsKICAgIGNvbnN0IHJhbmdlRGIgPSBwYXJhbWV0ZXJzLnJhbmdlWzBdOwogICAgY29uc3QgdGhyZXNob2xkTGluID0gTWF0aC5wb3coMTAsIHRocmVzaG9sZERiIC8gMjApOwogICAgY29uc3QgcmFuZ2VMaW4gPSBNYXRoLnBvdygxMCwgcmFuZ2VEYiAvIDIwKTsKCiAgICBjb25zdCBhdHRhY2tDb2VmZiA9IGF0dGFja1RpbWUgPiAwID8gMSAtIE1hdGguZXhwKC0xIC8gKHNyICogYXR0YWNrVGltZSkpIDogMTsKICAgIGNvbnN0IHJlbGVhc2VDb2VmZiA9IHJlbGVhc2VUaW1lID4gMCA/IDEgLSBNYXRoLmV4cCgtMSAvIChzciAqIHJlbGVhc2VUaW1lKSkgOiAxOwogICAgY29uc3QgaG9sZFNhbXBsZXMgPSBNYXRoLnJvdW5kKGhvbGRUaW1lICogc3IpOwoKICAgIGNvbnN0IGRldENoID0gKHNpZGVjaGFpblswXSAmJiBzaWRlY2hhaW5bMF1bMF0pID8gc2lkZWNoYWluWzBdWzBdIDogKGF1ZGlvWzBdID8gYXVkaW9bMF1bMF0gOiBudWxsKTsKCiAgICBpZiAoZGV0Q2ggJiYgYXVkaW9bMF0pIHsKICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkZXRDaC5sZW5ndGg7IGkrKykgewogICAgICAgIGNvbnN0IGxldmVsID0gTWF0aC5hYnMoZGV0Q2hbaV0pOwogICAgICAgIGlmIChsZXZlbCA+PSB0aHJlc2hvbGRMaW4pIHsKICAgICAgICAgIHRoaXMuX2hvbGRDb3VudGVyID0gaG9sZFNhbXBsZXM7CiAgICAgICAgICB0aGlzLl9nYXRlR2FpbiArPSBhdHRhY2tDb2VmZiAqICgxIC0gdGhpcy5fZ2F0ZUdhaW4pOwogICAgICAgIH0gZWxzZSBpZiAodGhpcy5faG9sZENvdW50ZXIgPiAwKSB7CiAgICAgICAgICB0aGlzLl9ob2xkQ291bnRlci0tOwogICAgICAgIH0gZWxzZSB7CiAgICAgICAgICB0aGlzLl9nYXRlR2FpbiArPSByZWxlYXNlQ29lZmYgKiAocmFuZ2VMaW4gLSB0aGlzLl9nYXRlR2Fpbik7CiAgICAgICAgfQogICAgICAgIGZvciAobGV0IGNoID0gMDsgY2ggPCBvdXQubGVuZ3RoOyBjaCsrKSB7CiAgICAgICAgICBjb25zdCBpbkNoID0gYXVkaW9bMF1bY2hdIHx8IGF1ZGlvWzBdWzBdOwogICAgICAgICAgaWYgKGluQ2gpIHsKICAgICAgICAgICAgb3V0W2NoXVtpXSA9IGluQ2hbaV0gKiB0aGlzLl9nYXRlR2FpbjsKICAgICAgICAgIH0KICAgICAgICB9CiAgICAgIH0KICAgIH0KCiAgICB0aGlzLl9yZXBvcnRDb3VudGVyKys7CiAgICBpZiAodGhpcy5fcmVwb3J0Q291bnRlciA+PSAzNCkgewogICAgICB0aGlzLl9yZXBvcnRDb3VudGVyID0gMDsKICAgICAgdGhpcy5wb3J0LnBvc3RNZXNzYWdlKHsgZ2F0ZU9wZW46IHRoaXMuX2dhdGVHYWluID4gMC41IH0pOwogICAgfQogICAgcmV0dXJuIHRydWU7CiAgfQp9CnJlZ2lzdGVyUHJvY2Vzc29yKCdnYXRlLXByb2Nlc3NvcicsIEdhdGVQcm9jZXNzb3IpOwoKLy8g4pSA4pSA4pSAIEV4cGFuZGVyIFByb2Nlc3NvciDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIAKCmNsYXNzIEV4cGFuZGVyUHJvY2Vzc29yIGV4dGVuZHMgQXVkaW9Xb3JrbGV0UHJvY2Vzc29yIHsKICBzdGF0aWMgZ2V0IHBhcmFtZXRlckRlc2NyaXB0b3JzKCkgewogICAgcmV0dXJuIFsKICAgICAgeyBuYW1lOiAndGhyZXNob2xkJywgZGVmYXVsdFZhbHVlOiAtMzAsIGF1dG9tYXRpb25SYXRlOiAnay1yYXRlJyB9LAogICAgICB7IG5hbWU6ICdyYXRpbycsIGRlZmF1bHRWYWx1ZTogMiwgYXV0b21hdGlvblJhdGU6ICdrLXJhdGUnIH0sCiAgICAgIHsgbmFtZTogJ2F0dGFjaycsIGRlZmF1bHRWYWx1ZTogMC4wMDEsIGF1dG9tYXRpb25SYXRlOiAnay1yYXRlJyB9LAogICAgICB7IG5hbWU6ICdyZWxlYXNlJywgZGVmYXVsdFZhbHVlOiAwLjEsIGF1dG9tYXRpb25SYXRlOiAnay1yYXRlJyB9LAogICAgXTsKICB9CiAgY29uc3RydWN0b3IoKSB7CiAgICBzdXBlcigpOwogICAgdGhpcy5fZW52ZWxvcGUgPSAwOwogICAgdGhpcy5fZ2FpbkRiID0gMDsKICAgIHRoaXMuX3JlcG9ydENvdW50ZXIgPSAwOwogIH0KICBwcm9jZXNzKGlucHV0cywgb3V0cHV0cywgcGFyYW1ldGVycykgewogICAgY29uc3QgYXVkaW8gPSBpbnB1dHNbMF07CiAgICBjb25zdCBzaWRlY2hhaW4gPSBpbnB1dHNbMV07CiAgICBjb25zdCBvdXQgPSBvdXRwdXRzWzBdOwogICAgY29uc3Qgc3IgPSBzYW1wbGVSYXRlOwoKICAgIGNvbnN0IHRocmVzaG9sZERiID0gcGFyYW1ldGVycy50aHJlc2hvbGRbMF07CiAgICBjb25zdCByYXRpbyA9IHBhcmFtZXRlcnMucmF0aW9bMF07CiAgICBjb25zdCBhdHRhY2tUaW1lID0gcGFyYW1ldGVycy5hdHRhY2tbMF07CiAgICBjb25zdCByZWxlYXNlVGltZSA9IHBhcmFtZXRlcnMucmVsZWFzZVswXTsKCiAgICBjb25zdCBhdHRhY2tDb2VmZiA9IGF0dGFja1RpbWUgPiAwID8gMSAtIE1hdGguZXhwKC0xIC8gKHNyICogYXR0YWNrVGltZSkpIDogMTsKICAgIGNvbnN0IHJlbGVhc2VDb2VmZiA9IHJlbGVhc2VUaW1lID4gMCA/IDEgLSBNYXRoLmV4cCgtMSAvIChzciAqIHJlbGVhc2VUaW1lKSkgOiAxOwoKICAgIGNvbnN0IGRldENoID0gKHNpZGVjaGFpblswXSAmJiBzaWRlY2hhaW5bMF1bMF0pID8gc2lkZWNoYWluWzBdWzBdIDogKGF1ZGlvWzBdID8gYXVkaW9bMF1bMF0gOiBudWxsKTsKCiAgICBpZiAoZGV0Q2ggJiYgYXVkaW9bMF0pIHsKICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkZXRDaC5sZW5ndGg7IGkrKykgewogICAgICAgIGNvbnN0IHJlY3RpZmllZCA9IE1hdGguYWJzKGRldENoW2ldKTsKICAgICAgICBjb25zdCBjb2VmZiA9IHJlY3RpZmllZCA+IHRoaXMuX2VudmVsb3BlID8gYXR0YWNrQ29lZmYgOiByZWxlYXNlQ29lZmY7CiAgICAgICAgdGhpcy5fZW52ZWxvcGUgPSBjb2VmZiAqIHJlY3RpZmllZCArICgxIC0gY29lZmYpICogdGhpcy5fZW52ZWxvcGU7CgogICAgICAgIGNvbnN0IGVudkRiID0gdGhpcy5fZW52ZWxvcGUgPiAxZS0xMCA/IDIwICogTWF0aC5sb2cxMCh0aGlzLl9lbnZlbG9wZSkgOiAtMjAwOwogICAgICAgIGxldCBnYWluUmVkdWN0aW9uRGIgPSAwOwogICAgICAgIGlmIChlbnZEYiA8IHRocmVzaG9sZERiKSB7CiAgICAgICAgICBjb25zdCBiZWxvdyA9IHRocmVzaG9sZERiIC0gZW52RGI7CiAgICAgICAgICBnYWluUmVkdWN0aW9uRGIgPSAtKGJlbG93ICogKDEgLSAxIC8gcmF0aW8pKTsKICAgICAgICB9CgogICAgICAgIGNvbnN0IGdhaW5MaW4gPSBNYXRoLnBvdygxMCwgZ2FpblJlZHVjdGlvbkRiIC8gMjApOwogICAgICAgIHRoaXMuX2dhaW5EYiA9IGdhaW5SZWR1Y3Rpb25EYjsKCiAgICAgICAgZm9yIChsZXQgY2ggPSAwOyBjaCA8IG91dC5sZW5ndGg7IGNoKyspIHsKICAgICAgICAgIGNvbnN0IGluQ2ggPSBhdWRpb1swXVtjaF0gfHwgYXVkaW9bMF1bMF07CiAgICAgICAgICBpZiAoaW5DaCkgewogICAgICAgICAgICBvdXRbY2hdW2ldID0gaW5DaFtpXSAqIGdhaW5MaW47CiAgICAgICAgICB9CiAgICAgICAgfQogICAgICB9CiAgICB9CgogICAgdGhpcy5fcmVwb3J0Q291bnRlcisrOwogICAgaWYgKHRoaXMuX3JlcG9ydENvdW50ZXIgPj0gMzQpIHsKICAgICAgdGhpcy5fcmVwb3J0Q291bnRlciA9IDA7CiAgICAgIHRoaXMucG9ydC5wb3N0TWVzc2FnZSh7IHJlZHVjdGlvbkRiOiB0aGlzLl9nYWluRGIgfSk7CiAgICB9CiAgICByZXR1cm4gdHJ1ZTsKICB9Cn0KcmVnaXN0ZXJQcm9jZXNzb3IoJ2V4cGFuZGVyLXByb2Nlc3NvcicsIEV4cGFuZGVyUHJvY2Vzc29yKTsKCi8vIOKUgOKUgOKUgCBEZS1lc3NlciBQcm9jZXNzb3Ig4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSACgpjbGFzcyBEZUVzc2VyUHJvY2Vzc29yIGV4dGVuZHMgQXVkaW9Xb3JrbGV0UHJvY2Vzc29yIHsKICBzdGF0aWMgZ2V0IHBhcmFtZXRlckRlc2NyaXB0b3JzKCkgewogICAgcmV0dXJuIFsKICAgICAgeyBuYW1lOiAncmFuZ2UnLCBkZWZhdWx0VmFsdWU6IDYsIGF1dG9tYXRpb25SYXRlOiAnay1yYXRlJyB9LAogICAgXTsKICB9CiAgY29uc3RydWN0b3IoKSB7CiAgICBzdXBlcigpOwogICAgdGhpcy5fZW52ZWxvcGUgPSAwOwogICAgdGhpcy5fcmVwb3J0Q291bnRlciA9IDA7CiAgfQogIHByb2Nlc3MoaW5wdXRzLCBvdXRwdXRzLCBwYXJhbWV0ZXJzKSB7CiAgICBjb25zdCBhdWRpbyA9IGlucHV0c1swXTsKICAgIGNvbnN0IGRldGVjdGlvbiA9IGlucHV0c1sxXTsKICAgIGNvbnN0IG91dCA9IG91dHB1dHNbMF07CgogICAgY29uc3QgcmFuZ2VEYiA9IHBhcmFtZXRlcnMucmFuZ2VbMF07CgogICAgY29uc3QgZGV0Q2ggPSAoZGV0ZWN0aW9uWzBdICYmIGRldGVjdGlvblswXVswXSkgPyBkZXRlY3Rpb25bMF1bMF0gOiBudWxsOwoKICAgIGlmIChhdWRpb1swXSkgewogICAgICBmb3IgKGxldCBjaCA9IDA7IGNoIDwgb3V0Lmxlbmd0aDsgY2grKykgewogICAgICAgIGNvbnN0IGluQ2ggPSBhdWRpb1swXVtjaF0gfHwgYXVkaW9bMF1bMF07CiAgICAgICAgaWYgKGluQ2gpIHsKICAgICAgICAgIG91dFtjaF0uc2V0KGluQ2gpOwogICAgICAgIH0KICAgICAgfQogICAgfQoKICAgIGlmIChkZXRDaCkgewogICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRldENoLmxlbmd0aDsgaSsrKSB7CiAgICAgICAgY29uc3QgcmVjdGlmaWVkID0gTWF0aC5hYnMoZGV0Q2hbaV0pOwogICAgICAgIGNvbnN0IGNvZWZmID0gcmVjdGlmaWVkID4gdGhpcy5fZW52ZWxvcGUgPyAwLjEgOiAwLjAwMjsKICAgICAgICB0aGlzLl9lbnZlbG9wZSA9IGNvZWZmICogcmVjdGlmaWVkICsgKDEgLSBjb2VmZikgKiB0aGlzLl9lbnZlbG9wZTsKICAgICAgfQogICAgfQoKICAgIHRoaXMuX3JlcG9ydENvdW50ZXIrKzsKICAgIGlmICh0aGlzLl9yZXBvcnRDb3VudGVyID49IDM0KSB7CiAgICAgIHRoaXMuX3JlcG9ydENvdW50ZXIgPSAwOwogICAgICBjb25zdCBlbnZEYiA9IHRoaXMuX2VudmVsb3BlID4gMWUtMTAgPyAyMCAqIE1hdGgubG9nMTAodGhpcy5fZW52ZWxvcGUpIDogLTIwMDsKICAgICAgY29uc3QgcmVkdWN0aW9uRGIgPSBlbnZEYiA+IC0yMCA/IC1NYXRoLm1pbihyYW5nZURiLCBNYXRoLm1heCgwLCAoZW52RGIgKyAyMCkgKiByYW5nZURiIC8gMjApKSA6IDA7CiAgICAgIHRoaXMucG9ydC5wb3N0TWVzc2FnZSh7IHJlZHVjdGlvbkRiIH0pOwogICAgfQogICAgcmV0dXJuIHRydWU7CiAgfQp9CnJlZ2lzdGVyUHJvY2Vzc29yKCdkZS1lc3Nlci1wcm9jZXNzb3InLCBEZUVzc2VyUHJvY2Vzc29yKTsKCi8vIOKUgOKUgOKUgCBCaXRjcnVzaGVyIFByb2Nlc3NvciDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIAKCmNsYXNzIEJpdGNydXNoZXJQcm9jZXNzb3IgZXh0ZW5kcyBBdWRpb1dvcmtsZXRQcm9jZXNzb3IgewogIHN0YXRpYyBnZXQgcGFyYW1ldGVyRGVzY3JpcHRvcnMoKSB7CiAgICByZXR1cm4gWwogICAgICB7IG5hbWU6ICdiaXREZXB0aCcsIGRlZmF1bHRWYWx1ZTogOCwgYXV0b21hdGlvblJhdGU6ICdrLXJhdGUnIH0sCiAgICAgIHsgbmFtZTogJ3NhbXBsZVJhdGVSZWR1Y3Rpb24nLCBkZWZhdWx0VmFsdWU6IDEsIGF1dG9tYXRpb25SYXRlOiAnay1yYXRlJyB9LAogICAgXTsKICB9CiAgY29uc3RydWN0b3IoKSB7CiAgICBzdXBlcigpOwogICAgdGhpcy5faG9sZEwgPSAwOwogICAgdGhpcy5faG9sZFIgPSAwOwogICAgdGhpcy5fY291bnRlciA9IDA7CiAgfQogIHByb2Nlc3MoaW5wdXRzLCBvdXRwdXRzLCBwYXJhbWV0ZXJzKSB7CiAgICBjb25zdCBpbnB1dCA9IGlucHV0c1swXTsKICAgIGNvbnN0IG91dCA9IG91dHB1dHNbMF07CgogICAgY29uc3QgYml0cyA9IE1hdGgucm91bmQocGFyYW1ldGVycy5iaXREZXB0aFswXSk7CiAgICBjb25zdCBzclJlZHVjZSA9IE1hdGgucm91bmQocGFyYW1ldGVycy5zYW1wbGVSYXRlUmVkdWN0aW9uWzBdKTsKICAgIGNvbnN0IGxldmVscyA9IE1hdGgucG93KDIsIGJpdHMpOwoKICAgIGZvciAobGV0IGNoID0gMDsgY2ggPCBvdXQubGVuZ3RoOyBjaCsrKSB7CiAgICAgIGNvbnN0IG91dENoID0gb3V0W2NoXTsKICAgICAgY29uc3QgaW5DaCA9IGlucHV0WzBdID8gaW5wdXRbMF1bY2hdIHx8IGlucHV0WzBdWzBdIDogbnVsbDsKICAgICAgaWYgKGluQ2gpIHsKICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG91dENoLmxlbmd0aDsgaSsrKSB7CiAgICAgICAgICBpZiAodGhpcy5fY291bnRlciAlIHNyUmVkdWNlID09PSAwKSB7CiAgICAgICAgICAgIC8vIFF1YW50aXplIHRvIGJpdCBkZXB0aAogICAgICAgICAgICBjb25zdCBxdWFudGl6ZWQgPSBNYXRoLnJvdW5kKGluQ2hbaV0gKiBsZXZlbHMpIC8gbGV2ZWxzOwogICAgICAgICAgICBpZiAoY2ggPT09IDApIHRoaXMuX2hvbGRMID0gcXVhbnRpemVkOwogICAgICAgICAgICBlbHNlIHRoaXMuX2hvbGRSID0gcXVhbnRpemVkOwogICAgICAgICAgfQogICAgICAgICAgb3V0Q2hbaV0gPSBjaCA9PT0gMCA/IHRoaXMuX2hvbGRMIDogdGhpcy5faG9sZFI7CiAgICAgICAgICBpZiAoY2ggPT09IDApIHRoaXMuX2NvdW50ZXIrKzsKICAgICAgICB9CiAgICAgIH0KICAgIH0KICAgIHJldHVybiB0cnVlOwogIH0KfQpyZWdpc3RlclByb2Nlc3NvcignYml0Y3J1c2hlci1wcm9jZXNzb3InLCBCaXRjcnVzaGVyUHJvY2Vzc29yKTsK", import.meta.url).href
  ), Cg = !0);
}
function Kt(e) {
  return e <= -70 ? 0 : Math.pow(10, e / 20);
}
class p2 {
  constructor() {
    xr(this, "ctx", null);
    xr(this, "processors", /* @__PURE__ */ new Map());
    xr(this, "connections", /* @__PURE__ */ new Map());
    xr(this, "prevNodes", []);
    xr(this, "prevEdges", []);
    xr(this, "currentMuteState", /* @__PURE__ */ new Map());
  }
  get audioContext() {
    return this.ctx;
  }
  async initialize() {
    this.ctx = new AudioContext(), this.ctx.state === "suspended" && await this.ctx.resume(), await f2(this.ctx), u2(this.ctx);
  }
  /** Called on every store change to sync Web Audio with graph state */
  reconcile(r, o) {
    var u, p, g;
    if (!this.ctx) return;
    const s = new Set(r.map((m) => m.id));
    for (const m of this.prevNodes)
      s.has(m.id) || this.removeProcessor(m.id);
    const i = new Set(this.prevNodes.map((m) => m.id));
    for (const m of r)
      i.has(m.id) || this.createProcessor(m);
    for (const m of r) {
      const h = this.prevNodes.find((w) => w.id === m.id);
      if (h)
        for (const [w, I] of Object.entries(m.data.parameters))
          h.data.parameters[w] !== I && ((u = this.processors.get(m.id)) == null || u.setParameter(
            w,
            I,
            this.ctx.currentTime
          ));
    }
    for (const m of r) {
      const h = this.prevNodes.find((x) => x.id === m.id), w = (h == null ? void 0 : h.data.bypassed) ?? !1, I = m.data.bypassed ?? !1;
      w !== I && ((g = (p = this.processors.get(m.id)) == null ? void 0 : p.setBypass) == null || g.call(p, I, this.ctx.currentTime));
    }
    for (const m of r) {
      if (!m.data.bufferRef) continue;
      const h = this.prevNodes.find((I) => I.id === m.id);
      if ((h == null ? void 0 : h.data.bufferRef) === m.data.bufferRef) continue;
      const w = this.processors.get(m.id);
      if (w != null && w.setBuffer) {
        const I = Di(m.data.bufferRef);
        I && w.setBuffer(I.buffer);
      }
    }
    const l = new Set(o.map((m) => m.id));
    for (const m of this.prevEdges)
      l.has(m.id) || this.removeConnection(m.id);
    const c = new Set(this.prevEdges.map((m) => m.id));
    for (const m of o)
      c.has(m.id) || this.createConnection(m, r);
    this.prevNodes = r, this.prevEdges = o;
  }
  createProcessor(r) {
    if (!(!this.ctx || !r.type))
      try {
        const s = yh(r.type).create(this.ctx, r.data.parameters);
        this.processors.set(r.id, s);
      } catch (o) {
        console.warn(`Failed to create processor for ${r.type}:`, o);
      }
  }
  removeProcessor(r) {
    for (const [s] of this.connections) {
      const i = this.prevEdges.find((l) => l.id === s);
      i && (i.source === r || i.target === r) && this.removeConnection(s);
    }
    const o = this.processors.get(r);
    o && (o.dispose(), this.processors.delete(r));
  }
  createConnection(r, o) {
    if (!this.ctx) return;
    const s = this.processors.get(r.source), i = this.processors.get(r.target);
    if (!s || !i) return;
    const l = s.outputs[r.sourceHandle], c = i.inputs[r.targetHandle];
    if (!(!l || !c)) {
      if (r.data.signalType === "parameter" && c instanceof AudioParam)
        l.connect(c), this.connections.set(r.id, {
          gate: null,
          from: l,
          to: c
        });
      else if (c instanceof AudioNode) {
        const u = o.find((I) => I.id === r.source), p = o.find((I) => I.id === r.target);
        if (!u || !p) return;
        let g = r.data.channelFormat, m = r.data.channelFormat;
        try {
          const x = ct(u.type).ports.find((N) => N.id === r.sourceHandle);
          x && (g = x.channelFormat);
          const b = ct(p.type).ports.find((N) => N.id === r.targetHandle);
          b && (m = b.channelFormat);
        } catch {
        }
        const h = i2(this.ctx, g, m), w = this.ctx.createGain();
        w.gain.value = 0, h ? (l.connect(w), w.connect(h.input), h.output.connect(c)) : (l.connect(w), w.connect(c)), w.gain.setTargetAtTime(1, this.ctx.currentTime, 0.02), this.connections.set(r.id, { gate: w, from: l, to: c, adapter: h ?? void 0 });
      }
    }
  }
  removeConnection(r) {
    const o = this.connections.get(r);
    if (o)
      if (o.disconnectTimer && clearTimeout(o.disconnectTimer), o.to instanceof AudioParam) {
        try {
          o.from.disconnect(o.to);
        } catch {
        }
        this.connections.delete(r);
      } else o.gate && this.ctx ? (o.gate.gain.setTargetAtTime(0, this.ctx.currentTime, 0.02), o.disconnectTimer = setTimeout(() => {
        try {
          o.from.disconnect(o.gate), o.gate.disconnect(), o.adapter && (o.adapter.input.disconnect(), o.adapter.output.disconnect());
        } catch {
        }
        this.connections.delete(r);
      }, 80)) : this.connections.delete(r);
  }
  /** Update regions on a track processor */
  updateTrackRegions(r, o) {
    const s = this.processors.get(r);
    s != null && s.setRegions && s.setRegions(o);
  }
  /** Start playback on all track processors from a given offset */
  startPlayback(r) {
    var s;
    if (!this.ctx) return;
    const o = this.ctx.currentTime;
    for (const i of this.processors.values())
      (s = i.schedulePlayback) == null || s.call(i, o, r);
  }
  /** Stop playback on all track processors */
  stopPlayback() {
    var r;
    for (const o of this.processors.values())
      (r = o.stopPlayback) == null || r.call(o);
  }
  /** Apply mute state by ramping connection gates */
  applyMuteState(r) {
    if (!this.ctx) return;
    const o = this.ctx.currentTime;
    for (const [s, i] of this.connections) {
      if (!i.gate) continue;
      const l = this.prevEdges.find((p) => p.id === s);
      if (!l) continue;
      const c = r.get(l.source) ?? !1, u = this.currentMuteState.get(l.source) ?? !1;
      if (c !== u) {
        const p = c ? 0 : 1;
        i.gate.gain.setTargetAtTime(p, o, 0.02);
      }
    }
    this.currentMuteState = new Map(r);
  }
  /** Get a live processor instance by node ID (for metering/visualization) */
  getProcessor(r) {
    return this.processors.get(r);
  }
  /** Get the AudioContext currentTime (for position tracking) */
  get currentTime() {
    var r;
    return ((r = this.ctx) == null ? void 0 : r.currentTime) ?? 0;
  }
  dispose() {
    var r;
    for (const o of this.connections.keys())
      this.removeConnection(o);
    for (const o of this.processors.keys()) {
      const s = this.processors.get(o);
      s == null || s.dispose();
    }
    this.processors.clear(), this.connections.clear(), (r = this.ctx) == null || r.close(), this.ctx = null;
  }
}
const bg = (e) => {
  let r;
  const o = /* @__PURE__ */ new Set(), s = (g, m) => {
    const h = typeof g == "function" ? g(r) : g;
    if (!Object.is(h, r)) {
      const w = r;
      r = m ?? (typeof h != "object" || h === null) ? h : Object.assign({}, r, h), o.forEach((I) => I(r, w));
    }
  }, i = () => r, u = { setState: s, getState: i, getInitialState: () => p, subscribe: (g) => (o.add(g), () => o.delete(g)) }, p = r = e(s, i, u);
  return u;
}, Ih = ((e) => e ? bg(e) : bg), g2 = (e) => e;
function m2(e, r = g2) {
  const o = bn.useSyncExternalStore(
    e.subscribe,
    bn.useCallback(() => r(e.getState()), [e, r]),
    bn.useCallback(() => r(e.getInitialState()), [e, r])
  );
  return bn.useDebugValue(o), o;
}
const h2 = (e) => {
  const r = Ih(e), o = (s) => m2(r, s);
  return Object.assign(o, r), o;
}, Gi = ((e) => h2);
var Ng = (e, r, o) => (i, l) => ({
  pastStates: (o == null ? void 0 : o.pastStates) || [],
  futureStates: (o == null ? void 0 : o.futureStates) || [],
  undo: (c = 1) => {
    var u, p;
    if (l().pastStates.length) {
      const g = ((u = o == null ? void 0 : o.partialize) == null ? void 0 : u.call(o, r())) || r(), m = l().pastStates.splice(-c, c), h = m.shift();
      e(h), i({
        pastStates: l().pastStates,
        futureStates: l().futureStates.concat(
          ((p = o == null ? void 0 : o.diff) == null ? void 0 : p.call(o, g, h)) || g,
          m.reverse()
        )
      });
    }
  },
  redo: (c = 1) => {
    var u, p;
    if (l().futureStates.length) {
      const g = ((u = o == null ? void 0 : o.partialize) == null ? void 0 : u.call(o, r())) || r(), m = l().futureStates.splice(-c, c), h = m.shift();
      e(h), i({
        pastStates: l().pastStates.concat(
          ((p = o == null ? void 0 : o.diff) == null ? void 0 : p.call(o, g, h)) || g,
          m.reverse()
        ),
        futureStates: l().futureStates
      });
    }
  },
  clear: () => i({ pastStates: [], futureStates: [] }),
  isTracking: !0,
  pause: () => i({ isTracking: !1 }),
  resume: () => i({ isTracking: !0 }),
  setOnSave: (c) => i({ _onSave: c }),
  // Internal properties
  _onSave: o == null ? void 0 : o.onSave,
  _handleSet: (c, u, p, g) => {
    var m, h;
    o != null && o.limit && l().pastStates.length >= (o == null ? void 0 : o.limit) && l().pastStates.shift(), (h = (m = l())._onSave) == null || h.call(m, c, p), i({
      pastStates: l().pastStates.concat(g || c),
      futureStates: []
    });
  }
}), Ch = (e, r) => (s, i, l) => {
  var g, m;
  l.temporal = Ih(
    ((g = r == null ? void 0 : r.wrapTemporal) == null ? void 0 : g.call(r, Ng(s, i, r))) || Ng(s, i, r)
  );
  const c = ((m = r == null ? void 0 : r.handleSet) == null ? void 0 : m.call(
    r,
    l.temporal.getState()._handleSet
  )) || l.temporal.getState()._handleSet, u = (h) => {
    var x, C, b;
    if (!l.temporal.getState().isTracking) return;
    const w = ((x = r == null ? void 0 : r.partialize) == null ? void 0 : x.call(r, i())) || i(), I = (C = r == null ? void 0 : r.diff) == null ? void 0 : C.call(r, h, w);
    // If the user has provided a diff function but nothing has been changed, deltaState will be null
    I === null || // If the user has provided an equality function, use it
    (b = r == null ? void 0 : r.equality) != null && b.call(r, h, w) || c(
      h,
      void 0,
      w,
      I
    );
  }, p = l.setState;
  return l.setState = (...h) => {
    var I;
    const w = ((I = r == null ? void 0 : r.partialize) == null ? void 0 : I.call(r, i())) || i();
    p(...h), u(w);
  }, e(
    // Modify the set function to call the userlandSet function
    (...h) => {
      var I;
      const w = ((I = r == null ? void 0 : r.partialize) == null ? void 0 : I.call(r, i())) || i();
      s(...h), u(w);
    },
    i,
    l
  );
};
const y2 = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
let At = (e = 21) => {
  let r = "", o = crypto.getRandomValues(new Uint8Array(e |= 0));
  for (; e--; )
    r += y2[o[e] & 63];
  return r;
};
function bh(e, r, o) {
  if (!e.source || !e.target)
    return { valid: !1, reason: "Missing source or target" };
  if (!e.sourceHandle || !e.targetHandle)
    return { valid: !1, reason: "Missing port handle" };
  if (e.source === e.target)
    return { valid: !1, reason: "Cannot connect a module to itself" };
  const s = r.find((m) => m.id === e.source);
  if (!s) return { valid: !1, reason: "Source node not found" };
  const i = r.find((m) => m.id === e.target);
  if (!i) return { valid: !1, reason: "Target node not found" };
  const c = ct(s.type).ports.find((m) => m.id === e.sourceHandle);
  if (!c) return { valid: !1, reason: "Source port not found" };
  const p = ct(i.type).ports.find((m) => m.id === e.targetHandle);
  return p ? c.direction !== "output" || p.direction !== "input" ? { valid: !1, reason: "Must connect output to input" } : c.signalType !== p.signalType ? {
    valid: !1,
    reason: `Signal type mismatch: ${c.signalType} → ${p.signalType}`
  } : o.find(
    (m) => m.target === e.target && m.targetHandle === e.targetHandle
  ) ? { valid: !1, reason: "Input port already connected" } : { valid: !0 } : { valid: !1, reason: "Target port not found" };
}
const pe = Gi()(
  Ch(
    (e, r) => ({
      nodes: [],
      edges: [],
      lastConnectionError: null,
      onNodesChange: (o) => {
        e({
          nodes: Ru(o, r().nodes)
        });
      },
      onEdgesChange: (o) => {
        e({
          edges: Bu(o, r().edges)
        });
      },
      onConnect: (o) => {
        const s = bh(o, r().nodes, r().edges);
        if (!s.valid) {
          e({ lastConnectionError: s.reason ?? "Invalid connection" });
          return;
        }
        const i = r().nodes.find((p) => p.id === o.source), c = ct(i.type).ports.find(
          (p) => p.id === o.sourceHandle
        ), u = {
          id: At(),
          source: o.source,
          sourceHandle: o.sourceHandle,
          target: o.target,
          targetHandle: o.targetHandle,
          type: c.signalType,
          data: {
            signalType: c.signalType,
            channelFormat: c.channelFormat
          }
        };
        e({ edges: [...r().edges, u], lastConnectionError: null });
      },
      addModule: (o, s) => {
        const i = ct(o);
        if (i.singleton) {
          const p = r().nodes.find((g) => g.type === o);
          if (p) return p.id;
        }
        const l = At(), c = {};
        for (const p of i.parameters)
          c[p.id] = p.defaultValue;
        const u = {
          id: l,
          type: o,
          position: s ?? { x: 100, y: 100 },
          dragHandle: ".daw-node__header",
          data: {
            label: i.label,
            parameters: c
          }
        };
        return e({ nodes: [...r().nodes, u] }), l;
      },
      removeModule: (o) => {
        const s = r().nodes.find((i) => i.id === o);
        s && ct(s.type).singleton || e({
          nodes: r().nodes.filter((i) => i.id !== o),
          edges: r().edges.filter(
            (i) => i.source !== o && i.target !== o
          )
        });
      },
      updateParameter: (o, s, i) => {
        e({
          nodes: r().nodes.map(
            (l) => l.id === o ? {
              ...l,
              data: {
                ...l.data,
                parameters: {
                  ...l.data.parameters,
                  [s]: i
                }
              }
            } : l
          )
        });
      },
      setNodeData: (o, s) => {
        e({
          nodes: r().nodes.map(
            (i) => i.id === o ? { ...i, data: { ...i.data, ...s } } : i
          )
        });
      },
      toggleMute: (o) => {
        e({
          nodes: r().nodes.map(
            (s) => s.id === o ? { ...s, data: { ...s.data, muted: !s.data.muted } } : s
          )
        });
      },
      toggleSolo: (o, s = !0) => {
        const i = r().nodes, l = i.find((u) => u.id === o);
        if (!l) return;
        const c = !l.data.soloed;
        e({
          nodes: i.map((u) => u.id === o ? { ...u, data: { ...u.data, soloed: c } } : s && c ? { ...u, data: { ...u.data, soloed: !1 } } : u)
        });
      },
      clearAllSolo: () => {
        e({
          nodes: r().nodes.map(
            (o) => o.data.soloed ? { ...o, data: { ...o.data, soloed: !1 } } : o
          )
        });
      },
      toggleBypass: (o) => {
        e({
          nodes: r().nodes.map(
            (s) => s.id === o ? { ...s, data: { ...s.data, bypassed: !s.data.bypassed } } : s
          )
        });
      },
      clearConnectionError: () => {
        e({ lastConnectionError: null });
      },
      loadPatch: (o, s) => {
        e({ nodes: o, edges: s });
      }
    }),
    {
      // Undo/redo config: exclude position-only changes
      limit: 100,
      partialize: (e) => ({
        nodes: e.nodes.map((r) => ({
          id: r.id,
          type: r.type,
          data: r.data
        })),
        edges: e.edges
      })
    }
  )
), nt = Gi()((e) => ({
  isPlaying: !1,
  position: 0,
  bpm: 120,
  loopEnabled: !1,
  loopStart: 0,
  loopEnd: 0,
  play() {
    e({ isPlaying: !0 });
  },
  stop() {
    e({ isPlaying: !1, position: 0 });
  },
  pause() {
    e({ isPlaying: !1 });
  },
  seek(r) {
    e({ position: r });
  },
  setBpm(r) {
    e({ bpm: r });
  },
  setLoop(r, o) {
    e({ loopStart: r, loopEnd: o, loopEnabled: !0 });
  },
  toggleLoop() {
    e((r) => ({ loopEnabled: !r.loopEnabled }));
  },
  setPosition(r) {
    e({ position: r });
  }
})), fu = [
  { label: "Free", value: null },
  { label: "1 bar", value: 0 },
  // computed from bpm
  { label: "1/2 note", value: 0 },
  { label: "1/4 note", value: 0 },
  { label: "1/8 note", value: 0 },
  { label: "1/16 note", value: 0 },
  { label: "1 sec", value: 1 },
  { label: "0.5 sec", value: 0.5 },
  { label: "0.1 sec", value: 0.1 }
];
function Nh(e, r) {
  if (e.value !== null && e.value > 0) return e.value;
  if (e.value === null) return null;
  const o = 60 / r;
  switch (e.label) {
    case "1 bar":
      return o * 4;
    case "1/2 note":
      return o * 2;
    case "1/4 note":
      return o;
    case "1/8 note":
      return o / 2;
    case "1/16 note":
      return o / 4;
    default:
      return null;
  }
}
const ve = Gi()(
  Ch(
    (e, r) => ({
      isOpen: !1,
      selectedTrackIds: [],
      zoom: 100,
      // 100px per second default
      scrollX: 0,
      activeTool: "pointer",
      gridResolution: fu[0],
      // Free
      snapEnabled: !0,
      overlapMode: "layer",
      regions: {},
      selectedRegionIds: [],
      openEditor(o) {
        e({ isOpen: !0, selectedTrackIds: [o], selectedRegionIds: [] });
      },
      toggleTrackInEditor(o) {
        const { selectedTrackIds: s } = r();
        if (s.includes(o)) {
          const i = s.filter((l) => l !== o);
          i.length === 0 ? e({ isOpen: !1, selectedTrackIds: [], selectedRegionIds: [] }) : e({ selectedTrackIds: i });
        } else
          e({ isOpen: !0, selectedTrackIds: [...s, o] });
      },
      closeEditor() {
        e({ isOpen: !1, selectedTrackIds: [], selectedRegionIds: [] });
      },
      setZoom(o) {
        e({ zoom: Math.max(10, Math.min(1e3, o)) });
      },
      setScrollX(o) {
        e({ scrollX: Math.max(0, o) });
      },
      setTool(o) {
        e({ activeTool: o });
      },
      setGridResolution(o) {
        e({ gridResolution: o });
      },
      toggleSnap() {
        e((o) => ({ snapEnabled: !o.snapEnabled }));
      },
      addRegion(o) {
        const s = At(), i = { ...o, id: s }, { regions: l } = r(), c = l[i.trackId] ?? [];
        return e({
          regions: {
            ...l,
            [i.trackId]: [...c, i]
          }
        }), s;
      },
      updateRegion(o, s) {
        const { regions: i } = r(), l = {};
        for (const [c, u] of Object.entries(i))
          l[c] = u.map(
            (p) => p.id === o ? { ...p, ...s } : p
          );
        e({ regions: l });
      },
      removeRegion(o) {
        const { regions: s } = r(), i = {};
        for (const [l, c] of Object.entries(s))
          i[l] = c.filter((u) => u.id !== o);
        e({
          regions: i,
          selectedRegionIds: r().selectedRegionIds.filter((l) => l !== o)
        });
      },
      removeRegionsForTrack(o) {
        const { regions: s } = r(), i = { ...s };
        delete i[o], e({
          regions: i,
          selectedRegionIds: r().selectedRegionIds.filter((l) => {
            const u = Object.values(s).flat().find((p) => p.id === l);
            return u ? u.trackId !== o : !0;
          })
        });
      },
      splitRegion(o, s) {
        const { regions: i } = r();
        for (const [l, c] of Object.entries(i)) {
          const u = c.findIndex((I) => I.id === o);
          if (u === -1) continue;
          const p = c[u], g = s - p.position;
          if (g <= 0 || g >= p.duration) return;
          const m = {
            id: At(),
            trackId: p.trackId,
            bufferRef: p.bufferRef,
            position: p.position,
            sourceOffset: p.sourceOffset,
            duration: g,
            fadeIn: p.fadeIn,
            fadeOut: 5e-3
          }, h = {
            id: At(),
            trackId: p.trackId,
            bufferRef: p.bufferRef,
            position: s,
            sourceOffset: p.sourceOffset + g,
            duration: p.duration - g,
            fadeIn: 5e-3,
            fadeOut: p.fadeOut
          }, w = [...c];
          w.splice(u, 1, m, h), e({
            regions: { ...i, [l]: w },
            selectedRegionIds: [m.id, h.id]
          });
          return;
        }
      },
      setOverlapMode(o) {
        e({ overlapMode: o });
      },
      selectRegions(o) {
        e({ selectedRegionIds: o });
      },
      getRegionsForTrack(o) {
        return r().regions[o] ?? [];
      }
    }),
    {
      limit: 100,
      partialize: (e) => ({
        regions: e.regions
      })
    }
  )
);
function _h(e, r, o) {
  const s = /* @__PURE__ */ new Map(), i = e.filter((p) => p.data.soloed).map((p) => p.id);
  if (i.length === 0) {
    for (const p of e)
      s.set(p.id, !!p.data.muted);
    return s;
  }
  const l = /* @__PURE__ */ new Map();
  for (const p of e)
    l.set(p.id, []);
  for (const p of r) {
    const g = l.get(p.source);
    g && g.push(p.target);
  }
  const c = new Set(i), u = [...i];
  for (; u.length > 0; ) {
    const p = u.shift(), g = l.get(p) ?? [];
    for (const m of g)
      c.has(m) || (c.add(m), u.push(m));
  }
  for (const p of e)
    try {
      o(p.type).soloSafe && c.add(p.id);
    } catch {
    }
  for (const p of e) {
    const g = !c.has(p.id) || !!p.data.muted;
    s.set(p.id, g);
  }
  return s;
}
let pu = null;
function $t() {
  return pu;
}
function w2() {
  const e = R.useRef(null), r = R.useRef(!1), o = R.useRef(0), s = R.useRef(0), i = R.useRef(0);
  e.current || (e.current = new p2(), pu = e.current);
  const l = R.useCallback(async () => {
    if (r.current) return;
    const u = e.current;
    await u.initialize(), r.current = !0;
    const { nodes: p, edges: g } = pe.getState();
    u.reconcile(p, g);
    const { regions: m } = ve.getState();
    for (const [h, w] of Object.entries(m))
      u.updateTrackRegions(h, w);
  }, []), c = R.useCallback(() => {
    const u = e.current;
    if (!u || !nt.getState().isPlaying) return;
    const p = u.currentTime - s.current, g = i.current + p;
    nt.getState().setPosition(g), o.current = requestAnimationFrame(c);
  }, []);
  return R.useEffect(() => {
    const u = pe.subscribe((p) => {
      if (r.current && e.current) {
        e.current.reconcile(p.nodes, p.edges);
        const g = _h(p.nodes, p.edges, ct);
        e.current.applyMuteState(g);
      }
    });
    return () => {
      var p;
      u(), cancelAnimationFrame(o.current), (p = e.current) == null || p.dispose(), e.current = null, pu = null, r.current = !1;
    };
  }, []), R.useEffect(() => {
    const u = nt.subscribe(
      (p, g) => {
        const m = e.current;
        !m || !r.current || (p.isPlaying && !g.isPlaying && (i.current = p.position, s.current = m.currentTime, m.startPlayback(p.position), o.current = requestAnimationFrame(c)), !p.isPlaying && g.isPlaying && (cancelAnimationFrame(o.current), m.stopPlayback()));
      }
    );
    return () => {
      u();
    };
  }, [c]), R.useEffect(() => {
    const u = ve.subscribe(
      (p, g) => {
        const m = e.current;
        if (!(!m || !r.current) && p.regions !== g.regions) {
          for (const [h, w] of Object.entries(p.regions))
            m.updateTrackRegions(h, w);
          if (nt.getState().isPlaying) {
            const h = nt.getState().position;
            m.stopPlayback(), i.current = h, s.current = m.currentTime, m.startPlayback(h);
          }
        }
      }
    );
    return () => {
      u();
    };
  }, []), {
    initialize: l,
    get audioContext() {
      var u;
      return ((u = e.current) == null ? void 0 : u.audioContext) ?? null;
    }
  };
}
function v2({
  id: e,
  sourceX: r,
  sourceY: o,
  targetX: s,
  targetY: i,
  sourcePosition: l,
  targetPosition: c,
  data: u
}) {
  const [p, g, m] = Ti({
    sourceX: r,
    sourceY: o,
    targetX: s,
    targetY: i,
    sourcePosition: l,
    targetPosition: c
  }), h = (u == null ? void 0 : u.channelFormat) === "stereo", w = u == null ? void 0 : u.sourceChannelFormat, I = u == null ? void 0 : u.targetChannelFormat, x = w && I && w !== I;
  return /* @__PURE__ */ f.jsxs(f.Fragment, { children: [
    /* @__PURE__ */ f.jsx(
      wo,
      {
        id: e,
        path: p,
        className: `daw-edge daw-edge--audio ${h ? "daw-edge--stereo" : "daw-edge--mono"}`
      }
    ),
    x && /* @__PURE__ */ f.jsx(j_, { children: /* @__PURE__ */ f.jsxs(
      "div",
      {
        className: "daw-edge__format-badge",
        style: {
          position: "absolute",
          transform: `translate(-50%, -50%) translate(${g}px, ${m}px)`,
          pointerEvents: "none"
        },
        children: [
          w === "mono" ? "M" : "S",
          "→",
          I === "mono" ? "M" : "S"
        ]
      }
    ) })
  ] });
}
function x2({
  id: e,
  sourceX: r,
  sourceY: o,
  targetX: s,
  targetY: i,
  sourcePosition: l,
  targetPosition: c
}) {
  const [u] = Ti({
    sourceX: r,
    sourceY: o,
    targetX: s,
    targetY: i,
    sourcePosition: l,
    targetPosition: c
  });
  return /* @__PURE__ */ f.jsx(
    wo,
    {
      id: e,
      path: u,
      className: "daw-edge daw-edge--parameter"
    }
  );
}
const I2 = {
  audio: v2,
  parameter: x2
}, on = Gi()((e, r) => ({
  scopeStack: [{ parentNodeId: null, label: "Session", moduleType: null }],
  internalGraphs: {},
  pushScope: (o, s, i) => {
    e({
      scopeStack: [...r().scopeStack, { parentNodeId: o, label: s, moduleType: i }]
    });
  },
  popToDepth: (o) => {
    const s = r().scopeStack;
    o >= 0 && o < s.length && e({ scopeStack: s.slice(0, o + 1) });
  },
  popToRoot: () => {
    e({ scopeStack: [r().scopeStack[0]] });
  },
  initInternalGraph: (o, s, i) => {
    e({
      internalGraphs: {
        ...r().internalGraphs,
        [o]: { nodes: s, edges: i }
      }
    });
  },
  updateInternalNodes: (o, s) => {
    const i = r().internalGraphs, l = i[o];
    l && e({
      internalGraphs: {
        ...i,
        [o]: {
          ...l,
          nodes: Ru(s, l.nodes)
        }
      }
    });
  },
  updateInternalEdges: (o, s) => {
    const i = r().internalGraphs, l = i[o];
    l && e({
      internalGraphs: {
        ...i,
        [o]: {
          ...l,
          edges: Bu(s, l.edges)
        }
      }
    });
  },
  isSessionScope: () => r().scopeStack.length <= 1,
  currentParentNodeId: () => {
    const o = r().scopeStack;
    return o.length > 1 ? o[o.length - 1].parentNodeId : null;
  },
  currentDepth: () => r().scopeStack.length - 1
}));
function C2() {
  const e = on((b) => b.isSessionScope()), r = on((b) => b.currentParentNodeId()), o = on((b) => b.internalGraphs), s = pe((b) => b.nodes), i = pe((b) => b.edges), l = pe((b) => b.onNodesChange), c = pe((b) => b.onEdgesChange), u = pe((b) => b.onConnect), p = on((b) => b.updateInternalNodes), g = on((b) => b.updateInternalEdges), m = r ? o[r] : null, h = e ? s : (m == null ? void 0 : m.nodes) ?? [], w = e ? i : (m == null ? void 0 : m.edges) ?? [], I = R.useCallback(
    (b) => {
      e ? l(b) : r && p(r, b);
    },
    [e, r, l, p]
  ), x = R.useCallback(
    (b) => {
      e ? c(b) : r && g(r, b);
    },
    [e, r, c, g]
  ), C = R.useCallback(
    (b) => {
      e && u(b);
    },
    [e, u]
  );
  return {
    nodes: h,
    edges: w,
    onNodesChange: I,
    onEdgesChange: x,
    onConnect: C,
    isSession: e
  };
}
const b2 = ["io", "generator", "effect", "routing", "utility", "atomic"], Zc = {
  io: "I/O",
  generator: "Generators",
  effect: "Effects",
  routing: "Routing",
  utility: "Utility",
  atomic: "Atomic"
}, Yc = {
  io: "var(--daw-cat-io)",
  generator: "var(--daw-cat-source)",
  effect: "var(--daw-cat-effect)",
  routing: "var(--daw-cat-routing)",
  utility: "var(--daw-cat-utility)",
  atomic: "var(--daw-cat-atomic)"
};
function N2({ allowedModules: e }) {
  const r = pe((x) => x.addModule), o = a2().filter(
    (x) => !x.singleton && !x.internal && (!e || e.includes(x.type))
  ), [s, i] = R.useState(null), [l, c] = R.useState(""), u = R.useRef(null), p = R.useRef(null), g = R.useCallback((x) => {
    i((C) => C === x ? null : x);
  }, []), m = R.useCallback((x) => {
    r(x, { x: 200 + Math.random() * 200, y: 100 + Math.random() * 200 }), i(null), c("");
  }, [r]);
  R.useEffect(() => {
    if (!s && !l) return;
    const x = (C) => {
      u.current && !u.current.contains(C.target) && (i(null), c(""));
    };
    return document.addEventListener("mousedown", x), () => document.removeEventListener("mousedown", x);
  }, [s, l]), R.useEffect(() => {
    if (!s && !l) return;
    const x = (C) => {
      C.key === "Escape" && (i(null), c(""));
    };
    return window.addEventListener("keydown", x), () => window.removeEventListener("keydown", x);
  }, [s, l]);
  const h = /* @__PURE__ */ new Map();
  for (const x of o) {
    const C = h.get(x.category) ?? [];
    C.push(x), h.set(x.category, C);
  }
  const w = l.toLowerCase().trim(), I = w ? o.filter((x) => x.label.toLowerCase().includes(w)) : [];
  return /* @__PURE__ */ f.jsx("div", { className: "daw-module-panel", ref: u, children: /* @__PURE__ */ f.jsxs("div", { className: "daw-module-panel__categories", children: [
    /* @__PURE__ */ f.jsx(
      "input",
      {
        ref: p,
        className: "daw-module-panel__search nodrag",
        type: "text",
        placeholder: "Search modules...",
        value: l,
        onChange: (x) => {
          c(x.target.value), i(null);
        }
      }
    ),
    w ? (
      // Search results mode: flat list with category dots
      I.length > 0 ? /* @__PURE__ */ f.jsx("div", { className: "daw-module-panel__list", children: I.map((x) => /* @__PURE__ */ f.jsxs(
        "button",
        {
          className: "daw-module-panel__btn",
          onClick: () => m(x.type),
          children: [
            /* @__PURE__ */ f.jsx(
              "span",
              {
                className: "daw-module-panel__category-dot",
                style: { background: Yc[x.category], display: "inline-block", marginRight: 6 }
              }
            ),
            x.label
          ]
        },
        x.type
      )) }) : /* @__PURE__ */ f.jsx("div", { style: { padding: "6px 8px", fontSize: "0.7rem", color: "var(--daw-text-tertiary)" }, children: "No modules found" })
    ) : (
      // Category accordion mode
      b2.map((x) => {
        const C = h.get(x);
        if (!C || C.length === 0) return null;
        const b = s === x;
        return /* @__PURE__ */ f.jsxs("div", { className: "daw-module-panel__cat-wrapper", children: [
          /* @__PURE__ */ f.jsxs(
            "button",
            {
              className: `daw-module-panel__cat-btn ${b ? "daw-module-panel__cat-btn--active" : ""}`,
              onClick: () => g(x),
              "aria-expanded": b,
              title: Zc[x],
              children: [
                /* @__PURE__ */ f.jsx(
                  "span",
                  {
                    className: "daw-module-panel__category-dot",
                    style: { background: Yc[x] }
                  }
                ),
                Zc[x]
              ]
            }
          ),
          b && /* @__PURE__ */ f.jsxs("div", { className: "daw-module-panel__popover", children: [
            /* @__PURE__ */ f.jsxs("div", { className: "daw-module-panel__popover-header", children: [
              /* @__PURE__ */ f.jsx(
                "span",
                {
                  className: "daw-module-panel__category-dot",
                  style: { background: Yc[x] }
                }
              ),
              Zc[x]
            ] }),
            /* @__PURE__ */ f.jsx("div", { className: "daw-module-panel__list", children: C.map((N) => /* @__PURE__ */ f.jsx(
              "button",
              {
                className: "daw-module-panel__btn",
                onClick: () => m(N.type),
                children: N.label
              },
              N.type
            )) })
          ] })
        ] }, x);
      })
    )
  ] }) });
}
function _2() {
  const e = pe.temporal;
  return R.useEffect(() => {
    const r = (o) => {
      (o.metaKey || o.ctrlKey) && (o.key === "z" && !o.shiftKey ? (o.preventDefault(), e.getState().undo()) : (o.key === "z" && o.shiftKey || o.key === "y" && !o.shiftKey) && (o.preventDefault(), e.getState().redo()));
    };
    return window.addEventListener("keydown", r), () => window.removeEventListener("keydown", r);
  }, [e]), {
    undo: () => e.getState().undo(),
    redo: () => e.getState().redo(),
    canUndo: () => e.getState().pastStates.length > 0,
    canRedo: () => e.getState().futureStates.length > 0
  };
}
function A2() {
  const [e, r] = R.useState({
    ctxState: "suspended",
    sampleRate: 0,
    moduleCount: 0,
    connectionCount: 0,
    memoryMB: null,
    memoryPct: null
  });
  R.useEffect(() => {
    const i = () => {
      const c = $t(), u = (c == null ? void 0 : c.audioContext) ?? null, { nodes: p, edges: g } = pe.getState(), m = performance.memory;
      r({
        ctxState: (u == null ? void 0 : u.state) ?? "closed",
        sampleRate: (u == null ? void 0 : u.sampleRate) ?? 0,
        moduleCount: p.length,
        connectionCount: g.length,
        memoryMB: m ? Math.round(m.usedJSHeapSize / 1048576) : null,
        memoryPct: m ? Math.round(m.usedJSHeapSize / m.jsHeapSizeLimit * 100) : null
      });
    };
    i();
    const l = setInterval(i, 2e3);
    return () => clearInterval(l);
  }, []);
  const o = e.memoryMB !== null, s = e.memoryPct < 50 ? "low" : e.memoryPct < 80 ? "mid" : "high";
  return /* @__PURE__ */ f.jsxs("div", { className: "daw-perf", children: [
    /* @__PURE__ */ f.jsx("span", { className: `daw-perf__dot daw-perf__dot--${e.ctxState}` }),
    /* @__PURE__ */ f.jsxs("span", { className: "daw-perf__stats", children: [
      e.moduleCount,
      "M ",
      e.connectionCount,
      "C",
      o && ` ${e.memoryMB}MB`
    ] }),
    o && /* @__PURE__ */ f.jsx("div", { className: "daw-perf__bar", children: /* @__PURE__ */ f.jsx(
      "div",
      {
        className: `daw-perf__bar-fill daw-perf__bar-fill--${s}`,
        style: { width: `${Math.min(100, e.memoryPct)}%` }
      }
    ) }),
    /* @__PURE__ */ f.jsxs("div", { className: "daw-perf__tooltip", children: [
      /* @__PURE__ */ f.jsxs("div", { className: "daw-perf__tooltip-row", children: [
        /* @__PURE__ */ f.jsx("span", { className: "daw-perf__tooltip-label", children: "Audio engine" }),
        /* @__PURE__ */ f.jsx("span", { className: "daw-perf__tooltip-value", children: e.ctxState })
      ] }),
      /* @__PURE__ */ f.jsxs("div", { className: "daw-perf__tooltip-row", children: [
        /* @__PURE__ */ f.jsx("span", { className: "daw-perf__tooltip-label", children: "Sample rate" }),
        /* @__PURE__ */ f.jsxs("span", { className: "daw-perf__tooltip-value", children: [
          e.sampleRate,
          " Hz"
        ] })
      ] }),
      /* @__PURE__ */ f.jsxs("div", { className: "daw-perf__tooltip-row", children: [
        /* @__PURE__ */ f.jsx("span", { className: "daw-perf__tooltip-label", children: "Modules" }),
        /* @__PURE__ */ f.jsx("span", { className: "daw-perf__tooltip-value", children: e.moduleCount })
      ] }),
      /* @__PURE__ */ f.jsxs("div", { className: "daw-perf__tooltip-row", children: [
        /* @__PURE__ */ f.jsx("span", { className: "daw-perf__tooltip-label", children: "Connections" }),
        /* @__PURE__ */ f.jsx("span", { className: "daw-perf__tooltip-value", children: e.connectionCount })
      ] }),
      o && /* @__PURE__ */ f.jsxs("div", { className: "daw-perf__tooltip-row", children: [
        /* @__PURE__ */ f.jsx("span", { className: "daw-perf__tooltip-label", children: "JS Heap" }),
        /* @__PURE__ */ f.jsxs("span", { className: "daw-perf__tooltip-value", children: [
          e.memoryMB,
          " MB (",
          e.memoryPct,
          "%)"
        ] })
      ] })
    ] })
  ] });
}
function S2({ onToggleFullscreen: e }) {
  const { undo: r, redo: o, canUndo: s, canRedo: i } = _2(), [l, c] = R.useState(!1);
  return R.useEffect(() => {
    const u = () => c(!!document.fullscreenElement);
    return document.addEventListener("fullscreenchange", u), () => document.removeEventListener("fullscreenchange", u);
  }, []), /* @__PURE__ */ f.jsxs("div", { className: "daw-toolbar", children: [
    /* @__PURE__ */ f.jsx(
      "button",
      {
        className: "daw-toolbar__btn",
        onClick: r,
        disabled: !s(),
        title: "Undo (Ctrl+Z)",
        children: /* @__PURE__ */ f.jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
          /* @__PURE__ */ f.jsx("path", { d: "M3 7v6h6" }),
          /* @__PURE__ */ f.jsx("path", { d: "M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" })
        ] })
      }
    ),
    /* @__PURE__ */ f.jsx(
      "button",
      {
        className: "daw-toolbar__btn",
        onClick: o,
        disabled: !i(),
        title: "Redo (Ctrl+Shift+Z)",
        children: /* @__PURE__ */ f.jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
          /* @__PURE__ */ f.jsx("path", { d: "M21 7v6h-6" }),
          /* @__PURE__ */ f.jsx("path", { d: "M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13" })
        ] })
      }
    ),
    /* @__PURE__ */ f.jsx("div", { className: "daw-toolbar__sep" }),
    /* @__PURE__ */ f.jsx(
      "button",
      {
        className: "daw-toolbar__btn",
        onClick: e,
        title: l ? "Exit Fullscreen" : "Fullscreen",
        children: l ? /* @__PURE__ */ f.jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
          /* @__PURE__ */ f.jsx("path", { d: "M8 3v3a2 2 0 0 1-2 2H3" }),
          /* @__PURE__ */ f.jsx("path", { d: "M21 8h-3a2 2 0 0 1-2-2V3" }),
          /* @__PURE__ */ f.jsx("path", { d: "M3 16h3a2 2 0 0 1 2 2v3" }),
          /* @__PURE__ */ f.jsx("path", { d: "M16 21v-3a2 2 0 0 1 2-2h3" })
        ] }) : /* @__PURE__ */ f.jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
          /* @__PURE__ */ f.jsx("path", { d: "M8 3H5a2 2 0 0 0-2 2v3" }),
          /* @__PURE__ */ f.jsx("path", { d: "M21 8V5a2 2 0 0 0-2-2h-3" }),
          /* @__PURE__ */ f.jsx("path", { d: "M3 16v3a2 2 0 0 0 2 2h3" }),
          /* @__PURE__ */ f.jsx("path", { d: "M16 21h3a2 2 0 0 0 2-2v-3" })
        ] })
      }
    ),
    /* @__PURE__ */ f.jsx("div", { className: "daw-toolbar__sep" }),
    /* @__PURE__ */ f.jsx(A2, {})
  ] });
}
function Ah(e) {
  const r = Math.floor(e / 60), o = Math.floor(e % 60), s = Math.floor(e % 1 * 10);
  return `${r}:${o.toString().padStart(2, "0")}.${s}`;
}
function k2() {
  const e = nt((g) => g.isPlaying), r = nt((g) => g.position), o = nt((g) => g.play), s = nt((g) => g.stop), i = nt((g) => g.pause), l = nt((g) => g.seek), c = R.useCallback(() => {
    e ? i() : o();
  }, [e, o, i]), u = R.useCallback(() => {
    s();
  }, [s]), p = R.useCallback(() => {
    l(0);
  }, [l]);
  return /* @__PURE__ */ f.jsxs("div", { className: "daw-transport", children: [
    /* @__PURE__ */ f.jsx(
      "button",
      {
        className: "daw-transport__btn",
        onClick: p,
        title: "Return to start (Enter)",
        "aria-label": "Return to start",
        children: /* @__PURE__ */ f.jsxs("svg", { width: "14", height: "14", viewBox: "0 0 14 14", fill: "currentColor", children: [
          /* @__PURE__ */ f.jsx("rect", { x: "2", y: "3", width: "2", height: "8" }),
          /* @__PURE__ */ f.jsx("polygon", { points: "12,3 12,11 5,7" })
        ] })
      }
    ),
    /* @__PURE__ */ f.jsx(
      "button",
      {
        className: `daw-transport__btn daw-transport__btn--play ${e ? "active" : ""}`,
        onClick: c,
        title: e ? "Pause (Space)" : "Play (Space)",
        "aria-label": e ? "Pause" : "Play",
        children: e ? /* @__PURE__ */ f.jsxs("svg", { width: "14", height: "14", viewBox: "0 0 14 14", fill: "currentColor", children: [
          /* @__PURE__ */ f.jsx("rect", { x: "3", y: "2", width: "3", height: "10", rx: "0.5" }),
          /* @__PURE__ */ f.jsx("rect", { x: "8", y: "2", width: "3", height: "10", rx: "0.5" })
        ] }) : /* @__PURE__ */ f.jsx("svg", { width: "14", height: "14", viewBox: "0 0 14 14", fill: "currentColor", children: /* @__PURE__ */ f.jsx("polygon", { points: "3,2 12,7 3,12" }) })
      }
    ),
    /* @__PURE__ */ f.jsx(
      "button",
      {
        className: "daw-transport__btn",
        onClick: u,
        title: "Stop",
        "aria-label": "Stop",
        children: /* @__PURE__ */ f.jsx("svg", { width: "14", height: "14", viewBox: "0 0 14 14", fill: "currentColor", children: /* @__PURE__ */ f.jsx("rect", { x: "3", y: "3", width: "8", height: "8", rx: "1" }) })
      }
    ),
    /* @__PURE__ */ f.jsx("div", { className: "daw-transport__position", children: Ah(r) })
  ] });
}
function j2() {
  const e = on((o) => o.scopeStack), r = on((o) => o.popToDepth);
  return e.length <= 1 ? null : /* @__PURE__ */ f.jsx("nav", { className: "daw-breadcrumb", "aria-label": "Module scope", children: e.map((o, s) => {
    const i = s === e.length - 1;
    return /* @__PURE__ */ f.jsxs("span", { className: "daw-breadcrumb__item", children: [
      s > 0 && /* @__PURE__ */ f.jsx("span", { className: "daw-breadcrumb__sep", children: "›" }),
      i ? /* @__PURE__ */ f.jsx("span", { className: "daw-breadcrumb__current", children: o.label }) : /* @__PURE__ */ f.jsx(
        "button",
        {
          className: "daw-breadcrumb__link",
          onClick: () => r(s),
          children: o.label
        }
      )
    ] }, s);
  }) });
}
function M2() {
  const e = ve((S) => S.activeTool), r = ve((S) => S.setTool), o = ve((S) => S.snapEnabled), s = ve((S) => S.toggleSnap), i = ve((S) => S.gridResolution), l = ve((S) => S.setGridResolution), c = ve((S) => S.zoom), u = ve((S) => S.setZoom), p = ve((S) => S.closeEditor), g = ve((S) => S.overlapMode), m = ve((S) => S.setOverlapMode), h = ve((S) => S.selectedTrackIds), w = ve((S) => S.toggleTrackInEditor), I = pe((S) => S.nodes), x = R.useCallback((S) => {
    r(S);
  }, [r]), C = R.useCallback((S) => {
    const P = fu.find((F) => F.label === S.target.value);
    P && l(P);
  }, [l]), b = R.useCallback(() => {
    u(c * 1.5);
  }, [c, u]), N = R.useCallback(() => {
    u(c / 1.5);
  }, [c, u]), k = R.useCallback((S) => {
    m(S.target.value);
  }, [m]), A = [
    { tool: "pointer", label: "V", shortcut: "Pointer (V)" },
    { tool: "trim", label: "T", shortcut: "Trim (T)" },
    { tool: "slice", label: "S", shortcut: "Slice (S)" },
    { tool: "fade", label: "F", shortcut: "Fade (F)" },
    { tool: "zoom", label: "Z", shortcut: "Zoom (Z)" },
    { tool: "draw", label: "D", shortcut: "Draw (D)" }
  ];
  return /* @__PURE__ */ f.jsxs("div", { className: "daw-editor-toolbar", children: [
    /* @__PURE__ */ f.jsx("div", { className: "daw-editor-toolbar__section", children: A.map(({ tool: S, label: P, shortcut: F }) => /* @__PURE__ */ f.jsx(
      "button",
      {
        className: `daw-editor-toolbar__btn ${e === S ? "active" : ""}`,
        onClick: () => x(S),
        title: F,
        "aria-label": F,
        children: P
      },
      S
    )) }),
    /* @__PURE__ */ f.jsx("div", { className: "daw-editor-toolbar__divider" }),
    /* @__PURE__ */ f.jsxs("div", { className: "daw-editor-toolbar__section", children: [
      /* @__PURE__ */ f.jsx(
        "button",
        {
          className: `daw-editor-toolbar__btn daw-editor-toolbar__btn--snap ${o ? "active" : ""}`,
          onClick: s,
          title: "Toggle snap (G)",
          "aria-label": "Toggle snap",
          children: "Snap"
        }
      ),
      /* @__PURE__ */ f.jsx(
        "select",
        {
          className: "daw-editor-toolbar__select",
          value: i.label,
          onChange: C,
          children: fu.map((S) => /* @__PURE__ */ f.jsx("option", { value: S.label, children: S.label }, S.label))
        }
      )
    ] }),
    /* @__PURE__ */ f.jsx("div", { className: "daw-editor-toolbar__divider" }),
    /* @__PURE__ */ f.jsx("div", { className: "daw-editor-toolbar__section", children: /* @__PURE__ */ f.jsxs(
      "select",
      {
        className: "daw-editor-toolbar__select",
        value: g,
        onChange: k,
        title: "Region overlap mode",
        children: [
          /* @__PURE__ */ f.jsx("option", { value: "layer", children: "Layer" }),
          /* @__PURE__ */ f.jsx("option", { value: "crossfade", children: "Crossfade" }),
          /* @__PURE__ */ f.jsx("option", { value: "overwrite", children: "Overwrite" }),
          /* @__PURE__ */ f.jsx("option", { value: "ripple", children: "Ripple" })
        ]
      }
    ) }),
    /* @__PURE__ */ f.jsx("div", { className: "daw-editor-toolbar__divider" }),
    /* @__PURE__ */ f.jsxs("div", { className: "daw-editor-toolbar__zoom", children: [
      /* @__PURE__ */ f.jsx(
        "button",
        {
          className: "daw-editor-toolbar__zoom-btn",
          onClick: N,
          title: "Zoom out",
          "aria-label": "Zoom out",
          children: "−"
        }
      ),
      /* @__PURE__ */ f.jsx(
        "button",
        {
          className: "daw-editor-toolbar__zoom-btn",
          onClick: b,
          title: "Zoom in",
          "aria-label": "Zoom in",
          children: "+"
        }
      )
    ] }),
    /* @__PURE__ */ f.jsx("div", { className: "daw-editor-toolbar__tracks", children: h.map((S) => {
      const P = I.find((j) => j.id === S), F = (P == null ? void 0 : P.data.fileName) ?? (P == null ? void 0 : P.data.label) ?? "Track";
      return /* @__PURE__ */ f.jsxs("span", { className: "daw-editor-toolbar__track-tag", title: F, children: [
        F,
        h.length > 1 && /* @__PURE__ */ f.jsx(
          "button",
          {
            className: "daw-editor-toolbar__track-tag-close",
            onClick: () => w(S),
            "aria-label": `Remove ${F} from editor`,
            children: "×"
          }
        )
      ] }, S);
    }) }),
    /* @__PURE__ */ f.jsx(
      "button",
      {
        className: "daw-editor-toolbar__close",
        onClick: p,
        title: "Close editor (Esc)",
        "aria-label": "Close editor",
        children: "×"
      }
    )
  ] });
}
function ii(e, r) {
  return r === null || r <= 0 ? e : Math.round(e / r) * r;
}
function Sh(e, r, o) {
  if (o === null || o <= 0) return [];
  const s = [], i = Math.ceil(e / o) * o;
  for (let l = i; l <= r; l += o)
    s.push(l);
  return s;
}
function T2({ width: e }) {
  const r = R.useRef(null), o = ve((m) => m.zoom), s = ve((m) => m.scrollX), i = ve((m) => m.gridResolution), l = nt((m) => m.bpm), c = nt((m) => m.seek), u = 24, p = Nh(i, l);
  R.useEffect(() => {
    const m = r.current;
    if (!m || e <= 0) return;
    const h = window.devicePixelRatio || 1;
    m.width = e * h, m.height = u * h, m.style.width = `${e}px`, m.style.height = `${u}px`;
    const w = m.getContext("2d");
    if (!w) return;
    w.scale(h, h), w.clearRect(0, 0, e, u);
    const I = s, x = s + e / o, b = 60 / o, N = [0.1, 0.25, 0.5, 1, 2, 5, 10, 15, 30, 60];
    let k = N[0];
    for (const j of N)
      if (j >= b) {
        k = j;
        break;
      }
    const A = getComputedStyle(m), S = A.getPropertyValue("--color-text-muted").trim() || "#666", P = A.getPropertyValue("--color-border").trim() || "#e5e5e5";
    w.textAlign = "left", w.textBaseline = "bottom", w.font = "10px Inter, sans-serif";
    const F = Math.ceil(I / k) * k;
    for (let j = F; j <= x; j += k) {
      const W = (j - s) * o;
      w.strokeStyle = P, w.lineWidth = 1, w.beginPath(), w.moveTo(Math.round(W) + 0.5, u), w.lineTo(Math.round(W) + 0.5, u - 8), w.stroke(), w.fillStyle = S;
      const D = R2(j);
      w.fillText(D, Math.round(W) + 3, u - 2);
    }
    if (p !== null) {
      const j = Sh(I, x, p);
      w.strokeStyle = P, w.lineWidth = 0.5;
      for (const W of j) {
        const D = (W - s) * o;
        w.beginPath(), w.moveTo(Math.round(D) + 0.5, u), w.lineTo(Math.round(D) + 0.5, u - 4), w.stroke();
      }
    }
  }, [e, o, s, p, l]);
  const g = R.useCallback((m) => {
    var x;
    const h = (x = r.current) == null ? void 0 : x.getBoundingClientRect();
    if (!h) return;
    const w = m.clientX - h.left, I = s + w / o;
    c(Math.max(0, I));
  }, [s, o, c]);
  return /* @__PURE__ */ f.jsx(
    "canvas",
    {
      ref: r,
      className: "daw-editor__ruler",
      onClick: g,
      style: { cursor: "pointer" }
    }
  );
}
function R2(e) {
  if (e < 60)
    return `${e.toFixed(e % 1 === 0 ? 0 : 1)}s`;
  const r = Math.floor(e / 60), o = Math.floor(e % 60);
  return `${r}:${o.toString().padStart(2, "0")}`;
}
const _g = /* @__PURE__ */ new Map(), Ag = /* @__PURE__ */ new Map();
function B2(e, r, o, s) {
  const i = Math.ceil(s * r), l = Math.max(100, Math.min(i, o.length));
  let c = _g.get(e);
  c || (c = [], _g.set(e, c));
  let u = null, p = 1 / 0;
  for (const m of c) {
    const h = Math.abs(m.numBins - l);
    h < p && (p = h, u = m);
  }
  if (u && p / l < 0.5)
    return u.peaks;
  const g = vh(o, l);
  return c.push({ numBins: l, peaks: g }), c.length > 5 && c.shift(), g;
}
function E2(e, r, o, s) {
  const i = Math.ceil(s * r), l = Math.max(100, Math.min(i, o.length));
  let c = Ag.get(e);
  c || (c = [], Ag.set(e, c));
  let u = null, p = 1 / 0;
  for (const m of c) {
    const h = Math.abs(m.numBins - l);
    h < p && (p = h, u = m);
  }
  if (u && p / l < 0.5)
    return u.peaks;
  const g = c2(o, l);
  return c.push({ numBins: l, peaks: g }), c.length > 5 && c.shift(), g;
}
function D2({ width: e, height: r, trackId: o }) {
  const s = R.useRef(null), i = ve((j) => j.zoom), l = ve((j) => j.scrollX), c = ve((j) => j.setScrollX), u = ve((j) => j.setZoom), p = ve((j) => j.regions[o] ?? []), g = ve((j) => j.selectedRegionIds), m = ve((j) => j.activeTool), h = ve((j) => j.snapEnabled), w = ve((j) => j.gridResolution), I = nt((j) => j.bpm), x = nt((j) => j.seek), C = Nh(w, I), b = R.useRef(null);
  R.useEffect(() => {
    const j = s.current;
    if (!j || e <= 0 || r <= 0) return;
    const W = window.devicePixelRatio || 1;
    j.width = e * W, j.height = r * W, j.style.width = `${e}px`, j.style.height = `${r}px`;
    const D = j.getContext("2d");
    if (!D) return;
    D.scale(W, W), D.clearRect(0, 0, e, r);
    const Z = getComputedStyle(j), H = Z.getPropertyValue("--color-bg").trim() || "#f8f9fa", L = Z.getPropertyValue("--color-border").trim() || "#e5e5e5", ee = Z.getPropertyValue("--color-accent").trim() || "#2563eb";
    D.fillStyle = H, D.fillRect(0, 0, e, r);
    const T = l, Y = l + e / i;
    if (C !== null) {
      const O = Sh(T, Y, C);
      D.strokeStyle = L, D.lineWidth = 0.5, D.setLineDash([2, 4]);
      for (const U of O) {
        const E = (U - l) * i;
        D.beginPath(), D.moveTo(Math.round(E) + 0.5, 0), D.lineTo(Math.round(E) + 0.5, r), D.stroke();
      }
      D.setLineDash([]);
    }
    for (const O of p) {
      if (O.position + O.duration < T || O.position > Y) continue;
      const E = (O.position - l) * i, G = O.duration * i, K = g.includes(O.id);
      D.fillStyle = K ? "rgba(37, 99, 235, 0.15)" : "rgba(37, 99, 235, 0.08)", D.fillRect(E, 4, G, r - 8), D.strokeStyle = K ? ee : L, D.lineWidth = K ? 2 : 1, D.strokeRect(E, 4, G, r - 8);
      const M = Di(O.bufferRef);
      if (M) {
        const V = M.channelCount > 1, te = Math.max(0, E), re = Math.min(e, E + G);
        if (V) {
          const le = E2(
            O.bufferRef,
            i,
            M.buffer,
            M.duration
          ), ue = 4, ne = (r - 8) / 2, fe = ue + ne / 2, be = ue + ne + ne / 2, Ne = (ne - 4) / 2;
          D.strokeStyle = L, D.lineWidth = 0.5, D.beginPath(), D.moveTo(te, ue + ne), D.lineTo(re, ue + ne), D.stroke(), D.fillStyle = K ? ee : "rgba(37, 99, 235, 0.6)";
          for (let Ce = Math.floor(te); Ce < re; Ce++) {
            const xe = l + Ce / i, Te = O.sourceOffset + (xe - O.position), Be = Math.floor(Te / M.duration * le.left.length);
            if (Be < 0 || Be >= le.left.length) continue;
            const je = le.left[Be] * Ne;
            D.fillRect(Ce, fe - je, 1, je * 2);
            const We = le.right[Be] * Ne;
            D.fillRect(Ce, be - We, 1, We * 2);
          }
        } else {
          const le = B2(
            O.bufferRef,
            i,
            M.buffer,
            M.duration
          ), ue = r / 2, de = (r - 16) / 2;
          D.fillStyle = K ? ee : "rgba(37, 99, 235, 0.6)";
          for (let ne = Math.floor(te); ne < re; ne++) {
            const fe = l + ne / i, be = O.sourceOffset + (fe - O.position), Ne = Math.floor(be / M.duration * le.length);
            if (Ne < 0 || Ne >= le.length) continue;
            const xe = le[Ne] * de;
            D.fillRect(ne, ue - xe, 1, xe * 2);
          }
        }
      }
      if (O.fadeIn > 1e-3) {
        const V = O.fadeIn * i, te = D.createLinearGradient(E, 0, E + V, 0);
        te.addColorStop(0, "rgba(0,0,0,0.3)"), te.addColorStop(1, "rgba(0,0,0,0)"), D.fillStyle = te, D.fillRect(E, 4, V, r - 8);
      }
      if (O.fadeOut > 1e-3) {
        const V = O.fadeOut * i, te = E + G - V, re = D.createLinearGradient(te, 0, te + V, 0);
        re.addColorStop(0, "rgba(0,0,0,0)"), re.addColorStop(1, "rgba(0,0,0,0.3)"), D.fillStyle = re, D.fillRect(te, 4, V, r - 8);
      }
    }
  }, [e, r, i, l, p, g, C, I]);
  const N = R.useCallback((j) => {
    var W;
    if (j.preventDefault(), j.ctrlKey || j.metaKey) {
      const D = (W = s.current) == null ? void 0 : W.getBoundingClientRect();
      if (!D) return;
      const Z = j.clientX - D.left, H = l + Z / i, L = j.deltaY < 0 ? 1.2 : 1 / 1.2, ee = Math.max(10, Math.min(1e3, i * L)), T = H - Z / ee;
      u(ee), c(Math.max(0, T));
    } else {
      const D = j.deltaX !== 0 ? j.deltaX : j.deltaY;
      c(Math.max(0, l + D / i));
    }
  }, [i, l, u, c]), k = R.useCallback((j) => {
    const W = l + j / i;
    for (let D = p.length - 1; D >= 0; D--) {
      const Z = p[D];
      if (W >= Z.position && W <= Z.position + Z.duration)
        return Z;
    }
    return null;
  }, [l, i, p]), A = R.useCallback((j, W) => {
    const Z = (W.position - l) * i, H = (W.position + W.duration - l) * i;
    return Math.abs(j - Z) < 6 ? "left" : Math.abs(j - H) < 6 ? "right" : null;
  }, [l, i]), S = R.useCallback((j) => {
    var Z;
    const W = (Z = s.current) == null ? void 0 : Z.getBoundingClientRect();
    if (!W) return;
    const D = j.clientX - W.left;
    if (m === "pointer") {
      const H = k(D);
      if (H)
        A(D, H) === null && (ve.getState().selectRegions(
          j.shiftKey ? [...g, H.id] : [H.id]
        ), b.current = {
          type: "move",
          regionId: H.id,
          startX: D,
          startTime: H.position,
          originalRegion: { ...H }
        });
      else {
        ve.getState().selectRegions([]);
        const L = l + D / i;
        x(Math.max(0, L));
      }
    } else if (m === "trim") {
      const H = k(D);
      if (H) {
        const L = A(D, H);
        L && (ve.getState().selectRegions([H.id]), b.current = {
          type: L === "left" ? "trim-left" : "trim-right",
          regionId: H.id,
          startX: D,
          startTime: L === "left" ? H.position : H.position + H.duration,
          originalRegion: { ...H }
        });
      }
    } else if (m === "slice") {
      const H = k(D);
      if (H) {
        let L = l + D / i;
        h && C !== null && (L = ii(L, C)), ve.getState().splitRegion(H.id, L);
      }
    }
  }, [m, k, A, g, l, i, x, h, C]), P = R.useCallback((j) => {
    var ee;
    const W = (ee = s.current) == null ? void 0 : ee.getBoundingClientRect();
    if (!W) return;
    const D = j.clientX - W.left, Z = b.current;
    if (!Z) {
      if (m === "trim") {
        const T = k(D);
        T && A(D, T) ? s.current.style.cursor = "col-resize" : s.current.style.cursor = "default";
      }
      return;
    }
    const L = (D - Z.startX) / i;
    if (Z.type === "move") {
      let T = Z.originalRegion.position + L;
      h && C !== null && (T = ii(T, C)), T = Math.max(0, T), ve.getState().updateRegion(Z.regionId, { position: T });
    } else if (Z.type === "trim-left") {
      let T = Z.originalRegion.position + L;
      h && C !== null && (T = ii(T, C));
      const Y = Z.originalRegion.position + Z.originalRegion.duration - 0.01;
      T = Math.max(0, Math.min(T, Y));
      const O = T - Z.originalRegion.position;
      ve.getState().updateRegion(Z.regionId, {
        position: T,
        sourceOffset: Z.originalRegion.sourceOffset + O,
        duration: Z.originalRegion.duration - O
      });
    } else if (Z.type === "trim-right") {
      let T = Z.originalRegion.position + Z.originalRegion.duration + L;
      h && C !== null && (T = ii(T, C));
      const Y = Z.originalRegion.position + 0.01;
      T = Math.max(Y, T), ve.getState().updateRegion(Z.regionId, {
        duration: T - Z.originalRegion.position
      });
    }
  }, [i, m, k, A, h, C]), F = R.useCallback(() => {
    b.current = null;
  }, []);
  return /* @__PURE__ */ f.jsx(
    "canvas",
    {
      ref: s,
      className: "daw-editor__canvas",
      onWheel: N,
      onMouseDown: S,
      onMouseMove: P,
      onMouseUp: F,
      onMouseLeave: F,
      style: { cursor: m === "slice" ? "crosshair" : void 0 }
    }
  );
}
function G2({ width: e, height: r }) {
  const o = R.useRef(null), s = R.useRef(0), i = ve((c) => c.zoom), l = ve((c) => c.scrollX);
  return R.useEffect(() => {
    const c = o.current;
    if (!c || e <= 0 || r <= 0) return;
    const u = window.devicePixelRatio || 1;
    c.width = e * u, c.height = r * u, c.style.width = `${e}px`, c.style.height = `${r}px`;
    const p = c.getContext("2d");
    if (!p) return;
    const g = () => {
      p.setTransform(u, 0, 0, u, 0, 0), p.clearRect(0, 0, e, r);
      const m = nt.getState().position, h = ve.getState().zoom, w = ve.getState().scrollX, I = (m - w) * h;
      I >= -1 && I <= e + 1 && (p.strokeStyle = "#ef4444", p.lineWidth = 1.5, p.beginPath(), p.moveTo(Math.round(I) + 0.5, 0), p.lineTo(Math.round(I) + 0.5, r), p.stroke(), p.fillStyle = "#ef4444", p.beginPath(), p.moveTo(I - 5, 0), p.lineTo(I + 5, 0), p.lineTo(I, 6), p.closePath(), p.fill()), s.current = requestAnimationFrame(g);
    };
    return s.current = requestAnimationFrame(g), () => {
      cancelAnimationFrame(s.current);
    };
  }, [e, r, i, l]), /* @__PURE__ */ f.jsx(
    "canvas",
    {
      ref: o,
      className: "daw-editor__overlay"
    }
  );
}
const F2 = 120, P2 = 250, z2 = 600, V2 = 60;
function O2() {
  const e = ve((b) => b.isOpen), r = ve((b) => b.selectedTrackIds), o = pe((b) => b.nodes), s = R.useRef(null), [i, l] = R.useState(P2), [c, u] = R.useState(0), p = R.useRef(!1), g = R.useRef(0), m = R.useRef(0);
  R.useEffect(() => {
    if (!e || !s.current) return;
    const b = new ResizeObserver((N) => {
      for (const k of N)
        u(k.contentRect.width);
    });
    return b.observe(s.current), () => b.disconnect();
  }, [e]);
  const h = R.useCallback((b) => {
    b.preventDefault(), p.current = !0, g.current = b.clientY, m.current = i;
    const N = (A) => {
      if (!p.current) return;
      const S = g.current - A.clientY, P = Math.max(F2, Math.min(z2, m.current + S));
      l(P);
    }, k = () => {
      p.current = !1, document.removeEventListener("mousemove", N), document.removeEventListener("mouseup", k);
    };
    document.addEventListener("mousemove", N), document.addEventListener("mouseup", k);
  }, [i]);
  if (!e || r.length === 0) return null;
  const x = i - 32 - 24, C = Math.max(V2, Math.floor(x / r.length));
  return /* @__PURE__ */ f.jsxs(
    "div",
    {
      className: "daw-editor",
      style: { height: i },
      ref: s,
      children: [
        /* @__PURE__ */ f.jsx(
          "div",
          {
            className: "daw-editor__resize-handle",
            onMouseDown: h
          }
        ),
        /* @__PURE__ */ f.jsx(M2, {}),
        /* @__PURE__ */ f.jsx(T2, { width: c }),
        /* @__PURE__ */ f.jsx("div", { className: "daw-editor__track-lanes", children: r.map((b) => {
          const N = o.find((A) => A.id === b), k = (N == null ? void 0 : N.data.fileName) ?? (N == null ? void 0 : N.data.label) ?? "Track";
          return /* @__PURE__ */ f.jsxs("div", { className: "daw-editor__track-lane", style: { height: C }, children: [
            /* @__PURE__ */ f.jsx("div", { className: "daw-editor__track-label", title: k, children: k }),
            /* @__PURE__ */ f.jsxs("div", { className: "daw-editor__timeline", style: { height: C }, children: [
              /* @__PURE__ */ f.jsx(
                D2,
                {
                  width: c,
                  height: C,
                  trackId: b
                }
              ),
              /* @__PURE__ */ f.jsx(
                G2,
                {
                  width: c,
                  height: C
                }
              )
            ] })
          ] }, b);
        }) })
      ]
    }
  );
}
const H2 = navigator.platform.toUpperCase().indexOf("MAC") >= 0, Uc = H2 ? "⌘" : "Ctrl", W2 = [
  {
    title: "Transport",
    shortcuts: [
      { action: "Play / Pause", keys: [["Space"]] },
      { action: "Return to start", keys: [["Enter"]] }
    ]
  },
  {
    title: "Editor Tools",
    shortcuts: [
      { action: "Pointer", keys: [["V"]] },
      { action: "Trim", keys: [["T"]] },
      { action: "Slice", keys: [["S"]] },
      { action: "Fade", keys: [["F"]] },
      { action: "Zoom", keys: [["Z"]] },
      { action: "Draw", keys: [["D"]] },
      { action: "Toggle snap", keys: [["G"]] },
      { action: "Delete region", keys: [["Del"]] }
    ]
  },
  {
    title: "General",
    shortcuts: [
      { action: "Undo", keys: [[Uc, "Z"]] },
      { action: "Redo", keys: [[Uc, "Shift", "Z"]] },
      { action: "Exit scope / Close editor", keys: [["Esc"]] },
      { action: "Show shortcuts", keys: [["?"]] }
    ]
  },
  {
    title: "Timeline",
    shortcuts: [
      { action: "Zoom in / out", keys: [[Uc, "Scroll"]] },
      { action: "Scroll timeline", keys: [["Scroll"]] }
    ]
  }
];
function X2({ onClose: e }) {
  const r = R.useCallback((o) => {
    o.target === o.currentTarget && e();
  }, [e]);
  return R.useEffect(() => {
    const o = (s) => {
      (s.key === "Escape" || s.key === "?") && (s.preventDefault(), e());
    };
    return window.addEventListener("keydown", o), () => window.removeEventListener("keydown", o);
  }, [e]), /* @__PURE__ */ f.jsx("div", { className: "daw-shortcuts-backdrop", onClick: r, children: /* @__PURE__ */ f.jsxs("div", { className: "daw-shortcuts", children: [
    /* @__PURE__ */ f.jsxs("div", { className: "daw-shortcuts__header", children: [
      /* @__PURE__ */ f.jsx("span", { className: "daw-shortcuts__title", children: "Keyboard Shortcuts" }),
      /* @__PURE__ */ f.jsx("button", { className: "daw-shortcuts__close", onClick: e, title: "Close", children: "×" })
    ] }),
    /* @__PURE__ */ f.jsx("div", { className: "daw-shortcuts__body", children: W2.map((o) => /* @__PURE__ */ f.jsxs("div", { className: "daw-shortcuts__group", children: [
      /* @__PURE__ */ f.jsx("div", { className: "daw-shortcuts__group-title", children: o.title }),
      o.shortcuts.map((s) => /* @__PURE__ */ f.jsxs("div", { className: "daw-shortcuts__row", children: [
        /* @__PURE__ */ f.jsx("span", { className: "daw-shortcuts__action", children: s.action }),
        /* @__PURE__ */ f.jsx("span", { className: "daw-shortcuts__keys", children: s.keys[0].map((i, l) => /* @__PURE__ */ f.jsxs("span", { children: [
          l > 0 && /* @__PURE__ */ f.jsx("span", { className: "daw-shortcuts__plus", children: "+" }),
          /* @__PURE__ */ f.jsx("kbd", { className: "daw-shortcuts__key", children: i })
        ] }, l)) })
      ] }, s.action))
    ] }, o.title)) }),
    /* @__PURE__ */ f.jsx("div", { className: "daw-shortcuts__footer", children: /* @__PURE__ */ f.jsx("span", { className: "daw-shortcuts__hint", children: "Press ? or Esc to close" }) })
  ] }) });
}
function L2({ message: e, variant: r = "default", onDismiss: o, duration: s = 2500 }) {
  return R.useEffect(() => {
    const i = setTimeout(o, s);
    return () => clearTimeout(i);
  }, [o, s]), /* @__PURE__ */ f.jsx("div", { className: `daw-toast ${r === "error" ? "daw-toast--error" : ""}`, children: e });
}
function kh({ allowedModules: e }) {
  const { nodes: r, edges: o, onNodesChange: s, onEdgesChange: i, onConnect: l, isSession: c } = C2(), u = !c, p = on((D) => D.scopeStack), { initialize: g } = w2(), [m, h] = R.useState(!1), w = R.useMemo(() => o2(), []), I = R.useRef(null), x = R.useRef(null), [C, b] = R.useState(!1), N = pe((D) => D.lastConnectionError), k = pe((D) => D.clearConnectionError), A = R.useCallback(async () => {
    await g(), h(!0);
  }, [g]), S = R.useCallback(() => {
    var D;
    document.fullscreenElement ? document.exitFullscreen() : (D = I.current) == null || D.requestFullscreen();
  }, []), P = R.useCallback((D, Z) => {
    if (!Z.nodeId || !Z.handleId || !x.current) return;
    const H = pe.getState().nodes.find((L) => L.id === Z.nodeId);
    if (H)
      try {
        const ee = ct(H.type).ports.find((T) => T.id === Z.handleId);
        ee && x.current.setAttribute("data-drag-signal", ee.signalType);
      } catch {
      }
  }, []), F = R.useCallback(() => {
    var D;
    (D = x.current) == null || D.removeAttribute("data-drag-signal");
  }, []), j = R.useCallback((D) => {
    const { nodes: Z, edges: H } = pe.getState();
    return bh(D, Z, H).valid;
  }, []);
  R.useEffect(() => {
    if (!m) return;
    const D = (Z) => {
      if (!(Z.target instanceof HTMLInputElement || Z.target instanceof HTMLTextAreaElement))
        if (Z.code === "Space") {
          Z.preventDefault();
          const { isPlaying: H, play: L, pause: ee } = nt.getState();
          H ? ee() : L();
        } else if (Z.code === "Enter")
          Z.preventDefault(), nt.getState().seek(0);
        else if (Z.code === "Escape") {
          const H = on.getState();
          if (!H.isSessionScope()) {
            H.popToDepth(H.currentDepth() - 1);
            return;
          }
          const L = ve.getState();
          L.selectedRegionIds.length > 0 ? L.selectRegions([]) : L.isOpen && L.closeEditor();
        } else if (Z.key === "v" || Z.key === "V")
          ve.getState().isOpen && ve.getState().setTool("pointer");
        else if (Z.key === "t")
          ve.getState().isOpen && ve.getState().setTool("trim");
        else if (Z.key === "s" && !Z.ctrlKey && !Z.metaKey)
          ve.getState().isOpen && ve.getState().setTool("slice");
        else if (Z.key === "f" && !Z.ctrlKey && !Z.metaKey)
          ve.getState().isOpen && ve.getState().setTool("fade");
        else if (Z.key === "z" && !Z.ctrlKey && !Z.metaKey)
          ve.getState().isOpen && ve.getState().setTool("zoom");
        else if (Z.key === "d" && !Z.ctrlKey && !Z.metaKey)
          ve.getState().isOpen && ve.getState().setTool("draw");
        else if (Z.key === "g")
          ve.getState().isOpen && ve.getState().toggleSnap();
        else if ((Z.key === "Delete" || Z.key === "Backspace") && ve.getState().isOpen) {
          const { selectedRegionIds: H, removeRegion: L } = ve.getState();
          for (const ee of H)
            L(ee);
        } else Z.key === "?" && (Z.preventDefault(), b((H) => !H));
    };
    return window.addEventListener("keydown", D), () => window.removeEventListener("keydown", D);
  }, [m]);
  const W = ve((D) => D.isOpen);
  return /* @__PURE__ */ f.jsxs("div", { ref: I, className: `daw-canvas-wrapper ${W ? "daw-canvas-wrapper--editor-open" : ""}`, children: [
    /* @__PURE__ */ f.jsxs("div", { ref: x, className: `daw-canvas-container ${u ? "daw-canvas-container--scope" : ""}`, children: [
      /* @__PURE__ */ f.jsxs(
        S_,
        {
          nodes: r,
          edges: o,
          onNodesChange: s,
          onEdgesChange: i,
          onConnect: l,
          onConnectStart: P,
          onConnectEnd: F,
          isValidConnection: j,
          nodeTypes: w,
          edgeTypes: I2,
          fitView: !0,
          proOptions: { hideAttribution: !0 },
          children: [
            /* @__PURE__ */ f.jsx(E_, { variant: _n.Dots, gap: 20, size: 1 }),
            /* @__PURE__ */ f.jsx(e2, { pannable: !0, zoomable: !0, nodeStrokeWidth: 3 }),
            /* @__PURE__ */ f.jsx(O_, {}),
            m && c && /* @__PURE__ */ f.jsx(Cn, { position: "top-left", children: /* @__PURE__ */ f.jsx(N2, { allowedModules: e }) }),
            m && /* @__PURE__ */ f.jsx(Cn, { position: "top-right", children: /* @__PURE__ */ f.jsx(S2, { onToggleFullscreen: S }) }),
            m && /* @__PURE__ */ f.jsx(Cn, { position: "bottom-center", children: /* @__PURE__ */ f.jsx(k2, {}) }),
            m && u && /* @__PURE__ */ f.jsx(Cn, { position: "top-center", children: /* @__PURE__ */ f.jsx(j2, {}) }),
            !m && /* @__PURE__ */ f.jsx(Cn, { position: "top-center", children: /* @__PURE__ */ f.jsx("button", { className: "daw-start-audio", onClick: A, children: "Start Audio Engine" }) })
          ]
        },
        p.length
      ),
      N && /* @__PURE__ */ f.jsx(
        L2,
        {
          message: N,
          variant: "error",
          onDismiss: k
        }
      )
    ] }),
    /* @__PURE__ */ f.jsx(O2, {}),
    C && /* @__PURE__ */ f.jsx(X2, { onClose: () => b(!1) })
  ] });
}
function K2() {
  return R.useEffect(() => {
    const { nodes: e, addModule: r } = pe.getState();
    e.some((o) => o.type === "master-output") || r("master-output", { x: 600, y: 200 });
  }, []), /* @__PURE__ */ f.jsx(Gu, { children: /* @__PURE__ */ f.jsxs("div", { className: "daw-app", children: [
    /* @__PURE__ */ f.jsxs("div", { className: "daw-header", children: [
      /* @__PURE__ */ f.jsx("h1", { className: "daw-title", children: "Modular DAW" }),
      /* @__PURE__ */ f.jsx("p", { className: "daw-subtitle", children: "Build audio signal chains by connecting modules with virtual patch cables." })
    ] }),
    /* @__PURE__ */ f.jsx(kh, {})
  ] }) });
}
const jh = {
  type: "master-output",
  label: "Master Output",
  category: "io",
  singleton: !1,
  soloSafe: !0,
  ports: [
    {
      id: "in",
      label: "Input",
      direction: "input",
      signalType: "audio",
      channelFormat: "stereo"
    }
  ],
  parameters: [
    {
      id: "volume",
      label: "Volume",
      min: -70,
      max: 6,
      defaultValue: 0,
      step: 0.1,
      unit: "dB",
      mapping: "linear"
    }
  ]
}, Mh = {
  create(e, r) {
    const o = e.createGain();
    return o.gain.value = Kt(r.volume ?? 0), o.connect(e.destination), {
      inputs: { in: o },
      outputs: {},
      setParameter(s, i, l) {
        s === "volume" && o.gain.setTargetAtTime(Kt(i), l, 0.02);
      },
      dispose() {
        o.disconnect();
      }
    };
  }
};
function ye({
  min: e,
  max: r,
  step: o,
  value: s,
  onChange: i,
  className: l = ""
}) {
  const c = R.useRef(null);
  R.useEffect(() => {
    const p = c.current;
    if (!p) return;
    const g = pe.temporal, m = (w) => {
      w.stopPropagation(), g.getState().pause();
    }, h = () => {
      g.getState().resume();
    };
    return p.addEventListener("mousedown", m, !0), p.addEventListener("touchstart", m, !0), p.addEventListener("pointerdown", m, !0), window.addEventListener("mouseup", h), window.addEventListener("touchend", h), window.addEventListener("pointerup", h), () => {
      p.removeEventListener("mousedown", m, !0), p.removeEventListener("touchstart", m, !0), p.removeEventListener("pointerdown", m, !0), window.removeEventListener("mouseup", h), window.removeEventListener("touchend", h), window.removeEventListener("pointerup", h);
    };
  }, []);
  const u = R.useCallback(
    (p) => {
      i(parseFloat(p.target.value));
    },
    [i]
  );
  return /* @__PURE__ */ f.jsx(
    "input",
    {
      ref: c,
      type: "range",
      min: e,
      max: r,
      step: o,
      value: s,
      onChange: u,
      className: `daw-node__slider nodrag ${l}`
    }
  );
}
function Th({ id: e, data: r }) {
  const o = pe((i) => i.updateParameter), s = r.parameters.volume ?? 0;
  return /* @__PURE__ */ f.jsxs("div", { className: "daw-node daw-node--io", children: [
    /* @__PURE__ */ f.jsx(oe, { type: "target", position: Q.Left, id: "in", className: "daw-handle daw-handle--audio daw-handle--stereo" }),
    /* @__PURE__ */ f.jsx("div", { className: "daw-node__header", children: "Master Output" }),
    /* @__PURE__ */ f.jsx("div", { className: "daw-node__body nodrag nowheel", children: /* @__PURE__ */ f.jsxs("label", { className: "daw-node__param", children: [
      /* @__PURE__ */ f.jsx("span", { className: "daw-node__param-label", children: "Vol" }),
      /* @__PURE__ */ f.jsx(
        ye,
        {
          min: -70,
          max: 6,
          step: 0.1,
          value: s,
          onChange: (i) => o(e, "volume", i)
        }
      ),
      /* @__PURE__ */ f.jsxs("span", { className: "daw-node__param-value", children: [
        s.toFixed(1),
        " dB"
      ] })
    ] }) })
  ] });
}
const Rh = {
  type: "test-tone",
  label: "Test Tone",
  category: "generator",
  ports: [
    {
      id: "out",
      label: "Output",
      direction: "output",
      signalType: "audio",
      channelFormat: "mono"
    }
  ],
  parameters: [
    {
      id: "frequency",
      label: "Frequency",
      min: 20,
      max: 2e3,
      defaultValue: 440,
      unit: "Hz",
      mapping: "log"
    },
    {
      id: "waveform",
      label: "Waveform",
      min: 0,
      max: 3,
      defaultValue: 0,
      step: 1,
      mapping: "linear"
    }
  ]
}, gu = ["sine", "square", "sawtooth", "triangle"], Bh = {
  create(e, r) {
    const o = e.createOscillator(), s = e.createGain();
    return s.gain.value = 1, o.frequency.value = r.frequency ?? 440, o.type = gu[r.waveform ?? 0] ?? "sine", o.connect(s), o.start(), {
      inputs: {},
      outputs: { out: s },
      setParameter(i, l, c) {
        i === "frequency" ? o.frequency.setTargetAtTime(l, c, 0.02) : i === "waveform" && (o.type = gu[Math.round(l)] ?? "sine");
      },
      dispose() {
        o.stop(), o.disconnect(), s.disconnect();
      }
    };
  }
};
function qn() {
  const e = pe((o) => o.nodes), r = pe((o) => o.edges);
  return R.useMemo(
    () => _h(e, r, ct),
    [e, r]
  );
}
function Eh({ id: e, data: r }) {
  const o = pe((m) => m.updateParameter), s = pe((m) => m.toggleMute), i = pe((m) => m.toggleSolo), c = qn().get(e) ?? !1, u = r.parameters.frequency ?? 440, p = r.parameters.waveform ?? 0, g = [
    "daw-node daw-node--generator",
    c ? "daw-node--dimmed" : "",
    r.soloed ? "daw-node--soloed" : ""
  ].join(" ");
  return /* @__PURE__ */ f.jsxs("div", { className: g, children: [
    /* @__PURE__ */ f.jsxs("div", { className: "daw-node__header", children: [
      /* @__PURE__ */ f.jsx("span", { children: "Test Tone" }),
      /* @__PURE__ */ f.jsxs("div", { className: "daw-node__sm-buttons", children: [
        /* @__PURE__ */ f.jsx(
          "button",
          {
            className: `daw-node__sm-btn daw-node__sm-btn--solo ${r.soloed ? "active" : ""}`,
            onClick: (m) => {
              m.stopPropagation(), i(e, !m.shiftKey);
            },
            title: "Solo (Shift+click for additive)",
            children: "S"
          }
        ),
        /* @__PURE__ */ f.jsx(
          "button",
          {
            className: `daw-node__sm-btn daw-node__sm-btn--mute ${r.muted ? "active" : ""}`,
            onClick: (m) => {
              m.stopPropagation(), s(e);
            },
            title: "Mute",
            children: "M"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ f.jsxs("div", { className: "daw-node__body nodrag nowheel", children: [
      /* @__PURE__ */ f.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ f.jsx("span", { className: "daw-node__param-label", children: "Freq" }),
        /* @__PURE__ */ f.jsx(
          ye,
          {
            min: 20,
            max: 2e3,
            step: 1,
            value: u,
            onChange: (m) => o(e, "frequency", m)
          }
        ),
        /* @__PURE__ */ f.jsxs("span", { className: "daw-node__param-value", children: [
          Math.round(u),
          " Hz"
        ] })
      ] }),
      /* @__PURE__ */ f.jsxs("div", { className: "daw-node__param", children: [
        /* @__PURE__ */ f.jsx("span", { className: "daw-node__param-label", children: "Wave" }),
        /* @__PURE__ */ f.jsx("div", { className: "daw-node__waveform-btns", children: gu.map((m, h) => /* @__PURE__ */ f.jsx(
          "button",
          {
            className: `daw-node__waveform-btn ${h === Math.round(p) ? "active" : ""}`,
            onClick: () => o(e, "waveform", h),
            children: m.slice(0, 3)
          },
          m
        )) })
      ] })
    ] }),
    /* @__PURE__ */ f.jsx(oe, { type: "source", position: Q.Right, id: "out", className: "daw-handle daw-handle--audio" })
  ] });
}
const Dh = {
  type: "gain",
  label: "Gain",
  category: "utility",
  ports: [
    {
      id: "in",
      label: "Input",
      direction: "input",
      signalType: "audio",
      channelFormat: "stereo"
    },
    {
      id: "out",
      label: "Output",
      direction: "output",
      signalType: "audio",
      channelFormat: "stereo"
    },
    {
      id: "gain-cv",
      label: "Gain CV",
      direction: "input",
      signalType: "parameter",
      channelFormat: "mono"
    }
  ],
  parameters: [
    {
      id: "gain",
      label: "Gain",
      min: -70,
      max: 12,
      defaultValue: 0,
      step: 0.1,
      unit: "dB",
      mapping: "linear"
    }
  ]
}, Gh = {
  create(e, r) {
    const o = e.createGain();
    return o.gain.value = Kt(r.gain ?? 0), {
      inputs: {
        in: o,
        "gain-cv": o.gain
      },
      outputs: { out: o },
      setParameter(s, i, l) {
        s === "gain" && o.gain.setTargetAtTime(Kt(i), l, 0.02);
      },
      dispose() {
        o.disconnect();
      }
    };
  }
};
function Fh({ id: e, data: r }) {
  const o = pe((p) => p.updateParameter), s = pe((p) => p.toggleMute), l = qn().get(e) ?? !1, c = r.parameters.gain ?? 0, u = [
    "daw-node daw-node--utility",
    l ? "daw-node--dimmed" : ""
  ].join(" ");
  return /* @__PURE__ */ f.jsxs("div", { className: u, children: [
    /* @__PURE__ */ f.jsx(oe, { type: "target", position: Q.Left, id: "in", className: "daw-handle daw-handle--audio daw-handle--stereo" }),
    /* @__PURE__ */ f.jsx(
      oe,
      {
        type: "target",
        position: Q.Bottom,
        id: "gain-cv",
        className: "daw-handle daw-handle--parameter"
      }
    ),
    /* @__PURE__ */ f.jsxs("div", { className: "daw-node__header", children: [
      /* @__PURE__ */ f.jsx("span", { children: "Gain" }),
      /* @__PURE__ */ f.jsx("div", { className: "daw-node__sm-buttons", children: /* @__PURE__ */ f.jsx(
        "button",
        {
          className: `daw-node__sm-btn daw-node__sm-btn--mute ${r.muted ? "active" : ""}`,
          onClick: (p) => {
            p.stopPropagation(), s(e);
          },
          title: "Mute",
          children: "M"
        }
      ) })
    ] }),
    /* @__PURE__ */ f.jsx("div", { className: "daw-node__body nodrag nowheel", children: /* @__PURE__ */ f.jsxs("label", { className: "daw-node__param", children: [
      /* @__PURE__ */ f.jsx("span", { className: "daw-node__param-label", children: "Gain" }),
      /* @__PURE__ */ f.jsx(
        ye,
        {
          min: -70,
          max: 12,
          step: 0.1,
          value: c,
          onChange: (p) => o(e, "gain", p)
        }
      ),
      /* @__PURE__ */ f.jsxs("span", { className: "daw-node__param-value", children: [
        c.toFixed(1),
        " dB"
      ] })
    ] }) }),
    /* @__PURE__ */ f.jsx(oe, { type: "source", position: Q.Right, id: "out", className: "daw-handle daw-handle--audio daw-handle--stereo" })
  ] });
}
const Ph = {
  type: "track",
  label: "Track",
  category: "io",
  ports: [
    {
      id: "out",
      label: "Output",
      direction: "output",
      signalType: "audio",
      channelFormat: "stereo"
    }
  ],
  parameters: [
    {
      id: "volume",
      label: "Volume",
      min: -70,
      max: 6,
      defaultValue: 0,
      step: 0.1,
      unit: "dB",
      mapping: "linear"
    }
  ]
}, zh = {
  create(e, r) {
    const o = e.createGain();
    o.gain.value = Kt(r.volume ?? 0), o.channelCount = 2, o.channelCountMode = "explicit";
    let s = [], i = [];
    function l() {
      for (const { source: u, fadeGain: p } of i) {
        try {
          u.stop();
        } catch {
        }
        u.disconnect(), p.disconnect();
      }
      i = [];
    }
    function c(u, p) {
      l();
      for (const g of s) {
        if (g.position + g.duration <= p) continue;
        const h = Di(g.bufferRef);
        if (!h) continue;
        const w = e.createBufferSource();
        w.buffer = h.buffer;
        const I = e.createGain();
        w.connect(I), I.connect(o);
        let x, C, b;
        if (p >= g.position) {
          x = u;
          const k = p - g.position;
          C = g.sourceOffset + k, b = g.duration - k;
        } else
          x = u + (g.position - p), C = g.sourceOffset, b = g.duration;
        const N = h.buffer.duration - C;
        b = Math.min(b, N), !(b <= 0) && (Z2(e, I, x, b, g.fadeIn, g.fadeOut), w.start(x, C, b), i.push({ source: w, fadeGain: I }));
      }
    }
    return {
      inputs: {},
      outputs: { out: o },
      setParameter(u, p, g) {
        u === "volume" && o.gain.setTargetAtTime(Kt(p), g, 0.02);
      },
      setBuffer(u) {
      },
      setRegions(u) {
        s = u;
      },
      schedulePlayback: c,
      stopPlayback: l,
      dispose() {
        l(), o.disconnect();
      }
    };
  }
};
function Z2(e, r, o, s, i, l) {
  if (i > 1e-3 ? (r.gain.setValueAtTime(0, o), r.gain.linearRampToValueAtTime(1, o + i)) : r.gain.setValueAtTime(1, o), l > 1e-3) {
    const c = o + s - l;
    c > o + i && (r.gain.setValueAtTime(1, c), r.gain.linearRampToValueAtTime(0, o + s));
  }
}
function Y2(e, r, o) {
  const s = e.getContext("2d");
  if (!s) return;
  const { width: i, height: l } = e, c = window.devicePixelRatio || 1;
  e.width = i * c, e.height = l * c, s.scale(c, c), s.clearRect(0, 0, i, l);
  const u = l / 2, p = i / r.length;
  s.fillStyle = o;
  for (let g = 0; g < r.length; g++) {
    const m = r[g] * u, h = g * p;
    s.fillRect(h, u - m, Math.max(p - 0.5, 0.5), m * 2 || 1);
  }
}
function Vh({ id: e, data: r }) {
  const o = pe((j) => j.updateParameter), s = pe((j) => j.setNodeData), i = pe((j) => j.toggleMute), l = pe((j) => j.toggleSolo), u = qn().get(e) ?? !1, p = r.parameters.volume ?? 0, g = R.useRef(null), m = R.useRef(null), [h, w] = R.useState(!1), [I, x] = R.useState(null), C = R.useRef(!0);
  R.useEffect(() => (C.current = !0, () => {
    C.current = !1;
  }), []), R.useEffect(() => {
    if (!r.bufferRef || !g.current) return;
    const j = Di(r.bufferRef);
    if (!j) return;
    const W = getComputedStyle(g.current).getPropertyValue("--daw-accent").trim() || "#3b82f6";
    Y2(g.current, j.peaks, W);
  }, [r.bufferRef]);
  const b = R.useCallback(async (j) => {
    w(!0), x(null);
    try {
      const W = d2();
      if (!W) throw new Error("Audio engine not ready");
      const D = await j.arrayBuffer(), Z = await W.decodeAudioData(D);
      if (!C.current) return;
      const H = At(), L = vh(Z, 200);
      l2(H, {
        buffer: Z,
        peaks: L,
        fileName: j.name,
        duration: Z.duration,
        channelCount: Z.numberOfChannels,
        sampleRate: Z.sampleRate
      }), s(e, {
        bufferRef: H,
        fileName: j.name,
        duration: Z.duration
      }), ve.getState().removeRegionsForTrack(e), ve.getState().addRegion({
        trackId: e,
        bufferRef: H,
        position: 0,
        sourceOffset: 0,
        duration: Z.duration,
        fadeIn: 5e-3,
        fadeOut: 5e-3
      });
    } catch (W) {
      if (!C.current) return;
      const D = W instanceof Error ? W.message : "Unknown error";
      x(`Could not decode file: ${D}`);
    } finally {
      C.current && w(!1);
    }
  }, [e, s]), N = R.useCallback((j) => {
    j.preventDefault(), j.stopPropagation();
    const W = j.dataTransfer.files[0];
    W && W.type.startsWith("audio/") && b(W);
  }, [b]), k = R.useCallback((j) => {
    j.preventDefault(), j.stopPropagation();
  }, []), A = R.useCallback(() => {
    var j;
    (j = m.current) == null || j.click();
  }, []), S = R.useCallback((j) => {
    var D;
    const W = (D = j.target.files) == null ? void 0 : D[0];
    W && b(W);
  }, [b]), P = R.useCallback((j) => {
    r.bufferRef && (j.shiftKey ? ve.getState().toggleTrackInEditor(e) : ve.getState().openEditor(e));
  }, [e, r.bufferRef]), F = [
    "daw-node daw-node--io daw-node--track",
    u ? "daw-node--dimmed" : "",
    r.soloed ? "daw-node--soloed" : ""
  ].join(" ");
  return /* @__PURE__ */ f.jsxs("div", { className: F, children: [
    /* @__PURE__ */ f.jsxs("div", { className: "daw-node__header", children: [
      /* @__PURE__ */ f.jsx("span", { children: "Track" }),
      /* @__PURE__ */ f.jsxs("div", { className: "daw-node__sm-buttons", children: [
        /* @__PURE__ */ f.jsx(
          "button",
          {
            className: `daw-node__sm-btn daw-node__sm-btn--solo ${r.soloed ? "active" : ""}`,
            onClick: (j) => {
              j.stopPropagation(), l(e, !j.shiftKey);
            },
            title: "Solo (Shift+click for additive)",
            children: "S"
          }
        ),
        /* @__PURE__ */ f.jsx(
          "button",
          {
            className: `daw-node__sm-btn daw-node__sm-btn--mute ${r.muted ? "active" : ""}`,
            onClick: (j) => {
              j.stopPropagation(), i(e);
            },
            title: "Mute",
            children: "M"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ f.jsxs("div", { className: "daw-node__body nodrag nowheel", children: [
      r.bufferRef ? /* @__PURE__ */ f.jsxs("div", { className: "daw-track__waveform-area", onDoubleClick: P, title: "Double-click to open editor", children: [
        /* @__PURE__ */ f.jsx(
          "canvas",
          {
            ref: g,
            className: "daw-track__canvas",
            width: 180,
            height: 48
          }
        ),
        /* @__PURE__ */ f.jsxs("div", { className: "daw-track__file-info", children: [
          /* @__PURE__ */ f.jsx("span", { className: "daw-track__filename", title: r.fileName, children: r.fileName }),
          /* @__PURE__ */ f.jsx("span", { className: "daw-track__duration", children: r.duration ? Ah(r.duration) : "" })
        ] })
      ] }) : /* @__PURE__ */ f.jsx(
        "div",
        {
          className: "daw-track__dropzone",
          onDrop: N,
          onDragOver: k,
          onClick: A,
          children: h ? /* @__PURE__ */ f.jsx("span", { className: "daw-track__loading", children: "Loading..." }) : I ? /* @__PURE__ */ f.jsx("span", { className: "daw-track__error", children: I }) : /* @__PURE__ */ f.jsxs("span", { className: "daw-track__placeholder", children: [
            "Drop audio file",
            /* @__PURE__ */ f.jsx("br", {}),
            "or click to upload"
          ] })
        }
      ),
      /* @__PURE__ */ f.jsx(
        "input",
        {
          ref: m,
          type: "file",
          accept: "audio/*",
          className: "daw-track__file-input",
          onChange: S
        }
      ),
      /* @__PURE__ */ f.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ f.jsx("span", { className: "daw-node__param-label", children: "Vol" }),
        /* @__PURE__ */ f.jsx(
          ye,
          {
            min: -70,
            max: 6,
            step: 0.1,
            value: p,
            onChange: (j) => o(e, "volume", j)
          }
        ),
        /* @__PURE__ */ f.jsxs("span", { className: "daw-node__param-value", children: [
          p.toFixed(1),
          " dB"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ f.jsx(oe, { type: "source", position: Q.Right, id: "out", className: "daw-handle daw-handle--audio daw-handle--stereo" })
  ] });
}
const Oh = {
  type: "delay",
  label: "Delay",
  category: "effect",
  soloSafe: !0,
  ports: [
    {
      id: "in",
      label: "Input",
      direction: "input",
      signalType: "audio",
      channelFormat: "stereo"
    },
    {
      id: "out",
      label: "Output",
      direction: "output",
      signalType: "audio",
      channelFormat: "stereo"
    },
    {
      id: "time-cv",
      label: "Time CV",
      direction: "input",
      signalType: "parameter",
      channelFormat: "mono"
    }
  ],
  parameters: [
    {
      id: "time",
      label: "Time",
      min: 0.01,
      max: 2,
      defaultValue: 0.3,
      step: 0.01,
      unit: "s",
      mapping: "linear"
    },
    {
      id: "feedback",
      label: "Feedback",
      min: 0,
      max: 0.95,
      defaultValue: 0.3,
      step: 0.01,
      unit: "",
      mapping: "linear"
    },
    {
      id: "mix",
      label: "Mix",
      min: 0,
      max: 1,
      defaultValue: 0.5,
      step: 0.01,
      unit: "",
      mapping: "linear"
    }
  ]
}, Hh = {
  create(e, r) {
    const o = r.time ?? 0.3, s = r.feedback ?? 0.3, i = r.mix ?? 0.5, l = e.createGain();
    l.gain.value = 1;
    const c = e.createGain();
    c.gain.value = 1 - i;
    const u = e.createDelay(5);
    u.delayTime.value = o;
    const p = e.createGain();
    p.gain.value = s;
    const g = e.createGain();
    g.gain.value = i;
    const m = e.createGain();
    m.gain.value = 1, l.connect(c), c.connect(m), l.connect(u), u.connect(g), g.connect(m), u.connect(p), p.connect(u);
    let h = i, w = !1;
    return {
      inputs: {
        in: l,
        "time-cv": u.delayTime
      },
      outputs: { out: m },
      setParameter(I, x, C) {
        switch (I) {
          case "time":
            u.delayTime.setTargetAtTime(x, C, 0.02);
            break;
          case "feedback":
            p.gain.setTargetAtTime(x, C, 0.02);
            break;
          case "mix":
            h = x, w || (c.gain.setTargetAtTime(1 - x, C, 0.02), g.gain.setTargetAtTime(x, C, 0.02));
            break;
        }
      },
      setBypass(I, x) {
        w = I, I ? (c.gain.setTargetAtTime(1, x, 0.02), g.gain.setTargetAtTime(0, x, 0.02)) : (c.gain.setTargetAtTime(1 - h, x, 0.02), g.gain.setTargetAtTime(h, x, 0.02));
      },
      dispose() {
        l.disconnect(), c.disconnect(), u.disconnect(), p.disconnect(), g.disconnect(), m.disconnect();
      }
    };
  }
};
function Wh({ id: e, data: r }) {
  const o = pe((p) => p.updateParameter), s = pe((p) => p.toggleBypass), i = r.parameters.time ?? 0.3, l = r.parameters.feedback ?? 0.3, c = r.parameters.mix ?? 0.5, u = [
    "daw-node daw-node--effect",
    r.bypassed ? "daw-node--bypassed" : ""
  ].join(" ");
  return /* @__PURE__ */ f.jsxs("div", { className: u, children: [
    /* @__PURE__ */ f.jsx(oe, { type: "target", position: Q.Left, id: "in", className: "daw-handle daw-handle--audio daw-handle--stereo" }),
    /* @__PURE__ */ f.jsx(
      oe,
      {
        type: "target",
        position: Q.Bottom,
        id: "time-cv",
        className: "daw-handle daw-handle--parameter"
      }
    ),
    /* @__PURE__ */ f.jsxs("div", { className: "daw-node__header", children: [
      /* @__PURE__ */ f.jsx("span", { children: "Delay" }),
      /* @__PURE__ */ f.jsx("div", { className: "daw-node__sm-buttons", children: /* @__PURE__ */ f.jsx(
        "button",
        {
          className: `daw-node__sm-btn daw-node__sm-btn--bypass ${r.bypassed ? "active" : ""}`,
          onClick: (p) => {
            p.stopPropagation(), s(e);
          },
          title: "Bypass",
          children: "B"
        }
      ) })
    ] }),
    /* @__PURE__ */ f.jsxs("div", { className: "daw-node__body nodrag nowheel", children: [
      /* @__PURE__ */ f.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ f.jsx("span", { className: "daw-node__param-label", children: "Time" }),
        /* @__PURE__ */ f.jsx(
          ye,
          {
            min: 0.01,
            max: 2,
            step: 0.01,
            value: i,
            onChange: (p) => o(e, "time", p)
          }
        ),
        /* @__PURE__ */ f.jsxs("span", { className: "daw-node__param-value", children: [
          i.toFixed(2),
          " s"
        ] })
      ] }),
      /* @__PURE__ */ f.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ f.jsx("span", { className: "daw-node__param-label", children: "Feedback" }),
        /* @__PURE__ */ f.jsx(
          ye,
          {
            min: 0,
            max: 0.95,
            step: 0.01,
            value: l,
            onChange: (p) => o(e, "feedback", p)
          }
        ),
        /* @__PURE__ */ f.jsxs("span", { className: "daw-node__param-value", children: [
          (l * 100).toFixed(0),
          "%"
        ] })
      ] }),
      /* @__PURE__ */ f.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ f.jsx("span", { className: "daw-node__param-label", children: "Mix" }),
        /* @__PURE__ */ f.jsx(
          ye,
          {
            min: 0,
            max: 1,
            step: 0.01,
            value: c,
            onChange: (p) => o(e, "mix", p)
          }
        ),
        /* @__PURE__ */ f.jsxs("span", { className: "daw-node__param-value", children: [
          (c * 100).toFixed(0),
          "%"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ f.jsx(oe, { type: "source", position: Q.Right, id: "out", className: "daw-handle daw-handle--audio daw-handle--stereo" })
  ] });
}
const Xh = {
  type: "reverb",
  label: "Reverb",
  category: "effect",
  soloSafe: !0,
  ports: [
    {
      id: "in",
      label: "Input",
      direction: "input",
      signalType: "audio",
      channelFormat: "stereo"
    },
    {
      id: "out",
      label: "Output",
      direction: "output",
      signalType: "audio",
      channelFormat: "stereo"
    }
  ],
  parameters: [
    {
      id: "decay",
      label: "Decay",
      min: 0.1,
      max: 10,
      defaultValue: 2,
      step: 0.1,
      unit: "s",
      mapping: "linear"
    },
    {
      id: "mix",
      label: "Mix",
      min: 0,
      max: 1,
      defaultValue: 0.3,
      step: 0.01,
      unit: "",
      mapping: "linear"
    }
  ]
};
function Sg(e, r) {
  const o = e.sampleRate, s = Math.ceil(o * r), i = e.createBuffer(2, s, o);
  for (let l = 0; l < 2; l++) {
    const c = i.getChannelData(l);
    for (let u = 0; u < s; u++)
      c[u] = (Math.random() * 2 - 1) * Math.exp(-3 * u / s);
  }
  return i;
}
const Lh = {
  create(e, r) {
    const o = r.decay ?? 2, s = r.mix ?? 0.3, i = e.createGain();
    i.gain.value = 1;
    const l = e.createGain();
    l.gain.value = 1 - s;
    const c = e.createConvolver();
    c.buffer = Sg(e, o);
    const u = e.createGain();
    u.gain.value = s;
    const p = e.createGain();
    p.gain.value = 1, i.connect(l), l.connect(p), i.connect(c), c.connect(u), u.connect(p);
    let g = o, m = s, h = !1;
    return {
      inputs: { in: i },
      outputs: { out: p },
      setParameter(w, I, x) {
        switch (w) {
          case "decay":
            g = I, c.buffer = Sg(e, g);
            break;
          case "mix":
            m = I, h || (l.gain.setTargetAtTime(1 - I, x, 0.02), u.gain.setTargetAtTime(I, x, 0.02));
            break;
        }
      },
      setBypass(w, I) {
        h = w, w ? (l.gain.setTargetAtTime(1, I, 0.02), u.gain.setTargetAtTime(0, I, 0.02)) : (l.gain.setTargetAtTime(1 - m, I, 0.02), u.gain.setTargetAtTime(m, I, 0.02));
      },
      dispose() {
        i.disconnect(), l.disconnect(), c.disconnect(), u.disconnect(), p.disconnect();
      }
    };
  }
};
function Kh({ id: e, data: r }) {
  const o = pe((u) => u.updateParameter), s = pe((u) => u.toggleBypass), i = r.parameters.decay ?? 2, l = r.parameters.mix ?? 0.3, c = [
    "daw-node daw-node--effect",
    r.bypassed ? "daw-node--bypassed" : ""
  ].join(" ");
  return /* @__PURE__ */ f.jsxs("div", { className: c, children: [
    /* @__PURE__ */ f.jsx(oe, { type: "target", position: Q.Left, id: "in", className: "daw-handle daw-handle--audio daw-handle--stereo" }),
    /* @__PURE__ */ f.jsxs("div", { className: "daw-node__header", children: [
      /* @__PURE__ */ f.jsx("span", { children: "Reverb" }),
      /* @__PURE__ */ f.jsx("div", { className: "daw-node__sm-buttons", children: /* @__PURE__ */ f.jsx(
        "button",
        {
          className: `daw-node__sm-btn daw-node__sm-btn--bypass ${r.bypassed ? "active" : ""}`,
          onClick: (u) => {
            u.stopPropagation(), s(e);
          },
          title: "Bypass",
          children: "B"
        }
      ) })
    ] }),
    /* @__PURE__ */ f.jsxs("div", { className: "daw-node__body nodrag nowheel", children: [
      /* @__PURE__ */ f.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ f.jsx("span", { className: "daw-node__param-label", children: "Decay" }),
        /* @__PURE__ */ f.jsx(
          ye,
          {
            min: 0.1,
            max: 10,
            step: 0.1,
            value: i,
            onChange: (u) => o(e, "decay", u)
          }
        ),
        /* @__PURE__ */ f.jsxs("span", { className: "daw-node__param-value", children: [
          i.toFixed(1),
          " s"
        ] })
      ] }),
      /* @__PURE__ */ f.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ f.jsx("span", { className: "daw-node__param-label", children: "Mix" }),
        /* @__PURE__ */ f.jsx(
          ye,
          {
            min: 0,
            max: 1,
            step: 0.01,
            value: l,
            onChange: (u) => o(e, "mix", u)
          }
        ),
        /* @__PURE__ */ f.jsxs("span", { className: "daw-node__param-value", children: [
          (l * 100).toFixed(0),
          "%"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ f.jsx(oe, { type: "source", position: Q.Right, id: "out", className: "daw-handle daw-handle--audio daw-handle--stereo" })
  ] });
}
const Zh = {
  type: "eq",
  label: "EQ",
  category: "effect",
  ports: [
    {
      id: "in",
      label: "Input",
      direction: "input",
      signalType: "audio",
      channelFormat: "stereo"
    },
    {
      id: "out",
      label: "Output",
      direction: "output",
      signalType: "audio",
      channelFormat: "stereo"
    }
  ],
  parameters: [
    {
      id: "lowFreq",
      label: "Low Freq",
      min: 20,
      max: 500,
      defaultValue: 80,
      step: 1,
      unit: "Hz",
      mapping: "log"
    },
    {
      id: "lowGain",
      label: "Low Gain",
      min: -24,
      max: 24,
      defaultValue: 0,
      step: 0.5,
      unit: "dB",
      mapping: "linear"
    },
    {
      id: "midFreq",
      label: "Mid Freq",
      min: 200,
      max: 5e3,
      defaultValue: 1e3,
      step: 1,
      unit: "Hz",
      mapping: "log"
    },
    {
      id: "midGain",
      label: "Mid Gain",
      min: -24,
      max: 24,
      defaultValue: 0,
      step: 0.5,
      unit: "dB",
      mapping: "linear"
    },
    {
      id: "midQ",
      label: "Mid Q",
      min: 0.1,
      max: 18,
      defaultValue: 1,
      step: 0.1,
      unit: "",
      mapping: "log"
    },
    {
      id: "highFreq",
      label: "High Freq",
      min: 2e3,
      max: 2e4,
      defaultValue: 8e3,
      step: 1,
      unit: "Hz",
      mapping: "log"
    },
    {
      id: "highGain",
      label: "High Gain",
      min: -24,
      max: 24,
      defaultValue: 0,
      step: 0.5,
      unit: "dB",
      mapping: "linear"
    }
  ]
}, Yh = {
  create(e, r) {
    const o = e.createBiquadFilter();
    o.type = "lowshelf", o.frequency.value = r.lowFreq ?? 80, o.gain.value = r.lowGain ?? 0;
    const s = e.createBiquadFilter();
    s.type = "peaking", s.frequency.value = r.midFreq ?? 1e3, s.gain.value = r.midGain ?? 0, s.Q.value = r.midQ ?? 1;
    const i = e.createBiquadFilter();
    i.type = "highshelf", i.frequency.value = r.highFreq ?? 8e3, i.gain.value = r.highGain ?? 0;
    const l = e.createGain();
    l.gain.value = 1;
    const c = e.createGain();
    c.gain.value = 1;
    const u = e.createGain();
    u.gain.value = 1, l.connect(o), o.connect(s), s.connect(i), i.connect(u), u.connect(c);
    const p = e.createGain();
    return p.gain.value = 0, l.connect(p), p.connect(c), {
      inputs: { in: l },
      outputs: { out: c },
      setParameter(g, m, h) {
        switch (g) {
          case "lowFreq":
            o.frequency.setTargetAtTime(m, h, 0.02);
            break;
          case "lowGain":
            o.gain.setTargetAtTime(m, h, 0.02);
            break;
          case "midFreq":
            s.frequency.setTargetAtTime(m, h, 0.02);
            break;
          case "midGain":
            s.gain.setTargetAtTime(m, h, 0.02);
            break;
          case "midQ":
            s.Q.setTargetAtTime(m, h, 0.02);
            break;
          case "highFreq":
            i.frequency.setTargetAtTime(m, h, 0.02);
            break;
          case "highGain":
            i.gain.setTargetAtTime(m, h, 0.02);
            break;
        }
      },
      setBypass(g, m) {
        g ? (u.gain.setTargetAtTime(0, m, 0.02), p.gain.setTargetAtTime(1, m, 0.02)) : (u.gain.setTargetAtTime(1, m, 0.02), p.gain.setTargetAtTime(0, m, 0.02));
      },
      dispose() {
        l.disconnect(), o.disconnect(), s.disconnect(), i.disconnect(), u.disconnect(), p.disconnect(), c.disconnect();
      }
    };
  }
};
function $c(e) {
  return e >= 1e3 ? `${(e / 1e3).toFixed(1)}k` : `${Math.round(e)}`;
}
function U2(e, r, o) {
  const s = e / r, i = Math.pow(10, o / 40);
  if (s < 0.5) return i;
  if (s > 2) return 1;
  const l = (s - 0.5) / 1.5;
  return i + (1 - i) * l;
}
function $2(e, r, o, s) {
  const i = e / r, l = Math.log2(i), c = 1 / s, u = l / c;
  return 1 + (Math.pow(10, o / 20) - 1) * Math.exp(-u * u * 2);
}
function Q2(e, r, o) {
  const s = e / r, i = Math.pow(10, o / 40);
  if (s > 2) return i;
  if (s < 0.5) return 1;
  const l = (s - 0.5) / 1.5;
  return 1 + (i - 1) * l;
}
function Uh({ id: e, data: r }) {
  const o = pe((x) => x.updateParameter), s = pe((x) => x.toggleBypass), i = r.parameters.lowFreq ?? 80, l = r.parameters.lowGain ?? 0, c = r.parameters.midFreq ?? 1e3, u = r.parameters.midGain ?? 0, p = r.parameters.midQ ?? 1, g = r.parameters.highFreq ?? 8e3, m = r.parameters.highGain ?? 0, h = R.useRef(null), w = R.useCallback(() => {
    const x = h.current;
    if (!x) return;
    const C = x.getContext("2d");
    if (!C) return;
    const b = x.width, N = x.height, k = N / 2;
    C.fillStyle = "#111", C.fillRect(0, 0, b, N), C.strokeStyle = "#333", C.lineWidth = 0.5;
    for (const S of [-12, 0, 12]) {
      const P = k - S / 24 * N;
      C.beginPath(), C.moveTo(0, P), C.lineTo(b, P), C.stroke();
    }
    C.strokeStyle = "#3b82f6", C.lineWidth = 2, C.beginPath();
    for (let S = 0; S < b; S++) {
      const P = 20 * Math.pow(1e3, S / b);
      let F = 1;
      F *= U2(P, i, l), F *= $2(P, c, u, p), F *= Q2(P, g, m);
      const j = 20 * Math.log10(F), W = k - j / 24 * N;
      S === 0 ? C.moveTo(S, W) : C.lineTo(S, W);
    }
    C.stroke();
    const A = [
      { freq: i, gain: l, color: "#f59e0b" },
      { freq: c, gain: u, color: "#22c55e" },
      { freq: g, gain: m, color: "#a855f7" }
    ];
    for (const S of A) {
      const P = Math.log10(S.freq / 20) / Math.log10(1e3) * b, F = k - S.gain / 24 * N;
      C.fillStyle = S.color, C.beginPath(), C.arc(P, F, 3, 0, Math.PI * 2), C.fill();
    }
  }, [i, l, c, u, p, g, m]);
  R.useEffect(() => {
    w();
  }, [w]);
  const I = [
    "daw-node daw-node--effect",
    r.bypassed ? "daw-node--bypassed" : ""
  ].join(" ");
  return /* @__PURE__ */ f.jsxs("div", { className: I, style: { minWidth: 220 }, children: [
    /* @__PURE__ */ f.jsx(oe, { type: "target", position: Q.Left, id: "in", className: "daw-handle daw-handle--audio daw-handle--stereo" }),
    /* @__PURE__ */ f.jsxs("div", { className: "daw-node__header", children: [
      /* @__PURE__ */ f.jsx("span", { children: "EQ" }),
      /* @__PURE__ */ f.jsx("div", { className: "daw-node__sm-buttons", children: /* @__PURE__ */ f.jsx(
        "button",
        {
          className: `daw-node__sm-btn daw-node__sm-btn--bypass ${r.bypassed ? "active" : ""}`,
          onClick: (x) => {
            x.stopPropagation(), s(e);
          },
          title: "Bypass",
          children: "B"
        }
      ) })
    ] }),
    /* @__PURE__ */ f.jsxs("div", { className: "daw-node__body nodrag nowheel", children: [
      /* @__PURE__ */ f.jsx(
        "canvas",
        {
          ref: h,
          width: 200,
          height: 60,
          style: { display: "block", borderRadius: 3, marginBottom: 6, width: "100%", height: 60 }
        }
      ),
      /* @__PURE__ */ f.jsxs("div", { className: "daw-node__param-group", children: [
        /* @__PURE__ */ f.jsx("span", { className: "daw-node__param-label", children: "Low" }),
        /* @__PURE__ */ f.jsxs("label", { className: "daw-node__param", children: [
          /* @__PURE__ */ f.jsx(
            ye,
            {
              min: 20,
              max: 500,
              step: 1,
              value: i,
              onChange: (x) => o(e, "lowFreq", x)
            }
          ),
          /* @__PURE__ */ f.jsxs("span", { className: "daw-node__param-value", children: [
            $c(i),
            " Hz"
          ] })
        ] }),
        /* @__PURE__ */ f.jsxs("label", { className: "daw-node__param", children: [
          /* @__PURE__ */ f.jsx(
            ye,
            {
              min: -24,
              max: 24,
              step: 0.5,
              value: l,
              onChange: (x) => o(e, "lowGain", x)
            }
          ),
          /* @__PURE__ */ f.jsxs("span", { className: "daw-node__param-value", children: [
            l > 0 ? "+" : "",
            l.toFixed(1),
            " dB"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ f.jsxs("div", { className: "daw-node__param-group", children: [
        /* @__PURE__ */ f.jsx("span", { className: "daw-node__param-label", children: "Mid" }),
        /* @__PURE__ */ f.jsxs("label", { className: "daw-node__param", children: [
          /* @__PURE__ */ f.jsx(
            ye,
            {
              min: 200,
              max: 5e3,
              step: 1,
              value: c,
              onChange: (x) => o(e, "midFreq", x)
            }
          ),
          /* @__PURE__ */ f.jsxs("span", { className: "daw-node__param-value", children: [
            $c(c),
            " Hz"
          ] })
        ] }),
        /* @__PURE__ */ f.jsxs("label", { className: "daw-node__param", children: [
          /* @__PURE__ */ f.jsx(
            ye,
            {
              min: -24,
              max: 24,
              step: 0.5,
              value: u,
              onChange: (x) => o(e, "midGain", x)
            }
          ),
          /* @__PURE__ */ f.jsxs("span", { className: "daw-node__param-value", children: [
            u > 0 ? "+" : "",
            u.toFixed(1),
            " dB"
          ] })
        ] }),
        /* @__PURE__ */ f.jsxs("label", { className: "daw-node__param", children: [
          /* @__PURE__ */ f.jsx(
            ye,
            {
              min: 0.1,
              max: 18,
              step: 0.1,
              value: p,
              onChange: (x) => o(e, "midQ", x)
            }
          ),
          /* @__PURE__ */ f.jsxs("span", { className: "daw-node__param-value", children: [
            "Q ",
            p.toFixed(1)
          ] })
        ] })
      ] }),
      /* @__PURE__ */ f.jsxs("div", { className: "daw-node__param-group", children: [
        /* @__PURE__ */ f.jsx("span", { className: "daw-node__param-label", children: "High" }),
        /* @__PURE__ */ f.jsxs("label", { className: "daw-node__param", children: [
          /* @__PURE__ */ f.jsx(
            ye,
            {
              min: 2e3,
              max: 2e4,
              step: 1,
              value: g,
              onChange: (x) => o(e, "highFreq", x)
            }
          ),
          /* @__PURE__ */ f.jsxs("span", { className: "daw-node__param-value", children: [
            $c(g),
            " Hz"
          ] })
        ] }),
        /* @__PURE__ */ f.jsxs("label", { className: "daw-node__param", children: [
          /* @__PURE__ */ f.jsx(
            ye,
            {
              min: -24,
              max: 24,
              step: 0.5,
              value: m,
              onChange: (x) => o(e, "highGain", x)
            }
          ),
          /* @__PURE__ */ f.jsxs("span", { className: "daw-node__param-value", children: [
            m > 0 ? "+" : "",
            m.toFixed(1),
            " dB"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ f.jsx(oe, { type: "source", position: Q.Right, id: "out", className: "daw-handle daw-handle--audio daw-handle--stereo" })
  ] });
}
const $h = {
  type: "splitter",
  label: "Splitter",
  category: "routing",
  ports: [
    {
      id: "in",
      label: "Input",
      direction: "input",
      signalType: "audio",
      channelFormat: "stereo"
    },
    {
      id: "left",
      label: "Left",
      direction: "output",
      signalType: "audio",
      channelFormat: "mono"
    },
    {
      id: "right",
      label: "Right",
      direction: "output",
      signalType: "audio",
      channelFormat: "mono"
    }
  ],
  parameters: []
}, Qh = {
  create(e) {
    const r = e.createChannelSplitter(2), o = e.createGain();
    o.gain.value = 1;
    const s = e.createGain();
    return s.gain.value = 1, r.connect(o, 0), r.connect(s, 1), {
      inputs: { in: r },
      outputs: { left: o, right: s },
      setParameter() {
      },
      dispose() {
        r.disconnect(), o.disconnect(), s.disconnect();
      }
    };
  }
};
function Jh({ id: e, data: r }) {
  const o = pe((c) => c.toggleMute), l = [
    "daw-node daw-node--routing",
    qn().get(e) ?? !1 ? "daw-node--dimmed" : ""
  ].join(" ");
  return /* @__PURE__ */ f.jsxs("div", { className: l, children: [
    /* @__PURE__ */ f.jsx(oe, { type: "target", position: Q.Left, id: "in", className: "daw-handle daw-handle--audio daw-handle--stereo" }),
    /* @__PURE__ */ f.jsxs("div", { className: "daw-node__header", children: [
      /* @__PURE__ */ f.jsx("span", { children: "Splitter" }),
      /* @__PURE__ */ f.jsx("div", { className: "daw-node__sm-buttons", children: /* @__PURE__ */ f.jsx(
        "button",
        {
          className: `daw-node__sm-btn daw-node__sm-btn--mute ${r.muted ? "active" : ""}`,
          onClick: (c) => {
            c.stopPropagation(), o(e);
          },
          title: "Mute",
          children: "M"
        }
      ) })
    ] }),
    /* @__PURE__ */ f.jsx("div", { className: "daw-node__body", children: /* @__PURE__ */ f.jsxs("div", { className: "daw-node__port-labels", children: [
      /* @__PURE__ */ f.jsx("span", { className: "daw-node__port-label daw-node__port-label--right", children: "L" }),
      /* @__PURE__ */ f.jsx("span", { className: "daw-node__port-label daw-node__port-label--right", children: "R" })
    ] }) }),
    /* @__PURE__ */ f.jsx(
      oe,
      {
        type: "source",
        position: Q.Right,
        id: "left",
        className: "daw-handle daw-handle--audio daw-handle--pos-1of2"
      }
    ),
    /* @__PURE__ */ f.jsx(
      oe,
      {
        type: "source",
        position: Q.Right,
        id: "right",
        className: "daw-handle daw-handle--audio daw-handle--pos-2of2"
      }
    )
  ] });
}
const qh = {
  type: "merger",
  label: "Merger",
  category: "routing",
  ports: [
    {
      id: "left",
      label: "Left",
      direction: "input",
      signalType: "audio",
      channelFormat: "mono"
    },
    {
      id: "right",
      label: "Right",
      direction: "input",
      signalType: "audio",
      channelFormat: "mono"
    },
    {
      id: "out",
      label: "Output",
      direction: "output",
      signalType: "audio",
      channelFormat: "stereo"
    }
  ],
  parameters: []
}, e0 = {
  create(e) {
    const r = e.createChannelMerger(2), o = e.createGain();
    o.gain.value = 1;
    const s = e.createGain();
    return s.gain.value = 1, o.connect(r, 0, 0), s.connect(r, 0, 1), {
      inputs: { left: o, right: s },
      outputs: { out: r },
      setParameter() {
      },
      dispose() {
        o.disconnect(), s.disconnect(), r.disconnect();
      }
    };
  }
};
function t0({ id: e, data: r }) {
  const o = pe((c) => c.toggleMute), l = [
    "daw-node daw-node--routing",
    qn().get(e) ?? !1 ? "daw-node--dimmed" : ""
  ].join(" ");
  return /* @__PURE__ */ f.jsxs("div", { className: l, children: [
    /* @__PURE__ */ f.jsx(
      oe,
      {
        type: "target",
        position: Q.Left,
        id: "left",
        className: "daw-handle daw-handle--audio daw-handle--pos-1of2"
      }
    ),
    /* @__PURE__ */ f.jsx(
      oe,
      {
        type: "target",
        position: Q.Left,
        id: "right",
        className: "daw-handle daw-handle--audio daw-handle--pos-2of2"
      }
    ),
    /* @__PURE__ */ f.jsxs("div", { className: "daw-node__header", children: [
      /* @__PURE__ */ f.jsx("span", { children: "Merger" }),
      /* @__PURE__ */ f.jsx("div", { className: "daw-node__sm-buttons", children: /* @__PURE__ */ f.jsx(
        "button",
        {
          className: `daw-node__sm-btn daw-node__sm-btn--mute ${r.muted ? "active" : ""}`,
          onClick: (c) => {
            c.stopPropagation(), o(e);
          },
          title: "Mute",
          children: "M"
        }
      ) })
    ] }),
    /* @__PURE__ */ f.jsx("div", { className: "daw-node__body", children: /* @__PURE__ */ f.jsxs("div", { className: "daw-node__port-labels", children: [
      /* @__PURE__ */ f.jsx("span", { className: "daw-node__port-label", children: "L" }),
      /* @__PURE__ */ f.jsx("span", { className: "daw-node__port-label", children: "R" })
    ] }) }),
    /* @__PURE__ */ f.jsx(oe, { type: "source", position: Q.Right, id: "out", className: "daw-handle daw-handle--audio daw-handle--stereo" })
  ] });
}
const n0 = {
  type: "mixer",
  label: "Mixer",
  category: "routing",
  soloSafe: !0,
  ports: [
    {
      id: "in1",
      label: "In 1",
      direction: "input",
      signalType: "audio",
      channelFormat: "stereo"
    },
    {
      id: "in2",
      label: "In 2",
      direction: "input",
      signalType: "audio",
      channelFormat: "stereo"
    },
    {
      id: "in3",
      label: "In 3",
      direction: "input",
      signalType: "audio",
      channelFormat: "stereo"
    },
    {
      id: "in4",
      label: "In 4",
      direction: "input",
      signalType: "audio",
      channelFormat: "stereo"
    },
    {
      id: "out",
      label: "Output",
      direction: "output",
      signalType: "audio",
      channelFormat: "stereo"
    }
  ],
  parameters: [
    {
      id: "gain1",
      label: "In 1",
      min: -70,
      max: 12,
      defaultValue: 0,
      step: 0.1,
      unit: "dB",
      mapping: "linear"
    },
    {
      id: "gain2",
      label: "In 2",
      min: -70,
      max: 12,
      defaultValue: 0,
      step: 0.1,
      unit: "dB",
      mapping: "linear"
    },
    {
      id: "gain3",
      label: "In 3",
      min: -70,
      max: 12,
      defaultValue: 0,
      step: 0.1,
      unit: "dB",
      mapping: "linear"
    },
    {
      id: "gain4",
      label: "In 4",
      min: -70,
      max: 12,
      defaultValue: 0,
      step: 0.1,
      unit: "dB",
      mapping: "linear"
    }
  ]
}, r0 = {
  create(e, r) {
    const o = e.createGain();
    o.gain.value = Kt(r.gain1 ?? 0);
    const s = e.createGain();
    s.gain.value = Kt(r.gain2 ?? 0);
    const i = e.createGain();
    i.gain.value = Kt(r.gain3 ?? 0);
    const l = e.createGain();
    l.gain.value = Kt(r.gain4 ?? 0);
    const c = e.createGain();
    c.gain.value = 1, o.connect(c), s.connect(c), i.connect(c), l.connect(c);
    const u = {
      gain1: o,
      gain2: s,
      gain3: i,
      gain4: l
    };
    return {
      inputs: { in1: o, in2: s, in3: i, in4: l },
      outputs: { out: c },
      setParameter(p, g, m) {
        const h = u[p];
        h && h.gain.setTargetAtTime(Kt(g), m, 0.02);
      },
      dispose() {
        o.disconnect(), s.disconnect(), i.disconnect(), l.disconnect(), c.disconnect();
      }
    };
  }
}, kg = [
  { portId: "in1", paramId: "gain1", label: "In 1" },
  { portId: "in2", paramId: "gain2", label: "In 2" },
  { portId: "in3", paramId: "gain3", label: "In 3" },
  { portId: "in4", paramId: "gain4", label: "In 4" }
];
function o0({ id: e, data: r }) {
  const o = pe((u) => u.updateParameter), s = pe((u) => u.toggleMute), c = [
    "daw-node daw-node--routing",
    qn().get(e) ?? !1 ? "daw-node--dimmed" : ""
  ].join(" ");
  return /* @__PURE__ */ f.jsxs("div", { className: c, style: { minWidth: 200 }, children: [
    kg.map((u, p) => /* @__PURE__ */ f.jsx(
      oe,
      {
        type: "target",
        position: Q.Left,
        id: u.portId,
        className: `daw-handle daw-handle--audio daw-handle--stereo daw-handle--pos-${p + 1}of4`
      },
      u.portId
    )),
    /* @__PURE__ */ f.jsxs("div", { className: "daw-node__header", children: [
      /* @__PURE__ */ f.jsx("span", { children: "Mixer" }),
      /* @__PURE__ */ f.jsx("div", { className: "daw-node__sm-buttons", children: /* @__PURE__ */ f.jsx(
        "button",
        {
          className: `daw-node__sm-btn daw-node__sm-btn--mute ${r.muted ? "active" : ""}`,
          onClick: (u) => {
            u.stopPropagation(), s(e);
          },
          title: "Mute",
          children: "M"
        }
      ) })
    ] }),
    /* @__PURE__ */ f.jsx("div", { className: "daw-node__body nodrag nowheel", children: kg.map((u) => {
      const p = r.parameters[u.paramId] ?? 0;
      return /* @__PURE__ */ f.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ f.jsx("span", { className: "daw-node__param-label", children: u.label }),
        /* @__PURE__ */ f.jsx(
          ye,
          {
            min: -70,
            max: 12,
            step: 0.1,
            value: p,
            onChange: (g) => o(e, u.paramId, g)
          }
        ),
        /* @__PURE__ */ f.jsxs("span", { className: "daw-node__param-value", children: [
          p.toFixed(1),
          " dB"
        ] })
      ] }, u.paramId);
    }) }),
    /* @__PURE__ */ f.jsx(oe, { type: "source", position: Q.Right, id: "out", className: "daw-handle daw-handle--audio daw-handle--stereo" })
  ] });
}
const a0 = {
  type: "level-meter",
  label: "Level Meter",
  category: "utility",
  ports: [
    {
      id: "in",
      label: "Input",
      direction: "input",
      signalType: "audio",
      channelFormat: "stereo"
    },
    {
      id: "out",
      label: "Output",
      direction: "output",
      signalType: "audio",
      channelFormat: "stereo"
    }
  ],
  parameters: []
}, s0 = {
  create(e) {
    const r = e.createGain();
    r.gain.value = 1;
    const o = e.createAnalyser();
    return o.fftSize = 256, o.smoothingTimeConstant = 0.8, r.connect(o), {
      inputs: { in: r },
      outputs: { out: r },
      setParameter() {
      },
      dispose() {
        r.disconnect(), o.disconnect();
      },
      getAnalyserNode() {
        return o;
      }
    };
  }
};
function i0({ id: e, data: r }) {
  const o = pe((h) => h.toggleMute), i = qn().get(e) ?? !1, l = R.useRef(null), c = R.useRef(0), u = R.useRef(0), p = 0.97, g = R.useCallback(() => {
    var ee;
    const h = l.current;
    if (!h) return;
    const w = $t(), I = w == null ? void 0 : w.getProcessor(e), x = (ee = I == null ? void 0 : I.getAnalyserNode) == null ? void 0 : ee.call(I), C = h.getContext("2d");
    if (!C) return;
    const b = h.width, N = h.height;
    if (C.clearRect(0, 0, b, N), !x) {
      c.current = requestAnimationFrame(g);
      return;
    }
    const k = x.fftSize, A = new Float32Array(k);
    x.getFloatTimeDomainData(A);
    let S = 0;
    for (let T = 0; T < k; T++) {
      const Y = Math.abs(A[T]);
      Y > S && (S = Y);
    }
    const P = S > 0 ? 20 * Math.log10(S) : -70;
    S > u.current ? u.current = S : u.current *= p;
    const F = u.current > 0 ? 20 * Math.log10(u.current) : -70, j = (T) => Math.max(0, (T + 70) / 70 * N), W = j(P), D = N - j(F), H = getComputedStyle(h).getPropertyValue("--daw-surface-inset").trim() || "#0a0a0a";
    C.fillStyle = H, C.fillRect(0, 0, b, N);
    const L = N - W;
    if (W > 0) {
      const T = C.createLinearGradient(0, N, 0, 0);
      T.addColorStop(0, "#22c55e"), T.addColorStop(0.7, "#f59e0b"), T.addColorStop(1, "#ef4444"), C.fillStyle = T, C.fillRect(2, L, b - 4, W);
    }
    F > -70 && (C.strokeStyle = "#ef4444", C.lineWidth = 1, C.beginPath(), C.moveTo(2, D), C.lineTo(b - 2, D), C.stroke()), c.current = requestAnimationFrame(g);
  }, [e]);
  R.useEffect(() => (c.current = requestAnimationFrame(g), () => cancelAnimationFrame(c.current)), [g]);
  const m = [
    "daw-node daw-node--utility",
    i ? "daw-node--dimmed" : ""
  ].join(" ");
  return /* @__PURE__ */ f.jsxs("div", { className: m, children: [
    /* @__PURE__ */ f.jsx(oe, { type: "target", position: Q.Left, id: "in", className: "daw-handle daw-handle--audio daw-handle--stereo" }),
    /* @__PURE__ */ f.jsxs("div", { className: "daw-node__header", children: [
      /* @__PURE__ */ f.jsx("span", { children: "Level Meter" }),
      /* @__PURE__ */ f.jsx("div", { className: "daw-node__sm-buttons", children: /* @__PURE__ */ f.jsx(
        "button",
        {
          className: `daw-node__sm-btn daw-node__sm-btn--mute ${r.muted ? "active" : ""}`,
          onClick: (h) => {
            h.stopPropagation(), o(e);
          },
          title: "Mute",
          children: "M"
        }
      ) })
    ] }),
    /* @__PURE__ */ f.jsx("div", { className: "daw-node__body", children: /* @__PURE__ */ f.jsx(
      "canvas",
      {
        ref: l,
        width: 40,
        height: 80,
        style: { width: 40, height: 80, borderRadius: 4, background: "var(--daw-surface-inset)" }
      }
    ) }),
    /* @__PURE__ */ f.jsx(oe, { type: "source", position: Q.Right, id: "out", className: "daw-handle daw-handle--audio daw-handle--stereo" })
  ] });
}
const l0 = {
  type: "spectrum-analyzer",
  label: "Analyzer",
  category: "utility",
  ports: [
    {
      id: "in",
      label: "Input",
      direction: "input",
      signalType: "audio",
      channelFormat: "stereo"
    },
    {
      id: "out",
      label: "Output",
      direction: "output",
      signalType: "audio",
      channelFormat: "stereo"
    }
  ],
  parameters: []
}, c0 = {
  create(e) {
    const r = e.createGain();
    r.gain.value = 1;
    const o = e.createAnalyser();
    return o.fftSize = 2048, o.smoothingTimeConstant = 0.8, r.connect(o), {
      inputs: { in: r },
      outputs: { out: r },
      setParameter() {
      },
      dispose() {
        r.disconnect(), o.disconnect();
      },
      getAnalyserNode() {
        return o;
      }
    };
  }
};
function u0({ id: e, data: r }) {
  const o = pe((g) => g.toggleMute), i = qn().get(e) ?? !1, l = R.useRef(null), c = R.useRef(0), u = R.useCallback(() => {
    var L;
    const g = l.current;
    if (!g) return;
    const m = $t(), h = m == null ? void 0 : m.getProcessor(e), w = (L = h == null ? void 0 : h.getAnalyserNode) == null ? void 0 : L.call(h), I = g.getContext("2d");
    if (!I) return;
    const x = g.width, C = g.height;
    I.clearRect(0, 0, x, C);
    const b = getComputedStyle(g), N = b.getPropertyValue("--daw-surface-inset").trim() || "#0a0a0a";
    if (I.fillStyle = N, I.fillRect(0, 0, x, C), !w) {
      c.current = requestAnimationFrame(u);
      return;
    }
    const k = w.frequencyBinCount, A = new Uint8Array(k);
    w.getByteFrequencyData(A);
    const S = w.context.sampleRate, P = b.getPropertyValue("--daw-accent").trim() || "#3b82f6";
    I.fillStyle = P, I.globalAlpha = 0.7;
    const F = 20, j = 2e4, W = Math.log10(F), D = Math.log10(j), Z = 64, H = x / Z;
    for (let ee = 0; ee < Z; ee++) {
      const T = W + ee / Z * (D - W), Y = W + (ee + 1) / Z * (D - W), O = Math.pow(10, T), U = Math.pow(10, Y), E = Math.floor(O / S * k * 2), G = Math.min(Math.ceil(U / S * k * 2), k - 1);
      let K = 0, M = 0;
      for (let re = E; re <= G; re++)
        K += A[re], M++;
      const te = (M > 0 ? K / M : 0) / 255 * C;
      I.fillRect(ee * H, C - te, H - 0.5, te);
    }
    I.globalAlpha = 1, c.current = requestAnimationFrame(u);
  }, [e]);
  R.useEffect(() => (c.current = requestAnimationFrame(u), () => cancelAnimationFrame(c.current)), [u]);
  const p = [
    "daw-node daw-node--utility",
    i ? "daw-node--dimmed" : ""
  ].join(" ");
  return /* @__PURE__ */ f.jsxs("div", { className: p, style: { minWidth: 220 }, children: [
    /* @__PURE__ */ f.jsx(oe, { type: "target", position: Q.Left, id: "in", className: "daw-handle daw-handle--audio daw-handle--stereo" }),
    /* @__PURE__ */ f.jsxs("div", { className: "daw-node__header", children: [
      /* @__PURE__ */ f.jsx("span", { children: "Analyzer" }),
      /* @__PURE__ */ f.jsx("div", { className: "daw-node__sm-buttons", children: /* @__PURE__ */ f.jsx(
        "button",
        {
          className: `daw-node__sm-btn daw-node__sm-btn--mute ${r.muted ? "active" : ""}`,
          onClick: (g) => {
            g.stopPropagation(), o(e);
          },
          title: "Mute",
          children: "M"
        }
      ) })
    ] }),
    /* @__PURE__ */ f.jsx("div", { className: "daw-node__body", children: /* @__PURE__ */ f.jsx(
      "canvas",
      {
        ref: l,
        width: 200,
        height: 80,
        style: { width: 200, height: 80, borderRadius: 4, background: "var(--daw-surface-inset)" }
      }
    ) }),
    /* @__PURE__ */ f.jsx(oe, { type: "source", position: Q.Right, id: "out", className: "daw-handle daw-handle--audio daw-handle--stereo" })
  ] });
}
const Fu = {
  type: "compressor",
  label: "Compressor",
  category: "effect",
  ports: [
    {
      id: "in",
      label: "Audio In",
      direction: "input",
      signalType: "audio",
      channelFormat: "stereo"
    },
    {
      id: "sidechain",
      label: "Sidechain",
      direction: "input",
      signalType: "audio",
      channelFormat: "stereo"
    },
    {
      id: "out",
      label: "Output",
      direction: "output",
      signalType: "audio",
      channelFormat: "stereo"
    }
  ],
  parameters: [
    {
      id: "threshold",
      label: "Threshold",
      min: -60,
      max: 0,
      defaultValue: -18,
      step: 0.5,
      unit: "dB",
      mapping: "linear"
    },
    {
      id: "ratio",
      label: "Ratio",
      min: 1,
      max: 20,
      defaultValue: 4,
      step: 0.5,
      unit: ":1",
      mapping: "linear"
    },
    {
      id: "attack",
      label: "Attack",
      min: 1e-3,
      max: 0.1,
      defaultValue: 3e-3,
      step: 1e-3,
      unit: "s",
      mapping: "log"
    },
    {
      id: "release",
      label: "Release",
      min: 0.01,
      max: 1,
      defaultValue: 0.25,
      step: 0.01,
      unit: "s",
      mapping: "log"
    },
    {
      id: "makeup",
      label: "Makeup",
      min: -6,
      max: 24,
      defaultValue: 0,
      step: 0.5,
      unit: "dB",
      mapping: "linear"
    }
  ],
  composition: {
    level: 0,
    isAtomic: !1,
    internalGraph: {
      nodes: [
        // Input gain: passes audio through, output fans out to detection and audio paths
        { internalId: "input-gain", moduleType: "gain", position: { x: 50, y: 200 }, parameterBindings: { gain: 0 } },
        // Detection path: envelope detector measures amplitude
        { internalId: "env-det", moduleType: "envelope-detector", position: { x: 300, y: 350 } },
        // Gain computer: decides how much to compress based on threshold/ratio
        { internalId: "gain-comp", moduleType: "gain-computer", position: { x: 550, y: 350 } },
        // dB-to-linear: converts gain reduction from dB to a linear multiplier
        { internalId: "db-to-lin", moduleType: "atomic-db-to-lin", position: { x: 750, y: 350 } },
        // VCA: multiplies audio by the gain reduction amount
        { internalId: "vca", moduleType: "atomic-multiply", position: { x: 750, y: 200 } },
        // Makeup gain: compensates for level lost during compression
        { internalId: "makeup", moduleType: "gain", position: { x: 950, y: 200 }, parameterBindings: { gain: 0 } }
      ],
      edges: [
        // Audio path: input → VCA (input a)
        { fromNode: "input-gain", fromPort: "out", toNode: "vca", toPort: "a" },
        // Detection path: input → envelope detector → gain computer → dB-to-linear → VCA (input b)
        { fromNode: "input-gain", fromPort: "out", toNode: "env-det", toPort: "in" },
        { fromNode: "env-det", fromPort: "out", toNode: "gain-comp", toPort: "in" },
        { fromNode: "gain-comp", fromPort: "out", toNode: "db-to-lin", toPort: "in" },
        { fromNode: "db-to-lin", fromPort: "out", toNode: "vca", toPort: "b" },
        // VCA output → makeup gain
        { fromNode: "vca", fromPort: "out", toNode: "makeup", toPort: "in" }
      ],
      exposedInputs: [
        { externalPortId: "in", internalNodeId: "input-gain", internalPortId: "in" }
      ],
      exposedOutputs: [
        { externalPortId: "out", internalNodeId: "makeup", internalPortId: "out" }
      ],
      exposedParameters: [
        { externalParamId: "threshold", internalNodeId: "gain-comp", internalParamId: "threshold" },
        { externalParamId: "ratio", internalNodeId: "gain-comp", internalParamId: "ratio" },
        { externalParamId: "attack", internalNodeId: "env-det", internalParamId: "attack" },
        { externalParamId: "release", internalNodeId: "env-det", internalParamId: "release" },
        { externalParamId: "makeup", internalNodeId: "makeup", internalParamId: "gain" }
      ]
    }
  }
};
function J2(e, r, o) {
  const s = r.internalGraph, i = /* @__PURE__ */ new Map();
  for (const p of s.nodes) {
    const g = yh(p.moduleType), m = ct(p.moduleType), h = {};
    for (const I of m.parameters)
      h[I.id] = I.defaultValue;
    p.parameterBindings && Object.assign(h, p.parameterBindings);
    const w = g.create(e, h);
    i.set(p.internalId, w);
  }
  for (const p of s.exposedParameters) {
    const g = i.get(p.internalNodeId);
    g && o[p.externalParamId] !== void 0 && g.setParameter(p.internalParamId, o[p.externalParamId], e.currentTime);
  }
  for (const p of s.edges) {
    const g = i.get(p.fromNode), m = i.get(p.toNode);
    if (!g || !m) {
      console.warn(`Composite: missing processor for edge ${p.fromNode} → ${p.toNode}`);
      continue;
    }
    const h = g.outputs[p.fromPort], w = m.inputs[p.toPort];
    if (!h || !w) {
      console.warn(`Composite: missing port for edge ${p.fromNode}.${p.fromPort} → ${p.toNode}.${p.toPort}`);
      continue;
    }
    w instanceof AudioParam, h.connect(w);
  }
  const l = {};
  for (const p of s.exposedInputs) {
    const g = i.get(p.internalNodeId);
    g && (l[p.externalPortId] = g.inputs[p.internalPortId]);
  }
  const c = {};
  for (const p of s.exposedOutputs) {
    const g = i.get(p.internalNodeId);
    g && (c[p.externalPortId] = g.outputs[p.internalPortId]);
  }
  const u = /* @__PURE__ */ new Map();
  for (const p of s.exposedParameters) {
    const g = i.get(p.internalNodeId);
    g && u.set(p.externalParamId, { proc: g, paramId: p.internalParamId });
  }
  return {
    inputs: l,
    outputs: c,
    setParameter(p, g, m) {
      const h = u.get(p);
      h && h.proc.setParameter(h.paramId, g, m);
    },
    dispose() {
      for (const p of i.values())
        p.dispose();
    },
    getInternalProcessor(p) {
      return i.get(p);
    }
  };
}
const d0 = {
  create(e, r) {
    const o = Fu.composition;
    if (!(o != null && o.internalGraph))
      throw new Error("Compressor manifest missing composition");
    const s = J2(e, o, r), i = e.createGain();
    i.gain.value = 1;
    const l = e.createGain();
    l.gain.value = 1;
    const c = e.createGain();
    c.gain.value = 1;
    const u = s.inputs.in, p = s.outputs.out;
    u instanceof AudioNode && i.connect(u), p && p.connect(c), c.connect(l);
    const g = e.createGain();
    g.gain.value = 0, i.connect(g), g.connect(l);
    const m = e.createGain();
    return m.gain.value = 0, m.connect(e.createGain()), {
      inputs: {
        in: i,
        sidechain: m
      },
      outputs: { out: l },
      setParameter(h, w, I) {
        s.setParameter(h, w, I);
      },
      setBypass(h, w) {
        h ? (c.gain.setTargetAtTime(0, w, 0.02), g.gain.setTargetAtTime(1, w, 0.02)) : (c.gain.setTargetAtTime(1, w, 0.02), g.gain.setTargetAtTime(0, w, 0.02));
      },
      dispose() {
        i.disconnect(), c.disconnect(), g.disconnect(), l.disconnect(), m.disconnect(), s.dispose();
      },
      getInternalProcessor(h) {
        var w;
        return (w = s.getInternalProcessor) == null ? void 0 : w.call(s, h);
      }
    };
  }
};
function q2(e) {
  const r = e.internalGraph;
  if (!r) return { nodes: [], edges: [] };
  const o = [], s = [], i = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map();
  for (let u = 0; u < r.exposedInputs.length; u++) {
    const p = r.exposedInputs[u], g = At();
    l.set(p.externalPortId, g), o.push({
      id: g,
      type: "port-node",
      position: { x: -150, y: 150 + u * 120 },
      data: {
        label: p.externalPortId,
        parameters: {},
        portDirection: "input",
        portId: p.externalPortId
      }
    });
  }
  const c = /* @__PURE__ */ new Map();
  for (let u = 0; u < r.exposedOutputs.length; u++) {
    const p = r.exposedOutputs[u], g = At();
    c.set(p.externalPortId, g), o.push({
      id: g,
      type: "port-node",
      position: { x: 1100, y: 150 + u * 120 },
      data: {
        label: p.externalPortId,
        parameters: {},
        portDirection: "output",
        portId: p.externalPortId
      }
    });
  }
  for (const u of r.nodes) {
    const p = At();
    i.set(u.internalId, p);
    const g = ct(u.moduleType), m = {};
    for (const h of g.parameters)
      m[h.id] = h.defaultValue;
    u.parameterBindings && Object.assign(m, u.parameterBindings), o.push({
      id: p,
      type: u.moduleType,
      position: u.position,
      dragHandle: ".daw-node__header",
      data: {
        label: g.label,
        parameters: m
      }
    });
  }
  for (const u of r.edges) {
    const p = i.get(u.fromNode), g = i.get(u.toNode);
    if (!p || !g) continue;
    const m = r.nodes.find((I) => I.internalId === u.fromNode);
    let h = "audio", w = "mono";
    if (m)
      try {
        const x = ct(m.moduleType).ports.find((C) => C.id === u.fromPort);
        x && (h = x.signalType, w = x.channelFormat);
      } catch {
      }
    s.push({
      id: At(),
      source: p,
      sourceHandle: u.fromPort,
      target: g,
      targetHandle: u.toPort,
      type: h,
      data: { signalType: h, channelFormat: w }
    });
  }
  for (const u of r.exposedInputs) {
    const p = l.get(u.externalPortId), g = i.get(u.internalNodeId);
    !p || !g || s.push({
      id: At(),
      source: p,
      sourceHandle: "out",
      target: g,
      targetHandle: u.internalPortId,
      type: "audio",
      data: { signalType: "audio", channelFormat: "stereo" }
    });
  }
  for (const u of r.exposedOutputs) {
    const p = i.get(u.internalNodeId), g = c.get(u.externalPortId);
    !p || !g || s.push({
      id: At(),
      source: p,
      sourceHandle: u.internalPortId,
      target: g,
      targetHandle: "in",
      type: "audio",
      data: { signalType: "audio", channelFormat: "stereo" }
    });
  }
  return { nodes: o, edges: s };
}
function f0({ id: e, data: r }) {
  const o = pe((C) => C.updateParameter), s = pe((C) => C.toggleBypass), i = R.useCallback(() => {
    const b = ct("compressor").composition;
    if (!(b != null && b.internalGraph)) return;
    const N = on.getState();
    if (!N.internalGraphs[e]) {
      const { nodes: k, edges: A } = q2(b);
      N.initInternalGraph(e, k, A);
    }
    N.pushScope(e, r.label || "Compressor", "compressor");
  }, [e, r.label]), l = r.parameters.threshold ?? -18, c = r.parameters.ratio ?? 4, u = r.parameters.attack ?? 3e-3, p = r.parameters.release ?? 0.25, g = r.parameters.makeup ?? 0, m = R.useRef(null), h = R.useRef(null), w = R.useRef(0), I = R.useCallback(() => {
    var S;
    const C = $t(), b = C == null ? void 0 : C.getProcessor(e), N = ((S = b == null ? void 0 : b.getReductionDb) == null ? void 0 : S.call(b)) ?? 0, k = Math.abs(N), A = Math.min(100, k / 20 * 100);
    m.current && (m.current.style.width = `${A}%`), h.current && (h.current.textContent = k > 0.1 ? `${N.toFixed(1)} dB` : "0.0 dB"), w.current = requestAnimationFrame(I);
  }, [e]);
  R.useEffect(() => (w.current = requestAnimationFrame(I), () => cancelAnimationFrame(w.current)), [I]);
  const x = [
    "daw-node daw-node--effect",
    r.bypassed ? "daw-node--bypassed" : ""
  ].join(" ");
  return /* @__PURE__ */ f.jsxs("div", { className: x, style: { minWidth: 200 }, children: [
    /* @__PURE__ */ f.jsx(
      oe,
      {
        type: "target",
        position: Q.Left,
        id: "in",
        className: "daw-handle daw-handle--audio daw-handle--stereo daw-handle--pos-1of2"
      }
    ),
    /* @__PURE__ */ f.jsx(
      oe,
      {
        type: "target",
        position: Q.Left,
        id: "sidechain",
        className: "daw-handle daw-handle--audio daw-handle--sidechain daw-handle--pos-2of2"
      }
    ),
    /* @__PURE__ */ f.jsxs("div", { className: "daw-node__header", children: [
      /* @__PURE__ */ f.jsx("span", { children: "Compressor" }),
      /* @__PURE__ */ f.jsxs("div", { className: "daw-node__sm-buttons", children: [
        /* @__PURE__ */ f.jsx(
          "button",
          {
            className: "daw-node__sm-btn daw-node__sm-btn--expand",
            onClick: (C) => {
              C.stopPropagation(), i();
            },
            title: "Open Internals",
            children: "▶"
          }
        ),
        /* @__PURE__ */ f.jsx(
          "button",
          {
            className: `daw-node__sm-btn daw-node__sm-btn--bypass ${r.bypassed ? "active" : ""}`,
            onClick: (C) => {
              C.stopPropagation(), s(e);
            },
            title: "Bypass",
            children: "B"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ f.jsxs("div", { className: "daw-node__body nodrag nowheel", children: [
      /* @__PURE__ */ f.jsxs("div", { className: "daw-compressor__gr-meter", children: [
        /* @__PURE__ */ f.jsx("div", { className: "daw-compressor__gr-bar", ref: m }),
        /* @__PURE__ */ f.jsx("span", { className: "daw-compressor__gr-label", ref: h, children: "0.0 dB" })
      ] }),
      /* @__PURE__ */ f.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ f.jsx("span", { className: "daw-node__param-label", children: "Threshold" }),
        /* @__PURE__ */ f.jsx(
          ye,
          {
            min: -60,
            max: 0,
            step: 0.5,
            value: l,
            onChange: (C) => o(e, "threshold", C)
          }
        ),
        /* @__PURE__ */ f.jsxs("span", { className: "daw-node__param-value", children: [
          l.toFixed(1),
          " dB"
        ] })
      ] }),
      /* @__PURE__ */ f.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ f.jsx("span", { className: "daw-node__param-label", children: "Ratio" }),
        /* @__PURE__ */ f.jsx(
          ye,
          {
            min: 1,
            max: 20,
            step: 0.5,
            value: c,
            onChange: (C) => o(e, "ratio", C)
          }
        ),
        /* @__PURE__ */ f.jsxs("span", { className: "daw-node__param-value", children: [
          c.toFixed(1),
          ":1"
        ] })
      ] }),
      /* @__PURE__ */ f.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ f.jsx("span", { className: "daw-node__param-label", children: "Attack" }),
        /* @__PURE__ */ f.jsx(
          ye,
          {
            min: 1e-3,
            max: 0.1,
            step: 1e-3,
            value: u,
            onChange: (C) => o(e, "attack", C)
          }
        ),
        /* @__PURE__ */ f.jsxs("span", { className: "daw-node__param-value", children: [
          (u * 1e3).toFixed(1),
          " ms"
        ] })
      ] }),
      /* @__PURE__ */ f.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ f.jsx("span", { className: "daw-node__param-label", children: "Release" }),
        /* @__PURE__ */ f.jsx(
          ye,
          {
            min: 0.01,
            max: 1,
            step: 0.01,
            value: p,
            onChange: (C) => o(e, "release", C)
          }
        ),
        /* @__PURE__ */ f.jsxs("span", { className: "daw-node__param-value", children: [
          (p * 1e3).toFixed(0),
          " ms"
        ] })
      ] }),
      /* @__PURE__ */ f.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ f.jsx("span", { className: "daw-node__param-label", children: "Makeup" }),
        /* @__PURE__ */ f.jsx(
          ye,
          {
            min: -6,
            max: 24,
            step: 0.5,
            value: g,
            onChange: (C) => o(e, "makeup", C)
          }
        ),
        /* @__PURE__ */ f.jsxs("span", { className: "daw-node__param-value", children: [
          g > 0 ? "+" : "",
          g.toFixed(1),
          " dB"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ f.jsx(oe, { type: "source", position: Q.Right, id: "out", className: "daw-handle daw-handle--audio daw-handle--stereo" })
  ] });
}
const p0 = {
  type: "limiter",
  label: "Limiter",
  category: "effect",
  ports: [
    {
      id: "in",
      label: "Audio In",
      direction: "input",
      signalType: "audio",
      channelFormat: "stereo"
    },
    {
      id: "out",
      label: "Output",
      direction: "output",
      signalType: "audio",
      channelFormat: "stereo"
    }
  ],
  parameters: [
    {
      id: "threshold",
      label: "Threshold",
      min: -30,
      max: 0,
      defaultValue: -1,
      step: 0.5,
      unit: "dB",
      mapping: "linear"
    },
    {
      id: "release",
      label: "Release",
      min: 0.01,
      max: 0.5,
      defaultValue: 0.1,
      step: 0.01,
      unit: "s",
      mapping: "log"
    },
    {
      id: "lookahead",
      label: "Lookahead",
      min: 0,
      max: 5e-3,
      defaultValue: 1e-3,
      step: 1e-4,
      unit: "s",
      mapping: "linear"
    }
  ]
}, g0 = {
  create(e, r) {
    const o = r.threshold ?? -1, s = r.release ?? 0.1, i = r.lookahead ?? 1e-3, l = e.createGain();
    l.gain.value = 1;
    const c = e.createDelay(0.01);
    c.delayTime.value = i;
    const u = e.createDynamicsCompressor();
    u.threshold.value = o, u.ratio.value = 20, u.knee.value = 0, u.attack.value = 1e-3, u.release.value = s;
    const p = e.createGain();
    p.gain.value = 1;
    const g = e.createGain();
    g.gain.value = 1;
    const m = e.createGain();
    return m.gain.value = 0, l.connect(c), c.connect(u), u.connect(g), g.connect(p), l.connect(m), m.connect(p), {
      inputs: { in: l },
      outputs: { out: p },
      setParameter(h, w, I) {
        switch (h) {
          case "threshold":
            u.threshold.setTargetAtTime(w, I, 0.02);
            break;
          case "release":
            u.release.setTargetAtTime(w, I, 0.02);
            break;
          case "lookahead":
            c.delayTime.setTargetAtTime(w, I, 0.02);
            break;
        }
      },
      setBypass(h, w) {
        h ? (g.gain.setTargetAtTime(0, w, 0.02), m.gain.setTargetAtTime(1, w, 0.02)) : (g.gain.setTargetAtTime(1, w, 0.02), m.gain.setTargetAtTime(0, w, 0.02));
      },
      getReductionDb() {
        return u.reduction;
      },
      dispose() {
        l.disconnect(), c.disconnect(), u.disconnect(), g.disconnect(), m.disconnect(), p.disconnect();
      }
    };
  }
};
function m0({ id: e, data: r }) {
  const o = pe((w) => w.updateParameter), s = pe((w) => w.toggleBypass), i = r.parameters.threshold ?? -1, l = r.parameters.release ?? 0.1, c = r.parameters.lookahead ?? 1e-3, u = R.useRef(null), p = R.useRef(null), g = R.useRef(0), m = R.useCallback(() => {
    var N;
    const w = $t(), I = w == null ? void 0 : w.getProcessor(e), x = ((N = I == null ? void 0 : I.getReductionDb) == null ? void 0 : N.call(I)) ?? 0, C = Math.abs(x), b = Math.min(100, C / 20 * 100);
    u.current && (u.current.style.width = `${b}%`), p.current && (p.current.textContent = C > 0.1 ? `${x.toFixed(1)} dB` : "0.0 dB"), g.current = requestAnimationFrame(m);
  }, [e]);
  R.useEffect(() => (g.current = requestAnimationFrame(m), () => cancelAnimationFrame(g.current)), [m]);
  const h = [
    "daw-node daw-node--effect",
    r.bypassed ? "daw-node--bypassed" : ""
  ].join(" ");
  return /* @__PURE__ */ f.jsxs("div", { className: h, style: { minWidth: 200 }, children: [
    /* @__PURE__ */ f.jsx(
      oe,
      {
        type: "target",
        position: Q.Left,
        id: "in",
        className: "daw-handle daw-handle--audio daw-handle--stereo"
      }
    ),
    /* @__PURE__ */ f.jsxs("div", { className: "daw-node__header", children: [
      /* @__PURE__ */ f.jsx("span", { children: "Limiter" }),
      /* @__PURE__ */ f.jsx("div", { className: "daw-node__sm-buttons", children: /* @__PURE__ */ f.jsx(
        "button",
        {
          className: `daw-node__sm-btn daw-node__sm-btn--bypass ${r.bypassed ? "active" : ""}`,
          onClick: (w) => {
            w.stopPropagation(), s(e);
          },
          title: "Bypass",
          children: "B"
        }
      ) })
    ] }),
    /* @__PURE__ */ f.jsxs("div", { className: "daw-node__body nodrag nowheel", children: [
      /* @__PURE__ */ f.jsxs("div", { className: "daw-compressor__gr-meter", children: [
        /* @__PURE__ */ f.jsx("div", { className: "daw-compressor__gr-bar", ref: u }),
        /* @__PURE__ */ f.jsx("span", { className: "daw-compressor__gr-label", ref: p, children: "0.0 dB" })
      ] }),
      /* @__PURE__ */ f.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ f.jsx("span", { className: "daw-node__param-label", children: "Threshold" }),
        /* @__PURE__ */ f.jsx(
          ye,
          {
            min: -30,
            max: 0,
            step: 0.5,
            value: i,
            onChange: (w) => o(e, "threshold", w)
          }
        ),
        /* @__PURE__ */ f.jsxs("span", { className: "daw-node__param-value", children: [
          i.toFixed(1),
          " dB"
        ] })
      ] }),
      /* @__PURE__ */ f.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ f.jsx("span", { className: "daw-node__param-label", children: "Release" }),
        /* @__PURE__ */ f.jsx(
          ye,
          {
            min: 0.01,
            max: 0.5,
            step: 0.01,
            value: l,
            onChange: (w) => o(e, "release", w)
          }
        ),
        /* @__PURE__ */ f.jsxs("span", { className: "daw-node__param-value", children: [
          (l * 1e3).toFixed(0),
          " ms"
        ] })
      ] }),
      /* @__PURE__ */ f.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ f.jsx("span", { className: "daw-node__param-label", children: "Lookahead" }),
        /* @__PURE__ */ f.jsx(
          ye,
          {
            min: 0,
            max: 5e-3,
            step: 1e-4,
            value: c,
            onChange: (w) => o(e, "lookahead", w)
          }
        ),
        /* @__PURE__ */ f.jsxs("span", { className: "daw-node__param-value", children: [
          (c * 1e3).toFixed(1),
          " ms"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ f.jsx(oe, { type: "source", position: Q.Right, id: "out", className: "daw-handle daw-handle--audio daw-handle--stereo" })
  ] });
}
const h0 = {
  type: "gate",
  label: "Gate",
  category: "effect",
  ports: [
    {
      id: "in",
      label: "Audio In",
      direction: "input",
      signalType: "audio",
      channelFormat: "stereo"
    },
    {
      id: "sidechain",
      label: "Sidechain",
      direction: "input",
      signalType: "audio",
      channelFormat: "stereo"
    },
    {
      id: "out",
      label: "Output",
      direction: "output",
      signalType: "audio",
      channelFormat: "stereo"
    }
  ],
  parameters: [
    {
      id: "threshold",
      label: "Threshold",
      min: -80,
      max: -10,
      defaultValue: -40,
      step: 0.5,
      unit: "dB",
      mapping: "linear"
    },
    {
      id: "attack",
      label: "Attack",
      min: 1e-4,
      max: 0.05,
      defaultValue: 1e-3,
      step: 1e-4,
      unit: "s",
      mapping: "log"
    },
    {
      id: "hold",
      label: "Hold",
      min: 0,
      max: 0.5,
      defaultValue: 0.05,
      step: 1e-3,
      unit: "s",
      mapping: "linear"
    },
    {
      id: "release",
      label: "Release",
      min: 0.01,
      max: 0.5,
      defaultValue: 0.1,
      step: 0.01,
      unit: "s",
      mapping: "log"
    },
    {
      id: "range",
      label: "Range",
      min: -80,
      max: 0,
      defaultValue: -80,
      step: 0.5,
      unit: "dB",
      mapping: "linear"
    }
  ]
}, y0 = {
  create(e, r) {
    const o = r.threshold ?? -40, s = r.attack ?? 1e-3, i = r.hold ?? 0.05, l = r.release ?? 0.1, c = r.range ?? -80, u = e.createGain();
    u.gain.value = 1;
    const p = new AudioWorkletNode(e, "gate-processor", {
      numberOfInputs: 2,
      numberOfOutputs: 1,
      outputChannelCount: [2],
      parameterData: {
        threshold: o,
        attack: s,
        hold: i,
        release: l,
        range: c
      }
    }), g = e.createGain();
    g.gain.value = 1;
    const m = e.createGain();
    m.gain.value = 1;
    const h = e.createGain();
    h.gain.value = 0, u.connect(p, 0, 0), p.connect(m), m.connect(g), u.connect(h), h.connect(g);
    const w = e.createGain();
    w.gain.value = 1, w.connect(p, 0, 1);
    let I = !1;
    return p.port.onmessage = (x) => {
      x.data.gateOpen !== void 0 && (I = x.data.gateOpen);
    }, {
      inputs: {
        in: u,
        sidechain: w
      },
      outputs: { out: g },
      setParameter(x, C, b) {
        const N = p.parameters.get(x);
        N && N.setTargetAtTime(C, b, 0.02);
      },
      setBypass(x, C) {
        x ? (m.gain.setTargetAtTime(0, C, 0.02), h.gain.setTargetAtTime(1, C, 0.02)) : (m.gain.setTargetAtTime(1, C, 0.02), h.gain.setTargetAtTime(0, C, 0.02));
      },
      getReductionDb() {
        return I ? 0 : r.range ?? -80;
      },
      dispose() {
        u.disconnect(), p.disconnect(), w.disconnect(), m.disconnect(), h.disconnect(), g.disconnect();
      }
    };
  }
};
function w0({ id: e, data: r }) {
  const o = pe((x) => x.updateParameter), s = pe((x) => x.toggleBypass), i = r.parameters.threshold ?? -40, l = r.parameters.attack ?? 1e-3, c = r.parameters.hold ?? 0.05, u = r.parameters.release ?? 0.1, p = r.parameters.range ?? -80, [g, m] = R.useState(!1), h = R.useRef(0), w = R.useCallback(() => {
    var N;
    const x = $t(), C = x == null ? void 0 : x.getProcessor(e), b = ((N = C == null ? void 0 : C.getReductionDb) == null ? void 0 : N.call(C)) ?? -80;
    m(b > -1), h.current = requestAnimationFrame(w);
  }, [e]);
  R.useEffect(() => (h.current = requestAnimationFrame(w), () => cancelAnimationFrame(h.current)), [w]);
  const I = [
    "daw-node daw-node--effect",
    r.bypassed ? "daw-node--bypassed" : ""
  ].join(" ");
  return /* @__PURE__ */ f.jsxs("div", { className: I, style: { minWidth: 200 }, children: [
    /* @__PURE__ */ f.jsx(
      oe,
      {
        type: "target",
        position: Q.Left,
        id: "in",
        className: "daw-handle daw-handle--audio daw-handle--stereo daw-handle--pos-1of2"
      }
    ),
    /* @__PURE__ */ f.jsx(
      oe,
      {
        type: "target",
        position: Q.Left,
        id: "sidechain",
        className: "daw-handle daw-handle--audio daw-handle--sidechain daw-handle--pos-2of2"
      }
    ),
    /* @__PURE__ */ f.jsxs("div", { className: "daw-node__header", children: [
      /* @__PURE__ */ f.jsx("span", { children: "Gate" }),
      /* @__PURE__ */ f.jsxs("div", { className: "daw-node__sm-buttons", children: [
        /* @__PURE__ */ f.jsx(
          "span",
          {
            className: "daw-gate__led",
            style: {
              display: "inline-block",
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: g ? "var(--daw-success)" : "var(--daw-error)",
              marginRight: 4
            },
            title: g ? "Open" : "Closed"
          }
        ),
        /* @__PURE__ */ f.jsx(
          "button",
          {
            className: `daw-node__sm-btn daw-node__sm-btn--bypass ${r.bypassed ? "active" : ""}`,
            onClick: (x) => {
              x.stopPropagation(), s(e);
            },
            title: "Bypass",
            children: "B"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ f.jsxs("div", { className: "daw-node__body nodrag nowheel", children: [
      /* @__PURE__ */ f.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ f.jsx("span", { className: "daw-node__param-label", children: "Threshold" }),
        /* @__PURE__ */ f.jsx(
          ye,
          {
            min: -80,
            max: -10,
            step: 0.5,
            value: i,
            onChange: (x) => o(e, "threshold", x)
          }
        ),
        /* @__PURE__ */ f.jsxs("span", { className: "daw-node__param-value", children: [
          i.toFixed(1),
          " dB"
        ] })
      ] }),
      /* @__PURE__ */ f.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ f.jsx("span", { className: "daw-node__param-label", children: "Attack" }),
        /* @__PURE__ */ f.jsx(
          ye,
          {
            min: 1e-4,
            max: 0.05,
            step: 1e-4,
            value: l,
            onChange: (x) => o(e, "attack", x)
          }
        ),
        /* @__PURE__ */ f.jsxs("span", { className: "daw-node__param-value", children: [
          (l * 1e3).toFixed(1),
          " ms"
        ] })
      ] }),
      /* @__PURE__ */ f.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ f.jsx("span", { className: "daw-node__param-label", children: "Hold" }),
        /* @__PURE__ */ f.jsx(
          ye,
          {
            min: 0,
            max: 0.5,
            step: 1e-3,
            value: c,
            onChange: (x) => o(e, "hold", x)
          }
        ),
        /* @__PURE__ */ f.jsxs("span", { className: "daw-node__param-value", children: [
          (c * 1e3).toFixed(0),
          " ms"
        ] })
      ] }),
      /* @__PURE__ */ f.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ f.jsx("span", { className: "daw-node__param-label", children: "Release" }),
        /* @__PURE__ */ f.jsx(
          ye,
          {
            min: 0.01,
            max: 0.5,
            step: 0.01,
            value: u,
            onChange: (x) => o(e, "release", x)
          }
        ),
        /* @__PURE__ */ f.jsxs("span", { className: "daw-node__param-value", children: [
          (u * 1e3).toFixed(0),
          " ms"
        ] })
      ] }),
      /* @__PURE__ */ f.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ f.jsx("span", { className: "daw-node__param-label", children: "Range" }),
        /* @__PURE__ */ f.jsx(
          ye,
          {
            min: -80,
            max: 0,
            step: 0.5,
            value: p,
            onChange: (x) => o(e, "range", x)
          }
        ),
        /* @__PURE__ */ f.jsxs("span", { className: "daw-node__param-value", children: [
          p.toFixed(1),
          " dB"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ f.jsx(oe, { type: "source", position: Q.Right, id: "out", className: "daw-handle daw-handle--audio daw-handle--stereo" })
  ] });
}
const v0 = {
  type: "expander",
  label: "Expander",
  category: "effect",
  ports: [
    {
      id: "in",
      label: "Audio In",
      direction: "input",
      signalType: "audio",
      channelFormat: "stereo"
    },
    {
      id: "sidechain",
      label: "Sidechain",
      direction: "input",
      signalType: "audio",
      channelFormat: "stereo"
    },
    {
      id: "out",
      label: "Output",
      direction: "output",
      signalType: "audio",
      channelFormat: "stereo"
    }
  ],
  parameters: [
    {
      id: "threshold",
      label: "Threshold",
      min: -60,
      max: 0,
      defaultValue: -30,
      step: 0.5,
      unit: "dB",
      mapping: "linear"
    },
    {
      id: "ratio",
      label: "Ratio",
      min: 1,
      max: 10,
      defaultValue: 2,
      step: 0.5,
      unit: ":1",
      mapping: "linear"
    },
    {
      id: "attack",
      label: "Attack",
      min: 1e-4,
      max: 0.05,
      defaultValue: 1e-3,
      step: 1e-4,
      unit: "s",
      mapping: "log"
    },
    {
      id: "release",
      label: "Release",
      min: 0.01,
      max: 0.5,
      defaultValue: 0.1,
      step: 0.01,
      unit: "s",
      mapping: "log"
    }
  ]
}, x0 = {
  create(e, r) {
    const o = r.threshold ?? -30, s = r.ratio ?? 2, i = r.attack ?? 1e-3, l = r.release ?? 0.1, c = e.createGain();
    c.gain.value = 1;
    const u = new AudioWorkletNode(e, "expander-processor", {
      numberOfInputs: 2,
      numberOfOutputs: 1,
      outputChannelCount: [2],
      parameterData: {
        threshold: o,
        ratio: s,
        attack: i,
        release: l
      }
    }), p = e.createGain();
    p.gain.value = 1;
    const g = e.createGain();
    g.gain.value = 1;
    const m = e.createGain();
    m.gain.value = 0, c.connect(u, 0, 0), u.connect(g), g.connect(p), c.connect(m), m.connect(p);
    const h = e.createGain();
    h.gain.value = 1, h.connect(u, 0, 1);
    let w = 0;
    return u.port.onmessage = (I) => {
      I.data.reductionDb !== void 0 && (w = I.data.reductionDb);
    }, {
      inputs: {
        in: c,
        sidechain: h
      },
      outputs: { out: p },
      setParameter(I, x, C) {
        const b = u.parameters.get(I);
        b && b.setTargetAtTime(x, C, 0.02);
      },
      setBypass(I, x) {
        I ? (g.gain.setTargetAtTime(0, x, 0.02), m.gain.setTargetAtTime(1, x, 0.02)) : (g.gain.setTargetAtTime(1, x, 0.02), m.gain.setTargetAtTime(0, x, 0.02));
      },
      getReductionDb() {
        return w;
      },
      dispose() {
        c.disconnect(), u.disconnect(), h.disconnect(), g.disconnect(), m.disconnect(), p.disconnect();
      }
    };
  }
};
function I0({ id: e, data: r }) {
  const o = pe((I) => I.updateParameter), s = pe((I) => I.toggleBypass), i = r.parameters.threshold ?? -30, l = r.parameters.ratio ?? 2, c = r.parameters.attack ?? 1e-3, u = r.parameters.release ?? 0.1, p = R.useRef(null), g = R.useRef(null), m = R.useRef(0), h = R.useCallback(() => {
    var k;
    const I = $t(), x = I == null ? void 0 : I.getProcessor(e), C = ((k = x == null ? void 0 : x.getReductionDb) == null ? void 0 : k.call(x)) ?? 0, b = Math.abs(C), N = Math.min(100, b / 40 * 100);
    p.current && (p.current.style.width = `${N}%`), g.current && (g.current.textContent = b > 0.1 ? `${C.toFixed(1)} dB` : "0.0 dB"), m.current = requestAnimationFrame(h);
  }, [e]);
  R.useEffect(() => (m.current = requestAnimationFrame(h), () => cancelAnimationFrame(m.current)), [h]);
  const w = [
    "daw-node daw-node--effect",
    r.bypassed ? "daw-node--bypassed" : ""
  ].join(" ");
  return /* @__PURE__ */ f.jsxs("div", { className: w, style: { minWidth: 200 }, children: [
    /* @__PURE__ */ f.jsx(
      oe,
      {
        type: "target",
        position: Q.Left,
        id: "in",
        className: "daw-handle daw-handle--audio daw-handle--stereo daw-handle--pos-1of2"
      }
    ),
    /* @__PURE__ */ f.jsx(
      oe,
      {
        type: "target",
        position: Q.Left,
        id: "sidechain",
        className: "daw-handle daw-handle--audio daw-handle--sidechain daw-handle--pos-2of2"
      }
    ),
    /* @__PURE__ */ f.jsxs("div", { className: "daw-node__header", children: [
      /* @__PURE__ */ f.jsx("span", { children: "Expander" }),
      /* @__PURE__ */ f.jsx("div", { className: "daw-node__sm-buttons", children: /* @__PURE__ */ f.jsx(
        "button",
        {
          className: `daw-node__sm-btn daw-node__sm-btn--bypass ${r.bypassed ? "active" : ""}`,
          onClick: (I) => {
            I.stopPropagation(), s(e);
          },
          title: "Bypass",
          children: "B"
        }
      ) })
    ] }),
    /* @__PURE__ */ f.jsxs("div", { className: "daw-node__body nodrag nowheel", children: [
      /* @__PURE__ */ f.jsxs("div", { className: "daw-compressor__gr-meter", children: [
        /* @__PURE__ */ f.jsx("div", { className: "daw-compressor__gr-bar", ref: p }),
        /* @__PURE__ */ f.jsx("span", { className: "daw-compressor__gr-label", ref: g, children: "0.0 dB" })
      ] }),
      /* @__PURE__ */ f.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ f.jsx("span", { className: "daw-node__param-label", children: "Threshold" }),
        /* @__PURE__ */ f.jsx(
          ye,
          {
            min: -60,
            max: 0,
            step: 0.5,
            value: i,
            onChange: (I) => o(e, "threshold", I)
          }
        ),
        /* @__PURE__ */ f.jsxs("span", { className: "daw-node__param-value", children: [
          i.toFixed(1),
          " dB"
        ] })
      ] }),
      /* @__PURE__ */ f.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ f.jsx("span", { className: "daw-node__param-label", children: "Ratio" }),
        /* @__PURE__ */ f.jsx(
          ye,
          {
            min: 1,
            max: 10,
            step: 0.5,
            value: l,
            onChange: (I) => o(e, "ratio", I)
          }
        ),
        /* @__PURE__ */ f.jsxs("span", { className: "daw-node__param-value", children: [
          "1:",
          l.toFixed(1)
        ] })
      ] }),
      /* @__PURE__ */ f.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ f.jsx("span", { className: "daw-node__param-label", children: "Attack" }),
        /* @__PURE__ */ f.jsx(
          ye,
          {
            min: 1e-4,
            max: 0.05,
            step: 1e-4,
            value: c,
            onChange: (I) => o(e, "attack", I)
          }
        ),
        /* @__PURE__ */ f.jsxs("span", { className: "daw-node__param-value", children: [
          (c * 1e3).toFixed(1),
          " ms"
        ] })
      ] }),
      /* @__PURE__ */ f.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ f.jsx("span", { className: "daw-node__param-label", children: "Release" }),
        /* @__PURE__ */ f.jsx(
          ye,
          {
            min: 0.01,
            max: 0.5,
            step: 0.01,
            value: u,
            onChange: (I) => o(e, "release", I)
          }
        ),
        /* @__PURE__ */ f.jsxs("span", { className: "daw-node__param-value", children: [
          (u * 1e3).toFixed(0),
          " ms"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ f.jsx(oe, { type: "source", position: Q.Right, id: "out", className: "daw-handle daw-handle--audio daw-handle--stereo" })
  ] });
}
const C0 = {
  type: "de-esser",
  label: "De-esser",
  category: "effect",
  ports: [
    {
      id: "in",
      label: "Audio In",
      direction: "input",
      signalType: "audio",
      channelFormat: "stereo"
    },
    {
      id: "out",
      label: "Output",
      direction: "output",
      signalType: "audio",
      channelFormat: "stereo"
    }
  ],
  parameters: [
    {
      id: "frequency",
      label: "Frequency",
      min: 2e3,
      max: 16e3,
      defaultValue: 6e3,
      step: 100,
      unit: "Hz",
      mapping: "log"
    },
    {
      id: "range",
      label: "Range",
      min: 0,
      max: 12,
      defaultValue: 6,
      step: 0.5,
      unit: "dB",
      mapping: "linear"
    },
    {
      id: "listen",
      label: "Listen",
      min: 0,
      max: 1,
      defaultValue: 0,
      step: 1,
      unit: "",
      mapping: "linear"
    }
  ]
}, b0 = {
  create(e, r) {
    const o = r.frequency ?? 6e3, s = r.range ?? 6, i = r.listen ?? 0, l = e.createGain();
    l.gain.value = 1;
    const c = e.createBiquadFilter();
    c.type = "bandpass", c.frequency.value = o, c.Q.value = 2;
    const u = e.createBiquadFilter();
    u.type = "peaking", u.frequency.value = o, u.Q.value = 2, u.gain.value = 0;
    const p = new AudioWorkletNode(e, "de-esser-processor", {
      numberOfInputs: 2,
      numberOfOutputs: 1,
      outputChannelCount: [1],
      parameterData: {
        range: s
      }
    }), g = e.createGain();
    g.gain.value = 1;
    const m = e.createGain();
    m.gain.value = i;
    const h = e.createGain();
    h.gain.value = 1 - i;
    const w = e.createGain();
    w.gain.value = 1;
    const I = e.createGain();
    I.gain.value = 0, l.connect(c), c.connect(p, 0, 1), l.connect(u), l.connect(p, 0, 0), u.connect(h), h.connect(w), c.connect(m), m.connect(w), w.connect(g), l.connect(I), I.connect(g);
    let x = 0;
    return p.port.onmessage = (C) => {
      C.data.reductionDb !== void 0 && (x = C.data.reductionDb, u.gain.setValueAtTime(-Math.abs(x), e.currentTime));
    }, {
      inputs: { in: l },
      outputs: { out: g },
      setParameter(C, b, N) {
        switch (C) {
          case "frequency":
            c.frequency.setTargetAtTime(b, N, 0.02), u.frequency.setTargetAtTime(b, N, 0.02);
            break;
          case "range": {
            const k = p.parameters.get("range");
            k && k.setTargetAtTime(b, N, 0.02);
            break;
          }
          case "listen":
            m.gain.setTargetAtTime(b, N, 0.02), h.gain.setTargetAtTime(1 - b, N, 0.02);
            break;
        }
      },
      setBypass(C, b) {
        C ? (w.gain.setTargetAtTime(0, b, 0.02), I.gain.setTargetAtTime(1, b, 0.02)) : (w.gain.setTargetAtTime(1, b, 0.02), I.gain.setTargetAtTime(0, b, 0.02));
      },
      getReductionDb() {
        return x;
      },
      dispose() {
        l.disconnect(), c.disconnect(), u.disconnect(), p.disconnect(), h.disconnect(), m.disconnect(), w.disconnect(), I.disconnect(), g.disconnect();
      }
    };
  }
};
function N0({ id: e, data: r }) {
  const o = pe((x) => x.updateParameter), s = pe((x) => x.toggleBypass), i = r.parameters.frequency ?? 6e3, l = r.parameters.range ?? 6, c = r.parameters.listen ?? 0, u = R.useRef(null), p = R.useRef(null), g = R.useRef(0), m = R.useCallback(() => {
    var A;
    const x = $t(), C = x == null ? void 0 : x.getProcessor(e), b = ((A = C == null ? void 0 : C.getReductionDb) == null ? void 0 : A.call(C)) ?? 0, N = Math.abs(b), k = Math.min(100, N / 12 * 100);
    u.current && (u.current.style.width = `${k}%`), p.current && (p.current.textContent = N > 0.1 ? `${b.toFixed(1)} dB` : "0.0 dB"), g.current = requestAnimationFrame(m);
  }, [e]);
  R.useEffect(() => (g.current = requestAnimationFrame(m), () => cancelAnimationFrame(g.current)), [m]);
  const h = R.useCallback(() => {
    o(e, "listen", c > 0.5 ? 0 : 1);
  }, [e, c, o]), w = [
    "daw-node daw-node--effect",
    r.bypassed ? "daw-node--bypassed" : ""
  ].join(" "), I = (x) => x >= 1e3 ? `${(x / 1e3).toFixed(1)} kHz` : `${x.toFixed(0)} Hz`;
  return /* @__PURE__ */ f.jsxs("div", { className: w, style: { minWidth: 200 }, children: [
    /* @__PURE__ */ f.jsx(
      oe,
      {
        type: "target",
        position: Q.Left,
        id: "in",
        className: "daw-handle daw-handle--audio daw-handle--stereo"
      }
    ),
    /* @__PURE__ */ f.jsxs("div", { className: "daw-node__header", children: [
      /* @__PURE__ */ f.jsx("span", { children: "De-esser" }),
      /* @__PURE__ */ f.jsxs("div", { className: "daw-node__sm-buttons", children: [
        /* @__PURE__ */ f.jsx(
          "button",
          {
            className: `daw-node__sm-btn ${c > 0.5 ? "active" : ""}`,
            onClick: (x) => {
              x.stopPropagation(), h();
            },
            title: "Listen to detection band",
            style: { fontSize: "9px" },
            children: "L"
          }
        ),
        /* @__PURE__ */ f.jsx(
          "button",
          {
            className: `daw-node__sm-btn daw-node__sm-btn--bypass ${r.bypassed ? "active" : ""}`,
            onClick: (x) => {
              x.stopPropagation(), s(e);
            },
            title: "Bypass",
            children: "B"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ f.jsxs("div", { className: "daw-node__body nodrag nowheel", children: [
      /* @__PURE__ */ f.jsxs("div", { className: "daw-compressor__gr-meter", children: [
        /* @__PURE__ */ f.jsx("div", { className: "daw-compressor__gr-bar", ref: u }),
        /* @__PURE__ */ f.jsx("span", { className: "daw-compressor__gr-label", ref: p, children: "0.0 dB" })
      ] }),
      /* @__PURE__ */ f.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ f.jsx("span", { className: "daw-node__param-label", children: "Frequency" }),
        /* @__PURE__ */ f.jsx(
          ye,
          {
            min: 2e3,
            max: 16e3,
            step: 100,
            value: i,
            onChange: (x) => o(e, "frequency", x)
          }
        ),
        /* @__PURE__ */ f.jsx("span", { className: "daw-node__param-value", children: I(i) })
      ] }),
      /* @__PURE__ */ f.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ f.jsx("span", { className: "daw-node__param-label", children: "Range" }),
        /* @__PURE__ */ f.jsx(
          ye,
          {
            min: 0,
            max: 12,
            step: 0.5,
            value: l,
            onChange: (x) => o(e, "range", x)
          }
        ),
        /* @__PURE__ */ f.jsxs("span", { className: "daw-node__param-value", children: [
          l.toFixed(1),
          " dB"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ f.jsx(oe, { type: "source", position: Q.Right, id: "out", className: "daw-handle daw-handle--audio daw-handle--stereo" })
  ] });
}
const _0 = {
  type: "filter",
  label: "Filter",
  category: "effect",
  ports: [
    {
      id: "in",
      label: "Audio In",
      direction: "input",
      signalType: "audio",
      channelFormat: "stereo"
    },
    {
      id: "out",
      label: "Output",
      direction: "output",
      signalType: "audio",
      channelFormat: "stereo"
    },
    {
      id: "freq-cv",
      label: "Freq CV",
      direction: "input",
      signalType: "parameter",
      channelFormat: "mono"
    }
  ],
  parameters: [
    {
      id: "filterType",
      label: "Type",
      min: 0,
      max: 6,
      defaultValue: 0,
      step: 1,
      unit: "",
      mapping: "linear"
    },
    {
      id: "frequency",
      label: "Frequency",
      min: 20,
      max: 2e4,
      defaultValue: 1e3,
      step: 1,
      unit: "Hz",
      mapping: "log"
    },
    {
      id: "Q",
      label: "Q",
      min: 0.1,
      max: 20,
      defaultValue: 1,
      step: 0.1,
      unit: "",
      mapping: "log"
    },
    {
      id: "gain",
      label: "Gain",
      min: -24,
      max: 24,
      defaultValue: 0,
      step: 0.5,
      unit: "dB",
      mapping: "linear"
    }
  ]
}, jg = [
  "lowpass",
  "highpass",
  "bandpass",
  "notch",
  "allpass",
  "lowshelf",
  "highshelf"
], A0 = {
  create(e, r) {
    const o = r.filterType ?? 0, s = r.frequency ?? 1e3, i = r.Q ?? 1, l = r.gain ?? 0, c = e.createGain();
    c.gain.value = 1;
    const u = e.createBiquadFilter();
    u.type = jg[o] || "lowpass", u.frequency.value = s, u.Q.value = i, u.gain.value = l;
    const p = e.createGain();
    p.gain.value = 1;
    const g = e.createGain();
    g.gain.value = 1;
    const m = e.createGain();
    return m.gain.value = 0, c.connect(u), u.connect(g), g.connect(p), c.connect(m), m.connect(p), {
      inputs: {
        in: c,
        "freq-cv": u.frequency
      },
      outputs: { out: p },
      setParameter(h, w, I) {
        switch (h) {
          case "filterType":
            u.type = jg[Math.round(w)] || "lowpass";
            break;
          case "frequency":
            u.frequency.setTargetAtTime(w, I, 0.02);
            break;
          case "Q":
            u.Q.setTargetAtTime(w, I, 0.02);
            break;
          case "gain":
            u.gain.setTargetAtTime(w, I, 0.02);
            break;
        }
      },
      setBypass(h, w) {
        h ? (g.gain.setTargetAtTime(0, w, 0.02), m.gain.setTargetAtTime(1, w, 0.02)) : (g.gain.setTargetAtTime(1, w, 0.02), m.gain.setTargetAtTime(0, w, 0.02));
      },
      dispose() {
        c.disconnect(), u.disconnect(), g.disconnect(), m.disconnect(), p.disconnect();
      }
    };
  }
}, eA = ["LP", "HP", "BP", "Notch", "AP", "LS", "HS"];
function S0({ id: e, data: r }) {
  const o = pe((h) => h.updateParameter), s = pe((h) => h.toggleBypass), i = r.parameters.filterType ?? 0, l = r.parameters.frequency ?? 1e3, c = r.parameters.Q ?? 1, u = r.parameters.gain ?? 0, p = i >= 5, g = (h) => h >= 1e3 ? `${(h / 1e3).toFixed(1)} kHz` : `${h.toFixed(0)} Hz`, m = [
    "daw-node daw-node--effect",
    r.bypassed ? "daw-node--bypassed" : ""
  ].join(" ");
  return /* @__PURE__ */ f.jsxs("div", { className: m, style: { minWidth: 200 }, children: [
    /* @__PURE__ */ f.jsx(oe, { type: "target", position: Q.Left, id: "in", className: "daw-handle daw-handle--audio daw-handle--stereo" }),
    /* @__PURE__ */ f.jsx(oe, { type: "target", position: Q.Bottom, id: "freq-cv", className: "daw-handle daw-handle--parameter" }),
    /* @__PURE__ */ f.jsxs("div", { className: "daw-node__header", children: [
      /* @__PURE__ */ f.jsx("span", { children: "Filter" }),
      /* @__PURE__ */ f.jsx("div", { className: "daw-node__sm-buttons", children: /* @__PURE__ */ f.jsx(
        "button",
        {
          className: `daw-node__sm-btn daw-node__sm-btn--bypass ${r.bypassed ? "active" : ""}`,
          onClick: (h) => {
            h.stopPropagation(), s(e);
          },
          title: "Bypass",
          children: "B"
        }
      ) })
    ] }),
    /* @__PURE__ */ f.jsxs("div", { className: "daw-node__body nodrag nowheel", children: [
      /* @__PURE__ */ f.jsx("div", { style: { display: "flex", gap: 2, marginBottom: 6, flexWrap: "wrap" }, children: eA.map((h, w) => /* @__PURE__ */ f.jsx(
        "button",
        {
          className: `daw-node__sm-btn ${i === w ? "active" : ""}`,
          onClick: (I) => {
            I.stopPropagation(), o(e, "filterType", w);
          },
          style: { fontSize: "9px", padding: "2px 4px" },
          children: h
        },
        w
      )) }),
      /* @__PURE__ */ f.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ f.jsx("span", { className: "daw-node__param-label", children: "Frequency" }),
        /* @__PURE__ */ f.jsx(
          ye,
          {
            min: 20,
            max: 2e4,
            step: 1,
            value: l,
            onChange: (h) => o(e, "frequency", h)
          }
        ),
        /* @__PURE__ */ f.jsx("span", { className: "daw-node__param-value", children: g(l) })
      ] }),
      /* @__PURE__ */ f.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ f.jsx("span", { className: "daw-node__param-label", children: "Q" }),
        /* @__PURE__ */ f.jsx(
          ye,
          {
            min: 0.1,
            max: 20,
            step: 0.1,
            value: c,
            onChange: (h) => o(e, "Q", h)
          }
        ),
        /* @__PURE__ */ f.jsx("span", { className: "daw-node__param-value", children: c.toFixed(1) })
      ] }),
      p && /* @__PURE__ */ f.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ f.jsx("span", { className: "daw-node__param-label", children: "Gain" }),
        /* @__PURE__ */ f.jsx(
          ye,
          {
            min: -24,
            max: 24,
            step: 0.5,
            value: u,
            onChange: (h) => o(e, "gain", h)
          }
        ),
        /* @__PURE__ */ f.jsxs("span", { className: "daw-node__param-value", children: [
          u > 0 ? "+" : "",
          u.toFixed(1),
          " dB"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ f.jsx(oe, { type: "source", position: Q.Right, id: "out", className: "daw-handle daw-handle--audio daw-handle--stereo" })
  ] });
}
const k0 = {
  type: "chorus",
  label: "Chorus",
  category: "effect",
  ports: [
    {
      id: "in",
      label: "Audio In",
      direction: "input",
      signalType: "audio",
      channelFormat: "stereo"
    },
    {
      id: "out",
      label: "Output",
      direction: "output",
      signalType: "audio",
      channelFormat: "stereo"
    }
  ],
  parameters: [
    {
      id: "rate",
      label: "Rate",
      min: 0.1,
      max: 10,
      defaultValue: 1.5,
      step: 0.1,
      unit: "Hz",
      mapping: "log"
    },
    {
      id: "depth",
      label: "Depth",
      min: 0,
      max: 0.02,
      defaultValue: 5e-3,
      step: 1e-3,
      unit: "s",
      mapping: "linear"
    },
    {
      id: "mix",
      label: "Mix",
      min: 0,
      max: 1,
      defaultValue: 0.5,
      step: 0.01,
      unit: "",
      mapping: "linear"
    }
  ]
}, j0 = {
  create(e, r) {
    const o = r.rate ?? 1.5, s = r.depth ?? 5e-3, i = r.mix ?? 0.5, l = e.createGain();
    l.gain.value = 1;
    const c = e.createGain();
    c.gain.value = 1 - i;
    const u = e.createDelay(0.1);
    u.delayTime.value = 0.01;
    const p = e.createOscillator();
    p.type = "sine", p.frequency.value = o;
    const g = e.createGain();
    g.gain.value = s, p.connect(g), g.connect(u.delayTime), p.start();
    const m = e.createGain();
    m.gain.value = i;
    const h = e.createGain();
    h.gain.value = 1, l.connect(c), c.connect(h), l.connect(u), u.connect(m), m.connect(h);
    let w = i, I = !1;
    return {
      inputs: { in: l },
      outputs: { out: h },
      setParameter(x, C, b) {
        switch (x) {
          case "rate":
            p.frequency.setTargetAtTime(C, b, 0.02);
            break;
          case "depth":
            g.gain.setTargetAtTime(C, b, 0.02);
            break;
          case "mix":
            w = C, I || (c.gain.setTargetAtTime(1 - C, b, 0.02), m.gain.setTargetAtTime(C, b, 0.02));
            break;
        }
      },
      setBypass(x, C) {
        I = x, x ? (c.gain.setTargetAtTime(1, C, 0.02), m.gain.setTargetAtTime(0, C, 0.02)) : (c.gain.setTargetAtTime(1 - w, C, 0.02), m.gain.setTargetAtTime(w, C, 0.02));
      },
      dispose() {
        p.stop(), p.disconnect(), g.disconnect(), l.disconnect(), c.disconnect(), u.disconnect(), m.disconnect(), h.disconnect();
      }
    };
  }
};
function M0({ id: e, data: r }) {
  const o = pe((p) => p.updateParameter), s = pe((p) => p.toggleBypass), i = r.parameters.rate ?? 1.5, l = r.parameters.depth ?? 5e-3, c = r.parameters.mix ?? 0.5, u = [
    "daw-node daw-node--effect",
    r.bypassed ? "daw-node--bypassed" : ""
  ].join(" ");
  return /* @__PURE__ */ f.jsxs("div", { className: u, children: [
    /* @__PURE__ */ f.jsx(oe, { type: "target", position: Q.Left, id: "in", className: "daw-handle daw-handle--audio daw-handle--stereo" }),
    /* @__PURE__ */ f.jsxs("div", { className: "daw-node__header", children: [
      /* @__PURE__ */ f.jsx("span", { children: "Chorus" }),
      /* @__PURE__ */ f.jsx("div", { className: "daw-node__sm-buttons", children: /* @__PURE__ */ f.jsx(
        "button",
        {
          className: `daw-node__sm-btn daw-node__sm-btn--bypass ${r.bypassed ? "active" : ""}`,
          onClick: (p) => {
            p.stopPropagation(), s(e);
          },
          title: "Bypass",
          children: "B"
        }
      ) })
    ] }),
    /* @__PURE__ */ f.jsxs("div", { className: "daw-node__body nodrag nowheel", children: [
      /* @__PURE__ */ f.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ f.jsx("span", { className: "daw-node__param-label", children: "Rate" }),
        /* @__PURE__ */ f.jsx(
          ye,
          {
            min: 0.1,
            max: 10,
            step: 0.1,
            value: i,
            onChange: (p) => o(e, "rate", p)
          }
        ),
        /* @__PURE__ */ f.jsxs("span", { className: "daw-node__param-value", children: [
          i.toFixed(1),
          " Hz"
        ] })
      ] }),
      /* @__PURE__ */ f.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ f.jsx("span", { className: "daw-node__param-label", children: "Depth" }),
        /* @__PURE__ */ f.jsx(
          ye,
          {
            min: 0,
            max: 0.02,
            step: 1e-3,
            value: l,
            onChange: (p) => o(e, "depth", p)
          }
        ),
        /* @__PURE__ */ f.jsxs("span", { className: "daw-node__param-value", children: [
          (l * 1e3).toFixed(1),
          " ms"
        ] })
      ] }),
      /* @__PURE__ */ f.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ f.jsx("span", { className: "daw-node__param-label", children: "Mix" }),
        /* @__PURE__ */ f.jsx(
          ye,
          {
            min: 0,
            max: 1,
            step: 0.01,
            value: c,
            onChange: (p) => o(e, "mix", p)
          }
        ),
        /* @__PURE__ */ f.jsxs("span", { className: "daw-node__param-value", children: [
          (c * 100).toFixed(0),
          "%"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ f.jsx(oe, { type: "source", position: Q.Right, id: "out", className: "daw-handle daw-handle--audio daw-handle--stereo" })
  ] });
}
const T0 = {
  type: "flanger",
  label: "Flanger",
  category: "effect",
  ports: [
    {
      id: "in",
      label: "Audio In",
      direction: "input",
      signalType: "audio",
      channelFormat: "stereo"
    },
    {
      id: "out",
      label: "Output",
      direction: "output",
      signalType: "audio",
      channelFormat: "stereo"
    }
  ],
  parameters: [
    {
      id: "rate",
      label: "Rate",
      min: 0.05,
      max: 5,
      defaultValue: 0.5,
      step: 0.05,
      unit: "Hz",
      mapping: "log"
    },
    {
      id: "depth",
      label: "Depth",
      min: 0,
      max: 5e-3,
      defaultValue: 2e-3,
      step: 1e-4,
      unit: "s",
      mapping: "linear"
    },
    {
      id: "feedback",
      label: "Feedback",
      min: 0,
      max: 0.95,
      defaultValue: 0.5,
      step: 0.01,
      unit: "",
      mapping: "linear"
    },
    {
      id: "mix",
      label: "Mix",
      min: 0,
      max: 1,
      defaultValue: 0.5,
      step: 0.01,
      unit: "",
      mapping: "linear"
    }
  ]
}, R0 = {
  create(e, r) {
    const o = r.rate ?? 0.5, s = r.depth ?? 2e-3, i = r.feedback ?? 0.5, l = r.mix ?? 0.5, c = e.createGain();
    c.gain.value = 1;
    const u = e.createGain();
    u.gain.value = 1 - l;
    const p = e.createDelay(0.02);
    p.delayTime.value = 3e-3;
    const g = e.createOscillator();
    g.type = "sine", g.frequency.value = o;
    const m = e.createGain();
    m.gain.value = s, g.connect(m), m.connect(p.delayTime), g.start();
    const h = e.createGain();
    h.gain.value = i;
    const w = e.createGain();
    w.gain.value = l;
    const I = e.createGain();
    I.gain.value = 1, c.connect(u), u.connect(I), c.connect(p), p.connect(w), w.connect(I), p.connect(h), h.connect(p);
    let x = l, C = !1;
    return {
      inputs: { in: c },
      outputs: { out: I },
      setParameter(b, N, k) {
        switch (b) {
          case "rate":
            g.frequency.setTargetAtTime(N, k, 0.02);
            break;
          case "depth":
            m.gain.setTargetAtTime(N, k, 0.02);
            break;
          case "feedback":
            h.gain.setTargetAtTime(N, k, 0.02);
            break;
          case "mix":
            x = N, C || (u.gain.setTargetAtTime(1 - N, k, 0.02), w.gain.setTargetAtTime(N, k, 0.02));
            break;
        }
      },
      setBypass(b, N) {
        C = b, b ? (u.gain.setTargetAtTime(1, N, 0.02), w.gain.setTargetAtTime(0, N, 0.02)) : (u.gain.setTargetAtTime(1 - x, N, 0.02), w.gain.setTargetAtTime(x, N, 0.02));
      },
      dispose() {
        g.stop(), g.disconnect(), m.disconnect(), c.disconnect(), u.disconnect(), p.disconnect(), h.disconnect(), w.disconnect(), I.disconnect();
      }
    };
  }
};
function B0({ id: e, data: r }) {
  const o = pe((g) => g.updateParameter), s = pe((g) => g.toggleBypass), i = r.parameters.rate ?? 0.5, l = r.parameters.depth ?? 2e-3, c = r.parameters.feedback ?? 0.5, u = r.parameters.mix ?? 0.5, p = [
    "daw-node daw-node--effect",
    r.bypassed ? "daw-node--bypassed" : ""
  ].join(" ");
  return /* @__PURE__ */ f.jsxs("div", { className: p, children: [
    /* @__PURE__ */ f.jsx(oe, { type: "target", position: Q.Left, id: "in", className: "daw-handle daw-handle--audio daw-handle--stereo" }),
    /* @__PURE__ */ f.jsxs("div", { className: "daw-node__header", children: [
      /* @__PURE__ */ f.jsx("span", { children: "Flanger" }),
      /* @__PURE__ */ f.jsx("div", { className: "daw-node__sm-buttons", children: /* @__PURE__ */ f.jsx(
        "button",
        {
          className: `daw-node__sm-btn daw-node__sm-btn--bypass ${r.bypassed ? "active" : ""}`,
          onClick: (g) => {
            g.stopPropagation(), s(e);
          },
          title: "Bypass",
          children: "B"
        }
      ) })
    ] }),
    /* @__PURE__ */ f.jsxs("div", { className: "daw-node__body nodrag nowheel", children: [
      /* @__PURE__ */ f.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ f.jsx("span", { className: "daw-node__param-label", children: "Rate" }),
        /* @__PURE__ */ f.jsx(
          ye,
          {
            min: 0.05,
            max: 5,
            step: 0.05,
            value: i,
            onChange: (g) => o(e, "rate", g)
          }
        ),
        /* @__PURE__ */ f.jsxs("span", { className: "daw-node__param-value", children: [
          i.toFixed(2),
          " Hz"
        ] })
      ] }),
      /* @__PURE__ */ f.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ f.jsx("span", { className: "daw-node__param-label", children: "Depth" }),
        /* @__PURE__ */ f.jsx(
          ye,
          {
            min: 0,
            max: 5e-3,
            step: 1e-4,
            value: l,
            onChange: (g) => o(e, "depth", g)
          }
        ),
        /* @__PURE__ */ f.jsxs("span", { className: "daw-node__param-value", children: [
          (l * 1e3).toFixed(1),
          " ms"
        ] })
      ] }),
      /* @__PURE__ */ f.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ f.jsx("span", { className: "daw-node__param-label", children: "Feedback" }),
        /* @__PURE__ */ f.jsx(
          ye,
          {
            min: 0,
            max: 0.95,
            step: 0.01,
            value: c,
            onChange: (g) => o(e, "feedback", g)
          }
        ),
        /* @__PURE__ */ f.jsxs("span", { className: "daw-node__param-value", children: [
          (c * 100).toFixed(0),
          "%"
        ] })
      ] }),
      /* @__PURE__ */ f.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ f.jsx("span", { className: "daw-node__param-label", children: "Mix" }),
        /* @__PURE__ */ f.jsx(
          ye,
          {
            min: 0,
            max: 1,
            step: 0.01,
            value: u,
            onChange: (g) => o(e, "mix", g)
          }
        ),
        /* @__PURE__ */ f.jsxs("span", { className: "daw-node__param-value", children: [
          (u * 100).toFixed(0),
          "%"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ f.jsx(oe, { type: "source", position: Q.Right, id: "out", className: "daw-handle daw-handle--audio daw-handle--stereo" })
  ] });
}
const E0 = {
  type: "phaser",
  label: "Phaser",
  category: "effect",
  ports: [
    {
      id: "in",
      label: "Audio In",
      direction: "input",
      signalType: "audio",
      channelFormat: "stereo"
    },
    {
      id: "out",
      label: "Output",
      direction: "output",
      signalType: "audio",
      channelFormat: "stereo"
    }
  ],
  parameters: [
    {
      id: "rate",
      label: "Rate",
      min: 0.05,
      max: 5,
      defaultValue: 0.5,
      step: 0.05,
      unit: "Hz",
      mapping: "log"
    },
    {
      id: "depth",
      label: "Depth",
      min: 0,
      max: 1,
      defaultValue: 0.7,
      step: 0.01,
      unit: "",
      mapping: "linear"
    },
    {
      id: "feedback",
      label: "Feedback",
      min: 0,
      max: 0.95,
      defaultValue: 0.5,
      step: 0.01,
      unit: "",
      mapping: "linear"
    },
    {
      id: "stages",
      label: "Stages",
      min: 2,
      max: 8,
      defaultValue: 4,
      step: 2,
      unit: "",
      mapping: "linear"
    }
  ]
}, D0 = {
  create(e, r) {
    const o = r.rate ?? 0.5, s = r.depth ?? 0.7, i = r.feedback ?? 0.5, l = r.stages ?? 4, c = e.createGain();
    c.gain.value = 1;
    const u = [];
    for (let N = 0; N < 8; N++) {
      const k = e.createBiquadFilter();
      k.type = "allpass", k.frequency.value = 500 + N * 300, k.Q.value = 0.5, u.push(k);
    }
    for (let N = 1; N < u.length; N++)
      u[N - 1].connect(u[N]);
    const p = e.createOscillator();
    p.type = "sine", p.frequency.value = o;
    const g = [];
    for (let N = 0; N < u.length; N++) {
      const k = e.createGain();
      k.gain.value = (500 + N * 300) * s, p.connect(k), k.connect(u[N].frequency), g.push(k);
    }
    p.start();
    const m = e.createGain();
    m.gain.value = i;
    const h = e.createGain();
    h.gain.value = 0.5;
    const w = e.createGain();
    w.gain.value = 0.5;
    const I = e.createGain();
    I.gain.value = 1;
    const x = e.createGain();
    x.gain.value = 1;
    const C = e.createGain();
    C.gain.value = 0;
    const b = Math.min(Math.max(Math.round(l), 2), 8);
    return c.connect(u[0]), u[b - 1].connect(w), w.connect(x), u[b - 1].connect(m), m.connect(u[0]), c.connect(h), h.connect(x), x.connect(I), c.connect(C), C.connect(I), {
      inputs: { in: c },
      outputs: { out: I },
      setParameter(N, k, A) {
        switch (N) {
          case "rate":
            p.frequency.setTargetAtTime(k, A, 0.02);
            break;
          case "depth":
            for (let S = 0; S < g.length; S++)
              g[S].gain.setTargetAtTime((500 + S * 300) * k, A, 0.02);
            break;
          case "feedback":
            m.gain.setTargetAtTime(k, A, 0.02);
            break;
        }
      },
      setBypass(N, k) {
        N ? (x.gain.setTargetAtTime(0, k, 0.02), C.gain.setTargetAtTime(1, k, 0.02)) : (x.gain.setTargetAtTime(1, k, 0.02), C.gain.setTargetAtTime(0, k, 0.02));
      },
      dispose() {
        p.stop(), p.disconnect();
        for (const N of g) N.disconnect();
        for (const N of u) N.disconnect();
        c.disconnect(), h.disconnect(), w.disconnect(), m.disconnect(), x.disconnect(), C.disconnect(), I.disconnect();
      }
    };
  }
};
function G0({ id: e, data: r }) {
  const o = pe((g) => g.updateParameter), s = pe((g) => g.toggleBypass), i = r.parameters.rate ?? 0.5, l = r.parameters.depth ?? 0.7, c = r.parameters.feedback ?? 0.5, u = r.parameters.stages ?? 4, p = [
    "daw-node daw-node--effect",
    r.bypassed ? "daw-node--bypassed" : ""
  ].join(" ");
  return /* @__PURE__ */ f.jsxs("div", { className: p, children: [
    /* @__PURE__ */ f.jsx(oe, { type: "target", position: Q.Left, id: "in", className: "daw-handle daw-handle--audio daw-handle--stereo" }),
    /* @__PURE__ */ f.jsxs("div", { className: "daw-node__header", children: [
      /* @__PURE__ */ f.jsx("span", { children: "Phaser" }),
      /* @__PURE__ */ f.jsx("div", { className: "daw-node__sm-buttons", children: /* @__PURE__ */ f.jsx(
        "button",
        {
          className: `daw-node__sm-btn daw-node__sm-btn--bypass ${r.bypassed ? "active" : ""}`,
          onClick: (g) => {
            g.stopPropagation(), s(e);
          },
          title: "Bypass",
          children: "B"
        }
      ) })
    ] }),
    /* @__PURE__ */ f.jsxs("div", { className: "daw-node__body nodrag nowheel", children: [
      /* @__PURE__ */ f.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ f.jsx("span", { className: "daw-node__param-label", children: "Rate" }),
        /* @__PURE__ */ f.jsx(
          ye,
          {
            min: 0.05,
            max: 5,
            step: 0.05,
            value: i,
            onChange: (g) => o(e, "rate", g)
          }
        ),
        /* @__PURE__ */ f.jsxs("span", { className: "daw-node__param-value", children: [
          i.toFixed(2),
          " Hz"
        ] })
      ] }),
      /* @__PURE__ */ f.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ f.jsx("span", { className: "daw-node__param-label", children: "Depth" }),
        /* @__PURE__ */ f.jsx(
          ye,
          {
            min: 0,
            max: 1,
            step: 0.01,
            value: l,
            onChange: (g) => o(e, "depth", g)
          }
        ),
        /* @__PURE__ */ f.jsxs("span", { className: "daw-node__param-value", children: [
          (l * 100).toFixed(0),
          "%"
        ] })
      ] }),
      /* @__PURE__ */ f.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ f.jsx("span", { className: "daw-node__param-label", children: "Feedback" }),
        /* @__PURE__ */ f.jsx(
          ye,
          {
            min: 0,
            max: 0.95,
            step: 0.01,
            value: c,
            onChange: (g) => o(e, "feedback", g)
          }
        ),
        /* @__PURE__ */ f.jsxs("span", { className: "daw-node__param-value", children: [
          (c * 100).toFixed(0),
          "%"
        ] })
      ] }),
      /* @__PURE__ */ f.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ f.jsx("span", { className: "daw-node__param-label", children: "Stages" }),
        /* @__PURE__ */ f.jsx(
          ye,
          {
            min: 2,
            max: 8,
            step: 2,
            value: u,
            onChange: (g) => o(e, "stages", g)
          }
        ),
        /* @__PURE__ */ f.jsx("span", { className: "daw-node__param-value", children: Math.round(u) })
      ] })
    ] }),
    /* @__PURE__ */ f.jsx(oe, { type: "source", position: Q.Right, id: "out", className: "daw-handle daw-handle--audio daw-handle--stereo" })
  ] });
}
const F0 = {
  type: "waveshaper",
  label: "Waveshaper",
  category: "effect",
  ports: [
    {
      id: "in",
      label: "Audio In",
      direction: "input",
      signalType: "audio",
      channelFormat: "stereo"
    },
    {
      id: "out",
      label: "Output",
      direction: "output",
      signalType: "audio",
      channelFormat: "stereo"
    }
  ],
  parameters: [
    {
      id: "drive",
      label: "Drive",
      min: 0,
      max: 100,
      defaultValue: 50,
      step: 1,
      unit: "%",
      mapping: "linear"
    },
    {
      id: "curveType",
      label: "Curve",
      min: 0,
      max: 3,
      defaultValue: 0,
      step: 1,
      unit: "",
      mapping: "linear"
    },
    {
      id: "mix",
      label: "Mix",
      min: 0,
      max: 1,
      defaultValue: 1,
      step: 0.01,
      unit: "",
      mapping: "linear"
    }
  ]
};
function Qc(e, r) {
  const s = new Float32Array(1024), i = r / 100;
  for (let l = 0; l < 1024; l++) {
    const c = l * 2 / 1024 - 1;
    switch (e) {
      case 0:
        s[l] = Math.tanh(c * (1 + i * 10));
        break;
      case 1:
        s[l] = Math.max(-1, Math.min(1, c * (1 + i * 10)));
        break;
      case 2:
        {
          let u = c * (1 + i * 5);
          for (; Math.abs(u) > 1; )
            u = u > 1 ? 2 - u : u < -1 ? -2 - u : u;
          s[l] = u;
        }
        break;
      case 3:
        {
          const u = 1 + i * 10;
          c >= 0 ? s[l] = 1 - Math.exp(-u * c) : s[l] = -(1 - Math.exp(u * c)) * 0.8;
        }
        break;
      default:
        s[l] = c;
    }
  }
  return s;
}
const P0 = {
  create(e, r) {
    const o = r.drive ?? 50, s = r.curveType ?? 0, i = r.mix ?? 1, l = e.createGain();
    l.gain.value = 1;
    const c = e.createWaveShaper();
    c.curve = Qc(s, o), c.oversample = "2x";
    const u = e.createGain();
    u.gain.value = 1 - i;
    const p = e.createGain();
    p.gain.value = i;
    const g = e.createGain();
    g.gain.value = 1;
    const m = e.createGain();
    m.gain.value = 1;
    const h = e.createGain();
    h.gain.value = 0, l.connect(c), c.connect(p), p.connect(m), l.connect(u), u.connect(m), m.connect(g), l.connect(h), h.connect(g);
    let w = o, I = s;
    return {
      inputs: { in: l },
      outputs: { out: g },
      setParameter(x, C, b) {
        switch (x) {
          case "drive":
            w = C, c.curve = Qc(I, w);
            break;
          case "curveType":
            I = Math.round(C), c.curve = Qc(I, w);
            break;
          case "mix":
            u.gain.setTargetAtTime(1 - C, b, 0.02), p.gain.setTargetAtTime(C, b, 0.02);
            break;
        }
      },
      setBypass(x, C) {
        x ? (m.gain.setTargetAtTime(0, C, 0.02), h.gain.setTargetAtTime(1, C, 0.02)) : (m.gain.setTargetAtTime(1, C, 0.02), h.gain.setTargetAtTime(0, C, 0.02));
      },
      dispose() {
        l.disconnect(), c.disconnect(), u.disconnect(), p.disconnect(), m.disconnect(), h.disconnect(), g.disconnect();
      }
    };
  }
}, tA = ["Soft", "Hard", "Fold", "Tube"];
function z0({ id: e, data: r }) {
  const o = pe((p) => p.updateParameter), s = pe((p) => p.toggleBypass), i = r.parameters.drive ?? 50, l = r.parameters.curveType ?? 0, c = r.parameters.mix ?? 1, u = [
    "daw-node daw-node--effect",
    r.bypassed ? "daw-node--bypassed" : ""
  ].join(" ");
  return /* @__PURE__ */ f.jsxs("div", { className: u, style: { minWidth: 180 }, children: [
    /* @__PURE__ */ f.jsx(oe, { type: "target", position: Q.Left, id: "in", className: "daw-handle daw-handle--audio daw-handle--stereo" }),
    /* @__PURE__ */ f.jsxs("div", { className: "daw-node__header", children: [
      /* @__PURE__ */ f.jsx("span", { children: "Waveshaper" }),
      /* @__PURE__ */ f.jsx("div", { className: "daw-node__sm-buttons", children: /* @__PURE__ */ f.jsx(
        "button",
        {
          className: `daw-node__sm-btn daw-node__sm-btn--bypass ${r.bypassed ? "active" : ""}`,
          onClick: (p) => {
            p.stopPropagation(), s(e);
          },
          title: "Bypass",
          children: "B"
        }
      ) })
    ] }),
    /* @__PURE__ */ f.jsxs("div", { className: "daw-node__body nodrag nowheel", children: [
      /* @__PURE__ */ f.jsx("div", { style: { display: "flex", gap: 2, marginBottom: 6 }, children: tA.map((p, g) => /* @__PURE__ */ f.jsx(
        "button",
        {
          className: `daw-node__sm-btn ${l === g ? "active" : ""}`,
          onClick: (m) => {
            m.stopPropagation(), o(e, "curveType", g);
          },
          style: { fontSize: "9px", padding: "2px 4px" },
          children: p
        },
        g
      )) }),
      /* @__PURE__ */ f.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ f.jsx("span", { className: "daw-node__param-label", children: "Drive" }),
        /* @__PURE__ */ f.jsx(
          ye,
          {
            min: 0,
            max: 100,
            step: 1,
            value: i,
            onChange: (p) => o(e, "drive", p)
          }
        ),
        /* @__PURE__ */ f.jsxs("span", { className: "daw-node__param-value", children: [
          i.toFixed(0),
          "%"
        ] })
      ] }),
      /* @__PURE__ */ f.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ f.jsx("span", { className: "daw-node__param-label", children: "Mix" }),
        /* @__PURE__ */ f.jsx(
          ye,
          {
            min: 0,
            max: 1,
            step: 0.01,
            value: c,
            onChange: (p) => o(e, "mix", p)
          }
        ),
        /* @__PURE__ */ f.jsxs("span", { className: "daw-node__param-value", children: [
          (c * 100).toFixed(0),
          "%"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ f.jsx(oe, { type: "source", position: Q.Right, id: "out", className: "daw-handle daw-handle--audio daw-handle--stereo" })
  ] });
}
const V0 = {
  type: "bitcrusher",
  label: "Bitcrusher",
  category: "effect",
  ports: [
    {
      id: "in",
      label: "Audio In",
      direction: "input",
      signalType: "audio",
      channelFormat: "stereo"
    },
    {
      id: "out",
      label: "Output",
      direction: "output",
      signalType: "audio",
      channelFormat: "stereo"
    }
  ],
  parameters: [
    {
      id: "bitDepth",
      label: "Bit Depth",
      min: 1,
      max: 16,
      defaultValue: 8,
      step: 1,
      unit: "bits",
      mapping: "linear"
    },
    {
      id: "sampleRateReduction",
      label: "SR Reduction",
      min: 1,
      max: 64,
      defaultValue: 1,
      step: 1,
      unit: "x",
      mapping: "linear"
    }
  ]
}, O0 = {
  create(e, r) {
    const o = r.bitDepth ?? 8, s = r.sampleRateReduction ?? 1, i = e.createGain();
    i.gain.value = 1;
    const l = new AudioWorkletNode(e, "bitcrusher-processor", {
      numberOfInputs: 1,
      numberOfOutputs: 1,
      outputChannelCount: [2],
      parameterData: {
        bitDepth: o,
        sampleRateReduction: s
      }
    }), c = e.createGain();
    c.gain.value = 1;
    const u = e.createGain();
    u.gain.value = 1;
    const p = e.createGain();
    return p.gain.value = 0, i.connect(l), l.connect(u), u.connect(c), i.connect(p), p.connect(c), {
      inputs: { in: i },
      outputs: { out: c },
      setParameter(g, m, h) {
        const w = l.parameters.get(g);
        w && w.setTargetAtTime(m, h, 0.02);
      },
      setBypass(g, m) {
        g ? (u.gain.setTargetAtTime(0, m, 0.02), p.gain.setTargetAtTime(1, m, 0.02)) : (u.gain.setTargetAtTime(1, m, 0.02), p.gain.setTargetAtTime(0, m, 0.02));
      },
      dispose() {
        i.disconnect(), l.disconnect(), u.disconnect(), p.disconnect(), c.disconnect();
      }
    };
  }
};
function H0({ id: e, data: r }) {
  const o = pe((u) => u.updateParameter), s = pe((u) => u.toggleBypass), i = r.parameters.bitDepth ?? 8, l = r.parameters.sampleRateReduction ?? 1, c = [
    "daw-node daw-node--effect",
    r.bypassed ? "daw-node--bypassed" : ""
  ].join(" ");
  return /* @__PURE__ */ f.jsxs("div", { className: c, children: [
    /* @__PURE__ */ f.jsx(oe, { type: "target", position: Q.Left, id: "in", className: "daw-handle daw-handle--audio daw-handle--stereo" }),
    /* @__PURE__ */ f.jsxs("div", { className: "daw-node__header", children: [
      /* @__PURE__ */ f.jsx("span", { children: "Bitcrusher" }),
      /* @__PURE__ */ f.jsx("div", { className: "daw-node__sm-buttons", children: /* @__PURE__ */ f.jsx(
        "button",
        {
          className: `daw-node__sm-btn daw-node__sm-btn--bypass ${r.bypassed ? "active" : ""}`,
          onClick: (u) => {
            u.stopPropagation(), s(e);
          },
          title: "Bypass",
          children: "B"
        }
      ) })
    ] }),
    /* @__PURE__ */ f.jsxs("div", { className: "daw-node__body nodrag nowheel", children: [
      /* @__PURE__ */ f.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ f.jsx("span", { className: "daw-node__param-label", children: "Bit Depth" }),
        /* @__PURE__ */ f.jsx(
          ye,
          {
            min: 1,
            max: 16,
            step: 1,
            value: i,
            onChange: (u) => o(e, "bitDepth", u)
          }
        ),
        /* @__PURE__ */ f.jsxs("span", { className: "daw-node__param-value", children: [
          Math.round(i),
          " bit"
        ] })
      ] }),
      /* @__PURE__ */ f.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ f.jsx("span", { className: "daw-node__param-label", children: "SR Reduction" }),
        /* @__PURE__ */ f.jsx(
          ye,
          {
            min: 1,
            max: 64,
            step: 1,
            value: l,
            onChange: (u) => o(e, "sampleRateReduction", u)
          }
        ),
        /* @__PURE__ */ f.jsxs("span", { className: "daw-node__param-value", children: [
          Math.round(l),
          "x"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ f.jsx(oe, { type: "source", position: Q.Right, id: "out", className: "daw-handle daw-handle--audio daw-handle--stereo" })
  ] });
}
const W0 = {
  type: "tape-saturation",
  label: "Tape Sat",
  category: "effect",
  ports: [
    {
      id: "in",
      label: "Audio In",
      direction: "input",
      signalType: "audio",
      channelFormat: "stereo"
    },
    {
      id: "out",
      label: "Output",
      direction: "output",
      signalType: "audio",
      channelFormat: "stereo"
    }
  ],
  parameters: [
    {
      id: "drive",
      label: "Drive",
      min: 0,
      max: 100,
      defaultValue: 30,
      step: 1,
      unit: "%",
      mapping: "linear"
    },
    {
      id: "tone",
      label: "Tone",
      min: -100,
      max: 100,
      defaultValue: 0,
      step: 1,
      unit: "",
      mapping: "linear"
    },
    {
      id: "mix",
      label: "Mix",
      min: 0,
      max: 1,
      defaultValue: 1,
      step: 0.01,
      unit: "",
      mapping: "linear"
    }
  ]
};
function Mg(e) {
  const o = new Float32Array(1024), s = 1 + e / 100 * 10;
  for (let i = 0; i < 1024; i++) {
    const l = i * 2 / 1024 - 1;
    o[i] = Math.tanh(l * s);
  }
  return o;
}
const X0 = {
  create(e, r) {
    const o = r.drive ?? 30, s = r.tone ?? 0, i = r.mix ?? 1, l = e.createGain();
    l.gain.value = 1;
    const c = e.createWaveShaper();
    c.curve = Mg(o), c.oversample = "2x";
    const u = e.createBiquadFilter();
    u.type = "lowshelf", u.frequency.value = 1e3, u.gain.value = s / 10;
    const p = e.createGain();
    p.gain.value = 1 - i;
    const g = e.createGain();
    g.gain.value = i;
    const m = e.createGain();
    m.gain.value = 1;
    const h = e.createGain();
    h.gain.value = 1;
    const w = e.createGain();
    w.gain.value = 0, l.connect(c), c.connect(u), u.connect(g), g.connect(h), l.connect(p), p.connect(h), h.connect(m), l.connect(w), w.connect(m);
    let I = o;
    return {
      inputs: { in: l },
      outputs: { out: m },
      setParameter(x, C, b) {
        switch (x) {
          case "drive":
            I = C, c.curve = Mg(I);
            break;
          case "tone":
            u.gain.setTargetAtTime(C / 10, b, 0.02);
            break;
          case "mix":
            p.gain.setTargetAtTime(1 - C, b, 0.02), g.gain.setTargetAtTime(C, b, 0.02);
            break;
        }
      },
      setBypass(x, C) {
        x ? (h.gain.setTargetAtTime(0, C, 0.02), w.gain.setTargetAtTime(1, C, 0.02)) : (h.gain.setTargetAtTime(1, C, 0.02), w.gain.setTargetAtTime(0, C, 0.02));
      },
      dispose() {
        l.disconnect(), c.disconnect(), u.disconnect(), p.disconnect(), g.disconnect(), h.disconnect(), w.disconnect(), m.disconnect();
      }
    };
  }
};
function L0({ id: e, data: r }) {
  const o = pe((p) => p.updateParameter), s = pe((p) => p.toggleBypass), i = r.parameters.drive ?? 30, l = r.parameters.tone ?? 0, c = r.parameters.mix ?? 1, u = [
    "daw-node daw-node--effect",
    r.bypassed ? "daw-node--bypassed" : ""
  ].join(" ");
  return /* @__PURE__ */ f.jsxs("div", { className: u, children: [
    /* @__PURE__ */ f.jsx(oe, { type: "target", position: Q.Left, id: "in", className: "daw-handle daw-handle--audio daw-handle--stereo" }),
    /* @__PURE__ */ f.jsxs("div", { className: "daw-node__header", children: [
      /* @__PURE__ */ f.jsx("span", { children: "Tape Sat" }),
      /* @__PURE__ */ f.jsx("div", { className: "daw-node__sm-buttons", children: /* @__PURE__ */ f.jsx(
        "button",
        {
          className: `daw-node__sm-btn daw-node__sm-btn--bypass ${r.bypassed ? "active" : ""}`,
          onClick: (p) => {
            p.stopPropagation(), s(e);
          },
          title: "Bypass",
          children: "B"
        }
      ) })
    ] }),
    /* @__PURE__ */ f.jsxs("div", { className: "daw-node__body nodrag nowheel", children: [
      /* @__PURE__ */ f.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ f.jsx("span", { className: "daw-node__param-label", children: "Drive" }),
        /* @__PURE__ */ f.jsx(
          ye,
          {
            min: 0,
            max: 100,
            step: 1,
            value: i,
            onChange: (p) => o(e, "drive", p)
          }
        ),
        /* @__PURE__ */ f.jsxs("span", { className: "daw-node__param-value", children: [
          i.toFixed(0),
          "%"
        ] })
      ] }),
      /* @__PURE__ */ f.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ f.jsx("span", { className: "daw-node__param-label", children: "Tone" }),
        /* @__PURE__ */ f.jsx(
          ye,
          {
            min: -100,
            max: 100,
            step: 1,
            value: l,
            onChange: (p) => o(e, "tone", p)
          }
        ),
        /* @__PURE__ */ f.jsxs("span", { className: "daw-node__param-value", children: [
          l > 0 ? "+" : "",
          l.toFixed(0)
        ] })
      ] }),
      /* @__PURE__ */ f.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ f.jsx("span", { className: "daw-node__param-label", children: "Mix" }),
        /* @__PURE__ */ f.jsx(
          ye,
          {
            min: 0,
            max: 1,
            step: 0.01,
            value: c,
            onChange: (p) => o(e, "mix", p)
          }
        ),
        /* @__PURE__ */ f.jsxs("span", { className: "daw-node__param-value", children: [
          (c * 100).toFixed(0),
          "%"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ f.jsx(oe, { type: "source", position: Q.Right, id: "out", className: "daw-handle daw-handle--audio daw-handle--stereo" })
  ] });
}
const K0 = {
  type: "pan",
  label: "Pan",
  category: "utility",
  ports: [
    { id: "in", label: "Audio In", direction: "input", signalType: "audio", channelFormat: "stereo" },
    { id: "out", label: "Output", direction: "output", signalType: "audio", channelFormat: "stereo" }
  ],
  parameters: [
    { id: "pan", label: "Pan", min: -1, max: 1, defaultValue: 0, step: 0.01, unit: "", mapping: "linear" }
  ]
}, Z0 = {
  create(e, r) {
    const o = r.pan ?? 0, s = e.createGain();
    s.gain.value = 1;
    const i = e.createStereoPanner();
    i.pan.value = o;
    const l = e.createGain();
    l.gain.value = 1;
    const c = e.createGain();
    c.gain.value = 1;
    const u = e.createGain();
    return u.gain.value = 0, s.connect(i), i.connect(c), c.connect(l), s.connect(u), u.connect(l), {
      inputs: { in: s },
      outputs: { out: l },
      setParameter(p, g, m) {
        p === "pan" && i.pan.setTargetAtTime(g, m, 0.02);
      },
      setBypass(p, g) {
        p ? (c.gain.setTargetAtTime(0, g, 0.02), u.gain.setTargetAtTime(1, g, 0.02)) : (c.gain.setTargetAtTime(1, g, 0.02), u.gain.setTargetAtTime(0, g, 0.02));
      },
      dispose() {
        s.disconnect(), i.disconnect(), c.disconnect(), u.disconnect(), l.disconnect();
      }
    };
  }
};
function Y0({ id: e, data: r }) {
  const o = pe((u) => u.updateParameter), s = pe((u) => u.toggleBypass), i = r.parameters.pan ?? 0, l = (u) => Math.abs(u) < 0.01 ? "C" : u < 0 ? `L${Math.abs(Math.round(u * 100))}` : `R${Math.round(u * 100)}`, c = ["daw-node daw-node--utility", r.bypassed ? "daw-node--bypassed" : ""].join(" ");
  return /* @__PURE__ */ f.jsxs("div", { className: c, children: [
    /* @__PURE__ */ f.jsx(oe, { type: "target", position: Q.Left, id: "in", className: "daw-handle daw-handle--audio daw-handle--stereo" }),
    /* @__PURE__ */ f.jsxs("div", { className: "daw-node__header", children: [
      /* @__PURE__ */ f.jsx("span", { children: "Pan" }),
      /* @__PURE__ */ f.jsx("div", { className: "daw-node__sm-buttons", children: /* @__PURE__ */ f.jsx(
        "button",
        {
          className: `daw-node__sm-btn daw-node__sm-btn--bypass ${r.bypassed ? "active" : ""}`,
          onClick: (u) => {
            u.stopPropagation(), s(e);
          },
          title: "Bypass",
          children: "B"
        }
      ) })
    ] }),
    /* @__PURE__ */ f.jsx("div", { className: "daw-node__body nodrag nowheel", children: /* @__PURE__ */ f.jsxs("label", { className: "daw-node__param", children: [
      /* @__PURE__ */ f.jsx("span", { className: "daw-node__param-label", children: "Pan" }),
      /* @__PURE__ */ f.jsx(
        ye,
        {
          min: -1,
          max: 1,
          step: 0.01,
          value: i,
          onChange: (u) => o(e, "pan", u)
        }
      ),
      /* @__PURE__ */ f.jsx("span", { className: "daw-node__param-value", children: l(i) })
    ] }) }),
    /* @__PURE__ */ f.jsx(oe, { type: "source", position: Q.Right, id: "out", className: "daw-handle daw-handle--audio daw-handle--stereo" })
  ] });
}
const U0 = {
  type: "mono-sum",
  label: "Mono Sum",
  category: "utility",
  ports: [
    { id: "in", label: "Stereo In", direction: "input", signalType: "audio", channelFormat: "stereo" },
    { id: "out", label: "Mono Out", direction: "output", signalType: "audio", channelFormat: "mono" }
  ],
  parameters: []
}, $0 = {
  create(e) {
    const r = e.createGain();
    r.gain.value = 1;
    const o = e.createChannelMerger(1), s = e.createGain();
    s.gain.value = 0.707;
    const i = e.createGain();
    return i.gain.value = 1, r.connect(s), s.connect(o), o.connect(i), {
      inputs: { in: r },
      outputs: { out: i },
      setParameter() {
      },
      dispose() {
        r.disconnect(), s.disconnect(), o.disconnect(), i.disconnect();
      }
    };
  }
};
function Q0(e) {
  return /* @__PURE__ */ f.jsxs("div", { className: "daw-node daw-node--utility", style: { minWidth: 100 }, children: [
    /* @__PURE__ */ f.jsx(oe, { type: "target", position: Q.Left, id: "in", className: "daw-handle daw-handle--audio daw-handle--stereo" }),
    /* @__PURE__ */ f.jsx("div", { className: "daw-node__header", children: /* @__PURE__ */ f.jsx("span", { children: "Mono Sum" }) }),
    /* @__PURE__ */ f.jsx("div", { className: "daw-node__body", style: { padding: "4px 8px", fontSize: "10px", color: "var(--daw-text-label)" }, children: "L+R → M" }),
    /* @__PURE__ */ f.jsx(oe, { type: "source", position: Q.Right, id: "out", className: "daw-handle daw-handle--audio daw-handle--mono" })
  ] });
}
const J0 = {
  type: "phase-invert",
  label: "Phase Inv",
  category: "utility",
  ports: [
    { id: "in", label: "Audio In", direction: "input", signalType: "audio", channelFormat: "stereo" },
    { id: "out", label: "Output", direction: "output", signalType: "audio", channelFormat: "stereo" }
  ],
  parameters: [
    { id: "invertL", label: "Invert L", min: 0, max: 1, defaultValue: 1, step: 1, unit: "", mapping: "linear" },
    { id: "invertR", label: "Invert R", min: 0, max: 1, defaultValue: 1, step: 1, unit: "", mapping: "linear" }
  ]
}, q0 = {
  create(e, r) {
    const o = r.invertL ?? 1, s = r.invertR ?? 1, i = e.createGain();
    i.gain.value = 1;
    const l = e.createChannelSplitter(2), c = e.createChannelMerger(2), u = e.createGain();
    u.gain.value = o ? -1 : 1;
    const p = e.createGain();
    p.gain.value = s ? -1 : 1;
    const g = e.createGain();
    return g.gain.value = 1, i.connect(l), l.connect(u, 0), l.connect(p, 1), u.connect(c, 0, 0), p.connect(c, 0, 1), c.connect(g), {
      inputs: { in: i },
      outputs: { out: g },
      setParameter(m, h, w) {
        m === "invertL" ? u.gain.setTargetAtTime(h ? -1 : 1, w, 0.02) : m === "invertR" && p.gain.setTargetAtTime(h ? -1 : 1, w, 0.02);
      },
      dispose() {
        i.disconnect(), l.disconnect(), u.disconnect(), p.disconnect(), c.disconnect(), g.disconnect();
      }
    };
  }
};
function ey({ id: e, data: r }) {
  const o = pe((l) => l.updateParameter), s = r.parameters.invertL ?? 1, i = r.parameters.invertR ?? 1;
  return /* @__PURE__ */ f.jsxs("div", { className: "daw-node daw-node--utility", style: { minWidth: 120 }, children: [
    /* @__PURE__ */ f.jsx(oe, { type: "target", position: Q.Left, id: "in", className: "daw-handle daw-handle--audio daw-handle--stereo" }),
    /* @__PURE__ */ f.jsx("div", { className: "daw-node__header", children: /* @__PURE__ */ f.jsx("span", { children: "Phase Inv" }) }),
    /* @__PURE__ */ f.jsxs("div", { className: "daw-node__body nodrag", style: { display: "flex", gap: 8, padding: "6px 8px" }, children: [
      /* @__PURE__ */ f.jsx(
        "button",
        {
          className: `daw-node__sm-btn ${s ? "active" : ""}`,
          onClick: (l) => {
            l.stopPropagation(), o(e, "invertL", s ? 0 : 1);
          },
          style: { fontSize: "10px", padding: "3px 6px" },
          title: "Invert Left Channel",
          children: "Ø L"
        }
      ),
      /* @__PURE__ */ f.jsx(
        "button",
        {
          className: `daw-node__sm-btn ${i ? "active" : ""}`,
          onClick: (l) => {
            l.stopPropagation(), o(e, "invertR", i ? 0 : 1);
          },
          style: { fontSize: "10px", padding: "3px 6px" },
          title: "Invert Right Channel",
          children: "Ø R"
        }
      )
    ] }),
    /* @__PURE__ */ f.jsx(oe, { type: "source", position: Q.Right, id: "out", className: "daw-handle daw-handle--audio daw-handle--stereo" })
  ] });
}
const ty = {
  type: "dc-offset",
  label: "DC Remove",
  category: "utility",
  ports: [
    { id: "in", label: "Audio In", direction: "input", signalType: "audio", channelFormat: "stereo" },
    { id: "out", label: "Output", direction: "output", signalType: "audio", channelFormat: "stereo" }
  ],
  parameters: []
}, ny = {
  create(e) {
    const r = e.createGain();
    r.gain.value = 1;
    const o = e.createBiquadFilter();
    o.type = "highpass", o.frequency.value = 5, o.Q.value = 0.707;
    const s = e.createGain();
    return s.gain.value = 1, r.connect(o), o.connect(s), {
      inputs: { in: r },
      outputs: { out: s },
      setParameter() {
      },
      dispose() {
        r.disconnect(), o.disconnect(), s.disconnect();
      }
    };
  }
};
function ry(e) {
  return /* @__PURE__ */ f.jsxs("div", { className: "daw-node daw-node--utility", style: { minWidth: 100 }, children: [
    /* @__PURE__ */ f.jsx(oe, { type: "target", position: Q.Left, id: "in", className: "daw-handle daw-handle--audio daw-handle--stereo" }),
    /* @__PURE__ */ f.jsx("div", { className: "daw-node__header", children: /* @__PURE__ */ f.jsx("span", { children: "DC Remove" }) }),
    /* @__PURE__ */ f.jsx("div", { className: "daw-node__body", style: { padding: "4px 8px", fontSize: "10px", color: "var(--daw-text-label)" }, children: "HPF @ 5 Hz" }),
    /* @__PURE__ */ f.jsx(oe, { type: "source", position: Q.Right, id: "out", className: "daw-handle daw-handle--audio daw-handle--stereo" })
  ] });
}
const oy = {
  type: "ab-compare",
  label: "A/B",
  category: "utility",
  ports: [
    { id: "a", label: "Input A", direction: "input", signalType: "audio", channelFormat: "stereo" },
    { id: "b", label: "Input B", direction: "input", signalType: "audio", channelFormat: "stereo" },
    { id: "out", label: "Output", direction: "output", signalType: "audio", channelFormat: "stereo" }
  ],
  parameters: [
    { id: "select", label: "Select", min: 0, max: 1, defaultValue: 0, step: 1, unit: "", mapping: "linear" }
  ]
}, ay = {
  create(e, r) {
    const o = r.select ?? 0, s = e.createGain();
    s.gain.value = o === 0 ? 1 : 0;
    const i = e.createGain();
    i.gain.value = o === 1 ? 1 : 0;
    const l = e.createGain();
    return l.gain.value = 1, s.connect(l), i.connect(l), {
      inputs: { a: s, b: i },
      outputs: { out: l },
      setParameter(c, u, p) {
        if (c === "select") {
          const g = u >= 0.5;
          s.gain.setTargetAtTime(g ? 0 : 1, p, 0.02), i.gain.setTargetAtTime(g ? 1 : 0, p, 0.02);
        }
      },
      dispose() {
        s.disconnect(), i.disconnect(), l.disconnect();
      }
    };
  }
};
function sy({ id: e, data: r }) {
  const o = pe((c) => c.updateParameter), i = (r.parameters.select ?? 0) >= 0.5, l = R.useCallback(() => {
    o(e, "select", i ? 0 : 1);
  }, [e, i, o]);
  return /* @__PURE__ */ f.jsxs("div", { className: "daw-node daw-node--utility", style: { minWidth: 100 }, children: [
    /* @__PURE__ */ f.jsx(
      oe,
      {
        type: "target",
        position: Q.Left,
        id: "a",
        className: "daw-handle daw-handle--audio daw-handle--stereo daw-handle--pos-1of2"
      }
    ),
    /* @__PURE__ */ f.jsx(
      oe,
      {
        type: "target",
        position: Q.Left,
        id: "b",
        className: "daw-handle daw-handle--audio daw-handle--stereo daw-handle--pos-2of2"
      }
    ),
    /* @__PURE__ */ f.jsx("div", { className: "daw-node__header", children: /* @__PURE__ */ f.jsx("span", { children: "A/B" }) }),
    /* @__PURE__ */ f.jsx("div", { className: "daw-node__body nodrag", style: { display: "flex", justifyContent: "center", padding: "8px" }, children: /* @__PURE__ */ f.jsx(
      "button",
      {
        onClick: (c) => {
          c.stopPropagation(), l();
        },
        style: {
          fontSize: "16px",
          fontWeight: 700,
          padding: "6px 16px",
          background: i ? "var(--daw-accent)" : "var(--daw-success)",
          color: "#fff",
          border: "none",
          borderRadius: 4,
          cursor: "pointer"
        },
        children: i ? "B" : "A"
      }
    ) }),
    /* @__PURE__ */ f.jsx(oe, { type: "source", position: Q.Right, id: "out", className: "daw-handle daw-handle--audio daw-handle--stereo" })
  ] });
}
const iy = {
  type: "oscilloscope",
  label: "Oscilloscope",
  category: "utility",
  ports: [
    { id: "in", label: "Audio In", direction: "input", signalType: "audio", channelFormat: "stereo" },
    { id: "out", label: "Thru", direction: "output", signalType: "audio", channelFormat: "stereo" }
  ],
  parameters: []
}, ly = {
  create(e) {
    const r = e.createGain();
    r.gain.value = 1;
    const o = e.createAnalyser();
    o.fftSize = 2048;
    const s = e.createGain();
    return s.gain.value = 1, r.connect(o), o.connect(s), {
      inputs: { in: r },
      outputs: { out: s },
      setParameter() {
      },
      getAnalyserNode() {
        return o;
      },
      dispose() {
        r.disconnect(), o.disconnect(), s.disconnect();
      }
    };
  }
};
function cy({ id: e }) {
  const r = R.useRef(null), o = R.useRef(0), s = R.useCallback(() => {
    var h;
    const i = r.current;
    if (!i) {
      o.current = requestAnimationFrame(s);
      return;
    }
    const l = i.getContext("2d");
    if (!l) {
      o.current = requestAnimationFrame(s);
      return;
    }
    const c = $t(), u = c == null ? void 0 : c.getProcessor(e), p = (h = u == null ? void 0 : u.getAnalyserNode) == null ? void 0 : h.call(u), g = i.width, m = i.height;
    if (l.fillStyle = "#111", l.fillRect(0, 0, g, m), p) {
      const w = p.frequencyBinCount, I = new Float32Array(w);
      p.getFloatTimeDomainData(I), l.strokeStyle = "#22c55e", l.lineWidth = 1.5, l.beginPath();
      const x = g / w;
      let C = 0;
      for (let b = 0; b < w; b++) {
        const N = (1 - I[b]) * m / 2;
        b === 0 ? l.moveTo(C, N) : l.lineTo(C, N), C += x;
      }
      l.stroke();
    }
    l.strokeStyle = "#333", l.lineWidth = 0.5, l.beginPath(), l.moveTo(0, m / 2), l.lineTo(g, m / 2), l.stroke(), o.current = requestAnimationFrame(s);
  }, [e]);
  return R.useEffect(() => (o.current = requestAnimationFrame(s), () => cancelAnimationFrame(o.current)), [s]), /* @__PURE__ */ f.jsxs("div", { className: "daw-node daw-node--utility", style: { minWidth: 200 }, children: [
    /* @__PURE__ */ f.jsx(oe, { type: "target", position: Q.Left, id: "in", className: "daw-handle daw-handle--audio daw-handle--stereo" }),
    /* @__PURE__ */ f.jsx("div", { className: "daw-node__header", children: /* @__PURE__ */ f.jsx("span", { children: "Oscilloscope" }) }),
    /* @__PURE__ */ f.jsx("div", { className: "daw-node__body nodrag nowheel", style: { padding: 4 }, children: /* @__PURE__ */ f.jsx("canvas", { ref: r, width: 180, height: 80, style: { display: "block", borderRadius: 3 } }) }),
    /* @__PURE__ */ f.jsx(oe, { type: "source", position: Q.Right, id: "out", className: "daw-handle daw-handle--audio daw-handle--stereo" })
  ] });
}
const uy = {
  type: "correlation-meter",
  label: "Correlation",
  category: "utility",
  ports: [
    { id: "in", label: "Stereo In", direction: "input", signalType: "audio", channelFormat: "stereo" },
    { id: "out", label: "Thru", direction: "output", signalType: "audio", channelFormat: "stereo" }
  ],
  parameters: []
}, dy = {
  create(e) {
    const r = e.createGain();
    r.gain.value = 1;
    const o = e.createChannelSplitter(2), s = e.createAnalyser();
    s.fftSize = 2048;
    const i = e.createAnalyser();
    i.fftSize = 2048;
    const l = e.createGain();
    l.gain.value = 1, r.connect(o), o.connect(s, 0), o.connect(i, 1), r.connect(l);
    const c = {
      inputs: { in: r },
      outputs: { out: l },
      setParameter() {
      },
      getAnalyserNode() {
        return s;
      },
      dispose() {
        r.disconnect(), o.disconnect(), s.disconnect(), i.disconnect(), l.disconnect();
      }
    };
    return c.getAnalyserNodes = () => ({ left: s, right: i }), c;
  }
};
function nA(e, r) {
  let o = 0, s = 0, i = 0;
  const l = Math.min(e.length, r.length);
  for (let u = 0; u < l; u++)
    o += e[u] * r[u], s += e[u] * e[u], i += r[u] * r[u];
  const c = Math.sqrt(s * i);
  return c > 1e-10 ? o / c : 0;
}
function fy({ id: e }) {
  const r = R.useRef(null), o = R.useRef(0), s = R.useCallback(() => {
    var x;
    const i = r.current;
    if (!i) {
      o.current = requestAnimationFrame(s);
      return;
    }
    const l = i.getContext("2d");
    if (!l) {
      o.current = requestAnimationFrame(s);
      return;
    }
    const c = i.width, u = i.height;
    l.fillStyle = "#111", l.fillRect(0, 0, c, u);
    const p = $t(), g = p == null ? void 0 : p.getProcessor(e), m = (x = g == null ? void 0 : g.getAnalyserNodes) == null ? void 0 : x.call(g);
    let h = 0;
    if (m) {
      const C = m.left.frequencyBinCount, b = new Float32Array(C), N = new Float32Array(C);
      m.left.getFloatTimeDomainData(b), m.right.getFloatTimeDomainData(N), h = nA(b, N);
    }
    const w = (h + 1) / 2 * c, I = h > 0 ? "#22c55e" : h < -0.5 ? "#ef4444" : "#f59e0b";
    l.fillStyle = I, l.fillRect(c / 2, 4, w - c / 2, u - 8), l.strokeStyle = "#666", l.lineWidth = 1, l.beginPath(), l.moveTo(c / 2, 0), l.lineTo(c / 2, u), l.stroke(), l.fillStyle = "#999", l.font = "9px monospace", l.textAlign = "left", l.fillText("-1", 2, u - 2), l.textAlign = "right", l.fillText("+1", c - 2, u - 2), l.textAlign = "center", l.fillStyle = "#fff", l.fillText(h.toFixed(2), c / 2, u - 2), o.current = requestAnimationFrame(s);
  }, [e]);
  return R.useEffect(() => (o.current = requestAnimationFrame(s), () => cancelAnimationFrame(o.current)), [s]), /* @__PURE__ */ f.jsxs("div", { className: "daw-node daw-node--utility", style: { minWidth: 180 }, children: [
    /* @__PURE__ */ f.jsx(oe, { type: "target", position: Q.Left, id: "in", className: "daw-handle daw-handle--audio daw-handle--stereo" }),
    /* @__PURE__ */ f.jsx("div", { className: "daw-node__header", children: /* @__PURE__ */ f.jsx("span", { children: "Correlation" }) }),
    /* @__PURE__ */ f.jsx("div", { className: "daw-node__body nodrag nowheel", style: { padding: 4 }, children: /* @__PURE__ */ f.jsx("canvas", { ref: r, width: 170, height: 24, style: { display: "block", borderRadius: 3 } }) }),
    /* @__PURE__ */ f.jsx(oe, { type: "source", position: Q.Right, id: "out", className: "daw-handle daw-handle--audio daw-handle--stereo" })
  ] });
}
const py = {
  type: "loudness-meter",
  label: "Loudness",
  category: "utility",
  ports: [
    { id: "in", label: "Stereo In", direction: "input", signalType: "audio", channelFormat: "stereo" },
    { id: "out", label: "Thru", direction: "output", signalType: "audio", channelFormat: "stereo" }
  ],
  parameters: []
}, gy = {
  create(e) {
    const r = e.createGain();
    r.gain.value = 1;
    const o = e.createBiquadFilter();
    o.type = "highshelf", o.frequency.value = 1500, o.gain.value = 4;
    const s = e.createBiquadFilter();
    s.type = "highpass", s.frequency.value = 38, s.Q.value = 0.5;
    const i = e.createAnalyser();
    i.fftSize = 2048;
    const l = e.createGain();
    return l.gain.value = 1, r.connect(o), o.connect(s), s.connect(i), r.connect(l), {
      inputs: { in: r },
      outputs: { out: l },
      setParameter() {
      },
      getAnalyserNode() {
        return i;
      },
      dispose() {
        r.disconnect(), o.disconnect(), s.disconnect(), i.disconnect(), l.disconnect();
      }
    };
  }
};
function my({ id: e }) {
  const r = R.useRef(null), o = R.useRef(null), s = R.useRef(null), i = R.useRef(0), l = R.useRef(-70), c = R.useRef([]), u = R.useCallback(() => {
    var h;
    const p = $t(), g = p == null ? void 0 : p.getProcessor(e), m = (h = g == null ? void 0 : g.getAnalyserNode) == null ? void 0 : h.call(g);
    if (m) {
      const w = m.frequencyBinCount, I = new Float32Array(w);
      m.getFloatTimeDomainData(I);
      let x = 0;
      for (let k = 0; k < w; k++)
        x += I[k] * I[k];
      const C = Math.sqrt(x / w), b = C > 1e-10 ? 20 * Math.log10(C) - 0.691 : -70;
      c.current.push(b), c.current.length > 90 && c.current.shift();
      const N = c.current.reduce((k, A) => k + A, 0) / c.current.length;
      if (l.current = l.current * 0.99 + b * 0.01, r.current && (r.current.textContent = `M: ${b > -60 ? b.toFixed(1) : "-inf"} LUFS`), o.current && (o.current.textContent = `S: ${N > -60 ? N.toFixed(1) : "-inf"} LUFS`), s.current) {
        const k = Math.max(0, Math.min(100, (b + 60) / 60 * 100));
        s.current.style.width = `${k}%`, s.current.style.background = b > -14 ? "#ef4444" : b > -23 ? "#f59e0b" : "#22c55e";
      }
    }
    i.current = requestAnimationFrame(u);
  }, [e]);
  return R.useEffect(() => (i.current = requestAnimationFrame(u), () => cancelAnimationFrame(i.current)), [u]), /* @__PURE__ */ f.jsxs("div", { className: "daw-node daw-node--utility", style: { minWidth: 160 }, children: [
    /* @__PURE__ */ f.jsx(oe, { type: "target", position: Q.Left, id: "in", className: "daw-handle daw-handle--audio daw-handle--stereo" }),
    /* @__PURE__ */ f.jsx("div", { className: "daw-node__header", children: /* @__PURE__ */ f.jsx("span", { children: "Loudness" }) }),
    /* @__PURE__ */ f.jsxs("div", { className: "daw-node__body nodrag nowheel", style: { padding: "4px 6px", fontSize: "9px", fontFamily: "monospace" }, children: [
      /* @__PURE__ */ f.jsx("div", { style: { background: "#111", borderRadius: 3, height: 8, marginBottom: 4, overflow: "hidden" }, children: /* @__PURE__ */ f.jsx("div", { ref: s, style: { height: "100%", width: "0%", transition: "width 0.1s" } }) }),
      /* @__PURE__ */ f.jsx("div", { children: /* @__PURE__ */ f.jsx("span", { ref: r, children: "M: -inf LUFS" }) }),
      /* @__PURE__ */ f.jsx("div", { children: /* @__PURE__ */ f.jsx("span", { ref: o, children: "S: -inf LUFS" }) })
    ] }),
    /* @__PURE__ */ f.jsx(oe, { type: "source", position: Q.Right, id: "out", className: "daw-handle daw-handle--audio daw-handle--stereo" })
  ] });
}
const hy = {
  type: "port-node",
  label: "Port",
  category: "io",
  ports: [
    { id: "in", label: "In", direction: "input", signalType: "audio", channelFormat: "stereo" },
    { id: "out", label: "Out", direction: "output", signalType: "audio", channelFormat: "stereo" }
  ],
  parameters: [],
  singleton: !1,
  internal: !0
}, yy = {
  create(e) {
    const r = e.createGain();
    return r.gain.value = 1, {
      inputs: { in: r },
      outputs: { out: r },
      setParameter() {
      },
      dispose() {
        r.disconnect();
      }
    };
  }
};
function wy({ data: e }) {
  const r = e.portDirection === "input", o = e.label || "Port";
  return /* @__PURE__ */ f.jsxs("div", { className: `daw-port-node daw-port-node--${r ? "input" : "output"}`, children: [
    !r && /* @__PURE__ */ f.jsx(
      oe,
      {
        type: "target",
        position: Q.Left,
        id: "in",
        className: "daw-handle daw-handle--audio daw-handle--stereo"
      }
    ),
    /* @__PURE__ */ f.jsx("div", { className: "daw-port-node__label", children: o }),
    r && /* @__PURE__ */ f.jsx(
      oe,
      {
        type: "source",
        position: Q.Right,
        id: "out",
        className: "daw-handle daw-handle--audio daw-handle--stereo"
      }
    )
  ] });
}
const vy = {
  type: "envelope-detector",
  label: "Envelope Detector",
  category: "effect",
  ports: [
    { id: "in", label: "Audio In", direction: "input", signalType: "audio", channelFormat: "mono" },
    { id: "out", label: "Envelope", direction: "output", signalType: "audio", channelFormat: "mono" }
  ],
  parameters: [
    { id: "attack", label: "Attack", min: 1e-3, max: 0.1, defaultValue: 3e-3, step: 1e-3, unit: "s", mapping: "log" },
    { id: "release", label: "Release", min: 0.01, max: 1, defaultValue: 0.25, step: 0.01, unit: "s", mapping: "log" }
  ],
  internal: !0,
  composition: {
    level: 1,
    isAtomic: !1
    // Level 2/3 decomposition deferred to a later phase.
    // For now this uses a single AudioWorklet processor.
  }
}, xy = {
  create(e, r) {
    const o = new AudioWorkletNode(e, "envelope-detector-processor", {
      numberOfInputs: 1,
      numberOfOutputs: 1,
      outputChannelCount: [1],
      parameterData: {
        attack: r.attack ?? 3e-3,
        release: r.release ?? 0.25
      }
    }), s = o.parameters.get("attack"), i = o.parameters.get("release");
    return {
      inputs: { in: o },
      outputs: { out: o },
      setParameter(l, c, u) {
        switch (l) {
          case "attack":
            s.setTargetAtTime(c, u, 0.02);
            break;
          case "release":
            i.setTargetAtTime(c, u, 0.02);
            break;
        }
      },
      dispose() {
        o.disconnect();
      }
    };
  }
};
function Iy({ id: e, data: r }) {
  const o = pe((l) => l.updateParameter), s = r.parameters.attack ?? 3e-3, i = r.parameters.release ?? 0.25;
  return /* @__PURE__ */ f.jsxs("div", { className: "daw-node daw-node--effect", style: { minWidth: 160 }, children: [
    /* @__PURE__ */ f.jsx(
      oe,
      {
        type: "target",
        position: Q.Left,
        id: "in",
        className: "daw-handle daw-handle--audio"
      }
    ),
    /* @__PURE__ */ f.jsx("div", { className: "daw-node__header", children: /* @__PURE__ */ f.jsx("span", { children: "Env Detector" }) }),
    /* @__PURE__ */ f.jsxs("div", { className: "daw-node__body nodrag nowheel", children: [
      /* @__PURE__ */ f.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ f.jsx("span", { className: "daw-node__param-label", children: "Attack" }),
        /* @__PURE__ */ f.jsx(
          ye,
          {
            min: 1e-3,
            max: 0.1,
            step: 1e-3,
            value: s,
            onChange: (l) => o(e, "attack", l)
          }
        ),
        /* @__PURE__ */ f.jsxs("span", { className: "daw-node__param-value", children: [
          (s * 1e3).toFixed(1),
          " ms"
        ] })
      ] }),
      /* @__PURE__ */ f.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ f.jsx("span", { className: "daw-node__param-label", children: "Release" }),
        /* @__PURE__ */ f.jsx(
          ye,
          {
            min: 0.01,
            max: 1,
            step: 0.01,
            value: i,
            onChange: (l) => o(e, "release", l)
          }
        ),
        /* @__PURE__ */ f.jsxs("span", { className: "daw-node__param-value", children: [
          (i * 1e3).toFixed(0),
          " ms"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ f.jsx(
      oe,
      {
        type: "source",
        position: Q.Right,
        id: "out",
        className: "daw-handle daw-handle--audio"
      }
    )
  ] });
}
const Cy = {
  type: "gain-computer",
  label: "Gain Computer",
  category: "effect",
  ports: [
    { id: "in", label: "Level (dB)", direction: "input", signalType: "audio", channelFormat: "mono" },
    { id: "out", label: "GR (dB)", direction: "output", signalType: "audio", channelFormat: "mono" }
  ],
  parameters: [
    { id: "threshold", label: "Threshold", min: -60, max: 0, defaultValue: -18, step: 0.5, unit: "dB", mapping: "linear" },
    { id: "ratio", label: "Ratio", min: 1, max: 20, defaultValue: 4, step: 0.5, unit: ":1", mapping: "linear" }
  ],
  internal: !0,
  composition: {
    level: 1,
    isAtomic: !1
    // Level 2/3 decomposition deferred to a later phase.
  }
}, by = {
  create(e, r) {
    const o = new AudioWorkletNode(e, "gain-computer-processor", {
      numberOfInputs: 1,
      numberOfOutputs: 1,
      outputChannelCount: [1],
      parameterData: {
        threshold: r.threshold ?? -18,
        ratio: r.ratio ?? 4
      }
    }), s = o.parameters.get("threshold"), i = o.parameters.get("ratio");
    return {
      inputs: { in: o },
      outputs: { out: o },
      setParameter(l, c, u) {
        switch (l) {
          case "threshold":
            s.setTargetAtTime(c, u, 0.02);
            break;
          case "ratio":
            i.setTargetAtTime(c, u, 0.02);
            break;
        }
      },
      dispose() {
        o.disconnect();
      }
    };
  }
};
function Ny({ id: e, data: r }) {
  const o = pe((l) => l.updateParameter), s = r.parameters.threshold ?? -18, i = r.parameters.ratio ?? 4;
  return /* @__PURE__ */ f.jsxs("div", { className: "daw-node daw-node--effect", style: { minWidth: 160 }, children: [
    /* @__PURE__ */ f.jsx(
      oe,
      {
        type: "target",
        position: Q.Left,
        id: "in",
        className: "daw-handle daw-handle--audio"
      }
    ),
    /* @__PURE__ */ f.jsx("div", { className: "daw-node__header", children: /* @__PURE__ */ f.jsx("span", { children: "Gain Computer" }) }),
    /* @__PURE__ */ f.jsxs("div", { className: "daw-node__body nodrag nowheel", children: [
      /* @__PURE__ */ f.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ f.jsx("span", { className: "daw-node__param-label", children: "Threshold" }),
        /* @__PURE__ */ f.jsx(
          ye,
          {
            min: -60,
            max: 0,
            step: 0.5,
            value: s,
            onChange: (l) => o(e, "threshold", l)
          }
        ),
        /* @__PURE__ */ f.jsxs("span", { className: "daw-node__param-value", children: [
          s.toFixed(1),
          " dB"
        ] })
      ] }),
      /* @__PURE__ */ f.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ f.jsx("span", { className: "daw-node__param-label", children: "Ratio" }),
        /* @__PURE__ */ f.jsx(
          ye,
          {
            min: 1,
            max: 20,
            step: 0.5,
            value: i,
            onChange: (l) => o(e, "ratio", l)
          }
        ),
        /* @__PURE__ */ f.jsxs("span", { className: "daw-node__param-value", children: [
          i.toFixed(1),
          ":1"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ f.jsx(
      oe,
      {
        type: "source",
        position: Q.Right,
        id: "out",
        className: "daw-handle daw-handle--audio"
      }
    )
  ] });
}
const _y = {
  type: "atomic-multiply",
  label: "Multiply",
  category: "atomic",
  ports: [
    { id: "a", label: "A", direction: "input", signalType: "audio", channelFormat: "mono" },
    { id: "b", label: "B", direction: "input", signalType: "audio", channelFormat: "mono" },
    { id: "out", label: "Out", direction: "output", signalType: "audio", channelFormat: "mono" }
  ],
  parameters: [],
  composition: { level: 3, isAtomic: !0 }
}, Ay = {
  create(e) {
    const r = new AudioWorkletNode(e, "multiply-processor", {
      numberOfInputs: 2,
      numberOfOutputs: 1,
      outputChannelCount: [1]
    }), o = e.createGain();
    o.gain.value = 1;
    const s = e.createGain();
    return s.gain.value = 1, o.connect(r, 0, 0), s.connect(r, 0, 1), {
      inputs: { a: o, b: s },
      outputs: { out: r },
      setParameter() {
      },
      dispose() {
        o.disconnect(), s.disconnect(), r.disconnect();
      }
    };
  }
};
function Sy() {
  return /* @__PURE__ */ f.jsxs("div", { className: "daw-node daw-node--atomic", style: { minWidth: 60 }, children: [
    /* @__PURE__ */ f.jsx(
      oe,
      {
        type: "target",
        position: Q.Left,
        id: "a",
        className: "daw-handle daw-handle--audio daw-handle--pos-1of2"
      }
    ),
    /* @__PURE__ */ f.jsx(
      oe,
      {
        type: "target",
        position: Q.Left,
        id: "b",
        className: "daw-handle daw-handle--audio daw-handle--pos-2of2"
      }
    ),
    /* @__PURE__ */ f.jsx("div", { className: "daw-node__header", children: /* @__PURE__ */ f.jsx("span", { children: "Multiply" }) }),
    /* @__PURE__ */ f.jsx("div", { className: "daw-node__body daw-node__symbol", children: "×" }),
    /* @__PURE__ */ f.jsx(
      oe,
      {
        type: "source",
        position: Q.Right,
        id: "out",
        className: "daw-handle daw-handle--audio"
      }
    )
  ] });
}
const ky = {
  type: "atomic-add",
  label: "Add",
  category: "atomic",
  ports: [
    { id: "a", label: "A", direction: "input", signalType: "audio", channelFormat: "mono" },
    { id: "b", label: "B", direction: "input", signalType: "audio", channelFormat: "mono" },
    { id: "out", label: "Out", direction: "output", signalType: "audio", channelFormat: "mono" }
  ],
  parameters: [],
  composition: { level: 3, isAtomic: !0 }
}, jy = {
  create(e) {
    const r = new AudioWorkletNode(e, "add-processor", {
      numberOfInputs: 2,
      numberOfOutputs: 1,
      outputChannelCount: [1]
    }), o = e.createGain();
    o.gain.value = 1;
    const s = e.createGain();
    return s.gain.value = 1, o.connect(r, 0, 0), s.connect(r, 0, 1), {
      inputs: { a: o, b: s },
      outputs: { out: r },
      setParameter() {
      },
      dispose() {
        o.disconnect(), s.disconnect(), r.disconnect();
      }
    };
  }
};
function My() {
  return /* @__PURE__ */ f.jsxs("div", { className: "daw-node daw-node--atomic", style: { minWidth: 60 }, children: [
    /* @__PURE__ */ f.jsx(
      oe,
      {
        type: "target",
        position: Q.Left,
        id: "a",
        className: "daw-handle daw-handle--audio daw-handle--pos-1of2"
      }
    ),
    /* @__PURE__ */ f.jsx(
      oe,
      {
        type: "target",
        position: Q.Left,
        id: "b",
        className: "daw-handle daw-handle--audio daw-handle--pos-2of2"
      }
    ),
    /* @__PURE__ */ f.jsx("div", { className: "daw-node__header", children: /* @__PURE__ */ f.jsx("span", { children: "Add" }) }),
    /* @__PURE__ */ f.jsx("div", { className: "daw-node__body daw-node__symbol", children: "+" }),
    /* @__PURE__ */ f.jsx(
      oe,
      {
        type: "source",
        position: Q.Right,
        id: "out",
        className: "daw-handle daw-handle--audio"
      }
    )
  ] });
}
const Ty = {
  type: "atomic-subtract",
  label: "Subtract",
  category: "atomic",
  ports: [
    { id: "a", label: "A", direction: "input", signalType: "audio", channelFormat: "mono" },
    { id: "b", label: "B", direction: "input", signalType: "audio", channelFormat: "mono" },
    { id: "out", label: "Out", direction: "output", signalType: "audio", channelFormat: "mono" }
  ],
  parameters: [],
  composition: { level: 3, isAtomic: !0 }
}, Ry = {
  create(e) {
    const r = new AudioWorkletNode(e, "subtract-processor", {
      numberOfInputs: 2,
      numberOfOutputs: 1,
      outputChannelCount: [1]
    }), o = e.createGain();
    o.gain.value = 1;
    const s = e.createGain();
    return s.gain.value = 1, o.connect(r, 0, 0), s.connect(r, 0, 1), {
      inputs: { a: o, b: s },
      outputs: { out: r },
      setParameter() {
      },
      dispose() {
        o.disconnect(), s.disconnect(), r.disconnect();
      }
    };
  }
};
function By() {
  return /* @__PURE__ */ f.jsxs("div", { className: "daw-node daw-node--atomic", style: { minWidth: 60 }, children: [
    /* @__PURE__ */ f.jsx(
      oe,
      {
        type: "target",
        position: Q.Left,
        id: "a",
        className: "daw-handle daw-handle--audio daw-handle--pos-1of2"
      }
    ),
    /* @__PURE__ */ f.jsx(
      oe,
      {
        type: "target",
        position: Q.Left,
        id: "b",
        className: "daw-handle daw-handle--audio daw-handle--pos-2of2"
      }
    ),
    /* @__PURE__ */ f.jsx("div", { className: "daw-node__header", children: /* @__PURE__ */ f.jsx("span", { children: "Subtract" }) }),
    /* @__PURE__ */ f.jsx("div", { className: "daw-node__body daw-node__symbol", children: "−" }),
    /* @__PURE__ */ f.jsx(
      oe,
      {
        type: "source",
        position: Q.Right,
        id: "out",
        className: "daw-handle daw-handle--audio"
      }
    )
  ] });
}
const Ey = {
  type: "atomic-abs",
  label: "Abs",
  category: "atomic",
  ports: [
    { id: "in", label: "In", direction: "input", signalType: "audio", channelFormat: "mono" },
    { id: "out", label: "Out", direction: "output", signalType: "audio", channelFormat: "mono" }
  ],
  parameters: [],
  composition: { level: 3, isAtomic: !0 }
}, Dy = {
  create(e) {
    const r = new AudioWorkletNode(e, "abs-processor", {
      numberOfInputs: 1,
      numberOfOutputs: 1,
      outputChannelCount: [1]
    });
    return {
      inputs: { in: r },
      outputs: { out: r },
      setParameter() {
      },
      dispose() {
        r.disconnect();
      }
    };
  }
};
function Gy() {
  return /* @__PURE__ */ f.jsxs("div", { className: "daw-node daw-node--atomic", style: { minWidth: 60 }, children: [
    /* @__PURE__ */ f.jsx(
      oe,
      {
        type: "target",
        position: Q.Left,
        id: "in",
        className: "daw-handle daw-handle--audio"
      }
    ),
    /* @__PURE__ */ f.jsx("div", { className: "daw-node__header", children: /* @__PURE__ */ f.jsx("span", { children: "Abs" }) }),
    /* @__PURE__ */ f.jsx("div", { className: "daw-node__body daw-node__symbol", children: "|x|" }),
    /* @__PURE__ */ f.jsx(
      oe,
      {
        type: "source",
        position: Q.Right,
        id: "out",
        className: "daw-handle daw-handle--audio"
      }
    )
  ] });
}
const Fy = {
  type: "atomic-constant",
  label: "Constant",
  category: "atomic",
  ports: [
    { id: "out", label: "Out", direction: "output", signalType: "audio", channelFormat: "mono" }
  ],
  parameters: [
    { id: "value", label: "Value", min: -1e3, max: 1e3, defaultValue: 0, step: 0.01, mapping: "linear" }
  ],
  composition: { level: 3, isAtomic: !0 }
}, Py = {
  create(e, r) {
    const o = new AudioWorkletNode(e, "constant-processor", {
      numberOfInputs: 0,
      numberOfOutputs: 1,
      outputChannelCount: [1],
      parameterData: { value: r.value ?? 0 }
    }), s = o.parameters.get("value");
    return {
      inputs: {},
      outputs: { out: o },
      setParameter(i, l, c) {
        i === "value" && s.setTargetAtTime(l, c, 0.02);
      },
      dispose() {
        o.disconnect();
      }
    };
  }
};
function zy({ id: e, data: r }) {
  const o = pe((i) => i.updateParameter), s = r.parameters.value ?? 0;
  return /* @__PURE__ */ f.jsxs("div", { className: "daw-node daw-node--atomic", style: { minWidth: 80 }, children: [
    /* @__PURE__ */ f.jsx("div", { className: "daw-node__header", children: /* @__PURE__ */ f.jsx("span", { children: "Const" }) }),
    /* @__PURE__ */ f.jsx("div", { className: "daw-node__body nodrag nowheel", children: /* @__PURE__ */ f.jsxs("label", { className: "daw-node__param", children: [
      /* @__PURE__ */ f.jsx(
        ye,
        {
          min: -1e3,
          max: 1e3,
          step: 0.01,
          value: s,
          onChange: (i) => o(e, "value", i)
        }
      ),
      /* @__PURE__ */ f.jsx("span", { className: "daw-node__param-value", children: s.toFixed(2) })
    ] }) }),
    /* @__PURE__ */ f.jsx(
      oe,
      {
        type: "source",
        position: Q.Right,
        id: "out",
        className: "daw-handle daw-handle--audio"
      }
    )
  ] });
}
const Vy = {
  type: "atomic-max",
  label: "Max",
  category: "atomic",
  ports: [
    { id: "a", label: "A", direction: "input", signalType: "audio", channelFormat: "mono" },
    { id: "b", label: "B", direction: "input", signalType: "audio", channelFormat: "mono" },
    { id: "out", label: "Out", direction: "output", signalType: "audio", channelFormat: "mono" }
  ],
  parameters: [],
  composition: { level: 3, isAtomic: !0 }
}, Oy = {
  create(e) {
    const r = new AudioWorkletNode(e, "max-processor", {
      numberOfInputs: 2,
      numberOfOutputs: 1,
      outputChannelCount: [1]
    }), o = e.createGain();
    o.gain.value = 1;
    const s = e.createGain();
    return s.gain.value = 1, o.connect(r, 0, 0), s.connect(r, 0, 1), {
      inputs: { a: o, b: s },
      outputs: { out: r },
      setParameter() {
      },
      dispose() {
        o.disconnect(), s.disconnect(), r.disconnect();
      }
    };
  }
};
function Hy() {
  return /* @__PURE__ */ f.jsxs("div", { className: "daw-node daw-node--atomic", style: { minWidth: 60 }, children: [
    /* @__PURE__ */ f.jsx(
      oe,
      {
        type: "target",
        position: Q.Left,
        id: "a",
        className: "daw-handle daw-handle--audio daw-handle--pos-1of2"
      }
    ),
    /* @__PURE__ */ f.jsx(
      oe,
      {
        type: "target",
        position: Q.Left,
        id: "b",
        className: "daw-handle daw-handle--audio daw-handle--pos-2of2"
      }
    ),
    /* @__PURE__ */ f.jsx("div", { className: "daw-node__header", children: /* @__PURE__ */ f.jsx("span", { children: "Max" }) }),
    /* @__PURE__ */ f.jsx("div", { className: "daw-node__body daw-node__symbol", children: "max" }),
    /* @__PURE__ */ f.jsx(
      oe,
      {
        type: "source",
        position: Q.Right,
        id: "out",
        className: "daw-handle daw-handle--audio"
      }
    )
  ] });
}
const Wy = {
  type: "atomic-unit-delay",
  label: "Unit Delay",
  category: "atomic",
  ports: [
    { id: "in", label: "In", direction: "input", signalType: "audio", channelFormat: "mono" },
    { id: "out", label: "Out", direction: "output", signalType: "audio", channelFormat: "mono" }
  ],
  parameters: [],
  composition: { level: 3, isAtomic: !0 }
}, Xy = {
  create(e) {
    const r = new AudioWorkletNode(e, "unit-delay-processor", {
      numberOfInputs: 1,
      numberOfOutputs: 1,
      outputChannelCount: [1]
    });
    return {
      inputs: { in: r },
      outputs: { out: r },
      setParameter() {
      },
      dispose() {
        r.disconnect();
      }
    };
  }
};
function Ly() {
  return /* @__PURE__ */ f.jsxs("div", { className: "daw-node daw-node--atomic", style: { minWidth: 60 }, children: [
    /* @__PURE__ */ f.jsx(
      oe,
      {
        type: "target",
        position: Q.Left,
        id: "in",
        className: "daw-handle daw-handle--audio"
      }
    ),
    /* @__PURE__ */ f.jsx("div", { className: "daw-node__header", children: /* @__PURE__ */ f.jsx("span", { children: "Delay" }) }),
    /* @__PURE__ */ f.jsx("div", { className: "daw-node__body daw-node__symbol", children: "z⁻¹" }),
    /* @__PURE__ */ f.jsx(
      oe,
      {
        type: "source",
        position: Q.Right,
        id: "out",
        className: "daw-handle daw-handle--audio"
      }
    )
  ] });
}
const Ky = {
  type: "atomic-selector",
  label: "Selector",
  category: "atomic",
  ports: [
    { id: "a", label: "A", direction: "input", signalType: "audio", channelFormat: "mono" },
    { id: "b", label: "B", direction: "input", signalType: "audio", channelFormat: "mono" },
    { id: "ctrl", label: "Ctrl", direction: "input", signalType: "audio", channelFormat: "mono" },
    { id: "out", label: "Out", direction: "output", signalType: "audio", channelFormat: "mono" }
  ],
  parameters: [],
  composition: { level: 3, isAtomic: !0 }
}, Zy = {
  create(e) {
    const r = new AudioWorkletNode(e, "selector-processor", {
      numberOfInputs: 3,
      numberOfOutputs: 1,
      outputChannelCount: [1]
    }), o = e.createGain();
    o.gain.value = 1;
    const s = e.createGain();
    s.gain.value = 1;
    const i = e.createGain();
    return i.gain.value = 1, o.connect(r, 0, 0), s.connect(r, 0, 1), i.connect(r, 0, 2), {
      inputs: { a: o, b: s, ctrl: i },
      outputs: { out: r },
      setParameter() {
      },
      dispose() {
        o.disconnect(), s.disconnect(), i.disconnect(), r.disconnect();
      }
    };
  }
};
function Yy() {
  return /* @__PURE__ */ f.jsxs("div", { className: "daw-node daw-node--atomic", style: { minWidth: 60 }, children: [
    /* @__PURE__ */ f.jsx(
      oe,
      {
        type: "target",
        position: Q.Left,
        id: "a",
        className: "daw-handle daw-handle--audio daw-handle--pos-1of3"
      }
    ),
    /* @__PURE__ */ f.jsx(
      oe,
      {
        type: "target",
        position: Q.Left,
        id: "b",
        className: "daw-handle daw-handle--audio daw-handle--pos-2of3"
      }
    ),
    /* @__PURE__ */ f.jsx(
      oe,
      {
        type: "target",
        position: Q.Bottom,
        id: "ctrl",
        className: "daw-handle daw-handle--audio daw-handle--pos-3of3"
      }
    ),
    /* @__PURE__ */ f.jsx("div", { className: "daw-node__header", children: /* @__PURE__ */ f.jsx("span", { children: "Select" }) }),
    /* @__PURE__ */ f.jsx("div", { className: "daw-node__body daw-node__symbol", children: "A|B" }),
    /* @__PURE__ */ f.jsx(
      oe,
      {
        type: "source",
        position: Q.Right,
        id: "out",
        className: "daw-handle daw-handle--audio"
      }
    )
  ] });
}
const Uy = {
  type: "atomic-db-to-lin",
  label: "dB→Lin",
  category: "atomic",
  ports: [
    { id: "in", label: "In", direction: "input", signalType: "audio", channelFormat: "mono" },
    { id: "out", label: "Out", direction: "output", signalType: "audio", channelFormat: "mono" }
  ],
  parameters: [],
  composition: { level: 3, isAtomic: !0 }
}, $y = {
  create(e) {
    const r = new AudioWorkletNode(e, "db-to-lin-processor", {
      numberOfInputs: 1,
      numberOfOutputs: 1,
      outputChannelCount: [1]
    });
    return {
      inputs: { in: r },
      outputs: { out: r },
      setParameter() {
      },
      dispose() {
        r.disconnect();
      }
    };
  }
};
function Qy() {
  return /* @__PURE__ */ f.jsxs("div", { className: "daw-node daw-node--atomic", style: { minWidth: 70 }, children: [
    /* @__PURE__ */ f.jsx(
      oe,
      {
        type: "target",
        position: Q.Left,
        id: "in",
        className: "daw-handle daw-handle--audio"
      }
    ),
    /* @__PURE__ */ f.jsx("div", { className: "daw-node__header", children: /* @__PURE__ */ f.jsx("span", { children: "dB→Lin" }) }),
    /* @__PURE__ */ f.jsxs("div", { className: "daw-node__body daw-node__symbol", children: [
      "10",
      /* @__PURE__ */ f.jsx("sup", { children: "x/20" })
    ] }),
    /* @__PURE__ */ f.jsx(
      oe,
      {
        type: "source",
        position: Q.Right,
        id: "out",
        className: "daw-handle daw-handle--audio"
      }
    )
  ] });
}
const Jy = {
  type: "atomic-lin-to-db",
  label: "Lin→dB",
  category: "atomic",
  ports: [
    { id: "in", label: "In", direction: "input", signalType: "audio", channelFormat: "mono" },
    { id: "out", label: "Out", direction: "output", signalType: "audio", channelFormat: "mono" }
  ],
  parameters: [],
  composition: { level: 3, isAtomic: !0 }
}, qy = {
  create(e) {
    const r = new AudioWorkletNode(e, "lin-to-db-processor", {
      numberOfInputs: 1,
      numberOfOutputs: 1,
      outputChannelCount: [1]
    });
    return {
      inputs: { in: r },
      outputs: { out: r },
      setParameter() {
      },
      dispose() {
        r.disconnect();
      }
    };
  }
};
function ew() {
  return /* @__PURE__ */ f.jsxs("div", { className: "daw-node daw-node--atomic", style: { minWidth: 70 }, children: [
    /* @__PURE__ */ f.jsx(
      oe,
      {
        type: "target",
        position: Q.Left,
        id: "in",
        className: "daw-handle daw-handle--audio"
      }
    ),
    /* @__PURE__ */ f.jsx("div", { className: "daw-node__header", children: /* @__PURE__ */ f.jsx("span", { children: "Lin→dB" }) }),
    /* @__PURE__ */ f.jsx("div", { className: "daw-node__body daw-node__symbol", children: "20log" }),
    /* @__PURE__ */ f.jsx(
      oe,
      {
        type: "source",
        position: Q.Right,
        id: "out",
        className: "daw-handle daw-handle--audio"
      }
    )
  ] });
}
const tw = {
  type: "atomic-compare-gt",
  label: "A > B",
  category: "atomic",
  ports: [
    { id: "a", label: "A", direction: "input", signalType: "audio", channelFormat: "mono" },
    { id: "b", label: "B", direction: "input", signalType: "audio", channelFormat: "mono" },
    { id: "out", label: "Out", direction: "output", signalType: "audio", channelFormat: "mono" }
  ],
  parameters: [],
  composition: { level: 3, isAtomic: !0 }
}, nw = {
  create(e) {
    const r = new AudioWorkletNode(e, "compare-gt-processor", {
      numberOfInputs: 2,
      numberOfOutputs: 1,
      outputChannelCount: [1]
    }), o = e.createGain();
    o.gain.value = 1;
    const s = e.createGain();
    return s.gain.value = 1, o.connect(r, 0, 0), s.connect(r, 0, 1), {
      inputs: { a: o, b: s },
      outputs: { out: r },
      setParameter() {
      },
      dispose() {
        o.disconnect(), s.disconnect(), r.disconnect();
      }
    };
  }
};
function rw() {
  return /* @__PURE__ */ f.jsxs("div", { className: "daw-node daw-node--atomic", style: { minWidth: 60 }, children: [
    /* @__PURE__ */ f.jsx(
      oe,
      {
        type: "target",
        position: Q.Left,
        id: "a",
        className: "daw-handle daw-handle--audio daw-handle--pos-1of2"
      }
    ),
    /* @__PURE__ */ f.jsx(
      oe,
      {
        type: "target",
        position: Q.Left,
        id: "b",
        className: "daw-handle daw-handle--audio daw-handle--pos-2of2"
      }
    ),
    /* @__PURE__ */ f.jsx("div", { className: "daw-node__header", children: /* @__PURE__ */ f.jsx("span", { children: "A > B" }) }),
    /* @__PURE__ */ f.jsx("div", { className: "daw-node__body daw-node__symbol", children: ">" }),
    /* @__PURE__ */ f.jsx(
      oe,
      {
        type: "source",
        position: Q.Right,
        id: "out",
        className: "daw-handle daw-handle--audio"
      }
    )
  ] });
}
const ow = {
  type: "atomic-probe",
  label: "Probe",
  category: "atomic",
  ports: [
    { id: "in", label: "In", direction: "input", signalType: "audio", channelFormat: "mono" },
    { id: "out", label: "Out", direction: "output", signalType: "audio", channelFormat: "mono" }
  ],
  parameters: [],
  composition: { level: 3, isAtomic: !0 }
}, aw = {
  create(e) {
    const r = new AudioWorkletNode(e, "probe-processor", {
      numberOfInputs: 1,
      numberOfOutputs: 1,
      outputChannelCount: [1]
    });
    return {
      inputs: { in: r },
      outputs: { out: r },
      setParameter() {
      },
      dispose() {
        r.disconnect();
      }
    };
  }
};
function sw() {
  return /* @__PURE__ */ f.jsxs("div", { className: "daw-node daw-node--atomic", style: { minWidth: 60 }, children: [
    /* @__PURE__ */ f.jsx(
      oe,
      {
        type: "target",
        position: Q.Left,
        id: "in",
        className: "daw-handle daw-handle--audio"
      }
    ),
    /* @__PURE__ */ f.jsx("div", { className: "daw-node__header", children: /* @__PURE__ */ f.jsx("span", { children: "Probe" }) }),
    /* @__PURE__ */ f.jsx("div", { className: "daw-node__body daw-node__symbol", children: "~" }),
    /* @__PURE__ */ f.jsx(
      oe,
      {
        type: "source",
        position: Q.Right,
        id: "out",
        className: "daw-handle daw-handle--audio"
      }
    )
  ] });
}
function iw() {
  Se({
    manifest: jh,
    factory: Mh,
    component: Th
  }), Se({
    manifest: Rh,
    factory: Bh,
    component: Eh
  }), Se({
    manifest: Dh,
    factory: Gh,
    component: Fh
  }), Se({
    manifest: Ph,
    factory: zh,
    component: Vh
  }), Se({
    manifest: Oh,
    factory: Hh,
    component: Wh
  }), Se({
    manifest: Xh,
    factory: Lh,
    component: Kh
  }), Se({
    manifest: Zh,
    factory: Yh,
    component: Uh
  }), Se({
    manifest: $h,
    factory: Qh,
    component: Jh
  }), Se({
    manifest: qh,
    factory: e0,
    component: t0
  }), Se({
    manifest: n0,
    factory: r0,
    component: o0
  }), Se({
    manifest: a0,
    factory: s0,
    component: i0
  }), Se({
    manifest: l0,
    factory: c0,
    component: u0
  }), Se({
    manifest: Fu,
    factory: d0,
    component: f0
  }), Se({
    manifest: p0,
    factory: g0,
    component: m0
  }), Se({
    manifest: h0,
    factory: y0,
    component: w0
  }), Se({
    manifest: v0,
    factory: x0,
    component: I0
  }), Se({
    manifest: C0,
    factory: b0,
    component: N0
  }), Se({
    manifest: _0,
    factory: A0,
    component: S0
  }), Se({
    manifest: k0,
    factory: j0,
    component: M0
  }), Se({
    manifest: T0,
    factory: R0,
    component: B0
  }), Se({
    manifest: E0,
    factory: D0,
    component: G0
  }), Se({
    manifest: F0,
    factory: P0,
    component: z0
  }), Se({
    manifest: V0,
    factory: O0,
    component: H0
  }), Se({
    manifest: W0,
    factory: X0,
    component: L0
  }), Se({
    manifest: K0,
    factory: Z0,
    component: Y0
  }), Se({
    manifest: U0,
    factory: $0,
    component: Q0
  }), Se({
    manifest: J0,
    factory: q0,
    component: ey
  }), Se({
    manifest: ty,
    factory: ny,
    component: ry
  }), Se({
    manifest: oy,
    factory: ay,
    component: sy
  }), Se({
    manifest: iy,
    factory: ly,
    component: cy
  }), Se({
    manifest: uy,
    factory: dy,
    component: fy
  }), Se({
    manifest: py,
    factory: gy,
    component: my
  }), Se({ manifest: hy, factory: yy, component: wy }), Se({ manifest: vy, factory: xy, component: Iy }), Se({ manifest: Cy, factory: by, component: Ny }), Se({ manifest: _y, factory: Ay, component: Sy }), Se({ manifest: ky, factory: jy, component: My }), Se({ manifest: Ty, factory: Ry, component: By }), Se({ manifest: Ey, factory: Dy, component: Gy }), Se({ manifest: Fy, factory: Py, component: zy }), Se({ manifest: Vy, factory: Oy, component: Hy }), Se({ manifest: Wy, factory: Xy, component: Ly }), Se({ manifest: Ky, factory: Zy, component: Yy }), Se({ manifest: Uy, factory: $y, component: Qy }), Se({ manifest: Jy, factory: qy, component: ew }), Se({ manifest: tw, factory: nw, component: rw }), Se({ manifest: ow, factory: aw, component: sw });
}
const lw = {
  "master-output": { manifest: jh, factory: Mh, component: Th },
  "test-tone": { manifest: Rh, factory: Bh, component: Eh },
  gain: { manifest: Dh, factory: Gh, component: Fh },
  track: { manifest: Ph, factory: zh, component: Vh },
  delay: { manifest: Oh, factory: Hh, component: Wh },
  reverb: { manifest: Xh, factory: Lh, component: Kh },
  eq: { manifest: Zh, factory: Yh, component: Uh },
  splitter: { manifest: $h, factory: Qh, component: Jh },
  merger: { manifest: qh, factory: e0, component: t0 },
  mixer: { manifest: n0, factory: r0, component: o0 },
  "level-meter": { manifest: a0, factory: s0, component: i0 },
  "spectrum-analyzer": { manifest: l0, factory: c0, component: u0 },
  compressor: { manifest: Fu, factory: d0, component: f0 },
  limiter: { manifest: p0, factory: g0, component: m0 },
  gate: { manifest: h0, factory: y0, component: w0 },
  expander: { manifest: v0, factory: x0, component: I0 },
  "de-esser": { manifest: C0, factory: b0, component: N0 },
  filter: { manifest: _0, factory: A0, component: S0 },
  chorus: { manifest: k0, factory: j0, component: M0 },
  flanger: { manifest: T0, factory: R0, component: B0 },
  phaser: { manifest: E0, factory: D0, component: G0 },
  waveshaper: { manifest: F0, factory: P0, component: z0 },
  bitcrusher: { manifest: V0, factory: O0, component: H0 },
  "tape-saturation": { manifest: W0, factory: X0, component: L0 },
  pan: { manifest: K0, factory: Z0, component: Y0 },
  "mono-sum": { manifest: U0, factory: $0, component: Q0 },
  "phase-invert": { manifest: J0, factory: q0, component: ey },
  "dc-offset": { manifest: ty, factory: ny, component: ry },
  "ab-compare": { manifest: oy, factory: ay, component: sy },
  oscilloscope: { manifest: iy, factory: ly, component: cy },
  "correlation-meter": { manifest: uy, factory: dy, component: fy },
  "loudness-meter": { manifest: py, factory: gy, component: my },
  "port-node": { manifest: hy, factory: yy, component: wy },
  "envelope-detector": { manifest: vy, factory: xy, component: Iy },
  "gain-computer": { manifest: Cy, factory: by, component: Ny },
  "atomic-multiply": { manifest: _y, factory: Ay, component: Sy },
  "atomic-add": { manifest: ky, factory: jy, component: My },
  "atomic-subtract": { manifest: Ty, factory: Ry, component: By },
  "atomic-abs": { manifest: Ey, factory: Dy, component: Gy },
  "atomic-constant": { manifest: Fy, factory: Py, component: zy },
  "atomic-max": { manifest: Vy, factory: Oy, component: Hy },
  "atomic-unit-delay": { manifest: Wy, factory: Xy, component: Ly },
  "atomic-selector": { manifest: Ky, factory: Zy, component: Yy },
  "atomic-db-to-lin": { manifest: Uy, factory: $y, component: Qy },
  "atomic-lin-to-db": { manifest: Jy, factory: qy, component: ew },
  "atomic-compare-gt": { manifest: tw, factory: nw, component: rw },
  "atomic-probe": { manifest: ow, factory: aw, component: sw }
};
function rA(e) {
  var o;
  const r = new Set(e);
  r.add("port-node");
  for (const s of r) {
    const i = lw[s];
    if ((o = i == null ? void 0 : i.manifest.composition) != null && o.internalGraph)
      for (const l of i.manifest.composition.internalGraph.nodes)
        r.add(l.moduleType);
  }
  return Array.from(r);
}
function oA(e) {
  const r = rA(e);
  for (const o of r) {
    const s = lw[o];
    s ? Se(s) : console.warn(`registerModules: unknown module type "${o}"`);
  }
}
function aA({ title: e, subtitle: r, initialPatch: o, allowedModules: s }) {
  return R.useEffect(() => {
    const { nodes: i, addModule: l, loadPatch: c } = pe.getState();
    if (o) {
      const u = o.nodes.map((g) => {
        const m = ct(g.type), h = {};
        for (const w of m.parameters)
          h[w.id] = w.defaultValue;
        return g.parameters && Object.assign(h, g.parameters), {
          id: g.id,
          type: g.type,
          position: g.position,
          dragHandle: ".daw-node__header",
          data: {
            label: m.label,
            parameters: h
          }
        };
      }), p = o.edges.map((g) => {
        const m = u.find((I) => I.id === g.source), w = ct(m.type).ports.find((I) => I.id === g.sourceHandle);
        if (!w)
          throw new Error(`Port "${g.sourceHandle}" not found on module "${m.type}"`);
        return {
          id: At(),
          source: g.source,
          sourceHandle: g.sourceHandle,
          target: g.target,
          targetHandle: g.targetHandle,
          type: w.signalType,
          data: {
            signalType: w.signalType,
            channelFormat: w.channelFormat
          }
        };
      });
      c(u, p);
    } else
      i.some((u) => u.type === "master-output") || l("master-output", { x: 600, y: 200 });
  }, []), /* @__PURE__ */ f.jsx(Gu, { children: /* @__PURE__ */ f.jsxs("div", { className: "daw-app", children: [
    (e || r) && /* @__PURE__ */ f.jsxs("div", { className: "daw-header", children: [
      e && /* @__PURE__ */ f.jsx("h1", { className: "daw-title", children: e }),
      r && /* @__PURE__ */ f.jsx("p", { className: "daw-subtitle", children: r })
    ] }),
    /* @__PURE__ */ f.jsx(kh, { allowedModules: s })
  ] }) });
}
function iA(e) {
  const r = typeof e.container == "string" ? document.querySelector(e.container) : e.container;
  if (!r) throw new Error(`Container not found: ${e.container}`);
  if (s2(), e.modules) {
    const s = e.modules.includes("master-output") ? e.modules : [...e.modules, "master-output"];
    oA(s);
  } else
    iw();
  const o = Bg.createRoot(r);
  return o.render(
    bn.createElement(
      bn.StrictMode,
      null,
      bn.createElement(aA, {
        title: e.title,
        subtitle: e.subtitle,
        initialPatch: e.initialPatch,
        allowedModules: e.modules
      })
    )
  ), {
    unmount() {
      o.unmount();
    }
  };
}
const Tg = document.getElementById("root");
Tg && (iw(), Bg.createRoot(Tg).render(
  /* @__PURE__ */ f.jsx(bn.StrictMode, { children: /* @__PURE__ */ f.jsx(K2, {}) })
));
export {
  iA as createDawInstance
};
