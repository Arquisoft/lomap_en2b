import { useSession } from '@inrupt/solid-ui-react';

function Friends():JSX.Element {
  const  {session}  = useSession();
  return (
    <div className="friendsContainer">
      <h1>{session.info.webId}</h1>
    </div>
  );
}

export default Friends;