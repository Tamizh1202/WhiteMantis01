import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies();
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
