import styled from 'styled-components';
import FormLeftWrapper from './Components/FormLeftWrapper'
import FormRightWrapper from './Components/FormRightWrapper'
import { createContext, useState } from 'react';
import { TailSpin } from 'react-loader-spinner';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import CampaignFactory from '../../artifacts/contracts/Campaign.sol/CampaignFactory.json'

const FormState = createContext();

const Form = () => {
    const [form, setForm] = useState({
        campaignTitle: "",
        story: "",
        requiredAmount: "",
        category: "education",
    });

    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState("");
    const [uploaded, setUploaded] = useState(false);

    const [storyUrl, setStoryUrl] = useState();
    const [imageUrl, setImageUrl] = useState();

    const FormHandler = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const [image, setImage] = useState(null);

    const ImageHandler = (e) => {
        setImage(e.target.files[0]);
    }

    const startCampaign = async (e) => {
        e.preventDefault();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
    
        if(form.campaignTitle === "") {
          toast.warn("Title Field Is Empty");
        } else if(form.story === "" ) {
          toast.warn("Story Field Is Empty");
        } else if(form.requiredAmount === "") {
          toast.warn("Required Amount Field Is Empty");
        } else if(uploaded == false) {
            toast.warn("Files Upload Required")
        }
        else {        
          setLoading(true);  
    
          const contract = new ethers.Contract(
            process.env.NEXT_PUBLIC_ADDRESS,
            CampaignFactory.abi,
            signer
          );
            
          const CampaignAmount = ethers.utils.parseEther(form.requiredAmount);
    
          const campaignData = await contract.createCampaign(
            form.campaignTitle,
            CampaignAmount,
            imageUrl,
            form.category,
            storyUrl
          );
    
          await campaignData.wait();   
    
          setAddress(campaignData.to);
        }
    }

  return (
      <FormState.Provider value={{form, setForm, image, setImage, ImageHandler, FormHandler, setImageUrl, setStoryUrl, startCampaign, setUploaded}} >
    <FormWrapper>
        <FormMain>
            <FormHeader>
                <Badge>Launch a TrustFund campaign</Badge>
                <Heading>Tell your story, inspire contributions, and track progress transparently.</Heading>
                <Subheading>
                    Provide a compelling narrative, set your target, and share supporting assets. We take care of the secure on-chain deployment for you.
                </Subheading>
            </FormHeader>
            {loading == true ?
                address == "" ?
                    <Spinner>
                        <TailSpin height={60} color="#2f6fed" />
                    </Spinner> :
                <SuccessCard>
                    <SuccessTitle>Campaign launched successfully!</SuccessTitle>
                    <SuccessAddress>{address}</SuccessAddress>
                    {/* <Button type="button">
                        View campaign
                    </Button> */}
                </SuccessCard>
                :
                    <FormInputsWrapper>
                        <FormLeftWrapper />
                        <FormRightWrapper />
                    </FormInputsWrapper>               
            }
        </FormMain>
    </FormWrapper>
    </FormState.Provider>
  )
}

const FormWrapper = styled.div`
    width: 100%;
    display:flex;
    justify-content:center;
    padding: 48px 24px 72px;

    @media (max-width: 768px) {
        padding: 32px 16px 56px;
    }
`

const FormMain = styled.div`
    width: min(1100px, 100%);
    display: flex;
    flex-direction: column;
    gap: 32px;
`

const FormHeader = styled.div`
    background: ${(props) => props.theme.glassBg};
    border: 1px solid ${(props) => props.theme.glassBorder};
    border-radius: 24px;
    padding: 36px 40px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    box-shadow: ${(props) => props.theme.cardShadow};

    @media (max-width: 600px) {
        padding: 28px;
    }
`

const Badge = styled.span`
    align-self: flex-start;
    padding: 8px 14px;
    border-radius: 999px;
    background: ${(props) => props.theme.badgeBg};
    color: ${(props) => props.theme.badgeColor};
    font-size: 13px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    font-weight: 600;
`

const Heading = styled.h1`
    font-family: 'Playfair Display', serif;
    font-size: clamp(30px, 4vw, 38px);
    margin: 0;
    color: ${(props) => props.theme.color};
`

const Subheading = styled.p`
    font-size: 16px;
    line-height: 1.6;
    color: ${(props) => props.theme.textSecondary};
    margin: 0;
    max-width: 680px;
`

const FormInputsWrapper = styled.div`
    display:flex;
    justify-content:space-between;
    align-items:flex-start;
    gap: 28px;

    @media (max-width: 960px) {
        flex-direction: column;
    }
`

const Spinner = styled.div`
    width:100%;
    min-height:360px;
    display:flex;
    justify-content:center;
    align-items:center;
    background: ${(props) => props.theme.bgDiv};
    border-radius: 24px;
    border: 1px solid ${(props) => props.theme.borderColor};
    box-shadow: ${(props) => props.theme.cardShadow};
`

const SuccessCard = styled.div`
    width:100%;
    min-height:320px;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    gap: 16px;
    background: ${(props) => props.theme.bgDiv};
    border-radius: 24px;
    border: 1px solid ${(props) => props.theme.borderColor};
    box-shadow: ${(props) => props.theme.cardShadow};
    text-align: center;
    padding: 48px 32px;
`

const SuccessTitle = styled.h2`
    font-family: 'Playfair Display', serif;
    font-size: 28px;
    margin: 0;
    color: ${(props) => props.theme.color};
`

const SuccessAddress = styled.span`
    font-size: 16px;
    color: ${(props) => props.theme.primaryColor};
    font-family: 'Inter', sans-serif;
    letter-spacing: 0.08em;
`

const Button = styled.button`
    display: inline-flex;
    justify-content:center;
    align-items: center;
    gap: 10px;
    padding:14px 24px;
    color:#fff;
    background: linear-gradient(120deg, ${(props) => props.theme.primaryColor}, ${(props) => props.theme.accentColor});
    border:none;
    margin-top:24px;
    cursor: pointer;
    font-weight:600;
    font-size:14px;
    border-radius:12px;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &:hover {
        transform: translateY(-1px);
        box-shadow: ${(props) => props.theme.cardHoverShadow};
    }
`

export default Form;
export {FormState};