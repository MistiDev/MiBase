const fs = require('file-system');
const customBox = require('./boxes.js');

class MiBase {
    constructor(config) {
        this.connected = false;
        this.path = config.path || './MiBase';
        this.tables = config.tables || ['main'];
        this.init();
    }

    init() {
        if (!fs.existsSync(this.path)) {
            fs.mkdirSync(this.path);
            this.tables.forEach(name => {
                fs.writeFileSync(`${this.path}/${name}.db`, '{}');
            });
        } else {
            this.tables.forEach(name => {
                if (!fs.existsSync(`${this.path}/${name}.db`)) {
                    fs.writeFileSync(`${this.path}/${name}.db`, '{}');
                }
            });
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
        this.connected = true
    }

    insert(key, value, name) {
        if(!this.connected) {
            console.log("MiBase is not initialized!")
            return;
        }

        let filePath;

        if (typeof name === 'undefined') {
            let tableToWrite = this.tables[0];
            filePath = `${this.path}/${tableToWrite}.db`;
        } else {
            if (this.tables.indexOf(name)!==-1) {
                filePath = `${this.path}/${name}.db`;
            } else {
                console.log(`The table ${name} not found!`);
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
    }

    createTable(name) {
        if(!fs.existsSync(`${this.path}/${name}.db`)) {
            fs.writeFileSync(`${this.path}/${name}.db`, '{}')
        }
    }

    deleteTable(name) {
        if(fs.existsSync(`${this.path}/${name}.db`)) {
            fs.unlinkSync(`${this.path}/${name}.db`)
        }
    }

    select(key, table) {
        if(!this.connected) {
            console.log("MiBase is not initialized!")
            return;
        }

        let filePath;

        if (typeof table === 'undefined') {
            let tableToRead = this.tables[0];
            filePath = `${this.path}/${tableToRead}.db`;
        } else {
            if (this.tables.indexOf(table)!==-1) {
                filePath = `${this.path}/${table}.db`;
            } else {
                console.log(`The table ${table} not found!`);
                return;
            }
        }

        let data = {};

        if (fs.existsSync(filePath)) {
            const jsonData = fs.readFileSync(filePath);
            data = JSON.parse(jsonData);
        }

        return data[key];
    };

    clearData(table) {
        if(!this.connected) {
            console.log("MiBase is not initialized!")
            return;
        }

        let filePath;

        if (typeof table === 'undefined') {
            let tableToWrite = this.tables[0];
            filePath = `${this.path}/${tableToWrite}.db`;
        } else {
            if (this.tables.indexOf(table)!==-1) {
            filePath = `${this.path}/${table}.db`;
            } else {
            console.log(`The table ${table} not found!`);  
            return;
            }
        }

        fs.writeFileSync(filePath, JSON.stringify({}))
    }

    remove(key, table) {
        if(!this.connected) {
            console.log("MiBase is not initialized!")
            return;
        }
    
        let filePath;

        if (typeof table === 'undefined') {
            let tableToWrite = this.tables[0];
            filePath = `${this.path}/${tableToWrite}.db`;
        } else {
            if (this.tables.indexOf(table)!==-1) {
            filePath = `${this.path}/${table}.db`;  
            } else {
            console.log(`The table ${table} not found!`); 
            return;
            }
        }
    
        data = {};
    
        if (fs.existsSync(filePath)) {
            const jsonData = fs.readFileSync(filePath);
            data = JSON.parse(jsonData);
        }
    
        if(data.hasOwnProperty(key)) {
            delete data[key];
            fs.writeFileSync(filePath, JSON.stringify(data));
        }
    }

    searchKey(value, table) {
        if(!this.connected) {
            console.log("MiBase is not initialized!")
            return;
        }
    
        let filePath;
        let keys = [];

        if (typeof table === 'undefined') {
            let tableToRead = this.tables[0];
            filePath = `${this.path}/${tableToRead}.db`;
        } else {
            if (this.tables.indexOf(table)!==-1) {
            filePath = `${this.path}/${table}.db`;
            } else {
            console.log(`The table ${table} not found!`);
            return;
            }
        }
    
        let data = {};

        if (fs.existsSync(filePath)) {
            const jsonData = fs.readFileSync(filePath);
            data = JSON.parse(jsonData);
        }
    
        for (let key in data) {
            if (data[key] == value) {
                keys.push(key)
            }
        }
        
        
        if (keys.length === 1) {
            return keys[0];
        } else if (keys.length > 1) {
            return keys;
        } else {
            return null
        }
    }
}

module.exports = MiBase;