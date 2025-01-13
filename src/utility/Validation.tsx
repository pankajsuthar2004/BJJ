export const Validation = {
  email: new RegExp(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/),
  password: new RegExp(/^.{8,16}$/),
};
