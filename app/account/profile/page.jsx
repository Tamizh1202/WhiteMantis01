import { auth } from "@/auth";
import axiosClient from "@/lib/axios";
import ProfileComponents from "./_components/ProfileComponents/ProfileComponents";

async function getProfile(payloadToken) {
  try {
    const res = await axiosClient.get("/api/users/me", {
      headers: {
        ...(payloadToken && { Authorization: `JWT ${payloadToken}` }),
      },
    });
    return res.data;
  } catch (error) {
    console.error("Backend Error:", error?.response?.data || error.message);
    return null;
  }
}

export default async function ProfilePage() {
  const session = await auth();
  const payloadToken = session?.user?.["paylaod-token"];

  const data = await getProfile(payloadToken);

  return (
    <div>
      <ProfileComponents initialData={data} />
    </div>
  );
}