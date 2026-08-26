import Link from 'next/link'

export default function MainHeader() {
  return (
    <header box-="round" shear-="top">
      <div className="flex justify-between">
        <span>Portfolio</span>
        <span>Navigation</span>
      </div>
      <div className="content flex justify-between">
        <h1>
          <Link href="/"><h1>Kaspar Skoda</h1></Link>
        </h1>
          <nav>
            <Link href="/projects/">Projects</Link>
            <Link href="/photography/">Photography</Link>
          </nav>
      </div>
    </header>
  );
}
