(function () {
  var KATEX_VER = "0.16.11";
  var KATEX_BASE = "https://cdn.jsdelivr.net/npm/katex@" + KATEX_VER + "/dist";

  var katexReady = null;

  function ensureKatex() {
    if (typeof window.renderMathInElement === "function") {
      return Promise.resolve();
    }
    if (katexReady) return katexReady;

    katexReady = new Promise(function (resolve, reject) {
      if (!document.querySelector("link[data-katex-css]")) {
        var link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = KATEX_BASE + "/katex.min.css";
        link.crossOrigin = "anonymous";
        link.setAttribute("data-katex-css", "");
        document.head.appendChild(link);
      }

      function loadAutoRender() {
        if (typeof window.renderMathInElement === "function") {
          resolve();
          return;
        }
        var ar = document.createElement("script");
        ar.src = KATEX_BASE + "/contrib/auto-render.min.js";
        ar.async = true;
        ar.crossOrigin = "anonymous";
        ar.onload = function () {
          resolve();
        };
        ar.onerror = function () {
          reject(new Error("katex-auto-render"));
        };
        document.head.appendChild(ar);
      }

      if (typeof window.katex !== "undefined") {
        loadAutoRender();
        return;
      }

      var core = document.createElement("script");
      core.src = KATEX_BASE + "/katex.min.js";
      core.async = true;
      core.crossOrigin = "anonymous";
      core.onload = loadAutoRender;
      core.onerror = function () {
        reject(new Error("katex-core"));
      };
      document.head.appendChild(core);
    });

    return katexReady;
  }

  function renderNoteMath(el) {
    if (!el || typeof window.renderMathInElement !== "function") return;
    window.renderMathInElement(el, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$", right: "$", display: false },
        { left: "\\(", right: "\\)", display: false },
        { left: "\\[", right: "\\]", display: true }
      ],
      ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code"],
      throwOnError: false
    });
  }

  function stripFrontMatter(text) {
    if (text.slice(0, 3) !== "---") return text;
    var end = text.indexOf("\n---", 3);
    if (end === -1) return text;
    return text.slice(end + 4).replace(/^\s*\n/, "");
  }

  /** Markdown treats _ as emphasis; strip $$…$$ before parse, then restore (KaTeX sees intact TeX). */
  function protectDisplayMath(text) {
    var blocks = [];
    var out = text.replace(/\$\$([\s\S]*?)\$\$/g, function (_, inner) {
      var n = blocks.length;
      blocks.push("$$" + inner + "$$");
      return "\n\n<!--CGNOTE_MATH_" + n + "-->\n\n";
    });
    return { text: out, blocks: blocks };
  }

  function restoreDisplayMath(html, blocks) {
    return html.replace(/<!--CGNOTE_MATH_(\d+)-->/g, function (_, d) {
      var n = parseInt(d, 10);
      return blocks[n] != null ? blocks[n] : "";
    });
  }

  function t(key) {
    if (typeof window.cgLabT === "function") return window.cgLabT(key) || "";
    return key === "noteLoading"
      ? "Loading notes…"
      : key === "noteError"
        ? "Could not load notes."
        : key === "noteEmpty"
          ? "No notes yet. Edit the Markdown file in /notes."
          : "";
  }

  function clearWikiTocHeadings(proseEl) {
    var article = proseEl && proseEl.closest("article");
    if (!article) return;
    var tocList = article.querySelector("[data-wiki-toc-list]");
    if (tocList) tocList.innerHTML = "";
  }

  function ensureHeadingIds(proseEl) {
    var used = Object.create(null);
    proseEl.querySelectorAll("h1, h2, h3, h4").forEach(function (h, i) {
      if (h.id) {
        used[h.id] = true;
        return;
      }
      var base = "wiki-heading-" + i;
      var id = base;
      var n = 0;
      while (used[id]) {
        n += 1;
        id = base + "-" + n;
      }
      h.id = id;
      used[id] = true;
    });
  }

  function wikiTocToggleLabels(expanded) {
    var expand = typeof window.cgLabT === "function" ? window.cgLabT("wikiTocExpand") : "";
    var collapse = typeof window.cgLabT === "function" ? window.cgLabT("wikiTocCollapse") : "";
    if (!expand) expand = "Expand section";
    if (!collapse) collapse = "Collapse section";
    return expanded ? collapse : expand;
  }

  function fillWikiTocFromProse(proseEl) {
    var article = proseEl.closest("article");
    if (!article) return;
    var tocList = article.querySelector("[data-wiki-toc-list]");
    if (!tocList) return;
    tocList.innerHTML = "";

    var headings = [];
    proseEl.querySelectorAll("h1, h2, h3, h4").forEach(function (h) {
      if (!h.id) return;
      var depth = parseInt(h.tagName.slice(1), 10);
      if (depth < 1 || depth > 6) return;
      headings.push({
        depth: depth,
        id: h.id,
        text: h.textContent.replace(/\s+/g, " ").trim()
      });
    });

    if (headings.length === 0) return;

    var stack = [{ depth: 0, ul: tocList }];

    headings.forEach(function (item, idx) {
      var d = item.depth;
      while (stack.length > 1 && stack[stack.length - 1].depth >= d) {
        stack.pop();
      }
      var parentUl = stack[stack.length - 1].ul;

      var li = document.createElement("li");
      li.className = "wiki-toc-branch wiki-toc-depth-" + d;

      var row = document.createElement("div");
      row.className = "wiki-toc-row";

      var next = headings[idx + 1];
      var hasChildren = next && next.depth > d;

      var nestedUl = null;
      if (hasChildren) {
        nestedUl = document.createElement("ul");
        nestedUl.className = "wiki-toc-nested";

        var toggle = document.createElement("button");
        toggle.type = "button";
        toggle.className = "wiki-toc-toggle";
        toggle.setAttribute("aria-expanded", "true");
        toggle.setAttribute("aria-label", wikiTocToggleLabels(true));
        var chev = document.createElement("span");
        chev.className = "wiki-toc-chevron";
        chev.setAttribute("aria-hidden", "true");
        toggle.appendChild(chev);

        toggle.addEventListener("click", function (ev) {
          ev.preventDefault();
          ev.stopPropagation();
          var open = toggle.getAttribute("aria-expanded") === "true";
          var newOpen = !open;
          toggle.setAttribute("aria-expanded", newOpen ? "true" : "false");
          toggle.setAttribute("aria-label", wikiTocToggleLabels(newOpen));
          nestedUl.hidden = !newOpen;
          li.classList.toggle("wiki-toc-branch--collapsed", !newOpen);
        });

        row.appendChild(toggle);
      } else {
        var spacer = document.createElement("span");
        spacer.className = "wiki-toc-toggle-spacer";
        spacer.setAttribute("aria-hidden", "true");
        row.appendChild(spacer);
      }

      var a = document.createElement("a");
      a.href = "#" + item.id;
      a.textContent = item.text;
      row.appendChild(a);

      li.appendChild(row);

      if (hasChildren && nestedUl) {
        li.appendChild(nestedUl);
        stack.push({ depth: d, ul: nestedUl });
      }

      parentUl.appendChild(li);
    });
  }

  function run() {
    if (typeof marked === "undefined" || !marked.parse) return;

    marked.setOptions({
      mangle: false,
      headerIds: true,
      breaks: true
    });

    document.querySelectorAll("[data-note-md]").forEach(function (el) {
      var src = el.getAttribute("data-note-md");
      if (!src) return;

      var section = el.closest("section#note");
      var status = section && section.querySelector(".work-note-status");

      function showStatus(msg) {
        clearWikiTocHeadings(el);
        if (status) {
          status.textContent = msg;
          status.hidden = false;
        }
        el.setAttribute("hidden", "");
      }

      function showProse(html) {
        el.innerHTML = html;
        el.removeAttribute("hidden");
        if (status) status.hidden = true;
        ensureHeadingIds(el);
        fillWikiTocFromProse(el);
      }

      clearWikiTocHeadings(el);
      if (status) status.textContent = t("noteLoading");

      fetch(src)
        .then(function (res) {
          if (!res.ok) throw new Error("fetch");
          return res.text();
        })
        .then(function (text) {
          var body = stripFrontMatter(text).trim();
          if (!body) {
            showStatus(t("noteEmpty"));
            return;
          }
          var pm = protectDisplayMath(body);
          showProse(restoreDisplayMath(marked.parse(pm.text), pm.blocks));
          return ensureKatex()
            .then(function () {
              renderNoteMath(el);
            })
            .catch(function () {
              /* prose still visible without math */
            });
        })
        .catch(function () {
          showStatus(t("noteError"));
        });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
