import React from "react";
import TextInput from "../common/TextInput";

const RegisterForm = ({course, allAuthors, onSave, onChange, saving, errors}) => {
  return (
    <form>
      <h1>Register for Voice</h1>

      <TextInput name="email"
                 type="email"
                 label="Email address"
                 value={course.title}
                 onChange={onChange}
                 error={errors.title}/>

      <TextInput name="password"
                 type="password"
                 label="Password"
                 value={course.category}
                 onChange={onChange}
                 error={errors.category}/>

      <TextInput name="confirmPassword"
                 type="password"
                 label="Confirm password"
                 value={course.category}
                 onChange={onChange}
                 error={errors.category}/>

      <input type="submit"
             disabled={saving}
             value={saving ? 'Loading...' : 'Register'}
             className="btn btn-primary"
             onClick={onSave}/>

    </form>
  );
};

RegisterForm.propTypes = {
  course: React.PropTypes.object.isRequired,
  allAuthors: React.PropTypes.array,
  onSave: React.PropTypes.func.isRequired,
  onChange: React.PropTypes.func.isRequired,
  saving: React.PropTypes.bool,
  errors: React.PropTypes.object
};

export default RegisterForm;
