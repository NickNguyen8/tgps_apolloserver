class MyClass {
    static get MY_CONST() {
        delete MyClass.MY_CONST;
        return MyClass.MY_CONST = 'string';
    }
    static set U_YIN_YANG(value) {
      delete MyClass.MY_CONST;
      MyClass.MY_CONST = value;
    }
    get MY_CONST() {
        return this.constructor.MY_CONST;
    }
    set MY_CONST(value) {
        this.constructor.MY_CONST = value;
    }
    constructor() {
        console.log(this.MY_CONST === this.constructor.MY_CONST);
    }
}

console.log(MyClass.MY_CONST);
new MyClass
// alert: string, true
MyClass.MY_CONST = ['string, 42']
console.log(MyClass.MY_CONST);
new MyClass
// alert: string, 42 ; true