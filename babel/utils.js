const fs = require('fs');

const writeFileText = (path, data, encode = 'utf-8') => {
    return fs.writeFileSync(path, data, {
        encoding: 'utf-8',
    });
};

module.exports = { writeFileText };
