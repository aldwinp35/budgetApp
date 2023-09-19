import React from 'react';
// import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { authService } from '../../api';

function Login() {
  const [username, setUserName] = React.useState();
  const [password, setPassword] = React.useState();
  const navigate = useNavigate();
  const token = useAuthContext();

  React.useEffect(() => {
    if (token.isValid) {
      navigate('/budget');
    }
  }, [token.isValid]);

  const handleLogin = async (event) => {
    event.preventDefault();

    const credentials = {
      username,
      password,
    };

    const success = await authService.login(credentials);
    if (success) {
      // Make component to render by changing token state
      window.history.replaceState(null, '', '/budget');
      token.setIsValid(true);
    }
  };

  return (
    <div className="login-wrapper">
      <h1>Please Log In</h1>
      <form onSubmit={handleLogin}>
        <label>
          <p>Username</p>
          <input type="text" onChange={(e) => setUserName(e.target.value)} />
        </label>
        <label>
          <p>Password</p>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}
export default Login;
