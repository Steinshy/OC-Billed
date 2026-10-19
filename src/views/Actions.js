import { validateFileUrl } from "../app/format.js";

const eyeBlueIcon = lucide.createElement(lucide.Eye, { stroke: "#0D5AE5" }).outerHTML;

export default billUrl => {
  const isValidFile = !validateFileUrl(billUrl);
  const iconClass = isValidFile ? "" : "icon-disabled";
  return `
    <div class="icon-actions">
      <div id="eye" data-testid="icon-eye" data-bill-url="${billUrl}" class="${iconClass}">${eyeBlueIcon}</div>
    </div>
  `;
};
