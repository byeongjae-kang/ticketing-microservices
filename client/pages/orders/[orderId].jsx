import React, { useEffect, useState } from 'react';
import Router from 'next/router';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/use-request';

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const { request, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: { orderId: order.id },
    onSuccess: (payment) => console.log(payment)
  });
  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };
    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if (timeLeft < 0) {
    return <div>Order expired!</div>;
  }

  return (
    <div>
      Time left to pay: {timeLeft} seconds
      {errors}
      <StripeCheckout
        token={(token) => request({ token: token.id })}
        stripeKey="pk_test_51JFXChKujhaGeZeMXXGBzXcD0vJK23dZWwOgbRwIQLCAXm9x2ms4Py4qtoQP9QwftgnFLQcSK8ibdAHLsBJxc3RU00GjMcxQe1"
        amount={order.ticket.price * 100}
        email={currentUser.email}
        name=""
      />
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default OrderShow;
