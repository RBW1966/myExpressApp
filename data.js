// _id
// firstName
// lastName
// user_id

class Users extends Array {

  addUser(id, firstName, lastName, user_id) {
    this.pop(new User(id, firstName, lastName, user_id));
  }
  removeUser(id){
    let i = 0;
    for (let u of this) {
      if (u._id == id) {
        this.splice(i, 1);
        break;
      }
      i++;
    }
  }
}

class User {
  constructor(id, firstName, lastName, user_id){
    this._id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.user_id = user_id;
  }
}

module.exports = Users;
