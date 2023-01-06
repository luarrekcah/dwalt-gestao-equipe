import axios from 'axios';
export const createNotification = (title, body, key, customer) => {
  if (!title || !body || !key || !customer) {
    return console.warn('Missing params');
  }

  const params = new URLSearchParams({
    title,
    body,
    key,
    customer,
  }).toString();

  console.log(params);

  axios
    .post(`https://connect.dlwalt.com/api/v1/notification?${params}`)
    .then(r => {
      console.log(r.data);
    });
};
