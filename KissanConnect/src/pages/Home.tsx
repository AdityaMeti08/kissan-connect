import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore'; // Firestore functions
import { db } from './config/config'; // Adjust the path as necessary

// Define the Product interface
interface Product {
  id: string;
  productName: string;
  description: string;
  price: number;
  imageUrl: string;
}

const Home = () => {
  // Declare the state for products with the Product[] type
  const [products, setProducts] = useState<Product[]>([]); // Initialize products as an array of Product objects
  const [loading, setLoading] = useState(true); // State for loading

  // Function to fetch products from Firestore
  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'products')); // Fetch products from 'products' collection
      const productsData: Product[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[]; // Cast to Product[]
      setProducts(productsData); // Set the fetched products in state
      setLoading(false); // Set loading to false after fetching
    } catch (err) {
      console.error('Error fetching products:', err);
      setLoading(false); // Set loading to false even if there's an error
    }
  };

  // Fetch products when the component mounts
  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return <p>Loading...</p>; // Display a loading message while fetching
  }
  return (
    <div className="store">
      <h1>Store</h1>
      <div className="product-grid">
        {/* Map through the products and display each one */}
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.imageUrl} alt={product.productName} className="product-image" />
            <h2>{product.productName}</h2>
            <p>{product.description}</p>
            <p>Price: ${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
