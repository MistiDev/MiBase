const fs = require('file-system');
const customBox = require('./boxes.js');

let connected = false;

if (!fs.existsSync("mibase-config.json")) {
    fs.writeFileSync('./mibase-config.json', '{\n"type":"default", // default, discord, sharding\n"path": "./MiBase",\n"tables": ["main"]\n}');
}

const configData = JSON.parse(fs.readFileSync('mibase-config.json'));
const path = configData.path;
const type = configData.type;
const tables = configData.tables;

function connect() {
    if(type !== "default" && type !== "discord" && type !== 'sharding') {
        console.log(`Тип базы данных ${type} не существует в MiBase!`);
        return;
    }


    if(connected) {
        return;
    }


    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
        fs.mkdirSync(path + '/shards');
        tables.forEach(name => {
            fs.mkdirSync(path + '/' + name, { recursive: true })
            fs.writeFileSync(`${path}/${name}/${name}.sql`, '{}');
        });
        customBox(
            [
              {
                text: `Successfully connected database`,
                textColor: "blue",
              },
            ],
            "white",
            { text: "       MiBase        ", textColor: "magenta" }
            );
        connected = true;
    } else {
        tables.forEach(name => {
            if (!fs.existsSync(path + '/' + name)) {
            fs.mkdirSync(path + '/' + name, { recursive: true })
            fs.writeFileSync(`${path}/${name}/${name}.sql`, '{}');
            }
        });

        if (!fs.existsSync(path + '/shards')) {
            fs.mkdirSync(path + '/shards');
        }

        customBox(
            [
              {
                text: `Successfully connected database`,
                textColor: "blue",
              },
            ],
            "white",
            { text: "       MiBase        ", textColor: "magenta" }
            );
        connected = true;
    }
};

function insert(key, value, table) {
    if(!connected) {
        console.log("MiBase не подключена!")
        return;
    }

    if (typeof table === 'undefined') {
        let tableToWrite = tables[0];
        filePath = path + '/' + `${tableToWrite}/` + `${tableToWrite}.sql`;
    } else {
        if (tables.indexOf(table)!==-1) {
        filePath = path + '/' + table + '/' + table + '.sql';
        } else {
        console.log(`Таблица ${table} не найдена!`);
        return;
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
        return;
    }

    if (type === 'sharding') {
        if (!fs.existsSync(path + '/shards/' + table +'.sql')) {
            console.log(`Блок ${table} не найден!`)
            return;
        } else {
            filePath = path + '/shards/' + table + '.sql';
        }
    } else {
        if (typeof table === 'undefined') {
            let tableToRead = tables[0];
            filePath = path + '/' + `${tableToRead}/` + `${tableToRead}.sql`;
        } else {
            if (tables.indexOf(table)!==-1) {
            filePath = path + '/' + table + '/' + table + '.sql';
            } else {
            console.log(`Таблица ${table} не найдена!`);
            return;
            }
        }
    }

    data = {};

    if (fs.existsSync(filePath)) {
        const jsonData = fs.readFileSync(filePath);
        data = JSON.parse(jsonData);
    }

    if (typeof data[key] === 'undefined') {
        value = 'undefined';
    } else {
        value = data[key];
    }
    

    if (type === 'sharding' || type === 'discord') {
        return value;
    } else {
        console.log(value);
    }
};

function remove(key, table) {
    if(!connected) {
        console.log("MiBase не подключена!")
        return;
    }

    if (typeof table === 'undefined') {
        let tableToWrite = tables[0];
        filePath = path + '/' + `${tableToWrite}/` + `${tableToWrite}.sql`;
    } else {
        if (tables.indexOf(table)!==-1) {
        filePath = path + '/' + table + '/' + table + '.sql';
        } else {
        console.log(`Таблица ${table} не найдена!`);
        return;
        }
    }

    data = {};

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
        return;
    }

    if (typeof table === 'undefined') {
        let tableToWrite = tables[0];
        filePath = path + '/' + `${tableToWrite}/` + `${tableToWrite}.sql`;
    } else {
        if (tables.indexOf(table)!==-1) {
        filePath = path + '/' + table + '/' + table + '.sql';
        } else {
        console.log(`Таблица ${table} не найдена!`);
        return;
        }
    }

    data = {};

    fs.writeFileSync(filePath, JSON.stringify(data))
}

function search(value, table) {
    if(!connected) {
        console.log("MiBase не подключена!")
        return;
    }

    if (typeof table === 'undefined') {
        let tableToRead = tables[0];
        filePath = path + '/' + `${tableToRead}/` + `${tableToRead}.sql`;
    } else {
        if (tables.indexOf(table)!==-1) {
        filePath = path + '/' + table + '/' + table + '.sql';
        } else {
        console.log(`Таблица ${table} не найдена!`);
        return;
        }
    }

    if (fs.existsSync(filePath)) {
        const jsonData = fs.readFileSync(filePath);
        data = JSON.parse(jsonData);
    }

    let result;
    for (let key in data) {
        if (data[key] === value) {
            result = key
        }
    }


    if (typeof result === 'undefined') {
        return;
    } else {
        if (type === 'default') {
            console.log(result);
        } else {
            return result;
        }
    }
}

function close() {
    if(!connected) {
        console.log("MiBase не подключена!")
        return;
    }

    connected = false;
}

module.exports = { connect, insert, select, remove, clearData, search, close };