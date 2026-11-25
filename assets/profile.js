// Keep ordinary in-page links when JavaScript is unavailable.
const tabList = document.querySelector(".tab-links");
const tabs = Array.from(tabList.querySelectorAll("a"));
const panels = tabs.map(tab => document.getElementById(tab.hash.slice(1)));

function showPanel(index) {
  tabs.forEach((tab, position) => {
    const selected = position === index;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
    panels[position].hidden = !selected;
  });
}

function panelFromUrl() {
  const index = tabs.findIndex(tab => tab.hash === location.hash);
  return index < 0 ? 0 : index;
}

function activate(index) {
  if (tabs[index].getAttribute("aria-selected") !== "true") {
    history.pushState(null, "", tabs[index].hash);
  }
  showPanel(index);
}

tabList.setAttribute("role", "tablist");
tabList.setAttribute("aria-label", "Profile sections");
tabs.forEach((tab, index) => {
  const panel = panels[index];
  tab.setAttribute("role", "tab");
  tab.setAttribute("aria-controls", panel.id);
  panel.setAttribute("role", "tabpanel");
  panel.setAttribute("aria-labelledby", tab.id);
  panel.tabIndex = 0;
  tab.addEventListener("click", event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    activate(index);
  });
  tab.addEventListener("keydown", event => {
    const destinations = {
      ArrowLeft: (index + tabs.length - 1) % tabs.length,
      ArrowRight: (index + 1) % tabs.length,
      Home: 0,
      End: tabs.length - 1
    };
    if (!(event.key in destinations)) return;
    event.preventDefault();
    const next = destinations[event.key];
    tabs[next].focus();
    activate(next);
  });
});
window.addEventListener("popstate", () => showPanel(panelFromUrl()));
window.addEventListener("hashchange", () => showPanel(panelFromUrl()));
document.documentElement.classList.add("tabs-ready");
showPanel(panelFromUrl());
