// components/Form/Components/FormRightWrapper.js
import styled from 'styled-components';
import { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { TailSpin } from 'react-loader-spinner';
import { FormState } from '../Form';

const FormRightWrapper = () => {
  const { 
    form, 
    setForm, 
    image, 
    setImage, 
    startCampaign, 
    setStoryUrl, 
    setImageUrl, 
    setUploaded: setFormUploaded 
  } = useContext(FormState);

  const [uploaded, setUploaded] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);

  const uploadFiles = async (e) => {
    e.preventDefault();
    setUploadLoading(true);
    let storyUrl = null;
    let imageUrl = null;

    try {
      // Upload Story
      if (form.story && form.story.trim() !== "") {
        try {
          const storyBlob = new Blob([form.story], { type: "text/plain" });
          const storyFormData = new FormData();
          storyFormData.append("file", storyBlob, "story.txt");
          storyFormData.append("type", "text/plain");

          const storyRes = await fetch("/api/upload", {
            method: "POST",
            body: storyFormData,
          });
        
          const responseText = await storyRes.text();
          let storyData;
          try {
            storyData = JSON.parse(responseText);
          } catch (e) {
            console.error('Failed to parse JSON response:', responseText);
            throw new Error('Invalid server response');
          }
          
          if (!storyRes.ok) {
            console.error('Upload failed with status:', storyRes.status);
            console.error('Response:', storyData);
            throw new Error(storyData.error || `Upload failed with status ${storyRes.status}`);
          }
          
          if (!storyData.path) {
            throw new Error('No path returned from IPFS upload');
          }
          
          setStoryUrl(storyData.path);
        } catch (error) {
          console.error('Error uploading story:', error);
          throw new Error(`Story upload failed: ${error.message}`);
        }
      }

      // Upload Image
      if (image !== null) {
        try {
          const imageFormData = new FormData();
          // Ensure we have a proper file object
          let imageFile = image;
          
          // If it's not a File or Blob, create a Blob from it
          if (!(imageFile instanceof File) && !(imageFile instanceof Blob)) {
            const blobOptions = imageFile.type ? { type: imageFile.type } : {};
            imageFile = new Blob([imageFile], blobOptions);
          }
          
          // Generate a filename if not present
          const fileName = imageFile.name || `image-${Date.now()}.${imageFile.type?.split('/')[1] || 'jpg'}`;
          
          // Append the file with proper metadata
          imageFormData.append("file", imageFile, fileName);
          imageFormData.append("type", imageFile.type || "image/jpeg");

          
          const imageRes = await fetch("/api/upload", {
            method: "POST",
            body: imageFormData,
          });

          const imageResponseText = await imageRes.text();
          let imageData;
          try {
            imageData = JSON.parse(imageResponseText);
          } catch (e) {
            console.error('Failed to parse image upload response:', imageResponseText);
            throw new Error('Invalid server response for image upload');
          }

          if (!imageRes.ok) {
            console.error('Image upload failed with status:', imageRes.status);
            console.error('Response:', imageData);
            throw new Error(imageData.error || `Image upload failed with status ${imageRes.status}`);
          }

          if (!imageData.path) {
            throw new Error('No path returned from Pinata image upload');
          }

          setImageUrl(imageData.path);
        } catch (error) {
          console.error('Error uploading image:', error);
          throw new Error(`Image upload failed: ${error.message}`);
        }
      }

      setUploaded(true);
      setFormUploaded(true);
      toast.success("Files Uploaded Successfully");
    } catch (err) {
      console.error('Upload error details:', {
        message: err.message,
        stack: err.stack,
        name: err.name
      });
      toast.error(err.message || "Error uploading files. Please check the console for details.");
    } finally {
      setUploadLoading(false);
    }
  };

  return (
    <FormRight>
      <FormInput>
        <FormRow>
          <RowFirstInput>
            <label>Required Amount</label>
            <Input
              onChange={(e) => setForm({ ...form, requiredAmount: e.target.value })}
              value={form.requiredAmount || ''}
              name="requiredAmount"
              type="number"
              placeholder="Required Amount"
            />
          </RowFirstInput>
          <RowSecondInput>
            <label>Choose Category</label>
            <Select
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              value={form.category || ''}
              name="category"
            >
              <option>Education</option>
              <option>Health</option>
              <option>Animal</option>
            </Select>
          </RowSecondInput>
        </FormRow>
      </FormInput>

      <FormInput>
        <label>Select Image</label>
        <Image
          alt="dapp"
          onChange={(e) => setImage(e.target.files[0])}
          type="file"
          accept="image/*"
        />
      </FormInput>

      {uploadLoading ? (
        <Button>
          <TailSpin color="#fff" height={20} />
        </Button>
      ) : !uploaded ? (
        <Button onClick={uploadFiles}>Upload Files to Pinata</Button>
      ) : (
        <Button style={{ cursor: "no-drop" }}>
          Files Uploaded Successfully
        </Button>
      )}

      <Button onClick={startCampaign} disabled={!uploaded}>Start Campaign</Button>
    </FormRight>
  );
};

