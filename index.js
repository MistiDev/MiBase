const fs = require('file-system');

let connected = false;

if (!fs.existsSync("mibase-config.json")) {
    fs.writeFileSync('./mibase-config.json', '{"path":"./MiBase", "tables":["main"]}');
}

const configData = JSON.parse(fs.readFileSync('mibase-config.json'));
const path = configData.path;
const tables = configData.tables;

function connect() {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
        tables.forEach(name => {
            fs.mkdirSync(path + '/' + name, { recursive: true })
            fs.writeFileSync(`${path}/${name}/${name}.sql`, '{}');
        });
        console.log('MiBase подключена!');
        connected = true;
    } else {
        tables.forEach(name => {
            if (!fs.existsSync(path + '/' + name)) {
            fs.mkdirSync(path + '/' + name, { recursive: true })
            fs.writeFileSync(`${path}/${name}/${name}.sql`, '{}');
            }
        });
        console.log("MiBase подключена!");
        connected = true;
    }
};

function insert(key, value, table) {
    if(!connected) {
        console.log("MiBase не подключена!")
        return
    }

    let data = {};
    let filePath = path + '/' + table + '/' + table + '.sql';

    if (!tables.includes(table)) {
            let tableToWrite = tables[0];
            filePath = path + '/' + `${tableToWrite}/` + `${tableToWrite}.sql`;
    }

    if (fs.existsSync(filePath)) {
        const jsonData = fs.readFileSync(filePath);
        data = JSON.parse(jsonData);
    }

    data[key] = value;
    
    fs.writeFileSync(filePath, JSON.stringify(data));
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

    if (fs.existsSync('./MiBase/backups/backup.sql')) {
        const jsonData = fs.readFileSync('./MiBase/backups/backup.sql');
        data = JSON.parse(jsonData);
    }

    fs.writeFileSync(`./MiBase/main.sql`, JSON.stringify(data));
}

module.exports = { connect, insert, select, remove, clearData, search, backup, restore };
