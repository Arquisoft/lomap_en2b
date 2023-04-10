import { useSession } from '@inrupt/solid-ui-react';
import { useEffect } from 'react';
import { useState } from 'react';
import { makeRequest } from '../../axios';
import { useParams } from 'react-router';

function Friends():JSX.Element {

  const [friends, setFriends] = useState([]);
  const uuid = useParams().id;

  useEffect(() => {
    const fetchFriends = async () => {
      await makeRequest.get("/solid/"+uuid+"/friends").then((res) => {
        setFriends(res.data);
      });
    };
    fetchFriends();
  },[friends,setFriends]);

  return (
    <div className="friendsContainer">
      <h1></h1>
    </div>
  );
}

export default Friends;