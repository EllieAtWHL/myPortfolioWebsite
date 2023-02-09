let currentMode;

document.addEventListener("DOMContentLoaded", function () {
  setModePreference();
});

function setModePreference() {
  if (!localStorage.getItem("ellieatwhl-mode")) {
    let systemMode = getModeSystemPreference();
    localStorage.setItem("ellieatwhl-mode", systemMode);
  }
  currentMode = localStorage.getItem("ellieatwhl-mode");
  setColourScheme(currentMode);
}

function getModeSystemPreference() {
  if (currentMode) {
    return currentMode;
  }
  if (window.matchMedia) {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      currentMode = "dark";
    } else {
      currentMode = "light";
    }
  }
  return currentMode;
}

function setColourScheme(currentMode) {
  if (localStorage.getItem("ellieatwhl-mode") !== currentMode) {
    localStorage.setItem("ellieatwhl-mode", currentMode);
  }
  const body = document.getElementById("body");
  switch (currentMode) {
    case "dark":
      body.classList.add("dark");
      break;
    case "light":
      body.className = "";
      break;
    default:
      body.className = "";
      break;
  }
}

class Header extends HTMLElement {
  constructor() {
    super();

    const header = document.createElement("nav");
    header.className = "navbar";

    const brandTitle = document.createElement("div");
    brandTitle.classList.add("brand-title");
    const logoLink = createLink({ href: "../" });
    const logo = document.createElement("img");
    logo.src = "../img/logo.png";
    logo.alt = "EllieAtWHL";
    const toggleButton = createLink({ href: "#", class: "toggle-button" });
    for (let i = 0; i < 3; i++) {
      let bar = document.createElement("span");
      bar.classList.add("bar");
      toggleButton.appendChild(bar);
    }

    const topnav = document.createElement("div");
    topnav.className = "navbar-links";
    let linksElement = document.createElement("ul");

    const homeLinkLI = document.createElement("li");
    const homeLink = createLink({ href: "../", text: "Home" });
    homeLinkLI.appendChild(homeLink);
    linksElement.appendChild(homeLinkLI);

    const aboutMeLinkLI = document.createElement("li");
    const aboutMeLink = createLink({ href: "../about-me", text: "About Me" });
    aboutMeLinkLI.appendChild(aboutMeLink);
    linksElement.appendChild(aboutMeLinkLI);

    const experienceLinkLI = document.createElement("li");
    const experienceLink = createLink({
      href: "../experience",
      text: "Experience",
    });
    experienceLinkLI.appendChild(experienceLink);
    linksElement.appendChild(experienceLinkLI);

    const projectsLinkLI = document.createElement("li");
    const projectsLink = createLink({ href: "../projects", text: "Projects" });
    projectsLinkLI.appendChild(projectsLink);
    linksElement.appendChild(projectsLinkLI);

    topnav.appendChild(linksElement);

    logoLink.appendChild(logo);
    brandTitle.appendChild(logoLink);

    header.appendChild(brandTitle);
    header.appendChild(toggleButton);
    header.appendChild(topnav);

    toggleButton.addEventListener('click', () => {topnav.classList.toggle('active')})

    this.appendChild(header);
  }
}

class Footer extends HTMLElement {
  constructor() {
    super();

    const footer = document.createElement("div");
    footer.className = "footer";

    const findMe = document.createElement("div");
    findMe.className = "findMe floatLeft";

    const heading = document.createElement("p");
    const headingText = document.createTextNode("You can also find me at...");
    heading.appendChild(headingText);

    const linkList = document.createElement("ul");

    const twitterLinkItem = document.createElement("li");
    const twitterLink = createLink({
      href: "https://twitter.com/EllieAtWHL",
      target: "_blank",
      text: "Twitter",
    });
    twitterLinkItem.appendChild(twitterLink);

    const linkedInLinkItem = document.createElement("li");
    const linkedInLink = createLink({
      href: "https://www.linkedin.com/in/elliematthewman/",
      target: "_blank",
      text: "LinkedIn",
    });
    linkedInLinkItem.appendChild(linkedInLink);

    const githubLinkItem = document.createElement("li");
    const githubLink = createLink({
      href: "https://github.com/EllieAtWHL",
      target: "_blank",
      text: "Github",
    });
    githubLinkItem.appendChild(githubLink);

    const salesforceLinkItem = document.createElement("li");
    const salesforceLink = createLink({
      href: "https://trailblazer.me/id/elliematthewman",
      target: "_blank",
      text: "Salesforce",
    });
    salesforceLinkItem.appendChild(salesforceLink);

    linkList.appendChild(twitterLinkItem);
    linkList.appendChild(linkedInLinkItem);
    linkList.appendChild(githubLinkItem);
    linkList.appendChild(salesforceLinkItem);

    findMe.appendChild(heading);
    findMe.appendChild(linkList);

    const darkMode = document.createElement("div");
    darkMode.className = "darkMode floatRight";

    const darkModeLabel = document.createElement("label");
    darkModeLabel.className = "switch";

    const darkModeInput = document.createElement("input");
    darkModeInput.type = "checkbox";
    darkModeInput.id = "darkMode";
    if (localStorage.getItem("ellieatwhl-mode") === "dark") {
      darkModeInput.checked = true;
    }
    darkModeInput.onclick = function () {
      var checkbox = document.getElementById("darkMode");
      if (checkbox.checked === true) {
        currentMode = "dark";
      } else {
        currentMode = "light";
      }
      setColourScheme(currentMode);
    };
    const darkModeSpan = document.createElement("span");
    darkModeSpan.className = "slider round";
    const darkModeP = document.createElement("p");
    const darkModeText = document.createTextNode("Dark Mode");

    darkModeP.appendChild(darkModeText);
    darkModeLabel.appendChild(darkModeInput);
    darkModeLabel.appendChild(darkModeSpan);
    darkMode.appendChild(darkModeLabel);
    darkMode.appendChild(darkModeP);

    footer.appendChild(findMe);
    footer.appendChild(darkMode);

    this.append(footer);
  }
}

function createLink(linkDetails) {
  const link = document.createElement("a");
  if (linkDetails.href) link.href = linkDetails.href;
  if (linkDetails.class) link.className = linkDetails.class;
  if (linkDetails.active) link.classList.add("active");
  if (linkDetails.target) link.target = linkDetails.target;
  if (linkDetails.text) {
    const text = document.createTextNode(linkDetails.text);
    link.appendChild(text);
  }
  return link;
}

customElements.define("ellieatwhl-header", Header);
customElements.define("ellieatwhl-footer", Footer);
