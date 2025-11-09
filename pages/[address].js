import styled from "styled-components";
import Image from "next/image";
import { ethers } from 'ethers';
import PaidIcon from "@mui/icons-material/Paid";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import EventIcon from "@mui/icons-material/Event";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CampaignFactory from '../artifacts/contracts/Campaign.sol/CampaignFactory.json'
import Campaign from '../artifacts/contracts/Campaign.sol/Campaign.json'
import { useEffect, useState } from "react";
import { TailSpin } from 'react-loader-spinner';
import { toast } from 'react-toastify';

const ipfsGateway = (process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/').replace(/\/?$/, '/');


export default function Detail({Data, DonationsData}) {
  const [mydonations, setMydonations] = useState([]);
  const [story, setStory] = useState('');
  const [amount, setAmount] = useState('');
  const [change, setChange] = useState(false);
  const [donating, setDonating] = useState(false);

  const requiredAmount = Number.parseFloat(Data?.requiredAmount ?? '0') || 0;
  const receivedAmount = Number.parseFloat(Data?.receivedAmount ?? '0') || 0;
  const remainingAmount = Math.max(requiredAmount - receivedAmount, 0);
  const progress =
    requiredAmount > 0 ? Math.min(100, (receivedAmount / requiredAmount) * 100) : 0;
  const ownerLabel = Data?.owner
    ? `${Data.owner.slice(0, 6)}...${Data.owner.slice(-4)}`
    : 'Unknown';
  const hasRecentContributions = DonationsData?.length > 0;
  const hasPersonalContributions = mydonations.length > 0;

  useEffect(() => {
    const Request = async () => {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const Web3provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = Web3provider.getSigner();
      const Address = await signer.getAddress();

      const provider = new ethers.providers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_RPC_URL || 'http://127.0.0.1:8545'
      );
    
      const contract = new ethers.Contract(
        Data.address,
        Campaign.abi,
        provider
      );

      const storyResponse = await fetch(`${ipfsGateway}${Data.storyUrl}`);
      const storyData = await storyResponse.text();

      const MyDonations = contract.filters.donated(Address);
      const MyAllDonations = await contract.queryFilter(MyDonations);

      setMydonations(MyAllDonations.map((e) => {
        return {
          donar: e.args.donar,
          amount: ethers.utils.formatEther(e.args.amount),
          timestamp : parseInt(e.args.timestamp)
        }
      }));

      setStory(storyData);
    }

    Request();
  }, [change, Data.address, Data.storyUrl])


  const DonateFunds = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.warn('Please enter a valid donation amount');
      return;
    }

    try {
      setDonating(true);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      const contract = new ethers.Contract(Data.address, Campaign.abi, signer);
      
      toast.info('Please confirm the transaction in MetaMask');
      const transaction = await contract.donate({value: ethers.utils.parseEther(amount)});
      
      toast.info('Transaction submitted. Waiting for confirmation...');
      await transaction.wait();

      toast.success(`Successfully donated ${amount} Matic!`);
      setChange((prev) => !prev);
      setAmount('');
      
    } catch (error) {
      console.error('Donation error:', error);
      if (error.code === 4001) {
        toast.error('Transaction rejected by user');
      } else if (error.code === -32603) {
        toast.error('Insufficient funds for transaction');
      } else {
        toast.error('Failed to process donation. Please try again.');
      }
    } finally {
      setDonating(false);
    }
  }

  return (
    <PageWrapper>
      <ContentGrid>
        <PrimaryColumn>
          <MediaCard>
            <ImageSection>
              <Image
                alt={`${Data.title} campaign visual`}
                layout="fill"
                src={`${ipfsGateway}${Data.image}`}
              />
            </ImageSection>
            <StoryContent>
              <SectionBadge>Campaign Story</SectionBadge>
              <StoryText>{story}</StoryText>
            </StoryContent>
          </MediaCard>
        </PrimaryColumn>
        <SidebarColumn>
          <SummaryCard>
            <Title>{Data.title}</Title>
            <Subtitle>Led by {ownerLabel}</Subtitle>
            <ProgressBar>
              <ProgressFill style={{ width: `${progress}%` }} />
            </ProgressBar>
            <ProgressStats>
              <Stat>
                <StatLabel>Raised</StatLabel>
                <StatValue>{receivedAmount.toLocaleString()} Matic</StatValue>
              </Stat>
              <Stat>
                <StatLabel>Target</StatLabel>
                <StatValue>{requiredAmount.toLocaleString()} Matic</StatValue>
              </Stat>
              <Stat>
                <StatLabel>Remaining</StatLabel>
                <StatValue>{remainingAmount.toLocaleString()} Matic</StatValue>
              </Stat>
            </ProgressStats>
            <DonateSection>
              <Input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                type="number"
                placeholder="Enter amount to support"
                min="0"
              />
              <Donate onClick={DonateFunds} disabled={!amount || donating}>
                {donating ? (
                  <>
                    <TailSpin height={18} width={18} color="#fff" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FavoriteBorderIcon />
                    Contribute now
                  </>
                )}
              </Donate>
            </DonateSection>
            <QuickFacts>
              <FactItem>
                <FactIcon>
                  <AccountBoxIcon />
                </FactIcon>
                <FactContent>
                  <FactLabel>Beneficiary</FactLabel>
                  <FactValue>{ownerLabel}</FactValue>
                </FactContent>
              </FactItem>
              <FactItem>
                <FactIcon>
                  <PaidIcon />
                </FactIcon>
                <FactContent>
                  <FactLabel>Minimum support</FactLabel>
                  <FactValue>{remainingAmount > 0 ? `${Math.max(remainingAmount * 0.05, 1).toFixed(2)} Matic` : 'Goal met'}</FactValue>
                </FactContent>
              </FactItem>
              <FactItem>
                <FactIcon>
                  <EventIcon />
                </FactIcon>
                <FactContent>
                  <FactLabel>Campaign created</FactLabel>
                  <FactValue>{Data?.timestamp ? new Date(Data.timestamp * 1000).toLocaleDateString() : 'N/A'}</FactValue>
                </FactContent>
              </FactItem>
            </QuickFacts>
          </SummaryCard>

          <DonationsCard>
            <DonationSectionTitle>Recent contributions</DonationSectionTitle>
            <DonationList>
              {hasRecentContributions ? (
                DonationsData.map((e) => (
                  <Donation key={e.timestamp}>
                    <DonationMeta>
                      <DonationPill>{e.donar.slice(0, 6)}...{e.donar.slice(39)}</DonationPill>
                      <DonationDate>{new Date(e.timestamp * 1000).toLocaleString()}</DonationDate>
                    </DonationMeta>
                    <DonationAmount>{Number.parseFloat(e.amount).toFixed(2)} Matic</DonationAmount>
                  </Donation>
                ))
              ) : (
                <EmptyState>No contributions recorded yet. Be the first to support!</EmptyState>
              )}
            </DonationList>
          </DonationsCard>

          {hasPersonalContributions && (
            <DonationsCard>
              <DonationSectionTitle>My contributions</DonationSectionTitle>
              <DonationList>
                {mydonations.map((e) => (
                  <Donation key={e.timestamp}>
                    <DonationMeta>
                      <DonationPill>{e.donar.slice(0, 6)}...{e.donar.slice(39)}</DonationPill>
                      <DonationDate>{new Date(e.timestamp * 1000).toLocaleString()}</DonationDate>
                    </DonationMeta>
                    <DonationAmount>{Number.parseFloat(e.amount).toFixed(2)} Matic</DonationAmount>
                  </Donation>
                ))}
              </DonationList>
            </DonationsCard>
          )}
        </SidebarColumn>
      </ContentGrid>
    </PageWrapper>
  );
}


