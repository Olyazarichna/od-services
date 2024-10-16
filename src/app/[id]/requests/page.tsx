"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Dashboard from "../../../../components/Dashboard/Dashboadr";

function RequestsPage() {
  const [user] = useState(() => {
    return typeof window !== undefined ? localStorage.getItem("user") : null;
  });
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);
  return <Dashboard showAllRequests={false} />;
}

export default RequestsPage;
