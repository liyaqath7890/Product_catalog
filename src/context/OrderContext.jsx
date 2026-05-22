import React, { createContext, useContext, useState, useEffect } from 'react';

const OrderContext = createContext();

export const useOrderContext = () => {
    const context = useContext(OrderContext);
    if (!context) {
        throw new Error('useOrderContext must be used within an OrderProvider');
    }
    return context;
};

const MOCK_ORDERS = [
    { id: 'ORD-2851', customer: 'Emma Watson', email: 'emma@example.com', total: 3499.00, status: 'Completed', payment: 'Credit Card', date: '25 Mar, 2025' },
    { id: 'ORD-2850', customer: 'James Bond', email: '007@mi6.gov', total: 1199.00, status: 'Processing', payment: 'PayPal', date: '25 Mar, 2025' },
    { id: 'ORD-2849', customer: 'Sherlock Holmes', email: 'sherlock@bakerst.com', total: 398.00, status: 'Shipped', payment: 'Bank Transfer', date: '24 Mar, 2025' },
    { id: 'ORD-2848', customer: 'Peter Parker', email: 'peter@dailybugle.com', total: 799.00, status: 'Pending', payment: 'Credit Card', date: '24 Mar, 2025' },
    { id: 'ORD-2847', customer: 'Bruce Wayne', email: 'bruce@waynecorp.com', total: 8999.00, status: 'Cancelled', payment: 'Crypto', date: '23 Mar, 2025' },
];

export const OrderProvider = ({ children }) => {
    const [orders, setOrders] = useState(() => {
        const savedOrders = localStorage.getItem('gadgethub_orders');
        return savedOrders ? JSON.parse(savedOrders) : MOCK_ORDERS;
    });

    useEffect(() => {
        localStorage.setItem('gadgethub_orders', JSON.stringify(orders));
    }, [orders]);

    const addOrder = (newOrder) => {
        const orderWithId = {
            ...newOrder,
            id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
            date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/\//g, ' ')
        };
        setOrders([orderWithId, ...orders]);
    };

    const deleteOrder = (id) => {
        setOrders(orders.filter(order => order.id !== id));
    };

    const updateOrderStatus = (id, status) => {
        setOrders(orders.map(order => order.id === id ? { ...order, status } : order));
    };

    return (
        <OrderContext.Provider value={{ orders, addOrder, deleteOrder, updateOrderStatus }}>
            {children}
        </OrderContext.Provider>
    );
};
