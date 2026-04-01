(function () {
  var LOGIN = "RynDroste";
  var root = document.getElementById("github-sidebar");
  if (!root) return;

  var avatar = root.querySelector("[data-github-avatar]");
  var avatarLink = root.querySelector("[data-github-avatar-link]");
  var nameLink = root.querySelector("[data-github-name-link]");
  var nameSpan = root.querySelector("[data-github-name]");
  var loginEl = root.querySelector("[data-github-login]");
  var bioText = root.querySelector("[data-github-bio]");
  var bioPlaceholder = root.querySelector("[data-github-bio-placeholder]");
  var bioBlock = root.querySelector("[data-github-bio-block]");
  var errEl = root.querySelector("[data-github-error]");
  var reposEl = root.querySelector("[data-github-repos]");

  function setProfileUrl(url) {
    if (avatarLink) avatarLink.href = url;
    if (nameLink) nameLink.href = url;
    var cta = root.querySelector(".github-card-cta");
    if (cta) cta.href = url;
  }

  fetch("https://api.github.com/users/" + LOGIN)
    .then(function (res) {
      if (!res.ok) throw new Error("github api");
      return res.json();
    })
    .then(function (u) {
      var profileUrl = u.html_url || "https://github.com/" + LOGIN;
      setProfileUrl(profileUrl);

      if (avatar && u.avatar_url) {
        avatar.src = u.avatar_url;
        avatar.alt = "";
      }

      if (nameSpan) nameSpan.textContent = u.name || u.login || LOGIN;
      if (loginEl) loginEl.textContent = "@" + (u.login || LOGIN);

      var bio = (u.bio && String(u.bio).trim()) || "";
      if (bioText && bioPlaceholder && bioBlock) {
        if (bio) {
          bioText.textContent = bio;
          bioText.hidden = false;
          bioPlaceholder.hidden = true;
        } else {
          bioText.textContent = "";
          bioText.hidden = true;
          bioPlaceholder.hidden = false;
        }
      }

      if (reposEl && u.public_repos != null) reposEl.textContent = String(u.public_repos);
    })
    .catch(function () {
      if (errEl) errEl.classList.remove("visually-hidden");
      if (bioBlock) bioBlock.style.display = "none";
      var stats = root.querySelector(".github-card-stats");
      if (stats) stats.style.display = "none";
    });
})();
