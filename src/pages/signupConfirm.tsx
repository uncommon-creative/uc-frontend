import React from 'react';
import { useParams } from 'react-router-dom';
import { Jumbotron, Container } from 'reactstrap';

export const SignupConfirmPage = () => {

  let { code }: any = useParams();
  
  React.useEffect(() => {
    console.log('with code: ', code);
    return () => {}
  }, [])

  return (
    <Container className="mt-3 mt-lg-10">
      <Jumbotron fluid>
        <Container fluid className="text-center">
          <h2>Account Created</h2>
          <p className="lead">Check Email for account confirmation</p>
        </Container>
      </Jumbotron>
    </Container>
  )
}