import * as Yup from 'yup';
const signupvalidate = Yup.object().shape({
    email: Yup.string().required("Email is required").email("Invalid email format"),
    name: Yup.string().required("Name is required"),
    mobile: Yup.string().required("Mobile Number is required"),
    password: Yup.string().required("Password is required").min(6, "Password must be of 6 characters long"),
})
export default signupvalidate;