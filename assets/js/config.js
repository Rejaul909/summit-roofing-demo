/*
 * Summit Roofing Co. — site configuration
 * ---------------------------------------------------------------
 * CONTACT FORM (Web3Forms — https://web3forms.com)
 *
 * 1. Go to https://web3forms.com, enter the email address that should
 *    receive estimate requests, and copy the Access Key they email you.
 * 2. Paste it between the quotes below, e.g.
 *      web3formsAccessKey: "a1b2c3d4-....",
 * 3. Deploy the site and send one real test request.
 *
 * The Web3Forms Access Key is designed to be used in public front-end
 * code (it only lets people send messages to YOUR inbox). It is not a
 * secret password. You can restrict it to your domain in the Web3Forms
 * dashboard.
 *
 * While the key is empty, the form validates normally but shows a
 * clear "not connected yet" message instead of pretending to send.
 */
window.SUMMIT_CONFIG = {
  web3formsAccessKey: "fdd159fc-d312-4761-87c4-78126fa834b8",
  formEndpoint: "https://api.web3forms.com/submit",
  requestTimeoutMs: 15000,
  businessPhoneDisplay: "(555) 010-7700",
  businessPhoneHref: "tel:+15550107700"
};
