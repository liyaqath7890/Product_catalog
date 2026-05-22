import React from 'react';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './authentication/components/AuthProvider';
import { ProductProvider } from './context/ProductContext';
import { CategoryProvider } from './context/CategoryContext';
import { OrderProvider } from './context/OrderContext';
import { CustomerProvider } from './context/CustomerContext';
import { ToastProvider } from './components/feedback/ToastProvider';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <ProductProvider>
          <CategoryProvider>
            <OrderProvider>
              <CustomerProvider>
                <AppRoutes />
              </CustomerProvider>
            </OrderProvider>
          </CategoryProvider>
        </ProductProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
