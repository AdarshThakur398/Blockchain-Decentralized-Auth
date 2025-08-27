import withAuth from '../Utils/withAuth'
function Protectedroute() {
    return <h1> This is a Protectedroute.</h1>
}

export default withAuth(Protectedroute);