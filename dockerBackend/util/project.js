const fs = require('fs/promises');
const path = require('path')

const getFileStruct = async function getFileStructure(dir) {
    const ans = [];
    async function solver(curPathname, currArr, level) {
        const files = await fs.readdir(curPathname);
        for (let i of files) {
            const newPathname = path.join(curPathname, i);
            const stats = await fs.stat(newPathname);
            const fullPath = path.resolve(newPathname);
            const extension = path.extname(newPathname);
            if (stats.isDirectory()) {
                currArr.push({ name: i, extension: null, fullPath: fullPath, sortName: 'a' + i, path: newPathname, children: [], level: level });
                await solver(newPathname, currArr[currArr.length - 1].children, level + 1);
            } else {
                currArr.push({ name: i, extension: extension, fullPath: fullPath, sortName: 'z' + i, path: newPathname, children: null, level: level });
            }
        }
        const stats = await fs.stat(curPathname);
        currArr.sort((a, b) => {
            if (a.sortName > b.sortName) {
                return 1
            } else {
                return -1
            }
        })
    }
    await solver(dir, ans, 0);
    return ans;
}

exports.getFileStruct = getFileStruct;