import axios from 'axios';
import './login.css';
function Login(): JSX.Element  {

    return (
        <div className="login">
            <div className="LeftSide">
            </div>
            <div className="RightSide">
                <label>Username</label>
                <input type="text" placeholder="Enter username..." />
                <label>Password</label>
                <input type="password" placeholder="Enter password..." />
                <button>Sign In</button>
            </div>

        </div>
    );
}

export default Login;

