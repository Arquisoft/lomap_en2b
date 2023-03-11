import { useState, useEffect } from "react";
import { LoginButton, CombinedDataProvider, useSession } from "@inrupt/solid-ui-react";
import { Button, TextField, FormGroup, Container } from "@mui/material";

const Login = () => {
    const [idp, setIdp] = useState("https://inrupt.net");
    const [currentUrl, setCurrentUrl] = useState("http://localhost:3000");
    const { session } = useSession();
    const { webId } = session.info;
    
    useEffect(() => {
      setCurrentUrl(window.location.href);
    }, [setCurrentUrl]);
  
    return (
      <Container>
        <h1> Login </h1>
        <p> Welcome to LoMap!</p>
        <p> This application runs using the solid principles, this means, you need an account on a pod provider to use it. </p>
        <p> If you already have one, please log in.</p>
        <p> If not, please create an account in a pod provider as inrupt.net</p>
        <FormGroup>
          <TextField
            label="Identity Provider"
            placeholder="Identity Provider"
            type="url"
            value={idp}
            onChange={(e) => setIdp(e.target.value)}
            InputProps={{
              endAdornment: (
                <LoginButton authOptions={{ clientName: "LoMap" }} oidcIssuer={idp} redirectUrl={currentUrl} onError={console.error}>
                  <Button variant="contained">
                    Login
                  </Button>
                </LoginButton>
              ),
            }}
          />
        </FormGroup>

      </Container>
    );
  }

export default Login;