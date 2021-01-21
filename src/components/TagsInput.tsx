import * as React from 'react';
import { useSelector } from 'react-redux';
import { Button, Spinner, FormText, Row, Col } from 'reactstrap';
import CreatableSelect from 'react-select/creatable'
import { useFormikContext } from 'formik';
import update from 'immutability-helper';

const TAGS = [
  { value: 'graphic', label: 'graphic' },
  { value: 'translation', label: 'translation' },
  { value: 'painting', label: 'painting' }
]

export const TagsInput = ({ tags, disabled }: any) => {

  const { values, setFieldValue } = useFormikContext();
  const [newTags, setNewTags] = React.useState(tags.map((tag: any) => JSON.parse(tag)));
  const [isDisabled, setIsDisabled] = React.useState(disabled);

  const handleChange = (newValue: any, actionMeta: any) => {
    // console.log('tags changed newValue', newValue);
    // console.log('tags changed actionMeta', actionMeta);

    setFieldValue('tags', newValue ? newValue : [])
    setNewTags(newValue)
  };

  React.useEffect(() => {
    setNewTags(tags.map((tag: any) => JSON.parse(tag)))
    setIsDisabled(disabled)
  }, [tags, disabled]);

  return (
    <>
      <CreatableSelect isDisabled={isDisabled} options={TAGS} isMulti
        onChange={handleChange}
        value={newTags}
      />
    </>
  )
}