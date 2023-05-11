import React, { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const NewTicket = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const { request, errors } = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: {
      title,
      price
    },
    onSuccess: () => Router.push('/')
  });

  const onSubmit = (e) => {
    e.preventDefault();
    request();
  };

  const onBlur = () => {
    const value = parseFloat(price);

    if (isNaN(value)) {
      return;
    }

    setPrice(value.toFixed(2));
  };

  return (
    <div>
      <h1>Create a ticket</h1>
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="price">Price</label>
          <input
            id="price"
            className="form-control"
            type="number"
            onBlur={onBlur}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        {errors}
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default NewTicket;
