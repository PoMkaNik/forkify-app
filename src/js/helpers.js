import { TIMEOUT_SECONDS } from './config.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchData = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    // to avoid fetch to run forever
    const res = await Promise.race([fetchData, timeout(TIMEOUT_SECONDS)]);
    const data = await res.json();

    // if error - get error msg from API response
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    return data;
  } catch (err) {
    // re-throw the error to handle it in model.js
    // or where this helper function will be used
    throw err;
  }
};

/* separate GET and POST requests

export const getJSON = async function (url) {
  try {
    // to avoid fetch to run forever
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SECONDS)]);
    const data = await res.json();

    // if error - get error msg from API response
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    return data;
  } catch (err) {
    // re-throw the error to handle it in model.js
    // or where this helper function will be used
    throw err;
  }
};

export const sendJSON = async function (url, uploadData) {
  try {
    const fetchUpload = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData),
    });
    // to avoid fetch to run forever
    const res = await Promise.race([fetchUpload, timeout(TIMEOUT_SECONDS)]);
    const data = await res.json();

    // if error - get error msg from API response
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    return data;
  } catch (err) {
    // re-throw the error to handle it in model.js
    // or where this helper function will be used
    throw err;
  }
};
*/