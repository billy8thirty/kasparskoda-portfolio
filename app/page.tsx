import AboutMe from "@/components/AboutMe";
import Sidebar from "@/components/Sidebar";
import SocialsBox from "@/components/SocialsBox";

const home = () => {
  return (
    <main className="flex flex-col">
      <div className="flex flex-row w-full">
        <Sidebar title="socials">
          <SocialsBox
            title="Instagram"
            iconPath={"/icons/instagram.svg"}
            buttonText="view profile"
            link="https://www.instagram.com/billy8thirty/"
            handle="@billy8thirty"
          />
          <SocialsBox
            title="GitHub"
            iconPath={"/icons/github.svg"}
            buttonText="view profile"
            link="https://www.github.com/billy8thirty/"
            handle="@billy8thirty"
          />
          <SocialsBox
            title="Mail"
            iconPath={"/icons/protonmail.svg"}
            buttonText="Write me an e-mail!"
            link="mailto:kasparskoda@proton.me"
            handle="kasparskoda@proton.me"
          />
          <SocialsBox
            title="LinkedIn"
            iconPath={"/icons/user-round.svg"}
            buttonText="view my CV"
            link="https://www.linkedin.com/in/kasparskoda/"
            handle="Kaspar Skoda"
          />
        </Sidebar>
        <AboutMe />
      </div>
    </main>
  );
}

export default home;