export async function getStaticPaths() {
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.NEXT_PUBLIC_RPC_URL
  );

  const contract = new ethers.Contract(
    process.env.NEXT_PUBLIC_ADDRESS,
    CampaignFactory.abi,
    provider
  );

  const getAllCampaigns = contract.filters.campaignCreated();
  const AllCampaigns = await contract.queryFilter(getAllCampaigns);

  return {
    paths: AllCampaigns.map((e) => ({
        params: {
          address: e.args.campaignAddress.toString(),
        }
    })),
    fallback: "blocking"
  }
}

export async function getStaticProps(context) {
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.NEXT_PUBLIC_RPC_URL
  );

  const contract = new ethers.Contract(
    context.params.address,
    Campaign.abi,
    provider
  );

  const title = await contract.title();
  const requiredAmount = await contract.requiredAmount();
  const image = await contract.image();
  const storyUrl = await contract.story();
  const owner = await contract.owner();
  const receivedAmount = await contract.receivedAmount();

  const Donations = contract.filters.donated();
  const AllDonations = await contract.queryFilter(Donations);


  const Data = {
      address: context.params.address,
      title, 
      requiredAmount: ethers.utils.formatEther(requiredAmount), 
      image, 
      receivedAmount: ethers.utils.formatEther(receivedAmount), 
      storyUrl, 
      owner,
  }

  const DonationsData =  AllDonations.map((e) => {
    return {
      donar: e.args.donar,
      amount: ethers.utils.formatEther(e.args.amount),
      timestamp : parseInt(e.args.timestamp)
  }});

  return {
    props: {
      Data,
      DonationsData
    },
    revalidate: 10
  }


}


const PageWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 40px 24px 72px;

  @media (max-width: 768px) {
    padding: 28px 16px 56px;
  }
`;

const ContentGrid = styled.div`
  width: min(1140px, 100%);
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
  gap: 32px;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

const PrimaryColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const SidebarColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const MediaCard = styled.div`
  background: ${(props) => props.theme.bgDiv};
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid ${(props) => props.theme.borderColor};
  box-shadow: ${(props) => props.theme.cardShadow};
  display: flex;
  flex-direction: column;
`;

