var k0 = Object.defineProperty;
var N0 = (t, r, i) => r in t ? k0(t, r, { enumerable: !0, configurable: !0, writable: !0, value: i }) : t[r] = i;
var br = (t, r, i) => N0(t, typeof r != "symbol" ? r + "" : r, i);
function Za(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var va = { exports: {} }, ei = {}, wa = { exports: {} }, ke = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Hd;
function C0() {
  if (Hd) return ke;
  Hd = 1;
  var t = Symbol.for("react.element"), r = Symbol.for("react.portal"), i = Symbol.for("react.fragment"), l = Symbol.for("react.strict_mode"), u = Symbol.for("react.profiler"), a = Symbol.for("react.provider"), f = Symbol.for("react.context"), h = Symbol.for("react.forward_ref"), p = Symbol.for("react.suspense"), m = Symbol.for("react.memo"), v = Symbol.for("react.lazy"), g = Symbol.iterator;
  function y(C) {
    return C === null || typeof C != "object" ? null : (C = g && C[g] || C["@@iterator"], typeof C == "function" ? C : null);
  }
  var x = { isMounted: function() {
    return !1;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, S = Object.assign, N = {};
  function k(C, R, te) {
    this.props = C, this.context = R, this.refs = N, this.updater = te || x;
  }
  k.prototype.isReactComponent = {}, k.prototype.setState = function(C, R) {
    if (typeof C != "object" && typeof C != "function" && C != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, C, R, "setState");
  }, k.prototype.forceUpdate = function(C) {
    this.updater.enqueueForceUpdate(this, C, "forceUpdate");
  };
  function E() {
  }
  E.prototype = k.prototype;
  function A(C, R, te) {
    this.props = C, this.context = R, this.refs = N, this.updater = te || x;
  }
  var _ = A.prototype = new E();
  _.constructor = A, S(_, k.prototype), _.isPureReactComponent = !0;
  var M = Array.isArray, O = Object.prototype.hasOwnProperty, j = { current: null }, H = { key: !0, ref: !0, __self: !0, __source: !0 };
  function G(C, R, te) {
    var ee, le = {}, ue = null, ae = null;
    if (R != null) for (ee in R.ref !== void 0 && (ae = R.ref), R.key !== void 0 && (ue = "" + R.key), R) O.call(R, ee) && !H.hasOwnProperty(ee) && (le[ee] = R[ee]);
    var J = arguments.length - 2;
    if (J === 1) le.children = te;
    else if (1 < J) {
      for (var ce = Array(J), xe = 0; xe < J; xe++) ce[xe] = arguments[xe + 2];
      le.children = ce;
    }
    if (C && C.defaultProps) for (ee in J = C.defaultProps, J) le[ee] === void 0 && (le[ee] = J[ee]);
    return { $$typeof: t, type: C, key: ue, ref: ae, props: le, _owner: j.current };
  }
  function K(C, R) {
    return { $$typeof: t, type: C.type, key: R, ref: C.ref, props: C.props, _owner: C._owner };
  }
  function ie(C) {
    return typeof C == "object" && C !== null && C.$$typeof === t;
  }
  function X(C) {
    var R = { "=": "=0", ":": "=2" };
    return "$" + C.replace(/[=:]/g, function(te) {
      return R[te];
    });
  }
  var b = /\/+/g;
  function Z(C, R) {
    return typeof C == "object" && C !== null && C.key != null ? X("" + C.key) : R.toString(36);
  }
  function z(C, R, te, ee, le) {
    var ue = typeof C;
    (ue === "undefined" || ue === "boolean") && (C = null);
    var ae = !1;
    if (C === null) ae = !0;
    else switch (ue) {
      case "string":
      case "number":
        ae = !0;
        break;
      case "object":
        switch (C.$$typeof) {
          case t:
          case r:
            ae = !0;
        }
    }
    if (ae) return ae = C, le = le(ae), C = ee === "" ? "." + Z(ae, 0) : ee, M(le) ? (te = "", C != null && (te = C.replace(b, "$&/") + "/"), z(le, R, te, "", function(xe) {
      return xe;
    })) : le != null && (ie(le) && (le = K(le, te + (!le.key || ae && ae.key === le.key ? "" : ("" + le.key).replace(b, "$&/") + "/") + C)), R.push(le)), 1;
    if (ae = 0, ee = ee === "" ? "." : ee + ":", M(C)) for (var J = 0; J < C.length; J++) {
      ue = C[J];
      var ce = ee + Z(ue, J);
      ae += z(ue, R, te, ce, le);
    }
    else if (ce = y(C), typeof ce == "function") for (C = ce.call(C), J = 0; !(ue = C.next()).done; ) ue = ue.value, ce = ee + Z(ue, J++), ae += z(ue, R, te, ce, le);
    else if (ue === "object") throw R = String(C), Error("Objects are not valid as a React child (found: " + (R === "[object Object]" ? "object with keys {" + Object.keys(C).join(", ") + "}" : R) + "). If you meant to render a collection of children, use an array instead.");
    return ae;
  }
  function Y(C, R, te) {
    if (C == null) return C;
    var ee = [], le = 0;
    return z(C, ee, "", "", function(ue) {
      return R.call(te, ue, le++);
    }), ee;
  }
  function F(C) {
    if (C._status === -1) {
      var R = C._result;
      R = R(), R.then(function(te) {
        (C._status === 0 || C._status === -1) && (C._status = 1, C._result = te);
      }, function(te) {
        (C._status === 0 || C._status === -1) && (C._status = 2, C._result = te);
      }), C._status === -1 && (C._status = 0, C._result = R);
    }
    if (C._status === 1) return C._result.default;
    throw C._result;
  }
  var U = { current: null }, T = { transition: null }, I = { ReactCurrentDispatcher: U, ReactCurrentBatchConfig: T, ReactCurrentOwner: j };
  function V() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  return ke.Children = { map: Y, forEach: function(C, R, te) {
    Y(C, function() {
      R.apply(this, arguments);
    }, te);
  }, count: function(C) {
    var R = 0;
    return Y(C, function() {
      R++;
    }), R;
  }, toArray: function(C) {
    return Y(C, function(R) {
      return R;
    }) || [];
  }, only: function(C) {
    if (!ie(C)) throw Error("React.Children.only expected to receive a single React element child.");
    return C;
  } }, ke.Component = k, ke.Fragment = i, ke.Profiler = u, ke.PureComponent = A, ke.StrictMode = l, ke.Suspense = p, ke.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = I, ke.act = V, ke.cloneElement = function(C, R, te) {
    if (C == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + C + ".");
    var ee = S({}, C.props), le = C.key, ue = C.ref, ae = C._owner;
    if (R != null) {
      if (R.ref !== void 0 && (ue = R.ref, ae = j.current), R.key !== void 0 && (le = "" + R.key), C.type && C.type.defaultProps) var J = C.type.defaultProps;
      for (ce in R) O.call(R, ce) && !H.hasOwnProperty(ce) && (ee[ce] = R[ce] === void 0 && J !== void 0 ? J[ce] : R[ce]);
    }
    var ce = arguments.length - 2;
    if (ce === 1) ee.children = te;
    else if (1 < ce) {
      J = Array(ce);
      for (var xe = 0; xe < ce; xe++) J[xe] = arguments[xe + 2];
      ee.children = J;
    }
    return { $$typeof: t, type: C.type, key: le, ref: ue, props: ee, _owner: ae };
  }, ke.createContext = function(C) {
    return C = { $$typeof: f, _currentValue: C, _currentValue2: C, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, C.Provider = { $$typeof: a, _context: C }, C.Consumer = C;
  }, ke.createElement = G, ke.createFactory = function(C) {
    var R = G.bind(null, C);
    return R.type = C, R;
  }, ke.createRef = function() {
    return { current: null };
  }, ke.forwardRef = function(C) {
    return { $$typeof: h, render: C };
  }, ke.isValidElement = ie, ke.lazy = function(C) {
    return { $$typeof: v, _payload: { _status: -1, _result: C }, _init: F };
  }, ke.memo = function(C, R) {
    return { $$typeof: m, type: C, compare: R === void 0 ? null : R };
  }, ke.startTransition = function(C) {
    var R = T.transition;
    T.transition = {};
    try {
      C();
    } finally {
      T.transition = R;
    }
  }, ke.unstable_act = V, ke.useCallback = function(C, R) {
    return U.current.useCallback(C, R);
  }, ke.useContext = function(C) {
    return U.current.useContext(C);
  }, ke.useDebugValue = function() {
  }, ke.useDeferredValue = function(C) {
    return U.current.useDeferredValue(C);
  }, ke.useEffect = function(C, R) {
    return U.current.useEffect(C, R);
  }, ke.useId = function() {
    return U.current.useId();
  }, ke.useImperativeHandle = function(C, R, te) {
    return U.current.useImperativeHandle(C, R, te);
  }, ke.useInsertionEffect = function(C, R) {
    return U.current.useInsertionEffect(C, R);
  }, ke.useLayoutEffect = function(C, R) {
    return U.current.useLayoutEffect(C, R);
  }, ke.useMemo = function(C, R) {
    return U.current.useMemo(C, R);
  }, ke.useReducer = function(C, R, te) {
    return U.current.useReducer(C, R, te);
  }, ke.useRef = function(C) {
    return U.current.useRef(C);
  }, ke.useState = function(C) {
    return U.current.useState(C);
  }, ke.useSyncExternalStore = function(C, R, te) {
    return U.current.useSyncExternalStore(C, R, te);
  }, ke.useTransition = function() {
    return U.current.useTransition();
  }, ke.version = "18.3.1", ke;
}
var Vd;
function mi() {
  return Vd || (Vd = 1, wa.exports = C0()), wa.exports;
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
var Bd;
function M0() {
  if (Bd) return ei;
  Bd = 1;
  var t = mi(), r = Symbol.for("react.element"), i = Symbol.for("react.fragment"), l = Object.prototype.hasOwnProperty, u = t.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, a = { key: !0, ref: !0, __self: !0, __source: !0 };
  function f(h, p, m) {
    var v, g = {}, y = null, x = null;
    m !== void 0 && (y = "" + m), p.key !== void 0 && (y = "" + p.key), p.ref !== void 0 && (x = p.ref);
    for (v in p) l.call(p, v) && !a.hasOwnProperty(v) && (g[v] = p[v]);
    if (h && h.defaultProps) for (v in p = h.defaultProps, p) g[v] === void 0 && (g[v] = p[v]);
    return { $$typeof: r, type: h, key: y, ref: x, props: g, _owner: u.current };
  }
  return ei.Fragment = i, ei.jsx = f, ei.jsxs = f, ei;
}
var Ud;
function P0() {
  return Ud || (Ud = 1, va.exports = M0()), va.exports;
}
var D = P0(), q = mi();
const Gr = /* @__PURE__ */ Za(q);
var Bs = {}, xa = { exports: {} }, ct = {}, Sa = { exports: {} }, _a = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Wd;
function T0() {
  return Wd || (Wd = 1, (function(t) {
    function r(T, I) {
      var V = T.length;
      T.push(I);
      e: for (; 0 < V; ) {
        var C = V - 1 >>> 1, R = T[C];
        if (0 < u(R, I)) T[C] = I, T[V] = R, V = C;
        else break e;
      }
    }
    function i(T) {
      return T.length === 0 ? null : T[0];
    }
    function l(T) {
      if (T.length === 0) return null;
      var I = T[0], V = T.pop();
      if (V !== I) {
        T[0] = V;
        e: for (var C = 0, R = T.length, te = R >>> 1; C < te; ) {
          var ee = 2 * (C + 1) - 1, le = T[ee], ue = ee + 1, ae = T[ue];
          if (0 > u(le, V)) ue < R && 0 > u(ae, le) ? (T[C] = ae, T[ue] = V, C = ue) : (T[C] = le, T[ee] = V, C = ee);
          else if (ue < R && 0 > u(ae, V)) T[C] = ae, T[ue] = V, C = ue;
          else break e;
        }
      }
      return I;
    }
    function u(T, I) {
      var V = T.sortIndex - I.sortIndex;
      return V !== 0 ? V : T.id - I.id;
    }
    if (typeof performance == "object" && typeof performance.now == "function") {
      var a = performance;
      t.unstable_now = function() {
        return a.now();
      };
    } else {
      var f = Date, h = f.now();
      t.unstable_now = function() {
        return f.now() - h;
      };
    }
    var p = [], m = [], v = 1, g = null, y = 3, x = !1, S = !1, N = !1, k = typeof setTimeout == "function" ? setTimeout : null, E = typeof clearTimeout == "function" ? clearTimeout : null, A = typeof setImmediate < "u" ? setImmediate : null;
    typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function _(T) {
      for (var I = i(m); I !== null; ) {
        if (I.callback === null) l(m);
        else if (I.startTime <= T) l(m), I.sortIndex = I.expirationTime, r(p, I);
        else break;
        I = i(m);
      }
    }
    function M(T) {
      if (N = !1, _(T), !S) if (i(p) !== null) S = !0, F(O);
      else {
        var I = i(m);
        I !== null && U(M, I.startTime - T);
      }
    }
    function O(T, I) {
      S = !1, N && (N = !1, E(G), G = -1), x = !0;
      var V = y;
      try {
        for (_(I), g = i(p); g !== null && (!(g.expirationTime > I) || T && !X()); ) {
          var C = g.callback;
          if (typeof C == "function") {
            g.callback = null, y = g.priorityLevel;
            var R = C(g.expirationTime <= I);
            I = t.unstable_now(), typeof R == "function" ? g.callback = R : g === i(p) && l(p), _(I);
          } else l(p);
          g = i(p);
        }
        if (g !== null) var te = !0;
        else {
          var ee = i(m);
          ee !== null && U(M, ee.startTime - I), te = !1;
        }
        return te;
      } finally {
        g = null, y = V, x = !1;
      }
    }
    var j = !1, H = null, G = -1, K = 5, ie = -1;
    function X() {
      return !(t.unstable_now() - ie < K);
    }
    function b() {
      if (H !== null) {
        var T = t.unstable_now();
        ie = T;
        var I = !0;
        try {
          I = H(!0, T);
        } finally {
          I ? Z() : (j = !1, H = null);
        }
      } else j = !1;
    }
    var Z;
    if (typeof A == "function") Z = function() {
      A(b);
    };
    else if (typeof MessageChannel < "u") {
      var z = new MessageChannel(), Y = z.port2;
      z.port1.onmessage = b, Z = function() {
        Y.postMessage(null);
      };
    } else Z = function() {
      k(b, 0);
    };
    function F(T) {
      H = T, j || (j = !0, Z());
    }
    function U(T, I) {
      G = k(function() {
        T(t.unstable_now());
      }, I);
    }
    t.unstable_IdlePriority = 5, t.unstable_ImmediatePriority = 1, t.unstable_LowPriority = 4, t.unstable_NormalPriority = 3, t.unstable_Profiling = null, t.unstable_UserBlockingPriority = 2, t.unstable_cancelCallback = function(T) {
      T.callback = null;
    }, t.unstable_continueExecution = function() {
      S || x || (S = !0, F(O));
    }, t.unstable_forceFrameRate = function(T) {
      0 > T || 125 < T ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : K = 0 < T ? Math.floor(1e3 / T) : 5;
    }, t.unstable_getCurrentPriorityLevel = function() {
      return y;
    }, t.unstable_getFirstCallbackNode = function() {
      return i(p);
    }, t.unstable_next = function(T) {
      switch (y) {
        case 1:
        case 2:
        case 3:
          var I = 3;
          break;
        default:
          I = y;
      }
      var V = y;
      y = I;
      try {
        return T();
      } finally {
        y = V;
      }
    }, t.unstable_pauseExecution = function() {
    }, t.unstable_requestPaint = function() {
    }, t.unstable_runWithPriority = function(T, I) {
      switch (T) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          T = 3;
      }
      var V = y;
      y = T;
      try {
        return I();
      } finally {
        y = V;
      }
    }, t.unstable_scheduleCallback = function(T, I, V) {
      var C = t.unstable_now();
      switch (typeof V == "object" && V !== null ? (V = V.delay, V = typeof V == "number" && 0 < V ? C + V : C) : V = C, T) {
        case 1:
          var R = -1;
          break;
        case 2:
          R = 250;
          break;
        case 5:
          R = 1073741823;
          break;
        case 4:
          R = 1e4;
          break;
        default:
          R = 5e3;
      }
      return R = V + R, T = { id: v++, callback: I, priorityLevel: T, startTime: V, expirationTime: R, sortIndex: -1 }, V > C ? (T.sortIndex = V, r(m, T), i(p) === null && T === i(m) && (N ? (E(G), G = -1) : N = !0, U(M, V - C))) : (T.sortIndex = R, r(p, T), S || x || (S = !0, F(O))), T;
    }, t.unstable_shouldYield = X, t.unstable_wrapCallback = function(T) {
      var I = y;
      return function() {
        var V = y;
        y = I;
        try {
          return T.apply(this, arguments);
        } finally {
          y = V;
        }
      };
    };
  })(_a)), _a;
}
var Yd;
function z0() {
  return Yd || (Yd = 1, Sa.exports = T0()), Sa.exports;
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
var Xd;
function I0() {
  if (Xd) return ct;
  Xd = 1;
  var t = mi(), r = z0();
  function i(e) {
    for (var n = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, o = 1; o < arguments.length; o++) n += "&args[]=" + encodeURIComponent(arguments[o]);
    return "Minified React error #" + e + "; visit " + n + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var l = /* @__PURE__ */ new Set(), u = {};
  function a(e, n) {
    f(e, n), f(e + "Capture", n);
  }
  function f(e, n) {
    for (u[e] = n, e = 0; e < n.length; e++) l.add(n[e]);
  }
  var h = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), p = Object.prototype.hasOwnProperty, m = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, v = {}, g = {};
  function y(e) {
    return p.call(g, e) ? !0 : p.call(v, e) ? !1 : m.test(e) ? g[e] = !0 : (v[e] = !0, !1);
  }
  function x(e, n, o, s) {
    if (o !== null && o.type === 0) return !1;
    switch (typeof n) {
      case "function":
      case "symbol":
        return !0;
      case "boolean":
        return s ? !1 : o !== null ? !o.acceptsBooleans : (e = e.toLowerCase().slice(0, 5), e !== "data-" && e !== "aria-");
      default:
        return !1;
    }
  }
  function S(e, n, o, s) {
    if (n === null || typeof n > "u" || x(e, n, o, s)) return !0;
    if (s) return !1;
    if (o !== null) switch (o.type) {
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
  function N(e, n, o, s, c, d, w) {
    this.acceptsBooleans = n === 2 || n === 3 || n === 4, this.attributeName = s, this.attributeNamespace = c, this.mustUseProperty = o, this.propertyName = e, this.type = n, this.sanitizeURL = d, this.removeEmptyString = w;
  }
  var k = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e) {
    k[e] = new N(e, 0, !1, e, null, !1, !1);
  }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(e) {
    var n = e[0];
    k[n] = new N(n, 1, !1, e[1], null, !1, !1);
  }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(e) {
    k[e] = new N(e, 2, !1, e.toLowerCase(), null, !1, !1);
  }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(e) {
    k[e] = new N(e, 2, !1, e, null, !1, !1);
  }), "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e) {
    k[e] = new N(e, 3, !1, e.toLowerCase(), null, !1, !1);
  }), ["checked", "multiple", "muted", "selected"].forEach(function(e) {
    k[e] = new N(e, 3, !0, e, null, !1, !1);
  }), ["capture", "download"].forEach(function(e) {
    k[e] = new N(e, 4, !1, e, null, !1, !1);
  }), ["cols", "rows", "size", "span"].forEach(function(e) {
    k[e] = new N(e, 6, !1, e, null, !1, !1);
  }), ["rowSpan", "start"].forEach(function(e) {
    k[e] = new N(e, 5, !1, e.toLowerCase(), null, !1, !1);
  });
  var E = /[\-:]([a-z])/g;
  function A(e) {
    return e[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e) {
    var n = e.replace(
      E,
      A
    );
    k[n] = new N(n, 1, !1, e, null, !1, !1);
  }), "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e) {
    var n = e.replace(E, A);
    k[n] = new N(n, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1);
  }), ["xml:base", "xml:lang", "xml:space"].forEach(function(e) {
    var n = e.replace(E, A);
    k[n] = new N(n, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1);
  }), ["tabIndex", "crossOrigin"].forEach(function(e) {
    k[e] = new N(e, 1, !1, e.toLowerCase(), null, !1, !1);
  }), k.xlinkHref = new N("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1), ["src", "href", "action", "formAction"].forEach(function(e) {
    k[e] = new N(e, 1, !1, e.toLowerCase(), null, !0, !0);
  });
  function _(e, n, o, s) {
    var c = k.hasOwnProperty(n) ? k[n] : null;
    (c !== null ? c.type !== 0 : s || !(2 < n.length) || n[0] !== "o" && n[0] !== "O" || n[1] !== "n" && n[1] !== "N") && (S(n, o, c, s) && (o = null), s || c === null ? y(n) && (o === null ? e.removeAttribute(n) : e.setAttribute(n, "" + o)) : c.mustUseProperty ? e[c.propertyName] = o === null ? c.type === 3 ? !1 : "" : o : (n = c.attributeName, s = c.attributeNamespace, o === null ? e.removeAttribute(n) : (c = c.type, o = c === 3 || c === 4 && o === !0 ? "" : "" + o, s ? e.setAttributeNS(s, n, o) : e.setAttribute(n, o))));
  }
  var M = t.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, O = Symbol.for("react.element"), j = Symbol.for("react.portal"), H = Symbol.for("react.fragment"), G = Symbol.for("react.strict_mode"), K = Symbol.for("react.profiler"), ie = Symbol.for("react.provider"), X = Symbol.for("react.context"), b = Symbol.for("react.forward_ref"), Z = Symbol.for("react.suspense"), z = Symbol.for("react.suspense_list"), Y = Symbol.for("react.memo"), F = Symbol.for("react.lazy"), U = Symbol.for("react.offscreen"), T = Symbol.iterator;
  function I(e) {
    return e === null || typeof e != "object" ? null : (e = T && e[T] || e["@@iterator"], typeof e == "function" ? e : null);
  }
  var V = Object.assign, C;
  function R(e) {
    if (C === void 0) try {
      throw Error();
    } catch (o) {
      var n = o.stack.trim().match(/\n( *(at )?)/);
      C = n && n[1] || "";
    }
    return `
` + C + e;
  }
  var te = !1;
  function ee(e, n) {
    if (!e || te) return "";
    te = !0;
    var o = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      if (n) if (n = function() {
        throw Error();
      }, Object.defineProperty(n.prototype, "props", { set: function() {
        throw Error();
      } }), typeof Reflect == "object" && Reflect.construct) {
        try {
          Reflect.construct(n, []);
        } catch (Q) {
          var s = Q;
        }
        Reflect.construct(e, [], n);
      } else {
        try {
          n.call();
        } catch (Q) {
          s = Q;
        }
        e.call(n.prototype);
      }
      else {
        try {
          throw Error();
        } catch (Q) {
          s = Q;
        }
        e();
      }
    } catch (Q) {
      if (Q && s && typeof Q.stack == "string") {
        for (var c = Q.stack.split(`
`), d = s.stack.split(`
`), w = c.length - 1, P = d.length - 1; 1 <= w && 0 <= P && c[w] !== d[P]; ) P--;
        for (; 1 <= w && 0 <= P; w--, P--) if (c[w] !== d[P]) {
          if (w !== 1 || P !== 1)
            do
              if (w--, P--, 0 > P || c[w] !== d[P]) {
                var L = `
` + c[w].replace(" at new ", " at ");
                return e.displayName && L.includes("<anonymous>") && (L = L.replace("<anonymous>", e.displayName)), L;
              }
            while (1 <= w && 0 <= P);
          break;
        }
      }
    } finally {
      te = !1, Error.prepareStackTrace = o;
    }
    return (e = e ? e.displayName || e.name : "") ? R(e) : "";
  }
  function le(e) {
    switch (e.tag) {
      case 5:
        return R(e.type);
      case 16:
        return R("Lazy");
      case 13:
        return R("Suspense");
      case 19:
        return R("SuspenseList");
      case 0:
      case 2:
      case 15:
        return e = ee(e.type, !1), e;
      case 11:
        return e = ee(e.type.render, !1), e;
      case 1:
        return e = ee(e.type, !0), e;
      default:
        return "";
    }
  }
  function ue(e) {
    if (e == null) return null;
    if (typeof e == "function") return e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case H:
        return "Fragment";
      case j:
        return "Portal";
      case K:
        return "Profiler";
      case G:
        return "StrictMode";
      case Z:
        return "Suspense";
      case z:
        return "SuspenseList";
    }
    if (typeof e == "object") switch (e.$$typeof) {
      case X:
        return (e.displayName || "Context") + ".Consumer";
      case ie:
        return (e._context.displayName || "Context") + ".Provider";
      case b:
        var n = e.render;
        return e = e.displayName, e || (e = n.displayName || n.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
      case Y:
        return n = e.displayName || null, n !== null ? n : ue(e.type) || "Memo";
      case F:
        n = e._payload, e = e._init;
        try {
          return ue(e(n));
        } catch {
        }
    }
    return null;
  }
  function ae(e) {
    var n = e.type;
    switch (e.tag) {
      case 24:
        return "Cache";
      case 9:
        return (n.displayName || "Context") + ".Consumer";
      case 10:
        return (n._context.displayName || "Context") + ".Provider";
      case 18:
        return "DehydratedFragment";
      case 11:
        return e = n.render, e = e.displayName || e.name || "", n.displayName || (e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef");
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
        return n === G ? "StrictMode" : "Mode";
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
  function J(e) {
    switch (typeof e) {
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return e;
      case "object":
        return e;
      default:
        return "";
    }
  }
  function ce(e) {
    var n = e.type;
    return (e = e.nodeName) && e.toLowerCase() === "input" && (n === "checkbox" || n === "radio");
  }
  function xe(e) {
    var n = ce(e) ? "checked" : "value", o = Object.getOwnPropertyDescriptor(e.constructor.prototype, n), s = "" + e[n];
    if (!e.hasOwnProperty(n) && typeof o < "u" && typeof o.get == "function" && typeof o.set == "function") {
      var c = o.get, d = o.set;
      return Object.defineProperty(e, n, { configurable: !0, get: function() {
        return c.call(this);
      }, set: function(w) {
        s = "" + w, d.call(this, w);
      } }), Object.defineProperty(e, n, { enumerable: o.enumerable }), { getValue: function() {
        return s;
      }, setValue: function(w) {
        s = "" + w;
      }, stopTracking: function() {
        e._valueTracker = null, delete e[n];
      } };
    }
  }
  function _e(e) {
    e._valueTracker || (e._valueTracker = xe(e));
  }
  function Se(e) {
    if (!e) return !1;
    var n = e._valueTracker;
    if (!n) return !0;
    var o = n.getValue(), s = "";
    return e && (s = ce(e) ? e.checked ? "true" : "false" : e.value), e = s, e !== o ? (n.setValue(e), !0) : !1;
  }
  function ye(e) {
    if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  function Ne(e, n) {
    var o = n.checked;
    return V({}, n, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: o ?? e._wrapperState.initialChecked });
  }
  function Ie(e, n) {
    var o = n.defaultValue == null ? "" : n.defaultValue, s = n.checked != null ? n.checked : n.defaultChecked;
    o = J(n.value != null ? n.value : o), e._wrapperState = { initialChecked: s, initialValue: o, controlled: n.type === "checkbox" || n.type === "radio" ? n.checked != null : n.value != null };
  }
  function Ce(e, n) {
    n = n.checked, n != null && _(e, "checked", n, !1);
  }
  function Ue(e, n) {
    Ce(e, n);
    var o = J(n.value), s = n.type;
    if (o != null) s === "number" ? (o === 0 && e.value === "" || e.value != o) && (e.value = "" + o) : e.value !== "" + o && (e.value = "" + o);
    else if (s === "submit" || s === "reset") {
      e.removeAttribute("value");
      return;
    }
    n.hasOwnProperty("value") ? dt(e, n.type, o) : n.hasOwnProperty("defaultValue") && dt(e, n.type, J(n.defaultValue)), n.checked == null && n.defaultChecked != null && (e.defaultChecked = !!n.defaultChecked);
  }
  function zt(e, n, o) {
    if (n.hasOwnProperty("value") || n.hasOwnProperty("defaultValue")) {
      var s = n.type;
      if (!(s !== "submit" && s !== "reset" || n.value !== void 0 && n.value !== null)) return;
      n = "" + e._wrapperState.initialValue, o || n === e.value || (e.value = n), e.defaultValue = n;
    }
    o = e.name, o !== "" && (e.name = ""), e.defaultChecked = !!e._wrapperState.initialChecked, o !== "" && (e.name = o);
  }
  function dt(e, n, o) {
    (n !== "number" || ye(e.ownerDocument) !== e) && (o == null ? e.defaultValue = "" + e._wrapperState.initialValue : e.defaultValue !== "" + o && (e.defaultValue = "" + o));
  }
  var ht = Array.isArray;
  function _t(e, n, o, s) {
    if (e = e.options, n) {
      n = {};
      for (var c = 0; c < o.length; c++) n["$" + o[c]] = !0;
      for (o = 0; o < e.length; o++) c = n.hasOwnProperty("$" + e[o].value), e[o].selected !== c && (e[o].selected = c), c && s && (e[o].defaultSelected = !0);
    } else {
      for (o = "" + J(o), n = null, c = 0; c < e.length; c++) {
        if (e[c].value === o) {
          e[c].selected = !0, s && (e[c].defaultSelected = !0);
          return;
        }
        n !== null || e[c].disabled || (n = e[c]);
      }
      n !== null && (n.selected = !0);
    }
  }
  function Zt(e, n) {
    if (n.dangerouslySetInnerHTML != null) throw Error(i(91));
    return V({}, n, { value: void 0, defaultValue: void 0, children: "" + e._wrapperState.initialValue });
  }
  function yn(e, n) {
    var o = n.value;
    if (o == null) {
      if (o = n.children, n = n.defaultValue, o != null) {
        if (n != null) throw Error(i(92));
        if (ht(o)) {
          if (1 < o.length) throw Error(i(93));
          o = o[0];
        }
        n = o;
      }
      n == null && (n = ""), o = n;
    }
    e._wrapperState = { initialValue: J(o) };
  }
  function yr(e, n) {
    var o = J(n.value), s = J(n.defaultValue);
    o != null && (o = "" + o, o !== e.value && (e.value = o), n.defaultValue == null && e.defaultValue !== o && (e.defaultValue = o)), s != null && (e.defaultValue = "" + s);
  }
  function Bn(e) {
    var n = e.textContent;
    n === e._wrapperState.initialValue && n !== "" && n !== null && (e.value = n);
  }
  function Jt(e) {
    switch (e) {
      case "svg":
        return "http://www.w3.org/2000/svg";
      case "math":
        return "http://www.w3.org/1998/Math/MathML";
      default:
        return "http://www.w3.org/1999/xhtml";
    }
  }
  function en(e, n) {
    return e == null || e === "http://www.w3.org/1999/xhtml" ? Jt(n) : e === "http://www.w3.org/2000/svg" && n === "foreignObject" ? "http://www.w3.org/1999/xhtml" : e;
  }
  var Un, ki = (function(e) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(n, o, s, c) {
      MSApp.execUnsafeLocalFunction(function() {
        return e(n, o, s, c);
      });
    } : e;
  })(function(e, n) {
    if (e.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in e) e.innerHTML = n;
    else {
      for (Un = Un || document.createElement("div"), Un.innerHTML = "<svg>" + n.valueOf().toString() + "</svg>", n = Un.firstChild; e.firstChild; ) e.removeChild(e.firstChild);
      for (; n.firstChild; ) e.appendChild(n.firstChild);
    }
  });
  function tn(e, n) {
    if (n) {
      var o = e.firstChild;
      if (o && o === e.lastChild && o.nodeType === 3) {
        o.nodeValue = n;
        return;
      }
    }
    e.textContent = n;
  }
  var Wn = {
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
  }, Cl = ["Webkit", "ms", "Moz", "O"];
  Object.keys(Wn).forEach(function(e) {
    Cl.forEach(function(n) {
      n = n + e.charAt(0).toUpperCase() + e.substring(1), Wn[n] = Wn[e];
    });
  });
  function Ni(e, n, o) {
    return n == null || typeof n == "boolean" || n === "" ? "" : o || typeof n != "number" || n === 0 || Wn.hasOwnProperty(e) && Wn[e] ? ("" + n).trim() : n + "px";
  }
  function Ci(e, n) {
    e = e.style;
    for (var o in n) if (n.hasOwnProperty(o)) {
      var s = o.indexOf("--") === 0, c = Ni(o, n[o], s);
      o === "float" && (o = "cssFloat"), s ? e.setProperty(o, c) : e[o] = c;
    }
  }
  var Ml = V({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
  function ao(e, n) {
    if (n) {
      if (Ml[e] && (n.children != null || n.dangerouslySetInnerHTML != null)) throw Error(i(137, e));
      if (n.dangerouslySetInnerHTML != null) {
        if (n.children != null) throw Error(i(60));
        if (typeof n.dangerouslySetInnerHTML != "object" || !("__html" in n.dangerouslySetInnerHTML)) throw Error(i(61));
      }
      if (n.style != null && typeof n.style != "object") throw Error(i(62));
    }
  }
  function co(e, n) {
    if (e.indexOf("-") === -1) return typeof n.is == "string";
    switch (e) {
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
  var fo = null;
  function ho(e) {
    return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
  }
  var po = null, vn = null, wn = null;
  function Mi(e) {
    if (e = Oo(e)) {
      if (typeof po != "function") throw Error(i(280));
      var n = e.stateNode;
      n && (n = rs(n), po(e.stateNode, e.type, n));
    }
  }
  function Pi(e) {
    vn ? wn ? wn.push(e) : wn = [e] : vn = e;
  }
  function Ti() {
    if (vn) {
      var e = vn, n = wn;
      if (wn = vn = null, Mi(e), n) for (e = 0; e < n.length; e++) Mi(n[e]);
    }
  }
  function zi(e, n) {
    return e(n);
  }
  function Ii() {
  }
  var go = !1;
  function Li(e, n, o) {
    if (go) return e(n, o);
    go = !0;
    try {
      return zi(e, n, o);
    } finally {
      go = !1, (vn !== null || wn !== null) && (Ii(), Ti());
    }
  }
  function Yn(e, n) {
    var o = e.stateNode;
    if (o === null) return null;
    var s = rs(o);
    if (s === null) return null;
    o = s[n];
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
        (s = !s.disabled) || (e = e.type, s = !(e === "button" || e === "input" || e === "select" || e === "textarea")), e = !s;
        break e;
      default:
        e = !1;
    }
    if (e) return null;
    if (o && typeof o != "function") throw Error(i(231, n, typeof o));
    return o;
  }
  var mo = !1;
  if (h) try {
    var Xn = {};
    Object.defineProperty(Xn, "passive", { get: function() {
      mo = !0;
    } }), window.addEventListener("test", Xn, Xn), window.removeEventListener("test", Xn, Xn);
  } catch {
    mo = !1;
  }
  function Pl(e, n, o, s, c, d, w, P, L) {
    var Q = Array.prototype.slice.call(arguments, 3);
    try {
      n.apply(o, Q);
    } catch (re) {
      this.onError(re);
    }
  }
  var bn = !1, vr = null, wr = !1, yo = null, Tl = { onError: function(e) {
    bn = !0, vr = e;
  } };
  function zl(e, n, o, s, c, d, w, P, L) {
    bn = !1, vr = null, Pl.apply(Tl, arguments);
  }
  function Il(e, n, o, s, c, d, w, P, L) {
    if (zl.apply(this, arguments), bn) {
      if (bn) {
        var Q = vr;
        bn = !1, vr = null;
      } else throw Error(i(198));
      wr || (wr = !0, yo = Q);
    }
  }
  function Bt(e) {
    var n = e, o = e;
    if (e.alternate) for (; n.return; ) n = n.return;
    else {
      e = n;
      do
        n = e, (n.flags & 4098) !== 0 && (o = n.return), e = n.return;
      while (e);
    }
    return n.tag === 3 ? o : null;
  }
  function vo(e) {
    if (e.tag === 13) {
      var n = e.memoizedState;
      if (n === null && (e = e.alternate, e !== null && (n = e.memoizedState)), n !== null) return n.dehydrated;
    }
    return null;
  }
  function wo(e) {
    if (Bt(e) !== e) throw Error(i(188));
  }
  function Ll(e) {
    var n = e.alternate;
    if (!n) {
      if (n = Bt(e), n === null) throw Error(i(188));
      return n !== e ? null : e;
    }
    for (var o = e, s = n; ; ) {
      var c = o.return;
      if (c === null) break;
      var d = c.alternate;
      if (d === null) {
        if (s = c.return, s !== null) {
          o = s;
          continue;
        }
        break;
      }
      if (c.child === d.child) {
        for (d = c.child; d; ) {
          if (d === o) return wo(c), e;
          if (d === s) return wo(c), n;
          d = d.sibling;
        }
        throw Error(i(188));
      }
      if (o.return !== s.return) o = c, s = d;
      else {
        for (var w = !1, P = c.child; P; ) {
          if (P === o) {
            w = !0, o = c, s = d;
            break;
          }
          if (P === s) {
            w = !0, s = c, o = d;
            break;
          }
          P = P.sibling;
        }
        if (!w) {
          for (P = d.child; P; ) {
            if (P === o) {
              w = !0, o = d, s = c;
              break;
            }
            if (P === s) {
              w = !0, s = d, o = c;
              break;
            }
            P = P.sibling;
          }
          if (!w) throw Error(i(189));
        }
      }
      if (o.alternate !== s) throw Error(i(190));
    }
    if (o.tag !== 3) throw Error(i(188));
    return o.stateNode.current === o ? e : n;
  }
  function Ai(e) {
    return e = Ll(e), e !== null ? Ri(e) : null;
  }
  function Ri(e) {
    if (e.tag === 5 || e.tag === 6) return e;
    for (e = e.child; e !== null; ) {
      var n = Ri(e);
      if (n !== null) return n;
      e = e.sibling;
    }
    return null;
  }
  var Di = r.unstable_scheduleCallback, $i = r.unstable_cancelCallback, Al = r.unstable_shouldYield, ji = r.unstable_requestPaint, Fe = r.unstable_now, Rl = r.unstable_getCurrentPriorityLevel, xo = r.unstable_ImmediatePriority, Fi = r.unstable_UserBlockingPriority, xr = r.unstable_NormalPriority, Dl = r.unstable_LowPriority, Oi = r.unstable_IdlePriority, Qn = null, Et = null;
  function $l(e) {
    if (Et && typeof Et.onCommitFiberRoot == "function") try {
      Et.onCommitFiberRoot(Qn, e, void 0, (e.current.flags & 128) === 128);
    } catch {
    }
  }
  var pt = Math.clz32 ? Math.clz32 : Ol, jl = Math.log, Fl = Math.LN2;
  function Ol(e) {
    return e >>>= 0, e === 0 ? 32 : 31 - (jl(e) / Fl | 0) | 0;
  }
  var Sr = 64, _r = 4194304;
  function Ut(e) {
    switch (e & -e) {
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
        return e & 4194240;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return e & 130023424;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 1073741824;
      default:
        return e;
    }
  }
  function Er(e, n) {
    var o = e.pendingLanes;
    if (o === 0) return 0;
    var s = 0, c = e.suspendedLanes, d = e.pingedLanes, w = o & 268435455;
    if (w !== 0) {
      var P = w & ~c;
      P !== 0 ? s = Ut(P) : (d &= w, d !== 0 && (s = Ut(d)));
    } else w = o & ~c, w !== 0 ? s = Ut(w) : d !== 0 && (s = Ut(d));
    if (s === 0) return 0;
    if (n !== 0 && n !== s && (n & c) === 0 && (c = s & -s, d = n & -n, c >= d || c === 16 && (d & 4194240) !== 0)) return n;
    if ((s & 4) !== 0 && (s |= o & 16), n = e.entangledLanes, n !== 0) for (e = e.entanglements, n &= s; 0 < n; ) o = 31 - pt(n), c = 1 << o, s |= e[o], n &= ~c;
    return s;
  }
  function Hi(e, n) {
    switch (e) {
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
  function Hl(e, n) {
    for (var o = e.suspendedLanes, s = e.pingedLanes, c = e.expirationTimes, d = e.pendingLanes; 0 < d; ) {
      var w = 31 - pt(d), P = 1 << w, L = c[w];
      L === -1 ? ((P & o) === 0 || (P & s) !== 0) && (c[w] = Hi(P, n)) : L <= n && (e.expiredLanes |= P), d &= ~P;
    }
  }
  function So(e) {
    return e = e.pendingLanes & -1073741825, e !== 0 ? e : e & 1073741824 ? 1073741824 : 0;
  }
  function kr() {
    var e = Sr;
    return Sr <<= 1, (Sr & 4194240) === 0 && (Sr = 64), e;
  }
  function _o(e) {
    for (var n = [], o = 0; 31 > o; o++) n.push(e);
    return n;
  }
  function Gn(e, n, o) {
    e.pendingLanes |= n, n !== 536870912 && (e.suspendedLanes = 0, e.pingedLanes = 0), e = e.eventTimes, n = 31 - pt(n), e[n] = o;
  }
  function Vi(e, n) {
    var o = e.pendingLanes & ~n;
    e.pendingLanes = n, e.suspendedLanes = 0, e.pingedLanes = 0, e.expiredLanes &= n, e.mutableReadLanes &= n, e.entangledLanes &= n, n = e.entanglements;
    var s = e.eventTimes;
    for (e = e.expirationTimes; 0 < o; ) {
      var c = 31 - pt(o), d = 1 << c;
      n[c] = 0, s[c] = -1, e[c] = -1, o &= ~d;
    }
  }
  function Vl(e, n) {
    var o = e.entangledLanes |= n;
    for (e = e.entanglements; o; ) {
      var s = 31 - pt(o), c = 1 << s;
      c & n | e[s] & n && (e[s] |= n), o &= ~c;
    }
  }
  var ze = 0;
  function yc(e) {
    return e &= -e, 1 < e ? 4 < e ? (e & 268435455) !== 0 ? 16 : 536870912 : 4 : 1;
  }
  var vc, Bl, wc, xc, Sc, Ul = !1, Bi = [], xn = null, Sn = null, _n = null, Eo = /* @__PURE__ */ new Map(), ko = /* @__PURE__ */ new Map(), En = [], Xg = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  function _c(e, n) {
    switch (e) {
      case "focusin":
      case "focusout":
        xn = null;
        break;
      case "dragenter":
      case "dragleave":
        Sn = null;
        break;
      case "mouseover":
      case "mouseout":
        _n = null;
        break;
      case "pointerover":
      case "pointerout":
        Eo.delete(n.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        ko.delete(n.pointerId);
    }
  }
  function No(e, n, o, s, c, d) {
    return e === null || e.nativeEvent !== d ? (e = { blockedOn: n, domEventName: o, eventSystemFlags: s, nativeEvent: d, targetContainers: [c] }, n !== null && (n = Oo(n), n !== null && Bl(n)), e) : (e.eventSystemFlags |= s, n = e.targetContainers, c !== null && n.indexOf(c) === -1 && n.push(c), e);
  }
  function bg(e, n, o, s, c) {
    switch (n) {
      case "focusin":
        return xn = No(xn, e, n, o, s, c), !0;
      case "dragenter":
        return Sn = No(Sn, e, n, o, s, c), !0;
      case "mouseover":
        return _n = No(_n, e, n, o, s, c), !0;
      case "pointerover":
        var d = c.pointerId;
        return Eo.set(d, No(Eo.get(d) || null, e, n, o, s, c)), !0;
      case "gotpointercapture":
        return d = c.pointerId, ko.set(d, No(ko.get(d) || null, e, n, o, s, c)), !0;
    }
    return !1;
  }
  function Ec(e) {
    var n = Kn(e.target);
    if (n !== null) {
      var o = Bt(n);
      if (o !== null) {
        if (n = o.tag, n === 13) {
          if (n = vo(o), n !== null) {
            e.blockedOn = n, Sc(e.priority, function() {
              wc(o);
            });
            return;
          }
        } else if (n === 3 && o.stateNode.current.memoizedState.isDehydrated) {
          e.blockedOn = o.tag === 3 ? o.stateNode.containerInfo : null;
          return;
        }
      }
    }
    e.blockedOn = null;
  }
  function Ui(e) {
    if (e.blockedOn !== null) return !1;
    for (var n = e.targetContainers; 0 < n.length; ) {
      var o = Yl(e.domEventName, e.eventSystemFlags, n[0], e.nativeEvent);
      if (o === null) {
        o = e.nativeEvent;
        var s = new o.constructor(o.type, o);
        fo = s, o.target.dispatchEvent(s), fo = null;
      } else return n = Oo(o), n !== null && Bl(n), e.blockedOn = o, !1;
      n.shift();
    }
    return !0;
  }
  function kc(e, n, o) {
    Ui(e) && o.delete(n);
  }
  function Qg() {
    Ul = !1, xn !== null && Ui(xn) && (xn = null), Sn !== null && Ui(Sn) && (Sn = null), _n !== null && Ui(_n) && (_n = null), Eo.forEach(kc), ko.forEach(kc);
  }
  function Co(e, n) {
    e.blockedOn === n && (e.blockedOn = null, Ul || (Ul = !0, r.unstable_scheduleCallback(r.unstable_NormalPriority, Qg)));
  }
  function Mo(e) {
    function n(c) {
      return Co(c, e);
    }
    if (0 < Bi.length) {
      Co(Bi[0], e);
      for (var o = 1; o < Bi.length; o++) {
        var s = Bi[o];
        s.blockedOn === e && (s.blockedOn = null);
      }
    }
    for (xn !== null && Co(xn, e), Sn !== null && Co(Sn, e), _n !== null && Co(_n, e), Eo.forEach(n), ko.forEach(n), o = 0; o < En.length; o++) s = En[o], s.blockedOn === e && (s.blockedOn = null);
    for (; 0 < En.length && (o = En[0], o.blockedOn === null); ) Ec(o), o.blockedOn === null && En.shift();
  }
  var Nr = M.ReactCurrentBatchConfig, Wi = !0;
  function Gg(e, n, o, s) {
    var c = ze, d = Nr.transition;
    Nr.transition = null;
    try {
      ze = 1, Wl(e, n, o, s);
    } finally {
      ze = c, Nr.transition = d;
    }
  }
  function Kg(e, n, o, s) {
    var c = ze, d = Nr.transition;
    Nr.transition = null;
    try {
      ze = 4, Wl(e, n, o, s);
    } finally {
      ze = c, Nr.transition = d;
    }
  }
  function Wl(e, n, o, s) {
    if (Wi) {
      var c = Yl(e, n, o, s);
      if (c === null) uu(e, n, s, Yi, o), _c(e, s);
      else if (bg(c, e, n, o, s)) s.stopPropagation();
      else if (_c(e, s), n & 4 && -1 < Xg.indexOf(e)) {
        for (; c !== null; ) {
          var d = Oo(c);
          if (d !== null && vc(d), d = Yl(e, n, o, s), d === null && uu(e, n, s, Yi, o), d === c) break;
          c = d;
        }
        c !== null && s.stopPropagation();
      } else uu(e, n, s, null, o);
    }
  }
  var Yi = null;
  function Yl(e, n, o, s) {
    if (Yi = null, e = ho(s), e = Kn(e), e !== null) if (n = Bt(e), n === null) e = null;
    else if (o = n.tag, o === 13) {
      if (e = vo(n), e !== null) return e;
      e = null;
    } else if (o === 3) {
      if (n.stateNode.current.memoizedState.isDehydrated) return n.tag === 3 ? n.stateNode.containerInfo : null;
      e = null;
    } else n !== e && (e = null);
    return Yi = e, null;
  }
  function Nc(e) {
    switch (e) {
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
        switch (Rl()) {
          case xo:
            return 1;
          case Fi:
            return 4;
          case xr:
          case Dl:
            return 16;
          case Oi:
            return 536870912;
          default:
            return 16;
        }
      default:
        return 16;
    }
  }
  var kn = null, Xl = null, Xi = null;
  function Cc() {
    if (Xi) return Xi;
    var e, n = Xl, o = n.length, s, c = "value" in kn ? kn.value : kn.textContent, d = c.length;
    for (e = 0; e < o && n[e] === c[e]; e++) ;
    var w = o - e;
    for (s = 1; s <= w && n[o - s] === c[d - s]; s++) ;
    return Xi = c.slice(e, 1 < s ? 1 - s : void 0);
  }
  function bi(e) {
    var n = e.keyCode;
    return "charCode" in e ? (e = e.charCode, e === 0 && n === 13 && (e = 13)) : e = n, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
  }
  function Qi() {
    return !0;
  }
  function Mc() {
    return !1;
  }
  function gt(e) {
    function n(o, s, c, d, w) {
      this._reactName = o, this._targetInst = c, this.type = s, this.nativeEvent = d, this.target = w, this.currentTarget = null;
      for (var P in e) e.hasOwnProperty(P) && (o = e[P], this[P] = o ? o(d) : d[P]);
      return this.isDefaultPrevented = (d.defaultPrevented != null ? d.defaultPrevented : d.returnValue === !1) ? Qi : Mc, this.isPropagationStopped = Mc, this;
    }
    return V(n.prototype, { preventDefault: function() {
      this.defaultPrevented = !0;
      var o = this.nativeEvent;
      o && (o.preventDefault ? o.preventDefault() : typeof o.returnValue != "unknown" && (o.returnValue = !1), this.isDefaultPrevented = Qi);
    }, stopPropagation: function() {
      var o = this.nativeEvent;
      o && (o.stopPropagation ? o.stopPropagation() : typeof o.cancelBubble != "unknown" && (o.cancelBubble = !0), this.isPropagationStopped = Qi);
    }, persist: function() {
    }, isPersistent: Qi }), n;
  }
  var Cr = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(e) {
    return e.timeStamp || Date.now();
  }, defaultPrevented: 0, isTrusted: 0 }, bl = gt(Cr), Po = V({}, Cr, { view: 0, detail: 0 }), qg = gt(Po), Ql, Gl, To, Gi = V({}, Po, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: ql, button: 0, buttons: 0, relatedTarget: function(e) {
    return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
  }, movementX: function(e) {
    return "movementX" in e ? e.movementX : (e !== To && (To && e.type === "mousemove" ? (Ql = e.screenX - To.screenX, Gl = e.screenY - To.screenY) : Gl = Ql = 0, To = e), Ql);
  }, movementY: function(e) {
    return "movementY" in e ? e.movementY : Gl;
  } }), Pc = gt(Gi), Zg = V({}, Gi, { dataTransfer: 0 }), Jg = gt(Zg), em = V({}, Po, { relatedTarget: 0 }), Kl = gt(em), tm = V({}, Cr, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), nm = gt(tm), rm = V({}, Cr, { clipboardData: function(e) {
    return "clipboardData" in e ? e.clipboardData : window.clipboardData;
  } }), om = gt(rm), im = V({}, Cr, { data: 0 }), Tc = gt(im), sm = {
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
  }, lm = {
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
  }, um = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function am(e) {
    var n = this.nativeEvent;
    return n.getModifierState ? n.getModifierState(e) : (e = um[e]) ? !!n[e] : !1;
  }
  function ql() {
    return am;
  }
  var cm = V({}, Po, { key: function(e) {
    if (e.key) {
      var n = sm[e.key] || e.key;
      if (n !== "Unidentified") return n;
    }
    return e.type === "keypress" ? (e = bi(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? lm[e.keyCode] || "Unidentified" : "";
  }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: ql, charCode: function(e) {
    return e.type === "keypress" ? bi(e) : 0;
  }, keyCode: function(e) {
    return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  }, which: function(e) {
    return e.type === "keypress" ? bi(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  } }), fm = gt(cm), dm = V({}, Gi, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), zc = gt(dm), hm = V({}, Po, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: ql }), pm = gt(hm), gm = V({}, Cr, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), mm = gt(gm), ym = V({}, Gi, {
    deltaX: function(e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function(e) {
      return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), vm = gt(ym), wm = [9, 13, 27, 32], Zl = h && "CompositionEvent" in window, zo = null;
  h && "documentMode" in document && (zo = document.documentMode);
  var xm = h && "TextEvent" in window && !zo, Ic = h && (!Zl || zo && 8 < zo && 11 >= zo), Lc = " ", Ac = !1;
  function Rc(e, n) {
    switch (e) {
      case "keyup":
        return wm.indexOf(n.keyCode) !== -1;
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
  function Dc(e) {
    return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
  }
  var Mr = !1;
  function Sm(e, n) {
    switch (e) {
      case "compositionend":
        return Dc(n);
      case "keypress":
        return n.which !== 32 ? null : (Ac = !0, Lc);
      case "textInput":
        return e = n.data, e === Lc && Ac ? null : e;
      default:
        return null;
    }
  }
  function _m(e, n) {
    if (Mr) return e === "compositionend" || !Zl && Rc(e, n) ? (e = Cc(), Xi = Xl = kn = null, Mr = !1, e) : null;
    switch (e) {
      case "paste":
        return null;
      case "keypress":
        if (!(n.ctrlKey || n.altKey || n.metaKey) || n.ctrlKey && n.altKey) {
          if (n.char && 1 < n.char.length) return n.char;
          if (n.which) return String.fromCharCode(n.which);
        }
        return null;
      case "compositionend":
        return Ic && n.locale !== "ko" ? null : n.data;
      default:
        return null;
    }
  }
  var Em = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
  function $c(e) {
    var n = e && e.nodeName && e.nodeName.toLowerCase();
    return n === "input" ? !!Em[e.type] : n === "textarea";
  }
  function jc(e, n, o, s) {
    Pi(s), n = es(n, "onChange"), 0 < n.length && (o = new bl("onChange", "change", null, o, s), e.push({ event: o, listeners: n }));
  }
  var Io = null, Lo = null;
  function km(e) {
    tf(e, 0);
  }
  function Ki(e) {
    var n = Lr(e);
    if (Se(n)) return e;
  }
  function Nm(e, n) {
    if (e === "change") return n;
  }
  var Fc = !1;
  if (h) {
    var Jl;
    if (h) {
      var eu = "oninput" in document;
      if (!eu) {
        var Oc = document.createElement("div");
        Oc.setAttribute("oninput", "return;"), eu = typeof Oc.oninput == "function";
      }
      Jl = eu;
    } else Jl = !1;
    Fc = Jl && (!document.documentMode || 9 < document.documentMode);
  }
  function Hc() {
    Io && (Io.detachEvent("onpropertychange", Vc), Lo = Io = null);
  }
  function Vc(e) {
    if (e.propertyName === "value" && Ki(Lo)) {
      var n = [];
      jc(n, Lo, e, ho(e)), Li(km, n);
    }
  }
  function Cm(e, n, o) {
    e === "focusin" ? (Hc(), Io = n, Lo = o, Io.attachEvent("onpropertychange", Vc)) : e === "focusout" && Hc();
  }
  function Mm(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown") return Ki(Lo);
  }
  function Pm(e, n) {
    if (e === "click") return Ki(n);
  }
  function Tm(e, n) {
    if (e === "input" || e === "change") return Ki(n);
  }
  function zm(e, n) {
    return e === n && (e !== 0 || 1 / e === 1 / n) || e !== e && n !== n;
  }
  var It = typeof Object.is == "function" ? Object.is : zm;
  function Ao(e, n) {
    if (It(e, n)) return !0;
    if (typeof e != "object" || e === null || typeof n != "object" || n === null) return !1;
    var o = Object.keys(e), s = Object.keys(n);
    if (o.length !== s.length) return !1;
    for (s = 0; s < o.length; s++) {
      var c = o[s];
      if (!p.call(n, c) || !It(e[c], n[c])) return !1;
    }
    return !0;
  }
  function Bc(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function Uc(e, n) {
    var o = Bc(e);
    e = 0;
    for (var s; o; ) {
      if (o.nodeType === 3) {
        if (s = e + o.textContent.length, e <= n && s >= n) return { node: o, offset: n - e };
        e = s;
      }
      e: {
        for (; o; ) {
          if (o.nextSibling) {
            o = o.nextSibling;
            break e;
          }
          o = o.parentNode;
        }
        o = void 0;
      }
      o = Bc(o);
    }
  }
  function Wc(e, n) {
    return e && n ? e === n ? !0 : e && e.nodeType === 3 ? !1 : n && n.nodeType === 3 ? Wc(e, n.parentNode) : "contains" in e ? e.contains(n) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(n) & 16) : !1 : !1;
  }
  function Yc() {
    for (var e = window, n = ye(); n instanceof e.HTMLIFrameElement; ) {
      try {
        var o = typeof n.contentWindow.location.href == "string";
      } catch {
        o = !1;
      }
      if (o) e = n.contentWindow;
      else break;
      n = ye(e.document);
    }
    return n;
  }
  function tu(e) {
    var n = e && e.nodeName && e.nodeName.toLowerCase();
    return n && (n === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || n === "textarea" || e.contentEditable === "true");
  }
  function Im(e) {
    var n = Yc(), o = e.focusedElem, s = e.selectionRange;
    if (n !== o && o && o.ownerDocument && Wc(o.ownerDocument.documentElement, o)) {
      if (s !== null && tu(o)) {
        if (n = s.start, e = s.end, e === void 0 && (e = n), "selectionStart" in o) o.selectionStart = n, o.selectionEnd = Math.min(e, o.value.length);
        else if (e = (n = o.ownerDocument || document) && n.defaultView || window, e.getSelection) {
          e = e.getSelection();
          var c = o.textContent.length, d = Math.min(s.start, c);
          s = s.end === void 0 ? d : Math.min(s.end, c), !e.extend && d > s && (c = s, s = d, d = c), c = Uc(o, d);
          var w = Uc(
            o,
            s
          );
          c && w && (e.rangeCount !== 1 || e.anchorNode !== c.node || e.anchorOffset !== c.offset || e.focusNode !== w.node || e.focusOffset !== w.offset) && (n = n.createRange(), n.setStart(c.node, c.offset), e.removeAllRanges(), d > s ? (e.addRange(n), e.extend(w.node, w.offset)) : (n.setEnd(w.node, w.offset), e.addRange(n)));
        }
      }
      for (n = [], e = o; e = e.parentNode; ) e.nodeType === 1 && n.push({ element: e, left: e.scrollLeft, top: e.scrollTop });
      for (typeof o.focus == "function" && o.focus(), o = 0; o < n.length; o++) e = n[o], e.element.scrollLeft = e.left, e.element.scrollTop = e.top;
    }
  }
  var Lm = h && "documentMode" in document && 11 >= document.documentMode, Pr = null, nu = null, Ro = null, ru = !1;
  function Xc(e, n, o) {
    var s = o.window === o ? o.document : o.nodeType === 9 ? o : o.ownerDocument;
    ru || Pr == null || Pr !== ye(s) || (s = Pr, "selectionStart" in s && tu(s) ? s = { start: s.selectionStart, end: s.selectionEnd } : (s = (s.ownerDocument && s.ownerDocument.defaultView || window).getSelection(), s = { anchorNode: s.anchorNode, anchorOffset: s.anchorOffset, focusNode: s.focusNode, focusOffset: s.focusOffset }), Ro && Ao(Ro, s) || (Ro = s, s = es(nu, "onSelect"), 0 < s.length && (n = new bl("onSelect", "select", null, n, o), e.push({ event: n, listeners: s }), n.target = Pr)));
  }
  function qi(e, n) {
    var o = {};
    return o[e.toLowerCase()] = n.toLowerCase(), o["Webkit" + e] = "webkit" + n, o["Moz" + e] = "moz" + n, o;
  }
  var Tr = { animationend: qi("Animation", "AnimationEnd"), animationiteration: qi("Animation", "AnimationIteration"), animationstart: qi("Animation", "AnimationStart"), transitionend: qi("Transition", "TransitionEnd") }, ou = {}, bc = {};
  h && (bc = document.createElement("div").style, "AnimationEvent" in window || (delete Tr.animationend.animation, delete Tr.animationiteration.animation, delete Tr.animationstart.animation), "TransitionEvent" in window || delete Tr.transitionend.transition);
  function Zi(e) {
    if (ou[e]) return ou[e];
    if (!Tr[e]) return e;
    var n = Tr[e], o;
    for (o in n) if (n.hasOwnProperty(o) && o in bc) return ou[e] = n[o];
    return e;
  }
  var Qc = Zi("animationend"), Gc = Zi("animationiteration"), Kc = Zi("animationstart"), qc = Zi("transitionend"), Zc = /* @__PURE__ */ new Map(), Jc = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function Nn(e, n) {
    Zc.set(e, n), a(n, [e]);
  }
  for (var iu = 0; iu < Jc.length; iu++) {
    var su = Jc[iu], Am = su.toLowerCase(), Rm = su[0].toUpperCase() + su.slice(1);
    Nn(Am, "on" + Rm);
  }
  Nn(Qc, "onAnimationEnd"), Nn(Gc, "onAnimationIteration"), Nn(Kc, "onAnimationStart"), Nn("dblclick", "onDoubleClick"), Nn("focusin", "onFocus"), Nn("focusout", "onBlur"), Nn(qc, "onTransitionEnd"), f("onMouseEnter", ["mouseout", "mouseover"]), f("onMouseLeave", ["mouseout", "mouseover"]), f("onPointerEnter", ["pointerout", "pointerover"]), f("onPointerLeave", ["pointerout", "pointerover"]), a("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), a("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), a("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), a("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), a("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), a("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var Do = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), Dm = new Set("cancel close invalid load scroll toggle".split(" ").concat(Do));
  function ef(e, n, o) {
    var s = e.type || "unknown-event";
    e.currentTarget = o, Il(s, n, void 0, e), e.currentTarget = null;
  }
  function tf(e, n) {
    n = (n & 4) !== 0;
    for (var o = 0; o < e.length; o++) {
      var s = e[o], c = s.event;
      s = s.listeners;
      e: {
        var d = void 0;
        if (n) for (var w = s.length - 1; 0 <= w; w--) {
          var P = s[w], L = P.instance, Q = P.currentTarget;
          if (P = P.listener, L !== d && c.isPropagationStopped()) break e;
          ef(c, P, Q), d = L;
        }
        else for (w = 0; w < s.length; w++) {
          if (P = s[w], L = P.instance, Q = P.currentTarget, P = P.listener, L !== d && c.isPropagationStopped()) break e;
          ef(c, P, Q), d = L;
        }
      }
    }
    if (wr) throw e = yo, wr = !1, yo = null, e;
  }
  function Ae(e, n) {
    var o = n[pu];
    o === void 0 && (o = n[pu] = /* @__PURE__ */ new Set());
    var s = e + "__bubble";
    o.has(s) || (nf(n, e, 2, !1), o.add(s));
  }
  function lu(e, n, o) {
    var s = 0;
    n && (s |= 4), nf(o, e, s, n);
  }
  var Ji = "_reactListening" + Math.random().toString(36).slice(2);
  function $o(e) {
    if (!e[Ji]) {
      e[Ji] = !0, l.forEach(function(o) {
        o !== "selectionchange" && (Dm.has(o) || lu(o, !1, e), lu(o, !0, e));
      });
      var n = e.nodeType === 9 ? e : e.ownerDocument;
      n === null || n[Ji] || (n[Ji] = !0, lu("selectionchange", !1, n));
    }
  }
  function nf(e, n, o, s) {
    switch (Nc(n)) {
      case 1:
        var c = Gg;
        break;
      case 4:
        c = Kg;
        break;
      default:
        c = Wl;
    }
    o = c.bind(null, n, o, e), c = void 0, !mo || n !== "touchstart" && n !== "touchmove" && n !== "wheel" || (c = !0), s ? c !== void 0 ? e.addEventListener(n, o, { capture: !0, passive: c }) : e.addEventListener(n, o, !0) : c !== void 0 ? e.addEventListener(n, o, { passive: c }) : e.addEventListener(n, o, !1);
  }
  function uu(e, n, o, s, c) {
    var d = s;
    if ((n & 1) === 0 && (n & 2) === 0 && s !== null) e: for (; ; ) {
      if (s === null) return;
      var w = s.tag;
      if (w === 3 || w === 4) {
        var P = s.stateNode.containerInfo;
        if (P === c || P.nodeType === 8 && P.parentNode === c) break;
        if (w === 4) for (w = s.return; w !== null; ) {
          var L = w.tag;
          if ((L === 3 || L === 4) && (L = w.stateNode.containerInfo, L === c || L.nodeType === 8 && L.parentNode === c)) return;
          w = w.return;
        }
        for (; P !== null; ) {
          if (w = Kn(P), w === null) return;
          if (L = w.tag, L === 5 || L === 6) {
            s = d = w;
            continue e;
          }
          P = P.parentNode;
        }
      }
      s = s.return;
    }
    Li(function() {
      var Q = d, re = ho(o), oe = [];
      e: {
        var ne = Zc.get(e);
        if (ne !== void 0) {
          var fe = bl, he = e;
          switch (e) {
            case "keypress":
              if (bi(o) === 0) break e;
            case "keydown":
            case "keyup":
              fe = fm;
              break;
            case "focusin":
              he = "focus", fe = Kl;
              break;
            case "focusout":
              he = "blur", fe = Kl;
              break;
            case "beforeblur":
            case "afterblur":
              fe = Kl;
              break;
            case "click":
              if (o.button === 2) break e;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              fe = Pc;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              fe = Jg;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              fe = pm;
              break;
            case Qc:
            case Gc:
            case Kc:
              fe = nm;
              break;
            case qc:
              fe = mm;
              break;
            case "scroll":
              fe = qg;
              break;
            case "wheel":
              fe = vm;
              break;
            case "copy":
            case "cut":
            case "paste":
              fe = om;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              fe = zc;
          }
          var pe = (n & 4) !== 0, Be = !pe && e === "scroll", B = pe ? ne !== null ? ne + "Capture" : null : ne;
          pe = [];
          for (var $ = Q, W; $ !== null; ) {
            W = $;
            var se = W.stateNode;
            if (W.tag === 5 && se !== null && (W = se, B !== null && (se = Yn($, B), se != null && pe.push(jo($, se, W)))), Be) break;
            $ = $.return;
          }
          0 < pe.length && (ne = new fe(ne, he, null, o, re), oe.push({ event: ne, listeners: pe }));
        }
      }
      if ((n & 7) === 0) {
        e: {
          if (ne = e === "mouseover" || e === "pointerover", fe = e === "mouseout" || e === "pointerout", ne && o !== fo && (he = o.relatedTarget || o.fromElement) && (Kn(he) || he[nn])) break e;
          if ((fe || ne) && (ne = re.window === re ? re : (ne = re.ownerDocument) ? ne.defaultView || ne.parentWindow : window, fe ? (he = o.relatedTarget || o.toElement, fe = Q, he = he ? Kn(he) : null, he !== null && (Be = Bt(he), he !== Be || he.tag !== 5 && he.tag !== 6) && (he = null)) : (fe = null, he = Q), fe !== he)) {
            if (pe = Pc, se = "onMouseLeave", B = "onMouseEnter", $ = "mouse", (e === "pointerout" || e === "pointerover") && (pe = zc, se = "onPointerLeave", B = "onPointerEnter", $ = "pointer"), Be = fe == null ? ne : Lr(fe), W = he == null ? ne : Lr(he), ne = new pe(se, $ + "leave", fe, o, re), ne.target = Be, ne.relatedTarget = W, se = null, Kn(re) === Q && (pe = new pe(B, $ + "enter", he, o, re), pe.target = W, pe.relatedTarget = Be, se = pe), Be = se, fe && he) t: {
              for (pe = fe, B = he, $ = 0, W = pe; W; W = zr(W)) $++;
              for (W = 0, se = B; se; se = zr(se)) W++;
              for (; 0 < $ - W; ) pe = zr(pe), $--;
              for (; 0 < W - $; ) B = zr(B), W--;
              for (; $--; ) {
                if (pe === B || B !== null && pe === B.alternate) break t;
                pe = zr(pe), B = zr(B);
              }
              pe = null;
            }
            else pe = null;
            fe !== null && rf(oe, ne, fe, pe, !1), he !== null && Be !== null && rf(oe, Be, he, pe, !0);
          }
        }
        e: {
          if (ne = Q ? Lr(Q) : window, fe = ne.nodeName && ne.nodeName.toLowerCase(), fe === "select" || fe === "input" && ne.type === "file") var ge = Nm;
          else if ($c(ne)) if (Fc) ge = Tm;
          else {
            ge = Mm;
            var ve = Cm;
          }
          else (fe = ne.nodeName) && fe.toLowerCase() === "input" && (ne.type === "checkbox" || ne.type === "radio") && (ge = Pm);
          if (ge && (ge = ge(e, Q))) {
            jc(oe, ge, o, re);
            break e;
          }
          ve && ve(e, ne, Q), e === "focusout" && (ve = ne._wrapperState) && ve.controlled && ne.type === "number" && dt(ne, "number", ne.value);
        }
        switch (ve = Q ? Lr(Q) : window, e) {
          case "focusin":
            ($c(ve) || ve.contentEditable === "true") && (Pr = ve, nu = Q, Ro = null);
            break;
          case "focusout":
            Ro = nu = Pr = null;
            break;
          case "mousedown":
            ru = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            ru = !1, Xc(oe, o, re);
            break;
          case "selectionchange":
            if (Lm) break;
          case "keydown":
          case "keyup":
            Xc(oe, o, re);
        }
        var we;
        if (Zl) e: {
          switch (e) {
            case "compositionstart":
              var Ee = "onCompositionStart";
              break e;
            case "compositionend":
              Ee = "onCompositionEnd";
              break e;
            case "compositionupdate":
              Ee = "onCompositionUpdate";
              break e;
          }
          Ee = void 0;
        }
        else Mr ? Rc(e, o) && (Ee = "onCompositionEnd") : e === "keydown" && o.keyCode === 229 && (Ee = "onCompositionStart");
        Ee && (Ic && o.locale !== "ko" && (Mr || Ee !== "onCompositionStart" ? Ee === "onCompositionEnd" && Mr && (we = Cc()) : (kn = re, Xl = "value" in kn ? kn.value : kn.textContent, Mr = !0)), ve = es(Q, Ee), 0 < ve.length && (Ee = new Tc(Ee, e, null, o, re), oe.push({ event: Ee, listeners: ve }), we ? Ee.data = we : (we = Dc(o), we !== null && (Ee.data = we)))), (we = xm ? Sm(e, o) : _m(e, o)) && (Q = es(Q, "onBeforeInput"), 0 < Q.length && (re = new Tc("onBeforeInput", "beforeinput", null, o, re), oe.push({ event: re, listeners: Q }), re.data = we));
      }
      tf(oe, n);
    });
  }
  function jo(e, n, o) {
    return { instance: e, listener: n, currentTarget: o };
  }
  function es(e, n) {
    for (var o = n + "Capture", s = []; e !== null; ) {
      var c = e, d = c.stateNode;
      c.tag === 5 && d !== null && (c = d, d = Yn(e, o), d != null && s.unshift(jo(e, d, c)), d = Yn(e, n), d != null && s.push(jo(e, d, c))), e = e.return;
    }
    return s;
  }
  function zr(e) {
    if (e === null) return null;
    do
      e = e.return;
    while (e && e.tag !== 5);
    return e || null;
  }
  function rf(e, n, o, s, c) {
    for (var d = n._reactName, w = []; o !== null && o !== s; ) {
      var P = o, L = P.alternate, Q = P.stateNode;
      if (L !== null && L === s) break;
      P.tag === 5 && Q !== null && (P = Q, c ? (L = Yn(o, d), L != null && w.unshift(jo(o, L, P))) : c || (L = Yn(o, d), L != null && w.push(jo(o, L, P)))), o = o.return;
    }
    w.length !== 0 && e.push({ event: n, listeners: w });
  }
  var $m = /\r\n?/g, jm = /\u0000|\uFFFD/g;
  function of(e) {
    return (typeof e == "string" ? e : "" + e).replace($m, `
`).replace(jm, "");
  }
  function ts(e, n, o) {
    if (n = of(n), of(e) !== n && o) throw Error(i(425));
  }
  function ns() {
  }
  var au = null, cu = null;
  function fu(e, n) {
    return e === "textarea" || e === "noscript" || typeof n.children == "string" || typeof n.children == "number" || typeof n.dangerouslySetInnerHTML == "object" && n.dangerouslySetInnerHTML !== null && n.dangerouslySetInnerHTML.__html != null;
  }
  var du = typeof setTimeout == "function" ? setTimeout : void 0, Fm = typeof clearTimeout == "function" ? clearTimeout : void 0, sf = typeof Promise == "function" ? Promise : void 0, Om = typeof queueMicrotask == "function" ? queueMicrotask : typeof sf < "u" ? function(e) {
    return sf.resolve(null).then(e).catch(Hm);
  } : du;
  function Hm(e) {
    setTimeout(function() {
      throw e;
    });
  }
  function hu(e, n) {
    var o = n, s = 0;
    do {
      var c = o.nextSibling;
      if (e.removeChild(o), c && c.nodeType === 8) if (o = c.data, o === "/$") {
        if (s === 0) {
          e.removeChild(c), Mo(n);
          return;
        }
        s--;
      } else o !== "$" && o !== "$?" && o !== "$!" || s++;
      o = c;
    } while (o);
    Mo(n);
  }
  function Cn(e) {
    for (; e != null; e = e.nextSibling) {
      var n = e.nodeType;
      if (n === 1 || n === 3) break;
      if (n === 8) {
        if (n = e.data, n === "$" || n === "$!" || n === "$?") break;
        if (n === "/$") return null;
      }
    }
    return e;
  }
  function lf(e) {
    e = e.previousSibling;
    for (var n = 0; e; ) {
      if (e.nodeType === 8) {
        var o = e.data;
        if (o === "$" || o === "$!" || o === "$?") {
          if (n === 0) return e;
          n--;
        } else o === "/$" && n++;
      }
      e = e.previousSibling;
    }
    return null;
  }
  var Ir = Math.random().toString(36).slice(2), Wt = "__reactFiber$" + Ir, Fo = "__reactProps$" + Ir, nn = "__reactContainer$" + Ir, pu = "__reactEvents$" + Ir, Vm = "__reactListeners$" + Ir, Bm = "__reactHandles$" + Ir;
  function Kn(e) {
    var n = e[Wt];
    if (n) return n;
    for (var o = e.parentNode; o; ) {
      if (n = o[nn] || o[Wt]) {
        if (o = n.alternate, n.child !== null || o !== null && o.child !== null) for (e = lf(e); e !== null; ) {
          if (o = e[Wt]) return o;
          e = lf(e);
        }
        return n;
      }
      e = o, o = e.parentNode;
    }
    return null;
  }
  function Oo(e) {
    return e = e[Wt] || e[nn], !e || e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3 ? null : e;
  }
  function Lr(e) {
    if (e.tag === 5 || e.tag === 6) return e.stateNode;
    throw Error(i(33));
  }
  function rs(e) {
    return e[Fo] || null;
  }
  var gu = [], Ar = -1;
  function Mn(e) {
    return { current: e };
  }
  function Re(e) {
    0 > Ar || (e.current = gu[Ar], gu[Ar] = null, Ar--);
  }
  function Le(e, n) {
    Ar++, gu[Ar] = e.current, e.current = n;
  }
  var Pn = {}, Je = Mn(Pn), it = Mn(!1), qn = Pn;
  function Rr(e, n) {
    var o = e.type.contextTypes;
    if (!o) return Pn;
    var s = e.stateNode;
    if (s && s.__reactInternalMemoizedUnmaskedChildContext === n) return s.__reactInternalMemoizedMaskedChildContext;
    var c = {}, d;
    for (d in o) c[d] = n[d];
    return s && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = n, e.__reactInternalMemoizedMaskedChildContext = c), c;
  }
  function st(e) {
    return e = e.childContextTypes, e != null;
  }
  function os() {
    Re(it), Re(Je);
  }
  function uf(e, n, o) {
    if (Je.current !== Pn) throw Error(i(168));
    Le(Je, n), Le(it, o);
  }
  function af(e, n, o) {
    var s = e.stateNode;
    if (n = n.childContextTypes, typeof s.getChildContext != "function") return o;
    s = s.getChildContext();
    for (var c in s) if (!(c in n)) throw Error(i(108, ae(e) || "Unknown", c));
    return V({}, o, s);
  }
  function is(e) {
    return e = (e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext || Pn, qn = Je.current, Le(Je, e), Le(it, it.current), !0;
  }
  function cf(e, n, o) {
    var s = e.stateNode;
    if (!s) throw Error(i(169));
    o ? (e = af(e, n, qn), s.__reactInternalMemoizedMergedChildContext = e, Re(it), Re(Je), Le(Je, e)) : Re(it), Le(it, o);
  }
  var rn = null, ss = !1, mu = !1;
  function ff(e) {
    rn === null ? rn = [e] : rn.push(e);
  }
  function Um(e) {
    ss = !0, ff(e);
  }
  function Tn() {
    if (!mu && rn !== null) {
      mu = !0;
      var e = 0, n = ze;
      try {
        var o = rn;
        for (ze = 1; e < o.length; e++) {
          var s = o[e];
          do
            s = s(!0);
          while (s !== null);
        }
        rn = null, ss = !1;
      } catch (c) {
        throw rn !== null && (rn = rn.slice(e + 1)), Di(xo, Tn), c;
      } finally {
        ze = n, mu = !1;
      }
    }
    return null;
  }
  var Dr = [], $r = 0, ls = null, us = 0, kt = [], Nt = 0, Zn = null, on = 1, sn = "";
  function Jn(e, n) {
    Dr[$r++] = us, Dr[$r++] = ls, ls = e, us = n;
  }
  function df(e, n, o) {
    kt[Nt++] = on, kt[Nt++] = sn, kt[Nt++] = Zn, Zn = e;
    var s = on;
    e = sn;
    var c = 32 - pt(s) - 1;
    s &= ~(1 << c), o += 1;
    var d = 32 - pt(n) + c;
    if (30 < d) {
      var w = c - c % 5;
      d = (s & (1 << w) - 1).toString(32), s >>= w, c -= w, on = 1 << 32 - pt(n) + c | o << c | s, sn = d + e;
    } else on = 1 << d | o << c | s, sn = e;
  }
  function yu(e) {
    e.return !== null && (Jn(e, 1), df(e, 1, 0));
  }
  function vu(e) {
    for (; e === ls; ) ls = Dr[--$r], Dr[$r] = null, us = Dr[--$r], Dr[$r] = null;
    for (; e === Zn; ) Zn = kt[--Nt], kt[Nt] = null, sn = kt[--Nt], kt[Nt] = null, on = kt[--Nt], kt[Nt] = null;
  }
  var mt = null, yt = null, De = !1, Lt = null;
  function hf(e, n) {
    var o = Tt(5, null, null, 0);
    o.elementType = "DELETED", o.stateNode = n, o.return = e, n = e.deletions, n === null ? (e.deletions = [o], e.flags |= 16) : n.push(o);
  }
  function pf(e, n) {
    switch (e.tag) {
      case 5:
        var o = e.type;
        return n = n.nodeType !== 1 || o.toLowerCase() !== n.nodeName.toLowerCase() ? null : n, n !== null ? (e.stateNode = n, mt = e, yt = Cn(n.firstChild), !0) : !1;
      case 6:
        return n = e.pendingProps === "" || n.nodeType !== 3 ? null : n, n !== null ? (e.stateNode = n, mt = e, yt = null, !0) : !1;
      case 13:
        return n = n.nodeType !== 8 ? null : n, n !== null ? (o = Zn !== null ? { id: on, overflow: sn } : null, e.memoizedState = { dehydrated: n, treeContext: o, retryLane: 1073741824 }, o = Tt(18, null, null, 0), o.stateNode = n, o.return = e, e.child = o, mt = e, yt = null, !0) : !1;
      default:
        return !1;
    }
  }
  function wu(e) {
    return (e.mode & 1) !== 0 && (e.flags & 128) === 0;
  }
  function xu(e) {
    if (De) {
      var n = yt;
      if (n) {
        var o = n;
        if (!pf(e, n)) {
          if (wu(e)) throw Error(i(418));
          n = Cn(o.nextSibling);
          var s = mt;
          n && pf(e, n) ? hf(s, o) : (e.flags = e.flags & -4097 | 2, De = !1, mt = e);
        }
      } else {
        if (wu(e)) throw Error(i(418));
        e.flags = e.flags & -4097 | 2, De = !1, mt = e;
      }
    }
  }
  function gf(e) {
    for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13; ) e = e.return;
    mt = e;
  }
  function as(e) {
    if (e !== mt) return !1;
    if (!De) return gf(e), De = !0, !1;
    var n;
    if ((n = e.tag !== 3) && !(n = e.tag !== 5) && (n = e.type, n = n !== "head" && n !== "body" && !fu(e.type, e.memoizedProps)), n && (n = yt)) {
      if (wu(e)) throw mf(), Error(i(418));
      for (; n; ) hf(e, n), n = Cn(n.nextSibling);
    }
    if (gf(e), e.tag === 13) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(i(317));
      e: {
        for (e = e.nextSibling, n = 0; e; ) {
          if (e.nodeType === 8) {
            var o = e.data;
            if (o === "/$") {
              if (n === 0) {
                yt = Cn(e.nextSibling);
                break e;
              }
              n--;
            } else o !== "$" && o !== "$!" && o !== "$?" || n++;
          }
          e = e.nextSibling;
        }
        yt = null;
      }
    } else yt = mt ? Cn(e.stateNode.nextSibling) : null;
    return !0;
  }
  function mf() {
    for (var e = yt; e; ) e = Cn(e.nextSibling);
  }
  function jr() {
    yt = mt = null, De = !1;
  }
  function Su(e) {
    Lt === null ? Lt = [e] : Lt.push(e);
  }
  var Wm = M.ReactCurrentBatchConfig;
  function Ho(e, n, o) {
    if (e = o.ref, e !== null && typeof e != "function" && typeof e != "object") {
      if (o._owner) {
        if (o = o._owner, o) {
          if (o.tag !== 1) throw Error(i(309));
          var s = o.stateNode;
        }
        if (!s) throw Error(i(147, e));
        var c = s, d = "" + e;
        return n !== null && n.ref !== null && typeof n.ref == "function" && n.ref._stringRef === d ? n.ref : (n = function(w) {
          var P = c.refs;
          w === null ? delete P[d] : P[d] = w;
        }, n._stringRef = d, n);
      }
      if (typeof e != "string") throw Error(i(284));
      if (!o._owner) throw Error(i(290, e));
    }
    return e;
  }
  function cs(e, n) {
    throw e = Object.prototype.toString.call(n), Error(i(31, e === "[object Object]" ? "object with keys {" + Object.keys(n).join(", ") + "}" : e));
  }
  function yf(e) {
    var n = e._init;
    return n(e._payload);
  }
  function vf(e) {
    function n(B, $) {
      if (e) {
        var W = B.deletions;
        W === null ? (B.deletions = [$], B.flags |= 16) : W.push($);
      }
    }
    function o(B, $) {
      if (!e) return null;
      for (; $ !== null; ) n(B, $), $ = $.sibling;
      return null;
    }
    function s(B, $) {
      for (B = /* @__PURE__ */ new Map(); $ !== null; ) $.key !== null ? B.set($.key, $) : B.set($.index, $), $ = $.sibling;
      return B;
    }
    function c(B, $) {
      return B = jn(B, $), B.index = 0, B.sibling = null, B;
    }
    function d(B, $, W) {
      return B.index = W, e ? (W = B.alternate, W !== null ? (W = W.index, W < $ ? (B.flags |= 2, $) : W) : (B.flags |= 2, $)) : (B.flags |= 1048576, $);
    }
    function w(B) {
      return e && B.alternate === null && (B.flags |= 2), B;
    }
    function P(B, $, W, se) {
      return $ === null || $.tag !== 6 ? ($ = da(W, B.mode, se), $.return = B, $) : ($ = c($, W), $.return = B, $);
    }
    function L(B, $, W, se) {
      var ge = W.type;
      return ge === H ? re(B, $, W.props.children, se, W.key) : $ !== null && ($.elementType === ge || typeof ge == "object" && ge !== null && ge.$$typeof === F && yf(ge) === $.type) ? (se = c($, W.props), se.ref = Ho(B, $, W), se.return = B, se) : (se = Rs(W.type, W.key, W.props, null, B.mode, se), se.ref = Ho(B, $, W), se.return = B, se);
    }
    function Q(B, $, W, se) {
      return $ === null || $.tag !== 4 || $.stateNode.containerInfo !== W.containerInfo || $.stateNode.implementation !== W.implementation ? ($ = ha(W, B.mode, se), $.return = B, $) : ($ = c($, W.children || []), $.return = B, $);
    }
    function re(B, $, W, se, ge) {
      return $ === null || $.tag !== 7 ? ($ = lr(W, B.mode, se, ge), $.return = B, $) : ($ = c($, W), $.return = B, $);
    }
    function oe(B, $, W) {
      if (typeof $ == "string" && $ !== "" || typeof $ == "number") return $ = da("" + $, B.mode, W), $.return = B, $;
      if (typeof $ == "object" && $ !== null) {
        switch ($.$$typeof) {
          case O:
            return W = Rs($.type, $.key, $.props, null, B.mode, W), W.ref = Ho(B, null, $), W.return = B, W;
          case j:
            return $ = ha($, B.mode, W), $.return = B, $;
          case F:
            var se = $._init;
            return oe(B, se($._payload), W);
        }
        if (ht($) || I($)) return $ = lr($, B.mode, W, null), $.return = B, $;
        cs(B, $);
      }
      return null;
    }
    function ne(B, $, W, se) {
      var ge = $ !== null ? $.key : null;
      if (typeof W == "string" && W !== "" || typeof W == "number") return ge !== null ? null : P(B, $, "" + W, se);
      if (typeof W == "object" && W !== null) {
        switch (W.$$typeof) {
          case O:
            return W.key === ge ? L(B, $, W, se) : null;
          case j:
            return W.key === ge ? Q(B, $, W, se) : null;
          case F:
            return ge = W._init, ne(
              B,
              $,
              ge(W._payload),
              se
            );
        }
        if (ht(W) || I(W)) return ge !== null ? null : re(B, $, W, se, null);
        cs(B, W);
      }
      return null;
    }
    function fe(B, $, W, se, ge) {
      if (typeof se == "string" && se !== "" || typeof se == "number") return B = B.get(W) || null, P($, B, "" + se, ge);
      if (typeof se == "object" && se !== null) {
        switch (se.$$typeof) {
          case O:
            return B = B.get(se.key === null ? W : se.key) || null, L($, B, se, ge);
          case j:
            return B = B.get(se.key === null ? W : se.key) || null, Q($, B, se, ge);
          case F:
            var ve = se._init;
            return fe(B, $, W, ve(se._payload), ge);
        }
        if (ht(se) || I(se)) return B = B.get(W) || null, re($, B, se, ge, null);
        cs($, se);
      }
      return null;
    }
    function he(B, $, W, se) {
      for (var ge = null, ve = null, we = $, Ee = $ = 0, Ke = null; we !== null && Ee < W.length; Ee++) {
        we.index > Ee ? (Ke = we, we = null) : Ke = we.sibling;
        var Te = ne(B, we, W[Ee], se);
        if (Te === null) {
          we === null && (we = Ke);
          break;
        }
        e && we && Te.alternate === null && n(B, we), $ = d(Te, $, Ee), ve === null ? ge = Te : ve.sibling = Te, ve = Te, we = Ke;
      }
      if (Ee === W.length) return o(B, we), De && Jn(B, Ee), ge;
      if (we === null) {
        for (; Ee < W.length; Ee++) we = oe(B, W[Ee], se), we !== null && ($ = d(we, $, Ee), ve === null ? ge = we : ve.sibling = we, ve = we);
        return De && Jn(B, Ee), ge;
      }
      for (we = s(B, we); Ee < W.length; Ee++) Ke = fe(we, B, Ee, W[Ee], se), Ke !== null && (e && Ke.alternate !== null && we.delete(Ke.key === null ? Ee : Ke.key), $ = d(Ke, $, Ee), ve === null ? ge = Ke : ve.sibling = Ke, ve = Ke);
      return e && we.forEach(function(Fn) {
        return n(B, Fn);
      }), De && Jn(B, Ee), ge;
    }
    function pe(B, $, W, se) {
      var ge = I(W);
      if (typeof ge != "function") throw Error(i(150));
      if (W = ge.call(W), W == null) throw Error(i(151));
      for (var ve = ge = null, we = $, Ee = $ = 0, Ke = null, Te = W.next(); we !== null && !Te.done; Ee++, Te = W.next()) {
        we.index > Ee ? (Ke = we, we = null) : Ke = we.sibling;
        var Fn = ne(B, we, Te.value, se);
        if (Fn === null) {
          we === null && (we = Ke);
          break;
        }
        e && we && Fn.alternate === null && n(B, we), $ = d(Fn, $, Ee), ve === null ? ge = Fn : ve.sibling = Fn, ve = Fn, we = Ke;
      }
      if (Te.done) return o(
        B,
        we
      ), De && Jn(B, Ee), ge;
      if (we === null) {
        for (; !Te.done; Ee++, Te = W.next()) Te = oe(B, Te.value, se), Te !== null && ($ = d(Te, $, Ee), ve === null ? ge = Te : ve.sibling = Te, ve = Te);
        return De && Jn(B, Ee), ge;
      }
      for (we = s(B, we); !Te.done; Ee++, Te = W.next()) Te = fe(we, B, Ee, Te.value, se), Te !== null && (e && Te.alternate !== null && we.delete(Te.key === null ? Ee : Te.key), $ = d(Te, $, Ee), ve === null ? ge = Te : ve.sibling = Te, ve = Te);
      return e && we.forEach(function(E0) {
        return n(B, E0);
      }), De && Jn(B, Ee), ge;
    }
    function Be(B, $, W, se) {
      if (typeof W == "object" && W !== null && W.type === H && W.key === null && (W = W.props.children), typeof W == "object" && W !== null) {
        switch (W.$$typeof) {
          case O:
            e: {
              for (var ge = W.key, ve = $; ve !== null; ) {
                if (ve.key === ge) {
                  if (ge = W.type, ge === H) {
                    if (ve.tag === 7) {
                      o(B, ve.sibling), $ = c(ve, W.props.children), $.return = B, B = $;
                      break e;
                    }
                  } else if (ve.elementType === ge || typeof ge == "object" && ge !== null && ge.$$typeof === F && yf(ge) === ve.type) {
                    o(B, ve.sibling), $ = c(ve, W.props), $.ref = Ho(B, ve, W), $.return = B, B = $;
                    break e;
                  }
                  o(B, ve);
                  break;
                } else n(B, ve);
                ve = ve.sibling;
              }
              W.type === H ? ($ = lr(W.props.children, B.mode, se, W.key), $.return = B, B = $) : (se = Rs(W.type, W.key, W.props, null, B.mode, se), se.ref = Ho(B, $, W), se.return = B, B = se);
            }
            return w(B);
          case j:
            e: {
              for (ve = W.key; $ !== null; ) {
                if ($.key === ve) if ($.tag === 4 && $.stateNode.containerInfo === W.containerInfo && $.stateNode.implementation === W.implementation) {
                  o(B, $.sibling), $ = c($, W.children || []), $.return = B, B = $;
                  break e;
                } else {
                  o(B, $);
                  break;
                }
                else n(B, $);
                $ = $.sibling;
              }
              $ = ha(W, B.mode, se), $.return = B, B = $;
            }
            return w(B);
          case F:
            return ve = W._init, Be(B, $, ve(W._payload), se);
        }
        if (ht(W)) return he(B, $, W, se);
        if (I(W)) return pe(B, $, W, se);
        cs(B, W);
      }
      return typeof W == "string" && W !== "" || typeof W == "number" ? (W = "" + W, $ !== null && $.tag === 6 ? (o(B, $.sibling), $ = c($, W), $.return = B, B = $) : (o(B, $), $ = da(W, B.mode, se), $.return = B, B = $), w(B)) : o(B, $);
    }
    return Be;
  }
  var Fr = vf(!0), wf = vf(!1), fs = Mn(null), ds = null, Or = null, _u = null;
  function Eu() {
    _u = Or = ds = null;
  }
  function ku(e) {
    var n = fs.current;
    Re(fs), e._currentValue = n;
  }
  function Nu(e, n, o) {
    for (; e !== null; ) {
      var s = e.alternate;
      if ((e.childLanes & n) !== n ? (e.childLanes |= n, s !== null && (s.childLanes |= n)) : s !== null && (s.childLanes & n) !== n && (s.childLanes |= n), e === o) break;
      e = e.return;
    }
  }
  function Hr(e, n) {
    ds = e, _u = Or = null, e = e.dependencies, e !== null && e.firstContext !== null && ((e.lanes & n) !== 0 && (lt = !0), e.firstContext = null);
  }
  function Ct(e) {
    var n = e._currentValue;
    if (_u !== e) if (e = { context: e, memoizedValue: n, next: null }, Or === null) {
      if (ds === null) throw Error(i(308));
      Or = e, ds.dependencies = { lanes: 0, firstContext: e };
    } else Or = Or.next = e;
    return n;
  }
  var er = null;
  function Cu(e) {
    er === null ? er = [e] : er.push(e);
  }
  function xf(e, n, o, s) {
    var c = n.interleaved;
    return c === null ? (o.next = o, Cu(n)) : (o.next = c.next, c.next = o), n.interleaved = o, ln(e, s);
  }
  function ln(e, n) {
    e.lanes |= n;
    var o = e.alternate;
    for (o !== null && (o.lanes |= n), o = e, e = e.return; e !== null; ) e.childLanes |= n, o = e.alternate, o !== null && (o.childLanes |= n), o = e, e = e.return;
    return o.tag === 3 ? o.stateNode : null;
  }
  var zn = !1;
  function Mu(e) {
    e.updateQueue = { baseState: e.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
  }
  function Sf(e, n) {
    e = e.updateQueue, n.updateQueue === e && (n.updateQueue = { baseState: e.baseState, firstBaseUpdate: e.firstBaseUpdate, lastBaseUpdate: e.lastBaseUpdate, shared: e.shared, effects: e.effects });
  }
  function un(e, n) {
    return { eventTime: e, lane: n, tag: 0, payload: null, callback: null, next: null };
  }
  function In(e, n, o) {
    var s = e.updateQueue;
    if (s === null) return null;
    if (s = s.shared, (Pe & 2) !== 0) {
      var c = s.pending;
      return c === null ? n.next = n : (n.next = c.next, c.next = n), s.pending = n, ln(e, o);
    }
    return c = s.interleaved, c === null ? (n.next = n, Cu(s)) : (n.next = c.next, c.next = n), s.interleaved = n, ln(e, o);
  }
  function hs(e, n, o) {
    if (n = n.updateQueue, n !== null && (n = n.shared, (o & 4194240) !== 0)) {
      var s = n.lanes;
      s &= e.pendingLanes, o |= s, n.lanes = o, Vl(e, o);
    }
  }
  function _f(e, n) {
    var o = e.updateQueue, s = e.alternate;
    if (s !== null && (s = s.updateQueue, o === s)) {
      var c = null, d = null;
      if (o = o.firstBaseUpdate, o !== null) {
        do {
          var w = { eventTime: o.eventTime, lane: o.lane, tag: o.tag, payload: o.payload, callback: o.callback, next: null };
          d === null ? c = d = w : d = d.next = w, o = o.next;
        } while (o !== null);
        d === null ? c = d = n : d = d.next = n;
      } else c = d = n;
      o = { baseState: s.baseState, firstBaseUpdate: c, lastBaseUpdate: d, shared: s.shared, effects: s.effects }, e.updateQueue = o;
      return;
    }
    e = o.lastBaseUpdate, e === null ? o.firstBaseUpdate = n : e.next = n, o.lastBaseUpdate = n;
  }
  function ps(e, n, o, s) {
    var c = e.updateQueue;
    zn = !1;
    var d = c.firstBaseUpdate, w = c.lastBaseUpdate, P = c.shared.pending;
    if (P !== null) {
      c.shared.pending = null;
      var L = P, Q = L.next;
      L.next = null, w === null ? d = Q : w.next = Q, w = L;
      var re = e.alternate;
      re !== null && (re = re.updateQueue, P = re.lastBaseUpdate, P !== w && (P === null ? re.firstBaseUpdate = Q : P.next = Q, re.lastBaseUpdate = L));
    }
    if (d !== null) {
      var oe = c.baseState;
      w = 0, re = Q = L = null, P = d;
      do {
        var ne = P.lane, fe = P.eventTime;
        if ((s & ne) === ne) {
          re !== null && (re = re.next = {
            eventTime: fe,
            lane: 0,
            tag: P.tag,
            payload: P.payload,
            callback: P.callback,
            next: null
          });
          e: {
            var he = e, pe = P;
            switch (ne = n, fe = o, pe.tag) {
              case 1:
                if (he = pe.payload, typeof he == "function") {
                  oe = he.call(fe, oe, ne);
                  break e;
                }
                oe = he;
                break e;
              case 3:
                he.flags = he.flags & -65537 | 128;
              case 0:
                if (he = pe.payload, ne = typeof he == "function" ? he.call(fe, oe, ne) : he, ne == null) break e;
                oe = V({}, oe, ne);
                break e;
              case 2:
                zn = !0;
            }
          }
          P.callback !== null && P.lane !== 0 && (e.flags |= 64, ne = c.effects, ne === null ? c.effects = [P] : ne.push(P));
        } else fe = { eventTime: fe, lane: ne, tag: P.tag, payload: P.payload, callback: P.callback, next: null }, re === null ? (Q = re = fe, L = oe) : re = re.next = fe, w |= ne;
        if (P = P.next, P === null) {
          if (P = c.shared.pending, P === null) break;
          ne = P, P = ne.next, ne.next = null, c.lastBaseUpdate = ne, c.shared.pending = null;
        }
      } while (!0);
      if (re === null && (L = oe), c.baseState = L, c.firstBaseUpdate = Q, c.lastBaseUpdate = re, n = c.shared.interleaved, n !== null) {
        c = n;
        do
          w |= c.lane, c = c.next;
        while (c !== n);
      } else d === null && (c.shared.lanes = 0);
      rr |= w, e.lanes = w, e.memoizedState = oe;
    }
  }
  function Ef(e, n, o) {
    if (e = n.effects, n.effects = null, e !== null) for (n = 0; n < e.length; n++) {
      var s = e[n], c = s.callback;
      if (c !== null) {
        if (s.callback = null, s = o, typeof c != "function") throw Error(i(191, c));
        c.call(s);
      }
    }
  }
  var Vo = {}, Yt = Mn(Vo), Bo = Mn(Vo), Uo = Mn(Vo);
  function tr(e) {
    if (e === Vo) throw Error(i(174));
    return e;
  }
  function Pu(e, n) {
    switch (Le(Uo, n), Le(Bo, e), Le(Yt, Vo), e = n.nodeType, e) {
      case 9:
      case 11:
        n = (n = n.documentElement) ? n.namespaceURI : en(null, "");
        break;
      default:
        e = e === 8 ? n.parentNode : n, n = e.namespaceURI || null, e = e.tagName, n = en(n, e);
    }
    Re(Yt), Le(Yt, n);
  }
  function Vr() {
    Re(Yt), Re(Bo), Re(Uo);
  }
  function kf(e) {
    tr(Uo.current);
    var n = tr(Yt.current), o = en(n, e.type);
    n !== o && (Le(Bo, e), Le(Yt, o));
  }
  function Tu(e) {
    Bo.current === e && (Re(Yt), Re(Bo));
  }
  var Oe = Mn(0);
  function gs(e) {
    for (var n = e; n !== null; ) {
      if (n.tag === 13) {
        var o = n.memoizedState;
        if (o !== null && (o = o.dehydrated, o === null || o.data === "$?" || o.data === "$!")) return n;
      } else if (n.tag === 19 && n.memoizedProps.revealOrder !== void 0) {
        if ((n.flags & 128) !== 0) return n;
      } else if (n.child !== null) {
        n.child.return = n, n = n.child;
        continue;
      }
      if (n === e) break;
      for (; n.sibling === null; ) {
        if (n.return === null || n.return === e) return null;
        n = n.return;
      }
      n.sibling.return = n.return, n = n.sibling;
    }
    return null;
  }
  var zu = [];
  function Iu() {
    for (var e = 0; e < zu.length; e++) zu[e]._workInProgressVersionPrimary = null;
    zu.length = 0;
  }
  var ms = M.ReactCurrentDispatcher, Lu = M.ReactCurrentBatchConfig, nr = 0, He = null, Xe = null, Qe = null, ys = !1, Wo = !1, Yo = 0, Ym = 0;
  function et() {
    throw Error(i(321));
  }
  function Au(e, n) {
    if (n === null) return !1;
    for (var o = 0; o < n.length && o < e.length; o++) if (!It(e[o], n[o])) return !1;
    return !0;
  }
  function Ru(e, n, o, s, c, d) {
    if (nr = d, He = n, n.memoizedState = null, n.updateQueue = null, n.lanes = 0, ms.current = e === null || e.memoizedState === null ? Gm : Km, e = o(s, c), Wo) {
      d = 0;
      do {
        if (Wo = !1, Yo = 0, 25 <= d) throw Error(i(301));
        d += 1, Qe = Xe = null, n.updateQueue = null, ms.current = qm, e = o(s, c);
      } while (Wo);
    }
    if (ms.current = xs, n = Xe !== null && Xe.next !== null, nr = 0, Qe = Xe = He = null, ys = !1, n) throw Error(i(300));
    return e;
  }
  function Du() {
    var e = Yo !== 0;
    return Yo = 0, e;
  }
  function Xt() {
    var e = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return Qe === null ? He.memoizedState = Qe = e : Qe = Qe.next = e, Qe;
  }
  function Mt() {
    if (Xe === null) {
      var e = He.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = Xe.next;
    var n = Qe === null ? He.memoizedState : Qe.next;
    if (n !== null) Qe = n, Xe = e;
    else {
      if (e === null) throw Error(i(310));
      Xe = e, e = { memoizedState: Xe.memoizedState, baseState: Xe.baseState, baseQueue: Xe.baseQueue, queue: Xe.queue, next: null }, Qe === null ? He.memoizedState = Qe = e : Qe = Qe.next = e;
    }
    return Qe;
  }
  function Xo(e, n) {
    return typeof n == "function" ? n(e) : n;
  }
  function $u(e) {
    var n = Mt(), o = n.queue;
    if (o === null) throw Error(i(311));
    o.lastRenderedReducer = e;
    var s = Xe, c = s.baseQueue, d = o.pending;
    if (d !== null) {
      if (c !== null) {
        var w = c.next;
        c.next = d.next, d.next = w;
      }
      s.baseQueue = c = d, o.pending = null;
    }
    if (c !== null) {
      d = c.next, s = s.baseState;
      var P = w = null, L = null, Q = d;
      do {
        var re = Q.lane;
        if ((nr & re) === re) L !== null && (L = L.next = { lane: 0, action: Q.action, hasEagerState: Q.hasEagerState, eagerState: Q.eagerState, next: null }), s = Q.hasEagerState ? Q.eagerState : e(s, Q.action);
        else {
          var oe = {
            lane: re,
            action: Q.action,
            hasEagerState: Q.hasEagerState,
            eagerState: Q.eagerState,
            next: null
          };
          L === null ? (P = L = oe, w = s) : L = L.next = oe, He.lanes |= re, rr |= re;
        }
        Q = Q.next;
      } while (Q !== null && Q !== d);
      L === null ? w = s : L.next = P, It(s, n.memoizedState) || (lt = !0), n.memoizedState = s, n.baseState = w, n.baseQueue = L, o.lastRenderedState = s;
    }
    if (e = o.interleaved, e !== null) {
      c = e;
      do
        d = c.lane, He.lanes |= d, rr |= d, c = c.next;
      while (c !== e);
    } else c === null && (o.lanes = 0);
    return [n.memoizedState, o.dispatch];
  }
  function ju(e) {
    var n = Mt(), o = n.queue;
    if (o === null) throw Error(i(311));
    o.lastRenderedReducer = e;
    var s = o.dispatch, c = o.pending, d = n.memoizedState;
    if (c !== null) {
      o.pending = null;
      var w = c = c.next;
      do
        d = e(d, w.action), w = w.next;
      while (w !== c);
      It(d, n.memoizedState) || (lt = !0), n.memoizedState = d, n.baseQueue === null && (n.baseState = d), o.lastRenderedState = d;
    }
    return [d, s];
  }
  function Nf() {
  }
  function Cf(e, n) {
    var o = He, s = Mt(), c = n(), d = !It(s.memoizedState, c);
    if (d && (s.memoizedState = c, lt = !0), s = s.queue, Fu(Tf.bind(null, o, s, e), [e]), s.getSnapshot !== n || d || Qe !== null && Qe.memoizedState.tag & 1) {
      if (o.flags |= 2048, bo(9, Pf.bind(null, o, s, c, n), void 0, null), Ge === null) throw Error(i(349));
      (nr & 30) !== 0 || Mf(o, n, c);
    }
    return c;
  }
  function Mf(e, n, o) {
    e.flags |= 16384, e = { getSnapshot: n, value: o }, n = He.updateQueue, n === null ? (n = { lastEffect: null, stores: null }, He.updateQueue = n, n.stores = [e]) : (o = n.stores, o === null ? n.stores = [e] : o.push(e));
  }
  function Pf(e, n, o, s) {
    n.value = o, n.getSnapshot = s, zf(n) && If(e);
  }
  function Tf(e, n, o) {
    return o(function() {
      zf(n) && If(e);
    });
  }
  function zf(e) {
    var n = e.getSnapshot;
    e = e.value;
    try {
      var o = n();
      return !It(e, o);
    } catch {
      return !0;
    }
  }
  function If(e) {
    var n = ln(e, 1);
    n !== null && $t(n, e, 1, -1);
  }
  function Lf(e) {
    var n = Xt();
    return typeof e == "function" && (e = e()), n.memoizedState = n.baseState = e, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: Xo, lastRenderedState: e }, n.queue = e, e = e.dispatch = Qm.bind(null, He, e), [n.memoizedState, e];
  }
  function bo(e, n, o, s) {
    return e = { tag: e, create: n, destroy: o, deps: s, next: null }, n = He.updateQueue, n === null ? (n = { lastEffect: null, stores: null }, He.updateQueue = n, n.lastEffect = e.next = e) : (o = n.lastEffect, o === null ? n.lastEffect = e.next = e : (s = o.next, o.next = e, e.next = s, n.lastEffect = e)), e;
  }
  function Af() {
    return Mt().memoizedState;
  }
  function vs(e, n, o, s) {
    var c = Xt();
    He.flags |= e, c.memoizedState = bo(1 | n, o, void 0, s === void 0 ? null : s);
  }
  function ws(e, n, o, s) {
    var c = Mt();
    s = s === void 0 ? null : s;
    var d = void 0;
    if (Xe !== null) {
      var w = Xe.memoizedState;
      if (d = w.destroy, s !== null && Au(s, w.deps)) {
        c.memoizedState = bo(n, o, d, s);
        return;
      }
    }
    He.flags |= e, c.memoizedState = bo(1 | n, o, d, s);
  }
  function Rf(e, n) {
    return vs(8390656, 8, e, n);
  }
  function Fu(e, n) {
    return ws(2048, 8, e, n);
  }
  function Df(e, n) {
    return ws(4, 2, e, n);
  }
  function $f(e, n) {
    return ws(4, 4, e, n);
  }
  function jf(e, n) {
    if (typeof n == "function") return e = e(), n(e), function() {
      n(null);
    };
    if (n != null) return e = e(), n.current = e, function() {
      n.current = null;
    };
  }
  function Ff(e, n, o) {
    return o = o != null ? o.concat([e]) : null, ws(4, 4, jf.bind(null, n, e), o);
  }
  function Ou() {
  }
  function Of(e, n) {
    var o = Mt();
    n = n === void 0 ? null : n;
    var s = o.memoizedState;
    return s !== null && n !== null && Au(n, s[1]) ? s[0] : (o.memoizedState = [e, n], e);
  }
  function Hf(e, n) {
    var o = Mt();
    n = n === void 0 ? null : n;
    var s = o.memoizedState;
    return s !== null && n !== null && Au(n, s[1]) ? s[0] : (e = e(), o.memoizedState = [e, n], e);
  }
  function Vf(e, n, o) {
    return (nr & 21) === 0 ? (e.baseState && (e.baseState = !1, lt = !0), e.memoizedState = o) : (It(o, n) || (o = kr(), He.lanes |= o, rr |= o, e.baseState = !0), n);
  }
  function Xm(e, n) {
    var o = ze;
    ze = o !== 0 && 4 > o ? o : 4, e(!0);
    var s = Lu.transition;
    Lu.transition = {};
    try {
      e(!1), n();
    } finally {
      ze = o, Lu.transition = s;
    }
  }
  function Bf() {
    return Mt().memoizedState;
  }
  function bm(e, n, o) {
    var s = Dn(e);
    if (o = { lane: s, action: o, hasEagerState: !1, eagerState: null, next: null }, Uf(e)) Wf(n, o);
    else if (o = xf(e, n, o, s), o !== null) {
      var c = ot();
      $t(o, e, s, c), Yf(o, n, s);
    }
  }
  function Qm(e, n, o) {
    var s = Dn(e), c = { lane: s, action: o, hasEagerState: !1, eagerState: null, next: null };
    if (Uf(e)) Wf(n, c);
    else {
      var d = e.alternate;
      if (e.lanes === 0 && (d === null || d.lanes === 0) && (d = n.lastRenderedReducer, d !== null)) try {
        var w = n.lastRenderedState, P = d(w, o);
        if (c.hasEagerState = !0, c.eagerState = P, It(P, w)) {
          var L = n.interleaved;
          L === null ? (c.next = c, Cu(n)) : (c.next = L.next, L.next = c), n.interleaved = c;
          return;
        }
      } catch {
      } finally {
      }
      o = xf(e, n, c, s), o !== null && (c = ot(), $t(o, e, s, c), Yf(o, n, s));
    }
  }
  function Uf(e) {
    var n = e.alternate;
    return e === He || n !== null && n === He;
  }
  function Wf(e, n) {
    Wo = ys = !0;
    var o = e.pending;
    o === null ? n.next = n : (n.next = o.next, o.next = n), e.pending = n;
  }
  function Yf(e, n, o) {
    if ((o & 4194240) !== 0) {
      var s = n.lanes;
      s &= e.pendingLanes, o |= s, n.lanes = o, Vl(e, o);
    }
  }
  var xs = { readContext: Ct, useCallback: et, useContext: et, useEffect: et, useImperativeHandle: et, useInsertionEffect: et, useLayoutEffect: et, useMemo: et, useReducer: et, useRef: et, useState: et, useDebugValue: et, useDeferredValue: et, useTransition: et, useMutableSource: et, useSyncExternalStore: et, useId: et, unstable_isNewReconciler: !1 }, Gm = { readContext: Ct, useCallback: function(e, n) {
    return Xt().memoizedState = [e, n === void 0 ? null : n], e;
  }, useContext: Ct, useEffect: Rf, useImperativeHandle: function(e, n, o) {
    return o = o != null ? o.concat([e]) : null, vs(
      4194308,
      4,
      jf.bind(null, n, e),
      o
    );
  }, useLayoutEffect: function(e, n) {
    return vs(4194308, 4, e, n);
  }, useInsertionEffect: function(e, n) {
    return vs(4, 2, e, n);
  }, useMemo: function(e, n) {
    var o = Xt();
    return n = n === void 0 ? null : n, e = e(), o.memoizedState = [e, n], e;
  }, useReducer: function(e, n, o) {
    var s = Xt();
    return n = o !== void 0 ? o(n) : n, s.memoizedState = s.baseState = n, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: e, lastRenderedState: n }, s.queue = e, e = e.dispatch = bm.bind(null, He, e), [s.memoizedState, e];
  }, useRef: function(e) {
    var n = Xt();
    return e = { current: e }, n.memoizedState = e;
  }, useState: Lf, useDebugValue: Ou, useDeferredValue: function(e) {
    return Xt().memoizedState = e;
  }, useTransition: function() {
    var e = Lf(!1), n = e[0];
    return e = Xm.bind(null, e[1]), Xt().memoizedState = e, [n, e];
  }, useMutableSource: function() {
  }, useSyncExternalStore: function(e, n, o) {
    var s = He, c = Xt();
    if (De) {
      if (o === void 0) throw Error(i(407));
      o = o();
    } else {
      if (o = n(), Ge === null) throw Error(i(349));
      (nr & 30) !== 0 || Mf(s, n, o);
    }
    c.memoizedState = o;
    var d = { value: o, getSnapshot: n };
    return c.queue = d, Rf(Tf.bind(
      null,
      s,
      d,
      e
    ), [e]), s.flags |= 2048, bo(9, Pf.bind(null, s, d, o, n), void 0, null), o;
  }, useId: function() {
    var e = Xt(), n = Ge.identifierPrefix;
    if (De) {
      var o = sn, s = on;
      o = (s & ~(1 << 32 - pt(s) - 1)).toString(32) + o, n = ":" + n + "R" + o, o = Yo++, 0 < o && (n += "H" + o.toString(32)), n += ":";
    } else o = Ym++, n = ":" + n + "r" + o.toString(32) + ":";
    return e.memoizedState = n;
  }, unstable_isNewReconciler: !1 }, Km = {
    readContext: Ct,
    useCallback: Of,
    useContext: Ct,
    useEffect: Fu,
    useImperativeHandle: Ff,
    useInsertionEffect: Df,
    useLayoutEffect: $f,
    useMemo: Hf,
    useReducer: $u,
    useRef: Af,
    useState: function() {
      return $u(Xo);
    },
    useDebugValue: Ou,
    useDeferredValue: function(e) {
      var n = Mt();
      return Vf(n, Xe.memoizedState, e);
    },
    useTransition: function() {
      var e = $u(Xo)[0], n = Mt().memoizedState;
      return [e, n];
    },
    useMutableSource: Nf,
    useSyncExternalStore: Cf,
    useId: Bf,
    unstable_isNewReconciler: !1
  }, qm = { readContext: Ct, useCallback: Of, useContext: Ct, useEffect: Fu, useImperativeHandle: Ff, useInsertionEffect: Df, useLayoutEffect: $f, useMemo: Hf, useReducer: ju, useRef: Af, useState: function() {
    return ju(Xo);
  }, useDebugValue: Ou, useDeferredValue: function(e) {
    var n = Mt();
    return Xe === null ? n.memoizedState = e : Vf(n, Xe.memoizedState, e);
  }, useTransition: function() {
    var e = ju(Xo)[0], n = Mt().memoizedState;
    return [e, n];
  }, useMutableSource: Nf, useSyncExternalStore: Cf, useId: Bf, unstable_isNewReconciler: !1 };
  function At(e, n) {
    if (e && e.defaultProps) {
      n = V({}, n), e = e.defaultProps;
      for (var o in e) n[o] === void 0 && (n[o] = e[o]);
      return n;
    }
    return n;
  }
  function Hu(e, n, o, s) {
    n = e.memoizedState, o = o(s, n), o = o == null ? n : V({}, n, o), e.memoizedState = o, e.lanes === 0 && (e.updateQueue.baseState = o);
  }
  var Ss = { isMounted: function(e) {
    return (e = e._reactInternals) ? Bt(e) === e : !1;
  }, enqueueSetState: function(e, n, o) {
    e = e._reactInternals;
    var s = ot(), c = Dn(e), d = un(s, c);
    d.payload = n, o != null && (d.callback = o), n = In(e, d, c), n !== null && ($t(n, e, c, s), hs(n, e, c));
  }, enqueueReplaceState: function(e, n, o) {
    e = e._reactInternals;
    var s = ot(), c = Dn(e), d = un(s, c);
    d.tag = 1, d.payload = n, o != null && (d.callback = o), n = In(e, d, c), n !== null && ($t(n, e, c, s), hs(n, e, c));
  }, enqueueForceUpdate: function(e, n) {
    e = e._reactInternals;
    var o = ot(), s = Dn(e), c = un(o, s);
    c.tag = 2, n != null && (c.callback = n), n = In(e, c, s), n !== null && ($t(n, e, s, o), hs(n, e, s));
  } };
  function Xf(e, n, o, s, c, d, w) {
    return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(s, d, w) : n.prototype && n.prototype.isPureReactComponent ? !Ao(o, s) || !Ao(c, d) : !0;
  }
  function bf(e, n, o) {
    var s = !1, c = Pn, d = n.contextType;
    return typeof d == "object" && d !== null ? d = Ct(d) : (c = st(n) ? qn : Je.current, s = n.contextTypes, d = (s = s != null) ? Rr(e, c) : Pn), n = new n(o, d), e.memoizedState = n.state !== null && n.state !== void 0 ? n.state : null, n.updater = Ss, e.stateNode = n, n._reactInternals = e, s && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = c, e.__reactInternalMemoizedMaskedChildContext = d), n;
  }
  function Qf(e, n, o, s) {
    e = n.state, typeof n.componentWillReceiveProps == "function" && n.componentWillReceiveProps(o, s), typeof n.UNSAFE_componentWillReceiveProps == "function" && n.UNSAFE_componentWillReceiveProps(o, s), n.state !== e && Ss.enqueueReplaceState(n, n.state, null);
  }
  function Vu(e, n, o, s) {
    var c = e.stateNode;
    c.props = o, c.state = e.memoizedState, c.refs = {}, Mu(e);
    var d = n.contextType;
    typeof d == "object" && d !== null ? c.context = Ct(d) : (d = st(n) ? qn : Je.current, c.context = Rr(e, d)), c.state = e.memoizedState, d = n.getDerivedStateFromProps, typeof d == "function" && (Hu(e, n, d, o), c.state = e.memoizedState), typeof n.getDerivedStateFromProps == "function" || typeof c.getSnapshotBeforeUpdate == "function" || typeof c.UNSAFE_componentWillMount != "function" && typeof c.componentWillMount != "function" || (n = c.state, typeof c.componentWillMount == "function" && c.componentWillMount(), typeof c.UNSAFE_componentWillMount == "function" && c.UNSAFE_componentWillMount(), n !== c.state && Ss.enqueueReplaceState(c, c.state, null), ps(e, o, c, s), c.state = e.memoizedState), typeof c.componentDidMount == "function" && (e.flags |= 4194308);
  }
  function Br(e, n) {
    try {
      var o = "", s = n;
      do
        o += le(s), s = s.return;
      while (s);
      var c = o;
    } catch (d) {
      c = `
Error generating stack: ` + d.message + `
` + d.stack;
    }
    return { value: e, source: n, stack: c, digest: null };
  }
  function Bu(e, n, o) {
    return { value: e, source: null, stack: o ?? null, digest: n ?? null };
  }
  function Uu(e, n) {
    try {
      console.error(n.value);
    } catch (o) {
      setTimeout(function() {
        throw o;
      });
    }
  }
  var Zm = typeof WeakMap == "function" ? WeakMap : Map;
  function Gf(e, n, o) {
    o = un(-1, o), o.tag = 3, o.payload = { element: null };
    var s = n.value;
    return o.callback = function() {
      Ps || (Ps = !0, oa = s), Uu(e, n);
    }, o;
  }
  function Kf(e, n, o) {
    o = un(-1, o), o.tag = 3;
    var s = e.type.getDerivedStateFromError;
    if (typeof s == "function") {
      var c = n.value;
      o.payload = function() {
        return s(c);
      }, o.callback = function() {
        Uu(e, n);
      };
    }
    var d = e.stateNode;
    return d !== null && typeof d.componentDidCatch == "function" && (o.callback = function() {
      Uu(e, n), typeof s != "function" && (An === null ? An = /* @__PURE__ */ new Set([this]) : An.add(this));
      var w = n.stack;
      this.componentDidCatch(n.value, { componentStack: w !== null ? w : "" });
    }), o;
  }
  function qf(e, n, o) {
    var s = e.pingCache;
    if (s === null) {
      s = e.pingCache = new Zm();
      var c = /* @__PURE__ */ new Set();
      s.set(n, c);
    } else c = s.get(n), c === void 0 && (c = /* @__PURE__ */ new Set(), s.set(n, c));
    c.has(o) || (c.add(o), e = d0.bind(null, e, n, o), n.then(e, e));
  }
  function Zf(e) {
    do {
      var n;
      if ((n = e.tag === 13) && (n = e.memoizedState, n = n !== null ? n.dehydrated !== null : !0), n) return e;
      e = e.return;
    } while (e !== null);
    return null;
  }
  function Jf(e, n, o, s, c) {
    return (e.mode & 1) === 0 ? (e === n ? e.flags |= 65536 : (e.flags |= 128, o.flags |= 131072, o.flags &= -52805, o.tag === 1 && (o.alternate === null ? o.tag = 17 : (n = un(-1, 1), n.tag = 2, In(o, n, 1))), o.lanes |= 1), e) : (e.flags |= 65536, e.lanes = c, e);
  }
  var Jm = M.ReactCurrentOwner, lt = !1;
  function rt(e, n, o, s) {
    n.child = e === null ? wf(n, null, o, s) : Fr(n, e.child, o, s);
  }
  function ed(e, n, o, s, c) {
    o = o.render;
    var d = n.ref;
    return Hr(n, c), s = Ru(e, n, o, s, d, c), o = Du(), e !== null && !lt ? (n.updateQueue = e.updateQueue, n.flags &= -2053, e.lanes &= ~c, an(e, n, c)) : (De && o && yu(n), n.flags |= 1, rt(e, n, s, c), n.child);
  }
  function td(e, n, o, s, c) {
    if (e === null) {
      var d = o.type;
      return typeof d == "function" && !fa(d) && d.defaultProps === void 0 && o.compare === null && o.defaultProps === void 0 ? (n.tag = 15, n.type = d, nd(e, n, d, s, c)) : (e = Rs(o.type, null, s, n, n.mode, c), e.ref = n.ref, e.return = n, n.child = e);
    }
    if (d = e.child, (e.lanes & c) === 0) {
      var w = d.memoizedProps;
      if (o = o.compare, o = o !== null ? o : Ao, o(w, s) && e.ref === n.ref) return an(e, n, c);
    }
    return n.flags |= 1, e = jn(d, s), e.ref = n.ref, e.return = n, n.child = e;
  }
  function nd(e, n, o, s, c) {
    if (e !== null) {
      var d = e.memoizedProps;
      if (Ao(d, s) && e.ref === n.ref) if (lt = !1, n.pendingProps = s = d, (e.lanes & c) !== 0) (e.flags & 131072) !== 0 && (lt = !0);
      else return n.lanes = e.lanes, an(e, n, c);
    }
    return Wu(e, n, o, s, c);
  }
  function rd(e, n, o) {
    var s = n.pendingProps, c = s.children, d = e !== null ? e.memoizedState : null;
    if (s.mode === "hidden") if ((n.mode & 1) === 0) n.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, Le(Wr, vt), vt |= o;
    else {
      if ((o & 1073741824) === 0) return e = d !== null ? d.baseLanes | o : o, n.lanes = n.childLanes = 1073741824, n.memoizedState = { baseLanes: e, cachePool: null, transitions: null }, n.updateQueue = null, Le(Wr, vt), vt |= e, null;
      n.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, s = d !== null ? d.baseLanes : o, Le(Wr, vt), vt |= s;
    }
    else d !== null ? (s = d.baseLanes | o, n.memoizedState = null) : s = o, Le(Wr, vt), vt |= s;
    return rt(e, n, c, o), n.child;
  }
  function od(e, n) {
    var o = n.ref;
    (e === null && o !== null || e !== null && e.ref !== o) && (n.flags |= 512, n.flags |= 2097152);
  }
  function Wu(e, n, o, s, c) {
    var d = st(o) ? qn : Je.current;
    return d = Rr(n, d), Hr(n, c), o = Ru(e, n, o, s, d, c), s = Du(), e !== null && !lt ? (n.updateQueue = e.updateQueue, n.flags &= -2053, e.lanes &= ~c, an(e, n, c)) : (De && s && yu(n), n.flags |= 1, rt(e, n, o, c), n.child);
  }
  function id(e, n, o, s, c) {
    if (st(o)) {
      var d = !0;
      is(n);
    } else d = !1;
    if (Hr(n, c), n.stateNode === null) Es(e, n), bf(n, o, s), Vu(n, o, s, c), s = !0;
    else if (e === null) {
      var w = n.stateNode, P = n.memoizedProps;
      w.props = P;
      var L = w.context, Q = o.contextType;
      typeof Q == "object" && Q !== null ? Q = Ct(Q) : (Q = st(o) ? qn : Je.current, Q = Rr(n, Q));
      var re = o.getDerivedStateFromProps, oe = typeof re == "function" || typeof w.getSnapshotBeforeUpdate == "function";
      oe || typeof w.UNSAFE_componentWillReceiveProps != "function" && typeof w.componentWillReceiveProps != "function" || (P !== s || L !== Q) && Qf(n, w, s, Q), zn = !1;
      var ne = n.memoizedState;
      w.state = ne, ps(n, s, w, c), L = n.memoizedState, P !== s || ne !== L || it.current || zn ? (typeof re == "function" && (Hu(n, o, re, s), L = n.memoizedState), (P = zn || Xf(n, o, P, s, ne, L, Q)) ? (oe || typeof w.UNSAFE_componentWillMount != "function" && typeof w.componentWillMount != "function" || (typeof w.componentWillMount == "function" && w.componentWillMount(), typeof w.UNSAFE_componentWillMount == "function" && w.UNSAFE_componentWillMount()), typeof w.componentDidMount == "function" && (n.flags |= 4194308)) : (typeof w.componentDidMount == "function" && (n.flags |= 4194308), n.memoizedProps = s, n.memoizedState = L), w.props = s, w.state = L, w.context = Q, s = P) : (typeof w.componentDidMount == "function" && (n.flags |= 4194308), s = !1);
    } else {
      w = n.stateNode, Sf(e, n), P = n.memoizedProps, Q = n.type === n.elementType ? P : At(n.type, P), w.props = Q, oe = n.pendingProps, ne = w.context, L = o.contextType, typeof L == "object" && L !== null ? L = Ct(L) : (L = st(o) ? qn : Je.current, L = Rr(n, L));
      var fe = o.getDerivedStateFromProps;
      (re = typeof fe == "function" || typeof w.getSnapshotBeforeUpdate == "function") || typeof w.UNSAFE_componentWillReceiveProps != "function" && typeof w.componentWillReceiveProps != "function" || (P !== oe || ne !== L) && Qf(n, w, s, L), zn = !1, ne = n.memoizedState, w.state = ne, ps(n, s, w, c);
      var he = n.memoizedState;
      P !== oe || ne !== he || it.current || zn ? (typeof fe == "function" && (Hu(n, o, fe, s), he = n.memoizedState), (Q = zn || Xf(n, o, Q, s, ne, he, L) || !1) ? (re || typeof w.UNSAFE_componentWillUpdate != "function" && typeof w.componentWillUpdate != "function" || (typeof w.componentWillUpdate == "function" && w.componentWillUpdate(s, he, L), typeof w.UNSAFE_componentWillUpdate == "function" && w.UNSAFE_componentWillUpdate(s, he, L)), typeof w.componentDidUpdate == "function" && (n.flags |= 4), typeof w.getSnapshotBeforeUpdate == "function" && (n.flags |= 1024)) : (typeof w.componentDidUpdate != "function" || P === e.memoizedProps && ne === e.memoizedState || (n.flags |= 4), typeof w.getSnapshotBeforeUpdate != "function" || P === e.memoizedProps && ne === e.memoizedState || (n.flags |= 1024), n.memoizedProps = s, n.memoizedState = he), w.props = s, w.state = he, w.context = L, s = Q) : (typeof w.componentDidUpdate != "function" || P === e.memoizedProps && ne === e.memoizedState || (n.flags |= 4), typeof w.getSnapshotBeforeUpdate != "function" || P === e.memoizedProps && ne === e.memoizedState || (n.flags |= 1024), s = !1);
    }
    return Yu(e, n, o, s, d, c);
  }
  function Yu(e, n, o, s, c, d) {
    od(e, n);
    var w = (n.flags & 128) !== 0;
    if (!s && !w) return c && cf(n, o, !1), an(e, n, d);
    s = n.stateNode, Jm.current = n;
    var P = w && typeof o.getDerivedStateFromError != "function" ? null : s.render();
    return n.flags |= 1, e !== null && w ? (n.child = Fr(n, e.child, null, d), n.child = Fr(n, null, P, d)) : rt(e, n, P, d), n.memoizedState = s.state, c && cf(n, o, !0), n.child;
  }
  function sd(e) {
    var n = e.stateNode;
    n.pendingContext ? uf(e, n.pendingContext, n.pendingContext !== n.context) : n.context && uf(e, n.context, !1), Pu(e, n.containerInfo);
  }
  function ld(e, n, o, s, c) {
    return jr(), Su(c), n.flags |= 256, rt(e, n, o, s), n.child;
  }
  var Xu = { dehydrated: null, treeContext: null, retryLane: 0 };
  function bu(e) {
    return { baseLanes: e, cachePool: null, transitions: null };
  }
  function ud(e, n, o) {
    var s = n.pendingProps, c = Oe.current, d = !1, w = (n.flags & 128) !== 0, P;
    if ((P = w) || (P = e !== null && e.memoizedState === null ? !1 : (c & 2) !== 0), P ? (d = !0, n.flags &= -129) : (e === null || e.memoizedState !== null) && (c |= 1), Le(Oe, c & 1), e === null)
      return xu(n), e = n.memoizedState, e !== null && (e = e.dehydrated, e !== null) ? ((n.mode & 1) === 0 ? n.lanes = 1 : e.data === "$!" ? n.lanes = 8 : n.lanes = 1073741824, null) : (w = s.children, e = s.fallback, d ? (s = n.mode, d = n.child, w = { mode: "hidden", children: w }, (s & 1) === 0 && d !== null ? (d.childLanes = 0, d.pendingProps = w) : d = Ds(w, s, 0, null), e = lr(e, s, o, null), d.return = n, e.return = n, d.sibling = e, n.child = d, n.child.memoizedState = bu(o), n.memoizedState = Xu, e) : Qu(n, w));
    if (c = e.memoizedState, c !== null && (P = c.dehydrated, P !== null)) return e0(e, n, w, s, P, c, o);
    if (d) {
      d = s.fallback, w = n.mode, c = e.child, P = c.sibling;
      var L = { mode: "hidden", children: s.children };
      return (w & 1) === 0 && n.child !== c ? (s = n.child, s.childLanes = 0, s.pendingProps = L, n.deletions = null) : (s = jn(c, L), s.subtreeFlags = c.subtreeFlags & 14680064), P !== null ? d = jn(P, d) : (d = lr(d, w, o, null), d.flags |= 2), d.return = n, s.return = n, s.sibling = d, n.child = s, s = d, d = n.child, w = e.child.memoizedState, w = w === null ? bu(o) : { baseLanes: w.baseLanes | o, cachePool: null, transitions: w.transitions }, d.memoizedState = w, d.childLanes = e.childLanes & ~o, n.memoizedState = Xu, s;
    }
    return d = e.child, e = d.sibling, s = jn(d, { mode: "visible", children: s.children }), (n.mode & 1) === 0 && (s.lanes = o), s.return = n, s.sibling = null, e !== null && (o = n.deletions, o === null ? (n.deletions = [e], n.flags |= 16) : o.push(e)), n.child = s, n.memoizedState = null, s;
  }
  function Qu(e, n) {
    return n = Ds({ mode: "visible", children: n }, e.mode, 0, null), n.return = e, e.child = n;
  }
  function _s(e, n, o, s) {
    return s !== null && Su(s), Fr(n, e.child, null, o), e = Qu(n, n.pendingProps.children), e.flags |= 2, n.memoizedState = null, e;
  }
  function e0(e, n, o, s, c, d, w) {
    if (o)
      return n.flags & 256 ? (n.flags &= -257, s = Bu(Error(i(422))), _s(e, n, w, s)) : n.memoizedState !== null ? (n.child = e.child, n.flags |= 128, null) : (d = s.fallback, c = n.mode, s = Ds({ mode: "visible", children: s.children }, c, 0, null), d = lr(d, c, w, null), d.flags |= 2, s.return = n, d.return = n, s.sibling = d, n.child = s, (n.mode & 1) !== 0 && Fr(n, e.child, null, w), n.child.memoizedState = bu(w), n.memoizedState = Xu, d);
    if ((n.mode & 1) === 0) return _s(e, n, w, null);
    if (c.data === "$!") {
      if (s = c.nextSibling && c.nextSibling.dataset, s) var P = s.dgst;
      return s = P, d = Error(i(419)), s = Bu(d, s, void 0), _s(e, n, w, s);
    }
    if (P = (w & e.childLanes) !== 0, lt || P) {
      if (s = Ge, s !== null) {
        switch (w & -w) {
          case 4:
            c = 2;
            break;
          case 16:
            c = 8;
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
            c = 32;
            break;
          case 536870912:
            c = 268435456;
            break;
          default:
            c = 0;
        }
        c = (c & (s.suspendedLanes | w)) !== 0 ? 0 : c, c !== 0 && c !== d.retryLane && (d.retryLane = c, ln(e, c), $t(s, e, c, -1));
      }
      return ca(), s = Bu(Error(i(421))), _s(e, n, w, s);
    }
    return c.data === "$?" ? (n.flags |= 128, n.child = e.child, n = h0.bind(null, e), c._reactRetry = n, null) : (e = d.treeContext, yt = Cn(c.nextSibling), mt = n, De = !0, Lt = null, e !== null && (kt[Nt++] = on, kt[Nt++] = sn, kt[Nt++] = Zn, on = e.id, sn = e.overflow, Zn = n), n = Qu(n, s.children), n.flags |= 4096, n);
  }
  function ad(e, n, o) {
    e.lanes |= n;
    var s = e.alternate;
    s !== null && (s.lanes |= n), Nu(e.return, n, o);
  }
  function Gu(e, n, o, s, c) {
    var d = e.memoizedState;
    d === null ? e.memoizedState = { isBackwards: n, rendering: null, renderingStartTime: 0, last: s, tail: o, tailMode: c } : (d.isBackwards = n, d.rendering = null, d.renderingStartTime = 0, d.last = s, d.tail = o, d.tailMode = c);
  }
  function cd(e, n, o) {
    var s = n.pendingProps, c = s.revealOrder, d = s.tail;
    if (rt(e, n, s.children, o), s = Oe.current, (s & 2) !== 0) s = s & 1 | 2, n.flags |= 128;
    else {
      if (e !== null && (e.flags & 128) !== 0) e: for (e = n.child; e !== null; ) {
        if (e.tag === 13) e.memoizedState !== null && ad(e, o, n);
        else if (e.tag === 19) ad(e, o, n);
        else if (e.child !== null) {
          e.child.return = e, e = e.child;
          continue;
        }
        if (e === n) break e;
        for (; e.sibling === null; ) {
          if (e.return === null || e.return === n) break e;
          e = e.return;
        }
        e.sibling.return = e.return, e = e.sibling;
      }
      s &= 1;
    }
    if (Le(Oe, s), (n.mode & 1) === 0) n.memoizedState = null;
    else switch (c) {
      case "forwards":
        for (o = n.child, c = null; o !== null; ) e = o.alternate, e !== null && gs(e) === null && (c = o), o = o.sibling;
        o = c, o === null ? (c = n.child, n.child = null) : (c = o.sibling, o.sibling = null), Gu(n, !1, c, o, d);
        break;
      case "backwards":
        for (o = null, c = n.child, n.child = null; c !== null; ) {
          if (e = c.alternate, e !== null && gs(e) === null) {
            n.child = c;
            break;
          }
          e = c.sibling, c.sibling = o, o = c, c = e;
        }
        Gu(n, !0, o, null, d);
        break;
      case "together":
        Gu(n, !1, null, null, void 0);
        break;
      default:
        n.memoizedState = null;
    }
    return n.child;
  }
  function Es(e, n) {
    (n.mode & 1) === 0 && e !== null && (e.alternate = null, n.alternate = null, n.flags |= 2);
  }
  function an(e, n, o) {
    if (e !== null && (n.dependencies = e.dependencies), rr |= n.lanes, (o & n.childLanes) === 0) return null;
    if (e !== null && n.child !== e.child) throw Error(i(153));
    if (n.child !== null) {
      for (e = n.child, o = jn(e, e.pendingProps), n.child = o, o.return = n; e.sibling !== null; ) e = e.sibling, o = o.sibling = jn(e, e.pendingProps), o.return = n;
      o.sibling = null;
    }
    return n.child;
  }
  function t0(e, n, o) {
    switch (n.tag) {
      case 3:
        sd(n), jr();
        break;
      case 5:
        kf(n);
        break;
      case 1:
        st(n.type) && is(n);
        break;
      case 4:
        Pu(n, n.stateNode.containerInfo);
        break;
      case 10:
        var s = n.type._context, c = n.memoizedProps.value;
        Le(fs, s._currentValue), s._currentValue = c;
        break;
      case 13:
        if (s = n.memoizedState, s !== null)
          return s.dehydrated !== null ? (Le(Oe, Oe.current & 1), n.flags |= 128, null) : (o & n.child.childLanes) !== 0 ? ud(e, n, o) : (Le(Oe, Oe.current & 1), e = an(e, n, o), e !== null ? e.sibling : null);
        Le(Oe, Oe.current & 1);
        break;
      case 19:
        if (s = (o & n.childLanes) !== 0, (e.flags & 128) !== 0) {
          if (s) return cd(e, n, o);
          n.flags |= 128;
        }
        if (c = n.memoizedState, c !== null && (c.rendering = null, c.tail = null, c.lastEffect = null), Le(Oe, Oe.current), s) break;
        return null;
      case 22:
      case 23:
        return n.lanes = 0, rd(e, n, o);
    }
    return an(e, n, o);
  }
  var fd, Ku, dd, hd;
  fd = function(e, n) {
    for (var o = n.child; o !== null; ) {
      if (o.tag === 5 || o.tag === 6) e.appendChild(o.stateNode);
      else if (o.tag !== 4 && o.child !== null) {
        o.child.return = o, o = o.child;
        continue;
      }
      if (o === n) break;
      for (; o.sibling === null; ) {
        if (o.return === null || o.return === n) return;
        o = o.return;
      }
      o.sibling.return = o.return, o = o.sibling;
    }
  }, Ku = function() {
  }, dd = function(e, n, o, s) {
    var c = e.memoizedProps;
    if (c !== s) {
      e = n.stateNode, tr(Yt.current);
      var d = null;
      switch (o) {
        case "input":
          c = Ne(e, c), s = Ne(e, s), d = [];
          break;
        case "select":
          c = V({}, c, { value: void 0 }), s = V({}, s, { value: void 0 }), d = [];
          break;
        case "textarea":
          c = Zt(e, c), s = Zt(e, s), d = [];
          break;
        default:
          typeof c.onClick != "function" && typeof s.onClick == "function" && (e.onclick = ns);
      }
      ao(o, s);
      var w;
      o = null;
      for (Q in c) if (!s.hasOwnProperty(Q) && c.hasOwnProperty(Q) && c[Q] != null) if (Q === "style") {
        var P = c[Q];
        for (w in P) P.hasOwnProperty(w) && (o || (o = {}), o[w] = "");
      } else Q !== "dangerouslySetInnerHTML" && Q !== "children" && Q !== "suppressContentEditableWarning" && Q !== "suppressHydrationWarning" && Q !== "autoFocus" && (u.hasOwnProperty(Q) ? d || (d = []) : (d = d || []).push(Q, null));
      for (Q in s) {
        var L = s[Q];
        if (P = c != null ? c[Q] : void 0, s.hasOwnProperty(Q) && L !== P && (L != null || P != null)) if (Q === "style") if (P) {
          for (w in P) !P.hasOwnProperty(w) || L && L.hasOwnProperty(w) || (o || (o = {}), o[w] = "");
          for (w in L) L.hasOwnProperty(w) && P[w] !== L[w] && (o || (o = {}), o[w] = L[w]);
        } else o || (d || (d = []), d.push(
          Q,
          o
        )), o = L;
        else Q === "dangerouslySetInnerHTML" ? (L = L ? L.__html : void 0, P = P ? P.__html : void 0, L != null && P !== L && (d = d || []).push(Q, L)) : Q === "children" ? typeof L != "string" && typeof L != "number" || (d = d || []).push(Q, "" + L) : Q !== "suppressContentEditableWarning" && Q !== "suppressHydrationWarning" && (u.hasOwnProperty(Q) ? (L != null && Q === "onScroll" && Ae("scroll", e), d || P === L || (d = [])) : (d = d || []).push(Q, L));
      }
      o && (d = d || []).push("style", o);
      var Q = d;
      (n.updateQueue = Q) && (n.flags |= 4);
    }
  }, hd = function(e, n, o, s) {
    o !== s && (n.flags |= 4);
  };
  function Qo(e, n) {
    if (!De) switch (e.tailMode) {
      case "hidden":
        n = e.tail;
        for (var o = null; n !== null; ) n.alternate !== null && (o = n), n = n.sibling;
        o === null ? e.tail = null : o.sibling = null;
        break;
      case "collapsed":
        o = e.tail;
        for (var s = null; o !== null; ) o.alternate !== null && (s = o), o = o.sibling;
        s === null ? n || e.tail === null ? e.tail = null : e.tail.sibling = null : s.sibling = null;
    }
  }
  function tt(e) {
    var n = e.alternate !== null && e.alternate.child === e.child, o = 0, s = 0;
    if (n) for (var c = e.child; c !== null; ) o |= c.lanes | c.childLanes, s |= c.subtreeFlags & 14680064, s |= c.flags & 14680064, c.return = e, c = c.sibling;
    else for (c = e.child; c !== null; ) o |= c.lanes | c.childLanes, s |= c.subtreeFlags, s |= c.flags, c.return = e, c = c.sibling;
    return e.subtreeFlags |= s, e.childLanes = o, n;
  }
  function n0(e, n, o) {
    var s = n.pendingProps;
    switch (vu(n), n.tag) {
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
        return tt(n), null;
      case 1:
        return st(n.type) && os(), tt(n), null;
      case 3:
        return s = n.stateNode, Vr(), Re(it), Re(Je), Iu(), s.pendingContext && (s.context = s.pendingContext, s.pendingContext = null), (e === null || e.child === null) && (as(n) ? n.flags |= 4 : e === null || e.memoizedState.isDehydrated && (n.flags & 256) === 0 || (n.flags |= 1024, Lt !== null && (la(Lt), Lt = null))), Ku(e, n), tt(n), null;
      case 5:
        Tu(n);
        var c = tr(Uo.current);
        if (o = n.type, e !== null && n.stateNode != null) dd(e, n, o, s, c), e.ref !== n.ref && (n.flags |= 512, n.flags |= 2097152);
        else {
          if (!s) {
            if (n.stateNode === null) throw Error(i(166));
            return tt(n), null;
          }
          if (e = tr(Yt.current), as(n)) {
            s = n.stateNode, o = n.type;
            var d = n.memoizedProps;
            switch (s[Wt] = n, s[Fo] = d, e = (n.mode & 1) !== 0, o) {
              case "dialog":
                Ae("cancel", s), Ae("close", s);
                break;
              case "iframe":
              case "object":
              case "embed":
                Ae("load", s);
                break;
              case "video":
              case "audio":
                for (c = 0; c < Do.length; c++) Ae(Do[c], s);
                break;
              case "source":
                Ae("error", s);
                break;
              case "img":
              case "image":
              case "link":
                Ae(
                  "error",
                  s
                ), Ae("load", s);
                break;
              case "details":
                Ae("toggle", s);
                break;
              case "input":
                Ie(s, d), Ae("invalid", s);
                break;
              case "select":
                s._wrapperState = { wasMultiple: !!d.multiple }, Ae("invalid", s);
                break;
              case "textarea":
                yn(s, d), Ae("invalid", s);
            }
            ao(o, d), c = null;
            for (var w in d) if (d.hasOwnProperty(w)) {
              var P = d[w];
              w === "children" ? typeof P == "string" ? s.textContent !== P && (d.suppressHydrationWarning !== !0 && ts(s.textContent, P, e), c = ["children", P]) : typeof P == "number" && s.textContent !== "" + P && (d.suppressHydrationWarning !== !0 && ts(
                s.textContent,
                P,
                e
              ), c = ["children", "" + P]) : u.hasOwnProperty(w) && P != null && w === "onScroll" && Ae("scroll", s);
            }
            switch (o) {
              case "input":
                _e(s), zt(s, d, !0);
                break;
              case "textarea":
                _e(s), Bn(s);
                break;
              case "select":
              case "option":
                break;
              default:
                typeof d.onClick == "function" && (s.onclick = ns);
            }
            s = c, n.updateQueue = s, s !== null && (n.flags |= 4);
          } else {
            w = c.nodeType === 9 ? c : c.ownerDocument, e === "http://www.w3.org/1999/xhtml" && (e = Jt(o)), e === "http://www.w3.org/1999/xhtml" ? o === "script" ? (e = w.createElement("div"), e.innerHTML = "<script><\/script>", e = e.removeChild(e.firstChild)) : typeof s.is == "string" ? e = w.createElement(o, { is: s.is }) : (e = w.createElement(o), o === "select" && (w = e, s.multiple ? w.multiple = !0 : s.size && (w.size = s.size))) : e = w.createElementNS(e, o), e[Wt] = n, e[Fo] = s, fd(e, n, !1, !1), n.stateNode = e;
            e: {
              switch (w = co(o, s), o) {
                case "dialog":
                  Ae("cancel", e), Ae("close", e), c = s;
                  break;
                case "iframe":
                case "object":
                case "embed":
                  Ae("load", e), c = s;
                  break;
                case "video":
                case "audio":
                  for (c = 0; c < Do.length; c++) Ae(Do[c], e);
                  c = s;
                  break;
                case "source":
                  Ae("error", e), c = s;
                  break;
                case "img":
                case "image":
                case "link":
                  Ae(
                    "error",
                    e
                  ), Ae("load", e), c = s;
                  break;
                case "details":
                  Ae("toggle", e), c = s;
                  break;
                case "input":
                  Ie(e, s), c = Ne(e, s), Ae("invalid", e);
                  break;
                case "option":
                  c = s;
                  break;
                case "select":
                  e._wrapperState = { wasMultiple: !!s.multiple }, c = V({}, s, { value: void 0 }), Ae("invalid", e);
                  break;
                case "textarea":
                  yn(e, s), c = Zt(e, s), Ae("invalid", e);
                  break;
                default:
                  c = s;
              }
              ao(o, c), P = c;
              for (d in P) if (P.hasOwnProperty(d)) {
                var L = P[d];
                d === "style" ? Ci(e, L) : d === "dangerouslySetInnerHTML" ? (L = L ? L.__html : void 0, L != null && ki(e, L)) : d === "children" ? typeof L == "string" ? (o !== "textarea" || L !== "") && tn(e, L) : typeof L == "number" && tn(e, "" + L) : d !== "suppressContentEditableWarning" && d !== "suppressHydrationWarning" && d !== "autoFocus" && (u.hasOwnProperty(d) ? L != null && d === "onScroll" && Ae("scroll", e) : L != null && _(e, d, L, w));
              }
              switch (o) {
                case "input":
                  _e(e), zt(e, s, !1);
                  break;
                case "textarea":
                  _e(e), Bn(e);
                  break;
                case "option":
                  s.value != null && e.setAttribute("value", "" + J(s.value));
                  break;
                case "select":
                  e.multiple = !!s.multiple, d = s.value, d != null ? _t(e, !!s.multiple, d, !1) : s.defaultValue != null && _t(
                    e,
                    !!s.multiple,
                    s.defaultValue,
                    !0
                  );
                  break;
                default:
                  typeof c.onClick == "function" && (e.onclick = ns);
              }
              switch (o) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  s = !!s.autoFocus;
                  break e;
                case "img":
                  s = !0;
                  break e;
                default:
                  s = !1;
              }
            }
            s && (n.flags |= 4);
          }
          n.ref !== null && (n.flags |= 512, n.flags |= 2097152);
        }
        return tt(n), null;
      case 6:
        if (e && n.stateNode != null) hd(e, n, e.memoizedProps, s);
        else {
          if (typeof s != "string" && n.stateNode === null) throw Error(i(166));
          if (o = tr(Uo.current), tr(Yt.current), as(n)) {
            if (s = n.stateNode, o = n.memoizedProps, s[Wt] = n, (d = s.nodeValue !== o) && (e = mt, e !== null)) switch (e.tag) {
              case 3:
                ts(s.nodeValue, o, (e.mode & 1) !== 0);
                break;
              case 5:
                e.memoizedProps.suppressHydrationWarning !== !0 && ts(s.nodeValue, o, (e.mode & 1) !== 0);
            }
            d && (n.flags |= 4);
          } else s = (o.nodeType === 9 ? o : o.ownerDocument).createTextNode(s), s[Wt] = n, n.stateNode = s;
        }
        return tt(n), null;
      case 13:
        if (Re(Oe), s = n.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
          if (De && yt !== null && (n.mode & 1) !== 0 && (n.flags & 128) === 0) mf(), jr(), n.flags |= 98560, d = !1;
          else if (d = as(n), s !== null && s.dehydrated !== null) {
            if (e === null) {
              if (!d) throw Error(i(318));
              if (d = n.memoizedState, d = d !== null ? d.dehydrated : null, !d) throw Error(i(317));
              d[Wt] = n;
            } else jr(), (n.flags & 128) === 0 && (n.memoizedState = null), n.flags |= 4;
            tt(n), d = !1;
          } else Lt !== null && (la(Lt), Lt = null), d = !0;
          if (!d) return n.flags & 65536 ? n : null;
        }
        return (n.flags & 128) !== 0 ? (n.lanes = o, n) : (s = s !== null, s !== (e !== null && e.memoizedState !== null) && s && (n.child.flags |= 8192, (n.mode & 1) !== 0 && (e === null || (Oe.current & 1) !== 0 ? be === 0 && (be = 3) : ca())), n.updateQueue !== null && (n.flags |= 4), tt(n), null);
      case 4:
        return Vr(), Ku(e, n), e === null && $o(n.stateNode.containerInfo), tt(n), null;
      case 10:
        return ku(n.type._context), tt(n), null;
      case 17:
        return st(n.type) && os(), tt(n), null;
      case 19:
        if (Re(Oe), d = n.memoizedState, d === null) return tt(n), null;
        if (s = (n.flags & 128) !== 0, w = d.rendering, w === null) if (s) Qo(d, !1);
        else {
          if (be !== 0 || e !== null && (e.flags & 128) !== 0) for (e = n.child; e !== null; ) {
            if (w = gs(e), w !== null) {
              for (n.flags |= 128, Qo(d, !1), s = w.updateQueue, s !== null && (n.updateQueue = s, n.flags |= 4), n.subtreeFlags = 0, s = o, o = n.child; o !== null; ) d = o, e = s, d.flags &= 14680066, w = d.alternate, w === null ? (d.childLanes = 0, d.lanes = e, d.child = null, d.subtreeFlags = 0, d.memoizedProps = null, d.memoizedState = null, d.updateQueue = null, d.dependencies = null, d.stateNode = null) : (d.childLanes = w.childLanes, d.lanes = w.lanes, d.child = w.child, d.subtreeFlags = 0, d.deletions = null, d.memoizedProps = w.memoizedProps, d.memoizedState = w.memoizedState, d.updateQueue = w.updateQueue, d.type = w.type, e = w.dependencies, d.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }), o = o.sibling;
              return Le(Oe, Oe.current & 1 | 2), n.child;
            }
            e = e.sibling;
          }
          d.tail !== null && Fe() > Yr && (n.flags |= 128, s = !0, Qo(d, !1), n.lanes = 4194304);
        }
        else {
          if (!s) if (e = gs(w), e !== null) {
            if (n.flags |= 128, s = !0, o = e.updateQueue, o !== null && (n.updateQueue = o, n.flags |= 4), Qo(d, !0), d.tail === null && d.tailMode === "hidden" && !w.alternate && !De) return tt(n), null;
          } else 2 * Fe() - d.renderingStartTime > Yr && o !== 1073741824 && (n.flags |= 128, s = !0, Qo(d, !1), n.lanes = 4194304);
          d.isBackwards ? (w.sibling = n.child, n.child = w) : (o = d.last, o !== null ? o.sibling = w : n.child = w, d.last = w);
        }
        return d.tail !== null ? (n = d.tail, d.rendering = n, d.tail = n.sibling, d.renderingStartTime = Fe(), n.sibling = null, o = Oe.current, Le(Oe, s ? o & 1 | 2 : o & 1), n) : (tt(n), null);
      case 22:
      case 23:
        return aa(), s = n.memoizedState !== null, e !== null && e.memoizedState !== null !== s && (n.flags |= 8192), s && (n.mode & 1) !== 0 ? (vt & 1073741824) !== 0 && (tt(n), n.subtreeFlags & 6 && (n.flags |= 8192)) : tt(n), null;
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(i(156, n.tag));
  }
  function r0(e, n) {
    switch (vu(n), n.tag) {
      case 1:
        return st(n.type) && os(), e = n.flags, e & 65536 ? (n.flags = e & -65537 | 128, n) : null;
      case 3:
        return Vr(), Re(it), Re(Je), Iu(), e = n.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (n.flags = e & -65537 | 128, n) : null;
      case 5:
        return Tu(n), null;
      case 13:
        if (Re(Oe), e = n.memoizedState, e !== null && e.dehydrated !== null) {
          if (n.alternate === null) throw Error(i(340));
          jr();
        }
        return e = n.flags, e & 65536 ? (n.flags = e & -65537 | 128, n) : null;
      case 19:
        return Re(Oe), null;
      case 4:
        return Vr(), null;
      case 10:
        return ku(n.type._context), null;
      case 22:
      case 23:
        return aa(), null;
      case 24:
        return null;
      default:
        return null;
    }
  }
  var ks = !1, nt = !1, o0 = typeof WeakSet == "function" ? WeakSet : Set, de = null;
  function Ur(e, n) {
    var o = e.ref;
    if (o !== null) if (typeof o == "function") try {
      o(null);
    } catch (s) {
      Ve(e, n, s);
    }
    else o.current = null;
  }
  function qu(e, n, o) {
    try {
      o();
    } catch (s) {
      Ve(e, n, s);
    }
  }
  var pd = !1;
  function i0(e, n) {
    if (au = Wi, e = Yc(), tu(e)) {
      if ("selectionStart" in e) var o = { start: e.selectionStart, end: e.selectionEnd };
      else e: {
        o = (o = e.ownerDocument) && o.defaultView || window;
        var s = o.getSelection && o.getSelection();
        if (s && s.rangeCount !== 0) {
          o = s.anchorNode;
          var c = s.anchorOffset, d = s.focusNode;
          s = s.focusOffset;
          try {
            o.nodeType, d.nodeType;
          } catch {
            o = null;
            break e;
          }
          var w = 0, P = -1, L = -1, Q = 0, re = 0, oe = e, ne = null;
          t: for (; ; ) {
            for (var fe; oe !== o || c !== 0 && oe.nodeType !== 3 || (P = w + c), oe !== d || s !== 0 && oe.nodeType !== 3 || (L = w + s), oe.nodeType === 3 && (w += oe.nodeValue.length), (fe = oe.firstChild) !== null; )
              ne = oe, oe = fe;
            for (; ; ) {
              if (oe === e) break t;
              if (ne === o && ++Q === c && (P = w), ne === d && ++re === s && (L = w), (fe = oe.nextSibling) !== null) break;
              oe = ne, ne = oe.parentNode;
            }
            oe = fe;
          }
          o = P === -1 || L === -1 ? null : { start: P, end: L };
        } else o = null;
      }
      o = o || { start: 0, end: 0 };
    } else o = null;
    for (cu = { focusedElem: e, selectionRange: o }, Wi = !1, de = n; de !== null; ) if (n = de, e = n.child, (n.subtreeFlags & 1028) !== 0 && e !== null) e.return = n, de = e;
    else for (; de !== null; ) {
      n = de;
      try {
        var he = n.alternate;
        if ((n.flags & 1024) !== 0) switch (n.tag) {
          case 0:
          case 11:
          case 15:
            break;
          case 1:
            if (he !== null) {
              var pe = he.memoizedProps, Be = he.memoizedState, B = n.stateNode, $ = B.getSnapshotBeforeUpdate(n.elementType === n.type ? pe : At(n.type, pe), Be);
              B.__reactInternalSnapshotBeforeUpdate = $;
            }
            break;
          case 3:
            var W = n.stateNode.containerInfo;
            W.nodeType === 1 ? W.textContent = "" : W.nodeType === 9 && W.documentElement && W.removeChild(W.documentElement);
            break;
          case 5:
          case 6:
          case 4:
          case 17:
            break;
          default:
            throw Error(i(163));
        }
      } catch (se) {
        Ve(n, n.return, se);
      }
      if (e = n.sibling, e !== null) {
        e.return = n.return, de = e;
        break;
      }
      de = n.return;
    }
    return he = pd, pd = !1, he;
  }
  function Go(e, n, o) {
    var s = n.updateQueue;
    if (s = s !== null ? s.lastEffect : null, s !== null) {
      var c = s = s.next;
      do {
        if ((c.tag & e) === e) {
          var d = c.destroy;
          c.destroy = void 0, d !== void 0 && qu(n, o, d);
        }
        c = c.next;
      } while (c !== s);
    }
  }
  function Ns(e, n) {
    if (n = n.updateQueue, n = n !== null ? n.lastEffect : null, n !== null) {
      var o = n = n.next;
      do {
        if ((o.tag & e) === e) {
          var s = o.create;
          o.destroy = s();
        }
        o = o.next;
      } while (o !== n);
    }
  }
  function Zu(e) {
    var n = e.ref;
    if (n !== null) {
      var o = e.stateNode;
      switch (e.tag) {
        case 5:
          e = o;
          break;
        default:
          e = o;
      }
      typeof n == "function" ? n(e) : n.current = e;
    }
  }
  function gd(e) {
    var n = e.alternate;
    n !== null && (e.alternate = null, gd(n)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (n = e.stateNode, n !== null && (delete n[Wt], delete n[Fo], delete n[pu], delete n[Vm], delete n[Bm])), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
  }
  function md(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 4;
  }
  function yd(e) {
    e: for (; ; ) {
      for (; e.sibling === null; ) {
        if (e.return === null || md(e.return)) return null;
        e = e.return;
      }
      for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
        if (e.flags & 2 || e.child === null || e.tag === 4) continue e;
        e.child.return = e, e = e.child;
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function Ju(e, n, o) {
    var s = e.tag;
    if (s === 5 || s === 6) e = e.stateNode, n ? o.nodeType === 8 ? o.parentNode.insertBefore(e, n) : o.insertBefore(e, n) : (o.nodeType === 8 ? (n = o.parentNode, n.insertBefore(e, o)) : (n = o, n.appendChild(e)), o = o._reactRootContainer, o != null || n.onclick !== null || (n.onclick = ns));
    else if (s !== 4 && (e = e.child, e !== null)) for (Ju(e, n, o), e = e.sibling; e !== null; ) Ju(e, n, o), e = e.sibling;
  }
  function ea(e, n, o) {
    var s = e.tag;
    if (s === 5 || s === 6) e = e.stateNode, n ? o.insertBefore(e, n) : o.appendChild(e);
    else if (s !== 4 && (e = e.child, e !== null)) for (ea(e, n, o), e = e.sibling; e !== null; ) ea(e, n, o), e = e.sibling;
  }
  var qe = null, Rt = !1;
  function Ln(e, n, o) {
    for (o = o.child; o !== null; ) vd(e, n, o), o = o.sibling;
  }
  function vd(e, n, o) {
    if (Et && typeof Et.onCommitFiberUnmount == "function") try {
      Et.onCommitFiberUnmount(Qn, o);
    } catch {
    }
    switch (o.tag) {
      case 5:
        nt || Ur(o, n);
      case 6:
        var s = qe, c = Rt;
        qe = null, Ln(e, n, o), qe = s, Rt = c, qe !== null && (Rt ? (e = qe, o = o.stateNode, e.nodeType === 8 ? e.parentNode.removeChild(o) : e.removeChild(o)) : qe.removeChild(o.stateNode));
        break;
      case 18:
        qe !== null && (Rt ? (e = qe, o = o.stateNode, e.nodeType === 8 ? hu(e.parentNode, o) : e.nodeType === 1 && hu(e, o), Mo(e)) : hu(qe, o.stateNode));
        break;
      case 4:
        s = qe, c = Rt, qe = o.stateNode.containerInfo, Rt = !0, Ln(e, n, o), qe = s, Rt = c;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (!nt && (s = o.updateQueue, s !== null && (s = s.lastEffect, s !== null))) {
          c = s = s.next;
          do {
            var d = c, w = d.destroy;
            d = d.tag, w !== void 0 && ((d & 2) !== 0 || (d & 4) !== 0) && qu(o, n, w), c = c.next;
          } while (c !== s);
        }
        Ln(e, n, o);
        break;
      case 1:
        if (!nt && (Ur(o, n), s = o.stateNode, typeof s.componentWillUnmount == "function")) try {
          s.props = o.memoizedProps, s.state = o.memoizedState, s.componentWillUnmount();
        } catch (P) {
          Ve(o, n, P);
        }
        Ln(e, n, o);
        break;
      case 21:
        Ln(e, n, o);
        break;
      case 22:
        o.mode & 1 ? (nt = (s = nt) || o.memoizedState !== null, Ln(e, n, o), nt = s) : Ln(e, n, o);
        break;
      default:
        Ln(e, n, o);
    }
  }
  function wd(e) {
    var n = e.updateQueue;
    if (n !== null) {
      e.updateQueue = null;
      var o = e.stateNode;
      o === null && (o = e.stateNode = new o0()), n.forEach(function(s) {
        var c = p0.bind(null, e, s);
        o.has(s) || (o.add(s), s.then(c, c));
      });
    }
  }
  function Dt(e, n) {
    var o = n.deletions;
    if (o !== null) for (var s = 0; s < o.length; s++) {
      var c = o[s];
      try {
        var d = e, w = n, P = w;
        e: for (; P !== null; ) {
          switch (P.tag) {
            case 5:
              qe = P.stateNode, Rt = !1;
              break e;
            case 3:
              qe = P.stateNode.containerInfo, Rt = !0;
              break e;
            case 4:
              qe = P.stateNode.containerInfo, Rt = !0;
              break e;
          }
          P = P.return;
        }
        if (qe === null) throw Error(i(160));
        vd(d, w, c), qe = null, Rt = !1;
        var L = c.alternate;
        L !== null && (L.return = null), c.return = null;
      } catch (Q) {
        Ve(c, n, Q);
      }
    }
    if (n.subtreeFlags & 12854) for (n = n.child; n !== null; ) xd(n, e), n = n.sibling;
  }
  function xd(e, n) {
    var o = e.alternate, s = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (Dt(n, e), bt(e), s & 4) {
          try {
            Go(3, e, e.return), Ns(3, e);
          } catch (pe) {
            Ve(e, e.return, pe);
          }
          try {
            Go(5, e, e.return);
          } catch (pe) {
            Ve(e, e.return, pe);
          }
        }
        break;
      case 1:
        Dt(n, e), bt(e), s & 512 && o !== null && Ur(o, o.return);
        break;
      case 5:
        if (Dt(n, e), bt(e), s & 512 && o !== null && Ur(o, o.return), e.flags & 32) {
          var c = e.stateNode;
          try {
            tn(c, "");
          } catch (pe) {
            Ve(e, e.return, pe);
          }
        }
        if (s & 4 && (c = e.stateNode, c != null)) {
          var d = e.memoizedProps, w = o !== null ? o.memoizedProps : d, P = e.type, L = e.updateQueue;
          if (e.updateQueue = null, L !== null) try {
            P === "input" && d.type === "radio" && d.name != null && Ce(c, d), co(P, w);
            var Q = co(P, d);
            for (w = 0; w < L.length; w += 2) {
              var re = L[w], oe = L[w + 1];
              re === "style" ? Ci(c, oe) : re === "dangerouslySetInnerHTML" ? ki(c, oe) : re === "children" ? tn(c, oe) : _(c, re, oe, Q);
            }
            switch (P) {
              case "input":
                Ue(c, d);
                break;
              case "textarea":
                yr(c, d);
                break;
              case "select":
                var ne = c._wrapperState.wasMultiple;
                c._wrapperState.wasMultiple = !!d.multiple;
                var fe = d.value;
                fe != null ? _t(c, !!d.multiple, fe, !1) : ne !== !!d.multiple && (d.defaultValue != null ? _t(
                  c,
                  !!d.multiple,
                  d.defaultValue,
                  !0
                ) : _t(c, !!d.multiple, d.multiple ? [] : "", !1));
            }
            c[Fo] = d;
          } catch (pe) {
            Ve(e, e.return, pe);
          }
        }
        break;
      case 6:
        if (Dt(n, e), bt(e), s & 4) {
          if (e.stateNode === null) throw Error(i(162));
          c = e.stateNode, d = e.memoizedProps;
          try {
            c.nodeValue = d;
          } catch (pe) {
            Ve(e, e.return, pe);
          }
        }
        break;
      case 3:
        if (Dt(n, e), bt(e), s & 4 && o !== null && o.memoizedState.isDehydrated) try {
          Mo(n.containerInfo);
        } catch (pe) {
          Ve(e, e.return, pe);
        }
        break;
      case 4:
        Dt(n, e), bt(e);
        break;
      case 13:
        Dt(n, e), bt(e), c = e.child, c.flags & 8192 && (d = c.memoizedState !== null, c.stateNode.isHidden = d, !d || c.alternate !== null && c.alternate.memoizedState !== null || (ra = Fe())), s & 4 && wd(e);
        break;
      case 22:
        if (re = o !== null && o.memoizedState !== null, e.mode & 1 ? (nt = (Q = nt) || re, Dt(n, e), nt = Q) : Dt(n, e), bt(e), s & 8192) {
          if (Q = e.memoizedState !== null, (e.stateNode.isHidden = Q) && !re && (e.mode & 1) !== 0) for (de = e, re = e.child; re !== null; ) {
            for (oe = de = re; de !== null; ) {
              switch (ne = de, fe = ne.child, ne.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  Go(4, ne, ne.return);
                  break;
                case 1:
                  Ur(ne, ne.return);
                  var he = ne.stateNode;
                  if (typeof he.componentWillUnmount == "function") {
                    s = ne, o = ne.return;
                    try {
                      n = s, he.props = n.memoizedProps, he.state = n.memoizedState, he.componentWillUnmount();
                    } catch (pe) {
                      Ve(s, o, pe);
                    }
                  }
                  break;
                case 5:
                  Ur(ne, ne.return);
                  break;
                case 22:
                  if (ne.memoizedState !== null) {
                    Ed(oe);
                    continue;
                  }
              }
              fe !== null ? (fe.return = ne, de = fe) : Ed(oe);
            }
            re = re.sibling;
          }
          e: for (re = null, oe = e; ; ) {
            if (oe.tag === 5) {
              if (re === null) {
                re = oe;
                try {
                  c = oe.stateNode, Q ? (d = c.style, typeof d.setProperty == "function" ? d.setProperty("display", "none", "important") : d.display = "none") : (P = oe.stateNode, L = oe.memoizedProps.style, w = L != null && L.hasOwnProperty("display") ? L.display : null, P.style.display = Ni("display", w));
                } catch (pe) {
                  Ve(e, e.return, pe);
                }
              }
            } else if (oe.tag === 6) {
              if (re === null) try {
                oe.stateNode.nodeValue = Q ? "" : oe.memoizedProps;
              } catch (pe) {
                Ve(e, e.return, pe);
              }
            } else if ((oe.tag !== 22 && oe.tag !== 23 || oe.memoizedState === null || oe === e) && oe.child !== null) {
              oe.child.return = oe, oe = oe.child;
              continue;
            }
            if (oe === e) break e;
            for (; oe.sibling === null; ) {
              if (oe.return === null || oe.return === e) break e;
              re === oe && (re = null), oe = oe.return;
            }
            re === oe && (re = null), oe.sibling.return = oe.return, oe = oe.sibling;
          }
        }
        break;
      case 19:
        Dt(n, e), bt(e), s & 4 && wd(e);
        break;
      case 21:
        break;
      default:
        Dt(
          n,
          e
        ), bt(e);
    }
  }
  function bt(e) {
    var n = e.flags;
    if (n & 2) {
      try {
        e: {
          for (var o = e.return; o !== null; ) {
            if (md(o)) {
              var s = o;
              break e;
            }
            o = o.return;
          }
          throw Error(i(160));
        }
        switch (s.tag) {
          case 5:
            var c = s.stateNode;
            s.flags & 32 && (tn(c, ""), s.flags &= -33);
            var d = yd(e);
            ea(e, d, c);
            break;
          case 3:
          case 4:
            var w = s.stateNode.containerInfo, P = yd(e);
            Ju(e, P, w);
            break;
          default:
            throw Error(i(161));
        }
      } catch (L) {
        Ve(e, e.return, L);
      }
      e.flags &= -3;
    }
    n & 4096 && (e.flags &= -4097);
  }
  function s0(e, n, o) {
    de = e, Sd(e);
  }
  function Sd(e, n, o) {
    for (var s = (e.mode & 1) !== 0; de !== null; ) {
      var c = de, d = c.child;
      if (c.tag === 22 && s) {
        var w = c.memoizedState !== null || ks;
        if (!w) {
          var P = c.alternate, L = P !== null && P.memoizedState !== null || nt;
          P = ks;
          var Q = nt;
          if (ks = w, (nt = L) && !Q) for (de = c; de !== null; ) w = de, L = w.child, w.tag === 22 && w.memoizedState !== null ? kd(c) : L !== null ? (L.return = w, de = L) : kd(c);
          for (; d !== null; ) de = d, Sd(d), d = d.sibling;
          de = c, ks = P, nt = Q;
        }
        _d(e);
      } else (c.subtreeFlags & 8772) !== 0 && d !== null ? (d.return = c, de = d) : _d(e);
    }
  }
  function _d(e) {
    for (; de !== null; ) {
      var n = de;
      if ((n.flags & 8772) !== 0) {
        var o = n.alternate;
        try {
          if ((n.flags & 8772) !== 0) switch (n.tag) {
            case 0:
            case 11:
            case 15:
              nt || Ns(5, n);
              break;
            case 1:
              var s = n.stateNode;
              if (n.flags & 4 && !nt) if (o === null) s.componentDidMount();
              else {
                var c = n.elementType === n.type ? o.memoizedProps : At(n.type, o.memoizedProps);
                s.componentDidUpdate(c, o.memoizedState, s.__reactInternalSnapshotBeforeUpdate);
              }
              var d = n.updateQueue;
              d !== null && Ef(n, d, s);
              break;
            case 3:
              var w = n.updateQueue;
              if (w !== null) {
                if (o = null, n.child !== null) switch (n.child.tag) {
                  case 5:
                    o = n.child.stateNode;
                    break;
                  case 1:
                    o = n.child.stateNode;
                }
                Ef(n, w, o);
              }
              break;
            case 5:
              var P = n.stateNode;
              if (o === null && n.flags & 4) {
                o = P;
                var L = n.memoizedProps;
                switch (n.type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    L.autoFocus && o.focus();
                    break;
                  case "img":
                    L.src && (o.src = L.src);
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
                var Q = n.alternate;
                if (Q !== null) {
                  var re = Q.memoizedState;
                  if (re !== null) {
                    var oe = re.dehydrated;
                    oe !== null && Mo(oe);
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
              throw Error(i(163));
          }
          nt || n.flags & 512 && Zu(n);
        } catch (ne) {
          Ve(n, n.return, ne);
        }
      }
      if (n === e) {
        de = null;
        break;
      }
      if (o = n.sibling, o !== null) {
        o.return = n.return, de = o;
        break;
      }
      de = n.return;
    }
  }
  function Ed(e) {
    for (; de !== null; ) {
      var n = de;
      if (n === e) {
        de = null;
        break;
      }
      var o = n.sibling;
      if (o !== null) {
        o.return = n.return, de = o;
        break;
      }
      de = n.return;
    }
  }
  function kd(e) {
    for (; de !== null; ) {
      var n = de;
      try {
        switch (n.tag) {
          case 0:
          case 11:
          case 15:
            var o = n.return;
            try {
              Ns(4, n);
            } catch (L) {
              Ve(n, o, L);
            }
            break;
          case 1:
            var s = n.stateNode;
            if (typeof s.componentDidMount == "function") {
              var c = n.return;
              try {
                s.componentDidMount();
              } catch (L) {
                Ve(n, c, L);
              }
            }
            var d = n.return;
            try {
              Zu(n);
            } catch (L) {
              Ve(n, d, L);
            }
            break;
          case 5:
            var w = n.return;
            try {
              Zu(n);
            } catch (L) {
              Ve(n, w, L);
            }
        }
      } catch (L) {
        Ve(n, n.return, L);
      }
      if (n === e) {
        de = null;
        break;
      }
      var P = n.sibling;
      if (P !== null) {
        P.return = n.return, de = P;
        break;
      }
      de = n.return;
    }
  }
  var l0 = Math.ceil, Cs = M.ReactCurrentDispatcher, ta = M.ReactCurrentOwner, Pt = M.ReactCurrentBatchConfig, Pe = 0, Ge = null, We = null, Ze = 0, vt = 0, Wr = Mn(0), be = 0, Ko = null, rr = 0, Ms = 0, na = 0, qo = null, ut = null, ra = 0, Yr = 1 / 0, cn = null, Ps = !1, oa = null, An = null, Ts = !1, Rn = null, zs = 0, Zo = 0, ia = null, Is = -1, Ls = 0;
  function ot() {
    return (Pe & 6) !== 0 ? Fe() : Is !== -1 ? Is : Is = Fe();
  }
  function Dn(e) {
    return (e.mode & 1) === 0 ? 1 : (Pe & 2) !== 0 && Ze !== 0 ? Ze & -Ze : Wm.transition !== null ? (Ls === 0 && (Ls = kr()), Ls) : (e = ze, e !== 0 || (e = window.event, e = e === void 0 ? 16 : Nc(e.type)), e);
  }
  function $t(e, n, o, s) {
    if (50 < Zo) throw Zo = 0, ia = null, Error(i(185));
    Gn(e, o, s), ((Pe & 2) === 0 || e !== Ge) && (e === Ge && ((Pe & 2) === 0 && (Ms |= o), be === 4 && $n(e, Ze)), at(e, s), o === 1 && Pe === 0 && (n.mode & 1) === 0 && (Yr = Fe() + 500, ss && Tn()));
  }
  function at(e, n) {
    var o = e.callbackNode;
    Hl(e, n);
    var s = Er(e, e === Ge ? Ze : 0);
    if (s === 0) o !== null && $i(o), e.callbackNode = null, e.callbackPriority = 0;
    else if (n = s & -s, e.callbackPriority !== n) {
      if (o != null && $i(o), n === 1) e.tag === 0 ? Um(Cd.bind(null, e)) : ff(Cd.bind(null, e)), Om(function() {
        (Pe & 6) === 0 && Tn();
      }), o = null;
      else {
        switch (yc(s)) {
          case 1:
            o = xo;
            break;
          case 4:
            o = Fi;
            break;
          case 16:
            o = xr;
            break;
          case 536870912:
            o = Oi;
            break;
          default:
            o = xr;
        }
        o = Rd(o, Nd.bind(null, e));
      }
      e.callbackPriority = n, e.callbackNode = o;
    }
  }
  function Nd(e, n) {
    if (Is = -1, Ls = 0, (Pe & 6) !== 0) throw Error(i(327));
    var o = e.callbackNode;
    if (Xr() && e.callbackNode !== o) return null;
    var s = Er(e, e === Ge ? Ze : 0);
    if (s === 0) return null;
    if ((s & 30) !== 0 || (s & e.expiredLanes) !== 0 || n) n = As(e, s);
    else {
      n = s;
      var c = Pe;
      Pe |= 2;
      var d = Pd();
      (Ge !== e || Ze !== n) && (cn = null, Yr = Fe() + 500, ir(e, n));
      do
        try {
          c0();
          break;
        } catch (P) {
          Md(e, P);
        }
      while (!0);
      Eu(), Cs.current = d, Pe = c, We !== null ? n = 0 : (Ge = null, Ze = 0, n = be);
    }
    if (n !== 0) {
      if (n === 2 && (c = So(e), c !== 0 && (s = c, n = sa(e, c))), n === 1) throw o = Ko, ir(e, 0), $n(e, s), at(e, Fe()), o;
      if (n === 6) $n(e, s);
      else {
        if (c = e.current.alternate, (s & 30) === 0 && !u0(c) && (n = As(e, s), n === 2 && (d = So(e), d !== 0 && (s = d, n = sa(e, d))), n === 1)) throw o = Ko, ir(e, 0), $n(e, s), at(e, Fe()), o;
        switch (e.finishedWork = c, e.finishedLanes = s, n) {
          case 0:
          case 1:
            throw Error(i(345));
          case 2:
            sr(e, ut, cn);
            break;
          case 3:
            if ($n(e, s), (s & 130023424) === s && (n = ra + 500 - Fe(), 10 < n)) {
              if (Er(e, 0) !== 0) break;
              if (c = e.suspendedLanes, (c & s) !== s) {
                ot(), e.pingedLanes |= e.suspendedLanes & c;
                break;
              }
              e.timeoutHandle = du(sr.bind(null, e, ut, cn), n);
              break;
            }
            sr(e, ut, cn);
            break;
          case 4:
            if ($n(e, s), (s & 4194240) === s) break;
            for (n = e.eventTimes, c = -1; 0 < s; ) {
              var w = 31 - pt(s);
              d = 1 << w, w = n[w], w > c && (c = w), s &= ~d;
            }
            if (s = c, s = Fe() - s, s = (120 > s ? 120 : 480 > s ? 480 : 1080 > s ? 1080 : 1920 > s ? 1920 : 3e3 > s ? 3e3 : 4320 > s ? 4320 : 1960 * l0(s / 1960)) - s, 10 < s) {
              e.timeoutHandle = du(sr.bind(null, e, ut, cn), s);
              break;
            }
            sr(e, ut, cn);
            break;
          case 5:
            sr(e, ut, cn);
            break;
          default:
            throw Error(i(329));
        }
      }
    }
    return at(e, Fe()), e.callbackNode === o ? Nd.bind(null, e) : null;
  }
  function sa(e, n) {
    var o = qo;
    return e.current.memoizedState.isDehydrated && (ir(e, n).flags |= 256), e = As(e, n), e !== 2 && (n = ut, ut = o, n !== null && la(n)), e;
  }
  function la(e) {
    ut === null ? ut = e : ut.push.apply(ut, e);
  }
  function u0(e) {
    for (var n = e; ; ) {
      if (n.flags & 16384) {
        var o = n.updateQueue;
        if (o !== null && (o = o.stores, o !== null)) for (var s = 0; s < o.length; s++) {
          var c = o[s], d = c.getSnapshot;
          c = c.value;
          try {
            if (!It(d(), c)) return !1;
          } catch {
            return !1;
          }
        }
      }
      if (o = n.child, n.subtreeFlags & 16384 && o !== null) o.return = n, n = o;
      else {
        if (n === e) break;
        for (; n.sibling === null; ) {
          if (n.return === null || n.return === e) return !0;
          n = n.return;
        }
        n.sibling.return = n.return, n = n.sibling;
      }
    }
    return !0;
  }
  function $n(e, n) {
    for (n &= ~na, n &= ~Ms, e.suspendedLanes |= n, e.pingedLanes &= ~n, e = e.expirationTimes; 0 < n; ) {
      var o = 31 - pt(n), s = 1 << o;
      e[o] = -1, n &= ~s;
    }
  }
  function Cd(e) {
    if ((Pe & 6) !== 0) throw Error(i(327));
    Xr();
    var n = Er(e, 0);
    if ((n & 1) === 0) return at(e, Fe()), null;
    var o = As(e, n);
    if (e.tag !== 0 && o === 2) {
      var s = So(e);
      s !== 0 && (n = s, o = sa(e, s));
    }
    if (o === 1) throw o = Ko, ir(e, 0), $n(e, n), at(e, Fe()), o;
    if (o === 6) throw Error(i(345));
    return e.finishedWork = e.current.alternate, e.finishedLanes = n, sr(e, ut, cn), at(e, Fe()), null;
  }
  function ua(e, n) {
    var o = Pe;
    Pe |= 1;
    try {
      return e(n);
    } finally {
      Pe = o, Pe === 0 && (Yr = Fe() + 500, ss && Tn());
    }
  }
  function or(e) {
    Rn !== null && Rn.tag === 0 && (Pe & 6) === 0 && Xr();
    var n = Pe;
    Pe |= 1;
    var o = Pt.transition, s = ze;
    try {
      if (Pt.transition = null, ze = 1, e) return e();
    } finally {
      ze = s, Pt.transition = o, Pe = n, (Pe & 6) === 0 && Tn();
    }
  }
  function aa() {
    vt = Wr.current, Re(Wr);
  }
  function ir(e, n) {
    e.finishedWork = null, e.finishedLanes = 0;
    var o = e.timeoutHandle;
    if (o !== -1 && (e.timeoutHandle = -1, Fm(o)), We !== null) for (o = We.return; o !== null; ) {
      var s = o;
      switch (vu(s), s.tag) {
        case 1:
          s = s.type.childContextTypes, s != null && os();
          break;
        case 3:
          Vr(), Re(it), Re(Je), Iu();
          break;
        case 5:
          Tu(s);
          break;
        case 4:
          Vr();
          break;
        case 13:
          Re(Oe);
          break;
        case 19:
          Re(Oe);
          break;
        case 10:
          ku(s.type._context);
          break;
        case 22:
        case 23:
          aa();
      }
      o = o.return;
    }
    if (Ge = e, We = e = jn(e.current, null), Ze = vt = n, be = 0, Ko = null, na = Ms = rr = 0, ut = qo = null, er !== null) {
      for (n = 0; n < er.length; n++) if (o = er[n], s = o.interleaved, s !== null) {
        o.interleaved = null;
        var c = s.next, d = o.pending;
        if (d !== null) {
          var w = d.next;
          d.next = c, s.next = w;
        }
        o.pending = s;
      }
      er = null;
    }
    return e;
  }
  function Md(e, n) {
    do {
      var o = We;
      try {
        if (Eu(), ms.current = xs, ys) {
          for (var s = He.memoizedState; s !== null; ) {
            var c = s.queue;
            c !== null && (c.pending = null), s = s.next;
          }
          ys = !1;
        }
        if (nr = 0, Qe = Xe = He = null, Wo = !1, Yo = 0, ta.current = null, o === null || o.return === null) {
          be = 1, Ko = n, We = null;
          break;
        }
        e: {
          var d = e, w = o.return, P = o, L = n;
          if (n = Ze, P.flags |= 32768, L !== null && typeof L == "object" && typeof L.then == "function") {
            var Q = L, re = P, oe = re.tag;
            if ((re.mode & 1) === 0 && (oe === 0 || oe === 11 || oe === 15)) {
              var ne = re.alternate;
              ne ? (re.updateQueue = ne.updateQueue, re.memoizedState = ne.memoizedState, re.lanes = ne.lanes) : (re.updateQueue = null, re.memoizedState = null);
            }
            var fe = Zf(w);
            if (fe !== null) {
              fe.flags &= -257, Jf(fe, w, P, d, n), fe.mode & 1 && qf(d, Q, n), n = fe, L = Q;
              var he = n.updateQueue;
              if (he === null) {
                var pe = /* @__PURE__ */ new Set();
                pe.add(L), n.updateQueue = pe;
              } else he.add(L);
              break e;
            } else {
              if ((n & 1) === 0) {
                qf(d, Q, n), ca();
                break e;
              }
              L = Error(i(426));
            }
          } else if (De && P.mode & 1) {
            var Be = Zf(w);
            if (Be !== null) {
              (Be.flags & 65536) === 0 && (Be.flags |= 256), Jf(Be, w, P, d, n), Su(Br(L, P));
              break e;
            }
          }
          d = L = Br(L, P), be !== 4 && (be = 2), qo === null ? qo = [d] : qo.push(d), d = w;
          do {
            switch (d.tag) {
              case 3:
                d.flags |= 65536, n &= -n, d.lanes |= n;
                var B = Gf(d, L, n);
                _f(d, B);
                break e;
              case 1:
                P = L;
                var $ = d.type, W = d.stateNode;
                if ((d.flags & 128) === 0 && (typeof $.getDerivedStateFromError == "function" || W !== null && typeof W.componentDidCatch == "function" && (An === null || !An.has(W)))) {
                  d.flags |= 65536, n &= -n, d.lanes |= n;
                  var se = Kf(d, P, n);
                  _f(d, se);
                  break e;
                }
            }
            d = d.return;
          } while (d !== null);
        }
        zd(o);
      } catch (ge) {
        n = ge, We === o && o !== null && (We = o = o.return);
        continue;
      }
      break;
    } while (!0);
  }
  function Pd() {
    var e = Cs.current;
    return Cs.current = xs, e === null ? xs : e;
  }
  function ca() {
    (be === 0 || be === 3 || be === 2) && (be = 4), Ge === null || (rr & 268435455) === 0 && (Ms & 268435455) === 0 || $n(Ge, Ze);
  }
  function As(e, n) {
    var o = Pe;
    Pe |= 2;
    var s = Pd();
    (Ge !== e || Ze !== n) && (cn = null, ir(e, n));
    do
      try {
        a0();
        break;
      } catch (c) {
        Md(e, c);
      }
    while (!0);
    if (Eu(), Pe = o, Cs.current = s, We !== null) throw Error(i(261));
    return Ge = null, Ze = 0, be;
  }
  function a0() {
    for (; We !== null; ) Td(We);
  }
  function c0() {
    for (; We !== null && !Al(); ) Td(We);
  }
  function Td(e) {
    var n = Ad(e.alternate, e, vt);
    e.memoizedProps = e.pendingProps, n === null ? zd(e) : We = n, ta.current = null;
  }
  function zd(e) {
    var n = e;
    do {
      var o = n.alternate;
      if (e = n.return, (n.flags & 32768) === 0) {
        if (o = n0(o, n, vt), o !== null) {
          We = o;
          return;
        }
      } else {
        if (o = r0(o, n), o !== null) {
          o.flags &= 32767, We = o;
          return;
        }
        if (e !== null) e.flags |= 32768, e.subtreeFlags = 0, e.deletions = null;
        else {
          be = 6, We = null;
          return;
        }
      }
      if (n = n.sibling, n !== null) {
        We = n;
        return;
      }
      We = n = e;
    } while (n !== null);
    be === 0 && (be = 5);
  }
  function sr(e, n, o) {
    var s = ze, c = Pt.transition;
    try {
      Pt.transition = null, ze = 1, f0(e, n, o, s);
    } finally {
      Pt.transition = c, ze = s;
    }
    return null;
  }
  function f0(e, n, o, s) {
    do
      Xr();
    while (Rn !== null);
    if ((Pe & 6) !== 0) throw Error(i(327));
    o = e.finishedWork;
    var c = e.finishedLanes;
    if (o === null) return null;
    if (e.finishedWork = null, e.finishedLanes = 0, o === e.current) throw Error(i(177));
    e.callbackNode = null, e.callbackPriority = 0;
    var d = o.lanes | o.childLanes;
    if (Vi(e, d), e === Ge && (We = Ge = null, Ze = 0), (o.subtreeFlags & 2064) === 0 && (o.flags & 2064) === 0 || Ts || (Ts = !0, Rd(xr, function() {
      return Xr(), null;
    })), d = (o.flags & 15990) !== 0, (o.subtreeFlags & 15990) !== 0 || d) {
      d = Pt.transition, Pt.transition = null;
      var w = ze;
      ze = 1;
      var P = Pe;
      Pe |= 4, ta.current = null, i0(e, o), xd(o, e), Im(cu), Wi = !!au, cu = au = null, e.current = o, s0(o), ji(), Pe = P, ze = w, Pt.transition = d;
    } else e.current = o;
    if (Ts && (Ts = !1, Rn = e, zs = c), d = e.pendingLanes, d === 0 && (An = null), $l(o.stateNode), at(e, Fe()), n !== null) for (s = e.onRecoverableError, o = 0; o < n.length; o++) c = n[o], s(c.value, { componentStack: c.stack, digest: c.digest });
    if (Ps) throw Ps = !1, e = oa, oa = null, e;
    return (zs & 1) !== 0 && e.tag !== 0 && Xr(), d = e.pendingLanes, (d & 1) !== 0 ? e === ia ? Zo++ : (Zo = 0, ia = e) : Zo = 0, Tn(), null;
  }
  function Xr() {
    if (Rn !== null) {
      var e = yc(zs), n = Pt.transition, o = ze;
      try {
        if (Pt.transition = null, ze = 16 > e ? 16 : e, Rn === null) var s = !1;
        else {
          if (e = Rn, Rn = null, zs = 0, (Pe & 6) !== 0) throw Error(i(331));
          var c = Pe;
          for (Pe |= 4, de = e.current; de !== null; ) {
            var d = de, w = d.child;
            if ((de.flags & 16) !== 0) {
              var P = d.deletions;
              if (P !== null) {
                for (var L = 0; L < P.length; L++) {
                  var Q = P[L];
                  for (de = Q; de !== null; ) {
                    var re = de;
                    switch (re.tag) {
                      case 0:
                      case 11:
                      case 15:
                        Go(8, re, d);
                    }
                    var oe = re.child;
                    if (oe !== null) oe.return = re, de = oe;
                    else for (; de !== null; ) {
                      re = de;
                      var ne = re.sibling, fe = re.return;
                      if (gd(re), re === Q) {
                        de = null;
                        break;
                      }
                      if (ne !== null) {
                        ne.return = fe, de = ne;
                        break;
                      }
                      de = fe;
                    }
                  }
                }
                var he = d.alternate;
                if (he !== null) {
                  var pe = he.child;
                  if (pe !== null) {
                    he.child = null;
                    do {
                      var Be = pe.sibling;
                      pe.sibling = null, pe = Be;
                    } while (pe !== null);
                  }
                }
                de = d;
              }
            }
            if ((d.subtreeFlags & 2064) !== 0 && w !== null) w.return = d, de = w;
            else e: for (; de !== null; ) {
              if (d = de, (d.flags & 2048) !== 0) switch (d.tag) {
                case 0:
                case 11:
                case 15:
                  Go(9, d, d.return);
              }
              var B = d.sibling;
              if (B !== null) {
                B.return = d.return, de = B;
                break e;
              }
              de = d.return;
            }
          }
          var $ = e.current;
          for (de = $; de !== null; ) {
            w = de;
            var W = w.child;
            if ((w.subtreeFlags & 2064) !== 0 && W !== null) W.return = w, de = W;
            else e: for (w = $; de !== null; ) {
              if (P = de, (P.flags & 2048) !== 0) try {
                switch (P.tag) {
                  case 0:
                  case 11:
                  case 15:
                    Ns(9, P);
                }
              } catch (ge) {
                Ve(P, P.return, ge);
              }
              if (P === w) {
                de = null;
                break e;
              }
              var se = P.sibling;
              if (se !== null) {
                se.return = P.return, de = se;
                break e;
              }
              de = P.return;
            }
          }
          if (Pe = c, Tn(), Et && typeof Et.onPostCommitFiberRoot == "function") try {
            Et.onPostCommitFiberRoot(Qn, e);
          } catch {
          }
          s = !0;
        }
        return s;
      } finally {
        ze = o, Pt.transition = n;
      }
    }
    return !1;
  }
  function Id(e, n, o) {
    n = Br(o, n), n = Gf(e, n, 1), e = In(e, n, 1), n = ot(), e !== null && (Gn(e, 1, n), at(e, n));
  }
  function Ve(e, n, o) {
    if (e.tag === 3) Id(e, e, o);
    else for (; n !== null; ) {
      if (n.tag === 3) {
        Id(n, e, o);
        break;
      } else if (n.tag === 1) {
        var s = n.stateNode;
        if (typeof n.type.getDerivedStateFromError == "function" || typeof s.componentDidCatch == "function" && (An === null || !An.has(s))) {
          e = Br(o, e), e = Kf(n, e, 1), n = In(n, e, 1), e = ot(), n !== null && (Gn(n, 1, e), at(n, e));
          break;
        }
      }
      n = n.return;
    }
  }
  function d0(e, n, o) {
    var s = e.pingCache;
    s !== null && s.delete(n), n = ot(), e.pingedLanes |= e.suspendedLanes & o, Ge === e && (Ze & o) === o && (be === 4 || be === 3 && (Ze & 130023424) === Ze && 500 > Fe() - ra ? ir(e, 0) : na |= o), at(e, n);
  }
  function Ld(e, n) {
    n === 0 && ((e.mode & 1) === 0 ? n = 1 : (n = _r, _r <<= 1, (_r & 130023424) === 0 && (_r = 4194304)));
    var o = ot();
    e = ln(e, n), e !== null && (Gn(e, n, o), at(e, o));
  }
  function h0(e) {
    var n = e.memoizedState, o = 0;
    n !== null && (o = n.retryLane), Ld(e, o);
  }
  function p0(e, n) {
    var o = 0;
    switch (e.tag) {
      case 13:
        var s = e.stateNode, c = e.memoizedState;
        c !== null && (o = c.retryLane);
        break;
      case 19:
        s = e.stateNode;
        break;
      default:
        throw Error(i(314));
    }
    s !== null && s.delete(n), Ld(e, o);
  }
  var Ad;
  Ad = function(e, n, o) {
    if (e !== null) if (e.memoizedProps !== n.pendingProps || it.current) lt = !0;
    else {
      if ((e.lanes & o) === 0 && (n.flags & 128) === 0) return lt = !1, t0(e, n, o);
      lt = (e.flags & 131072) !== 0;
    }
    else lt = !1, De && (n.flags & 1048576) !== 0 && df(n, us, n.index);
    switch (n.lanes = 0, n.tag) {
      case 2:
        var s = n.type;
        Es(e, n), e = n.pendingProps;
        var c = Rr(n, Je.current);
        Hr(n, o), c = Ru(null, n, s, e, c, o);
        var d = Du();
        return n.flags |= 1, typeof c == "object" && c !== null && typeof c.render == "function" && c.$$typeof === void 0 ? (n.tag = 1, n.memoizedState = null, n.updateQueue = null, st(s) ? (d = !0, is(n)) : d = !1, n.memoizedState = c.state !== null && c.state !== void 0 ? c.state : null, Mu(n), c.updater = Ss, n.stateNode = c, c._reactInternals = n, Vu(n, s, e, o), n = Yu(null, n, s, !0, d, o)) : (n.tag = 0, De && d && yu(n), rt(null, n, c, o), n = n.child), n;
      case 16:
        s = n.elementType;
        e: {
          switch (Es(e, n), e = n.pendingProps, c = s._init, s = c(s._payload), n.type = s, c = n.tag = m0(s), e = At(s, e), c) {
            case 0:
              n = Wu(null, n, s, e, o);
              break e;
            case 1:
              n = id(null, n, s, e, o);
              break e;
            case 11:
              n = ed(null, n, s, e, o);
              break e;
            case 14:
              n = td(null, n, s, At(s.type, e), o);
              break e;
          }
          throw Error(i(
            306,
            s,
            ""
          ));
        }
        return n;
      case 0:
        return s = n.type, c = n.pendingProps, c = n.elementType === s ? c : At(s, c), Wu(e, n, s, c, o);
      case 1:
        return s = n.type, c = n.pendingProps, c = n.elementType === s ? c : At(s, c), id(e, n, s, c, o);
      case 3:
        e: {
          if (sd(n), e === null) throw Error(i(387));
          s = n.pendingProps, d = n.memoizedState, c = d.element, Sf(e, n), ps(n, s, null, o);
          var w = n.memoizedState;
          if (s = w.element, d.isDehydrated) if (d = { element: s, isDehydrated: !1, cache: w.cache, pendingSuspenseBoundaries: w.pendingSuspenseBoundaries, transitions: w.transitions }, n.updateQueue.baseState = d, n.memoizedState = d, n.flags & 256) {
            c = Br(Error(i(423)), n), n = ld(e, n, s, o, c);
            break e;
          } else if (s !== c) {
            c = Br(Error(i(424)), n), n = ld(e, n, s, o, c);
            break e;
          } else for (yt = Cn(n.stateNode.containerInfo.firstChild), mt = n, De = !0, Lt = null, o = wf(n, null, s, o), n.child = o; o; ) o.flags = o.flags & -3 | 4096, o = o.sibling;
          else {
            if (jr(), s === c) {
              n = an(e, n, o);
              break e;
            }
            rt(e, n, s, o);
          }
          n = n.child;
        }
        return n;
      case 5:
        return kf(n), e === null && xu(n), s = n.type, c = n.pendingProps, d = e !== null ? e.memoizedProps : null, w = c.children, fu(s, c) ? w = null : d !== null && fu(s, d) && (n.flags |= 32), od(e, n), rt(e, n, w, o), n.child;
      case 6:
        return e === null && xu(n), null;
      case 13:
        return ud(e, n, o);
      case 4:
        return Pu(n, n.stateNode.containerInfo), s = n.pendingProps, e === null ? n.child = Fr(n, null, s, o) : rt(e, n, s, o), n.child;
      case 11:
        return s = n.type, c = n.pendingProps, c = n.elementType === s ? c : At(s, c), ed(e, n, s, c, o);
      case 7:
        return rt(e, n, n.pendingProps, o), n.child;
      case 8:
        return rt(e, n, n.pendingProps.children, o), n.child;
      case 12:
        return rt(e, n, n.pendingProps.children, o), n.child;
      case 10:
        e: {
          if (s = n.type._context, c = n.pendingProps, d = n.memoizedProps, w = c.value, Le(fs, s._currentValue), s._currentValue = w, d !== null) if (It(d.value, w)) {
            if (d.children === c.children && !it.current) {
              n = an(e, n, o);
              break e;
            }
          } else for (d = n.child, d !== null && (d.return = n); d !== null; ) {
            var P = d.dependencies;
            if (P !== null) {
              w = d.child;
              for (var L = P.firstContext; L !== null; ) {
                if (L.context === s) {
                  if (d.tag === 1) {
                    L = un(-1, o & -o), L.tag = 2;
                    var Q = d.updateQueue;
                    if (Q !== null) {
                      Q = Q.shared;
                      var re = Q.pending;
                      re === null ? L.next = L : (L.next = re.next, re.next = L), Q.pending = L;
                    }
                  }
                  d.lanes |= o, L = d.alternate, L !== null && (L.lanes |= o), Nu(
                    d.return,
                    o,
                    n
                  ), P.lanes |= o;
                  break;
                }
                L = L.next;
              }
            } else if (d.tag === 10) w = d.type === n.type ? null : d.child;
            else if (d.tag === 18) {
              if (w = d.return, w === null) throw Error(i(341));
              w.lanes |= o, P = w.alternate, P !== null && (P.lanes |= o), Nu(w, o, n), w = d.sibling;
            } else w = d.child;
            if (w !== null) w.return = d;
            else for (w = d; w !== null; ) {
              if (w === n) {
                w = null;
                break;
              }
              if (d = w.sibling, d !== null) {
                d.return = w.return, w = d;
                break;
              }
              w = w.return;
            }
            d = w;
          }
          rt(e, n, c.children, o), n = n.child;
        }
        return n;
      case 9:
        return c = n.type, s = n.pendingProps.children, Hr(n, o), c = Ct(c), s = s(c), n.flags |= 1, rt(e, n, s, o), n.child;
      case 14:
        return s = n.type, c = At(s, n.pendingProps), c = At(s.type, c), td(e, n, s, c, o);
      case 15:
        return nd(e, n, n.type, n.pendingProps, o);
      case 17:
        return s = n.type, c = n.pendingProps, c = n.elementType === s ? c : At(s, c), Es(e, n), n.tag = 1, st(s) ? (e = !0, is(n)) : e = !1, Hr(n, o), bf(n, s, c), Vu(n, s, c, o), Yu(null, n, s, !0, e, o);
      case 19:
        return cd(e, n, o);
      case 22:
        return rd(e, n, o);
    }
    throw Error(i(156, n.tag));
  };
  function Rd(e, n) {
    return Di(e, n);
  }
  function g0(e, n, o, s) {
    this.tag = e, this.key = o, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = n, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = s, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function Tt(e, n, o, s) {
    return new g0(e, n, o, s);
  }
  function fa(e) {
    return e = e.prototype, !(!e || !e.isReactComponent);
  }
  function m0(e) {
    if (typeof e == "function") return fa(e) ? 1 : 0;
    if (e != null) {
      if (e = e.$$typeof, e === b) return 11;
      if (e === Y) return 14;
    }
    return 2;
  }
  function jn(e, n) {
    var o = e.alternate;
    return o === null ? (o = Tt(e.tag, n, e.key, e.mode), o.elementType = e.elementType, o.type = e.type, o.stateNode = e.stateNode, o.alternate = e, e.alternate = o) : (o.pendingProps = n, o.type = e.type, o.flags = 0, o.subtreeFlags = 0, o.deletions = null), o.flags = e.flags & 14680064, o.childLanes = e.childLanes, o.lanes = e.lanes, o.child = e.child, o.memoizedProps = e.memoizedProps, o.memoizedState = e.memoizedState, o.updateQueue = e.updateQueue, n = e.dependencies, o.dependencies = n === null ? null : { lanes: n.lanes, firstContext: n.firstContext }, o.sibling = e.sibling, o.index = e.index, o.ref = e.ref, o;
  }
  function Rs(e, n, o, s, c, d) {
    var w = 2;
    if (s = e, typeof e == "function") fa(e) && (w = 1);
    else if (typeof e == "string") w = 5;
    else e: switch (e) {
      case H:
        return lr(o.children, c, d, n);
      case G:
        w = 8, c |= 8;
        break;
      case K:
        return e = Tt(12, o, n, c | 2), e.elementType = K, e.lanes = d, e;
      case Z:
        return e = Tt(13, o, n, c), e.elementType = Z, e.lanes = d, e;
      case z:
        return e = Tt(19, o, n, c), e.elementType = z, e.lanes = d, e;
      case U:
        return Ds(o, c, d, n);
      default:
        if (typeof e == "object" && e !== null) switch (e.$$typeof) {
          case ie:
            w = 10;
            break e;
          case X:
            w = 9;
            break e;
          case b:
            w = 11;
            break e;
          case Y:
            w = 14;
            break e;
          case F:
            w = 16, s = null;
            break e;
        }
        throw Error(i(130, e == null ? e : typeof e, ""));
    }
    return n = Tt(w, o, n, c), n.elementType = e, n.type = s, n.lanes = d, n;
  }
  function lr(e, n, o, s) {
    return e = Tt(7, e, s, n), e.lanes = o, e;
  }
  function Ds(e, n, o, s) {
    return e = Tt(22, e, s, n), e.elementType = U, e.lanes = o, e.stateNode = { isHidden: !1 }, e;
  }
  function da(e, n, o) {
    return e = Tt(6, e, null, n), e.lanes = o, e;
  }
  function ha(e, n, o) {
    return n = Tt(4, e.children !== null ? e.children : [], e.key, n), n.lanes = o, n.stateNode = { containerInfo: e.containerInfo, pendingChildren: null, implementation: e.implementation }, n;
  }
  function y0(e, n, o, s, c) {
    this.tag = n, this.containerInfo = e, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = _o(0), this.expirationTimes = _o(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = _o(0), this.identifierPrefix = s, this.onRecoverableError = c, this.mutableSourceEagerHydrationData = null;
  }
  function pa(e, n, o, s, c, d, w, P, L) {
    return e = new y0(e, n, o, P, L), n === 1 ? (n = 1, d === !0 && (n |= 8)) : n = 0, d = Tt(3, null, null, n), e.current = d, d.stateNode = e, d.memoizedState = { element: s, isDehydrated: o, cache: null, transitions: null, pendingSuspenseBoundaries: null }, Mu(d), e;
  }
  function v0(e, n, o) {
    var s = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: j, key: s == null ? null : "" + s, children: e, containerInfo: n, implementation: o };
  }
  function Dd(e) {
    if (!e) return Pn;
    e = e._reactInternals;
    e: {
      if (Bt(e) !== e || e.tag !== 1) throw Error(i(170));
      var n = e;
      do {
        switch (n.tag) {
          case 3:
            n = n.stateNode.context;
            break e;
          case 1:
            if (st(n.type)) {
              n = n.stateNode.__reactInternalMemoizedMergedChildContext;
              break e;
            }
        }
        n = n.return;
      } while (n !== null);
      throw Error(i(171));
    }
    if (e.tag === 1) {
      var o = e.type;
      if (st(o)) return af(e, o, n);
    }
    return n;
  }
  function $d(e, n, o, s, c, d, w, P, L) {
    return e = pa(o, s, !0, e, c, d, w, P, L), e.context = Dd(null), o = e.current, s = ot(), c = Dn(o), d = un(s, c), d.callback = n ?? null, In(o, d, c), e.current.lanes = c, Gn(e, c, s), at(e, s), e;
  }
  function $s(e, n, o, s) {
    var c = n.current, d = ot(), w = Dn(c);
    return o = Dd(o), n.context === null ? n.context = o : n.pendingContext = o, n = un(d, w), n.payload = { element: e }, s = s === void 0 ? null : s, s !== null && (n.callback = s), e = In(c, n, w), e !== null && ($t(e, c, w, d), hs(e, c, w)), w;
  }
  function js(e) {
    if (e = e.current, !e.child) return null;
    switch (e.child.tag) {
      case 5:
        return e.child.stateNode;
      default:
        return e.child.stateNode;
    }
  }
  function jd(e, n) {
    if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
      var o = e.retryLane;
      e.retryLane = o !== 0 && o < n ? o : n;
    }
  }
  function ga(e, n) {
    jd(e, n), (e = e.alternate) && jd(e, n);
  }
  function w0() {
    return null;
  }
  var Fd = typeof reportError == "function" ? reportError : function(e) {
    console.error(e);
  };
  function ma(e) {
    this._internalRoot = e;
  }
  Fs.prototype.render = ma.prototype.render = function(e) {
    var n = this._internalRoot;
    if (n === null) throw Error(i(409));
    $s(e, n, null, null);
  }, Fs.prototype.unmount = ma.prototype.unmount = function() {
    var e = this._internalRoot;
    if (e !== null) {
      this._internalRoot = null;
      var n = e.containerInfo;
      or(function() {
        $s(null, e, null, null);
      }), n[nn] = null;
    }
  };
  function Fs(e) {
    this._internalRoot = e;
  }
  Fs.prototype.unstable_scheduleHydration = function(e) {
    if (e) {
      var n = xc();
      e = { blockedOn: null, target: e, priority: n };
      for (var o = 0; o < En.length && n !== 0 && n < En[o].priority; o++) ;
      En.splice(o, 0, e), o === 0 && Ec(e);
    }
  };
  function ya(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
  }
  function Os(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11 && (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "));
  }
  function Od() {
  }
  function x0(e, n, o, s, c) {
    if (c) {
      if (typeof s == "function") {
        var d = s;
        s = function() {
          var Q = js(w);
          d.call(Q);
        };
      }
      var w = $d(n, s, e, 0, null, !1, !1, "", Od);
      return e._reactRootContainer = w, e[nn] = w.current, $o(e.nodeType === 8 ? e.parentNode : e), or(), w;
    }
    for (; c = e.lastChild; ) e.removeChild(c);
    if (typeof s == "function") {
      var P = s;
      s = function() {
        var Q = js(L);
        P.call(Q);
      };
    }
    var L = pa(e, 0, !1, null, null, !1, !1, "", Od);
    return e._reactRootContainer = L, e[nn] = L.current, $o(e.nodeType === 8 ? e.parentNode : e), or(function() {
      $s(n, L, o, s);
    }), L;
  }
  function Hs(e, n, o, s, c) {
    var d = o._reactRootContainer;
    if (d) {
      var w = d;
      if (typeof c == "function") {
        var P = c;
        c = function() {
          var L = js(w);
          P.call(L);
        };
      }
      $s(n, w, e, c);
    } else w = x0(o, n, e, c, s);
    return js(w);
  }
  vc = function(e) {
    switch (e.tag) {
      case 3:
        var n = e.stateNode;
        if (n.current.memoizedState.isDehydrated) {
          var o = Ut(n.pendingLanes);
          o !== 0 && (Vl(n, o | 1), at(n, Fe()), (Pe & 6) === 0 && (Yr = Fe() + 500, Tn()));
        }
        break;
      case 13:
        or(function() {
          var s = ln(e, 1);
          if (s !== null) {
            var c = ot();
            $t(s, e, 1, c);
          }
        }), ga(e, 1);
    }
  }, Bl = function(e) {
    if (e.tag === 13) {
      var n = ln(e, 134217728);
      if (n !== null) {
        var o = ot();
        $t(n, e, 134217728, o);
      }
      ga(e, 134217728);
    }
  }, wc = function(e) {
    if (e.tag === 13) {
      var n = Dn(e), o = ln(e, n);
      if (o !== null) {
        var s = ot();
        $t(o, e, n, s);
      }
      ga(e, n);
    }
  }, xc = function() {
    return ze;
  }, Sc = function(e, n) {
    var o = ze;
    try {
      return ze = e, n();
    } finally {
      ze = o;
    }
  }, po = function(e, n, o) {
    switch (n) {
      case "input":
        if (Ue(e, o), n = o.name, o.type === "radio" && n != null) {
          for (o = e; o.parentNode; ) o = o.parentNode;
          for (o = o.querySelectorAll("input[name=" + JSON.stringify("" + n) + '][type="radio"]'), n = 0; n < o.length; n++) {
            var s = o[n];
            if (s !== e && s.form === e.form) {
              var c = rs(s);
              if (!c) throw Error(i(90));
              Se(s), Ue(s, c);
            }
          }
        }
        break;
      case "textarea":
        yr(e, o);
        break;
      case "select":
        n = o.value, n != null && _t(e, !!o.multiple, n, !1);
    }
  }, zi = ua, Ii = or;
  var S0 = { usingClientEntryPoint: !1, Events: [Oo, Lr, rs, Pi, Ti, ua] }, Jo = { findFiberByHostInstance: Kn, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, _0 = { bundleType: Jo.bundleType, version: Jo.version, rendererPackageName: Jo.rendererPackageName, rendererConfig: Jo.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: M.ReactCurrentDispatcher, findHostInstanceByFiber: function(e) {
    return e = Ai(e), e === null ? null : e.stateNode;
  }, findFiberByHostInstance: Jo.findFiberByHostInstance || w0, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Vs = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Vs.isDisabled && Vs.supportsFiber) try {
      Qn = Vs.inject(_0), Et = Vs;
    } catch {
    }
  }
  return ct.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = S0, ct.createPortal = function(e, n) {
    var o = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!ya(n)) throw Error(i(200));
    return v0(e, n, null, o);
  }, ct.createRoot = function(e, n) {
    if (!ya(e)) throw Error(i(299));
    var o = !1, s = "", c = Fd;
    return n != null && (n.unstable_strictMode === !0 && (o = !0), n.identifierPrefix !== void 0 && (s = n.identifierPrefix), n.onRecoverableError !== void 0 && (c = n.onRecoverableError)), n = pa(e, 1, !1, null, null, o, !1, s, c), e[nn] = n.current, $o(e.nodeType === 8 ? e.parentNode : e), new ma(n);
  }, ct.findDOMNode = function(e) {
    if (e == null) return null;
    if (e.nodeType === 1) return e;
    var n = e._reactInternals;
    if (n === void 0)
      throw typeof e.render == "function" ? Error(i(188)) : (e = Object.keys(e).join(","), Error(i(268, e)));
    return e = Ai(n), e = e === null ? null : e.stateNode, e;
  }, ct.flushSync = function(e) {
    return or(e);
  }, ct.hydrate = function(e, n, o) {
    if (!Os(n)) throw Error(i(200));
    return Hs(null, e, n, !0, o);
  }, ct.hydrateRoot = function(e, n, o) {
    if (!ya(e)) throw Error(i(405));
    var s = o != null && o.hydratedSources || null, c = !1, d = "", w = Fd;
    if (o != null && (o.unstable_strictMode === !0 && (c = !0), o.identifierPrefix !== void 0 && (d = o.identifierPrefix), o.onRecoverableError !== void 0 && (w = o.onRecoverableError)), n = $d(n, null, e, 1, o ?? null, c, !1, d, w), e[nn] = n.current, $o(e), s) for (e = 0; e < s.length; e++) o = s[e], c = o._getVersion, c = c(o._source), n.mutableSourceEagerHydrationData == null ? n.mutableSourceEagerHydrationData = [o, c] : n.mutableSourceEagerHydrationData.push(
      o,
      c
    );
    return new Fs(n);
  }, ct.render = function(e, n, o) {
    if (!Os(n)) throw Error(i(200));
    return Hs(null, e, n, !1, o);
  }, ct.unmountComponentAtNode = function(e) {
    if (!Os(e)) throw Error(i(40));
    return e._reactRootContainer ? (or(function() {
      Hs(null, null, e, !1, function() {
        e._reactRootContainer = null, e[nn] = null;
      });
    }), !0) : !1;
  }, ct.unstable_batchedUpdates = ua, ct.unstable_renderSubtreeIntoContainer = function(e, n, o, s) {
    if (!Os(o)) throw Error(i(200));
    if (e == null || e._reactInternals === void 0) throw Error(i(38));
    return Hs(e, n, o, !1, s);
  }, ct.version = "18.3.1-next-f1338f8080-20240426", ct;
}
var bd;
function op() {
  if (bd) return xa.exports;
  bd = 1;
  function t() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(t);
      } catch (r) {
        console.error(r);
      }
  }
  return t(), xa.exports = I0(), xa.exports;
}
var Qd;
function L0() {
  if (Qd) return Bs;
  Qd = 1;
  var t = op();
  return Bs.createRoot = t.createRoot, Bs.hydrateRoot = t.hydrateRoot, Bs;
}
var A0 = L0();
const R0 = /* @__PURE__ */ Za(A0);
function Ye(t) {
  if (typeof t == "string" || typeof t == "number") return "" + t;
  let r = "";
  if (Array.isArray(t))
    for (let i = 0, l; i < t.length; i++)
      (l = Ye(t[i])) !== "" && (r += (r && " ") + l);
  else
    for (let i in t)
      t[i] && (r += (r && " ") + i);
  return r;
}
var D0 = { value: () => {
} };
function gl() {
  for (var t = 0, r = arguments.length, i = {}, l; t < r; ++t) {
    if (!(l = arguments[t] + "") || l in i || /[\s.]/.test(l)) throw new Error("illegal type: " + l);
    i[l] = [];
  }
  return new Zs(i);
}
function Zs(t) {
  this._ = t;
}
function $0(t, r) {
  return t.trim().split(/^|\s+/).map(function(i) {
    var l = "", u = i.indexOf(".");
    if (u >= 0 && (l = i.slice(u + 1), i = i.slice(0, u)), i && !r.hasOwnProperty(i)) throw new Error("unknown type: " + i);
    return { type: i, name: l };
  });
}
Zs.prototype = gl.prototype = {
  constructor: Zs,
  on: function(t, r) {
    var i = this._, l = $0(t + "", i), u, a = -1, f = l.length;
    if (arguments.length < 2) {
      for (; ++a < f; ) if ((u = (t = l[a]).type) && (u = j0(i[u], t.name))) return u;
      return;
    }
    if (r != null && typeof r != "function") throw new Error("invalid callback: " + r);
    for (; ++a < f; )
      if (u = (t = l[a]).type) i[u] = Gd(i[u], t.name, r);
      else if (r == null) for (u in i) i[u] = Gd(i[u], t.name, null);
    return this;
  },
  copy: function() {
    var t = {}, r = this._;
    for (var i in r) t[i] = r[i].slice();
    return new Zs(t);
  },
  call: function(t, r) {
    if ((u = arguments.length - 2) > 0) for (var i = new Array(u), l = 0, u, a; l < u; ++l) i[l] = arguments[l + 2];
    if (!this._.hasOwnProperty(t)) throw new Error("unknown type: " + t);
    for (a = this._[t], l = 0, u = a.length; l < u; ++l) a[l].value.apply(r, i);
  },
  apply: function(t, r, i) {
    if (!this._.hasOwnProperty(t)) throw new Error("unknown type: " + t);
    for (var l = this._[t], u = 0, a = l.length; u < a; ++u) l[u].value.apply(r, i);
  }
};
function j0(t, r) {
  for (var i = 0, l = t.length, u; i < l; ++i)
    if ((u = t[i]).name === r)
      return u.value;
}
function Gd(t, r, i) {
  for (var l = 0, u = t.length; l < u; ++l)
    if (t[l].name === r) {
      t[l] = D0, t = t.slice(0, l).concat(t.slice(l + 1));
      break;
    }
  return i != null && t.push({ name: r, value: i }), t;
}
var ja = "http://www.w3.org/1999/xhtml";
const Kd = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: ja,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
function ml(t) {
  var r = t += "", i = r.indexOf(":");
  return i >= 0 && (r = t.slice(0, i)) !== "xmlns" && (t = t.slice(i + 1)), Kd.hasOwnProperty(r) ? { space: Kd[r], local: t } : t;
}
function F0(t) {
  return function() {
    var r = this.ownerDocument, i = this.namespaceURI;
    return i === ja && r.documentElement.namespaceURI === ja ? r.createElement(t) : r.createElementNS(i, t);
  };
}
function O0(t) {
  return function() {
    return this.ownerDocument.createElementNS(t.space, t.local);
  };
}
function ip(t) {
  var r = ml(t);
  return (r.local ? O0 : F0)(r);
}
function H0() {
}
function Ja(t) {
  return t == null ? H0 : function() {
    return this.querySelector(t);
  };
}
function V0(t) {
  typeof t != "function" && (t = Ja(t));
  for (var r = this._groups, i = r.length, l = new Array(i), u = 0; u < i; ++u)
    for (var a = r[u], f = a.length, h = l[u] = new Array(f), p, m, v = 0; v < f; ++v)
      (p = a[v]) && (m = t.call(p, p.__data__, v, a)) && ("__data__" in p && (m.__data__ = p.__data__), h[v] = m);
  return new St(l, this._parents);
}
function B0(t) {
  return t == null ? [] : Array.isArray(t) ? t : Array.from(t);
}
function U0() {
  return [];
}
function sp(t) {
  return t == null ? U0 : function() {
    return this.querySelectorAll(t);
  };
}
function W0(t) {
  return function() {
    return B0(t.apply(this, arguments));
  };
}
function Y0(t) {
  typeof t == "function" ? t = W0(t) : t = sp(t);
  for (var r = this._groups, i = r.length, l = [], u = [], a = 0; a < i; ++a)
    for (var f = r[a], h = f.length, p, m = 0; m < h; ++m)
      (p = f[m]) && (l.push(t.call(p, p.__data__, m, f)), u.push(p));
  return new St(l, u);
}
function lp(t) {
  return function() {
    return this.matches(t);
  };
}
function up(t) {
  return function(r) {
    return r.matches(t);
  };
}
var X0 = Array.prototype.find;
function b0(t) {
  return function() {
    return X0.call(this.children, t);
  };
}
function Q0() {
  return this.firstElementChild;
}
function G0(t) {
  return this.select(t == null ? Q0 : b0(typeof t == "function" ? t : up(t)));
}
var K0 = Array.prototype.filter;
function q0() {
  return Array.from(this.children);
}
function Z0(t) {
  return function() {
    return K0.call(this.children, t);
  };
}
function J0(t) {
  return this.selectAll(t == null ? q0 : Z0(typeof t == "function" ? t : up(t)));
}
function ey(t) {
  typeof t != "function" && (t = lp(t));
  for (var r = this._groups, i = r.length, l = new Array(i), u = 0; u < i; ++u)
    for (var a = r[u], f = a.length, h = l[u] = [], p, m = 0; m < f; ++m)
      (p = a[m]) && t.call(p, p.__data__, m, a) && h.push(p);
  return new St(l, this._parents);
}
function ap(t) {
  return new Array(t.length);
}
function ty() {
  return new St(this._enter || this._groups.map(ap), this._parents);
}
function rl(t, r) {
  this.ownerDocument = t.ownerDocument, this.namespaceURI = t.namespaceURI, this._next = null, this._parent = t, this.__data__ = r;
}
rl.prototype = {
  constructor: rl,
  appendChild: function(t) {
    return this._parent.insertBefore(t, this._next);
  },
  insertBefore: function(t, r) {
    return this._parent.insertBefore(t, r);
  },
  querySelector: function(t) {
    return this._parent.querySelector(t);
  },
  querySelectorAll: function(t) {
    return this._parent.querySelectorAll(t);
  }
};
function ny(t) {
  return function() {
    return t;
  };
}
function ry(t, r, i, l, u, a) {
  for (var f = 0, h, p = r.length, m = a.length; f < m; ++f)
    (h = r[f]) ? (h.__data__ = a[f], l[f] = h) : i[f] = new rl(t, a[f]);
  for (; f < p; ++f)
    (h = r[f]) && (u[f] = h);
}
function oy(t, r, i, l, u, a, f) {
  var h, p, m = /* @__PURE__ */ new Map(), v = r.length, g = a.length, y = new Array(v), x;
  for (h = 0; h < v; ++h)
    (p = r[h]) && (y[h] = x = f.call(p, p.__data__, h, r) + "", m.has(x) ? u[h] = p : m.set(x, p));
  for (h = 0; h < g; ++h)
    x = f.call(t, a[h], h, a) + "", (p = m.get(x)) ? (l[h] = p, p.__data__ = a[h], m.delete(x)) : i[h] = new rl(t, a[h]);
  for (h = 0; h < v; ++h)
    (p = r[h]) && m.get(y[h]) === p && (u[h] = p);
}
function iy(t) {
  return t.__data__;
}
function sy(t, r) {
  if (!arguments.length) return Array.from(this, iy);
  var i = r ? oy : ry, l = this._parents, u = this._groups;
  typeof t != "function" && (t = ny(t));
  for (var a = u.length, f = new Array(a), h = new Array(a), p = new Array(a), m = 0; m < a; ++m) {
    var v = l[m], g = u[m], y = g.length, x = ly(t.call(v, v && v.__data__, m, l)), S = x.length, N = h[m] = new Array(S), k = f[m] = new Array(S), E = p[m] = new Array(y);
    i(v, g, N, k, E, x, r);
    for (var A = 0, _ = 0, M, O; A < S; ++A)
      if (M = N[A]) {
        for (A >= _ && (_ = A + 1); !(O = k[_]) && ++_ < S; ) ;
        M._next = O || null;
      }
  }
  return f = new St(f, l), f._enter = h, f._exit = p, f;
}
function ly(t) {
  return typeof t == "object" && "length" in t ? t : Array.from(t);
}
function uy() {
  return new St(this._exit || this._groups.map(ap), this._parents);
}
function ay(t, r, i) {
  var l = this.enter(), u = this, a = this.exit();
  return typeof t == "function" ? (l = t(l), l && (l = l.selection())) : l = l.append(t + ""), r != null && (u = r(u), u && (u = u.selection())), i == null ? a.remove() : i(a), l && u ? l.merge(u).order() : u;
}
function cy(t) {
  for (var r = t.selection ? t.selection() : t, i = this._groups, l = r._groups, u = i.length, a = l.length, f = Math.min(u, a), h = new Array(u), p = 0; p < f; ++p)
    for (var m = i[p], v = l[p], g = m.length, y = h[p] = new Array(g), x, S = 0; S < g; ++S)
      (x = m[S] || v[S]) && (y[S] = x);
  for (; p < u; ++p)
    h[p] = i[p];
  return new St(h, this._parents);
}
function fy() {
  for (var t = this._groups, r = -1, i = t.length; ++r < i; )
    for (var l = t[r], u = l.length - 1, a = l[u], f; --u >= 0; )
      (f = l[u]) && (a && f.compareDocumentPosition(a) ^ 4 && a.parentNode.insertBefore(f, a), a = f);
  return this;
}
function dy(t) {
  t || (t = hy);
  function r(g, y) {
    return g && y ? t(g.__data__, y.__data__) : !g - !y;
  }
  for (var i = this._groups, l = i.length, u = new Array(l), a = 0; a < l; ++a) {
    for (var f = i[a], h = f.length, p = u[a] = new Array(h), m, v = 0; v < h; ++v)
      (m = f[v]) && (p[v] = m);
    p.sort(r);
  }
  return new St(u, this._parents).order();
}
function hy(t, r) {
  return t < r ? -1 : t > r ? 1 : t >= r ? 0 : NaN;
}
function py() {
  var t = arguments[0];
  return arguments[0] = this, t.apply(null, arguments), this;
}
function gy() {
  return Array.from(this);
}
function my() {
  for (var t = this._groups, r = 0, i = t.length; r < i; ++r)
    for (var l = t[r], u = 0, a = l.length; u < a; ++u) {
      var f = l[u];
      if (f) return f;
    }
  return null;
}
function yy() {
  let t = 0;
  for (const r of this) ++t;
  return t;
}
function vy() {
  return !this.node();
}
function wy(t) {
  for (var r = this._groups, i = 0, l = r.length; i < l; ++i)
    for (var u = r[i], a = 0, f = u.length, h; a < f; ++a)
      (h = u[a]) && t.call(h, h.__data__, a, u);
  return this;
}
function xy(t) {
  return function() {
    this.removeAttribute(t);
  };
}
function Sy(t) {
  return function() {
    this.removeAttributeNS(t.space, t.local);
  };
}
function _y(t, r) {
  return function() {
    this.setAttribute(t, r);
  };
}
function Ey(t, r) {
  return function() {
    this.setAttributeNS(t.space, t.local, r);
  };
}
function ky(t, r) {
  return function() {
    var i = r.apply(this, arguments);
    i == null ? this.removeAttribute(t) : this.setAttribute(t, i);
  };
}
function Ny(t, r) {
  return function() {
    var i = r.apply(this, arguments);
    i == null ? this.removeAttributeNS(t.space, t.local) : this.setAttributeNS(t.space, t.local, i);
  };
}
function Cy(t, r) {
  var i = ml(t);
  if (arguments.length < 2) {
    var l = this.node();
    return i.local ? l.getAttributeNS(i.space, i.local) : l.getAttribute(i);
  }
  return this.each((r == null ? i.local ? Sy : xy : typeof r == "function" ? i.local ? Ny : ky : i.local ? Ey : _y)(i, r));
}
function cp(t) {
  return t.ownerDocument && t.ownerDocument.defaultView || t.document && t || t.defaultView;
}
function My(t) {
  return function() {
    this.style.removeProperty(t);
  };
}
function Py(t, r, i) {
  return function() {
    this.style.setProperty(t, r, i);
  };
}
function Ty(t, r, i) {
  return function() {
    var l = r.apply(this, arguments);
    l == null ? this.style.removeProperty(t) : this.style.setProperty(t, l, i);
  };
}
function zy(t, r, i) {
  return arguments.length > 1 ? this.each((r == null ? My : typeof r == "function" ? Ty : Py)(t, r, i ?? "")) : to(this.node(), t);
}
function to(t, r) {
  return t.style.getPropertyValue(r) || cp(t).getComputedStyle(t, null).getPropertyValue(r);
}
function Iy(t) {
  return function() {
    delete this[t];
  };
}
function Ly(t, r) {
  return function() {
    this[t] = r;
  };
}
function Ay(t, r) {
  return function() {
    var i = r.apply(this, arguments);
    i == null ? delete this[t] : this[t] = i;
  };
}
function Ry(t, r) {
  return arguments.length > 1 ? this.each((r == null ? Iy : typeof r == "function" ? Ay : Ly)(t, r)) : this.node()[t];
}
function fp(t) {
  return t.trim().split(/^|\s+/);
}
function ec(t) {
  return t.classList || new dp(t);
}
function dp(t) {
  this._node = t, this._names = fp(t.getAttribute("class") || "");
}
dp.prototype = {
  add: function(t) {
    var r = this._names.indexOf(t);
    r < 0 && (this._names.push(t), this._node.setAttribute("class", this._names.join(" ")));
  },
  remove: function(t) {
    var r = this._names.indexOf(t);
    r >= 0 && (this._names.splice(r, 1), this._node.setAttribute("class", this._names.join(" ")));
  },
  contains: function(t) {
    return this._names.indexOf(t) >= 0;
  }
};
function hp(t, r) {
  for (var i = ec(t), l = -1, u = r.length; ++l < u; ) i.add(r[l]);
}
function pp(t, r) {
  for (var i = ec(t), l = -1, u = r.length; ++l < u; ) i.remove(r[l]);
}
function Dy(t) {
  return function() {
    hp(this, t);
  };
}
function $y(t) {
  return function() {
    pp(this, t);
  };
}
function jy(t, r) {
  return function() {
    (r.apply(this, arguments) ? hp : pp)(this, t);
  };
}
function Fy(t, r) {
  var i = fp(t + "");
  if (arguments.length < 2) {
    for (var l = ec(this.node()), u = -1, a = i.length; ++u < a; ) if (!l.contains(i[u])) return !1;
    return !0;
  }
  return this.each((typeof r == "function" ? jy : r ? Dy : $y)(i, r));
}
function Oy() {
  this.textContent = "";
}
function Hy(t) {
  return function() {
    this.textContent = t;
  };
}
function Vy(t) {
  return function() {
    var r = t.apply(this, arguments);
    this.textContent = r ?? "";
  };
}
function By(t) {
  return arguments.length ? this.each(t == null ? Oy : (typeof t == "function" ? Vy : Hy)(t)) : this.node().textContent;
}
function Uy() {
  this.innerHTML = "";
}
function Wy(t) {
  return function() {
    this.innerHTML = t;
  };
}
function Yy(t) {
  return function() {
    var r = t.apply(this, arguments);
    this.innerHTML = r ?? "";
  };
}
function Xy(t) {
  return arguments.length ? this.each(t == null ? Uy : (typeof t == "function" ? Yy : Wy)(t)) : this.node().innerHTML;
}
function by() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function Qy() {
  return this.each(by);
}
function Gy() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function Ky() {
  return this.each(Gy);
}
function qy(t) {
  var r = typeof t == "function" ? t : ip(t);
  return this.select(function() {
    return this.appendChild(r.apply(this, arguments));
  });
}
function Zy() {
  return null;
}
function Jy(t, r) {
  var i = typeof t == "function" ? t : ip(t), l = r == null ? Zy : typeof r == "function" ? r : Ja(r);
  return this.select(function() {
    return this.insertBefore(i.apply(this, arguments), l.apply(this, arguments) || null);
  });
}
function ev() {
  var t = this.parentNode;
  t && t.removeChild(this);
}
function tv() {
  return this.each(ev);
}
function nv() {
  var t = this.cloneNode(!1), r = this.parentNode;
  return r ? r.insertBefore(t, this.nextSibling) : t;
}
function rv() {
  var t = this.cloneNode(!0), r = this.parentNode;
  return r ? r.insertBefore(t, this.nextSibling) : t;
}
function ov(t) {
  return this.select(t ? rv : nv);
}
function iv(t) {
  return arguments.length ? this.property("__data__", t) : this.node().__data__;
}
function sv(t) {
  return function(r) {
    t.call(this, r, this.__data__);
  };
}
function lv(t) {
  return t.trim().split(/^|\s+/).map(function(r) {
    var i = "", l = r.indexOf(".");
    return l >= 0 && (i = r.slice(l + 1), r = r.slice(0, l)), { type: r, name: i };
  });
}
function uv(t) {
  return function() {
    var r = this.__on;
    if (r) {
      for (var i = 0, l = -1, u = r.length, a; i < u; ++i)
        a = r[i], (!t.type || a.type === t.type) && a.name === t.name ? this.removeEventListener(a.type, a.listener, a.options) : r[++l] = a;
      ++l ? r.length = l : delete this.__on;
    }
  };
}
function av(t, r, i) {
  return function() {
    var l = this.__on, u, a = sv(r);
    if (l) {
      for (var f = 0, h = l.length; f < h; ++f)
        if ((u = l[f]).type === t.type && u.name === t.name) {
          this.removeEventListener(u.type, u.listener, u.options), this.addEventListener(u.type, u.listener = a, u.options = i), u.value = r;
          return;
        }
    }
    this.addEventListener(t.type, a, i), u = { type: t.type, name: t.name, value: r, listener: a, options: i }, l ? l.push(u) : this.__on = [u];
  };
}
function cv(t, r, i) {
  var l = lv(t + ""), u, a = l.length, f;
  if (arguments.length < 2) {
    var h = this.node().__on;
    if (h) {
      for (var p = 0, m = h.length, v; p < m; ++p)
        for (u = 0, v = h[p]; u < a; ++u)
          if ((f = l[u]).type === v.type && f.name === v.name)
            return v.value;
    }
    return;
  }
  for (h = r ? av : uv, u = 0; u < a; ++u) this.each(h(l[u], r, i));
  return this;
}
function gp(t, r, i) {
  var l = cp(t), u = l.CustomEvent;
  typeof u == "function" ? u = new u(r, i) : (u = l.document.createEvent("Event"), i ? (u.initEvent(r, i.bubbles, i.cancelable), u.detail = i.detail) : u.initEvent(r, !1, !1)), t.dispatchEvent(u);
}
function fv(t, r) {
  return function() {
    return gp(this, t, r);
  };
}
function dv(t, r) {
  return function() {
    return gp(this, t, r.apply(this, arguments));
  };
}
function hv(t, r) {
  return this.each((typeof r == "function" ? dv : fv)(t, r));
}
function* pv() {
  for (var t = this._groups, r = 0, i = t.length; r < i; ++r)
    for (var l = t[r], u = 0, a = l.length, f; u < a; ++u)
      (f = l[u]) && (yield f);
}
var mp = [null];
function St(t, r) {
  this._groups = t, this._parents = r;
}
function yi() {
  return new St([[document.documentElement]], mp);
}
function gv() {
  return this;
}
St.prototype = yi.prototype = {
  constructor: St,
  select: V0,
  selectAll: Y0,
  selectChild: G0,
  selectChildren: J0,
  filter: ey,
  data: sy,
  enter: ty,
  exit: uy,
  join: ay,
  merge: cy,
  selection: gv,
  order: fy,
  sort: dy,
  call: py,
  nodes: gy,
  node: my,
  size: yy,
  empty: vy,
  each: wy,
  attr: Cy,
  style: zy,
  property: Ry,
  classed: Fy,
  text: By,
  html: Xy,
  raise: Qy,
  lower: Ky,
  append: qy,
  insert: Jy,
  remove: tv,
  clone: ov,
  datum: iv,
  on: cv,
  dispatch: hv,
  [Symbol.iterator]: pv
};
function wt(t) {
  return typeof t == "string" ? new St([[document.querySelector(t)]], [document.documentElement]) : new St([[t]], mp);
}
function mv(t) {
  let r;
  for (; r = t.sourceEvent; ) t = r;
  return t;
}
function jt(t, r) {
  if (t = mv(t), r === void 0 && (r = t.currentTarget), r) {
    var i = r.ownerSVGElement || r;
    if (i.createSVGPoint) {
      var l = i.createSVGPoint();
      return l.x = t.clientX, l.y = t.clientY, l = l.matrixTransform(r.getScreenCTM().inverse()), [l.x, l.y];
    }
    if (r.getBoundingClientRect) {
      var u = r.getBoundingClientRect();
      return [t.clientX - u.left - r.clientLeft, t.clientY - u.top - r.clientTop];
    }
  }
  return [t.pageX, t.pageY];
}
const yv = { passive: !1 }, li = { capture: !0, passive: !1 };
function Ea(t) {
  t.stopImmediatePropagation();
}
function Jr(t) {
  t.preventDefault(), t.stopImmediatePropagation();
}
function yp(t) {
  var r = t.document.documentElement, i = wt(t).on("dragstart.drag", Jr, li);
  "onselectstart" in r ? i.on("selectstart.drag", Jr, li) : (r.__noselect = r.style.MozUserSelect, r.style.MozUserSelect = "none");
}
function vp(t, r) {
  var i = t.document.documentElement, l = wt(t).on("dragstart.drag", null);
  r && (l.on("click.drag", Jr, li), setTimeout(function() {
    l.on("click.drag", null);
  }, 0)), "onselectstart" in i ? l.on("selectstart.drag", null) : (i.style.MozUserSelect = i.__noselect, delete i.__noselect);
}
const Us = (t) => () => t;
function Fa(t, {
  sourceEvent: r,
  subject: i,
  target: l,
  identifier: u,
  active: a,
  x: f,
  y: h,
  dx: p,
  dy: m,
  dispatch: v
}) {
  Object.defineProperties(this, {
    type: { value: t, enumerable: !0, configurable: !0 },
    sourceEvent: { value: r, enumerable: !0, configurable: !0 },
    subject: { value: i, enumerable: !0, configurable: !0 },
    target: { value: l, enumerable: !0, configurable: !0 },
    identifier: { value: u, enumerable: !0, configurable: !0 },
    active: { value: a, enumerable: !0, configurable: !0 },
    x: { value: f, enumerable: !0, configurable: !0 },
    y: { value: h, enumerable: !0, configurable: !0 },
    dx: { value: p, enumerable: !0, configurable: !0 },
    dy: { value: m, enumerable: !0, configurable: !0 },
    _: { value: v }
  });
}
Fa.prototype.on = function() {
  var t = this._.on.apply(this._, arguments);
  return t === this._ ? this : t;
};
function vv(t) {
  return !t.ctrlKey && !t.button;
}
function wv() {
  return this.parentNode;
}
function xv(t, r) {
  return r ?? { x: t.x, y: t.y };
}
function Sv() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function wp() {
  var t = vv, r = wv, i = xv, l = Sv, u = {}, a = gl("start", "drag", "end"), f = 0, h, p, m, v, g = 0;
  function y(M) {
    M.on("mousedown.drag", x).filter(l).on("touchstart.drag", k).on("touchmove.drag", E, yv).on("touchend.drag touchcancel.drag", A).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  function x(M, O) {
    if (!(v || !t.call(this, M, O))) {
      var j = _(this, r.call(this, M, O), M, O, "mouse");
      j && (wt(M.view).on("mousemove.drag", S, li).on("mouseup.drag", N, li), yp(M.view), Ea(M), m = !1, h = M.clientX, p = M.clientY, j("start", M));
    }
  }
  function S(M) {
    if (Jr(M), !m) {
      var O = M.clientX - h, j = M.clientY - p;
      m = O * O + j * j > g;
    }
    u.mouse("drag", M);
  }
  function N(M) {
    wt(M.view).on("mousemove.drag mouseup.drag", null), vp(M.view, m), Jr(M), u.mouse("end", M);
  }
  function k(M, O) {
    if (t.call(this, M, O)) {
      var j = M.changedTouches, H = r.call(this, M, O), G = j.length, K, ie;
      for (K = 0; K < G; ++K)
        (ie = _(this, H, M, O, j[K].identifier, j[K])) && (Ea(M), ie("start", M, j[K]));
    }
  }
  function E(M) {
    var O = M.changedTouches, j = O.length, H, G;
    for (H = 0; H < j; ++H)
      (G = u[O[H].identifier]) && (Jr(M), G("drag", M, O[H]));
  }
  function A(M) {
    var O = M.changedTouches, j = O.length, H, G;
    for (v && clearTimeout(v), v = setTimeout(function() {
      v = null;
    }, 500), H = 0; H < j; ++H)
      (G = u[O[H].identifier]) && (Ea(M), G("end", M, O[H]));
  }
  function _(M, O, j, H, G, K) {
    var ie = a.copy(), X = jt(K || j, O), b, Z, z;
    if ((z = i.call(M, new Fa("beforestart", {
      sourceEvent: j,
      target: y,
      identifier: G,
      active: f,
      x: X[0],
      y: X[1],
      dx: 0,
      dy: 0,
      dispatch: ie
    }), H)) != null)
      return b = z.x - X[0] || 0, Z = z.y - X[1] || 0, function Y(F, U, T) {
        var I = X, V;
        switch (F) {
          case "start":
            u[G] = Y, V = f++;
            break;
          case "end":
            delete u[G], --f;
          // falls through
          case "drag":
            X = jt(T || U, O), V = f;
            break;
        }
        ie.call(
          F,
          M,
          new Fa(F, {
            sourceEvent: U,
            subject: z,
            target: y,
            identifier: G,
            active: V,
            x: X[0] + b,
            y: X[1] + Z,
            dx: X[0] - I[0],
            dy: X[1] - I[1],
            dispatch: ie
          }),
          H
        );
      };
  }
  return y.filter = function(M) {
    return arguments.length ? (t = typeof M == "function" ? M : Us(!!M), y) : t;
  }, y.container = function(M) {
    return arguments.length ? (r = typeof M == "function" ? M : Us(M), y) : r;
  }, y.subject = function(M) {
    return arguments.length ? (i = typeof M == "function" ? M : Us(M), y) : i;
  }, y.touchable = function(M) {
    return arguments.length ? (l = typeof M == "function" ? M : Us(!!M), y) : l;
  }, y.on = function() {
    var M = a.on.apply(a, arguments);
    return M === a ? y : M;
  }, y.clickDistance = function(M) {
    return arguments.length ? (g = (M = +M) * M, y) : Math.sqrt(g);
  }, y;
}
function tc(t, r, i) {
  t.prototype = r.prototype = i, i.constructor = t;
}
function xp(t, r) {
  var i = Object.create(t.prototype);
  for (var l in r) i[l] = r[l];
  return i;
}
function vi() {
}
var ui = 0.7, ol = 1 / ui, eo = "\\s*([+-]?\\d+)\\s*", ai = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", Gt = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", _v = /^#([0-9a-f]{3,8})$/, Ev = new RegExp(`^rgb\\(${eo},${eo},${eo}\\)$`), kv = new RegExp(`^rgb\\(${Gt},${Gt},${Gt}\\)$`), Nv = new RegExp(`^rgba\\(${eo},${eo},${eo},${ai}\\)$`), Cv = new RegExp(`^rgba\\(${Gt},${Gt},${Gt},${ai}\\)$`), Mv = new RegExp(`^hsl\\(${ai},${Gt},${Gt}\\)$`), Pv = new RegExp(`^hsla\\(${ai},${Gt},${Gt},${ai}\\)$`), qd = {
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
tc(vi, hr, {
  copy(t) {
    return Object.assign(new this.constructor(), this, t);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: Zd,
  // Deprecated! Use color.formatHex.
  formatHex: Zd,
  formatHex8: Tv,
  formatHsl: zv,
  formatRgb: Jd,
  toString: Jd
});
function Zd() {
  return this.rgb().formatHex();
}
function Tv() {
  return this.rgb().formatHex8();
}
function zv() {
  return Sp(this).formatHsl();
}
function Jd() {
  return this.rgb().formatRgb();
}
function hr(t) {
  var r, i;
  return t = (t + "").trim().toLowerCase(), (r = _v.exec(t)) ? (i = r[1].length, r = parseInt(r[1], 16), i === 6 ? eh(r) : i === 3 ? new ft(r >> 8 & 15 | r >> 4 & 240, r >> 4 & 15 | r & 240, (r & 15) << 4 | r & 15, 1) : i === 8 ? Ws(r >> 24 & 255, r >> 16 & 255, r >> 8 & 255, (r & 255) / 255) : i === 4 ? Ws(r >> 12 & 15 | r >> 8 & 240, r >> 8 & 15 | r >> 4 & 240, r >> 4 & 15 | r & 240, ((r & 15) << 4 | r & 15) / 255) : null) : (r = Ev.exec(t)) ? new ft(r[1], r[2], r[3], 1) : (r = kv.exec(t)) ? new ft(r[1] * 255 / 100, r[2] * 255 / 100, r[3] * 255 / 100, 1) : (r = Nv.exec(t)) ? Ws(r[1], r[2], r[3], r[4]) : (r = Cv.exec(t)) ? Ws(r[1] * 255 / 100, r[2] * 255 / 100, r[3] * 255 / 100, r[4]) : (r = Mv.exec(t)) ? rh(r[1], r[2] / 100, r[3] / 100, 1) : (r = Pv.exec(t)) ? rh(r[1], r[2] / 100, r[3] / 100, r[4]) : qd.hasOwnProperty(t) ? eh(qd[t]) : t === "transparent" ? new ft(NaN, NaN, NaN, 0) : null;
}
function eh(t) {
  return new ft(t >> 16 & 255, t >> 8 & 255, t & 255, 1);
}
function Ws(t, r, i, l) {
  return l <= 0 && (t = r = i = NaN), new ft(t, r, i, l);
}
function Iv(t) {
  return t instanceof vi || (t = hr(t)), t ? (t = t.rgb(), new ft(t.r, t.g, t.b, t.opacity)) : new ft();
}
function Oa(t, r, i, l) {
  return arguments.length === 1 ? Iv(t) : new ft(t, r, i, l ?? 1);
}
function ft(t, r, i, l) {
  this.r = +t, this.g = +r, this.b = +i, this.opacity = +l;
}
tc(ft, Oa, xp(vi, {
  brighter(t) {
    return t = t == null ? ol : Math.pow(ol, t), new ft(this.r * t, this.g * t, this.b * t, this.opacity);
  },
  darker(t) {
    return t = t == null ? ui : Math.pow(ui, t), new ft(this.r * t, this.g * t, this.b * t, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new ft(cr(this.r), cr(this.g), cr(this.b), il(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: th,
  // Deprecated! Use color.formatHex.
  formatHex: th,
  formatHex8: Lv,
  formatRgb: nh,
  toString: nh
}));
function th() {
  return `#${ar(this.r)}${ar(this.g)}${ar(this.b)}`;
}
function Lv() {
  return `#${ar(this.r)}${ar(this.g)}${ar(this.b)}${ar((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function nh() {
  const t = il(this.opacity);
  return `${t === 1 ? "rgb(" : "rgba("}${cr(this.r)}, ${cr(this.g)}, ${cr(this.b)}${t === 1 ? ")" : `, ${t})`}`;
}
function il(t) {
  return isNaN(t) ? 1 : Math.max(0, Math.min(1, t));
}
function cr(t) {
  return Math.max(0, Math.min(255, Math.round(t) || 0));
}
function ar(t) {
  return t = cr(t), (t < 16 ? "0" : "") + t.toString(16);
}
function rh(t, r, i, l) {
  return l <= 0 ? t = r = i = NaN : i <= 0 || i >= 1 ? t = r = NaN : r <= 0 && (t = NaN), new Ft(t, r, i, l);
}
function Sp(t) {
  if (t instanceof Ft) return new Ft(t.h, t.s, t.l, t.opacity);
  if (t instanceof vi || (t = hr(t)), !t) return new Ft();
  if (t instanceof Ft) return t;
  t = t.rgb();
  var r = t.r / 255, i = t.g / 255, l = t.b / 255, u = Math.min(r, i, l), a = Math.max(r, i, l), f = NaN, h = a - u, p = (a + u) / 2;
  return h ? (r === a ? f = (i - l) / h + (i < l) * 6 : i === a ? f = (l - r) / h + 2 : f = (r - i) / h + 4, h /= p < 0.5 ? a + u : 2 - a - u, f *= 60) : h = p > 0 && p < 1 ? 0 : f, new Ft(f, h, p, t.opacity);
}
function Av(t, r, i, l) {
  return arguments.length === 1 ? Sp(t) : new Ft(t, r, i, l ?? 1);
}
function Ft(t, r, i, l) {
  this.h = +t, this.s = +r, this.l = +i, this.opacity = +l;
}
tc(Ft, Av, xp(vi, {
  brighter(t) {
    return t = t == null ? ol : Math.pow(ol, t), new Ft(this.h, this.s, this.l * t, this.opacity);
  },
  darker(t) {
    return t = t == null ? ui : Math.pow(ui, t), new Ft(this.h, this.s, this.l * t, this.opacity);
  },
  rgb() {
    var t = this.h % 360 + (this.h < 0) * 360, r = isNaN(t) || isNaN(this.s) ? 0 : this.s, i = this.l, l = i + (i < 0.5 ? i : 1 - i) * r, u = 2 * i - l;
    return new ft(
      ka(t >= 240 ? t - 240 : t + 120, u, l),
      ka(t, u, l),
      ka(t < 120 ? t + 240 : t - 120, u, l),
      this.opacity
    );
  },
  clamp() {
    return new Ft(oh(this.h), Ys(this.s), Ys(this.l), il(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const t = il(this.opacity);
    return `${t === 1 ? "hsl(" : "hsla("}${oh(this.h)}, ${Ys(this.s) * 100}%, ${Ys(this.l) * 100}%${t === 1 ? ")" : `, ${t})`}`;
  }
}));
function oh(t) {
  return t = (t || 0) % 360, t < 0 ? t + 360 : t;
}
function Ys(t) {
  return Math.max(0, Math.min(1, t || 0));
}
function ka(t, r, i) {
  return (t < 60 ? r + (i - r) * t / 60 : t < 180 ? i : t < 240 ? r + (i - r) * (240 - t) / 60 : r) * 255;
}
const nc = (t) => () => t;
function Rv(t, r) {
  return function(i) {
    return t + i * r;
  };
}
function Dv(t, r, i) {
  return t = Math.pow(t, i), r = Math.pow(r, i) - t, i = 1 / i, function(l) {
    return Math.pow(t + l * r, i);
  };
}
function $v(t) {
  return (t = +t) == 1 ? _p : function(r, i) {
    return i - r ? Dv(r, i, t) : nc(isNaN(r) ? i : r);
  };
}
function _p(t, r) {
  var i = r - t;
  return i ? Rv(t, i) : nc(isNaN(t) ? r : t);
}
const sl = (function t(r) {
  var i = $v(r);
  function l(u, a) {
    var f = i((u = Oa(u)).r, (a = Oa(a)).r), h = i(u.g, a.g), p = i(u.b, a.b), m = _p(u.opacity, a.opacity);
    return function(v) {
      return u.r = f(v), u.g = h(v), u.b = p(v), u.opacity = m(v), u + "";
    };
  }
  return l.gamma = t, l;
})(1);
function jv(t, r) {
  r || (r = []);
  var i = t ? Math.min(r.length, t.length) : 0, l = r.slice(), u;
  return function(a) {
    for (u = 0; u < i; ++u) l[u] = t[u] * (1 - a) + r[u] * a;
    return l;
  };
}
function Fv(t) {
  return ArrayBuffer.isView(t) && !(t instanceof DataView);
}
function Ov(t, r) {
  var i = r ? r.length : 0, l = t ? Math.min(i, t.length) : 0, u = new Array(l), a = new Array(i), f;
  for (f = 0; f < l; ++f) u[f] = ii(t[f], r[f]);
  for (; f < i; ++f) a[f] = r[f];
  return function(h) {
    for (f = 0; f < l; ++f) a[f] = u[f](h);
    return a;
  };
}
function Hv(t, r) {
  var i = /* @__PURE__ */ new Date();
  return t = +t, r = +r, function(l) {
    return i.setTime(t * (1 - l) + r * l), i;
  };
}
function Qt(t, r) {
  return t = +t, r = +r, function(i) {
    return t * (1 - i) + r * i;
  };
}
function Vv(t, r) {
  var i = {}, l = {}, u;
  (t === null || typeof t != "object") && (t = {}), (r === null || typeof r != "object") && (r = {});
  for (u in r)
    u in t ? i[u] = ii(t[u], r[u]) : l[u] = r[u];
  return function(a) {
    for (u in i) l[u] = i[u](a);
    return l;
  };
}
var Ha = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, Na = new RegExp(Ha.source, "g");
function Bv(t) {
  return function() {
    return t;
  };
}
function Uv(t) {
  return function(r) {
    return t(r) + "";
  };
}
function Ep(t, r) {
  var i = Ha.lastIndex = Na.lastIndex = 0, l, u, a, f = -1, h = [], p = [];
  for (t = t + "", r = r + ""; (l = Ha.exec(t)) && (u = Na.exec(r)); )
    (a = u.index) > i && (a = r.slice(i, a), h[f] ? h[f] += a : h[++f] = a), (l = l[0]) === (u = u[0]) ? h[f] ? h[f] += u : h[++f] = u : (h[++f] = null, p.push({ i: f, x: Qt(l, u) })), i = Na.lastIndex;
  return i < r.length && (a = r.slice(i), h[f] ? h[f] += a : h[++f] = a), h.length < 2 ? p[0] ? Uv(p[0].x) : Bv(r) : (r = p.length, function(m) {
    for (var v = 0, g; v < r; ++v) h[(g = p[v]).i] = g.x(m);
    return h.join("");
  });
}
function ii(t, r) {
  var i = typeof r, l;
  return r == null || i === "boolean" ? nc(r) : (i === "number" ? Qt : i === "string" ? (l = hr(r)) ? (r = l, sl) : Ep : r instanceof hr ? sl : r instanceof Date ? Hv : Fv(r) ? jv : Array.isArray(r) ? Ov : typeof r.valueOf != "function" && typeof r.toString != "function" || isNaN(r) ? Vv : Qt)(t, r);
}
var ih = 180 / Math.PI, Va = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function kp(t, r, i, l, u, a) {
  var f, h, p;
  return (f = Math.sqrt(t * t + r * r)) && (t /= f, r /= f), (p = t * i + r * l) && (i -= t * p, l -= r * p), (h = Math.sqrt(i * i + l * l)) && (i /= h, l /= h, p /= h), t * l < r * i && (t = -t, r = -r, p = -p, f = -f), {
    translateX: u,
    translateY: a,
    rotate: Math.atan2(r, t) * ih,
    skewX: Math.atan(p) * ih,
    scaleX: f,
    scaleY: h
  };
}
var Xs;
function Wv(t) {
  const r = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(t + "");
  return r.isIdentity ? Va : kp(r.a, r.b, r.c, r.d, r.e, r.f);
}
function Yv(t) {
  return t == null || (Xs || (Xs = document.createElementNS("http://www.w3.org/2000/svg", "g")), Xs.setAttribute("transform", t), !(t = Xs.transform.baseVal.consolidate())) ? Va : (t = t.matrix, kp(t.a, t.b, t.c, t.d, t.e, t.f));
}
function Np(t, r, i, l) {
  function u(m) {
    return m.length ? m.pop() + " " : "";
  }
  function a(m, v, g, y, x, S) {
    if (m !== g || v !== y) {
      var N = x.push("translate(", null, r, null, i);
      S.push({ i: N - 4, x: Qt(m, g) }, { i: N - 2, x: Qt(v, y) });
    } else (g || y) && x.push("translate(" + g + r + y + i);
  }
  function f(m, v, g, y) {
    m !== v ? (m - v > 180 ? v += 360 : v - m > 180 && (m += 360), y.push({ i: g.push(u(g) + "rotate(", null, l) - 2, x: Qt(m, v) })) : v && g.push(u(g) + "rotate(" + v + l);
  }
  function h(m, v, g, y) {
    m !== v ? y.push({ i: g.push(u(g) + "skewX(", null, l) - 2, x: Qt(m, v) }) : v && g.push(u(g) + "skewX(" + v + l);
  }
  function p(m, v, g, y, x, S) {
    if (m !== g || v !== y) {
      var N = x.push(u(x) + "scale(", null, ",", null, ")");
      S.push({ i: N - 4, x: Qt(m, g) }, { i: N - 2, x: Qt(v, y) });
    } else (g !== 1 || y !== 1) && x.push(u(x) + "scale(" + g + "," + y + ")");
  }
  return function(m, v) {
    var g = [], y = [];
    return m = t(m), v = t(v), a(m.translateX, m.translateY, v.translateX, v.translateY, g, y), f(m.rotate, v.rotate, g, y), h(m.skewX, v.skewX, g, y), p(m.scaleX, m.scaleY, v.scaleX, v.scaleY, g, y), m = v = null, function(x) {
      for (var S = -1, N = y.length, k; ++S < N; ) g[(k = y[S]).i] = k.x(x);
      return g.join("");
    };
  };
}
var Xv = Np(Wv, "px, ", "px)", "deg)"), bv = Np(Yv, ", ", ")", ")"), Qv = 1e-12;
function sh(t) {
  return ((t = Math.exp(t)) + 1 / t) / 2;
}
function Gv(t) {
  return ((t = Math.exp(t)) - 1 / t) / 2;
}
function Kv(t) {
  return ((t = Math.exp(2 * t)) - 1) / (t + 1);
}
const Js = (function t(r, i, l) {
  function u(a, f) {
    var h = a[0], p = a[1], m = a[2], v = f[0], g = f[1], y = f[2], x = v - h, S = g - p, N = x * x + S * S, k, E;
    if (N < Qv)
      E = Math.log(y / m) / r, k = function(H) {
        return [
          h + H * x,
          p + H * S,
          m * Math.exp(r * H * E)
        ];
      };
    else {
      var A = Math.sqrt(N), _ = (y * y - m * m + l * N) / (2 * m * i * A), M = (y * y - m * m - l * N) / (2 * y * i * A), O = Math.log(Math.sqrt(_ * _ + 1) - _), j = Math.log(Math.sqrt(M * M + 1) - M);
      E = (j - O) / r, k = function(H) {
        var G = H * E, K = sh(O), ie = m / (i * A) * (K * Kv(r * G + O) - Gv(O));
        return [
          h + ie * x,
          p + ie * S,
          m * K / sh(r * G + O)
        ];
      };
    }
    return k.duration = E * 1e3 * r / Math.SQRT2, k;
  }
  return u.rho = function(a) {
    var f = Math.max(1e-3, +a), h = f * f, p = h * h;
    return t(f, h, p);
  }, u;
})(Math.SQRT2, 2, 4);
var no = 0, ri = 0, ti = 0, Cp = 1e3, ll, oi, ul = 0, pr = 0, yl = 0, ci = typeof performance == "object" && performance.now ? performance : Date, Mp = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(t) {
  setTimeout(t, 17);
};
function rc() {
  return pr || (Mp(qv), pr = ci.now() + yl);
}
function qv() {
  pr = 0;
}
function al() {
  this._call = this._time = this._next = null;
}
al.prototype = Pp.prototype = {
  constructor: al,
  restart: function(t, r, i) {
    if (typeof t != "function") throw new TypeError("callback is not a function");
    i = (i == null ? rc() : +i) + (r == null ? 0 : +r), !this._next && oi !== this && (oi ? oi._next = this : ll = this, oi = this), this._call = t, this._time = i, Ba();
  },
  stop: function() {
    this._call && (this._call = null, this._time = 1 / 0, Ba());
  }
};
function Pp(t, r, i) {
  var l = new al();
  return l.restart(t, r, i), l;
}
function Zv() {
  rc(), ++no;
  for (var t = ll, r; t; )
    (r = pr - t._time) >= 0 && t._call.call(void 0, r), t = t._next;
  --no;
}
function lh() {
  pr = (ul = ci.now()) + yl, no = ri = 0;
  try {
    Zv();
  } finally {
    no = 0, ew(), pr = 0;
  }
}
function Jv() {
  var t = ci.now(), r = t - ul;
  r > Cp && (yl -= r, ul = t);
}
function ew() {
  for (var t, r = ll, i, l = 1 / 0; r; )
    r._call ? (l > r._time && (l = r._time), t = r, r = r._next) : (i = r._next, r._next = null, r = t ? t._next = i : ll = i);
  oi = t, Ba(l);
}
function Ba(t) {
  if (!no) {
    ri && (ri = clearTimeout(ri));
    var r = t - pr;
    r > 24 ? (t < 1 / 0 && (ri = setTimeout(lh, t - ci.now() - yl)), ti && (ti = clearInterval(ti))) : (ti || (ul = ci.now(), ti = setInterval(Jv, Cp)), no = 1, Mp(lh));
  }
}
function uh(t, r, i) {
  var l = new al();
  return r = r == null ? 0 : +r, l.restart((u) => {
    l.stop(), t(u + r);
  }, r, i), l;
}
var tw = gl("start", "end", "cancel", "interrupt"), nw = [], Tp = 0, ah = 1, Ua = 2, el = 3, ch = 4, Wa = 5, tl = 6;
function vl(t, r, i, l, u, a) {
  var f = t.__transition;
  if (!f) t.__transition = {};
  else if (i in f) return;
  rw(t, i, {
    name: r,
    index: l,
    // For context during callback.
    group: u,
    // For context during callback.
    on: tw,
    tween: nw,
    time: a.time,
    delay: a.delay,
    duration: a.duration,
    ease: a.ease,
    timer: null,
    state: Tp
  });
}
function oc(t, r) {
  var i = Vt(t, r);
  if (i.state > Tp) throw new Error("too late; already scheduled");
  return i;
}
function qt(t, r) {
  var i = Vt(t, r);
  if (i.state > el) throw new Error("too late; already running");
  return i;
}
function Vt(t, r) {
  var i = t.__transition;
  if (!i || !(i = i[r])) throw new Error("transition not found");
  return i;
}
function rw(t, r, i) {
  var l = t.__transition, u;
  l[r] = i, i.timer = Pp(a, 0, i.time);
  function a(m) {
    i.state = ah, i.timer.restart(f, i.delay, i.time), i.delay <= m && f(m - i.delay);
  }
  function f(m) {
    var v, g, y, x;
    if (i.state !== ah) return p();
    for (v in l)
      if (x = l[v], x.name === i.name) {
        if (x.state === el) return uh(f);
        x.state === ch ? (x.state = tl, x.timer.stop(), x.on.call("interrupt", t, t.__data__, x.index, x.group), delete l[v]) : +v < r && (x.state = tl, x.timer.stop(), x.on.call("cancel", t, t.__data__, x.index, x.group), delete l[v]);
      }
    if (uh(function() {
      i.state === el && (i.state = ch, i.timer.restart(h, i.delay, i.time), h(m));
    }), i.state = Ua, i.on.call("start", t, t.__data__, i.index, i.group), i.state === Ua) {
      for (i.state = el, u = new Array(y = i.tween.length), v = 0, g = -1; v < y; ++v)
        (x = i.tween[v].value.call(t, t.__data__, i.index, i.group)) && (u[++g] = x);
      u.length = g + 1;
    }
  }
  function h(m) {
    for (var v = m < i.duration ? i.ease.call(null, m / i.duration) : (i.timer.restart(p), i.state = Wa, 1), g = -1, y = u.length; ++g < y; )
      u[g].call(t, v);
    i.state === Wa && (i.on.call("end", t, t.__data__, i.index, i.group), p());
  }
  function p() {
    i.state = tl, i.timer.stop(), delete l[r];
    for (var m in l) return;
    delete t.__transition;
  }
}
function nl(t, r) {
  var i = t.__transition, l, u, a = !0, f;
  if (i) {
    r = r == null ? null : r + "";
    for (f in i) {
      if ((l = i[f]).name !== r) {
        a = !1;
        continue;
      }
      u = l.state > Ua && l.state < Wa, l.state = tl, l.timer.stop(), l.on.call(u ? "interrupt" : "cancel", t, t.__data__, l.index, l.group), delete i[f];
    }
    a && delete t.__transition;
  }
}
function ow(t) {
  return this.each(function() {
    nl(this, t);
  });
}
function iw(t, r) {
  var i, l;
  return function() {
    var u = qt(this, t), a = u.tween;
    if (a !== i) {
      l = i = a;
      for (var f = 0, h = l.length; f < h; ++f)
        if (l[f].name === r) {
          l = l.slice(), l.splice(f, 1);
          break;
        }
    }
    u.tween = l;
  };
}
function sw(t, r, i) {
  var l, u;
  if (typeof i != "function") throw new Error();
  return function() {
    var a = qt(this, t), f = a.tween;
    if (f !== l) {
      u = (l = f).slice();
      for (var h = { name: r, value: i }, p = 0, m = u.length; p < m; ++p)
        if (u[p].name === r) {
          u[p] = h;
          break;
        }
      p === m && u.push(h);
    }
    a.tween = u;
  };
}
function lw(t, r) {
  var i = this._id;
  if (t += "", arguments.length < 2) {
    for (var l = Vt(this.node(), i).tween, u = 0, a = l.length, f; u < a; ++u)
      if ((f = l[u]).name === t)
        return f.value;
    return null;
  }
  return this.each((r == null ? iw : sw)(i, t, r));
}
function ic(t, r, i) {
  var l = t._id;
  return t.each(function() {
    var u = qt(this, l);
    (u.value || (u.value = {}))[r] = i.apply(this, arguments);
  }), function(u) {
    return Vt(u, l).value[r];
  };
}
function zp(t, r) {
  var i;
  return (typeof r == "number" ? Qt : r instanceof hr ? sl : (i = hr(r)) ? (r = i, sl) : Ep)(t, r);
}
function uw(t) {
  return function() {
    this.removeAttribute(t);
  };
}
function aw(t) {
  return function() {
    this.removeAttributeNS(t.space, t.local);
  };
}
function cw(t, r, i) {
  var l, u = i + "", a;
  return function() {
    var f = this.getAttribute(t);
    return f === u ? null : f === l ? a : a = r(l = f, i);
  };
}
function fw(t, r, i) {
  var l, u = i + "", a;
  return function() {
    var f = this.getAttributeNS(t.space, t.local);
    return f === u ? null : f === l ? a : a = r(l = f, i);
  };
}
function dw(t, r, i) {
  var l, u, a;
  return function() {
    var f, h = i(this), p;
    return h == null ? void this.removeAttribute(t) : (f = this.getAttribute(t), p = h + "", f === p ? null : f === l && p === u ? a : (u = p, a = r(l = f, h)));
  };
}
function hw(t, r, i) {
  var l, u, a;
  return function() {
    var f, h = i(this), p;
    return h == null ? void this.removeAttributeNS(t.space, t.local) : (f = this.getAttributeNS(t.space, t.local), p = h + "", f === p ? null : f === l && p === u ? a : (u = p, a = r(l = f, h)));
  };
}
function pw(t, r) {
  var i = ml(t), l = i === "transform" ? bv : zp;
  return this.attrTween(t, typeof r == "function" ? (i.local ? hw : dw)(i, l, ic(this, "attr." + t, r)) : r == null ? (i.local ? aw : uw)(i) : (i.local ? fw : cw)(i, l, r));
}
function gw(t, r) {
  return function(i) {
    this.setAttribute(t, r.call(this, i));
  };
}
function mw(t, r) {
  return function(i) {
    this.setAttributeNS(t.space, t.local, r.call(this, i));
  };
}
function yw(t, r) {
  var i, l;
  function u() {
    var a = r.apply(this, arguments);
    return a !== l && (i = (l = a) && mw(t, a)), i;
  }
  return u._value = r, u;
}
function vw(t, r) {
  var i, l;
  function u() {
    var a = r.apply(this, arguments);
    return a !== l && (i = (l = a) && gw(t, a)), i;
  }
  return u._value = r, u;
}
function ww(t, r) {
  var i = "attr." + t;
  if (arguments.length < 2) return (i = this.tween(i)) && i._value;
  if (r == null) return this.tween(i, null);
  if (typeof r != "function") throw new Error();
  var l = ml(t);
  return this.tween(i, (l.local ? yw : vw)(l, r));
}
function xw(t, r) {
  return function() {
    oc(this, t).delay = +r.apply(this, arguments);
  };
}
function Sw(t, r) {
  return r = +r, function() {
    oc(this, t).delay = r;
  };
}
function _w(t) {
  var r = this._id;
  return arguments.length ? this.each((typeof t == "function" ? xw : Sw)(r, t)) : Vt(this.node(), r).delay;
}
function Ew(t, r) {
  return function() {
    qt(this, t).duration = +r.apply(this, arguments);
  };
}
function kw(t, r) {
  return r = +r, function() {
    qt(this, t).duration = r;
  };
}
function Nw(t) {
  var r = this._id;
  return arguments.length ? this.each((typeof t == "function" ? Ew : kw)(r, t)) : Vt(this.node(), r).duration;
}
function Cw(t, r) {
  if (typeof r != "function") throw new Error();
  return function() {
    qt(this, t).ease = r;
  };
}
function Mw(t) {
  var r = this._id;
  return arguments.length ? this.each(Cw(r, t)) : Vt(this.node(), r).ease;
}
function Pw(t, r) {
  return function() {
    var i = r.apply(this, arguments);
    if (typeof i != "function") throw new Error();
    qt(this, t).ease = i;
  };
}
function Tw(t) {
  if (typeof t != "function") throw new Error();
  return this.each(Pw(this._id, t));
}
function zw(t) {
  typeof t != "function" && (t = lp(t));
  for (var r = this._groups, i = r.length, l = new Array(i), u = 0; u < i; ++u)
    for (var a = r[u], f = a.length, h = l[u] = [], p, m = 0; m < f; ++m)
      (p = a[m]) && t.call(p, p.__data__, m, a) && h.push(p);
  return new gn(l, this._parents, this._name, this._id);
}
function Iw(t) {
  if (t._id !== this._id) throw new Error();
  for (var r = this._groups, i = t._groups, l = r.length, u = i.length, a = Math.min(l, u), f = new Array(l), h = 0; h < a; ++h)
    for (var p = r[h], m = i[h], v = p.length, g = f[h] = new Array(v), y, x = 0; x < v; ++x)
      (y = p[x] || m[x]) && (g[x] = y);
  for (; h < l; ++h)
    f[h] = r[h];
  return new gn(f, this._parents, this._name, this._id);
}
function Lw(t) {
  return (t + "").trim().split(/^|\s+/).every(function(r) {
    var i = r.indexOf(".");
    return i >= 0 && (r = r.slice(0, i)), !r || r === "start";
  });
}
function Aw(t, r, i) {
  var l, u, a = Lw(r) ? oc : qt;
  return function() {
    var f = a(this, t), h = f.on;
    h !== l && (u = (l = h).copy()).on(r, i), f.on = u;
  };
}
function Rw(t, r) {
  var i = this._id;
  return arguments.length < 2 ? Vt(this.node(), i).on.on(t) : this.each(Aw(i, t, r));
}
function Dw(t) {
  return function() {
    var r = this.parentNode;
    for (var i in this.__transition) if (+i !== t) return;
    r && r.removeChild(this);
  };
}
function $w() {
  return this.on("end.remove", Dw(this._id));
}
function jw(t) {
  var r = this._name, i = this._id;
  typeof t != "function" && (t = Ja(t));
  for (var l = this._groups, u = l.length, a = new Array(u), f = 0; f < u; ++f)
    for (var h = l[f], p = h.length, m = a[f] = new Array(p), v, g, y = 0; y < p; ++y)
      (v = h[y]) && (g = t.call(v, v.__data__, y, h)) && ("__data__" in v && (g.__data__ = v.__data__), m[y] = g, vl(m[y], r, i, y, m, Vt(v, i)));
  return new gn(a, this._parents, r, i);
}
function Fw(t) {
  var r = this._name, i = this._id;
  typeof t != "function" && (t = sp(t));
  for (var l = this._groups, u = l.length, a = [], f = [], h = 0; h < u; ++h)
    for (var p = l[h], m = p.length, v, g = 0; g < m; ++g)
      if (v = p[g]) {
        for (var y = t.call(v, v.__data__, g, p), x, S = Vt(v, i), N = 0, k = y.length; N < k; ++N)
          (x = y[N]) && vl(x, r, i, N, y, S);
        a.push(y), f.push(v);
      }
  return new gn(a, f, r, i);
}
var Ow = yi.prototype.constructor;
function Hw() {
  return new Ow(this._groups, this._parents);
}
function Vw(t, r) {
  var i, l, u;
  return function() {
    var a = to(this, t), f = (this.style.removeProperty(t), to(this, t));
    return a === f ? null : a === i && f === l ? u : u = r(i = a, l = f);
  };
}
function Ip(t) {
  return function() {
    this.style.removeProperty(t);
  };
}
function Bw(t, r, i) {
  var l, u = i + "", a;
  return function() {
    var f = to(this, t);
    return f === u ? null : f === l ? a : a = r(l = f, i);
  };
}
function Uw(t, r, i) {
  var l, u, a;
  return function() {
    var f = to(this, t), h = i(this), p = h + "";
    return h == null && (p = h = (this.style.removeProperty(t), to(this, t))), f === p ? null : f === l && p === u ? a : (u = p, a = r(l = f, h));
  };
}
function Ww(t, r) {
  var i, l, u, a = "style." + r, f = "end." + a, h;
  return function() {
    var p = qt(this, t), m = p.on, v = p.value[a] == null ? h || (h = Ip(r)) : void 0;
    (m !== i || u !== v) && (l = (i = m).copy()).on(f, u = v), p.on = l;
  };
}
function Yw(t, r, i) {
  var l = (t += "") == "transform" ? Xv : zp;
  return r == null ? this.styleTween(t, Vw(t, l)).on("end.style." + t, Ip(t)) : typeof r == "function" ? this.styleTween(t, Uw(t, l, ic(this, "style." + t, r))).each(Ww(this._id, t)) : this.styleTween(t, Bw(t, l, r), i).on("end.style." + t, null);
}
function Xw(t, r, i) {
  return function(l) {
    this.style.setProperty(t, r.call(this, l), i);
  };
}
function bw(t, r, i) {
  var l, u;
  function a() {
    var f = r.apply(this, arguments);
    return f !== u && (l = (u = f) && Xw(t, f, i)), l;
  }
  return a._value = r, a;
}
function Qw(t, r, i) {
  var l = "style." + (t += "");
  if (arguments.length < 2) return (l = this.tween(l)) && l._value;
  if (r == null) return this.tween(l, null);
  if (typeof r != "function") throw new Error();
  return this.tween(l, bw(t, r, i ?? ""));
}
function Gw(t) {
  return function() {
    this.textContent = t;
  };
}
function Kw(t) {
  return function() {
    var r = t(this);
    this.textContent = r ?? "";
  };
}
function qw(t) {
  return this.tween("text", typeof t == "function" ? Kw(ic(this, "text", t)) : Gw(t == null ? "" : t + ""));
}
function Zw(t) {
  return function(r) {
    this.textContent = t.call(this, r);
  };
}
function Jw(t) {
  var r, i;
  function l() {
    var u = t.apply(this, arguments);
    return u !== i && (r = (i = u) && Zw(u)), r;
  }
  return l._value = t, l;
}
function ex(t) {
  var r = "text";
  if (arguments.length < 1) return (r = this.tween(r)) && r._value;
  if (t == null) return this.tween(r, null);
  if (typeof t != "function") throw new Error();
  return this.tween(r, Jw(t));
}
function tx() {
  for (var t = this._name, r = this._id, i = Lp(), l = this._groups, u = l.length, a = 0; a < u; ++a)
    for (var f = l[a], h = f.length, p, m = 0; m < h; ++m)
      if (p = f[m]) {
        var v = Vt(p, r);
        vl(p, t, i, m, f, {
          time: v.time + v.delay + v.duration,
          delay: 0,
          duration: v.duration,
          ease: v.ease
        });
      }
  return new gn(l, this._parents, t, i);
}
function nx() {
  var t, r, i = this, l = i._id, u = i.size();
  return new Promise(function(a, f) {
    var h = { value: f }, p = { value: function() {
      --u === 0 && a();
    } };
    i.each(function() {
      var m = qt(this, l), v = m.on;
      v !== t && (r = (t = v).copy(), r._.cancel.push(h), r._.interrupt.push(h), r._.end.push(p)), m.on = r;
    }), u === 0 && a();
  });
}
var rx = 0;
function gn(t, r, i, l) {
  this._groups = t, this._parents = r, this._name = i, this._id = l;
}
function Lp() {
  return ++rx;
}
var fn = yi.prototype;
gn.prototype = {
  constructor: gn,
  select: jw,
  selectAll: Fw,
  selectChild: fn.selectChild,
  selectChildren: fn.selectChildren,
  filter: zw,
  merge: Iw,
  selection: Hw,
  transition: tx,
  call: fn.call,
  nodes: fn.nodes,
  node: fn.node,
  size: fn.size,
  empty: fn.empty,
  each: fn.each,
  on: Rw,
  attr: pw,
  attrTween: ww,
  style: Yw,
  styleTween: Qw,
  text: qw,
  textTween: ex,
  remove: $w,
  tween: lw,
  delay: _w,
  duration: Nw,
  ease: Mw,
  easeVarying: Tw,
  end: nx,
  [Symbol.iterator]: fn[Symbol.iterator]
};
function ox(t) {
  return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
}
var ix = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: ox
};
function sx(t, r) {
  for (var i; !(i = t.__transition) || !(i = i[r]); )
    if (!(t = t.parentNode))
      throw new Error(`transition ${r} not found`);
  return i;
}
function lx(t) {
  var r, i;
  t instanceof gn ? (r = t._id, t = t._name) : (r = Lp(), (i = ix).time = rc(), t = t == null ? null : t + "");
  for (var l = this._groups, u = l.length, a = 0; a < u; ++a)
    for (var f = l[a], h = f.length, p, m = 0; m < h; ++m)
      (p = f[m]) && vl(p, t, r, m, f, i || sx(p, r));
  return new gn(l, this._parents, t, r);
}
yi.prototype.interrupt = ow;
yi.prototype.transition = lx;
const bs = (t) => () => t;
function ux(t, {
  sourceEvent: r,
  target: i,
  transform: l,
  dispatch: u
}) {
  Object.defineProperties(this, {
    type: { value: t, enumerable: !0, configurable: !0 },
    sourceEvent: { value: r, enumerable: !0, configurable: !0 },
    target: { value: i, enumerable: !0, configurable: !0 },
    transform: { value: l, enumerable: !0, configurable: !0 },
    _: { value: u }
  });
}
function dn(t, r, i) {
  this.k = t, this.x = r, this.y = i;
}
dn.prototype = {
  constructor: dn,
  scale: function(t) {
    return t === 1 ? this : new dn(this.k * t, this.x, this.y);
  },
  translate: function(t, r) {
    return t === 0 & r === 0 ? this : new dn(this.k, this.x + this.k * t, this.y + this.k * r);
  },
  apply: function(t) {
    return [t[0] * this.k + this.x, t[1] * this.k + this.y];
  },
  applyX: function(t) {
    return t * this.k + this.x;
  },
  applyY: function(t) {
    return t * this.k + this.y;
  },
  invert: function(t) {
    return [(t[0] - this.x) / this.k, (t[1] - this.y) / this.k];
  },
  invertX: function(t) {
    return (t - this.x) / this.k;
  },
  invertY: function(t) {
    return (t - this.y) / this.k;
  },
  rescaleX: function(t) {
    return t.copy().domain(t.range().map(this.invertX, this).map(t.invert, t));
  },
  rescaleY: function(t) {
    return t.copy().domain(t.range().map(this.invertY, this).map(t.invert, t));
  },
  toString: function() {
    return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
  }
};
var wl = new dn(1, 0, 0);
Ap.prototype = dn.prototype;
function Ap(t) {
  for (; !t.__zoom; ) if (!(t = t.parentNode)) return wl;
  return t.__zoom;
}
function Ca(t) {
  t.stopImmediatePropagation();
}
function ni(t) {
  t.preventDefault(), t.stopImmediatePropagation();
}
function ax(t) {
  return (!t.ctrlKey || t.type === "wheel") && !t.button;
}
function cx() {
  var t = this;
  return t instanceof SVGElement ? (t = t.ownerSVGElement || t, t.hasAttribute("viewBox") ? (t = t.viewBox.baseVal, [[t.x, t.y], [t.x + t.width, t.y + t.height]]) : [[0, 0], [t.width.baseVal.value, t.height.baseVal.value]]) : [[0, 0], [t.clientWidth, t.clientHeight]];
}
function fh() {
  return this.__zoom || wl;
}
function fx(t) {
  return -t.deltaY * (t.deltaMode === 1 ? 0.05 : t.deltaMode ? 1 : 2e-3) * (t.ctrlKey ? 10 : 1);
}
function dx() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function hx(t, r, i) {
  var l = t.invertX(r[0][0]) - i[0][0], u = t.invertX(r[1][0]) - i[1][0], a = t.invertY(r[0][1]) - i[0][1], f = t.invertY(r[1][1]) - i[1][1];
  return t.translate(
    u > l ? (l + u) / 2 : Math.min(0, l) || Math.max(0, u),
    f > a ? (a + f) / 2 : Math.min(0, a) || Math.max(0, f)
  );
}
function Rp() {
  var t = ax, r = cx, i = hx, l = fx, u = dx, a = [0, 1 / 0], f = [[-1 / 0, -1 / 0], [1 / 0, 1 / 0]], h = 250, p = Js, m = gl("start", "zoom", "end"), v, g, y, x = 500, S = 150, N = 0, k = 10;
  function E(z) {
    z.property("__zoom", fh).on("wheel.zoom", G, { passive: !1 }).on("mousedown.zoom", K).on("dblclick.zoom", ie).filter(u).on("touchstart.zoom", X).on("touchmove.zoom", b).on("touchend.zoom touchcancel.zoom", Z).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  E.transform = function(z, Y, F, U) {
    var T = z.selection ? z.selection() : z;
    T.property("__zoom", fh), z !== T ? O(z, Y, F, U) : T.interrupt().each(function() {
      j(this, arguments).event(U).start().zoom(null, typeof Y == "function" ? Y.apply(this, arguments) : Y).end();
    });
  }, E.scaleBy = function(z, Y, F, U) {
    E.scaleTo(z, function() {
      var T = this.__zoom.k, I = typeof Y == "function" ? Y.apply(this, arguments) : Y;
      return T * I;
    }, F, U);
  }, E.scaleTo = function(z, Y, F, U) {
    E.transform(z, function() {
      var T = r.apply(this, arguments), I = this.__zoom, V = F == null ? M(T) : typeof F == "function" ? F.apply(this, arguments) : F, C = I.invert(V), R = typeof Y == "function" ? Y.apply(this, arguments) : Y;
      return i(_(A(I, R), V, C), T, f);
    }, F, U);
  }, E.translateBy = function(z, Y, F, U) {
    E.transform(z, function() {
      return i(this.__zoom.translate(
        typeof Y == "function" ? Y.apply(this, arguments) : Y,
        typeof F == "function" ? F.apply(this, arguments) : F
      ), r.apply(this, arguments), f);
    }, null, U);
  }, E.translateTo = function(z, Y, F, U, T) {
    E.transform(z, function() {
      var I = r.apply(this, arguments), V = this.__zoom, C = U == null ? M(I) : typeof U == "function" ? U.apply(this, arguments) : U;
      return i(wl.translate(C[0], C[1]).scale(V.k).translate(
        typeof Y == "function" ? -Y.apply(this, arguments) : -Y,
        typeof F == "function" ? -F.apply(this, arguments) : -F
      ), I, f);
    }, U, T);
  };
  function A(z, Y) {
    return Y = Math.max(a[0], Math.min(a[1], Y)), Y === z.k ? z : new dn(Y, z.x, z.y);
  }
  function _(z, Y, F) {
    var U = Y[0] - F[0] * z.k, T = Y[1] - F[1] * z.k;
    return U === z.x && T === z.y ? z : new dn(z.k, U, T);
  }
  function M(z) {
    return [(+z[0][0] + +z[1][0]) / 2, (+z[0][1] + +z[1][1]) / 2];
  }
  function O(z, Y, F, U) {
    z.on("start.zoom", function() {
      j(this, arguments).event(U).start();
    }).on("interrupt.zoom end.zoom", function() {
      j(this, arguments).event(U).end();
    }).tween("zoom", function() {
      var T = this, I = arguments, V = j(T, I).event(U), C = r.apply(T, I), R = F == null ? M(C) : typeof F == "function" ? F.apply(T, I) : F, te = Math.max(C[1][0] - C[0][0], C[1][1] - C[0][1]), ee = T.__zoom, le = typeof Y == "function" ? Y.apply(T, I) : Y, ue = p(ee.invert(R).concat(te / ee.k), le.invert(R).concat(te / le.k));
      return function(ae) {
        if (ae === 1) ae = le;
        else {
          var J = ue(ae), ce = te / J[2];
          ae = new dn(ce, R[0] - J[0] * ce, R[1] - J[1] * ce);
        }
        V.zoom(null, ae);
      };
    });
  }
  function j(z, Y, F) {
    return !F && z.__zooming || new H(z, Y);
  }
  function H(z, Y) {
    this.that = z, this.args = Y, this.active = 0, this.sourceEvent = null, this.extent = r.apply(z, Y), this.taps = 0;
  }
  H.prototype = {
    event: function(z) {
      return z && (this.sourceEvent = z), this;
    },
    start: function() {
      return ++this.active === 1 && (this.that.__zooming = this, this.emit("start")), this;
    },
    zoom: function(z, Y) {
      return this.mouse && z !== "mouse" && (this.mouse[1] = Y.invert(this.mouse[0])), this.touch0 && z !== "touch" && (this.touch0[1] = Y.invert(this.touch0[0])), this.touch1 && z !== "touch" && (this.touch1[1] = Y.invert(this.touch1[0])), this.that.__zoom = Y, this.emit("zoom"), this;
    },
    end: function() {
      return --this.active === 0 && (delete this.that.__zooming, this.emit("end")), this;
    },
    emit: function(z) {
      var Y = wt(this.that).datum();
      m.call(
        z,
        this.that,
        new ux(z, {
          sourceEvent: this.sourceEvent,
          target: E,
          transform: this.that.__zoom,
          dispatch: m
        }),
        Y
      );
    }
  };
  function G(z, ...Y) {
    if (!t.apply(this, arguments)) return;
    var F = j(this, Y).event(z), U = this.__zoom, T = Math.max(a[0], Math.min(a[1], U.k * Math.pow(2, l.apply(this, arguments)))), I = jt(z);
    if (F.wheel)
      (F.mouse[0][0] !== I[0] || F.mouse[0][1] !== I[1]) && (F.mouse[1] = U.invert(F.mouse[0] = I)), clearTimeout(F.wheel);
    else {
      if (U.k === T) return;
      F.mouse = [I, U.invert(I)], nl(this), F.start();
    }
    ni(z), F.wheel = setTimeout(V, S), F.zoom("mouse", i(_(A(U, T), F.mouse[0], F.mouse[1]), F.extent, f));
    function V() {
      F.wheel = null, F.end();
    }
  }
  function K(z, ...Y) {
    if (y || !t.apply(this, arguments)) return;
    var F = z.currentTarget, U = j(this, Y, !0).event(z), T = wt(z.view).on("mousemove.zoom", R, !0).on("mouseup.zoom", te, !0), I = jt(z, F), V = z.clientX, C = z.clientY;
    yp(z.view), Ca(z), U.mouse = [I, this.__zoom.invert(I)], nl(this), U.start();
    function R(ee) {
      if (ni(ee), !U.moved) {
        var le = ee.clientX - V, ue = ee.clientY - C;
        U.moved = le * le + ue * ue > N;
      }
      U.event(ee).zoom("mouse", i(_(U.that.__zoom, U.mouse[0] = jt(ee, F), U.mouse[1]), U.extent, f));
    }
    function te(ee) {
      T.on("mousemove.zoom mouseup.zoom", null), vp(ee.view, U.moved), ni(ee), U.event(ee).end();
    }
  }
  function ie(z, ...Y) {
    if (t.apply(this, arguments)) {
      var F = this.__zoom, U = jt(z.changedTouches ? z.changedTouches[0] : z, this), T = F.invert(U), I = F.k * (z.shiftKey ? 0.5 : 2), V = i(_(A(F, I), U, T), r.apply(this, Y), f);
      ni(z), h > 0 ? wt(this).transition().duration(h).call(O, V, U, z) : wt(this).call(E.transform, V, U, z);
    }
  }
  function X(z, ...Y) {
    if (t.apply(this, arguments)) {
      var F = z.touches, U = F.length, T = j(this, Y, z.changedTouches.length === U).event(z), I, V, C, R;
      for (Ca(z), V = 0; V < U; ++V)
        C = F[V], R = jt(C, this), R = [R, this.__zoom.invert(R), C.identifier], T.touch0 ? !T.touch1 && T.touch0[2] !== R[2] && (T.touch1 = R, T.taps = 0) : (T.touch0 = R, I = !0, T.taps = 1 + !!v);
      v && (v = clearTimeout(v)), I && (T.taps < 2 && (g = R[0], v = setTimeout(function() {
        v = null;
      }, x)), nl(this), T.start());
    }
  }
  function b(z, ...Y) {
    if (this.__zooming) {
      var F = j(this, Y).event(z), U = z.changedTouches, T = U.length, I, V, C, R;
      for (ni(z), I = 0; I < T; ++I)
        V = U[I], C = jt(V, this), F.touch0 && F.touch0[2] === V.identifier ? F.touch0[0] = C : F.touch1 && F.touch1[2] === V.identifier && (F.touch1[0] = C);
      if (V = F.that.__zoom, F.touch1) {
        var te = F.touch0[0], ee = F.touch0[1], le = F.touch1[0], ue = F.touch1[1], ae = (ae = le[0] - te[0]) * ae + (ae = le[1] - te[1]) * ae, J = (J = ue[0] - ee[0]) * J + (J = ue[1] - ee[1]) * J;
        V = A(V, Math.sqrt(ae / J)), C = [(te[0] + le[0]) / 2, (te[1] + le[1]) / 2], R = [(ee[0] + ue[0]) / 2, (ee[1] + ue[1]) / 2];
      } else if (F.touch0) C = F.touch0[0], R = F.touch0[1];
      else return;
      F.zoom("touch", i(_(V, C, R), F.extent, f));
    }
  }
  function Z(z, ...Y) {
    if (this.__zooming) {
      var F = j(this, Y).event(z), U = z.changedTouches, T = U.length, I, V;
      for (Ca(z), y && clearTimeout(y), y = setTimeout(function() {
        y = null;
      }, x), I = 0; I < T; ++I)
        V = U[I], F.touch0 && F.touch0[2] === V.identifier ? delete F.touch0 : F.touch1 && F.touch1[2] === V.identifier && delete F.touch1;
      if (F.touch1 && !F.touch0 && (F.touch0 = F.touch1, delete F.touch1), F.touch0) F.touch0[1] = this.__zoom.invert(F.touch0[0]);
      else if (F.end(), F.taps === 2 && (V = jt(V, this), Math.hypot(g[0] - V[0], g[1] - V[1]) < k)) {
        var C = wt(this).on("dblclick.zoom");
        C && C.apply(this, arguments);
      }
    }
  }
  return E.wheelDelta = function(z) {
    return arguments.length ? (l = typeof z == "function" ? z : bs(+z), E) : l;
  }, E.filter = function(z) {
    return arguments.length ? (t = typeof z == "function" ? z : bs(!!z), E) : t;
  }, E.touchable = function(z) {
    return arguments.length ? (u = typeof z == "function" ? z : bs(!!z), E) : u;
  }, E.extent = function(z) {
    return arguments.length ? (r = typeof z == "function" ? z : bs([[+z[0][0], +z[0][1]], [+z[1][0], +z[1][1]]]), E) : r;
  }, E.scaleExtent = function(z) {
    return arguments.length ? (a[0] = +z[0], a[1] = +z[1], E) : [a[0], a[1]];
  }, E.translateExtent = function(z) {
    return arguments.length ? (f[0][0] = +z[0][0], f[1][0] = +z[1][0], f[0][1] = +z[0][1], f[1][1] = +z[1][1], E) : [[f[0][0], f[0][1]], [f[1][0], f[1][1]]];
  }, E.constrain = function(z) {
    return arguments.length ? (i = z, E) : i;
  }, E.duration = function(z) {
    return arguments.length ? (h = +z, E) : h;
  }, E.interpolate = function(z) {
    return arguments.length ? (p = z, E) : p;
  }, E.on = function() {
    var z = m.on.apply(m, arguments);
    return z === m ? E : z;
  }, E.clickDistance = function(z) {
    return arguments.length ? (N = (z = +z) * z, E) : Math.sqrt(N);
  }, E.tapDistance = function(z) {
    return arguments.length ? (k = +z, E) : k;
  }, E;
}
const Kt = {
  error001: () => "[React Flow]: Seems like you have not used zustand provider as an ancestor. Help: https://reactflow.dev/error#001",
  error002: () => "It looks like you've created a new nodeTypes or edgeTypes object. If this wasn't on purpose please define the nodeTypes/edgeTypes outside of the component or memoize them.",
  error003: (t) => `Node type "${t}" not found. Using fallback type "default".`,
  error004: () => "The React Flow parent container needs a width and a height to render the graph.",
  error005: () => "Only child nodes can use a parent extent.",
  error006: () => "Can't create edge. An edge needs a source and a target.",
  error007: (t) => `The old edge with id=${t} does not exist.`,
  error009: (t) => `Marker type "${t}" doesn't exist.`,
  error008: (t, { id: r, sourceHandle: i, targetHandle: l }) => `Couldn't create edge for ${t} handle id: "${t === "source" ? i : l}", edge id: ${r}.`,
  error010: () => "Handle: No node id found. Make sure to only use a Handle inside a custom Node.",
  error011: (t) => `Edge type "${t}" not found. Using fallback type "default".`,
  error012: (t) => `Node with id "${t}" does not exist, it may have been removed. This can happen when a node is deleted before the "onNodeClick" handler is called.`,
  error013: (t = "react") => `It seems that you haven't loaded the styles. Please import '@xyflow/${t}/dist/style.css' or base.css to make sure everything is working properly.`,
  error014: () => "useNodeConnections: No node ID found. Call useNodeConnections inside a custom Node or provide a node ID.",
  error015: () => "It seems that you are trying to drag a node that is not initialized. Please use onNodesChange as explained in the docs."
}, fi = [
  [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY],
  [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY]
], Dp = ["Enter", " ", "Escape"], $p = {
  "node.a11yDescription.default": "Press enter or space to select a node. Press delete to remove it and escape to cancel.",
  "node.a11yDescription.keyboardDisabled": "Press enter or space to select a node. You can then use the arrow keys to move the node around. Press delete to remove it and escape to cancel.",
  "node.a11yDescription.ariaLiveMessage": ({ direction: t, x: r, y: i }) => `Moved selected node ${t}. New position, x: ${r}, y: ${i}`,
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
var ro;
(function(t) {
  t.Strict = "strict", t.Loose = "loose";
})(ro || (ro = {}));
var fr;
(function(t) {
  t.Free = "free", t.Vertical = "vertical", t.Horizontal = "horizontal";
})(fr || (fr = {}));
var di;
(function(t) {
  t.Partial = "partial", t.Full = "full";
})(di || (di = {}));
const jp = {
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
var Vn;
(function(t) {
  t.Bezier = "default", t.Straight = "straight", t.Step = "step", t.SmoothStep = "smoothstep", t.SimpleBezier = "simplebezier";
})(Vn || (Vn = {}));
var cl;
(function(t) {
  t.Arrow = "arrow", t.ArrowClosed = "arrowclosed";
})(cl || (cl = {}));
var me;
(function(t) {
  t.Left = "left", t.Top = "top", t.Right = "right", t.Bottom = "bottom";
})(me || (me = {}));
const dh = {
  [me.Left]: me.Right,
  [me.Right]: me.Left,
  [me.Top]: me.Bottom,
  [me.Bottom]: me.Top
};
function Fp(t) {
  return t === null ? null : t ? "valid" : "invalid";
}
const Op = (t) => "id" in t && "source" in t && "target" in t, px = (t) => "id" in t && "position" in t && !("source" in t) && !("target" in t), sc = (t) => "id" in t && "internals" in t && !("source" in t) && !("target" in t), wi = (t, r = [0, 0]) => {
  const { width: i, height: l } = mn(t), u = t.origin ?? r, a = i * u[0], f = l * u[1];
  return {
    x: t.position.x - a,
    y: t.position.y - f
  };
}, gx = (t, r = { nodeOrigin: [0, 0] }) => {
  if (t.length === 0)
    return { x: 0, y: 0, width: 0, height: 0 };
  const i = t.reduce((l, u) => {
    const a = typeof u == "string";
    let f = !r.nodeLookup && !a ? u : void 0;
    r.nodeLookup && (f = a ? r.nodeLookup.get(u) : sc(u) ? u : r.nodeLookup.get(u.id));
    const h = f ? fl(f, r.nodeOrigin) : { x: 0, y: 0, x2: 0, y2: 0 };
    return xl(l, h);
  }, { x: 1 / 0, y: 1 / 0, x2: -1 / 0, y2: -1 / 0 });
  return Sl(i);
}, xi = (t, r = {}) => {
  let i = { x: 1 / 0, y: 1 / 0, x2: -1 / 0, y2: -1 / 0 }, l = !1;
  return t.forEach((u) => {
    (r.filter === void 0 || r.filter(u)) && (i = xl(i, fl(u)), l = !0);
  }), l ? Sl(i) : { x: 0, y: 0, width: 0, height: 0 };
}, lc = (t, r, [i, l, u] = [0, 0, 1], a = !1, f = !1) => {
  const h = {
    ..._i(r, [i, l, u]),
    width: r.width / u,
    height: r.height / u
  }, p = [];
  for (const m of t.values()) {
    const { measured: v, selectable: g = !0, hidden: y = !1 } = m;
    if (f && !g || y)
      continue;
    const x = v.width ?? m.width ?? m.initialWidth ?? null, S = v.height ?? m.height ?? m.initialHeight ?? null, N = hi(h, io(m)), k = (x ?? 0) * (S ?? 0), E = a && N > 0;
    (!m.internals.handleBounds || E || N >= k || m.dragging) && p.push(m);
  }
  return p;
}, mx = (t, r) => {
  const i = /* @__PURE__ */ new Set();
  return t.forEach((l) => {
    i.add(l.id);
  }), r.filter((l) => i.has(l.source) || i.has(l.target));
};
function yx(t, r) {
  const i = /* @__PURE__ */ new Map(), l = r != null && r.nodes ? new Set(r.nodes.map((u) => u.id)) : null;
  return t.forEach((u) => {
    u.measured.width && u.measured.height && ((r == null ? void 0 : r.includeHiddenNodes) || !u.hidden) && (!l || l.has(u.id)) && i.set(u.id, u);
  }), i;
}
async function vx({ nodes: t, width: r, height: i, panZoom: l, minZoom: u, maxZoom: a }, f) {
  if (t.size === 0)
    return Promise.resolve(!0);
  const h = yx(t, f), p = xi(h), m = uc(p, r, i, (f == null ? void 0 : f.minZoom) ?? u, (f == null ? void 0 : f.maxZoom) ?? a, (f == null ? void 0 : f.padding) ?? 0.1);
  return await l.setViewport(m, {
    duration: f == null ? void 0 : f.duration,
    ease: f == null ? void 0 : f.ease,
    interpolate: f == null ? void 0 : f.interpolate
  }), Promise.resolve(!0);
}
function Hp({ nodeId: t, nextPosition: r, nodeLookup: i, nodeOrigin: l = [0, 0], nodeExtent: u, onError: a }) {
  const f = i.get(t), h = f.parentId ? i.get(f.parentId) : void 0, { x: p, y: m } = h ? h.internals.positionAbsolute : { x: 0, y: 0 }, v = f.origin ?? l;
  let g = f.extent || u;
  if (f.extent === "parent" && !f.expandParent)
    if (!h)
      a == null || a("005", Kt.error005());
    else {
      const x = h.measured.width, S = h.measured.height;
      x && S && (g = [
        [p, m],
        [p + x, m + S]
      ]);
    }
  else h && so(f.extent) && (g = [
    [f.extent[0][0] + p, f.extent[0][1] + m],
    [f.extent[1][0] + p, f.extent[1][1] + m]
  ]);
  const y = so(g) ? gr(r, g, f.measured) : r;
  return (f.measured.width === void 0 || f.measured.height === void 0) && (a == null || a("015", Kt.error015())), {
    position: {
      x: y.x - p + (f.measured.width ?? 0) * v[0],
      y: y.y - m + (f.measured.height ?? 0) * v[1]
    },
    positionAbsolute: y
  };
}
async function wx({ nodesToRemove: t = [], edgesToRemove: r = [], nodes: i, edges: l, onBeforeDelete: u }) {
  const a = new Set(t.map((y) => y.id)), f = [];
  for (const y of i) {
    if (y.deletable === !1)
      continue;
    const x = a.has(y.id), S = !x && y.parentId && f.find((N) => N.id === y.parentId);
    (x || S) && f.push(y);
  }
  const h = new Set(r.map((y) => y.id)), p = l.filter((y) => y.deletable !== !1), v = mx(f, p);
  for (const y of p)
    h.has(y.id) && !v.find((S) => S.id === y.id) && v.push(y);
  if (!u)
    return {
      edges: v,
      nodes: f
    };
  const g = await u({
    nodes: f,
    edges: v
  });
  return typeof g == "boolean" ? g ? { edges: v, nodes: f } : { edges: [], nodes: [] } : g;
}
const oo = (t, r = 0, i = 1) => Math.min(Math.max(t, r), i), gr = (t = { x: 0, y: 0 }, r, i) => ({
  x: oo(t.x, r[0][0], r[1][0] - ((i == null ? void 0 : i.width) ?? 0)),
  y: oo(t.y, r[0][1], r[1][1] - ((i == null ? void 0 : i.height) ?? 0))
});
function Vp(t, r, i) {
  const { width: l, height: u } = mn(i), { x: a, y: f } = i.internals.positionAbsolute;
  return gr(t, [
    [a, f],
    [a + l, f + u]
  ], r);
}
const hh = (t, r, i) => t < r ? oo(Math.abs(t - r), 1, r) / r : t > i ? -oo(Math.abs(t - i), 1, r) / r : 0, Bp = (t, r, i = 15, l = 40) => {
  const u = hh(t.x, l, r.width - l) * i, a = hh(t.y, l, r.height - l) * i;
  return [u, a];
}, xl = (t, r) => ({
  x: Math.min(t.x, r.x),
  y: Math.min(t.y, r.y),
  x2: Math.max(t.x2, r.x2),
  y2: Math.max(t.y2, r.y2)
}), Ya = ({ x: t, y: r, width: i, height: l }) => ({
  x: t,
  y: r,
  x2: t + i,
  y2: r + l
}), Sl = ({ x: t, y: r, x2: i, y2: l }) => ({
  x: t,
  y: r,
  width: i - t,
  height: l - r
}), io = (t, r = [0, 0]) => {
  var u, a;
  const { x: i, y: l } = sc(t) ? t.internals.positionAbsolute : wi(t, r);
  return {
    x: i,
    y: l,
    width: ((u = t.measured) == null ? void 0 : u.width) ?? t.width ?? t.initialWidth ?? 0,
    height: ((a = t.measured) == null ? void 0 : a.height) ?? t.height ?? t.initialHeight ?? 0
  };
}, fl = (t, r = [0, 0]) => {
  var u, a;
  const { x: i, y: l } = sc(t) ? t.internals.positionAbsolute : wi(t, r);
  return {
    x: i,
    y: l,
    x2: i + (((u = t.measured) == null ? void 0 : u.width) ?? t.width ?? t.initialWidth ?? 0),
    y2: l + (((a = t.measured) == null ? void 0 : a.height) ?? t.height ?? t.initialHeight ?? 0)
  };
}, Up = (t, r) => Sl(xl(Ya(t), Ya(r))), hi = (t, r) => {
  const i = Math.max(0, Math.min(t.x + t.width, r.x + r.width) - Math.max(t.x, r.x)), l = Math.max(0, Math.min(t.y + t.height, r.y + r.height) - Math.max(t.y, r.y));
  return Math.ceil(i * l);
}, ph = (t) => Ot(t.width) && Ot(t.height) && Ot(t.x) && Ot(t.y), Ot = (t) => !isNaN(t) && isFinite(t), xx = (t, r) => {
}, Si = (t, r = [1, 1]) => ({
  x: r[0] * Math.round(t.x / r[0]),
  y: r[1] * Math.round(t.y / r[1])
}), _i = ({ x: t, y: r }, [i, l, u], a = !1, f = [1, 1]) => {
  const h = {
    x: (t - i) / u,
    y: (r - l) / u
  };
  return a ? Si(h, f) : h;
}, dl = ({ x: t, y: r }, [i, l, u]) => ({
  x: t * u + i,
  y: r * u + l
});
function Qr(t, r) {
  if (typeof t == "number")
    return Math.floor((r - r / (1 + t)) * 0.5);
  if (typeof t == "string" && t.endsWith("px")) {
    const i = parseFloat(t);
    if (!Number.isNaN(i))
      return Math.floor(i);
  }
  if (typeof t == "string" && t.endsWith("%")) {
    const i = parseFloat(t);
    if (!Number.isNaN(i))
      return Math.floor(r * i * 0.01);
  }
  return console.error(`[React Flow] The padding value "${t}" is invalid. Please provide a number or a string with a valid unit (px or %).`), 0;
}
function Sx(t, r, i) {
  if (typeof t == "string" || typeof t == "number") {
    const l = Qr(t, i), u = Qr(t, r);
    return {
      top: l,
      right: u,
      bottom: l,
      left: u,
      x: u * 2,
      y: l * 2
    };
  }
  if (typeof t == "object") {
    const l = Qr(t.top ?? t.y ?? 0, i), u = Qr(t.bottom ?? t.y ?? 0, i), a = Qr(t.left ?? t.x ?? 0, r), f = Qr(t.right ?? t.x ?? 0, r);
    return { top: l, right: f, bottom: u, left: a, x: a + f, y: l + u };
  }
  return { top: 0, right: 0, bottom: 0, left: 0, x: 0, y: 0 };
}
function _x(t, r, i, l, u, a) {
  const { x: f, y: h } = dl(t, [r, i, l]), { x: p, y: m } = dl({ x: t.x + t.width, y: t.y + t.height }, [r, i, l]), v = u - p, g = a - m;
  return {
    left: Math.floor(f),
    top: Math.floor(h),
    right: Math.floor(v),
    bottom: Math.floor(g)
  };
}
const uc = (t, r, i, l, u, a) => {
  const f = Sx(a, r, i), h = (r - f.x) / t.width, p = (i - f.y) / t.height, m = Math.min(h, p), v = oo(m, l, u), g = t.x + t.width / 2, y = t.y + t.height / 2, x = r / 2 - g * v, S = i / 2 - y * v, N = _x(t, x, S, v, r, i), k = {
    left: Math.min(N.left - f.left, 0),
    top: Math.min(N.top - f.top, 0),
    right: Math.min(N.right - f.right, 0),
    bottom: Math.min(N.bottom - f.bottom, 0)
  };
  return {
    x: x - k.left + k.right,
    y: S - k.top + k.bottom,
    zoom: v
  };
}, pi = () => {
  var t;
  return typeof navigator < "u" && ((t = navigator == null ? void 0 : navigator.userAgent) == null ? void 0 : t.indexOf("Mac")) >= 0;
};
function so(t) {
  return t != null && t !== "parent";
}
function mn(t) {
  var r, i;
  return {
    width: ((r = t.measured) == null ? void 0 : r.width) ?? t.width ?? t.initialWidth ?? 0,
    height: ((i = t.measured) == null ? void 0 : i.height) ?? t.height ?? t.initialHeight ?? 0
  };
}
function Wp(t) {
  var r, i;
  return (((r = t.measured) == null ? void 0 : r.width) ?? t.width ?? t.initialWidth) !== void 0 && (((i = t.measured) == null ? void 0 : i.height) ?? t.height ?? t.initialHeight) !== void 0;
}
function Yp(t, r = { width: 0, height: 0 }, i, l, u) {
  const a = { ...t }, f = l.get(i);
  if (f) {
    const h = f.origin || u;
    a.x += f.internals.positionAbsolute.x - (r.width ?? 0) * h[0], a.y += f.internals.positionAbsolute.y - (r.height ?? 0) * h[1];
  }
  return a;
}
function gh(t, r) {
  if (t.size !== r.size)
    return !1;
  for (const i of t)
    if (!r.has(i))
      return !1;
  return !0;
}
function Ex() {
  let t, r;
  return { promise: new Promise((l, u) => {
    t = l, r = u;
  }), resolve: t, reject: r };
}
function kx(t) {
  return { ...$p, ...t || {} };
}
function si(t, { snapGrid: r = [0, 0], snapToGrid: i = !1, transform: l, containerBounds: u }) {
  const { x: a, y: f } = Ht(t), h = _i({ x: a - ((u == null ? void 0 : u.left) ?? 0), y: f - ((u == null ? void 0 : u.top) ?? 0) }, l), { x: p, y: m } = i ? Si(h, r) : h;
  return {
    xSnapped: p,
    ySnapped: m,
    ...h
  };
}
const ac = (t) => ({
  width: t.offsetWidth,
  height: t.offsetHeight
}), Xp = (t) => {
  var r;
  return ((r = t == null ? void 0 : t.getRootNode) == null ? void 0 : r.call(t)) || (window == null ? void 0 : window.document);
}, Nx = ["INPUT", "SELECT", "TEXTAREA"];
function bp(t) {
  var l, u;
  const r = ((u = (l = t.composedPath) == null ? void 0 : l.call(t)) == null ? void 0 : u[0]) || t.target;
  return (r == null ? void 0 : r.nodeType) !== 1 ? !1 : Nx.includes(r.nodeName) || r.hasAttribute("contenteditable") || !!r.closest(".nokey");
}
const Qp = (t) => "clientX" in t, Ht = (t, r) => {
  var a, f;
  const i = Qp(t), l = i ? t.clientX : (a = t.touches) == null ? void 0 : a[0].clientX, u = i ? t.clientY : (f = t.touches) == null ? void 0 : f[0].clientY;
  return {
    x: l - ((r == null ? void 0 : r.left) ?? 0),
    y: u - ((r == null ? void 0 : r.top) ?? 0)
  };
}, mh = (t, r, i, l, u) => {
  const a = r.querySelectorAll(`.${t}`);
  return !a || !a.length ? null : Array.from(a).map((f) => {
    const h = f.getBoundingClientRect();
    return {
      id: f.getAttribute("data-handleid"),
      type: t,
      nodeId: u,
      position: f.getAttribute("data-handlepos"),
      x: (h.left - i.left) / l,
      y: (h.top - i.top) / l,
      ...ac(f)
    };
  });
};
function Gp({ sourceX: t, sourceY: r, targetX: i, targetY: l, sourceControlX: u, sourceControlY: a, targetControlX: f, targetControlY: h }) {
  const p = t * 0.125 + u * 0.375 + f * 0.375 + i * 0.125, m = r * 0.125 + a * 0.375 + h * 0.375 + l * 0.125, v = Math.abs(p - t), g = Math.abs(m - r);
  return [p, m, v, g];
}
function Qs(t, r) {
  return t >= 0 ? 0.5 * t : r * 25 * Math.sqrt(-t);
}
function yh({ pos: t, x1: r, y1: i, x2: l, y2: u, c: a }) {
  switch (t) {
    case me.Left:
      return [r - Qs(r - l, a), i];
    case me.Right:
      return [r + Qs(l - r, a), i];
    case me.Top:
      return [r, i - Qs(i - u, a)];
    case me.Bottom:
      return [r, i + Qs(u - i, a)];
  }
}
function _l({ sourceX: t, sourceY: r, sourcePosition: i = me.Bottom, targetX: l, targetY: u, targetPosition: a = me.Top, curvature: f = 0.25 }) {
  const [h, p] = yh({
    pos: i,
    x1: t,
    y1: r,
    x2: l,
    y2: u,
    c: f
  }), [m, v] = yh({
    pos: a,
    x1: l,
    y1: u,
    x2: t,
    y2: r,
    c: f
  }), [g, y, x, S] = Gp({
    sourceX: t,
    sourceY: r,
    targetX: l,
    targetY: u,
    sourceControlX: h,
    sourceControlY: p,
    targetControlX: m,
    targetControlY: v
  });
  return [
    `M${t},${r} C${h},${p} ${m},${v} ${l},${u}`,
    g,
    y,
    x,
    S
  ];
}
function Kp({ sourceX: t, sourceY: r, targetX: i, targetY: l }) {
  const u = Math.abs(i - t) / 2, a = i < t ? i + u : i - u, f = Math.abs(l - r) / 2, h = l < r ? l + f : l - f;
  return [a, h, u, f];
}
function Cx({ sourceNode: t, targetNode: r, selected: i = !1, zIndex: l = 0, elevateOnSelect: u = !1, zIndexMode: a = "basic" }) {
  if (a === "manual")
    return l;
  const f = u && i ? l + 1e3 : l, h = Math.max(t.parentId || u && t.selected ? t.internals.z : 0, r.parentId || u && r.selected ? r.internals.z : 0);
  return f + h;
}
function Mx({ sourceNode: t, targetNode: r, width: i, height: l, transform: u }) {
  const a = xl(fl(t), fl(r));
  a.x === a.x2 && (a.x2 += 1), a.y === a.y2 && (a.y2 += 1);
  const f = {
    x: -u[0] / u[2],
    y: -u[1] / u[2],
    width: i / u[2],
    height: l / u[2]
  };
  return hi(f, Sl(a)) > 0;
}
const Px = ({ source: t, sourceHandle: r, target: i, targetHandle: l }) => `xy-edge__${t}${r || ""}-${i}${l || ""}`, Tx = (t, r) => r.some((i) => i.source === t.source && i.target === t.target && (i.sourceHandle === t.sourceHandle || !i.sourceHandle && !t.sourceHandle) && (i.targetHandle === t.targetHandle || !i.targetHandle && !t.targetHandle)), zx = (t, r, i = {}) => {
  if (!t.source || !t.target)
    return r;
  const l = i.getEdgeId || Px;
  let u;
  return Op(t) ? u = { ...t } : u = {
    ...t,
    id: l(t)
  }, Tx(u, r) ? r : (u.sourceHandle === null && delete u.sourceHandle, u.targetHandle === null && delete u.targetHandle, r.concat(u));
};
function qp({ sourceX: t, sourceY: r, targetX: i, targetY: l }) {
  const [u, a, f, h] = Kp({
    sourceX: t,
    sourceY: r,
    targetX: i,
    targetY: l
  });
  return [`M ${t},${r}L ${i},${l}`, u, a, f, h];
}
const vh = {
  [me.Left]: { x: -1, y: 0 },
  [me.Right]: { x: 1, y: 0 },
  [me.Top]: { x: 0, y: -1 },
  [me.Bottom]: { x: 0, y: 1 }
}, Ix = ({ source: t, sourcePosition: r = me.Bottom, target: i }) => r === me.Left || r === me.Right ? t.x < i.x ? { x: 1, y: 0 } : { x: -1, y: 0 } : t.y < i.y ? { x: 0, y: 1 } : { x: 0, y: -1 }, wh = (t, r) => Math.sqrt(Math.pow(r.x - t.x, 2) + Math.pow(r.y - t.y, 2));
function Lx({ source: t, sourcePosition: r = me.Bottom, target: i, targetPosition: l = me.Top, center: u, offset: a, stepPosition: f }) {
  const h = vh[r], p = vh[l], m = { x: t.x + h.x * a, y: t.y + h.y * a }, v = { x: i.x + p.x * a, y: i.y + p.y * a }, g = Ix({
    source: m,
    sourcePosition: r,
    target: v
  }), y = g.x !== 0 ? "x" : "y", x = g[y];
  let S = [], N, k;
  const E = { x: 0, y: 0 }, A = { x: 0, y: 0 }, [, , _, M] = Kp({
    sourceX: t.x,
    sourceY: t.y,
    targetX: i.x,
    targetY: i.y
  });
  if (h[y] * p[y] === -1) {
    y === "x" ? (N = u.x ?? m.x + (v.x - m.x) * f, k = u.y ?? (m.y + v.y) / 2) : (N = u.x ?? (m.x + v.x) / 2, k = u.y ?? m.y + (v.y - m.y) * f);
    const j = [
      { x: N, y: m.y },
      { x: N, y: v.y }
    ], H = [
      { x: m.x, y: k },
      { x: v.x, y: k }
    ];
    h[y] === x ? S = y === "x" ? j : H : S = y === "x" ? H : j;
  } else {
    const j = [{ x: m.x, y: v.y }], H = [{ x: v.x, y: m.y }];
    if (y === "x" ? S = h.x === x ? H : j : S = h.y === x ? j : H, r === l) {
      const b = Math.abs(t[y] - i[y]);
      if (b <= a) {
        const Z = Math.min(a - 1, a - b);
        h[y] === x ? E[y] = (m[y] > t[y] ? -1 : 1) * Z : A[y] = (v[y] > i[y] ? -1 : 1) * Z;
      }
    }
    if (r !== l) {
      const b = y === "x" ? "y" : "x", Z = h[y] === p[b], z = m[b] > v[b], Y = m[b] < v[b];
      (h[y] === 1 && (!Z && z || Z && Y) || h[y] !== 1 && (!Z && Y || Z && z)) && (S = y === "x" ? j : H);
    }
    const G = { x: m.x + E.x, y: m.y + E.y }, K = { x: v.x + A.x, y: v.y + A.y }, ie = Math.max(Math.abs(G.x - S[0].x), Math.abs(K.x - S[0].x)), X = Math.max(Math.abs(G.y - S[0].y), Math.abs(K.y - S[0].y));
    ie >= X ? (N = (G.x + K.x) / 2, k = S[0].y) : (N = S[0].x, k = (G.y + K.y) / 2);
  }
  return [[
    t,
    { x: m.x + E.x, y: m.y + E.y },
    ...S,
    { x: v.x + A.x, y: v.y + A.y },
    i
  ], N, k, _, M];
}
function Ax(t, r, i, l) {
  const u = Math.min(wh(t, r) / 2, wh(r, i) / 2, l), { x: a, y: f } = r;
  if (t.x === a && a === i.x || t.y === f && f === i.y)
    return `L${a} ${f}`;
  if (t.y === f) {
    const m = t.x < i.x ? -1 : 1, v = t.y < i.y ? 1 : -1;
    return `L ${a + u * m},${f}Q ${a},${f} ${a},${f + u * v}`;
  }
  const h = t.x < i.x ? 1 : -1, p = t.y < i.y ? -1 : 1;
  return `L ${a},${f + u * p}Q ${a},${f} ${a + u * h},${f}`;
}
function Xa({ sourceX: t, sourceY: r, sourcePosition: i = me.Bottom, targetX: l, targetY: u, targetPosition: a = me.Top, borderRadius: f = 5, centerX: h, centerY: p, offset: m = 20, stepPosition: v = 0.5 }) {
  const [g, y, x, S, N] = Lx({
    source: { x: t, y: r },
    sourcePosition: i,
    target: { x: l, y: u },
    targetPosition: a,
    center: { x: h, y: p },
    offset: m,
    stepPosition: v
  });
  return [g.reduce((E, A, _) => {
    let M = "";
    return _ > 0 && _ < g.length - 1 ? M = Ax(g[_ - 1], A, g[_ + 1], f) : M = `${_ === 0 ? "M" : "L"}${A.x} ${A.y}`, E += M, E;
  }, ""), y, x, S, N];
}
function xh(t) {
  var r;
  return t && !!(t.internals.handleBounds || (r = t.handles) != null && r.length) && !!(t.measured.width || t.width || t.initialWidth);
}
function Rx(t) {
  var g;
  const { sourceNode: r, targetNode: i } = t;
  if (!xh(r) || !xh(i))
    return null;
  const l = r.internals.handleBounds || Sh(r.handles), u = i.internals.handleBounds || Sh(i.handles), a = _h((l == null ? void 0 : l.source) ?? [], t.sourceHandle), f = _h(
    // when connection type is loose we can define all handles as sources and connect source -> source
    t.connectionMode === ro.Strict ? (u == null ? void 0 : u.target) ?? [] : ((u == null ? void 0 : u.target) ?? []).concat((u == null ? void 0 : u.source) ?? []),
    t.targetHandle
  );
  if (!a || !f)
    return (g = t.onError) == null || g.call(t, "008", Kt.error008(a ? "target" : "source", {
      id: t.id,
      sourceHandle: t.sourceHandle,
      targetHandle: t.targetHandle
    })), null;
  const h = (a == null ? void 0 : a.position) || me.Bottom, p = (f == null ? void 0 : f.position) || me.Top, m = mr(r, a, h), v = mr(i, f, p);
  return {
    sourceX: m.x,
    sourceY: m.y,
    targetX: v.x,
    targetY: v.y,
    sourcePosition: h,
    targetPosition: p
  };
}
function Sh(t) {
  if (!t)
    return null;
  const r = [], i = [];
  for (const l of t)
    l.width = l.width ?? 1, l.height = l.height ?? 1, l.type === "source" ? r.push(l) : l.type === "target" && i.push(l);
  return {
    source: r,
    target: i
  };
}
function mr(t, r, i = me.Left, l = !1) {
  const u = ((r == null ? void 0 : r.x) ?? 0) + t.internals.positionAbsolute.x, a = ((r == null ? void 0 : r.y) ?? 0) + t.internals.positionAbsolute.y, { width: f, height: h } = r ?? mn(t);
  if (l)
    return { x: u + f / 2, y: a + h / 2 };
  switch ((r == null ? void 0 : r.position) ?? i) {
    case me.Top:
      return { x: u + f / 2, y: a };
    case me.Right:
      return { x: u + f, y: a + h / 2 };
    case me.Bottom:
      return { x: u + f / 2, y: a + h };
    case me.Left:
      return { x: u, y: a + h / 2 };
  }
}
function _h(t, r) {
  return t && (r ? t.find((i) => i.id === r) : t[0]) || null;
}
function ba(t, r) {
  return t ? typeof t == "string" ? t : `${r ? `${r}__` : ""}${Object.keys(t).sort().map((l) => `${l}=${t[l]}`).join("&")}` : "";
}
function Dx(t, { id: r, defaultColor: i, defaultMarkerStart: l, defaultMarkerEnd: u }) {
  const a = /* @__PURE__ */ new Set();
  return t.reduce((f, h) => ([h.markerStart || l, h.markerEnd || u].forEach((p) => {
    if (p && typeof p == "object") {
      const m = ba(p, r);
      a.has(m) || (f.push({ id: m, color: p.color || i, ...p }), a.add(m));
    }
  }), f), []).sort((f, h) => f.id.localeCompare(h.id));
}
const Zp = 1e3, $x = 10, cc = {
  nodeOrigin: [0, 0],
  nodeExtent: fi,
  elevateNodesOnSelect: !0,
  zIndexMode: "basic",
  defaults: {}
}, jx = {
  ...cc,
  checkEquality: !0
};
function fc(t, r) {
  const i = { ...t };
  for (const l in r)
    r[l] !== void 0 && (i[l] = r[l]);
  return i;
}
function Fx(t, r, i) {
  const l = fc(cc, i);
  for (const u of t.values())
    if (u.parentId)
      hc(u, t, r, l);
    else {
      const a = wi(u, l.nodeOrigin), f = so(u.extent) ? u.extent : l.nodeExtent, h = gr(a, f, mn(u));
      u.internals.positionAbsolute = h;
    }
}
function Ox(t, r) {
  if (!t.handles)
    return t.measured ? r == null ? void 0 : r.internals.handleBounds : void 0;
  const i = [], l = [];
  for (const u of t.handles) {
    const a = {
      id: u.id,
      width: u.width ?? 1,
      height: u.height ?? 1,
      nodeId: t.id,
      x: u.x,
      y: u.y,
      position: u.position,
      type: u.type
    };
    u.type === "source" ? i.push(a) : u.type === "target" && l.push(a);
  }
  return {
    source: i,
    target: l
  };
}
function dc(t) {
  return t === "manual";
}
function Qa(t, r, i, l = {}) {
  var m, v;
  const u = fc(jx, l), a = { i: 0 }, f = new Map(r), h = u != null && u.elevateNodesOnSelect && !dc(u.zIndexMode) ? Zp : 0;
  let p = t.length > 0;
  r.clear(), i.clear();
  for (const g of t) {
    let y = f.get(g.id);
    if (u.checkEquality && g === (y == null ? void 0 : y.internals.userNode))
      r.set(g.id, y);
    else {
      const x = wi(g, u.nodeOrigin), S = so(g.extent) ? g.extent : u.nodeExtent, N = gr(x, S, mn(g));
      y = {
        ...u.defaults,
        ...g,
        measured: {
          width: (m = g.measured) == null ? void 0 : m.width,
          height: (v = g.measured) == null ? void 0 : v.height
        },
        internals: {
          positionAbsolute: N,
          // if user re-initializes the node or removes `measured` for whatever reason, we reset the handleBounds so that the node gets re-measured
          handleBounds: Ox(g, y),
          z: Jp(g, h, u.zIndexMode),
          userNode: g
        }
      }, r.set(g.id, y);
    }
    (y.measured === void 0 || y.measured.width === void 0 || y.measured.height === void 0) && !y.hidden && (p = !1), g.parentId && hc(y, r, i, l, a);
  }
  return p;
}
function Hx(t, r) {
  if (!t.parentId)
    return;
  const i = r.get(t.parentId);
  i ? i.set(t.id, t) : r.set(t.parentId, /* @__PURE__ */ new Map([[t.id, t]]));
}
function hc(t, r, i, l, u) {
  const { elevateNodesOnSelect: a, nodeOrigin: f, nodeExtent: h, zIndexMode: p } = fc(cc, l), m = t.parentId, v = r.get(m);
  if (!v) {
    console.warn(`Parent node ${m} not found. Please make sure that parent nodes are in front of their child nodes in the nodes array.`);
    return;
  }
  Hx(t, i), u && !v.parentId && v.internals.rootParentIndex === void 0 && p === "auto" && (v.internals.rootParentIndex = ++u.i, v.internals.z = v.internals.z + u.i * $x), u && v.internals.rootParentIndex !== void 0 && (u.i = v.internals.rootParentIndex);
  const g = a && !dc(p) ? Zp : 0, { x: y, y: x, z: S } = Vx(t, v, f, h, g, p), { positionAbsolute: N } = t.internals, k = y !== N.x || x !== N.y;
  (k || S !== t.internals.z) && r.set(t.id, {
    ...t,
    internals: {
      ...t.internals,
      positionAbsolute: k ? { x: y, y: x } : N,
      z: S
    }
  });
}
function Jp(t, r, i) {
  const l = Ot(t.zIndex) ? t.zIndex : 0;
  return dc(i) ? l : l + (t.selected ? r : 0);
}
function Vx(t, r, i, l, u, a) {
  const { x: f, y: h } = r.internals.positionAbsolute, p = mn(t), m = wi(t, i), v = so(t.extent) ? gr(m, t.extent, p) : m;
  let g = gr({ x: f + v.x, y: h + v.y }, l, p);
  t.extent === "parent" && (g = Vp(g, p, r));
  const y = Jp(t, u, a), x = r.internals.z ?? 0;
  return {
    x: g.x,
    y: g.y,
    z: x >= y ? x + 1 : y
  };
}
function pc(t, r, i, l = [0, 0]) {
  var f;
  const u = [], a = /* @__PURE__ */ new Map();
  for (const h of t) {
    const p = r.get(h.parentId);
    if (!p)
      continue;
    const m = ((f = a.get(h.parentId)) == null ? void 0 : f.expandedRect) ?? io(p), v = Up(m, h.rect);
    a.set(h.parentId, { expandedRect: v, parent: p });
  }
  return a.size > 0 && a.forEach(({ expandedRect: h, parent: p }, m) => {
    var _;
    const v = p.internals.positionAbsolute, g = mn(p), y = p.origin ?? l, x = h.x < v.x ? Math.round(Math.abs(v.x - h.x)) : 0, S = h.y < v.y ? Math.round(Math.abs(v.y - h.y)) : 0, N = Math.max(g.width, Math.round(h.width)), k = Math.max(g.height, Math.round(h.height)), E = (N - g.width) * y[0], A = (k - g.height) * y[1];
    (x > 0 || S > 0 || E || A) && (u.push({
      id: m,
      type: "position",
      position: {
        x: p.position.x - x + E,
        y: p.position.y - S + A
      }
    }), (_ = i.get(m)) == null || _.forEach((M) => {
      t.some((O) => O.id === M.id) || u.push({
        id: M.id,
        type: "position",
        position: {
          x: M.position.x + x,
          y: M.position.y + S
        }
      });
    })), (g.width < h.width || g.height < h.height || x || S) && u.push({
      id: m,
      type: "dimensions",
      setAttributes: !0,
      dimensions: {
        width: N + (x ? y[0] * x - E : 0),
        height: k + (S ? y[1] * S - A : 0)
      }
    });
  }), u;
}
function Bx(t, r, i, l, u, a, f) {
  const h = l == null ? void 0 : l.querySelector(".xyflow__viewport");
  let p = !1;
  if (!h)
    return { changes: [], updatedInternals: p };
  const m = [], v = window.getComputedStyle(h), { m22: g } = new window.DOMMatrixReadOnly(v.transform), y = [];
  for (const x of t.values()) {
    const S = r.get(x.id);
    if (!S)
      continue;
    if (S.hidden) {
      r.set(S.id, {
        ...S,
        internals: {
          ...S.internals,
          handleBounds: void 0
        }
      }), p = !0;
      continue;
    }
    const N = ac(x.nodeElement), k = S.measured.width !== N.width || S.measured.height !== N.height;
    if (!!(N.width && N.height && (k || !S.internals.handleBounds || x.force))) {
      const A = x.nodeElement.getBoundingClientRect(), _ = so(S.extent) ? S.extent : a;
      let { positionAbsolute: M } = S.internals;
      S.parentId && S.extent === "parent" ? M = Vp(M, N, r.get(S.parentId)) : _ && (M = gr(M, _, N));
      const O = {
        ...S,
        measured: N,
        internals: {
          ...S.internals,
          positionAbsolute: M,
          handleBounds: {
            source: mh("source", x.nodeElement, A, g, S.id),
            target: mh("target", x.nodeElement, A, g, S.id)
          }
        }
      };
      r.set(S.id, O), S.parentId && hc(O, r, i, { nodeOrigin: u, zIndexMode: f }), p = !0, k && (m.push({
        id: S.id,
        type: "dimensions",
        dimensions: N
      }), S.expandParent && S.parentId && y.push({
        id: S.id,
        parentId: S.parentId,
        rect: io(O, u)
      }));
    }
  }
  if (y.length > 0) {
    const x = pc(y, r, i, u);
    m.push(...x);
  }
  return { changes: m, updatedInternals: p };
}
async function Ux({ delta: t, panZoom: r, transform: i, translateExtent: l, width: u, height: a }) {
  if (!r || !t.x && !t.y)
    return Promise.resolve(!1);
  const f = await r.setViewportConstrained({
    x: i[0] + t.x,
    y: i[1] + t.y,
    zoom: i[2]
  }, [
    [0, 0],
    [u, a]
  ], l), h = !!f && (f.x !== i[0] || f.y !== i[1] || f.k !== i[2]);
  return Promise.resolve(h);
}
function Eh(t, r, i, l, u, a) {
  let f = u;
  const h = l.get(f) || /* @__PURE__ */ new Map();
  l.set(f, h.set(i, r)), f = `${u}-${t}`;
  const p = l.get(f) || /* @__PURE__ */ new Map();
  if (l.set(f, p.set(i, r)), a) {
    f = `${u}-${t}-${a}`;
    const m = l.get(f) || /* @__PURE__ */ new Map();
    l.set(f, m.set(i, r));
  }
}
function eg(t, r, i) {
  t.clear(), r.clear();
  for (const l of i) {
    const { source: u, target: a, sourceHandle: f = null, targetHandle: h = null } = l, p = { edgeId: l.id, source: u, target: a, sourceHandle: f, targetHandle: h }, m = `${u}-${f}--${a}-${h}`, v = `${a}-${h}--${u}-${f}`;
    Eh("source", p, v, t, u, f), Eh("target", p, m, t, a, h), r.set(l.id, l);
  }
}
function tg(t, r) {
  if (!t.parentId)
    return !1;
  const i = r.get(t.parentId);
  return i ? i.selected ? !0 : tg(i, r) : !1;
}
function kh(t, r, i) {
  var u;
  let l = t;
  do {
    if ((u = l == null ? void 0 : l.matches) != null && u.call(l, r))
      return !0;
    if (l === i)
      return !1;
    l = l == null ? void 0 : l.parentElement;
  } while (l);
  return !1;
}
function Wx(t, r, i, l) {
  const u = /* @__PURE__ */ new Map();
  for (const [a, f] of t)
    if ((f.selected || f.id === l) && (!f.parentId || !tg(f, t)) && (f.draggable || r && typeof f.draggable > "u")) {
      const h = t.get(a);
      h && u.set(a, {
        id: a,
        position: h.position || { x: 0, y: 0 },
        distance: {
          x: i.x - h.internals.positionAbsolute.x,
          y: i.y - h.internals.positionAbsolute.y
        },
        extent: h.extent,
        parentId: h.parentId,
        origin: h.origin,
        expandParent: h.expandParent,
        internals: {
          positionAbsolute: h.internals.positionAbsolute || { x: 0, y: 0 }
        },
        measured: {
          width: h.measured.width ?? 0,
          height: h.measured.height ?? 0
        }
      });
    }
  return u;
}
function Ma({ nodeId: t, dragItems: r, nodeLookup: i, dragging: l = !0 }) {
  var f, h, p;
  const u = [];
  for (const [m, v] of r) {
    const g = (f = i.get(m)) == null ? void 0 : f.internals.userNode;
    g && u.push({
      ...g,
      position: v.position,
      dragging: l
    });
  }
  if (!t)
    return [u[0], u];
  const a = (h = i.get(t)) == null ? void 0 : h.internals.userNode;
  return [
    a ? {
      ...a,
      position: ((p = r.get(t)) == null ? void 0 : p.position) || a.position,
      dragging: l
    } : u[0],
    u
  ];
}
function Yx({ dragItems: t, snapGrid: r, x: i, y: l }) {
  const u = t.values().next().value;
  if (!u)
    return null;
  const a = {
    x: i - u.distance.x,
    y: l - u.distance.y
  }, f = Si(a, r);
  return {
    x: f.x - a.x,
    y: f.y - a.y
  };
}
function Xx({ onNodeMouseDown: t, getStoreItems: r, onDragStart: i, onDrag: l, onDragStop: u }) {
  let a = { x: null, y: null }, f = 0, h = /* @__PURE__ */ new Map(), p = !1, m = { x: 0, y: 0 }, v = null, g = !1, y = null, x = !1, S = !1, N = null;
  function k({ noDragClassName: A, handleSelector: _, domNode: M, isSelectable: O, nodeId: j, nodeClickDistance: H = 0 }) {
    y = wt(M);
    function G({ x: b, y: Z }) {
      const { nodeLookup: z, nodeExtent: Y, snapGrid: F, snapToGrid: U, nodeOrigin: T, onNodeDrag: I, onSelectionDrag: V, onError: C, updateNodePositions: R } = r();
      a = { x: b, y: Z };
      let te = !1;
      const ee = h.size > 1, le = ee && Y ? Ya(xi(h)) : null, ue = ee && U ? Yx({
        dragItems: h,
        snapGrid: F,
        x: b,
        y: Z
      }) : null;
      for (const [ae, J] of h) {
        if (!z.has(ae))
          continue;
        let ce = { x: b - J.distance.x, y: Z - J.distance.y };
        U && (ce = ue ? {
          x: Math.round(ce.x + ue.x),
          y: Math.round(ce.y + ue.y)
        } : Si(ce, F));
        let xe = null;
        if (ee && Y && !J.extent && le) {
          const { positionAbsolute: ye } = J.internals, Ne = ye.x - le.x + Y[0][0], Ie = ye.x + J.measured.width - le.x2 + Y[1][0], Ce = ye.y - le.y + Y[0][1], Ue = ye.y + J.measured.height - le.y2 + Y[1][1];
          xe = [
            [Ne, Ce],
            [Ie, Ue]
          ];
        }
        const { position: _e, positionAbsolute: Se } = Hp({
          nodeId: ae,
          nextPosition: ce,
          nodeLookup: z,
          nodeExtent: xe || Y,
          nodeOrigin: T,
          onError: C
        });
        te = te || J.position.x !== _e.x || J.position.y !== _e.y, J.position = _e, J.internals.positionAbsolute = Se;
      }
      if (S = S || te, !!te && (R(h, !0), N && (l || I || !j && V))) {
        const [ae, J] = Ma({
          nodeId: j,
          dragItems: h,
          nodeLookup: z
        });
        l == null || l(N, h, ae, J), I == null || I(N, ae, J), j || V == null || V(N, J);
      }
    }
    async function K() {
      if (!v)
        return;
      const { transform: b, panBy: Z, autoPanSpeed: z, autoPanOnNodeDrag: Y } = r();
      if (!Y) {
        p = !1, cancelAnimationFrame(f);
        return;
      }
      const [F, U] = Bp(m, v, z);
      (F !== 0 || U !== 0) && (a.x = (a.x ?? 0) - F / b[2], a.y = (a.y ?? 0) - U / b[2], await Z({ x: F, y: U }) && G(a)), f = requestAnimationFrame(K);
    }
    function ie(b) {
      var ee;
      const { nodeLookup: Z, multiSelectionActive: z, nodesDraggable: Y, transform: F, snapGrid: U, snapToGrid: T, selectNodesOnDrag: I, onNodeDragStart: V, onSelectionDragStart: C, unselectNodesAndEdges: R } = r();
      g = !0, (!I || !O) && !z && j && ((ee = Z.get(j)) != null && ee.selected || R()), O && I && j && (t == null || t(j));
      const te = si(b.sourceEvent, { transform: F, snapGrid: U, snapToGrid: T, containerBounds: v });
      if (a = te, h = Wx(Z, Y, te, j), h.size > 0 && (i || V || !j && C)) {
        const [le, ue] = Ma({
          nodeId: j,
          dragItems: h,
          nodeLookup: Z
        });
        i == null || i(b.sourceEvent, h, le, ue), V == null || V(b.sourceEvent, le, ue), j || C == null || C(b.sourceEvent, ue);
      }
    }
    const X = wp().clickDistance(H).on("start", (b) => {
      const { domNode: Z, nodeDragThreshold: z, transform: Y, snapGrid: F, snapToGrid: U } = r();
      v = (Z == null ? void 0 : Z.getBoundingClientRect()) || null, x = !1, S = !1, N = b.sourceEvent, z === 0 && ie(b), a = si(b.sourceEvent, { transform: Y, snapGrid: F, snapToGrid: U, containerBounds: v }), m = Ht(b.sourceEvent, v);
    }).on("drag", (b) => {
      const { autoPanOnNodeDrag: Z, transform: z, snapGrid: Y, snapToGrid: F, nodeDragThreshold: U, nodeLookup: T } = r(), I = si(b.sourceEvent, { transform: z, snapGrid: Y, snapToGrid: F, containerBounds: v });
      if (N = b.sourceEvent, (b.sourceEvent.type === "touchmove" && b.sourceEvent.touches.length > 1 || // if user deletes a node while dragging, we need to abort the drag to prevent errors
      j && !T.has(j)) && (x = !0), !x) {
        if (!p && Z && g && (p = !0, K()), !g) {
          const V = Ht(b.sourceEvent, v), C = V.x - m.x, R = V.y - m.y;
          Math.sqrt(C * C + R * R) > U && ie(b);
        }
        (a.x !== I.xSnapped || a.y !== I.ySnapped) && h && g && (m = Ht(b.sourceEvent, v), G(I));
      }
    }).on("end", (b) => {
      if (!(!g || x) && (p = !1, g = !1, cancelAnimationFrame(f), h.size > 0)) {
        const { nodeLookup: Z, updateNodePositions: z, onNodeDragStop: Y, onSelectionDragStop: F } = r();
        if (S && (z(h, !1), S = !1), u || Y || !j && F) {
          const [U, T] = Ma({
            nodeId: j,
            dragItems: h,
            nodeLookup: Z,
            dragging: !1
          });
          u == null || u(b.sourceEvent, h, U, T), Y == null || Y(b.sourceEvent, U, T), j || F == null || F(b.sourceEvent, T);
        }
      }
    }).filter((b) => {
      const Z = b.target;
      return !b.button && (!A || !kh(Z, `.${A}`, M)) && (!_ || kh(Z, _, M));
    });
    y.call(X);
  }
  function E() {
    y == null || y.on(".drag", null);
  }
  return {
    update: k,
    destroy: E
  };
}
function bx(t, r, i) {
  const l = [], u = {
    x: t.x - i,
    y: t.y - i,
    width: i * 2,
    height: i * 2
  };
  for (const a of r.values())
    hi(u, io(a)) > 0 && l.push(a);
  return l;
}
const Qx = 250;
function Gx(t, r, i, l) {
  var h, p;
  let u = [], a = 1 / 0;
  const f = bx(t, i, r + Qx);
  for (const m of f) {
    const v = [...((h = m.internals.handleBounds) == null ? void 0 : h.source) ?? [], ...((p = m.internals.handleBounds) == null ? void 0 : p.target) ?? []];
    for (const g of v) {
      if (l.nodeId === g.nodeId && l.type === g.type && l.id === g.id)
        continue;
      const { x: y, y: x } = mr(m, g, g.position, !0), S = Math.sqrt(Math.pow(y - t.x, 2) + Math.pow(x - t.y, 2));
      S > r || (S < a ? (u = [{ ...g, x: y, y: x }], a = S) : S === a && u.push({ ...g, x: y, y: x }));
    }
  }
  if (!u.length)
    return null;
  if (u.length > 1) {
    const m = l.type === "source" ? "target" : "source";
    return u.find((v) => v.type === m) ?? u[0];
  }
  return u[0];
}
function ng(t, r, i, l, u, a = !1) {
  var m, v, g;
  const f = l.get(t);
  if (!f)
    return null;
  const h = u === "strict" ? (m = f.internals.handleBounds) == null ? void 0 : m[r] : [...((v = f.internals.handleBounds) == null ? void 0 : v.source) ?? [], ...((g = f.internals.handleBounds) == null ? void 0 : g.target) ?? []], p = (i ? h == null ? void 0 : h.find((y) => y.id === i) : h == null ? void 0 : h[0]) ?? null;
  return p && a ? { ...p, ...mr(f, p, p.position, !0) } : p;
}
function rg(t, r) {
  return t || (r != null && r.classList.contains("target") ? "target" : r != null && r.classList.contains("source") ? "source" : null);
}
function Kx(t, r) {
  let i = null;
  return r ? i = !0 : t && !r && (i = !1), i;
}
const og = () => !0;
function qx(t, { connectionMode: r, connectionRadius: i, handleId: l, nodeId: u, edgeUpdaterType: a, isTarget: f, domNode: h, nodeLookup: p, lib: m, autoPanOnConnect: v, flowId: g, panBy: y, cancelConnection: x, onConnectStart: S, onConnect: N, onConnectEnd: k, isValidConnection: E = og, onReconnectEnd: A, updateConnection: _, getTransform: M, getFromHandle: O, autoPanSpeed: j, dragThreshold: H = 1, handleDomNode: G }) {
  const K = Xp(t.target);
  let ie = 0, X;
  const { x: b, y: Z } = Ht(t), z = rg(a, G), Y = h == null ? void 0 : h.getBoundingClientRect();
  let F = !1;
  if (!Y || !z)
    return;
  const U = ng(u, z, l, p, r);
  if (!U)
    return;
  let T = Ht(t, Y), I = !1, V = null, C = !1, R = null;
  function te() {
    if (!v || !Y)
      return;
    const [_e, Se] = Bp(T, Y, j);
    y({ x: _e, y: Se }), ie = requestAnimationFrame(te);
  }
  const ee = {
    ...U,
    nodeId: u,
    type: z,
    position: U.position
  }, le = p.get(u);
  let ae = {
    inProgress: !0,
    isValid: null,
    from: mr(le, ee, me.Left, !0),
    fromHandle: ee,
    fromPosition: ee.position,
    fromNode: le,
    to: T,
    toHandle: null,
    toPosition: dh[ee.position],
    toNode: null,
    pointer: T
  };
  function J() {
    F = !0, _(ae), S == null || S(t, { nodeId: u, handleId: l, handleType: z });
  }
  H === 0 && J();
  function ce(_e) {
    if (!F) {
      const { x: Ue, y: zt } = Ht(_e), dt = Ue - b, ht = zt - Z;
      if (!(dt * dt + ht * ht > H * H))
        return;
      J();
    }
    if (!O() || !ee) {
      xe(_e);
      return;
    }
    const Se = M();
    T = Ht(_e, Y), X = Gx(_i(T, Se, !1, [1, 1]), i, p, ee), I || (te(), I = !0);
    const ye = ig(_e, {
      handle: X,
      connectionMode: r,
      fromNodeId: u,
      fromHandleId: l,
      fromType: f ? "target" : "source",
      isValidConnection: E,
      doc: K,
      lib: m,
      flowId: g,
      nodeLookup: p
    });
    R = ye.handleDomNode, V = ye.connection, C = Kx(!!X, ye.isValid);
    const Ne = p.get(u), Ie = Ne ? mr(Ne, ee, me.Left, !0) : ae.from, Ce = {
      ...ae,
      from: Ie,
      isValid: C,
      to: ye.toHandle && C ? dl({ x: ye.toHandle.x, y: ye.toHandle.y }, Se) : T,
      toHandle: ye.toHandle,
      toPosition: C && ye.toHandle ? ye.toHandle.position : dh[ee.position],
      toNode: ye.toHandle ? p.get(ye.toHandle.nodeId) : null,
      pointer: T
    };
    _(Ce), ae = Ce;
  }
  function xe(_e) {
    if (!("touches" in _e && _e.touches.length > 0)) {
      if (F) {
        (X || R) && V && C && (N == null || N(V));
        const { inProgress: Se, ...ye } = ae, Ne = {
          ...ye,
          toPosition: ae.toHandle ? ae.toPosition : null
        };
        k == null || k(_e, Ne), a && (A == null || A(_e, Ne));
      }
      x(), cancelAnimationFrame(ie), I = !1, C = !1, V = null, R = null, K.removeEventListener("mousemove", ce), K.removeEventListener("mouseup", xe), K.removeEventListener("touchmove", ce), K.removeEventListener("touchend", xe);
    }
  }
  K.addEventListener("mousemove", ce), K.addEventListener("mouseup", xe), K.addEventListener("touchmove", ce), K.addEventListener("touchend", xe);
}
function ig(t, { handle: r, connectionMode: i, fromNodeId: l, fromHandleId: u, fromType: a, doc: f, lib: h, flowId: p, isValidConnection: m = og, nodeLookup: v }) {
  const g = a === "target", y = r ? f.querySelector(`.${h}-flow__handle[data-id="${p}-${r == null ? void 0 : r.nodeId}-${r == null ? void 0 : r.id}-${r == null ? void 0 : r.type}"]`) : null, { x, y: S } = Ht(t), N = f.elementFromPoint(x, S), k = N != null && N.classList.contains(`${h}-flow__handle`) ? N : y, E = {
    handleDomNode: k,
    isValid: !1,
    connection: null,
    toHandle: null
  };
  if (k) {
    const A = rg(void 0, k), _ = k.getAttribute("data-nodeid"), M = k.getAttribute("data-handleid"), O = k.classList.contains("connectable"), j = k.classList.contains("connectableend");
    if (!_ || !A)
      return E;
    const H = {
      source: g ? _ : l,
      sourceHandle: g ? M : u,
      target: g ? l : _,
      targetHandle: g ? u : M
    };
    E.connection = H;
    const K = O && j && (i === ro.Strict ? g && A === "source" || !g && A === "target" : _ !== l || M !== u);
    E.isValid = K && m(H), E.toHandle = ng(_, A, M, v, i, !0);
  }
  return E;
}
const Ga = {
  onPointerDown: qx,
  isValid: ig
};
function Zx({ domNode: t, panZoom: r, getTransform: i, getViewScale: l }) {
  const u = wt(t);
  function a({ translateExtent: h, width: p, height: m, zoomStep: v = 1, pannable: g = !0, zoomable: y = !0, inversePan: x = !1 }) {
    const S = (_) => {
      if (_.sourceEvent.type !== "wheel" || !r)
        return;
      const M = i(), O = _.sourceEvent.ctrlKey && pi() ? 10 : 1, j = -_.sourceEvent.deltaY * (_.sourceEvent.deltaMode === 1 ? 0.05 : _.sourceEvent.deltaMode ? 1 : 2e-3) * v, H = M[2] * Math.pow(2, j * O);
      r.scaleTo(H);
    };
    let N = [0, 0];
    const k = (_) => {
      (_.sourceEvent.type === "mousedown" || _.sourceEvent.type === "touchstart") && (N = [
        _.sourceEvent.clientX ?? _.sourceEvent.touches[0].clientX,
        _.sourceEvent.clientY ?? _.sourceEvent.touches[0].clientY
      ]);
    }, E = (_) => {
      const M = i();
      if (_.sourceEvent.type !== "mousemove" && _.sourceEvent.type !== "touchmove" || !r)
        return;
      const O = [
        _.sourceEvent.clientX ?? _.sourceEvent.touches[0].clientX,
        _.sourceEvent.clientY ?? _.sourceEvent.touches[0].clientY
      ], j = [O[0] - N[0], O[1] - N[1]];
      N = O;
      const H = l() * Math.max(M[2], Math.log(M[2])) * (x ? -1 : 1), G = {
        x: M[0] - j[0] * H,
        y: M[1] - j[1] * H
      }, K = [
        [0, 0],
        [p, m]
      ];
      r.setViewportConstrained({
        x: G.x,
        y: G.y,
        zoom: M[2]
      }, K, h);
    }, A = Rp().on("start", k).on("zoom", g ? E : null).on("zoom.wheel", y ? S : null);
    u.call(A, {});
  }
  function f() {
    u.on("zoom", null);
  }
  return {
    update: a,
    destroy: f,
    pointer: jt
  };
}
const El = (t) => ({
  x: t.x,
  y: t.y,
  zoom: t.k
}), Pa = ({ x: t, y: r, zoom: i }) => wl.translate(t, r).scale(i), Kr = (t, r) => t.target.closest(`.${r}`), sg = (t, r) => r === 2 && Array.isArray(t) && t.includes(2), Jx = (t) => ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2, Ta = (t, r = 0, i = Jx, l = () => {
}) => {
  const u = typeof r == "number" && r > 0;
  return u || l(), u ? t.transition().duration(r).ease(i).on("end", l) : t;
}, lg = (t) => {
  const r = t.ctrlKey && pi() ? 10 : 1;
  return -t.deltaY * (t.deltaMode === 1 ? 0.05 : t.deltaMode ? 1 : 2e-3) * r;
};
function e1({ zoomPanValues: t, noWheelClassName: r, d3Selection: i, d3Zoom: l, panOnScrollMode: u, panOnScrollSpeed: a, zoomOnPinch: f, onPanZoomStart: h, onPanZoom: p, onPanZoomEnd: m }) {
  return (v) => {
    if (Kr(v, r))
      return v.ctrlKey && v.preventDefault(), !1;
    v.preventDefault(), v.stopImmediatePropagation();
    const g = i.property("__zoom").k || 1;
    if (v.ctrlKey && f) {
      const k = jt(v), E = lg(v), A = g * Math.pow(2, E);
      l.scaleTo(i, A, k, v);
      return;
    }
    const y = v.deltaMode === 1 ? 20 : 1;
    let x = u === fr.Vertical ? 0 : v.deltaX * y, S = u === fr.Horizontal ? 0 : v.deltaY * y;
    !pi() && v.shiftKey && u !== fr.Vertical && (x = v.deltaY * y, S = 0), l.translateBy(
      i,
      -(x / g) * a,
      -(S / g) * a,
      // @ts-ignore
      { internal: !0 }
    );
    const N = El(i.property("__zoom"));
    clearTimeout(t.panScrollTimeout), t.isPanScrolling ? (p == null || p(v, N), t.panScrollTimeout = setTimeout(() => {
      m == null || m(v, N), t.isPanScrolling = !1;
    }, 150)) : (t.isPanScrolling = !0, h == null || h(v, N));
  };
}
function t1({ noWheelClassName: t, preventScrolling: r, d3ZoomHandler: i }) {
  return function(l, u) {
    const a = l.type === "wheel", f = !r && a && !l.ctrlKey, h = Kr(l, t);
    if (l.ctrlKey && a && h && l.preventDefault(), f || h)
      return null;
    l.preventDefault(), i.call(this, l, u);
  };
}
function n1({ zoomPanValues: t, onDraggingChange: r, onPanZoomStart: i }) {
  return (l) => {
    var a, f, h;
    if ((a = l.sourceEvent) != null && a.internal)
      return;
    const u = El(l.transform);
    t.mouseButton = ((f = l.sourceEvent) == null ? void 0 : f.button) || 0, t.isZoomingOrPanning = !0, t.prevViewport = u, ((h = l.sourceEvent) == null ? void 0 : h.type) === "mousedown" && r(!0), i && (i == null || i(l.sourceEvent, u));
  };
}
function r1({ zoomPanValues: t, panOnDrag: r, onPaneContextMenu: i, onTransformChange: l, onPanZoom: u }) {
  return (a) => {
    var f, h;
    t.usedRightMouseButton = !!(i && sg(r, t.mouseButton ?? 0)), (f = a.sourceEvent) != null && f.sync || l([a.transform.x, a.transform.y, a.transform.k]), u && !((h = a.sourceEvent) != null && h.internal) && (u == null || u(a.sourceEvent, El(a.transform)));
  };
}
function o1({ zoomPanValues: t, panOnDrag: r, panOnScroll: i, onDraggingChange: l, onPanZoomEnd: u, onPaneContextMenu: a }) {
  return (f) => {
    var h;
    if (!((h = f.sourceEvent) != null && h.internal) && (t.isZoomingOrPanning = !1, a && sg(r, t.mouseButton ?? 0) && !t.usedRightMouseButton && f.sourceEvent && a(f.sourceEvent), t.usedRightMouseButton = !1, l(!1), u)) {
      const p = El(f.transform);
      t.prevViewport = p, clearTimeout(t.timerId), t.timerId = setTimeout(
        () => {
          u == null || u(f.sourceEvent, p);
        },
        // we need a setTimeout for panOnScroll to supress multiple end events fired during scroll
        i ? 150 : 0
      );
    }
  };
}
function i1({ zoomActivationKeyPressed: t, zoomOnScroll: r, zoomOnPinch: i, panOnDrag: l, panOnScroll: u, zoomOnDoubleClick: a, userSelectionActive: f, noWheelClassName: h, noPanClassName: p, lib: m, connectionInProgress: v }) {
  return (g) => {
    var k;
    const y = t || r, x = i && g.ctrlKey, S = g.type === "wheel";
    if (g.button === 1 && g.type === "mousedown" && (Kr(g, `${m}-flow__node`) || Kr(g, `${m}-flow__edge`)))
      return !0;
    if (!l && !y && !u && !a && !i || f || v && !S || Kr(g, h) && S || Kr(g, p) && (!S || u && S && !t) || !i && g.ctrlKey && S)
      return !1;
    if (!i && g.type === "touchstart" && ((k = g.touches) == null ? void 0 : k.length) > 1)
      return g.preventDefault(), !1;
    if (!y && !u && !x && S || !l && (g.type === "mousedown" || g.type === "touchstart") || Array.isArray(l) && !l.includes(g.button) && g.type === "mousedown")
      return !1;
    const N = Array.isArray(l) && l.includes(g.button) || !g.button || g.button <= 1;
    return (!g.ctrlKey || S) && N;
  };
}
function s1({ domNode: t, minZoom: r, maxZoom: i, translateExtent: l, viewport: u, onPanZoom: a, onPanZoomStart: f, onPanZoomEnd: h, onDraggingChange: p }) {
  const m = {
    isZoomingOrPanning: !1,
    usedRightMouseButton: !1,
    prevViewport: {},
    mouseButton: 0,
    timerId: void 0,
    panScrollTimeout: void 0,
    isPanScrolling: !1
  }, v = t.getBoundingClientRect(), g = Rp().scaleExtent([r, i]).translateExtent(l), y = wt(t).call(g);
  A({
    x: u.x,
    y: u.y,
    zoom: oo(u.zoom, r, i)
  }, [
    [0, 0],
    [v.width, v.height]
  ], l);
  const x = y.on("wheel.zoom"), S = y.on("dblclick.zoom");
  g.wheelDelta(lg);
  function N(X, b) {
    return y ? new Promise((Z) => {
      g == null || g.interpolate((b == null ? void 0 : b.interpolate) === "linear" ? ii : Js).transform(Ta(y, b == null ? void 0 : b.duration, b == null ? void 0 : b.ease, () => Z(!0)), X);
    }) : Promise.resolve(!1);
  }
  function k({ noWheelClassName: X, noPanClassName: b, onPaneContextMenu: Z, userSelectionActive: z, panOnScroll: Y, panOnDrag: F, panOnScrollMode: U, panOnScrollSpeed: T, preventScrolling: I, zoomOnPinch: V, zoomOnScroll: C, zoomOnDoubleClick: R, zoomActivationKeyPressed: te, lib: ee, onTransformChange: le, connectionInProgress: ue, paneClickDistance: ae, selectionOnDrag: J }) {
    z && !m.isZoomingOrPanning && E();
    const ce = Y && !te && !z;
    g.clickDistance(J ? 1 / 0 : !Ot(ae) || ae < 0 ? 0 : ae);
    const xe = ce ? e1({
      zoomPanValues: m,
      noWheelClassName: X,
      d3Selection: y,
      d3Zoom: g,
      panOnScrollMode: U,
      panOnScrollSpeed: T,
      zoomOnPinch: V,
      onPanZoomStart: f,
      onPanZoom: a,
      onPanZoomEnd: h
    }) : t1({
      noWheelClassName: X,
      preventScrolling: I,
      d3ZoomHandler: x
    });
    if (y.on("wheel.zoom", xe, { passive: !1 }), !z) {
      const Se = n1({
        zoomPanValues: m,
        onDraggingChange: p,
        onPanZoomStart: f
      });
      g.on("start", Se);
      const ye = r1({
        zoomPanValues: m,
        panOnDrag: F,
        onPaneContextMenu: !!Z,
        onPanZoom: a,
        onTransformChange: le
      });
      g.on("zoom", ye);
      const Ne = o1({
        zoomPanValues: m,
        panOnDrag: F,
        panOnScroll: Y,
        onPaneContextMenu: Z,
        onPanZoomEnd: h,
        onDraggingChange: p
      });
      g.on("end", Ne);
    }
    const _e = i1({
      zoomActivationKeyPressed: te,
      panOnDrag: F,
      zoomOnScroll: C,
      panOnScroll: Y,
      zoomOnDoubleClick: R,
      zoomOnPinch: V,
      userSelectionActive: z,
      noPanClassName: b,
      noWheelClassName: X,
      lib: ee,
      connectionInProgress: ue
    });
    g.filter(_e), R ? y.on("dblclick.zoom", S) : y.on("dblclick.zoom", null);
  }
  function E() {
    g.on("zoom", null);
  }
  async function A(X, b, Z) {
    const z = Pa(X), Y = g == null ? void 0 : g.constrain()(z, b, Z);
    return Y && await N(Y), new Promise((F) => F(Y));
  }
  async function _(X, b) {
    const Z = Pa(X);
    return await N(Z, b), new Promise((z) => z(Z));
  }
  function M(X) {
    if (y) {
      const b = Pa(X), Z = y.property("__zoom");
      (Z.k !== X.zoom || Z.x !== X.x || Z.y !== X.y) && (g == null || g.transform(y, b, null, { sync: !0 }));
    }
  }
  function O() {
    const X = y ? Ap(y.node()) : { x: 0, y: 0, k: 1 };
    return { x: X.x, y: X.y, zoom: X.k };
  }
  function j(X, b) {
    return y ? new Promise((Z) => {
      g == null || g.interpolate((b == null ? void 0 : b.interpolate) === "linear" ? ii : Js).scaleTo(Ta(y, b == null ? void 0 : b.duration, b == null ? void 0 : b.ease, () => Z(!0)), X);
    }) : Promise.resolve(!1);
  }
  function H(X, b) {
    return y ? new Promise((Z) => {
      g == null || g.interpolate((b == null ? void 0 : b.interpolate) === "linear" ? ii : Js).scaleBy(Ta(y, b == null ? void 0 : b.duration, b == null ? void 0 : b.ease, () => Z(!0)), X);
    }) : Promise.resolve(!1);
  }
  function G(X) {
    g == null || g.scaleExtent(X);
  }
  function K(X) {
    g == null || g.translateExtent(X);
  }
  function ie(X) {
    const b = !Ot(X) || X < 0 ? 0 : X;
    g == null || g.clickDistance(b);
  }
  return {
    update: k,
    destroy: E,
    setViewport: _,
    setViewportConstrained: A,
    getViewport: O,
    scaleTo: j,
    scaleBy: H,
    setScaleExtent: G,
    setTranslateExtent: K,
    syncViewport: M,
    setClickDistance: ie
  };
}
var lo;
(function(t) {
  t.Line = "line", t.Handle = "handle";
})(lo || (lo = {}));
function l1({ width: t, prevWidth: r, height: i, prevHeight: l, affectsX: u, affectsY: a }) {
  const f = t - r, h = i - l, p = [f > 0 ? 1 : f < 0 ? -1 : 0, h > 0 ? 1 : h < 0 ? -1 : 0];
  return f && u && (p[0] = p[0] * -1), h && a && (p[1] = p[1] * -1), p;
}
function Nh(t) {
  const r = t.includes("right") || t.includes("left"), i = t.includes("bottom") || t.includes("top"), l = t.includes("left"), u = t.includes("top");
  return {
    isHorizontal: r,
    isVertical: i,
    affectsX: l,
    affectsY: u
  };
}
function On(t, r) {
  return Math.max(0, r - t);
}
function Hn(t, r) {
  return Math.max(0, t - r);
}
function Gs(t, r, i) {
  return Math.max(0, r - t, t - i);
}
function Ch(t, r) {
  return t ? !r : r;
}
function u1(t, r, i, l, u, a, f, h) {
  let { affectsX: p, affectsY: m } = r;
  const { isHorizontal: v, isVertical: g } = r, y = v && g, { xSnapped: x, ySnapped: S } = i, { minWidth: N, maxWidth: k, minHeight: E, maxHeight: A } = l, { x: _, y: M, width: O, height: j, aspectRatio: H } = t;
  let G = Math.floor(v ? x - t.pointerX : 0), K = Math.floor(g ? S - t.pointerY : 0);
  const ie = O + (p ? -G : G), X = j + (m ? -K : K), b = -a[0] * O, Z = -a[1] * j;
  let z = Gs(ie, N, k), Y = Gs(X, E, A);
  if (f) {
    let T = 0, I = 0;
    p && G < 0 ? T = On(_ + G + b, f[0][0]) : !p && G > 0 && (T = Hn(_ + ie + b, f[1][0])), m && K < 0 ? I = On(M + K + Z, f[0][1]) : !m && K > 0 && (I = Hn(M + X + Z, f[1][1])), z = Math.max(z, T), Y = Math.max(Y, I);
  }
  if (h) {
    let T = 0, I = 0;
    p && G > 0 ? T = Hn(_ + G, h[0][0]) : !p && G < 0 && (T = On(_ + ie, h[1][0])), m && K > 0 ? I = Hn(M + K, h[0][1]) : !m && K < 0 && (I = On(M + X, h[1][1])), z = Math.max(z, T), Y = Math.max(Y, I);
  }
  if (u) {
    if (v) {
      const T = Gs(ie / H, E, A) * H;
      if (z = Math.max(z, T), f) {
        let I = 0;
        !p && !m || p && !m && y ? I = Hn(M + Z + ie / H, f[1][1]) * H : I = On(M + Z + (p ? G : -G) / H, f[0][1]) * H, z = Math.max(z, I);
      }
      if (h) {
        let I = 0;
        !p && !m || p && !m && y ? I = On(M + ie / H, h[1][1]) * H : I = Hn(M + (p ? G : -G) / H, h[0][1]) * H, z = Math.max(z, I);
      }
    }
    if (g) {
      const T = Gs(X * H, N, k) / H;
      if (Y = Math.max(Y, T), f) {
        let I = 0;
        !p && !m || m && !p && y ? I = Hn(_ + X * H + b, f[1][0]) / H : I = On(_ + (m ? K : -K) * H + b, f[0][0]) / H, Y = Math.max(Y, I);
      }
      if (h) {
        let I = 0;
        !p && !m || m && !p && y ? I = On(_ + X * H, h[1][0]) / H : I = Hn(_ + (m ? K : -K) * H, h[0][0]) / H, Y = Math.max(Y, I);
      }
    }
  }
  K = K + (K < 0 ? Y : -Y), G = G + (G < 0 ? z : -z), u && (y ? ie > X * H ? K = (Ch(p, m) ? -G : G) / H : G = (Ch(p, m) ? -K : K) * H : v ? (K = G / H, m = p) : (G = K * H, p = m));
  const F = p ? _ + G : _, U = m ? M + K : M;
  return {
    width: O + (p ? -G : G),
    height: j + (m ? -K : K),
    x: a[0] * G * (p ? -1 : 1) + F,
    y: a[1] * K * (m ? -1 : 1) + U
  };
}
const ug = { width: 0, height: 0, x: 0, y: 0 }, a1 = {
  ...ug,
  pointerX: 0,
  pointerY: 0,
  aspectRatio: 1
};
function c1(t) {
  return [
    [0, 0],
    [t.measured.width, t.measured.height]
  ];
}
function f1(t, r, i) {
  const l = r.position.x + t.position.x, u = r.position.y + t.position.y, a = t.measured.width ?? 0, f = t.measured.height ?? 0, h = i[0] * a, p = i[1] * f;
  return [
    [l - h, u - p],
    [l + a - h, u + f - p]
  ];
}
function d1({ domNode: t, nodeId: r, getStoreItems: i, onChange: l, onEnd: u }) {
  const a = wt(t);
  let f = {
    controlDirection: Nh("bottom-right"),
    boundaries: {
      minWidth: 0,
      minHeight: 0,
      maxWidth: Number.MAX_VALUE,
      maxHeight: Number.MAX_VALUE
    },
    resizeDirection: void 0,
    keepAspectRatio: !1
  };
  function h({ controlPosition: m, boundaries: v, keepAspectRatio: g, resizeDirection: y, onResizeStart: x, onResize: S, onResizeEnd: N, shouldResize: k }) {
    let E = { ...ug }, A = { ...a1 };
    f = {
      boundaries: v,
      resizeDirection: y,
      keepAspectRatio: g,
      controlDirection: Nh(m)
    };
    let _, M = null, O = [], j, H, G, K = !1;
    const ie = wp().on("start", (X) => {
      const { nodeLookup: b, transform: Z, snapGrid: z, snapToGrid: Y, nodeOrigin: F, paneDomNode: U } = i();
      if (_ = b.get(r), !_)
        return;
      M = (U == null ? void 0 : U.getBoundingClientRect()) ?? null;
      const { xSnapped: T, ySnapped: I } = si(X.sourceEvent, {
        transform: Z,
        snapGrid: z,
        snapToGrid: Y,
        containerBounds: M
      });
      E = {
        width: _.measured.width ?? 0,
        height: _.measured.height ?? 0,
        x: _.position.x ?? 0,
        y: _.position.y ?? 0
      }, A = {
        ...E,
        pointerX: T,
        pointerY: I,
        aspectRatio: E.width / E.height
      }, j = void 0, _.parentId && (_.extent === "parent" || _.expandParent) && (j = b.get(_.parentId), H = j && _.extent === "parent" ? c1(j) : void 0), O = [], G = void 0;
      for (const [V, C] of b)
        if (C.parentId === r && (O.push({
          id: V,
          position: { ...C.position },
          extent: C.extent
        }), C.extent === "parent" || C.expandParent)) {
          const R = f1(C, _, C.origin ?? F);
          G ? G = [
            [Math.min(R[0][0], G[0][0]), Math.min(R[0][1], G[0][1])],
            [Math.max(R[1][0], G[1][0]), Math.max(R[1][1], G[1][1])]
          ] : G = R;
        }
      x == null || x(X, { ...E });
    }).on("drag", (X) => {
      const { transform: b, snapGrid: Z, snapToGrid: z, nodeOrigin: Y } = i(), F = si(X.sourceEvent, {
        transform: b,
        snapGrid: Z,
        snapToGrid: z,
        containerBounds: M
      }), U = [];
      if (!_)
        return;
      const { x: T, y: I, width: V, height: C } = E, R = {}, te = _.origin ?? Y, { width: ee, height: le, x: ue, y: ae } = u1(A, f.controlDirection, F, f.boundaries, f.keepAspectRatio, te, H, G), J = ee !== V, ce = le !== C, xe = ue !== T && J, _e = ae !== I && ce;
      if (!xe && !_e && !J && !ce)
        return;
      if ((xe || _e || te[0] === 1 || te[1] === 1) && (R.x = xe ? ue : E.x, R.y = _e ? ae : E.y, E.x = R.x, E.y = R.y, O.length > 0)) {
        const Ie = ue - T, Ce = ae - I;
        for (const Ue of O)
          Ue.position = {
            x: Ue.position.x - Ie + te[0] * (ee - V),
            y: Ue.position.y - Ce + te[1] * (le - C)
          }, U.push(Ue);
      }
      if ((J || ce) && (R.width = J && (!f.resizeDirection || f.resizeDirection === "horizontal") ? ee : E.width, R.height = ce && (!f.resizeDirection || f.resizeDirection === "vertical") ? le : E.height, E.width = R.width, E.height = R.height), j && _.expandParent) {
        const Ie = te[0] * (R.width ?? 0);
        R.x && R.x < Ie && (E.x = Ie, A.x = A.x - (R.x - Ie));
        const Ce = te[1] * (R.height ?? 0);
        R.y && R.y < Ce && (E.y = Ce, A.y = A.y - (R.y - Ce));
      }
      const Se = l1({
        width: E.width,
        prevWidth: V,
        height: E.height,
        prevHeight: C,
        affectsX: f.controlDirection.affectsX,
        affectsY: f.controlDirection.affectsY
      }), ye = { ...E, direction: Se };
      (k == null ? void 0 : k(X, ye)) !== !1 && (K = !0, S == null || S(X, ye), l(R, U));
    }).on("end", (X) => {
      K && (N == null || N(X, { ...E }), u == null || u({ ...E }), K = !1);
    });
    a.call(ie);
  }
  function p() {
    a.on(".drag", null);
  }
  return {
    update: h,
    destroy: p
  };
}
var za = { exports: {} }, Ia = {}, La = { exports: {} }, Aa = {};
/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Mh;
function h1() {
  if (Mh) return Aa;
  Mh = 1;
  var t = mi();
  function r(g, y) {
    return g === y && (g !== 0 || 1 / g === 1 / y) || g !== g && y !== y;
  }
  var i = typeof Object.is == "function" ? Object.is : r, l = t.useState, u = t.useEffect, a = t.useLayoutEffect, f = t.useDebugValue;
  function h(g, y) {
    var x = y(), S = l({ inst: { value: x, getSnapshot: y } }), N = S[0].inst, k = S[1];
    return a(
      function() {
        N.value = x, N.getSnapshot = y, p(N) && k({ inst: N });
      },
      [g, x, y]
    ), u(
      function() {
        return p(N) && k({ inst: N }), g(function() {
          p(N) && k({ inst: N });
        });
      },
      [g]
    ), f(x), x;
  }
  function p(g) {
    var y = g.getSnapshot;
    g = g.value;
    try {
      var x = y();
      return !i(g, x);
    } catch {
      return !0;
    }
  }
  function m(g, y) {
    return y();
  }
  var v = typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u" ? m : h;
  return Aa.useSyncExternalStore = t.useSyncExternalStore !== void 0 ? t.useSyncExternalStore : v, Aa;
}
var Ph;
function p1() {
  return Ph || (Ph = 1, La.exports = h1()), La.exports;
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
var Th;
function g1() {
  if (Th) return Ia;
  Th = 1;
  var t = mi(), r = p1();
  function i(m, v) {
    return m === v && (m !== 0 || 1 / m === 1 / v) || m !== m && v !== v;
  }
  var l = typeof Object.is == "function" ? Object.is : i, u = r.useSyncExternalStore, a = t.useRef, f = t.useEffect, h = t.useMemo, p = t.useDebugValue;
  return Ia.useSyncExternalStoreWithSelector = function(m, v, g, y, x) {
    var S = a(null);
    if (S.current === null) {
      var N = { hasValue: !1, value: null };
      S.current = N;
    } else N = S.current;
    S = h(
      function() {
        function E(j) {
          if (!A) {
            if (A = !0, _ = j, j = y(j), x !== void 0 && N.hasValue) {
              var H = N.value;
              if (x(H, j))
                return M = H;
            }
            return M = j;
          }
          if (H = M, l(_, j)) return H;
          var G = y(j);
          return x !== void 0 && x(H, G) ? (_ = j, H) : (_ = j, M = G);
        }
        var A = !1, _, M, O = g === void 0 ? null : g;
        return [
          function() {
            return E(v());
          },
          O === null ? void 0 : function() {
            return E(O());
          }
        ];
      },
      [v, g, y, x]
    );
    var k = u(m, S[0], S[1]);
    return f(
      function() {
        N.hasValue = !0, N.value = k;
      },
      [k]
    ), p(k), k;
  }, Ia;
}
var zh;
function m1() {
  return zh || (zh = 1, za.exports = g1()), za.exports;
}
var y1 = m1();
const v1 = /* @__PURE__ */ Za(y1), w1 = {}, Ih = (t) => {
  let r;
  const i = /* @__PURE__ */ new Set(), l = (v, g) => {
    const y = typeof v == "function" ? v(r) : v;
    if (!Object.is(y, r)) {
      const x = r;
      r = g ?? (typeof y != "object" || y === null) ? y : Object.assign({}, r, y), i.forEach((S) => S(r, x));
    }
  }, u = () => r, p = { setState: l, getState: u, getInitialState: () => m, subscribe: (v) => (i.add(v), () => i.delete(v)), destroy: () => {
    (w1 ? "production" : void 0) !== "production" && console.warn(
      "[DEPRECATED] The `destroy` method will be unsupported in a future version. Instead use unsubscribe function returned by subscribe. Everything will be garbage-collected if store is garbage-collected."
    ), i.clear();
  } }, m = r = t(l, u, p);
  return p;
}, x1 = (t) => t ? Ih(t) : Ih, { useDebugValue: S1 } = Gr, { useSyncExternalStoreWithSelector: _1 } = v1, E1 = (t) => t;
function ag(t, r = E1, i) {
  const l = _1(
    t.subscribe,
    t.getState,
    t.getServerState || t.getInitialState,
    r,
    i
  );
  return S1(l), l;
}
const Lh = (t, r) => {
  const i = x1(t), l = (u, a = r) => ag(i, u, a);
  return Object.assign(l, i), l;
}, k1 = (t, r) => t ? Lh(t, r) : Lh;
function $e(t, r) {
  if (Object.is(t, r))
    return !0;
  if (typeof t != "object" || t === null || typeof r != "object" || r === null)
    return !1;
  if (t instanceof Map && r instanceof Map) {
    if (t.size !== r.size) return !1;
    for (const [l, u] of t)
      if (!Object.is(u, r.get(l)))
        return !1;
    return !0;
  }
  if (t instanceof Set && r instanceof Set) {
    if (t.size !== r.size) return !1;
    for (const l of t)
      if (!r.has(l))
        return !1;
    return !0;
  }
  const i = Object.keys(t);
  if (i.length !== Object.keys(r).length)
    return !1;
  for (const l of i)
    if (!Object.prototype.hasOwnProperty.call(r, l) || !Object.is(t[l], r[l]))
      return !1;
  return !0;
}
op();
const kl = q.createContext(null), N1 = kl.Provider, cg = Kt.error001();
function Me(t, r) {
  const i = q.useContext(kl);
  if (i === null)
    throw new Error(cg);
  return ag(i, t, r);
}
function je() {
  const t = q.useContext(kl);
  if (t === null)
    throw new Error(cg);
  return q.useMemo(() => ({
    getState: t.getState,
    setState: t.setState,
    subscribe: t.subscribe
  }), [t]);
}
const Ah = { display: "none" }, C1 = {
  position: "absolute",
  width: 1,
  height: 1,
  margin: -1,
  border: 0,
  padding: 0,
  overflow: "hidden",
  clip: "rect(0px, 0px, 0px, 0px)",
  clipPath: "inset(100%)"
}, fg = "react-flow__node-desc", dg = "react-flow__edge-desc", M1 = "react-flow__aria-live", P1 = (t) => t.ariaLiveMessage, T1 = (t) => t.ariaLabelConfig;
function z1({ rfId: t }) {
  const r = Me(P1);
  return D.jsx("div", { id: `${M1}-${t}`, "aria-live": "assertive", "aria-atomic": "true", style: C1, children: r });
}
function I1({ rfId: t, disableKeyboardA11y: r }) {
  const i = Me(T1);
  return D.jsxs(D.Fragment, { children: [D.jsx("div", { id: `${fg}-${t}`, style: Ah, children: r ? i["node.a11yDescription.default"] : i["node.a11yDescription.keyboardDisabled"] }), D.jsx("div", { id: `${dg}-${t}`, style: Ah, children: i["edge.a11yDescription.default"] }), !r && D.jsx(z1, { rfId: t })] });
}
const dr = q.forwardRef(({ position: t = "top-left", children: r, className: i, style: l, ...u }, a) => {
  const f = `${t}`.split("-");
  return D.jsx("div", { className: Ye(["react-flow__panel", i, ...f]), style: l, ref: a, ...u, children: r });
});
dr.displayName = "Panel";
function L1({ proOptions: t, position: r = "bottom-right" }) {
  return t != null && t.hideAttribution ? null : D.jsx(dr, { position: r, className: "react-flow__attribution", "data-message": "Please only hide this attribution when you are subscribed to React Flow Pro: https://pro.reactflow.dev", children: D.jsx("a", { href: "https://reactflow.dev", target: "_blank", rel: "noopener noreferrer", "aria-label": "React Flow attribution", children: "React Flow" }) });
}
const A1 = (t) => {
  const r = [], i = [];
  for (const [, l] of t.nodeLookup)
    l.selected && r.push(l.internals.userNode);
  for (const [, l] of t.edgeLookup)
    l.selected && i.push(l);
  return { selectedNodes: r, selectedEdges: i };
}, Ks = (t) => t.id;
function R1(t, r) {
  return $e(t.selectedNodes.map(Ks), r.selectedNodes.map(Ks)) && $e(t.selectedEdges.map(Ks), r.selectedEdges.map(Ks));
}
function D1({ onSelectionChange: t }) {
  const r = je(), { selectedNodes: i, selectedEdges: l } = Me(A1, R1);
  return q.useEffect(() => {
    const u = { nodes: i, edges: l };
    t == null || t(u), r.getState().onSelectionChangeHandlers.forEach((a) => a(u));
  }, [i, l, t]), null;
}
const $1 = (t) => !!t.onSelectionChangeHandlers;
function j1({ onSelectionChange: t }) {
  const r = Me($1);
  return t || r ? D.jsx(D1, { onSelectionChange: t }) : null;
}
const hg = [0, 0], F1 = { x: 0, y: 0, zoom: 1 }, O1 = [
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
], Rh = [...O1, "rfId"], H1 = (t) => ({
  setNodes: t.setNodes,
  setEdges: t.setEdges,
  setMinZoom: t.setMinZoom,
  setMaxZoom: t.setMaxZoom,
  setTranslateExtent: t.setTranslateExtent,
  setNodeExtent: t.setNodeExtent,
  reset: t.reset,
  setDefaultNodesAndEdges: t.setDefaultNodesAndEdges
}), Dh = {
  /*
   * these are values that are also passed directly to other components
   * than the StoreUpdater. We can reduce the number of setStore calls
   * by setting the same values here as prev fields.
   */
  translateExtent: fi,
  nodeOrigin: hg,
  minZoom: 0.5,
  maxZoom: 2,
  elementsSelectable: !0,
  noPanClassName: "nopan",
  rfId: "1"
};
function V1(t) {
  const { setNodes: r, setEdges: i, setMinZoom: l, setMaxZoom: u, setTranslateExtent: a, setNodeExtent: f, reset: h, setDefaultNodesAndEdges: p } = Me(H1, $e), m = je();
  q.useEffect(() => (p(t.defaultNodes, t.defaultEdges), () => {
    v.current = Dh, h();
  }), []);
  const v = q.useRef(Dh);
  return q.useEffect(
    () => {
      for (const g of Rh) {
        const y = t[g], x = v.current[g];
        y !== x && (typeof t[g] > "u" || (g === "nodes" ? r(y) : g === "edges" ? i(y) : g === "minZoom" ? l(y) : g === "maxZoom" ? u(y) : g === "translateExtent" ? a(y) : g === "nodeExtent" ? f(y) : g === "ariaLabelConfig" ? m.setState({ ariaLabelConfig: kx(y) }) : g === "fitView" ? m.setState({ fitViewQueued: y }) : g === "fitViewOptions" ? m.setState({ fitViewOptions: y }) : m.setState({ [g]: y })));
      }
      v.current = t;
    },
    // Only re-run the effect if one of the fields we track changes
    Rh.map((g) => t[g])
  ), null;
}
function $h() {
  return typeof window > "u" || !window.matchMedia ? null : window.matchMedia("(prefers-color-scheme: dark)");
}
function B1(t) {
  var l;
  const [r, i] = q.useState(t === "system" ? null : t);
  return q.useEffect(() => {
    if (t !== "system") {
      i(t);
      return;
    }
    const u = $h(), a = () => i(u != null && u.matches ? "dark" : "light");
    return a(), u == null || u.addEventListener("change", a), () => {
      u == null || u.removeEventListener("change", a);
    };
  }, [t]), r !== null ? r : (l = $h()) != null && l.matches ? "dark" : "light";
}
const jh = typeof document < "u" ? document : null;
function gi(t = null, r = { target: jh, actInsideInputWithModifier: !0 }) {
  const [i, l] = q.useState(!1), u = q.useRef(!1), a = q.useRef(/* @__PURE__ */ new Set([])), [f, h] = q.useMemo(() => {
    if (t !== null) {
      const m = (Array.isArray(t) ? t : [t]).filter((g) => typeof g == "string").map((g) => g.replace("+", `
`).replace(`

`, `
+`).split(`
`)), v = m.reduce((g, y) => g.concat(...y), []);
      return [m, v];
    }
    return [[], []];
  }, [t]);
  return q.useEffect(() => {
    const p = (r == null ? void 0 : r.target) ?? jh, m = (r == null ? void 0 : r.actInsideInputWithModifier) ?? !0;
    if (t !== null) {
      const v = (x) => {
        var k, E;
        if (u.current = x.ctrlKey || x.metaKey || x.shiftKey || x.altKey, (!u.current || u.current && !m) && bp(x))
          return !1;
        const N = Oh(x.code, h);
        if (a.current.add(x[N]), Fh(f, a.current, !1)) {
          const A = ((E = (k = x.composedPath) == null ? void 0 : k.call(x)) == null ? void 0 : E[0]) || x.target, _ = (A == null ? void 0 : A.nodeName) === "BUTTON" || (A == null ? void 0 : A.nodeName) === "A";
          r.preventDefault !== !1 && (u.current || !_) && x.preventDefault(), l(!0);
        }
      }, g = (x) => {
        const S = Oh(x.code, h);
        Fh(f, a.current, !0) ? (l(!1), a.current.clear()) : a.current.delete(x[S]), x.key === "Meta" && a.current.clear(), u.current = !1;
      }, y = () => {
        a.current.clear(), l(!1);
      };
      return p == null || p.addEventListener("keydown", v), p == null || p.addEventListener("keyup", g), window.addEventListener("blur", y), window.addEventListener("contextmenu", y), () => {
        p == null || p.removeEventListener("keydown", v), p == null || p.removeEventListener("keyup", g), window.removeEventListener("blur", y), window.removeEventListener("contextmenu", y);
      };
    }
  }, [t, l]), i;
}
function Fh(t, r, i) {
  return t.filter((l) => i || l.length === r.size).some((l) => l.every((u) => r.has(u)));
}
function Oh(t, r) {
  return r.includes(t) ? "code" : "key";
}
const U1 = () => {
  const t = je();
  return q.useMemo(() => ({
    zoomIn: (r) => {
      const { panZoom: i } = t.getState();
      return i ? i.scaleBy(1.2, { duration: r == null ? void 0 : r.duration }) : Promise.resolve(!1);
    },
    zoomOut: (r) => {
      const { panZoom: i } = t.getState();
      return i ? i.scaleBy(1 / 1.2, { duration: r == null ? void 0 : r.duration }) : Promise.resolve(!1);
    },
    zoomTo: (r, i) => {
      const { panZoom: l } = t.getState();
      return l ? l.scaleTo(r, { duration: i == null ? void 0 : i.duration }) : Promise.resolve(!1);
    },
    getZoom: () => t.getState().transform[2],
    setViewport: async (r, i) => {
      const { transform: [l, u, a], panZoom: f } = t.getState();
      return f ? (await f.setViewport({
        x: r.x ?? l,
        y: r.y ?? u,
        zoom: r.zoom ?? a
      }, i), Promise.resolve(!0)) : Promise.resolve(!1);
    },
    getViewport: () => {
      const [r, i, l] = t.getState().transform;
      return { x: r, y: i, zoom: l };
    },
    setCenter: async (r, i, l) => t.getState().setCenter(r, i, l),
    fitBounds: async (r, i) => {
      const { width: l, height: u, minZoom: a, maxZoom: f, panZoom: h } = t.getState(), p = uc(r, l, u, a, f, (i == null ? void 0 : i.padding) ?? 0.1);
      return h ? (await h.setViewport(p, {
        duration: i == null ? void 0 : i.duration,
        ease: i == null ? void 0 : i.ease,
        interpolate: i == null ? void 0 : i.interpolate
      }), Promise.resolve(!0)) : Promise.resolve(!1);
    },
    screenToFlowPosition: (r, i = {}) => {
      const { transform: l, snapGrid: u, snapToGrid: a, domNode: f } = t.getState();
      if (!f)
        return r;
      const { x: h, y: p } = f.getBoundingClientRect(), m = {
        x: r.x - h,
        y: r.y - p
      }, v = i.snapGrid ?? u, g = i.snapToGrid ?? a;
      return _i(m, l, g, v);
    },
    flowToScreenPosition: (r) => {
      const { transform: i, domNode: l } = t.getState();
      if (!l)
        return r;
      const { x: u, y: a } = l.getBoundingClientRect(), f = dl(r, i);
      return {
        x: f.x + u,
        y: f.y + a
      };
    }
  }), []);
};
function pg(t, r) {
  const i = [], l = /* @__PURE__ */ new Map(), u = [];
  for (const a of t)
    if (a.type === "add") {
      u.push(a);
      continue;
    } else if (a.type === "remove" || a.type === "replace")
      l.set(a.id, [a]);
    else {
      const f = l.get(a.id);
      f ? f.push(a) : l.set(a.id, [a]);
    }
  for (const a of r) {
    const f = l.get(a.id);
    if (!f) {
      i.push(a);
      continue;
    }
    if (f[0].type === "remove")
      continue;
    if (f[0].type === "replace") {
      i.push({ ...f[0].item });
      continue;
    }
    const h = { ...a };
    for (const p of f)
      W1(p, h);
    i.push(h);
  }
  return u.length && u.forEach((a) => {
    a.index !== void 0 ? i.splice(a.index, 0, { ...a.item }) : i.push({ ...a.item });
  }), i;
}
function W1(t, r) {
  switch (t.type) {
    case "select": {
      r.selected = t.selected;
      break;
    }
    case "position": {
      typeof t.position < "u" && (r.position = t.position), typeof t.dragging < "u" && (r.dragging = t.dragging);
      break;
    }
    case "dimensions": {
      typeof t.dimensions < "u" && (r.measured = {
        ...t.dimensions
      }, t.setAttributes && ((t.setAttributes === !0 || t.setAttributes === "width") && (r.width = t.dimensions.width), (t.setAttributes === !0 || t.setAttributes === "height") && (r.height = t.dimensions.height))), typeof t.resizing == "boolean" && (r.resizing = t.resizing);
      break;
    }
  }
}
function gg(t, r) {
  return pg(t, r);
}
function mg(t, r) {
  return pg(t, r);
}
function ur(t, r) {
  return {
    id: t,
    type: "select",
    selected: r
  };
}
function qr(t, r = /* @__PURE__ */ new Set(), i = !1) {
  const l = [];
  for (const [u, a] of t) {
    const f = r.has(u);
    !(a.selected === void 0 && !f) && a.selected !== f && (i && (a.selected = f), l.push(ur(a.id, f)));
  }
  return l;
}
function Hh({ items: t = [], lookup: r }) {
  var u;
  const i = [], l = new Map(t.map((a) => [a.id, a]));
  for (const [a, f] of t.entries()) {
    const h = r.get(f.id), p = ((u = h == null ? void 0 : h.internals) == null ? void 0 : u.userNode) ?? h;
    p !== void 0 && p !== f && i.push({ id: f.id, item: f, type: "replace" }), p === void 0 && i.push({ item: f, type: "add", index: a });
  }
  for (const [a] of r)
    l.get(a) === void 0 && i.push({ id: a, type: "remove" });
  return i;
}
function Vh(t) {
  return {
    id: t.id,
    type: "remove"
  };
}
const Bh = (t) => px(t), Y1 = (t) => Op(t);
function yg(t) {
  return q.forwardRef(t);
}
const X1 = typeof window < "u" ? q.useLayoutEffect : q.useEffect;
function Uh(t) {
  const [r, i] = q.useState(BigInt(0)), [l] = q.useState(() => b1(() => i((u) => u + BigInt(1))));
  return X1(() => {
    const u = l.get();
    u.length && (t(u), l.reset());
  }, [r]), l;
}
function b1(t) {
  let r = [];
  return {
    get: () => r,
    reset: () => {
      r = [];
    },
    push: (i) => {
      r.push(i), t();
    }
  };
}
const vg = q.createContext(null);
function Q1({ children: t }) {
  const r = je(), i = q.useCallback((h) => {
    const { nodes: p = [], setNodes: m, hasDefaultNodes: v, onNodesChange: g, nodeLookup: y, fitViewQueued: x, onNodesChangeMiddlewareMap: S } = r.getState();
    let N = p;
    for (const E of h)
      N = typeof E == "function" ? E(N) : E;
    let k = Hh({
      items: N,
      lookup: y
    });
    for (const E of S.values())
      k = E(k);
    v && m(N), k.length > 0 ? g == null || g(k) : x && window.requestAnimationFrame(() => {
      const { fitViewQueued: E, nodes: A, setNodes: _ } = r.getState();
      E && _(A);
    });
  }, []), l = Uh(i), u = q.useCallback((h) => {
    const { edges: p = [], setEdges: m, hasDefaultEdges: v, onEdgesChange: g, edgeLookup: y } = r.getState();
    let x = p;
    for (const S of h)
      x = typeof S == "function" ? S(x) : S;
    v ? m(x) : g && g(Hh({
      items: x,
      lookup: y
    }));
  }, []), a = Uh(u), f = q.useMemo(() => ({ nodeQueue: l, edgeQueue: a }), []);
  return D.jsx(vg.Provider, { value: f, children: t });
}
function G1() {
  const t = q.useContext(vg);
  if (!t)
    throw new Error("useBatchContext must be used within a BatchProvider");
  return t;
}
const K1 = (t) => !!t.panZoom;
function gc() {
  const t = U1(), r = je(), i = G1(), l = Me(K1), u = q.useMemo(() => {
    const a = (g) => r.getState().nodeLookup.get(g), f = (g) => {
      i.nodeQueue.push(g);
    }, h = (g) => {
      i.edgeQueue.push(g);
    }, p = (g) => {
      var E, A;
      const { nodeLookup: y, nodeOrigin: x } = r.getState(), S = Bh(g) ? g : y.get(g.id), N = S.parentId ? Yp(S.position, S.measured, S.parentId, y, x) : S.position, k = {
        ...S,
        position: N,
        width: ((E = S.measured) == null ? void 0 : E.width) ?? S.width,
        height: ((A = S.measured) == null ? void 0 : A.height) ?? S.height
      };
      return io(k);
    }, m = (g, y, x = { replace: !1 }) => {
      f((S) => S.map((N) => {
        if (N.id === g) {
          const k = typeof y == "function" ? y(N) : y;
          return x.replace && Bh(k) ? k : { ...N, ...k };
        }
        return N;
      }));
    }, v = (g, y, x = { replace: !1 }) => {
      h((S) => S.map((N) => {
        if (N.id === g) {
          const k = typeof y == "function" ? y(N) : y;
          return x.replace && Y1(k) ? k : { ...N, ...k };
        }
        return N;
      }));
    };
    return {
      getNodes: () => r.getState().nodes.map((g) => ({ ...g })),
      getNode: (g) => {
        var y;
        return (y = a(g)) == null ? void 0 : y.internals.userNode;
      },
      getInternalNode: a,
      getEdges: () => {
        const { edges: g = [] } = r.getState();
        return g.map((y) => ({ ...y }));
      },
      getEdge: (g) => r.getState().edgeLookup.get(g),
      setNodes: f,
      setEdges: h,
      addNodes: (g) => {
        const y = Array.isArray(g) ? g : [g];
        i.nodeQueue.push((x) => [...x, ...y]);
      },
      addEdges: (g) => {
        const y = Array.isArray(g) ? g : [g];
        i.edgeQueue.push((x) => [...x, ...y]);
      },
      toObject: () => {
        const { nodes: g = [], edges: y = [], transform: x } = r.getState(), [S, N, k] = x;
        return {
          nodes: g.map((E) => ({ ...E })),
          edges: y.map((E) => ({ ...E })),
          viewport: {
            x: S,
            y: N,
            zoom: k
          }
        };
      },
      deleteElements: async ({ nodes: g = [], edges: y = [] }) => {
        const { nodes: x, edges: S, onNodesDelete: N, onEdgesDelete: k, triggerNodeChanges: E, triggerEdgeChanges: A, onDelete: _, onBeforeDelete: M } = r.getState(), { nodes: O, edges: j } = await wx({
          nodesToRemove: g,
          edgesToRemove: y,
          nodes: x,
          edges: S,
          onBeforeDelete: M
        }), H = j.length > 0, G = O.length > 0;
        if (H) {
          const K = j.map(Vh);
          k == null || k(j), A(K);
        }
        if (G) {
          const K = O.map(Vh);
          N == null || N(O), E(K);
        }
        return (G || H) && (_ == null || _({ nodes: O, edges: j })), { deletedNodes: O, deletedEdges: j };
      },
      /**
       * Partial is defined as "the 2 nodes/areas are intersecting partially".
       * If a is contained in b or b is contained in a, they are both
       * considered fully intersecting.
       */
      getIntersectingNodes: (g, y = !0, x) => {
        const S = ph(g), N = S ? g : p(g), k = x !== void 0;
        return N ? (x || r.getState().nodes).filter((E) => {
          const A = r.getState().nodeLookup.get(E.id);
          if (A && !S && (E.id === g.id || !A.internals.positionAbsolute))
            return !1;
          const _ = io(k ? E : A), M = hi(_, N);
          return y && M > 0 || M >= _.width * _.height || M >= N.width * N.height;
        }) : [];
      },
      isNodeIntersecting: (g, y, x = !0) => {
        const N = ph(g) ? g : p(g);
        if (!N)
          return !1;
        const k = hi(N, y);
        return x && k > 0 || k >= y.width * y.height || k >= N.width * N.height;
      },
      updateNode: m,
      updateNodeData: (g, y, x = { replace: !1 }) => {
        m(g, (S) => {
          const N = typeof y == "function" ? y(S) : y;
          return x.replace ? { ...S, data: N } : { ...S, data: { ...S.data, ...N } };
        }, x);
      },
      updateEdge: v,
      updateEdgeData: (g, y, x = { replace: !1 }) => {
        v(g, (S) => {
          const N = typeof y == "function" ? y(S) : y;
          return x.replace ? { ...S, data: N } : { ...S, data: { ...S.data, ...N } };
        }, x);
      },
      getNodesBounds: (g) => {
        const { nodeLookup: y, nodeOrigin: x } = r.getState();
        return gx(g, { nodeLookup: y, nodeOrigin: x });
      },
      getHandleConnections: ({ type: g, id: y, nodeId: x }) => {
        var S;
        return Array.from(((S = r.getState().connectionLookup.get(`${x}-${g}${y ? `-${y}` : ""}`)) == null ? void 0 : S.values()) ?? []);
      },
      getNodeConnections: ({ type: g, handleId: y, nodeId: x }) => {
        var S;
        return Array.from(((S = r.getState().connectionLookup.get(`${x}${g ? y ? `-${g}-${y}` : `-${g}` : ""}`)) == null ? void 0 : S.values()) ?? []);
      },
      fitView: async (g) => {
        const y = r.getState().fitViewResolver ?? Ex();
        return r.setState({ fitViewQueued: !0, fitViewOptions: g, fitViewResolver: y }), i.nodeQueue.push((x) => [...x]), y.promise;
      }
    };
  }, []);
  return q.useMemo(() => ({
    ...u,
    ...t,
    viewportInitialized: l
  }), [l]);
}
const Wh = (t) => t.selected, q1 = typeof window < "u" ? window : void 0;
function Z1({ deleteKeyCode: t, multiSelectionKeyCode: r }) {
  const i = je(), { deleteElements: l } = gc(), u = gi(t, { actInsideInputWithModifier: !1 }), a = gi(r, { target: q1 });
  q.useEffect(() => {
    if (u) {
      const { edges: f, nodes: h } = i.getState();
      l({ nodes: h.filter(Wh), edges: f.filter(Wh) }), i.setState({ nodesSelectionActive: !1 });
    }
  }, [u]), q.useEffect(() => {
    i.setState({ multiSelectionActive: a });
  }, [a]);
}
function J1(t) {
  const r = je();
  q.useEffect(() => {
    const i = () => {
      var u, a, f, h;
      if (!t.current || !(((a = (u = t.current).checkVisibility) == null ? void 0 : a.call(u)) ?? !0))
        return !1;
      const l = ac(t.current);
      (l.height === 0 || l.width === 0) && ((h = (f = r.getState()).onError) == null || h.call(f, "004", Kt.error004())), r.setState({ width: l.width || 500, height: l.height || 500 });
    };
    if (t.current) {
      i(), window.addEventListener("resize", i);
      const l = new ResizeObserver(() => i());
      return l.observe(t.current), () => {
        window.removeEventListener("resize", i), l && t.current && l.unobserve(t.current);
      };
    }
  }, []);
}
const Nl = {
  position: "absolute",
  width: "100%",
  height: "100%",
  top: 0,
  left: 0
}, eS = (t) => ({
  userSelectionActive: t.userSelectionActive,
  lib: t.lib,
  connectionInProgress: t.connection.inProgress
});
function tS({ onPaneContextMenu: t, zoomOnScroll: r = !0, zoomOnPinch: i = !0, panOnScroll: l = !1, panOnScrollSpeed: u = 0.5, panOnScrollMode: a = fr.Free, zoomOnDoubleClick: f = !0, panOnDrag: h = !0, defaultViewport: p, translateExtent: m, minZoom: v, maxZoom: g, zoomActivationKeyCode: y, preventScrolling: x = !0, children: S, noWheelClassName: N, noPanClassName: k, onViewportChange: E, isControlledViewport: A, paneClickDistance: _, selectionOnDrag: M }) {
  const O = je(), j = q.useRef(null), { userSelectionActive: H, lib: G, connectionInProgress: K } = Me(eS, $e), ie = gi(y), X = q.useRef();
  J1(j);
  const b = q.useCallback((Z) => {
    E == null || E({ x: Z[0], y: Z[1], zoom: Z[2] }), A || O.setState({ transform: Z });
  }, [E, A]);
  return q.useEffect(() => {
    if (j.current) {
      X.current = s1({
        domNode: j.current,
        minZoom: v,
        maxZoom: g,
        translateExtent: m,
        viewport: p,
        onDraggingChange: (F) => O.setState({ paneDragging: F }),
        onPanZoomStart: (F, U) => {
          const { onViewportChangeStart: T, onMoveStart: I } = O.getState();
          I == null || I(F, U), T == null || T(U);
        },
        onPanZoom: (F, U) => {
          const { onViewportChange: T, onMove: I } = O.getState();
          I == null || I(F, U), T == null || T(U);
        },
        onPanZoomEnd: (F, U) => {
          const { onViewportChangeEnd: T, onMoveEnd: I } = O.getState();
          I == null || I(F, U), T == null || T(U);
        }
      });
      const { x: Z, y: z, zoom: Y } = X.current.getViewport();
      return O.setState({
        panZoom: X.current,
        transform: [Z, z, Y],
        domNode: j.current.closest(".react-flow")
      }), () => {
        var F;
        (F = X.current) == null || F.destroy();
      };
    }
  }, []), q.useEffect(() => {
    var Z;
    (Z = X.current) == null || Z.update({
      onPaneContextMenu: t,
      zoomOnScroll: r,
      zoomOnPinch: i,
      panOnScroll: l,
      panOnScrollSpeed: u,
      panOnScrollMode: a,
      zoomOnDoubleClick: f,
      panOnDrag: h,
      zoomActivationKeyPressed: ie,
      preventScrolling: x,
      noPanClassName: k,
      userSelectionActive: H,
      noWheelClassName: N,
      lib: G,
      onTransformChange: b,
      connectionInProgress: K,
      selectionOnDrag: M,
      paneClickDistance: _
    });
  }, [
    t,
    r,
    i,
    l,
    u,
    a,
    f,
    h,
    ie,
    x,
    k,
    H,
    N,
    G,
    b,
    K,
    M,
    _
  ]), D.jsx("div", { className: "react-flow__renderer", ref: j, style: Nl, children: S });
}
const nS = (t) => ({
  userSelectionActive: t.userSelectionActive,
  userSelectionRect: t.userSelectionRect
});
function rS() {
  const { userSelectionActive: t, userSelectionRect: r } = Me(nS, $e);
  return t && r ? D.jsx("div", { className: "react-flow__selection react-flow__container", style: {
    width: r.width,
    height: r.height,
    transform: `translate(${r.x}px, ${r.y}px)`
  } }) : null;
}
const Ra = (t, r) => (i) => {
  i.target === r.current && (t == null || t(i));
}, oS = (t) => ({
  userSelectionActive: t.userSelectionActive,
  elementsSelectable: t.elementsSelectable,
  connectionInProgress: t.connection.inProgress,
  dragging: t.paneDragging
});
function iS({ isSelecting: t, selectionKeyPressed: r, selectionMode: i = di.Full, panOnDrag: l, paneClickDistance: u, selectionOnDrag: a, onSelectionStart: f, onSelectionEnd: h, onPaneClick: p, onPaneContextMenu: m, onPaneScroll: v, onPaneMouseEnter: g, onPaneMouseMove: y, onPaneMouseLeave: x, children: S }) {
  const N = je(), { userSelectionActive: k, elementsSelectable: E, dragging: A, connectionInProgress: _ } = Me(oS, $e), M = E && (t || k), O = q.useRef(null), j = q.useRef(), H = q.useRef(/* @__PURE__ */ new Set()), G = q.useRef(/* @__PURE__ */ new Set()), K = q.useRef(!1), ie = (T) => {
    if (K.current || _) {
      K.current = !1;
      return;
    }
    p == null || p(T), N.getState().resetSelectedElements(), N.setState({ nodesSelectionActive: !1 });
  }, X = (T) => {
    if (Array.isArray(l) && (l != null && l.includes(2))) {
      T.preventDefault();
      return;
    }
    m == null || m(T);
  }, b = v ? (T) => v(T) : void 0, Z = (T) => {
    K.current && (T.stopPropagation(), K.current = !1);
  }, z = (T) => {
    var le, ue;
    const { domNode: I } = N.getState();
    if (j.current = I == null ? void 0 : I.getBoundingClientRect(), !j.current)
      return;
    const V = T.target === O.current;
    if (!V && !!T.target.closest(".nokey") || !t || !(a && V || r) || T.button !== 0 || !T.isPrimary)
      return;
    (ue = (le = T.target) == null ? void 0 : le.setPointerCapture) == null || ue.call(le, T.pointerId), K.current = !1;
    const { x: te, y: ee } = Ht(T.nativeEvent, j.current);
    N.setState({
      userSelectionRect: {
        width: 0,
        height: 0,
        startX: te,
        startY: ee,
        x: te,
        y: ee
      }
    }), V || (T.stopPropagation(), T.preventDefault());
  }, Y = (T) => {
    const { userSelectionRect: I, transform: V, nodeLookup: C, edgeLookup: R, connectionLookup: te, triggerNodeChanges: ee, triggerEdgeChanges: le, defaultEdgeOptions: ue, resetSelectedElements: ae } = N.getState();
    if (!j.current || !I)
      return;
    const { x: J, y: ce } = Ht(T.nativeEvent, j.current), { startX: xe, startY: _e } = I;
    if (!K.current) {
      const Ce = r ? 0 : u;
      if (Math.hypot(J - xe, ce - _e) <= Ce)
        return;
      ae(), f == null || f(T);
    }
    K.current = !0;
    const Se = {
      startX: xe,
      startY: _e,
      x: J < xe ? J : xe,
      y: ce < _e ? ce : _e,
      width: Math.abs(J - xe),
      height: Math.abs(ce - _e)
    }, ye = H.current, Ne = G.current;
    H.current = new Set(lc(C, Se, V, i === di.Partial, !0).map((Ce) => Ce.id)), G.current = /* @__PURE__ */ new Set();
    const Ie = (ue == null ? void 0 : ue.selectable) ?? !0;
    for (const Ce of H.current) {
      const Ue = te.get(Ce);
      if (Ue)
        for (const { edgeId: zt } of Ue.values()) {
          const dt = R.get(zt);
          dt && (dt.selectable ?? Ie) && G.current.add(zt);
        }
    }
    if (!gh(ye, H.current)) {
      const Ce = qr(C, H.current, !0);
      ee(Ce);
    }
    if (!gh(Ne, G.current)) {
      const Ce = qr(R, G.current);
      le(Ce);
    }
    N.setState({
      userSelectionRect: Se,
      userSelectionActive: !0,
      nodesSelectionActive: !1
    });
  }, F = (T) => {
    var I, V;
    T.button === 0 && ((V = (I = T.target) == null ? void 0 : I.releasePointerCapture) == null || V.call(I, T.pointerId), !k && T.target === O.current && N.getState().userSelectionRect && (ie == null || ie(T)), N.setState({
      userSelectionActive: !1,
      userSelectionRect: null
    }), K.current && (h == null || h(T), N.setState({
      nodesSelectionActive: H.current.size > 0
    })));
  }, U = l === !0 || Array.isArray(l) && l.includes(0);
  return D.jsxs("div", { className: Ye(["react-flow__pane", { draggable: U, dragging: A, selection: t }]), onClick: M ? void 0 : Ra(ie, O), onContextMenu: Ra(X, O), onWheel: Ra(b, O), onPointerEnter: M ? void 0 : g, onPointerMove: M ? Y : y, onPointerUp: M ? F : void 0, onPointerDownCapture: M ? z : void 0, onClickCapture: M ? Z : void 0, onPointerLeave: x, ref: O, style: Nl, children: [S, D.jsx(rS, {})] });
}
function Ka({ id: t, store: r, unselect: i = !1, nodeRef: l }) {
  const { addSelectedNodes: u, unselectNodesAndEdges: a, multiSelectionActive: f, nodeLookup: h, onError: p } = r.getState(), m = h.get(t);
  if (!m) {
    p == null || p("012", Kt.error012(t));
    return;
  }
  r.setState({ nodesSelectionActive: !1 }), m.selected ? (i || m.selected && f) && (a({ nodes: [m], edges: [] }), requestAnimationFrame(() => {
    var v;
    return (v = l == null ? void 0 : l.current) == null ? void 0 : v.blur();
  })) : u([t]);
}
function wg({ nodeRef: t, disabled: r = !1, noDragClassName: i, handleSelector: l, nodeId: u, isSelectable: a, nodeClickDistance: f }) {
  const h = je(), [p, m] = q.useState(!1), v = q.useRef();
  return q.useEffect(() => {
    v.current = Xx({
      getStoreItems: () => h.getState(),
      onNodeMouseDown: (g) => {
        Ka({
          id: g,
          store: h,
          nodeRef: t
        });
      },
      onDragStart: () => {
        m(!0);
      },
      onDragStop: () => {
        m(!1);
      }
    });
  }, []), q.useEffect(() => {
    var g, y;
    if (r)
      (g = v.current) == null || g.destroy();
    else if (t.current)
      return (y = v.current) == null || y.update({
        noDragClassName: i,
        handleSelector: l,
        domNode: t.current,
        isSelectable: a,
        nodeId: u,
        nodeClickDistance: f
      }), () => {
        var x;
        (x = v.current) == null || x.destroy();
      };
  }, [i, l, r, a, t, u]), p;
}
const sS = (t) => (r) => r.selected && (r.draggable || t && typeof r.draggable > "u");
function xg() {
  const t = je();
  return q.useCallback((i) => {
    const { nodeExtent: l, snapToGrid: u, snapGrid: a, nodesDraggable: f, onError: h, updateNodePositions: p, nodeLookup: m, nodeOrigin: v } = t.getState(), g = /* @__PURE__ */ new Map(), y = sS(f), x = u ? a[0] : 5, S = u ? a[1] : 5, N = i.direction.x * x * i.factor, k = i.direction.y * S * i.factor;
    for (const [, E] of m) {
      if (!y(E))
        continue;
      let A = {
        x: E.internals.positionAbsolute.x + N,
        y: E.internals.positionAbsolute.y + k
      };
      u && (A = Si(A, a));
      const { position: _, positionAbsolute: M } = Hp({
        nodeId: E.id,
        nextPosition: A,
        nodeLookup: m,
        nodeExtent: l,
        nodeOrigin: v,
        onError: h
      });
      E.position = _, E.internals.positionAbsolute = M, g.set(E.id, E);
    }
    p(g);
  }, []);
}
const mc = q.createContext(null), lS = mc.Provider;
mc.Consumer;
const Sg = () => q.useContext(mc), uS = (t) => ({
  connectOnClick: t.connectOnClick,
  noPanClassName: t.noPanClassName,
  rfId: t.rfId
}), aS = (t, r, i) => (l) => {
  const { connectionClickStartHandle: u, connectionMode: a, connection: f } = l, { fromHandle: h, toHandle: p, isValid: m } = f, v = (p == null ? void 0 : p.nodeId) === t && (p == null ? void 0 : p.id) === r && (p == null ? void 0 : p.type) === i;
  return {
    connectingFrom: (h == null ? void 0 : h.nodeId) === t && (h == null ? void 0 : h.id) === r && (h == null ? void 0 : h.type) === i,
    connectingTo: v,
    clickConnecting: (u == null ? void 0 : u.nodeId) === t && (u == null ? void 0 : u.id) === r && (u == null ? void 0 : u.type) === i,
    isPossibleEndHandle: a === ro.Strict ? (h == null ? void 0 : h.type) !== i : t !== (h == null ? void 0 : h.nodeId) || r !== (h == null ? void 0 : h.id),
    connectionInProcess: !!h,
    clickConnectionInProcess: !!u,
    valid: v && m
  };
};
function cS({ type: t = "source", position: r = me.Top, isValidConnection: i, isConnectable: l = !0, isConnectableStart: u = !0, isConnectableEnd: a = !0, id: f, onConnect: h, children: p, className: m, onMouseDown: v, onTouchStart: g, ...y }, x) {
  var Y, F;
  const S = f || null, N = t === "target", k = je(), E = Sg(), { connectOnClick: A, noPanClassName: _, rfId: M } = Me(uS, $e), { connectingFrom: O, connectingTo: j, clickConnecting: H, isPossibleEndHandle: G, connectionInProcess: K, clickConnectionInProcess: ie, valid: X } = Me(aS(E, S, t), $e);
  E || (F = (Y = k.getState()).onError) == null || F.call(Y, "010", Kt.error010());
  const b = (U) => {
    const { defaultEdgeOptions: T, onConnect: I, hasDefaultEdges: V } = k.getState(), C = {
      ...T,
      ...U
    };
    if (V) {
      const { edges: R, setEdges: te } = k.getState();
      te(zx(C, R));
    }
    I == null || I(C), h == null || h(C);
  }, Z = (U) => {
    if (!E)
      return;
    const T = Qp(U.nativeEvent);
    if (u && (T && U.button === 0 || !T)) {
      const I = k.getState();
      Ga.onPointerDown(U.nativeEvent, {
        handleDomNode: U.currentTarget,
        autoPanOnConnect: I.autoPanOnConnect,
        connectionMode: I.connectionMode,
        connectionRadius: I.connectionRadius,
        domNode: I.domNode,
        nodeLookup: I.nodeLookup,
        lib: I.lib,
        isTarget: N,
        handleId: S,
        nodeId: E,
        flowId: I.rfId,
        panBy: I.panBy,
        cancelConnection: I.cancelConnection,
        onConnectStart: I.onConnectStart,
        onConnectEnd: I.onConnectEnd,
        updateConnection: I.updateConnection,
        onConnect: b,
        isValidConnection: i || I.isValidConnection,
        getTransform: () => k.getState().transform,
        getFromHandle: () => k.getState().connection.fromHandle,
        autoPanSpeed: I.autoPanSpeed,
        dragThreshold: I.connectionDragThreshold
      });
    }
    T ? v == null || v(U) : g == null || g(U);
  }, z = (U) => {
    const { onClickConnectStart: T, onClickConnectEnd: I, connectionClickStartHandle: V, connectionMode: C, isValidConnection: R, lib: te, rfId: ee, nodeLookup: le, connection: ue } = k.getState();
    if (!E || !V && !u)
      return;
    if (!V) {
      T == null || T(U.nativeEvent, { nodeId: E, handleId: S, handleType: t }), k.setState({ connectionClickStartHandle: { nodeId: E, type: t, id: S } });
      return;
    }
    const ae = Xp(U.target), J = i || R, { connection: ce, isValid: xe } = Ga.isValid(U.nativeEvent, {
      handle: {
        nodeId: E,
        id: S,
        type: t
      },
      connectionMode: C,
      fromNodeId: V.nodeId,
      fromHandleId: V.id || null,
      fromType: V.type,
      isValidConnection: J,
      flowId: ee,
      doc: ae,
      lib: te,
      nodeLookup: le
    });
    xe && ce && b(ce);
    const _e = structuredClone(ue);
    delete _e.inProgress, _e.toPosition = _e.toHandle ? _e.toHandle.position : null, I == null || I(U, _e), k.setState({ connectionClickStartHandle: null });
  };
  return D.jsx("div", { "data-handleid": S, "data-nodeid": E, "data-handlepos": r, "data-id": `${M}-${E}-${S}-${t}`, className: Ye([
    "react-flow__handle",
    `react-flow__handle-${r}`,
    "nodrag",
    _,
    m,
    {
      source: !N,
      target: N,
      connectable: l,
      connectablestart: u,
      connectableend: a,
      clickconnecting: H,
      connectingfrom: O,
      connectingto: j,
      valid: X,
      /*
       * shows where you can start a connection from
       * and where you can end it while connecting
       */
      connectionindicator: l && (!K || G) && (K || ie ? a : u)
    }
  ]), onMouseDown: Z, onTouchStart: Z, onClick: A ? z : void 0, ref: x, ...y, children: p });
}
const hn = q.memo(yg(cS));
function fS({ data: t, isConnectable: r, sourcePosition: i = me.Bottom }) {
  return D.jsxs(D.Fragment, { children: [t == null ? void 0 : t.label, D.jsx(hn, { type: "source", position: i, isConnectable: r })] });
}
function dS({ data: t, isConnectable: r, targetPosition: i = me.Top, sourcePosition: l = me.Bottom }) {
  return D.jsxs(D.Fragment, { children: [D.jsx(hn, { type: "target", position: i, isConnectable: r }), t == null ? void 0 : t.label, D.jsx(hn, { type: "source", position: l, isConnectable: r })] });
}
function hS() {
  return null;
}
function pS({ data: t, isConnectable: r, targetPosition: i = me.Top }) {
  return D.jsxs(D.Fragment, { children: [D.jsx(hn, { type: "target", position: i, isConnectable: r }), t == null ? void 0 : t.label] });
}
const hl = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 }
}, Yh = {
  input: fS,
  default: dS,
  output: pS,
  group: hS
};
function gS(t) {
  var r, i, l, u;
  return t.internals.handleBounds === void 0 ? {
    width: t.width ?? t.initialWidth ?? ((r = t.style) == null ? void 0 : r.width),
    height: t.height ?? t.initialHeight ?? ((i = t.style) == null ? void 0 : i.height)
  } : {
    width: t.width ?? ((l = t.style) == null ? void 0 : l.width),
    height: t.height ?? ((u = t.style) == null ? void 0 : u.height)
  };
}
const mS = (t) => {
  const { width: r, height: i, x: l, y: u } = xi(t.nodeLookup, {
    filter: (a) => !!a.selected
  });
  return {
    width: Ot(r) ? r : null,
    height: Ot(i) ? i : null,
    userSelectionActive: t.userSelectionActive,
    transformString: `translate(${t.transform[0]}px,${t.transform[1]}px) scale(${t.transform[2]}) translate(${l}px,${u}px)`
  };
};
function yS({ onSelectionContextMenu: t, noPanClassName: r, disableKeyboardA11y: i }) {
  const l = je(), { width: u, height: a, transformString: f, userSelectionActive: h } = Me(mS, $e), p = xg(), m = q.useRef(null);
  if (q.useEffect(() => {
    var y;
    i || (y = m.current) == null || y.focus({
      preventScroll: !0
    });
  }, [i]), wg({
    nodeRef: m
  }), h || !u || !a)
    return null;
  const v = t ? (y) => {
    const x = l.getState().nodes.filter((S) => S.selected);
    t(y, x);
  } : void 0, g = (y) => {
    Object.prototype.hasOwnProperty.call(hl, y.key) && (y.preventDefault(), p({
      direction: hl[y.key],
      factor: y.shiftKey ? 4 : 1
    }));
  };
  return D.jsx("div", { className: Ye(["react-flow__nodesselection", "react-flow__container", r]), style: {
    transform: f
  }, children: D.jsx("div", { ref: m, className: "react-flow__nodesselection-rect", onContextMenu: v, tabIndex: i ? void 0 : -1, onKeyDown: i ? void 0 : g, style: {
    width: u,
    height: a
  } }) });
}
const Xh = typeof window < "u" ? window : void 0, vS = (t) => ({ nodesSelectionActive: t.nodesSelectionActive, userSelectionActive: t.userSelectionActive });
function _g({ children: t, onPaneClick: r, onPaneMouseEnter: i, onPaneMouseMove: l, onPaneMouseLeave: u, onPaneContextMenu: a, onPaneScroll: f, paneClickDistance: h, deleteKeyCode: p, selectionKeyCode: m, selectionOnDrag: v, selectionMode: g, onSelectionStart: y, onSelectionEnd: x, multiSelectionKeyCode: S, panActivationKeyCode: N, zoomActivationKeyCode: k, elementsSelectable: E, zoomOnScroll: A, zoomOnPinch: _, panOnScroll: M, panOnScrollSpeed: O, panOnScrollMode: j, zoomOnDoubleClick: H, panOnDrag: G, defaultViewport: K, translateExtent: ie, minZoom: X, maxZoom: b, preventScrolling: Z, onSelectionContextMenu: z, noWheelClassName: Y, noPanClassName: F, disableKeyboardA11y: U, onViewportChange: T, isControlledViewport: I }) {
  const { nodesSelectionActive: V, userSelectionActive: C } = Me(vS, $e), R = gi(m, { target: Xh }), te = gi(N, { target: Xh }), ee = te || G, le = te || M, ue = v && ee !== !0, ae = R || C || ue;
  return Z1({ deleteKeyCode: p, multiSelectionKeyCode: S }), D.jsx(tS, { onPaneContextMenu: a, elementsSelectable: E, zoomOnScroll: A, zoomOnPinch: _, panOnScroll: le, panOnScrollSpeed: O, panOnScrollMode: j, zoomOnDoubleClick: H, panOnDrag: !R && ee, defaultViewport: K, translateExtent: ie, minZoom: X, maxZoom: b, zoomActivationKeyCode: k, preventScrolling: Z, noWheelClassName: Y, noPanClassName: F, onViewportChange: T, isControlledViewport: I, paneClickDistance: h, selectionOnDrag: ue, children: D.jsxs(iS, { onSelectionStart: y, onSelectionEnd: x, onPaneClick: r, onPaneMouseEnter: i, onPaneMouseMove: l, onPaneMouseLeave: u, onPaneContextMenu: a, onPaneScroll: f, panOnDrag: ee, isSelecting: !!ae, selectionMode: g, selectionKeyPressed: R, paneClickDistance: h, selectionOnDrag: ue, children: [t, V && D.jsx(yS, { onSelectionContextMenu: z, noPanClassName: F, disableKeyboardA11y: U })] }) });
}
_g.displayName = "FlowRenderer";
const wS = q.memo(_g), xS = (t) => (r) => t ? lc(r.nodeLookup, { x: 0, y: 0, width: r.width, height: r.height }, r.transform, !0).map((i) => i.id) : Array.from(r.nodeLookup.keys());
function SS(t) {
  return Me(q.useCallback(xS(t), [t]), $e);
}
const _S = (t) => t.updateNodeInternals;
function ES() {
  const t = Me(_S), [r] = q.useState(() => typeof ResizeObserver > "u" ? null : new ResizeObserver((i) => {
    const l = /* @__PURE__ */ new Map();
    i.forEach((u) => {
      const a = u.target.getAttribute("data-id");
      l.set(a, {
        id: a,
        nodeElement: u.target,
        force: !0
      });
    }), t(l);
  }));
  return q.useEffect(() => () => {
    r == null || r.disconnect();
  }, [r]), r;
}
function kS({ node: t, nodeType: r, hasDimensions: i, resizeObserver: l }) {
  const u = je(), a = q.useRef(null), f = q.useRef(null), h = q.useRef(t.sourcePosition), p = q.useRef(t.targetPosition), m = q.useRef(r), v = i && !!t.internals.handleBounds;
  return q.useEffect(() => {
    a.current && !t.hidden && (!v || f.current !== a.current) && (f.current && (l == null || l.unobserve(f.current)), l == null || l.observe(a.current), f.current = a.current);
  }, [v, t.hidden]), q.useEffect(() => () => {
    f.current && (l == null || l.unobserve(f.current), f.current = null);
  }, []), q.useEffect(() => {
    if (a.current) {
      const g = m.current !== r, y = h.current !== t.sourcePosition, x = p.current !== t.targetPosition;
      (g || y || x) && (m.current = r, h.current = t.sourcePosition, p.current = t.targetPosition, u.getState().updateNodeInternals(/* @__PURE__ */ new Map([[t.id, { id: t.id, nodeElement: a.current, force: !0 }]])));
    }
  }, [t.id, r, t.sourcePosition, t.targetPosition]), a;
}
function NS({ id: t, onClick: r, onMouseEnter: i, onMouseMove: l, onMouseLeave: u, onContextMenu: a, onDoubleClick: f, nodesDraggable: h, elementsSelectable: p, nodesConnectable: m, nodesFocusable: v, resizeObserver: g, noDragClassName: y, noPanClassName: x, disableKeyboardA11y: S, rfId: N, nodeTypes: k, nodeClickDistance: E, onError: A }) {
  const { node: _, internals: M, isParent: O } = Me((J) => {
    const ce = J.nodeLookup.get(t), xe = J.parentLookup.has(t);
    return {
      node: ce,
      internals: ce.internals,
      isParent: xe
    };
  }, $e);
  let j = _.type || "default", H = (k == null ? void 0 : k[j]) || Yh[j];
  H === void 0 && (A == null || A("003", Kt.error003(j)), j = "default", H = (k == null ? void 0 : k.default) || Yh.default);
  const G = !!(_.draggable || h && typeof _.draggable > "u"), K = !!(_.selectable || p && typeof _.selectable > "u"), ie = !!(_.connectable || m && typeof _.connectable > "u"), X = !!(_.focusable || v && typeof _.focusable > "u"), b = je(), Z = Wp(_), z = kS({ node: _, nodeType: j, hasDimensions: Z, resizeObserver: g }), Y = wg({
    nodeRef: z,
    disabled: _.hidden || !G,
    noDragClassName: y,
    handleSelector: _.dragHandle,
    nodeId: t,
    isSelectable: K,
    nodeClickDistance: E
  }), F = xg();
  if (_.hidden)
    return null;
  const U = mn(_), T = gS(_), I = K || G || r || i || l || u, V = i ? (J) => i(J, { ...M.userNode }) : void 0, C = l ? (J) => l(J, { ...M.userNode }) : void 0, R = u ? (J) => u(J, { ...M.userNode }) : void 0, te = a ? (J) => a(J, { ...M.userNode }) : void 0, ee = f ? (J) => f(J, { ...M.userNode }) : void 0, le = (J) => {
    const { selectNodesOnDrag: ce, nodeDragThreshold: xe } = b.getState();
    K && (!ce || !G || xe > 0) && Ka({
      id: t,
      store: b,
      nodeRef: z
    }), r && r(J, { ...M.userNode });
  }, ue = (J) => {
    if (!(bp(J.nativeEvent) || S)) {
      if (Dp.includes(J.key) && K) {
        const ce = J.key === "Escape";
        Ka({
          id: t,
          store: b,
          unselect: ce,
          nodeRef: z
        });
      } else if (G && _.selected && Object.prototype.hasOwnProperty.call(hl, J.key)) {
        J.preventDefault();
        const { ariaLabelConfig: ce } = b.getState();
        b.setState({
          ariaLiveMessage: ce["node.a11yDescription.ariaLiveMessage"]({
            direction: J.key.replace("Arrow", "").toLowerCase(),
            x: ~~M.positionAbsolute.x,
            y: ~~M.positionAbsolute.y
          })
        }), F({
          direction: hl[J.key],
          factor: J.shiftKey ? 4 : 1
        });
      }
    }
  }, ae = () => {
    var Ne;
    if (S || !((Ne = z.current) != null && Ne.matches(":focus-visible")))
      return;
    const { transform: J, width: ce, height: xe, autoPanOnNodeFocus: _e, setCenter: Se } = b.getState();
    if (!_e)
      return;
    lc(/* @__PURE__ */ new Map([[t, _]]), { x: 0, y: 0, width: ce, height: xe }, J, !0).length > 0 || Se(_.position.x + U.width / 2, _.position.y + U.height / 2, {
      zoom: J[2]
    });
  };
  return D.jsx("div", { className: Ye([
    "react-flow__node",
    `react-flow__node-${j}`,
    {
      // this is overwritable by passing `nopan` as a class name
      [x]: G
    },
    _.className,
    {
      selected: _.selected,
      selectable: K,
      parent: O,
      draggable: G,
      dragging: Y
    }
  ]), ref: z, style: {
    zIndex: M.z,
    transform: `translate(${M.positionAbsolute.x}px,${M.positionAbsolute.y}px)`,
    pointerEvents: I ? "all" : "none",
    visibility: Z ? "visible" : "hidden",
    ..._.style,
    ...T
  }, "data-id": t, "data-testid": `rf__node-${t}`, onMouseEnter: V, onMouseMove: C, onMouseLeave: R, onContextMenu: te, onClick: le, onDoubleClick: ee, onKeyDown: X ? ue : void 0, tabIndex: X ? 0 : void 0, onFocus: X ? ae : void 0, role: _.ariaRole ?? (X ? "group" : void 0), "aria-roledescription": "node", "aria-describedby": S ? void 0 : `${fg}-${N}`, "aria-label": _.ariaLabel, ..._.domAttributes, children: D.jsx(lS, { value: t, children: D.jsx(H, { id: t, data: _.data, type: j, positionAbsoluteX: M.positionAbsolute.x, positionAbsoluteY: M.positionAbsolute.y, selected: _.selected ?? !1, selectable: K, draggable: G, deletable: _.deletable ?? !0, isConnectable: ie, sourcePosition: _.sourcePosition, targetPosition: _.targetPosition, dragging: Y, dragHandle: _.dragHandle, zIndex: M.z, parentId: _.parentId, ...U }) }) });
}
var CS = q.memo(NS);
const MS = (t) => ({
  nodesDraggable: t.nodesDraggable,
  nodesConnectable: t.nodesConnectable,
  nodesFocusable: t.nodesFocusable,
  elementsSelectable: t.elementsSelectable,
  onError: t.onError
});
function Eg(t) {
  const { nodesDraggable: r, nodesConnectable: i, nodesFocusable: l, elementsSelectable: u, onError: a } = Me(MS, $e), f = SS(t.onlyRenderVisibleElements), h = ES();
  return D.jsx("div", { className: "react-flow__nodes", style: Nl, children: f.map((p) => (
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
    D.jsx(CS, { id: p, nodeTypes: t.nodeTypes, nodeExtent: t.nodeExtent, onClick: t.onNodeClick, onMouseEnter: t.onNodeMouseEnter, onMouseMove: t.onNodeMouseMove, onMouseLeave: t.onNodeMouseLeave, onContextMenu: t.onNodeContextMenu, onDoubleClick: t.onNodeDoubleClick, noDragClassName: t.noDragClassName, noPanClassName: t.noPanClassName, rfId: t.rfId, disableKeyboardA11y: t.disableKeyboardA11y, resizeObserver: h, nodesDraggable: r, nodesConnectable: i, nodesFocusable: l, elementsSelectable: u, nodeClickDistance: t.nodeClickDistance, onError: a }, p)
  )) });
}
Eg.displayName = "NodeRenderer";
const PS = q.memo(Eg);
function TS(t) {
  return Me(q.useCallback((i) => {
    if (!t)
      return i.edges.map((u) => u.id);
    const l = [];
    if (i.width && i.height)
      for (const u of i.edges) {
        const a = i.nodeLookup.get(u.source), f = i.nodeLookup.get(u.target);
        a && f && Mx({
          sourceNode: a,
          targetNode: f,
          width: i.width,
          height: i.height,
          transform: i.transform
        }) && l.push(u.id);
      }
    return l;
  }, [t]), $e);
}
const zS = ({ color: t = "none", strokeWidth: r = 1 }) => {
  const i = {
    strokeWidth: r,
    ...t && { stroke: t }
  };
  return D.jsx("polyline", { className: "arrow", style: i, strokeLinecap: "round", fill: "none", strokeLinejoin: "round", points: "-5,-4 0,0 -5,4" });
}, IS = ({ color: t = "none", strokeWidth: r = 1 }) => {
  const i = {
    strokeWidth: r,
    ...t && { stroke: t, fill: t }
  };
  return D.jsx("polyline", { className: "arrowclosed", style: i, strokeLinecap: "round", strokeLinejoin: "round", points: "-5,-4 0,0 -5,4 -5,-4" });
}, bh = {
  [cl.Arrow]: zS,
  [cl.ArrowClosed]: IS
};
function LS(t) {
  const r = je();
  return q.useMemo(() => {
    var u, a;
    return Object.prototype.hasOwnProperty.call(bh, t) ? bh[t] : ((a = (u = r.getState()).onError) == null || a.call(u, "009", Kt.error009(t)), null);
  }, [t]);
}
const AS = ({ id: t, type: r, color: i, width: l = 12.5, height: u = 12.5, markerUnits: a = "strokeWidth", strokeWidth: f, orient: h = "auto-start-reverse" }) => {
  const p = LS(r);
  return p ? D.jsx("marker", { className: "react-flow__arrowhead", id: t, markerWidth: `${l}`, markerHeight: `${u}`, viewBox: "-10 -10 20 20", markerUnits: a, orient: h, refX: "0", refY: "0", children: D.jsx(p, { color: i, strokeWidth: f }) }) : null;
}, kg = ({ defaultColor: t, rfId: r }) => {
  const i = Me((a) => a.edges), l = Me((a) => a.defaultEdgeOptions), u = q.useMemo(() => Dx(i, {
    id: r,
    defaultColor: t,
    defaultMarkerStart: l == null ? void 0 : l.markerStart,
    defaultMarkerEnd: l == null ? void 0 : l.markerEnd
  }), [i, l, r, t]);
  return u.length ? D.jsx("svg", { className: "react-flow__marker", "aria-hidden": "true", children: D.jsx("defs", { children: u.map((a) => D.jsx(AS, { id: a.id, type: a.type, color: a.color, width: a.width, height: a.height, markerUnits: a.markerUnits, strokeWidth: a.strokeWidth, orient: a.orient }, a.id)) }) }) : null;
};
kg.displayName = "MarkerDefinitions";
var RS = q.memo(kg);
function Ng({ x: t, y: r, label: i, labelStyle: l, labelShowBg: u = !0, labelBgStyle: a, labelBgPadding: f = [2, 4], labelBgBorderRadius: h = 2, children: p, className: m, ...v }) {
  const [g, y] = q.useState({ x: 1, y: 0, width: 0, height: 0 }), x = Ye(["react-flow__edge-textwrapper", m]), S = q.useRef(null);
  return q.useEffect(() => {
    if (S.current) {
      const N = S.current.getBBox();
      y({
        x: N.x,
        y: N.y,
        width: N.width,
        height: N.height
      });
    }
  }, [i]), i ? D.jsxs("g", { transform: `translate(${t - g.width / 2} ${r - g.height / 2})`, className: x, visibility: g.width ? "visible" : "hidden", ...v, children: [u && D.jsx("rect", { width: g.width + 2 * f[0], x: -f[0], y: -f[1], height: g.height + 2 * f[1], className: "react-flow__edge-textbg", style: a, rx: h, ry: h }), D.jsx("text", { className: "react-flow__edge-text", y: g.height / 2, dy: "0.3em", ref: S, style: l, children: i }), p] }) : null;
}
Ng.displayName = "EdgeText";
const DS = q.memo(Ng);
function uo({ path: t, labelX: r, labelY: i, label: l, labelStyle: u, labelShowBg: a, labelBgStyle: f, labelBgPadding: h, labelBgBorderRadius: p, interactionWidth: m = 20, ...v }) {
  return D.jsxs(D.Fragment, { children: [D.jsx("path", { ...v, d: t, fill: "none", className: Ye(["react-flow__edge-path", v.className]) }), m ? D.jsx("path", { d: t, fill: "none", strokeOpacity: 0, strokeWidth: m, className: "react-flow__edge-interaction" }) : null, l && Ot(r) && Ot(i) ? D.jsx(DS, { x: r, y: i, label: l, labelStyle: u, labelShowBg: a, labelBgStyle: f, labelBgPadding: h, labelBgBorderRadius: p }) : null] });
}
function Qh({ pos: t, x1: r, y1: i, x2: l, y2: u }) {
  return t === me.Left || t === me.Right ? [0.5 * (r + l), i] : [r, 0.5 * (i + u)];
}
function Cg({ sourceX: t, sourceY: r, sourcePosition: i = me.Bottom, targetX: l, targetY: u, targetPosition: a = me.Top }) {
  const [f, h] = Qh({
    pos: i,
    x1: t,
    y1: r,
    x2: l,
    y2: u
  }), [p, m] = Qh({
    pos: a,
    x1: l,
    y1: u,
    x2: t,
    y2: r
  }), [v, g, y, x] = Gp({
    sourceX: t,
    sourceY: r,
    targetX: l,
    targetY: u,
    sourceControlX: f,
    sourceControlY: h,
    targetControlX: p,
    targetControlY: m
  });
  return [
    `M${t},${r} C${f},${h} ${p},${m} ${l},${u}`,
    v,
    g,
    y,
    x
  ];
}
function Mg(t) {
  return q.memo(({ id: r, sourceX: i, sourceY: l, targetX: u, targetY: a, sourcePosition: f, targetPosition: h, label: p, labelStyle: m, labelShowBg: v, labelBgStyle: g, labelBgPadding: y, labelBgBorderRadius: x, style: S, markerEnd: N, markerStart: k, interactionWidth: E }) => {
    const [A, _, M] = Cg({
      sourceX: i,
      sourceY: l,
      sourcePosition: f,
      targetX: u,
      targetY: a,
      targetPosition: h
    }), O = t.isInternal ? void 0 : r;
    return D.jsx(uo, { id: O, path: A, labelX: _, labelY: M, label: p, labelStyle: m, labelShowBg: v, labelBgStyle: g, labelBgPadding: y, labelBgBorderRadius: x, style: S, markerEnd: N, markerStart: k, interactionWidth: E });
  });
}
const $S = Mg({ isInternal: !1 }), Pg = Mg({ isInternal: !0 });
$S.displayName = "SimpleBezierEdge";
Pg.displayName = "SimpleBezierEdgeInternal";
function Tg(t) {
  return q.memo(({ id: r, sourceX: i, sourceY: l, targetX: u, targetY: a, label: f, labelStyle: h, labelShowBg: p, labelBgStyle: m, labelBgPadding: v, labelBgBorderRadius: g, style: y, sourcePosition: x = me.Bottom, targetPosition: S = me.Top, markerEnd: N, markerStart: k, pathOptions: E, interactionWidth: A }) => {
    const [_, M, O] = Xa({
      sourceX: i,
      sourceY: l,
      sourcePosition: x,
      targetX: u,
      targetY: a,
      targetPosition: S,
      borderRadius: E == null ? void 0 : E.borderRadius,
      offset: E == null ? void 0 : E.offset,
      stepPosition: E == null ? void 0 : E.stepPosition
    }), j = t.isInternal ? void 0 : r;
    return D.jsx(uo, { id: j, path: _, labelX: M, labelY: O, label: f, labelStyle: h, labelShowBg: p, labelBgStyle: m, labelBgPadding: v, labelBgBorderRadius: g, style: y, markerEnd: N, markerStart: k, interactionWidth: A });
  });
}
const zg = Tg({ isInternal: !1 }), Ig = Tg({ isInternal: !0 });
zg.displayName = "SmoothStepEdge";
Ig.displayName = "SmoothStepEdgeInternal";
function Lg(t) {
  return q.memo(({ id: r, ...i }) => {
    var u;
    const l = t.isInternal ? void 0 : r;
    return D.jsx(zg, { ...i, id: l, pathOptions: q.useMemo(() => {
      var a;
      return { borderRadius: 0, offset: (a = i.pathOptions) == null ? void 0 : a.offset };
    }, [(u = i.pathOptions) == null ? void 0 : u.offset]) });
  });
}
const jS = Lg({ isInternal: !1 }), Ag = Lg({ isInternal: !0 });
jS.displayName = "StepEdge";
Ag.displayName = "StepEdgeInternal";
function Rg(t) {
  return q.memo(({ id: r, sourceX: i, sourceY: l, targetX: u, targetY: a, label: f, labelStyle: h, labelShowBg: p, labelBgStyle: m, labelBgPadding: v, labelBgBorderRadius: g, style: y, markerEnd: x, markerStart: S, interactionWidth: N }) => {
    const [k, E, A] = qp({ sourceX: i, sourceY: l, targetX: u, targetY: a }), _ = t.isInternal ? void 0 : r;
    return D.jsx(uo, { id: _, path: k, labelX: E, labelY: A, label: f, labelStyle: h, labelShowBg: p, labelBgStyle: m, labelBgPadding: v, labelBgBorderRadius: g, style: y, markerEnd: x, markerStart: S, interactionWidth: N });
  });
}
const FS = Rg({ isInternal: !1 }), Dg = Rg({ isInternal: !0 });
FS.displayName = "StraightEdge";
Dg.displayName = "StraightEdgeInternal";
function $g(t) {
  return q.memo(({ id: r, sourceX: i, sourceY: l, targetX: u, targetY: a, sourcePosition: f = me.Bottom, targetPosition: h = me.Top, label: p, labelStyle: m, labelShowBg: v, labelBgStyle: g, labelBgPadding: y, labelBgBorderRadius: x, style: S, markerEnd: N, markerStart: k, pathOptions: E, interactionWidth: A }) => {
    const [_, M, O] = _l({
      sourceX: i,
      sourceY: l,
      sourcePosition: f,
      targetX: u,
      targetY: a,
      targetPosition: h,
      curvature: E == null ? void 0 : E.curvature
    }), j = t.isInternal ? void 0 : r;
    return D.jsx(uo, { id: j, path: _, labelX: M, labelY: O, label: p, labelStyle: m, labelShowBg: v, labelBgStyle: g, labelBgPadding: y, labelBgBorderRadius: x, style: S, markerEnd: N, markerStart: k, interactionWidth: A });
  });
}
const OS = $g({ isInternal: !1 }), jg = $g({ isInternal: !0 });
OS.displayName = "BezierEdge";
jg.displayName = "BezierEdgeInternal";
const Gh = {
  default: jg,
  straight: Dg,
  step: Ag,
  smoothstep: Ig,
  simplebezier: Pg
}, Kh = {
  sourceX: null,
  sourceY: null,
  targetX: null,
  targetY: null,
  sourcePosition: null,
  targetPosition: null
}, HS = (t, r, i) => i === me.Left ? t - r : i === me.Right ? t + r : t, VS = (t, r, i) => i === me.Top ? t - r : i === me.Bottom ? t + r : t, qh = "react-flow__edgeupdater";
function Zh({ position: t, centerX: r, centerY: i, radius: l = 10, onMouseDown: u, onMouseEnter: a, onMouseOut: f, type: h }) {
  return D.jsx("circle", { onMouseDown: u, onMouseEnter: a, onMouseOut: f, className: Ye([qh, `${qh}-${h}`]), cx: HS(r, l, t), cy: VS(i, l, t), r: l, stroke: "transparent", fill: "transparent" });
}
function BS({ isReconnectable: t, reconnectRadius: r, edge: i, sourceX: l, sourceY: u, targetX: a, targetY: f, sourcePosition: h, targetPosition: p, onReconnect: m, onReconnectStart: v, onReconnectEnd: g, setReconnecting: y, setUpdateHover: x }) {
  const S = je(), N = (M, O) => {
    if (M.button !== 0)
      return;
    const { autoPanOnConnect: j, domNode: H, isValidConnection: G, connectionMode: K, connectionRadius: ie, lib: X, onConnectStart: b, onConnectEnd: Z, cancelConnection: z, nodeLookup: Y, rfId: F, panBy: U, updateConnection: T } = S.getState(), I = O.type === "target", V = (te, ee) => {
      y(!1), g == null || g(te, i, O.type, ee);
    }, C = (te) => m == null ? void 0 : m(i, te), R = (te, ee) => {
      y(!0), v == null || v(M, i, O.type), b == null || b(te, ee);
    };
    Ga.onPointerDown(M.nativeEvent, {
      autoPanOnConnect: j,
      connectionMode: K,
      connectionRadius: ie,
      domNode: H,
      handleId: O.id,
      nodeId: O.nodeId,
      nodeLookup: Y,
      isTarget: I,
      edgeUpdaterType: O.type,
      lib: X,
      flowId: F,
      cancelConnection: z,
      panBy: U,
      isValidConnection: G,
      onConnect: C,
      onConnectStart: R,
      onConnectEnd: Z,
      onReconnectEnd: V,
      updateConnection: T,
      getTransform: () => S.getState().transform,
      getFromHandle: () => S.getState().connection.fromHandle,
      dragThreshold: S.getState().connectionDragThreshold,
      handleDomNode: M.currentTarget
    });
  }, k = (M) => N(M, { nodeId: i.target, id: i.targetHandle ?? null, type: "target" }), E = (M) => N(M, { nodeId: i.source, id: i.sourceHandle ?? null, type: "source" }), A = () => x(!0), _ = () => x(!1);
  return D.jsxs(D.Fragment, { children: [(t === !0 || t === "source") && D.jsx(Zh, { position: h, centerX: l, centerY: u, radius: r, onMouseDown: k, onMouseEnter: A, onMouseOut: _, type: "source" }), (t === !0 || t === "target") && D.jsx(Zh, { position: p, centerX: a, centerY: f, radius: r, onMouseDown: E, onMouseEnter: A, onMouseOut: _, type: "target" })] });
}
function US({ id: t, edgesFocusable: r, edgesReconnectable: i, elementsSelectable: l, onClick: u, onDoubleClick: a, onContextMenu: f, onMouseEnter: h, onMouseMove: p, onMouseLeave: m, reconnectRadius: v, onReconnect: g, onReconnectStart: y, onReconnectEnd: x, rfId: S, edgeTypes: N, noPanClassName: k, onError: E, disableKeyboardA11y: A }) {
  let _ = Me((Se) => Se.edgeLookup.get(t));
  const M = Me((Se) => Se.defaultEdgeOptions);
  _ = M ? { ...M, ..._ } : _;
  let O = _.type || "default", j = (N == null ? void 0 : N[O]) || Gh[O];
  j === void 0 && (E == null || E("011", Kt.error011(O)), O = "default", j = (N == null ? void 0 : N.default) || Gh.default);
  const H = !!(_.focusable || r && typeof _.focusable > "u"), G = typeof g < "u" && (_.reconnectable || i && typeof _.reconnectable > "u"), K = !!(_.selectable || l && typeof _.selectable > "u"), ie = q.useRef(null), [X, b] = q.useState(!1), [Z, z] = q.useState(!1), Y = je(), { zIndex: F, sourceX: U, sourceY: T, targetX: I, targetY: V, sourcePosition: C, targetPosition: R } = Me(q.useCallback((Se) => {
    const ye = Se.nodeLookup.get(_.source), Ne = Se.nodeLookup.get(_.target);
    if (!ye || !Ne)
      return {
        zIndex: _.zIndex,
        ...Kh
      };
    const Ie = Rx({
      id: t,
      sourceNode: ye,
      targetNode: Ne,
      sourceHandle: _.sourceHandle || null,
      targetHandle: _.targetHandle || null,
      connectionMode: Se.connectionMode,
      onError: E
    });
    return {
      zIndex: Cx({
        selected: _.selected,
        zIndex: _.zIndex,
        sourceNode: ye,
        targetNode: Ne,
        elevateOnSelect: Se.elevateEdgesOnSelect,
        zIndexMode: Se.zIndexMode
      }),
      ...Ie || Kh
    };
  }, [_.source, _.target, _.sourceHandle, _.targetHandle, _.selected, _.zIndex]), $e), te = q.useMemo(() => _.markerStart ? `url('#${ba(_.markerStart, S)}')` : void 0, [_.markerStart, S]), ee = q.useMemo(() => _.markerEnd ? `url('#${ba(_.markerEnd, S)}')` : void 0, [_.markerEnd, S]);
  if (_.hidden || U === null || T === null || I === null || V === null)
    return null;
  const le = (Se) => {
    var Ce;
    const { addSelectedEdges: ye, unselectNodesAndEdges: Ne, multiSelectionActive: Ie } = Y.getState();
    K && (Y.setState({ nodesSelectionActive: !1 }), _.selected && Ie ? (Ne({ nodes: [], edges: [_] }), (Ce = ie.current) == null || Ce.blur()) : ye([t])), u && u(Se, _);
  }, ue = a ? (Se) => {
    a(Se, { ..._ });
  } : void 0, ae = f ? (Se) => {
    f(Se, { ..._ });
  } : void 0, J = h ? (Se) => {
    h(Se, { ..._ });
  } : void 0, ce = p ? (Se) => {
    p(Se, { ..._ });
  } : void 0, xe = m ? (Se) => {
    m(Se, { ..._ });
  } : void 0, _e = (Se) => {
    var ye;
    if (!A && Dp.includes(Se.key) && K) {
      const { unselectNodesAndEdges: Ne, addSelectedEdges: Ie } = Y.getState();
      Se.key === "Escape" ? ((ye = ie.current) == null || ye.blur(), Ne({ edges: [_] })) : Ie([t]);
    }
  };
  return D.jsx("svg", { style: { zIndex: F }, children: D.jsxs("g", { className: Ye([
    "react-flow__edge",
    `react-flow__edge-${O}`,
    _.className,
    k,
    {
      selected: _.selected,
      animated: _.animated,
      inactive: !K && !u,
      updating: X,
      selectable: K
    }
  ]), onClick: le, onDoubleClick: ue, onContextMenu: ae, onMouseEnter: J, onMouseMove: ce, onMouseLeave: xe, onKeyDown: H ? _e : void 0, tabIndex: H ? 0 : void 0, role: _.ariaRole ?? (H ? "group" : "img"), "aria-roledescription": "edge", "data-id": t, "data-testid": `rf__edge-${t}`, "aria-label": _.ariaLabel === null ? void 0 : _.ariaLabel || `Edge from ${_.source} to ${_.target}`, "aria-describedby": H ? `${dg}-${S}` : void 0, ref: ie, ..._.domAttributes, children: [!Z && D.jsx(j, { id: t, source: _.source, target: _.target, type: _.type, selected: _.selected, animated: _.animated, selectable: K, deletable: _.deletable ?? !0, label: _.label, labelStyle: _.labelStyle, labelShowBg: _.labelShowBg, labelBgStyle: _.labelBgStyle, labelBgPadding: _.labelBgPadding, labelBgBorderRadius: _.labelBgBorderRadius, sourceX: U, sourceY: T, targetX: I, targetY: V, sourcePosition: C, targetPosition: R, data: _.data, style: _.style, sourceHandleId: _.sourceHandle, targetHandleId: _.targetHandle, markerStart: te, markerEnd: ee, pathOptions: "pathOptions" in _ ? _.pathOptions : void 0, interactionWidth: _.interactionWidth }), G && D.jsx(BS, { edge: _, isReconnectable: G, reconnectRadius: v, onReconnect: g, onReconnectStart: y, onReconnectEnd: x, sourceX: U, sourceY: T, targetX: I, targetY: V, sourcePosition: C, targetPosition: R, setUpdateHover: b, setReconnecting: z })] }) });
}
var WS = q.memo(US);
const YS = (t) => ({
  edgesFocusable: t.edgesFocusable,
  edgesReconnectable: t.edgesReconnectable,
  elementsSelectable: t.elementsSelectable,
  connectionMode: t.connectionMode,
  onError: t.onError
});
function Fg({ defaultMarkerColor: t, onlyRenderVisibleElements: r, rfId: i, edgeTypes: l, noPanClassName: u, onReconnect: a, onEdgeContextMenu: f, onEdgeMouseEnter: h, onEdgeMouseMove: p, onEdgeMouseLeave: m, onEdgeClick: v, reconnectRadius: g, onEdgeDoubleClick: y, onReconnectStart: x, onReconnectEnd: S, disableKeyboardA11y: N }) {
  const { edgesFocusable: k, edgesReconnectable: E, elementsSelectable: A, onError: _ } = Me(YS, $e), M = TS(r);
  return D.jsxs("div", { className: "react-flow__edges", children: [D.jsx(RS, { defaultColor: t, rfId: i }), M.map((O) => D.jsx(WS, { id: O, edgesFocusable: k, edgesReconnectable: E, elementsSelectable: A, noPanClassName: u, onReconnect: a, onContextMenu: f, onMouseEnter: h, onMouseMove: p, onMouseLeave: m, onClick: v, reconnectRadius: g, onDoubleClick: y, onReconnectStart: x, onReconnectEnd: S, rfId: i, onError: _, edgeTypes: l, disableKeyboardA11y: N }, O))] });
}
Fg.displayName = "EdgeRenderer";
const XS = q.memo(Fg), bS = (t) => `translate(${t.transform[0]}px,${t.transform[1]}px) scale(${t.transform[2]})`;
function QS({ children: t }) {
  const r = Me(bS);
  return D.jsx("div", { className: "react-flow__viewport xyflow__viewport react-flow__container", style: { transform: r }, children: t });
}
function GS(t) {
  const r = gc(), i = q.useRef(!1);
  q.useEffect(() => {
    !i.current && r.viewportInitialized && t && (setTimeout(() => t(r), 1), i.current = !0);
  }, [t, r.viewportInitialized]);
}
const KS = (t) => {
  var r;
  return (r = t.panZoom) == null ? void 0 : r.syncViewport;
};
function qS(t) {
  const r = Me(KS), i = je();
  return q.useEffect(() => {
    t && (r == null || r(t), i.setState({ transform: [t.x, t.y, t.zoom] }));
  }, [t, r]), null;
}
function ZS(t) {
  return t.connection.inProgress ? { ...t.connection, to: _i(t.connection.to, t.transform) } : { ...t.connection };
}
function JS(t) {
  return ZS;
}
function e_(t) {
  const r = JS();
  return Me(r, $e);
}
const t_ = (t) => ({
  nodesConnectable: t.nodesConnectable,
  isValid: t.connection.isValid,
  inProgress: t.connection.inProgress,
  width: t.width,
  height: t.height
});
function n_({ containerStyle: t, style: r, type: i, component: l }) {
  const { nodesConnectable: u, width: a, height: f, isValid: h, inProgress: p } = Me(t_, $e);
  return !(a && u && p) ? null : D.jsx("svg", { style: t, width: a, height: f, className: "react-flow__connectionline react-flow__container", children: D.jsx("g", { className: Ye(["react-flow__connection", Fp(h)]), children: D.jsx(Og, { style: r, type: i, CustomComponent: l, isValid: h }) }) });
}
const Og = ({ style: t, type: r = Vn.Bezier, CustomComponent: i, isValid: l }) => {
  const { inProgress: u, from: a, fromNode: f, fromHandle: h, fromPosition: p, to: m, toNode: v, toHandle: g, toPosition: y, pointer: x } = e_();
  if (!u)
    return;
  if (i)
    return D.jsx(i, { connectionLineType: r, connectionLineStyle: t, fromNode: f, fromHandle: h, fromX: a.x, fromY: a.y, toX: m.x, toY: m.y, fromPosition: p, toPosition: y, connectionStatus: Fp(l), toNode: v, toHandle: g, pointer: x });
  let S = "";
  const N = {
    sourceX: a.x,
    sourceY: a.y,
    sourcePosition: p,
    targetX: m.x,
    targetY: m.y,
    targetPosition: y
  };
  switch (r) {
    case Vn.Bezier:
      [S] = _l(N);
      break;
    case Vn.SimpleBezier:
      [S] = Cg(N);
      break;
    case Vn.Step:
      [S] = Xa({
        ...N,
        borderRadius: 0
      });
      break;
    case Vn.SmoothStep:
      [S] = Xa(N);
      break;
    default:
      [S] = qp(N);
  }
  return D.jsx("path", { d: S, fill: "none", className: "react-flow__connection-path", style: t });
};
Og.displayName = "ConnectionLine";
const r_ = {};
function Jh(t = r_) {
  q.useRef(t), je(), q.useEffect(() => {
  }, [t]);
}
function o_() {
  je(), q.useRef(!1), q.useEffect(() => {
  }, []);
}
function Hg({ nodeTypes: t, edgeTypes: r, onInit: i, onNodeClick: l, onEdgeClick: u, onNodeDoubleClick: a, onEdgeDoubleClick: f, onNodeMouseEnter: h, onNodeMouseMove: p, onNodeMouseLeave: m, onNodeContextMenu: v, onSelectionContextMenu: g, onSelectionStart: y, onSelectionEnd: x, connectionLineType: S, connectionLineStyle: N, connectionLineComponent: k, connectionLineContainerStyle: E, selectionKeyCode: A, selectionOnDrag: _, selectionMode: M, multiSelectionKeyCode: O, panActivationKeyCode: j, zoomActivationKeyCode: H, deleteKeyCode: G, onlyRenderVisibleElements: K, elementsSelectable: ie, defaultViewport: X, translateExtent: b, minZoom: Z, maxZoom: z, preventScrolling: Y, defaultMarkerColor: F, zoomOnScroll: U, zoomOnPinch: T, panOnScroll: I, panOnScrollSpeed: V, panOnScrollMode: C, zoomOnDoubleClick: R, panOnDrag: te, onPaneClick: ee, onPaneMouseEnter: le, onPaneMouseMove: ue, onPaneMouseLeave: ae, onPaneScroll: J, onPaneContextMenu: ce, paneClickDistance: xe, nodeClickDistance: _e, onEdgeContextMenu: Se, onEdgeMouseEnter: ye, onEdgeMouseMove: Ne, onEdgeMouseLeave: Ie, reconnectRadius: Ce, onReconnect: Ue, onReconnectStart: zt, onReconnectEnd: dt, noDragClassName: ht, noWheelClassName: _t, noPanClassName: Zt, disableKeyboardA11y: yn, nodeExtent: yr, rfId: Bn, viewport: Jt, onViewportChange: en }) {
  return Jh(t), Jh(r), o_(), GS(i), qS(Jt), D.jsx(wS, { onPaneClick: ee, onPaneMouseEnter: le, onPaneMouseMove: ue, onPaneMouseLeave: ae, onPaneContextMenu: ce, onPaneScroll: J, paneClickDistance: xe, deleteKeyCode: G, selectionKeyCode: A, selectionOnDrag: _, selectionMode: M, onSelectionStart: y, onSelectionEnd: x, multiSelectionKeyCode: O, panActivationKeyCode: j, zoomActivationKeyCode: H, elementsSelectable: ie, zoomOnScroll: U, zoomOnPinch: T, zoomOnDoubleClick: R, panOnScroll: I, panOnScrollSpeed: V, panOnScrollMode: C, panOnDrag: te, defaultViewport: X, translateExtent: b, minZoom: Z, maxZoom: z, onSelectionContextMenu: g, preventScrolling: Y, noDragClassName: ht, noWheelClassName: _t, noPanClassName: Zt, disableKeyboardA11y: yn, onViewportChange: en, isControlledViewport: !!Jt, children: D.jsxs(QS, { children: [D.jsx(XS, { edgeTypes: r, onEdgeClick: u, onEdgeDoubleClick: f, onReconnect: Ue, onReconnectStart: zt, onReconnectEnd: dt, onlyRenderVisibleElements: K, onEdgeContextMenu: Se, onEdgeMouseEnter: ye, onEdgeMouseMove: Ne, onEdgeMouseLeave: Ie, reconnectRadius: Ce, defaultMarkerColor: F, noPanClassName: Zt, disableKeyboardA11y: yn, rfId: Bn }), D.jsx(n_, { style: N, type: S, component: k, containerStyle: E }), D.jsx("div", { className: "react-flow__edgelabel-renderer" }), D.jsx(PS, { nodeTypes: t, onNodeClick: l, onNodeDoubleClick: a, onNodeMouseEnter: h, onNodeMouseMove: p, onNodeMouseLeave: m, onNodeContextMenu: v, nodeClickDistance: _e, onlyRenderVisibleElements: K, noPanClassName: Zt, noDragClassName: ht, disableKeyboardA11y: yn, nodeExtent: yr, rfId: Bn }), D.jsx("div", { className: "react-flow__viewport-portal" })] }) });
}
Hg.displayName = "GraphView";
const i_ = q.memo(Hg), ep = ({ nodes: t, edges: r, defaultNodes: i, defaultEdges: l, width: u, height: a, fitView: f, fitViewOptions: h, minZoom: p = 0.5, maxZoom: m = 2, nodeOrigin: v, nodeExtent: g, zIndexMode: y = "basic" } = {}) => {
  const x = /* @__PURE__ */ new Map(), S = /* @__PURE__ */ new Map(), N = /* @__PURE__ */ new Map(), k = /* @__PURE__ */ new Map(), E = l ?? r ?? [], A = i ?? t ?? [], _ = v ?? [0, 0], M = g ?? fi;
  eg(N, k, E);
  const O = Qa(A, x, S, {
    nodeOrigin: _,
    nodeExtent: M,
    zIndexMode: y
  });
  let j = [0, 0, 1];
  if (f && u && a) {
    const H = xi(x, {
      filter: (X) => !!((X.width || X.initialWidth) && (X.height || X.initialHeight))
    }), { x: G, y: K, zoom: ie } = uc(H, u, a, p, m, (h == null ? void 0 : h.padding) ?? 0.1);
    j = [G, K, ie];
  }
  return {
    rfId: "1",
    width: u ?? 0,
    height: a ?? 0,
    transform: j,
    nodes: A,
    nodesInitialized: O,
    nodeLookup: x,
    parentLookup: S,
    edges: E,
    edgeLookup: k,
    connectionLookup: N,
    onNodesChange: null,
    onEdgesChange: null,
    hasDefaultNodes: i !== void 0,
    hasDefaultEdges: l !== void 0,
    panZoom: null,
    minZoom: p,
    maxZoom: m,
    translateExtent: fi,
    nodeExtent: M,
    nodesSelectionActive: !1,
    userSelectionActive: !1,
    userSelectionRect: null,
    connectionMode: ro.Strict,
    domNode: null,
    paneDragging: !1,
    noPanClassName: "nopan",
    nodeOrigin: _,
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
    fitViewQueued: f ?? !1,
    fitViewOptions: h,
    fitViewResolver: null,
    connection: { ...jp },
    connectionClickStartHandle: null,
    connectOnClick: !0,
    ariaLiveMessage: "",
    autoPanOnConnect: !0,
    autoPanOnNodeDrag: !0,
    autoPanOnNodeFocus: !0,
    autoPanSpeed: 15,
    connectionRadius: 20,
    onError: xx,
    isValidConnection: void 0,
    onSelectionChangeHandlers: [],
    lib: "react",
    debug: !1,
    ariaLabelConfig: $p,
    zIndexMode: y,
    onNodesChangeMiddlewareMap: /* @__PURE__ */ new Map(),
    onEdgesChangeMiddlewareMap: /* @__PURE__ */ new Map()
  };
}, s_ = ({ nodes: t, edges: r, defaultNodes: i, defaultEdges: l, width: u, height: a, fitView: f, fitViewOptions: h, minZoom: p, maxZoom: m, nodeOrigin: v, nodeExtent: g, zIndexMode: y }) => k1((x, S) => {
  async function N() {
    const { nodeLookup: k, panZoom: E, fitViewOptions: A, fitViewResolver: _, width: M, height: O, minZoom: j, maxZoom: H } = S();
    E && (await vx({
      nodes: k,
      width: M,
      height: O,
      panZoom: E,
      minZoom: j,
      maxZoom: H
    }, A), _ == null || _.resolve(!0), x({ fitViewResolver: null }));
  }
  return {
    ...ep({
      nodes: t,
      edges: r,
      width: u,
      height: a,
      fitView: f,
      fitViewOptions: h,
      minZoom: p,
      maxZoom: m,
      nodeOrigin: v,
      nodeExtent: g,
      defaultNodes: i,
      defaultEdges: l,
      zIndexMode: y
    }),
    setNodes: (k) => {
      const { nodeLookup: E, parentLookup: A, nodeOrigin: _, elevateNodesOnSelect: M, fitViewQueued: O, zIndexMode: j } = S(), H = Qa(k, E, A, {
        nodeOrigin: _,
        nodeExtent: g,
        elevateNodesOnSelect: M,
        checkEquality: !0,
        zIndexMode: j
      });
      O && H ? (N(), x({ nodes: k, nodesInitialized: H, fitViewQueued: !1, fitViewOptions: void 0 })) : x({ nodes: k, nodesInitialized: H });
    },
    setEdges: (k) => {
      const { connectionLookup: E, edgeLookup: A } = S();
      eg(E, A, k), x({ edges: k });
    },
    setDefaultNodesAndEdges: (k, E) => {
      if (k) {
        const { setNodes: A } = S();
        A(k), x({ hasDefaultNodes: !0 });
      }
      if (E) {
        const { setEdges: A } = S();
        A(E), x({ hasDefaultEdges: !0 });
      }
    },
    /*
     * Every node gets registerd at a ResizeObserver. Whenever a node
     * changes its dimensions, this function is called to measure the
     * new dimensions and update the nodes.
     */
    updateNodeInternals: (k) => {
      const { triggerNodeChanges: E, nodeLookup: A, parentLookup: _, domNode: M, nodeOrigin: O, nodeExtent: j, debug: H, fitViewQueued: G, zIndexMode: K } = S(), { changes: ie, updatedInternals: X } = Bx(k, A, _, M, O, j, K);
      X && (Fx(A, _, { nodeOrigin: O, nodeExtent: j, zIndexMode: K }), G ? (N(), x({ fitViewQueued: !1, fitViewOptions: void 0 })) : x({}), (ie == null ? void 0 : ie.length) > 0 && (H && console.log("React Flow: trigger node changes", ie), E == null || E(ie)));
    },
    updateNodePositions: (k, E = !1) => {
      const A = [];
      let _ = [];
      const { nodeLookup: M, triggerNodeChanges: O, connection: j, updateConnection: H, onNodesChangeMiddlewareMap: G } = S();
      for (const [K, ie] of k) {
        const X = M.get(K), b = !!(X != null && X.expandParent && (X != null && X.parentId) && (ie != null && ie.position)), Z = {
          id: K,
          type: "position",
          position: b ? {
            x: Math.max(0, ie.position.x),
            y: Math.max(0, ie.position.y)
          } : ie.position,
          dragging: E
        };
        if (X && j.inProgress && j.fromNode.id === X.id) {
          const z = mr(X, j.fromHandle, me.Left, !0);
          H({ ...j, from: z });
        }
        b && X.parentId && A.push({
          id: K,
          parentId: X.parentId,
          rect: {
            ...ie.internals.positionAbsolute,
            width: ie.measured.width ?? 0,
            height: ie.measured.height ?? 0
          }
        }), _.push(Z);
      }
      if (A.length > 0) {
        const { parentLookup: K, nodeOrigin: ie } = S(), X = pc(A, M, K, ie);
        _.push(...X);
      }
      for (const K of G.values())
        _ = K(_);
      O(_);
    },
    triggerNodeChanges: (k) => {
      const { onNodesChange: E, setNodes: A, nodes: _, hasDefaultNodes: M, debug: O } = S();
      if (k != null && k.length) {
        if (M) {
          const j = gg(k, _);
          A(j);
        }
        O && console.log("React Flow: trigger node changes", k), E == null || E(k);
      }
    },
    triggerEdgeChanges: (k) => {
      const { onEdgesChange: E, setEdges: A, edges: _, hasDefaultEdges: M, debug: O } = S();
      if (k != null && k.length) {
        if (M) {
          const j = mg(k, _);
          A(j);
        }
        O && console.log("React Flow: trigger edge changes", k), E == null || E(k);
      }
    },
    addSelectedNodes: (k) => {
      const { multiSelectionActive: E, edgeLookup: A, nodeLookup: _, triggerNodeChanges: M, triggerEdgeChanges: O } = S();
      if (E) {
        const j = k.map((H) => ur(H, !0));
        M(j);
        return;
      }
      M(qr(_, /* @__PURE__ */ new Set([...k]), !0)), O(qr(A));
    },
    addSelectedEdges: (k) => {
      const { multiSelectionActive: E, edgeLookup: A, nodeLookup: _, triggerNodeChanges: M, triggerEdgeChanges: O } = S();
      if (E) {
        const j = k.map((H) => ur(H, !0));
        O(j);
        return;
      }
      O(qr(A, /* @__PURE__ */ new Set([...k]))), M(qr(_, /* @__PURE__ */ new Set(), !0));
    },
    unselectNodesAndEdges: ({ nodes: k, edges: E } = {}) => {
      const { edges: A, nodes: _, nodeLookup: M, triggerNodeChanges: O, triggerEdgeChanges: j } = S(), H = k || _, G = E || A, K = H.map((X) => {
        const b = M.get(X.id);
        return b && (b.selected = !1), ur(X.id, !1);
      }), ie = G.map((X) => ur(X.id, !1));
      O(K), j(ie);
    },
    setMinZoom: (k) => {
      const { panZoom: E, maxZoom: A } = S();
      E == null || E.setScaleExtent([k, A]), x({ minZoom: k });
    },
    setMaxZoom: (k) => {
      const { panZoom: E, minZoom: A } = S();
      E == null || E.setScaleExtent([A, k]), x({ maxZoom: k });
    },
    setTranslateExtent: (k) => {
      var E;
      (E = S().panZoom) == null || E.setTranslateExtent(k), x({ translateExtent: k });
    },
    resetSelectedElements: () => {
      const { edges: k, nodes: E, triggerNodeChanges: A, triggerEdgeChanges: _, elementsSelectable: M } = S();
      if (!M)
        return;
      const O = E.reduce((H, G) => G.selected ? [...H, ur(G.id, !1)] : H, []), j = k.reduce((H, G) => G.selected ? [...H, ur(G.id, !1)] : H, []);
      A(O), _(j);
    },
    setNodeExtent: (k) => {
      const { nodes: E, nodeLookup: A, parentLookup: _, nodeOrigin: M, elevateNodesOnSelect: O, nodeExtent: j, zIndexMode: H } = S();
      k[0][0] === j[0][0] && k[0][1] === j[0][1] && k[1][0] === j[1][0] && k[1][1] === j[1][1] || (Qa(E, A, _, {
        nodeOrigin: M,
        nodeExtent: k,
        elevateNodesOnSelect: O,
        checkEquality: !1,
        zIndexMode: H
      }), x({ nodeExtent: k }));
    },
    panBy: (k) => {
      const { transform: E, width: A, height: _, panZoom: M, translateExtent: O } = S();
      return Ux({ delta: k, panZoom: M, transform: E, translateExtent: O, width: A, height: _ });
    },
    setCenter: async (k, E, A) => {
      const { width: _, height: M, maxZoom: O, panZoom: j } = S();
      if (!j)
        return Promise.resolve(!1);
      const H = typeof (A == null ? void 0 : A.zoom) < "u" ? A.zoom : O;
      return await j.setViewport({
        x: _ / 2 - k * H,
        y: M / 2 - E * H,
        zoom: H
      }, { duration: A == null ? void 0 : A.duration, ease: A == null ? void 0 : A.ease, interpolate: A == null ? void 0 : A.interpolate }), Promise.resolve(!0);
    },
    cancelConnection: () => {
      x({
        connection: { ...jp }
      });
    },
    updateConnection: (k) => {
      x({ connection: k });
    },
    reset: () => x({ ...ep() })
  };
}, Object.is);
function Vg({ initialNodes: t, initialEdges: r, defaultNodes: i, defaultEdges: l, initialWidth: u, initialHeight: a, initialMinZoom: f, initialMaxZoom: h, initialFitViewOptions: p, fitView: m, nodeOrigin: v, nodeExtent: g, zIndexMode: y, children: x }) {
  const [S] = q.useState(() => s_({
    nodes: t,
    edges: r,
    defaultNodes: i,
    defaultEdges: l,
    width: u,
    height: a,
    fitView: m,
    minZoom: f,
    maxZoom: h,
    fitViewOptions: p,
    nodeOrigin: v,
    nodeExtent: g,
    zIndexMode: y
  }));
  return D.jsx(N1, { value: S, children: D.jsx(Q1, { children: x }) });
}
function l_({ children: t, nodes: r, edges: i, defaultNodes: l, defaultEdges: u, width: a, height: f, fitView: h, fitViewOptions: p, minZoom: m, maxZoom: v, nodeOrigin: g, nodeExtent: y, zIndexMode: x }) {
  return q.useContext(kl) ? D.jsx(D.Fragment, { children: t }) : D.jsx(Vg, { initialNodes: r, initialEdges: i, defaultNodes: l, defaultEdges: u, initialWidth: a, initialHeight: f, fitView: h, initialFitViewOptions: p, initialMinZoom: m, initialMaxZoom: v, nodeOrigin: g, nodeExtent: y, zIndexMode: x, children: t });
}
const u_ = {
  width: "100%",
  height: "100%",
  overflow: "hidden",
  position: "relative",
  zIndex: 0
};
function a_({ nodes: t, edges: r, defaultNodes: i, defaultEdges: l, className: u, nodeTypes: a, edgeTypes: f, onNodeClick: h, onEdgeClick: p, onInit: m, onMove: v, onMoveStart: g, onMoveEnd: y, onConnect: x, onConnectStart: S, onConnectEnd: N, onClickConnectStart: k, onClickConnectEnd: E, onNodeMouseEnter: A, onNodeMouseMove: _, onNodeMouseLeave: M, onNodeContextMenu: O, onNodeDoubleClick: j, onNodeDragStart: H, onNodeDrag: G, onNodeDragStop: K, onNodesDelete: ie, onEdgesDelete: X, onDelete: b, onSelectionChange: Z, onSelectionDragStart: z, onSelectionDrag: Y, onSelectionDragStop: F, onSelectionContextMenu: U, onSelectionStart: T, onSelectionEnd: I, onBeforeDelete: V, connectionMode: C, connectionLineType: R = Vn.Bezier, connectionLineStyle: te, connectionLineComponent: ee, connectionLineContainerStyle: le, deleteKeyCode: ue = "Backspace", selectionKeyCode: ae = "Shift", selectionOnDrag: J = !1, selectionMode: ce = di.Full, panActivationKeyCode: xe = "Space", multiSelectionKeyCode: _e = pi() ? "Meta" : "Control", zoomActivationKeyCode: Se = pi() ? "Meta" : "Control", snapToGrid: ye, snapGrid: Ne, onlyRenderVisibleElements: Ie = !1, selectNodesOnDrag: Ce, nodesDraggable: Ue, autoPanOnNodeFocus: zt, nodesConnectable: dt, nodesFocusable: ht, nodeOrigin: _t = hg, edgesFocusable: Zt, edgesReconnectable: yn, elementsSelectable: yr = !0, defaultViewport: Bn = F1, minZoom: Jt = 0.5, maxZoom: en = 2, translateExtent: Un = fi, preventScrolling: ki = !0, nodeExtent: tn, defaultMarkerColor: Wn = "#b1b1b7", zoomOnScroll: Cl = !0, zoomOnPinch: Ni = !0, panOnScroll: Ci = !1, panOnScrollSpeed: Ml = 0.5, panOnScrollMode: ao = fr.Free, zoomOnDoubleClick: co = !0, panOnDrag: fo = !0, onPaneClick: ho, onPaneMouseEnter: po, onPaneMouseMove: vn, onPaneMouseLeave: wn, onPaneScroll: Mi, onPaneContextMenu: Pi, paneClickDistance: Ti = 1, nodeClickDistance: zi = 0, children: Ii, onReconnect: go, onReconnectStart: Li, onReconnectEnd: Yn, onEdgeContextMenu: mo, onEdgeDoubleClick: Xn, onEdgeMouseEnter: Pl, onEdgeMouseMove: bn, onEdgeMouseLeave: vr, reconnectRadius: wr = 10, onNodesChange: yo, onEdgesChange: Tl, noDragClassName: zl = "nodrag", noWheelClassName: Il = "nowheel", noPanClassName: Bt = "nopan", fitView: vo, fitViewOptions: wo, connectOnClick: Ll, attributionPosition: Ai, proOptions: Ri, defaultEdgeOptions: Di, elevateNodesOnSelect: $i = !0, elevateEdgesOnSelect: Al = !1, disableKeyboardA11y: ji = !1, autoPanOnConnect: Fe, autoPanOnNodeDrag: Rl, autoPanSpeed: xo, connectionRadius: Fi, isValidConnection: xr, onError: Dl, style: Oi, id: Qn, nodeDragThreshold: Et, connectionDragThreshold: $l, viewport: pt, onViewportChange: jl, width: Fl, height: Ol, colorMode: Sr = "light", debug: _r, onScroll: Ut, ariaLabelConfig: Er, zIndexMode: Hi = "basic", ...Hl }, So) {
  const kr = Qn || "1", _o = B1(Sr), Gn = q.useCallback((Vi) => {
    Vi.currentTarget.scrollTo({ top: 0, left: 0, behavior: "instant" }), Ut == null || Ut(Vi);
  }, [Ut]);
  return D.jsx("div", { "data-testid": "rf__wrapper", ...Hl, onScroll: Gn, style: { ...Oi, ...u_ }, ref: So, className: Ye(["react-flow", u, _o]), id: Qn, role: "application", children: D.jsxs(l_, { nodes: t, edges: r, width: Fl, height: Ol, fitView: vo, fitViewOptions: wo, minZoom: Jt, maxZoom: en, nodeOrigin: _t, nodeExtent: tn, zIndexMode: Hi, children: [D.jsx(i_, { onInit: m, onNodeClick: h, onEdgeClick: p, onNodeMouseEnter: A, onNodeMouseMove: _, onNodeMouseLeave: M, onNodeContextMenu: O, onNodeDoubleClick: j, nodeTypes: a, edgeTypes: f, connectionLineType: R, connectionLineStyle: te, connectionLineComponent: ee, connectionLineContainerStyle: le, selectionKeyCode: ae, selectionOnDrag: J, selectionMode: ce, deleteKeyCode: ue, multiSelectionKeyCode: _e, panActivationKeyCode: xe, zoomActivationKeyCode: Se, onlyRenderVisibleElements: Ie, defaultViewport: Bn, translateExtent: Un, minZoom: Jt, maxZoom: en, preventScrolling: ki, zoomOnScroll: Cl, zoomOnPinch: Ni, zoomOnDoubleClick: co, panOnScroll: Ci, panOnScrollSpeed: Ml, panOnScrollMode: ao, panOnDrag: fo, onPaneClick: ho, onPaneMouseEnter: po, onPaneMouseMove: vn, onPaneMouseLeave: wn, onPaneScroll: Mi, onPaneContextMenu: Pi, paneClickDistance: Ti, nodeClickDistance: zi, onSelectionContextMenu: U, onSelectionStart: T, onSelectionEnd: I, onReconnect: go, onReconnectStart: Li, onReconnectEnd: Yn, onEdgeContextMenu: mo, onEdgeDoubleClick: Xn, onEdgeMouseEnter: Pl, onEdgeMouseMove: bn, onEdgeMouseLeave: vr, reconnectRadius: wr, defaultMarkerColor: Wn, noDragClassName: zl, noWheelClassName: Il, noPanClassName: Bt, rfId: kr, disableKeyboardA11y: ji, nodeExtent: tn, viewport: pt, onViewportChange: jl }), D.jsx(V1, { nodes: t, edges: r, defaultNodes: i, defaultEdges: l, onConnect: x, onConnectStart: S, onConnectEnd: N, onClickConnectStart: k, onClickConnectEnd: E, nodesDraggable: Ue, autoPanOnNodeFocus: zt, nodesConnectable: dt, nodesFocusable: ht, edgesFocusable: Zt, edgesReconnectable: yn, elementsSelectable: yr, elevateNodesOnSelect: $i, elevateEdgesOnSelect: Al, minZoom: Jt, maxZoom: en, nodeExtent: tn, onNodesChange: yo, onEdgesChange: Tl, snapToGrid: ye, snapGrid: Ne, connectionMode: C, translateExtent: Un, connectOnClick: Ll, defaultEdgeOptions: Di, fitView: vo, fitViewOptions: wo, onNodesDelete: ie, onEdgesDelete: X, onDelete: b, onNodeDragStart: H, onNodeDrag: G, onNodeDragStop: K, onSelectionDrag: Y, onSelectionDragStart: z, onSelectionDragStop: F, onMove: v, onMoveStart: g, onMoveEnd: y, noPanClassName: Bt, nodeOrigin: _t, rfId: kr, autoPanOnConnect: Fe, autoPanOnNodeDrag: Rl, autoPanSpeed: xo, onError: Dl, connectionRadius: Fi, isValidConnection: xr, selectNodesOnDrag: Ce, nodeDragThreshold: Et, connectionDragThreshold: $l, onBeforeDelete: V, debug: _r, ariaLabelConfig: Er, zIndexMode: Hi }), D.jsx(j1, { onSelectionChange: Z }), Ii, D.jsx(L1, { proOptions: Ri, position: Ai }), D.jsx(I1, { rfId: kr, disableKeyboardA11y: ji })] }) });
}
var c_ = yg(a_);
function f_({ dimensions: t, lineWidth: r, variant: i, className: l }) {
  return D.jsx("path", { strokeWidth: r, d: `M${t[0] / 2} 0 V${t[1]} M0 ${t[1] / 2} H${t[0]}`, className: Ye(["react-flow__background-pattern", i, l]) });
}
function d_({ radius: t, className: r }) {
  return D.jsx("circle", { cx: t, cy: t, r: t, className: Ye(["react-flow__background-pattern", "dots", r]) });
}
var pn;
(function(t) {
  t.Lines = "lines", t.Dots = "dots", t.Cross = "cross";
})(pn || (pn = {}));
const h_ = {
  [pn.Dots]: 1,
  [pn.Lines]: 1,
  [pn.Cross]: 6
}, p_ = (t) => ({ transform: t.transform, patternId: `pattern-${t.rfId}` });
function Bg({
  id: t,
  variant: r = pn.Dots,
  // only used for dots and cross
  gap: i = 20,
  // only used for lines and cross
  size: l,
  lineWidth: u = 1,
  offset: a = 0,
  color: f,
  bgColor: h,
  style: p,
  className: m,
  patternClassName: v
}) {
  const g = q.useRef(null), { transform: y, patternId: x } = Me(p_, $e), S = l || h_[r], N = r === pn.Dots, k = r === pn.Cross, E = Array.isArray(i) ? i : [i, i], A = [E[0] * y[2] || 1, E[1] * y[2] || 1], _ = S * y[2], M = Array.isArray(a) ? a : [a, a], O = k ? [_, _] : A, j = [
    M[0] * y[2] || 1 + O[0] / 2,
    M[1] * y[2] || 1 + O[1] / 2
  ], H = `${x}${t || ""}`;
  return D.jsxs("svg", { className: Ye(["react-flow__background", m]), style: {
    ...p,
    ...Nl,
    "--xy-background-color-props": h,
    "--xy-background-pattern-color-props": f
  }, ref: g, "data-testid": "rf__background", children: [D.jsx("pattern", { id: H, x: y[0] % A[0], y: y[1] % A[1], width: A[0], height: A[1], patternUnits: "userSpaceOnUse", patternTransform: `translate(-${j[0]},-${j[1]})`, children: N ? D.jsx(d_, { radius: _ / 2, className: v }) : D.jsx(f_, { dimensions: O, lineWidth: u, variant: r, className: v }) }), D.jsx("rect", { x: "0", y: "0", width: "100%", height: "100%", fill: `url(#${H})` })] });
}
Bg.displayName = "Background";
const g_ = q.memo(Bg);
function m_() {
  return D.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 32", children: D.jsx("path", { d: "M32 18.133H18.133V32h-4.266V18.133H0v-4.266h13.867V0h4.266v13.867H32z" }) });
}
function y_() {
  return D.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 5", children: D.jsx("path", { d: "M0 0h32v4.2H0z" }) });
}
function v_() {
  return D.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 30", children: D.jsx("path", { d: "M3.692 4.63c0-.53.4-.938.939-.938h5.215V0H4.708C2.13 0 0 2.054 0 4.63v5.216h3.692V4.631zM27.354 0h-5.2v3.692h5.17c.53 0 .984.4.984.939v5.215H32V4.631A4.624 4.624 0 0027.354 0zm.954 24.83c0 .532-.4.94-.939.94h-5.215v3.768h5.215c2.577 0 4.631-2.13 4.631-4.707v-5.139h-3.692v5.139zm-23.677.94c-.531 0-.939-.4-.939-.94v-5.138H0v5.139c0 2.577 2.13 4.707 4.708 4.707h5.138V25.77H4.631z" }) });
}
function w_() {
  return D.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 25 32", children: D.jsx("path", { d: "M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0 8 0 4.571 3.429 4.571 7.619v3.048H3.048A3.056 3.056 0 000 13.714v15.238A3.056 3.056 0 003.048 32h18.285a3.056 3.056 0 003.048-3.048V13.714a3.056 3.056 0 00-3.048-3.047zM12.19 24.533a3.056 3.056 0 01-3.047-3.047 3.056 3.056 0 013.047-3.048 3.056 3.056 0 013.048 3.048 3.056 3.056 0 01-3.048 3.047zm4.724-13.866H7.467V7.619c0-2.59 2.133-4.724 4.723-4.724 2.591 0 4.724 2.133 4.724 4.724v3.048z" }) });
}
function x_() {
  return D.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 25 32", children: D.jsx("path", { d: "M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0c-4.114 1.828-1.37 2.133.305 2.438 1.676.305 4.42 2.59 4.42 5.181v3.048H3.047A3.056 3.056 0 000 13.714v15.238A3.056 3.056 0 003.048 32h18.285a3.056 3.056 0 003.048-3.048V13.714a3.056 3.056 0 00-3.048-3.047zM12.19 24.533a3.056 3.056 0 01-3.047-3.047 3.056 3.056 0 013.047-3.048 3.056 3.056 0 013.048 3.048 3.056 3.056 0 01-3.048 3.047z" }) });
}
function qs({ children: t, className: r, ...i }) {
  return D.jsx("button", { type: "button", className: Ye(["react-flow__controls-button", r]), ...i, children: t });
}
const S_ = (t) => ({
  isInteractive: t.nodesDraggable || t.nodesConnectable || t.elementsSelectable,
  minZoomReached: t.transform[2] <= t.minZoom,
  maxZoomReached: t.transform[2] >= t.maxZoom,
  ariaLabelConfig: t.ariaLabelConfig
});
function Ug({ style: t, showZoom: r = !0, showFitView: i = !0, showInteractive: l = !0, fitViewOptions: u, onZoomIn: a, onZoomOut: f, onFitView: h, onInteractiveChange: p, className: m, children: v, position: g = "bottom-left", orientation: y = "vertical", "aria-label": x }) {
  const S = je(), { isInteractive: N, minZoomReached: k, maxZoomReached: E, ariaLabelConfig: A } = Me(S_, $e), { zoomIn: _, zoomOut: M, fitView: O } = gc(), j = () => {
    _(), a == null || a();
  }, H = () => {
    M(), f == null || f();
  }, G = () => {
    O(u), h == null || h();
  }, K = () => {
    S.setState({
      nodesDraggable: !N,
      nodesConnectable: !N,
      elementsSelectable: !N
    }), p == null || p(!N);
  }, ie = y === "horizontal" ? "horizontal" : "vertical";
  return D.jsxs(dr, { className: Ye(["react-flow__controls", ie, m]), position: g, style: t, "data-testid": "rf__controls", "aria-label": x ?? A["controls.ariaLabel"], children: [r && D.jsxs(D.Fragment, { children: [D.jsx(qs, { onClick: j, className: "react-flow__controls-zoomin", title: A["controls.zoomIn.ariaLabel"], "aria-label": A["controls.zoomIn.ariaLabel"], disabled: E, children: D.jsx(m_, {}) }), D.jsx(qs, { onClick: H, className: "react-flow__controls-zoomout", title: A["controls.zoomOut.ariaLabel"], "aria-label": A["controls.zoomOut.ariaLabel"], disabled: k, children: D.jsx(y_, {}) })] }), i && D.jsx(qs, { className: "react-flow__controls-fitview", onClick: G, title: A["controls.fitView.ariaLabel"], "aria-label": A["controls.fitView.ariaLabel"], children: D.jsx(v_, {}) }), l && D.jsx(qs, { className: "react-flow__controls-interactive", onClick: K, title: A["controls.interactive.ariaLabel"], "aria-label": A["controls.interactive.ariaLabel"], children: N ? D.jsx(x_, {}) : D.jsx(w_, {}) }), v] });
}
Ug.displayName = "Controls";
const __ = q.memo(Ug);
function E_({ id: t, x: r, y: i, width: l, height: u, style: a, color: f, strokeColor: h, strokeWidth: p, className: m, borderRadius: v, shapeRendering: g, selected: y, onClick: x }) {
  const { background: S, backgroundColor: N } = a || {}, k = f || S || N;
  return D.jsx("rect", { className: Ye(["react-flow__minimap-node", { selected: y }, m]), x: r, y: i, rx: v, ry: v, width: l, height: u, style: {
    fill: k,
    stroke: h,
    strokeWidth: p
  }, shapeRendering: g, onClick: x ? (E) => x(E, t) : void 0 });
}
const k_ = q.memo(E_), N_ = (t) => t.nodes.map((r) => r.id), Da = (t) => t instanceof Function ? t : () => t;
function C_({
  nodeStrokeColor: t,
  nodeColor: r,
  nodeClassName: i = "",
  nodeBorderRadius: l = 5,
  nodeStrokeWidth: u,
  /*
   * We need to rename the prop to be `CapitalCase` so that JSX will render it as
   * a component properly.
   */
  nodeComponent: a = k_,
  onClick: f
}) {
  const h = Me(N_, $e), p = Da(r), m = Da(t), v = Da(i), g = typeof window > "u" || window.chrome ? "crispEdges" : "geometricPrecision";
  return D.jsx(D.Fragment, { children: h.map((y) => (
    /*
     * The split of responsibilities between MiniMapNodes and
     * NodeComponentWrapper may appear weird. However, it’s designed to
     * minimize the cost of updates when individual nodes change.
     *
     * For more details, see a similar commit in `NodeRenderer/index.tsx`.
     */
    D.jsx(P_, { id: y, nodeColorFunc: p, nodeStrokeColorFunc: m, nodeClassNameFunc: v, nodeBorderRadius: l, nodeStrokeWidth: u, NodeComponent: a, onClick: f, shapeRendering: g }, y)
  )) });
}
function M_({ id: t, nodeColorFunc: r, nodeStrokeColorFunc: i, nodeClassNameFunc: l, nodeBorderRadius: u, nodeStrokeWidth: a, shapeRendering: f, NodeComponent: h, onClick: p }) {
  const { node: m, x: v, y: g, width: y, height: x } = Me((S) => {
    const { internals: N } = S.nodeLookup.get(t), k = N.userNode, { x: E, y: A } = N.positionAbsolute, { width: _, height: M } = mn(k);
    return {
      node: k,
      x: E,
      y: A,
      width: _,
      height: M
    };
  }, $e);
  return !m || m.hidden || !Wp(m) ? null : D.jsx(h, { x: v, y: g, width: y, height: x, style: m.style, selected: !!m.selected, className: l(m), color: r(m), borderRadius: u, strokeColor: i(m), strokeWidth: a, shapeRendering: f, onClick: p, id: m.id });
}
const P_ = q.memo(M_);
var T_ = q.memo(C_);
const z_ = 200, I_ = 150, L_ = (t) => !t.hidden, A_ = (t) => {
  const r = {
    x: -t.transform[0] / t.transform[2],
    y: -t.transform[1] / t.transform[2],
    width: t.width / t.transform[2],
    height: t.height / t.transform[2]
  };
  return {
    viewBB: r,
    boundingRect: t.nodeLookup.size > 0 ? Up(xi(t.nodeLookup, { filter: L_ }), r) : r,
    rfId: t.rfId,
    panZoom: t.panZoom,
    translateExtent: t.translateExtent,
    flowWidth: t.width,
    flowHeight: t.height,
    ariaLabelConfig: t.ariaLabelConfig
  };
}, R_ = "react-flow__minimap-desc";
function Wg({
  style: t,
  className: r,
  nodeStrokeColor: i,
  nodeColor: l,
  nodeClassName: u = "",
  nodeBorderRadius: a = 5,
  nodeStrokeWidth: f,
  /*
   * We need to rename the prop to be `CapitalCase` so that JSX will render it as
   * a component properly.
   */
  nodeComponent: h,
  bgColor: p,
  maskColor: m,
  maskStrokeColor: v,
  maskStrokeWidth: g,
  position: y = "bottom-right",
  onClick: x,
  onNodeClick: S,
  pannable: N = !1,
  zoomable: k = !1,
  ariaLabel: E,
  inversePan: A,
  zoomStep: _ = 1,
  offsetScale: M = 5
}) {
  const O = je(), j = q.useRef(null), { boundingRect: H, viewBB: G, rfId: K, panZoom: ie, translateExtent: X, flowWidth: b, flowHeight: Z, ariaLabelConfig: z } = Me(A_, $e), Y = (t == null ? void 0 : t.width) ?? z_, F = (t == null ? void 0 : t.height) ?? I_, U = H.width / Y, T = H.height / F, I = Math.max(U, T), V = I * Y, C = I * F, R = M * I, te = H.x - (V - H.width) / 2 - R, ee = H.y - (C - H.height) / 2 - R, le = V + R * 2, ue = C + R * 2, ae = `${R_}-${K}`, J = q.useRef(0), ce = q.useRef();
  J.current = I, q.useEffect(() => {
    if (j.current && ie)
      return ce.current = Zx({
        domNode: j.current,
        panZoom: ie,
        getTransform: () => O.getState().transform,
        getViewScale: () => J.current
      }), () => {
        var ye;
        (ye = ce.current) == null || ye.destroy();
      };
  }, [ie]), q.useEffect(() => {
    var ye;
    (ye = ce.current) == null || ye.update({
      translateExtent: X,
      width: b,
      height: Z,
      inversePan: A,
      pannable: N,
      zoomStep: _,
      zoomable: k
    });
  }, [N, k, A, _, X, b, Z]);
  const xe = x ? (ye) => {
    var Ce;
    const [Ne, Ie] = ((Ce = ce.current) == null ? void 0 : Ce.pointer(ye)) || [0, 0];
    x(ye, { x: Ne, y: Ie });
  } : void 0, _e = S ? q.useCallback((ye, Ne) => {
    const Ie = O.getState().nodeLookup.get(Ne).internals.userNode;
    S(ye, Ie);
  }, []) : void 0, Se = E ?? z["minimap.ariaLabel"];
  return D.jsx(dr, { position: y, style: {
    ...t,
    "--xy-minimap-background-color-props": typeof p == "string" ? p : void 0,
    "--xy-minimap-mask-background-color-props": typeof m == "string" ? m : void 0,
    "--xy-minimap-mask-stroke-color-props": typeof v == "string" ? v : void 0,
    "--xy-minimap-mask-stroke-width-props": typeof g == "number" ? g * I : void 0,
    "--xy-minimap-node-background-color-props": typeof l == "string" ? l : void 0,
    "--xy-minimap-node-stroke-color-props": typeof i == "string" ? i : void 0,
    "--xy-minimap-node-stroke-width-props": typeof f == "number" ? f : void 0
  }, className: Ye(["react-flow__minimap", r]), "data-testid": "rf__minimap", children: D.jsxs("svg", { width: Y, height: F, viewBox: `${te} ${ee} ${le} ${ue}`, className: "react-flow__minimap-svg", role: "img", "aria-labelledby": ae, ref: j, onClick: xe, children: [Se && D.jsx("title", { id: ae, children: Se }), D.jsx(T_, { onClick: _e, nodeColor: l, nodeStrokeColor: i, nodeBorderRadius: a, nodeClassName: u, nodeStrokeWidth: f, nodeComponent: h }), D.jsx("path", { className: "react-flow__minimap-mask", d: `M${te - R},${ee - R}h${le + R * 2}v${ue + R * 2}h${-le - R * 2}z
        M${G.x},${G.y}h${G.width}v${G.height}h${-G.width}z`, fillRule: "evenodd", pointerEvents: "none" })] }) });
}
Wg.displayName = "MiniMap";
const D_ = q.memo(Wg), $_ = (t) => (r) => t ? `${Math.max(1 / r.transform[2], 1)}` : void 0, j_ = {
  [lo.Line]: "right",
  [lo.Handle]: "bottom-right"
};
function F_({ nodeId: t, position: r, variant: i = lo.Handle, className: l, style: u = void 0, children: a, color: f, minWidth: h = 10, minHeight: p = 10, maxWidth: m = Number.MAX_VALUE, maxHeight: v = Number.MAX_VALUE, keepAspectRatio: g = !1, resizeDirection: y, autoScale: x = !0, shouldResize: S, onResizeStart: N, onResize: k, onResizeEnd: E }) {
  const A = Sg(), _ = typeof t == "string" ? t : A, M = je(), O = q.useRef(null), j = i === lo.Handle, H = Me(q.useCallback($_(j && x), [j, x]), $e), G = q.useRef(null), K = r ?? j_[i];
  q.useEffect(() => {
    if (!(!O.current || !_))
      return G.current || (G.current = d1({
        domNode: O.current,
        nodeId: _,
        getStoreItems: () => {
          const { nodeLookup: X, transform: b, snapGrid: Z, snapToGrid: z, nodeOrigin: Y, domNode: F } = M.getState();
          return {
            nodeLookup: X,
            transform: b,
            snapGrid: Z,
            snapToGrid: z,
            nodeOrigin: Y,
            paneDomNode: F
          };
        },
        onChange: (X, b) => {
          const { triggerNodeChanges: Z, nodeLookup: z, parentLookup: Y, nodeOrigin: F } = M.getState(), U = [], T = { x: X.x, y: X.y }, I = z.get(_);
          if (I && I.expandParent && I.parentId) {
            const V = I.origin ?? F, C = X.width ?? I.measured.width ?? 0, R = X.height ?? I.measured.height ?? 0, te = {
              id: I.id,
              parentId: I.parentId,
              rect: {
                width: C,
                height: R,
                ...Yp({
                  x: X.x ?? I.position.x,
                  y: X.y ?? I.position.y
                }, { width: C, height: R }, I.parentId, z, V)
              }
            }, ee = pc([te], z, Y, F);
            U.push(...ee), T.x = X.x ? Math.max(V[0] * C, X.x) : void 0, T.y = X.y ? Math.max(V[1] * R, X.y) : void 0;
          }
          if (T.x !== void 0 && T.y !== void 0) {
            const V = {
              id: _,
              type: "position",
              position: { ...T }
            };
            U.push(V);
          }
          if (X.width !== void 0 && X.height !== void 0) {
            const C = {
              id: _,
              type: "dimensions",
              resizing: !0,
              setAttributes: y ? y === "horizontal" ? "width" : "height" : !0,
              dimensions: {
                width: X.width,
                height: X.height
              }
            };
            U.push(C);
          }
          for (const V of b) {
            const C = {
              ...V,
              type: "position"
            };
            U.push(C);
          }
          Z(U);
        },
        onEnd: ({ width: X, height: b }) => {
          const Z = {
            id: _,
            type: "dimensions",
            resizing: !1,
            dimensions: {
              width: X,
              height: b
            }
          };
          M.getState().triggerNodeChanges([Z]);
        }
      })), G.current.update({
        controlPosition: K,
        boundaries: {
          minWidth: h,
          minHeight: p,
          maxWidth: m,
          maxHeight: v
        },
        keepAspectRatio: g,
        resizeDirection: y,
        onResizeStart: N,
        onResize: k,
        onResizeEnd: E,
        shouldResize: S
      }), () => {
        var X;
        (X = G.current) == null || X.destroy();
      };
  }, [
    K,
    h,
    p,
    m,
    v,
    g,
    N,
    k,
    E,
    S
  ]);
  const ie = K.split("-");
  return D.jsx("div", { className: Ye(["react-flow__resize-control", "nodrag", ...ie, i, l]), ref: O, style: {
    ...u,
    scale: H,
    ...f && { [j ? "backgroundColor" : "borderColor"]: f }
  }, children: a });
}
q.memo(F_);
const tp = (t) => {
  let r;
  const i = /* @__PURE__ */ new Set(), l = (m, v) => {
    const g = typeof m == "function" ? m(r) : m;
    if (!Object.is(g, r)) {
      const y = r;
      r = v ?? (typeof g != "object" || g === null) ? g : Object.assign({}, r, g), i.forEach((x) => x(r, y));
    }
  }, u = () => r, h = { setState: l, getState: u, getInitialState: () => p, subscribe: (m) => (i.add(m), () => i.delete(m)) }, p = r = t(l, u, h);
  return h;
}, Yg = ((t) => t ? tp(t) : tp), O_ = (t) => t;
function H_(t, r = O_) {
  const i = Gr.useSyncExternalStore(
    t.subscribe,
    Gr.useCallback(() => r(t.getState()), [t, r]),
    Gr.useCallback(() => r(t.getInitialState()), [t, r])
  );
  return Gr.useDebugValue(i), i;
}
const V_ = (t) => {
  const r = Yg(t), i = (l) => H_(r, l);
  return Object.assign(i, r), i;
}, B_ = ((t) => V_);
var np = (t, r, i) => (u, a) => ({
  pastStates: (i == null ? void 0 : i.pastStates) || [],
  futureStates: (i == null ? void 0 : i.futureStates) || [],
  undo: (f = 1) => {
    var h, p;
    if (a().pastStates.length) {
      const m = ((h = i == null ? void 0 : i.partialize) == null ? void 0 : h.call(i, r())) || r(), v = a().pastStates.splice(-f, f), g = v.shift();
      t(g), u({
        pastStates: a().pastStates,
        futureStates: a().futureStates.concat(
          ((p = i == null ? void 0 : i.diff) == null ? void 0 : p.call(i, m, g)) || m,
          v.reverse()
        )
      });
    }
  },
  redo: (f = 1) => {
    var h, p;
    if (a().futureStates.length) {
      const m = ((h = i == null ? void 0 : i.partialize) == null ? void 0 : h.call(i, r())) || r(), v = a().futureStates.splice(-f, f), g = v.shift();
      t(g), u({
        pastStates: a().pastStates.concat(
          ((p = i == null ? void 0 : i.diff) == null ? void 0 : p.call(i, m, g)) || m,
          v.reverse()
        ),
        futureStates: a().futureStates
      });
    }
  },
  clear: () => u({ pastStates: [], futureStates: [] }),
  isTracking: !0,
  pause: () => u({ isTracking: !1 }),
  resume: () => u({ isTracking: !0 }),
  setOnSave: (f) => u({ _onSave: f }),
  // Internal properties
  _onSave: i == null ? void 0 : i.onSave,
  _handleSet: (f, h, p, m) => {
    var v, g;
    i != null && i.limit && a().pastStates.length >= (i == null ? void 0 : i.limit) && a().pastStates.shift(), (g = (v = a())._onSave) == null || g.call(v, f, p), u({
      pastStates: a().pastStates.concat(m || f),
      futureStates: []
    });
  }
}), U_ = (t, r) => (l, u, a) => {
  var m, v;
  a.temporal = Yg(
    ((m = r == null ? void 0 : r.wrapTemporal) == null ? void 0 : m.call(r, np(l, u, r))) || np(l, u, r)
  );
  const f = ((v = r == null ? void 0 : r.handleSet) == null ? void 0 : v.call(
    r,
    a.temporal.getState()._handleSet
  )) || a.temporal.getState()._handleSet, h = (g) => {
    var S, N, k;
    if (!a.temporal.getState().isTracking) return;
    const y = ((S = r == null ? void 0 : r.partialize) == null ? void 0 : S.call(r, u())) || u(), x = (N = r == null ? void 0 : r.diff) == null ? void 0 : N.call(r, g, y);
    // If the user has provided a diff function but nothing has been changed, deltaState will be null
    x === null || // If the user has provided an equality function, use it
    (k = r == null ? void 0 : r.equality) != null && k.call(r, g, y) || f(
      g,
      void 0,
      y,
      x
    );
  }, p = a.setState;
  return a.setState = (...g) => {
    var x;
    const y = ((x = r == null ? void 0 : r.partialize) == null ? void 0 : x.call(r, u())) || u();
    p(...g), h(y);
  }, t(
    // Modify the set function to call the userlandSet function
    (...g) => {
      var x;
      const y = ((x = r == null ? void 0 : r.partialize) == null ? void 0 : x.call(r, u())) || u();
      l(...g), h(y);
    },
    u,
    a
  );
};
const W_ = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
let rp = (t = 21) => {
  let r = "", i = crypto.getRandomValues(new Uint8Array(t |= 0));
  for (; t--; )
    r += W_[i[t] & 63];
  return r;
};
const Ei = /* @__PURE__ */ new Map();
function $a(t) {
  Ei.set(t.manifest.type, t);
}
function Zr(t) {
  const r = Ei.get(t);
  if (!r) throw new Error(`Unknown module type: ${t}`);
  return r.manifest;
}
function Y_(t) {
  const r = Ei.get(t);
  if (!r) throw new Error(`Unknown module type: ${t}`);
  return r.factory;
}
function X_() {
  const t = {};
  for (const [r, i] of Ei)
    t[r] = i.component;
  return t;
}
function b_() {
  return Array.from(Ei.values()).map((t) => t.manifest);
}
const xt = B_()(
  U_(
    (t, r) => ({
      nodes: [],
      edges: [],
      onNodesChange: (i) => {
        t({
          nodes: gg(i, r().nodes)
        });
      },
      onEdgesChange: (i) => {
        t({
          edges: mg(i, r().edges)
        });
      },
      onConnect: (i) => {
        if (!i.source || !i.target || !i.sourceHandle || !i.targetHandle) return;
        const l = r().nodes.find((g) => g.id === i.source);
        if (!l) return;
        const a = Zr(l.type).ports.find(
          (g) => g.id === i.sourceHandle
        );
        if (!a) return;
        const f = r().nodes.find((g) => g.id === i.target);
        if (!f) return;
        const p = Zr(f.type).ports.find(
          (g) => g.id === i.targetHandle
        );
        if (!p || a.signalType !== p.signalType || a.direction !== "output" || p.direction !== "input" || i.source === i.target || r().edges.find(
          (g) => g.target === i.target && g.targetHandle === i.targetHandle
        )) return;
        const v = {
          id: rp(),
          source: i.source,
          sourceHandle: i.sourceHandle,
          target: i.target,
          targetHandle: i.targetHandle,
          type: a.signalType,
          data: {
            signalType: a.signalType,
            channelFormat: a.channelFormat
          }
        };
        t({ edges: [...r().edges, v] });
      },
      addModule: (i, l) => {
        const u = Zr(i);
        if (u.singleton) {
          const p = r().nodes.find((m) => m.type === i);
          if (p) return p.id;
        }
        const a = rp(), f = {};
        for (const p of u.parameters)
          f[p.id] = p.defaultValue;
        const h = {
          id: a,
          type: i,
          position: l ?? { x: 100, y: 100 },
          data: {
            label: u.label,
            parameters: f
          }
        };
        return t({ nodes: [...r().nodes, h] }), a;
      },
      removeModule: (i) => {
        const l = r().nodes.find((u) => u.id === i);
        l && Zr(l.type).singleton || t({
          nodes: r().nodes.filter((u) => u.id !== i),
          edges: r().edges.filter(
            (u) => u.source !== i && u.target !== i
          )
        });
      },
      updateParameter: (i, l, u) => {
        t({
          nodes: r().nodes.map(
            (a) => a.id === i ? {
              ...a,
              data: {
                ...a.data,
                parameters: {
                  ...a.data.parameters,
                  [l]: u
                }
              }
            } : a
          )
        });
      }
    }),
    {
      // Undo/redo config: exclude position-only changes
      limit: 100,
      partialize: (t) => ({
        nodes: t.nodes.map((r) => ({
          id: r.id,
          type: r.type,
          data: r.data
        })),
        edges: t.edges
      })
    }
  )
);
function Q_(t, r, i) {
  if (r === i || r === "mono" && i === "stereo") return null;
  const l = t.createChannelSplitter(2), u = t.createChannelMerger(1), a = t.createGain(), f = t.createGain();
  return a.gain.value = 0.707, f.gain.value = 0.707, l.connect(a, 0), l.connect(f, 1), a.connect(u, 0, 0), f.connect(u, 0, 0), { input: l, output: u };
}
function pl(t) {
  return t <= -70 ? 0 : Math.pow(10, t / 20);
}
class G_ {
  constructor() {
    br(this, "ctx", null);
    br(this, "processors", /* @__PURE__ */ new Map());
    br(this, "connections", /* @__PURE__ */ new Map());
    br(this, "prevNodes", []);
    br(this, "prevEdges", []);
  }
  get audioContext() {
    return this.ctx;
  }
  async initialize() {
    this.ctx = new AudioContext(), this.ctx.state === "suspended" && await this.ctx.resume();
  }
  /** Called on every store change to sync Web Audio with graph state */
  reconcile(r, i) {
    var h;
    if (!this.ctx) return;
    const l = new Set(r.map((p) => p.id));
    for (const p of this.prevNodes)
      l.has(p.id) || this.removeProcessor(p.id);
    const u = new Set(this.prevNodes.map((p) => p.id));
    for (const p of r)
      u.has(p.id) || this.createProcessor(p);
    for (const p of r) {
      const m = this.prevNodes.find((v) => v.id === p.id);
      if (m)
        for (const [v, g] of Object.entries(p.data.parameters))
          m.data.parameters[v] !== g && ((h = this.processors.get(p.id)) == null || h.setParameter(
            v,
            g,
            this.ctx.currentTime
          ));
    }
    const a = new Set(i.map((p) => p.id));
    for (const p of this.prevEdges)
      a.has(p.id) || this.removeConnection(p.id);
    const f = new Set(this.prevEdges.map((p) => p.id));
    for (const p of i)
      f.has(p.id) || this.createConnection(p, r);
    this.prevNodes = r, this.prevEdges = i;
  }
  createProcessor(r) {
    if (!(!this.ctx || !r.type))
      try {
        const l = Y_(r.type).create(this.ctx, r.data.parameters);
        this.processors.set(r.id, l);
      } catch (i) {
        console.warn(`Failed to create processor for ${r.type}:`, i);
      }
  }
  removeProcessor(r) {
    for (const [l] of this.connections) {
      const u = this.prevEdges.find((a) => a.id === l);
      u && (u.source === r || u.target === r) && this.removeConnection(l);
    }
    const i = this.processors.get(r);
    i && (i.dispose(), this.processors.delete(r));
  }
  createConnection(r, i) {
    if (!this.ctx) return;
    const l = this.processors.get(r.source), u = this.processors.get(r.target);
    if (!l || !u) return;
    const a = l.outputs[r.sourceHandle], f = u.inputs[r.targetHandle];
    if (!(!a || !f)) {
      if (r.data.signalType === "parameter" && f instanceof AudioParam)
        a.connect(f), this.connections.set(r.id, {
          gate: null,
          from: a,
          to: f
        });
      else if (f instanceof AudioNode) {
        const h = i.find((x) => x.id === r.source), p = i.find((x) => x.id === r.target);
        if (!h || !p) return;
        let m = r.data.channelFormat, v = r.data.channelFormat;
        try {
          const S = Zr(h.type).ports.find((E) => E.id === r.sourceHandle);
          S && (m = S.channelFormat);
          const k = Zr(p.type).ports.find((E) => E.id === r.targetHandle);
          k && (v = k.channelFormat);
        } catch {
        }
        const g = Q_(this.ctx, m, v), y = this.ctx.createGain();
        y.gain.value = 0, g ? (a.connect(y), y.connect(g.input), g.output.connect(f)) : (a.connect(y), y.connect(f)), y.gain.setTargetAtTime(1, this.ctx.currentTime, 0.02), this.connections.set(r.id, { gate: y, from: a, to: f, adapter: g ?? void 0 });
      }
    }
  }
  removeConnection(r) {
    const i = this.connections.get(r);
    if (i)
      if (i.disconnectTimer && clearTimeout(i.disconnectTimer), i.to instanceof AudioParam) {
        try {
          i.from.disconnect(i.to);
        } catch {
        }
        this.connections.delete(r);
      } else i.gate && this.ctx ? (i.gate.gain.setTargetAtTime(0, this.ctx.currentTime, 0.02), i.disconnectTimer = setTimeout(() => {
        try {
          i.from.disconnect(i.gate), i.gate.disconnect(), i.adapter && (i.adapter.input.disconnect(), i.adapter.output.disconnect());
        } catch {
        }
        this.connections.delete(r);
      }, 80)) : this.connections.delete(r);
  }
  dispose() {
    var r;
    for (const i of this.connections.keys())
      this.removeConnection(i);
    for (const i of this.processors.keys()) {
      const l = this.processors.get(i);
      l == null || l.dispose();
    }
    this.processors.clear(), this.connections.clear(), (r = this.ctx) == null || r.close(), this.ctx = null;
  }
}
function K_() {
  const t = q.useRef(null), r = q.useRef(!1);
  t.current || (t.current = new G_());
  const i = q.useCallback(async () => {
    if (r.current) return;
    const l = t.current;
    await l.initialize(), r.current = !0;
    const { nodes: u, edges: a } = xt.getState();
    l.reconcile(u, a);
  }, []);
  return q.useEffect(() => {
    const l = xt.subscribe((u) => {
      r.current && t.current && t.current.reconcile(u.nodes, u.edges);
    });
    return () => {
      var u;
      l(), (u = t.current) == null || u.dispose(), t.current = null, r.current = !1;
    };
  }, []), {
    initialize: i,
    get audioContext() {
      var l;
      return ((l = t.current) == null ? void 0 : l.audioContext) ?? null;
    }
  };
}
function q_({
  id: t,
  sourceX: r,
  sourceY: i,
  targetX: l,
  targetY: u,
  sourcePosition: a,
  targetPosition: f,
  data: h
}) {
  const [p] = _l({
    sourceX: r,
    sourceY: i,
    targetX: l,
    targetY: u,
    sourcePosition: a,
    targetPosition: f
  }), m = (h == null ? void 0 : h.channelFormat) === "stereo";
  return /* @__PURE__ */ D.jsx(
    uo,
    {
      id: t,
      path: p,
      className: `daw-edge daw-edge--audio ${m ? "daw-edge--stereo" : "daw-edge--mono"}`
    }
  );
}
function Z_({
  id: t,
  sourceX: r,
  sourceY: i,
  targetX: l,
  targetY: u,
  sourcePosition: a,
  targetPosition: f
}) {
  const [h] = _l({
    sourceX: r,
    sourceY: i,
    targetX: l,
    targetY: u,
    sourcePosition: a,
    targetPosition: f
  });
  return /* @__PURE__ */ D.jsx(
    uo,
    {
      id: t,
      path: h,
      className: "daw-edge daw-edge--parameter"
    }
  );
}
const J_ = {
  audio: q_,
  parameter: Z_
};
function eE() {
  const t = xt((i) => i.addModule), r = b_().filter((i) => !i.singleton);
  return /* @__PURE__ */ D.jsxs("div", { className: "daw-module-panel", children: [
    /* @__PURE__ */ D.jsx("h3", { className: "daw-module-panel__title", children: "Add Module" }),
    /* @__PURE__ */ D.jsx("div", { className: "daw-module-panel__list", children: r.map((i) => /* @__PURE__ */ D.jsx(
      "button",
      {
        className: "daw-module-panel__btn",
        onClick: () => t(i.type, { x: 200 + Math.random() * 200, y: 100 + Math.random() * 200 }),
        children: i.label
      },
      i.type
    )) })
  ] });
}
function tE() {
  const t = xt.temporal;
  return q.useEffect(() => {
    const r = (i) => {
      (i.metaKey || i.ctrlKey) && (i.key === "z" && !i.shiftKey ? (i.preventDefault(), t.getState().undo()) : (i.key === "z" && i.shiftKey || i.key === "y" && !i.shiftKey) && (i.preventDefault(), t.getState().redo()));
    };
    return window.addEventListener("keydown", r), () => window.removeEventListener("keydown", r);
  }, [t]), {
    undo: () => t.getState().undo(),
    redo: () => t.getState().redo(),
    canUndo: () => t.getState().pastStates.length > 0,
    canRedo: () => t.getState().futureStates.length > 0
  };
}
function nE() {
  const { undo: t, redo: r, canUndo: i, canRedo: l } = tE();
  return /* @__PURE__ */ D.jsxs("div", { className: "daw-toolbar", children: [
    /* @__PURE__ */ D.jsx(
      "button",
      {
        className: "daw-toolbar__btn",
        onClick: t,
        disabled: !i(),
        title: "Undo (Ctrl+Z)",
        children: /* @__PURE__ */ D.jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
          /* @__PURE__ */ D.jsx("path", { d: "M3 7v6h6" }),
          /* @__PURE__ */ D.jsx("path", { d: "M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" })
        ] })
      }
    ),
    /* @__PURE__ */ D.jsx(
      "button",
      {
        className: "daw-toolbar__btn",
        onClick: r,
        disabled: !l(),
        title: "Redo (Ctrl+Shift+Z)",
        children: /* @__PURE__ */ D.jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
          /* @__PURE__ */ D.jsx("path", { d: "M21 7v6h-6" }),
          /* @__PURE__ */ D.jsx("path", { d: "M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13" })
        ] })
      }
    )
  ] });
}
function rE() {
  const t = xt((v) => v.nodes), r = xt((v) => v.edges), i = xt((v) => v.onNodesChange), l = xt((v) => v.onEdgesChange), u = xt((v) => v.onConnect), { initialize: a } = K_(), [f, h] = q.useState(!1), p = q.useMemo(() => X_(), []), m = q.useCallback(async () => {
    await a(), h(!0);
  }, [a]);
  return /* @__PURE__ */ D.jsx("div", { className: "daw-canvas-container", children: /* @__PURE__ */ D.jsxs(
    c_,
    {
      nodes: t,
      edges: r,
      onNodesChange: i,
      onEdgesChange: l,
      onConnect: u,
      nodeTypes: p,
      edgeTypes: J_,
      fitView: !0,
      proOptions: { hideAttribution: !0 },
      children: [
        /* @__PURE__ */ D.jsx(g_, { variant: pn.Dots, gap: 20, size: 1 }),
        /* @__PURE__ */ D.jsx(D_, { pannable: !0, zoomable: !0, nodeStrokeWidth: 3 }),
        /* @__PURE__ */ D.jsx(__, {}),
        f && /* @__PURE__ */ D.jsx(dr, { position: "top-left", children: /* @__PURE__ */ D.jsx(eE, {}) }),
        f && /* @__PURE__ */ D.jsx(dr, { position: "top-right", children: /* @__PURE__ */ D.jsx(nE, {}) }),
        !f && /* @__PURE__ */ D.jsx(dr, { position: "top-center", children: /* @__PURE__ */ D.jsx("button", { className: "daw-start-audio", onClick: m, children: "Start Audio Engine" }) })
      ]
    }
  ) });
}
function oE() {
  return q.useEffect(() => {
    const { nodes: t, addModule: r } = xt.getState();
    t.some((i) => i.type === "master-output") || r("master-output", { x: 600, y: 200 });
  }, []), /* @__PURE__ */ D.jsx(Vg, { children: /* @__PURE__ */ D.jsxs("div", { className: "daw-app", children: [
    /* @__PURE__ */ D.jsxs("div", { className: "daw-header", children: [
      /* @__PURE__ */ D.jsx("h1", { className: "daw-title", children: "Modular DAW" }),
      /* @__PURE__ */ D.jsx("p", { className: "daw-subtitle", children: "Build audio signal chains by connecting modules with virtual patch cables." })
    ] }),
    /* @__PURE__ */ D.jsx(rE, {})
  ] }) });
}
const iE = {
  type: "master-output",
  label: "Master Output",
  category: "io",
  singleton: !0,
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
}, sE = {
  create(t, r) {
    const i = t.createGain();
    return i.gain.value = pl(r.volume ?? 0), i.connect(t.destination), {
      inputs: { in: i },
      outputs: {},
      setParameter(l, u, a) {
        l === "volume" && i.gain.setTargetAtTime(pl(u), a, 0.02);
      },
      dispose() {
        i.disconnect();
      }
    };
  }
};
function lE({ id: t, data: r }) {
  const i = xt((u) => u.updateParameter), l = r.parameters.volume ?? 0;
  return /* @__PURE__ */ D.jsxs("div", { className: "daw-node daw-node--io", children: [
    /* @__PURE__ */ D.jsx(hn, { type: "target", position: me.Left, id: "in", className: "daw-handle daw-handle--audio" }),
    /* @__PURE__ */ D.jsx("div", { className: "daw-node__header", children: "Master Output" }),
    /* @__PURE__ */ D.jsx("div", { className: "daw-node__body", children: /* @__PURE__ */ D.jsxs("label", { className: "daw-node__param", children: [
      /* @__PURE__ */ D.jsx("span", { className: "daw-node__param-label", children: "Vol" }),
      /* @__PURE__ */ D.jsx(
        "input",
        {
          type: "range",
          min: -70,
          max: 6,
          step: 0.1,
          value: l,
          onChange: (u) => i(t, "volume", parseFloat(u.target.value)),
          className: "daw-node__slider"
        }
      ),
      /* @__PURE__ */ D.jsxs("span", { className: "daw-node__param-value", children: [
        l.toFixed(1),
        " dB"
      ] })
    ] }) })
  ] });
}
const uE = {
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
}, qa = ["sine", "square", "sawtooth", "triangle"], aE = {
  create(t, r) {
    const i = t.createOscillator(), l = t.createGain();
    return l.gain.value = 1, i.frequency.value = r.frequency ?? 440, i.type = qa[r.waveform ?? 0] ?? "sine", i.connect(l), i.start(), {
      inputs: {},
      outputs: { out: l },
      setParameter(u, a, f) {
        u === "frequency" ? i.frequency.setTargetAtTime(a, f, 0.02) : u === "waveform" && (i.type = qa[Math.round(a)] ?? "sine");
      },
      dispose() {
        i.stop(), i.disconnect(), l.disconnect();
      }
    };
  }
};
function cE({ id: t, data: r }) {
  const i = xt((a) => a.updateParameter), l = r.parameters.frequency ?? 440, u = r.parameters.waveform ?? 0;
  return /* @__PURE__ */ D.jsxs("div", { className: "daw-node daw-node--generator", children: [
    /* @__PURE__ */ D.jsx("div", { className: "daw-node__header", children: "Test Tone" }),
    /* @__PURE__ */ D.jsxs("div", { className: "daw-node__body", children: [
      /* @__PURE__ */ D.jsxs("label", { className: "daw-node__param", children: [
        /* @__PURE__ */ D.jsx("span", { className: "daw-node__param-label", children: "Freq" }),
        /* @__PURE__ */ D.jsx(
          "input",
          {
            type: "range",
            min: 20,
            max: 2e3,
            step: 1,
            value: l,
            onChange: (a) => i(t, "frequency", parseFloat(a.target.value)),
            className: "daw-node__slider"
          }
        ),
        /* @__PURE__ */ D.jsxs("span", { className: "daw-node__param-value", children: [
          Math.round(l),
          " Hz"
        ] })
      ] }),
      /* @__PURE__ */ D.jsxs("div", { className: "daw-node__param", children: [
        /* @__PURE__ */ D.jsx("span", { className: "daw-node__param-label", children: "Wave" }),
        /* @__PURE__ */ D.jsx("div", { className: "daw-node__waveform-btns", children: qa.map((a, f) => /* @__PURE__ */ D.jsx(
          "button",
          {
            className: `daw-node__waveform-btn ${f === Math.round(u) ? "active" : ""}`,
            onClick: () => i(t, "waveform", f),
            children: a.slice(0, 3)
          },
          a
        )) })
      ] })
    ] }),
    /* @__PURE__ */ D.jsx(hn, { type: "source", position: me.Right, id: "out", className: "daw-handle daw-handle--audio" })
  ] });
}
const fE = {
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
}, dE = {
  create(t, r) {
    const i = t.createGain();
    return i.gain.value = pl(r.gain ?? 0), {
      inputs: {
        in: i,
        "gain-cv": i.gain
      },
      outputs: { out: i },
      setParameter(l, u, a) {
        l === "gain" && i.gain.setTargetAtTime(pl(u), a, 0.02);
      },
      dispose() {
        i.disconnect();
      }
    };
  }
};
function hE({ id: t, data: r }) {
  const i = xt((u) => u.updateParameter), l = r.parameters.gain ?? 0;
  return /* @__PURE__ */ D.jsxs("div", { className: "daw-node daw-node--utility", children: [
    /* @__PURE__ */ D.jsx(hn, { type: "target", position: me.Left, id: "in", className: "daw-handle daw-handle--audio" }),
    /* @__PURE__ */ D.jsx(
      hn,
      {
        type: "target",
        position: me.Bottom,
        id: "gain-cv",
        className: "daw-handle daw-handle--parameter"
      }
    ),
    /* @__PURE__ */ D.jsx("div", { className: "daw-node__header", children: "Gain" }),
    /* @__PURE__ */ D.jsx("div", { className: "daw-node__body", children: /* @__PURE__ */ D.jsxs("label", { className: "daw-node__param", children: [
      /* @__PURE__ */ D.jsx("span", { className: "daw-node__param-label", children: "Gain" }),
      /* @__PURE__ */ D.jsx(
        "input",
        {
          type: "range",
          min: -70,
          max: 12,
          step: 0.1,
          value: l,
          onChange: (u) => i(t, "gain", parseFloat(u.target.value)),
          className: "daw-node__slider"
        }
      ),
      /* @__PURE__ */ D.jsxs("span", { className: "daw-node__param-value", children: [
        l.toFixed(1),
        " dB"
      ] })
    ] }) }),
    /* @__PURE__ */ D.jsx(hn, { type: "source", position: me.Right, id: "out", className: "daw-handle daw-handle--audio" })
  ] });
}
function pE() {
  $a({
    manifest: iE,
    factory: sE,
    component: lE
  }), $a({
    manifest: uE,
    factory: aE,
    component: cE
  }), $a({
    manifest: fE,
    factory: dE,
    component: hE
  });
}
pE();
R0.createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ D.jsx(Gr.StrictMode, { children: /* @__PURE__ */ D.jsx(oE, {}) })
);
