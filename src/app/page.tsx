import TextStaggerReveal from "@/components/TextStaggerReveal";
import { Github, Linkedin, Mail } from "lucide-react";

export default function Home() {
  return (
    <>
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start flex-1 justify-between pb-16">
        <div>
          <div className="text-9xl">
            <TextStaggerReveal
              explode="characters"
              from={{ transform: "translate(-10%, -10%)", opacity: 0 }}
              to={{ transform: "translate(0px, 0px)", opacity: 1 }}
              trailChildrenClassName="inline-block"
            >
              Tye
              <br />
              Peck
            </TextStaggerReveal>
          </div>
        </div>
        <div className="flex flex-col gap-8 row-start-2 items-center sm:items-start ">
          <div className="text-5xl">
            <TextStaggerReveal
              delay={1000}
              from={{ transform: "translate(-10%, -50%)", opacity: 0 }}
              to={{ transform: "translate(0px, 0px)", opacity: 1 }}
            >
              <div>Senior Full Stack</div>
              <div>Software Engineer</div>
            </TextStaggerReveal>
          </div>
          <div className="text-xl flex gap-x-1 flex-wrap">
            <TextStaggerReveal
              delay={1300}
              explode="words"
              from={{
                transform: "translate(0%, 40%) skew(-20deg, 0)",
                filter: "blur(8px)",
                opacity: 0,
              }}
              to={{
                transform: "translate(0px, 0px) skew(0deg, 0deg)",
                filter: "blur(0px)",
                opacity: 1,
              }}
            >
              I am a multidisciplinary creative developer with over 7 years
              experience.
              <hr className="w-full border-none" />
              Currently working at Novata Solutions
            </TextStaggerReveal>
          </div>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github width={16} height={16} />
          Github
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Mail width={16} height={16} />
          Email
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Linkedin width={16} height={16} />
          LinkedIn
        </a>
      </footer>
    </>
  );
}
