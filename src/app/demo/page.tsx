'use client';

import html2pdf from 'html2pdf.js';

const Component = () => {
   const handleClick = () => {
      const element = document.querySelector('#pdf');
      html2pdf(element);
   };

   const invoice = {
      id: '3906ef4e-c5a3-4e3c-97cb-d83fc7a90d48',
      customerId: '58f1f285-d685-45f7-a32b-3be4666a211e',
      totalAmount: 1.019898,
      paidAmount: 1,
      dueAmount: 0.01989800000000019,
      rateId: '65971f59-ac84-4908-8e16-d5746cae1716',
      adminId: 'zeb3vn37exs2nbu4',
      createdAt: '2024-09-23T05:47:05.164Z',
      products: [
         {
            id: '697df286-d948-47e7-894e-07cad6f48a5b',
            description: '1',
            purity: 'K14',
            netQuantity: 1,
            GrossWeight: 1,
            GrossProductPrice: 1,
            netStoneWeight: 1,
            stonePrice: 1,
            MakingCharge: 1,
            discount: 1,
            InvoiceId: '3906ef4e-c5a3-4e3c-97cb-d83fc7a90d48',
            CGST: 1,
            SGST: 1,
            productValue: 1.019898,
            MakingChargeValue: 0.01,
            CGSTValue: 0.01,
            SGSTValue: 0.01,
            DiscountValue: 0.01,
         },
      ],
      customer: {
         id: '58f1f285-d685-45f7-a32b-3be4666a211e',
         name: 'Kapil Bamotriya',
         mobileNumber: '0000000000',
         address: 'adresss',
         adminId: 'zeb3vn37exs2nbu4',
      },
      rate: {
         id: '65971f59-ac84-4908-8e16-d5746cae1716',
         date: '2024-09-23',
         gold14K: 1500,
         gold18K: 1500,
         gold22K: 1500,
         gold24K: 1500,
         Platinum95: 1500,
         adminId: 'zeb3vn37exs2nbu4',
         createdAt: '2024-09-23T05:04:23.790Z',
      },
      user: {
         id: 'zeb3vn37exs2nbu4',
         username: 'testuser',
         displayName: 'testuser',
         passwordHash:
            '$argon2id$v=19$m=19456,t=2,p=1$332i/its2PNWd6QUT2P3PA$e5UfECYU6wP2OOk95H6Pqd3Rv6W+WeeTwCki2JXUMWY',
         googleId: null,
         email: 'test@email.com',
         companyName: 'test store',
         address: 'test address',
         invoiceCount: 5,
         isMember: false,
         membershipId: null,
         membershipStart: null,
         membershipEnd: null,
         createdAt: '2024-09-23T04:55:32.777Z',
      },
   };
   return (
      <div>
         <button onClick={handleClick}>Download</button>
         <div id="pdf">
            <div className="mx-auto h-[297mm] w-[210mm] border">
               <div className="box-border border border-black">
                  <div className="flex justify-between border-b border-black px-3 py-1">
                     <p className="font-bold">TAX INVOICE</p>
                     <p className="">{invoice.rate.date}</p>
                  </div>
                  <div className="flex justify-between border-b border-black p-2 pb-7 leading-6">
                     <div className="w-[30%] space-y-2">
                        <p className="font-bold">{invoice.user.companyName}</p>
                        <p className="text-sm">{invoice.user.address}</p>
                     </div>
                     {/* this is customer details */}
                     <div className="w-[30%]">
                        <p className="font-bold">{invoice.user.companyName}</p>
                        <p>{invoice.customer.name}</p>
                        <p className="text-sm">
                           {invoice.customer.address}
                           <br />
                           <span className="font-bold">
                              Ph: {invoice.customer.mobileNumber}
                           </span>
                        </p>
                     </div>
                  </div>
                  {/* these are rates of  gold which is optional so left empty*/}
                  <div></div>
                  {/* This is about product description */}
                  <div>
                     {/* add two two row table for rates here  */}
                     <table className="w-full border-b border-black py-2 text-[12px]">
                        <thead>
                           <tr>
                              <th className="whitespace-normal px-2 text-start font-bold">
                                 Date
                              </th>
                              <th className="whitespace-normal px-2 text-start">
                                 Gold 14K
                              </th>
                              <th className="whitespace-normal px-2 text-start">
                                 Gold 18K
                              </th>
                              <th className="whitespace-normal px-2 text-start">
                                 Gold 22K
                              </th>
                              <th className="whitespace-normal px-2 text-start">
                                 Gold 24K
                              </th>
                              <th className="whitespace-normal px-2 text-start">
                                 Platinum 95
                              </th>
                           </tr>
                        </thead>
                        <tbody>
                           <tr>
                              <td className="px-2">₹{invoice.rate.date}</td>
                              <td className="px-2">₹{invoice.rate.gold14K}</td>
                              <td className="px-2">₹{invoice.rate.gold18K}</td>
                              <td className="px-2">₹{invoice.rate.gold22K}</td>
                              <td className="px-2">₹{invoice.rate.gold24K}</td>
                              <td className="px-2">
                                 ₹{invoice.rate.Platinum95}
                              </td>
                           </tr>
                        </tbody>
                     </table>
                     <table className="w-full border-b border-black py-2 text-center text-[9px]">
                        <thead className="border-b-2 border-black">
                           <tr>
                              <th className="whitespace-normal px-3 font-extrabold">
                                 Product
                              </th>
                              <th className="whitespace-normal px-4 font-extrabold">
                                 Purity
                              </th>
                              <th className="whitespace-normal px-1 font-extrabold">
                                 Net Quantity
                              </th>
                              <th className="whitespace-normal px-1 font-extrabold">
                                 Gross Weight (g)
                              </th>
                              <th className="whitespace-normal px-1 font-extrabold">
                                 Gross Product Price
                              </th>
                              <th className="whitespace-normal px-1 font-extrabold">
                                 Net Stone Weight (g)
                              </th>
                              <th className="whitespace-normal px-1 font-extrabold">
                                 Stone Price
                              </th>
                              <th className="whitespace-normal px-1 font-extrabold">
                                 Making Charge(
                                 {invoice.products[0].MakingCharge}%)
                              </th>
                              <th className="whitespace-normal px-1 font-extrabold">
                                 Discount ({invoice.products[0].discount}%)
                              </th>
                              {/* <th className='px-1  whitespace-normal font-extrabold'>Invoice ID</th> */}
                              <th className="whitespace-normal px-1 font-extrabold">
                                 CGST ({invoice.products[0].CGST}%)
                              </th>
                              <th className="whitespace-normal px-1 font-extrabold">
                                 SGST ({invoice.products[0].SGST}%)
                              </th>
                              <th className="whitespace-normal px-1 font-extrabold">
                                 Product Value
                              </th>
                           </tr>
                        </thead>
                        <tbody>
                           {invoice.products.map((product) => (
                              <tr key={product.id}>
                                 <td className="px-1 py-1 capitalize">
                                    {product.description}
                                 </td>
                                 <td className="px-1 py-1">
                                    {product.purity.startsWith('K')
                                       ? `G-${product.purity.slice(1)}carat`
                                       : product.purity}
                                 </td>
                                 <td className="px-1 py-1">
                                    {product.netQuantity}N
                                 </td>
                                 <td className="px-1 py-1">
                                    {product.GrossWeight}
                                 </td>
                                 <td className="px-1 py-1">
                                    {product.GrossProductPrice}
                                 </td>
                                 <td className="px-1 py-1">
                                    {product.netStoneWeight}
                                 </td>
                                 <td className="px-1 py-1">
                                    {product.stonePrice}
                                 </td>
                                 <td className="px-1 py-1">
                                    {(product.MakingCharge *
                                       product.GrossProductPrice) /
                                       100}
                                 </td>
                                 <td className="px-1 py-1">
                                    {(product.discount *
                                       product.GrossProductPrice) /
                                       100}
                                 </td>
                                 <td className="px-1 py-1">
                                    {(product.CGST *
                                       product.GrossProductPrice) /
                                       100}
                                 </td>
                                 <td className="px-1 py-1">
                                    {(product.SGST *
                                       product.GrossProductPrice) /
                                       100}
                                 </td>
                                 <td className="px-1 py-1">
                                    {product.productValue}
                                 </td>
                              </tr>
                           ))}
                           <tr className="border-t border-black">
                              <td className="px-1 py-1 font-extrabold">
                                 Total
                              </td>
                              <td className="px-1 py-1 font-extrabold"></td>
                              <td className="px-1 py-1 font-extrabold">
                                 {invoice.products.reduce(
                                    (sum, product) => sum + product.netQuantity,
                                    0,
                                 )}
                                 N
                              </td>
                              <td className="px-1 py-1 font-extrabold">
                                 {invoice.products.reduce(
                                    (sum, product) => sum + product.GrossWeight,
                                    0,
                                 )}
                              </td>
                              <td className="px-1 py-1 font-extrabold">
                                 ₹
                                 {invoice.products.reduce(
                                    (sum, product) =>
                                       sum + product.GrossProductPrice,
                                    0,
                                 )}
                              </td>
                              <td className="px-1 py-1 font-extrabold">
                                 {invoice.products.reduce(
                                    (sum, product) =>
                                       sum + product.netStoneWeight,
                                    0,
                                 )}
                              </td>
                              <td className="px-1 py-1 font-extrabold">
                                 {invoice.products.reduce(
                                    (sum, product) => sum + product.stonePrice,
                                    0,
                                 )}
                              </td>
                              <td className="px-1 py-1 font-extrabold">
                                 {invoice.products.reduce(
                                    (sum, product) =>
                                       sum +
                                       (product.MakingCharge *
                                          product.GrossProductPrice) /
                                          100,
                                    0,
                                 )}
                              </td>
                              <td className="px-1 py-1 font-extrabold">
                                 {invoice.products.reduce(
                                    (sum, product) =>
                                       sum +
                                       (product.discount *
                                          product.GrossProductPrice) /
                                          100,
                                    0,
                                 )}
                              </td>
                              <td className="px-1 py-1 font-extrabold">
                                 {invoice.products.reduce(
                                    (sum, product) =>
                                       sum +
                                       (product.CGST *
                                          product.GrossProductPrice) /
                                          100,
                                    0,
                                 )}
                              </td>
                              <td className="px-1 py-1 font-extrabold">
                                 {invoice.products.reduce(
                                    (sum, product) =>
                                       sum +
                                       (product.SGST *
                                          product.GrossProductPrice) /
                                          100,
                                    0,
                                 )}
                              </td>
                              <td className="px-1 py-1 font-extrabold">
                                 {invoice.products.reduce(
                                    (sum, product) =>
                                       sum + product.productValue,
                                    0,
                                 )}
                              </td>
                           </tr>
                        </tbody>
                     </table>
                     {/* final product sum and amount */}
                     <div className="flex justify-end gap-5 border-b-2 border-black p-1 font-bold">
                        <p>Product total value: </p>
                        <span> ₹{invoice.totalAmount}</span>
                     </div>
                  </div>
                  {/* payment details and amount paid */}
                  <div className="grid grid-cols-2 border-b-2 border-black">
                     <div className="border-r border-r-black">
                        <h3 className="w-full p-2 font-bold">
                           Payment details
                        </h3>
                        <table className="w-full">
                           <thead className="border-b border-t border-black py-9 text-xs">
                              <tr className="flex w-full justify-between">
                                 <th className="flex-1 px-2 text-start">
                                    Payment Mode
                                 </th>
                                 <th className="flex-1 px-2 text-start">
                                    Customer name
                                 </th>
                                 <th className="flex-1 px-2 text-start">
                                    Amount
                                 </th>
                              </tr>
                           </thead>
                           <tbody>
                              <tr className="flex w-full justify-between">
                                 <td className="flex-1 px-2 text-start">
                                    Cash
                                 </td>
                                 <td className="flex-1 px-2 text-start">
                                    {invoice.customer.name}
                                 </td>
                                 <td className="flex-1 px-2 text-start">
                                    ₹{invoice.paidAmount}
                                 </td>
                              </tr>
                              <tr className="mt-4 flex w-full justify-between border-y-2 border-black">
                                 <td className="flex-1 px-2 text-start font-bold">
                                    Total Amount Paid
                                 </td>
                                 <td className="flex-1 px-2 text-start">
                                    ₹{invoice.paidAmount}
                                 </td>
                              </tr>
                           </tbody>
                        </table>
                     </div>
                     <div>
                        <h3 className="w-full px-2 pt-2 font-bold">
                           Additional Charge
                        </h3>
                        <div className="mb-6 mt-4 flex justify-between border-y-2 border-black">
                           <p className="px-2 font-bold">other charges</p>
                           <p className="px-2">{'some thing'}</p>
                        </div>
                        <table className="w-full">
                           <tbody>
                              <tr>
                                 <td className="border-y border-black px-2 py-1 text-start text-sm font-bold">
                                    Total Amount
                                 </td>
                                 <td className="border-y border-black px-2 py-1 text-start text-sm">
                                    ₹{invoice.totalAmount}
                                 </td>
                              </tr>
                              <tr>
                                 <td className="border-y border-black px-2 py-1 text-start text-sm font-bold">
                                    Total Amount Paid
                                 </td>
                                 <td className="border-y border-black px-2 py-1 text-start text-sm">
                                    ₹{invoice.paidAmount}
                                 </td>
                              </tr>
                              <tr>
                                 <td className="px-2 py-1 text-start text-sm font-bold">
                                    Due Amount
                                 </td>
                                 <td className="px-2 py-1 text-start text-sm">
                                    ₹{invoice.dueAmount}
                                 </td>
                              </tr>
                           </tbody>
                        </table>
                     </div>
                  </div>
                  {/* terms and condition */}
                  <div className="p-2">
                     <p className="text-xs">
                        1.Please note that, the net amount includes Metal Value,
                        Cost of Stones (Precious,Non Precious and other material
                        Charges), Product Making Charges/ Wastage Charges, GST
                        and other taxes (as applicable). Upon specific request
                        detailed statement will be provided.
                        <br />
                        2.Weight verified and Received product in good condition
                        .
                        <br />
                        3.I hereby confirm the purity,weight and value of
                        *CN(Credit note) & have read & accepted all terms and
                        conditions of said CN & further acknowledge the amount
                        stated is correct and accurate.
                        <br />
                        4.NA - Not Applicable, since the product is sold by
                        piece / number.
                        <br />
                        5.If other (non-precious/semiprecious) materials are
                        included in the product, the product gross weight is
                        inclusive of other material weight.
                        <br />
                        6.The consumer can get the purity of hallmarked jewllery
                        / artifacts verified from any of the BIS recognised A &
                        H centre
                        <br />
                        7.The list of A & H recognised centre along with address
                        & contact details is available on the website
                        www.bis.gov.in
                        <br />
                        8.Hallmarking Charges is Rs.45.00/- per piece.
                     </p>
                  </div>
                  <div className="border-y-2 border-black p-3 text-sm font-bold">
                     Read / Understood and agreed to the terms and conditions
                     overleaf
                  </div>
                  <div className="flex border-b border-black">
                     <div className="w-1/2 border-r-2 border-black p-2">
                        <p>
                           <span className="font-bold">Customer Name: </span>
                           {invoice.customer.name}
                        </p>
                        <p className="my-4 font-bold">Customer Signature: </p>
                     </div>
                     <div className="w-1/2 p-2">
                        <p>
                           <span className="font-bold">For: </span>{' '}
                        </p>
                        <p className="my-4 font-bold">Authorized Signature: </p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Component;
