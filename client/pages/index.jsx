import React from 'react';
// import buildClient from '../api/build-client';

const Index = ({ currentUser }) => {
  return <h1>You are {currentUser ? '' : 'not '}signed in</h1>;
};

Index.getInitialProps = async (context, client, currentUser) => {
  // const client = buildClient(context);
  // const { data } = await client.get('/api/users/currentuser');

  // return data;
  return {};
};

export default Index;
