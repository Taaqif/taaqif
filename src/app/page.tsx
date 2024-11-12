import { Github, Linkedin, Mail } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start flex-1 justify-between pb-16">
        <div>
          <div className="text-9xl">
            Tye
            <br />
            Peck
          </div>
        </div>
        <div className="flex flex-col gap-8 row-start-2 items-center sm:items-start ">
          <div className="text-5xl">
            Senior Full Stack
            <br /> Software Engineer
          </div>
          <div className="text-xl">
            I am a multidisciplinary creative developer with over 7 years
            experience. <br />
            Currently working at Novata Solutions{" "}
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
