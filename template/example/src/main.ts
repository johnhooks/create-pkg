import hello from "~PACKAGE_NAME~";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = /* html */ `
  <div>
    <p>Hello <code>~PACKAGE_NAME~</code></p>
  </div>
`;

hello();
