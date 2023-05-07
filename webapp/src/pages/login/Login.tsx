import {useState} from "react";
import {Button, Container, FormGroup, TextField} from "@mui/material";
import "./login.css"
import {LoginButton} from "@inrupt/solid-ui-react";
import { login } from "@inrupt/solid-client-authn-browser";
const Login = () => {
    const [idp, setIdp] = useState("https://inrupt.net");

    const handleSubmit = async (e:any) => {
        
        e.preventDefault(); //if not used, the page will reload and data will be lost
        login({
          redirectUrl: "http://172.162.240.176:3000/main/", // after redirect, come to the actual page
          oidcIssuer: idp, // redirect to the url
          clientName: "Lo Map",
        });
      };

    return (
        <Container>
            <h1 className="loginHeader"> Login </h1>
            <p className="loginText"> Welcome to LoMap!</p>
            <p className="loginText"> This application runs using the solid
                principles, this means, you need an account on a pod provider to
                use it. </p>
            <p className="loginText"> If you already have one, please log
                in.</p>
            <p className="loginText"> If not, please create an account in a pod
                provider as inrupt.net</p>
            <FormGroup>
                <TextField
                    label="Identity Provider"
                    placeholder="Identity Provider"
                    type="url"
                    value={idp}
                    onChange={(e: any) => setIdp(e.target.value)}
                    InputProps={{
                        endAdornment: (
                            // <LoginButton oidcIssuer={idp}
                            //              redirectUrl="http://172.162.240.176:3000/main/"
                            //              onError={console.error}>
                                <Button variant="contained" onClick={(e) => {
                                    handleSubmit(e);
                                
                                }}>
                                    Login
                                </Button>
                            // </LoginButton>
                        ),
                    }}
                />
            </FormGroup>
        </Container>
    );
}

export default Login;