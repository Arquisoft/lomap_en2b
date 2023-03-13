import { makeRequest } from "../../axios";
import './users.css'
import { useParams } from "react-router";

function Users() {

  const username = useParams().text;

  const data = makeRequest.get("/user/search/" + username); //.then((res) => { return res.data;});

  console.log("!!!", data);

    return(<div className="main-container">
      List with users of the app hola
      </div>
    );
  }
  
  export default Users;