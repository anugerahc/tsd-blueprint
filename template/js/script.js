(function () {
  // Capture raw mermaid source BEFORE mermaid replaces it — needed for Markdown export.
  document.querySelectorAll("pre.mermaid").forEach(function (el, i) {
    // innerHTML (not textContent) so literal <br/> tags round-trip as text, matching what mermaid itself parses.
    el.setAttribute("data-mermaid-source", el.innerHTML);
    el.setAttribute("data-mermaid-id", "mmd-" + i);
  });

  if (window.mermaid) {
    mermaid.initialize({
      startOnLoad: true,
      theme: "base",
      themeVariables: {
        primaryColor: "#e6f7ec",
        primaryTextColor: "#12331f",
        primaryBorderColor: "#1e9e5a",
        lineColor: "#1e9e5a",
        secondaryColor: "#fff8e6",
        tertiaryColor: "#fdecec",
        fontFamily: "Inter, Segoe UI, Arial, sans-serif"
      }
    });
  }

  var sidebar = document.querySelector(".sidebar");
  var toggle = document.querySelector(".menu-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      sidebar.classList.toggle("open");
    });
  }

  // ---------- Sidebar TOC groups (collapsible) ----------
  document.querySelectorAll(".toc-group-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var sub = btn.nextElementSibling;
      var expanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!expanded));
      if (sub) sub.classList.toggle("collapsed", expanded);
    });
  });

  function expandGroupOf(link) {
    var sub = link.closest(".toc-sub");
    if (!sub || !sub.classList.contains("collapsed")) return;
    sub.classList.remove("collapsed");
    var btn = sub.previousElementSibling;
    if (btn) btn.setAttribute("aria-expanded", "true");
  }

  var links = Array.prototype.slice.call(document.querySelectorAll(".toc a"));
  var sections = links
    .map(function (a) {
      return document.querySelector(a.getAttribute("href"));
    })
    .filter(Boolean);

  function onScroll() {
    var pos = window.scrollY + 120;
    var current = sections[0];
    sections.forEach(function (sec) {
      if (sec.offsetTop <= pos) current = sec;
    });
    links.forEach(function (a) {
      var isActive = a.getAttribute("href") === "#" + current.id;
      a.classList.toggle("active", isActive);
      if (isActive) expandGroupOf(a);
    });
  }
  window.addEventListener("scroll", onScroll);
  onScroll();

  links.forEach(function (a) {
    a.addEventListener("click", function () {
      sidebar.classList.remove("open");
    });
  });

  var printBtn = document.getElementById("btn-print");
  if (printBtn) printBtn.addEventListener("click", function () { window.print(); });

  var topBtn = document.getElementById("btn-top");
  if (topBtn) topBtn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // ---------- Scroll-in reveal animation ----------
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    document.querySelectorAll("main section").forEach(function (sec) { io.observe(sec); });
  } else {
    document.querySelectorAll("main section").forEach(function (sec) { sec.classList.add("in-view"); });
  }

  // ---------- Diagram zoom/pan lightbox ----------
  var overlay = document.createElement("div");
  overlay.className = "lightbox-overlay";
  overlay.innerHTML =
    '<div class="lightbox-toolbar">' +
    '<button data-act="out" title="Zoom out">-</button>' +
    '<button data-act="reset" title="Reset">1:1</button>' +
    '<button data-act="in" title="Zoom in">+</button>' +
    '<button data-act="close" title="Tutup (Esc)">✕</button>' +
    "</div>" +
    '<div class="lightbox-viewport"><div class="lightbox-stage"></div></div>' +
    '<div class="lightbox-hint">Scroll buat zoom · drag buat geser · Esc buat tutup</div>';
  document.body.appendChild(overlay);

  var stage = overlay.querySelector(".lightbox-stage");
  var viewport = overlay.querySelector(".lightbox-viewport");
  var scale = 1, panX = 0, panY = 0, dragging = false, lastX = 0, lastY = 0;

  function applyTransform() {
    stage.style.transform = "translate(" + panX + "px," + panY + "px) scale(" + scale + ")";
  }

  function openLightbox(svgEl) {
    stage.innerHTML = "";
    var clone = svgEl.cloneNode(true);
    clone.style.width = "";
    clone.style.height = "";
    stage.appendChild(clone);
    scale = 1; panX = 0; panY = 0;
    applyTransform();
    overlay.classList.add("open");
  }

  function closeLightbox() {
    overlay.classList.remove("open");
  }

  document.querySelectorAll(".diagram-card").forEach(function (card) {
    card.addEventListener("click", function () {
      var svg = card.querySelector("svg");
      if (svg) openLightbox(svg);
    });
  });

  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) closeLightbox();
  });
  overlay.querySelector('[data-act="close"]').addEventListener("click", closeLightbox);
  overlay.querySelector('[data-act="in"]').addEventListener("click", function () {
    scale = Math.min(scale * 1.25, 6);
    applyTransform();
  });
  overlay.querySelector('[data-act="out"]').addEventListener("click", function () {
    scale = Math.max(scale / 1.25, 0.3);
    applyTransform();
  });
  overlay.querySelector('[data-act="reset"]').addEventListener("click", function () {
    scale = 1; panX = 0; panY = 0;
    applyTransform();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && overlay.classList.contains("open")) closeLightbox();
  });

  viewport.addEventListener(
    "wheel",
    function (e) {
      if (!overlay.classList.contains("open")) return;
      e.preventDefault();
      var delta = e.deltaY > 0 ? 0.9 : 1.1;
      scale = Math.min(Math.max(scale * delta, 0.3), 6);
      applyTransform();
    },
    { passive: false }
  );

  viewport.addEventListener("mousedown", function (e) {
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
  });
  window.addEventListener("mousemove", function (e) {
    if (!dragging) return;
    panX += e.clientX - lastX;
    panY += e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    applyTransform();
  });
  window.addEventListener("mouseup", function () { dragging = false; });

  // ---------- Copy as Markdown ----------
  function textOf(el) {
    var clone = el.cloneNode(true);
    clone.querySelectorAll(".num").forEach(function (n) { n.remove(); });
    return inlineMd(clone).trim();
  }

  function inlineMd(node) {
    var out = "";
    node.childNodes.forEach(function (n) {
      if (n.nodeType === Node.TEXT_NODE) {
        out += n.textContent;
      } else if (n.nodeType === Node.ELEMENT_NODE) {
        var tag = n.tagName.toLowerCase();
        if (tag === "br") out += "\n";
        else if (tag === "strong" || tag === "b") out += "**" + inlineMd(n) + "**";
        else if (tag === "em" || tag === "i") out += "_" + inlineMd(n) + "_";
        else if (tag === "code") out += "`" + n.textContent + "`";
        else if (tag === "a") out += "[" + inlineMd(n) + "](" + n.getAttribute("href") + ")";
        else out += inlineMd(n);
      }
    });
    return out;
  }

  function tableToMd(table) {
    var rows = Array.prototype.slice.call(table.querySelectorAll("tr"));
    if (!rows.length) return "";
    var lines = rows.map(function (row) {
      var cells = Array.prototype.slice.call(row.querySelectorAll("th,td"));
      return "| " + cells.map(function (c) { return inlineMd(c).trim().replace(/\|/g, "\\|") || " "; }).join(" | ") + " |";
    });
    var colCount = rows[0].querySelectorAll("th,td").length;
    var sep = "| " + Array(colCount).fill("---").join(" | ") + " |";
    lines.splice(1, 0, sep);
    return lines.join("\n") + "\n\n";
  }

  function listToMd(list, ordered, depth) {
    depth = depth || 0;
    var pad = "  ".repeat(depth);
    var i = 0;
    var out = "";
    list.querySelectorAll(":scope > li").forEach(function (li) {
      i++;
      var marker = ordered ? i + "." : "-";
      var liClone = li.cloneNode(true);
      liClone.querySelectorAll("ul,ol").forEach(function (n) { n.remove(); });
      out += pad + marker + " " + inlineMd(liClone).trim() + "\n";
      var sub = li.querySelector(":scope > ul, :scope > ol");
      if (sub) out += listToMd(sub, sub.tagName.toLowerCase() === "ol", depth + 1);
    });
    return out;
  }

  function blockToMd(el) {
    var tag = el.tagName.toLowerCase();
    if (el.classList && el.classList.contains("top-actions")) return "";
    if (tag === "h2") return "## " + textOf(el) + "\n\n";
    if (tag === "h3") return "### " + textOf(el) + "\n\n";
    if (tag === "p") return textOf(el) + "\n\n";
    if (tag === "ul") return listToMd(el, false) + "\n";
    if (tag === "ol") return listToMd(el, true) + "\n";
    if (tag === "table") return tableToMd(el);
    if (tag === "pre") {
      if (el.classList.contains("mermaid")) {
        var src = el.getAttribute("data-mermaid-source") || "";
        src = src
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&quot;/g, '"')
          .replace(/&#0?39;/g, "'")
          .replace(/&amp;/g, "&");
        return "```mermaid\n" + src.trim() + "\n```\n\n";
      }
      return "```\n" + el.textContent.trim() + "\n```\n\n";
    }
    if (el.classList && el.classList.contains("callout")) {
      var label = el.querySelector(".label");
      var labelTxt = label ? "**" + textOf(label) + "**\n" : "";
      var body = el.cloneNode(true);
      var lbl = body.querySelector(".label");
      if (lbl) lbl.remove();
      var bodyTxt = inlineMd(body).trim();
      return "> " + labelTxt.replace(/\n$/, "") + (labelTxt ? "\n> " : "") + bodyTxt.replace(/\n/g, "\n> ") + "\n\n";
    }
    if (el.classList && el.classList.contains("diagram-card")) {
      var pre = el.querySelector("pre.mermaid");
      var cap = el.querySelector(".diagram-caption");
      var md = pre ? blockToMd(pre) : "";
      if (cap) md += "*" + textOf(cap) + "*\n\n";
      return md;
    }
    if (tag === "div" || tag === "section") {
      var out = "";
      el.childNodes.forEach(function (child) {
        if (child.nodeType === Node.ELEMENT_NODE) out += blockToMd(child);
      });
      return out;
    }
    return "";
  }

  function buildMarkdown() {
    var md = "";
    var coverTitle = document.querySelector(".cover h1");
    var coverTag = document.querySelector(".cover .doc-tag");
    var coverP = document.querySelector(".cover p");
    if (coverTag) md += "*" + textOf(coverTag) + "*\n\n";
    if (coverTitle) md += "# " + textOf(coverTitle) + "\n\n";
    if (coverP) md += textOf(coverP) + "\n\n";
    var metaItems = document.querySelectorAll(".cover .meta-item");
    if (metaItems.length) {
      md += "| Field | Value |\n| --- | --- |\n";
      metaItems.forEach(function (item) {
        var k = item.querySelector(".k"), v = item.querySelector(".v");
        if (k && v) md += "| " + textOf(k) + " | " + textOf(v) + " |\n";
      });
      md += "\n";
    }
    document.querySelectorAll("main > section").forEach(function (sec) {
      md += blockToMd(sec);
    });
    return md.replace(/\n{3,}/g, "\n\n").trim() + "\n";
  }

  var copyBtn = document.getElementById("btn-copy-md");
  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var md = buildMarkdown();
      var done = function () {
        var original = copyBtn.innerHTML;
        copyBtn.innerHTML = "✅ Copied!";
        setTimeout(function () { copyBtn.innerHTML = original; }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(md).then(done).catch(function () { fallbackCopy(md, done); });
      } else {
        fallbackCopy(md, done);
      }
    });
  }

  function fallbackCopy(text, done) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch (e) {}
    document.body.removeChild(ta);
    done();
  }
})();