const ImageSection = styled.div`
  position: relative;
  width: 100%;
  padding-top: 58%;
  overflow: hidden;
`;

const StoryContent = styled.div`
  padding: 28px 32px 36px;
  display: flex;
  flex-direction: column;
  gap: 18px;

  @media (max-width: 600px) {
    padding: 24px;
  }
`;

const SectionBadge = styled.span`
  align-self: flex-start;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  background: ${(props) => props.theme.badgeBg};
  color: ${(props) => props.theme.badgeColor};
  font-weight: 600;
`;

const StoryText = styled.p`
  font-size: 16px;
  line-height: 1.7;
  color: ${(props) => props.theme.color};
  opacity: 0.88;
  white-space: pre-line;
  font-family: 'Inter', sans-serif;
`;

const SummaryCard = styled.div`
  background: ${(props) => props.theme.bgDiv};
  border-radius: 24px;
  border: 1px solid ${(props) => props.theme.borderColor};
  padding: 32px 30px;
  box-shadow: ${(props) => props.theme.cardShadow};
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (max-width: 600px) {
    padding: 26px 24px;
  }
`;

const Title = styled.h1`
  font-family: 'Playfair Display', serif;
  font-size: clamp(28px, 3vw, 36px);
  color: ${(props) => props.theme.color};
  margin: 0;
`;

const Subtitle = styled.span`
  font-size: 15px;
  color: ${(props) => props.theme.textSecondary};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 10px;
  border-radius: 10px;
  background: ${(props) => props.theme.bgSubDiv};
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(120deg, ${(props) => props.theme.primaryColor}, ${(props) => props.theme.accentColor});
  transition: width 0.5s ease;
`;

const ProgressStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 18px;
`;

const Stat = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const StatLabel = styled.span`
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${(props) => props.theme.textSecondary};
`;

const StatValue = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: ${(props) => props.theme.color};
`;

const DonateSection = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
`;

const Input = styled.input`
  padding: 14px 16px;
  background-color: ${(props) => props.theme.bgSubDiv};
  color: ${(props) => props.theme.color};
  border: 1px solid ${(props) => props.theme.borderColor};
  border-radius: 12px;
  outline: none;
  font-size: 16px;
  font-family: 'Inter', sans-serif;

  &:focus {
    border-color: ${(props) => props.theme.primaryColor};
    box-shadow: 0 0 0 3px ${(props) => props.theme.primaryColor}26;
  }
`;

const Donate = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 18px;
  color: #fff;
  background: linear-gradient(120deg, ${(props) => props.theme.primaryColor}, ${(props) => props.theme.accentColor});
  border: none;
  cursor: pointer;
  font-weight: 600;
  border-radius: 12px;
  font-size: 15px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${(props) => props.theme.cardHoverShadow};
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const QuickFacts = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  border-radius: 14px;
  background: ${(props) => props.theme.bgSubDiv};
  border: 1px solid ${(props) => props.theme.borderColor};
`;

const FactIcon = styled.span`
  width: 38px;
  height: 38px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: ${(props) => props.theme.primaryColor}15;
  color: ${(props) => props.theme.primaryColor};
`;

const FactContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const FactLabel = styled.span`
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${(props) => props.theme.textSecondary};
`;

const FactValue = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: ${(props) => props.theme.color};
`;

const DonationsCard = styled.div`
  background: ${(props) => props.theme.bgDiv};
  border-radius: 24px;
  border: 1px solid ${(props) => props.theme.borderColor};
  padding: 28px 24px;
  box-shadow: ${(props) => props.theme.cardShadow};
  display: flex;
  flex-direction: column;
  gap: 18px;

  @media (max-width: 600px) {
    padding: 24px 20px;
  }
`;

const DonationSectionTitle = styled.h3`
  font-family: 'Playfair Display', serif;
  font-size: 22px;
  margin: 0;
  color: ${(props) => props.theme.color};
`;

const DonationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Donation = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 14px;
  background: ${(props) => props.theme.bgSubDiv};
  border: 1px solid ${(props) => props.theme.borderColor};

  @media (max-width: 520px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
`;

const DonationMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const DonationPill = styled.span`
  padding: 6px 12px;
  border-radius: 999px;
  background: ${(props) => props.theme.primaryColor}10;
  color: ${(props) => props.theme.primaryColor};
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const DonationDate = styled.span`
  font-size: 12px;
  color: ${(props) => props.theme.textSecondary};
`;

const DonationAmount = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: ${(props) => props.theme.color};
`;

const EmptyState = styled.div`
  padding: 18px;
  border-radius: 12px;
  background: ${(props) => props.theme.bgSubDiv};
  border: 1px dashed ${(props) => props.theme.borderColor};
  color: ${(props) => props.theme.textSecondary};
  font-size: 14px;
  text-align: center;
`;