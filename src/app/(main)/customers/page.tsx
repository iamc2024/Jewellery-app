import type { Metadata } from 'next';
import CustomersTable from './customersTable';
import AllCustomers from './AllCustomer';

export const metadata: Metadata = {
   title: 'customers',
};

const CustomersPage = () => {
   return (
      <div className="flex w-full min-w-0 flex-col items-center gap-5">
         <h1 className="text-center text-2xl font-bold">All Customers</h1>
         
         <AllCustomers />
      </div>
   );
};

export default CustomersPage;