export default FormRightWrapper;

// ------------------ Styled Components ------------------

const FormRight = styled.div`
  width: 45%;

  @media (max-width: 960px) {
    width: 100%;
  }
`;

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
`;

const FormRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  width: 100%;

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 0;
  }
`;

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
`;

const Select = styled.select`
  padding: 16px 18px;
  background-color: ${(props) => props.theme.bgDiv};
  color: ${(props) => props.theme.color};
  border: 1px solid ${(props) => props.theme.borderColor};
  border-radius: 12px;
  outline: none;
  font-size: 16px;
  font-family: 'Inter', sans-serif;
  width: 100%;
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    border-color: ${(props) => props.theme.primaryColor};
    box-shadow: 0 0 0 3px ${(props) => props.theme.primaryColor}26;
  }

  option {
    background-color: ${(props) => props.theme.bgDiv};
    color: ${(props) => props.theme.color};
  }
`;

const Image = styled.input`
  padding: 12px;
  background-color: ${(props) => props.theme.bgDiv};
  color: ${(props) => props.theme.color};
  border: 1px solid ${(props) => props.theme.borderColor};
  border-radius: 12px;
  outline: none;
  font-size: 14px;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    border-color: ${(props) => props.theme.primaryColor};
    box-shadow: 0 0 0 3px ${(props) => props.theme.primaryColor}26;
  }

  &::file-selector-button {
    padding: 10px 16px;
    background: linear-gradient(120deg, ${(props) => props.theme.primaryColor}, ${(props) => props.theme.accentColor});
    color: #fff;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    margin-right: 12px;
    font-weight: 600;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    transition: transform 0.2s ease;

    &:hover {
      transform: translateY(-1px);
    }
  }
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 16px 20px;
  color: #fff;
  background: linear-gradient(120deg, ${(props) => props.theme.primaryColor}, ${(props) => props.theme.accentColor});
  border: none;
  margin-top: 24px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  font-family: 'Inter', sans-serif;
  border-radius: 12px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${(props) => props.theme.cardHoverShadow};
  }

  &:disabled {
    background: ${(props) => props.theme.bgSubDiv};
    color: ${(props) => props.theme.textSecondary};
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
    opacity: 0.6;
  }
`;

const RowFirstInput = styled.div`
  display: flex;
  flex-direction: column;
  width: 48%;
  gap: 8px;

  label {
    font-size: 14px;
    font-weight: 600;
    color: ${(props) => props.theme.color};
    letter-spacing: 0.02em;
  }

  @media (max-width: 600px) {
    width: 100%;
  }
`;

const RowSecondInput = styled.div`
  display: flex;
  flex-direction: column;
  width: 48%;
  gap: 8px;

  label {
    font-size: 14px;
    font-weight: 600;
    color: ${(props) => props.theme.color};
    letter-spacing: 0.02em;
  }

  @media (max-width: 600px) {
    width: 100%;
  }
`;