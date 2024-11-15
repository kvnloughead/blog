document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".code-block__copy-button").forEach((button) => {
    button.addEventListener("click", () => {
      const codeBlock = button.previousElementSibling.querySelector("code");
      navigator.clipboard.writeText(codeBlock.textContent);

      button.textContent = "Copied!";
      setTimeout(() => {
        button.textContent = "Copy";
      }, 2000);
    });
  });
});
