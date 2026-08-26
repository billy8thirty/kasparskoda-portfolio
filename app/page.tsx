import AboutMe from "@/components/AboutMe";
import Sidebar from "@/components/Sidebar";

const home = () => {
  return (
    <main className="flex flex-col">
      <div className="flex flex-row w-full">
        <Sidebar />
        <AboutMe />
      </div>
    </main>
  );
}

export default home;
