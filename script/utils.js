const fs = require('fs');
const path = require('path');

function deleteFolder(folderPath) {
  if (!fs.existsSync(folderPath)) {
    console.log(folderPath + ':路径不存在');
    return;
  }

  if (fs.lstatSync(folderPath).isDirectory()) {
    // 读取文件夹内容
    const files = fs.readdirSync(folderPath);
    for (const file of files) {
      const curPath = path.join(folderPath, file);
      deleteFolder(curPath);
    }
    // 删除文件夹自身
    fs.rmdirSync(folderPath);
  } else {
    // 删除文件
    fs.unlinkSync(folderPath);
  }
}

module.exports = {
  deleteFolder,
};
