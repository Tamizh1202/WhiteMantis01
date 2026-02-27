import ProfileComponents from "../_components/ProfileComponents/ProfileComponents";
import { headers } from "next/headers";

const headerList = await headers();
console.log(headers)

// credentials: true,
const baseUrl =
  process.env.NEXT_PUBLIC_SERVER_URL || "https://whitemantis-app.vercel.app";

async function getProfile() {
  const headerList = await headers();
  const allHeaders = Object.fromEntries(headerList.entries());

  // Debug: See if 'authorization' actually exists here
  console.log("Headers being sent to backend:", allHeaders);

  const res = await fetch(`${baseUrl}/api/users/me`, {
    method: "GET",
    headers: {
      ...allHeaders,
      // Manually ensure Content-Type if needed
      "Content-Type": "application/json",
    },
    // This ensures Next.js doesn't cache a stale or empty response
    cache: 'no-store'
  });

  if (!res.ok) {
    const errorLog = await res.text();
    console.error("Backend Error:", errorLog);
    return null;
  }

  return res.json();
}

export default async function ProfilePage() {
  const data = await getProfile();

  return (
    <div>
      <ProfileComponents initialData={data} />
    </div>
  );
}