import emailjs from "@emailjs/browser";

const EMAILJS_SERVICE_ID = "service_um0vkzs";
const EMAILJS_TEMPLATE_ID = "template_4juzqfd";
const EMAILJS_PUBLIC_KEY = "dQInDvrhld7C8Fe1I";

function value(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function apiBase() {
  return (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");
}

async function submitToApi(formData: FormData, subject: string) {
  const base = apiBase();
  if (!base) return false;

  const lowerSubject = subject.toLowerCase();

  if (lowerSubject.includes("volunteer")) {
    const response = await fetch(`${base}/api/v1/volunteers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: value(formData, "fullName"),
        email: value(formData, "email"),
        phone: value(formData, "phone") || undefined,
        interest: value(formData, "interest"),
      }),
    });
    if (!response.ok) throw new Error("Volunteer API submission failed.");
    return true;
  }

  const fullName = value(formData, "fullName") || value(formData, "name");
  const email = value(formData, "email");
  const details = [
    value(formData, "subject") && `Subject: ${value(formData, "subject")}`,
    value(formData, "phone") && `Phone: ${value(formData, "phone")}`,
    value(formData, "interest") && `Area of interest: ${value(formData, "interest")}`,
    value(formData, "message"),
  ].filter(Boolean);

  const response = await fetch(`${base}/api/v1/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: fullName,
      email,
      message: details.join("\n\n"),
    }),
  });
  if (!response.ok) throw new Error("Contact API submission failed.");
  return true;
}

async function submitToEmailJs(form: HTMLFormElement, formData: FormData, subject: string) {
  const fullName = value(formData, "fullName") || value(formData, "name");
  const email = value(formData, "email");
  const message =
    value(formData, "message") ||
    value(formData, "interest") ||
    "New form submission from Rajavasantha Welfare Trust website";

  const hiddenFields: HTMLInputElement[] = [];

  function appendHiddenField(name: string, fieldValue: string) {
    if (form.elements.namedItem(name)) return;

    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = fieldValue;
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
    ["to_email", "info@rajavasanthatrust.org"],
  ].forEach(([name, fieldValue]) => appendHiddenField(name, fieldValue));

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

export async function submitDemoForm(form: HTMLFormElement, subject: string) {
  const formData = new FormData(form);

  try {
    const submitted = await submitToApi(formData, subject);
    if (submitted) return;
  } catch {
    // Preserve the existing email integration if the API is unavailable.
  }

  await submitToEmailJs(form, formData, subject);
}
