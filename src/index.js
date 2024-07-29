const fs = require('file-system');
const customBox = require('./boxes.js');

class MiBase {
    constructor(config) {
        this.connected = false;
        this.path = (typeof config.path != 'undefined') ? config.path.replace('/\/$/', '') : './MiBase';
        this.tables = [];
        this.debug = config.debug || false;
        this.init();
    }

    init() {
        if (!fs.existsSync(this.path)) {
            fs.mkdirSync(this.path);
        }

        const files = fs.readdirSync(this.path);
        this.tables = files.filter(file => file.endsWith('.db')).map(file => {
            const filePath = `${this.path}/${file}`;
            const content = fs.readFileSync(filePath, 'utf8');
            try {
                JSON.parse(content);
                return file.replace('.db', '');
            } catch (error) {}
            return null;
        }).filter(Boolean);

        if (this.tables.length === 0) {
            this.createTable('main', {});
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
        this.connected = true;
    }

    insertData(key, value, table) {
        if(!this.connected) {
            throw new Error('MiBase is not initialized!')
        }

        const filePath = typeof table === 'undefined' ? `${this.path}/${this.tables[0]}.db` : `${this.path}/${table}.db`;

        if (!fs.existsSync(filePath)) {
            console.log(`The table ${table} not found!`);
            return;
        }

        let data = JSON.parse(fs.readFileSync(filePath));

        data[key] = typeof value === 'object' ? value : typeof value === 'number' ? value : value === null ? null : value === undefined ? undefined : value === true ? true : value === false ? false : value.toString();

        fs.writeFileSync(filePath, JSON.stringify(data));
    }
    
    getTables() {
        return this.tables;
    }

    createTable(name, data) {
        if(!fs.existsSync(`${this.path}/${name}.db`)) {
            const d = typeof data === 'object' ? data : {};
            fs.writeFileSync(`${this.path}/${name}.db`, JSON.stringify(d));
            this.tables = fs.readdirSync(this.path);
        } else {
            console.log(`The table ${name} already exists!`);
            return;
        }
    }

    deleteTable(name) {
        if(fs.existsSync(`${this.path}/${name}.db`)) {
            fs.unlinkSync(`${this.path}/${name}.db`)
            this.tables = fs.readdirSync(this.path)
        } else {
            console.log(`The table ${name} not found!`);
            return;
        }
    }

    getData(key, table) {
        if(!this.connected) {
            throw new Error('MiBase is not initialized!')
        }

        const filePath = `${this.path}/${table ? table : this.tables[0]}.db`;

        if (!fs.existsSync(filePath)) {
            console.log(`The table ${table} not found!`);
            return;
        }

        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const keys = key.split('.');
        let result = data;

        for (const keyt of keys) {
            if (result[keyt] !== undefined) {
                result = result[keyt];
            } else {
                result = undefined
            }
        }

        return result;
    }

    clearData(table) {
        if (!this.connected) {
            throw new Error('MiBase is not initialized!');
        }

        const filePath = `${this.path}/${table ? table : this.tables[0]}.db`;

        if (!fs.existsSync(filePath)) {
            console.log(`The table ${table} not found!`);
            return;
        }

        fs.writeFileSync(filePath, '{}');
    }

    removeKey(key, table) {
        if(!this.connected) {
            throw new Error('MiBase is not initialized!');
        }

        const filePath = `${this.path}/${table || this.tables[0]}.db`;

        if (!fs.existsSync(filePath)) {
            console.log(`The table ${table} not found!`);
            return;
        }

        const data = JSON.parse(fs.readFileSync(filePath));

        if (data.hasOwnProperty(key)) {
            delete data[key];
            fs.writeFileSync(filePath, JSON.stringify(data));
        }
    }

    searchKey(value, index, table) {
        if (!this.connected) {
            throw new Error('MiBase is not initialized!');
        }

        const filePath = `${this.path}/${table || this.tables[0]}.db`;

        if (!fs.existsSync(filePath)) {
            return;
        }

        const data = JSON.parse(fs.readFileSync(filePath));
        const keys = Object.keys(data).filter(key => data[key] === value);

        if (keys.length === 0) {
            return undefined;
        }

        if (keys.length === 1) {
            return keys[0];
        }

        if (parseInt(index) < keys.length) {
            return keys[index];
        }

        return keys;
    }
}

module.exports = MiBase;