import { getAbout } from "@/lib/site";
import AboutEditor from "@/components/admin/AboutEditor";

export default async function AdminAbout() {
  return <AboutEditor about={await getAbout()} />;
}
