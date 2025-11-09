import styled from 'styled-components';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import PaidIcon from '@mui/icons-material/Paid';
import EventIcon from '@mui/icons-material/Event';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Image from 'next/image';
import { ethers } from 'ethers';
import CampaignFactory from '../artifacts/contracts/Campaign.sol/CampaignFactory.json'
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { TailSpin } from 'react-loader-spinner';
import { toast } from 'react-toastify';

const ipfsGateway = (process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/').replace(/\/?$/, '/');

export default function Dashboard() {
  const [campaignsData, setCampaignsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const Request = async () => {
      try {
        setLoading(true);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const Web3provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = Web3provider.getSigner();
        const Address = await signer.getAddress();

        const provider = new ethers.providers.JsonRpcProvider(
          process.env.NEXT_PUBLIC_RPC_URL || 'http://127.0.0.1:8545'
        );
    
        const contract = new ethers.Contract(
          process.env.NEXT_PUBLIC_ADDRESS,
          CampaignFactory.abi,
          provider
        );
    
        const getAllCampaigns = contract.filters.campaignCreated(null, null, Address);
        const AllCampaigns = await contract.queryFilter(getAllCampaigns);
        const AllData = AllCampaigns.map((e) => {
        return {
          title: e.args.title,
          image: e.args.imgURI,
          owner: e.args.owner,
          timeStamp: parseInt(e.args.timestamp),
          amount: ethers.utils.formatEther(e.args.requiredAmount),
          address: e.args.campaignAddress
        }
        })  
        setCampaignsData(AllData);
        setLoading(false);
      } catch (err) {
        console.error('Error loading campaigns:', err);
        setError(err.message);
        setLoading(false);
        toast.error('Failed to load your campaigns. Please connect your wallet.');
      }
    }
    Request();
  }, [])

  return (
    <HomeWrapper>
      <DashboardHeader>
        <HeaderContent>
          <HeaderBadge>
            <DashboardIcon />
            My Dashboard
          </HeaderBadge>
          <HeaderTitle>Your campaigns</HeaderTitle>
          <HeaderSubtitle>
            Manage and track all campaigns you've created
          </HeaderSubtitle>
        </HeaderContent>
        <StatsCard>
          <StatItem>
            <StatNumber>{campaignsData.length}</StatNumber>
            <StatLabel>Total campaigns</StatLabel>
          </StatItem>
        </StatsCard>
      </DashboardHeader>

      {loading ? (
        <LoadingWrapper>
          <TailSpin height={60} color="#2f6fed" />
          <LoadingText>Loading your campaigns...</LoadingText>
        </LoadingWrapper>
      ) : error ? (
        <EmptyState>
          <EmptyIcon>⚠️</EmptyIcon>
          <EmptyTitle>Unable to load campaigns</EmptyTitle>
          <EmptyText>{error}</EmptyText>
        </EmptyState>
      ) : campaignsData.length === 0 ? (
        <EmptyState>
          <EmptyIcon>📋</EmptyIcon>
          <EmptyTitle>No campaigns yet</EmptyTitle>
          <EmptyText>You haven't created any campaigns. Start your first campaign to see it here.</EmptyText>
          <Link passHref href="/createcampaign">
            <CreateButton>Create Campaign</CreateButton>
          </Link>
        </EmptyState>
      ) : (
        <CardsWrapper>
          {campaignsData.map((e) => {
            return (
              <Card key={e.address}>
                <CardImg>
                  <Image 
                    alt={`${e.title} campaign visual`}
                    layout='fill' 
                    src={`${ipfsGateway}${e.image}`} 
                  />
                </CardImg>
                <CardBody>
                  <Title>{e.title}</Title>
                  <CardMeta>
                    <MetaItem>
                      <MetaIcon>
                        <AccountBoxIcon />
                      </MetaIcon>
                      <MetaLabel>Owner</MetaLabel>
                      <MetaValue>{e.owner.slice(0,6)}...{e.owner.slice(39)}</MetaValue>
                    </MetaItem>
                    <MetaItem>
                      <MetaIcon>
                        <PaidIcon />
                      </MetaIcon>
                      <MetaLabel>Required</MetaLabel>
                      <MetaValue>{e.amount} Matic</MetaValue>
                    </MetaItem>
                    <MetaItem>
                      <MetaIcon>
                        <EventIcon />
                      </MetaIcon>
                      <MetaLabel>Created</MetaLabel>
                      <MetaValue>{new Date(e.timeStamp * 1000).toLocaleDateString()}</MetaValue>
                    </MetaItem>
                  </CardMeta>
                </CardBody>
                <Link passHref href={'/' + e.address}>
                  <Button>View Campaign</Button>
                </Link>
              </Card>
            )
          })}
        </CardsWrapper>
      )}
    </HomeWrapper>
  )
}



const HomeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 32px 24px 64px;
  gap: 32px;

  @media (max-width: 768px) {
    padding: 24px 16px 48px;
  }
`

const DashboardHeader = styled.div`
  width: min(1120px, 100%);
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 32px;
  align-items: center;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`

const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const HeaderBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  align-self: flex-start;
  padding: 8px 14px;
  background: ${(props) => props.theme.badgeBg};
  color: ${(props) => props.theme.badgeColor};
  border-radius: 999px;
  font-size: 13px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 600;
`

const HeaderTitle = styled.h1`
  font-size: clamp(32px, 4vw, 42px);
  font-family: 'Playfair Display', serif;
  color: ${(props) => props.theme.color};
  margin: 0;
`

const HeaderSubtitle = styled.p`
  font-size: 16px;
  line-height: 1.6;
  color: ${(props) => props.theme.textSecondary};
  margin: 0;
`

const StatsCard = styled.div`
  background: ${(props) => props.theme.glassBg};
  border: 1px solid ${(props) => props.theme.glassBorder};
  border-radius: 20px;
  padding: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: ${(props) => props.theme.cardShadow};
`

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: center;
`

const StatNumber = styled.span`
  font-size: 48px;
  font-weight: 700;
  color: ${(props) => props.theme.primaryColor};
`

const StatLabel = styled.span`
  font-size: 14px;
  color: ${(props) => props.theme.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.08em;
`

const LoadingWrapper = styled.div`
  width: min(1120px, 100%);
  min-height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  background: ${(props) => props.theme.bgDiv};
  border-radius: 24px;
  border: 1px solid ${(props) => props.theme.borderColor};
  box-shadow: ${(props) => props.theme.cardShadow};
`

const LoadingText = styled.p`
  font-size: 16px;
  color: ${(props) => props.theme.textSecondary};
  margin: 0;
`

const EmptyState = styled.div`
  width: min(1120px, 100%);
  min-height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
  background: ${(props) => props.theme.bgDiv};
  border-radius: 24px;
  border: 1px dashed ${(props) => props.theme.borderColor};
  box-shadow: ${(props) => props.theme.cardShadow};
  padding: 48px 32px;
  text-align: center;
`

const EmptyIcon = styled.div`
  font-size: 64px;
  opacity: 0.6;
`

const EmptyTitle = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: 28px;
  color: ${(props) => props.theme.color};
  margin: 0;
`

const EmptyText = styled.p`
  font-size: 16px;
  color: ${(props) => props.theme.textSecondary};
  margin: 0;
  max-width: 480px;
`

const CreateButton = styled.button`
  padding: 14px 24px;
  margin-top: 16px;
  background: linear-gradient(120deg, ${(props) => props.theme.primaryColor}, ${(props) => props.theme.accentColor});
  border: none;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  text-transform: uppercase;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  border-radius: 12px;
  letter-spacing: 0.12em;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${(props) => props.theme.cardHoverShadow};
  }
`

const CardsWrapper = styled.div`
  width: min(1120px, 100%);
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 28px;
`

const Card = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.bgDiv};
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid ${(props) => props.theme.borderColor};
  box-shadow: ${(props) => props.theme.cardShadow};
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-8px);
    box-shadow: ${(props) => props.theme.cardHoverShadow};
  }
`

const CardImg = styled.div`
  position: relative;
  height: 180px;
  width: 100%;
`

const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px 22px;
`

const Title = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: 20px;
  color: ${(props) => props.theme.color};
  margin: 0;
`

const CardMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const MetaItem = styled.div`
  display: grid;
  grid-template-columns: auto auto 1fr;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-radius: 12px;
  background: ${(props) => props.theme.bgSubDiv};
  border: 1px solid ${(props) => props.theme.borderColor};
`

const MetaIcon = styled.span`
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: ${(props) => props.theme.primaryColor}12;
  color: ${(props) => props.theme.primaryColor};
`

const MetaLabel = styled.span`
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${(props) => props.theme.textSecondary};
`

const MetaValue = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: ${(props) => props.theme.color};
  justify-self: flex-start;
`

const Button = styled.button`
  padding: 14px 18px;
  text-align: center;
  width: calc(100% - 44px);
  margin: 0 auto 22px;
  background: linear-gradient(120deg, ${(props) => props.theme.primaryColor}, ${(props) => props.theme.accentColor});
  border: none;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  text-transform: uppercase;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  border-radius: 12px;
  letter-spacing: 0.12em;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${(props) => props.theme.cardHoverShadow};
  }
`