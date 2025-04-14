export const Validation = {
  email: new RegExp(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/),
  password: new RegExp(
    /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*\d)[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,16}$/,
  ),
  name: new RegExp(/^[a-zA-Z\s.,\/';[\]\-=`]+$/),
  phone: new RegExp(/^\d{10}$/),
  mobile: new RegExp(/^[6-9]\d{9}$/),
};
