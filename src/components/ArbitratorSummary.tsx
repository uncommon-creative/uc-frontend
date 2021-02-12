import {
  ListGroupItemHeading, ListGroupItemText, Badge,
  Row, Col
} from 'reactstrap';
import { useTranslation } from 'react-i18next';

export const ArbitratorSummary = ({ arbitrator, size }: any) => {

  const { t, i18n } = useTranslation();
  
  return (
    <>
      <ListGroupItemHeading>
        <Row>
          <Col data-cy='inputSowArbitratorsSelect' className='col-md-9 col-12'>
            <ListGroupItemText className={size}>{arbitrator.given_name} {arbitrator.family_name}</ListGroupItemText>
          </Col>
          <Col className="col-md-3 col-12">
            <Badge pill color="primary">{arbitrator.reputation}</Badge></Col>
        </Row>
      </ListGroupItemHeading>
    </>
  )
}