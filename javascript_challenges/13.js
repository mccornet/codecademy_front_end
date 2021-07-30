/*

1. Write a function, dogFactory(). It should:

have 3 parameters: name, breed, and weight (in that order)
expect name and breed to be strings
expect weight to be a number
return an object
have each of those parameters as keys on the returned object 
returned with the values of the arguments that were passed in
dogFactory('Joe', 'Pug', 27)

// Should return { name: 'Joe', breed: 'Pug', weight: 27 }

2. Add getters and setters for each of the three properties 
and change the property names to have an underscore prepended.

3. Add two methods to your object: 

.bark() which returns ‘ruff! ruff!’ and 
.eatTooManyTreats() which should increment the weight property by 1.

*/

const dogFactory = (name, breed, weight) => {
    return {
        _name: name,
        _breed: breed,
        _weight: weight,

        set name(new_name) {this._name = new_name; },
        get name() { return this._name; },

        set breed(new_breed) { this._breed = new_breed; },
        get breed() { return this._breed},

        set weight(new_weight) { this._weight = new_weight},
        get weight() { return this._weight},

        bark() { return 'ruff! ruff!'},
        eatTooManyTreats() { this._weight += 1},
    };
}

dogFactory('Joe', 'Pug', 27)

