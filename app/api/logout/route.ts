import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies();

        // Invalidate the JWT on the Payload side so it cannot be reused
        const payloadToken = cookieStore.get("paylaod-token")?.value;
        if (payloadToken) {
            try {
                await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/logout`, {
                    method: "POST",
                    headers: {
                        "Authorization": `JWT ${payloadToken}`,
                        "Content-Type": "application/json",
                    },
                });
            } catch (e) {
                console.error("Payload logout error:", e);
            }
        }

        // Clear all cookies
        const allCookies = cookieStore.getAll();
        allCookies.forEach((cookie) => {
            cookieStore.delete(cookie.name);
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json({ success: false, error: 'Logout failed' }, { status: 500 });
    }
}
