import { cookies } from 'next/headers';
import axiosClient from '@/lib/axios';
import { generateInvoicePDF, generateInvoiceFilename } from '@/lib/pdf/utils/pdfGenerator';
import { formatPayloadOrderToInvoice, formatPayloadSubscriptionToInvoice } from '@/lib/pdf/utils/invoiceFormatter';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ type: string; id: string }> }
) {
    // In Next.js 15+ params is a Promise
    const { type, id } = await params;
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    try {
        const cookieStore = await cookies();
        const payloadToken = cookieStore.get('paylaod-token')?.value;

        const headers: any = {};
        if (payloadToken) {
            headers['Authorization'] = `JWT ${payloadToken}`;
        }

        // Determine endpoint based on type
        let endpoint = '';
        if (type === 'subscription') {
            endpoint = `/api/web-subscription/${id}?depth=2`;
        } else {
            endpoint = `/api/web-orders/${id}?depth=2`;
        }

        const fetchParams: any = {};
        if (token) fetchParams.token = token;

        // Fetch data from Payload CMS
        const response = await axiosClient.get(endpoint, {
            headers,
            params: fetchParams
        });

        const data = response.data;
        if (!data) {
            return new Response('Data not found', { status: 404 });
        }

        // Format data for PDF generation
        // Payload might return the doc directly or wrapped in { order: ... } or { subscription: ... }
        const orderData = type === 'subscription'
            ? (data.subscription || data)
            : (data.order || data);

        const invoiceData = type === 'subscription'
            ? formatPayloadSubscriptionToInvoice(orderData)
            : formatPayloadOrderToInvoice(orderData);

        // Generate PDF buffer
        const pdfBuffer = await generateInvoicePDF(invoiceData);

        // Generate filename
        const filename = generateInvoiceFilename(id, type as any);

        // Return PDF as attachment
        return new Response(pdfBuffer as any, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${filename}"`,
                'Cache-Control': 'no-store, max-age=0',
            },
        });
    } catch (error: any) {
        console.error('Invoice download error:', error);
        return new Response(
            JSON.stringify({ error: error.message || 'Failed to generate invoice' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}
