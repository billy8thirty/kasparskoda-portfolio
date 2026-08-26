import Sidebar from '@/components/Sidebar';
import SideBarElement from "@/components/SideBarElement";

export default function photography() {
  return (
    <main className="flex flex-row h-full">
      <Sidebar title="Select a Date">
        <SideBarElement
          title="Essen-Motor-Show"
          date="2026-01-23"
          type="photo"
          buttonText="select"
          summary="This is a summary of the Essen-Motor-Show." />
        <SideBarElement
          title="Showreel"
          date="2023-06-21"
          type="video"
          buttonText="select"
          summary="This is a summary of the Showreel." />
        <SideBarElement
          title="automotive 3D-Design"
          date="2021-02-01"
          type="other"
          buttonText="select"
          summary="This is a summary of the automotive 3D-Design. i wonder what i designed, this one is longer" />
      </Sidebar>
      <div className="content flex flex-grow justify-center items-center">
        <p>Select something...</p>
      </div>
    </main>
  )
}
