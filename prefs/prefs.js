// Bind known-object to storage
let known;

function setting_change(ev) {
  known[ev.target.name] = ev.target.checked;
  browser.storage.sync.set({known});
}

function on_storage_change(changes, area) {
  if (area === "sync" && changes.known) {
    for (let key in changes.known.newValue) {
      known[key] = changes.known.newValue[key];
    }
  }
}

browser.storage.sync.get("known").then(res => {
  if (res.known) {
    // Populate popup dialog with providers and their enabled states
    const root = document.getElementById("engines");

    known = res.known;
    for (let key in known) {
      const label = document.createElement("label");

      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.id = `cb-${key}`;
      cb.name = key;
      cb.checked = known[key];
      cb.onchange = setting_change;

      label.htmlFor = `cb-${key}`;
      label.className = "browser-style";
      label.appendChild(cb);
      label.appendChild(document.createTextNode(` ${key}`));

      root.appendChild(label);
    }
  }
});

browser.storage.onChanged.addListener(on_storage_change);