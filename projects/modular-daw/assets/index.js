var qv = Object.defineProperty;
var ex = (e, n, o) => n in e ? qv(e, n, { enumerable: !0, configurable: !0, writable: !0, value: o }) : e[n] = o;
var Ir = (e, n, o) => ex(e, typeof n != "symbol" ? n + "" : n, o);
function Cu(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Gc = { exports: {} }, ga = {}, Pc = { exports: {} }, Me = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var hp;
function tx() {
  if (hp) return Me;
  hp = 1;
  var e = Symbol.for("react.element"), n = Symbol.for("react.portal"), o = Symbol.for("react.fragment"), s = Symbol.for("react.strict_mode"), i = Symbol.for("react.profiler"), l = Symbol.for("react.provider"), c = Symbol.for("react.context"), u = Symbol.for("react.forward_ref"), p = Symbol.for("react.suspense"), g = Symbol.for("react.memo"), m = Symbol.for("react.lazy"), h = Symbol.iterator;
  function w(M) {
    return M === null || typeof M != "object" ? null : (M = h && M[h] || M["@@iterator"], typeof M == "function" ? M : null);
  }
  var C = { isMounted: function() {
    return !1;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, x = Object.assign, I = {};
  function b(M, L, te) {
    this.props = M, this.context = L, this.refs = I, this.updater = te || C;
  }
  b.prototype.isReactComponent = {}, b.prototype.setState = function(M, L) {
    if (typeof M != "object" && typeof M != "function" && M != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, M, L, "setState");
  }, b.prototype.forceUpdate = function(M) {
    this.updater.enqueueForceUpdate(this, M, "forceUpdate");
  };
  function _() {
  }
  _.prototype = b.prototype;
  function k(M, L, te) {
    this.props = M, this.context = L, this.refs = I, this.updater = te || C;
  }
  var A = k.prototype = new _();
  A.constructor = k, x(A, b.prototype), A.isPureReactComponent = !0;
  var S = Array.isArray, V = Object.prototype.hasOwnProperty, G = { current: null }, T = { key: !0, ref: !0, __self: !0, __source: !0 };
  function K(M, L, te) {
    var re, le = {}, ue = null, fe = null;
    if (L != null) for (re in L.ref !== void 0 && (fe = L.ref), L.key !== void 0 && (ue = "" + L.key), L) V.call(L, re) && !T.hasOwnProperty(re) && (le[re] = L[re]);
    var ne = arguments.length - 2;
    if (ne === 1) le.children = te;
    else if (1 < ne) {
      for (var pe = Array(ne), be = 0; be < ne; be++) pe[be] = arguments[be + 2];
      le.children = pe;
    }
    if (M && M.defaultProps) for (re in ne = M.defaultProps, ne) le[re] === void 0 && (le[re] = ne[re]);
    return { $$typeof: e, type: M, key: ue, ref: fe, props: le, _owner: G.current };
  }
  function D(M, L) {
    return { $$typeof: e, type: M.type, key: L, ref: M.ref, props: M.props, _owner: M._owner };
  }
  function F(M) {
    return typeof M == "object" && M !== null && M.$$typeof === e;
  }
  function z(M) {
    var L = { "=": "=0", ":": "=2" };
    return "$" + M.replace(/[=:]/g, function(te) {
      return L[te];
    });
  }
  var W = /\/+/g;
  function q(M, L) {
    return typeof M == "object" && M !== null && M.key != null ? z("" + M.key) : L.toString(36);
  }
  function R(M, L, te, re, le) {
    var ue = typeof M;
    (ue === "undefined" || ue === "boolean") && (M = null);
    var fe = !1;
    if (M === null) fe = !0;
    else switch (ue) {
      case "string":
      case "number":
        fe = !0;
        break;
      case "object":
        switch (M.$$typeof) {
          case e:
          case n:
            fe = !0;
        }
    }
    if (fe) return fe = M, le = le(fe), M = re === "" ? "." + q(fe, 0) : re, S(le) ? (te = "", M != null && (te = M.replace(W, "$&/") + "/"), R(le, L, te, "", function(be) {
      return be;
    })) : le != null && (F(le) && (le = D(le, te + (!le.key || fe && fe.key === le.key ? "" : ("" + le.key).replace(W, "$&/") + "/") + M)), L.push(le)), 1;
    if (fe = 0, re = re === "" ? "." : re + ":", S(M)) for (var ne = 0; ne < M.length; ne++) {
      ue = M[ne];
      var pe = re + q(ue, ne);
      fe += R(ue, L, te, pe, le);
    }
    else if (pe = w(M), typeof pe == "function") for (M = pe.call(M), ne = 0; !(ue = M.next()).done; ) ue = ue.value, pe = re + q(ue, ne++), fe += R(ue, L, te, pe, le);
    else if (ue === "object") throw L = String(M), Error("Objects are not valid as a React child (found: " + (L === "[object Object]" ? "object with keys {" + Object.keys(M).join(", ") + "}" : L) + "). If you meant to render a collection of children, use an array instead.");
    return fe;
  }
  function Y(M, L, te) {
    if (M == null) return M;
    var re = [], le = 0;
    return R(M, re, "", "", function(ue) {
      return L.call(te, ue, le++);
    }), re;
  }
  function H(M) {
    if (M._status === -1) {
      var L = M._result;
      L = L(), L.then(function(te) {
        (M._status === 0 || M._status === -1) && (M._status = 1, M._result = te);
      }, function(te) {
        (M._status === 0 || M._status === -1) && (M._status = 2, M._result = te);
      }), M._status === -1 && (M._status = 0, M._result = L);
    }
    if (M._status === 1) return M._result.default;
    throw M._result;
  }
  var U = { current: null }, E = { transition: null }, P = { ReactCurrentDispatcher: U, ReactCurrentBatchConfig: E, ReactCurrentOwner: G };
  function Z() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  return Me.Children = { map: Y, forEach: function(M, L, te) {
    Y(M, function() {
      L.apply(this, arguments);
    }, te);
  }, count: function(M) {
    var L = 0;
    return Y(M, function() {
      L++;
    }), L;
  }, toArray: function(M) {
    return Y(M, function(L) {
      return L;
    }) || [];
  }, only: function(M) {
    if (!F(M)) throw Error("React.Children.only expected to receive a single React element child.");
    return M;
  } }, Me.Component = b, Me.Fragment = o, Me.Profiler = i, Me.PureComponent = k, Me.StrictMode = s, Me.Suspense = p, Me.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = P, Me.act = Z, Me.cloneElement = function(M, L, te) {
    if (M == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + M + ".");
    var re = x({}, M.props), le = M.key, ue = M.ref, fe = M._owner;
    if (L != null) {
      if (L.ref !== void 0 && (ue = L.ref, fe = G.current), L.key !== void 0 && (le = "" + L.key), M.type && M.type.defaultProps) var ne = M.type.defaultProps;
      for (pe in L) V.call(L, pe) && !T.hasOwnProperty(pe) && (re[pe] = L[pe] === void 0 && ne !== void 0 ? ne[pe] : L[pe]);
    }
    var pe = arguments.length - 2;
    if (pe === 1) re.children = te;
    else if (1 < pe) {
      ne = Array(pe);
      for (var be = 0; be < pe; be++) ne[be] = arguments[be + 2];
      re.children = ne;
    }
    return { $$typeof: e, type: M.type, key: le, ref: ue, props: re, _owner: fe };
  }, Me.createContext = function(M) {
    return M = { $$typeof: c, _currentValue: M, _currentValue2: M, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, M.Provider = { $$typeof: l, _context: M }, M.Consumer = M;
  }, Me.createElement = K, Me.createFactory = function(M) {
    var L = K.bind(null, M);
    return L.type = M, L;
  }, Me.createRef = function() {
    return { current: null };
  }, Me.forwardRef = function(M) {
    return { $$typeof: u, render: M };
  }, Me.isValidElement = F, Me.lazy = function(M) {
    return { $$typeof: m, _payload: { _status: -1, _result: M }, _init: H };
  }, Me.memo = function(M, L) {
    return { $$typeof: g, type: M, compare: L === void 0 ? null : L };
  }, Me.startTransition = function(M) {
    var L = E.transition;
    E.transition = {};
    try {
      M();
    } finally {
      E.transition = L;
    }
  }, Me.unstable_act = Z, Me.useCallback = function(M, L) {
    return U.current.useCallback(M, L);
  }, Me.useContext = function(M) {
    return U.current.useContext(M);
  }, Me.useDebugValue = function() {
  }, Me.useDeferredValue = function(M) {
    return U.current.useDeferredValue(M);
  }, Me.useEffect = function(M, L) {
    return U.current.useEffect(M, L);
  }, Me.useId = function() {
    return U.current.useId();
  }, Me.useImperativeHandle = function(M, L, te) {
    return U.current.useImperativeHandle(M, L, te);
  }, Me.useInsertionEffect = function(M, L) {
    return U.current.useInsertionEffect(M, L);
  }, Me.useLayoutEffect = function(M, L) {
    return U.current.useLayoutEffect(M, L);
  }, Me.useMemo = function(M, L) {
    return U.current.useMemo(M, L);
  }, Me.useReducer = function(M, L, te) {
    return U.current.useReducer(M, L, te);
  }, Me.useRef = function(M) {
    return U.current.useRef(M);
  }, Me.useState = function(M) {
    return U.current.useState(M);
  }, Me.useSyncExternalStore = function(M, L, te) {
    return U.current.useSyncExternalStore(M, L, te);
  }, Me.useTransition = function() {
    return U.current.useTransition();
  }, Me.version = "18.3.1", Me;
}
var yp;
function Ra() {
  return yp || (yp = 1, Pc.exports = tx()), Pc.exports;
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
var wp;
function nx() {
  if (wp) return ga;
  wp = 1;
  var e = Ra(), n = Symbol.for("react.element"), o = Symbol.for("react.fragment"), s = Object.prototype.hasOwnProperty, i = e.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, l = { key: !0, ref: !0, __self: !0, __source: !0 };
  function c(u, p, g) {
    var m, h = {}, w = null, C = null;
    g !== void 0 && (w = "" + g), p.key !== void 0 && (w = "" + p.key), p.ref !== void 0 && (C = p.ref);
    for (m in p) s.call(p, m) && !l.hasOwnProperty(m) && (h[m] = p[m]);
    if (u && u.defaultProps) for (m in p = u.defaultProps, p) h[m] === void 0 && (h[m] = p[m]);
    return { $$typeof: n, type: u, key: w, ref: C, props: h, _owner: i.current };
  }
  return ga.Fragment = o, ga.jsx = c, ga.jsxs = c, ga;
}
var vp;
function rx() {
  return vp || (vp = 1, Gc.exports = nx()), Gc.exports;
}
var d = rx(), j = Ra();
const _n = /* @__PURE__ */ Cu(j);
var ri = {}, Fc = { exports: {} }, wt = {}, Vc = { exports: {} }, zc = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var xp;
function ox() {
  return xp || (xp = 1, (function(e) {
    function n(E, P) {
      var Z = E.length;
      E.push(P);
      e: for (; 0 < Z; ) {
        var M = Z - 1 >>> 1, L = E[M];
        if (0 < i(L, P)) E[M] = P, E[Z] = L, Z = M;
        else break e;
      }
    }
    function o(E) {
      return E.length === 0 ? null : E[0];
    }
    function s(E) {
      if (E.length === 0) return null;
      var P = E[0], Z = E.pop();
      if (Z !== P) {
        E[0] = Z;
        e: for (var M = 0, L = E.length, te = L >>> 1; M < te; ) {
          var re = 2 * (M + 1) - 1, le = E[re], ue = re + 1, fe = E[ue];
          if (0 > i(le, Z)) ue < L && 0 > i(fe, le) ? (E[M] = fe, E[ue] = Z, M = ue) : (E[M] = le, E[re] = Z, M = re);
          else if (ue < L && 0 > i(fe, Z)) E[M] = fe, E[ue] = Z, M = ue;
          else break e;
        }
      }
      return P;
    }
    function i(E, P) {
      var Z = E.sortIndex - P.sortIndex;
      return Z !== 0 ? Z : E.id - P.id;
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
    var p = [], g = [], m = 1, h = null, w = 3, C = !1, x = !1, I = !1, b = typeof setTimeout == "function" ? setTimeout : null, _ = typeof clearTimeout == "function" ? clearTimeout : null, k = typeof setImmediate < "u" ? setImmediate : null;
    typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function A(E) {
      for (var P = o(g); P !== null; ) {
        if (P.callback === null) s(g);
        else if (P.startTime <= E) s(g), P.sortIndex = P.expirationTime, n(p, P);
        else break;
        P = o(g);
      }
    }
    function S(E) {
      if (I = !1, A(E), !x) if (o(p) !== null) x = !0, H(V);
      else {
        var P = o(g);
        P !== null && U(S, P.startTime - E);
      }
    }
    function V(E, P) {
      x = !1, I && (I = !1, _(K), K = -1), C = !0;
      var Z = w;
      try {
        for (A(P), h = o(p); h !== null && (!(h.expirationTime > P) || E && !z()); ) {
          var M = h.callback;
          if (typeof M == "function") {
            h.callback = null, w = h.priorityLevel;
            var L = M(h.expirationTime <= P);
            P = e.unstable_now(), typeof L == "function" ? h.callback = L : h === o(p) && s(p), A(P);
          } else s(p);
          h = o(p);
        }
        if (h !== null) var te = !0;
        else {
          var re = o(g);
          re !== null && U(S, re.startTime - P), te = !1;
        }
        return te;
      } finally {
        h = null, w = Z, C = !1;
      }
    }
    var G = !1, T = null, K = -1, D = 5, F = -1;
    function z() {
      return !(e.unstable_now() - F < D);
    }
    function W() {
      if (T !== null) {
        var E = e.unstable_now();
        F = E;
        var P = !0;
        try {
          P = T(!0, E);
        } finally {
          P ? q() : (G = !1, T = null);
        }
      } else G = !1;
    }
    var q;
    if (typeof k == "function") q = function() {
      k(W);
    };
    else if (typeof MessageChannel < "u") {
      var R = new MessageChannel(), Y = R.port2;
      R.port1.onmessage = W, q = function() {
        Y.postMessage(null);
      };
    } else q = function() {
      b(W, 0);
    };
    function H(E) {
      T = E, G || (G = !0, q());
    }
    function U(E, P) {
      K = b(function() {
        E(e.unstable_now());
      }, P);
    }
    e.unstable_IdlePriority = 5, e.unstable_ImmediatePriority = 1, e.unstable_LowPriority = 4, e.unstable_NormalPriority = 3, e.unstable_Profiling = null, e.unstable_UserBlockingPriority = 2, e.unstable_cancelCallback = function(E) {
      E.callback = null;
    }, e.unstable_continueExecution = function() {
      x || C || (x = !0, H(V));
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
          var P = 3;
          break;
        default:
          P = w;
      }
      var Z = w;
      w = P;
      try {
        return E();
      } finally {
        w = Z;
      }
    }, e.unstable_pauseExecution = function() {
    }, e.unstable_requestPaint = function() {
    }, e.unstable_runWithPriority = function(E, P) {
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
      var Z = w;
      w = E;
      try {
        return P();
      } finally {
        w = Z;
      }
    }, e.unstable_scheduleCallback = function(E, P, Z) {
      var M = e.unstable_now();
      switch (typeof Z == "object" && Z !== null ? (Z = Z.delay, Z = typeof Z == "number" && 0 < Z ? M + Z : M) : Z = M, E) {
        case 1:
          var L = -1;
          break;
        case 2:
          L = 250;
          break;
        case 5:
          L = 1073741823;
          break;
        case 4:
          L = 1e4;
          break;
        default:
          L = 5e3;
      }
      return L = Z + L, E = { id: m++, callback: P, priorityLevel: E, startTime: Z, expirationTime: L, sortIndex: -1 }, Z > M ? (E.sortIndex = Z, n(g, E), o(p) === null && E === o(g) && (I ? (_(K), K = -1) : I = !0, U(S, Z - M))) : (E.sortIndex = L, n(p, E), x || C || (x = !0, H(V))), E;
    }, e.unstable_shouldYield = z, e.unstable_wrapCallback = function(E) {
      var P = w;
      return function() {
        var Z = w;
        w = P;
        try {
          return E.apply(this, arguments);
        } finally {
          w = Z;
        }
      };
    };
  })(zc)), zc;
}
var Ip;
function ax() {
  return Ip || (Ip = 1, Vc.exports = ox()), Vc.exports;
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
var Cp;
function sx() {
  if (Cp) return wt;
  Cp = 1;
  var e = Ra(), n = ax();
  function o(t) {
    for (var r = "https://reactjs.org/docs/error-decoder.html?invariant=" + t, a = 1; a < arguments.length; a++) r += "&args[]=" + encodeURIComponent(arguments[a]);
    return "Minified React error #" + t + "; visit " + r + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var s = /* @__PURE__ */ new Set(), i = {};
  function l(t, r) {
    c(t, r), c(t + "Capture", r);
  }
  function c(t, r) {
    for (i[t] = r, t = 0; t < r.length; t++) s.add(r[t]);
  }
  var u = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), p = Object.prototype.hasOwnProperty, g = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, m = {}, h = {};
  function w(t) {
    return p.call(h, t) ? !0 : p.call(m, t) ? !1 : g.test(t) ? h[t] = !0 : (m[t] = !0, !1);
  }
  function C(t, r, a, f) {
    if (a !== null && a.type === 0) return !1;
    switch (typeof r) {
      case "function":
      case "symbol":
        return !0;
      case "boolean":
        return f ? !1 : a !== null ? !a.acceptsBooleans : (t = t.toLowerCase().slice(0, 5), t !== "data-" && t !== "aria-");
      default:
        return !1;
    }
  }
  function x(t, r, a, f) {
    if (r === null || typeof r > "u" || C(t, r, a, f)) return !0;
    if (f) return !1;
    if (a !== null) switch (a.type) {
      case 3:
        return !r;
      case 4:
        return r === !1;
      case 5:
        return isNaN(r);
      case 6:
        return isNaN(r) || 1 > r;
    }
    return !1;
  }
  function I(t, r, a, f, y, v, N) {
    this.acceptsBooleans = r === 2 || r === 3 || r === 4, this.attributeName = f, this.attributeNamespace = y, this.mustUseProperty = a, this.propertyName = t, this.type = r, this.sanitizeURL = v, this.removeEmptyString = N;
  }
  var b = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(t) {
    b[t] = new I(t, 0, !1, t, null, !1, !1);
  }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(t) {
    var r = t[0];
    b[r] = new I(r, 1, !1, t[1], null, !1, !1);
  }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(t) {
    b[t] = new I(t, 2, !1, t.toLowerCase(), null, !1, !1);
  }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(t) {
    b[t] = new I(t, 2, !1, t, null, !1, !1);
  }), "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(t) {
    b[t] = new I(t, 3, !1, t.toLowerCase(), null, !1, !1);
  }), ["checked", "multiple", "muted", "selected"].forEach(function(t) {
    b[t] = new I(t, 3, !0, t, null, !1, !1);
  }), ["capture", "download"].forEach(function(t) {
    b[t] = new I(t, 4, !1, t, null, !1, !1);
  }), ["cols", "rows", "size", "span"].forEach(function(t) {
    b[t] = new I(t, 6, !1, t, null, !1, !1);
  }), ["rowSpan", "start"].forEach(function(t) {
    b[t] = new I(t, 5, !1, t.toLowerCase(), null, !1, !1);
  });
  var _ = /[\-:]([a-z])/g;
  function k(t) {
    return t[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(t) {
    var r = t.replace(
      _,
      k
    );
    b[r] = new I(r, 1, !1, t, null, !1, !1);
  }), "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(t) {
    var r = t.replace(_, k);
    b[r] = new I(r, 1, !1, t, "http://www.w3.org/1999/xlink", !1, !1);
  }), ["xml:base", "xml:lang", "xml:space"].forEach(function(t) {
    var r = t.replace(_, k);
    b[r] = new I(r, 1, !1, t, "http://www.w3.org/XML/1998/namespace", !1, !1);
  }), ["tabIndex", "crossOrigin"].forEach(function(t) {
    b[t] = new I(t, 1, !1, t.toLowerCase(), null, !1, !1);
  }), b.xlinkHref = new I("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1), ["src", "href", "action", "formAction"].forEach(function(t) {
    b[t] = new I(t, 1, !1, t.toLowerCase(), null, !0, !0);
  });
  function A(t, r, a, f) {
    var y = b.hasOwnProperty(r) ? b[r] : null;
    (y !== null ? y.type !== 0 : f || !(2 < r.length) || r[0] !== "o" && r[0] !== "O" || r[1] !== "n" && r[1] !== "N") && (x(r, a, y, f) && (a = null), f || y === null ? w(r) && (a === null ? t.removeAttribute(r) : t.setAttribute(r, "" + a)) : y.mustUseProperty ? t[y.propertyName] = a === null ? y.type === 3 ? !1 : "" : a : (r = y.attributeName, f = y.attributeNamespace, a === null ? t.removeAttribute(r) : (y = y.type, a = y === 3 || y === 4 && a === !0 ? "" : "" + a, f ? t.setAttributeNS(f, r, a) : t.setAttribute(r, a))));
  }
  var S = e.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, V = Symbol.for("react.element"), G = Symbol.for("react.portal"), T = Symbol.for("react.fragment"), K = Symbol.for("react.strict_mode"), D = Symbol.for("react.profiler"), F = Symbol.for("react.provider"), z = Symbol.for("react.context"), W = Symbol.for("react.forward_ref"), q = Symbol.for("react.suspense"), R = Symbol.for("react.suspense_list"), Y = Symbol.for("react.memo"), H = Symbol.for("react.lazy"), U = Symbol.for("react.offscreen"), E = Symbol.iterator;
  function P(t) {
    return t === null || typeof t != "object" ? null : (t = E && t[E] || t["@@iterator"], typeof t == "function" ? t : null);
  }
  var Z = Object.assign, M;
  function L(t) {
    if (M === void 0) try {
      throw Error();
    } catch (a) {
      var r = a.stack.trim().match(/\n( *(at )?)/);
      M = r && r[1] || "";
    }
    return `
` + M + t;
  }
  var te = !1;
  function re(t, r) {
    if (!t || te) return "";
    te = !0;
    var a = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      if (r) if (r = function() {
        throw Error();
      }, Object.defineProperty(r.prototype, "props", { set: function() {
        throw Error();
      } }), typeof Reflect == "object" && Reflect.construct) {
        try {
          Reflect.construct(r, []);
        } catch (ee) {
          var f = ee;
        }
        Reflect.construct(t, [], r);
      } else {
        try {
          r.call();
        } catch (ee) {
          f = ee;
        }
        t.call(r.prototype);
      }
      else {
        try {
          throw Error();
        } catch (ee) {
          f = ee;
        }
        t();
      }
    } catch (ee) {
      if (ee && f && typeof ee.stack == "string") {
        for (var y = ee.stack.split(`
`), v = f.stack.split(`
`), N = y.length - 1, B = v.length - 1; 1 <= N && 0 <= B && y[N] !== v[B]; ) B--;
        for (; 1 <= N && 0 <= B; N--, B--) if (y[N] !== v[B]) {
          if (N !== 1 || B !== 1)
            do
              if (N--, B--, 0 > B || y[N] !== v[B]) {
                var O = `
` + y[N].replace(" at new ", " at ");
                return t.displayName && O.includes("<anonymous>") && (O = O.replace("<anonymous>", t.displayName)), O;
              }
            while (1 <= N && 0 <= B);
          break;
        }
      }
    } finally {
      te = !1, Error.prepareStackTrace = a;
    }
    return (t = t ? t.displayName || t.name : "") ? L(t) : "";
  }
  function le(t) {
    switch (t.tag) {
      case 5:
        return L(t.type);
      case 16:
        return L("Lazy");
      case 13:
        return L("Suspense");
      case 19:
        return L("SuspenseList");
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
      case T:
        return "Fragment";
      case G:
        return "Portal";
      case D:
        return "Profiler";
      case K:
        return "StrictMode";
      case q:
        return "Suspense";
      case R:
        return "SuspenseList";
    }
    if (typeof t == "object") switch (t.$$typeof) {
      case z:
        return (t.displayName || "Context") + ".Consumer";
      case F:
        return (t._context.displayName || "Context") + ".Provider";
      case W:
        var r = t.render;
        return t = t.displayName, t || (t = r.displayName || r.name || "", t = t !== "" ? "ForwardRef(" + t + ")" : "ForwardRef"), t;
      case Y:
        return r = t.displayName || null, r !== null ? r : ue(t.type) || "Memo";
      case H:
        r = t._payload, t = t._init;
        try {
          return ue(t(r));
        } catch {
        }
    }
    return null;
  }
  function fe(t) {
    var r = t.type;
    switch (t.tag) {
      case 24:
        return "Cache";
      case 9:
        return (r.displayName || "Context") + ".Consumer";
      case 10:
        return (r._context.displayName || "Context") + ".Provider";
      case 18:
        return "DehydratedFragment";
      case 11:
        return t = r.render, t = t.displayName || t.name || "", r.displayName || (t !== "" ? "ForwardRef(" + t + ")" : "ForwardRef");
      case 7:
        return "Fragment";
      case 5:
        return r;
      case 4:
        return "Portal";
      case 3:
        return "Root";
      case 6:
        return "Text";
      case 16:
        return ue(r);
      case 8:
        return r === K ? "StrictMode" : "Mode";
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
        if (typeof r == "function") return r.displayName || r.name || null;
        if (typeof r == "string") return r;
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
  function pe(t) {
    var r = t.type;
    return (t = t.nodeName) && t.toLowerCase() === "input" && (r === "checkbox" || r === "radio");
  }
  function be(t) {
    var r = pe(t) ? "checked" : "value", a = Object.getOwnPropertyDescriptor(t.constructor.prototype, r), f = "" + t[r];
    if (!t.hasOwnProperty(r) && typeof a < "u" && typeof a.get == "function" && typeof a.set == "function") {
      var y = a.get, v = a.set;
      return Object.defineProperty(t, r, { configurable: !0, get: function() {
        return y.call(this);
      }, set: function(N) {
        f = "" + N, v.call(this, N);
      } }), Object.defineProperty(t, r, { enumerable: a.enumerable }), { getValue: function() {
        return f;
      }, setValue: function(N) {
        f = "" + N;
      }, stopTracking: function() {
        t._valueTracker = null, delete t[r];
      } };
    }
  }
  function _e(t) {
    t._valueTracker || (t._valueTracker = be(t));
  }
  function Ce(t) {
    if (!t) return !1;
    var r = t._valueTracker;
    if (!r) return !0;
    var a = r.getValue(), f = "";
    return t && (f = pe(t) ? t.checked ? "true" : "false" : t.value), t = f, t !== a ? (r.setValue(t), !0) : !1;
  }
  function xe(t) {
    if (t = t || (typeof document < "u" ? document : void 0), typeof t > "u") return null;
    try {
      return t.activeElement || t.body;
    } catch {
      return t.body;
    }
  }
  function Re(t, r) {
    var a = r.checked;
    return Z({}, r, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: a ?? t._wrapperState.initialChecked });
  }
  function Be(t, r) {
    var a = r.defaultValue == null ? "" : r.defaultValue, f = r.checked != null ? r.checked : r.defaultChecked;
    a = ne(r.value != null ? r.value : a), t._wrapperState = { initialChecked: f, initialValue: a, controlled: r.type === "checkbox" || r.type === "radio" ? r.checked != null : r.value != null };
  }
  function je(t, r) {
    r = r.checked, r != null && A(t, "checked", r, !1);
  }
  function We(t, r) {
    je(t, r);
    var a = ne(r.value), f = r.type;
    if (a != null) f === "number" ? (a === 0 && t.value === "" || t.value != a) && (t.value = "" + a) : t.value !== "" + a && (t.value = "" + a);
    else if (f === "submit" || f === "reset") {
      t.removeAttribute("value");
      return;
    }
    r.hasOwnProperty("value") ? xt(t, r.type, a) : r.hasOwnProperty("defaultValue") && xt(t, r.type, ne(r.defaultValue)), r.checked == null && r.defaultChecked != null && (t.defaultChecked = !!r.defaultChecked);
  }
  function Ft(t, r, a) {
    if (r.hasOwnProperty("value") || r.hasOwnProperty("defaultValue")) {
      var f = r.type;
      if (!(f !== "submit" && f !== "reset" || r.value !== void 0 && r.value !== null)) return;
      r = "" + t._wrapperState.initialValue, a || r === t.value || (t.value = r), t.defaultValue = r;
    }
    a = t.name, a !== "" && (t.name = ""), t.defaultChecked = !!t._wrapperState.initialChecked, a !== "" && (t.name = a);
  }
  function xt(t, r, a) {
    (r !== "number" || xe(t.ownerDocument) !== t) && (a == null ? t.defaultValue = "" + t._wrapperState.initialValue : t.defaultValue !== "" + a && (t.defaultValue = "" + a));
  }
  var It = Array.isArray;
  function Mt(t, r, a, f) {
    if (t = t.options, r) {
      r = {};
      for (var y = 0; y < a.length; y++) r["$" + a[y]] = !0;
      for (a = 0; a < t.length; a++) y = r.hasOwnProperty("$" + t[a].value), t[a].selected !== y && (t[a].selected = y), y && f && (t[a].defaultSelected = !0);
    } else {
      for (a = "" + ne(a), r = null, y = 0; y < t.length; y++) {
        if (t[y].value === a) {
          t[y].selected = !0, f && (t[y].defaultSelected = !0);
          return;
        }
        r !== null || t[y].disabled || (r = t[y]);
      }
      r !== null && (r.selected = !0);
    }
  }
  function un(t, r) {
    if (r.dangerouslySetInnerHTML != null) throw Error(o(91));
    return Z({}, r, { value: void 0, defaultValue: void 0, children: "" + t._wrapperState.initialValue });
  }
  function Mn(t, r) {
    var a = r.value;
    if (a == null) {
      if (a = r.children, r = r.defaultValue, a != null) {
        if (r != null) throw Error(o(92));
        if (It(a)) {
          if (1 < a.length) throw Error(o(93));
          a = a[0];
        }
        r = a;
      }
      r == null && (r = ""), a = r;
    }
    t._wrapperState = { initialValue: ne(a) };
  }
  function Mr(t, r) {
    var a = ne(r.value), f = ne(r.defaultValue);
    a != null && (a = "" + a, a !== t.value && (t.value = a), r.defaultValue == null && t.defaultValue !== a && (t.defaultValue = a)), f != null && (t.defaultValue = "" + f);
  }
  function tr(t) {
    var r = t.textContent;
    r === t._wrapperState.initialValue && r !== "" && r !== null && (t.value = r);
  }
  function dn(t) {
    switch (t) {
      case "svg":
        return "http://www.w3.org/2000/svg";
      case "math":
        return "http://www.w3.org/1998/Math/MathML";
      default:
        return "http://www.w3.org/1999/xhtml";
    }
  }
  function fn(t, r) {
    return t == null || t === "http://www.w3.org/1999/xhtml" ? dn(r) : t === "http://www.w3.org/2000/svg" && r === "foreignObject" ? "http://www.w3.org/1999/xhtml" : t;
  }
  var nr, Va = (function(t) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(r, a, f, y) {
      MSApp.execUnsafeLocalFunction(function() {
        return t(r, a, f, y);
      });
    } : t;
  })(function(t, r) {
    if (t.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in t) t.innerHTML = r;
    else {
      for (nr = nr || document.createElement("div"), nr.innerHTML = "<svg>" + r.valueOf().toString() + "</svg>", r = nr.firstChild; t.firstChild; ) t.removeChild(t.firstChild);
      for (; r.firstChild; ) t.appendChild(r.firstChild);
    }
  });
  function pn(t, r) {
    if (r) {
      var a = t.firstChild;
      if (a && a === t.lastChild && a.nodeType === 3) {
        a.nodeValue = r;
        return;
      }
    }
    t.textContent = r;
  }
  var rr = {
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
  }, Wi = ["Webkit", "ms", "Moz", "O"];
  Object.keys(rr).forEach(function(t) {
    Wi.forEach(function(r) {
      r = r + t.charAt(0).toUpperCase() + t.substring(1), rr[r] = rr[t];
    });
  });
  function za(t, r, a) {
    return r == null || typeof r == "boolean" || r === "" ? "" : a || typeof r != "number" || r === 0 || rr.hasOwnProperty(t) && rr[t] ? ("" + r).trim() : r + "px";
  }
  function Oa(t, r) {
    t = t.style;
    for (var a in r) if (r.hasOwnProperty(a)) {
      var f = a.indexOf("--") === 0, y = za(a, r[a], f);
      a === "float" && (a = "cssFloat"), f ? t.setProperty(a, y) : t[a] = y;
    }
  }
  var Xi = Z({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
  function _o(t, r) {
    if (r) {
      if (Xi[t] && (r.children != null || r.dangerouslySetInnerHTML != null)) throw Error(o(137, t));
      if (r.dangerouslySetInnerHTML != null) {
        if (r.children != null) throw Error(o(60));
        if (typeof r.dangerouslySetInnerHTML != "object" || !("__html" in r.dangerouslySetInnerHTML)) throw Error(o(61));
      }
      if (r.style != null && typeof r.style != "object") throw Error(o(62));
    }
  }
  function No(t, r) {
    if (t.indexOf("-") === -1) return typeof r.is == "string";
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
  var Ao = null;
  function So(t) {
    return t = t.target || t.srcElement || window, t.correspondingUseElement && (t = t.correspondingUseElement), t.nodeType === 3 ? t.parentNode : t;
  }
  var ko = null, Rn = null, Tn = null;
  function La(t) {
    if (t = qo(t)) {
      if (typeof ko != "function") throw Error(o(280));
      var r = t.stateNode;
      r && (r = ws(r), ko(t.stateNode, t.type, r));
    }
  }
  function Ha(t) {
    Rn ? Tn ? Tn.push(t) : Tn = [t] : Rn = t;
  }
  function Wa() {
    if (Rn) {
      var t = Rn, r = Tn;
      if (Tn = Rn = null, La(t), r) for (t = 0; t < r.length; t++) La(r[t]);
    }
  }
  function Xa(t, r) {
    return t(r);
  }
  function Ka() {
  }
  var jo = !1;
  function Za(t, r, a) {
    if (jo) return t(r, a);
    jo = !0;
    try {
      return Xa(t, r, a);
    } finally {
      jo = !1, (Rn !== null || Tn !== null) && (Ka(), Wa());
    }
  }
  function or(t, r) {
    var a = t.stateNode;
    if (a === null) return null;
    var f = ws(a);
    if (f === null) return null;
    a = f[r];
    e: switch (r) {
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
        (f = !f.disabled) || (t = t.type, f = !(t === "button" || t === "input" || t === "select" || t === "textarea")), t = !f;
        break e;
      default:
        t = !1;
    }
    if (t) return null;
    if (a && typeof a != "function") throw Error(o(231, r, typeof a));
    return a;
  }
  var Mo = !1;
  if (u) try {
    var ar = {};
    Object.defineProperty(ar, "passive", { get: function() {
      Mo = !0;
    } }), window.addEventListener("test", ar, ar), window.removeEventListener("test", ar, ar);
  } catch {
    Mo = !1;
  }
  function Ki(t, r, a, f, y, v, N, B, O) {
    var ee = Array.prototype.slice.call(arguments, 3);
    try {
      r.apply(a, ee);
    } catch (se) {
      this.onError(se);
    }
  }
  var sr = !1, Rr = null, Tr = !1, Ro = null, Zi = { onError: function(t) {
    sr = !0, Rr = t;
  } };
  function Yi(t, r, a, f, y, v, N, B, O) {
    sr = !1, Rr = null, Ki.apply(Zi, arguments);
  }
  function Ui(t, r, a, f, y, v, N, B, O) {
    if (Yi.apply(this, arguments), sr) {
      if (sr) {
        var ee = Rr;
        sr = !1, Rr = null;
      } else throw Error(o(198));
      Tr || (Tr = !0, Ro = ee);
    }
  }
  function Jt(t) {
    var r = t, a = t;
    if (t.alternate) for (; r.return; ) r = r.return;
    else {
      t = r;
      do
        r = t, (r.flags & 4098) !== 0 && (a = r.return), t = r.return;
      while (t);
    }
    return r.tag === 3 ? a : null;
  }
  function To(t) {
    if (t.tag === 13) {
      var r = t.memoizedState;
      if (r === null && (t = t.alternate, t !== null && (r = t.memoizedState)), r !== null) return r.dehydrated;
    }
    return null;
  }
  function Bo(t) {
    if (Jt(t) !== t) throw Error(o(188));
  }
  function $i(t) {
    var r = t.alternate;
    if (!r) {
      if (r = Jt(t), r === null) throw Error(o(188));
      return r !== t ? null : t;
    }
    for (var a = t, f = r; ; ) {
      var y = a.return;
      if (y === null) break;
      var v = y.alternate;
      if (v === null) {
        if (f = y.return, f !== null) {
          a = f;
          continue;
        }
        break;
      }
      if (y.child === v.child) {
        for (v = y.child; v; ) {
          if (v === a) return Bo(y), t;
          if (v === f) return Bo(y), r;
          v = v.sibling;
        }
        throw Error(o(188));
      }
      if (a.return !== f.return) a = y, f = v;
      else {
        for (var N = !1, B = y.child; B; ) {
          if (B === a) {
            N = !0, a = y, f = v;
            break;
          }
          if (B === f) {
            N = !0, f = y, a = v;
            break;
          }
          B = B.sibling;
        }
        if (!N) {
          for (B = v.child; B; ) {
            if (B === a) {
              N = !0, a = v, f = y;
              break;
            }
            if (B === f) {
              N = !0, f = v, a = y;
              break;
            }
            B = B.sibling;
          }
          if (!N) throw Error(o(189));
        }
      }
      if (a.alternate !== f) throw Error(o(190));
    }
    if (a.tag !== 3) throw Error(o(188));
    return a.stateNode.current === a ? t : r;
  }
  function Ya(t) {
    return t = $i(t), t !== null ? Ua(t) : null;
  }
  function Ua(t) {
    if (t.tag === 5 || t.tag === 6) return t;
    for (t = t.child; t !== null; ) {
      var r = Ua(t);
      if (r !== null) return r;
      t = t.sibling;
    }
    return null;
  }
  var $a = n.unstable_scheduleCallback, Qa = n.unstable_cancelCallback, Qi = n.unstable_shouldYield, Ja = n.unstable_requestPaint, Xe = n.unstable_now, Ji = n.unstable_getCurrentPriorityLevel, Eo = n.unstable_ImmediatePriority, qa = n.unstable_UserBlockingPriority, Br = n.unstable_NormalPriority, qi = n.unstable_LowPriority, es = n.unstable_IdlePriority, ir = null, Rt = null;
  function el(t) {
    if (Rt && typeof Rt.onCommitFiberRoot == "function") try {
      Rt.onCommitFiberRoot(ir, t, void 0, (t.current.flags & 128) === 128);
    } catch {
    }
  }
  var Ct = Math.clz32 ? Math.clz32 : rl, tl = Math.log, nl = Math.LN2;
  function rl(t) {
    return t >>>= 0, t === 0 ? 32 : 31 - (tl(t) / nl | 0) | 0;
  }
  var Er = 64, Dr = 4194304;
  function qt(t) {
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
  function Gr(t, r) {
    var a = t.pendingLanes;
    if (a === 0) return 0;
    var f = 0, y = t.suspendedLanes, v = t.pingedLanes, N = a & 268435455;
    if (N !== 0) {
      var B = N & ~y;
      B !== 0 ? f = qt(B) : (v &= N, v !== 0 && (f = qt(v)));
    } else N = a & ~y, N !== 0 ? f = qt(N) : v !== 0 && (f = qt(v));
    if (f === 0) return 0;
    if (r !== 0 && r !== f && (r & y) === 0 && (y = f & -f, v = r & -r, y >= v || y === 16 && (v & 4194240) !== 0)) return r;
    if ((f & 4) !== 0 && (f |= a & 16), r = t.entangledLanes, r !== 0) for (t = t.entanglements, r &= f; 0 < r; ) a = 31 - Ct(r), y = 1 << a, f |= t[a], r &= ~y;
    return f;
  }
  function ts(t, r) {
    switch (t) {
      case 1:
      case 2:
      case 4:
        return r + 250;
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
        return r + 5e3;
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
  function ol(t, r) {
    for (var a = t.suspendedLanes, f = t.pingedLanes, y = t.expirationTimes, v = t.pendingLanes; 0 < v; ) {
      var N = 31 - Ct(v), B = 1 << N, O = y[N];
      O === -1 ? ((B & a) === 0 || (B & f) !== 0) && (y[N] = ts(B, r)) : O <= r && (t.expiredLanes |= B), v &= ~B;
    }
  }
  function Do(t) {
    return t = t.pendingLanes & -1073741825, t !== 0 ? t : t & 1073741824 ? 1073741824 : 0;
  }
  function Pr() {
    var t = Er;
    return Er <<= 1, (Er & 4194240) === 0 && (Er = 64), t;
  }
  function Go(t) {
    for (var r = [], a = 0; 31 > a; a++) r.push(t);
    return r;
  }
  function lr(t, r, a) {
    t.pendingLanes |= r, r !== 536870912 && (t.suspendedLanes = 0, t.pingedLanes = 0), t = t.eventTimes, r = 31 - Ct(r), t[r] = a;
  }
  function ns(t, r) {
    var a = t.pendingLanes & ~r;
    t.pendingLanes = r, t.suspendedLanes = 0, t.pingedLanes = 0, t.expiredLanes &= r, t.mutableReadLanes &= r, t.entangledLanes &= r, r = t.entanglements;
    var f = t.eventTimes;
    for (t = t.expirationTimes; 0 < a; ) {
      var y = 31 - Ct(a), v = 1 << y;
      r[y] = 0, f[y] = -1, t[y] = -1, a &= ~v;
    }
  }
  function al(t, r) {
    var a = t.entangledLanes |= r;
    for (t = t.entanglements; a; ) {
      var f = 31 - Ct(a), y = 1 << f;
      y & r | t[f] & r && (t[f] |= r), a &= ~y;
    }
  }
  var Pe = 0;
  function Zu(t) {
    return t &= -t, 1 < t ? 4 < t ? (t & 268435455) !== 0 ? 16 : 536870912 : 4 : 1;
  }
  var Yu, sl, Uu, $u, Qu, il = !1, rs = [], Bn = null, En = null, Dn = null, Po = /* @__PURE__ */ new Map(), Fo = /* @__PURE__ */ new Map(), Gn = [], Iw = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  function Ju(t, r) {
    switch (t) {
      case "focusin":
      case "focusout":
        Bn = null;
        break;
      case "dragenter":
      case "dragleave":
        En = null;
        break;
      case "mouseover":
      case "mouseout":
        Dn = null;
        break;
      case "pointerover":
      case "pointerout":
        Po.delete(r.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        Fo.delete(r.pointerId);
    }
  }
  function Vo(t, r, a, f, y, v) {
    return t === null || t.nativeEvent !== v ? (t = { blockedOn: r, domEventName: a, eventSystemFlags: f, nativeEvent: v, targetContainers: [y] }, r !== null && (r = qo(r), r !== null && sl(r)), t) : (t.eventSystemFlags |= f, r = t.targetContainers, y !== null && r.indexOf(y) === -1 && r.push(y), t);
  }
  function Cw(t, r, a, f, y) {
    switch (r) {
      case "focusin":
        return Bn = Vo(Bn, t, r, a, f, y), !0;
      case "dragenter":
        return En = Vo(En, t, r, a, f, y), !0;
      case "mouseover":
        return Dn = Vo(Dn, t, r, a, f, y), !0;
      case "pointerover":
        var v = y.pointerId;
        return Po.set(v, Vo(Po.get(v) || null, t, r, a, f, y)), !0;
      case "gotpointercapture":
        return v = y.pointerId, Fo.set(v, Vo(Fo.get(v) || null, t, r, a, f, y)), !0;
    }
    return !1;
  }
  function qu(t) {
    var r = cr(t.target);
    if (r !== null) {
      var a = Jt(r);
      if (a !== null) {
        if (r = a.tag, r === 13) {
          if (r = To(a), r !== null) {
            t.blockedOn = r, Qu(t.priority, function() {
              Uu(a);
            });
            return;
          }
        } else if (r === 3 && a.stateNode.current.memoizedState.isDehydrated) {
          t.blockedOn = a.tag === 3 ? a.stateNode.containerInfo : null;
          return;
        }
      }
    }
    t.blockedOn = null;
  }
  function os(t) {
    if (t.blockedOn !== null) return !1;
    for (var r = t.targetContainers; 0 < r.length; ) {
      var a = cl(t.domEventName, t.eventSystemFlags, r[0], t.nativeEvent);
      if (a === null) {
        a = t.nativeEvent;
        var f = new a.constructor(a.type, a);
        Ao = f, a.target.dispatchEvent(f), Ao = null;
      } else return r = qo(a), r !== null && sl(r), t.blockedOn = a, !1;
      r.shift();
    }
    return !0;
  }
  function ed(t, r, a) {
    os(t) && a.delete(r);
  }
  function bw() {
    il = !1, Bn !== null && os(Bn) && (Bn = null), En !== null && os(En) && (En = null), Dn !== null && os(Dn) && (Dn = null), Po.forEach(ed), Fo.forEach(ed);
  }
  function zo(t, r) {
    t.blockedOn === r && (t.blockedOn = null, il || (il = !0, n.unstable_scheduleCallback(n.unstable_NormalPriority, bw)));
  }
  function Oo(t) {
    function r(y) {
      return zo(y, t);
    }
    if (0 < rs.length) {
      zo(rs[0], t);
      for (var a = 1; a < rs.length; a++) {
        var f = rs[a];
        f.blockedOn === t && (f.blockedOn = null);
      }
    }
    for (Bn !== null && zo(Bn, t), En !== null && zo(En, t), Dn !== null && zo(Dn, t), Po.forEach(r), Fo.forEach(r), a = 0; a < Gn.length; a++) f = Gn[a], f.blockedOn === t && (f.blockedOn = null);
    for (; 0 < Gn.length && (a = Gn[0], a.blockedOn === null); ) qu(a), a.blockedOn === null && Gn.shift();
  }
  var Fr = S.ReactCurrentBatchConfig, as = !0;
  function _w(t, r, a, f) {
    var y = Pe, v = Fr.transition;
    Fr.transition = null;
    try {
      Pe = 1, ll(t, r, a, f);
    } finally {
      Pe = y, Fr.transition = v;
    }
  }
  function Nw(t, r, a, f) {
    var y = Pe, v = Fr.transition;
    Fr.transition = null;
    try {
      Pe = 4, ll(t, r, a, f);
    } finally {
      Pe = y, Fr.transition = v;
    }
  }
  function ll(t, r, a, f) {
    if (as) {
      var y = cl(t, r, a, f);
      if (y === null) Al(t, r, f, ss, a), Ju(t, f);
      else if (Cw(y, t, r, a, f)) f.stopPropagation();
      else if (Ju(t, f), r & 4 && -1 < Iw.indexOf(t)) {
        for (; y !== null; ) {
          var v = qo(y);
          if (v !== null && Yu(v), v = cl(t, r, a, f), v === null && Al(t, r, f, ss, a), v === y) break;
          y = v;
        }
        y !== null && f.stopPropagation();
      } else Al(t, r, f, null, a);
    }
  }
  var ss = null;
  function cl(t, r, a, f) {
    if (ss = null, t = So(f), t = cr(t), t !== null) if (r = Jt(t), r === null) t = null;
    else if (a = r.tag, a === 13) {
      if (t = To(r), t !== null) return t;
      t = null;
    } else if (a === 3) {
      if (r.stateNode.current.memoizedState.isDehydrated) return r.tag === 3 ? r.stateNode.containerInfo : null;
      t = null;
    } else r !== t && (t = null);
    return ss = t, null;
  }
  function td(t) {
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
        switch (Ji()) {
          case Eo:
            return 1;
          case qa:
            return 4;
          case Br:
          case qi:
            return 16;
          case es:
            return 536870912;
          default:
            return 16;
        }
      default:
        return 16;
    }
  }
  var Pn = null, ul = null, is = null;
  function nd() {
    if (is) return is;
    var t, r = ul, a = r.length, f, y = "value" in Pn ? Pn.value : Pn.textContent, v = y.length;
    for (t = 0; t < a && r[t] === y[t]; t++) ;
    var N = a - t;
    for (f = 1; f <= N && r[a - f] === y[v - f]; f++) ;
    return is = y.slice(t, 1 < f ? 1 - f : void 0);
  }
  function ls(t) {
    var r = t.keyCode;
    return "charCode" in t ? (t = t.charCode, t === 0 && r === 13 && (t = 13)) : t = r, t === 10 && (t = 13), 32 <= t || t === 13 ? t : 0;
  }
  function cs() {
    return !0;
  }
  function rd() {
    return !1;
  }
  function bt(t) {
    function r(a, f, y, v, N) {
      this._reactName = a, this._targetInst = y, this.type = f, this.nativeEvent = v, this.target = N, this.currentTarget = null;
      for (var B in t) t.hasOwnProperty(B) && (a = t[B], this[B] = a ? a(v) : v[B]);
      return this.isDefaultPrevented = (v.defaultPrevented != null ? v.defaultPrevented : v.returnValue === !1) ? cs : rd, this.isPropagationStopped = rd, this;
    }
    return Z(r.prototype, { preventDefault: function() {
      this.defaultPrevented = !0;
      var a = this.nativeEvent;
      a && (a.preventDefault ? a.preventDefault() : typeof a.returnValue != "unknown" && (a.returnValue = !1), this.isDefaultPrevented = cs);
    }, stopPropagation: function() {
      var a = this.nativeEvent;
      a && (a.stopPropagation ? a.stopPropagation() : typeof a.cancelBubble != "unknown" && (a.cancelBubble = !0), this.isPropagationStopped = cs);
    }, persist: function() {
    }, isPersistent: cs }), r;
  }
  var Vr = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(t) {
    return t.timeStamp || Date.now();
  }, defaultPrevented: 0, isTrusted: 0 }, dl = bt(Vr), Lo = Z({}, Vr, { view: 0, detail: 0 }), Aw = bt(Lo), fl, pl, Ho, us = Z({}, Lo, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: ml, button: 0, buttons: 0, relatedTarget: function(t) {
    return t.relatedTarget === void 0 ? t.fromElement === t.srcElement ? t.toElement : t.fromElement : t.relatedTarget;
  }, movementX: function(t) {
    return "movementX" in t ? t.movementX : (t !== Ho && (Ho && t.type === "mousemove" ? (fl = t.screenX - Ho.screenX, pl = t.screenY - Ho.screenY) : pl = fl = 0, Ho = t), fl);
  }, movementY: function(t) {
    return "movementY" in t ? t.movementY : pl;
  } }), od = bt(us), Sw = Z({}, us, { dataTransfer: 0 }), kw = bt(Sw), jw = Z({}, Lo, { relatedTarget: 0 }), gl = bt(jw), Mw = Z({}, Vr, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), Rw = bt(Mw), Tw = Z({}, Vr, { clipboardData: function(t) {
    return "clipboardData" in t ? t.clipboardData : window.clipboardData;
  } }), Bw = bt(Tw), Ew = Z({}, Vr, { data: 0 }), ad = bt(Ew), Dw = {
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
  }, Gw = {
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
  }, Pw = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function Fw(t) {
    var r = this.nativeEvent;
    return r.getModifierState ? r.getModifierState(t) : (t = Pw[t]) ? !!r[t] : !1;
  }
  function ml() {
    return Fw;
  }
  var Vw = Z({}, Lo, { key: function(t) {
    if (t.key) {
      var r = Dw[t.key] || t.key;
      if (r !== "Unidentified") return r;
    }
    return t.type === "keypress" ? (t = ls(t), t === 13 ? "Enter" : String.fromCharCode(t)) : t.type === "keydown" || t.type === "keyup" ? Gw[t.keyCode] || "Unidentified" : "";
  }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: ml, charCode: function(t) {
    return t.type === "keypress" ? ls(t) : 0;
  }, keyCode: function(t) {
    return t.type === "keydown" || t.type === "keyup" ? t.keyCode : 0;
  }, which: function(t) {
    return t.type === "keypress" ? ls(t) : t.type === "keydown" || t.type === "keyup" ? t.keyCode : 0;
  } }), zw = bt(Vw), Ow = Z({}, us, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), sd = bt(Ow), Lw = Z({}, Lo, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: ml }), Hw = bt(Lw), Ww = Z({}, Vr, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), Xw = bt(Ww), Kw = Z({}, us, {
    deltaX: function(t) {
      return "deltaX" in t ? t.deltaX : "wheelDeltaX" in t ? -t.wheelDeltaX : 0;
    },
    deltaY: function(t) {
      return "deltaY" in t ? t.deltaY : "wheelDeltaY" in t ? -t.wheelDeltaY : "wheelDelta" in t ? -t.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), Zw = bt(Kw), Yw = [9, 13, 27, 32], hl = u && "CompositionEvent" in window, Wo = null;
  u && "documentMode" in document && (Wo = document.documentMode);
  var Uw = u && "TextEvent" in window && !Wo, id = u && (!hl || Wo && 8 < Wo && 11 >= Wo), ld = " ", cd = !1;
  function ud(t, r) {
    switch (t) {
      case "keyup":
        return Yw.indexOf(r.keyCode) !== -1;
      case "keydown":
        return r.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function dd(t) {
    return t = t.detail, typeof t == "object" && "data" in t ? t.data : null;
  }
  var zr = !1;
  function $w(t, r) {
    switch (t) {
      case "compositionend":
        return dd(r);
      case "keypress":
        return r.which !== 32 ? null : (cd = !0, ld);
      case "textInput":
        return t = r.data, t === ld && cd ? null : t;
      default:
        return null;
    }
  }
  function Qw(t, r) {
    if (zr) return t === "compositionend" || !hl && ud(t, r) ? (t = nd(), is = ul = Pn = null, zr = !1, t) : null;
    switch (t) {
      case "paste":
        return null;
      case "keypress":
        if (!(r.ctrlKey || r.altKey || r.metaKey) || r.ctrlKey && r.altKey) {
          if (r.char && 1 < r.char.length) return r.char;
          if (r.which) return String.fromCharCode(r.which);
        }
        return null;
      case "compositionend":
        return id && r.locale !== "ko" ? null : r.data;
      default:
        return null;
    }
  }
  var Jw = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
  function fd(t) {
    var r = t && t.nodeName && t.nodeName.toLowerCase();
    return r === "input" ? !!Jw[t.type] : r === "textarea";
  }
  function pd(t, r, a, f) {
    Ha(f), r = ms(r, "onChange"), 0 < r.length && (a = new dl("onChange", "change", null, a, f), t.push({ event: a, listeners: r }));
  }
  var Xo = null, Ko = null;
  function qw(t) {
    Rd(t, 0);
  }
  function ds(t) {
    var r = Xr(t);
    if (Ce(r)) return t;
  }
  function ev(t, r) {
    if (t === "change") return r;
  }
  var gd = !1;
  if (u) {
    var yl;
    if (u) {
      var wl = "oninput" in document;
      if (!wl) {
        var md = document.createElement("div");
        md.setAttribute("oninput", "return;"), wl = typeof md.oninput == "function";
      }
      yl = wl;
    } else yl = !1;
    gd = yl && (!document.documentMode || 9 < document.documentMode);
  }
  function hd() {
    Xo && (Xo.detachEvent("onpropertychange", yd), Ko = Xo = null);
  }
  function yd(t) {
    if (t.propertyName === "value" && ds(Ko)) {
      var r = [];
      pd(r, Ko, t, So(t)), Za(qw, r);
    }
  }
  function tv(t, r, a) {
    t === "focusin" ? (hd(), Xo = r, Ko = a, Xo.attachEvent("onpropertychange", yd)) : t === "focusout" && hd();
  }
  function nv(t) {
    if (t === "selectionchange" || t === "keyup" || t === "keydown") return ds(Ko);
  }
  function rv(t, r) {
    if (t === "click") return ds(r);
  }
  function ov(t, r) {
    if (t === "input" || t === "change") return ds(r);
  }
  function av(t, r) {
    return t === r && (t !== 0 || 1 / t === 1 / r) || t !== t && r !== r;
  }
  var Vt = typeof Object.is == "function" ? Object.is : av;
  function Zo(t, r) {
    if (Vt(t, r)) return !0;
    if (typeof t != "object" || t === null || typeof r != "object" || r === null) return !1;
    var a = Object.keys(t), f = Object.keys(r);
    if (a.length !== f.length) return !1;
    for (f = 0; f < a.length; f++) {
      var y = a[f];
      if (!p.call(r, y) || !Vt(t[y], r[y])) return !1;
    }
    return !0;
  }
  function wd(t) {
    for (; t && t.firstChild; ) t = t.firstChild;
    return t;
  }
  function vd(t, r) {
    var a = wd(t);
    t = 0;
    for (var f; a; ) {
      if (a.nodeType === 3) {
        if (f = t + a.textContent.length, t <= r && f >= r) return { node: a, offset: r - t };
        t = f;
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
      a = wd(a);
    }
  }
  function xd(t, r) {
    return t && r ? t === r ? !0 : t && t.nodeType === 3 ? !1 : r && r.nodeType === 3 ? xd(t, r.parentNode) : "contains" in t ? t.contains(r) : t.compareDocumentPosition ? !!(t.compareDocumentPosition(r) & 16) : !1 : !1;
  }
  function Id() {
    for (var t = window, r = xe(); r instanceof t.HTMLIFrameElement; ) {
      try {
        var a = typeof r.contentWindow.location.href == "string";
      } catch {
        a = !1;
      }
      if (a) t = r.contentWindow;
      else break;
      r = xe(t.document);
    }
    return r;
  }
  function vl(t) {
    var r = t && t.nodeName && t.nodeName.toLowerCase();
    return r && (r === "input" && (t.type === "text" || t.type === "search" || t.type === "tel" || t.type === "url" || t.type === "password") || r === "textarea" || t.contentEditable === "true");
  }
  function sv(t) {
    var r = Id(), a = t.focusedElem, f = t.selectionRange;
    if (r !== a && a && a.ownerDocument && xd(a.ownerDocument.documentElement, a)) {
      if (f !== null && vl(a)) {
        if (r = f.start, t = f.end, t === void 0 && (t = r), "selectionStart" in a) a.selectionStart = r, a.selectionEnd = Math.min(t, a.value.length);
        else if (t = (r = a.ownerDocument || document) && r.defaultView || window, t.getSelection) {
          t = t.getSelection();
          var y = a.textContent.length, v = Math.min(f.start, y);
          f = f.end === void 0 ? v : Math.min(f.end, y), !t.extend && v > f && (y = f, f = v, v = y), y = vd(a, v);
          var N = vd(
            a,
            f
          );
          y && N && (t.rangeCount !== 1 || t.anchorNode !== y.node || t.anchorOffset !== y.offset || t.focusNode !== N.node || t.focusOffset !== N.offset) && (r = r.createRange(), r.setStart(y.node, y.offset), t.removeAllRanges(), v > f ? (t.addRange(r), t.extend(N.node, N.offset)) : (r.setEnd(N.node, N.offset), t.addRange(r)));
        }
      }
      for (r = [], t = a; t = t.parentNode; ) t.nodeType === 1 && r.push({ element: t, left: t.scrollLeft, top: t.scrollTop });
      for (typeof a.focus == "function" && a.focus(), a = 0; a < r.length; a++) t = r[a], t.element.scrollLeft = t.left, t.element.scrollTop = t.top;
    }
  }
  var iv = u && "documentMode" in document && 11 >= document.documentMode, Or = null, xl = null, Yo = null, Il = !1;
  function Cd(t, r, a) {
    var f = a.window === a ? a.document : a.nodeType === 9 ? a : a.ownerDocument;
    Il || Or == null || Or !== xe(f) || (f = Or, "selectionStart" in f && vl(f) ? f = { start: f.selectionStart, end: f.selectionEnd } : (f = (f.ownerDocument && f.ownerDocument.defaultView || window).getSelection(), f = { anchorNode: f.anchorNode, anchorOffset: f.anchorOffset, focusNode: f.focusNode, focusOffset: f.focusOffset }), Yo && Zo(Yo, f) || (Yo = f, f = ms(xl, "onSelect"), 0 < f.length && (r = new dl("onSelect", "select", null, r, a), t.push({ event: r, listeners: f }), r.target = Or)));
  }
  function fs(t, r) {
    var a = {};
    return a[t.toLowerCase()] = r.toLowerCase(), a["Webkit" + t] = "webkit" + r, a["Moz" + t] = "moz" + r, a;
  }
  var Lr = { animationend: fs("Animation", "AnimationEnd"), animationiteration: fs("Animation", "AnimationIteration"), animationstart: fs("Animation", "AnimationStart"), transitionend: fs("Transition", "TransitionEnd") }, Cl = {}, bd = {};
  u && (bd = document.createElement("div").style, "AnimationEvent" in window || (delete Lr.animationend.animation, delete Lr.animationiteration.animation, delete Lr.animationstart.animation), "TransitionEvent" in window || delete Lr.transitionend.transition);
  function ps(t) {
    if (Cl[t]) return Cl[t];
    if (!Lr[t]) return t;
    var r = Lr[t], a;
    for (a in r) if (r.hasOwnProperty(a) && a in bd) return Cl[t] = r[a];
    return t;
  }
  var _d = ps("animationend"), Nd = ps("animationiteration"), Ad = ps("animationstart"), Sd = ps("transitionend"), kd = /* @__PURE__ */ new Map(), jd = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function Fn(t, r) {
    kd.set(t, r), l(r, [t]);
  }
  for (var bl = 0; bl < jd.length; bl++) {
    var _l = jd[bl], lv = _l.toLowerCase(), cv = _l[0].toUpperCase() + _l.slice(1);
    Fn(lv, "on" + cv);
  }
  Fn(_d, "onAnimationEnd"), Fn(Nd, "onAnimationIteration"), Fn(Ad, "onAnimationStart"), Fn("dblclick", "onDoubleClick"), Fn("focusin", "onFocus"), Fn("focusout", "onBlur"), Fn(Sd, "onTransitionEnd"), c("onMouseEnter", ["mouseout", "mouseover"]), c("onMouseLeave", ["mouseout", "mouseover"]), c("onPointerEnter", ["pointerout", "pointerover"]), c("onPointerLeave", ["pointerout", "pointerover"]), l("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), l("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), l("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), l("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), l("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), l("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var Uo = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), uv = new Set("cancel close invalid load scroll toggle".split(" ").concat(Uo));
  function Md(t, r, a) {
    var f = t.type || "unknown-event";
    t.currentTarget = a, Ui(f, r, void 0, t), t.currentTarget = null;
  }
  function Rd(t, r) {
    r = (r & 4) !== 0;
    for (var a = 0; a < t.length; a++) {
      var f = t[a], y = f.event;
      f = f.listeners;
      e: {
        var v = void 0;
        if (r) for (var N = f.length - 1; 0 <= N; N--) {
          var B = f[N], O = B.instance, ee = B.currentTarget;
          if (B = B.listener, O !== v && y.isPropagationStopped()) break e;
          Md(y, B, ee), v = O;
        }
        else for (N = 0; N < f.length; N++) {
          if (B = f[N], O = B.instance, ee = B.currentTarget, B = B.listener, O !== v && y.isPropagationStopped()) break e;
          Md(y, B, ee), v = O;
        }
      }
    }
    if (Tr) throw t = Ro, Tr = !1, Ro = null, t;
  }
  function Ve(t, r) {
    var a = r[Tl];
    a === void 0 && (a = r[Tl] = /* @__PURE__ */ new Set());
    var f = t + "__bubble";
    a.has(f) || (Td(r, t, 2, !1), a.add(f));
  }
  function Nl(t, r, a) {
    var f = 0;
    r && (f |= 4), Td(a, t, f, r);
  }
  var gs = "_reactListening" + Math.random().toString(36).slice(2);
  function $o(t) {
    if (!t[gs]) {
      t[gs] = !0, s.forEach(function(a) {
        a !== "selectionchange" && (uv.has(a) || Nl(a, !1, t), Nl(a, !0, t));
      });
      var r = t.nodeType === 9 ? t : t.ownerDocument;
      r === null || r[gs] || (r[gs] = !0, Nl("selectionchange", !1, r));
    }
  }
  function Td(t, r, a, f) {
    switch (td(r)) {
      case 1:
        var y = _w;
        break;
      case 4:
        y = Nw;
        break;
      default:
        y = ll;
    }
    a = y.bind(null, r, a, t), y = void 0, !Mo || r !== "touchstart" && r !== "touchmove" && r !== "wheel" || (y = !0), f ? y !== void 0 ? t.addEventListener(r, a, { capture: !0, passive: y }) : t.addEventListener(r, a, !0) : y !== void 0 ? t.addEventListener(r, a, { passive: y }) : t.addEventListener(r, a, !1);
  }
  function Al(t, r, a, f, y) {
    var v = f;
    if ((r & 1) === 0 && (r & 2) === 0 && f !== null) e: for (; ; ) {
      if (f === null) return;
      var N = f.tag;
      if (N === 3 || N === 4) {
        var B = f.stateNode.containerInfo;
        if (B === y || B.nodeType === 8 && B.parentNode === y) break;
        if (N === 4) for (N = f.return; N !== null; ) {
          var O = N.tag;
          if ((O === 3 || O === 4) && (O = N.stateNode.containerInfo, O === y || O.nodeType === 8 && O.parentNode === y)) return;
          N = N.return;
        }
        for (; B !== null; ) {
          if (N = cr(B), N === null) return;
          if (O = N.tag, O === 5 || O === 6) {
            f = v = N;
            continue e;
          }
          B = B.parentNode;
        }
      }
      f = f.return;
    }
    Za(function() {
      var ee = v, se = So(a), ie = [];
      e: {
        var ae = kd.get(t);
        if (ae !== void 0) {
          var ge = dl, ye = t;
          switch (t) {
            case "keypress":
              if (ls(a) === 0) break e;
            case "keydown":
            case "keyup":
              ge = zw;
              break;
            case "focusin":
              ye = "focus", ge = gl;
              break;
            case "focusout":
              ye = "blur", ge = gl;
              break;
            case "beforeblur":
            case "afterblur":
              ge = gl;
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
              ge = od;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              ge = kw;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              ge = Hw;
              break;
            case _d:
            case Nd:
            case Ad:
              ge = Rw;
              break;
            case Sd:
              ge = Xw;
              break;
            case "scroll":
              ge = Aw;
              break;
            case "wheel":
              ge = Zw;
              break;
            case "copy":
            case "cut":
            case "paste":
              ge = Bw;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              ge = sd;
          }
          var ve = (r & 4) !== 0, Ue = !ve && t === "scroll", $ = ve ? ae !== null ? ae + "Capture" : null : ae;
          ve = [];
          for (var X = ee, J; X !== null; ) {
            J = X;
            var ce = J.stateNode;
            if (J.tag === 5 && ce !== null && (J = ce, $ !== null && (ce = or(X, $), ce != null && ve.push(Qo(X, ce, J)))), Ue) break;
            X = X.return;
          }
          0 < ve.length && (ae = new ge(ae, ye, null, a, se), ie.push({ event: ae, listeners: ve }));
        }
      }
      if ((r & 7) === 0) {
        e: {
          if (ae = t === "mouseover" || t === "pointerover", ge = t === "mouseout" || t === "pointerout", ae && a !== Ao && (ye = a.relatedTarget || a.fromElement) && (cr(ye) || ye[gn])) break e;
          if ((ge || ae) && (ae = se.window === se ? se : (ae = se.ownerDocument) ? ae.defaultView || ae.parentWindow : window, ge ? (ye = a.relatedTarget || a.toElement, ge = ee, ye = ye ? cr(ye) : null, ye !== null && (Ue = Jt(ye), ye !== Ue || ye.tag !== 5 && ye.tag !== 6) && (ye = null)) : (ge = null, ye = ee), ge !== ye)) {
            if (ve = od, ce = "onMouseLeave", $ = "onMouseEnter", X = "mouse", (t === "pointerout" || t === "pointerover") && (ve = sd, ce = "onPointerLeave", $ = "onPointerEnter", X = "pointer"), Ue = ge == null ? ae : Xr(ge), J = ye == null ? ae : Xr(ye), ae = new ve(ce, X + "leave", ge, a, se), ae.target = Ue, ae.relatedTarget = J, ce = null, cr(se) === ee && (ve = new ve($, X + "enter", ye, a, se), ve.target = J, ve.relatedTarget = Ue, ce = ve), Ue = ce, ge && ye) t: {
              for (ve = ge, $ = ye, X = 0, J = ve; J; J = Hr(J)) X++;
              for (J = 0, ce = $; ce; ce = Hr(ce)) J++;
              for (; 0 < X - J; ) ve = Hr(ve), X--;
              for (; 0 < J - X; ) $ = Hr($), J--;
              for (; X--; ) {
                if (ve === $ || $ !== null && ve === $.alternate) break t;
                ve = Hr(ve), $ = Hr($);
              }
              ve = null;
            }
            else ve = null;
            ge !== null && Bd(ie, ae, ge, ve, !1), ye !== null && Ue !== null && Bd(ie, Ue, ye, ve, !0);
          }
        }
        e: {
          if (ae = ee ? Xr(ee) : window, ge = ae.nodeName && ae.nodeName.toLowerCase(), ge === "select" || ge === "input" && ae.type === "file") var Ie = ev;
          else if (fd(ae)) if (gd) Ie = ov;
          else {
            Ie = nv;
            var Ne = tv;
          }
          else (ge = ae.nodeName) && ge.toLowerCase() === "input" && (ae.type === "checkbox" || ae.type === "radio") && (Ie = rv);
          if (Ie && (Ie = Ie(t, ee))) {
            pd(ie, Ie, a, se);
            break e;
          }
          Ne && Ne(t, ae, ee), t === "focusout" && (Ne = ae._wrapperState) && Ne.controlled && ae.type === "number" && xt(ae, "number", ae.value);
        }
        switch (Ne = ee ? Xr(ee) : window, t) {
          case "focusin":
            (fd(Ne) || Ne.contentEditable === "true") && (Or = Ne, xl = ee, Yo = null);
            break;
          case "focusout":
            Yo = xl = Or = null;
            break;
          case "mousedown":
            Il = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            Il = !1, Cd(ie, a, se);
            break;
          case "selectionchange":
            if (iv) break;
          case "keydown":
          case "keyup":
            Cd(ie, a, se);
        }
        var Ae;
        if (hl) e: {
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
        else zr ? ud(t, a) && (ke = "onCompositionEnd") : t === "keydown" && a.keyCode === 229 && (ke = "onCompositionStart");
        ke && (id && a.locale !== "ko" && (zr || ke !== "onCompositionStart" ? ke === "onCompositionEnd" && zr && (Ae = nd()) : (Pn = se, ul = "value" in Pn ? Pn.value : Pn.textContent, zr = !0)), Ne = ms(ee, ke), 0 < Ne.length && (ke = new ad(ke, t, null, a, se), ie.push({ event: ke, listeners: Ne }), Ae ? ke.data = Ae : (Ae = dd(a), Ae !== null && (ke.data = Ae)))), (Ae = Uw ? $w(t, a) : Qw(t, a)) && (ee = ms(ee, "onBeforeInput"), 0 < ee.length && (se = new ad("onBeforeInput", "beforeinput", null, a, se), ie.push({ event: se, listeners: ee }), se.data = Ae));
      }
      Rd(ie, r);
    });
  }
  function Qo(t, r, a) {
    return { instance: t, listener: r, currentTarget: a };
  }
  function ms(t, r) {
    for (var a = r + "Capture", f = []; t !== null; ) {
      var y = t, v = y.stateNode;
      y.tag === 5 && v !== null && (y = v, v = or(t, a), v != null && f.unshift(Qo(t, v, y)), v = or(t, r), v != null && f.push(Qo(t, v, y))), t = t.return;
    }
    return f;
  }
  function Hr(t) {
    if (t === null) return null;
    do
      t = t.return;
    while (t && t.tag !== 5);
    return t || null;
  }
  function Bd(t, r, a, f, y) {
    for (var v = r._reactName, N = []; a !== null && a !== f; ) {
      var B = a, O = B.alternate, ee = B.stateNode;
      if (O !== null && O === f) break;
      B.tag === 5 && ee !== null && (B = ee, y ? (O = or(a, v), O != null && N.unshift(Qo(a, O, B))) : y || (O = or(a, v), O != null && N.push(Qo(a, O, B)))), a = a.return;
    }
    N.length !== 0 && t.push({ event: r, listeners: N });
  }
  var dv = /\r\n?/g, fv = /\u0000|\uFFFD/g;
  function Ed(t) {
    return (typeof t == "string" ? t : "" + t).replace(dv, `
`).replace(fv, "");
  }
  function hs(t, r, a) {
    if (r = Ed(r), Ed(t) !== r && a) throw Error(o(425));
  }
  function ys() {
  }
  var Sl = null, kl = null;
  function jl(t, r) {
    return t === "textarea" || t === "noscript" || typeof r.children == "string" || typeof r.children == "number" || typeof r.dangerouslySetInnerHTML == "object" && r.dangerouslySetInnerHTML !== null && r.dangerouslySetInnerHTML.__html != null;
  }
  var Ml = typeof setTimeout == "function" ? setTimeout : void 0, pv = typeof clearTimeout == "function" ? clearTimeout : void 0, Dd = typeof Promise == "function" ? Promise : void 0, gv = typeof queueMicrotask == "function" ? queueMicrotask : typeof Dd < "u" ? function(t) {
    return Dd.resolve(null).then(t).catch(mv);
  } : Ml;
  function mv(t) {
    setTimeout(function() {
      throw t;
    });
  }
  function Rl(t, r) {
    var a = r, f = 0;
    do {
      var y = a.nextSibling;
      if (t.removeChild(a), y && y.nodeType === 8) if (a = y.data, a === "/$") {
        if (f === 0) {
          t.removeChild(y), Oo(r);
          return;
        }
        f--;
      } else a !== "$" && a !== "$?" && a !== "$!" || f++;
      a = y;
    } while (a);
    Oo(r);
  }
  function Vn(t) {
    for (; t != null; t = t.nextSibling) {
      var r = t.nodeType;
      if (r === 1 || r === 3) break;
      if (r === 8) {
        if (r = t.data, r === "$" || r === "$!" || r === "$?") break;
        if (r === "/$") return null;
      }
    }
    return t;
  }
  function Gd(t) {
    t = t.previousSibling;
    for (var r = 0; t; ) {
      if (t.nodeType === 8) {
        var a = t.data;
        if (a === "$" || a === "$!" || a === "$?") {
          if (r === 0) return t;
          r--;
        } else a === "/$" && r++;
      }
      t = t.previousSibling;
    }
    return null;
  }
  var Wr = Math.random().toString(36).slice(2), en = "__reactFiber$" + Wr, Jo = "__reactProps$" + Wr, gn = "__reactContainer$" + Wr, Tl = "__reactEvents$" + Wr, hv = "__reactListeners$" + Wr, yv = "__reactHandles$" + Wr;
  function cr(t) {
    var r = t[en];
    if (r) return r;
    for (var a = t.parentNode; a; ) {
      if (r = a[gn] || a[en]) {
        if (a = r.alternate, r.child !== null || a !== null && a.child !== null) for (t = Gd(t); t !== null; ) {
          if (a = t[en]) return a;
          t = Gd(t);
        }
        return r;
      }
      t = a, a = t.parentNode;
    }
    return null;
  }
  function qo(t) {
    return t = t[en] || t[gn], !t || t.tag !== 5 && t.tag !== 6 && t.tag !== 13 && t.tag !== 3 ? null : t;
  }
  function Xr(t) {
    if (t.tag === 5 || t.tag === 6) return t.stateNode;
    throw Error(o(33));
  }
  function ws(t) {
    return t[Jo] || null;
  }
  var Bl = [], Kr = -1;
  function zn(t) {
    return { current: t };
  }
  function ze(t) {
    0 > Kr || (t.current = Bl[Kr], Bl[Kr] = null, Kr--);
  }
  function Fe(t, r) {
    Kr++, Bl[Kr] = t.current, t.current = r;
  }
  var On = {}, at = zn(On), pt = zn(!1), ur = On;
  function Zr(t, r) {
    var a = t.type.contextTypes;
    if (!a) return On;
    var f = t.stateNode;
    if (f && f.__reactInternalMemoizedUnmaskedChildContext === r) return f.__reactInternalMemoizedMaskedChildContext;
    var y = {}, v;
    for (v in a) y[v] = r[v];
    return f && (t = t.stateNode, t.__reactInternalMemoizedUnmaskedChildContext = r, t.__reactInternalMemoizedMaskedChildContext = y), y;
  }
  function gt(t) {
    return t = t.childContextTypes, t != null;
  }
  function vs() {
    ze(pt), ze(at);
  }
  function Pd(t, r, a) {
    if (at.current !== On) throw Error(o(168));
    Fe(at, r), Fe(pt, a);
  }
  function Fd(t, r, a) {
    var f = t.stateNode;
    if (r = r.childContextTypes, typeof f.getChildContext != "function") return a;
    f = f.getChildContext();
    for (var y in f) if (!(y in r)) throw Error(o(108, fe(t) || "Unknown", y));
    return Z({}, a, f);
  }
  function xs(t) {
    return t = (t = t.stateNode) && t.__reactInternalMemoizedMergedChildContext || On, ur = at.current, Fe(at, t), Fe(pt, pt.current), !0;
  }
  function Vd(t, r, a) {
    var f = t.stateNode;
    if (!f) throw Error(o(169));
    a ? (t = Fd(t, r, ur), f.__reactInternalMemoizedMergedChildContext = t, ze(pt), ze(at), Fe(at, t)) : ze(pt), Fe(pt, a);
  }
  var mn = null, Is = !1, El = !1;
  function zd(t) {
    mn === null ? mn = [t] : mn.push(t);
  }
  function wv(t) {
    Is = !0, zd(t);
  }
  function Ln() {
    if (!El && mn !== null) {
      El = !0;
      var t = 0, r = Pe;
      try {
        var a = mn;
        for (Pe = 1; t < a.length; t++) {
          var f = a[t];
          do
            f = f(!0);
          while (f !== null);
        }
        mn = null, Is = !1;
      } catch (y) {
        throw mn !== null && (mn = mn.slice(t + 1)), $a(Eo, Ln), y;
      } finally {
        Pe = r, El = !1;
      }
    }
    return null;
  }
  var Yr = [], Ur = 0, Cs = null, bs = 0, Tt = [], Bt = 0, dr = null, hn = 1, yn = "";
  function fr(t, r) {
    Yr[Ur++] = bs, Yr[Ur++] = Cs, Cs = t, bs = r;
  }
  function Od(t, r, a) {
    Tt[Bt++] = hn, Tt[Bt++] = yn, Tt[Bt++] = dr, dr = t;
    var f = hn;
    t = yn;
    var y = 32 - Ct(f) - 1;
    f &= ~(1 << y), a += 1;
    var v = 32 - Ct(r) + y;
    if (30 < v) {
      var N = y - y % 5;
      v = (f & (1 << N) - 1).toString(32), f >>= N, y -= N, hn = 1 << 32 - Ct(r) + y | a << y | f, yn = v + t;
    } else hn = 1 << v | a << y | f, yn = t;
  }
  function Dl(t) {
    t.return !== null && (fr(t, 1), Od(t, 1, 0));
  }
  function Gl(t) {
    for (; t === Cs; ) Cs = Yr[--Ur], Yr[Ur] = null, bs = Yr[--Ur], Yr[Ur] = null;
    for (; t === dr; ) dr = Tt[--Bt], Tt[Bt] = null, yn = Tt[--Bt], Tt[Bt] = null, hn = Tt[--Bt], Tt[Bt] = null;
  }
  var _t = null, Nt = null, Oe = !1, zt = null;
  function Ld(t, r) {
    var a = Pt(5, null, null, 0);
    a.elementType = "DELETED", a.stateNode = r, a.return = t, r = t.deletions, r === null ? (t.deletions = [a], t.flags |= 16) : r.push(a);
  }
  function Hd(t, r) {
    switch (t.tag) {
      case 5:
        var a = t.type;
        return r = r.nodeType !== 1 || a.toLowerCase() !== r.nodeName.toLowerCase() ? null : r, r !== null ? (t.stateNode = r, _t = t, Nt = Vn(r.firstChild), !0) : !1;
      case 6:
        return r = t.pendingProps === "" || r.nodeType !== 3 ? null : r, r !== null ? (t.stateNode = r, _t = t, Nt = null, !0) : !1;
      case 13:
        return r = r.nodeType !== 8 ? null : r, r !== null ? (a = dr !== null ? { id: hn, overflow: yn } : null, t.memoizedState = { dehydrated: r, treeContext: a, retryLane: 1073741824 }, a = Pt(18, null, null, 0), a.stateNode = r, a.return = t, t.child = a, _t = t, Nt = null, !0) : !1;
      default:
        return !1;
    }
  }
  function Pl(t) {
    return (t.mode & 1) !== 0 && (t.flags & 128) === 0;
  }
  function Fl(t) {
    if (Oe) {
      var r = Nt;
      if (r) {
        var a = r;
        if (!Hd(t, r)) {
          if (Pl(t)) throw Error(o(418));
          r = Vn(a.nextSibling);
          var f = _t;
          r && Hd(t, r) ? Ld(f, a) : (t.flags = t.flags & -4097 | 2, Oe = !1, _t = t);
        }
      } else {
        if (Pl(t)) throw Error(o(418));
        t.flags = t.flags & -4097 | 2, Oe = !1, _t = t;
      }
    }
  }
  function Wd(t) {
    for (t = t.return; t !== null && t.tag !== 5 && t.tag !== 3 && t.tag !== 13; ) t = t.return;
    _t = t;
  }
  function _s(t) {
    if (t !== _t) return !1;
    if (!Oe) return Wd(t), Oe = !0, !1;
    var r;
    if ((r = t.tag !== 3) && !(r = t.tag !== 5) && (r = t.type, r = r !== "head" && r !== "body" && !jl(t.type, t.memoizedProps)), r && (r = Nt)) {
      if (Pl(t)) throw Xd(), Error(o(418));
      for (; r; ) Ld(t, r), r = Vn(r.nextSibling);
    }
    if (Wd(t), t.tag === 13) {
      if (t = t.memoizedState, t = t !== null ? t.dehydrated : null, !t) throw Error(o(317));
      e: {
        for (t = t.nextSibling, r = 0; t; ) {
          if (t.nodeType === 8) {
            var a = t.data;
            if (a === "/$") {
              if (r === 0) {
                Nt = Vn(t.nextSibling);
                break e;
              }
              r--;
            } else a !== "$" && a !== "$!" && a !== "$?" || r++;
          }
          t = t.nextSibling;
        }
        Nt = null;
      }
    } else Nt = _t ? Vn(t.stateNode.nextSibling) : null;
    return !0;
  }
  function Xd() {
    for (var t = Nt; t; ) t = Vn(t.nextSibling);
  }
  function $r() {
    Nt = _t = null, Oe = !1;
  }
  function Vl(t) {
    zt === null ? zt = [t] : zt.push(t);
  }
  var vv = S.ReactCurrentBatchConfig;
  function ea(t, r, a) {
    if (t = a.ref, t !== null && typeof t != "function" && typeof t != "object") {
      if (a._owner) {
        if (a = a._owner, a) {
          if (a.tag !== 1) throw Error(o(309));
          var f = a.stateNode;
        }
        if (!f) throw Error(o(147, t));
        var y = f, v = "" + t;
        return r !== null && r.ref !== null && typeof r.ref == "function" && r.ref._stringRef === v ? r.ref : (r = function(N) {
          var B = y.refs;
          N === null ? delete B[v] : B[v] = N;
        }, r._stringRef = v, r);
      }
      if (typeof t != "string") throw Error(o(284));
      if (!a._owner) throw Error(o(290, t));
    }
    return t;
  }
  function Ns(t, r) {
    throw t = Object.prototype.toString.call(r), Error(o(31, t === "[object Object]" ? "object with keys {" + Object.keys(r).join(", ") + "}" : t));
  }
  function Kd(t) {
    var r = t._init;
    return r(t._payload);
  }
  function Zd(t) {
    function r($, X) {
      if (t) {
        var J = $.deletions;
        J === null ? ($.deletions = [X], $.flags |= 16) : J.push(X);
      }
    }
    function a($, X) {
      if (!t) return null;
      for (; X !== null; ) r($, X), X = X.sibling;
      return null;
    }
    function f($, X) {
      for ($ = /* @__PURE__ */ new Map(); X !== null; ) X.key !== null ? $.set(X.key, X) : $.set(X.index, X), X = X.sibling;
      return $;
    }
    function y($, X) {
      return $ = $n($, X), $.index = 0, $.sibling = null, $;
    }
    function v($, X, J) {
      return $.index = J, t ? (J = $.alternate, J !== null ? (J = J.index, J < X ? ($.flags |= 2, X) : J) : ($.flags |= 2, X)) : ($.flags |= 1048576, X);
    }
    function N($) {
      return t && $.alternate === null && ($.flags |= 2), $;
    }
    function B($, X, J, ce) {
      return X === null || X.tag !== 6 ? (X = Mc(J, $.mode, ce), X.return = $, X) : (X = y(X, J), X.return = $, X);
    }
    function O($, X, J, ce) {
      var Ie = J.type;
      return Ie === T ? se($, X, J.props.children, ce, J.key) : X !== null && (X.elementType === Ie || typeof Ie == "object" && Ie !== null && Ie.$$typeof === H && Kd(Ie) === X.type) ? (ce = y(X, J.props), ce.ref = ea($, X, J), ce.return = $, ce) : (ce = Us(J.type, J.key, J.props, null, $.mode, ce), ce.ref = ea($, X, J), ce.return = $, ce);
    }
    function ee($, X, J, ce) {
      return X === null || X.tag !== 4 || X.stateNode.containerInfo !== J.containerInfo || X.stateNode.implementation !== J.implementation ? (X = Rc(J, $.mode, ce), X.return = $, X) : (X = y(X, J.children || []), X.return = $, X);
    }
    function se($, X, J, ce, Ie) {
      return X === null || X.tag !== 7 ? (X = xr(J, $.mode, ce, Ie), X.return = $, X) : (X = y(X, J), X.return = $, X);
    }
    function ie($, X, J) {
      if (typeof X == "string" && X !== "" || typeof X == "number") return X = Mc("" + X, $.mode, J), X.return = $, X;
      if (typeof X == "object" && X !== null) {
        switch (X.$$typeof) {
          case V:
            return J = Us(X.type, X.key, X.props, null, $.mode, J), J.ref = ea($, null, X), J.return = $, J;
          case G:
            return X = Rc(X, $.mode, J), X.return = $, X;
          case H:
            var ce = X._init;
            return ie($, ce(X._payload), J);
        }
        if (It(X) || P(X)) return X = xr(X, $.mode, J, null), X.return = $, X;
        Ns($, X);
      }
      return null;
    }
    function ae($, X, J, ce) {
      var Ie = X !== null ? X.key : null;
      if (typeof J == "string" && J !== "" || typeof J == "number") return Ie !== null ? null : B($, X, "" + J, ce);
      if (typeof J == "object" && J !== null) {
        switch (J.$$typeof) {
          case V:
            return J.key === Ie ? O($, X, J, ce) : null;
          case G:
            return J.key === Ie ? ee($, X, J, ce) : null;
          case H:
            return Ie = J._init, ae(
              $,
              X,
              Ie(J._payload),
              ce
            );
        }
        if (It(J) || P(J)) return Ie !== null ? null : se($, X, J, ce, null);
        Ns($, J);
      }
      return null;
    }
    function ge($, X, J, ce, Ie) {
      if (typeof ce == "string" && ce !== "" || typeof ce == "number") return $ = $.get(J) || null, B(X, $, "" + ce, Ie);
      if (typeof ce == "object" && ce !== null) {
        switch (ce.$$typeof) {
          case V:
            return $ = $.get(ce.key === null ? J : ce.key) || null, O(X, $, ce, Ie);
          case G:
            return $ = $.get(ce.key === null ? J : ce.key) || null, ee(X, $, ce, Ie);
          case H:
            var Ne = ce._init;
            return ge($, X, J, Ne(ce._payload), Ie);
        }
        if (It(ce) || P(ce)) return $ = $.get(J) || null, se(X, $, ce, Ie, null);
        Ns(X, ce);
      }
      return null;
    }
    function ye($, X, J, ce) {
      for (var Ie = null, Ne = null, Ae = X, ke = X = 0, nt = null; Ae !== null && ke < J.length; ke++) {
        Ae.index > ke ? (nt = Ae, Ae = null) : nt = Ae.sibling;
        var De = ae($, Ae, J[ke], ce);
        if (De === null) {
          Ae === null && (Ae = nt);
          break;
        }
        t && Ae && De.alternate === null && r($, Ae), X = v(De, X, ke), Ne === null ? Ie = De : Ne.sibling = De, Ne = De, Ae = nt;
      }
      if (ke === J.length) return a($, Ae), Oe && fr($, ke), Ie;
      if (Ae === null) {
        for (; ke < J.length; ke++) Ae = ie($, J[ke], ce), Ae !== null && (X = v(Ae, X, ke), Ne === null ? Ie = Ae : Ne.sibling = Ae, Ne = Ae);
        return Oe && fr($, ke), Ie;
      }
      for (Ae = f($, Ae); ke < J.length; ke++) nt = ge(Ae, $, ke, J[ke], ce), nt !== null && (t && nt.alternate !== null && Ae.delete(nt.key === null ? ke : nt.key), X = v(nt, X, ke), Ne === null ? Ie = nt : Ne.sibling = nt, Ne = nt);
      return t && Ae.forEach(function(Qn) {
        return r($, Qn);
      }), Oe && fr($, ke), Ie;
    }
    function ve($, X, J, ce) {
      var Ie = P(J);
      if (typeof Ie != "function") throw Error(o(150));
      if (J = Ie.call(J), J == null) throw Error(o(151));
      for (var Ne = Ie = null, Ae = X, ke = X = 0, nt = null, De = J.next(); Ae !== null && !De.done; ke++, De = J.next()) {
        Ae.index > ke ? (nt = Ae, Ae = null) : nt = Ae.sibling;
        var Qn = ae($, Ae, De.value, ce);
        if (Qn === null) {
          Ae === null && (Ae = nt);
          break;
        }
        t && Ae && Qn.alternate === null && r($, Ae), X = v(Qn, X, ke), Ne === null ? Ie = Qn : Ne.sibling = Qn, Ne = Qn, Ae = nt;
      }
      if (De.done) return a(
        $,
        Ae
      ), Oe && fr($, ke), Ie;
      if (Ae === null) {
        for (; !De.done; ke++, De = J.next()) De = ie($, De.value, ce), De !== null && (X = v(De, X, ke), Ne === null ? Ie = De : Ne.sibling = De, Ne = De);
        return Oe && fr($, ke), Ie;
      }
      for (Ae = f($, Ae); !De.done; ke++, De = J.next()) De = ge(Ae, $, ke, De.value, ce), De !== null && (t && De.alternate !== null && Ae.delete(De.key === null ? ke : De.key), X = v(De, X, ke), Ne === null ? Ie = De : Ne.sibling = De, Ne = De);
      return t && Ae.forEach(function(Jv) {
        return r($, Jv);
      }), Oe && fr($, ke), Ie;
    }
    function Ue($, X, J, ce) {
      if (typeof J == "object" && J !== null && J.type === T && J.key === null && (J = J.props.children), typeof J == "object" && J !== null) {
        switch (J.$$typeof) {
          case V:
            e: {
              for (var Ie = J.key, Ne = X; Ne !== null; ) {
                if (Ne.key === Ie) {
                  if (Ie = J.type, Ie === T) {
                    if (Ne.tag === 7) {
                      a($, Ne.sibling), X = y(Ne, J.props.children), X.return = $, $ = X;
                      break e;
                    }
                  } else if (Ne.elementType === Ie || typeof Ie == "object" && Ie !== null && Ie.$$typeof === H && Kd(Ie) === Ne.type) {
                    a($, Ne.sibling), X = y(Ne, J.props), X.ref = ea($, Ne, J), X.return = $, $ = X;
                    break e;
                  }
                  a($, Ne);
                  break;
                } else r($, Ne);
                Ne = Ne.sibling;
              }
              J.type === T ? (X = xr(J.props.children, $.mode, ce, J.key), X.return = $, $ = X) : (ce = Us(J.type, J.key, J.props, null, $.mode, ce), ce.ref = ea($, X, J), ce.return = $, $ = ce);
            }
            return N($);
          case G:
            e: {
              for (Ne = J.key; X !== null; ) {
                if (X.key === Ne) if (X.tag === 4 && X.stateNode.containerInfo === J.containerInfo && X.stateNode.implementation === J.implementation) {
                  a($, X.sibling), X = y(X, J.children || []), X.return = $, $ = X;
                  break e;
                } else {
                  a($, X);
                  break;
                }
                else r($, X);
                X = X.sibling;
              }
              X = Rc(J, $.mode, ce), X.return = $, $ = X;
            }
            return N($);
          case H:
            return Ne = J._init, Ue($, X, Ne(J._payload), ce);
        }
        if (It(J)) return ye($, X, J, ce);
        if (P(J)) return ve($, X, J, ce);
        Ns($, J);
      }
      return typeof J == "string" && J !== "" || typeof J == "number" ? (J = "" + J, X !== null && X.tag === 6 ? (a($, X.sibling), X = y(X, J), X.return = $, $ = X) : (a($, X), X = Mc(J, $.mode, ce), X.return = $, $ = X), N($)) : a($, X);
    }
    return Ue;
  }
  var Qr = Zd(!0), Yd = Zd(!1), As = zn(null), Ss = null, Jr = null, zl = null;
  function Ol() {
    zl = Jr = Ss = null;
  }
  function Ll(t) {
    var r = As.current;
    ze(As), t._currentValue = r;
  }
  function Hl(t, r, a) {
    for (; t !== null; ) {
      var f = t.alternate;
      if ((t.childLanes & r) !== r ? (t.childLanes |= r, f !== null && (f.childLanes |= r)) : f !== null && (f.childLanes & r) !== r && (f.childLanes |= r), t === a) break;
      t = t.return;
    }
  }
  function qr(t, r) {
    Ss = t, zl = Jr = null, t = t.dependencies, t !== null && t.firstContext !== null && ((t.lanes & r) !== 0 && (mt = !0), t.firstContext = null);
  }
  function Et(t) {
    var r = t._currentValue;
    if (zl !== t) if (t = { context: t, memoizedValue: r, next: null }, Jr === null) {
      if (Ss === null) throw Error(o(308));
      Jr = t, Ss.dependencies = { lanes: 0, firstContext: t };
    } else Jr = Jr.next = t;
    return r;
  }
  var pr = null;
  function Wl(t) {
    pr === null ? pr = [t] : pr.push(t);
  }
  function Ud(t, r, a, f) {
    var y = r.interleaved;
    return y === null ? (a.next = a, Wl(r)) : (a.next = y.next, y.next = a), r.interleaved = a, wn(t, f);
  }
  function wn(t, r) {
    t.lanes |= r;
    var a = t.alternate;
    for (a !== null && (a.lanes |= r), a = t, t = t.return; t !== null; ) t.childLanes |= r, a = t.alternate, a !== null && (a.childLanes |= r), a = t, t = t.return;
    return a.tag === 3 ? a.stateNode : null;
  }
  var Hn = !1;
  function Xl(t) {
    t.updateQueue = { baseState: t.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
  }
  function $d(t, r) {
    t = t.updateQueue, r.updateQueue === t && (r.updateQueue = { baseState: t.baseState, firstBaseUpdate: t.firstBaseUpdate, lastBaseUpdate: t.lastBaseUpdate, shared: t.shared, effects: t.effects });
  }
  function vn(t, r) {
    return { eventTime: t, lane: r, tag: 0, payload: null, callback: null, next: null };
  }
  function Wn(t, r, a) {
    var f = t.updateQueue;
    if (f === null) return null;
    if (f = f.shared, (Ee & 2) !== 0) {
      var y = f.pending;
      return y === null ? r.next = r : (r.next = y.next, y.next = r), f.pending = r, wn(t, a);
    }
    return y = f.interleaved, y === null ? (r.next = r, Wl(f)) : (r.next = y.next, y.next = r), f.interleaved = r, wn(t, a);
  }
  function ks(t, r, a) {
    if (r = r.updateQueue, r !== null && (r = r.shared, (a & 4194240) !== 0)) {
      var f = r.lanes;
      f &= t.pendingLanes, a |= f, r.lanes = a, al(t, a);
    }
  }
  function Qd(t, r) {
    var a = t.updateQueue, f = t.alternate;
    if (f !== null && (f = f.updateQueue, a === f)) {
      var y = null, v = null;
      if (a = a.firstBaseUpdate, a !== null) {
        do {
          var N = { eventTime: a.eventTime, lane: a.lane, tag: a.tag, payload: a.payload, callback: a.callback, next: null };
          v === null ? y = v = N : v = v.next = N, a = a.next;
        } while (a !== null);
        v === null ? y = v = r : v = v.next = r;
      } else y = v = r;
      a = { baseState: f.baseState, firstBaseUpdate: y, lastBaseUpdate: v, shared: f.shared, effects: f.effects }, t.updateQueue = a;
      return;
    }
    t = a.lastBaseUpdate, t === null ? a.firstBaseUpdate = r : t.next = r, a.lastBaseUpdate = r;
  }
  function js(t, r, a, f) {
    var y = t.updateQueue;
    Hn = !1;
    var v = y.firstBaseUpdate, N = y.lastBaseUpdate, B = y.shared.pending;
    if (B !== null) {
      y.shared.pending = null;
      var O = B, ee = O.next;
      O.next = null, N === null ? v = ee : N.next = ee, N = O;
      var se = t.alternate;
      se !== null && (se = se.updateQueue, B = se.lastBaseUpdate, B !== N && (B === null ? se.firstBaseUpdate = ee : B.next = ee, se.lastBaseUpdate = O));
    }
    if (v !== null) {
      var ie = y.baseState;
      N = 0, se = ee = O = null, B = v;
      do {
        var ae = B.lane, ge = B.eventTime;
        if ((f & ae) === ae) {
          se !== null && (se = se.next = {
            eventTime: ge,
            lane: 0,
            tag: B.tag,
            payload: B.payload,
            callback: B.callback,
            next: null
          });
          e: {
            var ye = t, ve = B;
            switch (ae = r, ge = a, ve.tag) {
              case 1:
                if (ye = ve.payload, typeof ye == "function") {
                  ie = ye.call(ge, ie, ae);
                  break e;
                }
                ie = ye;
                break e;
              case 3:
                ye.flags = ye.flags & -65537 | 128;
              case 0:
                if (ye = ve.payload, ae = typeof ye == "function" ? ye.call(ge, ie, ae) : ye, ae == null) break e;
                ie = Z({}, ie, ae);
                break e;
              case 2:
                Hn = !0;
            }
          }
          B.callback !== null && B.lane !== 0 && (t.flags |= 64, ae = y.effects, ae === null ? y.effects = [B] : ae.push(B));
        } else ge = { eventTime: ge, lane: ae, tag: B.tag, payload: B.payload, callback: B.callback, next: null }, se === null ? (ee = se = ge, O = ie) : se = se.next = ge, N |= ae;
        if (B = B.next, B === null) {
          if (B = y.shared.pending, B === null) break;
          ae = B, B = ae.next, ae.next = null, y.lastBaseUpdate = ae, y.shared.pending = null;
        }
      } while (!0);
      if (se === null && (O = ie), y.baseState = O, y.firstBaseUpdate = ee, y.lastBaseUpdate = se, r = y.shared.interleaved, r !== null) {
        y = r;
        do
          N |= y.lane, y = y.next;
        while (y !== r);
      } else v === null && (y.shared.lanes = 0);
      hr |= N, t.lanes = N, t.memoizedState = ie;
    }
  }
  function Jd(t, r, a) {
    if (t = r.effects, r.effects = null, t !== null) for (r = 0; r < t.length; r++) {
      var f = t[r], y = f.callback;
      if (y !== null) {
        if (f.callback = null, f = a, typeof y != "function") throw Error(o(191, y));
        y.call(f);
      }
    }
  }
  var ta = {}, tn = zn(ta), na = zn(ta), ra = zn(ta);
  function gr(t) {
    if (t === ta) throw Error(o(174));
    return t;
  }
  function Kl(t, r) {
    switch (Fe(ra, r), Fe(na, t), Fe(tn, ta), t = r.nodeType, t) {
      case 9:
      case 11:
        r = (r = r.documentElement) ? r.namespaceURI : fn(null, "");
        break;
      default:
        t = t === 8 ? r.parentNode : r, r = t.namespaceURI || null, t = t.tagName, r = fn(r, t);
    }
    ze(tn), Fe(tn, r);
  }
  function eo() {
    ze(tn), ze(na), ze(ra);
  }
  function qd(t) {
    gr(ra.current);
    var r = gr(tn.current), a = fn(r, t.type);
    r !== a && (Fe(na, t), Fe(tn, a));
  }
  function Zl(t) {
    na.current === t && (ze(tn), ze(na));
  }
  var Ke = zn(0);
  function Ms(t) {
    for (var r = t; r !== null; ) {
      if (r.tag === 13) {
        var a = r.memoizedState;
        if (a !== null && (a = a.dehydrated, a === null || a.data === "$?" || a.data === "$!")) return r;
      } else if (r.tag === 19 && r.memoizedProps.revealOrder !== void 0) {
        if ((r.flags & 128) !== 0) return r;
      } else if (r.child !== null) {
        r.child.return = r, r = r.child;
        continue;
      }
      if (r === t) break;
      for (; r.sibling === null; ) {
        if (r.return === null || r.return === t) return null;
        r = r.return;
      }
      r.sibling.return = r.return, r = r.sibling;
    }
    return null;
  }
  var Yl = [];
  function Ul() {
    for (var t = 0; t < Yl.length; t++) Yl[t]._workInProgressVersionPrimary = null;
    Yl.length = 0;
  }
  var Rs = S.ReactCurrentDispatcher, $l = S.ReactCurrentBatchConfig, mr = 0, Ze = null, Je = null, et = null, Ts = !1, oa = !1, aa = 0, xv = 0;
  function st() {
    throw Error(o(321));
  }
  function Ql(t, r) {
    if (r === null) return !1;
    for (var a = 0; a < r.length && a < t.length; a++) if (!Vt(t[a], r[a])) return !1;
    return !0;
  }
  function Jl(t, r, a, f, y, v) {
    if (mr = v, Ze = r, r.memoizedState = null, r.updateQueue = null, r.lanes = 0, Rs.current = t === null || t.memoizedState === null ? _v : Nv, t = a(f, y), oa) {
      v = 0;
      do {
        if (oa = !1, aa = 0, 25 <= v) throw Error(o(301));
        v += 1, et = Je = null, r.updateQueue = null, Rs.current = Av, t = a(f, y);
      } while (oa);
    }
    if (Rs.current = Ds, r = Je !== null && Je.next !== null, mr = 0, et = Je = Ze = null, Ts = !1, r) throw Error(o(300));
    return t;
  }
  function ql() {
    var t = aa !== 0;
    return aa = 0, t;
  }
  function nn() {
    var t = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return et === null ? Ze.memoizedState = et = t : et = et.next = t, et;
  }
  function Dt() {
    if (Je === null) {
      var t = Ze.alternate;
      t = t !== null ? t.memoizedState : null;
    } else t = Je.next;
    var r = et === null ? Ze.memoizedState : et.next;
    if (r !== null) et = r, Je = t;
    else {
      if (t === null) throw Error(o(310));
      Je = t, t = { memoizedState: Je.memoizedState, baseState: Je.baseState, baseQueue: Je.baseQueue, queue: Je.queue, next: null }, et === null ? Ze.memoizedState = et = t : et = et.next = t;
    }
    return et;
  }
  function sa(t, r) {
    return typeof r == "function" ? r(t) : r;
  }
  function ec(t) {
    var r = Dt(), a = r.queue;
    if (a === null) throw Error(o(311));
    a.lastRenderedReducer = t;
    var f = Je, y = f.baseQueue, v = a.pending;
    if (v !== null) {
      if (y !== null) {
        var N = y.next;
        y.next = v.next, v.next = N;
      }
      f.baseQueue = y = v, a.pending = null;
    }
    if (y !== null) {
      v = y.next, f = f.baseState;
      var B = N = null, O = null, ee = v;
      do {
        var se = ee.lane;
        if ((mr & se) === se) O !== null && (O = O.next = { lane: 0, action: ee.action, hasEagerState: ee.hasEagerState, eagerState: ee.eagerState, next: null }), f = ee.hasEagerState ? ee.eagerState : t(f, ee.action);
        else {
          var ie = {
            lane: se,
            action: ee.action,
            hasEagerState: ee.hasEagerState,
            eagerState: ee.eagerState,
            next: null
          };
          O === null ? (B = O = ie, N = f) : O = O.next = ie, Ze.lanes |= se, hr |= se;
        }
        ee = ee.next;
      } while (ee !== null && ee !== v);
      O === null ? N = f : O.next = B, Vt(f, r.memoizedState) || (mt = !0), r.memoizedState = f, r.baseState = N, r.baseQueue = O, a.lastRenderedState = f;
    }
    if (t = a.interleaved, t !== null) {
      y = t;
      do
        v = y.lane, Ze.lanes |= v, hr |= v, y = y.next;
      while (y !== t);
    } else y === null && (a.lanes = 0);
    return [r.memoizedState, a.dispatch];
  }
  function tc(t) {
    var r = Dt(), a = r.queue;
    if (a === null) throw Error(o(311));
    a.lastRenderedReducer = t;
    var f = a.dispatch, y = a.pending, v = r.memoizedState;
    if (y !== null) {
      a.pending = null;
      var N = y = y.next;
      do
        v = t(v, N.action), N = N.next;
      while (N !== y);
      Vt(v, r.memoizedState) || (mt = !0), r.memoizedState = v, r.baseQueue === null && (r.baseState = v), a.lastRenderedState = v;
    }
    return [v, f];
  }
  function ef() {
  }
  function tf(t, r) {
    var a = Ze, f = Dt(), y = r(), v = !Vt(f.memoizedState, y);
    if (v && (f.memoizedState = y, mt = !0), f = f.queue, nc(of.bind(null, a, f, t), [t]), f.getSnapshot !== r || v || et !== null && et.memoizedState.tag & 1) {
      if (a.flags |= 2048, ia(9, rf.bind(null, a, f, y, r), void 0, null), tt === null) throw Error(o(349));
      (mr & 30) !== 0 || nf(a, r, y);
    }
    return y;
  }
  function nf(t, r, a) {
    t.flags |= 16384, t = { getSnapshot: r, value: a }, r = Ze.updateQueue, r === null ? (r = { lastEffect: null, stores: null }, Ze.updateQueue = r, r.stores = [t]) : (a = r.stores, a === null ? r.stores = [t] : a.push(t));
  }
  function rf(t, r, a, f) {
    r.value = a, r.getSnapshot = f, af(r) && sf(t);
  }
  function of(t, r, a) {
    return a(function() {
      af(r) && sf(t);
    });
  }
  function af(t) {
    var r = t.getSnapshot;
    t = t.value;
    try {
      var a = r();
      return !Vt(t, a);
    } catch {
      return !0;
    }
  }
  function sf(t) {
    var r = wn(t, 1);
    r !== null && Wt(r, t, 1, -1);
  }
  function lf(t) {
    var r = nn();
    return typeof t == "function" && (t = t()), r.memoizedState = r.baseState = t, t = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: sa, lastRenderedState: t }, r.queue = t, t = t.dispatch = bv.bind(null, Ze, t), [r.memoizedState, t];
  }
  function ia(t, r, a, f) {
    return t = { tag: t, create: r, destroy: a, deps: f, next: null }, r = Ze.updateQueue, r === null ? (r = { lastEffect: null, stores: null }, Ze.updateQueue = r, r.lastEffect = t.next = t) : (a = r.lastEffect, a === null ? r.lastEffect = t.next = t : (f = a.next, a.next = t, t.next = f, r.lastEffect = t)), t;
  }
  function cf() {
    return Dt().memoizedState;
  }
  function Bs(t, r, a, f) {
    var y = nn();
    Ze.flags |= t, y.memoizedState = ia(1 | r, a, void 0, f === void 0 ? null : f);
  }
  function Es(t, r, a, f) {
    var y = Dt();
    f = f === void 0 ? null : f;
    var v = void 0;
    if (Je !== null) {
      var N = Je.memoizedState;
      if (v = N.destroy, f !== null && Ql(f, N.deps)) {
        y.memoizedState = ia(r, a, v, f);
        return;
      }
    }
    Ze.flags |= t, y.memoizedState = ia(1 | r, a, v, f);
  }
  function uf(t, r) {
    return Bs(8390656, 8, t, r);
  }
  function nc(t, r) {
    return Es(2048, 8, t, r);
  }
  function df(t, r) {
    return Es(4, 2, t, r);
  }
  function ff(t, r) {
    return Es(4, 4, t, r);
  }
  function pf(t, r) {
    if (typeof r == "function") return t = t(), r(t), function() {
      r(null);
    };
    if (r != null) return t = t(), r.current = t, function() {
      r.current = null;
    };
  }
  function gf(t, r, a) {
    return a = a != null ? a.concat([t]) : null, Es(4, 4, pf.bind(null, r, t), a);
  }
  function rc() {
  }
  function mf(t, r) {
    var a = Dt();
    r = r === void 0 ? null : r;
    var f = a.memoizedState;
    return f !== null && r !== null && Ql(r, f[1]) ? f[0] : (a.memoizedState = [t, r], t);
  }
  function hf(t, r) {
    var a = Dt();
    r = r === void 0 ? null : r;
    var f = a.memoizedState;
    return f !== null && r !== null && Ql(r, f[1]) ? f[0] : (t = t(), a.memoizedState = [t, r], t);
  }
  function yf(t, r, a) {
    return (mr & 21) === 0 ? (t.baseState && (t.baseState = !1, mt = !0), t.memoizedState = a) : (Vt(a, r) || (a = Pr(), Ze.lanes |= a, hr |= a, t.baseState = !0), r);
  }
  function Iv(t, r) {
    var a = Pe;
    Pe = a !== 0 && 4 > a ? a : 4, t(!0);
    var f = $l.transition;
    $l.transition = {};
    try {
      t(!1), r();
    } finally {
      Pe = a, $l.transition = f;
    }
  }
  function wf() {
    return Dt().memoizedState;
  }
  function Cv(t, r, a) {
    var f = Yn(t);
    if (a = { lane: f, action: a, hasEagerState: !1, eagerState: null, next: null }, vf(t)) xf(r, a);
    else if (a = Ud(t, r, a, f), a !== null) {
      var y = dt();
      Wt(a, t, f, y), If(a, r, f);
    }
  }
  function bv(t, r, a) {
    var f = Yn(t), y = { lane: f, action: a, hasEagerState: !1, eagerState: null, next: null };
    if (vf(t)) xf(r, y);
    else {
      var v = t.alternate;
      if (t.lanes === 0 && (v === null || v.lanes === 0) && (v = r.lastRenderedReducer, v !== null)) try {
        var N = r.lastRenderedState, B = v(N, a);
        if (y.hasEagerState = !0, y.eagerState = B, Vt(B, N)) {
          var O = r.interleaved;
          O === null ? (y.next = y, Wl(r)) : (y.next = O.next, O.next = y), r.interleaved = y;
          return;
        }
      } catch {
      } finally {
      }
      a = Ud(t, r, y, f), a !== null && (y = dt(), Wt(a, t, f, y), If(a, r, f));
    }
  }
  function vf(t) {
    var r = t.alternate;
    return t === Ze || r !== null && r === Ze;
  }
  function xf(t, r) {
    oa = Ts = !0;
    var a = t.pending;
    a === null ? r.next = r : (r.next = a.next, a.next = r), t.pending = r;
  }
  function If(t, r, a) {
    if ((a & 4194240) !== 0) {
      var f = r.lanes;
      f &= t.pendingLanes, a |= f, r.lanes = a, al(t, a);
    }
  }
  var Ds = { readContext: Et, useCallback: st, useContext: st, useEffect: st, useImperativeHandle: st, useInsertionEffect: st, useLayoutEffect: st, useMemo: st, useReducer: st, useRef: st, useState: st, useDebugValue: st, useDeferredValue: st, useTransition: st, useMutableSource: st, useSyncExternalStore: st, useId: st, unstable_isNewReconciler: !1 }, _v = { readContext: Et, useCallback: function(t, r) {
    return nn().memoizedState = [t, r === void 0 ? null : r], t;
  }, useContext: Et, useEffect: uf, useImperativeHandle: function(t, r, a) {
    return a = a != null ? a.concat([t]) : null, Bs(
      4194308,
      4,
      pf.bind(null, r, t),
      a
    );
  }, useLayoutEffect: function(t, r) {
    return Bs(4194308, 4, t, r);
  }, useInsertionEffect: function(t, r) {
    return Bs(4, 2, t, r);
  }, useMemo: function(t, r) {
    var a = nn();
    return r = r === void 0 ? null : r, t = t(), a.memoizedState = [t, r], t;
  }, useReducer: function(t, r, a) {
    var f = nn();
    return r = a !== void 0 ? a(r) : r, f.memoizedState = f.baseState = r, t = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: t, lastRenderedState: r }, f.queue = t, t = t.dispatch = Cv.bind(null, Ze, t), [f.memoizedState, t];
  }, useRef: function(t) {
    var r = nn();
    return t = { current: t }, r.memoizedState = t;
  }, useState: lf, useDebugValue: rc, useDeferredValue: function(t) {
    return nn().memoizedState = t;
  }, useTransition: function() {
    var t = lf(!1), r = t[0];
    return t = Iv.bind(null, t[1]), nn().memoizedState = t, [r, t];
  }, useMutableSource: function() {
  }, useSyncExternalStore: function(t, r, a) {
    var f = Ze, y = nn();
    if (Oe) {
      if (a === void 0) throw Error(o(407));
      a = a();
    } else {
      if (a = r(), tt === null) throw Error(o(349));
      (mr & 30) !== 0 || nf(f, r, a);
    }
    y.memoizedState = a;
    var v = { value: a, getSnapshot: r };
    return y.queue = v, uf(of.bind(
      null,
      f,
      v,
      t
    ), [t]), f.flags |= 2048, ia(9, rf.bind(null, f, v, a, r), void 0, null), a;
  }, useId: function() {
    var t = nn(), r = tt.identifierPrefix;
    if (Oe) {
      var a = yn, f = hn;
      a = (f & ~(1 << 32 - Ct(f) - 1)).toString(32) + a, r = ":" + r + "R" + a, a = aa++, 0 < a && (r += "H" + a.toString(32)), r += ":";
    } else a = xv++, r = ":" + r + "r" + a.toString(32) + ":";
    return t.memoizedState = r;
  }, unstable_isNewReconciler: !1 }, Nv = {
    readContext: Et,
    useCallback: mf,
    useContext: Et,
    useEffect: nc,
    useImperativeHandle: gf,
    useInsertionEffect: df,
    useLayoutEffect: ff,
    useMemo: hf,
    useReducer: ec,
    useRef: cf,
    useState: function() {
      return ec(sa);
    },
    useDebugValue: rc,
    useDeferredValue: function(t) {
      var r = Dt();
      return yf(r, Je.memoizedState, t);
    },
    useTransition: function() {
      var t = ec(sa)[0], r = Dt().memoizedState;
      return [t, r];
    },
    useMutableSource: ef,
    useSyncExternalStore: tf,
    useId: wf,
    unstable_isNewReconciler: !1
  }, Av = { readContext: Et, useCallback: mf, useContext: Et, useEffect: nc, useImperativeHandle: gf, useInsertionEffect: df, useLayoutEffect: ff, useMemo: hf, useReducer: tc, useRef: cf, useState: function() {
    return tc(sa);
  }, useDebugValue: rc, useDeferredValue: function(t) {
    var r = Dt();
    return Je === null ? r.memoizedState = t : yf(r, Je.memoizedState, t);
  }, useTransition: function() {
    var t = tc(sa)[0], r = Dt().memoizedState;
    return [t, r];
  }, useMutableSource: ef, useSyncExternalStore: tf, useId: wf, unstable_isNewReconciler: !1 };
  function Ot(t, r) {
    if (t && t.defaultProps) {
      r = Z({}, r), t = t.defaultProps;
      for (var a in t) r[a] === void 0 && (r[a] = t[a]);
      return r;
    }
    return r;
  }
  function oc(t, r, a, f) {
    r = t.memoizedState, a = a(f, r), a = a == null ? r : Z({}, r, a), t.memoizedState = a, t.lanes === 0 && (t.updateQueue.baseState = a);
  }
  var Gs = { isMounted: function(t) {
    return (t = t._reactInternals) ? Jt(t) === t : !1;
  }, enqueueSetState: function(t, r, a) {
    t = t._reactInternals;
    var f = dt(), y = Yn(t), v = vn(f, y);
    v.payload = r, a != null && (v.callback = a), r = Wn(t, v, y), r !== null && (Wt(r, t, y, f), ks(r, t, y));
  }, enqueueReplaceState: function(t, r, a) {
    t = t._reactInternals;
    var f = dt(), y = Yn(t), v = vn(f, y);
    v.tag = 1, v.payload = r, a != null && (v.callback = a), r = Wn(t, v, y), r !== null && (Wt(r, t, y, f), ks(r, t, y));
  }, enqueueForceUpdate: function(t, r) {
    t = t._reactInternals;
    var a = dt(), f = Yn(t), y = vn(a, f);
    y.tag = 2, r != null && (y.callback = r), r = Wn(t, y, f), r !== null && (Wt(r, t, f, a), ks(r, t, f));
  } };
  function Cf(t, r, a, f, y, v, N) {
    return t = t.stateNode, typeof t.shouldComponentUpdate == "function" ? t.shouldComponentUpdate(f, v, N) : r.prototype && r.prototype.isPureReactComponent ? !Zo(a, f) || !Zo(y, v) : !0;
  }
  function bf(t, r, a) {
    var f = !1, y = On, v = r.contextType;
    return typeof v == "object" && v !== null ? v = Et(v) : (y = gt(r) ? ur : at.current, f = r.contextTypes, v = (f = f != null) ? Zr(t, y) : On), r = new r(a, v), t.memoizedState = r.state !== null && r.state !== void 0 ? r.state : null, r.updater = Gs, t.stateNode = r, r._reactInternals = t, f && (t = t.stateNode, t.__reactInternalMemoizedUnmaskedChildContext = y, t.__reactInternalMemoizedMaskedChildContext = v), r;
  }
  function _f(t, r, a, f) {
    t = r.state, typeof r.componentWillReceiveProps == "function" && r.componentWillReceiveProps(a, f), typeof r.UNSAFE_componentWillReceiveProps == "function" && r.UNSAFE_componentWillReceiveProps(a, f), r.state !== t && Gs.enqueueReplaceState(r, r.state, null);
  }
  function ac(t, r, a, f) {
    var y = t.stateNode;
    y.props = a, y.state = t.memoizedState, y.refs = {}, Xl(t);
    var v = r.contextType;
    typeof v == "object" && v !== null ? y.context = Et(v) : (v = gt(r) ? ur : at.current, y.context = Zr(t, v)), y.state = t.memoizedState, v = r.getDerivedStateFromProps, typeof v == "function" && (oc(t, r, v, a), y.state = t.memoizedState), typeof r.getDerivedStateFromProps == "function" || typeof y.getSnapshotBeforeUpdate == "function" || typeof y.UNSAFE_componentWillMount != "function" && typeof y.componentWillMount != "function" || (r = y.state, typeof y.componentWillMount == "function" && y.componentWillMount(), typeof y.UNSAFE_componentWillMount == "function" && y.UNSAFE_componentWillMount(), r !== y.state && Gs.enqueueReplaceState(y, y.state, null), js(t, a, y, f), y.state = t.memoizedState), typeof y.componentDidMount == "function" && (t.flags |= 4194308);
  }
  function to(t, r) {
    try {
      var a = "", f = r;
      do
        a += le(f), f = f.return;
      while (f);
      var y = a;
    } catch (v) {
      y = `
Error generating stack: ` + v.message + `
` + v.stack;
    }
    return { value: t, source: r, stack: y, digest: null };
  }
  function sc(t, r, a) {
    return { value: t, source: null, stack: a ?? null, digest: r ?? null };
  }
  function ic(t, r) {
    try {
      console.error(r.value);
    } catch (a) {
      setTimeout(function() {
        throw a;
      });
    }
  }
  var Sv = typeof WeakMap == "function" ? WeakMap : Map;
  function Nf(t, r, a) {
    a = vn(-1, a), a.tag = 3, a.payload = { element: null };
    var f = r.value;
    return a.callback = function() {
      Hs || (Hs = !0, Cc = f), ic(t, r);
    }, a;
  }
  function Af(t, r, a) {
    a = vn(-1, a), a.tag = 3;
    var f = t.type.getDerivedStateFromError;
    if (typeof f == "function") {
      var y = r.value;
      a.payload = function() {
        return f(y);
      }, a.callback = function() {
        ic(t, r);
      };
    }
    var v = t.stateNode;
    return v !== null && typeof v.componentDidCatch == "function" && (a.callback = function() {
      ic(t, r), typeof f != "function" && (Kn === null ? Kn = /* @__PURE__ */ new Set([this]) : Kn.add(this));
      var N = r.stack;
      this.componentDidCatch(r.value, { componentStack: N !== null ? N : "" });
    }), a;
  }
  function Sf(t, r, a) {
    var f = t.pingCache;
    if (f === null) {
      f = t.pingCache = new Sv();
      var y = /* @__PURE__ */ new Set();
      f.set(r, y);
    } else y = f.get(r), y === void 0 && (y = /* @__PURE__ */ new Set(), f.set(r, y));
    y.has(a) || (y.add(a), t = Ov.bind(null, t, r, a), r.then(t, t));
  }
  function kf(t) {
    do {
      var r;
      if ((r = t.tag === 13) && (r = t.memoizedState, r = r !== null ? r.dehydrated !== null : !0), r) return t;
      t = t.return;
    } while (t !== null);
    return null;
  }
  function jf(t, r, a, f, y) {
    return (t.mode & 1) === 0 ? (t === r ? t.flags |= 65536 : (t.flags |= 128, a.flags |= 131072, a.flags &= -52805, a.tag === 1 && (a.alternate === null ? a.tag = 17 : (r = vn(-1, 1), r.tag = 2, Wn(a, r, 1))), a.lanes |= 1), t) : (t.flags |= 65536, t.lanes = y, t);
  }
  var kv = S.ReactCurrentOwner, mt = !1;
  function ut(t, r, a, f) {
    r.child = t === null ? Yd(r, null, a, f) : Qr(r, t.child, a, f);
  }
  function Mf(t, r, a, f, y) {
    a = a.render;
    var v = r.ref;
    return qr(r, y), f = Jl(t, r, a, f, v, y), a = ql(), t !== null && !mt ? (r.updateQueue = t.updateQueue, r.flags &= -2053, t.lanes &= ~y, xn(t, r, y)) : (Oe && a && Dl(r), r.flags |= 1, ut(t, r, f, y), r.child);
  }
  function Rf(t, r, a, f, y) {
    if (t === null) {
      var v = a.type;
      return typeof v == "function" && !jc(v) && v.defaultProps === void 0 && a.compare === null && a.defaultProps === void 0 ? (r.tag = 15, r.type = v, Tf(t, r, v, f, y)) : (t = Us(a.type, null, f, r, r.mode, y), t.ref = r.ref, t.return = r, r.child = t);
    }
    if (v = t.child, (t.lanes & y) === 0) {
      var N = v.memoizedProps;
      if (a = a.compare, a = a !== null ? a : Zo, a(N, f) && t.ref === r.ref) return xn(t, r, y);
    }
    return r.flags |= 1, t = $n(v, f), t.ref = r.ref, t.return = r, r.child = t;
  }
  function Tf(t, r, a, f, y) {
    if (t !== null) {
      var v = t.memoizedProps;
      if (Zo(v, f) && t.ref === r.ref) if (mt = !1, r.pendingProps = f = v, (t.lanes & y) !== 0) (t.flags & 131072) !== 0 && (mt = !0);
      else return r.lanes = t.lanes, xn(t, r, y);
    }
    return lc(t, r, a, f, y);
  }
  function Bf(t, r, a) {
    var f = r.pendingProps, y = f.children, v = t !== null ? t.memoizedState : null;
    if (f.mode === "hidden") if ((r.mode & 1) === 0) r.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, Fe(ro, At), At |= a;
    else {
      if ((a & 1073741824) === 0) return t = v !== null ? v.baseLanes | a : a, r.lanes = r.childLanes = 1073741824, r.memoizedState = { baseLanes: t, cachePool: null, transitions: null }, r.updateQueue = null, Fe(ro, At), At |= t, null;
      r.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, f = v !== null ? v.baseLanes : a, Fe(ro, At), At |= f;
    }
    else v !== null ? (f = v.baseLanes | a, r.memoizedState = null) : f = a, Fe(ro, At), At |= f;
    return ut(t, r, y, a), r.child;
  }
  function Ef(t, r) {
    var a = r.ref;
    (t === null && a !== null || t !== null && t.ref !== a) && (r.flags |= 512, r.flags |= 2097152);
  }
  function lc(t, r, a, f, y) {
    var v = gt(a) ? ur : at.current;
    return v = Zr(r, v), qr(r, y), a = Jl(t, r, a, f, v, y), f = ql(), t !== null && !mt ? (r.updateQueue = t.updateQueue, r.flags &= -2053, t.lanes &= ~y, xn(t, r, y)) : (Oe && f && Dl(r), r.flags |= 1, ut(t, r, a, y), r.child);
  }
  function Df(t, r, a, f, y) {
    if (gt(a)) {
      var v = !0;
      xs(r);
    } else v = !1;
    if (qr(r, y), r.stateNode === null) Fs(t, r), bf(r, a, f), ac(r, a, f, y), f = !0;
    else if (t === null) {
      var N = r.stateNode, B = r.memoizedProps;
      N.props = B;
      var O = N.context, ee = a.contextType;
      typeof ee == "object" && ee !== null ? ee = Et(ee) : (ee = gt(a) ? ur : at.current, ee = Zr(r, ee));
      var se = a.getDerivedStateFromProps, ie = typeof se == "function" || typeof N.getSnapshotBeforeUpdate == "function";
      ie || typeof N.UNSAFE_componentWillReceiveProps != "function" && typeof N.componentWillReceiveProps != "function" || (B !== f || O !== ee) && _f(r, N, f, ee), Hn = !1;
      var ae = r.memoizedState;
      N.state = ae, js(r, f, N, y), O = r.memoizedState, B !== f || ae !== O || pt.current || Hn ? (typeof se == "function" && (oc(r, a, se, f), O = r.memoizedState), (B = Hn || Cf(r, a, B, f, ae, O, ee)) ? (ie || typeof N.UNSAFE_componentWillMount != "function" && typeof N.componentWillMount != "function" || (typeof N.componentWillMount == "function" && N.componentWillMount(), typeof N.UNSAFE_componentWillMount == "function" && N.UNSAFE_componentWillMount()), typeof N.componentDidMount == "function" && (r.flags |= 4194308)) : (typeof N.componentDidMount == "function" && (r.flags |= 4194308), r.memoizedProps = f, r.memoizedState = O), N.props = f, N.state = O, N.context = ee, f = B) : (typeof N.componentDidMount == "function" && (r.flags |= 4194308), f = !1);
    } else {
      N = r.stateNode, $d(t, r), B = r.memoizedProps, ee = r.type === r.elementType ? B : Ot(r.type, B), N.props = ee, ie = r.pendingProps, ae = N.context, O = a.contextType, typeof O == "object" && O !== null ? O = Et(O) : (O = gt(a) ? ur : at.current, O = Zr(r, O));
      var ge = a.getDerivedStateFromProps;
      (se = typeof ge == "function" || typeof N.getSnapshotBeforeUpdate == "function") || typeof N.UNSAFE_componentWillReceiveProps != "function" && typeof N.componentWillReceiveProps != "function" || (B !== ie || ae !== O) && _f(r, N, f, O), Hn = !1, ae = r.memoizedState, N.state = ae, js(r, f, N, y);
      var ye = r.memoizedState;
      B !== ie || ae !== ye || pt.current || Hn ? (typeof ge == "function" && (oc(r, a, ge, f), ye = r.memoizedState), (ee = Hn || Cf(r, a, ee, f, ae, ye, O) || !1) ? (se || typeof N.UNSAFE_componentWillUpdate != "function" && typeof N.componentWillUpdate != "function" || (typeof N.componentWillUpdate == "function" && N.componentWillUpdate(f, ye, O), typeof N.UNSAFE_componentWillUpdate == "function" && N.UNSAFE_componentWillUpdate(f, ye, O)), typeof N.componentDidUpdate == "function" && (r.flags |= 4), typeof N.getSnapshotBeforeUpdate == "function" && (r.flags |= 1024)) : (typeof N.componentDidUpdate != "function" || B === t.memoizedProps && ae === t.memoizedState || (r.flags |= 4), typeof N.getSnapshotBeforeUpdate != "function" || B === t.memoizedProps && ae === t.memoizedState || (r.flags |= 1024), r.memoizedProps = f, r.memoizedState = ye), N.props = f, N.state = ye, N.context = O, f = ee) : (typeof N.componentDidUpdate != "function" || B === t.memoizedProps && ae === t.memoizedState || (r.flags |= 4), typeof N.getSnapshotBeforeUpdate != "function" || B === t.memoizedProps && ae === t.memoizedState || (r.flags |= 1024), f = !1);
    }
    return cc(t, r, a, f, v, y);
  }
  function cc(t, r, a, f, y, v) {
    Ef(t, r);
    var N = (r.flags & 128) !== 0;
    if (!f && !N) return y && Vd(r, a, !1), xn(t, r, v);
    f = r.stateNode, kv.current = r;
    var B = N && typeof a.getDerivedStateFromError != "function" ? null : f.render();
    return r.flags |= 1, t !== null && N ? (r.child = Qr(r, t.child, null, v), r.child = Qr(r, null, B, v)) : ut(t, r, B, v), r.memoizedState = f.state, y && Vd(r, a, !0), r.child;
  }
  function Gf(t) {
    var r = t.stateNode;
    r.pendingContext ? Pd(t, r.pendingContext, r.pendingContext !== r.context) : r.context && Pd(t, r.context, !1), Kl(t, r.containerInfo);
  }
  function Pf(t, r, a, f, y) {
    return $r(), Vl(y), r.flags |= 256, ut(t, r, a, f), r.child;
  }
  var uc = { dehydrated: null, treeContext: null, retryLane: 0 };
  function dc(t) {
    return { baseLanes: t, cachePool: null, transitions: null };
  }
  function Ff(t, r, a) {
    var f = r.pendingProps, y = Ke.current, v = !1, N = (r.flags & 128) !== 0, B;
    if ((B = N) || (B = t !== null && t.memoizedState === null ? !1 : (y & 2) !== 0), B ? (v = !0, r.flags &= -129) : (t === null || t.memoizedState !== null) && (y |= 1), Fe(Ke, y & 1), t === null)
      return Fl(r), t = r.memoizedState, t !== null && (t = t.dehydrated, t !== null) ? ((r.mode & 1) === 0 ? r.lanes = 1 : t.data === "$!" ? r.lanes = 8 : r.lanes = 1073741824, null) : (N = f.children, t = f.fallback, v ? (f = r.mode, v = r.child, N = { mode: "hidden", children: N }, (f & 1) === 0 && v !== null ? (v.childLanes = 0, v.pendingProps = N) : v = $s(N, f, 0, null), t = xr(t, f, a, null), v.return = r, t.return = r, v.sibling = t, r.child = v, r.child.memoizedState = dc(a), r.memoizedState = uc, t) : fc(r, N));
    if (y = t.memoizedState, y !== null && (B = y.dehydrated, B !== null)) return jv(t, r, N, f, B, y, a);
    if (v) {
      v = f.fallback, N = r.mode, y = t.child, B = y.sibling;
      var O = { mode: "hidden", children: f.children };
      return (N & 1) === 0 && r.child !== y ? (f = r.child, f.childLanes = 0, f.pendingProps = O, r.deletions = null) : (f = $n(y, O), f.subtreeFlags = y.subtreeFlags & 14680064), B !== null ? v = $n(B, v) : (v = xr(v, N, a, null), v.flags |= 2), v.return = r, f.return = r, f.sibling = v, r.child = f, f = v, v = r.child, N = t.child.memoizedState, N = N === null ? dc(a) : { baseLanes: N.baseLanes | a, cachePool: null, transitions: N.transitions }, v.memoizedState = N, v.childLanes = t.childLanes & ~a, r.memoizedState = uc, f;
    }
    return v = t.child, t = v.sibling, f = $n(v, { mode: "visible", children: f.children }), (r.mode & 1) === 0 && (f.lanes = a), f.return = r, f.sibling = null, t !== null && (a = r.deletions, a === null ? (r.deletions = [t], r.flags |= 16) : a.push(t)), r.child = f, r.memoizedState = null, f;
  }
  function fc(t, r) {
    return r = $s({ mode: "visible", children: r }, t.mode, 0, null), r.return = t, t.child = r;
  }
  function Ps(t, r, a, f) {
    return f !== null && Vl(f), Qr(r, t.child, null, a), t = fc(r, r.pendingProps.children), t.flags |= 2, r.memoizedState = null, t;
  }
  function jv(t, r, a, f, y, v, N) {
    if (a)
      return r.flags & 256 ? (r.flags &= -257, f = sc(Error(o(422))), Ps(t, r, N, f)) : r.memoizedState !== null ? (r.child = t.child, r.flags |= 128, null) : (v = f.fallback, y = r.mode, f = $s({ mode: "visible", children: f.children }, y, 0, null), v = xr(v, y, N, null), v.flags |= 2, f.return = r, v.return = r, f.sibling = v, r.child = f, (r.mode & 1) !== 0 && Qr(r, t.child, null, N), r.child.memoizedState = dc(N), r.memoizedState = uc, v);
    if ((r.mode & 1) === 0) return Ps(t, r, N, null);
    if (y.data === "$!") {
      if (f = y.nextSibling && y.nextSibling.dataset, f) var B = f.dgst;
      return f = B, v = Error(o(419)), f = sc(v, f, void 0), Ps(t, r, N, f);
    }
    if (B = (N & t.childLanes) !== 0, mt || B) {
      if (f = tt, f !== null) {
        switch (N & -N) {
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
        y = (y & (f.suspendedLanes | N)) !== 0 ? 0 : y, y !== 0 && y !== v.retryLane && (v.retryLane = y, wn(t, y), Wt(f, t, y, -1));
      }
      return kc(), f = sc(Error(o(421))), Ps(t, r, N, f);
    }
    return y.data === "$?" ? (r.flags |= 128, r.child = t.child, r = Lv.bind(null, t), y._reactRetry = r, null) : (t = v.treeContext, Nt = Vn(y.nextSibling), _t = r, Oe = !0, zt = null, t !== null && (Tt[Bt++] = hn, Tt[Bt++] = yn, Tt[Bt++] = dr, hn = t.id, yn = t.overflow, dr = r), r = fc(r, f.children), r.flags |= 4096, r);
  }
  function Vf(t, r, a) {
    t.lanes |= r;
    var f = t.alternate;
    f !== null && (f.lanes |= r), Hl(t.return, r, a);
  }
  function pc(t, r, a, f, y) {
    var v = t.memoizedState;
    v === null ? t.memoizedState = { isBackwards: r, rendering: null, renderingStartTime: 0, last: f, tail: a, tailMode: y } : (v.isBackwards = r, v.rendering = null, v.renderingStartTime = 0, v.last = f, v.tail = a, v.tailMode = y);
  }
  function zf(t, r, a) {
    var f = r.pendingProps, y = f.revealOrder, v = f.tail;
    if (ut(t, r, f.children, a), f = Ke.current, (f & 2) !== 0) f = f & 1 | 2, r.flags |= 128;
    else {
      if (t !== null && (t.flags & 128) !== 0) e: for (t = r.child; t !== null; ) {
        if (t.tag === 13) t.memoizedState !== null && Vf(t, a, r);
        else if (t.tag === 19) Vf(t, a, r);
        else if (t.child !== null) {
          t.child.return = t, t = t.child;
          continue;
        }
        if (t === r) break e;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === r) break e;
          t = t.return;
        }
        t.sibling.return = t.return, t = t.sibling;
      }
      f &= 1;
    }
    if (Fe(Ke, f), (r.mode & 1) === 0) r.memoizedState = null;
    else switch (y) {
      case "forwards":
        for (a = r.child, y = null; a !== null; ) t = a.alternate, t !== null && Ms(t) === null && (y = a), a = a.sibling;
        a = y, a === null ? (y = r.child, r.child = null) : (y = a.sibling, a.sibling = null), pc(r, !1, y, a, v);
        break;
      case "backwards":
        for (a = null, y = r.child, r.child = null; y !== null; ) {
          if (t = y.alternate, t !== null && Ms(t) === null) {
            r.child = y;
            break;
          }
          t = y.sibling, y.sibling = a, a = y, y = t;
        }
        pc(r, !0, a, null, v);
        break;
      case "together":
        pc(r, !1, null, null, void 0);
        break;
      default:
        r.memoizedState = null;
    }
    return r.child;
  }
  function Fs(t, r) {
    (r.mode & 1) === 0 && t !== null && (t.alternate = null, r.alternate = null, r.flags |= 2);
  }
  function xn(t, r, a) {
    if (t !== null && (r.dependencies = t.dependencies), hr |= r.lanes, (a & r.childLanes) === 0) return null;
    if (t !== null && r.child !== t.child) throw Error(o(153));
    if (r.child !== null) {
      for (t = r.child, a = $n(t, t.pendingProps), r.child = a, a.return = r; t.sibling !== null; ) t = t.sibling, a = a.sibling = $n(t, t.pendingProps), a.return = r;
      a.sibling = null;
    }
    return r.child;
  }
  function Mv(t, r, a) {
    switch (r.tag) {
      case 3:
        Gf(r), $r();
        break;
      case 5:
        qd(r);
        break;
      case 1:
        gt(r.type) && xs(r);
        break;
      case 4:
        Kl(r, r.stateNode.containerInfo);
        break;
      case 10:
        var f = r.type._context, y = r.memoizedProps.value;
        Fe(As, f._currentValue), f._currentValue = y;
        break;
      case 13:
        if (f = r.memoizedState, f !== null)
          return f.dehydrated !== null ? (Fe(Ke, Ke.current & 1), r.flags |= 128, null) : (a & r.child.childLanes) !== 0 ? Ff(t, r, a) : (Fe(Ke, Ke.current & 1), t = xn(t, r, a), t !== null ? t.sibling : null);
        Fe(Ke, Ke.current & 1);
        break;
      case 19:
        if (f = (a & r.childLanes) !== 0, (t.flags & 128) !== 0) {
          if (f) return zf(t, r, a);
          r.flags |= 128;
        }
        if (y = r.memoizedState, y !== null && (y.rendering = null, y.tail = null, y.lastEffect = null), Fe(Ke, Ke.current), f) break;
        return null;
      case 22:
      case 23:
        return r.lanes = 0, Bf(t, r, a);
    }
    return xn(t, r, a);
  }
  var Of, gc, Lf, Hf;
  Of = function(t, r) {
    for (var a = r.child; a !== null; ) {
      if (a.tag === 5 || a.tag === 6) t.appendChild(a.stateNode);
      else if (a.tag !== 4 && a.child !== null) {
        a.child.return = a, a = a.child;
        continue;
      }
      if (a === r) break;
      for (; a.sibling === null; ) {
        if (a.return === null || a.return === r) return;
        a = a.return;
      }
      a.sibling.return = a.return, a = a.sibling;
    }
  }, gc = function() {
  }, Lf = function(t, r, a, f) {
    var y = t.memoizedProps;
    if (y !== f) {
      t = r.stateNode, gr(tn.current);
      var v = null;
      switch (a) {
        case "input":
          y = Re(t, y), f = Re(t, f), v = [];
          break;
        case "select":
          y = Z({}, y, { value: void 0 }), f = Z({}, f, { value: void 0 }), v = [];
          break;
        case "textarea":
          y = un(t, y), f = un(t, f), v = [];
          break;
        default:
          typeof y.onClick != "function" && typeof f.onClick == "function" && (t.onclick = ys);
      }
      _o(a, f);
      var N;
      a = null;
      for (ee in y) if (!f.hasOwnProperty(ee) && y.hasOwnProperty(ee) && y[ee] != null) if (ee === "style") {
        var B = y[ee];
        for (N in B) B.hasOwnProperty(N) && (a || (a = {}), a[N] = "");
      } else ee !== "dangerouslySetInnerHTML" && ee !== "children" && ee !== "suppressContentEditableWarning" && ee !== "suppressHydrationWarning" && ee !== "autoFocus" && (i.hasOwnProperty(ee) ? v || (v = []) : (v = v || []).push(ee, null));
      for (ee in f) {
        var O = f[ee];
        if (B = y != null ? y[ee] : void 0, f.hasOwnProperty(ee) && O !== B && (O != null || B != null)) if (ee === "style") if (B) {
          for (N in B) !B.hasOwnProperty(N) || O && O.hasOwnProperty(N) || (a || (a = {}), a[N] = "");
          for (N in O) O.hasOwnProperty(N) && B[N] !== O[N] && (a || (a = {}), a[N] = O[N]);
        } else a || (v || (v = []), v.push(
          ee,
          a
        )), a = O;
        else ee === "dangerouslySetInnerHTML" ? (O = O ? O.__html : void 0, B = B ? B.__html : void 0, O != null && B !== O && (v = v || []).push(ee, O)) : ee === "children" ? typeof O != "string" && typeof O != "number" || (v = v || []).push(ee, "" + O) : ee !== "suppressContentEditableWarning" && ee !== "suppressHydrationWarning" && (i.hasOwnProperty(ee) ? (O != null && ee === "onScroll" && Ve("scroll", t), v || B === O || (v = [])) : (v = v || []).push(ee, O));
      }
      a && (v = v || []).push("style", a);
      var ee = v;
      (r.updateQueue = ee) && (r.flags |= 4);
    }
  }, Hf = function(t, r, a, f) {
    a !== f && (r.flags |= 4);
  };
  function la(t, r) {
    if (!Oe) switch (t.tailMode) {
      case "hidden":
        r = t.tail;
        for (var a = null; r !== null; ) r.alternate !== null && (a = r), r = r.sibling;
        a === null ? t.tail = null : a.sibling = null;
        break;
      case "collapsed":
        a = t.tail;
        for (var f = null; a !== null; ) a.alternate !== null && (f = a), a = a.sibling;
        f === null ? r || t.tail === null ? t.tail = null : t.tail.sibling = null : f.sibling = null;
    }
  }
  function it(t) {
    var r = t.alternate !== null && t.alternate.child === t.child, a = 0, f = 0;
    if (r) for (var y = t.child; y !== null; ) a |= y.lanes | y.childLanes, f |= y.subtreeFlags & 14680064, f |= y.flags & 14680064, y.return = t, y = y.sibling;
    else for (y = t.child; y !== null; ) a |= y.lanes | y.childLanes, f |= y.subtreeFlags, f |= y.flags, y.return = t, y = y.sibling;
    return t.subtreeFlags |= f, t.childLanes = a, r;
  }
  function Rv(t, r, a) {
    var f = r.pendingProps;
    switch (Gl(r), r.tag) {
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
        return it(r), null;
      case 1:
        return gt(r.type) && vs(), it(r), null;
      case 3:
        return f = r.stateNode, eo(), ze(pt), ze(at), Ul(), f.pendingContext && (f.context = f.pendingContext, f.pendingContext = null), (t === null || t.child === null) && (_s(r) ? r.flags |= 4 : t === null || t.memoizedState.isDehydrated && (r.flags & 256) === 0 || (r.flags |= 1024, zt !== null && (Nc(zt), zt = null))), gc(t, r), it(r), null;
      case 5:
        Zl(r);
        var y = gr(ra.current);
        if (a = r.type, t !== null && r.stateNode != null) Lf(t, r, a, f, y), t.ref !== r.ref && (r.flags |= 512, r.flags |= 2097152);
        else {
          if (!f) {
            if (r.stateNode === null) throw Error(o(166));
            return it(r), null;
          }
          if (t = gr(tn.current), _s(r)) {
            f = r.stateNode, a = r.type;
            var v = r.memoizedProps;
            switch (f[en] = r, f[Jo] = v, t = (r.mode & 1) !== 0, a) {
              case "dialog":
                Ve("cancel", f), Ve("close", f);
                break;
              case "iframe":
              case "object":
              case "embed":
                Ve("load", f);
                break;
              case "video":
              case "audio":
                for (y = 0; y < Uo.length; y++) Ve(Uo[y], f);
                break;
              case "source":
                Ve("error", f);
                break;
              case "img":
              case "image":
              case "link":
                Ve(
                  "error",
                  f
                ), Ve("load", f);
                break;
              case "details":
                Ve("toggle", f);
                break;
              case "input":
                Be(f, v), Ve("invalid", f);
                break;
              case "select":
                f._wrapperState = { wasMultiple: !!v.multiple }, Ve("invalid", f);
                break;
              case "textarea":
                Mn(f, v), Ve("invalid", f);
            }
            _o(a, v), y = null;
            for (var N in v) if (v.hasOwnProperty(N)) {
              var B = v[N];
              N === "children" ? typeof B == "string" ? f.textContent !== B && (v.suppressHydrationWarning !== !0 && hs(f.textContent, B, t), y = ["children", B]) : typeof B == "number" && f.textContent !== "" + B && (v.suppressHydrationWarning !== !0 && hs(
                f.textContent,
                B,
                t
              ), y = ["children", "" + B]) : i.hasOwnProperty(N) && B != null && N === "onScroll" && Ve("scroll", f);
            }
            switch (a) {
              case "input":
                _e(f), Ft(f, v, !0);
                break;
              case "textarea":
                _e(f), tr(f);
                break;
              case "select":
              case "option":
                break;
              default:
                typeof v.onClick == "function" && (f.onclick = ys);
            }
            f = y, r.updateQueue = f, f !== null && (r.flags |= 4);
          } else {
            N = y.nodeType === 9 ? y : y.ownerDocument, t === "http://www.w3.org/1999/xhtml" && (t = dn(a)), t === "http://www.w3.org/1999/xhtml" ? a === "script" ? (t = N.createElement("div"), t.innerHTML = "<script><\/script>", t = t.removeChild(t.firstChild)) : typeof f.is == "string" ? t = N.createElement(a, { is: f.is }) : (t = N.createElement(a), a === "select" && (N = t, f.multiple ? N.multiple = !0 : f.size && (N.size = f.size))) : t = N.createElementNS(t, a), t[en] = r, t[Jo] = f, Of(t, r, !1, !1), r.stateNode = t;
            e: {
              switch (N = No(a, f), a) {
                case "dialog":
                  Ve("cancel", t), Ve("close", t), y = f;
                  break;
                case "iframe":
                case "object":
                case "embed":
                  Ve("load", t), y = f;
                  break;
                case "video":
                case "audio":
                  for (y = 0; y < Uo.length; y++) Ve(Uo[y], t);
                  y = f;
                  break;
                case "source":
                  Ve("error", t), y = f;
                  break;
                case "img":
                case "image":
                case "link":
                  Ve(
                    "error",
                    t
                  ), Ve("load", t), y = f;
                  break;
                case "details":
                  Ve("toggle", t), y = f;
                  break;
                case "input":
                  Be(t, f), y = Re(t, f), Ve("invalid", t);
                  break;
                case "option":
                  y = f;
                  break;
                case "select":
                  t._wrapperState = { wasMultiple: !!f.multiple }, y = Z({}, f, { value: void 0 }), Ve("invalid", t);
                  break;
                case "textarea":
                  Mn(t, f), y = un(t, f), Ve("invalid", t);
                  break;
                default:
                  y = f;
              }
              _o(a, y), B = y;
              for (v in B) if (B.hasOwnProperty(v)) {
                var O = B[v];
                v === "style" ? Oa(t, O) : v === "dangerouslySetInnerHTML" ? (O = O ? O.__html : void 0, O != null && Va(t, O)) : v === "children" ? typeof O == "string" ? (a !== "textarea" || O !== "") && pn(t, O) : typeof O == "number" && pn(t, "" + O) : v !== "suppressContentEditableWarning" && v !== "suppressHydrationWarning" && v !== "autoFocus" && (i.hasOwnProperty(v) ? O != null && v === "onScroll" && Ve("scroll", t) : O != null && A(t, v, O, N));
              }
              switch (a) {
                case "input":
                  _e(t), Ft(t, f, !1);
                  break;
                case "textarea":
                  _e(t), tr(t);
                  break;
                case "option":
                  f.value != null && t.setAttribute("value", "" + ne(f.value));
                  break;
                case "select":
                  t.multiple = !!f.multiple, v = f.value, v != null ? Mt(t, !!f.multiple, v, !1) : f.defaultValue != null && Mt(
                    t,
                    !!f.multiple,
                    f.defaultValue,
                    !0
                  );
                  break;
                default:
                  typeof y.onClick == "function" && (t.onclick = ys);
              }
              switch (a) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  f = !!f.autoFocus;
                  break e;
                case "img":
                  f = !0;
                  break e;
                default:
                  f = !1;
              }
            }
            f && (r.flags |= 4);
          }
          r.ref !== null && (r.flags |= 512, r.flags |= 2097152);
        }
        return it(r), null;
      case 6:
        if (t && r.stateNode != null) Hf(t, r, t.memoizedProps, f);
        else {
          if (typeof f != "string" && r.stateNode === null) throw Error(o(166));
          if (a = gr(ra.current), gr(tn.current), _s(r)) {
            if (f = r.stateNode, a = r.memoizedProps, f[en] = r, (v = f.nodeValue !== a) && (t = _t, t !== null)) switch (t.tag) {
              case 3:
                hs(f.nodeValue, a, (t.mode & 1) !== 0);
                break;
              case 5:
                t.memoizedProps.suppressHydrationWarning !== !0 && hs(f.nodeValue, a, (t.mode & 1) !== 0);
            }
            v && (r.flags |= 4);
          } else f = (a.nodeType === 9 ? a : a.ownerDocument).createTextNode(f), f[en] = r, r.stateNode = f;
        }
        return it(r), null;
      case 13:
        if (ze(Ke), f = r.memoizedState, t === null || t.memoizedState !== null && t.memoizedState.dehydrated !== null) {
          if (Oe && Nt !== null && (r.mode & 1) !== 0 && (r.flags & 128) === 0) Xd(), $r(), r.flags |= 98560, v = !1;
          else if (v = _s(r), f !== null && f.dehydrated !== null) {
            if (t === null) {
              if (!v) throw Error(o(318));
              if (v = r.memoizedState, v = v !== null ? v.dehydrated : null, !v) throw Error(o(317));
              v[en] = r;
            } else $r(), (r.flags & 128) === 0 && (r.memoizedState = null), r.flags |= 4;
            it(r), v = !1;
          } else zt !== null && (Nc(zt), zt = null), v = !0;
          if (!v) return r.flags & 65536 ? r : null;
        }
        return (r.flags & 128) !== 0 ? (r.lanes = a, r) : (f = f !== null, f !== (t !== null && t.memoizedState !== null) && f && (r.child.flags |= 8192, (r.mode & 1) !== 0 && (t === null || (Ke.current & 1) !== 0 ? qe === 0 && (qe = 3) : kc())), r.updateQueue !== null && (r.flags |= 4), it(r), null);
      case 4:
        return eo(), gc(t, r), t === null && $o(r.stateNode.containerInfo), it(r), null;
      case 10:
        return Ll(r.type._context), it(r), null;
      case 17:
        return gt(r.type) && vs(), it(r), null;
      case 19:
        if (ze(Ke), v = r.memoizedState, v === null) return it(r), null;
        if (f = (r.flags & 128) !== 0, N = v.rendering, N === null) if (f) la(v, !1);
        else {
          if (qe !== 0 || t !== null && (t.flags & 128) !== 0) for (t = r.child; t !== null; ) {
            if (N = Ms(t), N !== null) {
              for (r.flags |= 128, la(v, !1), f = N.updateQueue, f !== null && (r.updateQueue = f, r.flags |= 4), r.subtreeFlags = 0, f = a, a = r.child; a !== null; ) v = a, t = f, v.flags &= 14680066, N = v.alternate, N === null ? (v.childLanes = 0, v.lanes = t, v.child = null, v.subtreeFlags = 0, v.memoizedProps = null, v.memoizedState = null, v.updateQueue = null, v.dependencies = null, v.stateNode = null) : (v.childLanes = N.childLanes, v.lanes = N.lanes, v.child = N.child, v.subtreeFlags = 0, v.deletions = null, v.memoizedProps = N.memoizedProps, v.memoizedState = N.memoizedState, v.updateQueue = N.updateQueue, v.type = N.type, t = N.dependencies, v.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }), a = a.sibling;
              return Fe(Ke, Ke.current & 1 | 2), r.child;
            }
            t = t.sibling;
          }
          v.tail !== null && Xe() > oo && (r.flags |= 128, f = !0, la(v, !1), r.lanes = 4194304);
        }
        else {
          if (!f) if (t = Ms(N), t !== null) {
            if (r.flags |= 128, f = !0, a = t.updateQueue, a !== null && (r.updateQueue = a, r.flags |= 4), la(v, !0), v.tail === null && v.tailMode === "hidden" && !N.alternate && !Oe) return it(r), null;
          } else 2 * Xe() - v.renderingStartTime > oo && a !== 1073741824 && (r.flags |= 128, f = !0, la(v, !1), r.lanes = 4194304);
          v.isBackwards ? (N.sibling = r.child, r.child = N) : (a = v.last, a !== null ? a.sibling = N : r.child = N, v.last = N);
        }
        return v.tail !== null ? (r = v.tail, v.rendering = r, v.tail = r.sibling, v.renderingStartTime = Xe(), r.sibling = null, a = Ke.current, Fe(Ke, f ? a & 1 | 2 : a & 1), r) : (it(r), null);
      case 22:
      case 23:
        return Sc(), f = r.memoizedState !== null, t !== null && t.memoizedState !== null !== f && (r.flags |= 8192), f && (r.mode & 1) !== 0 ? (At & 1073741824) !== 0 && (it(r), r.subtreeFlags & 6 && (r.flags |= 8192)) : it(r), null;
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(o(156, r.tag));
  }
  function Tv(t, r) {
    switch (Gl(r), r.tag) {
      case 1:
        return gt(r.type) && vs(), t = r.flags, t & 65536 ? (r.flags = t & -65537 | 128, r) : null;
      case 3:
        return eo(), ze(pt), ze(at), Ul(), t = r.flags, (t & 65536) !== 0 && (t & 128) === 0 ? (r.flags = t & -65537 | 128, r) : null;
      case 5:
        return Zl(r), null;
      case 13:
        if (ze(Ke), t = r.memoizedState, t !== null && t.dehydrated !== null) {
          if (r.alternate === null) throw Error(o(340));
          $r();
        }
        return t = r.flags, t & 65536 ? (r.flags = t & -65537 | 128, r) : null;
      case 19:
        return ze(Ke), null;
      case 4:
        return eo(), null;
      case 10:
        return Ll(r.type._context), null;
      case 22:
      case 23:
        return Sc(), null;
      case 24:
        return null;
      default:
        return null;
    }
  }
  var Vs = !1, lt = !1, Bv = typeof WeakSet == "function" ? WeakSet : Set, he = null;
  function no(t, r) {
    var a = t.ref;
    if (a !== null) if (typeof a == "function") try {
      a(null);
    } catch (f) {
      Ye(t, r, f);
    }
    else a.current = null;
  }
  function mc(t, r, a) {
    try {
      a();
    } catch (f) {
      Ye(t, r, f);
    }
  }
  var Wf = !1;
  function Ev(t, r) {
    if (Sl = as, t = Id(), vl(t)) {
      if ("selectionStart" in t) var a = { start: t.selectionStart, end: t.selectionEnd };
      else e: {
        a = (a = t.ownerDocument) && a.defaultView || window;
        var f = a.getSelection && a.getSelection();
        if (f && f.rangeCount !== 0) {
          a = f.anchorNode;
          var y = f.anchorOffset, v = f.focusNode;
          f = f.focusOffset;
          try {
            a.nodeType, v.nodeType;
          } catch {
            a = null;
            break e;
          }
          var N = 0, B = -1, O = -1, ee = 0, se = 0, ie = t, ae = null;
          t: for (; ; ) {
            for (var ge; ie !== a || y !== 0 && ie.nodeType !== 3 || (B = N + y), ie !== v || f !== 0 && ie.nodeType !== 3 || (O = N + f), ie.nodeType === 3 && (N += ie.nodeValue.length), (ge = ie.firstChild) !== null; )
              ae = ie, ie = ge;
            for (; ; ) {
              if (ie === t) break t;
              if (ae === a && ++ee === y && (B = N), ae === v && ++se === f && (O = N), (ge = ie.nextSibling) !== null) break;
              ie = ae, ae = ie.parentNode;
            }
            ie = ge;
          }
          a = B === -1 || O === -1 ? null : { start: B, end: O };
        } else a = null;
      }
      a = a || { start: 0, end: 0 };
    } else a = null;
    for (kl = { focusedElem: t, selectionRange: a }, as = !1, he = r; he !== null; ) if (r = he, t = r.child, (r.subtreeFlags & 1028) !== 0 && t !== null) t.return = r, he = t;
    else for (; he !== null; ) {
      r = he;
      try {
        var ye = r.alternate;
        if ((r.flags & 1024) !== 0) switch (r.tag) {
          case 0:
          case 11:
          case 15:
            break;
          case 1:
            if (ye !== null) {
              var ve = ye.memoizedProps, Ue = ye.memoizedState, $ = r.stateNode, X = $.getSnapshotBeforeUpdate(r.elementType === r.type ? ve : Ot(r.type, ve), Ue);
              $.__reactInternalSnapshotBeforeUpdate = X;
            }
            break;
          case 3:
            var J = r.stateNode.containerInfo;
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
        Ye(r, r.return, ce);
      }
      if (t = r.sibling, t !== null) {
        t.return = r.return, he = t;
        break;
      }
      he = r.return;
    }
    return ye = Wf, Wf = !1, ye;
  }
  function ca(t, r, a) {
    var f = r.updateQueue;
    if (f = f !== null ? f.lastEffect : null, f !== null) {
      var y = f = f.next;
      do {
        if ((y.tag & t) === t) {
          var v = y.destroy;
          y.destroy = void 0, v !== void 0 && mc(r, a, v);
        }
        y = y.next;
      } while (y !== f);
    }
  }
  function zs(t, r) {
    if (r = r.updateQueue, r = r !== null ? r.lastEffect : null, r !== null) {
      var a = r = r.next;
      do {
        if ((a.tag & t) === t) {
          var f = a.create;
          a.destroy = f();
        }
        a = a.next;
      } while (a !== r);
    }
  }
  function hc(t) {
    var r = t.ref;
    if (r !== null) {
      var a = t.stateNode;
      switch (t.tag) {
        case 5:
          t = a;
          break;
        default:
          t = a;
      }
      typeof r == "function" ? r(t) : r.current = t;
    }
  }
  function Xf(t) {
    var r = t.alternate;
    r !== null && (t.alternate = null, Xf(r)), t.child = null, t.deletions = null, t.sibling = null, t.tag === 5 && (r = t.stateNode, r !== null && (delete r[en], delete r[Jo], delete r[Tl], delete r[hv], delete r[yv])), t.stateNode = null, t.return = null, t.dependencies = null, t.memoizedProps = null, t.memoizedState = null, t.pendingProps = null, t.stateNode = null, t.updateQueue = null;
  }
  function Kf(t) {
    return t.tag === 5 || t.tag === 3 || t.tag === 4;
  }
  function Zf(t) {
    e: for (; ; ) {
      for (; t.sibling === null; ) {
        if (t.return === null || Kf(t.return)) return null;
        t = t.return;
      }
      for (t.sibling.return = t.return, t = t.sibling; t.tag !== 5 && t.tag !== 6 && t.tag !== 18; ) {
        if (t.flags & 2 || t.child === null || t.tag === 4) continue e;
        t.child.return = t, t = t.child;
      }
      if (!(t.flags & 2)) return t.stateNode;
    }
  }
  function yc(t, r, a) {
    var f = t.tag;
    if (f === 5 || f === 6) t = t.stateNode, r ? a.nodeType === 8 ? a.parentNode.insertBefore(t, r) : a.insertBefore(t, r) : (a.nodeType === 8 ? (r = a.parentNode, r.insertBefore(t, a)) : (r = a, r.appendChild(t)), a = a._reactRootContainer, a != null || r.onclick !== null || (r.onclick = ys));
    else if (f !== 4 && (t = t.child, t !== null)) for (yc(t, r, a), t = t.sibling; t !== null; ) yc(t, r, a), t = t.sibling;
  }
  function wc(t, r, a) {
    var f = t.tag;
    if (f === 5 || f === 6) t = t.stateNode, r ? a.insertBefore(t, r) : a.appendChild(t);
    else if (f !== 4 && (t = t.child, t !== null)) for (wc(t, r, a), t = t.sibling; t !== null; ) wc(t, r, a), t = t.sibling;
  }
  var rt = null, Lt = !1;
  function Xn(t, r, a) {
    for (a = a.child; a !== null; ) Yf(t, r, a), a = a.sibling;
  }
  function Yf(t, r, a) {
    if (Rt && typeof Rt.onCommitFiberUnmount == "function") try {
      Rt.onCommitFiberUnmount(ir, a);
    } catch {
    }
    switch (a.tag) {
      case 5:
        lt || no(a, r);
      case 6:
        var f = rt, y = Lt;
        rt = null, Xn(t, r, a), rt = f, Lt = y, rt !== null && (Lt ? (t = rt, a = a.stateNode, t.nodeType === 8 ? t.parentNode.removeChild(a) : t.removeChild(a)) : rt.removeChild(a.stateNode));
        break;
      case 18:
        rt !== null && (Lt ? (t = rt, a = a.stateNode, t.nodeType === 8 ? Rl(t.parentNode, a) : t.nodeType === 1 && Rl(t, a), Oo(t)) : Rl(rt, a.stateNode));
        break;
      case 4:
        f = rt, y = Lt, rt = a.stateNode.containerInfo, Lt = !0, Xn(t, r, a), rt = f, Lt = y;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (!lt && (f = a.updateQueue, f !== null && (f = f.lastEffect, f !== null))) {
          y = f = f.next;
          do {
            var v = y, N = v.destroy;
            v = v.tag, N !== void 0 && ((v & 2) !== 0 || (v & 4) !== 0) && mc(a, r, N), y = y.next;
          } while (y !== f);
        }
        Xn(t, r, a);
        break;
      case 1:
        if (!lt && (no(a, r), f = a.stateNode, typeof f.componentWillUnmount == "function")) try {
          f.props = a.memoizedProps, f.state = a.memoizedState, f.componentWillUnmount();
        } catch (B) {
          Ye(a, r, B);
        }
        Xn(t, r, a);
        break;
      case 21:
        Xn(t, r, a);
        break;
      case 22:
        a.mode & 1 ? (lt = (f = lt) || a.memoizedState !== null, Xn(t, r, a), lt = f) : Xn(t, r, a);
        break;
      default:
        Xn(t, r, a);
    }
  }
  function Uf(t) {
    var r = t.updateQueue;
    if (r !== null) {
      t.updateQueue = null;
      var a = t.stateNode;
      a === null && (a = t.stateNode = new Bv()), r.forEach(function(f) {
        var y = Hv.bind(null, t, f);
        a.has(f) || (a.add(f), f.then(y, y));
      });
    }
  }
  function Ht(t, r) {
    var a = r.deletions;
    if (a !== null) for (var f = 0; f < a.length; f++) {
      var y = a[f];
      try {
        var v = t, N = r, B = N;
        e: for (; B !== null; ) {
          switch (B.tag) {
            case 5:
              rt = B.stateNode, Lt = !1;
              break e;
            case 3:
              rt = B.stateNode.containerInfo, Lt = !0;
              break e;
            case 4:
              rt = B.stateNode.containerInfo, Lt = !0;
              break e;
          }
          B = B.return;
        }
        if (rt === null) throw Error(o(160));
        Yf(v, N, y), rt = null, Lt = !1;
        var O = y.alternate;
        O !== null && (O.return = null), y.return = null;
      } catch (ee) {
        Ye(y, r, ee);
      }
    }
    if (r.subtreeFlags & 12854) for (r = r.child; r !== null; ) $f(r, t), r = r.sibling;
  }
  function $f(t, r) {
    var a = t.alternate, f = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (Ht(r, t), rn(t), f & 4) {
          try {
            ca(3, t, t.return), zs(3, t);
          } catch (ve) {
            Ye(t, t.return, ve);
          }
          try {
            ca(5, t, t.return);
          } catch (ve) {
            Ye(t, t.return, ve);
          }
        }
        break;
      case 1:
        Ht(r, t), rn(t), f & 512 && a !== null && no(a, a.return);
        break;
      case 5:
        if (Ht(r, t), rn(t), f & 512 && a !== null && no(a, a.return), t.flags & 32) {
          var y = t.stateNode;
          try {
            pn(y, "");
          } catch (ve) {
            Ye(t, t.return, ve);
          }
        }
        if (f & 4 && (y = t.stateNode, y != null)) {
          var v = t.memoizedProps, N = a !== null ? a.memoizedProps : v, B = t.type, O = t.updateQueue;
          if (t.updateQueue = null, O !== null) try {
            B === "input" && v.type === "radio" && v.name != null && je(y, v), No(B, N);
            var ee = No(B, v);
            for (N = 0; N < O.length; N += 2) {
              var se = O[N], ie = O[N + 1];
              se === "style" ? Oa(y, ie) : se === "dangerouslySetInnerHTML" ? Va(y, ie) : se === "children" ? pn(y, ie) : A(y, se, ie, ee);
            }
            switch (B) {
              case "input":
                We(y, v);
                break;
              case "textarea":
                Mr(y, v);
                break;
              case "select":
                var ae = y._wrapperState.wasMultiple;
                y._wrapperState.wasMultiple = !!v.multiple;
                var ge = v.value;
                ge != null ? Mt(y, !!v.multiple, ge, !1) : ae !== !!v.multiple && (v.defaultValue != null ? Mt(
                  y,
                  !!v.multiple,
                  v.defaultValue,
                  !0
                ) : Mt(y, !!v.multiple, v.multiple ? [] : "", !1));
            }
            y[Jo] = v;
          } catch (ve) {
            Ye(t, t.return, ve);
          }
        }
        break;
      case 6:
        if (Ht(r, t), rn(t), f & 4) {
          if (t.stateNode === null) throw Error(o(162));
          y = t.stateNode, v = t.memoizedProps;
          try {
            y.nodeValue = v;
          } catch (ve) {
            Ye(t, t.return, ve);
          }
        }
        break;
      case 3:
        if (Ht(r, t), rn(t), f & 4 && a !== null && a.memoizedState.isDehydrated) try {
          Oo(r.containerInfo);
        } catch (ve) {
          Ye(t, t.return, ve);
        }
        break;
      case 4:
        Ht(r, t), rn(t);
        break;
      case 13:
        Ht(r, t), rn(t), y = t.child, y.flags & 8192 && (v = y.memoizedState !== null, y.stateNode.isHidden = v, !v || y.alternate !== null && y.alternate.memoizedState !== null || (Ic = Xe())), f & 4 && Uf(t);
        break;
      case 22:
        if (se = a !== null && a.memoizedState !== null, t.mode & 1 ? (lt = (ee = lt) || se, Ht(r, t), lt = ee) : Ht(r, t), rn(t), f & 8192) {
          if (ee = t.memoizedState !== null, (t.stateNode.isHidden = ee) && !se && (t.mode & 1) !== 0) for (he = t, se = t.child; se !== null; ) {
            for (ie = he = se; he !== null; ) {
              switch (ae = he, ge = ae.child, ae.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  ca(4, ae, ae.return);
                  break;
                case 1:
                  no(ae, ae.return);
                  var ye = ae.stateNode;
                  if (typeof ye.componentWillUnmount == "function") {
                    f = ae, a = ae.return;
                    try {
                      r = f, ye.props = r.memoizedProps, ye.state = r.memoizedState, ye.componentWillUnmount();
                    } catch (ve) {
                      Ye(f, a, ve);
                    }
                  }
                  break;
                case 5:
                  no(ae, ae.return);
                  break;
                case 22:
                  if (ae.memoizedState !== null) {
                    qf(ie);
                    continue;
                  }
              }
              ge !== null ? (ge.return = ae, he = ge) : qf(ie);
            }
            se = se.sibling;
          }
          e: for (se = null, ie = t; ; ) {
            if (ie.tag === 5) {
              if (se === null) {
                se = ie;
                try {
                  y = ie.stateNode, ee ? (v = y.style, typeof v.setProperty == "function" ? v.setProperty("display", "none", "important") : v.display = "none") : (B = ie.stateNode, O = ie.memoizedProps.style, N = O != null && O.hasOwnProperty("display") ? O.display : null, B.style.display = za("display", N));
                } catch (ve) {
                  Ye(t, t.return, ve);
                }
              }
            } else if (ie.tag === 6) {
              if (se === null) try {
                ie.stateNode.nodeValue = ee ? "" : ie.memoizedProps;
              } catch (ve) {
                Ye(t, t.return, ve);
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
        Ht(r, t), rn(t), f & 4 && Uf(t);
        break;
      case 21:
        break;
      default:
        Ht(
          r,
          t
        ), rn(t);
    }
  }
  function rn(t) {
    var r = t.flags;
    if (r & 2) {
      try {
        e: {
          for (var a = t.return; a !== null; ) {
            if (Kf(a)) {
              var f = a;
              break e;
            }
            a = a.return;
          }
          throw Error(o(160));
        }
        switch (f.tag) {
          case 5:
            var y = f.stateNode;
            f.flags & 32 && (pn(y, ""), f.flags &= -33);
            var v = Zf(t);
            wc(t, v, y);
            break;
          case 3:
          case 4:
            var N = f.stateNode.containerInfo, B = Zf(t);
            yc(t, B, N);
            break;
          default:
            throw Error(o(161));
        }
      } catch (O) {
        Ye(t, t.return, O);
      }
      t.flags &= -3;
    }
    r & 4096 && (t.flags &= -4097);
  }
  function Dv(t, r, a) {
    he = t, Qf(t);
  }
  function Qf(t, r, a) {
    for (var f = (t.mode & 1) !== 0; he !== null; ) {
      var y = he, v = y.child;
      if (y.tag === 22 && f) {
        var N = y.memoizedState !== null || Vs;
        if (!N) {
          var B = y.alternate, O = B !== null && B.memoizedState !== null || lt;
          B = Vs;
          var ee = lt;
          if (Vs = N, (lt = O) && !ee) for (he = y; he !== null; ) N = he, O = N.child, N.tag === 22 && N.memoizedState !== null ? ep(y) : O !== null ? (O.return = N, he = O) : ep(y);
          for (; v !== null; ) he = v, Qf(v), v = v.sibling;
          he = y, Vs = B, lt = ee;
        }
        Jf(t);
      } else (y.subtreeFlags & 8772) !== 0 && v !== null ? (v.return = y, he = v) : Jf(t);
    }
  }
  function Jf(t) {
    for (; he !== null; ) {
      var r = he;
      if ((r.flags & 8772) !== 0) {
        var a = r.alternate;
        try {
          if ((r.flags & 8772) !== 0) switch (r.tag) {
            case 0:
            case 11:
            case 15:
              lt || zs(5, r);
              break;
            case 1:
              var f = r.stateNode;
              if (r.flags & 4 && !lt) if (a === null) f.componentDidMount();
              else {
                var y = r.elementType === r.type ? a.memoizedProps : Ot(r.type, a.memoizedProps);
                f.componentDidUpdate(y, a.memoizedState, f.__reactInternalSnapshotBeforeUpdate);
              }
              var v = r.updateQueue;
              v !== null && Jd(r, v, f);
              break;
            case 3:
              var N = r.updateQueue;
              if (N !== null) {
                if (a = null, r.child !== null) switch (r.child.tag) {
                  case 5:
                    a = r.child.stateNode;
                    break;
                  case 1:
                    a = r.child.stateNode;
                }
                Jd(r, N, a);
              }
              break;
            case 5:
              var B = r.stateNode;
              if (a === null && r.flags & 4) {
                a = B;
                var O = r.memoizedProps;
                switch (r.type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    O.autoFocus && a.focus();
                    break;
                  case "img":
                    O.src && (a.src = O.src);
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
              if (r.memoizedState === null) {
                var ee = r.alternate;
                if (ee !== null) {
                  var se = ee.memoizedState;
                  if (se !== null) {
                    var ie = se.dehydrated;
                    ie !== null && Oo(ie);
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
          lt || r.flags & 512 && hc(r);
        } catch (ae) {
          Ye(r, r.return, ae);
        }
      }
      if (r === t) {
        he = null;
        break;
      }
      if (a = r.sibling, a !== null) {
        a.return = r.return, he = a;
        break;
      }
      he = r.return;
    }
  }
  function qf(t) {
    for (; he !== null; ) {
      var r = he;
      if (r === t) {
        he = null;
        break;
      }
      var a = r.sibling;
      if (a !== null) {
        a.return = r.return, he = a;
        break;
      }
      he = r.return;
    }
  }
  function ep(t) {
    for (; he !== null; ) {
      var r = he;
      try {
        switch (r.tag) {
          case 0:
          case 11:
          case 15:
            var a = r.return;
            try {
              zs(4, r);
            } catch (O) {
              Ye(r, a, O);
            }
            break;
          case 1:
            var f = r.stateNode;
            if (typeof f.componentDidMount == "function") {
              var y = r.return;
              try {
                f.componentDidMount();
              } catch (O) {
                Ye(r, y, O);
              }
            }
            var v = r.return;
            try {
              hc(r);
            } catch (O) {
              Ye(r, v, O);
            }
            break;
          case 5:
            var N = r.return;
            try {
              hc(r);
            } catch (O) {
              Ye(r, N, O);
            }
        }
      } catch (O) {
        Ye(r, r.return, O);
      }
      if (r === t) {
        he = null;
        break;
      }
      var B = r.sibling;
      if (B !== null) {
        B.return = r.return, he = B;
        break;
      }
      he = r.return;
    }
  }
  var Gv = Math.ceil, Os = S.ReactCurrentDispatcher, vc = S.ReactCurrentOwner, Gt = S.ReactCurrentBatchConfig, Ee = 0, tt = null, $e = null, ot = 0, At = 0, ro = zn(0), qe = 0, ua = null, hr = 0, Ls = 0, xc = 0, da = null, ht = null, Ic = 0, oo = 1 / 0, In = null, Hs = !1, Cc = null, Kn = null, Ws = !1, Zn = null, Xs = 0, fa = 0, bc = null, Ks = -1, Zs = 0;
  function dt() {
    return (Ee & 6) !== 0 ? Xe() : Ks !== -1 ? Ks : Ks = Xe();
  }
  function Yn(t) {
    return (t.mode & 1) === 0 ? 1 : (Ee & 2) !== 0 && ot !== 0 ? ot & -ot : vv.transition !== null ? (Zs === 0 && (Zs = Pr()), Zs) : (t = Pe, t !== 0 || (t = window.event, t = t === void 0 ? 16 : td(t.type)), t);
  }
  function Wt(t, r, a, f) {
    if (50 < fa) throw fa = 0, bc = null, Error(o(185));
    lr(t, a, f), ((Ee & 2) === 0 || t !== tt) && (t === tt && ((Ee & 2) === 0 && (Ls |= a), qe === 4 && Un(t, ot)), yt(t, f), a === 1 && Ee === 0 && (r.mode & 1) === 0 && (oo = Xe() + 500, Is && Ln()));
  }
  function yt(t, r) {
    var a = t.callbackNode;
    ol(t, r);
    var f = Gr(t, t === tt ? ot : 0);
    if (f === 0) a !== null && Qa(a), t.callbackNode = null, t.callbackPriority = 0;
    else if (r = f & -f, t.callbackPriority !== r) {
      if (a != null && Qa(a), r === 1) t.tag === 0 ? wv(np.bind(null, t)) : zd(np.bind(null, t)), gv(function() {
        (Ee & 6) === 0 && Ln();
      }), a = null;
      else {
        switch (Zu(f)) {
          case 1:
            a = Eo;
            break;
          case 4:
            a = qa;
            break;
          case 16:
            a = Br;
            break;
          case 536870912:
            a = es;
            break;
          default:
            a = Br;
        }
        a = up(a, tp.bind(null, t));
      }
      t.callbackPriority = r, t.callbackNode = a;
    }
  }
  function tp(t, r) {
    if (Ks = -1, Zs = 0, (Ee & 6) !== 0) throw Error(o(327));
    var a = t.callbackNode;
    if (ao() && t.callbackNode !== a) return null;
    var f = Gr(t, t === tt ? ot : 0);
    if (f === 0) return null;
    if ((f & 30) !== 0 || (f & t.expiredLanes) !== 0 || r) r = Ys(t, f);
    else {
      r = f;
      var y = Ee;
      Ee |= 2;
      var v = op();
      (tt !== t || ot !== r) && (In = null, oo = Xe() + 500, wr(t, r));
      do
        try {
          Vv();
          break;
        } catch (B) {
          rp(t, B);
        }
      while (!0);
      Ol(), Os.current = v, Ee = y, $e !== null ? r = 0 : (tt = null, ot = 0, r = qe);
    }
    if (r !== 0) {
      if (r === 2 && (y = Do(t), y !== 0 && (f = y, r = _c(t, y))), r === 1) throw a = ua, wr(t, 0), Un(t, f), yt(t, Xe()), a;
      if (r === 6) Un(t, f);
      else {
        if (y = t.current.alternate, (f & 30) === 0 && !Pv(y) && (r = Ys(t, f), r === 2 && (v = Do(t), v !== 0 && (f = v, r = _c(t, v))), r === 1)) throw a = ua, wr(t, 0), Un(t, f), yt(t, Xe()), a;
        switch (t.finishedWork = y, t.finishedLanes = f, r) {
          case 0:
          case 1:
            throw Error(o(345));
          case 2:
            vr(t, ht, In);
            break;
          case 3:
            if (Un(t, f), (f & 130023424) === f && (r = Ic + 500 - Xe(), 10 < r)) {
              if (Gr(t, 0) !== 0) break;
              if (y = t.suspendedLanes, (y & f) !== f) {
                dt(), t.pingedLanes |= t.suspendedLanes & y;
                break;
              }
              t.timeoutHandle = Ml(vr.bind(null, t, ht, In), r);
              break;
            }
            vr(t, ht, In);
            break;
          case 4:
            if (Un(t, f), (f & 4194240) === f) break;
            for (r = t.eventTimes, y = -1; 0 < f; ) {
              var N = 31 - Ct(f);
              v = 1 << N, N = r[N], N > y && (y = N), f &= ~v;
            }
            if (f = y, f = Xe() - f, f = (120 > f ? 120 : 480 > f ? 480 : 1080 > f ? 1080 : 1920 > f ? 1920 : 3e3 > f ? 3e3 : 4320 > f ? 4320 : 1960 * Gv(f / 1960)) - f, 10 < f) {
              t.timeoutHandle = Ml(vr.bind(null, t, ht, In), f);
              break;
            }
            vr(t, ht, In);
            break;
          case 5:
            vr(t, ht, In);
            break;
          default:
            throw Error(o(329));
        }
      }
    }
    return yt(t, Xe()), t.callbackNode === a ? tp.bind(null, t) : null;
  }
  function _c(t, r) {
    var a = da;
    return t.current.memoizedState.isDehydrated && (wr(t, r).flags |= 256), t = Ys(t, r), t !== 2 && (r = ht, ht = a, r !== null && Nc(r)), t;
  }
  function Nc(t) {
    ht === null ? ht = t : ht.push.apply(ht, t);
  }
  function Pv(t) {
    for (var r = t; ; ) {
      if (r.flags & 16384) {
        var a = r.updateQueue;
        if (a !== null && (a = a.stores, a !== null)) for (var f = 0; f < a.length; f++) {
          var y = a[f], v = y.getSnapshot;
          y = y.value;
          try {
            if (!Vt(v(), y)) return !1;
          } catch {
            return !1;
          }
        }
      }
      if (a = r.child, r.subtreeFlags & 16384 && a !== null) a.return = r, r = a;
      else {
        if (r === t) break;
        for (; r.sibling === null; ) {
          if (r.return === null || r.return === t) return !0;
          r = r.return;
        }
        r.sibling.return = r.return, r = r.sibling;
      }
    }
    return !0;
  }
  function Un(t, r) {
    for (r &= ~xc, r &= ~Ls, t.suspendedLanes |= r, t.pingedLanes &= ~r, t = t.expirationTimes; 0 < r; ) {
      var a = 31 - Ct(r), f = 1 << a;
      t[a] = -1, r &= ~f;
    }
  }
  function np(t) {
    if ((Ee & 6) !== 0) throw Error(o(327));
    ao();
    var r = Gr(t, 0);
    if ((r & 1) === 0) return yt(t, Xe()), null;
    var a = Ys(t, r);
    if (t.tag !== 0 && a === 2) {
      var f = Do(t);
      f !== 0 && (r = f, a = _c(t, f));
    }
    if (a === 1) throw a = ua, wr(t, 0), Un(t, r), yt(t, Xe()), a;
    if (a === 6) throw Error(o(345));
    return t.finishedWork = t.current.alternate, t.finishedLanes = r, vr(t, ht, In), yt(t, Xe()), null;
  }
  function Ac(t, r) {
    var a = Ee;
    Ee |= 1;
    try {
      return t(r);
    } finally {
      Ee = a, Ee === 0 && (oo = Xe() + 500, Is && Ln());
    }
  }
  function yr(t) {
    Zn !== null && Zn.tag === 0 && (Ee & 6) === 0 && ao();
    var r = Ee;
    Ee |= 1;
    var a = Gt.transition, f = Pe;
    try {
      if (Gt.transition = null, Pe = 1, t) return t();
    } finally {
      Pe = f, Gt.transition = a, Ee = r, (Ee & 6) === 0 && Ln();
    }
  }
  function Sc() {
    At = ro.current, ze(ro);
  }
  function wr(t, r) {
    t.finishedWork = null, t.finishedLanes = 0;
    var a = t.timeoutHandle;
    if (a !== -1 && (t.timeoutHandle = -1, pv(a)), $e !== null) for (a = $e.return; a !== null; ) {
      var f = a;
      switch (Gl(f), f.tag) {
        case 1:
          f = f.type.childContextTypes, f != null && vs();
          break;
        case 3:
          eo(), ze(pt), ze(at), Ul();
          break;
        case 5:
          Zl(f);
          break;
        case 4:
          eo();
          break;
        case 13:
          ze(Ke);
          break;
        case 19:
          ze(Ke);
          break;
        case 10:
          Ll(f.type._context);
          break;
        case 22:
        case 23:
          Sc();
      }
      a = a.return;
    }
    if (tt = t, $e = t = $n(t.current, null), ot = At = r, qe = 0, ua = null, xc = Ls = hr = 0, ht = da = null, pr !== null) {
      for (r = 0; r < pr.length; r++) if (a = pr[r], f = a.interleaved, f !== null) {
        a.interleaved = null;
        var y = f.next, v = a.pending;
        if (v !== null) {
          var N = v.next;
          v.next = y, f.next = N;
        }
        a.pending = f;
      }
      pr = null;
    }
    return t;
  }
  function rp(t, r) {
    do {
      var a = $e;
      try {
        if (Ol(), Rs.current = Ds, Ts) {
          for (var f = Ze.memoizedState; f !== null; ) {
            var y = f.queue;
            y !== null && (y.pending = null), f = f.next;
          }
          Ts = !1;
        }
        if (mr = 0, et = Je = Ze = null, oa = !1, aa = 0, vc.current = null, a === null || a.return === null) {
          qe = 1, ua = r, $e = null;
          break;
        }
        e: {
          var v = t, N = a.return, B = a, O = r;
          if (r = ot, B.flags |= 32768, O !== null && typeof O == "object" && typeof O.then == "function") {
            var ee = O, se = B, ie = se.tag;
            if ((se.mode & 1) === 0 && (ie === 0 || ie === 11 || ie === 15)) {
              var ae = se.alternate;
              ae ? (se.updateQueue = ae.updateQueue, se.memoizedState = ae.memoizedState, se.lanes = ae.lanes) : (se.updateQueue = null, se.memoizedState = null);
            }
            var ge = kf(N);
            if (ge !== null) {
              ge.flags &= -257, jf(ge, N, B, v, r), ge.mode & 1 && Sf(v, ee, r), r = ge, O = ee;
              var ye = r.updateQueue;
              if (ye === null) {
                var ve = /* @__PURE__ */ new Set();
                ve.add(O), r.updateQueue = ve;
              } else ye.add(O);
              break e;
            } else {
              if ((r & 1) === 0) {
                Sf(v, ee, r), kc();
                break e;
              }
              O = Error(o(426));
            }
          } else if (Oe && B.mode & 1) {
            var Ue = kf(N);
            if (Ue !== null) {
              (Ue.flags & 65536) === 0 && (Ue.flags |= 256), jf(Ue, N, B, v, r), Vl(to(O, B));
              break e;
            }
          }
          v = O = to(O, B), qe !== 4 && (qe = 2), da === null ? da = [v] : da.push(v), v = N;
          do {
            switch (v.tag) {
              case 3:
                v.flags |= 65536, r &= -r, v.lanes |= r;
                var $ = Nf(v, O, r);
                Qd(v, $);
                break e;
              case 1:
                B = O;
                var X = v.type, J = v.stateNode;
                if ((v.flags & 128) === 0 && (typeof X.getDerivedStateFromError == "function" || J !== null && typeof J.componentDidCatch == "function" && (Kn === null || !Kn.has(J)))) {
                  v.flags |= 65536, r &= -r, v.lanes |= r;
                  var ce = Af(v, B, r);
                  Qd(v, ce);
                  break e;
                }
            }
            v = v.return;
          } while (v !== null);
        }
        sp(a);
      } catch (Ie) {
        r = Ie, $e === a && a !== null && ($e = a = a.return);
        continue;
      }
      break;
    } while (!0);
  }
  function op() {
    var t = Os.current;
    return Os.current = Ds, t === null ? Ds : t;
  }
  function kc() {
    (qe === 0 || qe === 3 || qe === 2) && (qe = 4), tt === null || (hr & 268435455) === 0 && (Ls & 268435455) === 0 || Un(tt, ot);
  }
  function Ys(t, r) {
    var a = Ee;
    Ee |= 2;
    var f = op();
    (tt !== t || ot !== r) && (In = null, wr(t, r));
    do
      try {
        Fv();
        break;
      } catch (y) {
        rp(t, y);
      }
    while (!0);
    if (Ol(), Ee = a, Os.current = f, $e !== null) throw Error(o(261));
    return tt = null, ot = 0, qe;
  }
  function Fv() {
    for (; $e !== null; ) ap($e);
  }
  function Vv() {
    for (; $e !== null && !Qi(); ) ap($e);
  }
  function ap(t) {
    var r = cp(t.alternate, t, At);
    t.memoizedProps = t.pendingProps, r === null ? sp(t) : $e = r, vc.current = null;
  }
  function sp(t) {
    var r = t;
    do {
      var a = r.alternate;
      if (t = r.return, (r.flags & 32768) === 0) {
        if (a = Rv(a, r, At), a !== null) {
          $e = a;
          return;
        }
      } else {
        if (a = Tv(a, r), a !== null) {
          a.flags &= 32767, $e = a;
          return;
        }
        if (t !== null) t.flags |= 32768, t.subtreeFlags = 0, t.deletions = null;
        else {
          qe = 6, $e = null;
          return;
        }
      }
      if (r = r.sibling, r !== null) {
        $e = r;
        return;
      }
      $e = r = t;
    } while (r !== null);
    qe === 0 && (qe = 5);
  }
  function vr(t, r, a) {
    var f = Pe, y = Gt.transition;
    try {
      Gt.transition = null, Pe = 1, zv(t, r, a, f);
    } finally {
      Gt.transition = y, Pe = f;
    }
    return null;
  }
  function zv(t, r, a, f) {
    do
      ao();
    while (Zn !== null);
    if ((Ee & 6) !== 0) throw Error(o(327));
    a = t.finishedWork;
    var y = t.finishedLanes;
    if (a === null) return null;
    if (t.finishedWork = null, t.finishedLanes = 0, a === t.current) throw Error(o(177));
    t.callbackNode = null, t.callbackPriority = 0;
    var v = a.lanes | a.childLanes;
    if (ns(t, v), t === tt && ($e = tt = null, ot = 0), (a.subtreeFlags & 2064) === 0 && (a.flags & 2064) === 0 || Ws || (Ws = !0, up(Br, function() {
      return ao(), null;
    })), v = (a.flags & 15990) !== 0, (a.subtreeFlags & 15990) !== 0 || v) {
      v = Gt.transition, Gt.transition = null;
      var N = Pe;
      Pe = 1;
      var B = Ee;
      Ee |= 4, vc.current = null, Ev(t, a), $f(a, t), sv(kl), as = !!Sl, kl = Sl = null, t.current = a, Dv(a), Ja(), Ee = B, Pe = N, Gt.transition = v;
    } else t.current = a;
    if (Ws && (Ws = !1, Zn = t, Xs = y), v = t.pendingLanes, v === 0 && (Kn = null), el(a.stateNode), yt(t, Xe()), r !== null) for (f = t.onRecoverableError, a = 0; a < r.length; a++) y = r[a], f(y.value, { componentStack: y.stack, digest: y.digest });
    if (Hs) throw Hs = !1, t = Cc, Cc = null, t;
    return (Xs & 1) !== 0 && t.tag !== 0 && ao(), v = t.pendingLanes, (v & 1) !== 0 ? t === bc ? fa++ : (fa = 0, bc = t) : fa = 0, Ln(), null;
  }
  function ao() {
    if (Zn !== null) {
      var t = Zu(Xs), r = Gt.transition, a = Pe;
      try {
        if (Gt.transition = null, Pe = 16 > t ? 16 : t, Zn === null) var f = !1;
        else {
          if (t = Zn, Zn = null, Xs = 0, (Ee & 6) !== 0) throw Error(o(331));
          var y = Ee;
          for (Ee |= 4, he = t.current; he !== null; ) {
            var v = he, N = v.child;
            if ((he.flags & 16) !== 0) {
              var B = v.deletions;
              if (B !== null) {
                for (var O = 0; O < B.length; O++) {
                  var ee = B[O];
                  for (he = ee; he !== null; ) {
                    var se = he;
                    switch (se.tag) {
                      case 0:
                      case 11:
                      case 15:
                        ca(8, se, v);
                    }
                    var ie = se.child;
                    if (ie !== null) ie.return = se, he = ie;
                    else for (; he !== null; ) {
                      se = he;
                      var ae = se.sibling, ge = se.return;
                      if (Xf(se), se === ee) {
                        he = null;
                        break;
                      }
                      if (ae !== null) {
                        ae.return = ge, he = ae;
                        break;
                      }
                      he = ge;
                    }
                  }
                }
                var ye = v.alternate;
                if (ye !== null) {
                  var ve = ye.child;
                  if (ve !== null) {
                    ye.child = null;
                    do {
                      var Ue = ve.sibling;
                      ve.sibling = null, ve = Ue;
                    } while (ve !== null);
                  }
                }
                he = v;
              }
            }
            if ((v.subtreeFlags & 2064) !== 0 && N !== null) N.return = v, he = N;
            else e: for (; he !== null; ) {
              if (v = he, (v.flags & 2048) !== 0) switch (v.tag) {
                case 0:
                case 11:
                case 15:
                  ca(9, v, v.return);
              }
              var $ = v.sibling;
              if ($ !== null) {
                $.return = v.return, he = $;
                break e;
              }
              he = v.return;
            }
          }
          var X = t.current;
          for (he = X; he !== null; ) {
            N = he;
            var J = N.child;
            if ((N.subtreeFlags & 2064) !== 0 && J !== null) J.return = N, he = J;
            else e: for (N = X; he !== null; ) {
              if (B = he, (B.flags & 2048) !== 0) try {
                switch (B.tag) {
                  case 0:
                  case 11:
                  case 15:
                    zs(9, B);
                }
              } catch (Ie) {
                Ye(B, B.return, Ie);
              }
              if (B === N) {
                he = null;
                break e;
              }
              var ce = B.sibling;
              if (ce !== null) {
                ce.return = B.return, he = ce;
                break e;
              }
              he = B.return;
            }
          }
          if (Ee = y, Ln(), Rt && typeof Rt.onPostCommitFiberRoot == "function") try {
            Rt.onPostCommitFiberRoot(ir, t);
          } catch {
          }
          f = !0;
        }
        return f;
      } finally {
        Pe = a, Gt.transition = r;
      }
    }
    return !1;
  }
  function ip(t, r, a) {
    r = to(a, r), r = Nf(t, r, 1), t = Wn(t, r, 1), r = dt(), t !== null && (lr(t, 1, r), yt(t, r));
  }
  function Ye(t, r, a) {
    if (t.tag === 3) ip(t, t, a);
    else for (; r !== null; ) {
      if (r.tag === 3) {
        ip(r, t, a);
        break;
      } else if (r.tag === 1) {
        var f = r.stateNode;
        if (typeof r.type.getDerivedStateFromError == "function" || typeof f.componentDidCatch == "function" && (Kn === null || !Kn.has(f))) {
          t = to(a, t), t = Af(r, t, 1), r = Wn(r, t, 1), t = dt(), r !== null && (lr(r, 1, t), yt(r, t));
          break;
        }
      }
      r = r.return;
    }
  }
  function Ov(t, r, a) {
    var f = t.pingCache;
    f !== null && f.delete(r), r = dt(), t.pingedLanes |= t.suspendedLanes & a, tt === t && (ot & a) === a && (qe === 4 || qe === 3 && (ot & 130023424) === ot && 500 > Xe() - Ic ? wr(t, 0) : xc |= a), yt(t, r);
  }
  function lp(t, r) {
    r === 0 && ((t.mode & 1) === 0 ? r = 1 : (r = Dr, Dr <<= 1, (Dr & 130023424) === 0 && (Dr = 4194304)));
    var a = dt();
    t = wn(t, r), t !== null && (lr(t, r, a), yt(t, a));
  }
  function Lv(t) {
    var r = t.memoizedState, a = 0;
    r !== null && (a = r.retryLane), lp(t, a);
  }
  function Hv(t, r) {
    var a = 0;
    switch (t.tag) {
      case 13:
        var f = t.stateNode, y = t.memoizedState;
        y !== null && (a = y.retryLane);
        break;
      case 19:
        f = t.stateNode;
        break;
      default:
        throw Error(o(314));
    }
    f !== null && f.delete(r), lp(t, a);
  }
  var cp;
  cp = function(t, r, a) {
    if (t !== null) if (t.memoizedProps !== r.pendingProps || pt.current) mt = !0;
    else {
      if ((t.lanes & a) === 0 && (r.flags & 128) === 0) return mt = !1, Mv(t, r, a);
      mt = (t.flags & 131072) !== 0;
    }
    else mt = !1, Oe && (r.flags & 1048576) !== 0 && Od(r, bs, r.index);
    switch (r.lanes = 0, r.tag) {
      case 2:
        var f = r.type;
        Fs(t, r), t = r.pendingProps;
        var y = Zr(r, at.current);
        qr(r, a), y = Jl(null, r, f, t, y, a);
        var v = ql();
        return r.flags |= 1, typeof y == "object" && y !== null && typeof y.render == "function" && y.$$typeof === void 0 ? (r.tag = 1, r.memoizedState = null, r.updateQueue = null, gt(f) ? (v = !0, xs(r)) : v = !1, r.memoizedState = y.state !== null && y.state !== void 0 ? y.state : null, Xl(r), y.updater = Gs, r.stateNode = y, y._reactInternals = r, ac(r, f, t, a), r = cc(null, r, f, !0, v, a)) : (r.tag = 0, Oe && v && Dl(r), ut(null, r, y, a), r = r.child), r;
      case 16:
        f = r.elementType;
        e: {
          switch (Fs(t, r), t = r.pendingProps, y = f._init, f = y(f._payload), r.type = f, y = r.tag = Xv(f), t = Ot(f, t), y) {
            case 0:
              r = lc(null, r, f, t, a);
              break e;
            case 1:
              r = Df(null, r, f, t, a);
              break e;
            case 11:
              r = Mf(null, r, f, t, a);
              break e;
            case 14:
              r = Rf(null, r, f, Ot(f.type, t), a);
              break e;
          }
          throw Error(o(
            306,
            f,
            ""
          ));
        }
        return r;
      case 0:
        return f = r.type, y = r.pendingProps, y = r.elementType === f ? y : Ot(f, y), lc(t, r, f, y, a);
      case 1:
        return f = r.type, y = r.pendingProps, y = r.elementType === f ? y : Ot(f, y), Df(t, r, f, y, a);
      case 3:
        e: {
          if (Gf(r), t === null) throw Error(o(387));
          f = r.pendingProps, v = r.memoizedState, y = v.element, $d(t, r), js(r, f, null, a);
          var N = r.memoizedState;
          if (f = N.element, v.isDehydrated) if (v = { element: f, isDehydrated: !1, cache: N.cache, pendingSuspenseBoundaries: N.pendingSuspenseBoundaries, transitions: N.transitions }, r.updateQueue.baseState = v, r.memoizedState = v, r.flags & 256) {
            y = to(Error(o(423)), r), r = Pf(t, r, f, a, y);
            break e;
          } else if (f !== y) {
            y = to(Error(o(424)), r), r = Pf(t, r, f, a, y);
            break e;
          } else for (Nt = Vn(r.stateNode.containerInfo.firstChild), _t = r, Oe = !0, zt = null, a = Yd(r, null, f, a), r.child = a; a; ) a.flags = a.flags & -3 | 4096, a = a.sibling;
          else {
            if ($r(), f === y) {
              r = xn(t, r, a);
              break e;
            }
            ut(t, r, f, a);
          }
          r = r.child;
        }
        return r;
      case 5:
        return qd(r), t === null && Fl(r), f = r.type, y = r.pendingProps, v = t !== null ? t.memoizedProps : null, N = y.children, jl(f, y) ? N = null : v !== null && jl(f, v) && (r.flags |= 32), Ef(t, r), ut(t, r, N, a), r.child;
      case 6:
        return t === null && Fl(r), null;
      case 13:
        return Ff(t, r, a);
      case 4:
        return Kl(r, r.stateNode.containerInfo), f = r.pendingProps, t === null ? r.child = Qr(r, null, f, a) : ut(t, r, f, a), r.child;
      case 11:
        return f = r.type, y = r.pendingProps, y = r.elementType === f ? y : Ot(f, y), Mf(t, r, f, y, a);
      case 7:
        return ut(t, r, r.pendingProps, a), r.child;
      case 8:
        return ut(t, r, r.pendingProps.children, a), r.child;
      case 12:
        return ut(t, r, r.pendingProps.children, a), r.child;
      case 10:
        e: {
          if (f = r.type._context, y = r.pendingProps, v = r.memoizedProps, N = y.value, Fe(As, f._currentValue), f._currentValue = N, v !== null) if (Vt(v.value, N)) {
            if (v.children === y.children && !pt.current) {
              r = xn(t, r, a);
              break e;
            }
          } else for (v = r.child, v !== null && (v.return = r); v !== null; ) {
            var B = v.dependencies;
            if (B !== null) {
              N = v.child;
              for (var O = B.firstContext; O !== null; ) {
                if (O.context === f) {
                  if (v.tag === 1) {
                    O = vn(-1, a & -a), O.tag = 2;
                    var ee = v.updateQueue;
                    if (ee !== null) {
                      ee = ee.shared;
                      var se = ee.pending;
                      se === null ? O.next = O : (O.next = se.next, se.next = O), ee.pending = O;
                    }
                  }
                  v.lanes |= a, O = v.alternate, O !== null && (O.lanes |= a), Hl(
                    v.return,
                    a,
                    r
                  ), B.lanes |= a;
                  break;
                }
                O = O.next;
              }
            } else if (v.tag === 10) N = v.type === r.type ? null : v.child;
            else if (v.tag === 18) {
              if (N = v.return, N === null) throw Error(o(341));
              N.lanes |= a, B = N.alternate, B !== null && (B.lanes |= a), Hl(N, a, r), N = v.sibling;
            } else N = v.child;
            if (N !== null) N.return = v;
            else for (N = v; N !== null; ) {
              if (N === r) {
                N = null;
                break;
              }
              if (v = N.sibling, v !== null) {
                v.return = N.return, N = v;
                break;
              }
              N = N.return;
            }
            v = N;
          }
          ut(t, r, y.children, a), r = r.child;
        }
        return r;
      case 9:
        return y = r.type, f = r.pendingProps.children, qr(r, a), y = Et(y), f = f(y), r.flags |= 1, ut(t, r, f, a), r.child;
      case 14:
        return f = r.type, y = Ot(f, r.pendingProps), y = Ot(f.type, y), Rf(t, r, f, y, a);
      case 15:
        return Tf(t, r, r.type, r.pendingProps, a);
      case 17:
        return f = r.type, y = r.pendingProps, y = r.elementType === f ? y : Ot(f, y), Fs(t, r), r.tag = 1, gt(f) ? (t = !0, xs(r)) : t = !1, qr(r, a), bf(r, f, y), ac(r, f, y, a), cc(null, r, f, !0, t, a);
      case 19:
        return zf(t, r, a);
      case 22:
        return Bf(t, r, a);
    }
    throw Error(o(156, r.tag));
  };
  function up(t, r) {
    return $a(t, r);
  }
  function Wv(t, r, a, f) {
    this.tag = t, this.key = a, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = r, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = f, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function Pt(t, r, a, f) {
    return new Wv(t, r, a, f);
  }
  function jc(t) {
    return t = t.prototype, !(!t || !t.isReactComponent);
  }
  function Xv(t) {
    if (typeof t == "function") return jc(t) ? 1 : 0;
    if (t != null) {
      if (t = t.$$typeof, t === W) return 11;
      if (t === Y) return 14;
    }
    return 2;
  }
  function $n(t, r) {
    var a = t.alternate;
    return a === null ? (a = Pt(t.tag, r, t.key, t.mode), a.elementType = t.elementType, a.type = t.type, a.stateNode = t.stateNode, a.alternate = t, t.alternate = a) : (a.pendingProps = r, a.type = t.type, a.flags = 0, a.subtreeFlags = 0, a.deletions = null), a.flags = t.flags & 14680064, a.childLanes = t.childLanes, a.lanes = t.lanes, a.child = t.child, a.memoizedProps = t.memoizedProps, a.memoizedState = t.memoizedState, a.updateQueue = t.updateQueue, r = t.dependencies, a.dependencies = r === null ? null : { lanes: r.lanes, firstContext: r.firstContext }, a.sibling = t.sibling, a.index = t.index, a.ref = t.ref, a;
  }
  function Us(t, r, a, f, y, v) {
    var N = 2;
    if (f = t, typeof t == "function") jc(t) && (N = 1);
    else if (typeof t == "string") N = 5;
    else e: switch (t) {
      case T:
        return xr(a.children, y, v, r);
      case K:
        N = 8, y |= 8;
        break;
      case D:
        return t = Pt(12, a, r, y | 2), t.elementType = D, t.lanes = v, t;
      case q:
        return t = Pt(13, a, r, y), t.elementType = q, t.lanes = v, t;
      case R:
        return t = Pt(19, a, r, y), t.elementType = R, t.lanes = v, t;
      case U:
        return $s(a, y, v, r);
      default:
        if (typeof t == "object" && t !== null) switch (t.$$typeof) {
          case F:
            N = 10;
            break e;
          case z:
            N = 9;
            break e;
          case W:
            N = 11;
            break e;
          case Y:
            N = 14;
            break e;
          case H:
            N = 16, f = null;
            break e;
        }
        throw Error(o(130, t == null ? t : typeof t, ""));
    }
    return r = Pt(N, a, r, y), r.elementType = t, r.type = f, r.lanes = v, r;
  }
  function xr(t, r, a, f) {
    return t = Pt(7, t, f, r), t.lanes = a, t;
  }
  function $s(t, r, a, f) {
    return t = Pt(22, t, f, r), t.elementType = U, t.lanes = a, t.stateNode = { isHidden: !1 }, t;
  }
  function Mc(t, r, a) {
    return t = Pt(6, t, null, r), t.lanes = a, t;
  }
  function Rc(t, r, a) {
    return r = Pt(4, t.children !== null ? t.children : [], t.key, r), r.lanes = a, r.stateNode = { containerInfo: t.containerInfo, pendingChildren: null, implementation: t.implementation }, r;
  }
  function Kv(t, r, a, f, y) {
    this.tag = r, this.containerInfo = t, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = Go(0), this.expirationTimes = Go(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = Go(0), this.identifierPrefix = f, this.onRecoverableError = y, this.mutableSourceEagerHydrationData = null;
  }
  function Tc(t, r, a, f, y, v, N, B, O) {
    return t = new Kv(t, r, a, B, O), r === 1 ? (r = 1, v === !0 && (r |= 8)) : r = 0, v = Pt(3, null, null, r), t.current = v, v.stateNode = t, v.memoizedState = { element: f, isDehydrated: a, cache: null, transitions: null, pendingSuspenseBoundaries: null }, Xl(v), t;
  }
  function Zv(t, r, a) {
    var f = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: G, key: f == null ? null : "" + f, children: t, containerInfo: r, implementation: a };
  }
  function dp(t) {
    if (!t) return On;
    t = t._reactInternals;
    e: {
      if (Jt(t) !== t || t.tag !== 1) throw Error(o(170));
      var r = t;
      do {
        switch (r.tag) {
          case 3:
            r = r.stateNode.context;
            break e;
          case 1:
            if (gt(r.type)) {
              r = r.stateNode.__reactInternalMemoizedMergedChildContext;
              break e;
            }
        }
        r = r.return;
      } while (r !== null);
      throw Error(o(171));
    }
    if (t.tag === 1) {
      var a = t.type;
      if (gt(a)) return Fd(t, a, r);
    }
    return r;
  }
  function fp(t, r, a, f, y, v, N, B, O) {
    return t = Tc(a, f, !0, t, y, v, N, B, O), t.context = dp(null), a = t.current, f = dt(), y = Yn(a), v = vn(f, y), v.callback = r ?? null, Wn(a, v, y), t.current.lanes = y, lr(t, y, f), yt(t, f), t;
  }
  function Qs(t, r, a, f) {
    var y = r.current, v = dt(), N = Yn(y);
    return a = dp(a), r.context === null ? r.context = a : r.pendingContext = a, r = vn(v, N), r.payload = { element: t }, f = f === void 0 ? null : f, f !== null && (r.callback = f), t = Wn(y, r, N), t !== null && (Wt(t, y, N, v), ks(t, y, N)), N;
  }
  function Js(t) {
    if (t = t.current, !t.child) return null;
    switch (t.child.tag) {
      case 5:
        return t.child.stateNode;
      default:
        return t.child.stateNode;
    }
  }
  function pp(t, r) {
    if (t = t.memoizedState, t !== null && t.dehydrated !== null) {
      var a = t.retryLane;
      t.retryLane = a !== 0 && a < r ? a : r;
    }
  }
  function Bc(t, r) {
    pp(t, r), (t = t.alternate) && pp(t, r);
  }
  function Yv() {
    return null;
  }
  var gp = typeof reportError == "function" ? reportError : function(t) {
    console.error(t);
  };
  function Ec(t) {
    this._internalRoot = t;
  }
  qs.prototype.render = Ec.prototype.render = function(t) {
    var r = this._internalRoot;
    if (r === null) throw Error(o(409));
    Qs(t, r, null, null);
  }, qs.prototype.unmount = Ec.prototype.unmount = function() {
    var t = this._internalRoot;
    if (t !== null) {
      this._internalRoot = null;
      var r = t.containerInfo;
      yr(function() {
        Qs(null, t, null, null);
      }), r[gn] = null;
    }
  };
  function qs(t) {
    this._internalRoot = t;
  }
  qs.prototype.unstable_scheduleHydration = function(t) {
    if (t) {
      var r = $u();
      t = { blockedOn: null, target: t, priority: r };
      for (var a = 0; a < Gn.length && r !== 0 && r < Gn[a].priority; a++) ;
      Gn.splice(a, 0, t), a === 0 && qu(t);
    }
  };
  function Dc(t) {
    return !(!t || t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11);
  }
  function ei(t) {
    return !(!t || t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11 && (t.nodeType !== 8 || t.nodeValue !== " react-mount-point-unstable "));
  }
  function mp() {
  }
  function Uv(t, r, a, f, y) {
    if (y) {
      if (typeof f == "function") {
        var v = f;
        f = function() {
          var ee = Js(N);
          v.call(ee);
        };
      }
      var N = fp(r, f, t, 0, null, !1, !1, "", mp);
      return t._reactRootContainer = N, t[gn] = N.current, $o(t.nodeType === 8 ? t.parentNode : t), yr(), N;
    }
    for (; y = t.lastChild; ) t.removeChild(y);
    if (typeof f == "function") {
      var B = f;
      f = function() {
        var ee = Js(O);
        B.call(ee);
      };
    }
    var O = Tc(t, 0, !1, null, null, !1, !1, "", mp);
    return t._reactRootContainer = O, t[gn] = O.current, $o(t.nodeType === 8 ? t.parentNode : t), yr(function() {
      Qs(r, O, a, f);
    }), O;
  }
  function ti(t, r, a, f, y) {
    var v = a._reactRootContainer;
    if (v) {
      var N = v;
      if (typeof y == "function") {
        var B = y;
        y = function() {
          var O = Js(N);
          B.call(O);
        };
      }
      Qs(r, N, t, y);
    } else N = Uv(a, r, t, y, f);
    return Js(N);
  }
  Yu = function(t) {
    switch (t.tag) {
      case 3:
        var r = t.stateNode;
        if (r.current.memoizedState.isDehydrated) {
          var a = qt(r.pendingLanes);
          a !== 0 && (al(r, a | 1), yt(r, Xe()), (Ee & 6) === 0 && (oo = Xe() + 500, Ln()));
        }
        break;
      case 13:
        yr(function() {
          var f = wn(t, 1);
          if (f !== null) {
            var y = dt();
            Wt(f, t, 1, y);
          }
        }), Bc(t, 1);
    }
  }, sl = function(t) {
    if (t.tag === 13) {
      var r = wn(t, 134217728);
      if (r !== null) {
        var a = dt();
        Wt(r, t, 134217728, a);
      }
      Bc(t, 134217728);
    }
  }, Uu = function(t) {
    if (t.tag === 13) {
      var r = Yn(t), a = wn(t, r);
      if (a !== null) {
        var f = dt();
        Wt(a, t, r, f);
      }
      Bc(t, r);
    }
  }, $u = function() {
    return Pe;
  }, Qu = function(t, r) {
    var a = Pe;
    try {
      return Pe = t, r();
    } finally {
      Pe = a;
    }
  }, ko = function(t, r, a) {
    switch (r) {
      case "input":
        if (We(t, a), r = a.name, a.type === "radio" && r != null) {
          for (a = t; a.parentNode; ) a = a.parentNode;
          for (a = a.querySelectorAll("input[name=" + JSON.stringify("" + r) + '][type="radio"]'), r = 0; r < a.length; r++) {
            var f = a[r];
            if (f !== t && f.form === t.form) {
              var y = ws(f);
              if (!y) throw Error(o(90));
              Ce(f), We(f, y);
            }
          }
        }
        break;
      case "textarea":
        Mr(t, a);
        break;
      case "select":
        r = a.value, r != null && Mt(t, !!a.multiple, r, !1);
    }
  }, Xa = Ac, Ka = yr;
  var $v = { usingClientEntryPoint: !1, Events: [qo, Xr, ws, Ha, Wa, Ac] }, pa = { findFiberByHostInstance: cr, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, Qv = { bundleType: pa.bundleType, version: pa.version, rendererPackageName: pa.rendererPackageName, rendererConfig: pa.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: S.ReactCurrentDispatcher, findHostInstanceByFiber: function(t) {
    return t = Ya(t), t === null ? null : t.stateNode;
  }, findFiberByHostInstance: pa.findFiberByHostInstance || Yv, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var ni = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!ni.isDisabled && ni.supportsFiber) try {
      ir = ni.inject(Qv), Rt = ni;
    } catch {
    }
  }
  return wt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = $v, wt.createPortal = function(t, r) {
    var a = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!Dc(r)) throw Error(o(200));
    return Zv(t, r, null, a);
  }, wt.createRoot = function(t, r) {
    if (!Dc(t)) throw Error(o(299));
    var a = !1, f = "", y = gp;
    return r != null && (r.unstable_strictMode === !0 && (a = !0), r.identifierPrefix !== void 0 && (f = r.identifierPrefix), r.onRecoverableError !== void 0 && (y = r.onRecoverableError)), r = Tc(t, 1, !1, null, null, a, !1, f, y), t[gn] = r.current, $o(t.nodeType === 8 ? t.parentNode : t), new Ec(r);
  }, wt.findDOMNode = function(t) {
    if (t == null) return null;
    if (t.nodeType === 1) return t;
    var r = t._reactInternals;
    if (r === void 0)
      throw typeof t.render == "function" ? Error(o(188)) : (t = Object.keys(t).join(","), Error(o(268, t)));
    return t = Ya(r), t = t === null ? null : t.stateNode, t;
  }, wt.flushSync = function(t) {
    return yr(t);
  }, wt.hydrate = function(t, r, a) {
    if (!ei(r)) throw Error(o(200));
    return ti(null, t, r, !0, a);
  }, wt.hydrateRoot = function(t, r, a) {
    if (!Dc(t)) throw Error(o(405));
    var f = a != null && a.hydratedSources || null, y = !1, v = "", N = gp;
    if (a != null && (a.unstable_strictMode === !0 && (y = !0), a.identifierPrefix !== void 0 && (v = a.identifierPrefix), a.onRecoverableError !== void 0 && (N = a.onRecoverableError)), r = fp(r, null, t, 1, a ?? null, y, !1, v, N), t[gn] = r.current, $o(t), f) for (t = 0; t < f.length; t++) a = f[t], y = a._getVersion, y = y(a._source), r.mutableSourceEagerHydrationData == null ? r.mutableSourceEagerHydrationData = [a, y] : r.mutableSourceEagerHydrationData.push(
      a,
      y
    );
    return new qs(r);
  }, wt.render = function(t, r, a) {
    if (!ei(r)) throw Error(o(200));
    return ti(null, t, r, !1, a);
  }, wt.unmountComponentAtNode = function(t) {
    if (!ei(t)) throw Error(o(40));
    return t._reactRootContainer ? (yr(function() {
      ti(null, null, t, !1, function() {
        t._reactRootContainer = null, t[gn] = null;
      });
    }), !0) : !1;
  }, wt.unstable_batchedUpdates = Ac, wt.unstable_renderSubtreeIntoContainer = function(t, r, a, f) {
    if (!ei(a)) throw Error(o(200));
    if (t == null || t._reactInternals === void 0) throw Error(o(38));
    return ti(t, r, a, !1, f);
  }, wt.version = "18.3.1-next-f1338f8080-20240426", wt;
}
var bp;
function Og() {
  if (bp) return Fc.exports;
  bp = 1;
  function e() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(e);
      } catch (n) {
        console.error(n);
      }
  }
  return e(), Fc.exports = sx(), Fc.exports;
}
var _p;
function ix() {
  if (_p) return ri;
  _p = 1;
  var e = Og();
  return ri.createRoot = e.createRoot, ri.hydrateRoot = e.hydrateRoot, ri;
}
var lx = ix();
const Lg = /* @__PURE__ */ Cu(lx);
function Qe(e) {
  if (typeof e == "string" || typeof e == "number") return "" + e;
  let n = "";
  if (Array.isArray(e))
    for (let o = 0, s; o < e.length; o++)
      (s = Qe(e[o])) !== "" && (n += (n && " ") + s);
  else
    for (let o in e)
      e[o] && (n += (n && " ") + o);
  return n;
}
var cx = { value: () => {
} };
function Ti() {
  for (var e = 0, n = arguments.length, o = {}, s; e < n; ++e) {
    if (!(s = arguments[e] + "") || s in o || /[\s.]/.test(s)) throw new Error("illegal type: " + s);
    o[s] = [];
  }
  return new gi(o);
}
function gi(e) {
  this._ = e;
}
function ux(e, n) {
  return e.trim().split(/^|\s+/).map(function(o) {
    var s = "", i = o.indexOf(".");
    if (i >= 0 && (s = o.slice(i + 1), o = o.slice(0, i)), o && !n.hasOwnProperty(o)) throw new Error("unknown type: " + o);
    return { type: o, name: s };
  });
}
gi.prototype = Ti.prototype = {
  constructor: gi,
  on: function(e, n) {
    var o = this._, s = ux(e + "", o), i, l = -1, c = s.length;
    if (arguments.length < 2) {
      for (; ++l < c; ) if ((i = (e = s[l]).type) && (i = dx(o[i], e.name))) return i;
      return;
    }
    if (n != null && typeof n != "function") throw new Error("invalid callback: " + n);
    for (; ++l < c; )
      if (i = (e = s[l]).type) o[i] = Np(o[i], e.name, n);
      else if (n == null) for (i in o) o[i] = Np(o[i], e.name, null);
    return this;
  },
  copy: function() {
    var e = {}, n = this._;
    for (var o in n) e[o] = n[o].slice();
    return new gi(e);
  },
  call: function(e, n) {
    if ((i = arguments.length - 2) > 0) for (var o = new Array(i), s = 0, i, l; s < i; ++s) o[s] = arguments[s + 2];
    if (!this._.hasOwnProperty(e)) throw new Error("unknown type: " + e);
    for (l = this._[e], s = 0, i = l.length; s < i; ++s) l[s].value.apply(n, o);
  },
  apply: function(e, n, o) {
    if (!this._.hasOwnProperty(e)) throw new Error("unknown type: " + e);
    for (var s = this._[e], i = 0, l = s.length; i < l; ++i) s[i].value.apply(n, o);
  }
};
function dx(e, n) {
  for (var o = 0, s = e.length, i; o < s; ++o)
    if ((i = e[o]).name === n)
      return i.value;
}
function Np(e, n, o) {
  for (var s = 0, i = e.length; s < i; ++s)
    if (e[s].name === n) {
      e[s] = cx, e = e.slice(0, s).concat(e.slice(s + 1));
      break;
    }
  return o != null && e.push({ name: n, value: o }), e;
}
var au = "http://www.w3.org/1999/xhtml";
const Ap = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: au,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
function Bi(e) {
  var n = e += "", o = n.indexOf(":");
  return o >= 0 && (n = e.slice(0, o)) !== "xmlns" && (e = e.slice(o + 1)), Ap.hasOwnProperty(n) ? { space: Ap[n], local: e } : e;
}
function fx(e) {
  return function() {
    var n = this.ownerDocument, o = this.namespaceURI;
    return o === au && n.documentElement.namespaceURI === au ? n.createElement(e) : n.createElementNS(o, e);
  };
}
function px(e) {
  return function() {
    return this.ownerDocument.createElementNS(e.space, e.local);
  };
}
function Hg(e) {
  var n = Bi(e);
  return (n.local ? px : fx)(n);
}
function gx() {
}
function bu(e) {
  return e == null ? gx : function() {
    return this.querySelector(e);
  };
}
function mx(e) {
  typeof e != "function" && (e = bu(e));
  for (var n = this._groups, o = n.length, s = new Array(o), i = 0; i < o; ++i)
    for (var l = n[i], c = l.length, u = s[i] = new Array(c), p, g, m = 0; m < c; ++m)
      (p = l[m]) && (g = e.call(p, p.__data__, m, l)) && ("__data__" in p && (g.__data__ = p.__data__), u[m] = g);
  return new jt(s, this._parents);
}
function hx(e) {
  return e == null ? [] : Array.isArray(e) ? e : Array.from(e);
}
function yx() {
  return [];
}
function Wg(e) {
  return e == null ? yx : function() {
    return this.querySelectorAll(e);
  };
}
function wx(e) {
  return function() {
    return hx(e.apply(this, arguments));
  };
}
function vx(e) {
  typeof e == "function" ? e = wx(e) : e = Wg(e);
  for (var n = this._groups, o = n.length, s = [], i = [], l = 0; l < o; ++l)
    for (var c = n[l], u = c.length, p, g = 0; g < u; ++g)
      (p = c[g]) && (s.push(e.call(p, p.__data__, g, c)), i.push(p));
  return new jt(s, i);
}
function Xg(e) {
  return function() {
    return this.matches(e);
  };
}
function Kg(e) {
  return function(n) {
    return n.matches(e);
  };
}
var xx = Array.prototype.find;
function Ix(e) {
  return function() {
    return xx.call(this.children, e);
  };
}
function Cx() {
  return this.firstElementChild;
}
function bx(e) {
  return this.select(e == null ? Cx : Ix(typeof e == "function" ? e : Kg(e)));
}
var _x = Array.prototype.filter;
function Nx() {
  return Array.from(this.children);
}
function Ax(e) {
  return function() {
    return _x.call(this.children, e);
  };
}
function Sx(e) {
  return this.selectAll(e == null ? Nx : Ax(typeof e == "function" ? e : Kg(e)));
}
function kx(e) {
  typeof e != "function" && (e = Xg(e));
  for (var n = this._groups, o = n.length, s = new Array(o), i = 0; i < o; ++i)
    for (var l = n[i], c = l.length, u = s[i] = [], p, g = 0; g < c; ++g)
      (p = l[g]) && e.call(p, p.__data__, g, l) && u.push(p);
  return new jt(s, this._parents);
}
function Zg(e) {
  return new Array(e.length);
}
function jx() {
  return new jt(this._enter || this._groups.map(Zg), this._parents);
}
function vi(e, n) {
  this.ownerDocument = e.ownerDocument, this.namespaceURI = e.namespaceURI, this._next = null, this._parent = e, this.__data__ = n;
}
vi.prototype = {
  constructor: vi,
  appendChild: function(e) {
    return this._parent.insertBefore(e, this._next);
  },
  insertBefore: function(e, n) {
    return this._parent.insertBefore(e, n);
  },
  querySelector: function(e) {
    return this._parent.querySelector(e);
  },
  querySelectorAll: function(e) {
    return this._parent.querySelectorAll(e);
  }
};
function Mx(e) {
  return function() {
    return e;
  };
}
function Rx(e, n, o, s, i, l) {
  for (var c = 0, u, p = n.length, g = l.length; c < g; ++c)
    (u = n[c]) ? (u.__data__ = l[c], s[c] = u) : o[c] = new vi(e, l[c]);
  for (; c < p; ++c)
    (u = n[c]) && (i[c] = u);
}
function Tx(e, n, o, s, i, l, c) {
  var u, p, g = /* @__PURE__ */ new Map(), m = n.length, h = l.length, w = new Array(m), C;
  for (u = 0; u < m; ++u)
    (p = n[u]) && (w[u] = C = c.call(p, p.__data__, u, n) + "", g.has(C) ? i[u] = p : g.set(C, p));
  for (u = 0; u < h; ++u)
    C = c.call(e, l[u], u, l) + "", (p = g.get(C)) ? (s[u] = p, p.__data__ = l[u], g.delete(C)) : o[u] = new vi(e, l[u]);
  for (u = 0; u < m; ++u)
    (p = n[u]) && g.get(w[u]) === p && (i[u] = p);
}
function Bx(e) {
  return e.__data__;
}
function Ex(e, n) {
  if (!arguments.length) return Array.from(this, Bx);
  var o = n ? Tx : Rx, s = this._parents, i = this._groups;
  typeof e != "function" && (e = Mx(e));
  for (var l = i.length, c = new Array(l), u = new Array(l), p = new Array(l), g = 0; g < l; ++g) {
    var m = s[g], h = i[g], w = h.length, C = Dx(e.call(m, m && m.__data__, g, s)), x = C.length, I = u[g] = new Array(x), b = c[g] = new Array(x), _ = p[g] = new Array(w);
    o(m, h, I, b, _, C, n);
    for (var k = 0, A = 0, S, V; k < x; ++k)
      if (S = I[k]) {
        for (k >= A && (A = k + 1); !(V = b[A]) && ++A < x; ) ;
        S._next = V || null;
      }
  }
  return c = new jt(c, s), c._enter = u, c._exit = p, c;
}
function Dx(e) {
  return typeof e == "object" && "length" in e ? e : Array.from(e);
}
function Gx() {
  return new jt(this._exit || this._groups.map(Zg), this._parents);
}
function Px(e, n, o) {
  var s = this.enter(), i = this, l = this.exit();
  return typeof e == "function" ? (s = e(s), s && (s = s.selection())) : s = s.append(e + ""), n != null && (i = n(i), i && (i = i.selection())), o == null ? l.remove() : o(l), s && i ? s.merge(i).order() : i;
}
function Fx(e) {
  for (var n = e.selection ? e.selection() : e, o = this._groups, s = n._groups, i = o.length, l = s.length, c = Math.min(i, l), u = new Array(i), p = 0; p < c; ++p)
    for (var g = o[p], m = s[p], h = g.length, w = u[p] = new Array(h), C, x = 0; x < h; ++x)
      (C = g[x] || m[x]) && (w[x] = C);
  for (; p < i; ++p)
    u[p] = o[p];
  return new jt(u, this._parents);
}
function Vx() {
  for (var e = this._groups, n = -1, o = e.length; ++n < o; )
    for (var s = e[n], i = s.length - 1, l = s[i], c; --i >= 0; )
      (c = s[i]) && (l && c.compareDocumentPosition(l) ^ 4 && l.parentNode.insertBefore(c, l), l = c);
  return this;
}
function zx(e) {
  e || (e = Ox);
  function n(h, w) {
    return h && w ? e(h.__data__, w.__data__) : !h - !w;
  }
  for (var o = this._groups, s = o.length, i = new Array(s), l = 0; l < s; ++l) {
    for (var c = o[l], u = c.length, p = i[l] = new Array(u), g, m = 0; m < u; ++m)
      (g = c[m]) && (p[m] = g);
    p.sort(n);
  }
  return new jt(i, this._parents).order();
}
function Ox(e, n) {
  return e < n ? -1 : e > n ? 1 : e >= n ? 0 : NaN;
}
function Lx() {
  var e = arguments[0];
  return arguments[0] = this, e.apply(null, arguments), this;
}
function Hx() {
  return Array.from(this);
}
function Wx() {
  for (var e = this._groups, n = 0, o = e.length; n < o; ++n)
    for (var s = e[n], i = 0, l = s.length; i < l; ++i) {
      var c = s[i];
      if (c) return c;
    }
  return null;
}
function Xx() {
  let e = 0;
  for (const n of this) ++e;
  return e;
}
function Kx() {
  return !this.node();
}
function Zx(e) {
  for (var n = this._groups, o = 0, s = n.length; o < s; ++o)
    for (var i = n[o], l = 0, c = i.length, u; l < c; ++l)
      (u = i[l]) && e.call(u, u.__data__, l, i);
  return this;
}
function Yx(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function Ux(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function $x(e, n) {
  return function() {
    this.setAttribute(e, n);
  };
}
function Qx(e, n) {
  return function() {
    this.setAttributeNS(e.space, e.local, n);
  };
}
function Jx(e, n) {
  return function() {
    var o = n.apply(this, arguments);
    o == null ? this.removeAttribute(e) : this.setAttribute(e, o);
  };
}
function qx(e, n) {
  return function() {
    var o = n.apply(this, arguments);
    o == null ? this.removeAttributeNS(e.space, e.local) : this.setAttributeNS(e.space, e.local, o);
  };
}
function e1(e, n) {
  var o = Bi(e);
  if (arguments.length < 2) {
    var s = this.node();
    return o.local ? s.getAttributeNS(o.space, o.local) : s.getAttribute(o);
  }
  return this.each((n == null ? o.local ? Ux : Yx : typeof n == "function" ? o.local ? qx : Jx : o.local ? Qx : $x)(o, n));
}
function Yg(e) {
  return e.ownerDocument && e.ownerDocument.defaultView || e.document && e || e.defaultView;
}
function t1(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function n1(e, n, o) {
  return function() {
    this.style.setProperty(e, n, o);
  };
}
function r1(e, n, o) {
  return function() {
    var s = n.apply(this, arguments);
    s == null ? this.style.removeProperty(e) : this.style.setProperty(e, s, o);
  };
}
function o1(e, n, o) {
  return arguments.length > 1 ? this.each((n == null ? t1 : typeof n == "function" ? r1 : n1)(e, n, o ?? "")) : po(this.node(), e);
}
function po(e, n) {
  return e.style.getPropertyValue(n) || Yg(e).getComputedStyle(e, null).getPropertyValue(n);
}
function a1(e) {
  return function() {
    delete this[e];
  };
}
function s1(e, n) {
  return function() {
    this[e] = n;
  };
}
function i1(e, n) {
  return function() {
    var o = n.apply(this, arguments);
    o == null ? delete this[e] : this[e] = o;
  };
}
function l1(e, n) {
  return arguments.length > 1 ? this.each((n == null ? a1 : typeof n == "function" ? i1 : s1)(e, n)) : this.node()[e];
}
function Ug(e) {
  return e.trim().split(/^|\s+/);
}
function _u(e) {
  return e.classList || new $g(e);
}
function $g(e) {
  this._node = e, this._names = Ug(e.getAttribute("class") || "");
}
$g.prototype = {
  add: function(e) {
    var n = this._names.indexOf(e);
    n < 0 && (this._names.push(e), this._node.setAttribute("class", this._names.join(" ")));
  },
  remove: function(e) {
    var n = this._names.indexOf(e);
    n >= 0 && (this._names.splice(n, 1), this._node.setAttribute("class", this._names.join(" ")));
  },
  contains: function(e) {
    return this._names.indexOf(e) >= 0;
  }
};
function Qg(e, n) {
  for (var o = _u(e), s = -1, i = n.length; ++s < i; ) o.add(n[s]);
}
function Jg(e, n) {
  for (var o = _u(e), s = -1, i = n.length; ++s < i; ) o.remove(n[s]);
}
function c1(e) {
  return function() {
    Qg(this, e);
  };
}
function u1(e) {
  return function() {
    Jg(this, e);
  };
}
function d1(e, n) {
  return function() {
    (n.apply(this, arguments) ? Qg : Jg)(this, e);
  };
}
function f1(e, n) {
  var o = Ug(e + "");
  if (arguments.length < 2) {
    for (var s = _u(this.node()), i = -1, l = o.length; ++i < l; ) if (!s.contains(o[i])) return !1;
    return !0;
  }
  return this.each((typeof n == "function" ? d1 : n ? c1 : u1)(o, n));
}
function p1() {
  this.textContent = "";
}
function g1(e) {
  return function() {
    this.textContent = e;
  };
}
function m1(e) {
  return function() {
    var n = e.apply(this, arguments);
    this.textContent = n ?? "";
  };
}
function h1(e) {
  return arguments.length ? this.each(e == null ? p1 : (typeof e == "function" ? m1 : g1)(e)) : this.node().textContent;
}
function y1() {
  this.innerHTML = "";
}
function w1(e) {
  return function() {
    this.innerHTML = e;
  };
}
function v1(e) {
  return function() {
    var n = e.apply(this, arguments);
    this.innerHTML = n ?? "";
  };
}
function x1(e) {
  return arguments.length ? this.each(e == null ? y1 : (typeof e == "function" ? v1 : w1)(e)) : this.node().innerHTML;
}
function I1() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function C1() {
  return this.each(I1);
}
function b1() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function _1() {
  return this.each(b1);
}
function N1(e) {
  var n = typeof e == "function" ? e : Hg(e);
  return this.select(function() {
    return this.appendChild(n.apply(this, arguments));
  });
}
function A1() {
  return null;
}
function S1(e, n) {
  var o = typeof e == "function" ? e : Hg(e), s = n == null ? A1 : typeof n == "function" ? n : bu(n);
  return this.select(function() {
    return this.insertBefore(o.apply(this, arguments), s.apply(this, arguments) || null);
  });
}
function k1() {
  var e = this.parentNode;
  e && e.removeChild(this);
}
function j1() {
  return this.each(k1);
}
function M1() {
  var e = this.cloneNode(!1), n = this.parentNode;
  return n ? n.insertBefore(e, this.nextSibling) : e;
}
function R1() {
  var e = this.cloneNode(!0), n = this.parentNode;
  return n ? n.insertBefore(e, this.nextSibling) : e;
}
function T1(e) {
  return this.select(e ? R1 : M1);
}
function B1(e) {
  return arguments.length ? this.property("__data__", e) : this.node().__data__;
}
function E1(e) {
  return function(n) {
    e.call(this, n, this.__data__);
  };
}
function D1(e) {
  return e.trim().split(/^|\s+/).map(function(n) {
    var o = "", s = n.indexOf(".");
    return s >= 0 && (o = n.slice(s + 1), n = n.slice(0, s)), { type: n, name: o };
  });
}
function G1(e) {
  return function() {
    var n = this.__on;
    if (n) {
      for (var o = 0, s = -1, i = n.length, l; o < i; ++o)
        l = n[o], (!e.type || l.type === e.type) && l.name === e.name ? this.removeEventListener(l.type, l.listener, l.options) : n[++s] = l;
      ++s ? n.length = s : delete this.__on;
    }
  };
}
function P1(e, n, o) {
  return function() {
    var s = this.__on, i, l = E1(n);
    if (s) {
      for (var c = 0, u = s.length; c < u; ++c)
        if ((i = s[c]).type === e.type && i.name === e.name) {
          this.removeEventListener(i.type, i.listener, i.options), this.addEventListener(i.type, i.listener = l, i.options = o), i.value = n;
          return;
        }
    }
    this.addEventListener(e.type, l, o), i = { type: e.type, name: e.name, value: n, listener: l, options: o }, s ? s.push(i) : this.__on = [i];
  };
}
function F1(e, n, o) {
  var s = D1(e + ""), i, l = s.length, c;
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
  for (u = n ? P1 : G1, i = 0; i < l; ++i) this.each(u(s[i], n, o));
  return this;
}
function qg(e, n, o) {
  var s = Yg(e), i = s.CustomEvent;
  typeof i == "function" ? i = new i(n, o) : (i = s.document.createEvent("Event"), o ? (i.initEvent(n, o.bubbles, o.cancelable), i.detail = o.detail) : i.initEvent(n, !1, !1)), e.dispatchEvent(i);
}
function V1(e, n) {
  return function() {
    return qg(this, e, n);
  };
}
function z1(e, n) {
  return function() {
    return qg(this, e, n.apply(this, arguments));
  };
}
function O1(e, n) {
  return this.each((typeof n == "function" ? z1 : V1)(e, n));
}
function* L1() {
  for (var e = this._groups, n = 0, o = e.length; n < o; ++n)
    for (var s = e[n], i = 0, l = s.length, c; i < l; ++i)
      (c = s[i]) && (yield c);
}
var em = [null];
function jt(e, n) {
  this._groups = e, this._parents = n;
}
function Ta() {
  return new jt([[document.documentElement]], em);
}
function H1() {
  return this;
}
jt.prototype = Ta.prototype = {
  constructor: jt,
  select: mx,
  selectAll: vx,
  selectChild: bx,
  selectChildren: Sx,
  filter: kx,
  data: Ex,
  enter: jx,
  exit: Gx,
  join: Px,
  merge: Fx,
  selection: H1,
  order: Vx,
  sort: zx,
  call: Lx,
  nodes: Hx,
  node: Wx,
  size: Xx,
  empty: Kx,
  each: Zx,
  attr: e1,
  style: o1,
  property: l1,
  classed: f1,
  text: h1,
  html: x1,
  raise: C1,
  lower: _1,
  append: N1,
  insert: S1,
  remove: j1,
  clone: T1,
  datum: B1,
  on: F1,
  dispatch: O1,
  [Symbol.iterator]: L1
};
function St(e) {
  return typeof e == "string" ? new jt([[document.querySelector(e)]], [document.documentElement]) : new jt([[e]], em);
}
function W1(e) {
  let n;
  for (; n = e.sourceEvent; ) e = n;
  return e;
}
function Xt(e, n) {
  if (e = W1(e), n === void 0 && (n = e.currentTarget), n) {
    var o = n.ownerSVGElement || n;
    if (o.createSVGPoint) {
      var s = o.createSVGPoint();
      return s.x = e.clientX, s.y = e.clientY, s = s.matrixTransform(n.getScreenCTM().inverse()), [s.x, s.y];
    }
    if (n.getBoundingClientRect) {
      var i = n.getBoundingClientRect();
      return [e.clientX - i.left - n.clientLeft, e.clientY - i.top - n.clientTop];
    }
  }
  return [e.pageX, e.pageY];
}
const X1 = { passive: !1 }, Ca = { capture: !0, passive: !1 };
function Oc(e) {
  e.stopImmediatePropagation();
}
function co(e) {
  e.preventDefault(), e.stopImmediatePropagation();
}
function tm(e) {
  var n = e.document.documentElement, o = St(e).on("dragstart.drag", co, Ca);
  "onselectstart" in n ? o.on("selectstart.drag", co, Ca) : (n.__noselect = n.style.MozUserSelect, n.style.MozUserSelect = "none");
}
function nm(e, n) {
  var o = e.document.documentElement, s = St(e).on("dragstart.drag", null);
  n && (s.on("click.drag", co, Ca), setTimeout(function() {
    s.on("click.drag", null);
  }, 0)), "onselectstart" in o ? s.on("selectstart.drag", null) : (o.style.MozUserSelect = o.__noselect, delete o.__noselect);
}
const oi = (e) => () => e;
function su(e, {
  sourceEvent: n,
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
    sourceEvent: { value: n, enumerable: !0, configurable: !0 },
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
su.prototype.on = function() {
  var e = this._.on.apply(this._, arguments);
  return e === this._ ? this : e;
};
function K1(e) {
  return !e.ctrlKey && !e.button;
}
function Z1() {
  return this.parentNode;
}
function Y1(e, n) {
  return n ?? { x: e.x, y: e.y };
}
function U1() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function rm() {
  var e = K1, n = Z1, o = Y1, s = U1, i = {}, l = Ti("start", "drag", "end"), c = 0, u, p, g, m, h = 0;
  function w(S) {
    S.on("mousedown.drag", C).filter(s).on("touchstart.drag", b).on("touchmove.drag", _, X1).on("touchend.drag touchcancel.drag", k).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  function C(S, V) {
    if (!(m || !e.call(this, S, V))) {
      var G = A(this, n.call(this, S, V), S, V, "mouse");
      G && (St(S.view).on("mousemove.drag", x, Ca).on("mouseup.drag", I, Ca), tm(S.view), Oc(S), g = !1, u = S.clientX, p = S.clientY, G("start", S));
    }
  }
  function x(S) {
    if (co(S), !g) {
      var V = S.clientX - u, G = S.clientY - p;
      g = V * V + G * G > h;
    }
    i.mouse("drag", S);
  }
  function I(S) {
    St(S.view).on("mousemove.drag mouseup.drag", null), nm(S.view, g), co(S), i.mouse("end", S);
  }
  function b(S, V) {
    if (e.call(this, S, V)) {
      var G = S.changedTouches, T = n.call(this, S, V), K = G.length, D, F;
      for (D = 0; D < K; ++D)
        (F = A(this, T, S, V, G[D].identifier, G[D])) && (Oc(S), F("start", S, G[D]));
    }
  }
  function _(S) {
    var V = S.changedTouches, G = V.length, T, K;
    for (T = 0; T < G; ++T)
      (K = i[V[T].identifier]) && (co(S), K("drag", S, V[T]));
  }
  function k(S) {
    var V = S.changedTouches, G = V.length, T, K;
    for (m && clearTimeout(m), m = setTimeout(function() {
      m = null;
    }, 500), T = 0; T < G; ++T)
      (K = i[V[T].identifier]) && (Oc(S), K("end", S, V[T]));
  }
  function A(S, V, G, T, K, D) {
    var F = l.copy(), z = Xt(D || G, V), W, q, R;
    if ((R = o.call(S, new su("beforestart", {
      sourceEvent: G,
      target: w,
      identifier: K,
      active: c,
      x: z[0],
      y: z[1],
      dx: 0,
      dy: 0,
      dispatch: F
    }), T)) != null)
      return W = R.x - z[0] || 0, q = R.y - z[1] || 0, function Y(H, U, E) {
        var P = z, Z;
        switch (H) {
          case "start":
            i[K] = Y, Z = c++;
            break;
          case "end":
            delete i[K], --c;
          // falls through
          case "drag":
            z = Xt(E || U, V), Z = c;
            break;
        }
        F.call(
          H,
          S,
          new su(H, {
            sourceEvent: U,
            subject: R,
            target: w,
            identifier: K,
            active: Z,
            x: z[0] + W,
            y: z[1] + q,
            dx: z[0] - P[0],
            dy: z[1] - P[1],
            dispatch: F
          }),
          T
        );
      };
  }
  return w.filter = function(S) {
    return arguments.length ? (e = typeof S == "function" ? S : oi(!!S), w) : e;
  }, w.container = function(S) {
    return arguments.length ? (n = typeof S == "function" ? S : oi(S), w) : n;
  }, w.subject = function(S) {
    return arguments.length ? (o = typeof S == "function" ? S : oi(S), w) : o;
  }, w.touchable = function(S) {
    return arguments.length ? (s = typeof S == "function" ? S : oi(!!S), w) : s;
  }, w.on = function() {
    var S = l.on.apply(l, arguments);
    return S === l ? w : S;
  }, w.clickDistance = function(S) {
    return arguments.length ? (h = (S = +S) * S, w) : Math.sqrt(h);
  }, w;
}
function Nu(e, n, o) {
  e.prototype = n.prototype = o, o.constructor = e;
}
function om(e, n) {
  var o = Object.create(e.prototype);
  for (var s in n) o[s] = n[s];
  return o;
}
function Ba() {
}
var ba = 0.7, xi = 1 / ba, uo = "\\s*([+-]?\\d+)\\s*", _a = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", sn = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", $1 = /^#([0-9a-f]{3,8})$/, Q1 = new RegExp(`^rgb\\(${uo},${uo},${uo}\\)$`), J1 = new RegExp(`^rgb\\(${sn},${sn},${sn}\\)$`), q1 = new RegExp(`^rgba\\(${uo},${uo},${uo},${_a}\\)$`), eI = new RegExp(`^rgba\\(${sn},${sn},${sn},${_a}\\)$`), tI = new RegExp(`^hsl\\(${_a},${sn},${sn}\\)$`), nI = new RegExp(`^hsla\\(${_a},${sn},${sn},${_a}\\)$`), Sp = {
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
Nu(Ba, Ar, {
  copy(e) {
    return Object.assign(new this.constructor(), this, e);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: kp,
  // Deprecated! Use color.formatHex.
  formatHex: kp,
  formatHex8: rI,
  formatHsl: oI,
  formatRgb: jp,
  toString: jp
});
function kp() {
  return this.rgb().formatHex();
}
function rI() {
  return this.rgb().formatHex8();
}
function oI() {
  return am(this).formatHsl();
}
function jp() {
  return this.rgb().formatRgb();
}
function Ar(e) {
  var n, o;
  return e = (e + "").trim().toLowerCase(), (n = $1.exec(e)) ? (o = n[1].length, n = parseInt(n[1], 16), o === 6 ? Mp(n) : o === 3 ? new vt(n >> 8 & 15 | n >> 4 & 240, n >> 4 & 15 | n & 240, (n & 15) << 4 | n & 15, 1) : o === 8 ? ai(n >> 24 & 255, n >> 16 & 255, n >> 8 & 255, (n & 255) / 255) : o === 4 ? ai(n >> 12 & 15 | n >> 8 & 240, n >> 8 & 15 | n >> 4 & 240, n >> 4 & 15 | n & 240, ((n & 15) << 4 | n & 15) / 255) : null) : (n = Q1.exec(e)) ? new vt(n[1], n[2], n[3], 1) : (n = J1.exec(e)) ? new vt(n[1] * 255 / 100, n[2] * 255 / 100, n[3] * 255 / 100, 1) : (n = q1.exec(e)) ? ai(n[1], n[2], n[3], n[4]) : (n = eI.exec(e)) ? ai(n[1] * 255 / 100, n[2] * 255 / 100, n[3] * 255 / 100, n[4]) : (n = tI.exec(e)) ? Bp(n[1], n[2] / 100, n[3] / 100, 1) : (n = nI.exec(e)) ? Bp(n[1], n[2] / 100, n[3] / 100, n[4]) : Sp.hasOwnProperty(e) ? Mp(Sp[e]) : e === "transparent" ? new vt(NaN, NaN, NaN, 0) : null;
}
function Mp(e) {
  return new vt(e >> 16 & 255, e >> 8 & 255, e & 255, 1);
}
function ai(e, n, o, s) {
  return s <= 0 && (e = n = o = NaN), new vt(e, n, o, s);
}
function aI(e) {
  return e instanceof Ba || (e = Ar(e)), e ? (e = e.rgb(), new vt(e.r, e.g, e.b, e.opacity)) : new vt();
}
function iu(e, n, o, s) {
  return arguments.length === 1 ? aI(e) : new vt(e, n, o, s ?? 1);
}
function vt(e, n, o, s) {
  this.r = +e, this.g = +n, this.b = +o, this.opacity = +s;
}
Nu(vt, iu, om(Ba, {
  brighter(e) {
    return e = e == null ? xi : Math.pow(xi, e), new vt(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? ba : Math.pow(ba, e), new vt(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new vt(_r(this.r), _r(this.g), _r(this.b), Ii(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: Rp,
  // Deprecated! Use color.formatHex.
  formatHex: Rp,
  formatHex8: sI,
  formatRgb: Tp,
  toString: Tp
}));
function Rp() {
  return `#${br(this.r)}${br(this.g)}${br(this.b)}`;
}
function sI() {
  return `#${br(this.r)}${br(this.g)}${br(this.b)}${br((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function Tp() {
  const e = Ii(this.opacity);
  return `${e === 1 ? "rgb(" : "rgba("}${_r(this.r)}, ${_r(this.g)}, ${_r(this.b)}${e === 1 ? ")" : `, ${e})`}`;
}
function Ii(e) {
  return isNaN(e) ? 1 : Math.max(0, Math.min(1, e));
}
function _r(e) {
  return Math.max(0, Math.min(255, Math.round(e) || 0));
}
function br(e) {
  return e = _r(e), (e < 16 ? "0" : "") + e.toString(16);
}
function Bp(e, n, o, s) {
  return s <= 0 ? e = n = o = NaN : o <= 0 || o >= 1 ? e = n = NaN : n <= 0 && (e = NaN), new Kt(e, n, o, s);
}
function am(e) {
  if (e instanceof Kt) return new Kt(e.h, e.s, e.l, e.opacity);
  if (e instanceof Ba || (e = Ar(e)), !e) return new Kt();
  if (e instanceof Kt) return e;
  e = e.rgb();
  var n = e.r / 255, o = e.g / 255, s = e.b / 255, i = Math.min(n, o, s), l = Math.max(n, o, s), c = NaN, u = l - i, p = (l + i) / 2;
  return u ? (n === l ? c = (o - s) / u + (o < s) * 6 : o === l ? c = (s - n) / u + 2 : c = (n - o) / u + 4, u /= p < 0.5 ? l + i : 2 - l - i, c *= 60) : u = p > 0 && p < 1 ? 0 : c, new Kt(c, u, p, e.opacity);
}
function iI(e, n, o, s) {
  return arguments.length === 1 ? am(e) : new Kt(e, n, o, s ?? 1);
}
function Kt(e, n, o, s) {
  this.h = +e, this.s = +n, this.l = +o, this.opacity = +s;
}
Nu(Kt, iI, om(Ba, {
  brighter(e) {
    return e = e == null ? xi : Math.pow(xi, e), new Kt(this.h, this.s, this.l * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? ba : Math.pow(ba, e), new Kt(this.h, this.s, this.l * e, this.opacity);
  },
  rgb() {
    var e = this.h % 360 + (this.h < 0) * 360, n = isNaN(e) || isNaN(this.s) ? 0 : this.s, o = this.l, s = o + (o < 0.5 ? o : 1 - o) * n, i = 2 * o - s;
    return new vt(
      Lc(e >= 240 ? e - 240 : e + 120, i, s),
      Lc(e, i, s),
      Lc(e < 120 ? e + 240 : e - 120, i, s),
      this.opacity
    );
  },
  clamp() {
    return new Kt(Ep(this.h), si(this.s), si(this.l), Ii(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const e = Ii(this.opacity);
    return `${e === 1 ? "hsl(" : "hsla("}${Ep(this.h)}, ${si(this.s) * 100}%, ${si(this.l) * 100}%${e === 1 ? ")" : `, ${e})`}`;
  }
}));
function Ep(e) {
  return e = (e || 0) % 360, e < 0 ? e + 360 : e;
}
function si(e) {
  return Math.max(0, Math.min(1, e || 0));
}
function Lc(e, n, o) {
  return (e < 60 ? n + (o - n) * e / 60 : e < 180 ? o : e < 240 ? n + (o - n) * (240 - e) / 60 : n) * 255;
}
const Au = (e) => () => e;
function lI(e, n) {
  return function(o) {
    return e + o * n;
  };
}
function cI(e, n, o) {
  return e = Math.pow(e, o), n = Math.pow(n, o) - e, o = 1 / o, function(s) {
    return Math.pow(e + s * n, o);
  };
}
function uI(e) {
  return (e = +e) == 1 ? sm : function(n, o) {
    return o - n ? cI(n, o, e) : Au(isNaN(n) ? o : n);
  };
}
function sm(e, n) {
  var o = n - e;
  return o ? lI(e, o) : Au(isNaN(e) ? n : e);
}
const Ci = (function e(n) {
  var o = uI(n);
  function s(i, l) {
    var c = o((i = iu(i)).r, (l = iu(l)).r), u = o(i.g, l.g), p = o(i.b, l.b), g = sm(i.opacity, l.opacity);
    return function(m) {
      return i.r = c(m), i.g = u(m), i.b = p(m), i.opacity = g(m), i + "";
    };
  }
  return s.gamma = e, s;
})(1);
function dI(e, n) {
  n || (n = []);
  var o = e ? Math.min(n.length, e.length) : 0, s = n.slice(), i;
  return function(l) {
    for (i = 0; i < o; ++i) s[i] = e[i] * (1 - l) + n[i] * l;
    return s;
  };
}
function fI(e) {
  return ArrayBuffer.isView(e) && !(e instanceof DataView);
}
function pI(e, n) {
  var o = n ? n.length : 0, s = e ? Math.min(o, e.length) : 0, i = new Array(s), l = new Array(o), c;
  for (c = 0; c < s; ++c) i[c] = va(e[c], n[c]);
  for (; c < o; ++c) l[c] = n[c];
  return function(u) {
    for (c = 0; c < s; ++c) l[c] = i[c](u);
    return l;
  };
}
function gI(e, n) {
  var o = /* @__PURE__ */ new Date();
  return e = +e, n = +n, function(s) {
    return o.setTime(e * (1 - s) + n * s), o;
  };
}
function on(e, n) {
  return e = +e, n = +n, function(o) {
    return e * (1 - o) + n * o;
  };
}
function mI(e, n) {
  var o = {}, s = {}, i;
  (e === null || typeof e != "object") && (e = {}), (n === null || typeof n != "object") && (n = {});
  for (i in n)
    i in e ? o[i] = va(e[i], n[i]) : s[i] = n[i];
  return function(l) {
    for (i in o) s[i] = o[i](l);
    return s;
  };
}
var lu = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, Hc = new RegExp(lu.source, "g");
function hI(e) {
  return function() {
    return e;
  };
}
function yI(e) {
  return function(n) {
    return e(n) + "";
  };
}
function im(e, n) {
  var o = lu.lastIndex = Hc.lastIndex = 0, s, i, l, c = -1, u = [], p = [];
  for (e = e + "", n = n + ""; (s = lu.exec(e)) && (i = Hc.exec(n)); )
    (l = i.index) > o && (l = n.slice(o, l), u[c] ? u[c] += l : u[++c] = l), (s = s[0]) === (i = i[0]) ? u[c] ? u[c] += i : u[++c] = i : (u[++c] = null, p.push({ i: c, x: on(s, i) })), o = Hc.lastIndex;
  return o < n.length && (l = n.slice(o), u[c] ? u[c] += l : u[++c] = l), u.length < 2 ? p[0] ? yI(p[0].x) : hI(n) : (n = p.length, function(g) {
    for (var m = 0, h; m < n; ++m) u[(h = p[m]).i] = h.x(g);
    return u.join("");
  });
}
function va(e, n) {
  var o = typeof n, s;
  return n == null || o === "boolean" ? Au(n) : (o === "number" ? on : o === "string" ? (s = Ar(n)) ? (n = s, Ci) : im : n instanceof Ar ? Ci : n instanceof Date ? gI : fI(n) ? dI : Array.isArray(n) ? pI : typeof n.valueOf != "function" && typeof n.toString != "function" || isNaN(n) ? mI : on)(e, n);
}
var Dp = 180 / Math.PI, cu = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function lm(e, n, o, s, i, l) {
  var c, u, p;
  return (c = Math.sqrt(e * e + n * n)) && (e /= c, n /= c), (p = e * o + n * s) && (o -= e * p, s -= n * p), (u = Math.sqrt(o * o + s * s)) && (o /= u, s /= u, p /= u), e * s < n * o && (e = -e, n = -n, p = -p, c = -c), {
    translateX: i,
    translateY: l,
    rotate: Math.atan2(n, e) * Dp,
    skewX: Math.atan(p) * Dp,
    scaleX: c,
    scaleY: u
  };
}
var ii;
function wI(e) {
  const n = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(e + "");
  return n.isIdentity ? cu : lm(n.a, n.b, n.c, n.d, n.e, n.f);
}
function vI(e) {
  return e == null || (ii || (ii = document.createElementNS("http://www.w3.org/2000/svg", "g")), ii.setAttribute("transform", e), !(e = ii.transform.baseVal.consolidate())) ? cu : (e = e.matrix, lm(e.a, e.b, e.c, e.d, e.e, e.f));
}
function cm(e, n, o, s) {
  function i(g) {
    return g.length ? g.pop() + " " : "";
  }
  function l(g, m, h, w, C, x) {
    if (g !== h || m !== w) {
      var I = C.push("translate(", null, n, null, o);
      x.push({ i: I - 4, x: on(g, h) }, { i: I - 2, x: on(m, w) });
    } else (h || w) && C.push("translate(" + h + n + w + o);
  }
  function c(g, m, h, w) {
    g !== m ? (g - m > 180 ? m += 360 : m - g > 180 && (g += 360), w.push({ i: h.push(i(h) + "rotate(", null, s) - 2, x: on(g, m) })) : m && h.push(i(h) + "rotate(" + m + s);
  }
  function u(g, m, h, w) {
    g !== m ? w.push({ i: h.push(i(h) + "skewX(", null, s) - 2, x: on(g, m) }) : m && h.push(i(h) + "skewX(" + m + s);
  }
  function p(g, m, h, w, C, x) {
    if (g !== h || m !== w) {
      var I = C.push(i(C) + "scale(", null, ",", null, ")");
      x.push({ i: I - 4, x: on(g, h) }, { i: I - 2, x: on(m, w) });
    } else (h !== 1 || w !== 1) && C.push(i(C) + "scale(" + h + "," + w + ")");
  }
  return function(g, m) {
    var h = [], w = [];
    return g = e(g), m = e(m), l(g.translateX, g.translateY, m.translateX, m.translateY, h, w), c(g.rotate, m.rotate, h, w), u(g.skewX, m.skewX, h, w), p(g.scaleX, g.scaleY, m.scaleX, m.scaleY, h, w), g = m = null, function(C) {
      for (var x = -1, I = w.length, b; ++x < I; ) h[(b = w[x]).i] = b.x(C);
      return h.join("");
    };
  };
}
var xI = cm(wI, "px, ", "px)", "deg)"), II = cm(vI, ", ", ")", ")"), CI = 1e-12;
function Gp(e) {
  return ((e = Math.exp(e)) + 1 / e) / 2;
}
function bI(e) {
  return ((e = Math.exp(e)) - 1 / e) / 2;
}
function _I(e) {
  return ((e = Math.exp(2 * e)) - 1) / (e + 1);
}
const mi = (function e(n, o, s) {
  function i(l, c) {
    var u = l[0], p = l[1], g = l[2], m = c[0], h = c[1], w = c[2], C = m - u, x = h - p, I = C * C + x * x, b, _;
    if (I < CI)
      _ = Math.log(w / g) / n, b = function(T) {
        return [
          u + T * C,
          p + T * x,
          g * Math.exp(n * T * _)
        ];
      };
    else {
      var k = Math.sqrt(I), A = (w * w - g * g + s * I) / (2 * g * o * k), S = (w * w - g * g - s * I) / (2 * w * o * k), V = Math.log(Math.sqrt(A * A + 1) - A), G = Math.log(Math.sqrt(S * S + 1) - S);
      _ = (G - V) / n, b = function(T) {
        var K = T * _, D = Gp(V), F = g / (o * k) * (D * _I(n * K + V) - bI(V));
        return [
          u + F * C,
          p + F * x,
          g * D / Gp(n * K + V)
        ];
      };
    }
    return b.duration = _ * 1e3 * n / Math.SQRT2, b;
  }
  return i.rho = function(l) {
    var c = Math.max(1e-3, +l), u = c * c, p = u * u;
    return e(c, u, p);
  }, i;
})(Math.SQRT2, 2, 4);
var go = 0, ya = 0, ma = 0, um = 1e3, bi, wa, _i = 0, Sr = 0, Ei = 0, Na = typeof performance == "object" && performance.now ? performance : Date, dm = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(e) {
  setTimeout(e, 17);
};
function Su() {
  return Sr || (dm(NI), Sr = Na.now() + Ei);
}
function NI() {
  Sr = 0;
}
function Ni() {
  this._call = this._time = this._next = null;
}
Ni.prototype = fm.prototype = {
  constructor: Ni,
  restart: function(e, n, o) {
    if (typeof e != "function") throw new TypeError("callback is not a function");
    o = (o == null ? Su() : +o) + (n == null ? 0 : +n), !this._next && wa !== this && (wa ? wa._next = this : bi = this, wa = this), this._call = e, this._time = o, uu();
  },
  stop: function() {
    this._call && (this._call = null, this._time = 1 / 0, uu());
  }
};
function fm(e, n, o) {
  var s = new Ni();
  return s.restart(e, n, o), s;
}
function AI() {
  Su(), ++go;
  for (var e = bi, n; e; )
    (n = Sr - e._time) >= 0 && e._call.call(void 0, n), e = e._next;
  --go;
}
function Pp() {
  Sr = (_i = Na.now()) + Ei, go = ya = 0;
  try {
    AI();
  } finally {
    go = 0, kI(), Sr = 0;
  }
}
function SI() {
  var e = Na.now(), n = e - _i;
  n > um && (Ei -= n, _i = e);
}
function kI() {
  for (var e, n = bi, o, s = 1 / 0; n; )
    n._call ? (s > n._time && (s = n._time), e = n, n = n._next) : (o = n._next, n._next = null, n = e ? e._next = o : bi = o);
  wa = e, uu(s);
}
function uu(e) {
  if (!go) {
    ya && (ya = clearTimeout(ya));
    var n = e - Sr;
    n > 24 ? (e < 1 / 0 && (ya = setTimeout(Pp, e - Na.now() - Ei)), ma && (ma = clearInterval(ma))) : (ma || (_i = Na.now(), ma = setInterval(SI, um)), go = 1, dm(Pp));
  }
}
function Fp(e, n, o) {
  var s = new Ni();
  return n = n == null ? 0 : +n, s.restart((i) => {
    s.stop(), e(i + n);
  }, n, o), s;
}
var jI = Ti("start", "end", "cancel", "interrupt"), MI = [], pm = 0, Vp = 1, du = 2, hi = 3, zp = 4, fu = 5, yi = 6;
function Di(e, n, o, s, i, l) {
  var c = e.__transition;
  if (!c) e.__transition = {};
  else if (o in c) return;
  RI(e, o, {
    name: n,
    index: s,
    // For context during callback.
    group: i,
    // For context during callback.
    on: jI,
    tween: MI,
    time: l.time,
    delay: l.delay,
    duration: l.duration,
    ease: l.ease,
    timer: null,
    state: pm
  });
}
function ku(e, n) {
  var o = $t(e, n);
  if (o.state > pm) throw new Error("too late; already scheduled");
  return o;
}
function cn(e, n) {
  var o = $t(e, n);
  if (o.state > hi) throw new Error("too late; already running");
  return o;
}
function $t(e, n) {
  var o = e.__transition;
  if (!o || !(o = o[n])) throw new Error("transition not found");
  return o;
}
function RI(e, n, o) {
  var s = e.__transition, i;
  s[n] = o, o.timer = fm(l, 0, o.time);
  function l(g) {
    o.state = Vp, o.timer.restart(c, o.delay, o.time), o.delay <= g && c(g - o.delay);
  }
  function c(g) {
    var m, h, w, C;
    if (o.state !== Vp) return p();
    for (m in s)
      if (C = s[m], C.name === o.name) {
        if (C.state === hi) return Fp(c);
        C.state === zp ? (C.state = yi, C.timer.stop(), C.on.call("interrupt", e, e.__data__, C.index, C.group), delete s[m]) : +m < n && (C.state = yi, C.timer.stop(), C.on.call("cancel", e, e.__data__, C.index, C.group), delete s[m]);
      }
    if (Fp(function() {
      o.state === hi && (o.state = zp, o.timer.restart(u, o.delay, o.time), u(g));
    }), o.state = du, o.on.call("start", e, e.__data__, o.index, o.group), o.state === du) {
      for (o.state = hi, i = new Array(w = o.tween.length), m = 0, h = -1; m < w; ++m)
        (C = o.tween[m].value.call(e, e.__data__, o.index, o.group)) && (i[++h] = C);
      i.length = h + 1;
    }
  }
  function u(g) {
    for (var m = g < o.duration ? o.ease.call(null, g / o.duration) : (o.timer.restart(p), o.state = fu, 1), h = -1, w = i.length; ++h < w; )
      i[h].call(e, m);
    o.state === fu && (o.on.call("end", e, e.__data__, o.index, o.group), p());
  }
  function p() {
    o.state = yi, o.timer.stop(), delete s[n];
    for (var g in s) return;
    delete e.__transition;
  }
}
function wi(e, n) {
  var o = e.__transition, s, i, l = !0, c;
  if (o) {
    n = n == null ? null : n + "";
    for (c in o) {
      if ((s = o[c]).name !== n) {
        l = !1;
        continue;
      }
      i = s.state > du && s.state < fu, s.state = yi, s.timer.stop(), s.on.call(i ? "interrupt" : "cancel", e, e.__data__, s.index, s.group), delete o[c];
    }
    l && delete e.__transition;
  }
}
function TI(e) {
  return this.each(function() {
    wi(this, e);
  });
}
function BI(e, n) {
  var o, s;
  return function() {
    var i = cn(this, e), l = i.tween;
    if (l !== o) {
      s = o = l;
      for (var c = 0, u = s.length; c < u; ++c)
        if (s[c].name === n) {
          s = s.slice(), s.splice(c, 1);
          break;
        }
    }
    i.tween = s;
  };
}
function EI(e, n, o) {
  var s, i;
  if (typeof o != "function") throw new Error();
  return function() {
    var l = cn(this, e), c = l.tween;
    if (c !== s) {
      i = (s = c).slice();
      for (var u = { name: n, value: o }, p = 0, g = i.length; p < g; ++p)
        if (i[p].name === n) {
          i[p] = u;
          break;
        }
      p === g && i.push(u);
    }
    l.tween = i;
  };
}
function DI(e, n) {
  var o = this._id;
  if (e += "", arguments.length < 2) {
    for (var s = $t(this.node(), o).tween, i = 0, l = s.length, c; i < l; ++i)
      if ((c = s[i]).name === e)
        return c.value;
    return null;
  }
  return this.each((n == null ? BI : EI)(o, e, n));
}
function ju(e, n, o) {
  var s = e._id;
  return e.each(function() {
    var i = cn(this, s);
    (i.value || (i.value = {}))[n] = o.apply(this, arguments);
  }), function(i) {
    return $t(i, s).value[n];
  };
}
function gm(e, n) {
  var o;
  return (typeof n == "number" ? on : n instanceof Ar ? Ci : (o = Ar(n)) ? (n = o, Ci) : im)(e, n);
}
function GI(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function PI(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function FI(e, n, o) {
  var s, i = o + "", l;
  return function() {
    var c = this.getAttribute(e);
    return c === i ? null : c === s ? l : l = n(s = c, o);
  };
}
function VI(e, n, o) {
  var s, i = o + "", l;
  return function() {
    var c = this.getAttributeNS(e.space, e.local);
    return c === i ? null : c === s ? l : l = n(s = c, o);
  };
}
function zI(e, n, o) {
  var s, i, l;
  return function() {
    var c, u = o(this), p;
    return u == null ? void this.removeAttribute(e) : (c = this.getAttribute(e), p = u + "", c === p ? null : c === s && p === i ? l : (i = p, l = n(s = c, u)));
  };
}
function OI(e, n, o) {
  var s, i, l;
  return function() {
    var c, u = o(this), p;
    return u == null ? void this.removeAttributeNS(e.space, e.local) : (c = this.getAttributeNS(e.space, e.local), p = u + "", c === p ? null : c === s && p === i ? l : (i = p, l = n(s = c, u)));
  };
}
function LI(e, n) {
  var o = Bi(e), s = o === "transform" ? II : gm;
  return this.attrTween(e, typeof n == "function" ? (o.local ? OI : zI)(o, s, ju(this, "attr." + e, n)) : n == null ? (o.local ? PI : GI)(o) : (o.local ? VI : FI)(o, s, n));
}
function HI(e, n) {
  return function(o) {
    this.setAttribute(e, n.call(this, o));
  };
}
function WI(e, n) {
  return function(o) {
    this.setAttributeNS(e.space, e.local, n.call(this, o));
  };
}
function XI(e, n) {
  var o, s;
  function i() {
    var l = n.apply(this, arguments);
    return l !== s && (o = (s = l) && WI(e, l)), o;
  }
  return i._value = n, i;
}
function KI(e, n) {
  var o, s;
  function i() {
    var l = n.apply(this, arguments);
    return l !== s && (o = (s = l) && HI(e, l)), o;
  }
  return i._value = n, i;
}
function ZI(e, n) {
  var o = "attr." + e;
  if (arguments.length < 2) return (o = this.tween(o)) && o._value;
  if (n == null) return this.tween(o, null);
  if (typeof n != "function") throw new Error();
  var s = Bi(e);
  return this.tween(o, (s.local ? XI : KI)(s, n));
}
function YI(e, n) {
  return function() {
    ku(this, e).delay = +n.apply(this, arguments);
  };
}
function UI(e, n) {
  return n = +n, function() {
    ku(this, e).delay = n;
  };
}
function $I(e) {
  var n = this._id;
  return arguments.length ? this.each((typeof e == "function" ? YI : UI)(n, e)) : $t(this.node(), n).delay;
}
function QI(e, n) {
  return function() {
    cn(this, e).duration = +n.apply(this, arguments);
  };
}
function JI(e, n) {
  return n = +n, function() {
    cn(this, e).duration = n;
  };
}
function qI(e) {
  var n = this._id;
  return arguments.length ? this.each((typeof e == "function" ? QI : JI)(n, e)) : $t(this.node(), n).duration;
}
function eC(e, n) {
  if (typeof n != "function") throw new Error();
  return function() {
    cn(this, e).ease = n;
  };
}
function tC(e) {
  var n = this._id;
  return arguments.length ? this.each(eC(n, e)) : $t(this.node(), n).ease;
}
function nC(e, n) {
  return function() {
    var o = n.apply(this, arguments);
    if (typeof o != "function") throw new Error();
    cn(this, e).ease = o;
  };
}
function rC(e) {
  if (typeof e != "function") throw new Error();
  return this.each(nC(this._id, e));
}
function oC(e) {
  typeof e != "function" && (e = Xg(e));
  for (var n = this._groups, o = n.length, s = new Array(o), i = 0; i < o; ++i)
    for (var l = n[i], c = l.length, u = s[i] = [], p, g = 0; g < c; ++g)
      (p = l[g]) && e.call(p, p.__data__, g, l) && u.push(p);
  return new Sn(s, this._parents, this._name, this._id);
}
function aC(e) {
  if (e._id !== this._id) throw new Error();
  for (var n = this._groups, o = e._groups, s = n.length, i = o.length, l = Math.min(s, i), c = new Array(s), u = 0; u < l; ++u)
    for (var p = n[u], g = o[u], m = p.length, h = c[u] = new Array(m), w, C = 0; C < m; ++C)
      (w = p[C] || g[C]) && (h[C] = w);
  for (; u < s; ++u)
    c[u] = n[u];
  return new Sn(c, this._parents, this._name, this._id);
}
function sC(e) {
  return (e + "").trim().split(/^|\s+/).every(function(n) {
    var o = n.indexOf(".");
    return o >= 0 && (n = n.slice(0, o)), !n || n === "start";
  });
}
function iC(e, n, o) {
  var s, i, l = sC(n) ? ku : cn;
  return function() {
    var c = l(this, e), u = c.on;
    u !== s && (i = (s = u).copy()).on(n, o), c.on = i;
  };
}
function lC(e, n) {
  var o = this._id;
  return arguments.length < 2 ? $t(this.node(), o).on.on(e) : this.each(iC(o, e, n));
}
function cC(e) {
  return function() {
    var n = this.parentNode;
    for (var o in this.__transition) if (+o !== e) return;
    n && n.removeChild(this);
  };
}
function uC() {
  return this.on("end.remove", cC(this._id));
}
function dC(e) {
  var n = this._name, o = this._id;
  typeof e != "function" && (e = bu(e));
  for (var s = this._groups, i = s.length, l = new Array(i), c = 0; c < i; ++c)
    for (var u = s[c], p = u.length, g = l[c] = new Array(p), m, h, w = 0; w < p; ++w)
      (m = u[w]) && (h = e.call(m, m.__data__, w, u)) && ("__data__" in m && (h.__data__ = m.__data__), g[w] = h, Di(g[w], n, o, w, g, $t(m, o)));
  return new Sn(l, this._parents, n, o);
}
function fC(e) {
  var n = this._name, o = this._id;
  typeof e != "function" && (e = Wg(e));
  for (var s = this._groups, i = s.length, l = [], c = [], u = 0; u < i; ++u)
    for (var p = s[u], g = p.length, m, h = 0; h < g; ++h)
      if (m = p[h]) {
        for (var w = e.call(m, m.__data__, h, p), C, x = $t(m, o), I = 0, b = w.length; I < b; ++I)
          (C = w[I]) && Di(C, n, o, I, w, x);
        l.push(w), c.push(m);
      }
  return new Sn(l, c, n, o);
}
var pC = Ta.prototype.constructor;
function gC() {
  return new pC(this._groups, this._parents);
}
function mC(e, n) {
  var o, s, i;
  return function() {
    var l = po(this, e), c = (this.style.removeProperty(e), po(this, e));
    return l === c ? null : l === o && c === s ? i : i = n(o = l, s = c);
  };
}
function mm(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function hC(e, n, o) {
  var s, i = o + "", l;
  return function() {
    var c = po(this, e);
    return c === i ? null : c === s ? l : l = n(s = c, o);
  };
}
function yC(e, n, o) {
  var s, i, l;
  return function() {
    var c = po(this, e), u = o(this), p = u + "";
    return u == null && (p = u = (this.style.removeProperty(e), po(this, e))), c === p ? null : c === s && p === i ? l : (i = p, l = n(s = c, u));
  };
}
function wC(e, n) {
  var o, s, i, l = "style." + n, c = "end." + l, u;
  return function() {
    var p = cn(this, e), g = p.on, m = p.value[l] == null ? u || (u = mm(n)) : void 0;
    (g !== o || i !== m) && (s = (o = g).copy()).on(c, i = m), p.on = s;
  };
}
function vC(e, n, o) {
  var s = (e += "") == "transform" ? xI : gm;
  return n == null ? this.styleTween(e, mC(e, s)).on("end.style." + e, mm(e)) : typeof n == "function" ? this.styleTween(e, yC(e, s, ju(this, "style." + e, n))).each(wC(this._id, e)) : this.styleTween(e, hC(e, s, n), o).on("end.style." + e, null);
}
function xC(e, n, o) {
  return function(s) {
    this.style.setProperty(e, n.call(this, s), o);
  };
}
function IC(e, n, o) {
  var s, i;
  function l() {
    var c = n.apply(this, arguments);
    return c !== i && (s = (i = c) && xC(e, c, o)), s;
  }
  return l._value = n, l;
}
function CC(e, n, o) {
  var s = "style." + (e += "");
  if (arguments.length < 2) return (s = this.tween(s)) && s._value;
  if (n == null) return this.tween(s, null);
  if (typeof n != "function") throw new Error();
  return this.tween(s, IC(e, n, o ?? ""));
}
function bC(e) {
  return function() {
    this.textContent = e;
  };
}
function _C(e) {
  return function() {
    var n = e(this);
    this.textContent = n ?? "";
  };
}
function NC(e) {
  return this.tween("text", typeof e == "function" ? _C(ju(this, "text", e)) : bC(e == null ? "" : e + ""));
}
function AC(e) {
  return function(n) {
    this.textContent = e.call(this, n);
  };
}
function SC(e) {
  var n, o;
  function s() {
    var i = e.apply(this, arguments);
    return i !== o && (n = (o = i) && AC(i)), n;
  }
  return s._value = e, s;
}
function kC(e) {
  var n = "text";
  if (arguments.length < 1) return (n = this.tween(n)) && n._value;
  if (e == null) return this.tween(n, null);
  if (typeof e != "function") throw new Error();
  return this.tween(n, SC(e));
}
function jC() {
  for (var e = this._name, n = this._id, o = hm(), s = this._groups, i = s.length, l = 0; l < i; ++l)
    for (var c = s[l], u = c.length, p, g = 0; g < u; ++g)
      if (p = c[g]) {
        var m = $t(p, n);
        Di(p, e, o, g, c, {
          time: m.time + m.delay + m.duration,
          delay: 0,
          duration: m.duration,
          ease: m.ease
        });
      }
  return new Sn(s, this._parents, e, o);
}
function MC() {
  var e, n, o = this, s = o._id, i = o.size();
  return new Promise(function(l, c) {
    var u = { value: c }, p = { value: function() {
      --i === 0 && l();
    } };
    o.each(function() {
      var g = cn(this, s), m = g.on;
      m !== e && (n = (e = m).copy(), n._.cancel.push(u), n._.interrupt.push(u), n._.end.push(p)), g.on = n;
    }), i === 0 && l();
  });
}
var RC = 0;
function Sn(e, n, o, s) {
  this._groups = e, this._parents = n, this._name = o, this._id = s;
}
function hm() {
  return ++RC;
}
var Cn = Ta.prototype;
Sn.prototype = {
  constructor: Sn,
  select: dC,
  selectAll: fC,
  selectChild: Cn.selectChild,
  selectChildren: Cn.selectChildren,
  filter: oC,
  merge: aC,
  selection: gC,
  transition: jC,
  call: Cn.call,
  nodes: Cn.nodes,
  node: Cn.node,
  size: Cn.size,
  empty: Cn.empty,
  each: Cn.each,
  on: lC,
  attr: LI,
  attrTween: ZI,
  style: vC,
  styleTween: CC,
  text: NC,
  textTween: kC,
  remove: uC,
  tween: DI,
  delay: $I,
  duration: qI,
  ease: tC,
  easeVarying: rC,
  end: MC,
  [Symbol.iterator]: Cn[Symbol.iterator]
};
function TC(e) {
  return ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2;
}
var BC = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: TC
};
function EC(e, n) {
  for (var o; !(o = e.__transition) || !(o = o[n]); )
    if (!(e = e.parentNode))
      throw new Error(`transition ${n} not found`);
  return o;
}
function DC(e) {
  var n, o;
  e instanceof Sn ? (n = e._id, e = e._name) : (n = hm(), (o = BC).time = Su(), e = e == null ? null : e + "");
  for (var s = this._groups, i = s.length, l = 0; l < i; ++l)
    for (var c = s[l], u = c.length, p, g = 0; g < u; ++g)
      (p = c[g]) && Di(p, e, n, g, c, o || EC(p, n));
  return new Sn(s, this._parents, e, n);
}
Ta.prototype.interrupt = TI;
Ta.prototype.transition = DC;
const li = (e) => () => e;
function GC(e, {
  sourceEvent: n,
  target: o,
  transform: s,
  dispatch: i
}) {
  Object.defineProperties(this, {
    type: { value: e, enumerable: !0, configurable: !0 },
    sourceEvent: { value: n, enumerable: !0, configurable: !0 },
    target: { value: o, enumerable: !0, configurable: !0 },
    transform: { value: s, enumerable: !0, configurable: !0 },
    _: { value: i }
  });
}
function Nn(e, n, o) {
  this.k = e, this.x = n, this.y = o;
}
Nn.prototype = {
  constructor: Nn,
  scale: function(e) {
    return e === 1 ? this : new Nn(this.k * e, this.x, this.y);
  },
  translate: function(e, n) {
    return e === 0 & n === 0 ? this : new Nn(this.k, this.x + this.k * e, this.y + this.k * n);
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
var Gi = new Nn(1, 0, 0);
ym.prototype = Nn.prototype;
function ym(e) {
  for (; !e.__zoom; ) if (!(e = e.parentNode)) return Gi;
  return e.__zoom;
}
function Wc(e) {
  e.stopImmediatePropagation();
}
function ha(e) {
  e.preventDefault(), e.stopImmediatePropagation();
}
function PC(e) {
  return (!e.ctrlKey || e.type === "wheel") && !e.button;
}
function FC() {
  var e = this;
  return e instanceof SVGElement ? (e = e.ownerSVGElement || e, e.hasAttribute("viewBox") ? (e = e.viewBox.baseVal, [[e.x, e.y], [e.x + e.width, e.y + e.height]]) : [[0, 0], [e.width.baseVal.value, e.height.baseVal.value]]) : [[0, 0], [e.clientWidth, e.clientHeight]];
}
function Op() {
  return this.__zoom || Gi;
}
function VC(e) {
  return -e.deltaY * (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 2e-3) * (e.ctrlKey ? 10 : 1);
}
function zC() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function OC(e, n, o) {
  var s = e.invertX(n[0][0]) - o[0][0], i = e.invertX(n[1][0]) - o[1][0], l = e.invertY(n[0][1]) - o[0][1], c = e.invertY(n[1][1]) - o[1][1];
  return e.translate(
    i > s ? (s + i) / 2 : Math.min(0, s) || Math.max(0, i),
    c > l ? (l + c) / 2 : Math.min(0, l) || Math.max(0, c)
  );
}
function wm() {
  var e = PC, n = FC, o = OC, s = VC, i = zC, l = [0, 1 / 0], c = [[-1 / 0, -1 / 0], [1 / 0, 1 / 0]], u = 250, p = mi, g = Ti("start", "zoom", "end"), m, h, w, C = 500, x = 150, I = 0, b = 10;
  function _(R) {
    R.property("__zoom", Op).on("wheel.zoom", K, { passive: !1 }).on("mousedown.zoom", D).on("dblclick.zoom", F).filter(i).on("touchstart.zoom", z).on("touchmove.zoom", W).on("touchend.zoom touchcancel.zoom", q).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  _.transform = function(R, Y, H, U) {
    var E = R.selection ? R.selection() : R;
    E.property("__zoom", Op), R !== E ? V(R, Y, H, U) : E.interrupt().each(function() {
      G(this, arguments).event(U).start().zoom(null, typeof Y == "function" ? Y.apply(this, arguments) : Y).end();
    });
  }, _.scaleBy = function(R, Y, H, U) {
    _.scaleTo(R, function() {
      var E = this.__zoom.k, P = typeof Y == "function" ? Y.apply(this, arguments) : Y;
      return E * P;
    }, H, U);
  }, _.scaleTo = function(R, Y, H, U) {
    _.transform(R, function() {
      var E = n.apply(this, arguments), P = this.__zoom, Z = H == null ? S(E) : typeof H == "function" ? H.apply(this, arguments) : H, M = P.invert(Z), L = typeof Y == "function" ? Y.apply(this, arguments) : Y;
      return o(A(k(P, L), Z, M), E, c);
    }, H, U);
  }, _.translateBy = function(R, Y, H, U) {
    _.transform(R, function() {
      return o(this.__zoom.translate(
        typeof Y == "function" ? Y.apply(this, arguments) : Y,
        typeof H == "function" ? H.apply(this, arguments) : H
      ), n.apply(this, arguments), c);
    }, null, U);
  }, _.translateTo = function(R, Y, H, U, E) {
    _.transform(R, function() {
      var P = n.apply(this, arguments), Z = this.__zoom, M = U == null ? S(P) : typeof U == "function" ? U.apply(this, arguments) : U;
      return o(Gi.translate(M[0], M[1]).scale(Z.k).translate(
        typeof Y == "function" ? -Y.apply(this, arguments) : -Y,
        typeof H == "function" ? -H.apply(this, arguments) : -H
      ), P, c);
    }, U, E);
  };
  function k(R, Y) {
    return Y = Math.max(l[0], Math.min(l[1], Y)), Y === R.k ? R : new Nn(Y, R.x, R.y);
  }
  function A(R, Y, H) {
    var U = Y[0] - H[0] * R.k, E = Y[1] - H[1] * R.k;
    return U === R.x && E === R.y ? R : new Nn(R.k, U, E);
  }
  function S(R) {
    return [(+R[0][0] + +R[1][0]) / 2, (+R[0][1] + +R[1][1]) / 2];
  }
  function V(R, Y, H, U) {
    R.on("start.zoom", function() {
      G(this, arguments).event(U).start();
    }).on("interrupt.zoom end.zoom", function() {
      G(this, arguments).event(U).end();
    }).tween("zoom", function() {
      var E = this, P = arguments, Z = G(E, P).event(U), M = n.apply(E, P), L = H == null ? S(M) : typeof H == "function" ? H.apply(E, P) : H, te = Math.max(M[1][0] - M[0][0], M[1][1] - M[0][1]), re = E.__zoom, le = typeof Y == "function" ? Y.apply(E, P) : Y, ue = p(re.invert(L).concat(te / re.k), le.invert(L).concat(te / le.k));
      return function(fe) {
        if (fe === 1) fe = le;
        else {
          var ne = ue(fe), pe = te / ne[2];
          fe = new Nn(pe, L[0] - ne[0] * pe, L[1] - ne[1] * pe);
        }
        Z.zoom(null, fe);
      };
    });
  }
  function G(R, Y, H) {
    return !H && R.__zooming || new T(R, Y);
  }
  function T(R, Y) {
    this.that = R, this.args = Y, this.active = 0, this.sourceEvent = null, this.extent = n.apply(R, Y), this.taps = 0;
  }
  T.prototype = {
    event: function(R) {
      return R && (this.sourceEvent = R), this;
    },
    start: function() {
      return ++this.active === 1 && (this.that.__zooming = this, this.emit("start")), this;
    },
    zoom: function(R, Y) {
      return this.mouse && R !== "mouse" && (this.mouse[1] = Y.invert(this.mouse[0])), this.touch0 && R !== "touch" && (this.touch0[1] = Y.invert(this.touch0[0])), this.touch1 && R !== "touch" && (this.touch1[1] = Y.invert(this.touch1[0])), this.that.__zoom = Y, this.emit("zoom"), this;
    },
    end: function() {
      return --this.active === 0 && (delete this.that.__zooming, this.emit("end")), this;
    },
    emit: function(R) {
      var Y = St(this.that).datum();
      g.call(
        R,
        this.that,
        new GC(R, {
          sourceEvent: this.sourceEvent,
          target: _,
          transform: this.that.__zoom,
          dispatch: g
        }),
        Y
      );
    }
  };
  function K(R, ...Y) {
    if (!e.apply(this, arguments)) return;
    var H = G(this, Y).event(R), U = this.__zoom, E = Math.max(l[0], Math.min(l[1], U.k * Math.pow(2, s.apply(this, arguments)))), P = Xt(R);
    if (H.wheel)
      (H.mouse[0][0] !== P[0] || H.mouse[0][1] !== P[1]) && (H.mouse[1] = U.invert(H.mouse[0] = P)), clearTimeout(H.wheel);
    else {
      if (U.k === E) return;
      H.mouse = [P, U.invert(P)], wi(this), H.start();
    }
    ha(R), H.wheel = setTimeout(Z, x), H.zoom("mouse", o(A(k(U, E), H.mouse[0], H.mouse[1]), H.extent, c));
    function Z() {
      H.wheel = null, H.end();
    }
  }
  function D(R, ...Y) {
    if (w || !e.apply(this, arguments)) return;
    var H = R.currentTarget, U = G(this, Y, !0).event(R), E = St(R.view).on("mousemove.zoom", L, !0).on("mouseup.zoom", te, !0), P = Xt(R, H), Z = R.clientX, M = R.clientY;
    tm(R.view), Wc(R), U.mouse = [P, this.__zoom.invert(P)], wi(this), U.start();
    function L(re) {
      if (ha(re), !U.moved) {
        var le = re.clientX - Z, ue = re.clientY - M;
        U.moved = le * le + ue * ue > I;
      }
      U.event(re).zoom("mouse", o(A(U.that.__zoom, U.mouse[0] = Xt(re, H), U.mouse[1]), U.extent, c));
    }
    function te(re) {
      E.on("mousemove.zoom mouseup.zoom", null), nm(re.view, U.moved), ha(re), U.event(re).end();
    }
  }
  function F(R, ...Y) {
    if (e.apply(this, arguments)) {
      var H = this.__zoom, U = Xt(R.changedTouches ? R.changedTouches[0] : R, this), E = H.invert(U), P = H.k * (R.shiftKey ? 0.5 : 2), Z = o(A(k(H, P), U, E), n.apply(this, Y), c);
      ha(R), u > 0 ? St(this).transition().duration(u).call(V, Z, U, R) : St(this).call(_.transform, Z, U, R);
    }
  }
  function z(R, ...Y) {
    if (e.apply(this, arguments)) {
      var H = R.touches, U = H.length, E = G(this, Y, R.changedTouches.length === U).event(R), P, Z, M, L;
      for (Wc(R), Z = 0; Z < U; ++Z)
        M = H[Z], L = Xt(M, this), L = [L, this.__zoom.invert(L), M.identifier], E.touch0 ? !E.touch1 && E.touch0[2] !== L[2] && (E.touch1 = L, E.taps = 0) : (E.touch0 = L, P = !0, E.taps = 1 + !!m);
      m && (m = clearTimeout(m)), P && (E.taps < 2 && (h = L[0], m = setTimeout(function() {
        m = null;
      }, C)), wi(this), E.start());
    }
  }
  function W(R, ...Y) {
    if (this.__zooming) {
      var H = G(this, Y).event(R), U = R.changedTouches, E = U.length, P, Z, M, L;
      for (ha(R), P = 0; P < E; ++P)
        Z = U[P], M = Xt(Z, this), H.touch0 && H.touch0[2] === Z.identifier ? H.touch0[0] = M : H.touch1 && H.touch1[2] === Z.identifier && (H.touch1[0] = M);
      if (Z = H.that.__zoom, H.touch1) {
        var te = H.touch0[0], re = H.touch0[1], le = H.touch1[0], ue = H.touch1[1], fe = (fe = le[0] - te[0]) * fe + (fe = le[1] - te[1]) * fe, ne = (ne = ue[0] - re[0]) * ne + (ne = ue[1] - re[1]) * ne;
        Z = k(Z, Math.sqrt(fe / ne)), M = [(te[0] + le[0]) / 2, (te[1] + le[1]) / 2], L = [(re[0] + ue[0]) / 2, (re[1] + ue[1]) / 2];
      } else if (H.touch0) M = H.touch0[0], L = H.touch0[1];
      else return;
      H.zoom("touch", o(A(Z, M, L), H.extent, c));
    }
  }
  function q(R, ...Y) {
    if (this.__zooming) {
      var H = G(this, Y).event(R), U = R.changedTouches, E = U.length, P, Z;
      for (Wc(R), w && clearTimeout(w), w = setTimeout(function() {
        w = null;
      }, C), P = 0; P < E; ++P)
        Z = U[P], H.touch0 && H.touch0[2] === Z.identifier ? delete H.touch0 : H.touch1 && H.touch1[2] === Z.identifier && delete H.touch1;
      if (H.touch1 && !H.touch0 && (H.touch0 = H.touch1, delete H.touch1), H.touch0) H.touch0[1] = this.__zoom.invert(H.touch0[0]);
      else if (H.end(), H.taps === 2 && (Z = Xt(Z, this), Math.hypot(h[0] - Z[0], h[1] - Z[1]) < b)) {
        var M = St(this).on("dblclick.zoom");
        M && M.apply(this, arguments);
      }
    }
  }
  return _.wheelDelta = function(R) {
    return arguments.length ? (s = typeof R == "function" ? R : li(+R), _) : s;
  }, _.filter = function(R) {
    return arguments.length ? (e = typeof R == "function" ? R : li(!!R), _) : e;
  }, _.touchable = function(R) {
    return arguments.length ? (i = typeof R == "function" ? R : li(!!R), _) : i;
  }, _.extent = function(R) {
    return arguments.length ? (n = typeof R == "function" ? R : li([[+R[0][0], +R[0][1]], [+R[1][0], +R[1][1]]]), _) : n;
  }, _.scaleExtent = function(R) {
    return arguments.length ? (l[0] = +R[0], l[1] = +R[1], _) : [l[0], l[1]];
  }, _.translateExtent = function(R) {
    return arguments.length ? (c[0][0] = +R[0][0], c[1][0] = +R[1][0], c[0][1] = +R[0][1], c[1][1] = +R[1][1], _) : [[c[0][0], c[0][1]], [c[1][0], c[1][1]]];
  }, _.constrain = function(R) {
    return arguments.length ? (o = R, _) : o;
  }, _.duration = function(R) {
    return arguments.length ? (u = +R, _) : u;
  }, _.interpolate = function(R) {
    return arguments.length ? (p = R, _) : p;
  }, _.on = function() {
    var R = g.on.apply(g, arguments);
    return R === g ? _ : R;
  }, _.clickDistance = function(R) {
    return arguments.length ? (I = (R = +R) * R, _) : Math.sqrt(I);
  }, _.tapDistance = function(R) {
    return arguments.length ? (b = +R, _) : b;
  }, _;
}
const ln = {
  error001: () => "[React Flow]: Seems like you have not used zustand provider as an ancestor. Help: https://reactflow.dev/error#001",
  error002: () => "It looks like you've created a new nodeTypes or edgeTypes object. If this wasn't on purpose please define the nodeTypes/edgeTypes outside of the component or memoize them.",
  error003: (e) => `Node type "${e}" not found. Using fallback type "default".`,
  error004: () => "The React Flow parent container needs a width and a height to render the graph.",
  error005: () => "Only child nodes can use a parent extent.",
  error006: () => "Can't create edge. An edge needs a source and a target.",
  error007: (e) => `The old edge with id=${e} does not exist.`,
  error009: (e) => `Marker type "${e}" doesn't exist.`,
  error008: (e, { id: n, sourceHandle: o, targetHandle: s }) => `Couldn't create edge for ${e} handle id: "${e === "source" ? o : s}", edge id: ${n}.`,
  error010: () => "Handle: No node id found. Make sure to only use a Handle inside a custom Node.",
  error011: (e) => `Edge type "${e}" not found. Using fallback type "default".`,
  error012: (e) => `Node with id "${e}" does not exist, it may have been removed. This can happen when a node is deleted before the "onNodeClick" handler is called.`,
  error013: (e = "react") => `It seems that you haven't loaded the styles. Please import '@xyflow/${e}/dist/style.css' or base.css to make sure everything is working properly.`,
  error014: () => "useNodeConnections: No node ID found. Call useNodeConnections inside a custom Node or provide a node ID.",
  error015: () => "It seems that you are trying to drag a node that is not initialized. Please use onNodesChange as explained in the docs."
}, Aa = [
  [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY],
  [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY]
], vm = ["Enter", " ", "Escape"], xm = {
  "node.a11yDescription.default": "Press enter or space to select a node. Press delete to remove it and escape to cancel.",
  "node.a11yDescription.keyboardDisabled": "Press enter or space to select a node. You can then use the arrow keys to move the node around. Press delete to remove it and escape to cancel.",
  "node.a11yDescription.ariaLiveMessage": ({ direction: e, x: n, y: o }) => `Moved selected node ${e}. New position, x: ${n}, y: ${o}`,
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
var mo;
(function(e) {
  e.Strict = "strict", e.Loose = "loose";
})(mo || (mo = {}));
var Nr;
(function(e) {
  e.Free = "free", e.Vertical = "vertical", e.Horizontal = "horizontal";
})(Nr || (Nr = {}));
var Sa;
(function(e) {
  e.Partial = "partial", e.Full = "full";
})(Sa || (Sa = {}));
const Im = {
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
var er;
(function(e) {
  e.Bezier = "default", e.Straight = "straight", e.Step = "step", e.SmoothStep = "smoothstep", e.SimpleBezier = "simplebezier";
})(er || (er = {}));
var Ai;
(function(e) {
  e.Arrow = "arrow", e.ArrowClosed = "arrowclosed";
})(Ai || (Ai = {}));
var Q;
(function(e) {
  e.Left = "left", e.Top = "top", e.Right = "right", e.Bottom = "bottom";
})(Q || (Q = {}));
const Lp = {
  [Q.Left]: Q.Right,
  [Q.Right]: Q.Left,
  [Q.Top]: Q.Bottom,
  [Q.Bottom]: Q.Top
};
function Cm(e) {
  return e === null ? null : e ? "valid" : "invalid";
}
const bm = (e) => "id" in e && "source" in e && "target" in e, LC = (e) => "id" in e && "position" in e && !("source" in e) && !("target" in e), Mu = (e) => "id" in e && "internals" in e && !("source" in e) && !("target" in e), Ea = (e, n = [0, 0]) => {
  const { width: o, height: s } = kn(e), i = e.origin ?? n, l = o * i[0], c = s * i[1];
  return {
    x: e.position.x - l,
    y: e.position.y - c
  };
}, HC = (e, n = { nodeOrigin: [0, 0] }) => {
  if (e.length === 0)
    return { x: 0, y: 0, width: 0, height: 0 };
  const o = e.reduce((s, i) => {
    const l = typeof i == "string";
    let c = !n.nodeLookup && !l ? i : void 0;
    n.nodeLookup && (c = l ? n.nodeLookup.get(i) : Mu(i) ? i : n.nodeLookup.get(i.id));
    const u = c ? Si(c, n.nodeOrigin) : { x: 0, y: 0, x2: 0, y2: 0 };
    return Pi(s, u);
  }, { x: 1 / 0, y: 1 / 0, x2: -1 / 0, y2: -1 / 0 });
  return Fi(o);
}, Da = (e, n = {}) => {
  let o = { x: 1 / 0, y: 1 / 0, x2: -1 / 0, y2: -1 / 0 }, s = !1;
  return e.forEach((i) => {
    (n.filter === void 0 || n.filter(i)) && (o = Pi(o, Si(i)), s = !0);
  }), s ? Fi(o) : { x: 0, y: 0, width: 0, height: 0 };
}, Ru = (e, n, [o, s, i] = [0, 0, 1], l = !1, c = !1) => {
  const u = {
    ...Pa(n, [o, s, i]),
    width: n.width / i,
    height: n.height / i
  }, p = [];
  for (const g of e.values()) {
    const { measured: m, selectable: h = !0, hidden: w = !1 } = g;
    if (c && !h || w)
      continue;
    const C = m.width ?? g.width ?? g.initialWidth ?? null, x = m.height ?? g.height ?? g.initialHeight ?? null, I = ka(u, yo(g)), b = (C ?? 0) * (x ?? 0), _ = l && I > 0;
    (!g.internals.handleBounds || _ || I >= b || g.dragging) && p.push(g);
  }
  return p;
}, WC = (e, n) => {
  const o = /* @__PURE__ */ new Set();
  return e.forEach((s) => {
    o.add(s.id);
  }), n.filter((s) => o.has(s.source) || o.has(s.target));
};
function XC(e, n) {
  const o = /* @__PURE__ */ new Map(), s = n != null && n.nodes ? new Set(n.nodes.map((i) => i.id)) : null;
  return e.forEach((i) => {
    i.measured.width && i.measured.height && ((n == null ? void 0 : n.includeHiddenNodes) || !i.hidden) && (!s || s.has(i.id)) && o.set(i.id, i);
  }), o;
}
async function KC({ nodes: e, width: n, height: o, panZoom: s, minZoom: i, maxZoom: l }, c) {
  if (e.size === 0)
    return Promise.resolve(!0);
  const u = XC(e, c), p = Da(u), g = Tu(p, n, o, (c == null ? void 0 : c.minZoom) ?? i, (c == null ? void 0 : c.maxZoom) ?? l, (c == null ? void 0 : c.padding) ?? 0.1);
  return await s.setViewport(g, {
    duration: c == null ? void 0 : c.duration,
    ease: c == null ? void 0 : c.ease,
    interpolate: c == null ? void 0 : c.interpolate
  }), Promise.resolve(!0);
}
function _m({ nodeId: e, nextPosition: n, nodeLookup: o, nodeOrigin: s = [0, 0], nodeExtent: i, onError: l }) {
  const c = o.get(e), u = c.parentId ? o.get(c.parentId) : void 0, { x: p, y: g } = u ? u.internals.positionAbsolute : { x: 0, y: 0 }, m = c.origin ?? s;
  let h = c.extent || i;
  if (c.extent === "parent" && !c.expandParent)
    if (!u)
      l == null || l("005", ln.error005());
    else {
      const C = u.measured.width, x = u.measured.height;
      C && x && (h = [
        [p, g],
        [p + C, g + x]
      ]);
    }
  else u && wo(c.extent) && (h = [
    [c.extent[0][0] + p, c.extent[0][1] + g],
    [c.extent[1][0] + p, c.extent[1][1] + g]
  ]);
  const w = wo(h) ? kr(n, h, c.measured) : n;
  return (c.measured.width === void 0 || c.measured.height === void 0) && (l == null || l("015", ln.error015())), {
    position: {
      x: w.x - p + (c.measured.width ?? 0) * m[0],
      y: w.y - g + (c.measured.height ?? 0) * m[1]
    },
    positionAbsolute: w
  };
}
async function ZC({ nodesToRemove: e = [], edgesToRemove: n = [], nodes: o, edges: s, onBeforeDelete: i }) {
  const l = new Set(e.map((w) => w.id)), c = [];
  for (const w of o) {
    if (w.deletable === !1)
      continue;
    const C = l.has(w.id), x = !C && w.parentId && c.find((I) => I.id === w.parentId);
    (C || x) && c.push(w);
  }
  const u = new Set(n.map((w) => w.id)), p = s.filter((w) => w.deletable !== !1), m = WC(c, p);
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
const ho = (e, n = 0, o = 1) => Math.min(Math.max(e, n), o), kr = (e = { x: 0, y: 0 }, n, o) => ({
  x: ho(e.x, n[0][0], n[1][0] - ((o == null ? void 0 : o.width) ?? 0)),
  y: ho(e.y, n[0][1], n[1][1] - ((o == null ? void 0 : o.height) ?? 0))
});
function Nm(e, n, o) {
  const { width: s, height: i } = kn(o), { x: l, y: c } = o.internals.positionAbsolute;
  return kr(e, [
    [l, c],
    [l + s, c + i]
  ], n);
}
const Hp = (e, n, o) => e < n ? ho(Math.abs(e - n), 1, n) / n : e > o ? -ho(Math.abs(e - o), 1, n) / n : 0, Am = (e, n, o = 15, s = 40) => {
  const i = Hp(e.x, s, n.width - s) * o, l = Hp(e.y, s, n.height - s) * o;
  return [i, l];
}, Pi = (e, n) => ({
  x: Math.min(e.x, n.x),
  y: Math.min(e.y, n.y),
  x2: Math.max(e.x2, n.x2),
  y2: Math.max(e.y2, n.y2)
}), pu = ({ x: e, y: n, width: o, height: s }) => ({
  x: e,
  y: n,
  x2: e + o,
  y2: n + s
}), Fi = ({ x: e, y: n, x2: o, y2: s }) => ({
  x: e,
  y: n,
  width: o - e,
  height: s - n
}), yo = (e, n = [0, 0]) => {
  var i, l;
  const { x: o, y: s } = Mu(e) ? e.internals.positionAbsolute : Ea(e, n);
  return {
    x: o,
    y: s,
    width: ((i = e.measured) == null ? void 0 : i.width) ?? e.width ?? e.initialWidth ?? 0,
    height: ((l = e.measured) == null ? void 0 : l.height) ?? e.height ?? e.initialHeight ?? 0
  };
}, Si = (e, n = [0, 0]) => {
  var i, l;
  const { x: o, y: s } = Mu(e) ? e.internals.positionAbsolute : Ea(e, n);
  return {
    x: o,
    y: s,
    x2: o + (((i = e.measured) == null ? void 0 : i.width) ?? e.width ?? e.initialWidth ?? 0),
    y2: s + (((l = e.measured) == null ? void 0 : l.height) ?? e.height ?? e.initialHeight ?? 0)
  };
}, Sm = (e, n) => Fi(Pi(pu(e), pu(n))), ka = (e, n) => {
  const o = Math.max(0, Math.min(e.x + e.width, n.x + n.width) - Math.max(e.x, n.x)), s = Math.max(0, Math.min(e.y + e.height, n.y + n.height) - Math.max(e.y, n.y));
  return Math.ceil(o * s);
}, Wp = (e) => Zt(e.width) && Zt(e.height) && Zt(e.x) && Zt(e.y), Zt = (e) => !isNaN(e) && isFinite(e), YC = (e, n) => {
}, Ga = (e, n = [1, 1]) => ({
  x: n[0] * Math.round(e.x / n[0]),
  y: n[1] * Math.round(e.y / n[1])
}), Pa = ({ x: e, y: n }, [o, s, i], l = !1, c = [1, 1]) => {
  const u = {
    x: (e - o) / i,
    y: (n - s) / i
  };
  return l ? Ga(u, c) : u;
}, ki = ({ x: e, y: n }, [o, s, i]) => ({
  x: e * i + o,
  y: n * i + s
});
function so(e, n) {
  if (typeof e == "number")
    return Math.floor((n - n / (1 + e)) * 0.5);
  if (typeof e == "string" && e.endsWith("px")) {
    const o = parseFloat(e);
    if (!Number.isNaN(o))
      return Math.floor(o);
  }
  if (typeof e == "string" && e.endsWith("%")) {
    const o = parseFloat(e);
    if (!Number.isNaN(o))
      return Math.floor(n * o * 0.01);
  }
  return console.error(`[React Flow] The padding value "${e}" is invalid. Please provide a number or a string with a valid unit (px or %).`), 0;
}
function UC(e, n, o) {
  if (typeof e == "string" || typeof e == "number") {
    const s = so(e, o), i = so(e, n);
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
    const s = so(e.top ?? e.y ?? 0, o), i = so(e.bottom ?? e.y ?? 0, o), l = so(e.left ?? e.x ?? 0, n), c = so(e.right ?? e.x ?? 0, n);
    return { top: s, right: c, bottom: i, left: l, x: l + c, y: s + i };
  }
  return { top: 0, right: 0, bottom: 0, left: 0, x: 0, y: 0 };
}
function $C(e, n, o, s, i, l) {
  const { x: c, y: u } = ki(e, [n, o, s]), { x: p, y: g } = ki({ x: e.x + e.width, y: e.y + e.height }, [n, o, s]), m = i - p, h = l - g;
  return {
    left: Math.floor(c),
    top: Math.floor(u),
    right: Math.floor(m),
    bottom: Math.floor(h)
  };
}
const Tu = (e, n, o, s, i, l) => {
  const c = UC(l, n, o), u = (n - c.x) / e.width, p = (o - c.y) / e.height, g = Math.min(u, p), m = ho(g, s, i), h = e.x + e.width / 2, w = e.y + e.height / 2, C = n / 2 - h * m, x = o / 2 - w * m, I = $C(e, C, x, m, n, o), b = {
    left: Math.min(I.left - c.left, 0),
    top: Math.min(I.top - c.top, 0),
    right: Math.min(I.right - c.right, 0),
    bottom: Math.min(I.bottom - c.bottom, 0)
  };
  return {
    x: C - b.left + b.right,
    y: x - b.top + b.bottom,
    zoom: m
  };
}, ja = () => {
  var e;
  return typeof navigator < "u" && ((e = navigator == null ? void 0 : navigator.userAgent) == null ? void 0 : e.indexOf("Mac")) >= 0;
};
function wo(e) {
  return e != null && e !== "parent";
}
function kn(e) {
  var n, o;
  return {
    width: ((n = e.measured) == null ? void 0 : n.width) ?? e.width ?? e.initialWidth ?? 0,
    height: ((o = e.measured) == null ? void 0 : o.height) ?? e.height ?? e.initialHeight ?? 0
  };
}
function km(e) {
  var n, o;
  return (((n = e.measured) == null ? void 0 : n.width) ?? e.width ?? e.initialWidth) !== void 0 && (((o = e.measured) == null ? void 0 : o.height) ?? e.height ?? e.initialHeight) !== void 0;
}
function jm(e, n = { width: 0, height: 0 }, o, s, i) {
  const l = { ...e }, c = s.get(o);
  if (c) {
    const u = c.origin || i;
    l.x += c.internals.positionAbsolute.x - (n.width ?? 0) * u[0], l.y += c.internals.positionAbsolute.y - (n.height ?? 0) * u[1];
  }
  return l;
}
function Xp(e, n) {
  if (e.size !== n.size)
    return !1;
  for (const o of e)
    if (!n.has(o))
      return !1;
  return !0;
}
function QC() {
  let e, n;
  return { promise: new Promise((s, i) => {
    e = s, n = i;
  }), resolve: e, reject: n };
}
function JC(e) {
  return { ...xm, ...e || {} };
}
function xa(e, { snapGrid: n = [0, 0], snapToGrid: o = !1, transform: s, containerBounds: i }) {
  const { x: l, y: c } = Yt(e), u = Pa({ x: l - ((i == null ? void 0 : i.left) ?? 0), y: c - ((i == null ? void 0 : i.top) ?? 0) }, s), { x: p, y: g } = o ? Ga(u, n) : u;
  return {
    xSnapped: p,
    ySnapped: g,
    ...u
  };
}
const Bu = (e) => ({
  width: e.offsetWidth,
  height: e.offsetHeight
}), Mm = (e) => {
  var n;
  return ((n = e == null ? void 0 : e.getRootNode) == null ? void 0 : n.call(e)) || (window == null ? void 0 : window.document);
}, qC = ["INPUT", "SELECT", "TEXTAREA"];
function Rm(e) {
  var s, i;
  const n = ((i = (s = e.composedPath) == null ? void 0 : s.call(e)) == null ? void 0 : i[0]) || e.target;
  return (n == null ? void 0 : n.nodeType) !== 1 ? !1 : qC.includes(n.nodeName) || n.hasAttribute("contenteditable") || !!n.closest(".nokey");
}
const Tm = (e) => "clientX" in e, Yt = (e, n) => {
  var l, c;
  const o = Tm(e), s = o ? e.clientX : (l = e.touches) == null ? void 0 : l[0].clientX, i = o ? e.clientY : (c = e.touches) == null ? void 0 : c[0].clientY;
  return {
    x: s - ((n == null ? void 0 : n.left) ?? 0),
    y: i - ((n == null ? void 0 : n.top) ?? 0)
  };
}, Kp = (e, n, o, s, i) => {
  const l = n.querySelectorAll(`.${e}`);
  return !l || !l.length ? null : Array.from(l).map((c) => {
    const u = c.getBoundingClientRect();
    return {
      id: c.getAttribute("data-handleid"),
      type: e,
      nodeId: i,
      position: c.getAttribute("data-handlepos"),
      x: (u.left - o.left) / s,
      y: (u.top - o.top) / s,
      ...Bu(c)
    };
  });
};
function Bm({ sourceX: e, sourceY: n, targetX: o, targetY: s, sourceControlX: i, sourceControlY: l, targetControlX: c, targetControlY: u }) {
  const p = e * 0.125 + i * 0.375 + c * 0.375 + o * 0.125, g = n * 0.125 + l * 0.375 + u * 0.375 + s * 0.125, m = Math.abs(p - e), h = Math.abs(g - n);
  return [p, g, m, h];
}
function ci(e, n) {
  return e >= 0 ? 0.5 * e : n * 25 * Math.sqrt(-e);
}
function Zp({ pos: e, x1: n, y1: o, x2: s, y2: i, c: l }) {
  switch (e) {
    case Q.Left:
      return [n - ci(n - s, l), o];
    case Q.Right:
      return [n + ci(s - n, l), o];
    case Q.Top:
      return [n, o - ci(o - i, l)];
    case Q.Bottom:
      return [n, o + ci(i - o, l)];
  }
}
function Vi({ sourceX: e, sourceY: n, sourcePosition: o = Q.Bottom, targetX: s, targetY: i, targetPosition: l = Q.Top, curvature: c = 0.25 }) {
  const [u, p] = Zp({
    pos: o,
    x1: e,
    y1: n,
    x2: s,
    y2: i,
    c
  }), [g, m] = Zp({
    pos: l,
    x1: s,
    y1: i,
    x2: e,
    y2: n,
    c
  }), [h, w, C, x] = Bm({
    sourceX: e,
    sourceY: n,
    targetX: s,
    targetY: i,
    sourceControlX: u,
    sourceControlY: p,
    targetControlX: g,
    targetControlY: m
  });
  return [
    `M${e},${n} C${u},${p} ${g},${m} ${s},${i}`,
    h,
    w,
    C,
    x
  ];
}
function Em({ sourceX: e, sourceY: n, targetX: o, targetY: s }) {
  const i = Math.abs(o - e) / 2, l = o < e ? o + i : o - i, c = Math.abs(s - n) / 2, u = s < n ? s + c : s - c;
  return [l, u, i, c];
}
function eb({ sourceNode: e, targetNode: n, selected: o = !1, zIndex: s = 0, elevateOnSelect: i = !1, zIndexMode: l = "basic" }) {
  if (l === "manual")
    return s;
  const c = i && o ? s + 1e3 : s, u = Math.max(e.parentId || i && e.selected ? e.internals.z : 0, n.parentId || i && n.selected ? n.internals.z : 0);
  return c + u;
}
function tb({ sourceNode: e, targetNode: n, width: o, height: s, transform: i }) {
  const l = Pi(Si(e), Si(n));
  l.x === l.x2 && (l.x2 += 1), l.y === l.y2 && (l.y2 += 1);
  const c = {
    x: -i[0] / i[2],
    y: -i[1] / i[2],
    width: o / i[2],
    height: s / i[2]
  };
  return ka(c, Fi(l)) > 0;
}
const nb = ({ source: e, sourceHandle: n, target: o, targetHandle: s }) => `xy-edge__${e}${n || ""}-${o}${s || ""}`, rb = (e, n) => n.some((o) => o.source === e.source && o.target === e.target && (o.sourceHandle === e.sourceHandle || !o.sourceHandle && !e.sourceHandle) && (o.targetHandle === e.targetHandle || !o.targetHandle && !e.targetHandle)), ob = (e, n, o = {}) => {
  if (!e.source || !e.target)
    return n;
  const s = o.getEdgeId || nb;
  let i;
  return bm(e) ? i = { ...e } : i = {
    ...e,
    id: s(e)
  }, rb(i, n) ? n : (i.sourceHandle === null && delete i.sourceHandle, i.targetHandle === null && delete i.targetHandle, n.concat(i));
};
function Dm({ sourceX: e, sourceY: n, targetX: o, targetY: s }) {
  const [i, l, c, u] = Em({
    sourceX: e,
    sourceY: n,
    targetX: o,
    targetY: s
  });
  return [`M ${e},${n}L ${o},${s}`, i, l, c, u];
}
const Yp = {
  [Q.Left]: { x: -1, y: 0 },
  [Q.Right]: { x: 1, y: 0 },
  [Q.Top]: { x: 0, y: -1 },
  [Q.Bottom]: { x: 0, y: 1 }
}, ab = ({ source: e, sourcePosition: n = Q.Bottom, target: o }) => n === Q.Left || n === Q.Right ? e.x < o.x ? { x: 1, y: 0 } : { x: -1, y: 0 } : e.y < o.y ? { x: 0, y: 1 } : { x: 0, y: -1 }, Up = (e, n) => Math.sqrt(Math.pow(n.x - e.x, 2) + Math.pow(n.y - e.y, 2));
function sb({ source: e, sourcePosition: n = Q.Bottom, target: o, targetPosition: s = Q.Top, center: i, offset: l, stepPosition: c }) {
  const u = Yp[n], p = Yp[s], g = { x: e.x + u.x * l, y: e.y + u.y * l }, m = { x: o.x + p.x * l, y: o.y + p.y * l }, h = ab({
    source: g,
    sourcePosition: n,
    target: m
  }), w = h.x !== 0 ? "x" : "y", C = h[w];
  let x = [], I, b;
  const _ = { x: 0, y: 0 }, k = { x: 0, y: 0 }, [, , A, S] = Em({
    sourceX: e.x,
    sourceY: e.y,
    targetX: o.x,
    targetY: o.y
  });
  if (u[w] * p[w] === -1) {
    w === "x" ? (I = i.x ?? g.x + (m.x - g.x) * c, b = i.y ?? (g.y + m.y) / 2) : (I = i.x ?? (g.x + m.x) / 2, b = i.y ?? g.y + (m.y - g.y) * c);
    const G = [
      { x: I, y: g.y },
      { x: I, y: m.y }
    ], T = [
      { x: g.x, y: b },
      { x: m.x, y: b }
    ];
    u[w] === C ? x = w === "x" ? G : T : x = w === "x" ? T : G;
  } else {
    const G = [{ x: g.x, y: m.y }], T = [{ x: m.x, y: g.y }];
    if (w === "x" ? x = u.x === C ? T : G : x = u.y === C ? G : T, n === s) {
      const W = Math.abs(e[w] - o[w]);
      if (W <= l) {
        const q = Math.min(l - 1, l - W);
        u[w] === C ? _[w] = (g[w] > e[w] ? -1 : 1) * q : k[w] = (m[w] > o[w] ? -1 : 1) * q;
      }
    }
    if (n !== s) {
      const W = w === "x" ? "y" : "x", q = u[w] === p[W], R = g[W] > m[W], Y = g[W] < m[W];
      (u[w] === 1 && (!q && R || q && Y) || u[w] !== 1 && (!q && Y || q && R)) && (x = w === "x" ? G : T);
    }
    const K = { x: g.x + _.x, y: g.y + _.y }, D = { x: m.x + k.x, y: m.y + k.y }, F = Math.max(Math.abs(K.x - x[0].x), Math.abs(D.x - x[0].x)), z = Math.max(Math.abs(K.y - x[0].y), Math.abs(D.y - x[0].y));
    F >= z ? (I = (K.x + D.x) / 2, b = x[0].y) : (I = x[0].x, b = (K.y + D.y) / 2);
  }
  return [[
    e,
    { x: g.x + _.x, y: g.y + _.y },
    ...x,
    { x: m.x + k.x, y: m.y + k.y },
    o
  ], I, b, A, S];
}
function ib(e, n, o, s) {
  const i = Math.min(Up(e, n) / 2, Up(n, o) / 2, s), { x: l, y: c } = n;
  if (e.x === l && l === o.x || e.y === c && c === o.y)
    return `L${l} ${c}`;
  if (e.y === c) {
    const g = e.x < o.x ? -1 : 1, m = e.y < o.y ? 1 : -1;
    return `L ${l + i * g},${c}Q ${l},${c} ${l},${c + i * m}`;
  }
  const u = e.x < o.x ? 1 : -1, p = e.y < o.y ? -1 : 1;
  return `L ${l},${c + i * p}Q ${l},${c} ${l + i * u},${c}`;
}
function gu({ sourceX: e, sourceY: n, sourcePosition: o = Q.Bottom, targetX: s, targetY: i, targetPosition: l = Q.Top, borderRadius: c = 5, centerX: u, centerY: p, offset: g = 20, stepPosition: m = 0.5 }) {
  const [h, w, C, x, I] = sb({
    source: { x: e, y: n },
    sourcePosition: o,
    target: { x: s, y: i },
    targetPosition: l,
    center: { x: u, y: p },
    offset: g,
    stepPosition: m
  });
  return [h.reduce((_, k, A) => {
    let S = "";
    return A > 0 && A < h.length - 1 ? S = ib(h[A - 1], k, h[A + 1], c) : S = `${A === 0 ? "M" : "L"}${k.x} ${k.y}`, _ += S, _;
  }, ""), w, C, x, I];
}
function $p(e) {
  var n;
  return e && !!(e.internals.handleBounds || (n = e.handles) != null && n.length) && !!(e.measured.width || e.width || e.initialWidth);
}
function lb(e) {
  var h;
  const { sourceNode: n, targetNode: o } = e;
  if (!$p(n) || !$p(o))
    return null;
  const s = n.internals.handleBounds || Qp(n.handles), i = o.internals.handleBounds || Qp(o.handles), l = Jp((s == null ? void 0 : s.source) ?? [], e.sourceHandle), c = Jp(
    // when connection type is loose we can define all handles as sources and connect source -> source
    e.connectionMode === mo.Strict ? (i == null ? void 0 : i.target) ?? [] : ((i == null ? void 0 : i.target) ?? []).concat((i == null ? void 0 : i.source) ?? []),
    e.targetHandle
  );
  if (!l || !c)
    return (h = e.onError) == null || h.call(e, "008", ln.error008(l ? "target" : "source", {
      id: e.id,
      sourceHandle: e.sourceHandle,
      targetHandle: e.targetHandle
    })), null;
  const u = (l == null ? void 0 : l.position) || Q.Bottom, p = (c == null ? void 0 : c.position) || Q.Top, g = jr(n, l, u), m = jr(o, c, p);
  return {
    sourceX: g.x,
    sourceY: g.y,
    targetX: m.x,
    targetY: m.y,
    sourcePosition: u,
    targetPosition: p
  };
}
function Qp(e) {
  if (!e)
    return null;
  const n = [], o = [];
  for (const s of e)
    s.width = s.width ?? 1, s.height = s.height ?? 1, s.type === "source" ? n.push(s) : s.type === "target" && o.push(s);
  return {
    source: n,
    target: o
  };
}
function jr(e, n, o = Q.Left, s = !1) {
  const i = ((n == null ? void 0 : n.x) ?? 0) + e.internals.positionAbsolute.x, l = ((n == null ? void 0 : n.y) ?? 0) + e.internals.positionAbsolute.y, { width: c, height: u } = n ?? kn(e);
  if (s)
    return { x: i + c / 2, y: l + u / 2 };
  switch ((n == null ? void 0 : n.position) ?? o) {
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
function Jp(e, n) {
  return e && (n ? e.find((o) => o.id === n) : e[0]) || null;
}
function mu(e, n) {
  return e ? typeof e == "string" ? e : `${n ? `${n}__` : ""}${Object.keys(e).sort().map((s) => `${s}=${e[s]}`).join("&")}` : "";
}
function cb(e, { id: n, defaultColor: o, defaultMarkerStart: s, defaultMarkerEnd: i }) {
  const l = /* @__PURE__ */ new Set();
  return e.reduce((c, u) => ([u.markerStart || s, u.markerEnd || i].forEach((p) => {
    if (p && typeof p == "object") {
      const g = mu(p, n);
      l.has(g) || (c.push({ id: g, color: p.color || o, ...p }), l.add(g));
    }
  }), c), []).sort((c, u) => c.id.localeCompare(u.id));
}
const Gm = 1e3, ub = 10, Eu = {
  nodeOrigin: [0, 0],
  nodeExtent: Aa,
  elevateNodesOnSelect: !0,
  zIndexMode: "basic",
  defaults: {}
}, db = {
  ...Eu,
  checkEquality: !0
};
function Du(e, n) {
  const o = { ...e };
  for (const s in n)
    n[s] !== void 0 && (o[s] = n[s]);
  return o;
}
function fb(e, n, o) {
  const s = Du(Eu, o);
  for (const i of e.values())
    if (i.parentId)
      Pu(i, e, n, s);
    else {
      const l = Ea(i, s.nodeOrigin), c = wo(i.extent) ? i.extent : s.nodeExtent, u = kr(l, c, kn(i));
      i.internals.positionAbsolute = u;
    }
}
function pb(e, n) {
  if (!e.handles)
    return e.measured ? n == null ? void 0 : n.internals.handleBounds : void 0;
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
function Gu(e) {
  return e === "manual";
}
function hu(e, n, o, s = {}) {
  var g, m;
  const i = Du(db, s), l = { i: 0 }, c = new Map(n), u = i != null && i.elevateNodesOnSelect && !Gu(i.zIndexMode) ? Gm : 0;
  let p = e.length > 0;
  n.clear(), o.clear();
  for (const h of e) {
    let w = c.get(h.id);
    if (i.checkEquality && h === (w == null ? void 0 : w.internals.userNode))
      n.set(h.id, w);
    else {
      const C = Ea(h, i.nodeOrigin), x = wo(h.extent) ? h.extent : i.nodeExtent, I = kr(C, x, kn(h));
      w = {
        ...i.defaults,
        ...h,
        measured: {
          width: (g = h.measured) == null ? void 0 : g.width,
          height: (m = h.measured) == null ? void 0 : m.height
        },
        internals: {
          positionAbsolute: I,
          // if user re-initializes the node or removes `measured` for whatever reason, we reset the handleBounds so that the node gets re-measured
          handleBounds: pb(h, w),
          z: Pm(h, u, i.zIndexMode),
          userNode: h
        }
      }, n.set(h.id, w);
    }
    (w.measured === void 0 || w.measured.width === void 0 || w.measured.height === void 0) && !w.hidden && (p = !1), h.parentId && Pu(w, n, o, s, l);
  }
  return p;
}
function gb(e, n) {
  if (!e.parentId)
    return;
  const o = n.get(e.parentId);
  o ? o.set(e.id, e) : n.set(e.parentId, /* @__PURE__ */ new Map([[e.id, e]]));
}
function Pu(e, n, o, s, i) {
  const { elevateNodesOnSelect: l, nodeOrigin: c, nodeExtent: u, zIndexMode: p } = Du(Eu, s), g = e.parentId, m = n.get(g);
  if (!m) {
    console.warn(`Parent node ${g} not found. Please make sure that parent nodes are in front of their child nodes in the nodes array.`);
    return;
  }
  gb(e, o), i && !m.parentId && m.internals.rootParentIndex === void 0 && p === "auto" && (m.internals.rootParentIndex = ++i.i, m.internals.z = m.internals.z + i.i * ub), i && m.internals.rootParentIndex !== void 0 && (i.i = m.internals.rootParentIndex);
  const h = l && !Gu(p) ? Gm : 0, { x: w, y: C, z: x } = mb(e, m, c, u, h, p), { positionAbsolute: I } = e.internals, b = w !== I.x || C !== I.y;
  (b || x !== e.internals.z) && n.set(e.id, {
    ...e,
    internals: {
      ...e.internals,
      positionAbsolute: b ? { x: w, y: C } : I,
      z: x
    }
  });
}
function Pm(e, n, o) {
  const s = Zt(e.zIndex) ? e.zIndex : 0;
  return Gu(o) ? s : s + (e.selected ? n : 0);
}
function mb(e, n, o, s, i, l) {
  const { x: c, y: u } = n.internals.positionAbsolute, p = kn(e), g = Ea(e, o), m = wo(e.extent) ? kr(g, e.extent, p) : g;
  let h = kr({ x: c + m.x, y: u + m.y }, s, p);
  e.extent === "parent" && (h = Nm(h, p, n));
  const w = Pm(e, i, l), C = n.internals.z ?? 0;
  return {
    x: h.x,
    y: h.y,
    z: C >= w ? C + 1 : w
  };
}
function Fu(e, n, o, s = [0, 0]) {
  var c;
  const i = [], l = /* @__PURE__ */ new Map();
  for (const u of e) {
    const p = n.get(u.parentId);
    if (!p)
      continue;
    const g = ((c = l.get(u.parentId)) == null ? void 0 : c.expandedRect) ?? yo(p), m = Sm(g, u.rect);
    l.set(u.parentId, { expandedRect: m, parent: p });
  }
  return l.size > 0 && l.forEach(({ expandedRect: u, parent: p }, g) => {
    var A;
    const m = p.internals.positionAbsolute, h = kn(p), w = p.origin ?? s, C = u.x < m.x ? Math.round(Math.abs(m.x - u.x)) : 0, x = u.y < m.y ? Math.round(Math.abs(m.y - u.y)) : 0, I = Math.max(h.width, Math.round(u.width)), b = Math.max(h.height, Math.round(u.height)), _ = (I - h.width) * w[0], k = (b - h.height) * w[1];
    (C > 0 || x > 0 || _ || k) && (i.push({
      id: g,
      type: "position",
      position: {
        x: p.position.x - C + _,
        y: p.position.y - x + k
      }
    }), (A = o.get(g)) == null || A.forEach((S) => {
      e.some((V) => V.id === S.id) || i.push({
        id: S.id,
        type: "position",
        position: {
          x: S.position.x + C,
          y: S.position.y + x
        }
      });
    })), (h.width < u.width || h.height < u.height || C || x) && i.push({
      id: g,
      type: "dimensions",
      setAttributes: !0,
      dimensions: {
        width: I + (C ? w[0] * C - _ : 0),
        height: b + (x ? w[1] * x - k : 0)
      }
    });
  }), i;
}
function hb(e, n, o, s, i, l, c) {
  const u = s == null ? void 0 : s.querySelector(".xyflow__viewport");
  let p = !1;
  if (!u)
    return { changes: [], updatedInternals: p };
  const g = [], m = window.getComputedStyle(u), { m22: h } = new window.DOMMatrixReadOnly(m.transform), w = [];
  for (const C of e.values()) {
    const x = n.get(C.id);
    if (!x)
      continue;
    if (x.hidden) {
      n.set(x.id, {
        ...x,
        internals: {
          ...x.internals,
          handleBounds: void 0
        }
      }), p = !0;
      continue;
    }
    const I = Bu(C.nodeElement), b = x.measured.width !== I.width || x.measured.height !== I.height;
    if (!!(I.width && I.height && (b || !x.internals.handleBounds || C.force))) {
      const k = C.nodeElement.getBoundingClientRect(), A = wo(x.extent) ? x.extent : l;
      let { positionAbsolute: S } = x.internals;
      x.parentId && x.extent === "parent" ? S = Nm(S, I, n.get(x.parentId)) : A && (S = kr(S, A, I));
      const V = {
        ...x,
        measured: I,
        internals: {
          ...x.internals,
          positionAbsolute: S,
          handleBounds: {
            source: Kp("source", C.nodeElement, k, h, x.id),
            target: Kp("target", C.nodeElement, k, h, x.id)
          }
        }
      };
      n.set(x.id, V), x.parentId && Pu(V, n, o, { nodeOrigin: i, zIndexMode: c }), p = !0, b && (g.push({
        id: x.id,
        type: "dimensions",
        dimensions: I
      }), x.expandParent && x.parentId && w.push({
        id: x.id,
        parentId: x.parentId,
        rect: yo(V, i)
      }));
    }
  }
  if (w.length > 0) {
    const C = Fu(w, n, o, i);
    g.push(...C);
  }
  return { changes: g, updatedInternals: p };
}
async function yb({ delta: e, panZoom: n, transform: o, translateExtent: s, width: i, height: l }) {
  if (!n || !e.x && !e.y)
    return Promise.resolve(!1);
  const c = await n.setViewportConstrained({
    x: o[0] + e.x,
    y: o[1] + e.y,
    zoom: o[2]
  }, [
    [0, 0],
    [i, l]
  ], s), u = !!c && (c.x !== o[0] || c.y !== o[1] || c.k !== o[2]);
  return Promise.resolve(u);
}
function qp(e, n, o, s, i, l) {
  let c = i;
  const u = s.get(c) || /* @__PURE__ */ new Map();
  s.set(c, u.set(o, n)), c = `${i}-${e}`;
  const p = s.get(c) || /* @__PURE__ */ new Map();
  if (s.set(c, p.set(o, n)), l) {
    c = `${i}-${e}-${l}`;
    const g = s.get(c) || /* @__PURE__ */ new Map();
    s.set(c, g.set(o, n));
  }
}
function Fm(e, n, o) {
  e.clear(), n.clear();
  for (const s of o) {
    const { source: i, target: l, sourceHandle: c = null, targetHandle: u = null } = s, p = { edgeId: s.id, source: i, target: l, sourceHandle: c, targetHandle: u }, g = `${i}-${c}--${l}-${u}`, m = `${l}-${u}--${i}-${c}`;
    qp("source", p, m, e, i, c), qp("target", p, g, e, l, u), n.set(s.id, s);
  }
}
function Vm(e, n) {
  if (!e.parentId)
    return !1;
  const o = n.get(e.parentId);
  return o ? o.selected ? !0 : Vm(o, n) : !1;
}
function eg(e, n, o) {
  var i;
  let s = e;
  do {
    if ((i = s == null ? void 0 : s.matches) != null && i.call(s, n))
      return !0;
    if (s === o)
      return !1;
    s = s == null ? void 0 : s.parentElement;
  } while (s);
  return !1;
}
function wb(e, n, o, s) {
  const i = /* @__PURE__ */ new Map();
  for (const [l, c] of e)
    if ((c.selected || c.id === s) && (!c.parentId || !Vm(c, e)) && (c.draggable || n && typeof c.draggable > "u")) {
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
function Xc({ nodeId: e, dragItems: n, nodeLookup: o, dragging: s = !0 }) {
  var c, u, p;
  const i = [];
  for (const [g, m] of n) {
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
      position: ((p = n.get(e)) == null ? void 0 : p.position) || l.position,
      dragging: s
    } : i[0],
    i
  ];
}
function vb({ dragItems: e, snapGrid: n, x: o, y: s }) {
  const i = e.values().next().value;
  if (!i)
    return null;
  const l = {
    x: o - i.distance.x,
    y: s - i.distance.y
  }, c = Ga(l, n);
  return {
    x: c.x - l.x,
    y: c.y - l.y
  };
}
function xb({ onNodeMouseDown: e, getStoreItems: n, onDragStart: o, onDrag: s, onDragStop: i }) {
  let l = { x: null, y: null }, c = 0, u = /* @__PURE__ */ new Map(), p = !1, g = { x: 0, y: 0 }, m = null, h = !1, w = null, C = !1, x = !1, I = null;
  function b({ noDragClassName: k, handleSelector: A, domNode: S, isSelectable: V, nodeId: G, nodeClickDistance: T = 0 }) {
    w = St(S);
    function K({ x: W, y: q }) {
      const { nodeLookup: R, nodeExtent: Y, snapGrid: H, snapToGrid: U, nodeOrigin: E, onNodeDrag: P, onSelectionDrag: Z, onError: M, updateNodePositions: L } = n();
      l = { x: W, y: q };
      let te = !1;
      const re = u.size > 1, le = re && Y ? pu(Da(u)) : null, ue = re && U ? vb({
        dragItems: u,
        snapGrid: H,
        x: W,
        y: q
      }) : null;
      for (const [fe, ne] of u) {
        if (!R.has(fe))
          continue;
        let pe = { x: W - ne.distance.x, y: q - ne.distance.y };
        U && (pe = ue ? {
          x: Math.round(pe.x + ue.x),
          y: Math.round(pe.y + ue.y)
        } : Ga(pe, H));
        let be = null;
        if (re && Y && !ne.extent && le) {
          const { positionAbsolute: xe } = ne.internals, Re = xe.x - le.x + Y[0][0], Be = xe.x + ne.measured.width - le.x2 + Y[1][0], je = xe.y - le.y + Y[0][1], We = xe.y + ne.measured.height - le.y2 + Y[1][1];
          be = [
            [Re, je],
            [Be, We]
          ];
        }
        const { position: _e, positionAbsolute: Ce } = _m({
          nodeId: fe,
          nextPosition: pe,
          nodeLookup: R,
          nodeExtent: be || Y,
          nodeOrigin: E,
          onError: M
        });
        te = te || ne.position.x !== _e.x || ne.position.y !== _e.y, ne.position = _e, ne.internals.positionAbsolute = Ce;
      }
      if (x = x || te, !!te && (L(u, !0), I && (s || P || !G && Z))) {
        const [fe, ne] = Xc({
          nodeId: G,
          dragItems: u,
          nodeLookup: R
        });
        s == null || s(I, u, fe, ne), P == null || P(I, fe, ne), G || Z == null || Z(I, ne);
      }
    }
    async function D() {
      if (!m)
        return;
      const { transform: W, panBy: q, autoPanSpeed: R, autoPanOnNodeDrag: Y } = n();
      if (!Y) {
        p = !1, cancelAnimationFrame(c);
        return;
      }
      const [H, U] = Am(g, m, R);
      (H !== 0 || U !== 0) && (l.x = (l.x ?? 0) - H / W[2], l.y = (l.y ?? 0) - U / W[2], await q({ x: H, y: U }) && K(l)), c = requestAnimationFrame(D);
    }
    function F(W) {
      var re;
      const { nodeLookup: q, multiSelectionActive: R, nodesDraggable: Y, transform: H, snapGrid: U, snapToGrid: E, selectNodesOnDrag: P, onNodeDragStart: Z, onSelectionDragStart: M, unselectNodesAndEdges: L } = n();
      h = !0, (!P || !V) && !R && G && ((re = q.get(G)) != null && re.selected || L()), V && P && G && (e == null || e(G));
      const te = xa(W.sourceEvent, { transform: H, snapGrid: U, snapToGrid: E, containerBounds: m });
      if (l = te, u = wb(q, Y, te, G), u.size > 0 && (o || Z || !G && M)) {
        const [le, ue] = Xc({
          nodeId: G,
          dragItems: u,
          nodeLookup: q
        });
        o == null || o(W.sourceEvent, u, le, ue), Z == null || Z(W.sourceEvent, le, ue), G || M == null || M(W.sourceEvent, ue);
      }
    }
    const z = rm().clickDistance(T).on("start", (W) => {
      const { domNode: q, nodeDragThreshold: R, transform: Y, snapGrid: H, snapToGrid: U } = n();
      m = (q == null ? void 0 : q.getBoundingClientRect()) || null, C = !1, x = !1, I = W.sourceEvent, R === 0 && F(W), l = xa(W.sourceEvent, { transform: Y, snapGrid: H, snapToGrid: U, containerBounds: m }), g = Yt(W.sourceEvent, m);
    }).on("drag", (W) => {
      const { autoPanOnNodeDrag: q, transform: R, snapGrid: Y, snapToGrid: H, nodeDragThreshold: U, nodeLookup: E } = n(), P = xa(W.sourceEvent, { transform: R, snapGrid: Y, snapToGrid: H, containerBounds: m });
      if (I = W.sourceEvent, (W.sourceEvent.type === "touchmove" && W.sourceEvent.touches.length > 1 || // if user deletes a node while dragging, we need to abort the drag to prevent errors
      G && !E.has(G)) && (C = !0), !C) {
        if (!p && q && h && (p = !0, D()), !h) {
          const Z = Yt(W.sourceEvent, m), M = Z.x - g.x, L = Z.y - g.y;
          Math.sqrt(M * M + L * L) > U && F(W);
        }
        (l.x !== P.xSnapped || l.y !== P.ySnapped) && u && h && (g = Yt(W.sourceEvent, m), K(P));
      }
    }).on("end", (W) => {
      if (!(!h || C) && (p = !1, h = !1, cancelAnimationFrame(c), u.size > 0)) {
        const { nodeLookup: q, updateNodePositions: R, onNodeDragStop: Y, onSelectionDragStop: H } = n();
        if (x && (R(u, !1), x = !1), i || Y || !G && H) {
          const [U, E] = Xc({
            nodeId: G,
            dragItems: u,
            nodeLookup: q,
            dragging: !1
          });
          i == null || i(W.sourceEvent, u, U, E), Y == null || Y(W.sourceEvent, U, E), G || H == null || H(W.sourceEvent, E);
        }
      }
    }).filter((W) => {
      const q = W.target;
      return !W.button && (!k || !eg(q, `.${k}`, S)) && (!A || eg(q, A, S));
    });
    w.call(z);
  }
  function _() {
    w == null || w.on(".drag", null);
  }
  return {
    update: b,
    destroy: _
  };
}
function Ib(e, n, o) {
  const s = [], i = {
    x: e.x - o,
    y: e.y - o,
    width: o * 2,
    height: o * 2
  };
  for (const l of n.values())
    ka(i, yo(l)) > 0 && s.push(l);
  return s;
}
const Cb = 250;
function bb(e, n, o, s) {
  var u, p;
  let i = [], l = 1 / 0;
  const c = Ib(e, o, n + Cb);
  for (const g of c) {
    const m = [...((u = g.internals.handleBounds) == null ? void 0 : u.source) ?? [], ...((p = g.internals.handleBounds) == null ? void 0 : p.target) ?? []];
    for (const h of m) {
      if (s.nodeId === h.nodeId && s.type === h.type && s.id === h.id)
        continue;
      const { x: w, y: C } = jr(g, h, h.position, !0), x = Math.sqrt(Math.pow(w - e.x, 2) + Math.pow(C - e.y, 2));
      x > n || (x < l ? (i = [{ ...h, x: w, y: C }], l = x) : x === l && i.push({ ...h, x: w, y: C }));
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
function zm(e, n, o, s, i, l = !1) {
  var g, m, h;
  const c = s.get(e);
  if (!c)
    return null;
  const u = i === "strict" ? (g = c.internals.handleBounds) == null ? void 0 : g[n] : [...((m = c.internals.handleBounds) == null ? void 0 : m.source) ?? [], ...((h = c.internals.handleBounds) == null ? void 0 : h.target) ?? []], p = (o ? u == null ? void 0 : u.find((w) => w.id === o) : u == null ? void 0 : u[0]) ?? null;
  return p && l ? { ...p, ...jr(c, p, p.position, !0) } : p;
}
function Om(e, n) {
  return e || (n != null && n.classList.contains("target") ? "target" : n != null && n.classList.contains("source") ? "source" : null);
}
function _b(e, n) {
  let o = null;
  return n ? o = !0 : e && !n && (o = !1), o;
}
const Lm = () => !0;
function Nb(e, { connectionMode: n, connectionRadius: o, handleId: s, nodeId: i, edgeUpdaterType: l, isTarget: c, domNode: u, nodeLookup: p, lib: g, autoPanOnConnect: m, flowId: h, panBy: w, cancelConnection: C, onConnectStart: x, onConnect: I, onConnectEnd: b, isValidConnection: _ = Lm, onReconnectEnd: k, updateConnection: A, getTransform: S, getFromHandle: V, autoPanSpeed: G, dragThreshold: T = 1, handleDomNode: K }) {
  const D = Mm(e.target);
  let F = 0, z;
  const { x: W, y: q } = Yt(e), R = Om(l, K), Y = u == null ? void 0 : u.getBoundingClientRect();
  let H = !1;
  if (!Y || !R)
    return;
  const U = zm(i, R, s, p, n);
  if (!U)
    return;
  let E = Yt(e, Y), P = !1, Z = null, M = !1, L = null;
  function te() {
    if (!m || !Y)
      return;
    const [_e, Ce] = Am(E, Y, G);
    w({ x: _e, y: Ce }), F = requestAnimationFrame(te);
  }
  const re = {
    ...U,
    nodeId: i,
    type: R,
    position: U.position
  }, le = p.get(i);
  let fe = {
    inProgress: !0,
    isValid: null,
    from: jr(le, re, Q.Left, !0),
    fromHandle: re,
    fromPosition: re.position,
    fromNode: le,
    to: E,
    toHandle: null,
    toPosition: Lp[re.position],
    toNode: null,
    pointer: E
  };
  function ne() {
    H = !0, A(fe), x == null || x(e, { nodeId: i, handleId: s, handleType: R });
  }
  T === 0 && ne();
  function pe(_e) {
    if (!H) {
      const { x: We, y: Ft } = Yt(_e), xt = We - W, It = Ft - q;
      if (!(xt * xt + It * It > T * T))
        return;
      ne();
    }
    if (!V() || !re) {
      be(_e);
      return;
    }
    const Ce = S();
    E = Yt(_e, Y), z = bb(Pa(E, Ce, !1, [1, 1]), o, p, re), P || (te(), P = !0);
    const xe = Hm(_e, {
      handle: z,
      connectionMode: n,
      fromNodeId: i,
      fromHandleId: s,
      fromType: c ? "target" : "source",
      isValidConnection: _,
      doc: D,
      lib: g,
      flowId: h,
      nodeLookup: p
    });
    L = xe.handleDomNode, Z = xe.connection, M = _b(!!z, xe.isValid);
    const Re = p.get(i), Be = Re ? jr(Re, re, Q.Left, !0) : fe.from, je = {
      ...fe,
      from: Be,
      isValid: M,
      to: xe.toHandle && M ? ki({ x: xe.toHandle.x, y: xe.toHandle.y }, Ce) : E,
      toHandle: xe.toHandle,
      toPosition: M && xe.toHandle ? xe.toHandle.position : Lp[re.position],
      toNode: xe.toHandle ? p.get(xe.toHandle.nodeId) : null,
      pointer: E
    };
    A(je), fe = je;
  }
  function be(_e) {
    if (!("touches" in _e && _e.touches.length > 0)) {
      if (H) {
        (z || L) && Z && M && (I == null || I(Z));
        const { inProgress: Ce, ...xe } = fe, Re = {
          ...xe,
          toPosition: fe.toHandle ? fe.toPosition : null
        };
        b == null || b(_e, Re), l && (k == null || k(_e, Re));
      }
      C(), cancelAnimationFrame(F), P = !1, M = !1, Z = null, L = null, D.removeEventListener("mousemove", pe), D.removeEventListener("mouseup", be), D.removeEventListener("touchmove", pe), D.removeEventListener("touchend", be);
    }
  }
  D.addEventListener("mousemove", pe), D.addEventListener("mouseup", be), D.addEventListener("touchmove", pe), D.addEventListener("touchend", be);
}
function Hm(e, { handle: n, connectionMode: o, fromNodeId: s, fromHandleId: i, fromType: l, doc: c, lib: u, flowId: p, isValidConnection: g = Lm, nodeLookup: m }) {
  const h = l === "target", w = n ? c.querySelector(`.${u}-flow__handle[data-id="${p}-${n == null ? void 0 : n.nodeId}-${n == null ? void 0 : n.id}-${n == null ? void 0 : n.type}"]`) : null, { x: C, y: x } = Yt(e), I = c.elementFromPoint(C, x), b = I != null && I.classList.contains(`${u}-flow__handle`) ? I : w, _ = {
    handleDomNode: b,
    isValid: !1,
    connection: null,
    toHandle: null
  };
  if (b) {
    const k = Om(void 0, b), A = b.getAttribute("data-nodeid"), S = b.getAttribute("data-handleid"), V = b.classList.contains("connectable"), G = b.classList.contains("connectableend");
    if (!A || !k)
      return _;
    const T = {
      source: h ? A : s,
      sourceHandle: h ? S : i,
      target: h ? s : A,
      targetHandle: h ? i : S
    };
    _.connection = T;
    const D = V && G && (o === mo.Strict ? h && k === "source" || !h && k === "target" : A !== s || S !== i);
    _.isValid = D && g(T), _.toHandle = zm(A, k, S, m, o, !0);
  }
  return _;
}
const yu = {
  onPointerDown: Nb,
  isValid: Hm
};
function Ab({ domNode: e, panZoom: n, getTransform: o, getViewScale: s }) {
  const i = St(e);
  function l({ translateExtent: u, width: p, height: g, zoomStep: m = 1, pannable: h = !0, zoomable: w = !0, inversePan: C = !1 }) {
    const x = (A) => {
      if (A.sourceEvent.type !== "wheel" || !n)
        return;
      const S = o(), V = A.sourceEvent.ctrlKey && ja() ? 10 : 1, G = -A.sourceEvent.deltaY * (A.sourceEvent.deltaMode === 1 ? 0.05 : A.sourceEvent.deltaMode ? 1 : 2e-3) * m, T = S[2] * Math.pow(2, G * V);
      n.scaleTo(T);
    };
    let I = [0, 0];
    const b = (A) => {
      (A.sourceEvent.type === "mousedown" || A.sourceEvent.type === "touchstart") && (I = [
        A.sourceEvent.clientX ?? A.sourceEvent.touches[0].clientX,
        A.sourceEvent.clientY ?? A.sourceEvent.touches[0].clientY
      ]);
    }, _ = (A) => {
      const S = o();
      if (A.sourceEvent.type !== "mousemove" && A.sourceEvent.type !== "touchmove" || !n)
        return;
      const V = [
        A.sourceEvent.clientX ?? A.sourceEvent.touches[0].clientX,
        A.sourceEvent.clientY ?? A.sourceEvent.touches[0].clientY
      ], G = [V[0] - I[0], V[1] - I[1]];
      I = V;
      const T = s() * Math.max(S[2], Math.log(S[2])) * (C ? -1 : 1), K = {
        x: S[0] - G[0] * T,
        y: S[1] - G[1] * T
      }, D = [
        [0, 0],
        [p, g]
      ];
      n.setViewportConstrained({
        x: K.x,
        y: K.y,
        zoom: S[2]
      }, D, u);
    }, k = wm().on("start", b).on("zoom", h ? _ : null).on("zoom.wheel", w ? x : null);
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
const zi = (e) => ({
  x: e.x,
  y: e.y,
  zoom: e.k
}), Kc = ({ x: e, y: n, zoom: o }) => Gi.translate(e, n).scale(o), io = (e, n) => e.target.closest(`.${n}`), Wm = (e, n) => n === 2 && Array.isArray(e) && e.includes(2), Sb = (e) => ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2, Zc = (e, n = 0, o = Sb, s = () => {
}) => {
  const i = typeof n == "number" && n > 0;
  return i || s(), i ? e.transition().duration(n).ease(o).on("end", s) : e;
}, Xm = (e) => {
  const n = e.ctrlKey && ja() ? 10 : 1;
  return -e.deltaY * (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 2e-3) * n;
};
function kb({ zoomPanValues: e, noWheelClassName: n, d3Selection: o, d3Zoom: s, panOnScrollMode: i, panOnScrollSpeed: l, zoomOnPinch: c, onPanZoomStart: u, onPanZoom: p, onPanZoomEnd: g }) {
  return (m) => {
    if (io(m, n))
      return m.ctrlKey && m.preventDefault(), !1;
    m.preventDefault(), m.stopImmediatePropagation();
    const h = o.property("__zoom").k || 1;
    if (m.ctrlKey && c) {
      const b = Xt(m), _ = Xm(m), k = h * Math.pow(2, _);
      s.scaleTo(o, k, b, m);
      return;
    }
    const w = m.deltaMode === 1 ? 20 : 1;
    let C = i === Nr.Vertical ? 0 : m.deltaX * w, x = i === Nr.Horizontal ? 0 : m.deltaY * w;
    !ja() && m.shiftKey && i !== Nr.Vertical && (C = m.deltaY * w, x = 0), s.translateBy(
      o,
      -(C / h) * l,
      -(x / h) * l,
      // @ts-ignore
      { internal: !0 }
    );
    const I = zi(o.property("__zoom"));
    clearTimeout(e.panScrollTimeout), e.isPanScrolling ? (p == null || p(m, I), e.panScrollTimeout = setTimeout(() => {
      g == null || g(m, I), e.isPanScrolling = !1;
    }, 150)) : (e.isPanScrolling = !0, u == null || u(m, I));
  };
}
function jb({ noWheelClassName: e, preventScrolling: n, d3ZoomHandler: o }) {
  return function(s, i) {
    const l = s.type === "wheel", c = !n && l && !s.ctrlKey, u = io(s, e);
    if (s.ctrlKey && l && u && s.preventDefault(), c || u)
      return null;
    s.preventDefault(), o.call(this, s, i);
  };
}
function Mb({ zoomPanValues: e, onDraggingChange: n, onPanZoomStart: o }) {
  return (s) => {
    var l, c, u;
    if ((l = s.sourceEvent) != null && l.internal)
      return;
    const i = zi(s.transform);
    e.mouseButton = ((c = s.sourceEvent) == null ? void 0 : c.button) || 0, e.isZoomingOrPanning = !0, e.prevViewport = i, ((u = s.sourceEvent) == null ? void 0 : u.type) === "mousedown" && n(!0), o && (o == null || o(s.sourceEvent, i));
  };
}
function Rb({ zoomPanValues: e, panOnDrag: n, onPaneContextMenu: o, onTransformChange: s, onPanZoom: i }) {
  return (l) => {
    var c, u;
    e.usedRightMouseButton = !!(o && Wm(n, e.mouseButton ?? 0)), (c = l.sourceEvent) != null && c.sync || s([l.transform.x, l.transform.y, l.transform.k]), i && !((u = l.sourceEvent) != null && u.internal) && (i == null || i(l.sourceEvent, zi(l.transform)));
  };
}
function Tb({ zoomPanValues: e, panOnDrag: n, panOnScroll: o, onDraggingChange: s, onPanZoomEnd: i, onPaneContextMenu: l }) {
  return (c) => {
    var u;
    if (!((u = c.sourceEvent) != null && u.internal) && (e.isZoomingOrPanning = !1, l && Wm(n, e.mouseButton ?? 0) && !e.usedRightMouseButton && c.sourceEvent && l(c.sourceEvent), e.usedRightMouseButton = !1, s(!1), i)) {
      const p = zi(c.transform);
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
function Bb({ zoomActivationKeyPressed: e, zoomOnScroll: n, zoomOnPinch: o, panOnDrag: s, panOnScroll: i, zoomOnDoubleClick: l, userSelectionActive: c, noWheelClassName: u, noPanClassName: p, lib: g, connectionInProgress: m }) {
  return (h) => {
    var b;
    const w = e || n, C = o && h.ctrlKey, x = h.type === "wheel";
    if (h.button === 1 && h.type === "mousedown" && (io(h, `${g}-flow__node`) || io(h, `${g}-flow__edge`)))
      return !0;
    if (!s && !w && !i && !l && !o || c || m && !x || io(h, u) && x || io(h, p) && (!x || i && x && !e) || !o && h.ctrlKey && x)
      return !1;
    if (!o && h.type === "touchstart" && ((b = h.touches) == null ? void 0 : b.length) > 1)
      return h.preventDefault(), !1;
    if (!w && !i && !C && x || !s && (h.type === "mousedown" || h.type === "touchstart") || Array.isArray(s) && !s.includes(h.button) && h.type === "mousedown")
      return !1;
    const I = Array.isArray(s) && s.includes(h.button) || !h.button || h.button <= 1;
    return (!h.ctrlKey || x) && I;
  };
}
function Eb({ domNode: e, minZoom: n, maxZoom: o, translateExtent: s, viewport: i, onPanZoom: l, onPanZoomStart: c, onPanZoomEnd: u, onDraggingChange: p }) {
  const g = {
    isZoomingOrPanning: !1,
    usedRightMouseButton: !1,
    prevViewport: {},
    mouseButton: 0,
    timerId: void 0,
    panScrollTimeout: void 0,
    isPanScrolling: !1
  }, m = e.getBoundingClientRect(), h = wm().scaleExtent([n, o]).translateExtent(s), w = St(e).call(h);
  k({
    x: i.x,
    y: i.y,
    zoom: ho(i.zoom, n, o)
  }, [
    [0, 0],
    [m.width, m.height]
  ], s);
  const C = w.on("wheel.zoom"), x = w.on("dblclick.zoom");
  h.wheelDelta(Xm);
  function I(z, W) {
    return w ? new Promise((q) => {
      h == null || h.interpolate((W == null ? void 0 : W.interpolate) === "linear" ? va : mi).transform(Zc(w, W == null ? void 0 : W.duration, W == null ? void 0 : W.ease, () => q(!0)), z);
    }) : Promise.resolve(!1);
  }
  function b({ noWheelClassName: z, noPanClassName: W, onPaneContextMenu: q, userSelectionActive: R, panOnScroll: Y, panOnDrag: H, panOnScrollMode: U, panOnScrollSpeed: E, preventScrolling: P, zoomOnPinch: Z, zoomOnScroll: M, zoomOnDoubleClick: L, zoomActivationKeyPressed: te, lib: re, onTransformChange: le, connectionInProgress: ue, paneClickDistance: fe, selectionOnDrag: ne }) {
    R && !g.isZoomingOrPanning && _();
    const pe = Y && !te && !R;
    h.clickDistance(ne ? 1 / 0 : !Zt(fe) || fe < 0 ? 0 : fe);
    const be = pe ? kb({
      zoomPanValues: g,
      noWheelClassName: z,
      d3Selection: w,
      d3Zoom: h,
      panOnScrollMode: U,
      panOnScrollSpeed: E,
      zoomOnPinch: Z,
      onPanZoomStart: c,
      onPanZoom: l,
      onPanZoomEnd: u
    }) : jb({
      noWheelClassName: z,
      preventScrolling: P,
      d3ZoomHandler: C
    });
    if (w.on("wheel.zoom", be, { passive: !1 }), !R) {
      const Ce = Mb({
        zoomPanValues: g,
        onDraggingChange: p,
        onPanZoomStart: c
      });
      h.on("start", Ce);
      const xe = Rb({
        zoomPanValues: g,
        panOnDrag: H,
        onPaneContextMenu: !!q,
        onPanZoom: l,
        onTransformChange: le
      });
      h.on("zoom", xe);
      const Re = Tb({
        zoomPanValues: g,
        panOnDrag: H,
        panOnScroll: Y,
        onPaneContextMenu: q,
        onPanZoomEnd: u,
        onDraggingChange: p
      });
      h.on("end", Re);
    }
    const _e = Bb({
      zoomActivationKeyPressed: te,
      panOnDrag: H,
      zoomOnScroll: M,
      panOnScroll: Y,
      zoomOnDoubleClick: L,
      zoomOnPinch: Z,
      userSelectionActive: R,
      noPanClassName: W,
      noWheelClassName: z,
      lib: re,
      connectionInProgress: ue
    });
    h.filter(_e), L ? w.on("dblclick.zoom", x) : w.on("dblclick.zoom", null);
  }
  function _() {
    h.on("zoom", null);
  }
  async function k(z, W, q) {
    const R = Kc(z), Y = h == null ? void 0 : h.constrain()(R, W, q);
    return Y && await I(Y), new Promise((H) => H(Y));
  }
  async function A(z, W) {
    const q = Kc(z);
    return await I(q, W), new Promise((R) => R(q));
  }
  function S(z) {
    if (w) {
      const W = Kc(z), q = w.property("__zoom");
      (q.k !== z.zoom || q.x !== z.x || q.y !== z.y) && (h == null || h.transform(w, W, null, { sync: !0 }));
    }
  }
  function V() {
    const z = w ? ym(w.node()) : { x: 0, y: 0, k: 1 };
    return { x: z.x, y: z.y, zoom: z.k };
  }
  function G(z, W) {
    return w ? new Promise((q) => {
      h == null || h.interpolate((W == null ? void 0 : W.interpolate) === "linear" ? va : mi).scaleTo(Zc(w, W == null ? void 0 : W.duration, W == null ? void 0 : W.ease, () => q(!0)), z);
    }) : Promise.resolve(!1);
  }
  function T(z, W) {
    return w ? new Promise((q) => {
      h == null || h.interpolate((W == null ? void 0 : W.interpolate) === "linear" ? va : mi).scaleBy(Zc(w, W == null ? void 0 : W.duration, W == null ? void 0 : W.ease, () => q(!0)), z);
    }) : Promise.resolve(!1);
  }
  function K(z) {
    h == null || h.scaleExtent(z);
  }
  function D(z) {
    h == null || h.translateExtent(z);
  }
  function F(z) {
    const W = !Zt(z) || z < 0 ? 0 : z;
    h == null || h.clickDistance(W);
  }
  return {
    update: b,
    destroy: _,
    setViewport: A,
    setViewportConstrained: k,
    getViewport: V,
    scaleTo: G,
    scaleBy: T,
    setScaleExtent: K,
    setTranslateExtent: D,
    syncViewport: S,
    setClickDistance: F
  };
}
var vo;
(function(e) {
  e.Line = "line", e.Handle = "handle";
})(vo || (vo = {}));
function Db({ width: e, prevWidth: n, height: o, prevHeight: s, affectsX: i, affectsY: l }) {
  const c = e - n, u = o - s, p = [c > 0 ? 1 : c < 0 ? -1 : 0, u > 0 ? 1 : u < 0 ? -1 : 0];
  return c && i && (p[0] = p[0] * -1), u && l && (p[1] = p[1] * -1), p;
}
function tg(e) {
  const n = e.includes("right") || e.includes("left"), o = e.includes("bottom") || e.includes("top"), s = e.includes("left"), i = e.includes("top");
  return {
    isHorizontal: n,
    isVertical: o,
    affectsX: s,
    affectsY: i
  };
}
function Jn(e, n) {
  return Math.max(0, n - e);
}
function qn(e, n) {
  return Math.max(0, e - n);
}
function ui(e, n, o) {
  return Math.max(0, n - e, e - o);
}
function ng(e, n) {
  return e ? !n : n;
}
function Gb(e, n, o, s, i, l, c, u) {
  let { affectsX: p, affectsY: g } = n;
  const { isHorizontal: m, isVertical: h } = n, w = m && h, { xSnapped: C, ySnapped: x } = o, { minWidth: I, maxWidth: b, minHeight: _, maxHeight: k } = s, { x: A, y: S, width: V, height: G, aspectRatio: T } = e;
  let K = Math.floor(m ? C - e.pointerX : 0), D = Math.floor(h ? x - e.pointerY : 0);
  const F = V + (p ? -K : K), z = G + (g ? -D : D), W = -l[0] * V, q = -l[1] * G;
  let R = ui(F, I, b), Y = ui(z, _, k);
  if (c) {
    let E = 0, P = 0;
    p && K < 0 ? E = Jn(A + K + W, c[0][0]) : !p && K > 0 && (E = qn(A + F + W, c[1][0])), g && D < 0 ? P = Jn(S + D + q, c[0][1]) : !g && D > 0 && (P = qn(S + z + q, c[1][1])), R = Math.max(R, E), Y = Math.max(Y, P);
  }
  if (u) {
    let E = 0, P = 0;
    p && K > 0 ? E = qn(A + K, u[0][0]) : !p && K < 0 && (E = Jn(A + F, u[1][0])), g && D > 0 ? P = qn(S + D, u[0][1]) : !g && D < 0 && (P = Jn(S + z, u[1][1])), R = Math.max(R, E), Y = Math.max(Y, P);
  }
  if (i) {
    if (m) {
      const E = ui(F / T, _, k) * T;
      if (R = Math.max(R, E), c) {
        let P = 0;
        !p && !g || p && !g && w ? P = qn(S + q + F / T, c[1][1]) * T : P = Jn(S + q + (p ? K : -K) / T, c[0][1]) * T, R = Math.max(R, P);
      }
      if (u) {
        let P = 0;
        !p && !g || p && !g && w ? P = Jn(S + F / T, u[1][1]) * T : P = qn(S + (p ? K : -K) / T, u[0][1]) * T, R = Math.max(R, P);
      }
    }
    if (h) {
      const E = ui(z * T, I, b) / T;
      if (Y = Math.max(Y, E), c) {
        let P = 0;
        !p && !g || g && !p && w ? P = qn(A + z * T + W, c[1][0]) / T : P = Jn(A + (g ? D : -D) * T + W, c[0][0]) / T, Y = Math.max(Y, P);
      }
      if (u) {
        let P = 0;
        !p && !g || g && !p && w ? P = Jn(A + z * T, u[1][0]) / T : P = qn(A + (g ? D : -D) * T, u[0][0]) / T, Y = Math.max(Y, P);
      }
    }
  }
  D = D + (D < 0 ? Y : -Y), K = K + (K < 0 ? R : -R), i && (w ? F > z * T ? D = (ng(p, g) ? -K : K) / T : K = (ng(p, g) ? -D : D) * T : m ? (D = K / T, g = p) : (K = D * T, p = g));
  const H = p ? A + K : A, U = g ? S + D : S;
  return {
    width: V + (p ? -K : K),
    height: G + (g ? -D : D),
    x: l[0] * K * (p ? -1 : 1) + H,
    y: l[1] * D * (g ? -1 : 1) + U
  };
}
const Km = { width: 0, height: 0, x: 0, y: 0 }, Pb = {
  ...Km,
  pointerX: 0,
  pointerY: 0,
  aspectRatio: 1
};
function Fb(e) {
  return [
    [0, 0],
    [e.measured.width, e.measured.height]
  ];
}
function Vb(e, n, o) {
  const s = n.position.x + e.position.x, i = n.position.y + e.position.y, l = e.measured.width ?? 0, c = e.measured.height ?? 0, u = o[0] * l, p = o[1] * c;
  return [
    [s - u, i - p],
    [s + l - u, i + c - p]
  ];
}
function zb({ domNode: e, nodeId: n, getStoreItems: o, onChange: s, onEnd: i }) {
  const l = St(e);
  let c = {
    controlDirection: tg("bottom-right"),
    boundaries: {
      minWidth: 0,
      minHeight: 0,
      maxWidth: Number.MAX_VALUE,
      maxHeight: Number.MAX_VALUE
    },
    resizeDirection: void 0,
    keepAspectRatio: !1
  };
  function u({ controlPosition: g, boundaries: m, keepAspectRatio: h, resizeDirection: w, onResizeStart: C, onResize: x, onResizeEnd: I, shouldResize: b }) {
    let _ = { ...Km }, k = { ...Pb };
    c = {
      boundaries: m,
      resizeDirection: w,
      keepAspectRatio: h,
      controlDirection: tg(g)
    };
    let A, S = null, V = [], G, T, K, D = !1;
    const F = rm().on("start", (z) => {
      const { nodeLookup: W, transform: q, snapGrid: R, snapToGrid: Y, nodeOrigin: H, paneDomNode: U } = o();
      if (A = W.get(n), !A)
        return;
      S = (U == null ? void 0 : U.getBoundingClientRect()) ?? null;
      const { xSnapped: E, ySnapped: P } = xa(z.sourceEvent, {
        transform: q,
        snapGrid: R,
        snapToGrid: Y,
        containerBounds: S
      });
      _ = {
        width: A.measured.width ?? 0,
        height: A.measured.height ?? 0,
        x: A.position.x ?? 0,
        y: A.position.y ?? 0
      }, k = {
        ..._,
        pointerX: E,
        pointerY: P,
        aspectRatio: _.width / _.height
      }, G = void 0, A.parentId && (A.extent === "parent" || A.expandParent) && (G = W.get(A.parentId), T = G && A.extent === "parent" ? Fb(G) : void 0), V = [], K = void 0;
      for (const [Z, M] of W)
        if (M.parentId === n && (V.push({
          id: Z,
          position: { ...M.position },
          extent: M.extent
        }), M.extent === "parent" || M.expandParent)) {
          const L = Vb(M, A, M.origin ?? H);
          K ? K = [
            [Math.min(L[0][0], K[0][0]), Math.min(L[0][1], K[0][1])],
            [Math.max(L[1][0], K[1][0]), Math.max(L[1][1], K[1][1])]
          ] : K = L;
        }
      C == null || C(z, { ..._ });
    }).on("drag", (z) => {
      const { transform: W, snapGrid: q, snapToGrid: R, nodeOrigin: Y } = o(), H = xa(z.sourceEvent, {
        transform: W,
        snapGrid: q,
        snapToGrid: R,
        containerBounds: S
      }), U = [];
      if (!A)
        return;
      const { x: E, y: P, width: Z, height: M } = _, L = {}, te = A.origin ?? Y, { width: re, height: le, x: ue, y: fe } = Gb(k, c.controlDirection, H, c.boundaries, c.keepAspectRatio, te, T, K), ne = re !== Z, pe = le !== M, be = ue !== E && ne, _e = fe !== P && pe;
      if (!be && !_e && !ne && !pe)
        return;
      if ((be || _e || te[0] === 1 || te[1] === 1) && (L.x = be ? ue : _.x, L.y = _e ? fe : _.y, _.x = L.x, _.y = L.y, V.length > 0)) {
        const Be = ue - E, je = fe - P;
        for (const We of V)
          We.position = {
            x: We.position.x - Be + te[0] * (re - Z),
            y: We.position.y - je + te[1] * (le - M)
          }, U.push(We);
      }
      if ((ne || pe) && (L.width = ne && (!c.resizeDirection || c.resizeDirection === "horizontal") ? re : _.width, L.height = pe && (!c.resizeDirection || c.resizeDirection === "vertical") ? le : _.height, _.width = L.width, _.height = L.height), G && A.expandParent) {
        const Be = te[0] * (L.width ?? 0);
        L.x && L.x < Be && (_.x = Be, k.x = k.x - (L.x - Be));
        const je = te[1] * (L.height ?? 0);
        L.y && L.y < je && (_.y = je, k.y = k.y - (L.y - je));
      }
      const Ce = Db({
        width: _.width,
        prevWidth: Z,
        height: _.height,
        prevHeight: M,
        affectsX: c.controlDirection.affectsX,
        affectsY: c.controlDirection.affectsY
      }), xe = { ..._, direction: Ce };
      (b == null ? void 0 : b(z, xe)) !== !1 && (D = !0, x == null || x(z, xe), s(L, U));
    }).on("end", (z) => {
      D && (I == null || I(z, { ..._ }), i == null || i({ ..._ }), D = !1);
    });
    l.call(F);
  }
  function p() {
    l.on(".drag", null);
  }
  return {
    update: u,
    destroy: p
  };
}
var Yc = { exports: {} }, Uc = {}, $c = { exports: {} }, Qc = {};
/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var rg;
function Ob() {
  if (rg) return Qc;
  rg = 1;
  var e = Ra();
  function n(h, w) {
    return h === w && (h !== 0 || 1 / h === 1 / w) || h !== h && w !== w;
  }
  var o = typeof Object.is == "function" ? Object.is : n, s = e.useState, i = e.useEffect, l = e.useLayoutEffect, c = e.useDebugValue;
  function u(h, w) {
    var C = w(), x = s({ inst: { value: C, getSnapshot: w } }), I = x[0].inst, b = x[1];
    return l(
      function() {
        I.value = C, I.getSnapshot = w, p(I) && b({ inst: I });
      },
      [h, C, w]
    ), i(
      function() {
        return p(I) && b({ inst: I }), h(function() {
          p(I) && b({ inst: I });
        });
      },
      [h]
    ), c(C), C;
  }
  function p(h) {
    var w = h.getSnapshot;
    h = h.value;
    try {
      var C = w();
      return !o(h, C);
    } catch {
      return !0;
    }
  }
  function g(h, w) {
    return w();
  }
  var m = typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u" ? g : u;
  return Qc.useSyncExternalStore = e.useSyncExternalStore !== void 0 ? e.useSyncExternalStore : m, Qc;
}
var og;
function Lb() {
  return og || (og = 1, $c.exports = Ob()), $c.exports;
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
var ag;
function Hb() {
  if (ag) return Uc;
  ag = 1;
  var e = Ra(), n = Lb();
  function o(g, m) {
    return g === m && (g !== 0 || 1 / g === 1 / m) || g !== g && m !== m;
  }
  var s = typeof Object.is == "function" ? Object.is : o, i = n.useSyncExternalStore, l = e.useRef, c = e.useEffect, u = e.useMemo, p = e.useDebugValue;
  return Uc.useSyncExternalStoreWithSelector = function(g, m, h, w, C) {
    var x = l(null);
    if (x.current === null) {
      var I = { hasValue: !1, value: null };
      x.current = I;
    } else I = x.current;
    x = u(
      function() {
        function _(G) {
          if (!k) {
            if (k = !0, A = G, G = w(G), C !== void 0 && I.hasValue) {
              var T = I.value;
              if (C(T, G))
                return S = T;
            }
            return S = G;
          }
          if (T = S, s(A, G)) return T;
          var K = w(G);
          return C !== void 0 && C(T, K) ? (A = G, T) : (A = G, S = K);
        }
        var k = !1, A, S, V = h === void 0 ? null : h;
        return [
          function() {
            return _(m());
          },
          V === null ? void 0 : function() {
            return _(V());
          }
        ];
      },
      [m, h, w, C]
    );
    var b = i(g, x[0], x[1]);
    return c(
      function() {
        I.hasValue = !0, I.value = b;
      },
      [b]
    ), p(b), b;
  }, Uc;
}
var sg;
function Wb() {
  return sg || (sg = 1, Yc.exports = Hb()), Yc.exports;
}
var Xb = Wb();
const Kb = /* @__PURE__ */ Cu(Xb), Zb = {}, ig = (e) => {
  let n;
  const o = /* @__PURE__ */ new Set(), s = (m, h) => {
    const w = typeof m == "function" ? m(n) : m;
    if (!Object.is(w, n)) {
      const C = n;
      n = h ?? (typeof w != "object" || w === null) ? w : Object.assign({}, n, w), o.forEach((x) => x(n, C));
    }
  }, i = () => n, p = { setState: s, getState: i, getInitialState: () => g, subscribe: (m) => (o.add(m), () => o.delete(m)), destroy: () => {
    (Zb ? "production" : void 0) !== "production" && console.warn(
      "[DEPRECATED] The `destroy` method will be unsupported in a future version. Instead use unsubscribe function returned by subscribe. Everything will be garbage-collected if store is garbage-collected."
    ), o.clear();
  } }, g = n = e(s, i, p);
  return p;
}, Yb = (e) => e ? ig(e) : ig, { useDebugValue: Ub } = _n, { useSyncExternalStoreWithSelector: $b } = Kb, Qb = (e) => e;
function Zm(e, n = Qb, o) {
  const s = $b(
    e.subscribe,
    e.getState,
    e.getServerState || e.getInitialState,
    n,
    o
  );
  return Ub(s), s;
}
const lg = (e, n) => {
  const o = Yb(e), s = (i, l = n) => Zm(o, i, l);
  return Object.assign(s, o), s;
}, Jb = (e, n) => e ? lg(e, n) : lg;
function Le(e, n) {
  if (Object.is(e, n))
    return !0;
  if (typeof e != "object" || e === null || typeof n != "object" || n === null)
    return !1;
  if (e instanceof Map && n instanceof Map) {
    if (e.size !== n.size) return !1;
    for (const [s, i] of e)
      if (!Object.is(i, n.get(s)))
        return !1;
    return !0;
  }
  if (e instanceof Set && n instanceof Set) {
    if (e.size !== n.size) return !1;
    for (const s of e)
      if (!n.has(s))
        return !1;
    return !0;
  }
  const o = Object.keys(e);
  if (o.length !== Object.keys(n).length)
    return !1;
  for (const s of o)
    if (!Object.prototype.hasOwnProperty.call(n, s) || !Object.is(e[s], n[s]))
      return !1;
  return !0;
}
var qb = Og();
const Oi = j.createContext(null), e_ = Oi.Provider, Ym = ln.error001();
function Te(e, n) {
  const o = j.useContext(Oi);
  if (o === null)
    throw new Error(Ym);
  return Zm(o, e, n);
}
function He() {
  const e = j.useContext(Oi);
  if (e === null)
    throw new Error(Ym);
  return j.useMemo(() => ({
    getState: e.getState,
    setState: e.setState,
    subscribe: e.subscribe
  }), [e]);
}
const cg = { display: "none" }, t_ = {
  position: "absolute",
  width: 1,
  height: 1,
  margin: -1,
  border: 0,
  padding: 0,
  overflow: "hidden",
  clip: "rect(0px, 0px, 0px, 0px)",
  clipPath: "inset(100%)"
}, Um = "react-flow__node-desc", $m = "react-flow__edge-desc", n_ = "react-flow__aria-live", r_ = (e) => e.ariaLiveMessage, o_ = (e) => e.ariaLabelConfig;
function a_({ rfId: e }) {
  const n = Te(r_);
  return d.jsx("div", { id: `${n_}-${e}`, "aria-live": "assertive", "aria-atomic": "true", style: t_, children: n });
}
function s_({ rfId: e, disableKeyboardA11y: n }) {
  const o = Te(o_);
  return d.jsxs(d.Fragment, { children: [d.jsx("div", { id: `${Um}-${e}`, style: cg, children: n ? o["node.a11yDescription.default"] : o["node.a11yDescription.keyboardDisabled"] }), d.jsx("div", { id: `${$m}-${e}`, style: cg, children: o["edge.a11yDescription.default"] }), !n && d.jsx(a_, { rfId: e })] });
}
const bn = j.forwardRef(({ position: e = "top-left", children: n, className: o, style: s, ...i }, l) => {
  const c = `${e}`.split("-");
  return d.jsx("div", { className: Qe(["react-flow__panel", o, ...c]), style: s, ref: l, ...i, children: n });
});
bn.displayName = "Panel";
function i_({ proOptions: e, position: n = "bottom-right" }) {
  return e != null && e.hideAttribution ? null : d.jsx(bn, { position: n, className: "react-flow__attribution", "data-message": "Please only hide this attribution when you are subscribed to React Flow Pro: https://pro.reactflow.dev", children: d.jsx("a", { href: "https://reactflow.dev", target: "_blank", rel: "noopener noreferrer", "aria-label": "React Flow attribution", children: "React Flow" }) });
}
const l_ = (e) => {
  const n = [], o = [];
  for (const [, s] of e.nodeLookup)
    s.selected && n.push(s.internals.userNode);
  for (const [, s] of e.edgeLookup)
    s.selected && o.push(s);
  return { selectedNodes: n, selectedEdges: o };
}, di = (e) => e.id;
function c_(e, n) {
  return Le(e.selectedNodes.map(di), n.selectedNodes.map(di)) && Le(e.selectedEdges.map(di), n.selectedEdges.map(di));
}
function u_({ onSelectionChange: e }) {
  const n = He(), { selectedNodes: o, selectedEdges: s } = Te(l_, c_);
  return j.useEffect(() => {
    const i = { nodes: o, edges: s };
    e == null || e(i), n.getState().onSelectionChangeHandlers.forEach((l) => l(i));
  }, [o, s, e]), null;
}
const d_ = (e) => !!e.onSelectionChangeHandlers;
function f_({ onSelectionChange: e }) {
  const n = Te(d_);
  return e || n ? d.jsx(u_, { onSelectionChange: e }) : null;
}
const Qm = [0, 0], p_ = { x: 0, y: 0, zoom: 1 }, g_ = [
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
], ug = [...g_, "rfId"], m_ = (e) => ({
  setNodes: e.setNodes,
  setEdges: e.setEdges,
  setMinZoom: e.setMinZoom,
  setMaxZoom: e.setMaxZoom,
  setTranslateExtent: e.setTranslateExtent,
  setNodeExtent: e.setNodeExtent,
  reset: e.reset,
  setDefaultNodesAndEdges: e.setDefaultNodesAndEdges
}), dg = {
  /*
   * these are values that are also passed directly to other components
   * than the StoreUpdater. We can reduce the number of setStore calls
   * by setting the same values here as prev fields.
   */
  translateExtent: Aa,
  nodeOrigin: Qm,
  minZoom: 0.5,
  maxZoom: 2,
  elementsSelectable: !0,
  noPanClassName: "nopan",
  rfId: "1"
};
function h_(e) {
  const { setNodes: n, setEdges: o, setMinZoom: s, setMaxZoom: i, setTranslateExtent: l, setNodeExtent: c, reset: u, setDefaultNodesAndEdges: p } = Te(m_, Le), g = He();
  j.useEffect(() => (p(e.defaultNodes, e.defaultEdges), () => {
    m.current = dg, u();
  }), []);
  const m = j.useRef(dg);
  return j.useEffect(
    () => {
      for (const h of ug) {
        const w = e[h], C = m.current[h];
        w !== C && (typeof e[h] > "u" || (h === "nodes" ? n(w) : h === "edges" ? o(w) : h === "minZoom" ? s(w) : h === "maxZoom" ? i(w) : h === "translateExtent" ? l(w) : h === "nodeExtent" ? c(w) : h === "ariaLabelConfig" ? g.setState({ ariaLabelConfig: JC(w) }) : h === "fitView" ? g.setState({ fitViewQueued: w }) : h === "fitViewOptions" ? g.setState({ fitViewOptions: w }) : g.setState({ [h]: w })));
      }
      m.current = e;
    },
    // Only re-run the effect if one of the fields we track changes
    ug.map((h) => e[h])
  ), null;
}
function fg() {
  return typeof window > "u" || !window.matchMedia ? null : window.matchMedia("(prefers-color-scheme: dark)");
}
function y_(e) {
  var s;
  const [n, o] = j.useState(e === "system" ? null : e);
  return j.useEffect(() => {
    if (e !== "system") {
      o(e);
      return;
    }
    const i = fg(), l = () => o(i != null && i.matches ? "dark" : "light");
    return l(), i == null || i.addEventListener("change", l), () => {
      i == null || i.removeEventListener("change", l);
    };
  }, [e]), n !== null ? n : (s = fg()) != null && s.matches ? "dark" : "light";
}
const pg = typeof document < "u" ? document : null;
function Ma(e = null, n = { target: pg, actInsideInputWithModifier: !0 }) {
  const [o, s] = j.useState(!1), i = j.useRef(!1), l = j.useRef(/* @__PURE__ */ new Set([])), [c, u] = j.useMemo(() => {
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
  return j.useEffect(() => {
    const p = (n == null ? void 0 : n.target) ?? pg, g = (n == null ? void 0 : n.actInsideInputWithModifier) ?? !0;
    if (e !== null) {
      const m = (C) => {
        var b, _;
        if (i.current = C.ctrlKey || C.metaKey || C.shiftKey || C.altKey, (!i.current || i.current && !g) && Rm(C))
          return !1;
        const I = mg(C.code, u);
        if (l.current.add(C[I]), gg(c, l.current, !1)) {
          const k = ((_ = (b = C.composedPath) == null ? void 0 : b.call(C)) == null ? void 0 : _[0]) || C.target, A = (k == null ? void 0 : k.nodeName) === "BUTTON" || (k == null ? void 0 : k.nodeName) === "A";
          n.preventDefault !== !1 && (i.current || !A) && C.preventDefault(), s(!0);
        }
      }, h = (C) => {
        const x = mg(C.code, u);
        gg(c, l.current, !0) ? (s(!1), l.current.clear()) : l.current.delete(C[x]), C.key === "Meta" && l.current.clear(), i.current = !1;
      }, w = () => {
        l.current.clear(), s(!1);
      };
      return p == null || p.addEventListener("keydown", m), p == null || p.addEventListener("keyup", h), window.addEventListener("blur", w), window.addEventListener("contextmenu", w), () => {
        p == null || p.removeEventListener("keydown", m), p == null || p.removeEventListener("keyup", h), window.removeEventListener("blur", w), window.removeEventListener("contextmenu", w);
      };
    }
  }, [e, s]), o;
}
function gg(e, n, o) {
  return e.filter((s) => o || s.length === n.size).some((s) => s.every((i) => n.has(i)));
}
function mg(e, n) {
  return n.includes(e) ? "code" : "key";
}
const w_ = () => {
  const e = He();
  return j.useMemo(() => ({
    zoomIn: (n) => {
      const { panZoom: o } = e.getState();
      return o ? o.scaleBy(1.2, { duration: n == null ? void 0 : n.duration }) : Promise.resolve(!1);
    },
    zoomOut: (n) => {
      const { panZoom: o } = e.getState();
      return o ? o.scaleBy(1 / 1.2, { duration: n == null ? void 0 : n.duration }) : Promise.resolve(!1);
    },
    zoomTo: (n, o) => {
      const { panZoom: s } = e.getState();
      return s ? s.scaleTo(n, { duration: o == null ? void 0 : o.duration }) : Promise.resolve(!1);
    },
    getZoom: () => e.getState().transform[2],
    setViewport: async (n, o) => {
      const { transform: [s, i, l], panZoom: c } = e.getState();
      return c ? (await c.setViewport({
        x: n.x ?? s,
        y: n.y ?? i,
        zoom: n.zoom ?? l
      }, o), Promise.resolve(!0)) : Promise.resolve(!1);
    },
    getViewport: () => {
      const [n, o, s] = e.getState().transform;
      return { x: n, y: o, zoom: s };
    },
    setCenter: async (n, o, s) => e.getState().setCenter(n, o, s),
    fitBounds: async (n, o) => {
      const { width: s, height: i, minZoom: l, maxZoom: c, panZoom: u } = e.getState(), p = Tu(n, s, i, l, c, (o == null ? void 0 : o.padding) ?? 0.1);
      return u ? (await u.setViewport(p, {
        duration: o == null ? void 0 : o.duration,
        ease: o == null ? void 0 : o.ease,
        interpolate: o == null ? void 0 : o.interpolate
      }), Promise.resolve(!0)) : Promise.resolve(!1);
    },
    screenToFlowPosition: (n, o = {}) => {
      const { transform: s, snapGrid: i, snapToGrid: l, domNode: c } = e.getState();
      if (!c)
        return n;
      const { x: u, y: p } = c.getBoundingClientRect(), g = {
        x: n.x - u,
        y: n.y - p
      }, m = o.snapGrid ?? i, h = o.snapToGrid ?? l;
      return Pa(g, s, h, m);
    },
    flowToScreenPosition: (n) => {
      const { transform: o, domNode: s } = e.getState();
      if (!s)
        return n;
      const { x: i, y: l } = s.getBoundingClientRect(), c = ki(n, o);
      return {
        x: c.x + i,
        y: c.y + l
      };
    }
  }), []);
};
function Jm(e, n) {
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
  for (const l of n) {
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
      v_(p, u);
    o.push(u);
  }
  return i.length && i.forEach((l) => {
    l.index !== void 0 ? o.splice(l.index, 0, { ...l.item }) : o.push({ ...l.item });
  }), o;
}
function v_(e, n) {
  switch (e.type) {
    case "select": {
      n.selected = e.selected;
      break;
    }
    case "position": {
      typeof e.position < "u" && (n.position = e.position), typeof e.dragging < "u" && (n.dragging = e.dragging);
      break;
    }
    case "dimensions": {
      typeof e.dimensions < "u" && (n.measured = {
        ...e.dimensions
      }, e.setAttributes && ((e.setAttributes === !0 || e.setAttributes === "width") && (n.width = e.dimensions.width), (e.setAttributes === !0 || e.setAttributes === "height") && (n.height = e.dimensions.height))), typeof e.resizing == "boolean" && (n.resizing = e.resizing);
      break;
    }
  }
}
function Vu(e, n) {
  return Jm(e, n);
}
function zu(e, n) {
  return Jm(e, n);
}
function Cr(e, n) {
  return {
    id: e,
    type: "select",
    selected: n
  };
}
function lo(e, n = /* @__PURE__ */ new Set(), o = !1) {
  const s = [];
  for (const [i, l] of e) {
    const c = n.has(i);
    !(l.selected === void 0 && !c) && l.selected !== c && (o && (l.selected = c), s.push(Cr(l.id, c)));
  }
  return s;
}
function hg({ items: e = [], lookup: n }) {
  var i;
  const o = [], s = new Map(e.map((l) => [l.id, l]));
  for (const [l, c] of e.entries()) {
    const u = n.get(c.id), p = ((i = u == null ? void 0 : u.internals) == null ? void 0 : i.userNode) ?? u;
    p !== void 0 && p !== c && o.push({ id: c.id, item: c, type: "replace" }), p === void 0 && o.push({ item: c, type: "add", index: l });
  }
  for (const [l] of n)
    s.get(l) === void 0 && o.push({ id: l, type: "remove" });
  return o;
}
function yg(e) {
  return {
    id: e.id,
    type: "remove"
  };
}
const wg = (e) => LC(e), x_ = (e) => bm(e);
function qm(e) {
  return j.forwardRef(e);
}
const I_ = typeof window < "u" ? j.useLayoutEffect : j.useEffect;
function vg(e) {
  const [n, o] = j.useState(BigInt(0)), [s] = j.useState(() => C_(() => o((i) => i + BigInt(1))));
  return I_(() => {
    const i = s.get();
    i.length && (e(i), s.reset());
  }, [n]), s;
}
function C_(e) {
  let n = [];
  return {
    get: () => n,
    reset: () => {
      n = [];
    },
    push: (o) => {
      n.push(o), e();
    }
  };
}
const eh = j.createContext(null);
function b_({ children: e }) {
  const n = He(), o = j.useCallback((u) => {
    const { nodes: p = [], setNodes: g, hasDefaultNodes: m, onNodesChange: h, nodeLookup: w, fitViewQueued: C, onNodesChangeMiddlewareMap: x } = n.getState();
    let I = p;
    for (const _ of u)
      I = typeof _ == "function" ? _(I) : _;
    let b = hg({
      items: I,
      lookup: w
    });
    for (const _ of x.values())
      b = _(b);
    m && g(I), b.length > 0 ? h == null || h(b) : C && window.requestAnimationFrame(() => {
      const { fitViewQueued: _, nodes: k, setNodes: A } = n.getState();
      _ && A(k);
    });
  }, []), s = vg(o), i = j.useCallback((u) => {
    const { edges: p = [], setEdges: g, hasDefaultEdges: m, onEdgesChange: h, edgeLookup: w } = n.getState();
    let C = p;
    for (const x of u)
      C = typeof x == "function" ? x(C) : x;
    m ? g(C) : h && h(hg({
      items: C,
      lookup: w
    }));
  }, []), l = vg(i), c = j.useMemo(() => ({ nodeQueue: s, edgeQueue: l }), []);
  return d.jsx(eh.Provider, { value: c, children: e });
}
function __() {
  const e = j.useContext(eh);
  if (!e)
    throw new Error("useBatchContext must be used within a BatchProvider");
  return e;
}
const N_ = (e) => !!e.panZoom;
function Ou() {
  const e = w_(), n = He(), o = __(), s = Te(N_), i = j.useMemo(() => {
    const l = (h) => n.getState().nodeLookup.get(h), c = (h) => {
      o.nodeQueue.push(h);
    }, u = (h) => {
      o.edgeQueue.push(h);
    }, p = (h) => {
      var _, k;
      const { nodeLookup: w, nodeOrigin: C } = n.getState(), x = wg(h) ? h : w.get(h.id), I = x.parentId ? jm(x.position, x.measured, x.parentId, w, C) : x.position, b = {
        ...x,
        position: I,
        width: ((_ = x.measured) == null ? void 0 : _.width) ?? x.width,
        height: ((k = x.measured) == null ? void 0 : k.height) ?? x.height
      };
      return yo(b);
    }, g = (h, w, C = { replace: !1 }) => {
      c((x) => x.map((I) => {
        if (I.id === h) {
          const b = typeof w == "function" ? w(I) : w;
          return C.replace && wg(b) ? b : { ...I, ...b };
        }
        return I;
      }));
    }, m = (h, w, C = { replace: !1 }) => {
      u((x) => x.map((I) => {
        if (I.id === h) {
          const b = typeof w == "function" ? w(I) : w;
          return C.replace && x_(b) ? b : { ...I, ...b };
        }
        return I;
      }));
    };
    return {
      getNodes: () => n.getState().nodes.map((h) => ({ ...h })),
      getNode: (h) => {
        var w;
        return (w = l(h)) == null ? void 0 : w.internals.userNode;
      },
      getInternalNode: l,
      getEdges: () => {
        const { edges: h = [] } = n.getState();
        return h.map((w) => ({ ...w }));
      },
      getEdge: (h) => n.getState().edgeLookup.get(h),
      setNodes: c,
      setEdges: u,
      addNodes: (h) => {
        const w = Array.isArray(h) ? h : [h];
        o.nodeQueue.push((C) => [...C, ...w]);
      },
      addEdges: (h) => {
        const w = Array.isArray(h) ? h : [h];
        o.edgeQueue.push((C) => [...C, ...w]);
      },
      toObject: () => {
        const { nodes: h = [], edges: w = [], transform: C } = n.getState(), [x, I, b] = C;
        return {
          nodes: h.map((_) => ({ ..._ })),
          edges: w.map((_) => ({ ..._ })),
          viewport: {
            x,
            y: I,
            zoom: b
          }
        };
      },
      deleteElements: async ({ nodes: h = [], edges: w = [] }) => {
        const { nodes: C, edges: x, onNodesDelete: I, onEdgesDelete: b, triggerNodeChanges: _, triggerEdgeChanges: k, onDelete: A, onBeforeDelete: S } = n.getState(), { nodes: V, edges: G } = await ZC({
          nodesToRemove: h,
          edgesToRemove: w,
          nodes: C,
          edges: x,
          onBeforeDelete: S
        }), T = G.length > 0, K = V.length > 0;
        if (T) {
          const D = G.map(yg);
          b == null || b(G), k(D);
        }
        if (K) {
          const D = V.map(yg);
          I == null || I(V), _(D);
        }
        return (K || T) && (A == null || A({ nodes: V, edges: G })), { deletedNodes: V, deletedEdges: G };
      },
      /**
       * Partial is defined as "the 2 nodes/areas are intersecting partially".
       * If a is contained in b or b is contained in a, they are both
       * considered fully intersecting.
       */
      getIntersectingNodes: (h, w = !0, C) => {
        const x = Wp(h), I = x ? h : p(h), b = C !== void 0;
        return I ? (C || n.getState().nodes).filter((_) => {
          const k = n.getState().nodeLookup.get(_.id);
          if (k && !x && (_.id === h.id || !k.internals.positionAbsolute))
            return !1;
          const A = yo(b ? _ : k), S = ka(A, I);
          return w && S > 0 || S >= A.width * A.height || S >= I.width * I.height;
        }) : [];
      },
      isNodeIntersecting: (h, w, C = !0) => {
        const I = Wp(h) ? h : p(h);
        if (!I)
          return !1;
        const b = ka(I, w);
        return C && b > 0 || b >= w.width * w.height || b >= I.width * I.height;
      },
      updateNode: g,
      updateNodeData: (h, w, C = { replace: !1 }) => {
        g(h, (x) => {
          const I = typeof w == "function" ? w(x) : w;
          return C.replace ? { ...x, data: I } : { ...x, data: { ...x.data, ...I } };
        }, C);
      },
      updateEdge: m,
      updateEdgeData: (h, w, C = { replace: !1 }) => {
        m(h, (x) => {
          const I = typeof w == "function" ? w(x) : w;
          return C.replace ? { ...x, data: I } : { ...x, data: { ...x.data, ...I } };
        }, C);
      },
      getNodesBounds: (h) => {
        const { nodeLookup: w, nodeOrigin: C } = n.getState();
        return HC(h, { nodeLookup: w, nodeOrigin: C });
      },
      getHandleConnections: ({ type: h, id: w, nodeId: C }) => {
        var x;
        return Array.from(((x = n.getState().connectionLookup.get(`${C}-${h}${w ? `-${w}` : ""}`)) == null ? void 0 : x.values()) ?? []);
      },
      getNodeConnections: ({ type: h, handleId: w, nodeId: C }) => {
        var x;
        return Array.from(((x = n.getState().connectionLookup.get(`${C}${h ? w ? `-${h}-${w}` : `-${h}` : ""}`)) == null ? void 0 : x.values()) ?? []);
      },
      fitView: async (h) => {
        const w = n.getState().fitViewResolver ?? QC();
        return n.setState({ fitViewQueued: !0, fitViewOptions: h, fitViewResolver: w }), o.nodeQueue.push((C) => [...C]), w.promise;
      }
    };
  }, []);
  return j.useMemo(() => ({
    ...i,
    ...e,
    viewportInitialized: s
  }), [s]);
}
const xg = (e) => e.selected, A_ = typeof window < "u" ? window : void 0;
function S_({ deleteKeyCode: e, multiSelectionKeyCode: n }) {
  const o = He(), { deleteElements: s } = Ou(), i = Ma(e, { actInsideInputWithModifier: !1 }), l = Ma(n, { target: A_ });
  j.useEffect(() => {
    if (i) {
      const { edges: c, nodes: u } = o.getState();
      s({ nodes: u.filter(xg), edges: c.filter(xg) }), o.setState({ nodesSelectionActive: !1 });
    }
  }, [i]), j.useEffect(() => {
    o.setState({ multiSelectionActive: l });
  }, [l]);
}
function k_(e) {
  const n = He();
  j.useEffect(() => {
    const o = () => {
      var i, l, c, u;
      if (!e.current || !(((l = (i = e.current).checkVisibility) == null ? void 0 : l.call(i)) ?? !0))
        return !1;
      const s = Bu(e.current);
      (s.height === 0 || s.width === 0) && ((u = (c = n.getState()).onError) == null || u.call(c, "004", ln.error004())), n.setState({ width: s.width || 500, height: s.height || 500 });
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
const Li = {
  position: "absolute",
  width: "100%",
  height: "100%",
  top: 0,
  left: 0
}, j_ = (e) => ({
  userSelectionActive: e.userSelectionActive,
  lib: e.lib,
  connectionInProgress: e.connection.inProgress
});
function M_({ onPaneContextMenu: e, zoomOnScroll: n = !0, zoomOnPinch: o = !0, panOnScroll: s = !1, panOnScrollSpeed: i = 0.5, panOnScrollMode: l = Nr.Free, zoomOnDoubleClick: c = !0, panOnDrag: u = !0, defaultViewport: p, translateExtent: g, minZoom: m, maxZoom: h, zoomActivationKeyCode: w, preventScrolling: C = !0, children: x, noWheelClassName: I, noPanClassName: b, onViewportChange: _, isControlledViewport: k, paneClickDistance: A, selectionOnDrag: S }) {
  const V = He(), G = j.useRef(null), { userSelectionActive: T, lib: K, connectionInProgress: D } = Te(j_, Le), F = Ma(w), z = j.useRef();
  k_(G);
  const W = j.useCallback((q) => {
    _ == null || _({ x: q[0], y: q[1], zoom: q[2] }), k || V.setState({ transform: q });
  }, [_, k]);
  return j.useEffect(() => {
    if (G.current) {
      z.current = Eb({
        domNode: G.current,
        minZoom: m,
        maxZoom: h,
        translateExtent: g,
        viewport: p,
        onDraggingChange: (H) => V.setState({ paneDragging: H }),
        onPanZoomStart: (H, U) => {
          const { onViewportChangeStart: E, onMoveStart: P } = V.getState();
          P == null || P(H, U), E == null || E(U);
        },
        onPanZoom: (H, U) => {
          const { onViewportChange: E, onMove: P } = V.getState();
          P == null || P(H, U), E == null || E(U);
        },
        onPanZoomEnd: (H, U) => {
          const { onViewportChangeEnd: E, onMoveEnd: P } = V.getState();
          P == null || P(H, U), E == null || E(U);
        }
      });
      const { x: q, y: R, zoom: Y } = z.current.getViewport();
      return V.setState({
        panZoom: z.current,
        transform: [q, R, Y],
        domNode: G.current.closest(".react-flow")
      }), () => {
        var H;
        (H = z.current) == null || H.destroy();
      };
    }
  }, []), j.useEffect(() => {
    var q;
    (q = z.current) == null || q.update({
      onPaneContextMenu: e,
      zoomOnScroll: n,
      zoomOnPinch: o,
      panOnScroll: s,
      panOnScrollSpeed: i,
      panOnScrollMode: l,
      zoomOnDoubleClick: c,
      panOnDrag: u,
      zoomActivationKeyPressed: F,
      preventScrolling: C,
      noPanClassName: b,
      userSelectionActive: T,
      noWheelClassName: I,
      lib: K,
      onTransformChange: W,
      connectionInProgress: D,
      selectionOnDrag: S,
      paneClickDistance: A
    });
  }, [
    e,
    n,
    o,
    s,
    i,
    l,
    c,
    u,
    F,
    C,
    b,
    T,
    I,
    K,
    W,
    D,
    S,
    A
  ]), d.jsx("div", { className: "react-flow__renderer", ref: G, style: Li, children: x });
}
const R_ = (e) => ({
  userSelectionActive: e.userSelectionActive,
  userSelectionRect: e.userSelectionRect
});
function T_() {
  const { userSelectionActive: e, userSelectionRect: n } = Te(R_, Le);
  return e && n ? d.jsx("div", { className: "react-flow__selection react-flow__container", style: {
    width: n.width,
    height: n.height,
    transform: `translate(${n.x}px, ${n.y}px)`
  } }) : null;
}
const Jc = (e, n) => (o) => {
  o.target === n.current && (e == null || e(o));
}, B_ = (e) => ({
  userSelectionActive: e.userSelectionActive,
  elementsSelectable: e.elementsSelectable,
  connectionInProgress: e.connection.inProgress,
  dragging: e.paneDragging
});
function E_({ isSelecting: e, selectionKeyPressed: n, selectionMode: o = Sa.Full, panOnDrag: s, paneClickDistance: i, selectionOnDrag: l, onSelectionStart: c, onSelectionEnd: u, onPaneClick: p, onPaneContextMenu: g, onPaneScroll: m, onPaneMouseEnter: h, onPaneMouseMove: w, onPaneMouseLeave: C, children: x }) {
  const I = He(), { userSelectionActive: b, elementsSelectable: _, dragging: k, connectionInProgress: A } = Te(B_, Le), S = _ && (e || b), V = j.useRef(null), G = j.useRef(), T = j.useRef(/* @__PURE__ */ new Set()), K = j.useRef(/* @__PURE__ */ new Set()), D = j.useRef(!1), F = (E) => {
    if (D.current || A) {
      D.current = !1;
      return;
    }
    p == null || p(E), I.getState().resetSelectedElements(), I.setState({ nodesSelectionActive: !1 });
  }, z = (E) => {
    if (Array.isArray(s) && (s != null && s.includes(2))) {
      E.preventDefault();
      return;
    }
    g == null || g(E);
  }, W = m ? (E) => m(E) : void 0, q = (E) => {
    D.current && (E.stopPropagation(), D.current = !1);
  }, R = (E) => {
    var le, ue;
    const { domNode: P } = I.getState();
    if (G.current = P == null ? void 0 : P.getBoundingClientRect(), !G.current)
      return;
    const Z = E.target === V.current;
    if (!Z && !!E.target.closest(".nokey") || !e || !(l && Z || n) || E.button !== 0 || !E.isPrimary)
      return;
    (ue = (le = E.target) == null ? void 0 : le.setPointerCapture) == null || ue.call(le, E.pointerId), D.current = !1;
    const { x: te, y: re } = Yt(E.nativeEvent, G.current);
    I.setState({
      userSelectionRect: {
        width: 0,
        height: 0,
        startX: te,
        startY: re,
        x: te,
        y: re
      }
    }), Z || (E.stopPropagation(), E.preventDefault());
  }, Y = (E) => {
    const { userSelectionRect: P, transform: Z, nodeLookup: M, edgeLookup: L, connectionLookup: te, triggerNodeChanges: re, triggerEdgeChanges: le, defaultEdgeOptions: ue, resetSelectedElements: fe } = I.getState();
    if (!G.current || !P)
      return;
    const { x: ne, y: pe } = Yt(E.nativeEvent, G.current), { startX: be, startY: _e } = P;
    if (!D.current) {
      const je = n ? 0 : i;
      if (Math.hypot(ne - be, pe - _e) <= je)
        return;
      fe(), c == null || c(E);
    }
    D.current = !0;
    const Ce = {
      startX: be,
      startY: _e,
      x: ne < be ? ne : be,
      y: pe < _e ? pe : _e,
      width: Math.abs(ne - be),
      height: Math.abs(pe - _e)
    }, xe = T.current, Re = K.current;
    T.current = new Set(Ru(M, Ce, Z, o === Sa.Partial, !0).map((je) => je.id)), K.current = /* @__PURE__ */ new Set();
    const Be = (ue == null ? void 0 : ue.selectable) ?? !0;
    for (const je of T.current) {
      const We = te.get(je);
      if (We)
        for (const { edgeId: Ft } of We.values()) {
          const xt = L.get(Ft);
          xt && (xt.selectable ?? Be) && K.current.add(Ft);
        }
    }
    if (!Xp(xe, T.current)) {
      const je = lo(M, T.current, !0);
      re(je);
    }
    if (!Xp(Re, K.current)) {
      const je = lo(L, K.current);
      le(je);
    }
    I.setState({
      userSelectionRect: Ce,
      userSelectionActive: !0,
      nodesSelectionActive: !1
    });
  }, H = (E) => {
    var P, Z;
    E.button === 0 && ((Z = (P = E.target) == null ? void 0 : P.releasePointerCapture) == null || Z.call(P, E.pointerId), !b && E.target === V.current && I.getState().userSelectionRect && (F == null || F(E)), I.setState({
      userSelectionActive: !1,
      userSelectionRect: null
    }), D.current && (u == null || u(E), I.setState({
      nodesSelectionActive: T.current.size > 0
    })));
  }, U = s === !0 || Array.isArray(s) && s.includes(0);
  return d.jsxs("div", { className: Qe(["react-flow__pane", { draggable: U, dragging: k, selection: e }]), onClick: S ? void 0 : Jc(F, V), onContextMenu: Jc(z, V), onWheel: Jc(W, V), onPointerEnter: S ? void 0 : h, onPointerMove: S ? Y : w, onPointerUp: S ? H : void 0, onPointerDownCapture: S ? R : void 0, onClickCapture: S ? q : void 0, onPointerLeave: C, ref: V, style: Li, children: [x, d.jsx(T_, {})] });
}
function wu({ id: e, store: n, unselect: o = !1, nodeRef: s }) {
  const { addSelectedNodes: i, unselectNodesAndEdges: l, multiSelectionActive: c, nodeLookup: u, onError: p } = n.getState(), g = u.get(e);
  if (!g) {
    p == null || p("012", ln.error012(e));
    return;
  }
  n.setState({ nodesSelectionActive: !1 }), g.selected ? (o || g.selected && c) && (l({ nodes: [g], edges: [] }), requestAnimationFrame(() => {
    var m;
    return (m = s == null ? void 0 : s.current) == null ? void 0 : m.blur();
  })) : i([e]);
}
function th({ nodeRef: e, disabled: n = !1, noDragClassName: o, handleSelector: s, nodeId: i, isSelectable: l, nodeClickDistance: c }) {
  const u = He(), [p, g] = j.useState(!1), m = j.useRef();
  return j.useEffect(() => {
    m.current = xb({
      getStoreItems: () => u.getState(),
      onNodeMouseDown: (h) => {
        wu({
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
  }, []), j.useEffect(() => {
    var h, w;
    if (n)
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
        var C;
        (C = m.current) == null || C.destroy();
      };
  }, [o, s, n, l, e, i]), p;
}
const D_ = (e) => (n) => n.selected && (n.draggable || e && typeof n.draggable > "u");
function nh() {
  const e = He();
  return j.useCallback((o) => {
    const { nodeExtent: s, snapToGrid: i, snapGrid: l, nodesDraggable: c, onError: u, updateNodePositions: p, nodeLookup: g, nodeOrigin: m } = e.getState(), h = /* @__PURE__ */ new Map(), w = D_(c), C = i ? l[0] : 5, x = i ? l[1] : 5, I = o.direction.x * C * o.factor, b = o.direction.y * x * o.factor;
    for (const [, _] of g) {
      if (!w(_))
        continue;
      let k = {
        x: _.internals.positionAbsolute.x + I,
        y: _.internals.positionAbsolute.y + b
      };
      i && (k = Ga(k, l));
      const { position: A, positionAbsolute: S } = _m({
        nodeId: _.id,
        nextPosition: k,
        nodeLookup: g,
        nodeExtent: s,
        nodeOrigin: m,
        onError: u
      });
      _.position = A, _.internals.positionAbsolute = S, h.set(_.id, _);
    }
    p(h);
  }, []);
}
const Lu = j.createContext(null), G_ = Lu.Provider;
Lu.Consumer;
const rh = () => j.useContext(Lu), P_ = (e) => ({
  connectOnClick: e.connectOnClick,
  noPanClassName: e.noPanClassName,
  rfId: e.rfId
}), F_ = (e, n, o) => (s) => {
  const { connectionClickStartHandle: i, connectionMode: l, connection: c } = s, { fromHandle: u, toHandle: p, isValid: g } = c, m = (p == null ? void 0 : p.nodeId) === e && (p == null ? void 0 : p.id) === n && (p == null ? void 0 : p.type) === o;
  return {
    connectingFrom: (u == null ? void 0 : u.nodeId) === e && (u == null ? void 0 : u.id) === n && (u == null ? void 0 : u.type) === o,
    connectingTo: m,
    clickConnecting: (i == null ? void 0 : i.nodeId) === e && (i == null ? void 0 : i.id) === n && (i == null ? void 0 : i.type) === o,
    isPossibleEndHandle: l === mo.Strict ? (u == null ? void 0 : u.type) !== o : e !== (u == null ? void 0 : u.nodeId) || n !== (u == null ? void 0 : u.id),
    connectionInProcess: !!u,
    clickConnectionInProcess: !!i,
    valid: m && g
  };
};
function V_({ type: e = "source", position: n = Q.Top, isValidConnection: o, isConnectable: s = !0, isConnectableStart: i = !0, isConnectableEnd: l = !0, id: c, onConnect: u, children: p, className: g, onMouseDown: m, onTouchStart: h, ...w }, C) {
  var Y, H;
  const x = c || null, I = e === "target", b = He(), _ = rh(), { connectOnClick: k, noPanClassName: A, rfId: S } = Te(P_, Le), { connectingFrom: V, connectingTo: G, clickConnecting: T, isPossibleEndHandle: K, connectionInProcess: D, clickConnectionInProcess: F, valid: z } = Te(F_(_, x, e), Le);
  _ || (H = (Y = b.getState()).onError) == null || H.call(Y, "010", ln.error010());
  const W = (U) => {
    const { defaultEdgeOptions: E, onConnect: P, hasDefaultEdges: Z } = b.getState(), M = {
      ...E,
      ...U
    };
    if (Z) {
      const { edges: L, setEdges: te } = b.getState();
      te(ob(M, L));
    }
    P == null || P(M), u == null || u(M);
  }, q = (U) => {
    if (!_)
      return;
    const E = Tm(U.nativeEvent);
    if (i && (E && U.button === 0 || !E)) {
      const P = b.getState();
      yu.onPointerDown(U.nativeEvent, {
        handleDomNode: U.currentTarget,
        autoPanOnConnect: P.autoPanOnConnect,
        connectionMode: P.connectionMode,
        connectionRadius: P.connectionRadius,
        domNode: P.domNode,
        nodeLookup: P.nodeLookup,
        lib: P.lib,
        isTarget: I,
        handleId: x,
        nodeId: _,
        flowId: P.rfId,
        panBy: P.panBy,
        cancelConnection: P.cancelConnection,
        onConnectStart: P.onConnectStart,
        onConnectEnd: P.onConnectEnd,
        updateConnection: P.updateConnection,
        onConnect: W,
        isValidConnection: o || P.isValidConnection,
        getTransform: () => b.getState().transform,
        getFromHandle: () => b.getState().connection.fromHandle,
        autoPanSpeed: P.autoPanSpeed,
        dragThreshold: P.connectionDragThreshold
      });
    }
    E ? m == null || m(U) : h == null || h(U);
  }, R = (U) => {
    const { onClickConnectStart: E, onClickConnectEnd: P, connectionClickStartHandle: Z, connectionMode: M, isValidConnection: L, lib: te, rfId: re, nodeLookup: le, connection: ue } = b.getState();
    if (!_ || !Z && !i)
      return;
    if (!Z) {
      E == null || E(U.nativeEvent, { nodeId: _, handleId: x, handleType: e }), b.setState({ connectionClickStartHandle: { nodeId: _, type: e, id: x } });
      return;
    }
    const fe = Mm(U.target), ne = o || L, { connection: pe, isValid: be } = yu.isValid(U.nativeEvent, {
      handle: {
        nodeId: _,
        id: x,
        type: e
      },
      connectionMode: M,
      fromNodeId: Z.nodeId,
      fromHandleId: Z.id || null,
      fromType: Z.type,
      isValidConnection: ne,
      flowId: re,
      doc: fe,
      lib: te,
      nodeLookup: le
    });
    be && pe && W(pe);
    const _e = structuredClone(ue);
    delete _e.inProgress, _e.toPosition = _e.toHandle ? _e.toHandle.position : null, P == null || P(U, _e), b.setState({ connectionClickStartHandle: null });
  };
  return d.jsx("div", { "data-handleid": x, "data-nodeid": _, "data-handlepos": n, "data-id": `${S}-${_}-${x}-${e}`, className: Qe([
    "react-flow__handle",
    `react-flow__handle-${n}`,
    "nodrag",
    A,
    g,
    {
      source: !I,
      target: I,
      connectable: s,
      connectablestart: i,
      connectableend: l,
      clickconnecting: T,
      connectingfrom: V,
      connectingto: G,
      valid: z,
      /*
       * shows where you can start a connection from
       * and where you can end it while connecting
       */
      connectionindicator: s && (!D || K) && (D || F ? l : i)
    }
  ]), onMouseDown: q, onTouchStart: q, onClick: k ? R : void 0, ref: C, ...w, children: p });
}
const oe = j.memo(qm(V_));
function z_({ data: e, isConnectable: n, sourcePosition: o = Q.Bottom }) {
  return d.jsxs(d.Fragment, { children: [e == null ? void 0 : e.label, d.jsx(oe, { type: "source", position: o, isConnectable: n })] });
}
function O_({ data: e, isConnectable: n, targetPosition: o = Q.Top, sourcePosition: s = Q.Bottom }) {
  return d.jsxs(d.Fragment, { children: [d.jsx(oe, { type: "target", position: o, isConnectable: n }), e == null ? void 0 : e.label, d.jsx(oe, { type: "source", position: s, isConnectable: n })] });
}
function L_() {
  return null;
}
function H_({ data: e, isConnectable: n, targetPosition: o = Q.Top }) {
  return d.jsxs(d.Fragment, { children: [d.jsx(oe, { type: "target", position: o, isConnectable: n }), e == null ? void 0 : e.label] });
}
const ji = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 }
}, Ig = {
  input: z_,
  default: O_,
  output: H_,
  group: L_
};
function W_(e) {
  var n, o, s, i;
  return e.internals.handleBounds === void 0 ? {
    width: e.width ?? e.initialWidth ?? ((n = e.style) == null ? void 0 : n.width),
    height: e.height ?? e.initialHeight ?? ((o = e.style) == null ? void 0 : o.height)
  } : {
    width: e.width ?? ((s = e.style) == null ? void 0 : s.width),
    height: e.height ?? ((i = e.style) == null ? void 0 : i.height)
  };
}
const X_ = (e) => {
  const { width: n, height: o, x: s, y: i } = Da(e.nodeLookup, {
    filter: (l) => !!l.selected
  });
  return {
    width: Zt(n) ? n : null,
    height: Zt(o) ? o : null,
    userSelectionActive: e.userSelectionActive,
    transformString: `translate(${e.transform[0]}px,${e.transform[1]}px) scale(${e.transform[2]}) translate(${s}px,${i}px)`
  };
};
function K_({ onSelectionContextMenu: e, noPanClassName: n, disableKeyboardA11y: o }) {
  const s = He(), { width: i, height: l, transformString: c, userSelectionActive: u } = Te(X_, Le), p = nh(), g = j.useRef(null);
  if (j.useEffect(() => {
    var w;
    o || (w = g.current) == null || w.focus({
      preventScroll: !0
    });
  }, [o]), th({
    nodeRef: g
  }), u || !i || !l)
    return null;
  const m = e ? (w) => {
    const C = s.getState().nodes.filter((x) => x.selected);
    e(w, C);
  } : void 0, h = (w) => {
    Object.prototype.hasOwnProperty.call(ji, w.key) && (w.preventDefault(), p({
      direction: ji[w.key],
      factor: w.shiftKey ? 4 : 1
    }));
  };
  return d.jsx("div", { className: Qe(["react-flow__nodesselection", "react-flow__container", n]), style: {
    transform: c
  }, children: d.jsx("div", { ref: g, className: "react-flow__nodesselection-rect", onContextMenu: m, tabIndex: o ? void 0 : -1, onKeyDown: o ? void 0 : h, style: {
    width: i,
    height: l
  } }) });
}
const Cg = typeof window < "u" ? window : void 0, Z_ = (e) => ({ nodesSelectionActive: e.nodesSelectionActive, userSelectionActive: e.userSelectionActive });
function oh({ children: e, onPaneClick: n, onPaneMouseEnter: o, onPaneMouseMove: s, onPaneMouseLeave: i, onPaneContextMenu: l, onPaneScroll: c, paneClickDistance: u, deleteKeyCode: p, selectionKeyCode: g, selectionOnDrag: m, selectionMode: h, onSelectionStart: w, onSelectionEnd: C, multiSelectionKeyCode: x, panActivationKeyCode: I, zoomActivationKeyCode: b, elementsSelectable: _, zoomOnScroll: k, zoomOnPinch: A, panOnScroll: S, panOnScrollSpeed: V, panOnScrollMode: G, zoomOnDoubleClick: T, panOnDrag: K, defaultViewport: D, translateExtent: F, minZoom: z, maxZoom: W, preventScrolling: q, onSelectionContextMenu: R, noWheelClassName: Y, noPanClassName: H, disableKeyboardA11y: U, onViewportChange: E, isControlledViewport: P }) {
  const { nodesSelectionActive: Z, userSelectionActive: M } = Te(Z_, Le), L = Ma(g, { target: Cg }), te = Ma(I, { target: Cg }), re = te || K, le = te || S, ue = m && re !== !0, fe = L || M || ue;
  return S_({ deleteKeyCode: p, multiSelectionKeyCode: x }), d.jsx(M_, { onPaneContextMenu: l, elementsSelectable: _, zoomOnScroll: k, zoomOnPinch: A, panOnScroll: le, panOnScrollSpeed: V, panOnScrollMode: G, zoomOnDoubleClick: T, panOnDrag: !L && re, defaultViewport: D, translateExtent: F, minZoom: z, maxZoom: W, zoomActivationKeyCode: b, preventScrolling: q, noWheelClassName: Y, noPanClassName: H, onViewportChange: E, isControlledViewport: P, paneClickDistance: u, selectionOnDrag: ue, children: d.jsxs(E_, { onSelectionStart: w, onSelectionEnd: C, onPaneClick: n, onPaneMouseEnter: o, onPaneMouseMove: s, onPaneMouseLeave: i, onPaneContextMenu: l, onPaneScroll: c, panOnDrag: re, isSelecting: !!fe, selectionMode: h, selectionKeyPressed: L, paneClickDistance: u, selectionOnDrag: ue, children: [e, Z && d.jsx(K_, { onSelectionContextMenu: R, noPanClassName: H, disableKeyboardA11y: U })] }) });
}
oh.displayName = "FlowRenderer";
const Y_ = j.memo(oh), U_ = (e) => (n) => e ? Ru(n.nodeLookup, { x: 0, y: 0, width: n.width, height: n.height }, n.transform, !0).map((o) => o.id) : Array.from(n.nodeLookup.keys());
function $_(e) {
  return Te(j.useCallback(U_(e), [e]), Le);
}
const Q_ = (e) => e.updateNodeInternals;
function J_() {
  const e = Te(Q_), [n] = j.useState(() => typeof ResizeObserver > "u" ? null : new ResizeObserver((o) => {
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
  return j.useEffect(() => () => {
    n == null || n.disconnect();
  }, [n]), n;
}
function q_({ node: e, nodeType: n, hasDimensions: o, resizeObserver: s }) {
  const i = He(), l = j.useRef(null), c = j.useRef(null), u = j.useRef(e.sourcePosition), p = j.useRef(e.targetPosition), g = j.useRef(n), m = o && !!e.internals.handleBounds;
  return j.useEffect(() => {
    l.current && !e.hidden && (!m || c.current !== l.current) && (c.current && (s == null || s.unobserve(c.current)), s == null || s.observe(l.current), c.current = l.current);
  }, [m, e.hidden]), j.useEffect(() => () => {
    c.current && (s == null || s.unobserve(c.current), c.current = null);
  }, []), j.useEffect(() => {
    if (l.current) {
      const h = g.current !== n, w = u.current !== e.sourcePosition, C = p.current !== e.targetPosition;
      (h || w || C) && (g.current = n, u.current = e.sourcePosition, p.current = e.targetPosition, i.getState().updateNodeInternals(/* @__PURE__ */ new Map([[e.id, { id: e.id, nodeElement: l.current, force: !0 }]])));
    }
  }, [e.id, n, e.sourcePosition, e.targetPosition]), l;
}
function eN({ id: e, onClick: n, onMouseEnter: o, onMouseMove: s, onMouseLeave: i, onContextMenu: l, onDoubleClick: c, nodesDraggable: u, elementsSelectable: p, nodesConnectable: g, nodesFocusable: m, resizeObserver: h, noDragClassName: w, noPanClassName: C, disableKeyboardA11y: x, rfId: I, nodeTypes: b, nodeClickDistance: _, onError: k }) {
  const { node: A, internals: S, isParent: V } = Te((ne) => {
    const pe = ne.nodeLookup.get(e), be = ne.parentLookup.has(e);
    return {
      node: pe,
      internals: pe.internals,
      isParent: be
    };
  }, Le);
  let G = A.type || "default", T = (b == null ? void 0 : b[G]) || Ig[G];
  T === void 0 && (k == null || k("003", ln.error003(G)), G = "default", T = (b == null ? void 0 : b.default) || Ig.default);
  const K = !!(A.draggable || u && typeof A.draggable > "u"), D = !!(A.selectable || p && typeof A.selectable > "u"), F = !!(A.connectable || g && typeof A.connectable > "u"), z = !!(A.focusable || m && typeof A.focusable > "u"), W = He(), q = km(A), R = q_({ node: A, nodeType: G, hasDimensions: q, resizeObserver: h }), Y = th({
    nodeRef: R,
    disabled: A.hidden || !K,
    noDragClassName: w,
    handleSelector: A.dragHandle,
    nodeId: e,
    isSelectable: D,
    nodeClickDistance: _
  }), H = nh();
  if (A.hidden)
    return null;
  const U = kn(A), E = W_(A), P = D || K || n || o || s || i, Z = o ? (ne) => o(ne, { ...S.userNode }) : void 0, M = s ? (ne) => s(ne, { ...S.userNode }) : void 0, L = i ? (ne) => i(ne, { ...S.userNode }) : void 0, te = l ? (ne) => l(ne, { ...S.userNode }) : void 0, re = c ? (ne) => c(ne, { ...S.userNode }) : void 0, le = (ne) => {
    const { selectNodesOnDrag: pe, nodeDragThreshold: be } = W.getState();
    D && (!pe || !K || be > 0) && wu({
      id: e,
      store: W,
      nodeRef: R
    }), n && n(ne, { ...S.userNode });
  }, ue = (ne) => {
    if (!(Rm(ne.nativeEvent) || x)) {
      if (vm.includes(ne.key) && D) {
        const pe = ne.key === "Escape";
        wu({
          id: e,
          store: W,
          unselect: pe,
          nodeRef: R
        });
      } else if (K && A.selected && Object.prototype.hasOwnProperty.call(ji, ne.key)) {
        ne.preventDefault();
        const { ariaLabelConfig: pe } = W.getState();
        W.setState({
          ariaLiveMessage: pe["node.a11yDescription.ariaLiveMessage"]({
            direction: ne.key.replace("Arrow", "").toLowerCase(),
            x: ~~S.positionAbsolute.x,
            y: ~~S.positionAbsolute.y
          })
        }), H({
          direction: ji[ne.key],
          factor: ne.shiftKey ? 4 : 1
        });
      }
    }
  }, fe = () => {
    var Re;
    if (x || !((Re = R.current) != null && Re.matches(":focus-visible")))
      return;
    const { transform: ne, width: pe, height: be, autoPanOnNodeFocus: _e, setCenter: Ce } = W.getState();
    if (!_e)
      return;
    Ru(/* @__PURE__ */ new Map([[e, A]]), { x: 0, y: 0, width: pe, height: be }, ne, !0).length > 0 || Ce(A.position.x + U.width / 2, A.position.y + U.height / 2, {
      zoom: ne[2]
    });
  };
  return d.jsx("div", { className: Qe([
    "react-flow__node",
    `react-flow__node-${G}`,
    {
      // this is overwritable by passing `nopan` as a class name
      [C]: K
    },
    A.className,
    {
      selected: A.selected,
      selectable: D,
      parent: V,
      draggable: K,
      dragging: Y
    }
  ]), ref: R, style: {
    zIndex: S.z,
    transform: `translate(${S.positionAbsolute.x}px,${S.positionAbsolute.y}px)`,
    pointerEvents: P ? "all" : "none",
    visibility: q ? "visible" : "hidden",
    ...A.style,
    ...E
  }, "data-id": e, "data-testid": `rf__node-${e}`, onMouseEnter: Z, onMouseMove: M, onMouseLeave: L, onContextMenu: te, onClick: le, onDoubleClick: re, onKeyDown: z ? ue : void 0, tabIndex: z ? 0 : void 0, onFocus: z ? fe : void 0, role: A.ariaRole ?? (z ? "group" : void 0), "aria-roledescription": "node", "aria-describedby": x ? void 0 : `${Um}-${I}`, "aria-label": A.ariaLabel, ...A.domAttributes, children: d.jsx(G_, { value: e, children: d.jsx(T, { id: e, data: A.data, type: G, positionAbsoluteX: S.positionAbsolute.x, positionAbsoluteY: S.positionAbsolute.y, selected: A.selected ?? !1, selectable: D, draggable: K, deletable: A.deletable ?? !0, isConnectable: F, sourcePosition: A.sourcePosition, targetPosition: A.targetPosition, dragging: Y, dragHandle: A.dragHandle, zIndex: S.z, parentId: A.parentId, ...U }) }) });
}
var tN = j.memo(eN);
const nN = (e) => ({
  nodesDraggable: e.nodesDraggable,
  nodesConnectable: e.nodesConnectable,
  nodesFocusable: e.nodesFocusable,
  elementsSelectable: e.elementsSelectable,
  onError: e.onError
});
function ah(e) {
  const { nodesDraggable: n, nodesConnectable: o, nodesFocusable: s, elementsSelectable: i, onError: l } = Te(nN, Le), c = $_(e.onlyRenderVisibleElements), u = J_();
  return d.jsx("div", { className: "react-flow__nodes", style: Li, children: c.map((p) => (
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
    d.jsx(tN, { id: p, nodeTypes: e.nodeTypes, nodeExtent: e.nodeExtent, onClick: e.onNodeClick, onMouseEnter: e.onNodeMouseEnter, onMouseMove: e.onNodeMouseMove, onMouseLeave: e.onNodeMouseLeave, onContextMenu: e.onNodeContextMenu, onDoubleClick: e.onNodeDoubleClick, noDragClassName: e.noDragClassName, noPanClassName: e.noPanClassName, rfId: e.rfId, disableKeyboardA11y: e.disableKeyboardA11y, resizeObserver: u, nodesDraggable: n, nodesConnectable: o, nodesFocusable: s, elementsSelectable: i, nodeClickDistance: e.nodeClickDistance, onError: l }, p)
  )) });
}
ah.displayName = "NodeRenderer";
const rN = j.memo(ah);
function oN(e) {
  return Te(j.useCallback((o) => {
    if (!e)
      return o.edges.map((i) => i.id);
    const s = [];
    if (o.width && o.height)
      for (const i of o.edges) {
        const l = o.nodeLookup.get(i.source), c = o.nodeLookup.get(i.target);
        l && c && tb({
          sourceNode: l,
          targetNode: c,
          width: o.width,
          height: o.height,
          transform: o.transform
        }) && s.push(i.id);
      }
    return s;
  }, [e]), Le);
}
const aN = ({ color: e = "none", strokeWidth: n = 1 }) => {
  const o = {
    strokeWidth: n,
    ...e && { stroke: e }
  };
  return d.jsx("polyline", { className: "arrow", style: o, strokeLinecap: "round", fill: "none", strokeLinejoin: "round", points: "-5,-4 0,0 -5,4" });
}, sN = ({ color: e = "none", strokeWidth: n = 1 }) => {
  const o = {
    strokeWidth: n,
    ...e && { stroke: e, fill: e }
  };
  return d.jsx("polyline", { className: "arrowclosed", style: o, strokeLinecap: "round", strokeLinejoin: "round", points: "-5,-4 0,0 -5,4 -5,-4" });
}, bg = {
  [Ai.Arrow]: aN,
  [Ai.ArrowClosed]: sN
};
function iN(e) {
  const n = He();
  return j.useMemo(() => {
    var i, l;
    return Object.prototype.hasOwnProperty.call(bg, e) ? bg[e] : ((l = (i = n.getState()).onError) == null || l.call(i, "009", ln.error009(e)), null);
  }, [e]);
}
const lN = ({ id: e, type: n, color: o, width: s = 12.5, height: i = 12.5, markerUnits: l = "strokeWidth", strokeWidth: c, orient: u = "auto-start-reverse" }) => {
  const p = iN(n);
  return p ? d.jsx("marker", { className: "react-flow__arrowhead", id: e, markerWidth: `${s}`, markerHeight: `${i}`, viewBox: "-10 -10 20 20", markerUnits: l, orient: u, refX: "0", refY: "0", children: d.jsx(p, { color: o, strokeWidth: c }) }) : null;
}, sh = ({ defaultColor: e, rfId: n }) => {
  const o = Te((l) => l.edges), s = Te((l) => l.defaultEdgeOptions), i = j.useMemo(() => cb(o, {
    id: n,
    defaultColor: e,
    defaultMarkerStart: s == null ? void 0 : s.markerStart,
    defaultMarkerEnd: s == null ? void 0 : s.markerEnd
  }), [o, s, n, e]);
  return i.length ? d.jsx("svg", { className: "react-flow__marker", "aria-hidden": "true", children: d.jsx("defs", { children: i.map((l) => d.jsx(lN, { id: l.id, type: l.type, color: l.color, width: l.width, height: l.height, markerUnits: l.markerUnits, strokeWidth: l.strokeWidth, orient: l.orient }, l.id)) }) }) : null;
};
sh.displayName = "MarkerDefinitions";
var cN = j.memo(sh);
function ih({ x: e, y: n, label: o, labelStyle: s, labelShowBg: i = !0, labelBgStyle: l, labelBgPadding: c = [2, 4], labelBgBorderRadius: u = 2, children: p, className: g, ...m }) {
  const [h, w] = j.useState({ x: 1, y: 0, width: 0, height: 0 }), C = Qe(["react-flow__edge-textwrapper", g]), x = j.useRef(null);
  return j.useEffect(() => {
    if (x.current) {
      const I = x.current.getBBox();
      w({
        x: I.x,
        y: I.y,
        width: I.width,
        height: I.height
      });
    }
  }, [o]), o ? d.jsxs("g", { transform: `translate(${e - h.width / 2} ${n - h.height / 2})`, className: C, visibility: h.width ? "visible" : "hidden", ...m, children: [i && d.jsx("rect", { width: h.width + 2 * c[0], x: -c[0], y: -c[1], height: h.height + 2 * c[1], className: "react-flow__edge-textbg", style: l, rx: u, ry: u }), d.jsx("text", { className: "react-flow__edge-text", y: h.height / 2, dy: "0.3em", ref: x, style: s, children: o }), p] }) : null;
}
ih.displayName = "EdgeText";
const uN = j.memo(ih);
function xo({ path: e, labelX: n, labelY: o, label: s, labelStyle: i, labelShowBg: l, labelBgStyle: c, labelBgPadding: u, labelBgBorderRadius: p, interactionWidth: g = 20, ...m }) {
  return d.jsxs(d.Fragment, { children: [d.jsx("path", { ...m, d: e, fill: "none", className: Qe(["react-flow__edge-path", m.className]) }), g ? d.jsx("path", { d: e, fill: "none", strokeOpacity: 0, strokeWidth: g, className: "react-flow__edge-interaction" }) : null, s && Zt(n) && Zt(o) ? d.jsx(uN, { x: n, y: o, label: s, labelStyle: i, labelShowBg: l, labelBgStyle: c, labelBgPadding: u, labelBgBorderRadius: p }) : null] });
}
function _g({ pos: e, x1: n, y1: o, x2: s, y2: i }) {
  return e === Q.Left || e === Q.Right ? [0.5 * (n + s), o] : [n, 0.5 * (o + i)];
}
function lh({ sourceX: e, sourceY: n, sourcePosition: o = Q.Bottom, targetX: s, targetY: i, targetPosition: l = Q.Top }) {
  const [c, u] = _g({
    pos: o,
    x1: e,
    y1: n,
    x2: s,
    y2: i
  }), [p, g] = _g({
    pos: l,
    x1: s,
    y1: i,
    x2: e,
    y2: n
  }), [m, h, w, C] = Bm({
    sourceX: e,
    sourceY: n,
    targetX: s,
    targetY: i,
    sourceControlX: c,
    sourceControlY: u,
    targetControlX: p,
    targetControlY: g
  });
  return [
    `M${e},${n} C${c},${u} ${p},${g} ${s},${i}`,
    m,
    h,
    w,
    C
  ];
}
function ch(e) {
  return j.memo(({ id: n, sourceX: o, sourceY: s, targetX: i, targetY: l, sourcePosition: c, targetPosition: u, label: p, labelStyle: g, labelShowBg: m, labelBgStyle: h, labelBgPadding: w, labelBgBorderRadius: C, style: x, markerEnd: I, markerStart: b, interactionWidth: _ }) => {
    const [k, A, S] = lh({
      sourceX: o,
      sourceY: s,
      sourcePosition: c,
      targetX: i,
      targetY: l,
      targetPosition: u
    }), V = e.isInternal ? void 0 : n;
    return d.jsx(xo, { id: V, path: k, labelX: A, labelY: S, label: p, labelStyle: g, labelShowBg: m, labelBgStyle: h, labelBgPadding: w, labelBgBorderRadius: C, style: x, markerEnd: I, markerStart: b, interactionWidth: _ });
  });
}
const dN = ch({ isInternal: !1 }), uh = ch({ isInternal: !0 });
dN.displayName = "SimpleBezierEdge";
uh.displayName = "SimpleBezierEdgeInternal";
function dh(e) {
  return j.memo(({ id: n, sourceX: o, sourceY: s, targetX: i, targetY: l, label: c, labelStyle: u, labelShowBg: p, labelBgStyle: g, labelBgPadding: m, labelBgBorderRadius: h, style: w, sourcePosition: C = Q.Bottom, targetPosition: x = Q.Top, markerEnd: I, markerStart: b, pathOptions: _, interactionWidth: k }) => {
    const [A, S, V] = gu({
      sourceX: o,
      sourceY: s,
      sourcePosition: C,
      targetX: i,
      targetY: l,
      targetPosition: x,
      borderRadius: _ == null ? void 0 : _.borderRadius,
      offset: _ == null ? void 0 : _.offset,
      stepPosition: _ == null ? void 0 : _.stepPosition
    }), G = e.isInternal ? void 0 : n;
    return d.jsx(xo, { id: G, path: A, labelX: S, labelY: V, label: c, labelStyle: u, labelShowBg: p, labelBgStyle: g, labelBgPadding: m, labelBgBorderRadius: h, style: w, markerEnd: I, markerStart: b, interactionWidth: k });
  });
}
const fh = dh({ isInternal: !1 }), ph = dh({ isInternal: !0 });
fh.displayName = "SmoothStepEdge";
ph.displayName = "SmoothStepEdgeInternal";
function gh(e) {
  return j.memo(({ id: n, ...o }) => {
    var i;
    const s = e.isInternal ? void 0 : n;
    return d.jsx(fh, { ...o, id: s, pathOptions: j.useMemo(() => {
      var l;
      return { borderRadius: 0, offset: (l = o.pathOptions) == null ? void 0 : l.offset };
    }, [(i = o.pathOptions) == null ? void 0 : i.offset]) });
  });
}
const fN = gh({ isInternal: !1 }), mh = gh({ isInternal: !0 });
fN.displayName = "StepEdge";
mh.displayName = "StepEdgeInternal";
function hh(e) {
  return j.memo(({ id: n, sourceX: o, sourceY: s, targetX: i, targetY: l, label: c, labelStyle: u, labelShowBg: p, labelBgStyle: g, labelBgPadding: m, labelBgBorderRadius: h, style: w, markerEnd: C, markerStart: x, interactionWidth: I }) => {
    const [b, _, k] = Dm({ sourceX: o, sourceY: s, targetX: i, targetY: l }), A = e.isInternal ? void 0 : n;
    return d.jsx(xo, { id: A, path: b, labelX: _, labelY: k, label: c, labelStyle: u, labelShowBg: p, labelBgStyle: g, labelBgPadding: m, labelBgBorderRadius: h, style: w, markerEnd: C, markerStart: x, interactionWidth: I });
  });
}
const pN = hh({ isInternal: !1 }), yh = hh({ isInternal: !0 });
pN.displayName = "StraightEdge";
yh.displayName = "StraightEdgeInternal";
function wh(e) {
  return j.memo(({ id: n, sourceX: o, sourceY: s, targetX: i, targetY: l, sourcePosition: c = Q.Bottom, targetPosition: u = Q.Top, label: p, labelStyle: g, labelShowBg: m, labelBgStyle: h, labelBgPadding: w, labelBgBorderRadius: C, style: x, markerEnd: I, markerStart: b, pathOptions: _, interactionWidth: k }) => {
    const [A, S, V] = Vi({
      sourceX: o,
      sourceY: s,
      sourcePosition: c,
      targetX: i,
      targetY: l,
      targetPosition: u,
      curvature: _ == null ? void 0 : _.curvature
    }), G = e.isInternal ? void 0 : n;
    return d.jsx(xo, { id: G, path: A, labelX: S, labelY: V, label: p, labelStyle: g, labelShowBg: m, labelBgStyle: h, labelBgPadding: w, labelBgBorderRadius: C, style: x, markerEnd: I, markerStart: b, interactionWidth: k });
  });
}
const gN = wh({ isInternal: !1 }), vh = wh({ isInternal: !0 });
gN.displayName = "BezierEdge";
vh.displayName = "BezierEdgeInternal";
const Ng = {
  default: vh,
  straight: yh,
  step: mh,
  smoothstep: ph,
  simplebezier: uh
}, Ag = {
  sourceX: null,
  sourceY: null,
  targetX: null,
  targetY: null,
  sourcePosition: null,
  targetPosition: null
}, mN = (e, n, o) => o === Q.Left ? e - n : o === Q.Right ? e + n : e, hN = (e, n, o) => o === Q.Top ? e - n : o === Q.Bottom ? e + n : e, Sg = "react-flow__edgeupdater";
function kg({ position: e, centerX: n, centerY: o, radius: s = 10, onMouseDown: i, onMouseEnter: l, onMouseOut: c, type: u }) {
  return d.jsx("circle", { onMouseDown: i, onMouseEnter: l, onMouseOut: c, className: Qe([Sg, `${Sg}-${u}`]), cx: mN(n, s, e), cy: hN(o, s, e), r: s, stroke: "transparent", fill: "transparent" });
}
function yN({ isReconnectable: e, reconnectRadius: n, edge: o, sourceX: s, sourceY: i, targetX: l, targetY: c, sourcePosition: u, targetPosition: p, onReconnect: g, onReconnectStart: m, onReconnectEnd: h, setReconnecting: w, setUpdateHover: C }) {
  const x = He(), I = (S, V) => {
    if (S.button !== 0)
      return;
    const { autoPanOnConnect: G, domNode: T, isValidConnection: K, connectionMode: D, connectionRadius: F, lib: z, onConnectStart: W, onConnectEnd: q, cancelConnection: R, nodeLookup: Y, rfId: H, panBy: U, updateConnection: E } = x.getState(), P = V.type === "target", Z = (te, re) => {
      w(!1), h == null || h(te, o, V.type, re);
    }, M = (te) => g == null ? void 0 : g(o, te), L = (te, re) => {
      w(!0), m == null || m(S, o, V.type), W == null || W(te, re);
    };
    yu.onPointerDown(S.nativeEvent, {
      autoPanOnConnect: G,
      connectionMode: D,
      connectionRadius: F,
      domNode: T,
      handleId: V.id,
      nodeId: V.nodeId,
      nodeLookup: Y,
      isTarget: P,
      edgeUpdaterType: V.type,
      lib: z,
      flowId: H,
      cancelConnection: R,
      panBy: U,
      isValidConnection: K,
      onConnect: M,
      onConnectStart: L,
      onConnectEnd: q,
      onReconnectEnd: Z,
      updateConnection: E,
      getTransform: () => x.getState().transform,
      getFromHandle: () => x.getState().connection.fromHandle,
      dragThreshold: x.getState().connectionDragThreshold,
      handleDomNode: S.currentTarget
    });
  }, b = (S) => I(S, { nodeId: o.target, id: o.targetHandle ?? null, type: "target" }), _ = (S) => I(S, { nodeId: o.source, id: o.sourceHandle ?? null, type: "source" }), k = () => C(!0), A = () => C(!1);
  return d.jsxs(d.Fragment, { children: [(e === !0 || e === "source") && d.jsx(kg, { position: u, centerX: s, centerY: i, radius: n, onMouseDown: b, onMouseEnter: k, onMouseOut: A, type: "source" }), (e === !0 || e === "target") && d.jsx(kg, { position: p, centerX: l, centerY: c, radius: n, onMouseDown: _, onMouseEnter: k, onMouseOut: A, type: "target" })] });
}
function wN({ id: e, edgesFocusable: n, edgesReconnectable: o, elementsSelectable: s, onClick: i, onDoubleClick: l, onContextMenu: c, onMouseEnter: u, onMouseMove: p, onMouseLeave: g, reconnectRadius: m, onReconnect: h, onReconnectStart: w, onReconnectEnd: C, rfId: x, edgeTypes: I, noPanClassName: b, onError: _, disableKeyboardA11y: k }) {
  let A = Te((Ce) => Ce.edgeLookup.get(e));
  const S = Te((Ce) => Ce.defaultEdgeOptions);
  A = S ? { ...S, ...A } : A;
  let V = A.type || "default", G = (I == null ? void 0 : I[V]) || Ng[V];
  G === void 0 && (_ == null || _("011", ln.error011(V)), V = "default", G = (I == null ? void 0 : I.default) || Ng.default);
  const T = !!(A.focusable || n && typeof A.focusable > "u"), K = typeof h < "u" && (A.reconnectable || o && typeof A.reconnectable > "u"), D = !!(A.selectable || s && typeof A.selectable > "u"), F = j.useRef(null), [z, W] = j.useState(!1), [q, R] = j.useState(!1), Y = He(), { zIndex: H, sourceX: U, sourceY: E, targetX: P, targetY: Z, sourcePosition: M, targetPosition: L } = Te(j.useCallback((Ce) => {
    const xe = Ce.nodeLookup.get(A.source), Re = Ce.nodeLookup.get(A.target);
    if (!xe || !Re)
      return {
        zIndex: A.zIndex,
        ...Ag
      };
    const Be = lb({
      id: e,
      sourceNode: xe,
      targetNode: Re,
      sourceHandle: A.sourceHandle || null,
      targetHandle: A.targetHandle || null,
      connectionMode: Ce.connectionMode,
      onError: _
    });
    return {
      zIndex: eb({
        selected: A.selected,
        zIndex: A.zIndex,
        sourceNode: xe,
        targetNode: Re,
        elevateOnSelect: Ce.elevateEdgesOnSelect,
        zIndexMode: Ce.zIndexMode
      }),
      ...Be || Ag
    };
  }, [A.source, A.target, A.sourceHandle, A.targetHandle, A.selected, A.zIndex]), Le), te = j.useMemo(() => A.markerStart ? `url('#${mu(A.markerStart, x)}')` : void 0, [A.markerStart, x]), re = j.useMemo(() => A.markerEnd ? `url('#${mu(A.markerEnd, x)}')` : void 0, [A.markerEnd, x]);
  if (A.hidden || U === null || E === null || P === null || Z === null)
    return null;
  const le = (Ce) => {
    var je;
    const { addSelectedEdges: xe, unselectNodesAndEdges: Re, multiSelectionActive: Be } = Y.getState();
    D && (Y.setState({ nodesSelectionActive: !1 }), A.selected && Be ? (Re({ nodes: [], edges: [A] }), (je = F.current) == null || je.blur()) : xe([e])), i && i(Ce, A);
  }, ue = l ? (Ce) => {
    l(Ce, { ...A });
  } : void 0, fe = c ? (Ce) => {
    c(Ce, { ...A });
  } : void 0, ne = u ? (Ce) => {
    u(Ce, { ...A });
  } : void 0, pe = p ? (Ce) => {
    p(Ce, { ...A });
  } : void 0, be = g ? (Ce) => {
    g(Ce, { ...A });
  } : void 0, _e = (Ce) => {
    var xe;
    if (!k && vm.includes(Ce.key) && D) {
      const { unselectNodesAndEdges: Re, addSelectedEdges: Be } = Y.getState();
      Ce.key === "Escape" ? ((xe = F.current) == null || xe.blur(), Re({ edges: [A] })) : Be([e]);
    }
  };
  return d.jsx("svg", { style: { zIndex: H }, children: d.jsxs("g", { className: Qe([
    "react-flow__edge",
    `react-flow__edge-${V}`,
    A.className,
    b,
    {
      selected: A.selected,
      animated: A.animated,
      inactive: !D && !i,
      updating: z,
      selectable: D
    }
  ]), onClick: le, onDoubleClick: ue, onContextMenu: fe, onMouseEnter: ne, onMouseMove: pe, onMouseLeave: be, onKeyDown: T ? _e : void 0, tabIndex: T ? 0 : void 0, role: A.ariaRole ?? (T ? "group" : "img"), "aria-roledescription": "edge", "data-id": e, "data-testid": `rf__edge-${e}`, "aria-label": A.ariaLabel === null ? void 0 : A.ariaLabel || `Edge from ${A.source} to ${A.target}`, "aria-describedby": T ? `${$m}-${x}` : void 0, ref: F, ...A.domAttributes, children: [!q && d.jsx(G, { id: e, source: A.source, target: A.target, type: A.type, selected: A.selected, animated: A.animated, selectable: D, deletable: A.deletable ?? !0, label: A.label, labelStyle: A.labelStyle, labelShowBg: A.labelShowBg, labelBgStyle: A.labelBgStyle, labelBgPadding: A.labelBgPadding, labelBgBorderRadius: A.labelBgBorderRadius, sourceX: U, sourceY: E, targetX: P, targetY: Z, sourcePosition: M, targetPosition: L, data: A.data, style: A.style, sourceHandleId: A.sourceHandle, targetHandleId: A.targetHandle, markerStart: te, markerEnd: re, pathOptions: "pathOptions" in A ? A.pathOptions : void 0, interactionWidth: A.interactionWidth }), K && d.jsx(yN, { edge: A, isReconnectable: K, reconnectRadius: m, onReconnect: h, onReconnectStart: w, onReconnectEnd: C, sourceX: U, sourceY: E, targetX: P, targetY: Z, sourcePosition: M, targetPosition: L, setUpdateHover: W, setReconnecting: R })] }) });
}
var vN = j.memo(wN);
const xN = (e) => ({
  edgesFocusable: e.edgesFocusable,
  edgesReconnectable: e.edgesReconnectable,
  elementsSelectable: e.elementsSelectable,
  connectionMode: e.connectionMode,
  onError: e.onError
});
function xh({ defaultMarkerColor: e, onlyRenderVisibleElements: n, rfId: o, edgeTypes: s, noPanClassName: i, onReconnect: l, onEdgeContextMenu: c, onEdgeMouseEnter: u, onEdgeMouseMove: p, onEdgeMouseLeave: g, onEdgeClick: m, reconnectRadius: h, onEdgeDoubleClick: w, onReconnectStart: C, onReconnectEnd: x, disableKeyboardA11y: I }) {
  const { edgesFocusable: b, edgesReconnectable: _, elementsSelectable: k, onError: A } = Te(xN, Le), S = oN(n);
  return d.jsxs("div", { className: "react-flow__edges", children: [d.jsx(cN, { defaultColor: e, rfId: o }), S.map((V) => d.jsx(vN, { id: V, edgesFocusable: b, edgesReconnectable: _, elementsSelectable: k, noPanClassName: i, onReconnect: l, onContextMenu: c, onMouseEnter: u, onMouseMove: p, onMouseLeave: g, onClick: m, reconnectRadius: h, onDoubleClick: w, onReconnectStart: C, onReconnectEnd: x, rfId: o, onError: A, edgeTypes: s, disableKeyboardA11y: I }, V))] });
}
xh.displayName = "EdgeRenderer";
const IN = j.memo(xh), CN = (e) => `translate(${e.transform[0]}px,${e.transform[1]}px) scale(${e.transform[2]})`;
function bN({ children: e }) {
  const n = Te(CN);
  return d.jsx("div", { className: "react-flow__viewport xyflow__viewport react-flow__container", style: { transform: n }, children: e });
}
function _N(e) {
  const n = Ou(), o = j.useRef(!1);
  j.useEffect(() => {
    !o.current && n.viewportInitialized && e && (setTimeout(() => e(n), 1), o.current = !0);
  }, [e, n.viewportInitialized]);
}
const NN = (e) => {
  var n;
  return (n = e.panZoom) == null ? void 0 : n.syncViewport;
};
function AN(e) {
  const n = Te(NN), o = He();
  return j.useEffect(() => {
    e && (n == null || n(e), o.setState({ transform: [e.x, e.y, e.zoom] }));
  }, [e, n]), null;
}
function SN(e) {
  return e.connection.inProgress ? { ...e.connection, to: Pa(e.connection.to, e.transform) } : { ...e.connection };
}
function kN(e) {
  return SN;
}
function jN(e) {
  const n = kN();
  return Te(n, Le);
}
const MN = (e) => ({
  nodesConnectable: e.nodesConnectable,
  isValid: e.connection.isValid,
  inProgress: e.connection.inProgress,
  width: e.width,
  height: e.height
});
function RN({ containerStyle: e, style: n, type: o, component: s }) {
  const { nodesConnectable: i, width: l, height: c, isValid: u, inProgress: p } = Te(MN, Le);
  return !(l && i && p) ? null : d.jsx("svg", { style: e, width: l, height: c, className: "react-flow__connectionline react-flow__container", children: d.jsx("g", { className: Qe(["react-flow__connection", Cm(u)]), children: d.jsx(Ih, { style: n, type: o, CustomComponent: s, isValid: u }) }) });
}
const Ih = ({ style: e, type: n = er.Bezier, CustomComponent: o, isValid: s }) => {
  const { inProgress: i, from: l, fromNode: c, fromHandle: u, fromPosition: p, to: g, toNode: m, toHandle: h, toPosition: w, pointer: C } = jN();
  if (!i)
    return;
  if (o)
    return d.jsx(o, { connectionLineType: n, connectionLineStyle: e, fromNode: c, fromHandle: u, fromX: l.x, fromY: l.y, toX: g.x, toY: g.y, fromPosition: p, toPosition: w, connectionStatus: Cm(s), toNode: m, toHandle: h, pointer: C });
  let x = "";
  const I = {
    sourceX: l.x,
    sourceY: l.y,
    sourcePosition: p,
    targetX: g.x,
    targetY: g.y,
    targetPosition: w
  };
  switch (n) {
    case er.Bezier:
      [x] = Vi(I);
      break;
    case er.SimpleBezier:
      [x] = lh(I);
      break;
    case er.Step:
      [x] = gu({
        ...I,
        borderRadius: 0
      });
      break;
    case er.SmoothStep:
      [x] = gu(I);
      break;
    default:
      [x] = Dm(I);
  }
  return d.jsx("path", { d: x, fill: "none", className: "react-flow__connection-path", style: e });
};
Ih.displayName = "ConnectionLine";
const TN = {};
function jg(e = TN) {
  j.useRef(e), He(), j.useEffect(() => {
  }, [e]);
}
function BN() {
  He(), j.useRef(!1), j.useEffect(() => {
  }, []);
}
function Ch({ nodeTypes: e, edgeTypes: n, onInit: o, onNodeClick: s, onEdgeClick: i, onNodeDoubleClick: l, onEdgeDoubleClick: c, onNodeMouseEnter: u, onNodeMouseMove: p, onNodeMouseLeave: g, onNodeContextMenu: m, onSelectionContextMenu: h, onSelectionStart: w, onSelectionEnd: C, connectionLineType: x, connectionLineStyle: I, connectionLineComponent: b, connectionLineContainerStyle: _, selectionKeyCode: k, selectionOnDrag: A, selectionMode: S, multiSelectionKeyCode: V, panActivationKeyCode: G, zoomActivationKeyCode: T, deleteKeyCode: K, onlyRenderVisibleElements: D, elementsSelectable: F, defaultViewport: z, translateExtent: W, minZoom: q, maxZoom: R, preventScrolling: Y, defaultMarkerColor: H, zoomOnScroll: U, zoomOnPinch: E, panOnScroll: P, panOnScrollSpeed: Z, panOnScrollMode: M, zoomOnDoubleClick: L, panOnDrag: te, onPaneClick: re, onPaneMouseEnter: le, onPaneMouseMove: ue, onPaneMouseLeave: fe, onPaneScroll: ne, onPaneContextMenu: pe, paneClickDistance: be, nodeClickDistance: _e, onEdgeContextMenu: Ce, onEdgeMouseEnter: xe, onEdgeMouseMove: Re, onEdgeMouseLeave: Be, reconnectRadius: je, onReconnect: We, onReconnectStart: Ft, onReconnectEnd: xt, noDragClassName: It, noWheelClassName: Mt, noPanClassName: un, disableKeyboardA11y: Mn, nodeExtent: Mr, rfId: tr, viewport: dn, onViewportChange: fn }) {
  return jg(e), jg(n), BN(), _N(o), AN(dn), d.jsx(Y_, { onPaneClick: re, onPaneMouseEnter: le, onPaneMouseMove: ue, onPaneMouseLeave: fe, onPaneContextMenu: pe, onPaneScroll: ne, paneClickDistance: be, deleteKeyCode: K, selectionKeyCode: k, selectionOnDrag: A, selectionMode: S, onSelectionStart: w, onSelectionEnd: C, multiSelectionKeyCode: V, panActivationKeyCode: G, zoomActivationKeyCode: T, elementsSelectable: F, zoomOnScroll: U, zoomOnPinch: E, zoomOnDoubleClick: L, panOnScroll: P, panOnScrollSpeed: Z, panOnScrollMode: M, panOnDrag: te, defaultViewport: z, translateExtent: W, minZoom: q, maxZoom: R, onSelectionContextMenu: h, preventScrolling: Y, noDragClassName: It, noWheelClassName: Mt, noPanClassName: un, disableKeyboardA11y: Mn, onViewportChange: fn, isControlledViewport: !!dn, children: d.jsxs(bN, { children: [d.jsx(IN, { edgeTypes: n, onEdgeClick: i, onEdgeDoubleClick: c, onReconnect: We, onReconnectStart: Ft, onReconnectEnd: xt, onlyRenderVisibleElements: D, onEdgeContextMenu: Ce, onEdgeMouseEnter: xe, onEdgeMouseMove: Re, onEdgeMouseLeave: Be, reconnectRadius: je, defaultMarkerColor: H, noPanClassName: un, disableKeyboardA11y: Mn, rfId: tr }), d.jsx(RN, { style: I, type: x, component: b, containerStyle: _ }), d.jsx("div", { className: "react-flow__edgelabel-renderer" }), d.jsx(rN, { nodeTypes: e, onNodeClick: s, onNodeDoubleClick: l, onNodeMouseEnter: u, onNodeMouseMove: p, onNodeMouseLeave: g, onNodeContextMenu: m, nodeClickDistance: _e, onlyRenderVisibleElements: D, noPanClassName: un, noDragClassName: It, disableKeyboardA11y: Mn, nodeExtent: Mr, rfId: tr }), d.jsx("div", { className: "react-flow__viewport-portal" })] }) });
}
Ch.displayName = "GraphView";
const EN = j.memo(Ch), Mg = ({ nodes: e, edges: n, defaultNodes: o, defaultEdges: s, width: i, height: l, fitView: c, fitViewOptions: u, minZoom: p = 0.5, maxZoom: g = 2, nodeOrigin: m, nodeExtent: h, zIndexMode: w = "basic" } = {}) => {
  const C = /* @__PURE__ */ new Map(), x = /* @__PURE__ */ new Map(), I = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map(), _ = s ?? n ?? [], k = o ?? e ?? [], A = m ?? [0, 0], S = h ?? Aa;
  Fm(I, b, _);
  const V = hu(k, C, x, {
    nodeOrigin: A,
    nodeExtent: S,
    zIndexMode: w
  });
  let G = [0, 0, 1];
  if (c && i && l) {
    const T = Da(C, {
      filter: (z) => !!((z.width || z.initialWidth) && (z.height || z.initialHeight))
    }), { x: K, y: D, zoom: F } = Tu(T, i, l, p, g, (u == null ? void 0 : u.padding) ?? 0.1);
    G = [K, D, F];
  }
  return {
    rfId: "1",
    width: i ?? 0,
    height: l ?? 0,
    transform: G,
    nodes: k,
    nodesInitialized: V,
    nodeLookup: C,
    parentLookup: x,
    edges: _,
    edgeLookup: b,
    connectionLookup: I,
    onNodesChange: null,
    onEdgesChange: null,
    hasDefaultNodes: o !== void 0,
    hasDefaultEdges: s !== void 0,
    panZoom: null,
    minZoom: p,
    maxZoom: g,
    translateExtent: Aa,
    nodeExtent: S,
    nodesSelectionActive: !1,
    userSelectionActive: !1,
    userSelectionRect: null,
    connectionMode: mo.Strict,
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
    connection: { ...Im },
    connectionClickStartHandle: null,
    connectOnClick: !0,
    ariaLiveMessage: "",
    autoPanOnConnect: !0,
    autoPanOnNodeDrag: !0,
    autoPanOnNodeFocus: !0,
    autoPanSpeed: 15,
    connectionRadius: 20,
    onError: YC,
    isValidConnection: void 0,
    onSelectionChangeHandlers: [],
    lib: "react",
    debug: !1,
    ariaLabelConfig: xm,
    zIndexMode: w,
    onNodesChangeMiddlewareMap: /* @__PURE__ */ new Map(),
    onEdgesChangeMiddlewareMap: /* @__PURE__ */ new Map()
  };
}, DN = ({ nodes: e, edges: n, defaultNodes: o, defaultEdges: s, width: i, height: l, fitView: c, fitViewOptions: u, minZoom: p, maxZoom: g, nodeOrigin: m, nodeExtent: h, zIndexMode: w }) => Jb((C, x) => {
  async function I() {
    const { nodeLookup: b, panZoom: _, fitViewOptions: k, fitViewResolver: A, width: S, height: V, minZoom: G, maxZoom: T } = x();
    _ && (await KC({
      nodes: b,
      width: S,
      height: V,
      panZoom: _,
      minZoom: G,
      maxZoom: T
    }, k), A == null || A.resolve(!0), C({ fitViewResolver: null }));
  }
  return {
    ...Mg({
      nodes: e,
      edges: n,
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
      const { nodeLookup: _, parentLookup: k, nodeOrigin: A, elevateNodesOnSelect: S, fitViewQueued: V, zIndexMode: G } = x(), T = hu(b, _, k, {
        nodeOrigin: A,
        nodeExtent: h,
        elevateNodesOnSelect: S,
        checkEquality: !0,
        zIndexMode: G
      });
      V && T ? (I(), C({ nodes: b, nodesInitialized: T, fitViewQueued: !1, fitViewOptions: void 0 })) : C({ nodes: b, nodesInitialized: T });
    },
    setEdges: (b) => {
      const { connectionLookup: _, edgeLookup: k } = x();
      Fm(_, k, b), C({ edges: b });
    },
    setDefaultNodesAndEdges: (b, _) => {
      if (b) {
        const { setNodes: k } = x();
        k(b), C({ hasDefaultNodes: !0 });
      }
      if (_) {
        const { setEdges: k } = x();
        k(_), C({ hasDefaultEdges: !0 });
      }
    },
    /*
     * Every node gets registerd at a ResizeObserver. Whenever a node
     * changes its dimensions, this function is called to measure the
     * new dimensions and update the nodes.
     */
    updateNodeInternals: (b) => {
      const { triggerNodeChanges: _, nodeLookup: k, parentLookup: A, domNode: S, nodeOrigin: V, nodeExtent: G, debug: T, fitViewQueued: K, zIndexMode: D } = x(), { changes: F, updatedInternals: z } = hb(b, k, A, S, V, G, D);
      z && (fb(k, A, { nodeOrigin: V, nodeExtent: G, zIndexMode: D }), K ? (I(), C({ fitViewQueued: !1, fitViewOptions: void 0 })) : C({}), (F == null ? void 0 : F.length) > 0 && (T && console.log("React Flow: trigger node changes", F), _ == null || _(F)));
    },
    updateNodePositions: (b, _ = !1) => {
      const k = [];
      let A = [];
      const { nodeLookup: S, triggerNodeChanges: V, connection: G, updateConnection: T, onNodesChangeMiddlewareMap: K } = x();
      for (const [D, F] of b) {
        const z = S.get(D), W = !!(z != null && z.expandParent && (z != null && z.parentId) && (F != null && F.position)), q = {
          id: D,
          type: "position",
          position: W ? {
            x: Math.max(0, F.position.x),
            y: Math.max(0, F.position.y)
          } : F.position,
          dragging: _
        };
        if (z && G.inProgress && G.fromNode.id === z.id) {
          const R = jr(z, G.fromHandle, Q.Left, !0);
          T({ ...G, from: R });
        }
        W && z.parentId && k.push({
          id: D,
          parentId: z.parentId,
          rect: {
            ...F.internals.positionAbsolute,
            width: F.measured.width ?? 0,
            height: F.measured.height ?? 0
          }
        }), A.push(q);
      }
      if (k.length > 0) {
        const { parentLookup: D, nodeOrigin: F } = x(), z = Fu(k, S, D, F);
        A.push(...z);
      }
      for (const D of K.values())
        A = D(A);
      V(A);
    },
    triggerNodeChanges: (b) => {
      const { onNodesChange: _, setNodes: k, nodes: A, hasDefaultNodes: S, debug: V } = x();
      if (b != null && b.length) {
        if (S) {
          const G = Vu(b, A);
          k(G);
        }
        V && console.log("React Flow: trigger node changes", b), _ == null || _(b);
      }
    },
    triggerEdgeChanges: (b) => {
      const { onEdgesChange: _, setEdges: k, edges: A, hasDefaultEdges: S, debug: V } = x();
      if (b != null && b.length) {
        if (S) {
          const G = zu(b, A);
          k(G);
        }
        V && console.log("React Flow: trigger edge changes", b), _ == null || _(b);
      }
    },
    addSelectedNodes: (b) => {
      const { multiSelectionActive: _, edgeLookup: k, nodeLookup: A, triggerNodeChanges: S, triggerEdgeChanges: V } = x();
      if (_) {
        const G = b.map((T) => Cr(T, !0));
        S(G);
        return;
      }
      S(lo(A, /* @__PURE__ */ new Set([...b]), !0)), V(lo(k));
    },
    addSelectedEdges: (b) => {
      const { multiSelectionActive: _, edgeLookup: k, nodeLookup: A, triggerNodeChanges: S, triggerEdgeChanges: V } = x();
      if (_) {
        const G = b.map((T) => Cr(T, !0));
        V(G);
        return;
      }
      V(lo(k, /* @__PURE__ */ new Set([...b]))), S(lo(A, /* @__PURE__ */ new Set(), !0));
    },
    unselectNodesAndEdges: ({ nodes: b, edges: _ } = {}) => {
      const { edges: k, nodes: A, nodeLookup: S, triggerNodeChanges: V, triggerEdgeChanges: G } = x(), T = b || A, K = _ || k, D = T.map((z) => {
        const W = S.get(z.id);
        return W && (W.selected = !1), Cr(z.id, !1);
      }), F = K.map((z) => Cr(z.id, !1));
      V(D), G(F);
    },
    setMinZoom: (b) => {
      const { panZoom: _, maxZoom: k } = x();
      _ == null || _.setScaleExtent([b, k]), C({ minZoom: b });
    },
    setMaxZoom: (b) => {
      const { panZoom: _, minZoom: k } = x();
      _ == null || _.setScaleExtent([k, b]), C({ maxZoom: b });
    },
    setTranslateExtent: (b) => {
      var _;
      (_ = x().panZoom) == null || _.setTranslateExtent(b), C({ translateExtent: b });
    },
    resetSelectedElements: () => {
      const { edges: b, nodes: _, triggerNodeChanges: k, triggerEdgeChanges: A, elementsSelectable: S } = x();
      if (!S)
        return;
      const V = _.reduce((T, K) => K.selected ? [...T, Cr(K.id, !1)] : T, []), G = b.reduce((T, K) => K.selected ? [...T, Cr(K.id, !1)] : T, []);
      k(V), A(G);
    },
    setNodeExtent: (b) => {
      const { nodes: _, nodeLookup: k, parentLookup: A, nodeOrigin: S, elevateNodesOnSelect: V, nodeExtent: G, zIndexMode: T } = x();
      b[0][0] === G[0][0] && b[0][1] === G[0][1] && b[1][0] === G[1][0] && b[1][1] === G[1][1] || (hu(_, k, A, {
        nodeOrigin: S,
        nodeExtent: b,
        elevateNodesOnSelect: V,
        checkEquality: !1,
        zIndexMode: T
      }), C({ nodeExtent: b }));
    },
    panBy: (b) => {
      const { transform: _, width: k, height: A, panZoom: S, translateExtent: V } = x();
      return yb({ delta: b, panZoom: S, transform: _, translateExtent: V, width: k, height: A });
    },
    setCenter: async (b, _, k) => {
      const { width: A, height: S, maxZoom: V, panZoom: G } = x();
      if (!G)
        return Promise.resolve(!1);
      const T = typeof (k == null ? void 0 : k.zoom) < "u" ? k.zoom : V;
      return await G.setViewport({
        x: A / 2 - b * T,
        y: S / 2 - _ * T,
        zoom: T
      }, { duration: k == null ? void 0 : k.duration, ease: k == null ? void 0 : k.ease, interpolate: k == null ? void 0 : k.interpolate }), Promise.resolve(!0);
    },
    cancelConnection: () => {
      C({
        connection: { ...Im }
      });
    },
    updateConnection: (b) => {
      C({ connection: b });
    },
    reset: () => C({ ...Mg() })
  };
}, Object.is);
function Hu({ initialNodes: e, initialEdges: n, defaultNodes: o, defaultEdges: s, initialWidth: i, initialHeight: l, initialMinZoom: c, initialMaxZoom: u, initialFitViewOptions: p, fitView: g, nodeOrigin: m, nodeExtent: h, zIndexMode: w, children: C }) {
  const [x] = j.useState(() => DN({
    nodes: e,
    edges: n,
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
  return d.jsx(e_, { value: x, children: d.jsx(b_, { children: C }) });
}
function GN({ children: e, nodes: n, edges: o, defaultNodes: s, defaultEdges: i, width: l, height: c, fitView: u, fitViewOptions: p, minZoom: g, maxZoom: m, nodeOrigin: h, nodeExtent: w, zIndexMode: C }) {
  return j.useContext(Oi) ? d.jsx(d.Fragment, { children: e }) : d.jsx(Hu, { initialNodes: n, initialEdges: o, defaultNodes: s, defaultEdges: i, initialWidth: l, initialHeight: c, fitView: u, initialFitViewOptions: p, initialMinZoom: g, initialMaxZoom: m, nodeOrigin: h, nodeExtent: w, zIndexMode: C, children: e });
}
const PN = {
  width: "100%",
  height: "100%",
  overflow: "hidden",
  position: "relative",
  zIndex: 0
};
function FN({ nodes: e, edges: n, defaultNodes: o, defaultEdges: s, className: i, nodeTypes: l, edgeTypes: c, onNodeClick: u, onEdgeClick: p, onInit: g, onMove: m, onMoveStart: h, onMoveEnd: w, onConnect: C, onConnectStart: x, onConnectEnd: I, onClickConnectStart: b, onClickConnectEnd: _, onNodeMouseEnter: k, onNodeMouseMove: A, onNodeMouseLeave: S, onNodeContextMenu: V, onNodeDoubleClick: G, onNodeDragStart: T, onNodeDrag: K, onNodeDragStop: D, onNodesDelete: F, onEdgesDelete: z, onDelete: W, onSelectionChange: q, onSelectionDragStart: R, onSelectionDrag: Y, onSelectionDragStop: H, onSelectionContextMenu: U, onSelectionStart: E, onSelectionEnd: P, onBeforeDelete: Z, connectionMode: M, connectionLineType: L = er.Bezier, connectionLineStyle: te, connectionLineComponent: re, connectionLineContainerStyle: le, deleteKeyCode: ue = "Backspace", selectionKeyCode: fe = "Shift", selectionOnDrag: ne = !1, selectionMode: pe = Sa.Full, panActivationKeyCode: be = "Space", multiSelectionKeyCode: _e = ja() ? "Meta" : "Control", zoomActivationKeyCode: Ce = ja() ? "Meta" : "Control", snapToGrid: xe, snapGrid: Re, onlyRenderVisibleElements: Be = !1, selectNodesOnDrag: je, nodesDraggable: We, autoPanOnNodeFocus: Ft, nodesConnectable: xt, nodesFocusable: It, nodeOrigin: Mt = Qm, edgesFocusable: un, edgesReconnectable: Mn, elementsSelectable: Mr = !0, defaultViewport: tr = p_, minZoom: dn = 0.5, maxZoom: fn = 2, translateExtent: nr = Aa, preventScrolling: Va = !0, nodeExtent: pn, defaultMarkerColor: rr = "#b1b1b7", zoomOnScroll: Wi = !0, zoomOnPinch: za = !0, panOnScroll: Oa = !1, panOnScrollSpeed: Xi = 0.5, panOnScrollMode: _o = Nr.Free, zoomOnDoubleClick: No = !0, panOnDrag: Ao = !0, onPaneClick: So, onPaneMouseEnter: ko, onPaneMouseMove: Rn, onPaneMouseLeave: Tn, onPaneScroll: La, onPaneContextMenu: Ha, paneClickDistance: Wa = 1, nodeClickDistance: Xa = 0, children: Ka, onReconnect: jo, onReconnectStart: Za, onReconnectEnd: or, onEdgeContextMenu: Mo, onEdgeDoubleClick: ar, onEdgeMouseEnter: Ki, onEdgeMouseMove: sr, onEdgeMouseLeave: Rr, reconnectRadius: Tr = 10, onNodesChange: Ro, onEdgesChange: Zi, noDragClassName: Yi = "nodrag", noWheelClassName: Ui = "nowheel", noPanClassName: Jt = "nopan", fitView: To, fitViewOptions: Bo, connectOnClick: $i, attributionPosition: Ya, proOptions: Ua, defaultEdgeOptions: $a, elevateNodesOnSelect: Qa = !0, elevateEdgesOnSelect: Qi = !1, disableKeyboardA11y: Ja = !1, autoPanOnConnect: Xe, autoPanOnNodeDrag: Ji, autoPanSpeed: Eo, connectionRadius: qa, isValidConnection: Br, onError: qi, style: es, id: ir, nodeDragThreshold: Rt, connectionDragThreshold: el, viewport: Ct, onViewportChange: tl, width: nl, height: rl, colorMode: Er = "light", debug: Dr, onScroll: qt, ariaLabelConfig: Gr, zIndexMode: ts = "basic", ...ol }, Do) {
  const Pr = ir || "1", Go = y_(Er), lr = j.useCallback((ns) => {
    ns.currentTarget.scrollTo({ top: 0, left: 0, behavior: "instant" }), qt == null || qt(ns);
  }, [qt]);
  return d.jsx("div", { "data-testid": "rf__wrapper", ...ol, onScroll: lr, style: { ...es, ...PN }, ref: Do, className: Qe(["react-flow", i, Go]), id: ir, role: "application", children: d.jsxs(GN, { nodes: e, edges: n, width: nl, height: rl, fitView: To, fitViewOptions: Bo, minZoom: dn, maxZoom: fn, nodeOrigin: Mt, nodeExtent: pn, zIndexMode: ts, children: [d.jsx(EN, { onInit: g, onNodeClick: u, onEdgeClick: p, onNodeMouseEnter: k, onNodeMouseMove: A, onNodeMouseLeave: S, onNodeContextMenu: V, onNodeDoubleClick: G, nodeTypes: l, edgeTypes: c, connectionLineType: L, connectionLineStyle: te, connectionLineComponent: re, connectionLineContainerStyle: le, selectionKeyCode: fe, selectionOnDrag: ne, selectionMode: pe, deleteKeyCode: ue, multiSelectionKeyCode: _e, panActivationKeyCode: be, zoomActivationKeyCode: Ce, onlyRenderVisibleElements: Be, defaultViewport: tr, translateExtent: nr, minZoom: dn, maxZoom: fn, preventScrolling: Va, zoomOnScroll: Wi, zoomOnPinch: za, zoomOnDoubleClick: No, panOnScroll: Oa, panOnScrollSpeed: Xi, panOnScrollMode: _o, panOnDrag: Ao, onPaneClick: So, onPaneMouseEnter: ko, onPaneMouseMove: Rn, onPaneMouseLeave: Tn, onPaneScroll: La, onPaneContextMenu: Ha, paneClickDistance: Wa, nodeClickDistance: Xa, onSelectionContextMenu: U, onSelectionStart: E, onSelectionEnd: P, onReconnect: jo, onReconnectStart: Za, onReconnectEnd: or, onEdgeContextMenu: Mo, onEdgeDoubleClick: ar, onEdgeMouseEnter: Ki, onEdgeMouseMove: sr, onEdgeMouseLeave: Rr, reconnectRadius: Tr, defaultMarkerColor: rr, noDragClassName: Yi, noWheelClassName: Ui, noPanClassName: Jt, rfId: Pr, disableKeyboardA11y: Ja, nodeExtent: pn, viewport: Ct, onViewportChange: tl }), d.jsx(h_, { nodes: e, edges: n, defaultNodes: o, defaultEdges: s, onConnect: C, onConnectStart: x, onConnectEnd: I, onClickConnectStart: b, onClickConnectEnd: _, nodesDraggable: We, autoPanOnNodeFocus: Ft, nodesConnectable: xt, nodesFocusable: It, edgesFocusable: un, edgesReconnectable: Mn, elementsSelectable: Mr, elevateNodesOnSelect: Qa, elevateEdgesOnSelect: Qi, minZoom: dn, maxZoom: fn, nodeExtent: pn, onNodesChange: Ro, onEdgesChange: Zi, snapToGrid: xe, snapGrid: Re, connectionMode: M, translateExtent: nr, connectOnClick: $i, defaultEdgeOptions: $a, fitView: To, fitViewOptions: Bo, onNodesDelete: F, onEdgesDelete: z, onDelete: W, onNodeDragStart: T, onNodeDrag: K, onNodeDragStop: D, onSelectionDrag: Y, onSelectionDragStart: R, onSelectionDragStop: H, onMove: m, onMoveStart: h, onMoveEnd: w, noPanClassName: Jt, nodeOrigin: Mt, rfId: Pr, autoPanOnConnect: Xe, autoPanOnNodeDrag: Ji, autoPanSpeed: Eo, onError: qi, connectionRadius: qa, isValidConnection: Br, selectNodesOnDrag: je, nodeDragThreshold: Rt, connectionDragThreshold: el, onBeforeDelete: Z, debug: Dr, ariaLabelConfig: Gr, zIndexMode: ts }), d.jsx(f_, { onSelectionChange: q }), Ka, d.jsx(i_, { proOptions: Ua, position: Ya }), d.jsx(s_, { rfId: Pr, disableKeyboardA11y: Ja })] }) });
}
var VN = qm(FN);
const zN = (e) => {
  var n;
  return (n = e.domNode) == null ? void 0 : n.querySelector(".react-flow__edgelabel-renderer");
};
function ON({ children: e }) {
  const n = Te(zN);
  return n ? qb.createPortal(e, n) : null;
}
function LN({ dimensions: e, lineWidth: n, variant: o, className: s }) {
  return d.jsx("path", { strokeWidth: n, d: `M${e[0] / 2} 0 V${e[1]} M0 ${e[1] / 2} H${e[0]}`, className: Qe(["react-flow__background-pattern", o, s]) });
}
function HN({ radius: e, className: n }) {
  return d.jsx("circle", { cx: e, cy: e, r: e, className: Qe(["react-flow__background-pattern", "dots", n]) });
}
var An;
(function(e) {
  e.Lines = "lines", e.Dots = "dots", e.Cross = "cross";
})(An || (An = {}));
const WN = {
  [An.Dots]: 1,
  [An.Lines]: 1,
  [An.Cross]: 6
}, XN = (e) => ({ transform: e.transform, patternId: `pattern-${e.rfId}` });
function bh({
  id: e,
  variant: n = An.Dots,
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
  const h = j.useRef(null), { transform: w, patternId: C } = Te(XN, Le), x = s || WN[n], I = n === An.Dots, b = n === An.Cross, _ = Array.isArray(o) ? o : [o, o], k = [_[0] * w[2] || 1, _[1] * w[2] || 1], A = x * w[2], S = Array.isArray(l) ? l : [l, l], V = b ? [A, A] : k, G = [
    S[0] * w[2] || 1 + V[0] / 2,
    S[1] * w[2] || 1 + V[1] / 2
  ], T = `${C}${e || ""}`;
  return d.jsxs("svg", { className: Qe(["react-flow__background", g]), style: {
    ...p,
    ...Li,
    "--xy-background-color-props": u,
    "--xy-background-pattern-color-props": c
  }, ref: h, "data-testid": "rf__background", children: [d.jsx("pattern", { id: T, x: w[0] % k[0], y: w[1] % k[1], width: k[0], height: k[1], patternUnits: "userSpaceOnUse", patternTransform: `translate(-${G[0]},-${G[1]})`, children: I ? d.jsx(HN, { radius: A / 2, className: m }) : d.jsx(LN, { dimensions: V, lineWidth: i, variant: n, className: m }) }), d.jsx("rect", { x: "0", y: "0", width: "100%", height: "100%", fill: `url(#${T})` })] });
}
bh.displayName = "Background";
const KN = j.memo(bh);
function ZN() {
  return d.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 32", children: d.jsx("path", { d: "M32 18.133H18.133V32h-4.266V18.133H0v-4.266h13.867V0h4.266v13.867H32z" }) });
}
function YN() {
  return d.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 5", children: d.jsx("path", { d: "M0 0h32v4.2H0z" }) });
}
function UN() {
  return d.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 30", children: d.jsx("path", { d: "M3.692 4.63c0-.53.4-.938.939-.938h5.215V0H4.708C2.13 0 0 2.054 0 4.63v5.216h3.692V4.631zM27.354 0h-5.2v3.692h5.17c.53 0 .984.4.984.939v5.215H32V4.631A4.624 4.624 0 0027.354 0zm.954 24.83c0 .532-.4.94-.939.94h-5.215v3.768h5.215c2.577 0 4.631-2.13 4.631-4.707v-5.139h-3.692v5.139zm-23.677.94c-.531 0-.939-.4-.939-.94v-5.138H0v5.139c0 2.577 2.13 4.707 4.708 4.707h5.138V25.77H4.631z" }) });
}
function $N() {
  return d.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 25 32", children: d.jsx("path", { d: "M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0 8 0 4.571 3.429 4.571 7.619v3.048H3.048A3.056 3.056 0 000 13.714v15.238A3.056 3.056 0 003.048 32h18.285a3.056 3.056 0 003.048-3.048V13.714a3.056 3.056 0 00-3.048-3.047zM12.19 24.533a3.056 3.056 0 01-3.047-3.047 3.056 3.056 0 013.047-3.048 3.056 3.056 0 013.048 3.048 3.056 3.056 0 01-3.048 3.047zm4.724-13.866H7.467V7.619c0-2.59 2.133-4.724 4.723-4.724 2.591 0 4.724 2.133 4.724 4.724v3.048z" }) });
}
function QN() {
  return d.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 25 32", children: d.jsx("path", { d: "M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0c-4.114 1.828-1.37 2.133.305 2.438 1.676.305 4.42 2.59 4.42 5.181v3.048H3.047A3.056 3.056 0 000 13.714v15.238A3.056 3.056 0 003.048 32h18.285a3.056 3.056 0 003.048-3.048V13.714a3.056 3.056 0 00-3.048-3.047zM12.19 24.533a3.056 3.056 0 01-3.047-3.047 3.056 3.056 0 013.047-3.048 3.056 3.056 0 013.048 3.048 3.056 3.056 0 01-3.048 3.047z" }) });
}
function fi({ children: e, className: n, ...o }) {
  return d.jsx("button", { type: "button", className: Qe(["react-flow__controls-button", n]), ...o, children: e });
}
const JN = (e) => ({
  isInteractive: e.nodesDraggable || e.nodesConnectable || e.elementsSelectable,
  minZoomReached: e.transform[2] <= e.minZoom,
  maxZoomReached: e.transform[2] >= e.maxZoom,
  ariaLabelConfig: e.ariaLabelConfig
});
function _h({ style: e, showZoom: n = !0, showFitView: o = !0, showInteractive: s = !0, fitViewOptions: i, onZoomIn: l, onZoomOut: c, onFitView: u, onInteractiveChange: p, className: g, children: m, position: h = "bottom-left", orientation: w = "vertical", "aria-label": C }) {
  const x = He(), { isInteractive: I, minZoomReached: b, maxZoomReached: _, ariaLabelConfig: k } = Te(JN, Le), { zoomIn: A, zoomOut: S, fitView: V } = Ou(), G = () => {
    A(), l == null || l();
  }, T = () => {
    S(), c == null || c();
  }, K = () => {
    V(i), u == null || u();
  }, D = () => {
    x.setState({
      nodesDraggable: !I,
      nodesConnectable: !I,
      elementsSelectable: !I
    }), p == null || p(!I);
  }, F = w === "horizontal" ? "horizontal" : "vertical";
  return d.jsxs(bn, { className: Qe(["react-flow__controls", F, g]), position: h, style: e, "data-testid": "rf__controls", "aria-label": C ?? k["controls.ariaLabel"], children: [n && d.jsxs(d.Fragment, { children: [d.jsx(fi, { onClick: G, className: "react-flow__controls-zoomin", title: k["controls.zoomIn.ariaLabel"], "aria-label": k["controls.zoomIn.ariaLabel"], disabled: _, children: d.jsx(ZN, {}) }), d.jsx(fi, { onClick: T, className: "react-flow__controls-zoomout", title: k["controls.zoomOut.ariaLabel"], "aria-label": k["controls.zoomOut.ariaLabel"], disabled: b, children: d.jsx(YN, {}) })] }), o && d.jsx(fi, { className: "react-flow__controls-fitview", onClick: K, title: k["controls.fitView.ariaLabel"], "aria-label": k["controls.fitView.ariaLabel"], children: d.jsx(UN, {}) }), s && d.jsx(fi, { className: "react-flow__controls-interactive", onClick: D, title: k["controls.interactive.ariaLabel"], "aria-label": k["controls.interactive.ariaLabel"], children: I ? d.jsx(QN, {}) : d.jsx($N, {}) }), m] });
}
_h.displayName = "Controls";
const qN = j.memo(_h);
function e2({ id: e, x: n, y: o, width: s, height: i, style: l, color: c, strokeColor: u, strokeWidth: p, className: g, borderRadius: m, shapeRendering: h, selected: w, onClick: C }) {
  const { background: x, backgroundColor: I } = l || {}, b = c || x || I;
  return d.jsx("rect", { className: Qe(["react-flow__minimap-node", { selected: w }, g]), x: n, y: o, rx: m, ry: m, width: s, height: i, style: {
    fill: b,
    stroke: u,
    strokeWidth: p
  }, shapeRendering: h, onClick: C ? (_) => C(_, e) : void 0 });
}
const t2 = j.memo(e2), n2 = (e) => e.nodes.map((n) => n.id), qc = (e) => e instanceof Function ? e : () => e;
function r2({
  nodeStrokeColor: e,
  nodeColor: n,
  nodeClassName: o = "",
  nodeBorderRadius: s = 5,
  nodeStrokeWidth: i,
  /*
   * We need to rename the prop to be `CapitalCase` so that JSX will render it as
   * a component properly.
   */
  nodeComponent: l = t2,
  onClick: c
}) {
  const u = Te(n2, Le), p = qc(n), g = qc(e), m = qc(o), h = typeof window > "u" || window.chrome ? "crispEdges" : "geometricPrecision";
  return d.jsx(d.Fragment, { children: u.map((w) => (
    /*
     * The split of responsibilities between MiniMapNodes and
     * NodeComponentWrapper may appear weird. However, it’s designed to
     * minimize the cost of updates when individual nodes change.
     *
     * For more details, see a similar commit in `NodeRenderer/index.tsx`.
     */
    d.jsx(a2, { id: w, nodeColorFunc: p, nodeStrokeColorFunc: g, nodeClassNameFunc: m, nodeBorderRadius: s, nodeStrokeWidth: i, NodeComponent: l, onClick: c, shapeRendering: h }, w)
  )) });
}
function o2({ id: e, nodeColorFunc: n, nodeStrokeColorFunc: o, nodeClassNameFunc: s, nodeBorderRadius: i, nodeStrokeWidth: l, shapeRendering: c, NodeComponent: u, onClick: p }) {
  const { node: g, x: m, y: h, width: w, height: C } = Te((x) => {
    const { internals: I } = x.nodeLookup.get(e), b = I.userNode, { x: _, y: k } = I.positionAbsolute, { width: A, height: S } = kn(b);
    return {
      node: b,
      x: _,
      y: k,
      width: A,
      height: S
    };
  }, Le);
  return !g || g.hidden || !km(g) ? null : d.jsx(u, { x: m, y: h, width: w, height: C, style: g.style, selected: !!g.selected, className: s(g), color: n(g), borderRadius: i, strokeColor: o(g), strokeWidth: l, shapeRendering: c, onClick: p, id: g.id });
}
const a2 = j.memo(o2);
var s2 = j.memo(r2);
const i2 = 200, l2 = 150, c2 = (e) => !e.hidden, u2 = (e) => {
  const n = {
    x: -e.transform[0] / e.transform[2],
    y: -e.transform[1] / e.transform[2],
    width: e.width / e.transform[2],
    height: e.height / e.transform[2]
  };
  return {
    viewBB: n,
    boundingRect: e.nodeLookup.size > 0 ? Sm(Da(e.nodeLookup, { filter: c2 }), n) : n,
    rfId: e.rfId,
    panZoom: e.panZoom,
    translateExtent: e.translateExtent,
    flowWidth: e.width,
    flowHeight: e.height,
    ariaLabelConfig: e.ariaLabelConfig
  };
}, d2 = "react-flow__minimap-desc";
function Nh({
  style: e,
  className: n,
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
  onClick: C,
  onNodeClick: x,
  pannable: I = !1,
  zoomable: b = !1,
  ariaLabel: _,
  inversePan: k,
  zoomStep: A = 1,
  offsetScale: S = 5
}) {
  const V = He(), G = j.useRef(null), { boundingRect: T, viewBB: K, rfId: D, panZoom: F, translateExtent: z, flowWidth: W, flowHeight: q, ariaLabelConfig: R } = Te(u2, Le), Y = (e == null ? void 0 : e.width) ?? i2, H = (e == null ? void 0 : e.height) ?? l2, U = T.width / Y, E = T.height / H, P = Math.max(U, E), Z = P * Y, M = P * H, L = S * P, te = T.x - (Z - T.width) / 2 - L, re = T.y - (M - T.height) / 2 - L, le = Z + L * 2, ue = M + L * 2, fe = `${d2}-${D}`, ne = j.useRef(0), pe = j.useRef();
  ne.current = P, j.useEffect(() => {
    if (G.current && F)
      return pe.current = Ab({
        domNode: G.current,
        panZoom: F,
        getTransform: () => V.getState().transform,
        getViewScale: () => ne.current
      }), () => {
        var xe;
        (xe = pe.current) == null || xe.destroy();
      };
  }, [F]), j.useEffect(() => {
    var xe;
    (xe = pe.current) == null || xe.update({
      translateExtent: z,
      width: W,
      height: q,
      inversePan: k,
      pannable: I,
      zoomStep: A,
      zoomable: b
    });
  }, [I, b, k, A, z, W, q]);
  const be = C ? (xe) => {
    var je;
    const [Re, Be] = ((je = pe.current) == null ? void 0 : je.pointer(xe)) || [0, 0];
    C(xe, { x: Re, y: Be });
  } : void 0, _e = x ? j.useCallback((xe, Re) => {
    const Be = V.getState().nodeLookup.get(Re).internals.userNode;
    x(xe, Be);
  }, []) : void 0, Ce = _ ?? R["minimap.ariaLabel"];
  return d.jsx(bn, { position: w, style: {
    ...e,
    "--xy-minimap-background-color-props": typeof p == "string" ? p : void 0,
    "--xy-minimap-mask-background-color-props": typeof g == "string" ? g : void 0,
    "--xy-minimap-mask-stroke-color-props": typeof m == "string" ? m : void 0,
    "--xy-minimap-mask-stroke-width-props": typeof h == "number" ? h * P : void 0,
    "--xy-minimap-node-background-color-props": typeof s == "string" ? s : void 0,
    "--xy-minimap-node-stroke-color-props": typeof o == "string" ? o : void 0,
    "--xy-minimap-node-stroke-width-props": typeof c == "number" ? c : void 0
  }, className: Qe(["react-flow__minimap", n]), "data-testid": "rf__minimap", children: d.jsxs("svg", { width: Y, height: H, viewBox: `${te} ${re} ${le} ${ue}`, className: "react-flow__minimap-svg", role: "img", "aria-labelledby": fe, ref: G, onClick: be, children: [Ce && d.jsx("title", { id: fe, children: Ce }), d.jsx(s2, { onClick: _e, nodeColor: s, nodeStrokeColor: o, nodeBorderRadius: l, nodeClassName: i, nodeStrokeWidth: c, nodeComponent: u }), d.jsx("path", { className: "react-flow__minimap-mask", d: `M${te - L},${re - L}h${le + L * 2}v${ue + L * 2}h${-le - L * 2}z
        M${K.x},${K.y}h${K.width}v${K.height}h${-K.width}z`, fillRule: "evenodd", pointerEvents: "none" })] }) });
}
Nh.displayName = "MiniMap";
const f2 = j.memo(Nh), p2 = (e) => (n) => e ? `${Math.max(1 / n.transform[2], 1)}` : void 0, g2 = {
  [vo.Line]: "right",
  [vo.Handle]: "bottom-right"
};
function m2({ nodeId: e, position: n, variant: o = vo.Handle, className: s, style: i = void 0, children: l, color: c, minWidth: u = 10, minHeight: p = 10, maxWidth: g = Number.MAX_VALUE, maxHeight: m = Number.MAX_VALUE, keepAspectRatio: h = !1, resizeDirection: w, autoScale: C = !0, shouldResize: x, onResizeStart: I, onResize: b, onResizeEnd: _ }) {
  const k = rh(), A = typeof e == "string" ? e : k, S = He(), V = j.useRef(null), G = o === vo.Handle, T = Te(j.useCallback(p2(G && C), [G, C]), Le), K = j.useRef(null), D = n ?? g2[o];
  j.useEffect(() => {
    if (!(!V.current || !A))
      return K.current || (K.current = zb({
        domNode: V.current,
        nodeId: A,
        getStoreItems: () => {
          const { nodeLookup: z, transform: W, snapGrid: q, snapToGrid: R, nodeOrigin: Y, domNode: H } = S.getState();
          return {
            nodeLookup: z,
            transform: W,
            snapGrid: q,
            snapToGrid: R,
            nodeOrigin: Y,
            paneDomNode: H
          };
        },
        onChange: (z, W) => {
          const { triggerNodeChanges: q, nodeLookup: R, parentLookup: Y, nodeOrigin: H } = S.getState(), U = [], E = { x: z.x, y: z.y }, P = R.get(A);
          if (P && P.expandParent && P.parentId) {
            const Z = P.origin ?? H, M = z.width ?? P.measured.width ?? 0, L = z.height ?? P.measured.height ?? 0, te = {
              id: P.id,
              parentId: P.parentId,
              rect: {
                width: M,
                height: L,
                ...jm({
                  x: z.x ?? P.position.x,
                  y: z.y ?? P.position.y
                }, { width: M, height: L }, P.parentId, R, Z)
              }
            }, re = Fu([te], R, Y, H);
            U.push(...re), E.x = z.x ? Math.max(Z[0] * M, z.x) : void 0, E.y = z.y ? Math.max(Z[1] * L, z.y) : void 0;
          }
          if (E.x !== void 0 && E.y !== void 0) {
            const Z = {
              id: A,
              type: "position",
              position: { ...E }
            };
            U.push(Z);
          }
          if (z.width !== void 0 && z.height !== void 0) {
            const M = {
              id: A,
              type: "dimensions",
              resizing: !0,
              setAttributes: w ? w === "horizontal" ? "width" : "height" : !0,
              dimensions: {
                width: z.width,
                height: z.height
              }
            };
            U.push(M);
          }
          for (const Z of W) {
            const M = {
              ...Z,
              type: "position"
            };
            U.push(M);
          }
          q(U);
        },
        onEnd: ({ width: z, height: W }) => {
          const q = {
            id: A,
            type: "dimensions",
            resizing: !1,
            dimensions: {
              width: z,
              height: W
            }
          };
          S.getState().triggerNodeChanges([q]);
        }
      })), K.current.update({
        controlPosition: D,
        boundaries: {
          minWidth: u,
          minHeight: p,
          maxWidth: g,
          maxHeight: m
        },
        keepAspectRatio: h,
        resizeDirection: w,
        onResizeStart: I,
        onResize: b,
        onResizeEnd: _,
        shouldResize: x
      }), () => {
        var z;
        (z = K.current) == null || z.destroy();
      };
  }, [
    D,
    u,
    p,
    g,
    m,
    h,
    I,
    b,
    _,
    x
  ]);
  const F = D.split("-");
  return d.jsx("div", { className: Qe(["react-flow__resize-control", "nodrag", ...F, o, s]), ref: V, style: {
    ...i,
    scale: T,
    ...c && { [G ? "backgroundColor" : "borderColor"]: c }
  }, children: l });
}
j.memo(m2);
const h2 = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
let ft = (e = 21) => {
  let n = "", o = crypto.getRandomValues(new Uint8Array(e |= 0));
  for (; e--; )
    n += h2[o[e] & 63];
  return n;
};
const Io = /* @__PURE__ */ new Map();
function Se(e) {
  Io.set(e.manifest.type, e);
}
function ct(e) {
  const n = Io.get(e);
  if (!n) throw new Error(`Unknown module type: ${e}`);
  return n.manifest;
}
function Ah(e) {
  const n = Io.get(e);
  if (!n) throw new Error(`Unknown module type: ${e}`);
  return n.factory;
}
function y2() {
  const e = {};
  for (const [n, o] of Io)
    e[n] = o.component;
  return e;
}
function w2() {
  return Array.from(Io.values()).map((e) => e.manifest);
}
function v2() {
  Io.clear();
}
function x2(e, n, o) {
  if (n === o || n === "mono" && o === "stereo") return null;
  const s = e.createChannelSplitter(2), i = e.createChannelMerger(1), l = e.createGain(), c = e.createGain();
  return l.gain.value = 0.707, c.gain.value = 0.707, s.connect(l, 0), s.connect(c, 1), l.connect(i, 0, 0), c.connect(i, 0, 0), { input: s, output: i };
}
const Wu = /* @__PURE__ */ new Map();
function Xu(e, n) {
  Wu.set(e, n);
}
function Fa(e) {
  return Wu.get(e);
}
function Sh() {
  Wu.clear();
}
function Hi(e, n) {
  const o = new Float32Array(n), s = e.numberOfChannels, i = e.length, l = i / n, c = [];
  for (let u = 0; u < s; u++)
    c.push(e.getChannelData(u));
  for (let u = 0; u < n; u++) {
    const p = Math.floor(u * l), g = Math.min(Math.floor((u + 1) * l), i);
    let m = 0;
    for (let h = p; h < g; h++) {
      let w = 0;
      for (let x = 0; x < s; x++)
        w += Math.abs(c[x][h]);
      const C = w / s;
      C > m && (m = C);
    }
    o[u] = m;
  }
  return o;
}
function I2(e, n) {
  const o = new Float32Array(n), s = new Float32Array(n), i = e.length, l = i / n, c = e.getChannelData(0), u = e.numberOfChannels > 1 ? e.getChannelData(1) : c;
  for (let p = 0; p < n; p++) {
    const g = Math.floor(p * l), m = Math.min(Math.floor((p + 1) * l), i);
    let h = 0, w = 0;
    for (let C = g; C < m; C++) {
      const x = Math.abs(c[C]), I = Math.abs(u[C]);
      x > h && (h = x), I > w && (w = I);
    }
    o[p] = h, s[p] = w;
  }
  return { left: o, right: s };
}
let kh = null;
function C2(e) {
  kh = e;
}
function jh() {
  return kh;
}
let Rg = !1;
async function b2(e) {
  Rg || (await e.audioWorklet.addModule(
    new URL("data:text/javascript;base64,LyoqCiAqIEF0b21pYyBEU1AgUHJpbWl0aXZlIFByb2Nlc3NvcnMKICoKICogVGhlc2UgQXVkaW9Xb3JrbGV0UHJvY2Vzc29ycyBhcmUgdGhlIGlycmVkdWNpYmxlIGJ1aWxkaW5nIGJsb2NrcyBmcm9tIHdoaWNoCiAqIGFsbCBjb21wb3NpdGUgbW9kdWxlcyAoY29tcHJlc3NvciwgRVEsIGRlbGF5LCBldGMuKSBhcmUgY29uc3RydWN0ZWQuCiAqIEVhY2ggb3BlcmF0ZXMgc2FtcGxlLWJ5LXNhbXBsZSBvbiAxMjgtc2FtcGxlIGZyYW1lcy4KICovCgovLyDilIDilIDilIAgTWF0aCBPcGVyYXRpb25zIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgAoKY2xhc3MgTXVsdGlwbHlQcm9jZXNzb3IgZXh0ZW5kcyBBdWRpb1dvcmtsZXRQcm9jZXNzb3IgewogIHByb2Nlc3MoaW5wdXRzLCBvdXRwdXRzKSB7CiAgICBjb25zdCBhID0gaW5wdXRzWzBdOwogICAgY29uc3QgYiA9IGlucHV0c1sxXTsKICAgIGNvbnN0IG91dCA9IG91dHB1dHNbMF07CiAgICBmb3IgKGxldCBjaCA9IDA7IGNoIDwgb3V0Lmxlbmd0aDsgY2grKykgewogICAgICBjb25zdCBvdXRDaCA9IG91dFtjaF07CiAgICAgIGNvbnN0IGFDaCA9IGFbMF0gPyBhWzBdW2NoXSB8fCBhWzBdWzBdIDogbnVsbDsKICAgICAgY29uc3QgYkNoID0gYlswXSA/IGJbMF1bY2hdIHx8IGJbMF1bMF0gOiBudWxsOwogICAgICBpZiAoYUNoICYmIGJDaCkgewogICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3V0Q2gubGVuZ3RoOyBpKyspIHsKICAgICAgICAgIG91dENoW2ldID0gYUNoW2ldICogYkNoW2ldOwogICAgICAgIH0KICAgICAgfQogICAgfQogICAgcmV0dXJuIHRydWU7CiAgfQp9CnJlZ2lzdGVyUHJvY2Vzc29yKCdtdWx0aXBseS1wcm9jZXNzb3InLCBNdWx0aXBseVByb2Nlc3Nvcik7CgpjbGFzcyBBZGRQcm9jZXNzb3IgZXh0ZW5kcyBBdWRpb1dvcmtsZXRQcm9jZXNzb3IgewogIHByb2Nlc3MoaW5wdXRzLCBvdXRwdXRzKSB7CiAgICBjb25zdCBhID0gaW5wdXRzWzBdOwogICAgY29uc3QgYiA9IGlucHV0c1sxXTsKICAgIGNvbnN0IG91dCA9IG91dHB1dHNbMF07CiAgICBmb3IgKGxldCBjaCA9IDA7IGNoIDwgb3V0Lmxlbmd0aDsgY2grKykgewogICAgICBjb25zdCBvdXRDaCA9IG91dFtjaF07CiAgICAgIGNvbnN0IGFDaCA9IGFbMF0gPyBhWzBdW2NoXSB8fCBhWzBdWzBdIDogbnVsbDsKICAgICAgY29uc3QgYkNoID0gYlswXSA/IGJbMF1bY2hdIHx8IGJbMF1bMF0gOiBudWxsOwogICAgICBpZiAoYUNoICYmIGJDaCkgewogICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3V0Q2gubGVuZ3RoOyBpKyspIHsKICAgICAgICAgIG91dENoW2ldID0gYUNoW2ldICsgYkNoW2ldOwogICAgICAgIH0KICAgICAgfSBlbHNlIGlmIChhQ2gpIHsKICAgICAgICBvdXRDaC5zZXQoYUNoKTsKICAgICAgfSBlbHNlIGlmIChiQ2gpIHsKICAgICAgICBvdXRDaC5zZXQoYkNoKTsKICAgICAgfQogICAgfQogICAgcmV0dXJuIHRydWU7CiAgfQp9CnJlZ2lzdGVyUHJvY2Vzc29yKCdhZGQtcHJvY2Vzc29yJywgQWRkUHJvY2Vzc29yKTsKCmNsYXNzIFN1YnRyYWN0UHJvY2Vzc29yIGV4dGVuZHMgQXVkaW9Xb3JrbGV0UHJvY2Vzc29yIHsKICBwcm9jZXNzKGlucHV0cywgb3V0cHV0cykgewogICAgY29uc3QgYSA9IGlucHV0c1swXTsKICAgIGNvbnN0IGIgPSBpbnB1dHNbMV07CiAgICBjb25zdCBvdXQgPSBvdXRwdXRzWzBdOwogICAgZm9yIChsZXQgY2ggPSAwOyBjaCA8IG91dC5sZW5ndGg7IGNoKyspIHsKICAgICAgY29uc3Qgb3V0Q2ggPSBvdXRbY2hdOwogICAgICBjb25zdCBhQ2ggPSBhWzBdID8gYVswXVtjaF0gfHwgYVswXVswXSA6IG51bGw7CiAgICAgIGNvbnN0IGJDaCA9IGJbMF0gPyBiWzBdW2NoXSB8fCBiWzBdWzBdIDogbnVsbDsKICAgICAgaWYgKGFDaCAmJiBiQ2gpIHsKICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG91dENoLmxlbmd0aDsgaSsrKSB7CiAgICAgICAgICBvdXRDaFtpXSA9IGFDaFtpXSAtIGJDaFtpXTsKICAgICAgICB9CiAgICAgIH0gZWxzZSBpZiAoYUNoKSB7CiAgICAgICAgb3V0Q2guc2V0KGFDaCk7CiAgICAgIH0KICAgIH0KICAgIHJldHVybiB0cnVlOwogIH0KfQpyZWdpc3RlclByb2Nlc3Nvcignc3VidHJhY3QtcHJvY2Vzc29yJywgU3VidHJhY3RQcm9jZXNzb3IpOwoKY2xhc3MgQWJzUHJvY2Vzc29yIGV4dGVuZHMgQXVkaW9Xb3JrbGV0UHJvY2Vzc29yIHsKICBwcm9jZXNzKGlucHV0cywgb3V0cHV0cykgewogICAgY29uc3QgaW5wdXQgPSBpbnB1dHNbMF07CiAgICBjb25zdCBvdXQgPSBvdXRwdXRzWzBdOwogICAgZm9yIChsZXQgY2ggPSAwOyBjaCA8IG91dC5sZW5ndGg7IGNoKyspIHsKICAgICAgY29uc3Qgb3V0Q2ggPSBvdXRbY2hdOwogICAgICBjb25zdCBpbkNoID0gaW5wdXRbMF0gPyBpbnB1dFswXVtjaF0gfHwgaW5wdXRbMF1bMF0gOiBudWxsOwogICAgICBpZiAoaW5DaCkgewogICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3V0Q2gubGVuZ3RoOyBpKyspIHsKICAgICAgICAgIG91dENoW2ldID0gTWF0aC5hYnMoaW5DaFtpXSk7CiAgICAgICAgfQogICAgICB9CiAgICB9CiAgICByZXR1cm4gdHJ1ZTsKICB9Cn0KcmVnaXN0ZXJQcm9jZXNzb3IoJ2Ficy1wcm9jZXNzb3InLCBBYnNQcm9jZXNzb3IpOwoKLy8g4pSA4pSA4pSAIENvbXBhcmlzb24gT3BlcmF0aW9ucyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIAKCmNsYXNzIE1heFByb2Nlc3NvciBleHRlbmRzIEF1ZGlvV29ya2xldFByb2Nlc3NvciB7CiAgcHJvY2VzcyhpbnB1dHMsIG91dHB1dHMpIHsKICAgIGNvbnN0IGEgPSBpbnB1dHNbMF07CiAgICBjb25zdCBiID0gaW5wdXRzWzFdOwogICAgY29uc3Qgb3V0ID0gb3V0cHV0c1swXTsKICAgIGZvciAobGV0IGNoID0gMDsgY2ggPCBvdXQubGVuZ3RoOyBjaCsrKSB7CiAgICAgIGNvbnN0IG91dENoID0gb3V0W2NoXTsKICAgICAgY29uc3QgYUNoID0gYVswXSA/IGFbMF1bY2hdIHx8IGFbMF1bMF0gOiBudWxsOwogICAgICBjb25zdCBiQ2ggPSBiWzBdID8gYlswXVtjaF0gfHwgYlswXVswXSA6IG51bGw7CiAgICAgIGlmIChhQ2ggJiYgYkNoKSB7CiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvdXRDaC5sZW5ndGg7IGkrKykgewogICAgICAgICAgb3V0Q2hbaV0gPSBNYXRoLm1heChhQ2hbaV0sIGJDaFtpXSk7CiAgICAgICAgfQogICAgICB9IGVsc2UgaWYgKGFDaCkgewogICAgICAgIG91dENoLnNldChhQ2gpOwogICAgICB9IGVsc2UgaWYgKGJDaCkgewogICAgICAgIG91dENoLnNldChiQ2gpOwogICAgICB9CiAgICB9CiAgICByZXR1cm4gdHJ1ZTsKICB9Cn0KcmVnaXN0ZXJQcm9jZXNzb3IoJ21heC1wcm9jZXNzb3InLCBNYXhQcm9jZXNzb3IpOwoKY2xhc3MgQ29tcGFyZUd0UHJvY2Vzc29yIGV4dGVuZHMgQXVkaW9Xb3JrbGV0UHJvY2Vzc29yIHsKICBwcm9jZXNzKGlucHV0cywgb3V0cHV0cykgewogICAgY29uc3QgYSA9IGlucHV0c1swXTsKICAgIGNvbnN0IGIgPSBpbnB1dHNbMV07CiAgICBjb25zdCBvdXQgPSBvdXRwdXRzWzBdOwogICAgZm9yIChsZXQgY2ggPSAwOyBjaCA8IG91dC5sZW5ndGg7IGNoKyspIHsKICAgICAgY29uc3Qgb3V0Q2ggPSBvdXRbY2hdOwogICAgICBjb25zdCBhQ2ggPSBhWzBdID8gYVswXVtjaF0gfHwgYVswXVswXSA6IG51bGw7CiAgICAgIGNvbnN0IGJDaCA9IGJbMF0gPyBiWzBdW2NoXSB8fCBiWzBdWzBdIDogbnVsbDsKICAgICAgaWYgKGFDaCAmJiBiQ2gpIHsKICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG91dENoLmxlbmd0aDsgaSsrKSB7CiAgICAgICAgICBvdXRDaFtpXSA9IGFDaFtpXSA+IGJDaFtpXSA/IDEuMCA6IDAuMDsKICAgICAgICB9CiAgICAgIH0KICAgIH0KICAgIHJldHVybiB0cnVlOwogIH0KfQpyZWdpc3RlclByb2Nlc3NvcignY29tcGFyZS1ndC1wcm9jZXNzb3InLCBDb21wYXJlR3RQcm9jZXNzb3IpOwoKLy8g4pSA4pSA4pSAIFNpZ25hbCBPcGVyYXRpb25zIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgAoKY2xhc3MgVW5pdERlbGF5UHJvY2Vzc29yIGV4dGVuZHMgQXVkaW9Xb3JrbGV0UHJvY2Vzc29yIHsKICBjb25zdHJ1Y3RvcigpIHsKICAgIHN1cGVyKCk7CiAgICB0aGlzLl9wcmV2ID0gbmV3IEZsb2F0MzJBcnJheSg4KTsgLy8gdXAgdG8gOCBjaGFubmVscwogIH0KICBwcm9jZXNzKGlucHV0cywgb3V0cHV0cykgewogICAgY29uc3QgaW5wdXQgPSBpbnB1dHNbMF07CiAgICBjb25zdCBvdXQgPSBvdXRwdXRzWzBdOwogICAgZm9yIChsZXQgY2ggPSAwOyBjaCA8IG91dC5sZW5ndGg7IGNoKyspIHsKICAgICAgY29uc3Qgb3V0Q2ggPSBvdXRbY2hdOwogICAgICBjb25zdCBpbkNoID0gaW5wdXRbMF0gPyBpbnB1dFswXVtjaF0gfHwgaW5wdXRbMF1bMF0gOiBudWxsOwogICAgICBpZiAoaW5DaCkgewogICAgICAgIC8vIEZpcnN0IHNhbXBsZSBnZXRzIHRoZSBzdG9yZWQgcHJldmlvdXMgdmFsdWUKICAgICAgICBvdXRDaFswXSA9IHRoaXMuX3ByZXZbY2hdOwogICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgb3V0Q2gubGVuZ3RoOyBpKyspIHsKICAgICAgICAgIG91dENoW2ldID0gaW5DaFtpIC0gMV07CiAgICAgICAgfQogICAgICAgIHRoaXMuX3ByZXZbY2hdID0gaW5DaFtpbkNoLmxlbmd0aCAtIDFdOwogICAgICB9CiAgICB9CiAgICByZXR1cm4gdHJ1ZTsKICB9Cn0KcmVnaXN0ZXJQcm9jZXNzb3IoJ3VuaXQtZGVsYXktcHJvY2Vzc29yJywgVW5pdERlbGF5UHJvY2Vzc29yKTsKCmNsYXNzIFNlbGVjdG9yUHJvY2Vzc29yIGV4dGVuZHMgQXVkaW9Xb3JrbGV0UHJvY2Vzc29yIHsKICBwcm9jZXNzKGlucHV0cywgb3V0cHV0cykgewogICAgY29uc3QgYSA9IGlucHV0c1swXTsKICAgIGNvbnN0IGIgPSBpbnB1dHNbMV07CiAgICBjb25zdCBjdHJsID0gaW5wdXRzWzJdOwogICAgY29uc3Qgb3V0ID0gb3V0cHV0c1swXTsKICAgIGZvciAobGV0IGNoID0gMDsgY2ggPCBvdXQubGVuZ3RoOyBjaCsrKSB7CiAgICAgIGNvbnN0IG91dENoID0gb3V0W2NoXTsKICAgICAgY29uc3QgYUNoID0gYVswXSA/IGFbMF1bY2hdIHx8IGFbMF1bMF0gOiBudWxsOwogICAgICBjb25zdCBiQ2ggPSBiWzBdID8gYlswXVtjaF0gfHwgYlswXVswXSA6IG51bGw7CiAgICAgIGNvbnN0IGNDaCA9IGN0cmxbMF0gPyBjdHJsWzBdW2NoXSB8fCBjdHJsWzBdWzBdIDogbnVsbDsKICAgICAgaWYgKGFDaCAmJiBiQ2ggJiYgY0NoKSB7CiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvdXRDaC5sZW5ndGg7IGkrKykgewogICAgICAgICAgb3V0Q2hbaV0gPSBjQ2hbaV0gPj0gMC41ID8gYkNoW2ldIDogYUNoW2ldOwogICAgICAgIH0KICAgICAgfSBlbHNlIGlmIChhQ2gpIHsKICAgICAgICBvdXRDaC5zZXQoYUNoKTsKICAgICAgfQogICAgfQogICAgcmV0dXJuIHRydWU7CiAgfQp9CnJlZ2lzdGVyUHJvY2Vzc29yKCdzZWxlY3Rvci1wcm9jZXNzb3InLCBTZWxlY3RvclByb2Nlc3Nvcik7CgpjbGFzcyBDb25zdGFudFByb2Nlc3NvciBleHRlbmRzIEF1ZGlvV29ya2xldFByb2Nlc3NvciB7CiAgc3RhdGljIGdldCBwYXJhbWV0ZXJEZXNjcmlwdG9ycygpIHsKICAgIHJldHVybiBbeyBuYW1lOiAndmFsdWUnLCBkZWZhdWx0VmFsdWU6IDAsIGF1dG9tYXRpb25SYXRlOiAnYS1yYXRlJyB9XTsKICB9CiAgcHJvY2VzcyhfaW5wdXRzLCBvdXRwdXRzLCBwYXJhbWV0ZXJzKSB7CiAgICBjb25zdCBvdXQgPSBvdXRwdXRzWzBdOwogICAgY29uc3QgdmFsdWVzID0gcGFyYW1ldGVycy52YWx1ZTsKICAgIGZvciAobGV0IGNoID0gMDsgY2ggPCBvdXQubGVuZ3RoOyBjaCsrKSB7CiAgICAgIGNvbnN0IG91dENoID0gb3V0W2NoXTsKICAgICAgaWYgKHZhbHVlcy5sZW5ndGggPT09IDEpIHsKICAgICAgICBvdXRDaC5maWxsKHZhbHVlc1swXSk7CiAgICAgIH0gZWxzZSB7CiAgICAgICAgb3V0Q2guc2V0KHZhbHVlcyk7CiAgICAgIH0KICAgIH0KICAgIHJldHVybiB0cnVlOwogIH0KfQpyZWdpc3RlclByb2Nlc3NvcignY29uc3RhbnQtcHJvY2Vzc29yJywgQ29uc3RhbnRQcm9jZXNzb3IpOwoKLy8g4pSA4pSA4pSAIENvbnZlcnNpb24gT3BlcmF0aW9ucyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIAKCmNsYXNzIERiVG9MaW5Qcm9jZXNzb3IgZXh0ZW5kcyBBdWRpb1dvcmtsZXRQcm9jZXNzb3IgewogIHByb2Nlc3MoaW5wdXRzLCBvdXRwdXRzKSB7CiAgICBjb25zdCBpbnB1dCA9IGlucHV0c1swXTsKICAgIGNvbnN0IG91dCA9IG91dHB1dHNbMF07CiAgICBmb3IgKGxldCBjaCA9IDA7IGNoIDwgb3V0Lmxlbmd0aDsgY2grKykgewogICAgICBjb25zdCBvdXRDaCA9IG91dFtjaF07CiAgICAgIGNvbnN0IGluQ2ggPSBpbnB1dFswXSA/IGlucHV0WzBdW2NoXSB8fCBpbnB1dFswXVswXSA6IG51bGw7CiAgICAgIGlmIChpbkNoKSB7CiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvdXRDaC5sZW5ndGg7IGkrKykgewogICAgICAgICAgb3V0Q2hbaV0gPSBNYXRoLnBvdygxMCwgaW5DaFtpXSAvIDIwKTsKICAgICAgICB9CiAgICAgIH0KICAgIH0KICAgIHJldHVybiB0cnVlOwogIH0KfQpyZWdpc3RlclByb2Nlc3NvcignZGItdG8tbGluLXByb2Nlc3NvcicsIERiVG9MaW5Qcm9jZXNzb3IpOwoKY2xhc3MgTGluVG9EYlByb2Nlc3NvciBleHRlbmRzIEF1ZGlvV29ya2xldFByb2Nlc3NvciB7CiAgcHJvY2VzcyhpbnB1dHMsIG91dHB1dHMpIHsKICAgIGNvbnN0IGlucHV0ID0gaW5wdXRzWzBdOwogICAgY29uc3Qgb3V0ID0gb3V0cHV0c1swXTsKICAgIGZvciAobGV0IGNoID0gMDsgY2ggPCBvdXQubGVuZ3RoOyBjaCsrKSB7CiAgICAgIGNvbnN0IG91dENoID0gb3V0W2NoXTsKICAgICAgY29uc3QgaW5DaCA9IGlucHV0WzBdID8gaW5wdXRbMF1bY2hdIHx8IGlucHV0WzBdWzBdIDogbnVsbDsKICAgICAgaWYgKGluQ2gpIHsKICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG91dENoLmxlbmd0aDsgaSsrKSB7CiAgICAgICAgICBjb25zdCB2YWwgPSBNYXRoLmFicyhpbkNoW2ldKTsKICAgICAgICAgIG91dENoW2ldID0gdmFsID4gMWUtMTAgPyAyMCAqIE1hdGgubG9nMTAodmFsKSA6IC0yMDA7CiAgICAgICAgfQogICAgICB9CiAgICB9CiAgICByZXR1cm4gdHJ1ZTsKICB9Cn0KcmVnaXN0ZXJQcm9jZXNzb3IoJ2xpbi10by1kYi1wcm9jZXNzb3InLCBMaW5Ub0RiUHJvY2Vzc29yKTsKCi8vIOKUgOKUgOKUgCBWaXN1YWxpemF0aW9uIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgAoKY2xhc3MgUHJvYmVQcm9jZXNzb3IgZXh0ZW5kcyBBdWRpb1dvcmtsZXRQcm9jZXNzb3IgewogIGNvbnN0cnVjdG9yKCkgewogICAgc3VwZXIoKTsKICAgIHRoaXMuX2NvdW50ZXIgPSAwOwogIH0KICBwcm9jZXNzKGlucHV0cywgb3V0cHV0cykgewogICAgY29uc3QgaW5wdXQgPSBpbnB1dHNbMF07CiAgICBjb25zdCBvdXQgPSBvdXRwdXRzWzBdOwogICAgLy8gUGFzcyB0aHJvdWdoCiAgICBmb3IgKGxldCBjaCA9IDA7IGNoIDwgb3V0Lmxlbmd0aDsgY2grKykgewogICAgICBjb25zdCBpbkNoID0gaW5wdXRbMF0gPyBpbnB1dFswXVtjaF0gfHwgaW5wdXRbMF1bMF0gOiBudWxsOwogICAgICBpZiAoaW5DaCkgewogICAgICAgIG91dFtjaF0uc2V0KGluQ2gpOwogICAgICB9CiAgICB9CiAgICAvLyBSZXBvcnQgdmFsdWUgZXZlcnkgfjEwMG1zIChhdCA0NDEwMCBIeiwgMTI4IHNhbXBsZXMvZnJhbWUsIH4zNDQgZnJhbWVzL3NlYykKICAgIHRoaXMuX2NvdW50ZXIrKzsKICAgIGlmICh0aGlzLl9jb3VudGVyID49IDM0KSB7CiAgICAgIHRoaXMuX2NvdW50ZXIgPSAwOwogICAgICBjb25zdCBjaDAgPSBpbnB1dFswXSAmJiBpbnB1dFswXVswXSA/IGlucHV0WzBdWzBdIDogbnVsbDsKICAgICAgaWYgKGNoMCkgewogICAgICAgIHRoaXMucG9ydC5wb3N0TWVzc2FnZSh7IHZhbHVlOiBjaDBbMF0sIHBlYWs6IE1hdGgubWF4KC4uLmNoMC5tYXAoTWF0aC5hYnMpKSB9KTsKICAgICAgfQogICAgfQogICAgcmV0dXJuIHRydWU7CiAgfQp9CnJlZ2lzdGVyUHJvY2Vzc29yKCdwcm9iZS1wcm9jZXNzb3InLCBQcm9iZVByb2Nlc3Nvcik7CgovLyDilIDilIDilIAgQ29tcHJlc3Nvci1zcGVjaWZpYyBmdW5jdGlvbmFsIGJsb2NrcyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIAKCmNsYXNzIEVudmVsb3BlRGV0ZWN0b3JQcm9jZXNzb3IgZXh0ZW5kcyBBdWRpb1dvcmtsZXRQcm9jZXNzb3IgewogIHN0YXRpYyBnZXQgcGFyYW1ldGVyRGVzY3JpcHRvcnMoKSB7CiAgICByZXR1cm4gWwogICAgICB7IG5hbWU6ICdhdHRhY2snLCBkZWZhdWx0VmFsdWU6IDAuMDAzLCBhdXRvbWF0aW9uUmF0ZTogJ2stcmF0ZScgfSwKICAgICAgeyBuYW1lOiAncmVsZWFzZScsIGRlZmF1bHRWYWx1ZTogMC4yNSwgYXV0b21hdGlvblJhdGU6ICdrLXJhdGUnIH0sCiAgICBdOwogIH0KICBjb25zdHJ1Y3RvcigpIHsKICAgIHN1cGVyKCk7CiAgICB0aGlzLl9lbnZlbG9wZSA9IDA7CiAgfQogIHByb2Nlc3MoaW5wdXRzLCBvdXRwdXRzLCBwYXJhbWV0ZXJzKSB7CiAgICBjb25zdCBpbnB1dCA9IGlucHV0c1swXTsKICAgIGNvbnN0IG91dCA9IG91dHB1dHNbMF07CiAgICBjb25zdCBhdHRhY2tUaW1lID0gcGFyYW1ldGVycy5hdHRhY2tbMF07CiAgICBjb25zdCByZWxlYXNlVGltZSA9IHBhcmFtZXRlcnMucmVsZWFzZVswXTsKICAgIGNvbnN0IHNyID0gc2FtcGxlUmF0ZTsKICAgIC8vIENvbnZlcnQgdGltZSB0byBvbmUtcG9sZSBjb2VmZmljaWVudAogICAgY29uc3QgYXR0YWNrQ29lZmYgPSBhdHRhY2tUaW1lID4gMCA/IDEgLSBNYXRoLmV4cCgtMSAvIChzciAqIGF0dGFja1RpbWUpKSA6IDE7CiAgICBjb25zdCByZWxlYXNlQ29lZmYgPSByZWxlYXNlVGltZSA+IDAgPyAxIC0gTWF0aC5leHAoLTEgLyAoc3IgKiByZWxlYXNlVGltZSkpIDogMTsKCiAgICBjb25zdCBpbkNoID0gaW5wdXRbMF0gPyBpbnB1dFswXVswXSA6IG51bGw7CiAgICBpZiAoaW5DaCkgewogICAgICBjb25zdCBvdXRDaCA9IG91dFswXTsKICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbkNoLmxlbmd0aDsgaSsrKSB7CiAgICAgICAgY29uc3QgcmVjdGlmaWVkID0gTWF0aC5hYnMoaW5DaFtpXSk7CiAgICAgICAgY29uc3QgY29lZmYgPSByZWN0aWZpZWQgPiB0aGlzLl9lbnZlbG9wZSA/IGF0dGFja0NvZWZmIDogcmVsZWFzZUNvZWZmOwogICAgICAgIHRoaXMuX2VudmVsb3BlID0gY29lZmYgKiByZWN0aWZpZWQgKyAoMSAtIGNvZWZmKSAqIHRoaXMuX2VudmVsb3BlOwogICAgICAgIC8vIE91dHB1dCBhcyBkQgogICAgICAgIG91dENoW2ldID0gdGhpcy5fZW52ZWxvcGUgPiAxZS0xMCA/IDIwICogTWF0aC5sb2cxMCh0aGlzLl9lbnZlbG9wZSkgOiAtMjAwOwogICAgICB9CiAgICAgIC8vIENvcHkgdG8gb3RoZXIgb3V0cHV0IGNoYW5uZWxzCiAgICAgIGZvciAobGV0IGNoID0gMTsgY2ggPCBvdXQubGVuZ3RoOyBjaCsrKSB7CiAgICAgICAgb3V0W2NoXS5zZXQob3V0Q2gpOwogICAgICB9CiAgICB9CiAgICByZXR1cm4gdHJ1ZTsKICB9Cn0KcmVnaXN0ZXJQcm9jZXNzb3IoJ2VudmVsb3BlLWRldGVjdG9yLXByb2Nlc3NvcicsIEVudmVsb3BlRGV0ZWN0b3JQcm9jZXNzb3IpOwoKY2xhc3MgR2FpbkNvbXB1dGVyUHJvY2Vzc29yIGV4dGVuZHMgQXVkaW9Xb3JrbGV0UHJvY2Vzc29yIHsKICBzdGF0aWMgZ2V0IHBhcmFtZXRlckRlc2NyaXB0b3JzKCkgewogICAgcmV0dXJuIFsKICAgICAgeyBuYW1lOiAndGhyZXNob2xkJywgZGVmYXVsdFZhbHVlOiAtMTgsIGF1dG9tYXRpb25SYXRlOiAnay1yYXRlJyB9LAogICAgICB7IG5hbWU6ICdyYXRpbycsIGRlZmF1bHRWYWx1ZTogNCwgYXV0b21hdGlvblJhdGU6ICdrLXJhdGUnIH0sCiAgICBdOwogIH0KICBwcm9jZXNzKGlucHV0cywgb3V0cHV0cywgcGFyYW1ldGVycykgewogICAgY29uc3QgaW5wdXQgPSBpbnB1dHNbMF07CiAgICBjb25zdCBvdXQgPSBvdXRwdXRzWzBdOwogICAgY29uc3QgdGhyZXNob2xkID0gcGFyYW1ldGVycy50aHJlc2hvbGRbMF07CiAgICBjb25zdCByYXRpbyA9IHBhcmFtZXRlcnMucmF0aW9bMF07CgogICAgY29uc3QgaW5DaCA9IGlucHV0WzBdID8gaW5wdXRbMF1bMF0gOiBudWxsOwogICAgaWYgKGluQ2gpIHsKICAgICAgY29uc3Qgb3V0Q2ggPSBvdXRbMF07CiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5DaC5sZW5ndGg7IGkrKykgewogICAgICAgIGNvbnN0IGxldmVsRGIgPSBpbkNoW2ldOwogICAgICAgIGNvbnN0IGV4Y2VzcyA9IE1hdGgubWF4KDAsIGxldmVsRGIgLSB0aHJlc2hvbGQpOwogICAgICAgIC8vIE91dHB1dCBnYWluIHJlZHVjdGlvbiBhcyBuZWdhdGl2ZSBkQgogICAgICAgIG91dENoW2ldID0gLShleGNlc3MgKiAoMSAtIDEgLyByYXRpbykpOwogICAgICB9CiAgICAgIGZvciAobGV0IGNoID0gMTsgY2ggPCBvdXQubGVuZ3RoOyBjaCsrKSB7CiAgICAgICAgb3V0W2NoXS5zZXQob3V0Q2gpOwogICAgICB9CiAgICB9CiAgICByZXR1cm4gdHJ1ZTsKICB9Cn0KcmVnaXN0ZXJQcm9jZXNzb3IoJ2dhaW4tY29tcHV0ZXItcHJvY2Vzc29yJywgR2FpbkNvbXB1dGVyUHJvY2Vzc29yKTsKCi8vIOKUgOKUgOKUgCBHYXRlIFByb2Nlc3NvciDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIAKCmNsYXNzIEdhdGVQcm9jZXNzb3IgZXh0ZW5kcyBBdWRpb1dvcmtsZXRQcm9jZXNzb3IgewogIHN0YXRpYyBnZXQgcGFyYW1ldGVyRGVzY3JpcHRvcnMoKSB7CiAgICByZXR1cm4gWwogICAgICB7IG5hbWU6ICd0aHJlc2hvbGQnLCBkZWZhdWx0VmFsdWU6IC00MCwgYXV0b21hdGlvblJhdGU6ICdrLXJhdGUnIH0sCiAgICAgIHsgbmFtZTogJ2F0dGFjaycsIGRlZmF1bHRWYWx1ZTogMC4wMDEsIGF1dG9tYXRpb25SYXRlOiAnay1yYXRlJyB9LAogICAgICB7IG5hbWU6ICdob2xkJywgZGVmYXVsdFZhbHVlOiAwLjA1LCBhdXRvbWF0aW9uUmF0ZTogJ2stcmF0ZScgfSwKICAgICAgeyBuYW1lOiAncmVsZWFzZScsIGRlZmF1bHRWYWx1ZTogMC4xLCBhdXRvbWF0aW9uUmF0ZTogJ2stcmF0ZScgfSwKICAgICAgeyBuYW1lOiAncmFuZ2UnLCBkZWZhdWx0VmFsdWU6IC04MCwgYXV0b21hdGlvblJhdGU6ICdrLXJhdGUnIH0sCiAgICBdOwogIH0KICBjb25zdHJ1Y3RvcigpIHsKICAgIHN1cGVyKCk7CiAgICB0aGlzLl9lbnZlbG9wZSA9IDA7CiAgICB0aGlzLl9ob2xkQ291bnRlciA9IDA7CiAgICB0aGlzLl9nYXRlR2FpbiA9IDA7CiAgICB0aGlzLl9yZXBvcnRDb3VudGVyID0gMDsKICB9CiAgcHJvY2VzcyhpbnB1dHMsIG91dHB1dHMsIHBhcmFtZXRlcnMpIHsKICAgIGNvbnN0IGF1ZGlvID0gaW5wdXRzWzBdOwogICAgY29uc3Qgc2lkZWNoYWluID0gaW5wdXRzWzFdOwogICAgY29uc3Qgb3V0ID0gb3V0cHV0c1swXTsKICAgIGNvbnN0IHNyID0gc2FtcGxlUmF0ZTsKCiAgICBjb25zdCB0aHJlc2hvbGREYiA9IHBhcmFtZXRlcnMudGhyZXNob2xkWzBdOwogICAgY29uc3QgYXR0YWNrVGltZSA9IHBhcmFtZXRlcnMuYXR0YWNrWzBdOwogICAgY29uc3QgaG9sZFRpbWUgPSBwYXJhbWV0ZXJzLmhvbGRbMF07CiAgICBjb25zdCByZWxlYXNlVGltZSA9IHBhcmFtZXRlcnMucmVsZWFzZVswXTsKICAgIGNvbnN0IHJhbmdlRGIgPSBwYXJhbWV0ZXJzLnJhbmdlWzBdOwogICAgY29uc3QgdGhyZXNob2xkTGluID0gTWF0aC5wb3coMTAsIHRocmVzaG9sZERiIC8gMjApOwogICAgY29uc3QgcmFuZ2VMaW4gPSBNYXRoLnBvdygxMCwgcmFuZ2VEYiAvIDIwKTsKCiAgICBjb25zdCBhdHRhY2tDb2VmZiA9IGF0dGFja1RpbWUgPiAwID8gMSAtIE1hdGguZXhwKC0xIC8gKHNyICogYXR0YWNrVGltZSkpIDogMTsKICAgIGNvbnN0IHJlbGVhc2VDb2VmZiA9IHJlbGVhc2VUaW1lID4gMCA/IDEgLSBNYXRoLmV4cCgtMSAvIChzciAqIHJlbGVhc2VUaW1lKSkgOiAxOwogICAgY29uc3QgaG9sZFNhbXBsZXMgPSBNYXRoLnJvdW5kKGhvbGRUaW1lICogc3IpOwoKICAgIGNvbnN0IGRldENoID0gKHNpZGVjaGFpblswXSAmJiBzaWRlY2hhaW5bMF1bMF0pID8gc2lkZWNoYWluWzBdWzBdIDogKGF1ZGlvWzBdID8gYXVkaW9bMF1bMF0gOiBudWxsKTsKCiAgICBpZiAoZGV0Q2ggJiYgYXVkaW9bMF0pIHsKICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkZXRDaC5sZW5ndGg7IGkrKykgewogICAgICAgIGNvbnN0IGxldmVsID0gTWF0aC5hYnMoZGV0Q2hbaV0pOwogICAgICAgIGlmIChsZXZlbCA+PSB0aHJlc2hvbGRMaW4pIHsKICAgICAgICAgIHRoaXMuX2hvbGRDb3VudGVyID0gaG9sZFNhbXBsZXM7CiAgICAgICAgICB0aGlzLl9nYXRlR2FpbiArPSBhdHRhY2tDb2VmZiAqICgxIC0gdGhpcy5fZ2F0ZUdhaW4pOwogICAgICAgIH0gZWxzZSBpZiAodGhpcy5faG9sZENvdW50ZXIgPiAwKSB7CiAgICAgICAgICB0aGlzLl9ob2xkQ291bnRlci0tOwogICAgICAgIH0gZWxzZSB7CiAgICAgICAgICB0aGlzLl9nYXRlR2FpbiArPSByZWxlYXNlQ29lZmYgKiAocmFuZ2VMaW4gLSB0aGlzLl9nYXRlR2Fpbik7CiAgICAgICAgfQogICAgICAgIGZvciAobGV0IGNoID0gMDsgY2ggPCBvdXQubGVuZ3RoOyBjaCsrKSB7CiAgICAgICAgICBjb25zdCBpbkNoID0gYXVkaW9bMF1bY2hdIHx8IGF1ZGlvWzBdWzBdOwogICAgICAgICAgaWYgKGluQ2gpIHsKICAgICAgICAgICAgb3V0W2NoXVtpXSA9IGluQ2hbaV0gKiB0aGlzLl9nYXRlR2FpbjsKICAgICAgICAgIH0KICAgICAgICB9CiAgICAgIH0KICAgIH0KCiAgICB0aGlzLl9yZXBvcnRDb3VudGVyKys7CiAgICBpZiAodGhpcy5fcmVwb3J0Q291bnRlciA+PSAzNCkgewogICAgICB0aGlzLl9yZXBvcnRDb3VudGVyID0gMDsKICAgICAgdGhpcy5wb3J0LnBvc3RNZXNzYWdlKHsgZ2F0ZU9wZW46IHRoaXMuX2dhdGVHYWluID4gMC41IH0pOwogICAgfQogICAgcmV0dXJuIHRydWU7CiAgfQp9CnJlZ2lzdGVyUHJvY2Vzc29yKCdnYXRlLXByb2Nlc3NvcicsIEdhdGVQcm9jZXNzb3IpOwoKLy8g4pSA4pSA4pSAIEV4cGFuZGVyIFByb2Nlc3NvciDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIAKCmNsYXNzIEV4cGFuZGVyUHJvY2Vzc29yIGV4dGVuZHMgQXVkaW9Xb3JrbGV0UHJvY2Vzc29yIHsKICBzdGF0aWMgZ2V0IHBhcmFtZXRlckRlc2NyaXB0b3JzKCkgewogICAgcmV0dXJuIFsKICAgICAgeyBuYW1lOiAndGhyZXNob2xkJywgZGVmYXVsdFZhbHVlOiAtMzAsIGF1dG9tYXRpb25SYXRlOiAnay1yYXRlJyB9LAogICAgICB7IG5hbWU6ICdyYXRpbycsIGRlZmF1bHRWYWx1ZTogMiwgYXV0b21hdGlvblJhdGU6ICdrLXJhdGUnIH0sCiAgICAgIHsgbmFtZTogJ2F0dGFjaycsIGRlZmF1bHRWYWx1ZTogMC4wMDEsIGF1dG9tYXRpb25SYXRlOiAnay1yYXRlJyB9LAogICAgICB7IG5hbWU6ICdyZWxlYXNlJywgZGVmYXVsdFZhbHVlOiAwLjEsIGF1dG9tYXRpb25SYXRlOiAnay1yYXRlJyB9LAogICAgXTsKICB9CiAgY29uc3RydWN0b3IoKSB7CiAgICBzdXBlcigpOwogICAgdGhpcy5fZW52ZWxvcGUgPSAwOwogICAgdGhpcy5fZ2FpbkRiID0gMDsKICAgIHRoaXMuX3JlcG9ydENvdW50ZXIgPSAwOwogIH0KICBwcm9jZXNzKGlucHV0cywgb3V0cHV0cywgcGFyYW1ldGVycykgewogICAgY29uc3QgYXVkaW8gPSBpbnB1dHNbMF07CiAgICBjb25zdCBzaWRlY2hhaW4gPSBpbnB1dHNbMV07CiAgICBjb25zdCBvdXQgPSBvdXRwdXRzWzBdOwogICAgY29uc3Qgc3IgPSBzYW1wbGVSYXRlOwoKICAgIGNvbnN0IHRocmVzaG9sZERiID0gcGFyYW1ldGVycy50aHJlc2hvbGRbMF07CiAgICBjb25zdCByYXRpbyA9IHBhcmFtZXRlcnMucmF0aW9bMF07CiAgICBjb25zdCBhdHRhY2tUaW1lID0gcGFyYW1ldGVycy5hdHRhY2tbMF07CiAgICBjb25zdCByZWxlYXNlVGltZSA9IHBhcmFtZXRlcnMucmVsZWFzZVswXTsKCiAgICBjb25zdCBhdHRhY2tDb2VmZiA9IGF0dGFja1RpbWUgPiAwID8gMSAtIE1hdGguZXhwKC0xIC8gKHNyICogYXR0YWNrVGltZSkpIDogMTsKICAgIGNvbnN0IHJlbGVhc2VDb2VmZiA9IHJlbGVhc2VUaW1lID4gMCA/IDEgLSBNYXRoLmV4cCgtMSAvIChzciAqIHJlbGVhc2VUaW1lKSkgOiAxOwoKICAgIGNvbnN0IGRldENoID0gKHNpZGVjaGFpblswXSAmJiBzaWRlY2hhaW5bMF1bMF0pID8gc2lkZWNoYWluWzBdWzBdIDogKGF1ZGlvWzBdID8gYXVkaW9bMF1bMF0gOiBudWxsKTsKCiAgICBpZiAoZGV0Q2ggJiYgYXVkaW9bMF0pIHsKICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkZXRDaC5sZW5ndGg7IGkrKykgewogICAgICAgIGNvbnN0IHJlY3RpZmllZCA9IE1hdGguYWJzKGRldENoW2ldKTsKICAgICAgICBjb25zdCBjb2VmZiA9IHJlY3RpZmllZCA+IHRoaXMuX2VudmVsb3BlID8gYXR0YWNrQ29lZmYgOiByZWxlYXNlQ29lZmY7CiAgICAgICAgdGhpcy5fZW52ZWxvcGUgPSBjb2VmZiAqIHJlY3RpZmllZCArICgxIC0gY29lZmYpICogdGhpcy5fZW52ZWxvcGU7CgogICAgICAgIGNvbnN0IGVudkRiID0gdGhpcy5fZW52ZWxvcGUgPiAxZS0xMCA/IDIwICogTWF0aC5sb2cxMCh0aGlzLl9lbnZlbG9wZSkgOiAtMjAwOwogICAgICAgIGxldCBnYWluUmVkdWN0aW9uRGIgPSAwOwogICAgICAgIGlmIChlbnZEYiA8IHRocmVzaG9sZERiKSB7CiAgICAgICAgICBjb25zdCBiZWxvdyA9IHRocmVzaG9sZERiIC0gZW52RGI7CiAgICAgICAgICBnYWluUmVkdWN0aW9uRGIgPSAtKGJlbG93ICogKDEgLSAxIC8gcmF0aW8pKTsKICAgICAgICB9CgogICAgICAgIGNvbnN0IGdhaW5MaW4gPSBNYXRoLnBvdygxMCwgZ2FpblJlZHVjdGlvbkRiIC8gMjApOwogICAgICAgIHRoaXMuX2dhaW5EYiA9IGdhaW5SZWR1Y3Rpb25EYjsKCiAgICAgICAgZm9yIChsZXQgY2ggPSAwOyBjaCA8IG91dC5sZW5ndGg7IGNoKyspIHsKICAgICAgICAgIGNvbnN0IGluQ2ggPSBhdWRpb1swXVtjaF0gfHwgYXVkaW9bMF1bMF07CiAgICAgICAgICBpZiAoaW5DaCkgewogICAgICAgICAgICBvdXRbY2hdW2ldID0gaW5DaFtpXSAqIGdhaW5MaW47CiAgICAgICAgICB9CiAgICAgICAgfQogICAgICB9CiAgICB9CgogICAgdGhpcy5fcmVwb3J0Q291bnRlcisrOwogICAgaWYgKHRoaXMuX3JlcG9ydENvdW50ZXIgPj0gMzQpIHsKICAgICAgdGhpcy5fcmVwb3J0Q291bnRlciA9IDA7CiAgICAgIHRoaXMucG9ydC5wb3N0TWVzc2FnZSh7IHJlZHVjdGlvbkRiOiB0aGlzLl9nYWluRGIgfSk7CiAgICB9CiAgICByZXR1cm4gdHJ1ZTsKICB9Cn0KcmVnaXN0ZXJQcm9jZXNzb3IoJ2V4cGFuZGVyLXByb2Nlc3NvcicsIEV4cGFuZGVyUHJvY2Vzc29yKTsKCi8vIOKUgOKUgOKUgCBEZS1lc3NlciBQcm9jZXNzb3Ig4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSACgpjbGFzcyBEZUVzc2VyUHJvY2Vzc29yIGV4dGVuZHMgQXVkaW9Xb3JrbGV0UHJvY2Vzc29yIHsKICBzdGF0aWMgZ2V0IHBhcmFtZXRlckRlc2NyaXB0b3JzKCkgewogICAgcmV0dXJuIFsKICAgICAgeyBuYW1lOiAncmFuZ2UnLCBkZWZhdWx0VmFsdWU6IDYsIGF1dG9tYXRpb25SYXRlOiAnay1yYXRlJyB9LAogICAgXTsKICB9CiAgY29uc3RydWN0b3IoKSB7CiAgICBzdXBlcigpOwogICAgdGhpcy5fZW52ZWxvcGUgPSAwOwogICAgdGhpcy5fcmVwb3J0Q291bnRlciA9IDA7CiAgfQogIHByb2Nlc3MoaW5wdXRzLCBvdXRwdXRzLCBwYXJhbWV0ZXJzKSB7CiAgICBjb25zdCBhdWRpbyA9IGlucHV0c1swXTsKICAgIGNvbnN0IGRldGVjdGlvbiA9IGlucHV0c1sxXTsKICAgIGNvbnN0IG91dCA9IG91dHB1dHNbMF07CgogICAgY29uc3QgcmFuZ2VEYiA9IHBhcmFtZXRlcnMucmFuZ2VbMF07CgogICAgY29uc3QgZGV0Q2ggPSAoZGV0ZWN0aW9uWzBdICYmIGRldGVjdGlvblswXVswXSkgPyBkZXRlY3Rpb25bMF1bMF0gOiBudWxsOwoKICAgIGlmIChhdWRpb1swXSkgewogICAgICBmb3IgKGxldCBjaCA9IDA7IGNoIDwgb3V0Lmxlbmd0aDsgY2grKykgewogICAgICAgIGNvbnN0IGluQ2ggPSBhdWRpb1swXVtjaF0gfHwgYXVkaW9bMF1bMF07CiAgICAgICAgaWYgKGluQ2gpIHsKICAgICAgICAgIG91dFtjaF0uc2V0KGluQ2gpOwogICAgICAgIH0KICAgICAgfQogICAgfQoKICAgIGlmIChkZXRDaCkgewogICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRldENoLmxlbmd0aDsgaSsrKSB7CiAgICAgICAgY29uc3QgcmVjdGlmaWVkID0gTWF0aC5hYnMoZGV0Q2hbaV0pOwogICAgICAgIGNvbnN0IGNvZWZmID0gcmVjdGlmaWVkID4gdGhpcy5fZW52ZWxvcGUgPyAwLjEgOiAwLjAwMjsKICAgICAgICB0aGlzLl9lbnZlbG9wZSA9IGNvZWZmICogcmVjdGlmaWVkICsgKDEgLSBjb2VmZikgKiB0aGlzLl9lbnZlbG9wZTsKICAgICAgfQogICAgfQoKICAgIHRoaXMuX3JlcG9ydENvdW50ZXIrKzsKICAgIGlmICh0aGlzLl9yZXBvcnRDb3VudGVyID49IDM0KSB7CiAgICAgIHRoaXMuX3JlcG9ydENvdW50ZXIgPSAwOwogICAgICBjb25zdCBlbnZEYiA9IHRoaXMuX2VudmVsb3BlID4gMWUtMTAgPyAyMCAqIE1hdGgubG9nMTAodGhpcy5fZW52ZWxvcGUpIDogLTIwMDsKICAgICAgY29uc3QgcmVkdWN0aW9uRGIgPSBlbnZEYiA+IC0yMCA/IC1NYXRoLm1pbihyYW5nZURiLCBNYXRoLm1heCgwLCAoZW52RGIgKyAyMCkgKiByYW5nZURiIC8gMjApKSA6IDA7CiAgICAgIHRoaXMucG9ydC5wb3N0TWVzc2FnZSh7IHJlZHVjdGlvbkRiIH0pOwogICAgfQogICAgcmV0dXJuIHRydWU7CiAgfQp9CnJlZ2lzdGVyUHJvY2Vzc29yKCdkZS1lc3Nlci1wcm9jZXNzb3InLCBEZUVzc2VyUHJvY2Vzc29yKTsKCi8vIOKUgOKUgOKUgCBCaXRjcnVzaGVyIFByb2Nlc3NvciDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIAKCmNsYXNzIEJpdGNydXNoZXJQcm9jZXNzb3IgZXh0ZW5kcyBBdWRpb1dvcmtsZXRQcm9jZXNzb3IgewogIHN0YXRpYyBnZXQgcGFyYW1ldGVyRGVzY3JpcHRvcnMoKSB7CiAgICByZXR1cm4gWwogICAgICB7IG5hbWU6ICdiaXREZXB0aCcsIGRlZmF1bHRWYWx1ZTogOCwgYXV0b21hdGlvblJhdGU6ICdrLXJhdGUnIH0sCiAgICAgIHsgbmFtZTogJ3NhbXBsZVJhdGVSZWR1Y3Rpb24nLCBkZWZhdWx0VmFsdWU6IDEsIGF1dG9tYXRpb25SYXRlOiAnay1yYXRlJyB9LAogICAgXTsKICB9CiAgY29uc3RydWN0b3IoKSB7CiAgICBzdXBlcigpOwogICAgdGhpcy5faG9sZEwgPSAwOwogICAgdGhpcy5faG9sZFIgPSAwOwogICAgdGhpcy5fY291bnRlciA9IDA7CiAgfQogIHByb2Nlc3MoaW5wdXRzLCBvdXRwdXRzLCBwYXJhbWV0ZXJzKSB7CiAgICBjb25zdCBpbnB1dCA9IGlucHV0c1swXTsKICAgIGNvbnN0IG91dCA9IG91dHB1dHNbMF07CgogICAgY29uc3QgYml0cyA9IE1hdGgucm91bmQocGFyYW1ldGVycy5iaXREZXB0aFswXSk7CiAgICBjb25zdCBzclJlZHVjZSA9IE1hdGgucm91bmQocGFyYW1ldGVycy5zYW1wbGVSYXRlUmVkdWN0aW9uWzBdKTsKICAgIGNvbnN0IGxldmVscyA9IE1hdGgucG93KDIsIGJpdHMpOwoKICAgIGZvciAobGV0IGNoID0gMDsgY2ggPCBvdXQubGVuZ3RoOyBjaCsrKSB7CiAgICAgIGNvbnN0IG91dENoID0gb3V0W2NoXTsKICAgICAgY29uc3QgaW5DaCA9IGlucHV0WzBdID8gaW5wdXRbMF1bY2hdIHx8IGlucHV0WzBdWzBdIDogbnVsbDsKICAgICAgaWYgKGluQ2gpIHsKICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG91dENoLmxlbmd0aDsgaSsrKSB7CiAgICAgICAgICBpZiAodGhpcy5fY291bnRlciAlIHNyUmVkdWNlID09PSAwKSB7CiAgICAgICAgICAgIC8vIFF1YW50aXplIHRvIGJpdCBkZXB0aAogICAgICAgICAgICBjb25zdCBxdWFudGl6ZWQgPSBNYXRoLnJvdW5kKGluQ2hbaV0gKiBsZXZlbHMpIC8gbGV2ZWxzOwogICAgICAgICAgICBpZiAoY2ggPT09IDApIHRoaXMuX2hvbGRMID0gcXVhbnRpemVkOwogICAgICAgICAgICBlbHNlIHRoaXMuX2hvbGRSID0gcXVhbnRpemVkOwogICAgICAgICAgfQogICAgICAgICAgb3V0Q2hbaV0gPSBjaCA9PT0gMCA/IHRoaXMuX2hvbGRMIDogdGhpcy5faG9sZFI7CiAgICAgICAgICBpZiAoY2ggPT09IDApIHRoaXMuX2NvdW50ZXIrKzsKICAgICAgICB9CiAgICAgIH0KICAgIH0KICAgIHJldHVybiB0cnVlOwogIH0KfQpyZWdpc3RlclByb2Nlc3NvcignYml0Y3J1c2hlci1wcm9jZXNzb3InLCBCaXRjcnVzaGVyUHJvY2Vzc29yKTsK", import.meta.url).href
  ), Rg = !0);
}
function kt(e) {
  return e <= -70 ? 0 : Math.pow(10, e / 20);
}
class _2 {
  constructor() {
    Ir(this, "ctx", null);
    Ir(this, "processors", /* @__PURE__ */ new Map());
    Ir(this, "connections", /* @__PURE__ */ new Map());
    Ir(this, "prevNodes", []);
    Ir(this, "prevEdges", []);
    Ir(this, "currentMuteState", /* @__PURE__ */ new Map());
  }
  get audioContext() {
    return this.ctx;
  }
  async initialize() {
    this.ctx = new AudioContext(), this.ctx.state === "suspended" && await this.ctx.resume(), await b2(this.ctx), C2(this.ctx);
  }
  /** Called on every store change to sync Web Audio with graph state */
  reconcile(n, o) {
    var u, p, g;
    if (!this.ctx) return;
    const s = new Set(n.map((m) => m.id));
    for (const m of this.prevNodes)
      s.has(m.id) || this.removeProcessor(m.id);
    const i = new Set(this.prevNodes.map((m) => m.id));
    for (const m of n)
      i.has(m.id) || this.createProcessor(m);
    for (const m of n) {
      const h = this.prevNodes.find((w) => w.id === m.id);
      if (h)
        for (const [w, C] of Object.entries(m.data.parameters))
          h.data.parameters[w] !== C && ((u = this.processors.get(m.id)) == null || u.setParameter(
            w,
            C,
            this.ctx.currentTime
          ));
    }
    for (const m of n) {
      const h = this.prevNodes.find((x) => x.id === m.id), w = (h == null ? void 0 : h.data.bypassed) ?? !1, C = m.data.bypassed ?? !1;
      w !== C && ((g = (p = this.processors.get(m.id)) == null ? void 0 : p.setBypass) == null || g.call(p, C, this.ctx.currentTime));
    }
    for (const m of n) {
      if (!m.data.bufferRef) continue;
      const h = this.prevNodes.find((C) => C.id === m.id);
      if ((h == null ? void 0 : h.data.bufferRef) === m.data.bufferRef) continue;
      const w = this.processors.get(m.id);
      if (w != null && w.setBuffer) {
        const C = Fa(m.data.bufferRef);
        C && w.setBuffer(C.buffer);
      }
    }
    const l = new Set(o.map((m) => m.id));
    for (const m of this.prevEdges)
      l.has(m.id) || this.removeConnection(m.id);
    const c = new Set(this.prevEdges.map((m) => m.id));
    for (const m of o)
      c.has(m.id) || this.createConnection(m, n);
    this.prevNodes = n, this.prevEdges = o;
  }
  createProcessor(n) {
    if (!(!this.ctx || !n.type))
      try {
        const s = Ah(n.type).create(this.ctx, n.data.parameters);
        this.processors.set(n.id, s);
      } catch (o) {
        console.warn(`Failed to create processor for ${n.type}:`, o);
      }
  }
  removeProcessor(n) {
    for (const [s] of this.connections) {
      const i = this.prevEdges.find((l) => l.id === s);
      i && (i.source === n || i.target === n) && this.removeConnection(s);
    }
    const o = this.processors.get(n);
    o && (o.dispose(), this.processors.delete(n));
  }
  createConnection(n, o) {
    if (!this.ctx) return;
    const s = this.processors.get(n.source), i = this.processors.get(n.target);
    if (!s || !i) return;
    const l = s.outputs[n.sourceHandle], c = i.inputs[n.targetHandle];
    if (!(!l || !c)) {
      if (n.data.signalType === "parameter" && c instanceof AudioParam)
        l.connect(c), this.connections.set(n.id, {
          gate: null,
          from: l,
          to: c
        });
      else if (c instanceof AudioNode) {
        const u = o.find((C) => C.id === n.source), p = o.find((C) => C.id === n.target);
        if (!u || !p) return;
        let g = n.data.channelFormat, m = n.data.channelFormat;
        try {
          const x = ct(u.type).ports.find((_) => _.id === n.sourceHandle);
          x && (g = x.channelFormat);
          const b = ct(p.type).ports.find((_) => _.id === n.targetHandle);
          b && (m = b.channelFormat);
        } catch {
        }
        const h = x2(this.ctx, g, m), w = this.ctx.createGain();
        w.gain.value = 0, h ? (l.connect(w), w.connect(h.input), h.output.connect(c)) : (l.connect(w), w.connect(c)), w.gain.setTargetAtTime(1, this.ctx.currentTime, 0.02), this.connections.set(n.id, { gate: w, from: l, to: c, adapter: h ?? void 0 });
      }
    }
  }
  removeConnection(n) {
    const o = this.connections.get(n);
    if (o)
      if (o.disconnectTimer && clearTimeout(o.disconnectTimer), o.to instanceof AudioParam) {
        try {
          o.from.disconnect(o.to);
        } catch {
        }
        this.connections.delete(n);
      } else o.gate && this.ctx ? (o.gate.gain.setTargetAtTime(0, this.ctx.currentTime, 0.02), o.disconnectTimer = setTimeout(() => {
        try {
          o.from.disconnect(o.gate), o.gate.disconnect(), o.adapter && (o.adapter.input.disconnect(), o.adapter.output.disconnect());
        } catch {
        }
        this.connections.delete(n);
      }, 80)) : this.connections.delete(n);
  }
  /** Update regions on a track processor */
  updateTrackRegions(n, o) {
    const s = this.processors.get(n);
    s != null && s.setRegions && s.setRegions(o);
  }
  /** Start playback on all track processors from a given offset */
  startPlayback(n) {
    var s;
    if (!this.ctx) return;
    const o = this.ctx.currentTime;
    for (const i of this.processors.values())
      (s = i.schedulePlayback) == null || s.call(i, o, n);
  }
  /** Stop playback on all track processors */
  stopPlayback() {
    var n;
    for (const o of this.processors.values())
      (n = o.stopPlayback) == null || n.call(o);
  }
  /** Apply mute state by ramping connection gates */
  applyMuteState(n) {
    if (!this.ctx) return;
    const o = this.ctx.currentTime;
    for (const [s, i] of this.connections) {
      if (!i.gate) continue;
      const l = this.prevEdges.find((p) => p.id === s);
      if (!l) continue;
      const c = n.get(l.source) ?? !1, u = this.currentMuteState.get(l.source) ?? !1;
      if (c !== u) {
        const p = c ? 0 : 1;
        i.gate.gain.setTargetAtTime(p, o, 0.02);
      }
    }
    this.currentMuteState = new Map(n);
  }
  /** Connect a mic source to a track processor for recording */
  setRecordInput(n, o, s) {
    var l;
    const i = this.processors.get(n);
    (l = i == null ? void 0 : i.setRecordInput) == null || l.call(i, o, s);
  }
  /** Disconnect recording input from a track processor */
  clearRecordInput(n) {
    var s;
    const o = this.processors.get(n);
    (s = o == null ? void 0 : o.clearRecordInput) == null || s.call(o);
  }
  /** Start recording on a track processor */
  startRecording(n, o) {
    var i;
    if (!this.ctx) return;
    const s = this.processors.get(n);
    (i = s == null ? void 0 : s.startRecording) == null || i.call(s, this.ctx.currentTime, o);
  }
  /** Stop recording on a track processor and return the captured buffer */
  stopRecording(n) {
    var s;
    const o = this.processors.get(n);
    return ((s = o == null ? void 0 : o.stopRecording) == null ? void 0 : s.call(o)) ?? null;
  }
  /** Measure the total output latency in seconds */
  measureLatency() {
    return this.ctx ? (this.ctx.baseLatency ?? 0) + (this.ctx.outputLatency ?? 0) : 0;
  }
  /** Get a live processor instance by node ID (for metering/visualization) */
  getProcessor(n) {
    return this.processors.get(n);
  }
  /** Get the AudioContext currentTime (for position tracking) */
  get currentTime() {
    var n;
    return ((n = this.ctx) == null ? void 0 : n.currentTime) ?? 0;
  }
  dispose() {
    var n;
    for (const o of this.connections.keys())
      this.removeConnection(o);
    for (const o of this.processors.keys()) {
      const s = this.processors.get(o);
      s == null || s.dispose();
    }
    this.processors.clear(), this.connections.clear(), (n = this.ctx) == null || n.close(), this.ctx = null;
  }
}
const Tg = (e) => {
  let n;
  const o = /* @__PURE__ */ new Set(), s = (g, m) => {
    const h = typeof g == "function" ? g(n) : g;
    if (!Object.is(h, n)) {
      const w = n;
      n = m ?? (typeof h != "object" || h === null) ? h : Object.assign({}, n, h), o.forEach((C) => C(n, w));
    }
  }, i = () => n, u = { setState: s, getState: i, getInitialState: () => p, subscribe: (g) => (o.add(g), () => o.delete(g)) }, p = n = e(s, i, u);
  return u;
}, Mh = ((e) => e ? Tg(e) : Tg), N2 = (e) => e;
function A2(e, n = N2) {
  const o = _n.useSyncExternalStore(
    e.subscribe,
    _n.useCallback(() => n(e.getState()), [e, n]),
    _n.useCallback(() => n(e.getInitialState()), [e, n])
  );
  return _n.useDebugValue(o), o;
}
const S2 = (e) => {
  const n = Mh(e), o = (s) => A2(n, s);
  return Object.assign(o, n), o;
}, Co = ((e) => S2);
var Bg = (e, n, o) => (i, l) => ({
  pastStates: (o == null ? void 0 : o.pastStates) || [],
  futureStates: (o == null ? void 0 : o.futureStates) || [],
  undo: (c = 1) => {
    var u, p;
    if (l().pastStates.length) {
      const g = ((u = o == null ? void 0 : o.partialize) == null ? void 0 : u.call(o, n())) || n(), m = l().pastStates.splice(-c, c), h = m.shift();
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
      const g = ((u = o == null ? void 0 : o.partialize) == null ? void 0 : u.call(o, n())) || n(), m = l().futureStates.splice(-c, c), h = m.shift();
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
}), Rh = (e, n) => (s, i, l) => {
  var g, m;
  l.temporal = Mh(
    ((g = n == null ? void 0 : n.wrapTemporal) == null ? void 0 : g.call(n, Bg(s, i, n))) || Bg(s, i, n)
  );
  const c = ((m = n == null ? void 0 : n.handleSet) == null ? void 0 : m.call(
    n,
    l.temporal.getState()._handleSet
  )) || l.temporal.getState()._handleSet, u = (h) => {
    var x, I, b;
    if (!l.temporal.getState().isTracking) return;
    const w = ((x = n == null ? void 0 : n.partialize) == null ? void 0 : x.call(n, i())) || i(), C = (I = n == null ? void 0 : n.diff) == null ? void 0 : I.call(n, h, w);
    // If the user has provided a diff function but nothing has been changed, deltaState will be null
    C === null || // If the user has provided an equality function, use it
    (b = n == null ? void 0 : n.equality) != null && b.call(n, h, w) || c(
      h,
      void 0,
      w,
      C
    );
  }, p = l.setState;
  return l.setState = (...h) => {
    var C;
    const w = ((C = n == null ? void 0 : n.partialize) == null ? void 0 : C.call(n, i())) || i();
    p(...h), u(w);
  }, e(
    // Modify the set function to call the userlandSet function
    (...h) => {
      var C;
      const w = ((C = n == null ? void 0 : n.partialize) == null ? void 0 : C.call(n, i())) || i();
      s(...h), u(w);
    },
    i,
    l
  );
};
function Th(e, n, o) {
  if (!e.source || !e.target)
    return { valid: !1, reason: "Missing source or target" };
  if (!e.sourceHandle || !e.targetHandle)
    return { valid: !1, reason: "Missing port handle" };
  if (e.source === e.target)
    return { valid: !1, reason: "Cannot connect a module to itself" };
  const s = n.find((m) => m.id === e.source);
  if (!s) return { valid: !1, reason: "Source node not found" };
  const i = n.find((m) => m.id === e.target);
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
const de = Co()(
  Rh(
    (e, n) => ({
      nodes: [],
      edges: [],
      lastConnectionError: null,
      onNodesChange: (o) => {
        e({
          nodes: Vu(o, n().nodes)
        });
      },
      onEdgesChange: (o) => {
        e({
          edges: zu(o, n().edges)
        });
      },
      onConnect: (o) => {
        const s = Th(o, n().nodes, n().edges);
        if (!s.valid) {
          e({ lastConnectionError: s.reason ?? "Invalid connection" });
          return;
        }
        const i = n().nodes.find((p) => p.id === o.source), c = ct(i.type).ports.find(
          (p) => p.id === o.sourceHandle
        ), u = {
          id: ft(),
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
        e({ edges: [...n().edges, u], lastConnectionError: null });
      },
      addModule: (o, s) => {
        const i = ct(o);
        if (i.singleton) {
          const p = n().nodes.find((g) => g.type === o);
          if (p) return p.id;
        }
        const l = ft(), c = {};
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
        return e({ nodes: [...n().nodes, u] }), l;
      },
      removeModule: (o) => {
        const s = n().nodes.find((i) => i.id === o);
        s && ct(s.type).singleton || e({
          nodes: n().nodes.filter((i) => i.id !== o),
          edges: n().edges.filter(
            (i) => i.source !== o && i.target !== o
          )
        });
      },
      updateParameter: (o, s, i) => {
        e({
          nodes: n().nodes.map(
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
          nodes: n().nodes.map(
            (i) => i.id === o ? { ...i, data: { ...i.data, ...s } } : i
          )
        });
      },
      toggleMute: (o) => {
        e({
          nodes: n().nodes.map(
            (s) => s.id === o ? { ...s, data: { ...s.data, muted: !s.data.muted } } : s
          )
        });
      },
      toggleSolo: (o, s = !0) => {
        const i = n().nodes, l = i.find((u) => u.id === o);
        if (!l) return;
        const c = !l.data.soloed;
        e({
          nodes: i.map((u) => u.id === o ? { ...u, data: { ...u.data, soloed: c } } : s && c ? { ...u, data: { ...u.data, soloed: !1 } } : u)
        });
      },
      clearAllSolo: () => {
        e({
          nodes: n().nodes.map(
            (o) => o.data.soloed ? { ...o, data: { ...o.data, soloed: !1 } } : o
          )
        });
      },
      toggleBypass: (o) => {
        e({
          nodes: n().nodes.map(
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
        nodes: e.nodes.map((n) => ({
          id: n.id,
          type: n.type,
          data: n.data
        })),
        edges: e.edges
      })
    }
  )
), Ge = Co()((e) => ({
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
  seek(n) {
    e({ position: n });
  },
  setBpm(n) {
    e({ bpm: n });
  },
  setLoop(n, o) {
    e({ loopStart: n, loopEnd: o, loopEnabled: !0 });
  },
  toggleLoop() {
    e((n) => ({ loopEnabled: !n.loopEnabled }));
  },
  setPosition(n) {
    e({ position: n });
  }
})), vu = [
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
function Bh(e, n) {
  if (e.value !== null && e.value > 0) return e.value;
  if (e.value === null) return null;
  const o = 60 / n;
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
const me = Co()(
  Rh(
    (e, n) => ({
      isOpen: !1,
      selectedTrackIds: [],
      zoom: 100,
      // 100px per second default
      scrollX: 0,
      activeTool: "pointer",
      gridResolution: vu[0],
      // Free
      snapEnabled: !0,
      overlapMode: "layer",
      regions: {},
      selectedRegionIds: [],
      openEditor(o) {
        e({ isOpen: !0, selectedTrackIds: [o], selectedRegionIds: [] });
      },
      toggleTrackInEditor(o) {
        const { selectedTrackIds: s } = n();
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
        const s = ft(), i = { ...o, id: s }, { regions: l } = n(), c = l[i.trackId] ?? [];
        return e({
          regions: {
            ...l,
            [i.trackId]: [...c, i]
          }
        }), s;
      },
      updateRegion(o, s) {
        const { regions: i } = n(), l = {};
        for (const [c, u] of Object.entries(i))
          l[c] = u.map(
            (p) => p.id === o ? { ...p, ...s } : p
          );
        e({ regions: l });
      },
      removeRegion(o) {
        const { regions: s } = n(), i = {};
        for (const [l, c] of Object.entries(s))
          i[l] = c.filter((u) => u.id !== o);
        e({
          regions: i,
          selectedRegionIds: n().selectedRegionIds.filter((l) => l !== o)
        });
      },
      removeRegionsForTrack(o) {
        const { regions: s } = n(), i = { ...s };
        delete i[o], e({
          regions: i,
          selectedRegionIds: n().selectedRegionIds.filter((l) => {
            const u = Object.values(s).flat().find((p) => p.id === l);
            return u ? u.trackId !== o : !0;
          })
        });
      },
      splitRegion(o, s) {
        const { regions: i } = n();
        for (const [l, c] of Object.entries(i)) {
          const u = c.findIndex((C) => C.id === o);
          if (u === -1) continue;
          const p = c[u], g = s - p.position;
          if (g <= 0 || g >= p.duration) return;
          const m = {
            id: ft(),
            trackId: p.trackId,
            bufferRef: p.bufferRef,
            position: p.position,
            sourceOffset: p.sourceOffset,
            duration: g,
            fadeIn: p.fadeIn,
            fadeOut: 5e-3
          }, h = {
            id: ft(),
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
        return n().regions[o] ?? [];
      },
      loadRegions(o) {
        e({ regions: o, selectedRegionIds: [] });
      }
    }),
    {
      limit: 100,
      partialize: (e) => ({
        regions: e.regions
      })
    }
  )
), Ut = Co()((e, n) => ({
  armedTrackIds: [],
  isRecording: !1,
  inputMonitoring: !1,
  latencyCompensation: 0,
  manualLatencyOffset: 0,
  armTrack(o) {
    const { armedTrackIds: s } = n();
    s.includes(o) || e({ armedTrackIds: [...s, o] });
  },
  disarmTrack(o) {
    e({ armedTrackIds: n().armedTrackIds.filter((s) => s !== o) });
  },
  toggleArm(o) {
    const { armedTrackIds: s } = n();
    s.includes(o) ? e({ armedTrackIds: s.filter((i) => i !== o) }) : e({ armedTrackIds: [...s, o] });
  },
  setRecording(o) {
    e({ isRecording: o });
  },
  setInputMonitoring(o) {
    e({ inputMonitoring: o });
  },
  setLatencyCompensation(o) {
    e({ latencyCompensation: o });
  },
  setManualLatencyOffset(o) {
    e({ manualLatencyOffset: o });
  }
}));
function Eh(e, n, o) {
  const s = /* @__PURE__ */ new Map(), i = e.filter((p) => p.data.soloed).map((p) => p.id);
  if (i.length === 0) {
    for (const p of e)
      s.set(p.id, !!p.data.muted);
    return s;
  }
  const l = /* @__PURE__ */ new Map();
  for (const p of e)
    l.set(p.id, []);
  for (const p of n) {
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
let fo = null, Ia = null;
async function k2(e) {
  return fo || (fo = await navigator.mediaDevices.getUserMedia({ audio: !0 })), Ia = e.createMediaStreamSource(fo), Ia;
}
function j2() {
  if (fo) {
    for (const e of fo.getTracks())
      e.stop();
    fo = null;
  }
  if (Ia) {
    try {
      Ia.disconnect();
    } catch {
    }
    Ia = null;
  }
}
let xu = null;
function Qt() {
  return xu;
}
function M2() {
  const e = j.useRef(null), n = j.useRef(!1), o = j.useRef(0), s = j.useRef(0), i = j.useRef(0);
  e.current || (e.current = new _2(), xu = e.current);
  const l = j.useCallback(async () => {
    if (n.current) return;
    const u = e.current;
    await u.initialize(), n.current = !0;
    const p = u.measureLatency();
    Ut.getState().setLatencyCompensation(p);
    const { nodes: g, edges: m } = de.getState();
    u.reconcile(g, m);
    const { regions: h } = me.getState();
    for (const [w, C] of Object.entries(h))
      u.updateTrackRegions(w, C);
  }, []), c = j.useCallback(() => {
    const u = e.current, p = Ge.getState();
    if (!u || !p.isPlaying) return;
    const g = u.currentTime - s.current;
    let m = i.current + g;
    if (p.loopEnabled && p.loopEnd > p.loopStart && m >= p.loopEnd) {
      const h = p.loopEnd - p.loopStart;
      m = p.loopStart + (m - p.loopStart) % h, u.stopPlayback(), i.current = m, s.current = u.currentTime, u.startPlayback(m);
    }
    p.setPosition(m), o.current = requestAnimationFrame(c);
  }, []);
  return j.useEffect(() => {
    const u = de.subscribe((p) => {
      if (n.current && e.current) {
        e.current.reconcile(p.nodes, p.edges);
        const g = Eh(p.nodes, p.edges, ct);
        e.current.applyMuteState(g);
      }
    });
    return () => {
      var p;
      u(), cancelAnimationFrame(o.current), (p = e.current) == null || p.dispose(), e.current = null, xu = null, n.current = !1;
    };
  }, []), j.useEffect(() => {
    const u = Ge.subscribe(
      (p, g) => {
        const m = e.current;
        !m || !n.current || (p.isPlaying && !g.isPlaying && (i.current = p.position, s.current = m.currentTime, m.startPlayback(p.position), o.current = requestAnimationFrame(c)), !p.isPlaying && g.isPlaying && (cancelAnimationFrame(o.current), m.stopPlayback()));
      }
    );
    return () => {
      u();
    };
  }, [c]), j.useEffect(() => {
    const u = me.subscribe(
      (p, g) => {
        const m = e.current;
        if (!(!m || !n.current) && p.regions !== g.regions) {
          for (const [h, w] of Object.entries(p.regions))
            m.updateTrackRegions(h, w);
          if (Ge.getState().isPlaying) {
            const h = Ge.getState().position;
            m.stopPlayback(), i.current = h, s.current = m.currentTime, m.startPlayback(h);
          }
        }
      }
    );
    return () => {
      u();
    };
  }, []), j.useEffect(() => {
    const u = Ut.subscribe(
      (p, g) => {
        const m = e.current;
        !m || !n.current || (p.isRecording && !g.isRecording && R2(m), !p.isRecording && g.isRecording && T2(m));
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
async function R2(e) {
  const n = e.audioContext;
  if (!n) return;
  const { armedTrackIds: o, inputMonitoring: s } = Ut.getState();
  if (o.length !== 0)
    try {
      const i = await k2(n), l = Ge.getState().position;
      for (const c of o)
        e.setRecordInput(c, i, s), e.startRecording(c, l);
      Ge.getState().isPlaying || Ge.getState().play();
    } catch (i) {
      console.error("Failed to start recording:", i), Ut.getState().setRecording(!1);
    }
}
function T2(e) {
  const { armedTrackIds: n, latencyCompensation: o, manualLatencyOffset: s } = Ut.getState(), i = o + s;
  for (const l of n) {
    const c = e.stopRecording(l);
    if (e.clearRecordInput(l), c && c.buffer.duration > 0.05) {
      const u = ft(), p = Hi(c.buffer, 200);
      Xu(u, {
        buffer: c.buffer,
        peaks: p,
        fileName: `Recording ${(/* @__PURE__ */ new Date()).toLocaleTimeString()}`,
        duration: c.buffer.duration,
        channelCount: c.buffer.numberOfChannels,
        sampleRate: c.buffer.sampleRate
      });
      const g = Math.max(0, c.startOffset - i);
      me.getState().addRegion({
        trackId: l,
        bufferRef: u,
        position: g,
        sourceOffset: 0,
        duration: c.buffer.duration,
        fadeIn: 5e-3,
        fadeOut: 5e-3
      }), de.getState().setNodeData(l, {
        bufferRef: u,
        fileName: `Recording ${(/* @__PURE__ */ new Date()).toLocaleTimeString()}`,
        duration: c.buffer.duration
      });
    }
  }
  j2();
}
function B2({
  id: e,
  sourceX: n,
  sourceY: o,
  targetX: s,
  targetY: i,
  sourcePosition: l,
  targetPosition: c,
  data: u
}) {
  const [p, g, m] = Vi({
    sourceX: n,
    sourceY: o,
    targetX: s,
    targetY: i,
    sourcePosition: l,
    targetPosition: c
  }), h = (u == null ? void 0 : u.channelFormat) === "stereo", w = u == null ? void 0 : u.sourceChannelFormat, C = u == null ? void 0 : u.targetChannelFormat, x = w && C && w !== C;
  return /* @__PURE__ */ d.jsxs(d.Fragment, { children: [
    /* @__PURE__ */ d.jsx(
      xo,
      {
        id: e,
        path: p,
        className: `daw-edge daw-edge--audio ${h ? "daw-edge--stereo" : "daw-edge--mono"}`
      }
    ),
    x && /* @__PURE__ */ d.jsx(ON, { children: /* @__PURE__ */ d.jsxs(
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
          C === "mono" ? "M" : "S"
        ]
      }
    ) })
  ] });
}
function E2({
  id: e,
  sourceX: n,
  sourceY: o,
  targetX: s,
  targetY: i,
  sourcePosition: l,
  targetPosition: c
}) {
  const [u] = Vi({
    sourceX: n,
    sourceY: o,
    targetX: s,
    targetY: i,
    sourcePosition: l,
    targetPosition: c
  });
  return /* @__PURE__ */ d.jsx(
    xo,
    {
      id: e,
      path: u,
      className: "daw-edge daw-edge--parameter"
    }
  );
}
const D2 = {
  audio: B2,
  parameter: E2
}, an = Co()((e, n) => ({
  scopeStack: [{ parentNodeId: null, label: "Session", moduleType: null }],
  internalGraphs: {},
  pushScope: (o, s, i) => {
    e({
      scopeStack: [...n().scopeStack, { parentNodeId: o, label: s, moduleType: i }]
    });
  },
  popToDepth: (o) => {
    const s = n().scopeStack;
    o >= 0 && o < s.length && e({ scopeStack: s.slice(0, o + 1) });
  },
  popToRoot: () => {
    e({ scopeStack: [n().scopeStack[0]] });
  },
  initInternalGraph: (o, s, i) => {
    e({
      internalGraphs: {
        ...n().internalGraphs,
        [o]: { nodes: s, edges: i }
      }
    });
  },
  updateInternalNodes: (o, s) => {
    const i = n().internalGraphs, l = i[o];
    l && e({
      internalGraphs: {
        ...i,
        [o]: {
          ...l,
          nodes: Vu(s, l.nodes)
        }
      }
    });
  },
  updateInternalEdges: (o, s) => {
    const i = n().internalGraphs, l = i[o];
    l && e({
      internalGraphs: {
        ...i,
        [o]: {
          ...l,
          edges: zu(s, l.edges)
        }
      }
    });
  },
  isSessionScope: () => n().scopeStack.length <= 1,
  currentParentNodeId: () => {
    const o = n().scopeStack;
    return o.length > 1 ? o[o.length - 1].parentNodeId : null;
  },
  currentDepth: () => n().scopeStack.length - 1
}));
function G2() {
  const e = an((b) => b.isSessionScope()), n = an((b) => b.currentParentNodeId()), o = an((b) => b.internalGraphs), s = de((b) => b.nodes), i = de((b) => b.edges), l = de((b) => b.onNodesChange), c = de((b) => b.onEdgesChange), u = de((b) => b.onConnect), p = an((b) => b.updateInternalNodes), g = an((b) => b.updateInternalEdges), m = n ? o[n] : null, h = e ? s : (m == null ? void 0 : m.nodes) ?? [], w = e ? i : (m == null ? void 0 : m.edges) ?? [], C = j.useCallback(
    (b) => {
      e ? l(b) : n && p(n, b);
    },
    [e, n, l, p]
  ), x = j.useCallback(
    (b) => {
      e ? c(b) : n && g(n, b);
    },
    [e, n, c, g]
  ), I = j.useCallback(
    (b) => {
      e && u(b);
    },
    [e, u]
  );
  return {
    nodes: h,
    edges: w,
    onNodesChange: C,
    onEdgesChange: x,
    onConnect: I,
    isSession: e
  };
}
const P2 = ["io", "generator", "effect", "routing", "utility", "atomic"], eu = {
  io: "I/O",
  generator: "Generators",
  effect: "Effects",
  routing: "Routing",
  utility: "Utility",
  atomic: "Atomic"
}, tu = {
  io: "var(--daw-cat-io)",
  generator: "var(--daw-cat-source)",
  effect: "var(--daw-cat-effect)",
  routing: "var(--daw-cat-routing)",
  utility: "var(--daw-cat-utility)",
  atomic: "var(--daw-cat-atomic)"
};
function F2({ allowedModules: e }) {
  const n = de((x) => x.addModule), o = w2().filter(
    (x) => !x.singleton && !x.internal && (!e || e.includes(x.type))
  ), [s, i] = j.useState(null), [l, c] = j.useState(""), u = j.useRef(null), p = j.useRef(null), g = j.useCallback((x) => {
    i((I) => I === x ? null : x);
  }, []), m = j.useCallback((x) => {
    n(x, { x: 200 + Math.random() * 200, y: 100 + Math.random() * 200 }), i(null), c("");
  }, [n]);
  j.useEffect(() => {
    if (!s && !l) return;
    const x = (I) => {
      u.current && !u.current.contains(I.target) && (i(null), c(""));
    };
    return document.addEventListener("mousedown", x), () => document.removeEventListener("mousedown", x);
  }, [s, l]), j.useEffect(() => {
    if (!s && !l) return;
    const x = (I) => {
      I.key === "Escape" && (i(null), c(""));
    };
    return window.addEventListener("keydown", x), () => window.removeEventListener("keydown", x);
  }, [s, l]);
  const h = /* @__PURE__ */ new Map();
  for (const x of o) {
    const I = h.get(x.category) ?? [];
    I.push(x), h.set(x.category, I);
  }
  const w = l.toLowerCase().trim(), C = w ? o.filter((x) => x.label.toLowerCase().includes(w)) : [];
  return /* @__PURE__ */ d.jsx("div", { className: "daw-module-panel", ref: u, children: /* @__PURE__ */ d.jsxs("div", { className: "daw-module-panel__categories", children: [
    /* @__PURE__ */ d.jsx(
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
      C.length > 0 ? /* @__PURE__ */ d.jsx("div", { className: "daw-module-panel__list", children: C.map((x) => /* @__PURE__ */ d.jsxs(
        "button",
        {
          className: "daw-module-panel__btn",
          onClick: () => m(x.type),
          children: [
            /* @__PURE__ */ d.jsx(
              "span",
              {
                className: "daw-module-panel__category-dot",
                style: { background: tu[x.category], display: "inline-block", marginRight: 6 }
              }
            ),
            x.label
          ]
        },
        x.type
      )) }) : /* @__PURE__ */ d.jsx("div", { style: { padding: "6px 8px", fontSize: "0.7rem", color: "var(--daw-text-tertiary)" }, children: "No modules found" })
    ) : (
      // Category accordion mode
      P2.map((x) => {
        const I = h.get(x);
        if (!I || I.length === 0) return null;
        const b = s === x;
        return /* @__PURE__ */ d.jsxs("div", { className: "daw-module-panel__cat-wrapper", children: [
          /* @__PURE__ */ d.jsxs(
            "button",
            {
              className: `daw-module-panel__cat-btn ${b ? "daw-module-panel__cat-btn--active" : ""}`,
              onClick: () => g(x),
              "aria-expanded": b,
              title: eu[x],
              children: [
                /* @__PURE__ */ d.jsx(
                  "span",
                  {
                    className: "daw-module-panel__category-dot",
                    style: { background: tu[x] }
                  }
                ),
                eu[x]
              ]
            }
          ),
          b && /* @__PURE__ */ d.jsxs("div", { className: "daw-module-panel__popover", children: [
            /* @__PURE__ */ d.jsxs("div", { className: "daw-module-panel__popover-header", children: [
              /* @__PURE__ */ d.jsx(
                "span",
                {
                  className: "daw-module-panel__category-dot",
                  style: { background: tu[x] }
                }
              ),
              eu[x]
            ] }),
            /* @__PURE__ */ d.jsx("div", { className: "daw-module-panel__list", children: I.map((_) => /* @__PURE__ */ d.jsx(
              "button",
              {
                className: "daw-module-panel__btn",
                onClick: () => m(_.type),
                children: _.label
              },
              _.type
            )) })
          ] })
        ] }, x);
      })
    )
  ] }) });
}
function V2() {
  const e = de.temporal;
  return j.useEffect(() => {
    const n = (o) => {
      (o.metaKey || o.ctrlKey) && (o.key === "z" && !o.shiftKey ? (o.preventDefault(), e.getState().undo()) : (o.key === "z" && o.shiftKey || o.key === "y" && !o.shiftKey) && (o.preventDefault(), e.getState().redo()));
    };
    return window.addEventListener("keydown", n), () => window.removeEventListener("keydown", n);
  }, [e]), {
    undo: () => e.getState().undo(),
    redo: () => e.getState().redo(),
    canUndo: () => e.getState().pastStates.length > 0,
    canRedo: () => e.getState().futureStates.length > 0
  };
}
function z2() {
  const [e, n] = j.useState({
    ctxState: "suspended",
    sampleRate: 0,
    moduleCount: 0,
    connectionCount: 0,
    memoryMB: null,
    memoryPct: null
  });
  j.useEffect(() => {
    const i = () => {
      const c = Qt(), u = (c == null ? void 0 : c.audioContext) ?? null, { nodes: p, edges: g } = de.getState(), m = performance.memory;
      n({
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
  return /* @__PURE__ */ d.jsxs("div", { className: "daw-perf", children: [
    /* @__PURE__ */ d.jsx("span", { className: `daw-perf__dot daw-perf__dot--${e.ctxState}` }),
    /* @__PURE__ */ d.jsxs("span", { className: "daw-perf__stats", children: [
      e.moduleCount,
      "M ",
      e.connectionCount,
      "C",
      o && ` ${e.memoryMB}MB`
    ] }),
    o && /* @__PURE__ */ d.jsx("div", { className: "daw-perf__bar", children: /* @__PURE__ */ d.jsx(
      "div",
      {
        className: `daw-perf__bar-fill daw-perf__bar-fill--${s}`,
        style: { width: `${Math.min(100, e.memoryPct)}%` }
      }
    ) }),
    /* @__PURE__ */ d.jsxs("div", { className: "daw-perf__tooltip", children: [
      /* @__PURE__ */ d.jsxs("div", { className: "daw-perf__tooltip-row", children: [
        /* @__PURE__ */ d.jsx("span", { className: "daw-perf__tooltip-label", children: "Audio engine" }),
        /* @__PURE__ */ d.jsx("span", { className: "daw-perf__tooltip-value", children: e.ctxState })
      ] }),
      /* @__PURE__ */ d.jsxs("div", { className: "daw-perf__tooltip-row", children: [
        /* @__PURE__ */ d.jsx("span", { className: "daw-perf__tooltip-label", children: "Sample rate" }),
        /* @__PURE__ */ d.jsxs("span", { className: "daw-perf__tooltip-value", children: [
          e.sampleRate,
          " Hz"
        ] })
      ] }),
      /* @__PURE__ */ d.jsxs("div", { className: "daw-perf__tooltip-row", children: [
        /* @__PURE__ */ d.jsx("span", { className: "daw-perf__tooltip-label", children: "Modules" }),
        /* @__PURE__ */ d.jsx("span", { className: "daw-perf__tooltip-value", children: e.moduleCount })
      ] }),
      /* @__PURE__ */ d.jsxs("div", { className: "daw-perf__tooltip-row", children: [
        /* @__PURE__ */ d.jsx("span", { className: "daw-perf__tooltip-label", children: "Connections" }),
        /* @__PURE__ */ d.jsx("span", { className: "daw-perf__tooltip-value", children: e.connectionCount })
      ] }),
      o && /* @__PURE__ */ d.jsxs("div", { className: "daw-perf__tooltip-row", children: [
        /* @__PURE__ */ d.jsx("span", { className: "daw-perf__tooltip-label", children: "JS Heap" }),
        /* @__PURE__ */ d.jsxs("span", { className: "daw-perf__tooltip-value", children: [
          e.memoryMB,
          " MB (",
          e.memoryPct,
          "%)"
        ] })
      ] })
    ] })
  ] });
}
const O2 = "modular-daw", L2 = 1;
function bo() {
  return new Promise((e, n) => {
    const o = indexedDB.open(O2, L2);
    o.onupgradeneeded = () => {
      const s = o.result;
      s.objectStoreNames.contains("sessions") || s.createObjectStore("sessions", { keyPath: "id" }), s.objectStoreNames.contains("audio-buffers") || s.createObjectStore("audio-buffers", { keyPath: "id" });
    }, o.onsuccess = () => e(o.result), o.onerror = () => n(o.error);
  });
}
async function H2(e) {
  const n = await bo();
  return new Promise((o, s) => {
    const i = n.transaction("sessions", "readwrite");
    i.objectStore("sessions").put(e), i.oncomplete = () => o(), i.onerror = () => s(i.error);
  });
}
async function W2(e) {
  const n = await bo();
  return new Promise((o, s) => {
    const l = n.transaction("sessions", "readonly").objectStore("sessions").get(e);
    l.onsuccess = () => o(l.result), l.onerror = () => s(l.error);
  });
}
async function X2(e) {
  const n = await bo();
  return new Promise((o, s) => {
    const i = n.transaction("sessions", "readwrite");
    i.objectStore("sessions").delete(e), i.oncomplete = () => o(), i.onerror = () => s(i.error);
  });
}
async function K2() {
  const e = await bo();
  return new Promise((n, o) => {
    const i = e.transaction("sessions", "readonly").objectStore("sessions").getAll();
    i.onsuccess = () => {
      const l = i.result.sort((c, u) => u.updatedAt - c.updatedAt);
      n(l);
    }, i.onerror = () => o(i.error);
  });
}
async function Z2(e) {
  const n = await bo();
  return new Promise((o, s) => {
    const i = n.transaction("audio-buffers", "readwrite");
    i.objectStore("audio-buffers").put(e), i.oncomplete = () => o(), i.onerror = () => s(i.error);
  });
}
async function Y2(e) {
  const n = await bo();
  return new Promise((o, s) => {
    const l = n.transaction("audio-buffers", "readonly").objectStore("audio-buffers").get(e);
    l.onsuccess = () => o(l.result), l.onerror = () => s(l.error);
  });
}
async function Mi(e, n) {
  const o = n ?? ft(), { nodes: s, edges: i } = de.getState(), { regions: l } = me.getState(), { bpm: c, loopEnabled: u, loopStart: p, loopEnd: g } = Ge.getState(), m = /* @__PURE__ */ new Set();
  for (const w of s)
    w.data.bufferRef && m.add(w.data.bufferRef);
  for (const w of Object.values(l))
    for (const C of w)
      m.add(C.bufferRef);
  for (const w of m) {
    const C = Fa(w);
    if (!C) continue;
    const x = [];
    for (let I = 0; I < C.buffer.numberOfChannels; I++) {
      const b = C.buffer.getChannelData(I), _ = new ArrayBuffer(b.byteLength);
      new Float32Array(_).set(b), x.push(_);
    }
    await Z2({
      id: w,
      channelData: x,
      sampleRate: C.buffer.sampleRate,
      numberOfChannels: C.buffer.numberOfChannels,
      fileName: C.fileName
    });
  }
  const h = {
    id: o,
    name: e,
    updatedAt: Date.now(),
    graph: { nodes: s, edges: i },
    editor: { regions: l },
    transport: { bpm: c, loopEnabled: u, loopStart: p, loopEnd: g },
    bufferRefs: Array.from(m)
  };
  return await H2(h), o;
}
async function U2(e) {
  const n = await W2(e);
  if (!n) return !1;
  const o = jh();
  Sh();
  for (const c of n.bufferRefs) {
    const u = await Y2(c);
    if (!u || !o) continue;
    const p = o.createBuffer(
      u.numberOfChannels,
      new Float32Array(u.channelData[0]).length,
      u.sampleRate
    );
    for (let m = 0; m < u.numberOfChannels; m++)
      p.copyToChannel(new Float32Array(u.channelData[m]), m);
    const g = Hi(p, 200);
    Xu(c, {
      buffer: p,
      peaks: g,
      fileName: u.fileName,
      duration: p.duration,
      channelCount: p.numberOfChannels,
      sampleRate: p.sampleRate
    });
  }
  const s = n.graph, i = n.editor, l = n.transport;
  return de.getState().loadPatch(s.nodes, s.edges), me.getState().loadRegions(i.regions), Ge.getState().setBpm(l.bpm), l.loopEnabled && Ge.getState().setLoop(l.loopStart, l.loopEnd), !0;
}
function $2() {
  Sh(), de.getState().loadPatch([], []), me.getState().loadRegions({}), Ge.getState().stop(), Ge.getState().seek(0);
}
const Ri = Co()((e) => ({
  currentSessionId: null,
  currentSessionName: "",
  setCurrentSession(n, o) {
    e({ currentSessionId: n, currentSessionName: o });
  }
}));
function Q2({ onClose: e }) {
  const [n, o] = j.useState([]), [s, i] = j.useState(""), [l, c] = j.useState(null), [u, p] = j.useState(!1), g = Ri((_) => _.currentSessionId), m = Ri((_) => _.setCurrentSession), h = j.useCallback(async () => {
    const _ = await K2();
    o(_);
  }, []);
  j.useEffect(() => {
    h();
  }, [h]);
  const w = j.useCallback(async () => {
    if (s.trim()) {
      p(!0), c("Saving...");
      try {
        const _ = await Mi(s.trim());
        m(_, s.trim()), c("Saved"), await h();
      } catch (_) {
        c(`Error: ${_ instanceof Error ? _.message : "Unknown"}`);
      } finally {
        p(!1);
      }
    }
  }, [s, h, m]), C = j.useCallback(async () => {
    if (g) {
      p(!0), c("Saving...");
      try {
        const _ = n.find((k) => k.id === g);
        await Mi((_ == null ? void 0 : _.name) ?? "Untitled", g), c("Saved"), await h();
      } catch (_) {
        c(`Error: ${_ instanceof Error ? _.message : "Unknown"}`);
      } finally {
        p(!1);
      }
    }
  }, [g, n, h]), x = j.useCallback(async (_) => {
    p(!0), c("Loading...");
    try {
      if (await U2(_)) {
        const A = n.find((S) => S.id === _);
        m(_, (A == null ? void 0 : A.name) ?? ""), c("Loaded");
      } else
        c("Session not found");
    } catch (k) {
      c(`Error: ${k instanceof Error ? k.message : "Unknown"}`);
    } finally {
      p(!1);
    }
  }, [n, m]), I = j.useCallback(async (_) => {
    p(!0);
    try {
      await X2(_), g === _ && m(null, ""), await h(), c("Deleted");
    } catch (k) {
      c(`Error: ${k instanceof Error ? k.message : "Unknown"}`);
    } finally {
      p(!1);
    }
  }, [g, h, m]), b = j.useCallback(() => {
    $2(), m(null, ""), i(""), c("New session");
  }, [m]);
  return /* @__PURE__ */ d.jsx("div", { className: "daw-session-overlay", onClick: e, children: /* @__PURE__ */ d.jsxs("div", { className: "daw-session-manager", onClick: (_) => _.stopPropagation(), children: [
    /* @__PURE__ */ d.jsxs("div", { className: "daw-session-manager__header", children: [
      /* @__PURE__ */ d.jsx("span", { children: "Sessions" }),
      /* @__PURE__ */ d.jsx("button", { className: "daw-session-manager__close", onClick: e, children: /* @__PURE__ */ d.jsxs("svg", { width: "14", height: "14", viewBox: "0 0 14 14", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", children: [
        /* @__PURE__ */ d.jsx("line", { x1: "3", y1: "3", x2: "11", y2: "11" }),
        /* @__PURE__ */ d.jsx("line", { x1: "11", y1: "3", x2: "3", y2: "11" })
      ] }) })
    ] }),
    /* @__PURE__ */ d.jsxs("div", { className: "daw-session-manager__body", children: [
      /* @__PURE__ */ d.jsxs("div", { className: "daw-session-manager__save-row", children: [
        /* @__PURE__ */ d.jsx(
          "input",
          {
            type: "text",
            className: "daw-session-manager__input",
            placeholder: "Session name...",
            value: s,
            onChange: (_) => i(_.target.value),
            onKeyDown: (_) => _.key === "Enter" && w(),
            disabled: u
          }
        ),
        /* @__PURE__ */ d.jsx(
          "button",
          {
            className: "daw-session-manager__btn",
            onClick: w,
            disabled: u || !s.trim(),
            children: "Save As"
          }
        ),
        g && /* @__PURE__ */ d.jsx(
          "button",
          {
            className: "daw-session-manager__btn",
            onClick: C,
            disabled: u,
            children: "Save"
          }
        )
      ] }),
      /* @__PURE__ */ d.jsx(
        "button",
        {
          className: "daw-session-manager__btn daw-session-manager__btn--new",
          onClick: b,
          disabled: u,
          children: "New Session"
        }
      ),
      n.length > 0 && /* @__PURE__ */ d.jsx("div", { className: "daw-session-manager__list", children: n.map((_) => /* @__PURE__ */ d.jsxs(
        "div",
        {
          className: `daw-session-manager__item ${_.id === g ? "active" : ""}`,
          children: [
            /* @__PURE__ */ d.jsxs("div", { className: "daw-session-manager__item-info", children: [
              /* @__PURE__ */ d.jsx("span", { className: "daw-session-manager__item-name", children: _.name }),
              /* @__PURE__ */ d.jsx("span", { className: "daw-session-manager__item-date", children: new Date(_.updatedAt).toLocaleString() })
            ] }),
            /* @__PURE__ */ d.jsxs("div", { className: "daw-session-manager__item-actions", children: [
              /* @__PURE__ */ d.jsx(
                "button",
                {
                  className: "daw-session-manager__btn--sm",
                  onClick: () => x(_.id),
                  disabled: u,
                  children: "Load"
                }
              ),
              /* @__PURE__ */ d.jsx(
                "button",
                {
                  className: "daw-session-manager__btn--sm daw-session-manager__btn--danger",
                  onClick: () => I(_.id),
                  disabled: u,
                  children: "Del"
                }
              )
            ] })
          ]
        },
        _.id
      )) }),
      l && /* @__PURE__ */ d.jsx("div", { className: "daw-session-manager__status", children: l })
    ] })
  ] }) });
}
function J2({ onToggleFullscreen: e }) {
  const { undo: n, redo: o, canUndo: s, canRedo: i } = V2(), [l, c] = j.useState(!1), [u, p] = j.useState(!1);
  return j.useEffect(() => {
    const g = () => c(!!document.fullscreenElement);
    return document.addEventListener("fullscreenchange", g), () => document.removeEventListener("fullscreenchange", g);
  }, []), /* @__PURE__ */ d.jsxs("div", { className: "daw-toolbar", children: [
    /* @__PURE__ */ d.jsx(
      "button",
      {
        className: "daw-toolbar__btn",
        onClick: () => p(!0),
        title: "Sessions",
        children: /* @__PURE__ */ d.jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
          /* @__PURE__ */ d.jsx("path", { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }),
          /* @__PURE__ */ d.jsx("polyline", { points: "14 2 14 8 20 8" })
        ] })
      }
    ),
    /* @__PURE__ */ d.jsx("div", { className: "daw-toolbar__sep" }),
    /* @__PURE__ */ d.jsx(
      "button",
      {
        className: "daw-toolbar__btn",
        onClick: n,
        disabled: !s(),
        title: "Undo (Ctrl+Z)",
        children: /* @__PURE__ */ d.jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
          /* @__PURE__ */ d.jsx("path", { d: "M3 7v6h6" }),
          /* @__PURE__ */ d.jsx("path", { d: "M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" })
        ] })
      }
    ),
    /* @__PURE__ */ d.jsx(
      "button",
      {
        className: "daw-toolbar__btn",
        onClick: o,
        disabled: !i(),
        title: "Redo (Ctrl+Shift+Z)",
        children: /* @__PURE__ */ d.jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
          /* @__PURE__ */ d.jsx("path", { d: "M21 7v6h-6" }),
          /* @__PURE__ */ d.jsx("path", { d: "M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13" })
        ] })
      }
    ),
    /* @__PURE__ */ d.jsx("div", { className: "daw-toolbar__sep" }),
    /* @__PURE__ */ d.jsx(
      "button",
      {
        className: "daw-toolbar__btn",
        onClick: e,
        title: l ? "Exit Fullscreen" : "Fullscreen",
        children: l ? /* @__PURE__ */ d.jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
          /* @__PURE__ */ d.jsx("path", { d: "M8 3v3a2 2 0 0 1-2 2H3" }),
          /* @__PURE__ */ d.jsx("path", { d: "M21 8h-3a2 2 0 0 1-2-2V3" }),
          /* @__PURE__ */ d.jsx("path", { d: "M3 16h3a2 2 0 0 1 2 2v3" }),
          /* @__PURE__ */ d.jsx("path", { d: "M16 21v-3a2 2 0 0 1 2-2h3" })
        ] }) : /* @__PURE__ */ d.jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
          /* @__PURE__ */ d.jsx("path", { d: "M8 3H5a2 2 0 0 0-2 2v3" }),
          /* @__PURE__ */ d.jsx("path", { d: "M21 8V5a2 2 0 0 0-2-2h-3" }),
          /* @__PURE__ */ d.jsx("path", { d: "M3 16v3a2 2 0 0 0 2 2h3" }),
          /* @__PURE__ */ d.jsx("path", { d: "M16 21h3a2 2 0 0 0 2-2v-3" })
        ] })
      }
    ),
    /* @__PURE__ */ d.jsx("div", { className: "daw-toolbar__sep" }),
    /* @__PURE__ */ d.jsx(z2, {}),
    u && /* @__PURE__ */ d.jsx(Q2, { onClose: () => p(!1) })
  ] });
}
function Dh(e) {
  const n = Math.floor(e / 60), o = Math.floor(e % 60), s = Math.floor(e % 1 * 10);
  return `${n}:${o.toString().padStart(2, "0")}.${s}`;
}
function q2() {
  const e = Ge((I) => I.isPlaying), n = Ge((I) => I.position), o = Ge((I) => I.loopEnabled), s = Ge((I) => I.play), i = Ge((I) => I.stop), l = Ge((I) => I.pause), c = Ge((I) => I.seek), u = Ge((I) => I.toggleLoop), p = Ut((I) => I.isRecording), g = Ut((I) => I.armedTrackIds.length > 0), m = Ut((I) => I.setRecording), h = j.useCallback(() => {
    e ? l() : s();
  }, [e, s, l]), w = j.useCallback(() => {
    p && m(!1), i();
  }, [i, p, m]), C = j.useCallback(() => {
    p ? m(!1) : g && m(!0);
  }, [p, g, m]), x = j.useCallback(() => {
    c(0);
  }, [c]);
  return /* @__PURE__ */ d.jsxs("div", { className: "daw-transport", children: [
    /* @__PURE__ */ d.jsx(
      "button",
      {
        className: "daw-transport__btn",
        onClick: x,
        title: "Return to start (Enter)",
        "aria-label": "Return to start",
        children: /* @__PURE__ */ d.jsxs("svg", { width: "14", height: "14", viewBox: "0 0 14 14", fill: "currentColor", children: [
          /* @__PURE__ */ d.jsx("rect", { x: "2", y: "3", width: "2", height: "8" }),
          /* @__PURE__ */ d.jsx("polygon", { points: "12,3 12,11 5,7" })
        ] })
      }
    ),
    /* @__PURE__ */ d.jsx(
      "button",
      {
        className: `daw-transport__btn daw-transport__btn--play ${e ? "active" : ""}`,
        onClick: h,
        title: e ? "Pause (Space)" : "Play (Space)",
        "aria-label": e ? "Pause" : "Play",
        children: e ? /* @__PURE__ */ d.jsxs("svg", { width: "14", height: "14", viewBox: "0 0 14 14", fill: "currentColor", children: [
          /* @__PURE__ */ d.jsx("rect", { x: "3", y: "2", width: "3", height: "10", rx: "0.5" }),
          /* @__PURE__ */ d.jsx("rect", { x: "8", y: "2", width: "3", height: "10", rx: "0.5" })
        ] }) : /* @__PURE__ */ d.jsx("svg", { width: "14", height: "14", viewBox: "0 0 14 14", fill: "currentColor", children: /* @__PURE__ */ d.jsx("polygon", { points: "3,2 12,7 3,12" }) })
      }
    ),
    /* @__PURE__ */ d.jsx(
      "button",
      {
        className: "daw-transport__btn",
        onClick: w,
        title: "Stop",
        "aria-label": "Stop",
        children: /* @__PURE__ */ d.jsx("svg", { width: "14", height: "14", viewBox: "0 0 14 14", fill: "currentColor", children: /* @__PURE__ */ d.jsx("rect", { x: "3", y: "3", width: "8", height: "8", rx: "1" }) })
      }
    ),
    /* @__PURE__ */ d.jsx(
      "button",
      {
        className: `daw-transport__btn ${o ? "active" : ""}`,
        onClick: u,
        title: `Loop ${o ? "on" : "off"} (L)`,
        "aria-label": `Toggle loop ${o ? "off" : "on"}`,
        children: /* @__PURE__ */ d.jsxs("svg", { width: "14", height: "14", viewBox: "0 0 14 14", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round", children: [
          /* @__PURE__ */ d.jsx("path", { d: "M10 3H5a3 3 0 0 0 0 6h4a3 3 0 0 1 0 6H4" }),
          /* @__PURE__ */ d.jsx("polyline", { points: "8,1 10,3 8,5" }),
          /* @__PURE__ */ d.jsx("polyline", { points: "6,9 4,11 6,13" })
        ] })
      }
    ),
    /* @__PURE__ */ d.jsx(
      "button",
      {
        className: `daw-transport__btn daw-transport__btn--record ${p ? "active" : ""}`,
        onClick: C,
        disabled: !g && !p,
        title: p ? "Stop recording" : g ? "Record" : "Arm a track first",
        "aria-label": p ? "Stop recording" : "Record",
        children: /* @__PURE__ */ d.jsx("svg", { width: "14", height: "14", viewBox: "0 0 14 14", fill: "currentColor", children: /* @__PURE__ */ d.jsx("circle", { cx: "7", cy: "7", r: "5" }) })
      }
    ),
    /* @__PURE__ */ d.jsx("div", { className: "daw-transport__position", children: Dh(n) })
  ] });
}
function eA() {
  const e = an((o) => o.scopeStack), n = an((o) => o.popToDepth);
  return e.length <= 1 ? null : /* @__PURE__ */ d.jsx("nav", { className: "daw-breadcrumb", "aria-label": "Module scope", children: e.map((o, s) => {
    const i = s === e.length - 1;
    return /* @__PURE__ */ d.jsxs("span", { className: "daw-breadcrumb__item", children: [
      s > 0 && /* @__PURE__ */ d.jsx("span", { className: "daw-breadcrumb__sep", children: "›" }),
      i ? /* @__PURE__ */ d.jsx("span", { className: "daw-breadcrumb__current", children: o.label }) : /* @__PURE__ */ d.jsx(
        "button",
        {
          className: "daw-breadcrumb__link",
          onClick: () => n(s),
          children: o.label
        }
      )
    ] }, s);
  }) });
}
function tA() {
  const e = me((S) => S.activeTool), n = me((S) => S.setTool), o = me((S) => S.snapEnabled), s = me((S) => S.toggleSnap), i = me((S) => S.gridResolution), l = me((S) => S.setGridResolution), c = me((S) => S.zoom), u = me((S) => S.setZoom), p = me((S) => S.closeEditor), g = me((S) => S.overlapMode), m = me((S) => S.setOverlapMode), h = me((S) => S.selectedTrackIds), w = me((S) => S.toggleTrackInEditor), C = de((S) => S.nodes), x = j.useCallback((S) => {
    n(S);
  }, [n]), I = j.useCallback((S) => {
    const V = vu.find((G) => G.label === S.target.value);
    V && l(V);
  }, [l]), b = j.useCallback(() => {
    u(c * 1.5);
  }, [c, u]), _ = j.useCallback(() => {
    u(c / 1.5);
  }, [c, u]), k = j.useCallback((S) => {
    m(S.target.value);
  }, [m]), A = [
    { tool: "pointer", label: "V", shortcut: "Pointer (V)" },
    { tool: "trim", label: "T", shortcut: "Trim (T)" },
    { tool: "slice", label: "S", shortcut: "Slice (S)" },
    { tool: "fade", label: "F", shortcut: "Fade (F)" },
    { tool: "zoom", label: "Z", shortcut: "Zoom (Z)" },
    { tool: "draw", label: "D", shortcut: "Draw (D)" }
  ];
  return /* @__PURE__ */ d.jsxs("div", { className: "daw-editor-toolbar", children: [
    /* @__PURE__ */ d.jsx("div", { className: "daw-editor-toolbar__section", children: A.map(({ tool: S, label: V, shortcut: G }) => /* @__PURE__ */ d.jsx(
      "button",
      {
        className: `daw-editor-toolbar__btn ${e === S ? "active" : ""}`,
        onClick: () => x(S),
        title: G,
        "aria-label": G,
        children: V
      },
      S
    )) }),
    /* @__PURE__ */ d.jsx("div", { className: "daw-editor-toolbar__divider" }),
    /* @__PURE__ */ d.jsxs("div", { className: "daw-editor-toolbar__section", children: [
      /* @__PURE__ */ d.jsx(
        "button",
        {
          className: `daw-editor-toolbar__btn daw-editor-toolbar__btn--snap ${o ? "active" : ""}`,
          onClick: s,
          title: "Toggle snap (G)",
          "aria-label": "Toggle snap",
          children: "Snap"
        }
      ),
      /* @__PURE__ */ d.jsx(
        "select",
        {
          className: "daw-editor-toolbar__select",
          value: i.label,
          onChange: I,
          children: vu.map((S) => /* @__PURE__ */ d.jsx("option", { value: S.label, children: S.label }, S.label))
        }
      )
    ] }),
    /* @__PURE__ */ d.jsx("div", { className: "daw-editor-toolbar__divider" }),
    /* @__PURE__ */ d.jsx("div", { className: "daw-editor-toolbar__section", children: /* @__PURE__ */ d.jsxs(
      "select",
      {
        className: "daw-editor-toolbar__select",
        value: g,
        onChange: k,
        title: "Region overlap mode",
        children: [
          /* @__PURE__ */ d.jsx("option", { value: "layer", children: "Layer" }),
          /* @__PURE__ */ d.jsx("option", { value: "crossfade", children: "Crossfade" }),
          /* @__PURE__ */ d.jsx("option", { value: "overwrite", children: "Overwrite" }),
          /* @__PURE__ */ d.jsx("option", { value: "ripple", children: "Ripple" })
        ]
      }
    ) }),
    /* @__PURE__ */ d.jsx("div", { className: "daw-editor-toolbar__divider" }),
    /* @__PURE__ */ d.jsxs("div", { className: "daw-editor-toolbar__zoom", children: [
      /* @__PURE__ */ d.jsx(
        "button",
        {
          className: "daw-editor-toolbar__zoom-btn",
          onClick: _,
          title: "Zoom out",
          "aria-label": "Zoom out",
          children: "−"
        }
      ),
      /* @__PURE__ */ d.jsx(
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
    /* @__PURE__ */ d.jsx("div", { className: "daw-editor-toolbar__tracks", children: h.map((S) => {
      const V = C.find((T) => T.id === S), G = (V == null ? void 0 : V.data.fileName) ?? (V == null ? void 0 : V.data.label) ?? "Track";
      return /* @__PURE__ */ d.jsxs("span", { className: "daw-editor-toolbar__track-tag", title: G, children: [
        G,
        h.length > 1 && /* @__PURE__ */ d.jsx(
          "button",
          {
            className: "daw-editor-toolbar__track-tag-close",
            onClick: () => w(S),
            "aria-label": `Remove ${G} from editor`,
            children: "×"
          }
        )
      ] }, S);
    }) }),
    /* @__PURE__ */ d.jsx(
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
function pi(e, n) {
  return n === null || n <= 0 ? e : Math.round(e / n) * n;
}
function Gh(e, n, o) {
  if (o === null || o <= 0) return [];
  const s = [], i = Math.ceil(e / o) * o;
  for (let l = i; l <= n; l += o)
    s.push(l);
  return s;
}
function nA({ width: e }) {
  const n = j.useRef(null), o = me((m) => m.zoom), s = me((m) => m.scrollX), i = me((m) => m.gridResolution), l = Ge((m) => m.bpm), c = Ge((m) => m.seek), u = 24, p = Bh(i, l);
  j.useEffect(() => {
    const m = n.current;
    if (!m || e <= 0) return;
    const h = window.devicePixelRatio || 1;
    m.width = e * h, m.height = u * h, m.style.width = `${e}px`, m.style.height = `${u}px`;
    const w = m.getContext("2d");
    if (!w) return;
    w.scale(h, h), w.clearRect(0, 0, e, u);
    const C = s, x = s + e / o, b = 60 / o, _ = [0.1, 0.25, 0.5, 1, 2, 5, 10, 15, 30, 60];
    let k = _[0];
    for (const T of _)
      if (T >= b) {
        k = T;
        break;
      }
    const A = getComputedStyle(m), S = A.getPropertyValue("--color-text-muted").trim() || "#666", V = A.getPropertyValue("--color-border").trim() || "#e5e5e5";
    w.textAlign = "left", w.textBaseline = "bottom", w.font = "10px Inter, sans-serif";
    const G = Math.ceil(C / k) * k;
    for (let T = G; T <= x; T += k) {
      const K = (T - s) * o;
      w.strokeStyle = V, w.lineWidth = 1, w.beginPath(), w.moveTo(Math.round(K) + 0.5, u), w.lineTo(Math.round(K) + 0.5, u - 8), w.stroke(), w.fillStyle = S;
      const D = rA(T);
      w.fillText(D, Math.round(K) + 3, u - 2);
    }
    if (p !== null) {
      const T = Gh(C, x, p);
      w.strokeStyle = V, w.lineWidth = 0.5;
      for (const K of T) {
        const D = (K - s) * o;
        w.beginPath(), w.moveTo(Math.round(D) + 0.5, u), w.lineTo(Math.round(D) + 0.5, u - 4), w.stroke();
      }
    }
  }, [e, o, s, p, l]);
  const g = j.useCallback((m) => {
    var x;
    const h = (x = n.current) == null ? void 0 : x.getBoundingClientRect();
    if (!h) return;
    const w = m.clientX - h.left, C = s + w / o;
    c(Math.max(0, C));
  }, [s, o, c]);
  return /* @__PURE__ */ d.jsx(
    "canvas",
    {
      ref: n,
      className: "daw-editor__ruler",
      onClick: g,
      style: { cursor: "pointer" }
    }
  );
}
function rA(e) {
  if (e < 60)
    return `${e.toFixed(e % 1 === 0 ? 0 : 1)}s`;
  const n = Math.floor(e / 60), o = Math.floor(e % 60);
  return `${n}:${o.toString().padStart(2, "0")}`;
}
const Eg = /* @__PURE__ */ new Map(), Dg = /* @__PURE__ */ new Map();
function oA(e, n, o, s) {
  const i = Math.ceil(s * n), l = Math.max(100, Math.min(i, o.length));
  let c = Eg.get(e);
  c || (c = [], Eg.set(e, c));
  let u = null, p = 1 / 0;
  for (const m of c) {
    const h = Math.abs(m.numBins - l);
    h < p && (p = h, u = m);
  }
  if (u && p / l < 0.5)
    return u.peaks;
  const g = Hi(o, l);
  return c.push({ numBins: l, peaks: g }), c.length > 5 && c.shift(), g;
}
function aA(e, n, o, s) {
  const i = Math.ceil(s * n), l = Math.max(100, Math.min(i, o.length));
  let c = Dg.get(e);
  c || (c = [], Dg.set(e, c));
  let u = null, p = 1 / 0;
  for (const m of c) {
    const h = Math.abs(m.numBins - l);
    h < p && (p = h, u = m);
  }
  if (u && p / l < 0.5)
    return u.peaks;
  const g = I2(o, l);
  return c.push({ numBins: l, peaks: g }), c.length > 5 && c.shift(), g;
}
function sA({ width: e, height: n, trackId: o }) {
  const s = j.useRef(null), i = me((T) => T.zoom), l = me((T) => T.scrollX), c = me((T) => T.setScrollX), u = me((T) => T.setZoom), p = me((T) => T.regions[o] ?? []), g = me((T) => T.selectedRegionIds), m = me((T) => T.activeTool), h = me((T) => T.snapEnabled), w = me((T) => T.gridResolution), C = Ge((T) => T.bpm), x = Ge((T) => T.seek), I = Bh(w, C), b = j.useRef(null);
  j.useEffect(() => {
    const T = s.current;
    if (!T || e <= 0 || n <= 0) return;
    const K = window.devicePixelRatio || 1;
    T.width = e * K, T.height = n * K, T.style.width = `${e}px`, T.style.height = `${n}px`;
    const D = T.getContext("2d");
    if (!D) return;
    D.scale(K, K), D.clearRect(0, 0, e, n);
    const F = getComputedStyle(T), z = F.getPropertyValue("--color-bg").trim() || "#f8f9fa", W = F.getPropertyValue("--color-border").trim() || "#e5e5e5", q = F.getPropertyValue("--color-accent").trim() || "#2563eb";
    D.fillStyle = z, D.fillRect(0, 0, e, n);
    const R = l, Y = l + e / i;
    if (I !== null) {
      const H = Gh(R, Y, I);
      D.strokeStyle = W, D.lineWidth = 0.5, D.setLineDash([2, 4]);
      for (const U of H) {
        const E = (U - l) * i;
        D.beginPath(), D.moveTo(Math.round(E) + 0.5, 0), D.lineTo(Math.round(E) + 0.5, n), D.stroke();
      }
      D.setLineDash([]);
    }
    for (const H of p) {
      if (H.position + H.duration < R || H.position > Y) continue;
      const E = (H.position - l) * i, P = H.duration * i, Z = g.includes(H.id);
      D.fillStyle = Z ? "rgba(37, 99, 235, 0.15)" : "rgba(37, 99, 235, 0.08)", D.fillRect(E, 4, P, n - 8), D.strokeStyle = Z ? q : W, D.lineWidth = Z ? 2 : 1, D.strokeRect(E, 4, P, n - 8);
      const M = Fa(H.bufferRef);
      if (M) {
        const L = M.channelCount > 1, te = Math.max(0, E), re = Math.min(e, E + P);
        if (L) {
          const le = aA(
            H.bufferRef,
            i,
            M.buffer,
            M.duration
          ), ue = 4, ne = (n - 8) / 2, pe = ue + ne / 2, be = ue + ne + ne / 2, _e = (ne - 4) / 2;
          D.strokeStyle = W, D.lineWidth = 0.5, D.beginPath(), D.moveTo(te, ue + ne), D.lineTo(re, ue + ne), D.stroke(), D.fillStyle = Z ? q : "rgba(37, 99, 235, 0.6)";
          for (let Ce = Math.floor(te); Ce < re; Ce++) {
            const xe = l + Ce / i, Re = H.sourceOffset + (xe - H.position), Be = Math.floor(Re / M.duration * le.left.length);
            if (Be < 0 || Be >= le.left.length) continue;
            const je = le.left[Be] * _e;
            D.fillRect(Ce, pe - je, 1, je * 2);
            const We = le.right[Be] * _e;
            D.fillRect(Ce, be - We, 1, We * 2);
          }
        } else {
          const le = oA(
            H.bufferRef,
            i,
            M.buffer,
            M.duration
          ), ue = n / 2, fe = (n - 16) / 2;
          D.fillStyle = Z ? q : "rgba(37, 99, 235, 0.6)";
          for (let ne = Math.floor(te); ne < re; ne++) {
            const pe = l + ne / i, be = H.sourceOffset + (pe - H.position), _e = Math.floor(be / M.duration * le.length);
            if (_e < 0 || _e >= le.length) continue;
            const xe = le[_e] * fe;
            D.fillRect(ne, ue - xe, 1, xe * 2);
          }
        }
      }
      if (H.fadeIn > 1e-3) {
        const L = H.fadeIn * i, te = D.createLinearGradient(E, 0, E + L, 0);
        te.addColorStop(0, "rgba(0,0,0,0.3)"), te.addColorStop(1, "rgba(0,0,0,0)"), D.fillStyle = te, D.fillRect(E, 4, L, n - 8);
      }
      if (H.fadeOut > 1e-3) {
        const L = H.fadeOut * i, te = E + P - L, re = D.createLinearGradient(te, 0, te + L, 0);
        re.addColorStop(0, "rgba(0,0,0,0)"), re.addColorStop(1, "rgba(0,0,0,0.3)"), D.fillStyle = re, D.fillRect(te, 4, L, n - 8);
      }
    }
  }, [e, n, i, l, p, g, I, C]);
  const _ = j.useCallback((T) => {
    var K;
    if (T.preventDefault(), T.ctrlKey || T.metaKey) {
      const D = (K = s.current) == null ? void 0 : K.getBoundingClientRect();
      if (!D) return;
      const F = T.clientX - D.left, z = l + F / i, W = T.deltaY < 0 ? 1.2 : 1 / 1.2, q = Math.max(10, Math.min(1e3, i * W)), R = z - F / q;
      u(q), c(Math.max(0, R));
    } else {
      const D = T.deltaX !== 0 ? T.deltaX : T.deltaY;
      c(Math.max(0, l + D / i));
    }
  }, [i, l, u, c]), k = j.useCallback((T) => {
    const K = l + T / i;
    for (let D = p.length - 1; D >= 0; D--) {
      const F = p[D];
      if (K >= F.position && K <= F.position + F.duration)
        return F;
    }
    return null;
  }, [l, i, p]), A = j.useCallback((T, K) => {
    const F = (K.position - l) * i, z = (K.position + K.duration - l) * i;
    return Math.abs(T - F) < 6 ? "left" : Math.abs(T - z) < 6 ? "right" : null;
  }, [l, i]), S = j.useCallback((T) => {
    var F;
    const K = (F = s.current) == null ? void 0 : F.getBoundingClientRect();
    if (!K) return;
    const D = T.clientX - K.left;
    if (m === "pointer") {
      const z = k(D);
      if (z)
        A(D, z) === null && (me.getState().selectRegions(
          T.shiftKey ? [...g, z.id] : [z.id]
        ), b.current = {
          type: "move",
          regionId: z.id,
          startX: D,
          startTime: z.position,
          originalRegion: { ...z }
        });
      else {
        me.getState().selectRegions([]);
        const W = l + D / i;
        x(Math.max(0, W));
      }
    } else if (m === "trim") {
      const z = k(D);
      if (z) {
        const W = A(D, z);
        W && (me.getState().selectRegions([z.id]), b.current = {
          type: W === "left" ? "trim-left" : "trim-right",
          regionId: z.id,
          startX: D,
          startTime: W === "left" ? z.position : z.position + z.duration,
          originalRegion: { ...z }
        });
      }
    } else if (m === "slice") {
      const z = k(D);
      if (z) {
        let W = l + D / i;
        h && I !== null && (W = pi(W, I)), me.getState().splitRegion(z.id, W);
      }
    }
  }, [m, k, A, g, l, i, x, h, I]), V = j.useCallback((T) => {
    var q;
    const K = (q = s.current) == null ? void 0 : q.getBoundingClientRect();
    if (!K) return;
    const D = T.clientX - K.left, F = b.current;
    if (!F) {
      if (m === "trim") {
        const R = k(D);
        R && A(D, R) ? s.current.style.cursor = "col-resize" : s.current.style.cursor = "default";
      }
      return;
    }
    const W = (D - F.startX) / i;
    if (F.type === "move") {
      let R = F.originalRegion.position + W;
      h && I !== null && (R = pi(R, I)), R = Math.max(0, R), me.getState().updateRegion(F.regionId, { position: R });
    } else if (F.type === "trim-left") {
      let R = F.originalRegion.position + W;
      h && I !== null && (R = pi(R, I));
      const Y = F.originalRegion.position + F.originalRegion.duration - 0.01;
      R = Math.max(0, Math.min(R, Y));
      const H = R - F.originalRegion.position;
      me.getState().updateRegion(F.regionId, {
        position: R,
        sourceOffset: F.originalRegion.sourceOffset + H,
        duration: F.originalRegion.duration - H
      });
    } else if (F.type === "trim-right") {
      let R = F.originalRegion.position + F.originalRegion.duration + W;
      h && I !== null && (R = pi(R, I));
      const Y = F.originalRegion.position + 0.01;
      R = Math.max(Y, R), me.getState().updateRegion(F.regionId, {
        duration: R - F.originalRegion.position
      });
    }
  }, [i, m, k, A, h, I]), G = j.useCallback(() => {
    b.current = null;
  }, []);
  return /* @__PURE__ */ d.jsx(
    "canvas",
    {
      ref: s,
      className: "daw-editor__canvas",
      onWheel: _,
      onMouseDown: S,
      onMouseMove: V,
      onMouseUp: G,
      onMouseLeave: G,
      style: { cursor: m === "slice" ? "crosshair" : void 0 }
    }
  );
}
function iA({ width: e, height: n }) {
  const o = j.useRef(null), s = j.useRef(0), i = me((c) => c.zoom), l = me((c) => c.scrollX);
  return j.useEffect(() => {
    const c = o.current;
    if (!c || e <= 0 || n <= 0) return;
    const u = window.devicePixelRatio || 1;
    c.width = e * u, c.height = n * u, c.style.width = `${e}px`, c.style.height = `${n}px`;
    const p = c.getContext("2d");
    if (!p) return;
    const g = () => {
      p.setTransform(u, 0, 0, u, 0, 0), p.clearRect(0, 0, e, n);
      const m = Ge.getState(), h = me.getState().zoom, w = me.getState().scrollX;
      if (m.loopEnabled && m.loopEnd > m.loopStart) {
        const x = (m.loopStart - w) * h, I = (m.loopEnd - w) * h, b = Math.max(0, x), _ = Math.min(e, I);
        _ > b && (p.fillStyle = "rgba(37, 99, 235, 0.08)", p.fillRect(b, 0, _ - b, n), p.strokeStyle = "rgba(37, 99, 235, 0.4)", p.lineWidth = 1, p.setLineDash([4, 3]), x >= 0 && x <= e && (p.beginPath(), p.moveTo(Math.round(x) + 0.5, 0), p.lineTo(Math.round(x) + 0.5, n), p.stroke()), I >= 0 && I <= e && (p.beginPath(), p.moveTo(Math.round(I) + 0.5, 0), p.lineTo(Math.round(I) + 0.5, n), p.stroke()), p.setLineDash([]));
      }
      const C = (m.position - w) * h;
      C >= -1 && C <= e + 1 && (p.strokeStyle = "#ef4444", p.lineWidth = 1.5, p.beginPath(), p.moveTo(Math.round(C) + 0.5, 0), p.lineTo(Math.round(C) + 0.5, n), p.stroke(), p.fillStyle = "#ef4444", p.beginPath(), p.moveTo(C - 5, 0), p.lineTo(C + 5, 0), p.lineTo(C, 6), p.closePath(), p.fill()), s.current = requestAnimationFrame(g);
    };
    return s.current = requestAnimationFrame(g), () => {
      cancelAnimationFrame(s.current);
    };
  }, [e, n, i, l]), /* @__PURE__ */ d.jsx(
    "canvas",
    {
      ref: o,
      className: "daw-editor__overlay"
    }
  );
}
const lA = 120, cA = 250, uA = 600, dA = 60;
function fA() {
  const e = me((b) => b.isOpen), n = me((b) => b.selectedTrackIds), o = de((b) => b.nodes), s = j.useRef(null), [i, l] = j.useState(cA), [c, u] = j.useState(0), p = j.useRef(!1), g = j.useRef(0), m = j.useRef(0);
  j.useEffect(() => {
    if (!e || !s.current) return;
    const b = new ResizeObserver((_) => {
      for (const k of _)
        u(k.contentRect.width);
    });
    return b.observe(s.current), () => b.disconnect();
  }, [e]);
  const h = j.useCallback((b) => {
    b.preventDefault(), p.current = !0, g.current = b.clientY, m.current = i;
    const _ = (A) => {
      if (!p.current) return;
      const S = g.current - A.clientY, V = Math.max(lA, Math.min(uA, m.current + S));
      l(V);
    }, k = () => {
      p.current = !1, document.removeEventListener("mousemove", _), document.removeEventListener("mouseup", k);
    };
    document.addEventListener("mousemove", _), document.addEventListener("mouseup", k);
  }, [i]);
  if (!e || n.length === 0) return null;
  const x = i - 32 - 24, I = Math.max(dA, Math.floor(x / n.length));
  return /* @__PURE__ */ d.jsxs(
    "div",
    {
      className: "daw-editor",
      style: { height: i },
      ref: s,
      children: [
        /* @__PURE__ */ d.jsx(
          "div",
          {
            className: "daw-editor__resize-handle",
            onMouseDown: h
          }
        ),
        /* @__PURE__ */ d.jsx(tA, {}),
        /* @__PURE__ */ d.jsx(nA, { width: c }),
        /* @__PURE__ */ d.jsx("div", { className: "daw-editor__track-lanes", children: n.map((b) => {
          const _ = o.find((A) => A.id === b), k = (_ == null ? void 0 : _.data.fileName) ?? (_ == null ? void 0 : _.data.label) ?? "Track";
          return /* @__PURE__ */ d.jsxs("div", { className: "daw-editor__track-lane", style: { height: I }, children: [
            /* @__PURE__ */ d.jsx("div", { className: "daw-editor__track-label", title: k, children: k }),
            /* @__PURE__ */ d.jsxs("div", { className: "daw-editor__timeline", style: { height: I }, children: [
              /* @__PURE__ */ d.jsx(
                sA,
                {
                  width: c,
                  height: I,
                  trackId: b
                }
              ),
              /* @__PURE__ */ d.jsx(
                iA,
                {
                  width: c,
                  height: I
                }
              )
            ] })
          ] }, b);
        }) })
      ]
    }
  );
}
const pA = navigator.platform.toUpperCase().indexOf("MAC") >= 0, nu = pA ? "⌘" : "Ctrl", gA = [
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
      { action: "Undo", keys: [[nu, "Z"]] },
      { action: "Redo", keys: [[nu, "Shift", "Z"]] },
      { action: "Exit scope / Close editor", keys: [["Esc"]] },
      { action: "Show shortcuts", keys: [["?"]] }
    ]
  },
  {
    title: "Timeline",
    shortcuts: [
      { action: "Zoom in / out", keys: [[nu, "Scroll"]] },
      { action: "Scroll timeline", keys: [["Scroll"]] }
    ]
  }
];
function mA({ onClose: e }) {
  const n = j.useCallback((o) => {
    o.target === o.currentTarget && e();
  }, [e]);
  return j.useEffect(() => {
    const o = (s) => {
      (s.key === "Escape" || s.key === "?") && (s.preventDefault(), e());
    };
    return window.addEventListener("keydown", o), () => window.removeEventListener("keydown", o);
  }, [e]), /* @__PURE__ */ d.jsx("div", { className: "daw-shortcuts-backdrop", onClick: n, children: /* @__PURE__ */ d.jsxs("div", { className: "daw-shortcuts", children: [
    /* @__PURE__ */ d.jsxs("div", { className: "daw-shortcuts__header", children: [
      /* @__PURE__ */ d.jsx("span", { className: "daw-shortcuts__title", children: "Keyboard Shortcuts" }),
      /* @__PURE__ */ d.jsx("button", { className: "daw-shortcuts__close", onClick: e, title: "Close", children: "×" })
    ] }),
    /* @__PURE__ */ d.jsx("div", { className: "daw-shortcuts__body", children: gA.map((o) => /* @__PURE__ */ d.jsxs("div", { className: "daw-shortcuts__group", children: [
      /* @__PURE__ */ d.jsx("div", { className: "daw-shortcuts__group-title", children: o.title }),
      o.shortcuts.map((s) => /* @__PURE__ */ d.jsxs("div", { className: "daw-shortcuts__row", children: [
        /* @__PURE__ */ d.jsx("span", { className: "daw-shortcuts__action", children: s.action }),
        /* @__PURE__ */ d.jsx("span", { className: "daw-shortcuts__keys", children: s.keys[0].map((i, l) => /* @__PURE__ */ d.jsxs("span", { children: [
          l > 0 && /* @__PURE__ */ d.jsx("span", { className: "daw-shortcuts__plus", children: "+" }),
          /* @__PURE__ */ d.jsx("kbd", { className: "daw-shortcuts__key", children: i })
        ] }, l)) })
      ] }, s.action))
    ] }, o.title)) }),
    /* @__PURE__ */ d.jsx("div", { className: "daw-shortcuts__footer", children: /* @__PURE__ */ d.jsx("span", { className: "daw-shortcuts__hint", children: "Press ? or Esc to close" }) })
  ] }) });
}
function hA({ message: e, variant: n = "default", onDismiss: o, duration: s = 2500 }) {
  return j.useEffect(() => {
    const i = setTimeout(o, s);
    return () => clearTimeout(i);
  }, [o, s]), /* @__PURE__ */ d.jsx("div", { className: `daw-toast ${n === "error" ? "daw-toast--error" : ""}`, children: e });
}
const yA = 3e4;
function wA() {
  const e = j.useRef(!1);
  j.useEffect(() => {
    const n = [
      de.subscribe(() => {
        e.current = !0;
      }),
      me.subscribe(() => {
        e.current = !0;
      }),
      Ge.subscribe((o, s) => {
        (o.bpm !== s.bpm || o.loopEnabled !== s.loopEnabled || o.loopStart !== s.loopStart || o.loopEnd !== s.loopEnd) && (e.current = !0);
      })
    ];
    return () => n.forEach((o) => o());
  }, []), j.useEffect(() => {
    const n = setInterval(() => {
      const { currentSessionId: o, currentSessionName: s } = Ri.getState();
      !o || !e.current || (e.current = !1, Mi(s, o).catch(() => {
        e.current = !0;
      }));
    }, yA);
    return () => clearInterval(n);
  }, []), j.useEffect(() => {
    const n = () => {
      const { currentSessionId: o, currentSessionName: s } = Ri.getState();
      o && e.current && Mi(s, o).catch(() => {
      });
    };
    return window.addEventListener("beforeunload", n), () => window.removeEventListener("beforeunload", n);
  }, []);
}
function Ph({ allowedModules: e }) {
  const { nodes: n, edges: o, onNodesChange: s, onEdgesChange: i, onConnect: l, isSession: c } = G2(), u = !c, p = an((D) => D.scopeStack), { initialize: g } = M2();
  wA();
  const [m, h] = j.useState(!1), w = j.useMemo(() => y2(), []), C = j.useRef(null), x = j.useRef(null), [I, b] = j.useState(!1), _ = de((D) => D.lastConnectionError), k = de((D) => D.clearConnectionError), A = j.useCallback(async () => {
    await g(), h(!0);
  }, [g]), S = j.useCallback(() => {
    var D;
    document.fullscreenElement ? document.exitFullscreen() : (D = C.current) == null || D.requestFullscreen();
  }, []), V = j.useCallback((D, F) => {
    if (!F.nodeId || !F.handleId || !x.current) return;
    const z = de.getState().nodes.find((W) => W.id === F.nodeId);
    if (z)
      try {
        const q = ct(z.type).ports.find((R) => R.id === F.handleId);
        q && x.current.setAttribute("data-drag-signal", q.signalType);
      } catch {
      }
  }, []), G = j.useCallback(() => {
    var D;
    (D = x.current) == null || D.removeAttribute("data-drag-signal");
  }, []), T = j.useCallback((D) => {
    const { nodes: F, edges: z } = de.getState();
    return Th(D, F, z).valid;
  }, []);
  j.useEffect(() => {
    if (!m) return;
    const D = (F) => {
      if (!(F.target instanceof HTMLInputElement || F.target instanceof HTMLTextAreaElement))
        if (F.code === "Space") {
          F.preventDefault();
          const { isPlaying: z, play: W, pause: q } = Ge.getState();
          z ? q() : W();
        } else if (F.code === "Enter")
          F.preventDefault(), Ge.getState().seek(0);
        else if (F.code === "Escape") {
          const z = an.getState();
          if (!z.isSessionScope()) {
            z.popToDepth(z.currentDepth() - 1);
            return;
          }
          const W = me.getState();
          W.selectedRegionIds.length > 0 ? W.selectRegions([]) : W.isOpen && W.closeEditor();
        } else if (F.key === "v" || F.key === "V")
          me.getState().isOpen && me.getState().setTool("pointer");
        else if (F.key === "t")
          me.getState().isOpen && me.getState().setTool("trim");
        else if (F.key === "s" && !F.ctrlKey && !F.metaKey)
          me.getState().isOpen && me.getState().setTool("slice");
        else if (F.key === "f" && !F.ctrlKey && !F.metaKey)
          me.getState().isOpen && me.getState().setTool("fade");
        else if (F.key === "z" && !F.ctrlKey && !F.metaKey)
          me.getState().isOpen && me.getState().setTool("zoom");
        else if (F.key === "d" && !F.ctrlKey && !F.metaKey)
          me.getState().isOpen && me.getState().setTool("draw");
        else if (F.key === "g")
          me.getState().isOpen && me.getState().toggleSnap();
        else if ((F.key === "Delete" || F.key === "Backspace") && me.getState().isOpen) {
          const { selectedRegionIds: z, removeRegion: W } = me.getState();
          for (const q of z)
            W(q);
        } else F.key === "l" && !F.ctrlKey && !F.metaKey ? Ge.getState().toggleLoop() : F.key === "?" && (F.preventDefault(), b((z) => !z));
    };
    return window.addEventListener("keydown", D), () => window.removeEventListener("keydown", D);
  }, [m]);
  const K = me((D) => D.isOpen);
  return /* @__PURE__ */ d.jsxs("div", { ref: C, className: `daw-canvas-wrapper ${K ? "daw-canvas-wrapper--editor-open" : ""}`, children: [
    /* @__PURE__ */ d.jsxs("div", { ref: x, className: `daw-canvas-container ${u ? "daw-canvas-container--scope" : ""}`, children: [
      /* @__PURE__ */ d.jsxs(
        VN,
        {
          nodes: n,
          edges: o,
          onNodesChange: s,
          onEdgesChange: i,
          onConnect: l,
          onConnectStart: V,
          onConnectEnd: G,
          isValidConnection: T,
          nodeTypes: w,
          edgeTypes: D2,
          fitView: !0,
          proOptions: { hideAttribution: !0 },
          children: [
            /* @__PURE__ */ d.jsx(KN, { variant: An.Dots, gap: 20, size: 1 }),
            /* @__PURE__ */ d.jsx(f2, { pannable: !0, zoomable: !0, nodeStrokeWidth: 3 }),
            /* @__PURE__ */ d.jsx(qN, {}),
            m && c && /* @__PURE__ */ d.jsx(bn, { position: "top-left", children: /* @__PURE__ */ d.jsx(F2, { allowedModules: e }) }),
            m && /* @__PURE__ */ d.jsx(bn, { position: "top-right", children: /* @__PURE__ */ d.jsx(J2, { onToggleFullscreen: S }) }),
            m && /* @__PURE__ */ d.jsx(bn, { position: "bottom-center", children: /* @__PURE__ */ d.jsx(q2, {}) }),
            m && u && /* @__PURE__ */ d.jsx(bn, { position: "top-center", children: /* @__PURE__ */ d.jsx(eA, {}) }),
            !m && /* @__PURE__ */ d.jsx(bn, { position: "top-center", children: /* @__PURE__ */ d.jsx("button", { className: "daw-start-audio", onClick: A, children: "Start Audio Engine" }) })
          ]
        },
        p.length
      ),
      _ && /* @__PURE__ */ d.jsx(
        hA,
        {
          message: _,
          variant: "error",
          onDismiss: k
        }
      )
    ] }),
    /* @__PURE__ */ d.jsx(fA, {}),
    I && /* @__PURE__ */ d.jsx(mA, { onClose: () => b(!1) })
  ] });
}
function vA() {
  return j.useEffect(() => {
    const { nodes: e, addModule: n } = de.getState();
    e.some((o) => o.type === "master-output") || n("master-output", { x: 600, y: 200 });
  }, []), /* @__PURE__ */ d.jsx(Hu, { children: /* @__PURE__ */ d.jsxs("div", { className: "daw-app", children: [
    /* @__PURE__ */ d.jsxs("div", { className: "daw-header", children: [
      /* @__PURE__ */ d.jsx("h1", { className: "daw-title", children: "Modular DAW" }),
      /* @__PURE__ */ d.jsx("p", { className: "daw-subtitle", children: "Build audio signal chains by connecting modules with virtual patch cables." })
    ] }),
    /* @__PURE__ */ d.jsx(Ph, {})
  ] }) });
}
const Fh = {
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
}, Vh = {
  create(e, n) {
    const o = e.createGain();
    return o.gain.value = kt(n.volume ?? 0), o.connect(e.destination), {
      inputs: { in: o },
      outputs: {},
      setParameter(s, i, l) {
        s === "volume" && o.gain.setTargetAtTime(kt(i), l, 0.02);
      },
      dispose() {
        o.disconnect();
      }
    };
  }
};
function we({
  min: e,
  max: n,
  step: o,
  value: s,
  onChange: i,
  className: l = ""
}) {
  const c = j.useRef(null);
  j.useEffect(() => {
    const p = c.current;
    if (!p) return;
    const g = de.temporal, m = (w) => {
      w.stopPropagation(), g.getState().pause();
    }, h = () => {
      g.getState().resume();
    };
    return p.addEventListener("mousedown", m, !0), p.addEventListener("touchstart", m, !0), p.addEventListener("pointerdown", m, !0), window.addEventListener("mouseup", h), window.addEventListener("touchend", h), window.addEventListener("pointerup", h), () => {
      p.removeEventListener("mousedown", m, !0), p.removeEventListener("touchstart", m, !0), p.removeEventListener("pointerdown", m, !0), window.removeEventListener("mouseup", h), window.removeEventListener("touchend", h), window.removeEventListener("pointerup", h);
    };
  }, []);
  const u = j.useCallback(
    (p) => {
      i(parseFloat(p.target.value));
    },
    [i]
  );
  return /* @__PURE__ */ d.jsx(
    "input",
    {
      ref: c,
      type: "range",
      min: e,
      max: n,
      step: o,
      value: s,
      onChange: u,
      className: `daw-node__slider nodrag ${l}`
    }
  );
}
function zh({ id: e, data: n }) {
  const o = de((i) => i.updateParameter), s = n.parameters.volume ?? 0;
  return /* @__PURE__ */ d.jsxs("div", { className: "daw-node daw-node--io", children: [
    /* @__PURE__ */ d.jsx(oe, { type: "target", position: Q.Left, id: "in", className: "daw-handle daw-handle--audio daw-handle--stereo" }),
    /* @__PURE__ */ d.jsx("div", { className: "daw-node__header", children: "Master Output" }),
    /* @__PURE__ */ d.jsx("div", { className: "daw-node__body nodrag nowheel", children: /* @__PURE__ */ d.jsxs("label", { className: "daw-node__param", children: [
      /* @__PURE__ */ d.jsx("span", { className: "daw-node__param-label", children: "Vol" }),
      /* @__PURE__ */ d.jsx(
        we,
        {
          min: -70,
          max: 6,
          step: 0.1,
          value: s,
          onChange: (i) => o(e, "volume", i)
        }
      ),
      /* @__PURE__ */ d.jsxs("span", { className: "daw-node__param-value", children: [
        s.toFixed(1),
        " dB"
      ] })
    ] }) })
  ] });
}
const Oh = {
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
}, Iu = ["sine", "square", "sawtooth", "triangle"], Lh = {
  create(e, n) {
    const o = e.createOscillator(), s = e.createGain();
    return s.gain.value = 1, o.frequency.value = n.frequency ?? 440, o.type = Iu[n.waveform ?? 0] ?? "sine", o.connect(s), o.start(), {
      inputs: {},
      outputs: { out: s },
      setParameter(i, l, c) {
        i === "frequency" ? o.frequency.setTargetAtTime(l, c, 0.02) : i === "waveform" && (o.type = Iu[Math.round(l)] ?? "sine");
      },
      dispose() {
        o.stop(), o.disconnect(), s.disconnect();
      }
    };
  }
};
function jn() {
  const e = de((o) => o.nodes), n = de((o) => o.edges);
  return j.useMemo(
    () => Eh(e, n, ct),
    [e, n]
  );
}
function Hh({ id: e, data: n }) {
  const o = de((m) => m.updateParameter), s = de((m) => m.toggleMute), i = de((m) => m.toggleSolo), c = jn().get(e) ?? !1, u = n.parameters.frequency ?? 440, p = n.parameters.waveform ?? 0, g = [
    "daw-node daw-node--generator",
    c ? "daw-node--dimmed" : "",
    n.soloed ? "daw-node--soloed" : ""
  ].join(" ");
  return /* @__PURE__ */ d.jsxs("div", { className: g, children: [
    /* @__PURE__ */ d.jsxs("div", { className: "daw-node__header", children: [
      /* @__PURE__ */ d.jsx("span", { children: "Test Tone" }),
      /* @__PURE__ */ d.jsxs("div", { className: "daw-node__sm-buttons", children: [
        /* @__PURE__ */ d.jsx(
          "button",
          {
            className: `daw-node__sm-btn daw-node__sm-btn--solo ${n.soloed ? "active" : ""}`,
            onClick: (m) => {
              m.stopPropagation(), i(e, !m.shiftKey);
            },
            title: "Solo (Shift+click for additive)",
            children: "S"
          }
        ),
        /* @__PURE__ */ d.jsx(
          "button",
          {
            className: `daw-node__sm-btn daw-node__sm-btn--mute ${n.muted ? "active" : ""}`,
            onClick: (m) => {
              m.stopPropagation(), s(e);
            },
            title: "Mute",
            children: "M"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ d.jsxs("div", { className: "daw-node__body nodrag nowheel", children: [
      /* @__PURE__ */ d.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ d.jsx("span", { className: "daw-node__param-label", children: "Freq" }),
        /* @__PURE__ */ d.jsx(
          we,
          {
            min: 20,
            max: 2e3,
            step: 1,
            value: u,
            onChange: (m) => o(e, "frequency", m)
          }
        ),
        /* @__PURE__ */ d.jsxs("span", { className: "daw-node__param-value", children: [
          Math.round(u),
          " Hz"
        ] })
      ] }),
      /* @__PURE__ */ d.jsxs("div", { className: "daw-node__param", children: [
        /* @__PURE__ */ d.jsx("span", { className: "daw-node__param-label", children: "Wave" }),
        /* @__PURE__ */ d.jsx("div", { className: "daw-node__waveform-btns", children: Iu.map((m, h) => /* @__PURE__ */ d.jsx(
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
    /* @__PURE__ */ d.jsx(oe, { type: "source", position: Q.Right, id: "out", className: "daw-handle daw-handle--audio" })
  ] });
}
const Wh = {
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
}, Xh = {
  create(e, n) {
    const o = e.createGain();
    return o.gain.value = kt(n.gain ?? 0), {
      inputs: {
        in: o,
        "gain-cv": o.gain
      },
      outputs: { out: o },
      setParameter(s, i, l) {
        s === "gain" && o.gain.setTargetAtTime(kt(i), l, 0.02);
      },
      dispose() {
        o.disconnect();
      }
    };
  }
};
function Kh({ id: e, data: n }) {
  const o = de((p) => p.updateParameter), s = de((p) => p.toggleMute), l = jn().get(e) ?? !1, c = n.parameters.gain ?? 0, u = [
    "daw-node daw-node--utility",
    l ? "daw-node--dimmed" : ""
  ].join(" ");
  return /* @__PURE__ */ d.jsxs("div", { className: u, children: [
    /* @__PURE__ */ d.jsx(oe, { type: "target", position: Q.Left, id: "in", className: "daw-handle daw-handle--audio daw-handle--stereo" }),
    /* @__PURE__ */ d.jsx(
      oe,
      {
        type: "target",
        position: Q.Bottom,
        id: "gain-cv",
        className: "daw-handle daw-handle--parameter"
      }
    ),
    /* @__PURE__ */ d.jsxs("div", { className: "daw-node__header", children: [
      /* @__PURE__ */ d.jsx("span", { children: "Gain" }),
      /* @__PURE__ */ d.jsx("div", { className: "daw-node__sm-buttons", children: /* @__PURE__ */ d.jsx(
        "button",
        {
          className: `daw-node__sm-btn daw-node__sm-btn--mute ${n.muted ? "active" : ""}`,
          onClick: (p) => {
            p.stopPropagation(), s(e);
          },
          title: "Mute",
          children: "M"
        }
      ) })
    ] }),
    /* @__PURE__ */ d.jsx("div", { className: "daw-node__body nodrag nowheel", children: /* @__PURE__ */ d.jsxs("label", { className: "daw-node__param", children: [
      /* @__PURE__ */ d.jsx("span", { className: "daw-node__param-label", children: "Gain" }),
      /* @__PURE__ */ d.jsx(
        we,
        {
          min: -70,
          max: 12,
          step: 0.1,
          value: c,
          onChange: (p) => o(e, "gain", p)
        }
      ),
      /* @__PURE__ */ d.jsxs("span", { className: "daw-node__param-value", children: [
        c.toFixed(1),
        " dB"
      ] })
    ] }) }),
    /* @__PURE__ */ d.jsx(oe, { type: "source", position: Q.Right, id: "out", className: "daw-handle daw-handle--audio daw-handle--stereo" })
  ] });
}
const Zh = {
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
}, Yh = {
  create(e, n) {
    const o = e.createGain();
    o.gain.value = kt(n.volume ?? 0), o.channelCount = 2, o.channelCountMode = "explicit";
    let s = [], i = [], l = null, c = null, u = null, p = [], g = !1, m = 0;
    const h = 4096;
    function w() {
      for (const { source: x, fadeGain: I } of i) {
        try {
          x.stop();
        } catch {
        }
        x.disconnect(), I.disconnect();
      }
      i = [];
    }
    function C(x, I) {
      w();
      for (const b of s) {
        if (b.position + b.duration <= I) continue;
        const k = Fa(b.bufferRef);
        if (!k) continue;
        const A = e.createBufferSource();
        A.buffer = k.buffer;
        const S = e.createGain();
        A.connect(S), S.connect(o);
        let V, G, T;
        if (I >= b.position) {
          V = x;
          const D = I - b.position;
          G = b.sourceOffset + D, T = b.duration - D;
        } else
          V = x + (b.position - I), G = b.sourceOffset, T = b.duration;
        const K = k.buffer.duration - G;
        T = Math.min(T, K), !(T <= 0) && (xA(e, S, V, T, b.fadeIn, b.fadeOut), A.start(V, G, T), i.push({ source: A, fadeGain: S }));
      }
    }
    return {
      inputs: {},
      outputs: { out: o },
      setParameter(x, I, b) {
        x === "volume" && o.gain.setTargetAtTime(kt(I), b, 0.02);
      },
      setBuffer(x) {
      },
      setRegions(x) {
        s = x;
      },
      schedulePlayback: C,
      stopPlayback: w,
      setRecordInput(x, I) {
        if (u) {
          try {
            u.disconnect();
          } catch {
          }
          u = null;
        }
        if (c) {
          try {
            c.disconnect();
          } catch {
          }
          c = null;
        }
        l = x, u = e.createScriptProcessor(h, 1, 1), u.onaudioprocess = (b) => {
          if (!g) return;
          const _ = b.inputBuffer.getChannelData(0);
          p.push(new Float32Array(_)), b.outputBuffer.getChannelData(0).fill(0);
        }, x.connect(u), u.connect(e.destination), c = e.createGain(), c.gain.value = I ? 1 : 0, x.connect(c), c.connect(o);
      },
      clearRecordInput() {
        if (u) {
          try {
            u.disconnect();
          } catch {
          }
          if (l)
            try {
              l.disconnect(u);
            } catch {
            }
          u = null;
        }
        if (c) {
          try {
            c.disconnect();
          } catch {
          }
          if (l)
            try {
              l.disconnect(c);
            } catch {
            }
          c = null;
        }
        l = null;
      },
      startRecording(x, I) {
        p = [], m = I, g = !0;
      },
      stopRecording() {
        if (g = !1, p.length === 0) return null;
        const x = p.reduce((k, A) => k + A.length, 0), I = e.createBuffer(1, x, e.sampleRate), b = I.getChannelData(0);
        let _ = 0;
        for (const k of p)
          b.set(k, _), _ += k.length;
        return p = [], { buffer: I, startOffset: m };
      },
      dispose() {
        if (w(), u)
          try {
            u.disconnect();
          } catch {
          }
        if (c)
          try {
            c.disconnect();
          } catch {
          }
        o.disconnect();
      }
    };
  }
};
function xA(e, n, o, s, i, l) {
  if (i > 1e-3 ? (n.gain.setValueAtTime(0, o), n.gain.linearRampToValueAtTime(1, o + i)) : n.gain.setValueAtTime(1, o), l > 1e-3) {
    const c = o + s - l;
    c > o + i && (n.gain.setValueAtTime(1, c), n.gain.linearRampToValueAtTime(0, o + s));
  }
}
function IA(e, n, o) {
  const s = e.getContext("2d");
  if (!s) return;
  const { width: i, height: l } = e, c = window.devicePixelRatio || 1;
  e.width = i * c, e.height = l * c, s.scale(c, c), s.clearRect(0, 0, i, l);
  const u = l / 2, p = i / n.length;
  s.fillStyle = o;
  for (let g = 0; g < n.length; g++) {
    const m = n[g] * u, h = g * p;
    s.fillRect(h, u - m, Math.max(p - 0.5, 0.5), m * 2 || 1);
  }
}
function Uh({ id: e, data: n }) {
  const o = de((F) => F.updateParameter), s = de((F) => F.setNodeData), i = de((F) => F.toggleMute), l = de((F) => F.toggleSolo), u = jn().get(e) ?? !1, p = Ut((F) => F.armedTrackIds.includes(e)), g = Ut((F) => F.isRecording), m = Ut((F) => F.toggleArm), h = n.parameters.volume ?? 0, w = j.useRef(null), C = j.useRef(null), [x, I] = j.useState(!1), [b, _] = j.useState(null), k = j.useRef(!0);
  j.useEffect(() => (k.current = !0, () => {
    k.current = !1;
  }), []), j.useEffect(() => {
    if (!n.bufferRef || !w.current) return;
    const F = Fa(n.bufferRef);
    if (!F) return;
    const z = getComputedStyle(w.current).getPropertyValue("--daw-accent").trim() || "#3b82f6";
    IA(w.current, F.peaks, z);
  }, [n.bufferRef]);
  const A = j.useCallback(async (F) => {
    I(!0), _(null);
    try {
      const z = jh();
      if (!z) throw new Error("Audio engine not ready");
      const W = await F.arrayBuffer(), q = await z.decodeAudioData(W);
      if (!k.current) return;
      const R = ft(), Y = Hi(q, 200);
      Xu(R, {
        buffer: q,
        peaks: Y,
        fileName: F.name,
        duration: q.duration,
        channelCount: q.numberOfChannels,
        sampleRate: q.sampleRate
      }), s(e, {
        bufferRef: R,
        fileName: F.name,
        duration: q.duration
      }), me.getState().removeRegionsForTrack(e), me.getState().addRegion({
        trackId: e,
        bufferRef: R,
        position: 0,
        sourceOffset: 0,
        duration: q.duration,
        fadeIn: 5e-3,
        fadeOut: 5e-3
      });
    } catch (z) {
      if (!k.current) return;
      const W = z instanceof Error ? z.message : "Unknown error";
      _(`Could not decode file: ${W}`);
    } finally {
      k.current && I(!1);
    }
  }, [e, s]), S = j.useCallback((F) => {
    F.preventDefault(), F.stopPropagation();
    const z = F.dataTransfer.files[0];
    z && z.type.startsWith("audio/") && A(z);
  }, [A]), V = j.useCallback((F) => {
    F.preventDefault(), F.stopPropagation();
  }, []), G = j.useCallback(() => {
    var F;
    (F = C.current) == null || F.click();
  }, []), T = j.useCallback((F) => {
    var W;
    const z = (W = F.target.files) == null ? void 0 : W[0];
    z && A(z);
  }, [A]), K = j.useCallback((F) => {
    n.bufferRef && (F.shiftKey ? me.getState().toggleTrackInEditor(e) : me.getState().openEditor(e));
  }, [e, n.bufferRef]), D = [
    "daw-node daw-node--io daw-node--track",
    u ? "daw-node--dimmed" : "",
    n.soloed ? "daw-node--soloed" : "",
    p ? "daw-node--armed" : "",
    p && g ? "daw-node--recording" : ""
  ].join(" ");
  return /* @__PURE__ */ d.jsxs("div", { className: D, children: [
    /* @__PURE__ */ d.jsxs("div", { className: "daw-node__header", children: [
      /* @__PURE__ */ d.jsx("span", { children: "Track" }),
      /* @__PURE__ */ d.jsxs("div", { className: "daw-node__sm-buttons", children: [
        /* @__PURE__ */ d.jsx(
          "button",
          {
            className: `daw-node__sm-btn daw-node__sm-btn--record ${p ? "active" : ""}`,
            onClick: (F) => {
              F.stopPropagation(), m(e);
            },
            title: "Record arm",
            children: "R"
          }
        ),
        /* @__PURE__ */ d.jsx(
          "button",
          {
            className: `daw-node__sm-btn daw-node__sm-btn--solo ${n.soloed ? "active" : ""}`,
            onClick: (F) => {
              F.stopPropagation(), l(e, !F.shiftKey);
            },
            title: "Solo (Shift+click for additive)",
            children: "S"
          }
        ),
        /* @__PURE__ */ d.jsx(
          "button",
          {
            className: `daw-node__sm-btn daw-node__sm-btn--mute ${n.muted ? "active" : ""}`,
            onClick: (F) => {
              F.stopPropagation(), i(e);
            },
            title: "Mute",
            children: "M"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ d.jsxs("div", { className: "daw-node__body nodrag nowheel", children: [
      n.bufferRef ? /* @__PURE__ */ d.jsxs("div", { className: "daw-track__waveform-area", onDoubleClick: K, title: "Double-click to open editor", children: [
        /* @__PURE__ */ d.jsx(
          "canvas",
          {
            ref: w,
            className: "daw-track__canvas",
            width: 180,
            height: 48
          }
        ),
        /* @__PURE__ */ d.jsxs("div", { className: "daw-track__file-info", children: [
          /* @__PURE__ */ d.jsx("span", { className: "daw-track__filename", title: n.fileName, children: n.fileName }),
          /* @__PURE__ */ d.jsx("span", { className: "daw-track__duration", children: n.duration ? Dh(n.duration) : "" })
        ] })
      ] }) : /* @__PURE__ */ d.jsx(
        "div",
        {
          className: "daw-track__dropzone",
          onDrop: S,
          onDragOver: V,
          onClick: G,
          children: x ? /* @__PURE__ */ d.jsx("span", { className: "daw-track__loading", children: "Loading..." }) : b ? /* @__PURE__ */ d.jsx("span", { className: "daw-track__error", children: b }) : /* @__PURE__ */ d.jsxs("span", { className: "daw-track__placeholder", children: [
            "Drop audio file",
            /* @__PURE__ */ d.jsx("br", {}),
            "or click to upload"
          ] })
        }
      ),
      /* @__PURE__ */ d.jsx(
        "input",
        {
          ref: C,
          type: "file",
          accept: "audio/*",
          className: "daw-track__file-input",
          onChange: T
        }
      ),
      /* @__PURE__ */ d.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ d.jsx("span", { className: "daw-node__param-label", children: "Vol" }),
        /* @__PURE__ */ d.jsx(
          we,
          {
            min: -70,
            max: 6,
            step: 0.1,
            value: h,
            onChange: (F) => o(e, "volume", F)
          }
        ),
        /* @__PURE__ */ d.jsxs("span", { className: "daw-node__param-value", children: [
          h.toFixed(1),
          " dB"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ d.jsx(oe, { type: "source", position: Q.Right, id: "out", className: "daw-handle daw-handle--audio daw-handle--stereo" })
  ] });
}
const $h = {
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
}, Qh = {
  create(e, n) {
    const o = n.time ?? 0.3, s = n.feedback ?? 0.3, i = n.mix ?? 0.5, l = e.createGain();
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
      setParameter(C, x, I) {
        switch (C) {
          case "time":
            u.delayTime.setTargetAtTime(x, I, 0.02);
            break;
          case "feedback":
            p.gain.setTargetAtTime(x, I, 0.02);
            break;
          case "mix":
            h = x, w || (c.gain.setTargetAtTime(1 - x, I, 0.02), g.gain.setTargetAtTime(x, I, 0.02));
            break;
        }
      },
      setBypass(C, x) {
        w = C, C ? (c.gain.setTargetAtTime(1, x, 0.02), g.gain.setTargetAtTime(0, x, 0.02)) : (c.gain.setTargetAtTime(1 - h, x, 0.02), g.gain.setTargetAtTime(h, x, 0.02));
      },
      dispose() {
        l.disconnect(), c.disconnect(), u.disconnect(), p.disconnect(), g.disconnect(), m.disconnect();
      }
    };
  }
};
function Jh({ id: e, data: n }) {
  const o = de((p) => p.updateParameter), s = de((p) => p.toggleBypass), i = n.parameters.time ?? 0.3, l = n.parameters.feedback ?? 0.3, c = n.parameters.mix ?? 0.5, u = [
    "daw-node daw-node--effect",
    n.bypassed ? "daw-node--bypassed" : ""
  ].join(" ");
  return /* @__PURE__ */ d.jsxs("div", { className: u, children: [
    /* @__PURE__ */ d.jsx(oe, { type: "target", position: Q.Left, id: "in", className: "daw-handle daw-handle--audio daw-handle--stereo" }),
    /* @__PURE__ */ d.jsx(
      oe,
      {
        type: "target",
        position: Q.Bottom,
        id: "time-cv",
        className: "daw-handle daw-handle--parameter"
      }
    ),
    /* @__PURE__ */ d.jsxs("div", { className: "daw-node__header", children: [
      /* @__PURE__ */ d.jsx("span", { children: "Delay" }),
      /* @__PURE__ */ d.jsx("div", { className: "daw-node__sm-buttons", children: /* @__PURE__ */ d.jsx(
        "button",
        {
          className: `daw-node__sm-btn daw-node__sm-btn--bypass ${n.bypassed ? "active" : ""}`,
          onClick: (p) => {
            p.stopPropagation(), s(e);
          },
          title: "Bypass",
          children: "B"
        }
      ) })
    ] }),
    /* @__PURE__ */ d.jsxs("div", { className: "daw-node__body nodrag nowheel", children: [
      /* @__PURE__ */ d.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ d.jsx("span", { className: "daw-node__param-label", children: "Time" }),
        /* @__PURE__ */ d.jsx(
          we,
          {
            min: 0.01,
            max: 2,
            step: 0.01,
            value: i,
            onChange: (p) => o(e, "time", p)
          }
        ),
        /* @__PURE__ */ d.jsxs("span", { className: "daw-node__param-value", children: [
          i.toFixed(2),
          " s"
        ] })
      ] }),
      /* @__PURE__ */ d.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ d.jsx("span", { className: "daw-node__param-label", children: "Feedback" }),
        /* @__PURE__ */ d.jsx(
          we,
          {
            min: 0,
            max: 0.95,
            step: 0.01,
            value: l,
            onChange: (p) => o(e, "feedback", p)
          }
        ),
        /* @__PURE__ */ d.jsxs("span", { className: "daw-node__param-value", children: [
          (l * 100).toFixed(0),
          "%"
        ] })
      ] }),
      /* @__PURE__ */ d.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ d.jsx("span", { className: "daw-node__param-label", children: "Mix" }),
        /* @__PURE__ */ d.jsx(
          we,
          {
            min: 0,
            max: 1,
            step: 0.01,
            value: c,
            onChange: (p) => o(e, "mix", p)
          }
        ),
        /* @__PURE__ */ d.jsxs("span", { className: "daw-node__param-value", children: [
          (c * 100).toFixed(0),
          "%"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ d.jsx(oe, { type: "source", position: Q.Right, id: "out", className: "daw-handle daw-handle--audio daw-handle--stereo" })
  ] });
}
const qh = {
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
function Gg(e, n) {
  const o = e.sampleRate, s = Math.ceil(o * n), i = e.createBuffer(2, s, o);
  for (let l = 0; l < 2; l++) {
    const c = i.getChannelData(l);
    for (let u = 0; u < s; u++)
      c[u] = (Math.random() * 2 - 1) * Math.exp(-3 * u / s);
  }
  return i;
}
const e0 = {
  create(e, n) {
    const o = n.decay ?? 2, s = n.mix ?? 0.3, i = e.createGain();
    i.gain.value = 1;
    const l = e.createGain();
    l.gain.value = 1 - s;
    const c = e.createConvolver();
    c.buffer = Gg(e, o);
    const u = e.createGain();
    u.gain.value = s;
    const p = e.createGain();
    p.gain.value = 1, i.connect(l), l.connect(p), i.connect(c), c.connect(u), u.connect(p);
    let g = o, m = s, h = !1;
    return {
      inputs: { in: i },
      outputs: { out: p },
      setParameter(w, C, x) {
        switch (w) {
          case "decay":
            g = C, c.buffer = Gg(e, g);
            break;
          case "mix":
            m = C, h || (l.gain.setTargetAtTime(1 - C, x, 0.02), u.gain.setTargetAtTime(C, x, 0.02));
            break;
        }
      },
      setBypass(w, C) {
        h = w, w ? (l.gain.setTargetAtTime(1, C, 0.02), u.gain.setTargetAtTime(0, C, 0.02)) : (l.gain.setTargetAtTime(1 - m, C, 0.02), u.gain.setTargetAtTime(m, C, 0.02));
      },
      dispose() {
        i.disconnect(), l.disconnect(), c.disconnect(), u.disconnect(), p.disconnect();
      }
    };
  }
};
function t0({ id: e, data: n }) {
  const o = de((u) => u.updateParameter), s = de((u) => u.toggleBypass), i = n.parameters.decay ?? 2, l = n.parameters.mix ?? 0.3, c = [
    "daw-node daw-node--effect",
    n.bypassed ? "daw-node--bypassed" : ""
  ].join(" ");
  return /* @__PURE__ */ d.jsxs("div", { className: c, children: [
    /* @__PURE__ */ d.jsx(oe, { type: "target", position: Q.Left, id: "in", className: "daw-handle daw-handle--audio daw-handle--stereo" }),
    /* @__PURE__ */ d.jsxs("div", { className: "daw-node__header", children: [
      /* @__PURE__ */ d.jsx("span", { children: "Reverb" }),
      /* @__PURE__ */ d.jsx("div", { className: "daw-node__sm-buttons", children: /* @__PURE__ */ d.jsx(
        "button",
        {
          className: `daw-node__sm-btn daw-node__sm-btn--bypass ${n.bypassed ? "active" : ""}`,
          onClick: (u) => {
            u.stopPropagation(), s(e);
          },
          title: "Bypass",
          children: "B"
        }
      ) })
    ] }),
    /* @__PURE__ */ d.jsxs("div", { className: "daw-node__body nodrag nowheel", children: [
      /* @__PURE__ */ d.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ d.jsx("span", { className: "daw-node__param-label", children: "Decay" }),
        /* @__PURE__ */ d.jsx(
          we,
          {
            min: 0.1,
            max: 10,
            step: 0.1,
            value: i,
            onChange: (u) => o(e, "decay", u)
          }
        ),
        /* @__PURE__ */ d.jsxs("span", { className: "daw-node__param-value", children: [
          i.toFixed(1),
          " s"
        ] })
      ] }),
      /* @__PURE__ */ d.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ d.jsx("span", { className: "daw-node__param-label", children: "Mix" }),
        /* @__PURE__ */ d.jsx(
          we,
          {
            min: 0,
            max: 1,
            step: 0.01,
            value: l,
            onChange: (u) => o(e, "mix", u)
          }
        ),
        /* @__PURE__ */ d.jsxs("span", { className: "daw-node__param-value", children: [
          (l * 100).toFixed(0),
          "%"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ d.jsx(oe, { type: "source", position: Q.Right, id: "out", className: "daw-handle daw-handle--audio daw-handle--stereo" })
  ] });
}
const n0 = {
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
}, r0 = {
  create(e, n) {
    const o = e.createBiquadFilter();
    o.type = "lowshelf", o.frequency.value = n.lowFreq ?? 80, o.gain.value = n.lowGain ?? 0;
    const s = e.createBiquadFilter();
    s.type = "peaking", s.frequency.value = n.midFreq ?? 1e3, s.gain.value = n.midGain ?? 0, s.Q.value = n.midQ ?? 1;
    const i = e.createBiquadFilter();
    i.type = "highshelf", i.frequency.value = n.highFreq ?? 8e3, i.gain.value = n.highGain ?? 0;
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
function ru(e) {
  return e >= 1e3 ? `${(e / 1e3).toFixed(1)}k` : `${Math.round(e)}`;
}
function CA(e, n, o) {
  const s = e / n, i = Math.pow(10, o / 40);
  if (s < 0.5) return i;
  if (s > 2) return 1;
  const l = (s - 0.5) / 1.5;
  return i + (1 - i) * l;
}
function bA(e, n, o, s) {
  const i = e / n, l = Math.log2(i), c = 1 / s, u = l / c;
  return 1 + (Math.pow(10, o / 20) - 1) * Math.exp(-u * u * 2);
}
function _A(e, n, o) {
  const s = e / n, i = Math.pow(10, o / 40);
  if (s > 2) return i;
  if (s < 0.5) return 1;
  const l = (s - 0.5) / 1.5;
  return 1 + (i - 1) * l;
}
function o0({ id: e, data: n }) {
  const o = de((x) => x.updateParameter), s = de((x) => x.toggleBypass), i = n.parameters.lowFreq ?? 80, l = n.parameters.lowGain ?? 0, c = n.parameters.midFreq ?? 1e3, u = n.parameters.midGain ?? 0, p = n.parameters.midQ ?? 1, g = n.parameters.highFreq ?? 8e3, m = n.parameters.highGain ?? 0, h = j.useRef(null), w = j.useCallback(() => {
    const x = h.current;
    if (!x) return;
    const I = x.getContext("2d");
    if (!I) return;
    const b = x.width, _ = x.height, k = _ / 2;
    I.fillStyle = "#111", I.fillRect(0, 0, b, _), I.strokeStyle = "#333", I.lineWidth = 0.5;
    for (const S of [-12, 0, 12]) {
      const V = k - S / 24 * _;
      I.beginPath(), I.moveTo(0, V), I.lineTo(b, V), I.stroke();
    }
    I.strokeStyle = "#3b82f6", I.lineWidth = 2, I.beginPath();
    for (let S = 0; S < b; S++) {
      const V = 20 * Math.pow(1e3, S / b);
      let G = 1;
      G *= CA(V, i, l), G *= bA(V, c, u, p), G *= _A(V, g, m);
      const T = 20 * Math.log10(G), K = k - T / 24 * _;
      S === 0 ? I.moveTo(S, K) : I.lineTo(S, K);
    }
    I.stroke();
    const A = [
      { freq: i, gain: l, color: "#f59e0b" },
      { freq: c, gain: u, color: "#22c55e" },
      { freq: g, gain: m, color: "#a855f7" }
    ];
    for (const S of A) {
      const V = Math.log10(S.freq / 20) / Math.log10(1e3) * b, G = k - S.gain / 24 * _;
      I.fillStyle = S.color, I.beginPath(), I.arc(V, G, 3, 0, Math.PI * 2), I.fill();
    }
  }, [i, l, c, u, p, g, m]);
  j.useEffect(() => {
    w();
  }, [w]);
  const C = [
    "daw-node daw-node--effect",
    n.bypassed ? "daw-node--bypassed" : ""
  ].join(" ");
  return /* @__PURE__ */ d.jsxs("div", { className: C, style: { minWidth: 220 }, children: [
    /* @__PURE__ */ d.jsx(oe, { type: "target", position: Q.Left, id: "in", className: "daw-handle daw-handle--audio daw-handle--stereo" }),
    /* @__PURE__ */ d.jsxs("div", { className: "daw-node__header", children: [
      /* @__PURE__ */ d.jsx("span", { children: "EQ" }),
      /* @__PURE__ */ d.jsx("div", { className: "daw-node__sm-buttons", children: /* @__PURE__ */ d.jsx(
        "button",
        {
          className: `daw-node__sm-btn daw-node__sm-btn--bypass ${n.bypassed ? "active" : ""}`,
          onClick: (x) => {
            x.stopPropagation(), s(e);
          },
          title: "Bypass",
          children: "B"
        }
      ) })
    ] }),
    /* @__PURE__ */ d.jsxs("div", { className: "daw-node__body nodrag nowheel", children: [
      /* @__PURE__ */ d.jsx(
        "canvas",
        {
          ref: h,
          width: 200,
          height: 60,
          style: { display: "block", borderRadius: 3, marginBottom: 6, width: "100%", height: 60 }
        }
      ),
      /* @__PURE__ */ d.jsxs("div", { className: "daw-node__param-group", children: [
        /* @__PURE__ */ d.jsx("span", { className: "daw-node__param-label", children: "Low" }),
        /* @__PURE__ */ d.jsxs("label", { className: "daw-node__param", children: [
          /* @__PURE__ */ d.jsx(
            we,
            {
              min: 20,
              max: 500,
              step: 1,
              value: i,
              onChange: (x) => o(e, "lowFreq", x)
            }
          ),
          /* @__PURE__ */ d.jsxs("span", { className: "daw-node__param-value", children: [
            ru(i),
            " Hz"
          ] })
        ] }),
        /* @__PURE__ */ d.jsxs("label", { className: "daw-node__param", children: [
          /* @__PURE__ */ d.jsx(
            we,
            {
              min: -24,
              max: 24,
              step: 0.5,
              value: l,
              onChange: (x) => o(e, "lowGain", x)
            }
          ),
          /* @__PURE__ */ d.jsxs("span", { className: "daw-node__param-value", children: [
            l > 0 ? "+" : "",
            l.toFixed(1),
            " dB"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ d.jsxs("div", { className: "daw-node__param-group", children: [
        /* @__PURE__ */ d.jsx("span", { className: "daw-node__param-label", children: "Mid" }),
        /* @__PURE__ */ d.jsxs("label", { className: "daw-node__param", children: [
          /* @__PURE__ */ d.jsx(
            we,
            {
              min: 200,
              max: 5e3,
              step: 1,
              value: c,
              onChange: (x) => o(e, "midFreq", x)
            }
          ),
          /* @__PURE__ */ d.jsxs("span", { className: "daw-node__param-value", children: [
            ru(c),
            " Hz"
          ] })
        ] }),
        /* @__PURE__ */ d.jsxs("label", { className: "daw-node__param", children: [
          /* @__PURE__ */ d.jsx(
            we,
            {
              min: -24,
              max: 24,
              step: 0.5,
              value: u,
              onChange: (x) => o(e, "midGain", x)
            }
          ),
          /* @__PURE__ */ d.jsxs("span", { className: "daw-node__param-value", children: [
            u > 0 ? "+" : "",
            u.toFixed(1),
            " dB"
          ] })
        ] }),
        /* @__PURE__ */ d.jsxs("label", { className: "daw-node__param", children: [
          /* @__PURE__ */ d.jsx(
            we,
            {
              min: 0.1,
              max: 18,
              step: 0.1,
              value: p,
              onChange: (x) => o(e, "midQ", x)
            }
          ),
          /* @__PURE__ */ d.jsxs("span", { className: "daw-node__param-value", children: [
            "Q ",
            p.toFixed(1)
          ] })
        ] })
      ] }),
      /* @__PURE__ */ d.jsxs("div", { className: "daw-node__param-group", children: [
        /* @__PURE__ */ d.jsx("span", { className: "daw-node__param-label", children: "High" }),
        /* @__PURE__ */ d.jsxs("label", { className: "daw-node__param", children: [
          /* @__PURE__ */ d.jsx(
            we,
            {
              min: 2e3,
              max: 2e4,
              step: 1,
              value: g,
              onChange: (x) => o(e, "highFreq", x)
            }
          ),
          /* @__PURE__ */ d.jsxs("span", { className: "daw-node__param-value", children: [
            ru(g),
            " Hz"
          ] })
        ] }),
        /* @__PURE__ */ d.jsxs("label", { className: "daw-node__param", children: [
          /* @__PURE__ */ d.jsx(
            we,
            {
              min: -24,
              max: 24,
              step: 0.5,
              value: m,
              onChange: (x) => o(e, "highGain", x)
            }
          ),
          /* @__PURE__ */ d.jsxs("span", { className: "daw-node__param-value", children: [
            m > 0 ? "+" : "",
            m.toFixed(1),
            " dB"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ d.jsx(oe, { type: "source", position: Q.Right, id: "out", className: "daw-handle daw-handle--audio daw-handle--stereo" })
  ] });
}
const a0 = {
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
}, s0 = {
  create(e) {
    const n = e.createChannelSplitter(2), o = e.createGain();
    o.gain.value = 1;
    const s = e.createGain();
    return s.gain.value = 1, n.connect(o, 0), n.connect(s, 1), {
      inputs: { in: n },
      outputs: { left: o, right: s },
      setParameter() {
      },
      dispose() {
        n.disconnect(), o.disconnect(), s.disconnect();
      }
    };
  }
};
function i0({ id: e, data: n }) {
  const o = de((c) => c.toggleMute), l = [
    "daw-node daw-node--routing",
    jn().get(e) ?? !1 ? "daw-node--dimmed" : ""
  ].join(" ");
  return /* @__PURE__ */ d.jsxs("div", { className: l, children: [
    /* @__PURE__ */ d.jsx(oe, { type: "target", position: Q.Left, id: "in", className: "daw-handle daw-handle--audio daw-handle--stereo" }),
    /* @__PURE__ */ d.jsxs("div", { className: "daw-node__header", children: [
      /* @__PURE__ */ d.jsx("span", { children: "Splitter" }),
      /* @__PURE__ */ d.jsx("div", { className: "daw-node__sm-buttons", children: /* @__PURE__ */ d.jsx(
        "button",
        {
          className: `daw-node__sm-btn daw-node__sm-btn--mute ${n.muted ? "active" : ""}`,
          onClick: (c) => {
            c.stopPropagation(), o(e);
          },
          title: "Mute",
          children: "M"
        }
      ) })
    ] }),
    /* @__PURE__ */ d.jsx("div", { className: "daw-node__body", children: /* @__PURE__ */ d.jsxs("div", { className: "daw-node__port-labels", children: [
      /* @__PURE__ */ d.jsx("span", { className: "daw-node__port-label daw-node__port-label--right", children: "L" }),
      /* @__PURE__ */ d.jsx("span", { className: "daw-node__port-label daw-node__port-label--right", children: "R" })
    ] }) }),
    /* @__PURE__ */ d.jsx(
      oe,
      {
        type: "source",
        position: Q.Right,
        id: "left",
        className: "daw-handle daw-handle--audio daw-handle--pos-1of2"
      }
    ),
    /* @__PURE__ */ d.jsx(
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
const l0 = {
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
}, c0 = {
  create(e) {
    const n = e.createChannelMerger(2), o = e.createGain();
    o.gain.value = 1;
    const s = e.createGain();
    return s.gain.value = 1, o.connect(n, 0, 0), s.connect(n, 0, 1), {
      inputs: { left: o, right: s },
      outputs: { out: n },
      setParameter() {
      },
      dispose() {
        o.disconnect(), s.disconnect(), n.disconnect();
      }
    };
  }
};
function u0({ id: e, data: n }) {
  const o = de((c) => c.toggleMute), l = [
    "daw-node daw-node--routing",
    jn().get(e) ?? !1 ? "daw-node--dimmed" : ""
  ].join(" ");
  return /* @__PURE__ */ d.jsxs("div", { className: l, children: [
    /* @__PURE__ */ d.jsx(
      oe,
      {
        type: "target",
        position: Q.Left,
        id: "left",
        className: "daw-handle daw-handle--audio daw-handle--pos-1of2"
      }
    ),
    /* @__PURE__ */ d.jsx(
      oe,
      {
        type: "target",
        position: Q.Left,
        id: "right",
        className: "daw-handle daw-handle--audio daw-handle--pos-2of2"
      }
    ),
    /* @__PURE__ */ d.jsxs("div", { className: "daw-node__header", children: [
      /* @__PURE__ */ d.jsx("span", { children: "Merger" }),
      /* @__PURE__ */ d.jsx("div", { className: "daw-node__sm-buttons", children: /* @__PURE__ */ d.jsx(
        "button",
        {
          className: `daw-node__sm-btn daw-node__sm-btn--mute ${n.muted ? "active" : ""}`,
          onClick: (c) => {
            c.stopPropagation(), o(e);
          },
          title: "Mute",
          children: "M"
        }
      ) })
    ] }),
    /* @__PURE__ */ d.jsx("div", { className: "daw-node__body", children: /* @__PURE__ */ d.jsxs("div", { className: "daw-node__port-labels", children: [
      /* @__PURE__ */ d.jsx("span", { className: "daw-node__port-label", children: "L" }),
      /* @__PURE__ */ d.jsx("span", { className: "daw-node__port-label", children: "R" })
    ] }) }),
    /* @__PURE__ */ d.jsx(oe, { type: "source", position: Q.Right, id: "out", className: "daw-handle daw-handle--audio daw-handle--stereo" })
  ] });
}
const d0 = {
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
}, f0 = {
  create(e, n) {
    const o = e.createGain();
    o.gain.value = kt(n.gain1 ?? 0);
    const s = e.createGain();
    s.gain.value = kt(n.gain2 ?? 0);
    const i = e.createGain();
    i.gain.value = kt(n.gain3 ?? 0);
    const l = e.createGain();
    l.gain.value = kt(n.gain4 ?? 0);
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
        h && h.gain.setTargetAtTime(kt(g), m, 0.02);
      },
      dispose() {
        o.disconnect(), s.disconnect(), i.disconnect(), l.disconnect(), c.disconnect();
      }
    };
  }
}, Pg = [
  { portId: "in1", paramId: "gain1", label: "In 1" },
  { portId: "in2", paramId: "gain2", label: "In 2" },
  { portId: "in3", paramId: "gain3", label: "In 3" },
  { portId: "in4", paramId: "gain4", label: "In 4" }
];
function p0({ id: e, data: n }) {
  const o = de((u) => u.updateParameter), s = de((u) => u.toggleMute), c = [
    "daw-node daw-node--routing",
    jn().get(e) ?? !1 ? "daw-node--dimmed" : ""
  ].join(" ");
  return /* @__PURE__ */ d.jsxs("div", { className: c, style: { minWidth: 200 }, children: [
    Pg.map((u, p) => /* @__PURE__ */ d.jsx(
      oe,
      {
        type: "target",
        position: Q.Left,
        id: u.portId,
        className: `daw-handle daw-handle--audio daw-handle--stereo daw-handle--pos-${p + 1}of4`
      },
      u.portId
    )),
    /* @__PURE__ */ d.jsxs("div", { className: "daw-node__header", children: [
      /* @__PURE__ */ d.jsx("span", { children: "Mixer" }),
      /* @__PURE__ */ d.jsx("div", { className: "daw-node__sm-buttons", children: /* @__PURE__ */ d.jsx(
        "button",
        {
          className: `daw-node__sm-btn daw-node__sm-btn--mute ${n.muted ? "active" : ""}`,
          onClick: (u) => {
            u.stopPropagation(), s(e);
          },
          title: "Mute",
          children: "M"
        }
      ) })
    ] }),
    /* @__PURE__ */ d.jsx("div", { className: "daw-node__body nodrag nowheel", children: Pg.map((u) => {
      const p = n.parameters[u.paramId] ?? 0;
      return /* @__PURE__ */ d.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ d.jsx("span", { className: "daw-node__param-label", children: u.label }),
        /* @__PURE__ */ d.jsx(
          we,
          {
            min: -70,
            max: 12,
            step: 0.1,
            value: p,
            onChange: (g) => o(e, u.paramId, g)
          }
        ),
        /* @__PURE__ */ d.jsxs("span", { className: "daw-node__param-value", children: [
          p.toFixed(1),
          " dB"
        ] })
      ] }, u.paramId);
    }) }),
    /* @__PURE__ */ d.jsx(oe, { type: "source", position: Q.Right, id: "out", className: "daw-handle daw-handle--audio daw-handle--stereo" })
  ] });
}
const g0 = {
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
}, m0 = {
  create(e) {
    const n = e.createGain();
    n.gain.value = 1;
    const o = e.createAnalyser();
    return o.fftSize = 256, o.smoothingTimeConstant = 0.8, n.connect(o), {
      inputs: { in: n },
      outputs: { out: n },
      setParameter() {
      },
      dispose() {
        n.disconnect(), o.disconnect();
      },
      getAnalyserNode() {
        return o;
      }
    };
  }
};
function h0({ id: e, data: n }) {
  const o = de((h) => h.toggleMute), i = jn().get(e) ?? !1, l = j.useRef(null), c = j.useRef(0), u = j.useRef(0), p = 0.97, g = j.useCallback(() => {
    var q;
    const h = l.current;
    if (!h) return;
    const w = Qt(), C = w == null ? void 0 : w.getProcessor(e), x = (q = C == null ? void 0 : C.getAnalyserNode) == null ? void 0 : q.call(C), I = h.getContext("2d");
    if (!I) return;
    const b = h.width, _ = h.height;
    if (I.clearRect(0, 0, b, _), !x) {
      c.current = requestAnimationFrame(g);
      return;
    }
    const k = x.fftSize, A = new Float32Array(k);
    x.getFloatTimeDomainData(A);
    let S = 0;
    for (let R = 0; R < k; R++) {
      const Y = Math.abs(A[R]);
      Y > S && (S = Y);
    }
    const V = S > 0 ? 20 * Math.log10(S) : -70;
    S > u.current ? u.current = S : u.current *= p;
    const G = u.current > 0 ? 20 * Math.log10(u.current) : -70, T = (R) => Math.max(0, (R + 70) / 70 * _), K = T(V), D = _ - T(G), z = getComputedStyle(h).getPropertyValue("--daw-surface-inset").trim() || "#0a0a0a";
    I.fillStyle = z, I.fillRect(0, 0, b, _);
    const W = _ - K;
    if (K > 0) {
      const R = I.createLinearGradient(0, _, 0, 0);
      R.addColorStop(0, "#22c55e"), R.addColorStop(0.7, "#f59e0b"), R.addColorStop(1, "#ef4444"), I.fillStyle = R, I.fillRect(2, W, b - 4, K);
    }
    G > -70 && (I.strokeStyle = "#ef4444", I.lineWidth = 1, I.beginPath(), I.moveTo(2, D), I.lineTo(b - 2, D), I.stroke()), c.current = requestAnimationFrame(g);
  }, [e]);
  j.useEffect(() => (c.current = requestAnimationFrame(g), () => cancelAnimationFrame(c.current)), [g]);
  const m = [
    "daw-node daw-node--utility",
    i ? "daw-node--dimmed" : ""
  ].join(" ");
  return /* @__PURE__ */ d.jsxs("div", { className: m, children: [
    /* @__PURE__ */ d.jsx(oe, { type: "target", position: Q.Left, id: "in", className: "daw-handle daw-handle--audio daw-handle--stereo" }),
    /* @__PURE__ */ d.jsxs("div", { className: "daw-node__header", children: [
      /* @__PURE__ */ d.jsx("span", { children: "Level Meter" }),
      /* @__PURE__ */ d.jsx("div", { className: "daw-node__sm-buttons", children: /* @__PURE__ */ d.jsx(
        "button",
        {
          className: `daw-node__sm-btn daw-node__sm-btn--mute ${n.muted ? "active" : ""}`,
          onClick: (h) => {
            h.stopPropagation(), o(e);
          },
          title: "Mute",
          children: "M"
        }
      ) })
    ] }),
    /* @__PURE__ */ d.jsx("div", { className: "daw-node__body", children: /* @__PURE__ */ d.jsx(
      "canvas",
      {
        ref: l,
        width: 40,
        height: 80,
        style: { width: 40, height: 80, borderRadius: 4, background: "var(--daw-surface-inset)" }
      }
    ) }),
    /* @__PURE__ */ d.jsx(oe, { type: "source", position: Q.Right, id: "out", className: "daw-handle daw-handle--audio daw-handle--stereo" })
  ] });
}
const y0 = {
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
}, w0 = {
  create(e) {
    const n = e.createGain();
    n.gain.value = 1;
    const o = e.createAnalyser();
    return o.fftSize = 2048, o.smoothingTimeConstant = 0.8, n.connect(o), {
      inputs: { in: n },
      outputs: { out: n },
      setParameter() {
      },
      dispose() {
        n.disconnect(), o.disconnect();
      },
      getAnalyserNode() {
        return o;
      }
    };
  }
};
function v0({ id: e, data: n }) {
  const o = de((g) => g.toggleMute), i = jn().get(e) ?? !1, l = j.useRef(null), c = j.useRef(0), u = j.useCallback(() => {
    var W;
    const g = l.current;
    if (!g) return;
    const m = Qt(), h = m == null ? void 0 : m.getProcessor(e), w = (W = h == null ? void 0 : h.getAnalyserNode) == null ? void 0 : W.call(h), C = g.getContext("2d");
    if (!C) return;
    const x = g.width, I = g.height;
    C.clearRect(0, 0, x, I);
    const b = getComputedStyle(g), _ = b.getPropertyValue("--daw-surface-inset").trim() || "#0a0a0a";
    if (C.fillStyle = _, C.fillRect(0, 0, x, I), !w) {
      c.current = requestAnimationFrame(u);
      return;
    }
    const k = w.frequencyBinCount, A = new Uint8Array(k);
    w.getByteFrequencyData(A);
    const S = w.context.sampleRate, V = b.getPropertyValue("--daw-accent").trim() || "#3b82f6";
    C.fillStyle = V, C.globalAlpha = 0.7;
    const G = 20, T = 2e4, K = Math.log10(G), D = Math.log10(T), F = 64, z = x / F;
    for (let q = 0; q < F; q++) {
      const R = K + q / F * (D - K), Y = K + (q + 1) / F * (D - K), H = Math.pow(10, R), U = Math.pow(10, Y), E = Math.floor(H / S * k * 2), P = Math.min(Math.ceil(U / S * k * 2), k - 1);
      let Z = 0, M = 0;
      for (let re = E; re <= P; re++)
        Z += A[re], M++;
      const te = (M > 0 ? Z / M : 0) / 255 * I;
      C.fillRect(q * z, I - te, z - 0.5, te);
    }
    C.globalAlpha = 1, c.current = requestAnimationFrame(u);
  }, [e]);
  j.useEffect(() => (c.current = requestAnimationFrame(u), () => cancelAnimationFrame(c.current)), [u]);
  const p = [
    "daw-node daw-node--utility",
    i ? "daw-node--dimmed" : ""
  ].join(" ");
  return /* @__PURE__ */ d.jsxs("div", { className: p, style: { minWidth: 220 }, children: [
    /* @__PURE__ */ d.jsx(oe, { type: "target", position: Q.Left, id: "in", className: "daw-handle daw-handle--audio daw-handle--stereo" }),
    /* @__PURE__ */ d.jsxs("div", { className: "daw-node__header", children: [
      /* @__PURE__ */ d.jsx("span", { children: "Analyzer" }),
      /* @__PURE__ */ d.jsx("div", { className: "daw-node__sm-buttons", children: /* @__PURE__ */ d.jsx(
        "button",
        {
          className: `daw-node__sm-btn daw-node__sm-btn--mute ${n.muted ? "active" : ""}`,
          onClick: (g) => {
            g.stopPropagation(), o(e);
          },
          title: "Mute",
          children: "M"
        }
      ) })
    ] }),
    /* @__PURE__ */ d.jsx("div", { className: "daw-node__body", children: /* @__PURE__ */ d.jsx(
      "canvas",
      {
        ref: l,
        width: 200,
        height: 80,
        style: { width: 200, height: 80, borderRadius: 4, background: "var(--daw-surface-inset)" }
      }
    ) }),
    /* @__PURE__ */ d.jsx(oe, { type: "source", position: Q.Right, id: "out", className: "daw-handle daw-handle--audio daw-handle--stereo" })
  ] });
}
const Ku = {
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
function NA(e, n, o) {
  const s = n.internalGraph, i = /* @__PURE__ */ new Map();
  for (const p of s.nodes) {
    const g = Ah(p.moduleType), m = ct(p.moduleType), h = {};
    for (const C of m.parameters)
      h[C.id] = C.defaultValue;
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
const x0 = {
  create(e, n) {
    const o = Ku.composition;
    if (!(o != null && o.internalGraph))
      throw new Error("Compressor manifest missing composition");
    const s = NA(e, o, n), i = e.createGain();
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
      setParameter(h, w, C) {
        s.setParameter(h, w, C);
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
function AA(e) {
  const n = e.internalGraph;
  if (!n) return { nodes: [], edges: [] };
  const o = [], s = [], i = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map();
  for (let u = 0; u < n.exposedInputs.length; u++) {
    const p = n.exposedInputs[u], g = ft();
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
  for (let u = 0; u < n.exposedOutputs.length; u++) {
    const p = n.exposedOutputs[u], g = ft();
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
  for (const u of n.nodes) {
    const p = ft();
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
  for (const u of n.edges) {
    const p = i.get(u.fromNode), g = i.get(u.toNode);
    if (!p || !g) continue;
    const m = n.nodes.find((C) => C.internalId === u.fromNode);
    let h = "audio", w = "mono";
    if (m)
      try {
        const x = ct(m.moduleType).ports.find((I) => I.id === u.fromPort);
        x && (h = x.signalType, w = x.channelFormat);
      } catch {
      }
    s.push({
      id: ft(),
      source: p,
      sourceHandle: u.fromPort,
      target: g,
      targetHandle: u.toPort,
      type: h,
      data: { signalType: h, channelFormat: w }
    });
  }
  for (const u of n.exposedInputs) {
    const p = l.get(u.externalPortId), g = i.get(u.internalNodeId);
    !p || !g || s.push({
      id: ft(),
      source: p,
      sourceHandle: "out",
      target: g,
      targetHandle: u.internalPortId,
      type: "audio",
      data: { signalType: "audio", channelFormat: "stereo" }
    });
  }
  for (const u of n.exposedOutputs) {
    const p = i.get(u.internalNodeId), g = c.get(u.externalPortId);
    !p || !g || s.push({
      id: ft(),
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
function I0({ id: e, data: n }) {
  const o = de((I) => I.updateParameter), s = de((I) => I.toggleBypass), i = j.useCallback(() => {
    const b = ct("compressor").composition;
    if (!(b != null && b.internalGraph)) return;
    const _ = an.getState();
    if (!_.internalGraphs[e]) {
      const { nodes: k, edges: A } = AA(b);
      _.initInternalGraph(e, k, A);
    }
    _.pushScope(e, n.label || "Compressor", "compressor");
  }, [e, n.label]), l = n.parameters.threshold ?? -18, c = n.parameters.ratio ?? 4, u = n.parameters.attack ?? 3e-3, p = n.parameters.release ?? 0.25, g = n.parameters.makeup ?? 0, m = j.useRef(null), h = j.useRef(null), w = j.useRef(0), C = j.useCallback(() => {
    var S;
    const I = Qt(), b = I == null ? void 0 : I.getProcessor(e), _ = ((S = b == null ? void 0 : b.getReductionDb) == null ? void 0 : S.call(b)) ?? 0, k = Math.abs(_), A = Math.min(100, k / 20 * 100);
    m.current && (m.current.style.width = `${A}%`), h.current && (h.current.textContent = k > 0.1 ? `${_.toFixed(1)} dB` : "0.0 dB"), w.current = requestAnimationFrame(C);
  }, [e]);
  j.useEffect(() => (w.current = requestAnimationFrame(C), () => cancelAnimationFrame(w.current)), [C]);
  const x = [
    "daw-node daw-node--effect",
    n.bypassed ? "daw-node--bypassed" : ""
  ].join(" ");
  return /* @__PURE__ */ d.jsxs("div", { className: x, style: { minWidth: 200 }, children: [
    /* @__PURE__ */ d.jsx(
      oe,
      {
        type: "target",
        position: Q.Left,
        id: "in",
        className: "daw-handle daw-handle--audio daw-handle--stereo daw-handle--pos-1of2"
      }
    ),
    /* @__PURE__ */ d.jsx(
      oe,
      {
        type: "target",
        position: Q.Left,
        id: "sidechain",
        className: "daw-handle daw-handle--audio daw-handle--sidechain daw-handle--pos-2of2"
      }
    ),
    /* @__PURE__ */ d.jsxs("div", { className: "daw-node__header", children: [
      /* @__PURE__ */ d.jsx("span", { children: "Compressor" }),
      /* @__PURE__ */ d.jsxs("div", { className: "daw-node__sm-buttons", children: [
        /* @__PURE__ */ d.jsx(
          "button",
          {
            className: "daw-node__sm-btn daw-node__sm-btn--expand",
            onClick: (I) => {
              I.stopPropagation(), i();
            },
            title: "Open Internals",
            children: "▶"
          }
        ),
        /* @__PURE__ */ d.jsx(
          "button",
          {
            className: `daw-node__sm-btn daw-node__sm-btn--bypass ${n.bypassed ? "active" : ""}`,
            onClick: (I) => {
              I.stopPropagation(), s(e);
            },
            title: "Bypass",
            children: "B"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ d.jsxs("div", { className: "daw-node__body nodrag nowheel", children: [
      /* @__PURE__ */ d.jsxs("div", { className: "daw-compressor__gr-meter", children: [
        /* @__PURE__ */ d.jsx("div", { className: "daw-compressor__gr-bar", ref: m }),
        /* @__PURE__ */ d.jsx("span", { className: "daw-compressor__gr-label", ref: h, children: "0.0 dB" })
      ] }),
      /* @__PURE__ */ d.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ d.jsx("span", { className: "daw-node__param-label", children: "Threshold" }),
        /* @__PURE__ */ d.jsx(
          we,
          {
            min: -60,
            max: 0,
            step: 0.5,
            value: l,
            onChange: (I) => o(e, "threshold", I)
          }
        ),
        /* @__PURE__ */ d.jsxs("span", { className: "daw-node__param-value", children: [
          l.toFixed(1),
          " dB"
        ] })
      ] }),
      /* @__PURE__ */ d.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ d.jsx("span", { className: "daw-node__param-label", children: "Ratio" }),
        /* @__PURE__ */ d.jsx(
          we,
          {
            min: 1,
            max: 20,
            step: 0.5,
            value: c,
            onChange: (I) => o(e, "ratio", I)
          }
        ),
        /* @__PURE__ */ d.jsxs("span", { className: "daw-node__param-value", children: [
          c.toFixed(1),
          ":1"
        ] })
      ] }),
      /* @__PURE__ */ d.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ d.jsx("span", { className: "daw-node__param-label", children: "Attack" }),
        /* @__PURE__ */ d.jsx(
          we,
          {
            min: 1e-3,
            max: 0.1,
            step: 1e-3,
            value: u,
            onChange: (I) => o(e, "attack", I)
          }
        ),
        /* @__PURE__ */ d.jsxs("span", { className: "daw-node__param-value", children: [
          (u * 1e3).toFixed(1),
          " ms"
        ] })
      ] }),
      /* @__PURE__ */ d.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ d.jsx("span", { className: "daw-node__param-label", children: "Release" }),
        /* @__PURE__ */ d.jsx(
          we,
          {
            min: 0.01,
            max: 1,
            step: 0.01,
            value: p,
            onChange: (I) => o(e, "release", I)
          }
        ),
        /* @__PURE__ */ d.jsxs("span", { className: "daw-node__param-value", children: [
          (p * 1e3).toFixed(0),
          " ms"
        ] })
      ] }),
      /* @__PURE__ */ d.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ d.jsx("span", { className: "daw-node__param-label", children: "Makeup" }),
        /* @__PURE__ */ d.jsx(
          we,
          {
            min: -6,
            max: 24,
            step: 0.5,
            value: g,
            onChange: (I) => o(e, "makeup", I)
          }
        ),
        /* @__PURE__ */ d.jsxs("span", { className: "daw-node__param-value", children: [
          g > 0 ? "+" : "",
          g.toFixed(1),
          " dB"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ d.jsx(oe, { type: "source", position: Q.Right, id: "out", className: "daw-handle daw-handle--audio daw-handle--stereo" })
  ] });
}
const C0 = {
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
}, b0 = {
  create(e, n) {
    const o = n.threshold ?? -1, s = n.release ?? 0.1, i = n.lookahead ?? 1e-3, l = e.createGain();
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
      setParameter(h, w, C) {
        switch (h) {
          case "threshold":
            u.threshold.setTargetAtTime(w, C, 0.02);
            break;
          case "release":
            u.release.setTargetAtTime(w, C, 0.02);
            break;
          case "lookahead":
            c.delayTime.setTargetAtTime(w, C, 0.02);
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
function _0({ id: e, data: n }) {
  const o = de((w) => w.updateParameter), s = de((w) => w.toggleBypass), i = n.parameters.threshold ?? -1, l = n.parameters.release ?? 0.1, c = n.parameters.lookahead ?? 1e-3, u = j.useRef(null), p = j.useRef(null), g = j.useRef(0), m = j.useCallback(() => {
    var _;
    const w = Qt(), C = w == null ? void 0 : w.getProcessor(e), x = ((_ = C == null ? void 0 : C.getReductionDb) == null ? void 0 : _.call(C)) ?? 0, I = Math.abs(x), b = Math.min(100, I / 20 * 100);
    u.current && (u.current.style.width = `${b}%`), p.current && (p.current.textContent = I > 0.1 ? `${x.toFixed(1)} dB` : "0.0 dB"), g.current = requestAnimationFrame(m);
  }, [e]);
  j.useEffect(() => (g.current = requestAnimationFrame(m), () => cancelAnimationFrame(g.current)), [m]);
  const h = [
    "daw-node daw-node--effect",
    n.bypassed ? "daw-node--bypassed" : ""
  ].join(" ");
  return /* @__PURE__ */ d.jsxs("div", { className: h, style: { minWidth: 200 }, children: [
    /* @__PURE__ */ d.jsx(
      oe,
      {
        type: "target",
        position: Q.Left,
        id: "in",
        className: "daw-handle daw-handle--audio daw-handle--stereo"
      }
    ),
    /* @__PURE__ */ d.jsxs("div", { className: "daw-node__header", children: [
      /* @__PURE__ */ d.jsx("span", { children: "Limiter" }),
      /* @__PURE__ */ d.jsx("div", { className: "daw-node__sm-buttons", children: /* @__PURE__ */ d.jsx(
        "button",
        {
          className: `daw-node__sm-btn daw-node__sm-btn--bypass ${n.bypassed ? "active" : ""}`,
          onClick: (w) => {
            w.stopPropagation(), s(e);
          },
          title: "Bypass",
          children: "B"
        }
      ) })
    ] }),
    /* @__PURE__ */ d.jsxs("div", { className: "daw-node__body nodrag nowheel", children: [
      /* @__PURE__ */ d.jsxs("div", { className: "daw-compressor__gr-meter", children: [
        /* @__PURE__ */ d.jsx("div", { className: "daw-compressor__gr-bar", ref: u }),
        /* @__PURE__ */ d.jsx("span", { className: "daw-compressor__gr-label", ref: p, children: "0.0 dB" })
      ] }),
      /* @__PURE__ */ d.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ d.jsx("span", { className: "daw-node__param-label", children: "Threshold" }),
        /* @__PURE__ */ d.jsx(
          we,
          {
            min: -30,
            max: 0,
            step: 0.5,
            value: i,
            onChange: (w) => o(e, "threshold", w)
          }
        ),
        /* @__PURE__ */ d.jsxs("span", { className: "daw-node__param-value", children: [
          i.toFixed(1),
          " dB"
        ] })
      ] }),
      /* @__PURE__ */ d.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ d.jsx("span", { className: "daw-node__param-label", children: "Release" }),
        /* @__PURE__ */ d.jsx(
          we,
          {
            min: 0.01,
            max: 0.5,
            step: 0.01,
            value: l,
            onChange: (w) => o(e, "release", w)
          }
        ),
        /* @__PURE__ */ d.jsxs("span", { className: "daw-node__param-value", children: [
          (l * 1e3).toFixed(0),
          " ms"
        ] })
      ] }),
      /* @__PURE__ */ d.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ d.jsx("span", { className: "daw-node__param-label", children: "Lookahead" }),
        /* @__PURE__ */ d.jsx(
          we,
          {
            min: 0,
            max: 5e-3,
            step: 1e-4,
            value: c,
            onChange: (w) => o(e, "lookahead", w)
          }
        ),
        /* @__PURE__ */ d.jsxs("span", { className: "daw-node__param-value", children: [
          (c * 1e3).toFixed(1),
          " ms"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ d.jsx(oe, { type: "source", position: Q.Right, id: "out", className: "daw-handle daw-handle--audio daw-handle--stereo" })
  ] });
}
const N0 = {
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
}, A0 = {
  create(e, n) {
    const o = n.threshold ?? -40, s = n.attack ?? 1e-3, i = n.hold ?? 0.05, l = n.release ?? 0.1, c = n.range ?? -80, u = e.createGain();
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
    let C = !1;
    return p.port.onmessage = (x) => {
      x.data.gateOpen !== void 0 && (C = x.data.gateOpen);
    }, {
      inputs: {
        in: u,
        sidechain: w
      },
      outputs: { out: g },
      setParameter(x, I, b) {
        const _ = p.parameters.get(x);
        _ && _.setTargetAtTime(I, b, 0.02);
      },
      setBypass(x, I) {
        x ? (m.gain.setTargetAtTime(0, I, 0.02), h.gain.setTargetAtTime(1, I, 0.02)) : (m.gain.setTargetAtTime(1, I, 0.02), h.gain.setTargetAtTime(0, I, 0.02));
      },
      getReductionDb() {
        return C ? 0 : n.range ?? -80;
      },
      dispose() {
        u.disconnect(), p.disconnect(), w.disconnect(), m.disconnect(), h.disconnect(), g.disconnect();
      }
    };
  }
};
function S0({ id: e, data: n }) {
  const o = de((x) => x.updateParameter), s = de((x) => x.toggleBypass), i = n.parameters.threshold ?? -40, l = n.parameters.attack ?? 1e-3, c = n.parameters.hold ?? 0.05, u = n.parameters.release ?? 0.1, p = n.parameters.range ?? -80, [g, m] = j.useState(!1), h = j.useRef(0), w = j.useCallback(() => {
    var _;
    const x = Qt(), I = x == null ? void 0 : x.getProcessor(e), b = ((_ = I == null ? void 0 : I.getReductionDb) == null ? void 0 : _.call(I)) ?? -80;
    m(b > -1), h.current = requestAnimationFrame(w);
  }, [e]);
  j.useEffect(() => (h.current = requestAnimationFrame(w), () => cancelAnimationFrame(h.current)), [w]);
  const C = [
    "daw-node daw-node--effect",
    n.bypassed ? "daw-node--bypassed" : ""
  ].join(" ");
  return /* @__PURE__ */ d.jsxs("div", { className: C, style: { minWidth: 200 }, children: [
    /* @__PURE__ */ d.jsx(
      oe,
      {
        type: "target",
        position: Q.Left,
        id: "in",
        className: "daw-handle daw-handle--audio daw-handle--stereo daw-handle--pos-1of2"
      }
    ),
    /* @__PURE__ */ d.jsx(
      oe,
      {
        type: "target",
        position: Q.Left,
        id: "sidechain",
        className: "daw-handle daw-handle--audio daw-handle--sidechain daw-handle--pos-2of2"
      }
    ),
    /* @__PURE__ */ d.jsxs("div", { className: "daw-node__header", children: [
      /* @__PURE__ */ d.jsx("span", { children: "Gate" }),
      /* @__PURE__ */ d.jsxs("div", { className: "daw-node__sm-buttons", children: [
        /* @__PURE__ */ d.jsx(
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
        /* @__PURE__ */ d.jsx(
          "button",
          {
            className: `daw-node__sm-btn daw-node__sm-btn--bypass ${n.bypassed ? "active" : ""}`,
            onClick: (x) => {
              x.stopPropagation(), s(e);
            },
            title: "Bypass",
            children: "B"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ d.jsxs("div", { className: "daw-node__body nodrag nowheel", children: [
      /* @__PURE__ */ d.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ d.jsx("span", { className: "daw-node__param-label", children: "Threshold" }),
        /* @__PURE__ */ d.jsx(
          we,
          {
            min: -80,
            max: -10,
            step: 0.5,
            value: i,
            onChange: (x) => o(e, "threshold", x)
          }
        ),
        /* @__PURE__ */ d.jsxs("span", { className: "daw-node__param-value", children: [
          i.toFixed(1),
          " dB"
        ] })
      ] }),
      /* @__PURE__ */ d.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ d.jsx("span", { className: "daw-node__param-label", children: "Attack" }),
        /* @__PURE__ */ d.jsx(
          we,
          {
            min: 1e-4,
            max: 0.05,
            step: 1e-4,
            value: l,
            onChange: (x) => o(e, "attack", x)
          }
        ),
        /* @__PURE__ */ d.jsxs("span", { className: "daw-node__param-value", children: [
          (l * 1e3).toFixed(1),
          " ms"
        ] })
      ] }),
      /* @__PURE__ */ d.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ d.jsx("span", { className: "daw-node__param-label", children: "Hold" }),
        /* @__PURE__ */ d.jsx(
          we,
          {
            min: 0,
            max: 0.5,
            step: 1e-3,
            value: c,
            onChange: (x) => o(e, "hold", x)
          }
        ),
        /* @__PURE__ */ d.jsxs("span", { className: "daw-node__param-value", children: [
          (c * 1e3).toFixed(0),
          " ms"
        ] })
      ] }),
      /* @__PURE__ */ d.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ d.jsx("span", { className: "daw-node__param-label", children: "Release" }),
        /* @__PURE__ */ d.jsx(
          we,
          {
            min: 0.01,
            max: 0.5,
            step: 0.01,
            value: u,
            onChange: (x) => o(e, "release", x)
          }
        ),
        /* @__PURE__ */ d.jsxs("span", { className: "daw-node__param-value", children: [
          (u * 1e3).toFixed(0),
          " ms"
        ] })
      ] }),
      /* @__PURE__ */ d.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ d.jsx("span", { className: "daw-node__param-label", children: "Range" }),
        /* @__PURE__ */ d.jsx(
          we,
          {
            min: -80,
            max: 0,
            step: 0.5,
            value: p,
            onChange: (x) => o(e, "range", x)
          }
        ),
        /* @__PURE__ */ d.jsxs("span", { className: "daw-node__param-value", children: [
          p.toFixed(1),
          " dB"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ d.jsx(oe, { type: "source", position: Q.Right, id: "out", className: "daw-handle daw-handle--audio daw-handle--stereo" })
  ] });
}
const k0 = {
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
}, j0 = {
  create(e, n) {
    const o = n.threshold ?? -30, s = n.ratio ?? 2, i = n.attack ?? 1e-3, l = n.release ?? 0.1, c = e.createGain();
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
    return u.port.onmessage = (C) => {
      C.data.reductionDb !== void 0 && (w = C.data.reductionDb);
    }, {
      inputs: {
        in: c,
        sidechain: h
      },
      outputs: { out: p },
      setParameter(C, x, I) {
        const b = u.parameters.get(C);
        b && b.setTargetAtTime(x, I, 0.02);
      },
      setBypass(C, x) {
        C ? (g.gain.setTargetAtTime(0, x, 0.02), m.gain.setTargetAtTime(1, x, 0.02)) : (g.gain.setTargetAtTime(1, x, 0.02), m.gain.setTargetAtTime(0, x, 0.02));
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
function M0({ id: e, data: n }) {
  const o = de((C) => C.updateParameter), s = de((C) => C.toggleBypass), i = n.parameters.threshold ?? -30, l = n.parameters.ratio ?? 2, c = n.parameters.attack ?? 1e-3, u = n.parameters.release ?? 0.1, p = j.useRef(null), g = j.useRef(null), m = j.useRef(0), h = j.useCallback(() => {
    var k;
    const C = Qt(), x = C == null ? void 0 : C.getProcessor(e), I = ((k = x == null ? void 0 : x.getReductionDb) == null ? void 0 : k.call(x)) ?? 0, b = Math.abs(I), _ = Math.min(100, b / 40 * 100);
    p.current && (p.current.style.width = `${_}%`), g.current && (g.current.textContent = b > 0.1 ? `${I.toFixed(1)} dB` : "0.0 dB"), m.current = requestAnimationFrame(h);
  }, [e]);
  j.useEffect(() => (m.current = requestAnimationFrame(h), () => cancelAnimationFrame(m.current)), [h]);
  const w = [
    "daw-node daw-node--effect",
    n.bypassed ? "daw-node--bypassed" : ""
  ].join(" ");
  return /* @__PURE__ */ d.jsxs("div", { className: w, style: { minWidth: 200 }, children: [
    /* @__PURE__ */ d.jsx(
      oe,
      {
        type: "target",
        position: Q.Left,
        id: "in",
        className: "daw-handle daw-handle--audio daw-handle--stereo daw-handle--pos-1of2"
      }
    ),
    /* @__PURE__ */ d.jsx(
      oe,
      {
        type: "target",
        position: Q.Left,
        id: "sidechain",
        className: "daw-handle daw-handle--audio daw-handle--sidechain daw-handle--pos-2of2"
      }
    ),
    /* @__PURE__ */ d.jsxs("div", { className: "daw-node__header", children: [
      /* @__PURE__ */ d.jsx("span", { children: "Expander" }),
      /* @__PURE__ */ d.jsx("div", { className: "daw-node__sm-buttons", children: /* @__PURE__ */ d.jsx(
        "button",
        {
          className: `daw-node__sm-btn daw-node__sm-btn--bypass ${n.bypassed ? "active" : ""}`,
          onClick: (C) => {
            C.stopPropagation(), s(e);
          },
          title: "Bypass",
          children: "B"
        }
      ) })
    ] }),
    /* @__PURE__ */ d.jsxs("div", { className: "daw-node__body nodrag nowheel", children: [
      /* @__PURE__ */ d.jsxs("div", { className: "daw-compressor__gr-meter", children: [
        /* @__PURE__ */ d.jsx("div", { className: "daw-compressor__gr-bar", ref: p }),
        /* @__PURE__ */ d.jsx("span", { className: "daw-compressor__gr-label", ref: g, children: "0.0 dB" })
      ] }),
      /* @__PURE__ */ d.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ d.jsx("span", { className: "daw-node__param-label", children: "Threshold" }),
        /* @__PURE__ */ d.jsx(
          we,
          {
            min: -60,
            max: 0,
            step: 0.5,
            value: i,
            onChange: (C) => o(e, "threshold", C)
          }
        ),
        /* @__PURE__ */ d.jsxs("span", { className: "daw-node__param-value", children: [
          i.toFixed(1),
          " dB"
        ] })
      ] }),
      /* @__PURE__ */ d.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ d.jsx("span", { className: "daw-node__param-label", children: "Ratio" }),
        /* @__PURE__ */ d.jsx(
          we,
          {
            min: 1,
            max: 10,
            step: 0.5,
            value: l,
            onChange: (C) => o(e, "ratio", C)
          }
        ),
        /* @__PURE__ */ d.jsxs("span", { className: "daw-node__param-value", children: [
          "1:",
          l.toFixed(1)
        ] })
      ] }),
      /* @__PURE__ */ d.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ d.jsx("span", { className: "daw-node__param-label", children: "Attack" }),
        /* @__PURE__ */ d.jsx(
          we,
          {
            min: 1e-4,
            max: 0.05,
            step: 1e-4,
            value: c,
            onChange: (C) => o(e, "attack", C)
          }
        ),
        /* @__PURE__ */ d.jsxs("span", { className: "daw-node__param-value", children: [
          (c * 1e3).toFixed(1),
          " ms"
        ] })
      ] }),
      /* @__PURE__ */ d.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ d.jsx("span", { className: "daw-node__param-label", children: "Release" }),
        /* @__PURE__ */ d.jsx(
          we,
          {
            min: 0.01,
            max: 0.5,
            step: 0.01,
            value: u,
            onChange: (C) => o(e, "release", C)
          }
        ),
        /* @__PURE__ */ d.jsxs("span", { className: "daw-node__param-value", children: [
          (u * 1e3).toFixed(0),
          " ms"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ d.jsx(oe, { type: "source", position: Q.Right, id: "out", className: "daw-handle daw-handle--audio daw-handle--stereo" })
  ] });
}
const R0 = {
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
}, T0 = {
  create(e, n) {
    const o = n.frequency ?? 6e3, s = n.range ?? 6, i = n.listen ?? 0, l = e.createGain();
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
    const C = e.createGain();
    C.gain.value = 0, l.connect(c), c.connect(p, 0, 1), l.connect(u), l.connect(p, 0, 0), u.connect(h), h.connect(w), c.connect(m), m.connect(w), w.connect(g), l.connect(C), C.connect(g);
    let x = 0;
    return p.port.onmessage = (I) => {
      I.data.reductionDb !== void 0 && (x = I.data.reductionDb, u.gain.setValueAtTime(-Math.abs(x), e.currentTime));
    }, {
      inputs: { in: l },
      outputs: { out: g },
      setParameter(I, b, _) {
        switch (I) {
          case "frequency":
            c.frequency.setTargetAtTime(b, _, 0.02), u.frequency.setTargetAtTime(b, _, 0.02);
            break;
          case "range": {
            const k = p.parameters.get("range");
            k && k.setTargetAtTime(b, _, 0.02);
            break;
          }
          case "listen":
            m.gain.setTargetAtTime(b, _, 0.02), h.gain.setTargetAtTime(1 - b, _, 0.02);
            break;
        }
      },
      setBypass(I, b) {
        I ? (w.gain.setTargetAtTime(0, b, 0.02), C.gain.setTargetAtTime(1, b, 0.02)) : (w.gain.setTargetAtTime(1, b, 0.02), C.gain.setTargetAtTime(0, b, 0.02));
      },
      getReductionDb() {
        return x;
      },
      dispose() {
        l.disconnect(), c.disconnect(), u.disconnect(), p.disconnect(), h.disconnect(), m.disconnect(), w.disconnect(), C.disconnect(), g.disconnect();
      }
    };
  }
};
function B0({ id: e, data: n }) {
  const o = de((x) => x.updateParameter), s = de((x) => x.toggleBypass), i = n.parameters.frequency ?? 6e3, l = n.parameters.range ?? 6, c = n.parameters.listen ?? 0, u = j.useRef(null), p = j.useRef(null), g = j.useRef(0), m = j.useCallback(() => {
    var A;
    const x = Qt(), I = x == null ? void 0 : x.getProcessor(e), b = ((A = I == null ? void 0 : I.getReductionDb) == null ? void 0 : A.call(I)) ?? 0, _ = Math.abs(b), k = Math.min(100, _ / 12 * 100);
    u.current && (u.current.style.width = `${k}%`), p.current && (p.current.textContent = _ > 0.1 ? `${b.toFixed(1)} dB` : "0.0 dB"), g.current = requestAnimationFrame(m);
  }, [e]);
  j.useEffect(() => (g.current = requestAnimationFrame(m), () => cancelAnimationFrame(g.current)), [m]);
  const h = j.useCallback(() => {
    o(e, "listen", c > 0.5 ? 0 : 1);
  }, [e, c, o]), w = [
    "daw-node daw-node--effect",
    n.bypassed ? "daw-node--bypassed" : ""
  ].join(" "), C = (x) => x >= 1e3 ? `${(x / 1e3).toFixed(1)} kHz` : `${x.toFixed(0)} Hz`;
  return /* @__PURE__ */ d.jsxs("div", { className: w, style: { minWidth: 200 }, children: [
    /* @__PURE__ */ d.jsx(
      oe,
      {
        type: "target",
        position: Q.Left,
        id: "in",
        className: "daw-handle daw-handle--audio daw-handle--stereo"
      }
    ),
    /* @__PURE__ */ d.jsxs("div", { className: "daw-node__header", children: [
      /* @__PURE__ */ d.jsx("span", { children: "De-esser" }),
      /* @__PURE__ */ d.jsxs("div", { className: "daw-node__sm-buttons", children: [
        /* @__PURE__ */ d.jsx(
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
        /* @__PURE__ */ d.jsx(
          "button",
          {
            className: `daw-node__sm-btn daw-node__sm-btn--bypass ${n.bypassed ? "active" : ""}`,
            onClick: (x) => {
              x.stopPropagation(), s(e);
            },
            title: "Bypass",
            children: "B"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ d.jsxs("div", { className: "daw-node__body nodrag nowheel", children: [
      /* @__PURE__ */ d.jsxs("div", { className: "daw-compressor__gr-meter", children: [
        /* @__PURE__ */ d.jsx("div", { className: "daw-compressor__gr-bar", ref: u }),
        /* @__PURE__ */ d.jsx("span", { className: "daw-compressor__gr-label", ref: p, children: "0.0 dB" })
      ] }),
      /* @__PURE__ */ d.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ d.jsx("span", { className: "daw-node__param-label", children: "Frequency" }),
        /* @__PURE__ */ d.jsx(
          we,
          {
            min: 2e3,
            max: 16e3,
            step: 100,
            value: i,
            onChange: (x) => o(e, "frequency", x)
          }
        ),
        /* @__PURE__ */ d.jsx("span", { className: "daw-node__param-value", children: C(i) })
      ] }),
      /* @__PURE__ */ d.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ d.jsx("span", { className: "daw-node__param-label", children: "Range" }),
        /* @__PURE__ */ d.jsx(
          we,
          {
            min: 0,
            max: 12,
            step: 0.5,
            value: l,
            onChange: (x) => o(e, "range", x)
          }
        ),
        /* @__PURE__ */ d.jsxs("span", { className: "daw-node__param-value", children: [
          l.toFixed(1),
          " dB"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ d.jsx(oe, { type: "source", position: Q.Right, id: "out", className: "daw-handle daw-handle--audio daw-handle--stereo" })
  ] });
}
const E0 = {
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
}, Fg = [
  "lowpass",
  "highpass",
  "bandpass",
  "notch",
  "allpass",
  "lowshelf",
  "highshelf"
], D0 = {
  create(e, n) {
    const o = n.filterType ?? 0, s = n.frequency ?? 1e3, i = n.Q ?? 1, l = n.gain ?? 0, c = e.createGain();
    c.gain.value = 1;
    const u = e.createBiquadFilter();
    u.type = Fg[o] || "lowpass", u.frequency.value = s, u.Q.value = i, u.gain.value = l;
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
      setParameter(h, w, C) {
        switch (h) {
          case "filterType":
            u.type = Fg[Math.round(w)] || "lowpass";
            break;
          case "frequency":
            u.frequency.setTargetAtTime(w, C, 0.02);
            break;
          case "Q":
            u.Q.setTargetAtTime(w, C, 0.02);
            break;
          case "gain":
            u.gain.setTargetAtTime(w, C, 0.02);
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
}, SA = ["LP", "HP", "BP", "Notch", "AP", "LS", "HS"];
function G0({ id: e, data: n }) {
  const o = de((h) => h.updateParameter), s = de((h) => h.toggleBypass), i = n.parameters.filterType ?? 0, l = n.parameters.frequency ?? 1e3, c = n.parameters.Q ?? 1, u = n.parameters.gain ?? 0, p = i >= 5, g = (h) => h >= 1e3 ? `${(h / 1e3).toFixed(1)} kHz` : `${h.toFixed(0)} Hz`, m = [
    "daw-node daw-node--effect",
    n.bypassed ? "daw-node--bypassed" : ""
  ].join(" ");
  return /* @__PURE__ */ d.jsxs("div", { className: m, style: { minWidth: 200 }, children: [
    /* @__PURE__ */ d.jsx(oe, { type: "target", position: Q.Left, id: "in", className: "daw-handle daw-handle--audio daw-handle--stereo" }),
    /* @__PURE__ */ d.jsx(oe, { type: "target", position: Q.Bottom, id: "freq-cv", className: "daw-handle daw-handle--parameter" }),
    /* @__PURE__ */ d.jsxs("div", { className: "daw-node__header", children: [
      /* @__PURE__ */ d.jsx("span", { children: "Filter" }),
      /* @__PURE__ */ d.jsx("div", { className: "daw-node__sm-buttons", children: /* @__PURE__ */ d.jsx(
        "button",
        {
          className: `daw-node__sm-btn daw-node__sm-btn--bypass ${n.bypassed ? "active" : ""}`,
          onClick: (h) => {
            h.stopPropagation(), s(e);
          },
          title: "Bypass",
          children: "B"
        }
      ) })
    ] }),
    /* @__PURE__ */ d.jsxs("div", { className: "daw-node__body nodrag nowheel", children: [
      /* @__PURE__ */ d.jsx("div", { style: { display: "flex", gap: 2, marginBottom: 6, flexWrap: "wrap" }, children: SA.map((h, w) => /* @__PURE__ */ d.jsx(
        "button",
        {
          className: `daw-node__sm-btn ${i === w ? "active" : ""}`,
          onClick: (C) => {
            C.stopPropagation(), o(e, "filterType", w);
          },
          style: { fontSize: "9px", padding: "2px 4px" },
          children: h
        },
        w
      )) }),
      /* @__PURE__ */ d.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ d.jsx("span", { className: "daw-node__param-label", children: "Frequency" }),
        /* @__PURE__ */ d.jsx(
          we,
          {
            min: 20,
            max: 2e4,
            step: 1,
            value: l,
            onChange: (h) => o(e, "frequency", h)
          }
        ),
        /* @__PURE__ */ d.jsx("span", { className: "daw-node__param-value", children: g(l) })
      ] }),
      /* @__PURE__ */ d.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ d.jsx("span", { className: "daw-node__param-label", children: "Q" }),
        /* @__PURE__ */ d.jsx(
          we,
          {
            min: 0.1,
            max: 20,
            step: 0.1,
            value: c,
            onChange: (h) => o(e, "Q", h)
          }
        ),
        /* @__PURE__ */ d.jsx("span", { className: "daw-node__param-value", children: c.toFixed(1) })
      ] }),
      p && /* @__PURE__ */ d.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ d.jsx("span", { className: "daw-node__param-label", children: "Gain" }),
        /* @__PURE__ */ d.jsx(
          we,
          {
            min: -24,
            max: 24,
            step: 0.5,
            value: u,
            onChange: (h) => o(e, "gain", h)
          }
        ),
        /* @__PURE__ */ d.jsxs("span", { className: "daw-node__param-value", children: [
          u > 0 ? "+" : "",
          u.toFixed(1),
          " dB"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ d.jsx(oe, { type: "source", position: Q.Right, id: "out", className: "daw-handle daw-handle--audio daw-handle--stereo" })
  ] });
}
const P0 = {
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
}, F0 = {
  create(e, n) {
    const o = n.rate ?? 1.5, s = n.depth ?? 5e-3, i = n.mix ?? 0.5, l = e.createGain();
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
    let w = i, C = !1;
    return {
      inputs: { in: l },
      outputs: { out: h },
      setParameter(x, I, b) {
        switch (x) {
          case "rate":
            p.frequency.setTargetAtTime(I, b, 0.02);
            break;
          case "depth":
            g.gain.setTargetAtTime(I, b, 0.02);
            break;
          case "mix":
            w = I, C || (c.gain.setTargetAtTime(1 - I, b, 0.02), m.gain.setTargetAtTime(I, b, 0.02));
            break;
        }
      },
      setBypass(x, I) {
        C = x, x ? (c.gain.setTargetAtTime(1, I, 0.02), m.gain.setTargetAtTime(0, I, 0.02)) : (c.gain.setTargetAtTime(1 - w, I, 0.02), m.gain.setTargetAtTime(w, I, 0.02));
      },
      dispose() {
        p.stop(), p.disconnect(), g.disconnect(), l.disconnect(), c.disconnect(), u.disconnect(), m.disconnect(), h.disconnect();
      }
    };
  }
};
function V0({ id: e, data: n }) {
  const o = de((p) => p.updateParameter), s = de((p) => p.toggleBypass), i = n.parameters.rate ?? 1.5, l = n.parameters.depth ?? 5e-3, c = n.parameters.mix ?? 0.5, u = [
    "daw-node daw-node--effect",
    n.bypassed ? "daw-node--bypassed" : ""
  ].join(" ");
  return /* @__PURE__ */ d.jsxs("div", { className: u, children: [
    /* @__PURE__ */ d.jsx(oe, { type: "target", position: Q.Left, id: "in", className: "daw-handle daw-handle--audio daw-handle--stereo" }),
    /* @__PURE__ */ d.jsxs("div", { className: "daw-node__header", children: [
      /* @__PURE__ */ d.jsx("span", { children: "Chorus" }),
      /* @__PURE__ */ d.jsx("div", { className: "daw-node__sm-buttons", children: /* @__PURE__ */ d.jsx(
        "button",
        {
          className: `daw-node__sm-btn daw-node__sm-btn--bypass ${n.bypassed ? "active" : ""}`,
          onClick: (p) => {
            p.stopPropagation(), s(e);
          },
          title: "Bypass",
          children: "B"
        }
      ) })
    ] }),
    /* @__PURE__ */ d.jsxs("div", { className: "daw-node__body nodrag nowheel", children: [
      /* @__PURE__ */ d.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ d.jsx("span", { className: "daw-node__param-label", children: "Rate" }),
        /* @__PURE__ */ d.jsx(
          we,
          {
            min: 0.1,
            max: 10,
            step: 0.1,
            value: i,
            onChange: (p) => o(e, "rate", p)
          }
        ),
        /* @__PURE__ */ d.jsxs("span", { className: "daw-node__param-value", children: [
          i.toFixed(1),
          " Hz"
        ] })
      ] }),
      /* @__PURE__ */ d.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ d.jsx("span", { className: "daw-node__param-label", children: "Depth" }),
        /* @__PURE__ */ d.jsx(
          we,
          {
            min: 0,
            max: 0.02,
            step: 1e-3,
            value: l,
            onChange: (p) => o(e, "depth", p)
          }
        ),
        /* @__PURE__ */ d.jsxs("span", { className: "daw-node__param-value", children: [
          (l * 1e3).toFixed(1),
          " ms"
        ] })
      ] }),
      /* @__PURE__ */ d.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ d.jsx("span", { className: "daw-node__param-label", children: "Mix" }),
        /* @__PURE__ */ d.jsx(
          we,
          {
            min: 0,
            max: 1,
            step: 0.01,
            value: c,
            onChange: (p) => o(e, "mix", p)
          }
        ),
        /* @__PURE__ */ d.jsxs("span", { className: "daw-node__param-value", children: [
          (c * 100).toFixed(0),
          "%"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ d.jsx(oe, { type: "source", position: Q.Right, id: "out", className: "daw-handle daw-handle--audio daw-handle--stereo" })
  ] });
}
const z0 = {
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
}, O0 = {
  create(e, n) {
    const o = n.rate ?? 0.5, s = n.depth ?? 2e-3, i = n.feedback ?? 0.5, l = n.mix ?? 0.5, c = e.createGain();
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
    const C = e.createGain();
    C.gain.value = 1, c.connect(u), u.connect(C), c.connect(p), p.connect(w), w.connect(C), p.connect(h), h.connect(p);
    let x = l, I = !1;
    return {
      inputs: { in: c },
      outputs: { out: C },
      setParameter(b, _, k) {
        switch (b) {
          case "rate":
            g.frequency.setTargetAtTime(_, k, 0.02);
            break;
          case "depth":
            m.gain.setTargetAtTime(_, k, 0.02);
            break;
          case "feedback":
            h.gain.setTargetAtTime(_, k, 0.02);
            break;
          case "mix":
            x = _, I || (u.gain.setTargetAtTime(1 - _, k, 0.02), w.gain.setTargetAtTime(_, k, 0.02));
            break;
        }
      },
      setBypass(b, _) {
        I = b, b ? (u.gain.setTargetAtTime(1, _, 0.02), w.gain.setTargetAtTime(0, _, 0.02)) : (u.gain.setTargetAtTime(1 - x, _, 0.02), w.gain.setTargetAtTime(x, _, 0.02));
      },
      dispose() {
        g.stop(), g.disconnect(), m.disconnect(), c.disconnect(), u.disconnect(), p.disconnect(), h.disconnect(), w.disconnect(), C.disconnect();
      }
    };
  }
};
function L0({ id: e, data: n }) {
  const o = de((g) => g.updateParameter), s = de((g) => g.toggleBypass), i = n.parameters.rate ?? 0.5, l = n.parameters.depth ?? 2e-3, c = n.parameters.feedback ?? 0.5, u = n.parameters.mix ?? 0.5, p = [
    "daw-node daw-node--effect",
    n.bypassed ? "daw-node--bypassed" : ""
  ].join(" ");
  return /* @__PURE__ */ d.jsxs("div", { className: p, children: [
    /* @__PURE__ */ d.jsx(oe, { type: "target", position: Q.Left, id: "in", className: "daw-handle daw-handle--audio daw-handle--stereo" }),
    /* @__PURE__ */ d.jsxs("div", { className: "daw-node__header", children: [
      /* @__PURE__ */ d.jsx("span", { children: "Flanger" }),
      /* @__PURE__ */ d.jsx("div", { className: "daw-node__sm-buttons", children: /* @__PURE__ */ d.jsx(
        "button",
        {
          className: `daw-node__sm-btn daw-node__sm-btn--bypass ${n.bypassed ? "active" : ""}`,
          onClick: (g) => {
            g.stopPropagation(), s(e);
          },
          title: "Bypass",
          children: "B"
        }
      ) })
    ] }),
    /* @__PURE__ */ d.jsxs("div", { className: "daw-node__body nodrag nowheel", children: [
      /* @__PURE__ */ d.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ d.jsx("span", { className: "daw-node__param-label", children: "Rate" }),
        /* @__PURE__ */ d.jsx(
          we,
          {
            min: 0.05,
            max: 5,
            step: 0.05,
            value: i,
            onChange: (g) => o(e, "rate", g)
          }
        ),
        /* @__PURE__ */ d.jsxs("span", { className: "daw-node__param-value", children: [
          i.toFixed(2),
          " Hz"
        ] })
      ] }),
      /* @__PURE__ */ d.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ d.jsx("span", { className: "daw-node__param-label", children: "Depth" }),
        /* @__PURE__ */ d.jsx(
          we,
          {
            min: 0,
            max: 5e-3,
            step: 1e-4,
            value: l,
            onChange: (g) => o(e, "depth", g)
          }
        ),
        /* @__PURE__ */ d.jsxs("span", { className: "daw-node__param-value", children: [
          (l * 1e3).toFixed(1),
          " ms"
        ] })
      ] }),
      /* @__PURE__ */ d.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ d.jsx("span", { className: "daw-node__param-label", children: "Feedback" }),
        /* @__PURE__ */ d.jsx(
          we,
          {
            min: 0,
            max: 0.95,
            step: 0.01,
            value: c,
            onChange: (g) => o(e, "feedback", g)
          }
        ),
        /* @__PURE__ */ d.jsxs("span", { className: "daw-node__param-value", children: [
          (c * 100).toFixed(0),
          "%"
        ] })
      ] }),
      /* @__PURE__ */ d.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ d.jsx("span", { className: "daw-node__param-label", children: "Mix" }),
        /* @__PURE__ */ d.jsx(
          we,
          {
            min: 0,
            max: 1,
            step: 0.01,
            value: u,
            onChange: (g) => o(e, "mix", g)
          }
        ),
        /* @__PURE__ */ d.jsxs("span", { className: "daw-node__param-value", children: [
          (u * 100).toFixed(0),
          "%"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ d.jsx(oe, { type: "source", position: Q.Right, id: "out", className: "daw-handle daw-handle--audio daw-handle--stereo" })
  ] });
}
const H0 = {
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
}, W0 = {
  create(e, n) {
    const o = n.rate ?? 0.5, s = n.depth ?? 0.7, i = n.feedback ?? 0.5, l = n.stages ?? 4, c = e.createGain();
    c.gain.value = 1;
    const u = [];
    for (let _ = 0; _ < 8; _++) {
      const k = e.createBiquadFilter();
      k.type = "allpass", k.frequency.value = 500 + _ * 300, k.Q.value = 0.5, u.push(k);
    }
    for (let _ = 1; _ < u.length; _++)
      u[_ - 1].connect(u[_]);
    const p = e.createOscillator();
    p.type = "sine", p.frequency.value = o;
    const g = [];
    for (let _ = 0; _ < u.length; _++) {
      const k = e.createGain();
      k.gain.value = (500 + _ * 300) * s, p.connect(k), k.connect(u[_].frequency), g.push(k);
    }
    p.start();
    const m = e.createGain();
    m.gain.value = i;
    const h = e.createGain();
    h.gain.value = 0.5;
    const w = e.createGain();
    w.gain.value = 0.5;
    const C = e.createGain();
    C.gain.value = 1;
    const x = e.createGain();
    x.gain.value = 1;
    const I = e.createGain();
    I.gain.value = 0;
    const b = Math.min(Math.max(Math.round(l), 2), 8);
    return c.connect(u[0]), u[b - 1].connect(w), w.connect(x), u[b - 1].connect(m), m.connect(u[0]), c.connect(h), h.connect(x), x.connect(C), c.connect(I), I.connect(C), {
      inputs: { in: c },
      outputs: { out: C },
      setParameter(_, k, A) {
        switch (_) {
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
      setBypass(_, k) {
        _ ? (x.gain.setTargetAtTime(0, k, 0.02), I.gain.setTargetAtTime(1, k, 0.02)) : (x.gain.setTargetAtTime(1, k, 0.02), I.gain.setTargetAtTime(0, k, 0.02));
      },
      dispose() {
        p.stop(), p.disconnect();
        for (const _ of g) _.disconnect();
        for (const _ of u) _.disconnect();
        c.disconnect(), h.disconnect(), w.disconnect(), m.disconnect(), x.disconnect(), I.disconnect(), C.disconnect();
      }
    };
  }
};
function X0({ id: e, data: n }) {
  const o = de((g) => g.updateParameter), s = de((g) => g.toggleBypass), i = n.parameters.rate ?? 0.5, l = n.parameters.depth ?? 0.7, c = n.parameters.feedback ?? 0.5, u = n.parameters.stages ?? 4, p = [
    "daw-node daw-node--effect",
    n.bypassed ? "daw-node--bypassed" : ""
  ].join(" ");
  return /* @__PURE__ */ d.jsxs("div", { className: p, children: [
    /* @__PURE__ */ d.jsx(oe, { type: "target", position: Q.Left, id: "in", className: "daw-handle daw-handle--audio daw-handle--stereo" }),
    /* @__PURE__ */ d.jsxs("div", { className: "daw-node__header", children: [
      /* @__PURE__ */ d.jsx("span", { children: "Phaser" }),
      /* @__PURE__ */ d.jsx("div", { className: "daw-node__sm-buttons", children: /* @__PURE__ */ d.jsx(
        "button",
        {
          className: `daw-node__sm-btn daw-node__sm-btn--bypass ${n.bypassed ? "active" : ""}`,
          onClick: (g) => {
            g.stopPropagation(), s(e);
          },
          title: "Bypass",
          children: "B"
        }
      ) })
    ] }),
    /* @__PURE__ */ d.jsxs("div", { className: "daw-node__body nodrag nowheel", children: [
      /* @__PURE__ */ d.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ d.jsx("span", { className: "daw-node__param-label", children: "Rate" }),
        /* @__PURE__ */ d.jsx(
          we,
          {
            min: 0.05,
            max: 5,
            step: 0.05,
            value: i,
            onChange: (g) => o(e, "rate", g)
          }
        ),
        /* @__PURE__ */ d.jsxs("span", { className: "daw-node__param-value", children: [
          i.toFixed(2),
          " Hz"
        ] })
      ] }),
      /* @__PURE__ */ d.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ d.jsx("span", { className: "daw-node__param-label", children: "Depth" }),
        /* @__PURE__ */ d.jsx(
          we,
          {
            min: 0,
            max: 1,
            step: 0.01,
            value: l,
            onChange: (g) => o(e, "depth", g)
          }
        ),
        /* @__PURE__ */ d.jsxs("span", { className: "daw-node__param-value", children: [
          (l * 100).toFixed(0),
          "%"
        ] })
      ] }),
      /* @__PURE__ */ d.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ d.jsx("span", { className: "daw-node__param-label", children: "Feedback" }),
        /* @__PURE__ */ d.jsx(
          we,
          {
            min: 0,
            max: 0.95,
            step: 0.01,
            value: c,
            onChange: (g) => o(e, "feedback", g)
          }
        ),
        /* @__PURE__ */ d.jsxs("span", { className: "daw-node__param-value", children: [
          (c * 100).toFixed(0),
          "%"
        ] })
      ] }),
      /* @__PURE__ */ d.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ d.jsx("span", { className: "daw-node__param-label", children: "Stages" }),
        /* @__PURE__ */ d.jsx(
          we,
          {
            min: 2,
            max: 8,
            step: 2,
            value: u,
            onChange: (g) => o(e, "stages", g)
          }
        ),
        /* @__PURE__ */ d.jsx("span", { className: "daw-node__param-value", children: Math.round(u) })
      ] })
    ] }),
    /* @__PURE__ */ d.jsx(oe, { type: "source", position: Q.Right, id: "out", className: "daw-handle daw-handle--audio daw-handle--stereo" })
  ] });
}
const K0 = {
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
function ou(e, n) {
  const s = new Float32Array(1024), i = n / 100;
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
const Z0 = {
  create(e, n) {
    const o = n.drive ?? 50, s = n.curveType ?? 0, i = n.mix ?? 1, l = e.createGain();
    l.gain.value = 1;
    const c = e.createWaveShaper();
    c.curve = ou(s, o), c.oversample = "2x";
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
    let w = o, C = s;
    return {
      inputs: { in: l },
      outputs: { out: g },
      setParameter(x, I, b) {
        switch (x) {
          case "drive":
            w = I, c.curve = ou(C, w);
            break;
          case "curveType":
            C = Math.round(I), c.curve = ou(C, w);
            break;
          case "mix":
            u.gain.setTargetAtTime(1 - I, b, 0.02), p.gain.setTargetAtTime(I, b, 0.02);
            break;
        }
      },
      setBypass(x, I) {
        x ? (m.gain.setTargetAtTime(0, I, 0.02), h.gain.setTargetAtTime(1, I, 0.02)) : (m.gain.setTargetAtTime(1, I, 0.02), h.gain.setTargetAtTime(0, I, 0.02));
      },
      dispose() {
        l.disconnect(), c.disconnect(), u.disconnect(), p.disconnect(), m.disconnect(), h.disconnect(), g.disconnect();
      }
    };
  }
}, kA = ["Soft", "Hard", "Fold", "Tube"];
function Y0({ id: e, data: n }) {
  const o = de((p) => p.updateParameter), s = de((p) => p.toggleBypass), i = n.parameters.drive ?? 50, l = n.parameters.curveType ?? 0, c = n.parameters.mix ?? 1, u = [
    "daw-node daw-node--effect",
    n.bypassed ? "daw-node--bypassed" : ""
  ].join(" ");
  return /* @__PURE__ */ d.jsxs("div", { className: u, style: { minWidth: 180 }, children: [
    /* @__PURE__ */ d.jsx(oe, { type: "target", position: Q.Left, id: "in", className: "daw-handle daw-handle--audio daw-handle--stereo" }),
    /* @__PURE__ */ d.jsxs("div", { className: "daw-node__header", children: [
      /* @__PURE__ */ d.jsx("span", { children: "Waveshaper" }),
      /* @__PURE__ */ d.jsx("div", { className: "daw-node__sm-buttons", children: /* @__PURE__ */ d.jsx(
        "button",
        {
          className: `daw-node__sm-btn daw-node__sm-btn--bypass ${n.bypassed ? "active" : ""}`,
          onClick: (p) => {
            p.stopPropagation(), s(e);
          },
          title: "Bypass",
          children: "B"
        }
      ) })
    ] }),
    /* @__PURE__ */ d.jsxs("div", { className: "daw-node__body nodrag nowheel", children: [
      /* @__PURE__ */ d.jsx("div", { style: { display: "flex", gap: 2, marginBottom: 6 }, children: kA.map((p, g) => /* @__PURE__ */ d.jsx(
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
      /* @__PURE__ */ d.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ d.jsx("span", { className: "daw-node__param-label", children: "Drive" }),
        /* @__PURE__ */ d.jsx(
          we,
          {
            min: 0,
            max: 100,
            step: 1,
            value: i,
            onChange: (p) => o(e, "drive", p)
          }
        ),
        /* @__PURE__ */ d.jsxs("span", { className: "daw-node__param-value", children: [
          i.toFixed(0),
          "%"
        ] })
      ] }),
      /* @__PURE__ */ d.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ d.jsx("span", { className: "daw-node__param-label", children: "Mix" }),
        /* @__PURE__ */ d.jsx(
          we,
          {
            min: 0,
            max: 1,
            step: 0.01,
            value: c,
            onChange: (p) => o(e, "mix", p)
          }
        ),
        /* @__PURE__ */ d.jsxs("span", { className: "daw-node__param-value", children: [
          (c * 100).toFixed(0),
          "%"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ d.jsx(oe, { type: "source", position: Q.Right, id: "out", className: "daw-handle daw-handle--audio daw-handle--stereo" })
  ] });
}
const U0 = {
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
}, $0 = {
  create(e, n) {
    const o = n.bitDepth ?? 8, s = n.sampleRateReduction ?? 1, i = e.createGain();
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
function Q0({ id: e, data: n }) {
  const o = de((u) => u.updateParameter), s = de((u) => u.toggleBypass), i = n.parameters.bitDepth ?? 8, l = n.parameters.sampleRateReduction ?? 1, c = [
    "daw-node daw-node--effect",
    n.bypassed ? "daw-node--bypassed" : ""
  ].join(" ");
  return /* @__PURE__ */ d.jsxs("div", { className: c, children: [
    /* @__PURE__ */ d.jsx(oe, { type: "target", position: Q.Left, id: "in", className: "daw-handle daw-handle--audio daw-handle--stereo" }),
    /* @__PURE__ */ d.jsxs("div", { className: "daw-node__header", children: [
      /* @__PURE__ */ d.jsx("span", { children: "Bitcrusher" }),
      /* @__PURE__ */ d.jsx("div", { className: "daw-node__sm-buttons", children: /* @__PURE__ */ d.jsx(
        "button",
        {
          className: `daw-node__sm-btn daw-node__sm-btn--bypass ${n.bypassed ? "active" : ""}`,
          onClick: (u) => {
            u.stopPropagation(), s(e);
          },
          title: "Bypass",
          children: "B"
        }
      ) })
    ] }),
    /* @__PURE__ */ d.jsxs("div", { className: "daw-node__body nodrag nowheel", children: [
      /* @__PURE__ */ d.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ d.jsx("span", { className: "daw-node__param-label", children: "Bit Depth" }),
        /* @__PURE__ */ d.jsx(
          we,
          {
            min: 1,
            max: 16,
            step: 1,
            value: i,
            onChange: (u) => o(e, "bitDepth", u)
          }
        ),
        /* @__PURE__ */ d.jsxs("span", { className: "daw-node__param-value", children: [
          Math.round(i),
          " bit"
        ] })
      ] }),
      /* @__PURE__ */ d.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ d.jsx("span", { className: "daw-node__param-label", children: "SR Reduction" }),
        /* @__PURE__ */ d.jsx(
          we,
          {
            min: 1,
            max: 64,
            step: 1,
            value: l,
            onChange: (u) => o(e, "sampleRateReduction", u)
          }
        ),
        /* @__PURE__ */ d.jsxs("span", { className: "daw-node__param-value", children: [
          Math.round(l),
          "x"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ d.jsx(oe, { type: "source", position: Q.Right, id: "out", className: "daw-handle daw-handle--audio daw-handle--stereo" })
  ] });
}
const J0 = {
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
function Vg(e) {
  const o = new Float32Array(1024), s = 1 + e / 100 * 10;
  for (let i = 0; i < 1024; i++) {
    const l = i * 2 / 1024 - 1;
    o[i] = Math.tanh(l * s);
  }
  return o;
}
const q0 = {
  create(e, n) {
    const o = n.drive ?? 30, s = n.tone ?? 0, i = n.mix ?? 1, l = e.createGain();
    l.gain.value = 1;
    const c = e.createWaveShaper();
    c.curve = Vg(o), c.oversample = "2x";
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
    let C = o;
    return {
      inputs: { in: l },
      outputs: { out: m },
      setParameter(x, I, b) {
        switch (x) {
          case "drive":
            C = I, c.curve = Vg(C);
            break;
          case "tone":
            u.gain.setTargetAtTime(I / 10, b, 0.02);
            break;
          case "mix":
            p.gain.setTargetAtTime(1 - I, b, 0.02), g.gain.setTargetAtTime(I, b, 0.02);
            break;
        }
      },
      setBypass(x, I) {
        x ? (h.gain.setTargetAtTime(0, I, 0.02), w.gain.setTargetAtTime(1, I, 0.02)) : (h.gain.setTargetAtTime(1, I, 0.02), w.gain.setTargetAtTime(0, I, 0.02));
      },
      dispose() {
        l.disconnect(), c.disconnect(), u.disconnect(), p.disconnect(), g.disconnect(), h.disconnect(), w.disconnect(), m.disconnect();
      }
    };
  }
};
function ey({ id: e, data: n }) {
  const o = de((p) => p.updateParameter), s = de((p) => p.toggleBypass), i = n.parameters.drive ?? 30, l = n.parameters.tone ?? 0, c = n.parameters.mix ?? 1, u = [
    "daw-node daw-node--effect",
    n.bypassed ? "daw-node--bypassed" : ""
  ].join(" ");
  return /* @__PURE__ */ d.jsxs("div", { className: u, children: [
    /* @__PURE__ */ d.jsx(oe, { type: "target", position: Q.Left, id: "in", className: "daw-handle daw-handle--audio daw-handle--stereo" }),
    /* @__PURE__ */ d.jsxs("div", { className: "daw-node__header", children: [
      /* @__PURE__ */ d.jsx("span", { children: "Tape Sat" }),
      /* @__PURE__ */ d.jsx("div", { className: "daw-node__sm-buttons", children: /* @__PURE__ */ d.jsx(
        "button",
        {
          className: `daw-node__sm-btn daw-node__sm-btn--bypass ${n.bypassed ? "active" : ""}`,
          onClick: (p) => {
            p.stopPropagation(), s(e);
          },
          title: "Bypass",
          children: "B"
        }
      ) })
    ] }),
    /* @__PURE__ */ d.jsxs("div", { className: "daw-node__body nodrag nowheel", children: [
      /* @__PURE__ */ d.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ d.jsx("span", { className: "daw-node__param-label", children: "Drive" }),
        /* @__PURE__ */ d.jsx(
          we,
          {
            min: 0,
            max: 100,
            step: 1,
            value: i,
            onChange: (p) => o(e, "drive", p)
          }
        ),
        /* @__PURE__ */ d.jsxs("span", { className: "daw-node__param-value", children: [
          i.toFixed(0),
          "%"
        ] })
      ] }),
      /* @__PURE__ */ d.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ d.jsx("span", { className: "daw-node__param-label", children: "Tone" }),
        /* @__PURE__ */ d.jsx(
          we,
          {
            min: -100,
            max: 100,
            step: 1,
            value: l,
            onChange: (p) => o(e, "tone", p)
          }
        ),
        /* @__PURE__ */ d.jsxs("span", { className: "daw-node__param-value", children: [
          l > 0 ? "+" : "",
          l.toFixed(0)
        ] })
      ] }),
      /* @__PURE__ */ d.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ d.jsx("span", { className: "daw-node__param-label", children: "Mix" }),
        /* @__PURE__ */ d.jsx(
          we,
          {
            min: 0,
            max: 1,
            step: 0.01,
            value: c,
            onChange: (p) => o(e, "mix", p)
          }
        ),
        /* @__PURE__ */ d.jsxs("span", { className: "daw-node__param-value", children: [
          (c * 100).toFixed(0),
          "%"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ d.jsx(oe, { type: "source", position: Q.Right, id: "out", className: "daw-handle daw-handle--audio daw-handle--stereo" })
  ] });
}
const ty = {
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
}, ny = {
  create(e, n) {
    const o = n.pan ?? 0, s = e.createGain();
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
function ry({ id: e, data: n }) {
  const o = de((u) => u.updateParameter), s = de((u) => u.toggleBypass), i = n.parameters.pan ?? 0, l = (u) => Math.abs(u) < 0.01 ? "C" : u < 0 ? `L${Math.abs(Math.round(u * 100))}` : `R${Math.round(u * 100)}`, c = ["daw-node daw-node--utility", n.bypassed ? "daw-node--bypassed" : ""].join(" ");
  return /* @__PURE__ */ d.jsxs("div", { className: c, children: [
    /* @__PURE__ */ d.jsx(oe, { type: "target", position: Q.Left, id: "in", className: "daw-handle daw-handle--audio daw-handle--stereo" }),
    /* @__PURE__ */ d.jsxs("div", { className: "daw-node__header", children: [
      /* @__PURE__ */ d.jsx("span", { children: "Pan" }),
      /* @__PURE__ */ d.jsx("div", { className: "daw-node__sm-buttons", children: /* @__PURE__ */ d.jsx(
        "button",
        {
          className: `daw-node__sm-btn daw-node__sm-btn--bypass ${n.bypassed ? "active" : ""}`,
          onClick: (u) => {
            u.stopPropagation(), s(e);
          },
          title: "Bypass",
          children: "B"
        }
      ) })
    ] }),
    /* @__PURE__ */ d.jsx("div", { className: "daw-node__body nodrag nowheel", children: /* @__PURE__ */ d.jsxs("label", { className: "daw-node__param", children: [
      /* @__PURE__ */ d.jsx("span", { className: "daw-node__param-label", children: "Pan" }),
      /* @__PURE__ */ d.jsx(
        we,
        {
          min: -1,
          max: 1,
          step: 0.01,
          value: i,
          onChange: (u) => o(e, "pan", u)
        }
      ),
      /* @__PURE__ */ d.jsx("span", { className: "daw-node__param-value", children: l(i) })
    ] }) }),
    /* @__PURE__ */ d.jsx(oe, { type: "source", position: Q.Right, id: "out", className: "daw-handle daw-handle--audio daw-handle--stereo" })
  ] });
}
const oy = {
  type: "mono-sum",
  label: "Mono Sum",
  category: "utility",
  ports: [
    { id: "in", label: "Stereo In", direction: "input", signalType: "audio", channelFormat: "stereo" },
    { id: "out", label: "Mono Out", direction: "output", signalType: "audio", channelFormat: "mono" }
  ],
  parameters: []
}, ay = {
  create(e) {
    const n = e.createGain();
    n.gain.value = 1;
    const o = e.createChannelMerger(1), s = e.createGain();
    s.gain.value = 0.707;
    const i = e.createGain();
    return i.gain.value = 1, n.connect(s), s.connect(o), o.connect(i), {
      inputs: { in: n },
      outputs: { out: i },
      setParameter() {
      },
      dispose() {
        n.disconnect(), s.disconnect(), o.disconnect(), i.disconnect();
      }
    };
  }
};
function sy(e) {
  return /* @__PURE__ */ d.jsxs("div", { className: "daw-node daw-node--utility", style: { minWidth: 100 }, children: [
    /* @__PURE__ */ d.jsx(oe, { type: "target", position: Q.Left, id: "in", className: "daw-handle daw-handle--audio daw-handle--stereo" }),
    /* @__PURE__ */ d.jsx("div", { className: "daw-node__header", children: /* @__PURE__ */ d.jsx("span", { children: "Mono Sum" }) }),
    /* @__PURE__ */ d.jsx("div", { className: "daw-node__body", style: { padding: "4px 8px", fontSize: "10px", color: "var(--daw-text-label)" }, children: "L+R → M" }),
    /* @__PURE__ */ d.jsx(oe, { type: "source", position: Q.Right, id: "out", className: "daw-handle daw-handle--audio daw-handle--mono" })
  ] });
}
const iy = {
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
}, ly = {
  create(e, n) {
    const o = n.invertL ?? 1, s = n.invertR ?? 1, i = e.createGain();
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
function cy({ id: e, data: n }) {
  const o = de((l) => l.updateParameter), s = n.parameters.invertL ?? 1, i = n.parameters.invertR ?? 1;
  return /* @__PURE__ */ d.jsxs("div", { className: "daw-node daw-node--utility", style: { minWidth: 120 }, children: [
    /* @__PURE__ */ d.jsx(oe, { type: "target", position: Q.Left, id: "in", className: "daw-handle daw-handle--audio daw-handle--stereo" }),
    /* @__PURE__ */ d.jsx("div", { className: "daw-node__header", children: /* @__PURE__ */ d.jsx("span", { children: "Phase Inv" }) }),
    /* @__PURE__ */ d.jsxs("div", { className: "daw-node__body nodrag", style: { display: "flex", gap: 8, padding: "6px 8px" }, children: [
      /* @__PURE__ */ d.jsx(
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
      /* @__PURE__ */ d.jsx(
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
    /* @__PURE__ */ d.jsx(oe, { type: "source", position: Q.Right, id: "out", className: "daw-handle daw-handle--audio daw-handle--stereo" })
  ] });
}
const uy = {
  type: "dc-offset",
  label: "DC Remove",
  category: "utility",
  ports: [
    { id: "in", label: "Audio In", direction: "input", signalType: "audio", channelFormat: "stereo" },
    { id: "out", label: "Output", direction: "output", signalType: "audio", channelFormat: "stereo" }
  ],
  parameters: []
}, dy = {
  create(e) {
    const n = e.createGain();
    n.gain.value = 1;
    const o = e.createBiquadFilter();
    o.type = "highpass", o.frequency.value = 5, o.Q.value = 0.707;
    const s = e.createGain();
    return s.gain.value = 1, n.connect(o), o.connect(s), {
      inputs: { in: n },
      outputs: { out: s },
      setParameter() {
      },
      dispose() {
        n.disconnect(), o.disconnect(), s.disconnect();
      }
    };
  }
};
function fy(e) {
  return /* @__PURE__ */ d.jsxs("div", { className: "daw-node daw-node--utility", style: { minWidth: 100 }, children: [
    /* @__PURE__ */ d.jsx(oe, { type: "target", position: Q.Left, id: "in", className: "daw-handle daw-handle--audio daw-handle--stereo" }),
    /* @__PURE__ */ d.jsx("div", { className: "daw-node__header", children: /* @__PURE__ */ d.jsx("span", { children: "DC Remove" }) }),
    /* @__PURE__ */ d.jsx("div", { className: "daw-node__body", style: { padding: "4px 8px", fontSize: "10px", color: "var(--daw-text-label)" }, children: "HPF @ 5 Hz" }),
    /* @__PURE__ */ d.jsx(oe, { type: "source", position: Q.Right, id: "out", className: "daw-handle daw-handle--audio daw-handle--stereo" })
  ] });
}
const py = {
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
}, gy = {
  create(e, n) {
    const o = n.select ?? 0, s = e.createGain();
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
function my({ id: e, data: n }) {
  const o = de((c) => c.updateParameter), i = (n.parameters.select ?? 0) >= 0.5, l = j.useCallback(() => {
    o(e, "select", i ? 0 : 1);
  }, [e, i, o]);
  return /* @__PURE__ */ d.jsxs("div", { className: "daw-node daw-node--utility", style: { minWidth: 100 }, children: [
    /* @__PURE__ */ d.jsx(
      oe,
      {
        type: "target",
        position: Q.Left,
        id: "a",
        className: "daw-handle daw-handle--audio daw-handle--stereo daw-handle--pos-1of2"
      }
    ),
    /* @__PURE__ */ d.jsx(
      oe,
      {
        type: "target",
        position: Q.Left,
        id: "b",
        className: "daw-handle daw-handle--audio daw-handle--stereo daw-handle--pos-2of2"
      }
    ),
    /* @__PURE__ */ d.jsx("div", { className: "daw-node__header", children: /* @__PURE__ */ d.jsx("span", { children: "A/B" }) }),
    /* @__PURE__ */ d.jsx("div", { className: "daw-node__body nodrag", style: { display: "flex", justifyContent: "center", padding: "8px" }, children: /* @__PURE__ */ d.jsx(
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
    /* @__PURE__ */ d.jsx(oe, { type: "source", position: Q.Right, id: "out", className: "daw-handle daw-handle--audio daw-handle--stereo" })
  ] });
}
const hy = {
  type: "oscilloscope",
  label: "Oscilloscope",
  category: "utility",
  ports: [
    { id: "in", label: "Audio In", direction: "input", signalType: "audio", channelFormat: "stereo" },
    { id: "out", label: "Thru", direction: "output", signalType: "audio", channelFormat: "stereo" }
  ],
  parameters: []
}, yy = {
  create(e) {
    const n = e.createGain();
    n.gain.value = 1;
    const o = e.createAnalyser();
    o.fftSize = 2048;
    const s = e.createGain();
    return s.gain.value = 1, n.connect(o), o.connect(s), {
      inputs: { in: n },
      outputs: { out: s },
      setParameter() {
      },
      getAnalyserNode() {
        return o;
      },
      dispose() {
        n.disconnect(), o.disconnect(), s.disconnect();
      }
    };
  }
};
function wy({ id: e }) {
  const n = j.useRef(null), o = j.useRef(0), s = j.useCallback(() => {
    var h;
    const i = n.current;
    if (!i) {
      o.current = requestAnimationFrame(s);
      return;
    }
    const l = i.getContext("2d");
    if (!l) {
      o.current = requestAnimationFrame(s);
      return;
    }
    const c = Qt(), u = c == null ? void 0 : c.getProcessor(e), p = (h = u == null ? void 0 : u.getAnalyserNode) == null ? void 0 : h.call(u), g = i.width, m = i.height;
    if (l.fillStyle = "#111", l.fillRect(0, 0, g, m), p) {
      const w = p.frequencyBinCount, C = new Float32Array(w);
      p.getFloatTimeDomainData(C), l.strokeStyle = "#22c55e", l.lineWidth = 1.5, l.beginPath();
      const x = g / w;
      let I = 0;
      for (let b = 0; b < w; b++) {
        const _ = (1 - C[b]) * m / 2;
        b === 0 ? l.moveTo(I, _) : l.lineTo(I, _), I += x;
      }
      l.stroke();
    }
    l.strokeStyle = "#333", l.lineWidth = 0.5, l.beginPath(), l.moveTo(0, m / 2), l.lineTo(g, m / 2), l.stroke(), o.current = requestAnimationFrame(s);
  }, [e]);
  return j.useEffect(() => (o.current = requestAnimationFrame(s), () => cancelAnimationFrame(o.current)), [s]), /* @__PURE__ */ d.jsxs("div", { className: "daw-node daw-node--utility", style: { minWidth: 200 }, children: [
    /* @__PURE__ */ d.jsx(oe, { type: "target", position: Q.Left, id: "in", className: "daw-handle daw-handle--audio daw-handle--stereo" }),
    /* @__PURE__ */ d.jsx("div", { className: "daw-node__header", children: /* @__PURE__ */ d.jsx("span", { children: "Oscilloscope" }) }),
    /* @__PURE__ */ d.jsx("div", { className: "daw-node__body nodrag nowheel", style: { padding: 4 }, children: /* @__PURE__ */ d.jsx("canvas", { ref: n, width: 180, height: 80, style: { display: "block", borderRadius: 3 } }) }),
    /* @__PURE__ */ d.jsx(oe, { type: "source", position: Q.Right, id: "out", className: "daw-handle daw-handle--audio daw-handle--stereo" })
  ] });
}
const vy = {
  type: "correlation-meter",
  label: "Correlation",
  category: "utility",
  ports: [
    { id: "in", label: "Stereo In", direction: "input", signalType: "audio", channelFormat: "stereo" },
    { id: "out", label: "Thru", direction: "output", signalType: "audio", channelFormat: "stereo" }
  ],
  parameters: []
}, xy = {
  create(e) {
    const n = e.createGain();
    n.gain.value = 1;
    const o = e.createChannelSplitter(2), s = e.createAnalyser();
    s.fftSize = 2048;
    const i = e.createAnalyser();
    i.fftSize = 2048;
    const l = e.createGain();
    l.gain.value = 1, n.connect(o), o.connect(s, 0), o.connect(i, 1), n.connect(l);
    const c = {
      inputs: { in: n },
      outputs: { out: l },
      setParameter() {
      },
      getAnalyserNode() {
        return s;
      },
      dispose() {
        n.disconnect(), o.disconnect(), s.disconnect(), i.disconnect(), l.disconnect();
      }
    };
    return c.getAnalyserNodes = () => ({ left: s, right: i }), c;
  }
};
function jA(e, n) {
  let o = 0, s = 0, i = 0;
  const l = Math.min(e.length, n.length);
  for (let u = 0; u < l; u++)
    o += e[u] * n[u], s += e[u] * e[u], i += n[u] * n[u];
  const c = Math.sqrt(s * i);
  return c > 1e-10 ? o / c : 0;
}
function Iy({ id: e }) {
  const n = j.useRef(null), o = j.useRef(0), s = j.useCallback(() => {
    var x;
    const i = n.current;
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
    const p = Qt(), g = p == null ? void 0 : p.getProcessor(e), m = (x = g == null ? void 0 : g.getAnalyserNodes) == null ? void 0 : x.call(g);
    let h = 0;
    if (m) {
      const I = m.left.frequencyBinCount, b = new Float32Array(I), _ = new Float32Array(I);
      m.left.getFloatTimeDomainData(b), m.right.getFloatTimeDomainData(_), h = jA(b, _);
    }
    const w = (h + 1) / 2 * c, C = h > 0 ? "#22c55e" : h < -0.5 ? "#ef4444" : "#f59e0b";
    l.fillStyle = C, l.fillRect(c / 2, 4, w - c / 2, u - 8), l.strokeStyle = "#666", l.lineWidth = 1, l.beginPath(), l.moveTo(c / 2, 0), l.lineTo(c / 2, u), l.stroke(), l.fillStyle = "#999", l.font = "9px monospace", l.textAlign = "left", l.fillText("-1", 2, u - 2), l.textAlign = "right", l.fillText("+1", c - 2, u - 2), l.textAlign = "center", l.fillStyle = "#fff", l.fillText(h.toFixed(2), c / 2, u - 2), o.current = requestAnimationFrame(s);
  }, [e]);
  return j.useEffect(() => (o.current = requestAnimationFrame(s), () => cancelAnimationFrame(o.current)), [s]), /* @__PURE__ */ d.jsxs("div", { className: "daw-node daw-node--utility", style: { minWidth: 180 }, children: [
    /* @__PURE__ */ d.jsx(oe, { type: "target", position: Q.Left, id: "in", className: "daw-handle daw-handle--audio daw-handle--stereo" }),
    /* @__PURE__ */ d.jsx("div", { className: "daw-node__header", children: /* @__PURE__ */ d.jsx("span", { children: "Correlation" }) }),
    /* @__PURE__ */ d.jsx("div", { className: "daw-node__body nodrag nowheel", style: { padding: 4 }, children: /* @__PURE__ */ d.jsx("canvas", { ref: n, width: 170, height: 24, style: { display: "block", borderRadius: 3 } }) }),
    /* @__PURE__ */ d.jsx(oe, { type: "source", position: Q.Right, id: "out", className: "daw-handle daw-handle--audio daw-handle--stereo" })
  ] });
}
const Cy = {
  type: "loudness-meter",
  label: "Loudness",
  category: "utility",
  ports: [
    { id: "in", label: "Stereo In", direction: "input", signalType: "audio", channelFormat: "stereo" },
    { id: "out", label: "Thru", direction: "output", signalType: "audio", channelFormat: "stereo" }
  ],
  parameters: []
}, by = {
  create(e) {
    const n = e.createGain();
    n.gain.value = 1;
    const o = e.createBiquadFilter();
    o.type = "highshelf", o.frequency.value = 1500, o.gain.value = 4;
    const s = e.createBiquadFilter();
    s.type = "highpass", s.frequency.value = 38, s.Q.value = 0.5;
    const i = e.createAnalyser();
    i.fftSize = 2048;
    const l = e.createGain();
    return l.gain.value = 1, n.connect(o), o.connect(s), s.connect(i), n.connect(l), {
      inputs: { in: n },
      outputs: { out: l },
      setParameter() {
      },
      getAnalyserNode() {
        return i;
      },
      dispose() {
        n.disconnect(), o.disconnect(), s.disconnect(), i.disconnect(), l.disconnect();
      }
    };
  }
};
function _y({ id: e }) {
  const n = j.useRef(null), o = j.useRef(null), s = j.useRef(null), i = j.useRef(0), l = j.useRef(-70), c = j.useRef([]), u = j.useCallback(() => {
    var h;
    const p = Qt(), g = p == null ? void 0 : p.getProcessor(e), m = (h = g == null ? void 0 : g.getAnalyserNode) == null ? void 0 : h.call(g);
    if (m) {
      const w = m.frequencyBinCount, C = new Float32Array(w);
      m.getFloatTimeDomainData(C);
      let x = 0;
      for (let k = 0; k < w; k++)
        x += C[k] * C[k];
      const I = Math.sqrt(x / w), b = I > 1e-10 ? 20 * Math.log10(I) - 0.691 : -70;
      c.current.push(b), c.current.length > 90 && c.current.shift();
      const _ = c.current.reduce((k, A) => k + A, 0) / c.current.length;
      if (l.current = l.current * 0.99 + b * 0.01, n.current && (n.current.textContent = `M: ${b > -60 ? b.toFixed(1) : "-inf"} LUFS`), o.current && (o.current.textContent = `S: ${_ > -60 ? _.toFixed(1) : "-inf"} LUFS`), s.current) {
        const k = Math.max(0, Math.min(100, (b + 60) / 60 * 100));
        s.current.style.width = `${k}%`, s.current.style.background = b > -14 ? "#ef4444" : b > -23 ? "#f59e0b" : "#22c55e";
      }
    }
    i.current = requestAnimationFrame(u);
  }, [e]);
  return j.useEffect(() => (i.current = requestAnimationFrame(u), () => cancelAnimationFrame(i.current)), [u]), /* @__PURE__ */ d.jsxs("div", { className: "daw-node daw-node--utility", style: { minWidth: 160 }, children: [
    /* @__PURE__ */ d.jsx(oe, { type: "target", position: Q.Left, id: "in", className: "daw-handle daw-handle--audio daw-handle--stereo" }),
    /* @__PURE__ */ d.jsx("div", { className: "daw-node__header", children: /* @__PURE__ */ d.jsx("span", { children: "Loudness" }) }),
    /* @__PURE__ */ d.jsxs("div", { className: "daw-node__body nodrag nowheel", style: { padding: "4px 6px", fontSize: "9px", fontFamily: "monospace" }, children: [
      /* @__PURE__ */ d.jsx("div", { style: { background: "#111", borderRadius: 3, height: 8, marginBottom: 4, overflow: "hidden" }, children: /* @__PURE__ */ d.jsx("div", { ref: s, style: { height: "100%", width: "0%", transition: "width 0.1s" } }) }),
      /* @__PURE__ */ d.jsx("div", { children: /* @__PURE__ */ d.jsx("span", { ref: n, children: "M: -inf LUFS" }) }),
      /* @__PURE__ */ d.jsx("div", { children: /* @__PURE__ */ d.jsx("span", { ref: o, children: "S: -inf LUFS" }) })
    ] }),
    /* @__PURE__ */ d.jsx(oe, { type: "source", position: Q.Right, id: "out", className: "daw-handle daw-handle--audio daw-handle--stereo" })
  ] });
}
const Ny = {
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
}, Ay = {
  create(e) {
    const n = e.createGain();
    return n.gain.value = 1, {
      inputs: { in: n },
      outputs: { out: n },
      setParameter() {
      },
      dispose() {
        n.disconnect();
      }
    };
  }
};
function Sy({ data: e }) {
  const n = e.portDirection === "input", o = e.label || "Port";
  return /* @__PURE__ */ d.jsxs("div", { className: `daw-port-node daw-port-node--${n ? "input" : "output"}`, children: [
    !n && /* @__PURE__ */ d.jsx(
      oe,
      {
        type: "target",
        position: Q.Left,
        id: "in",
        className: "daw-handle daw-handle--audio daw-handle--stereo"
      }
    ),
    /* @__PURE__ */ d.jsx("div", { className: "daw-port-node__label", children: o }),
    n && /* @__PURE__ */ d.jsx(
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
const ky = {
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
}, jy = {
  create(e, n) {
    const o = new AudioWorkletNode(e, "envelope-detector-processor", {
      numberOfInputs: 1,
      numberOfOutputs: 1,
      outputChannelCount: [1],
      parameterData: {
        attack: n.attack ?? 3e-3,
        release: n.release ?? 0.25
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
function My({ id: e, data: n }) {
  const o = de((l) => l.updateParameter), s = n.parameters.attack ?? 3e-3, i = n.parameters.release ?? 0.25;
  return /* @__PURE__ */ d.jsxs("div", { className: "daw-node daw-node--effect", style: { minWidth: 160 }, children: [
    /* @__PURE__ */ d.jsx(
      oe,
      {
        type: "target",
        position: Q.Left,
        id: "in",
        className: "daw-handle daw-handle--audio"
      }
    ),
    /* @__PURE__ */ d.jsx("div", { className: "daw-node__header", children: /* @__PURE__ */ d.jsx("span", { children: "Env Detector" }) }),
    /* @__PURE__ */ d.jsxs("div", { className: "daw-node__body nodrag nowheel", children: [
      /* @__PURE__ */ d.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ d.jsx("span", { className: "daw-node__param-label", children: "Attack" }),
        /* @__PURE__ */ d.jsx(
          we,
          {
            min: 1e-3,
            max: 0.1,
            step: 1e-3,
            value: s,
            onChange: (l) => o(e, "attack", l)
          }
        ),
        /* @__PURE__ */ d.jsxs("span", { className: "daw-node__param-value", children: [
          (s * 1e3).toFixed(1),
          " ms"
        ] })
      ] }),
      /* @__PURE__ */ d.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ d.jsx("span", { className: "daw-node__param-label", children: "Release" }),
        /* @__PURE__ */ d.jsx(
          we,
          {
            min: 0.01,
            max: 1,
            step: 0.01,
            value: i,
            onChange: (l) => o(e, "release", l)
          }
        ),
        /* @__PURE__ */ d.jsxs("span", { className: "daw-node__param-value", children: [
          (i * 1e3).toFixed(0),
          " ms"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ d.jsx(
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
const Ry = {
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
}, Ty = {
  create(e, n) {
    const o = new AudioWorkletNode(e, "gain-computer-processor", {
      numberOfInputs: 1,
      numberOfOutputs: 1,
      outputChannelCount: [1],
      parameterData: {
        threshold: n.threshold ?? -18,
        ratio: n.ratio ?? 4
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
function By({ id: e, data: n }) {
  const o = de((l) => l.updateParameter), s = n.parameters.threshold ?? -18, i = n.parameters.ratio ?? 4;
  return /* @__PURE__ */ d.jsxs("div", { className: "daw-node daw-node--effect", style: { minWidth: 160 }, children: [
    /* @__PURE__ */ d.jsx(
      oe,
      {
        type: "target",
        position: Q.Left,
        id: "in",
        className: "daw-handle daw-handle--audio"
      }
    ),
    /* @__PURE__ */ d.jsx("div", { className: "daw-node__header", children: /* @__PURE__ */ d.jsx("span", { children: "Gain Computer" }) }),
    /* @__PURE__ */ d.jsxs("div", { className: "daw-node__body nodrag nowheel", children: [
      /* @__PURE__ */ d.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ d.jsx("span", { className: "daw-node__param-label", children: "Threshold" }),
        /* @__PURE__ */ d.jsx(
          we,
          {
            min: -60,
            max: 0,
            step: 0.5,
            value: s,
            onChange: (l) => o(e, "threshold", l)
          }
        ),
        /* @__PURE__ */ d.jsxs("span", { className: "daw-node__param-value", children: [
          s.toFixed(1),
          " dB"
        ] })
      ] }),
      /* @__PURE__ */ d.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ d.jsx("span", { className: "daw-node__param-label", children: "Ratio" }),
        /* @__PURE__ */ d.jsx(
          we,
          {
            min: 1,
            max: 20,
            step: 0.5,
            value: i,
            onChange: (l) => o(e, "ratio", l)
          }
        ),
        /* @__PURE__ */ d.jsxs("span", { className: "daw-node__param-value", children: [
          i.toFixed(1),
          ":1"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ d.jsx(
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
}, Dy = {
  create(e) {
    const n = new AudioWorkletNode(e, "multiply-processor", {
      numberOfInputs: 2,
      numberOfOutputs: 1,
      outputChannelCount: [1]
    }), o = e.createGain();
    o.gain.value = 1;
    const s = e.createGain();
    return s.gain.value = 1, o.connect(n, 0, 0), s.connect(n, 0, 1), {
      inputs: { a: o, b: s },
      outputs: { out: n },
      setParameter() {
      },
      dispose() {
        o.disconnect(), s.disconnect(), n.disconnect();
      }
    };
  }
};
function Gy() {
  return /* @__PURE__ */ d.jsxs("div", { className: "daw-node daw-node--atomic", style: { minWidth: 60 }, children: [
    /* @__PURE__ */ d.jsx(
      oe,
      {
        type: "target",
        position: Q.Left,
        id: "a",
        className: "daw-handle daw-handle--audio daw-handle--pos-1of2"
      }
    ),
    /* @__PURE__ */ d.jsx(
      oe,
      {
        type: "target",
        position: Q.Left,
        id: "b",
        className: "daw-handle daw-handle--audio daw-handle--pos-2of2"
      }
    ),
    /* @__PURE__ */ d.jsx("div", { className: "daw-node__header", children: /* @__PURE__ */ d.jsx("span", { children: "Multiply" }) }),
    /* @__PURE__ */ d.jsx("div", { className: "daw-node__body daw-node__symbol", children: "×" }),
    /* @__PURE__ */ d.jsx(
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
const Py = {
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
}, Fy = {
  create(e) {
    const n = new AudioWorkletNode(e, "add-processor", {
      numberOfInputs: 2,
      numberOfOutputs: 1,
      outputChannelCount: [1]
    }), o = e.createGain();
    o.gain.value = 1;
    const s = e.createGain();
    return s.gain.value = 1, o.connect(n, 0, 0), s.connect(n, 0, 1), {
      inputs: { a: o, b: s },
      outputs: { out: n },
      setParameter() {
      },
      dispose() {
        o.disconnect(), s.disconnect(), n.disconnect();
      }
    };
  }
};
function Vy() {
  return /* @__PURE__ */ d.jsxs("div", { className: "daw-node daw-node--atomic", style: { minWidth: 60 }, children: [
    /* @__PURE__ */ d.jsx(
      oe,
      {
        type: "target",
        position: Q.Left,
        id: "a",
        className: "daw-handle daw-handle--audio daw-handle--pos-1of2"
      }
    ),
    /* @__PURE__ */ d.jsx(
      oe,
      {
        type: "target",
        position: Q.Left,
        id: "b",
        className: "daw-handle daw-handle--audio daw-handle--pos-2of2"
      }
    ),
    /* @__PURE__ */ d.jsx("div", { className: "daw-node__header", children: /* @__PURE__ */ d.jsx("span", { children: "Add" }) }),
    /* @__PURE__ */ d.jsx("div", { className: "daw-node__body daw-node__symbol", children: "+" }),
    /* @__PURE__ */ d.jsx(
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
const zy = {
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
}, Oy = {
  create(e) {
    const n = new AudioWorkletNode(e, "subtract-processor", {
      numberOfInputs: 2,
      numberOfOutputs: 1,
      outputChannelCount: [1]
    }), o = e.createGain();
    o.gain.value = 1;
    const s = e.createGain();
    return s.gain.value = 1, o.connect(n, 0, 0), s.connect(n, 0, 1), {
      inputs: { a: o, b: s },
      outputs: { out: n },
      setParameter() {
      },
      dispose() {
        o.disconnect(), s.disconnect(), n.disconnect();
      }
    };
  }
};
function Ly() {
  return /* @__PURE__ */ d.jsxs("div", { className: "daw-node daw-node--atomic", style: { minWidth: 60 }, children: [
    /* @__PURE__ */ d.jsx(
      oe,
      {
        type: "target",
        position: Q.Left,
        id: "a",
        className: "daw-handle daw-handle--audio daw-handle--pos-1of2"
      }
    ),
    /* @__PURE__ */ d.jsx(
      oe,
      {
        type: "target",
        position: Q.Left,
        id: "b",
        className: "daw-handle daw-handle--audio daw-handle--pos-2of2"
      }
    ),
    /* @__PURE__ */ d.jsx("div", { className: "daw-node__header", children: /* @__PURE__ */ d.jsx("span", { children: "Subtract" }) }),
    /* @__PURE__ */ d.jsx("div", { className: "daw-node__body daw-node__symbol", children: "−" }),
    /* @__PURE__ */ d.jsx(
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
const Hy = {
  type: "atomic-abs",
  label: "Abs",
  category: "atomic",
  ports: [
    { id: "in", label: "In", direction: "input", signalType: "audio", channelFormat: "mono" },
    { id: "out", label: "Out", direction: "output", signalType: "audio", channelFormat: "mono" }
  ],
  parameters: [],
  composition: { level: 3, isAtomic: !0 }
}, Wy = {
  create(e) {
    const n = new AudioWorkletNode(e, "abs-processor", {
      numberOfInputs: 1,
      numberOfOutputs: 1,
      outputChannelCount: [1]
    });
    return {
      inputs: { in: n },
      outputs: { out: n },
      setParameter() {
      },
      dispose() {
        n.disconnect();
      }
    };
  }
};
function Xy() {
  return /* @__PURE__ */ d.jsxs("div", { className: "daw-node daw-node--atomic", style: { minWidth: 60 }, children: [
    /* @__PURE__ */ d.jsx(
      oe,
      {
        type: "target",
        position: Q.Left,
        id: "in",
        className: "daw-handle daw-handle--audio"
      }
    ),
    /* @__PURE__ */ d.jsx("div", { className: "daw-node__header", children: /* @__PURE__ */ d.jsx("span", { children: "Abs" }) }),
    /* @__PURE__ */ d.jsx("div", { className: "daw-node__body daw-node__symbol", children: "|x|" }),
    /* @__PURE__ */ d.jsx(
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
}, Zy = {
  create(e, n) {
    const o = new AudioWorkletNode(e, "constant-processor", {
      numberOfInputs: 0,
      numberOfOutputs: 1,
      outputChannelCount: [1],
      parameterData: { value: n.value ?? 0 }
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
function Yy({ id: e, data: n }) {
  const o = de((i) => i.updateParameter), s = n.parameters.value ?? 0;
  return /* @__PURE__ */ d.jsxs("div", { className: "daw-node daw-node--atomic", style: { minWidth: 80 }, children: [
    /* @__PURE__ */ d.jsx("div", { className: "daw-node__header", children: /* @__PURE__ */ d.jsx("span", { children: "Const" }) }),
    /* @__PURE__ */ d.jsx("div", { className: "daw-node__body nodrag nowheel", children: /* @__PURE__ */ d.jsxs("label", { className: "daw-node__param", children: [
      /* @__PURE__ */ d.jsx(
        we,
        {
          min: -1e3,
          max: 1e3,
          step: 0.01,
          value: s,
          onChange: (i) => o(e, "value", i)
        }
      ),
      /* @__PURE__ */ d.jsx("span", { className: "daw-node__param-value", children: s.toFixed(2) })
    ] }) }),
    /* @__PURE__ */ d.jsx(
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
}, $y = {
  create(e) {
    const n = new AudioWorkletNode(e, "max-processor", {
      numberOfInputs: 2,
      numberOfOutputs: 1,
      outputChannelCount: [1]
    }), o = e.createGain();
    o.gain.value = 1;
    const s = e.createGain();
    return s.gain.value = 1, o.connect(n, 0, 0), s.connect(n, 0, 1), {
      inputs: { a: o, b: s },
      outputs: { out: n },
      setParameter() {
      },
      dispose() {
        o.disconnect(), s.disconnect(), n.disconnect();
      }
    };
  }
};
function Qy() {
  return /* @__PURE__ */ d.jsxs("div", { className: "daw-node daw-node--atomic", style: { minWidth: 60 }, children: [
    /* @__PURE__ */ d.jsx(
      oe,
      {
        type: "target",
        position: Q.Left,
        id: "a",
        className: "daw-handle daw-handle--audio daw-handle--pos-1of2"
      }
    ),
    /* @__PURE__ */ d.jsx(
      oe,
      {
        type: "target",
        position: Q.Left,
        id: "b",
        className: "daw-handle daw-handle--audio daw-handle--pos-2of2"
      }
    ),
    /* @__PURE__ */ d.jsx("div", { className: "daw-node__header", children: /* @__PURE__ */ d.jsx("span", { children: "Max" }) }),
    /* @__PURE__ */ d.jsx("div", { className: "daw-node__body daw-node__symbol", children: "max" }),
    /* @__PURE__ */ d.jsx(
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
  type: "atomic-unit-delay",
  label: "Unit Delay",
  category: "atomic",
  ports: [
    { id: "in", label: "In", direction: "input", signalType: "audio", channelFormat: "mono" },
    { id: "out", label: "Out", direction: "output", signalType: "audio", channelFormat: "mono" }
  ],
  parameters: [],
  composition: { level: 3, isAtomic: !0 }
}, qy = {
  create(e) {
    const n = new AudioWorkletNode(e, "unit-delay-processor", {
      numberOfInputs: 1,
      numberOfOutputs: 1,
      outputChannelCount: [1]
    });
    return {
      inputs: { in: n },
      outputs: { out: n },
      setParameter() {
      },
      dispose() {
        n.disconnect();
      }
    };
  }
};
function ew() {
  return /* @__PURE__ */ d.jsxs("div", { className: "daw-node daw-node--atomic", style: { minWidth: 60 }, children: [
    /* @__PURE__ */ d.jsx(
      oe,
      {
        type: "target",
        position: Q.Left,
        id: "in",
        className: "daw-handle daw-handle--audio"
      }
    ),
    /* @__PURE__ */ d.jsx("div", { className: "daw-node__header", children: /* @__PURE__ */ d.jsx("span", { children: "Delay" }) }),
    /* @__PURE__ */ d.jsx("div", { className: "daw-node__body daw-node__symbol", children: "z⁻¹" }),
    /* @__PURE__ */ d.jsx(
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
}, nw = {
  create(e) {
    const n = new AudioWorkletNode(e, "selector-processor", {
      numberOfInputs: 3,
      numberOfOutputs: 1,
      outputChannelCount: [1]
    }), o = e.createGain();
    o.gain.value = 1;
    const s = e.createGain();
    s.gain.value = 1;
    const i = e.createGain();
    return i.gain.value = 1, o.connect(n, 0, 0), s.connect(n, 0, 1), i.connect(n, 0, 2), {
      inputs: { a: o, b: s, ctrl: i },
      outputs: { out: n },
      setParameter() {
      },
      dispose() {
        o.disconnect(), s.disconnect(), i.disconnect(), n.disconnect();
      }
    };
  }
};
function rw() {
  return /* @__PURE__ */ d.jsxs("div", { className: "daw-node daw-node--atomic", style: { minWidth: 60 }, children: [
    /* @__PURE__ */ d.jsx(
      oe,
      {
        type: "target",
        position: Q.Left,
        id: "a",
        className: "daw-handle daw-handle--audio daw-handle--pos-1of3"
      }
    ),
    /* @__PURE__ */ d.jsx(
      oe,
      {
        type: "target",
        position: Q.Left,
        id: "b",
        className: "daw-handle daw-handle--audio daw-handle--pos-2of3"
      }
    ),
    /* @__PURE__ */ d.jsx(
      oe,
      {
        type: "target",
        position: Q.Bottom,
        id: "ctrl",
        className: "daw-handle daw-handle--audio daw-handle--pos-3of3"
      }
    ),
    /* @__PURE__ */ d.jsx("div", { className: "daw-node__header", children: /* @__PURE__ */ d.jsx("span", { children: "Select" }) }),
    /* @__PURE__ */ d.jsx("div", { className: "daw-node__body daw-node__symbol", children: "A|B" }),
    /* @__PURE__ */ d.jsx(
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
  type: "atomic-db-to-lin",
  label: "dB→Lin",
  category: "atomic",
  ports: [
    { id: "in", label: "In", direction: "input", signalType: "audio", channelFormat: "mono" },
    { id: "out", label: "Out", direction: "output", signalType: "audio", channelFormat: "mono" }
  ],
  parameters: [],
  composition: { level: 3, isAtomic: !0 }
}, aw = {
  create(e) {
    const n = new AudioWorkletNode(e, "db-to-lin-processor", {
      numberOfInputs: 1,
      numberOfOutputs: 1,
      outputChannelCount: [1]
    });
    return {
      inputs: { in: n },
      outputs: { out: n },
      setParameter() {
      },
      dispose() {
        n.disconnect();
      }
    };
  }
};
function sw() {
  return /* @__PURE__ */ d.jsxs("div", { className: "daw-node daw-node--atomic", style: { minWidth: 70 }, children: [
    /* @__PURE__ */ d.jsx(
      oe,
      {
        type: "target",
        position: Q.Left,
        id: "in",
        className: "daw-handle daw-handle--audio"
      }
    ),
    /* @__PURE__ */ d.jsx("div", { className: "daw-node__header", children: /* @__PURE__ */ d.jsx("span", { children: "dB→Lin" }) }),
    /* @__PURE__ */ d.jsxs("div", { className: "daw-node__body daw-node__symbol", children: [
      "10",
      /* @__PURE__ */ d.jsx("sup", { children: "x/20" })
    ] }),
    /* @__PURE__ */ d.jsx(
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
const iw = {
  type: "atomic-lin-to-db",
  label: "Lin→dB",
  category: "atomic",
  ports: [
    { id: "in", label: "In", direction: "input", signalType: "audio", channelFormat: "mono" },
    { id: "out", label: "Out", direction: "output", signalType: "audio", channelFormat: "mono" }
  ],
  parameters: [],
  composition: { level: 3, isAtomic: !0 }
}, lw = {
  create(e) {
    const n = new AudioWorkletNode(e, "lin-to-db-processor", {
      numberOfInputs: 1,
      numberOfOutputs: 1,
      outputChannelCount: [1]
    });
    return {
      inputs: { in: n },
      outputs: { out: n },
      setParameter() {
      },
      dispose() {
        n.disconnect();
      }
    };
  }
};
function cw() {
  return /* @__PURE__ */ d.jsxs("div", { className: "daw-node daw-node--atomic", style: { minWidth: 70 }, children: [
    /* @__PURE__ */ d.jsx(
      oe,
      {
        type: "target",
        position: Q.Left,
        id: "in",
        className: "daw-handle daw-handle--audio"
      }
    ),
    /* @__PURE__ */ d.jsx("div", { className: "daw-node__header", children: /* @__PURE__ */ d.jsx("span", { children: "Lin→dB" }) }),
    /* @__PURE__ */ d.jsx("div", { className: "daw-node__body daw-node__symbol", children: "20log" }),
    /* @__PURE__ */ d.jsx(
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
const uw = {
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
}, dw = {
  create(e) {
    const n = new AudioWorkletNode(e, "compare-gt-processor", {
      numberOfInputs: 2,
      numberOfOutputs: 1,
      outputChannelCount: [1]
    }), o = e.createGain();
    o.gain.value = 1;
    const s = e.createGain();
    return s.gain.value = 1, o.connect(n, 0, 0), s.connect(n, 0, 1), {
      inputs: { a: o, b: s },
      outputs: { out: n },
      setParameter() {
      },
      dispose() {
        o.disconnect(), s.disconnect(), n.disconnect();
      }
    };
  }
};
function fw() {
  return /* @__PURE__ */ d.jsxs("div", { className: "daw-node daw-node--atomic", style: { minWidth: 60 }, children: [
    /* @__PURE__ */ d.jsx(
      oe,
      {
        type: "target",
        position: Q.Left,
        id: "a",
        className: "daw-handle daw-handle--audio daw-handle--pos-1of2"
      }
    ),
    /* @__PURE__ */ d.jsx(
      oe,
      {
        type: "target",
        position: Q.Left,
        id: "b",
        className: "daw-handle daw-handle--audio daw-handle--pos-2of2"
      }
    ),
    /* @__PURE__ */ d.jsx("div", { className: "daw-node__header", children: /* @__PURE__ */ d.jsx("span", { children: "A > B" }) }),
    /* @__PURE__ */ d.jsx("div", { className: "daw-node__body daw-node__symbol", children: ">" }),
    /* @__PURE__ */ d.jsx(
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
const pw = {
  type: "atomic-probe",
  label: "Probe",
  category: "atomic",
  ports: [
    { id: "in", label: "In", direction: "input", signalType: "audio", channelFormat: "mono" },
    { id: "out", label: "Out", direction: "output", signalType: "audio", channelFormat: "mono" }
  ],
  parameters: [],
  composition: { level: 3, isAtomic: !0 }
}, gw = {
  create(e) {
    const n = new AudioWorkletNode(e, "probe-processor", {
      numberOfInputs: 1,
      numberOfOutputs: 1,
      outputChannelCount: [1]
    });
    return {
      inputs: { in: n },
      outputs: { out: n },
      setParameter() {
      },
      dispose() {
        n.disconnect();
      }
    };
  }
};
function mw() {
  return /* @__PURE__ */ d.jsxs("div", { className: "daw-node daw-node--atomic", style: { minWidth: 60 }, children: [
    /* @__PURE__ */ d.jsx(
      oe,
      {
        type: "target",
        position: Q.Left,
        id: "in",
        className: "daw-handle daw-handle--audio"
      }
    ),
    /* @__PURE__ */ d.jsx("div", { className: "daw-node__header", children: /* @__PURE__ */ d.jsx("span", { children: "Probe" }) }),
    /* @__PURE__ */ d.jsx("div", { className: "daw-node__body daw-node__symbol", children: "~" }),
    /* @__PURE__ */ d.jsx(
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
const hw = {
  type: "metronome",
  label: "Metronome",
  category: "generator",
  soloSafe: !0,
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
      id: "volume",
      label: "Volume",
      min: -70,
      max: 0,
      defaultValue: -12,
      step: 0.1,
      unit: "dB",
      mapping: "linear"
    },
    {
      id: "enabled",
      label: "Enabled",
      min: 0,
      max: 1,
      defaultValue: 1,
      step: 1,
      mapping: "linear"
    },
    {
      id: "accent",
      label: "Accent",
      min: 0,
      max: 1,
      defaultValue: 1,
      step: 1,
      mapping: "linear"
    }
  ]
}, yw = {
  create(e, n) {
    const o = e.createGain();
    o.gain.value = kt(n.volume ?? -12);
    const s = e.createGain();
    s.gain.value = (n.enabled ?? 1) >= 0.5 ? 1 : 0, s.connect(o);
    let i = null, l = 0, c = 0, u = (n.accent ?? 1) >= 0.5;
    const p = 0.1, g = 25;
    function m(x, I) {
      const b = I && u ? 1500 : 1e3, _ = e.createOscillator(), k = e.createGain();
      _.frequency.value = b, _.type = "sine", _.connect(k), k.connect(s), k.gain.setValueAtTime(1, x), k.gain.exponentialRampToValueAtTime(1e-3, x + 0.02), _.start(x), _.stop(x + 0.03);
    }
    function h() {
      const I = 60 / Ge.getState().bpm;
      for (; l < e.currentTime + p; ) {
        const b = c % 4 === 0;
        m(l, b), l += I, c++;
      }
    }
    function w(x, I) {
      C();
      const _ = 60 / Ge.getState().bpm, k = Math.floor(I / _), S = (k + 1) * _ - I;
      c = k + 1, l = x + S, S < 5e-3 && (c = k, l = x), i = setInterval(h, g), h();
    }
    function C() {
      i !== null && (clearInterval(i), i = null);
    }
    return {
      inputs: {},
      outputs: { out: o },
      setParameter(x, I, b) {
        x === "volume" ? o.gain.setTargetAtTime(kt(I), b, 0.02) : x === "enabled" ? s.gain.setTargetAtTime(I >= 0.5 ? 1 : 0, b, 0.02) : x === "accent" && (u = I >= 0.5);
      },
      schedulePlayback: w,
      stopPlayback: C,
      dispose() {
        C(), s.disconnect(), o.disconnect();
      }
    };
  }
};
function ww({ id: e, data: n }) {
  const o = de((h) => h.updateParameter), s = de((h) => h.toggleMute), i = de((h) => h.toggleSolo), c = jn().get(e) ?? !1, u = n.parameters.volume ?? -12, p = (n.parameters.enabled ?? 1) >= 0.5, g = (n.parameters.accent ?? 1) >= 0.5, m = [
    "daw-node daw-node--generator",
    c ? "daw-node--dimmed" : "",
    n.soloed ? "daw-node--soloed" : ""
  ].join(" ");
  return /* @__PURE__ */ d.jsxs("div", { className: m, children: [
    /* @__PURE__ */ d.jsxs("div", { className: "daw-node__header", children: [
      /* @__PURE__ */ d.jsx("span", { children: "Metronome" }),
      /* @__PURE__ */ d.jsxs("div", { className: "daw-node__sm-buttons", children: [
        /* @__PURE__ */ d.jsx(
          "button",
          {
            className: `daw-node__sm-btn daw-node__sm-btn--solo ${n.soloed ? "active" : ""}`,
            onClick: (h) => {
              h.stopPropagation(), i(e, !h.shiftKey);
            },
            title: "Solo (Shift+click for additive)",
            children: "S"
          }
        ),
        /* @__PURE__ */ d.jsx(
          "button",
          {
            className: `daw-node__sm-btn daw-node__sm-btn--mute ${n.muted ? "active" : ""}`,
            onClick: (h) => {
              h.stopPropagation(), s(e);
            },
            title: "Mute",
            children: "M"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ d.jsxs("div", { className: "daw-node__body nodrag nowheel", children: [
      /* @__PURE__ */ d.jsxs("div", { className: "daw-node__param", children: [
        /* @__PURE__ */ d.jsx("span", { className: "daw-node__param-label", children: "Click" }),
        /* @__PURE__ */ d.jsx(
          "button",
          {
            className: `daw-node__toggle-btn ${p ? "active" : ""}`,
            onClick: () => o(e, "enabled", p ? 0 : 1),
            children: p ? "On" : "Off"
          }
        )
      ] }),
      /* @__PURE__ */ d.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ d.jsx("span", { className: "daw-node__param-label", children: "Vol" }),
        /* @__PURE__ */ d.jsx(
          we,
          {
            min: -70,
            max: 0,
            step: 0.1,
            value: u,
            onChange: (h) => o(e, "volume", h)
          }
        ),
        /* @__PURE__ */ d.jsxs("span", { className: "daw-node__param-value", children: [
          Math.round(u),
          " dB"
        ] })
      ] }),
      /* @__PURE__ */ d.jsxs("div", { className: "daw-node__param", children: [
        /* @__PURE__ */ d.jsx("span", { className: "daw-node__param-label", children: "Accent" }),
        /* @__PURE__ */ d.jsx(
          "button",
          {
            className: `daw-node__toggle-btn ${g ? "active" : ""}`,
            onClick: () => o(e, "accent", g ? 0 : 1),
            children: g ? "Beat 1" : "Off"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ d.jsx(oe, { type: "source", position: Q.Right, id: "out", className: "daw-handle daw-handle--audio" })
  ] });
}
function vw() {
  Se({
    manifest: Fh,
    factory: Vh,
    component: zh
  }), Se({
    manifest: Oh,
    factory: Lh,
    component: Hh
  }), Se({
    manifest: Wh,
    factory: Xh,
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
    manifest: d0,
    factory: f0,
    component: p0
  }), Se({
    manifest: g0,
    factory: m0,
    component: h0
  }), Se({
    manifest: y0,
    factory: w0,
    component: v0
  }), Se({
    manifest: Ku,
    factory: x0,
    component: I0
  }), Se({
    manifest: C0,
    factory: b0,
    component: _0
  }), Se({
    manifest: N0,
    factory: A0,
    component: S0
  }), Se({
    manifest: k0,
    factory: j0,
    component: M0
  }), Se({
    manifest: R0,
    factory: T0,
    component: B0
  }), Se({
    manifest: E0,
    factory: D0,
    component: G0
  }), Se({
    manifest: P0,
    factory: F0,
    component: V0
  }), Se({
    manifest: z0,
    factory: O0,
    component: L0
  }), Se({
    manifest: H0,
    factory: W0,
    component: X0
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
  }), Se({
    manifest: hy,
    factory: yy,
    component: wy
  }), Se({
    manifest: vy,
    factory: xy,
    component: Iy
  }), Se({
    manifest: Cy,
    factory: by,
    component: _y
  }), Se({
    manifest: hw,
    factory: yw,
    component: ww
  }), Se({ manifest: Ny, factory: Ay, component: Sy }), Se({ manifest: ky, factory: jy, component: My }), Se({ manifest: Ry, factory: Ty, component: By }), Se({ manifest: Ey, factory: Dy, component: Gy }), Se({ manifest: Py, factory: Fy, component: Vy }), Se({ manifest: zy, factory: Oy, component: Ly }), Se({ manifest: Hy, factory: Wy, component: Xy }), Se({ manifest: Ky, factory: Zy, component: Yy }), Se({ manifest: Uy, factory: $y, component: Qy }), Se({ manifest: Jy, factory: qy, component: ew }), Se({ manifest: tw, factory: nw, component: rw }), Se({ manifest: ow, factory: aw, component: sw }), Se({ manifest: iw, factory: lw, component: cw }), Se({ manifest: uw, factory: dw, component: fw }), Se({ manifest: pw, factory: gw, component: mw });
}
const xw = {
  "master-output": { manifest: Fh, factory: Vh, component: zh },
  "test-tone": { manifest: Oh, factory: Lh, component: Hh },
  gain: { manifest: Wh, factory: Xh, component: Kh },
  track: { manifest: Zh, factory: Yh, component: Uh },
  delay: { manifest: $h, factory: Qh, component: Jh },
  reverb: { manifest: qh, factory: e0, component: t0 },
  eq: { manifest: n0, factory: r0, component: o0 },
  splitter: { manifest: a0, factory: s0, component: i0 },
  merger: { manifest: l0, factory: c0, component: u0 },
  mixer: { manifest: d0, factory: f0, component: p0 },
  "level-meter": { manifest: g0, factory: m0, component: h0 },
  "spectrum-analyzer": { manifest: y0, factory: w0, component: v0 },
  compressor: { manifest: Ku, factory: x0, component: I0 },
  limiter: { manifest: C0, factory: b0, component: _0 },
  gate: { manifest: N0, factory: A0, component: S0 },
  expander: { manifest: k0, factory: j0, component: M0 },
  "de-esser": { manifest: R0, factory: T0, component: B0 },
  filter: { manifest: E0, factory: D0, component: G0 },
  chorus: { manifest: P0, factory: F0, component: V0 },
  flanger: { manifest: z0, factory: O0, component: L0 },
  phaser: { manifest: H0, factory: W0, component: X0 },
  waveshaper: { manifest: K0, factory: Z0, component: Y0 },
  bitcrusher: { manifest: U0, factory: $0, component: Q0 },
  "tape-saturation": { manifest: J0, factory: q0, component: ey },
  pan: { manifest: ty, factory: ny, component: ry },
  "mono-sum": { manifest: oy, factory: ay, component: sy },
  "phase-invert": { manifest: iy, factory: ly, component: cy },
  "dc-offset": { manifest: uy, factory: dy, component: fy },
  "ab-compare": { manifest: py, factory: gy, component: my },
  oscilloscope: { manifest: hy, factory: yy, component: wy },
  "correlation-meter": { manifest: vy, factory: xy, component: Iy },
  "loudness-meter": { manifest: Cy, factory: by, component: _y },
  metronome: { manifest: hw, factory: yw, component: ww },
  "port-node": { manifest: Ny, factory: Ay, component: Sy },
  "envelope-detector": { manifest: ky, factory: jy, component: My },
  "gain-computer": { manifest: Ry, factory: Ty, component: By },
  "atomic-multiply": { manifest: Ey, factory: Dy, component: Gy },
  "atomic-add": { manifest: Py, factory: Fy, component: Vy },
  "atomic-subtract": { manifest: zy, factory: Oy, component: Ly },
  "atomic-abs": { manifest: Hy, factory: Wy, component: Xy },
  "atomic-constant": { manifest: Ky, factory: Zy, component: Yy },
  "atomic-max": { manifest: Uy, factory: $y, component: Qy },
  "atomic-unit-delay": { manifest: Jy, factory: qy, component: ew },
  "atomic-selector": { manifest: tw, factory: nw, component: rw },
  "atomic-db-to-lin": { manifest: ow, factory: aw, component: sw },
  "atomic-lin-to-db": { manifest: iw, factory: lw, component: cw },
  "atomic-compare-gt": { manifest: uw, factory: dw, component: fw },
  "atomic-probe": { manifest: pw, factory: gw, component: mw }
};
function MA(e) {
  var o;
  const n = new Set(e);
  n.add("port-node");
  for (const s of n) {
    const i = xw[s];
    if ((o = i == null ? void 0 : i.manifest.composition) != null && o.internalGraph)
      for (const l of i.manifest.composition.internalGraph.nodes)
        n.add(l.moduleType);
  }
  return Array.from(n);
}
function RA(e) {
  const n = MA(e);
  for (const o of n) {
    const s = xw[o];
    s ? Se(s) : console.warn(`registerModules: unknown module type "${o}"`);
  }
}
function TA({ title: e, subtitle: n, initialPatch: o, allowedModules: s }) {
  return j.useEffect(() => {
    const { nodes: i, addModule: l, loadPatch: c } = de.getState();
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
        const m = u.find((C) => C.id === g.source), w = ct(m.type).ports.find((C) => C.id === g.sourceHandle);
        if (!w)
          throw new Error(`Port "${g.sourceHandle}" not found on module "${m.type}"`);
        return {
          id: ft(),
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
  }, []), /* @__PURE__ */ d.jsx(Hu, { children: /* @__PURE__ */ d.jsxs("div", { className: "daw-app", children: [
    (e || n) && /* @__PURE__ */ d.jsxs("div", { className: "daw-header", children: [
      e && /* @__PURE__ */ d.jsx("h1", { className: "daw-title", children: e }),
      n && /* @__PURE__ */ d.jsx("p", { className: "daw-subtitle", children: n })
    ] }),
    /* @__PURE__ */ d.jsx(Ph, { allowedModules: s })
  ] }) });
}
function EA(e) {
  const n = typeof e.container == "string" ? document.querySelector(e.container) : e.container;
  if (!n) throw new Error(`Container not found: ${e.container}`);
  if (v2(), e.modules) {
    const s = e.modules.includes("master-output") ? e.modules : [...e.modules, "master-output"];
    RA(s);
  } else
    vw();
  const o = Lg.createRoot(n);
  return o.render(
    _n.createElement(
      _n.StrictMode,
      null,
      _n.createElement(TA, {
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
const zg = document.getElementById("root");
zg && (vw(), Lg.createRoot(zg).render(
  /* @__PURE__ */ d.jsx(_n.StrictMode, { children: /* @__PURE__ */ d.jsx(vA, {}) })
));
export {
  EA as createDawInstance
};
