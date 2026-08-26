export default function AboutMe() {
  return (
    <div box-="round" shear-="top" className="w-full flex flex-col">
      <div><span>About me</span></div>
      <div className="content w-full flex flex-col gap-[3ch]">

        <div className="flex flex-row items-center">
          <p>

          </p>
        </div>
        <h3 className="mt-[1ch]">I'm Kaspar</h3>

        <p className="text-pretty mr-[5ch] max-w-[50ch]">
          an aspiring maker and videographer, with knowledge and experience in many fields across film making,
          photography, web development, and more.
        </p>

        <sub className="text-pretty mr-[5ch]">I got plenty of passion and want to make my little corner of the world a better place.</sub>

        <div className="flex flex-col">
          <em>location.......Essen, Germany</em>
          <em>Available......<strong>Available to Work</strong></em>
        </div>

      </div>
    </div>
  );
}
