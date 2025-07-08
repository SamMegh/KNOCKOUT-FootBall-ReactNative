import * as Yup from 'yup';
const validate = Yup.object().shape({
    email: Yup.string().required("Email is required").email("Invalid email format"),
    password: Yup.string().required("Password is required").min(6,"Password must be of 6 characters long"),
})
export default validate;