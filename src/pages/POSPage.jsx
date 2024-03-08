import React, { useEffect, useRef, useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useReactToPrint } from 'react-to-print';

function POSPage() {
    const [products, setProducts] = useState([]);
    const [isloading, setIsLoading] = useState(false);
    const [cart, setCart] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);

    const toastOptions = {
        autoClose: 400,
        pauseOnHover: true,
    }

    const fetchProducts = async () => {
        setIsLoading(true);
        const result = await axios.get('products');
        setProducts(result.data);
        setIsLoading(false);
    };

    const addProductToCart = async (product) => {
        // Check if the adding product exists
        let findProductInCart = cart.find((item) => item.id === product.id);

        if (findProductInCart) {
            let newCart = cart.map((item) => {
                if (item.id === product.id) {
                    return {
                        ...item,
                        quantity: item.quantity + 1,
                        totalAmount: item.price * (item.quantity + 1),
                    };
                }
                return item;
            });

            setCart(newCart);
            const newItem = newCart.find((item) => item.id === product.id);
            toast(`Added ${newItem.name} to cart`, toastOptions);
        } else {
            let addingProduct = {
                ...product,
                quantity: 1,
                totalAmount: product.price,
            };
            setCart([...cart, addingProduct]);
            toast(`Added ${product.name} to cart`, toastOptions);
        }
    };

    const removeProduct = (product) => {
        const newCart = cart.filter((item) => item.id !== product.id);
        setCart(newCart);
    }

    const componentRef = useRef();

    const handleReactToPrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const handlePrint = () => {
        handleReactToPrint();
    }

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        let newTotalAmount = 0;
        cart.forEach((item) => {
            newTotalAmount += parseInt(item.totalAmount);
        });
        setTotalAmount(newTotalAmount);
    }, [cart]);

    return (
        <MainLayout>
            <div className="row">
                <div className="col-lg-8">
                    {isloading ? (
                        'Loading'
                    ) : (
                        <div className="row">
                            {products.map((product, key) => (
                                <div key={key} className="col-lg-4 mb-4">
                                    <div className="pos-item px-3 text-center border" onClick={() => addProductToCart(product)}>
                                        <p>{product.name}</p>
                                        <img src={product.image} className="img-fluid" alt={product.name} />
                                        <p>PKR: {product.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="col-lg-4">
                    <div style={{ display: "none" }}>
                        {/* ComponentToPrint will be printed when handleReactToPrint is triggered */}
                        <ComponentToPrint cart={cart} totalAmount={totalAmount} ref={componentRef} />
                    </div>
                    <div className="table-responsive bg-dark">
                        <table className="table table-responsive table-dark table-hover">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Total</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cart.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center">
                                            No Item in Cart
                                        </td>
                                    </tr>
                                ) : (
                                    cart.map((cartProduct, index) => (
                                        <tr key={index}>
                                            <td>{cartProduct.id}</td>
                                            <td>{cartProduct.name}</td>
                                            <td>PKR {cartProduct.price}</td>
                                            <td>{cartProduct.quantity}</td>
                                            <td>{cartProduct.totalAmount}</td>
                                            <td>
                                                <button className="btn btn-danger btn-sm" onClick={() => removeProduct(cartProduct)}>
                                                    Remove
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                        <h2 className="px-2 text-white">Total Amount: PKR {totalAmount}</h2>
                    </div>

                    <div className="mt-3">
                        {totalAmount !== 0 ? (
                            <div>
                                {/* Clicking this button will trigger the printing of the slip */}
                                <button className='btn btn-primary' onClick={handlePrint}>
                                    Pay Now
                                </button>
                            </div>
                        ) : (
                            'Please add a product to the cart'
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

const ComponentToPrint = React.forwardRef(({ cart, totalAmount }, ref) => {
    return (
        <div ref={ref}>
            <h1>Invoice Slip</h1>
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {cart.map((item, index) => (
                        <tr key={index}>
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                            <td>PKR {item.price}</td>
                            <td>{item.quantity}</td>
                            <td>PKR {item.totalAmount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <h2>Total Amount: PKR {totalAmount}</h2>
        </div>
    );
});

export default POSPage;
