const windowIcon = lucide.createElement(lucide.AppWindow, {
  width: 20,
  height: 20,
  stroke: "#fff",
}).outerHTML;
const mailIcon = lucide.createElement(lucide.Mail, {
  width: 22,
  height: 22,
  stroke: "#fff",
}).outerHTML;
const disconnectIcon = lucide.createElement(lucide.LogOut, { stroke: "#fff" }).outerHTML;

export default () => {
  let user;
  const userItem = localStorage.getItem("user");
  if (userItem) {
    user = JSON.parse(userItem);
    if (typeof user === "string") {
      user = JSON.parse(user);
    }
  }
  if (user && user.type === "Employee") {
    return `
      <div class="vertical-navbar">
        <div class="layout-title">Billed</div>
        <div id="layout-icon1" data-testid="icon-window">${windowIcon}</div>
        <div id="layout-icon2" data-testid="icon-mail">${mailIcon}</div>
        <div id="layout-disconnect">${disconnectIcon}</div>
      </div>
    `;
  } else {
    return `
      <div class="vertical-navbar">
        <div class="layout-title">Billed</div>
        <div id="layout-disconnect" data-testid="layout-disconnect">${disconnectIcon}</div>
      </div>
    `;
  }
};
