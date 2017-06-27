var fs = require("fs");
var path = "C:/Users/Administrator/Desktop/a.html";

function read() {
  fs.readFile(path, "utf8", function (error, data) {
    if (error) throw error;
    console.log(data);
  });
}



var txt = "大家要好好学习NodeJS啊！！！";

fs.writeFile("C:/Users/Administrator/Desktop/jd.html", txt, function (err) {
  if (err) throw err;
  console.log("File Saved !"); //文件被保存
});