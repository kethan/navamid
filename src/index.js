import { parse } from "regexparam";

export default function Navamid(base, on404, onErr = () => {}) {
  var rgx,
    curr,
    routes = [],
    req = { url: {}, params: {} },
    $ = {},
    res = {
      redirect: (uri, replace) => $.route(uri, replace)
    },
    hns = [];

  var fmt = ($.format = function (uri) {
    if (!uri) return uri;
    uri = "/" + uri.replace(/^\/|\/$/g, "");
    return rgx.test(uri) && uri.replace(rgx, "/");
  });

  base = "/" + (base || "").replace(/^\/|\/$/g, "");
  rgx = base == "/" ? /^\/+/ : new RegExp("^\\" + base + "(?=\\/|$)\\/?", "i");

  $.route = function (uri, replace) {
    if (uri[0] == "/" && !rgx.test(uri)) uri = base + uri;
    history[(uri === curr || replace ? "replace" : "push") + "State"](
      uri,
      null,
      uri
    );
  };

  $.use = function (...h) {
    hns = [...hns, ...h];
    return $;
  };

  $.on = function (pat, ...fns) {
    (pat = parse(pat)).fns = [...fns];
    routes.push(pat);
    return $;
  };

  $.run = function (uri) {
    var i = 0,
      params = {},
      arr,
      obj;
    if ((uri = fmt(uri || location.pathname))) {
      uri = uri.match(/[^\?#]*/)[0];
      for (curr = uri; i < routes.length; i++) {
        if ((arr = (obj = routes[i]).pattern.exec(uri))) {
          for (i = 0; i < obj.keys.length;) {
            params[obj.keys[i]] = arr[++i] || null;
          }
          obj.fns = [...hns, ...obj.fns];
          let mRun = (rReq, rRes) => {
            try {
              let mid = obj.fns.shift();
              mid
                ? mid(rReq, rRes, (err) =>
                  err ? onErr(err, rReq, rRes) : mRun(rReq, rRes)
                )
                : onErr(null, rReq, rRes);
            } catch (error) {
              onErr(error, rReq, rRes);
            }
          };
          req.params = params;
          req.url = uri;
          mRun(req, res);
          return $;
        }
      }
      if (on404) on404(uri, req, res);
    }
    return $;
  };

  $.listen = function (u) {
    wrap("push");
    wrap("replace");

    function run(e) {
      $.run();
    }

    function click(e) {
      var x = e.target.closest("a"),
        y = x && x.getAttribute("href");
      if (
        e.ctrlKey ||
        e.metaKey ||
        e.altKey ||
        e.shiftKey ||
        e.button ||
        e.defaultPrevented
      )
        return;
      if (!y || x.target || x.host !== location.host || y[0] == "#") return;
      if (y[0] != "/" || rgx.test(y)) {
        e.preventDefault();
        $.route(y);
      }
    }

    addEventListener("popstate", run);
    addEventListener("replacestate", run);
    addEventListener("pushstate", run);
    addEventListener("click", click);

    $.unlisten = function () {
      removeEventListener("popstate", run);
      removeEventListener("replacestate", run);
      removeEventListener("pushstate", run);
      removeEventListener("click", click);
    };

    return $.run(u);
  };

  return $;
}

function wrap(type, fn) {
  if (history[type]) return;
  history[type] = type;
  fn = history[(type += "State")];
  history[type] = function (uri) {
    var ev = new Event(type.toLowerCase());
    ev.uri = uri;
    fn.apply(this, arguments);
    return dispatchEvent(ev);
  };
}