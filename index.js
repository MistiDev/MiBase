const fs = require('file-system');
const folderPath = './MiBase';

let connected = false;

function connect() {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
        fs.mkdirSync(folderPath + '/backups');
        fs.writeFileSync('./MiBase/main.sql', '{}')
        console.log('MiBase подключена!');
        connected = true;
    } else {
        console.log("MiBase подключена!");
        connected = true;
    }
};

function insert(key, value) {
    if(!connected) {
        console.log("MiBase не подключена!")
        return
    }

    let data = {};
    if (fs.existsSync('./MiBase/main.sql')) {
        const jsonData = fs.readFileSync('./MiBase/main.sql');
        data = JSON.parse(jsonData);
    }

    data[key] = value;
    
    fs.writeFileSync('./MiBase/main.sql', JSON.stringify(data));
};

function select(key) {
    if(!connected) {
        console.log("MiBase не подключена!")
        return
    }

    data = {}

    if (fs.existsSync('./MiBase/main.sql')) {
        const jsonData = fs.readFileSync('./MiBase/main.sql');
        data = JSON.parse(jsonData);
    }
    
    value = data[key]
    
    return value;
};

function remove(key) {
    if(!connected) {
        console.log("MiBase не подключена!")
        return
    }

    data = {}

    if (fs.existsSync('./MiBase/main.sql')) {
        const jsonData = fs.readFileSync('./MiBase/main.sql');
        data = JSON.parse(jsonData);
    }

    if(data.hasOwnProperty(key)) {
        delete data[key]

        fs.writeFileSync('./MiBase/main.sql', JSON.stringify(data));
    }
}

function clearData() {
    if(!connected) {
        console.log("MiBase не подключена!")
        return
    }

    data = {}

    fs.writeFileSync('./MiBase/main.sql', JSON.stringify(data))
}

function search(value) {
    if(!connected) {
        console.log("MiBase не подключена!")
        return
    }

    if (fs.existsSync('./MiBase/main.sql')) {
        const jsonData = fs.readFileSync('./MiBase/main.sql');
        data = JSON.parse(jsonData);
    }

    let result;
    for (let key in data) {
        if (data[key].includes(value)) {
            results = key
        }
    }

    return result
}

function backup() {
    if(!connected) {
        console.log("MiBase не подключена!")
        return
    }

    if (fs.existsSync('./MiBase/main.sql')) {
        const jsonData = fs.readFileSync('./MiBase/main.sql');
        data = JSON.parse(jsonData);
    }

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    fs.writeFileSync(`./MiBase/backups/backup.sql`, JSON.stringify(data));
}

function restore() {
    if(!connected) {
        console.log("MiBase не подключена!")
        return
    }

    if (fs.existsSync('./MiBase/backup.sql')) {
        const jsonData = fs.readFileSync('./MiBase/backup.sql');
        data = JSON.parse(jsonData);
    }

    fs.writeFileSync(`./MiBase/backups/main.sql`, JSON.stringify(data));
}

module.exports = { connect, insert, select, remove, clearData, search, backup, restore};
