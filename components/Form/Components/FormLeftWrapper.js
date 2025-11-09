import styled from 'styled-components';
import { FormState } from '../Form';
import { useContext } from 'react';

const FormLeftWrapper = () => {
  const Handler = useContext(FormState);

  return (
    <FormLeft>
      <FormInput>
        <label>Campaign Title</label>
        <Input onChange={Handler.FormHandler} value={Handler.form.campaignTitle} placeholder='Campaign Title' name='campaignTitle'>
        </Input>
      </FormInput>
      <FormInput>
        <label>Story</label>
        <TextArea onChange={Handler.FormHandler} value={Handler.form.story} name="story" placeholder='Describe Your Story'>
        </TextArea>
      </FormInput>
    </FormLeft>
  )
}

const FormLeft = styled.div`
  width: 48%;

  @media (max-width: 960px) {
    width: 100%;
  }
`

const FormInput = styled.div`
  display: flex;
  flex-direction: column;
  font-family: 'Inter', sans-serif;
  margin-top: 20px;
  gap: 8px;

  label {
    font-size: 14px;
    font-weight: 600;
    color: ${(props) => props.theme.color};
    letter-spacing: 0.02em;
  }
`

const Input = styled.input`
  padding: 16px 18px;
  background-color: ${(props) => props.theme.bgDiv};
  color: ${(props) => props.theme.color};
  border: 1px solid ${(props) => props.theme.borderColor};
  border-radius: 12px;
  outline: none;
  font-size: 16px;
  font-family: 'Inter', sans-serif;
  width: 100%;
  transition: all 0.2s ease;

  &::placeholder {
    color: ${(props) => props.theme.placeholderColor};
  }

  &:focus {
    border-color: ${(props) => props.theme.primaryColor};
    box-shadow: 0 0 0 3px ${(props) => props.theme.primaryColor}26;
  }
`

const TextArea = styled.textarea`
  padding: 16px 18px;
  background-color: ${(props) => props.theme.bgDiv};
  color: ${(props) => props.theme.color};
  border: 1px solid ${(props) => props.theme.borderColor};
  border-radius: 12px;
  outline: none;
  font-size: 16px;
  font-family: 'Inter', sans-serif;
  max-width: 100%;
  min-width: 100%;
  overflow-x: hidden;
  min-height: 180px;
  resize: vertical;
  transition: all 0.2s ease;

  &::placeholder {
    color: ${(props) => props.theme.placeholderColor};
  }

  &:focus {
    border-color: ${(props) => props.theme.primaryColor};
    box-shadow: 0 0 0 3px ${(props) => props.theme.primaryColor}26;
  }
`

export default FormLeftWrapper;