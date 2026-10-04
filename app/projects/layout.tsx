import SectionShell from "@/components/SectionShell";

export default function ProjectsLayout({ children }: LayoutProps<"/projects">) {
  return <SectionShell section="projects">{children}</SectionShell>;
}
