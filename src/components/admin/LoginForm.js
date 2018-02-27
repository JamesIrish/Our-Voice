import React from "react";
import TextInput from "../common/TextInput";

const LoginForm = ({course, allAuthors, onSave, onChange, saving, errors}) => {
  return (
    <form>

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

      <input type="submit"
             disabled={saving}
             value={saving ? 'Logging in...' : 'Log in'}
             className="btn btn-primary"
             onClick={onSave}/>

    </form>
  );
};

LoginForm.propTypes = {
  course: React.PropTypes.object.isRequired,
  allAuthors: React.PropTypes.array,
  onSave: React.PropTypes.func.isRequired,
  onChange: React.PropTypes.func.isRequired,
  saving: React.PropTypes.bool,
  errors: React.PropTypes.object
};

export default LoginForm;
