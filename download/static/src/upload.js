// 文件下拉选择select列表
let $list = document.getElementById('file-list');
let $input = document.getElementById('upload-file');

window.onload = function () {

    // 页面加载完成后，先刷新一下文件列表
    refreshFile();
};

// 获取最新的文件名称列表，然后显示在$list中
async function refreshFile () {
    let oldSelect = $list.value;
    let res = await fetch('/upload/get-files');
    let {list} = await res.json();

    let $options = document.createDocumentFragment();
    (list).forEach((f) => {
        let $opt = document.createElement('option');
        $opt.value = f;
        $opt.text = f;
        $options.appendChild($opt);
    });
    $list.innerHTML = '';
    $list.appendChild($options);

    if (oldSelect && list.includes(oldSelect)) {
        $list.value = oldSelect; 
    }
    
}

// 用户选择了文件后，上传
async function fileSelected() {
    let file = $input.files[0];

    if (!file) {
        alert('please select file first before upload');
        return;
    }
    
    let formData = new FormData();
    formData.append('file', file);
    let res = await fetch('/upload/save-file', {
        body: formData,
        method: 'post'
    });

    let result = await res.json();

    alert('result:'+ result.message);
}

// 用户上传的文件中，下载用户在select中选择的文件
async function downloadUpload() {
    let file = $list.value;

    if (!file) {
        alert('please select file first before download');
        return;
    }

    let res = await fetch(`/upload/download-file?name=${file}`);
    let blob = await res.blob();
    let a = document.createElement('a');
    a.href = window.URL.createObjectURL(blob);
    a.download = res.headers.get('Content-Disposition').split(';')[1].split('=')[1];
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

}