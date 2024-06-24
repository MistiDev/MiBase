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
}

module.exports = MiBase;