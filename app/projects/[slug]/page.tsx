import PostPage, { postMetadata } from "@/components/PostPage";

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">) {
  return postMetadata("projects", (await params).slug);
}

export default async function ProjectPost({ params }: PageProps<"/projects/[slug]">) {
  return <PostPage section="projects" slug={(await params).slug} />;
}
