import {
  ListGroupItemHeading, ListGroupItem, ListGroupItemText, Badge,
  Row, Col
} from 'reactstrap';

export const ArbitratorDetail = ({ arbitrator }: any) => {
  return (
    <>
      <ListGroupItemHeading>
        <Row>
          <Col className="col-md-9 col-12">
            {arbitrator.given_name} {arbitrator.family_name}
          </Col>
          <Col className="col-md-3 col-12">
            <Badge pill>{arbitrator.reputation}</Badge></Col>
        </Row>
      </ListGroupItemHeading>
      <ListGroupItemText>{arbitrator.fee.value + ' ' + arbitrator.currency + ' (' + arbitrator.fee.feeType + ')'}</ListGroupItemText>
      <Row>
        {arbitrator.tags.map((element: any, index: any) => {
          return (
            <Col>
              <ListGroupItemText>{element}</ListGroupItemText>
            </Col>
          )
        })}
      </Row>
    </>
  )
}