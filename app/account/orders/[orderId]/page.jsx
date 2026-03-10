import axiosClient from "@/lib/axios";
import ProductDetail from "./_components/ProductDetail/ProductDetails";
import DelivereyDetails from "./_components/delivery-details/page";
import OrderDetails from "./_components/order-details/page";
import Invoice from "./_components/invoice/page";

export default function OrderDetailPage({ params }) {
  const { orderId } = React.use(params);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axiosClient.get(`/api/web-orders/${orderId}?depth=2`);
        const data = response.data;

        if (data) {
          setOrder(data);
        } else {
          console.error("Order not found");
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (loading) return <div>Loading...</div>;
  if (!order) return <div>Order not found.</div>;

  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <ProductDetail order={order} />
        <DelivereyDetails order={order} />
        <OrderDetails order={order} />
        <Invoice order={order} />
      </div>
    </div>
  );
}
