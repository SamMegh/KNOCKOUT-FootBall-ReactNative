import * as Yup from 'yup';
const leagueValidator = Yup.object().shape({
    name: Yup.string().required("League name is required"),
    totalWeeks: Yup.string().required("League type is required"),
    joinfee: Yup.object().shape({
    amount: Yup.number()
      .typeError("Joining Fee must be a number")
      .min(0, "Joining Fee cannot be negative")
      .required("Joining Fee is required"),
  }),

})
export default leagueValidator;