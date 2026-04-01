(function () {
  function stripFrontMatter(text) {
    if (text.slice(0, 3) !== "---") return text;
    var end = text.indexOf("\n---", 3);
    if (end === -1) return text;
    return text.slice(end + 4).replace(/^\s*\n/, "");
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
      }

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
          showProse(marked.parse(body));
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
