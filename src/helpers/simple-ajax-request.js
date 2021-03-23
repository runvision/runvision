export const simpleAjaxRequest = async (
  method,
  url,
  data
) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.onreadystatechange = (event) => {
      if (xhr.readyState !== XMLHttpRequest.DONE) return;
      if (xhr.status === 200) {
        resolve(JSON.parse(xhr.response));
      } else {
        reject(JSON.parse(event.currentTarget.response));
      }
    };
    xhr.send(data);
  });
};
