import { useState } from 'react';
import axios from 'axios';

const useRequest = ({ url, method, body, onSuccess, onFailure }) => {
  const [errors, setErrors] = useState(null);

  const request = async (props = {}) => {
    try {
      setErrors(null);

      const response = await axios[method](url, { ...body, ...props });
      onSuccess?.(response.data);

      return response.data;
    } catch (err) {
      console.log(err);
      setErrors(
        <div className="alert alert-danger">
          <h4>Oops.....</h4>
          <ul>
            {err.response?.data.errors.map((error) => (
              <li key={error.message}>{error.message}</li>
            ))}
          </ul>
        </div>
      );
      onFailure?.();
    }
  };

  return { errors, request };
};

export default useRequest;
