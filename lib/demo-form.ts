import emailjs from "@emailjs/browser";

const EMAILJS_SERVICE_ID = "service_um0vkzs";
const EMAILJS_TEMPLATE_ID = "template_b4audja";
const EMAILJS_PUBLIC_KEY = "dQInDvrhld7C8Fe1I";

export async function submitDemoForm(form: HTMLFormElement, subject: string) {
  const subjectField = document.createElement("input");
  subjectField.type = "hidden";
  subjectField.name = "subject";
  subjectField.value = subject;
  form.appendChild(subjectField);

  try {
    const response = await emailjs.sendForm(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      form,
      { publicKey: EMAILJS_PUBLIC_KEY },
    );

    if (response.status !== 200) throw new Error("The form could not be sent.");
  } finally {
    subjectField.remove();
  }
}
