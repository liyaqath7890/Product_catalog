import React, { createContext, useContext, useState, useEffect } from 'react';

const CustomerContext = createContext();

export const useCustomerContext = () => {
    const context = useContext(CustomerContext);
    if (!context) {
        throw new Error('useCustomerContext must be used within a CustomerProvider');
    }
    return context;
};

const STORAGE_KEY = 'gadgethub_customers';

const formatMonthYear = (date = new Date()) =>
    date.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });

const normalizeCustomer = (customer) => ({
    id: customer.id ?? Date.now(),
    name: customer.name ?? '',
    email: customer.email ?? '',
    phone: customer.phone ?? '',
    location: customer.location ?? '',
    status: customer.status ?? 'Active',
    segment: customer.segment ?? 'Organic',
    notes: customer.notes ?? '',
    orders: Number(customer.orders ?? 0),
    spent: Number(customer.spent ?? 0),
    joined: customer.joined ?? formatMonthYear(),
    lastOrder: customer.lastOrder ?? 'No orders yet',
});

const MOCK_CUSTOMERS = [
  {
    id: 1,
    name: 'Emma Watson',
    email: 'emma@example.com',
    phone: '+91 98765 12001',
    location: 'Bengaluru',
    orders: 12,
    spent: 12450,
    status: 'VIP',
    joined: 'Oct 2024',
    lastOrder: '04 Apr 2026',
    segment: 'Instagram',
    notes: 'Responds well to launch-day offers and skincare bundle drops.',
  },
  {
    id: 2,
    name: 'James Bond',
    email: '007@mi6.gov',
    phone: '+44 20 7946 0007',
    location: 'London',
    orders: 8,
    spent: 8900,
    status: 'Active',
    joined: 'Nov 2024',
    lastOrder: '28 Mar 2026',
    segment: 'Referral',
    notes: 'Mostly shops limited-edition products and fast checkout items.',
  },
  {
    id: 3,
    name: 'Sherlock Holmes',
    email: 'sherlock@bakerst.com',
    phone: '+44 20 7946 221B',
    location: 'Mumbai',
    orders: 45,
    spent: 45200,
    status: 'VIP',
    joined: 'Jan 2024',
    lastOrder: '06 Apr 2026',
    segment: 'Organic',
    notes: 'High-frequency repeat customer with excellent retention score.',
  },
  {
    id: 4,
    name: 'Peter Parker',
    email: 'peter@dailybugle.com',
    phone: '+91 99870 44112',
    location: 'Pune',
    orders: 3,
    spent: 420,
    status: 'Active',
    joined: 'Feb 2025',
    lastOrder: '17 Feb 2026',
    segment: 'Walk-in',
    notes: 'Prefers entry-level items and discount-led reactivation campaigns.',
  },
  {
    id: 5,
    name: 'Bruce Wayne',
    email: 'bruce@waynecorp.com',
    phone: '+1 212 555 0199',
    location: 'Gotham',
    orders: 89,
    spent: 245000,
    status: 'VIP Plus',
    joined: 'Dec 2023',
    lastOrder: '07 Apr 2026',
    segment: 'Concierge',
    notes: 'Top revenue customer with frequent custom requests and premium support.',
  },
].map(normalizeCustomer);

export const CustomerProvider = ({ children }) => {
    const [customers, setCustomers] = useState(() => {
        const savedCustomers = localStorage.getItem(STORAGE_KEY);
        return savedCustomers ? JSON.parse(savedCustomers).map(normalizeCustomer) : MOCK_CUSTOMERS;
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
    }, [customers]);

    const addCustomer = (newCustomer) => {
        const customerWithId = normalizeCustomer({
            ...newCustomer,
            id: Date.now(),
            orders: 0,
            spent: 0,
            joined: formatMonthYear(),
            lastOrder: 'No orders yet',
        });

        setCustomers((prevCustomers) => [customerWithId, ...prevCustomers]);
    };

    const updateCustomer = (updatedCustomer) => {
        setCustomers((prevCustomers) =>
            prevCustomers.map((customer) =>
                customer.id === updatedCustomer.id
                    ? normalizeCustomer({ ...customer, ...updatedCustomer })
                    : customer,
            ),
        );
    };

    const deleteCustomer = (id) => {
        setCustomers((prevCustomers) => prevCustomers.filter((customer) => customer.id !== id));
    };

    return (
        <CustomerContext.Provider value={{ customers, addCustomer, updateCustomer, deleteCustomer }}>
            {children}
        </CustomerContext.Provider>
    );
};
