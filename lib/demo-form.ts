import emailjs from "@emailjs/browser";

const EMAILJS_SERVICE_ID = "service_um0vkzs";
const EMAILJS_TEMPLATE_ID = "template_4juzqfd";
const EMAILJS_PUBLIC_KEY = "dQInDvrhld7C8Fe1I";

export async function submitDemoForm(form: HTMLFormElement, subject: string) {
  const formData = new FormData(form);
  const fullName = String(formData.get("fullName") ?? formData.get("name") ?? "");
  const email = String(formData.get("email") ?? "");
  const message = String(
    formData.get("message") ??
      formData.get("interest") ??
      "New form submission from Rajavasantha Welfare Trust website",
  );

  const hiddenFields: HTMLInputElement[] = [];

  function appendHiddenField(name: string, value: string) {
    if (form.elements.namedItem(name)) return;

    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
    hiddenFields.push(input);
  }

  [
    ["subject", subject],
    ["from_name", fullName],
    ["from_email", email],
    ["reply_to", email],
    ["name", fullName],
    ["fullName", fullName],
    ["message", message],
    ["to_name", "Rajavasantha Welfare Trust"],
    ["to_email", "hello@rajavasanthawelfaretrust.org"],
  ].forEach(([name, value]) => appendHiddenField(name, value));

  try {
    const response = await emailjs.sendForm(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      form,
      { publicKey: EMAILJS_PUBLIC_KEY },
    );

    if (response.status !== 200) throw new Error("The form could not be sent.");
  } finally {
    hiddenFields.forEach((field) => field.remove());
  }
}
