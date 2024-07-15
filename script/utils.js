const fs = require('fs');
const path = require('path');

// 这个方法可以被 fse.emptyDirSync 代替了
// function deleteFolder(folderPath) {
//   if (!fs.existsSync(folderPath)) {
//     return console.log(folderPath + ':路径不存在');
//   }

//   if (fs.lstatSync(folderPath).isDirectory()) {
//     // 读取文件夹内容
//     const files = fs.readdirSync(folderPath);
//     for (const file of files) {
//       const curPath = path.join(folderPath, file);
//       deleteFolder(curPath);
//     }
//     // 删除文件夹自身
//     fs.rmdirSync(folderPath);
//   } else {
//     // 删除文件
//     fs.unlinkSync(folderPath);
//   }
// }

// 获取文件夹内容
function getDirFiles(folderPath) {
  if (!fs.existsSync(folderPath)) {
    return console.log(folderPath + ':路径不存在');
  }

  if (fs.lstatSync(folderPath).isDirectory()) {
    return fs.readdirSync(folderPath);
  } else {
    console.log(folderPath + '不是文件夹');
    return;
  }
}

module.exports = {
  getDirFiles,
};
