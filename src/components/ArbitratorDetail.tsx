import { ListGroupItemHeading, ListGroupItemText } from 'reactstrap';

export const ArbitratorDetail = ({ arbitrator }: any) => {
  return (
    <>
      <ListGroupItemHeading>{arbitrator.name}</ListGroupItemHeading>
      <ListGroupItemText>{arbitrator.tags}</ListGroupItemText>
      <ListGroupItemText>{arbitrator.reputation}</ListGroupItemText>
      <ListGroupItemText>{arbitrator.linkedin}</ListGroupItemText>
    </>
  )
}