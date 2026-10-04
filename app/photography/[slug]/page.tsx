import PostPage, { postMetadata } from "@/components/PostPage";

export async function generateMetadata({ params }: PageProps<"/photography/[slug]">) {
  return postMetadata("photography", (await params).slug);
}

export default async function PhotographyPost({ params }: PageProps<"/photography/[slug]">) {
  return <PostPage section="photography" slug={(await params).slug} />;
}
