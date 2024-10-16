import { redirect } from "next/navigation";

export default function UserRedirect({ params }: { params: { id: string } }) {
  const { id } = params;
  redirect(`/${id}/requests`);
}
