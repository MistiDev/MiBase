const fs = require('file-system');

let connected = false;

if (!fs.existsSync("mibase-config.json")) {
    fs.writeFileSync('./mibase-config.json', '{"path": "./MiBase","tables": ["main"]}');
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

    if (typeof table === 'undefined') {
        let tableToWrite = tables[0];
        filePath = path + '/' + `${tableToWrite}/` + `${tableToWrite}.sql`;
    } else {
        if (tables.indexOf(table)!==-1) {
        filePath = path + '/' + table + '/' + table + '.sql';
        } else {
        console.log(`Таблица ${table} не найдена!`);
        return
        }
    }

    let data = {};

    if (fs.existsSync(filePath)) {
        const jsonData = fs.readFileSync(filePath);
        data = JSON.parse(jsonData);
    }

    data[key] = value.toString();
    
    fs.writeFileSync(filePath, JSON.stringify(data));
};

function select(key, table) {
    if(!connected) {
        console.log("MiBase не подключена!")
        return
    }

    if (typeof table === 'undefined') {
        let tableToRead = tables[0];
        filePath = path + '/' + `${tableToRead}/` + `${tableToRead}.sql`;
    } else {
        if (tables.indexOf(table)!==-1) {
        filePath = path + '/' + table + '/' + table + '.sql';
        } else {
        console.log(`Таблица ${table} не найдена!`);
        return
        }
    }

    data = {};

    if (fs.existsSync(filePath)) {
        const jsonData = fs.readFileSync(filePath);
        data = JSON.parse(jsonData);
    }
    
    value = data[key]
    
    return value;
};

function remove(key, table) {
    if(!connected) {
        console.log("MiBase не подключена!")
        return
    }

    data = {};
    let filePath = path + '/' + table + '/' + table + '.sql';

    if (!tables.includes(table)) {
        let tableToWrite = tables[0];
        filePath = path + '/' + `${tableToWrite}/` + `${tableToWrite}.sql`;
    }

    if (fs.existsSync(filePath)) {
        const jsonData = fs.readFileSync(filePath);
        data = JSON.parse(jsonData);
    }

    if(data.hasOwnProperty(key)) {
        delete data[key]

        fs.writeFileSync(filePath, JSON.stringify(data));
    }
}

function clearData(table) {
    if(!connected) {
        console.log("MiBase не подключена!")
        return
    }

    data = {};
    let filePath = path + '/' + table + '/' + table + '.sql';

    if (!tables.includes(table)) {
        let tableToWrite = tables[0];
        filePath = path + '/' + `${tableToWrite}/` + `${tableToWrite}.sql`;
    }

    fs.writeFileSync(filePath, JSON.stringify(data))
}

function search(value, table) {
    if(!connected) {
        console.log("MiBase не подключена!")
        return
    }

    let filePath = path + '/' + table + '/' + table + '.sql';

    if (!tables.includes(table)) {
        let tableToRead = tables[0];
        filePath = path + '/' + `${tableToRead}/` + `${tableToRead}.sql`;
    }

    if (fs.existsSync(filePath)) {
        const jsonData = fs.readFileSync(filePath);
        data = JSON.parse(jsonData);
    }

    let result;
    for (let key in data) {
        if (data[key].includes(value)) {
            result = key
        }
    }

    console.log(result)
    return result
}

function close() {
    if(!connected) {
        console.log("MiBase не подключена!")
        return
    }

    console.log("MiBase отключена!");
    connected = false;
}

module.exports = { connect, insert, select, remove, clearData, search, close };
