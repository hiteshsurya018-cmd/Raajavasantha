import { ActionLink } from "./Action";
import { Reveal } from "./Reveal";

export function CTASection({
  heading = "Be part of the journey.",
  body = "Whether through your time, skills, resources or encouragement, there are many ways to stand behind a more inclusive and sustainable future.",
}: {
  heading?: string;
  body?: string;
}) {
  return (
    <section className="bg-forest text-ivory">
      <div className="mx-auto max-w-[80rem] px-5 py-20 lg:px-10 lg:py-28">
        <Reveal className="grid items-end gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="eyebrow">Get Involved</p>
            <h2 className="display-lg mt-6 max-w-2xl text-ivory">{heading}</h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ivory/75">{body}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <ActionLink to="/support" variant="gold">
              Support the Trust
            </ActionLink>
            <ActionLink to="/volunteer" variant="outlineLight">
              Volunteer with us
            </ActionLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
