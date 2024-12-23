import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart } from '../redux/cartSlice';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import services from '../data/services';
import { FaTimes } from 'react-icons/fa';

const ServiceList = () => {
    const [search, setSearch] = useState('');
    const [filteredServices, setFilteredServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedService, setSelectedService] = useState(null);

    const dispatch = useDispatch();
    const cartItems = useSelector(state => state.cart.items);

    useEffect(() => {
        setLoading(true);
        try {
            if (services && services.length > 0) {
                setFilteredServices(services);
            } else {
                setError('No services available.');
            }
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch services');
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (search.trim()) {
            const results = services.filter(service =>
                service.name.toLowerCase().includes(search.toLowerCase()) ||
                service.description.toLowerCase().includes(search.toLowerCase())
            );
            setFilteredServices(results);
        } else {
            setFilteredServices(services);
        }
    }, [search]);

    const handleAddToCart = (service) => {
        if (!service || !service.id) {
            toast.error('Service data is invalid!');
            return;
        }

        const existingItem = cartItems.find(item => item.id === service.id);

        if (existingItem) {
            toast.error(`${service.name} is already in the cart!`);
        } else {
            dispatch(addToCart({ ...service, quantity: 1 }));
            toast.success(`${service.name} added to cart!`);
        }
    };

    const handleRemoveFromCart = (serviceId) => {
        if (!serviceId) {
            toast.error('Invalid service ID!');
            return;
        }

        const existingItem = cartItems.find(item => item.id === serviceId);
        if (existingItem) {
            if (existingItem.quantity > 1) {
                dispatch(addToCart({ ...existingItem, quantity: existingItem.quantity - 1 }));
                toast.info(`${existingItem.name} quantity decreased.`);
            } else {
                dispatch(removeFromCart(serviceId));
                toast.info(`${existingItem.name} removed from cart.`);
            }
        }
    };

    const handleServiceClick = (service) => {
        setSelectedService(service); // Set the clicked service to open in a modal
    };

    const handleCloseModal = () => {
        setSelectedService(null); // Close the modal by clearing the selected service
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-xl text-gray-600">Loading services...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-xl text-red-600">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Our Services</h1>
                    <input
                        type="text"
                        placeholder="Search services..."
                        className="w-full mb-6 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    {filteredServices.length === 0 ? (
                        <div className="text-center text-gray-600 py-10">
                            <p className="text-xl">No services found</p>
                            <p className="text-sm">Try a different search term</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6">
                            {filteredServices.map(service => (
                                <div
                                    key={service.id}
                                    className="bg-white shadow-md rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
                                    onClick={() => handleServiceClick(service)}
                                >
                                    <div className="flex">
                                        {/* Left column for the image */}
                                        <div className="w-1/3">
                                            <img
                                                src={service.image}
                                                alt={service.name}
                                                className="w-full h-40 object-cover"  // Fixed height for all images
                                            />
                                        </div>

                                        {/* Right column for the service details */}
                                        <div className="w-2/3 p-4">
                                            <h3 className="text-lg font-semibold text-gray-800">{service.name}</h3>
                                            <p className="text-gray-600 text-sm mb-2">{service.description}</p>
                                            <div className="flex justify-between items-center mt-4">
                                                <span className="text-xl font-bold text-blue-600">${service.price.toFixed(2)}</span>
                                                {cartItems.some(item => item.id === service.id) ? (
                                                    <button
                                                        className="bg-gray-400 text-white px-4 py-2 rounded-md cursor-not-allowed"
                                                        disabled
                                                    >
                                                        In Cart
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleAddToCart(service); }}
                                                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
                                                    >
                                                        Add to Cart
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal for displaying service details */}
            {selectedService && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-8 w-1/2">
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-4 right-4 text-gray-600"
                        >
                            <FaTimes className="text-xl" /> {/* Cross icon from react-icons */}
                        </button>
                        <div className="flex">
                            <div className="w-1/3">
                                <img
                                    src={selectedService.image}
                                    alt={selectedService.name}
                                    className="w-full h-40 object-cover"  // Fixed height for modal image
                                />
                            </div>
                            <div className="w-2/3 pl-6">
                                <h2 className="text-2xl font-semibold text-gray-800">{selectedService.name}</h2>
                                <p className="text-gray-600 mt-4">{selectedService.description}</p>
                                <p className="text-xl font-bold text-blue-600 mt-4">${selectedService.price.toFixed(2)}</p>
                                <div className="mt-6">
                                    <button
                                        onClick={() => handleAddToCart(selectedService)}
                                        className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-300"
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <ToastContainer />
        </div>
    );
};

export default ServiceList;