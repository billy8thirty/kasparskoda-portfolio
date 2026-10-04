import { connection } from "next/server";
import AboutMe from "@/components/AboutMe";
import Sidebar from "@/components/Sidebar";
import SocialsBox from "@/components/SocialsBox";
import { getAbout, getSocials } from "@/lib/site";

const home = async () => {
  // Content is edited at runtime via /admin, so always read it fresh.
  await connection();
  const [about, socials] = await Promise.all([getAbout(), getSocials()]);

  return (
    <main className="flex flex-col">
      <div className="flex flex-row w-full flex-1 min-h-0">
        <Sidebar title="socials">
          {socials.map((social) => (
            <SocialsBox key={social.id} social={social} />
          ))}
        </Sidebar>
        <AboutMe about={about} />
      </div>
    </main>
  );
}

export default home;
