import { getSocials, listIcons } from "@/lib/site";
import SocialsEditor from "@/components/admin/SocialsEditor";

export default async function AdminSocials() {
  const [socials, icons] = await Promise.all([getSocials(), listIcons()]);
  return <SocialsEditor socials={socials} icons={icons} />;
}
