import { useEffect } from 'react';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';

const Signout = () => {
  const { request } = useRequest({
    url: '/api/users/signout',
    method: 'post',
    body: {},
    onSuccess: () => Router.push('/')
  });

  useEffect(() => {
    request();
  }, []);

  return <div>Signing you out...</div>;
};

export default Signout;
