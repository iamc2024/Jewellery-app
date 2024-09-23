'use client';



import Script from 'next/script';
import { useSessionContext } from '../SessionContextProvider';
import { useState } from 'react';
import LoadingButton from '@/components/LoadingButton';

function Payment() {

  const {  userData } = useSessionContext();

  if(userData.isMember) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-semibold mb-4">You are already a member!</h2>

      </div>

    )
  }

  //
  const subscriptionPlans = [
    {
      id: 'monthly',
      name: 'Monthly Subscription',
      price: 1,
      duration: 'month',
      description: 'Access all features on a monthly basis.',
    },
    {
      id: 'annual',
      name: 'Annual Subscription',
      price: 1000,
      duration: 'year',
      description: 'Save ₹200 with our annual plan!',
      discount: {
        amount: 200,
        percentage: 16.67,
      },
    },
  ];

  
  const [selectedPlan, setSelectedPlan] = useState(subscriptionPlans[0]); 
  const [loading, setLoading] = useState(false);
  console.log(selectedPlan.price)

  const createOrderId = async () => {
    try {
      const response = await fetch('/api/membership', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: selectedPlan.price * 100, 
          plan: selectedPlan.id, 
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return data.orderId;
    } catch (error) {
      console.error('There was a problem with your fetch operation:', error);
    }
  };

  const processPayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const orderId: string = await createOrderId();
      const options = {
        key: process.env.key_id,
        amount: selectedPlan.price * 100, 
        currency: 'INR',
        name: userData.displayName,
        description: selectedPlan.description,
        order_id: orderId,
        handler: async function (response: any) {
          const data = {
            orderCreationId: orderId,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          };

          const verifyResponse = await fetch('/api/verify', {
            method: 'POST',
            body: JSON.stringify({...data, amount: selectedPlan.price} ),
            headers: { 'Content-Type': 'application/json' },
          });

          const verifyResult = await verifyResponse.json();

          if (verifyResult.isOk) {
            alert('Payment successful! You are now a member.');
            window.location.reload();
          } else {
            alert('Payment verification failed: ' + verifyResult.message);
          }
        },
        prefill: {
          name: userData.displayName,
          email: userData.email,
        },
        theme: {
          color: '#3399cc',
        },
      };
      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', function (response: any) {
        alert(response.error.description);
      });
      paymentObject.open();
    } catch (error) {
      console.log(error);
      alert('Payment processing failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = (planId: string) => {
    const plan = subscriptionPlans.find((p) => p.id === planId);
    if (plan) {
      setSelectedPlan(plan);
    }
  };

  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-semibold text-center mb-8">Select Your Subscription Plan</h2>
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          {subscriptionPlans.map((plan) => (
            <div
              key={plan.id}
              className={`flex-1 border rounded-lg p-6 cursor-pointer transition transform hover:scale-105
                ${selectedPlan.id === plan.id ? 'border-blue-500 shadow-lg bg-blue-50' : 'border-gray-300'}
              `}
              onClick={() => handleSelectPlan(plan.id)}
            >
              <h3 className="text-xl font-bold mb-4">{plan.name}</h3>
              <p className="text-3xl font-extrabold mb-2">₹{plan.price}{plan.duration === 'year' && '/year'}</p>
              {plan.discount && (
                <p className="text-green-600 font-semibold mb-4">
                  Save ₹{plan.discount.amount} ({plan.discount.percentage}%)
                </p>
              )}
              <p className="text-gray-700">{plan.description}</p>
            </div>
          ))}
        </div>
        <form onSubmit={processPayment} className="text-center">
          <LoadingButton loading={loading} type="submit" className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
            Pay ₹{selectedPlan.price}
          </LoadingButton>
        </form>
      </div>
    </>
  );
}

export default Payment;
