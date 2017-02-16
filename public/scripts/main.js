class Person {
    constructor(name) {
        this.name = name;
    }

    hello() {
        if (typeof this.name === 'string') {
            return 'Hello, I am' + this.name + '!';
        } else {
            return 'Hello!';
        }
    }
}

var person = new Person("wali havlflfviyyul Faizy");

document.write(person.hello());