export default function request({
    url,
    method='post',
    data,
    headers = {}
}) {
    return new Promise(resolve => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url);
        Object.keys(headers).forEach(k => {
            xhr.setRequestHeader(k, headers[k]);
        });
        xhr.send(data);
        xhr.onload = e => {
            resolve({
                data: e.target.response
            });
        }
    });
}