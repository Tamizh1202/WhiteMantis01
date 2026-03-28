import axiosClient from "@/lib/axios";

/**
 * Utility function to download an invoice PDF from the client side.
 *
 * @param type - 'order' | 'subscription' | 'app-order'
 * @param id - The ID of the order or subscription
 * @param token - Optional authentication token (if needed by your API)
 */
export async function downloadInvoice(
  type: "order" | "subscription" | "app-order",
  id: string | number,
  token?: string,
) {
  try {
    let endpoint = "";
    if (type === "subscription") {
      endpoint = `/api/web-subscription/${id}/invoice`;
    } else if (type === "app-order") {
      endpoint = `/api/app-orders/${id}/invoice`;
    } else {
      endpoint = `/api/web-orders/${id}/invoice`;
    }

    const config: any = {
      responseType: "blob", // Important for receiving binary PDF data
    };

    if (token) {
      config.params = { token };
    }

    const response = await axiosClient.get(endpoint, config);

    // Convert the response data to a blob
    const blob = new Blob([response.data], { type: "application/pdf" });

    // Create a temporary URL for the blob
    const downloadUrl = window.URL.createObjectURL(blob);

    // Create a temporary anchor element and trigger the download
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = downloadUrl;

    // The API provides the filename in the Content-Disposition header,
    // but as a fallback we can generate one here.
    const contentDisposition = response.headers["content-disposition"];
    let filename = `invoice-${type}-${id}.pdf`;
    if (contentDisposition && contentDisposition.includes("filename=")) {
      // e.g. filename="invoice-123.pdf" or filename=invoice-123.pdf
      const matches = /filename="?([^"]+)"?/.exec(contentDisposition);
      if (matches && matches[1]) {
        filename = matches[1];
      }
    }

    a.download = filename;
    document.body.appendChild(a);
    a.click();

    // Cleanup
    window.URL.revokeObjectURL(downloadUrl);
    document.body.removeChild(a);

    return { success: true };
  } catch (error) {
    console.error("Error downloading invoice:", error);
    return { success: false, error };
  }
}
