"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FileText, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MissionPreview } from "@/components/sections/MissionPreview";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

export function Hero() {
  return (
    <>
      <section className="relative overflow-hidden bg-[#F7F2E7] pt-32 text-[#1F3827] sm:pt-36 lg:min-h-[650px] lg:pt-40">
        <div className="container grid gap-12 pb-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-16 lg:pb-20 xl:gap-20">
          <motion.div
            initial="hidden"
            animate="visible"
            transition={{ staggerChildren: 0.12, delayChildren: 0.08 }}
            className="max-w-3xl"
          >
            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#1F3827]"
            >
              <span className="h-px w-10 bg-[#C99A32]" aria-hidden />
              Registered Charitable Trust <span className="text-[#B34E2D]">&middot;</span> Karnataka
            </motion.p>

            <motion.h1
              variants={fadeUp}
              transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
              className="mt-7 text-balance font-display text-[clamp(3rem,6.6vw,4.75rem)] font-semibold leading-[1.01] tracking-[-0.03em] text-[#1F3827]"
            >
              Service is our duty,
              <br />
              <span className="text-[#B34E2D]">society</span> is our family.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
              className="mt-7 max-w-2xl text-base leading-8 text-[#4D574D] sm:text-lg"
            >
              We&apos;re a brand-new trust in Rajajinagar, Bengaluru - registered, but
              yet to run our first project. We&apos;d rather tell you that plainly than
              dress up a founding day as a track record.
            </motion.p>

            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
              className="mt-9 flex flex-col gap-3 sm:flex-row"
            >
              <Button
                size="lg"
                className="rounded-[10px] bg-[#B34E2D] px-6 text-white shadow-none transition-all duration-200 ease-editorial hover:-translate-y-0.5 hover:bg-[#963F24] hover:shadow-soft sm:px-7"
                asChild
              >
                <Link href="/about" aria-label="Meet the founding team">
                  <UsersRound className="h-4 w-4" />
                  Meet the founding team
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-[10px] border-[#1F3827]/35 bg-transparent px-6 text-[#1F3827] shadow-none transition-all duration-200 ease-editorial hover:-translate-y-0.5 hover:border-[#1F3827]/55 hover:bg-[#1F3827]/[0.06] sm:px-7"
                asChild
              >
                <Link href="/documents" aria-label="Read our registration and documents">
                  <FileText className="h-4 w-4" />
                  Read our registration &amp; documents
                </Link>
              </Button>
            </motion.div>

            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
              className="mt-12 grid max-w-xl grid-cols-2 gap-8 border-t border-[#1F3827]/18 pt-7"
            >
              <div>
                <p className="font-display text-4xl font-semibold leading-none tracking-[-0.02em] text-[#1F3827]">
                  2026
                </p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#5C665A]">
                  Year established
                </p>
              </div>
              <div>
                <p className="font-display text-4xl font-semibold leading-none tracking-[-0.02em] text-[#1F3827]">
                  9
                </p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#5C665A]">
                  Focus areas planned
                </p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto w-full max-w-[260px] sm:max-w-[330px] lg:max-w-[420px]"
          >
            <div className="rounded-[14px] border border-[#2A3D2B]/15 bg-[#EEE5CF] p-7 shadow-[0_24px_60px_rgba(31,56,39,0.10)] sm:p-9 lg:p-10">
              <div className="flex aspect-square items-center justify-center bg-[#F7F2E7]/55 p-4">
                <Image
                  src="/logo.jpeg"
                  alt="Rajavasantha Welfare Trust logo"
                  width={520}
                  height={520}
                  priority
                  sizes="(max-width: 768px) 260px, (max-width: 1024px) 330px, 420px"
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
            <div className="mt-5 flex items-center justify-center gap-3 text-center text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#1F3827]/70">
              <span className="h-px w-8 bg-[#C99A32]" aria-hidden />
              Est. 2026
              <span className="h-px w-8 bg-[#C99A32]" aria-hidden />
            </div>
          </motion.div>
        </div>
      </section>
      <MissionPreview />
    </>
  );
}
