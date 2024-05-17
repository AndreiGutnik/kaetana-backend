class UserDto {
  id;
  email;
  verify;

  constructor(model) {
    this.id = model._id;
    this.email = model.email;
    this.verify = model.verify;
  }
}

export default UserDto;
